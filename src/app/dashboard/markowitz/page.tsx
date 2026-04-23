"use client";

import { useState, useMemo } from "react";
import { TrendingUp, Info } from "lucide-react";

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

const FUNDS = [
    { name: "Tesouro Selic", short: "Selic", cat: "RF", ret: 13.25, vol: 0.05, color: CATEGORY_COLORS["RF"] },
    { name: "ARX Fuji", short: "ARX Fuji", cat: "Créd HG", ret: 14.0, vol: 0.25, color: CATEGORY_COLORS["Créd HG"] },
    { name: "BNP Paribas Rubi", short: "BNP Rubi", cat: "Créd HG", ret: 14.2, vol: 0.18, color: CATEGORY_COLORS["Créd HG"] },
    { name: "Ibiuna Credit", short: "Ibiuna Cr", cat: "Créd Macro", ret: 15.5, vol: 6.2, color: CATEGORY_COLORS["Créd Macro"] },
    { name: "ARX Hedge Infra", short: "ARX Infra", cat: "Créd Infra", ret: 14.8, vol: 3.5, color: CATEGORY_COLORS["Créd Infra"] },
    { name: "JGP Corporate", short: "JGP Corp", cat: "Créd HG", ret: 14.5, vol: 0.4, color: CATEGORY_COLORS["Créd HG"] },
    { name: "Valora Guardian", short: "Valora G", cat: "Créd HG", ret: 15.0, vol: 0.5, color: CATEGORY_COLORS["Créd HG"] },
    { name: "Capitânia Yield", short: "Cap Yield", cat: "Créd HG", ret: 15.8, vol: 0.8, color: CATEGORY_COLORS["Créd HG"] },
    { name: "Augme 180", short: "Augme 180", cat: "Créd HG", ret: 16.5, vol: 1.5, color: CATEGORY_COLORS["Créd HG"] },
    { name: "Sparta/Kinea DI", short: "Sparta DI", cat: "Créd Infra", ret: 13.0, vol: 4.0, color: CATEGORY_COLORS["Créd Infra"] },
    { name: "Kinea Atlas", short: "Kinea Atl", cat: "Multi Macro", ret: 16.0, vol: 6.0, color: CATEGORY_COLORS["Multi Macro"] },
    { name: "Dahlia Total Return", short: "Dahlia TR", cat: "Multi LB", ret: 18.0, vol: 10.0, color: CATEGORY_COLORS["Multi LB"] },
    { name: "JGP Ecossistema", short: "JGP Eco", cat: "Multi Macro", ret: 15.0, vol: 6.5, color: CATEGORY_COLORS["Multi Macro"] },
    { name: "Truxt Long Bias", short: "Truxt LB", cat: "Multi LB", ret: 20.0, vol: 15.0, color: CATEGORY_COLORS["Multi LB"] },
    { name: "SPX Falcon", short: "SPX Falcon", cat: "Ações LB", ret: 22.0, vol: 18.0, color: CATEGORY_COLORS["Ações LB"] },
    { name: "Hix Capital HS", short: "Hix HS", cat: "Ações", ret: 25.0, vol: 22.0, color: CATEGORY_COLORS["Ações"] },
    { name: "Forpus Ações", short: "Forpus", cat: "Ações", ret: 24.0, vol: 21.0, color: CATEGORY_COLORS["Ações"] },
    { name: "Real Investor", short: "Real Inv", cat: "Ações", ret: 23.0, vol: 19.0, color: CATEGORY_COLORS["Ações"] },
];

const CORR_DATA = [
    [1.00, -0.00, 0.05, -0.03, 0.11, -0.02, -0.08, -0.05, 0.02, 0.00, -0.02, -0.14, 0.05, -0.10, -0.14, -0.14, -0.11, -0.12],
    [-0.00, 1.00, 0.75, 0.53, 0.45, 0.78, 0.71, 0.72, 0.72, 0.47, 0.17, 0.08, 0.14, 0.13, 0.04, 0.05, 0.05, -0.02],
    [0.05, 0.75, 1.00, 0.55, 0.54, 0.79, 0.75, 0.71, 0.76, 0.47, 0.07, 0.06, 0.04, 0.08, 0.01, -0.00, 0.01, -0.03],
    [-0.03, 0.53, 0.55, 1.00, 0.41, 0.50, 0.60, 0.56, 0.55, 0.49, 0.29, 0.26, 0.19, 0.21, 0.13, 0.13, 0.15, 0.09],
    [0.11, 0.45, 0.54, 0.41, 1.00, 0.51, 0.46, 0.45, 0.46, 0.68, 0.23, 0.08, 0.26, 0.16, 0.03, -0.04, 0.07, 0.04],
    [-0.02, 0.78, 0.79, 0.50, 0.51, 1.00, 0.77, 0.79, 0.69, 0.49, 0.12, 0.13, 0.11, 0.06, 0.00, -0.03, 0.02, -0.01],
    [-0.08, 0.71, 0.75, 0.60, 0.46, 0.77, 1.00, 0.76, 0.78, 0.49, 0.14, 0.11, 0.15, 0.10, 0.07, -0.01, 0.02, -0.04],
    [-0.05, 0.72, 0.71, 0.56, 0.45, 0.79, 0.76, 1.00, 0.66, 0.43, 0.08, 0.12, 0.08, 0.10, 0.10, -0.01, 0.05, 0.04],
    [0.02, 0.72, 0.76, 0.55, 0.46, 0.69, 0.78, 0.66, 1.00, 0.43, 0.08, 0.06, 0.08, 0.11, 0.10, 0.04, 0.08, 0.02],
    [0.00, 0.47, 0.47, 0.49, 0.68, 0.49, 0.49, 0.43, 0.43, 1.00, 0.23, 0.20, 0.18, 0.17, 0.11, 0.05, 0.06, 0.02],
    [-0.02, 0.17, 0.07, 0.29, 0.23, 0.12, 0.14, 0.08, 0.08, 0.23, 1.00, 0.48, 0.59, 0.50, 0.38, 0.37, 0.37, 0.34],
    [-0.14, 0.08, 0.06, 0.26, 0.08, 0.13, 0.11, 0.12, 0.06, 0.20, 0.48, 1.00, 0.39, 0.62, 0.76, 0.58, 0.60, 0.62],
    [0.05, 0.14, 0.04, 0.19, 0.26, 0.11, 0.15, 0.08, 0.08, 0.18, 0.59, 0.39, 1.00, 0.42, 0.43, 0.36, 0.28, 0.33],
    [-0.10, 0.13, 0.08, 0.21, 0.16, 0.06, 0.10, 0.10, 0.11, 0.17, 0.50, 0.62, 0.42, 1.00, 0.68, 0.57, 0.57, 0.64],
    [-0.14, 0.04, 0.01, 0.13, 0.03, 0.00, 0.07, 0.10, 0.10, 0.11, 0.38, 0.76, 0.43, 0.68, 1.00, 0.79, 0.75, 0.78],
    [-0.14, 0.05, -0.00, 0.13, -0.04, -0.03, -0.01, -0.01, 0.04, 0.05, 0.37, 0.58, 0.36, 0.57, 0.79, 1.00, 0.86, 0.78],
    [-0.11, 0.05, 0.01, 0.15, 0.07, 0.02, 0.02, 0.05, 0.08, 0.06, 0.37, 0.60, 0.28, 0.57, 0.75, 0.86, 1.00, 0.77],
    [-0.12, -0.02, -0.03, 0.09, 0.04, -0.01, -0.04, 0.04, 0.02, 0.02, 0.34, 0.62, 0.33, 0.64, 0.78, 0.78, 0.77, 1.00],
];

const PORTFOLIOS = [
    { name: "Abrigo (Geral)", vol: 0.48, ret: 13.30, type: "Geral", color: "#16a34a" },
    { name: "Ritmo (Geral)", vol: 2.68, ret: 15.40, type: "Geral", color: "#84cc16" },
    { name: "Visão (Geral)", vol: 5.93, ret: 17.98, type: "Geral", color: "#f97316" },
    { name: "Oceano (Geral)", vol: 6.81, ret: 18.43, type: "Geral", color: "#ef4444" },
    { name: "Abrigo (IQ)", vol: 0.31, ret: 13.35, type: "IQ", color: "#2563eb" },
    { name: "Ritmo (IQ)", vol: 1.66, ret: 12.96, type: "IQ", color: "#22d3ee" },
    { name: "Visão (IQ)", vol: 3.32, ret: 14.97, type: "IQ", color: "#eab308" },
    { name: "Oceano (IQ)", vol: 4.65, ret: 16.09, type: "IQ", color: "#dc2626" },
];

const FRONTIER = Array.from({ length: 40 }, (_, i) => {
    const t = i / 39;
    const vol = 0.1 + t * 20;
    const ret = 13.2 + Math.sqrt(vol) * 4.5 - vol * 0.02;
    return { vol, ret: Math.min(ret, 35) };
});

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
    const [selectedType, setSelectedType] = useState<string>("all");

    const filteredPortfolios = useMemo(() => {
        if (selectedType === "all") return PORTFOLIOS;
        return PORTFOLIOS.filter(p => p.type === selectedType);
    }, [selectedType]);

    const chartW = 700;
    const chartH = 420;
    const pad = { t: 30, r: 30, b: 50, l: 65 };
    const plotW = chartW - pad.l - pad.r;
    const plotH = chartH - pad.t - pad.b;
    const xMax = 24;
    const yMin = 8;
    const yMax = 36;

    const toX = (v: number) => pad.l + (v / xMax) * plotW;
    const toY = (r: number) => pad.t + ((yMax - r) / (yMax - yMin)) * plotH;

    const frontierPath = FRONTIER.map((p, i) =>
        `${i === 0 ? "M" : "L"}${toX(p.vol).toFixed(1)},${toY(p.ret).toFixed(1)}`
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
                            {["all", "Geral", "IQ"].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setSelectedType(t)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${selectedType === t
                                        ? "bg-dash-accent-light text-dash-accent border-dash-accent"
                                        : "bg-white text-dash-text-muted border-dash-border hover:bg-dash-surface-active hover:text-dash-text"
                                        }`}
                                >
                                    {t === "all" ? "Todas as Carteiras" : `Carteiras ${t}`}
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

                                    {/* Frontier area */}
                                    <path d={frontierPath + ` L${toX(FRONTIER[FRONTIER.length - 1].vol)},${toY(yMin)} L${toX(FRONTIER[0].vol)},${toY(yMin)} Z`}
                                        fill="#3b82f6" opacity={0.06} />
                                    <path d={frontierPath} fill="none" stroke="#2563EB" strokeWidth={2.5} />

                                    {/* CDI line */}
                                    <line x1={pad.l} y1={toY(13.25)} x2={chartW - pad.r} y2={toY(13.25)} stroke="#10B981" strokeWidth={1.5} strokeDasharray="6,4" opacity={0.6} />
                                    <text x={chartW - pad.r - 4} y={toY(13.25) - 5} textAnchor="end" fill="#059669" fontSize={9} fontWeight="600" opacity={0.8}>CDI ~13,25%</text>

                                    {/* Fund dots */}
                                    {FUNDS.map((f, i) => (
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
                                {FUNDS.map((f, j) => (
                                    <div key={j} className="w-[38px] shrink-0 relative mt-16 mb-2">
                                        <div className="absolute bottom-0 text-[10px] left-1/2 font-semibold text-dash-text-light origin-bottom-left -rotate-45 whitespace-nowrap">
                                            {f.short}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {FUNDS.map((fi, i) => (
                                <div key={i} className="flex items-center">
                                    <div className="w-[120px] text-[10px] font-semibold text-dash-text text-right pr-3 truncate shrink-0">
                                        {fi.short}
                                    </div>
                                    {FUNDS.map((_, j) => {
                                        const val = CORR_DATA[i][j];
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
                                    {FUNDS.sort((a, b) => a.vol - b.vol).map((f, i) => {
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
