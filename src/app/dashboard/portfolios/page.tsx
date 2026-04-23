"use client"

import Link from "next/link"
import { ArrowRight, ExternalLink } from "lucide-react"
import { useSession } from "next-auth/react"
import { useState } from "react"
import {
    SUGGESTED_ALLOCATIONS_GERAL,
    SUGGESTED_ALLOCATIONS_IQ,
    FUNDS_LIBRARY,
    type StepKey,
} from "@/config/portfolios"

const portfolios = [
    {
        type: "ABRIGO",
        name: "Abrigo",
        subtitle: "Carteira Conservadora",
        description: "Para quem prioriza a preservação do capital. Foco em renda fixa de alta qualidade.",
        color: "#C9B8A3",
        bg: "#FAF7F4",
        border: "#E8DDD0",
        riskLabel: "Conservadora",
        riskColor: "text-amber-700 bg-amber-50",
        returns: "10,5% a.a.",
        volatility: "Baixa",
    },
    {
        type: "RITMO",
        name: "Ritmo",
        subtitle: "Carteira Moderada",
        description: "Equilíbrio entre crescimento e segurança. Um mix diversificado de renda fixa e variável.",
        color: "#A8C5A1",
        bg: "#F4FAF4",
        border: "#C4DEC1",
        riskLabel: "Moderada",
        riskColor: "text-emerald-700 bg-emerald-50",
        returns: "12,2% a.a.",
        volatility: "Moderada",
    },
    {
        type: "VISÃO",
        name: "Visão",
        subtitle: "Carteira Arrojada",
        description: "Maior exposição à renda variável. Potencial de retornos mais elevados no longo prazo.",
        color: "#A3BFD9",
        bg: "#F4F8FC",
        border: "#BDD4EA",
        riskLabel: "Arrojada",
        riskColor: "text-blue-700 bg-blue-50",
        returns: "14,5% a.a.",
        volatility: "Arrojada",
    },
    {
        type: "OCEANO",
        name: "Oceano",
        subtitle: "Carteira Global",
        description: "Diversificação internacional com foco em ativos globais. Para horizontes de 10+ anos.",
        color: "#1B4F8A",
        bg: "#F0F5FF",
        border: "#BFD0F0",
        riskLabel: "Sofisticada",
        riskColor: "text-indigo-700 bg-indigo-50",
        returns: "16,0% a.a.",
        volatility: "Alto Global",
    },
]

function getFundCount(stepKey: StepKey, isIQ: boolean) {
    const allocs = isIQ ? SUGGESTED_ALLOCATIONS_IQ : SUGGESTED_ALLOCATIONS_GERAL
    return allocs[stepKey]?.length || 0
}

export default function DashboardPortfoliosPage() {
    const { data: session } = useSession()
    const userProfile = (session?.user as { portfolioType?: string })?.portfolioType
    const [isIQ, setIsIQ] = useState(false)

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-7 flex items-end justify-between">
                <div>
                    <div className="font-serif text-[28px] text-dash-text tracking-tight mb-1">Portfólios ARVO</div>
                    <div className="text-[13px] text-dash-text-muted">4 carteiras elaboradas pela nossa equipe de especialistas certificados.</div>
                </div>

                {/* IQ / Geral Toggle */}
                <div className="flex items-center gap-2 bg-dash-surface border border-dash-border rounded-xl px-1 py-1">
                    <button
                        onClick={() => setIsIQ(false)}
                        className={`px-3.5 py-1.5 text-[12px] font-semibold rounded-lg transition-colors ${!isIQ ? "bg-dash-accent text-white shadow-sm" : "text-dash-text-muted hover:text-dash-text"
                            }`}
                    >
                        Geral
                    </button>
                    <button
                        onClick={() => setIsIQ(true)}
                        className={`px-3.5 py-1.5 text-[12px] font-semibold rounded-lg transition-colors ${isIQ ? "bg-dash-accent text-white shadow-sm" : "text-dash-text-muted hover:text-dash-text"
                            }`}
                    >
                        Qualificado
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
                {portfolios.map((p) => {
                    const stepKey = p.type === "VISÃO" ? "visao" : p.type.toLowerCase() as StepKey
                    const fundCount = getFundCount(stepKey, isIQ)
                    return (
                        <Link href={`/portfolio/${p.type.toLowerCase()}?iq=${isIQ ? '1' : '0'}`} key={p.type} style={{ backgroundColor: p.bg, borderColor: p.border }} className="relative border rounded-2xl p-6 flex flex-col gap-3 hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer group">
                            {userProfile === p.type && (
                                <span className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full bg-dash-accent text-white">Meu perfil</span>
                            )}

                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                                <div>
                                    <div className="font-serif text-[18px] text-dash-text leading-tight">{p.name}</div>
                                    <div className="text-[11px] text-dash-text-muted">{p.subtitle}</div>
                                </div>
                            </div>

                            <p className="text-[13px] text-dash-text-muted leading-relaxed">{p.description}</p>

                            <div className="flex gap-4 mt-1">
                                <div>
                                    <div className="text-[10px] text-dash-text-light uppercase tracking-wider mb-0.5">Retorno Est.</div>
                                    <div className="text-[13px] font-semibold text-dash-text">{p.returns}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-dash-text-light uppercase tracking-wider mb-0.5">Volatilidade</div>
                                    <div className="text-[13px] font-semibold text-dash-text">{p.volatility}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-dash-text-light uppercase tracking-wider mb-0.5">Fundos</div>
                                    <div className="text-[13px] font-semibold text-dash-text">{fundCount} ativos</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-dash-text-light uppercase tracking-wider mb-0.5">Perfil</div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.riskColor}`}>{p.riskLabel}</span>
                                </div>
                            </div>

                            <div
                                className="flex items-center gap-1.5 text-[12px] font-semibold text-dash-accent mt-1 group-hover:underline"
                            >
                                Ver detalhes completos
                                <ExternalLink className="w-3.5 h-3.5" />
                            </div>
                        </Link>
                    )
                })}
            </div>

            {/* IQ Badge Info */}
            {isIQ && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-[12px] text-amber-800">
                    <strong>Investidor Qualificado:</strong> Carteiras com acesso a fundos exclusivos (Valora Guardian A, Capitânia Yield 120, IP Ecossistema, etc.) disponíveis apenas para investidores com patrimônio acima de R$ 1 milhão.
                </div>
            )}

            <div className="bg-dash-surface border border-dash-border rounded-2xl p-5 flex items-center gap-4">
                <div className="flex-1">
                    <div className="text-[13px] font-semibold text-dash-text mb-0.5">Quer mudar de carteira?</div>
                    <div className="text-[12px] text-dash-text-muted">Refaça o questionário de perfil de investidor e adaptamos sua alocação automaticamente.</div>
                </div>
                <Link
                    href="/questionnaire"
                    className="flex items-center gap-1.5 px-4 py-2 bg-dash-accent text-white text-[12px] font-semibold rounded-lg hover:bg-dash-accent-mid transition-colors whitespace-nowrap"
                >
                    Refazer questionário
                    <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>
        </div>
    )
}
