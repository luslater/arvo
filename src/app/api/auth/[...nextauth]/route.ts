import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
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
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                })

                if (!user || !user.password) {
                    return null
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                )

                if (!isPasswordValid) {
                    return null
                }

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
