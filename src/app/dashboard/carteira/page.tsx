"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Check, Wallet, PiggyBank, TrendingUp, BarChart3 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AssetsTab } from "@/components/dashboard/assets-tab"
import { AllocationTab } from "@/components/dashboard/allocation-tab"
import { EscadaTab } from "@/components/dashboard/escada-tab"
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
            // Bypass Browser and Edge caches completely using a timestamp
            const res = await fetch(`/api/user/profile?t=${Date.now()}`, {
                cache: "no-store",
                headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
                credentials: "include"
            })
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
                                {["ABRIGO", "RITMO", "VISÃO", "OCEANO"].map((prof) => (
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 mb-8 mt-2">
                <div className="rounded-2xl border border-dash-border bg-dash-surface p-5 shadow-sm">
                    <div className="mb-2 flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-dash-text-muted" />
                        <div className="text-[10px] font-semibold uppercase tracking-widest text-dash-text-light">
                            Patrimônio Total
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-dash-text">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }).format(totalCarteira + saldo + reserva)}
                    </div>
                    <div className="mt-1 text-[11px] text-dash-text-muted">
                        Carteira + saldo + reserva
                    </div>
                </div>

                <div className="rounded-2xl border border-dash-border bg-dash-surface p-5 shadow-sm">
                    <div className="mb-2 flex items-center gap-2">
                        <PiggyBank className="h-4 w-4 text-dash-text-muted" />
                        <div className="text-[10px] font-semibold uppercase tracking-widest text-dash-text-light">
                            Aporte Mensal
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-dash-text">
                        R$ 15.000
                    </div>
                    <div className="mt-1 text-[11px] text-dash-text-muted">
                        Definido no Planejamento
                    </div>
                </div>

                <div className="rounded-2xl border border-dash-border bg-dash-surface p-5 shadow-sm">
                    <div className="mb-2 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-dash-text-muted" />
                        <div className="text-[10px] font-semibold uppercase tracking-widest text-dash-text-light">
                            Retorno Est.
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-dash-text">
                        14% a.a.
                    </div>
                    <div className="mt-1 text-[11px] text-dash-text-muted">
                        Rentabilidade nominal
                    </div>
                </div>

                <div className="rounded-2xl border border-dash-border bg-dash-surface p-5 shadow-sm">
                    <div className="mb-2 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-dash-text-muted" />
                        <div className="text-[10px] font-semibold uppercase tracking-widest text-dash-text-light">
                            Reserva de Emergência
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-dash-text">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }).format(reserva)}
                    </div>
                    <div className="mt-1 text-[11px] text-dash-text-muted">
                        Fundo de liquidez
                    </div>
                </div>
            </div>

            <Tabs defaultValue="escada" className="space-y-6">
                <TabsList className="bg-dash-surface border border-dash-border shadow-sm p-1 h-auto rounded-full inline-flex">
                    <TabsTrigger value="escada" className="rounded-full px-6 py-2 text-sm data-[state=active]:bg-dash-accent data-[state=active]:text-white text-dash-text-muted hover:text-dash-text transition-colors">
                        Carteira ARVO
                    </TabsTrigger>
                    <TabsTrigger value="assets" className="rounded-full px-6 py-2 text-sm data-[state=active]:bg-dash-accent data-[state=active]:text-white text-dash-text-muted hover:text-dash-text transition-colors">
                        Minha carteira fora Arvo
                    </TabsTrigger>
                </TabsList>



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



                <TabsContent value="escada" className="space-y-6 animate-in fade-in-50 duration-300">
                    <EscadaTab
                        dashboardReserva={reserva}
                        onUpdateReserva={setReserva}
                        dashboardTotalPatrimonio={totalCarteira + saldo + reserva}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}
