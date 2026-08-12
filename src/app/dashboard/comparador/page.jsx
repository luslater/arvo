"use client"

import { useState, useMemo, Suspense } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, AreaChart, Area, ComposedChart
} from "recharts";
import { Scale, CheckCircle, Plus, Trash2, Shield, TrendingUp, HelpCircle, Eye, Settings2 } from "lucide-react";

// ARVO Theme Tokens
const T = {
  bg: "#f6f4ef",
  card: "#ffffff",
  border: "#e4e0d7",
  borderLight: "#f0ece1",
  text: "#123044",
  textMuted: "#667085",
  textDim: "#475467",
  accent: "#4fa080",
  accentSoft: "#4fa08018",
  blue: "#3B82F6",
  purple: "#8B5CF6",
  amber: "#F59E0B",
  red: "#EF4444",
  success: "#10B981",
};

const PALETTE = [T.accent, "#C2551B", "#2B5FAA", "#8A4FBF", "#B3902A", "#C13B5E", "#3A8FA3", "#7A6A4F"];

const fmtBRL = (v) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const fmtBRL2 = (v) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtPct = (v, d = 2) => `${v.toFixed(d).replace(".", ",")}%`;

const annualToMonthly = (a) => Math.pow(1 + a / 100, 1 / 12) - 1;

// Tabela regressiva padrão
const tableLP = (months) => {
  const days = months * 30;
  if (days <= 180) return 0.225;
  if (days <= 360) return 0.2;
  if (days <= 720) return 0.175;
  return 0.15;
};
const tableCP = (months) => (months * 30 <= 180 ? 0.225 : 0.2);

const ETF_RF_RATES = { curta: 0.25, media: 0.20, longa: 0.15 };
const ETF_RF_LABELS = {
  curta: "Duração ≤ 180 dias → IR 25%",
  media: "Duração 181–720 dias → IR 20%",
  longa: "Duração > 720 dias → IR 15%",
};

// Previdência Regressiva Exclusiva
const prevRegressiva = (m) => {
  if (m <= 24) return 0.35;
  if (m <= 48) return 0.30;
  if (m <= 72) return 0.25;
  if (m <= 96) return 0.20;
  if (m <= 120) return 0.15;
  return 0.10;
};

const PREV_TRIB_OPTIONS = [
  { value: "reg", label: "Regressiva: 35% → 10% (10% após 10 anos)" },
  { value: "p275", label: "Progressiva · IRPF 27,5%" },
  { value: "p225", label: "Progressiva · IRPF 22,5%" },
  { value: "p15", label: "Progressiva · IRPF 15%" },
  { value: "p75", label: "Progressiva · IRPF 7,5%" },
  { value: "p0", label: "Progressiva · Isento" },
];

const prevAliq = (trib, m) => {
  switch (trib) {
    case "reg": return prevRegressiva(m);
    case "p275": return 0.275;
    case "p225": return 0.225;
    case "p15": return 0.15;
    case "p75": return 0.075;
    case "p0": return 0;
    default: return prevRegressiva(m);
  }
};

const TYPES = {
  pre: {
    label: "CDB Prefixado",
    regime: "Tabela regressiva 22,5% → 15%",
    fields: [{ kind: "slider", key: "rate", label: "Taxa", unit: "% a.a.", min: 1, max: 25, step: 0.1, def: 13 }],
  },
  cdi: {
    label: "CDB % do CDI",
    regime: "Tabela regressiva 22,5% → 15%",
    fields: [{ kind: "slider", key: "pct", label: "% do CDI", unit: "%", min: 70, max: 150, step: 1, def: 110 }],
  },
  ipca: {
    label: "CDB IPCA+",
    regime: "Tabela regressiva 22,5% → 15%",
    fields: [{ kind: "slider", key: "real", label: "Juro real", unit: "% a.a.", min: 0, max: 12, step: 0.1, def: 7 }],
  },
  lci: {
    label: "LCI/LCA % do CDI",
    regime: "Isento de IR para PF",
    fields: [{ kind: "slider", key: "pct", label: "% do CDI", unit: "%", min: 70, max: 120, step: 1, def: 93 }],
  },
  fundoLP: {
    label: "Fundo Longo Prazo",
    regime: "Come-cotas 15% + Tabela Regressiva",
    fields: [{ kind: "slider", key: "rate", label: "Rentab. cota líq. taxas", unit: "% a.a.", min: 1, max: 30, step: 0.1, def: 13 }],
  },
  fundoCP: {
    label: "Fundo Curto Prazo",
    regime: "Come-cotas 20% + Regressiva (piso 20%)",
    fields: [{ kind: "slider", key: "rate", label: "Rentab. cota líq. taxas", unit: "% a.a.", min: 1, max: 30, step: 0.1, def: 12 }],
  },
  fundoAcoes: {
    label: "Fundo de Ações",
    regime: "IR 15% flat no resgate (Sem come-cotas)",
    fields: [{ kind: "slider", key: "rate", label: "Rentab. cota líq. taxas", unit: "% a.a.", min: -10, max: 35, step: 0.1, def: 14 }],
  },
  etfAcoes: {
    label: "ETF de Ações",
    regime: "IR 15% flat (Sem isenção 20k / Sem come-cotas)",
    fields: [
      { kind: "slider", key: "rate", label: "Retorno do índice", unit: "% a.a.", min: -10, max: 35, step: 0.1, def: 15 },
      { kind: "slider", key: "fee", label: "Taxa de adm.", unit: "% a.a.", min: 0, max: 1.5, step: 0.01, def: 0.10 }
    ],
  },
  etfRF: {
    label: "ETF de Renda Fixa",
    regime: "IR por prazo médio da carteira (Sem come-cotas)",
    fields: [
      { kind: "slider", key: "rate", label: "Retorno do índice", unit: "% a.a.", min: 1, max: 25, step: 0.1, def: 12.8 },
      { kind: "slider", key: "fee", label: "Taxa de adm.", unit: "% a.a.", min: 0, max: 1.5, step: 0.01, def: 0.19 },
      { kind: "select", key: "dur", label: "Duração", def: "longa", options: [
        { value: "curta", label: ETF_RF_LABELS.curta },
        { value: "media", label: ETF_RF_LABELS.media },
        { value: "longa", label: ETF_RF_LABELS.longa },
      ] }
    ],
  },
  prevVGBL: {
    label: "Previdência VGBL",
    regime: "Sem come-cotas · IR no resgate sobre o RENDIMENTO",
    fields: [
      { kind: "slider", key: "rate", label: "Rentab. cota líq. taxas", unit: "% a.a.", min: 1, max: 30, step: 0.1, def: 13 },
      { kind: "select", key: "trib", label: "Regime", def: "reg", options: PREV_TRIB_OPTIONS }
    ],
  },
  prevPGBL: {
    label: "Previdência PGBL",
    regime: "Sem come-cotas · IR no resgate sobre o VALOR TOTAL (exige dedução de 12% no IRPF para valer a pena)",
    fields: [
      { kind: "slider", key: "rate", label: "Rentab. cota líq. taxas", unit: "% a.a.", min: 1, max: 30, step: 0.1, def: 13 },
      { kind: "select", key: "trib", label: "Regime", def: "reg", options: PREV_TRIB_OPTIONS }
    ],
  },
};

const defaultParams = (type) =>
  Object.fromEntries(TYPES[type].fields.map((f) => [f.key, f.def]));

function simulate(asset, months, cdiA, ipcaA, initial) {
  const p = asset.params;
  const mCDI = annualToMonthly(cdiA);
  const mIPCA = annualToMonthly(ipcaA);
  
  let monthly;
  switch (asset.type) {
    case "pre": monthly = annualToMonthly(p.rate); break;
    case "cdi": case "lci": monthly = mCDI * (p.pct / 100); break;
    case "ipca": monthly = (1 + mIPCA) * (1 + annualToMonthly(p.real)) - 1; break;
    default: monthly = annualToMonthly(p.rate);
  }

  // Dedução da taxa de administração se existir (fee geométrico)
  const fee = p.fee || 0;
  if (fee > 0) monthly = (1 + monthly) / (1 + annualToMonthly(fee)) - 1;

  const series = [{ month: 0, gross: initial, net: initial, tax: 0 }];
  const isFundoCC = asset.type === "fundoLP" || asset.type === "fundoCP";

  if (isFundoCC) {
    const ccRate = asset.type === "fundoLP" ? 0.15 : 0.20;
    const table = asset.type === "fundoLP" ? tableLP : tableCP;
    
    let v = initial, lastMark = initial, taxPaid = 0, grossNoTax = initial, gCC = 0;
    for (let m = 1; m <= months; m++) {
      v *= 1 + monthly;
      grossNoTax *= 1 + monthly;
      if (m % 6 === 0) {
        const periodGain = Math.max(0, v - lastMark);
        const t = periodGain * ccRate;
        v -= t;
        taxPaid += t;
        gCC += periodGain;
        lastMark = v;
      }
      const aliq = table(m);
      const pend = Math.max(0, v - lastMark);
      const complement = Math.max(0, aliq - ccRate) * gCC;
      const redeemTax = pend * aliq + complement;
      series.push({ month: m, gross: grossNoTax, net: v - redeemTax, tax: taxPaid + redeemTax });
    }
  } else {
    let v = initial;
    for (let m = 1; m <= months; m++) {
      v *= 1 + monthly;
      const gain = Math.max(0, v - initial);
      let tax;
      if (asset.type === "prevVGBL") {
        tax = gain * prevAliq(p.trib, m);
      } else if (asset.type === "prevPGBL") {
        tax = v * prevAliq(p.trib, m); // Imposto sobre o total
      } else {
        let aliq;
        switch (asset.type) {
          case "lci": aliq = 0; break;
          case "fundoAcoes": case "etfAcoes": aliq = 0.15; break;
          case "etfRF": aliq = ETF_RF_RATES[p.dur] ?? 0.15; break;
          default: aliq = tableLP(m);
        }
        tax = gain * aliq;
      }
      series.push({ month: m, gross: v, net: v - tax, tax });
    }
  }
  return series;
}

function Slider({ label, unit, value, min, max, step, onChange, color = T.accent }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{label}</span>
        <span className="font-mono text-xs font-bold" style={{ color }}>
          {String(value).replace(".", ",")} {unit}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer outline-none"
        style={{ accentColor: color }}
      />
    </div>
  );
}

function deferSeries(rateA, fee, months, initial) {
  const cdb  = simulate({ type: "pre", params: { rate: rateA } }, months, 0, 0, initial);
  const flp  = simulate({ type: "fundoLP", params: { rate: rateA } }, months, 0, 0, initial);
  const vgbl = simulate({ type: "prevVGBL", params: { rate: rateA, fee: fee, trib: "reg" } }, months, 0, 0, initial);
  return { cdb, flp, vgbl };
}

function eqRate(net, I, M) {
  return M > 0 ? (Math.pow(net / I, 12 / M) - 1) * 100 : 0;
}

export function ComparadorContent() {
  const [initial, setInitial] = useState(100000);
  const [months, setMonths] = useState(36);
  const [cdi, setCdi] = useState(13.0);
  const [ipca, setIpca] = useState(4.75);
  
  const [deferRate, setDeferRate] = useState(13.0);
  const [deferFee, setDeferFee] = useState(0.0);
  const [presentMode, setPresentMode] = useState(false);

  const [assets, setAssets] = useState([
    { id: 1, type: "pre",       name: "CDB Pré 13%",       params: defaultParams("pre"),       active: true },
    { id: 2, type: "cdi",       name: "CDB 110% CDI",      params: defaultParams("cdi"),       active: true },
    { id: 3, type: "ipca",      name: "CDB IPCA+7%",       params: defaultParams("ipca"),      active: true },
    { id: 4, type: "lci",       name: "LCI 93% CDI",       params: defaultParams("lci"),       active: true },
    { id: 5, type: "fundoLP",   name: "Fundo Multim. LP",  params: defaultParams("fundoLP"),   active: true },
    { id: 6, type: "etfAcoes",  name: "ETF Ações",         params: defaultParams("etfAcoes"),  active: true },
    { id: 7, type: "prevVGBL",  name: "VGBL Regressiva",   params: defaultParams("prevVGBL"),  active: true },
  ]);
  const [nextId, setNextId] = useState(8);

  const colorOf = (i) => PALETTE[i % PALETTE.length];

  const sims = useMemo(
    () => assets.map((a) => ({ asset: a, series: simulate(a, months, cdi, ipca, initial) })),
    [assets, months, cdi, ipca, initial]
  );

  const chartData = useMemo(() => {
    const rows = [];
    for (let m = 0; m <= months; m++) {
      const row = { month: m };
      sims.forEach(({ asset, series }) => {
        if (asset.active) row[`a${asset.id}`] = Math.round(series[m].net);
      });
      rows.push(row);
    }
    return rows;
  }, [sims, months]);

  const results = useMemo(() => {
    return sims
      .filter(({ asset }) => asset.active)
      .map(({ asset, series }) => {
        const last = series[months];
        const netAnnual = eqRate(last.net, initial, months);
        const effTax = last.gross > initial ? (last.tax / (last.gross - initial)) * 100 : 0;
        return { asset, net: last.net, gross: last.gross, tax: last.tax, netAnnual, effTax };
      })
      .sort((a, b) => b.net - a.net);
  }, [sims, months, initial]);

  const best = results[0];

  const updateAsset = (id, patch) =>
    setAssets((as) => as.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  const updateParam = (id, key, val) =>
    setAssets((as) => as.map((a) => (a.id === id ? { ...a, params: { ...a.params, [key]: val } } : a)));
  const changeType = (id, type) =>
    setAssets((as) => as.map((a) => (a.id === id ? { ...a, type, params: defaultParams(type), name: TYPES[type].label } : a)));
  const removeAsset = (id) => setAssets((as) => as.filter((a) => a.id !== id));
  const addAsset = () => {
    if (assets.length >= 8) return;
    setAssets((as) => [...as, { id: nextId, type: "pre", name: "Novo ativo", params: defaultParams("pre"), active: true }]);
    setNextId((n) => n + 1);
  };

  const applyScenario = (c, i) => { setCdi(c); setIpca(i); };

  // Deferment Data
  const deferData = useMemo(() => {
    const { cdb, flp, vgbl } = deferSeries(deferRate, deferFee, months, initial);
    const rows = [];
    for (let m = 0; m <= months; m++) {
      rows.push({
        month: m,
        cdb: cdb[m].net,
        flp: flp[m].net,
        vgbl: vgbl[m].net,
      });
    }
    return { rows, cdbLast: cdb[months], flpLast: flp[months], vgblLast: vgbl[months] };
  }, [deferRate, deferFee, months, initial]);

  return (
    <div className="min-h-screen bg-[#f6f4ef] font-sans pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-extralight tracking-tight text-[#123044] mb-2">Comparador de Investimentos</h1>
            <p className="text-sm font-bold text-gray-500">
              Simule a rentabilidade líquida considerando a regra de tributação real de cada ativo.
            </p>
          </div>
          <button 
            onClick={() => setPresentMode(!presentMode)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-2 ${presentMode ? 'bg-[#123044] text-white border-[#123044]' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`}
          >
            <Eye size={16} />
            {presentMode ? "Sair do modo apresentação" : "Modo apresentação (cliente)"}
          </button>
        </div>

        {/* Global params & Best */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
          <div className="xl:col-span-3 bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: T.borderLight }}>
            <div className="flex items-center gap-2 mb-6">
              <Settings2 size={18} style={{ color: T.accent }} />
              <h2 className="text-sm font-bold text-[#123044]">Cenário da Simulação</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Aporte Inicial</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono font-bold text-sm">R$</span>
                  <input
                    type="number" value={initial} min={100} step={1000}
                    onChange={(e) => setInitial(Math.max(100, Number(e.target.value) || 100))}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none font-mono font-bold text-[#123044] text-sm focus:border-[#4fa080]"
                  />
                </div>
              </div>
              <Slider label="Prazo (Meses)" unit="m" value={months} min={1} max={240} step={1} onChange={setMonths} color={T.accent} />
              <div className="md:col-span-2 grid grid-cols-2 gap-6">
                <div>
                  <Slider label="CDI Projetado" unit="% a.a." value={cdi} min={5} max={20} step={0.25} onChange={setCdi} color={T.blue} />
                </div>
                <div>
                  <Slider label="IPCA Projetado" unit="% a.a." value={ipca} min={0} max={12} step={0.25} onChange={setIpca} color={T.amber} />
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-1 mr-2">Cenários:</span>
              <button onClick={() => applyScenario(14.15, 5.30)} className="px-3 py-1.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 hover:bg-gray-200">Juros de Hoje</button>
              <button onClick={() => applyScenario(13.00, 4.75)} className="px-3 py-1.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 hover:bg-gray-200">Focus 12-24m</button>
              <button onClick={() => applyScenario(10.50, 3.70)} className="px-3 py-1.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 hover:bg-gray-200">Convergência</button>
            </div>
          </div>
          
          {best && (
            <div className="bg-white rounded-2xl border p-6 shadow-sm flex flex-col justify-center" style={{ borderColor: colorOf(assets.findIndex((a) => a.id === best.asset.id)), borderWidth: '2px' }}>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Melhor líquido</p>
              <div className="font-mono text-2xl font-bold mb-1" style={{ color: T.text }}>
                {fmtBRL(best.net)}
              </div>
              <div className="text-sm font-bold" style={{ color: colorOf(assets.findIndex((a) => a.id === best.asset.id)) }}>
                {best.asset.name}
              </div>
              {results.length > 1 && (
                <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
                  <span className="font-mono font-bold">{fmtBRL(best.net - results[1].net)}</span> à frente do 2º colocado
                </div>
              )}
            </div>
          )}
        </div>

        {/* Asset cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {assets.map((a, i) => {
            const c = colorOf(i);
            const t = TYPES[a.type];
            return (
              <div key={a.id} className="bg-white rounded-2xl border shadow-sm flex flex-col overflow-hidden transition-opacity" style={{ opacity: a.active ? 1 : 0.5, borderColor: T.borderLight }}>
                <div className="h-1.5 w-full" style={{ backgroundColor: c }} />
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <input
                      value={a.name}
                      onChange={(e) => updateAsset(a.id, { name: e.target.value })}
                      className="flex-1 bg-transparent border-b border-dashed border-gray-300 font-bold text-sm text-[#123044] outline-none pb-0.5 focus:border-gray-500"
                    />
                    <button onClick={() => updateAsset(a.id, { active: !a.active })}
                      className="w-7 h-7 rounded-lg flex items-center justify-center border transition-colors"
                      style={{ backgroundColor: a.active ? c : '#f9fafb', borderColor: a.active ? c : '#e5e7eb', color: a.active ? 'white' : '#9ca3af' }}>
                      <CheckCircle size={14} />
                    </button>
                    <button onClick={() => removeAsset(a.id)} className="w-7 h-7 rounded-lg flex items-center justify-center border border-gray-200 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  
                  <select
                    value={a.type}
                    onChange={(e) => changeType(a.id, e.target.value)}
                    className="w-full px-3 py-2 mb-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-[#123044] outline-none cursor-pointer focus:border-[#4fa080]"
                  >
                    {Object.entries(TYPES).map(([k, tt]) => <option key={k} value={k}>{tt.label}</option>)}
                  </select>
                  
                  {!presentMode && (
                    <div className="text-[10px] text-gray-500 font-medium mb-4 leading-tight bg-gray-50 p-2 rounded-lg flex items-start gap-1.5">
                      <Shield size={12} className="flex-shrink-0 mt-0.5 opacity-50" />
                      <span>{t.regime}</span>
                    </div>
                  )}
                  
                  <div className={`mt-auto space-y-3 ${presentMode ? 'pt-4' : ''}`}>
                    {t.fields.map((f) =>
                      f.kind === "select" ? (
                        <div key={f.key}>
                          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">{f.label}</label>
                          <select
                            value={a.params[f.key]}
                            onChange={(e) => updateParam(a.id, f.key, e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-[#123044] outline-none max-w-full"
                          >
                            {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                          </select>
                        </div>
                      ) : (
                        <Slider key={f.key} label={f.label} unit={f.unit} color={c}
                          value={a.params[f.key]} min={f.min} max={f.max} step={f.step}
                          onChange={(v) => updateParam(a.id, f.key, v)} />
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {assets.length < 8 && (
            <button onClick={addAsset} className="rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-[#4fa080] hover:border-[#4fa080] hover:bg-[#4fa08008] transition-colors min-h-[220px]">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#4fa08020]">
                <Plus size={20} />
              </div>
              <span className="text-sm font-bold">Adicionar ativo</span>
            </button>
          )}
        </div>

        {/* Chart */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-8" style={{ borderColor: T.borderLight }}>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={18} style={{ color: T.accent }} />
            <h2 className="text-sm font-bold text-[#123044]">Evolução do Patrimônio Líquido</h2>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#f0ece1" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#667085", fontWeight: 600 }} tickFormatter={(m) => `${m}m`} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 11, fill: "#667085", fontFamily: "monospace" }} tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)} axisLine={false} tickLine={false} width={45} />
                <Tooltip
                  formatter={(v, name) => [fmtBRL2(v), <span className="font-bold text-[#123044]">{name}</span>]}
                  labelFormatter={(m) => `Mês ${m} (aprox. ${m * 30} dias)`}
                  contentStyle={{ borderRadius: 12, border: '1px solid #e4e0d7', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', fontSize: 12, padding: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 20, fontWeight: 600, color: '#475467' }} />
                <ReferenceLine y={initial} stroke="#cbd5e1" strokeDasharray="4 4" />
                {assets.map((a, i) =>
                  a.active ? (
                    <Line key={a.id} type="monotone" dataKey={`a${a.id}`} name={a.name}
                      stroke={colorOf(i)} strokeWidth={3} dot={false} isAnimationActive={false} />
                  ) : null
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Laboratório de Diferimento Fiscal */}
        {!presentMode && (
          <div className="bg-white rounded-2xl border shadow-sm p-6 mb-8" style={{ borderColor: T.borderLight }}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Laboratório Fiscal</p>
                <h2 className="text-xl font-bold text-[#123044]">Mesma taxa bruta, três regimes: quanto vale adiar o imposto?</h2>
              </div>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-48">
                  <Slider label="Rentab. Líquida Comum" unit="% a.a." value={deferRate} min={6} max={20} step={0.25} onChange={setDeferRate} color={T.accent} />
                </div>
                <div className="w-48">
                  <Slider label="Desvantagem Previdência" unit="% a.a." value={deferFee} min={0} max={2} step={0.05} onChange={setDeferFee} color={T.accent} />
                </div>
              </div>
            </div>

            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={deferData.rows} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#f0ece1" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#667085", fontWeight: 600 }} tickFormatter={(m) => `${m}m`} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fontSize: 11, fill: "#667085", fontFamily: "monospace" }} tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)} axisLine={false} tickLine={false} width={45} domain={['dataMin - 1000', 'dataMax + 1000']} />
                  <Tooltip
                    formatter={(v, name) => [fmtBRL2(v), <span className="font-bold text-[#123044]">{name}</span>]}
                    labelFormatter={(m) => `Mês ${m}`}
                    contentStyle={{ borderRadius: 12, border: '1px solid #e4e0d7', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', fontSize: 12, padding: '12px' }}
                  />
                  <ReferenceLine y={initial} stroke="#cbd5e1" strokeDasharray="4 4" />
                  
                  {/* Lines */}
                  <Line type="monotone" dataKey="flp" name="Fundo LP (Come-cotas)" stroke="#C2551B" strokeWidth={3} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="cdb" name="Regressiva (sem CC)" stroke="#2B5FAA" strokeWidth={3} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="vgbl" name="VGBL (10%)" stroke="#0E7C66" strokeWidth={3} dot={false} isAnimationActive={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-[#fcfbf9] rounded-xl p-4 border border-[#e4e0d7] border-l-4" style={{ borderLeftColor: "#C2551B" }}>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Custo do Come-Cotas</div>
                <div className="font-mono text-lg font-bold text-[#123044] mb-1">{fmtBRL(deferData.cdbLast.net - deferData.flpLast.net)}</div>
                <div className="text-xs text-gray-500">{fmtPct(eqRate(deferData.cdbLast.net, initial, months) - eqRate(deferData.flpLast.net, initial, months))} a.a. perdidos no período</div>
              </div>
              <div className="bg-[#fcfbf9] rounded-xl p-4 border border-[#e4e0d7] border-l-4" style={{ borderLeftColor: "#0E7C66" }}>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Diferença VGBL vs CDB</div>
                <div className="font-mono text-lg font-bold text-[#123044] mb-1">{(deferData.vgblLast.net - deferData.cdbLast.net >= 0 ? "+" : "-")}{fmtBRL(Math.abs(deferData.vgblLast.net - deferData.cdbLast.net))}</div>
                <div className="text-xs text-gray-500">{(deferData.vgblLast.net - deferData.cdbLast.net >= 0) ? "VGBL vence CDB com alíquota regressiva exclusiva." : "CDB vence VGBL (alíquota maior ou custo da previdência)."}</div>
              </div>
              <div className="bg-[#fcfbf9] rounded-xl p-4 border border-[#e4e0d7] border-l-4" style={{ borderLeftColor: "#1B2733" }}>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">VGBL vs Fundo LP</div>
                <div className="font-mono text-lg font-bold text-[#123044] mb-1">{(deferData.vgblLast.net - deferData.flpLast.net >= 0 ? "+" : "-")}{fmtBRL(Math.abs(deferData.vgblLast.net - deferData.flpLast.net))}</div>
                <div className="text-xs text-gray-500">{(deferData.vgblLast.net - deferData.flpLast.net >= 0) ? "O diferimento compensa a desvantagem." : "Fundo de Longo Prazo ainda ganha."}</div>
              </div>
            </div>
          </div>
        )}

        {/* Results table */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden mb-8" style={{ borderColor: T.borderLight }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-[#fcfbf9] border-b border-[#e4e0d7]">
                  {["#", "Ativo", "Bruto", "Imposto de Renda", !presentMode && "Alíq. Efetiva", "Saldo Líquido", "Líquido a.a.", "Lucro Líquido"].filter(Boolean).map((h, i) => (
                    <th key={h} className={`py-4 px-5 text-[10px] font-bold text-gray-500 uppercase tracking-wider ${i > 1 ? 'text-right' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ece1]">
                {results.map((r, rank) => {
                  const i = assets.findIndex((a) => a.id === r.asset.id);
                  const isWinner = rank === 0;
                  return (
                    <tr key={r.asset.id} className={`hover:bg-gray-50 transition-colors ${isWinner ? 'bg-[#f0fdf4]' : ''}`}>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: colorOf(i) }} />
                          <span className="font-bold text-gray-400 text-xs">{rank + 1}º</span>
                        </div>
                      </td>
                      <td className={`py-4 px-5 text-sm ${isWinner ? 'font-bold text-[#123044]' : 'font-semibold text-gray-700'}`}>
                        {r.asset.name}
                      </td>
                      <td className="py-4 px-5 text-right font-mono text-xs text-gray-600">{fmtBRL(r.gross)}</td>
                      <td className="py-4 px-5 text-right font-mono text-xs text-red-500">-{fmtBRL(r.tax)}</td>
                      {!presentMode && <td className="py-4 px-5 text-right font-mono text-xs text-gray-400">{fmtPct(r.effTax, 1)}</td>}
                      <td className="py-4 px-5 text-right font-mono text-sm font-bold text-[#123044]">{fmtBRL(r.net)}</td>
                      <td className="py-4 px-5 text-right font-mono text-xs font-bold text-gray-600">{fmtPct(r.netAnnual)}</td>
                      <td className="py-4 px-5 text-right font-mono text-xs font-bold text-[#10B981]">+{fmtBRL(r.net - initial)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assumptions */}
        {!presentMode && (
          <div className="bg-[#f0ece1] rounded-2xl p-6 flex gap-4 items-start">
            <HelpCircle size={20} className="text-gray-500 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-gray-600 leading-relaxed space-y-3">
              <p>
                <strong className="text-[#123044]">Metodologia Tributária ARVO:</strong> Esta ferramenta simula deterministicamente a evolução do patrimônio líquido conforme a legislação tributária brasileira. 
                Para CDBs, utilizamos a Tabela Regressiva padrão. LCIs e LCAs são isentas. Previdência VGBL recolhe IR apenas sobre rendimento no resgate; PGBL sobre o valor total (pressupondo uso em declaração completa).
              </p>
              <p>
                <strong className="text-[#123044]">Come-Cotas e Fundos:</strong> O come-cotas (15% ou 20%) incide semestralmente (mês 6, 12...) sobre o ganho gerado desde a última tributação, diminuindo o número de cotas. No resgate, calcula-se o IR pela tabela regressiva sobre o ganho total e subtrai-se o imposto já pago. 
                ETFs são tributados na alíquota correta do prazo médio, sem come-cotas.
              </p>
              <p className="text-[11px] text-gray-500">
                * Nota: Simulação teórica determinística. Não considera variação estocástica, IOF, spread de corretoras, diferimento em reinvestimentos ou Risco Emissor/FGC. Meses calculados como exatos 30 dias.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function ComparadorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#f6f4ef]">Carregando...</div>}>
      <ComparadorContent />
    </Suspense>
  );
}
