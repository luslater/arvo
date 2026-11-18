import { ReactNode } from "react"
import { Inter, Inter_Tight } from "next/font/google"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { SessionTimeout } from "@/components/session-timeout"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })
const interTight = Inter_Tight({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-inter-tight", display: "swap" })

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className={`flex min-h-screen bg-dash-bg font-sans text-dash-text text-sm flex-col md:flex-row ${inter.variable} ${interTight.variable}`}>
            <SessionTimeout />
            <DashboardSidebar />
            <main className="flex-1 w-full md:ml-[232px] p-3 sm:p-6 md:p-8 pt-16 pb-24 md:pt-8 md:pb-8 max-w-full md:max-w-[1150px] overflow-x-hidden">
                {children}
            </main>
        </div>
    )
}
