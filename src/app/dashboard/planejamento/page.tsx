"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import {
    TrendingUp, Target, Wallet, CalendarDays,
    ShieldCheck, ArrowUpRight, Info, PiggyBank,
    LineChart as ChartIcon, Save, CheckCircle2
} from "lucide-react"
import {
    ResponsiveContainer, AreaChart, Area,
    XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
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
    unit = "", isCurrency = false, icon, subtext
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
    subtext?: React.ReactNode
}) {
    const [inputValue, setInputValue] = useState(
        isCurrency ? formatNumber(value) : String(value)
    )

    useEffect(() => {
        setInputValue(isCurrency ? formatNumber(value) : String(value))
    }, [value, isCurrency])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value
        setInputValue(raw)
        if (isCurrency) {
            const parsed = parseNumber(raw)
            if (!isNaN(parsed)) onChange(parsed)
        } else {
            const parsed = parseFloat(raw.replace(",", "."))
            if (!isNaN(parsed)) onChange(parsed)
        }
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                {icon}
                <span>{label}</span>
            </div>
            <div className="flex items-baseline justify-between">
                {isCurrency ? (
                    <div className="flex items-center gap-1">
                        <span className="text-slate-400 text-lg font-light">R$</span>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            className="text-2xl md:text-3xl font-light tracking-tight text-slate-900 bg-transparent outline-none w-36 sm:w-44 border-b border-slate-100 focus:border-slate-400 transition-colors"
                        />
                    </div>
                ) : (
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        className="text-2xl md:text-3xl font-light tracking-tight text-slate-900 bg-transparent outline-none w-24 sm:w-28 border-b border-slate-100 focus:border-slate-400 transition-colors"
                    />
                )}
                {!isCurrency && unit && (
                    <span className="text-slate-400 font-light">{unit}</span>
                )}
            </div>
            <Slider
                value={[value]}
                min={min} max={max} step={step}
                onValueChange={(v: number[]) => onChange(v[0])}
                className="[&_[role=slider]]:bg-slate-900 [&_[role=slider]]:border-slate-900"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>{isCurrency ? formatBRL(min) : `${min}${unit}`}</span>
                <span>{isCurrency ? formatBRL(max) : `${max}${unit}`}</span>
            </div>
            {subtext}
        </div>
    )
}

// ─── Componente Principal de Planejamento ──────────────────────────────────────
export function PlanejamentoContent() {
    const INFLATION_RATE = 4.87
    const { data: session } = useSession()

    const [currentValue, setCurrentValue] = useState(100000)
    const [monthlyContribution, setMonthlyContribution] = useState(3000)
    const [investmentPeriod, setInvestmentPeriod] = useState(20)
    const [nominalReturn, setNominalReturn] = useState(12)
    const [desiredLifestyleCost, setDesiredLifestyleCost] = useState(10000)
    const [desiredLifestyleCostInput, setDesiredLifestyleCostInput] = useState(formatNumber(10000))
    const [viewMode, setViewMode] = useState<"NOMINAL" | "REAL">("NOMINAL")
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        setDesiredLifestyleCostInput(formatNumber(desiredLifestyleCost))
    }, [desiredLifestyleCost])

    useEffect(() => {
        async function loadData() {
            if (!session?.user) return
            try {
                const res = await fetch("/api/user/financial-plan")
                if (res.ok) {
                    const data = await res.json()
                    if (data.desiredLifestyleCost) {
                        setDesiredLifestyleCost(data.desiredLifestyleCost)
                        setMonthlyContribution(data.monthlyContribution)
                        setInvestmentPeriod(data.investmentPeriod)
                        if (data.expectedReturn) setNominalReturn(data.expectedReturn)
                        if (data.currentCapital) setCurrentValue(data.currentCapital)
                    } else if (data.riskProfile) {
                        const profile = data.riskProfile.toUpperCase()
                        const returnByProfile: Record<string, number> = {
                            ABRIGO: 10.5,
                            RITMO: 11.5,
                            VISÃO: 13.0,
                            OCEANO: 14.5,
                        }

                        if (!data.expectedReturn) {
                            setNominalReturn(returnByProfile[profile] ?? 12)
                        }
                    }
                }
            } catch (error) {
                console.error("Erro ao puxar dados do banco:", error)
            }
        }
        loadData()
    }, [session])

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
    const targetIncome = viewMode === "NOMINAL" 
        ? desiredLifestyleCost * Math.pow(1 + INFLATION_RATE / 100, investmentPeriod)
        : desiredLifestyleCost;
    const monthlyPassiveIncome = projection
        ? (viewMode === "NOMINAL" ? projection.projectedValue : projection.projectedValueReal) * 0.04 / 12
        : 0
    const goalProgress = projection ? Math.min(100, projection.alignmentScore) : 0

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
        <div className="text-slate-900 font-sans selection:bg-emerald-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <header className="mb-8 md:mb-12 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold tracking-widest uppercase">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Independência Financeira Transparente
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-slate-900 leading-[1.08]">
                    Seu futuro, <br />
                    <span className="font-serif italic font-normal text-slate-700">em tempo real.</span>
                </h1>
                <p className="text-slate-500 max-w-lg text-sm md:text-base font-light leading-relaxed">
                    Altere as premissas e veja instantaneamente o impacto no seu patrimônio e na sua renda passiva no longo prazo.
                </p>
            </header>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-8 items-start">
                <section className="lg:col-span-7 space-y-8">
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-8">
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
                            subtext={
                                <div className="mt-4 p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100 flex items-center justify-between">
                                    <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide">Taxa Mensal</span>
                                    <span className="text-xs font-bold text-emerald-800">
                                        {((Math.pow(1 + nominalReturn / 100, 1 / 12) - 1) * 100).toFixed(2).replace(".", ",")}% a.m.
                                    </span>
                                </div>
                            }
                        />
                    </div>

                    <div className="p-6 sm:p-7 rounded-[2rem] bg-emerald-50/50 border border-emerald-100 space-y-4">
                        <div className="flex flex-wrap justify-between items-center gap-3">
                            <div className="flex items-center gap-2">
                                <Target className="w-4 h-4 text-emerald-600 shrink-0" />
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 cursor-default">
                                    Renda Mensal Desejada na Aposentadoria
                                </Label>
                                <div className="group relative">
                                    <Info className="w-3 h-3 text-emerald-400 cursor-help" />
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-sm font-bold text-emerald-600">R$</span>
                                <input
                                    type="text"
                                    value={desiredLifestyleCostInput}
                                    onChange={(e) => setDesiredLifestyleCost(parseNumber(e.target.value))}
                                    className="bg-transparent text-right font-bold text-xl sm:text-2xl text-emerald-600 outline-none w-32 sm:w-36 border-b border-emerald-100 focus:border-emerald-500 transition-colors"
                                />
                            </div>
                        </div>
                        <Slider
                            value={[desiredLifestyleCost]}
                            min={1000} max={50000} step={100}
                            onValueChange={(v: number[]) => setDesiredLifestyleCost(v[0])}
                            className="[&_[role=slider]]:bg-emerald-600 [&_[role=slider]]:border-emerald-600"
                        />
                    </div>

                    {projection && (
                        <div className={`p-5 rounded-2xl border text-sm font-light leading-relaxed ${projection.alignmentScore >= 100 ? "bg-emerald-50 border-emerald-200 text-emerald-800" : projection.alignmentScore >= 60 ? "bg-yellow-50 border-yellow-200 text-yellow-800" : "bg-red-50 border-red-200 text-red-800"}`}>
                            {projection.recommendation}
                        </div>
                    )}
                </section>

                <aside className="lg:col-span-5 space-y-6 sticky top-6">
                    <div className="bg-slate-950 border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] rounded-[2.5rem] overflow-hidden" style={{ color: "#ffffff" }}>
                        <div className="p-6 sm:p-8 space-y-7">
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] uppercase font-bold tracking-[0.2em]" style={{ color: "#94a3b8" }}>Visão</p>
                                <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-xl">
                                    {(["NOMINAL", "REAL"] as const).map((m) => (
                                        <button key={m} onClick={() => setViewMode(m)} className={`px-3 py-1 text-[10px] font-bold rounded-lg tracking-widest transition-all ${viewMode === m ? "bg-white text-slate-900" : "hover:text-white"}`} style={{ color: viewMode === m ? undefined : "#94a3b8" }}>{m === "NOMINAL" ? "Nominal" : "Real"}</button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <p className="text-[10px] uppercase font-bold tracking-[0.2em]" style={{ color: "#94a3b8" }}>Patrimônio em {investmentPeriod} anos</p>
                                <motion.h2 key={`${projection?.projectedValue}-${viewMode}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-3xl sm:text-4xl lg:text-[40px] font-light tracking-tight leading-tight text-white break-words">
                                    {projection ? formatBRL(viewMode === "NOMINAL" ? projection.projectedValue : projection.projectedValueReal) : "R$ 0"}
                                </motion.h2>
                            </div>

                            <div className="pt-6 border-t border-slate-800 space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start sm:items-end">
                                    <div className="space-y-1 min-w-0">
                                        <p className="text-[10px] uppercase font-bold tracking-widest" style={{ color: "#94a3b8" }}>Renda Mensal Passiva</p>
                                        <motion.p key={monthlyPassiveIncome} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-2xl sm:text-3xl font-bold tracking-tight truncate leading-tight" style={{ color: "#34d399" }}>
                                            {formatBRL(monthlyPassiveIncome)}
                                        </motion.p>
                                        <p className="text-[10px]" style={{ color: "#64748b" }}>Regra dos 4% · retirada sustentável</p>
                                    </div>
                                    <div className="text-left sm:text-right space-y-1 min-w-0">
                                        <p className="text-[10px] uppercase font-bold" style={{ color: "#64748b" }}>Meta {viewMode === "NOMINAL" && "(Futura)"}</p>
                                        <p className="text-xl sm:text-2xl font-light tracking-tight truncate leading-tight" style={{ color: "#cbd5e1" }}>{formatBRL(targetIncome)}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${goalProgress}%` }} className={`h-full rounded-full ${goalProgress >= 100 ? "bg-emerald-400" : goalProgress >= 60 ? "bg-yellow-400" : "bg-red-400"}`} />
                                    </div>
                                    <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest">
                                        <span style={{ color: "#ffffff" }}>{alignmentInfo?.label ?? "—"}</span>
                                        <span style={{ color: "#34d399" }}>{goalProgress.toFixed(0)}%</span>
                                    </div>
                                </div>

                                {projection && (
                                    <div className="flex items-center justify-between text-[11px] border-t border-slate-800 pt-4 gap-2" style={{ color: "#94a3b8" }}>
                                        <span className="truncate">Capital necessário (Meta)</span>
                                        <span className="font-semibold text-xs sm:text-sm shrink-0" style={{ color: "#cbd5e1" }}>{formatBRL(viewMode === "NOMINAL" ? projection.requiredCapital : projection.requiredCapitalReal)}</span>
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

                            <div className="h-[200px] w-full">
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
                                        <XAxis dataKey="year" hide />
                                        <YAxis hide domain={["dataMin", "auto"]} />
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
    )
}

export default PlanejamentoContent

