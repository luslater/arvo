import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { jwtVerify } from 'jose'
import bcrypt from 'bcrypt'

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json()
        if (!token || !password) {
            return NextResponse.json({ error: 'Token e nova senha são obrigatórios' }, { status: 400 })
        }

        if (typeof password !== 'string' || password.length < 6) {
            return NextResponse.json({ error: 'A senha deve ter no mínimo 6 caracteres.' }, { status: 400 })
        }

        if (!process.env.NEXTAUTH_SECRET) {
            console.error('NEXTAUTH_SECRET não configurado — recusando validar token de reset de senha.')
            return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
        }
        const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET)

        let payload;
        try {
            const result = await jwtVerify(token, secret)
            payload = result.payload
        } catch (err) {
            return NextResponse.json({ error: 'Token inválido ou expirado' }, { status: 400 })
        }

        if (payload.purpose !== 'reset_password' || !payload.email) {
            return NextResponse.json({ error: 'Token inválido para esta operação' }, { status: 400 })
        }

        const email = payload.email as string

        const existingUsedToken = await prisma.usedToken.findUnique({
            where: { token }
        })
        
        if (existingUsedToken) {
            return NextResponse.json({ error: 'Este link de redefinição de senha já foi utilizado' }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.$transaction([
            prisma.user.update({
                where: { email },
                data: { password: hashedPassword }
            }),
            prisma.usedToken.create({
                data: { token }
            })
        ])

        return NextResponse.json({ message: 'Senha alterada com sucesso' })

    } catch (err) {
        console.error("Internal Server Error:", err)
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }
}
