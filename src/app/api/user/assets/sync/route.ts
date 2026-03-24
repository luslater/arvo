import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { ASSET_TYPES } from "@/lib/asset-types"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const userId = session.user.id as string

        const body = await req.json()
        const { assets } = body

        if (!Array.isArray(assets)) {
            return new NextResponse("Invalid payload format", { status: 400 })
        }

        // Delete all old assets and recreate them with the new fields
        await prisma.$transaction([
            prisma.asset.deleteMany({
                where: { userId }
            }),
            prisma.asset.createMany({
                data: assets.map((a: any) => ({
                    userId,
                    ticker: a.type || a.ticker || "outro",
                    value: a.value || 0,
                    quantity: a.quantity || 1,
                    name: a.name || "Ativo",
                    category: ASSET_TYPES.find(t => t.id === a.type)?.category || "outros",
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
