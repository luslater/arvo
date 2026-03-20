import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { sendRegistrationApprovedEmail, sendRegistrationRejectedEmail } from "@/lib/email"

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
        select: { id: true, name: true, email: true, cpf: true, phone: true, accountStatus: true, createdAt: true, subscriptionStatus: true },
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
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            // @ts-ignore
            accountStatus: newStatus
        },
        select: { name: true, email: true }
    })

    // Send status email to the user — fire and forget
    if (updatedUser.email) {
        const emailFn = action === "APPROVE" ? sendRegistrationApprovedEmail : sendRegistrationRejectedEmail
        emailFn({ name: updatedUser.name, email: updatedUser.email })
            .catch(err => console.error("Status email failed:", err))
    }

    return NextResponse.json({ success: true, status: newStatus })
}
