"use client"

import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"

import { usePathname } from "next/navigation"
import { AIChatWidget } from "@/components/ai-chat-widget"
import { DM_Sans, DM_Serif_Display } from "next/font/google"

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', weight: ['300', '400', '500', '600', '700'] })
const dmSerif = DM_Serif_Display({ weight: "400", subsets: ['latin'], variable: '--font-dm-serif' })

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const pathname = usePathname()
    const isPublicPage = ["/", "/login", "/register", "/onboarding"].includes(pathname)

    return (
        <html lang="pt-BR" className={`${dmSans.variable} ${dmSerif.variable}`}>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
            </head>
            <body className="antialiased light bg-white text-gray-900 font-sans">
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
