"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Trophy, LogOut, User, Settings, ChevronDown, Check } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OverviewTab } from "@/components/dashboard/overview-tab"
import { AssetsTab } from "@/components/dashboard/assets-tab"
import { AllocationTab } from "@/components/dashboard/allocation-tab"
import type { UserAsset } from "@/lib/asset-types"
import type { PortfolioType } from "@/lib/portfolio-allocations"
import { useSession, signOut } from "next-auth/react"

export default function CarteiraPage() {
    const [userAssets, setUserAssets] = useState<UserAsset[]>([])
    const [saldo, setSaldo] = useState(0)
    const [reserva, setReserva] = useState(0)
    const [totalCarteira, setTotalCarteira] = useState(0)
    const [userProfile, setUserProfile] = useState<string | null>(null)
    const [viewingProfile, setViewingProfile] = useState<string | null>(null)
    const { data: session } = useSession()
    const subscriptionStatus = (session?.user?.subscriptionStatus as string) || "FREE"
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isSelectorOpen, setIsSelectorOpen] = useState(false)

    const [isLoading, setIsLoading] = useState(true)

    // Load data
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

        // Update profile in DB in background
        fetch("/api/user/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ totalCarteira: total })
        })
    }

    const handleUpdateSaldo = async (newSaldo: number) => {
        setSaldo(newSaldo)
        // Update in background
        fetch("/api/user/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ saldo: newSaldo })
        })
    }

    const handleUpdateReserva = async (newReserva: number) => {
        setReserva(newReserva)
        // Update in background
        fetch("/api/user/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ emergencyFund: newReserva })
        })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <ThemeToggle />

            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Image src="/arvo-logo.png" alt="ARVO" width={80} height={40} />
                            <div className="h-6 w-px bg-gray-200" />
                            <nav className="flex gap-6 text-sm font-medium">
                                <Link href="/carteira" className="text-primary">Carteira</Link>
                                <Link href="/jornada" className="text-gray-500 hover:text-gray-900">Jornada</Link>
                                <Link href="/educacao" className="text-gray-500 hover:text-gray-900">Educação</Link>
                            </nav>
                        </div>

                        <div className="flex items-center gap-3 relative">
                            {subscriptionStatus === "FREE" && (
                                <Button asChild variant="default" size="sm" className="hidden sm:inline-flex bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold border-0 shadow-md">
                                    <Link href="/checkout/pagamento">
                                        Seja Premium
                                    </Link>
                                </Button>
                            )}
                            <Button asChild variant="ghost" size="sm" className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50">
                                <Link href="/jornada">
                                    <Trophy className="h-4 w-4 mr-2" />
                                    Nível 3
                                </Link>
                            </Button>

                            <div className="relative">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
                                >
                                    {session?.user?.image ? (
                                        <img src={session.user.image} alt="User avatar" className="h-10 w-10 rounded-full object-cover" />
                                    ) : (
                                        <User className="h-5 w-5 text-slate-600" />
                                    )}
                                </button>

                                {isMenuOpen && (
                                    <>
                                        {/* Overlay para fechar ao clicar fora */}
                                        <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />

                                        {/* Menu suspenso */}
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                                            <div className="px-4 py-3 border-b border-slate-100 mb-1">
                                                <p className="text-sm font-semibold text-slate-900 truncate">
                                                    {session?.user?.name || "Minha Conta"}
                                                </p>
                                                <p className="text-xs text-slate-500 truncate mt-0.5">
                                                    {session?.user?.email || ""}
                                                </p>
                                                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                                    <p className="text-[10px] text-indigo-700 uppercase tracking-widest font-bold">
                                                        {subscriptionStatus}
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    setIsMenuOpen(false)
                                                    // alert("Indo para Configurações...")
                                                }}
                                                className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-3 transition-colors"
                                            >
                                                <Settings className="h-4 w-4 text-slate-400" />
                                                Configurações
                                            </button>

                                            <button
                                                onClick={() => signOut({ callbackUrl: '/login' })}
                                                className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Sair da conta
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Sua Carteira</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Acompanhe e simule carteiras de investimento
                        </p>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setIsSelectorOpen(!isSelectorOpen)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                        >
                            Visualizando: {viewingProfile || "Carregando..."}
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                        </button>

                        {isSelectorOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsSelectorOpen(false)} />
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                                    <div className="px-3 py-2 border-b border-gray-100 mb-1">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mudar Visualização</p>
                                    </div>
                                    {["ABRIGO", "RITMO", "VANGUARDA", "OCEANO"].map((prof) => (
                                        <button
                                            key={prof}
                                            onClick={() => {
                                                setViewingProfile(prof)
                                                setIsSelectorOpen(false)
                                            }}
                                            className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors ${viewingProfile === prof ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                                        >
                                            <span className="flex items-center gap-2">
                                                {prof} {prof === userProfile && <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full font-bold ml-1 border border-slate-200">MEU PERFIL</span>}
                                            </span>
                                            {viewingProfile === prof && <Check className="h-4 w-4 text-indigo-600" />}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <Tabs defaultValue="overview" className="space-y-6">
                    <div className="flex justify-center">
                        <TabsList className="bg-white border border-gray-200 shadow-sm p-1 h-auto rounded-full">
                            <TabsTrigger value="overview" className="rounded-full px-6 py-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-gray-600 hover:text-gray-900">
                                Visão Geral
                            </TabsTrigger>
                            <TabsTrigger value="assets" className="rounded-full px-6 py-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-gray-600 hover:text-gray-900">
                                Meus Ativos
                            </TabsTrigger>
                            <TabsTrigger value="allocation" className="rounded-full px-6 py-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-gray-600 hover:text-gray-900">
                                Alocação & Metas
                            </TabsTrigger>
                        </TabsList>
                    </div>

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
        </div>
    )
}
