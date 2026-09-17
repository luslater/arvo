// src/config/portfolios.ts
// ALIGNED WITH PLANILHA OFICIAL & RECOMMENDED_PORTFOLIOS

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

export const FUNDS_LIBRARY: FundCard[] = [
    {
        "id": "tesouro_selic_fundo_simples",
        "name": "Tesouro Selic / Fundo Simples",
        "shortName": "Tesouro Selic",
        "type": "Renda Fixa",
        "category": "reserva",
        "color": "blue",
        "yield12m": "CDI",
        "risk": 1,
        "description": "Título Público / Caixa"
    },
    {
        "id": "arx_fuji",
        "name": "ARX Fuji",
        "shortName": "ARX Fuji",
        "type": "Renda Fixa",
        "category": "abrigo",
        "color": "indigo",
        "yield12m": "CDI + α",
        "risk": 2,
        "description": "Caixa Premium"
    },
    {
        "id": "valora_guardian_advisory_fidc_rl",
        "name": "VALORA GUARDIAN ADVISORY FIDC – RL",
        "shortName": "Valora Guardian",
        "type": "Renda Fixa",
        "category": "abrigo",
        "color": "indigo",
        "yield12m": "CDI + α",
        "risk": 2,
        "description": "Crédito Privado FIDC"
    },
    {
        "id": "bnp_paribas_rubi",
        "name": "BNP Paribas Rubi",
        "shortName": "BNP Rubi",
        "type": "Renda Fixa",
        "category": "abrigo",
        "color": "indigo",
        "yield12m": "CDI + α",
        "risk": 2,
        "description": "Crédito High Grade"
    },
    {
        "id": "jgp_corporate",
        "name": "JGP Corporate",
        "shortName": "JGP Corporate",
        "type": "Renda Fixa",
        "category": "abrigo",
        "color": "indigo",
        "yield12m": "CDI + α",
        "risk": 2,
        "description": "Crédito Privado"
    },
    {
        "id": "ibiuna_credit",
        "name": "Ibiuna Credit",
        "shortName": "Ibiuna Credit",
        "type": "Renda Fixa",
        "category": "abrigo",
        "color": "indigo",
        "yield12m": "CDI + α",
        "risk": 2,
        "description": "Crédito Privado"
    },
    {
        "id": "augme_30_cic",
        "name": "Augme 30 CIC",
        "shortName": "Augme 30",
        "type": "Renda Fixa",
        "category": "abrigo",
        "color": "indigo",
        "yield12m": "CDI + α",
        "risk": 2,
        "description": "Crédito Estruturado"
    },
    {
        "id": "sparta_deb_inc_fic_incentivados",
        "name": "Sparta Deb Inc FIC Incentivados",
        "shortName": "Sparta Deb",
        "type": "Renda Fixa",
        "category": "ritmo",
        "color": "violet",
        "yield12m": "IPCA + α",
        "risk": 3,
        "description": "Debêntures Incentivadas"
    },
    {
        "id": "kinea_deb_incentivadas",
        "name": "Kinea Deb Incentivadas",
        "shortName": "Kinea Debs",
        "type": "Renda Fixa",
        "category": "ritmo",
        "color": "violet",
        "yield12m": "IPCA + α",
        "risk": 3,
        "description": "Debêntures Incentivadas"
    },
    {
        "id": "arx_hedge_infra",
        "name": "ARX Hedge Infra",
        "shortName": "ARX Infra",
        "type": "Renda Fixa",
        "category": "ritmo",
        "color": "violet",
        "yield12m": "IPCA + α",
        "risk": 3,
        "description": "Infraestrutura IPCA+"
    },
    {
        "id": "trend_pre_fixado",
        "name": "Trend Pre Fixado",
        "shortName": "Trend Pré",
        "type": "Renda Fixa",
        "category": "ritmo",
        "color": "violet",
        "yield12m": "Pré",
        "risk": 3,
        "description": "Prefixado"
    },
    {
        "id": "kinea_oportunidade_fim",
        "name": "Kinea Oportunidade FIM",
        "shortName": "Kinea Oport. FIM",
        "type": "Multimercado",
        "category": "visao",
        "color": "amber",
        "yield12m": "CDI + α",
        "risk": 3,
        "description": "Multimercado Conservador"
    },
    {
        "id": "kinea_oportunidade_fif",
        "name": "Kinea Oportunidade FIF",
        "shortName": "Kinea Oport. FIF",
        "type": "Multimercado",
        "category": "visao",
        "color": "amber",
        "yield12m": "CDI + α",
        "risk": 4,
        "description": "Multimercado FIF"
    },
    {
        "id": "verde_am_x60",
        "name": "Verde AM X60",
        "shortName": "Verde X60",
        "type": "Multimercado",
        "category": "visao",
        "color": "amber",
        "yield12m": "Macro",
        "risk": 4,
        "description": "Multimercado Macro"
    },
    {
        "id": "dahlia_total_return",
        "name": "Dahlia Total Return",
        "shortName": "Dahlia TR",
        "type": "Multimercado",
        "category": "visao",
        "color": "amber",
        "yield12m": "Ações + RF",
        "risk": 4,
        "description": "Multimercado Long Bias"
    },
    {
        "id": "truxt_long_bias",
        "name": "Truxt Long Bias",
        "shortName": "Truxt LB",
        "type": "Multimercado",
        "category": "visao",
        "color": "amber",
        "yield12m": "Ibov / Macro",
        "risk": 4,
        "description": "Multimercado Long Bias"
    },
    {
        "id": "kapitalo_kappa",
        "name": "Kapitalo Kappa",
        "shortName": "Kapitalo K.",
        "type": "Multimercado",
        "category": "oceano",
        "color": "cyan",
        "yield12m": "Macro Global",
        "risk": 5,
        "description": "Multimercado Macro"
    },
    {
        "id": "kinea_atlas",
        "name": "Kinea Atlas",
        "shortName": "Kinea Atlas",
        "type": "Multimercado",
        "category": "oceano",
        "color": "cyan",
        "yield12m": "Macro Global",
        "risk": 5,
        "description": "Multimercado Macro"
    },
    {
        "id": "spx_patriot_fif_cic_a_es_rl",
        "name": "SPX Patriot FIF CIC Ações RL",
        "shortName": "SPX Patriot",
        "type": "Ações",
        "category": "oceano",
        "color": "cyan",
        "yield12m": "Ibov + α",
        "risk": 5,
        "description": "Ações Brasil"
    },
    {
        "id": "hix_capital_hs_fia",
        "name": "Hix Capital HS FIA",
        "shortName": "Hix HS",
        "type": "Ações",
        "category": "oceano",
        "color": "cyan",
        "yield12m": "Ibov + α",
        "risk": 5,
        "description": "Ações Brasil"
    },
    {
        "id": "ivvb11",
        "name": "IVVB11",
        "shortName": "IVVB11",
        "type": "Ações",
        "category": "oceano",
        "color": "cyan",
        "yield12m": "S&P 500",
        "risk": 5,
        "description": "ETF S&P 500 em BRL"
    },
    {
        "id": "nasd11",
        "name": "NASD11",
        "shortName": "NASD11",
        "type": "Ações",
        "category": "oceano",
        "color": "cyan",
        "yield12m": "Nasdaq 100",
        "risk": 5,
        "description": "ETF Nasdaq 100 em BRL"
    },
    {
        "id": "divo11",
        "name": "DIVO11",
        "shortName": "DIVO11",
        "type": "Ações",
        "category": "oceano",
        "color": "cyan",
        "yield12m": "Dividendos",
        "risk": 5,
        "description": "ETF Índice Dividendos"
    },
    {
        "id": "wellington_ventura_advisory",
        "name": "Wellington Ventura Advisory",
        "shortName": "Wellington Ventura",
        "type": "Ações",
        "category": "oceano",
        "color": "cyan",
        "yield12m": "Global",
        "risk": 5,
        "description": "Ações Internacionais"
    },
    {
        "id": "wrld11",
        "name": "WRLD11",
        "shortName": "WRLD11",
        "type": "Ações",
        "category": "oceano",
        "color": "cyan",
        "yield12m": "Global",
        "risk": 5,
        "description": "ETF Ações Globais"
    },
    {
        "id": "tesouro_selic",
        "name": "Tesouro Selic",
        "shortName": "Tesouro Selic",
        "type": "Renda Fixa",
        "category": "reserva",
        "color": "blue",
        "yield12m": "CDI",
        "risk": 1,
        "description": "Título Público"
    },
    {
        "id": "di_simples",
        "name": "Fundo DI Simples",
        "shortName": "DI Simples",
        "type": "Renda Fixa",
        "category": "reserva",
        "color": "blue",
        "yield12m": "CDI",
        "risk": 1,
        "description": "DI Puro"
    },
    {
        "id": "valora_guardian",
        "name": "Valora Guardian II",
        "shortName": "Valora G. II",
        "type": "Renda Fixa",
        "category": "abrigo",
        "color": "indigo",
        "yield12m": "CDI + α",
        "risk": 2,
        "description": "DI Crédito"
    },
    {
        "id": "sparta_kinea",
        "name": "Sparta/Kinea Deb Incentivadas",
        "shortName": "Sparta Deb",
        "type": "Renda Fixa",
        "category": "ritmo",
        "color": "violet",
        "yield12m": "IPCA + α",
        "risk": 3,
        "description": "Crédito Isento"
    },
    {
        "id": "trend_pre",
        "name": "Trend Pré Fixado",
        "shortName": "Trend Pré",
        "type": "Renda Fixa",
        "category": "ritmo",
        "color": "violet",
        "yield12m": "Pré",
        "risk": 3,
        "description": "Prefixado"
    },
    {
        "id": "hix_hs",
        "name": "Hix HS FIC FIA",
        "shortName": "Hix HS",
        "type": "Ações",
        "category": "oceano",
        "color": "cyan",
        "yield12m": "Ibov + α",
        "risk": 5,
        "description": "Ações Alta Convicção"
    }
];

export const SUGGESTED_ALLOCATIONS_GERAL: Record<StepKey, { fundId: string; weight: number }[]> = {
    "reserva": [
        {
            "fundId": "tesouro_selic_fundo_simples",
            "weight": 100
        }
    ],
    "abrigo": [
        {
            "fundId": "tesouro_selic_fundo_simples",
            "weight": 80
        },
        {
            "fundId": "arx_fuji",
            "weight": 3
        },
        {
            "fundId": "jgp_corporate",
            "weight": 3
        },
        {
            "fundId": "bnp_paribas_rubi",
            "weight": 8
        },
        {
            "fundId": "augme_30_cic",
            "weight": 3
        },
        {
            "fundId": "ibiuna_credit",
            "weight": 3
        }
    ],
    "ritmo": [
        {
            "fundId": "tesouro_selic_fundo_simples",
            "weight": 60
        },
        {
            "fundId": "arx_fuji",
            "weight": 3
        },
        {
            "fundId": "sparta_deb_inc_fic_incentivados",
            "weight": 4
        },
        {
            "fundId": "bnp_paribas_rubi",
            "weight": 4
        },
        {
            "fundId": "ibiuna_credit",
            "weight": 4
        },
        {
            "fundId": "arx_hedge_infra",
            "weight": 7
        },
        {
            "fundId": "verde_am_x60",
            "weight": 5
        },
        {
            "fundId": "ivvb11",
            "weight": 4
        },
        {
            "fundId": "wellington_ventura_advisory",
            "weight": 3
        },
        {
            "fundId": "divo11",
            "weight": 3
        },
        {
            "fundId": "spx_patriot_fif_cic_a_es_rl",
            "weight": 3
        }
    ],
    "visao": [
        {
            "fundId": "tesouro_selic_fundo_simples",
            "weight": 40
        },
        {
            "fundId": "arx_fuji",
            "weight": 6
        },
        {
            "fundId": "sparta_deb_inc_fic_incentivados",
            "weight": 5
        },
        {
            "fundId": "bnp_paribas_rubi",
            "weight": 5
        },
        {
            "fundId": "ibiuna_credit",
            "weight": 4
        },
        {
            "fundId": "arx_hedge_infra",
            "weight": 8
        },
        {
            "fundId": "verde_am_x60",
            "weight": 5
        },
        {
            "fundId": "spx_patriot_fif_cic_a_es_rl",
            "weight": 5
        },
        {
            "fundId": "ivvb11",
            "weight": 5
        },
        {
            "fundId": "nasd11",
            "weight": 5
        },
        {
            "fundId": "wellington_ventura_advisory",
            "weight": 7
        },
        {
            "fundId": "divo11",
            "weight": 5
        }
    ],
    "oceano": [
        {
            "fundId": "tesouro_selic_fundo_simples",
            "weight": 20
        },
        {
            "fundId": "arx_fuji",
            "weight": 4
        },
        {
            "fundId": "sparta_deb_inc_fic_incentivados",
            "weight": 4
        },
        {
            "fundId": "bnp_paribas_rubi",
            "weight": 5
        },
        {
            "fundId": "ibiuna_credit",
            "weight": 4
        },
        {
            "fundId": "arx_hedge_infra",
            "weight": 6
        },
        {
            "fundId": "kapitalo_kappa",
            "weight": 4
        },
        {
            "fundId": "kinea_atlas",
            "weight": 4
        },
        {
            "fundId": "spx_patriot_fif_cic_a_es_rl",
            "weight": 10
        },
        {
            "fundId": "ivvb11",
            "weight": 10
        },
        {
            "fundId": "nasd11",
            "weight": 9
        },
        {
            "fundId": "wellington_ventura_advisory",
            "weight": 10
        },
        {
            "fundId": "divo11",
            "weight": 10
        }
    ]
};

export const SUGGESTED_ALLOCATIONS_IQ: Record<StepKey, { fundId: string; weight: number }[]> = {
    "reserva": [
        {
            "fundId": "tesouro_selic_fundo_simples",
            "weight": 100
        }
    ],
    "abrigo": [
        {
            "fundId": "tesouro_selic_fundo_simples",
            "weight": 80
        },
        {
            "fundId": "arx_fuji",
            "weight": 3
        },
        {
            "fundId": "valora_guardian_advisory_fidc_rl",
            "weight": 8
        },
        {
            "fundId": "kinea_oportunidade_fim",
            "weight": 3
        },
        {
            "fundId": "augme_30_cic",
            "weight": 3
        },
        {
            "fundId": "ibiuna_credit",
            "weight": 3
        }
    ],
    "ritmo": [
        {
            "fundId": "tesouro_selic_fundo_simples",
            "weight": 60
        },
        {
            "fundId": "arx_hedge_infra",
            "weight": 4
        },
        {
            "fundId": "kinea_oportunidade_fif",
            "weight": 4
        },
        {
            "fundId": "valora_guardian_advisory_fidc_rl",
            "weight": 5
        },
        {
            "fundId": "arx_fuji",
            "weight": 3
        },
        {
            "fundId": "ibiuna_credit",
            "weight": 3
        },
        {
            "fundId": "verde_am_x60",
            "weight": 3
        },
        {
            "fundId": "wellington_ventura_advisory",
            "weight": 4
        },
        {
            "fundId": "spx_patriot_fif_cic_a_es_rl",
            "weight": 6
        },
        {
            "fundId": "ivvb11",
            "weight": 5
        },
        {
            "fundId": "divo11",
            "weight": 3
        }
    ],
    "visao": [
        {
            "fundId": "tesouro_selic_fundo_simples",
            "weight": 40
        },
        {
            "fundId": "valora_guardian_advisory_fidc_rl",
            "weight": 4
        },
        {
            "fundId": "sparta_deb_inc_fic_incentivados",
            "weight": 4
        },
        {
            "fundId": "bnp_paribas_rubi",
            "weight": 4
        },
        {
            "fundId": "ibiuna_credit",
            "weight": 4
        },
        {
            "fundId": "arx_hedge_infra",
            "weight": 6
        },
        {
            "fundId": "kinea_oportunidade_fif",
            "weight": 5
        },
        {
            "fundId": "truxt_long_bias",
            "weight": 4
        },
        {
            "fundId": "verde_am_x60",
            "weight": 6
        },
        {
            "fundId": "spx_patriot_fif_cic_a_es_rl",
            "weight": 6
        },
        {
            "fundId": "ivvb11",
            "weight": 4
        },
        {
            "fundId": "nasd11",
            "weight": 4
        },
        {
            "fundId": "wellington_ventura_advisory",
            "weight": 5
        },
        {
            "fundId": "divo11",
            "weight": 4
        }
    ],
    "oceano": [
        {
            "fundId": "tesouro_selic_fundo_simples",
            "weight": 20
        },
        {
            "fundId": "valora_guardian_advisory_fidc_rl",
            "weight": 3
        },
        {
            "fundId": "arx_hedge_infra",
            "weight": 4
        },
        {
            "fundId": "bnp_paribas_rubi",
            "weight": 2
        },
        {
            "fundId": "kinea_oportunidade_fif",
            "weight": 5
        },
        {
            "fundId": "truxt_long_bias",
            "weight": 5
        },
        {
            "fundId": "verde_am_x60",
            "weight": 8
        },
        {
            "fundId": "ivvb11",
            "weight": 10
        },
        {
            "fundId": "nasd11",
            "weight": 8
        },
        {
            "fundId": "wellington_ventura_advisory",
            "weight": 10
        },
        {
            "fundId": "divo11",
            "weight": 10
        },
        {
            "fundId": "spx_patriot_fif_cic_a_es_rl",
            "weight": 10
        },
        {
            "fundId": "wrld11",
            "weight": 5
        }
    ]
};

export function getSuggestedAllocations(isQualificado: boolean): Record<StepKey, { fundId: string; weight: number }[]> {
    return isQualificado ? SUGGESTED_ALLOCATIONS_IQ : SUGGESTED_ALLOCATIONS_GERAL;
}
