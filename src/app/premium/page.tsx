import Link from "next/link"
import { ArrowRight, CheckCircle2, Shield, TrendingUp, Rocket, Globe, Download, Calendar } from "lucide-react"

export default function PremiumLandingPage() {
    return (
        <div className="min-h-screen bg-arvo-background font-sans selection:bg-arvo-primary/20">
            {/* Header / Nav */}
            <header className="fixed top-0 w-full z-50 bg-arvo-background/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-arvo-primary">
                        ARVO
                    </Link>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="#beneficios" className="text-sm font-medium text-gray-600 hover:text-arvo-primary transition-colors">Benefícios</Link>
                        <Link href="#planos" className="text-sm font-medium text-gray-600 hover:text-arvo-primary transition-colors">Planos</Link>
                        <Link href="#contato" className="text-sm font-medium text-gray-600 hover:text-arvo-primary transition-colors">Falar com Especialista</Link>
                    </nav>
                    <div className="flex gap-4">
                        <Link href="/dashboard" className="hidden md:flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-arvo-primary border-2 border-arvo-primary rounded-xl hover:bg-emerald-50 transition-colors">
                            Acessar Plataforma
                        </Link>
                        <Link href="#assinar" className="flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white bg-arvo-primary rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20">
                            Ser Premium
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-40 pb-24 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-100/50 rounded-full blur-[120px] -z-10 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                <div className="max-w-4xl mx-auto text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold tracking-wide uppercase mb-8 shadow-sm">
                        <Rocket className="w-4 h-4" /> Arvo Premium
                    </span>
                    <h1 className="font-serif text-5xl md:text-7xl text-arvo-primary leading-[1.1] mb-8 tracking-tight">
                        Desbloqueie o potencial <br className="hidden md:block" />
                        <span className="italic text-gray-500 font-light">máximo</span> do seu patrimônio.
                    </h1>
                    <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Acesso total às 4 carteiras exclusivas, relatórios trimestrais avançados, e atendimento direto com nossos especialistas financeiros.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/checkout/pagamento" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-arvo-primary rounded-xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/10 hover:shadow-2xl hover:shadow-emerald-900/20 active:scale-[0.98]">
                            Assinar Agora <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link href="#contato" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all">
                            Falar com um Assessor
                        </Link>
                    </div>
                </div>
            </section>

            {/* Benefits Grid */}
            <section id="beneficios" className="py-24 px-6 bg-white border-y border-gray-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-3xl md:text-5xl text-arvo-primary mb-6">Por que ser Premium?</h2>
                        <p className="text-gray-500 text-lg max-w-2xl mx-auto">Tudo que você precisa para tomar as melhores decisões de investimento com segurança e rentabilidade incomparáveis.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Shield, col: "text-abrigo-accent", bg: "bg-abrigo-accent/10", title: "Abrigo", desc: "Acesso total à carteira conservadora e proteção de capital." },
                            { icon: TrendingUp, col: "text-ritmo-accent", bg: "bg-ritmo-accent/10", title: "Ritmo", desc: "Explore alocações moderadas com crescimento sustentável." },
                            { icon: Rocket, col: "text-visao-accent", bg: "bg-visao-accent/10", title: "Visão", desc: "Libere recomendações agressivas para multiplicação de patrimônio." },
                            { icon: Globe, col: "text-oceano-accent", bg: "bg-oceano-accent/10", title: "Oceano", desc: "Acesso a estratégias globais, proteção cambial e mercado exterior." },
                        ].map((item) => (
                            <div key={item.title} className="p-8 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all border border-transparent hover:border-gray-100">
                                <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center mb-6`}>
                                    <item.icon className={`w-7 h-7 ${item.col}`} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact / E-book Form Section */}
            <section id="contato" className="py-24 px-6 relative">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="font-serif text-4xl md:text-5xl text-arvo-primary mb-6 leading-[1.1]">
                            Ainda tem <span className="italic text-gray-500">dúvidas?</span>
                        </h2>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            Deixe seu contato ou baixe nosso E-book gratuito sobre alocação inteligente de portfólio. Nossa equipe de especialistas (CFP®) montará um diagnóstico gratuito.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
                                    <Calendar className="w-6 h-6 text-emerald-700" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg mb-1">Agendamento Flexível</h4>
                                    <p className="text-gray-600">Marcamos o papo no seu formato preferido (Call, Whatsapp, ou Café).</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center shrink-0">
                                    <Download className="w-6 h-6 text-indigo-700" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg mb-1">Material de Excelência</h4>
                                    <p className="text-gray-600">Receba nosso e-book "As 4 Dimensões da Riqueza" inteiramente de graça.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-2xl shadow-gray-200/50 border border-gray-100">
                        <form className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Nome completo</label>
                                <input type="text" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-gray-900" placeholder="Como gosta de ser chamado" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">E-mail corporativo ou pessoal</label>
                                <input type="email" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-gray-900" placeholder="exemplo@arvo.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Qual o melhor horário para falarmos?</label>
                                <select className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-gray-900">
                                    <option>Manhã (09:00 - 12:00)</option>
                                    <option>Tarde (13:00 - 18:00)</option>
                                    <option>Noite (18:00 - 20:00)</option>
                                </select>
                            </div>

                            <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <input type="checkbox" className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 bg-white border-gray-300" defaultChecked />
                                <span className="text-sm font-medium text-gray-700">Quero baixar o E-book "Metodologia ARVO".</span>
                            </label>

                            <button type="submit" className="w-full py-4 text-base font-bold text-white bg-arvo-primary rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20">
                                Solicitar Contato & E-book
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Footer / Final CTA */}
            <section id="assinar" className="py-24 px-6 bg-arvo-primary text-white text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="font-serif text-4xl md:text-5xl mb-8 leading-tight text-white">Pronto para dar o próximo passo rumo à independência?</h2>
                    <p className="text-emerald-100 text-lg mb-10 max-w-xl mx-auto">Assine agora com débito em seu cartão e cancele quando quiser. Sua jornada como investidor premium começa aqui.</p>
                    <Link href="/checkout/pagamento" className="inline-flex items-center justify-center gap-2 px-10 py-5 text-lg font-bold text-arvo-primary bg-white rounded-2xl hover:scale-105 transition-transform shadow-2xl shadow-emerald-900/50">
                        Assinar ARVO Premium (R$ 99/mês)
                    </Link>
                </div>
            </section>
        </div>
    )
}
