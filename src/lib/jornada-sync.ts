import { calculateInvestorProfile } from "./profile-calculator"

export function parseCurrency(val?: string | number): number {
    if (typeof val === "number") return val
    if (!val) return 0
    const clean = val.toString().replace(/\D/g, "")
    if (!clean) return 0
    return parseInt(clean, 10) / 100
}

export interface ExtractedJornadaMetrics {
    totalPatrimonio: number
    reservaAtual: number
    reservaMeta: number
    aporteMensal: number
    expectedReturn: number
    desiredLifestyleCost: number
    investmentPeriod: number
    profile: string
    rendaTotal: number
    gastoTotal: number
    capacidadeInvestimento: number
}

export function extractMetricsFromJornada(formData?: Record<string, any> | null): ExtractedJornadaMetrics | null {
    if (!formData || typeof formData !== "object" || Object.keys(formData).length === 0) {
        return null
    }

    // 1. Renda
    const salario = parseCurrency(formData.salarioLiquido)
    const variavel = parseCurrency(formData.rendaVariavel)
    const rendaTotal = salario + variavel

    // 2. Gastos
    const moradia = parseCurrency(formData.gastoMoradia)
    const alimentacao = parseCurrency(formData.gastoAlimentacao)
    const transporte = parseCurrency(formData.gastoTransporte)
    const saude = parseCurrency(formData.gastoSaude)
    const dividasParcela = parseCurrency(formData.parcelasDividas)

    let customExpensesTotal = 0
    if (formData.customExpensesJson) {
        try {
            const parsed = typeof formData.customExpensesJson === "string" 
                ? JSON.parse(formData.customExpensesJson) 
                : formData.customExpensesJson
            if (Array.isArray(parsed)) {
                customExpensesTotal = parsed.reduce((sum: number, it: any) => sum + parseCurrency(it.value), 0)
            }
        } catch (e) {}
    }

    const gastoTotal = moradia + alimentacao + transporte + saude + dividasParcela + customExpensesTotal

    // 3. Capacidade de Aporte (Entradas - Saídas)
    const capacidadeInvestimento = Math.max(0, rendaTotal - gastoTotal)
    const aporteMensalInformado = parseCurrency(formData.aporteMensal)
    const aporteMensal = aporteMensalInformado > 0 ? aporteMensalInformado : capacidadeInvestimento

    // 4. Reserva de Emergência
    const reservaAtual = parseCurrency(formData.reservaAtual)
    const isVariavel = ["PJ", "Autônomo", "Empresário", "Misto"].includes(formData.tipoVinculo || "")
    const mesesMeta = isVariavel ? 12 : 6
    const reservaMeta = Math.max(1000, gastoTotal * mesesMeta)

    // 5. Patrimônio Total (Patrimônio Investido + Reserva Atual)
    const patrimonioInvestido = parseCurrency(formData.patrimonioInvestido)
    let totalPatrimonio = 0
    if (patrimonioInvestido > 0 && reservaAtual > 0) {
        // Se ambos foram preenchidos
        totalPatrimonio = patrimonioInvestido + reservaAtual
    } else if (patrimonioInvestido > 0) {
        totalPatrimonio = patrimonioInvestido
    } else if (reservaAtual > 0) {
        totalPatrimonio = reservaAtual
    }

    // 6. Perfil & Retorno Esperado
    const profile = calculateInvestorProfile(formData)
    const returnByProfile: Record<string, number> = {
        "ABRIGO": 10.5,
        "RITMO": 11.5,
        "VISAO": 13.0,
        "VISÃO": 13.0,
        "OCEANO": 14.5,
    }
    const expectedReturn = returnByProfile[profile] || 12

    // 7. Futuro & Aposentadoria
    const idadeAtual = parseInt(formData.idade || "35", 10) || 35
    const idadeIf = parseInt(formData.idadeIf || "60", 10) || 60
    const investmentPeriod = Math.max(1, idadeIf - idadeAtual)
    const rendaAposentadoria = parseCurrency(formData.rendaAposentadoria)
    const desiredLifestyleCost = rendaAposentadoria > 0 
        ? rendaAposentadoria 
        : (rendaTotal > 0 ? Math.round(rendaTotal * 0.8) : 12000)

    return {
        totalPatrimonio,
        reservaAtual,
        reservaMeta,
        aporteMensal,
        expectedReturn,
        desiredLifestyleCost,
        investmentPeriod,
        profile,
        rendaTotal,
        gastoTotal,
        capacidadeInvestimento
    }
}
