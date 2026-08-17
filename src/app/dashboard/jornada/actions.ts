"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { calculateInvestorProfile } from "@/lib/profile-calculator"

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
