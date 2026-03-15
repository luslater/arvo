import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                profile: true,
                assets: true,
            }
        })

        if (!user) {
            return new NextResponse("User not found", { status: 404 })
        }

        // If user doesn't have a profile yet, initialize one
        let currentProfile = user.profile
        if (!currentProfile) {
            currentProfile = await prisma.profile.create({
                data: {
                    userId: user.id,
                    portfolioType: "ABRIGO",
                    saldo: 0,
                    emergencyFund: 0,
                    totalCarteira: 0
                }
            })
        }

        // Map backend Asset to frontend UserAsset shape
        const formattedAssets = user.assets.map(asset => ({
            id: asset.id,
            type: asset.ticker, // map DB ticker to UI type
            name: asset.name,
            value: asset.value,
            quantity: asset.quantity,
            category: asset.category,
            indexador: "Prefixado",
            rentabilidade: 0,
            prazo: "Indeterminado"
        }))

        return NextResponse.json({ ...currentProfile, assets: formattedAssets })
    } catch (error) {
        console.error("Error fetching user profile:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { portfolioType, saldo, emergencyFund, totalCarteira } = body

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return new NextResponse("User not found", { status: 404 })
        }

        // Upsert Profile
        const profile = await prisma.profile.upsert({
            where: {
                userId: user.id
            },
            update: {
                ...(portfolioType !== undefined && { portfolioType }),
                ...(saldo !== undefined && { saldo }),
                ...(emergencyFund !== undefined && { emergencyFund }),
                ...(totalCarteira !== undefined && { totalCarteira })
            },
            create: {
                userId: user.id,
                portfolioType: portfolioType || "ABRIGO",
                saldo: saldo || 0,
                emergencyFund: emergencyFund || 0,
                totalCarteira: totalCarteira || 0
            }
        })

        return NextResponse.json(profile)
    } catch (error) {
        console.error("Error updating user profile:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
