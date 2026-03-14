"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import {
    Target, Wallet, PiggyBank, CalendarDays,
    ArrowRight, Star, Info, ChevronRight,
    ShieldCheck
} from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { projectFinancialPlan } from "@/lib/financial-planning"

// ─── Formatação ────────────────────────────────────────────────────────────────
const formatNumber = (val: number) => val.toLocaleString("pt-BR")
const formatBRL = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0,
    }).format(val)

const parseNumber = (val: string) => {
    const clean = val.replace(/\D/g, "")
    return clean === "" ? 0 : parseInt(clean, 10)
}

export default function DemoPage() {
    const [currentValue, setCurrentValue] = useState(50000)
    const [monthlyContribution, setMonthlyContribution] = useState(1500)
    const [investmentPeriod, setInvestmentPeriod] = useState(20)
    const [nominalReturn, setNominalReturn] = useState(12)
    const [desiredLifestyleCost, setDesiredLifestyleCost] = useState(10000)

    const projection = useMemo(() => {
        return projectFinancialPlan({
            currentValue,
            monthlyContribution,
            investmentPeriod,
            nominalReturn,
            inflationRate: 4.87,
            desiredLifestyleCost,
        })
    }, [currentValue, monthlyContribution, investmentPeriod, nominalReturn, desiredLifestyleCost])

    const monthlyPassiveIncome = (projection?.projectedValueReal || 0) * 0.04 / 12

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans p-6 md:p-12 overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <nav className="flex items-center justify-between mb-16">
                    <Image src="/arvo-logo.png" alt="ARVO" width={80} height={40} />
                    <div className="flex items-center gap-6">
                        <Link href="/login" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Entrar</Link>
                        <Link href="/register">
                            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-6">Começar Grátis</Button>
                        </Link>
                    </div>
                </nav>

                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-10">
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold uppercase tracking-widest"
                            >
                                <Star className="w-3 h-3 fill-emerald-600" />
                                Simulador Aberto
                            </motion.div>
                            <h1 className="text-6xl md:text-7xl font-extralight tracking-tighter leading-[0.9]">
                                Descubra o poder do seu <span className="font-semibold italic text-emerald-600">dinheiro.</span>
                            </h1>
                            <p className="text-xl text-slate-500 font-light leading-relaxed">
                                Use nosso simulador profissional para projetar sua liberdade financeira. Sem amarras, sem custos.
                            </p>
                        </div>

                        <div className="space-y-8 p-10 bg-slate-50 rounded-[3rem] border border-slate-100">
                            {/* Patrimônio */}
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Label className="uppercase text-[10px] font-bold tracking-widest text-slate-400">Patrimônio Atual</Label>
                                    <span className="text-xl font-light">R$ {formatNumber(currentValue)}</span>
                                </div>
                                <Slider
                                    value={[currentValue]}
                                    max={1000000} step={1000}
                                    onValueChange={(v) => setCurrentValue(v[0])}
                                    className="[&_[role=slider]]:bg-emerald-600"
                                />
                            </div>

                            {/* Aporte */}
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Label className="uppercase text-[10px] font-bold tracking-widest text-slate-400">Aporte Mensal</Label>
                                    <span className="text-xl font-light">R$ {formatNumber(monthlyContribution)}</span>
                                </div>
                                <Slider
                                    value={[monthlyContribution]}
                                    max={20000} step={100}
                                    onValueChange={(v) => setMonthlyContribution(v[0])}
                                    className="[&_[role=slider]]:bg-emerald-600"
                                />
                            </div>

                            {/* Prazo */}
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Label className="uppercase text-[10px] font-bold tracking-widest text-slate-400">Prazo (Anos)</Label>
                                    <span className="text-xl font-light">{investmentPeriod} anos</span>
                                </div>
                                <Slider
                                    value={[investmentPeriod]}
                                    min={1} max={50}
                                    onValueChange={(v) => setInvestmentPeriod(v[0])}
                                    className="[&_[role=slider]]:bg-emerald-600"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-slate-950 text-white p-12 rounded-[4rem] shadow-2xl relative z-10 space-y-12 overflow-hidden"
                        >
                            {/* Decorative elements */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/20 blur-[80px] rounded-full" />

                            <div className="space-y-2">
                                <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">Resultado Projetado</p>
                                <h2 className="text-5xl md:text-6xl font-extralight tracking-tighter">
                                    {formatBRL(projection?.projectedValueReal || 0)}
                                </h2>
                                <p className="text-xs text-slate-500">Valor real, já descontando a inflação (IPCA)</p>
                            </div>

                            <div className="pt-10 border-t border-slate-800 space-y-4">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Renda Mensal Passiva</p>
                                        <p className="text-4xl font-semibold text-emerald-400">{formatBRL(monthlyPassiveIncome)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase font-bold text-slate-500">Sua Meta</p>
                                        <p className="text-xl font-light">{formatBRL(desiredLifestyleCost)}</p>
                                    </div>
                                </div>

                                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, (monthlyPassiveIncome / desiredLifestyleCost) * 100)}%` }}
                                        className="h-full bg-emerald-500"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <Link href="/register">
                                    <Button className="w-full h-16 bg-white text-slate-950 hover:bg-slate-200 rounded-3xl text-lg font-bold group">
                                        SALVAR MEU PLANO
                                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <p className="text-[10px] text-center mt-4 text-slate-500 font-bold tracking-widest uppercase">
                                    E mais: Monitoramento de carteira real
                                </p>
                            </div>
                        </motion.div>

                        <div className="absolute -bottom-10 -left-10 w-full h-full bg-emerald-500/5 rounded-[4rem] -z-0 translate-x-4 translate-y-4" />
                    </div>
                </div>

                <footer className="mt-24 pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-400 text-xs font-bold tracking-widest uppercase">
                    <div className="flex items-center gap-4">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        Segurança de Dados Bancroft
                    </div>
                    <div className="flex gap-8">
                        <Link href="#" className="hover:text-slate-900 transition-colors">Termos</Link>
                        <Link href="#" className="hover:text-slate-900 transition-colors">Privacidade</Link>
                    </div>
                    <p>© 2024 ARVO INVESTIMENTOS</p>
                </footer>
            </div>
        </div>
    )
}
