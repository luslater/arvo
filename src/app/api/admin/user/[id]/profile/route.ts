import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

async function isAdmin(session: any) {
    if (!session?.user?.email) return false;
    const currentUser = await prisma.user.findUnique({ where: { email: session.user.email } });
    return currentUser?.role === "ADMIN";
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions)
        if (!(await isAdmin(session))) {
            return new NextResponse("Forbidden - Requires Admin", { status: 403 })
        }

        const user = await prisma.user.findUnique({
            where: { id },
            include: { profile: true, assets: true }
        })

        if (!user) return new NextResponse("User not found", { status: 404 })

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

        const formattedAssets = user.assets.map(asset => ({
            id: asset.id,
            type: asset.ticker,
            name: asset.name,
            value: asset.value,
            quantity: asset.quantity,
            category: asset.category,
            indexador: "Prefixado",
            rentabilidade: 0,
            prazo: "Indeterminado"
        }))

        return NextResponse.json({ ...currentProfile, assets: formattedAssets, userEmail: user.email, userName: user.name })
    } catch (error: any) {
        console.error("Error fetching user profile for admin:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions)
        if (!(await isAdmin(session))) {
            return new NextResponse("Forbidden - Requires Admin", { status: 403 })
        }

        const body = await req.json()
        const { portfolioType, saldo, emergencyFund, totalCarteira, carteira2Data } = body

        const user = await prisma.user.findUnique({
            where: { id },
            include: { profile: true }
        })

        if (!user) return new NextResponse("User not found", { status: 404 })

        let newJornadaData = user.profile?.jornadaData ? (typeof user.profile.jornadaData === 'string' ? JSON.parse(user.profile.jornadaData) : user.profile.jornadaData) : {};
        if (carteira2Data) {
            newJornadaData = { ...newJornadaData, carteira2Data };
        }

        const profile = await prisma.profile.upsert({
            where: { userId: user.id },
            update: {
                ...(portfolioType !== undefined && { portfolioType }),
                ...(saldo !== undefined && { saldo }),
                ...(emergencyFund !== undefined && { emergencyFund }),
                ...(totalCarteira !== undefined && { totalCarteira }),
                ...(carteira2Data !== undefined && { jornadaData: newJornadaData })
            },
            create: {
                userId: user.id,
                portfolioType: (portfolioType === "VANGUARDA" || portfolioType === "VISAO") ? "VISÃO" : (portfolioType || "ABRIGO"),
                saldo: saldo || 0,
                emergencyFund: emergencyFund || 0,
                totalCarteira: totalCarteira || 0,
                jornadaData: carteira2Data ? { carteira2Data } : {}
            }
        })

        return NextResponse.json(profile)
    } catch (error) {
        console.error("Error updating user profile for admin:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
