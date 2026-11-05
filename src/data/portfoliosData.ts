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
    "expectedReturn": 13.05,
    "volatility": 0.47
  },
  "IPCA": {
    "expectedReturn": 4.61,
    "volatility": 0.97
  },
  "SELIC": {
    "expectedReturn": 13.05,
    "volatility": 0.47
  },
  "IBOV": {
    "expectedReturn": 11.73,
    "volatility": 16.76
  },
  "Dolar": {
    "expectedReturn": 1,
    "volatility": 10.3
  },
  "Tesouro Selic / Fundo Simples": {
    "expectedReturn": 13.02,
    "volatility": 0.47
  },
  "ARX Fuji": {
    "expectedReturn": 13.84,
    "volatility": 0.43
  },
  "VALORA GUARDIAN ADVISORY FIDC – RL": {
    "expectedReturn": 14.45,
    "volatility": 0.86
  },
  "Valora Guardian Advisory Fidc": {
    "expectedReturn": 14.45,
    "volatility": 0.86
  },
  "Sparta Deb Inc FIC Incentivados": {
    "expectedReturn": 13.52,
    "volatility": 2.57
  },
  "JGP Corporate": {
    "expectedReturn": 13.69,
    "volatility": 1.03
  },
  "SPX Seahawk Credito Privado": {
    "expectedReturn": 13.23,
    "volatility": 1.31
  },
  "Kinea Oportunidade FIM": {
    "expectedReturn": 14.2,
    "volatility": 0.76
  },
  "BNP Paribas Rubi": {
    "expectedReturn": 13.79,
    "volatility": 0.55
  },
  "MAPFRE RF FIF": {
    "expectedReturn": 13.25,
    "volatility": 0.71
  },
  "Augme 30 CIC": {
    "expectedReturn": 12.9,
    "volatility": 1.52
  },
  "Augme 180 FIF": {
    "expectedReturn": 13.07,
    "volatility": 1.71
  },
  "Capitania Premium 45": {
    "expectedReturn": 8.07,
    "volatility": 2.66
  },
  "Capitania Radar 90": {
    "expectedReturn": 6.38,
    "volatility": 3.87
  },
  "Capitania Yield 120": {
    "expectedReturn": 15.72,
    "volatility": 0.43
  },
  "Ibiuna Credit": {
    "expectedReturn": 12.99,
    "volatility": 1.03
  },
  "JGP Select Premium": {
    "expectedReturn": 14.34,
    "volatility": 1.99
  },
  "Genoa Capital Radar": {
    "expectedReturn": 13.34,
    "volatility": 3.64
  },
  "Legacy Compound": {
    "expectedReturn": 11.26,
    "volatility": 3
  },
  "Bahia AM DI": {
    "expectedReturn": 12.93,
    "volatility": 0.47
  },
  "ARX Hedge Infra": {
    "expectedReturn": 14.81,
    "volatility": 3.44
  },
  "Kinea Deb Incentivadas": {
    "expectedReturn": 11.87,
    "volatility": 2.08
  },
  "Itau Deb Incentivadas": {
    "expectedReturn": 7.75,
    "volatility": 4.57
  },
  "Trend Pre Fixado": {
    "expectedReturn": 10.88,
    "volatility": 3.38
  },
  "JGP Ecossistema": {
    "expectedReturn": 21.35,
    "volatility": 6.14
  },
  "Gavea Macro": {
    "expectedReturn": 6.99,
    "volatility": 4.71
  },
  "Gavea Macro Plus": {
    "expectedReturn": 5,
    "volatility": 6.97
  },
  "Ibiuna Hedge ST": {
    "expectedReturn": 9.38,
    "volatility": 8.6
  },
  "Kapitalo Kappa": {
    "expectedReturn": 11,
    "volatility": 7.06
  },
  "Kapitalo Zeta": {
    "expectedReturn": 9.36,
    "volatility": 12.13
  },
  "Kinea Atlas": {
    "expectedReturn": 11.71,
    "volatility": 5.46
  },
  "Kinea Oportunidade FIF": {
    "expectedReturn": 14.29,
    "volatility": 0.72
  },
  "Mar Absoluto": {
    "expectedReturn": -2.68,
    "volatility": 15.14
  },
  "SPX Nimitz": {
    "expectedReturn": 8.78,
    "volatility": 5.54
  },
  "SPX Raptor": {
    "expectedReturn": 5.04,
    "volatility": 11.04
  },
  "Verde AM X60": {
    "expectedReturn": 12.72,
    "volatility": 4.82
  },
  "Vista Multiestrategia": {
    "expectedReturn": -12.11,
    "volatility": 27.51
  },
  "Vista Hedge": {
    "expectedReturn": 0.55,
    "volatility": 13.21
  },
  "Dahlia Total Return": {
    "expectedReturn": 10.09,
    "volatility": 9.99
  },
  "Encore Long Bias": {
    "expectedReturn": -1.77,
    "volatility": 24.84
  },
  "Truxt Long Bias": {
    "expectedReturn": 17.23,
    "volatility": 20.32
  },
  "Atmos Acoes": {
    "expectedReturn": 6.94,
    "volatility": 17.76
  },
  "Bogari Value": {
    "expectedReturn": 0.74,
    "volatility": 21.62
  },
  "Bogari Value Q FIC FIF Acoes RL": {
    "expectedReturn": 1.65,
    "volatility": 21.66
  },
  "Brasil Capital Institucional 30 FIC FIF Acoes RL": {
    "expectedReturn": 1.36,
    "volatility": 19.93
  },
  "Dynamo Cougar": {
    "expectedReturn": 11.61,
    "volatility": 19.05
  },
  "Hix Capital FIC FIA": {
    "expectedReturn": 10.4,
    "volatility": 19.05
  },
  "Hix Capital HS FIA": {
    "expectedReturn": 17.16,
    "volatility": 21.69
  },
  "Forpus Acoes FIC FIF Acoes RL": {
    "expectedReturn": -3.88,
    "volatility": 20
  },
  "Real Investor FIC FIF Acoes RL": {
    "expectedReturn": 12.17,
    "volatility": 17.02
  },
  "IP Participacoes FIC FIF Acoes RL": {
    "expectedReturn": 14.43,
    "volatility": 12.78
  },
  "Alaska Black FIF Cotas FIA": {
    "expectedReturn": -6.46,
    "volatility": 43.15
  },
  "SPX Falcon": {
    "expectedReturn": 27.14,
    "volatility": 11.28
  },
  "Wellington Ventura Advisory": {
    "expectedReturn": 21.23,
    "volatility": 12.05
  },
  "WELLINGTON VENTURA ADVISORY": {
    "expectedReturn": 21.23,
    "volatility": 12.05
  },
  "SPX Patriot FIF CIC Ações RL": {
    "expectedReturn": 20.7,
    "volatility": 16.79
  },
  "IVVB11": {
    "expectedReturn": 20.95,
    "volatility": 13.12
  },
  "NASD11": {
    "expectedReturn": 29.14,
    "volatility": 18.05
  },
  "WRLD11": {
    "expectedReturn": 18.48,
    "volatility": 12.08
  },
  "CDBI11": {
    "expectedReturn": 13.02,
    "volatility": 0.47
  },
  "DIVO11": {
    "expectedReturn": 13.9,
    "volatility": 14.81
  },
  "Legacy V10": {
    "expectedReturn": 13.05,
    "volatility": 0.47
  },
  "Velt Partners FIF Cotas FIA": {
    "expectedReturn": 11.73,
    "volatility": 16.76
  }
};

export interface RecommendedPortfolio {
  id: string;
  tier: string;
  tier_label: string;
  itype: string;
  perfil: string;
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
