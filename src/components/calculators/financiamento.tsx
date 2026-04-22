"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

// ─── Funções Matemáticas Financeiras ────────────────────────────────────────

/**
 * Parcela Price (SAC fixo) — Sistema de Amortização Constante com Prestações Fixas
 * PMT = PV × [r(1+r)^n] / [(1+r)^n - 1]
 */
function calcularParcelaPrice(pv: number, taxaMensal: number, meses: number) {
  if (taxaMensal === 0) return pv / meses;
  const fator = Math.pow(1 + taxaMensal, meses);
  return pv * ((taxaMensal * fator) / (fator - 1));
}

/**
 * Gera tabela de amortização Price mês a mês
 */
function gerarAmortizacaoPrice(pv: number, taxaMensal: number, meses: number) {
  const parcela = calcularParcelaPrice(pv, taxaMensal, meses);
  const dados = [];
  let saldoDevedor = pv;
  let totalJurosPago = 0;

  for (let m = 1; m <= meses; m++) {
    const juros = saldoDevedor * taxaMensal;
    const amortizacao = parcela - juros;
    saldoDevedor -= amortizacao;
    totalJurosPago += juros;

    dados.push({
      mes: m,
      parcela: Math.round(parcela * 100) / 100,
      juros: Math.round(juros * 100) / 100,
      amortizacao: Math.round(amortizacao * 100) / 100,
      saldoDevedor: Math.max(0, Math.round(saldoDevedor * 100) / 100),
      totalJurosPago: Math.round(totalJurosPago * 100) / 100,
    });
  }

  return { parcela, dados, totalJurosPago, totalPago: parcela * meses };
}

/**
 * Gera tabela de amortização SAC mês a mês
 * Amortização constante = PV / n
 * Juros decrescentes mês a mês
 */
function gerarAmortizacaoSAC(pv: number, taxaMensal: number, meses: number) {
  const amortizacaoFixa = pv / meses;
  const dados = [];
  let saldoDevedor = pv;
  let totalJurosPago = 0;
  let totalPago = 0;

  for (let m = 1; m <= meses; m++) {
    const juros = saldoDevedor * taxaMensal;
    const parcela = amortizacaoFixa + juros;
    saldoDevedor -= amortizacaoFixa;
    totalJurosPago += juros;
    totalPago += parcela;

    dados.push({
      mes: m,
      parcela: Math.round(parcela * 100) / 100,
      juros: Math.round(juros * 100) / 100,
      amortizacao: Math.round(amortizacaoFixa * 100) / 100,
      saldoDevedor: Math.max(0, Math.round(saldoDevedor * 100) / 100),
      totalJurosPago: Math.round(totalJurosPago * 100) / 100,
    });
  }

  return {
    parcelaInicial: amortizacaoFixa + pv * taxaMensal,
    parcelaFinal: amortizacaoFixa + (pv / meses) * taxaMensal,
    dados,
    totalJurosPago,
    totalPago,
  };
}

/**
 * Simula cenário COMPRAR: patrimônio líquido ao longo do tempo
 * Patrimônio = Valor do imóvel valorizado - Saldo devedor
 * Custo mensal = Parcela + IPTU + Condomínio + Manutenção + Seguro
 */
function simularCompra(params: any) {
  const {
    valorImovel,
    entrada,
    taxaFinanciamentoMensal,
    prazoMeses,
    valorizacaoAnual,
    sistema, // "price" ou "sac"
  } = params;

  const financiado = valorImovel - entrada;
  const valorizacaoMensal = Math.pow(1 + valorizacaoAnual / 100, 1 / 12) - 1;

  const amort: any =
    sistema === "sac"
      ? gerarAmortizacaoSAC(financiado, taxaFinanciamentoMensal, prazoMeses)
      : gerarAmortizacaoPrice(financiado, taxaFinanciamentoMensal, prazoMeses);

  const evolucao = [];
  let valorAtual = valorImovel;
  let custoTotalAcum = entrada; // entrada já é custo
  let totalJurosFinanc = 0;

  for (let m = 1; m <= prazoMeses; m++) {
    valorAtual *= 1 + valorizacaoMensal;
    const dadosMes = amort.dados[m - 1];
    const custoMes = dadosMes ? dadosMes.parcela : 0;
    custoTotalAcum += custoMes;
    totalJurosFinanc = dadosMes ? dadosMes.totalJurosPago : totalJurosFinanc;

    const saldoDev = dadosMes ? dadosMes.saldoDevedor : 0;
    const patrimonioLiquido = valorAtual - saldoDev;

    evolucao.push({
      mes: m,
      valorImovel: Math.round(valorAtual * 100) / 100,
      saldoDevedor: saldoDev,
      patrimonioLiquido: Math.round(patrimonioLiquido * 100) / 100,
      custoMensal: Math.round(custoMes * 100) / 100,
      custoAcumulado: Math.round(custoTotalAcum * 100) / 100,
    });
  }

  return {
    evolucao,
    parcelaInicial:
      sistema === "sac" ? amort.parcelaInicial : amort.parcela,
    totalPagoFinanciamento: amort.totalPago,
    totalJurosFinanciamento: amort.totalJurosPago,
    custoTotalCompra: custoTotalAcum,
    valorFinalImovel: valorAtual,
    patrimonioFinal: valorAtual - 0, // quitado ao final
  };
}

/**
 * Simula cenário ALUGAR + INVESTIR: patrimônio financeiro ao longo do tempo
 * Investe a entrada + a diferença (custo_compra - aluguel) todo mês
 */
function simularAluguel(params: any) {
  const {
    aluguelInicial,
    reajusteAluguelAnual,
    entrada, // valor que seria dado de entrada (investido)
    rendimentoAnual,
    prazoMeses,
    custoMensalCompra, // array ou valor médio dos custos de compra por mês
  } = params;

  const rendimentoMensal = Math.pow(1 + rendimentoAnual / 100, 1 / 12) - 1;
  const reajusteMensal =
    Math.pow(1 + reajusteAluguelAnual / 100, 1 / 12) - 1;

  const evolucao = [];
  let patrimonio = entrada;
  let aluguelAtual = aluguelInicial;
  let custoTotalAcum = 0;

  for (let m = 1; m <= prazoMeses; m++) {
    // Reajuste anual do aluguel (a cada 12 meses)
    if (m > 1 && (m - 1) % 12 === 0) {
      aluguelAtual *= 1 + reajusteAluguelAnual / 100;
    }

    // Rendimento do patrimônio investido
    const rendimento = patrimonio * rendimentoMensal;
    patrimonio += rendimento;

    // Custo mensal da compra (para calcular a diferença)
    const custoCompraNoMes =
      typeof custoMensalCompra === "number"
        ? custoMensalCompra
        : custoMensalCompra[m - 1] || custoMensalCompra[custoMensalCompra.length - 1];

    // Se alugar é mais barato, investe a diferença
    const diferencaMensal = custoCompraNoMes - aluguelAtual;
    if (diferencaMensal > 0) {
      patrimonio += diferencaMensal;
    } else {
      // Se aluguel for mais caro, subtrai do patrimônio
      patrimonio += diferencaMensal; // diferencaMensal é negativo
    }

    custoTotalAcum += aluguelAtual;

    evolucao.push({
      mes: m,
      patrimonio: Math.round(patrimonio * 100) / 100,
      aluguel: Math.round(aluguelAtual * 100) / 100,
      custoAcumulado: Math.round(custoTotalAcum * 100) / 100,
    });
  }

  return {
    evolucao,
    patrimonioFinal: patrimonio,
    custoTotalAluguel: custoTotalAcum,
  };
}

// ─── Formatação ─────────────────────────────────────────────────────────────

const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const parseCurrency = (val: string) => {
  const nums = val.replace(/\D/g, "");
  return Number(nums) / 100;
};

const formatCompact = (v: number) => {
  if (Math.abs(v) >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000) return `R$ ${(v / 1_000).toFixed(0)}k`;
  return formatBRL(v);
};

// ─── Componente Principal ───────────────────────────────────────────────────

export function CalculadoraFinanciamento() {
  // Dados do imóvel
  const [valorImovel, setValorImovel] = useState(500000);
  const [entrada, setEntrada] = useState(100000);
  const [taxaFinancAnual, setTaxaFinancAnual] = useState(10.5);
  const [prazoAnos, setPrazoAnos] = useState(30);
  const [sistema, setSistema] = useState("price");

  // Valorização e investimento
  const [valorizacaoAnual, setValorizacaoAnual] = useState(4);
  const [rendimentoAnual, setRendimentoAnual] = useState(11);

  // Aluguel
  const [aluguelInicial, setAluguelInicial] = useState(2500);
  const [reajusteAluguelAnual, setReajusteAluguelAnual] = useState(5);

  // UI
  const [abaAtiva, setAbaAtiva] = useState("comparativo");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("arvo_financiamento");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.valorImovel !== undefined) setValorImovel(parsed.valorImovel);
        if (parsed.entrada !== undefined) setEntrada(parsed.entrada);
        if (parsed.taxaFinancAnual !== undefined) setTaxaFinancAnual(parsed.taxaFinancAnual);
        if (parsed.prazoAnos !== undefined) setPrazoAnos(parsed.prazoAnos);
        if (parsed.sistema !== undefined) setSistema(parsed.sistema);
        if (parsed.valorizacaoAnual !== undefined) setValorizacaoAnual(parsed.valorizacaoAnual);
        if (parsed.rendimentoAnual !== undefined) setRendimentoAnual(parsed.rendimentoAnual);
        if (parsed.aluguelInicial !== undefined) setAluguelInicial(parsed.aluguelInicial);
        if (parsed.reajusteAluguelAnual !== undefined) setReajusteAluguelAnual(parsed.reajusteAluguelAnual);
      } catch (e) { }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(
      "arvo_financiamento",
      JSON.stringify({
        valorImovel,
        entrada,
        taxaFinancAnual,
        prazoAnos,
        sistema,
        valorizacaoAnual,
        rendimentoAnual,
        aluguelInicial,
        reajusteAluguelAnual,
      })
    );
  }, [isLoaded, valorImovel, entrada, taxaFinancAnual, prazoAnos, sistema, valorizacaoAnual, rendimentoAnual, aluguelInicial, reajusteAluguelAnual]);

  const prazoMeses = prazoAnos * 12;
  const taxaFinancMensal = Math.pow(1 + taxaFinancAnual / 100, 1 / 12) - 1;

  const resultados = useMemo(() => {
    const compra = simularCompra({
      valorImovel,
      entrada,
      taxaFinanciamentoMensal: taxaFinancMensal,
      prazoMeses,
      valorizacaoAnual,
      sistema,
    });

    // Custos mensais da compra para usar na simulação de aluguel
    const custosMensaisCompra = compra.evolucao.map((e) => e.custoMensal);

    const aluguel = simularAluguel({
      aluguelInicial,
      reajusteAluguelAnual,
      entrada,
      rendimentoAnual,
      prazoMeses,
      custoMensalCompra: custosMensaisCompra,
    });

    // Dados comparativos para o gráfico (amostrar a cada 12 meses)
    const dadosComparativos = [];
    let breakEvenMes = null;

    for (let m = 0; m < prazoMeses; m++) {
      const patrimonioCompra = compra.evolucao[m].patrimonioLiquido;
      const patrimonioAluguel = aluguel.evolucao[m].patrimonio;

      if (breakEvenMes === null && patrimonioCompra > patrimonioAluguel) {
        breakEvenMes = m + 1;
      }

      if ((m + 1) % 6 === 0 || m === 0 || m === prazoMeses - 1) {
        dadosComparativos.push({
          mes: m + 1,
          comprar: Math.round(patrimonioCompra),
          alugar: Math.round(patrimonioAluguel),
        });
      }
    }

    // Custo efetivo mensal médio de cada cenário
    const custoMedioCompra = compra.custoTotalCompra / prazoMeses;
    const custoMedioAluguel = aluguel.custoTotalAluguel / prazoMeses;

    // Vantagem: quem tem mais patrimônio ao final
    const vantagem =
      compra.patrimonioFinal > aluguel.patrimonioFinal ? "comprar" : "alugar";
    const diferencaPatrimonio = Math.abs(
      compra.patrimonioFinal - aluguel.patrimonioFinal
    );

    // Dados do financiamento para a aba de detalhes
    const dadosFinanciamento = compra.evolucao
      .filter((_, i) => (i + 1) % 12 === 0)
      .map((e, idx) => ({
        ano: idx + 1,
        saldoDevedor: e.saldoDevedor,
        valorImovel: e.valorImovel,
        patrimonioLiquido: e.patrimonioLiquido,
      }));

    return {
      compra,
      aluguel,
      dadosComparativos,
      dadosFinanciamento,
      breakEvenMes,
      breakEvenAnos: breakEvenMes ? Math.floor(breakEvenMes / 12) : null,
      breakEvenMesesResto: breakEvenMes ? breakEvenMes % 12 : null,
      custoMedioCompra,
      custoMedioAluguel,
      vantagem,
      diferencaPatrimonio,
    };
  }, [
    valorImovel,
    entrada,
    taxaFinancMensal,
    prazoMeses,
    valorizacaoAnual,
    sistema,
    aluguelInicial,
    reajusteAluguelAnual,
    rendimentoAnual,
  ]);

  const inputClass =
    "w-full bg-dash-surface-active border border-dash-border/80 rounded-[10px] px-3 py-2.5 text-dash-text text-sm focus:outline-none focus:ring-1 focus:ring-cyan-600 focus:border-cyan-600 transition";
  const labelClass = "block text-dash-text-light text-xs font-semibold mb-1";
  const sectionTitle = "text-[13px] uppercase tracking-wide font-bold mb-3";

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-3xl font-extrabold text-dash-text tracking-tight">
            Comprar ou Alugar?
          </h1>
          <p className="text-dash-text-light mt-2 text-sm font-medium">
            Simulação financeira completa para tomar a melhor decisão
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* ─── Painel de Inputs ──────────────────────────────── */}
          <div className="xl:col-span-1 space-y-4">
            {/* Imóvel */}
            <div className="bg-dash-bg rounded-2xl p-5 border border-dash-border">
              <h2 className={`${sectionTitle} text-cyan-400`}>Imóvel</h2>
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Valor do imóvel (R$)</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={formatBRL(valorImovel)}
                    onChange={(e) =>
                      setValorImovel(Math.max(0, parseCurrency(e.target.value)))
                    }
                  />
                </div>
                <div>
                  <label className={labelClass}>Entrada (R$)</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={formatBRL(entrada)}
                    onChange={(e) =>
                      setEntrada(
                        Math.max(
                          0,
                          Math.min(valorImovel, parseCurrency(e.target.value))
                        )
                      )
                    }
                  />
                  <p className="text-xs text-dash-text-muted mt-0.5">
                    {((entrada / valorImovel) * 100).toFixed(1)}% do valor
                  </p>
                </div>
                <div>
                  <label className={labelClass}>
                    Juros financiamento (% a.a.)
                  </label>
                  <input
                    type="number"
                    className={inputClass}
                    value={taxaFinancAnual}
                    onChange={(e) =>
                      setTaxaFinancAnual(Math.max(0, Number(e.target.value)))
                    }
                    step={0.5}
                  />
                  <p className="text-xs text-dash-text-muted mt-0.5">
                    ≈ {(taxaFinancMensal * 100).toFixed(4)}% ao mês
                  </p>
                </div>
                <div>
                  <label className={labelClass}>Prazo (anos)</label>
                  <input
                    type="range"
                    min={5}
                    max={35}
                    value={prazoAnos}
                    onChange={(e) => setPrazoAnos(Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                  <div className="flex justify-between text-xs text-dash-text-light">
                    <span>5</span>
                    <span className="text-cyan-400 font-bold text-sm">
                      {prazoAnos} anos
                    </span>
                    <span>35</span>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Sistema</label>
                  <div className="flex gap-2">
                    {["price", "sac"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSistema(s)}
                        className={`flex-1 py-2 rounded-[6px] text-sm font-semibold transition ${sistema === s
                          ? "bg-cyan-600 text-white shadow-sm"
                          : "bg-dash-surface-active text-dash-text-light hover:bg-dash-border hover:text-dash-text"
                          }`}
                      >
                        {s.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Aluguel */}
            <div className="bg-dash-bg rounded-2xl p-5 border border-dash-border">
              <h2 className={`${sectionTitle} text-violet-400`}>Aluguel</h2>
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Aluguel mensal (R$)</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={formatBRL(aluguelInicial)}
                    onChange={(e) =>
                      setAluguelInicial(Math.max(0, parseCurrency(e.target.value)))
                    }
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Reajuste anual aluguel (%)
                  </label>
                  <input
                    type="number"
                    className={inputClass}
                    value={reajusteAluguelAnual}
                    onChange={(e) =>
                      setReajusteAluguelAnual(
                        Math.max(0, Number(e.target.value))
                      )
                    }
                    step={0.5}
                  />
                </div>
              </div>
            </div>

            {/* Mercado */}
            <div className="bg-dash-bg rounded-2xl p-5 border border-dash-border">
              <h2 className={`${sectionTitle} text-emerald-400`}>Mercado</h2>
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>
                    Valorização imóvel (% a.a.)
                  </label>
                  <input
                    type="number"
                    className={inputClass}
                    value={valorizacaoAnual}
                    onChange={(e) =>
                      setValorizacaoAnual(Number(e.target.value))
                    }
                    step={0.5}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Rendimento investimentos (% a.a.)
                  </label>
                  <input
                    type="number"
                    className={inputClass}
                    value={rendimentoAnual}
                    onChange={(e) =>
                      setRendimentoAnual(Math.max(0, Number(e.target.value)))
                    }
                    step={0.5}
                  />
                  <p className="text-xs text-dash-text-muted mt-0.5">
                    Rendimento se investir a entrada + diferenças
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Painel de Resultados ─────────────────────────── */}
          <div className="xl:col-span-3 space-y-6">
            {/* Veredicto */}
            <div
              className={`rounded-2xl p-6 border ${resultados.vantagem === "comprar"
                ? "bg-gradient-to-r from-cyan-900/30 to-cyan-800/20 border-dash-border"
                : "bg-gradient-to-r from-violet-900/30 to-violet-800/20 border-dash-border"
                }`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm text-dash-text-light uppercase tracking-wide">
                    Com esses parâmetros, é mais vantajoso
                  </p>
                  <p
                    className={`text-3xl font-bold mt-1 ${resultados.vantagem === "comprar"
                      ? "text-cyan-400"
                      : "text-violet-400"
                      }`}
                  >
                    {resultados.vantagem === "comprar"
                      ? "Comprar o imóvel"
                      : "Alugar e investir"}
                  </p>
                  <p className="text-dash-text-light text-sm mt-1">
                    Diferença de patrimônio ao final de {prazoAnos} anos:{" "}
                    <span className="text-dash-text font-semibold">
                      {formatBRL(resultados.diferencaPatrimonio)}
                    </span>
                  </p>
                </div>
                {resultados.breakEvenMes && (
                  <div className="bg-dash-bg/60 rounded-xl p-4 text-center min-w-48">
                    <p className="text-xs text-dash-text-light">
                      Comprar supera alugar em
                    </p>
                    <p className="text-xl font-bold text-amber-400 mt-1">
                      {(resultados.breakEvenAnos ?? 0) > 0 &&
                        `${resultados.breakEvenAnos} ano${(resultados.breakEvenAnos || 0) > 1 ? 's' : ''}`}
                      {(resultados.breakEvenAnos ?? 0) > 0 && (resultados.breakEvenMesesResto ?? 0) > 0 && ' e '}
                      {(resultados.breakEvenMesesResto ?? 0) > 0 &&
                        `${resultados.breakEvenMesesResto} ${resultados.breakEvenMesesResto === 1 ? 'mês' : 'meses'}`}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-dash-bg rounded-xl p-4 border border-dash-border">
                <p className="text-xs text-cyan-300 uppercase tracking-wide">
                  Parcela inicial
                </p>
                <p className="text-lg font-bold text-cyan-400 mt-1">
                  {formatBRL(resultados.compra.parcelaInicial)}
                </p>
              </div>
              <div className="bg-dash-bg rounded-xl p-4 border border-dash-border">
                <p className="text-xs text-red-300 uppercase tracking-wide">
                  Total juros financ.
                </p>
                <p className="text-lg font-bold text-red-400 mt-1">
                  {formatBRL(resultados.compra.totalJurosFinanciamento)}
                </p>
                <p className="text-xs text-dash-text-muted">
                  {(
                    (resultados.compra.totalJurosFinanciamento /
                      (valorImovel - entrada)) *
                    100
                  ).toFixed(0)}
                  % do valor financiado
                </p>
              </div>
              <div className="bg-dash-bg rounded-xl p-4 border border-dash-border">
                <p className="text-xs text-emerald-300 uppercase tracking-wide">
                  Imóvel em {prazoAnos}a
                </p>
                <p className="text-lg font-bold text-emerald-400 mt-1">
                  {formatBRL(resultados.compra.valorFinalImovel)}
                </p>
                <p className="text-xs text-dash-text-muted">
                  Valorização de{" "}
                  {(
                    ((resultados.compra.valorFinalImovel - valorImovel) /
                      valorImovel) *
                    100
                  ).toFixed(0)}
                  %
                </p>
              </div>
              <div className="bg-dash-bg rounded-xl p-4 border border-dash-border">
                <p className="text-xs text-violet-300 uppercase tracking-wide">
                  Patrimônio (alugar)
                </p>
                <p className="text-lg font-bold text-violet-400 mt-1">
                  {formatBRL(resultados.aluguel.patrimonioFinal)}
                </p>
                <p className="text-xs text-dash-text-muted">
                  Investindo entrada + diferenças
                </p>
              </div>
            </div>

            {/* Abas */}
            <div className="bg-dash-bg rounded-2xl border border-dash-border overflow-hidden">
              <div className="flex border-b border-dash-border overflow-x-auto">
                {[
                  { id: "comparativo", label: "Patrimônio Comparativo" },
                  { id: "financiamento", label: "Evolução do Financiamento" },
                  { id: "custos", label: "Custos Acumulados" },
                ].map((aba) => (
                  <button
                    key={aba.id}
                    onClick={() => setAbaAtiva(aba.id)}
                    className={`flex-1 py-3 px-4 text-sm font-medium transition whitespace-nowrap ${abaAtiva === aba.id
                      ? "text-cyan-400 border-b-2 border-cyan-400 bg-dash-surface-active/50"
                      : "text-dash-text-muted hover:text-dash-text-light"
                      }`}
                  >
                    {aba.label}
                  </button>
                ))}
              </div>

              <div className="p-4" style={{ height: 420 }}>
                {abaAtiva === "comparativo" && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={resultados.dadosComparativos}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="mes"
                        stroke="#6b7280"
                        tickFormatter={(v) =>
                          v % 12 === 0 ? `${v / 12}a` : ""
                        }
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis
                        stroke="#6b7280"
                        tickFormatter={formatCompact}
                        tick={{ fontSize: 11 }}
                        width={80}
                      />
                      <Tooltip
                        formatter={(v: any) => formatBRL(Number(v))}
                        labelFormatter={(v) => {
                          const a = Math.floor(v / 12);
                          const m = v % 12;
                          return `${a > 0 ? a + " ano(s) " : ""}${m > 0 || a === 0 ? m + " mês(es)" : ""}`;
                        }}
                        contentStyle={{
                          backgroundColor: "#111827",
                          border: "1px solid #374151",
                          borderRadius: 8,
                          color: "#fff",
                          fontSize: 13,
                        }}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: 12, color: "#9ca3af" }}
                      />
                      {resultados.breakEvenMes && (
                        <ReferenceLine
                          x={resultados.breakEvenMes}
                          stroke="#f59e0b"
                          strokeDasharray="5 5"
                          label={{
                            value: "Break-even",
                            fill: "#f59e0b",
                            fontSize: 11,
                          }}
                        />
                      )}
                      <Line
                        type="monotone"
                        dataKey="comprar"
                        name="Patrimônio (Comprar)"
                        stroke="#22d3ee"
                        strokeWidth={2.5}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="alugar"
                        name="Patrimônio (Alugar + Investir)"
                        stroke="#a78bfa"
                        strokeWidth={2.5}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}

                {abaAtiva === "financiamento" && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={resultados.dadosFinanciamento}>
                      <defs>
                        <linearGradient
                          id="colorValor"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#10b981"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10b981"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="ano"
                        stroke="#6b7280"
                        tickFormatter={(v) => `${v}a`}
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis
                        stroke="#6b7280"
                        tickFormatter={formatCompact}
                        tick={{ fontSize: 11 }}
                        width={80}
                      />
                      <Tooltip
                        formatter={(v: any) => formatBRL(Number(v))}
                        labelFormatter={(v) => `Ano ${v}`}
                        contentStyle={{
                          backgroundColor: "#111827",
                          border: "1px solid #374151",
                          borderRadius: 8,
                          color: "#fff",
                          fontSize: 13,
                        }}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: 12, color: "#9ca3af" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="valorImovel"
                        name="Valor do Imóvel"
                        stroke="#10b981"
                        fill="url(#colorValor)"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="saldoDevedor"
                        name="Saldo Devedor"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="patrimonioLiquido"
                        name="Patrimônio Líquido"
                        stroke="#22d3ee"
                        strokeWidth={2.5}
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}

                {abaAtiva === "custos" && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={resultados.dadosComparativos.map((d) => {
                        const c = resultados.compra.evolucao[d.mes - 1];
                        const a = resultados.aluguel.evolucao[d.mes - 1];
                        return {
                          mes: d.mes,
                          custoCompra: c ? c.custoAcumulado : 0,
                          custoAluguel: a ? a.custoAcumulado : 0,
                        };
                      })}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="mes"
                        stroke="#6b7280"
                        tickFormatter={(v) =>
                          v % 12 === 0 ? `${v / 12}a` : ""
                        }
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis
                        stroke="#6b7280"
                        tickFormatter={formatCompact}
                        tick={{ fontSize: 11 }}
                        width={80}
                      />
                      <Tooltip
                        formatter={(v: any) => formatBRL(Number(v))}
                        labelFormatter={(v) => {
                          const a = Math.floor(v / 12);
                          const m = v % 12;
                          return `${a > 0 ? a + "a " : ""}${m}m`;
                        }}
                        contentStyle={{
                          backgroundColor: "#111827",
                          border: "1px solid #374151",
                          borderRadius: 8,
                          color: "#fff",
                          fontSize: 13,
                        }}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: 12, color: "#9ca3af" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="custoCompra"
                        name="Custo Acum. Compra"
                        stroke="#22d3ee"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="custoAluguel"
                        name="Custo Acum. Aluguel"
                        stroke="#a78bfa"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Resumo detalhado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cenário Comprar */}
              <div className="bg-dash-bg rounded-2xl p-5 border border-cyan-900/30">
                <h3 className="text-base font-semibold text-cyan-400 mb-3">
                  Cenário: Comprar
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-dash-text-light">Financiado</span>
                    <span className="text-dash-text">
                      {formatBRL(valorImovel - entrada)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dash-text-light">Parcela inicial</span>
                    <span className="text-dash-text">
                      {formatBRL(resultados.compra.parcelaInicial)}
                    </span>
                  </div>

                  <div className="border-t border-dash-border my-2" />
                  <div className="flex justify-between">
                    <span className="text-dash-text-light">
                      Total pago financiamento
                    </span>
                    <span className="text-dash-text">
                      {formatBRL(resultados.compra.totalPagoFinanciamento)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dash-text-light">Total em juros</span>
                    <span className="text-red-400">
                      {formatBRL(resultados.compra.totalJurosFinanciamento)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dash-text-light">Custo total</span>
                    <span className="text-dash-text">
                      {formatBRL(resultados.compra.custoTotalCompra)}
                    </span>
                  </div>
                  <div className="border-t border-dash-border my-2" />
                  <div className="flex justify-between font-semibold">
                    <span className="text-dash-text-light">Patrimônio final</span>
                    <span className="text-cyan-400">
                      {formatBRL(resultados.compra.patrimonioFinal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cenário Alugar */}
              <div className="bg-dash-bg rounded-2xl p-5 border border-violet-900/30">
                <h3 className="text-base font-semibold text-violet-400 mb-3">
                  Cenário: Alugar + Investir
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-dash-text-light">Aluguel inicial</span>
                    <span className="text-dash-text">
                      {formatBRL(aluguelInicial)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dash-text-light">
                      Aluguel final (reajustado)
                    </span>
                    <span className="text-dash-text">
                      {formatBRL(
                        resultados.aluguel.evolucao[
                          resultados.aluguel.evolucao.length - 1
                        ]?.aluguel || 0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dash-text-light">
                      Entrada investida inicialmente
                    </span>
                    <span className="text-dash-text">{formatBRL(entrada)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dash-text-light">Rendimento anual</span>
                    <span className="text-dash-text">{rendimentoAnual}% a.a.</span>
                  </div>
                  <div className="border-t border-dash-border my-2" />
                  <div className="flex justify-between">
                    <span className="text-dash-text-light">
                      Total pago em aluguel
                    </span>
                    <span className="text-dash-text">
                      {formatBRL(resultados.aluguel.custoTotalAluguel)}
                    </span>
                  </div>
                  <div className="border-t border-dash-border my-2" />
                  <div className="flex justify-between font-semibold">
                    <span className="text-dash-text-light">
                      Patrimônio financeiro final
                    </span>
                    <span className="text-violet-400">
                      {formatBRL(resultados.aluguel.patrimonioFinal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Aviso */}
            <div className="bg-dash-bg/50 rounded-xl p-4 border border-dash-border text-xs text-dash-text-muted leading-relaxed">
              <strong className="text-dash-text-light">Nota importante:</strong> Esta
              simulação é uma ferramenta de apoio à decisão e não constitui
              recomendação financeira. Os resultados dependem das premissas
              informadas (taxas, valorização, rendimentos). Fatores como ITBI,
              escritura, corretagem, imposto de renda sobre investimentos, custo
              de oportunidade do tempo, e aspectos emocionais/qualidade de vida
              não estão contemplados. Consulte um assessor financeiro para uma
              análise personalizada.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
