"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export function calculateInvestorProfile(formData: Record<string, string>): "ABRIGO" | "RITMO" | "VISÃO" | "OCEANO" {
    let score = 0;
    
    // 1. Experiência
    const exp = formData.perfil_experiencia || formData.experienciaInvestimentos || "";
    if (exp.includes("Ações") || exp.includes("Mais de 5 anos") || exp.includes("Avançado")) score += 30;
    else if (exp.includes("Diversifico") || exp.includes("3 a 5 anos") || exp.includes("FIIs")) score += 20;
    else if (exp.includes("Renda Fixa") || exp.includes("1 a 3 anos")) score += 10;
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
    else if (obj.includes("Crescimento") || obj.includes("Crescer no longo prazo")) score += 20;
    else if (obj.includes("inflação") || obj.includes("Renda extra") || obj.includes("estabilidade")) score += 10;
    else score += 0;

    // 4. Horizonte
    const horiz = formData.perfil_horizonte || formData.horizonteTempo || "";
    if (horiz.includes("Mais de 7") || horiz.includes("Mais de 10 anos")) score += 30;
    else if (horiz.includes("3 a 7") || horiz.includes("5 a 10 anos") || horiz.includes("3 a 5 anos")) score += 20;
    else if (horiz.includes("1 a 3") || horiz.includes("2 a 5 anos")) score += 10;
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

export async function saveJornadaProgress(formData: Record<string, string>, isCompleted: boolean) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user || !session.user.email) {
            throw new Error("Não autorizado")
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { profile: true }
        })

        if (!user) throw new Error("Usuário não encontrado")

        const calculatedProfile = calculateInvestorProfile(formData);

        if (user.profile) {
            await prisma.profile.update({
                where: { id: user.profile.id },
                data: {
                    jornadaData: formData,
                    jornadaCompleted: isCompleted,
                    portfolioType: calculatedProfile
                }
            })
        } else {
            await prisma.profile.create({
                data: {
                    userId: user.id,
                    jornadaData: formData,
                    jornadaCompleted: isCompleted,
                    portfolioType: calculatedProfile,
                    saldo: 0,
                    emergencyFund: 0,
                    totalCarteira: 0
                }
            })
        }

        return { success: true, profileType: calculatedProfile }
    } catch (error) {
        console.error("Error saving jornada:", error)
        return { success: false, error: "Erro ao salvar os dados" }
    }
}

export async function getJornadaProgress() {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user || !session.user.email) {
            return { success: false }
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { profile: true }
        })

        if (!user || !user.profile) return { success: false, data: null, isCompleted: false, portfolioType: null }

        return { 
            success: true, 
            data: user.profile.jornadaData, 
            isCompleted: user.profile.jornadaCompleted,
            portfolioType: user.profile.portfolioType
        }
    } catch (error) {
        return { success: false }
    }
}
