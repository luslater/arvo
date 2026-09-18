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

        const url = new URL(req.url)
        const adminViewUser = url.searchParams.get("adminViewUser")

        let targetEmail = session.user.email
        if (adminViewUser) {
            const currentUser = await prisma.user.findUnique({ where: { email: session.user.email } })
            if (currentUser?.role === "ADMIN") {
                const targetUser = await prisma.user.findUnique({ where: { id: adminViewUser } })
                if (targetUser?.email) {
                    targetEmail = targetUser.email
                }
            }
        }

        const user = await prisma.user.findUnique({
            where: { email: targetEmail },
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

        // Hotfix: Translate legacy database "VANGUARDA" or unaccented "VISAO" to "VISÃO"
        if (currentProfile.portfolioType === "VANGUARDA" || currentProfile.portfolioType === "VISAO") {
            currentProfile.portfolioType = "VISÃO"
        }

        // Sync from jornadaData only if portfolioType is not yet set
        if (currentProfile.jornadaData && !currentProfile.portfolioType) {
            try {
                const { extractMetricsFromJornada } = await import("@/lib/jornada-sync")
                const jData = typeof currentProfile.jornadaData === "string" 
                    ? JSON.parse(currentProfile.jornadaData) 
                    : currentProfile.jornadaData
                const metrics = extractMetricsFromJornada(jData)
                if (metrics?.profile) {
                    currentProfile.portfolioType = metrics.profile
                }
            } catch (e) {
                console.error("Error parsing jornadaData in profile GET:", e)
            }
        }

        return NextResponse.json({ ...currentProfile, assets: formattedAssets })
    } catch (error: any) {
        console.error("Error fetching user profile:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

import { z } from "zod";

const profileSchema = z.object({
  portfolioType: z.enum(["ABRIGO", "RITMO", "VANGUARDA", "VISAO", "VISÃO", "OCEANO"]).optional(),
  saldo: z.number().min(0).optional(),
  emergencyFund: z.number().min(0).optional(),
  totalCarteira: z.number().min(0).optional(),
  carteira2Data: z.any().optional(),
  inflacaoRealData: z.any().optional(),
  inflacaoRealDataV2: z.any().optional(),
});

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        
        // Validação estrita de entrada usando Zod
        const validationResult = profileSchema.safeParse(body)
        if (!validationResult.success) {
            return new NextResponse("Bad Request: Payload inválido", { status: 400 })
        }
        
        const { portfolioType, saldo, emergencyFund, totalCarteira, carteira2Data, inflacaoRealData, inflacaoRealDataV2 } = validationResult.data

        const url = new URL(req.url)
        const adminViewUser = url.searchParams.get("adminViewUser")

        let targetEmail = session.user.email
        if (adminViewUser) {
            const currentUser = await prisma.user.findUnique({ where: { email: session.user.email } })
            if (currentUser?.role === "ADMIN") {
                const targetUser = await prisma.user.findUnique({ where: { id: adminViewUser } })
                if (targetUser?.email) {
                    targetEmail = targetUser.email
                }
            }
        }

        const user = await prisma.user.findUnique({
            where: { email: targetEmail },
            include: { profile: true }
        })

        if (!user) {
            return new NextResponse("User not found", { status: 404 })
        }
        
        let newJornadaData = user.profile?.jornadaData ? (typeof user.profile.jornadaData === 'string' ? JSON.parse(user.profile.jornadaData) : user.profile.jornadaData) : {};
        if (carteira2Data !== undefined) {
            if (carteira2Data === null) {
                delete newJornadaData.carteira2Data;
            } else {
                newJornadaData = { ...newJornadaData, carteira2Data };
            }
        }
        if (inflacaoRealData !== undefined) {
            if (inflacaoRealData === null) {
                delete newJornadaData.inflacaoRealData;
            } else {
                newJornadaData = { ...newJornadaData, inflacaoRealData };
            }
        }
        if (inflacaoRealDataV2 !== undefined) {
            if (inflacaoRealDataV2 === null) {
                delete newJornadaData.inflacaoRealDataV2;
            } else {
                newJornadaData = { ...newJornadaData, inflacaoRealDataV2 };
            }
        }

        const hasJornadaUpdate = carteira2Data !== undefined || inflacaoRealData !== undefined || inflacaoRealDataV2 !== undefined;

        // Upsert Profile
        const profile = await prisma.profile.upsert({
            where: {
                userId: user.id
            },
            update: {
                ...(portfolioType !== undefined && { portfolioType }),
                ...(saldo !== undefined && { saldo }),
                ...(emergencyFund !== undefined && { emergencyFund }),
                ...(totalCarteira !== undefined && { totalCarteira }),
                ...(hasJornadaUpdate && { jornadaData: newJornadaData })
            },
            create: {
                userId: user.id,
                portfolioType: (portfolioType === "VANGUARDA" || portfolioType === "VISAO") ? "VISÃO" : (portfolioType || "ABRIGO"),
                saldo: saldo ?? 0,
                emergencyFund: emergencyFund ?? 0,
                totalCarteira: totalCarteira ?? 0,
                jornadaData: newJornadaData
            }
        })

        return NextResponse.json(profile)
    } catch (error) {
        console.error("Error updating user profile:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
