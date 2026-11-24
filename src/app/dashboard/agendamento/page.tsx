"use client"

import { useState, useEffect } from "react"
import { CalendarDays, Clock, Video, Mail, ExternalLink, ShieldCheck, CheckCircle2, Settings, Link as LinkIcon, Send, Sparkles } from "lucide-react"

export default function DashboardAgendamentoPage() {
    const [bookingUrl, setBookingUrl] = useState<string>("")
    const [inputUrl, setInputUrl] = useState<string>("")
    const [showConfig, setShowConfig] = useState<boolean>(false)
    const [requestSent, setRequestSent] = useState<boolean>(false)
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        data: "",
        turno: "tarde",
        assunto: "Revisão dos 7 Marcos e Diagnóstico Patrimonial",
        mensagem: ""
    })

    useEffect(() => {
        const envUrl = process.env.NEXT_PUBLIC_CALENDAR_BOOKING_URL || ""
        const savedUrl = typeof window !== "undefined" ? localStorage.getItem("arvo_calendar_booking_url") || "" : ""
        const activeUrl = savedUrl || envUrl
        setBookingUrl(activeUrl)
        setInputUrl(activeUrl)
    }, [])

    const handleSaveUrl = (e: React.FormEvent) => {
        e.preventDefault()
        const clean = inputUrl.trim()
        setBookingUrl(clean)
        if (typeof window !== "undefined") {
            if (clean) {
                localStorage.setItem("arvo_calendar_booking_url", clean)
            } else {
                localStorage.removeItem("arvo_calendar_booking_url")
            }
        }
        setShowConfig(false)
    }

    const handleSendRequest = (e: React.FormEvent) => {
        e.preventDefault()
        const subject = encodeURIComponent(`Solicitação de Reunião ARVO - ${formData.nome || "Cliente"}`)
        const body = encodeURIComponent(
            `Olá equipe ARVO,\n\nGostaria de solicitar o agendamento de uma reunião de planejamento financeiro.\n\n` +
            `• Nome: ${formData.nome}\n` +
            `• E-mail: ${formData.email}\n` +
            `• Data sugerida: ${formData.data || "A definir"}\n` +
            `• Turno de preferência: ${formData.turno === "manha" ? "Manhã (09h às 12h)" : "Tarde (14h às 18h)"}\n` +
            `• Pauta: ${formData.assunto}\n` +
            (formData.mensagem ? `• Observações: ${formData.mensagem}\n\n` : "\n") +
            `Aguardo a confirmação do horário disponível na agenda do planejador.\n`
        )
        window.location.href = `mailto:contato@meuarvo.com.br?subject=${subject}&body=${body}`
        setRequestSent(true)
    }

    const mailtoDirect = "mailto:contato@meuarvo.com.br?subject=Agendamento%20de%20Reuni%C3%A3o%20-%20ARVO&body=Ol%C3%A1%20equipe%20ARVO%2C%0A%0AGostaria%20de%20agendar%20uma%20reuni%C3%A3o%20para%20revisar%20meu%20planejamento%20financeiro.%0A%0AMelhores%20dias%20e%20hor%C3%A1rios%20para%20mim%3A%0A-%0A%0AObrigado!"

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                    <div className="text-2xl sm:text-3xl font-bold text-dash-text tracking-tight">Agendamento de Reunião</div>
                    <div className="text-sm text-dash-text-muted">
                        Marque uma sessão individual com seu planejador CFP® para calibrar sua carteira e os 7 marcos da sua jornada.
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setShowConfig(!showConfig)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dash-border bg-dash-surface hover:bg-dash-surface-active text-dash-text-muted hover:text-dash-text text-xs font-semibold transition-colors self-start sm:self-auto cursor-pointer"
                    title="Configurar link da Página de Agendamento (Google Appointment Schedule ou Calendly)"
                >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Configurar Link da Agenda</span>
                </button>
            </div>

            {/* Modal / Painel de Configuração do Link de Agendamento */}
            {showConfig && (
                <div className="bg-white border border-[#2B6E76]/30 rounded-2xl p-5 shadow-md animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                            <h4 className="text-sm font-bold text-dash-text flex items-center gap-1.5">
                                <LinkIcon className="w-4 h-4 text-dash-accent" />
                                Vincular Página de Agendamento (Bloqueio Automático de Conflitos)
                            </h4>
                            <p className="text-xs text-dash-text-muted mt-1 leading-relaxed">
                                Cole o link da sua <strong>Página de Agendamento do Google Agenda</strong> (criada via <em>+ Criar → Agendamento de horários</em>) ou do <strong>Calendly / Cal.com</strong>. Esses sistemas verificam sua agenda pessoal em tempo real e <strong>bloqueiam automaticamente qualquer horário que já esteja ocupado</strong>.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowConfig(false)}
                            className="text-dash-text-muted hover:text-dash-text text-xs font-bold"
                        >
                            ✕
                        </button>
                    </div>

                    <form onSubmit={handleSaveUrl} className="flex flex-col sm:flex-row gap-2 mt-3">
                        <input
                            type="url"
                            value={inputUrl}
                            onChange={(e) => setInputUrl(e.target.value)}
                            placeholder="Ex: https://calendar.app.google/... ou https://calendly.com/seulink"
                            className="flex-1 bg-[#f6f4ef] rounded-xl px-4 py-2.5 text-xs text-[#123044] font-medium border border-[#e4e0d7] focus:outline-none focus:border-[#1f674f]"
                        />
                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-[#123044] hover:bg-[#1e4866] text-white text-xs font-bold rounded-xl transition-all shrink-0 cursor-pointer"
                        >
                            Salvar Link
                        </button>
                        {bookingUrl && (
                            <button
                                type="button"
                                onClick={() => {
                                    setInputUrl("")
                                    setBookingUrl("")
                                    if (typeof window !== "undefined") localStorage.removeItem("arvo_calendar_booking_url")
                                    setShowConfig(false)
                                }}
                                className="px-3 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl transition-all shrink-0 cursor-pointer"
                            >
                                Limpar
                            </button>
                        )}
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Advisor info card */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-dash-surface border border-dash-border rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                        <div>
                            <div className="flex items-center gap-3.5 mb-5 pb-5 border-b border-dash-border">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#123044] to-[#2B6E76] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                                    LM
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-dash-text">Lucas Matos, CFP®</h2>
                                    <p className="text-xs text-dash-accent font-medium">Planejador Patrimonial Exclusivo</p>
                                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-dash-text-muted">
                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>Orientação Fee-Only Independente</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-dash-accent mt-0.5 shrink-0" />
                                    <div>
                                        <div className="text-sm font-semibold text-dash-text">Duração da Sessão</div>
                                        <div className="text-xs text-dash-text-muted">45 a 60 minutos (com acompanhamento)</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Video className="w-5 h-5 text-dash-accent mt-0.5 shrink-0" />
                                    <div>
                                        <div className="text-sm font-semibold text-dash-text">Formato da Reunião</div>
                                        <div className="text-xs text-dash-text-muted">Videoconferência via Google Meet com link automático</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-dash-accent mt-0.5 shrink-0" />
                                    <div>
                                        <div className="text-sm font-semibold text-dash-text">Canal Institucional</div>
                                        <div className="text-xs text-dash-text-muted">
                                            Contato: <strong className="text-dash-text">contato@meuarvo.com.br</strong>
                                        </div>
                                        <div className="text-[11px] text-dash-text-light mt-0.5">
                                            Atendimento exclusivo para membros ARVO
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <CalendarDays className="w-5 h-5 text-dash-accent mt-0.5 shrink-0" />
                                    <div>
                                        <div className="text-sm font-semibold text-dash-text">Pauta Principal</div>
                                        <ul className="text-xs text-dash-text-muted space-y-1 mt-1">
                                            <li className="flex items-center gap-1.5">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-dash-accent" />
                                                <span>Revisão do diagnóstico dos 7 marcos</span>
                                            </li>
                                            <li className="flex items-center gap-1.5">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-dash-accent" />
                                                <span>Ajuste da alocação de ativos e Bússola</span>
                                            </li>
                                            <li className="flex items-center gap-1.5">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-dash-accent" />
                                                <span>Planejamento fiscal, sucessório e aposentadoria</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-5 border-t border-dash-border space-y-2.5">
                            {bookingUrl ? (
                                <a
                                    href={bookingUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-dash-accent text-white text-xs font-semibold rounded-xl hover:bg-dash-accent-mid transition-all shadow-sm"
                                >
                                    <CalendarDays className="w-4 h-4" />
                                    <span>Abrir Página de Agendamento</span>
                                    <ExternalLink className="w-3.5 h-3.5 opacity-70 ml-0.5" />
                                </a>
                            ) : null}

                            <a
                                href={mailtoDirect}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-dash-surface-active hover:bg-dash-border text-dash-text text-xs font-medium rounded-xl transition-colors border border-dash-border"
                            >
                                <Mail className="w-4 h-4 text-dash-text-muted" />
                                <span>Sugerir Horário por E-mail</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Calendar embed or Booking Area */}
                <div className="lg:col-span-8">
                    <div className="bg-dash-surface border border-dash-border rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col min-h-[640px]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-dash-border">
                            <div>
                                <h3 className="text-sm sm:text-base font-bold text-dash-text">
                                    {bookingUrl ? "Horários Disponíveis em Tempo Real" : "Escolha seu Horário de Reunião"}
                                </h3>
                                <p className="text-xs text-dash-text-muted">
                                    {bookingUrl 
                                        ? "Selecione o melhor dia e horário. Horários com compromissos existentes são bloqueados automaticamente."
                                        : "Indique sua preferência de dia e turno para receber o convite da reunião direto no seu e-mail."}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Agenda Aberta
                                </span>
                            </div>
                        </div>

                        {bookingUrl ? (
                            /* IFRAME COM PÁGINA DE AGENDAMENTO REAL (GOOGLE APPOINTMENT OU CALENDLY) */
                            <div className="flex-1 w-full rounded-xl overflow-hidden border border-dash-border bg-white relative min-h-[560px]">
                                <iframe
                                    src={bookingUrl}
                                    title="Página de Agendamento Oficial ARVO"
                                    className="w-full h-full min-h-[560px] border-0"
                                    loading="lazy"
                                />
                            </div>
                        ) : (
                            /* FORMULÁRIO DE SOLICITAÇÃO DIRETA COM INSTRUÇÕES DA PÁGINA DE AGENDAMENTO */
                            <div className="flex-1 flex flex-col justify-between space-y-6">
                                <div className="bg-[#faf9f5] border border-[#e4dfd5] rounded-2xl p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-[#1F674F]/10 text-[#1F674F] flex items-center justify-center shrink-0 mt-0.5">
                                            <Sparkles className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-[#123044] uppercase tracking-wider mb-1">
                                                Sincronização em Tempo Real com Bloqueio de Conflitos
                                            </h4>
                                            <p className="text-xs text-[#667085] leading-relaxed">
                                                Para que o sistema bloqueie automaticamente os horários onde você já tem compromissos na sua agenda, utilize o link do <strong>Agendamento de horários do Google Calendar</strong> (Página de Agendamento) ou do <strong>Calendly</strong>.
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => setShowConfig(true)}
                                                className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-[#1F674F] hover:underline cursor-pointer"
                                            >
                                                <span>Clique aqui para colar seu link de agendamento</span>
                                                <ExternalLink className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Formulário de solicitação de horário pelo cliente */}
                                <form onSubmit={handleSendRequest} className="bg-white border border-dash-border rounded-2xl p-5 space-y-4">
                                    <div className="flex items-center justify-between pb-3 border-b border-dash-border">
                                        <h4 className="text-xs font-bold text-dash-text uppercase tracking-wider">
                                            Solicitar Reunião com o Planejador
                                        </h4>
                                        <span className="text-[11px] text-dash-text-muted">Resposta em até 2 horas úteis</span>
                                    </div>

                                    {requestSent && (
                                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                            <span>Sua solicitação foi preparada e enviada para a equipe de planejamento!</span>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-dash-text block mb-1">Seu Nome</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.nome}
                                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                                placeholder="Nome completo"
                                                className="w-full bg-[#f6f4ef] rounded-xl px-3.5 py-2.5 text-xs text-dash-text border border-[#e4dfd5] focus:outline-none focus:border-[#1f674f]"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-dash-text block mb-1">Seu E-mail</label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="seu@email.com"
                                                className="w-full bg-[#f6f4ef] rounded-xl px-3.5 py-2.5 text-xs text-dash-text border border-[#e4dfd5] focus:outline-none focus:border-[#1f674f]"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-dash-text block mb-1">Data Desejada</label>
                                            <input
                                                type="date"
                                                required
                                                value={formData.data}
                                                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                                                className="w-full bg-[#f6f4ef] rounded-xl px-3.5 py-2.5 text-xs text-dash-text border border-[#e4dfd5] focus:outline-none focus:border-[#1f674f]"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-dash-text block mb-1">Turno de Preferência</label>
                                            <select
                                                value={formData.turno}
                                                onChange={(e) => setFormData({ ...formData, turno: e.target.value })}
                                                className="w-full bg-[#f6f4ef] rounded-xl px-3.5 py-2.5 text-xs text-dash-text border border-[#e4dfd5] focus:outline-none focus:border-[#1f674f] cursor-pointer"
                                            >
                                                <option value="manha">Manhã (09:00 às 12:00)</option>
                                                <option value="tarde">Tarde (14:00 às 18:00)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-dash-text block mb-1">Pauta ou Dúvidas Principais</label>
                                        <textarea
                                            rows={3}
                                            value={formData.mensagem}
                                            onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                                            placeholder="Ex: Gostaria de revisar o Marco 3 (Metas) e tirar dúvidas sobre a alocação recomendada..."
                                            className="w-full bg-[#f6f4ef] rounded-xl p-3 text-xs text-dash-text border border-[#e4dfd5] focus:outline-none focus:border-[#1f674f]"
                                        />
                                    </div>

                                    <div className="pt-2 flex justify-end">
                                        <button
                                            type="submit"
                                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-dash-accent text-white text-xs font-bold rounded-xl hover:bg-dash-accent-mid transition-all shadow-sm cursor-pointer"
                                        >
                                            <Send className="w-3.5 h-3.5" />
                                            <span>Enviar Pedido de Agendamento</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="mt-4 pt-3 border-t border-dash-border flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-dash-text-muted">
                            <div>
                                Confirmação de reuniões e suporte: <strong className="text-dash-text">contato@meuarvo.com.br</strong>
                            </div>
                            <div className="text-dash-text-light">
                                Horários calibrados com a disponibilidade dos planejadores ARVO
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

