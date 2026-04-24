"use client";

import { useState, useMemo } from "react";
import { TrendingUp, Info } from "lucide-react";
import { MARKOWITZ_DATA } from "@/config/markowitz-data";

// ARVO's color mapping for categories
const CATEGORY_COLORS: Record<string, string> = {
    "RF": "#6b7280",          // bg-gray-500
    "Créd HG": "#3b82f6",       // bg-blue-500
    "Créd Macro": "#8b5cf6",    // bg-violet-500
    "Créd Infra": "#06b6d4",    // bg-cyan-500
    "Multi Macro": "#f59e0b",   // bg-amber-500
    "Multi LB": "#ef4444",      // bg-red-500
    "Ações LB": "#dc2626",      // bg-red-600
    "Ações Puro": "#b91c1c",    // bg-red-700
    "Ações": "#b91c1c",         // bg-red-700
};

const fundCategories: Record<string, any> = {
    "Tesouro Selic": { short: "Selic", cat: "RF" },
    "ARX Fuji": { short: "ARX Fuji", cat: "Créd HG" },
    "BNP Rubi": { short: "BNP Rubi", cat: "Créd HG" },
    "Valora Guardian A": { short: "Valora G", cat: "Créd HG" },
    "Augme 180": { short: "Augme 180", cat: "Créd HG" },
    "Capitânia Yield 120": { short: "Cap Yield", cat: "Créd HG" },
    "Ibiuna Credit": { short: "Ibiuna Cr", cat: "Créd Macro" },
    "ARX Hedge Infra": { short: "ARX Infra", cat: "Créd Infra" },
    "Sparta Deb Inc": { short: "Sparta Deb", cat: "Créd Infra" },
    "Kinea Atlas": { short: "Kinea Atl", cat: "Multi Macro" },
    "Dahlia Total Return": { short: "Dahlia TR", cat: "Multi LB" },
    "Truxt Long Bias": { short: "Truxt LB", cat: "Multi LB" },
    "SPX Falcon": { short: "SPX Falcon", cat: "Ações LB" },
    "Dynamo Cougar": { short: "Dynamo", cat: "Ações" },
    "Hix Capital HS": { short: "Hix HS", cat: "Ações" },
    "Forpus Ações": { short: "Forpus", cat: "Ações" },
    "Real Investor": { short: "Real Inv", cat: "Ações" },
    "JGP Ecossistema": { short: "JGP Eco", cat: "Multi Macro" },
};

function buildFunds(type: "geral" | "iq") {
    const d = MARKOWITZ_DATA[type];
    return d.funds.map((name: string, i: number) => {
        const info = fundCategories[name] || { short: name, cat: "RF" };
        return {
            name,
            short: info.short,
            cat: info.cat,
            ret: d.annReturn[i] * 100,
            vol: d.annVol[i] * 100,
            color: CATEGORY_COLORS[info.cat] || CATEGORY_COLORS["RF"]
        };
    });
}

const FUNDS_GERAL = buildFunds("geral");
const FUNDS_IQ = buildFunds("iq");
const CORR_GERAL = MARKOWITZ_DATA.geral.corr;
const CORR_IQ = MARKOWITZ_DATA.iq.corr;

const PORTFOLIOS = [
    { name: "Abrigo (Geral)", vol: MARKOWITZ_DATA.geral.presets.Abrigo.vol * 100, ret: MARKOWITZ_DATA.geral.presets.Abrigo.ret * 100, type: "Geral", color: "#16a34a" },
    { name: "Ritmo (Geral)", vol: MARKOWITZ_DATA.geral.presets.Ritmo.vol * 100, ret: MARKOWITZ_DATA.geral.presets.Ritmo.ret * 100, type: "Geral", color: "#84cc16" },
    { name: "Visão (Geral)", vol: MARKOWITZ_DATA.geral.presets["Visão"].vol * 100, ret: MARKOWITZ_DATA.geral.presets["Visão"].ret * 100, type: "Geral", color: "#f97316" },
    { name: "Oceano (Geral)", vol: MARKOWITZ_DATA.geral.presets.Oceano.vol * 100, ret: MARKOWITZ_DATA.geral.presets.Oceano.ret * 100, type: "Geral", color: "#ef4444" },
    { name: "Abrigo (IQ)", vol: MARKOWITZ_DATA.iq.presets.Abrigo.vol * 100, ret: MARKOWITZ_DATA.iq.presets.Abrigo.ret * 100, type: "IQ", color: "#2563eb" },
    { name: "Ritmo (IQ)", vol: MARKOWITZ_DATA.iq.presets.Ritmo.vol * 100, ret: MARKOWITZ_DATA.iq.presets.Ritmo.ret * 100, type: "IQ", color: "#22d3ee" },
    { name: "Visão (IQ)", vol: MARKOWITZ_DATA.iq.presets["Visão"].vol * 100, ret: MARKOWITZ_DATA.iq.presets["Visão"].ret * 100, type: "IQ", color: "#eab308" },
    { name: "Oceano (IQ)", vol: MARKOWITZ_DATA.iq.presets.Oceano.vol * 100, ret: MARKOWITZ_DATA.iq.presets.Oceano.ret * 100, type: "IQ", color: "#dc2626" },
];

function getCorrelationColor(val: number) {
    if (val >= 0.7) return "bg-red-700 text-white border-red-800";
    if (val >= 0.5) return "bg-red-500 text-white border-red-600";
    if (val >= 0.3) return "bg-red-300 text-red-900 border-red-400";
    if (val >= 0.1) return "bg-red-100 text-red-900 border-red-200";
    if (val >= -0.1) return "bg-gray-100 text-gray-500 border-gray-200";
    if (val >= -0.3) return "bg-blue-100 text-blue-900 border-blue-200";
    return "bg-blue-500 text-white border-blue-600";
}

export default function MarkowitzDashboardPage() {
    const [tab, setTab] = useState<"frontier" | "correlation" | "table">("frontier");
    const [hoveredFund, setHoveredFund] = useState<number | null>(null);
    const [hoveredPort, setHoveredPort] = useState<number | null>(null);
    const [selectedType, setSelectedType] = useState<"Geral" | "IQ">("Geral");

    const activeFunds = selectedType === "Geral" ? FUNDS_GERAL : FUNDS_IQ;
    const activeCorr = selectedType === "Geral" ? CORR_GERAL : CORR_IQ;
    const activeFrontier = selectedType === "Geral" ? MARKOWITZ_DATA.geral.frontier : MARKOWITZ_DATA.iq.frontier;
    const activeMonteCarlo = selectedType === "Geral" ? MARKOWITZ_DATA.geral.monteCarlo : MARKOWITZ_DATA.iq.monteCarlo;

    const filteredPortfolios = useMemo(() => {
        return PORTFOLIOS.filter(p => p.type === selectedType);
    }, [selectedType]);

    // Compute dynamic min/max scaling
    const allVols = [
        ...activeMonteCarlo.vols.map((v: number) => v * 100),
        ...filteredPortfolios.map(p => p.vol),
        ...activeFunds.map(f => f.vol)
    ];
    const allRets = [
        ...activeMonteCarlo.rets.map((r: number) => r * 100),
        ...filteredPortfolios.map(p => p.ret),
        ...activeFunds.map(f => f.ret)
    ];
    const xMaxData = Math.max(...allVols);
    const yMaxData = Math.max(...allRets);
    const yMinData = Math.min(...allRets);

    const xMax = Math.ceil(xMaxData / 5) * 5 + 1;
    const yMin = Math.max(0, Math.floor(yMinData / 5) * 5 - 2);
    const yMax = Math.ceil(yMaxData / 5) * 5 + 1;

    const chartW = 700;
    const chartH = 420;
    const pad = { t: 30, r: 30, b: 50, l: 65 };
    const plotW = chartW - pad.l - pad.r;
    const plotH = chartH - pad.t - pad.b;

    const toX = (v: number) => pad.l + (v / xMax) * plotW;
    const toY = (r: number) => pad.t + ((yMax - r) / (yMax - yMin)) * plotH;

    const frontierPath = activeFrontier.rets.map((r: number, i: number) =>
        `${i === 0 ? "M" : "L"}${toX(activeFrontier.vols[i] * 100).toFixed(1)},${toY(r * 100).toFixed(1)}`
    ).join(" ");

    const cellSize = 38;

    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12 pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-dash-text flex items-center gap-3">
                        <TrendingUp className="h-6 w-6 text-dash-accent" />
                        Análise de Markowitz
                    </h1>
                    <p className="text-sm text-dash-text-light mt-1">
                        Fronteira eficiente e métricas de risco da curadoria de fundos ARVO
                    </p>
                </div>
            </div>

            <div className="bg-dash-surface border border-dash-border p-1.5 rounded-[14px] flex flex-wrap gap-2 w-full md:w-max shadow-sm">
                {[
                    { id: "frontier", label: "Fronteira Eficiente" },
                    { id: "correlation", label: "Matriz de Correlação" },
                    { id: "table", label: "Tabela de Fundos" },
                ].map(t => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id as any)}
                        className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${tab === t.id
                            ? "bg-dash-accent text-white shadow-md scale-[1.02]"
                            : "text-dash-text-muted hover:text-dash-text hover:bg-dash-surface-active"
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="bg-dash-surface rounded-[24px] p-6 lg:p-8 overflow-hidden shadow-sm border border-dash-border">
                {tab === "frontier" && (
                    <div>
                        <div className="flex gap-2 mb-6">
                            {(["Geral", "IQ"] as const).map(t => (
                                <button
                                    key={t}
                                    onClick={() => setSelectedType(t)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${selectedType === t
                                        ? "bg-dash-accent-light text-dash-accent border-dash-accent"
                                        : "bg-white text-dash-text-muted border-dash-border hover:bg-dash-surface-active hover:text-dash-text"
                                        }`}
                                >
                                    Carteiras {t}
                                </button>
                            ))}
                        </div>

                        <div className="w-full overflow-x-auto bg-[#F8FAFC] border border-dash-border/60 rounded-2xl p-4 md:p-6 mb-6">
                            <div className="min-w-[700px]">
                                <svg width="100%" viewBox={`0 0 ${chartW} ${chartH}`} style={{ display: "block" }}>
                                    {/* Grid */}
                                    {[0, 4, 8, 12, 16, 20, 24].map(v => (
                                        <g key={`gx${v}`}>
                                            <line x1={toX(v)} y1={pad.t} x2={toX(v)} y2={chartH - pad.b} stroke="#E2E8F0" strokeWidth={1} />
                                            <text x={toX(v)} y={chartH - pad.b + 18} textAnchor="middle" fill="#94A3B8" fontSize={10} fontWeight="500">{v}%</text>
                                        </g>
                                    ))}
                                    {[10, 15, 20, 25, 30, 35].map(r => (
                                        <g key={`gy${r}`}>
                                            <line x1={pad.l} y1={toY(r)} x2={chartW - pad.r} y2={toY(r)} stroke="#E2E8F0" strokeWidth={1} />
                                            <text x={pad.l - 8} y={toY(r) + 4} textAnchor="end" fill="#94A3B8" fontSize={10} fontWeight="500">{r}%</text>
                                        </g>
                                    ))}

                                    {/* Axis labels */}
                                    <text x={chartW / 2} y={chartH - 5} textAnchor="middle" fill="#64748B" fontSize={11} fontWeight={600} letterSpacing="0.05em">VOLATILIDADE ANUALIZADA</text>
                                    <text x={14} y={chartH / 2} textAnchor="middle" fill="#64748B" fontSize={11} fontWeight={600} letterSpacing="0.05em" transform={`rotate(-90, 14, ${chartH / 2})`}>RETORNO ESPERADO</text>

                                    {/* Frontier area fill */}
                                    <path d={frontierPath + ` L${toX(activeFrontier.vols[activeFrontier.vols.length - 1] * 100)},${toY(yMin)} L${toX(activeFrontier.vols[0] * 100)},${toY(yMin)} Z`}
                                        fill="#3b82f6" opacity={0.06} />

                                    {/* Monte Carlo scatter points */}
                                    {activeMonteCarlo.vols.map((v: number, i: number) => (
                                        <circle
                                            key={`mc-${i}`}
                                            cx={toX(v * 100)}
                                            cy={toY(activeMonteCarlo.rets[i] * 100)}
                                            r={1.5}
                                            fill="#cbd5e1"
                                            opacity={0.3}
                                        />
                                    ))}

                                    {/* Frontier line */}
                                    <path d={frontierPath} fill="none" stroke="#2563EB" strokeWidth={2.5} />

                                    {/* CDI line */}
                                    <line x1={pad.l} y1={toY(activeFunds[0]?.ret || 13.25)} x2={chartW - pad.r} y2={toY(activeFunds[0]?.ret || 13.25)} stroke="#10B981" strokeWidth={1.5} strokeDasharray="6,4" opacity={0.6} />
                                    <text x={chartW - pad.r - 4} y={toY(activeFunds[0]?.ret || 13.25) - 5} textAnchor="end" fill="#059669" fontSize={9} fontWeight="600" opacity={0.8}>CDI</text>

                                    {/* Fund dots */}
                                    {activeFunds.map((f, i) => (
                                        <g key={i} onMouseEnter={() => setHoveredFund(i)} onMouseLeave={() => setHoveredFund(null)}>
                                            <circle cx={toX(f.vol)} cy={toY(f.ret)} r={hoveredFund === i ? 6 : 4}
                                                fill={f.color} opacity={hoveredFund === i ? 1 : 0.6} stroke="#fff" strokeWidth={1}
                                                style={{ transition: "all 0.15s", cursor: "pointer" }} />
                                            {hoveredFund === i && (
                                                <g>
                                                    <rect x={toX(f.vol) + 10} y={toY(f.ret) - 30} width={140} height={44} rx={8} fill="#ffffff" stroke="#E2E8F0" style={{ filter: 'drop-shadow(0 4px 6px -1px rgb(0 0 0 / 0.1))' }} />
                                                    <text x={toX(f.vol) + 18} y={toY(f.ret) - 14} fill="#0F172A" fontSize={10} fontWeight={700}>{f.short}</text>
                                                    <text x={toX(f.vol) + 18} y={toY(f.ret) + 2} fill="#64748B" fontSize={9}>Vol: {f.vol.toFixed(2)}% | Ret: {f.ret.toFixed(1)}%</text>
                                                </g>
                                            )}
                                        </g>
                                    ))}

                                    {/* Portfolio dots */}
                                    {filteredPortfolios.map((p, i) => {
                                        const isHov = hoveredPort === i;
                                        return (
                                            <g key={`p${i}`} onMouseEnter={() => setHoveredPort(i)} onMouseLeave={() => setHoveredPort(null)} style={{ cursor: "pointer" }}>
                                                <circle cx={toX(p.vol)} cy={toY(p.ret)} r={isHov ? 10 : 7}
                                                    fill={p.color} stroke="#fff" strokeWidth={isHov ? 2.5 : 1.5}
                                                    style={{ transition: "all 0.15s" }} />
                                                <text x={toX(p.vol) + 12} y={toY(p.ret) + 4} fill="#334155" fontSize={9} fontWeight={700}>{p.name}</text>
                                                {isHov && (
                                                    <g>
                                                        <rect x={toX(p.vol) - 75} y={toY(p.ret) - 50} width={150} height={40} rx={8} fill="#ffffff" stroke={p.color} strokeWidth={2} style={{ filter: 'drop-shadow(0 4px 6px -1px rgb(0 0 0 / 0.1))' }} />
                                                        <text x={toX(p.vol)} y={toY(p.ret) - 32} textAnchor="middle" fill="#0F172A" fontSize={11} fontWeight={700}>
                                                            Vol: {p.vol.toFixed(2)}% | Ret: {p.ret.toFixed(2)}%
                                                        </text>
                                                    </g>
                                                )}
                                            </g>
                                        );
                                    })}
                                </svg>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-2">
                            <div className="bg-[#F8FAFC] border border-dash-border/60 rounded-xl p-4 flex-1">
                                <div className="text-[10px] font-bold text-dash-text-light mb-3 uppercase tracking-widest">Legenda Fundos</div>
                                <div className="flex flex-wrap gap-x-4 gap-y-2">
                                    {Object.entries(CATEGORY_COLORS).map(([label, color]) => (
                                        <div key={label} className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                                            <span className="text-xs font-medium text-dash-text-muted">{label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {tab === "correlation" && (
                    <div className="overflow-x-auto border border-dash-border/60 rounded-xl">
                        <div className="min-w-max p-4 bg-white">
                            <div className="flex">
                                <div className="w-[120px] shrink-0" />
                                {activeFunds.map((f, j) => (
                                    <div key={j} className="w-[38px] shrink-0 relative mt-16 mb-2">
                                        <div className="absolute bottom-0 text-[10px] left-1/2 font-semibold text-dash-text-light origin-bottom-left -rotate-45 whitespace-nowrap">
                                            {f.short}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {activeFunds.map((fi, i) => (
                                <div key={i} className="flex items-center">
                                    <div className="w-[120px] text-[10px] font-semibold text-dash-text text-right pr-3 truncate shrink-0">
                                        {fi.short}
                                    </div>
                                    {activeFunds.map((_, j) => {
                                        const val = activeCorr[i][j];
                                        return (
                                            <div key={j} className={`w-[38px] h-[34px] flex items-center justify-center text-[9px] font-bold border-l border-t shrink-0 ${getCorrelationColor(val)}`}>
                                                {val.toFixed(2)}
                                            </div>
                                        );
                                    })}
                                    <div className="w-px h-[34px] border-l border-dash-border/60" />
                                </div>
                            ))}
                            <div className="flex w-full mt-0 border-t border-dash-border/60" />

                            <div className="flex items-center mt-6 gap-3 justify-center">
                                <span className="text-[10px] font-bold text-dash-text-light">-0.3</span>
                                <div className="flex rounded-md overflow-hidden ring-1 ring-dash-border">
                                    {["bg-blue-500", "bg-blue-100", "bg-gray-100", "bg-red-100", "bg-red-300", "bg-red-500", "bg-red-700"].map((c, i) => (
                                        <div key={i} className={`w-8 h-3.5 ${c}`} />
                                    ))}
                                </div>
                                <span className="text-[10px] font-bold text-dash-text-light">+1.0</span>
                            </div>
                        </div>
                    </div>
                )}

                {tab === "table" && (
                    <div>
                        <div className="overflow-x-auto rounded-xl border border-dash-border/60 bg-white">
                            <table className="w-full text-left text-sm text-dash-text">
                                <thead className="bg-[#F8FAFC] text-[11px] uppercase tracking-wider text-dash-text-light">
                                    <tr>
                                        <th className="px-5 py-3.5 font-bold border-b border-dash-border">Fundo</th>
                                        <th className="px-5 py-3.5 font-bold border-b border-dash-border">Categoria</th>
                                        <th className="px-5 py-3.5 font-bold border-b border-dash-border">Ret. (% a.a.)</th>
                                        <th className="px-5 py-3.5 font-bold border-b border-dash-border">Vol. (% a.a.)</th>
                                        <th className="px-5 py-3.5 font-bold border-b border-dash-border">Sharpe</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-dash-border/60">
                                    {activeFunds.sort((a, b) => a.vol - b.vol).map((f, i) => {
                                        const sharpe = f.vol > 0 ? ((f.ret - 13.25) / f.vol).toFixed(2) : "—";
                                        return (
                                            <tr key={i} className="hover:bg-dash-surface-active transition-colors">
                                                <td className="px-5 py-3 flex items-center gap-2.5 font-semibold">
                                                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: f.color }} />
                                                    {f.name}
                                                </td>
                                                <td className="px-5 py-3 text-dash-text-muted text-xs font-medium">{f.cat}</td>
                                                <td className="px-5 py-3 text-emerald-600 font-bold">{f.ret.toFixed(1)}%</td>
                                                <td className="px-5 py-3 font-semibold" style={{ color: f.vol > 10 ? '#EF4444' : f.vol > 3 ? '#F59E0B' : '#64748B' }}>
                                                    {f.vol.toFixed(2)}%
                                                </td>
                                                <td className="px-5 py-3 font-semibold text-dash-text-light">{sharpe}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <h3 className="text-sm font-bold text-dash-text mt-8 mb-4 flex items-center gap-2">
                            Carteiras — Risco vs Retorno
                        </h3>
                        <div className="overflow-x-auto rounded-xl border border-dash-border/60 bg-white">
                            <table className="w-full text-left text-sm text-dash-text">
                                <thead className="bg-[#F8FAFC] text-[11px] uppercase tracking-wider text-dash-text-light">
                                    <tr>
                                        <th className="px-5 py-3.5 font-bold border-b border-dash-border">Carteira</th>
                                        <th className="px-5 py-3.5 font-bold border-b border-dash-border">Tipo</th>
                                        <th className="px-5 py-3.5 font-bold border-b border-dash-border">Vol (%)</th>
                                        <th className="px-5 py-3.5 font-bold border-b border-dash-border">Ret (%)</th>
                                        <th className="px-5 py-3.5 font-bold border-b border-dash-border">Sharpe</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-dash-border/60">
                                    {PORTFOLIOS.sort((a, b) => a.vol - b.vol).map((p, i) => (
                                        <tr key={i} className="hover:bg-dash-surface-active transition-colors">
                                            <td className="px-5 py-3 font-bold" style={{ color: p.color }}>
                                                {p.name}
                                            </td>
                                            <td className="px-5 py-3 text-dash-text-muted text-xs font-semibold">{p.type}</td>
                                            <td className="px-5 py-3 text-amber-600 font-bold">{p.vol.toFixed(2)}%</td>
                                            <td className="px-5 py-3 text-emerald-600 font-bold">{p.ret.toFixed(2)}%</td>
                                            <td className="px-5 py-3 font-semibold text-dash-text-light">
                                                {p.vol > 0 ? ((p.ret - 13.25) / p.vol).toFixed(2) : "—"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <div className="mt-8 p-3.5 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-900 leading-relaxed font-medium">
                        <span className="font-bold">Aviso Importante:</span> Dados simulados com base em estimativas de volatilidade e correlação por categoria de fundo.
                        Para análise precisa, recomenda-se substituir por séries de cotas diárias reais (CVM, Quantum, Comdinheiro).
                        Rentabilidade passada não é garantia de retorno futuro.
                    </p>
                </div>
            </div>
        </div>
    );
}
