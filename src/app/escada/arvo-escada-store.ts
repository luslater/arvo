/**
 * ARVO – Escada Patrimonial v2
 * Zustand Store — Estado global isolado da UI
 *
 * v2: Questionário de perfil, alocação de fundos em potes com ranges,
 *     single-page com seções progressivas.
 */

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// ─── Tipos ───────────────────────────────────────────────────────────────────

export type ProfileKey =
  | "conservador"
  | "moderado_conservador"
  | "moderado"
  | "arrojado";

export type StepKey =
  | "reserva"
  | "abrigo"
  | "ritmo"
  | "visao"
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

export type EducationTab =
  | "visao"
  | "sugestoes"
  | "aula"
  | "materiais"
  | "checklist";

export type ReserveMultiplier = 6 | 9 | 12 | 18;

export type PercentMap = Record<Exclude<StepKey, "reserva">, number>;
export type AllocationMap = Record<StepKey, number>;
export type ExpenseMap = Record<ExpenseKey, number>;

// ─── Questionário de Perfil ──────────────────────────────────────────────────

export interface QuizQuestion {
  id: string;
  text: string;
  options: { label: string; points: number }[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1_horizonte",
    text: "Qual o seu horizonte de investimento?",
    options: [
      { label: "Menos de 1 ano", points: 1 },
      { label: "1 a 3 anos", points: 2 },
      { label: "3 a 7 anos", points: 3 },
      { label: "Mais de 7 anos", points: 4 },
    ],
  },
  {
    id: "q2_reacao_queda",
    text: "Se seus investimentos caíssem 20% em um mês, o que você faria?",
    options: [
      { label: "Resgataria tudo imediatamente", points: 1 },
      { label: "Resgataria parte para reduzir o risco", points: 2 },
      { label: "Manteria e aguardaria a recuperação", points: 3 },
      { label: "Aproveitaria para investir mais", points: 4 },
    ],
  },
  {
    id: "q3_objetivo",
    text: "Qual o principal objetivo para este patrimônio?",
    options: [
      { label: "Preservar capital e ter liquidez", points: 1 },
      { label: "Gerar renda complementar estável", points: 2 },
      { label: "Crescer patrimônio com equilíbrio", points: 3 },
      { label: "Maximizar retorno aceitando volatilidade", points: 4 },
    ],
  },
  {
    id: "q4_experiencia",
    text: "Qual a sua experiência com investimentos?",
    options: [
      { label: "Só poupança e renda fixa simples", points: 1 },
      { label: "Já investi em fundos e CDBs", points: 2 },
      { label: "Tenho fundos multimercado e ações", points: 3 },
      { label: "Opero ativamente diversas classes", points: 4 },
    ],
  },
  {
    id: "q5_renda_necessaria",
    text: "Você depende do retorno desses investimentos para despesas do dia a dia?",
    options: [
      { label: "Sim, dependo integralmente", points: 1 },
      { label: "Parcialmente, complementa minha renda", points: 2 },
      { label: "Não, tenho renda separada suficiente", points: 3 },
      { label: "Não, posso reinvestir 100% dos ganhos", points: 4 },
    ],
  },
  {
    id: "q6_volatilidade",
    text: "Como você enxerga oscilações de mercado?",
    options: [
      { label: "Me causam ansiedade, prefiro evitar", points: 1 },
      { label: "Aceito pequenas oscilações por mais retorno", points: 2 },
      { label: "Entendo como natural e mantenho a estratégia", points: 3 },
      { label: "Vejo como oportunidade de compra", points: 4 },
    ],
  },
  {
    id: "q7_conhecimento",
    text: "Qual afirmação melhor descreve seu conhecimento?",
    options: [
      { label: "Não sei a diferença entre renda fixa e variável", points: 1 },
      { label: "Conheço o básico de renda fixa e fundos", points: 2 },
      { label: "Entendo classes de ativos e diversificação", points: 3 },
      { label: "Analiso fundos, gestores e estratégias", points: 4 },
    ],
  },
  {
    id: "q8_perda_maxima",
    text: "Qual a perda máxima que você aceitaria em 12 meses?",
    options: [
      { label: "Nenhuma — não quero perder nada", points: 1 },
      { label: "Até 5% do patrimônio", points: 2 },
      { label: "Até 15% do patrimônio", points: 3 },
      { label: "Até 30% se o potencial de ganho for alto", points: 4 },
    ],
  },
];

export function computeProfileFromScore(totalScore: number): ProfileKey {
  // 8 perguntas × 1-4 pontos = range 8-32
  if (totalScore <= 13) return "conservador";
  if (totalScore <= 20) return "moderado_conservador";
  if (totalScore <= 26) return "moderado";
  return "arrojado";
}

// ─── Constantes de Alocação ──────────────────────────────────────────────────

export const PROFILE_WEIGHTS: Record<ProfileKey, PercentMap> = {
  conservador: { abrigo: 70, ritmo: 20, visao: 10, oceano: 0 },
  moderado_conservador: { abrigo: 55, ritmo: 25, visao: 15, oceano: 5 },
  moderado: { abrigo: 35, ritmo: 30, visao: 20, oceano: 15 },
  arrojado: { abrigo: 20, ritmo: 25, visao: 30, oceano: 25 },
};

/** Ranges aceitáveis — o pote precisa estar entre min% e max% para ser válido. */
export const ALLOCATION_RANGES: Record<ProfileKey, Record<Exclude<StepKey, "reserva">, { min: number; max: number }>> = {
  conservador: { abrigo: { min: 60, max: 80 }, ritmo: { min: 10, max: 30 }, visao: { min: 0, max: 15 }, oceano: { min: 0, max: 5 } },
  moderado_conservador: { abrigo: { min: 45, max: 65 }, ritmo: { min: 15, max: 35 }, visao: { min: 5, max: 25 }, oceano: { min: 0, max: 15 } },
  moderado: { abrigo: { min: 25, max: 45 }, ritmo: { min: 20, max: 40 }, visao: { min: 10, max: 30 }, oceano: { min: 5, max: 25 } },
  arrojado: { abrigo: { min: 10, max: 30 }, ritmo: { min: 15, max: 35 }, visao: { min: 20, max: 40 }, oceano: { min: 15, max: 35 } },
};

export const STEP_ORDER: readonly StepKey[] = [
  "reserva",
  "abrigo",
  "ritmo",
  "visao",
  "oceano",
];

// ─── Fundos por camada ───────────────────────────────────────────────────────

export interface FundDef {
  id: string;
  name: string;
  layer: StepKey;
  color: string;      // Tailwind color token
  description: string;
}

export const FUND_CATALOG: FundDef[] = [
  // Reserva — azul
  { id: "tesouro_selic", name: "Tesouro Selic", layer: "reserva", color: "blue", description: "Liquidez diária, risco soberano" },
  { id: "fundo_simples", name: "Fundo Simples", layer: "reserva", color: "blue", description: "Fundo DI com taxa zero" },
  { id: "cdb_liquidez", name: "CDB Liquidez Diária", layer: "reserva", color: "blue", description: "100% CDI com liquidez" },
  { id: "conta_remunerada", name: "Conta Remunerada", layer: "reserva", color: "blue", description: "Rendimento automático" },
  // Abrigo — roxo/índigo
  { id: "credito_hg", name: "Crédito High Grade", layer: "abrigo", color: "indigo", description: "Renda fixa com qualidade de crédito" },
  { id: "inflacao_curta", name: "Inflação Curta", layer: "abrigo", color: "indigo", description: "IPCA+ com duration curta" },
  { id: "pos_fixados", name: "Pós-fixados", layer: "abrigo", color: "indigo", description: "CDI+ com baixa volatilidade" },
  { id: "mm_defensivo", name: "Multimercado Defensivo", layer: "abrigo", color: "indigo", description: "Gestão ativa conservadora" },
  // Ritmo — verde
  { id: "inflacao", name: "Inflação", layer: "ritmo", color: "emerald", description: "IPCA+ com duration média" },
  { id: "credito_privado", name: "Crédito Privado", layer: "ritmo", color: "emerald", description: "Crédito corporativo selecionado" },
  { id: "mm_conservador", name: "Multimercado Conservador", layer: "ritmo", color: "emerald", description: "Gestão ativa equilibrada" },
  { id: "balanceadas", name: "Estratégias Balanceadas", layer: "ritmo", color: "emerald", description: "Mix renda fixa + variável" },
  // Visão — âmbar/laranja
  { id: "multimercados", name: "Multimercados", layer: "visao", color: "amber", description: "Gestão ativa livre" },
  { id: "acoes_brasil", name: "Ações Brasil", layer: "visao", color: "amber", description: "Bolsa brasileira" },
  { id: "long_bias", name: "Long Bias", layer: "visao", color: "amber", description: "Ações com proteção parcial" },
  { id: "assimetricas", name: "Estratégias Assimétricas", layer: "visao", color: "amber", description: "Potencial de alta com risco controlado" },
  // Oceano — ciano
  { id: "fundos_intl", name: "Fundos Internacionais", layer: "oceano", color: "cyan", description: "Acesso a mercados globais" },
  { id: "dolar", name: "Dólar", layer: "oceano", color: "cyan", description: "Hedge cambial" },
  { id: "acoes_globais", name: "Ações Globais", layer: "oceano", color: "cyan", description: "Bolsas internacionais" },
  { id: "rf_internacional", name: "Renda Fixa Internacional", layer: "oceano", color: "cyan", description: "Bonds e treasuries" },
];

export const FUND_BY_ID = Object.fromEntries(FUND_CATALOG.map((f) => [f.id, f]));

// ─── Labels / Helpers ────────────────────────────────────────────────────────

export const PROFILE_LABELS: Record<ProfileKey, string> = {
  conservador: "Conservador",
  moderado_conservador: "Moderado conservador",
  moderado: "Moderado",
  arrojado: "Arrojado",
};

export const EXPENSE_LABELS: Record<ExpenseKey, string> = {
  moradia: "Moradia / aluguel / financiamento",
  contas: "Condomínio e contas da casa",
  supermercado: "Supermercado",
  cartao: "Cartão de crédito",
  transporte: "Carro / transporte",
  saude: "Saúde",
  educacao: "Escola / faculdade / filhos",
  lazer: "Lazer",
  outros: "Outros",
};

export const STEP_LABELS: Record<StepKey, { title: string; subtitle: string; color: string }> = {
  reserva: { title: "Reserva", subtitle: "Proteção e liquidez", color: "blue" },
  abrigo: { title: "Abrigo", subtitle: "Base conservadora", color: "indigo" },
  ritmo: { title: "Ritmo", subtitle: "Crescimento com equilíbrio", color: "emerald" },
  visao: { title: "Visão", subtitle: "Expansão e performance", color: "amber" },
  oceano: { title: "Oceano", subtitle: "Diversificação global", color: "cyan" },
};

// ─── Fundo alocado em um pote ────────────────────────────────────────────────

export interface PotFund {
  fundId: string;
  amount: number; // em R$
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_EXPENSES: ExpenseMap = {
  moradia: 0, contas: 0, supermercado: 0, cartao: 0,
  transporte: 0, saude: 0, educacao: 0, lazer: 0, outros: 0,
};

const DEFAULT_POT_FUNDS: Record<StepKey, PotFund[]> = {
  reserva: [], abrigo: [], ritmo: [], visao: [], oceano: [],
};

// ─── Interface do Store ──────────────────────────────────────────────────────

export interface ArvoStore {
  // Seção ativa (0-based, controla desbloqueio progressivo)
  activeSection: number;

  // Seção 1 — Questionário
  quizAnswers: Record<string, number>; // questionId → points
  quizComplete: boolean;

  // Perfil (derivado do quiz, mas armazenado para persist)
  perfil: ProfileKey;

  // Seção 2 — Custo de Vida + Reserva
  expenses: ExpenseMap;
  useCalculatorTotal: boolean;
  manualMonthlyCost: number;
  multiplicadorReserva: ReserveMultiplier;

  // Seção 3 — Raio-X
  rendaMensal: number;
  patrimonioAtual: number;

  // Seção 4 — Motor de Alocação (potes com fundos)
  potFunds: Record<StepKey, PotFund[]>;

  // Seção 5 — Agendamento
  nome: string;
  email: string;
  telefone: string;
  hasUpload: boolean;

  // Education Drawer
  drawerOpen: boolean;
  drawerStep: StepKey | null;
  drawerTab: EducationTab;
  checklistState: Record<string, boolean>;

  // ── Actions ────────────────────────────────────────────────────────────

  // Seção
  unlockSection(section: number): void;

  // Quiz
  setQuizAnswer(questionId: string, points: number): void;
  completeQuiz(): void;

  // Perfil (override manual se necessário)
  setPerfil(perfil: ProfileKey): void;

  // Custo de vida
  setExpense(key: ExpenseKey, value: number): void;
  setUseCalculatorTotal(value: boolean): void;
  setManualMonthlyCost(value: number): void;
  setMultiplicadorReserva(value: ReserveMultiplier): void;

  // Raio-X
  setRendaMensal(value: number): void;
  setPatrimonioAtual(value: number): void;

  // Potes
  addFundToPot(step: StepKey, fundId: string): void;
  removeFundFromPot(step: StepKey, fundId: string): void;
  updateFundAmount(step: StepKey, fundId: string, amount: number): void;

  // Agendamento
  setNome(value: string): void;
  setEmail(value: string): void;
  setTelefone(value: string): void;
  setHasUpload(value: boolean): void;

  // Drawer
  openDrawer(step: StepKey): void;
  closeDrawer(): void;
  setDrawerTab(tab: EducationTab): void;
  toggleChecklist(step: StepKey, item: string): void;
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useArvoStore = create<ArvoStore>()(
  devtools(
    persist(
      (set) => ({
        activeSection: 0,

        // Quiz
        quizAnswers: {},
        quizComplete: false,

        // Perfil
        perfil: "moderado",

        // Custo de vida
        expenses: { ...DEFAULT_EXPENSES },
        useCalculatorTotal: true,
        manualMonthlyCost: 0,
        multiplicadorReserva: 6,

        // Raio-X
        rendaMensal: 0,
        patrimonioAtual: 0,

        // Potes
        potFunds: { ...DEFAULT_POT_FUNDS },

        // Agendamento
        nome: "",
        email: "",
        telefone: "",
        hasUpload: false,

        // Drawer
        drawerOpen: false,
        drawerStep: null,
        drawerTab: "visao",
        checklistState: {},

        // ── Implementações ──────────────────────────────────────────────

        unlockSection: (section) =>
          set((s) => ({
            activeSection: Math.max(s.activeSection, section),
          })),

        setQuizAnswer: (questionId, points) =>
          set((s) => ({
            quizAnswers: { ...s.quizAnswers, [questionId]: points },
          })),

        completeQuiz: () =>
          set((s) => {
            const totalScore = Object.values(s.quizAnswers).reduce(
              (acc, v) => acc + v,
              0
            );
            return {
              quizComplete: true,
              perfil: computeProfileFromScore(totalScore),
              activeSection: Math.max(s.activeSection, 1),
            };
          }),

        setPerfil: (perfil) => set({ perfil }),

        setExpense: (key, value) =>
          set((s) => ({
            expenses: { ...s.expenses, [key]: Math.max(0, value) },
          })),

        setUseCalculatorTotal: (value) => set({ useCalculatorTotal: value }),

        setManualMonthlyCost: (value) =>
          set({ manualMonthlyCost: Math.max(0, value) }),

        setMultiplicadorReserva: (value) =>
          set({ multiplicadorReserva: value }),

        setRendaMensal: (value) =>
          set({ rendaMensal: Math.max(0, value) }),

        setPatrimonioAtual: (value) =>
          set({ patrimonioAtual: Math.max(0, value) }),

        // ── Potes ──────────────────────────────────────────────────────

        addFundToPot: (step, fundId) =>
          set((s) => {
            const existing = s.potFunds[step];
            if (existing.some((f) => f.fundId === fundId)) return s;
            return {
              potFunds: {
                ...s.potFunds,
                [step]: [...existing, { fundId, amount: 0 }],
              },
            };
          }),

        removeFundFromPot: (step, fundId) =>
          set((s) => ({
            potFunds: {
              ...s.potFunds,
              [step]: s.potFunds[step].filter((f) => f.fundId !== fundId),
            },
          })),

        updateFundAmount: (step, fundId, amount) =>
          set((s) => ({
            potFunds: {
              ...s.potFunds,
              [step]: s.potFunds[step].map((f) =>
                f.fundId === fundId ? { ...f, amount: Math.max(0, amount) } : f
              ),
            },
          })),

        // ── Agendamento ────────────────────────────────────────────────

        setNome: (value) => set({ nome: value }),
        setEmail: (value) => set({ email: value }),
        setTelefone: (value) => set({ telefone: value }),
        setHasUpload: (value) => set({ hasUpload: value }),

        // ── Drawer ─────────────────────────────────────────────────────

        openDrawer: (step) =>
          set({ drawerOpen: true, drawerStep: step, drawerTab: "visao" }),
        closeDrawer: () => set({ drawerOpen: false }),
        setDrawerTab: (tab) => set({ drawerTab: tab }),

        toggleChecklist: (step, item) =>
          set((s) => {
            const key = `${step}:${item}`;
            return {
              checklistState: {
                ...s.checklistState,
                [key]: !s.checklistState[key],
              },
            };
          }),
      }),
      {
        name: "arvo-escada-v2",
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
          potFunds: s.potFunds,
          checklistState: s.checklistState,
          nome: s.nome,
          email: s.email,
          telefone: s.telefone,
        }),
      }
    ),
    { name: "arvo-escada" }
  )
);
