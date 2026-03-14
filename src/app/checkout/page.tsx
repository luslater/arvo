"use client"

import { motion } from "framer-motion"
import { Check, ShieldCheck, Zap, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

export default function CheckoutPage() {
    const benefits = [
        "Acesso completo ao Planejamento Financeiro",
        "Monitoramento de Carteiras em tempo real",
        "Modelos exclusivos (Abrigo, Ritmo, Vanguarda)",
        "Importação ilimitada de ativos via Excel",
        "Suporte prioritário e consultoria de modelos",
    ]

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />

            <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
                <nav className="flex justify-between items-center mb-20">
                    <Link href="/">
                        <Image src="/arvo-logo.png" alt="ARVO" width={80} height={40} className="brightness-0 invert" />
                    </Link>
                    <Link href="/login">
                        <Button variant="ghost" className="text-slate-200 hover:text-white hover:bg-white/10">Entrar</Button>
                    </Link>
                </nav>

                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest"
                        >
                            <Star className="w-3 h-3 fill-emerald-400" />
                            Acesso Premium
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-6xl md:text-7xl font-light tracking-tighter leading-none text-white"
                        >
                            Assuma o controle total do seu <span className="font-semibold italic text-emerald-400 underline decoration-emerald-500/30">patrimônio.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-slate-200 font-normal max-w-lg leading-relaxed"
                        >
                            Desbloqueie ferramentas avançadas de projeção, acompanhamento de ativos e modelos de alocação profissional.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-4"
                        >
                            {benefits.map((benefit, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-emerald-400" />
                                    </div>
                                    <span className="text-slate-100 font-medium">{benefit}</span>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl rounded-[3rem] p-4">
                            <CardContent className="p-8 space-y-8">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">ARVO Premium</h3>
                                        <p className="text-slate-300 text-sm font-medium">Plano de Acesso Vitalício (Beta)</p>
                                    </div>
                                    <Zap className="w-8 h-8 text-emerald-400 fill-emerald-400" />
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-bold text-white">R$ 497</span>
                                        <span className="text-slate-300 font-medium">/ único</span>
                                    </div>
                                    <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Aproveite o preço de pré-lançamento</p>
                                </div>

                                <div className="pt-6 border-t border-slate-800 space-y-4">
                                    <Button className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-lg font-bold rounded-2xl group transition-all text-white shadow-lg shadow-emerald-500/20">
                                        QUERO MEU ACESSO AGORA
                                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                    <div className="flex items-center justify-center gap-2 text-[10px] text-slate-300 uppercase tracking-widest font-bold">
                                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                        Pagamento Seguro · Acesso Imediato
                                    </div>
                                </div>

                                <div className="p-6 bg-slate-950/50 rounded-2xl border border-slate-800 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-800 overflow-hidden relative border border-slate-700">
                                        <div className="absolute inset-0 bg-emerald-500/20" />
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-bold text-white">Dúvida sobre o acesso?</p>
                                        <p className="text-slate-200 text-xs font-medium">Fale com nosso time agora.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
