"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PORTFOLIO_ALLOCATIONS, getTotalsByType, type PortfolioType } from "@/lib/portfolio-allocations"
import { getProfileDescription } from "@/lib/questionnaire"
import { OCEANO_INFO } from "@/lib/oceano-info"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { calculateAdherenceScore, getScoreLabel, type AdherenceScore } from "@/lib/adherence-score"
import type { UserAsset } from "@/lib/asset-types"
import { ASSET_TYPES } from "@/lib/asset-types"
import { Target } from "lucide-react"

interface AllocationTabProps {
    userAssets: UserAsset[]
    userProfile: PortfolioType
    capital: number
    emergencyFund: number
    subscriptionStatus: string
    realUserProfile: string | null
}

export function AllocationTab({
    userAssets,
    userProfile,
    capital,
    emergencyFund,
    subscriptionStatus,
    realUserProfile
}: AllocationTabProps) {
    const allocations = PORTFOLIO_ALLOCATIONS[userProfile]
    const totals = getTotalsByType(userProfile)

    const profileInfo = userProfile === "OCEANO"
        ? OCEANO_INFO
        : getProfileDescription(userProfile as "ABRIGO" | "RITMO" | "VANGUARDA")

    const adherenceScore = calculateAdherenceScore(userAssets, userProfile)

    const COLORS = {
        "Renda Fixa": "#C9B8A3",
        "Renda Fixa Inflação": "#A89178",
        "Multimercado": "#A8C5A1",
        "Renda Variável": "#7BA3C4",
        "Ações": "#7BA3C4",
        "Alternativo": "#89C4D4",
        "Reserva de Emergência": "#8B7355",
        "Outros": "#6B7280"
    }

    // Prepare Current Portfolio Data
    const typeMap: Record<string, number> = {}
    userAssets.forEach(asset => {
        const assetInfo = ASSET_TYPES.find(t => t.id === asset.type)
        const categoryName = assetInfo?.category === "renda_fixa" ? "Renda Fixa" :
            assetInfo?.category === "acoes" ? "Ações" :
                assetInfo?.category === "fiis" ? "Fundos Imobiliários" :
                    assetInfo?.category === "tesouro" ? "Tesouro" :
                        assetInfo?.category === "fundos" ? "Fundos" : "Outros"

        typeMap[categoryName] = (typeMap[categoryName] || 0) + asset.value
    })

    const currentData = Object.entries(typeMap).map(([name, value]) => ({
        name,
        value,
        percentage: (value / Object.values(typeMap).reduce((a, b) => a + b, 0) * 100).toFixed(1)
    }))

    // Prepare Recommended Data
    const recommendedData = Object.entries(totals).map(([name, percentage]) => ({
        name,
        value: percentage,
        percentage: percentage.toFixed(1)
    }))

    const isPremiumProfile = userProfile !== "ABRIGO"
    const isLocked = subscriptionStatus === "FREE" && isPremiumProfile

    return (
        <div className="space-y-6">
            {/* Adherence Score */}
            <Card className="border-0 shadow-sm bg-white">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                            <Target className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold text-gray-900">Score de Aderência</CardTitle>
                            <CardDescription>
                                O quanto sua carteira está alinhada com o perfil {profileInfo.title}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Score */}
                        <div className="text-center">
                            <div className="text-5xl font-light mb-2 text-gray-900">
                                {adherenceScore.score}
                                <span className="text-2xl text-gray-400">%</span>
                            </div>
                            <p className={`font-medium ${getScoreLabel(adherenceScore.score).color}`}>
                                {getScoreLabel(adherenceScore.score).label}
                            </p>
                            <div className="flex gap-1 justify-center mt-3">
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-2 h-2 rounded-full ${i < Math.round(adherenceScore.score / 10)
                                            ? "bg-indigo-500"
                                            : "bg-gray-200"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Matching Funds */}
                        <div>
                            <h4 className="font-medium text-sm text-green-600 mb-2">
                                ✓ Fundos Alinhados ({adherenceScore.matching.length})
                            </h4>
                            <div className="space-y-1 max-h-32 overflow-y-auto bg-gray-50 p-2 rounded">
                                {adherenceScore.matching.length > 0 ? (
                                    adherenceScore.matching.map((fund, i) => (
                                        <p key={i} className="text-xs text-gray-700 truncate">
                                            {fund}
                                        </p>
                                    ))
                                ) : (
                                    <p className="text-xs text-gray-500 italic">Nenhum fundo alinhado ainda</p>
                                )}
                            </div>
                        </div>

                        {/* Missing Funds */}
                        <div>
                            <h4 className="font-medium text-sm text-orange-600 mb-2">
                                → Oportunidades ({adherenceScore.missing.length})
                            </h4>
                            <div className="space-y-1 max-h-32 overflow-y-auto bg-gray-50 p-2 rounded">
                                {adherenceScore.missing.slice(0, 5).map((fund, i) => (
                                    <p key={i} className="text-xs text-gray-700 truncate">
                                        {fund}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="relative">
                {isLocked && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[6px] rounded-xl border border-gray-200 shadow-sm p-6 text-center">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-md">
                            <Target className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Carteira {profileInfo.title} Restrita</h3>
                        <p className="text-gray-600 max-w-md mb-6 font-medium">
                            Explore as estratégias dinâmicas de alocação de fundos projetadas especificamente para o seu perfil fazendo o upgrade para o Premium.
                        </p>
                        <a href="/checkout/pagamento" className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                            DESBLOQUEAR ACESSO PREMIUM
                        </a>
                    </div>
                )}

                <div className={isLocked ? "opacity-30 pointer-events-none select-none" : ""}>
                    {/* Charts Comparison */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <Card className="border-0 shadow-sm bg-white">
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-center">Sua Carteira Atual</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={currentData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={80}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {currentData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || "#9CA3AF"} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-sm bg-white">
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-center">Recomendação ({profileInfo.title})</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={recommendedData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={80}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {recommendedData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || "#9CA3AF"} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recommended Funds List */}
                    <Card className="border-0 shadow-sm bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">Fundos Recomendados</CardTitle>
                            <CardDescription>Composição ideal para seu perfil</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {allocations.map((fund, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div>
                                            <p className="font-medium text-sm text-gray-900">{fund.name}</p>
                                            <p className="text-xs text-gray-500">{fund.type}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-sm text-primary">{fund.percentage}%</p>
                                            <p className="text-xs text-gray-500">
                                                Meta: {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(capital * (fund.percentage / 100))}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
