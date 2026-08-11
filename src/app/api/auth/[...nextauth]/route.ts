import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import { LRUCache } from "lru-cache"

const rateLimitCache = new LRUCache<string, number>({
    max: 500, // max 500 users being tracked for rate limit at once
    ttl: 15 * 60 * 1000, // 15 minutes
})

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 24 * 60 * 60, // 24 hours
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                identifier: { label: "Email, CPF ou CNPJ", type: "text" },
                password: { label: "Password", type: "password" },
                mfaToken: { label: "Código MFA (se ativado)", type: "text" }
            },
            async authorize(credentials) {
                if (!credentials?.identifier || !credentials?.password) {
                    return null
                }

                const identifier = credentials.identifier

                // Rate limiting check
                const currentAttempts = rateLimitCache.get(identifier) || 0
                if (currentAttempts >= 5) {
                    throw new Error("Muitas tentativas falhas. Conta temporariamente bloqueada por 15 minutos.")
                }

                const user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { email: identifier },
                            { cpf: identifier }
                        ]
                    }
                })

                if (!user || !user.password) {
                    rateLimitCache.set(identifier, currentAttempts + 1)
                    return null
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                )

                if (!isPasswordValid) {
                    rateLimitCache.set(identifier, currentAttempts + 1)
                    return null
                }

                // MFA Validation
                if (user.mfaEnabled && user.mfaSecret) {
                    if (!credentials.mfaToken) {
                        throw new Error("MFA_REQUIRED")
                    }
                    
                    const speakeasy = require("speakeasy")
                    const mfaVerified = speakeasy.totp.verify({
                        secret: user.mfaSecret,
                        encoding: 'base32',
                        token: credentials.mfaToken,
                        window: 1 // Permite uma pequena margem de erro no relógio
                    })
                    
                    if (!mfaVerified) {
                        rateLimitCache.set(identifier, currentAttempts + 1)
                        throw new Error("Código MFA inválido")
                    }
                }

                // Reset rate limit on successful login
                rateLimitCache.delete(identifier)

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    // @ts-ignore
                    accountStatus: user.accountStatus,
                    // @ts-ignore
                    subscriptionStatus: user.subscriptionStatus,
                }
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.accountStatus = token.accountStatus as string
                const isPremium = token?.subscriptionStatus === "PREMIUM" || token?.subscriptionStatus === "ADMIN"
                session.user.subscriptionStatus = isPremium ? "PREMIUM" : "FREE"
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                // @ts-ignore
                token.accountStatus = user.accountStatus || "PENDING"
                // @ts-ignore
                token.subscriptionStatus = user.subscriptionStatus || "FREE"
            } else if (token.id) {
                // Refresh from DB on each request to pick up admin changes
                const dbUser = await prisma.user.findUnique({
                    where: { id: token.id as string },
                    // @ts-ignore
                    select: { subscriptionStatus: true, accountStatus: true }
                })
                if (dbUser) {
                    // @ts-ignore
                    token.subscriptionStatus = dbUser.subscriptionStatus
                    // @ts-ignore
                    token.accountStatus = dbUser.accountStatus
                }
            }
            return token
        }
    }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
