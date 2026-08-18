import type { Metadata, Viewport } from "next";
import "./globals.css";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import { ClientProviders } from "@/components/client-providers";

const dmSans = DM_Sans({
    subsets: ["latin"],
    variable: "--font-dm-sans",
    weight: ["300", "400", "500", "600", "700"],
});

const dmSerif = DM_Serif_Display({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-dm-serif",
});

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
    themeColor: "#123044",
};

export const metadata: Metadata = {
    metadataBase: new URL("https://meuarvo.com.br"),
    applicationName: "ARVO",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "ARVO",
    },
    title: {
        default: "ARVO | Orientação Financeira Independente",
        template: "%s | ARVO",
    },
    description: "Plataforma independente de planejamento financeiro, Bússola de risco e alocação de carteiras fee-only. Construa patrimônio com método, sem conflito de interesse.",
    keywords: [
        "planejamento financeiro",
        "orientação financeira",
        "consultoria fee-only",
        "bússola de investimentos",
        "carteira recomendada",
        "wealth management",
        "independência financeira",
        "calculadora de aposentadoria",
    ],
    authors: [{ name: "ARVO Orientação Financeira" }],
    creator: "ARVO",
    publisher: "ARVO Orientação Financeira",
    openGraph: {
        type: "website",
        locale: "pt_BR",
        url: "https://meuarvo.com.br",
        siteName: "ARVO Orientação Financeira",
        title: "ARVO | Orientação Financeira Independente",
        description: "Planejamento financeiro independente, diagnóstico da sua carteira e Bússola de Alocação fee-only.",
        images: [
            {
                url: "/meu-arvo-logo.png",
                width: 1200,
                height: 630,
                alt: "ARVO - Orientação Financeira Independente",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "ARVO | Orientação Financeira Independente",
        description: "Planejamento financeiro independente, diagnóstico da sua carteira e Bússola de Alocação fee-only.",
        images: ["/meu-arvo-logo.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    icons: {
        icon: "/arvo-simbolo-blue.png",
        shortcut: "/arvo-simbolo-blue.png",
        apple: "/arvo-simbolo-blue.png",
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "ARVO Orientação Financeira Independente",
    alternateName: "Meu Arvo",
    url: "https://meuarvo.com.br",
    logo: "https://meuarvo.com.br/meu-arvo-logo.png",
    image: "https://meuarvo.com.br/meu-arvo-logo.png",
    description: "Plataforma fee-only de planejamento patrimonial, suitability e alocação de carteiras de investimento.",
    email: "contato@meuarvo.com.br",
    priceRange: "$$",
    address: {
        "@type": "PostalAddress",
        addressCountry: "BR",
    },
    serviceType: [
        "Planejamento Financeiro",
        "Orientação Patrimonial Fee-Only",
        "Alocação de Carteiras",
        "Diagnóstico de Investimentos",
    ],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR" className={`${dmSans.variable} ${dmSerif.variable}`}>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
                    rel="stylesheet"
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body className="antialiased light bg-white text-gray-900 font-sans">
                <ClientProviders>{children}</ClientProviders>
            </body>
        </html>
    );
}
