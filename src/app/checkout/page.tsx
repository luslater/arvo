"use client"

import { motion } from "framer-motion"
import { Check, ShieldCheck, Zap, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

export default function CheckoutPage() {
    const { data: session, status } = useSession()

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
                        <Image src="/arvo-logo.png" alt="ARVO" width={80} height={40} className="invert mix-blend-screen brightness-150" />
                    </Link>
                    {status === "loading" ? (
                        <div className="w-20 h-8 animate-pulse bg-slate-800 rounded-lg"></div>
                    ) : session?.user ? (
                        <div className="flex items-center gap-4">
                            <span className="!text-slate-300 font-medium text-sm">Olá, {session.user.name?.split(' ')[0]}</span>
                            <Button variant="ghost" onClick={() => signOut({ callbackUrl: '/' })} className="!text-slate-400 hover:!text-white font-bold">Sair</Button>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button variant="ghost" className="!text-slate-100 hover:!text-white hover:bg-white/10 font-bold">Entrar</Button>
                        </Link>
                    )}
                </nav>

                {session?.user && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3"
                    >
                        <Zap className="w-5 h-5 text-emerald-400" />
                        <p className="font-medium text-emerald-100">
                            <strong>Quase lá, {session.user.name?.split(' ')[0]}!</strong> Sua conta foi criada/acessada. Finalize sua assinatura abaixo para liberar o acesso ao Dashboard e a toda a plataforma.
                        </p>
                    </motion.div>
                )}

                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 shadow-lg shadow-emerald-500/20"
                        >
                            <Star className="w-3 h-3 fill-emerald-400 !text-emerald-400" />
                            <span className="!text-white text-[10px] font-black uppercase tracking-[0.2em]">Acesso Premium</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-6xl md:text-7xl font-bold tracking-tighter leading-none !text-white"
                        >
                            Assuma o controle total do seu <span className="italic !text-emerald-400 underline decoration-emerald-500/30">patrimônio.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl !text-slate-100 font-semibold max-w-lg leading-relaxed mt-4"
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
                                        <Check className="w-3 h-3 !text-emerald-400" />
                                    </div>
                                    <span className="!text-white font-bold text-lg">{benefit}</span>
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
                                        <h3 className="text-3xl font-black !text-white tracking-tight">ARVO Premium</h3>
                                        <p className="!text-slate-100 text-sm font-bold uppercase tracking-wider mt-1">Plano de Assinatura (Beta)</p>
                                    </div>
                                    <Zap className="w-10 h-10 !text-emerald-400 !fill-emerald-400" />
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold !text-slate-100">12x</span>
                                        <span className="text-6xl font-black !text-white">R$ 42,00</span>
                                    </div>
                                    <p className="text-sm !text-emerald-400 font-black uppercase tracking-widest mt-2">Acesso Premium · Oferta de Lançamento</p>
                                </div>

                                <div className="pt-6 border-t border-slate-800 space-y-4">
                                    <Link href="/checkout/pagamento" className="w-full block">
                                        <Button className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-lg font-bold rounded-2xl group transition-all text-white shadow-lg shadow-emerald-500/20">
                                            {session?.user ? "FINALIZAR MINHA ASSINATURA" : "QUERO MEU ACESSO AGORA"}
                                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                    <div className="flex items-center justify-center gap-2 text-xs !text-slate-100 uppercase tracking-widest font-black">
                                        <ShieldCheck className="w-4 h-4 !text-emerald-400" />
                                        Pagamento Seguro · Acesso Imediato
                                    </div>
                                </div>

                                <div className="p-6 bg-slate-950/50 rounded-2xl border border-slate-800 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-800 overflow-hidden relative border border-slate-700">
                                        <div className="absolute inset-0 bg-emerald-500/20" />
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-black !text-white text-base">Dúvida sobre o acesso?</p>
                                        <p className="!text-emerald-400 text-xs font-black uppercase tracking-widest">Fale com nosso time agora.</p>
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
