import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email e senha são obrigatórios" },
                { status: 400 }
            )
        }

        const existingUser = await prisma.user.findUnique({ where: { email } })

        if (existingUser) {
            return NextResponse.json(
                { message: "Usuário já existe com este email" },
                { status: 409 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user with PENDING status — requires admin approval
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                // @ts-ignore — field added via schema migration
                accountStatus: "PENDING",
            },
        })

        const { password: _, ...userWithoutPassword } = user

        return NextResponse.json(
            { message: "Cadastro recebido! Aguardando aprovação.", user: userWithoutPassword },
            { status: 201 }
        )
    } catch (error: any) {
        console.error("Registration error:", error)
        return NextResponse.json(
            { message: "Erro ao criar usuário", error: error?.message || String(error), code: error?.code },
            { status: 500 }
        )
    }
}
