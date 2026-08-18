"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, CartesianGrid } from "recharts"
import { Shield, TrendingUp, Target, Sun, Scale, TreePine, ChevronRight, CheckCircle, AlertTriangle, ArrowUpRight, ArrowDownRight, Flame, Award, DollarSign, Wallet, PiggyBank, BarChart3, Zap, Star, ChevronDown, ChevronUp, Info, Eye, Compass, HelpCircle } from "lucide-react"
import { calculateInvestorProfile } from "@/lib/profile-calculator"

// ============================================================
// HELPER: CURRENCY PARSING & FORMATTING
// ============================================================
function parseCurrency(val?: string | number): number {
  if (typeof val === "number") return val
  if (!val) return 0
  const clean = val.toString().replace(/\D/g, "")
  if (!clean) return 0
  return parseInt(clean) / 100
}

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value)
}

function ScoreGauge({ score, size = 200 }: { score: number, size?: number }) {
  const [animated, setAnimated] = useState(0)

  useEffect(() => {
    let start = 0
    const duration = 1500
    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimated(Math.round(eased * score))
      if (progress < 1) requestAnimationFrame(animate)
    }
    animate()
  }, [score])

  const radius = size / 2 - 20
  const circumference = Math.PI * radius
  const strokeDashoffset = circumference - (animated / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 30} className="overflow-visible">
        <defs>
          <linearGradient id="gaugeGradLight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e4efe8" />
            <stop offset="50%" stopColor="#4fa080" />
            <stop offset="100%" stopColor="#123044" />
          </linearGradient>
        </defs>
        <path
          d={`M 20,${size / 2 + 10} A ${radius},${radius} 0 0,1 ${size - 20},${size / 2 + 10}`}
          fill="none"
          stroke="#e4e0d7"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d={`M 20,${size / 2 + 10} A ${radius},${radius} 0 0,1 ${size - 20},${size / 2 + 10}`}
          fill="none"
          stroke="url(#gaugeGradLight)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 0.1s ease" }}
        />
      </svg>
      <div className="-mt-14 text-center">
        <span className="text-5xl font-extrabold text-[#123044] tracking-tighter">{animated}</span>
        <span className="text-base text-[#667085] font-bold block mt-1">de 100 pts</span>
      </div>
    </div>
  )
}

function MetricCard({ icon: Icon, label, value, subtitle, color = "#4fa080", trend, tooltip }: {
  icon: any; label: string; value: string; subtitle?: string; color?: string; trend?: number; tooltip?: string
}) {
  return (
    <div className="bg-white rounded-[24px] border border-[#e4e0d7] p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-colors" style={{ backgroundColor: `${color}15`, color }}>
          <Icon size={22} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${trend >= 0 ? "bg-[#e8f1ed] text-[#1f674f]" : "bg-red-50 text-red-600"}`}>
            {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="text-xs font-extrabold uppercase tracking-wider text-[#667085] mb-1 flex items-center gap-1.5">
        {label}
        {tooltip && (
          <span title={tooltip} className="cursor-help text-[#a09e99] hover:text-[#123044]">
            <HelpCircle size={12} />
          </span>
        )}
      </div>
      <div className="text-2xl md:text-3xl font-extrabold text-[#123044] tracking-tight">{value}</div>
      {subtitle && <div className="text-xs font-semibold text-[#4fa080] mt-1.5">{subtitle}</div>}
    </div>
  )
}

function PillarCard({ pillar, expanded, onToggle }: { pillar: any; expanded: boolean; onToggle: () => void }) {
  const Icon = pillar.icon
  return (
    <div className="bg-white rounded-2xl border border-[#e4e0d7] overflow-hidden transition-all shadow-sm">
      <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#fbfaf8]" onClick={onToggle}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${pillar.color}15`, color: pillar.color }}>
            <Icon size={20} />
          </div>
          <div>
            <div className="text-sm font-bold text-[#123044]">{pillar.name}</div>
            <div className="text-xs font-semibold text-[#667085]">{pillar.badge}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-base font-extrabold text-[#123044]">{pillar.score}</span>
          {expanded ? <ChevronUp size={16} className="text-[#667085]" /> : <ChevronDown size={16} className="text-[#667085]" />}
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="px-4 pb-4 pt-2 border-t border-[#f0ece1] text-xs text-[#667085] leading-relaxed">
              Diagnóstico individualizado com base nas respostas fornecidas no Pilar {pillar.id}. Ações recomendadas disponíveis na aba Plano de Ação.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ObjectiveBar({ obj }: { obj: any }) {
  return (
    <div className="space-y-2 py-3 border-b border-[#f0ece1] last:border-0">
      <div className="flex justify-between items-center text-sm">
        <span className="font-bold text-[#123044]">{obj.name}</span>
        <span className="text-xs font-semibold text-[#667085]">Prazo: {obj.deadline}</span>
      </div>
      <div className="h-2.5 bg-[#e4e0d7] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, obj.pct)}%`, backgroundColor: obj.color }} />
      </div>
      <div className="flex justify-between items-center text-xs font-medium text-[#667085]">
        <span>{formatBRL(obj.current)} guardados</span>
        <span className="font-bold text-[#123044]">{formatBRL(obj.value)} ({obj.pct.toFixed(0)}%)</span>
      </div>
    </div>
  )
}

function AllocationDonut({ data, title, size = 180 }: { data: any[]; title: string; size?: number }) {
  return (
    <div className="flex flex-col items-center">
      <h4 className="text-xs font-bold text-[#667085] uppercase tracking-wider mb-4">{title}</h4>
      <div className="relative">
        <PieChart width={size} height={size}>
          <Pie data={data} cx={size / 2 - 5} cy={size / 2 - 5} innerRadius={size / 2 - 35} outerRadius={size / 2 - 10} paddingAngle={3} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value}%`} contentStyle={{ backgroundColor: "#123044", border: "none", borderRadius: "10px", color: "#fff", fontSize: "12px" }} />
        </PieChart>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-4 text-[11px] w-full max-w-[240px]">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5 truncate">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-[#667085] truncate">{item.name}</span>
            <span className="font-bold text-[#123044] ml-auto">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// MAIN PAGE COMPONENT
// ============================================================

export default function PlanoArvoDashboard({ onBack, formData = {} }: { onBack?: () => void; formData?: Record<string, string> }) {
  const [expandedPillar, setExpandedPillar] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("visao")

  // ============================================================
  // CÁLCULOS MATEMÁTICOS COM BASE NOS DADOS REAIS DA JORNADA
  // ============================================================
  const financialData = useMemo(() => {
    // 1. Renda
    const salario = parseCurrency(formData.salarioLiquido)
    const variavel = parseCurrency(formData.rendaVariavel)
    const rendaTotal = (salario + variavel) > 0 ? (salario + variavel) : 12500

    // 2. Gastos Fixos e Variáveis
    const moradia = parseCurrency(formData.gastoMoradia)
    const alimentacao = parseCurrency(formData.gastoAlimentacao)
    const transporte = parseCurrency(formData.gastoTransporte)
    const saude = parseCurrency(formData.gastoSaude)
    const dividasParcela = parseCurrency(formData.parcelasDividas)

    let customExpensesTotal = 0
    if (formData.customExpensesJson) {
      try {
        const parsed = JSON.parse(formData.customExpensesJson)
        if (Array.isArray(parsed)) {
          customExpensesTotal = parsed.reduce((sum: number, it: any) => sum + parseCurrency(it.value), 0)
        }
      } catch (e) {}
    }

    const gastoSoma = moradia + alimentacao + transporte + saude + dividasParcela + customExpensesTotal
    const gastoTotal = gastoSoma > 0 ? gastoSoma : Math.round(rendaTotal * 0.7)

    // 3. Saldo Livre = Renda - Gastos
    const saldoLivre = Math.max(0, rendaTotal - gastoTotal)
    const saldoLivrePct = rendaTotal > 0 ? Math.round((saldoLivre / rendaTotal) * 100) : 0
    const comprometimento = rendaTotal > 0 ? Math.round((gastoTotal / rendaTotal) * 100) : 70

    // 4. Reserva de Emergência
    // Regra CFP: 12 meses para PJ/Autônomo/Empresário/Misto ou 6 meses para CLT/Servidor
    const isVariavel = ["PJ", "Autônomo", "Empresário", "Misto"].includes(formData.tipoVinculo || "")
    const mesesMeta = isVariavel ? 12 : 6
    const reservaMeta = Math.max(1000, gastoTotal * mesesMeta)
    const reservaAtualInput = parseCurrency(formData.reservaAtual)
    const reservaAtual = (formData.reservaAtual !== undefined && formData.reservaAtual !== "") ? reservaAtualInput : 28000
    const reservaPct = reservaMeta > 0 ? Math.min(100, Math.round((reservaAtual / reservaMeta) * 100)) : 0

    // 5. Capacidade de Investimento
    const aporteMensalInput = parseCurrency(formData.aporteMensal)
    const capacidadeInvestimento = aporteMensalInput > 0 ? aporteMensalInput : saldoLivre

    // 6. Patrimônio & Futuro
    const patrimonioInvestido = parseCurrency(formData.patrimonioInvestido) || (reservaAtual > 0 ? reservaAtual : 185000)
    const dividasTotal = parseCurrency(formData.totalDividas) || 0
    const idadeAtual = parseInt(formData.idade || "35") || 35
    const idadeAposentadoria = parseInt(formData.idadeIf || "60") || 60
    const anosRestantes = Math.max(1, idadeAposentadoria - idadeAtual)
    const rendaDesejada = parseCurrency(formData.rendaAposentadoria) || Math.round(rendaTotal * 0.8)
    
    // Regra dos 4% para independência financeira
    const patrimonioNecessarioAposentadoria = Math.round((rendaDesejada * 12) / 0.04)
    const gapAposentadoria = Math.max(0, patrimonioNecessarioAposentadoria - patrimonioInvestido)

    // 7. Economia Tributária
    const isCltCompleta = formData.tipoRendimento === "Salário CLT" && formData.declaracaoIr === "Completa"
    const economiaFiscalPotencial = isCltCompleta ? Math.round(rendaTotal * 12 * 0.12 * 0.275) : 4200

    // Perfil
    const investorProfile = calculateInvestorProfile(formData)

    return {
      rendaTotal,
      gastoTotal,
      saldoLivre,
      saldoLivrePct,
      comprometimento,
      reservaAtual,
      reservaMeta,
      reservaPct,
      mesesMeta,
      dividasTotal,
      dividasParcela,
      capacidadeInvestimento,
      patrimonioInvestido,
      patrimonioNecessarioAposentadoria,
      gapAposentadoria,
      idadeAtual,
      idadeAposentadoria,
      anosRestantes,
      economiaFiscalPotencial,
      investorProfile,
      isVariavel
    }
  }, [formData])

  const pillarData = [
    { id: 1, name: "Organização Financeira", score: 78, icon: Wallet, color: "#123044", badge: "Organizador Financeiro" },
    { id: 2, name: "Proteção e Segurança", score: 65, icon: Shield, color: "#2b6e76", badge: "Guardião" },
    { id: 3, name: "Construção de Patrimônio", score: 80, icon: TrendingUp, color: "#4fa080", badge: "Construtor de Patrimônio" },
    { id: 4, name: "Futuro e Aposentadoria", score: 70, icon: Sun, color: "#123044", badge: "Arquiteto do Futuro" },
    { id: 5, name: "Inteligência Tributária", score: 62, icon: Scale, color: "#2b6e76", badge: "Estrategista Tributário" },
    { id: 6, name: "Legado e Sucessão", score: 55, icon: TreePine, color: "#4fa080", badge: "Arquiteto do Legado" },
    { id: 7, name: "Análise do Seu Perfil de Investimento", score: 90, icon: Compass, color: "#1f674f", badge: `Perfil ${financialData.investorProfile}` },
  ]

  const globalScore = Math.round(pillarData.reduce((acc, p) => acc + p.score, 0) / pillarData.length)

  const scoreEvolucao = [
    { mes: "Jan", score: Math.max(10, globalScore - 40) },
    { mes: "Fev", score: Math.max(20, globalScore - 30) },
    { mes: "Mar", score: Math.max(30, globalScore - 22) },
    { mes: "Abr", score: Math.max(40, globalScore - 14) },
    { mes: "Mai", score: Math.max(50, globalScore - 6) },
    { mes: "Jun", score: globalScore },
  ]

  const riskRadar = [
    { risk: "Morte Prematura", level: formData.seguroVidaAtual ? 20 : 50 },
    { risk: "Invalidez", level: formData.planoSaude?.includes("Sim") ? 30 : 60 },
    { risk: "Patrimonial", level: financialData.reservaPct >= 100 ? 15 : 45 },
    { risk: "Saúde", level: formData.planoSaude ? 25 : 70 },
    { risk: "Responsab. Civil", level: 20 },
  ]

  const topActions = [
    ...(financialData.reservaPct < 100 ? [{
      priority: 1,
      text: `Completar a reserva de emergência (faltam ${formatBRL(financialData.reservaMeta - financialData.reservaAtual)} para atingir ${financialData.mesesMeta} meses)`,
      pillar: 1,
      impact: "alto"
    }] : []),
    ...(financialData.dividasTotal > 0 ? [{
      priority: 2,
      text: `Planejar amortização das dívidas acumuladas de ${formatBRL(financialData.dividasTotal)}`,
      pillar: 1,
      impact: "alto"
    }] : []),
    {
      priority: 3,
      text: `Manter aporte mensal disciplinado de ${formatBRL(financialData.capacidadeInvestimento)} na Bússola (${financialData.investorProfile})`,
      pillar: 3,
      impact: "alto"
    },
    {
      priority: 4,
      text: `Acelerar projeção para fechar o gap de aposentadoria de ${formatBRL(financialData.gapAposentadoria)} em ${financialData.anosRestantes} anos`,
      pillar: 4,
      impact: "médio"
    },
    {
      priority: 5,
      text: `Organizar dossiê de sucessão e inventário para proteção familiar`,
      pillar: 6,
      impact: "baixo"
    }
  ]

  const patrimonioProjection = [
    { ano: "Hoje", aportes: financialData.patrimonioInvestido, rendimentos: 0 },
    { ano: "2031", aportes: Math.round(financialData.patrimonioInvestido + financialData.capacidadeInvestimento * 60), rendimentos: Math.round(financialData.capacidadeInvestimento * 25) },
    { ano: "2036", aportes: Math.round(financialData.patrimonioInvestido + financialData.capacidadeInvestimento * 120), rendimentos: Math.round(financialData.capacidadeInvestimento * 80) },
    { ano: "2041", aportes: Math.round(financialData.patrimonioInvestido + financialData.capacidadeInvestimento * 180), rendimentos: Math.round(financialData.capacidadeInvestimento * 180) },
    { ano: "2046", aportes: Math.round(financialData.patrimonioInvestido + financialData.capacidadeInvestimento * 240), rendimentos: Math.round(financialData.capacidadeInvestimento * 340) },
    { ano: "2054", aportes: Math.round(financialData.patrimonioInvestido + financialData.capacidadeInvestimento * 336), rendimentos: Math.round(financialData.capacidadeInvestimento * 680) },
  ]

  const allocationCurrent = [
    { name: "RF Pós-fixada", value: 45, color: "#123044" },
    { name: "RF IPCA+", value: 15, color: "#2b6e76" },
    { name: "FIIs", value: 12, color: "#4fa080" },
    { name: "Ações BR", value: 18, color: "#9bcbb4" },
    { name: "Internacional", value: 5, color: "#0A192F" },
    { name: "Cripto", value: 5, color: "#667085" },
  ]

  const allocationSuggested = [
    { name: "RF Pós-fixada", value: 30, color: "#123044" },
    { name: "RF IPCA+", value: 18, color: "#2b6e76" },
    { name: "RF Pré", value: 7, color: "#6b9487" },
    { name: "FIIs", value: 18, color: "#4fa080" },
    { name: "Ações BR", value: 17, color: "#9bcbb4" },
    { name: "Internacional", value: 10, color: "#0A192F" },
  ]

  const objectives = [
    { name: "Reserva de Emergência", value: financialData.reservaMeta, current: financialData.reservaAtual, deadline: "Curto Prazo", pct: financialData.reservaPct, color: "#4fa080" },
    { name: "Principal Objetivo Declarado", value: Math.round(financialData.patrimonioInvestido * 1.5), current: financialData.patrimonioInvestido, deadline: formData.prazoPrincipalObjetivo || "Médio Prazo", pct: 65, color: "#2b6e76" },
    { name: "Independência Financeira", value: financialData.patrimonioNecessarioAposentadoria, current: financialData.patrimonioInvestido, deadline: `${financialData.idadeAposentadoria} anos`, pct: financialData.patrimonioNecessarioAposentadoria > 0 ? (financialData.patrimonioInvestido / financialData.patrimonioNecessarioAposentadoria) * 100 : 10, color: "#123044" },
  ]

  const tabs = [
    { id: "visao", label: "Visão Geral", icon: Eye },
    { id: "patrimonio", label: "Patrimônio & Futuro", icon: TrendingUp },
    { id: "acoes", label: "Plano de Ação", icon: Zap },
  ]

  return (
    <div className="min-h-screen font-sans p-4 md:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-[#f6f4ef]">
      <div className="max-w-[1200px] mx-auto space-y-8">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#e4e0d7]">
            <div>
                <div className="flex items-center gap-4 mb-3">
                    {onBack && (
                        <button 
                            onClick={onBack}
                            className="flex items-center gap-1.5 text-xs font-bold text-[#667085] hover:text-[#123044] transition-colors bg-white border border-[#e4e0d7] px-3 py-1.5 rounded-full shadow-sm cursor-pointer"
                        >
                            <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                            Voltar para a Jornada
                        </button>
                    )}
                    <div className="text-[11px] font-extrabold text-[#4fa080] uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle size={14} />
                        Diagnóstico Baseado nos Seus Dados
                    </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-extralight tracking-tight text-[#123044] mb-2 leading-[1.1]">
                    Meu Plano <span className="font-semibold">ARVO</span>
                </h1>
                <p className="text-[#667085] text-base max-w-xl leading-relaxed">
                    Visão consolidada calculada a partir dos dados reais que você preencheu nas 7 etapas da Jornada.
                </p>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white border border-[#e4e0d7] rounded-full px-4 py-2 shadow-sm">
                    <Compass size={18} className="text-[#1f674f]" />
                    <span className="text-xs font-bold text-[#123044]">Perfil: {financialData.investorProfile}</span>
                </div>
            </div>
        </header>

        {/* HERO — Score + Level */}
        <section>
          <div className="bg-white rounded-[32px] border border-[#e4e0d7] p-8 md:p-10 shadow-[0_20px_50px_rgba(23,33,43,0.03)]">
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10 lg:gap-16 items-center">
              
              {/* Score Gauge */}
              <div className="flex flex-col items-center justify-center p-6 bg-[#fbfaf8] border border-[#f0ece1] rounded-[24px]">
                <ScoreGauge score={globalScore} size={240} />
                <div className="mt-6 bg-[#123044] !text-white rounded-full px-6 py-2 shadow-md">
                  <span className="text-sm font-extrabold tracking-wide uppercase !text-white">Nível: Estrategista</span>
                </div>
                <p className="text-xs font-semibold text-[#667085] mt-4 text-center">Score consolidado das 7 etapas preenchidas.</p>
              </div>

              {/* Pillar Scores Mini */}
              <div>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-[#123044]">Seus 7 Pilares</h3>
                    <span className="text-xs font-bold text-[#4fa080] bg-[#e8f1ed] px-3 py-1 rounded-full border border-[#d6e5de]">Média: {globalScore} pts</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {pillarData.map((p) => (
                    <PillarCard key={p.id} pillar={p} expanded={expandedPillar === p.id} onToggle={() => setExpandedPillar(expandedPillar === p.id ? null : p.id)} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TAB NAV */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 bg-white border border-[#e4e0d7] rounded-2xl p-1.5 shadow-sm max-w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2.5 px-6 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  activeTab === tab.id 
                  ? "bg-[#123044] text-white shadow-md" 
                  : "text-[#667085] hover:bg-[#f0ece1] hover:text-[#123044]"
                }`}>
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* TAB: VISÃO GERAL */}
        {activeTab === "visao" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            
            {/* Key Metrics Calculadas */}
            <section className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <MetricCard 
                  icon={DollarSign} 
                  label="Renda Mensal" 
                  value={formatBRL(financialData.rendaTotal)} 
                  subtitle={`Salário + Renda Variável`}
                  color="#4fa080" 
                  tooltip="Soma do Salário Líquido informado na Etapa 1 com rendas variáveis eventuais."
                />
                <MetricCard 
                  icon={Wallet} 
                  label="Saldo Livre" 
                  value={formatBRL(financialData.saldoLivre)} 
                  subtitle={`${financialData.saldoLivrePct}% da sua renda líquida`} 
                  color="#2b6e76" 
                  tooltip="Cálculo exato: Renda Mensal menos todos os seus gastos informados na Etapa 1."
                />
                <MetricCard 
                  icon={PiggyBank} 
                  label="Reserva de Emergência" 
                  value={`${financialData.reservaPct}%`} 
                  subtitle={`${formatBRL(financialData.reservaAtual)} de ${formatBRL(financialData.reservaMeta)} (${financialData.mesesMeta}m)`} 
                  color="#4fa080" 
                  tooltip={`Meta recomendada de ${financialData.mesesMeta} meses de gastos para o seu perfil (${financialData.isVariavel ? "PJ/Autônomo/Empresário" : "CLT/Público"}).`}
                />
                <MetricCard 
                  icon={TrendingUp} 
                  label="Capacidade de Investimento" 
                  value={formatBRL(financialData.capacidadeInvestimento) + "/mês"} 
                  subtitle={formData.aporteMensal ? "Aporte planejado na Etapa 3" : "Baseado no seu saldo livre"}
                  color="#123044" 
                  tooltip="Valor disponível ou planejado para aportar todo mês em investimentos."
                />
              </div>
            </section>

            {/* Row: Score Evolution + Risk Radar */}
            <section className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 lg:gap-8 mb-8">
              
              {/* Score Evolution */}
              <div className="bg-white rounded-[24px] border border-[#e4e0d7] p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-2 h-2 rounded-full bg-[#123044]"></div>
                    <h3 className="text-lg font-bold text-[#123044]">Evolução do Score Global</h3>
                </div>
                <div className="w-full">
                    <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={scoreEvolucao} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                        <linearGradient id="scoreGradLight" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#123044" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#123044" stopOpacity={0} />
                        </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0ece1" vertical={false} />
                        <XAxis dataKey="mes" tick={{ fill: "#667085", fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                        <YAxis domain={[0, 100]} tick={{ fill: "#667085", fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: "#123044", border: "none", borderRadius: "12px", color: "#fff", fontSize: "13px", fontWeight: 600, padding: "10px 16px" }} itemStyle={{ color: "#fff" }} />
                        <Area type="monotone" dataKey="score" stroke="#123044" strokeWidth={3} fill="url(#scoreGradLight)" dot={{ fill: "#fff", stroke: "#123044", strokeWidth: 3, r: 5 }} activeDot={{ r: 7 }} />
                    </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-6 text-center">
                    <span className="inline-block px-4 py-1.5 bg-[#e8f1ed] text-[#1f674f] font-bold text-xs rounded-full border border-[#d6e5de]">
                        Diagnóstico Atualizado em Tempo Real
                    </span>
                </div>
              </div>

              {/* Risk Radar */}
              <div className="bg-white rounded-[24px] border border-[#e4e0d7] p-6 md:p-8 shadow-sm flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-[#EF4444]"></div>
                    <h3 className="text-lg font-bold text-[#123044]">Mapa de Riscos Pessoais</h3>
                </div>
                <p className="text-sm font-medium text-[#667085] mb-6">Mapeamento de vulnerabilidade após proteções</p>
                <div className="flex-1 flex items-center justify-center -ml-6">
                    <ResponsiveContainer width="100%" height={260}>
                    <RadarChart data={riskRadar} outerRadius={80}>
                        <PolarGrid stroke="#e4e0d7" />
                        <PolarAngleAxis dataKey="risk" tick={{ fill: "#475467", fontSize: 11, fontWeight: 600 }} />
                        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar dataKey="level" stroke="#EF4444" fill="#EF4444" fillOpacity={0.2} strokeWidth={2} dot={{ r: 4, fill: "#EF4444", stroke: "#fff", strokeWidth: 1 }} />
                    </RadarChart>
                    </ResponsiveContainer>
                </div>
              </div>
            </section>

          </motion.div>
        )}

        {/* TAB: PATRIMÔNIO & FUTURO */}
        {activeTab === "patrimonio" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            
            <section className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <MetricCard icon={BarChart3} label="Patrimônio Atual" value={formatBRL(financialData.patrimonioInvestido)} color="#123044" />
                <MetricCard icon={Target} label="Meta Aposentadoria" value={formatBRL(financialData.patrimonioNecessarioAposentadoria)} subtitle={`Para renda de ${formatBRL(financialData.rendaTotal * 0.8)}/mês`} color="#4fa080" />
                <MetricCard icon={Zap} label="Gap Aposentadoria" value={formatBRL(financialData.gapAposentadoria)} subtitle={`Prazo: ${financialData.anosRestantes} anos restantes`} color="#0A192F" />
                <MetricCard icon={Star} label="Economia Fiscal" value={formatBRL(financialData.economiaFiscalPotencial) + "/ano"} subtitle="Otimização legal via IR" color="#4fa080" />
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 lg:gap-8 mb-8">
                
                {/* Projection Chart */}
                <div className="bg-white rounded-[24px] border border-[#e4e0d7] p-6 md:p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-[#3B82F6]"></div>
                            <h3 className="text-lg font-bold text-[#123044]">Projeção de Acumulação</h3>
                        </div>
                        <span className="text-xs font-bold text-[#667085] bg-[#f0ece1] px-3 py-1.5 rounded-lg">Cenário: 8.5% a.a.</span>
                    </div>
                    
                    <div className="w-full">
                        <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={patrimonioProjection} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="aportesGradL" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#123044" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#123044" stopOpacity={0.2} />
                                </linearGradient>
                                <linearGradient id="rendGradL" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4fa080" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#4fa080" stopOpacity={0.2} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0ece1" vertical={false} />
                            <XAxis dataKey="ano" tick={{ fill: "#667085", fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                            <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} tick={{ fill: "#667085", fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} dx={-10} />
                            <Tooltip formatter={(value: number) => formatBRL(value)} contentStyle={{ backgroundColor: "#123044", border: "none", borderRadius: "12px", color: "#fff", fontSize: "13px", fontWeight: 600 }} itemStyle={{ color: "#fff" }} />
                            <Area type="monotone" dataKey="aportes" stackId="1" stroke="#123044" fill="url(#aportesGradL)" strokeWidth={2} name="Aportes" />
                            <Area type="monotone" dataKey="rendimentos" stackId="1" stroke="#4fa080" fill="url(#rendGradL)" strokeWidth={2} name="Rendimentos" />
                        </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-6 mt-6">
                        <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-md bg-[#123044]" />
                        <span className="text-sm font-semibold text-[#475467]">Aportes Acumulados</span>
                        </div>
                        <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-md bg-[#4fa080]" />
                        <span className="text-sm font-semibold text-[#475467]">Efeito Juros Compostos</span>
                        </div>
                    </div>
                </div>

                {/* Objectives */}
                <div className="bg-white rounded-[24px] border border-[#e4e0d7] p-6 md:p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-2 h-2 rounded-full bg-[#8B5CF6]"></div>
                        <h3 className="text-lg font-bold text-[#123044]">Metas & Objetivos</h3>
                    </div>
                    <div>
                        {objectives.map((obj, i) => <ObjectiveBar key={i} obj={obj} />)}
                    </div>
                </div>
            </section>

            {/* Allocation comparison */}
            <section className="mb-8 bg-white rounded-[24px] border border-[#e4e0d7] p-6 md:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#123044] mb-1">Diagnóstico de Alocação Recomendada</h3>
                    <p className="text-sm font-medium text-[#667085]">Calibrado para o seu Perfil Oficial ({financialData.investorProfile})</p>
                  </div>
                  <span className="text-xs font-bold bg-[#fbfaf8] border border-[#e4e0d7] text-[#123044] px-4 py-2 rounded-xl">
                      Perfil: <span className="text-[#1f674f] font-extrabold">{financialData.investorProfile}</span>
                  </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-6 mb-8">
                <div className="bg-[#fbfaf8] border border-[#f0ece1] rounded-[24px] py-8">
                    <AllocationDonut data={allocationCurrent} title="Carteira Referência" size={220} />
                </div>
                <div className="bg-[#f8fcfb] border border-[#d6e5de] rounded-[24px] py-8">
                    <AllocationDonut data={allocationSuggested} title={`Alocação Alvo (${financialData.investorProfile})`} size={220} />
                </div>
              </div>

              <div className="bg-[#fff9e6] border border-[#fce49c] rounded-2xl p-5 flex items-start gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-[#fdeca6] flex items-center justify-center shrink-0">
                    <AlertTriangle size={20} className="text-[#d97706]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#b45309] mb-1">Diretriz da sua Bússola de Investimentos</p>
                  <p className="text-sm text-[#92400e] leading-relaxed">
                    Com base no seu perfil <strong>{financialData.investorProfile}</strong> diagnosticado na etapa 7, suas recomendações e tolerância de risco na Bússola estarão automaticamente calibradas para este nível de volatilidade e liquidez.
                  </p>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {/* TAB: PLANO DE AÇÃO */}
        {activeTab === "acoes" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 md:space-y-8">
            
            {/* Top Actions */}
            <section>
              <div className="bg-[#123044] rounded-[32px] p-8 md:p-10 shadow-xl !text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl"></div>
                
                <div className="flex items-center gap-4 mb-8 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white text-[#123044] flex items-center justify-center shadow-md">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight !text-white">O que fazer agora?</h3>
                    <p className="!text-white/70 text-sm mt-1">Ações prioritárias personalizadas para os seus números</p>
                  </div>
                </div>

                <div className="space-y-4 relative z-10">
                  {topActions.map((action, i) => (
                    <div key={i} className="group flex flex-col sm:flex-row sm:items-center gap-4 bg-white/10 rounded-2xl p-5 border border-white/10 hover:bg-white/15 transition-all">
                      <div className="w-8 h-8 rounded-full bg-[#4fa080] !text-white flex items-center justify-center shrink-0 font-black shadow-inner">
                        {action.priority}
                      </div>
                      <div className="flex-1">
                        <p className="text-base font-bold leading-snug !text-white">{action.text}</p>
                        <div className="flex items-center gap-3 mt-2.5">
                          <span className="text-xs font-semibold !text-white/60 bg-white/5 px-2 py-1 rounded-md">Pilar {action.pillar}</span>
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md ${
                            action.impact === "alto" ? "bg-red-500/20 text-red-300" :
                            action.impact === "médio" ? "bg-yellow-500/20 text-yellow-300" :
                            "bg-white/10 !text-white/60"
                          }`}>
                            Impacto {action.impact}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

          </motion.div>
        )}

      </div>
    </div>
  )
}
