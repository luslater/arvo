import { CalendarDays, Clock, Video } from "lucide-react"

export default function DashboardAgendamentoPage() {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-7">
                <div className="font-serif text-[28px] text-dash-text tracking-tight mb-1">Agendamento</div>
                <div className="text-[13px] text-dash-text-muted">Marque uma conversa com seu assessor para revisar sua estratégia.</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1">
                    <div className="bg-dash-surface border border-dash-border rounded-2xl p-6 h-full flex flex-col justify-between">
                        <div>
                            <div className="w-16 h-16 rounded-full bg-dash-surface-active border border-dash-border flex items-center justify-center mb-4 overflow-hidden">
                                {/* Placeholder for Advisor Image */}
                                <div className="text-xl font-serif text-dash-accent">RM</div>
                            </div>
                            <h2 className="text-lg font-bold text-dash-text">Rafael Mendes, CFP®</h2>
                            <p className="text-sm text-dash-text-muted mb-6">Assessor de Investimentos</p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-dash-text-light mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium text-dash-text">Duração</div>
                                        <div className="text-sm text-dash-text-muted">30 ou 60 minutos</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Video className="w-5 h-5 text-dash-text-light mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium text-dash-text">Local</div>
                                        <div className="text-sm text-dash-text-muted">Google Meet ou Presencial</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CalendarDays className="w-5 h-5 text-dash-text-light mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium text-dash-text">Tópicos</div>
                                        <div className="text-sm text-dash-text-muted">Alocação de ativos, Dúvidas de mercado, Planejamento Financeiro</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-dash-border">
                            <p className="text-xs text-dash-text-muted leading-relaxed">
                                "Meu objetivo é garantir que seu portfólio esteja sempre alinhado aos seus objetivos de vida, com o nível certo de risco e a maior eficiência tributária."
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                    <div className="bg-dash-surface border border-dash-border rounded-2xl p-6 h-[600px] flex items-center justify-center">
                        <div className="text-center max-w-sm">
                            <CalendarDays className="w-12 h-12 text-dash-accent mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-semibold text-dash-text mb-2">Embed do Calendly / Google</h3>
                            <p className="text-sm text-dash-text-muted mb-6">
                                Aqui entrará o iframe do seu sistema de agendamento preferido (Calendly, Google Calendar, Cal.com), onde o cliente escolhe o horário disponível.
                            </p>
                            <button className="px-6 py-2.5 bg-dash-accent text-white font-medium rounded-xl hover:bg-dash-accent-mid transition-colors">
                                Conectar Agenda
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
