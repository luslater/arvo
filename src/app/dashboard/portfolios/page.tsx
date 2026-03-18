"use client"

import Link from "next/link"
import { ArrowRight, ExternalLink } from "lucide-react"
import { useSession } from "next-auth/react"

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
        returns: "9–10% a.a.",
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
        returns: "11–13% a.a.",
        volatility: "Média",
    },
    {
        type: "VANGUARDA",
        name: "Vanguarda",
        subtitle: "Carteira Arrojada",
        description: "Maior exposição à renda variável. Potencial de retornos mais elevados no longo prazo.",
        color: "#A3BFD9",
        bg: "#F4F8FC",
        border: "#BDD4EA",
        riskLabel: "Arrojada",
        riskColor: "text-blue-700 bg-blue-50",
        returns: "13–16% a.a.",
        volatility: "Alta",
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
        returns: "14–18% a.a.",
        volatility: "Média-Alta",
    },
]

export default function DashboardPortfoliosPage() {
    const { data: session } = useSession()
    const userProfile = (session?.user as { portfolioType?: string })?.portfolioType

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-7">
                <div className="font-serif text-[28px] text-dash-text tracking-tight mb-1">Portfólios ARVO</div>
                <div className="text-[13px] text-dash-text-muted">4 carteiras elaboradas pela nossa equipe de especialistas certificados.</div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
                {portfolios.map((p) => (
                    <div key={p.type} style={{ backgroundColor: p.bg, borderColor: p.border }} className="relative border rounded-2xl p-6 flex flex-col gap-3 hover:-translate-y-0.5 transition-transform cursor-pointer">
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
                                <div className="text-[10px] text-dash-text-light uppercase tracking-wider mb-0.5">Perfil</div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.riskColor}`}>{p.riskLabel}</span>
                            </div>
                        </div>

                        <Link
                            href={`/portfolio/${p.type.toLowerCase()}`}
                            className="flex items-center gap-1.5 text-[12px] font-semibold text-dash-accent mt-1 hover:underline"
                        >
                            Ver detalhes completos
                            <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                ))}
            </div>

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
