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
    subscriptionStatus: string
    onTransactionComplete: () => void
    realUserProfile: string | null
    onNavigateToAssets: () => void
    onNavigateToPlanning: () => void
}

export function OverviewTab({
    userAssets,
    saldo,
    reserva,
    totalCarteira,
    userProfile,
    subscriptionStatus,
    onTransactionComplete,
    realUserProfile,
    onNavigateToAssets,
    onNavigateToPlanning
}: OverviewTabProps) {
    const totalPatrimonio = totalCarteira + saldo + reserva

    const isPreviewing = realUserProfile && userProfile && realUserProfile !== userProfile;

    const profileInfo = userProfile === "OCEANO"
        ? OCEANO_INFO
        : userProfile
            ? getProfileDescription(userProfile as "ABRIGO" | "RITMO" | "VISÃO")
            : null

    // Weighted average logic
    let weightedAverageReturn = 0
    if (totalCarteira > 0 && userAssets.length > 0) {
        const sumOfWeightedReturns = userAssets.reduce((sum, asset) => {
            const assetWeight = asset.value / totalCarteira
            // treating asset.rentabilidade as percentage (e.g. 10.5)
            const assetRentability = asset.rentabilidade || 0
            return sum + (assetWeight * assetRentability)
        }, 0)
        weightedAverageReturn = sumOfWeightedReturns
    }

    const isPortfolioEmpty = totalCarteira === 0

    return (
        <div className="space-y-6">

            {/* Premium CTA Dashboard Banner */}
            {subscriptionStatus === "FREE" && (
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-xl p-6 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                            <Rocket className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Libere o Potencial Completo da sua Carteira</h3>
                            <p className="text-emerald-100 text-sm mt-1">Visualizando outras carteiras? Assine o Premium para destrancar a alocação exata de ativos como Visão e Ritmo.</p>
                        </div>
                    </div>
                    <Button asChild variant="secondary" className="w-full md:w-auto bg-white text-emerald-700 hover:bg-emerald-50 font-bold px-8 shadow-sm">
                        <Link href="/checkout/pagamento">
                            Upgrade Premium
                        </Link>
                    </Button>
                </div>
            )}

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
                            <p className="text-2xl font-medium text-visao-accent">
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
                        <Button size="lg" variant="outline" className="border-gray-300 hover:bg-gray-50" onClick={onNavigateToPlanning}>
                            <Target className="h-4 w-4 mr-2" />
                            Planejamento
                        </Button>
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
                            {userProfile === "VISÃO" && <Rocket className="w-16 h-16 text-visao-accent" />}
                            {userProfile === "OCEANO" && <Globe className="w-16 h-16 text-oceano-accent" />}
                            {!userProfile && <AlertCircle className="w-16 h-16 text-gray-300" />}
                        </div>
                        <div className="flex-1 space-y-4">
                            <div>
                                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                                    {isPreviewing ? "Visualizando Perfil" : "Seu Perfil de Investidor"}
                                </p>
                                <h3 className="text-3xl font-light text-gray-900 mt-1 flex items-center gap-3">
                                    {userProfile ? `Carteira ${userProfile}` : "Perfil não definido"}
                                    {isPreviewing && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-md font-bold tracking-wider">MODO PREVISÃO</span>}
                                </h3>
                            </div>

                            {profileInfo ? (
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <p className="text-gray-700 leading-relaxed">
                                            {profileInfo.description}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="p-3 rounded-xl bg-dash-surface-active border border-dash-border">
                                            <p className="text-[11px] text-dash-text-light uppercase tracking-wider font-semibold mb-1">Objetivo</p>
                                            <p className="text-[13px] font-medium text-dash-text">{profileInfo.subtitle}</p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-dash-surface-active border border-dash-border">
                                            <p className="text-[11px] text-dash-text-light uppercase tracking-wider font-semibold mb-1">Retorno (Est.)</p>
                                            <p className="text-[13px] font-medium text-dash-text">
                                                {userProfile === "ABRIGO" ? "10,5% a.a." :
                                                    userProfile === "RITMO" ? "12,2% a.a." :
                                                        userProfile === "VISÃO" ? "14,5% a.a." :
                                                            userProfile === "OCEANO" ? "16,0% a.a." : "--"}
                                            </p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-dash-surface-active border border-dash-border">
                                            <p className="text-[11px] text-dash-text-light uppercase tracking-wider font-semibold mb-1">Risco e Volatil.</p>
                                            <p className="text-[13px] font-medium text-dash-text">
                                                {userProfile === "ABRIGO" ? "Baixo" :
                                                    userProfile === "RITMO" ? "Moderado" :
                                                        userProfile === "VISÃO" ? "Arrojado" :
                                                            userProfile === "OCEANO" ? "Alto Global" : "--"}
                                            </p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-dash-surface-active border border-dash-border">
                                            <p className="text-[11px] text-dash-text-light uppercase tracking-wider font-semibold mb-1">Moeda / Foco</p>
                                            <p className="text-[13px] font-medium text-dash-text">
                                                {userProfile === "OCEANO" ? "USD / BRL" : "BRL (Brasil)"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Média Ponderada e Comparação da Carteira */}
                                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                                        <div className="p-5 rounded-2xl bg-white border border-dash-border-strong flex flex-col justify-between">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-sm font-semibold text-dash-text">Rentabilidade Atual</h4>
                                                <div className="p-1.5 bg-dash-surface-active rounded-md">
                                                    <TrendingUp className="w-4 h-4 text-dash-accent" />
                                                </div>
                                            </div>
                                            <div>
                                                {isPortfolioEmpty ? (
                                                    <div className="text-sm text-dash-text-muted italic">Média ponderada indisponível sem ativos.</div>
                                                ) : (
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-3xl font-light text-dash-text">{weightedAverageReturn.toFixed(2).replace('.', ',')}%</span>
                                                        <span className="text-sm text-dash-text-light">a.a.</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-5 rounded-2xl bg-dash-surface-active border border-dash-border flex flex-col justify-between">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-sm font-semibold text-dash-text">Aderência da Carteira</h4>
                                                <div className="p-1.5 bg-white border border-dash-border rounded-md shadow-sm">
                                                    <Target className="w-4 h-4 text-dash-accent" />
                                                </div>
                                            </div>
                                            {isPortfolioEmpty ? (
                                                <div>
                                                    <p className="text-sm text-dash-text-muted mb-3 pr-4">Você ainda não listou os ativos da sua carteira atual para saber sua aderência ao modelo Sugerido (<strong>{userProfile}</strong>).</p>
                                                    <Button onClick={onNavigateToAssets} className="w-full bg-dash-accent text-white hover:bg-dash-accent-mid font-semibold rounded-xl">
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        Editar Carteira Atual
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex justify-between items-end mb-1">
                                                        <div className="text-[10px] text-dash-text-light font-semibold uppercase tracking-widest">Alocação vs Sugerida</div>
                                                        <div className="text-xl font-bold text-dash-text">82%</div>
                                                    </div>
                                                    <div className="h-2.5 w-full bg-dash-border rounded-full overflow-hidden">
                                                        <div className="h-full bg-green-500 rounded-full transition-all duration-1000" style={{ width: '82%' }}></div>
                                                    </div>
                                                    <div className="text-[11px] text-dash-text-muted mt-1">Aderência calculada com base na divergência de classe de ativos.</div>
                                                </div>
                                            )}
                                        </div>
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
