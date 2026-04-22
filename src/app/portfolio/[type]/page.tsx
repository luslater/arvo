"use client"

import { use, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

import { FUNDS_LIBRARY, getSuggestedAllocations, type StepKey } from "@/config/portfolios"
import { MONTHLY_RETURNS } from "@/config/funds-monthly"
import { OCEANO_INFO } from "@/lib/oceano-info"
import { getProfileDescription } from "@/lib/questionnaire"
import { PROFILE_BANDS, STEP_ORDER } from "@/app/escada/arvo-store-v3"

type PortfolioType = "ABRIGO" | "RITMO" | "VISÃO" | "OCEANO"

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const fmt = (v: number) => BRL.format(isFinite(v) ? v : 0);

export default function PortfolioDetailPage({ params }: { params: Promise<{ type: string }> }) {
    const { type } = use(params)
    const decodedType = decodeURIComponent(type)
    const rawType = decodedType.toUpperCase()
    const portfolioType = (rawType === "VISAO" ? "VISÃO" : rawType) as PortfolioType

    // For demonstration, assume a standard R$ 100.000 to show volumes, or we just display % weights.
    // The user requested: "exibir apenas a lista de fundos que compõem a carteira recomendada (com suas % e rentabilidades)"
    // We will list the funds and their weights.

    const profileInfo = portfolioType === "OCEANO"
        ? OCEANO_INFO
        : getProfileDescription(portfolioType as "ABRIGO" | "RITMO" | "VISÃO")

    const colorClasses = {
        ABRIGO: "from-[#C9B8A3] to-[#8B7355]",
        RITMO: "from-[#A8C5A1] to-[#5D8C54]",
        VISÃO: "from-[#A3BFD9] to-[#5687AF]",
        OCEANO: "from-[#89C4D4] to-[#3D96AB]",
    }

    const brandColors = {
        ABRIGO: "#8B7355",
        RITMO: "#5D8C54",
        VISÃO: "#5687AF",
        OCEANO: "#3D96AB",
    }

    // MAP THE ACTUAL ALLOCATIONS FROM THE DATABASE FOR THIS PROFILE
    const profileKey = portfolioType === "ABRIGO" ? "conservador" :
        portfolioType === "RITMO" ? "moderado" :
            portfolioType === "VISÃO" ? "arrojado" : null;

    const bands = profileKey ? PROFILE_BANDS[profileKey as keyof typeof PROFILE_BANDS] : null;

    // We assume IQ=false for the public gallery showcase by default
    const suggestionsByBucket = getSuggestedAllocations(false);

    const allocations = useMemo(() => {
        let list: any[] = [];

        // SPECIAL CASE: OCEANO (Global) - Show its specific bucket at 100%
        if (portfolioType === "OCEANO") {
            const fundList = suggestionsByBucket["oceano"];
            if (fundList) {
                for (const item of fundList) {
                    const fund = FUNDS_LIBRARY.find(f => f.id === item.fundId);
                    if (!fund) continue;
                    list.push({ fund, absolutePct: item.weight, hist: getFundPerf(fund.id) });
                }
            }
            return list.sort((a, b) => b.absolutePct - a.absolutePct);
        }

        if (!bands) return list;

        for (const bKey of STEP_ORDER) {
            const fundList = suggestionsByBucket[bKey];
            if (!fundList) continue;

            const targetPct = bKey === "reserva" ? 10 : (bands[bKey as Exclude<StepKey, "reserva">]?.target ?? 0);
            if (targetPct === 0) continue;

            for (const item of fundList) {
                const fund = FUNDS_LIBRARY.find(f => f.id === item.fundId);
                if (!fund) continue;

                const absolutePct = (targetPct * item.weight) / 100;

                list.push({
                    fund,
                    absolutePct,
                    hist: getFundPerf(fund.id)
                })
            }
        }
        return list.sort((a, b) => b.absolutePct - a.absolutePct);
    }, [bands, suggestionsByBucket, portfolioType]);

    // Helper for fund performance
    function getFundPerf(fundId: string) {
        const arr = MONTHLY_RETURNS.funds[fundId as keyof typeof MONTHLY_RETURNS.funds];
        const getComp = (months: number) => {
            if (!arr || arr.length < months) return 0;
            let accum = 1;
            const startIndex = arr.length - months;
            for (let i = startIndex; i < arr.length; i++) {
                accum *= (1 + arr[i]);
            }
            return (accum - 1) * 100;
        };
        return {
            m1: getComp(1),
            m12: getComp(12),
            m36: getComp(36),
        };
    }

    // COMPUTE DYNAMIC CHART
    const chartData = useMemo(() => {
        let currentAccum = 0;
        let cdiAccum = 0;
        const totalAllocatedPct = allocations.reduce((sum, item) => sum + item.absolutePct, 0);

        if (totalAllocatedPct === 0) return [];

        const normalizedAllocations = allocations.map(a => ({
            fundId: a.fund.id,
            weight: a.absolutePct / totalAllocatedPct
        }));

        const result = [];

        const monthsLabels = MONTHLY_RETURNS.monthsLabels;

        // We evaluate only the last 36 months to make the chart readable
        const sliceLength = 36;
        const startIndex = monthsLabels.length - sliceLength;

        for (let m = startIndex; m < monthsLabels.length; m++) {
            let monthBlendDecimal = 0;
            for (const alloc of normalizedAllocations) {
                let r = MONTHLY_RETURNS.funds[alloc.fundId as keyof typeof MONTHLY_RETURNS.funds]?.[m];
                if (typeof r !== "number") r = MONTHLY_RETURNS.macros.cdi[m] || 0;
                monthBlendDecimal += alloc.weight * r;
            }

            currentAccum = ((1 + currentAccum / 100) * (1 + monthBlendDecimal) - 1) * 100;

            // CDI Baseline
            const cdiVal = MONTHLY_RETURNS.macros.cdi[m] || 0;
            cdiAccum = ((1 + cdiAccum / 100) * (1 + cdiVal) - 1) * 100;

            result.push({
                month: monthsLabels[m],
                "Carteira ARVO": currentAccum,
                "CDI": cdiAccum,
            });
        }
        return result;
    }, [allocations]);

    return (
        <div className="min-h-screen bg-white p-6">
            <ThemeToggle />

            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Link href="/dashboard/portfolios">
                        <Button variant="ghost">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Voltar para Portfólios
                        </Button>
                    </Link>
                </div>

                {/* Portfolio Header */}
                <div className="text-center space-y-4">
                    <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${colorClasses[portfolioType]} flex items-center justify-center text-5xl`}>
                        {profileInfo.icon}
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 ">{profileInfo.subtitle}</p>
                        <h1 className="text-4xl font-light">Carteira {profileInfo.title}</h1>
                        <p className="text-gray-600  mt-2 max-w-2xl mx-auto">
                            {profileInfo.description}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* Fund List */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="font-serif text-xl mb-1 text-gray-900">Composição Recomendada</h3>
                        <p className="text-[13px] text-gray-500 mb-5">Ativos selecionados pela inteligência ARVO para o seu perfil.</p>

                        <div className="space-y-2">
                            {allocations.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                                    <div className="flex-1 min-w-0 pr-4">
                                        <p className="font-semibold text-[13px] text-gray-900 truncate">{item.fund.shortName || item.fund.name}</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[11px] text-gray-500">{item.fund.type}</span>
                                            <span className={`text-[10px] font-medium tracking-wide ${item.hist.m12 >= 0 ? "text-emerald-600" : "text-amber-600"}`}>
                                                12M: {item.hist.m12 > 0 ? "+" : ""}{item.hist.m12.toFixed(2)}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <span className="font-bold text-[14px] text-gray-900">{item.absolutePct.toFixed(1)}%</span>
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-0.5">da carteira</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col">
                        <h3 className="font-serif text-xl mb-1 text-gray-900">Performance Oficial Histórica</h3>
                        <p className="text-[13px] text-gray-500 mb-6">Rentabilidade calculada a partir dos dados reais dos constituintes, considerando os exatos pesos da carteira modelo rebalanceada.</p>

                        <div className="flex-1 min-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        stroke="#9CA3AF"
                                        style={{ fontSize: '10px' }}
                                        tickMargin={10}
                                        minTickGap={20}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        stroke="#9CA3AF"
                                        style={{ fontSize: '10px' }}
                                        tickFormatter={(value) => `${value.toFixed(0)}%`}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        formatter={(value: number) => [`${value.toFixed(2)}%`, undefined]}
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                        }}
                                        itemStyle={{
                                            padding: '2px 0'
                                        }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                    <Line
                                        type="monotone"
                                        dataKey="Carteira ARVO"
                                        stroke={brandColors[portfolioType]}
                                        strokeWidth={3}
                                        dot={false}
                                        activeDot={{ r: 5 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="CDI"
                                        stroke="#9CA3AF"
                                        strokeWidth={1.5}
                                        strokeDasharray="4 4"
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
