// Mock portfolio performance data (monthly returns for 2024)
// In production, this would come from actual fund performance

export type PortfolioType = "ABRIGO" | "RITMO" | "VANGUARDA" | "OCEANO"

export const PORTFOLIO_PERFORMANCE = {
    ABRIGO: {
        monthlyReturns: [0.98, 1.95, 2.82, 3.72, 4.58, 5.38, 6.30, 7.18, 8.04, 8.98, 9.79, 10.75],
        annualReturn: 10.75,
        name: "Abrigo"
    },
    RITMO: {
        monthlyReturns: [1.05, 2.10, 3.08, 4.10, 5.05, 5.92, 7.02, 8.08, 9.12, 10.28, 11.40, 12.65],
        annualReturn: 12.65,
        name: "Ritmo"
    },
    VANGUARDA: {
        monthlyReturns: [1.15, 2.32, 3.42, 4.58, 5.68, 6.72, 7.95, 9.15, 10.32, 11.58, 12.80, 14.25],
        annualReturn: 14.25,
        name: "Vanguarda"
    },
    OCEANO: {
        monthlyReturns: [1.08, 2.18, 3.20, 4.28, 5.30, 6.25, 7.38, 8.48, 9.55, 10.72, 11.85, 13.15],
        annualReturn: 13.15,
        name: "Oceano"
    }
}

export function getPortfolioPerformance(type: PortfolioType) {
    return PORTFOLIO_PERFORMANCE[type]
}
