import Link from "next/link";
import Image from "next/image";
import { Scale, AlertTriangle, ShieldCheck, FileText, ArrowLeft, Mail, CheckCircle2, TrendingUp, Lock } from "lucide-react";

export const metadata = {
    title: "Termos e Condições de Uso e Contratação | ARVO",
    description: "Termos e Condições Gerais de Uso e Contratação da plataforma Meu Arvo e dos serviços de orientação financeira independente.",
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
            <main className="max-w-4xl mx-auto px-6 py-12 space-y-10">
                {/* Title Section */}
                <div className="space-y-4 text-left">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0ece1] text-[#1f674f] text-xs font-bold tracking-widest uppercase border border-[#e4e0d7]">
                        <Scale className="w-3.5 h-3.5" />
                        Contrato de Licença e Uso
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#123044] leading-tight">
                        Termos e Condições de <span className="font-serif italic font-normal text-[#1f674f]">Uso e Contratação</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-[#667085]">
                        Última atualização: Agosto de 2026 · Versão 2.0
                    </p>
                </div>

                {/* Opening Intro */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e4e0d7] shadow-sm space-y-3 text-[#344054] text-base leading-relaxed">
                    <p className="font-medium text-[#123044] text-lg">
                        Bem-vindo à ARVO.
                    </p>
                    <p>
                        Estes Termos estabelecem as regras para acesso, contratação e utilização da plataforma Meu Arvo, das ferramentas digitais, conteúdos e demais serviços disponibilizados pela <strong>ARVO ORIENTAÇÃO FINANCEIRA INDEPENDENTE</strong> (“ARVO”).
                    </p>
                    <p className="text-sm text-[#667085]">
                        Recomendamos a leitura integral deste documento antes da contratação e utilização da plataforma.
                    </p>
                </div>

                {/* 3 Important Warnings Grid */}
                <div className="space-y-4">
                    <h2 className="text-xs uppercase font-bold tracking-widest text-[#8d97a5]">Avisos importantes antes de começar</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                            <AlertTriangle className="w-5 h-5 text-amber-700" />
                            <h3 className="font-bold text-sm text-amber-950">Investimentos envolvem riscos</h3>
                            <p className="text-xs text-amber-900 leading-relaxed">
                                Rentabilidade passada não garante rentabilidade futura. Projeções e simulações possuem natureza puramente estimativa e não constituem promessa de ganho.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                            <Lock className="w-5 h-5 text-[#1f674f]" />
                            <h3 className="font-bold text-sm text-emerald-950">A ARVO não movimenta seu dinheiro</h3>
                            <p className="text-xs text-emerald-900 leading-relaxed">
                                A ARVO não recebe recursos, não custodia ativos e não opera contas bancárias. Toda decisão de aplicação é realizada exclusivamente por você em suas instituições financeiras.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-2">
                            <ShieldCheck className="w-5 h-5 text-blue-700" />
                            <h3 className="font-bold text-sm text-blue-950">Planejamento e Investimento</h3>
                            <p className="text-xs text-blue-900 leading-relaxed">
                                A ARVO oferece ferramentas de organização patrimonial. Serviços regulados são prestados apenas por profissionais devidamente habilitados e identificados.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Complete Detailed Sections */}
                <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#e4e0d7] shadow-sm space-y-10 text-sm sm:text-base leading-relaxed text-[#344054]">
                    
                    {/* 1. Quem é a ARVO */}
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            1. Quem é a ARVO
                        </h2>
                        <p>A plataforma é disponibilizada por:</p>
                        <div className="p-4 rounded-2xl bg-[#fcfaf7] border border-[#e4e0d7] space-y-1 text-sm">
                            <p><strong>Nome comercial:</strong> ARVO / Meu Arvo</p>
                            <p><strong>Site:</strong> <a href="https://meuarvo.com.br" className="text-[#1f674f] font-semibold underline">meuarvo.com.br</a></p>
                            <p><strong>Contato:</strong> <a href="mailto:contato@meuarvo.com.br" className="text-[#1f674f] font-semibold underline">contato@meuarvo.com.br</a></p>
                        </div>
                        <p className="text-sm text-[#475467]">Neste documento, essa empresa será denominada simplesmente “ARVO”.</p>
                    </section>

                    {/* 2 e 3. Aceitação e Quem pode utilizar */}
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            2. Aceitação dos Termos e Elegibilidade
                        </h2>
                        <p>
                            Ao criar uma conta, contratar um plano ou utilizar a plataforma, o usuário declara concordar integralmente com estes Termos e com a Política de Privacidade.
                        </p>
                        <p>
                            A contratação direta é destinada a pessoas com <strong>18 anos ou mais</strong> e civilmente capazes. O usuário compromete-se a fornecer informações financeiras e cadastrais verdadeiras, completas e atualizadas.
                        </p>
                    </section>

                    {/* 4. O que é a ARVO */}
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            4. O que é a ARVO e Funcionalidades
                        </h2>
                        <p>
                            A ARVO é uma plataforma voltada à organização da vida financeira, planejamento patrimonial e apoio à tomada de decisões. Dependendo do plano contratado, fazem parte da experiência:
                        </p>
                        <ul className="grid sm:grid-cols-2 gap-2 text-sm text-[#475467] pt-1">
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1f674f] shrink-0" /> Jornada dos 7 Pilares;</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1f674f] shrink-0" /> Organização financeira e diagnóstico;</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1f674f] shrink-0" /> Avaliação da reserva de emergência;</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1f674f] shrink-0" /> Calculadora PL (Patrimônio Líquido);</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1f674f] shrink-0" /> Bússola de Alocação de Risco;</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1f674f] shrink-0" /> Carteiras-modelo e acompanhamento;</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1f674f] shrink-0" /> Relatórios patrimoniais personalizados;</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1f674f] shrink-0" /> Atendimento e orientação humana.</li>
                        </ul>
                    </section>

                    {/* 5, 6 e 7. Planejamento, Bússola e Carteiras */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            5. Planejamento, Perfis e Carteiras-Modelo
                        </h2>
                        <div className="space-y-3 text-sm text-[#475467]">
                            <p>
                                <strong>Planejamento Financeiro:</strong> As projeções utilizam premissas econômicas e dados do usuário. Uma projeção financeira é uma estimativa de cenários e não uma garantia exata do futuro.
                            </p>
                            <p>
                                <strong>Perfis de Risco (Abrigo, Ritmo, Visão e Oceano):</strong> A classificação é um instrumento metodológico de apoio para orientar a diversificação e não significa autorização para movimentar investimentos.
                            </p>
                            <p>
                                <strong>Carteiras-Modelo:</strong> As composições de alocação representam modelos teóricos calibrados que podem ser atualizados periodicamente conforme a dinâmica macroeconômica.
                            </p>
                        </div>
                    </section>

                    {/* 8 e 9. Independência e Modelo Fee-Only */}
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            9. Independência e Modelo Fee-Only
                        </h2>
                        <div className="p-4 rounded-2xl bg-[#f0ece1]/50 border border-[#e4e0d7] space-y-2 text-sm text-[#344054]">
                            <p className="font-bold text-[#123044]">Compromisso de Alinhamento Exclusivo com o Cliente:</p>
                            <p>
                                A ARVO <strong>não recebe comissão, rebate ou remuneração de bancos, corretoras ou gestoras</strong> pela indicação ou inclusão de determinados produtos nas carteiras apresentadas. Nossa principal remuneração decorre unicamente dos valores pagos pelos próprios clientes pela contratação da plataforma e dos serviços.
                            </p>
                        </div>
                    </section>

                    {/* 10 e 11. Riscos de Investimento Detalhados */}
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            11. Riscos dos Investimentos
                        </h2>
                        <p className="text-sm text-[#475467]">O usuário reconhece que todo investimento envolve riscos, incluindo:</p>
                        <div className="grid sm:grid-cols-2 gap-3 text-xs sm:text-sm text-[#475467]">
                            <div className="p-3 rounded-xl bg-[#fcfaf7] border border-[#e4e0d7]">
                                <strong className="text-[#123044]">Risco de Mercado:</strong> Oscilações de preços e índices econômicos.
                            </div>
                            <div className="p-3 rounded-xl bg-[#fcfaf7] border border-[#e4e0d7]">
                                <strong className="text-[#123044]">Risco de Crédito:</strong> Possibilidade de inadimplência de emissores ou devedores.
                            </div>
                            <div className="p-3 rounded-xl bg-[#fcfaf7] border border-[#e4e0d7]">
                                <strong className="text-[#123044]">Risco de Liquidez:</strong> Dificuldade em resgatar no prazo ou valor esperado.
                            </div>
                            <div className="p-3 rounded-xl bg-[#fcfaf7] border border-[#e4e0d7]">
                                <strong className="text-[#123044]">Risco Cambial e Juros:</strong> Oscilações nas moedas estrangeiras e na curva de juros.
                            </div>
                        </div>
                    </section>

                    {/* 15. Inteligência Artificial */}
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            15. Inteligência Artificial e Automação
                        </h2>
                        <p className="text-sm text-[#475467]">
                            A plataforma poderá utilizar IA e algoritmos como ferramentas auxiliares de cálculo, categorização de ativos e apoio ao atendimento. A IA não possui poder de movimentação patrimonial e os dados pessoais seguem estritamente nossa Política de Privacidade.
                        </p>
                    </section>

                    {/* 16 a 18. Segurança da Conta e Condutas Proibidas */}
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            16. Segurança da Conta e Condutas Proibidas
                        </h2>
                        <p className="text-sm text-[#475467]">
                            Cada conta é individual e intransferível. É expressamente proibido utilizar a plataforma para atividades ilícitas, tentar violar mecanismos de autenticação, realizar raspagem de dados (*scraping*) ou comercializar relatórios protegidos por propriedade intelectual da ARVO.
                        </p>
                    </section>

                    {/* 22 a 28. Planos, Cobrança, Arrependimento e Cancelamento */}
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            22. Planos, Contratação, Cancelamento e Arrependimento
                        </h2>
                        <div className="space-y-3 text-sm text-[#475467]">
                            <p>
                                <strong>Direito de Arrependimento (CDC):</strong> O consumidor poderá exercer o direito legal de arrependimento no prazo de <strong>7 (sete) dias</strong> a contar da contratação, com reembolso integral dos valores pagos.
                            </p>
                            <p>
                                <strong>Cancelamento de Assinaturas:</strong> O cancelamento de planos recorrentes pode ser solicitado a qualquer momento pelos canais de suporte, cessando futuras renovações e mantendo o acesso até o fim do período vigente já quitado.
                            </p>
                        </div>
                    </section>

                    {/* 32. Decisão e Execução dos Investimentos */}
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            32. Decisão e Execução dos Investimentos
                        </h2>
                        <p className="text-sm text-[#475467]">
                            A decisão final de investir e a execução das ordens cabem exclusivamente ao usuário em suas respectivas contas nas instituições financeiras de sua escolha. A ARVO não se responsabiliza por operações executadas em desconformidade com as orientações ou por variações normais de mercado.
                        </p>
                    </section>

                    {/* 43 e 44. Foro, Legislação e Contato */}
                    <section className="space-y-4 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044]">
                            Legislação Aplicável, Foro e Contato
                        </h2>
                        <p className="text-sm text-[#475467]">
                            Estes Termos são regidos pelas leis da República Federativa do Brasil, sendo assegurado ao consumidor o acesso ao foro de seu domicílio.
                        </p>
                        <div className="p-6 rounded-2xl bg-[#f0ece1]/60 border border-[#e4e0d7] space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-[#1f674f]" />
                                <p><strong>Dúvidas gerais e suporte:</strong> <a href="mailto:contato@meuarvo.com.br" className="text-[#1f674f] font-bold underline">contato@meuarvo.com.br</a></p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-[#1f674f]" />
                                <p><strong>Privacidade e dados:</strong> <a href="mailto:privacidade@meuarvo.com.br" className="text-[#1f674f] font-bold underline">privacidade@meuarvo.com.br</a></p>
                            </div>
                        </div>

                        {/* Closing Commitment */}
                        <div className="pt-4 text-center space-y-2 border-t border-[#e4e0d7]/60">
                            <p className="font-serif italic text-lg text-[#123044]">
                                &ldquo;Boas decisões financeiras começam com planejamento, diversificação, compreensão dos riscos e alinhamento entre patrimônio e objetivos de vida.&rdquo;
                            </p>
                            <p className="text-xs font-bold text-[#1f674f] uppercase tracking-widest">
                                ARVO Orientação Financeira Independente
                            </p>
                        </div>
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
