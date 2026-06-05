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
    position: number; // 0 to 100
    headline: string;
    description: string;
    assets: MockAsset[];
}

const GERAL_NORMAL: MockLevel[] = [
    {
        name: "Abrigo",
        position: 0,
        headline: "Preservação antes de crescimento.",
        description: "Para proteger, organizar e manter o patrimônio com liquidez e baixa oscilação.",
        assets: [
            { asset: "Tesouro Selic / Fundo Simples", class: "Caixa / Selic", manager: "Tesouro", weight: 80, eligibility: "Geral" },
            { asset: "ARX Fuji", class: "Renda fixa", manager: "ARX", weight: 3, eligibility: "Geral" },
            { asset: "BNP Paribas Rubi", class: "Renda fixa", manager: "BNP Paribas", weight: 5, eligibility: "Geral" },
            { asset: "Ibiuna Credit", class: "Renda fixa", manager: "Ibiuna", weight: 5, eligibility: "Geral" },
            { asset: "ARX Hedge Infra", class: "Infra / IPCA+", manager: "ARX", weight: 7, eligibility: "Geral" }
        ]
    },
    {
        name: "Ritmo",
        position: 33,
        headline: "Mais retorno potencial, ainda com controle.",
        description: "Para quem já organizou a base financeira e busca avançar com equilíbrio.",
        assets: [
            { asset: "Tesouro Selic / Fundo Simples", class: "Caixa / Selic", manager: "Tesouro", weight: 50, eligibility: "Geral" },
            { asset: "ARX Fuji", class: "Renda fixa", manager: "ARX", weight: 4, eligibility: "Geral" },
            { asset: "BNP Paribas Rubi", class: "Renda fixa", manager: "BNP Paribas", weight: 8, eligibility: "Geral" },
            { asset: "Ibiuna Credit", class: "Renda fixa", manager: "Ibiuna", weight: 7, eligibility: "Geral" },
            { asset: "ARX Hedge Infra", class: "Infra / IPCA+", manager: "ARX", weight: 9, eligibility: "Geral" },
            { asset: "Atlas", class: "Multimercado", manager: "Kinea / Itaú", weight: 6, eligibility: "Geral" },
            { asset: "Dahlia Total Return", class: "Long bias", manager: "Dahlia", weight: 8, eligibility: "Geral" },
            { asset: "Hix Capital HS FIA", class: "Ações Brasil", manager: "Hix", weight: 8, eligibility: "Geral" }
        ]
    },
    {
        name: "Visão",
        position: 66,
        headline: "Diversificação e crescimento com método.",
        description: "Para quem aceita maior oscilação em busca de crescimento patrimonial no médio e longo prazo.",
        assets: [
            { asset: "Tesouro Selic / Fundo Simples", class: "Caixa / Selic", manager: "Tesouro", weight: 25, eligibility: "Geral" },
            { asset: "ARX Fuji", class: "Renda fixa", manager: "ARX", weight: 4, eligibility: "Geral" },
            { asset: "Kinea Debêntures Incentivadas", class: "Infra / IPCA+", manager: "Kinea", weight: 6, eligibility: "Geral" },
            { asset: "BNP Paribas Rubi", class: "Renda fixa", manager: "BNP Paribas", weight: 8, eligibility: "Geral" },
            { asset: "Ibiuna Credit", class: "Renda fixa", manager: "Ibiuna", weight: 7, eligibility: "Geral" },
            { asset: "ARX Hedge Infra", class: "Infra / IPCA+", manager: "ARX", weight: 9, eligibility: "Geral" },
            { asset: "Atlas", class: "Multimercado", manager: "Kinea / Itaú", weight: 6, eligibility: "Geral" },
            { asset: "Dahlia Total Return", class: "Long bias", manager: "Dahlia", weight: 9, eligibility: "Geral" },
            { asset: "Hix Capital HS FIA", class: "Ações Brasil", manager: "Hix", weight: 10, eligibility: "Geral" },
            { asset: "Corpus Ações FIC FIF", class: "Ações Brasil", manager: "Corpus", weight: 8, eligibility: "Geral" },
            { asset: "Fundo de Ações RL", class: "Ações Brasil", manager: "RL", weight: 8, eligibility: "Geral" }
        ]
    },
    {
        name: "Oceano",
        position: 100,
        headline: "Ondas maiores exigem mais horizonte.",
        description: "Para investidores com maior horizonte, maior tolerância a risco e foco em crescimento global.",
        assets: [
            { asset: "Tesouro Selic / Fundo Simples", class: "Caixa / Selic", manager: "Tesouro", weight: 15, eligibility: "Geral" },
            { asset: "ARX Fuji", class: "Renda fixa", manager: "ARX", weight: 5, eligibility: "Geral" },
            { asset: "Kinea Debêntures Incentivadas", class: "Infra / IPCA+", manager: "Kinea", weight: 7, eligibility: "Geral" },
            { asset: "BNP Paribas Rubi", class: "Renda fixa", manager: "BNP Paribas", weight: 7, eligibility: "Geral" },
            { asset: "Ibiuna Credit", class: "Renda fixa", manager: "Ibiuna", weight: 8, eligibility: "Geral" },
            { asset: "ARX Hedge Infra", class: "Infra / IPCA+", manager: "ARX", weight: 10, eligibility: "Geral" },
            { asset: "Atlas", class: "Multimercado", manager: "Kinea / Itaú", weight: 8, eligibility: "Geral" },
            { asset: "Dahlia Total Return", class: "Long bias", manager: "Dahlia", weight: 10, eligibility: "Geral" },
            { asset: "Hix Capital HS FIA", class: "Ações Brasil", manager: "Hix", weight: 10, eligibility: "Geral" },
            { asset: "Corpus Ações FIC FIF", class: "Ações Brasil", manager: "Corpus", weight: 10, eligibility: "Geral" },
            { asset: "Fundo de Ações RL", class: "Ações Brasil", manager: "RL", weight: 10, eligibility: "Geral" }
        ]
    }
];

const GERAL_LIGHT: MockLevel[] = [
    {
        name: "Abrigo Light",
        position: 0,
        headline: "Preservação antes de crescimento.",
        description: "Versão simplificada para proteger e organizar o patrimônio.",
        assets: [
            { asset: "Tesouro Selic / Fundo Simples", class: "Caixa / Selic", manager: "Tesouro", weight: 70, eligibility: "Geral" },
            { asset: "ARX Fuji", class: "Renda fixa", manager: "ARX", weight: 10, eligibility: "Geral" },
            { asset: "BNP Paribas Rubi", class: "Renda fixa", manager: "BNP Paribas", weight: 10, eligibility: "Geral" },
            { asset: "Ibiuna Credit", class: "Renda fixa", manager: "Ibiuna", weight: 10, eligibility: "Geral" },
        ]
    },
    {
        name: "Ritmo Light",
        position: 33,
        headline: "Mais retorno potencial, ainda com controle.",
        description: "Equilíbrio com estrutura mais enxuta.",
        assets: [
            { asset: "Tesouro Selic / Fundo Simples", class: "Caixa / Selic", manager: "Tesouro", weight: 50, eligibility: "Geral" },
            { asset: "ARX Fuji", class: "Renda fixa", manager: "ARX", weight: 10, eligibility: "Geral" },
            { asset: "BNP Paribas Rubi", class: "Renda fixa", manager: "BNP Paribas", weight: 10, eligibility: "Geral" },
            { asset: "Ibiuna Credit", class: "Renda fixa", manager: "Ibiuna", weight: 10, eligibility: "Geral" },
            { asset: "Atlas", class: "Multimercado", manager: "Kinea / Itaú", weight: 5, eligibility: "Geral" },
            { asset: "Dahlia Total Return", class: "Long bias", manager: "Dahlia", weight: 5, eligibility: "Geral" },
            { asset: "Hix Capital HS FIA", class: "Ações Brasil", manager: "Hix", weight: 10, eligibility: "Geral" }
        ]
    },
    {
        name: "Visão Light",
        position: 66,
        headline: "Diversificação e crescimento com método.",
        description: "Exposição ao crescimento através de ativos focados.",
        assets: [
            { asset: "Tesouro Selic / Fundo Simples", class: "Caixa / Selic", manager: "Tesouro", weight: 25, eligibility: "Geral" },
            { asset: "ARX Fuji", class: "Renda fixa", manager: "ARX", weight: 10, eligibility: "Geral" },
            { asset: "Kinea Debêntures Incentivadas", class: "Infra / IPCA+", manager: "Kinea", weight: 10, eligibility: "Geral" },
            { asset: "BNP Paribas Rubi", class: "Renda fixa", manager: "BNP Paribas", weight: 10, eligibility: "Geral" },
            { asset: "Ibiuna Credit", class: "Renda fixa", manager: "Ibiuna", weight: 10, eligibility: "Geral" },
            { asset: "Atlas", class: "Multimercado", manager: "Kinea / Itaú", weight: 8, eligibility: "Geral" },
            { asset: "Dahlia Total Return", class: "Long bias", manager: "Dahlia", weight: 7, eligibility: "Geral" },
            { asset: "Hix Capital HS FIA", class: "Ações Brasil", manager: "Hix", weight: 10, eligibility: "Geral" },
            { asset: "Fundo de Ações RL / confirmar", class: "Ações Brasil", manager: "RL", weight: 10, eligibility: "Geral" }
        ]
    },
    {
        name: "Oceano Light",
        position: 100,
        headline: "Ondas maiores exigem mais horizonte.",
        description: "Versão concentrada para máximo crescimento dentro da metodologia.",
        assets: [
            { asset: "Tesouro Selic / Fundo Simples", class: "Caixa / Selic", manager: "Tesouro", weight: 15, eligibility: "Geral" },
            { asset: "ARX Fuji", class: "Renda fixa", manager: "ARX", weight: 10, eligibility: "Geral" },
            { asset: "Kinea Debêntures Incentivadas", class: "Infra / IPCA+", manager: "Kinea", weight: 10, eligibility: "Geral" },
            { asset: "BNP Paribas Rubi", class: "Renda fixa", manager: "BNP Paribas", weight: 10, eligibility: "Geral" },
            { asset: "Ibiuna Credit", class: "Renda fixa", manager: "Ibiuna", weight: 10, eligibility: "Geral" },
            { asset: "Atlas", class: "Multimercado", manager: "Kinea / Itaú", weight: 10, eligibility: "Geral" },
            { asset: "Dahlia Total Return", class: "Long bias", manager: "Dahlia", weight: 10, eligibility: "Geral" },
            { asset: "Hix Capital HS FIA", class: "Ações Brasil", manager: "Hix", weight: 15, eligibility: "Geral" },
            { asset: "Fundo de Ações RL / confirmar", class: "Ações Brasil", manager: "RL", weight: 10, eligibility: "Geral" }
        ]
    }
];

const IQ_NORMAL: MockLevel[] = [
    {
        name: "Abrigo IQ",
        position: 0,
        headline: "Preservação com acesso exclusivo.",
        description: "Produtos restritos a Investidores Qualificados para proteção.",
        assets: [
            { asset: "Tesouro Selic / Fundo Simples", class: "Caixa / Selic", manager: "Tesouro", weight: 80, eligibility: "IQ" },
            { asset: "ARX Fuji", class: "Renda fixa", manager: "ARX", weight: 3, eligibility: "IQ" },
            { asset: "Valora Guardian A (IQ)", class: "Renda fixa", manager: "Valora", weight: 5, eligibility: "IQ" },
            { asset: "Capitânia Yield 120 (IQ)", class: "Renda fixa", manager: "Capitânia", weight: 5, eligibility: "IQ" },
            { asset: "ARX Hedge Infra", class: "Infra / IPCA+", manager: "ARX", weight: 7, eligibility: "IQ" }
        ]
    },
    {
        name: "Ritmo IQ",
        position: 33,
        headline: "Equilíbrio e alocação avançada.",
        description: "Busca por retorno extra com ativos sofisticados.",
        assets: [
            { asset: "Tesouro Selic / Fundo Simples", class: "Caixa / Selic", manager: "Tesouro", weight: 50, eligibility: "IQ" },
            { asset: "ARX Fuji", class: "Renda fixa", manager: "ARX", weight: 4, eligibility: "IQ" },
            { asset: "Valora Guardian A (IQ)", class: "Renda fixa", manager: "Valora", weight: 7, eligibility: "IQ" },
            { asset: "Capitânia Yield 120 (IQ)", class: "Renda fixa", manager: "Capitânia", weight: 6, eligibility: "IQ" },
            { asset: "ARX Hedge Infra", class: "Infra / IPCA+", manager: "ARX", weight: 9, eligibility: "IQ" },
            { asset: "JGP Ecossistema (IQ)", class: "Multimercado", manager: "JGP", weight: 6, eligibility: "IQ" },
            { asset: "Atlas", class: "Multimercado", manager: "Kinea / Itaú", weight: 4, eligibility: "IQ" },
            { asset: "Dahlia Total Return", class: "Long bias", manager: "Dahlia", weight: 5, eligibility: "IQ" },
            { asset: "Next Long Bias (IQ)", class: "Long bias", manager: "Next", weight: 5, eligibility: "IQ" },
            { asset: "SPX Falcon (IQ)", class: "Multimercado", manager: "SPX", weight: 4, eligibility: "IQ" }
        ]
    },
    {
        name: "Visão IQ",
        position: 66,
        headline: "Diversificação profunda e metodológica.",
        description: "Crescimento usando todo o espectro de investimentos.",
        assets: [
            { asset: "Tesouro Selic / Fundo Simples", class: "Caixa / Selic", manager: "Tesouro", weight: 25, eligibility: "IQ" },
            { asset: "ARX Fuji", class: "Renda fixa", manager: "ARX", weight: 4, eligibility: "IQ" },
            { asset: "Valora Guardian A (IQ)", class: "Renda fixa", manager: "Valora", weight: 10, eligibility: "IQ" },
            { asset: "90 FIF (IQ)", class: "Renda fixa", manager: "90", weight: 3, eligibility: "IQ" },
            { asset: "Capitânia Yield 120 (IQ)", class: "Renda fixa", manager: "Capitânia", weight: 6, eligibility: "IQ" },
            { asset: "ARX Hedge Infra", class: "Infra / IPCA+", manager: "ARX", weight: 9, eligibility: "IQ" },
            { asset: "JGP Ecossistema (IQ)", class: "Multimercado", manager: "JGP", weight: 5, eligibility: "IQ" },
            { asset: "Atlas", class: "Multimercado", manager: "Kinea / Itaú", weight: 6, eligibility: "IQ" },
            { asset: "Dahlia Total Return", class: "Long bias", manager: "Dahlia", weight: 6, eligibility: "IQ" },
            { asset: "Next Long Bias (IQ)", class: "Long bias", manager: "Next", weight: 5, eligibility: "IQ" },
            { asset: "Captação Frequente (IQ)", class: "Ações Brasil", manager: "Captação", weight: 6, eligibility: "IQ" },
            { asset: "Hix Capital HS FIA", class: "Ações Brasil", manager: "Hix", weight: 5, eligibility: "IQ" },
            { asset: "Fundo de Ações RL", class: "Ações Brasil", manager: "RL", weight: 5, eligibility: "IQ" },
            { asset: "SPX Falcon (IQ)", class: "Multimercado", manager: "SPX", weight: 5, eligibility: "IQ" }
        ]
    },
    {
        name: "Oceano IQ",
        position: 100,
        headline: "Crescimento sem amarras.",
        description: "O maior potencial do mercado para Investidores Qualificados.",
        assets: [
            { asset: "Tesouro Selic / Fundo Simples", class: "Caixa / Selic", manager: "Tesouro", weight: 12, eligibility: "IQ" },
            { asset: "ARX Fuji", class: "Renda fixa", manager: "ARX", weight: 4, eligibility: "IQ" },
            { asset: "Valora Guardian A (IQ)", class: "Renda fixa", manager: "Valora", weight: 10, eligibility: "IQ" },
            { asset: "90 FIF (IQ)", class: "Renda fixa", manager: "90", weight: 3, eligibility: "IQ" },
            { asset: "Capitânia Yield 120 (IQ)", class: "Renda fixa", manager: "Capitânia", weight: 6, eligibility: "IQ" },
            { asset: "ARX Hedge Infra", class: "Infra / IPCA+", manager: "ARX", weight: 9, eligibility: "IQ" },
            { asset: "JGP Ecossistema (IQ)", class: "Multimercado", manager: "JGP", weight: 8, eligibility: "IQ" },
            { asset: "Atlas", class: "Multimercado", manager: "Kinea / Itaú", weight: 4, eligibility: "IQ" },
            { asset: "Dahlia Total Return", class: "Long bias", manager: "Dahlia", weight: 6, eligibility: "IQ" },
            { asset: "Next Long Bias (IQ)", class: "Long bias", manager: "Next", weight: 7, eligibility: "IQ" },
            { asset: "Captação Frequente (IQ)", class: "Ações Brasil", manager: "Captação", weight: 10, eligibility: "IQ" },
            { asset: "Hix Capital HS FIA", class: "Ações Brasil", manager: "Hix", weight: 7, eligibility: "IQ" },
            { asset: "Fundo de Ações RL", class: "Ações Brasil", manager: "RL", weight: 7, eligibility: "IQ" },
            { asset: "SPX Falcon (IQ)", class: "Multimercado", manager: "SPX", weight: 7, eligibility: "IQ" }
        ]
    }
];

const IQ_LIGHT: MockLevel[] = [
    {
        name: "Abrigo Light IQ",
        position: 0,
        headline: "Preservação simplificada e exclusiva.",
        description: "A base da proteção com os melhores fundos do mercado.",
        assets: [
            { asset: "Tesouro Selic / Fundo Simples", class: "Caixa / Selic", manager: "Tesouro", weight: 70, eligibility: "IQ" },
            { asset: "ARX Fuji", class: "Renda fixa", manager: "ARX", weight: 10, eligibility: "IQ" },
            { asset: "Valora Guardian A (IQ)", class: "Renda fixa", manager: "Valora", weight: 10, eligibility: "IQ" },
            { asset: "ARX Hedge Infra", class: "Infra / IPCA+", manager: "ARX", weight: 10, eligibility: "IQ" }
        ]
    },
    {
        name: "Ritmo Light IQ",
        position: 33,
        headline: "Equilíbrio com estrutura enxuta (IQ).",
        description: "Exposição essencial ao risco mantendo a qualidade IQ.",
        assets: [
            { asset: "Tesouro Selic / Fundo Simples", class: "Caixa / Selic", manager: "Tesouro", weight: 50, eligibility: "IQ" },
            { asset: "ARX Fuji", class: "Renda fixa", manager: "ARX", weight: 10, eligibility: "IQ" },
            { asset: "Valora Guardian A (IQ)", class: "Renda fixa", manager: "Valora", weight: 10, eligibility: "IQ" },
            { asset: "ARX Hedge Infra", class: "Infra / IPCA+", manager: "ARX", weight: 10, eligibility: "IQ" },
            { asset: "Atlas", class: "Multimercado", manager: "Kinea / Itaú", weight: 5, eligibility: "IQ" },
            { asset: "Dahlia Total Return", class: "Long bias", manager: "Dahlia", weight: 5, eligibility: "IQ" },
            { asset: "Hix Capital HS FIA", class: "Ações Brasil", manager: "Hix", weight: 10, eligibility: "IQ" }
        ]
    },
    {
        name: "Visão Light IQ",
        position: 66,
        headline: "Diversificação direta ao ponto.",
        description: "Crescimento patrimonial concentrado nos fundos líderes.",
        assets: [
            { asset: "Tesouro Selic / Fundo Simples", class: "Caixa / Selic", manager: "Tesouro", weight: 25, eligibility: "IQ" },
            { asset: "ARX Fuji", class: "Renda fixa", manager: "ARX", weight: 10, eligibility: "IQ" },
            { asset: "Valora Guardian A (IQ)", class: "Renda fixa", manager: "Valora", weight: 10, eligibility: "IQ" },
            { asset: "ARX Hedge Infra", class: "Infra / IPCA+", manager: "ARX", weight: 10, eligibility: "IQ" },
            { asset: "Kinea Oportunidade FIF", class: "Multimercado", manager: "Kinea", weight: 10, eligibility: "IQ" },
            { asset: "Atlas", class: "Multimercado", manager: "Kinea / Itaú", weight: 10, eligibility: "IQ" },
            { asset: "Dahlia Total Return", class: "Long bias", manager: "Dahlia", weight: 10, eligibility: "IQ" },
            { asset: "Long Bias", class: "Long bias", manager: "Vários", weight: 5, eligibility: "IQ" },
            { asset: "Hix Capital HS FIA", class: "Ações Brasil", manager: "Hix", weight: 10, eligibility: "IQ" }
        ]
    },
    {
        name: "Oceano Light IQ",
        position: 100,
        headline: "Crescimento máximo, complexidade mínima.",
        description: "A essência da carteira agressiva para Investidores Qualificados.",
        assets: [
            { asset: "Tesouro Selic / Fundo Simples", class: "Caixa / Selic", manager: "Tesouro", weight: 12, eligibility: "IQ" },
            { asset: "ARX Fuji", class: "Renda fixa", manager: "ARX", weight: 10, eligibility: "IQ" },
            { asset: "Valora Guardian A (IQ)", class: "Renda fixa", manager: "Valora", weight: 10, eligibility: "IQ" },
            { asset: "ARX Hedge Infra", class: "Infra / IPCA+", manager: "ARX", weight: 10, eligibility: "IQ" },
            { asset: "Kinea Oportunidade FIF", class: "Multimercado", manager: "Kinea", weight: 10, eligibility: "IQ" },
            { asset: "Atlas", class: "Multimercado", manager: "Kinea / Itaú", weight: 10, eligibility: "IQ" },
            { asset: "Dahlia Total Return", class: "Long bias", manager: "Dahlia", weight: 10, eligibility: "IQ" },
            { asset: "Long Bias", class: "Long bias", manager: "Vários", weight: 8, eligibility: "IQ" },
            { asset: "Hix Capital HS FIA", class: "Ações Brasil", manager: "Hix", weight: 10, eligibility: "IQ" },
            { asset: "Fundo de Ações RL / confirmar", class: "Ações Brasil", manager: "RL", weight: 10, eligibility: "IQ" }
        ]
    }
];

export const PORTFOLIO_LINES: Record<string, MockLevel[]> = {
    "Geral Normal": GERAL_NORMAL,
    "Geral Light": GERAL_LIGHT,
    "IQ Normal": IQ_NORMAL,
    "IQ Light": IQ_LIGHT
};

export const ASSET_METRICS: Record<string, { expectedReturn: number, volatility: number }> = {
    // Caixa / Selic (Baixíssimo Risco)
    "Tesouro Selic / Fundo Simples": { expectedReturn: 10.5, volatility: 0.5 },
    
    // Renda fixa (Baixo Risco)
    "ARX Fuji": { expectedReturn: 11.5, volatility: 1.2 },
    "BNP Paribas Rubi": { expectedReturn: 12.0, volatility: 1.5 },
    "Ibiuna Credit": { expectedReturn: 12.5, volatility: 1.8 },
    "Valora Guardian A (IQ)": { expectedReturn: 13.0, volatility: 2.0 },
    "Capitânia Yield 120 (IQ)": { expectedReturn: 13.5, volatility: 2.5 },
    "90 FIF (IQ)": { expectedReturn: 14.0, volatility: 3.0 },
    
    // Infra / IPCA+ (Médio/Baixo Risco)
    "ARX Hedge Infra": { expectedReturn: 11.5, volatility: 3.5 },
    "Kinea Debêntures Incentivadas": { expectedReturn: 11.0, volatility: 3.0 },
    
    // Multimercado (Médio Risco)
    "Atlas": { expectedReturn: 13.0, volatility: 5.5 },
    "JGP Ecossistema (IQ)": { expectedReturn: 14.5, volatility: 6.5 },
    "SPX Falcon (IQ)": { expectedReturn: 15.0, volatility: 7.0 },
    "Kinea Oportunidade FIF": { expectedReturn: 13.5, volatility: 5.0 },
    
    // Long Bias (Médio/Alto Risco)
    "Dahlia Total Return": { expectedReturn: 15.5, volatility: 10.0 },
    "Next Long Bias (IQ)": { expectedReturn: 16.0, volatility: 11.0 },
    "Long Bias": { expectedReturn: 15.0, volatility: 10.5 },
    
    // Ações Brasil (Alto Risco)
    "Hix Capital HS FIA": { expectedReturn: 18.0, volatility: 18.0 },
    "Corpus Ações FIC FIF": { expectedReturn: 17.5, volatility: 17.0 },
    "Fundo de Ações RL": { expectedReturn: 17.0, volatility: 16.5 },
    "Fundo de Ações RL / confirmar": { expectedReturn: 17.0, volatility: 16.5 },
    "Captação Frequente (IQ)": { expectedReturn: 18.5, volatility: 19.0 }
};
