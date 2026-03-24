/**
 * Financial Planning Calculator
 * Handles real interest calculations, compound growth projections,
 * and alignment scoring for financial goals
 */

export interface FinancialPlan {
    currentValue: number          // Carteira + Reserva + Saldo atual
    monthlyContribution: number   // Aporte mensal pretendido
    investmentPeriod: number      // Prazo em anos
    nominalReturn: number         // Rentabilidade nominal anual %
    inflationRate: number         // Taxa de inflação (IPCA) %
    desiredLifestyleCost: number  // Custo de vida mensal desejado
}

export interface ProjectionResult {
    projectedValue: number
    requiredCapital: number
    projectedValueReal: number
    requiredCapitalReal: number
    alignmentScore: number
    gap: number // positive = surplus, negative = deficit
    monthlyData: MonthlyProjection[]
    recommendation: string
    requiredMonthlyContribution: number // Aporte ideal para fechar o gap
}

export interface MonthlyProjection {
    month: number
    year: number
    valueNominal: number
    valueReal: number
    contributions: number
    interestEarnedNominal: number
    interestEarnedReal: number
}

/**
 * Calculate real interest rate adjusted for inflation
 * Formula: ((1 + nominal) / (1 + inflation)) - 1
 */
export function calculateRealReturn(nominalRate: number, inflationRate: number): number {
    return (((1 + nominalRate / 100) / (1 + inflationRate / 100)) - 1) * 100
}

/**
 * Calculate future value using compound interest
 * FV = PV × (1 + r)^n + PMT × [((1 + r)^n - 1) / r]
 */
export function calculateFutureValue(
    presentValue: number,
    monthlyPayment: number,
    monthlyRate: number,
    months: number
): number {
    const r = monthlyRate / 100
    const pvFuture = presentValue * Math.pow(1 + r, months)
    const pmtFuture = monthlyPayment * ((Math.pow(1 + r, months) - 1) / r)

    return pvFuture + pmtFuture
}

/**
 * Calculate required capital to sustain desired lifestyle
 * Using 4% rule (safe withdrawal rate)
 */
export function calculateRequiredCapital(monthlyLifestyleCost: number): number {
    const annualCost = monthlyLifestyleCost * 12
    return annualCost / 0.04
}

/**
 * Generate month-by-month projection data
 */
export function generateMonthlyProjections(
    plan: FinancialPlan
): MonthlyProjection[] {
    // Nominal Rates
    const nominalRate = plan.nominalReturn
    const monthlyRateNominal = (Math.pow(1 + nominalRate / 100, 1 / 12) - 1) * 100

    // Real Rates
    const realReturn = calculateRealReturn(plan.nominalReturn, plan.inflationRate)
    const monthlyRateReal = (Math.pow(1 + realReturn / 100, 1 / 12) - 1) * 100

    const totalMonths = plan.investmentPeriod * 12

    const projections: MonthlyProjection[] = []
    let currentValueNominal = plan.currentValue
    let currentValueReal = plan.currentValue
    let totalContributions = 0

    for (let month = 0; month <= totalMonths; month++) {
        const year = Math.floor(month / 12)

        projections.push({
            month,
            year,
            valueNominal: currentValueNominal,
            valueReal: currentValueReal,
            contributions: totalContributions,
            interestEarnedNominal: currentValueNominal - plan.currentValue - totalContributions,
            interestEarnedReal: currentValueReal - plan.currentValue - totalContributions
        })

        // Apply monthly interest
        const interestEarnedNominal = currentValueNominal * (monthlyRateNominal / 100)
        currentValueNominal += interestEarnedNominal

        const interestEarnedReal = currentValueReal * (monthlyRateReal / 100)
        currentValueReal += interestEarnedReal

        // Add monthly contribution (except on last month)
        if (month < totalMonths) {
            currentValueNominal += plan.monthlyContribution
            currentValueReal += plan.monthlyContribution
            totalContributions += plan.monthlyContribution
        }
    }

    return projections
}

/**
 * Calculate alignment score (0-100%+)
 * Score = (Projected Value / Required Capital) × 100
 */
export function calculateAlignmentScore(
    projectedValue: number,
    requiredCapital: number
): number {
    return Math.round((projectedValue / requiredCapital) * 100)
}

/**
 * Generate recommendation based on alignment score
 */
export function generateRecommendation(score: number, gap: number): string {
    if (score >= 100) {
        return `Parabéns! Seu planejamento está alinhado. Você terá um surplus de ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(gap)}.`
    } else if (score >= 80) {
        return `Quase lá! Você está ${score}% alinhado. Considere aumentar o aporte mensal ou o prazo para fechar o gap de ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Math.abs(gap))}.`
    } else if (score >= 60) {
        return `Atenção! Você precisa ajustar seu plano. Falta ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Math.abs(gap))} para atingir sua meta.`
    } else if (score >= 40) {
        return `Replanejamento necessário. Considere aumentar significativamente seus aportes ou estender o prazo de investimento.`
    } else {
        return `Seu plano atual está muito distante da meta. Recomendamos rever: prazo, aportes mensais, ou ajustar o custo de vida desejado.`
    }
}

/**
 * Main function: Project portfolio growth and calculate alignment
 */
export function projectFinancialPlan(plan: FinancialPlan): ProjectionResult {
    // Nominal Calculation
    const nominalRate = plan.nominalReturn
    const monthlyRateNominal = (Math.pow(1 + nominalRate / 100, 1 / 12) - 1) * 100
    const totalMonths = plan.investmentPeriod * 12

    const projectedValueNominal = calculateFutureValue(
        plan.currentValue,
        plan.monthlyContribution,
        monthlyRateNominal,
        totalMonths
    )

    // Real Calculation
    const realReturn = calculateRealReturn(plan.nominalReturn, plan.inflationRate)
    const monthlyRateReal = (Math.pow(1 + realReturn / 100, 1 / 12) - 1) * 100

    const projectedValueReal = calculateFutureValue(
        plan.currentValue,
        plan.monthlyContribution,
        monthlyRateReal,
        totalMonths
    )

    // Required Capital
    // Nominal: Inflated lifestyle cost
    const futureLifestyleCostNominal = plan.desiredLifestyleCost * Math.pow(1 + plan.inflationRate / 100, plan.investmentPeriod)
    const requiredCapitalNominal = calculateRequiredCapital(futureLifestyleCostNominal)

    // Real: Constant lifestyle cost (today's money)
    const requiredCapitalReal = calculateRequiredCapital(plan.desiredLifestyleCost)

    // We use Nominal for the main alignment score as it's the default view
    const alignmentScore = calculateAlignmentScore(projectedValueNominal, requiredCapitalNominal)
    const gap = projectedValueNominal - requiredCapitalNominal

    // Generate monthly projections (Both)
    const monthlyData = generateMonthlyProjections(plan)

    // Calculate the required monthly PMT to hit the goal exactly
    let requiredMonthlyContribution = plan.monthlyContribution;
    if (requiredCapitalNominal > 0 && monthlyRateNominal > 0 && totalMonths > 0) {
        const r = monthlyRateNominal / 100;
        const n = totalMonths;
        const pv = plan.currentValue;
        const fv = requiredCapitalNominal;

        const idealPmt = (fv - pv * Math.pow(1 + r, n)) * (r / (Math.pow(1 + r, n) - 1));
        requiredMonthlyContribution = idealPmt > 0 ? idealPmt : 0;
    }

    // Generate recommendation
    const recommendation = generateRecommendation(alignmentScore, gap)

    return {
        projectedValue: projectedValueNominal, // Default to nominal for backward compatibility
        requiredCapital: requiredCapitalNominal, // Default to nominal
        projectedValueReal, // New field
        requiredCapitalReal, // New field
        alignmentScore,
        gap,
        monthlyData,
        recommendation,
        requiredMonthlyContribution
    }
}

/**
 * Helper: Get alignment label and color
 */
export function getAlignmentLabel(score: number): { label: string; color: string } {
    if (score >= 100) return { label: "Superavitário", color: "text-green-600 dark:text-green-400" }
    if (score >= 80) return { label: "Bem Alinhado", color: "text-blue-600 dark:text-blue-400" }
    if (score >= 60) return { label: "Parcialmente Alinhado", color: "text-yellow-600 dark:text-yellow-400" }
    if (score >= 40) return { label: "Desalinhado", color: "text-orange-600 dark:text-orange-400" }
    return { label: "Muito Desalinhado", color: "text-red-600 dark:text-red-400" }
}
