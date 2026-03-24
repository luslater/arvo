"use client"

import Link from "next/link"
import { Crown, ArrowRight, CheckCircle2, Zap } from "lucide-react"
import { useSession } from "next-auth/react"

export default function DashboardAssinaturaPage() {
    const { data: session } = useSession()
    const subscriptionStatus = (session?.user?.subscriptionStatus as string) || "FREE"
    const isPremium = subscriptionStatus !== "FREE"

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-7">
                <div className="font-serif text-[28px] text-dash-text tracking-tight mb-1">Assinatura</div>
                <div className="text-[13px] text-dash-text-muted">Gerencie seu plano e acesse os benefícios da ARVO.</div>
            </div>

            {/* Status Card */}
            <div
                className="rounded-2xl p-7 mb-5 border"
                style={{
                    backgroundColor: isPremium ? '#0A192F' : '#FFFFFF',
                    borderColor: isPremium ? 'transparent' : 'rgba(10,25,47,0.1)'
                }}
            >
                <div className="flex items-start justify-between mb-5">
                    <div>
                        <div style={{ color: isPremium ? 'rgba(255,255,255,0.55)' : '#94A3B8', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                            Plano atual
                        </div>
                        <div style={{ fontFamily: 'var(--font-dm-serif)', fontSize: 32, color: isPremium ? '#FFFFFF' : '#0A192F', letterSpacing: '-0.02em', lineHeight: 1 }}>
                            {isPremium ? 'ARVO Premium' : 'Plano Gratuito'}
                        </div>
                        {isPremium && (
                            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 6 }}>Acesso completo a todos os recursos</div>
                        )}
                    </div>
                    <div style={{
                        padding: 12,
                        borderRadius: 12,
                        backgroundColor: isPremium ? 'rgba(255,255,255,0.1)' : '#EEF2F7'
                    }}>
                        <Crown style={{ width: 28, height: 28, color: isPremium ? '#FFFFFF' : '#0A192F' }} />
                    </div>
                </div>

                {!isPremium && (
                    <Link
                        href="/premium"
                        className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl w-fit transition-colors hover:opacity-90"
                        style={{ backgroundColor: '#0A192F', color: '#FFFFFF' }}
                    >
                        <Zap className="w-4 h-4" />
                        Assinar Premium
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                )}
            </div>

            {/* Upgrade CTA Banner — only for FREE users */}
            {!isPremium && (
                <div
                    className="rounded-2xl p-6 mb-5 flex items-center justify-between gap-6"
                    style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #0A192F 100%)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                    <div>
                        <div style={{ color: '#FFFFFF', fontSize: 17, fontWeight: 700, marginBottom: 4 }}>
                            Pronto para assinar o plano ARVO Premium?
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
                            Pague com <strong style={{ color: 'rgba(255,255,255,0.85)' }}>Pix</strong> ou <strong style={{ color: 'rgba(255,255,255,0.85)' }}>Cartão de Crédito</strong> — aprovação imediata.
                        </div>
                    </div>
                    <Link
                        href="/premium"
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-opacity hover:opacity-90 shrink-0"
                        style={{ backgroundColor: '#FFFFFF', color: '#0A192F', fontSize: 14 }}
                    >
                        <Zap className="w-4 h-4" />
                        Assinar agora
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            )}

            {/* Feature comparison */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-dash-surface border border-dash-border rounded-2xl p-6">
                    <div className="text-sm font-semibold text-dash-text mb-4">Plano Gratuito</div>
                    <div className="flex flex-col gap-3">
                        {[
                            "Acesso à 1 carteira ARVO",
                            "Simulador de independência financeira",
                            "Acompanhamento básico de portfólio",
                            "Trilhas de educação financeira",
                        ].map((feature) => (
                            <div key={feature} className="flex items-center gap-2.5 text-[13px] text-dash-text-muted">
                                <CheckCircle2 className="w-4 h-4 text-dash-text-light shrink-0" />
                                {feature}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Premium card with explicit inline styles to bypass Tailwind opacity issues */}
                <div className="rounded-2xl p-6" style={{ backgroundColor: '#0A192F' }}>
                    <div className="flex items-center justify-between mb-4">
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF' }}>Plano Premium</div>
                        <Crown style={{ width: 16, height: 16, color: 'rgba(255,255,255,0.6)' }} />
                    </div>
                    <div className="flex flex-col gap-3">
                        {[
                            "Acesso a todas as 4 carteiras ARVO",
                            "Planejamento financeiro personalizado",
                            "Acompanhamento em tempo real",
                            "Vídeos exclusivos do seu assessor",
                            "Suporte prioritário",
                            "Relatórios trimestrais de performance",
                        ].map((feature) => (
                            <div key={feature} className="flex items-center gap-2.5" style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>
                                <CheckCircle2 style={{ width: 16, height: 16, color: '#FFFFFF', flexShrink: 0 }} />
                                {feature}
                            </div>
                        ))}
                    </div>

                    {!isPremium && (
                        <Link
                            href="/premium"
                            className="mt-5 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl transition-colors hover:opacity-90"
                            style={{ backgroundColor: '#FFFFFF', color: '#0A192F' }}
                        >
                            Fazer upgrade
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}
