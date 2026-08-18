import Link from "next/link";
import Image from "next/image";
import { FileText, ShieldCheck, AlertCircle, Scale, ArrowLeft } from "lucide-react";

export const metadata = {
    title: "Termos de Uso | ARVO Orientação Financeira",
    description: "Termos e condições gerais de uso dos serviços e da plataforma SaaS ARVO Orientação Financeira Independente.",
};

export default function TermosPage() {
    return (
        <div className="min-h-screen bg-[#fcfaf7] text-[#123044] font-sans selection:bg-[#1f674f]/15">
            {/* Header */}
            <header className="border-b border-[#e4e0d7]/70 bg-[#fffdf8]/90 backdrop-blur-md sticky top-0 z-30">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
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
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#667085] hover:text-[#123044] transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Voltar ao Início
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
                {/* Title Section */}
                <div className="space-y-4 text-left">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0ece1] text-[#1f674f] text-xs font-bold tracking-widest uppercase border border-[#e4e0d7]">
                        <Scale className="w-3.5 h-3.5" />
                        Condições Gerais de Contratação e Uso
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#123044] leading-tight">
                        Termos e Condições de <span className="font-serif italic font-normal text-[#1f674f]">Uso da Plataforma</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-[#667085]">
                        Última atualização: Agosto de 2026 · Versão 1.1
                    </p>
                </div>

                {/* Important Notice */}
                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3.5 text-xs sm:text-sm text-amber-900 leading-relaxed">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                        <strong className="font-bold">Aviso sobre Risco e Rentabilidade:</strong>
                        <p className="mt-0.5">
                            Rentabilidade passada não representa garantia de rentabilidade futura. A ARVO é uma plataforma de orientação e planejamento patrimonial independente, não realizando custódia nem promessa de ganhos garantidos em ativos de renda variável ou multimercados.
                        </p>
                    </div>
                </div>

                {/* Detailed Sections */}
                <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#e4e0d7] shadow-sm space-y-8 text-sm sm:text-base leading-relaxed text-[#344054]">
                    
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-[#123044]">
                            1. Aceitação dos Termos
                        </h2>
                        <p>
                            Ao acessar ou utilizar a plataforma digital e os serviços da <strong>ARVO ORIENTAÇÃO FINANCEIRA INDEPENDENTE</strong> (“ARVO”), o Usuário declara ter lido, compreendido e concordado integralmente com estes Termos de Uso e com a nossa Política de Privacidade.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-[#123044]">
                            2. Objeto e Natureza dos Serviços
                        </h2>
                        <p>
                            A plataforma ARVO disponibiliza ferramentas digitais de diagnóstico financeiro (*Jornada dos 7 Pilares*), simulação de alocação de carteiras recomendadas (*Bússola de Risco*) e planejamento de longo prazo (*Calculadora PL*).
                        </p>
                        <ul className="space-y-2 list-disc pl-5 text-sm text-[#475467]">
                            <li><strong>Independência:</strong> A ARVO atua sob modelo estritamente <em>fee-only</em>, não recebendo comissões, rebates ou remuneração de corretoras ou gestoras de fundos pela indicação de produtos financeiros.</li>
                            <li><strong>Ausência de Custódia:</strong> A ARVO não recebe, não movimenta e não custodia recursos financeiros do Usuário. Todas as aplicações práticas são executadas pelo próprio Usuário em suas contas em instituições financeiras autorizadas pelo Banco Central e CVM.</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-[#123044]">
                            3. Cadastro e Segurança da Conta
                        </h2>
                        <p>
                            O Usuário é o único responsável pela veracidade e exatidão das informações fornecidas na plataforma e pelo sigilo de suas credenciais de acesso (e-mail e senha). Quaisquer operações realizadas a partir de sua conta autenticada serão consideradas de sua responsabilidade exclusiva.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-[#123044]">
                            4. Propriedade Intelectual
                        </h2>
                        <p>
                            Todos os algoritmos, códigos-fonte, estruturas de dados, logotipos, marcas, metodologias de cálculo de risco e design visual são de propriedade exclusiva da ARVO e estão protegidos pelas leis de direitos autorais e propriedade industrial.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-[#123044]">
                            5. Limitação de Responsabilidade
                        </h2>
                        <p>
                            As simulações e diagnósticos gerados pela plataforma baseiam-se em premissas financeiras históricas e nas informações fornecidas pelo próprio Usuário. A decisão final de investimento e a assunção dos riscos de mercado cabem exclusivamente ao Usuário.
                        </p>
                    </section>

                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044]">
                            6. Contato e Foro
                        </h2>
                        <p>
                            Para esclarecimentos ou dúvidas sobre estes Termos de Uso, entre em contato através do e-mail <a href="mailto:contato@meuarvo.com.br" className="text-[#1f674f] font-semibold underline">contato@meuarvo.com.br</a>. Fica eleito o Foro da Comarca do domicílio do Usuário para dirimir eventuais controvérsias relativas a estes Termos.
                        </p>
                    </section>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-[#e4e0d7] py-8 text-center text-xs text-[#8d97a5]">
                <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p>&copy; {new Date().getFullYear()} ARVO Orientação Financeira Independente.</p>
                    <div className="flex items-center gap-4">
                        <Link href="/termos" className="hover:text-[#123044] transition-colors underline">Termos de Uso</Link>
                        <Link href="/politica-de-privacidade" className="hover:text-[#123044] transition-colors underline">Política de Privacidade</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
