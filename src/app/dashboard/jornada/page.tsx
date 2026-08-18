"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ArrowRight, ArrowLeft, ArrowRightCircle, Target, Wallet, ShieldCheck, HeartPulse, Building2, Landmark, Compass, Loader2, Sparkles, CheckCircle2, RotateCcw, Plus, Trash2, PlusCircle, DollarSign } from "lucide-react"
import PlanoArvoDashboard from "@/components/plano-arvo-dashboard"
import { saveJornadaProgress, getJornadaProgress } from "./actions"
import { calculateInvestorProfile } from "@/lib/profile-calculator"

// Types
type FieldDef = {
    name: string
    label: string
    type: "text" | "number" | "currency" | "select" | "radio"
    options?: string[]
    placeholder?: string
}

type CustomExpense = {
    id: string
    name: string
    value: string
}

const SUITABILITY_QUESTIONS = [
    {
        id: 0,
        name: "perfil_experiencia",
        title: "Qual a sua experiência com investimentos no mercado financeiro?",
        subtitle: "Selecione a opção que melhor descreve seu histórico até hoje:",
        options: [
            { letter: "A", text: "Iniciante: Somente poupança ou ainda não comecei a investir" },
            { letter: "B", text: "Básico: Invisto em Renda Fixa tradicional (CDB, Tesouro Selic, LCI/LCA)" },
            { letter: "C", text: "Intermediário: Diversifico entre Renda Fixa, Fundos de Investimento e FIIs" },
            { letter: "D", text: "Avançado: Invisto ativamente em Ações, FIIs, Criptoativos e Ativos Globais" }
        ]
    },
    {
        id: 1,
        name: "perfil_reacao_queda",
        title: "Se seus investimentos caíssem 15% em um mês de forte estresse no mercado, você:",
        subtitle: "Avalie como você costuma reagir emocionalmente a oscilações:",
        options: [
            { letter: "A", text: "Ficaria desesperado e resgataria todo o dinheiro imediatamente" },
            { letter: "B", text: "Ficaria desconfortável e transferiria uma parte para a renda fixa mais segura" },
            { letter: "C", text: "Compreenderia que faz parte da oscilação do mercado e manteria o plano" },
            { letter: "D", text: "Veria como grande oportunidade e aproveitaria para investir mais" }
        ]
    },
    {
        id: 2,
        name: "perfil_objetivo",
        title: "Qual é o principal objetivo para o seu patrimônio?",
        subtitle: "Identifique sua prioridade de longo prazo:",
        options: [
            { letter: "A", text: "Preservação absoluta do capital e liquidez imediata (não tolero oscilação)" },
            { letter: "B", text: "Superar a inflação com baixo risco e renda constante (estabilidade)" },
            { letter: "C", text: "Crescimento patrimonial de longo prazo aceitando oscilações moderadas" },
            { letter: "D", text: "Maximizar o retorno no longo prazo aceitando alta volatilidade" }
        ]
    },
    {
        id: 3,
        name: "perfil_horizonte",
        title: "Por quanto tempo você pretende manter a maior parte do seu patrimônio investida?",
        subtitle: "O horizonte de tempo é fundamental para o nível de risco adequado:",
        options: [
            { letter: "A", text: "Menos de 1 ano (preciso do dinheiro no curto prazo)" },
            { letter: "B", text: "De 1 a 3 anos (médio prazo curto)" },
            { letter: "C", text: "De 3 a 7 anos (médio/longo prazo)" },
            { letter: "D", text: "Mais de 7 a 10 anos (foco em aposentadoria e independência)" }
        ]
    },
    {
        id: 4,
        name: "perfil_liquidez",
        title: "Qual parcela do patrimônio você pode precisar resgatar nos próximos 12 meses?",
        subtitle: "Isso define a necessidade de liquidez imediata versus ativos com carência:",
        options: [
            { letter: "A", text: "Mais de 50% do total investido" },
            { letter: "B", text: "Entre 20% e 50% do total" },
            { letter: "C", text: "Entre 10% e 20% do total" },
            { letter: "D", text: "Menos de 10% (minha reserva de emergência já está 100% separada)" }
        ]
    },
    {
        id: 5,
        name: "perfil_perdas",
        title: "Qual frase melhor descreve sua tolerância a oscilações temporárias?",
        subtitle: "Sua postura diante da relação risco vs. retorno:",
        options: [
            { letter: "A", text: "Não admito perdas nominais em hipótese alguma" },
            { letter: "B", text: "Aceito pequenas variações temporárias se render acima do CDI" },
            { letter: "C", text: "Aceito oscilações de médio prazo para buscar valorização expressiva" },
            { letter: "D", text: "Busco rentabilidade máxima e tolero quedas severas sem mudar a rota" }
        ]
    }
]

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
        short: "Objetivos e Aportes",
        status: "Estratégia patrimonial",
        desc: "O Pilar 3 organiza seus objetivos no tempo e a sua capacidade de poupança contínua para fazer o patrimônio trabalhar a seu favor.",
        objective: "Conectar capacidade de aporte a objetivos de vida.",
        delivery: "Plano de acumulação patrimonial estruturado.",
        signal: "Cada aporte possui meta e destino definidos.",
        icon: <Target className="text-[#4fa080] shrink-0" size={24} />,
        fields: [
            { name: "patrimonioInvestido", label: "Patrimônio Atual Investido", type: "currency", placeholder: "R$ 0,00" },
            { name: "aporteMensal", label: "Aporte Mensal Planejado", type: "currency", placeholder: "R$ 0,00" },
            { name: "objetivoPrincipal", label: "Principal objetivo financeiro", type: "select", options: ["Preservar patrimônio", "Renda extra e dividendos", "Crescer patrimônio no longo prazo", "Comprar imóvel / Bens de alto valor", "Independência financeira"] },
            { name: "prazoPrincipalObjetivo", label: "Prazo para o principal objetivo", type: "select", options: ["Curto prazo (até 2 anos)", "Médio prazo (2 a 5 anos)", "Longo prazo (5 a 10 anos)", "Mais de 10 anos"] },
            { name: "prioridadeAportes", label: "Prioridade dos próximos aportes", type: "select", options: ["Completar reserva de emergência", "Acelerar independência financeira", "Projetos de médio prazo", "Diversificar em ativos globais"] }
        ],
        analysis: [
            "Classificação de objetivos por horizonte de tempo",
            "Taxa de Poupança vs. Renda Líquida",
            "Simulação do poder dos Juros Compostos no tempo",
            "Mapeamento de prioridades para os próximos 12 meses"
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
    },
    {
        title: "Análise do Seu Perfil de Investimento",
        short: "Seu Perfil de Risco",
        status: "Diretriz da Bússola",
        desc: "O Pilar 7 avalia cientificamente sua tolerância ao risco, capacidade de absorver perdas e horizonte de investimento para calibrar sua Bússola de Carteiras (Abrigo, Ritmo, Visão ou Oceano) sob medida para você.",
        objective: "Determinar seu perfil oficial de investidor ARVO.",
        delivery: "Classificação do seu perfil e calibração da Bússola.",
        signal: "Sua carteira está perfeitamente alinhada ao seu estômago e metas.",
        icon: <Compass className="text-[#4fa080] shrink-0" size={24} />,
        fields: [] as FieldDef[],
        analysis: [
            "Cálculo do Score de Tolerância ao Risco",
            "Determinação do Perfil Oficial ARVO (Abrigo, Ritmo, Visão, Oceano)",
            "Calibração de Alertas Inteligentes na Bússola de Investimentos",
            "Validação de Adequação Regulatória (Suitability Fee-Only)"
        ]
    }
]

const PROGRESS_LABELS = [
    "Pilar 1: Preencha seus dados de renda e despesa. O Raio-X é o alicerce onde a ARVO constrói suas projeções.",
    "Pilar 2: Proteção. Mapeie seus riscos e assegure que acidentes de percurso não destruam sua estabilidade.",
    "Pilar 3: Construção. Defina seus objetivos patrimoniais e alinhe o ritmo dos seus aportes.",
    "Pilar 4: Futuro. Descubra o número exato para a independência financeira e calcule o gap.",
    "Pilar 5: Inteligência Fiscal. Dados sobre seu IR permitem encontrar atalhos legais para reter mais ganhos.",
    "Pilar 6: Legado. Organizar como o patrimônio passa para a próxima geração evita burocracia e custos.",
    "Pilar 7: Seu Perfil. Responda o questionário interativo para calibrar sua Bússola de Carteiras sob medida."
]

export default function PlanejamentoJornadaPage() {
    const [current, setCurrent] = useState(0)
    const [formData, setFormData] = useState<Record<string, string>>({})
    const [customExpenses, setCustomExpenses] = useState<CustomExpense[]>([])
    const [showDashboard, setShowDashboard] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [quizQuestionIndex, setQuizQuestionIndex] = useState(0)
    const [showQuizResult, setShowQuizResult] = useState(false)

    useEffect(() => {
        async function loadProgress() {
            const res = await getJornadaProgress()
            if (res.success && res.data) {
                try {
                    const savedData = res.data as Record<string, string>
                    setFormData(savedData)
                    
                    if (savedData.customExpensesJson) {
                        try {
                            const parsed = JSON.parse(savedData.customExpensesJson)
                            if (Array.isArray(parsed)) {
                                setCustomExpenses(parsed)
                            }
                        } catch (e) {}
                    }
                    
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

    const handleAddCustomExpense = () => {
        const newExpense: CustomExpense = {
            id: Date.now().toString(),
            name: "",
            value: ""
        }
        const updated = [...customExpenses, newExpense]
        setCustomExpenses(updated)
        setFormData(prev => ({
            ...prev,
            customExpensesJson: JSON.stringify(updated)
        }))
    }

    const handleUpdateCustomExpense = (id: string, key: "name" | "value", val: string) => {
        const updated = customExpenses.map(item => item.id === id ? { ...item, [key]: val } : item)
        setCustomExpenses(updated)
        setFormData(prev => ({
            ...prev,
            customExpensesJson: JSON.stringify(updated)
        }))
    }

    const handleRemoveCustomExpense = (id: string) => {
        const updated = customExpenses.filter(item => item.id !== id)
        setCustomExpenses(updated)
        setFormData(prev => ({
            ...prev,
            customExpensesJson: JSON.stringify(updated)
        }))
    }

    // Total de gastos da Etapa 1
    const totalExpenses = useMemo(() => {
        const parseCurrencyValue = (val?: string) => {
            if (!val) return 0
            const clean = val.replace(/\D/g, "")
            if (!clean) return 0
            return parseInt(clean) / 100
        }

        const moradia = parseCurrencyValue(formData.gastoMoradia)
        const alimentacao = parseCurrencyValue(formData.gastoAlimentacao)
        const transporte = parseCurrencyValue(formData.gastoTransporte)
        const saude = parseCurrencyValue(formData.gastoSaude)
        const dividas = parseCurrencyValue(formData.parcelasDividas)
        const customTotal = customExpenses.reduce((sum, item) => sum + parseCurrencyValue(item.value), 0)

        return moradia + alimentacao + transporte + saude + dividas + customTotal
    }, [formData, customExpenses])

    const totalExpensesFormatted = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalExpenses)

    const calculatedCurrentProfile = calculateInvestorProfile(formData)

    const profileMetaMap: Record<string, { label: string; color: string; badgeBg: string; border: string; desc: string }> = {
        ABRIGO: { 
            label: "Abrigo (Conservador)", 
            color: "#123044", 
            badgeBg: "#e4efe8", 
            border: "#9bcbb4",
            desc: "Prioridade absoluta em liquidez e preservação do capital. Baixíssima tolerância a oscilações." 
        },
        RITMO: { 
            label: "Ritmo (Moderado)", 
            color: "#1f674f", 
            badgeBg: "#e8f1ed", 
            border: "#4fa080",
            desc: "Equilíbrio entre segurança e proteção real contra a inflação (IPCA+), aceitando oscilações controladas." 
        },
        "VISÃO": { 
            label: "Visão (Arrojado)", 
            color: "#2b6e76", 
            badgeBg: "#e8f2f4", 
            border: "#2b6e76",
            desc: "Foco em crescimento de longo prazo com ações, multimercados e ativos imobiliários, com boa tolerância ao risco." 
        },
        OCEANO: { 
            label: "Oceano (Agressivo)", 
            color: "#123044", 
            badgeBg: "#f0f4f8", 
            border: "#123044",
            desc: "Máximo potencial de retorno com exposição global e total tolerância a alta volatilidade para horizontes longos." 
        }
    }

    // Handle alternative selection in step 7
    const handleSelectQuizOption = (questionName: string, optionText: string) => {
        setFormData(prev => ({ ...prev, [questionName]: optionText }))
        
        // Advance to next question after small visual feedback
        setTimeout(() => {
            if (quizQuestionIndex < SUITABILITY_QUESTIONS.length - 1) {
                setQuizQuestionIndex(prev => prev + 1)
            } else {
                setShowQuizResult(true)
            }
        }, 220)
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
        return <PlanoArvoDashboard formData={formData} onBack={() => setShowDashboard(false)} />
    }

    const step = PLAN_DATA[current]
    const score = Math.round(((current + 1) / PLAN_DATA.length) * 100)
    const currentQuizQ = SUITABILITY_QUESTIONS[quizQuestionIndex]

    return (
        <div className="min-h-screen text-slate-900 font-sans p-6 md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-300 bg-[#f6f4ef]">
            
            <div className="max-w-[1100px] mx-auto space-y-8">
                
                {/* HERO SECTION */}
                <section className="grid lg:grid-cols-[1fr_380px] gap-8 items-center">
                    <div>
                        <div className="text-[11px] font-extrabold text-[#1f674f] uppercase tracking-widest mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#1f674f] animate-pulse"></span>
                            Jornada de Planejamento ARVO (7 Etapas)
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extralight tracking-tight text-[#123044] mb-4 leading-[1.1]">
                            Sua vida financeira<br/><span className="font-semibold">em 7 etapas completas.</span>
                        </h1>
                        <p className="text-[#667085] text-base max-w-xl leading-relaxed mb-8">
                            Construímos seu mapa financeiro global e calibramos sua tolerância a risco na etapa final para conectar suas decisões à Bússola de Investimentos.
                        </p>
                    </div>

                    {/* PROGRESS CARD */}
                    <div className="bg-[#fffdf8]/90 border border-[#e4e0d7] rounded-[32px] p-8 shadow-[0_30px_60px_rgba(18,48,68,0.06)] backdrop-blur-md">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <div className="text-xs font-bold text-[#667085] mb-1 uppercase tracking-wider">Progresso da Jornada</div>
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

                {/* HORIZONTAL NAVIGATION (7 ETAPAS) */}
                <nav className="w-full pb-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
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
                                    <div className={`w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-[8px] font-extrabold text-xs ${
                                        isActive ? "bg-white text-[#123044]" : 
                                        isDone ? "bg-[#1f674f] !text-white" : 
                                        "bg-[#e4e0d7] text-[#667085]"
                                    }`}>
                                        {isDone ? <Check size={14} strokeWidth={3} /> : (idx + 1)}
                                    </div>
                                    <div className="w-full mt-1">
                                        <div className={`font-bold text-[12px] leading-tight line-clamp-2 ${isActive ? "!text-white" : "text-[#123044]"}`}>
                                            {item.title}
                                        </div>
                                        <div className={`text-[9.5px] truncate mt-0.5 ${isActive ? "!text-white/70" : "text-[#667085]"}`}>
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
                    <main className="bg-[#fffdf8]/90 border border-[#e4e0d7] rounded-[32px] p-8 md:p-10 shadow-[0_20px_50px_rgba(23,33,43,0.04)] min-h-[600px] flex flex-col w-full">
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={current}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="flex-1 flex flex-col"
                            >
                                {/* HEADER */}
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                                    <div>
                                        <div className="text-[11px] font-extrabold text-[#4fa080] uppercase tracking-widest mb-2 flex items-center gap-2">
                                            {step.icon}
                                            ETAPA {current + 1} DE {PLAN_DATA.length} · {step.status}
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-extralight tracking-tight text-[#123044]">
                                            {step.title}
                                        </h2>
                                        <p className="text-sm text-[#667085] mt-1 max-w-2xl leading-relaxed">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>

                                {/* ======================================================== */}
                                {/* ETAPA 7: QUESTIONÁRIO INTERATIVO DE ALTERNATIVAS (QUIZ) */}
                                {/* ======================================================== */}
                                {current === 6 ? (
                                    <div className="my-4 flex-1 flex flex-col">
                                        {!showQuizResult ? (
                                            /* CARD DA PERGUNTA ATUAL */
                                            <div className="bg-[#fbfaf5] border border-[#e4e0d7] rounded-3xl p-6 md:p-8 shadow-sm flex-1 flex flex-col justify-between">
                                                <div>
                                                    {/* QUIZ HEADER & PROGRESS */}
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-[#e4e0d7]">
                                                        <div>
                                                            <div className="text-[11px] font-extrabold text-[#2b6e76] uppercase tracking-wider flex items-center gap-1.5">
                                                                <Sparkles size={14} />
                                                                Questionário de Suitability ARVO
                                                            </div>
                                                            <div className="text-xs font-bold text-[#667085] mt-0.5">
                                                                Pergunta {quizQuestionIndex + 1} de {SUITABILITY_QUESTIONS.length}
                                                            </div>
                                                        </div>

                                                        {/* DOTS DE PROGRESSO */}
                                                        <div className="flex items-center gap-1.5">
                                                            {SUITABILITY_QUESTIONS.map((q, idx) => {
                                                                const isCurrent = idx === quizQuestionIndex
                                                                const isAnswered = Boolean(formData[q.name])
                                                                return (
                                                                    <button
                                                                        key={idx}
                                                                        type="button"
                                                                        onClick={() => setQuizQuestionIndex(idx)}
                                                                        title={`Ir para pergunta ${idx + 1}`}
                                                                        className={`h-2.5 rounded-full transition-all duration-300 ${
                                                                            isCurrent 
                                                                                ? "w-8 bg-[#2b6e76]" 
                                                                                : isAnswered 
                                                                                    ? "w-2.5 bg-[#4fa080]" 
                                                                                    : "w-2.5 bg-[#e4e0d7]"
                                                                        }`}
                                                                    />
                                                                )
                                                            })}
                                                        </div>
                                                    </div>

                                                    {/* PERGUNTA */}
                                                    <div className="my-6">
                                                        <h3 className="text-xl md:text-2xl font-bold text-[#123044] leading-snug">
                                                            {currentQuizQ.title}
                                                        </h3>
                                                        <p className="text-xs text-[#667085] mt-1.5">
                                                            {currentQuizQ.subtitle}
                                                        </p>
                                                    </div>

                                                    {/* ALTERNATIVAS CLICÁVEIS */}
                                                    <div className="grid gap-3 my-4">
                                                        {currentQuizQ.options.map((opt) => {
                                                            const isSelected = formData[currentQuizQ.name] === opt.text
                                                            return (
                                                                <button
                                                                    key={opt.letter}
                                                                    type="button"
                                                                    onClick={() => handleSelectQuizOption(currentQuizQ.name, opt.text)}
                                                                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between gap-4 transition-all duration-200 ${
                                                                        isSelected
                                                                            ? "bg-[#123044] text-white border-[#123044] shadow-md transform scale-[1.01]"
                                                                            : "bg-[#fffdf8] hover:bg-[#f2efe6] text-[#123044] border-[#e4e0d7] hover:border-[#2b6e76]"
                                                                    }`}
                                                                >
                                                                    <div className="flex items-center gap-3.5">
                                                                        <span className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 transition-colors ${
                                                                            isSelected
                                                                                ? "bg-white text-[#123044]"
                                                                                : "bg-[#e8f1ed] text-[#2b6e76]"
                                                                        }`}>
                                                                            {opt.letter}
                                                                        </span>
                                                                        <span className="text-sm font-semibold leading-relaxed">
                                                                            {opt.text}
                                                                        </span>
                                                                    </div>
                                                                    {isSelected && (
                                                                        <CheckCircle2 size={20} className="text-[#4fa080] shrink-0" />
                                                                    )}
                                                                </button>
                                                            )
                                                        })}
                                                    </div>
                                                </div>

                                                {/* QUIZ CONTROLS */}
                                                <div className="flex items-center justify-between pt-6 border-t border-[#e4e0d7] mt-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => setQuizQuestionIndex(prev => Math.max(0, prev - 1))}
                                                        disabled={quizQuestionIndex === 0}
                                                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#667085] hover:text-[#123044] disabled:opacity-20 disabled:pointer-events-none transition-colors"
                                                    >
                                                        <ArrowLeft size={14} />
                                                        Pergunta Anterior
                                                    </button>

                                                    {quizQuestionIndex < SUITABILITY_QUESTIONS.length - 1 ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => setQuizQuestionIndex(prev => prev + 1)}
                                                            disabled={!formData[currentQuizQ.name]}
                                                            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#2b6e76] hover:bg-[#1f565d] disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                                                        >
                                                            Próxima Pergunta
                                                            <ArrowRight size={14} />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowQuizResult(true)}
                                                            disabled={!formData[currentQuizQ.name]}
                                                            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#123044] hover:bg-[#1c4460] disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                                                        >
                                                            Ver Resultado do Perfil
                                                            <Sparkles size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            /* CARD DO RESULTADO DO PERFIL */
                                            <div className="bg-[#fbfaf5] border border-[#e4e0d7] rounded-3xl p-8 shadow-sm flex-1 flex flex-col justify-between">
                                                <div className="space-y-6">
                                                    <div className="text-center max-w-xl mx-auto">
                                                        <div className="w-16 h-16 rounded-2xl bg-[#2b6e76] text-white flex items-center justify-center mx-auto mb-4 shadow-md">
                                                            <Compass size={32} />
                                                        </div>
                                                        <div className="text-xs font-bold text-[#2b6e76] uppercase tracking-widest mb-1">
                                                            Perfil de Investidor Identificado
                                                        </div>
                                                        <h3 className="text-3xl md:text-4xl font-extrabold text-[#123044]">
                                                            {profileMetaMap[calculatedCurrentProfile]?.label || calculatedCurrentProfile}
                                                        </h3>
                                                        <p className="text-sm text-[#667085] mt-2 leading-relaxed">
                                                            {profileMetaMap[calculatedCurrentProfile]?.desc}
                                                        </p>
                                                    </div>

                                                    {/* RESUMO DAS RESPOSTAS */}
                                                    <div className="bg-[#fffdf8] border border-[#e4e0d7] rounded-2xl p-5">
                                                        <div className="flex items-center justify-between mb-3 border-b border-[#e4e0d7] pb-2">
                                                            <span className="text-xs font-bold text-[#123044]">Suas 6 Respostas de Suitability</span>
                                                            <button 
                                                                type="button" 
                                                                onClick={() => { setShowQuizResult(false); setQuizQuestionIndex(0); }}
                                                                className="text-[11px] font-bold text-[#2b6e76] hover:underline flex items-center gap-1"
                                                            >
                                                                <RotateCcw size={12} /> Refazer Questionário
                                                            </button>
                                                        </div>
                                                        <div className="grid sm:grid-cols-2 gap-2 text-xs">
                                                            {SUITABILITY_QUESTIONS.map((q, idx) => (
                                                                <div key={q.id} className="p-2.5 rounded-xl bg-[#f6f4ef] border border-[#e4e0d7]/70">
                                                                    <div className="text-[10px] font-bold text-[#667085] truncate">{idx + 1}. {q.title}</div>
                                                                    <div className="font-semibold text-[#123044] truncate mt-0.5">{formData[q.name] || "Não respondido"}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="pt-6 border-t border-[#e4e0d7] flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                                                    <button
                                                        type="button"
                                                        onClick={() => { setShowQuizResult(false); setQuizQuestionIndex(0); }}
                                                        className="px-4 py-2 text-xs font-bold text-[#667085] hover:text-[#123044] transition-colors"
                                                    >
                                                        ← Alterar Respostas
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={goNext}
                                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#123044] hover:bg-[#1d4b6b] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5"
                                                    >
                                                        Finalizar Análise & Salvar Perfil
                                                        <ArrowRightCircle size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    /* ======================================================== */
                                    /* ETAPAS 1 A 6: FORMULÁRIO PADRÃO                         */
                                    /* ======================================================== */
                                    <>
                                        <div className="grid md:grid-cols-2 gap-6 my-8">
                                            {step.fields.map((field) => {
                                                const val = formData[field.name] || ""
                                                
                                                return (
                                                    <div key={field.name} className={`space-y-2 ${field.type === 'radio' ? 'md:col-span-2' : ''}`}>
                                                        <label className="text-xs font-bold text-[#123044] flex items-center gap-1.5">
                                                            {field.label}
                                                        </label>

                                                        {field.type === "currency" && (
                                                            <div className="relative">
                                                                <input 
                                                                    type="text" 
                                                                    placeholder={field.placeholder || "R$ 0,00"}
                                                                    value={val}
                                                                    onChange={(e) => handleInputChange(field.name, formatCurrency(e.target.value))}
                                                                    className="w-full bg-[#f6f4ef] border border-[#e4e0d7] rounded-xl px-4 py-3 text-sm text-[#123044] font-medium placeholder:text-[#a09e99] focus:outline-none focus:border-[#4fa080] focus:ring-1 focus:ring-[#4fa080] transition-all"
                                                                />
                                                            </div>
                                                        )}

                                                        {field.type === "number" && (
                                                            <input 
                                                                type="number" 
                                                                placeholder={field.placeholder}
                                                                value={val}
                                                                onChange={(e) => handleInputChange(field.name, e.target.value)}
                                                                className="w-full bg-[#f6f4ef] border border-[#e4e0d7] rounded-xl px-4 py-3 text-sm text-[#123044] font-medium placeholder:text-[#a09e99] focus:outline-none focus:border-[#4fa080] focus:ring-1 focus:ring-[#4fa080] transition-all"
                                                            />
                                                        )}

                                                        {field.type === "text" && (
                                                            <input 
                                                                type="text" 
                                                                placeholder={field.placeholder}
                                                                value={val}
                                                                onChange={(e) => handleInputChange(field.name, e.target.value)}
                                                                className="w-full bg-[#f6f4ef] border border-[#e4e0d7] rounded-xl px-4 py-3 text-sm text-[#123044] font-medium placeholder:text-[#a09e99] focus:outline-none focus:border-[#4fa080] focus:ring-1 focus:ring-[#4fa080] transition-all"
                                                            />
                                                        )}

                                                        {field.type === "select" && (
                                                            <select 
                                                                value={val}
                                                                onChange={(e) => handleInputChange(field.name, e.target.value)}
                                                                className="w-full bg-[#f6f4ef] border border-[#e4e0d7] rounded-xl px-4 py-3 text-sm text-[#123044] font-medium focus:outline-none focus:border-[#4fa080] focus:ring-1 focus:ring-[#4fa080] transition-all"
                                                            >
                                                                <option value="">Selecione uma opção...</option>
                                                                {field.options?.map(opt => (
                                                                    <option key={opt} value={opt}>{opt}</option>
                                                                ))}
                                                            </select>
                                                        )}

                                                        {field.type === "radio" && (
                                                            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                                                                {field.options?.map(opt => (
                                                                    <button
                                                                        type="button"
                                                                        key={opt}
                                                                        onClick={() => handleInputChange(field.name, opt)}
                                                                        className={`px-4 py-3 text-xs font-semibold rounded-xl border text-left transition-all ${
                                                                            val === opt 
                                                                                ? "bg-[#123044] text-white border-transparent shadow-sm" 
                                                                                : "bg-[#f6f4ef] text-[#123044] border-[#e4e0d7] hover:bg-[#e4e0d7]/60"
                                                                        }`}
                                                                    >
                                                                        {opt}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            })}

                                            {/* ======================================================== */}
                                            {/* ETAPA 1: GASTOS PERSONALIZADOS NO MESMO GRID DAS OUTRAS */}
                                            {/* ======================================================== */}
                                            {current === 0 && customExpenses.map((expense) => (
                                                <div key={expense.id} className="space-y-2">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                                            <span className="text-xs font-bold text-[#123044] shrink-0">Gastos com</span>
                                                            <input
                                                                type="text"
                                                                placeholder="Lazer, Educação, etc."
                                                                value={expense.name}
                                                                onChange={(e) => handleUpdateCustomExpense(expense.id, "name", e.target.value)}
                                                                className="text-xs font-bold text-[#123044] bg-transparent border-b border-dashed border-[#123044]/30 hover:border-[#4fa080] focus:border-[#4fa080] focus:outline-none px-1 py-0.5 w-full transition-colors placeholder:font-normal placeholder:text-[#a09e99]"
                                                                autoFocus={!expense.name}
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveCustomExpense(expense.id)}
                                                            className="text-[#98a2b3] hover:text-[#b91c1c] text-[11px] font-medium flex items-center gap-1 hover:underline transition-colors shrink-0 cursor-pointer"
                                                            title="Remover este gasto"
                                                        >
                                                            <Trash2 size={12} />
                                                            Remover
                                                        </button>
                                                    </div>

                                                    <div className="relative">
                                                        <input 
                                                            type="text" 
                                                            placeholder="R$ 0,00"
                                                            value={expense.value}
                                                            onChange={(e) => handleUpdateCustomExpense(expense.id, "value", formatCurrency(e.target.value))}
                                                            className="w-full bg-[#f6f4ef] border border-[#e4e0d7] rounded-xl px-4 py-3 text-sm text-[#123044] font-medium placeholder:text-[#a09e99] focus:outline-none focus:border-[#4fa080] focus:ring-1 focus:ring-[#4fa080] transition-all"
                                                        />
                                                    </div>
                                                </div>
                                            ))}

                                            {/* BOTÃO + ADICIONAR OUTRO GASTO COMO CAIXA NO GRID */}
                                            {current === 0 && (
                                                <div className="space-y-2 flex flex-col justify-end">
                                                    <label className="text-xs font-bold text-transparent select-none hidden md:block">
                                                        Novo Gasto
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={handleAddCustomExpense}
                                                        className="w-full h-[46px] bg-transparent hover:bg-[#e8f1ed]/50 border-2 border-dashed border-[#d8d3c5] hover:border-[#4fa080] text-[#123044] hover:text-[#1f674f] text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                                                    >
                                                        <Plus size={15} />
                                                        Adicionar Outro Gasto
                                                    </button>
                                                </div>
                                            )}

                                            {/* TOTALIZADOR DE GASTOS DA ETAPA 1 */}
                                            {current === 0 && (
                                                <div className="md:col-span-2 p-4 rounded-2xl bg-[#e8f1ed]/50 border border-[#4fa080]/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-2">
                                                    <div className="text-xs text-[#123044] font-bold flex items-center gap-1.5">
                                                        <DollarSign size={15} className="text-[#1f674f]" />
                                                        Total Estimado de Gastos Mensais:
                                                    </div>
                                                    <div className="text-base font-extrabold text-[#1f674f]">
                                                        {totalExpensesFormatted}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* WHAT WE DELIVER / ANALYSIS */}
                                        <div className="mt-8 pt-6 border-t border-[#e4e0d7]">
                                            <div className="text-[11px] font-extrabold text-[#667085] uppercase tracking-wider mb-3">
                                                Entregáveis da Etapa {current + 1}
                                            </div>
                                            <div className="grid sm:grid-cols-2 gap-2.5">
                                                {step.analysis.map((an, i) => (
                                                    <div key={i} className="flex items-center gap-2 text-xs font-medium text-[#123044] bg-[#f6f4ef]/80 p-2.5 rounded-xl border border-[#e4e0d7]/70">
                                                        <Check size={14} className="text-[#4fa080] shrink-0" />
                                                        <span>{an}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* BOTTOM ACTIONS (PARA ETAPAS 1 A 6) */}
                        {current < 6 && (
                            <div className="flex items-center justify-between mt-auto pt-8 border-t border-[#e4e0d7]">
                                <button
                                    onClick={() => setCurrent(prev => Math.max(0, prev - 1))}
                                    disabled={current === 0}
                                    className="px-5 py-2.5 text-xs font-bold text-[#667085] hover:text-[#123044] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                                >
                                    Voltar Etapa
                                </button>

                                <button
                                    onClick={goNext}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#123044] hover:bg-[#1e4866] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all transform hover:-translate-y-0.5"
                                >
                                    Avançar para Etapa {current + 2}
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        )}
                    </main>
                </section>
            </div>
        </div>
    )
}
