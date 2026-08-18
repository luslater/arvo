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

        let planData = user.financialPlan ? { ...user.financialPlan } : null

        if (user.profile?.jornadaData) {
            try {
                const { extractMetricsFromJornada } = await import("@/lib/jornada-sync")
                const jData = typeof user.profile.jornadaData === "string"
                    ? JSON.parse(user.profile.jornadaData)
                    : user.profile.jornadaData
                const metrics = extractMetricsFromJornada(jData)
                if (metrics) {
                    if (!planData) {
                        planData = {
                            id: "synced-jornada",
                            userId: user.id,
                            monthlyContribution: metrics.aporteMensal,
                            expectedReturn: metrics.expectedReturn,
                            desiredLifestyleCost: metrics.desiredLifestyleCost,
                            investmentPeriod: metrics.investmentPeriod,
                            currentCapital: metrics.totalPatrimonio,
                            createdAt: new Date(),
                            updatedAt: new Date()
                        } as any
                    } else {
                        if (!planData.monthlyContribution || planData.monthlyContribution === 0) {
                            planData.monthlyContribution = metrics.aporteMensal
                        }
                        if (!planData.expectedReturn || planData.expectedReturn === 0) {
                            planData.expectedReturn = metrics.expectedReturn
                        }
                        if (!planData.desiredLifestyleCost || planData.desiredLifestyleCost === 0) {
                            planData.desiredLifestyleCost = metrics.desiredLifestyleCost
                        }
                        if (!planData.investmentPeriod || planData.investmentPeriod === 0) {
                            planData.investmentPeriod = metrics.investmentPeriod
                        }
                        if (!planData.currentCapital || planData.currentCapital === 0) {
                            planData.currentCapital = metrics.totalPatrimonio
                        }
                    }
                }
            } catch (e) {
                console.error("Error parsing jornadaData in financialPlan GET:", e)
            }
        }

        return NextResponse.json({
            ...(planData || {}),
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
