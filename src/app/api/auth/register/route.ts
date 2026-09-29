import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import { sendNewUserNotification, sendRegistrationPendingEmail } from "@/lib/email"
import { z } from "zod"
import { rateLimit, getClientIp } from "@/lib/rate-limit"

const registerSchema = z.object({
    name: z.string().trim().min(2, "Nome deve ter no mínimo 2 caracteres").max(100),
    email: z.string().trim().toLowerCase().email("E-mail inválido").max(254),
    password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres").max(128),
    cpf: z.string().trim().max(20).optional().nullable(),
    phone: z.string().trim().max(25).optional().nullable(),
})

export async function POST(req: Request) {
    try {
        const ip = getClientIp(req)
        const rl = rateLimit("auth:register", ip, 5, 15 * 60 * 1000)
        if (!rl.success) {
            return NextResponse.json(
                { message: "Muitas tentativas de cadastro a partir deste dispositivo. Tente novamente em 15 minutos." },
                { status: 429, headers: { "Retry-After": "900" } }
            )
        }

        let body: any
        try {
            body = await req.json()
        } catch {
            return NextResponse.json({ message: "Payload inválido" }, { status: 400 })
        }

        const parseResult = registerSchema.safeParse(body)
        if (!parseResult.success) {
            return NextResponse.json(
                { message: parseResult.error.issues[0]?.message || "Dados de cadastro inválidos" },
                { status: 400 }
            )
        }

        const { name, email, password, cpf, phone } = parseResult.data

        const existingUser = await prisma.user.findUnique({ where: { email } })

        if (existingUser) {
            return NextResponse.json(
                { message: "Já existe uma conta registrada com este e-mail." },
                { status: 409 }
            )
        }


        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user with PENDING status and CPF/phone
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                // @ts-ignore — fields added via schema migration
                accountStatus: "PENDING",
                cpf: cpf || null,
                phone: phone || null,
            },
        })

        // Notify admin with all info — fire and forget
        sendNewUserNotification({
            name: user.name,
            email: user.email!,
            // @ts-ignore
            cpf: user.cpf,
            // @ts-ignore
            phone: user.phone,
            registeredAt: user.createdAt,
        }).catch(err => console.error("Admin email failed:", err))

        // Confirm to the user that their registration is under review
        sendRegistrationPendingEmail({
            name: user.name,
            email: user.email!,
        }).catch(err => console.error("Pending email failed:", err))

        const { password: _, ...userWithoutPassword } = user

        return NextResponse.json(
            { message: "Cadastro recebido! Aguardando aprovação.", user: userWithoutPassword },
            { status: 201 }
        )
    } catch (error: any) {
        // Log completo fica só no servidor — não expor detalhes internos (stack, mensagem do Prisma/DB) ao cliente.
        console.error("Registration error:", error)
        return NextResponse.json(
            { message: "Erro ao criar usuário. Tente novamente em instantes." },
            { status: 500 }
        )
    }
}
