import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Award, LineChart, Users } from "lucide-react"
import { AnimatedHero } from "@/components/ui/animated-hero"
import { PricingCards } from "@/components/ui/pricing-cards"

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col bg-white  text-gray-900 ">
            {/* Header */}
            <header className="fixed top-0 w-full bg-white/80 /80 backdrop-blur-sm z-50 border-b border-gray-200/50 /10">
                <div className="container mx-auto flex h-16 items-center justify-between px-6">
                    <Link href="/" className="flex items-center">
                        <Image src="/arvo-logo.png" alt="ARVO" width={80} height={40} className="" />
                    </Link>
                    <Link href="/login">
                        <Button variant="ghost" size="sm" className="font-light">
                            Entrar
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 pt-16">
                <AnimatedHero />

                {/* Market Context */}
                <section className="bg-gradient-to-br from-gray-50 to-white   py-24 border-y border-gray-200 ">
                    <div className="container mx-auto px-6">
                        <div className="max-w-4xl mx-auto space-y-16">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-extralight mb-8 text-center">
                                    O Problema do Mercado Brasileiro
                                </h2>

                                <div className="prose prose-lg max-w-none text-gray-700  font-light leading-relaxed space-y-6">
                                    <p>
                                        A realidade dos investimentos no Brasil ainda é marcada por <strong>distorções</strong>.
                                        Grandes bancos e corretoras continuam orientando clientes com base em comissões, não em necessidades.
                                    </p>

                                    <p>
                                        O setor está se consolidando rapidamente: no primeiro semestre de 2025 houve, em média,
                                        <strong> dois processos de fusão ou aquisição por mês</strong>, e consultorias estimam quase 30 mandatos
                                        de M&A em andamento que podem concentrar até <strong>R$ 75 bilhões de patrimônio</strong>.
                                        Players com caixa compram escritórios menores para ganhar escala, enquanto plataformas
                                        independentes perdem espaço ou são engolidas.
                                    </p>

                                    <p>
                                        A regulamentação também apertou: a <strong>CVM 179</strong> passou a exigir que toda remuneração
                                        de assessores seja divulgada em relatórios trimestrais, tornando a transparência obrigação
                                        e não mais opcional.
                                    </p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8 text-center">
                                <Stat number="37%" label="da população investe" />
                                <Stat number="32M" label="brasileiros que economizam não investem" />
                                <Stat number="82%" label="não formam reserva para aposentadoria" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Solution */}
                <section className="py-24">
                    <div className="container mx-auto px-6">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-4xl md:text-5xl font-extralight mb-12 text-center">
                                A Solução ARVO
                            </h2>

                            <div className="prose prose-lg max-w-none text-gray-700  font-light leading-relaxed space-y-6 mb-16">
                                <p className="text-xl">
                                    É aqui que a ARVO entra. Somos uma <strong>plataforma de investimentos independente e transparente</strong>,
                                    sem rebates, sem conflitos.
                                </p>

                                <p>
                                    Em vez de ganhar comissões escondidas (que podem chegar a <strong>50% das receitas dos produtos</strong> na
                                    média do mercado), <strong>cobramos assinatura fixa</strong>. Por um valor acessível, você tem acesso completo
                                    ao que há de melhor em assessoria de investimentos.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <FeatureCard
                                    icon={<LineChart />}
                                    title="Carteiras Inteligentes"
                                    description="Recomendações de acordo com seu perfil, atualizadas com IA e análise humana."
                                />
                                <FeatureCard
                                    icon={<Award />}
                                    title="Relatórios Completos"
                                    description="Comparação detalhada entre fundos e gestores para decisões informadas."
                                />
                                <FeatureCard
                                    icon={<Users />}
                                    title="Planejamento Personalizado"
                                    description="Acompanhamento com Certified Financial Planners (CFP®)."
                                />
                                <FeatureCard
                                    icon={<Shield />}
                                    title="Eficiência Tributária"
                                    description="Menos giro de carteira, maximizando seu retorno líquido."
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Value Proposition */}
                <section className="bg-gray-50 text-gray-900 py-24">
                    <div className="container mx-auto px-6">
                        <div className="max-w-4xl mx-auto text-center space-y-8">
                            <h2 className="text-4xl md:text-5xl font-extralight">
                                Modelo Fee-Only
                            </h2>

                            <p className="text-xl font-light leading-relaxed">
                                A proposta é simples: você investe melhor porque toma decisões com <strong>total clareza
                                    de custos e incentivos</strong>. Nosso modelo "fee-only" segue o que há de mais moderno em
                                mercados maduros, em linha com a exigência de transparência da CVM.
                            </p>

                            <p className="text-2xl font-light italic">
                                "O Nubank dos investimentos"
                            </p>

                            <p className="text-lg font-light">
                                Queremos dar poder ao cliente, cobrar um preço justo e colocar o interesse do investidor
                                em primeiro lugar.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <PricingCards
                    tiers={[
                        {
                            name: "ESSENCIAL",
                            price: 49,
                            interval: "/mês",
                            description: "Para quem está começando a construir patrimônio.",
                            features: [
                                { name: "Carteira Recomendada Automatizada", included: true },
                                { name: "Rebalanceamento Inteligente", included: true },
                                { name: "Relatórios Mensais de Performance", included: true },
                                { name: "Suporte via Chat", included: true },
                                { name: "Planejamento Financeiro Personalizado", included: false },
                                { name: "Acesso a Fundos Exclusivos", included: false },
                            ],
                            cta: {
                                text: "Começar Agora",
                                href: "/register",
                            }
                        },
                        {
                            name: "WEALTH",
                            price: 199,
                            interval: "/mês",
                            description: "Gestão completa para patrimônios consolidados.",
                            highlight: true,
                            features: [
                                { name: "Carteira Recomendada Automatizada", included: true },
                                { name: "Rebalanceamento Inteligente", included: true },
                                { name: "Relatórios Mensais Detalhados", included: true },
                                { name: "Suporte Prioritário com Especialista", included: true, highlight: true },
                                { name: "Planejamento Financeiro Personalizado (CFP®)", included: true },
                                { name: "Acesso a Fundos Exclusivos e Globais", included: true },
                            ],
                            cta: {
                                text: "Falar com Consultor",
                                href: "/register", // Could be a contact form link
                            }
                        },
                    ]}
                    className="gap-8"
                    containerClassName="py-12"
                />

                {/* Portfolio Options */}
                <section className="py-24">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-extralight mb-4">Escolha Sua Carteira</h2>
                            <p className="text-gray-600  text-lg font-light max-w-2xl mx-auto">
                                Quatro estratégias personalizadas para diferentes perfis e objetivos.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
                            <PortfolioCard name="Abrigo" subtitle="Proteção" icon="🏠" color="abrigo" />
                            <PortfolioCard name="Ritmo" subtitle="Equilíbrio" icon="🌱" color="ritmo" />
                            <PortfolioCard name="Vanguarda" subtitle="Crescimento" icon="🚀" color="vanguarda" />
                            <PortfolioCard name="Oceano" subtitle="Global" icon="🌊" color="oceano" />
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-32 bg-gradient-to-br from-vanguarda-primary/10 to-oceano-primary/10 /5 /5">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-5xl font-extralight mb-6">
                            Comece Hoje
                        </h2>
                        <p className="text-xl text-gray-600  mb-12 max-w-2xl mx-auto font-light">
                            Se você está cansado de pagar por produtos que não fazem sentido,
                            ou quer finalmente planejar a aposentadoria com quem entende do assunto, a ARVO é a solução.
                        </p>
                        <Link href="/register">
                            <Button
                                size="lg"
                                className="bg-gray-100 text-gray-900 hover:bg-gray-900 hover:text-white rounded-full px-12 h-16 text-xl font-light"
                            >
                                Criar Conta Grátis
                                <ArrowRight className="ml-3 h-6 w-6" />
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 /10 py-12">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-gray-500 text-sm font-light">
                        © 2024 ARVO. Investimentos transparentes, sem conflitos.
                    </p>
                </div>
            </footer>
        </div>
    )
}

function Stat({ number, label }: { number: string, label: string }) {
    return (
        <div>
            <div className="text-4xl md:text-5xl font-extralight mb-2 bg-gradient-to-r from-vanguarda-accent to-oceano-accent bg-clip-text text-transparent">
                {number}
            </div>
            <div className="text-sm text-gray-600  font-light">
                {label}
            </div>
        </div>
    )
}

function FeatureCard({ icon, title, description }: {
    icon: React.ReactNode
    title: string
    description: string
}) {
    return (
        <div className="p-6 bg-white  rounded-lg border border-gray-200  hover:border-gray-400 :border-gray-600 transition-all">
            <div className="w-12 h-12 mb-4 text-gray-900 ">
                {icon}
            </div>
            <h3 className="text-xl font-light mb-2">{title}</h3>
            <p className="text-gray-600  text-sm font-light leading-relaxed">
                {description}
            </p>
        </div>
    )
}

function PortfolioCard({ name, subtitle, icon, color }: {
    name: string
    subtitle: string
    icon: string
    color: string
}) {
    const colorClasses = {
        abrigo: "from-[#C9B8A3] to-[#8B7355]",
        ritmo: "from-[#A8C5A1] to-[#5D8C54]",
        vanguarda: "from-[#A3BFD9] to-[#5687AF]",
        oceano: "from-[#89C4D4] to-[#3D96AB]",
    }

    return (
        <div className="group text-center p-8 bg-white  rounded-lg border border-gray-200  hover:shadow-lg transition-all">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center text-3xl`}>
                {icon}
            </div>
            <h3 className="text-2xl font-light mb-1">{name}</h3>
            <p className="text-sm text-gray-500  font-light">{subtitle}</p>
        </div>
    )
}
