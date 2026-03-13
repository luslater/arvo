import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Ideal Allocations (Placeholders - to be refined)
export const IDEAL_PORTFOLIOS = {
    "CONSERVATIVE": {
        "FIXED_INCOME": 0.80,
        "MULTIMARKET": 0.15,
        "EQUITY": 0.00,
        "INTERNATIONAL": 0.05,
        "OTHER": 0.00,
    },
    "MODERATE": {
        "FIXED_INCOME": 0.40,
        "MULTIMARKET": 0.30,
        "EQUITY": 0.20,
        "INTERNATIONAL": 0.10,
        "OTHER": 0.00,
    },
    "AGGRESSIVE": {
        "FIXED_INCOME": 0.10,
        "MULTIMARKET": 0.30,
        "EQUITY": 0.40,
        "INTERNATIONAL": 0.20,
        "OTHER": 0.00,
    },
}

export async function getTopFunds(category: string, limit = 3) {
    // Simple ranking by Sharpe Ratio for now (Mocked for build)
    return [] as any[]
}

export async function generateRecommendations(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    })

    if (!user) throw new Error("User not found")

    const currentHoldings: any[] = []
    const totalBalance = currentHoldings.reduce((sum: number, h: any) => sum + h.amount, 0)

    // Calculate Current Allocation
    const currentAllocation: Record<string, number> = {}
    for (const h of currentHoldings) {
        currentAllocation[h.category] = (currentAllocation[h.category] || 0) + h.amount
    }

    // Normalize to percentages
    const currentPct: Record<string, number> = {}
    Object.keys(currentAllocation).forEach(cat => {
        currentPct[cat] = totalBalance > 0 ? currentAllocation[cat] / totalBalance : 0
    })

    // User.profile não existe nesse formato do schema inicial, mock para build
    const profile = "MODERATE"
    const ideal = IDEAL_PORTFOLIOS[profile as keyof typeof IDEAL_PORTFOLIOS]
    const recommendations = []

    // Gap Analysis
    for (const catKey in ideal) {
        const category = catKey
        const targetPct = ideal[category as keyof typeof ideal] || 0
        const actualPct = currentPct[category] || 0
        const gap = targetPct - actualPct

        // Threshold to recommend action (e.g., 5% deviation)
        if (Math.abs(gap) > 0.05) {
            const amountToMove = gap * totalBalance

            if (gap > 0) {
                // Need to BUY
                const topFunds = await getTopFunds(category)
                recommendations.push({
                    action: 'BUY',
                    category,
                    amount: amountToMove,
                    reason: `You are underweighted in ${category} by ${(gap * 100).toFixed(1)}%`,
                    suggestedFunds: topFunds
                })
            } else {
                // Need to SELL
                recommendations.push({
                    action: 'SELL',
                    category,
                    amount: Math.abs(amountToMove),
                    reason: `You are overweighted in ${category} by ${(Math.abs(gap) * 100).toFixed(1)}%`,
                    // Logic to suggest which specific holding to sell could be added here
                })
            }
        }
    }

    return {
        currentAllocation: currentPct,
        idealAllocation: ideal,
        recommendations
    }
}
