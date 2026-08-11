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

export const GERAL_NORMAL: MockLevel[] = [
    {
        "name": "Abrigo",
        "position": 0,
        "headline": "Preservação antes de crescimento.",
        "description": "Para proteger, organizar e manter o patrimônio com liquidez e baixa oscilação.",
        "assets": [
            {
                "asset": "Tesouro Selic / Fundo Simples (Todas)",
                "class": "Caixa / Selic",
                "manager": "Tesouro",
                "weight": 80,
                "eligibility": "Geral"
            },
            {
                "asset": "ARX Fuji (XP, BTG, Safra)",
                "class": "Renda fixa",
                "manager": "ARX",
                "weight": 3,
                "eligibility": "Geral"
            },
            {
                "asset": "BNP Paribas Rubi (XP, BTG, Safra)",
                "class": "Renda fixa",
                "manager": "BNP",
                "weight": 5,
                "eligibility": "Geral"
            },
            {
                "asset": "Ibiuna Credit (XP, BTG, Safra, Inter)",
                "class": "Renda fixa",
                "manager": "Ibiuna",
                "weight": 5,
                "eligibility": "Geral"
            },
            {
                "asset": "ARX Hedge Infra (XP, BTG, Safra, Inter)",
                "class": "Infra / IPCA+",
                "manager": "ARX",
                "weight": 7,
                "eligibility": "Geral"
            }
        ]
    },
    {
        "name": "Ritmo",
        "position": 33,
        "headline": "Mais retorno potencial, ainda com controle.",
        "description": "Para quem já organizou a base financeira e busca avançar com equilíbrio.",
        "assets": [
            {
                "asset": "Tesouro Selic / Fundo Simples (Todas)",
                "class": "Caixa / Selic",
                "manager": "Tesouro",
                "weight": 50,
                "eligibility": "Geral"
            },
            {
                "asset": "ARX Fuji (XP, BTG, Safra)",
                "class": "Renda fixa",
                "manager": "ARX",
                "weight": 4,
                "eligibility": "Geral"
            },
            {
                "asset": "BNP Paribas Rubi (XP, BTG, Safra)",
                "class": "Renda fixa",
                "manager": "BNP",
                "weight": 8,
                "eligibility": "Geral"
            },
            {
                "asset": "Ibiuna Credit (XP, BTG, Safra, Inter)",
                "class": "Renda fixa",
                "manager": "Ibiuna",
                "weight": 7,
                "eligibility": "Geral"
            },
            {
                "asset": "ARX Hedge Infra (XP, BTG, Safra, Inter)",
                "class": "Infra / IPCA+",
                "manager": "ARX",
                "weight": 9,
                "eligibility": "Geral"
            },
            {
                "asset": "Kinea Atlas (Itaú/Íon, XP, BTG, Inter, Santander, Warren)",
                "class": "Multimercado",
                "manager": "Kinea",
                "weight": 6,
                "eligibility": "Geral"
            },
            {
                "asset": "Dahlia Total Return (XP, BTG, Genial, Inter)",
                "class": "Long bias",
                "manager": "Dahlia",
                "weight": 8,
                "eligibility": "Geral"
            },
            {
                "asset": "Hix Capital HS FIA (XP, BTG)",
                "class": "Ações Brasil",
                "manager": "Hix",
                "weight": 8,
                "eligibility": "Geral"
            }
        ]
    },
    {
        "name": "Visão",
        "position": 66,
        "headline": "Diversificação e crescimento com método.",
        "description": "Para quem aceita maior oscilação em busca de crescimento patrimonial no médio e longo prazo.",
        "assets": [
            {
                "asset": "Tesouro Selic / Fundo Simples (Todas)",
                "class": "Caixa / Selic",
                "manager": "Tesouro",
                "weight": 25,
                "eligibility": "Geral"
            },
            {
                "asset": "ARX Fuji (XP, BTG, Safra)",
                "class": "Renda fixa",
                "manager": "ARX",
                "weight": 4,
                "eligibility": "Geral"
            },
            {
                "asset": "Sparta/Kinea Deb Incentivadas (XP, BTG, Itaú/Íon, Safra)",
                "class": "Renda fixa",
                "manager": "Sparta/Kinea",
                "weight": 6,
                "eligibility": "Geral"
            },
            {
                "asset": "BNP Paribas Rubi (XP, BTG, Safra)",
                "class": "Renda fixa",
                "manager": "BNP",
                "weight": 8,
                "eligibility": "Geral"
            },
            {
                "asset": "Ibiuna Credit (XP, BTG, Safra, Inter)",
                "class": "Renda fixa",
                "manager": "Ibiuna",
                "weight": 7,
                "eligibility": "Geral"
            },
            {
                "asset": "ARX Hedge Infra (XP, BTG, Safra, Inter)",
                "class": "Infra / IPCA+",
                "manager": "ARX",
                "weight": 9,
                "eligibility": "Geral"
            },
            {
                "asset": "Kinea Atlas (Itaú/Íon, XP, BTG, Inter, Santander, Warren)",
                "class": "Multimercado",
                "manager": "Kinea",
                "weight": 6,
                "eligibility": "Geral"
            },
            {
                "asset": "Dahlia Total Return (XP, BTG, Genial, Inter)",
                "class": "Long bias",
                "manager": "Dahlia",
                "weight": 9,
                "eligibility": "Geral"
            },
            {
                "asset": "Hix Capital HS FIA (XP, BTG)",
                "class": "Ações Brasil",
                "manager": "Hix",
                "weight": 10,
                "eligibility": "Geral"
            },
            {
                "asset": "Forpus Ações FIC FIF Ações RL (XP, BTG, Genial)",
                "class": "Ações Brasil",
                "manager": "Forpus",
                "weight": 8,
                "eligibility": "Geral"
            },
            {
                "asset": "Real Investor FIC FIF Ações RL (XP, BTG, Icatu — tem versões para investidor geral e qualificado)",
                "class": "Ações Brasil",
                "manager": "Real",
                "weight": 8,
                "eligibility": "Geral"
            }
        ]
    },
    {
        "name": "Oceano",
        "position": 100,
        "headline": "Ondas maiores exigem mais horizonte.",
        "description": "Para investidores com maior horizonte, maior tolerância a risco e foco em crescimento global.",
        "assets": [
            {
                "asset": "Tesouro Selic / Fundo Simples (Todas)",
                "class": "Caixa / Selic",
                "manager": "Tesouro",
                "weight": 15,
                "eligibility": "Geral"
            },
            {
                "asset": "ARX Fuji (XP, BTG, Safra)",
                "class": "Renda fixa",
                "manager": "ARX",
                "weight": 5,
                "eligibility": "Geral"
            },
            {
                "asset": "Sparta/Kinea Deb Incentivadas (XP, BTG, Itaú/Íon, Safra)",
                "class": "Renda fixa",
                "manager": "Sparta/Kinea",
                "weight": 7,
                "eligibility": "Geral"
            },
            {
                "asset": "BNP Paribas Rubi (XP, BTG, Safra)",
                "class": "Renda fixa",
                "manager": "BNP",
                "weight": 7,
                "eligibility": "Geral"
            },
            {
                "asset": "Ibiuna Credit (XP, BTG, Safra, Inter)",
                "class": "Renda fixa",
                "manager": "Ibiuna",
                "weight": 8,
                "eligibility": "Geral"
            },
            {
                "asset": "ARX Hedge Infra (XP, BTG, Safra, Inter)",
                "class": "Infra / IPCA+",
                "manager": "ARX",
                "weight": 10,
                "eligibility": "Geral"
            },
            {
                "asset": "Kinea Atlas (Itaú/Íon, XP, BTG, Inter, Santander, Warren)",
                "class": "Multimercado",
                "manager": "Kinea",
                "weight": 8,
                "eligibility": "Geral"
            },
            {
                "asset": "Dahlia Total Return (XP, BTG, Genial, Inter)",
                "class": "Long bias",
                "manager": "Dahlia",
                "weight": 10,
                "eligibility": "Geral"
            },
            {
                "asset": "Hix Capital HS FIA (XP, BTG)",
                "class": "Ações Brasil",
                "manager": "Hix",
                "weight": 10,
                "eligibility": "Geral"
            },
            {
                "asset": "Forpus Ações FIC FIF Ações RL (XP, BTG, Genial)",
                "class": "Ações Brasil",
                "manager": "Forpus",
                "weight": 10,
                "eligibility": "Geral"
            },
            {
                "asset": "Real Investor FIC FIF Ações RL (XP, BTG, Icatu — tem versões para investidor geral e qualificado)",
                "class": "Ações Brasil",
                "manager": "Real",
                "weight": 10,
                "eligibility": "Geral"
            }
        ]
    }
];

export const GERAL_LIGHT: MockLevel[] = [
    {
        "name": "Abrigo Light",
        "position": 0,
        "headline": "Preservação antes de crescimento.",
        "description": "Versão simplificada para proteger e organizar o patrimônio.",
        "assets": [
            {
                "asset": "Tesouro Selic / Fundo Simples",
                "class": "Caixa / Selic",
                "manager": "Tesouro",
                "weight": 70,
                "eligibility": "Geral"
            },
            {
                "asset": "ARX Fuji",
                "class": "Renda fixa",
                "manager": "ARX",
                "weight": 10,
                "eligibility": "Geral"
            },
            {
                "asset": "BNP Paribas Rubi",
                "class": "Renda fixa",
                "manager": "BNP",
                "weight": 10,
                "eligibility": "Geral"
            },
            {
                "asset": "Ibiuna Credit",
                "class": "Renda fixa",
                "manager": "Ibiuna",
                "weight": 10,
                "eligibility": "Geral"
            }
        ]
    },
    {
        "name": "Ritmo Light",
        "position": 33,
        "headline": "Mais retorno potencial, ainda com controle.",
        "description": "Equilíbrio com estrutura mais enxuta.",
        "assets": [
            {
                "asset": "Tesouro Selic / Fundo Simples",
                "class": "Caixa / Selic",
                "manager": "Tesouro",
                "weight": 50,
                "eligibility": "Geral"
            },
            {
                "asset": "ARX Fuji",
                "class": "Renda fixa",
                "manager": "ARX",
                "weight": 10,
                "eligibility": "Geral"
            },
            {
                "asset": "BNP Paribas Rubi",
                "class": "Renda fixa",
                "manager": "BNP",
                "weight": 10,
                "eligibility": "Geral"
            },
            {
                "asset": "Ibiuna Credit",
                "class": "Renda fixa",
                "manager": "Ibiuna",
                "weight": 10,
                "eligibility": "Geral"
            },
            {
                "asset": "Atlas",
                "class": "Multimercado",
                "manager": "Atlas",
                "weight": 5,
                "eligibility": "Geral"
            },
            {
                "asset": "Dahlia Total Return",
                "class": "Long bias",
                "manager": "Dahlia",
                "weight": 5,
                "eligibility": "Geral"
            },
            {
                "asset": "Hix Capital HS FIA",
                "class": "Ações Brasil",
                "manager": "Hix",
                "weight": 10,
                "eligibility": "Geral"
            }
        ]
    },
    {
        "name": "Visão Light",
        "position": 66,
        "headline": "Diversificação e crescimento com método.",
        "description": "Exposição ao crescimento através de ativos focados.",
        "assets": [
            {
                "asset": "Tesouro Selic / Fundo Simples",
                "class": "Caixa / Selic",
                "manager": "Tesouro",
                "weight": 25,
                "eligibility": "Geral"
            },
            {
                "asset": "ARX Fuji",
                "class": "Renda fixa",
                "manager": "ARX",
                "weight": 10,
                "eligibility": "Geral"
            },
            {
                "asset": "Kinea Debêntures Incentivadas",
                "class": "Renda fixa",
                "manager": "Kinea",
                "weight": 10,
                "eligibility": "Geral"
            },
            {
                "asset": "BNP Paribas Rubi",
                "class": "Renda fixa",
                "manager": "BNP",
                "weight": 10,
                "eligibility": "Geral"
            },
            {
                "asset": "Ibiuna Credit",
                "class": "Renda fixa",
                "manager": "Ibiuna",
                "weight": 10,
                "eligibility": "Geral"
            },
            {
                "asset": "Atlas",
                "class": "Multimercado",
                "manager": "Atlas",
                "weight": 8,
                "eligibility": "Geral"
            },
            {
                "asset": "Dahlia Total Return",
                "class": "Long bias",
                "manager": "Dahlia",
                "weight": 7,
                "eligibility": "Geral"
            },
            {
                "asset": "Hix Capital HS FIA",
                "class": "Ações Brasil",
                "manager": "Hix",
                "weight": 10,
                "eligibility": "Geral"
            },
            {
                "asset": "Fundo de Ações RL / confirmar nome",
                "class": "Ações Brasil",
                "manager": "Fundo",
                "weight": 10,
                "eligibility": "Geral"
            }
        ]
    },
    {
        "name": "Oceano Light",
        "position": 100,
        "headline": "Ondas maiores exigem mais horizonte.",
        "description": "Versão concentrada para máximo crescimento dentro da metodologia.",
        "assets": [
            {
                "asset": "Tesouro Selic / Fundo Simples",
                "class": "Caixa / Selic",
                "manager": "Tesouro",
                "weight": 15,
                "eligibility": "Geral"
            },
            {
                "asset": "ARX Fuji",
                "class": "Renda fixa",
                "manager": "ARX",
                "weight": 10,
                "eligibility": "Geral"
            },
            {
                "asset": "Kinea Debêntures Incentivadas",
                "class": "Renda fixa",
                "manager": "Kinea",
                "weight": 10,
                "eligibility": "Geral"
            },
            {
                "asset": "BNP Paribas Rubi",
                "class": "Renda fixa",
                "manager": "BNP",
                "weight": 10,
                "eligibility": "Geral"
            },
            {
                "asset": "Ibiuna Credit",
                "class": "Renda fixa",
                "manager": "Ibiuna",
                "weight": 10,
                "eligibility": "Geral"
            },
            {
                "asset": "Atlas",
                "class": "Multimercado",
                "manager": "Atlas",
                "weight": 10,
                "eligibility": "Geral"
            },
            {
                "asset": "Dahlia Total Return",
                "class": "Long bias",
                "manager": "Dahlia",
                "weight": 10,
                "eligibility": "Geral"
            },
            {
                "asset": "Hix Capital HS FIA",
                "class": "Ações Brasil",
                "manager": "Hix",
                "weight": 15,
                "eligibility": "Geral"
            },
            {
                "asset": "Fundo de Ações RL / confirmar nome",
                "class": "Ações Brasil",
                "manager": "Fundo",
                "weight": 10,
                "eligibility": "Geral"
            }
        ]
    }
];

export const IQ_NORMAL: MockLevel[] = [
    {
        "name": "Abrigo IQ",
        "position": 0,
        "headline": "Preservação com acesso exclusivo.",
        "description": "Produtos restritos a Investidores Qualificados para proteção.",
        "assets": [
            {
                "asset": "Tesouro Selic / Fundo Simples (Todas)",
                "class": "Caixa / Selic",
                "manager": "Tesouro",
                "weight": 80,
                "eligibility": "IQ"
            },
            {
                "asset": "ARX Fuji (XP, BTG, Safra)",
                "class": "Renda fixa",
                "manager": "ARX",
                "weight": 3,
                "eligibility": "IQ"
            },
            {
                "asset": "Valora Guardian A (XP, BTG, Órama) (IQ)",
                "class": "Renda fixa",
                "manager": "Valora",
                "weight": 5,
                "eligibility": "IQ"
            },
            {
                "asset": "Capitânia Yield 120 (XP, BTG, Safra) (IQ)",
                "class": "Renda fixa",
                "manager": "Capitânia",
                "weight": 5,
                "eligibility": "IQ"
            },
            {
                "asset": "ARX Hedge Infra (XP, BTG, Safra, Inter)",
                "class": "Infra / IPCA+",
                "manager": "ARX",
                "weight": 7,
                "eligibility": "IQ"
            }
        ]
    },
    {
        "name": "Ritmo IQ",
        "position": 33,
        "headline": "Equilíbrio e alocação avançada.",
        "description": "Busca por retorno extra com ativos sofisticados.",
        "assets": [
            {
                "asset": "Tesouro Selic / Fundo Simples (Todas)",
                "class": "Caixa / Selic",
                "manager": "Tesouro",
                "weight": 50,
                "eligibility": "IQ"
            },
            {
                "asset": "ARX Fuji (XP, BTG, Safra)",
                "class": "Renda fixa",
                "manager": "ARX",
                "weight": 4,
                "eligibility": "IQ"
            },
            {
                "asset": "Valora Guardian A (XP, BTG, Órama) (IQ)",
                "class": "Renda fixa",
                "manager": "Valora",
                "weight": 7,
                "eligibility": "IQ"
            },
            {
                "asset": "Capitânia Yield 120 (XP, BTG, Safra) (IQ)",
                "class": "Renda fixa",
                "manager": "Capitânia",
                "weight": 6,
                "eligibility": "IQ"
            },
            {
                "asset": "ARX Hedge Infra (XP, BTG, Safra, Inter)",
                "class": "Infra / IPCA+",
                "manager": "ARX",
                "weight": 9,
                "eligibility": "IQ"
            },
            {
                "asset": "JGP Ecossistema (XP, BTG, Safra, Genial) (IQ)",
                "class": "Multimercado",
                "manager": "JGP",
                "weight": 6,
                "eligibility": "IQ"
            },
            {
                "asset": "Kinea Atlas (Itaú/Íon, XP, BTG, Inter, Santander, Warren)",
                "class": "Multimercado",
                "manager": "Kinea",
                "weight": 4,
                "eligibility": "IQ"
            },
            {
                "asset": "Dahlia Total Return (XP, BTG, Genial, Inter)",
                "class": "Long bias",
                "manager": "Dahlia",
                "weight": 5,
                "eligibility": "IQ"
            },
            {
                "asset": "Truxt Long Bias (XP, BTG, Vitreo, Guide, Safra) (IQ)",
                "class": "Long bias",
                "manager": "Truxt",
                "weight": 5,
                "eligibility": "IQ"
            },
            {
                "asset": "SPX Falcon (XP, BTG, Safra, Itaú, Inter) (IQ)",
                "class": "Multimercado",
                "manager": "SPX",
                "weight": 4,
                "eligibility": "IQ"
            }
        ]
    },
    {
        "name": "Visão IQ",
        "position": 66,
        "headline": "Diversificação profunda e metodológica.",
        "description": "Crescimento usando todo o espectro de investimentos.",
        "assets": [
            {
                "asset": "Tesouro Selic / Fundo Simples (Todas)",
                "class": "Caixa / Selic",
                "manager": "Tesouro",
                "weight": 25,
                "eligibility": "IQ"
            },
            {
                "asset": "ARX Fuji (XP, BTG, Safra)",
                "class": "Renda fixa",
                "manager": "ARX",
                "weight": 4,
                "eligibility": "IQ"
            },
            {
                "asset": "Valora Guardian A (XP, BTG, Órama) (IQ)",
                "class": "Renda fixa",
                "manager": "Valora",
                "weight": 10,
                "eligibility": "IQ"
            },
            {
                "asset": "Augme 180 FIF (XP, BTG, Genial, Warren, Órama, Inter, Safra) (IQ)",
                "class": "Renda fixa",
                "manager": "Augme",
                "weight": 3,
                "eligibility": "IQ"
            },
            {
                "asset": "Capitânia Yield 120 (XP, BTG, Safra) (IQ)",
                "class": "Renda fixa",
                "manager": "Capitânia",
                "weight": 6,
                "eligibility": "IQ"
            },
            {
                "asset": "ARX Hedge Infra (XP, BTG, Safra, Inter)",
                "class": "Infra / IPCA+",
                "manager": "ARX",
                "weight": 9,
                "eligibility": "IQ"
            },
            {
                "asset": "JGP Ecossistema (XP, BTG, Safra, Genial) (IQ)",
                "class": "Multimercado",
                "manager": "JGP",
                "weight": 5,
                "eligibility": "IQ"
            },
            {
                "asset": "Kinea Atlas (Itaú/Íon, XP, BTG, Inter, Santander, Warren)",
                "class": "Multimercado",
                "manager": "Kinea",
                "weight": 6,
                "eligibility": "IQ"
            },
            {
                "asset": "Dahlia Total Return (XP, BTG, Genial, Inter)",
                "class": "Long bias",
                "manager": "Dahlia",
                "weight": 6,
                "eligibility": "IQ"
            },
            {
                "asset": "Truxt Long Bias (XP, BTG, Vitreo, Guide, Safra) (IQ)",
                "class": "Long bias",
                "manager": "Truxt",
                "weight": 5,
                "eligibility": "IQ"
            },
            {
                "asset": "Dynamo Cougar (XP, BTG, Vitreo, Guide — captação frequentemente encerrada) (IQ)",
                "class": "Ações Brasil",
                "manager": "Dynamo",
                "weight": 6,
                "eligibility": "IQ"
            },
            {
                "asset": "Hix Capital HS FIA (XP, BTG)",
                "class": "Ações Brasil",
                "manager": "Hix",
                "weight": 5,
                "eligibility": "IQ"
            },
            {
                "asset": "Real Investor FIC FIF Ações RL (XP, BTG, Icatu — tem versões para investidor geral e qualificado)",
                "class": "Ações Brasil",
                "manager": "Real",
                "weight": 5,
                "eligibility": "IQ"
            },
            {
                "asset": "SPX Falcon (XP, BTG, Safra, Itaú, Inter) (IQ)",
                "class": "Multimercado",
                "manager": "SPX",
                "weight": 5,
                "eligibility": "IQ"
            }
        ]
    },
    {
        "name": "Oceano IQ",
        "position": 100,
        "headline": "Crescimento sem amarras.",
        "description": "O maior potencial do mercado para Investidores Qualificados.",
        "assets": [
            {
                "asset": "Tesouro Selic / Fundo Simples (Todas)",
                "class": "Caixa / Selic",
                "manager": "Tesouro",
                "weight": 12,
                "eligibility": "IQ"
            },
            {
                "asset": "ARX Fuji (XP, BTG, Safra)",
                "class": "Renda fixa",
                "manager": "ARX",
                "weight": 4,
                "eligibility": "IQ"
            },
            {
                "asset": "Valora Guardian A (XP, BTG, Órama) (IQ)",
                "class": "Renda fixa",
                "manager": "Valora",
                "weight": 10,
                "eligibility": "IQ"
            },
            {
                "asset": "Augme 180 FIF (XP, BTG, Genial, Warren, Órama, Inter, Safra) (IQ)",
                "class": "Renda fixa",
                "manager": "Augme",
                "weight": 3,
                "eligibility": "IQ"
            },
            {
                "asset": "Capitânia Yield 120 (XP, BTG, Safra) (IQ)",
                "class": "Renda fixa",
                "manager": "Capitânia",
                "weight": 6,
                "eligibility": "IQ"
            },
            {
                "asset": "ARX Hedge Infra (XP, BTG, Safra, Inter)",
                "class": "Infra / IPCA+",
                "manager": "ARX",
                "weight": 9,
                "eligibility": "IQ"
            },
            {
                "asset": "JGP Ecossistema (XP, BTG, Safra, Genial) (IQ)",
                "class": "Multimercado",
                "manager": "JGP",
                "weight": 8,
                "eligibility": "IQ"
            },
            {
                "asset": "Kinea Atlas (Itaú/Íon, XP, BTG, Inter, Santander, Warren)",
                "class": "Multimercado",
                "manager": "Kinea",
                "weight": 4,
                "eligibility": "IQ"
            },
            {
                "asset": "Dahlia Total Return (XP, BTG, Genial, Inter)",
                "class": "Long bias",
                "manager": "Dahlia",
                "weight": 6,
                "eligibility": "IQ"
            },
            {
                "asset": "Truxt Long Bias (XP, BTG, Vitreo, Guide, Safra) (IQ)",
                "class": "Long bias",
                "manager": "Truxt",
                "weight": 7,
                "eligibility": "IQ"
            },
            {
                "asset": "Dynamo Cougar (XP, BTG, Vitreo, Guide — captação frequentemente encerrada) (IQ)",
                "class": "Ações Brasil",
                "manager": "Dynamo",
                "weight": 10,
                "eligibility": "IQ"
            },
            {
                "asset": "Hix Capital HS FIA (XP, BTG)",
                "class": "Ações Brasil",
                "manager": "Hix",
                "weight": 7,
                "eligibility": "IQ"
            },
            {
                "asset": "Real Investor FIC FIF Ações RL (XP, BTG, Icatu — tem versões para investidor geral e qualificado)",
                "class": "Ações Brasil",
                "manager": "Real",
                "weight": 7,
                "eligibility": "IQ"
            },
            {
                "asset": "SPX Falcon (XP, BTG, Safra, Itaú, Inter) (IQ)",
                "class": "Multimercado",
                "manager": "SPX",
                "weight": 7,
                "eligibility": "IQ"
            }
        ]
    }
];

export const IQ_LIGHT: MockLevel[] = [
    {
        "name": "Abrigo Light IQ",
        "position": 0,
        "headline": "Preservação simplificada e exclusiva.",
        "description": "A base da proteção com os melhores fundos do mercado.",
        "assets": [
            {
                "asset": "Tesouro Selic / Fundo Simples",
                "class": "Caixa / Selic",
                "manager": "Tesouro",
                "weight": 70,
                "eligibility": "IQ"
            },
            {
                "asset": "ARX Fuji",
                "class": "Renda fixa",
                "manager": "ARX",
                "weight": 10,
                "eligibility": "IQ"
            },
            {
                "asset": "Valora Guardian A",
                "class": "Renda fixa",
                "manager": "Valora",
                "weight": 10,
                "eligibility": "IQ"
            },
            {
                "asset": "ARX Hedge Infra",
                "class": "Infra / IPCA+",
                "manager": "ARX",
                "weight": 10,
                "eligibility": "IQ"
            }
        ]
    },
    {
        "name": "Ritmo Light IQ",
        "position": 33,
        "headline": "Equilíbrio com estrutura enxuta (IQ).",
        "description": "Exposição essencial ao risco mantendo a qualidade IQ.",
        "assets": [
            {
                "asset": "Tesouro Selic / Fundo Simples",
                "class": "Caixa / Selic",
                "manager": "Tesouro",
                "weight": 50,
                "eligibility": "IQ"
            },
            {
                "asset": "ARX Fuji",
                "class": "Renda fixa",
                "manager": "ARX",
                "weight": 10,
                "eligibility": "IQ"
            },
            {
                "asset": "Valora Guardian A",
                "class": "Renda fixa",
                "manager": "Valora",
                "weight": 10,
                "eligibility": "IQ"
            },
            {
                "asset": "ARX Hedge Infra",
                "class": "Infra / IPCA+",
                "manager": "ARX",
                "weight": 10,
                "eligibility": "IQ"
            },
            {
                "asset": "Atlas",
                "class": "Multimercado",
                "manager": "Atlas",
                "weight": 5,
                "eligibility": "IQ"
            },
            {
                "asset": "Dahlia Total Return",
                "class": "Long bias",
                "manager": "Dahlia",
                "weight": 5,
                "eligibility": "IQ"
            },
            {
                "asset": "Hix Capital HS FIA",
                "class": "Ações Brasil",
                "manager": "Hix",
                "weight": 10,
                "eligibility": "IQ"
            }
        ]
    },
    {
        "name": "Visão Light IQ",
        "position": 66,
        "headline": "Diversificação direta ao ponto.",
        "description": "Crescimento patrimonial concentrado nos fundos líderes.",
        "assets": [
            {
                "asset": "Tesouro Selic / Fundo Simples",
                "class": "Caixa / Selic",
                "manager": "Tesouro",
                "weight": 25,
                "eligibility": "IQ"
            },
            {
                "asset": "ARX Fuji",
                "class": "Renda fixa",
                "manager": "ARX",
                "weight": 10,
                "eligibility": "IQ"
            },
            {
                "asset": "Valora Guardian A",
                "class": "Renda fixa",
                "manager": "Valora",
                "weight": 10,
                "eligibility": "IQ"
            },
            {
                "asset": "ARX Hedge Infra",
                "class": "Infra / IPCA+",
                "manager": "ARX",
                "weight": 10,
                "eligibility": "IQ"
            },
            {
                "asset": "Kinea Oportunidade FIF",
                "class": "Multimercado",
                "manager": "Kinea",
                "weight": 10,
                "eligibility": "IQ"
            },
            {
                "asset": "Atlas",
                "class": "Multimercado",
                "manager": "Atlas",
                "weight": 10,
                "eligibility": "IQ"
            },
            {
                "asset": "Dahlia Total Return",
                "class": "Long bias",
                "manager": "Dahlia",
                "weight": 10,
                "eligibility": "IQ"
            },
            {
                "asset": "Long Bias",
                "class": "Long bias",
                "manager": "Long",
                "weight": 5,
                "eligibility": "IQ"
            },
            {
                "asset": "Hix Capital HS FIA",
                "class": "Ações Brasil",
                "manager": "Hix",
                "weight": 10,
                "eligibility": "IQ"
            }
        ]
    },
    {
        "name": "Oceano Light IQ",
        "position": 100,
        "headline": "Crescimento máximo, complexidade mínima.",
        "description": "A essência da carteira agressiva para Investidores Qualificados.",
        "assets": [
            {
                "asset": "Tesouro Selic / Fundo Simples",
                "class": "Caixa / Selic",
                "manager": "Tesouro",
                "weight": 12,
                "eligibility": "IQ"
            },
            {
                "asset": "ARX Fuji",
                "class": "Renda fixa",
                "manager": "ARX",
                "weight": 10,
                "eligibility": "IQ"
            },
            {
                "asset": "Valora Guardian A",
                "class": "Renda fixa",
                "manager": "Valora",
                "weight": 10,
                "eligibility": "IQ"
            },
            {
                "asset": "ARX Hedge Infra",
                "class": "Infra / IPCA+",
                "manager": "ARX",
                "weight": 10,
                "eligibility": "IQ"
            },
            {
                "asset": "Kinea Oportunidade FIF",
                "class": "Multimercado",
                "manager": "Kinea",
                "weight": 10,
                "eligibility": "IQ"
            },
            {
                "asset": "Atlas",
                "class": "Multimercado",
                "manager": "Atlas",
                "weight": 10,
                "eligibility": "IQ"
            },
            {
                "asset": "Dahlia Total Return",
                "class": "Long bias",
                "manager": "Dahlia",
                "weight": 10,
                "eligibility": "IQ"
            },
            {
                "asset": "Long Bias",
                "class": "Long bias",
                "manager": "Long",
                "weight": 8,
                "eligibility": "IQ"
            },
            {
                "asset": "Hix Capital HS FIA",
                "class": "Ações Brasil",
                "manager": "Hix",
                "weight": 10,
                "eligibility": "IQ"
            },
            {
                "asset": "Fundo de Ações RL / confirmar nome",
                "class": "Ações Brasil",
                "manager": "Fundo",
                "weight": 10,
                "eligibility": "IQ"
            }
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
    "CDI": {
        "expectedReturn": 13.92,
        "volatility": 5
    },
    "IPCA": {
        "expectedReturn": 4.2,
        "volatility": 5
    },
    "SELIC": {
        "expectedReturn": 13.92,
        "volatility": 5
    },
    "IBOV": {
        "expectedReturn": 34.08,
        "volatility": 5
    },
    "Dolar": {
        "expectedReturn": -12.12,
        "volatility": 5
    },
    "Tesouro Selic / Fundo Simples (Todas)": {
        "expectedReturn": 13.92,
        "volatility": 5
    },
    "ARX Fuji (XP, BTG, Safra)": {
        "expectedReturn": 14.28,
        "volatility": 5
    },
    "Valora Guardian A (XP, BTG, Órama) (IQ)": {
        "expectedReturn": 15.12,
        "volatility": 5
    },
    "Valora Guardian B (XP, BTG) (IQ)": {
        "expectedReturn": 14.28,
        "volatility": 5
    },
    "Valora Guardian II (XP, BTG, Órama) (IQ)": {
        "expectedReturn": 15.12,
        "volatility": 5
    },
    "Sparta Deb Inc FIC Incentivados (XP, BTG, Itaú/Íon, Safra)": {
        "expectedReturn": 12.48,
        "volatility": 5
    },
    "JGP Corporate FIC FIF RF CP LP RL (XP, BTG, Safra)": {
        "expectedReturn": 12.96,
        "volatility": 5
    },
    "SPX Seahawk Crédito Privado FIC FIRF CP LP (XP, BTG)": {
        "expectedReturn": 12,
        "volatility": 5
    },
    "Kinea Oportunidade FIM (Itaú/Íon, Bradesco, XP, BTG) (IQ)": {
        "expectedReturn": 13.68,
        "volatility": 5
    },
    "BNP Paribas Rubi (XP, BTG, Safra)": {
        "expectedReturn": 13.92,
        "volatility": 5
    },
    "MAPFRE RF FIF (XP, BTG, MAPFRE direto)": {
        "expectedReturn": 13.68,
        "volatility": 5
    },
    "Augme 30 CIC (XP, BTG, Genial, Warren, Órama, Inter, Safra)": {
        "expectedReturn": 13.08,
        "volatility": 5
    },
    "Augme 180 FIF (XP, BTG, Genial, Warren, Órama, Inter, Safra) (IQ)": {
        "expectedReturn": 13.68,
        "volatility": 5
    },
    "Capitânia Premium 45 (XP, BTG, Safra, Genial)": {
        "expectedReturn": 9.96,
        "volatility": 5
    },
    "Capitânia Radar 90 (XP, BTG, Safra, Genial) (IQ)": {
        "expectedReturn": 7.68,
        "volatility": 5
    },
    "Capitânia Yield 120 (XP, BTG, Safra) (IQ)": {
        "expectedReturn": 16.2,
        "volatility": 5
    },
    "Ibiuna Credit (XP, BTG, Safra, Inter)": {
        "expectedReturn": 14.04,
        "volatility": 5
    },
    "JGP Select Premium (XP, BTG, Safra, Genial) (PROFISSIONAL)": {
        "expectedReturn": 15.36,
        "volatility": 5
    },
    "Genoa Capital Radar (XP, BTG, Safra, Bradesco)": {
        "expectedReturn": 12.24,
        "volatility": 5
    },
    "Legacy Compound (XP, BTG, Genial) (IQ)": {
        "expectedReturn": 8.88,
        "volatility": 5
    },
    "Bahia AM DI (XP, BTG, Safra, Genial)": {
        "expectedReturn": 13.92,
        "volatility": 5
    },
    "ARX Hedge Infra (XP, BTG, Safra, Inter)": {
        "expectedReturn": 14.16,
        "volatility": 5
    },
    "Kinea Deb Incentivadas (Itaú/Íon, XP, BTG, Santander, Warren)": {
        "expectedReturn": 11.28,
        "volatility": 5
    },
    "Itaú Deb Incentivadas (Itaú/Íon)": {
        "expectedReturn": 10.32,
        "volatility": 5
    },
    "Trend Pré Fixado (XP, Órama)": {
        "expectedReturn": 12.48,
        "volatility": 5
    },
    "JGP Ecossistema (XP, BTG, Safra, Genial) (IQ)": {
        "expectedReturn": 17.88,
        "volatility": 5
    },
    "Gavea Macro (XP, BTG, Safra, Itaú)": {
        "expectedReturn": 5.76,
        "volatility": 5
    },
    "Gavea Macro Plus (XP, BTG, Safra) (IQ)": {
        "expectedReturn": 2.64,
        "volatility": 5
    },
    "Ibiuna Hedge ST (XP, BTG, Safra, Inter)": {
        "expectedReturn": 6.48,
        "volatility": 5
    },
    "Kapitalo Kappa (XP, BTG, Itaú/Íon, Santander, Banco do Brasil — classe padrão GERAL; classe Advisory = IQ)": {
        "expectedReturn": 14.88,
        "volatility": 5
    },
    "Kapitalo Zeta (XP, BTG, Safra, Genial, Inter) (IQ)": {
        "expectedReturn": 16.08,
        "volatility": 5
    },
    "Kinea Atlas (Itaú/Íon, XP, BTG, Inter, Santander, Warren)": {
        "expectedReturn": 17.52,
        "volatility": 5
    },
    "Kinea Oportunidade FIF (Bradesco, Santander, Itaú/Íon, XP) (IQ)": {
        "expectedReturn": 14.04,
        "volatility": 5
    },
    "Mar Absoluto (XP, BTG, Safra, Genial)": {
        "expectedReturn": -3.72,
        "volatility": 5
    },
    "SPX Nimitz (XP, BTG, Itaú/Íon, Safra) (IQ)": {
        "expectedReturn": 9.84,
        "volatility": 5
    },
    "SPX Raptor (XP, BTG, Inter) (IQ)": {
        "expectedReturn": 6.36,
        "volatility": 5
    },
    "Legacy V10 (XP, BTG, Genial) (IQ)": {
        "expectedReturn": 12.24,
        "volatility": 5
    },
    "Verde AM X60 (XP, BTG — captação frequentemente encerrada)": {
        "expectedReturn": 17.28,
        "volatility": 5
    },
    "Vista Multiestratégia (XP, Safra) (IQ — versão FIF Cotas)": {
        "expectedReturn": -26.04,
        "volatility": 5
    },
    "Vista Hedge (XP, BTG, Safra)": {
        "expectedReturn": -6.48,
        "volatility": 5
    },
    "Dahlia Total Return (XP, BTG, Genial, Inter)": {
        "expectedReturn": 22.2,
        "volatility": 5
    },
    "Encore Long Bias (XP, BTG, Genial)": {
        "expectedReturn": 6.48,
        "volatility": 5
    },
    "Truxt Long Bias (XP, BTG, Vitreo, Guide, Safra) (IQ)": {
        "expectedReturn": 41.64,
        "volatility": 5
    },
    "Atmos Ações (XP, BTG, Safra, Genial) (PROFISSIONAL) - fechado": {
        "expectedReturn": 14.16,
        "volatility": 5
    },
    "Bogari Value (XP, BTG, Órama, Genial) (IQ)": {
        "expectedReturn": 17.76,
        "volatility": 5
    },
    "Bogari Value Q FIC FIF Ações RL (XP, BTG, Órama) (IQ)": {
        "expectedReturn": 18.84,
        "volatility": 5
    },
    "Brasil Capital (XP, BTG, Safra, Genial)": {
        "expectedReturn": 4.44,
        "volatility": 5
    },
    "Dynamo Cougar (XP, BTG, Vitreo, Guide — captação frequentemente encerrada) (IQ)": {
        "expectedReturn": 5.04,
        "volatility": 5
    },
    "Hix Capital FIC FIA (XP, BTG, Safra, Genial) (IQ)": {
        "expectedReturn": 30.48,
        "volatility": 5
    },
    "Hix Capital HS FIA (XP, BTG) /HIX Capital Institucional FIF": {
        "expectedReturn": 33.72,
        "volatility": 5
    },
    "Forpus Ações FIC FIF Ações RL (XP, BTG, Genial)": {
        "expectedReturn": 51.24,
        "volatility": 5
    },
    "Real Investor FIC FIF Ações RL (XP, BTG, Icatu)": {
        "expectedReturn": 21.6,
        "volatility": 5
    },
    "IP Participações FIC FIF Ações RL (XP)": {
        "expectedReturn": 23.64,
        "volatility": 5
    },
    "Alaska Black FIF Cotas FIA (XP, BTG, Safra, Genial, Inter) (IQ)": {
        "expectedReturn": 12.12,
        "volatility": 5
    },
    "Vinci Partners FIF Cotas FIA (XP, BTG, Genial) (IQ)": {
        "expectedReturn": 29.76,
        "volatility": 5
    },
    "SPX Falcon (XP, BTG, Safra, Itaú, Inter) (IQ)": {
        "expectedReturn": 19.2,
        "volatility": 5
    }
};


// --- CARTEIRAS RECOMENDADAS (Simulador) ---
export const TIER_ORDER = ["30k","100k"];
export const TIER_LABEL: Record<string, string> = {"30k":"R$30 mil","100k":"R$100 mil"};
export const TIER_DEFAULT_VALUE: Record<string, number> = {"30k":30000,"100k":100000};
export const ITYPE_ORDER = ["Geral MH","Geral 360","IQ 360","IQ MH"];
export const ITYPE_LABEL: Record<string, string> = Object.fromEntries(["Geral MH","Geral 360","IQ 360","IQ MH"].map(x => [x, x]));
export const PERFIL_ORDER = ["Reserva","90% Conservador","Abrigo","Abrigo-Ritmo","Ritmo","Ritmo-Visão","Visão","Visão-Oceano","Oceano"];

export interface RecommendedPortfolio {
  id: string;
  tier: string;
  tier_label: string;
  itype: string;
  perfil: string;
  weights: Record<string, number>;
}

export const RECOMMENDED_PORTFOLIOS: RecommendedPortfolio[] = [{"id":"30k | Geral MH - Reserva","tier":"30k","tier_label":"R$30 mil","itype":"Geral MH","perfil":"Reserva","weights":{"Tesouro Selic / Fundo Simples":1}},{"id":"30k | Geral MH - 90% Conservador","tier":"30k","tier_label":"R$30 mil","itype":"Geral MH","perfil":"90% Conservador","weights":{"Tesouro Selic / Fundo Simples":0.9,"ARX Fuji":0.1}},{"id":"30k | Geral MH - Abrigo","tier":"30k","tier_label":"R$30 mil","itype":"Geral MH","perfil":"Abrigo","weights":{"Tesouro Selic / Fundo Simples":0.8,"ARX Fuji":0.05,"JGP Corporate":0.05,"BNP Paribas Rubi":0.05,"Ibiuna Credit":0.05}},{"id":"30k | Geral MH - Abrigo-Ritmo","tier":"30k","tier_label":"R$30 mil","itype":"Geral MH","perfil":"Abrigo-Ritmo","weights":{"Tesouro Selic / Fundo Simples":0.7,"ARX Fuji":0.1,"Sparta Deb Inc FIC Incentivados":0.1,"BNP Paribas Rubi":0.1}},{"id":"30k | Geral 360 - Ritmo","tier":"30k","tier_label":"R$30 mil","itype":"Geral 360","perfil":"Ritmo","weights":{"Tesouro Selic / Fundo Simples":0.6,"ARX Fuji":0.04,"Sparta Deb Inc FIC Incentivados":0.09,"BNP Paribas Rubi":0.03,"Augme 30 CIC":0.03,"Trend Pre Fixado":0.03,"Kapitalo Kappa":0.05,"Kinea Atlas":0.03,"IVVB11":0.03,"Wellington Ventura Advisory":0.04,"DIVO11":0.03}},{"id":"30k | Geral MH - Ritmo-Visão","tier":"30k","tier_label":"R$30 mil","itype":"Geral MH","perfil":"Ritmo-Visão","weights":{"Tesouro Selic / Fundo Simples":0.5,"ARX Fuji":0.05,"BNP Paribas Rubi":0.06,"ARX Hedge Infra":0.1,"Kinea Atlas":0.1,"Hix Capital HS FIA":0.1,"IVVB11":0.1}},{"id":"30k | Geral 360 - Visão","tier":"30k","tier_label":"R$30 mil","itype":"Geral 360","perfil":"Visão","weights":{"Tesouro Selic / Fundo Simples":0.4,"ARX Fuji":0.07,"Sparta Deb Inc FIC Incentivados":0.08,"BNP Paribas Rubi":0.03,"Kinea Deb Incentivadas":0.03,"Trend Pre Fixado":0.03,"Kapitalo Kappa":0.1,"Kinea Atlas":0.04,"Hix Capital HS FIA":0.05,"IVVB11":0.05,"NASD11":0.04,"Wellington Ventura Advisory":0.05,"DIVO11":0.03}},{"id":"30k | Geral 360 - Visão-Oceano","tier":"30k","tier_label":"R$30 mil","itype":"Geral 360","perfil":"Visão-Oceano","weights":{"Tesouro Selic / Fundo Simples":0.3,"ARX Fuji":0.04,"Sparta Deb Inc FIC Incentivados":0.1,"Kapitalo Kappa":0.1,"Hix Capital HS FIA":0.1,"IVVB11":0.1,"NASD11":0.06,"Wellington Ventura Advisory":0.1,"DIVO11":0.1}},{"id":"30k | Geral 360 - Oceano","tier":"30k","tier_label":"R$30 mil","itype":"Geral 360","perfil":"Oceano","weights":{"Tesouro Selic / Fundo Simples":0.2,"ARX Fuji":0.04,"Sparta Deb Inc FIC Incentivados":0.04,"BNP Paribas Rubi":0.04,"Kinea Deb Incentivadas":0.03,"Trend Pre Fixado":0.03,"Kapitalo Kappa":0.09,"Kinea Atlas":0.03,"Dahlia Total Return":0.03,"Hix Capital HS FIA":0.1,"IVVB11":0.1,"NASD11":0.08,"Wellington Ventura Advisory":0.1,"DIVO11":0.09}},{"id":"100k | Geral 360 - Reserva","tier":"100k","tier_label":"R$100 mil","itype":"Geral 360","perfil":"Reserva","weights":{"Tesouro Selic / Fundo Simples":1}},{"id":"100k | Geral MH - 90% Conservador","tier":"100k","tier_label":"R$100 mil","itype":"Geral MH","perfil":"90% Conservador","weights":{"Tesouro Selic / Fundo Simples":0.9,"ARX Fuji":0.1}},{"id":"100k | Geral 360 - Abrigo","tier":"100k","tier_label":"R$100 mil","itype":"Geral 360","perfil":"Abrigo","weights":{"Tesouro Selic / Fundo Simples":0.8,"ARX Fuji":0.03,"JGP Corporate":0.03,"BNP Paribas Rubi":0.08,"Augme 30 CIC":0.03,"Ibiuna Credit":0.03}},{"id":"100k | Geral 360 - Abrigo-Ritmo","tier":"100k","tier_label":"R$100 mil","itype":"Geral 360","perfil":"Abrigo-Ritmo","weights":{"Tesouro Selic / Fundo Simples":0.7,"ARX Fuji":0.05,"JGP Corporate":0.05,"BNP Paribas Rubi":0.06,"Augme 30 CIC":0.04,"Ibiuna Credit":0.05,"ARX Hedge Infra":0.05}},{"id":"100k | Geral 360 - Ritmo","tier":"100k","tier_label":"R$100 mil","itype":"Geral 360","perfil":"Ritmo","weights":{"Tesouro Selic / Fundo Simples":0.6,"ARX Fuji":0.04,"Sparta Deb Inc FIC Incentivados":0.04,"BNP Paribas Rubi":0.04,"Ibiuna Credit":0.03,"ARX Hedge Infra":0.07,"Kapitalo Kappa":0.03,"Kinea Atlas":0.04,"IVVB11":0.05,"Wellington Ventura Advisory":0.02,"DIVO11":0.02,"Hix Capital HS FIA":0.02}},{"id":"100k | Geral 360 - Ritmo-Visão","tier":"100k","tier_label":"R$100 mil","itype":"Geral 360","perfil":"Ritmo-Visão","weights":{"Tesouro Selic / Fundo Simples":0.5,"ARX Fuji":0.05,"Sparta Deb Inc FIC Incentivados":0.04,"BNP Paribas Rubi":0.04,"Ibiuna Credit":0.04,"ARX Hedge Infra":0.07,"Kapitalo Kappa":0.03,"Kinea Atlas":0.03,"IVVB11":0.06,"Wellington Ventura Advisory":0.05,"DIVO11":0.04,"Hix Capital HS FIA":0.05}},{"id":"100k | Geral 360 - Visão","tier":"100k","tier_label":"R$100 mil","itype":"Geral 360","perfil":"Visão","weights":{"Tesouro Selic / Fundo Simples":0.4,"ARX Fuji":0.05,"Sparta Deb Inc FIC Incentivados":0.05,"BNP Paribas Rubi":0.05,"Ibiuna Credit":0.04,"ARX Hedge Infra":0.08,"Kapitalo Kappa":0.04,"Kinea Atlas":0.04,"Hix Capital HS FIA":0.05,"IVVB11":0.04,"NASD11":0.04,"Wellington Ventura Advisory":0.07,"DIVO11":0.05}},{"id":"100k | Geral 360 - Visão-Oceano","tier":"100k","tier_label":"R$100 mil","itype":"Geral 360","perfil":"Visão-Oceano","weights":{"Tesouro Selic / Fundo Simples":0.3,"ARX Fuji":0.05,"Sparta Deb Inc FIC Incentivados":0.05,"BNP Paribas Rubi":0.04,"Ibiuna Credit":0.04,"ARX Hedge Infra":0.08,"Kapitalo Kappa":0.02,"Kinea Atlas":0.04,"Hix Capital HS FIA":0.08,"IVVB11":0.07,"NASD11":0.07,"Wellington Ventura Advisory":0.08,"DIVO11":0.08}},{"id":"100k | Geral 360 - Oceano","tier":"100k","tier_label":"R$100 mil","itype":"Geral 360","perfil":"Oceano","weights":{"Tesouro Selic / Fundo Simples":0.2,"ARX Fuji":0.04,"Sparta Deb Inc FIC Incentivados":0.04,"BNP Paribas Rubi":0.05,"Ibiuna Credit":0.04,"ARX Hedge Infra":0.06,"Kapitalo Kappa":0.04,"Kinea Atlas":0.04,"Hix Capital HS FIA":0.1,"IVVB11":0.1,"NASD11":0.09,"Wellington Ventura Advisory":0.1,"DIVO11":0.1}},{"id":"100k | IQ 360 - Reserva","tier":"100k","tier_label":"R$100 mil","itype":"IQ 360","perfil":"Reserva","weights":{"Tesouro Selic / Fundo Simples":1}},{"id":"100k | IQ 360 - 90% Conservador","tier":"100k","tier_label":"R$100 mil","itype":"IQ 360","perfil":"90% Conservador","weights":{"Tesouro Selic / Fundo Simples":0.9,"VALORA GUARDIAN ADVISORY FIDC – RL":0.1}},{"id":"100k | IQ 360 - Abrigo","tier":"100k","tier_label":"R$100 mil","itype":"IQ 360","perfil":"Abrigo","weights":{"Tesouro Selic / Fundo Simples":0.8,"ARX Fuji":0.03,"VALORA GUARDIAN ADVISORY FIDC – RL":0.08,"Kinea Oportunidade FIM":0.03,"Augme 30 CIC":0.03,"Ibiuna Credit":0.03}},{"id":"100k | IQ 360 - Abrigo-Ritmo","tier":"100k","tier_label":"R$100 mil","itype":"IQ 360","perfil":"Abrigo-Ritmo","weights":{"Tesouro Selic / Fundo Simples":0.7,"ARX Fuji":0.1,"VALORA GUARDIAN ADVISORY FIDC – RL":0.1,"Ibiuna Credit":0.1}},{"id":"100k | IQ 360 - Ritmo","tier":"100k","tier_label":"R$100 mil","itype":"IQ 360","perfil":"Ritmo","weights":{"Tesouro Selic / Fundo Simples":0.6,"ARX Fuji":0.03,"VALORA GUARDIAN ADVISORY FIDC – RL":0.04,"Sparta Deb Inc FIC Incentivados":0.03,"Ibiuna Credit":0.03,"ARX Hedge Infra":0.06,"Trend Pre Fixado":0.03,"Kinea Atlas":0.03,"Kinea Oportunidade FIF":0.05,"IVVB11":0.03,"Wellington Ventura Advisory":0.04,"DIVO11":0.03}},{"id":"100k | IQ 360 - Ritmo-Visão","tier":"100k","tier_label":"R$100 mil","itype":"IQ 360","perfil":"Ritmo-Visão","weights":{"Tesouro Selic / Fundo Simples":0.5,"VALORA GUARDIAN ADVISORY FIDC – RL":0.1,"Sparta Deb Inc FIC Incentivados":0.1,"ARX Hedge Infra":0.1,"Kinea Oportunidade FIF":0.1,"Wellington Ventura Advisory":0.1}},{"id":"100k | IQ 360 - Visão","tier":"100k","tier_label":"R$100 mil","itype":"IQ 360","perfil":"Visão","weights":{"Tesouro Selic / Fundo Simples":0.4,"VALORA GUARDIAN ADVISORY FIDC – RL":0.04,"Sparta Deb Inc FIC Incentivados":0.03,"BNP Paribas Rubi":0.03,"Ibiuna Credit":0.03,"ARX Hedge Infra":0.08,"Trend Pre Fixado":0.03,"Kinea Atlas":0.04,"Kinea Oportunidade FIF":0.1,"Truxt Long Bias":0.05,"IVVB11":0.03,"NASD11":0.04,"Wellington Ventura Advisory":0.07,"DIVO11":0.03}},{"id":"100k | IQ 360 - Visão-Oceano","tier":"100k","tier_label":"R$100 mil","itype":"IQ 360","perfil":"Visão-Oceano","weights":{"Tesouro Selic / Fundo Simples":0.3,"ARX Fuji":0.04,"VALORA GUARDIAN ADVISORY FIDC – RL":0.1,"ARX Hedge Infra":0.1,"Kinea Oportunidade FIF":0.1,"Truxt Long Bias":0.1,"IVVB11":0.1,"NASD11":0.06,"Wellington Ventura Advisory":0.1}},{"id":"100k | IQ 360 - Oceano","tier":"100k","tier_label":"R$100 mil","itype":"IQ 360","perfil":"Oceano","weights":{"Tesouro Selic / Fundo Simples":0.2,"VALORA GUARDIAN ADVISORY FIDC – RL":0.05,"Sparta Deb Inc FIC Incentivados":0.03,"Ibiuna Credit":0.03,"ARX Hedge Infra":0.04,"Trend Pre Fixado":0.03,"Kinea Atlas":0.03,"Kinea Oportunidade FIF":0.09,"Truxt Long Bias":0.1,"Hix Capital HS FIA":0.09,"IVVB11":0.1,"NASD11":0.08,"Wellington Ventura Advisory":0.1,"DIVO11":0.03}},{"id":"100k | IQ MH - Reserva","tier":"100k","tier_label":"R$100 mil","itype":"IQ MH","perfil":"Reserva","weights":{"Tesouro Selic / Fundo Simples":1}},{"id":"100k | IQ MH - 90% Conservador","tier":"100k","tier_label":"R$100 mil","itype":"IQ MH","perfil":"90% Conservador","weights":{"Tesouro Selic / Fundo Simples":0.9,"ARX Fuji":0.1}},{"id":"100k | IQ MH - Abrigo","tier":"100k","tier_label":"R$100 mil","itype":"IQ MH","perfil":"Abrigo","weights":{"Tesouro Selic / Fundo Simples":0.8,"ARX Fuji":0.05,"VALORA GUARDIAN ADVISORY FIDC – RL":0.05,"Kinea Oportunidade FIM":0.05,"BNP Paribas Rubi":0.05}},{"id":"100k | IQ MH - Abrigo-Ritmo","tier":"100k","tier_label":"R$100 mil","itype":"IQ MH","perfil":"Abrigo-Ritmo","weights":{"Tesouro Selic / Fundo Simples":0.7,"Capitania Yield 120":0.1,"JGP Ecossistema":0.1,"IVVB11":0.1}},{"id":"100k | IQ MH - Ritmo","tier":"100k","tier_label":"R$100 mil","itype":"IQ MH","perfil":"Ritmo","weights":{"Tesouro Selic / Fundo Simples":0.6,"Capitania Yield 120":0.1,"ARX Hedge Infra":0.05,"JGP Ecossistema":0.1,"Kinea Oportunidade FIF":0.05,"Hix Capital HS FIA":0.03,"IVVB11":0.07}},{"id":"100k | IQ MH - Ritmo-Visão","tier":"100k","tier_label":"R$100 mil","itype":"IQ MH","perfil":"Ritmo-Visão","weights":{"Tesouro Selic / Fundo Simples":0.5,"Capitania Yield 120":0.1,"JGP Ecossistema":0.1,"Kinea Oportunidade FIF":0.1,"Hix Capital HS FIA":0.1,"IVVB11":0.1}},{"id":"100k | IQ MH - Visão","tier":"100k","tier_label":"R$100 mil","itype":"IQ MH","perfil":"Visão","weights":{"Tesouro Selic / Fundo Simples":0.4,"Capitania Yield 120":0.1,"JGP Ecossistema":0.1,"Kinea Oportunidade FIF":0.1,"Truxt Long Bias":0.05,"Hix Capital HS FIA":0.1,"IVVB11":0.08,"NASD11":0.04,"WRLD11":0.03}},{"id":"100k | IQ MH - Visão-Oceano","tier":"100k","tier_label":"R$100 mil","itype":"IQ MH","perfil":"Visão-Oceano","weights":{"Tesouro Selic / Fundo Simples":0.3,"ARX Fuji":0.04,"JGP Ecossistema":0.1,"Kinea Oportunidade FIF":0.1,"Truxt Long Bias":0.1,"Hix Capital HS FIA":0.1,"IVVB11":0.1,"NASD11":0.06,"WRLD11":0.1}},{"id":"100k | IQ MH - Oceano","tier":"100k","tier_label":"R$100 mil","itype":"IQ MH","perfil":"Oceano","weights":{"Tesouro Selic / Fundo Simples":0.2,"ARX Hedge Infra":0.03,"JGP Ecossistema":0.1,"Kinea Oportunidade FIF":0.1,"Truxt Long Bias":0.1,"Hix Capital HS FIA":0.1,"IVVB11":0.1,"NASD11":0.08,"WRLD11":0.1,"DIVO11":0.09}}];
