import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        // Require ADMIN role
        if (!currentUser || currentUser.role !== "ADMIN") {
            return new NextResponse("Forbidden - Requires Admin", { status: 403 })
        }

        const users = await prisma.user.findMany({
            include: {
                profile: true,
                assets: true,
                financialPlan: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        // Parse and calculate AUM for each user
        const formattedUsers = users.map(u => {
            let carteira2Data = null;
            if (u.profile?.jornadaData) {
                try {
                    const parsed = typeof u.profile.jornadaData === 'string' ? JSON.parse(u.profile.jornadaData) : u.profile.jornadaData;
                    if (parsed && parsed.carteira2Data) {
                        carteira2Data = parsed.carteira2Data;
                    }
                } catch (e) {}
            }

            // Calculate total AUM primarily from profile.totalCarteira
            let totalAum = u.profile?.totalCarteira || 0;
            
            // If totalCarteira is 0, try to calculate from assets
            if (totalAum === 0) {
                if (carteira2Data && carteira2Data.assets && Array.isArray(carteira2Data.assets)) {
                    totalAum = carteira2Data.assets.reduce((sum: number, a: any) => sum + (parseFloat(a.value) || 0), 0);
                } else if (u.assets && u.assets.length > 0) {
                    totalAum = u.assets.reduce((sum: number, a: any) => sum + (parseFloat(a.value) || 0), 0);
                }
            }

            return {
                id: u.id,
                name: u.name,
                email: u.email,
                role: u.role,
                status: u.accountStatus,
                subscription: u.subscriptionStatus,
                createdAt: u.createdAt,
                profileType: carteira2Data?.profileName || u.profile?.portfolioType || "N/A",
                aum: totalAum,
                assetsCount: carteira2Data?.assets?.length || u.assets?.length || 0,
                hasFinancialPlan: !!u.financialPlan
            }
        })

        return NextResponse.json(formattedUsers)
    } catch (error: any) {
        console.error("Error fetching admin users:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

import { sendRegistrationApprovedEmail, sendRegistrationRejectedEmail } from "@/lib/email"

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!currentUser || currentUser.role !== "ADMIN") {
            return new NextResponse("Forbidden - Requires Admin", { status: 403 })
        }

        const body = await req.json()
        const userId = body.userId || body.id
        const action = body.action
        let status = body.status

        if (action === "APPROVE") status = "APPROVED"
        else if (action === "REJECT") status = "REJECTED"
        else if (action === "REVOKE" || action === "PENDING") status = "PENDING"

        if (!userId || !["APPROVED", "REJECTED", "PENDING"].includes(status)) {
            return new NextResponse("Invalid payload", { status: 400 })
        }

        const targetUser = await prisma.user.findUnique({ where: { id: userId } })
        if (!targetUser) {
            return new NextResponse("User not found", { status: 404 })
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { accountStatus: status }
        })

        // Notify user via email
        if (status === "APPROVED" && targetUser.email) {
            sendRegistrationApprovedEmail({ name: targetUser.name, email: targetUser.email }).catch(console.error)
        } else if (status === "REJECTED" && targetUser.email) {
            sendRegistrationRejectedEmail({ name: targetUser.name, email: targetUser.email }).catch(console.error)
        }

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error("Error updating user status via admin:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

