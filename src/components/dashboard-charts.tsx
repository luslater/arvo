"use client"

import { useState, useMemo } from "react"
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts"
import { TrendingUp, BarChart3, CheckSquare, Square } from "lucide-react"

// Types of comparatives
type Comparative = "CDI" | "IPCA" | "IBOV" | "ABRIGO" | "RITMO" | "VANGUARDA" | "OCEANO"

interface ChartProps {
    patrimonioTotal: number;
    profileType: string | null;
    startDate: Date | string | null;
}

// Helper to generate simulated monthly data based on an annualized return
function generateSimulatedData(months: number, baseAnnualReturn: number, volatility: number) {
    let accumulated = 1;
    const monthlyBase = Math.pow(1 + baseAnnualReturn / 100, 1 / 12) - 1;

    return Array.from({ length: months }).map(() => {
        // Add some random noise for realism
        const noise = (Math.random() - 0.5) * volatility;
        const currentReturn = monthlyBase + noise;
        accumulated *= (1 + currentReturn);
        return (accumulated - 1) * 100; // accumulative return in %
    });
}

// Fixed seeds to keep the lines stable across re-renders
const MOCK_DATA = {
    "CDI": generateSimulatedData(12, 10.5, 0.001),
    "IPCA": generateSimulatedData(12, 4.5, 0.002),
    "IBOV": generateSimulatedData(12, 12.0, 0.02),
    "ABRIGO": generateSimulatedData(12, 10.8, 0.003),
    "RITMO": generateSimulatedData(12, 12.2, 0.008),
    "VANGUARDA": generateSimulatedData(12, 14.5, 0.015),
    "OCEANO": generateSimulatedData(12, 16.0, 0.02),
}

const COLORS: Record<string, string> = {
    "Minha Carteira": "#0A192F",
    "CDI": "#94A3B8",
    "IPCA": "#3B82F6",
    "IBOV": "#EF4444",
    "ABRIGO": "#10B981",
    "RITMO": "#F59E0B",
    "VANGUARDA": "#8B5CF6",
    "OCEANO": "#EC4899",
}

export function DashboardCharts({ patrimonioTotal, profileType, startDate }: ChartProps) {
    const [activeLines, setActiveLines] = useState<Comparative[]>(["CDI"])

    const toggleLine = (line: Comparative) => {
        setActiveLines(prev =>
            prev.includes(line) ? prev.filter(l => l !== line) : [...prev, line]
        )
    }

    const { chartData, monthsLabels } = useMemo(() => {
        const today = new Date();
        const start = startDate ? new Date(startDate) : new Date(today.getFullYear(), today.getMonth() - 11, 1);

        // Calculate diff in months (min 6, max 12 for UI purposes)
        let diffMonths = (today.getFullYear() - start.getFullYear()) * 12 + (today.getMonth() - start.getMonth()) + 1;
        if (diffMonths < 6) diffMonths = 6;
        if (diffMonths > 12) diffMonths = 12;

        const pType = profileType || "RITMO"
        const myPortfolioReturn = MOCK_DATA[pType as keyof typeof MOCK_DATA] || MOCK_DATA["RITMO"]

        const monthsLabels = [];
        for (let i = diffMonths - 1; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            monthsLabels.push(d.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }));
        }

        const chartData = monthsLabels.map((month, idx) => {
            // Pick corresponding simulated return index
            const dataIdx = 12 - diffMonths + idx;

            const dataPoint: any = { month, "Minha Carteira": myPortfolioReturn[dataIdx] }

            // Add comparative series
            activeLines.forEach(line => {
                dataPoint[line] = MOCK_DATA[line][dataIdx]
            })

            // Bar chart data (Patrimônio) based on return applied to totalCarteira
            // Assuming current patrimonio is the final value, we discount back
            const finalReturn = myPortfolioReturn[myPortfolioReturn.length - 1] / 100;
            const currentReturn = myPortfolioReturn[dataIdx] / 100;
            const absoluteBase = patrimonioTotal / (1 + finalReturn);
            dataPoint.patrimonio = absoluteBase * (1 + currentReturn);

            return dataPoint
        })

        return { chartData, monthsLabels }
    }, [activeLines, patrimonioTotal, profileType, startDate])


    const formatBRL = (val: number) =>
        new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(val)

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
            {/* Gráfico de Rentabilidade (Principal) */}
            <div className="lg:col-span-2 bg-dash-surface border border-dash-border rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                    <div>
                        <div className="flex items-center gap-1.5 text-[14px] font-semibold text-dash-text mb-1">
                            <TrendingUp className="w-4 h-4 text-dash-accent" /> Rentabilidade da Carteira (%)
                        </div>
                        <div className="text-[11.5px] text-dash-text-light">
                            Evolução acumulada desde {monthsLabels[0] || "o início"}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-[11px]">
                        {(["CDI", "IPCA", "IBOV", "ABRIGO", "RITMO", "VANGUARDA", "OCEANO"] as Comparative[]).map(comp => (
                            <button
                                key={comp}
                                onClick={() => toggleLine(comp)}
                                className={`flex items-center gap-1 px-2.5 py-1 rounded-full border transition-colors ${activeLines.includes(comp)
                                        ? "bg-dash-surface-active border-dash-border-strong text-dash-text font-medium"
                                        : "bg-transparent border-dash-border text-dash-text-muted hover:text-dash-text"
                                    }`}
                            >
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[comp] }}></div>
                                {comp}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                            <CartesianGrid vertical={false} stroke="rgba(0,0,0,0.04)" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} dy={8} />
                            <YAxis axisLine={false} tickLine={false} tickFormatter={v => `${v.toFixed(1)}%`} tick={{ fill: '#94A3B8', fontSize: 11 }} />
                            <Tooltip
                                contentStyle={{ borderRadius: 8, border: '1px solid rgba(10,25,47,0.1)', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                                formatter={(v: number) => [`${v.toFixed(2)}%`, undefined]}
                            />

                            <Line
                                type="monotone"
                                dataKey="Minha Carteira"
                                stroke={COLORS["Minha Carteira"]}
                                strokeWidth={3}
                                dot={{ r: 2, fill: COLORS["Minha Carteira"], strokeWidth: 0 }}
                                activeDot={{ r: 5 }}
                            />

                            {activeLines.map(line => (
                                <Line
                                    key={line}
                                    type="monotone"
                                    dataKey={line}
                                    stroke={COLORS[line]}
                                    strokeWidth={1.5}
                                    dot={false}
                                    strokeDasharray={["CDI", "IPCA"].includes(line) ? "4 4" : undefined}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Gráfico Evolução de Patrimônio (Menor) */}
            <div className="bg-dash-surface border border-dash-border rounded-2xl p-6 shadow-sm flex flex-col">
                <div>
                    <div className="flex items-center gap-1.5 text-[14px] font-semibold text-dash-text mb-1">
                        <BarChart3 className="w-4 h-4 text-dash-text-muted" /> Evolução Patrimonial
                    </div>
                    <div className="text-[11.5px] text-dash-text-light mb-6">
                        Crescimento do seu capital investido
                    </div>
                </div>

                <div className="flex-1 min-h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 0, bottom: 0, left: -20 }}>
                            <CartesianGrid vertical={false} stroke="rgba(0,0,0,0.04)" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10 }} dy={8} />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`}
                                tick={{ fill: '#94A3B8', fontSize: 10 }}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                                contentStyle={{ borderRadius: 8, border: '1px solid rgba(10,25,47,0.1)', fontSize: 12 }}
                                formatter={(v: number) => [formatBRL(v), "Patrimônio"]}
                            />
                            <Bar dataKey="patrimonio" fill="#0A192F" radius={[4, 4, 0, 0]} maxBarSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
