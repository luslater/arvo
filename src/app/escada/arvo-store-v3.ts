/**
 * ARVO – Escada Patrimonial v3
 * Zustand Store — Estado global isolado da UI
 *
 * v3: @dnd-kit integrado, bucket entries com IDs,
 *     fundos com yield/risco, modal de alocação, engine status.
 */

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// ─── Tipos exportados ────────────────────────────────────────────────────────

export type ProfileKey =
    | "conservador"
    | "moderado_conservador"
    | "moderado"
    | "arrojado";

export type StepKey =
    | "reserva"
    | "abrigo"
    | "ritmo"
    | "vanguarda"
    | "oceano";

export type ExpenseKey =
    | "moradia"
    | "contas"
    | "supermercado"
    | "cartao"
    | "transporte"
    | "saude"
    | "educacao"
    | "lazer"
    | "outros";

export type StepStatus =
    | "locked"
    | "empty"
    | "filling"
    | "in_range"
    | "over_range"
    | "not_applicable";

export type ReserveMultiplier = 6 | 9 | 12 | 18;
export type SectionKey = "quiz" | "dados" | "motor" | "agendamento";

// ─── Fund Card ───────────────────────────────────────────────────────────────

export interface FundCard {
    id: string;
    name: string;        // nome completo
    shortName: string;   // nome curto para card
    type: string;        // "Renda Fixa", "Multimercado", etc.
    category: StepKey;   // camada ideal
    color: string;       // cor do chip
    yield12m: string;    // "CDI + 0,5%", "IPCA + 6,2%"
    risk: number;        // 1-5 barras
    description: string;
}

export interface BucketEntry {
    entryId: string;
    fundId: string | null;   // null = fundo externo
    customName?: string;
    value: number;
}

// ─── Band / Range ────────────────────────────────────────────────────────────

export interface Band {
    min: number;
    target: number;
    max: number;
}

// ─── Questionário de Suitability ─────────────────────────────────────────────

export interface SuitabilityQuestion {
    id: string;
    text: string;
    options: { text: string; points: number }[];
}

export const SUITABILITY_QUESTIONS: SuitabilityQuestion[] = [
    {
        id: "q1_horizonte",
        text: "Qual o seu horizonte de investimento?",
        options: [
            { text: "Menos de 1 ano", points: 1 },
            { text: "1 a 3 anos", points: 2 },
            { text: "3 a 7 anos", points: 3 },
            { text: "Mais de 7 anos", points: 4 },
        ],
    },
    {
        id: "q2_reacao_queda",
        text: "Se seus investimentos caíssem 20% em um mês, o que você faria?",
        options: [
            { text: "Resgataria tudo imediatamente", points: 1 },
            { text: "Resgataria parte para reduzir o risco", points: 2 },
            { text: "Manteria e aguardaria a recuperação", points: 3 },
            { text: "Aproveitaria para investir mais", points: 4 },
        ],
    },
    {
        id: "q3_objetivo",
        text: "Qual o principal objetivo para este patrimônio?",
        options: [
            { text: "Preservar capital e ter liquidez", points: 1 },
            { text: "Gerar renda complementar estável", points: 2 },
            { text: "Crescer patrimônio com equilíbrio", points: 3 },
            { text: "Maximizar retorno aceitando volatilidade", points: 4 },
        ],
    },
    {
        id: "q4_experiencia",
        text: "Qual a sua experiência com investimentos?",
        options: [
            { text: "Só poupança e renda fixa simples", points: 1 },
            { text: "Já investi em fundos e CDBs", points: 2 },
            { text: "Tenho fundos multimercado e ações", points: 3 },
            { text: "Opero ativamente diversas classes", points: 4 },
        ],
    },
    {
        id: "q5_renda_necessaria",
        text: "Você depende do retorno desses investimentos para o dia a dia?",
        options: [
            { text: "Sim, dependo integralmente", points: 1 },
            { text: "Parcialmente, complementa minha renda", points: 2 },
            { text: "Não, tenho renda separada suficiente", points: 3 },
            { text: "Não, posso reinvestir 100% dos ganhos", points: 4 },
        ],
    },
    {
        id: "q6_volatilidade",
        text: "Como você enxerga oscilações de mercado?",
        options: [
            { text: "Me causam ansiedade, prefiro evitar", points: 1 },
            { text: "Aceito pequenas oscilações por mais retorno", points: 2 },
            { text: "Entendo como natural e mantenho a estratégia", points: 3 },
            { text: "Vejo como oportunidade de compra", points: 4 },
        ],
    },
    {
        id: "q7_conhecimento",
        text: "Qual afirmação melhor descreve seu conhecimento?",
        options: [
            { text: "Não sei a diferença entre renda fixa e variável", points: 1 },
            { text: "Conheço o básico de renda fixa e fundos", points: 2 },
            { text: "Entendo classes de ativos e diversificação", points: 3 },
            { text: "Analiso fundos, gestores e estratégias", points: 4 },
        ],
    },
    {
        id: "q8_perda_maxima",
        text: "Qual a perda máxima que você aceitaria em 12 meses?",
        options: [
            { text: "Nenhuma — não quero perder nada", points: 1 },
            { text: "Até 5% do patrimônio", points: 2 },
            { text: "Até 15% do patrimônio", points: 3 },
            { text: "Até 30% se o potencial de ganho for alto", points: 4 },
        ],
    },
];

export function scoreToProfile(totalScore: number): ProfileKey {
    if (totalScore <= 13) return "conservador";
    if (totalScore <= 20) return "moderado_conservador";
    if (totalScore <= 26) return "moderado";
    return "arrojado";
}

// ─── Ranges por perfil ───────────────────────────────────────────────────────

export const PROFILE_BANDS: Record<
    ProfileKey,
    Record<Exclude<StepKey, "reserva">, Band>
> = {
    conservador: {
        abrigo: { min: 60, target: 70, max: 80 },
        ritmo: { min: 10, target: 20, max: 30 },
        vanguarda: { min: 0, target: 10, max: 15 },
        oceano: { min: 0, target: 0, max: 5 },
    },
    moderado_conservador: {
        abrigo: { min: 45, target: 55, max: 65 },
        ritmo: { min: 15, target: 25, max: 35 },
        vanguarda: { min: 5, target: 15, max: 25 },
        oceano: { min: 0, target: 5, max: 15 },
    },
    moderado: {
        abrigo: { min: 25, target: 35, max: 45 },
        ritmo: { min: 20, target: 30, max: 40 },
        vanguarda: { min: 10, target: 20, max: 30 },
        oceano: { min: 5, target: 15, max: 25 },
    },
    arrojado: {
        abrigo: { min: 10, target: 20, max: 30 },
        ritmo: { min: 15, target: 25, max: 35 },
        vanguarda: { min: 20, target: 30, max: 40 },
        oceano: { min: 15, target: 25, max: 35 },
    },
};

// ─── Step Order + Meta ───────────────────────────────────────────────────────

export const STEP_ORDER: StepKey[] = [
    "reserva", "abrigo", "ritmo", "vanguarda", "oceano",
];

export const BUCKET_COLORS: Record<StepKey, string> = {
    reserva: "blue",
    abrigo: "indigo",
    ritmo: "violet",
    vanguarda: "amber",
    oceano: "cyan",
};

export const BUCKET_META: Record<StepKey, { title: string; subtitle: string }> = {
    reserva: { title: "Reserva", subtitle: "Proteção e liquidez" },
    abrigo: { title: "Abrigo", subtitle: "Base conservadora" },
    ritmo: { title: "Ritmo", subtitle: "Crescimento equilibrado" },
    vanguarda: { title: "Vanguarda", subtitle: "Expansão e performance" },
    oceano: { title: "Oceano", subtitle: "Estratégia arrojada" },
};

// ─── Biblioteca de fundos ────────────────────────────────────────────────────

export const FUNDS_LIBRARY: FundCard[] = [
    // Reserva — blue
    { id: "tesouro_selic", name: "Tesouro Selic", shortName: "Tesouro Selic", type: "Renda Fixa", category: "reserva", color: "blue", yield12m: "CDI", risk: 1, description: "Liquidez D+0, risco soberano" },
    { id: "fundo_simples", name: "Fundo Simples DI", shortName: "Fundo DI", type: "Renda Fixa", category: "reserva", color: "blue", yield12m: "CDI – 0,1%", risk: 1, description: "Fundo DI com taxa zero" },
    { id: "cdb_liquidez", name: "CDB Liquidez Diária", shortName: "CDB Liq.", type: "Renda Fixa", category: "reserva", color: "blue", yield12m: "100% CDI", risk: 1, description: "FGC até 250k" },
    { id: "conta_remunerada", name: "Conta Remunerada", shortName: "Conta Rem.", type: "Renda Fixa", category: "reserva", color: "blue", yield12m: "100% CDI", risk: 1, description: "Rendimento automático" },
    // Abrigo — indigo
    { id: "credito_hg", name: "Crédito High Grade", shortName: "Crédito HG", type: "Renda Fixa", category: "abrigo", color: "indigo", yield12m: "CDI + 0,8%", risk: 2, description: "Qualidade de crédito AA+" },
    { id: "inflacao_curta", name: "Inflação Duration Curta", shortName: "IPCA Curta", type: "Renda Fixa", category: "abrigo", color: "indigo", yield12m: "IPCA + 5,8%", risk: 2, description: "Duration até 2 anos" },
    { id: "pos_fixados", name: "Pós-fixados CDI+", shortName: "Pós-fixados", type: "Renda Fixa", category: "abrigo", color: "indigo", yield12m: "CDI + 1,2%", risk: 2, description: "Baixa volatilidade" },
    { id: "mm_defensivo", name: "Multimercado Defensivo", shortName: "MM Defensivo", type: "Multimercado", category: "abrigo", color: "indigo", yield12m: "CDI + 2%", risk: 2, description: "Gestão ativa conservadora" },
    // Ritmo — violet
    { id: "inflacao", name: "Inflação Duration Média", shortName: "IPCA Média", type: "Renda Fixa", category: "ritmo", color: "violet", yield12m: "IPCA + 6,2%", risk: 3, description: "Duration 3-5 anos" },
    { id: "credito_privado", name: "Crédito Privado", shortName: "Crédito Priv.", type: "Renda Fixa", category: "ritmo", color: "violet", yield12m: "CDI + 2,5%", risk: 3, description: "Crédito corporativo selecionado" },
    { id: "mm_conservador", name: "Multimercado Conservador", shortName: "MM Conserv.", type: "Multimercado", category: "ritmo", color: "violet", yield12m: "CDI + 3%", risk: 3, description: "Gestão ativa equilibrada" },
    { id: "balanceadas", name: "Estratégias Balanceadas", shortName: "Balanceado", type: "Multimercado", category: "ritmo", color: "violet", yield12m: "CDI + 4%", risk: 3, description: "Mix RF + RV" },
    // Vanguarda — amber
    { id: "multimercados", name: "Multimercados Livre", shortName: "MM Livre", type: "Multimercado", category: "vanguarda", color: "amber", yield12m: "CDI + 5%", risk: 4, description: "Gestão ativa livre" },
    { id: "acoes_brasil", name: "Ações Brasil", shortName: "Ações BR", type: "Ações", category: "vanguarda", color: "amber", yield12m: "Ibov + α", risk: 4, description: "Bolsa brasileira" },
    { id: "long_bias", name: "Long Bias", shortName: "Long Bias", type: "Ações", category: "vanguarda", color: "amber", yield12m: "CDI + 8%", risk: 4, description: "Ações com proteção parcial" },
    { id: "assimetricas", name: "Estratégias Assimétricas", shortName: "Assimétricas", type: "Multimercado", category: "vanguarda", color: "amber", yield12m: "Target 15%+", risk: 5, description: "High alpha/risk" },
    // Oceano — cyan
    { id: "fundos_intl", name: "Fundos Internacionais", shortName: "Intl.", type: "Arrojado", category: "oceano", color: "cyan", yield12m: "S&P + hedge", risk: 4, description: "Mercados globais" },
    { id: "dolar", name: "Dólar", shortName: "Dólar", type: "Câmbio", category: "oceano", color: "cyan", yield12m: "USD", risk: 3, description: "Hedge cambial" },
    { id: "acoes_globais", name: "Ações Globais", shortName: "Ações Global", type: "Arrojado", category: "oceano", color: "cyan", yield12m: "MSCI + α", risk: 4, description: "Bolsas internacionais" },
    { id: "rf_internacional", name: "Renda Fixa Internacional", shortName: "RF Intl.", type: "Arrojado", category: "oceano", color: "cyan", yield12m: "T-Bill + 2%", risk: 3, description: "Bonds e treasuries" },
];

// ─── Defaults ────────────────────────────────────────────────────────────────

type ExpenseMap = Record<ExpenseKey, number>;

const DEFAULT_EXPENSES: ExpenseMap = {
    moradia: 0, contas: 0, supermercado: 0, cartao: 0,
    transporte: 0, saude: 0, educacao: 0, lazer: 0, outros: 0,
};

const DEFAULT_BUCKETS: Record<StepKey, BucketEntry[]> = {
    reserva: [], abrigo: [], ritmo: [], vanguarda: [], oceano: [],
};

// ─── Interface do Store ──────────────────────────────────────────────────────

export interface ArvoStoreV3 {
    // Seção ativa
    activeSection: SectionKey;

    // Quiz
    quizAnswers: Record<string, number>;
    quizComplete: boolean;

    // Perfil
    perfil: ProfileKey | null;

    // Dados financeiros
    expenses: ExpenseMap;
    useCalculatorTotal: boolean;
    manualMonthlyCost: number;
    multiplicadorReserva: ReserveMultiplier;
    rendaMensal: number;
    patrimonioAtual: number;
    dadosComplete: boolean;

    // Buckets (potes com entries)
    buckets: Record<StepKey, BucketEntry[]>;

    // Pending allocation modal
    pendingAllocation: {
        fundId: string | null;
        bucketKey: StepKey;
        customName?: string;
    } | null;

    // Editing an existing entry
    editingEntry: {
        bucketKey: StepKey;
        entryId: string;
    } | null;

    // Agendamento
    nome: string;
    email: string;
    telefone: string;
    hasUpload: boolean;

    // ── Actions ────────────────────────────────────────────────────────────

    setActiveSection(s: SectionKey): void;

    // Quiz
    answerQuestion(questionId: string, points: number): void;
    finishQuiz(): void;
    resetQuiz(): void;

    // Dados
    setExpense(key: ExpenseKey, value: number): void;
    setUseCalculatorTotal(value: boolean): void;
    setManualMonthlyCost(value: number): void;
    setMultiplicadorReserva(value: ReserveMultiplier): void;
    setRendaMensal(value: number): void;
    setPatrimonioAtual(value: number): void;
    confirmDados(): void;

    // Buckets
    openPendingAllocation(fundId: string | null, bucketKey: StepKey): void;
    cancelPendingAllocation(): void;
    confirmAllocation(value: number): void;
    openEditEntry(bucketKey: StepKey, entryId: string): void;
    updateEntryValue(bucketKey: StepKey, entryId: string, value: number): void;
    cancelEditEntry(): void;
    removeEntry(bucketKey: StepKey, entryId: string): void;

    // Agendamento
    setNome(v: string): void;
    setEmail(v: string): void;
    setTelefone(v: string): void;
    setHasUpload(v: boolean): void;
}

// ─── Helper ──────────────────────────────────────────────────────────────────

let nextEntryId = 1;
function genEntryId(): string {
    return `entry-${Date.now()}-${nextEntryId++}`;
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useArvoStoreV3 = create<ArvoStoreV3>()(
    devtools(
        persist(
            (set, get) => ({
                activeSection: "quiz",

                quizAnswers: {},
                quizComplete: false,
                perfil: null,

                expenses: { ...DEFAULT_EXPENSES },
                useCalculatorTotal: true,
                manualMonthlyCost: 0,
                multiplicadorReserva: 6,
                rendaMensal: 0,
                patrimonioAtual: 0,
                dadosComplete: false,

                buckets: { ...DEFAULT_BUCKETS },

                pendingAllocation: null,
                editingEntry: null,

                nome: "",
                email: "",
                telefone: "",
                hasUpload: false,

                // ── Implementations ──────────────────────────────────────────────

                setActiveSection: (s) => set({ activeSection: s }),

                answerQuestion: (questionId, points) =>
                    set((s) => ({
                        quizAnswers: { ...s.quizAnswers, [questionId]: points },
                    })),

                finishQuiz: () =>
                    set((s) => {
                        const total = Object.values(s.quizAnswers).reduce((a, v) => a + v, 0);
                        return {
                            quizComplete: true,
                            perfil: scoreToProfile(total),
                            activeSection: "dados",
                        };
                    }),

                resetQuiz: () =>
                    set({
                        quizAnswers: {},
                        quizComplete: false,
                        perfil: null,
                        dadosComplete: false,
                        activeSection: "quiz",
                    }),

                setExpense: (key, value) =>
                    set((s) => ({
                        expenses: { ...s.expenses, [key]: Math.max(0, value) },
                    })),

                setUseCalculatorTotal: (v) => set({ useCalculatorTotal: v }),
                setManualMonthlyCost: (v) => set({ manualMonthlyCost: Math.max(0, v) }),
                setMultiplicadorReserva: (v) => set({ multiplicadorReserva: v }),
                setRendaMensal: (v) => set({ rendaMensal: Math.max(0, v) }),
                setPatrimonioAtual: (v) => set({ patrimonioAtual: Math.max(0, v) }),

                confirmDados: () =>
                    set({ dadosComplete: true, activeSection: "motor" }),

                // ── Bucket allocation ────────────────────────────────────────────

                openPendingAllocation: (fundId, bucketKey) =>
                    set({ pendingAllocation: { fundId, bucketKey }, editingEntry: null }),

                cancelPendingAllocation: () =>
                    set({ pendingAllocation: null }),

                confirmAllocation: (value) =>
                    set((s) => {
                        const pa = s.pendingAllocation;
                        if (!pa || value <= 0) return { pendingAllocation: null };

                        const entry: BucketEntry = {
                            entryId: genEntryId(),
                            fundId: pa.fundId,
                            customName: pa.customName,
                            value,
                        };

                        return {
                            pendingAllocation: null,
                            buckets: {
                                ...s.buckets,
                                [pa.bucketKey]: [...s.buckets[pa.bucketKey], entry],
                            },
                        };
                    }),

                openEditEntry: (bucketKey, entryId) =>
                    set({ editingEntry: { bucketKey, entryId }, pendingAllocation: null }),

                updateEntryValue: (bucketKey, entryId, value) =>
                    set((s) => ({
                        editingEntry: null,
                        buckets: {
                            ...s.buckets,
                            [bucketKey]: s.buckets[bucketKey].map((e) =>
                                e.entryId === entryId ? { ...e, value: Math.max(0, value) } : e
                            ),
                        },
                    })),

                cancelEditEntry: () => set({ editingEntry: null }),

                removeEntry: (bucketKey, entryId) =>
                    set((s) => ({
                        buckets: {
                            ...s.buckets,
                            [bucketKey]: s.buckets[bucketKey].filter(
                                (e) => e.entryId !== entryId
                            ),
                        },
                    })),

                setNome: (v) => set({ nome: v }),
                setEmail: (v) => set({ email: v }),
                setTelefone: (v) => set({ telefone: v }),
                setHasUpload: (v) => set({ hasUpload: v }),
            }),
            {
                name: "arvo-escada-v3",
                partialize: (s) => ({
                    activeSection: s.activeSection,
                    quizAnswers: s.quizAnswers,
                    quizComplete: s.quizComplete,
                    perfil: s.perfil,
                    expenses: s.expenses,
                    useCalculatorTotal: s.useCalculatorTotal,
                    manualMonthlyCost: s.manualMonthlyCost,
                    multiplicadorReserva: s.multiplicadorReserva,
                    rendaMensal: s.rendaMensal,
                    patrimonioAtual: s.patrimonioAtual,
                    dadosComplete: s.dadosComplete,
                    buckets: s.buckets,
                    nome: s.nome,
                    email: s.email,
                    telefone: s.telefone,
                }),
            }
        ),
        { name: "arvo-escada-v3" }
    )
);
