/**
 * ARVO – Escada Patrimonial v2
 * Single-page interativa com questionário, potes drag-and-drop e ranges
 *
 * Stack: Next.js (App Router) · TypeScript · Tailwind CSS
 *        Zustand · Framer Motion · HTML5 Drag & Drop
 */

"use client";

import React, { useState, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useArvoStore,
  QUIZ_QUESTIONS,
  FUND_CATALOG,
  FUND_BY_ID,
  PROFILE_WEIGHTS,
  ALLOCATION_RANGES,
  STEP_ORDER,
  STEP_LABELS,
  EXPENSE_LABELS,
  PROFILE_LABELS,
  computeProfileFromScore,
  type StepKey,
  type ProfileKey,
  type ExpenseKey,
  type ReserveMultiplier,
  type FundDef,
  type PotFund,
} from "./arvo-escada-store";

// ─── Cor helpers ─────────────────────────────────────────────────────────────

const LAYER_COLORS: Record<string, { bg: string; border: string; text: string; badge: string; ring: string; fill: string }> = {
  blue: { bg: "bg-blue-500/12", border: "border-blue-400/40", text: "text-blue-300", badge: "bg-blue-500/20 text-blue-200", ring: "ring-blue-400/30", fill: "bg-blue-500" },
  indigo: { bg: "bg-indigo-500/12", border: "border-indigo-400/40", text: "text-indigo-300", badge: "bg-indigo-500/20 text-indigo-200", ring: "ring-indigo-400/30", fill: "bg-indigo-500" },
  emerald: { bg: "bg-emerald-500/12", border: "border-emerald-400/40", text: "text-emerald-300", badge: "bg-emerald-500/20 text-emerald-200", ring: "ring-emerald-400/30", fill: "bg-emerald-500" },
  amber: { bg: "bg-amber-500/12", border: "border-amber-400/40", text: "text-amber-300", badge: "bg-amber-500/20 text-amber-200", ring: "ring-amber-400/30", fill: "bg-amber-500" },
  cyan: { bg: "bg-cyan-500/12", border: "border-cyan-400/40", text: "text-cyan-300", badge: "bg-cyan-500/20 text-cyan-200", ring: "ring-cyan-400/30", fill: "bg-cyan-500" },
};

function getLayerColor(color: string) {
  return LAYER_COLORS[color] ?? LAYER_COLORS.blue;
}

// ─── Formatação ──────────────────────────────────────────────────────────────

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

function fmt(value: number): string {
  return BRL.format(Number.isFinite(value) ? value : 0);
}

// ─── Componentes shared ──────────────────────────────────────────────────────

function SectionShell({
  id,
  locked,
  children,
  className = "",
}: {
  id: string;
  locked?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: locked ? 0.35 : 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`relative mx-auto max-w-5xl px-4 py-16 sm:px-6 ${className}`}
    >
      {locked && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div className="rounded-2xl bg-white/10 px-6 py-3 text-sm font-medium text-slate-300 backdrop-blur-sm">
            🔒 Complete a etapa anterior para desbloquear
          </div>
        </div>
      )}
      <div className={locked ? "pointer-events-none select-none blur-[2px]" : ""}>
        {children}
      </div>
    </motion.section>
  );
}

function SectionBadge({ children, color = "blue" }: { children: React.ReactNode; color?: string }) {
  const c = getLayerColor(color);
  return (
    <span className={`inline-block rounded-full border ${c.border} ${c.badge} px-3 py-1 text-xs uppercase tracking-[0.18em]`}>
      {children}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-4 text-3xl font-bold text-white">{children}</h2>;
}

function SectionSub({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 max-w-2xl text-slate-300">{children}</p>;
}

function CurrencyInput({
  value,
  onChange,
  disabled = false,
  placeholder = "R$ 0",
  className = "",
}: {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}) {
  const [focused, setFocused] = useState(false);
  const [raw, setRaw] = useState("");

  const displayValue = focused ? raw : value > 0 ? fmt(value) : "";

  return (
    <input
      type="text"
      inputMode="numeric"
      value={displayValue}
      onChange={(e) => setRaw(e.target.value.replace(/\D/g, ""))}
      onFocus={() => { setFocused(true); setRaw(value > 0 ? String(value) : ""); }}
      onBlur={() => { setFocused(false); const p = parseInt(raw, 10); onChange(isNaN(p) ? 0 : p); }}
      disabled={disabled}
      placeholder={placeholder}
      className={`w-full rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/60 focus:ring-1 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    />
  );
}

function PrimaryButton({
  onClick,
  disabled,
  children,
}: {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl px-6 py-3 text-sm font-semibold transition ${disabled
          ? "cursor-not-allowed bg-white/8 text-slate-500"
          : "bg-white text-slate-950 hover:bg-slate-100 active:bg-slate-200"
        }`}
    >
      {children}
    </motion.button>
  );
}

function SecondaryButton({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="mx-auto my-2 h-px max-w-5xl bg-gradient-to-r from-transparent via-white/10 to-transparent" />;
}

// ─── Progress Header ─────────────────────────────────────────────────────────

function ProgressHeader({ activeSection }: { activeSection: number }) {
  const labels = ["Perfil", "Custo de vida", "Raio-X", "Alocação", "Agendar"];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07111f]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-3">
        <span className="text-lg font-bold text-white">
          ARVO
          <span className="ml-1.5 text-xs font-normal text-slate-400">Escada Patrimonial</span>
        </span>

        <div className="flex flex-1 items-center gap-1 overflow-x-auto">
          {labels.map((label, i) => {
            const done = i < activeSection;
            const current = i === activeSection;
            return (
              <a
                key={label}
                href={`#section-${i}`}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs transition ${current
                    ? "bg-white/15 text-white"
                    : done
                      ? "text-slate-300 hover:text-white"
                      : "text-slate-500"
                  }`}
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold ${done
                      ? "bg-emerald-500 text-white"
                      : current
                        ? "bg-white/25 text-white"
                        : "bg-white/10 text-slate-500"
                    }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span className="hidden sm:inline">{label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </header>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SEÇÃO 1 — QUESTIONÁRIO DE PERFIL
// ═════════════════════════════════════════════════════════════════════════════

function Section1Quiz() {
  const { quizAnswers, setQuizAnswer, completeQuiz, quizComplete, perfil } =
    useArvoStore();

  const [currentQ, setCurrentQ] = useState(0);
  const total = QUIZ_QUESTIONS.length;
  const answered = Object.keys(quizAnswers).length;
  const allAnswered = answered === total;

  const totalScore = useMemo(
    () => Object.values(quizAnswers).reduce((a, v) => a + v, 0),
    [quizAnswers]
  );

  const derivedProfile = useMemo(
    () => computeProfileFromScore(totalScore),
    [totalScore]
  );

  if (quizComplete) {
    return (
      <SectionShell id="section-0">
        <SectionBadge>✓ Perfil definido</SectionBadge>
        <SectionTitle>Seu perfil: {PROFILE_LABELS[perfil]}</SectionTitle>
        <SectionSub>
          Baseado nas suas respostas, identificamos o perfil que melhor
          representa seu momento. Isso define os ranges de alocação da escada.
        </SectionSub>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex-1">
            <div className="mb-2 flex justify-between text-xs text-slate-400">
              <span>Conservador</span>
              <span>Arrojado</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500"
                initial={{ width: 0 }}
                animate={{ width: `${((totalScore - 8) / 24) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{totalScore}/32</div>
            <div className="text-xs text-slate-400">pontos</div>
          </div>
        </div>
      </SectionShell>
    );
  }

  const q = QUIZ_QUESTIONS[currentQ];

  return (
    <SectionShell id="section-0">
      <SectionBadge>Etapa 1 — Perfil</SectionBadge>
      <SectionTitle>Vamos descobrir seu perfil de investidor</SectionTitle>
      <SectionSub>
        Responda {total} perguntas para determinarmos o perfil que guiará sua
        alocação patrimonial.
      </SectionSub>

      {/* Progress bar */}
      <div className="mt-6 mb-8">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
          <span>Pergunta {currentQ + 1} de {total}</span>
          <span>{answered} respondidas</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-blue-500"
            animate={{ width: `${(answered / total) * 100}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl border border-white/15 bg-white/5 p-6"
        >
          <h3 className="text-lg font-semibold text-white">{q.text}</h3>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {q.options.map((opt) => {
              const selected = quizAnswers[q.id] === opt.points;
              return (
                <button
                  key={opt.label}
                  onClick={() => setQuizAnswer(q.id, opt.points)}
                  className={`rounded-xl border p-4 text-left text-sm transition ${selected
                      ? "border-blue-400/50 bg-blue-500/15 text-white ring-1 ring-blue-400/30"
                      : "border-white/15 bg-white/5 text-slate-300 hover:border-white/25 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <SecondaryButton onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}>
          ← Anterior
        </SecondaryButton>

        <div className="flex items-center gap-2">
          {/* Dots */}
          <div className="hidden items-center gap-1 sm:flex">
            {QUIZ_QUESTIONS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQ(i)}
                className={`h-2 w-2 rounded-full transition ${i === currentQ
                    ? "bg-blue-400 scale-125"
                    : quizAnswers[QUIZ_QUESTIONS[i].id] !== undefined
                      ? "bg-blue-500/50"
                      : "bg-white/15"
                  }`}
              />
            ))}
          </div>
        </div>

        {currentQ < total - 1 ? (
          <SecondaryButton onClick={() => setCurrentQ(currentQ + 1)}>
            Próxima →
          </SecondaryButton>
        ) : (
          <PrimaryButton disabled={!allAnswered} onClick={completeQuiz}>
            Ver meu perfil
          </PrimaryButton>
        )}
      </div>

      {/* Preview */}
      {answered >= 3 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 rounded-xl border border-white/10 bg-white/3 px-4 py-3 text-sm text-slate-400"
        >
          Tendência atual:{" "}
          <span className="font-semibold text-white">
            {PROFILE_LABELS[derivedProfile]}
          </span>{" "}
          ({totalScore}/{total * 4} pontos)
        </motion.div>
      )}
    </SectionShell>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SEÇÃO 2 — CUSTO DE VIDA + RESERVA
// ═════════════════════════════════════════════════════════════════════════════

function Section2CustoReserva() {
  const store = useArvoStore();
  const {
    expenses, setExpense,
    useCalculatorTotal, setUseCalculatorTotal,
    manualMonthlyCost, setManualMonthlyCost,
    multiplicadorReserva, setMultiplicadorReserva,
    activeSection, unlockSection,
  } = store;

  const custoDeVida = useCalculatorTotal
    ? Object.values(expenses).reduce((a, v) => a + v, 0)
    : manualMonthlyCost;

  const metaReserva = custoDeVida * multiplicadorReserva;
  const canContinue = custoDeVida > 0;

  const multipliers: { value: ReserveMultiplier; label: string; help: string }[] = [
    { value: 6, label: "6×", help: "CLT / renda estável" },
    { value: 9, label: "9×", help: "Estabilidade intermediária" },
    { value: 12, label: "12×", help: "PJ / empresário" },
    { value: 18, label: "18×", help: "Alta instabilidade" },
  ];

  return (
    <SectionShell id="section-1" locked={activeSection < 1}>
      <SectionBadge>Etapa 2 — Custo de vida</SectionBadge>
      <SectionTitle>Qual é o seu custo de vida mensal?</SectionTitle>
      <SectionSub>
        Este número define o tamanho da sua reserva de emergência — a base da escada.
      </SectionSub>

      {/* Toggle */}
      <div className="mt-6 mb-6 inline-flex rounded-xl border border-white/15 bg-white/5 p-1">
        {[true, false].map((v) => (
          <button
            key={String(v)}
            onClick={() => setUseCalculatorTotal(v)}
            className={`rounded-lg px-4 py-2 text-sm transition ${useCalculatorTotal === v
                ? "bg-white text-slate-950 shadow"
                : "text-slate-300 hover:text-white"
              }`}
          >
            {v ? "Calculadora" : "Valor manual"}
          </button>
        ))}
      </div>

      {useCalculatorTotal ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(EXPENSE_LABELS) as ExpenseKey[]).map((key) => (
            <div key={key}>
              <label className="mb-1 block text-xs font-medium text-slate-300">
                {EXPENSE_LABELS[key]}
              </label>
              <CurrencyInput
                value={expenses[key]}
                onChange={(v) => setExpense(key, v)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-sm">
          <label className="mb-1 block text-xs font-medium text-slate-300">
            Custo de vida mensal total
          </label>
          <CurrencyInput value={manualMonthlyCost} onChange={setManualMonthlyCost} />
        </div>
      )}

      {/* Total */}
      <div className="mt-6 flex items-center justify-between rounded-xl border border-white/20 bg-white/8 px-5 py-4">
        <span className="text-sm text-slate-300">Custo mensal</span>
        <span className="text-2xl font-bold text-white">{fmt(custoDeVida)}</span>
      </div>

      {/* Multiplicador */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white">Quantos meses de reserva?</h3>
        <p className="mt-1 text-sm text-slate-400">
          O múltiplo ideal depende da estabilidade da sua renda.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {multipliers.map(({ value, label, help }) => {
            const selected = value === multiplicadorReserva;
            return (
              <button
                key={value}
                onClick={() => setMultiplicadorReserva(value)}
                className={`rounded-xl border p-4 text-left transition ${selected
                    ? "border-blue-400/50 bg-blue-500/15 ring-1 ring-blue-400/30"
                    : "border-white/15 bg-white/5 hover:border-white/25"
                  }`}
              >
                <div className="text-2xl font-bold text-white">{label}</div>
                <p className="mt-1 text-xs text-slate-300">{help}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reserva-alvo */}
      {custoDeVida > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex items-center justify-between rounded-xl border border-emerald-400/30 bg-emerald-500/8 px-5 py-4"
        >
          <span className="text-sm text-emerald-300">🎯 Reserva-alvo</span>
          <span className="text-2xl font-bold text-white">{fmt(metaReserva)}</span>
        </motion.div>
      )}

      <div className="mt-8 flex justify-end">
        <PrimaryButton disabled={!canContinue} onClick={() => unlockSection(2)}>
          Continuar para Raio-X →
        </PrimaryButton>
      </div>
    </SectionShell>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SEÇÃO 3 — RAIO-X PATRIMONIAL
// ═════════════════════════════════════════════════════════════════════════════

function Section3RaioX() {
  const {
    rendaMensal, setRendaMensal,
    patrimonioAtual, setPatrimonioAtual,
    perfil, activeSection, unlockSection,
    multiplicadorReserva, expenses,
    useCalculatorTotal, manualMonthlyCost,
  } = useArvoStore();

  const custoDeVida = useCalculatorTotal
    ? Object.values(expenses).reduce((a, v) => a + v, 0)
    : manualMonthlyCost;

  const metaReserva = custoDeVida * multiplicadorReserva;
  const capitalExcedente = Math.max(patrimonioAtual - metaReserva, 0);
  const weights = PROFILE_WEIGHTS[perfil];
  const canContinue = patrimonioAtual > 0;

  return (
    <SectionShell id="section-2" locked={activeSection < 2}>
      <SectionBadge>Etapa 3 — Raio-X</SectionBadge>
      <SectionTitle>Raio-X do seu patrimônio</SectionTitle>
      <SectionSub>
        Com esses números, calcularemos as metas de cada camada da escada.
      </SectionSub>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-300">Renda mensal</label>
          <CurrencyInput value={rendaMensal} onChange={setRendaMensal} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-300">Patrimônio atual total</label>
          <CurrencyInput value={patrimonioAtual} onChange={setPatrimonioAtual} />
        </div>
      </div>

      {/* Preview distribuição */}
      {capitalExcedente > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-xl border border-white/15 bg-white/5 p-5"
        >
          <h4 className="text-sm font-semibold text-white">
            Prévia — perfil {PROFILE_LABELS[perfil]}
          </h4>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">Reserva de emergência</span>
              <span className="font-medium text-white">{fmt(metaReserva)}</span>
            </div>
            <div className="h-px bg-white/10" />
            {(Object.entries(weights) as [Exclude<StepKey, "reserva">, number][]).map(
              ([step, pctVal]) => (
                <div key={step} className="flex justify-between text-sm">
                  <span className={getLayerColor(STEP_LABELS[step].color).text}>
                    {STEP_LABELS[step].title} ({pctVal}%)
                  </span>
                  <span className="font-medium text-white">
                    {fmt(capitalExcedente * (pctVal / 100))}
                  </span>
                </div>
              )
            )}
            <div className="h-px bg-white/10" />
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-slate-300">Capital excedente</span>
              <span className="text-white">{fmt(capitalExcedente)}</span>
            </div>
          </div>
        </motion.div>
      )}

      <div className="mt-8 flex justify-end">
        <PrimaryButton disabled={!canContinue} onClick={() => unlockSection(3)}>
          Montar minha escada →
        </PrimaryButton>
      </div>
    </SectionShell>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SEÇÃO 4 — MOTOR DE ALOCAÇÃO (POTES + DRAG & DROP)
// ═════════════════════════════════════════════════════════════════════════════

// ── Chip de fundo arrastável ─────────────────────────────────────────────────

function FundChip({ fund, inPot = false, onRemove }: { fund: FundDef; inPot?: boolean; onRemove?: () => void }) {
  const c = getLayerColor(fund.color);

  function handleDragStart(e: React.DragEvent) {
    e.dataTransfer.setData("application/fund-id", fund.id);
    e.dataTransfer.effectAllowed = "move";
  }

  return (
    <div
      draggable={!inPot}
      onDragStart={handleDragStart}
      className={`group inline-flex cursor-grab items-center gap-2 rounded-lg border px-3 py-2 text-xs transition active:cursor-grabbing ${c.border} ${c.bg} ${c.text}`}
      title={fund.description}
    >
      <span className={`h-2 w-2 rounded-full ${c.fill}`} />
      <span className="font-medium">{fund.name}</span>
      {inPot && onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 rounded-full p-0.5 text-[10px] opacity-60 hover:opacity-100 transition"
        >
          ✕
        </button>
      )}
    </div>
  );
}

// ── Fundo dentro do pote com input de valor ──────────────────────────────────

function PotFundRow({
  potFund,
  step,
}: {
  potFund: PotFund;
  step: StepKey;
}) {
  const { updateFundAmount, removeFundFromPot } = useArvoStore();
  const fund = FUND_BY_ID[potFund.fundId];
  if (!fund) return null;

  return (
    <div className="flex items-center gap-2">
      <FundChip
        fund={fund}
        inPot
        onRemove={() => removeFundFromPot(step, potFund.fundId)}
      />
      <div className="flex-1">
        <CurrencyInput
          value={potFund.amount}
          onChange={(v) => updateFundAmount(step, potFund.fundId, v)}
          placeholder="R$ valor"
          className="!py-1.5 !text-sm"
        />
      </div>
    </div>
  );
}

// ── Pote (caixa de uma camada) ───────────────────────────────────────────────

function AllocationPot({
  step,
  totalPatrimonio,
  targetPct,
  range,
  fundsInPot,
}: {
  step: StepKey;
  totalPatrimonio: number;
  targetPct: number;
  range: { min: number; max: number } | null;
  fundsInPot: PotFund[];
}) {
  const { addFundToPot } = useArvoStore();
  const [dragOver, setDragOver] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const label = STEP_LABELS[step];
  const c = getLayerColor(label.color);

  const potTotal = fundsInPot.reduce((a, f) => a + f.amount, 0);
  const actualPct = totalPatrimonio > 0 ? (potTotal / totalPatrimonio) * 100 : 0;

  const inRange = range
    ? actualPct >= range.min && actualPct <= range.max
    : true;
  const hasValue = potTotal > 0;

  // Fundos DESTA camada que ainda não estão no pote
  const availableFunds = FUND_CATALOG.filter(
    (f) => f.layer === step && !fundsInPot.some((pf) => pf.fundId === f.id)
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const fundId = e.dataTransfer.getData("application/fund-id");
    if (!fundId) return;
    const fund = FUND_BY_ID[fundId];
    if (!fund || fund.layer !== step) return; // only allow same-layer funds
    addFundToPot(step, fundId);
  }

  return (
    <motion.div
      layout
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`relative rounded-2xl border-2 p-5 transition-all duration-300 ${dragOver
          ? `${c.border} ${c.bg} ring-2 ${c.ring} scale-[1.02]`
          : hasValue
            ? `${c.border} ${c.bg}`
            : "border-white/15 border-dashed bg-white/3"
        }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className={`text-[10px] uppercase tracking-[0.18em] ${c.text}`}>
            {label.title}
          </div>
          <div className="mt-0.5 text-sm font-semibold text-white">
            {label.subtitle}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            {actualPct.toFixed(0)}%
          </div>
          <div className="text-xs text-slate-400">{fmt(potTotal)}</div>
        </div>
      </div>

      {/* Range indicator */}
      {range && (
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-[10px] text-slate-500">
            <span>Mín {range.min}%</span>
            <span>Alvo {targetPct}%</span>
            <span>Máx {range.max}%</span>
          </div>
          <div className="relative h-2 rounded-full bg-white/10">
            {/* Range area */}
            <div
              className="absolute h-full rounded-full bg-white/10"
              style={{
                left: `${range.min}%`,
                width: `${range.max - range.min}%`,
              }}
            />
            {/* Target marker */}
            <div
              className={`absolute top-0 h-full w-0.5 ${c.fill} opacity-50`}
              style={{ left: `${targetPct}%` }}
            />
            {/* Current position */}
            <motion.div
              className={`absolute top-[-2px] h-3 w-3 rounded-full border-2 border-[#07111f] ${inRange ? c.fill : "bg-red-500"
                }`}
              animate={{ left: `calc(${Math.min(actualPct, 100)}% - 6px)` }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            />
          </div>
          {!inRange && hasValue && (
            <div className="mt-1 text-xs text-red-400">
              {actualPct < range.min
                ? `↑ Aumente para pelo menos ${range.min}%`
                : `↓ Reduza para no máximo ${range.max}%`}
            </div>
          )}
        </div>
      )}

      {/* Fundos no pote */}
      {fundsInPot.length > 0 && (
        <div className="mt-4 space-y-2">
          {fundsInPot.map((pf) => (
            <PotFundRow key={pf.fundId} potFund={pf} step={step} />
          ))}
        </div>
      )}

      {/* Drop zone / Add button */}
      <div className="mt-3 flex items-center gap-2">
        {availableFunds.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className={`rounded-lg border border-dashed px-3 py-1.5 text-xs transition ${c.border} ${c.text} hover:${c.bg}`}
            >
              + Adicionar fundo
            </button>
            {showAddMenu && (
              <div className="absolute left-0 top-full z-20 mt-1 min-w-[220px] rounded-xl border border-white/15 bg-[#0e1a2e] p-2 shadow-xl">
                {availableFunds.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      addFundToPot(step, f.id);
                      setShowAddMenu(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-slate-300 transition hover:bg-white/10 hover:text-white"
                  >
                    <span className={`h-2 w-2 rounded-full ${c.fill}`} />
                    <span>{f.name}</span>
                    <span className="ml-auto text-[10px] text-slate-500">{f.description}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {fundsInPot.length === 0 && (
          <span className="text-xs text-slate-500">
            Arraste fundos aqui ou clique em "+"
          </span>
        )}
      </div>
    </motion.div>
  );
}

// ── Motor de Alocação (seção completa) ───────────────────────────────────────

function Section4Motor() {
  const {
    perfil, potFunds, activeSection, unlockSection,
    patrimonioAtual, multiplicadorReserva,
    expenses, useCalculatorTotal, manualMonthlyCost,
  } = useArvoStore();

  const custoDeVida = useCalculatorTotal
    ? Object.values(expenses).reduce((a, v) => a + v, 0)
    : manualMonthlyCost;

  const metaReserva = custoDeVida * multiplicadorReserva;
  const totalPatrimonio = patrimonioAtual;
  const weights = PROFILE_WEIGHTS[perfil];
  const ranges = ALLOCATION_RANGES[perfil];

  // Total alocado em todos os potes
  const totalAlocado = STEP_ORDER.reduce(
    (acc, step) => acc + potFunds[step].reduce((a, f) => a + f.amount, 0),
    0
  );

  const pctAlocado = totalPatrimonio > 0 ? (totalAlocado / totalPatrimonio) * 100 : 0;

  // Validação — todos os potes com fundos estão dentro do range?
  const allInRange = STEP_ORDER
    .filter((s) => s !== "reserva")
    .every((step) => {
      const potTotal = potFunds[step].reduce((a, f) => a + f.amount, 0);
      const pct = totalPatrimonio > 0 ? (potTotal / totalPatrimonio) * 100 : 0;
      const r = ranges[step as Exclude<StepKey, "reserva">];
      return pct >= r.min && pct <= r.max;
    });

  const reservaOk = (() => {
    const potTotal = potFunds.reserva.reduce((a, f) => a + f.amount, 0);
    return potTotal >= metaReserva * 0.8; // 80% da meta é aceitável
  })();

  const canAdvance = allInRange && reservaOk && totalAlocado > 0;

  // Fundos disponíveis agrupados por camada (os que não estão em nenhum pote)
  const allPlaced = new Set(
    STEP_ORDER.flatMap((s) => potFunds[s].map((f) => f.fundId))
  );
  const availableByCamada = STEP_ORDER.map((step) => ({
    step,
    funds: FUND_CATALOG.filter(
      (f) => f.layer === step && !allPlaced.has(f.id)
    ),
  })).filter((g) => g.funds.length > 0);

  return (
    <SectionShell id="section-3" locked={activeSection < 3}>
      <SectionBadge color="emerald">Etapa 4 — Alocação</SectionBadge>
      <SectionTitle>Monte sua escada patrimonial</SectionTitle>
      <SectionSub>
        Arraste os fundos para os potes ou clique em "+" para adicionar. Defina o valor em
        cada fundo. Os potes precisam estar dentro do range do seu perfil.
      </SectionSub>

      {/* Progresso geral */}
      <div className="mt-6 flex items-center gap-4 rounded-xl border border-white/15 bg-white/5 px-5 py-3">
        <div className="flex-1">
          <div className="mb-1 flex justify-between text-xs text-slate-400">
            <span>Alocado: {fmt(totalAlocado)}</span>
            <span>Patrimônio: {fmt(totalPatrimonio)}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500"
              animate={{ width: `${Math.min(pctAlocado, 100)}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
        </div>
        <div className="text-2xl font-bold text-white">
          {pctAlocado.toFixed(0)}%
        </div>
      </div>

      {/* Potes grid */}
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {STEP_ORDER.map((step) => (
          <AllocationPot
            key={step}
            step={step}
            totalPatrimonio={totalPatrimonio}
            targetPct={step === "reserva" ? (totalPatrimonio > 0 ? (metaReserva / totalPatrimonio) * 100 : 0) : weights[step as Exclude<StepKey, "reserva">]}
            range={step === "reserva" ? null : ranges[step as Exclude<StepKey, "reserva">]}
            fundsInPot={potFunds[step]}
          />
        ))}
      </div>

      {/* Bandeja de fundos disponíveis */}
      {availableByCamada.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-3 text-sm font-semibold text-white">
            Fundos disponíveis — arraste para os potes
          </h3>
          <div className="space-y-3">
            {availableByCamada.map(({ step, funds }) => (
              <div key={step}>
                <div className={`mb-1.5 text-[10px] uppercase tracking-[0.14em] ${getLayerColor(STEP_LABELS[step].color).text}`}>
                  {STEP_LABELS[step].title}
                </div>
                <div className="flex flex-wrap gap-2">
                  {funds.map((f) => (
                    <FundChip key={f.id} fund={f} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <PrimaryButton disabled={!canAdvance} onClick={() => unlockSection(4)}>
          Finalizar e agendar →
        </PrimaryButton>
      </div>

      {!canAdvance && totalAlocado > 0 && (
        <p className="mt-2 text-right text-xs text-slate-500">
          {!reservaOk
            ? "Preencha pelo menos 80% da meta da reserva"
            : !allInRange
              ? "Ajuste os potes para ficarem dentro dos ranges do seu perfil"
              : "Adicione fundos aos potes"}
        </p>
      )}
    </SectionShell>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SEÇÃO 5 — AGENDAMENTO
// ═════════════════════════════════════════════════════════════════════════════

function Section5Agendamento() {
  const {
    nome, setNome,
    email, setEmail,
    telefone, setTelefone,
    hasUpload, setHasUpload,
    activeSection,
  } = useArvoStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canSubmit = nome && email && telefone;

  return (
    <SectionShell id="section-4" locked={activeSection < 4}>
      <SectionBadge color="emerald">Etapa 5 — Agendamento</SectionBadge>
      <SectionTitle>Sua escada está montada!</SectionTitle>
      <SectionSub>
        Preencha seus dados para que a equipe ARVO valide sua estratégia
        e agende um bate-papo.
      </SectionSub>

      <div className="mt-6 max-w-lg space-y-4">
        {[
          { label: "Nome completo", value: nome, onChange: setNome, placeholder: "Seu nome" },
          { label: "E-mail", value: email, onChange: setEmail, placeholder: "voce@exemplo.com" },
          { label: "Telefone / WhatsApp", value: telefone, onChange: setTelefone, placeholder: "(48) 99999-9999" },
        ].map(({ label, value, onChange, placeholder }) => (
          <div key={label}>
            <label className="mb-1 block text-xs font-medium text-slate-300">{label}</label>
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/60 focus:ring-1 focus:ring-blue-500/30"
            />
          </div>
        ))}

        {/* Upload */}
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-300">
            Comprovantes da posição atual{" "}
            <span className="text-slate-500">(recomendado)</span>
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-xl border-2 border-dashed px-5 py-6 text-center transition ${hasUpload
                ? "border-emerald-400/50 bg-emerald-500/8"
                : "border-white/15 bg-white/3 hover:border-white/25"
              }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) =>
                e.target.files && e.target.files.length > 0
                  ? setHasUpload(true)
                  : null
              }
            />
            {hasUpload ? (
              <div className="text-emerald-300">
                <div className="text-xl">✓</div>
                <div className="mt-1 text-sm">Comprovante enviado</div>
              </div>
            ) : (
              <div className="text-slate-400">
                <div className="text-xl">↑</div>
                <div className="mt-1 text-sm">
                  Arraste prints ou extratos da posição
                </div>
                <div className="mt-0.5 text-xs text-slate-500">
                  PNG, JPG, PDF
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <PrimaryButton
          disabled={!canSubmit}
          onClick={() => {
            if (!canSubmit) return;
            alert("Solicitação enviada! A equipe ARVO entrará em contato em breve.");
          }}
        >
          Solicitar validação e agendar
        </PrimaryButton>
      </div>
    </SectionShell>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═════════════════════════════════════════════════════════════════════════════

export default function ArvoEscadaPage() {
  const { activeSection } = useArvoStore();

  return (
    <div data-theme="dark" className="min-h-screen bg-[#07111f] text-slate-100">
      <ProgressHeader activeSection={activeSection} />

      <Section1Quiz />
      <Divider />
      <Section2CustoReserva />
      <Divider />
      <Section3RaioX />
      <Divider />
      <Section4Motor />
      <Divider />
      <Section5Agendamento />

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-xs text-slate-500">
        ARVO · Escada Patrimonial · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
