export type PortfolioType = "ABRIGO" | "RITMO" | "VISÃO" | "OCEANO"

export type FundAllocation = {
    name: string
    category: string
    type: string
    percentage: number
}

export const PORTFOLIO_ALLOCATIONS: Record<PortfolioType, FundAllocation[]> = {
    ABRIGO: [
        { name: "Tesouro Selic / Fundo Simples", category: "Pós-FIXADO", type: "Pós-Fixado (DI / Caixa)", percentage: 64.0 },
        { name: "JGP Corporate FIC FIF RF CP LP RL", category: "Pós-FIXADO", type: "Pós-Fixado (DI / Caixa)", percentage: 8.0 },
        { name: "SPX Seahawk Crédito Privado FIC FIRF", category: "Pós-FIXADO", type: "Pós-Fixado (DI / Caixa)", percentage: 8.0 },
        { name: "Kinea Inflação Curta FIRF", category: "IPCA+", type: "IPCA+ (Inflação)", percentage: 4.0 },
        { name: "Icatu Visão Inflação Curta", category: "IPCA+", type: "IPCA+ (Inflação)", percentage: 4.0 },
        { name: "NTNB 2028", category: "IPCA+", type: "IPCA+ (Inflação)", percentage: 4.0 },
        { name: "Kinea Debêntures Incentivadas", category: "PREFIXADO", type: "Prefixados", percentage: 3.0 },
        { name: "Kinea Oportunidade FIM", category: "MULTIMERCADO", type: "Multimercados", percentage: 5.0 },
    ],

    RITMO: [
        { name: "Tesouro Selic / Fundo Simples", category: "Pós-FIXADO", type: "Pós-Fixado (DI / Caixa)", percentage: 18.0 },
        { name: "Fundo Simples", category: "Pós-FIXADO", type: "Pós-Fixado (DI / Caixa)", percentage: 3.0 },
        { name: "JGP Corporate FIC FIF RF CP LP RL", category: "Pós-FIXADO", type: "Pós-Fixado (DI / Caixa)", percentage: 6.0 },
        { name: "SPX Seahawk Crédito Privado FIC FIRF", category: "Pós-FIXADO", type: "Pós-Fixado (DI / Caixa)", percentage: 6.0 },
        { name: "ARX Hedge FIC Incentivado Infra RF RL", category: "IPCA+", type: "IPCA+ (Inflação)", percentage: 6.0 },
        { name: "NTNB / IB5M11", category: "IPCA+", type: "IPCA+ (Inflação)", percentage: 9.0 },
        { name: "MS Global Fixed Income", category: "RENDA_FIXA", type: "Pós-Fixado (DI / Caixa)", percentage: 5.0 },
        { name: "Kinea Atlas II FIM RL", category: "MULTIMERCADO", type: "Multimercados", percentage: 7.0 },
        { name: "Ibiuna Hedge ST", category: "MULTIMERCADO", type: "Multimercados", percentage: 4.0 },
        { name: "Kapitalo Kappa Advisory", category: "MULTIMERCADO", type: "Multimercados", percentage: 7.0 },
        { name: "Dynamo Cougar", category: "ACOES", type: "Ações Brasil", percentage: 5.0 },
        { name: "Bogari Value", category: "ACOES", type: "Ações Brasil", percentage: 4.0 },
        { name: "Atmos Ações", category: "ACOES", type: "Ações Brasil", percentage: 4.0 },
        { name: "IVVB11 / ETF S&P 500", category: "INTERNACIONAL", type: "Internacional / FX", percentage: 6.0 },
        { name: "JP Morgan Global Equity", category: "INTERNACIONAL", type: "Internacional / FX", percentage: 3.0 },
        { name: "Trend Ouro", category: "ALTERNATIVO", type: "Multimercados", percentage: 4.0 },
        { name: "Hashdex Nasdaq Crypto", category: "CRIPTO", type: "Multimercados", percentage: 3.0 },
    ],

    VISÃO: [
        { name: "Tesouro Selic / Fundo Simples", category: "Pós-FIXADO", type: "Pós-Fixado (DI / Caixa)", percentage: 4.0 },
        { name: "Capitânia Premium 45", category: "Pós-FIXADO", type: "Pós-Fixado (DI / Caixa)", percentage: 3.0 },
        { name: "JGP Corporate", category: "Pós-FIXADO", type: "Pós-Fixado (DI / Caixa)", percentage: 4.0 },
        { name: "SPX Seahawk", category: "Pós-FIXADO", type: "Pós-Fixado (DI / Caixa)", percentage: 3.0 },
        { name: "Valora Guardian", category: "Pós-FIXADO", type: "Pós-Fixado (DI / Caixa)", percentage: 3.0 },
        { name: "IMAB11", category: "IPCA+", type: "IPCA+ (Inflação)", percentage: 6.0 },
        { name: "IB5M11", category: "IPCA+", type: "IPCA+ (Inflação)", percentage: 5.0 },
        { name: "Kinea Debêntures Incentivadas", category: "IPCA+", type: "IPCA+ (Inflação)", percentage: 5.0 },
        { name: "ARX Hedge Master FI Infra", category: "IPCA+", type: "IPCA+ (Inflação)", percentage: 4.0 },
        { name: "Trend Pré-Fixado FIRF LP RL", category: "PREFIXADO", type: "Prefixados", percentage: 6.0 },
        { name: "Tesouro Pré 2027", category: "PREFIXADO", type: "Prefixados", percentage: 2.0 },
        { name: "Kinea Atlas", category: "MULTIMERCADO", type: "Multimercados", percentage: 4.0 },
        { name: "Ibiuna Hedge ST", category: "MULTIMERCADO", type: "Multimercados", percentage: 4.0 },
        { name: "Kapitalo Kappa", category: "MULTIMERCADO", type: "Multimercados", percentage: 4.0 },
        { name: "SPX Nimitz", category: "MULTIMERCADO", type: "Multimercados", percentage: 4.0 },
        { name: "JGP Ecossistema 360", category: "MULTIMERCADO", type: "Multimercados", percentage: 3.0 },
        { name: "Dynamo Cougar", category: "ACOES", type: "Ações Brasil", percentage: 3.0 },
        { name: "Atmos Ações", category: "ACOES", type: "Ações Brasil", percentage: 3.0 },
        { name: "Dahlia Total Return", category: "ACOES", type: "Ações Brasil", percentage: 4.0 },
        { name: "Encore Long Bias", category: "ACOES", type: "Ações Brasil", percentage: 4.0 },
        { name: "SMAL11", category: "ACOES", type: "Ações Brasil", percentage: 4.0 },
        { name: "IVVB11", category: "INTERNACIONAL", type: "Internacional / FX", percentage: 6.0 },
        { name: "JP Morgan Global Equity", category: "INTERNACIONAL", type: "Internacional / FX", percentage: 3.0 },
        { name: "MS Global Fixed Income", category: "INTERNACIONAL", type: "Internacional / FX", percentage: 3.0 },
        { name: "GOLD11", category: "INTERNACIONAL", type: "Internacional / FX", percentage: 4.0 },
        { name: "Hashdex Nasdaq Crypto", category: "INTERNACIONAL", type: "Multimercados", percentage: 3.0 },
    ],

    OCEANO: [
        { name: "JPM Money Market", category: "Renda Fixa", type: "Renda Fixa", percentage: 2 },
        { name: "Treasury Americano", category: "Renda Fixa", type: "Renda Fixa", percentage: 43 },
        { name: "Soberano Brasil", category: "Renda Fixa", type: "Renda Fixa", percentage: 10 },
        { name: "AB Low Volatility Equity", category: "Renda Variável", type: "Renda Variável", percentage: 20 },
        { name: "JP Morgan US Growth", category: "Renda Variável", type: "Renda Variável", percentage: 20 },
        { name: "Bitcoin", category: "Alternativo", type: "Alternativo", percentage: 2.5 },
        { name: "Trend Ouro", category: "Alternativo", type: "Alternativo", percentage: 2.5 },
    ],
}


export function getTotalsByType(portfolio: PortfolioType) {
    const funds = PORTFOLIO_ALLOCATIONS[portfolio]
    const totals: Record<string, number> = {}

    funds.forEach(fund => {
        if (!totals[fund.type]) {
            totals[fund.type] = 0
        }
        totals[fund.type] += fund.percentage
    })

    return totals
}
