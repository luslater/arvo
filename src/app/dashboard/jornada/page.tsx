"use client"

import { useState, useEffect, useMemo, useRef, useCallback, Fragment } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Check, ArrowRight, ArrowLeft, ArrowRightCircle, Target, 
    Wallet, ShieldCheck, HeartPulse, Building2, Landmark, 
    Compass, Loader2, CheckCircle2, RotateCcw, Plus, Trash2, 
    DollarSign, AlertCircle, CloudCheck, CloudOff, Info, 
    HelpCircle, Shield, ArrowUpRight
} from "lucide-react"
import PlanoArvoDashboard from "@/components/plano-arvo-dashboard"
import { RaioXFluxoCaixa } from "@/components/dashboard/raio-x-fluxo-caixa"
import { saveJornadaProgress, getJornadaProgress } from "./actions"
import { calculateInvestorProfile, getSuitabilityDiagnostic } from "@/lib/profile-calculator"

// ─── TYPES & FIELD DEFINITIONS ────────────────────────────────────────────────
type FieldDef = {
    name: string
    label: string | ((data: Record<string, string>) => string)
    type: "text" | "number" | "currency" | "select" | "radio"
    options?: string[]
    placeholder?: string | ((data: Record<string, string>) => string)
    required?: boolean
    helpText?: string | ((data: Record<string, string>) => string)
    min?: number
    max?: number
    conditional?: (data: Record<string, string>) => boolean
}

function getFieldLabel(field: FieldDef, data: Record<string, string>): string {
    return typeof field.label === "function" ? field.label(data) : field.label
}

function getFieldHelpText(field: FieldDef, data: Record<string, string>): string | undefined {
    return typeof field.helpText === "function" ? field.helpText(data) : field.helpText
}

function getFieldPlaceholder(field: FieldDef, data: Record<string, string>): string | undefined {
    return typeof field.placeholder === "function" ? field.placeholder(data) : field.placeholder
}

type CustomExpense = {
    id: string
    name: string
    value: string
}

type StepStatus = "not_started" | "in_progress" | "completed" | "has_error"

const SUITABILITY_QUESTIONS = [
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

const PLAN_DATA: Array<{
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
            { name: "patrimonioInvestido", label: "Patrimônio Investido Atual", type: "currency", placeholder: "R$ 0,00", required: true, helpText: "Soma de todos os seus investimentos atuais (Renda Fixa, Ações, FIIs, Fundos), excluindo a reserva de emergência." },
            { name: "aporteMensal", label: "Capacidade de Aporte Mensal", type: "currency", placeholder: "R$ 0,00", required: true, helpText: "Valor que você planeja destinar todo mês para novos investimentos." },
            { name: "objetivoPrincipal", label: "Principal Objetivo Financeiro (além da aposentadoria)", type: "select", options: ["Compra de Imóvel ou Bem de Alto Valor", "Educação dos Filhos / Família", "Abrir ou Expandir Negócio Próprio", "Transição de Carreira / Sabático", "Crescimento de Patrimônio Geral", "Independência Financeira Antecipada"], required: true },
            { 
                name: "valorObjetivoPrincipal", 
                label: (d) => {
                    const obj = d.objetivoPrincipal
                    if (obj === "Compra de Imóvel ou Bem de Alto Valor") return "Qual o valor estimado do imóvel ou bem a ser adquirido?"
                    if (obj === "Educação dos Filhos / Família") return "Qual o custo total estimado para o projeto educacional?"
                    if (obj === "Abrir ou Expandir Negócio Próprio") return "Qual o capital necessário para iniciar ou expandir o negócio?"
                    if (obj === "Transição de Carreira / Sabático") return "Qual a reserva total necessária para o período de transição?"
                    if (obj === "Independência Financeira Antecipada" || obj === "Crescimento de Patrimônio Geral") {
                        return "Qual a renda mensal que você gostaria de usufruir? (Em valores de hoje)"
                    }
                    return "Qual o valor estimado para esse objetivo?"
                },
                type: "currency", 
                placeholder: (d) => {
                    const obj = d.objetivoPrincipal
                    if (obj === "Compra de Imóvel ou Bem de Alto Valor") return "Ex: R$ 800.000,00"
                    if (obj === "Educação dos Filhos / Família") return "Ex: R$ 250.000,00"
                    if (obj === "Abrir ou Expandir Negócio Próprio") return "Ex: R$ 300.000,00"
                    if (obj === "Transição de Carreira / Sabático") return "Ex: R$ 120.000,00"
                    if (obj === "Independência Financeira Antecipada" || obj === "Crescimento de Patrimônio Geral") {
                        return "Ex: R$ 15.000,00 / mês"
                    }
                    return "R$ 0,00"
                }, 
                required: true, 
                helpText: (d) => {
                    const obj = d.objetivoPrincipal
                    if (obj === "Compra de Imóvel ou Bem de Alto Valor") return "Valor de compra do imóvel ou bem pretendido a poder de compra de hoje."
                    if (obj === "Educação dos Filhos / Família") return "Estimativa de gastos totais com faculdade, intercâmbio ou cursos."
                    if (obj === "Abrir ou Expandir Negócio Próprio") return "Capital inicial necessário para viabilizar o investimento no negócio."
                    if (obj === "Transição de Carreira / Sabático") return "Valor total para custear o período sem renda de trabalho."
                    if (obj === "Independência Financeira Antecipada" || obj === "Crescimento de Patrimônio Geral") {
                        return "Informe a renda mensal líquida desejada a poder de compra de hoje. O montante total necessário é calculado pela ARVO."
                    }
                    return "Informe o valor estimado em valores de hoje."
                }
            },
            { name: "prazoPrincipalObjetivo", label: "Em quanto tempo pretende alcançar esse objetivo?", type: "select", options: ["Curto prazo (até 2 anos)", "Médio prazo (2 a 5 anos)", "Longo prazo (5 a 10 anos)", "Mais de 10 anos"], required: true },
            { name: "acumuladoObjetivoPrincipal", label: "Quanto você já tem reservado para esse objetivo? (Opcional)", type: "currency", placeholder: "R$ 0,00", required: false },
            { name: "prioridadeAportes", label: "Prioridade Imediata dos seus Próximos Aportes", type: "select", options: ["Completar Reserva de Emergência", "Acelerar esse Objetivo de Médio Prazo", "Acelerar Aposentadoria / Liberdade Financeira", "Diversificação Internacional"], required: true }
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

const ROUTE_PROGRESS_DESCRIPTIONS = [
    "Marco 1: Mapeie suas entradas e gastos essenciais. É o ponto de partida onde todo o plano financeiro se apoia.",
    "Marco 2: Identifique vulnerabilidades pessoais e familiares para isolar riscos de perda de renda ou despesas graves.",
    "Marco 3: Estruture suas metas patrimoniais e alinhe o valor e o prazo com a sua capacidade de aporte mensal.",
    "Marco 4: Calcule o patrimônio necessário para a aposentadoria sustentável e descubra se há gap na projeção.",
    "Marco 5: Avalie sua eficiência no Imposto de Renda e analise a oportunidade de diferimento fiscal via PGBL.",
    "Marco 6: Organize a estrutura patrimonial e familiar para mitigar custos de ITCMD e burocracias de inventário.",
    "Marco 7: Responda as 6 perguntas de suitability para calibrar sua tolerância a risco e sua Carteira da Bússola."
]

// ─── VALIDATION ENGINE ────────────────────────────────────────────────────────
function validateStepFields(
    stepIndex: number, 
    formData: Record<string, string>
): { isValid: boolean; errors: Record<string, string>; missingFields: string[] } {
    const errors: Record<string, string> = {}
    const missingFields: string[] = []

    if (stepIndex === 0) {
        // Marco 1: Raio-X Financeiro & Fluxo de Caixa
        const parseDigits = (v?: string) => parseInt((v || "").replace(/\D/g, "") || "0", 10)
        
        const hasIncome = 
            parseDigits(formData.salarioLiquido) > 0 ||
            parseDigits(formData.rendaClt) > 0 ||
            parseDigits(formData.rendaProLabore) > 0 ||
            parseDigits(formData.rendaLucrosDividendos) > 0 ||
            parseDigits(formData.rendaAlugueis) > 0 ||
            parseDigits(formData.rendaInvestimentos) > 0 ||
            parseDigits(formData.rendaPensaoAposentadoria) > 0 ||
            parseDigits(formData.rendaExtraFreelance) > 0

        if (!hasIncome) {
            errors.salarioLiquido = "Informe ao menos uma fonte de renda mensal líquida."
            missingFields.push("salarioLiquido")
        }

        if (!formData.tipoVinculo?.trim()) {
            errors.tipoVinculo = "Selecione o vínculo profissional principal."
            missingFields.push("tipoVinculo")
        }

        const hasBasketExpenses = Object.keys(formData).some(k => k.startsWith("gasto_") && parseDigits(formData[k]) > 0)
        const hasLegacyExpenses = 
            parseDigits(formData.gastoMoradia) > 0 ||
            parseDigits(formData.gastoAlimentacao) > 0 ||
            parseDigits(formData.gastoTransporte) > 0 ||
            parseDigits(formData.gastoSaude) > 0

        let hasCustomExpenses = false
        if (formData.customExpensesJson) {
            try {
                const parsed = JSON.parse(formData.customExpensesJson)
                if (Array.isArray(parsed) && parsed.some((p: any) => parseDigits(p.value) > 0)) {
                    hasCustomExpenses = true
                }
            } catch (e) {}
        }

        if (!hasBasketExpenses && !hasLegacyExpenses && !hasCustomExpenses) {
            errors.gastos = "Preencha seus gastos habituais ou importe uma fatura de cartão."
            missingFields.push("gastos")
        }

        return { isValid: missingFields.length === 0, errors, missingFields }
    }

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

        const fieldLabel = getFieldLabel(field, formData)
        const value = formData[field.name]?.trim() ?? ""

        if (field.required && !value) {
            errors[field.name] = `O campo "${fieldLabel}" é obrigatório.`
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

        if (field.type === "currency") {
            const cleanDigits = value.replace(/\D/g, "")
            const num = parseInt(cleanDigits || "0", 10)
            if (field.required && (!cleanDigits || num === 0)) {
                errors[field.name] = `Informe o valor para "${fieldLabel}".`
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

function computeStepStatus(
    stepIndex: number,
    formData: Record<string, string>,
    attemptedSteps: Set<number>
): StepStatus {
    if (!formData || Object.keys(formData).length === 0) {
        return "not_started"
    }

    if (stepIndex === 0) {
        const validation = validateStepFields(0, formData)
        if (validation.isValid) return "completed"
        const parseDigits = (v?: string) => parseInt((v || "").replace(/\D/g, "") || "0", 10)
        const hasAny = parseDigits(formData.salarioLiquido) > 0 || 
            parseDigits(formData.rendaClt) > 0 || 
            parseDigits(formData.rendaProLabore) > 0 ||
            Boolean(formData.tipoVinculo?.trim()) ||
            Object.keys(formData).some(k => k.startsWith("gasto_") && parseDigits(formData[k]) > 0)
        if (hasAny) return "in_progress"
        return "not_started"
    }

    if (stepIndex === 6) {
        const answeredCount = SUITABILITY_QUESTIONS.filter(q => Boolean(formData[q.name]?.trim())).length
        if (answeredCount === SUITABILITY_QUESTIONS.length) return "completed"
        if (answeredCount > 0) return "in_progress"
        return "not_started"
    }

    const step = PLAN_DATA[stepIndex]
    if (!step || !step.fields || step.fields.length === 0) return "not_started"

    const validation = validateStepFields(stepIndex, formData)
    
    const activeFields = step.fields.filter(f => !f.conditional || f.conditional(formData))
    const filledFields = activeFields.filter(f => {
        const val = formData[f.name]?.trim()
        return val !== undefined && val !== "" && val !== "R$ 0,00" && val !== "R$ 0"
    })

    if (filledFields.length === 0) return "not_started"

    // Only mark completed if ALL active required fields are valid and fully filled
    if (validation.isValid) {
        return "completed"
    }

    return "in_progress"
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function PlanejamentoJornadaPage() {
    const [current, setCurrent] = useState(0)
    const [formData, setFormData] = useState<Record<string, string>>({})
    const [customExpenses, setCustomExpenses] = useState<CustomExpense[]>([])
    const [showDashboard, setShowDashboard] = useState(false)
    const [isHydrated, setIsHydrated] = useState(false)
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
        let isMounted = true

        // 1. Instantly read local draft
        if (typeof window !== "undefined") {
            try {
                const localRaw = localStorage.getItem("arvo_jornada_draft_v2")
                if (localRaw) {
                    const parsed = JSON.parse(localRaw)
                    if (parsed && typeof parsed === "object") {
                        setFormData(parsed)
                        if (parsed.customExpensesJson) {
                            try {
                                const exp = JSON.parse(parsed.customExpensesJson)
                                if (Array.isArray(exp)) setCustomExpenses(exp)
                            } catch (e) {}
                        }
                    }
                }
            } catch (e) {
                console.warn("Could not read local draft:", e)
            }
        }

        // 2. Fetch server progress with timeout race
        async function syncServerProgress() {
            try {
                const serverCall = getJornadaProgress()
                const timeoutCall = new Promise<{ success: false }>((resolve) => 
                    setTimeout(() => resolve({ success: false }), 800)
                )
                const res = await Promise.race([serverCall, timeoutCall])
                
                if (!isMounted) return
                if (res && "success" in res && res.success && (res as any).data) {
                    const serverData = (res as any).data as Record<string, string>
                    // Only populate from server if local form data is empty
                    setFormData(prev => {
                        if (Object.keys(prev).length === 0) {
                            return serverData
                        }
                        return prev
                    })
                    if ((res as any).isCompleted) {
                        setShowDashboard(true)
                    }
                    if (serverData.customExpensesJson) {
                        setCustomExpenses(prev => {
                            if (prev.length === 0) {
                                try {
                                    const parsed = JSON.parse(serverData.customExpensesJson)
                                    if (Array.isArray(parsed)) return parsed
                                } catch (e) {}
                            }
                            return prev
                        })
                    }
                    const isAllSuitabilityAnswered = SUITABILITY_QUESTIONS.every(q => Boolean(serverData[q.name]))
                }
            } catch (e) {
                console.warn("Could not sync server progress:", e)
            } finally {
                if (isMounted) {
                    setIsHydrated(true)
                    setLastSavedTime(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }))
                }
            }
        }

        syncServerProgress()

        const handleBeforeUnload = () => {
            if (pendingSaveRef.current) {
                saveJornadaProgress(pendingSaveRef.current.data, pendingSaveRef.current.isCompleted).catch(() => {})
            }
        }
        window.addEventListener("beforeunload", handleBeforeUnload)

        return () => {
            isMounted = false
            window.removeEventListener("beforeunload", handleBeforeUnload)
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current)
                saveTimeoutRef.current = null
            }
            if (pendingSaveRef.current) {
                saveJornadaProgress(pendingSaveRef.current.data, pendingSaveRef.current.isCompleted).catch(() => {})
                pendingSaveRef.current = null
            }
        }
    }, [])

    // ─── PERSISTENCE (DEBOUNCED SAVE) ──────────────────────────────────────────
    const pendingSaveRef = useRef<{ data: Record<string, string>; isCompleted: boolean } | null>(null)

    const triggerSave = useCallback((dataToSave: Record<string, string>, isCompletedFlag: boolean = false) => {
        setSaveStatus("saving")
        pendingSaveRef.current = { data: dataToSave, isCompleted: isCompletedFlag }
        
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
                    if (pendingSaveRef.current?.data === dataToSave) {
                        pendingSaveRef.current = null
                    }
                } else {
                    setSaveStatus("error")
                }
            } catch (error) {
                setSaveStatus("error")
            }
        }, 400)
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

    // Handle batch updates (e.g. from credit card invoice reconciliation)
    const handleBulkChange = useCallback((updates: Record<string, string>) => {
        setFormData((prev) => {
            const nextData = { ...prev, ...updates }
            triggerSave(nextData, false)
            return nextData
        })
        setSaveStatus("pending")
    }, [triggerSave])

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

    // Advance to next step (non-blocking, saves progress)
    const goNext = async () => {
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

    if (!isHydrated) {
        return (
            <div className="min-h-[calc(100vh-62px)] flex flex-col items-center justify-center bg-[#f6f4ef] text-[#123044] space-y-3">
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
                
                {/* ─── HEADER & NAUTICAL ROUTE STATUS ────────────────────────────────── */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
                    <div className="max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-dash-accent-light text-dash-accent text-[11px] font-bold rounded-full border border-dash-border">
                                <Compass size={13} />
                                Carta Náutica ARVO · Rota Patrimonial
                            </span>
                            
                            {/* Save Status Indicator */}
                            <div className="inline-flex items-center gap-1.5 text-xs text-dash-text-light px-2.5 py-0.5">
                                {saveStatus === "saving" && (
                                    <>
                                        <Loader2 size={12} className="animate-spin text-dash-accent" />
                                        <span>Salvando rota...</span>
                                    </>
                                )}
                                {saveStatus === "saved" && lastSavedTime && (
                                    <>
                                        <Check size={12} className="text-dash-accent" />
                                        <span>Salvo às {lastSavedTime}</span>
                                    </>
                                )}
                                {saveStatus === "pending" && (
                                    <span className="text-amber-700">Alterações pendentes</span>
                                )}
                                {saveStatus === "error" && (
                                    <span className="text-red-600 flex items-center gap-1">
                                        <AlertCircle size={12} /> Salvo apenas localmente
                                    </span>
                                )}
                            </div>
                        </div>

                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight text-dash-text leading-snug">
                            Diagnóstico em <span className="font-semibold text-dash-text">7 Marcos Estratégicos</span>
                        </h1>
                        <p className="text-dash-text-light text-sm sm:text-base mt-2 leading-relaxed">
                            Organizamos suas finanças com dados reais para identificar vulnerabilidades, projetar sua independência e calibrar sua Bússola de Investimentos.
                        </p>
                    </div>

                    {/* Consolidated Progress Pill */}
                    <div className="flex items-center gap-3 bg-white border border-dash-border rounded-2xl px-4 py-3 shadow-xs shrink-0 self-start md:self-auto">
                        <div className="w-10 h-10 rounded-xl bg-dash-accent-light text-dash-accent flex items-center justify-center font-extrabold text-sm tabular-nums">
                            {globalProgressPct}%
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-dash-text-light uppercase tracking-wider">
                                Progresso da Rota
                            </div>
                            <div className="text-xs font-extrabold text-dash-text tabular-nums">
                                {completedStepsCount} de {PLAN_DATA.length} marcos concluídos
                            </div>
                        </div>
                    </div>
                </header>

                {/* ─── TRILHA DE MARCOS ESTRATÉGICOS ────────────────────────────────── */}
                <section aria-label="Trilha de Navegação dos 7 Marcos" className="bg-white border border-dash-border rounded-3xl p-4 sm:p-6 md:p-7 shadow-xs">
                    
                    {/* Top track bar with current step title */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 mb-5 border-b border-dash-border/60">
                        <div className="flex items-center gap-2">
                            <span className="text-base font-bold text-[#123044]">
                                {currentStepData.title}
                            </span>
                        </div>
                        <div className="text-xs text-dash-text-light flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#1F674F] shrink-0" />
                            <span className="font-medium text-[#667085]">{ROUTE_PROGRESS_DESCRIPTIONS[current]}</span>
                        </div>
                    </div>

                    {/* Nautical Route Waypoints Track */}
                    <div className="relative overflow-x-auto no-scrollbar py-2">
                        <div className="min-w-[720px] lg:min-w-0 relative">
                            
                            {/* Segmented Connecting Lines between Waypoint Nodes */}
                            <div className="absolute top-[24px] left-0 right-0 h-0.5 -z-0 pointer-events-none">
                                {Array.from({ length: 6 }).map((_, i) => {
                                    const isSegmentPassed = i < current
                                    const leftPct = ((i + 0.5) / 7) * 100
                                    const widthPct = (1 / 7) * 100

                                    return (
                                        <div
                                            key={i}
                                            className="absolute top-0 h-0.5"
                                            style={{
                                                left: `${leftPct}%`,
                                                width: `${widthPct}%`,
                                            }}
                                        >
                                            {isSegmentPassed ? (
                                                <div className="w-full h-0.5 bg-[#1F674F] transition-all duration-300" />
                                            ) : (
                                                <div className="w-full h-0.5 border-t-2 border-dashed border-[#e4dfd5]" />
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Waypoint Nodes Grid */}
                            <div className="grid grid-cols-7 gap-2 relative z-10">
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
                                            className="flex flex-col items-center text-center group cursor-pointer transition-transform duration-150 focus:outline-none"
                                        >
                                            {/* Waypoint Beacon Node */}
                                            <div className="relative flex items-center justify-center mb-3">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 relative z-10 ${
                                                    isCurrent
                                                        ? "bg-[#1F674F] border-2 border-[#1F674F] shadow-md ring-4 ring-[#1F674F]/20 scale-110"
                                                        : "bg-white border-2 border-[#e4dfd5] hover:border-[#1F674F] hover:bg-[#faf9f5] shadow-xs"
                                                }`}>
                                                    <span 
                                                        className={`tabular-nums text-base font-bold leading-none ${
                                                            isCurrent ? "text-white" : "text-[#123044]"
                                                        }`}
                                                        style={isCurrent ? { color: "#ffffff" } : { color: "#123044" }}
                                                    >
                                                        {idx + 1}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Labels below node */}
                                            <div className="mt-2 w-full px-0.5">
                                                <div className={`text-xs leading-snug transition-colors line-clamp-2 min-h-[32px] flex items-center justify-center ${
                                                    isCurrent ? "text-[#1F674F] font-extrabold" : "text-[#123044] font-medium group-hover:text-[#1F674F]"
                                                }`}>
                                                    {item.title.replace(/:.*/, "")}
                                                </div>
                                                <div className="text-[10px] font-medium text-slate-400 leading-tight mt-0.5 whitespace-normal">
                                                    {item.short}
                                                </div>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>

                        </div>
                    </div>
                </section>

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
                                    <span>{currentStepData.status}</span>
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

                                                    <div className="flex items-center gap-3">
                                                        {SUITABILITY_QUESTIONS.every(q => Boolean(formData[q.name]?.trim())) && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowQuizResult(true)}
                                                                className="text-[11px] font-extrabold text-[#1f674f] hover:text-[#123044] bg-[#e8f1ed] hover:bg-[#d6e5de] px-2.5 py-1 rounded-lg border border-[#1f674f]/20 transition-colors cursor-pointer"
                                                            >
                                                                Ver Diagnóstico ({suitabilityDiagnostic.label}) →
                                                            </button>
                                                        )}

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
                                                                    <span 
                                                                        className={`w-7 h-7 rounded-lg text-xs flex items-center justify-center shrink-0 font-extrabold ${
                                                                            isSelected ? "bg-amber-400 shadow-xs" : "bg-[#e8f1ed]"
                                                                        }`}
                                                                        style={{ color: isSelected ? "#0F2A3D" : "#1F674F" }}
                                                                    >
                                                                        {opt.letter}
                                                                    </span>
                                                                    <span 
                                                                        className="text-sm font-medium leading-relaxed" 
                                                                        style={{ color: isSelected ? "#FFFFFF" : "#123044" }}
                                                                    >
                                                                        {opt.text}
                                                                    </span>
                                                                </div>
                                                                {isSelected && (
                                                                    <span className="w-6 h-6 rounded-full bg-amber-400/20 border border-amber-400 flex items-center justify-center shrink-0 shadow-xs">
                                                                        <Check size={14} className="text-amber-400" style={{ color: "#FBBF24" }} strokeWidth={3.5} />
                                                                    </span>
                                                                )}
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
                            ) : current === 0 ? (
                                /* ─── MARCO 1: RAIO-X FINANCEIRO & FLUXO DE CAIXA COMPLETO ─── */
                                <div className="space-y-6 my-2">
                                    <RaioXFluxoCaixa
                                        formData={formData}
                                        onChange={handleInputChange}
                                        onBulkChange={handleBulkChange}
                                    />

                                    {/* ─── DELIVERABLES LIST DO MARCO 1 ─── */}
                                    <div className="mt-8 pt-6 border-t border-[#e4e0d7]">
                                        <span className="text-xs font-bold text-[#667085] uppercase tracking-wider block mb-3">
                                            Entregáveis do Marco 1
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
                                </div>
                            ) : (
                                /* ─── ETAPAS 2 A 6: FORMULÁRIO DE MARCOS ────────────────────────── */
                                <>
                                    <div className="grid md:grid-cols-2 gap-5 sm:gap-6 my-4">
                                        {currentStepData.fields.map((field) => {
                                            if (field.conditional && !field.conditional(formData)) {
                                                return null
                                            }

                                            const val = formData[field.name] || ""
                                            const hasFieldError = Boolean(fieldErrors[field.name])
                                            const fieldId = `field-${field.name}`
                                            const fieldLabel = getFieldLabel(field, formData)
                                            const fieldHelpText = getFieldHelpText(field, formData)
                                            const fieldPlaceholder = getFieldPlaceholder(field, formData)

                                            return (
                                                <Fragment key={field.name}>
                                                    <div 
                                                        className={`space-y-1.5 ${field.type === "radio" ? "md:col-span-2" : ""}`}
                                                    >
                                                        <div className="flex justify-between items-baseline">
                                                            <label 
                                                                htmlFor={fieldId} 
                                                                className="text-xs font-bold text-[#123044] flex items-center gap-1"
                                                            >
                                                                {fieldLabel}
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
                                                                    placeholder={fieldPlaceholder || "R$ 0,00"}
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
                                                                placeholder={fieldPlaceholder}
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
                                                                placeholder={fieldPlaceholder}
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
                                                                aria-label={fieldLabel}
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
                                                                                ? "bg-[#123044] text-white !text-white border-[#123044] shadow-sm" 
                                                                                : hasFieldError
                                                                                    ? "bg-red-50/40 text-[#123044] border-red-200 hover:bg-[#e4e0d7]/60"
                                                                                    : "bg-[#f6f4ef] text-[#123044] border-[#e4e0d7] hover:bg-[#e4e0d7]/60"
                                                                        }`}
                                                                        style={val === opt ? { color: "#ffffff" } : undefined}
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
                                                        ) : fieldHelpText ? (
                                                            <p className="text-[11px] text-[#667085] leading-normal">
                                                                {fieldHelpText}
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                </Fragment>
                                            )
                                        })}
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

