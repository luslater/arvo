"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Target, DollarSign, Shield, Rocket, Globe, AlertCircle, ArrowRight, Edit } from "lucide-react"
import Link from "next/link"
import { ContributionModal } from "@/components/contribution-modal"
import type { UserAsset } from "@/lib/asset-types"
import type { PortfolioType } from "@/lib/portfolio-allocations"
import { getProfileDescription } from "@/lib/questionnaire"
import { OCEANO_INFO } from "@/lib/oceano-info"

interface OverviewTabProps {
    userAssets: UserAsset[]
    saldo: number
    reserva: number
    totalCarteira: number
    userProfile: string | null
    onTransactionComplete: () => void
}

export function OverviewTab({
    userAssets,
    saldo,
    reserva,
    totalCarteira,
    userProfile,
    onTransactionComplete
}: OverviewTabProps) {
    const totalPatrimonio = totalCarteira + saldo + reserva

    const profileInfo = userProfile === "OCEANO"
        ? OCEANO_INFO
        : userProfile
            ? getProfileDescription(userProfile as "ABRIGO" | "RITMO" | "VANGUARDA")
            : null

    return (
        <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="border-0 shadow-sm bg-white">
                <CardContent className="pt-6">
                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-500 mb-1">Patrimônio Total</p>
                            <p className="text-3xl font-semibold text-gray-900">
                                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }).format(totalPatrimonio)}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-500 mb-1">Carteira</p>
                            <p className="text-2xl font-medium text-vanguarda-accent">
                                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }).format(totalCarteira)}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-500 mb-1">Reserva</p>
                            <p className="text-2xl font-medium text-abrigo-accent">
                                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }).format(reserva)}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-500 mb-1">Saldo</p>
                            <p className="text-2xl font-medium text-ritmo-accent">
                                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }).format(saldo)}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-8 justify-center">
                        <ContributionModal
                            userAssets={userAssets}
                            userProfile={(userProfile as PortfolioType) || "RITMO"}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all px-8"
                            onTransactionComplete={onTransactionComplete}
                        />
                        <Link href="/planejamento">
                            <Button size="lg" variant="outline" className="border-gray-300 hover:bg-gray-50">
                                <Target className="h-4 w-4 mr-2" />
                                Planejamento
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Profile Section - Expanded */}
            <Card className="border-0 shadow-sm bg-white">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-6">
                        <div className="text-5xl pt-1">
                            {userProfile === "ABRIGO" && <Shield className="w-16 h-16 text-abrigo-accent" />}
                            {userProfile === "RITMO" && <TrendingUp className="w-16 h-16 text-ritmo-accent" />}
                            {userProfile === "VANGUARDA" && <Rocket className="w-16 h-16 text-vanguarda-accent" />}
                            {userProfile === "OCEANO" && <Globe className="w-16 h-16 text-oceano-accent" />}
                            {!userProfile && <AlertCircle className="w-16 h-16 text-gray-300" />}
                        </div>
                        <div className="flex-1 space-y-4">
                            <div>
                                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Seu Perfil de Investidor</p>
                                <h3 className="text-3xl font-light text-gray-900 mt-1">
                                    {userProfile ? `Carteira ${userProfile}` : "Perfil não definido"}
                                </h3>
                            </div>

                            {profileInfo ? (
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <p className="text-gray-700 leading-relaxed">
                                            {profileInfo.description}
                                        </p>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="p-3 rounded bg-gray-50 border border-gray-100">
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Objetivo</p>
                                            <p className="text-sm text-gray-900">{profileInfo.subtitle}</p>
                                        </div>
                                        {/* Add more stats if available in profileInfo */}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-gray-600 mb-4">
                                        Descubra qual é o seu perfil de investidor para receber recomendações personalizadas.
                                    </p>
                                    <Link href="/questionnaire">
                                        <Button variant="default" className="bg-indigo-600 text-white hover:bg-indigo-700">
                                            Descobrir Perfil
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
