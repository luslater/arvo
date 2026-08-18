import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft, CheckCircle2, AlertCircle, Mail, Globe } from "lucide-react";

export const metadata = {
    title: "Política de Privacidade e Proteção de Dados | ARVO",
    description: "Política de Privacidade e Proteção de Dados da ARVO / Meu Arvo em estrita conformidade com a LGPD (Lei nº 13.709/2018).",
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
            <main className="max-w-4xl mx-auto px-6 py-12 space-y-10">
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
                        Última atualização: Agosto de 2026 · Versão 2.0
                    </p>
                </div>

                {/* Opening Intro */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e4e0d7] shadow-sm space-y-4 text-[#344054] text-base leading-relaxed">
                    <p className="font-medium text-[#123044] text-lg">
                        A sua vida financeira contém algumas das informações mais importantes sobre você.
                    </p>
                    <p>
                        Na <strong>ARVO</strong>, proteger essas informações faz parte da confiança necessária para oferecer planejamento e orientação financeira independente.
                    </p>
                    <p>
                        Esta Política explica, de maneira clara, quais dados pessoais podemos tratar, para quais finalidades, com quem eles podem ser compartilhados, por quanto tempo poderão ser mantidos e quais são os seus direitos.
                    </p>
                    <p className="text-sm text-[#667085] pt-2 border-t border-[#e4e0d7]">
                        Nossa atuação segue os princípios da <strong>Lei nº 13.709/2018 — Lei Geral de Proteção de Dados Pessoais (“LGPD”)</strong>, incluindo finalidade, adequação, necessidade, transparência, segurança, prevenção e responsabilização.
                    </p>
                </div>

                {/* 4 Pillars Grid */}
                <div className="space-y-4">
                    <h2 className="text-xs uppercase font-bold tracking-widest text-[#8d97a5]">Nossos compromissos</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-6 rounded-2xl bg-white border border-[#e4e0d7] space-y-2">
                            <Eye className="w-5 h-5 text-[#1f674f]" />
                            <h3 className="font-bold text-sm text-[#123044]">Seus dados não são nosso produto</h3>
                            <p className="text-xs text-[#667085] leading-relaxed">
                                O modelo de negócio da ARVO não é baseado na venda ou comercialização de dados pessoais. Não vendemos, alugamos ou comercializamos seus dados pessoais com bancos, corretoras, gestoras, anunciantes ou outras empresas.
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white border border-[#e4e0d7] space-y-2">
                            <FileText className="w-5 h-5 text-[#1f674f]" />
                            <h3 className="font-bold text-sm text-[#123044]">Coletamos somente o necessário</h3>
                            <p className="text-xs text-[#667085] leading-relaxed">
                                Buscamos limitar a coleta de informações ao que é efetivamente necessário para funcionamento da plataforma, segurança, planejamento financeiro e prestação dos serviços contratados.
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white border border-[#e4e0d7] space-y-2">
                            <Lock className="w-5 h-5 text-[#1f674f]" />
                            <h3 className="font-bold text-sm text-[#123044]">Segurança desde a concepção</h3>
                            <p className="text-xs text-[#667085] leading-relaxed">
                                A ARVO busca incorporar privacidade e segurança desde a criação de novas funcionalidades, adotando controles de acesso, segregação de informações, proteção das comunicações e registro de eventos relevantes.
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white border border-[#e4e0d7] space-y-2">
                            <CheckCircle2 className="w-5 h-5 text-[#1f674f]" />
                            <h3 className="font-bold text-sm text-[#123044]">Você tem controle</h3>
                            <p className="text-xs text-[#667085] leading-relaxed">
                                Você poderá solicitar acesso, correção, informações sobre compartilhamento, portabilidade, oposição ou exclusão dos seus dados, conforme aplicável e observadas as hipóteses legais de conservação.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Complete Detailed Sections */}
                <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#e4e0d7] shadow-sm space-y-10 text-sm sm:text-base leading-relaxed text-[#344054]">
                    
                    {/* 1. Quem é responsável */}
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            1. Quem é responsável pelos seus dados
                        </h2>
                        <p>
                            Para fins da LGPD, a responsável pelas decisões relacionadas ao tratamento de dados pessoais realizado no âmbito da plataforma Meu Arvo é:
                        </p>
                        <div className="p-4 rounded-2xl bg-[#fcfaf7] border border-[#e4e0d7] space-y-1 text-sm">
                            <p><strong>Nome comercial:</strong> ARVO / Meu Arvo</p>
                            <p><strong>Site:</strong> <a href="https://meuarvo.com.br" className="text-[#1f674f] font-semibold underline">meuarvo.com.br</a></p>
                            <p><strong>Canal de Privacidade:</strong> <a href="mailto:privacidade@meuarvo.com.br" className="text-[#1f674f] font-semibold underline">privacidade@meuarvo.com.br</a></p>
                        </div>
                        <p>
                            Nesta Política, utilizaremos simplesmente o termo “ARVO”. Quando a ARVO determina as finalidades e os meios essenciais de tratamento dos seus dados pessoais, atua como <strong>Controladora</strong>. Empresas contratadas para executar determinadas atividades em nome da ARVO poderão atuar como <strong>Operadoras</strong>, observadas as obrigações contratuais e legais aplicáveis.
                        </p>
                    </section>

                    {/* 2. A quem se aplica */}
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            2. A quem esta Política se aplica
                        </h2>
                        <p>Esta Política se aplica às pessoas que:</p>
                        <ul className="grid sm:grid-cols-2 gap-2 text-sm text-[#475467] pt-1">
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#1f674f]" /> acessam o site da ARVO;</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#1f674f]" /> criam uma conta;</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#1f674f]" /> utilizam a plataforma Meu Arvo;</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#1f674f]" /> preenchem questionários, jornadas ou simuladores;</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#1f674f]" /> informam sua situação financeira ou carteira;</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#1f674f]" /> contratam produtos ou serviços da ARVO;</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#1f674f]" /> entram em contato com nosso time;</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#1f674f]" /> participam de reuniões de orientação;</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#1f674f]" /> recebem comunicações da ARVO.</li>
                        </ul>
                        <p className="text-xs text-[#667085] pt-1">
                            Esta Política não substitui os Termos de Uso, contratos específicos ou avisos de privacidade apresentados em funcionalidades que exijam informações adicionais.
                        </p>
                    </section>

                    {/* 3. Quais dados podemos tratar */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            3. Quais dados podemos tratar
                        </h2>
                        <p>Os dados tratados dependem das funcionalidades que você utilizar:</p>
                        
                        <div className="space-y-4 text-sm">
                            <div className="p-4 rounded-xl bg-[#fcfaf7] border border-[#e4e0d7] space-y-1">
                                <h3 className="font-bold text-[#123044]">3.1. Dados cadastrais e de identificação</h3>
                                <p className="text-[#475467]">Nome completo, CPF, data de nascimento, e-mail, telefone e WhatsApp, e informações necessárias para criação e manutenção da conta. Utilizados para identificação, autenticação, comunicação, prevenção a fraudes e prestação do serviço.</p>
                            </div>

                            <div className="p-4 rounded-xl bg-[#fcfaf7] border border-[#e4e0d7] space-y-1">
                                <h3 className="font-bold text-[#123044]">3.2. Dados financeiros e patrimoniais</h3>
                                <p className="text-[#475467]">Renda, rendimentos fixos e variáveis, despesas essenciais e estilo de vida, capacidade de poupança, aportes mensais, reserva de emergência, patrimônio financeiro e imobiliário, dívidas, valores investidos, instituições financeiras utilizadas, produtos/ativos presentes na carteira, liquidez, prazos e histórico informado. Aplicamos proteção compatível com sua alta criticidade.</p>
                            </div>

                            <div className="p-4 rounded-xl bg-[#fcfaf7] border border-[#e4e0d7] space-y-1">
                                <h3 className="font-bold text-[#123044]">3.3. Dados sobre objetivos e planejamento financeiro</h3>
                                <p className="text-[#475467]">Objetivos financeiros, prazo de cada objetivo, intenção de compra de bens/imóveis, planejamento de aposentadoria, patrimônio desejado, renda futura desejada, horizonte de investimentos, tolerância a oscilações e experiência com investimentos.</p>
                            </div>

                            <div className="p-4 rounded-xl bg-[#fcfaf7] border border-[#e4e0d7] space-y-1">
                                <h3 className="font-bold text-[#123044]">3.4. Dados relacionados ao perfil financeiro e de investimento</h3>
                                <p className="text-[#475467]">Respostas para identificar capacidade, necessidade e disposição para assumir riscos, incluindo a classificação nos perfis <strong>Abrigo, Ritmo, Visão e Oceano</strong>. Essas classificações são instrumentos de apoio ao planejamento e não significam autorização para a ARVO executar operações financeiras em seu nome.</p>
                            </div>

                            <div className="p-4 rounded-xl bg-[#fcfaf7] border border-[#e4e0d7] space-y-1">
                                <h3 className="font-bold text-[#123044]">3.5. Dados de utilização da plataforma</h3>
                                <p className="text-[#475467]">Funcionalidades acessadas, jornadas concluídas, simulações realizadas, relatórios gerados, configurações, preferências e alterações relevantes realizadas na conta.</p>
                            </div>

                            <div className="p-4 rounded-xl bg-[#fcfaf7] border border-[#e4e0d7] space-y-1">
                                <h3 className="font-bold text-[#123044]">3.6. Dados técnicos e registros de acesso</h3>
                                <p className="text-[#475467]">Endereço IP, data e horário de acesso, navegador, sistema operacional, tipo de dispositivo, identificadores de sessão, registros de autenticação, tentativas de acesso e eventos de segurança.</p>
                            </div>

                            <div className="p-4 rounded-xl bg-[#fcfaf7] border border-[#e4e0d7] space-y-1">
                                <h3 className="font-bold text-[#123044]">3.7. Dados de atendimento e relacionamento</h3>
                                <p className="text-[#475467]">Mensagens, e-mails, conversas pelo WhatsApp, solicitações de suporte, dúvidas e registros de atendimento. Reuniões gravadas serão informadas previamente.</p>
                            </div>

                            <div className="p-4 rounded-xl bg-[#fcfaf7] border border-[#e4e0d7] space-y-1">
                                <h3 className="font-bold text-[#123044]">3.8. Dados de pagamento</h3>
                                <p className="text-[#475467]">Para serviços pagos, dados de identificação da transação e emissão fiscal. Dados completos de cartão são processados diretamente por gateways de pagamento especializados sem retenção pela ARVO.</p>
                            </div>

                            <div className="p-4 rounded-xl bg-[#fcfaf7] border border-[#e4e0d7] space-y-1">
                                <h3 className="font-bold text-[#123044]">3.9. Informações de familiares ou dependentes</h3>
                                <p className="text-[#475467]">Informações sobre cônjuge ou dependentes estritamente necessárias para o planejamento familiar, conforme fornecidas pelo usuário.</p>
                            </div>
                        </div>
                    </section>

                    {/* 4. Como obtemos */}
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            4. Como obtemos os dados
                        </h2>
                        <ul className="space-y-2 list-disc pl-5 text-sm text-[#475467]">
                            <li><strong>Diretamente de você:</strong> Ao criar conta, preencher a jornada, cadastrar investimentos, utilizar simuladores ou conversar com nosso time.</li>
                            <li><strong>Automaticamente:</strong> Por meio de cookies, logs e tecnologias estritamente necessárias à segurança e ao funcionamento.</li>
                            <li><strong>A partir de terceiros autorizados ou fontes públicas:</strong> Mediante sua prévia solicitação/autorização ou com base legal adequada.</li>
                        </ul>
                    </section>

                    {/* 5. Integrações Financeiras */}
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            5. Integrações financeiras e Open Finance
                        </h2>
                        <p className="text-sm text-[#475467]">
                            A ARVO poderá futuramente disponibilizar integrações que permitam ao usuário importar automaticamente informações financeiras ou de investimentos. Nenhuma conexão financeira será realizada sem ação e autorização correspondente do usuário, que poderá revogá-la a qualquer momento.
                        </p>
                    </section>

                    {/* 6. Para que utilizamos */}
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            6. Para que utilizamos os dados
                        </h2>
                        <p>Os dados pessoais poderão ser utilizados para:</p>
                        <ul className="grid sm:grid-cols-2 gap-2 text-sm text-[#475467]">
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1f674f] shrink-0" /> Criar e administrar sua conta</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1f674f] shrink-0" /> Entender sua situação financeira</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1f674f] shrink-0" /> Realizar seu planejamento financeiro</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1f674f] shrink-0" /> Avaliar sua relação com risco</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1f674f] shrink-0" /> Apresentar estratégias compatíveis</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1f674f] shrink-0" /> Operar Bússola e Calculadora PL</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1f674f] shrink-0" /> Prestar atendimento e suporte</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1f674f] shrink-0" /> Prevenção a fraudes e abusos</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1f674f] shrink-0" /> Melhoria contínua de produtos</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1f674f] shrink-0" /> Cumprir obrigações legais e direitos</li>
                        </ul>
                    </section>

                    {/* 7. Bases Legais (Tabela) */}
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            7. Quais bases legais utilizamos
                        </h2>
                        <p className="text-sm text-[#475467]">
                            Nem todo tratamento realizado pela ARVO depende de consentimento. Conforme a finalidade, utilizamos diferentes bases legais previstas pela LGPD:
                        </p>
                        <div className="overflow-x-auto rounded-2xl border border-[#e4e0d7]">
                            <table className="w-full text-left text-xs sm:text-sm">
                                <thead className="bg-[#f0ece1] text-[#123044] font-bold">
                                    <tr>
                                        <th className="p-3 border-b border-[#e4e0d7]">Atividade</th>
                                        <th className="p-3 border-b border-[#e4e0d7]">Principal fundamento legal (LGPD)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#e4e0d7] text-[#475467]">
                                    <tr><td className="p-3 font-medium text-[#123044]">Criar e manter a conta</td><td className="p-3">Execução de contrato ou procedimentos preliminares</td></tr>
                                    <tr><td className="p-3 font-medium text-[#123044]">Realizar planejamento financeiro</td><td className="p-3">Execução do serviço contratado</td></tr>
                                    <tr><td className="p-3 font-medium text-[#123044]">Gerar simulações e relatórios</td><td className="p-3">Execução do serviço</td></tr>
                                    <tr><td className="p-3 font-medium text-[#123044]">Definir perfil financeiro/investimento</td><td className="p-3">Execução do serviço e legítimo interesse</td></tr>
                                    <tr><td className="p-3 font-medium text-[#123044]">Atendimento e suporte</td><td className="p-3">Execução do contrato e legítimo interesse</td></tr>
                                    <tr><td className="p-3 font-medium text-[#123044]">Segurança e prevenção a fraudes</td><td className="p-3">Legítimo interesse e demais hipóteses aplicáveis</td></tr>
                                    <tr><td className="p-3 font-medium text-[#123044]">Guarda de registros obrigatórios</td><td className="p-3">Cumprimento de obrigação legal</td></tr>
                                    <tr><td className="p-3 font-medium text-[#123044]">Defesa da ARVO em disputas</td><td className="p-3">Exercício regular de direitos</td></tr>
                                    <tr><td className="p-3 font-medium text-[#123044]">Cookies não essenciais</td><td className="p-3">Consentimento, quando aplicável</td></tr>
                                    <tr><td className="p-3 font-medium text-[#123044]">Marketing</td><td className="p-3">Consentimento ou legítimo interesse</td></tr>
                                    <tr><td className="p-3 font-medium text-[#123044]">Funcionalidades opcionais</td><td className="p-3">Consentimento, quando essa for a base adequada</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* 8. IA e Automação */}
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            8. Inteligência Artificial e automação
                        </h2>
                        <p className="text-sm text-[#475467]">
                            Sistemas automatizados e ferramentas de IA poderão ser utilizados para organizar dados, apoiar cálculos, classificação de perfis e relatórios. <strong>A utilização dessas tecnologias não autoriza a movimentação automática de recursos financeiros</strong>. A ARVO não possui autorização para acessar contas bancárias ou executar investimentos pelo usuário. A ARVO não vende dados financeiros nem autoriza fornecedores a utilizá-los para finalidades próprias.
                        </p>
                    </section>

                    {/* 9. Compartilhamento */}
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            9. Com quem podemos compartilhar dados
                        </h2>
                        <p className="text-sm text-[#475467]">
                            A ARVO <strong>não comercializa dados pessoais</strong>. O compartilhamento ocorre estritamente com fornecedores operacionais sob dever de confidencialidade (hospedagem em nuvem, banco de dados, autenticação, envio de e-mails transacionais e segurança), ou mediante obrigação legal e decisão judicial.
                        </p>
                    </section>

                    {/* 10. O que NÃO fazemos */}
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            10. O que não fazemos com seus dados
                        </h2>
                        <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-sm text-emerald-950 space-y-1.5">
                            <p className="font-bold">A ARVO NUNCA utiliza seus dados de renda, patrimônio ou investimentos para:</p>
                            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-emerald-900">
                                <li>Vender sua base de dados ou listas de clientes;</li>
                                <li>Vender informações patrimoniais para anunciantes ou corretoras;</li>
                                <li>Permitir publicidade direcionada sem base legal adequada;</li>
                                <li>Disponibilizar publicamente sua situação financeira.</li>
                            </ul>
                        </div>
                    </section>

                    {/* 11 a 16. Segurança, Incidentes e Retenção */}
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            11. Transferência Internacional, Cookies e Segurança
                        </h2>
                        <p className="text-sm text-[#475467]">
                            Quando houver provedores em nuvem internacionais (ex: AWS, Supabase, Vercel), a ARVO utiliza salvaguardas contratuais admitidas pela LGPD e ANPD. Aplicamos controles rígidos de segregação lógica multi-tenant, criptografia TLS 1.3, rate limiting, proteção Bcrypt e menor privilégio de acesso.
                        </p>
                    </section>

                    {/* 17. Seus Direitos */}
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            17. Seus Direitos como Titular
                        </h2>
                        <p className="text-sm text-[#475467]">
                            Você possui o direito gratuito de confirmar o tratamento, acessar, corrigir, anonimizar, bloquear, eliminar, portar seus dados, revogar consentimentos e peticionar perante a <strong>ANPD</strong>.
                        </p>
                    </section>

                    {/* 18 a 27. Canal de Atendimento e DPO */}
                    <section className="space-y-4 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044]">
                            Canal de Privacidade e Encarregado (DPO)
                        </h2>
                        <p className="text-sm text-[#475467]">
                            Para exercer seus direitos ou esclarecer dúvidas sobre a utilização dos seus dados pessoais:
                        </p>
                        <div className="p-6 rounded-2xl bg-[#f0ece1]/60 border border-[#e4e0d7] space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-[#1f674f]" />
                                <p><strong>E-mail de Privacidade:</strong> <a href="mailto:privacidade@meuarvo.com.br" className="text-[#1f674f] font-bold underline">privacidade@meuarvo.com.br</a></p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-[#1f674f]" />
                                <p><strong>Site:</strong> <a href="https://meuarvo.com.br" className="text-[#1f674f] font-semibold underline">meuarvo.com.br</a></p>
                            </div>
                            <p className="text-xs text-[#667085] pt-2 border-t border-[#e4e0d7]/70">
                                O Encarregado atua como canal oficial de comunicação entre a ARVO, os titulares de dados e a Agência Nacional de Proteção de Dados (ANPD).
                            </p>
                        </div>

                        {/* Closing Commitment */}
                        <div className="pt-4 text-center space-y-2 border-t border-[#e4e0d7]/60">
                            <p className="font-serif italic text-lg text-[#123044]">
                                &ldquo;Planejamento financeiro exige confiança. Seus dados devem trabalhar para você — não transformar você em produto.&rdquo;
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
