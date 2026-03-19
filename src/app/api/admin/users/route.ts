import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

// GET: list all users (admin only)
export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

    const adminUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
    })
    if (adminUser?.role !== "ADMIN") return NextResponse.json({ error: "Acesso negado" }, { status: 403 })

    const users = await prisma.user.findMany({
        // @ts-ignore
        select: { id: true, name: true, email: true, accountStatus: true, createdAt: true, subscriptionStatus: true },
        orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(users)
}

// PATCH: approve or reject a user (admin only)
export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

    const adminUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
    })
    if (adminUser?.role !== "ADMIN") return NextResponse.json({ error: "Acesso negado" }, { status: 403 })

    const { userId, action } = await req.json() // action: "APPROVE" | "REJECT"
    if (!userId || !["APPROVE", "REJECT"].includes(action)) {
        return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
    }

    const newStatus = action === "APPROVE" ? "APPROVED" : "REJECTED"
    await prisma.user.update({
        where: { id: userId },
        data: {
            // @ts-ignore
            accountStatus: newStatus
        }
    })

    return NextResponse.json({ success: true, status: newStatus })
}
