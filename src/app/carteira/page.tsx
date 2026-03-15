"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Trophy, LogOut, User } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OverviewTab } from "@/components/dashboard/overview-tab"
import { AssetsTab } from "@/components/dashboard/assets-tab"
import { AllocationTab } from "@/components/dashboard/allocation-tab"
import type { UserAsset } from "@/lib/asset-types"
import type { PortfolioType } from "@/lib/portfolio-allocations"
import { useSession } from "next-auth/react"

export default function CarteiraPage() {
    const [userAssets, setUserAssets] = useState<UserAsset[]>([])
    const [saldo, setSaldo] = useState(0)
    const [reserva, setReserva] = useState(0)
    const [totalCarteira, setTotalCarteira] = useState(0)
    const [userProfile, setUserProfile] = useState<string | null>(null)
    const { data: session } = useSession()
    const subscriptionStatus = (session?.user?.subscriptionStatus as string) || "FREE"

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

                        <div className="flex items-center gap-3">
                            <Link href="/jornada">
                                <Button variant="ghost" size="sm" className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50">
                                    <Trophy className="h-4 w-4 mr-2" />
                                    Nível 3
                                </Button>
                            </Link>
                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                                <User className="h-4 w-4 text-gray-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
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
                            userProfile={userProfile}
                            subscriptionStatus={subscriptionStatus}
                            onTransactionComplete={loadData}
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
                            userProfile={(userProfile as PortfolioType) || "RITMO"}
                            capital={totalCarteira}
                            emergencyFund={reserva}
                            subscriptionStatus={subscriptionStatus}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
