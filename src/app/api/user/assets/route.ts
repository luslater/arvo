import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { id, type, value, quantity, name, category, ticker, action } = body

        // If action is DELETE
        if (action === "DELETE") {
            if (!id) {
                return new NextResponse("Asset ID required for deletion", { status: 400 })
            }

            // Verify ownership
            const asset = await prisma.asset.findUnique({ where: { id } })
            if (!asset || asset.userId !== session.user.id) {
                return new NextResponse("Asset not found or unauthorized", { status: 404 })
            }

            await prisma.asset.delete({ where: { id } })
            return new NextResponse("Deleted", { status: 200 })
        }

        // Action is UPSERT/CREATE
        if (!type || value === undefined) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        // Map 'type' to 'ticker' for the DB
        const dbTicker = type || ticker || "outro"
        const dbCategory = category || "outros"

        if (id) {
            // Verify ownership
            const existingAsset = await prisma.asset.findUnique({ where: { id } })
            if (!existingAsset || existingAsset.userId !== session.user.id) {
                return new NextResponse("Asset not found or unauthorized", { status: 404 })
            }
            // Update
            const updatedAsset = await prisma.asset.update({
                where: { id },
                data: {
                    ticker: dbTicker,
                    value,
                    quantity: quantity || 1,
                    name: name || "Ativo",
                    category: dbCategory
                }
            })
            return NextResponse.json(updatedAsset)
        } else {
            // Create
            const newAsset = await prisma.asset.create({
                data: {
                    userId: session.user.id,
                    ticker: dbTicker,
                    value,
                    quantity: quantity || 1,
                    name: name || "Ativo",
                    category: dbCategory
                }
            })
            return NextResponse.json(newAsset)
        }

    } catch (error) {
        console.error("Error managing user assets:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
