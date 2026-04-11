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
    aporteMensal?: number;
    retornoAnual?: number;
    prazoAnos?: number;
}

// Official Series mapping cumulative percentages from Jan-23 to Apr-24 (16 months)
// This accurately reflects realistic benchmark distributions and the official Portfolio paths.
const OFFICIAL_DATA = {
    "CDI": [1.12, 2.05, 3.25, 4.20, 5.38, 6.51, 7.66, 8.88, 9.95, 10.95, 11.95, 13.04, 14.02, 14.95, 15.90, 16.85],
    "IPCA": [0.53, 1.37, 2.08, 2.70, 2.93, 2.85, 2.97, 3.20, 3.46, 3.70, 3.98, 4.56, 4.98, 5.80, 5.96, 6.30],
    "IBOV": [3.37, -4.3, -7.2, -4.5, -1.2, 7.9, 11.4, 5.9, 6.5, 5.4, 18.6, 22.2, 16.5, 17.5, 16.8, 15.0],
    "ABRIGO": [1.25, 2.30, 3.60, 4.75, 6.05, 7.30, 8.65, 10.05, 11.20, 12.35, 13.45, 14.70, 15.80, 16.85, 17.95, 19.00],
    "RITMO": [1.45, 2.65, 4.10, 5.35, 6.75, 8.20, 9.75, 11.35, 12.60, 13.85, 15.45, 17.10, 18.40, 19.65, 20.85, 22.10],
    "VANGUARDA": [1.90, 2.50, 4.30, 5.80, 7.60, 9.50, 11.50, 13.10, 14.50, 15.70, 18.50, 21.30, 22.80, 24.20, 25.10, 26.50],
    "OCEANO": [2.50, 1.50, 3.20, 5.50, 7.80, 10.50, 13.50, 14.20, 15.50, 16.50, 22.50, 27.50, 28.50, 30.20, 31.00, 32.50],
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

export function DashboardCharts({
    patrimonioTotal,
    profileType,
    startDate,
    aporteMensal,
    retornoAnual,
    prazoAnos
}: ChartProps) {
    const [activeLines, setActiveLines] = useState<Comparative[]>(["CDI"])

    const toggleLine = (line: Comparative) => {
        setActiveLines(prev =>
            prev.includes(line) ? prev.filter(l => l !== line) : [...prev, line]
        )
    }

    const { chartData, monthsLabels } = useMemo(() => {
        const today = new Date();
        const start = startDate ? new Date(startDate) : new Date(today.getFullYear(), today.getMonth() - 11, 1);

        // Fixed exact dates from the Official Data corresponding to 16 months since Jan 2023
        const EXPLICIT_LABELS = [
            "jan. 23", "fev. 23", "mar. 23", "abr. 23", "mai. 23", "jun. 23", "jul. 23",
            "ago. 23", "set. 23", "out. 23", "nov. 23", "dez. 23", "jan. 24", "fev. 24",
            "mar. 24", "abr. 24"
        ];

        const diffMonths = 16;
        const pType = profileType || "RITMO"
        const myPortfolioReturn = OFFICIAL_DATA[pType as keyof typeof OFFICIAL_DATA] || OFFICIAL_DATA["RITMO"]

        const monthsLabels = EXPLICIT_LABELS;

        const chartData = monthsLabels.map((month, idx) => {
            // Because our official data has exactly 16 values matching the 16 labels:
            const dataIdx = idx;

            const dataPoint: any = { month, "Minha Carteira": myPortfolioReturn[dataIdx] }

            // Add comparative series
            activeLines.forEach(line => {
                dataPoint[line] = OFFICIAL_DATA[line as keyof typeof OFFICIAL_DATA] ? OFFICIAL_DATA[line as keyof typeof OFFICIAL_DATA][dataIdx] : 0
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

    const projectionData = useMemo(() => {
        const data = [];
        const today = new Date();
        const startYear = today.getFullYear();
        let currentPatrimony = patrimonioTotal;
        const r = (retornoAnual || 12) / 100;
        const monthlyReturn = Math.pow(1 + r, 1 / 12) - 1;
        const pt = (aporteMensal || 0);
        const years = (prazoAnos && prazoAnos > 0) ? prazoAnos : 70;

        data.push({
            label: "Hoje",
            patrimonio: currentPatrimony
        });

        // Determine step size to keep bars reasonable (< 40)
        const step = Math.max(1, Math.floor(years / 35));

        for (let y = 1; y <= years; y++) {
            for (let m = 0; m < 12; m++) {
                currentPatrimony = currentPatrimony * (1 + monthlyReturn) + pt;
            }
            if (y % step === 0 || y === years) {
                // Ensure no duplicate years
                const yearLabel = String(startYear + y);
                if (data[data.length - 1].label !== yearLabel) {
                    data.push({
                        label: yearLabel,
                        patrimonio: currentPatrimony
                    });
                }
            }
        }
        return data;
    }, [patrimonioTotal, aporteMensal, retornoAnual, prazoAnos]);


    const formatBRL = (val: number) =>
        new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(val)

    return (
        <div className="flex flex-col gap-6 mb-8">
            {/* Gráfico de Rentabilidade (Principal) */}
            <div className="bg-dash-surface border border-dash-border rounded-2xl p-6 shadow-sm">
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

            {/* Gráfico Evolução de Patrimônio (Embaixo) */}
            <div className="bg-dash-surface border border-dash-border rounded-2xl p-6 shadow-sm flex flex-col">
                <div>
                    <div className="flex items-center gap-1.5 text-[14px] font-semibold text-dash-text mb-1">
                        <BarChart3 className="w-4 h-4 text-dash-text-muted" /> Evolução Patrimonial (Projeção)
                    </div>
                    <div className="text-[11.5px] text-dash-text-light mb-6">
                        Crescimento projetado do seu capital até a aposentadoria ({prazoAnos || 70} anos)
                    </div>
                </div>

                <div className="flex-1 min-h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={projectionData} margin={{ top: 10, right: 0, bottom: 0, left: -20 }}>
                            <CartesianGrid vertical={false} stroke="rgba(0,0,0,0.04)" />
                            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10 }} dy={8} />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`}
                                tick={{ fill: '#94A3B8', fontSize: 10 }}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                                contentStyle={{ borderRadius: 8, border: '1px solid rgba(10,25,47,0.1)', fontSize: 12 }}
                                formatter={(v: number) => [formatBRL(v), "Patrimônio Projetado"]}
                            />
                            <Bar dataKey="patrimonio" fill="#0A192F" radius={[4, 4, 0, 0]} maxBarSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
