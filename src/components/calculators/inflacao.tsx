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
  corrected: number;
  increase: number;
  accumulated: number;
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

function TrendChart({ points }: { points: ChartPoint[] }) {
  if (!points || points.length === 0) return null;

  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
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
                  <div className="bg-white text-dash-text p-3 rounded-lg shadow-xl text-sm border border-dash-border">
                    <p className="font-semibold mb-1 text-dash-text-light">{prettyMonth(label)}</p>
                    <p><span className="text-dash-accent font-semibold">Valor Corrigido:</span> {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(payload[0].value as number)}</p>
                    <p><span className="text-blue-600 font-semibold">Fator Acumulado:</span> {Number(payload[0].payload.factor).toFixed(4)}</p>
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
            name="Valor Corrigido" 
            stroke="#10b981" 
            fill="url(#colorValue)" 
            strokeWidth={2} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function CalculadoraInflacao() {
  const [selected, setSelected] = useState<IndexKey>("ipca");
  const [amount, setAmount] = useState(1000);
  const [startMonth, setStartMonth] = useState("2020-01");
  const [endMonth, setEndMonth] = useState(previousMonth());
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

      let factor = 1;
      const chart = data.map((point) => {
        factor *= 1 + Number(point.valor.replace(",", ".")) / 100;
        const label = apiDateToMonth(point.data);
        return { label, factor, value: amount * factor };
      });
      const firstMonth = chart[0].label;
      const lastMonth = chart[chart.length - 1].label;
      const months = monthDistance(firstMonth, lastMonth);
      const corrected = amount * factor;

      setResult({
        corrected,
        increase: corrected - amount,
        accumulated: (factor - 1) * 100,
        annualized: (Math.pow(factor, 12 / months) - 1) * 100,
        factor,
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
  }, [amount, currentIndex.series, endMonth, startMonth]);

  function submit(event: FormEvent) {
    event.preventDefault();
    void calculate();
  }

  function reset() {
    setSelected("ipca");
    setAmount(1000);
    setStartMonth("2020-01");
    setEndMonth(previousMonth());
    setResult(null);
    setError("");
  }

  async function copyResult() {
    if (!result) return;
    const text = `${currentIndex.name}: ${money.format(amount)} em ${prettyMonth(result.firstMonth)} equivalem a ${money.format(result.corrected)} em ${prettyMonth(result.lastMonth)}. Inflação acumulada: ${percent.format(result.accumulated)}%.`;
    await navigator.clipboard?.writeText(text);
  }

  const inputClass = "w-full bg-dash-surface-active border border-dash-border rounded-lg px-4 py-3 text-dash-text text-lg focus:outline-none focus:ring-1 focus:ring-dash-accent focus:border-dash-accent transition";
  const labelClass = "block text-dash-text-light text-sm font-medium mb-1.5";

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-dash-text">
            Calculadora de Correção Monetária
          </h1>
          <p className="text-dash-text-muted mt-2">
            Atualize qualquer valor pela inflação oficial (IPCA, INPC, IGP-M) do período.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Painel de Inputs */}
          <div className="lg:col-span-1 space-y-5">
            <form className="bg-dash-bg rounded-2xl p-6 border border-dash-border shadow-sm" onSubmit={submit}>
              <h2 className="text-lg font-semibold text-dash-accent mb-4">
                Dados da Correção
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Índice de correção</label>
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

                <div>
                  <label className={labelClass}>Valor a corrigir (R$)</label>
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

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Mês inicial</label>
                    <input
                      type="month"
                      className="w-full bg-dash-surface-active border border-dash-border rounded-lg px-3 py-2.5 text-dash-text text-sm focus:outline-none focus:ring-1 focus:ring-dash-accent"
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
                    <label className={labelClass}>Mês final</label>
                    <input
                      type="month"
                      className="w-full bg-dash-surface-active border border-dash-border rounded-lg px-3 py-2.5 text-dash-text text-sm focus:outline-none focus:ring-1 focus:ring-dash-accent"
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
                    className="w-full bg-dash-accent hover:bg-dash-accent/90 text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-70 shadow-sm"
                  >
                    {loading ? "Consultando BACEN..." : "Calcular Correção"}
                  </button>
                  <button 
                    type="button" 
                    onClick={reset}
                    className="w-full bg-transparent hover:bg-dash-surface-active text-dash-text-light font-semibold py-2 px-4 rounded-xl transition-colors text-sm"
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
              <div className="bg-dash-surface border border-dash-border rounded-2xl h-full min-h-[300px] flex flex-col items-center justify-center text-dash-text-muted p-6 text-center">
                <div className="w-16 h-16 bg-dash-surface-active rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-dash-text-light">%</span>
                </div>
                <h3 className="font-semibold text-lg text-dash-text">Seu resultado aparecerá aqui</h3>
                <p className="text-sm max-w-sm mt-1">Preencha os dados e clique em Calcular para buscar a série histórica atualizada.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-dash-accent text-white p-6 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-center">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
                    </div>
                    <p className="text-sm font-medium mb-1" style={{ color: "rgba(255,255,255,0.8)" }}>Valor Corrigido</p>
                    <h3 className="text-4xl md:text-5xl font-bold tracking-tight mb-2" style={{ color: "#FFFFFF" }}>
                      {money.format(result.corrected)}
                    </h3>
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                      Valor equivalente em {prettyMonth(result.lastMonth)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-dash-bg p-5 rounded-2xl border border-dash-border">
                      <p className="text-xs text-dash-text-muted font-medium mb-1 uppercase tracking-wider">Inflação Acumulada</p>
                      <p className="text-2xl font-bold text-dash-accent">{percent.format(result.accumulated)}%</p>
                    </div>
                    <div className="bg-dash-bg p-5 rounded-2xl border border-dash-border">
                      <p className="text-xs text-dash-text-muted font-medium mb-1 uppercase tracking-wider">Diferença (Aumento)</p>
                      <p className="text-2xl font-bold text-dash-text">{money.format(result.increase)}</p>
                    </div>
                    <div className="bg-dash-bg p-5 rounded-2xl border border-dash-border">
                      <p className="text-xs text-dash-text-muted font-medium mb-1 uppercase tracking-wider">Média Anualizada</p>
                      <p className="text-xl font-bold text-dash-text">{percent.format(result.annualized)}% <span className="text-sm font-normal text-dash-text-light">a.a.</span></p>
                    </div>
                    <div className="bg-dash-bg p-5 rounded-2xl border border-dash-border">
                      <p className="text-xs text-dash-text-muted font-medium mb-1 uppercase tracking-wider">Fator Multiplicador</p>
                      <p className="text-xl font-bold text-dash-text">{result.factor.toFixed(6).replace(".", ",")}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dash-bg rounded-2xl p-6 border border-dash-border">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-dash-text">Evolução do valor</h3>
                      <p className="text-sm text-dash-text-muted">{result.months} meses analisados pelo índice {currentIndex.name}</p>
                    </div>
                  </div>
                  <TrendChart points={result.chart} />
                </div>
                
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
                  <strong>Entenda o cálculo:</strong> Aplicamos mês a mês a variação do {currentIndex.name}. O valor é multiplicado pelo produto de cada taxa mensal divulgada pelo {currentIndex.source}, garantindo precisão absoluta.
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
