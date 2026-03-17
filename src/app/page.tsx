"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Target, TrendingUp, Globe, BarChart3, Settings, Wallet, PieChart, LineChart as LucideLineChart, LayoutDashboard, BookOpen, Users, MessageSquare, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const portfolioPerformanceData = [
    { year: '2016', CDI: 0, Abrigo: 0, Ritmo: 0, Vanguarda: 0 },
    { year: '2017', CDI: 10, Abrigo: 11, Ritmo: 15, Vanguarda: 20 },
    { year: '2018', CDI: 17, Abrigo: 19, Ritmo: 25, Vanguarda: 30 },
    { year: '2019', CDI: 23, Abrigo: 26, Ritmo: 35, Vanguarda: 45 },
    { year: '2020', CDI: 27, Abrigo: 31, Ritmo: 28, Vanguarda: 15 },
    { year: '2021', CDI: 33, Abrigo: 38, Ritmo: 38, Vanguarda: 35 },
    { year: '2022', CDI: 50, Abrigo: 56, Ritmo: 55, Vanguarda: 45 },
    { year: '2023', CDI: 69, Abrigo: 77, Ritmo: 85, Vanguarda: 80 },
    { year: '2024', CDI: 87, Abrigo: 98, Ritmo: 110, Vanguarda: 115 },
    { year: '2025', CDI: 106, Abrigo: 119, Ritmo: 130, Vanguarda: 140 },
    { year: '2026', CDI: 125, Abrigo: 138, Ritmo: 147, Vanguarda: 158 }
]

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
        <div className="flex min-h-screen flex-col font-sans bg-slate-50 text-slate-900 selection:bg-blue-100">
            {/* Header / Navbar */}
            <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/50' : 'bg-transparent'}`}>
                <div className="container mx-auto max-w-7xl flex h-20 items-center justify-between px-6">
                    <Link href="/" className="flex items-center">
                        <Image src="/arvo-logo-transparent.png" alt="ARVO" width={85} height={42} className={`transition-all ${scrolled ? 'invert' : 'opacity-100'}`} />
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link href="/login" className={`hidden md:block font-medium text-sm transition-colors hover:text-blue-500 ${scrolled ? 'text-slate-600' : 'text-slate-200 hover:text-white'}`}>
                            Log in
                        </Link>
                        <Link href="/register">
                            <Button className={`rounded-full px-6 font-semibold transition-all ${scrolled ? 'bg-slate-900 text-white hover:bg-blue-600 hover:text-white' : 'bg-white text-slate-900 hover:bg-blue-50'}`}>
                                Começar Agora
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1">
                <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-[#0A192F] overflow-hidden text-white flex flex-col justify-center min-h-[90vh]">
                    {/* Background Gradients */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
                        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-slate-400/10 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/3" />
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
                                <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-300">
                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                    <span>Plataforma independente | Modelo fee-only</span>
                                </div>
                                <h1 className="text-5xl md:text-7xl font-light tracking-tighter leading-[1.1]">
                                    Organize seus investimentos com <span className="font-semibold text-blue-400">método</span>, clareza e independência.
                                </h1>
                                <p className="text-xl md:text-2xl font-light text-slate-300 max-w-xl leading-relaxed">
                                    A ARVO é uma plataforma de orientação financeira independente. Transformamos objetivos de vida em planejamento financeiro e carteiras de investimento claras, para que você saiba onde investir, quanto investir e o que fazer ao longo do tempo.
                                </p>

                                <ul className="space-y-3 pt-4 text-slate-300 font-light">
                                    <li className="flex items-center gap-3"><div className="h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center"><div className="h-2 w-2 rounded-full bg-blue-400" /></div> Sem comissão por produto indicado</li>
                                    <li className="flex items-center gap-3"><div className="h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center"><div className="h-2 w-2 rounded-full bg-blue-400" /></div> Planejamento como norte da estratégia</li>
                                    <li className="flex items-center gap-3"><div className="h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center"><div className="h-2 w-2 rounded-full bg-blue-400" /></div> Carteiras alinhadas ao seu perfil e objetivos</li>
                                </ul>

                                <div className="flex flex-wrap items-center gap-4 pt-6">
                                    <Link href="/register">
                                        <Button size="lg" className="rounded-full bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold px-8 h-14 text-lg">
                                            Começar agora
                                        </Button>
                                    </Link>
                                    <Button onClick={() => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })} variant="outline" size="lg" className="rounded-full border-slate-700 hover:bg-slate-800 text-white hover:text-white px-8 h-14 text-lg font-medium">
                                        Entender como funciona
                                    </Button>
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
                                    <div className="h-24 bg-gradient-to-br from-blue-900 to-slate-900 p-6 flex flex-col justify-end">
                                        <div className="text-blue-400 text-xs font-bold tracking-widest uppercase mb-1">Carteira Ritmo</div>
                                        <div className="text-white text-3xl font-light">R$ 350.000,00</div>
                                    </div>
                                    {/* Mock UI Body */}
                                    <div className="p-6 space-y-6 bg-slate-950 h-full">
                                        <div className="flex items-end gap-2 pb-4 border-b border-slate-800">
                                            <div className="h-16 w-8 bg-blue-500 rounded-t-sm opacity-20"></div>
                                            <div className="h-24 w-8 bg-blue-500 rounded-t-sm opacity-40"></div>
                                            <div className="h-12 w-8 bg-blue-500 rounded-t-sm opacity-60"></div>
                                            <div className="h-32 w-8 bg-blue-500 rounded-t-sm opacity-80"></div>
                                            <div className="h-40 w-8 bg-blue-500 rounded-t-sm"></div>
                                        </div>

                                        <div className="space-y-4">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                                                            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
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
                                        <div className="text-sm text-blue-400 font-medium mb-1 flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> Excelente</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Stats Bar */}
                <section className="bg-[#0A192F] text-white border-y border-slate-800">
                    <div className="container mx-auto max-w-7xl px-6 py-12">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center divide-x divide-slate-800">
                            <div>
                                <div className="text-3xl md:text-5xl font-light mb-1">100%</div>
                                <div className="text-sm font-semibold uppercase tracking-widest text-slate-400 mt-2">Fee-Only</div>
                            </div>
                            <div>
                                <div className="text-3xl md:text-5xl font-light mb-1">R$ 0</div>
                                <div className="text-sm font-semibold uppercase tracking-widest text-slate-400 mt-2">Comissões Ocultas</div>
                            </div>
                            <div>
                                <div className="text-2xl md:text-4xl font-light mb-1 md:mt-1">Diversas</div>
                                <div className="text-sm font-semibold uppercase tracking-widest text-slate-400 mt-2">Carteiras</div>
                            </div>
                            <div>
                                <div className="text-3xl md:text-5xl font-light mb-1">Sim</div>
                                <div className="text-sm font-semibold uppercase tracking-widest text-slate-400 mt-2">Foco no seu Sucesso</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Identificação Block */}
                <section className="py-24 bg-white">
                    <div className="container mx-auto max-w-5xl px-6 text-center">
                        <h2 className="text-4xl md:text-6xl font-light text-slate-900 leading-[1.15]">
                            Se você já investe, mas ainda sente que está <span className="font-semibold italic text-blue-600">sem direção</span>, a ARVO foi feita para você.
                        </h2>
                    </div>
                </section>

                {/* Historico de Carteiras */}
                <section className="py-24 bg-slate-50 border-t border-slate-100">
                    <div className="container mx-auto max-w-7xl px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-4 tracking-tight leading-[1.15]">Performance histórica validada</h2>
                            <p className="text-xl text-slate-500 font-light max-w-2xl mx-auto">Em vez de opiniões e dicas do momento, criamos portfólios baseados no mundo real. Compare a performance em cenário real (10 anos).</p>
                        </div>

                        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
                            {/* Click overlay */}
                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/40 hover:bg-slate-900/10 backdrop-blur-[1px] transition-all opacity-0 hover:opacity-100 group">
                                <Link href="/login">
                                    <Button size="lg" className="rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-xl px-10 h-14 text-lg transform group-hover:scale-105 transition-transform">
                                        Fazer login para acessar as carteiras
                                    </Button>
                                </Link>
                            </div>

                            <div className="flex flex-col md:flex-row gap-8 mb-10">
                                {/* Legends and titles */}
                                <div className="flex-1">
                                    <h3 className="text-2xl font-medium text-slate-800 mb-6">Carteiras ARVO vs. CDI</h3>
                                    <div className="space-y-4 pt-4">
                                        <div className="flex justify-between items-center bg-emerald-50 p-5 rounded-2xl border border-emerald-100">
                                            <div className="flex items-center gap-4">
                                                <div className="w-5 h-5 rounded-full bg-emerald-500"></div>
                                                <span className="font-medium text-emerald-900 text-lg">Abrigo</span>
                                            </div>
                                            <span className="font-bold text-emerald-700 text-lg">110% do CDI</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-blue-50 p-5 rounded-2xl border border-blue-100">
                                            <div className="flex items-center gap-4">
                                                <div className="w-5 h-5 rounded-full bg-blue-500"></div>
                                                <span className="font-medium text-blue-900 text-lg">Ritmo</span>
                                            </div>
                                            <span className="font-bold text-blue-700 text-lg">117% do CDI</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-indigo-50 p-5 rounded-2xl border border-indigo-100">
                                            <div className="flex items-center gap-4">
                                                <div className="w-5 h-5 rounded-full bg-indigo-500"></div>
                                                <span className="font-medium text-indigo-900 text-lg">Vanguarda</span>
                                            </div>
                                            <span className="font-bold text-indigo-700 text-lg">126% do CDI</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200 mt-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                                                <span className="font-medium text-slate-600">Benchmark (CDI)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* The chart */}
                                <div className="w-full md:w-2/3 h-[400px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={portfolioPerformanceData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                            <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(val) => `${val}%`} />
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} formatter={(value: number) => [`${value}%`, 'Acumulado']} labelStyle={{ color: '#64748b', fontWeight: 'bold', marginBottom: '4px' }} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                            <Line type="monotone" dataKey="CDI" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} activeDot={{ r: 6 }} />
                                            <Line type="monotone" dataKey="Abrigo" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                                            <Line type="monotone" dataKey="Ritmo" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                                            <Line type="monotone" dataKey="Vanguarda" stroke="#6366f1" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
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
                            <div className="group relative overflow-hidden rounded-3xl bg-slate-900 aspect-[4/5] flex flex-col justify-end p-8 text-white">
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10" />
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579621970588-a3f5ce5a08ae?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-50 group-hover:scale-105 transition-transform duration-700" />
                                <div className="relative z-20 space-y-3">
                                    <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md !text-white text-xs font-bold uppercase tracking-widest rounded-full mb-2">Fundação</div>
                                    <h3 className="text-3xl !text-white font-light leading-tight">Construindo sua Reserva</h3>
                                    <p className="!text-slate-300 font-light">Estratégias para rentabilizar seu caixa com liquidez imediata e proteção contra inflação, a fundação de todo portfólio.</p>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="group relative overflow-hidden rounded-3xl bg-blue-900 aspect-[4/5] flex flex-col justify-end p-8 text-white">
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-blue-900/40 to-transparent z-10" />
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-50 group-hover:scale-105 transition-transform duration-700" />
                                <div className="relative z-20 space-y-3">
                                    <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md !text-white text-xs font-bold uppercase tracking-widest rounded-full mb-2">Acumulação</div>
                                    <h3 className="text-3xl !text-white font-light leading-tight">Crescimento Patrimonial</h3>
                                    <p className="!text-slate-300 font-light">As carteiras <strong className="font-semibold !text-white">Ritmo</strong> e <strong className="font-semibold !text-white">Vanguarda</strong> maximizam retorno no longo prazo respeitando seu conforto com a volatilidade.</p>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="group relative overflow-hidden rounded-3xl bg-blue-900 aspect-[4/5] flex flex-col justify-end p-8 text-white">
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-blue-900/40 to-transparent z-10" />
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-60 group-hover:scale-105 transition-transform duration-700" />
                                <div className="relative z-20 space-y-3">
                                    <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md !text-white text-xs font-bold uppercase tracking-widest rounded-full mb-2">Diversificação Global</div>
                                    <h3 className="text-3xl !text-white font-light leading-tight">Acesso ao Mundo Real</h3>
                                    <p className="!text-slate-300 font-light">Através da carteira <strong className="font-semibold !text-white">Oceano</strong>, explore ativos globais, S&P 500 e setores de ponta para dolarizar sua tese.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Product Section 1 */}
                <section className="py-24 bg-white overflow-hidden">
                    <div className="container mx-auto max-w-7xl px-6">

                        {/* 3) O que a ARVO faz */}
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-6 tracking-tight leading-[1.15]">Planejamento para dar direção.<br /> Carteiras para executar a estratégia.</h2>
                            <p className="text-xl text-slate-500 font-light max-w-3xl mx-auto leading-relaxed">
                                Na ARVO, o planejamento financeiro não é um complemento. É o ponto de partida. A partir dele, estruturamos carteiras de investimento alinhadas ao seu perfil, à sua fase de vida e aos seus objetivos.
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                            <div className="space-y-6 order-2 lg:order-1">
                                <ul className="space-y-4 pt-4">
                                    <li className="flex items-center gap-4">
                                        <div className="bg-blue-100 text-blue-600 p-2 rounded-full h-fit"><Target className="w-5 h-5" /></div>
                                        <span className="text-lg text-slate-700 font-light">Onde investir</span>
                                    </li>
                                    <li className="flex items-center gap-4">
                                        <div className="bg-blue-100 text-blue-600 p-2 rounded-full h-fit"><Wallet className="w-5 h-5" /></div>
                                        <span className="text-lg text-slate-700 font-light">Quanto investir</span>
                                    </li>
                                    <li className="flex items-center gap-4">
                                        <div className="bg-blue-100 text-blue-600 p-2 rounded-full h-fit"><TrendingUp className="w-5 h-5" /></div>
                                        <span className="text-lg text-slate-700 font-light">Quanto precisa acumular</span>
                                    </li>
                                    <li className="flex items-center gap-4">
                                        <div className="bg-blue-100 text-blue-600 p-2 rounded-full h-fit"><Settings className="w-5 h-5" /></div>
                                        <span className="text-lg text-slate-700 font-light">Quais ajustes fazer ao longo do tempo</span>
                                    </li>
                                    <li className="flex items-center gap-4">
                                        <div className="bg-blue-100 text-blue-600 p-2 rounded-full h-fit"><ShieldCheck className="w-5 h-5" /></div>
                                        <span className="text-lg text-slate-700 font-light">Como manter consistência sem depender do ruído do mercado</span>
                                    </li>
                                </ul>
                                <p className="pt-6 text-lg font-medium text-blue-700 italic border-l-4 border-blue-500 pl-4 bg-blue-50 py-3 pr-4 rounded-r-lg">
                                    Tudo isso com uma lógica independente, transparente e orientada por método.
                                </p>
                            </div>
                            <div className="relative order-1 lg:order-2 bg-slate-50 p-8 rounded-[3rem] border border-slate-100 flex justify-center h-[500px] overflow-hidden">
                                {/* UI Mockup Phone Flat */}
                                <div className="w-[300px] bg-white rounded-[2.5rem] border-[6px] border-slate-900 shadow-xl overflow-hidden translate-y-8">
                                    <div className="p-5 border-b border-slate-100 bg-slate-50 text-center">
                                        <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-[#A3BFD9] to-[#5687AF] mb-3"></div>
                                        <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Recomendação: Vanguarda</div>
                                        <div className="text-2xl font-light mt-1">R$ 300.000,00</div>
                                    </div>
                                    <div className="p-6">
                                        <div className="w-40 h-40 mx-auto rounded-full border-[16px] border-[#5687AF] border-t-[#C9B8A3] border-r-[#A8C5A1] relative">
                                            <div className="absolute inset-0 m-auto w-16 h-16 bg-white rounded-full"></div>
                                        </div>
                                        <div className="mt-8 space-y-3">
                                            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg"><span className="text-sm font-medium flex items-center gap-2"><div className="w-3 h-3 bg-[#5687AF] rounded"></div> Fundo de Ações</span> <span>27%</span></div>
                                            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg"><span className="text-sm font-medium flex items-center gap-2"><div className="w-3 h-3 bg-[#A8C5A1] rounded"></div> FIIs / Alt</span> <span>25%</span></div>
                                            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg"><span className="text-sm font-medium flex items-center gap-2"><div className="w-3 h-3 bg-[#C9B8A3] rounded"></div> Renda Fixa</span> <span>15%</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 4) Como Funciona */}
                        <div className="pt-24 border-t border-slate-100 mb-20" id="como-funciona">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-4 tracking-tight leading-[1.15]">Uma estrutura simples para decisões melhores</h2>
                            </div>
                            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 text-center">
                                    <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-md shadow-blue-500/20">1</div>
                                    <h4 className="text-xl font-medium text-slate-900 mb-3">Entendemos seu perfil e seus objetivos</h4>
                                    <p className="text-slate-600 font-light leading-relaxed">Você responde ao questionário e organiza sua realidade financeira, seu momento e seu nível de conforto com risco.</p>
                                </div>
                                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 text-center">
                                    <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-md shadow-blue-500/20">2</div>
                                    <h4 className="text-xl font-medium text-slate-900 mb-3">Construímos sua estratégia</h4>
                                    <p className="text-slate-600 font-light leading-relaxed">Transformamos seus objetivos em uma lógica clara de planejamento, aportes e alocação.</p>
                                </div>
                                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 text-center">
                                    <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-md shadow-blue-500/20">3</div>
                                    <h4 className="text-xl font-medium text-slate-900 mb-3">Você acompanha pela plataforma</h4>
                                    <p className="text-slate-600 font-light leading-relaxed">Acessa carteiras, planejamento, conteúdo, comunidade e apoio da equipe para seguir sua estratégia com mais consistência.</p>
                                </div>
                            </div>
                            <div className="mt-12 text-center">
                                <Link href="/questionnaire">
                                    <Button size="lg" className="rounded-full bg-slate-900 hover:bg-blue-600 text-white px-8 h-12 text-lg">
                                        Responder questionário
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* 5) O que o assinante acessa */}
                        <div className="pt-24 border-t border-slate-100 mb-20">
                            <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 items-center">
                                <div>
                                    <h2 className="text-4xl font-light text-slate-900 mb-6 tracking-tight leading-[1.15]">Uma assinatura para organizar sua vida financeira de forma contínua</h2>
                                    <p className="text-xl text-slate-600 font-light leading-relaxed mb-6">
                                        Na ARVO, você paga um valor fixo mensal para acessar uma estrutura completa de orientação financeira independente.
                                    </p>
                                    <p className="text-lg text-slate-800 font-medium leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                        A ideia é simples: você continua focado no seu trabalho e nos seus projetos, enquanto sua vida financeira passa a seguir um mapa claro.
                                    </p>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                                        <div className="bg-white p-2 text-blue-600 rounded-lg shadow-sm"><PieChart className="w-5 h-5" /></div>
                                        <span className="font-medium text-slate-700">Carteiras recomendadas</span>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                                        <div className="bg-white p-2 text-blue-600 rounded-lg shadow-sm"><LucideLineChart className="w-5 h-5" /></div>
                                        <span className="font-medium text-slate-700">Planejamento financeiro</span>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                                        <div className="bg-white p-2 text-blue-600 rounded-lg shadow-sm"><LayoutDashboard className="w-5 h-5" /></div>
                                        <span className="font-medium text-slate-700">Ferramentas de decisão</span>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                                        <div className="bg-white p-2 text-blue-600 rounded-lg shadow-sm"><BookOpen className="w-5 h-5" /></div>
                                        <span className="font-medium text-slate-700">Conteúdo educacional</span>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                                        <div className="bg-white p-2 text-blue-600 rounded-lg shadow-sm"><Users className="w-5 h-5" /></div>
                                        <span className="font-medium text-slate-700">Comunidade e lives</span>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                                        <div className="bg-white p-2 text-blue-600 rounded-lg shadow-sm"><MessageSquare className="w-5 h-5" /></div>
                                        <span className="font-medium text-slate-700">Apoio da equipe ARVO</span>
                                    </div>
                                    <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex items-center gap-4 sm:col-span-2 hover:shadow-md transition-shadow">
                                        <div className="bg-white p-2 text-emerald-600 rounded-lg shadow-sm"><Calendar className="w-5 h-5" /></div>
                                        <span className="font-medium text-emerald-800">Reuniões agendadas quando necessário</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 8) Planejamento / simulador */}
                        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16 items-center pt-24 border-t border-slate-100">
                            <div className="relative bg-slate-50 p-8 rounded-[3rem] border border-slate-100 flex justify-center h-[500px] overflow-hidden">
                                {/* UI Mockup Chart Tool */}
                                <div className="w-full max-w-[360px] bg-slate-900 text-white rounded-2xl shadow-2xl p-6 mt-6 flex flex-col justify-between">
                                    <div className="flex justify-between items-end mb-8">
                                        <div>
                                            <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Patrimônio Alvo Projetado</div>
                                            <div className="text-3xl font-light text-emerald-400">R$ 2.450.300</div>
                                        </div>
                                    </div>
                                    <div className="flex items-end gap-2 h-40 pb-4 border-b border-emerald-900/50">
                                        {[20, 30, 45, 60, 80, 100, 120, 150].map((h, i) => (
                                            <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-emerald-600 to-emerald-400 opacity-80" style={{ height: `${h}%` }}></div>
                                        ))}
                                    </div>
                                    <div className="pt-6 space-y-4">
                                        <div className="flex justify-between text-sm"><span className="text-slate-400">Tempo de Contribuição</span><span className="font-semibold text-emerald-100">20 Anos</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-slate-400">Renda Futura</span><span className="font-semibold text-emerald-400">R$ 10.200</span></div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6 lg:pr-10">
                                <h3 className="text-4xl md:text-5xl font-light text-slate-900 leading-[1.15] tracking-tight">Veja com mais clareza o caminho entre onde você está e onde quer chegar.</h3>
                                <p className="text-xl text-slate-600 font-light leading-relaxed">
                                    A ARVO ajuda você a transformar metas de vida em números mais realistas: patrimônio alvo, aportes, prazo e renda futura.
                                </p>
                                <p className="text-xl text-slate-600 font-light leading-relaxed">
                                    Assim, o planejamento deixa de ser abstrato e vira um guia prático para suas decisões.
                                </p>
                                <div className="pt-6">
                                    <Link href="/planejamento">
                                        <Button variant="outline" size="lg" className="rounded-full border-slate-300 hover:bg-slate-50 text-slate-900 px-8 h-12 text-lg">
                                            Testar simulador
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* 6) Autoridade do Fundador */}
                <section className="py-24 bg-white border-t border-slate-100">
                    <div className="container mx-auto max-w-6xl px-6">
                        <div className="grid md:grid-cols-[1fr_2fr] gap-12 lg:gap-20 items-center">
                            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-xl max-w-[350px] mx-auto md:mx-0 bg-slate-200">
                                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop" alt="Lucas Matos - Founder ARVO" className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-700" />
                            </div>
                            <div className="space-y-6">
                                <h2 className="text-4xl md:text-5xl font-light text-slate-900 tracking-tight leading-[1.15]">Quem está por trás da ARVO</h2>
                                <div className="space-y-4 text-xl text-slate-600 font-light leading-relaxed">
                                    <p>
                                        A ARVO foi fundada por Lu Slater, profissional com formação em engenharia, experiência em estratégia e atuação no mercado financeiro desde 2018.
                                    </p>
                                    <p>
                                        Depois de anos acompanhando de perto a lógica de distribuição de produtos no setor, Lu decidiu construir uma alternativa mais alinhada ao cliente: uma plataforma independente, baseada em planejamento financeiro, alocação racional e transparência total sobre incentivos.
                                    </p>
                                    <p>
                                        Com experiência na XP Investimentos e certificações Ancord, CPA-20 e CFP®, sua proposta com a ARVO é simples: <strong className="font-semibold text-slate-800">transformar o excesso de ruído do mercado em decisões mais claras, coerentes e sustentáveis ao longo do tempo.</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 7) Diferencial / Value Props / Comparison */}
                <section className="py-24 bg-slate-900 text-white border-b border-slate-800">
                    <div className="container mx-auto max-w-7xl px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-light mb-4 tracking-tight leading-[1.15]">Uma lógica diferente da indústria tradicional</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            <div className="bg-slate-800 rounded-3xl p-10 border border-slate-700 hover:border-blue-500/50 transition-colors">
                                <h3 className="text-3xl font-light mb-8 text-blue-400">ARVO</h3>
                                <ul className="space-y-6 font-light text-lg">
                                    <li className="flex items-start gap-4"><div className="mt-1 bg-blue-500/20 text-blue-400 p-1.5 rounded-full"><ShieldCheck className="w-5 h-5" /></div> Assinatura fixa, sem comissão por produto</li>
                                    <li className="flex items-start gap-4"><div className="mt-1 bg-blue-500/20 text-blue-400 p-1.5 rounded-full"><ShieldCheck className="w-5 h-5" /></div> Planejamento como base da estratégia</li>
                                    <li className="flex items-start gap-4"><div className="mt-1 bg-blue-500/20 text-blue-400 p-1.5 rounded-full"><ShieldCheck className="w-5 h-5" /></div> Alocação orientada por método</li>
                                    <li className="flex items-start gap-4"><div className="mt-1 bg-blue-500/20 text-blue-400 p-1.5 rounded-full"><ShieldCheck className="w-5 h-5" /></div> Foco em alinhamento de interesse</li>
                                </ul>
                            </div>
                            <div className="bg-slate-950/50 rounded-3xl p-10 border border-slate-800">
                                <h3 className="text-3xl font-light mb-8 text-slate-400">Mercado tradicional</h3>
                                <ul className="space-y-6 text-slate-400 font-light text-lg">
                                    <li className="flex items-start gap-4"><div className="mt-1 bg-slate-800 text-slate-500 p-1.5 rounded-full"><div className="w-5 h-5 flex items-center justify-center font-bold text-sm">✕</div></div> Remuneração frequentemente ligada à distribuição de produtos</li>
                                    <li className="flex items-start gap-4"><div className="mt-1 bg-slate-800 text-slate-500 p-1.5 rounded-full"><div className="w-5 h-5 flex items-center justify-center font-bold text-sm">✕</div></div> Maior incentivo comercial na recomendação</li>
                                    <li className="flex items-start gap-4"><div className="mt-1 bg-slate-800 text-slate-500 p-1.5 rounded-full"><div className="w-5 h-5 flex items-center justify-center font-bold text-sm">✕</div></div> Menos clareza sobre o racional da carteira</li>
                                    <li className="flex items-start gap-4"><div className="mt-1 bg-slate-800 text-slate-500 p-1.5 rounded-full"><div className="w-5 h-5 flex items-center justify-center font-bold text-sm">✕</div></div> Estrutura nem sempre centrada no cliente</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-20 text-center">
                            <p className="text-xl font-light text-slate-300 max-w-2xl mx-auto leading-relaxed px-8 py-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                                Na ARVO, o modelo de negócio foi desenhado para colocar o cliente no centro da decisão.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 9) FAQ */}
                <section className="py-24 bg-slate-50">
                    <div className="container mx-auto max-w-5xl px-6">
                        <div className="grid md:grid-cols-[1fr_2fr] gap-12 items-start">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-light text-slate-900 leading-[1.15] tracking-tight">O que você precisa saber antes de começar</h2>
                                <p className="mt-6 text-slate-600 font-light text-xl leading-relaxed">
                                    Entenda como a ARVO funciona, como cobramos e como estruturamos as carteiras.
                                </p>
                            </div>
                            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger className="text-left text-lg font-medium text-slate-800 py-5">O que significa ser fee-only?</AccordionTrigger>
                                        <AccordionContent className="text-slate-600 font-light text-base leading-relaxed pb-6">
                                            Significa que somos remunerados exclusivamente por você, através de uma assinatura, nunca através de comissões de produtos financeiros (rebates). Isso elimina incentivos conflitantes que afligem o modelo tradicional bancário.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2">
                                        <AccordionTrigger className="text-left text-lg font-medium text-slate-800 py-5">Quanto custa usar a ARVO?</AccordionTrigger>
                                        <AccordionContent className="text-slate-600 font-light text-base leading-relaxed pb-6">
                                            A plataforma ARVO possui um modelo freemium. Você pode simular a carteira e planejar a independência de graça. Para visualizar fundos específicos detalhados ou consultar a alocação de carteiras especiais como RITMO, VANGUARDA e OCEANO, oferecemos a assinatura Premium, justa, com base no volume de recursos administrados.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-3">
                                        <AccordionTrigger className="text-left text-lg font-medium text-slate-800 py-5">Posso manter os ativos que já tenho?</AccordionTrigger>
                                        <AccordionContent className="text-slate-600 font-light text-base leading-relaxed pb-6">
                                            Absolutamente. A ferramenta <strong>Adaptar Carteira</strong> ajuda você a cadastrar seus ativos atuais e entender a aderência deles comparada às recomendações sugeridas de carteira modelo, assim você faz as pontes e transições sem ter que liquidar tudo em impostos agora.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-4">
                                        <AccordionTrigger className="text-left text-lg font-medium text-slate-800 py-5">Como as carteiras são montadas?</AccordionTrigger>
                                        <AccordionContent className="text-slate-600 font-light text-base leading-relaxed pb-6">
                                            Utilizamos a diversificação passiva, embasada na teoria moderna de Portfólios, distribuindo capital entre fundos passivos globais, ETFs e Rendas Fixas IPCA+, tudo em alocações baseadas em um backtest de performance de mercado seguro de longo percurso, para capturar o rendimento do mercado sem risco ativo.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-5" className="border-b-0">
                                        <AccordionTrigger className="text-left text-lg font-medium text-slate-800 py-5">A ARVO é para quem está começando ou para quem já investe?</AccordionTrigger>
                                        <AccordionContent className="text-slate-600 font-light text-base leading-relaxed pb-6">
                                            Para os dois. Se você está começando, a ARVO ajuda a construir sua fundação de forma correta (sem falsas promessas de ganhos rápidos). Se você já investe e tem um portfólio robusto, a plataforma organiza sua estratégia para que você tenha visibilidade completa da eficiência dos seus aportes para a aposentadoria.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 10) Final CTA Full width */}
                <section className="bg-[#0A192F] border-y border-slate-800 py-32 text-center text-white px-6">
                    <div className="container mx-auto max-w-4xl">
                        <h2 className="text-5xl md:text-7xl font-light mb-8 tracking-tight leading-[1.1]">Menos ruído. <span className="font-semibold italic text-blue-100">Mais direção.</span></h2>
                        <p className="text-xl md:text-2xl font-light text-blue-100 mb-12 leading-relaxed max-w-3xl mx-auto">
                            Você não precisa acompanhar o mercado o dia inteiro para investir melhor. Precisa de uma estratégia clara, uma estrutura coerente e um modelo que trabalhe a seu favor ao longo do tempo.
                        </p>
                        <Link href="/register">
                            <Button size="lg" className="rounded-full bg-slate-900 text-white hover:bg-slate-800 font-bold px-12 h-16 text-xl shadow-2xl hover:scale-105 transition-transform duration-300">
                                Entrar para a ARVO
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-slate-950 text-slate-400 py-16">
                <div className="container mx-auto max-w-7xl px-6">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
                        <div className="col-span-2 md:col-span-1">
                            <Image src="/arvo-logo-transparent.png" alt="ARVO" width={80} height={40} className="mb-6 opacity-50" />
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
