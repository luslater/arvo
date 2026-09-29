import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/prisma"
import { ASSET_TYPES } from "@/lib/asset-types"
import { z } from "zod"

const assetSyncItemSchema = z.object({
    type: z.string().max(100).optional().nullable(),
    ticker: z.string().max(100).optional().nullable(),
    value: z.number().finite().min(0).max(1e12).default(0),
    quantity: z.number().finite().min(0).max(1e9).default(1),
    name: z.string().max(200).optional().nullable(),
    category: z.string().max(100).optional().nullable(),
    indexador: z.string().max(100).optional().nullable(),
    rentabilidade: z.number().finite().min(-100).max(1000).optional().nullable(),
    prazo: z.string().max(100).optional().nullable(),
})

const syncPayloadSchema = z.object({
    assets: z.array(assetSyncItemSchema).max(500, "Limite de ativos excedido (máximo 500)"),
})

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const userId = session.user.id as string

        let body: any
        try {
            body = await req.json()
        } catch {
            return new NextResponse("Invalid JSON format", { status: 400 })
        }

        const parsed = syncPayloadSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid payload format", details: parsed.error.issues }, { status: 400 })
        }

        const { assets } = parsed.data

        // Delete all old assets and recreate them with the new fields
        await prisma.$transaction([
            prisma.asset.deleteMany({
                where: { userId }
            }),
            prisma.asset.createMany({
                data: assets.map((a) => ({
                    userId,
                    ticker: a.type || a.ticker || "outro",
                    value: a.value || 0,
                    quantity: a.quantity || 1,
                    name: a.name || "Ativo",
                    category: (a.type && ASSET_TYPES.find(t => t.id === a.type)?.category) || a.category || "outros",
                    indexador: a.indexador || "Pós-fixado",
                    rentabilidade: a.rentabilidade || 0,
                    prazo: a.prazo || ""
                }))
            })
        ])

        return new NextResponse("Synced successfully", { status: 200 })


    } catch (error) {
        console.error("Error bulk syncing assets:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
