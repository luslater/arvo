"use client"

import Image from "next/image"
import { Clock, Mail, CheckCircle2 } from "lucide-react"

export default function PendingPage() {
    return (
        <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center p-6">
            <div className="max-w-lg w-full">
                {/* Logo */}
                <div className="flex justify-center mb-10">
                    <Image src="/arvo-logo.png" alt="ARVO" width={80} height={32} className="object-contain" />
                </div>

                {/* Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-[rgba(10,25,47,0.08)] p-10 text-center">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-[#EEF2F7] rounded-full flex items-center justify-center mx-auto mb-6">
                        <Clock className="w-8 h-8 text-[#0A192F]" />
                    </div>

                    {/* Title */}
                    <h1 className="font-serif text-[28px] text-[#0A192F] tracking-tight mb-3">
                        Cadastro recebido!
                    </h1>
                    <p className="text-[15px] text-[#4A5568] leading-relaxed mb-8">
                        Obrigado pelo interesse na <strong className="text-[#0A192F]">ARVO</strong>. Seu cadastro foi enviado para análise da nossa equipe e em breve entraremos em contato por e-mail para confirmar o seu acesso.
                    </p>

                    {/* Steps */}
                    <div className="bg-[#F4F6F9] rounded-2xl p-6 text-left space-y-4 mb-8">
                        {[
                            { icon: CheckCircle2, label: "Cadastro enviado com sucesso" },
                            { icon: Clock, label: "Nossa equipe irá analisar em até 24h" },
                            { icon: Mail, label: "Você receberá um e-mail quando seu acesso for liberado" },
                        ].map(({ icon: Icon, label }, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${i === 0 ? 'bg-emerald-100' : 'bg-[#EEF2F7]'}`}>
                                    <Icon className={`w-3.5 h-3.5 ${i === 0 ? 'text-emerald-600' : 'text-[#0A192F]'}`} />
                                </div>
                                <span className="text-[13px] text-[#4A5568]">{label}</span>
                            </div>
                        ))}
                    </div>

                    <p className="text-[12px] text-[#94A3B8]">
                        Dúvidas? Fale com a gente em{" "}
                        <a href="mailto:contato@meuarvo.com.br" className="text-[#0A192F] hover:underline font-medium">
                            contato@meuarvo.com.br
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}
