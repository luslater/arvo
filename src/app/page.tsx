"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, ShieldCheck, Target, TrendingUp, Globe, Smartphone, BarChart3, ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useEffect, useState } from "react"

export default function Home() {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <div className="flex min-h-screen flex-col font-sans bg-slate-50 text-slate-900 selection:bg-emerald-100">
            {/* Header / Navbar */}
            <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/50' : 'bg-transparent'}`}>
                <div className="container mx-auto max-w-7xl flex h-20 items-center justify-between px-6">
                    <Link href="/" className="flex items-center">
                        <Image src="/arvo-logo.png" alt="ARVO" width={80} height={40} className={`transition-all ${scrolled ? 'opacity-100' : 'brightness-0 invert opacity-100'}`} />
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link href="/login" className={`hidden md:block font-medium text-sm transition-colors hover:text-emerald-500 ${scrolled ? 'text-slate-600' : 'text-slate-200 hover:text-white'}`}>
                            Log in
                        </Link>
                        <Link href="/register">
                            <Button className={`rounded-full px-6 font-semibold transition-all ${scrolled ? 'bg-slate-900 text-white hover:bg-emerald-600 hover:text-white' : 'bg-white text-slate-900 hover:bg-emerald-50'}`}>
                                Começar Agora
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1">
                <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-[#020617] overflow-hidden text-white flex flex-col justify-center min-h-[90vh]">
                    {/* Background Gradients */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
                        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3" />
                    </div>

                    <div className="container mx-auto max-w-7xl px-6 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">

                            {/* Hero Text */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="space-y-8"
                            >
                                <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-300">
                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                    <span>Modelo 100% Fee-Only</span>
                                </div>
                                <h1 className="text-5xl md:text-7xl font-light tracking-tighter leading-[1.1]">
                                    Invista do seu jeito, <br /> com total <span className="font-semibold text-emerald-400">transparência.</span>
                                </h1>
                                <p className="text-xl md:text-2xl font-light text-slate-300 max-w-xl leading-relaxed">
                                    Assuma o controle do seu patrimônio com carteiras inteligentes, recomendação imparcial e planejamento financeiro personalizado. Sem taxas ocultas.
                                </p>

                                <ul className="space-y-3 pt-4 text-slate-300 font-light">
                                    <li className="flex items-center gap-3"><div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center"><div className="h-2 w-2 rounded-full bg-emerald-400" /></div> Zero comissões e rebates escondidos no seu portfólio</li>
                                    <li className="flex items-center gap-3"><div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center"><div className="h-2 w-2 rounded-full bg-emerald-400" /></div> Carteiras baseadas em dados e perfis reais de risco</li>
                                    <li className="flex items-center gap-3"><div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center"><div className="h-2 w-2 rounded-full bg-emerald-400" /></div> Planejamento transparente acompanhado por especialistas</li>
                                </ul>

                                <div className="flex flex-wrap items-center gap-4 pt-6">
                                    <Link href="/register">
                                        <Button size="lg" className="rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 h-14 text-lg">
                                            Criar Conta Grátis
                                        </Button>
                                    </Link>
                                    <Link href="/login">
                                        <Button variant="outline" size="lg" className="rounded-full border-slate-700 hover:bg-slate-800 text-white hover:text-white px-8 h-14 text-lg font-medium">
                                            Conhecer a Plataforma
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>

                            {/* Hero Mockup */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, rotate: 2 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                                className="relative hidden lg:block"
                            >
                                {/* Floating elements pretending to be the app */}
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[340px] h-[680px] bg-slate-900 rounded-[3rem] border-8 border-slate-800 shadow-2xl overflow-hidden transform -rotate-6 transition-transform hover:-rotate-3 duration-500 origin-bottom">
                                    {/* Mock UI Header */}
                                    <div className="h-24 bg-gradient-to-br from-emerald-900 to-slate-900 p-6 flex flex-col justify-end">
                                        <div className="text-emerald-400 text-xs font-bold tracking-widest uppercase mb-1">Carteira Ritmo</div>
                                        <div className="text-white text-3xl font-light">R$ 1.250.000</div>
                                    </div>
                                    {/* Mock UI Body */}
                                    <div className="p-6 space-y-6 bg-slate-950 h-full">
                                        <div className="flex items-end gap-2 pb-4 border-b border-slate-800">
                                            <div className="h-16 w-8 bg-emerald-500 rounded-t-sm opacity-20"></div>
                                            <div className="h-24 w-8 bg-emerald-500 rounded-t-sm opacity-40"></div>
                                            <div className="h-12 w-8 bg-emerald-500 rounded-t-sm opacity-60"></div>
                                            <div className="h-32 w-8 bg-emerald-500 rounded-t-sm opacity-80"></div>
                                            <div className="h-40 w-8 bg-emerald-500 rounded-t-sm"></div>
                                        </div>

                                        <div className="space-y-4">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                                                            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                                                        </div>
                                                        <div>
                                                            <div className="w-20 h-2 bg-slate-700 rounded mb-2"></div>
                                                            <div className="w-12 h-2 bg-slate-800 rounded"></div>
                                                        </div>
                                                    </div>
                                                    <div className="w-16 h-4 bg-slate-800 rounded"></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Secondary floating card */}
                                <div className="absolute right-32 bottom-20 w-64 bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-2xl z-20 transform rotate-3">
                                    <div className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Score de Aderência</div>
                                    <div className="flex items-end gap-2">
                                        <div className="text-4xl font-light text-white">98%</div>
                                        <div className="text-sm text-emerald-400 font-medium mb-1 flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> Excelente</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Stats Bar */}
                <section className="bg-emerald-600 text-white border-y border-emerald-700">
                    <div className="container mx-auto max-w-7xl px-6 py-12">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center divide-x divide-emerald-500/30">
                            <div>
                                <div className="text-3xl md:text-5xl font-light mb-1">100%</div>
                                <div className="text-sm font-semibold uppercase tracking-widest text-emerald-200">Fee-Only</div>
                            </div>
                            <div>
                                <div className="text-3xl md:text-5xl font-light mb-1">R$ 0</div>
                                <div className="text-sm font-semibold uppercase tracking-widest text-emerald-200">Comissões Ocultas</div>
                            </div>
                            <div>
                                <div className="text-3xl md:text-5xl font-light mb-1">4</div>
                                <div className="text-sm font-semibold uppercase tracking-widest text-emerald-200">Carteiras Inteligentes</div>
                            </div>
                            <div>
                                <div className="text-3xl md:text-5xl font-light mb-1">Sim</div>
                                <div className="text-sm font-semibold uppercase tracking-widest text-emerald-200">Foco no seu Sucesso</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Lifestyle Cards */}
                <section className="py-24 bg-slate-50">
                    <div className="container mx-auto max-w-7xl px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-extralight text-slate-900 mb-4">Soluções para cada momento da sua vida financeira.</h2>
                            <p className="text-xl text-slate-500 font-light max-w-2xl mx-auto">Tire o máximo proveito do seu dinheiro, não importa onde você esteja na sua jornada.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Card 1 */}
                            <div className="group relative overflow-hidden rounded-3xl bg-slate-900 aspect-[4/5] flex flex-col justify-end p-8">
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10" />
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579621970588-a3f5ce5a08ae?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-50 group-hover:scale-105 transition-transform duration-700" />
                                <div className="relative z-20 space-y-3">
                                    <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest rounded-full mb-2">Fundação</div>
                                    <h3 className="text-3xl text-white font-light leading-tight">Construindo sua Reserva</h3>
                                    <p className="text-slate-300 font-light">Estratégias para rentabilizar seu caixa com liquidez imediata e proteção contra inflação, a fundação de todo portfólio.</p>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="group relative overflow-hidden rounded-3xl bg-emerald-900 aspect-[4/5] flex flex-col justify-end p-8">
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-emerald-900/40 to-transparent z-10" />
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-50 group-hover:scale-105 transition-transform duration-700" />
                                <div className="relative z-20 space-y-3">
                                    <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest rounded-full mb-2">Acumulação</div>
                                    <h3 className="text-3xl text-white font-light leading-tight">Crescimento Patrimonial</h3>
                                    <p className="text-slate-300 font-light">As carteiras <strong className="font-semibold text-white">Ritmo</strong> e <strong className="font-semibold text-white">Vanguarda</strong> maximizam retorno no longo prazo respeitando seu conforto com a volatilidade.</p>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="group relative overflow-hidden rounded-3xl bg-blue-900 aspect-[4/5] flex flex-col justify-end p-8">
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-blue-900/40 to-transparent z-10" />
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-60 group-hover:scale-105 transition-transform duration-700" />
                                <div className="relative z-20 space-y-3">
                                    <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest rounded-full mb-2">Diversificação Global</div>
                                    <h3 className="text-3xl text-white font-light leading-tight">Acesso ao Mundo Real</h3>
                                    <p className="text-slate-300 font-light">Através da carteira <strong className="font-semibold text-white">Oceano</strong>, explore ativos globais, S&P 500 e setores de ponta para dolarizar sua tese.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Product Section 1 */}
                <section className="py-24 bg-white overflow-hidden">
                    <div className="container mx-auto max-w-7xl px-6">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-6xl font-extralight text-slate-900 mb-6">Comece com um portfólio pronto,<br /> ou crie o seu.</h2>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                            <div className="space-y-6 order-2 lg:order-1">
                                <div className="text-emerald-600 font-bold uppercase tracking-widest text-sm">Carteiras Gerenciadas ARVO</div>
                                <h3 className="text-3xl md:text-5xl font-light text-slate-900 leading-tight">Diversificação global em índices, gerenciada para você.</h3>
                                <p className="text-xl text-slate-600 font-light leading-relaxed">
                                    Faça o nosso questionário e encontraremos a alocação perfeita baseada em dados reais. Nós indicamos os melhores fundos passivos para compor o seu portfólio com rebalanceamento constante sugerido no aplicativo.
                                </p>
                                <ul className="space-y-4 pt-4">
                                    <li className="flex gap-4">
                                        <div className="mt-1 bg-emerald-100 text-emerald-600 p-1.5 rounded-full h-fit"><Target className="w-4 h-4" /></div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900">Alinhado ao seu perfil de conforto</h4>
                                            <p className="text-slate-600 font-light text-sm">Adequação exata do portfólio para você dormir tranquilo, nem muito risco, nem conversador demais.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="mt-1 bg-emerald-100 text-emerald-600 p-1.5 rounded-full h-fit"><Globe className="w-4 h-4" /></div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900">Design sustentável de longo prazo</h4>
                                            <p className="text-slate-600 font-light text-sm">Diversificação testada focada em captura de mercado primário com baixo custo operacional.</p>
                                        </div>
                                    </li>
                                </ul>
                                <div className="pt-6">
                                    <Link href="/questionnaire">
                                        <Button size="lg" className="rounded-full bg-slate-900 hover:bg-emerald-600 text-white px-8 h-12">
                                            Responder Questionário
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="relative order-1 lg:order-2 bg-slate-50 p-8 rounded-[3rem] border border-slate-100 flex justify-center h-[600px] overflow-hidden">
                                {/* UI Mockup Phone Flat */}
                                <div className="w-[300px] bg-white rounded-[2.5rem] border-[6px] border-slate-900 shadow-xl overflow-hidden translate-y-8">
                                    {/* App Header */}
                                    <div className="p-5 border-b border-slate-100 bg-slate-50 text-center">
                                        <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-[#A3BFD9] to-[#5687AF] mb-3"></div>
                                        <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Recomendação: Vanguarda</div>
                                        <div className="text-2xl font-light mt-1">R$ 500.000</div>
                                    </div>
                                    {/* App Body - the slice of pie chart */}
                                    <div className="p-6">
                                        <div className="w-40 h-40 mx-auto rounded-full border-[16px] border-[#5687AF] border-t-[#C9B8A3] border-r-[#A8C5A1] relative">
                                            <div className="absolute inset-0 m-auto w-16 h-16 bg-white rounded-full"></div>
                                        </div>
                                        <div className="mt-8 space-y-3">
                                            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg"><span className="text-sm font-medium flex items-center gap-2"><div className="w-3 h-3 bg-[#5687AF] rounded"></div> Ações</span> <span>60%</span></div>
                                            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg"><span className="text-sm font-medium flex items-center gap-2"><div className="w-3 h-3 bg-[#A8C5A1] rounded"></div> FIIs / Alt</span> <span>25%</span></div>
                                            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg"><span className="text-sm font-medium flex items-center gap-2"><div className="w-3 h-3 bg-[#C9B8A3] rounded"></div> Renda Fixa</span> <span>15%</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Block 2 Reverse */}
                        <div className="grid lg:grid-cols-2 gap-16 items-center pt-24 border-t border-slate-100">
                            <div className="relative bg-slate-50 p-8 rounded-[3rem] border border-slate-100 flex justify-center h-[600px] overflow-hidden">
                                {/* UI Mockup Chart Tool */}
                                <div className="w-[360px] bg-slate-900 text-white rounded-2xl shadow-2xl p-6 mt-12 flex flex-col justify-between">
                                    <div className="flex justify-between items-end mb-8">
                                        <div>
                                            <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Capital Acumulado R$</div>
                                            <div className="text-4xl font-light text-emerald-400">R$ 2.450.300</div>
                                        </div>
                                    </div>
                                    {/* Chart bars fake */}
                                    <div className="flex items-end gap-2 h-40 pb-4 border-b border-emerald-900/50">
                                        {[20, 30, 45, 60, 80, 100, 120, 150].map((h, i) => (
                                            <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-emerald-600 to-emerald-400" style={{ height: `${h}%` }}></div>
                                        ))}
                                    </div>
                                    <div className="pt-6 space-y-4">
                                        <div className="flex justify-between text-sm"><span className="text-slate-400">Renda Mensal Passiva</span><span className="font-semibold">R$ 10.200</span></div>
                                        <div className="h-1.5 w-full bg-slate-800 rounded-full"><div className="h-full w-[85%] bg-emerald-500 rounded-full"></div></div>
                                        <div className="text-xs text-right font-light text-emerald-400">85% da Meta (Regra dos 4%)</div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="text-blue-600 font-bold uppercase tracking-widest text-sm">Simulador de Independência</div>
                                <h3 className="text-3xl md:text-5xl font-light text-slate-900 leading-tight">Projeções em tempo real para tomada de decisão assertiva.</h3>
                                <p className="text-xl text-slate-600 font-light leading-relaxed">
                                    Utilizamos a ferramenta analítica de planejamento para projetar o efeito devastadoramente positivo dos juros compostos. Avalie quanto você precisa aportar hoje para o padrão de vida que deseja amanhã.
                                </p>
                                <ul className="space-y-4 pt-4">
                                    <li className="flex gap-4">
                                        <div className="mt-1 bg-blue-100 text-blue-600 p-1.5 rounded-full h-fit"><BarChart3 className="w-4 h-4" /></div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900">Rentabilidade Real Embutida</h4>
                                            <p className="text-slate-600 font-light text-sm">Nossa máquina financeira sempre debita o IPCA e projeta apenas com taxas sustentáveis, evitando que você seja enganado por simulações milagrosas da internet.</p>
                                        </div>
                                    </li>
                                </ul>
                                <div className="pt-6">
                                    <Link href="/planejamento">
                                        <Button variant="outline" size="lg" className="rounded-full border-slate-300 hover:bg-slate-50 text-slate-900 px-8 h-12">
                                            Testar Simulador
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Value Props / Comparison */}
                <section className="py-24 bg-slate-900 text-white">
                    <div className="container mx-auto max-w-7xl px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-extralight mb-4">Investimento do Seu Jeito, não do Banco.</h2>
                            <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto">
                                Enquanto o mercado tracional funciona através de corrupção sistêmica na distribuição (rebates), nós nos posicionamos na mesa para representar você.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            <div className="bg-slate-800 rounded-3xl p-10 border border-slate-700">
                                <h3 className="text-2xl font-light mb-6 text-emerald-400">Modelo ARVO (Fee-Only)</h3>
                                <ul className="space-y-6 font-light">
                                    <li className="flex items-start gap-4"><div className="mt-1 bg-emerald-500/20 text-emerald-400 p-1 rounded-full"><ShieldCheck className="w-4 h-4" /></div> Nós cobramos uma assinatura fixa, independente do valor aportado ou produto financeiro.</li>
                                    <li className="flex items-start gap-4"><div className="mt-1 bg-emerald-500/20 text-emerald-400 p-1 rounded-full"><ShieldCheck className="w-4 h-4" /></div> O nosso único incentivo é que seu patrimônio performe e cresça consistentemente.</li>
                                    <li className="flex items-start gap-4"><div className="mt-1 bg-emerald-500/20 text-emerald-400 p-1 rounded-full"><ShieldCheck className="w-4 h-4" /></div> Sugerimos os fundos estritamente mais baratos e que compõem portfólios vencedores.</li>
                                </ul>
                            </div>
                            <div className="bg-slate-950/50 rounded-3xl p-10 border border-slate-800">
                                <h3 className="text-2xl font-light mb-6 text-slate-400">Bancos & Corretoras</h3>
                                <ul className="space-y-6 text-slate-400 font-light">
                                    <li className="flex items-start gap-4"><div className="mt-1 bg-slate-800 text-red-400 p-1 rounded-full"><ShieldCheck className="w-4 h-4" /></div> Cobram taxas embutidas em cada produto (rebates), prejudicando a performance a longo prazo.</li>
                                    <li className="flex items-start gap-4"><div className="mt-1 bg-slate-800 text-red-400 p-1 rounded-full"><ShieldCheck className="w-4 h-4" /></div> Indicam investimentos porque as comissões pagam grandes bônus aos assessores.</li>
                                    <li className="flex items-start gap-4"><div className="mt-1 bg-slate-800 text-red-400 p-1 rounded-full"><ShieldCheck className="w-4 h-4" /></div> Giraram o portfólio dos clientes para abater IR (come-cotas) em favor da corretagem.</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-20 text-center">
                            <p className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Mencionado pela Indústria</p>
                            <div className="flex justify-center items-center gap-6 saturate-0 opacity-50">
                                {/* Placeholder text instead of logos if we don't have them */}
                                <span className="text-xl font-bold">INFO<span className="font-light">MONEY</span></span>
                                <span className="text-xl font-bold italic">Valor<span className="font-light">Econômico</span></span>
                                <span className="text-xl font-bold tracking-tighter">EXAME</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="py-24 bg-white">
                    <div className="container mx-auto max-w-4xl px-6">
                        <div className="grid md:grid-cols-[1fr_2fr] gap-12 items-start">
                            <div>
                                <h2 className="text-3xl md:text-5xl font-extralight text-slate-900 leading-tight">Perguntas?<br />5 coisas para saber em 5 minutos.</h2>
                                <p className="mt-4 text-slate-500 font-light">
                                    Tem mais perguntas sobre a ARVO? Visite nossa página de ajuda.
                                </p>
                            </div>
                            <div>
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger className="text-left text-lg font-medium">O que significa ser "Fee-Only"?</AccordionTrigger>
                                        <AccordionContent className="text-slate-600 font-light text-base leading-relaxed">
                                            Significa que somos remunerados exclusivamente por você, através de uma tecnologia ou assinatura, nunca através de comissões de produtos financeiros (rebates). Isso elimina incentivos conflitantes que afligem o modelo tradicional bancário.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2">
                                        <AccordionTrigger className="text-left text-lg font-medium">Quanto custa usar a ARVO?</AccordionTrigger>
                                        <AccordionContent className="text-slate-600 font-light text-base leading-relaxed">
                                            A plataforma ARVO possui um modelo freemium. Você pode simular a carteira e planejar a independência de graça. Para visualizar fundos específicos detalhados ou consultar a alocação de carteiras especiais como RITMO, VANGUARDA e OCEANO, oferecemos a assinatura Premium, justa, com base no volume de recursos administrados.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-3">
                                        <AccordionTrigger className="text-left text-lg font-medium">Posso usar meus ativos pessoais já investidos?</AccordionTrigger>
                                        <AccordionContent className="text-slate-600 font-light text-base leading-relaxed">
                                            Absolutamente. A ferramenta <strong>Adaptar Carteira</strong> ajuda você a cadastrar seus ativos atuais e entender a aderência deles comparada às recomendações sugeridas de carteira modelo, assim você faz as pontes e transições sem ter que liquidar tudo em impostos agora.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-4">
                                        <AccordionTrigger className="text-left text-lg font-medium">Como as carteiras são montadas e sugeridas?</AccordionTrigger>
                                        <AccordionContent className="text-slate-600 font-light text-base leading-relaxed">
                                            Utilizamos a diversificação passiva, embasada na teoria moderna de Portfólios, distribuindo capital entre fundos passivos globais, ETFs e Rendas Fixas IPCA+, tudo em alocações baseadas em um backtest de performance de mercado seguro de longo percurso, para capturar o rendimento do mercado sem risco ativo.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA Full width */}
                <section className="bg-emerald-600 border-y border-emerald-700 py-32 text-center text-white px-6">
                    <h2 className="text-4xl md:text-6xl font-extralight mb-8">Poupe e invista <span className="font-semibold italic">para o que vem a seguir.</span></h2>
                    <Link href="/register">
                        <Button size="lg" className="rounded-full bg-white text-emerald-600 hover:bg-slate-50 font-bold px-10 h-16 text-xl shadow-2xl">
                            Abrir Conta na Arvo
                        </Button>
                    </Link>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-slate-950 text-slate-400 py-16">
                <div className="container mx-auto max-w-7xl px-6">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
                        <div className="col-span-2 md:col-span-1">
                            <Image src="/arvo-logo.png" alt="ARVO" width={80} height={40} className="brightness-0 invert mb-6 opacity-50" />
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4 text-sm">Investimentos</h4>
                            <ul className="space-y-3 text-sm font-light">
                                <li>Carteiras Recomendadas</li>
                                <li>Visão Geral Global</li>
                                <li>Rebalanceamento</li>
                                <li>Ferramenta de Planejamento</li>
                                <li>Pricing</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4 text-sm">Ferramentas</h4>
                            <ul className="space-y-3 text-sm font-light">
                                <li>Match de Portfólio</li>
                                <li>Simulador Aposentadoria</li>
                                <li>Regra dos 4%</li>
                            </ul>
                            <h4 className="text-white font-semibold mb-4 mt-8 text-sm">Empresa</h4>
                            <ul className="space-y-3 text-sm font-light">
                                <li>Nossas Teses</li>
                                <li>Assessores (CFP®)</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4 text-sm">Aprenda</h4>
                            <ul className="space-y-3 text-sm font-light">
                                <li>Blog Educação</li>
                                <li>Central de Ajuda</li>
                                <li>Glossário Financeiro</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4 text-sm">Legal</h4>
                            <ul className="space-y-3 text-sm font-light">
                                <li>Termos de Uso</li>
                                <li>Privacidade</li>
                                <li>Compliance (CVM 179)</li>
                                <li>Segurança</li>
                            </ul>
                        </div>
                    </div>

                    <div className="text-[10px] leading-relaxed border-t border-slate-800 pt-8 opacity-60">
                        <p className="mb-4">
                            Investimentos financeiros não são garantidos e acarretam riscos, incluindo a possível perda de valor principal investido.
                            O desempenho passado ou as projeções apresentadas na plataforma ARVO não são garantias de desempenho futuro.
                            As carteiras (Abrigo, Ritmo, Vanguarda, Oceano) são sugeridas de acordo com questionário de idoneidade e suitability,
                            não configurando recomendação unânime irrefutável e isenta de riscos de mercado, liquidez e crédito inerentes ao sistema capitalista.
                        </p>
                        <p className="mb-4">
                            A ARVO atua como provedora de tecnologia de recomendação passiva e planejamento, cobrando uma tarifa administrativa Fixa ("Fee-only").
                            Sem incidência de comissões por indicação de produtos (rebate-free) mantendo conformidade em suas disposições do compliance sob regulamentações locais em território de jurisdição ativa de assessores operantes no ecossistema (se contratados para tal serviço).
                        </p>
                        <p className="text-center mt-8">ARVO® Marca Registrada | 2026</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
