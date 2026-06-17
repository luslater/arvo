"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, CartesianGrid } from "recharts"
import { Shield, TrendingUp, Target, Sun, Scale, TreePine, ChevronRight, CheckCircle, AlertTriangle, ArrowUpRight, ArrowDownRight, Flame, Award, DollarSign, Wallet, PiggyBank, BarChart3, Zap, Star, ChevronDown, ChevronUp, Info, Eye } from "lucide-react"

// ============================================================
// DADOS SIMULADOS (Plano ARVO)
// ============================================================
const userData = {
  name: "Lucas",
  level: "Estrategista",
  globalScore: 68,
  streak: 14,
  lastUpdate: "05 Jun 2026",
}

const pillarData = [
  { id: 1, name: "Organização Financeira", score: 74, icon: Wallet, color: "#4fa080", badge: "Organizador Financeiro", status: "completed" },
  { id: 2, name: "Proteção e Segurança", score: 61, icon: Shield, color: "#3B82F6", badge: "Guardião", status: "completed" },
  { id: 3, name: "Construção de Patrimônio", score: 72, icon: TrendingUp, color: "#8B5CF6", badge: "Construtor de Patrimônio", status: "completed" },
  { id: 4, name: "Futuro e Aposentadoria", score: 65, icon: Sun, color: "#F59E0B", badge: "Arquiteto do Futuro", status: "completed" },
  { id: 5, name: "Inteligência Tributária", score: 58, icon: Scale, color: "#EF4444", badge: "Estrategista Tributário", status: "completed" },
  { id: 6, name: "Legado e Sucessão", score: 52, icon: TreePine, color: "#06B6D4", badge: "Arquiteto do Legado", status: "completed" },
]

const financialSummary = {
  rendaTotal: 12500,
  gastoTotal: 8750,
  saldoLivre: 3750,
  comprometimento: 70,
  reservaAtual: 28000,
  reservaMeta: 52500,
  reservaPct: 53.3,
  dividasTotal: 45000,
  capacidadeInvestimento: 2200,
  patrimonioInvestido: 185000,
  patrimonioNecessarioAposentadoria: 2400000,
  projecaoAtual: 1850000,
  gapAposentadoria: 550000,
  idadeAtual: 32,
  idadeAposentadoria: 60,
  anosRestantes: 28,
  economiaFiscalPotencial: 4200,
  scoreEvolucao: [
    { mes: "Jan", score: 22 }, { mes: "Fev", score: 31 }, { mes: "Mar", score: 38 },
    { mes: "Abr", score: 48 }, { mes: "Mai", score: 59 }, { mes: "Jun", score: 68 },
  ],
}

const allocationCurrent = [
  { name: "RF Pós-fixada", value: 45, color: "#4fa080" },
  { name: "RF IPCA+", value: 15, color: "#34D399" },
  { name: "FIIs", value: 12, color: "#3B82F6" },
  { name: "Ações BR", value: 18, color: "#8B5CF6" },
  { name: "Internacional", value: 5, color: "#F59E0B" },
  { name: "Cripto", value: 5, color: "#EF4444" },
]

const allocationSuggested = [
  { name: "RF Pós-fixada", value: 30, color: "#4fa080" },
  { name: "RF IPCA+", value: 18, color: "#34D399" },
  { name: "RF Pré", value: 7, color: "#6EE7B7" },
  { name: "FIIs", value: 18, color: "#3B82F6" },
  { name: "Ações BR", value: 17, color: "#8B5CF6" },
  { name: "Internacional", value: 10, color: "#F59E0B" },
]

const patrimonioProjection = [
  { ano: "Hoje", aportes: 185000, rendimentos: 0 },
  { ano: "2031", aportes: 317400, rendimentos: 68000 },
  { ano: "2036", aportes: 449800, rendimentos: 215000 },
  { ano: "2041", aportes: 582200, rendimentos: 468000 },
  { ano: "2046", aportes: 714600, rendimentos: 862000 },
  { ano: "2051", aportes: 847000, rendimentos: 1453000 },
  { ano: "2054", aportes: 926200, rendimentos: 1850000 },
]

const riskRadar = [
  { risk: "Morte Prematura", level: 35 },
  { risk: "Invalidez", level: 55 },
  { risk: "Patrimonial", level: 25 },
  { risk: "Saúde", level: 30 },
  { risk: "Responsab. Civil", level: 20 },
]

const missions = [
  { text: "Atualize o saldo da sua reserva de emergência", pillar: 1, done: true },
  { text: "Confira beneficiários do seguro de vida", pillar: 2, done: false },
  { text: "Faça um aporte este mês", pillar: 3, done: false },
  { text: "Verifique tempo de contribuição no Meu INSS", pillar: 4, done: false },
  { text: "Separe comprovantes de dedução de IR", pillar: 5, done: true },
]

const topActions = [
  { priority: 1, text: "Completar a reserva de emergência (faltam R$ 24.500)", pillar: 1, impact: "alto" },
  { priority: 2, text: "Rebalancear carteira: aumentar exposição internacional para 10%", pillar: 3, impact: "médio" },
  { priority: 3, text: "Contratar PGBL até 12% da renda bruta — economia de R$ 4.200/ano", pillar: 5, impact: "alto" },
  { priority: 4, text: "Aumentar aporte mensal em R$ 450 para fechar gap da aposentadoria", pillar: 4, impact: "alto" },
  { priority: 5, text: "Fazer testamento simples em cartório", pillar: 6, impact: "baixo" },
]

const objectives = [
  { name: "Viagem Europa", value: 25000, current: 8500, deadline: "Dez 2027", pct: 34, color: "#3B82F6" },
  { name: "Entrada Apartamento", value: 180000, current: 95000, deadline: "Jun 2030", pct: 52.8, color: "#8B5CF6" },
  { name: "Independência Financeira", value: 2400000, current: 185000, deadline: "Jun 2054", pct: 7.7, color: "#F59E0B" },
]

// ============================================================
// COMPONENTS
// ============================================================

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
  const cx = size / 2
  const cy = size / 2 + 10

  const getColor = (s: number) => {
    if (s >= 80) return "#4fa080"
    if (s >= 60) return "#3B82F6"
    if (s >= 40) return "#F59E0B"
    return "#EF4444"
  }

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 30} viewBox={`0 0 ${size} ${size / 2 + 30}`}>
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="33%" stopColor="#F59E0B" />
            <stop offset="66%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#4fa080" />
          </linearGradient>
        </defs>
        <path d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`} fill="none" stroke="#e4e0d7" strokeWidth="16" strokeLinecap="round" />
        <path d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`} fill="none" stroke="url(#gaugeGrad)" strokeWidth="16" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 0.1s ease" }} />
        <text x={cx} y={cy - 15} textAnchor="middle" fontSize="48" fontWeight="800" fill="#123044" className="font-sans">{animated}</text>
        <text x={cx} y={cy + 15} textAnchor="middle" fontSize="13" fill="#667085" fontWeight="600" className="font-sans uppercase tracking-widest">Score Global</text>
      </svg>
    </div>
  )
}

function PillarCard({ pillar, expanded, onToggle }: any) {
  const Icon = pillar.icon
  const barWidth = `${pillar.score}%`

  return (
    <div className="bg-white rounded-2xl border border-[#e4e0d7] overflow-hidden hover:shadow-md transition-all cursor-pointer group" onClick={onToggle}>
      <div className="p-4 md:p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105" style={{ backgroundColor: pillar.color + "15" }}>
              <Icon size={20} style={{ color: pillar.color }} className="md:w-6 md:h-6" />
            </div>
            <div>
              <p className="text-[10px] md:text-xs font-bold text-[#667085] uppercase tracking-wider mb-0.5">Pilar {pillar.id}</p>
              <p className="text-sm md:text-base font-bold text-[#123044]">{pillar.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-black" style={{ color: pillar.color }}>{pillar.score}</span>
            {expanded ? <ChevronUp size={20} className="text-[#667085]" /> : <ChevronDown size={20} className="text-[#667085]" />}
          </div>
        </div>
        <div className="w-full h-2 md:h-2.5 bg-[#f0ece1] rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: barWidth, backgroundColor: pillar.color }} />
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-5 pb-5 border-t border-[#e4e0d7] pt-4 bg-[#faf9f6]">
              <div className="flex items-center gap-2 mb-2">
                <Award size={16} style={{ color: pillar.color }} />
                <span className="text-xs font-bold text-[#123044]">Badge: {pillar.badge}</span>
              </div>
              <p className="text-sm text-[#475467] leading-relaxed">
                {pillar.score >= 80 ? "Excelência — mantenha o padrão atual." :
                 pillar.score >= 60 ? "Bom progresso. Pequenos ajustes podem elevar seu score." :
                 "Existem oportunidades relevantes de melhoria neste pilar. Veja o Plano de Ação."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MetricCard({ icon: Icon, label, value, subtitle, color = "#4fa080", trend }: any) {
  return (
    <div className="bg-white rounded-2xl border border-[#e4e0d7] p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-[14px] flex items-center justify-center" style={{ backgroundColor: color + "15" }}>
          <Icon size={24} style={{ color }} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
            {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-3xl font-extralight text-[#123044] tracking-tight">{value}</p>
      <p className="text-xs font-bold text-[#667085] uppercase tracking-wider mt-2">{label}</p>
      {subtitle && <p className="text-sm font-medium mt-1" style={{ color }}>{subtitle}</p>}
    </div>
  )
}

function AllocationDonut({ data, title, size = 180 }: any) {
  return (
    <div className="flex flex-col items-center">
      <p className="text-xs font-extrabold text-[#123044] mb-4 uppercase tracking-widest bg-[#f0ece1] px-4 py-1.5 rounded-full">{title}</p>
      <ResponsiveContainer width={size} height={size}>
        <PieChart>
          <Pie data={data} dataKey="value" cx="50%" cy="50%" innerRadius={size * 0.3} outerRadius={size * 0.45} paddingAngle={3} strokeWidth={0}>
            {data.map((entry: any, i: number) => <Cell key={i} fill={entry.color} />)}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e4e0d7", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }} itemStyle={{ color: "#123044", fontWeight: 600 }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 max-w-sm">
        {data.map((item: any, i: number) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[11px] font-bold text-[#475467]">{item.name} {item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ObjectiveBar({ obj }: any) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-bold text-[#123044]">{obj.name}</span>
        <span className="text-xs font-bold text-[#667085] bg-[#f0ece1] px-2 py-1 rounded-md">{obj.deadline}</span>
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-[#475467] font-medium">{formatBRL(obj.current)} <span className="text-[#a19d91]">de {formatBRL(obj.value)}</span></span>
        <span className="text-sm font-black" style={{ color: obj.color }}>{obj.pct.toFixed(1)}%</span>
      </div>
      <div className="w-full h-3 bg-[#f0ece1] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min(obj.pct, 100)}%`, backgroundColor: obj.color }} />
      </div>
    </div>
  )
}

// ============================================================
// MAIN PAGE COMPONENT
// ============================================================

export default function PlanoArvoDashboard({ onBack }: { onBack?: () => void }) {
  const [expandedPillar, setExpandedPillar] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("visao")

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
                            className="flex items-center gap-1.5 text-xs font-bold text-[#667085] hover:text-[#123044] transition-colors bg-white border border-[#e4e0d7] px-3 py-1.5 rounded-full shadow-sm"
                        >
                            <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                            Voltar para Jornada
                        </button>
                    )}
                    <div className="text-[11px] font-extrabold text-[#4fa080] uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle size={14} />
                        Diagnóstico Concluído
                    </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-extralight tracking-tight text-[#123044] mb-2 leading-[1.1]">
                    Meu Plano <span className="font-semibold">ARVO</span>
                </h1>
                <p className="text-[#667085] text-base max-w-xl leading-relaxed">
                    Aqui está a visão consolidada da sua vida financeira, baseada nos dados fornecidos na Jornada CFP.
                </p>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white border border-[#e4e0d7] rounded-full px-4 py-2 shadow-sm">
                    <Flame size={18} className="text-orange-500" />
                    <span className="text-sm font-bold text-[#123044]">{userData.streak} dias de engajamento</span>
                </div>
            </div>
        </header>

        {/* HERO — Score + Level */}
        <section>
          <div className="bg-white rounded-[32px] border border-[#e4e0d7] p-8 md:p-10 shadow-[0_20px_50px_rgba(23,33,43,0.03)]">
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10 lg:gap-16 items-center">
              
              {/* Score Gauge */}
              <div className="flex flex-col items-center justify-center p-6 bg-[#fbfaf8] border border-[#f0ece1] rounded-[24px]">
                <ScoreGauge score={userData.globalScore} size={240} />
                <div className="mt-6 bg-[#123044] !text-white rounded-full px-6 py-2 shadow-md">
                  <span className="text-sm font-extrabold tracking-wide uppercase !text-white">Nível: {userData.level}</span>
                </div>
                <p className="text-xs font-semibold text-[#667085] mt-4 text-center">Você está melhor que 62% dos usuários.</p>
              </div>

              {/* Pillar Scores Mini */}
              <div>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-[#123044]">Seus 6 Pilares</h3>
                    <span className="text-xs font-bold text-[#4fa080] bg-[#e8f1ed] px-3 py-1 rounded-full border border-[#d6e5de]">Média: 63 pts</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                className={`flex items-center gap-2 py-2.5 px-6 rounded-xl text-sm font-bold transition-all ${
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
            
            {/* Key Metrics */}
            <section className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <MetricCard icon={DollarSign} label="Renda Mensal" value={formatBRL(financialSummary.rendaTotal)} color="#4fa080" />
                <MetricCard icon={Wallet} label="Saldo Livre" value={formatBRL(financialSummary.saldoLivre)} subtitle={`${(100 - financialSummary.comprometimento)}% da renda`} color="#3B82F6" trend={5} />
                <MetricCard icon={PiggyBank} label="Reserva de Emergência" value={`${financialSummary.reservaPct.toFixed(0)}%`} subtitle={`${formatBRL(financialSummary.reservaAtual)} de ${formatBRL(financialSummary.reservaMeta)}`} color="#F59E0B" trend={12} />
                <MetricCard icon={TrendingUp} label="Capacidade de Investimento" value={formatBRL(financialSummary.capacidadeInvestimento) + "/mês"} color="#8B5CF6" trend={8} />
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
                <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={financialSummary.scoreEvolucao} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                        +46 pontos desde Janeiro
                    </span>
                </div>
              </div>

              {/* Risk Radar */}
              <div className="bg-white rounded-[24px] border border-[#e4e0d7] p-6 md:p-8 shadow-sm flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-[#EF4444]"></div>
                    <h3 className="text-lg font-bold text-[#123044]">Mapa de Riscos (Pilar 2)</h3>
                </div>
                <p className="text-sm font-medium text-[#667085] mb-6">Vulnerabilidade residual após proteções</p>
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
                <MetricCard icon={BarChart3} label="Patrimônio Atual" value={formatBRL(financialSummary.patrimonioInvestido)} color="#8B5CF6" trend={14} />
                <MetricCard icon={Target} label="Meta Aposentadoria" value={formatBRL(financialSummary.patrimonioNecessarioAposentadoria)} subtitle={`Em ${financialSummary.anosRestantes} anos`} color="#F59E0B" />
                <MetricCard icon={Zap} label="Gap Aposentadoria" value={formatBRL(financialSummary.gapAposentadoria)} subtitle="Diferença para a meta" color="#EF4444" />
                <MetricCard icon={Star} label="Economia Fiscal" value={formatBRL(financialSummary.economiaFiscalPotencial) + "/ano"} subtitle="Via limite do PGBL" color="#4fa080" />
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 lg:gap-8 mb-8">
                
                {/* Projection Chart */}
                <div className="bg-white rounded-[24px] border border-[#e4e0d7] p-6 md:p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-[#3B82F6]"></div>
                            <h3 className="text-lg font-bold text-[#123044]">Projeção de Patrimônio</h3>
                        </div>
                        <span className="text-xs font-bold text-[#667085] bg-[#f0ece1] px-3 py-1.5 rounded-lg">Cenário: 8.5% a.a.</span>
                    </div>
                    
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
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
                    <h3 className="text-lg font-bold text-[#123044] mb-1">Diagnóstico de Alocação (Pilar 3)</h3>
                    <p className="text-sm font-medium text-[#667085]">Comparação entre sua carteira atual e a sugestão do Motor Arvo (Perfil Visão)</p>
                  </div>
                  <span className="text-xs font-bold bg-[#fbfaf8] border border-[#e4e0d7] text-[#123044] px-4 py-2 rounded-xl">
                      Perfil: <span className="text-[#8B5CF6]">Crescimento (Visão)</span>
                  </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-6 mb-8">
                <div className="bg-[#fbfaf8] border border-[#f0ece1] rounded-[24px] py-8">
                    <AllocationDonut data={allocationCurrent} title="Sua Carteira Atual" size={220} />
                </div>
                <div className="bg-[#f8fcfb] border border-[#d6e5de] rounded-[24px] py-8">
                    <AllocationDonut data={allocationSuggested} title="Alocação Sugerida" size={220} />
                </div>
              </div>

              <div className="bg-[#fff9e6] border border-[#fce49c] rounded-2xl p-5 flex items-start gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-[#fdeca6] flex items-center justify-center shrink-0">
                    <AlertTriangle size={20} className="text-[#d97706]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#b45309] mb-1">Desvio Identificado: Concentração e Risco-País</p>
                  <p className="text-sm text-[#92400e] leading-relaxed">Sua exposição internacional atual está em 5%, abaixo dos 10% sugeridos para o seu perfil. Considere direcionar novos aportes para ativos dolarizados (ETFs globais) para aumentar a proteção patrimonial.</p>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {/* TAB: PLANO DE AÇÃO */}
        {activeTab === "acoes" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 md:space-y-8">
            
            {/* Top 5 Actions */}
            <section>
              <div className="bg-[#123044] rounded-[32px] p-8 md:p-10 shadow-xl !text-white relative overflow-hidden">
                {/* Decorative background circle */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl"></div>
                
                <div className="flex items-center gap-4 mb-8 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white text-[#123044] flex items-center justify-center shadow-md">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight !text-white">O que fazer agora?</h3>
                    <p className="!text-white/70 text-sm mt-1">Top 5 ações prioritárias baseadas no seu diagnóstico</p>
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
                      <button className="hidden sm:flex w-10 h-10 rounded-full bg-white/10 items-center justify-center group-hover:bg-white group-hover:text-[#123044] transition-colors">
                          <ChevronRight size={20} className="!text-white group-hover:!text-[#123044]" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* Tax Optimization */}
                <div className="bg-white rounded-[24px] border border-[#e4e0d7] p-6 md:p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-[#fff2f2] text-[#EF4444] flex items-center justify-center">
                            <Scale size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-[#123044]">Eficiência Tributária (Pilar 5)</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="border border-[#d6e5de] bg-[#f8fcfb] rounded-xl p-4 flex gap-4">
                            <CheckCircle size={20} className="text-[#4fa080] shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-[#123044] mb-1">Benefício PGBL: R$ 4.200/ano</p>
                                <p className="text-xs text-[#475467] leading-relaxed">Você declara IR na forma completa. Contribuir 12% da sua renda bruta para um PGBL gerará uma restituição robusta.</p>
                            </div>
                        </div>
                        <div className="border border-[#f0ece1] bg-[#fbfaf8] rounded-xl p-4 flex gap-4">
                            <AlertTriangle size={20} className="text-[#F59E0B] shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-[#123044] mb-1">Come-cotas detectado</p>
                                <p className="text-xs text-[#475467] leading-relaxed">Seus fundos multimercado sofrem tributação semestral. Para prazos acima de 5 anos, considere ativos sem come-cotas (Ações, ETFs).</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Succession overview */}
                <div className="bg-white rounded-[24px] border border-[#e4e0d7] p-6 md:p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-[#f0f9ff] text-[#0ea5e9] flex items-center justify-center">
                            <TreePine size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-[#123044]">Sucessão Patrimonial (Pilar 6)</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-[#fbfaf8] border border-[#f0ece1] rounded-xl p-4 text-center">
                            <p className="text-xl font-black text-[#123044]">{formatBRL((financialSummary.patrimonioInvestido + 320000 - financialSummary.dividasTotal))}</p>
                            <p className="text-xs font-bold text-[#667085] uppercase tracking-wider mt-1">Patrimônio Líquido</p>
                        </div>
                        <div className="bg-[#fff2f2] border border-[#fecaca] rounded-xl p-4 text-center">
                            <p className="text-xl font-black text-[#EF4444]">{formatBRL(Math.round((financialSummary.patrimonioInvestido + 320000 - financialSummary.dividasTotal) * 0.04))}</p>
                            <p className="text-xs font-bold text-[#EF4444] uppercase tracking-wider mt-1">ITCMD (4%)</p>
                        </div>
                    </div>
                    <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl p-4 flex gap-4">
                        <Info size={20} className="text-[#3b82f6] shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-[#1e3a8a] mb-1">Dossiê Familiar: 65%</p>
                            <p className="text-xs text-[#1e3a8a]/80 leading-relaxed">Falta documentar beneficiários e centralizar acessos. Isso custará tempo e dinheiro aos seus herdeiros no futuro.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Missions List */}
            <section className="bg-white rounded-[24px] border border-[#e4e0d7] p-6 md:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-[#123044]">Checklist Contínuo</h3>
                    <span className="text-xs font-bold bg-[#e8f1ed] text-[#1f674f] px-3 py-1 rounded-full border border-[#d6e5de]">
                        {missions.filter(m => m.done).length}/{missions.length} tarefas concluídas
                    </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {missions.map((m, i) => (
                    <div key={i} className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${m.done ? "bg-[#fbfaf8] border-[#f0ece1]" : "bg-white border-[#e4e0d7] shadow-sm"}`}>
                        <div className="shrink-0 mt-0.5">
                            {m.done 
                                ? <CheckCircle size={20} className="text-[#4fa080]" /> 
                                : <div className="w-5 h-5 rounded-full border-2 border-[#d6d2c4]" />
                            }
                        </div>
                        <div>
                            <p className={`text-sm font-bold ${m.done ? "text-[#a19d91] line-through" : "text-[#123044]"}`}>{m.text}</p>
                            <p className="text-[10px] font-bold text-[#667085] uppercase tracking-widest mt-1">Pilar {m.pillar}</p>
                        </div>
                    </div>
                    ))}
                </div>
            </section>

          </motion.div>
        )}

        {/* FOOTER */}
        <footer className="text-center py-10 mt-8 border-t border-[#e4e0d7]">
          <p className="text-[11px] text-[#667085] max-w-3xl mx-auto leading-relaxed font-medium">
            ARVO é uma plataforma de educação e orientação financeira. Não somos consultoria de investimentos (CVM), corretora ou distribuidora de valores mobiliários. Todas as informações, simulações e sugestões apresentadas têm caráter exclusivamente educacional. Consulte profissionais certificados para decisões financeiras, tributárias e jurídicas.
          </p>
        </footer>
      </div>
    </div>
  )
}
