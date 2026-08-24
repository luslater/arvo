"use client";

import { FormEvent, useCallback, useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { TrendingUp, RotateCcw, ShieldCheck, Copy, Check, Info } from "lucide-react";

type CalcMode = "forward" | "backward";
type IndexKey = "ipca" | "inpc" | "igpm";

type PriceIndex = {
  key: IndexKey;
  name: string;
  fullName: string;
  series: number;
  source: string;
};

type ApiPoint = { data: string; valor: string };
type ChartPoint = { label: string; factor: number; value: number };

type Result = {
  mode: CalcMode;
  amount: number;
  corrected: number;
  increase: number;
  accumulated: number;
  purchasingPowerLoss: number;
  annualized: number;
  factor: number;
  months: number;
  firstMonth: string;
  lastMonth: string;
  requestedEnd: string;
  chart: ChartPoint[];
};

const INDEXES: PriceIndex[] = [
  {
    key: "ipca",
    name: "IPCA",
    fullName: "Índice de Preços ao Consumidor Amplo",
    series: 433,
    source: "IBGE",
  },
  {
    key: "inpc",
    name: "INPC",
    fullName: "Índice Nacional de Preços ao Consumidor",
    series: 188,
    source: "IBGE",
  },
  {
    key: "igpm",
    name: "IGP-M",
    fullName: "Índice Geral de Preços — Mercado",
    series: 28655,
    source: "FGV",
  },
];

const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

const percent = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const monthFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function previousMonth(): string {
  const now = new Date();
  const date = new Date(Date.UTC(now.getFullYear(), now.getMonth() - 1, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function monthToApi(value: string, lastDay = false) {
  const [year, month] = value.split("-").map(Number);
  const day = lastDay ? new Date(Date.UTC(year, month, 0)).getUTCDate() : 1;
  return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
}

function apiDateToMonth(value: string) {
  const [, month, year] = value.split("/");
  return `${year}-${month}`;
}

function prettyMonth(value: string) {
  const [year, month] = value.split("-").map(Number);
  const text = monthFormatter.format(new Date(Date.UTC(year, month - 1, 1)));
  return text.replace(" de ", "/").replace(".", "");
}

function monthDistance(first: string, last: string) {
  const [fy, fm] = first.split("-").map(Number);
  const [ly, lm] = last.split("-").map(Number);
  return (ly - fy) * 12 + lm - fm + 1;
}

function formatInput(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function parseMoneyInput(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits) / 100 : 0;
}

const formatBRLCompact = (v: number) => {
  if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `R$ ${(v / 1_000).toFixed(0)}k`;
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
};

function TrendChart({ points, mode }: { points: ChartPoint[]; mode: CalcMode }) {
  if (!points || points.length === 0) return null;

  const seriesName = mode === "forward" ? "Valor Corrigido" : "Poder de Compra Equivalente";

  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1f674f" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#1f674f" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis 
            dataKey="label" 
            stroke="#94a3b8" 
            tickFormatter={(v, i) => {
              if (points.length < 10) return prettyMonth(v);
              if (i === 0 || i === points.length - 1) return prettyMonth(v);
              if (i % Math.ceil(points.length / 5) === 0) return prettyMonth(v);
              return "";
            }}
            tick={{ fontSize: 12 }} 
          />
          <YAxis 
            stroke="#94a3b8" 
            tickFormatter={formatBRLCompact} 
            tick={{ fontSize: 12 }} 
            width={80} 
          />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white text-dash-text p-3 rounded-xl shadow-xl text-sm border border-dash-border">
                    <p className="font-semibold mb-1 text-dash-text-light">{prettyMonth(String(label || ""))}</p>
                    <p>
                      <span className="text-dash-accent font-semibold">{seriesName}:</span>{" "}
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(payload[0].value as number)}
                    </p>
                    <p>
                      <span className="text-blue-600 font-semibold">Fator Acumulado:</span>{" "}
                      {Number(payload[0].payload.factor).toFixed(4)}
                    </p>
                  </div>
                );
              }
              return null;
            }} 
          />
          <Legend wrapperStyle={{ fontSize: 12, color: "#64748b" }} />
          <Area 
            type="monotone" 
            dataKey="value" 
            name={seriesName} 
            stroke="#1f674f" 
            fill="url(#colorValue)" 
            strokeWidth={2.5} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function CalculadoraInflacao() {
  const [mode, setMode] = useState<CalcMode>("forward");
  const [selected, setSelected] = useState<IndexKey>("ipca");
  const [amount, setAmount] = useState(100000);
  const [startMonth, setStartMonth] = useState("2015-01");
  const [endMonth, setEndMonth] = useState(previousMonth());
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const currentIndex = useMemo(
    () => INDEXES.find((item) => item.key === selected) ?? INDEXES[0],
    [selected],
  );

  const calculate = useCallback(async () => {
    setError("");
    setResult(null);

    if (amount <= 0) {
      setError("Informe um valor maior que zero.");
      return;
    }

    if (!startMonth || !endMonth || startMonth > endMonth) {
      setError("Confira o período: a data final deve ser igual ou posterior à inicial.");
      return;
    }

    if (startMonth < "1994-07") {
      setError("Para preservar a unidade monetária em reais, escolha uma data a partir de julho de 1994.");
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        formato: "json",
        dataInicial: monthToApi(startMonth),
        dataFinal: monthToApi(endMonth, true),
      });
      const response = await fetch(
        `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${currentIndex.series}/dados?${params}`,
      );
      if (!response.ok) throw new Error("Fonte oficial indisponível");
      const data = (await response.json()) as ApiPoint[];
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("O índice ainda não possui dados para esse período.");
      }

      let totalFactor = 1;
      data.forEach((point) => {
        totalFactor *= 1 + Number(point.valor.replace(",", ".")) / 100;
      });

      const firstMonth = apiDateToMonth(data[0].data);
      const lastMonth = apiDateToMonth(data[data.length - 1].data);
      const months = monthDistance(firstMonth, lastMonth);

      let corrected = 0;
      let increase = 0;
      let chart: ChartPoint[] = [];

      if (mode === "forward") {
        // Modo 1: Valor no passado -> valor equivalente hoje
        // Valor hoje = Valor passado * fator de inflação
        corrected = amount * totalFactor;
        increase = corrected - amount;

        let runningFactor = 1;
        chart = data.map((point) => {
          runningFactor *= 1 + Number(point.valor.replace(",", ".")) / 100;
          const label = apiDateToMonth(point.data);
          return { label, factor: runningFactor, value: amount * runningFactor };
        });
      } else {
        // Modo 2: Valor de hoje -> valor equivalente no passado
        // Valor no passado = Valor atual / fator de inflação acumulada
        corrected = amount / totalFactor;
        increase = amount - corrected; // Diferença nominal em reais que a inflação corroeu

        let runningFactor = 1;
        chart = data.map((point) => {
          runningFactor *= 1 + Number(point.valor.replace(",", ".")) / 100;
          const label = apiDateToMonth(point.data);
          return { label, factor: runningFactor, value: (amount / totalFactor) * runningFactor };
        });
      }

      const accumulated = (totalFactor - 1) * 100;
      const purchasingPowerLoss = (1 - 1 / totalFactor) * 100;
      const annualized = (Math.pow(totalFactor, 12 / months) - 1) * 100;

      setResult({
        mode,
        amount,
        corrected,
        increase,
        accumulated,
        purchasingPowerLoss,
        annualized,
        factor: totalFactor,
        months,
        firstMonth,
        lastMonth,
        requestedEnd: endMonth,
        chart,
      });
    } catch (caught) {
      setError(
        caught instanceof Error
          ? `${caught.message}. Tente novamente em alguns instantes.`
          : "Não foi possível consultar a série oficial agora.",
      );
    } finally {
      setLoading(false);
    }
  }, [amount, currentIndex.series, endMonth, mode, startMonth]);

  function submit(event: FormEvent) {
    event.preventDefault();
    void calculate();
  }

  function reset() {
    setSelected("ipca");
    setAmount(100000);
    setStartMonth("2015-01");
    setEndMonth(previousMonth());
    setResult(null);
    setError("");
    setCopied(false);
  }

  async function copyResult() {
    if (!result) return;
    let text = "";
    if (result.mode === "forward") {
      text = `${currentIndex.name}: ${money.format(result.amount)} em ${prettyMonth(result.firstMonth)} equivalem a ${money.format(result.corrected)} hoje (${prettyMonth(result.lastMonth)}). Inflação acumulada: ${percent.format(result.accumulated)}% (Perda do poder de compra: ${percent.format(result.purchasingPowerLoss)}%).`;
    } else {
      text = `${currentIndex.name}: ${money.format(result.amount)} hoje (${prettyMonth(result.lastMonth)}) equivalem a ${money.format(result.corrected)} em ${prettyMonth(result.firstMonth)}. Inflação acumulada: ${percent.format(result.accumulated)}% (Perda do poder de compra: ${percent.format(result.purchasingPowerLoss)}%).`;
    }
    await navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  const inputClass = "w-full bg-dash-surface-active border border-dash-border rounded-xl px-4 py-3 text-dash-text text-lg focus:outline-none focus:ring-1 focus:ring-dash-accent focus:border-dash-accent transition";
  const labelClass = "block text-dash-text-light text-sm font-medium mb-1.5";

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1f674f]" /> Correção Monetária & Poder de Compra
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-dash-text">
            Calculadora de Inflação & Poder de Compra
          </h1>
          <p className="text-dash-text-muted mt-2 max-w-xl mx-auto text-sm md:text-base">
            Atualize valores passados pela inflação oficial ou descubra quanto seu dinheiro de hoje valia no passado em poder de compra real.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Painel de Inputs */}
          <div className="lg:col-span-1 space-y-5">
            <form className="bg-dash-bg rounded-2xl p-6 border border-dash-border shadow-xs" onSubmit={submit}>
              
              {/* Seletor de Modalidade */}
              <div className="mb-5">
                <label className={labelClass}>Modo de cálculo</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-dash-surface-active rounded-xl border border-dash-border">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forward");
                      setResult(null);
                      setError("");
                    }}
                    className={`py-2.5 px-2 rounded-lg text-xs font-semibold transition-all duration-200 flex flex-col items-center justify-center gap-0.5 text-center ${
                      mode === "forward"
                        ? "bg-[#1f674f] text-white shadow-xs"
                        : "text-dash-text-muted hover:text-dash-text hover:bg-dash-surface"
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> Atualizar valor
                    </span>
                    <span className={`text-[10px] font-normal ${mode === "forward" ? "text-white/80" : "text-dash-text-light"}`}>
                      Passado → Hoje
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode("backward");
                      setResult(null);
                      setError("");
                    }}
                    className={`py-2.5 px-2 rounded-lg text-xs font-semibold transition-all duration-200 flex flex-col items-center justify-center gap-0.5 text-center ${
                      mode === "backward"
                        ? "bg-[#1f674f] text-white shadow-xs"
                        : "text-dash-text-muted hover:text-dash-text hover:bg-dash-surface"
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <RotateCcw className="w-3.5 h-3.5" /> Voltar no tempo
                    </span>
                    <span className={`text-[10px] font-normal ${mode === "backward" ? "text-white/80" : "text-dash-text-light"}`}>
                      Hoje → Passado
                    </span>
                  </button>
                </div>
                <p className="text-xs text-dash-text-muted mt-2 italic">
                  {mode === "forward"
                    ? "“Quanto esse dinheiro do passado valeria hoje?”"
                    : "“Quanto esse dinheiro de hoje valeria naquela época?”"}
                </p>
              </div>

              <div className="space-y-4">
                {/* Índice */}
                <div>
                  <label className={labelClass}>Índice oficial</label>
                  <div className="grid grid-cols-3 gap-2">
                    {INDEXES.map((item) => (
                      <button
                        type="button"
                        key={item.key}
                        onClick={() => {
                          setSelected(item.key);
                          setResult(null);
                          setError("");
                        }}
                        className={`py-2 px-1 text-sm font-semibold rounded-lg transition-colors border ${
                          selected === item.key 
                            ? "bg-dash-accent text-white border-dash-accent" 
                            : "bg-dash-surface text-dash-text-muted border-dash-border hover:bg-dash-surface-active"
                        }`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-dash-text-muted mt-1.5">{currentIndex.fullName} ({currentIndex.source})</p>
                </div>

                {/* Valor */}
                <div>
                  <label className={labelClass}>
                    {mode === "forward" ? "Valor no passado (R$)" : "Valor atual de hoje (R$)"}
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    className={inputClass}
                    value={formatInput(amount)}
                    onChange={(event) => {
                      setAmount(parseMoneyInput(event.target.value));
                      setResult(null);
                    }}
                  />
                </div>

                {/* Datas */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>
                      {mode === "forward" ? "Mês inicial (passado)" : "Data no passado"}
                    </label>
                    <input
                      type="month"
                      className="w-full bg-dash-surface-active border border-dash-border rounded-xl px-3 py-2.5 text-dash-text text-sm focus:outline-none focus:ring-1 focus:ring-dash-accent"
                      min="1994-07"
                      max={previousMonth()}
                      value={startMonth}
                      onChange={(event) => {
                        setStartMonth(event.target.value);
                        setResult(null);
                      }}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      {mode === "forward" ? "Mês final (hoje)" : "Referência (hoje)"}
                    </label>
                    <input
                      type="month"
                      className="w-full bg-dash-surface-active border border-dash-border rounded-xl px-3 py-2.5 text-dash-text text-sm focus:outline-none focus:ring-1 focus:ring-dash-accent"
                      min="1994-07"
                      max={previousMonth()}
                      value={endMonth}
                      onChange={(event) => {
                        setEndMonth(event.target.value);
                        setResult(null);
                      }}
                    />
                  </div>
                </div>

                {error && <div className="text-red-500 text-sm font-medium mt-2">{error}</div>}

                <div className="pt-2 flex flex-col gap-2">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-[#1f674f] hover:bg-[#18533f] text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-70 shadow-sm flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      "Consultando BACEN..."
                    ) : mode === "forward" ? (
                      <>
                        <TrendingUp className="w-4 h-4" /> Calcular Atualização
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-4 h-4" /> Calcular Poder de Compra
                      </>
                    )}
                  </button>
                  <button 
                    type="button" 
                    onClick={reset}
                    className="w-full bg-transparent hover:bg-dash-surface-active text-dash-text-light font-medium py-2 px-4 rounded-xl transition-colors text-sm"
                  >
                    Limpar
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Painel de Resultados */}
          <div className="lg:col-span-2 space-y-6">
            {!result ? (
              <div className="bg-dash-surface border border-dash-border rounded-2xl h-full min-h-[360px] flex flex-col items-center justify-center text-dash-text-muted p-8 text-center shadow-xs">
                <div className="w-16 h-16 bg-emerald-50 text-[#1f674f] rounded-2xl flex items-center justify-center mb-4 border border-emerald-100">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-lg text-dash-text">Seu resultado aparecerá aqui</h3>
                <p className="text-sm max-w-md mt-1 text-dash-text-muted">
                  {mode === "forward"
                    ? "Informe o valor do passado e a data inicial para descobrir quanto esse dinheiro valeria hoje corrigido pela inflação."
                    : "Informe seu valor de hoje e uma data passada para descobrir quanto esse dinheiro representava em poder de compra na época."}
                </p>
              </div>
            ) : (
              <>
                {/* Hero do Resultado */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#1f674f] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold tracking-wider uppercase text-emerald-200">
                          {result.mode === "forward" ? "Valor Equivalente Hoje" : "Poder de Compra na Época"}
                        </span>
                        <button
                          type="button"
                          onClick={copyResult}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                          title="Copiar resultado"
                        >
                          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <h3 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight mb-2 text-white">
                        {money.format(result.corrected)}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-emerald-100/90 leading-snug pt-3 border-t border-white/15">
                      {result.mode === "forward" ? (
                        <>
                          <strong className="text-white">{money.format(result.amount)}</strong> em {prettyMonth(result.firstMonth)} equivalem a <strong className="text-white">{money.format(result.corrected)}</strong> hoje ({prettyMonth(result.lastMonth)}).
                        </>
                      ) : (
                        <>
                          <strong className="text-white">{money.format(result.amount)}</strong> hoje equivalem a <strong className="text-white">{money.format(result.corrected)}</strong> em {prettyMonth(result.firstMonth)}.
                        </>
                      )}
                    </p>
                  </div>

                  {/* 4 Cards de Métricas */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="bg-dash-surface p-4 sm:p-4.5 rounded-2xl border border-dash-border shadow-xs">
                      <p className="text-[10px] sm:text-xs text-dash-text-light font-semibold uppercase tracking-wider mb-1">
                        Inflação Acumulada
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-[#1f674f]">
                        +{percent.format(result.accumulated)}%
                      </p>
                      <p className="text-[10px] text-dash-text-muted mt-0.5">Em {result.months} meses analisados</p>
                    </div>

                    <div className="bg-dash-surface p-4 sm:p-4.5 rounded-2xl border border-dash-border shadow-xs">
                      <p className="text-[10px] sm:text-xs text-dash-text-light font-semibold uppercase tracking-wider mb-1">
                        Diferença Nominal
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-dash-text">
                        {money.format(result.increase)}
                      </p>
                      <p className="text-[10px] text-dash-text-muted mt-0.5">
                        {result.mode === "forward" ? "Correção da inflação" : "Impacto em reais"}
                      </p>
                    </div>

                    <div className="bg-dash-surface p-4 sm:p-4.5 rounded-2xl border border-dash-border shadow-xs">
                      <p className="text-[10px] sm:text-xs text-dash-text-light font-semibold uppercase tracking-wider mb-1">
                        Perda de Poder de Compra
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-rose-600">
                        -{percent.format(result.purchasingPowerLoss)}%
                      </p>
                      <p className="text-[10px] text-dash-text-muted mt-0.5">Erosão real no período</p>
                    </div>

                    <div className="bg-dash-surface p-4 sm:p-4.5 rounded-2xl border border-dash-border shadow-xs">
                      <p className="text-[10px] sm:text-xs text-dash-text-light font-semibold uppercase tracking-wider mb-1">
                        {result.mode === "forward" ? "Fator Multiplicador" : "Fator Divisor"}
                      </p>
                      <p className="text-lg sm:text-xl font-bold text-dash-text">
                        {result.factor.toFixed(6).replace(".", ",")}
                      </p>
                      <p className="text-[10px] text-dash-text-muted mt-0.5">Média: {percent.format(result.annualized)}% a.a.</p>
                    </div>
                  </div>
                </div>

                {/* Gráfico */}
                <div className="bg-dash-surface rounded-2xl p-5 sm:p-6 border border-dash-border shadow-xs">
                  <div className="flex flex-wrap justify-between items-center gap-2 mb-6">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-dash-text">
                        {result.mode === "forward" ? "Evolução do Valor Corrigido" : "Evolução do Poder de Compra"}
                      </h3>
                      <p className="text-xs text-dash-text-muted">
                        Série histórica de {result.months} meses divulgada pelo {currentIndex.source} ({currentIndex.name})
                      </p>
                    </div>
                    <div className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-[#1f674f] border border-emerald-100">
                      {result.mode === "forward" ? "Passado → Hoje" : "Hoje → Passado"}
                    </div>
                  </div>
                  <TrendChart points={result.chart} mode={result.mode} />
                </div>
                
                {/* Aviso Educativo Obrigatório */}
                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 text-sm text-emerald-950 flex items-start gap-3.5 shadow-xs">
                  <div className="p-2 rounded-xl bg-emerald-100/80 text-[#1f674f] shrink-0 mt-0.5">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-emerald-900 text-sm">
                      Equivalência de Poder de Compra (e não Rentabilidade de Investimento)
                    </p>
                    <p className="text-emerald-850 text-xs sm:text-sm leading-relaxed">
                      Este cálculo expressa a correção monetária estritamente necessária para preservar a mesma capacidade de compra ao longo do tempo através da variação acumulada do {currentIndex.name} ({currentIndex.source}). Ele <strong>não representa lucros ou rentabilidade de uma carteira de investimentos</strong>.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
