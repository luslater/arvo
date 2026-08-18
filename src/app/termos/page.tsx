import Link from "next/link";
import Image from "next/image";
import { Scale, AlertTriangle, ShieldCheck, ArrowLeft, Mail, Lock } from "lucide-react";

export const metadata = {
    title: "Termos e Condições de Uso e Contratação da Plataforma ARVO",
    description: "Termos e Condições de Uso e Contratação da Plataforma ARVO (Versão 2.0 na íntegra).",
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
                        Documento Oficial na Íntegra
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#123044] leading-tight">
                        Termos e Condições de <span className="font-serif italic font-normal text-[#1f674f]">Uso e Contratação da Plataforma ARVO</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-[#667085]">
                        Última atualização: Agosto de 2026 · Versão 2.0
                    </p>
                </div>

                {/* Opening Welcome */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e4e0d7] shadow-sm space-y-3 text-[#344054] text-base leading-relaxed">
                    <p className="font-medium text-[#123044] text-lg">
                        Bem-vindo à ARVO.
                    </p>
                    <p>
                        Estes Termos estabelecem as regras para acesso, contratação e utilização da plataforma Meu Arvo, das ferramentas digitais, conteúdos e demais serviços disponibilizados pela <strong>ARVO ORIENTAÇÃO FINANCEIRA INDEPENDENTE (“ARVO”)</strong>.
                    </p>
                    <p className="text-sm text-[#667085]">
                        Recomendamos a leitura integral deste documento antes da contratação.
                    </p>
                </div>

                {/* Avisos Importantes Antes de Começar */}
                <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#e4e0d7] shadow-sm space-y-8 text-sm sm:text-base leading-relaxed text-[#344054]">
                    <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-3">
                        Avisos importantes antes de começar
                    </h2>

                    {/* Investimentos envolvem riscos */}
                    <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3 text-amber-950">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
                            <h3 className="font-bold text-base text-amber-950">Investimentos envolvem riscos</h3>
                        </div>
                        <p>Todo investimento envolve algum nível de risco.</p>
                        <p>A depender do ativo, o investidor poderá estar exposto, entre outros, a riscos de mercado, crédito, liquidez, juros, inflação, câmbio, concentração e alterações regulatórias.</p>
                        <p><strong>Rentabilidade passada não representa garantia de rentabilidade futura.</strong></p>
                        <p>Projeções, simulações, retornos esperados e cenários apresentados na plataforma possuem natureza estimativa e não constituem promessa ou garantia de resultado.</p>
                        <p>Dependendo do investimento realizado, poderá ocorrer perda parcial ou, em determinadas situações, total do capital investido.</p>
                    </div>

                    {/* A ARVO não movimenta o seu dinheiro */}
                    <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-3 text-emerald-950">
                        <div className="flex items-center gap-2">
                            <Lock className="w-5 h-5 text-[#1f674f] shrink-0" />
                            <h3 className="font-bold text-base text-emerald-950">A ARVO não movimenta o seu dinheiro</h3>
                        </div>
                        <p>Salvo se futuramente houver serviço distinto expressamente contratado e legalmente autorizado:</p>
                        <ul className="space-y-1.5 list-disc pl-5 text-sm text-emerald-900">
                            <li>a ARVO não recebe recursos para investimento;</li>
                            <li>não mantém conta de investimento em nome do usuário;</li>
                            <li>não exerce custódia dos ativos do usuário;</li>
                            <li>não executa ordens de compra ou venda;</li>
                            <li>não movimenta contas bancárias ou contas de investimento;</li>
                            <li>não possui autorização automática para operar em nome do usuário.</li>
                        </ul>
                        <p>As decisões e operações de investimento são realizadas pelo próprio usuário nas instituições financeiras escolhidas por ele.</p>
                    </div>

                    {/* Planejamento financeiro e investimento */}
                    <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-3 text-blue-950">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0" />
                            <h3 className="font-bold text-base text-blue-950">Planejamento financeiro e investimento são coisas relacionadas, mas juridicamente distintas</h3>
                        </div>
                        <p>A ARVO poderá disponibilizar ferramentas de organização e planejamento financeiro, simulações, conteúdos educacionais, indicadores, carteiras-modelo e outras funcionalidades.</p>
                        <p>Quando e na medida em que determinado serviço configurar consultoria de valores mobiliários nos termos da regulamentação aplicável, esse serviço somente será prestado por pessoa física ou jurídica devidamente habilitada para a respectiva atividade, identificada ao usuário na contratação.</p>
                        <p>Eventuais serviços regulados poderão estar sujeitos também a contratos, avisos, termos ou documentos complementares.</p>
                    </div>
                </div>

                {/* 44 Seções na Íntegra */}
                <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#e4e0d7] shadow-sm space-y-10 text-sm sm:text-base leading-relaxed text-[#344054]">
                    
                    {/* 1 */}
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
                        <p>Neste documento, essa empresa será denominada simplesmente “ARVO”.</p>
                    </section>

                    {/* 2 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            2. Aceitação destes Termos
                        </h2>
                        <p>Ao criar uma conta, contratar um plano ou utilizar funcionalidades sujeitas a estes Termos, o usuário declara que teve acesso ao documento e concorda com suas disposições.</p>
                        <p>A utilização da plataforma também está sujeita à Política de Privacidade e Proteção de Dados e, quando aplicável:</p>
                        <ul className="space-y-1.5 list-disc pl-5 text-sm text-[#475467]">
                            <li>à oferta comercial apresentada no momento da contratação;</li>
                            <li>às condições específicas do plano escolhido;</li>
                            <li>a contratos específicos;</li>
                            <li>a termos relacionados a funcionalidades adicionais.</li>
                        </ul>
                        <p>Caso exista conflito entre estes Termos e uma condição específica expressamente apresentada para determinado serviço, prevalecerá a disposição específica em relação àquele serviço, observada a legislação aplicável.</p>
                    </section>

                    {/* 3 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            3. Quem pode utilizar a plataforma
                        </h2>
                        <p>A contratação direta dos serviços da ARVO é destinada a pessoas com 18 anos ou mais e civilmente capazes para os atos relacionados à contratação.</p>
                        <p>O usuário compromete-se a fornecer informações verdadeiras, completas e atualizadas.</p>
                        <p>A ARVO poderá solicitar informações adicionais necessárias para:</p>
                        <ul className="space-y-1.5 list-disc pl-5 text-sm text-[#475467]">
                            <li>identificação;</li>
                            <li>segurança;</li>
                            <li>funcionamento da plataforma;</li>
                            <li>adequação de determinados serviços;</li>
                            <li>cumprimento de obrigações legais ou regulatórias.</li>
                        </ul>
                    </section>

                    {/* 4 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            4. O que é a ARVO
                        </h2>
                        <p>A ARVO é uma plataforma voltada à organização da vida financeira, planejamento patrimonial e apoio à tomada de decisões financeiras.</p>
                        <p>Dependendo do plano e das funcionalidades disponíveis, poderão fazer parte da experiência:</p>
                        <ul className="grid sm:grid-cols-2 gap-1.5 list-disc pl-5 text-sm text-[#475467]">
                            <li>Jornada dos 7 Pilares;</li>
                            <li>organização financeira;</li>
                            <li>diagnóstico da situação atual;</li>
                            <li>planejamento de objetivos;</li>
                            <li>avaliação de reserva de emergência;</li>
                            <li>análise de capacidade de poupança;</li>
                            <li>planejamento de longo prazo;</li>
                            <li>planejamento de aposentadoria;</li>
                            <li>Calculadora PL;</li>
                            <li>análise de perfil financeiro e de risco;</li>
                            <li>Bússola;</li>
                            <li>simulações de alocação;</li>
                            <li>carteiras-modelo;</li>
                            <li>acompanhamento de carteira;</li>
                            <li>conteúdos educacionais;</li>
                            <li>relatórios;</li>
                            <li>ferramentas de apoio;</li>
                            <li>atendimento e orientação humana, conforme o plano contratado.</li>
                        </ul>
                        <p className="text-xs text-[#667085] pt-1">As funcionalidades disponíveis poderão variar conforme o plano, patrimônio, perfil, momento de contratação e evolução da plataforma.</p>
                    </section>

                    {/* 5 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            5. Planejamento financeiro
                        </h2>
                        <p>As ferramentas de planejamento financeiro utilizam informações fornecidas pelo usuário e premissas econômicas e matemáticas para apresentar diagnósticos, cenários e projeções.</p>
                        <p>Essas ferramentas têm como objetivo auxiliar o usuário a compreender questões como:</p>
                        <ul className="space-y-1.5 list-disc pl-5 text-sm text-[#475467]">
                            <li>quanto possui atualmente;</li>
                            <li>quanto consegue poupar;</li>
                            <li>qual reserva pode ser adequada aos objetivos informados;</li>
                            <li>quanto poderá acumular;</li>
                            <li>qual esforço financeiro determinado objetivo poderá exigir;</li>
                            <li>como determinadas decisões poderão impactar seu planejamento.</li>
                        </ul>
                        <p>Os resultados dependem diretamente da qualidade das informações fornecidas e das premissas utilizadas.</p>
                        <p><strong>Uma projeção financeira não é uma previsão exata do futuro.</strong></p>
                        <p>Inflação, juros, renda, despesas, tributação, rentabilidade, condições pessoais e demais variáveis poderão evoluir de maneira diferente daquela utilizada na simulação.</p>
                    </section>

                    {/* 6 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            6. Perfil financeiro e Bússola
                        </h2>
                        <p>A ARVO poderá utilizar questionários, regras, modelos matemáticos e outras informações para auxiliar na identificação da relação do usuário com risco, liquidez, horizonte e objetivos financeiros.</p>
                        <p>Essa análise poderá resultar na classificação do usuário segundo metodologias próprias da ARVO, incluindo, quando aplicável, os perfis: <strong>Abrigo, Ritmo, Visão e Oceano</strong>.</p>
                        <p>O perfil é uma ferramenta de apoio. Ele não elimina riscos, não garante que uma carteira terá determinado desempenho e não substitui a atualização das informações quando houver mudanças relevantes na situação do usuário.</p>
                        <p>O usuário deverá manter suas informações atualizadas, especialmente quando houver mudanças relevantes em: renda, patrimônio, objetivos, horizonte de investimento, necessidade de liquidez, capacidade de assumir perdas e conhecimento sobre investimentos.</p>
                        <p>A ARVO poderá solicitar uma nova avaliação do perfil periodicamente ou quando identificar alteração relevante nas informações disponíveis.</p>
                    </section>

                    {/* 7 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            7. Carteiras-modelo e alocações
                        </h2>
                        <p>A ARVO poderá apresentar estruturas de alocação, carteiras-modelo ou outras referências de investimento de acordo com as funcionalidades contratadas.</p>
                        <p>Essas carteiras poderão considerar fatores como: nível de risco, horizonte, liquidez, diversificação, classes de ativos, características dos produtos, condições econômicas e metodologia interna da ARVO.</p>
                        <p>Uma carteira-modelo representa uma composição construída a partir de determinadas premissas. Ela não representa promessa de rentabilidade ou de preservação de patrimônio.</p>
                        <p>A composição das carteiras poderá ser alterada ao longo do tempo em razão de: mudanças de mercado, alteração da avaliação de determinado ativo, mudança de risco, vencimentos, liquidez, modificações regulatórias, alteração de metodologia, disponibilidade de produtos e surgimento de alternativas consideradas mais adequadas.</p>
                        <p>O fato de uma carteira ser alterada posteriormente não significa, por si só, que sua composição anterior estivesse incorreta.</p>
                    </section>

                    {/* 8 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            8. Recomendações individualizadas e serviços regulados
                        </h2>
                        <p>A simples disponibilização da plataforma não deve ser interpretada como contratação automática de qualquer atividade regulada.</p>
                        <p>Quando determinado plano incluir orientação, recomendação ou aconselhamento individualizado que configure atividade sujeita a autorização regulatória, a contratação identificará a pessoa ou entidade responsável pela prestação do serviço e as condições aplicáveis.</p>
                        <p>Quando cabível, poderão ser considerados: situação financeira, objetivos, perfil, horizonte de investimento, necessidade de liquidez, capacidade de assumir riscos, carteira existente e custos/características dos investimentos.</p>
                        <p>A recomendação, quando existente, não transfere à ARVO a propriedade ou o controle dos recursos. A adoção e implementação das recomendações permanecem sob decisão do cliente, salvo existência futura de serviço distinto, expressamente contratado e autorizado pela regulamentação aplicável.</p>
                    </section>

                    {/* 9 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            9. Independência e modelo Fee-Only
                        </h2>
                        <p>Nos serviços abrangidos por esta política comercial, a ARVO busca manter seu modelo de orientação alinhado aos interesses do cliente.</p>
                        <p>A ARVO não recebe comissão, rebate ou remuneração de bancos, corretoras ou gestoras pela simples inclusão ou recomendação de determinado produto financeiro nas carteiras apresentadas aos usuários, salvo se condição diferente for expressamente informada e permitida pela regulamentação aplicável.</p>
                        <p>A principal remuneração da ARVO decorre dos valores pagos pelos próprios clientes pelos planos e serviços contratados.</p>
                        <p>Caso o modelo de remuneração de determinado serviço seja diferente, isso deverá ser informado de maneira clara antes da contratação.</p>
                    </section>

                    {/* 10 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            10. Ausência de garantia de resultado
                        </h2>
                        <p>Nenhuma informação apresentada pela ARVO deverá ser interpretada como garantia de:</p>
                        <ul className="space-y-1.5 list-disc pl-5 text-sm text-[#475467]">
                            <li>rentabilidade;</li>
                            <li>preservação integral de capital;</li>
                            <li>ausência de volatilidade;</li>
                            <li>liquidez;</li>
                            <li>retorno acima do CDI ou de outro índice;</li>
                            <li>cumprimento de objetivo financeiro;</li>
                            <li>desempenho futuro de um fundo, ativo, carteira ou estratégia.</li>
                        </ul>
                        <p>Os investimentos podem apresentar resultados diferentes dos cenários históricos ou projetados.</p>
                    </section>

                    {/* 11 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            11. Riscos dos investimentos
                        </h2>
                        <p>O usuário reconhece que investimentos podem envolver diferentes tipos de risco. Entre eles:</p>
                        <div className="space-y-2.5 text-sm text-[#475467] pt-1">
                            <p><strong>Risco de mercado:</strong> Possibilidade de perda decorrente de alterações nos preços dos ativos, juros, índices ou outras variáveis econômicas.</p>
                            <p><strong>Risco de crédito:</strong> Possibilidade de o emissor ou devedor não cumprir suas obrigações.</p>
                            <p><strong>Risco de liquidez:</strong> Possibilidade de dificuldade ou impossibilidade de vender ou resgatar determinado investimento no prazo ou preço desejado.</p>
                            <p><strong>Risco de juros:</strong> Alterações nas taxas de juros podem provocar oscilações relevantes no valor dos investimentos.</p>
                            <p><strong>Risco de inflação:</strong> A rentabilidade poderá não ser suficiente para preservar o poder de compra.</p>
                            <p><strong>Risco cambial:</strong> Investimentos expostos a moedas estrangeiras podem sofrer efeitos positivos ou negativos decorrentes da variação cambial.</p>
                            <p><strong>Risco de concentração:</strong> Carteiras concentradas em poucos ativos, emissores, setores, gestores ou mercados podem apresentar risco superior.</p>
                            <p><strong>Risco regulatório e tributário:</strong> Mudanças em leis, normas, tributação ou interpretação regulatória podem alterar as características ou resultados de determinado investimento.</p>
                        </div>
                        <p className="text-xs text-[#667085] pt-1">Outros riscos específicos poderão existir de acordo com cada produto. O usuário deve consultar os documentos oficiais e materiais do emissor, gestor, administrador, corretora ou instituição responsável antes de realizar uma aplicação.</p>
                    </section>

                    {/* 12 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            12. Investidores qualificados e produtos restritos
                        </h2>
                        <p>Determinados investimentos podem possuir restrições relacionadas ao perfil ou à classificação do investidor.</p>
                        <p>O fato de determinado ativo ou estratégia aparecer em conteúdo da plataforma não elimina os requisitos estabelecidos pela legislação ou pela documentação do produto.</p>
                        <p>Quando aplicável, somente deverão realizar determinados investimentos os usuários que atendam aos requisitos necessários.</p>
                    </section>

                    {/* 13 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            13. Dados, preços, indicadores e rentabilidades
                        </h2>
                        <p>A plataforma poderá utilizar informações próprias ou provenientes de terceiros, incluindo: preços de ativos, rentabilidades, índices, taxas, cotações, dados de fundos, dados econômicos, informações disponibilizadas por instituições financeiras e bases públicas ou privadas.</p>
                        <p>A ARVO busca utilizar fontes consideradas adequadas, mas diferenças de horário, metodologia, atualização, arredondamento, tratamento de proventos ou origem da informação podem gerar divergências.</p>
                        <p>As informações apresentadas na plataforma não substituem os registros oficiais das instituições responsáveis pelo investimento. Em caso de divergência relevante, deverão ser considerados os documentos e registros oficiais aplicáveis.</p>
                    </section>

                    {/* 14 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            14. Rentabilidade histórica e metodologia
                        </h2>
                        <p>Quando forem exibidos retornos históricos, a ARVO poderá utilizar informações disponibilizadas por fontes externas e aplicar metodologias próprias de cálculo.</p>
                        <p>Dependendo do indicador, os resultados poderão considerar ou não: dividendos, juros, proventos, reinvestimentos, impostos, taxas, custos operacionais, inflação e câmbio.</p>
                        <p>Sempre que relevante, a metodologia utilizada deverá ser informada ou disponibilizada ao usuário. Simulações realizadas a partir de dados históricos são ilustrações do comportamento passado e não previsões de desempenho futuro.</p>
                    </section>

                    {/* 15 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            15. Inteligência Artificial e sistemas automatizados
                        </h2>
                        <p>A ARVO poderá utilizar inteligência artificial, algoritmos e outros sistemas automatizados como ferramentas de apoio em cálculos, classificação de informações, identificação de inconsistências, organização de dados, elaboração de relatórios, explicação de conceitos, suporte ao atendimento, simulações e apoio à análise.</p>
                        <p>Tecnologias automatizadas podem apresentar limitações ou produzir resultados imprecisos. Por isso, informações relevantes para decisões financeiras poderão estar sujeitas a regras adicionais, validações ou análise humana conforme a natureza da funcionalidade e do serviço contratado.</p>
                        <p><strong>A utilização de inteligência artificial não autoriza o sistema a movimentar automaticamente os investimentos do usuário.</strong> O tratamento de dados pessoais nessas funcionalidades seguirá a Política de Privacidade e Proteção de Dados da ARVO.</p>
                    </section>

                    {/* 16 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            16. Cadastro e segurança da conta
                        </h2>
                        <p>Cada conta é pessoal e não deve ser compartilhada. O usuário é responsável por: fornecer informações verdadeiras, manter seus dados atualizados, proteger suas credenciais, utilizar senha adequada, não compartilhar códigos de autenticação e comunicar imediatamente qualquer suspeita de acesso indevido.</p>
                        <p>A ARVO poderá utilizar mecanismos adicionais de segurança e solicitar verificações de identidade quando necessário. A ARVO nunca solicitará que o usuário informe sua senha completa para que um funcionário realize operações financeiras em seu nome.</p>
                        <p>Caso o usuário identifique atividade suspeita, deverá entrar em contato imediatamente com a ARVO. O dever do usuário de proteger suas credenciais não exclui as responsabilidades legalmente atribuíveis à ARVO por eventuais falhas de segurança ou defeitos na prestação do serviço.</p>
                    </section>

                    {/* 17 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            17. Condutas proibidas
                        </h2>
                        <p>O usuário não poderá utilizar a plataforma para:</p>
                        <ul className="grid sm:grid-cols-2 gap-1.5 list-disc pl-5 text-sm text-[#475467]">
                            <li>praticar atividade ilegal ou fraudulenta;</li>
                            <li>acessar dados pertencentes a outro usuário;</li>
                            <li>tentar contornar mecanismos de autenticação ou segurança;</li>
                            <li>explorar vulnerabilidades sem autorização;</li>
                            <li>executar ataques automatizados;</li>
                            <li>inserir código malicioso;</li>
                            <li>interferir no funcionamento da infraestrutura;</li>
                            <li>realizar scraping ou coleta automatizada não autorizada;</li>
                            <li>reproduzir bases proprietárias da ARVO;</li>
                            <li>compartilhar acesso pago com terceiros;</li>
                            <li>revender conteúdo ou acesso sem autorização;</li>
                            <li>realizar engenharia reversa do software além dos limites legais;</li>
                            <li>utilizar marcas ou propriedade intelectual da ARVO sem autorização.</li>
                        </ul>
                        <p className="text-xs text-[#667085] pt-1">A ARVO poderá adotar medidas proporcionais de segurança quando identificar comportamento suspeito ou violação destes Termos.</p>
                    </section>

                    {/* 18 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            18. Suspensão de acesso
                        </h2>
                        <p>A ARVO poderá suspender temporariamente determinada conta quando houver indícios razoáveis de fraude, invasão, comprometimento de credenciais, tentativa de acesso indevido, violação grave destes Termos, risco à segurança de outros usuários, utilização ilegal da plataforma ou determinação judicial/administrativa.</p>
                        <p>Quando possível e compatível com a finalidade da medida, o usuário será informado. A suspensão será limitada ao período necessário para análise ou correção da situação.</p>
                    </section>

                    {/* 19 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            19. Propriedade intelectual
                        </h2>
                        <p>São protegidos pelos direitos de propriedade intelectual aplicáveis, entre outros: marca ARVO, nome Meu Arvo, identidade visual, textos, vídeos, conteúdos, relatórios, código-fonte, software, banco de dados, interfaces, metodologias, modelos, estruturas de classificação, materiais educacionais e elementos gráficos.</p>
                        <p>A contratação de um plano concede ao usuário apenas uma licença pessoal, limitada, não exclusiva e não transferível para utilização do serviço enquanto possuir acesso legítimo à plataforma. A contratação não transfere ao usuário a titularidade da tecnologia, marcas ou metodologias da ARVO.</p>
                    </section>

                    {/* 20 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            20. Uso pessoal de relatórios e conteúdos
                        </h2>
                        <p>O usuário poderá utilizar relatórios e informações disponibilizados pela ARVO para seus próprios fins pessoais. Salvo autorização expressa, não é permitido comercializar os materiais, revender relatórios, disponibilizar conteúdo pago publicamente, reproduzir substancialmente a metodologia, utilizar a plataforma para criação de produto concorrente ou redistribuir bases de dados proprietárias. O compartilhamento pontual de informações pessoais próprias não é proibido por esta cláusula.</p>
                    </section>

                    {/* 21 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            21. Conteúdo enviado pelo usuário
                        </h2>
                        <p>Os dados e documentos enviados pelo usuário continuam pertencendo a ele ou aos seus respectivos titulares. Ao inserir informações na plataforma, o usuário concede à ARVO autorização para processá-las exclusivamente na medida necessária para prestação das funcionalidades contratadas e demais finalidades legitimamente descritas na Política de Privacidade. Quando inserir informações de terceiros, o usuário deverá possuir legitimidade para fornecê-las.</p>
                    </section>

                    {/* 22 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            22. Planos, preços e contratação
                        </h2>
                        <p>A ARVO poderá oferecer diferentes planos e modalidades. Antes da contratação serão informados, conforme aplicável: preço, duração, periodicidade, funcionalidades, forma de pagamento, eventual renovação, condições promocionais, benefícios e limitações relevantes. As condições comerciais exibidas no momento da contratação fazem parte do contrato entre ARVO e usuário. Promoções poderão possuir duração, elegibilidade e regras próprias.</p>
                    </section>

                    {/* 23 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            23. Assinaturas recorrentes
                        </h2>
                        <p>Quando o usuário contratar plano com renovação automática, essa condição deverá ser apresentada antes da conclusão da compra. A cobrança será realizada conforme a periodicidade informada no momento da contratação. O usuário poderá cancelar futuras renovações pelos canais disponibilizados pela ARVO. O cancelamento de uma assinatura recorrente impede novas renovações, mas poderá manter o acesso até o encerramento do período já pago, conforme as condições do plano e a legislação aplicável.</p>
                    </section>

                    {/* 24 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            24. Planos com prazo determinado e parcelamento
                        </h2>
                        <p>Quando determinado serviço possuir prazo contratual determinado, como acesso anual, o pagamento em parcelas poderá constituir apenas uma forma de pagamento do preço total contratado, e não necessariamente uma contratação mensal independente. Essa condição deverá ser claramente apresentada antes da compra. Cancelamentos posteriores ao período legal de arrependimento observarão as condições do plano contratado, os serviços já prestados, eventual prazo de permanência previamente informado e os direitos obrigatórios previstos na legislação aplicável. Nenhuma disposição destes Termos busca afastar direitos legalmente assegurados ao consumidor.</p>
                    </section>

                    {/* 25 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            25. Direito de arrependimento
                        </h2>
                        <p>Nas contratações às quais seja aplicável o direito de arrependimento previsto pela legislação consumerista, o usuário poderá desistir da contratação no prazo legal. Atualmente, nas hipóteses previstas pelo Código de Defesa do Consumidor, <strong>o prazo é de 7 dias a partir da contratação</strong> ou demais marcos estabelecidos pela legislação aplicável. O usuário poderá exercer esse direito pelos canais disponibilizados pela ARVO. Quando aplicável, os valores pagos serão restituídos nos termos da legislação.</p>
                    </section>

                    {/* 26 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            26. Cancelamento
                        </h2>
                        <p>Fora do período legal de arrependimento, o usuário poderá solicitar o cancelamento de acordo com as características do plano contratado. Nas assinaturas recorrentes sem prazo mínimo, o cancelamento poderá ser solicitado a qualquer momento e evitará cobranças relativas aos períodos seguintes. Nos planos de prazo determinado, serão observadas as condições comerciais informadas antes da contratação e os direitos previstos na legislação. A ARVO deverá disponibilizar canal razoável e acessível para solicitações de cancelamento.</p>
                    </section>

                    {/* 27 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            27. Alteração de preços
                        </h2>
                        <p>A ARVO poderá alterar os preços dos seus planos para futuras contratações ou renovações. Alterações de preço que afetem assinatura existente serão comunicadas previamente ao usuário quando exigido ou apropriado. A alteração não modificará retroativamente valores já pagos ou períodos já contratados, salvo hipótese legal ou acordo expresso entre as partes.</p>
                    </section>

                    {/* 28 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            28. Inadimplência
                        </h2>
                        <p>Caso uma cobrança válida não seja processada, a ARVO poderá realizar novas tentativas ou solicitar atualização da forma de pagamento. Persistindo a inadimplência, o acesso a funcionalidades pagas poderá ser suspenso ou encerrado, observadas as condições contratadas e a legislação aplicável. A inadimplência não autoriza a ARVO a reter indevidamente dados ou impedir o exercício dos direitos previstos pela legislação de proteção de dados.</p>
                    </section>

                    {/* 29 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            29. Disponibilidade da plataforma
                        </h2>
                        <p>A ARVO busca manter seus serviços disponíveis e funcionais. Entretanto, poderão ocorrer interrupções temporárias em razão de manutenção, atualizações, falhas de infraestrutura, indisponibilidade de fornecedores, ataques, problemas de telecomunicações, eventos de força maior ou medidas necessárias à segurança da plataforma. Sempre que razoavelmente possível, manutenções planejadas relevantes poderão ser comunicadas. A ARVO não garante funcionamento absolutamente ininterrupto, mas buscará restabelecer os serviços dentro de prazo compatível com a natureza do problema. Esta cláusula não exclui as responsabilidades que sejam obrigatórias nos termos da legislação aplicável.</p>
                    </section>

                    {/* 30 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            30. Serviços e integrações de terceiros
                        </h2>
                        <p>A plataforma poderá utilizar ou permitir integração com serviços de terceiros, incluindo: processadores de pagamento, ferramentas de comunicação, bancos de dados, provedores de informações financeiras, instituições financeiras, serviços de Open Finance, serviços de inteligência artificial, ferramentas de análise e sistemas de agendamento. Algumas funcionalidades poderão depender da disponibilidade desses terceiros. Os serviços prestados diretamente por terceiros poderão possuir termos e políticas próprias. A ARVO não controla integralmente sistemas pertencentes a terceiros, sem prejuízo das responsabilidades que lhe sejam atribuídas pela legislação em relação à escolha, integração ou utilização desses fornecedores.</p>
                    </section>

                    {/* 31 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            31. Links externos
                        </h2>
                        <p>A plataforma poderá disponibilizar links para corretoras, bancos, gestoras, administradores, emissores, órgãos públicos, conteúdos educacionais e outras páginas externas. A existência de um link não significa necessariamente parceria comercial ou endosso integral do conteúdo externo. Ao acessar ambiente pertencente a terceiro, aplicam-se também as regras e políticas desse terceiro.</p>
                    </section>

                    {/* 32 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            32. Decisão e execução dos investimentos
                        </h2>
                        <p>Quando o serviço não incluir gestão discricionária devidamente contratada e autorizada, a decisão de implementar ou não determinada estratégia pertence ao usuário. Cabe ao usuário realizar a operação na instituição financeira escolhida.</p>
                        <p>Isso significa que a ARVO não será responsável por consequências decorrentes exclusivamente de:</p>
                        <ul className="space-y-1.5 list-disc pl-5 text-sm text-[#475467]">
                            <li>operação diferente daquela analisada;</li>
                            <li>alteração realizada pelo usuário sem conhecimento da ARVO;</li>
                            <li>informação incorreta fornecida pelo usuário;</li>
                            <li>oscilação normal de mercado;</li>
                            <li>evento de crédito;</li>
                            <li>risco inerente ao investimento;</li>
                            <li>alteração econômica ou regulatória imprevisível;</li>
                            <li>decisão tomada pelo usuário fora do escopo do serviço contratado.</li>
                        </ul>
                        <p className="text-xs text-[#667085] pt-1">Essa disposição não exclui eventual responsabilidade da ARVO decorrente de erro, omissão, defeito do serviço, descumprimento contratual ou outra hipótese em que a legislação atribua responsabilidade à ARVO.</p>
                    </section>

                    {/* 33 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            33. Limites das simulações
                        </h2>
                        <p>Ferramentas como a Calculadora PL e demais projeções da ARVO trabalham com premissas (taxa de retorno, inflação, horizonte, aportes, patrimônio inicial, renda, despesas). Pequenas diferenças nessas premissas podem produzir diferenças relevantes em projeções de longo prazo. Consequentemente, valores futuros apresentados pela plataforma devem ser interpretados como cenários de planejamento, e não como compromisso de resultado.</p>
                    </section>

                    {/* 34 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            34. Informações tributárias, jurídicas e contábeis
                        </h2>
                        <p>Salvo quando determinado serviço for expressamente contratado para essa finalidade e prestado por profissional habilitado, os conteúdos disponibilizados pela ARVO não substituem: aconselhamento jurídico, consultoria tributária, serviços contábeis, planejamento sucessório jurídico e elaboração de documentos legais. Informações sobre tributação apresentadas na plataforma possuem caráter auxiliar e poderão depender das circunstâncias específicas de cada usuário.</p>
                    </section>

                    {/* 35 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            35. Responsabilidade da ARVO
                        </h2>
                        <p>A ARVO é responsável pela prestação dos seus serviços dentro dos limites estabelecidos na legislação, nestes Termos, na oferta comercial e nos contratos específicos eventualmente celebrados. Nenhuma cláusula destes Termos deve ser interpretada como exclusão de responsabilidade em hipóteses nas quais a legislação não permita essa exclusão. A ARVO não garante resultado financeiro decorrente de eventos de mercado que estejam fora de seu controle.</p>
                    </section>

                    {/* 36 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            36. Responsabilidade do usuário
                        </h2>
                        <p>O usuário é responsável por: fornecer informações verdadeiras, informar mudanças relevantes em sua situação financeira, proteger sua conta, utilizar a plataforma dentro da lei, avaliar as informações disponibilizadas, ler documentos dos investimentos, observar eventuais restrições de elegibilidade e implementar suas decisões pelas instituições adequadas. Informações incorretas ou incompletas poderão comprometer a qualidade das análises e simulações realizadas.</p>
                    </section>

                    {/* 37 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            37. Privacidade e proteção de dados
                        </h2>
                        <p>O tratamento de dados pessoais realizado pela ARVO é disciplinado pela Política de Privacidade e Proteção de Dados disponível na plataforma. A Política explica quais dados são tratados, finalidades, bases legais, fornecedores, segurança, inteligência artificial, retenção e direitos do titular. A utilização da plataforma não significa consentimento genérico para todo e qualquer tratamento de dados; os tratamentos serão realizados de acordo com as bases legais aplicáveis.</p>
                    </section>

                    {/* 38 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            38. Comunicações
                        </h2>
                        <p>A ARVO poderá utilizar os dados de contato cadastrados para comunicações necessárias relacionadas a segurança, acesso, pagamento, contrato, alterações relevantes, atendimento e funcionamento da plataforma. Comunicações comerciais serão tratadas conforme as escolhas do usuário e a legislação aplicável. É responsabilidade do usuário manter seus dados de contato atualizados.</p>
                    </section>

                    {/* 39 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            39. Alterações na plataforma
                        </h2>
                        <p>A ARVO poderá evoluir seus serviços continuamente (novas funcionalidades, alteração de interfaces, substituição de ferramentas, melhoria de cálculos, criação ou retirada de recursos e mudança de metodologia). Mudanças que alterem materialmente uma característica essencial de um serviço já contratado observarão as condições contratuais e a legislação aplicável.</p>
                    </section>

                    {/* 40 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            40. Alterações destes Termos
                        </h2>
                        <p>Estes Termos poderão ser atualizados para refletir mudanças legais ou regulatórias, novas funcionalidades, alterações operacionais, melhorias de segurança ou novos modelos de contratação. A versão vigente estará disponível na plataforma com a respectiva data de atualização. Quando houver alteração material que afete de maneira relevante os direitos ou obrigações do usuário, a ARVO poderá realizar comunicação adicional. Alterações não serão utilizadas para retirar retroativamente direitos já adquiridos em desacordo com a legislação.</p>
                    </section>

                    {/* 41 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            41. Encerramento pela ARVO
                        </h2>
                        <p>A ARVO poderá encerrar a prestação de determinado produto ou plano. Quando isso afetar serviço pago ainda não integralmente prestado, serão adotadas medidas adequadas de transição, comunicação ou restituição, quando devidas. A ARVO também poderá encerrar uma conta em caso de violação grave destes Termos, fraude ou utilização ilegal, preservados os direitos obrigatórios do usuário.</p>
                    </section>

                    {/* 42 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            42. Disposições gerais
                        </h2>
                        <p>Caso determinada cláusula destes Termos seja considerada inválida ou inexequível, as demais permanecerão válidas na medida permitida pela legislação. A eventual tolerância de uma das partes quanto ao descumprimento de determinada obrigação não representa renúncia definitiva ao direito de exigir seu cumprimento. Estes Termos, em conjunto com a oferta contratada e documentos específicos aplicáveis, representam as condições que regem a relação entre o usuário e a ARVO.</p>
                    </section>

                    {/* 43 */}
                    <section className="space-y-3 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            43. Legislação aplicável e solução de controvérsias
                        </h2>
                        <p>Estes Termos são regidos pela legislação brasileira. A ARVO incentiva que eventuais dúvidas ou divergências sejam inicialmente encaminhadas para seus canais de atendimento, buscando uma solução simples e eficiente:</p>
                        <p><strong>Contato:</strong> <a href="mailto:contato@meuarvo.com.br" className="text-[#1f674f] font-semibold underline">contato@meuarvo.com.br</a></p>
                        <p>Nas relações de consumo, fica assegurado ao consumidor o acesso ao foro competente de seu domicílio, conforme a legislação aplicável.</p>
                    </section>

                    {/* 44 */}
                    <section className="space-y-4 border-t border-[#e4e0d7] pt-6">
                        <h2 className="text-xl font-bold text-[#123044] border-b border-[#e4e0d7] pb-2">
                            44. Contato
                        </h2>
                        <p>Para dúvidas relacionadas aos Termos, planos ou utilização da plataforma:</p>
                        <div className="p-6 rounded-2xl bg-[#f0ece1]/60 border border-[#e4e0d7] space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-[#1f674f]" />
                                <p><strong>Dúvidas gerais, planos e suporte:</strong> <a href="mailto:contato@meuarvo.com.br" className="text-[#1f674f] font-bold underline">contato@meuarvo.com.br</a></p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-[#1f674f]" />
                                <p><strong>Privacidade e proteção de dados:</strong> <a href="mailto:privacidade@meuarvo.com.br" className="text-[#1f674f] font-bold underline">privacidade@meuarvo.com.br</a></p>
                            </div>
                        </div>

                        {/* Aviso final sobre investimentos */}
                        <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3 text-amber-950 mt-6">
                            <h3 className="font-bold text-base text-amber-950">Aviso final sobre investimentos</h3>
                            <p>Investir envolve riscos.</p>
                            <p>A escolha de uma carteira compatível com determinado perfil pode reduzir determinados riscos, mas não eliminá-los.</p>
                            <p><strong>Rentabilidade passada não representa garantia de rentabilidade futura.</strong></p>
                            <p>As simulações da ARVO não representam promessa de desempenho.</p>
                            <p className="font-serif italic text-base text-[#123044] pt-2 border-t border-amber-200">
                                &ldquo;A ARVO acredita que boas decisões financeiras começam com planejamento, diversificação, compreensão dos riscos e alinhamento entre patrimônio e objetivos de vida.&rdquo;
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
