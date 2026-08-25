"use client"

import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Check, ArrowRight, ArrowLeft, ArrowRightCircle, Target, 
    Wallet, ShieldCheck, HeartPulse, Building2, Landmark, 
    Compass, Loader2, CheckCircle2, RotateCcw, Plus, Trash2, 
    DollarSign, AlertCircle, CloudCheck, CloudOff, Info, 
    HelpCircle, Shield, ArrowUpRight
} from "lucide-react"
import PlanoArvoDashboard from "@/components/plano-arvo-dashboard"
import { saveJornadaProgress, getJornadaProgress } from "./actions"
import { calculateInvestorProfile, getSuitabilityDiagnostic } from "@/lib/profile-calculator"

// ─── TYPES & FIELD DEFINITIONS ────────────────────────────────────────────────
export type FieldDef = {
    name: string
    label: string
    type: "text" | "number" | "currency" | "select" | "radio"
    options?: string[]
    placeholder?: string
    required?: boolean
    helpText?: string
    min?: number
    max?: number
    conditional?: (data: Record<string, string>) => boolean
}

export type CustomExpense = {
    id: string
    name: string
    value: string
}

export type StepStatus = "not_started" | "in_progress" | "completed" | "has_error"

export const SUITABILITY_QUESTIONS = [
    {
        id: 0,
        name: "perfil_experiencia",
        title: "Qual a sua experiência prática com investimentos no mercado?",
        subtitle: "Selecione a opção mais aderente ao seu histórico até hoje:",
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
        title: "Se seus investimentos oscilassem negativamente 15% em um mês de forte estresse:",
        subtitle: "Avalie como você costuma reagir emocionalmente a variações de mercado:",
        options: [
            { letter: "A", text: "Ficaria desconfortável e resgataria os recursos imediatamente para não arriscar" },
            { letter: "B", text: "Ficaria apreensivo e transferiria uma parte para títulos pós-fixados mais conservadores" },
            { letter: "C", text: "Compreenderia que faz parte do ciclo natural de mercado e manteria a rota traçada" },
            { letter: "D", text: "Identificaria como oportunidade tática de compra e aportaria recursos adicionais" }
        ]
    },
    {
        id: 2,
        name: "perfil_objetivo",
        title: "Qual é a prioridade estratégica principal para o seu patrimônio?",
        subtitle: "Defina o mandato que deve orientar a alocação dos seus ativos:",
        options: [
            { letter: "A", text: "Preservação absoluta do capital e liquidez imediata (sem tolerância a oscilações)" },
            { letter: "B", text: "Superar a inflação com baixo risco e geração de renda previsível (estabilidade)" },
            { letter: "C", text: "Crescimento patrimonial de longo prazo aceitando oscilações moderadas de mercado" },
            { letter: "D", text: "Maximizar o retorno acumulado no longo prazo aceitando volatilidade elevada" }
        ]
    },
    {
        id: 3,
        name: "perfil_horizonte",
        title: "Por quanto tempo você pretende manter a maior parte do capital investida?",
        subtitle: "O horizonte temporal determina a capacidade de carregar ativos com maior potencial de retorno:",
        options: [
            { letter: "A", text: "Menos de 1 ano (necessidade iminente de liquidez ou projetos imediatos)" },
            { letter: "B", text: "De 1 a 3 anos (horizonte de curto a médio prazo)" },
            { letter: "C", text: "De 3 a 7 anos (médio/longo prazo estrutural)" },
            { letter: "D", text: "Mais de 7 a 10 anos (foco exclusivo em independência financeira e longo prazo)" }
        ]
    },
    {
        id: 4,
        name: "perfil_liquidez",
        title: "Qual parcela do patrimônio investido você pode necessitar resgatar em 12 meses?",
        subtitle: "Isso define a necessidade de liquidez imediata versus ativos com prazos de maturação:",
        options: [
            { letter: "A", text: "Mais de 50% do total investido (alta demanda de liquidez de curto prazo)" },
            { letter: "B", text: "Entre 20% e 50% do total investido" },
            { letter: "C", text: "Entre 10% e 20% do total investido" },
            { letter: "D", text: "Menos de 10% (minha reserva de emergência já está 100% separada e estruturada)" }
        ]
    },
    {
        id: 5,
        name: "perfil_perdas",
        title: "Qual postura melhor reflete sua relação entre risco e retorno esperado?",
        subtitle: "Sua disposição em aceitar oscilações para capturar prêmios de risco:",
        options: [
            { letter: "A", text: "Não admito variações nominais negativas em nenhuma circunstância" },
            { letter: "B", text: "Aceito pequenas oscilações temporárias para buscar rentabilidade acima do CDI" },
            { letter: "C", text: "Aceito oscilações moderadas de médio prazo para capturar ganho real expressivo" },
            { letter: "D", text: "Busco rentabilidade máxima e tolero quedas severas de curto prazo sem desviar da meta" }
        ]
    }
]

export const PLAN_DATA: Array<{
    title: string
    short: string
    status: string
    desc: string
    objective: string
    delivery: string
    signal: string
    icon: React.ReactNode
    fields: FieldDef[]
    analysis: string[]
}> = [
    {
        title: "Raio-X Financeiro & Fluxo de Caixa",
        short: "Entradas, Gastos e Reserva",
        status: "Marco 1 da Rota",
        desc: "Diagnóstico completo das suas receitas, despesas essenciais, taxa de comprometimento e dimensionamento da reserva de emergência.",
        objective: "Criar clareza sobre suas entradas líquidas, padrão de gastos e fluxo de caixa mensal.",
        delivery: "Diagnóstico de capacidade de aporte e meta técnica de reserva de emergência.",
        signal: "Você sabe exatamente quanto pode poupar e investir sem comprometer sua segurança.",
        icon: <Wallet className="text-[#1f674f] shrink-0" size={24} />,
        fields: [
            { name: "salarioLiquido", label: "Salário / Pró-labore Líquido Mensal", type: "currency", placeholder: "R$ 0,00", required: true, helpText: "Valor líquido que entra na conta após descontos em folha." },
            { name: "tipoVinculo", label: "Tipo de Vínculo Profissional", type: "select", options: ["CLT", "PJ", "Autônomo", "Funcionário Público", "Empresário", "Misto"], required: true, helpText: "Determina o fator de meses recomendado para a reserva (6m para estáveis, 12m para renda variável)." },
            { name: "rendaVariavel", label: "Renda Variável Média Mensal (Opcional)", type: "currency", placeholder: "R$ 0,00", required: false, helpText: "Comissões, bônus, dividendos ou receitas complementares." },
            { name: "gastoMoradia", label: "Gastos com Moradia", type: "currency", placeholder: "R$ 0,00", required: true, helpText: "Aluguel, condomínio, IPTU, energia, água, internet e manutenção." },
            { name: "gastoAlimentacao", label: "Gastos com Alimentação", type: "currency", placeholder: "R$ 0,00", required: true, helpText: "Supermercado, feira e refeições habituais." },
            { name: "gastoTransporte", label: "Gastos com Transporte", type: "currency", placeholder: "R$ 0,00", required: true, helpText: "Combustível, seguro, manutenção de veículo ou transporte público." },
            { name: "gastoSaude", label: "Gastos com Saúde", type: "currency", placeholder: "R$ 0,00", required: true, helpText: "Plano de saúde, consultas, farmácia e terapias regulares." },
            { name: "reservaAtual", label: "Reserva de Emergência Guardada", type: "currency", placeholder: "R$ 0,00", required: true, helpText: "Valor disponível em instrumentos de liquidez diária exclusiva para emergências." },
            { name: "localReserva", label: "Onde a reserva está aplicada?", type: "select", options: ["CDB Liquidez Diária", "Tesouro Selic", "Poupança", "Conta Corrente", "Outro", "Não possuo reserva"], required: true, helpText: "O ideal são instrumentos com liquidez D+0/D+1 e baixo risco de crédito." },
            { name: "possuiDividas", label: "Possui dívidas ativas ou financiamentos?", type: "radio", options: ["Não possuo dívidas", "Sim, possuo"], required: true },
            { name: "tipoDivida", label: "Tipo principal de dívida", type: "select", options: ["Financiamento Imobiliário", "Financiamento de Veículo", "Empréstimo Consignado", "Cartão de Crédito / Rotativo", "Empréstimo Pessoal", "Outro"], required: true, conditional: (d) => d.possuiDividas === "Sim, possuo" },
            { name: "totalDividas", label: "Saldo devedor total acumulado", type: "currency", placeholder: "R$ 0,00", required: true, conditional: (d) => d.possuiDividas === "Sim, possuo", helpText: "Valor total para quitação hoje." },
            { name: "parcelasDividas", label: "Parcela mensal das dívidas", type: "currency", placeholder: "R$ 0,00", required: true, conditional: (d) => d.possuiDividas === "Sim, possuo", helpText: "Comprometimento mensal com amortizações e juros." }
        ],
        analysis: [
            "Taxa de Comprometimento da Renda Líquida",
            "Cálculo Técnico da Reserva de Emergência (6 ou 12 meses)",
            "Capacidade Real de Investimento Mensal",
            "Mapeamento do Impacto das Dívidas no Fluxo de Caixa"
        ]
    },
    {
        title: "Proteção & Gestão de Riscos Pessoais",
        short: "Coberturas e Vulnerabilidades",
        status: "Marco 2 da Rota",
        desc: "Mapeamento das vulnerabilidades financeiras contra imprevistos graves (invalidez, perda de renda e proteção de dependentes).",
        objective: "Identificar exposições a riscos biológicos e estruturar blindagem do padrão de vida.",
        delivery: "Diagnóstico de coberturas necessárias e capital segurado sugerido.",
        signal: "Riscos graves estão mitigados sem gerar custos excessivos de apólices desnecessárias.",
        icon: <HeartPulse className="text-[#1f674f] shrink-0" size={24} />,
        fields: [
            { name: "idade", label: "Sua Idade Atual", type: "number", placeholder: "Ex: 35", required: true, min: 18, max: 100 },
            { name: "estadoCivil", label: "Estado Civil", type: "select", options: ["Solteiro", "Casado / União Estável", "Divorciado", "Viúvo"], required: true },
            { name: "dependentes", label: "Número de Dependentes Financeiros", type: "number", placeholder: "Ex: 2", required: true, min: 0, max: 20, helpText: "Filhos, cônjuge sem renda, pais ou familiares dependentes." },
            { name: "principalProvedor", label: "Qual seu papel no sustento familiar?", type: "select", options: ["Principal provedor da casa", "Divido o sustento igualmente", "Não sou o principal provedor"], required: true },
            { name: "tipoMoradia", label: "Tipo de Moradia", type: "select", options: ["Própria quitada", "Própria financiada", "Alugada", "Cedida / Familiar"], required: true },
            { name: "profissaoRisco", label: "Nível de Risco Ocupacional", type: "select", options: ["Baixo (Escritório / Administrativo)", "Médio (Operacional / Engenharia / Trânsito)", "Alto (Atividade de risco / Insalubre)"], required: true },
            { name: "planoSaude", label: "Possui Plano de Saúde?", type: "select", options: ["Sim - Cobertura Empresarial", "Sim - Individual / Familiar", "Não (Uso exclusivo do SUS)"], required: true },
            { name: "possuiSeguroVida", label: "Possui Seguro de Vida ativo?", type: "radio", options: ["Não possuo", "Sim, possuo"], required: true },
            { name: "seguroVidaAtual", label: "Capital Segurado de Vida contratado", type: "currency", placeholder: "R$ 0,00", required: true, conditional: (d) => d.possuiSeguroVida === "Sim, possuo", helpText: "Indenização prevista em caso de morte ou invalidez." },
            { name: "seguroResidencial", label: "Possui Seguro Residencial?", type: "radio", options: ["Sim", "Não"], required: false }
        ],
        analysis: [
            "Matriz de Vulnerabilidade Familiar (Morte e Invalidez)",
            "Cálculo de Capital Segurado Temporário Necessário",
            "Adequação de Cobertura de Saúde e Risco de DIT",
            "Proteção Patrimonial contra Passivos Inesperados"
        ]
    },
    {
        title: "Construção de Patrimônio & Metas",
        short: "Objetivos, Aportes e Prazos",
        status: "Marco 3 da Rota",
        desc: "Alinhamento das metas financeiras de médio e longo prazo com o ritmo dos seus aportes mensais.",
        objective: "Conectar sua capacidade de poupança mensal a objetivos concretos de vida.",
        delivery: "Cronograma de metas com alocação e cálculo de viabilidade temporal.",
        signal: "Cada aporte mensal tem destino e meta quantitativa definidos.",
        icon: <Target className="text-[#1f674f] shrink-0" size={24} />,
        fields: [
            { name: "patrimonioInvestido", label: "Patrimônio Total Investido Atual", type: "currency", placeholder: "R$ 0,00", required: true, helpText: "Soma de todos os seus investimentos atuais (Renda Fixa, Ações, FIIs, Fundos), excluindo a reserva de emergência." },
            { name: "aporteMensal", label: "Aporte Mensal Pretendido", type: "currency", placeholder: "R$ 0,00", required: true, helpText: "Valor que você planeja destinar mensalmente para investimentos." },
            { name: "objetivoPrincipal", label: "Principal Objetivo Patrimonial (além da aposentadoria)", type: "select", options: ["Preservação de Capital", "Compra de Imóvel / Bem de Alto Valor", "Educação dos Filhos / Família", "Expansão de Negócio / Carreira", "Independência Financeira Antecipada"], required: true },
            { name: "valorObjetivoPrincipal", label: "Valor Alvo Estimado para essa Meta", type: "currency", placeholder: "R$ 0,00", required: true, helpText: "Custo estimado para atingir essa meta em valores de hoje." },
            { name: "prazoPrincipalObjetivo", label: "Prazo Desejado para essa Meta", type: "select", options: ["Curto prazo (até 2 anos)", "Médio prazo (2 a 5 anos)", "Longo prazo (5 a 10 anos)", "Mais de 10 anos"], required: true },
            { name: "acumuladoObjetivoPrincipal", label: "Valor Já Guardado Especificamente para essa Meta (Opcional)", type: "currency", placeholder: "R$ 0,00", required: false },
            { name: "prioridadeAportes", label: "Prioridade Imediata dos Próximos Aportes", type: "select", options: ["Completar Reserva de Emergência", "Acelerar Meta de Médio Prazo", "Acelerar Aposentadoria", "Diversificação Internacional"], required: true }
        ],
        analysis: [
            "Viabilidade Matemática da Meta Principal vs. Aporte",
            "Efeito dos Juros Compostos no Horizonte Estipulado",
            "Taxa de Poupança vs. Renda Líquida Total",
            "Plano de Distribuição dos Novos Aportes"
        ]
    },
    {
        title: "Futuro & Aposentadoria",
        short: "Independência Financeira",
        status: "Marco 4 da Rota",
        desc: "Projeção de acumulação do capital necessário para sustentar seu padrão de vida desejado na aposentadoria (Regra dos 4%).",
        objective: "Calcular o capital de independência financeira e medir o gap temporal.",
        delivery: "Projeção de acumulação, gap de independência e aporte ideal necessário.",
        signal: "Você tem um plano com data-alvo e aporte calibrado para sua meta de renda.",
        icon: <Landmark className="text-[#1f674f] shrink-0" size={24} />,
        fields: [
            { name: "idadeIf", label: "Idade Desejada para Aposentadoria / Transição", type: "number", placeholder: "Ex: 60", required: true, min: 25, max: 100, helpText: "Idade em que você planeja parar ou ter independência para trabalhar por escolha." },
            { name: "rendaAposentadoria", label: "Renda Mensal Desejada na Aposentadoria (Valores de Hoje)", type: "currency", placeholder: "R$ 0,00", required: true, helpText: "Renda líquida mensal pretendida a poder de compra de hoje." },
            { name: "expectativaInss", label: "Pretende contar com benefício do INSS / RPPS?", type: "select", options: ["Sim, pretendo contar", "Parcialmente (apenas piso/teto base)", "Não pretendo depender do INSS"], required: true },
            { name: "valorInss", label: "Estimativa Mensal de Benefício do INSS", type: "currency", placeholder: "R$ 0,00", required: true, conditional: (d) => d.expectativaInss !== "Não pretendo depender do INSS", helpText: "Valor bruto estimado de aposentadoria pública." },
            { name: "possuiPrevidencia", label: "Possui Previdência Privada contratada?", type: "select", options: ["Não possuo previdência", "PGBL", "VGBL", "Ambos (PGBL + VGBL)"], required: true },
            { name: "saldoPrevidencia", label: "Saldo Acumulado em Previdência (Opcional)", type: "currency", placeholder: "R$ 0,00", required: false, conditional: (d) => Boolean(d.possuiPrevidencia && d.possuiPrevidencia !== "Não possuo previdência") }
        ],
        analysis: [
            "Capital Necessário pela Regra dos 4% (300x custo mensal)",
            "Projeção Composta com a Carteira da Bússola",
            "Cálculo do Gap Projetado até a Idade Alvo",
            "Aporte Mensal Ideal para Cobertura Plena da Meta"
        ]
    },
    {
        title: "Inteligência Fiscal & Eficiência Tributária",
        short: "IR, Benefício PGBL e Isenções",
        status: "Marco 5 da Rota",
        desc: "Mapeamento da eficiência tributária sobre seus rendimentos e investimentos para reter mais patrimônio de forma 100% legal.",
        objective: "Identificar atalhos fiscais legítimos e evitar perdas silenciosas com tributação ineficiente.",
        delivery: "Diagnóstico de elegibilidade a PGBL e oportunidades de ativos isentos.",
        signal: "Sua estrutura fiscal está otimizada para o seu regime de renda.",
        icon: <ShieldCheck className="text-[#1f674f] shrink-0" size={24} />,
        fields: [
            { name: "declaracaoIr", label: "Modelo de Declaração do Imposto de Renda", type: "select", options: ["Completa (por deduções legais)", "Simplificada (desconto padrão de 20%)", "Isento", "Não sei informar"], required: true, helpText: "A declaração completa é pré-requisito legal para deduzir até 12% da renda bruta via PGBL." },
            { name: "faixaRenda", label: "Faixa de Renda Tributável Anual", type: "select", options: ["Isento de IRPF", "Faixa Intermediária (7,5% a 22,5%)", "Alíquota Máxima (27,5%)"], required: true },
            { name: "tipoRendimento", label: "Origem Principal dos seus Rendimentos", type: "select", options: ["Salário CLT", "Pró-labore", "Distribuição de Lucros / Dividendos", "Autônomo (Carnê-Leão)", "Misto (CLT + PJ/Outros)"], required: true },
            { name: "possuiPj", label: "Possui Empresa ou CNPJ Ativo?", type: "select", options: ["Não possuo empresa", "MEI", "Simples Nacional", "Lucro Presumido", "Lucro Real"], required: true },
            { name: "gastosDedutiveis", label: "Possui despesas dedutíveis relevantes?", type: "select", options: ["Sim - Despesas expressivas com saúde/educação/dependentes", "Sim - Volume moderado", "Não / Despesas baixas"], required: true, helpText: "Despesas médicas, instrução própria/dependentes e previdência PGBL." }
        ],
        analysis: [
            "Elegibilidade e Oportunidade de Diferimento Fiscal via PGBL (até 12%)",
            "Eficiência da Renda Tributável vs. Isenções (LCI/LCA/CRI/CRA/Debêntures)",
            "Diagnóstico de Compensação de Perdas em Renda Variável",
            "Mapeamento de Eficiência Societária e Distribuição de Lucros"
        ]
    },
    {
        title: "Legado & Estrutura Sucessória",
        short: "Regime de Bens e Transmissão",
        status: "Marco 6 da Rota",
        desc: "Organização preventiva da sucessão patrimonial para proteger herdeiros, mitigar custos de inventário e evitar conflitos.",
        objective: "Mapear a divisão legal de bens e estruturar transferência de patrimônio com liquidez.",
        delivery: "Diagnóstico sucessório, impacto de ITCMD e diretrizes de blindagem familiar.",
        signal: "Sua família possui diretrizes claras e liquidez estruturada para processos sucessórios.",
        icon: <Building2 className="text-[#1f674f] shrink-0" size={24} />,
        fields: [
            { name: "regimeBens", label: "Regime de Bens do Casamento ou União Estável", type: "select", options: ["Comunhão Parcial de Bens", "Comunhão Universal de Bens", "Separação Total de Bens", "Participação Final nos Aquestos", "Solteiro / Não se aplica"], required: true, helpText: "Define a meação patrimonial e os direitos concorrentes do cônjuge na herança." },
            { name: "pactoAntenupcial", label: "Possui Pacto Antenupcial ou Escritura de União Estável?", type: "radio", options: ["Sim", "Não", "Não se aplica"], required: false },
            { name: "filhosMenores", label: "Possui Filhos ou Dependentes Menores de Idade?", type: "radio", options: ["Sim, possuo", "Não possuo"], required: true, helpText: "A presença de herdeiros menores exige inventário judicial e tutela patrimonial." },
            { name: "empresaFamiliar", label: "Possui Participação em Empresa Familiar ou Sociedade Fechada?", type: "radio", options: ["Sim, possuo", "Não possuo"], required: true, helpText: "Exige alinhamento com contrato social e acordo de sócios." },
            { name: "possuiTestamento", label: "Possui Testamento Formal ou Diretivas de Vontade?", type: "radio", options: ["Sim", "Não"], required: true, helpText: "Permite dispor livremente de até 50% da parte disponível da herança." }
        ],
        analysis: [
            "Mapeamento de Meação vs. Herança por Classe de Ativo",
            "Estimativa de Liquidez para ITCMD (2% a 8%) e Custas de Inventário",
            "Uso Estratégico de Previdência VGBL (Transmissão fora de inventário)",
            "Checklist de Governança e Dossiê Financeiro Familiar"
        ]
    },
    {
        title: "Suitability & Tolerância ao Risco",
        short: "Seu Perfil de Investidor",
        status: "Marco 7 da Rota",
        desc: "Avaliação técnica das 4 dimensões de suitability para calibrar a tolerância a risco e definir sua carteira ideal na Bússola ARVO.",
        objective: "Determinar seu perfil oficial de alocação de ativos.",
        delivery: "Diagnóstico dimensional e calibração das carteiras da Bússola.",
        signal: "Sua carteira reflete sua tolerância emocional, horizonte de tempo e necessidade de liquidez.",
        icon: <Compass className="text-[#1f674f] shrink-0" size={24} />,
        fields: [] as FieldDef[],
        analysis: [
            "Score Dimensional de Tolerância Emocional ao Risco",
            "Classificação do Perfil Oficial ARVO (Abrigo, Ritmo, Visão ou Oceano)",
            "Calibração de Tolerância a Volatilidade na Bússola",
            "Alinhamento com as Normas de Suitability da CVM"
        ]
    }
]

export const ROUTE_PROGRESS_DESCRIPTIONS = [
    "Marco 1: Mapeie suas entradas e gastos essenciais. É o ponto de partida onde todo o plano financeiro se apoia.",
    "Marco 2: Identifique vulnerabilidades pessoais e familiares para isolar riscos de perda de renda ou despesas graves.",
    "Marco 3: Estruture suas metas patrimoniais e alinhe o valor e o prazo com a sua capacidade de aporte mensal.",
    "Marco 4: Calcule o patrimônio necessário para a aposentadoria sustentável e descubra se há gap na projeção.",
    "Marco 5: Avalie sua eficiência no Imposto de Renda e analise a oportunidade de diferimento fiscal via PGBL.",
    "Marco 6: Organize a estrutura patrimonial e familiar para mitigar custos de ITCMD e burocracias de inventário.",
    "Marco 7: Responda as 6 perguntas de suitability para calibrar sua tolerância a risco e sua Carteira da Bússola."
]

// ─── VALIDATION ENGINE ────────────────────────────────────────────────────────
export function validateStepFields(
    stepIndex: number, 
    formData: Record<string, string>
): { isValid: boolean; errors: Record<string, string>; missingFields: string[] } {
    const errors: Record<string, string> = {}
    const missingFields: string[] = []

    if (stepIndex === 6) {
        // Suitability Step
        SUITABILITY_QUESTIONS.forEach(q => {
            if (!formData[q.name] || formData[q.name].trim() === "") {
                errors[q.name] = "Selecione uma alternativa para esta pergunta."
                missingFields.push(q.name)
            }
        })
        return { isValid: missingFields.length === 0, errors, missingFields }
    }

    const step = PLAN_DATA[stepIndex]
    if (!step) return { isValid: true, errors, missingFields }

    step.fields.forEach(field => {
        // Check conditional visibility
        if (field.conditional && !field.conditional(formData)) {
            return
        }

        const value = formData[field.name]?.trim() ?? ""

        if (field.required && !value) {
            errors[field.name] = `O campo "${field.label}" é obrigatório.`
            missingFields.push(field.name)
            return
        }

        if (value && field.type === "number") {
            const num = Number(value)
            if (isNaN(num)) {
                errors[field.name] = "Informe um número válido."
                missingFields.push(field.name)
            } else if (field.min !== undefined && num < field.min) {
                errors[field.name] = `O valor mínimo é ${field.min}.`
                missingFields.push(field.name)
            } else if (field.max !== undefined && num > field.max) {
                errors[field.name] = `O valor máximo é ${field.max}.`
                missingFields.push(field.name)
            }
        }

        if (value && field.type === "currency") {
            const cleanDigits = value.replace(/\D/g, "")
            if (cleanDigits === "" && field.required) {
                errors[field.name] = `Informe o valor para "${field.label}".`
                missingFields.push(field.name)
            }
        }
    })

    // Additional cross-field checks
    if (stepIndex === 3) {
        const idadeAtual = parseInt(formData.idade || "35", 10)
        const idadeIf = parseInt(formData.idadeIf || "0", 10)
        if (idadeIf > 0 && idadeIf <= idadeAtual) {
            errors.idadeIf = `A idade de aposentadoria (${idadeIf}) deve ser superior à sua idade atual (${idadeAtual}).`
            if (!missingFields.includes("idadeIf")) missingFields.push("idadeIf")
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        missingFields
    }
}

export function computeStepStatus(
    stepIndex: number,
    formData: Record<string, string>,
    attemptedSteps: Set<number>
): StepStatus {
    const { isValid, missingFields } = validateStepFields(stepIndex, formData)
    
    if (isValid) return "completed"

    if (stepIndex === 6) {
        const answeredAny = SUITABILITY_QUESTIONS.some(q => Boolean(formData[q.name]))
        if (attemptedSteps.has(stepIndex)) return "has_error"
        return answeredAny ? "in_progress" : "not_started"
    }

    const step = PLAN_DATA[stepIndex]
    const activeFields = step.fields.filter(f => !f.conditional || f.conditional(formData))
    const filledCount = activeFields.filter(f => Boolean(formData[f.name]?.trim())).length

    if (filledCount === 0) return "not_started"
    if (attemptedSteps.has(stepIndex) && missingFields.length > 0) return "has_error"
    return "in_progress"
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function PlanejamentoJornadaPage() {
    const [current, setCurrent] = useState(0)
    const [formData, setFormData] = useState<Record<string, string>>({})
    const [customExpenses, setCustomExpenses] = useState<CustomExpense[]>([])
    const [showDashboard, setShowDashboard] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [quizQuestionIndex, setQuizQuestionIndex] = useState(0)
    const [showQuizResult, setShowQuizResult] = useState(false)
    
    // Validation & Error States
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
    const [attemptedSteps, setAttemptedSteps] = useState<Set<number>>(new Set())

    // Auto-Save States
    const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "pending" | "error">("saved")
    const [lastSavedTime, setLastSavedTime] = useState<string | null>(null)
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const containerRef = useRef<HTMLDivElement | null>(null)

    // Format currency for inputs
    const formatCurrencyInput = (val: string) => {
        const clean = val.replace(/\D/g, "")
        if (!clean) return ""
        const num = parseInt(clean, 10) / 100
        return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(num)
    }

    // ─── PERSISTENCE (LOAD) ────────────────────────────────────────────────────
    useEffect(() => {
        async function loadProgress() {
            let initialData: Record<string, string> = {}

            // 1. Try Local Storage Draft First
            if (typeof window !== "undefined") {
                try {
                    const localRaw = localStorage.getItem("arvo_jornada_draft_v2")
                    if (localRaw) {
                        const parsed = JSON.parse(localRaw)
                        if (parsed && typeof parsed === "object") {
                            initialData = parsed
                        }
                    }
                } catch (e) {
                    console.warn("Could not read local draft:", e)
                }
            }

            // 2. Fetch Server Session Progress
            try {
                const res = await getJornadaProgress()
                if (res?.success && res?.data) {
                    const serverData = res.data as Record<string, string>
                    // Merge preferring server data if completed, or merge fields
                    initialData = { ...initialData, ...serverData }
                    if (res.isCompleted) {
                        setShowDashboard(true)
                    }
                }
            } catch (e) {
                console.warn("Could not load server progress:", e)
            }

            setFormData(initialData)

            if (initialData.customExpensesJson) {
                try {
                    const parsed = JSON.parse(initialData.customExpensesJson)
                    if (Array.isArray(parsed)) {
                        setCustomExpenses(parsed)
                    }
                } catch (e) {}
            }

            const isAllSuitabilityAnswered = SUITABILITY_QUESTIONS.every(q => Boolean(initialData[q.name]))
            if (isAllSuitabilityAnswered) {
                setShowQuizResult(true)
            }

            setLastSavedTime(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }))
            setIsLoading(false)
        }

        loadProgress()
    }, [])

    // ─── PERSISTENCE (DEBOUNCED SAVE) ──────────────────────────────────────────
    const triggerSave = useCallback((dataToSave: Record<string, string>, isCompletedFlag: boolean = false) => {
        setSaveStatus("saving")
        
        // Instant local draft save
        if (typeof window !== "undefined") {
            try {
                localStorage.setItem("arvo_jornada_draft_v2", JSON.stringify(dataToSave))
            } catch (e) {}
        }

        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current)
        }

        saveTimeoutRef.current = setTimeout(async () => {
            try {
                const res = await saveJornadaProgress(dataToSave, isCompletedFlag)
                if (res?.success) {
                    setSaveStatus("saved")
                    setLastSavedTime(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }))
                } else {
                    setSaveStatus("error")
                }
            } catch (error) {
                setSaveStatus("error")
            }
        }, 1000)
    }, [])

    // Handle single input update
    const handleInputChange = (name: string, value: string) => {
        const nextData = { ...formData, [name]: value }
        setFormData(nextData)
        setSaveStatus("pending")

        // Clear error on change if field becomes valid
        if (fieldErrors[name]) {
            const nextErrors = { ...fieldErrors }
            delete nextErrors[name]
            setFieldErrors(nextErrors)
        }

        triggerSave(nextData, false)
    }

    // Handle Custom Expenses (Etapa 1)
    const handleAddCustomExpense = () => {
        const newExpense: CustomExpense = {
            id: Date.now().toString(),
            name: "",
            value: ""
        }
        const updated = [...customExpenses, newExpense]
        setCustomExpenses(updated)
        const nextData = {
            ...formData,
            customExpensesJson: JSON.stringify(updated)
        }
        setFormData(nextData)
        triggerSave(nextData, false)
    }

    const handleUpdateCustomExpense = (id: string, key: "name" | "value", val: string) => {
        const updated = customExpenses.map(item => item.id === id ? { ...item, [key]: val } : item)
        setCustomExpenses(updated)
        const nextData = {
            ...formData,
            customExpensesJson: JSON.stringify(updated)
        }
        setFormData(nextData)
        triggerSave(nextData, false)
    }

    const handleRemoveCustomExpense = (id: string) => {
        const updated = customExpenses.filter(item => item.id !== id)
        setCustomExpenses(updated)
        const nextData = {
            ...formData,
            customExpensesJson: JSON.stringify(updated)
        }
        setFormData(nextData)
        triggerSave(nextData, false)
    }

    // Step Statuses & Progress Computations
    const stepStatuses: StepStatus[] = useMemo(() => {
        return PLAN_DATA.map((_, idx) => computeStepStatus(idx, formData, attemptedSteps))
    }, [formData, attemptedSteps])

    const completedStepsCount = useMemo(() => {
        return PLAN_DATA.filter((_, idx) => validateStepFields(idx, formData).isValid).length
    }, [formData])

    const globalProgressPct = useMemo(() => {
        return Math.round((completedStepsCount / PLAN_DATA.length) * 100)
    }, [completedStepsCount])

    // Total expenses calculation
    const totalExpenses = useMemo(() => {
        const parseValue = (val?: string) => {
            if (!val) return 0
            const clean = val.replace(/\D/g, "")
            if (!clean) return 0
            return parseInt(clean, 10) / 100
        }

        const moradia = parseValue(formData.gastoMoradia)
        const alimentacao = parseValue(formData.gastoAlimentacao)
        const transporte = parseValue(formData.gastoTransporte)
        const saude = parseValue(formData.gastoSaude)
        const dividas = formData.possuiDividas === "Sim, possuo" ? parseValue(formData.parcelasDividas) : 0
        const customTotal = customExpenses.reduce((sum, item) => sum + parseValue(item.value), 0)

        return moradia + alimentacao + transporte + saude + dividas + customTotal
    }, [formData, customExpenses])

    const totalExpensesFormatted = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalExpenses)

    // Suitability calculations
    const suitabilityDiagnostic = useMemo(() => {
        return getSuitabilityDiagnostic(formData)
    }, [formData])

    // Suitability Option Selection (Step 7)
    const handleSelectQuizOption = (questionName: string, optionText: string) => {
        const nextData = { ...formData, [questionName]: optionText }
        setFormData(nextData)
        
        if (fieldErrors[questionName]) {
            const nextErrors = { ...fieldErrors }
            delete nextErrors[questionName]
            setFieldErrors(nextErrors)
        }

        triggerSave(nextData, false)

        setTimeout(() => {
            if (quizQuestionIndex < SUITABILITY_QUESTIONS.length - 1) {
                setQuizQuestionIndex(prev => prev + 1)
            } else {
                setShowQuizResult(true)
            }
        }, 180)
    }

    // Advance to next step with strict validation
    const goNext = async () => {
        const validation = validateStepFields(current, formData)
        
        // Mark current step as attempted
        setAttemptedSteps(prev => new Set(prev).add(current))

        if (!validation.isValid) {
            setFieldErrors(validation.errors)
            
            // Auto focus on first error field
            if (validation.missingFields.length > 0) {
                const firstFieldName = validation.missingFields[0]
                const el = document.getElementById(`field-${firstFieldName}`)
                if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "center" })
                    el.focus()
                }
            }
            return
        }

        // Clear errors if valid
        setFieldErrors({})

        if (current < PLAN_DATA.length - 1) {
            const nextStep = current + 1
            setCurrent(nextStep)
            window.scrollTo({ top: 0, behavior: "smooth" })
            await saveJornadaProgress(formData, false)
        } else {
            // Final completion
            setShowDashboard(true)
            window.scrollTo({ top: 0, behavior: "smooth" })
            await saveJornadaProgress(formData, true)
        }
    }

    // Direct step jump from navigation
    const handleStepJump = (idx: number) => {
        // Clear previous step error highlights on switch
        setFieldErrors({})
        setCurrent(idx)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#f6f4ef] text-[#123044] space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-[#1f674f]" />
                <p className="text-xs font-semibold text-[#667085]">Carregando seus dados da Jornada ARVO...</p>
            </div>
        )
    }

    if (showDashboard) {
        return (
            <PlanoArvoDashboard 
                formData={formData} 
                onBack={() => setShowDashboard(false)} 
            />
        )
    }

    const currentStepData = PLAN_DATA[current]
    const currentQuizQ = SUITABILITY_QUESTIONS[quizQuestionIndex]

    return (
        <div ref={containerRef} className="min-h-screen text-slate-900 font-sans p-4 sm:p-6 md:p-8 bg-[#f6f4ef]">
            <div className="max-w-[1100px] mx-auto space-y-6 sm:space-y-8">
                
                {/* ─── HEADER & STATUS BAR ────────────────────────────────────────────── */}
                <header className="grid lg:grid-cols-[1fr_360px] gap-6 lg:gap-8 items-start">
                    <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#e8f1ed] text-[#1f674f] text-[11px] font-bold rounded-full border border-[#d6e5de]">
                                <Compass size={13} />
                                Rota de Planejamento Financeiro ARVO
                            </span>
                            
                            {/* Save Status Indicator */}
                            <div className="inline-flex items-center gap-1.5 text-xs text-[#667085] px-2.5 py-0.5">
                                {saveStatus === "saving" && (
                                    <>
                                        <Loader2 size={12} className="animate-spin text-[#1f674f]" />
                                        <span>Salvando...</span>
                                    </>
                                )}
                                {saveStatus === "saved" && lastSavedTime && (
                                    <>
                                        <Check size={12} className="text-[#1f674f]" />
                                        <span>Salvo às {lastSavedTime}</span>
                                    </>
                                )}
                                {saveStatus === "pending" && (
                                    <span className="text-[#92400e]">Alterações pendentes</span>
                                )}
                                {saveStatus === "error" && (
                                    <span className="text-red-600 flex items-center gap-1">
                                        <AlertCircle size={12} /> Salvo apenas localmente
                                    </span>
                                )}
                            </div>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#123044] leading-tight">
                            Diagnóstico em <span className="font-semibold text-[#123044]">7 Marcos Estratégicos</span>
                        </h1>
                        <p className="text-[#667085] text-sm sm:text-base mt-2 max-w-xl leading-relaxed">
                            Organizamos suas finanças com dados reais para identificar vulnerabilidades, projetar sua independência e calibrar sua Bússola de Investimentos.
                        </p>
                    </div>

                    {/* ─── PROGRESS CARD ────────────────────────────────────────────── */}
                    <div className="bg-white border border-[#e4e0d7] rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="text-xs font-bold text-[#667085] uppercase tracking-wider block mb-0.5">
                                    Progresso da Rota
                                </span>
                                <div className="text-3xl sm:text-4xl font-extrabold text-[#123044] tracking-tight">
                                    {globalProgressPct}%
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="inline-block px-3 py-1 bg-[#f0ece1] text-[#123044] text-xs font-bold rounded-lg">
                                    {completedStepsCount} de {PLAN_DATA.length} concluídos
                                </span>
                                <span className="text-[11px] text-[#667085] block mt-1">
                                    Marco {current + 1} em exibição
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-2.5 bg-[#e4e0d7] rounded-full overflow-hidden mb-3">
                            <motion.div 
                                className="h-full bg-[#1f674f] rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${globalProgressPct}%` }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                            />
                        </div>

                        <p className="text-xs text-[#667085] leading-relaxed">
                            {ROUTE_PROGRESS_DESCRIPTIONS[current]}
                        </p>
                    </div>
                </header>

                {/* ─── STEP NAVIGATION BAR (7 ETAPAS) ────────────────────────────────── */}
                <nav aria-label="Marcos da Jornada" className="w-full pb-2 overflow-x-auto no-scrollbar">
                    <div className="flex sm:grid sm:grid-cols-4 lg:grid-cols-7 gap-2 min-w-max sm:min-w-0">
                        {PLAN_DATA.map((item, idx) => {
                            const isCurrent = idx === current
                            const status = stepStatuses[idx]
                            const isCompleted = status === "completed"
                            const hasError = status === "has_error"

                            return (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleStepJump(idx)}
                                    aria-current={isCurrent ? "step" : undefined}
                                    aria-label={`Marco ${idx + 1}: ${item.title}. Status: ${isCompleted ? "Concluído" : hasError ? "Com pendências" : "Pendente"}`}
                                    className={`flex flex-col items-start gap-1.5 p-3 rounded-2xl text-left transition-all duration-200 border w-[140px] sm:w-full shrink-0 cursor-pointer ${
                                        isCurrent 
                                            ? "bg-[#123044] border-[#123044] text-white shadow-md" 
                                            : isCompleted
                                                ? "bg-white border-[#d6e5de] hover:bg-[#f8fcfb] text-[#123044]"
                                                : hasError
                                                    ? "bg-red-50/60 border-red-200 text-red-900"
                                                    : "bg-white border-[#e4e0d7] hover:bg-[#f0ece1] text-[#123044]"
                                    }`}
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <span className={`w-6 h-6 flex items-center justify-center rounded-lg font-bold text-xs ${
                                            isCurrent 
                                                ? "bg-white text-[#123044]" 
                                                : isCompleted 
                                                    ? "bg-[#1f674f] text-white" 
                                                    : hasError 
                                                        ? "bg-red-600 text-white" 
                                                        : "bg-[#e4e0d7] text-[#667085]"
                                        }`}>
                                            {isCompleted ? <Check size={13} strokeWidth={3} /> : (idx + 1)}
                                        </span>

                                        <span className={`text-[10px] font-semibold ${
                                            isCurrent ? "text-white/70" : isCompleted ? "text-[#1f674f]" : hasError ? "text-red-600 font-bold" : "text-[#a09e99]"
                                        }`}>
                                            {isCompleted ? "Concluído" : hasError ? "Pendente" : "Pilar " + (idx + 1)}
                                        </span>
                                    </div>

                                    <div className="w-full mt-1">
                                        <div className={`font-bold text-xs leading-snug line-clamp-1 ${isCurrent ? "text-white" : "text-[#123044]"}`}>
                                            {item.title}
                                        </div>
                                        <div className={`text-[11px] truncate mt-0.5 ${isCurrent ? "text-white/70" : "text-[#667085]"}`}>
                                            {item.short}
                                        </div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </nav>

                {/* ─── MAIN PANEL CONTENT ────────────────────────────────────────────── */}
                <main className="bg-white border border-[#e4e0d7] rounded-3xl p-5 sm:p-8 md:p-10 shadow-sm flex flex-col w-full min-h-[520px]">
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={current}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25 }}
                            className="flex-1 flex flex-col"
                        >
                            {/* Step Header */}
                            <div className="pb-5 border-b border-[#e4e0d7] mb-6">
                                <div className="text-xs font-bold text-[#1f674f] uppercase tracking-wider mb-1 flex items-center gap-2">
                                    {currentStepData.icon}
                                    <span>MARCO {current + 1} DE {PLAN_DATA.length} · {currentStepData.status}</span>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-[#123044]">
                                    {currentStepData.title}
                                </h2>
                                <p className="text-sm text-[#667085] mt-1.5 max-w-2xl leading-relaxed">
                                    {currentStepData.desc}
                                </p>
                            </div>

                            {/* Global Step Validation Banner (if attempted with errors) */}
                            {Object.keys(fieldErrors).length > 0 && (
                                <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex items-start gap-3">
                                    <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                                    <div className="text-xs leading-relaxed">
                                        <strong className="font-bold block mb-0.5">Campos obrigatórios pendentes:</strong>
                                        Por favor, preencha os campos destacados em vermelho abaixo para avançar com precisão no seu plano.
                                    </div>
                                </div>
                            )}

                            {/* ─── ETAPA 7: SUITABILITY & TOLERÂNCIA AO RISCO ───────────────── */}
                            {current === 6 ? (
                                <div className="my-2 flex-1 flex flex-col">
                                    {!showQuizResult ? (
                                        <div className="bg-[#fbfaf5] border border-[#e4e0d7] rounded-2xl p-5 sm:p-7 flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#e4e0d7]">
                                                    <div>
                                                        <span className="text-xs font-bold text-[#1f674f] uppercase tracking-wider block">
                                                            Avaliação de Suitability & Tolerância ao Risco
                                                        </span>
                                                        <span className="text-xs text-[#667085]">
                                                            Pergunta {quizQuestionIndex + 1} de {SUITABILITY_QUESTIONS.length}
                                                        </span>
                                                    </div>

                                                    {/* Dots de Navegação Rápida entre Perguntas */}
                                                    <div className="flex items-center gap-1.5" role="tablist" aria-label="Perguntas de suitability">
                                                        {SUITABILITY_QUESTIONS.map((q, qIdx) => {
                                                            const isQCurrent = qIdx === quizQuestionIndex
                                                            const isQAnswered = Boolean(formData[q.name])
                                                            return (
                                                                <button
                                                                    key={qIdx}
                                                                    type="button"
                                                                    onClick={() => setQuizQuestionIndex(qIdx)}
                                                                    aria-label={`Ir para pergunta ${qIdx + 1}`}
                                                                    className={`h-2.5 rounded-full transition-all duration-200 cursor-pointer ${
                                                                        isQCurrent 
                                                                            ? "w-8 bg-[#123044]" 
                                                                            : isQAnswered 
                                                                                ? "w-2.5 bg-[#1f674f]" 
                                                                                : "w-2.5 bg-[#e4e0d7]"
                                                                    }`}
                                                                />
                                                            )
                                                        })}
                                                    </div>
                                                </div>

                                                <div className="my-6">
                                                    <h3 className="text-lg sm:text-xl font-bold text-[#123044] leading-snug">
                                                        {currentQuizQ.title}
                                                    </h3>
                                                    <p className="text-xs text-[#667085] mt-1">
                                                        {currentQuizQ.subtitle}
                                                    </p>
                                                </div>

                                                <div className="grid gap-2.5 my-4">
                                                    {currentQuizQ.options.map((opt) => {
                                                        const isSelected = formData[currentQuizQ.name] === opt.text
                                                        return (
                                                            <button
                                                                key={opt.letter}
                                                                type="button"
                                                                onClick={() => handleSelectQuizOption(currentQuizQ.name, opt.text)}
                                                                className={`w-full p-4 rounded-xl border text-left flex items-center justify-between gap-3.5 transition-all duration-150 cursor-pointer ${
                                                                    isSelected
                                                                        ? "bg-[#123044] text-white border-[#123044] shadow-sm"
                                                                        : "bg-white hover:bg-[#f2efe6] text-[#123044] border-[#e4e0d7] hover:border-[#2b6e76]"
                                                                }`}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <span className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 ${
                                                                        isSelected ? "bg-white text-[#123044]" : "bg-[#e8f1ed] text-[#1f674f]"
                                                                    }`}>
                                                                        {opt.letter}
                                                                    </span>
                                                                    <span className={`text-sm font-medium leading-relaxed ${isSelected ? "text-white" : "text-[#123044]"}`}>
                                                                        {opt.text}
                                                                    </span>
                                                                </div>
                                                                {isSelected && <Check size={18} className="text-[#4fa080] shrink-0" />}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-[#e4e0d7] mt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setQuizQuestionIndex(prev => Math.max(0, prev - 1))}
                                                    disabled={quizQuestionIndex === 0}
                                                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#667085] hover:text-[#123044] disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
                                                >
                                                    <ArrowLeft size={14} /> Pergunta Anterior
                                                </button>

                                                {quizQuestionIndex < SUITABILITY_QUESTIONS.length - 1 ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => setQuizQuestionIndex(prev => prev + 1)}
                                                        disabled={!formData[currentQuizQ.name]}
                                                        className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#1f674f] hover:bg-[#18533f] disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                                                    >
                                                        Próxima Pergunta <ArrowRight size={14} />
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowQuizResult(true)}
                                                        disabled={!formData[currentQuizQ.name]}
                                                        className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#123044] hover:bg-[#1e4866] disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                                                    >
                                                        Ver Diagnóstico do Perfil <ArrowRight size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-[#fbfaf5] border border-[#e4e0d7] rounded-2xl p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                                            <div>
                                                <div className="flex justify-between items-center bg-white border border-[#e4e0d7] rounded-xl px-4 py-2.5 mb-6">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-[#1f674f]">
                                                        <CheckCircle2 size={16} />
                                                        Perfil Diagnosticado com Sucesso
                                                    </div>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => { setShowQuizResult(false); setQuizQuestionIndex(0); }}
                                                        className="text-xs font-bold text-[#123044] hover:text-[#1f674f] flex items-center gap-1 px-3 py-1 rounded-lg border border-[#e4e0d7] hover:bg-[#f6f4ef] transition-colors cursor-pointer"
                                                    >
                                                        <RotateCcw size={12} /> Refazer Perguntas
                                                    </button>
                                                </div>

                                                <div className="text-center max-w-xl mx-auto mb-8">
                                                    <span className="text-xs font-bold text-[#1f674f] uppercase tracking-wider block mb-1">
                                                        Resultado Oficial de Suitability
                                                    </span>
                                                    <h3 className="text-3xl sm:text-4xl font-extrabold text-[#123044]">
                                                        {suitabilityDiagnostic.label}
                                                    </h3>
                                                    <p className="text-sm text-[#667085] mt-2 leading-relaxed">
                                                        {suitabilityDiagnostic.description}
                                                    </p>
                                                </div>

                                                {/* Dimensões Avaliadas */}
                                                <div className="grid sm:grid-cols-2 gap-3 mb-6">
                                                    {Object.values(suitabilityDiagnostic.dimensions).map((dim, i) => (
                                                        <div key={i} className="p-4 bg-white rounded-xl border border-[#e4e0d7] space-y-1.5">
                                                            <div className="flex justify-between items-center text-xs">
                                                                <span className="font-bold text-[#123044]">{dim.name}</span>
                                                                <span className="font-extrabold text-[#1f674f]">{dim.score}%</span>
                                                            </div>
                                                            <div className="h-1.5 bg-[#e4e0d7] rounded-full overflow-hidden">
                                                                <div className="h-full bg-[#1f674f] rounded-full" style={{ width: `${dim.score}%` }} />
                                                            </div>
                                                            <p className="text-[11px] text-[#667085] leading-tight pt-1">
                                                                {dim.description}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Resumo das 6 Respostas */}
                                                <div className="bg-white border border-[#e4e0d7] rounded-xl p-4">
                                                    <span className="text-xs font-bold text-[#123044] block mb-2">
                                                        Suas Respostas Registradas:
                                                    </span>
                                                    <div className="grid sm:grid-cols-2 gap-2 text-xs">
                                                        {SUITABILITY_QUESTIONS.map((q, idx) => (
                                                            <div key={q.id} className="p-2 bg-[#f6f4ef] rounded-lg border border-[#e4e0d7]/70 truncate">
                                                                <span className="text-[10px] font-bold text-[#667085] block truncate">{idx + 1}. {q.title}</span>
                                                                <span className="font-semibold text-[#123044] truncate block mt-0.5">{formData[q.name] || "Não respondido"}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-6 border-t border-[#e4e0d7] flex flex-col sm:flex-row items-center justify-between gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => { setShowQuizResult(false); setQuizQuestionIndex(0); }}
                                                    className="px-4 py-2 text-xs font-bold text-[#667085] hover:text-[#123044] transition-colors flex items-center gap-1.5 cursor-pointer"
                                                >
                                                    <RotateCcw size={13} /> Revisar Perguntas
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={goNext}
                                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#123044] hover:bg-[#1e4866] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
                                                >
                                                    Concluir Jornada & Ver Meu Plano ARVO
                                                    <ArrowRightCircle size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* ─── ETAPAS 1 A 6: FORMULÁRIO DE MARCOS ────────────────────────── */
                                <>
                                    <div className="grid md:grid-cols-2 gap-5 sm:gap-6 my-4">
                                        {currentStepData.fields.map((field) => {
                                            if (field.conditional && !field.conditional(formData)) {
                                                return null
                                            }

                                            const val = formData[field.name] || ""
                                            const hasFieldError = Boolean(fieldErrors[field.name])
                                            const fieldId = `field-${field.name}`

                                            return (
                                                <div 
                                                    key={field.name} 
                                                    className={`space-y-1.5 ${field.type === "radio" ? "md:col-span-2" : ""}`}
                                                >
                                                    <div className="flex justify-between items-baseline">
                                                        <label 
                                                            htmlFor={fieldId} 
                                                            className="text-xs font-bold text-[#123044] flex items-center gap-1"
                                                        >
                                                            {field.label}
                                                            {field.required && <span className="text-red-500 font-bold" title="Campo obrigatório">*</span>}
                                                            {!field.required && <span className="text-[#a09e99] font-normal text-[11px]">(Opcional)</span>}
                                                        </label>
                                                    </div>

                                                    {/* CURRENCY INPUT */}
                                                    {field.type === "currency" && (
                                                        <div className="relative">
                                                            <input 
                                                                id={fieldId}
                                                                name={field.name}
                                                                type="text" 
                                                                inputMode="numeric"
                                                                placeholder={field.placeholder || "R$ 0,00"}
                                                                value={val}
                                                                aria-required={field.required}
                                                                aria-invalid={hasFieldError}
                                                                aria-describedby={hasFieldError ? `err-${field.name}` : undefined}
                                                                onChange={(e) => handleInputChange(field.name, formatCurrencyInput(e.target.value))}
                                                                className={`w-full bg-[#f6f4ef] rounded-xl px-4 py-3 text-sm text-[#123044] font-medium placeholder:text-[#a09e99] focus:outline-none transition-all border ${
                                                                    hasFieldError 
                                                                        ? "border-red-400 focus:border-red-600 focus:ring-1 focus:ring-red-600 bg-red-50/20" 
                                                                        : "border-[#e4e0d7] focus:border-[#1f674f] focus:ring-1 focus:ring-[#1f674f]"
                                                                }`}
                                                            />
                                                        </div>
                                                    )}

                                                    {/* NUMBER INPUT */}
                                                    {field.type === "number" && (
                                                        <input 
                                                            id={fieldId}
                                                            name={field.name}
                                                            type="number" 
                                                            inputMode="numeric"
                                                            placeholder={field.placeholder}
                                                            value={val}
                                                            min={field.min}
                                                            max={field.max}
                                                            aria-required={field.required}
                                                            aria-invalid={hasFieldError}
                                                            aria-describedby={hasFieldError ? `err-${field.name}` : undefined}
                                                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                                                            className={`w-full bg-[#f6f4ef] rounded-xl px-4 py-3 text-sm text-[#123044] font-medium placeholder:text-[#a09e99] focus:outline-none transition-all border ${
                                                                hasFieldError 
                                                                    ? "border-red-400 focus:border-red-600 focus:ring-1 focus:ring-red-600 bg-red-50/20" 
                                                                    : "border-[#e4e0d7] focus:border-[#1f674f] focus:ring-1 focus:ring-[#1f674f]"
                                                                }`}
                                                        />
                                                    )}

                                                    {/* TEXT INPUT */}
                                                    {field.type === "text" && (
                                                        <input 
                                                            id={fieldId}
                                                            name={field.name}
                                                            type="text" 
                                                            placeholder={field.placeholder}
                                                            value={val}
                                                            aria-required={field.required}
                                                            aria-invalid={hasFieldError}
                                                            aria-describedby={hasFieldError ? `err-${field.name}` : undefined}
                                                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                                                            className={`w-full bg-[#f6f4ef] rounded-xl px-4 py-3 text-sm text-[#123044] font-medium placeholder:text-[#a09e99] focus:outline-none transition-all border ${
                                                                hasFieldError 
                                                                    ? "border-red-400 focus:border-red-600 focus:ring-1 focus:ring-red-600 bg-red-50/20" 
                                                                    : "border-[#e4e0d7] focus:border-[#1f674f] focus:ring-1 focus:ring-[#1f674f]"
                                                                }`}
                                                        />
                                                    )}

                                                    {/* SELECT INPUT */}
                                                    {field.type === "select" && (
                                                        <select 
                                                            id={fieldId}
                                                            name={field.name}
                                                            value={val}
                                                            aria-required={field.required}
                                                            aria-invalid={hasFieldError}
                                                            aria-describedby={hasFieldError ? `err-${field.name}` : undefined}
                                                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                                                            className={`w-full bg-[#f6f4ef] rounded-xl px-4 py-3 text-sm text-[#123044] font-medium focus:outline-none transition-all border cursor-pointer ${
                                                                hasFieldError 
                                                                    ? "border-red-400 focus:border-red-600 focus:ring-1 focus:ring-red-600 bg-red-50/20" 
                                                                    : "border-[#e4e0d7] focus:border-[#1f674f] focus:ring-1 focus:ring-[#1f674f]"
                                                                }`}
                                                        >
                                                            <option value="">Selecione uma opção...</option>
                                                            {field.options?.map(opt => (
                                                                <option key={opt} value={opt}>{opt}</option>
                                                            ))}
                                                        </select>
                                                    )}

                                                    {/* RADIO BUTTON GROUP */}
                                                    {field.type === "radio" && (
                                                        <div 
                                                            id={fieldId} 
                                                            role="radiogroup" 
                                                            aria-label={field.label}
                                                            className="grid sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1"
                                                        >
                                                            {field.options?.map(opt => (
                                                                <button
                                                                    type="button"
                                                                    key={opt}
                                                                    role="radio"
                                                                    aria-checked={val === opt}
                                                                    onClick={() => handleInputChange(field.name, opt)}
                                                                    className={`px-4 py-3 text-xs font-semibold rounded-xl border text-left transition-all cursor-pointer ${
                                                                        val === opt 
                                                                            ? "bg-[#123044] text-white border-[#123044] shadow-sm" 
                                                                            : hasFieldError
                                                                                ? "bg-red-50/40 text-[#123044] border-red-200 hover:bg-[#e4e0d7]/60"
                                                                                : "bg-[#f6f4ef] text-[#123044] border-[#e4e0d7] hover:bg-[#e4e0d7]/60"
                                                                    }`}
                                                                >
                                                                    {opt}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Help text or Inline Error */}
                                                    {hasFieldError ? (
                                                        <p id={`err-${field.name}`} className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-1">
                                                            <AlertCircle size={12} /> {fieldErrors[field.name]}
                                                        </p>
                                                    ) : field.helpText ? (
                                                        <p className="text-[11px] text-[#667085] leading-normal">
                                                            {field.helpText}
                                                        </p>
                                                    ) : null}
                                                </div>
                                            )
                                        })}

                                        {/* ─── CUSTOM EXTRA EXPENSES (MARCO 1) ────────────────────── */}
                                        {current === 0 && customExpenses.map((expense) => (
                                            <div key={expense.id} className="space-y-1.5">
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-1 flex-1 min-w-0">
                                                        <label className="text-xs font-bold text-[#123044] shrink-0">Outro Gasto:</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Ex: Lazer, Educação, etc."
                                                            value={expense.name}
                                                            onChange={(e) => handleUpdateCustomExpense(expense.id, "name", e.target.value)}
                                                            className="text-xs font-bold text-[#123044] bg-transparent border-b border-dashed border-[#123044]/30 hover:border-[#1f674f] focus:border-[#1f674f] focus:outline-none px-1 py-0.5 w-full transition-colors"
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveCustomExpense(expense.id)}
                                                        className="text-[#98a2b3] hover:text-red-700 text-xs font-medium flex items-center gap-1 hover:underline transition-colors shrink-0 cursor-pointer"
                                                        title="Remover este gasto"
                                                    >
                                                        <Trash2 size={12} /> Remover
                                                    </button>
                                                </div>

                                                <input 
                                                    type="text" 
                                                    inputMode="numeric"
                                                    placeholder="R$ 0,00"
                                                    value={expense.value}
                                                    onChange={(e) => handleUpdateCustomExpense(expense.id, "value", formatCurrencyInput(e.target.value))}
                                                    className="w-full bg-[#f6f4ef] border border-[#e4e0d7] rounded-xl px-4 py-3 text-sm text-[#123044] font-medium placeholder:text-[#a09e99] focus:outline-none focus:border-[#1f674f] focus:ring-1 focus:ring-[#1f674f] transition-all"
                                                />
                                            </div>
                                        ))}

                                        {/* ADD CUSTOM EXPENSE BUTTON (MARCO 1) */}
                                        {current === 0 && (
                                            <div className="space-y-1.5 flex flex-col justify-end">
                                                <button
                                                    type="button"
                                                    onClick={handleAddCustomExpense}
                                                    className="w-full h-[46px] bg-transparent hover:bg-[#e8f1ed]/50 border-2 border-dashed border-[#d8d3c5] hover:border-[#1f674f] text-[#123044] hover:text-[#1f674f] text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                                                >
                                                    <Plus size={14} /> Adicionar Outro Gasto Específico
                                                </button>
                                            </div>
                                        )}

                                        {/* TOTAL EXPENSES BANNER (MARCO 1) */}
                                        {current === 0 && (
                                            <div className="md:col-span-2 p-4 rounded-2xl bg-[#e8f1ed]/60 border border-[#d6e5de] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-2">
                                                <div className="text-xs text-[#123044] font-bold flex items-center gap-1.5">
                                                    <DollarSign size={15} className="text-[#1f674f]" />
                                                    Soma dos Gastos Mensais Declarados:
                                                </div>
                                                <div className="text-base font-extrabold text-[#1f674f]">
                                                    {totalExpensesFormatted}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* ─── DELIVERABLES LIST ────────────────────────────────────── */}
                                    <div className="mt-8 pt-6 border-t border-[#e4e0d7]">
                                        <span className="text-xs font-bold text-[#667085] uppercase tracking-wider block mb-3">
                                            Entregáveis do Marco {current + 1}
                                        </span>
                                        <div className="grid sm:grid-cols-2 gap-2.5">
                                            {currentStepData.analysis.map((an, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs font-medium text-[#123044] bg-[#f6f4ef]/80 p-2.5 rounded-xl border border-[#e4e0d7]/70">
                                                    <Check size={13} className="text-[#1f674f] shrink-0" />
                                                    <span>{an}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* ─── BOTTOM NAVIGATION BUTTONS ────────────────────────────────── */}
                    {current < 6 && (
                        <div className="flex items-center justify-between mt-auto pt-8 border-t border-[#e4e0d7]">
                            <button
                                type="button"
                                onClick={() => handleStepJump(Math.max(0, current - 1))}
                                disabled={current === 0}
                                className="px-4 py-2.5 text-xs font-bold text-[#667085] hover:text-[#123044] disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
                            >
                                Voltar para Marco {current}
                            </button>

                            <button
                                type="button"
                                onClick={goNext}
                                className="inline-flex items-center gap-2 px-7 py-3 bg-[#123044] hover:bg-[#1e4866] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
                            >
                                Avançar para Marco {current + 2}
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

