"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const carteiraData6m = [
    { month: 'Out', carteira: 38200, ideal: 39000, cdi: 38800 },
    { month: 'Nov', carteira: 39100, ideal: 40200, cdi: 39600 },
    { month: 'Dez', carteira: 40500, ideal: 41500, cdi: 40400 },
    { month: 'Jan', carteira: 41800, ideal: 43000, cdi: 41300 },
    { month: 'Fev', carteira: 43200, ideal: 44800, cdi: 42200 },
    { month: 'Mar', carteira: 48200, ideal: 49500, cdi: 43100 },
]

export default function DashboardPage() {
    const [showUpload, setShowUpload] = useState(true)
    const [period, setPeriod] = useState('6m')

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Upload bar (contextual) */}
            {showUpload && (
                <div className="flex items-center gap-3 bg-dash-amber-light border border-dash-amber/20 rounded-lg p-3 px-4 mb-5">
                    <span className="text-[18px]">📄</span>
                    <div className="flex-1">
                        <div className="text-[13px] text-dash-amber font-medium">Atualize sua carteira</div>
                        <div className="text-[11px] text-dash-text-muted">Última atualização: há 18 dias. Suba seu extrato para manter o plano preciso.</div>
                    </div>
                    <button
                        onClick={() => setShowUpload(false)}
                        className="py-1.5 px-4 bg-dash-amber text-white border-none rounded-md text-xs font-medium cursor-pointer font-sans whitespace-nowrap hover:bg-[#8F6808] transition-colors"
                    >
                        Subir extrato ↑
                    </button>
                </div>
            )}

            <div className="mb-7">
                <div className="font-serif text-[28px] text-dash-text tracking-tight mb-1">Bom dia, Lucas.</div>
                <div className="text-[13px] text-dash-text-muted">Sua carteira está <strong className="font-medium text-dash-text">bem enquadrada</strong> — uma ação recomendada esta semana.</div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-4 gap-3.5 mb-6">
                <div className="bg-dash-surface border border-dash-border rounded-2xl p-5 shadow-sm">
                    <div className="text-[11px] text-dash-text-light uppercase tracking-[0.06em] mb-2">Patrimônio total</div>
                    <div className="font-serif text-[26px] text-dash-text tracking-tight">R$ 48.200</div>
                    <div className="text-xs mt-1 text-dash-accent-mid font-medium">↑ R$ 1.340 este mês</div>
                </div>
                <div className="bg-dash-surface border border-dash-border rounded-2xl p-5 shadow-sm">
                    <div className="text-[11px] text-dash-text-light uppercase tracking-[0.06em] mb-2">Rentabilidade 12m</div>
                    <div className="font-serif text-[26px] text-dash-text tracking-tight">11,4%</div>
                    <div className="text-xs mt-1 text-dash-accent-mid font-medium">↑ CDI + 2,1 p.p.</div>
                </div>
                <div className="bg-dash-surface border border-dash-border rounded-2xl p-5 shadow-sm">
                    <div className="text-[11px] text-dash-text-light uppercase tracking-[0.06em] mb-2">Aderência ao plano</div>
                    <div className="font-serif text-[26px] text-dash-text tracking-tight">87%</div>
                    <div className="text-xs mt-1 text-dash-text-light">Meta: 95%</div>
                </div>
                <div className="bg-dash-surface border border-dash-border rounded-2xl p-5 shadow-sm">
                    <div className="text-[11px] text-dash-text-light uppercase tracking-[0.06em] mb-2">Aporte mensal</div>
                    <div className="font-serif text-[26px] text-dash-text tracking-tight">R$ 900</div>
                    <div className="text-xs mt-1 text-dash-text-light">↔ Consistente</div>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-dash-surface border border-dash-border rounded-2xl p-6 mb-5 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                    <div className="text-sm font-medium text-dash-text">Evolução do patrimônio</div>
                    <div className="flex gap-4 items-center">
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1.5 text-xs text-dash-text-muted"><div className="w-2 h-2 rounded-full bg-dash-accent-mid"></div>Sua carteira</div>
                            <div className="flex items-center gap-1.5 text-xs text-dash-text-muted"><div className="w-2 h-2 rounded-full bg-[#CBD5E0]"></div>Carteira ideal</div>
                            <div className="flex items-center gap-1.5 text-xs text-dash-text-muted">
                                <div className="w-3 h-0 border-t-2 border-dashed border-[#A0AEC0]"></div>
                                CDI
                            </div>
                        </div>
                        <div className="flex gap-1 ml-4 bg-[#F8F9FA] border border-dash-border rounded-md p-1">
                            <button className={`px-2.5 py-1 text-[11px] border border-transparent rounded cursor-pointer font-sans transition-colors ${period === '3m' ? 'bg-dash-surface border-dash-border shadow-sm text-dash-text font-medium' : 'text-dash-text-muted hover:text-dash-text'}`} onClick={() => setPeriod('3m')}>3m</button>
                            <button className={`px-2.5 py-1 text-[11px] border border-transparent rounded cursor-pointer font-sans transition-colors ${period === '6m' ? 'bg-dash-surface border-dash-border shadow-sm text-dash-text font-medium' : 'text-dash-text-muted hover:text-dash-text'}`} onClick={() => setPeriod('6m')}>6m</button>
                            <button className={`px-2.5 py-1 text-[11px] border border-transparent rounded cursor-pointer font-sans transition-colors ${period === '12m' ? 'bg-dash-surface border-dash-border shadow-sm text-dash-text font-medium' : 'text-dash-text-muted hover:text-dash-text'}`} onClick={() => setPeriod('12m')}>12m</button>
                        </div>
                    </div>
                </div>
                <div className="h-[200px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={carteiraData6m} margin={{ top: 5, right: 0, bottom: 0, left: -20 }}>
                            <CartesianGrid vertical={false} stroke="rgba(0,0,0,0.05)" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9E9B96', fontSize: 11, fontFamily: 'var(--font-dm-sans)' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `R$ ${(val / 1000).toFixed(0)}k`} tick={{ fill: '#9E9B96', fontSize: 11, fontFamily: 'var(--font-dm-sans)' }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-dash-border)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontFamily: 'var(--font-dm-sans)' }}
                                formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`]}
                            />
                            <Line type="monotone" dataKey="cdi" stroke="#A0AEC0" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
                            <Line type="monotone" dataKey="ideal" stroke="#CBD5E0" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                            <Line type="monotone" dataKey="carteira" stroke="#4A8C62" strokeWidth={2.5} dot={{ r: 4, fill: '#4A8C62', strokeWidth: 0 }} activeDot={{ r: 6 }} fill="rgba(74,140,98,0.08)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Enquadramento + Tips */}
            <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-dash-surface border border-dash-border rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <div className="text-sm font-medium text-dash-text">Enquadramento da carteira</div>
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-dash-accent-light text-dash-accent">Bem alocado</span>
                    </div>

                    <div className="flex flex-col">
                        <div className="flex items-center justify-between py-3 border-b border-dash-border">
                            <div className="flex flex-col gap-0.5">
                                <div className="text-[13px] font-medium">Renda Fixa</div>
                                <div className="text-[11px] text-dash-text-light">Ideal: 40–50%</div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <div className="text-[13px] font-medium">44%</div>
                                <div className="flex items-center gap-2">
                                    <div className="w-20 h-1 bg-dash-surface-active rounded-full overflow-hidden"><div className="h-full bg-dash-accent-mid rounded-full" style={{ width: '88%' }}></div></div>
                                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-dash-accent-light text-dash-accent">Ok</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-dash-border">
                            <div className="flex flex-col gap-0.5">
                                <div className="text-[13px] font-medium">Renda Variável</div>
                                <div className="text-[11px] text-dash-text-light">Ideal: 30–40%</div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <div className="text-[13px] font-medium">28%</div>
                                <div className="flex items-center gap-2">
                                    <div className="w-20 h-1 bg-dash-surface-active rounded-full overflow-hidden"><div className="h-full bg-dash-blue rounded-full" style={{ width: '56%' }}></div></div>
                                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-dash-amber-light text-dash-amber">Baixo</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-dash-border">
                            <div className="flex flex-col gap-0.5">
                                <div className="text-[13px] font-medium">FIIs</div>
                                <div className="text-[11px] text-dash-text-light">Ideal: 10–20%</div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <div className="text-[13px] font-medium">18%</div>
                                <div className="flex items-center gap-2">
                                    <div className="w-20 h-1 bg-dash-surface-active rounded-full overflow-hidden"><div className="h-full bg-[#D4A017] rounded-full" style={{ width: '90%' }}></div></div>
                                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-dash-accent-light text-dash-accent">Ok</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-3">
                            <div className="flex flex-col gap-0.5">
                                <div className="text-[13px] font-medium">Reserva de liquidez</div>
                                <div className="text-[11px] text-dash-text-light">Ideal: 5–10%</div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <div className="text-[13px] font-medium">10%</div>
                                <div className="flex items-center gap-2">
                                    <div className="w-20 h-1 bg-dash-surface-active rounded-full overflow-hidden"><div className="h-full bg-dash-text-light rounded-full" style={{ width: '100%' }}></div></div>
                                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-dash-accent-light text-dash-accent">Ok</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-dash-surface border border-dash-border rounded-2xl p-6 shadow-sm">
                    <div className="text-sm font-medium text-dash-text mb-5">Próximos passos</div>

                    <div className="flex flex-col gap-2">
                        <div className="flex gap-3 p-3.5 rounded-xl border border-dash-amber/20 bg-[#FEFDF7]">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[15px] shrink-0 bg-dash-amber-light leading-none">⚖️</div>
                            <div className="flex-1">
                                <div className="text-[13px] font-medium mb-1 line-clamp-1">Rebalancear renda variável</div>
                                <div className="text-xs text-dash-text-muted leading-relaxed">Sua alocação em ações está 7 p.p. abaixo do ideal para seu perfil moderado. Considere direcionar o próximo aporte.</div>
                                <div className="text-[11px] font-medium mt-1.5 text-dash-accent cursor-pointer hover:underline">Ver sugestão de alocação →</div>
                            </div>
                        </div>

                        <div className="flex gap-3 p-3.5 rounded-xl border border-dash-accent/10 bg-[#FAFDF9]">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[15px] shrink-0 bg-dash-accent-light leading-none">📅</div>
                            <div className="flex-1">
                                <div className="text-[13px] font-medium mb-1 line-clamp-1">Aporte do mês em dia</div>
                                <div className="text-xs text-dash-text-muted leading-relaxed">Você aportou R$ 900 consistentemente por 8 meses. Isso representa R$ 12.400 acumulados só em aportes regulares.</div>
                            </div>
                        </div>

                        <div className="flex gap-3 p-3.5 rounded-xl border border-dash-accent/10 bg-[#FAFDF9]">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[15px] shrink-0 bg-dash-blue-light leading-none">🌍</div>
                            <div className="flex-1">
                                <div className="text-[13px] font-medium mb-1 line-clamp-1">Considere diversificação global</div>
                                <div className="text-xs text-dash-text-muted leading-relaxed">Sua carteira é 100% Brasil. A partir de R$ 50k faz sentido avaliar exposição ao dólar via ETFs.</div>
                                <div className="text-[11px] font-medium mt-1.5 text-dash-accent cursor-pointer hover:underline">Perguntar ao assessor →</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
