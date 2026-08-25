/**
 * Calculador de Suitability & Perfil de Investidor ARVO
 * 
 * Avalia 4 dimensões fundamentais com base na regulamentação CVM e metodologia de suitability fee-only:
 * 1. Tolerância Emocional ao Risco (Reação a perdas e volatilidade)
 * 2. Horizonte de Investimento (Tempo de permanência do capital)
 * 3. Necessidade de Liquidez (Fração que pode ser resgatada em 12 meses)
 * 4. Experiência e Conhecimento de Mercado (Instrumentos já operados)
 */

export type InvestorProfileType = "ABRIGO" | "RITMO" | "VISÃO" | "OCEANO";

export interface SuitabilityDimensionScore {
    name: string;
    score: number; // 0 a 100
    description: string;
}

export interface SuitabilityDiagnosticResult {
    profile: InvestorProfileType;
    label: string;
    totalScore: number;
    maxScore: number;
    answeredQuestionsCount: number;
    totalQuestions: number;
    isComplete: boolean;
    dimensions: {
        toleranciaRisco: SuitabilityDimensionScore;
        horizonteTempo: SuitabilityDimensionScore;
        necessidadeLiquidez: SuitabilityDimensionScore;
        experienciaMercado: SuitabilityDimensionScore;
    };
    description: string;
    recommendedAssetAllocation: {
        rfPosFixada: number;
        rfIpca: number;
        rfPre: number;
        fiis: number;
        acoesBrasil: number;
        internacional: number;
    };
}

export const PROFILE_ALLOCATIONS: Record<InvestorProfileType, {
    label: string;
    description: string;
    expectedNominalReturn: number;
    allocation: {
        rfPosFixada: number;
        rfIpca: number;
        rfPre: number;
        fiis: number;
        acoesBrasil: number;
        internacional: number;
    };
}> = {
    ABRIGO: {
        label: "Abrigo (Conservador)",
        description: "Foco absoluto em segurança, liquidez diária e preservação de capital. Baixíssima tolerância a oscilações negativas.",
        expectedNominalReturn: 13.9,
        allocation: {
            rfPosFixada: 60,
            rfIpca: 25,
            rfPre: 5,
            fiis: 5,
            acoesBrasil: 5,
            internacional: 0
        }
    },
    RITMO: {
        label: "Ritmo (Moderado)",
        description: "Equilíbrio entre segurança e proteção real contra a inflação (IPCA+), aceitando pequenas oscilações de curto prazo em busca de ganho real.",
        expectedNominalReturn: 14.8,
        allocation: {
            rfPosFixada: 30,
            rfIpca: 30,
            rfPre: 10,
            fiis: 15,
            acoesBrasil: 10,
            internacional: 5
        }
    },
    "VISÃO": {
        label: "Visão (Arrojado)",
        description: "Crescimento patrimonial consistente no longo prazo, combinando renda fixa estratégica com ações, fundos imobiliários e exposição internacional.",
        expectedNominalReturn: 17.2,
        allocation: {
            rfPosFixada: 20,
            rfIpca: 20,
            rfPre: 5,
            fiis: 20,
            acoesBrasil: 20,
            internacional: 15
        }
    },
    OCEANO: {
        label: "Oceano (Agressivo)",
        description: "Máximo potencial de valorização a longo prazo com exposição ampla a renda variável, ativos globais e teses assimétricas, tolerando alta volatilidade.",
        expectedNominalReturn: 21.5,
        allocation: {
            rfPosFixada: 10,
            rfIpca: 15,
            rfPre: 0,
            fiis: 20,
            acoesBrasil: 30,
            internacional: 25
        }
    }
};

export function calculateInvestorProfile(formData: Record<string, string>): InvestorProfileType {
    let score = 0;
    
    // 1. Experiência (0 - 30)
    const exp = formData.perfil_experiencia || formData.experienciaInvestimentos || "";
    if (exp.includes("Ações") || exp.includes("Avançado") || exp.includes("Mais de 5 anos")) score += 30;
    else if (exp.includes("Diversifico") || exp.includes("Intermediário") || exp.includes("FIIs") || exp.includes("3 a 5 anos")) score += 20;
    else if (exp.includes("Renda Fixa") || exp.includes("Básico") || exp.includes("1 a 3 anos")) score += 10;
    else score += 0;

    // 2. Reação à queda (0 - 30)
    const queda = formData.perfil_reacao_queda || formData.reacaoQueda || "";
    if (queda.includes("Compraria mais") || queda.includes("oportunidade") || queda.includes("investir mais")) score += 30;
    else if (queda.includes("Manter") || queda.includes("faz parte") || queda.includes("manteria o plano")) score += 20;
    else if (queda.includes("desconfortável") || queda.includes("transferiria") || queda.includes("Venderia")) score += 10;
    else score += 0;

    // 3. Objetivo (0 - 30)
    const obj = formData.perfil_objetivo || formData.objetivoPrincipal || "";
    if (obj.includes("Maximizar") || obj.includes("Agressivo") || obj.includes("alta volatilidade")) score += 30;
    else if (obj.includes("Crescimento") || obj.includes("Crescer") || obj.includes("longo prazo")) score += 20;
    else if (obj.includes("inflação") || obj.includes("Renda extra") || obj.includes("estabilidade") || obj.includes("baixo risco")) score += 10;
    else score += 0;

    // 4. Horizonte (0 - 30)
    const horiz = formData.perfil_horizonte || formData.horizonteTempo || "";
    if (horiz.includes("Mais de 7") || horiz.includes("Mais de 10 anos")) score += 30;
    else if (horiz.includes("3 a 7") || horiz.includes("5 a 10 anos") || horiz.includes("3 a 5 anos") || horiz.includes("2 a 5")) score += 20;
    else if (horiz.includes("1 a 3") || horiz.includes("Menos de 2")) score += 10;
    else score += 0;

    // 5. Liquidez (0 - 30)
    const liq = formData.perfil_liquidez || "";
    if (liq.includes("Menos de 10%") || liq.includes("separada")) score += 30;
    else if (liq.includes("10% e 20%")) score += 20;
    else if (liq.includes("20% e 50%")) score += 10;
    else score += 0;

    // 6. Perdas / Tolerância (0 - 30)
    const perdas = formData.perfil_perdas || "";
    if (perdas.includes("máxima") || perdas.includes("severas")) score += 30;
    else if (perdas.includes("expressivos") || perdas.includes("temporárias") || perdas.includes("volatilidade") || perdas.includes("valorização expressiva")) score += 20;
    else if (perdas.includes("pequenas") || perdas.includes("CDI")) score += 10;
    else score += 0;

    if (score >= 120) return "OCEANO";
    if (score >= 75) return "VISÃO";
    if (score >= 35) return "RITMO";
    return "ABRIGO";
}

export function getSuitabilityDiagnostic(formData: Record<string, string>): SuitabilityDiagnosticResult {
    const requiredQuestions = [
        "perfil_experiencia",
        "perfil_reacao_queda",
        "perfil_objetivo",
        "perfil_horizonte",
        "perfil_liquidez",
        "perfil_perdas"
    ];

    const answeredCount = requiredQuestions.filter(q => Boolean(formData[q])).length;
    const isComplete = answeredCount === requiredQuestions.length;
    const profile = calculateInvestorProfile(formData);
    const profileData = PROFILE_ALLOCATIONS[profile];

    // Scores por dimensões (normalizados 0 a 100)
    const exp = formData.perfil_experiencia || "";
    const expScore = (exp.includes("Avançado") ? 100 : exp.includes("Intermediário") ? 66 : exp.includes("Básico") ? 33 : 0);

    const queda = formData.perfil_reacao_queda || "";
    const perdas = formData.perfil_perdas || "";
    let riscoScore = 0;
    if (queda.includes("oportunidade") || queda.includes("investir mais")) riscoScore += 50;
    else if (queda.includes("manteria") || queda.includes("faz parte")) riscoScore += 35;
    else if (queda.includes("desconfortável") || queda.includes("transferiria")) riscoScore += 15;
    if (perdas.includes("máxima") || perdas.includes("severas")) riscoScore += 50;
    else if (perdas.includes("expressiva") || perdas.includes("temporárias")) riscoScore += 35;
    else if (perdas.includes("pequenas") || perdas.includes("CDI")) riscoScore += 15;

    const horiz = formData.perfil_horizonte || "";
    const horizScore = horiz.includes("Mais de 7") || horiz.includes("Mais de 10") ? 100 : horiz.includes("3 a 7") || horiz.includes("5 a 10") ? 66 : horiz.includes("1 a 3") ? 33 : 10;

    const liq = formData.perfil_liquidez || "";
    const liqScore = liq.includes("Menos de 10%") || liq.includes("separada") ? 100 : liq.includes("10% e 20%") ? 66 : liq.includes("20% e 50%") ? 33 : 10;

    return {
        profile,
        label: profileData.label,
        totalScore: Math.round((expScore + riscoScore + horizScore + liqScore) / 4),
        maxScore: 100,
        answeredQuestionsCount: answeredCount,
        totalQuestions: requiredQuestions.length,
        isComplete,
        dimensions: {
            toleranciaRisco: {
                name: "Tolerância Emocional ao Risco",
                score: Math.min(100, Math.round(riscoScore)),
                description: "Capacidade psicológica de manter a estratégia durante períodos de estresse e quedas nos mercados."
            },
            horizonteTempo: {
                name: "Horizonte Temporal",
                score: Math.min(100, Math.round(horizScore)),
                description: "Prazo de permanência dos recursos, permitindo maturação de ativos mais voláteis."
            },
            necessidadeLiquidez: {
                name: "Estabilidade de Liquidez",
                score: Math.min(100, Math.round(liqScore)),
                description: "Percentual do patrimônio que pode ser alocado sem necessidade de resgate imediato."
            },
            experienciaMercado: {
                name: "Experiência de Investimento",
                score: Math.min(100, Math.round(expScore)),
                description: "Conhecimento prático de produtos, dinâmica de risco e ciclos de mercado."
            }
        },
        description: profileData.description,
        recommendedAssetAllocation: profileData.allocation
    };
}
