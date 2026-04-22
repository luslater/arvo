"use client"

import { useState, useMemo } from "react"
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts"
import { TrendingUp, BarChart3, CheckSquare, Square } from "lucide-react"

import { OFFICIAL_DATA_40M, HISTORICAL_LABELS_40M } from "../config/chart-history"
import { MONTHLY_RETURNS } from "../config/funds-monthly"
import { useArvoStoreV3, STEP_ORDER } from "../app/escada/arvo-store-v3"

// Types of comparatives
type Comparative = "CDI" | "IPCA" | "IBOV" | "ABRIGO" | "RITMO" | "VISÃO" | "OCEANO"
type TimeFilter = "1M" | "YTD" | "12M" | "24M" | "36M" | "MAX"

interface ChartProps {
    patrimonioTotal: number;
    profileType: string | null;
    startDate: Date | string | null;
    aporteMensal?: number;
    retornoAnual?: number;
    prazoAnos?: number;
}

const COLORS: Record<string, string> = {
    "Minha Carteira": "#0A192F",
    "CDI": "#94A3B8",
    "IPCA": "#3B82F6",
    "IBOV": "#EF4444",
    "ABRIGO": "#10B981",
    "RITMO": "#F59E0B",
    "VISÃO": "#8B5CF6",
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

    const [timeFilter, setTimeFilter] = useState<TimeFilter>("MAX")
    const storeBuckets = useArvoStoreV3(state => state.buckets);

    const { chartData, monthsLabels } = useMemo(() => {
        // Extract array points depending on filter
        let sliceCount = HISTORICAL_LABELS_40M.length;
        if (timeFilter === "1M") sliceCount = 2; // minimum 2 points to draw line
        else if (timeFilter === "YTD") sliceCount = new Date().getMonth() + 1; // Since Jan of current year
        else if (timeFilter === "12M") sliceCount = 12;
        else if (timeFilter === "24M") sliceCount = 24;
        else if (timeFilter === "36M") sliceCount = 36;
        else if (timeFilter === "MAX") sliceCount = HISTORICAL_LABELS_40M.length;

        // Ensure we don't slice more than available
        sliceCount = Math.min(sliceCount, HISTORICAL_LABELS_40M.length);
        const startIndex = HISTORICAL_LABELS_40M.length - sliceCount;

        const slicedLabels = HISTORICAL_LABELS_40M.slice(startIndex);
        const pType = profileType || "RITMO";
        const fallbackReturnFull = OFFICIAL_DATA_40M[pType as keyof typeof OFFICIAL_DATA_40M] || OFFICIAL_DATA_40M["RITMO"];

        // Compute dynamic return based on store buckets
        let totalBuckets = 0;
        for (const k of STEP_ORDER) {
            storeBuckets[k].forEach(e => totalBuckets += e.value);
        }

        let myPortfolioReturnFull = fallbackReturnFull;
        if (totalBuckets > 0) {
            const weights: Record<string, number> = {};
            for (const k of STEP_ORDER) {
                storeBuckets[k].forEach(e => {
                    if (e.fundId) weights[e.fundId] = (weights[e.fundId] || 0) + (e.value / totalBuckets);
                });
            }

            const dynamicRet: number[] = [];
            let currentAccum = 0;
            // Iterate over all 40 months
            for (let m = 0; m < HISTORICAL_LABELS_40M.length; m++) {
                let monthBlendDecimal = 0;
                for (const [fId, w] of Object.entries(weights)) {
                    let r = MONTHLY_RETURNS.funds[fId as keyof typeof MONTHLY_RETURNS.funds]?.[m];
                    if (typeof r !== "number") r = MONTHLY_RETURNS.macros.cdi[m] || 0;
                    monthBlendDecimal += w * r;
                }
                currentAccum = ((1 + currentAccum / 100) * (1 + monthBlendDecimal) - 1) * 100;
                dynamicRet.push(currentAccum);
            }
            myPortfolioReturnFull = dynamicRet;
        }

        const chartData = slicedLabels.map((month, relativeIdx) => {
            const dataIdx = startIndex + relativeIdx;

            // Re-benchmarking (zeroing out the start point of the timeframe if required? 
            // In typical financial charts, picking a timeframe zero-bases the chart at index 0. 
            // We subtract the return at (startIndex - 1) across the board.
            const baseIndexForZeroing = Math.max(0, startIndex - 1);
            const myPortBase = myPortfolioReturnFull[baseIndexForZeroing];
            const myAssetReturn = myPortfolioReturnFull[dataIdx] - myPortBase;

            const dataPoint: any = { month, "Minha Carteira": myAssetReturn };

            activeLines.forEach(line => {
                const arr = OFFICIAL_DATA_40M[line as keyof typeof OFFICIAL_DATA_40M];
                if (arr) {
                    const baseLineReturn = arr[baseIndexForZeroing];
                    dataPoint[line] = arr[dataIdx] - baseLineReturn;
                } else {
                    dataPoint[line] = 0;
                }
            })

            // Bar chart data (Patrimônio) based on raw return 
            // the bars show absolute value size at each month.
            const rawCurrentReturn = myPortfolioReturnFull[dataIdx] / 100;
            const finalReturn = myPortfolioReturnFull[myPortfolioReturnFull.length - 1] / 100;
            const absoluteBase = patrimonioTotal / (1 + finalReturn);
            dataPoint.patrimonio = absoluteBase * (1 + rawCurrentReturn);

            return dataPoint;
        });

        return { chartData, monthsLabels: slicedLabels };
    }, [activeLines, patrimonioTotal, profileType, timeFilter, storeBuckets])

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
                <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-4 gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-1.5 text-[14px] font-semibold text-dash-text mb-2">
                            <TrendingUp className="w-4 h-4 text-dash-accent" /> Rentabilidade da Carteira (%)
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <div className="flex items-center bg-dash-surface-active rounded-lg p-1 border border-dash-border mr-2">
                                {(["1M", "YTD", "12M", "24M", "36M", "MAX"] as TimeFilter[]).map(tf => (
                                    <button
                                        key={tf}
                                        onClick={() => setTimeFilter(tf)}
                                        className={`px-3 py-1 text-[11px] font-medium rounded-md transition-all ${timeFilter === tf ? 'bg-white shadow-sm text-dash-text' : 'text-dash-text-muted hover:text-dash-text'}`}
                                    >
                                        {tf}
                                    </button>
                                ))}
                            </div>
                            <span className="text-[11.5px] text-dash-text-light">
                                Acumulado desde {monthsLabels[0] || "o início"}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-[11px]">
                        {(["CDI", "IPCA", "IBOV", "ABRIGO", "RITMO", "VISÃO", "OCEANO"] as Comparative[]).map(comp => (
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

                <div className="h-[280px] w-full mt-4">
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
