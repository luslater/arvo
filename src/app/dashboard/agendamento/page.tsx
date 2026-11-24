import { CalendarDays, Clock, Video, Mail, ExternalLink, ShieldCheck, CheckCircle2 } from "lucide-react"

export default function DashboardAgendamentoPage() {
    const calendarEmbedUrl = "https://calendar.google.com/calendar/embed?src=lucasdmatos%40gmail.com&ctz=America%2FSao_Paulo&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=0&showCalendars=0&showTz=0&mode=WEEK"
    const directCalendarUrl = "https://calendar.google.com/calendar/u/0/r/eventedit?add=lucasdmatos@gmail.com&add=contato@meuarvo.com.br&text=Reuni%C3%A3o+de+Planejamento+-+ARVO&details=Reuni%C3%A3o+de+alinhamento+e+revis%C3%A3o+do+planejamento+financeiro+ARVO.+Contato%3A+contato%40meuarvo.com.br"
    const mailtoUrl = "mailto:contato@meuarvo.com.br?cc=lucasdmatos@gmail.com&subject=Agendamento%20de%20Reuni%C3%A3o%20-%20ARVO&body=Ol%C3%A1%20Lucas%2C%0A%0AGostaria%20de%20agendar%20uma%20reuni%C3%A3o%20para%20revisar%20meu%20planejamento%20financeiro%20na%20ARVO.%0A%0AMelhores%20dias%20e%20hor%C3%A1rios%20para%20mim%3A%0A-%0A%0AObrigado!"

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
            <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-bold text-dash-text tracking-tight">Agendamento de Reunião</div>
                <div className="text-sm text-dash-text-muted">
                    Marque uma sessão individual com seu planejador CFP® para calibrar sua carteira e os 7 marcos da sua jornada.
                </div>
            </div>

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
                                        <div className="text-sm font-semibold text-dash-text">Canais de Contato</div>
                                        <div className="text-xs text-dash-text-muted">
                                            Institucional: <strong className="text-dash-text">contato@meuarvo.com.br</strong>
                                        </div>
                                        <div className="text-[11px] text-dash-text-light mt-0.5">
                                            Agenda sincronizada: lucasdmatos@gmail.com
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
                            <a
                                href={directCalendarUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-dash-accent text-white text-xs font-semibold rounded-xl hover:bg-dash-accent-mid transition-all shadow-sm"
                            >
                                <CalendarDays className="w-4 h-4" />
                                <span>Criar Evento no Google Agenda</span>
                                <ExternalLink className="w-3.5 h-3.5 opacity-70 ml-0.5" />
                            </a>

                            <a
                                href={mailtoUrl}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-dash-surface-active hover:bg-dash-border text-dash-text text-xs font-medium rounded-xl transition-colors border border-dash-border"
                            >
                                <Mail className="w-4 h-4 text-dash-text-muted" />
                                <span>Sugerir Horário por E-mail</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Calendar embed */}
                <div className="lg:col-span-8">
                    <div className="bg-dash-surface border border-dash-border rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col h-[700px]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-dash-border">
                            <div>
                                <h3 className="text-sm sm:text-base font-bold text-dash-text">
                                    Disponibilidade Semanal da Agenda
                                </h3>
                                <p className="text-xs text-dash-text-muted">
                                    Consulte os horários livres e clique para criar a reunião diretamente com Lucas Matos.
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Agenda Aberta
                                </span>
                            </div>
                        </div>

                        <div className="flex-1 w-full rounded-xl overflow-hidden border border-dash-border bg-white relative">
                            <iframe
                                src={calendarEmbedUrl}
                                title="Agenda de Reuniões Lucas Matos - ARVO"
                                className="w-full h-full border-0"
                                loading="lazy"
                            />
                        </div>

                        <div className="mt-3 pt-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-dash-text-muted">
                            <div>
                                Conectado a: <strong className="text-dash-text">lucasdmatos@gmail.com</strong> com cópia para <strong className="text-dash-text">contato@meuarvo.com.br</strong>
                            </div>
                            <a
                                href={directCalendarUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-dash-accent font-semibold hover:underline inline-flex items-center gap-1"
                            >
                                Abrir janela cheia do Google Calendar
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
