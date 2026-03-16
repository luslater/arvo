"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft, TrendingUp, ArrowRight, Target, Globe } from "lucide-react"
import { PORTFOLIO_ALLOCATIONS, getTotalsByType, type PortfolioType } from "@/lib/portfolio-allocations"
import { getProfileDescription } from "@/lib/questionnaire"
import { OCEANO_INFO } from "@/lib/oceano-info"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { getPortfolioPerformance } from "@/lib/portfolio-performance"
import { CDI_DATA, IPCA_LAST_12M, calculateRealReturn } from "@/lib/cdi-data"
import { calculateAdherenceScore, getScoreLabel, type AdherenceScore } from "@/lib/adherence-score"
import type { UserAsset } from "@/lib/asset-types"
import { ASSET_TYPES } from "@/lib/asset-types"

export default function PortfolioDetailPage({ params }: { params: Promise<{ type: string }> }) {
    const { type } = use(params)
    const portfolioType = type.toUpperCase() as PortfolioType

    const allocations = PORTFOLIO_ALLOCATIONS[portfolioType]
    const totals = getTotalsByType(portfolioType)

    // Use Oceano info for Oceano, otherwise use questionnaire profile
    const profileInfo = portfolioType === "OCEANO"
        ? OCEANO_INFO
        : getProfileDescription(portfolioType as "ABRIGO" | "RITMO" | "VANGUARDA")

    const { data: session } = useSession()
    const [capital, setCapital] = useState(50000)
    const [emergencyFund, setEmergencyFund] = useState(10000)
    const [userAssets, setUserAssets] = useState<UserAsset[]>([])
    const [adherenceScore, setAdherenceScore] = useState<AdherenceScore | null>(null)

    // Load data from DB Profile instead of localStorage
    useEffect(() => {
        const loadProfileData = async () => {
            if (!session?.user?.id) return

            try {
                const res = await fetch("/api/user/profile")
                if (res.ok) {
                    const data = await res.json()
                    const profileCapital = (data.saldo || 0) + (data.totalCarteira || 0)
                    const profileEmergency = data.emergencyFund || 0

                    if (profileCapital > 0) setCapital(profileCapital)
                    if (profileEmergency > 0) setEmergencyFund(profileEmergency)

                    if (data.assets && data.assets.length > 0) {
                        setUserAssets(data.assets)
                        const score = calculateAdherenceScore(data.assets, portfolioType)
                        setAdherenceScore(score)
                    }
                }
            } catch (e) {
                console.error("Error loading profile data:", e)
            }
        }

        loadProfileData()
    }, [session, portfolioType])

    const colorClasses = {
        ABRIGO: "from-[#C9B8A3] to-[#8B7355]",
        RITMO: "from-[#A8C5A1] to-[#5D8C54]",
        VANGUARDA: "from-[#A3BFD9] to-[#5687AF]",
        OCEANO: "from-[#89C4D4] to-[#3D96AB]",
    }

    // Get performance data
    const performanceData = getPortfolioPerformance(portfolioType)
    const cdiData2024 = CDI_DATA[2024]

    // Prepare chart data (last 12 months)
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
    const chartData = months.map((month, index) => ({
        month,
        Carteira: performanceData.monthlyReturns[index],
        CDI: cdiData2024[index]
    }))

    // Calculate real return
    const nominalReturn = performanceData.annualReturn
    const realReturn = calculateRealReturn(nominalReturn, IPCA_LAST_12M)
    const gainVsCDI = nominalReturn - 10.88 // CDI 2024


    // Prepare pie chart data including emergency fund as Renda Fixa
    const totalInvested = capital + emergencyFund
    const pieData = [
        ...Object.entries(totals).map(([type, percentage]) => ({
            name: type,
            value: (capital * percentage / 100),
            percentage: (capital * percentage / 100 / totalInvested * 100).toFixed(1)
        })),
        {
            name: "Reserva de Emergência",
            value: emergencyFund,
            percentage: (emergencyFund / totalInvested * 100).toFixed(1)
        }
    ].filter(item => item.value > 0)

    const COLORS = {
        "Pós-Fixado (DI / Caixa)": "#C9B8A3",
        "IPCA+ (Inflação)": "#A89178",
        "Prefixados": "#8B7355",
        "Multimercados": "#A8C5A1",
        "Ações Brasil": "#7BA3C4",
        "Internacional / FX": "#5687AF",
        "Renda Fixa": "#C9B8A3",
        "Renda Fixa Inflação": "#A89178",
        "Multimercado": "#A8C5A1",
        "Renda Variável": "#7BA3C4",
        "Ações": "#7BA3C4",
        "Alternativo": "#89C4D4",
        "Reserva de Emergência": "#6B7280",
    }


    return (
        <div className="min-h-screen bg-white  p-6">
            <ThemeToggle />

            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Link href="/portfolio/setup">
                        <Button variant="ghost">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Voltar
                        </Button>
                    </Link>
                </div>

                {/* Portfolio Header */}
                <div className="text-center space-y-4">
                    <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${colorClasses[portfolioType]} flex items-center justify-center text-5xl`}>
                        {profileInfo.icon}
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 ">{profileInfo.subtitle}</p>
                        <h1 className="text-4xl font-light">Carteira {profileInfo.title}</h1>
                        <p className="text-gray-600  mt-2 max-w-2xl mx-auto">
                            {profileInfo.description}
                        </p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Capital para Investir</CardDescription>
                            <CardTitle className="text-2xl font-light">
                                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(capital)}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Reserva de Emergência</CardDescription>
                            <CardTitle className="text-2xl font-light">
                                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(emergencyFund)}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Total de Fundos</CardDescription>
                            <CardTitle className="text-2xl font-light">
                                {allocations.length}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* FINANCIAL PLANNING CTA - ALWAYS VISIBLE */}
                <Card className="border-2 border-vanguarda-accent/50 bg-gradient-to-br from-vanguarda-primary/10 to-oceano-primary/10">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-vanguarda-accent to-oceano-accent flex items-center justify-center shrink-0">
                                    <Target className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-1">Monte seu Planejamento Financeiro</h3>
                                    <p className="text-sm text-gray-600 ">
                                        Projete seu futuro: defina metas, aportes e veja quanto tempo para alcançar seus objetivos
                                    </p>
                                </div>
                            </div>
                            <Link href="/planejamento">
                                <Button
                                    size="lg"
                                    className="bg-gray-100 text-gray-900 hover:bg-gray-900 hover:text-white font-semibold shadow-lg"
                                >
                                    <span className="">Criar Planejamento</span>
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Adherence Score Card */}
                {adherenceScore && (
                    <Card className="border-2 border-vanguarda-accent/50 bg-gradient-to-br from-vanguarda-primary/10 to-vanguarda-secondary/5">
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 rounded-full bg-vanguarda-accent/20 flex items-center justify-center">
                                    <Target className="h-6 w-6 text-vanguarda-accent" />
                                </div>
                                <div>
                                    <CardTitle className="font-light text-2xl">Score de Aderência</CardTitle>
                                    <CardDescription>
                                        Alinhamento com a carteira recomendada
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-3 gap-6">
                                {/* Score */}
                                <div className="text-center">
                                    <div className="relative inline-block">
                                        <div className="text-6xl font-extralight mb-2">
                                            {adherenceScore.score}
                                            <span className="text-3xl text-gray-400">%</span>
                                        </div>
                                        <div className="flex gap-1 justify-center mb-2">
                                            {Array.from({ length: 10 }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`w-2 h-2 rounded-full ${i < Math.round(adherenceScore.score / 10)
                                                        ? "bg-vanguarda-accent"
                                                        : "bg-gray-300 "
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className={`font-medium ${getScoreLabel(adherenceScore.score).color}`}>
                                        {getScoreLabel(adherenceScore.score).label}
                                    </p>
                                    <p className="text-sm text-gray-600  mt-1">
                                        {adherenceScore.matchingFunds} de {adherenceScore.totalUserFunds} fundos alinhados
                                    </p>
                                </div>

                                {/* Matching Funds */}
                                <div>
                                    <h4 className="font-medium text-sm text-green-600  mb-2">
                                        ✓ Fundos Alinhados ({adherenceScore.matching.length})
                                    </h4>
                                    <div className="space-y-1 max-h-32 overflow-y-auto">
                                        {adherenceScore.matching.length > 0 ? (
                                            adherenceScore.matching.map((fund, i) => (
                                                <p key={i} className="text-xs text-gray-700  truncate">
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
                                    <h4 className="font-medium text-sm text-orange-600  mb-2">
                                        → Oportunidades ({adherenceScore.missing.length})
                                    </h4>
                                    <div className="space-y-1 max-h-32 overflow-y-auto">
                                        {adherenceScore.missing.slice(0, 5).map((fund, i) => (
                                            <p key={i} className="text-xs text-gray-700  truncate">
                                                {fund}
                                            </p>
                                        ))}
                                        {adherenceScore.missing.length > 5 && (
                                            <p className="text-xs text-gray-500 italic">
                                                +{adherenceScore.missing.length - 5} mais...
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Pie Charts - Current vs Recommended Comparison */}
                {adherenceScore && adherenceScore.totalUserFunds > 0 ? (
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-light">Comparação: Carteira Atual vs Recomendada</CardTitle>
                            <CardDescription>
                                Visualize como sua carteira atual se compara à nossa recomendação
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Current Portfolio Chart */}
                                <div>
                                    <h3 className="text-center font-medium mb-4 text-gray-700 ">
                                        Sua Carteira Atual
                                    </h3>
                                    <div className="flex items-center justify-center">
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={(() => {
                                                        if (userAssets.length === 0) return []

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

                                                        return Object.entries(typeMap).map(([name, value]) => ({
                                                            name,
                                                            value,
                                                            percentage: (value / Object.values(typeMap).reduce((a, b) => a + b, 0) * 100).toFixed(1)
                                                        }))
                                                    })()}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={100}
                                                    paddingAngle={2}
                                                    dataKey="value"
                                                    label={({ percentage }: any) => `${percentage}%`}
                                                >
                                                    {(() => {
                                                        if (userAssets.length === 0) return []

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

                                                        return Object.keys(typeMap).map((name, index) => (
                                                            <Cell key={`cell-current-${index}`} fill={COLORS[name as keyof typeof COLORS] || "#A1A1AA"} />
                                                        ))
                                                    })()}
                                                </Pie>
                                                <Tooltip
                                                    formatter={(value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Recommended Portfolio Chart */}
                                <div>
                                    <h3 className="text-center font-medium mb-4 text-gray-700 ">
                                        Carteira Recomendada ({profileInfo.title})
                                    </h3>
                                    <div className="flex items-center justify-center">
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={Object.entries(totals).map(([name, percentage]) => ({
                                                        name,
                                                        value: percentage,
                                                        percentage: percentage.toFixed(1)
                                                    }))}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={100}
                                                    paddingAngle={2}
                                                    dataKey="value"
                                                    label={({ percentage }: any) => `${percentage}%`}
                                                >
                                                    {Object.keys(totals).map((name, index) => (
                                                        <Cell key={`cell-recommended-${index}`} fill={COLORS[name as keyof typeof COLORS] || "#A1A1AA"} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    formatter={(value: number) => `${value.toFixed(1)}%`}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="mt-6 flex flex-wrap gap-4 justify-center">
                                {Object.keys(COLORS).map((colorKey) => (
                                    <div key={colorKey} className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded"
                                            style={{ backgroundColor: COLORS[colorKey as keyof typeof COLORS] }}
                                        />
                                        <span className="text-xs text-gray-600 ">{colorKey}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-light">Distribuição da Carteira</CardTitle>
                            <CardDescription>
                                Incluindo reserva de emergência
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="flex items-center justify-center">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={2}
                                                dataKey="value"
                                                label={({ percentage }: any) => `${percentage}%`}
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || "#A1A1AA"} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="space-y-3">
                                    {pieData.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50  rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-4 h-4 rounded"
                                                    style={{ backgroundColor: COLORS[item.name as keyof typeof COLORS] || "#A1A1AA" }}
                                                />
                                                <span className="text-sm">{item.name}</span>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-sm">{item.percentage}%</p>
                                                <p className="text-xs text-gray-600 ">
                                                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.value)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Performance Chart vs CDI */}
                <Card>
                    <CardHeader>
                        <CardTitle className="font-light">Performance 2024 vs CDI</CardTitle>
                        <CardDescription>
                            Comparação mensal acumulada
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            {/* Nominal Return */}
                            <div className="p-4 bg-gradient-to-br from-vanguarda-primary/10 to-vanguarda-secondary/10 rounded-lg border border-vanguarda-accent/30">
                                <p className="text-sm text-gray-600  mb-1">Retorno Nominal</p>
                                <p className="text-3xl font-light mb-1">{nominalReturn.toFixed(2)}%</p>
                                <p className="text-xs text-gray-500">Rentabilidade bruta em 2024</p>
                            </div>

                            {/* Real Return */}
                            <div className="p-4 bg-gradient-to-br from-ritmo-primary/10 to-ritmo-secondary/10 rounded-lg border border-ritmo-accent/30">
                                <p className="text-sm text-gray-600  mb-1">Ganho Real</p>
                                <p className="text-3xl font-light mb-1 text-ritmo-accent">{realReturn.toFixed(2)}%</p>
                                <p className="text-xs text-gray-500">Acima da inflação (IPCA {IPCA_LAST_12M.toFixed(2)}%)</p>
                            </div>

                            {/* vs CDI */}
                            <div className="p-4 bg-gradient-to-br from-oceano-primary/10 to-oceano-secondary/10 rounded-lg border border-oceano-accent/30">
                                <p className="text-sm text-gray-600  mb-1">vs CDI</p>
                                <p className="text-3xl font-light mb-1 text-oceano-accent">
                                    {gainVsCDI > 0 ? '+' : ''}{gainVsCDI.toFixed(2)}%
                                </p>
                                <p className="text-xs text-gray-500">CDI acumulado: 10.88%</p>
                            </div>
                        </div>

                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="month"
                                    stroke="#6B7280"
                                    style={{ fontSize: '12px' }}
                                />
                                <YAxis
                                    stroke="#6B7280"
                                    style={{ fontSize: '12px' }}
                                    tickFormatter={(value) => `${value}%`}
                                />
                                <Tooltip
                                    formatter={(value: number) => `${value.toFixed(2)}%`}
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="Carteira"
                                    stroke="#7BA3C4"
                                    strokeWidth={3}
                                    dot={{ fill: '#7BA3C4', r: 4 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="CDI"
                                    stroke="#A1A1AA"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    dot={{ fill: '#A1A1AA', r: 3 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Allocation Totals */}
                <Card>
                    <CardHeader>
                        <CardTitle className="font-light">Distribuição por Tipo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-4 gap-4">
                            {Object.entries(totals)
                                .sort((a, b) => b[1] - a[1])
                                .map(([type, percentage]) => (
                                    <div key={type} className="text-center p-4 bg-gray-50  rounded-lg">
                                        <div className="text-2xl font-light mb-1">{percentage.toFixed(1)}%</div>
                                        <div className="text-xs text-gray-600 ">{type}</div>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Fund List */}
                <Card>
                    <CardHeader>
                        <CardTitle className="font-light">Fundos Recomendados</CardTitle>
                        <CardDescription>
                            Esta carteira é composta por {allocations.length} fundos selecionados
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {allocations.map((fund, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 bg-gray-50  rounded-lg hover:bg-gray-100 :bg-gray-800 transition-colors"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{fund.name}</p>
                                        <p className="text-xs text-gray-600 ">{fund.type}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">{fund.percentage}%</p>
                                        <p className="text-xs text-gray-600 ">
                                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(capital * (fund.percentage / 100))}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>


                {/* International Portfolio Option */}
                {portfolioType !== "OCEANO" && (
                    <Card className="border-2 border-oceano-accent/30 bg-gradient-to-br from-oceano-primary/5 to-oceano-secondary/5">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#89C4D4] to-[#3D96AB] flex items-center justify-center text-4xl flex-shrink-0">
                                    <Globe className="w-10 h-10 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-light mb-2">Quer Diversificação Internacional?</h3>
                                    <p className="text-gray-600  mb-4">
                                        Conheça a <strong>Carteira Oceano</strong>: investimentos globais com Bitcoin, Ouro e mercados americanos.
                                        Proteção cambial e acesso aos melhores ativos do mundo.
                                    </p>
                                    <Link href="/portfolio/oceano">
                                        <Button variant="outline" className="border-oceano-accent text-oceano-accent hover:bg-oceano-primary/10">
                                            Ver Carteira Internacional
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
