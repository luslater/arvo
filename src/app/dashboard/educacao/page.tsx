"use client"

import { Play } from "lucide-react"

export default function EducacaoPage() {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-7">
                <div className="font-serif text-[28px] text-dash-text tracking-tight mb-1">Sua jornada de aprendizado.</div>
                <div className="text-[13px] text-dash-text-muted">Trilhas curadas para o seu perfil · 2 vídeos particulares do seu assessor disponíveis.</div>
            </div>

            <div className="grid grid-cols-3 gap-3.5 mb-6">
                <div className="bg-dash-surface border border-dash-border rounded-2xl overflow-hidden cursor-pointer hover:border-dash-border-strong hover:-translate-y-0.5 transition-all shadow-sm">
                    <div className="h-[100px] flex items-center justify-center text-[36px] bg-dash-accent-light">🏗️</div>
                    <div className="p-4">
                        <div className="text-[10px] font-medium uppercase tracking-[0.06em] text-dash-text-light mb-1">Fundação</div>
                        <div className="text-[13px] font-medium mb-3 leading-snug">Como montar sua reserva de emergência</div>
                        <div className="flex items-center justify-between">
                            <div className="text-[11px] text-dash-text-light">8 aulas · 42 min</div>
                            <div className="flex items-center gap-1.5 w-[50px] shrink-0 justify-end">
                                <div className="text-[11px] text-dash-accent font-medium">Concluído</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-dash-surface border border-dash-border rounded-2xl overflow-hidden cursor-pointer hover:border-dash-border-strong hover:-translate-y-0.5 transition-all shadow-sm">
                    <div className="h-[100px] flex items-center justify-center text-[36px] bg-dash-blue-light">📊</div>
                    <div className="p-4">
                        <div className="text-[10px] font-medium uppercase tracking-[0.06em] text-dash-text-light mb-1">Em andamento</div>
                        <div className="text-[13px] font-medium mb-3 leading-snug">Renda fixa sem mistério: Tesouro, CDB e LCI</div>
                        <div className="flex items-center justify-between">
                            <div className="text-[11px] text-dash-text-light">10 aulas · 58 min</div>
                            <div className="flex items-center gap-1.5 w-[55px] shrink-0">
                                <div className="flex-1 h-[3px] bg-dash-surface-active rounded-full overflow-hidden"><div className="h-full bg-dash-blue rounded-full" style={{ width: '60%' }}></div></div>
                                <div className="text-[11px] text-dash-blue font-medium shrink-0">60%</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-dash-surface border border-dash-border rounded-2xl overflow-hidden cursor-pointer hover:border-dash-border-strong hover:-translate-y-0.5 transition-all shadow-sm">
                    <div className="h-[100px] flex items-center justify-center text-[36px] bg-dash-amber-light">📈</div>
                    <div className="p-4">
                        <div className="text-[10px] font-medium uppercase tracking-[0.06em] text-dash-text-light mb-1">Próxima recomendada</div>
                        <div className="text-[13px] font-medium mb-3 leading-snug">Renda variável: ações e ETFs para iniciantes</div>
                        <div className="flex items-center justify-between">
                            <div className="text-[11px] text-dash-text-light">12 aulas · 74 min</div>
                            <div className="flex items-center gap-1.5">
                                <div className="text-[11px] text-dash-text-light">Não iniciado</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-dash-surface border border-dash-border rounded-2xl overflow-hidden cursor-pointer hover:border-dash-border-strong hover:-translate-y-0.5 transition-all shadow-sm">
                    <div className="h-[100px] flex items-center justify-center text-[36px] bg-[#F3EAF9]">🌍</div>
                    <div className="p-4">
                        <div className="text-[10px] font-medium uppercase tracking-[0.06em] text-dash-text-light mb-1">Avançado · Bloqueado</div>
                        <div className="text-[13px] font-medium mb-3 leading-snug text-dash-text-muted">Diversificação global: S&P 500 e dolarização</div>
                        <div className="flex items-center justify-between">
                            <div className="text-[11px] text-dash-text-light">9 aulas · 55 min</div>
                            <div className="flex items-center gap-1.5">
                                <div className="text-[11px] text-dash-text-light">🔒</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-dash-surface border border-dash-border rounded-2xl overflow-hidden cursor-pointer hover:border-dash-border-strong hover:-translate-y-0.5 transition-all shadow-sm">
                    <div className="h-[100px] flex items-center justify-center text-[36px] bg-dash-danger-light">🏠</div>
                    <div className="p-4">
                        <div className="text-[10px] font-medium uppercase tracking-[0.06em] text-dash-text-light mb-1">Seu objetivo</div>
                        <div className="text-[13px] font-medium mb-3 leading-snug">FIIs: como investir em imóveis sem comprar um</div>
                        <div className="flex items-center justify-between">
                            <div className="text-[11px] text-dash-text-light">7 aulas · 38 min</div>
                            <div className="flex items-center gap-1.5">
                                <div className="text-[11px] text-dash-text-light">Não iniciado</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-dash-surface border border-dash-border rounded-2xl overflow-hidden cursor-pointer hover:border-dash-border-strong hover:-translate-y-0.5 transition-all shadow-sm">
                    <div className="h-[100px] flex items-center justify-center text-[36px] bg-dash-surface-active">🧾</div>
                    <div className="p-4">
                        <div className="text-[10px] font-medium uppercase tracking-[0.06em] text-dash-text-light mb-1">Planejamento</div>
                        <div className="text-[13px] font-medium mb-3 leading-snug">IR e declaração: o que todo investidor precisa saber</div>
                        <div className="flex items-center justify-between">
                            <div className="text-[11px] text-dash-text-light">6 aulas · 32 min</div>
                            <div className="flex items-center gap-1.5">
                                <div className="text-[11px] text-dash-text-light">Não iniciado</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vídeos particulares do assessor */}
            <div className="bg-dash-surface border border-dash-border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-medium text-dash-text">Vídeos do seu assessor</div>
                    <div className="text-xs text-dash-text-light">Rafael Mendes, CFP® · Exclusivos para você</div>
                </div>

                <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-3.5 p-3.5 rounded-xl border border-dash-border cursor-pointer hover:bg-dash-surface-active transition-colors group">
                        <div className="w-[72px] h-[44px] bg-dash-accent-light rounded-lg flex flex-shrink-0 items-center justify-center text-[18px] text-dash-accent group-hover:scale-105 transition-transform"><Play className="w-5 h-5" fill="currentColor" /></div>
                        <div className="flex-1">
                            <div className="text-[13px] font-medium mb-0.5">Sua carteira em março: análise e próximos passos</div>
                            <div className="text-[11px] text-dash-text-light">Enviado em 12/03/2026 · 8 min</div>
                        </div>
                        <div className="flex-shrink-0"><span className="bg-dash-accent text-white text-[10px] px-2 py-0.5 rounded-full font-medium">Novo</span></div>
                    </div>

                    <div className="flex items-center gap-3.5 p-3.5 rounded-xl border border-dash-border cursor-pointer hover:bg-dash-surface-active transition-colors group">
                        <div className="w-[72px] h-[44px] bg-dash-accent-light rounded-lg flex flex-shrink-0 items-center justify-center text-[18px] text-dash-accent group-hover:scale-105 transition-transform"><Play className="w-5 h-5" fill="currentColor" /></div>
                        <div className="flex-1">
                            <div className="text-[13px] font-medium mb-0.5">Por que seu aporte de R$ 900/mês está no caminho certo</div>
                            <div className="text-[11px] text-dash-text-light">Enviado em 18/02/2026 · 5 min</div>
                        </div>
                        <div className="flex-shrink-0"><span className="bg-dash-accent text-white text-[10px] px-2 py-0.5 rounded-full font-medium">Novo</span></div>
                    </div>

                    <div className="flex items-center gap-3.5 p-3.5 rounded-xl border border-dash-border cursor-pointer hover:bg-dash-surface-active transition-colors group">
                        <div className="w-[72px] h-[44px] bg-dash-surface-active rounded-lg flex flex-shrink-0 items-center justify-center text-[18px] text-dash-text-muted group-hover:scale-105 transition-transform"><Play className="w-5 h-5" fill="currentColor" /></div>
                        <div className="flex-1">
                            <div className="text-[13px] font-medium mb-0.5 text-dash-text-muted">Revisão de objetivos: entrada do apartamento em 2027</div>
                            <div className="text-[11px] text-dash-text-light">Enviado em 05/01/2026 · 11 min</div>
                        </div>
                        <div className="flex-shrink-0"><span className="bg-dash-surface-active text-dash-text-light text-[10px] px-2 py-0.5 rounded-full font-medium">Assistido</span></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
