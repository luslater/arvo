// src/config/portfolios.ts

export type StepKey = "reserva" | "abrigo" | "ritmo" | "visao" | "oceano";

export interface FundCard {
    id: string;
    name: string;
    shortName: string;
    type: "Renda Fixa" | "Multimercado" | "Ações";
    category: StepKey;
    color: "blue" | "indigo" | "violet" | "amber" | "cyan";
    yield12m: string;
    risk: 1 | 2 | 3 | 4 | 5;
    description: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// FUNDS LIBRARY
// Você pode adicionar, remover ou re-categorizar fundos nesta lista central.
// O "category" define em qual carteira do Motor de Alocação ele aparecerá.
// ─────────────────────────────────────────────────────────────────────────────
export const FUNDS_LIBRARY: FundCard[] = [
    // ─── RENDA FIXA (Reserva, Abrigo, Ritmo) ───
    { id: "tesouro_selic", name: "Tesouro Selic", shortName: "Tesouro Selic", type: "Renda Fixa", category: "reserva", color: "blue", yield12m: "CDI", risk: 1, description: "Título Público" },
    { id: "di_simples", name: "Fundo DI Simples", shortName: "DI Simples", type: "Renda Fixa", category: "reserva", color: "blue", yield12m: "CDI", risk: 1, description: "DI Puro" },
    { id: "blft11", name: "BLFT11", shortName: "BLFT11", type: "Renda Fixa", category: "reserva", color: "blue", yield12m: "CDI", risk: 1, description: "ETF LFT" },
    { id: "arx_fuji", name: "ARX Fuji (XP, BTG, Safra)", shortName: "ARX Fuji", type: "Renda Fixa", category: "abrigo", color: "indigo", yield12m: "CDI + α", risk: 2, description: "Caixa Premium" },
    { id: "valora_guardian_a", name: "Valora Guardian A", shortName: "Valora G. A", type: "Renda Fixa", category: "abrigo", color: "indigo", yield12m: "CDI + α", risk: 2, description: "DI Crédito Prêmium" },
    { id: "valora_guardian_b", name: "Valora Guardian B", shortName: "Valora G. B", type: "Renda Fixa", category: "abrigo", color: "indigo", yield12m: "CDI + α", risk: 2, description: "DI Crédito Prêmium" },
    { id: "valora_guardian", name: "Valora Guardian II", shortName: "Valora G. II", type: "Renda Fixa", category: "abrigo", color: "indigo", yield12m: "CDI + α", risk: 2, description: "DI Crédito" },
    { id: "sparta_kinea", name: "Sparta/Kinea Deb Incentivadas", shortName: "Sparta Deb", type: "Renda Fixa", category: "ritmo", color: "violet", yield12m: "IPCA + α", risk: 3, description: "Crédito Isento" },
    { id: "jgp_corporate", name: "JGP Corporate FIC FIF RF CP", shortName: "JGP Corp.", type: "Renda Fixa", category: "abrigo", color: "indigo", yield12m: "CDI + α", risk: 2, description: "Crédito Privado" },
    { id: "spx_seahawk", name: "SPX Seahawk Crédito Privado", shortName: "SPX Seahawk", type: "Renda Fixa", category: "abrigo", color: "indigo", yield12m: "CDI + α", risk: 2, description: "Baixo Risco Crédito" },
    { id: "bnp_rubi", name: "BNP Paribas Rubi", shortName: "BNP Rubi", type: "Renda Fixa", category: "abrigo", color: "indigo", yield12m: "CDI + α", risk: 2, description: "Crédito High Grade" },
    { id: "mapfre_rf", name: "MAPFRE RF FIF", shortName: "MAPFRE RF", type: "Renda Fixa", category: "abrigo", color: "indigo", yield12m: "CDI", risk: 2, description: "Liquidez Alternativa" },
    { id: "augme_30", name: "Augme 30 CIC", shortName: "Augme 30", type: "Renda Fixa", category: "abrigo", color: "indigo", yield12m: "CDI + α", risk: 2, description: "Crédito Curto Prazo" },
    { id: "augme_180", name: "Augme 180 FIF", shortName: "Augme 180", type: "Renda Fixa", category: "ritmo", color: "violet", yield12m: "CDI + α", risk: 3, description: "Crédito Estruturado" },
    { id: "capitania_premium_45", name: "Capitânia Premium 45", shortName: "Capitânia 45", type: "Renda Fixa", category: "abrigo", color: "indigo", yield12m: "CDI + α", risk: 2, description: "Crédito Intermediário" },
    { id: "capitania_radar_90", name: "Capitânia Radar 90", shortName: "Capitânia 90", type: "Renda Fixa", category: "ritmo", color: "violet", yield12m: "CDI + α", risk: 3, description: "Crédito Médio Prazo" },
    { id: "capitania_yield_120", name: "Capitânia Yield 120", shortName: "Capitânia 120", type: "Renda Fixa", category: "ritmo", color: "violet", yield12m: "CDI + α", risk: 3, description: "High Yield / Estruturado" },
    { id: "ibiuna_credit", name: "Ibiuna Credit", shortName: "Ibiuna C.", type: "Renda Fixa", category: "abrigo", color: "indigo", yield12m: "CDI + α", risk: 2, description: "DI Crédito" },
    { id: "jgp_select", name: "JGP Select Premium", shortName: "JGP Select", type: "Renda Fixa", category: "ritmo", color: "violet", yield12m: "CDI + α", risk: 3, description: "Crédito Estruturado" },
    { id: "genoa_radar", name: "Genoa Capital Radar", shortName: "Genoa Radar", type: "Renda Fixa", category: "ritmo", color: "violet", yield12m: "CDI + α", risk: 3, description: "Crédito Ativo" },
    { id: "legacy_compound", name: "Legacy Compound", shortName: "Legacy C.", type: "Renda Fixa", category: "ritmo", color: "violet", yield12m: "IPCA / CDI + α", risk: 3, description: "Crédito Premium" },
    { id: "bahia_am", name: "Bahia AM DI", shortName: "Bahia AM", type: "Renda Fixa", category: "abrigo", color: "indigo", yield12m: "CDI + 0,5%", risk: 2, description: "Reserva DI Plus" },
    { id: "arx_hedge", name: "ARX Hedge Infra", shortName: "ARX Infra", type: "Renda Fixa", category: "ritmo", color: "violet", yield12m: "IPCA + α", risk: 3, description: "IPCA+ Isento" },
    { id: "itau_deb", name: "Itaú Deb Incentivadas", shortName: "Itaú Debs", type: "Renda Fixa", category: "ritmo", color: "violet", yield12m: "IPCA + α", risk: 3, description: "Debêntures IPCA+" },
    { id: "trend_pre", name: "Trend Pré Fixado", shortName: "Trend Pré", type: "Renda Fixa", category: "ritmo", color: "violet", yield12m: "Pré", risk: 3, description: "Prefixado" },
    { id: "jgp_eco", name: "JGP Ecossistema", shortName: "JGP Eco.", type: "Renda Fixa", category: "ritmo", color: "violet", yield12m: "IPCA + α", risk: 3, description: "IPCA+ Infra" },
    { id: "btg_credito", name: "BTG Crédito Estruturado", shortName: "BTG Crédito", type: "Renda Fixa", category: "ritmo", color: "violet", yield12m: "CDI + α", risk: 3, description: "DI Crédito" },

    // ─── MULTIMERCADOS (Visão, Oceano) ───
    { id: "kinea_oportunidade", name: "Kinea Oportunidade FIM", shortName: "Kinea Oport.", type: "Multimercado", category: "visao", color: "amber", yield12m: "CDI + α", risk: 4, description: "Multi conserv" },
    { id: "kinea_oportunidade_fif", name: "Kinea Oportunidade FIF", shortName: "Kinea FIF", type: "Multimercado", category: "visao", color: "amber", yield12m: "CDI + α", risk: 4, description: "Multimercado FIF" },
    { id: "kinea_atlas", name: "Kinea Atlas", shortName: "Kinea Atlas", type: "Multimercado", category: "oceano", color: "cyan", yield12m: "Macro Global", risk: 5, description: "Macro Diversificado" },
    { id: "gavea_macro", name: "Gavea Macro", shortName: "Gavea Macro", type: "Multimercado", category: "visao", color: "amber", yield12m: "Macro", risk: 4, description: "Estratégia Direcional" },
    { id: "gavea_macro_plus", name: "Gavea Macro Plus", shortName: "Gavea Plus", type: "Multimercado", category: "oceano", color: "cyan", yield12m: "Macro", risk: 5, description: "Macro Alavancado" },
    { id: "ibiuna_hedge", name: "Ibiuna Hedge ST", shortName: "Ibiuna Hedge", type: "Multimercado", category: "visao", color: "amber", yield12m: "Macro", risk: 4, description: "Multimercado Juros/Moedas" },
    { id: "kapitalo_zeta", name: "Kapitalo Zeta", shortName: "Kap. Zeta", type: "Multimercado", category: "oceano", color: "cyan", yield12m: "Macro", risk: 5, description: "Macro Volatilidade" },
    { id: "kapitalo_kappa", name: "Kapitalo Kappa", shortName: "Kapitalo K.", type: "Multimercado", category: "oceano", color: "cyan", yield12m: "Macro", risk: 5, description: "Multi macro" },
    { id: "mar_absoluto", name: "Mar Absoluto", shortName: "Mar Abs.", type: "Multimercado", category: "visao", color: "amber", yield12m: "CDI + α", risk: 4, description: "Estratégia Absoluta" },
    { id: "spx_nimitz", name: "SPX Nimitz", shortName: "SPX Nimitz", type: "Multimercado", category: "oceano", color: "cyan", yield12m: "Macro Global", risk: 5, description: "Macro Internacional" },
    { id: "spx_raptor", name: "SPX Raptor", shortName: "SPX Raptor", type: "Multimercado", category: "oceano", color: "cyan", yield12m: "Macro Alt.", risk: 5, description: "Macro Alta Volatilidade" },
    { id: "legacy_v10", name: "Legacy V10", shortName: "Legacy V10", type: "Multimercado", category: "oceano", color: "cyan", yield12m: "Macro", risk: 5, description: "Estratégia Direcional" },
    { id: "verde_am_x60", name: "Verde AM X60", shortName: "Verde X60", type: "Multimercado", category: "visao", color: "amber", yield12m: "Macro", risk: 4, description: "Fundo Lendário" },
    { id: "vista_hedge", name: "Vista Hedge", shortName: "Vista Hedge", type: "Multimercado", category: "visao", color: "amber", yield12m: "Macro", risk: 4, description: "Foco em assimetrias" },
    { id: "dahlia_total", name: "Dahlia Total Return", shortName: "Dahlia TR", type: "Multimercado", category: "visao", color: "amber", yield12m: "Ações + RF", risk: 4, description: "Estratégia Mista" },
    { id: "encore_long_bias", name: "Encore Long Bias", shortName: "Encore LB", type: "Multimercado", category: "visao", color: "amber", yield12m: "Ibov / Macro", risk: 4, description: "Multimercado/Ações" },
    { id: "truxt_long_bias", name: "Truxt Long Bias", shortName: "Truxt LB", type: "Multimercado", category: "visao", color: "amber", yield12m: "Ibov / Macro", risk: 4, description: "Multimercado/Ações" },

    // ─── AÇÕES (Visão, Oceano) ───
    { id: "spx_falcon", name: "SPX Falcon", shortName: "SPX Falcon", type: "Ações", category: "oceano", color: "cyan", yield12m: "Ibov + α", risk: 5, description: "Ações / Macro" },
    { id: "atmos_acoes", name: "Atmos Ações", shortName: "Atmos", type: "Ações", category: "oceano", color: "cyan", yield12m: "Ibov + α", risk: 5, description: "Value Investing" },
    { id: "bogari_value", name: "Bogari Value", shortName: "Bogari V.", type: "Ações", category: "oceano", color: "cyan", yield12m: "Ibov + α", risk: 5, description: "Deep Value" },
    { id: "bogari_value_q", name: "Bogari Value Q FIC FIA", shortName: "Bogari Q", type: "Ações", category: "oceano", color: "cyan", yield12m: "Ibov + α", risk: 5, description: "Ações Alavancado" },
    { id: "brasil_capital", name: "Brasil Capital", shortName: "Brasil Cap.", type: "Ações", category: "visao", color: "amber", yield12m: "Ibov + α", risk: 4, description: "Ações Qualidade" },
    { id: "brasil_cap_inst", name: "Brasil Capital Institucional 30", shortName: "Brasil Inst.", type: "Ações", category: "oceano", color: "cyan", yield12m: "Ibov + α", risk: 5, description: "Fundo Institucional" },
    { id: "hix_capital", name: "Hix Capital FIC FIA", shortName: "Hix FIC", type: "Ações", category: "visao", color: "amber", yield12m: "Ibov + α", risk: 4, description: "Ações Ibov+" },
    { id: "hix_hs", name: "Hix HS FIC FIA", shortName: "Hix HS", type: "Ações", category: "oceano", color: "cyan", yield12m: "Ibov + α", risk: 5, description: "Ações Alta Convicção" },
    { id: "real_investor", name: "Real Investor FIC FIA", shortName: "Real Inv.", type: "Ações", category: "visao", color: "amber", yield12m: "Ibov + α", risk: 4, description: "Fundo de Ações Value" },
    { id: "ip_participacoes", name: "IP Participações", shortName: "IP Part.", type: "Ações", category: "visao", color: "amber", yield12m: "IPCA + α Global", risk: 4, description: "Ações Globais" },
    { id: "dynamo_cougar", name: "Dynamo Cougar", shortName: "Dynamo", type: "Ações", category: "oceano", color: "cyan", yield12m: "Ibov + α", risk: 5, description: "Fundo Seleto de Ações" },
    { id: "forpus_acoes", name: "Forpus Ações", shortName: "Forpus", type: "Ações", category: "oceano", color: "cyan", yield12m: "Ibov + α", risk: 5, description: "Foco em Growth" },
    { id: "alaska_black", name: "Alaska Black", shortName: "Alaska", type: "Ações", category: "oceano", color: "cyan", yield12m: "Ibov + α / Câmbio", risk: 5, description: "Ações / Câmbio Ativo" },
    { id: "velt_acoes", name: "Velt Ações", shortName: "Velt", type: "Ações", category: "oceano", color: "cyan", yield12m: "Ibov + α", risk: 5, description: "Gestão Ativa Fundamentalista" }
];


// ─────────────────────────────────────────────────────────────────────────────
// PROPORÇÕES SUGERIDAS (CARTEIRA "MODELO")
// Altere as proporções aqui para que a opção "Sugerir Carteira" ou "Autopreencher"
// use os novos pesos baseados no perfil de Investidor Qualificado ou Geral.
// ─────────────────────────────────────────────────────────────────────────────

export const SUGGESTED_ALLOCATIONS_GERAL: Record<StepKey, { fundId: string; weight: number }[]> = {
    reserva: [
        { fundId: "tesouro_selic", weight: 100 }
    ],
    abrigo: [
        { fundId: "tesouro_selic", weight: 80 },
        { fundId: "arx_fuji", weight: 3 },
        { fundId: "bnp_rubi", weight: 5 },
        { fundId: "ibiuna_credit", weight: 5 },
        { fundId: "arx_hedge", weight: 7 },
    ],
    ritmo: [
        { fundId: "tesouro_selic", weight: 50 },
        { fundId: "arx_fuji", weight: 4 },
        { fundId: "bnp_rubi", weight: 8 },
        { fundId: "ibiuna_credit", weight: 7 },
        { fundId: "arx_hedge", weight: 9 },
        { fundId: "kinea_atlas", weight: 6 },
        { fundId: "dahlia_total", weight: 8 },
        { fundId: "hix_hs", weight: 8 },
    ],
    visao: [
        { fundId: "tesouro_selic", weight: 25 },
        { fundId: "arx_fuji", weight: 4 },
        { fundId: "sparta_kinea", weight: 6 },
        { fundId: "bnp_rubi", weight: 8 },
        { fundId: "ibiuna_credit", weight: 7 },
        { fundId: "arx_hedge", weight: 9 },
        { fundId: "kinea_atlas", weight: 6 },
        { fundId: "dahlia_total", weight: 9 },
        { fundId: "hix_hs", weight: 10 },
        { fundId: "forpus_acoes", weight: 8 },
        { fundId: "real_investor", weight: 8 },
    ],
    oceano: [
        { fundId: "tesouro_selic", weight: 15 },
        { fundId: "arx_fuji", weight: 5 },
        { fundId: "sparta_kinea", weight: 7 },
        { fundId: "bnp_rubi", weight: 7 },
        { fundId: "ibiuna_credit", weight: 8 },
        { fundId: "arx_hedge", weight: 10 },
        { fundId: "kinea_atlas", weight: 8 },
        { fundId: "dahlia_total", weight: 10 },
        { fundId: "hix_hs", weight: 10 },
        { fundId: "forpus_acoes", weight: 10 },
        { fundId: "real_investor", weight: 10 },
    ],
};

export const SUGGESTED_ALLOCATIONS_IQ: Record<StepKey, { fundId: string; weight: number }[]> = {
    reserva: [
        { fundId: "tesouro_selic", weight: 100 }
    ],
    abrigo: [
        { fundId: "tesouro_selic", weight: 80 },
        { fundId: "arx_fuji", weight: 3 },
        { fundId: "valora_guardian_a", weight: 5 },
        { fundId: "capitania_yield_120", weight: 5 },
        { fundId: "arx_hedge", weight: 7 },
    ],
    ritmo: [
        { fundId: "tesouro_selic", weight: 50 },
        { fundId: "arx_fuji", weight: 4 },
        { fundId: "valora_guardian_a", weight: 7 },
        { fundId: "capitania_yield_120", weight: 6 },
        { fundId: "arx_hedge", weight: 9 },
        { fundId: "jgp_eco", weight: 6 },
        { fundId: "kinea_atlas", weight: 4 },
        { fundId: "dahlia_total", weight: 5 },
        { fundId: "truxt_long_bias", weight: 5 },
        { fundId: "spx_falcon", weight: 4 },
    ],
    visao: [
        { fundId: "tesouro_selic", weight: 25 },
        { fundId: "arx_fuji", weight: 4 },
        { fundId: "valora_guardian_a", weight: 10 },
        { fundId: "kinea_oportunidade_fif", weight: 3 },
        { fundId: "capitania_yield_120", weight: 6 },
        { fundId: "arx_hedge", weight: 9 },
        { fundId: "jgp_eco", weight: 5 },
        { fundId: "kinea_atlas", weight: 6 },
        { fundId: "dahlia_total", weight: 6 },
        { fundId: "truxt_long_bias", weight: 5 },
        { fundId: "brasil_capital", weight: 6 },
        { fundId: "hix_hs", weight: 5 },
        { fundId: "real_investor", weight: 5 },
        { fundId: "spx_falcon", weight: 5 },
    ],
    oceano: [
        { fundId: "tesouro_selic", weight: 12 },
        { fundId: "arx_fuji", weight: 4 },
        { fundId: "valora_guardian_a", weight: 10 },
        { fundId: "kinea_oportunidade_fif", weight: 3 },
        { fundId: "capitania_yield_120", weight: 6 },
        { fundId: "arx_hedge", weight: 9 },
        { fundId: "jgp_eco", weight: 8 },
        { fundId: "kinea_atlas", weight: 4 },
        { fundId: "dahlia_total", weight: 6 },
        { fundId: "truxt_long_bias", weight: 7 },
        { fundId: "brasil_capital", weight: 10 },
        { fundId: "hix_hs", weight: 7 },
        { fundId: "real_investor", weight: 7 },
        { fundId: "spx_falcon", weight: 7 },
    ],
};

export function getSuggestedAllocations(isQualificado: boolean): Record<StepKey, { fundId: string; weight: number }[]> {
    return isQualificado ? SUGGESTED_ALLOCATIONS_IQ : SUGGESTED_ALLOCATIONS_GERAL;
}
