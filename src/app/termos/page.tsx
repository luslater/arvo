import Link from "next/link";
import Image from "next/image";
import { Scale, AlertTriangle, ShieldCheck, ArrowLeft, Mail, CheckCircle2, Lock, FileText, Globe } from "lucide-react";

export const metadata = {
    title: "Termos e Condições de Uso e Contratação | ARVO",
    description: "Termos e Condições Gerais de Uso e Contratação da plataforma Meu Arvo e dos serviços de orientação financeira independente (Versão 2.0).",
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
                        Contrato de Uso e Licenciamento
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
                        Recomendamos a leitura integral deste documento antes da contratação.
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
                                Todo investimento envolve algum nível de risco (mercado, crédito, liquidez, juros, inflação, câmbio, concentração). Rentabilidade passada não representa garantia futura. Projeções e simulações possuem natureza puramente estimativa.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                            <Lock className="w-5 h-5 text-[#1f674f]" />
                            <h3 className="font-bold text-sm text-emerald-950">A ARVO não movimenta seu dinheiro</h3>
                            <p className="text-xs text-emerald-900 leading-relaxed">
                                A ARVO não recebe recursos para investimento, não mantém contas, não exerce custódia de ativos e não executa ordens de compra/venda. As decisões e operações são realizadas pelo próprio usuário em suas instituições financeiras.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-2">
                            <ShieldCheck className="w-5 h-5 text-blue-700" />
                            <h3 className="font-bold text-sm text-blue-950">Planejamento e Investimento</h3>
                            <p className="text-xs text-blue-900 leading-relaxed">
                                Planejamento financeiro e investimentos são juridicamente distintos. Serviços regulados que configurem consultoria de valores mobiliários somente serão prestados por pessoas habilitadas e identificadas na contratação.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Complete Detailed 44 Sections */}
                <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#e4e0d7] shadow-sm space-y-8 text-sm sm:text-base leading-relaxed text-[#344054]">
                    
                    {/* 1 */}
                    <section className="space-y-2">
                        <h2 className="text-lg font-bold text-[#123044]">1. Quem é a ARVO</h2>
                        <p className="text-[#475467]">A plataforma é disponibilizada por:</p>
                        <div className="p-4 rounded-2xl bg-[#fcfaf7] border border-[#e4e0d7] space-y-1 text-sm">
                            <p><strong>Nome comercial:</strong> ARVO / Meu Arvo</p>
                            <p><strong>Site:</strong> <a href="https://meuarvo.com.br" className="text-[#1f674f] font-semibold underline">meuarvo.com.br</a></p>
                            <p><strong>Contato:</strong> <a href="mailto:contato@meuarvo.com.br" className="text-[#1f674f] font-semibold underline">contato@meuarvo.com.br</a></p>
                        </div>
                        <p className="text-sm text-[#475467]">Neste documento, essa empresa será denominada simplesmente “ARVO”.</p>
                    </section>

                    {/* 2 */}
                    <section className="space-y-2 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-lg font-bold text-[#123044]">2. Aceitação destes Termos</h2>
                        <p className="text-[#475467]">
                            Ao criar uma conta, contratar um plano ou utilizar funcionalidades sujeitas a estes Termos, o usuário declara que teve acesso ao documento e concorda com suas disposições. A utilização também está sujeita à Política de Privacidade e Proteção de Dados, às ofertas comerciais e a eventuais termos específicos.
                        </p>
                    </section>

                    {/* 3 */}
                    <section className="space-y-2 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-lg font-bold text-[#123044]">3. Quem pode utilizar a plataforma</h2>
                        <p className="text-[#475467]">
                            A contratação direta dos serviços da ARVO é destinada a pessoas com 18 anos ou mais e civilmente capazes. O usuário compromete-se a fornecer informações verdadeiras, completas e atualizadas.
                        </p>
                    </section>

                    {/* 4 */}
                    <section className="space-y-2 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-lg font-bold text-[#123044]">4. O que é a ARVO</h2>
                        <p className="text-[#475467]">
                            A ARVO é uma plataforma voltada à organização da vida financeira, planejamento patrimonial e apoio à tomada de decisões financeiras. Dependendo do plano contratado, fazem parte da experiência: Jornada dos 7 Pilares, organização financeira, diagnóstico patrimonial, planejamento de objetivos e aposentadoria, Calculadora PL, Bússola de Risco, simulações de alocação, carteiras-modelo, relatórios e atendimento humano.
                        </p>
                    </section>

                    {/* 5 */}
                    <section className="space-y-2 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-lg font-bold text-[#123044]">5. Planejamento financeiro</h2>
                        <p className="text-[#475467]">
                            As ferramentas utilizam premissas econômicas e dados do usuário para apresentar diagnósticos e cenários. Os resultados dependem da qualidade das informações fornecidas. Uma projeção financeira não é uma previsão exata do futuro; inflação, juros, rentabilidade e tributação podem evoluir de maneira diferente daquela utilizada na simulação.
                        </p>
                    </section>

                    {/* 6 */}
                    <section className="space-y-2 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-lg font-bold text-[#123044]">6. Perfil financeiro e Bússola</h2>
                        <p className="text-[#475467]">
                            A classificação do usuário nos perfis metodológicos da ARVO (<strong>Abrigo, Ritmo, Visão e Oceano</strong>) é uma ferramenta de apoio. Ela não elimina riscos, não garante desempenho e não substitui a atualização periódica das informações patrimoniais pelo usuário.
                        </p>
                    </section>

                    {/* 7 */}
                    <section className="space-y-2 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-lg font-bold text-[#123044]">7. Carteiras-modelo e alocações</h2>
                        <p className="text-[#475467]">
                            As carteiras-modelo representam composições construídas a partir de premissas de risco, liquidez e diversificação. Não representam promessa de rentabilidade ou preservação de patrimônio, podendo ter sua composição atualizada ao longo do tempo.
                        </p>
                    </section>

                    {/* 8 */}
                    <section className="space-y-2 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-lg font-bold text-[#123044]">8. Recomendações individualizadas e serviços regulados</h2>
                        <p className="text-[#475467]">
                            A simples disponibilização da plataforma não constitui contratação de atividade regulada. Recomendações individualizadas que configurem atividade regulada identificarão o responsável habilitado na contratação, mantendo o controle e a decisão dos recursos sempre sob o cliente.
                        </p>
                    </section>

                    {/* 9 */}
                    <section className="space-y-2 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-lg font-bold text-[#123044]">9. Independência e modelo Fee-Only</h2>
                        <div className="p-4 rounded-2xl bg-[#f0ece1]/50 border border-[#e4e0d7] text-sm text-[#344054] space-y-1">
                            <p className="font-bold text-[#123044]">Compromisso Fee-Only:</p>
                            <p>
                                A ARVO não recebe comissão, rebate ou remuneração de bancos, corretoras ou gestoras pela indicação de produtos financeiros. A remuneração decorre unicamente dos valores pagos pelos próprios clientes pelos planos contratados.
                            </p>
                        </div>
                    </section>

                    {/* 10 e 11 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-lg font-bold text-[#123044]">10 e 11. Ausência de garantia de resultado e Riscos dos investimentos</h2>
                        <p className="text-[#475467]">
                            Nenhuma informação apresentada constitui garantia de rentabilidade, preservação de capital ou liquidez. Investimentos envolvem <strong>risco de mercado, crédito, liquidez, juros, inflação, câmbio, concentração, regulatório e tributário</strong>.
                        </p>
                    </section>

                    {/* 12, 13 e 14 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-lg font-bold text-[#123044]">12 a 14. Produtos restritos, Dados de mercado e Rentabilidade histórica</h2>
                        <p className="text-[#475467]">
                            Investimentos restritos (ex: Investidor Qualificado) exigem atendimento aos requisitos legais pelo usuário. Dados e cotações de terceiros são informativos e não substituem os extratos oficiais das instituições custodiantes. Retornos históricos são ilustrações passadas e não previsões futuras.
                        </p>
                    </section>

                    {/* 15 */}
                    <section className="space-y-2 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-lg font-bold text-[#123044]">15. Inteligência Artificial e sistemas automatizados</h2>
                        <p className="text-[#475467]">
                            A IA e os algoritmos atuam como ferramentas auxiliares de cálculo, categorização e suporte. O uso de IA não autoriza o sistema a movimentar investimentos, e os dados pessoais seguem estritamente a Política de Privacidade.
                        </p>
                    </section>

                    {/* 16, 17 e 18 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-lg font-bold text-[#123044]">16 a 18. Cadastro, Segurança da conta e Condutas proibidas</h2>
                        <p className="text-[#475467]">
                            Cada conta é pessoal e intransferível. É proibido praticar atividades ilícitas, violar autenticações, realizar scraping, reproduzir bases proprietárias ou revender relatórios. A ARVO nunca solicita senha completa por e-mail ou WhatsApp e poderá suspender temporariamente acessos com indícios de fraude ou violação.
                        </p>
                    </section>

                    {/* 19, 20 e 21 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-lg font-bold text-[#123044]">19 a 21. Propriedade intelectual e Conteúdo do usuário</h2>
                        <p className="text-[#475467]">
                            A marca ARVO, códigos, softwares, algoritmos, metodologias e relatórios são de propriedade exclusiva da ARVO, concedendo-se ao usuário apenas licença de uso pessoal e não comercial. Os dados financeiros inseridos pertencem ao usuário, autorizando-se o processamento estritamente para os serviços contratados.
                        </p>
                    </section>

                    {/* 22 a 28 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-lg font-bold text-[#123044]">22 a 28. Planos, Assinaturas, Arrependimento e Cancelamento</h2>
                        <div className="space-y-2 text-sm text-[#475467]">
                            <p>
                                <strong>Direito de Arrependimento (CDC):</strong> Nas hipóteses legais do Código de Defesa do Consumidor, o prazo de desistência é de <strong>7 (sete) dias</strong> a partir da contratação, com reembolso integral dos valores pagos.
                            </p>
                            <p>
                                <strong>Cancelamento de Assinaturas:</strong> Assinaturas recorrentes podem ser canceladas a qualquer momento, evitando cobranças futuras e mantendo o acesso até o término do ciclo já pago.
                            </p>
                            <p>
                                <strong>Inadimplência:</strong> Cobranças não liquidadas poderão ensejar suspensão temporária dos serviços pagos, sem retenção indevida de dados do titular.
                            </p>
                        </div>
                    </section>

                    {/* 29 a 34 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-lg font-bold text-[#123044]">29 a 34. Disponibilidade, Integrações de terceiros e Limites das simulações</h2>
                        <p className="text-[#475467]">
                            A ARVO busca manter a plataforma funcional, podendo haver paradas programadas de manutenção. A decisão e execução de ordens pertencem exclusivamente ao usuário. As simulações trabalham com premissas matemáticas e os conteúdos não substituem consultoria jurídica, contábil ou tributária formal.
                        </p>
                    </section>

                    {/* 35 a 42 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-lg font-bold text-[#123044]">35 a 42. Responsabilidades, Comunicações e Alterações</h2>
                        <p className="text-[#475467]">
                            A ARVO responde pelos serviços nos limites legais. O usuário é responsável por manter dados verdadeiros e atualizados. A ARVO poderá evoluir funcionalidades e atualizar estes Termos para refletir melhorias técnicas e normativas.
                        </p>
                    </section>

                    {/* 43 e 44 */}
                    <section className="space-y-4 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-lg font-bold text-[#123044]">43 e 44. Legislação Aplicável, Foro e Contato</h2>
                        <p className="text-sm text-[#475467]">
                            Estes Termos são regidos pela legislação brasileira, sendo assegurado ao consumidor o foro de seu domicílio para dirimir controvérsias.
                        </p>
                        <div className="p-6 rounded-2xl bg-[#f0ece1]/60 border border-[#e4e0d7] space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-[#1f674f]" />
                                <p><strong>Dúvidas e suporte:</strong> <a href="mailto:contato@meuarvo.com.br" className="text-[#1f674f] font-bold underline">contato@meuarvo.com.br</a></p>
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
