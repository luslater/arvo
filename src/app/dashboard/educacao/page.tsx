"use client"

import { Play, PiggyBank, BarChart3, TrendingUp, Globe2, Home, FileText, Lock } from "lucide-react"

export default function EducacaoPage() {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-7">
                <div className="font-serif text-[28px] text-dash-text tracking-tight mb-1">Sua jornada de aprendizado.</div>
                <div className="text-[13px] text-dash-text-muted">Trilhas curadas para o seu perfil · 2 vídeos particulares da equipe disponíveis.</div>
            </div>

            <div className="grid grid-cols-3 gap-3.5 mb-6">
                <div className="bg-white border border-[#e4e0d7] rounded-xl p-5 cursor-pointer hover:shadow-md hover:border-[#1f674f] transition-all flex flex-col justify-between h-full">
                    <div>
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-emerald-50 text-emerald-600 mb-3">
                            <PiggyBank className="w-5 h-5" />
                        </div>
                        <div className="text-[13px] font-bold text-[#123044] mb-1 leading-snug">Como montar sua reserva de emergência</div>
                        <div className="text-xs text-[#667085] mb-4">Módulo Fundação</div>
                        <div className="flex items-center justify-between">
                            <div className="text-[11px] text-dash-text-light">8 aulas · 42 min</div>
                            <div className="flex items-center gap-1.5 w-[50px] shrink-0 justify-end">
                                <div className="text-[11px] text-dash-accent font-medium">Concluído</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-[#e4e0d7] rounded-xl p-5 cursor-pointer hover:shadow-md hover:border-[#3b82f6] transition-all flex flex-col justify-between h-full">
                    <div>
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600 mb-3">
                            <BarChart3 className="w-5 h-5" />
                        </div>
                        <div className="text-[13px] font-bold text-[#123044] mb-1 leading-snug">Renda fixa sem mistério: Tesouro, CDB e LCI</div>
                        <div className="text-xs text-[#667085] mb-4">Em andamento</div>
                        <div className="flex items-center justify-between">
                            <div className="text-[11px] text-dash-text-light">10 aulas · 58 min</div>
                            <div className="flex items-center gap-1.5 w-[55px] shrink-0">
                                <div className="flex-1 h-[3px] bg-dash-surface-active rounded-full overflow-hidden"><div className="h-full bg-dash-blue rounded-full" style={{ width: '60%' }}></div></div>
                                <div className="text-[11px] text-dash-blue font-medium shrink-0">60%</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-[#e4e0d7] rounded-xl p-5 cursor-pointer hover:shadow-md hover:border-[#f59e0b] transition-all flex flex-col justify-between h-full">
                    <div>
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-amber-50 text-amber-600 mb-3">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div className="text-[13px] font-bold text-[#123044] mb-1 leading-snug">Renda variável: ações e ETFs para iniciantes</div>
                        <div className="text-xs text-[#667085] mb-4">Recomendado</div>
                        <div className="flex items-center justify-between">
                            <div className="text-[11px] text-dash-text-light">12 aulas · 74 min</div>
                            <div className="flex items-center gap-1.5">
                                <div className="text-[11px] text-dash-text-light">Não iniciado</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#fbfaf8] border border-[#e4e0d7] rounded-xl p-5 cursor-pointer hover:shadow-sm transition-all flex flex-col justify-between h-full opacity-70">
                    <div>
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-50 text-purple-400 mb-3">
                            <Globe2 className="w-5 h-5" />
                        </div>
                        <div className="text-[13px] font-bold text-[#667085] mb-1 leading-snug">Diversificação global: S&P 500 e dolarização</div>
                        <div className="text-xs text-[#8d97a5] mb-4">Módulo Avançado</div>
                        <div className="flex items-center justify-between">
                            <div className="text-[11px] text-dash-text-light">9 aulas · 55 min</div>
                            <div className="flex items-center gap-1.5">
                                <div className="text-[11px] text-dash-text-light"><Lock className="w-3.5 h-3.5" /></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-[#e4e0d7] rounded-xl p-5 cursor-pointer hover:shadow-md hover:border-[#ef4444] transition-all flex flex-col justify-between h-full">
                    <div>
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-50 text-red-600 mb-3">
                            <Home className="w-5 h-5" />
                        </div>
                        <div className="text-[13px] font-bold text-[#123044] mb-1 leading-snug">FIIs: como investir em imóveis sem comprar um</div>
                        <div className="text-xs text-[#667085] mb-4">Alinhado com Objetivo</div>
                        <div className="flex items-center justify-between">
                            <div className="text-[11px] text-dash-text-light">7 aulas · 38 min</div>
                            <div className="flex items-center gap-1.5">
                                <div className="text-[11px] text-dash-text-light">Não iniciado</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-[#e4e0d7] rounded-xl p-5 cursor-pointer hover:shadow-md transition-all flex flex-col justify-between h-full">
                    <div>
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 text-gray-600 mb-3">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div className="text-[13px] font-bold text-[#123044] mb-1 leading-snug">IR e declaração: o que todo investidor precisa saber</div>
                        <div className="text-xs text-[#667085] mb-4">Planejamento e Rotina</div>
                        <div className="flex items-center justify-between">
                            <div className="text-[11px] text-dash-text-light">6 aulas · 32 min</div>
                            <div className="flex items-center gap-1.5">
                                <div className="text-[11px] text-dash-text-light">Não iniciado</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vídeos particulares da equipe */}
            <div className="bg-dash-surface border border-dash-border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-medium text-dash-text">Vídeos da Equipe ARVO</div>
                    <div className="text-xs text-dash-text-light">Equipe ARVO (Resp: Lucas Matos, CFP®) · Exclusivos para você</div>
                </div>

                <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-3.5 p-3.5 rounded-xl border border-dash-border cursor-pointer hover:bg-dash-surface-active transition-colors group">
                        <div className="w-[72px] h-[44px] bg-dash-accent-light rounded-lg flex flex-shrink-0 items-center justify-center text-[18px] text-dash-accent group-hover:scale-105 transition-transform"><Play className="w-5 h-5" fill="currentColor" /></div>
                        <div className="flex-1">
                            <div className="text-[13px] font-medium mb-0.5">Sua carteira em março: análise e próximos passos</div>
                            <div className="text-[11px] text-dash-text-light">Enviado em 12/03/2026 · 8 min</div>
                        </div>
                        <div className="flex-shrink-0"><span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-medium border border-emerald-200">Novo</span></div>
                    </div>

                    <div className="flex items-center gap-3.5 p-3.5 rounded-xl border border-dash-border cursor-pointer hover:bg-dash-surface-active transition-colors group">
                        <div className="w-[72px] h-[44px] bg-dash-accent-light rounded-lg flex flex-shrink-0 items-center justify-center text-[18px] text-dash-accent group-hover:scale-105 transition-transform"><Play className="w-5 h-5" fill="currentColor" /></div>
                        <div className="flex-1">
                            <div className="text-[13px] font-medium mb-0.5">Por que seu aporte de R$ 900/mês está no caminho certo</div>
                            <div className="text-[11px] text-dash-text-light">Enviado em 18/02/2026 · 5 min</div>
                        </div>
                        <div className="flex-shrink-0"><span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-medium border border-emerald-200">Novo</span></div>
                    </div>

                    <div className="flex items-center gap-3.5 p-3.5 rounded-xl border border-dash-border cursor-pointer hover:bg-dash-surface-active transition-colors group">
                        <div className="w-[72px] h-[44px] bg-dash-surface-active rounded-lg flex flex-shrink-0 items-center justify-center text-[18px] text-dash-text-muted group-hover:scale-105 transition-transform"><Play className="w-5 h-5" fill="currentColor" /></div>
                        <div className="flex-1">
                            <div className="text-[13px] font-medium mb-0.5 text-dash-text-muted">Revisão de objetivos: entrada do apartamento em 2027</div>
                            <div className="text-[11px] text-dash-text-light">Enviado em 05/01/2026 · 11 min</div>
                        </div>
                        <div className="flex-shrink-0"><span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-medium border border-slate-200">Assistido</span></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
