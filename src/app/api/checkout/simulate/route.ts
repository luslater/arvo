import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    try {
        await prisma.user.update({
            where: { email: session.user.email },
            data: { subscriptionStatus: "PREMIUM" }
        })

        return NextResponse.json({ success: true, message: "Assinatura ativada com sucesso" })
    } catch (e) {
        console.error("Erro ao processar upgrade simulado:", e)
        return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 })
    }
}
