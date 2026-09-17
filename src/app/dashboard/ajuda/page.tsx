"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { 
    HelpCircle, Search, MessageSquare, Calendar, Mail, 
    ChevronDown, ShieldCheck, Compass, Scale, Lock, 
    BookOpen, ExternalLink, ArrowRight, Sparkles 
} from "lucide-react"

interface FAQItem {
    id: string
    category: "Metodologia & Fee-Only" | "Bússola & Carteiras" | "Tributação & Previdência" | "Segurança & Conta"
    question: string
    answer: string
}

const FAQS: FAQItem[] = [
    {
        id: "fee-only-1",
        category: "Metodologia & Fee-Only",
        question: "O que é o modelo Fee-Only e por que a ARVO não recebe comissões?",
        answer: "No modelo Fee-Only (remuneração direta e transparente), nós não recebemos nenhum rebate, corretagem ou comissão sobre os produtos financeiros recomendados. Isso elimina 100% dos conflitos de interesse habituais do mercado financeiro tradicional, garantindo que toda recomendação seja formulada exclusivamente no melhor interesse do cliente."
    },
    {
        id: "fee-only-2",
        category: "Metodologia & Fee-Only",
        question: "Qual a diferença entre a consultoria ARVO e uma assessoria de investimentos de corretora?",
        answer: "Assessorias tradicionais ganham comissões por produtos vendidos (spreads, taxas de carregamento, rebates de fundos). Na ARVO, atuamos com planejamento financeiro patrimonial independente, suitability fiduciário e alocação de carteiras sem vínculos com produtos embutidos."
    },
    {
        id: "bussola-1",
        category: "Bússola & Carteiras",
        question: "Como a Bússola calcula as proporções entre Abrigo, Ritmo, Visão e Oceano?",
        answer: "A Bússola utiliza as respostas do seu diagnóstico de 7 Marcos (em especial o Marco 7 de Suitability) para mensurar 4 dimensões técnicas: tolerância emocional a oscilações, capacidade de absorver perdas de curto prazo, horizonte de tempo dos objetivos e necessidade de liquidez. A partir desses vetores, os pesos de cada classe de ativo são calibrados dinamicamente."
    },
    {
        id: "bussola-2",
        category: "Bússola & Carteiras",
        question: "Quando e como devo rebalancear minha carteira?",
        answer: "Recomendamos rebalanceamentos periódicos a cada 6 meses ou sempre que o desvio de uma classe de ativos superar 5% em relação à meta estipulada na Bússola. O rebalanceamento prioritário deve ser feito através dos novos aportes mensais, direcionando os novos recursos para as classes que ficaram abaixo do percentual alvo."
    },
    {
        id: "tributario-1",
        category: "Tributação & Previdência",
        question: "Quando vale a pena optar por PGBL em vez de VGBL?",
        answer: "O PGBL é indicado para quem faz a Declaração Completa do IRPF e contribui para a previdência oficial (INSS ou RPPS). Ele permite deduzir até 12% da sua renda tributável anual da base de cálculo do IRPF, gerando uma restituição maior no ano seguinte. O VGBL é indicado para quem faz a declaração simplificada ou já atingiu o teto de 12% em PGBL."
    },
    {
        id: "tributario-2",
        category: "Tributação & Previdência",
        question: "Como funciona a tabela regressiva de Imposto de Renda?",
        answer: "A tabela regressiva premia investimentos de longo prazo: a alíquota de IR começa em 35% nos primeiros 2 anos e diminui 5 pontos percentuais a cada 2 anos, atingindo a alíquota mínima de 10% para recursos mantidos por mais de 10 anos."
    },
    {
        id: "seguranca-1",
        category: "Segurança & Conta",
        question: "Onde meus investimentos e meu patrimônio ficam custodiados?",
        answer: "A ARVO não realiza custódia direta de recursos financeiros. Seus ativos permanecem registrados em seu nome e CPF nas corretoras e instituições financeiras de sua preferência (ex: XP, BTG, Itaú, Avenue, etc.). Nós orientamos as decisões estratégicas e o planejamento técnico."
    },
    {
        id: "seguranca-2",
        category: "Segurança & Conta",
        question: "Como a ARVO protege a privacidade e sigilo dos meus dados?",
        answer: "Todos os dados financeiros preenchidos na Jornada são criptografados e armazenados com rigorosos padrões de segurança e conformidade com a LGPD. Nenhuma informação pessoal ou patrimonial é compartilhada com terceiros ou utilizada para envio de propagandas comerciais."
    }
]

export default function AjudaPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [openFaq, setOpenFaq] = useState<string | null>("fee-only-1")
    const [selectedCategory, setSelectedCategory] = useState<string>("Todos")

    const categories = ["Todos", "Metodologia & Fee-Only", "Bússola & Carteiras", "Tributação & Previdência", "Segurança & Conta"]

    const filteredFaqs = useMemo(() => {
        return FAQS.filter(faq => {
            const matchesCat = selectedCategory === "Todos" || faq.category === selectedCategory
            const q = searchQuery.toLowerCase().trim()
            const matchesSearch = !q || faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q)
            return matchesCat && matchesSearch
        })
    }, [searchQuery, selectedCategory])

    return (
        <div className="min-h-[calc(100vh-62px)] font-sans p-4 sm:p-6 md:p-8 animate-in fade-in duration-300">
            <div className="max-w-5xl mx-auto space-y-8">
                
                {/* ─── HEADER ──────────────────────────────────────────────────────── */}
                <header className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dash-accent-light text-dash-accent text-xs font-bold tracking-widest uppercase border border-dash-border">
                        <HelpCircle className="w-3.5 h-3.5" />
                        Central de Orientação ARVO
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-dash-text">
                        Como podemos <span className="font-semibold text-dash-text">ajudar você?</span>
                    </h1>
                    <p className="text-dash-text-light text-sm sm:text-base max-w-2xl leading-relaxed">
                        Tire dúvidas sobre a metodologia independente fee-only, calibração da Bússola, regras fiscais ou fale diretamente com nossos planejadores CFP®.
                    </p>
                </header>

                {/* ─── SEARCH INPUT ─────────────────────────────────────────────────── */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dash-text-light" />
                    <input 
                        type="text" 
                        placeholder="Buscar dúvidas por palavra-chave (ex: Fee-Only, PGBL, Bússola, Rebalanceamento)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-dash-border shadow-xs text-sm text-dash-text placeholder:text-dash-text-light/60 outline-none focus:border-dash-accent transition-colors"
                    />
                </div>

                {/* ─── CANAIS DE CONTATO RÁPIDOS ────────────────────────────────────── */}
                <div className="grid sm:grid-cols-3 gap-4">
                    <Link
                        href="/dashboard/agendamento"
                        className="bg-white border border-dash-border rounded-2xl p-5 hover:border-dash-accent hover:shadow-sm transition-all group flex flex-col justify-between"
                    >
                        <div className="space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-dash-accent-light text-dash-accent flex items-center justify-center">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-dash-text group-hover:text-dash-accent transition-colors">
                                    Agendar Reunião 1:1
                                </h2>
                                <p className="text-xs text-dash-text-light mt-1">
                                    Converse com a equipe de planejadores financeiros CFP®.
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-dash-border/60 flex items-center justify-between text-xs font-semibold text-dash-accent">
                            <span>Marcar horário</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>

                    <a
                        href="https://wa.me/5511999999999?text=Olá,%20gostaria%20de%20tirar%20uma%20dúvida%20sobre%20a%20ARVO"
                        target="_blank"
                        rel="noreferrer"
                        className="bg-white border border-dash-border rounded-2xl p-5 hover:border-dash-accent hover:shadow-sm transition-all group flex flex-col justify-between"
                    >
                        <div className="space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-dash-text group-hover:text-emerald-700 transition-colors">
                                    WhatsApp Direto
                                </h2>
                                <p className="text-xs text-dash-text-light mt-1">
                                    Canal ágil para suporte e dúvidas operacionais da plataforma.
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-dash-border/60 flex items-center justify-between text-xs font-semibold text-emerald-700">
                            <span>Iniciar conversa</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </div>
                    </a>

                    <a
                        href="mailto:contato@meuarvo.com.br?subject=Dúvida%20ARVO%20Dashboard"
                        className="bg-white border border-dash-border rounded-2xl p-5 hover:border-dash-accent hover:shadow-sm transition-all group flex flex-col justify-between"
                    >
                        <div className="space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-dash-surface-active text-dash-text flex items-center justify-center">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-dash-text group-hover:text-dash-accent transition-colors">
                                    E-mail de Atendimento
                                </h2>
                                <p className="text-xs text-dash-text-light mt-1">
                                    contato@meuarvo.com.br — resposta em até 1 dia útil.
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-dash-border/60 flex items-center justify-between text-xs font-semibold text-dash-text">
                            <span>Enviar e-mail</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </a>
                </div>

                {/* ─── FAQ CATEGORY PILLS ─────────────────────────────────────────── */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-dash-text">
                            Perguntas Frequentes (FAQ)
                        </h2>
                        <span className="text-xs text-dash-text-light">
                            {filteredFaqs.length} {filteredFaqs.length === 1 ? "artigo" : "artigos"}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                                    selectedCategory === cat
                                        ? "bg-dash-text text-white shadow-xs"
                                        : "bg-white border border-dash-border text-dash-text-muted hover:bg-dash-surface-active hover:text-dash-text"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* ─── FAQ ACCORDION LIST ────────────────────────────────────────── */}
                    <div className="space-y-2.5">
                        {filteredFaqs.map(faq => {
                            const isOpen = openFaq === faq.id
                            return (
                                <div 
                                    key={faq.id}
                                    className="bg-white border border-dash-border rounded-2xl overflow-hidden transition-all shadow-xs"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                                        className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-dash-surface-active/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-dash-accent px-2 py-0.5 rounded-md bg-dash-accent-light shrink-0">
                                                {faq.category}
                                            </span>
                                            <span className="text-sm font-bold text-dash-text">
                                                {faq.question}
                                            </span>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 text-dash-text-light shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-dash-text" : ""}`} />
                                    </button>

                                    {isOpen && (
                                        <div className="px-5 pb-5 pt-1 text-sm text-dash-text-muted leading-relaxed border-t border-dash-border/60 animate-in fade-in duration-150">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            )
                        })}

                        {filteredFaqs.length === 0 && (
                            <div className="bg-white border border-dash-border rounded-2xl p-8 text-center space-y-2">
                                <p className="text-sm font-semibold text-dash-text">Nenhum resultado encontrado.</p>
                                <p className="text-xs text-dash-text-light">Tente buscar por termos diferentes ou selecione outra categoria.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}
