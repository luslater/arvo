import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft, CheckCircle2 } from "lucide-react";

export const metadata = {
    title: "Política de Privacidade | ARVO Orientação Financeira",
    description: "Saiba como a ARVO protege e trata seus dados pessoais e financeiros em conformidade com a LGPD (Lei nº 13.709/2018).",
};

export default function PoliticaPrivacidadePage() {
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
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Conformidade LGPD (Lei nº 13.709/2018)
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#123044] leading-tight">
                        Política de <span className="font-serif italic font-normal text-[#1f674f]">Privacidade e Proteção de Dados</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-[#667085]">
                        Última atualização: Agosto de 2026 · Versão 1.2
                    </p>
                </div>

                {/* Highlights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl bg-white border border-[#e4e0d7] space-y-2">
                        <Lock className="w-5 h-5 text-[#1f674f]" />
                        <h2 className="font-bold text-sm text-[#123044]">Criptografia de Ponta a Ponta</h2>
                        <p className="text-xs text-[#667085] leading-relaxed">
                            Seus dados financeiros trafegam sob TLS 1.3 e senhas são protegidas com hashes irreversíveis Bcrypt.
                        </p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white border border-[#e4e0d7] space-y-2">
                        <Eye className="w-5 h-5 text-[#1f674f]" />
                        <h2 className="font-bold text-sm text-[#123044]">Filosofia Fee-Only</h2>
                        <p className="text-xs text-[#667085] leading-relaxed">
                            Não vendemos, não compartilhamos e não monetizamos seus dados para corretoras, bancos ou anunciantes.
                        </p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white border border-[#e4e0d7] space-y-2">
                        <FileText className="w-5 h-5 text-[#1f674f]" />
                        <h2 className="font-bold text-sm text-[#123044]">Controle Total do Titular</h2>
                        <p className="text-xs text-[#667085] leading-relaxed">
                            Você pode solicitar a exportação, retificação ou exclusão total dos seus dados a qualquer momento.
                        </p>
                    </div>
                </div>

                {/* Detailed Sections */}
                <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#e4e0d7] shadow-sm space-y-8 text-sm sm:text-base leading-relaxed text-[#344054]">
                    
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-[#123044] flex items-center gap-2">
                            1. Quem é o Controlador dos seus Dados
                        </h2>
                        <p>
                            A <strong>ARVO ORIENTAÇÃO FINANCEIRA INDEPENDENTE</strong> (“ARVO”) é a entidade controladora responsável pelas decisões referentes ao tratamento de dados pessoais coletados nesta plataforma SaaS, comprometendo-se com a transparência, privacidade e rigorosa segurança da informação.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-[#123044] flex items-center gap-2">
                            2. Dados que Coletamos
                        </h2>
                        <p>Para proporcionar o planejamento financeiro e a calibração de carteiras recomendadas, coletamos:</p>
                        <ul className="space-y-2 list-disc pl-5 text-sm text-[#475467]">
                            <li><strong>Dados Cadastrais:</strong> Nome completo, endereço de e-mail, telefone (WhatsApp) e documento (CPF) para identificação única e autenticação segura.</li>
                            <li><strong>Dados Financeiros e de Suitability (Jornada):</strong> Renda mensal (fixa e variável), gastos essenciais e estilo de vida, reserva de emergência guardada, patrimônio atual investido, ativos informados e objetivos de aposentadoria/prazos.</li>
                            <li><strong>Dados Técnicos de Navegação:</strong> Endereço IP, registros de data/hora de acesso (logs), tipo de navegador e identificadores de sessão criptografados.</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-[#123044] flex items-center gap-2">
                            3. Finalidade do Tratamento dos Dados
                        </h2>
                        <p>Seus dados são utilizados estritamente para as seguintes finalidades legítimas:</p>
                        <ul className="space-y-2 list-disc pl-5 text-sm text-[#475467]">
                            <li>Diagnóstico e cálculo do seu Perfil de Investidor (*Abrigo, Ritmo, Visão ou Oceano*).</li>
                            <li>Exibição e simulação da alocação ideal de carteiras recomendadas na <strong>Bússola</strong> e projeções na <strong>Calculadora PL</strong>.</li>
                            <li>Comunicação institucional, envio de relatórios solicitados e suporte direto pelo time de orientação.</li>
                            <li>Segurança e prevenção a fraudes (rate limiting, bloqueio de tentativas indevidas de login e autenticação em dois fatores - MFA).</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-[#123044] flex items-center gap-2">
                            4. Segurança e Armazenamento
                        </h2>
                        <p>
                            Adotamos medidas técnicas e administrativas aptas a proteger seus dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração ou vazamento:
                        </p>
                        <ul className="space-y-2 list-disc pl-5 text-sm text-[#475467]">
                            <li><strong>Isolamento Multi-Tenant:</strong> Cada usuário possui seus dados isolados estruturalmente no banco de dados relacional (PostgreSQL).</li>
                            <li><strong>Criptografia em Trânsito:</strong> Toda comunicação é protegida por HTTPS com certificados SSL/TLS de 256 bits e protocolo HSTS.</li>
                            <li><strong>Proteção de Senhas:</strong> As senhas são submetidas a funções criptográficas unidirecionais (*Bcrypt com 10 rounds de salt*), tornando impossível sua leitura por terceiros.</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-[#123044] flex items-center gap-2">
                            5. Seus Direitos como Titular (Art. 18 da LGPD)
                        </h2>
                        <p>A qualquer momento, você pode exercer seus direitos legais previstos na LGPD, incluindo:</p>
                        <div className="grid sm:grid-cols-2 gap-2 text-xs sm:text-sm text-[#344054] pt-2">
                            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#fcfaf7] border border-[#e4e0d7]">
                                <CheckCircle2 className="w-4 h-4 text-[#1f674f] shrink-0" />
                                Confirmação da existência de tratamento
                            </div>
                            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#fcfaf7] border border-[#e4e0d7]">
                                <CheckCircle2 className="w-4 h-4 text-[#1f674f] shrink-0" />
                                Acesso e exportação aos seus dados
                            </div>
                            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#fcfaf7] border border-[#e4e0d7]">
                                <CheckCircle2 className="w-4 h-4 text-[#1f674f] shrink-0" />
                                Correção de dados incompletos ou inexatos
                            </div>
                            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#fcfaf7] border border-[#e4e0d7]">
                                <CheckCircle2 className="w-4 h-4 text-[#1f674f] shrink-0" />
                                Eliminação definitiva dos dados pessoais
                            </div>
                        </div>
                    </section>

                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] flex items-center gap-2">
                            6. Canal de Atendimento do Encarregado (DPO)
                        </h2>
                        <p>
                            Para dúvidas sobre esta Política de Privacidade ou para solicitar o exercício de qualquer um dos seus direitos, entre em contato diretamente com nosso Encarregado de Proteção de Dados:
                        </p>
                        <div className="p-4 rounded-2xl bg-[#f0ece1]/50 border border-[#e4e0d7] text-sm">
                            <p><strong>E-mail de Privacidade:</strong> <a href="mailto:privacidade@meuarvo.com.br" className="text-[#1f674f] font-semibold underline">privacidade@meuarvo.com.br</a></p>
                            <p className="mt-1 text-xs text-[#667085]">Atendimento em dias úteis com prazo de resposta em até 48 horas.</p>
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
