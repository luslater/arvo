"use client";

import { FormEvent, useCallback, useMemo, useState } from "react";
import "./calculadora-inflacao.css";

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

function TrendChart({ points }: { points: ChartPoint[] }) {
  const width = 680;
  const height = 210;
  const left = 12;
  const top = 14;
  const bottom = 30;
  const plotHeight = height - top - bottom;
  const values = points.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const coords = points.map((point, index) => ({
    x: left + (index / Math.max(points.length - 1, 1)) * (width - left * 2),
    y: top + ((max - point.value) / range) * plotHeight,
  }));
  const line = coords.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `${left},${height - bottom} ${line} ${width - left},${height - bottom}`;
  const ticks = [0, Math.floor((points.length - 1) / 2), points.length - 1];

  return (
    <div className="chart-wrap" aria-label="Evolução do valor corrigido no período">
      <svg viewBox={`0 0 ${width} ${height}`} role="img">
        <defs>
          <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#2f725f" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#2f725f" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="12" x2="668" y1="180" y2="180" className="chart-grid" />
        <polygon points={area} fill="url(#chartFill)" />
        <polyline points={line} className="chart-line" />
        {coords.length > 0 && (
          <>
            <circle cx={coords[0].x} cy={coords[0].y} r="4" className="chart-dot" />
            <circle
              cx={coords[coords.length - 1].x}
              cy={coords[coords.length - 1].y}
              r="5"
              className="chart-dot"
            />
          </>
        )}
        {ticks.map((index) => (
          <text
            key={`${index}-${points[index]?.label}`}
            x={coords[index]?.x ?? 0}
            y="204"
            textAnchor={index === 0 ? "start" : index === points.length - 1 ? "end" : "middle"}
            className="chart-label"
          >
            {points[index] ? prettyMonth(points[index].label) : ""}
          </text>
        ))}
      </svg>
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

  return (
    <div className="arvo-inflation-calculator">
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Arvo — início">
          <span className="brand-mark">A</span>
          <span>ARVO</span>
        </a>
        <span className="tool-label">Ferramentas financeiras</span>
      </header>

      <div className="page-shell" id="top">
        <section className="intro">
          <div>
            <p className="eyebrow">CALCULADORA DE INFLAÇÃO</p>
            <h1>Quanto o seu dinheiro vale hoje?</h1>
            <p className="subtitle">
              Atualize qualquer valor pela inflação oficial e entenda, em números claros,
              quanto o poder de compra mudou no período.
            </p>
          </div>
          <div className="official-badge">
            <span className="status-dot" />
            <div>
              <strong>Dados oficiais</strong>
              <small>Banco Central, IBGE e FGV</small>
            </div>
          </div>
        </section>

        <section className="calculator-grid">
          <form className="calculator-card" onSubmit={submit}>
            <div className="section-heading">
              <span className="step">1</span>
              <div>
                <h2>Informe os dados</h2>
                <p>Escolha o índice e o período da correção.</p>
              </div>
            </div>

            <fieldset>
              <legend>Índice de correção</legend>
              <div className="index-options">
                {INDEXES.map((item) => (
                  <button
                    type="button"
                    key={item.key}
                    className={`index-option ${selected === item.key ? "active" : ""}`}
                    onClick={() => {
                      setSelected(item.key);
                      setResult(null);
                      setError("");
                    }}
                    aria-pressed={selected === item.key}
                  >
                    <strong>{item.name}</strong>
                    <span>{item.source}</span>
                  </button>
                ))}
              </div>
              <p className="index-description">{currentIndex.fullName}</p>
            </fieldset>

            <label className="field">
              <span>Valor a corrigir</span>
              <div className="money-input">
                <span>R$</span>
                <input
                  inputMode="numeric"
                  value={formatInput(amount)}
                  onChange={(event) => {
                    setAmount(parseMoneyInput(event.target.value));
                    setResult(null);
                  }}
                  aria-label="Valor a corrigir em reais"
                />
              </div>
            </label>

            <div className="date-row">
              <label className="field">
                <span>Mês inicial</span>
                <input
                  type="month"
                  min="1994-07"
                  max={previousMonth()}
                  value={startMonth}
                  onChange={(event) => {
                    setStartMonth(event.target.value);
                    setResult(null);
                  }}
                />
                <small>Inclui o índice deste mês</small>
              </label>
              <div className="date-arrow" aria-hidden="true">→</div>
              <label className="field">
                <span>Mês final</span>
                <input
                  type="month"
                  min="1994-07"
                  max={previousMonth()}
                  value={endMonth}
                  onChange={(event) => {
                    setEndMonth(event.target.value);
                    setResult(null);
                  }}
                />
                <small>Inclui o índice deste mês</small>
              </label>
            </div>

            {error && <div className="error-message" role="alert">{error}</div>}

            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? "Consultando dados oficiais…" : "Calcular valor corrigido"}
              {!loading && <span aria-hidden="true">↗</span>}
            </button>
            <button className="reset-button" type="button" onClick={reset}>Limpar dados</button>
          </form>

          <section className={`result-card ${result ? "has-result" : ""}`} aria-live="polite">
            <div className="section-heading result-heading">
              <span className="step">2</span>
              <div>
                <h2>Resultado</h2>
                <p>Correção monetária estimada.</p>
              </div>
            </div>

            {loading ? (
              <div className="result-empty">
                <span className="loader" />
                <strong>Buscando a série histórica</strong>
                <p>A consulta é feita diretamente na base oficial.</p>
              </div>
            ) : result ? (
              <div className="result-content">
                <p className="equivalence-label">
                  {money.format(amount)} em {prettyMonth(result.firstMonth)} equivalem a
                </p>
                <div className="corrected-value">{money.format(result.corrected)}</div>
                <p className="result-date">em {prettyMonth(result.lastMonth)}, pelo {currentIndex.name}</p>

                {result.lastMonth < result.requestedEnd && (
                  <div className="data-note">
                    O cálculo termina em {prettyMonth(result.lastMonth)}, último dado publicado.
                  </div>
                )}

                <div className="metric-grid">
                  <div className="metric highlight">
                    <span>Inflação acumulada</span>
                    <strong>{percent.format(result.accumulated)}%</strong>
                  </div>
                  <div className="metric">
                    <span>Aumento no valor</span>
                    <strong>{money.format(result.increase)}</strong>
                  </div>
                  <div className="metric">
                    <span>Média anual</span>
                    <strong>{percent.format(result.annualized)}% a.a.</strong>
                  </div>
                  <div className="metric">
                    <span>Fator de correção</span>
                    <strong>{result.factor.toFixed(6).replace(".", ",")}</strong>
                  </div>
                </div>

                <div className="chart-header">
                  <div>
                    <span>Evolução corrigida</span>
                    <small>{result.months} índices mensais considerados</small>
                  </div>
                  <strong>{currentIndex.name}</strong>
                </div>
                <TrendChart points={result.chart} />

                <button className="copy-button" type="button" onClick={copyResult}>
                  Copiar resumo do cálculo
                </button>
              </div>
            ) : (
              <div className="result-empty">
                <div className="empty-icon" aria-hidden="true">%</div>
                <strong>Seu resultado aparecerá aqui</strong>
                <p>Preencha os dados ao lado para calcular a correção.</p>
              </div>
            )}
          </section>
        </section>

        <section className="method-section">
          <div>
            <p className="eyebrow">COMO CALCULAMOS</p>
            <h2>Inflação não se soma. Ela se acumula.</h2>
          </div>
          <div className="method-copy">
            <p>
              Aplicamos mês a mês a variação do índice escolhido. O valor inicial é
              multiplicado pelo produto de cada taxa mensal, incluindo os meses inicial e final.
            </p>
            <div className="formula">Valor corrigido = valor inicial × ∏ (1 + índice mensal ÷ 100)</div>
            <p className="fine-print">
              A estimativa é informativa e utiliza as séries temporais oficiais divulgadas pelo
              Banco Central. Resultados podem ser revisados pela fonte. Para períodos anteriores ao
              Real, é necessário considerar as conversões de moeda.
            </p>
          </div>
        </section>
      </div>

      <footer>
        <span>ARVO</span>
        <p>Clareza para decisões financeiras melhores.</p>
        <a href="https://www.bcb.gov.br/meubc/calculadoradocidadao" target="_blank" rel="noreferrer">
          Fonte: Calculadora do Cidadão — BCB ↗
        </a>
      </footer>
    </main>
    </div>
  );
}
