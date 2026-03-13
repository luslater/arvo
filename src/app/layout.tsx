"use client"

import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"

import { usePathname } from "next/navigation"
import { AIChatWidget } from "@/components/ai-chat-widget"

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const pathname = usePathname()
    const isPublicPage = ["/", "/login", "/register", "/onboarding"].includes(pathname)

    return (
        <html lang="pt-BR">
            <body className="antialiased light bg-white text-gray-900">
                <AuthProvider>
                    <ThemeProvider>
                        {children}
                        {!isPublicPage && <AIChatWidget />}
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    )
}
