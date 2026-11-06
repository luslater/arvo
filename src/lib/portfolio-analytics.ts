import { HISTORICAL_DATA } from "@/data/historicalData"
import diagData from "@/data/diagnostic-data.json"
import { RECOMMENDED_PORTFOLIOS, ASSET_METRICS, type RecommendedPortfolio } from "@/data/portfoliosData"

export interface MonthlyReturnCell {
    monthIndex: number
    monthNumber: number // 1..12
    monthLabel: string // "Jan", "Fev", ...
    returnPct: number | null
    cdiPct: number | null
    pctOfCdi: number | null
}

export interface YearRow {
    year: number
    months: (MonthlyReturnCell | null)[] // length 12
    ytdReturn: number
    ytdCdi: number
    ytdPctOfCdi: number | null
    accumReturn: number
    accumCdi: number
    accumPctOfCdi: number | null
}

export interface WindowMetric {
    key: string
    label: string
    monthsCount: number
    portfolioReturn: number
    cdiReturn: number
    ipcaReturn: number
    pctOfCdi: number | null
    annualizedReturn: number
    annualizedCdi: number
    annualizedVol: number
    sharpeRatio: number | null
}

export interface ConsistencyStats {
    totalMonths: number
    positiveMonths: number
    positiveMonthsPct: number
    negativeMonths: number
    negativeMonthsPct: number
    aboveCdiMonths: number
    aboveCdiMonthsPct: number
    belowCdiMonths: number
    belowCdiMonthsPct: number
    bestMonth: { value: number; label: string }
    worstMonth: { value: number; label: string }
    maxDrawdown: number
    avgMonthlyReturn: number
    annualizedNominal: number
    annualizedReal: number
}

export interface ChartPoint {
    date: string
    label: string
    portfolio: number
    cdi: number
    ipca: number
    ibov: number
}

export interface PortfolioAssetDetail {
    name: string
    weight: number // 0..100
    gestora: string
    classe: "Zaga" | "Meio" | "Ataque" | string
    macroClass: string
    expectedReturn: number
    volatility: number
}

export const MONTH_NAMES_PT = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez"
]

// Helper: compound return over an array of decimal returns
export function compoundReturn(rates: number[]): number {
    if (!rates.length) return 0
    let factor = 1
    for (const r of rates) {
        factor *= (1 + (r || 0))
    }
    return factor - 1
}

// Helper: annualized return given cumulative return and number of months
export function annualizeReturn(cumulativeReturn: number, months: number): number {
    if (months <= 0) return 0
    return Math.pow(1 + cumulativeReturn, 12 / months) - 1
}

// Helper: sample standard deviation
export function sampleStdDev(values: number[]): number {
    if (values.length <= 1) return 0
    const mean = values.reduce((acc, v) => acc + v, 0) / values.length
    const variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (values.length - 1)
    return Math.sqrt(variance)
}

// Helper: Max Drawdown
export function calculateMaxDrawdown(returns: number[]): number {
    let cum = 1
    let peak = 1
    let maxDD = 0
    for (const r of returns) {
        cum *= (1 + (r || 0))
        if (cum > peak) peak = cum
        const dd = (cum - peak) / peak
        if (dd < maxDD) maxDD = dd
    }
    return maxDD * 100 // in %
}

// Get raw months and benchmarks from HISTORICAL_DATA
export function getHistoricalMeta() {
    return {
        months: HISTORICAL_DATA.months,
        cdi: HISTORICAL_DATA.cdi,
        ipca: HISTORICAL_DATA.ipca,
        ibov: HISTORICAL_DATA.ibov,
        dolar: HISTORICAL_DATA.dolar,
        totalMonths: HISTORICAL_DATA.months.length,
        startMonth: HISTORICAL_DATA.months[0],
        endMonth: HISTORICAL_DATA.months[HISTORICAL_DATA.months.length - 1]
    }
}

// Build matrix of returns per year (2026, 2025, 2024, 2023)
export function calculateYearlyMonthlyMatrix(
    returns: number[],
    months: string[] = HISTORICAL_DATA.months,
    cdi: number[] = HISTORICAL_DATA.cdi
): YearRow[] {
    const years = [2026, 2025, 2024, 2023]
    const rows: YearRow[] = []

    for (const year of years) {
        const monthCells: (MonthlyReturnCell | null)[] = []
        const yearReturns: number[] = []
        const yearCdi: number[] = []

        // Find all indices up to end of this year for accumulation
        let lastIndexThisYear = -1

        for (let m = 1; m <= 12; m++) {
            const mStr = m.toString().padStart(2, "0")
            const dateStr = `${year}-${mStr}`
            const idx = months.indexOf(dateStr)

            if (idx >= 0 && idx < returns.length) {
                lastIndexThisYear = Math.max(lastIndexThisYear, idx)
                const rVal = returns[idx]
                const cVal = cdi[idx]
                yearReturns.push(rVal)
                yearCdi.push(cVal)

                const pctOfCdi = cVal !== 0 ? (rVal / cVal) * 100 : null

                monthCells.push({
                    monthIndex: idx,
                    monthNumber: m,
                    monthLabel: MONTH_NAMES_PT[m - 1],
                    returnPct: rVal * 100,
                    cdiPct: cVal * 100,
                    pctOfCdi
                })
            } else {
                monthCells.push(null)
            }
        }

        // YTD for this year
        const ytdReturn = compoundReturn(yearReturns) * 100
        const ytdCdi = compoundReturn(yearCdi) * 100
        const ytdPctOfCdi = ytdCdi !== 0 ? (ytdReturn / ytdCdi) * 100 : null

        // Accumulated from start (Jan/2023) up to the end of this year (or current available month)
        let accumReturn = 0
        let accumCdi = 0
        let accumPctOfCdi: number | null = null

        if (lastIndexThisYear >= 0) {
            const upToReturns = returns.slice(0, lastIndexThisYear + 1)
            const upToCdi = cdi.slice(0, lastIndexThisYear + 1)
            accumReturn = compoundReturn(upToReturns) * 100
            accumCdi = compoundReturn(upToCdi) * 100
            accumPctOfCdi = accumCdi !== 0 ? (accumReturn / accumCdi) * 100 : null
        }

        rows.push({
            year,
            months: monthCells,
            ytdReturn,
            ytdCdi,
            ytdPctOfCdi,
            accumReturn,
            accumCdi,
            accumPctOfCdi
        })
    }

    return rows
}

// Calculate window metrics (No Mês, No Ano, 3M, 6M, 12M, 24M, 36M, No Período)
export function calculateWindowMetrics(
    returns: number[],
    months: string[] = HISTORICAL_DATA.months,
    cdi: number[] = HISTORICAL_DATA.cdi,
    ipca: number[] = HISTORICAL_DATA.ipca
): WindowMetric[] {
    const totalN = returns.length
    if (totalN === 0) return []

    // Current year months count (2026)
    const currentYear = 2026
    const ytdCount = months.filter(m => m.startsWith(`${currentYear}-`)).length

    const definitions = [
        { key: "1M", label: "No Mês (Out/26)", count: 1 },
        { key: "YTD", label: "No Ano (2026)", count: ytdCount },
        { key: "3M", label: "3 Meses", count: 3 },
        { key: "6M", label: "6 Meses", count: 6 },
        { key: "12M", label: "12 Meses", count: 12 },
        { key: "24M", label: "24 Meses", count: 24 },
        { key: "36M", label: "36 Meses", count: 36 },
        { key: "TOTAL", label: `No Período (${totalN}M)`, count: totalN }
    ]

    return definitions.map(def => {
        const count = Math.min(def.count, totalN)
        const sliceReturns = returns.slice(totalN - count)
        const sliceCdi = cdi.slice(totalN - count)
        const sliceIpca = ipca.slice(totalN - count)

        const portComp = compoundReturn(sliceReturns)
        const cdiComp = compoundReturn(sliceCdi)
        const ipcaComp = compoundReturn(sliceIpca)

        const portPct = portComp * 100
        const cdiPct = cdiComp * 100
        const ipcaPct = ipcaComp * 100

        const pctOfCdi = cdiPct !== 0 ? (portPct / cdiPct) * 100 : null

        // Annualized return
        const annPort = annualizeReturn(portComp, count) * 100
        const annCdi = annualizeReturn(cdiComp, count) * 100

        // Annualized Volatility
        const std = sampleStdDev(sliceReturns)
        const annVol = std * Math.sqrt(12) * 100

        // Sharpe Ratio (excess return over CDI / annualized vol)
        let sharpeRatio: number | null = null
        if (annVol > 0.05 && count >= 3) {
            sharpeRatio = (annPort - annCdi) / annVol
        }

        return {
            key: def.key,
            label: def.label,
            monthsCount: count,
            portfolioReturn: portPct,
            cdiReturn: cdiPct,
            ipcaReturn: ipcaPct,
            pctOfCdi,
            annualizedReturn: annPort,
            annualizedCdi: annCdi,
            annualizedVol: annVol,
            sharpeRatio
        }
    })
}

// Calculate consistency and risk statistics
export function calculateConsistencyStats(
    returns: number[],
    months: string[] = HISTORICAL_DATA.months,
    cdi: number[] = HISTORICAL_DATA.cdi,
    ipcaAnnual: number = 0.0468
): ConsistencyStats {
    const totalMonths = returns.length
    if (totalMonths === 0) {
        return {
            totalMonths: 0,
            positiveMonths: 0,
            positiveMonthsPct: 0,
            negativeMonths: 0,
            negativeMonthsPct: 0,
            aboveCdiMonths: 0,
            aboveCdiMonthsPct: 0,
            belowCdiMonths: 0,
            belowCdiMonthsPct: 0,
            bestMonth: { value: 0, label: "-" },
            worstMonth: { value: 0, label: "-" },
            maxDrawdown: 0,
            avgMonthlyReturn: 0,
            annualizedNominal: 0,
            annualizedReal: 0
        }
    }

    let positiveCount = 0
    let aboveCdiCount = 0
    let bestVal = -Infinity
    let bestIdx = 0
    let worstVal = Infinity
    let worstIdx = 0
    let sumReturns = 0

    returns.forEach((r, idx) => {
        sumReturns += r
        if (r >= 0) positiveCount++
        if (r >= (cdi[idx] || 0)) aboveCdiCount++

        if (r > bestVal) {
            bestVal = r
            bestIdx = idx
        }
        if (r < worstVal) {
            worstVal = r
            worstIdx = idx
        }
    })

    const negativeCount = totalMonths - positiveCount
    const belowCdiCount = totalMonths - aboveCdiCount

    const formatMonthLabel = (idx: number) => {
        if (idx < 0 || idx >= months.length) return "-"
        const [year, month] = months[idx].split("-")
        const mNum = parseInt(month, 10)
        return `${MONTH_NAMES_PT[mNum - 1]}/${year}`
    }

    const totalComp = compoundReturn(returns)
    const annualizedNominal = annualizeReturn(totalComp, totalMonths) * 100
    const annualizedReal = (((1 + annualizedNominal / 100) / (1 + ipcaAnnual)) - 1) * 100

    return {
        totalMonths,
        positiveMonths: positiveCount,
        positiveMonthsPct: (positiveCount / totalMonths) * 100,
        negativeMonths: negativeCount,
        negativeMonthsPct: (negativeCount / totalMonths) * 100,
        aboveCdiMonths: aboveCdiCount,
        aboveCdiMonthsPct: (aboveCdiCount / totalMonths) * 100,
        belowCdiMonths: belowCdiCount,
        belowCdiMonthsPct: (belowCdiCount / totalMonths) * 100,
        bestMonth: {
            value: bestVal * 100,
            label: formatMonthLabel(bestIdx)
        },
        worstMonth: {
            value: worstVal * 100,
            label: formatMonthLabel(worstIdx)
        },
        maxDrawdown: calculateMaxDrawdown(returns),
        avgMonthlyReturn: (sumReturns / totalMonths) * 100,
        annualizedNominal,
        annualizedReal
    }
}

// Generate cumulative series for chart comparison
export function generateCumulativeSeries(
    returns: number[],
    months: string[] = HISTORICAL_DATA.months,
    cdi: number[] = HISTORICAL_DATA.cdi,
    ipca: number[] = HISTORICAL_DATA.ipca,
    ibov: number[] = HISTORICAL_DATA.ibov,
    windowMonths: number = 0 // 0 means all
): ChartPoint[] {
    const totalN = returns.length
    const startIndex = windowMonths > 0 ? Math.max(0, totalN - windowMonths) : 0

    let pCum = 1
    let cCum = 1
    let iCum = 1
    let bCum = 1

    const points: ChartPoint[] = []

    for (let i = startIndex; i < totalN; i++) {
        pCum *= (1 + (returns[i] || 0))
        cCum *= (1 + (cdi[i] || 0))
        iCum *= (1 + (ipca[i] || 0))
        bCum *= (1 + (ibov[i] || 0))

        const [y, m] = months[i].split("-")
        const label = `${MONTH_NAMES_PT[parseInt(m, 10) - 1]}/${y.slice(2)}`

        points.push({
            date: months[i],
            label,
            portfolio: parseFloat(((pCum - 1) * 100).toFixed(2)),
            cdi: parseFloat(((cCum - 1) * 100).toFixed(2)),
            ipca: parseFloat(((iCum - 1) * 100).toFixed(2)),
            ibov: parseFloat(((bCum - 1) * 100).toFixed(2))
        })
    }

    return points
}

// Get portfolio assets detail with weights, managers and ARVO class
export function getPortfolioAssets(rec: RecommendedPortfolio): PortfolioAssetDetail[] {
    const fundMap: Record<string, any> = {}
    HISTORICAL_DATA.funds.forEach(f => {
        fundMap[f.name.toLowerCase()] = f
    })

    return Object.entries(rec.weights).map(([assetName, weight]) => {
        const lowerName = assetName.toLowerCase()
        const fund = fundMap[lowerName] || HISTORICAL_DATA.funds.find(f =>
            f.name.toLowerCase().includes(lowerName) || lowerName.includes(f.name.toLowerCase())
        )

        const metric = ASSET_METRICS[assetName] || Object.entries(ASSET_METRICS).find(([k]) =>
            k.toLowerCase().includes(lowerName) || lowerName.includes(k.toLowerCase())
        )?.[1]

        let classe = fund?.classe || "Meio"
        if (assetName.includes("Selic") || assetName.includes("Simples") || assetName.includes("CDI")) {
            classe = "Zaga"
        } else if (assetName.includes("Ações") || assetName.includes("FIA") || assetName.includes("IVVB") || assetName.includes("NASD") || assetName.includes("WRLD") || assetName.includes("DIVO")) {
            classe = "Ataque"
        }

        const macroClass = fund?.macroClass || (
            classe === "Zaga" ? "Pós-Fixado" :
            classe === "Ataque" ? "Renda Variável / Global" : "Crédito Privado / Multimercado"
        )

        return {
            name: assetName,
            weight: weight * 100,
            gestora: fund?.gestora || "ARVO Gestão",
            classe,
            macroClass,
            expectedReturn: metric?.expectedReturn || 13.0,
            volatility: metric?.volatility || 1.0
        }
    }).sort((a, b) => b.weight - a.weight)
}

// Get portfolio data by family and profile
export function getPortfolioByFamilyAndProfile(family: string, profile: string) {
    // 1. Search in diagnostic-data.json
    const diagPortfolio = diagData.portfolios.find(p =>
        p.family.toLowerCase() === family.toLowerCase() &&
        p.name.toLowerCase() === profile.toLowerCase()
    )

    // 2. Search in RECOMMENDED_PORTFOLIOS
    const recPortfolio = RECOMMENDED_PORTFOLIOS.find(r => {
        const familyMatch =
            family === "Geral Light" ? r.tier === "Light" && r.itype === "Geral" :
            family === "Geral" ? r.tier === "Normal" && r.itype === "Geral" :
            r.itype === "IQ"

        return familyMatch && r.perfil.toLowerCase() === profile.toLowerCase()
    })

    return {
        diag: diagPortfolio,
        rec: recPortfolio
    }
}
