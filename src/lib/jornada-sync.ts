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

    // 1. Renda / Entradas (suporta categorias detalhadas e legadas)
    let rendaTotal = 0
    const clt = parseCurrency(formData.rendaClt)
    const proLabore = parseCurrency(formData.rendaProLabore)
    const lucros = parseCurrency(formData.rendaLucrosDividendos)
    const alugueis = parseCurrency(formData.rendaAlugueis)
    const proventos = parseCurrency(formData.rendaInvestimentos)
    const pensao = parseCurrency(formData.rendaPensaoAposentadoria)
    const extra = parseCurrency(formData.rendaExtraFreelance)

    let customIncomesTotal = 0
    if (formData.customIncomesJson) {
        try {
            const parsedIncomes = typeof formData.customIncomesJson === "string"
                ? JSON.parse(formData.customIncomesJson)
                : formData.customIncomesJson
            if (Array.isArray(parsedIncomes)) {
                customIncomesTotal = parsedIncomes.reduce((sum: number, it: any) => sum + parseCurrency(it.valor || it.value), 0)
            }
        } catch (e) {}
    }

    const classifiedTotal = clt + proLabore + lucros + alugueis + proventos + pensao + extra + customIncomesTotal
    if (classifiedTotal > 0) {
        rendaTotal = classifiedTotal
    } else {
        const salario = parseCurrency(formData.salarioLiquido)
        const variavel = parseCurrency(formData.rendaVariavel)
        rendaTotal = salario + variavel
    }

    // 2. Gastos / Despesas (suporta cesta detalhada, grupos ampliados e legados)
    let gastoTotal = 0
    let detailedExpensesSum = 0

    // Soma das chaves diretas da cesta IBGE (gasto_aluguel, gasto_supermercado, etc.)
    let basketExpensesSum = 0
    Object.keys(formData).forEach((k) => {
        if (k.startsWith("gasto_") && formData[k]) {
            basketExpensesSum += parseCurrency(formData[k])
        }
    })

    if (formData.gastosDetalhadosJson) {
        try {
            const parsedG = typeof formData.gastosDetalhadosJson === "string"
                ? JSON.parse(formData.gastosDetalhadosJson)
                : formData.gastosDetalhadosJson
            if (parsedG && typeof parsedG === "object") {
                Object.values(parsedG).forEach((val: any) => {
                    detailedExpensesSum += parseCurrency(val)
                })
            }
        } catch (e) {}
    }

    let customExpensesTotal = 0
    if (formData.customExpensesJson) {
        try {
            const parsed = typeof formData.customExpensesJson === "string" 
                ? JSON.parse(formData.customExpensesJson) 
                : formData.customExpensesJson
            if (Array.isArray(parsed)) {
                customExpensesTotal = parsed.reduce((sum: number, it: any) => sum + parseCurrency(it.value || it.valor), 0)
            }
        } catch (e) {}
    }

    if (basketExpensesSum > 0) {
        gastoTotal = basketExpensesSum + customExpensesTotal
    } else if (detailedExpensesSum > 0) {
        gastoTotal = detailedExpensesSum + customExpensesTotal
    } else {
        const moradia = parseCurrency(formData.gastoMoradia)
        const alimentacao = parseCurrency(formData.gastoAlimentacao)
        const transporte = parseCurrency(formData.gastoTransporte)
        const saude = parseCurrency(formData.gastoSaude)
        const educacao = parseCurrency(formData.gastoEducacao)
        const comunicacao = parseCurrency(formData.gastoComunicacao)
        const estiloVida = parseCurrency(formData.gastoEstiloVida || formData.gastoLazer)
        const artigos = parseCurrency(formData.gastoArtigos)
        const dividasParcela = parseCurrency(formData.parcelasDividas || formData.gastoDividas)

        let customExpensesTotal = 0
        if (formData.customExpensesJson) {
            try {
                const parsed = typeof formData.customExpensesJson === "string" 
                    ? JSON.parse(formData.customExpensesJson) 
                    : formData.customExpensesJson
                if (Array.isArray(parsed)) {
                    customExpensesTotal = parsed.reduce((sum: number, it: any) => sum + parseCurrency(it.value || it.valor), 0)
                }
            } catch (e) {}
        }

        gastoTotal = moradia + alimentacao + transporte + saude + educacao + comunicacao + estiloVida + artigos + dividasParcela + customExpensesTotal
    }

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
        "ABRIGO": 13.9,
        "RITMO": 14.8,
        "VISAO": 17.2,
        "VISÃO": 17.2,
        "OCEANO": 21.5,
    }
    const expectedReturn = returnByProfile[profile] || 14.8

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
