/**
 * ARVO — Escada Patrimonial v3
 * Página única com scroll progressivo
 *
 * Seções:
 *  1. Questionário de Suitability (8 perguntas, scoring automático → perfil)
 *  2. Dados Financeiros (custo de vida, reserva, patrimônio)
 *  3. Motor de Alocação (drag-and-drop de fundos nos potes)
 *  4. Agendamento
 *
 * Dependências npm:
 *   zustand framer-motion @dnd-kit/core @dnd-kit/utilities
 *
 * Integração:
 *   Coloque arvo-store-v3.ts e este arquivo em app/escada/
 *   e crie um page.tsx com: export { default } from "./ArvoPageV3"
 */

"use client";

import React, {
  useMemo,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useDroppable,
  useDraggable,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";

import {
  useArvoStoreV3,
  SUITABILITY_QUESTIONS,
  FUNDS_LIBRARY,
  PROFILE_BANDS,
  STEP_ORDER,
  BUCKET_COLORS,
  BUCKET_META,
  scoreToProfile,
} from "./arvo-store-v3";

import type {
  ProfileKey,
  StepKey,
  ExpenseKey,
  FundCard,
  BucketEntry,
  StepStatus,
  Band,
} from "./arvo-store-v3";

// ─── Paleta de cores por bucket ───────────────────────────────────────────────

const COLOR_CLASSES: Record<string, {
  border: string; bg: string; text: string; badge: string;
  dot: string; ring: string; bar: string;
}> = {
  blue: { border: "border-blue-400/40", bg: "bg-blue-500/10", text: "text-blue-200", badge: "bg-blue-500/20 text-blue-200", dot: "bg-blue-400", ring: "ring-blue-400/40", bar: "bg-blue-400" },
  indigo: { border: "border-indigo-400/40", bg: "bg-indigo-500/10", text: "text-indigo-200", badge: "bg-indigo-500/20 text-indigo-200", dot: "bg-indigo-400", ring: "ring-indigo-400/40", bar: "bg-indigo-400" },
  amber: { border: "border-amber-400/40", bg: "bg-amber-500/10", text: "text-amber-200", badge: "bg-amber-500/20 text-amber-200", dot: "bg-amber-400", ring: "ring-amber-400/40", bar: "bg-amber-400" },
  rose: { border: "border-rose-400/40", bg: "bg-rose-500/10", text: "text-rose-200", badge: "bg-rose-500/20 text-rose-200", dot: "bg-rose-400", ring: "ring-rose-400/40", bar: "bg-rose-400" },
  cyan: { border: "border-cyan-400/40", bg: "bg-cyan-500/10", text: "text-cyan-200", badge: "bg-cyan-500/20 text-cyan-200", dot: "bg-cyan-400", ring: "ring-cyan-400/40", bar: "bg-cyan-400" },
  violet: { border: "border-violet-400/40", bg: "bg-violet-500/10", text: "text-violet-200", badge: "bg-violet-500/20 text-violet-200", dot: "bg-violet-400", ring: "ring-violet-400/40", bar: "bg-violet-400" },
};

// ─── Utilitários ──────────────────────────────────────────────────────────────

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency", currency: "BRL", maximumFractionDigits: 0,
});
const fmt = (v: number) => BRL.format(isFinite(v) ? v : 0);
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

// ─── Hook: Cálculos derivados ─────────────────────────────────────────────────

function useComputed() {
  const s = useArvoStoreV3();

  const custoDeVida = useMemo(
    () => s.useCalculatorTotal
      ? Object.values(s.expenses).reduce((a, v) => a + v, 0)
      : s.manualMonthlyCost,
    [s.expenses, s.useCalculatorTotal, s.manualMonthlyCost]
  );

  const metaReserva = custoDeVida * s.multiplicadorReserva;
  const capitalExcedente = Math.max(s.patrimonioAtual - metaReserva, 0);

  // Total por pote
  const bucketTotals = useMemo(() => {
    const result = {} as Record<StepKey, number>;
    for (const key of STEP_ORDER) {
      result[key] = s.buckets[key].reduce((a, e) => a + e.value, 0);
    }
    return result;
  }, [s.buckets]);

  const totalAllocated = useMemo(
    () => Object.values(bucketTotals).reduce((a, v) => a + v, 0),
    [bucketTotals]
  );

  // Percentual real de cada pote sobre o capital progressivo
  const bucketPcts = useMemo(() => {
    const result = {} as Record<StepKey, number>;
    for (const key of STEP_ORDER) {
      if (key === "reserva") {
        result[key] = metaReserva > 0
          ? clamp((bucketTotals.reserva / metaReserva) * 100, 0, 100)
          : 0;
      } else {
        result[key] = capitalExcedente > 0
          ? clamp((bucketTotals[key] / capitalExcedente) * 100, 0, 100)
          : 0;
      }
    }
    return result;
  }, [bucketTotals, metaReserva, capitalExcedente]);

  // Metas por pote (valores em R$)
  const bucketTargets = useMemo(() => {
    if (!s.perfil) return {} as Record<StepKey, number>;
    const bands = PROFILE_BANDS[s.perfil];
    return {
      reserva: metaReserva,
      abrigo: capitalExcedente * (bands.abrigo.target / 100),
      ritmo: capitalExcedente * (bands.ritmo.target / 100),
      vanguarda: capitalExcedente * (bands.vanguarda.target / 100),
      oceano: capitalExcedente * (bands.oceano.target / 100),
    } as Record<StepKey, number>;
  }, [s.perfil, metaReserva, capitalExcedente]);

  // Status de cada pote
  const bucketStatus = useMemo<Record<StepKey, StepStatus>>(() => {
    if (!s.perfil) {
      return {
        reserva: "empty", abrigo: "locked", ritmo: "locked",
        vanguarda: "locked", oceano: "locked",
      };
    }

    const bands = PROFILE_BANDS[s.perfil];
    const result = {} as Record<StepKey, StepStatus>;

    // Reserva: progresso simples em % da meta
    const resPct = bucketPcts.reserva;
    if (resPct === 0) result.reserva = "empty";
    else if (resPct < 100) result.reserva = "filling";
    else result.reserva = "in_range";

    const reservaOk = resPct >= 100;

    const nonReserve: Exclude<StepKey, "reserva">[] = [
      "abrigo", "ritmo", "vanguarda", "oceano",
    ];

    for (let i = 0; i < nonReserve.length; i++) {
      const step = nonReserve[i];
      const band = bands[step];

      // Pote de target 0 = não aplicável
      if (band.target === 0 && band.max <= 5) {
        // Oceano para conservador: não aplicável mas pode receber pouco
        if (band.max === 0) { result[step] = "not_applicable"; continue; }
      }

      // Pote anterior dentro da banda?
      const prevStep = i === 0 ? "reserva" : nonReserve[i - 1];
      const prevStatus = result[prevStep];
      const prevOk = prevStatus === "in_range" || prevStatus === "not_applicable" ||
        (prevStep === "reserva" ? reservaOk : false);

      if (!prevOk && !(prevStep === "reserva" && reservaOk)) {
        result[step] = "locked";
        continue;
      }

      const pct = bucketPcts[step];
      if (pct === 0) { result[step] = "empty"; continue; }
      if (pct < band.min) { result[step] = "filling"; continue; }
      if (pct > band.max) { result[step] = "over_range"; continue; }
      result[step] = "in_range";
    }

    return result;
  }, [s.perfil, bucketPcts]);

  // Engrenagem completa: todos os potes aplicáveis dentro da banda
  const engineComplete = useMemo(() => {
    if (!s.perfil) return false;
    return STEP_ORDER.every((step) => {
      const st = bucketStatus[step];
      return st === "in_range" || st === "not_applicable";
    });
  }, [s.perfil, bucketStatus]);

  // Progresso geral (0-100)
  const overallProgress = useMemo(() => {
    const statuses = STEP_ORDER.map((s) => bucketStatus[s]);
    const applicable = statuses.filter((st) => st !== "not_applicable");
    if (applicable.length === 0) return 0;
    const done = applicable.filter(
      (st) => st === "in_range"
    ).length;
    return (done / applicable.length) * 100;
  }, [bucketStatus]);

  return {
    custoDeVida, metaReserva, capitalExcedente,
    bucketTotals, totalAllocated, bucketPcts,
    bucketTargets, bucketStatus, engineComplete, overallProgress,
  };
}

// ─── CurrencyInput ─────────────────────────────────────────────────────────────

function CurrencyInput({
  value, onChange, disabled = false, placeholder = "R$ 0", className = "",
}: {
  value: number; onChange: (v: number) => void;
  disabled?: boolean; placeholder?: string; className?: string;
}) {
  const [focused, setFocused] = useState(false);
  const [raw, setRaw] = useState("");
  return (
    <input
      type="text" inputMode="numeric"
      value={focused ? raw : value > 0 ? fmt(value) : ""}
      placeholder={placeholder} disabled={disabled}
      onChange={(e) => setRaw(e.target.value.replace(/\D/g, ""))}
      onFocus={() => { setFocused(true); setRaw(value > 0 ? String(value) : ""); }}
      onBlur={() => { setFocused(false); onChange(parseInt(raw, 10) || 0); }}
      className={`w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 disabled:opacity-40 ${className}`}
    />
  );
}

// ─── ProgressBar ──────────────────────────────────────────────────────────────

function Bar({ value, color = "white", className = "" }: {
  value: number; color?: string; className?: string;
}) {
  return (
    <div className={`h-2 overflow-hidden rounded-full bg-white/8 ${className}`}>
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${clamp(value, 0, 100)}%` }}
        transition={{ type: "spring", stiffness: 100, damping: 18 }}
      />
    </div>
  );
}

// ─── Seção 1: Questionário de Suitability ────────────────────────────────────

function SectionQuiz({ sectionRef }: { sectionRef: React.RefObject<HTMLDivElement> }) {
  const { quizAnswers, quizComplete, perfil, answerQuestion, finishQuiz, resetQuiz } =
    useArvoStoreV3();

  const [currentQ, setCurrentQ] = useState(0);
  const total = SUITABILITY_QUESTIONS.length;
  const q = SUITABILITY_QUESTIONS[currentQ];

  const answered = quizAnswers[q?.id];
  const allAnswered = SUITABILITY_QUESTIONS.every((q) => quizAnswers[q.id] !== undefined);

  const PROFILE_LABELS: Record<ProfileKey, string> = {
    conservador: "Conservador",
    moderado_conservador: "Moderado Conservador",
    moderado: "Moderado",
    arrojado: "Arrojado",
  };

  const PROFILE_DESC: Record<ProfileKey, string> = {
    conservador: "Prioridade máxima em proteção, liquidez e estabilidade. Crescimento vem depois da segurança.",
    moderado_conservador: "Equilíbrio entre proteção e crescimento, com base sólida antes de qualquer risco.",
    moderado: "Aceita oscilações para buscar retornos mais expressivos com método e diversificação.",
    arrojado: "Tolerância a volatilidade alta, horizonte longo e convicção na construção patrimonial.",
  };

  if (quizComplete && perfil) {
    const colors = COLOR_CLASSES[
      perfil === "conservador" ? "blue"
        : perfil === "moderado_conservador" ? "indigo"
          : perfil === "moderado" ? "amber"
            : "rose"
    ];
    return (
      <div ref={sectionRef} className="mx-auto max-w-xl py-20 text-center">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-500">
            Seu perfil ARVO
          </div>
          <div className={`inline-block rounded-2xl border ${colors.border} ${colors.bg} px-8 py-6`}>
            <div className={`text-4xl font-bold ${colors.text}`}>
              {PROFILE_LABELS[perfil]}
            </div>
          </div>
          <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-slate-400">
            {PROFILE_DESC[perfil]}
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <button
              onClick={resetQuiz}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-400 hover:text-white"
            >
              Refazer o teste
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="mx-auto max-w-xl py-16">
      {/* Progresso */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex-1">
          <div className="mb-1.5 flex items-center justify-between text-xs text-slate-500">
            <span>Suitability ARVO</span>
            <span>{currentQ + 1} / {total}</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-white/8">
            <motion.div
              className="h-full rounded-full bg-white/40"
              animate={{ width: `${((currentQ + 1) / total) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Pergunta */}
      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <h2 className="mb-7 text-2xl font-semibold leading-snug text-white">
            {q.text}
          </h2>

          <div className="space-y-3">
            {q.options.map((opt) => {
              const selected = answered === opt.points;
              return (
                <motion.button
                  key={opt.points}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    answerQuestion(q.id, opt.points);
                    // Avança automaticamente após 320ms
                    setTimeout(() => {
                      if (currentQ < total - 1) {
                        setCurrentQ((c) => c + 1);
                      }
                    }, 320);
                  }}
                  className={`flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition-all duration-150 ${selected
                    ? "border-white/30 bg-white/8 ring-1 ring-white/15"
                    : "border-white/8 bg-white/2 hover:border-white/15 hover:bg-white/5"
                    }`}
                >
                  <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${selected ? "border-white bg-white text-slate-950 font-bold" : "border-white/20 text-slate-600"
                    }`}>
                    {selected ? "✓" : ""}
                  </span>
                  <span className="text-sm leading-relaxed text-slate-200">
                    {opt.text}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Navegação */}
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => setCurrentQ((c) => Math.max(0, c - 1))}
              disabled={currentQ === 0}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-400 disabled:opacity-30 hover:text-white"
            >
              ← Anterior
            </button>

            {currentQ < total - 1 ? (
              <button
                onClick={() => setCurrentQ((c) => c + 1)}
                disabled={!answered}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-400 disabled:opacity-30 hover:text-white"
              >
                Próxima →
              </button>
            ) : (
              <button
                onClick={finishQuiz}
                disabled={!allAnswered}
                className={`rounded-xl px-5 py-2.5 text-sm font-medium transition ${allAnswered ? "bg-white text-slate-950 hover:bg-slate-100" : "cursor-not-allowed bg-white/5 text-slate-600"
                  }`}
              >
                Ver meu perfil →
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Seção 2: Dados Financeiros ───────────────────────────────────────────────

function SectionDados({
  sectionRef, computed,
}: {
  sectionRef: React.RefObject<HTMLDivElement>;
  computed: ReturnType<typeof useComputed>;
}) {
  const {
    quizComplete, expenses, setExpense, useCalculatorTotal,
    setUseCalculatorTotal, manualMonthlyCost, setManualMonthlyCost,
    multiplicadorReserva, setMultiplicadorReserva,
    rendaMensal, setRendaMensal, patrimonioAtual, setPatrimonioAtual,
    dadosComplete, confirmDados,
  } = useArvoStoreV3();

  const EXPENSE_LABELS: Record<ExpenseKey, string> = {
    moradia: "Moradia / aluguel", contas: "Condomínio e contas",
    supermercado: "Supermercado", cartao: "Cartão de crédito",
    transporte: "Transporte", saude: "Saúde",
    educacao: "Educação / filhos", lazer: "Lazer", outros: "Outros",
  };

  const multipliers = [
    { v: 6 as const, label: "6×", help: "CLT / renda estável" },
    { v: 9 as const, label: "9×", help: "Estabilidade intermediária" },
    { v: 12 as const, label: "12×", help: "PJ / empresário" },
    { v: 18 as const, label: "18×", help: "Alta instabilidade" },
  ];

  const canConfirm = patrimonioAtual > 0 && computed.custoDeVida > 0;

  if (!quizComplete) {
    return (
      <div ref={sectionRef} className="mx-auto max-w-2xl py-16 opacity-40 pointer-events-none">
        <div className="rounded-3xl border border-white/5 bg-white/2 p-8 text-center text-slate-600">
          Complete o questionário de perfil para desbloquear esta etapa.
        </div>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="mx-auto max-w-3xl py-16">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Etapa 2</div>
        <h2 className="mt-1 text-3xl font-semibold text-white">Dados financeiros</h2>
        <p className="mt-2 text-slate-400">
          Esses números definem as metas de cada pote da sua escada.
        </p>
      </div>

      <div className="space-y-6">
        {/* Renda + Patrimônio */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm text-slate-300">Renda mensal</label>
            <CurrencyInput value={rendaMensal} onChange={setRendaMensal} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-slate-300">Patrimônio atual total</label>
            <CurrencyInput value={patrimonioAtual} onChange={setPatrimonioAtual} />
          </div>
        </div>

        {/* Custo de vida */}
        <div className="rounded-2xl border border-white/8 bg-white/2 p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="text-sm font-medium text-white">Custo de vida mensal</div>
            <div className="inline-flex rounded-xl border border-white/8 bg-slate-950 p-1">
              {[true, false].map((v) => (
                <button key={String(v)} onClick={() => setUseCalculatorTotal(v)}
                  className={`rounded-lg px-3 py-1.5 text-xs transition ${useCalculatorTotal === v ? "bg-white text-slate-950 font-medium" : "text-slate-400"
                    }`}
                >
                  {v ? "Calculadora" : "Manual"}
                </button>
              ))}
            </div>
          </div>

          {useCalculatorTotal ? (
            <div className="grid gap-3 sm:grid-cols-3">
              {(Object.keys(EXPENSE_LABELS) as ExpenseKey[]).map((key) => (
                <div key={key}>
                  <label className="mb-1 block text-xs text-slate-500">{EXPENSE_LABELS[key]}</label>
                  <CurrencyInput value={expenses[key]} onChange={(v) => setExpense(key, v)} />
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-xs">
              <CurrencyInput value={manualMonthlyCost} onChange={setManualMonthlyCost} />
            </div>
          )}

          <div className="mt-4 flex items-center justify-between rounded-xl border border-white/8 bg-black/20 px-4 py-3">
            <span className="text-xs text-slate-500">Total mensal</span>
            <span className="text-lg font-semibold text-white">{fmt(computed.custoDeVida)}</span>
          </div>
        </div>

        {/* Multiplicador */}
        <div>
          <div className="mb-3 text-sm font-medium text-white">Multiplicador da reserva</div>
          <div className="grid grid-cols-4 gap-2">
            {multipliers.map(({ v, label, help }) => (
              <button key={v} onClick={() => setMultiplicadorReserva(v)}
                className={`rounded-2xl border p-4 text-left transition ${multiplicadorReserva === v
                  ? "border-blue-400/40 bg-blue-500/10 ring-1 ring-blue-400/20"
                  : "border-white/8 bg-white/2 hover:border-white/15"
                  }`}
              >
                <div className="text-2xl font-bold text-white">{label}</div>
                <div className="mt-1 text-[10px] text-slate-500">{help}</div>
              </button>
            ))}
          </div>

          {computed.custoDeVida > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { label: "Custo mensal", value: fmt(computed.custoDeVida) },
                { label: "Multiplicador", value: `${multiplicadorReserva}×` },
                { label: "Reserva-alvo", value: fmt(computed.metaReserva) },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl border border-white/8 bg-white/3 px-3 py-2.5">
                  <div className="text-[10px] uppercase tracking-widest text-slate-600">{label}</div>
                  <div className="mt-0.5 font-semibold text-white">{value}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <motion.button
            whileTap={canConfirm ? { scale: 0.97 } : {}}
            onClick={confirmDados} disabled={!canConfirm}
            className={`rounded-xl px-6 py-3 text-sm font-medium transition ${canConfirm ? "bg-white text-slate-950 hover:bg-slate-100" : "cursor-not-allowed bg-white/5 text-slate-600"
              }`}
          >
            Ir para o Motor de Alocação →
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// ─── FundCardDraggable ────────────────────────────────────────────────────────

function FundCardDraggable({ fund, allocated }: { fund: FundCard; allocated: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `fund-${fund.id}`,
    data: { type: "fund", fundId: fund.id },
    disabled: allocated,
  });
  const colors = COLOR_CLASSES[fund.color];

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: transform
          ? `translate(${transform.x}px,${transform.y}px)`
          : undefined,
        opacity: isDragging ? 0.3 : allocated ? 0.4 : 1,
      }}
      className={`relative cursor-grab select-none rounded-2xl border p-3.5 transition active:cursor-grabbing ${allocated ? "border-white/5 bg-white/2" : `${colors.border} ${colors.bg} hover:ring-1 ${colors.ring}`
        }`}
    >
      <div className={`mb-1 flex items-center gap-1.5`}>
        <span className={`h-2 w-2 rounded-full ${colors.dot}`} />
        <span className="text-[10px] uppercase tracking-[0.14em] text-slate-500">
          {fund.type}
        </span>
      </div>
      <div className="text-sm font-medium leading-snug text-white">{fund.shortName}</div>
      <div className="mt-1 text-xs text-slate-400">{fund.yield12m}</div>
      <div className="mt-2 flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i}
            className={`h-1 w-3 rounded-full ${i < fund.risk ? colors.bar : "bg-white/8"}`}
          />
        ))}
      </div>
      {allocated && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/30">
          <span className="text-[10px] text-slate-500">alocado</span>
        </div>
      )}
    </div>
  );
}

// ─── BucketDropZone ────────────────────────────────────────────────────────────

function BucketDropZone({
  stepKey, status, computed,
}: {
  stepKey: StepKey;
  status: StepStatus;
  computed: ReturnType<typeof useComputed>;
}) {
  const store = useArvoStoreV3();
  const { setNodeRef, isOver } = useDroppable({
    id: `bucket-${stepKey}`,
    disabled: status === "locked" || status === "not_applicable",
  });

  const meta = BUCKET_META[stepKey];
  const color = BUCKET_COLORS[stepKey];
  const colors = COLOR_CLASSES[color];

  const total = computed.bucketTotals[stepKey] ?? 0;
  const pct = computed.bucketPcts[stepKey] ?? 0;
  const target = computed.bucketTargets[stepKey] ?? 0;
  const entries = store.buckets[stepKey];

  const band =
    stepKey !== "reserva" && store.perfil
      ? PROFILE_BANDS[store.perfil][stepKey as Exclude<StepKey, "reserva">]
      : null;

  const statusLabel: Record<StepStatus, string> = {
    locked: "Bloqueado",
    empty: "Vazio",
    filling: "Preenchendo",
    in_range: "Na faixa ✓",
    over_range: "Acima da faixa ⚠",
    not_applicable: "N/A ao perfil",
  };

  const statusColorClass: Record<StepStatus, string> = {
    locked: "border-white/5 text-slate-600",
    empty: "border-white/10 text-slate-500",
    filling: `${colors.border} ${colors.text}`,
    in_range: "border-emerald-400/40 text-emerald-200",
    over_range: "border-amber-400/40 text-amber-200",
    not_applicable: "border-white/5 text-slate-700",
  };

  const borderClass =
    status === "locked" ? "border-white/5"
      : status === "not_applicable" ? "border-white/5"
        : status === "in_range" ? "border-emerald-400/30"
          : isOver ? `${colors.border} ring-1 ${colors.ring}`
            : colors.border;

  const bgClass =
    status === "locked" || status === "not_applicable" ? "bg-white/1"
      : status === "in_range" ? "bg-emerald-500/5"
        : isOver ? colors.bg
          : "bg-white/2";

  const barColor =
    status === "in_range" ? "bg-emerald-400"
      : status === "over_range" ? "bg-amber-400"
        : colors.bar;

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-3xl border transition-all duration-200 ${borderClass} ${bgClass} ${status === "locked" || status === "not_applicable" ? "opacity-60" : ""
        }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 border-b border-white/5 p-4">
        <div>
          <div className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${colors.dot}`} />
            <span className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
              {meta.title}
            </span>
          </div>
          <div className="mt-0.5 text-sm font-medium text-white">{meta.subtitle}</div>
        </div>
        <span className={`rounded-full border px-2 py-0.5 text-[10px] ${statusColorClass[status]}`}>
          {statusLabel[status]}
        </span>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 gap-2 p-3">
        <div className="rounded-xl bg-black/20 px-3 py-2">
          <div className="text-[10px] text-slate-600">Total</div>
          <div className="text-sm font-semibold text-white">{fmt(total)}</div>
        </div>
        <div className="rounded-xl bg-black/20 px-3 py-2">
          <div className="text-[10px] text-slate-600">
            {stepKey === "reserva" ? "Meta" : "Faixa ideal"}
          </div>
          <div className="text-sm font-semibold text-white">
            {stepKey === "reserva"
              ? fmt(target)
              : band
                ? `${band.min}–${band.max}%`
                : "—"}
          </div>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="px-3 pb-2">
        <div className="mb-1 flex items-center justify-between text-[10px] text-slate-600">
          <span>{Math.round(pct)}%</span>
          {band && (
            <span className={pct >= band.min && pct <= band.max ? "text-emerald-500" : "text-amber-500"}>
              target {band.target}%
            </span>
          )}
        </div>
        <div className="relative h-2.5 overflow-hidden rounded-full bg-white/8">
          {/* Faixa aceitável */}
          {band && (
            <div
              className="absolute inset-y-0 bg-white/5 rounded-full"
              style={{ left: `${band.min}%`, width: `${band.max - band.min}%` }}
            />
          )}
          <motion.div
            className={`absolute inset-y-0 left-0 rounded-full ${barColor}`}
            animate={{ width: `${clamp(pct, 0, 100)}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 18 }}
          />
        </div>
      </div>

      {/* Fundos alocados */}
      <div className="flex-1 px-3 pb-3">
        {entries.length === 0 ? (
          <div className={`flex items-center justify-center rounded-xl border-2 border-dashed py-5 text-xs text-slate-700 transition ${status !== "locked" && status !== "not_applicable"
            ? "border-white/8 hover:border-white/15"
            : "border-white/4"
            }`}>
            {status === "locked" ? "🔒 Desbloqueie a etapa anterior"
              : status === "not_applicable" ? "Não aplicável a este perfil"
                : "← Arraste fundos para cá"}
          </div>
        ) : (
          <div className="space-y-1.5">
            {entries.map((entry) => (
              <BucketEntryRow
                key={entry.entryId}
                entry={entry}
                bucketKey={stepKey}
                colors={colors}
              />
            ))}
          </div>
        )}

        {/* Adicionar fundo externo */}
        {status !== "locked" && status !== "not_applicable" && (
          <button
            onClick={() => store.openPendingAllocation(null, stepKey)}
            className="mt-2 w-full rounded-xl border border-dashed border-white/10 py-2 text-xs text-slate-600 transition hover:border-white/20 hover:text-slate-400"
          >
            + Fundo externo / não listado
          </button>
        )}
      </div>
    </div>
  );
}

// ─── BucketEntryRow ───────────────────────────────────────────────────────────

function BucketEntryRow({ entry, bucketKey, colors }: {
  entry: BucketEntry; bucketKey: StepKey;
  colors: typeof COLOR_CLASSES[string];
}) {
  const { openEditEntry, removeEntry } = useArvoStoreV3();
  const fund = entry.fundId ? FUNDS_LIBRARY.find((f) => f.id === entry.fundId) : null;

  return (
    <div className={`flex items-center justify-between gap-2 rounded-xl border ${colors.border} ${colors.bg} px-3 py-2`}>
      <div className="min-w-0">
        <div className="truncate text-xs font-medium text-white">
          {fund ? fund.shortName : entry.customName ?? "Fundo externo"}
        </div>
        <div className="text-[10px] text-slate-500">
          {fund ? fund.type : "Externo"}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <span className="text-xs font-semibold text-white">{fmt(entry.value)}</span>
        <button
          onClick={() => openEditEntry(bucketKey, entry.entryId)}
          className="rounded-lg border border-white/10 px-1.5 py-0.5 text-[10px] text-slate-500 hover:text-white"
        >
          editar
        </button>
        <button
          onClick={() => removeEntry(bucketKey, entry.entryId)}
          className="rounded-lg border border-white/10 px-1.5 py-0.5 text-[10px] text-rose-600 hover:text-rose-400"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// ─── Modal de confirmação de alocação ─────────────────────────────────────────

function AllocationModal({ computed }: { computed: ReturnType<typeof useComputed> }) {
  const { pendingAllocation, editingEntry, buckets,
    confirmAllocation, cancelPendingAllocation,
    updateEntryValue, cancelEditEntry, patrimonioAtual } = useArvoStoreV3();

  const [val, setVal] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!editingEntry;
  const isOpen = !!pendingAllocation || isEditing;

  useEffect(() => {
    if (isOpen) {
      setVal(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (editingEntry) {
      const entry = buckets[editingEntry.bucketKey]
        .find((e) => e.entryId === editingEntry.entryId);
      if (entry) setVal(entry.value);
    }
  }, [editingEntry, buckets]);

  if (!isOpen) return null;

  const fund = pendingAllocation?.fundId
    ? FUNDS_LIBRARY.find((f) => f.id === pendingAllocation.fundId)
    : null;

  const bucketKey = (pendingAllocation?.bucketKey ?? editingEntry?.bucketKey)!;
  const totalOthers = STEP_ORDER
    .flatMap((k) => buckets[k])
    .filter((e) => editingEntry ? e.entryId !== editingEntry.entryId : true)
    .reduce((a, e) => a + e.value, 0);
  const maxAvailable = Math.max(0, patrimonioAtual - totalOthers);

  function handleConfirm() {
    if (val <= 0) return;
    const v = Math.min(val, maxAvailable);
    if (isEditing && editingEntry) {
      updateEntryValue(editingEntry.bucketKey, editingEntry.entryId, v);
    } else {
      confirmAllocation(v);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
        onClick={isEditing ? cancelEditEntry : cancelPendingAllocation}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#0d1f35] p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-5">
            <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
              {isEditing ? "Editar alocação" : "Adicionar ao pote"}
            </div>
            <h3 className="mt-1 text-lg font-semibold text-white">
              {fund ? fund.name
                : pendingAllocation?.customName
                  ? pendingAllocation.customName
                  : "Fundo externo"}
            </h3>
            <div className="mt-1 text-sm text-slate-400">
              Pote: <span className="text-white">{BUCKET_META[bucketKey].title}</span>
            </div>
          </div>

          {!isEditing && !pendingAllocation?.fundId && (
            <div className="mb-4">
              <label className="mb-1.5 block text-sm text-slate-400">Nome do fundo</label>
              <input
                type="text"
                placeholder="Ex: Tesouro IPCA+ 2035"
                defaultValue={pendingAllocation?.customName ?? ""}
                onChange={(e) => {
                  useArvoStoreV3.setState((s) => ({
                    pendingAllocation: s.pendingAllocation
                      ? { ...s.pendingAllocation, customName: e.target.value }
                      : null,
                  }));
                }}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/50"
              />
            </div>
          )}

          <div className="mb-2">
            <label className="mb-1.5 block text-sm text-slate-400">
              Quanto você tem neste fundo?
            </label>
            <CurrencyInput
              value={val}
              onChange={setVal}
              className="text-base"
            />
            <p className="mt-1.5 text-xs text-slate-600">
              Disponível: {fmt(maxAvailable)}
            </p>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              onClick={isEditing ? cancelEditEntry : cancelPendingAllocation}
              className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={val <= 0}
              className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition ${val > 0 ? "bg-white text-slate-950 hover:bg-slate-100" : "cursor-not-allowed bg-white/5 text-slate-600"
                }`}
            >
              Confirmar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Seção 3: Motor de Alocação ───────────────────────────────────────────────

function SectionMotor({
  sectionRef, computed,
}: {
  sectionRef: React.RefObject<HTMLDivElement>;
  computed: ReturnType<typeof useComputed>;
}) {
  const store = useArvoStoreV3();
  const [filterCategory, setFilterCategory] = useState<StepKey | "all">("all");
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  // Quais fundos já foram alocados em algum pote
  const allocatedFundIds = useMemo(() => {
    const ids = new Set<string>();
    for (const key of STEP_ORDER) {
      for (const entry of store.buckets[key]) {
        if (entry.fundId) ids.add(entry.fundId);
      }
    }
    return ids;
  }, [store.buckets]);

  const visibleFunds = useMemo(() =>
    filterCategory === "all"
      ? FUNDS_LIBRARY
      : FUNDS_LIBRARY.filter((f) => f.category === filterCategory),
    [filterCategory]
  );

  const activeFund = activeDragId
    ? FUNDS_LIBRARY.find((f) => `fund-${f.id}` === activeDragId)
    : null;

  function handleDragStart(e: DragStartEvent) {
    setActiveDragId(e.active.id as string);
  }

  function handleDragEnd(e: DragEndEvent) {
    setActiveDragId(null);
    const { over, active } = e;
    if (!over) return;
    const bucketKey = (over.id as string).replace("bucket-", "") as StepKey;
    const fundId = (active.id as string).replace("fund-", "");
    store.openPendingAllocation(fundId, bucketKey);
  }

  if (!store.dadosComplete) {
    return (
      <div ref={sectionRef} className="mx-auto max-w-5xl py-16 opacity-40 pointer-events-none">
        <div className="rounded-3xl border border-white/5 bg-white/2 p-8 text-center text-slate-600">
          Preencha os dados financeiros para ativar o Motor de Alocação.
        </div>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="mx-auto max-w-7xl py-16">
      {/* Header da seção */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Etapa 3</div>
          <h2 className="mt-1 text-3xl font-semibold text-white">Motor de Alocação</h2>
          <p className="mt-1.5 max-w-xl text-sm text-slate-400">
            Arraste os fundos para os potes. A engrenagem fica perfeita quando
            cada pote estiver dentro da faixa ideal para o seu perfil.
          </p>
        </div>

        {/* Progresso da engrenagem */}
        <div className="rounded-2xl border border-white/8 bg-white/3 px-5 py-3 text-right">
          <div className="text-xs text-slate-500">Engrenagem</div>
          <div className={`mt-0.5 text-3xl font-bold ${computed.engineComplete ? "text-emerald-400" : "text-white"}`}>
            {Math.round(computed.overallProgress)}%
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/8">
            <motion.div
              className={computed.engineComplete ? "h-full rounded-full bg-emerald-400" : "h-full rounded-full bg-white/60"}
              animate={{ width: `${computed.overallProgress}%` }}
              transition={{ type: "spring", stiffness: 80, damping: 16 }}
            />
          </div>
          {computed.engineComplete && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-[10px] font-medium text-emerald-400"
            >
              ⚙️ Engrenagem completa!
            </motion.div>
          )}
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* ── Biblioteca de Fundos ── */}
        <div className="mb-8 rounded-3xl border border-white/8 bg-white/2 p-5">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-white">Fundos ARVO</span>
            <div className="flex flex-wrap gap-1.5">
              {([
                { key: "all" as const, label: "Todos" },
                ...STEP_ORDER.map((k) => ({ key: k, label: BUCKET_META[k].title })),
              ]).map(({ key, label }) => {
                const color = key !== "all" ? COLOR_CLASSES[BUCKET_COLORS[key]] : null;
                return (
                  <button key={key} onClick={() => setFilterCategory(key)}
                    className={`rounded-full border px-3 py-1 text-xs transition ${filterCategory === key
                      ? color
                        ? `${color.border} ${color.bg} ${color.text}`
                        : "border-white/20 bg-white/10 text-white"
                      : "border-white/8 text-slate-500 hover:text-slate-300"
                      }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-8">
            {visibleFunds.map((fund) => (
              <FundCardDraggable
                key={fund.id}
                fund={fund}
                allocated={allocatedFundIds.has(fund.id)}
              />
            ))}
          </div>
        </div>

        {/* ── Potes ── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {STEP_ORDER.map((key) => (
            <BucketDropZone
              key={key}
              stepKey={key}
              status={computed.bucketStatus[key]}
              computed={computed}
            />
          ))}
        </div>

        {/* Ghost durante o drag */}
        <DragOverlay dropAnimation={{ duration: 160, easing: "ease-out" }}>
          {activeFund && (
            <div className={`w-32 rounded-2xl border p-3.5 shadow-2xl opacity-95 ${COLOR_CLASSES[activeFund.color].border
              } ${COLOR_CLASSES[activeFund.color].bg}`}>
              <div className="text-sm font-medium text-white">{activeFund.shortName}</div>
              <div className="mt-1 text-xs text-slate-400">{activeFund.yield12m}</div>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Resumo total */}
      <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/8 bg-white/2 px-5 py-3 text-sm">
        <span className="text-slate-400">Total alocado</span>
        <div className="flex items-center gap-4">
          <span className="font-semibold text-white">{fmt(computed.totalAllocated)}</span>
          {computed.totalAllocated > store.patrimonioAtual && (
            <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2.5 py-0.5 text-xs text-amber-200">
              ⚠ Ultrapassa o patrimônio informado
            </span>
          )}
        </div>
      </div>

      {/* CTA para agendar */}
      {computed.engineComplete && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex justify-center"
        >
          <button
            onClick={() => store.setActiveSection("agendamento")}
            className="rounded-2xl bg-emerald-500 px-8 py-3.5 font-medium text-white shadow-lg hover:bg-emerald-400"
          >
            Engrenagem completa — Agendar com a ARVO →
          </button>
        </motion.div>
      )}
    </div>
  );
}

// ─── Seção 4: Agendamento ─────────────────────────────────────────────────────

function SectionAgendamento({ sectionRef }: { sectionRef: React.RefObject<HTMLDivElement> }) {
  const { nome, setNome, email, setEmail, telefone, setTelefone, hasUpload, setHasUpload } =
    useArvoStoreV3();
  const fileRef = useRef<HTMLInputElement>(null);
  const canSubmit = nome && email && telefone;

  return (
    <div ref={sectionRef} className="mx-auto max-w-lg py-16">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-[0.18em] text-emerald-400/80">Etapa 4 — Final</div>
        <h2 className="mt-1 text-3xl font-semibold text-white">Bate-papo com a ARVO</h2>
        <p className="mt-2 text-slate-400">
          Sua escada está montada. Preencha abaixo para a equipe entrar em contato.
        </p>
      </div>

      <div className="space-y-4">
        {[
          { label: "Nome completo", val: nome, set: setNome, ph: "Seu nome" },
          { label: "E-mail", val: email, set: setEmail, ph: "voce@exemplo.com" },
          { label: "Telefone / WhatsApp", val: telefone, set: setTelefone, ph: "(48) 9 9999-9999" },
        ].map(({ label, val, set, ph }) => (
          <div key={label}>
            <label className="mb-1.5 block text-sm text-slate-300">{label}</label>
            <input type="text" value={val} onChange={(e) => set(e.target.value)} placeholder={ph}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-700 focus:border-blue-500/40"
            />
          </div>
        ))}

        <div>
          <label className="mb-1.5 block text-sm text-slate-300">
            Comprovantes{" "}
            <span className="text-slate-600">(recomendado — acelera a validação)</span>
          </label>
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files.length) setHasUpload(true); }}
            className={`cursor-pointer rounded-2xl border-2 border-dashed py-7 text-center transition ${hasUpload ? "border-emerald-400/40 bg-emerald-500/5" : "border-white/10 hover:border-white/20"
              }`}
          >
            <input ref={fileRef} type="file" multiple accept="image/*,.pdf" className="hidden"
              onChange={(e) => e.target.files?.length && setHasUpload(true)}
            />
            {hasUpload
              ? <div className="text-sm text-emerald-300">✓ Comprovante enviado</div>
              : <div className="text-sm text-slate-600">↑ Arraste extratos ou prints da posição</div>}
          </div>
        </div>
      </div>

      <motion.button
        whileTap={canSubmit ? { scale: 0.97 } : {}}
        disabled={!canSubmit}
        onClick={() => canSubmit && alert("Solicitação enviada! A equipe ARVO entrará em contato em breve.")}
        className={`mt-7 w-full rounded-2xl py-4 font-medium transition ${canSubmit ? "bg-emerald-500 text-white hover:bg-emerald-400" : "cursor-not-allowed bg-white/5 text-slate-600"
          }`}
      >
        Solicitar agendamento
      </motion.button>
    </div>
  );
}

// ─── Header Sticky ─────────────────────────────────────────────────────────────

function StickyHeader({ computed }: { computed: ReturnType<typeof useComputed> }) {
  const { quizComplete, dadosComplete, perfil } = useArvoStoreV3();

  const PROFILE_LABELS: Record<ProfileKey, string> = {
    conservador: "Conservador",
    moderado_conservador: "Mod. Conservador",
    moderado: "Moderado",
    arrojado: "Arrojado",
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#07111f]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
        <span className="text-base font-bold text-white">
          ARVO
          <span className="ml-1.5 text-xs font-normal text-slate-600">Escada Patrimonial</span>
        </span>

        <div className="flex items-center gap-3">
          {quizComplete && perfil && (
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
              {PROFILE_LABELS[perfil]}
            </span>
          )}
          {dadosComplete && (
            <div className="flex items-center gap-2">
              <div className="h-1 w-20 overflow-hidden rounded-full bg-white/8">
                <motion.div
                  className={`h-full rounded-full ${computed.engineComplete ? "bg-emerald-400" : "bg-white/50"}`}
                  animate={{ width: `${computed.overallProgress}%` }}
                  transition={{ type: "spring", stiffness: 80, damping: 16 }}
                />
              </div>
              <span className="text-xs text-slate-500">{Math.round(computed.overallProgress)}%</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ArvoPageV3() {
  const computed = useComputed();
  const store = useArvoStoreV3();

  const quizRef = useRef<HTMLDivElement>(null!);
  const dadosRef = useRef<HTMLDivElement>(null!);
  const motorRef = useRef<HTMLDivElement>(null!);
  const agendRef = useRef<HTMLDivElement>(null!);

  // Auto-scroll para a próxima seção desbloqueada
  useEffect(() => {
    if (store.activeSection === "motor" && motorRef.current) {
      motorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (store.activeSection === "agendamento" && agendRef.current) {
      agendRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [store.activeSection]);

  useEffect(() => {
    if (store.quizComplete && !store.dadosComplete && dadosRef.current) {
      dadosRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [store.quizComplete]);

  return (
    <div data-theme="dark" className="min-h-screen bg-[#07111f] text-slate-100">
      <StickyHeader computed={computed} />

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pb-4 pt-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold leading-tight tracking-tight text-white lg:text-6xl">
            Construa seu patrimônio
            <br />
            <span className="text-slate-500">por camadas.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-400">
            Descubra seu perfil, mapeie seus recursos e encaixe cada fundo no
            pote certo. Quando a engrenagem girar, sua escada estará pronta.
          </p>
        </motion.div>
      </section>

      {/* Divisor visual */}
      <div className="mx-auto my-2 max-w-xs border-t border-white/5" />

      {/* Seções */}
      <main className="px-4 sm:px-6">
        <SectionQuiz sectionRef={quizRef} />
        <div className="mx-auto my-4 max-w-xs border-t border-white/5" />
        <SectionDados sectionRef={dadosRef} computed={computed} />
        <div className="mx-auto my-4 max-w-xs border-t border-white/5" />
        <SectionMotor sectionRef={motorRef} computed={computed} />

        <AnimatePresence>
          {computed.engineComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mx-auto my-4 max-w-xs border-t border-white/5" />
              <SectionAgendamento sectionRef={agendRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modal de alocação */}
      <AnimatePresence>
        {(store.pendingAllocation || store.editingEntry) && (
          <AllocationModal computed={computed} />
        )}
      </AnimatePresence>

      <div className="h-24" />
    </div>
  );
}
