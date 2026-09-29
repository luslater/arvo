import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // In production, block mock self-upgrades unless invoked by an ADMIN for testing
    if (process.env.NODE_ENV === "production") {
        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { role: true }
        })
        if (currentUser?.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Simulação de pagamento desativada em ambiente de produção. Utilize o fluxo de pagamento oficial." },
                { status: 403 }
            )
        }
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

