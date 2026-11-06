"use client"

import React, { Suspense, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
    BarChart3, TrendingUp, ShieldCheck, ChevronRight, ArrowUpRight,
    ArrowDownRight, CheckCircle2, AlertCircle, Percent, Calendar, Layers,
    Activity, Info, Sparkles, Filter, ExternalLink, RefreshCw
} from "lucide-react"
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend
} from "recharts"

import diagData from "@/data/diagnostic-data.json"
import {
    RECOMMENDED_PORTFOLIOS,
    TIER_ORDER,
    TIER_LABEL,
    PERFIL_ORDER
} from "@/data/portfoliosData"
import {
    calculateYearlyMonthlyMatrix,
    calculateWindowMetrics,
    calculateConsistencyStats,
    generateCumulativeSeries,
    getPortfolioAssets,
    getPortfolioByFamilyAndProfile,
    getHistoricalMeta,
    MONTH_NAMES_PT,
    type YearRow,
    type WindowMetric,
    type ConsistencyStats,
    type ChartPoint,
    type PortfolioAssetDetail
} from "@/lib/portfolio-analytics"

const FAMILY_OPTIONS = [
    { id: "Geral", label: "Geral Normal", description: "Acima de R$ 100k" },
    { id: "Geral Light", label: "Geral Light", description: "Até R$ 100k" },
    { id: "Qualificado", label: "Qualificado (IQ)", description: "Acima de R$ 1M" },
]

function formatPct(val: number | null | undefined, digits: number = 2, withSign: boolean = true): string {
    if (val === null || val === undefined || isNaN(val)) return "-"
    const sign = withSign && val > 0 ? "+" : ""
    return `${sign}${val.toLocaleString("pt-BR", { minimumFractionDigits: digits, maximumFractionDigits: digits })}%`
}

function formatNumber(val: number | null | undefined, digits: number = 2): string {
    if (val === null || val === undefined || isNaN(val)) return "-"
    return val.toLocaleString("pt-BR", { minimumFractionDigits: digits, maximumFractionDigits: digits })
}

function AnaliseCarteirasContent() {
    const searchParams = useSearchParams()

    // Initialize state from URL params if available, else default to "Geral" and "Ritmo"
    const initialFamily = searchParams.get("family") || "Geral"
    const initialProfile = searchParams.get("profile") || "Ritmo"

    const [selectedFamily, setSelectedFamily] = useState<string>(initialFamily)
    const [selectedProfile, setSelectedProfile] = useState<string>(initialProfile)

    // Chart window filter: 6, 12, 24, 36, or 0 (All)
    const [chartWindow, setChartWindow] = useState<number>(0)

    // Benchmark visibility toggles for the chart
    const [showCdi, setShowCdi] = useState<boolean>(true)
    const [showIpca, setShowIpca] = useState<boolean>(true)
    const [showIbov, setShowIbov] = useState<boolean>(false)

    // Meta & portfolio data
    const meta = useMemo(() => getHistoricalMeta(), [])

    const { diag, rec } = useMemo(() => {
        return getPortfolioByFamilyAndProfile(selectedFamily, selectedProfile)
    }, [selectedFamily, selectedProfile])

    // Returns array for current portfolio
    const returns = useMemo(() => {
        return diag?.returns || []
    }, [diag])

    // Calculations
    const matrix = useMemo<YearRow[]>(() => {
        if (!returns.length) return []
        return calculateYearlyMonthlyMatrix(returns, meta.months, meta.cdi)
    }, [returns, meta])

    const windows = useMemo<WindowMetric[]>(() => {
        if (!returns.length) return []
        return calculateWindowMetrics(returns, meta.months, meta.cdi, meta.ipca)
    }, [returns, meta])

    const consistency = useMemo<ConsistencyStats>(() => {
        if (!returns.length) {
            return {
                totalMonths: 0,
                positiveMonths: 0,
                positiveMonthsPct: 0,
                negativeMonths: 0,
                negativeMonthsPct: 0,
                aboveCdiMonths: 0,
                aboveCdiMonthsPct: 0,
                belowCdiMonths: 0,
                belowCdiMonthsPct: 0,
                bestMonth: { value: 0, label: "-" },
                worstMonth: { value: 0, label: "-" },
                maxDrawdown: 0,
                avgMonthlyReturn: 0,
                annualizedNominal: 0,
                annualizedReal: 0
            }
        }
        return calculateConsistencyStats(returns, meta.months, meta.cdi, diagData.ipcaAnnual)
    }, [returns, meta])

    const chartSeries = useMemo<ChartPoint[]>(() => {
        if (!returns.length) return []
        return generateCumulativeSeries(returns, meta.months, meta.cdi, meta.ipca, meta.ibov, chartWindow)
    }, [returns, meta, chartWindow])

    const assets = useMemo<PortfolioAssetDetail[]>(() => {
        if (!rec) return []
        return getPortfolioAssets(rec)
    }, [rec])

    // 12M metric for quick badge
    const metric12M = windows.find(w => w.key === "12M")
    const metricTotal = windows.find(w => w.key === "TOTAL")

    // Class totals for Zaga, Meio, Ataque
    const classDistribution = useMemo(() => {
        let zaga = 0, meio = 0, ataque = 0
        assets.forEach(a => {
            if (a.classe === "Zaga") zaga += a.weight
            else if (a.classe === "Ataque") ataque += a.weight
            else meio += a.weight
        })
        return { zaga, meio, ataque }
    }, [assets])

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header / Identity Banner */}
            <div className="bg-[#FAF8F5] border border-[#E4E0D7] rounded-3xl p-6 md:p-8 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-5 border-b border-[#E4E0D7]/60 pb-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#8D97A5] tracking-wide uppercase">
                        <Link href="/dashboard" className="hover:text-[#123044] transition-colors">Dashboard</Link>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <Link href="/dashboard/carteira" className="hover:text-[#123044] transition-colors">Carteiras</Link>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="text-[#1F674F] font-bold">Análise Detalhada (Estilo Mais Retorno)</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E8F3EE] text-[#1F674F] border border-[#BCD6CA]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Histórico Auditado ARVO · 46 Meses
                        </span>
                        <Link
                            href="/dashboard/carteira"
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-[#123044] bg-[#FFFFFF] border border-[#E4E0D7] hover:bg-[#F0ECE1] transition-colors"
                        >
                            Ver Minha Carteira
                            <ArrowUpRight className="w-3 h-3" />
                        </Link>
                    </div>
                </div>

                {/* Title & Subtitle */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
                    <div>
                        <div className="flex flex-wrap items-center gap-2.5 mb-2">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#123044] tracking-tight">
                                ARVO {selectedProfile}
                            </h1>
                            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#123044] text-[#FAF8F5]">
                                {selectedFamily === "Geral Light" ? "Light (até R$ 100k)" : selectedFamily === "Qualificado" ? "Qualificado (IQ)" : "Geral Normal (> R$ 100k)"}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F0ECE1] text-[#123044] border border-[#E4E0D7]">
                                Benchmark: CDI
                            </span>
                        </div>
                        <p className="text-sm text-[#5A6878] max-w-3xl leading-relaxed">
                            Análise estatística completa e histórico de rentabilidade cota a cota no padrão visual Mais Retorno. 
                            Histórico de <strong>Jan/2023 a Out/2026</strong> baseado na Planilha Oficial de Gestão ARVO.
                        </p>
                    </div>

                    {/* Quick Profile Summary Badge */}
                    <div className="shrink-0 flex items-center gap-4 bg-[#FFFFFF] border border-[#E4E0D7] rounded-2xl p-4 shadow-2xs">
                        <div className="w-12 h-12 rounded-xl bg-[#E8F3EE] text-[#1F674F] flex items-center justify-center font-bold text-lg font-serif">
                            {selectedProfile.charAt(0)}
                        </div>
                        <div>
                            <div className="text-[11px] font-bold text-[#8D97A5] uppercase tracking-wider">Estratégia ARVO</div>
                            <div className="text-base font-bold text-[#123044]">Robustez 360°</div>
                            <div className="text-xs font-semibold text-[#1F674F]">
                                {assets.length} ativos selecionados
                            </div>
                        </div>
                    </div>
                </div>

                {/* Portfolio Selector Bar */}
                <div className="space-y-4 pt-4 border-t border-[#E4E0D7]">
                    {/* Family Selector */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-[#123044] uppercase tracking-wider mr-2">Família:</span>
                        {FAMILY_OPTIONS.map(fam => {
                            const isSelected = selectedFamily === fam.id
                            return (
                                <button
                                    key={fam.id}
                                    type="button"
                                    onClick={() => setSelectedFamily(fam.id)}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                        isSelected
                                            ? "bg-[#123044] text-[#FFFFFF] shadow-xs"
                                            : "bg-[#FFFFFF] text-[#5A6878] hover:text-[#123044] border border-[#E4E0D7] hover:border-[#123044]/30"
                                    }`}
                                >
                                    {fam.label}
                                </button>
                            )
                        })}
                    </div>

                    {/* Profile Selector (9 levels) */}
                    <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-bold text-[#123044] uppercase tracking-wider mr-2">Perfil:</span>
                        {PERFIL_ORDER.map(perf => {
                            const isSelected = selectedProfile.toLowerCase() === perf.toLowerCase()
                            return (
                                <button
                                    key={perf}
                                    type="button"
                                    onClick={() => setSelectedProfile(perf)}
                                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                        isSelected
                                            ? "bg-[#1F674F] text-[#FFFFFF] font-bold shadow-xs scale-102"
                                            : "bg-[#FFFFFF] text-[#5A6878] hover:text-[#123044] border border-[#E4E0D7] hover:border-[#1F674F]/40"
                                    }`}
                                >
                                    {perf}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* KPI Cards Grid (Mais Retorno Style) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                {/* 1. Retorno Acumulado */}
                <div className="bg-[#FFFFFF] border border-[#E4E0D7] rounded-2xl p-4 shadow-2xs hover:border-[#1F674F]/40 transition-colors">
                    <div className="text-[11px] font-semibold text-[#8D97A5] uppercase tracking-wide mb-1">
                        Retorno Acumulado
                    </div>
                    <div className="text-xl sm:text-2xl font-mono font-bold text-[#1F674F] tracking-tight">
                        {formatPct(metricTotal?.portfolioReturn)}
                    </div>
                    <div className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-[#5A6878]">
                        <span className="px-1.5 py-0.5 rounded bg-[#E8F3EE] text-[#1F674F] font-mono font-bold">
                            {formatNumber(metricTotal?.pctOfCdi, 1)}% do CDI
                        </span>
                    </div>
                </div>

                {/* 2. Retorno 12 Meses */}
                <div className="bg-[#FFFFFF] border border-[#E4E0D7] rounded-2xl p-4 shadow-2xs hover:border-[#1F674F]/40 transition-colors">
                    <div className="text-[11px] font-semibold text-[#8D97A5] uppercase tracking-wide mb-1">
                        Retorno 12 Meses
                    </div>
                    <div className="text-xl sm:text-2xl font-mono font-bold text-[#123044] tracking-tight">
                        {formatPct(metric12M?.portfolioReturn)}
                    </div>
                    <div className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-[#5A6878]">
                        <span className="px-1.5 py-0.5 rounded bg-[#F0ECE1] text-[#123044] font-mono font-bold">
                            {formatNumber(metric12M?.pctOfCdi, 1)}% do CDI
                        </span>
                    </div>
                </div>

                {/* 3. Retorno Anualizado */}
                <div className="bg-[#FFFFFF] border border-[#E4E0D7] rounded-2xl p-4 shadow-2xs hover:border-[#1F674F]/40 transition-colors">
                    <div className="text-[11px] font-semibold text-[#8D97A5] uppercase tracking-wide mb-1">
                        Retorno Anualizado
                    </div>
                    <div className="text-xl sm:text-2xl font-mono font-bold text-[#123044] tracking-tight">
                        {formatPct(consistency.annualizedNominal)} a.a.
                    </div>
                    <div className="mt-1.5 text-[11px] font-semibold text-[#1F674F]">
                        Real: IPCA + {formatNumber(consistency.annualizedReal, 1)}% a.a.
                    </div>
                </div>

                {/* 4. Volatilidade Anualizada */}
                <div className="bg-[#FFFFFF] border border-[#E4E0D7] rounded-2xl p-4 shadow-2xs hover:border-[#1F674F]/40 transition-colors">
                    <div className="text-[11px] font-semibold text-[#8D97A5] uppercase tracking-wide mb-1">
                        Volatilidade Anualizada
                    </div>
                    <div className="text-xl sm:text-2xl font-mono font-bold text-[#123044] tracking-tight">
                        {metricTotal?.annualizedVol !== null && metricTotal?.annualizedVol !== undefined ? `${formatNumber(metricTotal.annualizedVol, 2)}% a.a.` : "-"}
                    </div>
                    <div className="mt-1.5 text-[11px] font-semibold text-[#8D97A5]">
                        {metricTotal && metricTotal.annualizedVol !== null && metricTotal.annualizedVol !== undefined && metricTotal.annualizedVol < 2 ? "Baixíssimo Risco" : metricTotal && metricTotal.annualizedVol !== null && metricTotal.annualizedVol !== undefined && metricTotal.annualizedVol < 5 ? "Risco Controlado" : "Risco Moderado/Alto"}
                    </div>
                </div>

                {/* 5. Índice de Sharpe */}
                <div className="bg-[#FFFFFF] border border-[#E4E0D7] rounded-2xl p-4 shadow-2xs hover:border-[#1F674F]/40 transition-colors">
                    <div className="text-[11px] font-semibold text-[#8D97A5] uppercase tracking-wide mb-1">
                        Índice de Sharpe
                    </div>
                    <div className={`text-xl sm:text-2xl font-mono font-bold tracking-tight ${metricTotal?.sharpeRatio !== null && metricTotal?.sharpeRatio !== undefined && metricTotal.sharpeRatio < 0 ? "text-[#B91C1C]" : "text-[#1F674F]"}`}>
                        {metricTotal?.sharpeRatio !== null && metricTotal?.sharpeRatio !== undefined ? formatNumber(metricTotal.sharpeRatio, 2) : "N/A"}
                    </div>
                    <div className="mt-1.5 text-[11px] font-semibold text-[#5A6878]">
                        Excesso s/ CDI / Risco
                    </div>
                </div>

                {/* 6. Extremos (Melhor / Pior Mês) */}
                <div className="bg-[#FFFFFF] border border-[#E4E0D7] rounded-2xl p-4 shadow-2xs hover:border-[#1F674F]/40 transition-colors">
                    <div className="text-[11px] font-semibold text-[#8D97A5] uppercase tracking-wide mb-1">
                        Melhor / Pior Mês
                    </div>
                    <div className="text-sm font-mono font-bold text-[#1F674F] leading-tight">
                        {formatPct(consistency.bestMonth.value)}
                        <span className="text-[10px] text-[#8D97A5] font-sans font-normal ml-1">({consistency.bestMonth.label})</span>
                    </div>
                    <div className="text-sm font-mono font-bold text-[#B91C1C] leading-tight mt-1">
                        {formatPct(consistency.worstMonth.value)}
                        <span className="text-[10px] text-[#8D97A5] font-sans font-normal ml-1">({consistency.worstMonth.label})</span>
                    </div>
                </div>
            </div>

            {/* Sticky Subnavigation Anchor Bar (Mais Retorno Style) */}
            <div className="sticky top-14 md:top-0 z-20 bg-[#FFFFFF]/90 backdrop-blur-md border-y border-[#E4E0D7] -mx-3 sm:-mx-6 md:-mx-8 px-3 sm:px-6 md:px-8 py-2.5 flex items-center justify-between gap-2 overflow-x-auto shadow-2xs [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex items-center gap-1 sm:gap-2">
                    <a href="#grafico" className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#123044] hover:bg-[#F0ECE1] transition-colors whitespace-nowrap">
                        Gráfico
                    </a>
                    <a href="#tabela-historica" className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#123044] hover:bg-[#F0ECE1] transition-colors whitespace-nowrap">
                        Tabela Mês a Mês
                    </a>
                    <a href="#indices" className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#123044] hover:bg-[#F0ECE1] transition-colors whitespace-nowrap">
                        Índices & Janelas
                    </a>
                    <a href="#consistencia" className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#123044] hover:bg-[#F0ECE1] transition-colors whitespace-nowrap">
                        Consistência
                    </a>
                    <a href="#composicao" className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#123044] hover:bg-[#F0ECE1] transition-colors whitespace-nowrap">
                        Composição de Ativos
                    </a>
                </div>

                <div className="text-xs text-[#8D97A5] hidden sm:block">
                    {selectedFamily} · {selectedProfile}
                </div>
            </div>

            {/* SECTION 1: Gráfico de Rentabilidade Interativo */}
            <section id="grafico" className="bg-[#FFFFFF] border border-[#E4E0D7] rounded-3xl p-6 shadow-xs scroll-mt-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <div className="text-xs font-bold text-[#1F674F] uppercase tracking-wider mb-1">
                            Desempenho Acumulado
                        </div>
                        <h2 className="text-xl md:text-2xl font-serif font-bold text-[#123044]">
                            Evolução da Rentabilidade da Carteira
                        </h2>
                        <p className="text-xs text-[#5A6878] mt-0.5">
                            Comparativo histórico de retorno acumulado (base 0%) contra benchmarks de mercado
                        </p>
                    </div>

                    {/* Window Filters & Toggles */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Benchmarks Toggles */}
                        <div className="flex items-center gap-1.5 bg-[#FAF8F5] border border-[#E4E0D7] rounded-xl p-1">
                            <button
                                type="button"
                                onClick={() => setShowCdi(!showCdi)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                                    showCdi ? "bg-[#123044] text-[#FFFFFF]" : "text-[#8D97A5] hover:text-[#123044]"
                                }`}
                            >
                                CDI
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowIpca(!showIpca)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                                    showIpca ? "bg-[#C27803] text-[#FFFFFF]" : "text-[#8D97A5] hover:text-[#123044]"
                                }`}
                            >
                                IPCA
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowIbov(!showIbov)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                                    showIbov ? "bg-[#2563EB] text-[#FFFFFF]" : "text-[#8D97A5] hover:text-[#123044]"
                                }`}
                            >
                                IBOV
                            </button>
                        </div>

                        {/* Time Windows */}
                        <div className="flex items-center gap-1 bg-[#FAF8F5] border border-[#E4E0D7] rounded-xl p-1">
                            {[
                                { label: "6M", val: 6 },
                                { label: "12M", val: 12 },
                                { label: "24M", val: 24 },
                                { label: "36M", val: 36 },
                                { label: "MÁX", val: 0 },
                            ].map(item => (
                                <button
                                    key={item.label}
                                    type="button"
                                    onClick={() => setChartWindow(item.val)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                        chartWindow === item.val
                                            ? "bg-[#1F674F] text-[#FFFFFF] shadow-2xs"
                                            : "text-[#5A6878] hover:text-[#123044]"
                                    }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Chart Container */}
                <div className="h-[340px] sm:h-[400px] w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartSeries} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E4E0D7" vertical={false} />
                            <XAxis
                                dataKey="label"
                                stroke="#8D97A5"
                                fontSize={11}
                                tickLine={false}
                                axisLine={{ stroke: "#E4E0D7" }}
                            />
                            <YAxis
                                stroke="#8D97A5"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(val) => `${val}%`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#FFFFFF",
                                    borderColor: "#E4E0D7",
                                    borderRadius: "16px",
                                    boxShadow: "0 4px 20px rgba(18, 48, 68, 0.08)",
                                    fontSize: "12px",
                                    padding: "12px 16px"
                                }}
                                formatter={(value: any, name: any) => {
                                    const valNum = typeof value === "number" ? value : parseFloat(value)
                                    const labelMap: Record<string, string> = {
                                        portfolio: `ARVO ${selectedProfile}`,
                                        cdi: "CDI",
                                        ipca: "IPCA",
                                        ibov: "Ibovespa"
                                    }
                                    return [`${valNum >= 0 ? "+" : ""}${valNum.toFixed(2)}%`, labelMap[name] || name]
                                }}
                            />
                            <Legend
                                verticalAlign="top"
                                align="right"
                                iconType="circle"
                                wrapperStyle={{ paddingBottom: "14px", fontSize: "12px" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="portfolio"
                                name={`ARVO ${selectedProfile}`}
                                stroke="#1F674F"
                                strokeWidth={3}
                                dot={false}
                                activeDot={{ r: 6, fill: "#1F674F" }}
                            />
                            {showCdi && (
                                <Line
                                    type="monotone"
                                    dataKey="cdi"
                                    name="CDI"
                                    stroke="#123044"
                                    strokeWidth={2}
                                    strokeDasharray="4 4"
                                    dot={false}
                                />
                            )}
                            {showIpca && (
                                <Line
                                    type="monotone"
                                    dataKey="ipca"
                                    name="IPCA"
                                    stroke="#C27803"
                                    strokeWidth={1.8}
                                    dot={false}
                                />
                            )}
                            {showIbov && (
                                <Line
                                    type="monotone"
                                    dataKey="ibov"
                                    name="Ibovespa"
                                    stroke="#2563EB"
                                    strokeWidth={1.5}
                                    dot={false}
                                />
                            )}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </section>

            {/* SECTION 2: Tabela de Rentabilidade Histórica (Mês a Mês por Ano - Estilo Mais Retorno) */}
            <section id="tabela-historica" className="bg-[#FFFFFF] border border-[#E4E0D7] rounded-3xl p-6 shadow-xs scroll-mt-20">
                <div className="mb-6">
                    <div className="text-xs font-bold text-[#1F674F] uppercase tracking-wider mb-1">
                        Auditoria Mensal
                    </div>
                    <h2 className="text-xl md:text-2xl font-serif font-bold text-[#123044]">
                        Rentabilidade Histórica (Mês a Mês)
                    </h2>
                    <p className="text-xs text-[#5A6878] mt-0.5">
                        Retornos absolutos mensais da carteira e percentual do CDI correspondente logo abaixo de Jan/2023 a Out/2026
                    </p>
                </div>

                {/* Table Responsive Wrapper */}
                <div className="overflow-x-auto rounded-2xl border border-[#E4E0D7] shadow-2xs [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <table className="w-full text-xs text-center border-collapse table-auto">
                        <thead className="bg-[#123044] text-[#FFFFFF]">
                            <tr className="border-b border-[#123044]">
                                <th className="py-2.5 px-2 text-left font-bold text-[11px] uppercase tracking-wider sticky left-0 bg-[#123044] z-10 border-r border-[#1e4157] w-12 shrink-0">
                                    ANO
                                </th>
                                <th className="py-2.5 px-2 text-left font-bold text-[11px] uppercase tracking-wider min-w-[80px] max-w-[105px]">
                                    Carteira
                                </th>
                                {MONTH_NAMES_PT.map(m => (
                                    <th key={m} className="py-2.5 px-1 text-center font-bold text-[11px] text-[#FAF8F5]">
                                        {m}
                                    </th>
                                ))}
                                <th className="py-2.5 px-1.5 text-center font-bold text-[11px] text-[#FAF8F5] border-l border-[#1e4157] whitespace-nowrap">
                                    No ano
                                </th>
                                <th className="py-2.5 px-1.5 text-center font-bold text-[11px] text-[#FAF8F5] border-l border-[#1e4157] whitespace-nowrap">
                                    Acumulado
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E4E0D7]">
                            {matrix.map((row) => (
                                <tr key={row.year} className="hover:bg-[#FAF8F5]/80 transition-colors">
                                    {/* Column 1: ANO */}
                                    <td className="py-2 px-2 font-bold text-left sticky left-0 bg-[#FFFFFF] z-10 border-r border-[#E4E0D7] text-[#123044] text-[11px] font-mono">
                                        {row.year}
                                    </td>

                                    {/* Column 2: Portfolio Name + % CDI */}
                                    <td className="py-2 px-2 text-left bg-[#FFFFFF] max-w-[105px]">
                                        <div className="font-bold text-[#123044] text-[11px] leading-tight truncate">
                                            ARVO {selectedProfile.toUpperCase()}
                                        </div>
                                        <div className="text-[9.5px] text-[#8D97A5] font-normal tracking-wide mt-0.5">
                                            % CDI
                                        </div>
                                    </td>

                                    {/* Month Columns: Return on top, % CDI below */}
                                    {row.months.map((cell, idx) => {
                                        if (!cell) {
                                            return (
                                                <td key={idx} className="py-2 px-1 text-center font-mono">
                                                    <div className="text-slate-300 text-[11px] leading-tight">-</div>
                                                    <div className="text-slate-300 text-[9.5px] leading-tight mt-0.5">-</div>
                                                </td>
                                            )
                                        }

                                        const isNeg = cell.returnPct !== null && cell.returnPct < 0
                                        return (
                                            <td key={idx} className="py-2 px-1 text-center font-mono">
                                                <div className={`font-bold text-[11px] leading-tight ${isNeg ? "text-[#B91C1C]" : "text-[#123044]"}`}>
                                                    {cell.returnPct !== null
                                                        ? `${cell.returnPct.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
                                                        : "-"}
                                                </div>
                                                <div className="text-[9.5px] text-[#8D97A5] font-normal leading-tight mt-0.5">
                                                    {cell.pctOfCdi !== null
                                                        ? `${cell.pctOfCdi.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
                                                        : "-"}
                                                </div>
                                            </td>
                                        )
                                    })}

                                    {/* No Ano (YTD) */}
                                    <td className="py-2 px-1.5 text-center font-mono bg-[#FAF8F5] border-l border-[#E4E0D7]">
                                        <div className={`font-bold text-[11px] leading-tight ${row.ytdReturn < 0 ? "text-[#B91C1C]" : "text-[#123044]"}`}>
                                            {row.ytdReturn.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                                        </div>
                                        <div className="text-[9.5px] text-[#8D97A5] font-normal leading-tight mt-0.5">
                                            {row.ytdPctOfCdi !== null
                                                ? `${row.ytdPctOfCdi.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
                                                : "-"}
                                        </div>
                                    </td>

                                    {/* Acumulado */}
                                    <td className="py-2 px-1.5 text-center font-mono bg-[#F0ECE1]/50 border-l border-[#E4E0D7]">
                                        <div className={`font-extrabold text-[11px] leading-tight ${row.accumReturn < 0 ? "text-[#B91C1C]" : "text-[#123044]"}`}>
                                            {row.accumReturn.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                                        </div>
                                        <div className="text-[9.5px] text-[#8D97A5] font-normal leading-tight mt-0.5">
                                            {row.accumPctOfCdi !== null
                                                ? `${row.accumPctOfCdi.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
                                                : "-"}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* SECTION 3: Tabela de Índices de Rentabilidade (Janelas de Performance) */}
            <section id="indices" className="bg-[#FFFFFF] border border-[#E4E0D7] rounded-3xl p-6 shadow-xs scroll-mt-20">
                <div className="mb-6">
                    <div className="text-xs font-bold text-[#1F674F] uppercase tracking-wider mb-1">
                        Janelas Temporais
                    </div>
                    <h2 className="text-xl md:text-2xl font-serif font-bold text-[#123044]">
                        Índices de Rentabilidade & Volatilidade
                    </h2>
                    <p className="text-xs text-[#5A6878] mt-0.5">
                        Performance consolidada por janelas móveis de investimento
                    </p>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-[#E4E0D7] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <table className="w-full text-xs text-center border-collapse table-auto">
                        <thead>
                            <tr className="bg-[#FAF8F5] border-b border-[#E4E0D7] text-[#123044] font-bold">
                                <th className="py-3 px-4 text-left sticky left-0 bg-[#FAF8F5] z-10 border-r border-[#E4E0D7]">
                                    Indicador
                                </th>
                                {windows.map(w => (
                                    <th key={w.key} className="py-3 px-3 font-semibold text-[#5A6878] whitespace-nowrap">
                                        {w.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E4E0D7]">
                            {/* Row 1: Rentabilidade Carteira */}
                            <tr className="hover:bg-[#FAF8F5]/60 transition-colors font-mono">
                                <td className="py-3 px-4 font-bold text-left sticky left-0 bg-[#FFFFFF] z-10 border-r border-[#E4E0D7] text-[#123044] font-sans">
                                    Rentabilidade Carteira
                                </td>
                                {windows.map(w => (
                                    <td key={w.key} className="py-3 px-3 font-bold text-[#1F674F]">
                                        {formatPct(w.portfolioReturn, 2)}
                                    </td>
                                ))}
                            </tr>

                            {/* Row 2: Rentabilidade CDI */}
                            <tr className="hover:bg-[#FAF8F5]/60 transition-colors font-mono text-[#5A6878]">
                                <td className="py-3 px-4 font-semibold text-left sticky left-0 bg-[#FFFFFF] z-10 border-r border-[#E4E0D7] text-[#5A6878] font-sans">
                                    Rentabilidade CDI
                                </td>
                                {windows.map(w => (
                                    <td key={w.key} className="py-3 px-3">
                                        {formatPct(w.cdiReturn, 2)}
                                    </td>
                                ))}
                            </tr>

                            {/* Row 3: % do CDI */}
                            <tr className="hover:bg-[#FAF8F5]/60 transition-colors font-mono bg-[#E8F3EE]/30">
                                <td className="py-3 px-4 font-bold text-left sticky left-0 bg-[#FFFFFF] z-10 border-r border-[#E4E0D7] text-[#1F674F] font-sans">
                                    % do CDI
                                </td>
                                {windows.map(w => (
                                    <td key={w.key} className="py-3 px-3 font-bold text-[#1F674F]">
                                        {w.pctOfCdi !== null ? `${w.pctOfCdi.toFixed(1)}%` : "-"}
                                    </td>
                                ))}
                            </tr>

                            {/* Row 4: IPCA */}
                            <tr className="hover:bg-[#FAF8F5]/60 transition-colors font-mono text-[#5A6878]">
                                <td className="py-3 px-4 font-semibold text-left sticky left-0 bg-[#FFFFFF] z-10 border-r border-[#E4E0D7] text-[#5A6878] font-sans">
                                    IPCA (Inflação)
                                </td>
                                {windows.map(w => (
                                    <td key={w.key} className="py-3 px-3">
                                        {formatPct(w.ipcaReturn, 2)}
                                    </td>
                                ))}
                            </tr>

                            {/* Row 5: Volatilidade Anualizada */}
                            <tr className="hover:bg-[#FAF8F5]/60 transition-colors font-mono text-[#123044]">
                                <td className="py-3 px-4 font-bold text-left sticky left-0 bg-[#FFFFFF] z-10 border-r border-[#E4E0D7] text-[#123044] font-sans">
                                    Volatilidade Anualizada
                                </td>
                                {windows.map(w => (
                                    <td key={w.key} className="py-3 px-3">
                                        {w.annualizedVol !== null ? `${formatNumber(w.annualizedVol, 2)}%` : "-"}
                                    </td>
                                ))}
                            </tr>

                            {/* Row 6: Índice de Sharpe */}
                            <tr className="hover:bg-[#FAF8F5]/60 transition-colors font-mono text-[#123044]">
                                <td className="py-3 px-4 font-bold text-left sticky left-0 bg-[#FFFFFF] z-10 border-r border-[#E4E0D7] text-[#123044] font-sans">
                                    Índice de Sharpe (a.a.)
                                </td>
                                {windows.map(w => {
                                    const sharpeClass =
                                        w.sharpeRatio === null
                                            ? "text-[#5A6878]"
                                            : w.sharpeRatio > 0
                                            ? "text-[#1F674F] font-bold"
                                            : w.sharpeRatio < 0
                                            ? "text-[#B91C1C] font-bold"
                                            : "text-[#5A6878] font-bold"
                                    return (
                                        <td key={w.key} className={`py-3 px-3 ${sharpeClass}`}>
                                            {w.sharpeRatio !== null ? formatNumber(w.sharpeRatio, 2) : "-"}
                                        </td>
                                    )
                                })}
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="mt-3 flex items-start sm:items-center gap-1.5 text-[11px] text-[#8D97A5]">
                    <Info className="w-3.5 h-3.5 shrink-0 text-[#8D97A5] mt-0.5 sm:mt-0" />
                    <span>
                        * Conforme diretrizes da ANBIMA e boas práticas estatísticas, a volatilidade amostral requer ao menos 2 meses e o Índice de Sharpe anualizado exige série mínima de 12 meses.
                    </span>
                </div>
            </section>

            {/* SECTION 4: Tabela de Estatísticas & Consistência */}
            <section id="consistencia" className="bg-[#FFFFFF] border border-[#E4E0D7] rounded-3xl p-6 shadow-xs scroll-mt-20">
                <div className="mb-6">
                    <div className="text-xs font-bold text-[#1F674F] uppercase tracking-wider mb-1">
                        Comportamento & Resiliência
                    </div>
                    <h2 className="text-xl md:text-2xl font-serif font-bold text-[#123044]">
                        Estatísticas de Consistência & Risco
                    </h2>
                    <p className="text-xs text-[#5A6878] mt-0.5">
                        Métricas de acerto, preservação de capital e distribuição de retornos mensais
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1: Meses Positivos vs Negativos */}
                    <div className="bg-[#FAF8F5] border border-[#E4E0D7] rounded-2xl p-5 flex flex-col justify-between">
                        <div>
                            <div className="text-xs font-bold text-[#123044] uppercase tracking-wider mb-3">
                                Meses Positivos vs Negativos
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-xs font-semibold mb-1">
                                        <span className="text-[#1F674F]">Positivos ({consistency.positiveMonths} meses)</span>
                                        <span className="font-mono text-[#1F674F]">{formatNumber(consistency.positiveMonthsPct, 1)}%</span>
                                    </div>
                                    <div className="w-full bg-[#E4E0D7] h-2.5 rounded-full overflow-hidden">
                                        <div
                                            className="bg-[#1F674F] h-full rounded-full transition-all duration-500"
                                            style={{ width: `${consistency.positiveMonthsPct}%` }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs font-semibold mb-1">
                                        <span className="text-[#B91C1C]">Negativos ({consistency.negativeMonths} meses)</span>
                                        <span className="font-mono text-[#B91C1C]">{formatNumber(consistency.negativeMonthsPct, 1)}%</span>
                                    </div>
                                    <div className="w-full bg-[#E4E0D7] h-2.5 rounded-full overflow-hidden">
                                        <div
                                            className="bg-[#B91C1C] h-full rounded-full transition-all duration-500"
                                            style={{ width: `${consistency.negativeMonthsPct}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-[#E4E0D7] text-[11px] text-[#5A6878]">
                            Total de <strong>{consistency.totalMonths} meses</strong> auditados (Jan/2023 - Out/2026).
                        </div>
                    </div>

                    {/* Card 2: Meses Acima vs Abaixo do CDI */}
                    <div className="bg-[#FAF8F5] border border-[#E4E0D7] rounded-2xl p-5 flex flex-col justify-between">
                        <div>
                            <div className="text-xs font-bold text-[#123044] uppercase tracking-wider mb-3">
                                Desempenho contra o CDI
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-xs font-semibold mb-1">
                                        <span className="text-[#1F674F]">Acima do CDI ({consistency.aboveCdiMonths} meses)</span>
                                        <span className="font-mono text-[#1F674F]">{formatNumber(consistency.aboveCdiMonthsPct, 1)}%</span>
                                    </div>
                                    <div className="w-full bg-[#E4E0D7] h-2.5 rounded-full overflow-hidden">
                                        <div
                                            className="bg-[#1F674F] h-full rounded-full transition-all duration-500"
                                            style={{ width: `${consistency.aboveCdiMonthsPct}%` }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs font-semibold mb-1">
                                        <span className="text-[#8D97A5]">Abaixo do CDI ({consistency.belowCdiMonths} meses)</span>
                                        <span className="font-mono text-[#5A6878]">{formatNumber(consistency.belowCdiMonthsPct, 1)}%</span>
                                    </div>
                                    <div className="w-full bg-[#E4E0D7] h-2.5 rounded-full overflow-hidden">
                                        <div
                                            className="bg-[#8D97A5] h-full rounded-full transition-all duration-500"
                                            style={{ width: `${consistency.belowCdiMonthsPct}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-[#E4E0D7] text-[11px] text-[#5A6878]">
                            Taxa de superação do CDI de <strong>{formatNumber(consistency.aboveCdiMonthsPct, 1)}%</strong> do tempo.
                        </div>
                    </div>

                    {/* Card 3: Extremos & Drawdown */}
                    <div className="bg-[#FAF8F5] border border-[#E4E0D7] rounded-2xl p-5 flex flex-col justify-between">
                        <div>
                            <div className="text-xs font-bold text-[#123044] uppercase tracking-wider mb-3">
                                Extremos Históricos & Risco
                            </div>

                            <div className="space-y-2.5 text-xs">
                                <div className="flex items-center justify-between py-1 border-b border-[#E4E0D7]/60">
                                    <span className="text-[#5A6878]">Maior Retorno Mensal:</span>
                                    <span className="font-mono font-bold text-[#1F674F]">
                                        {formatPct(consistency.bestMonth.value)}
                                        <span className="text-[10px] text-[#8D97A5] font-sans font-normal ml-1">
                                            ({consistency.bestMonth.label})
                                        </span>
                                    </span>
                                </div>

                                <div className="flex items-center justify-between py-1 border-b border-[#E4E0D7]/60">
                                    <span className="text-[#5A6878]">Menor Retorno Mensal:</span>
                                    <span className="font-mono font-bold text-[#B91C1C]">
                                        {formatPct(consistency.worstMonth.value)}
                                        <span className="text-[10px] text-[#8D97A5] font-sans font-normal ml-1">
                                            ({consistency.worstMonth.label})
                                        </span>
                                    </span>
                                </div>

                                <div className="flex items-center justify-between py-1 border-b border-[#E4E0D7]/60">
                                    <span className="text-[#5A6878]">Drawdown Máximo:</span>
                                    <span className="font-mono font-bold text-[#123044]">
                                        {formatPct(consistency.maxDrawdown, 2)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between py-1">
                                    <span className="text-[#5A6878]">Retorno Médio Mensal:</span>
                                    <span className="font-mono font-bold text-[#1F674F]">
                                        {formatPct(consistency.avgMonthlyReturn, 2)} a.m.
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-[#E4E0D7] text-[11px] text-[#5A6878]">
                            Máxima queda histórica pico-a-fundo de <strong>{formatPct(consistency.maxDrawdown, 2)}</strong>.
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 5: Composição da Carteira (Ativos Subjacentes) */}
            <section id="composicao" className="bg-[#FFFFFF] border border-[#E4E0D7] rounded-3xl p-6 shadow-xs scroll-mt-20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <div className="text-xs font-bold text-[#1F674F] uppercase tracking-wider mb-1">
                            Alocação de Ativos
                        </div>
                        <h2 className="text-xl md:text-2xl font-serif font-bold text-[#123044]">
                            Composição da Carteira {selectedProfile}
                        </h2>
                        <p className="text-xs text-[#5A6878] mt-0.5">
                            Ativos selecionados, gestoras parceiras, pesos e papéis táticos na metodologia ARVO
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FAF8F5] border border-[#E4E0D7] text-[#123044]">
                            {assets.length} Ativos
                        </span>
                    </div>
                </div>

                {/* Tactical Role Allocation Bar */}
                <div className="bg-[#FAF8F5] border border-[#E4E0D7] rounded-2xl p-4 mb-6">
                    <div className="text-xs font-bold text-[#123044] mb-2 flex items-center justify-between">
                        <span>Distribuição Tática ARVO</span>
                        <span className="text-[#8D97A5] font-normal">Zaga · Meio · Ataque</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-4 rounded-full overflow-hidden flex bg-[#E4E0D7] shadow-inner">
                        {classDistribution.zaga > 0 && (
                            <div
                                style={{ width: `${classDistribution.zaga}%` }}
                                className="bg-[#123044] h-full transition-all"
                                title={`Zaga: ${classDistribution.zaga.toFixed(1)}%`}
                            />
                        )}
                        {classDistribution.meio > 0 && (
                            <div
                                style={{ width: `${classDistribution.meio}%` }}
                                className="bg-[#1F674F] h-full transition-all"
                                title={`Meio: ${classDistribution.meio.toFixed(1)}%`}
                            />
                        )}
                        {classDistribution.ataque > 0 && (
                            <div
                                style={{ width: `${classDistribution.ataque}%` }}
                                className="bg-[#8CC7AE] h-full transition-all"
                                title={`Ataque: ${classDistribution.ataque.toFixed(1)}%`}
                            />
                        )}
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap items-center gap-6 mt-3 text-xs">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#123044]" />
                            <span className="font-semibold text-[#123044]">Zaga (Preservação & Liquidez):</span>
                            <span className="font-mono font-bold text-[#123044]">{classDistribution.zaga.toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#1F674F]" />
                            <span className="font-semibold text-[#1F674F]">Meio (Crédito & Multimercado):</span>
                            <span className="font-mono font-bold text-[#1F674F]">{classDistribution.meio.toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#8CC7AE]" />
                            <span className="font-semibold text-[#1F674F]">Ataque (Ações & Global):</span>
                            <span className="font-mono font-bold text-[#1F674F]">{classDistribution.ataque.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>

                {/* Assets Table */}
                <div className="overflow-x-auto rounded-2xl border border-[#E4E0D7] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <table className="w-full text-xs text-left border-collapse">
                        <thead>
                            <tr className="bg-[#FAF8F5] border-b border-[#E4E0D7] text-[#123044] font-bold">
                                <th className="py-3 px-4">Ativo / Fundo</th>
                                <th className="py-3 px-3">Gestora</th>
                                <th className="py-3 px-3">Papel Tático</th>
                                <th className="py-3 px-3">Macro-classe</th>
                                <th className="py-3 px-3 text-right">Peso</th>
                                <th className="py-3 px-3 text-right">Retorno Est.</th>
                                <th className="py-3 px-4 text-right">Volatilidade</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E4E0D7]">
                            {assets.map((asset, idx) => (
                                <tr key={idx} className="hover:bg-[#FAF8F5]/60 transition-colors">
                                    <td className="py-3 px-4 font-semibold text-[#123044]">
                                        {asset.name}
                                    </td>
                                    <td className="py-3 px-3 text-[#5A6878]">
                                        {asset.gestora}
                                    </td>
                                    <td className="py-3 px-3">
                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                            asset.classe === "Zaga"
                                                ? "bg-[#123044]/10 text-[#123044]"
                                                : asset.classe === "Ataque"
                                                ? "bg-[#8CC7AE]/20 text-[#1F674F]"
                                                : "bg-[#E8F3EE] text-[#1F674F]"
                                        }`}>
                                            {asset.classe}
                                        </span>
                                    </td>
                                    <td className="py-3 px-3 text-[#5A6878]">
                                        {asset.macroClass}
                                    </td>
                                    <td className="py-3 px-3 text-right font-mono font-bold text-[#1F674F]">
                                        {asset.weight.toFixed(1)}%
                                    </td>
                                    <td className="py-3 px-3 text-right font-mono text-[#123044]">
                                        {asset.expectedReturn.toFixed(1)}% a.a.
                                    </td>
                                    <td className="py-3 px-4 text-right font-mono text-[#5A6878]">
                                        {asset.volatility.toFixed(1)}% a.a.
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Bottom Actions Banner */}
            <div className="bg-gradient-to-r from-[#123044] to-[#1F674F] rounded-3xl p-6 sm:p-8 text-[#FAF8F5] shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-xl font-serif font-bold text-[#FFFFFF] mb-1">
                        Dúvidas sobre a alocação da sua carteira?
                    </h3>
                    <p className="text-xs sm:text-sm text-[#FAF8F5]/80 max-w-xl">
                        Converse com a equipe de especialistas ARVO para alinhar seu portfólio aos seus objetivos de longo prazo.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <Link
                        href="/dashboard/carteira"
                        className="px-4 py-2.5 rounded-xl bg-[#FFFFFF]/10 hover:bg-[#FFFFFF]/20 text-xs font-semibold text-[#FFFFFF] transition-colors border border-[#FFFFFF]/20"
                    >
                        Simulador de Carteira
                    </Link>
                    <Link
                        href="/dashboard/agendamento"
                        className="px-5 py-2.5 rounded-xl bg-[#8CC7AE] hover:bg-[#A3D9C3] text-xs font-bold text-[#123044] transition-colors shadow-xs"
                    >
                        Agendar conversa com CFP®
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default function AnaliseCarteirasPage() {
    return (
        <Suspense fallback={
            <div className="p-8 text-center text-sm font-semibold text-[#5A6878]">
                Carregando análise detalhada das carteiras...
            </div>
        }>
            <AnaliseCarteirasContent />
        </Suspense>
    )
}
