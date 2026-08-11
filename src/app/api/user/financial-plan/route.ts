import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const url = new URL(req.url)
        const adminViewUser = url.searchParams.get("adminViewUser")

        let targetUserId = session.user.id
        if (adminViewUser) {
            const currentUser = await prisma.user.findUnique({ where: { id: session.user.id } })
            if (currentUser?.role === "ADMIN") {
                targetUserId = adminViewUser
            }
        }

        const user = await prisma.user.findUnique({
            where: { id: targetUserId },
            include: {
                financialPlan: true,
                profile: true
            }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        return NextResponse.json({
            ...(user.financialPlan || {}),
            // also expose profile data for convenience
            riskProfile: user.profile?.portfolioType ?? null,
        })
    } catch (error) {
        console.error("Error fetching financial plan:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { desiredLifestyleCost, monthlyContribution, investmentPeriod, expectedReturn, currentCapital } = body

        // Validate basic types
        if (
            typeof desiredLifestyleCost !== "number" ||
            typeof monthlyContribution !== "number" ||
            typeof investmentPeriod !== "number" ||
            typeof expectedReturn !== "number"
        ) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 })
        }

        const url = new URL(req.url)
        const adminViewUser = url.searchParams.get("adminViewUser")

        let targetUserId = session.user.id
        if (adminViewUser) {
            const currentUser = await prisma.user.findUnique({ where: { id: session.user.id } })
            if (currentUser?.role === "ADMIN") {
                targetUserId = adminViewUser
            }
        }

        const plan = await prisma.financialPlan.upsert({
            where: {
                userId: targetUserId
            },
            update: {
                desiredLifestyleCost,
                monthlyContribution,
                investmentPeriod,
                expectedReturn,
                ...(currentCapital !== undefined && { currentCapital } as any)
            },
            create: {
                userId: targetUserId,
                desiredLifestyleCost,
                monthlyContribution,
                investmentPeriod,
                expectedReturn,
                ...(currentCapital !== undefined && { currentCapital } as any)
            }
        })

        return NextResponse.json(plan)
    } catch (error) {
        console.error("Error updating financial plan:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
