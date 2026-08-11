import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
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

            // Calculate total AUM from carteira2Data or assets
            let totalAum = 0;
            if (carteira2Data && carteira2Data.assets && Array.isArray(carteira2Data.assets)) {
                totalAum = carteira2Data.assets.reduce((sum: number, a: any) => sum + (parseFloat(a.value) || 0), 0);
            } else if (u.assets && u.assets.length > 0) {
                totalAum = u.assets.reduce((sum: number, a: any) => sum + (parseFloat(a.value) || 0), 0);
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
