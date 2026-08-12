"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
    CreditCard, QrCode, ShieldCheck,
    ArrowLeft, Lock, Zap, CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"

export default function PaymentPage() {
    const { update } = useSession()
    const [isProcessing, setIsProcessing] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsProcessing(true)

        try {
            const res = await fetch("/api/checkout/simulate", { method: "POST" })
            if (res.ok) {
                await update() // Force session refresh
                setIsSuccess(true)
            } else {
                alert("Erro ao processar pagamento. Verifique se você está logado.")
            }
        } catch (error) {
            console.error(error)
            alert("Erro de conexão ao processar pagamento.")
        } finally {
            setIsProcessing(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[#0A192F] flex items-center justify-center p-6 text-white">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center space-y-8"
                >
                    <div className="w-24 h-24 bg-[#4fa080]/20 rounded-full flex items-center justify-center mx-auto border border-[#4fa080]/50">
                        <CheckCircle2 className="w-12 h-12 text-[#9bcbb4]" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black !text-white">Pagamento Confirmado!</h1>
                        <p className="text-slate-300 font-medium">Seja bem-vindo ao ARVO Premium. Seu acesso foi liberado com sucesso.</p>
                    </div>
                    <Link href="/dashboard" className="block w-full">
                        <Button className="w-full h-14 bg-[#4fa080] hover:bg-[#2b6e76] text-lg font-bold rounded-2xl">
                            IR PARA O DASHBOARD
                        </Button>
                    </Link>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0A192F] text-white font-sans selection:bg-[#4fa080]/30">
            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#4fa080]/5 to-transparent pointer-events-none" />

            <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
                <Link href="/checkout" className="inline-flex items-center gap-2 !text-slate-100 hover:!text-white mb-12 group transition-colors font-bold">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Voltar para oferta
                </Link>

                <div className="grid lg:grid-cols-5 gap-12">
                    {/* Lateral: Resumo */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <Badge className="bg-[#4fa080]/10 !text-[#9bcbb4] border-[#4fa080]/30 mb-4 px-3 py-1 font-black tracking-widest uppercase text-[10px]">
                                Checkout Seguro
                            </Badge>
                            <h1 className="text-4xl font-black !text-white leading-tight">Finalize seu acesso Premium</h1>
                        </div>

                        <Card className="bg-[#123044]/50 border-[#1E3A5F] backdrop-blur-xl rounded-3xl overflow-hidden">
                            <CardContent className="p-8 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#4fa080]/20 rounded-xl flex items-center justify-center">
                                        <Zap className="w-6 h-6 text-[#9bcbb4] fill-[#9bcbb4]" />
                                    </div>
                                    <div>
                                        <p className="font-bold !text-white text-base">ARVO Premium</p>
                                        <p className="text-xs !text-slate-200 font-bold">Acesso Premium + Consultoria</p>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="!text-slate-100 font-bold">Plano Premium</span>
                                        <span className="font-bold !text-white">12x R$ 42,00</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#9bcbb4] font-bold">Taxa de Adesão (Beta)</span>
                                        <span className="text-[#9bcbb4] font-bold line-through opacity-50">Grátis</span>
                                    </div>
                                    <div className="flex justify-between items-end pt-4 border-t border-white/5">
                                        <span className="text-lg font-bold !text-white">Total</span>
                                        <span className="text-3xl font-black !text-[#9bcbb4] tracking-tighter">12x R$ 42,00</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 !text-slate-100 text-xs font-black uppercase tracking-widest">
                                <ShieldCheck className="w-4 h-4 !text-[#9bcbb4]" />
                                Ambiente Criptografado
                            </div>
                            <div className="flex items-center gap-3 !text-slate-100 text-xs font-black uppercase tracking-widest">
                                <Lock className="w-4 h-4 !text-[#9bcbb4]" />
                                Pagamento Processado pela ARVO
                            </div>
                        </div>
                    </div>

                    {/* Principal: Formas de Pagamento */}
                    <div className="lg:col-span-3">
                        <Tabs defaultValue="card" className="w-full">
                            <TabsList className="w-full bg-[#123044] border border-[#1E3A5F] p-1 h-14 rounded-2xl mb-8">
                                <TabsTrigger value="card" className="flex-1 rounded-xl data-[state=active]:bg-[#1E3A5F] data-[state=active]:!text-white !text-slate-300 font-black gap-2 transition-all">
                                    <CreditCard className="w-4 h-4" />
                                    Cartão
                                </TabsTrigger>
                                <TabsTrigger value="pix" className="flex-1 rounded-xl data-[state=active]:bg-[#1E3A5F] data-[state=active]:!text-white !text-slate-300 font-black gap-2 transition-all">
                                    <QrCode className="w-4 h-4" />
                                    PIX
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="card">
                                <form onSubmit={handlePayment} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest !text-slate-100">Nome no Cartão</Label>
                                        <Input
                                            placeholder="NOME IGUAL AO CARTÃO"
                                            className="h-14 bg-[#123044] border-[#1E3A5F] rounded-xl focus:border-[#4fa080] transition-all font-bold uppercase !text-white placeholder:text-slate-400"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest !text-slate-100">Número do Cartão</Label>
                                        <Input
                                            placeholder="0000 0000 0000 0000"
                                            className="h-14 bg-[#123044] border-[#1E3A5F] rounded-xl focus:border-[#4fa080] transition-all font-bold !text-white placeholder:text-slate-400"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-widest !text-slate-100">Validade</Label>
                                            <Input
                                                placeholder="MM/AA"
                                                className="h-14 bg-[#123044] border-[#1E3A5F] rounded-xl focus:border-[#4fa080] transition-all font-bold !text-white placeholder:text-slate-400 text-center"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-widest !text-slate-100">CVC</Label>
                                            <Input
                                                placeholder="000"
                                                className="h-14 bg-[#123044] border-[#1E3A5F] rounded-xl focus:border-[#4fa080] transition-all font-bold !text-white placeholder:text-slate-400 text-center"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isProcessing}
                                        className="w-full h-16 bg-[#4fa080] hover:bg-[#2b6e76] text-white text-lg font-black rounded-2xl shadow-lg shadow-[#4fa080]/20 transition-all active:scale-[0.98]"
                                    >
                                        {isProcessing ? "PROCESSANDO..." : "FINALIZAR PAGAMENTO"}
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="pix">
                                <div className="space-y-8 text-center bg-[#123044]/50 p-10 rounded-[2rem] border border-[#1E3A5F]">
                                    <div className="space-y-2">
                                        <p className="text-2xl font-black !text-white tracking-tight">Escaneie o QR Code</p>
                                        <p className="text-base !text-slate-100 font-bold">O pagamento por PIX é liberado instantaneamente.</p>
                                    </div>

                                    <div className="w-56 h-56 bg-white p-6 rounded-3xl mx-auto flex items-center justify-center border-4 border-[#4fa080]/20 shadow-2xl relative group">
                                        {/* Simulação de QR Code */}
                                        <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center border-2 border-dashed border-slate-300">
                                            <QrCode className="w-16 h-16 text-slate-800" />
                                            <span className="text-[12px] font-black text-slate-800 uppercase tracking-tighter mt-3">QR Code Premium</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4 max-w-sm mx-auto">
                                        <div className="p-4 bg-[#0A192F] rounded-xl border border-[#1E3A5F] text-[11px] font-mono break-all !text-slate-100 border-dashed leading-relaxed font-bold">
                                            00020126420014br.gov.bcb.pix0120suporte@arvo.com.br52040000530398654064504.0058 02BR5915ARVO0PAYMENT6009SAO PAULO62070503***6304E2D3
                                        </div>
                                        <Button
                                            className="w-full h-12 bg-[#1E3A5F] hover:bg-[#123044] !text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 border border-[#1E3A5F]"
                                            onClick={() => {
                                                navigator.clipboard.writeText("00020126420014br.gov.bcb.pix0120suporte@arvo.com.br5204000053039865406497.0058 02BR5915ARVO0PAYMENT6009SAO PAULO62070503***6304E2D3")
                                                alert("Link PIX Copiado!")
                                            }}
                                        >
                                            COPIAR CÓDIGO PIX
                                        </Button>
                                    </div>

                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-2 h-2 bg-[#4fa080] animate-pulse rounded-full" />
                                        <p className="text-xs !text-[#9bcbb4] font-black uppercase tracking-widest leading-none">Aguardando confirmação em tempo real</p>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}
