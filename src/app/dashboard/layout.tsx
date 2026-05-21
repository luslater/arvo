import { ReactNode } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { SessionTimeout } from "@/components/session-timeout"

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen bg-dash-bg font-sans text-dash-text text-sm flex-col md:flex-row">
            <SessionTimeout />
            <DashboardSidebar />
            <main className="flex-1 w-full md:ml-[232px] p-4 pt-20 md:pt-8 md:p-8 max-w-full md:max-w-[1150px] overflow-x-hidden">
                {children}
            </main>
        </div>
    )
}
