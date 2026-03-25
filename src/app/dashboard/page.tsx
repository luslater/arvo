"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Pencil, Check, X, TrendingUp, Wallet, PiggyBank, BarChart3 } from "lucide-react"
import { DashboardCharts } from "@/components/dashboard-charts"
import { projectFinancialPlan } from "@/lib/financial-planning"
import Link from "next/link"

const formatBRL = (val: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(val)

const parseBRL = (val: string) => {
    const clean = val.replace(/\D/g, "")
    return clean === "" ? 0 : parseInt(clean, 10)
}

interface DashboardData {
    totalCarteira: number
    saldo: number
    emergencyFund: number
    portfolioType: string | null
    monthlyContribution: number
    desiredLifestyleCost: number
    investmentPeriod: number
    expectedReturn: number
    userName: string
}

function EditableMetric({
    label, value, onSave, prefix = "R$", suffix = ""
}: {
    label: string
    value: number
    onSave: (val: number) => void
    prefix?: string
    suffix?: string
}) {
    const [editing, setEditing] = useState(false)
    const [input, setInput] = useState("")

    const display = prefix === "R$"
        ? formatBRL(value)
        : `${value.toLocaleString("pt-BR")}${suffix}`

    const handleSave = () => {
        const parsed = prefix === "R$" ? parseBRL(input) : parseFloat(input.replace(",", "."))
        if (!isNaN(parsed)) onSave(parsed)
        setEditing(false)
    }

    if (editing) {
        return (
            <div className="flex items-center gap-1 mt-1">
                {prefix === "R$" && <span className="text-[13px] text-dash-text-muted">R$</span>}
                <input
                    autoFocus
                    type="text"
                    defaultValue={prefix === "R$" ? value.toString() : value.toString()}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") setEditing(false) }}
                    className="w-28 border-b-2 border-dash-accent bg-transparent text-[22px] font-serif text-dash-text outline-none"
                />
                <button onClick={handleSave} className="text-emerald-600 hover:text-emerald-700"><Check className="w-4 h-4" /></button>
                <button onClick={() => setEditing(false)} className="text-dash-text-light hover:text-dash-danger"><X className="w-4 h-4" /></button>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-1.5 group">
            <div className="font-serif text-[26px] text-dash-text tracking-tight">{display}</div>
            <button
                onClick={() => { setInput(value.toString()); setEditing(true) }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-dash-surface-active rounded-md"
            >
                <Pencil className="w-3 h-3 text-dash-text-muted" />
            </button>
        </div>
    )
}

export default function DashboardPage() {
    const { data: session } = useSession()
    const [data, setData] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const loadData = async () => {
        setLoading(true)
        try {
            const [profileRes, planRes] = await Promise.all([
                fetch(`/api/user/profile?t=${Date.now()}`, { cache: "no-store", headers: { "Cache-Control": "no-cache, no-store, must-revalidate" } }),
                fetch(`/api/user/financial-plan?t=${Date.now()}`, { cache: "no-store", headers: { "Cache-Control": "no-cache, no-store, must-revalidate" } })
            ])
            const profile = profileRes.ok ? await profileRes.json() : null
            const plan = planRes.ok ? await planRes.json() : null

            if (!profile) {
                console.error("Fetch profile failed")
                return; // Do not overwrite state with zeros if fetch completely fails
            }

            setData({
                totalCarteira: profile.totalCarteira ?? 0,
                saldo: profile.saldo ?? 0,
                emergencyFund: profile.emergencyFund ?? 0,
                portfolioType: profile.portfolioType ?? null,
                monthlyContribution: plan?.monthlyContribution ?? 0,
                desiredLifestyleCost: plan?.desiredLifestyleCost ?? 0,
                investmentPeriod: plan?.investmentPeriod ?? 20,
                expectedReturn: plan?.expectedReturn ?? 12,
                userName: session?.user?.name?.split(" ")[0] ?? "Olá",
            })
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (session?.user) loadData()
    }, [session])

    const saveProfile = async (updates: Partial<{ totalCarteira: number; saldo: number; emergencyFund: number }>) => {
        setSaving(true)
        await fetch("/api/user/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates)
        })
        setSaving(false)
        setData(prev => prev ? { ...prev, ...updates } : prev)
    }

    const savePlan = async (updates: Partial<{ monthlyContribution: number; desiredLifestyleCost: number; investmentPeriod: number; expectedReturn: number }>) => {
        setSaving(true)
        const current = data!
        await fetch("/api/user/financial-plan", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                desiredLifestyleCost: current.desiredLifestyleCost,
                monthlyContribution: current.monthlyContribution,
                investmentPeriod: current.investmentPeriod,
                expectedReturn: current.expectedReturn,
                ...updates
            })
        })
        setSaving(false)
        setData(prev => prev ? { ...prev, ...updates } : prev)
    }

    const hour = new Date().getHours()
    const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite"

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-dash-text-light text-sm">Carregando seu dashboard...</div>
            </div>
        )
    }

    const d = data!

    const projection = projectFinancialPlan({
        currentValue: d.totalCarteira,
        monthlyContribution: d.monthlyContribution,
        investmentPeriod: d.investmentPeriod,
        nominalReturn: d.expectedReturn,
        inflationRate: 4.87, // media IPCA
        desiredLifestyleCost: d.desiredLifestyleCost,
    })

    // The chart data is now managed internally by DashboardCharts

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {saving && (
                <div className="fixed top-4 right-4 bg-dash-accent text-white text-xs px-3 py-2 rounded-full shadow z-50 animate-in fade-in">
                    Salvando...
                </div>
            )}

            {/* Greeting */}
            <div className="mb-7">
                <div className="font-serif text-[28px] text-dash-text tracking-tight mb-1">
                    {greeting}, {d.userName}.
                </div>
                <div className="text-[13px] text-dash-text-muted">
                    Aqui está um resumo da sua situação financeira.{" "}
                    <Link href="/dashboard/carteira" className="text-dash-accent hover:underline font-medium">Ver carteira completa →</Link>
                </div>
            </div>

            {/* Metrics — all editable */}
            <div className="grid grid-cols-4 gap-3.5 mb-6">
                <div className="bg-dash-surface border border-dash-border rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-1.5 text-[11px] text-dash-text-light uppercase tracking-[0.06em] mb-1">
                        <Wallet className="w-3 h-3" /> Patrimônio Total
                    </div>
                    <EditableMetric
                        label="Patrimônio Total"
                        value={d.totalCarteira}
                        onSave={v => saveProfile({ totalCarteira: v })}
                    />
                    <div className="text-[11px] text-dash-text-light mt-1">Carteira + saldo + reserva</div>
                </div>

                <div className="bg-dash-surface border border-dash-border rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-1.5 text-[11px] text-dash-text-light uppercase tracking-[0.06em] mb-1">
                        <PiggyBank className="w-3 h-3" /> Aporte Mensal
                    </div>
                    <EditableMetric
                        label="Aporte Mensal"
                        value={d.monthlyContribution}
                        onSave={v => savePlan({ monthlyContribution: v })}
                    />
                    <div className="text-[11px] text-dash-text-light mt-1">Definido no Planejamento</div>
                </div>

                <div className="bg-dash-surface border border-dash-border rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-1.5 text-[11px] text-dash-text-light uppercase tracking-[0.06em] mb-1">
                        <TrendingUp className="w-3 h-3" /> Retorno Est.
                    </div>
                    <EditableMetric
                        label="Retorno Estimado"
                        value={d.expectedReturn}
                        onSave={v => savePlan({ expectedReturn: v })}
                        prefix=""
                        suffix="% a.a."
                    />
                    <div className="text-[11px] text-dash-text-light mt-1">Rentabilidade nominal</div>
                </div>

                <div className="bg-dash-surface border border-dash-border rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-1.5 text-[11px] text-dash-text-light uppercase tracking-[0.06em] mb-1">
                        <BarChart3 className="w-3 h-3" /> Reserva de Emergência
                    </div>
                    <EditableMetric
                        label="Reserva de Emergência"
                        value={d.emergencyFund}
                        onSave={v => saveProfile({ emergencyFund: v })}
                    />
                    <div className="text-[11px] text-dash-text-light mt-1">Fundo de liquidez</div>
                </div>
            </div>

            {/* Chart */}
            <DashboardCharts
                patrimonioTotal={d.totalCarteira}
                profileType={d.portfolioType}
                startDate={null}
            />

            {/* Planejamento summary + CTA */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-dash-surface border border-dash-border rounded-2xl p-6 shadow-sm">
                    <div className="text-sm font-medium text-dash-text mb-4">Seu Planejamento</div>
                    <div className="space-y-3">
                        {[
                            { label: "Meta de renda mensal", value: d.desiredLifestyleCost > 0 ? formatBRL(d.desiredLifestyleCost) : "Não definida", highlight: false },
                            { label: "Prazo para investir", value: d.investmentPeriod > 0 ? `${d.investmentPeriod} anos restantes` : "Não definido", highlight: false },
                            { label: "Aporte mensal sugerido", value: projection.requiredMonthlyContribution > 0 ? formatBRL(projection.requiredMonthlyContribution) : "Atingido!", highlight: true },
                            { label: "Rentabilidade esperada", value: d.expectedReturn > 0 ? `${d.expectedReturn}% a.a.` : "Não definida", highlight: false },
                        ].map(({ label, value, highlight }) => (
                            <div key={label} className="flex items-center justify-between py-2 border-b border-dash-border last:border-0">
                                <span className={`text-[12px] ${highlight ? 'text-dash-accent font-medium' : 'text-dash-text-muted'}`}>{label}</span>
                                <span className={`text-[13px] font-semibold ${highlight ? 'text-dash-accent' : 'text-dash-text'}`}>{value}</span>
                            </div>
                        ))}
                    </div>
                    <Link href="/dashboard/planejamento" className="mt-4 flex items-center text-[12px] text-dash-accent hover:underline font-medium">
                        Editar planejamento →
                    </Link>
                </div>

                <div className="bg-dash-surface border border-dash-border rounded-2xl p-6 shadow-sm">
                    <div className="text-sm font-medium text-dash-text mb-4">Ações rápidas</div>
                    <div className="flex flex-col gap-2">
                        {[
                            { label: "📊 Ver minha carteira completa", href: "/dashboard/carteira" },
                            { label: "🎯 Simular independência financeira", href: "/dashboard/planejamento" },
                            { label: "📚 Acessar trilhas de educação", href: "/dashboard/educacao" },
                            { label: "💳 Gerenciar minha assinatura", href: "/dashboard/assinatura" },
                        ].map(({ label, href }) => (
                            <Link
                                key={href}
                                href={href}
                                className="flex items-center px-4 py-2.5 rounded-xl bg-dash-surface border border-dash-border text-[13px] text-dash-text hover:bg-dash-surface-active hover:border-dash-border-strong transition-colors"
                            >
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
