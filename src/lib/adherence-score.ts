import { UserAsset } from "./asset-types"
import { PORTFOLIO_ALLOCATIONS, type PortfolioType } from "./portfolio-allocations"

export interface AdherenceScore {
    score: number // 0-100
    matching: string[] // user fund names that match recommended
    missing: string[] // recommended funds not in user portfolio
    extra: string[] // user funds not in recommended
    totalUserFunds: number
    matchingFunds: number
}

export function calculateAdherenceScore(
    userAssets: UserAsset[],
    profileType: PortfolioType
): AdherenceScore {
    const recommended = PORTFOLIO_ALLOCATIONS[profileType]
    const recommendedFundNames = recommended.map(fund => fund.name.toLowerCase())
    const userFundNames = userAssets.map(asset => asset.name.toLowerCase()).filter(name => name.length > 0)

    // Find matching funds
    const matching = userFundNames.filter(name =>
        recommendedFundNames.some(recName =>
            recName.includes(name) || name.includes(recName)
        )
    )

    // Find missing (recommended but not in user portfolio)
    const missing = recommended
        .filter(fund =>
            !userFundNames.some(userName =>
                fund.name.toLowerCase().includes(userName) || userName.includes(fund.name.toLowerCase())
            )
        )
        .map(fund => fund.name)

    // Find extra (in user portfolio but not recommended)
    const extra = userAssets
        .filter(asset =>
            asset.name.length > 0 &&
            !recommendedFundNames.some(recName =>
                recName.includes(asset.name.toLowerCase()) || asset.name.toLowerCase().includes(recName)
            )
        )
        .map(asset => asset.name)

    const totalUserFunds = userFundNames.length
    const matchingFunds = matching.length
    const score = totalUserFunds > 0 ? Math.round((matchingFunds / totalUserFunds) * 100) : 0

    return {
        score,
        matching,
        missing,
        extra,
        totalUserFunds,
        matchingFunds
    }
}

export function getScoreLabel(score: number): { label: string; color: string } {
    if (score >= 80) return { label: "Excelente", color: "text-green-600 dark:text-green-400" }
    if (score >= 60) return { label: "Boa", color: "text-blue-600 dark:text-blue-400" }
    if (score >= 40) return { label: "Moderada", color: "text-yellow-600 dark:text-yellow-400" }
    if (score >= 20) return { label: "Baixa", color: "text-orange-600 dark:text-orange-400" }
    return { label: "Muito Baixa", color: "text-red-600 dark:text-red-400" }
}
