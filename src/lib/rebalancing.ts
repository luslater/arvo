import { UserAsset } from "./asset-types"
import { PORTFOLIO_ALLOCATIONS, PortfolioType, getTotalsByType } from "./portfolio-allocations"

export type RebalancingRecommendation = {
    fundName: string
    currentValue: number
    targetValue: number
    difference: number
    action: "BUY" | "SELL" | "KEEP"
    amount: number
    percentage: number // Target percentage
}

export function calculateRebalancing(
    currentAssets: UserAsset[],
    profile: PortfolioType,
    amount: number,
    type: "INVEST" | "REDEEM"
): RebalancingRecommendation[] {
    const targetAllocations = PORTFOLIO_ALLOCATIONS[profile]

    // 1. Calculate current total capital
    const currentTotal = currentAssets.reduce((sum, asset) => sum + asset.value, 0)

    // 2. Calculate projected total capital
    const projectedTotal = type === "INVEST"
        ? currentTotal + amount
        : currentTotal - amount

    if (projectedTotal <= 0) return []

    // 3. Calculate target value for each fund based on projected total
    const recommendations: RebalancingRecommendation[] = targetAllocations.map(fund => {
        // Find current value of this fund in user assets
        // We match by name. In a real app, we should probably use IDs.
        const currentAsset = currentAssets.find(a => a.name === fund.name)
        const currentFundValue = currentAsset ? currentAsset.value : 0

        const targetValue = projectedTotal * (fund.percentage / 100)

        // Calculate the gap
        // If Investing: We want to reach Target. Gap = Target - Current.
        // If Redeeming: We want to reach Target. Gap = Current - Target (amount to sell).

        let difference = targetValue - currentFundValue
        let action: "BUY" | "SELL" | "KEEP" = "KEEP"
        let recommendedAmount = 0

        // Logic for Investment (Contribution)
        // We want to fill the buckets that are most empty relative to their target

        return {
            fundName: fund.name,
            currentValue: currentFundValue,
            targetValue: targetValue,
            difference: difference,
            action: "KEEP", // Placeholder, logic below
            amount: 0,
            percentage: fund.percentage
        }
    })

    // 4. Distribute the operation amount

    if (type === "INVEST") {
        // Sort by biggest deficit (difference > 0 means we need to buy)
        // We want to prioritize funds that are furthest from their target

        // Simple algorithm: 
        // 1. Calculate ideal delta for each fund to reach target
        // 2. Distribute 'amount' proportionally to the deficits? 
        //    Or fill the biggest holes first?
        //    Let's try a proportional distribution of the "New Money" to bring everyone closer to target.

        // Actually, the simplest robust way is:
        // Target Value is known. 
        // We have 'amount' to add.
        // We can't just set everyone to Target Value because 'amount' might not be enough to fix all deviations,
        // OR 'amount' might be exactly what's needed if we assume perfect rebalancing (which implies selling overweights).
        // BUT, usually "Aporte" means ONLY BUYING. We don't want to sell winners to buy losers unless requested.

        // So, for "Aporte" (Only Buy):
        // We want to allocate 'amount' to minimize the tracking error.
        // Heuristic: Allocate to the funds that are most UNDERWEIGHT (Current % < Target %).

        // Let's calculate the "Gap" for each fund: (Target % * ProjectedTotal) - CurrentValue
        // This is the 'difference' calculated above.

        let remainingAmount = amount

        // Filter only funds that need money (difference > 0)
        const deficits = recommendations.filter(r => r.difference > 0)
        const totalDeficit = deficits.reduce((sum, r) => sum + r.difference, 0)

        recommendations.forEach(rec => {
            if (rec.difference > 0) {
                // Distribute proportionally to the size of the hole
                // If we have 10k to invest, and total deficit is 20k.
                // Fund A needs 5k (25% of deficit). We give it 2.5k.
                // This brings everyone closer to target uniformly.

                if (totalDeficit > 0) {
                    const share = rec.difference / totalDeficit
                    rec.amount = amount * share
                    rec.action = "BUY"
                } else {
                    // If no deficits (everyone is overweight?? rare if we are adding money), 
                    // just distribute by target %
                    rec.amount = amount * (rec.percentage / 100)
                    rec.action = "BUY"
                }
            } else {
                // Fund is already overweight, don't buy more
                rec.amount = 0
                rec.action = "KEEP"
            }
        })

    } else {
        // REDEEM (Only Sell)
        // Priority: Sell from OVERWEIGHT funds first
        // If no overweight funds, sell proportionally from all existing funds

        let remainingAmount = amount

        // We look for negative differences (Surpluses = Overweight)
        const surpluses = recommendations.filter(r => r.difference < 0 && r.currentValue > 0)
        const totalSurplus = surpluses.reduce((sum, r) => sum + Math.abs(r.difference), 0)

        // Check if we have enough overweight to sell
        if (totalSurplus >= amount) {
            // Sell only from overweight funds
            recommendations.forEach(rec => {
                if (rec.difference < 0 && rec.currentValue > 0) {
                    const share = Math.abs(rec.difference) / totalSurplus
                    rec.amount = Math.min(amount * share, rec.currentValue) // Don't sell more than available
                    rec.action = "SELL"
                } else {
                    rec.amount = 0
                    rec.action = "KEEP"
                }
            })
        } else {
            // Not enough overweight funds - sell from ALL funds proportionally
            const fundsWithValue = recommendations.filter(r => r.currentValue > 0)
            const totalCurrent = fundsWithValue.reduce((sum, r) => sum + r.currentValue, 0)

            if (totalCurrent >= amount) {
                recommendations.forEach(rec => {
                    if (rec.currentValue > 0) {
                        // Distribute sale proportionally to current holdings
                        const share = rec.currentValue / totalCurrent
                        rec.amount = Math.min(amount * share, rec.currentValue)
                        rec.action = "SELL"
                    } else {
                        rec.amount = 0
                        rec.action = "KEEP"
                    }
                })
            } else {
                // Insufficient total balance for redemption
                recommendations.forEach(rec => {
                    rec.amount = 0
                    rec.action = "KEEP"
                })
            }
        }
    }

    // Sort by amount descending to show most important actions first
    return recommendations
        .filter(r => r.amount > 1) // Filter out negligible amounts (e.g. < R$ 1)
        .sort((a, b) => b.amount - a.amount)
}
