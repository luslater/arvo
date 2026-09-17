"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Shield,
  TrendingDown,
  Info,
  AlertTriangle,
  ChevronDown,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ArrowRight
} from "lucide-react";

// ─── Interfaces & Definições ──────────────────────────────────────────────────

interface CarteiraARVO {
  nome: string;
  nominal: number; // % a.a. histórico 36m
  cdi: number; // % do CDI
  vol: number; // volatilidade anualizada %
  caixa: number; // % alocação em caixa/pós-fixado
  cor: string;
}

const CARTEIRAS_ARVO: CarteiraARVO[] = [
  { nome: "Abrigo", nominal: 13.1, cdi: 101, vol: 0.5, caixa: 90, cor: "#8b7355" },
  { nome: "Ritmo", nominal: 13.9, cdi: 109, vol: 1.4, caixa: 74, cor: "#5d8c54" },
  { nome: "Visão", nominal: 14.9, cdi: 118, vol: 3.1, caixa: 50, cor: "#5687af" },
  { nome: "Oceano", nominal: 17.4, cdi: 140, vol: 5.3, caixa: 28, cor: "#3d96ab" }
];

// Formatação oficial conforme padrão ARVO: R$ 20.000,00
const formatarMoeda = (val: number): string => {
  if (!isFinite(val)) return "—";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(val);
};

// Formatação abreviada para eixos do gráfico (ex: R$ 500k, R$ 1,2mi)
const formatarMoedaCurta = (v: number): string => {
  if (!isFinite(v)) return "—";
  if (v >= 1e6) {
    return "R$ " + (v / 1e6).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) + "mi";
  }
  if (v >= 1e3) {
    return "R$ " + (v / 1e3).toLocaleString("pt-BR", { maximumFractionDigits: 0 }) + "k";
  }
  return "R$ " + v.toFixed(0);
};

const formatarPct = (v: number, casas = 1): string => {
  if (!isFinite(v)) return "—";
  return (
    v.toLocaleString("pt-BR", {
      minimumFractionDigits: casas,
      maximumFractionDigits: casas
    }) + "%"
  );
};

// Converte texto em número inteiro em centavos / reais
function parseMoneyInput(val: string): number {
  const digits = val.replace(/\D/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

function formatMoneyInputValue(centsOrUnits: number): string {
  if (!centsOrUnits) return "0,00";
  return (centsOrUnits / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

interface CalculationSuccess {
  erro: null;
  anos: number;
  renda: number;
  atual: number;
  prazo: number;
  rReal: number;
  nominalEf: number;
  im: number;
  T: number;
  nest: number;
  nestNominal: number;
  fvCur: number;
  coverage: number;
  jaAtingiu: boolean;
  gap: number;
  lumpFull: number;
  lump: number;
  mAporte: number;
  aporte: number;
  totalAportado: number;
  primaryLump: boolean;
  swrW: number;
  swrPrincipal: "flat" | "grow" | "draw";
}

interface CalculationError {
  erro: string;
  anos: number;
  renda: number;
  atual: number;
  prazo: number;
  rReal: number;
  nominalEf: number;
  im: number;
  T: number;
}

type CalculationOutput = CalculationSuccess | CalculationError;

// ─── Componente Principal ─────────────────────────────────────────────────────

export function CalculadoraAposentadoriaBase() {
  // Estados do Passo 1: Seu Plano
  const [idadeAtual, setIdadeAtual] = useState<number>(30);
  const [idadeApos, setIdadeApos] = useState<number>(60);
  const [rendaCents, setRendaCents] = useState<number>(300000); // R$ 3.000,00
  const [atualCents, setAtualCents] = useState<number>(0); // R$ 0,00
  const [prazoMeses, setPrazoMeses] = useState<number>(60); // 60 meses

  // Estados do Passo 2: Como Receber
  const [modo, setModo] = useState<"perp" | "cons">("perp");
  const [swrMode, setSwrMode] = useState<"4" | "ret" | "custom">("4");
  const [swrCustom, setSwrCustom] = useState<number>(3.0);
  const [idadeLimite, setIdadeLimite] = useState<number>(90);

  // Estados do Passo 3: Seu Investimento
  const [carteiraIdx, setCarteiraIdx] = useState<number>(2); // Padrão: Visão (idx 2)
  const [isCustomRate, setIsCustomRate] = useState<boolean>(false);
  const [desagio, setDesagio] = useState<number>(3.0); // -3.0 pp
  const [inflacao, setInflacao] = useState<number>(4.5); // 4.5% a.a.
  const [taxaCustom, setTaxaCustom] = useState<number>(7.0); // IPCA + 7.0%

  // Visualização do gráfico: Real vs Nominal
  const [viewMode, setViewMode] = useState<"real" | "nom">("real");

  // Tooltip do gráfico SVG
  const [hoverData, setHoverData] = useState<{
    x: number;
    y: number;
    age: number;
    saldo: number;
    fase: "acumulando" | "recebendo";
  } | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  // ─── Funções Matemáticas de Projeção ──────────────────────────────────────

  const inflDecimal = inflacao / 100;

  // Retorno real histórico (geométrico)
  const calcHistReal = (nominal: number) => {
    return (1 + nominal / 100) / (1 + inflDecimal) - 1;
  };

  // Retorno real projetado após deságio
  const calcProjReal = (nominal: number, des: number) => {
    return Math.max(-0.99, calcHistReal(nominal) - des / 100);
  };

  // Retorno real vigente
  const rReal = useMemo(() => {
    if (isCustomRate) {
      return taxaCustom / 100;
    }
    const cart = CARTEIRAS_ARVO[carteiraIdx] || CARTEIRAS_ARVO[0];
    return calcProjReal(cart.nominal, desagio);
  }, [isCustomRate, taxaCustom, carteiraIdx, inflDecimal, desagio]);

  // Sincroniza campo de taxa projetada quando altera carteira/deságio
  useEffect(() => {
    if (!isCustomRate) {
      const cart = CARTEIRAS_ARVO[carteiraIdx] || CARTEIRAS_ARVO[0];
      const proj = calcProjReal(cart.nominal, desagio) * 100;
      setTaxaCustom(parseFloat(proj.toFixed(1)));
    }
  }, [carteiraIdx, desagio, inflDecimal, isCustomRate]);

  // ─── Motor de Cálculo Completo ────────────────────────────────────────────

  const calculation = useMemo<CalculationOutput>(() => {
    const anos = idadeApos - idadeAtual;
    const renda = rendaCents / 100;
    const atual = atualCents / 100;
    const prazo = Math.max(0, Math.round(prazoMeses));
    const im = Math.pow(1 + rReal, 1 / 12) - 1;
    const T = Math.round(anos * 12);
    const nominalEf = (1 + rReal) * (1 + inflDecimal) - 1;

    let erro: string | null = null;
    if (anos <= 0) {
      erro = "A idade de aposentadoria precisa ser maior que a idade atual.";
    } else if (renda <= 0) {
      erro = "Informe uma renda mensal na aposentadoria maior que zero.";
    } else if (modo === "cons" && idadeLimite <= idadeApos) {
      erro = "A idade limite precisa ser maior que a de aposentadoria.";
    } else if (rReal <= 0 && modo === "perp") {
      erro =
        "Com este retorno, o ganho real é zero ou negativo e não sustenta uma renda perpétua. Reduza o deságio, escolha uma carteira mais arrojada ou selecione “Usar todo o patrimônio”.";
    }

    if (erro) {
      return { erro, anos, renda, atual, prazo, rReal, nominalEf, im, T };
    }

    // Cálculo do montante necessário (Nest Egg)
    let nest = 0;
    let swrW = 0;

    if (modo === "perp") {
      if (swrMode === "ret") {
        swrW = rReal;
        nest = im > 0 ? renda / im : Infinity;
      } else {
        swrW = swrMode === "4" ? 0.04 : swrCustom / 100;
        nest = swrW > 0 ? (renda * 12) / swrW : Infinity;
      }
    } else {
      const mesesDec = Math.round((idadeLimite - idadeApos) * 12);
      nest = im > 0 ? (renda * (1 - Math.pow(1 + im, -mesesDec))) / im : renda * mesesDec;
    }

    const swrPrincipal: "flat" | "grow" | "draw" =
      swrMode === "ret"
        ? "flat"
        : swrW < rReal - 1e-9
        ? "grow"
        : swrW > rReal + 1e-9
        ? "draw"
        : "flat";

    const nestNominal = nest * Math.pow(1 + inflDecimal, anos);
    const fvCur = atual * Math.pow(1 + rReal, anos);
    const coverage = nest > 0 ? fvCur / nest : 0;
    const jaAtingiu = fvCur >= nest - 1e-6;
    const gap = Math.max(0, nest - fvCur);
    const lumpFull = nest / Math.pow(1 + rReal, anos);
    const lump = Math.max(0, lumpFull - atual);

    const mAporte = Math.min(prazo > 0 ? prazo : T, T);
    let aporte = 0;
    if (gap <= 0) {
      aporte = 0;
    } else if (im > 0) {
      const an = (Math.pow(1 + im, mAporte) - 1) / im;
      aporte = gap / (an * Math.pow(1 + im, T - mAporte));
    } else {
      aporte = gap / (mAporte > 0 ? mAporte : 1);
    }

    const totalAportado = aporte * mAporte;
    const primaryLump = prazo === 0;

    return {
      erro: null,
      anos,
      renda,
      atual,
      prazo,
      rReal,
      nominalEf,
      im,
      T,
      nest,
      nestNominal,
      fvCur,
      coverage,
      jaAtingiu,
      gap,
      lumpFull,
      lump,
      mAporte,
      aporte,
      totalAportado,
      primaryLump,
      swrW,
      swrPrincipal
    };
  }, [
    idadeAtual,
    idadeApos,
    rendaCents,
    atualCents,
    prazoMeses,
    rReal,
    inflDecimal,
    modo,
    swrMode,
    swrCustom,
    idadeLimite
  ]);

  // ─── Trajetória da Vida para o Gráfico ────────────────────────────────────

  const trajectory = useMemo(() => {
    if (calculation.erro !== null) {
      return { pts: [], horizonAge: idadeApos + 30 };
    }
    const calc = calculation;

    const horizonAge = modo === "cons" ? idadeLimite : idadeApos + 30;
    const totalM = Math.round((horizonAge - idadeAtual) * 12);
    let saldo = calc.primaryLump ? calc.atual + calc.lump : calc.atual;
    const aporteVal = calc.primaryLump ? 0 : calc.aporte;
    const mAporte = calc.mAporte;
    const im = calc.im;
    const renda = calc.renda;

    const pts: { age: number; saldo: number }[] = [];

    for (let mth = 0; mth <= totalM; mth++) {
      const age = idadeAtual + mth / 12;
      if (mth % 12 === 0 || mth === totalM) {
        pts.push({ age, saldo: Math.max(0, saldo) });
      }

      if (age < idadeApos - 1e-9) {
        saldo = saldo * (1 + im) + (mth < mAporte ? aporteVal : 0);
      } else {
        saldo = saldo * (1 + im) - renda;
        if (saldo < 0) saldo = 0;
      }
    }

    return { pts, horizonAge };
  }, [calculation, modo, idadeLimite, idadeApos, idadeAtual]);

  // ─── Tabela de Sensibilidade ──────────────────────────────────────────────

  const sensibilidade = useMemo(() => {
    if (calculation.erro !== null) return [];
    const calc = calculation;

    const renda = calc.renda;
    const primaryLump = calc.primaryLump;
    const anos = calc.anos;
    const mAporte = calc.mAporte;
    const T = calc.T;

    const vals = CARTEIRAS_ARVO.map((c) => {
      const rr = calcProjReal(c.nominal, desagio);
      const im = Math.pow(1 + rr, 1 / 12) - 1;
      let nest = 0;

      if (modo === "perp") {
        if (swrMode === "ret") {
          nest = im > 0 ? renda / im : Infinity;
        } else {
          const swrRate = swrMode === "4" ? 0.04 : swrCustom / 100;
          nest = swrRate > 0 ? (renda * 12) / swrRate : Infinity;
        }
      } else {
        const md = Math.round((idadeLimite - idadeApos) * 12);
        nest = im > 0 ? (renda * (1 - Math.pow(1 + im, -md))) / im : renda * md;
      }

      let val = 0;
      if (primaryLump) {
        val = isFinite(nest) && rr > -1 ? nest / Math.pow(1 + rr, anos) : Infinity;
      } else {
        if (im > 0) {
          const an = (Math.pow(1 + im, mAporte) - 1) / im;
          val = isFinite(nest) ? nest / (an * Math.pow(1 + im, T - mAporte)) : Infinity;
        } else {
          val = nest / (mAporte > 0 ? mAporte : 1);
        }
      }

      return {
        carteira: c,
        rr,
        val
      };
    });

    let maxVal = 0;
    vals.forEach((v) => {
      if (isFinite(v.val)) maxVal = Math.max(maxVal, v.val);
    });

    return vals.map((v) => ({
      ...v,
      barWidth: isFinite(v.val) && maxVal > 0 ? Math.max(4, (v.val / maxVal) * 100) : 0
    }));
  }, [
    calculation,
    desagio,
    modo,
    swrMode,
    swrCustom,
    idadeLimite,
    idadeApos,
    inflDecimal
  ]);

  // ─── Renderização Gráfica SVG ─────────────────────────────────────────────

  const chartSVGData = useMemo(() => {
    if (!trajectory.pts.length || calculation.erro !== null) return null;

    const W = 760;
    const H = 300;
    const pad = { l: 75, r: 24, t: 26, b: 38 };

    const nominal = viewMode === "nom";
    const pts = trajectory.pts.map((p) => ({
      age: p.age,
      saldo: nominal
        ? p.saldo * Math.pow(1 + inflDecimal, p.age - idadeAtual)
        : p.saldo
    }));

    let maxS = 0;
    pts.forEach((p) => {
      if (p.saldo > maxS) maxS = p.saldo;
    });
    if (maxS <= 0) maxS = 1;

    const a0 = idadeAtual;
    const a1 = trajectory.horizonAge;

    const X = (age: number) => pad.l + ((age - a0) / (a1 - a0)) * (W - pad.l - pad.r);

    // Escala Y amigável
    const e = Math.pow(10, Math.floor(Math.log10(maxS)));
    const f = maxS / e;
    const steps = [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];
    const stepFit = steps.find((s) => f <= s) || 10;
    const yTop = stepFit * e;

    const Yn = (v: number) => H - pad.b - (v / yTop) * (H - pad.t - pad.b);
    const apX = X(idadeApos);

    // Eixos Y
    const yticks = [0, yTop * 0.25, yTop * 0.5, yTop * 0.75, yTop];

    // Eixos X
    const xs = [a0, (a0 + idadeApos) / 2, idadeApos, (idadeApos + a1) / 2, a1];

    // Caminhos SVG
    let accD = "";
    let decD = "";
    let startAcc = false;
    let startDec = false;

    pts.forEach((p) => {
      const x = X(p.age);
      const y = Yn(p.saldo);

      if (p.age <= idadeApos + 1e-6) {
        accD += (startAcc ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1) + " ";
        startAcc = true;
      }
      if (p.age >= idadeApos - 1e-6) {
        decD += (startDec ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1) + " ";
        startDec = true;
      }
    });

    const areaD = accD
      ? `${accD}L ${apX.toFixed(1)} ${H - pad.b} L ${pad.l} ${H - pad.b} Z`
      : "";

    // Ponto de pico (aposentadoria)
    const peakPt = pts.find((p) => Math.abs(p.age - idadeApos) < 0.6) || null;

    return {
      W,
      H,
      pad,
      pts,
      X,
      Yn,
      apX,
      yticks,
      xs,
      accD,
      decD,
      areaD,
      peakPt
    };
  }, [trajectory, calculation, viewMode, inflDecimal, idadeAtual, idadeApos]);

  // Manipulador de mouse no SVG para Tooltip
  const handleSvgMouseMove = (
    e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>
  ) => {
    if (!svgRef.current || !chartSVGData) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;

    const px = clientX - rect.left;
    const sx = px * (760 / rect.width);

    let best = chartSVGData.pts[0];
    let bestDist = 1e9;
    chartSVGData.pts.forEach((p) => {
      const dist = Math.abs(chartSVGData.X(p.age) - sx);
      if (dist < bestDist) {
        bestDist = dist;
        best = p;
      }
    });

    const tipX = chartSVGData.X(best.age) / (760 / rect.width);
    const tipY = chartSVGData.Yn(best.saldo) / (300 / rect.height);
    const fase = best.age < idadeApos ? "acumulando" : "recebendo";

    setHoverData({
      x: tipX,
      y: tipY,
      age: Math.round(best.age),
      saldo: best.saldo,
      fase
    });
  };

  const handleSvgMouseLeave = () => {
    setHoverData(null);
  };

  // ─── Render do Componente ──────────────────────────────────────────────────

  const calcSuccess = calculation.erro === null ? calculation : null;

  return (
    <div className="w-full bg-[#fffdf8] text-[#123044] rounded-[24px] border border-[#e4e0d7] p-4 sm:p-7 md:p-9 shadow-sm font-sans">
      {/* Cabeçalho da Ferramenta */}
      <div className="border-b border-[#e4e0d7] pb-6 mb-8">
        <div className="flex items-center gap-2.5 mb-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e9f1ec] text-[#1f674f] font-bold text-xs tracking-wider uppercase border border-[#cfe2d8]">
            <Shield className="w-3.5 h-3.5" />
            Coast FIRE Brasil
          </span>
          <span className="text-xs text-[#6b7280] font-medium hidden sm:inline">
            · Filosofia ARVO
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#123044]">
          Aposentadoria Base
        </h1>
        <p className="text-sm sm:text-base text-[#4a5568] mt-2 max-w-4xl leading-relaxed">
          Descubra quanto investir hoje, ou por mês durante um tempo determinado, para que o
          capital acumulado cresça sozinho e sustente sua renda na aposentadoria. Cálculos
          rigorosamente em <strong>poder de compra de hoje</strong> com as carteiras de modelo ARVO.
        </p>
      </div>

      {/* Grid Principal: Controles (Esquerda) vs Resultados (Direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================================= */}
        {/* COLUNA ESQUERDA: CONTROLES & ENTRADAS (lg:col-span-5) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 space-y-6 bg-white p-5 sm:p-6 rounded-2xl border border-[#e4e0d7] shadow-xs sticky top-4">
          {/* PASSO 1: SEU PLANO */}
          <section>
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ece1] mb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#f0ece1] text-[#1f674f] font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#123044]">
                  Seu Plano
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-[#8d97a5] uppercase tracking-wide">
                Reais de hoje
              </span>
            </div>

            <div className="space-y-4">
              {/* Idade Atual e Aposentadoria */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                    Idade atual
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={90}
                      value={idadeAtual}
                      onChange={(e) => setIdadeAtual(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-[#f6f4ef] border border-[#d8d3c5] rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#123044] focus:outline-none focus:ring-2 focus:ring-[#1f674f]"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-[#8d97a5] pointer-events-none">
                      anos
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                    Aposentadoria
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={idadeApos}
                      onChange={(e) => setIdadeApos(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-full bg-[#f6f4ef] border border-[#d8d3c5] rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#123044] focus:outline-none focus:ring-2 focus:ring-[#1f674f]"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-[#8d97a5] pointer-events-none">
                      anos
                    </span>
                  </div>
                </div>
              </div>

              {/* Renda Desejada na Aposentadoria */}
              <div>
                <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                  Renda mensal na aposentadoria
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-bold text-[#8d97a5] pointer-events-none">
                    R$
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formatMoneyInputValue(rendaCents)}
                    onChange={(e) => setRendaCents(parseMoneyInput(e.target.value))}
                    className="w-full bg-[#f6f4ef] border border-[#d8d3c5] rounded-xl pl-10 pr-16 py-2.5 text-sm font-bold text-[#123044] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#1f674f]"
                  />
                  <span className="absolute right-3 text-xs text-[#8d97a5] pointer-events-none font-medium">
                    /mês
                  </span>
                </div>
                <p className="text-[11px] text-[#6b7280] mt-1">
                  Poder de compra mensal a ser garantido eternamente ou pelo período escolhido.
                </p>
              </div>

              {/* Patrimônio Atual Investido */}
              <div>
                <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                  Quanto você já tem investido
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-bold text-[#8d97a5] pointer-events-none">
                    R$
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formatMoneyInputValue(atualCents)}
                    onChange={(e) => setAtualCents(parseMoneyInput(e.target.value))}
                    className="w-full bg-[#f6f4ef] border border-[#d8d3c5] rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold text-[#123044] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#1f674f]"
                  />
                </div>
                <p className="text-[11px] text-[#6b7280] mt-1">
                  Sem contar a reserva de emergência. Deixe 0 se está começando agora.
                </p>
              </div>

              {/* Prazo de Aportes */}
              <div>
                <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                  Por quanto tempo quer aportar?
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={prazoMeses}
                    onChange={(e) => setPrazoMeses(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-[#f6f4ef] border border-[#d8d3c5] rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#123044] focus:outline-none focus:ring-2 focus:ring-[#1f674f]"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-[#8d97a5] pointer-events-none">
                    meses
                  </span>
                </div>
                <p className="text-[11px] text-[#6b7280] mt-1">
                  Aportes corrigidos pela inflação. Coloque <strong>0</strong> se desejar fazer um único investimento hoje (lump-sum).
                </p>
              </div>
            </div>
          </section>

          {/* PASSO 2: COMO RECEBER */}
          <section className="pt-5 border-t border-[#f0ece1]">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#f0ece1] mb-4">
              <span className="w-6 h-6 rounded-full bg-[#f0ece1] text-[#1f674f] font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#123044]">
                Como Receber
              </h2>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-2.5">
                <button
                  type="button"
                  onClick={() => setModo("perp")}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-start justify-between ${
                    modo === "perp"
                      ? "border-[#1f674f] bg-[#e9f1ec] text-[#144937]"
                      : "border-[#e4e0d7] bg-white hover:bg-[#faf9f6]"
                  }`}
                >
                  <div className="pr-2">
                    <div className="font-bold text-sm text-[#123044]">Preservar o principal</div>
                    <div className="text-xs text-[#6b7280] mt-0.5 leading-snug">
                      Renda perpétua sem prazo final, mantendo o poder de compra e gerando herança.
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 mt-0.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      modo === "perp" ? "border-[#1f674f]" : "border-[#cbd5e1]"
                    }`}
                  >
                    {modo === "perp" && <div className="w-2 h-2 rounded-full bg-[#1f674f]" />}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setModo("cons")}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-start justify-between ${
                    modo === "cons"
                      ? "border-[#1f674f] bg-[#e9f1ec] text-[#144937]"
                      : "border-[#e4e0d7] bg-white hover:bg-[#faf9f6]"
                  }`}
                >
                  <div className="pr-2">
                    <div className="font-bold text-sm text-[#123044]">Usar todo o patrimônio</div>
                    <div className="text-xs text-[#6b7280] mt-0.5 leading-snug">
                      Receber até uma idade limite programada e consumir todo o saldo até zerar.
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 mt-0.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      modo === "cons" ? "border-[#1f674f]" : "border-[#cbd5e1]"
                    }`}
                  >
                    {modo === "cons" && <div className="w-2 h-2 rounded-full bg-[#1f674f]" />}
                  </div>
                </button>
              </div>

              {/* Subopções para Preservar o Principal (SWR) */}
              {modo === "perp" && (
                <div className="mt-3 bg-[#faf9f6] p-3.5 rounded-xl border border-[#e4e0d7] space-y-2.5">
                  <label className="block text-xs font-semibold text-[#4a5568]">
                    Taxa anual de retirada (SWR)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSwrMode("4")}
                      className={`py-2 px-1 text-center rounded-lg border text-xs transition-all ${
                        swrMode === "4"
                          ? "bg-[#1f674f] text-white font-bold border-[#1f674f]"
                          : "bg-white text-[#4a5568] border-[#d8d3c5] hover:bg-[#f0ece1]"
                      }`}
                    >
                      <div>4% a.a.</div>
                      <div className="text-[10px] opacity-80">Clássica</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSwrMode("ret")}
                      className={`py-2 px-1 text-center rounded-lg border text-xs transition-all ${
                        swrMode === "ret"
                          ? "bg-[#1f674f] text-white font-bold border-[#1f674f]"
                          : "bg-white text-[#4a5568] border-[#d8d3c5] hover:bg-[#f0ece1]"
                      }`}
                    >
                      <div>Da carteira</div>
                      <div className="text-[10px] opacity-80">= Rendimento</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSwrMode("custom")}
                      className={`py-2 px-1 text-center rounded-lg border text-xs transition-all ${
                        swrMode === "custom"
                          ? "bg-[#1f674f] text-white font-bold border-[#1f674f]"
                          : "bg-white text-[#4a5568] border-[#d8d3c5] hover:bg-[#f0ece1]"
                      }`}
                    >
                      <div>Outra</div>
                      <div className="text-[10px] opacity-80">Personalizar</div>
                    </button>
                  </div>

                  {swrMode === "custom" && (
                    <div className="relative mt-2">
                      <input
                        type="number"
                        min={1}
                        max={15}
                        step={0.1}
                        value={swrCustom}
                        onChange={(e) => setSwrCustom(parseFloat(e.target.value) || 3)}
                        className="w-full bg-white border border-[#d8d3c5] rounded-lg px-3 py-1.5 text-xs font-bold text-[#123044] focus:outline-none focus:ring-2 focus:ring-[#1f674f]"
                      />
                      <span className="absolute right-3 top-1.5 text-xs text-[#8d97a5]">
                        % a.a.
                      </span>
                    </div>
                  )}

                  <p className="text-[11px] text-[#6b7280]">
                    {swrMode === "ret"
                      ? `Você saca o rendimento real projetado (${formatarPct(
                          rReal * 100
                        )}). O poder de compra do patrimônio é mantido intacto.`
                      : `Sacar ${formatarPct(
                          (swrMode === "4" ? 0.04 : swrCustom / 100) * 100
                        )} ao ano. ${
                          calcSuccess?.swrPrincipal === "grow"
                            ? "Menos que o rendimento, portanto o patrimônio continuará crescendo em poder de compra."
                            : calcSuccess?.swrPrincipal === "draw"
                            ? "Superior ao rendimento real projetado; haverá consumo gradual do saldo."
                            : "Mantém o patrimônio constante em termos reais."
                        }`}
                  </p>
                </div>
              )}

              {/* Idade Limite se Consumir */}
              {modo === "cons" && (
                <div className="mt-3 bg-[#faf9f6] p-3.5 rounded-xl border border-[#e4e0d7]">
                  <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                    Idade limite (fim do recebimento)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={idadeApos + 1}
                      max={120}
                      value={idadeLimite}
                      onChange={(e) => setIdadeLimite(parseInt(e.target.value) || 90)}
                      className="w-full bg-white border border-[#d8d3c5] rounded-xl px-3 py-2 text-sm font-bold text-[#123044] focus:outline-none focus:ring-2 focus:ring-[#1f674f]"
                    />
                    <span className="absolute right-3 top-2 text-xs text-[#8d97a5]">
                      anos
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6b7280] mt-1">
                    O capital sustentará sua renda dos {idadeApos} até os {idadeLimite} anos,
                    zerando no final.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* PASSO 3: SEU INVESTIMENTO */}
          <section className="pt-5 border-t border-[#f0ece1]">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ece1] mb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#f0ece1] text-[#1f674f] font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#123044]">
                  Seu Investimento
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomRate(!isCustomRate)}
                className="text-[11px] font-semibold text-[#1f674f] hover:underline"
              >
                {isCustomRate ? "Usar carteira ARVO" : "Usar taxa própria"}
              </button>
            </div>

            <div className="space-y-4">
              {/* Seleção de Carteira ARVO */}
              {!isCustomRate ? (
                <div>
                  <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">
                    Carteira ARVO recomendada
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {CARTEIRAS_ARVO.map((c, idx) => {
                      const sel = idx === carteiraIdx;
                      const proj = calcProjReal(c.nominal, desagio) * 100;
                      return (
                        <button
                          key={c.nome}
                          type="button"
                          onClick={() => setCarteiraIdx(idx)}
                          className={`p-2 rounded-xl border text-center transition-all ${
                            sel
                              ? "bg-[#1f674f] text-white border-[#1f674f] shadow-xs"
                              : "bg-white text-[#123044] border-[#e4e0d7] hover:bg-[#faf9f6]"
                          }`}
                        >
                          <div className="font-bold text-xs">{c.nome}</div>
                          <div
                            className={`text-[10px] mt-0.5 font-semibold ${
                              sel ? "text-white/90" : "text-[#1f674f]"
                            }`}
                          >
                            IPCA+{formatarPct(proj, 1).replace("%", "")}
                          </div>
                          <div
                            className={`text-[9px] mt-0.5 ${
                              sel ? "text-white/70" : "text-[#8d97a5]"
                            }`}
                          >
                            hist. {formatarPct(c.nominal, 1)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-[#f6f4ef] rounded-xl border border-[#d8d3c5]">
                  <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                    Taxa real personalizada (IPCA +)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-bold text-[#1f674f]">
                      IPCA +
                    </span>
                    <input
                      type="number"
                      step={0.1}
                      min={0}
                      max={15}
                      value={taxaCustom}
                      onChange={(e) => setTaxaCustom(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-[#d8d3c5] rounded-lg pl-16 pr-8 py-1.5 text-xs font-bold text-[#123044] focus:outline-none focus:ring-2 focus:ring-[#1f674f]"
                    />
                    <span className="absolute right-3 top-2 text-xs text-[#8d97a5]">
                      %
                    </span>
                  </div>
                </div>
              )}

              {/* Slider de Deságio */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#4a5568]">
                    Deságio de projeção
                  </label>
                  <span className="text-xs font-bold text-[#1f674f] tabular-nums">
                    −{desagio.toLocaleString("pt-BR", { minimumFractionDigits: 1 })} pp
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={8}
                  step={0.5}
                  value={desagio}
                  onChange={(e) => {
                    setIsCustomRate(false);
                    setDesagio(parseFloat(e.target.value));
                  }}
                  className="w-full accent-[#1f674f] cursor-pointer"
                />
                <p className="text-[11px] text-[#6b7280] mt-1 leading-snug">
                  Reduz o retorno histórico dos últimos 36 meses para projetar com prudência
                  defensiva (ciclos longos de juros).
                </p>
              </div>

              {/* Inflação Média e Retorno Efetivo */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                    Inflação média
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step={0.1}
                      min={0}
                      max={30}
                      value={inflacao}
                      onChange={(e) => setInflacao(parseFloat(e.target.value) || 0)}
                      className="w-full bg-[#f6f4ef] border border-[#d8d3c5] rounded-xl px-3 py-2 text-xs font-bold text-[#123044] focus:outline-none focus:ring-2 focus:ring-[#1f674f]"
                    />
                    <span className="absolute right-2.5 top-2 text-[11px] text-[#8d97a5]">
                      % a.a.
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                    Ganho real líquido
                  </label>
                  <div className="bg-[#e9f1ec] border border-[#cfe2d8] rounded-xl px-3 py-2 text-xs font-bold text-[#1f674f] flex items-center justify-between">
                    <span>IPCA +</span>
                    <span className="tabular-nums">{formatarPct(rReal * 100, 1)}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ========================================================================= */}
        {/* COLUNA DIREITA: RESULTADOS & PROJEÇÃO (lg:col-span-7) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 space-y-6">
          {/* Mensagem de Erro, se houver */}
          {calculation.erro && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{calculation.erro}</span>
            </div>
          )}

          {calcSuccess && (
            <>
              {/* HERO CARD PRINCIPAL */}
              <div className="bg-gradient-to-br from-[#e9f1ec] to-[#d8eade] border border-[#cfe2d8] rounded-2xl p-6 sm:p-7 shadow-xs">
                <div className="text-xs font-bold uppercase tracking-widest text-[#1f674f] mb-1">
                  {calcSuccess.jaAtingiu
                    ? "Você já atingiu o Coast FIRE"
                    : calcSuccess.primaryLump
                    ? "Valor Necessário Hoje (Aporte Único)"
                    : "Seu Aporte Mensal Recomendado"}
                </div>

                <div className="text-2xl sm:text-4xl lg:text-[40px] font-extrabold text-[#144937] tracking-tight tabular-nums mt-2 flex items-baseline flex-wrap gap-x-1.5 break-words">
                  <span>
                    {calcSuccess.jaAtingiu
                      ? "Meta Garantida"
                      : calcSuccess.primaryLump
                      ? formatarMoeda(calcSuccess.lump)
                      : formatarMoeda(calcSuccess.aporte)}
                  </span>
                  {!calcSuccess.jaAtingiu && !calcSuccess.primaryLump && (
                    <span className="text-sm sm:text-lg lg:text-xl font-bold text-[#1f674f]">
                      /mês
                    </span>
                  )}
                </div>

                <p className="text-sm sm:text-base text-[#2d3748] mt-3 leading-relaxed">
                  {calcSuccess.jaAtingiu
                    ? "O valor que você já possui investido crescerá com os juros compostos reais e cobrirá toda a sua renda planejada sem necessidade de novos aportes."
                    : calcSuccess.primaryLump
                    ? `${
                        calcSuccess.atual > 0 ? "Somado ao que você já tem, " : "Investido de uma só vez hoje, "
                      }cresce sozinho pela força do tempo e garante ${formatarMoeda(
                        calcSuccess.renda
                      )}/mês a partir dos ${idadeApos} anos.`
                    : `Aporte durante ${calcSuccess.mAporte} meses (${(
                        calcSuccess.mAporte / 12
                      ).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} anos) e depois deixe o patrimônio acumulado render sozinho até sua aposentadoria.`}
                </p>

                {/* Chips de Resumo */}
                <div className="flex flex-wrap gap-2 mt-5">
                  {calcSuccess.atual > 0 && !calcSuccess.jaAtingiu && (
                    <span className="bg-white/90 border border-[#cfe2d8] text-xs text-[#123044] px-3 py-1 rounded-full font-medium shadow-2xs">
                      Você já cobre{" "}
                      <strong>{formatarPct(calcSuccess.coverage * 100, 0)}</strong> da meta
                    </span>
                  )}
                  {!calcSuccess.jaAtingiu && (
                    <>
                      {calcSuccess.primaryLump ? (
                        <span className="bg-white/90 border border-[#cfe2d8] text-xs text-[#123044] px-3 py-1 rounded-full font-medium shadow-2xs">
                          Capital total hoje:{" "}
                          <strong>{formatarMoeda(calcSuccess.lumpFull)}</strong>
                        </span>
                      ) : (
                        <>
                          <span className="bg-white/90 border border-[#cfe2d8] text-xs text-[#123044] px-3 py-1 rounded-full font-medium shadow-2xs">
                            Total a aportar:{" "}
                            <strong>{formatarMoeda(calcSuccess.totalAportado)}</strong>
                          </span>
                          {calcSuccess.lump > 0 && (
                            <span className="bg-white/90 border border-[#cfe2d8] text-xs text-[#123044] px-3 py-1 rounded-full font-medium shadow-2xs">
                              Ou <strong>{formatarMoeda(calcSuccess.lump)}</strong> à vista
                            </span>
                          )}
                        </>
                      )}
                    </>
                  )}
                  <span className="bg-white/90 border border-[#cfe2d8] text-xs text-[#123044] px-3 py-1 rounded-full font-medium shadow-2xs">
                    Retorno Real:{" "}
                    <strong>IPCA + {formatarPct(calcSuccess.rReal * 100, 1)}</strong>
                  </span>
                </div>
              </div>

              {/* 3 STAT CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#e4e0d7] shadow-xs min-w-0 flex flex-col justify-between overflow-hidden">
                  <div>
                    <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#8d97a5]">
                      Patrimônio na Aposentadoria
                    </div>
                    <div className="text-base sm:text-[17px] xl:text-lg font-extrabold text-[#123044] mt-1.5 tabular-nums tracking-tight break-words">
                      {formatarMoeda(calcSuccess.nest)}
                    </div>
                  </div>
                  <div className="text-[11px] text-[#6b7280] mt-2 leading-snug break-words">
                    Em valores de hoje · {formatarMoeda(calcSuccess.nestNominal)} nominais aos{" "}
                    {idadeApos} anos
                  </div>
                </div>

                <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#e4e0d7] shadow-xs min-w-0 flex flex-col justify-between overflow-hidden">
                  <div>
                    <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#8d97a5]">
                      Retorno Real Projetado
                    </div>
                    <div className="text-base sm:text-[17px] xl:text-lg font-extrabold text-[#1f674f] mt-1.5 tabular-nums tracking-tight break-words">
                      IPCA + {formatarPct(calcSuccess.rReal * 100, 1)}
                    </div>
                  </div>
                  <div className="text-[11px] text-[#6b7280] mt-2 leading-snug break-words">
                    = {formatarPct(calcSuccess.nominalEf * 100, 1)} nominal ao ano com IPCA de{" "}
                    {formatarPct(inflacao, 1)}
                  </div>
                </div>

                <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#e4e0d7] shadow-xs min-w-0 flex flex-col justify-between overflow-hidden">
                  <div>
                    <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#8d97a5]">
                      {modo === "perp" ? "Renda Perpétua" : `Renda até os ${idadeLimite} anos`}
                    </div>
                    <div className="text-base sm:text-[17px] xl:text-lg font-extrabold text-[#123044] mt-1.5 tabular-nums tracking-tight flex items-baseline flex-wrap gap-x-1">
                      <span>{formatarMoeda(calcSuccess.renda)}</span>
                      <span className="text-xs font-semibold text-[#8d97a5]">/mês</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-[#6b7280] mt-2 leading-snug break-words">
                    {modo === "perp"
                      ? `Taxa de retirada de ${formatarPct(calcSuccess.swrW * 100, 1)} a.a.`
                      : "Consome o principal até zerar"}
                  </div>
                </div>
              </div>

              {/* Alerta de Retorno Otimista */}
              {calcSuccess.rReal > 0.06 && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong>Retorno real elevado (IPCA + {formatarPct(calcSuccess.rReal * 100, 1)}).</strong>{" "}
                    Projetar esse retorno líquido por {calcSuccess.anos} anos é um cenário otimista.
                    Na ARVO, recomendamos manter o deságio para ter uma margem de segurança
                    adequada.
                  </div>
                </div>
              )}

              {/* GRÁFICO INTERATIVO DE EVOLUÇÃO */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e4e0d7] shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-[#123044]">
                      O tempo trabalhando a seu favor
                    </h3>
                    <p className="text-xs text-[#6b7280] mt-0.5">
                      {modo === "perp"
                        ? "Fase de acumulação e fase de usufruto mantendo o capital."
                        : `Fase de acumulação e usufruto até os ${idadeLimite} anos.`}{" "}
                      {viewMode === "nom"
                        ? "Valores nominais (com inflação)."
                        : "Valores de hoje (em poder de compra real)."}
                    </p>
                  </div>

                  {/* Toggle Real / Nominal */}
                  <div className="inline-flex bg-[#f6f4ef] p-1 rounded-full border border-[#e4e0d7] self-start">
                    <button
                      type="button"
                      onClick={() => setViewMode("real")}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        viewMode === "real"
                          ? "bg-white text-[#1f674f] shadow-xs"
                          : "text-[#6b7280] hover:text-[#123044]"
                      }`}
                    >
                      Real
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("nom")}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        viewMode === "nom"
                          ? "bg-white text-[#1f674f] shadow-xs"
                          : "text-[#6b7280] hover:text-[#123044]"
                      }`}
                    >
                      Nominal
                    </button>
                  </div>
                </div>

                {/* Legenda do Gráfico */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#6b7280] mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-1 bg-[#1f674f] rounded-full" />
                    <span>Saldo acumulando</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-1 bg-[#5687af] rounded-full" />
                    <span>Fase de recebimento</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full border-2 border-[#123044] bg-white" />
                    <span>Aposentadoria ({idadeApos} anos)</span>
                  </div>
                </div>

                {/* Container do SVG com Tooltip */}
                <div className="relative w-full overflow-hidden">
                  {chartSVGData && (
                    <svg
                      ref={svgRef}
                      viewBox="0 0 760 300"
                      className="w-full h-auto cursor-crosshair select-none"
                      onMouseMove={handleSvgMouseMove}
                      onMouseLeave={handleSvgMouseLeave}
                      onTouchMove={handleSvgMouseMove}
                      onTouchEnd={handleSvgMouseLeave}
                    >
                      <defs>
                        <linearGradient id="arvoAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#1f674f" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#1f674f" stopOpacity="0.01" />
                        </linearGradient>
                      </defs>

                      {/* Linhas de Grade Horizontais e Textos Y */}
                      {chartSVGData.yticks.map((tick, i) => {
                        const y = chartSVGData.Yn(tick);
                        return (
                          <g key={i}>
                            <line
                              x1={chartSVGData.pad.l}
                              y1={y}
                              x2={760 - chartSVGData.pad.r}
                              y2={y}
                              stroke="#e5e7eb"
                              strokeWidth={1}
                            />
                            <text
                              x={chartSVGData.pad.l - 8}
                              y={y + 4}
                              textAnchor="end"
                              fontSize={11}
                              fill="#8d97a5"
                              fontFamily="inherit"
                            >
                              {formatarMoedaCurta(tick)}
                            </text>
                          </g>
                        );
                      })}

                      {/* Textos X (Idades) */}
                      {chartSVGData.xs.map((xVal, i) => (
                        <text
                          key={i}
                          x={chartSVGData.X(xVal)}
                          y={300 - chartSVGData.pad.b + 18}
                          textAnchor="middle"
                          fontSize={11}
                          fill="#8d97a5"
                          fontFamily="inherit"
                        >
                          {Math.round(xVal)}
                        </text>
                      ))}

                      {/* Legenda Eixo X */}
                      <text
                        x={(chartSVGData.pad.l + 760 - chartSVGData.pad.r) / 2}
                        y={298}
                        textAnchor="middle"
                        fontSize={10}
                        fontWeight="600"
                        letterSpacing={1}
                        fill="#8d97a5"
                        fontFamily="inherit"
                      >
                        IDADE (ANOS)
                      </text>

                      {/* Linha Divisória de Aposentadoria */}
                      <line
                        x1={chartSVGData.apX}
                        y1={chartSVGData.pad.t}
                        x2={chartSVGData.apX}
                        y2={300 - chartSVGData.pad.b}
                        stroke="#94a3b8"
                        strokeWidth={1.5}
                        strokeDasharray="4 4"
                      />
                      <text
                        x={chartSVGData.apX}
                        y={chartSVGData.pad.t - 5}
                        textAnchor="middle"
                        fontSize={10.5}
                        fontWeight="600"
                        fill="#64748b"
                        fontFamily="inherit"
                      >
                        Aposenta aos {idadeApos}
                      </text>

                      {/* Área Preenchida da Fase de Acumulação */}
                      {chartSVGData.areaD && (
                        <path d={chartSVGData.areaD} fill="url(#arvoAreaGrad)" />
                      )}

                      {/* Curva de Acumulação (Verde ARVO) */}
                      {chartSVGData.accD && (
                        <path
                          d={chartSVGData.accD}
                          fill="none"
                          stroke="#1f674f"
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      )}

                      {/* Curva de Usufruto/Distribuição (Azul) */}
                      {chartSVGData.decD && (
                        <path
                          d={chartSVGData.decD}
                          fill="none"
                          stroke="#5687af"
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      )}

                      {/* Marcador do Ponto de Aposentadoria */}
                      {chartSVGData.peakPt && (
                        <circle
                          cx={chartSVGData.X(chartSVGData.peakPt.age)}
                          cy={chartSVGData.Yn(chartSVGData.peakPt.saldo)}
                          r={4.5}
                          fill="#5687af"
                          stroke="#ffffff"
                          strokeWidth={2}
                        />
                      )}
                    </svg>
                  )}

                  {/* Tooltip Flutuante */}
                  {hoverData && (
                    <div
                      className="absolute pointer-events-none bg-[#123044] text-white text-xs px-3 py-2 rounded-xl shadow-lg transform -translate-x-1/2 -translate-y-full mb-2 z-10 whitespace-nowrap"
                      style={{
                        left: `${hoverData.x}px`,
                        top: `${hoverData.y}px`
                      }}
                    >
                      <div className="font-bold">
                        {hoverData.age} anos · {hoverData.fase}
                      </div>
                      <div className="text-emerald-300 font-extrabold text-sm tabular-nums mt-0.5">
                        {formatarMoeda(hoverData.saldo)}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* TABELA DE SENSIBILIDADE ENTRE AS CARTEIRAS ARVO */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e4e0d7] shadow-xs">
                <h3 className="text-base font-bold text-[#123044]">
                  Sensibilidade por Carteira ARVO
                </h3>
                <p className="text-xs text-[#6b7280] mt-1 mb-4 leading-relaxed">
                  O valor necessário varia de acordo com o perfil de risco e alocação de cada
                  carteira. Veja o impacto com o deságio de prudência aplicado.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#e4e0d7] text-[#8d97a5] uppercase text-[10px] tracking-wider">
                        <th className="pb-2.5 font-bold">Carteira</th>
                        <th className="pb-2.5 font-bold text-right">Retorno Real</th>
                        <th className="pb-2.5 font-bold text-right">
                          {calcSuccess?.primaryLump ? "Valor Hoje" : "Aporte Mensal"}
                        </th>
                        <th className="pb-2.5 font-bold w-1/3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0ece1]">
                      {sensibilidade.map((item, idx) => {
                        const isCurrent = !isCustomRate && idx === carteiraIdx;
                        return (
                          <tr
                            key={item.carteira.nome}
                            onClick={() => {
                              setIsCustomRate(false);
                              setCarteiraIdx(idx);
                            }}
                            className={`cursor-pointer transition-colors ${
                              isCurrent
                                ? "bg-[#e9f1ec]/60 font-bold"
                                : "hover:bg-[#faf9f6]"
                            }`}
                          >
                            <td className="py-3 pr-2">
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-2.5 h-2.5 rounded-sm"
                                  style={{ backgroundColor: item.carteira.cor }}
                                />
                                <span className="text-[#123044]">{item.carteira.nome}</span>
                                {isCurrent && (
                                  <span className="text-[10px] text-[#1f674f] bg-[#e9f1ec] px-1.5 py-0.5 rounded font-bold">
                                    Selecionada
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 text-right text-[#4a5568] tabular-nums font-semibold">
                              IPCA + {formatarPct(item.rr * 100, 1)}
                            </td>
                            <td className="py-3 text-right text-[#123044] tabular-nums font-bold">
                              {isFinite(item.val) && item.rr > 0
                                ? formatarMoeda(item.val)
                                : "—"}
                            </td>
                            <td className="py-3 pl-4">
                              <div className="w-full bg-[#f0ece1] h-2 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-300"
                                  style={{
                                    width: `${item.barWidth}%`,
                                    backgroundColor: item.carteira.cor
                                  }}
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ACCORDION DE PREMISSAS E LIMITES */}
              <details className="group bg-white border border-[#e4e0d7] rounded-2xl overflow-hidden transition-all">
                <summary className="p-4 sm:p-5 flex items-center justify-between cursor-pointer font-bold text-sm text-[#123044] select-none hover:bg-[#faf9f6]">
                  <span>Premissas e limites desta simulação</span>
                  <ChevronDown className="w-4 h-4 text-[#8d97a5] transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <div className="p-4 sm:p-5 pt-0 border-t border-[#f0ece1] text-xs text-[#4a5568] space-y-3 leading-relaxed">
                  <p>
                    <strong>Cálculos em termos reais:</strong> Todo o planejamento é formulado em
                    poder de compra de hoje. Na prática, os aportes mensais devem ser reajustados
                    anualmente pela inflação acumulada para manter o efeito exponencial.
                  </p>
                  <p>
                    <strong>Deságio de projeção:</strong> O histórico de 36 meses das carteiras
                    ARVO reflete um período de taxa Selic elevada no Brasil. Por prudência,
                    aplicamos o deságio para não extrapolar taxas pontuais por 30 a 60 anos.
                  </p>
                  <p>
                    <strong>Horizonte e comportamento:</strong> No Brasil não há figura jurídica de
                    trust perpétuo vinculante; a disciplina de manter o capital intocado até a
                    aposentadoria é familiar e comportamental.
                  </p>
                  <p>
                    <strong>Retorno passado:</strong> Rentabilidade obtida no passado não representa
                    garantia de resultados futuros. As simulações servem de balizador estratégico.
                  </p>
                </div>
              </details>
            </>
          )}

          {/* Rodapé e Disclaimer */}
          <footer className="text-[11px] text-[#8d97a5] leading-relaxed pt-3 border-t border-[#e4e0d7]">
            Ferramenta educacional da ARVO, Orientação Financeira Fee-Only e Independente. Não
            constitui oferta de valores mobiliários nem recomendação individualizada de investimento.
            Todos os cálculos são expressos em termos reais (poder de compra atual).
          </footer>
        </div>
      </div>
    </div>
  );
}

export default CalculadoraAposentadoriaBase;
