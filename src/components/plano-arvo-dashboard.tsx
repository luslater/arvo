"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid 
} from "recharts"
import { 
  Shield, TrendingUp, Target, Sun, Scale, TreePine, ChevronRight, 
  CheckCircle2, AlertTriangle, AlertCircle, ArrowUpRight, ArrowDownRight, 
  ArrowRight, DollarSign, Wallet, PiggyBank, BarChart3, Zap, Star, ChevronDown, 
  ChevronUp, Info, Eye, Compass, HelpCircle, X, Check, Lock, 
  Calendar, FileText, CheckCircle, ExternalLink, RefreshCw
} from "lucide-react"
import { calculateInvestorProfile, PROFILE_ALLOCATIONS, getSuitabilityDiagnostic, InvestorProfileType } from "@/lib/profile-calculator"

// ============================================================
// HELPER: CURRENCY PARSING & FORMATTING
// ============================================================
function parseCurrency(val?: string | number): number {
  if (typeof val === "number") return val
  if (!val) return 0
  const clean = val.toString().replace(/\D/g, "")
  if (!clean) return 0
  return parseInt(clean, 10) / 100
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", { 
    style: "currency", 
    currency: "BRL", 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0 
  }).format(value)
}

function formatPct(value: number): string {
  return `${value.toFixed(1)}%`
}

// ============================================================
// CALCULATION MEMORY MODAL
// ============================================================
interface CalcMemoryInfo {
  title: string
  metricValue: string
  inputs: { label: string; value: string }[]
  formula: string
  assumptions: string[]
  caveats: string[]
  stepId: number
}

function CalcMemoryModal({ 
  info, 
  onClose, 
  onGoToStep 
}: { 
  info: CalcMemoryInfo | null; 
  onClose: () => void; 
  onGoToStep?: (stepIndex: number) => void 
}) {
  if (!info) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#123044]/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl border border-[#e4e0d7] shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6"
      >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#e4e0d7]">
          <div>
            <span className="text-[11px] font-extrabold text-[#1f674f] uppercase tracking-wider block mb-1">
              Memória de Cálculo Técnica
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#123044]">
              {info.title}
            </h3>
            <div className="text-2xl font-extrabold text-[#1f674f] mt-1">
              {info.metricValue}
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            aria-label="Fechar memória de cálculo"
            className="w-9 h-9 rounded-full bg-[#f6f4ef] hover:bg-[#e4e0d7] text-[#123044] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Inputs Utilizados */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-[#123044] uppercase tracking-wider">
            1. Dados do seu formulário utilizados
          </h4>
          <div className="grid sm:grid-cols-2 gap-2 bg-[#f6f4ef] p-3.5 rounded-2xl border border-[#e4e0d7]">
            {info.inputs.map((inp, i) => (
              <div key={i} className="text-xs">
                <span className="text-[#667085] block">{inp.label}:</span>
                <span className="font-bold text-[#123044]">{inp.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fórmula Aplicada */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-[#123044] uppercase tracking-wider">
            2. Fórmula Matemática Aplicada
          </h4>
          <div className="bg-[#123044] text-[#4fa080] font-mono text-xs p-3.5 rounded-2xl border border-[#123044] leading-relaxed">
            {info.formula}
          </div>
        </div>

        {/* Premissas Adotadas */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-[#123044] uppercase tracking-wider">
            3. Premissas de Planejamento Adotadas
          </h4>
          <ul className="space-y-1.5 text-xs text-[#667085]">
            {info.assumptions.map((ass, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check size={14} className="text-[#1f674f] shrink-0 mt-0.5" />
                <span>{ass}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Ressalvas e Limitações */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-[#123044] uppercase tracking-wider">
            4. Ressalvas e Limitações
          </h4>
          <div className="p-3 bg-[#fff9e6] border border-[#fce49c] rounded-2xl text-xs text-[#92400e] space-y-1">
            {info.caveats.map((cav, i) => (
              <p key={i}>• {cav}</p>
            ))}
          </div>
        </div>

        {/* Action button to edit data */}
        <div className="pt-4 border-t border-[#e4e0d7] flex items-center justify-between gap-3">
          <span className="text-[11px] text-[#667085]">
            Origem: Marco {info.stepId} da Rota ARVO
          </span>
          {onGoToStep && (
            <button
              type="button"
              onClick={() => {
                onClose()
                onGoToStep(info.stepId - 1)
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#123044] hover:bg-[#1e4866] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Revisar Dados no Marco {info.stepId}
              <ExternalLink size={12} />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// ============================================================
// METRIC CARD COMPONENT
// ============================================================
function MetricCard({ 
  icon: Icon, 
  label, 
  value, 
  subtitle, 
  status = "info",
  onOpenCalc,
  progress 
}: {
  icon: any
  label: string
  value: string
  subtitle?: string
  status?: "good" | "warning" | "alert" | "info"
  onOpenCalc?: () => void
  progress?: {
    pct: number
    currentFormatted: string
    targetFormatted: string
  }
}) {
  const statusColors = {
    good: "bg-[#e8f1ed] text-[#1f674f] border-[#d6e5de]",
    warning: "bg-[#fff9e6] text-[#b45309] border-[#fce49c]",
    alert: "bg-red-50 text-red-700 border-red-200",
    info: "bg-[#f6f4ef] text-[#123044] border-[#e4e0d7]"
  }

  return (
    <div className="bg-white rounded-3xl border border-[#e4e0d7] p-5 sm:p-6 shadow-sm flex flex-col justify-between hover:border-[#1f674f]/40 transition-colors">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#e8f1ed] text-[#1f674f] flex items-center justify-center">
            <Icon size={20} />
          </div>
          {onOpenCalc && (
            <button
              type="button"
              onClick={onOpenCalc}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1f674f] hover:text-[#123044] bg-[#f6f4ef] hover:bg-[#e4e0d7] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              title="Ver memória de cálculo detalhada"
            >
              <HelpCircle size={12} />
              Como calculamos
            </button>
          )}
        </div>

        <div className="text-xs font-bold uppercase tracking-wider text-[#667085] mb-1">
          {label}
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-[#123044] tracking-tight truncate">
          {value}
        </div>
      </div>

      {progress ? (
        <div className="mt-4 pt-3 border-t border-[#f0ece1] space-y-2">
          <div className="h-2 bg-[#e4e0d7] rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#1f674f] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, Math.max(0, progress.pct))}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-[#667085] font-semibold">
            <span>{progress.currentFormatted} ({progress.pct}%)</span>
            <span className="text-[#123044] font-bold">Meta: {progress.targetFormatted}</span>
          </div>
        </div>
      ) : subtitle ? (
        <div className="text-xs text-[#667085] mt-3 pt-2 border-t border-[#f0ece1] font-medium truncate">
          {subtitle}
        </div>
      ) : null}
    </div>
  )
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function PlanoArvoDashboard({ 
  onBack, 
  formData = {} 
}: { 
  onBack?: () => void; 
  formData?: Record<string, string> 
}) {
  const [activeTab, setActiveTab] = useState<"diagnostico" | "patrimonio" | "acoes">("diagnostico")
  const [selectedCalcMemory, setSelectedCalcMemory] = useState<CalcMemoryInfo | null>(null)
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({})

  const toggleAction = (id: string) => {
    setCompletedActions(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // ─── FINANCIAL CALCULATIONS ENGINE ──────────────────────────────────────────
  const financialData = useMemo(() => {
    // 1. Renda
    const salario = parseCurrency(formData.salarioLiquido)
    const variavel = parseCurrency(formData.rendaVariavel)
    const rendaTotal = salario + variavel

    // 2. Gastos
    const moradia = parseCurrency(formData.gastoMoradia)
    const alimentacao = parseCurrency(formData.gastoAlimentacao)
    const transporte = parseCurrency(formData.gastoTransporte)
    const saude = parseCurrency(formData.gastoSaude)
    const possuiDividas = formData.possuiDividas === "Sim, possuo"
    const dividasParcela = possuiDividas ? parseCurrency(formData.parcelasDividas) : 0
    const dividasTotal = possuiDividas ? parseCurrency(formData.totalDividas) : 0

    let customExpensesTotal = 0
    if (formData.customExpensesJson) {
      try {
        const parsed = JSON.parse(formData.customExpensesJson)
        if (Array.isArray(parsed)) {
          customExpensesTotal = parsed.reduce((sum: number, it: any) => sum + parseCurrency(it.value), 0)
        }
      } catch (e) {}
    }

    const gastoTotal = moradia + alimentacao + transporte + saude + dividasParcela + customExpensesTotal

    // 3. Saldo Livre & Capacidade de Investimento
    const saldoLivre = Math.max(0, rendaTotal - gastoTotal)
    const saldoLivrePct = rendaTotal > 0 ? Math.round((saldoLivre / rendaTotal) * 100) : 0
    const taxaComprometimento = rendaTotal > 0 ? Math.round((gastoTotal / rendaTotal) * 100) : 0

    // 4. Reserva de Emergência (CFP Rule)
    const isVariavel = ["PJ", "Autônomo", "Empresário", "Misto"].includes(formData.tipoVinculo || "")
    const mesesMeta = isVariavel ? 12 : 6
    const reservaMeta = Math.max(1000, gastoTotal * mesesMeta)
    const reservaAtual = parseCurrency(formData.reservaAtual)
    const reservaPct = reservaMeta > 0 ? Math.min(100, Math.round((reservaAtual / reservaMeta) * 100)) : 0
    const reservaFaltante = Math.max(0, reservaMeta - reservaAtual)

    // 5. Patrimônio Investido & Capacidade de Aporte
    const aporteDeclarado = parseCurrency(formData.aporteMensal)
    const capacidadeAporteReal = aporteDeclarado > 0 ? aporteDeclarado : saldoLivre
    const patrimonioInvestido = parseCurrency(formData.patrimonioInvestido)
    const patrimonioLiquidoTotal = patrimonioInvestido + reservaAtual - dividasTotal

    // 6. Suitability & Carteira Bússola
    const suitabilityDiagnostic = getSuitabilityDiagnostic(formData)
    const investorProfile = suitabilityDiagnostic.profile
    const profileAllocation = PROFILE_ALLOCATIONS[investorProfile]
    const taxaNominal = profileAllocation.expectedNominalReturn // ex: 14.8% a.a.
    const inflacaoMediaIpca = 4.87 // IPCA médio histórico
    const taxaReal = Math.round(((1 + taxaNominal / 100) / (1 + inflacaoMediaIpca / 100) - 1) * 1000) / 10 // ~9.5% a.a.

    // 7. Futuro & Aposentadoria (Regra dos 4%)
    const idadeAtual = parseInt(formData.idade || "35", 10) || 35
    const idadeAposentadoria = parseInt(formData.idadeIf || "60", 10) || 60
    const anosRestantes = Math.max(1, idadeAposentadoria - idadeAtual)
    const rendaDesejada = parseCurrency(formData.rendaAposentadoria) || Math.round((rendaTotal > 0 ? rendaTotal : 10000) * 0.8)

    // Meta Regra dos 4% (300 vezes a renda mensal desejada em poder de compra de hoje)
    const metaAposentadoria4Pct = Math.round((rendaDesejada * 12) / 0.04)

    // Projeção com juros compostos em termos REAIS (Poder de compra de hoje)
    const rMensalReal = Math.pow(1 + taxaReal / 100, 1 / 12) - 1
    const totalMeses = anosRestantes * 12

    let patrimonioProjetadoReal = patrimonioInvestido
    if (totalMeses > 0 && rMensalReal > 0) {
      const pvPart = patrimonioInvestido * Math.pow(1 + rMensalReal, totalMeses)
      const pmtPart = capacidadeAporteReal * ((Math.pow(1 + rMensalReal, totalMeses) - 1) / rMensalReal)
      patrimonioProjetadoReal = Math.round(pvPart + pmtPart)
    }

    // Gap Projetado Real
    const gapProjetado = Math.max(0, metaAposentadoria4Pct - patrimonioProjetadoReal)
    const coberturaMetaPct = metaAposentadoria4Pct > 0 
      ? Math.min(100, Math.round((patrimonioProjetadoReal / metaAposentadoria4Pct) * 100)) 
      : 100

    // Aporte Mensal Ideal para zerar o gap no prazo estipulado
    let aporteIdeal = capacidadeAporteReal
    if (metaAposentadoria4Pct > 0 && totalMeses > 0 && rMensalReal > 0) {
      const pvFinal = patrimonioInvestido * Math.pow(1 + rMensalReal, totalMeses)
      const pmtFactor = (Math.pow(1 + rMensalReal, totalMeses) - 1) / rMensalReal
      if (pmtFactor > 0) {
        aporteIdeal = Math.max(0, Math.round((metaAposentadoria4Pct - pvFinal) / pmtFactor))
      }
    }

    // 8. Otimização Tributária PGBL
    const isCltCompleta = formData.tipoRendimento?.includes("CLT") && formData.declaracaoIr?.includes("Completa")
    const rendaBrutaEstimada = rendaTotal * 12 * 1.33 // estimativa bruta com 13º e férias
    const tetoDeducaoPgbl = Math.round(rendaBrutaEstimada * 0.12)
    const economiaFiscalAnual = isCltCompleta ? Math.round(tetoDeducaoPgbl * 0.275) : 0

    return {
      rendaTotal,
      gastoTotal,
      saldoLivre,
      saldoLivrePct,
      taxaComprometimento,
      reservaAtual,
      reservaMeta,
      reservaPct,
      reservaFaltante,
      mesesMeta,
      isVariavel,
      possuiDividas,
      dividasTotal,
      dividasParcela,
      patrimonioInvestido,
      patrimonioLiquidoTotal,
      capacidadeAporteReal,
      investorProfile,
      taxaNominal,
      taxaReal,
      inflacaoMediaIpca,
      idadeAtual,
      idadeAposentadoria,
      anosRestantes,
      rendaDesejada,
      metaAposentadoria4Pct,
      patrimonioProjetadoReal,
      gapProjetado,
      coberturaMetaPct,
      aporteIdeal,
      isCltCompleta,
      economiaFiscalAnual,
      tetoDeducaoPgbl,
      suitabilityDiagnostic
    }
  }, [formData])

  // ─── MEMÓRIA DE CÁLCULO DEFINITIONS ─────────────────────────────────────────
  const calcMemories: Record<string, CalcMemoryInfo> = {
    reserva: {
      title: "Reserva de Emergência Ideal",
      metricValue: `${formatBRL(financialData.reservaMeta)} (${financialData.mesesMeta} meses)`,
      stepId: 1,
      inputs: [
        { label: "Gastos Mensais Declarados", value: formatBRL(financialData.gastoTotal) },
        { label: "Vínculo Profissional", value: formData.tipoVinculo || "Não informado" },
        { label: "Reserva Atual Informada", value: formatBRL(financialData.reservaAtual) },
        { label: "Onde está aplicada", value: formData.localReserva || "Não informado" }
      ],
      formula: `Meta = Gastos Mensais Totais (${formatBRL(financialData.gastoTotal)}) × ${financialData.mesesMeta} meses de segurança`,
      assumptions: [
        "Metodologia da Planejar (CFP): 6 meses para profissionais com estabilidade (CLT / Servidores) e 12 meses para renda variável (PJ / Autônomo / Empresário).",
        "A reserva deve ser alocada exclusivamente em instrumentos com liquidez diária (D+0 ou D+1) e baixo risco de crédito (Tesouro Selic ou CDB 100% CDI com FGC)."
      ],
      caveats: [
        "Gastos sazonais ou parcelas de dívidas que se encerram em breve podem alterar o cálculo fino.",
        "Não considere limites de cheque especial ou cartão de crédito como reserva."
      ]
    },
    capacidadeAporte: {
      title: "Capacidade de Investimento Mensal",
      metricValue: `${formatBRL(financialData.capacidadeAporteReal)}/mês`,
      stepId: 1,
      inputs: [
        { label: "Renda Líquida Total", value: formatBRL(financialData.rendaTotal) },
        { label: "Gastos Fixos e Variáveis", value: formatBRL(financialData.gastoTotal) },
        { label: "Aporte Pretendido Declarado", value: formatBRL(parseCurrency(formData.aporteMensal)) }
      ],
      formula: `Saldo Livre = Renda Líquida (${formatBRL(financialData.rendaTotal)}) - Gastos Declarados (${formatBRL(financialData.gastoTotal)}) = ${formatBRL(financialData.saldoLivre)}/mês`,
      assumptions: [
        "O saldo livre mensal representa o potencial máximo sustentável de investimento sem endividamento.",
        "Se o aporte declarado for superior ao saldo livre, priorizamos a capacidade real de fluxo de caixa para evitar projeções irreais."
      ],
      caveats: [
        "Oscilações na renda variável ou despesas imprevistas devem ser amortecidas pela reserva de emergência antes de suspender os aportes."
      ]
    },
    aposentadoria: {
      title: "Meta de Independência Financeira (Regra dos 4%)",
      metricValue: formatBRL(financialData.metaAposentadoria4Pct),
      stepId: 4,
      inputs: [
        { label: "Renda Mensal Pretendida", value: `${formatBRL(financialData.rendaDesejada)}/mês` },
        { label: "Idade Atual", value: `${financialData.idadeAtual} anos` },
        { label: "Idade de Aposentadoria", value: `${financialData.idadeAposentadoria} anos (${financialData.anosRestantes} anos de acúmulo)` }
      ],
      formula: `Meta = (Renda Mensal Desejada × 12) ÷ 0,04 = ${formatBRL(financialData.rendaDesejada)} × 300 = ${formatBRL(financialData.metaAposentadoria4Pct)}`,
      assumptions: [
        "A Regra dos 4% (Trinity Study) é uma premissa empírica clássica de planejamento: um portfólio diversificado permite retirar 4% no primeiro ano e corrigir pela inflação nos seguintes com taxa histórica de sobrevivência de 30 anos.",
        "Os valores estão expressos a Poder de Compra de Hoje (em termos reais)."
      ],
      caveats: [
        "A regra dos 4% não é garantia contratual de rentabilidade e sim uma métrica de dimensionamento patrimonial.",
        "Longevidade superior a 30 anos ou volatilidade extrema inicial (risco de sequência de retornos) podem exigir taxas de retirada mais conservadoras (ex: 3,5%)."
      ]
    },
    gapProjetado: {
      title: "Projeção de Acumulação & Gap de Aposentadoria",
      metricValue: financialData.gapProjetado > 0 ? `Gap: ${formatBRL(financialData.gapProjetado)}` : "Meta Plenamente Coberta",
      stepId: 4,
      inputs: [
        { label: "Patrimônio Atual Investido", value: formatBRL(financialData.patrimonioInvestido) },
        { label: "Aporte Mensal Aplicado", value: `${formatBRL(financialData.capacidadeAporteReal)}/mês` },
        { label: "Carteira da Bússola", value: `${financialData.investorProfile} (${financialData.taxaNominal}% nominal / ${financialData.taxaReal}% real)` },
        { label: "Prazo de Acumulação", value: `${financialData.anosRestantes} anos (${financialData.anosRestantes * 12} meses)` }
      ],
      formula: `FV = PV × (1 + r)^n + PMT × [((1 + r)^n - 1) ÷ r], onde r = ${(financialData.taxaReal / 12).toFixed(2)}% a.m. real`,
      assumptions: [
        `Considera a rentabilidade real líquida da Carteira ${financialData.investorProfile} descontada a inflação média histórica do IPCA (${financialData.inflacaoMediaIpca}% a.a.).`,
        `Patrimônio projetado aos ${financialData.idadeAposentadoria} anos: ${formatBRL(financialData.patrimonioProjetadoReal)}.`
      ],
      caveats: [
        "Projeções futuras dependem da disciplina dos aportes mensais e do reinvestimento contínuo de proventos.",
        "Eventuais tributações no resgate foram consideradas nas alíquotas regressivas das classes da Bússola."
      ]
    }
  }

  // ─── MARCOS STATUS DIAGNOSTICS (7 MARCOS OBJETIVOS) ─────────────────────────
  const marcosDiagnostics = [
    {
      id: 1,
      name: "Raio-X & Fluxo de Caixa",
      status: financialData.taxaComprometimento > 80 ? "Atenção" : financialData.reservaPct < 50 ? "Prioritário" : "Adequado",
      statusColor: financialData.taxaComprometimento > 80 ? "amber" : financialData.reservaPct < 50 ? "blue" : "green",
      summary: `Gastos consom ${financialData.taxaComprometimento}% da renda. Reserva atual cobre ${financialData.reservaPct}% da meta técnica.`,
      icon: Wallet,
      stepId: 1
    },
    {
      id: 2,
      name: "Proteção & Riscos Pessoais",
      status: (parseInt(formData.dependentes || "0", 10) > 0 && formData.possuiSeguroVida !== "Sim, possuo") ? "Prioritário" : "Adequado",
      statusColor: (parseInt(formData.dependentes || "0", 10) > 0 && formData.possuiSeguroVida !== "Sim, possuo") ? "blue" : "green",
      summary: parseInt(formData.dependentes || "0", 10) > 0 
        ? `${formData.dependentes} dependentes declarados. ${formData.possuiSeguroVida === "Sim, possuo" ? "Cobertura de vida ativa." : "Sem proteção de vida estruturada."}`
        : "Sem dependentes financeiros imediatos. Foco em proteção de invalidez e saúde.",
      icon: Shield,
      stepId: 2
    },
    {
      id: 3,
      name: "Construção de Patrimônio",
      status: financialData.capacidadeAporteReal > 0 ? "Adequado" : "Atenção",
      statusColor: financialData.capacidadeAporteReal > 0 ? "green" : "amber",
      summary: `Capacidade de poupança de ${formatBRL(financialData.capacidadeAporteReal)}/mês (${financialData.saldoLivrePct}% da renda). Meta: ${formData.objetivoPrincipal || "Acumulação"}.`,
      icon: Target,
      stepId: 3
    },
    {
      id: 4,
      name: "Futuro & Aposentadoria",
      status: financialData.gapProjetado > 0 ? "Atenção" : "Adequado",
      statusColor: financialData.gapProjetado > 0 ? "amber" : "green",
      summary: financialData.gapProjetado > 0 
        ? `Cobertura de ${financialData.coberturaMetaPct}% da meta aos ${financialData.idadeAposentadoria} anos. Gap projetado de ${formatBRL(financialData.gapProjetado)}.`
        : `Projeção cobre 100% da meta de ${formatBRL(financialData.metaAposentadoria4Pct)} aos ${financialData.idadeAposentadoria} anos.`,
      icon: Sun,
      stepId: 4
    },
    {
      id: 5,
      name: "Inteligência Fiscal",
      status: financialData.isCltCompleta ? "Oportunidade" : "Adequado",
      statusColor: financialData.isCltCompleta ? "blue" : "green",
      summary: financialData.isCltCompleta 
        ? `Elegível ao benefício fiscal PGBL (até ${formatBRL(financialData.tetoDeducaoPgbl)}/ano). Economia potencial de ${formatBRL(financialData.economiaFiscalAnual)}/ano.`
        : "Estrutura tributária mapeada. Sem pendências críticas de deduções.",
      icon: Scale,
      stepId: 5
    },
    {
      id: 6,
      name: "Legado & Sucessão",
      status: formData.filhosMenores === "Sim, possuo" && formData.possuiTestamento !== "Sim" ? "Atenção" : "Adequado",
      statusColor: formData.filhosMenores === "Sim, possuo" && formData.possuiTestamento !== "Sim" ? "amber" : "green",
      summary: `Regime: ${formData.regimeBens || "Não informado"}. ${formData.filhosMenores === "Sim, possuo" ? "Herdeiros menores exigem atenção em liquidez e tutela." : "Estrutura simples de sucessão."}`,
      icon: TreePine,
      stepId: 6
    },
    {
      id: 7,
      name: "Perfil de Investidor (Bússola)",
      status: "Adequado",
      statusColor: "green",
      summary: `Perfil Oficial: ${financialData.investorProfile} (${financialData.taxaNominal}% nominal / ~${financialData.taxaReal}% real). 6 perguntas calibradas.`,
      icon: Compass,
      stepId: 7
    }
  ]

  // ─── PRIORITIZED CFP ACTION PLAN ───────────────────────────────────────────
  const actionPlan = [
    // 1. High Interest Debt
    ...(financialData.possuiDividas && financialData.dividasTotal > 0 ? [{
      id: "act-dividas",
      priority: 1,
      title: "Eliminar Dívidas com Custo Elevado",
      reason: `Você declarou ${formatBRL(financialData.dividasTotal)} em dívidas ativas com parcela de ${formatBRL(financialData.dividasParcela)}/mês. Juros de empréstimos e rotativos superam o retorno de qualquer investimento.`,
      action: "Priorizar amortização extraordinária antes de alocar em ativos de risco.",
      pillar: "Marco 1: Raio-X Financeiro",
      impact: "Alto",
      status: "Pendente"
    }] : []),

    // 2. Emergency Fund
    ...(financialData.reservaPct < 100 ? [{
      id: "act-reserva",
      priority: 2,
      title: `Completar a Reserva de Emergência (${financialData.mesesMeta} meses)`,
      reason: `Sua reserva atual de ${formatBRL(financialData.reservaAtual)} cobre ${financialData.reservaPct}% da meta recomendada (${formatBRL(financialData.reservaMeta)} para perfil ${financialData.isVariavel ? "PJ/Autônomo" : "CLT"}). Faltam ${formatBRL(financialData.reservaFaltante)}.`,
      action: `Destinar os próximos aportes de ${formatBRL(financialData.capacidadeAporteReal)}/mês integralmente para Tesouro Selic ou CDB 100% CDI com liquidez diária.`,
      pillar: "Marco 1: Raio-X Financeiro",
      impact: "Alto",
      status: "Pendente"
    }] : []),

    // 3. Life & Income Protection
    ...(parseInt(formData.dependentes || "0", 10) > 0 && formData.possuiSeguroVida !== "Sim, possuo" ? [{
      id: "act-protecao",
      priority: 3,
      title: "Contratar Seguro de Vida Temporário e Proteção de Renda",
      reason: `Você declarou ${formData.dependentes} dependentes e papel de sustentação familiar. Em caso de evento biológico precoce, a família fica desassistida até a maturação do patrimônio.`,
      action: "Cotar apólice temporária (ex: cobertura nivelada de 5 a 10 anos) sem vincular a produtos bancários embutidos.",
      pillar: "Marco 2: Proteção e Riscos",
      impact: "Alto",
      status: "Pendente"
    }] : []),

    // 4. Bússola Monthly Contribution
    {
      id: "act-bussola",
      priority: 4,
      title: `Aportar ${formatBRL(financialData.capacidadeAporteReal)}/mês na Carteira ${financialData.investorProfile}`,
      reason: `Manter consistência nos aportes e reinvestir proventos é o motor dos juros compostos para alcançar ${formatBRL(financialData.metaAposentadoria4Pct)}.`,
      action: `Seguir as recomendações de ativos da Bússola ARVO com rebalanceamento periódico.`,
      pillar: "Marco 3: Construção de Patrimônio",
      impact: "Alto",
      status: "Em Andamento"
    },

    // 5. Gap Reduction
    ...(financialData.gapProjetado > 0 ? [{
      id: "act-gap",
      priority: 5,
      title: `Ajustar Aporte Ideal para ${formatBRL(financialData.aporteIdeal)}/mês para Cobrir o Gap`,
      reason: `Com o aporte atual, sua projeção aos ${financialData.idadeAposentadoria} anos atinge ${financialData.coberturaMetaPct}% da meta. Há um gap projetado de ${formatBRL(financialData.gapProjetado)}.`,
      action: `Elevar os aportes mensais gradualmente em ${formatBRL(Math.max(0, financialData.aporteIdeal - financialData.capacidadeAporteReal))}/mês ou estender o prazo de transição.`,
      pillar: "Marco 4: Futuro & Aposentadoria",
      impact: "Médio",
      status: "Pendente"
    }] : []),

    // 6. Tax Optimization (PGBL)
    ...(financialData.isCltCompleta ? [{
      id: "act-fiscal",
      priority: 6,
      title: "Utilizar o Benefício Fiscal do PGBL (Dedução de até 12% da Renda Bruta)",
      reason: `Como você é CLT e faz Declaração Completa, pode diferir até ${formatBRL(financialData.tetoDeducaoPgbl)}/ano da base do IRPF, economizando até ${formatBRL(financialData.economiaFiscalAnual)} anuais.`,
      action: "Alocar em fundo de previdência PGBL com taxa zero de carregamento e tabela regressiva.",
      pillar: "Marco 5: Inteligência Fiscal",
      impact: "Médio",
      status: "Pendente"
    }] : []),

    // 7. Estate & Succession Dossier
    {
      id: "act-legado",
      priority: 7,
      title: "Montar Dossiê de Continuidade Patrimonial Familiar",
      reason: `Regime de bens declarado: ${formData.regimeBens || "Não informado"}. Centralizar contas, contratos e diretrizes protege a família de burocracias de inventário.`,
      action: "Catalogar bens, apólices e beneficiários em documento seguro e acessível ao cônjuge/herdeiros.",
      pillar: "Marco 6: Legado & Sucessão",
      impact: "Preventivo",
      status: "Pendente"
    }
  ]

  // ─── ACCUMULATION SCENARIOS (3 CENÁRIOS DE LONGO PRAZO) ─────────────────────
  const currentYear = new Date().getFullYear()
  const projectionSteps = Math.min(6, Math.max(3, financialData.anosRestantes))
  const stepInterval = Math.max(1, Math.floor(financialData.anosRestantes / (projectionSteps - 1)))

  const scenariosData = useMemo(() => {
    const data = []
    const rBase = Math.pow(1 + financialData.taxaReal / 100, 1 / 12) - 1
    const rConservador = Math.pow(1 + 0.04, 1 / 12) - 1 // 4% real
    const rOtimista = Math.pow(1 + 0.08, 1 / 12) - 1 // 8% real

    for (let i = 0; i < projectionSteps; i++) {
      const y = i === projectionSteps - 1 ? financialData.anosRestantes : i * stepInterval
      const m = y * 12
      const yearLabel = i === 0 ? "Hoje" : String(currentYear + y)

      const aportesAcum = Math.round(financialData.patrimonioInvestido + financialData.capacidadeAporteReal * m)

      // Base
      let fvBase = financialData.patrimonioInvestido
      if (m > 0 && rBase > 0) {
        fvBase = Math.round(financialData.patrimonioInvestido * Math.pow(1 + rBase, m) + financialData.capacidadeAporteReal * ((Math.pow(1 + rBase, m) - 1) / rBase))
      }

      // Conservador
      let fvCons = financialData.patrimonioInvestido
      if (m > 0 && rConservador > 0) {
        fvCons = Math.round(financialData.patrimonioInvestido * Math.pow(1 + rConservador, m) + financialData.capacidadeAporteReal * ((Math.pow(1 + rConservador, m) - 1) / rConservador))
      }

      // Otimista
      let fvOti = financialData.patrimonioInvestido
      if (m > 0 && rOtimista > 0) {
        fvOti = Math.round(financialData.patrimonioInvestido * Math.pow(1 + rOtimista, m) + financialData.capacidadeAporteReal * ((Math.pow(1 + rOtimista, m) - 1) / rOtimista))
      }

      data.push({
        ano: yearLabel,
        anosDecorrido: y,
        aportes: aportesAcum,
        conservador: fvCons,
        base: fvBase,
        otimista: fvOti,
        rendimentosBase: Math.max(0, fvBase - aportesAcum)
      })
    }
    return data
  }, [financialData, currentYear, projectionSteps, stepInterval])

  // Asset allocation charts data
  const allocationData = useMemo(() => {
    const alloc = financialData.suitabilityDiagnostic.recommendedAssetAllocation
    return [
      { name: "RF Pós-Fixada", value: alloc.rfPosFixada, color: "#123044" },
      { name: "RF IPCA+ (Real)", value: alloc.rfIpca, color: "#1f674f" },
      { name: "RF Pré-fixada", value: alloc.rfPre, color: "#2b6e76" },
      { name: "Fundos Imobiliários", value: alloc.fiis, color: "#4fa080" },
      { name: "Ações Brasil", value: alloc.acoesBrasil, color: "#9bcbb4" },
      { name: "Ativos Globais", value: alloc.internacional, color: "#0A192F" },
    ].filter(a => a.value > 0)
  }, [financialData])

  return (
    <div className="min-h-screen font-sans p-4 sm:p-6 md:p-8 bg-[#f6f4ef] text-[#123044]">
      <div className="max-w-[1200px] mx-auto space-y-6 sm:space-y-8">
        
        {/* ─── TOP HEADER ──────────────────────────────────────────────────────── */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#e4e0d7]">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              {onBack && (
                <button 
                  type="button"
                  onClick={onBack}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#667085] hover:text-[#123044] bg-white border border-[#e4e0d7] px-3.5 py-1.5 rounded-full shadow-xs cursor-pointer transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                  Voltar para os 7 Marcos
                </button>
              )}
              <span className="text-[11px] font-extrabold text-[#1f674f] uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 size={14} />
                Diagnóstico Consolidado
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#123044]">
              Meu Plano <span className="font-semibold text-[#123044]">ARVO</span>
            </h1>
            <p className="text-[#667085] text-sm sm:text-base mt-1 max-w-xl leading-relaxed">
              Relatório financeiro transparente calculado a partir dos seus dados reais, premissas de mercado e metas de independência.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-[#e4e0d7] rounded-2xl px-4 py-2.5 shadow-xs">
              <Compass size={18} className="text-[#1f674f]" />
              <div>
                <span className="text-[10px] uppercase font-bold text-[#667085] block leading-none">Perfil Oficial</span>
                <span className="text-xs font-extrabold text-[#123044]">{financialData.investorProfile}</span>
              </div>
            </div>
          </div>
        </header>

        {/* ─── TAB NAVIGATION ─────────────────────────────────────────────────── */}
        <nav aria-label="Navegação do Relatório" className="flex overflow-x-auto no-scrollbar gap-2 bg-white border border-[#e4e0d7] rounded-2xl p-1.5 shadow-xs max-w-fit">
          <button 
            type="button"
            onClick={() => setActiveTab("diagnostico")}
            className={`flex items-center gap-2 py-2 px-5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "diagnostico" 
                ? "bg-[#123044] text-white shadow-sm" 
                : "text-[#667085] hover:bg-[#f6f4ef] hover:text-[#123044]"
            }`}
          >
            <Eye size={15} />
            1. Diagnóstico dos 7 Marcos
          </button>
          
          <button 
            type="button"
            onClick={() => setActiveTab("patrimonio")}
            className={`flex items-center gap-2 py-2 px-5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "patrimonio" 
                ? "bg-[#123044] text-white shadow-sm" 
                : "text-[#667085] hover:bg-[#f6f4ef] hover:text-[#123044]"
            }`}
          >
            <TrendingUp size={15} />
            2. Patrimônio & Futuro
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab("acoes")}
            className={`flex items-center gap-2 py-2 px-5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "acoes" 
                ? "bg-[#123044] text-white shadow-sm" 
                : "text-[#667085] hover:bg-[#f6f4ef] hover:text-[#123044]"
            }`}
          >
            <Zap size={15} />
            3. Plano de Ação ({actionPlan.length})
          </button>
        </nav>

        {/* ─── TAB 1: DIAGNÓSTICO DOS 7 MARCOS ────────────────────────────────── */}
        {activeTab === "diagnostico" && (
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-6 sm:space-y-8"
          >
            {/* Resumo da Rota Atual (Metric Cards) */}
            <section>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard 
                  icon={DollarSign}
                  label="Renda Líquida Mensal"
                  value={formatBRL(financialData.rendaTotal)}
                  subtitle={`Gastos: ${formatBRL(financialData.gastoTotal)} (${financialData.taxaComprometimento}%)`}
                  onOpenCalc={() => setSelectedCalcMemory(calcMemories.capacidadeAporte)}
                />

                <MetricCard 
                  icon={Wallet}
                  label="Saldo Livre Mensal"
                  value={formatBRL(financialData.saldoLivre)}
                  subtitle={`${financialData.saldoLivrePct}% de taxa de poupança`}
                  onOpenCalc={() => setSelectedCalcMemory(calcMemories.capacidadeAporte)}
                />

                <MetricCard 
                  icon={PiggyBank}
                  label="Reserva de Emergência"
                  value={formatBRL(financialData.reservaAtual)}
                  onOpenCalc={() => setSelectedCalcMemory(calcMemories.reserva)}
                  progress={{
                    pct: financialData.reservaPct,
                    currentFormatted: formatBRL(financialData.reservaAtual),
                    targetFormatted: `${formatBRL(financialData.reservaMeta)} (${financialData.mesesMeta}m)`
                  }}
                />

                <MetricCard 
                  icon={BarChart3}
                  label="Patrimônio Líquido Total"
                  value={formatBRL(financialData.patrimonioLiquidoTotal)}
                  subtitle={`Investido: ${formatBRL(financialData.patrimonioInvestido)}${financialData.possuiDividas ? ` · Dívidas: -${formatBRL(financialData.dividasTotal)}` : ""}`}
                />
              </div>
            </section>

            {/* Diagnóstico dos 7 Marcos da Rota ARVO */}
            <section className="bg-white rounded-3xl border border-[#e4e0d7] p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-[#123044]">
                    Status Técnico dos 7 Marcos da Rota
                  </h3>
                  <p className="text-xs text-[#667085] mt-0.5">
                    Avaliação individualizada baseada exclusivamente nas suas respostas registradas na Jornada.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#1f674f] bg-[#e8f1ed] px-3.5 py-1.5 rounded-full border border-[#d6e5de]">
                  7 de 7 Marcos Analisados
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-3.5">
                {marcosDiagnostics.map((marco) => {
                  const Icon = marco.icon
                  const statusBg = {
                    green: "bg-[#e8f1ed] text-[#1f674f] border-[#d6e5de]",
                    amber: "bg-[#fff9e6] text-[#b45309] border-[#fce49c]",
                    blue: "bg-[#e8f2f4] text-[#2b6e76] border-[#2b6e76]/30"
                  }[marco.statusColor]

                  return (
                    <div 
                      key={marco.id} 
                      className="p-4 rounded-2xl border border-[#e4e0d7] hover:border-[#1f674f]/40 transition-colors flex items-start gap-3.5 bg-[#fbfaf8]"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white border border-[#e4e0d7] text-[#123044] flex items-center justify-center shrink-0 shadow-xs">
                        <Icon size={18} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-bold text-[#123044] truncate">
                            Marco {marco.id}: {marco.name}
                          </span>
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border shrink-0 ${statusBg}`}>
                            {marco.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#667085] leading-relaxed">
                          {marco.summary}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Top 3 Decisões Prioritárias Imediatas */}
            <section className="bg-[#123044] rounded-3xl p-6 sm:p-8 text-white space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    Top 3 Decisões Prioritárias Imediatas
                  </h3>
                  <p className="text-xs text-white/70">
                    Os passos que geram maior impacto na sua segurança e crescimento neste momento.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {actionPlan.slice(0, 3).map((act, i) => (
                  <div key={act.id} className="bg-white/10 rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="w-6 h-6 rounded-md bg-[#1f674f] text-white font-extrabold text-xs flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="text-[10px] font-extrabold uppercase text-[#4fa080]">
                          {act.pillar}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white leading-snug mb-1.5">
                        {act.title}
                      </h4>
                      <p className="text-xs text-white/70 leading-relaxed line-clamp-3">
                        {act.reason}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-[11px] text-[#4fa080] font-semibold">
                      <span>Impacto {act.impact}</span>
                      <button 
                        type="button" 
                        onClick={() => setActiveTab("acoes")}
                        className="hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        Ver no Plano <ArrowRight size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </motion.div>
        )}

        {/* ─── TAB 2: PATRIMÔNIO & FUTURO ─────────────────────────────────────── */}
        {activeTab === "patrimonio" && (
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-6 sm:space-y-8"
          >
            {/* Metas & Projeção Cards */}
            <section>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard 
                  icon={BarChart3}
                  label="Patrimônio Atual"
                  value={formatBRL(financialData.patrimonioInvestido)}
                  subtitle={`Aporte planejado: ${formatBRL(financialData.capacidadeAporteReal)}/mês`}
                />

                <MetricCard 
                  icon={Target}
                  label="Meta Aposentadoria (4%)"
                  value={formatBRL(financialData.metaAposentadoria4Pct)}
                  subtitle={`Renda desejada: ${formatBRL(financialData.rendaDesejada)}/mês perpétua`}
                  onOpenCalc={() => setSelectedCalcMemory(calcMemories.aposentadoria)}
                />

                <MetricCard 
                  icon={TrendingUp}
                  label="Patrimônio Projetado"
                  value={formatBRL(financialData.patrimonioProjetadoReal)}
                  onOpenCalc={() => setSelectedCalcMemory(calcMemories.gapProjetado)}
                  progress={{
                    pct: financialData.coberturaMetaPct,
                    currentFormatted: `${financialData.coberturaMetaPct}% da meta`,
                    targetFormatted: formatBRL(financialData.metaAposentadoria4Pct)
                  }}
                />

                <MetricCard 
                  icon={Zap}
                  label="Gap Projetado"
                  value={financialData.gapProjetado > 0 ? formatBRL(financialData.gapProjetado) : "R$ 0 (Meta Coberta)"}
                  subtitle={financialData.gapProjetado > 0 ? `Aporte ideal: ${formatBRL(financialData.aporteIdeal)}/mês` : "Sua estratégia cobre 100% da meta!"}
                  onOpenCalc={() => setSelectedCalcMemory(calcMemories.gapProjetado)}
                />
              </div>
            </section>

            {/* Projeção Gráfica em 3 Cenários Reais */}
            <section className="bg-white rounded-3xl border border-[#e4e0d7] p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-[#123044]">
                    Projeção de Acumulação em Cenários Reais
                  </h3>
                  <p className="text-xs text-[#667085] mt-0.5">
                    Valores em <strong>Poder de Compra de Hoje</strong> (descontada a inflação média histórica do IPCA de {financialData.inflacaoMediaIpca}% a.a.).
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#1f674f] bg-[#e8f1ed] px-3.5 py-1 rounded-full border border-[#d6e5de]">
                    Carteira {financialData.investorProfile} ({financialData.taxaReal}% real a.a.)
                  </span>
                </div>
              </div>

              {/* Chart */}
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={scenariosData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAportes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#123044" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#123044" stopOpacity={0.2} />
                      </linearGradient>
                      <linearGradient id="colorRend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1f674f" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#1f674f" stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0ece1" vertical={false} />
                    <XAxis dataKey="ano" tick={{ fill: "#667085", fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} dy={8} />
                    <YAxis 
                      tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} 
                      tick={{ fill: "#667085", fontSize: 11, fontWeight: 600 }} 
                      axisLine={false} 
                      tickLine={false} 
                      dx={-8} 
                    />
                    <Tooltip 
                      formatter={(val: number) => formatBRL(val)} 
                      contentStyle={{ backgroundColor: "#123044", border: "none", borderRadius: "12px", color: "#fff", fontSize: "12px", fontWeight: 600 }} 
                      itemStyle={{ color: "#fff" }} 
                    />
                    <Area type="monotone" dataKey="aportes" stackId="1" stroke="#123044" fill="url(#colorAportes)" name="Aportes Acumulados" />
                    <Area type="monotone" dataKey="rendimentosBase" stackId="1" stroke="#1f674f" fill="url(#colorRend)" name="Juros Compostos Reais" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Tabela de Cenários Comparativos */}
              <div className="mt-8 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#e4e0d7] text-[#667085]">
                      <th className="py-2.5 font-bold">Ano / Marco</th>
                      <th className="py-2.5 font-bold">Aportes Acumulados</th>
                      <th className="py-2.5 font-bold">Cenário Conservador (IPCA+4%)</th>
                      <th className="py-2.5 font-bold text-[#1f674f]">Cenário Base (Bússola {financialData.investorProfile})</th>
                      <th className="py-2.5 font-bold">Cenário Otimista (IPCA+8%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0ece1]">
                    {scenariosData.map((row, i) => (
                      <tr key={i} className="hover:bg-[#fbfaf8]">
                        <td className="py-2.5 font-bold text-[#123044]">{row.ano} ({row.anosDecorrido} anos)</td>
                        <td className="py-2.5 text-[#667085]">{formatBRL(row.aportes)}</td>
                        <td className="py-2.5 text-[#667085]">{formatBRL(row.conservador)}</td>
                        <td className="py-2.5 font-bold text-[#1f674f] bg-[#e8f1ed]/40 px-2 rounded-md">{formatBRL(row.base)}</td>
                        <td className="py-2.5 text-[#667085]">{formatBRL(row.otimista)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Alocação Alvo da Bússola ARVO */}
            <section className="bg-white rounded-3xl border border-[#e4e0d7] p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-[#123044]">
                    Alocação Estratégica Recomendada pela Bússola
                  </h3>
                  <p className="text-xs text-[#667085] mt-0.5">
                    Calibrada exclusivamente para o seu perfil <strong>{financialData.investorProfile}</strong> diagnosticado na etapa de suitability.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-[280px_1fr] gap-8 items-center">
                <div className="flex flex-col items-center justify-center">
                  <PieChart width={220} height={220}>
                    <Pie 
                      data={allocationData} 
                      cx={105} 
                      cy={105} 
                      innerRadius={60} 
                      outerRadius={95} 
                      paddingAngle={3} 
                      dataKey="value"
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val: number) => `${val}%`} 
                      contentStyle={{ backgroundColor: "#123044", border: "none", borderRadius: "10px", color: "#fff", fontSize: "12px" }} 
                    />
                  </PieChart>
                  <span className="text-xs font-bold text-[#123044] mt-2">
                    Retorno Nominal Esperado: {financialData.taxaNominal}% a.a.
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {allocationData.map((item, i) => (
                    <div key={i} className="p-3.5 bg-[#fbfaf8] border border-[#e4e0d7] rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-xs font-bold text-[#123044]">{item.name}</span>
                      </div>
                      <span className="text-xs font-extrabold text-[#1f674f]">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {/* ─── TAB 3: PLANO DE AÇÃO ESTRUTURADO ──────────────────────────────── */}
        {activeTab === "acoes" && (
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-6 sm:space-y-8"
          >
            <section className="bg-white rounded-3xl border border-[#e4e0d7] p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 border-b border-[#e4e0d7]">
                <div>
                  <h3 className="text-xl font-bold text-[#123044]">
                    Plano de Ação Sequenciado (Hierarquia CFP)
                  </h3>
                  <p className="text-xs text-[#667085] mt-0.5">
                    Ações ordenadas pela prioridade técnica de proteção, liquidez, disciplina de aportes e otimização fiscal.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#1f674f] bg-[#e8f1ed] px-3.5 py-1.5 rounded-full border border-[#d6e5de]">
                  {Object.values(completedActions).filter(Boolean).length} de {actionPlan.length} concluídas
                </span>
              </div>

              <div className="space-y-4 mt-6">
                {actionPlan.map((act) => {
                  const isDone = Boolean(completedActions[act.id])

                  return (
                    <div 
                      key={act.id} 
                      className={`p-5 rounded-2xl border transition-all ${
                        isDone 
                          ? "bg-[#f8fcfb] border-[#d6e5de] opacity-75" 
                          : "bg-white border-[#e4e0d7] hover:border-[#1f674f]/40 shadow-xs"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Checkbox button */}
                        <button
                          type="button"
                          onClick={() => toggleAction(act.id)}
                          aria-label={`Marcar ação "${act.title}" como ${isDone ? "pendente" : "concluída"}`}
                          className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors cursor-pointer ${
                            isDone 
                              ? "bg-[#1f674f] border-[#1f674f] text-white" 
                              : "border-[#e4e0d7] bg-[#f6f4ef] hover:border-[#1f674f]"
                          }`}
                        >
                          {isDone && <Check size={14} strokeWidth={3} />}
                        </button>

                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-extrabold text-[#123044] px-2 py-0.5 rounded-md bg-[#f6f4ef]">
                                Prioridade {act.priority}
                              </span>
                              <h4 className={`text-sm font-bold ${isDone ? "line-through text-[#667085]" : "text-[#123044]"}`}>
                                {act.title}
                              </h4>
                            </div>
                            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                              act.impact === "Alto" ? "bg-red-50 text-red-700 border border-red-200" :
                              act.impact === "Médio" ? "bg-[#fff9e6] text-[#b45309] border border-[#fce49c]" :
                              "bg-[#e8f1ed] text-[#1f674f] border border-[#d6e5de]"
                            }`}>
                              Impacto {act.impact}
                            </span>
                          </div>

                          <p className="text-xs text-[#667085] leading-relaxed">
                            {act.reason}
                          </p>

                          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs border-t border-[#f0ece1]">
                            <span className="font-semibold text-[#1f674f]">
                              👉 {act.action}
                            </span>
                            <span className="text-[11px] text-[#a09e99]">
                              {act.pillar}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          </motion.div>
        )}

        {/* ─── PRIVACY & GOVERNANCE FOOTER ────────────────────────────────────── */}
        <footer className="pt-6 border-t border-[#e4e0d7] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#667085]">
          <div className="flex items-center gap-2">
            <Lock size={14} className="text-[#1f674f]" />
            <span>Dados protegidos por criptografia e conformidade LGPD. Planejamento 100% Fee-Only sem comissões ocultas.</span>
          </div>

          <div className="flex items-center gap-4 font-semibold text-[#123044]">
            <button 
              type="button"
              onClick={() => setSelectedCalcMemory(calcMemories.reserva)}
              className="hover:underline cursor-pointer"
            >
              Glossário & Metodologia
            </button>
            {onBack && (
              <button 
                type="button"
                onClick={onBack}
                className="hover:underline text-[#1f674f] cursor-pointer"
              >
                Revisar os 7 Marcos
              </button>
            )}
          </div>
        </footer>

        {/* ─── CALCULATION MEMORY MODAL ───────────────────────────────────────── */}
        <CalcMemoryModal 
          info={selectedCalcMemory}
          onClose={() => setSelectedCalcMemory(null)}
          onGoToStep={onBack ? (stepIdx) => onBack() : undefined}
        />

      </div>
    </div>
  )
}
