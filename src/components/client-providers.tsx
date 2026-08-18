"use client";

import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { AIChatWidget } from "@/components/ai-chat-widget";

export function ClientProviders({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isPublicPage = [
        "/",
        "/login",
        "/register",
        "/onboarding",
        "/obrigado",
        "/politica-de-privacidade",
        "/termos",
    ].includes(pathname);

    return (
        <AuthProvider>
            <ThemeProvider>
                {children}
                {!isPublicPage && <AIChatWidget />}
            </ThemeProvider>
        </AuthProvider>
    );
}
