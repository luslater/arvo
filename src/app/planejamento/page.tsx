"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import {
    TrendingUp, Target, Wallet, CalendarDays,
    ShieldCheck, ArrowUpRight, Info, PiggyBank,
    LineChart as ChartIcon, ArrowLeft, Save, CheckCircle2
} from "lucide-react"
import {
    ResponsiveContainer, AreaChart, Area,
    XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import {
    projectFinancialPlan,
    getAlignmentLabel,
} from "@/lib/financial-planning"

// ─── Formatação ────────────────────────────────────────────────────────────────
const formatBRL = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0,
    }).format(val)

const formatNumber = (val: number) => {
    if (val === undefined || val === null) return ""
    return val.toLocaleString("pt-BR")
}

const parseNumber = (val: string) => {
    const clean = val.replace(/\D/g, "")
    return clean === "" ? 0 : parseInt(clean, 10)
}

// ─── Tooltip customizado ───────────────────────────────────────────────────────
interface TooltipPayloadItem {
    name: string
    value: number
    color: string
    payload: { year: number }
}

function ArvoTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-950 text-white p-5 rounded-[1.5rem] shadow-2xl border border-slate-800 space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">
                    Ano {payload[0].payload.year}
                </p>
                {payload.map((p) => (
                    <p key={p.name} className="text-sm font-light" style={{ color: p.color }}>
                        {p.name}: {formatBRL(p.value)}
                    </p>
                ))}
            </div>
        )
    }
    return null
}

// ─── Slider Control ────────────────────────────────────────────────────────────
function ArvoSliderControl({
    label, value, min, max, step = 1, onChange,
    unit = "", isCurrency = false, icon
}: {
    label: string
    value: number
    min: number
    max: number
    step?: number
    onChange: (value: number) => void
    unit?: string
    isCurrency?: boolean
    icon: React.ReactNode
}) {
    // Para evitar que o cursor pule ao digitar, usamos o valor do pai diretamente
    // mas formatamos na exibição. Se for %, tratamos como decimal.
    const displayValue = unit === "%"
        ? value.toString().replace(".", ",")
        : formatNumber(value)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value

        if (unit === "%") {
            // Permite digitar vírgula para decimais
            const normalized = raw.replace(",", ".")
            const val = parseFloat(normalized)
            if (!isNaN(val)) onChange(val)
        } else {
            const val = parseNumber(raw)
            onChange(val)
        }
    }

    return (
        <div className="space-y-5 group">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-slate-50 group-hover:bg-emerald-50 transition-colors duration-300 text-slate-400 group-hover:text-emerald-500">
                        {icon}
                    </span>
                    <Label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 cursor-default">
                        {label}
                    </Label>
                </div>
                <div className="flex items-center gap-1">
                    {isCurrency && <span className="text-xs font-bold text-slate-300">R$</span>}
                    <input
                        type="text"
                        value={displayValue}
                        onChange={handleInputChange}
                        className="w-28 text-right text-2xl font-light tracking-tighter bg-transparent outline-none border-b border-transparent focus:border-emerald-500 transition-colors"
                    />
                    {!isCurrency && unit && (
                        <span className="text-xs font-bold text-slate-300 ml-1">{unit}</span>
                    )}
                </div>
            </div>
            <Slider
                value={[value]}
                min={min}
                max={max}
                step={step}
                onValueChange={(v: number[]) => onChange(v[0])}
                className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:bg-white [&_[role=slider]]:border-emerald-500 [&_[role=slider]]:border-2"
            />
            <div className="flex justify-between text-[10px] text-slate-300 font-medium">
                <span>{isCurrency ? formatBRL(min) : `${formatNumber(min)}${unit}`}</span>
                <span>{isCurrency ? formatBRL(max) : `${formatNumber(max)}${unit}`}</span>
            </div>
        </div>
    )
}


// ─── Página Principal ──────────────────────────────────────────────────────────
export default function PlanejamentoPage() {
    const INFLATION_RATE = 4.87 // IPCA médio fixo

    const [currentValue, setCurrentValue] = useState(100000)
    const [monthlyContribution, setMonthlyContribution] = useState(2500)
    const [investmentPeriod, setInvestmentPeriod] = useState(20)
    const [nominalReturn, setNominalReturn] = useState(12)
    const [desiredLifestyleCost, setDesiredLifestyleCost] = useState(12000)
    const [viewMode, setViewMode] = useState<"NOMINAL" | "REAL">("NOMINAL")
    const [saved, setSaved] = useState(false)

    const { data: session } = useSession()

    // Internal state for formatting the desired cost input
    const [desiredLifestyleCostInput, setDesiredLifestyleCostInput] = useState(formatNumber(12000))

    useEffect(() => {
        setDesiredLifestyleCostInput(formatNumber(desiredLifestyleCost))
    }, [desiredLifestyleCost])

    // Carrega dados do Banco de Dados via API
    useEffect(() => {
        if (!session?.user?.id) return

        const loadData = async () => {
            try {
                // Bypass cache completely using strict headers + timestamp
                const res = await fetch(`/api/user/financial-plan?t=${Date.now()}`, {
                    cache: "no-store",
                    headers: { "Cache-Control": "no-cache, no-store, must-revalidate" }
                })
                if (res.ok) {
                    const data = await res.json()

                    // The API was updated to return flat fields
                    if (data.desiredLifestyleCost) setDesiredLifestyleCost(data.desiredLifestyleCost)
                    if (data.monthlyContribution) setMonthlyContribution(data.monthlyContribution)
                    if (data.investmentPeriod) setInvestmentPeriod(data.investmentPeriod)

                    if (data.expectedReturn) {
                        setNominalReturn(data.expectedReturn)
                    } else if (data.riskProfile) {
                        const returnByProfile: Record<string, number> = {
                            "CONSERVADOR": 9,
                            "MODERADO_CONSERVADOR": 10,
                            "MODERADO": 11,
                            "MODERADO_ARROJADO": 12,
                            "ARROJADO": 13,
                        }
                        setNominalReturn(returnByProfile[data.riskProfile] ?? 12)
                    }

                    if (data.currentCapital !== undefined && data.currentCapital !== null) {
                        setCurrentValue(data.currentCapital)
                    }
                }
            } catch (error) {
                console.error("Erro ao puxar dados do banco:", error)
            }
        }

        loadData()
    }, [session])

    // Projeção financeira (usa lib existente)
    const projection = useMemo(() => {
        if (desiredLifestyleCost <= 0) return null
        return projectFinancialPlan({
            currentValue,
            monthlyContribution,
            investmentPeriod,
            nominalReturn,
            inflationRate: INFLATION_RATE,
            desiredLifestyleCost,
        })
    }, [currentValue, monthlyContribution, investmentPeriod, nominalReturn, desiredLifestyleCost])

    // Dados do gráfico (apenas pontos anuais)
    const chartData = useMemo(() => {
        if (!projection) return []
        return projection.monthlyData
            .filter((d) => d.month % 12 === 0)
            .map((d) => ({
                year: d.year,
                "Patrimônio Projetado": Math.round(
                    viewMode === "NOMINAL" ? d.valueNominal : d.valueReal
                ),
                "Total Investido": Math.round(currentValue + d.contributions),
            }))
    }, [projection, viewMode, currentValue])

    const alignmentInfo = projection ? getAlignmentLabel(projection.alignmentScore) : null

    // Renda mensal passiva usando regra dos 4%
    const monthlyPassiveIncome = projection
        ? (viewMode === "NOMINAL" ? projection.projectedValue : projection.projectedValueReal) * 0.04 / 12
        : 0

    const goalProgress = Math.min(
        100,
        (monthlyPassiveIncome / Math.max(desiredLifestyleCost, 1)) * 100
    )

    const handleSave = async () => {
        try {
            await fetch("/api/user/financial-plan", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    desiredLifestyleCost,
                    monthlyContribution,
                    investmentPeriod,
                    expectedReturn: nominalReturn,
                    currentCapital: currentValue
                })
            })
            setSaved(true)
            setTimeout(() => setSaved(false), 2500)
        } catch (error) {
            console.error("Erro ao salvar no banco:", error)
        }
    }

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans p-4 md:p-10 selection:bg-emerald-100">
            <div className="max-w-7xl mx-auto">

                {/* ── NAV ──────────────────────────────────────────────────── */}
                <nav className="flex items-center justify-between mb-12">
                    <Link href="/carteira">
                        <Button variant="ghost" className="gap-2 text-slate-500 hover:text-slate-900">
                            <ArrowLeft className="h-4 w-4" />
                            Voltar
                        </Button>
                    </Link>
                    <Image src="/arvo-logo.png" alt="ARVO" width={64} height={32} />
                </nav>

                {/* ── HEADER ───────────────────────────────────────────────── */}
                <header className="mb-14 space-y-3">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-emerald-600 font-bold tracking-widest text-[10px] uppercase"
                    >
                        <ShieldCheck className="w-4 h-4" />
                        Independência Financeira Transparente
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="text-5xl md:text-7xl font-extralight tracking-tighter leading-none"
                    >
                        Seu futuro, <br />
                        <span className="font-semibold italic text-emerald-600">em tempo real.</span>
                    </motion.h1>
                </header>

                {/* ── LAYOUT PRINCIPAL ─────────────────────────────────────── */}
                <div className="grid lg:grid-cols-12 gap-14 items-start">

                    {/* COLUNA DE CONTROLES (7) */}
                    <section className="lg:col-span-7 space-y-10">
                        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">

                            <ArvoSliderControl
                                label="Patrimônio Atual"
                                value={currentValue}
                                min={0} max={2000000} step={5000}
                                onChange={setCurrentValue}
                                isCurrency
                                icon={<Wallet className="w-4 h-4" />}
                            />

                            <ArvoSliderControl
                                label="Aporte Mensal"
                                value={monthlyContribution}
                                min={0} max={50000} step={100}
                                onChange={setMonthlyContribution}
                                isCurrency
                                icon={<PiggyBank className="w-4 h-4" />}
                            />

                            <ArvoSliderControl
                                label="Prazo de Investimento"
                                value={investmentPeriod}
                                min={1} max={50}
                                onChange={setInvestmentPeriod}
                                unit=" anos"
                                icon={<CalendarDays className="w-4 h-4" />}
                            />

                            <ArvoSliderControl
                                label="Rentabilidade Nominal"
                                value={nominalReturn}
                                min={4} max={20} step={0.1}
                                onChange={setNominalReturn}
                                unit="%"
                                icon={<TrendingUp className="w-4 h-4" />}
                            />
                        </div>

                        {/* META DE RENDA */}
                        <div className="p-8 rounded-[2rem] bg-emerald-50/50 border border-emerald-100 space-y-5">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-emerald-600" />
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 cursor-default">
                                        Renda Mensal Desejada na Aposentadoria
                                    </Label>
                                    <div className="group relative">
                                        <Info className="w-3 h-3 text-emerald-400 cursor-help" />
                                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-56 p-2 bg-slate-900 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                            O patrimônio necessário é calculado pela Regra dos 4% (retirada segura anual = 4% do patrimônio).
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-sm font-bold text-emerald-600">R$</span>
                                    <input
                                        type="text"
                                        value={desiredLifestyleCostInput}
                                        onChange={(e) => setDesiredLifestyleCost(parseNumber(e.target.value))}
                                        className="bg-transparent text-right font-bold text-2xl text-emerald-600 outline-none w-28 border-b border-emerald-100 focus:border-emerald-500 transition-colors"
                                    />
                                </div>
                            </div>
                            <Slider
                                value={[desiredLifestyleCost]}
                                min={1000} max={50000} step={100}
                                onValueChange={(v: number[]) => setDesiredLifestyleCost(v[0])}
                                className="[&_[role=slider]]:bg-emerald-600 [&_[role=slider]]:border-emerald-600"
                            />
                            <div className="flex justify-between text-[10px] text-emerald-500 font-medium">
                                <span>R$ 1.000</span>
                                <span>R$ 50.000</span>
                            </div>
                        </div>


                        {/* TAXA REAL IMPLÍCITA */}
                        {projection && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-sm"
                            >
                                <span className="text-slate-500 text-[11px]">
                                    Taxa real implícita (descontando IPCA de {INFLATION_RATE}%)
                                </span>
                                <span className="font-semibold text-slate-700">
                                    {(((1 + nominalReturn / 100) / (1 + INFLATION_RATE / 100)) - 1).toFixed(2).replace(".", ",")}% a.a.
                                </span>
                            </motion.div>
                        )}

                        {/* RECOMMENDATION */}
                        {projection && (
                            <motion.div
                                key={projection.alignmentScore}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-5 rounded-2xl border text-sm font-light leading-relaxed ${projection.alignmentScore >= 100
                                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                    : projection.alignmentScore >= 60
                                        ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                                        : "bg-red-50 border-red-200 text-red-800"
                                    }`}
                            >
                                {projection.recommendation}
                            </motion.div>
                        )}
                    </section>

                    {/* COLUNA DE RESULTADOS (5, sticky) */}
                    <aside className="lg:col-span-5 space-y-6 sticky top-10">

                        {/* CARD ESCURO — RESULTADO PRINCIPAL */}
                        <div
                            className="bg-slate-950 border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] rounded-[3rem] overflow-hidden"
                            style={{ color: "#ffffff" }}
                        >
                            <div className="p-10 md:p-12 space-y-10">

                                {/* Toggle Nominal / Real */}
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] uppercase font-bold tracking-[0.2em]" style={{ color: "#94a3b8" }}>
                                        Visão
                                    </p>
                                    <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-xl">
                                        {(["NOMINAL", "REAL"] as const).map((m) => (
                                            <button
                                                key={m}
                                                onClick={() => setViewMode(m)}
                                                className={`px-3 py-1 text-[10px] font-bold rounded-lg tracking-widest transition-all ${viewMode === m
                                                    ? "bg-white text-slate-900"
                                                    : "hover:text-white"
                                                    }`}
                                                style={{ color: viewMode === m ? undefined : "#94a3b8" }}
                                            >
                                                {m === "NOMINAL" ? "Nominal" : "Real (IPCA)"}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Patrimônio projetado */}
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-bold tracking-[0.2em]" style={{ color: "#94a3b8" }}>
                                        Patrimônio em {investmentPeriod} anos
                                    </p>
                                    <motion.h2
                                        key={`${projection?.projectedValue}-${viewMode}`}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-5xl md:text-6xl font-extralight tracking-tighter"
                                        style={{ color: "#ffffff" }}
                                    >
                                        {projection
                                            ? formatBRL(viewMode === "NOMINAL" ? projection.projectedValue : projection.projectedValueReal)
                                            : "R$ 0"}
                                    </motion.h2>
                                </div>

                                {/* Renda mensal + meta */}
                                <div className="pt-8 border-t border-slate-800 space-y-6">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase font-bold tracking-widest" style={{ color: "#94a3b8" }}>
                                                Renda Mensal Passiva
                                            </p>
                                            <motion.p
                                                key={monthlyPassiveIncome}
                                                initial={{ opacity: 0, y: 6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-4xl font-semibold"
                                                style={{ color: "#34d399" }}
                                            >
                                                {formatBRL(monthlyPassiveIncome)}
                                            </motion.p>
                                            <p className="text-[10px]" style={{ color: "#64748b" }}>
                                                Regra dos 4% · retirada sustentável
                                            </p>
                                        </div>
                                        <div className="text-right space-y-1">
                                            <p className="text-[10px] uppercase font-bold" style={{ color: "#64748b" }}>
                                                Meta
                                            </p>
                                            <p className="text-2xl font-light" style={{ color: "#cbd5e1" }}>
                                                {formatBRL(desiredLifestyleCost)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Barra de progresso */}
                                    <div className="space-y-3">
                                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${goalProgress}%` }}
                                                transition={{ duration: 0.6, ease: "easeOut" }}
                                                className={`h-full rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)] ${goalProgress >= 100
                                                    ? "bg-emerald-400"
                                                    : goalProgress >= 60
                                                        ? "bg-yellow-400"
                                                        : "bg-red-400"
                                                    }`}
                                            />
                                        </div>
                                        <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest">
                                            <span style={{ color: "#ffffff" }}>
                                                {alignmentInfo?.label ?? "—"}
                                            </span>
                                            <span style={{ color: "#34d399" }}>{goalProgress.toFixed(1)}%</span>
                                        </div>
                                    </div>

                                    {/* Patrimônio necessário */}
                                    {projection && (
                                        <div className="flex justify-between text-[11px] border-t border-slate-800 pt-4" style={{ color: "#94a3b8" }}>
                                            <span>Capital necessário (Meta)</span>
                                            <span className="font-semibold" style={{ color: "#cbd5e1" }}>
                                                {formatBRL(viewMode === "NOMINAL" ? projection.requiredCapital : projection.requiredCapitalReal)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* CARD GRÁFICO */}
                        <Card className="border-slate-100 shadow-sm rounded-[2.5rem] bg-white">
                            <CardContent className="p-10 space-y-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                        <ChartIcon className="w-3 h-3" /> Evolução do Patrimônio
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                                </div>

                                <div className="h-[350px] w-full mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData}>
                                            <defs>
                                                <linearGradient id="gradPatrimonio" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="gradInvestido" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.15} />
                                                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis
                                                dataKey="year"
                                                stroke="#94a3b8"
                                                fontSize={10}
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={(value) => `Ano ${value}`}
                                                dy={10}
                                            />
                                            <YAxis
                                                stroke="#94a3b8"
                                                fontSize={10}
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                                                domain={[0, "auto"]}
                                                width={60}
                                                tickCount={6}
                                            />
                                            <Tooltip content={<ArvoTooltip />} cursor={{ stroke: "#10b981", strokeWidth: 1 }} />
                                            <Area
                                                type="monotone"
                                                dataKey="Total Investido"
                                                stroke="#94a3b8"
                                                strokeWidth={1.5}
                                                fill="url(#gradInvestido)"
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="Patrimônio Projetado"
                                                stroke="#10b981"
                                                strokeWidth={2}
                                                fill="url(#gradPatrimonio)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="flex justify-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span className="text-[10px] text-slate-400 font-medium">Juros Compostos</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-slate-200" />
                                        <span className="text-[10px] text-slate-400 font-medium">Total Investido</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* BOTÃO SALVAR */}
                        <Button
                            onClick={handleSave}
                            className={`w-full h-12 rounded-2xl font-semibold tracking-wide transition-all ${saved
                                ? "bg-emerald-500 text-white hover:bg-emerald-500"
                                : "bg-slate-900 text-white hover:bg-slate-700"
                                }`}
                        >
                            {saved ? (
                                <>
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Planejamento Salvo!
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Salvar Planejamento
                                </>
                            )}
                        </Button>
                    </aside>
                </div>
            </div>
        </div>
    )
}
