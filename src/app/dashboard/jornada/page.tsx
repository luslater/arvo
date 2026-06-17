"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Lock, ArrowRight, ArrowRightCircle, Target, Wallet, ShieldCheck, HeartPulse, Building2, Landmark, Loader2 } from "lucide-react"
import PlanoArvoDashboard from "@/components/plano-arvo-dashboard"
import { saveJornadaProgress, getJornadaProgress } from "./actions"

// Types
type FieldDef = {
    name: string
    label: string
    type: "text" | "number" | "currency" | "select" | "radio"
    options?: string[]
    placeholder?: string
}

const PLAN_DATA = [
    {
        title: "Organização Financeira",
        short: "Raio-X, Gastos e Reserva",
        status: "Base da jornada",
        desc: "O Pilar 1 cria um retrato honesto da sua vida financeira. Entenda de onde vem seu dinheiro, para onde ele vai, sua capacidade de poupança e o tamanho ideal da sua reserva de emergência.",
        objective: "Criar clareza sobre sua vida financeira atual.",
        delivery: "Diagnóstico de caixa e capacidade de aporte.",
        signal: "Você sabe quanto pode investir com segurança.",
        icon: <Wallet className="text-[#4fa080] shrink-0" size={24} />,
        fields: [
            { name: "salarioLiquido", label: "Salário Líquido Mensal", type: "currency", placeholder: "R$ 0,00" },
            { name: "tipoVinculo", label: "Tipo de Vínculo", type: "select", options: ["CLT", "PJ", "Autônomo", "Funcionário Público", "Empresário", "Misto"] },
            { name: "rendaVariavel", label: "Renda Variável Média (mês)", type: "currency", placeholder: "R$ 0,00" },
            { name: "gastoMoradia", label: "Gastos com Moradia", type: "currency", placeholder: "R$ 0,00" },
            { name: "gastoAlimentacao", label: "Gastos com Alimentação", type: "currency", placeholder: "R$ 0,00" },
            { name: "gastoTransporte", label: "Gastos com Transporte", type: "currency", placeholder: "R$ 0,00" },
            { name: "gastoSaude", label: "Gastos com Saúde", type: "currency", placeholder: "R$ 0,00" },
            { name: "reservaAtual", label: "Valor Guardado (Reserva)", type: "currency", placeholder: "R$ 0,00" },
            { name: "localReserva", label: "Onde está a reserva?", type: "select", options: ["Poupança", "CDB Liquidez Diária", "Tesouro Selic", "Conta Corrente", "Outro", "Não possuo"] },
            { name: "totalDividas", label: "Saldo Devedor de Dívidas", type: "currency", placeholder: "R$ 0,00" },
            { name: "parcelasDividas", label: "Parcela Mensal de Dívidas", type: "currency", placeholder: "R$ 0,00" }
        ],
        analysis: [
            "Taxa de Comprometimento de Renda",
            "Cálculo exato da Meta da Reserva de Emergência",
            "Capacidade Líquida de Investimento",
            "Índice de Endividamento e Custo dos Juros"
        ]
    },
    {
        title: "Proteção e Segurança",
        short: "Gestão de Riscos Pessoais",
        status: "Proteção do plano",
        desc: "O Pilar 2 mapeia suas vulnerabilidades. Ninguém gosta de pensar nisso, mas proteger quem você ama e blindar seu patrimônio contra imprevistos é um ato de responsabilidade.",
        objective: "Identificar vulnerabilidades e sugerir coberturas.",
        delivery: "Matriz de riscos e capital segurado sugerido.",
        signal: "Riscos graves estão isolados e tratados.",
        icon: <HeartPulse className="text-[#4fa080] shrink-0" size={24} />,
        fields: [
            { name: "idade", label: "Sua Idade", type: "number", placeholder: "Ex: 35" },
            { name: "estadoCivil", label: "Estado Civil", type: "select", options: ["Solteiro", "Casado", "União Estável", "Divorciado", "Viúvo"] },
            { name: "dependentes", label: "Número de Dependentes", type: "number", placeholder: "Ex: 2" },
            { name: "principalProvedor", label: "Principal Provedor da Família?", type: "radio", options: ["Sim", "Não", "Divido igualmente"] },
            { name: "tipoMoradia", label: "Tipo de Moradia", type: "select", options: ["Própria quitada", "Própria financiada", "Alugada"] },
            { name: "profissaoRisco", label: "Risco Ocupacional", type: "select", options: ["Baixo (Ex: Escritório)", "Médio (Ex: Eng. Campo)", "Alto (Ex: Trabalho perigoso)"] },
            { name: "seguroVidaAtual", label: "Capital Segurado (Vida)", type: "currency", placeholder: "R$ 0,00" },
            { name: "planoSaude", label: "Possui Plano de Saúde?", type: "select", options: ["Sim - Empresarial", "Sim - Individual/Familiar", "Não (Uso SUS)"] },
            { name: "seguroResidencial", label: "Possui Seguro Residencial?", type: "radio", options: ["Sim", "Não"] }
        ],
        analysis: [
            "Matriz de Vulnerabilidade (Morte, Invalidez, Saúde)",
            "Cálculo de Capital Necessário (Seguro de Vida)",
            "Gaps e Excessos em proteções atuais",
            "Adequação de Plano de Saúde e Proteção DIT"
        ]
    },
    {
        title: "Construção de Patrimônio",
        short: "Perfil e Alocação",
        status: "Estratégia patrimonial",
        desc: "O Pilar 3 define como seu dinheiro vai trabalhar. Avaliamos seu perfil (Suitability ARVO), seus objetivos no tempo e propomos uma alocação de carteira (Abrigo, Ritmo, Visão ou Oceano).",
        objective: "Conectar carteira, perfil de risco e objetivos.",
        delivery: "Alocação sugerida vs. atual e simulação.",
        signal: "Cada investimento tem um motivo no plano.",
        icon: <Target className="text-[#4fa080] shrink-0" size={24} />,
        fields: [
            { name: "experienciaInvestimentos", label: "Tempo investindo", type: "select", options: ["Nunca", "Menos de 1 ano", "1 a 3 anos", "3 a 5 anos", "Mais de 5 anos"] },
            { name: "reacaoQueda", label: "Se caísse 20% no mês, você:", type: "select", options: ["Venderia tudo", "Venderia parte", "Não faria nada", "Compraria mais"] },
            { name: "objetivoPrincipal", label: "Principal objetivo", type: "select", options: ["Preservar patrimônio", "Renda extra", "Crescer no longo prazo", "Aposentadoria"] },
            { name: "horizonteTempo", label: "Quando vai usar o dinheiro?", type: "select", options: ["Menos de 1 ano", "1 a 3 anos", "3 a 5 anos", "5 a 10 anos", "Mais de 10 anos"] },
            { name: "patrimonioInvestido", label: "Patrimônio Atual Investido", type: "currency", placeholder: "R$ 0,00" },
            { name: "aporteMensal", label: "Aporte Mensal Planejado", type: "currency", placeholder: "R$ 0,00" }
        ],
        analysis: [
            "Suitability e Perfil de Risco ARVO",
            "Classificação de objetivos por horizonte de tempo",
            "Proposta de Carteira (Abrigo, Ritmo, Visão, Oceano)",
            "Simulação do poder dos Juros Compostos"
        ]
    },
    {
        title: "Futuro e Aposentadoria",
        short: "Independência Financeira",
        status: "Longo prazo",
        desc: "O Pilar 4 situa você na curva da vida. Descubra o 'número mágico' do patrimônio necessário para manter seu padrão de vida e simule o impacto da previdência e do INSS.",
        objective: "Descobrir o seu número de liberdade.",
        delivery: "Plano de acumulação e simulação do gap.",
        signal: "Você tem uma meta patrimonial exata.",
        icon: <Landmark className="text-[#4fa080] shrink-0" size={24} />,
        fields: [
            { name: "idadeIf", label: "Idade desejada para Aposentadoria", type: "number", placeholder: "Ex: 60" },
            { name: "rendaAposentadoria", label: "Renda Mensal Desejada", type: "currency", placeholder: "R$ 0,00" },
            { name: "expectativaInss", label: "Espera receber INSS?", type: "radio", options: ["Sim", "Parcialmente", "Não"] },
            { name: "valorInss", label: "Estimativa INSS (se sim)", type: "currency", placeholder: "R$ 0,00" },
            { name: "possuiPrevidencia", label: "Possui Previdência Privada?", type: "select", options: ["PGBL", "VGBL", "Ambos", "Não possuo"] }
        ],
        analysis: [
            "Necessidade de Patrimônio (com/sem herança)",
            "Análise do Gap de Aposentadoria",
            "Aporte Mensal Ajustado (para fechar a conta)",
            "Otimização Previdenciária (PGBL vs VGBL)"
        ]
    },
    {
        title: "Inteligência Tributária",
        short: "Otimização Fiscal",
        status: "Eficiência",
        desc: "O Pilar 5 mapeia como os impostos corroem seus ganhos. Avaliamos sua declaração de IR, come-cotas e isenções para maximizar seu rendimento líquido de forma 100% legal.",
        objective: "Otimizar a carga tributária sobre investimentos.",
        delivery: "Mapa de tributação e oportunidades fiscais.",
        signal: "Você otimizou sua declaração.",
        icon: <ShieldCheck className="text-[#4fa080] shrink-0" size={24} />,
        fields: [
            { name: "declaracaoIr", label: "Tipo de Declaração do IR", type: "radio", options: ["Completa", "Simplificada", "Isento", "Não sei"] },
            { name: "faixaRenda", label: "Faixa de Renda Tributável", type: "select", options: ["Até Isenção", "Até 27,5%", "Acima de 27,5%"] },
            { name: "tipoRendimento", label: "Tipo de Rendimento", type: "select", options: ["Salário CLT", "Pró-labore", "Lucros / Dividendos", "Misto", "Autônomo"] },
            { name: "possuiPj", label: "Possui Empresa (PJ)?", type: "select", options: ["Não", "MEI", "Simples Nacional", "Lucro Presumido", "Lucro Real"] },
            { name: "gastosDedutiveis", label: "Gastos Dedutíveis Relevantes?", type: "radio", options: ["Sim (Saúde, Educação, etc)", "Não / Poucos"] }
        ],
        analysis: [
            "Estimativa da Alíquota Efetiva de IR",
            "Identificação de Come-Cotas em Fundos",
            "Oportunidade de benefício fiscal via PGBL (até 12%)",
            "Vantagem de transição para ativos Isentos (LCI/LCA)"
        ]
    },
    {
        title: "Legado e Sucessão",
        short: "Herança e Continuidade",
        status: "Proteção Familiar",
        desc: "O Pilar 6 organiza a transmissão do seu patrimônio. Entenda o impacto do ITCMD, custos de inventário e crie um dossiê para proteger quem você ama de conflitos e burocracia.",
        objective: "Organizar a sucessão e blindar a família.",
        delivery: "Checklist sucessório e estimativa de inventário.",
        signal: "Clareza sobre estruturas de herança.",
        icon: <Building2 className="text-[#4fa080] shrink-0" size={24} />,
        fields: [
            { name: "regimeBens", label: "Regime de Bens", type: "select", options: ["Comunhão Parcial", "Comunhão Universal", "Separação Total", "Participação Final", "Não sei / Não se aplica"] },
            { name: "pactoAntenupcial", label: "Possui Pacto Antenupcial?", type: "radio", options: ["Sim", "Não", "Não se aplica"] },
            { name: "filhosMenores", label: "Possui filhos menores?", type: "radio", options: ["Sim", "Não"] },
            { name: "empresaFamiliar", label: "Empresa Familiar/Sociedade?", type: "radio", options: ["Sim", "Não"] },
            { name: "possuiTestamento", label: "Possui Testamento?", type: "radio", options: ["Sim", "Não"] }
        ],
        analysis: [
            "Mapeamento de Meação vs. Herança",
            "Estimativa de Custo de Inventário e ITCMD",
            "Estruturas eficientes (Uso de VGBL, Doação)",
            "Checklist do Dossiê Financeiro Familiar"
        ]
    }
]

const PROGRESS_LABELS = [
    "Pilar 1: Preencha seus dados de renda e despesa. O Raio-X é o alicerce onde a Arvo constrói suas projeções.",
    "Pilar 2: Proteção. Mapeie seus riscos e assegure que acidentes de percurso não destruam sua estabilidade.",
    "Pilar 3: Estratégia. Suas respostas ajustam seu perfil e moldam a carteira ideal para o seu momento.",
    "Pilar 4: Futuro. Descubra o número exato para a independência financeira e calcule o gap.",
    "Pilar 5: Inteligência Fiscal. Dados sobre seu IR permitem encontrar atalhos legais para reter mais ganhos.",
    "Pilar 6: Legado. Organizar como o patrimônio passa para a próxima geração evita que a burocracia consuma seu trabalho."
]

export default function PlanejamentoJornadaPage() {
    const [current, setCurrent] = useState(0)
    const [formData, setFormData] = useState<Record<string, string>>({})
    const [showDashboard, setShowDashboard] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function loadProgress() {
            const res = await getJornadaProgress()
            if (res.success && res.data) {
                // Ignore parsing errors and load what we have
                try {
                    const savedData = res.data as Record<string, string>
                    setFormData(savedData)
                    if (res.isCompleted) {
                        setShowDashboard(true)
                    }
                } catch (e) {}
            }
            setIsLoading(false)
        }
        loadProgress()
    }, [])

    const handleInputChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const formatCurrency = (val: string) => {
        const clean = val.replace(/\D/g, "")
        if (!clean) return ""
        const num = parseInt(clean) / 100
        return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(num)
    }

    const goNext = async () => {
        if (current < PLAN_DATA.length - 1) {
            setCurrent((prev) => prev + 1)
            window.scrollTo({ top: 0, behavior: 'smooth' })
            await saveJornadaProgress(formData, false)
        } else {
            setShowDashboard(true)
            window.scrollTo({ top: 0, behavior: 'smooth' })
            await saveJornadaProgress(formData, true)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f6f4ef]">
                <Loader2 className="w-8 h-8 text-[#123044] animate-spin" />
            </div>
        )
    }

    if (showDashboard) {
        return <PlanoArvoDashboard onBack={() => setShowDashboard(false)} />
    }

    const step = PLAN_DATA[current]
    const score = Math.round(((current + 1) / PLAN_DATA.length) * 100)

    return (
        <div className="min-h-screen text-slate-900 font-sans p-6 md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-300 bg-[#f6f4ef]">
            
            <div className="max-w-[1100px] mx-auto space-y-8">
                
                {/* HERO SECTION */}
                <section className="grid lg:grid-cols-[1fr_380px] gap-8 items-center">
                    <div>
                        <div className="text-[11px] font-extrabold text-[#1f674f] uppercase tracking-widest mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#1f674f] animate-pulse"></span>
                            Método Arvo de Planejamento (CFP®)
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extralight tracking-tight text-[#123044] mb-4 leading-[1.1]">
                            Sua vida financeira<br/><span className="font-semibold">em uma jornada clara.</span>
                        </h1>
                        <p className="text-[#667085] text-base max-w-xl leading-relaxed mb-8">
                            Nós não vendemos apenas fundos. Nós construímos o seu mapa financeiro global. 
                            Preencha cada etapa abaixo para iniciarmos a análise estrutural da sua vida.
                        </p>
                    </div>

                    {/* PROGRESS CARD */}
                    <div className="bg-[#fffdf8]/90 border border-[#e4e0d7] rounded-[32px] p-8 shadow-[0_30px_60px_rgba(18,48,68,0.06)] backdrop-blur-md">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <div className="text-xs font-bold text-[#667085] mb-1 uppercase tracking-wider">Progresso da Análise</div>
                                <div className="text-5xl font-extrabold text-[#123044] tracking-tighter">{score}%</div>
                            </div>
                            <div className="px-3 py-1.5 bg-[#e8f1ed] text-[#1f674f] rounded-full text-xs font-extrabold whitespace-nowrap">
                                Etapa {current + 1} de {PLAN_DATA.length}
                            </div>
                        </div>
                        
                        <div className="h-3 bg-[#e4e0d7] rounded-full overflow-hidden mb-4">
                            <motion.div 
                                className="h-full bg-gradient-to-r from-[#1f674f] to-[#4fa080] rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${score}%` }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            />
                        </div>
                        
                        <p className="text-[13px] text-[#667085] leading-relaxed font-medium min-h-[40px]">
                            {PROGRESS_LABELS[current]}
                        </p>
                    </div>
                </section>

                {/* HORIZONTAL NAVIGATION */}
                <nav className="w-full pb-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {PLAN_DATA.map((item, idx) => {
                            const isActive = idx === current
                            const isDone = idx < current
                            
                            return (
                                <div 
                                    key={idx}
                                    onClick={() => setCurrent(idx)}
                                    className={`flex flex-col items-start gap-2 p-3 rounded-2xl cursor-pointer transition-all duration-200 border w-full ${
                                        isActive 
                                            ? "bg-[#123044] border-transparent shadow-lg text-white transform scale-[1.02]" 
                                            : "border-[#e4e0d7] bg-[#fffdf8]/90 hover:bg-[#f0ece1] text-[#123044]"
                                    }`}
                                >
                                    <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-[10px] font-extrabold text-xs ${
                                        isActive ? "bg-white text-[#123044]" : 
                                        isDone ? "bg-[#1f674f] !text-white" : 
                                        "bg-[#e4e0d7] text-[#667085]"
                                    }`}>
                                        {isDone ? <Check size={16} strokeWidth={3} /> : (idx + 1)}
                                    </div>
                                    <div className="w-full mt-1">
                                        <div className={`font-bold text-[13px] leading-tight line-clamp-2 ${isActive ? "!text-white" : "text-[#123044]"}`}>
                                            {item.title}
                                        </div>
                                        <div className={`text-[10px] truncate mt-1 ${isActive ? "!text-white/70" : "text-[#667085]"}`}>
                                            {item.short}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </nav>

                {/* JOURNEY MAIN */}
                <section className="flex flex-col items-start w-full">

                    {/* MAIN PANEL CONTENT */}
                    <main className="bg-[#fffdf8]/90 border border-[#e4e0d7] rounded-[32px] p-8 md:p-10 shadow-[0_20px_50px_rgba(23,33,43,0.04)] min-h-[600px] flex flex-col">
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={current}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="flex-1"
                            >
                                {/* HEADER */}
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                                    <div>
                                        <div className="text-[11px] font-extrabold text-[#4fa080] uppercase tracking-widest mb-2 flex items-center gap-2">
                                            {step.icon}
                                            PASSO {current + 1}
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-extralight tracking-tight text-[#123044]">
                                            {step.title}
                                        </h2>
                                    </div>
                                    <div className="px-4 py-2 bg-[#e8f1ed] text-[#1f674f] rounded-full text-xs font-extrabold self-start whitespace-nowrap border border-[#d6e5de]">
                                        {step.status}
                                    </div>
                                </div>

                                <p className="text-[#475467] text-base leading-relaxed mb-10 max-w-3xl">
                                    {step.desc}
                                </p>

                                {/* INTERACTIVE FORM & ANALYSIS */}
                                <div className="grid lg:grid-cols-[1fr_350px] gap-8 mb-10">
                                    
                                    {/* FORMULÁRIO DE ENTRADA */}
                                    <div className="bg-white border border-[#e4e0d7] rounded-[24px] p-6 shadow-sm">
                                        <h3 className="text-lg font-bold text-[#123044] mb-6 flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-[#4fa080]"></div>
                                            Colete seus dados
                                        </h3>
                                        <div className="grid sm:grid-cols-2 gap-5">
                                            {step.fields.map((field) => (
                                                <div key={field.name} className={`space-y-2 ${field.type === "radio" ? "sm:col-span-2" : ""}`}>
                                                    <label className="text-xs font-bold text-[#667085] uppercase tracking-wider">{field.label}</label>
                                                    
                                                    {field.type === "text" || field.type === "number" ? (
                                                        <input 
                                                            type={field.type}
                                                            className="w-full border border-[#e4e0d7] bg-[#fbfaf8] rounded-xl px-4 py-3 text-sm text-[#123044] font-semibold outline-none focus:border-[#4fa080] focus:ring-1 focus:ring-[#4fa080] transition-all"
                                                            placeholder={field.placeholder}
                                                            value={formData[field.name] || ""}
                                                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                                                        />
                                                    ) : field.type === "currency" ? (
                                                        <input 
                                                            type="text"
                                                            className="w-full border border-[#e4e0d7] bg-[#fbfaf8] rounded-xl px-4 py-3 text-sm text-[#123044] font-semibold outline-none focus:border-[#4fa080] focus:ring-1 focus:ring-[#4fa080] transition-all"
                                                            placeholder={field.placeholder}
                                                            value={formData[field.name] || ""}
                                                            onChange={(e) => {
                                                                const formatted = formatCurrency(e.target.value)
                                                                handleInputChange(field.name, formatted)
                                                            }}
                                                        />
                                                    ) : field.type === "select" ? (
                                                        <select 
                                                            className="w-full border border-[#e4e0d7] bg-[#fbfaf8] rounded-xl px-4 py-3 text-sm text-[#123044] font-semibold outline-none focus:border-[#4fa080] focus:ring-1 focus:ring-[#4fa080] transition-all appearance-none"
                                                            value={formData[field.name] || ""}
                                                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                                                        >
                                                            <option value="" disabled>Selecione uma opção...</option>
                                                            {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                        </select>
                                                    ) : field.type === "radio" ? (
                                                        <div className="grid sm:grid-cols-2 gap-2">
                                                            {field.options?.map(opt => (
                                                                <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                                                    formData[field.name] === opt ? "bg-[#e8f1ed] border-[#4fa080]" : "bg-[#fbfaf8] border-[#e4e0d7] hover:bg-[#f5f3ed]"
                                                                }`}>
                                                                    <input 
                                                                        type="radio" 
                                                                        name={field.name} 
                                                                        value={opt} 
                                                                        checked={formData[field.name] === opt}
                                                                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                                                                        className="w-4 h-4 text-[#4fa080] border-gray-300 focus:ring-[#4fa080]"
                                                                    />
                                                                    <span className={`text-sm font-semibold ${formData[field.name] === opt ? "text-[#1f674f]" : "text-[#475467]"}`}>
                                                                        {opt}
                                                                    </span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* O QUE A ARVO ANALISA */}
                                    <div className="bg-[#f8f6f0] border border-[#e4e0d7] rounded-[24px] p-6 shadow-sm flex flex-col">
                                        <h3 className="text-lg font-bold text-[#123044] mb-6 flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-[#123044]"></div>
                                            O que a Arvo analisa
                                        </h3>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <ul className="space-y-5">
                                                {step.analysis.map((analysisItem, i) => (
                                                    <li key={i} className="flex gap-4 items-center p-4 bg-white rounded-xl shadow-sm border border-[#e4e0d7]/60">
                                                        <Check className="text-[#4fa080] shrink-0" size={20} strokeWidth={3} />
                                                        <span className="text-sm font-semibold text-[#123044] leading-tight">{analysisItem}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="mt-8 p-4 bg-white rounded-xl border border-[#e4e0d7] text-center">
                                            <div className="text-[10px] font-extrabold text-[#667085] uppercase tracking-widest mb-1">Entregável da Etapa</div>
                                            <div className="text-[13px] font-bold text-[#1f674f] leading-snug">{step.delivery}</div>
                                        </div>
                                    </div>

                                </div>

                            </motion.div>
                        </AnimatePresence>

                        {/* NEXT BUTTON STRIP */}
                        <div className="mt-auto pt-6 border-t border-[#e4e0d7]">
                            <div className="bg-[#123044] rounded-[24px] p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-lg">
                                <div className="text-center md:text-left">
                                    <div className="text-xl font-bold mb-1 !text-white">
                                        {current === PLAN_DATA.length - 1 
                                            ? "Jornada concluída. Gerar Diagnóstico." 
                                            : `Próximo passo: ${PLAN_DATA[current + 1].title}`}
                                    </div>
                                    <div className="!text-white/80 text-sm">
                                        {current === PLAN_DATA.length - 1
                                            ? "Você preencheu todas as etapas. A Arvo está pronta para processar o seu mapa financeiro."
                                            : "Preencha os campos e avance para estruturar a próxima dimensão do seu plano."}
                                    </div>
                                </div>
                                <button 
                                    onClick={goNext}
                                    className="px-6 py-3 bg-white text-[#123044] rounded-full font-extrabold text-sm hover:bg-[#f0ece1] transition-colors shrink-0 flex items-center gap-2 w-full md:w-auto justify-center"
                                >
                                    {current === PLAN_DATA.length - 1 ? "Salvar Diagnóstico" : "Avançar Etapa"}
                                    <ArrowRightCircle size={18} />
                                </button>
                            </div>
                        </div>
                        
                    </main>
                </section>
                
            </div>
        </div>
    )
}
