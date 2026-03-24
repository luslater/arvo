"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Check } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OverviewTab } from "@/components/dashboard/overview-tab"
import { AssetsTab } from "@/components/dashboard/assets-tab"
import { AllocationTab } from "@/components/dashboard/allocation-tab"
import type { UserAsset } from "@/lib/asset-types"
import type { PortfolioType } from "@/lib/portfolio-allocations"
import { useSession } from "next-auth/react"

export default function DashboardCarteiraPage() {
    const [userAssets, setUserAssets] = useState<UserAsset[]>([])
    const [saldo, setSaldo] = useState(0)
    const [reserva, setReserva] = useState(0)
    const [totalCarteira, setTotalCarteira] = useState(0)
    const [userProfile, setUserProfile] = useState<string | null>(null)
    const [viewingProfile, setViewingProfile] = useState<string | null>(null)
    const [isSelectorOpen, setIsSelectorOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const { data: session } = useSession()
    const subscriptionStatus = (session?.user?.subscriptionStatus as string) || "FREE"

    useEffect(() => {
        loadData()
    }, [session])

    const loadData = async () => {
        if (!session?.user?.email) return
        setIsLoading(true)
        try {
            const res = await fetch("/api/user/profile")
            if (res.ok) {
                const data = await res.json()
                setUserProfile(data.portfolioType)
                setViewingProfile(data.portfolioType)
                setSaldo(data.saldo)
                setReserva(data.emergencyFund)
                setTotalCarteira(data.totalCarteira)
                setUserAssets(data.assets || [])
            }
        } catch (error) {
            console.error("Error loading user profile:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpdateAssets = async (newAssets: UserAsset[]) => {
        setUserAssets(newAssets)
        const total = newAssets.reduce((sum, asset) => sum + asset.value, 0)
        setTotalCarteira(total)
    }

    const handleUpdateSaldo = async (newSaldo: number) => {
        setSaldo(newSaldo)
        fetch("/api/user/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ saldo: newSaldo })
        })
    }

    const handleUpdateReserva = async (newReserva: number) => {
        setReserva(newReserva)
        fetch("/api/user/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ emergencyFund: newReserva })
        })
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64 animate-in fade-in duration-300">
                <div className="text-dash-text-light text-sm">Carregando sua carteira...</div>
            </div>
        )
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-7 gap-4">
                <div>
                    <div className="font-serif text-[28px] text-dash-text tracking-tight mb-1">Minha Carteira</div>
                    <div className="text-[13px] text-dash-text-muted">Acompanhe e simule carteiras de investimento</div>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setIsSelectorOpen(!isSelectorOpen)}
                        className="flex items-center gap-2 px-4 py-2 bg-dash-surface border border-dash-border-strong rounded-lg shadow-sm hover:bg-dash-surface-active transition-colors text-sm font-medium text-dash-text"
                    >
                        Visualizando: {viewingProfile || "—"}
                        <ChevronDown className="h-4 w-4 text-dash-text-light" />
                    </button>

                    {isSelectorOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsSelectorOpen(false)} />
                            <div className="absolute right-0 mt-2 w-64 bg-dash-surface rounded-xl shadow-lg border border-dash-border py-1 z-50">
                                <div className="px-3 py-2 border-b border-dash-border mb-1">
                                    <p className="text-xs font-semibold text-dash-text-light uppercase tracking-wider">Mudar Visualização</p>
                                </div>
                                {["ABRIGO", "RITMO", "VANGUARDA", "OCEANO"].map((prof) => (
                                    <button
                                        key={prof}
                                        onClick={() => {
                                            setViewingProfile(prof)
                                            setIsSelectorOpen(false)
                                        }}
                                        className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors ${viewingProfile === prof
                                            ? "bg-dash-accent-light text-dash-accent font-semibold"
                                            : "text-dash-text hover:bg-dash-surface-active"
                                            }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            {prof}
                                            {prof === userProfile && (
                                                <span className="text-[10px] bg-dash-surface-active text-dash-text-muted px-1.5 py-0.5 rounded-full font-bold ml-1 border border-dash-border">MEU PERFIL</span>
                                            )}
                                        </span>
                                        {viewingProfile === prof && <Check className="h-4 w-4 text-dash-accent" />}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-dash-surface border border-dash-border shadow-sm p-1 h-auto rounded-full inline-flex">
                    <TabsTrigger value="overview" className="rounded-full px-6 py-2 text-sm data-[state=active]:bg-dash-accent data-[state=active]:text-white text-dash-text-muted hover:text-dash-text transition-colors">
                        Visão Geral
                    </TabsTrigger>
                    <TabsTrigger value="assets" className="rounded-full px-6 py-2 text-sm data-[state=active]:bg-dash-accent data-[state=active]:text-white text-dash-text-muted hover:text-dash-text transition-colors">
                        Meus Ativos
                    </TabsTrigger>
                    <TabsTrigger value="allocation" className="rounded-full px-6 py-2 text-sm data-[state=active]:bg-dash-accent data-[state=active]:text-white text-dash-text-muted hover:text-dash-text transition-colors">
                        Alocação & Metas
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 animate-in fade-in-50 duration-300">
                    <OverviewTab
                        userAssets={userAssets}
                        saldo={saldo}
                        reserva={reserva}
                        totalCarteira={totalCarteira}
                        userProfile={viewingProfile}
                        subscriptionStatus={subscriptionStatus}
                        onTransactionComplete={loadData}
                        realUserProfile={userProfile}
                        onNavigateToAssets={() => {
                            const assetsTab = document.querySelector('[value="assets"]') as HTMLElement
                            assetsTab?.click()
                        }}
                        onNavigateToPlanning={() => {
                            window.location.href = '/dashboard/planejamento'
                        }}
                    />
                </TabsContent>

                <TabsContent value="assets" className="space-y-6 animate-in fade-in-50 duration-300">
                    <AssetsTab
                        userAssets={userAssets}
                        saldo={saldo}
                        reserva={reserva}
                        onUpdateAssets={handleUpdateAssets}
                        onUpdateSaldo={handleUpdateSaldo}
                        onUpdateReserva={handleUpdateReserva}
                    />
                </TabsContent>

                <TabsContent value="allocation" className="space-y-6 animate-in fade-in-50 duration-300">
                    <AllocationTab
                        userAssets={userAssets}
                        userProfile={(viewingProfile as PortfolioType) || "RITMO"}
                        capital={totalCarteira}
                        emergencyFund={reserva}
                        subscriptionStatus={subscriptionStatus}
                        realUserProfile={userProfile}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}
