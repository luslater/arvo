export type PortfolioLine = "Geral Normal" | "Geral Light" | "IQ Normal" | "IQ Light";
export type InvestorProfile = "Conservador" | "Moderado" | "Arrojado";

export interface MockAsset {
    asset: string;
    class: string;
    manager: string;
    weight: number;
    eligibility?: string;
}

export interface MockLevel {
    name: string;
    position: number;
    headline: string;
    description: string;
    assets: MockAsset[];
}

export const TIER_ORDER = [
  "Light",
  "Normal"
];
export const TIER_LABEL: Record<string, string> = {
  "Light": "Light (até R$ 100k)",
  "Normal": "Normal (acima de R$ 100k)"
};
export const TIER_DEFAULT_VALUE: Record<string, number> = {
  "Light": 30000,
  "Normal": 100000
};
export const ITYPE_ORDER = [
  "Geral",
  "IQ"
];
export const ITYPE_LABEL: Record<string, string> = {
  "Geral": "Geral",
  "IQ": "Qualificado (IQ)"
};
export const PERFIL_ORDER = [
  "Reserva",
  "90% Conservador",
  "Abrigo",
  "Abrigo-Ritmo",
  "Ritmo",
  "Ritmo-Visão",
  "Visão",
  "Visão-Oceano",
  "Oceano"
];

export const ASSET_METRICS: Record<string, { expectedReturn: number, volatility: number }> = {
  "CDI": {
    "expectedReturn": 13.02,
    "volatility": 0.48
  },
  "IPCA": {
    "expectedReturn": 4.6,
    "volatility": 0.99
  },
  "SELIC": {
    "expectedReturn": 13.02,
    "volatility": 0.48
  },
  "IBOV": {
    "expectedReturn": 13.99,
    "volatility": 16
  },
  "Dolar": {
    "expectedReturn": -0.19,
    "volatility": 10.25
  },
  "Tesouro Selic / Fundo Simples": {
    "expectedReturn": 12.99,
    "volatility": 0.48
  },
  "ARX Fuji": {
    "expectedReturn": 13.85,
    "volatility": 0.44
  },
  "Valora Guardian Advisory Fidc": {
    "expectedReturn": 14.44,
    "volatility": 0.88
  },
  "Sparta Deb Inc FIC Incentivados": {
    "expectedReturn": 14.04,
    "volatility": 2.53
  },
  "JGP Corporate": {
    "expectedReturn": 13.73,
    "volatility": 1.06
  },
  "SPX Seahawk Credito Privado": {
    "expectedReturn": 13.33,
    "volatility": 1.33
  },
  "Kinea Oportunidade FIM": {
    "expectedReturn": 14.29,
    "volatility": 0.76
  },
  "BNP Paribas Rubi": {
    "expectedReturn": 13.82,
    "volatility": 0.56
  },
  "MAPFRE RF FIF": {
    "expectedReturn": 13.24,
    "volatility": 0.72
  },
  "Augme 30 CIC": {
    "expectedReturn": 13.15,
    "volatility": 1.51
  },
  "Augme 180 FIF": {
    "expectedReturn": 13.22,
    "volatility": 1.73
  },
  "Capitania Premium 45": {
    "expectedReturn": 9.31,
    "volatility": 1.9
  },
  "Capitania Radar 90": {
    "expectedReturn": 7.71,
    "volatility": 3.1
  },
  "Capitania Yield 120": {
    "expectedReturn": 15.76,
    "volatility": 0.43
  },
  "Ibiuna Credit": {
    "expectedReturn": 13.21,
    "volatility": 1.02
  },
  "JGP Select Premium": {
    "expectedReturn": 14.81,
    "volatility": 1.91
  },
  "Genoa Capital Radar": {
    "expectedReturn": 12.98,
    "volatility": 3.47
  },
  "Legacy Compound": {
    "expectedReturn": 11.53,
    "volatility": 3.01
  },
  "Bahia AM DI": {
    "expectedReturn": 12.92,
    "volatility": 0.48
  },
  "ARX Hedge Infra": {
    "expectedReturn": 15.65,
    "volatility": 3.23
  },
  "Kinea Deb Incentivadas": {
    "expectedReturn": 12.39,
    "volatility": 1.89
  },
  "Itau Deb Incentivadas": {
    "expectedReturn": 8.15,
    "volatility": 4.57
  },
  "Trend Pre Fixado": {
    "expectedReturn": 11.26,
    "volatility": 3.16
  },
  "JGP Ecossistema": {
    "expectedReturn": 23.51,
    "volatility": 5.76
  },
  "Gavea Macro": {
    "expectedReturn": 7.45,
    "volatility": 4.67
  },
  "Gavea Macro Plus": {
    "expectedReturn": 5.58,
    "volatility": 7.05
  },
  "Ibiuna Hedge ST": {
    "expectedReturn": 7.88,
    "volatility": 8.54
  },
  "Kapitalo Kappa": {
    "expectedReturn": 12.66,
    "volatility": 6.51
  },
  "Kapitalo Zeta": {
    "expectedReturn": 12.19,
    "volatility": 11.22
  },
  "Kinea Atlas": {
    "expectedReturn": 12.47,
    "volatility": 5.36
  },
  "Kinea Oportunidade FIF": {
    "expectedReturn": 14.39,
    "volatility": 0.72
  },
  "Mar Absoluto": {
    "expectedReturn": -0.07,
    "volatility": 14.45
  },
  "SPX Nimitz": {
    "expectedReturn": 8.41,
    "volatility": 5.62
  },
  "SPX Raptor": {
    "expectedReturn": 4.25,
    "volatility": 11.19
  },
  "Verde AM X60": {
    "expectedReturn": 13.91,
    "volatility": 4.64
  },
  "Vista Multiestrategia": {
    "expectedReturn": -7.94,
    "volatility": 27.02
  },
  "Vista Hedge": {
    "expectedReturn": 2.55,
    "volatility": 13.07
  },
  "Dahlia Total Return": {
    "expectedReturn": 10.49,
    "volatility": 10.03
  },
  "Encore Long Bias": {
    "expectedReturn": 6.6,
    "volatility": 19.33
  },
  "Truxt Long Bias": {
    "expectedReturn": 18.49,
    "volatility": 20.11
  },
  "Atmos Acoes": {
    "expectedReturn": 11.84,
    "volatility": 15.62
  },
  "Bogari Value": {
    "expectedReturn": 5.16,
    "volatility": 19.92
  },
  "Bogari Value Q FIC FIF Acoes RL": {
    "expectedReturn": 6.12,
    "volatility": 19.92
  },
  "Brasil Capital Institucional 30 FIC FIF Acoes RL": {
    "expectedReturn": 4.64,
    "volatility": 18.47
  },
  "Dynamo Cougar": {
    "expectedReturn": 13.45,
    "volatility": 18.66
  },
  "Hix Capital FIC FIA": {
    "expectedReturn": 14.67,
    "volatility": 18.06
  },
  "Hix Capital HS FIA": {
    "expectedReturn": 18.81,
    "volatility": 21.72
  },
  "Forpus Acoes FIC FIF Acoes RL": {
    "expectedReturn": 0.58,
    "volatility": 18.92
  },
  "Real Investor FIC FIF Acoes RL": {
    "expectedReturn": 14.68,
    "volatility": 15.97
  },
  "IP Participacoes FIC FIF Acoes RL": {
    "expectedReturn": 16.75,
    "volatility": 12.41
  },
  "Alaska Black FIF Cotas FIA": {
    "expectedReturn": -2.44,
    "volatility": 39.18
  },
  "SPX Falcon": {
    "expectedReturn": 28.31,
    "volatility": 11.77
  },
  "WELLINGTON VENTURA ADVISORY": {
    "expectedReturn": 23.49,
    "volatility": 12.03
  },
  "SPX Patriot FIF CIC Ações RL": {
    "expectedReturn": 21.37,
    "volatility": 16.76
  },
  "IVVB11": {
    "expectedReturn": 20.76,
    "volatility": 13.31
  },
  "NASD11": {
    "expectedReturn": 30.22,
    "volatility": 18.33
  },
  "WRLD11": {
    "expectedReturn": 18.8,
    "volatility": 12.18
  },
  "CDBI11": {
    "expectedReturn": 12.99,
    "volatility": 0.48
  },
  "DIVO11": {
    "expectedReturn": 16.48,
    "volatility": 13.88
  },
  "VALORA GUARDIAN ADVISORY FIDC – RL": {
    "expectedReturn": 14.44,
    "volatility": 0.88
  },
  "Wellington Ventura Advisory": {
    "expectedReturn": 23.49,
    "volatility": 12.03
  }
};

export interface RecommendedPortfolio {
  id: string;
  tier: string;
  tier_label: string;
  itype: string;
  perfil: string;
  level?: number;
  strategy?: string;
  weights: Record<string, number>;
}

export const RECOMMENDED_PORTFOLIOS: RecommendedPortfolio[] = [
  {
    "id": "Light | Geral - Reserva",
    "tier": "Light",
    "tier_label": "Light (até R$ 100k)",
    "itype": "Geral",
    "perfil": "Reserva",
    "strategy": "Máximo Histórico",
    "weights": {
      "Tesouro Selic / Fundo Simples": 1
    }
  },
  {
    "id": "Light | Geral - 90% Conservador",
    "tier": "Light",
    "tier_label": "Light (até R$ 100k)",
    "itype": "Geral",
    "perfil": "90% Conservador",
    "strategy": "Máximo Histórico",
    "weights": {
      "Tesouro Selic / Fundo Simples": 0.9,
      "ARX Fuji": 0.1
    }
  },
  {
    "id": "Light | Geral - Abrigo",
    "tier": "Light",
    "tier_label": "Light (até R$ 100k)",
    "itype": "Geral",
    "perfil": "Abrigo",
    "strategy": "Máximo Histórico",
    "weights": {
      "Tesouro Selic / Fundo Simples": 0.8,
      "ARX Fuji": 0.05,
      "JGP Corporate": 0.05,
      "BNP Paribas Rubi": 0.05,
      "Ibiuna Credit": 0.05
    }
  },
  {
    "id": "Light | Geral - Abrigo-Ritmo",
    "tier": "Light",
    "tier_label": "Light (até R$ 100k)",
    "itype": "Geral",
    "perfil": "Abrigo-Ritmo",
    "strategy": "Máximo Histórico",
    "weights": {
      "Tesouro Selic / Fundo Simples": 0.7,
      "ARX Fuji": 0.1,
      "Sparta Deb Inc FIC Incentivados": 0.1,
      "BNP Paribas Rubi": 0.1
    }
  },
  {
    "id": "Light | Geral - Ritmo",
    "tier": "Light",
    "tier_label": "Light (até R$ 100k)",
    "itype": "Geral",
    "perfil": "Ritmo",
    "strategy": "Robustez 360",
    "weights": {
      "Tesouro Selic / Fundo Simples": 0.6,
      "ARX Fuji": 0.04,
      "Sparta Deb Inc FIC Incentivados": 0.09,
      "BNP Paribas Rubi": 0.03,
      "Augme 30 CIC": 0.03,
      "Trend Pre Fixado": 0.03,
      "Kapitalo Kappa": 0.05,
      "Kinea Atlas": 0.03,
      "IVVB11": 0.03,
      "Wellington Ventura Advisory": 0.04,
      "DIVO11": 0.03
    }
  },
  {
    "id": "Light | Geral - Ritmo-Visão",
    "tier": "Light",
    "tier_label": "Light (até R$ 100k)",
    "itype": "Geral",
    "perfil": "Ritmo-Visão",
    "strategy": "Máximo Histórico",
    "weights": {
      "Tesouro Selic / Fundo Simples": 0.5,
      "ARX Fuji": 0.04,
      "BNP Paribas Rubi": 0.06,
      "ARX Hedge Infra": 0.1,
      "Kinea Atlas": 0.1,
      "Hix Capital HS FIA": 0.1,
      "IVVB11": 0.1
    }
  },
  {
    "id": "Light | Geral - Visão",
    "tier": "Light",
    "tier_label": "Light (até R$ 100k)",
    "itype": "Geral",
    "perfil": "Visão",
    "strategy": "Robustez 360",
    "weights": {
      "Tesouro Selic / Fundo Simples": 0.4,
      "ARX Fuji": 0.07,
      "Sparta Deb Inc FIC Incentivados": 0.08,
      "BNP Paribas Rubi": 0.03,
      "Kinea Deb Incentivadas": 0.03,
      "Trend Pre Fixado": 0.03,
      "Kapitalo Kappa": 0.1,
      "Kinea Atlas": 0.04,
      "Hix Capital HS FIA": 0.05,
      "IVVB11": 0.05,
      "NASD11": 0.04,
      "Wellington Ventura Advisory": 0.05,
      "DIVO11": 0.03
    }
  },
  {
    "id": "Light | Geral - Visão-Oceano",
    "tier": "Light",
    "tier_label": "Light (até R$ 100k)",
    "itype": "Geral",
    "perfil": "Visão-Oceano",
    "strategy": "Robustez 360",
    "weights": {
      "Tesouro Selic / Fundo Simples": 0.3,
      "ARX Fuji": 0.04,
      "Sparta Deb Inc FIC Incentivados": 0.1,
      "Kapitalo Kappa": 0.1,
      "SPX Patriot FIF CIC Ações RL": 0.1,
      "IVVB11": 0.1,
      "NASD11": 0.06,
      "Wellington Ventura Advisory": 0.1,
      "DIVO11": 0.1
    }
  },
  {
    "id": "Light | Geral - Oceano",
    "tier": "Light",
    "tier_label": "Light (até R$ 100k)",
    "itype": "Geral",
    "perfil": "Oceano",
    "strategy": "Robustez 360",
    "weights": {
      "Tesouro Selic / Fundo Simples": 0.2,
      "ARX Fuji": 0.04,
      "Sparta Deb Inc FIC Incentivados": 0.04,
      "BNP Paribas Rubi": 0.04,
      "Kinea Deb Incentivadas": 0.03,
      "Trend Pre Fixado": 0.03,
      "Kapitalo Kappa": 0.09,
      "Kinea Atlas": 0.03,
      "Dahlia Total Return": 0.03,
      "SPX Patriot FIF CIC Ações RL": 0.1,
      "IVVB11": 0.1,
      "NASD11": 0.08,
      "Wellington Ventura Advisory": 0.1,
      "DIVO11": 0.09
    }
  },
  {
    "id": "Normal | Geral - Reserva",
    "tier": "Normal",
    "tier_label": "Normal (acima de R$ 100k)",
    "itype": "Geral",
    "perfil": "Reserva",
    "strategy": "Robustez 360",
    "weights": {
      "Tesouro Selic / Fundo Simples": 1
    }
  },
  {
    "id": "Normal | Geral - 90% Conservador",
    "tier": "Normal",
    "tier_label": "Normal (acima de R$ 100k)",
    "itype": "Geral",
    "perfil": "90% Conservador",
    "strategy": "Máximo Histórico",
    "weights": {
      "Tesouro Selic / Fundo Simples": 0.9,
      "ARX Fuji": 0.1
    }
  },
  {
    "id": "Normal | Geral - Abrigo",
    "tier": "Normal",
    "tier_label": "Normal (acima de R$ 100k)",
    "itype": "Geral",
    "perfil": "Abrigo",
    "strategy": "Robustez 360",
    "weights": {
      "Tesouro Selic / Fundo Simples": 0.8,
      "ARX Fuji": 0.03,
      "JGP Corporate": 0.03,
      "BNP Paribas Rubi": 0.08,
      "Augme 30 CIC": 0.03,
      "Ibiuna Credit": 0.03
    }
  },
  {
    "id": "Normal | Geral - Abrigo-Ritmo",
    "tier": "Normal",
    "tier_label": "Normal (acima de R$ 100k)",
    "itype": "Geral",
    "perfil": "Abrigo-Ritmo",
    "strategy": "Robustez 360",
    "weights": {
      "Tesouro Selic / Fundo Simples": 0.7,
      "ARX Fuji": 0.05,
      "JGP Corporate": 0.05,
      "BNP Paribas Rubi": 0.06,
      "Augme 30 CIC": 0.04,
      "Ibiuna Credit": 0.05,
      "ARX Hedge Infra": 0.05
    }
  },
  {
    "id": "Normal | Geral - Ritmo",
    "tier": "Normal",
    "tier_label": "Normal (acima de R$ 100k)",
    "itype": "Geral",
    "perfil": "Ritmo",
    "strategy": "Robustez 360",
    "weights": {
      "Tesouro Selic / Fundo Simples": 0.6,
      "ARX Fuji": 0.03,
      "Sparta Deb Inc FIC Incentivados": 0.04,
      "BNP Paribas Rubi": 0.04,
      "Ibiuna Credit": 0.04,
      "ARX Hedge Infra": 0.07,
      "Verde AM X60": 0.05,
      "IVVB11": 0.04,
      "Wellington Ventura Advisory": 0.03,
      "DIVO11": 0.03,
      "SPX Patriot FIF CIC Ações RL": 0.03
    }
  },
  {
    "id": "Normal | Geral - Ritmo-Visão",
    "tier": "Normal",
    "tier_label": "Normal (acima de R$ 100k)",
    "itype": "Geral",
    "perfil": "Ritmo-Visão",
    "strategy": "Robustez 360",
    "weights": {
      "Tesouro Selic / Fundo Simples": 0.5,
      "ARX Fuji": 0.05,
      "Sparta Deb Inc FIC Incentivados": 0.04,
      "BNP Paribas Rubi": 0.04,
      "Ibiuna Credit": 0.04,
      "ARX Hedge Infra": 0.07,
      "Verde AM X60": 0.06,
      "IVVB11": 0.06,
      "Wellington Ventura Advisory": 0.05,
      "DIVO11": 0.04,
      "SPX Patriot FIF CIC Ações RL": 0.05
    }
  },
  {
    "id": "Normal | Geral - Visão",
    "tier": "Normal",
    "tier_label": "Normal (acima de R$ 100k)",
    "itype": "Geral",
    "perfil": "Visão",
    "strategy": "Robustez 360",
    "weights": {
      "Tesouro Selic / Fundo Simples": 0.4,
      "ARX Fuji": 0.06,
      "Sparta Deb Inc FIC Incentivados": 0.05,
      "BNP Paribas Rubi": 0.05,
      "Ibiuna Credit": 0.04,
      "ARX Hedge Infra": 0.08,
      "Verde AM X60": 0.05,
      "SPX Patriot FIF CIC Ações RL": 0.05,
      "IVVB11": 0.05,
      "NASD11": 0.05,
      "Wellington Ventura Advisory": 0.07,
      "DIVO11": 0.05
    }
  },
  {
    "id": "Normal | Geral - Visão-Oceano",
    "tier": "Normal",
    "tier_label": "Normal (acima de R$ 100k)",
    "itype": "Geral",
    "perfil": "Visão-Oceano",
    "strategy": "Robustez 360",
    "weights": {
      "Tesouro Selic / Fundo Simples": 0.3,
      "ARX Fuji": 0.05,
      "Sparta Deb Inc FIC Incentivados": 0.05,
      "BNP Paribas Rubi": 0.04,
      "Ibiuna Credit": 0.04,
      "ARX Hedge Infra": 0.08,
      "Kapitalo Kappa": 0.02,
      "Kinea Atlas": 0.04,
      "SPX Patriot FIF CIC Ações RL": 0.08,
      "IVVB11": 0.07,
      "NASD11": 0.07,
      "Wellington Ventura Advisory": 0.08,
      "DIVO11": 0.08
    }
  },
  {
    "id": "Normal | Geral - Oceano",
    "tier": "Normal",
    "tier_label": "Normal (acima de R$ 100k)",
    "itype": "Geral",
    "perfil": "Oceano",
    "strategy": "Robustez 360",
    "weights": {
      "Tesouro Selic / Fundo Simples": 0.2,
      "ARX Fuji": 0.04,
      "Sparta Deb Inc FIC Incentivados": 0.04,
      "BNP Paribas Rubi": 0.05,
      "Ibiuna Credit": 0.04,
      "ARX Hedge Infra": 0.06,
      "Kapitalo Kappa": 0.04,
      "Kinea Atlas": 0.04,
      "SPX Patriot FIF CIC Ações RL": 0.1,
      "IVVB11": 0.1,
      "NASD11": 0.09,
      "Wellington Ventura Advisory": 0.1,
      "DIVO11": 0.1
    }
  },
  {
    "id": "Normal | IQ - Reserva",
    "tier": "Normal",
    "tier_label": "Normal (acima de R$ 100k)",
    "itype": "IQ",
    "perfil": "Reserva",
    "strategy": "Robustez 360",
    "weights": {
      "Tesouro Selic / Fundo Simples": 1
    }
  },
  {
    "id": "Normal | IQ - 90% Conservador",
    "tier": "Normal",
    "tier_label": "Normal (acima de R$ 100k)",
    "itype": "IQ",
    "perfil": "90% Conservador",
    "strategy": "Robustez 360",
    "weights": {
      "Tesouro Selic / Fundo Simples": 0.9,
      "VALORA GUARDIAN ADVISORY FIDC – RL": 0.05,
      "ARX Fuji": 0.05
    }
  },
  {
    "id": "Normal | IQ - Abrigo",
    "tier": "Normal",
    "tier_label": "Normal (acima de R$ 100k)",
    "itype": "IQ",
    "perfil": "Abrigo",
    "strategy": "Robustez 360",
    "weights": {
      "Tesouro Selic / Fundo Simples": 0.8,
      "ARX Fuji": 0.03,
      "VALORA GUARDIAN ADVISORY FIDC – RL": 0.08,
      "Kinea Oportunidade FIM": 0.03,
      "Augme 30 CIC": 0.03,
      "Ibiuna Credit": 0.03
    }
  },
  {
    "id": "Normal | IQ - Abrigo-Ritmo",
    "tier": "Normal",
    "tier_label": "Normal (acima de R$ 100k)",
    "itype": "IQ",
    "perfil": "Abrigo-Ritmo",
    "strategy": "Robustez 360",
    "weights": {
      "Tesouro Selic / Fundo Simples": 0.7,
      "ARX Fuji": 0.05,
      "VALORA GUARDIAN ADVISORY FIDC – RL": 0.06,
      "Kinea Oportunidade FIM": 0.04,
      "Augme 30 CIC": 0.05,
      "Ibiuna Credit": 0.04,
      "ARX Hedge Infra": 0.06
    }
  },
  {
    "id": "Normal | IQ - Ritmo",
    "tier": "Normal",
    "tier_label": "Normal (acima de R$ 100k)",
    "itype": "IQ",
    "perfil": "Ritmo",
    "strategy": "Robustez 360",
    "weights": {
      "Tesouro Selic / Fundo Simples": 0.6,
      "ARX Hedge Infra": 0.04,
      "Kinea Oportunidade FIF": 0.04,
      "VALORA GUARDIAN ADVISORY FIDC – RL": 0.05,
      "ARX Fuji": 0.03,
      "Ibiuna Credit": 0.03,
      "Verde AM X60": 0.03,
      "Wellington Ventura Advisory": 0.04,
      "SPX Patriot FIF CIC Ações RL": 0.06,
      "IVVB11": 0.05,
      "DIVO11": 0.03
    }
  },
  {
    "id": "Normal | IQ - Ritmo-Visão",
    "tier": "Normal",
    "tier_label": "Normal (acima de R$ 100k)",
    "itype": "IQ",
    "perfil": "Ritmo-Visão",
    "strategy": "Robustez 360",
    "weights": {
      "Tesouro Selic / Fundo Simples": 0.5,
      "ARX Hedge Infra": 0.05,
      "Kinea Oportunidade FIF": 0.05,
      "VALORA GUARDIAN ADVISORY FIDC – RL": 0.05,
      "ARX Fuji": 0.05,
      "Ibiuna Credit": 0.04,
      "Verde AM X60": 0.06,
      "Wellington Ventura Advisory": 0.04,
      "SPX Patriot FIF CIC Ações RL": 0.04,
      "IVVB11": 0.04,
      "DIVO11": 0.04,
      "NASD11": 0.04
    }
  },
  {
    "id": "Normal | IQ - Visão",
    "tier": "Normal",
    "tier_label": "Normal (acima de R$ 100k)",
    "itype": "IQ",
    "perfil": "Visão",
    "strategy": "Robustez 360",
    "weights": {
      "Tesouro Selic / Fundo Simples": 0.4,
      "VALORA GUARDIAN ADVISORY FIDC – RL": 0.04,
      "Sparta Deb Inc FIC Incentivados": 0.04,
      "BNP Paribas Rubi": 0.04,
      "Ibiuna Credit": 0.04,
      "ARX Hedge Infra": 0.06,
      "Kinea Oportunidade FIF": 0.05,
      "Truxt Long Bias": 0.04,
      "Verde AM X60": 0.06,
      "SPX Patriot FIF CIC Ações RL": 0.06,
      "IVVB11": 0.04,
      "NASD11": 0.04,
      "Wellington Ventura Advisory": 0.05,
      "DIVO11": 0.04
    }
  },
  {
    "id": "Normal | IQ - Visão-Oceano",
    "tier": "Normal",
    "tier_label": "Normal (acima de R$ 100k)",
    "itype": "IQ",
    "perfil": "Visão-Oceano",
    "strategy": "Robustez 360",
    "weights": {
      "Tesouro Selic / Fundo Simples": 0.3,
      "ARX Fuji": 0.03,
      "VALORA GUARDIAN ADVISORY FIDC – RL": 0.05,
      "Sparta Deb Inc FIC Incentivados": 0.05,
      "BNP Paribas Rubi": 0.04,
      "Ibiuna Credit": 0.04,
      "ARX Hedge Infra": 0.07,
      "Kinea Oportunidade FIF": 0.04,
      "Truxt Long Bias": 0.05,
      "Verde AM X60": 0.07,
      "SPX Patriot FIF CIC Ações RL": 0.07,
      "DIVO11": 0.05,
      "Wellington Ventura Advisory": 0.05,
      "NASD11": 0.04,
      "IVVB11": 0.05
    }
  },
  {
    "id": "Normal | IQ - Oceano",
    "tier": "Normal",
    "tier_label": "Normal (acima de R$ 100k)",
    "itype": "IQ",
    "perfil": "Oceano",
    "strategy": "Robustez 360",
    "weights": {
      "Tesouro Selic / Fundo Simples": 0.2,
      "VALORA GUARDIAN ADVISORY FIDC – RL": 0.03,
      "ARX Hedge Infra": 0.04,
      "BNP Paribas Rubi": 0.02,
      "Kinea Oportunidade FIF": 0.05,
      "Truxt Long Bias": 0.05,
      "Verde AM X60": 0.08,
      "IVVB11": 0.1,
      "NASD11": 0.08,
      "Wellington Ventura Advisory": 0.1,
      "DIVO11": 0.1,
      "SPX Patriot FIF CIC Ações RL": 0.1,
      "WRLD11": 0.05
    }
  }
];
