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
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                financialPlan: true,
                profile: true
            }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        return NextResponse.json({
            plan: user.financialPlan || null,
            profile: user.profile || null,
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
        const { desiredLifestyleCost, monthlyContribution, investmentPeriod, expectedReturn } = body

        // Validate basic types
        if (
            typeof desiredLifestyleCost !== "number" ||
            typeof monthlyContribution !== "number" ||
            typeof investmentPeriod !== "number" ||
            typeof expectedReturn !== "number"
        ) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 })
        }

        const plan = await prisma.financialPlan.upsert({
            where: {
                userId: session.user.id
            },
            update: {
                desiredLifestyleCost,
                monthlyContribution,
                investmentPeriod,
                expectedReturn
            },
            create: {
                userId: session.user.id,
                desiredLifestyleCost,
                monthlyContribution,
                investmentPeriod,
                expectedReturn
            }
        })

        return NextResponse.json(plan)
    } catch (error) {
        console.error("Error updating financial plan:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
