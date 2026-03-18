import { ReactNode } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen bg-dash-bg font-sans text-dash-text text-sm">
            <DashboardSidebar />
            <main className="ml-[232px] flex-1 p-8 max-w-[1150px]">
                {children}
            </main>
        </div>
    )
}
