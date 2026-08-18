import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Clock, Map, Compass, Calculator, ArrowRight, ShieldCheck } from "lucide-react";

export const metadata = {
    title: "Mensagem Recebida | ARVO Orientação Financeira",
    description: "Recebemos seu contato com sucesso. Nossa equipe entrará em contato em até 24 horas úteis.",
};

export default function ObrigadoPage() {
    return (
        <div className="min-h-screen bg-[#fcfaf7] text-[#123044] flex flex-col justify-between p-6 sm:p-12 font-sans selection:bg-[#1f674f]/15">
            {/* Header */}
            <header className="flex items-center justify-between max-w-6xl w-full mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <Image
                        src="/meu-arvo-logo.png"
                        alt="ARVO Orientação Financeira"
                        width={90}
                        height={40}
                        className="h-8 w-auto object-contain"
                        priority
                    />
                </Link>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1f674f] bg-[#e8f1ed] px-3 py-1 rounded-full border border-[#d6e5de]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Atendimento Fee-Only
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-2xl w-full mx-auto my-auto text-center space-y-8 py-10">
                {/* Success Badge & Icon */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100/80 border-2 border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm animate-in zoom-in-50 duration-300">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f0ece1] text-[#1f674f] text-xs font-bold tracking-widest uppercase border border-[#e4e0d7]">
                        Mensagem Recebida com Sucesso
                    </div>
                </div>

                {/* Main Headline & Description */}
                <div className="space-y-4">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#123044] leading-tight">
                        Obrigado pelo seu contato! <br />
                        <span className="font-serif italic font-normal text-[#1f674f]">Já estamos cuidando de tudo.</span>
                    </h1>
                    
                    {/* SLA Box */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#e4e0d7] shadow-sm max-w-lg mx-auto text-left flex items-start gap-3.5">
                        <Clock className="w-5 h-5 text-[#1f674f] shrink-0 mt-0.5" />
                        <div className="space-y-1 text-xs sm:text-sm">
                            <p className="font-bold text-[#123044]">Prazo de Resposta:</p>
                            <p className="text-[#667085] leading-relaxed">
                                Nosso time de especialistas em alocação entrará em contato em até <strong className="text-[#123044]">24 horas úteis</strong> pelo seu WhatsApp ou E-mail informado.
                            </p>
                        </div>
                    </div>
                </div>

                {/* While you wait section */}
                <div className="pt-4 space-y-4">
                    <p className="text-xs uppercase font-bold tracking-widest text-[#8d97a5]">
                        Enquanto aguarda nosso contato, explore a plataforma:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Link
                            href="/dashboard/jornada"
                            className="p-4 rounded-2xl bg-white border border-[#e4e0d7] hover:border-[#1f674f] transition-all hover:shadow-sm text-left flex flex-col justify-between group"
                        >
                            <div className="space-y-2">
                                <div className="w-8 h-8 rounded-xl bg-[#f0ece1] flex items-center justify-center text-[#1f674f]">
                                    <Map className="w-4 h-4" />
                                </div>
                                <h3 className="font-bold text-sm text-[#123044]">Jornada de 7 Pilares</h3>
                                <p className="text-xs text-[#667085] line-clamp-2">Diagnóstico completo do seu patrimônio e suitability.</p>
                            </div>
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1f674f] mt-3 group-hover:translate-x-1 transition-transform">
                                Iniciar <ArrowRight className="w-3 h-3" />
                            </span>
                        </Link>

                        <Link
                            href="/dashboard/bussola"
                            className="p-4 rounded-2xl bg-white border border-[#e4e0d7] hover:border-[#1f674f] transition-all hover:shadow-sm text-left flex flex-col justify-between group"
                        >
                            <div className="space-y-2">
                                <div className="w-8 h-8 rounded-xl bg-[#f0ece1] flex items-center justify-center text-[#1f674f]">
                                    <Compass className="w-4 h-4" />
                                </div>
                                <h3 className="font-bold text-sm text-[#123044]">Bússola de Carteiras</h3>
                                <p className="text-xs text-[#667085] line-clamp-2">Alocações recomendadas calibradas por perfil e macro classes.</p>
                            </div>
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1f674f] mt-3 group-hover:translate-x-1 transition-transform">
                                Acessar <ArrowRight className="w-3 h-3" />
                            </span>
                        </Link>

                        <Link
                            href="/dashboard/calculadoras"
                            className="p-4 rounded-2xl bg-white border border-[#e4e0d7] hover:border-[#1f674f] transition-all hover:shadow-sm text-left flex flex-col justify-between group"
                        >
                            <div className="space-y-2">
                                <div className="w-8 h-8 rounded-xl bg-[#f0ece1] flex items-center justify-center text-[#1f674f]">
                                    <Calculator className="w-4 h-4" />
                                </div>
                                <h3 className="font-bold text-sm text-[#123044]">Calculadora PL</h3>
                                <p className="text-xs text-[#667085] line-clamp-2">Simule aportes, prazos e sua renda passiva futura.</p>
                            </div>
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1f674f] mt-3 group-hover:translate-x-1 transition-transform">
                                Simular <ArrowRight className="w-3 h-3" />
                            </span>
                        </Link>
                    </div>
                </div>

                <div className="pt-2">
                    <Link
                        href="/"
                        className="text-xs font-semibold text-[#8d97a5] hover:text-[#123044] transition-colors"
                    >
                        &larr; Voltar para a Página Inicial
                    </Link>
                </div>
            </main>

            {/* Footer */}
            <footer className="text-center text-xs text-[#8d97a5] font-light max-w-6xl w-full mx-auto">
                &copy; {new Date().getFullYear()} ARVO Orientação Financeira Independente. Todos os direitos reservados.
            </footer>
        </div>
    );
}
