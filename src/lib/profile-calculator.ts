export function calculateInvestorProfile(formData: Record<string, string>): "ABRIGO" | "RITMO" | "VISÃO" | "OCEANO" {
    let score = 0;
    
    // 1. Experiência
    const exp = formData.perfil_experiencia || formData.experienciaInvestimentos || "";
    if (exp.includes("Ações") || exp.includes("Mais de 5 anos") || exp.includes("Avançado")) score += 30;
    else if (exp.includes("Diversifico") || exp.includes("3 a 5 anos") || exp.includes("FIIs") || exp.includes("Intermediário")) score += 20;
    else if (exp.includes("Renda Fixa") || exp.includes("1 a 3 anos") || exp.includes("Básico")) score += 10;
    else score += 0;

    // 2. Reação à queda
    const queda = formData.perfil_reacao_queda || formData.reacaoQueda || "";
    if (queda.includes("Compraria mais") || queda.includes("oportunidade")) score += 30;
    else if (queda.includes("Manter") || queda.includes("Não faria nada") || queda.includes("faz parte")) score += 20;
    else if (queda.includes("desconfortável") || queda.includes("Venderia parte")) score += 10;
    else score += 0;

    // 3. Objetivo
    const obj = formData.perfil_objetivo || formData.objetivoPrincipal || "";
    if (obj.includes("Maximizar") || obj.includes("Agressivo") || obj.includes("alta volatilidade")) score += 30;
    else if (obj.includes("Crescimento") || obj.includes("Crescer") || obj.includes("longo prazo")) score += 20;
    else if (obj.includes("inflação") || obj.includes("Renda extra") || obj.includes("estabilidade") || obj.includes("baixo risco")) score += 10;
    else score += 0;

    // 4. Horizonte
    const horiz = formData.perfil_horizonte || formData.horizonteTempo || "";
    if (horiz.includes("Mais de 7") || horiz.includes("Mais de 10 anos")) score += 30;
    else if (horiz.includes("3 a 7") || horiz.includes("5 a 10 anos") || horiz.includes("3 a 5 anos") || horiz.includes("2 a 5")) score += 20;
    else if (horiz.includes("1 a 3") || horiz.includes("Menos de 2")) score += 10;
    else score += 0;

    // 5. Liquidez
    const liq = formData.perfil_liquidez || "";
    if (liq.includes("Menos de 10%") || liq.includes("separada")) score += 30;
    else if (liq.includes("10% e 20%")) score += 20;
    else if (liq.includes("20% e 50%")) score += 10;
    else score += 0;

    // 6. Perdas / Tolerância
    const perdas = formData.perfil_perdas || "";
    if (perdas.includes("máxima") || perdas.includes("severas")) score += 30;
    else if (perdas.includes("expressivos") || perdas.includes("temporárias") || perdas.includes("volatilidade")) score += 20;
    else if (perdas.includes("pequenas") || perdas.includes("CDI")) score += 10;
    else score += 0;

    if (score >= 120) return "OCEANO";
    if (score >= 75) return "VISÃO";
    if (score >= 35) return "RITMO";
    return "ABRIGO";
}
