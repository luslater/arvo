export type Question = {
    id: number
    question: string
    options: {
        text: string
        points: number
    }[]
}

export const questions: Question[] = [
    {
        id: 1,
        question: "Qual é o seu horizonte de investimento?",
        options: [
            { text: "Menos de 1 ano", points: 0 },
            { text: "1 a 3 anos", points: 2 },
            { text: "3 a 5 anos", points: 4 },
            { text: "Mais de 5 anos", points: 6 },
        ],
    },
    {
        id: 2,
        question: "Se seus investimentos caíssem 20%, o que você faria?",
        options: [
            { text: "Venderia tudo imediatamente", points: 0 },
            { text: "Venderia parte e guardaria em renda fixa", points: 2 },
            { text: "Manteria tudo como está", points: 4 },
            { text: "Aproveitaria para investir mais", points: 6 },
        ],
    },
    {
        id: 3,
        question: "Qual é sua experiência com investimentos?",
        options: [
            { text: "Nenhuma, estou começando agora", points: 0 },
            { text: "Básica, conheço poupança e CDB", points: 2 },
            { text: "Intermediária, já invisto em fundos", points: 4 },
            { text: "Avançada, tenho carteira diversificada", points: 6 },
        ],
    },
    {
        id: 4,
        question: "Qual é sua tolerância ao risco?",
        options: [
            { text: "Muito baixa, preciso de estabilidade", points: 0 },
            { text: "Baixa, aceito oscilações pequenas", points: 2 },
            { text: "Moderada, aceito risco controlado", points: 4 },
            { text: "Alta, busco máximo retorno", points: 6 },
        ],
    },
    {
        id: 5,
        question: "Como está sua situação financeira atual?",
        options: [
            { text: "Instável, não tenho reserva de emergência", points: 0 },
            { text: "Estável, tenho 3-6 meses de reserva", points: 2 },
            { text: "Boa, tenho 6-12 meses de reserva", points: 4 },
            { text: "Excelente, tenho mais de 1 ano de reserva", points: 6 },
        ],
    },
]

export type ProfileType = "ABRIGO" | "RITMO" | "VANGUARDA"

export function calculateProfile(totalPoints: number): ProfileType {
    // Max points now: 6 * 5 = 30 points
    if (totalPoints <= 10) return "ABRIGO" // 0-10 pontos (Conservadora)
    if (totalPoints <= 20) return "RITMO" // 11-20 pontos (Moderada)
    return "VANGUARDA" // 21-30 pontos (Arrojada)
}

import { Shield, TrendingUp, Rocket } from "lucide-react"

export function getProfileDescription(profile: ProfileType) {
    const descriptions = {
        ABRIGO: {
            title: "Abrigo",
            subtitle: "Seu porto seguro",
            description: "Você prioriza a segurança do capital. Aceita rentabilidade menor em troca de baixo risco e estabilidade.",
            icon: <Shield className="w-12 h-12 text-white" />,
            color: "abrigo",
        },
        RITMO: {
            title: "Ritmo",
            subtitle: "Crescimento constante",
            description: "Você busca equilíbrio entre segurança e rentabilidade. Aceita riscos controlados para crescimento sustentável.",
            icon: <TrendingUp className="w-12 h-12 text-white" />,
            color: "ritmo",
        },
        VANGUARDA: {
            title: "Vanguarda",
            subtitle: "Rumo ao futuro",
            description: "Você foca em alta rentabilidade no longo prazo. Tolera volatilidade e riscos maiores em busca de retornos superiores.",
            icon: <Rocket className="w-12 h-12 text-white" />,
            color: "vanguarda",
        },
    }
    return descriptions[profile]
}
