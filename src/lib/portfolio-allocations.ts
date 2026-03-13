export type PortfolioType = "ABRIGO" | "RITMO" | "VANGUARDA" | "OCEANO"

export type FundAllocation = {
    name: string
    category: string
    type: string
    percentage: number
}

export const PORTFOLIO_ALLOCATIONS: Record<PortfolioType, FundAllocation[]> = {
    ABRIGO: [
        { name: "Itaú Lumina Platinum FIF RF LP", category: "Pós-fixado", type: "Renda Fixa", percentage: 15 },
        { name: "Kinea Oportunidade FIF RF CP", category: "Crédito Privado", type: "Renda Fixa", percentage: 15 },
        { name: "SulAmérica Crédito Ativo FIRF", category: "Crédito Privado", type: "Renda Fixa", percentage: 10 },
        { name: "AZ Quest Altro Advisory CP", category: "Crédito Privado", type: "Renda Fixa", percentage: 10 },
        { name: "Sparta Debêntures Incentivadas", category: "Inflação / Infra", type: "Renda Fixa Inflação", percentage: 10 },
        { name: "ARX Everest FIC FIM", category: "Multimercado", type: "Multimercado", percentage: 10 },
        { name: "Trend Inflação Curta FIRF", category: "Inflação / Infra", type: "Renda Fixa Inflação", percentage: 10 },
        { name: "Absolute Vertex Advisory", category: "Multimercado", type: "Multimercado", percentage: 10 },
        { name: "Icatu Vanguarda Inflação Curta", category: "Inflação / Infra", type: "Renda Fixa Inflação", percentage: 5 },
        { name: "RBR Crédito Estruturado", category: "Crédito Privado", type: "Renda Fixa", percentage: 5 },
    ],

    RITMO: [
        { name: "Kinea Oportunidade FIF RF CP RL – 40%", category: "Crédito Privado", type: "Renda Fixa", percentage: 15 },
        { name: "Sparta Infra FIC FI RF (Isento)", category: "Inflação / Infra", type: "Renda Fixa Inflação", percentage: 10 },
        { name: "Capitania Yield 120 FIC FIDC", category: "Crédito Privado", type: "Renda Fixa", percentage: 10 },
        { name: "Verde FIC FIM", category: "Multimercado", type: "Multimercado", percentage: 10 },
        { name: "Legacy Capital Advisory", category: "Multimercado", type: "Multimercado", percentage: 10 },
        { name: "Genoa Capital Radar", category: "Multimercado", type: "Multimercado", percentage: 10 },
        { name: "Ibiuna Long Short STLS", category: "Multimercado", type: "Multimercado", percentage: 10 },
        { name: "Paraty FIF Ações (Dividendos)", category: "Ações", type: "Renda Variável", percentage: 10 },
        { name: "Vinland Macro FIC FIM", category: "Multimercado", type: "Multimercado", percentage: 10 },
        { name: "Kapitalo K10", category: "Ações", type: "Renda Variável", percentage: 5 },
    ],

    VANGUARDA: [
        { name: "Trígono Flagship Small Caps", category: "Ações", type: "Renda Variável", percentage: 15 },
        { name: "Dynamo Cougar (ou Atmosphere)", category: "Ações", type: "Renda Variável", percentage: 10 },
        { name: "Real Investor FIC FIA", category: "Ações", type: "Renda Variável", percentage: 10 },
        { name: "SPX Falcon (ou Patriot)", category: "Ações", type: "Renda Variável", percentage: 10 },
        { name: "SPX Nimitz", category: "Multimercado", type: "Multimercado", percentage: 10 },
        { name: "Kapitalo K10", category: "Ações", type: "Renda Variável", percentage: 10 },
        { name: "Vista Multiestratégia", category: "Multimercado", type: "Multimercado", percentage: 10 },
        { name: "Wellington Schroder Gaia", category: "Ações Global", type: "Renda Variável", percentage: 10 },
        { name: "Jive BossaNova High Yield", category: "Crédito Privado", type: "Renda Fixa", percentage: 10 },
        { name: "Kinea Atlas", category: "Multimercado", type: "Multimercado", percentage: 5 },
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
