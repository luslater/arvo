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
    // ─── RENDA FIXA (Reserva, Abrigo, Ritmo) ───
    { id: "tesouro_selic", name: "Tesouro Selic / Fundo Simples", shortName: "Tesouro Selic", type: "Renda Fixa", category: "reserva", color: "blue", yield12m: "CDI", risk: 1, description: "DI Puro" },
    { id: "arx_fuji", name: "ARX Fuji (XP, BTG, Safra)", shortName: "ARX Fuji", type: "Renda Fixa", category: "reserva", color: "blue", yield12m: "CDI + α", risk: 1, description: "Reserva Conservadora" },
    { id: "valora_guardian_a", name: "Valora Guardian A", shortName: "Valora G. A", type: "Renda Fixa", category: "abrigo", color: "indigo", yield12m: "CDI + α", risk: 2, description: "DI Crédito Prêmium" },
    { id: "valora_guardian_b", name: "Valora Guardian B", shortName: "Valora G. B", type: "Renda Fixa", category: "abrigo", color: "indigo", yield12m: "CDI + α", risk: 2, description: "DI Crédito Prêmium" },
    { id: "valora_guardian", name: "Valora Guardian II", shortName: "Valora G. II", type: "Renda Fixa", category: "abrigo", color: "indigo", yield12m: "CDI + α", risk: 2, description: "DI Crédito" },
    { id: "sparta_kinea", name: "Sparta/Kinea Deb Incentivadas", shortName: "Sparta Deb", type: "Renda Fixa", category: "ritmo", color: "violet", yield12m: "IPCA + α", risk: 3, description: "Crédito Isento" },
    { id: "jgp_corporate", name: "JGP Corporate FIC FIF RF CP", shortName: "JGP Corp.", type: "Renda Fixa", category: "abrigo", color: "indigo", yield12m: "CDI + α", risk: 2, description: "Crédito Privado" },
    { id: "spx_seahawk", name: "SPX Seahawk Crédito Privado", shortName: "SPX Seahawk", type: "Renda Fixa", category: "abrigo", color: "indigo", yield12m: "CDI + α", risk: 2, description: "Baixo Risco Crédito" },
    { id: "bnp_rubi", name: "BNP Paribas Rubi", shortName: "BNP Rubi", type: "Renda Fixa", category: "abrigo", color: "indigo", yield12m: "CDI + α", risk: 2, description: "Crédito High Grade" },
    { id: "mapfre_rf", name: "MAPFRE RF FIF", shortName: "MAPFRE RF", type: "Renda Fixa", category: "reserva", color: "blue", yield12m: "CDI", risk: 1, description: "Liquidez e CDI" },
    { id: "augme_30", name: "Augme 30 CIC", shortName: "Augme 30", type: "Renda Fixa", category: "abrigo", color: "indigo", yield12m: "CDI + α", risk: 2, description: "Crédito Curto Prazo" },
    { id: "augme_180", name: "Augme 180 FIF", shortName: "Augme 180", type: "Renda Fixa", category: "ritmo", color: "violet", yield12m: "CDI + α", risk: 3, description: "Crédito Estruturado" },
    { id: "capitania_premium_45", name: "Capitânia Premium 45", shortName: "Capitânia 45", type: "Renda Fixa", category: "abrigo", color: "indigo", yield12m: "CDI + α", risk: 2, description: "Crédito Intermediário" },
    { id: "capitania_radar_90", name: "Capitânia Radar 90", shortName: "Capitânia 90", type: "Renda Fixa", category: "ritmo", color: "violet", yield12m: "CDI + α", risk: 3, description: "Crédito Médio Prazo" },
    { id: "capitania_yield_120", name: "Capitânia Yield 120", shortName: "Capitânia 120", type: "Renda Fixa", category: "ritmo", color: "violet", yield12m: "CDI + α", risk: 3, description: "High Yield / Estruturado" },
    { id: "ibiuna_credit", name: "Ibiuna Credit", shortName: "Ibiuna C.", type: "Renda Fixa", category: "abrigo", color: "indigo", yield12m: "CDI + α", risk: 2, description: "DI Crédito" },
    { id: "jgp_select", name: "JGP Select Premium", shortName: "JGP Select", type: "Renda Fixa", category: "ritmo", color: "violet", yield12m: "CDI + α", risk: 3, description: "Crédito Estruturado" },
    { id: "genoa_radar", name: "Genoa Capital Radar", shortName: "Genoa Radar", type: "Renda Fixa", category: "ritmo", color: "violet", yield12m: "CDI + α", risk: 3, description: "Crédito Ativo" },
    { id: "legacy_compound", name: "Legacy Compound", shortName: "Legacy C.", type: "Renda Fixa", category: "ritmo", color: "violet", yield12m: "IPCA / CDI + α", risk: 3, description: "Crédito Premium" },
    { id: "bahia_am", name: "Bahia AM DI", shortName: "Bahia AM", type: "Renda Fixa", category: "reserva", color: "blue", yield12m: "CDI + 0,5%", risk: 1, description: "Reserva DI" },
    { id: "arx_hedge", name: "ARX Hedge Infra", shortName: "ARX Infra", type: "Renda Fixa", category: "ritmo", color: "violet", yield12m: "IPCA + α", risk: 3, description: "IPCA+ Isento" },
    { id: "itau_deb", name: "Itaú Deb Incentivadas", shortName: "Itaú Debs", type: "Renda Fixa", category: "ritmo", color: "violet", yield12m: "IPCA + α", risk: 3, description: "Debêntures IPCA+" },
    { id: "trend_pre", name: "Trend Pré Fixado", shortName: "Trend Pré", type: "Renda Fixa", category: "ritmo", color: "violet", yield12m: "Pré", risk: 3, description: "Prefixado" },
    { id: "jgp_eco", name: "JGP Ecossistema", shortName: "JGP Eco.", type: "Renda Fixa", category: "ritmo", color: "violet", yield12m: "IPCA + α", risk: 3, description: "IPCA+ Infra" },
    { id: "btg_credito", name: "BTG Crédito Estruturado", shortName: "BTG Crédito", type: "Renda Fixa", category: "ritmo", color: "violet", yield12m: "CDI + α", risk: 3, description: "DI Crédito" },

    // ─── MULTIMERCADOS (Vanguarda, Oceano) ───
    { id: "kinea_oportunidade", name: "Kinea Oportunidade FIM", shortName: "Kinea Oport.", type: "Multimercado", category: "vanguarda", color: "amber", yield12m: "CDI + α", risk: 4, description: "Multi conserv" },
    { id: "kinea_oportunidade_fif", name: "Kinea Oportunidade FIF", shortName: "Kinea FIF", type: "Multimercado", category: "vanguarda", color: "amber", yield12m: "CDI + α", risk: 4, description: "Multimercado FIF" },
    { id: "kinea_atlas", name: "Kinea Atlas", shortName: "Kinea Atlas", type: "Multimercado", category: "oceano", color: "cyan", yield12m: "Macro Global", risk: 5, description: "Macro Diversificado" },
    { id: "gavea_macro", name: "Gavea Macro", shortName: "Gavea Macro", type: "Multimercado", category: "vanguarda", color: "amber", yield12m: "Macro", risk: 4, description: "Estratégia Direcional" },
    { id: "gavea_macro_plus", name: "Gavea Macro Plus", shortName: "Gavea Plus", type: "Multimercado", category: "oceano", color: "cyan", yield12m: "Macro", risk: 5, description: "Macro Alavancado" },
    { id: "ibiuna_hedge", name: "Ibiuna Hedge ST", shortName: "Ibiuna Hedge", type: "Multimercado", category: "vanguarda", color: "amber", yield12m: "Macro", risk: 4, description: "Multimercado Juros/Moedas" },
    { id: "kapitalo_zeta", name: "Kapitalo Zeta", shortName: "Kap. Zeta", type: "Multimercado", category: "oceano", color: "cyan", yield12m: "Macro", risk: 5, description: "Macro Volatilidade" },
    { id: "kapitalo_kappa", name: "Kapitalo Kappa", shortName: "Kapitalo K.", type: "Multimercado", category: "oceano", color: "cyan", yield12m: "Macro", risk: 5, description: "Multi macro" },
    { id: "mar_absoluto", name: "Mar Absoluto", shortName: "Mar Abs.", type: "Multimercado", category: "vanguarda", color: "amber", yield12m: "CDI + α", risk: 4, description: "Estratégia Absoluta" },
    { id: "spx_nimitz", name: "SPX Nimitz", shortName: "SPX Nimitz", type: "Multimercado", category: "oceano", color: "cyan", yield12m: "Macro Global", risk: 5, description: "Macro Internacional" },
    { id: "spx_raptor", name: "SPX Raptor", shortName: "SPX Raptor", type: "Multimercado", category: "oceano", color: "cyan", yield12m: "Macro Alt.", risk: 5, description: "Macro Alta Volatilidade" },
    { id: "legacy_v10", name: "Legacy V10", shortName: "Legacy V10", type: "Multimercado", category: "oceano", color: "cyan", yield12m: "Macro", risk: 5, description: "Estratégia Direcional" },
    { id: "verde_am_x60", name: "Verde AM X60", shortName: "Verde X60", type: "Multimercado", category: "vanguarda", color: "amber", yield12m: "Macro", risk: 4, description: "Fundo Lendário" },
    { id: "vista_hedge", name: "Vista Hedge", shortName: "Vista Hedge", type: "Multimercado", category: "vanguarda", color: "amber", yield12m: "Macro", risk: 4, description: "Foco em assimetrias" },
    { id: "dahlia_total", name: "Dahlia Total Return", shortName: "Dahlia TR", type: "Multimercado", category: "vanguarda", color: "amber", yield12m: "Ações + RF", risk: 4, description: "Estratégia Mista" },
    { id: "encore_long_bias", name: "Encore Long Bias", shortName: "Encore LB", type: "Multimercado", category: "vanguarda", color: "amber", yield12m: "Ibov / Macro", risk: 4, description: "Multimercado/Ações" },
    { id: "truxt_long_bias", name: "Truxt Long Bias", shortName: "Truxt LB", type: "Multimercado", category: "vanguarda", color: "amber", yield12m: "Ibov / Macro", risk: 4, description: "Multimercado/Ações" },

    // ─── AÇÕES (Vanguarda, Oceano) ───
    { id: "spx_falcon", name: "SPX Falcon", shortName: "SPX Falcon", type: "Ações", category: "oceano", color: "cyan", yield12m: "Ibov + α", risk: 5, description: "Ações / Macro" },
    { id: "atmos_acoes", name: "Atmos Ações", shortName: "Atmos", type: "Ações", category: "oceano", color: "cyan", yield12m: "Ibov + α", risk: 5, description: "Value Investing" },
    { id: "bogari_value", name: "Bogari Value", shortName: "Bogari V.", type: "Ações", category: "oceano", color: "cyan", yield12m: "Ibov + α", risk: 5, description: "Deep Value" },
    { id: "bogari_value_q", name: "Bogari Value Q FIC FIA", shortName: "Bogari Q", type: "Ações", category: "oceano", color: "cyan", yield12m: "Ibov + α", risk: 5, description: "Ações Alavancado" },
    { id: "brasil_capital", name: "Brasil Capital", shortName: "Brasil Cap.", type: "Ações", category: "vanguarda", color: "amber", yield12m: "Ibov + α", risk: 4, description: "Ações Qualidade" },
    { id: "brasil_cap_inst", name: "Brasil Capital Institucional 30", shortName: "Brasil Inst.", type: "Ações", category: "oceano", color: "cyan", yield12m: "Ibov + α", risk: 5, description: "Fundo Institucional" },
    { id: "hix_capital_fic", name: "Hix Capital FIC FIA", shortName: "Hix FIC", type: "Ações", category: "vanguarda", color: "amber", yield12m: "Ibov + α", risk: 4, description: "Ações Long Only" },
    { id: "hix_capital", name: "Hix Capital HS FIA", shortName: "Hix HS", type: "Ações", category: "oceano", color: "cyan", yield12m: "Ibov + α", risk: 5, description: "Ações long-s" },
    { id: "real_investor", name: "Real Investor", shortName: "Real Inv.", type: "Ações", category: "vanguarda", color: "amber", yield12m: "Ibov + α", risk: 4, description: "Value/Growth" },
    { id: "ip_participacoes", name: "IP Participações", shortName: "IP Part.", type: "Ações", category: "vanguarda", color: "amber", yield12m: "IPCA + α Global", risk: 4, description: "Ações Globais/Locais" },
    { id: "dynamo_cougar", name: "Dynamo Cougar", shortName: "Dynamo", type: "Ações", category: "oceano", color: "cyan", yield12m: "Ibov + α", risk: 5, description: "Fundo Fechado/Lendário" },
    { id: "forpus_acoes", name: "Forpus Ações", shortName: "Forpus", type: "Ações", category: "oceano", color: "cyan", yield12m: "Ibov + α", risk: 5, description: "Ações Direcional" },
    { id: "alaska_black", name: "Alaska Black FIF", shortName: "Alaska", type: "Ações", category: "oceano", color: "cyan", yield12m: "Ibov + α / Câmbio", risk: 5, description: "Ações Volatilidade" },
    { id: "velt_partners", name: "Velt Partners FIF", shortName: "Velt", type: "Ações", category: "oceano", color: "cyan", yield12m: "Ibov + α", risk: 5, description: "Ações Convictícias" }
];

export const SUGGESTED_ALLOCATIONS: Record<StepKey, { fundId: string; weight: number }[]> = {
    reserva: [
        { fundId: "tesouro_selic", weight: 100 }
    ],
    abrigo: [
        { fundId: "tesouro_selic", weight: 70 },
        { fundId: "valora_guardian", weight: 10 },
        { fundId: "arx_hedge", weight: 7 },
        { fundId: "ibiuna_credit", weight: 5 },
        { fundId: "kinea_oportunidade", weight: 5 },
        { fundId: "trend_pre", weight: 3 },
    ],
    ritmo: [
        { fundId: "tesouro_selic", weight: 40 },
        { fundId: "arx_hedge", weight: 10 },
        { fundId: "jgp_eco", weight: 10 },
        { fundId: "valora_guardian", weight: 7 },
        { fundId: "sparta_kinea", weight: 6 },
        { fundId: "ibiuna_credit", weight: 5 },
        { fundId: "trend_pre", weight: 5 },
        { fundId: "kinea_oportunidade", weight: 5 },
        { fundId: "btg_credito", weight: 4 },
        { fundId: "spx_falcon", weight: 4 },
        { fundId: "real_investor", weight: 4 },
    ],
    vanguarda: [
        { fundId: "tesouro_selic", weight: 18 },
        { fundId: "jgp_eco", weight: 10 },
        { fundId: "arx_hedge", weight: 9 },
        { fundId: "trend_pre", weight: 9 },
        { fundId: "spx_falcon", weight: 8 },
        { fundId: "sparta_kinea", weight: 7 },
        { fundId: "real_investor", weight: 7 },
        { fundId: "valora_guardian", weight: 6 },
        { fundId: "btg_credito", weight: 5 },
        { fundId: "kinea_oportunidade", weight: 5 },
        { fundId: "dynamo_cougar", weight: 5 },
        { fundId: "ibiuna_credit", weight: 4 },
        { fundId: "hix_capital", weight: 4 },
        { fundId: "ip_participacoes", weight: 3 },
    ],
    oceano: [
        { fundId: "spx_falcon", weight: 18 },
        { fundId: "jgp_eco", weight: 13 },
        { fundId: "hix_capital", weight: 10 },
        { fundId: "trend_pre", weight: 8 },
        { fundId: "real_investor", weight: 8 },
        { fundId: "arx_hedge", weight: 7 },
        { fundId: "sparta_kinea", weight: 7 },
        { fundId: "tesouro_selic", weight: 5 },
        { fundId: "ip_participacoes", weight: 5 },
        { fundId: "dynamo_cougar", weight: 5 },
        { fundId: "valora_guardian", weight: 4 },
        { fundId: "kinea_oportunidade", weight: 4 },
        { fundId: "ibiuna_credit", weight: 3 },
        { fundId: "kapitalo_kappa", weight: 3 },
    ]
};

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
