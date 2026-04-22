"use client";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// ─── Funções Matemáticas Financeiras ────────────────────────────────────────

/**
 * Valor Futuro com aportes mensais (série uniforme postecipada)
 * FV = PV × (1 + r)^n + PMT × [((1 + r)^n - 1) / r]
 */
function calcularMontanteMensal(pv: number, pmt: number, taxaMensal: number, meses: number) {
  if (taxaMensal === 0) {
    return pv + pmt * meses;
  }
  const fatorComposto = Math.pow(1 + taxaMensal, meses);
  const fvPV = pv * fatorComposto;
  const fvPMT = pmt * ((fatorComposto - 1) / taxaMensal);
  return fvPV + fvPMT;
}

/**
 * Gera a evolução mês a mês para o gráfico
 */
function gerarEvolucaoMensal(pv: number, pmt: number, taxaMensal: number, meses: number) {
  const dados = [];
  let saldo = pv;
  let totalInvestido = pv;
  let totalJuros = 0;

  dados.push({
    mes: 0,
    saldo: pv,
    totalInvestido: pv,
    jurosAcumulados: 0,
    jurosMes: 0,
  });

  for (let m = 1; m <= meses; m++) {
    const jurosMes = saldo * taxaMensal;
    saldo = saldo + jurosMes + pmt;
    totalInvestido += pmt;
    totalJuros += jurosMes;

    dados.push({
      mes: m,
      saldo: Math.round(saldo * 100) / 100,
      totalInvestido: Math.round(totalInvestido * 100) / 100,
      jurosAcumulados: Math.round(totalJuros * 100) / 100,
      jurosMes: Math.round(jurosMes * 100) / 100,
    });
  }
  return dados;
}

/**
 * Valor Futuro real (descontando inflação)
 * taxa_real ≈ ((1 + taxa_nominal) / (1 + inflacao)) - 1
 */
function taxaReal(taxaNominal: number, inflacaoMensal: number) {
  return (1 + taxaNominal) / (1 + inflacaoMensal) - 1;
}

/**
 * Calcula o tempo necessário para atingir um objetivo
 * n = ln((FV × r + PMT) / (PV × r + PMT)) / ln(1 + r)
 */
function mesesParaObjetivo(pv: number, pmt: number, taxaMensal: number, objetivo: number) {
  if (taxaMensal === 0) {
    if (pmt === 0) return Infinity;
    return Math.ceil((objetivo - pv) / pmt);
  }
  const numerador = Math.log(
    (objetivo * taxaMensal + pmt) / (pv * taxaMensal + pmt)
  );
  const denominador = Math.log(1 + taxaMensal);
  if (numerador <= 0 || denominador <= 0) return Infinity;
  return Math.ceil(numerador / denominador);
}

// ─── Formatação ─────────────────────────────────────────────────────────────

const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatCompact = (v: number) => {
  if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `R$ ${(v / 1_000).toFixed(0)}k`;
  return formatBRL(v);
};

// ─── Componente Principal ───────────────────────────────────────────────────

const parseCurrency = (val: string) => {
  const nums = val.replace(/\D/g, "");
  return Number(nums) / 100;
};

export function CalculadoraJurosCompostos() {
  const [valorInicial, setValorInicial] = useState(10000);
  const [aporteMensal, setAporteMensal] = useState(1000);
  const [taxaAnual, setTaxaAnual] = useState(12);
  const [periodoAnos, setPeriodoAnos] = useState(10);
  const [inflacaoAnual, setInflacaoAnual] = useState(4.5);
  const [mostrarReal, setMostrarReal] = useState(false);
  const [objetivo, setObjetivo] = useState(1000000);
  const [abaAtiva, setAbaAtiva] = useState("evolucao");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("arvo_juros_compostos");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.valorInicial !== undefined) setValorInicial(parsed.valorInicial);
        if (parsed.aporteMensal !== undefined) setAporteMensal(parsed.aporteMensal);
        if (parsed.taxaAnual !== undefined) setTaxaAnual(parsed.taxaAnual);
        if (parsed.periodoAnos !== undefined) setPeriodoAnos(parsed.periodoAnos);
        if (parsed.inflacaoAnual !== undefined) setInflacaoAnual(parsed.inflacaoAnual);
        if (parsed.mostrarReal !== undefined) setMostrarReal(parsed.mostrarReal);
        if (parsed.objetivo !== undefined) setObjetivo(parsed.objetivo);
      } catch (e) { }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(
      "arvo_juros_compostos",
      JSON.stringify({
        valorInicial,
        aporteMensal,
        taxaAnual,
        periodoAnos,
        inflacaoAnual,
        mostrarReal,
        objetivo,
      })
    );
  }, [isLoaded, valorInicial, aporteMensal, taxaAnual, periodoAnos, inflacaoAnual, mostrarReal, objetivo]);

  const taxaMensal = Math.pow(1 + taxaAnual / 100, 1 / 12) - 1;
  const inflacaoMensal = Math.pow(1 + inflacaoAnual / 100, 1 / 12) - 1;
  const taxaRealMensal = taxaReal(taxaMensal, inflacaoMensal);
  const meses = periodoAnos * 12;

  const taxa = mostrarReal ? taxaRealMensal : taxaMensal;

  const resultados = useMemo(() => {
    const dados = gerarEvolucaoMensal(
      valorInicial,
      aporteMensal,
      taxa,
      meses
    );
    const final_ = dados[dados.length - 1];
    const mesesObj = mesesParaObjetivo(
      valorInicial,
      aporteMensal,
      taxaMensal,
      objetivo
    );

    // Dados anuais para o gráfico de barras
    const dadosAnuais = dados
      .filter((d) => d.mes % 12 === 0 && d.mes > 0)
      .map((d) => ({
        ano: d.mes / 12,
        investido: d.totalInvestido,
        juros: d.jurosAcumulados,
      }));

    // Contribuição dos juros compostos vs simples
    const jurosSimples = valorInicial * (taxaAnual / 100) * periodoAnos;
    const fvComAportes = final_.saldo;
    const totalAportado = final_.totalInvestido;
    const jurosCompostos = fvComAportes - totalAportado;
    const diferencaCompostoSimples = jurosCompostos - jurosSimples;

    return {
      dados,
      dadosAnuais,
      montanteFinal: final_.saldo,
      totalInvestido: final_.totalInvestido,
      totalJuros: final_.jurosAcumulados,
      percentualJuros: (final_.jurosAcumulados / final_.saldo) * 100,
      mesesParaObj: mesesObj,
      anosParaObj: Math.floor(mesesObj / 12),
      mesesRestoObj: mesesObj % 12,
      jurosSimples,
      jurosCompostos,
      diferencaCompostoSimples,
      taxaMensalEfetiva: taxa * 100,
      taxaAnualEfetiva: mostrarReal
        ? ((Math.pow(1 + taxaRealMensal, 12) - 1) * 100)
        : taxaAnual,
    };
  }, [
    valorInicial,
    aporteMensal,
    taxa,
    meses,
    taxaAnual,
    periodoAnos,
    taxaMensal,
    objetivo,
    mostrarReal,
    taxaRealMensal,
  ]);

  const CustomTooltip = useCallback(
    ({ active, payload, label }: any) => {
      if (!active || !payload || !payload.length) return null;
      const d = resultados.dados.find((x) => x.mes === label);
      if (!d) return null;
      return (
        <div className="bg-white text-dash-text p-3 rounded-lg shadow-xl text-sm border border-dash-border">
          <p className="font-semibold mb-1 text-dash-text-light">
            {label < 12
              ? `Mês ${label}`
              : `${Math.floor(label / 12)}a ${label % 12}m`}
          </p>
          <p>
            <span className="text-dash-accent">Saldo:</span>{" "}
            {formatBRL(d.saldo)}
          </p>
          <p>
            <span className="text-blue-600">Investido:</span>{" "}
            {formatBRL(d.totalInvestido)}
          </p>
          <p>
            <span className="text-amber-600">Juros acumulados:</span>{" "}
            {formatBRL(d.jurosAcumulados)}
          </p>
          <p>
            <span className="text-purple-600">Juros no mês:</span>{" "}
            {formatBRL(d.jurosMes)}
          </p>
        </div>
      );
    },
    [resultados.dados]
  );

  const inputClass =
    "w-full bg-dash-surface-active border border-dash-border rounded-lg px-4 py-3 text-dash-text text-lg focus:outline-none focus:ring-1 focus:ring-dash-accent focus:border-dash-accent transition";
  const labelClass = "block text-dash-text-light text-sm font-medium mb-1.5";

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-dash-text">
            Calculadora de Juros Compostos
          </h1>
          <p className="text-dash-text-muted mt-2">
            Simule o crescimento do seu patrimônio com o poder dos juros
            compostos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ─── Painel de Inputs ──────────────────────────────── */}
          <div className="lg:col-span-1 space-y-5">
            <div className="bg-dash-bg rounded-2xl p-6 border border-dash-border">
              <h2 className="text-lg font-semibold text-dash-accent mb-4">
                Dados do Investimento
              </h2>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Valor inicial (R$)</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={formatBRL(valorInicial)}
                    onChange={(e) =>
                      setValorInicial(Math.max(0, parseCurrency(e.target.value)))
                    }
                  />
                </div>

                <div>
                  <label className={labelClass}>Aporte mensal (R$)</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={formatBRL(aporteMensal)}
                    onChange={(e) =>
                      setAporteMensal(Math.max(0, parseCurrency(e.target.value)))
                    }
                  />
                </div>

                <div>
                  <label className={labelClass}>Rendimento anual (%)</label>
                  <input
                    type="number"
                    className={inputClass}
                    value={taxaAnual}
                    onChange={(e) =>
                      setTaxaAnual(Math.max(0, Number(e.target.value)))
                    }
                    min={0}
                    step={0.5}
                  />
                  <p className="text-xs text-dash-text-muted mt-1">
                    ≈ {(taxa * 100).toFixed(4)}% ao mês
                    {mostrarReal ? " (real)" : " (nominal)"}
                  </p>
                </div>

                <div>
                  <label className={labelClass}>Período (anos)</label>
                  <input
                    type="range"
                    min={1}
                    max={100}
                    value={periodoAnos}
                    onChange={(e) => setPeriodoAnos(Number(e.target.value))}
                    className="w-full accent-dash-accent"
                  />
                  <div className="flex justify-between text-sm text-dash-text-light">
                    <span>1 ano</span>
                    <span className="text-dash-accent font-bold text-lg">
                      {periodoAnos} anos
                    </span>
                    <span>100 anos</span>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Inflação anual (%)</label>
                  <input
                    type="number"
                    className={inputClass}
                    value={inflacaoAnual}
                    onChange={(e) =>
                      setInflacaoAnual(Math.max(0, Number(e.target.value)))
                    }
                    min={0}
                    step={0.5}
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setMostrarReal(!mostrarReal)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${mostrarReal ? "bg-dash-accent" : "bg-dash-surface-active border border-dash-border"
                      }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${mostrarReal ? "translate-x-6" : ""
                        }`}
                    />
                  </button>
                  <span className="text-sm text-dash-text-light">
                    {mostrarReal
                      ? "Valores reais (descontando inflação)"
                      : "Valores nominais"}
                  </span>
                </div>
              </div>
            </div>

            {/* Meta */}
            <div className="bg-dash-bg rounded-2xl p-6 border border-dash-border">
              <h2 className="text-lg font-semibold text-amber-600 mb-4">
                Calculadora de Meta
              </h2>
              <div>
                <label className={labelClass}>Objetivo (R$)</label>
                <input
                  type="text"
                  className={inputClass}
                  value={formatBRL(objetivo)}
                  onChange={(e) =>
                    setObjetivo(Math.max(0, parseCurrency(e.target.value)))
                  }
                />
              </div>
              <div className="mt-4 bg-dash-surface-active rounded-xl p-4">
                {resultados.mesesParaObj === Infinity ? (
                  <p className="text-red-500 text-sm">
                    Com esses parâmetros, o objetivo não será atingido.
                  </p>
                ) : (
                  <>
                    <p className="text-dash-text-light text-sm">
                      Tempo para alcançar{" "}
                      <span className="text-dash-text font-semibold">
                        {formatBRL(objetivo)}
                      </span>
                      :
                    </p>
                    <p className="text-2xl font-bold text-amber-600 mt-1">
                      {resultados.anosParaObj > 0 &&
                        `${resultados.anosParaObj} anos`}
                      {resultados.anosParaObj > 0 &&
                        resultados.mesesRestoObj > 0 &&
                        " e "}
                      {resultados.mesesRestoObj > 0 &&
                        `${resultados.mesesRestoObj} meses`}
                      {resultados.anosParaObj === 0 &&
                        resultados.mesesRestoObj === 0 &&
                        "Já atingido!"}
                    </p>
                    <p className="text-xs text-dash-text-muted mt-1">
                      ({resultados.mesesParaObj} meses — taxa nominal)
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ─── Painel de Resultados ─────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cards de resultado */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-dash-success/10 rounded-xl p-4 border border-dash-success/20 overflow-hidden">
                <p className="text-xs text-dash-text-light uppercase tracking-wide">
                  Montante final
                </p>
                <p className="text-lg md:text-xl font-bold mt-1 text-dash-text truncate" title={formatBRL(resultados.montanteFinal)}>
                  {formatBRL(resultados.montanteFinal)}
                </p>
              </div>
              <div className="bg-dash-accent/10 rounded-xl p-4 border border-dash-accent/20 overflow-hidden">
                <p className="text-xs text-dash-text-light uppercase tracking-wide">
                  Total investido
                </p>
                <p className="text-lg md:text-xl font-bold mt-1 text-dash-text truncate" title={formatBRL(resultados.totalInvestido)}>
                  {formatBRL(resultados.totalInvestido)}
                </p>
              </div>
              <div className="bg-amber-400/10 rounded-xl p-4 border border-amber-400/20 overflow-hidden">
                <p className="text-xs text-dash-text-light uppercase tracking-wide">
                  Total em juros
                </p>
                <p className="text-lg md:text-xl font-bold mt-1 text-dash-text truncate" title={formatBRL(resultados.totalJuros)}>
                  {formatBRL(resultados.totalJuros)}
                </p>
              </div>
              <div className="bg-violet-400/10 rounded-xl p-4 border border-violet-400/20 overflow-hidden">
                <p className="text-xs text-dash-text-light uppercase tracking-wide">
                  Juros / Total
                </p>
                <p className="text-lg md:text-xl font-bold mt-1 text-dash-text truncate">
                  {resultados.percentualJuros}%
                </p>
              </div>
            </div>

            {/* Insight juros compostos vs simples */}
            <div className="bg-dash-bg rounded-2xl p-5 border border-dash-border">
              <h3 className="text-sm font-semibold text-dash-text-light uppercase tracking-wide mb-2">
                Poder dos Juros Compostos
              </h3>
              <p className="text-dash-text text-sm leading-relaxed">
                Se seus juros fossem simples (sem reinvestimento sobre o valor
                inicial), você teria apenas{" "}
                <span className="text-red-500 font-semibold">
                  {formatBRL(resultados.jurosSimples)}
                </span>{" "}
                em rendimentos. Com juros compostos + aportes, você acumula{" "}
                <span className="text-emerald-600 font-semibold">
                  {formatBRL(resultados.jurosCompostos)}
                </span>
                . A diferença de{" "}
                <span className="text-amber-600 font-semibold">
                  {formatBRL(resultados.diferencaCompostoSimples)}
                </span>{" "}
                é o efeito "bola de neve" dos juros compostos trabalhando a seu
                favor.
              </p>
            </div>

            {/* Abas dos gráficos */}
            <div className="bg-dash-bg rounded-2xl border border-dash-border overflow-hidden">
              <div className="flex border-b border-dash-border">
                {[
                  { id: "evolucao", label: "Evolução Mensal" },
                  { id: "barras", label: "Composição Anual" },
                ].map((aba) => (
                  <button
                    key={aba.id}
                    onClick={() => setAbaAtiva(aba.id)}
                    className={`flex-1 py-3 text-sm font-semibold transition ${abaAtiva === aba.id
                      ? "text-dash-accent border-b-2 border-dash-accent bg-dash-surface-active"
                      : "text-dash-text-light hover:text-dash-text hover:bg-dash-surface-active/50"
                      }`}
                  >
                    {aba.label}
                  </button>
                ))}
              </div>

              <div className="p-4" style={{ height: 400 }}>
                {abaAtiva === "evolucao" ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={resultados.dados}>
                      <defs>
                        <linearGradient
                          id="colorSaldo"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#10b981"
                            stopOpacity={0.2}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10b981"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorInvestido"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3b82f6"
                            stopOpacity={0.15}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3b82f6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis
                        dataKey="mes"
                        stroke="#94a3b8"
                        tickFormatter={(v) =>
                          v % 12 === 0 ? `${v / 12}a` : ""
                        }
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        stroke="#94a3b8"
                        tickFormatter={formatCompact}
                        tick={{ fontSize: 12 }}
                        width={80}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        wrapperStyle={{ fontSize: 12, color: "#64748b" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="saldo"
                        name="Saldo Total"
                        stroke="#10b981"
                        fill="url(#colorSaldo)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="totalInvestido"
                        name="Total Investido"
                        stroke="#3b82f6"
                        fill="url(#colorInvestido)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={resultados.dadosAnuais}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis
                        dataKey="ano"
                        stroke="#94a3b8"
                        tickFormatter={(v) => `${v}a`}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        stroke="#94a3b8"
                        tickFormatter={formatCompact}
                        tick={{ fontSize: 12 }}
                        width={80}
                      />
                      <Tooltip
                        formatter={(v: any) => formatBRL(Number(v))}
                        labelFormatter={(v) => `Ano ${v}`}
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #e2e8f0",
                          borderRadius: 8,
                          color: "#1e293b",
                        }}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: 12, color: "#64748b" }}
                      />
                      <Bar
                        dataKey="investido"
                        name="Investido"
                        stackId="a"
                        fill="#3b82f6"
                        radius={[0, 0, 0, 0]}
                      />
                      <Bar
                        dataKey="juros"
                        name="Juros"
                        stackId="a"
                        fill="#f59e0b"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Tabela resumida */}
            <div className="bg-dash-bg rounded-2xl border border-dash-border overflow-hidden">
              <h3 className="text-sm font-semibold text-dash-text-light uppercase tracking-wide p-4 pb-2">
                Resumo por Ano
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-dash-text-light border-b border-dash-border">
                      <th className="px-4 py-3 text-left font-semibold">Ano</th>
                      <th className="px-4 py-3 text-right font-semibold">Investido</th>
                      <th className="px-4 py-3 text-right font-semibold">Juros Acum.</th>
                      <th className="px-4 py-3 text-right font-semibold">Saldo</th>
                      <th className="px-4 py-3 text-right font-semibold">Juros/Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultados.dados
                      .filter((d) => d.mes > 0 && d.mes % 12 === 0)
                      .map((d) => (
                        <tr
                          key={d.mes}
                          className="border-b border-dash-border/30 hover:bg-dash-surface-active transition"
                        >
                          <td className="px-4 py-3 text-dash-text font-medium">
                            {d.mes / 12}
                          </td>
                          <td className="px-4 py-3 text-right text-blue-600">
                            {formatBRL(d.totalInvestido)}
                          </td>
                          <td className="px-4 py-3 text-right text-amber-600">
                            {formatBRL(d.jurosAcumulados)}
                          </td>
                          <td className="px-4 py-3 text-right text-emerald-600 font-bold">
                            {formatBRL(d.saldo)}
                          </td>
                          <td className="px-4 py-3 text-right text-purple-600">
                            {d.saldo > 0
                              ? ((d.jurosAcumulados / d.saldo) * 100).toFixed(1)
                              : 0}
                            %
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
