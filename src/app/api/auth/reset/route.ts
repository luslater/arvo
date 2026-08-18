import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SignJWT } from 'jose'
import { Resend } from 'resend'
import { LRUCache } from 'lru-cache'

const resetRateLimit = new LRUCache<string, number>({
    max: 500,
    ttl: 15 * 60 * 1000, // 15 minutes
})

// Usa API key da variável de ambiente, se houver
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(req: Request) {
    try {
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown-ip"
        const attempts = resetRateLimit.get(ip) || 0
        if (attempts >= 5) {
            return NextResponse.json(
                { message: 'Muitas tentativas de recuperação. Tente novamente em 15 minutos.' },
                { status: 429 }
            )
        }

        const { identifier } = await req.json()
        if (!identifier) {
            resetRateLimit.set(ip, attempts + 1)
            return NextResponse.json({ error: 'Identificador obrigatório' }, { status: 400 })
        }

        resetRateLimit.set(ip, attempts + 1)

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { cpf: identifier }
                ]
            }
        })

        if (!user || !user.email) {
            // Em produção, para não vazar emails, retornamos sucesso genérico mesmo se não achar.
            return NextResponse.json({ message: 'Se o email ou documento existir em nossa base, você receberá um link para resetar a senha.' })
        }

        // Gera JWT estático para reset de senha válido por 1 hora
        if (!process.env.NEXTAUTH_SECRET) {
            console.error('NEXTAUTH_SECRET não configurado — recusando gerar token de reset de senha.')
            return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
        }
        const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET)
        const token = await new SignJWT({ email: user.email, purpose: 'reset_password' })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('1h')
            .sign(secret)

        const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/resetar-senha?token=${token}`

        if (resend) {
            try {
                await resend.emails.send({
                    from: 'ARVO <noreply@meuarvo.com.br>',
                    to: user.email,
                    subject: 'ARVO - Recuperação de Senha',
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2>Olá${user.name ? ' ' + user.name : ''},</h2>
                            <p>Você solicitou a recuperação da sua senha na plataforma ARVO.</p>
                            <p>Clique no botão abaixo para definir uma nova senha (link válido por 1 hora):</p>
                            <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #123044; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0;">
                                Redefinir Senha
                            </a>
                            <p style="color: #666; font-size: 14px;">Se você não solicitou isso, pode ignorar este email.</p>
                        </div>
                    `
                })
            } catch (err) {
                console.error('Erro ao enviar email via Resend:', err)
                // Fallback para console
                console.log("[RESET LINK FALLBACK]: %s", resetUrl)
            }
        } else {
            // Fallback development (ou se não tem chave)
            console.log("[RESET LINK FALLBACK (Sem Resend configurado)]: %s", resetUrl)
        }

        return NextResponse.json({ 
            message: 'Se o email ou documento existir em nossa base, você receberá um link para resetar a senha.' 
        })

    } catch (err) {
        console.error("Internal Server Error:", err)
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }
}
