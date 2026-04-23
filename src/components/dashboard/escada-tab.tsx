/**
 * ARVO – Escada Patrimonial Tab
 * Versão light-theme para dentro do dashboard "Minha Carteira"
 *
 * Reutiliza arvo-store-v3 + @dnd-kit para drag-and-drop
 */

"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
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
    PROFILE_BANDS,
    STEP_ORDER,
    BUCKET_COLORS,
    BUCKET_META,
    scoreToProfile,
} from "@/app/escada/arvo-store-v3";

import type {
    ProfileKey,
    ExpenseKey,
    BucketEntry,
    StepStatus,
    Band,
} from "@/app/escada/arvo-store-v3";

import { FUNDS_LIBRARY, type StepKey, type FundCard, getSuggestedAllocations } from "@/config/portfolios";
import { MONTHLY_RETURNS } from "@/config/funds-monthly";

// ─── Color palette for light theme ──────────────────────────────────────────

const LAYER_COLORS: Record<
    string,
    { bg: string; border: string; text: string; dot: string; bar: string; ring: string; badge: string }
> = {
    blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", dot: "bg-blue-500", bar: "bg-blue-500", ring: "ring-blue-300", badge: "bg-blue-50 text-blue-700 border-blue-200" },
    indigo: { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700", dot: "bg-indigo-500", bar: "bg-indigo-500", ring: "ring-indigo-300", badge: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    violet: { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700", dot: "bg-violet-500", bar: "bg-violet-500", ring: "ring-violet-300", badge: "bg-violet-50 text-violet-700 border-violet-200" },
    amber: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", dot: "bg-amber-500", bar: "bg-amber-500", ring: "ring-amber-300", badge: "bg-amber-50 text-amber-700 border-amber-200" },
    cyan: { bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-700", dot: "bg-cyan-500", bar: "bg-cyan-500", ring: "ring-cyan-300", badge: "bg-cyan-50 text-cyan-700 border-cyan-200" },
    rose: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", dot: "bg-rose-500", bar: "bg-rose-500", ring: "ring-rose-300", badge: "bg-rose-50 text-rose-700 border-rose-200" },
};

function lc(color: string) { return LAYER_COLORS[color] ?? LAYER_COLORS.blue; }

// ─── Formatação ──────────────────────────────────────────────────────────────

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const fmt = (v: number) => BRL.format(isFinite(v) ? v : 0);
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

function getHistoricalReturns(fundId: string) {
    const arr = MONTHLY_RETURNS.funds[fundId as keyof typeof MONTHLY_RETURNS.funds];
    if (!arr) return { m1: 0, m12: 0, m24: 0, m36: 0 };
    const getComp = (months: number) => {
        if (arr.length < months) return 0;
        let accum = 1;
        const startIndex = arr.length - months;
        for (let i = startIndex; i < arr.length; i++) {
            accum *= (1 + arr[i]);
        }
        return (accum - 1) * 100;
    };
    return {
        m1: getComp(1),
        m12: getComp(12),
        m24: getComp(24),
        m36: getComp(36),
    };
}

// ─── useComputed (derivações) ────────────────────────────────────────────────

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

    const bucketTotals = useMemo(() => {
        const r = {} as Record<StepKey, number>;
        for (const k of STEP_ORDER) r[k] = s.buckets[k].reduce((a, e) => a + e.value, 0);
        return r;
    }, [s.buckets]);

    const totalAllocated = useMemo(() => Object.values(bucketTotals).reduce((a, v) => a + v, 0), [bucketTotals]);

    const bucketPcts = useMemo(() => {
        const r = {} as Record<StepKey, number>;
        for (const k of STEP_ORDER) {
            if (k === "reserva") r[k] = metaReserva > 0 ? clamp((bucketTotals.reserva / metaReserva) * 100, 0, 100) : 0;
            else r[k] = capitalExcedente > 0 ? clamp((bucketTotals[k] / capitalExcedente) * 100, 0, 100) : 0;
        }
        return r;
    }, [bucketTotals, metaReserva, capitalExcedente]);

    const bucketTargets = useMemo(() => {
        if (!s.perfil) return {} as Record<StepKey, number>;
        const bands = PROFILE_BANDS[s.perfil];
        return {
            reserva: metaReserva,
            abrigo: capitalExcedente * (bands.abrigo.target / 100),
            ritmo: capitalExcedente * (bands.ritmo.target / 100),
            visao: capitalExcedente * (bands.visao.target / 100),
            oceano: capitalExcedente * (bands.oceano.target / 100),
        } as Record<StepKey, number>;
    }, [s.perfil, metaReserva, capitalExcedente]);

    const bucketStatus = useMemo<Record<StepKey, StepStatus>>(() => {
        if (!s.perfil) return { reserva: "empty", abrigo: "locked", ritmo: "locked", visao: "locked", oceano: "locked" };
        const bands = PROFILE_BANDS[s.perfil];
        const result = {} as Record<StepKey, StepStatus>;

        const resPct = bucketPcts.reserva;
        result.reserva = resPct === 0 ? "empty" : resPct < 100 ? "filling" : "in_range";
        const reservaOk = resPct >= 100;

        const non: Exclude<StepKey, "reserva">[] = ["abrigo", "ritmo", "visao", "oceano"];
        for (let i = 0; i < non.length; i++) {
            const step = non[i];
            const band = bands[step];
            if (band.target === 0 && band.max <= 5 && band.max === 0) { result[step] = "not_applicable"; continue; }
            const prev = i === 0 ? "reserva" : non[i - 1];
            const prevOk = result[prev] === "in_range" || result[prev] === "not_applicable" || (prev === "reserva" && reservaOk);
            if (!prevOk) { result[step] = "locked"; continue; }
            const pct = bucketPcts[step];
            if (pct === 0) { result[step] = "empty"; continue; }
            if (pct < band.min) { result[step] = "filling"; continue; }
            if (pct > band.max) { result[step] = "over_range"; continue; }
            result[step] = "in_range";
        }
        return result;
    }, [s.perfil, bucketPcts]);

    const engineComplete = useMemo(() => {
        if (!s.perfil) return false;
        return STEP_ORDER.every((step) => { const st = bucketStatus[step]; return st === "in_range" || st === "not_applicable"; });
    }, [s.perfil, bucketStatus]);

    const overallProgress = useMemo(() => {
        const sts = STEP_ORDER.map((s) => bucketStatus[s]);
        const applicable = sts.filter((st) => st !== "not_applicable");
        if (applicable.length === 0) return 0;
        return (applicable.filter((st) => st === "in_range").length / applicable.length) * 100;
    }, [bucketStatus]);

    return { custoDeVida, metaReserva, capitalExcedente, bucketTotals, totalAllocated, bucketPcts, bucketTargets, bucketStatus, engineComplete, overallProgress };
}

// ─── Shared UI ───────────────────────────────────────────────────────────────

function DashInput({ value, onChange, placeholder = "R$ 0", disabled = false, className = "" }: {
    value: number; onChange: (v: number) => void; placeholder?: string; disabled?: boolean; className?: string;
}) {
    const [focused, setFocused] = useState(false);
    const [raw, setRaw] = useState("");
    return (
        <input
            type="text" inputMode="numeric" disabled={disabled}
            value={focused ? raw : value > 0 ? fmt(value) : ""}
            placeholder={placeholder}
            onChange={(e) => setRaw(e.target.value.replace(/\D/g, ""))}
            onFocus={() => { setFocused(true); setRaw(value > 0 ? String(value) : ""); }}
            onBlur={() => { setFocused(false); onChange(parseInt(raw, 10) || 0); }}
            className={`w-full rounded-lg border border-dash-border-strong bg-dash-surface px-3 py-2.5 text-sm text-dash-text outline-none transition placeholder:text-dash-text-light focus:border-dash-accent focus:ring-1 focus:ring-dash-accent/20 disabled:opacity-40 ${className}`}
        />
    );
}

function DashCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`rounded-2xl border border-dash-border bg-dash-surface p-5 shadow-sm ${className}`}>
            {children}
        </div>
    );
}

const PROFILE_LABELS: Record<ProfileKey, string> = {
    conservador: "Conservador",
    moderado_conservador: "Moderado Conservador",
    moderado: "Moderado",
    arrojado: "Arrojado",
};

const PROFILE_DESC: Record<ProfileKey, string> = {
    conservador: "Prioridade máxima em proteção, liquidez e estabilidade.",
    moderado_conservador: "Equilíbrio entre proteção e crescimento, com base sólida.",
    moderado: "Aceita oscilações para buscar retornos mais expressivos.",
    arrojado: "Tolerância a volatilidade alta, horizonte longo e convicção.",
};

const EXPENSE_LABELS: Record<ExpenseKey, string> = {
    moradia: "Moradia", contas: "Condomínio/contas", supermercado: "Supermercado",
    cartao: "Cartão de crédito", transporte: "Transporte", saude: "Saúde",
    educacao: "Educação/filhos", lazer: "Lazer", outros: "Outros",
};

// ═════════════════════════════════════════════════════════════════════════════
// STEP 1 — QUIZ
// ═════════════════════════════════════════════════════════════════════════════

function QuizStep() {
    const { quizAnswers, quizComplete, perfil, answerQuestion, finishQuiz, resetQuiz } = useArvoStoreV3();
    const [currentQ, setCurrentQ] = useState(0);
    const total = SUITABILITY_QUESTIONS.length;
    const q = SUITABILITY_QUESTIONS[currentQ];
    const answered = quizAnswers[q?.id];
    const allAnswered = SUITABILITY_QUESTIONS.every((q) => quizAnswers[q.id] !== undefined);

    if (quizComplete && perfil) {
        const color = perfil === "conservador" ? "blue" : perfil === "moderado_conservador" ? "indigo" : perfil === "moderado" ? "amber" : "rose";
        const c = lc(color);
        return (
            <DashCard className="text-center py-12">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <div className="text-xs uppercase tracking-[0.2em] text-dash-text-light mb-2">Seu perfil ARVO</div>
                    <div className={`inline-block rounded-2xl border ${c.border} ${c.bg} px-8 py-5`}>
                        <div className={`text-3xl font-bold ${c.text}`}>{PROFILE_LABELS[perfil]}</div>
                    </div>
                    <p className="mx-auto mt-4 max-w-sm text-sm text-dash-text-muted">{PROFILE_DESC[perfil]}</p>
                    <button onClick={resetQuiz} className="mt-6 rounded-lg border border-dash-border-strong px-4 py-2 text-xs text-dash-text-muted hover:bg-dash-surface-active transition">
                        Refazer o teste
                    </button>
                </motion.div>
            </DashCard>
        );
    }

    return (
        <DashCard>
            {/* Progress */}
            <div className="mb-6 flex items-center justify-between text-xs text-dash-text-light">
                <span>Suitability ARVO</span>
                <span>{currentQ + 1} / {total}</span>
            </div>
            <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-dash-surface-active">
                <motion.div className="h-full rounded-full bg-dash-accent" animate={{ width: `${((currentQ + 1) / total) * 100}%` }} transition={{ duration: 0.3 }} />
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
                <motion.div key={q.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <h3 className="mb-5 text-xl font-semibold text-dash-text">{q.text}</h3>
                    <div className="space-y-2.5">
                        {q.options.map((opt) => {
                            const sel = answered === opt.points;
                            return (
                                <motion.button key={opt.points} whileTap={{ scale: 0.98 }}
                                    onClick={() => { answerQuestion(q.id, opt.points); setTimeout(() => { if (currentQ < total - 1) setCurrentQ((c) => c + 1); }, 300); }}
                                    className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition ${sel
                                        ? "border-dash-accent bg-dash-accent-light ring-1 ring-dash-accent/20"
                                        : "border-dash-border hover:border-dash-border-strong hover:bg-dash-surface-active"}`}
                                >
                                    <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${sel ? "border-dash-accent bg-dash-accent text-white font-bold" : "border-dash-border-strong text-dash-text-light"}`}>
                                        {sel ? "✓" : ""}
                                    </span>
                                    <span className="text-sm text-dash-text">{opt.text}</span>
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Nav */}
            <div className="mt-6 flex items-center justify-between">
                <button onClick={() => setCurrentQ((c) => Math.max(0, c - 1))} disabled={currentQ === 0}
                    className="rounded-lg border border-dash-border-strong px-4 py-2 text-sm text-dash-text-muted disabled:opacity-30 hover:bg-dash-surface-active transition">
                    ← Anterior
                </button>
                {currentQ < total - 1 ? (
                    <button onClick={() => setCurrentQ((c) => c + 1)} disabled={!answered}
                        className="rounded-lg border border-dash-border-strong px-4 py-2 text-sm text-dash-text-muted disabled:opacity-30 hover:bg-dash-surface-active transition">
                        Próxima →
                    </button>
                ) : (
                    <button onClick={finishQuiz} disabled={!allAnswered}
                        className={`rounded-lg px-5 py-2.5 text-sm font-medium transition ${allAnswered ? "bg-dash-accent text-white hover:opacity-90" : "cursor-not-allowed bg-dash-surface-active text-dash-text-light"}`}>
                        Ver meu perfil →
                    </button>
                )}
            </div>
        </DashCard>
    );
}

// ═════════════════════════════════════════════════════════════════════════════
// STEP 2 — DADOS FINANCEIROS
// ═════════════════════════════════════════════════════════════════════════════

function DadosStep({ computed }: { computed: ReturnType<typeof useComputed> }) {
    const {
        quizComplete, expenses, setExpense, useCalculatorTotal,
        setUseCalculatorTotal, manualMonthlyCost, setManualMonthlyCost,
        multiplicadorReserva, setMultiplicadorReserva,
        rendaMensal, setRendaMensal, patrimonioAtual, setPatrimonioAtual,
        dadosComplete, confirmDados,
    } = useArvoStoreV3();

    const multipliers = [
        { v: 6 as const, label: "6×", help: "CLT / renda estável" },
        { v: 9 as const, label: "9×", help: "Estabilidade intermediária" },
        { v: 12 as const, label: "12×", help: "PJ / empresário" },
        { v: 18 as const, label: "18×", help: "Alta instabilidade" },
    ];

    const canConfirm = patrimonioAtual > 0 && computed.custoDeVida > 0;

    if (!quizComplete) {
        return (
            <DashCard className="opacity-50 pointer-events-none text-center py-10">
                <p className="text-sm text-dash-text-light">Complete o questionário de perfil para desbloquear.</p>
            </DashCard>
        );
    }

    return (
        <DashCard>
            <div className="mb-5">
                <div className="text-xs uppercase tracking-[0.18em] text-dash-text-light">Etapa 2</div>
                <h3 className="mt-1 text-xl font-semibold text-dash-text">Dados financeiros</h3>
                <p className="mt-1 text-sm text-dash-text-muted">Esses números definem as metas de cada pote da escada.</p>
            </div>

            <div className="space-y-5">
                {/* Renda + Patrimônio */}
                <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-dash-text-muted">Renda mensal</label>
                        <DashInput value={rendaMensal} onChange={setRendaMensal} />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-dash-text-muted">Patrimônio total</label>
                        <DashInput value={patrimonioAtual} onChange={setPatrimonioAtual} />
                    </div>
                </div>

                {/* Custo de vida */}
                <div className="col-span-1 border-b border-dash-border lg:border-b-0 lg:border-r">
                    <div className="flex items-center gap-2 border-b border-dash-border px-4 py-3">
                        <span className="text-sm font-medium text-dash-text">Custo de vida mensal</span>
                        <div className="inline-flex rounded-lg border border-dash-border bg-dash-surface p-0.5">
                            {[true, false].map((v) => (
                                <button key={String(v)} onClick={() => setUseCalculatorTotal(v)}
                                    className={`rounded-md px-3 py-1.5 text-xs transition ${useCalculatorTotal === v ? "bg-dash-accent text-white font-medium shadow-sm" : "text-dash-text-muted"}`}>
                                    {v ? "Calculadora" : "Manual"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {useCalculatorTotal ? (
                        <div className="grid gap-2 sm:grid-cols-3">
                            {(Object.keys(EXPENSE_LABELS) as ExpenseKey[]).map((k) => (
                                <div key={k}>
                                    <label className="mb-0.5 block text-[11px] text-dash-text-light">{EXPENSE_LABELS[k]}</label>
                                    <DashInput value={expenses[k]} onChange={(v) => setExpense(k, v)} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="max-w-xs">
                            <DashInput value={manualMonthlyCost} onChange={setManualMonthlyCost} />
                        </div>
                    )}

                    <div className="mt-3 flex items-center justify-between rounded-lg border border-dash-border bg-dash-surface px-4 py-2.5">
                        <span className="text-xs text-dash-text-light">Total mensal</span>
                        <span className="text-base font-semibold text-dash-text">{fmt(computed.custoDeVida)}</span>
                    </div>
                </div>

                {/* Multiplicador */}
                <div>
                    <div className="mb-2 text-sm font-medium text-dash-text">Multiplicador da reserva</div>
                    <div className="grid grid-cols-4 gap-2">
                        {multipliers.map(({ v, label, help }) => (
                            <button key={v} onClick={() => setMultiplicadorReserva(v)}
                                className={`rounded-xl border p-3 text-left transition ${multiplicadorReserva === v
                                    ? "border-dash-accent bg-dash-accent-light ring-1 ring-dash-accent/20"
                                    : "border-dash-border hover:border-dash-border-strong"}`}>
                                <div className="text-xl font-bold text-dash-text">{label}</div>
                                <div className="mt-0.5 text-[10px] text-dash-text-light">{help}</div>
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
                                <div key={label} className="rounded-lg border border-dash-border bg-dash-bg px-3 py-2">
                                    <div className="text-[10px] uppercase tracking-widest text-dash-text-light">{label}</div>
                                    <div className="mt-0.5 font-semibold text-dash-text">{value}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end">
                    <motion.button whileTap={canConfirm ? { scale: 0.97 } : {}} onClick={confirmDados} disabled={!canConfirm}
                        className={`rounded-lg px-5 py-2.5 text-sm font-medium transition ${canConfirm ? "bg-dash-accent text-white hover:opacity-90" : "cursor-not-allowed bg-dash-surface-active text-dash-text-light"}`}>
                        Ir para o Motor de Alocação →
                    </motion.button>
                </div>
            </div>
        </DashCard>
    );
}

// ═════════════════════════════════════════════════════════════════════════════
// STEP 3 — MOTOR DE ALOCAÇÃO
// ═════════════════════════════════════════════════════════════════════════════

function FundCardDrag({ fund, allocated }: { fund: FundCard; allocated: boolean }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `fund-${fund.id}`, data: { type: "fund", fundId: fund.id }, disabled: allocated,
    });
    const c = lc(fund.color);

    return (
        <div ref={setNodeRef} {...attributes} {...listeners}
            style={{ transform: transform ? `translate(${transform.x}px,${transform.y}px)` : undefined, opacity: isDragging ? 0.3 : allocated ? 0.4 : 1 }}
            className={`relative cursor-grab select-none rounded-xl border p-3 transition active:cursor-grabbing ${allocated ? "border-dash-border bg-dash-surface-active" : `${c.border} ${c.bg} hover:ring-1 ${c.ring}`}`}
        >
            <div className="mb-1 flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${c.dot}`} />
                <span className="text-[10px] uppercase tracking-[0.14em] text-dash-text-light">{fund.type}</span>
            </div>
            <div className="text-xs font-medium text-dash-text">{fund.shortName}</div>
            <div className="mt-0.5 text-[11px] text-dash-text-muted">{fund.yield12m}</div>
            <div className="mt-1.5 flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`h-1 w-2.5 rounded-full ${i < fund.risk ? c.bar : "bg-dash-surface-active"}`} />
                ))}
            </div>
            {allocated && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/60">
                    <span className="text-[10px] text-dash-text-light font-medium">alocado</span>
                </div>
            )}
        </div>
    );
}

function BucketRow({ entry, bucketKey }: { entry: BucketEntry; bucketKey: StepKey }) {
    const { openEditEntry, removeEntry } = useArvoStoreV3();
    const fund = entry.fundId ? FUNDS_LIBRARY.find((f) => f.id === entry.fundId) : null;
    const hist = entry.fundId ? getHistoricalReturns(entry.fundId) : null;
    const c = lc(BUCKET_COLORS[bucketKey]);

    return (
        <div className={`flex items-center justify-between gap-1 rounded-lg border ${c.border} ${c.bg} px-2 py-1.5`}>
            <div className="min-w-0 flex-1 group relative cursor-help">
                <div className="truncate text-[11px] font-bold text-dash-text tracking-tight">{fund ? (fund.shortName || fund.name) : entry.customName ?? "Fundo externo"}</div>
                <div className="truncate text-[9.5px] text-dash-text-light">{fund ? fund.type : "Externo"}</div>

                {/* CSS Tooltip Hover Card */}
                {fund && hist && (
                    <div className="pointer-events-none absolute left-0 bottom-full mb-2 w-48 opacity-0 group-hover:opacity-100 transition-opacity z-[100] bg-dash-surface rounded-xl border border-dash-border shadow-xl p-3 text-xs text-dash-text overflow-hidden">
                        <div className="font-bold border-b border-dash-border pb-1.5 mb-2 leading-tight text-[11px]">{fund.name}</div>
                        <div className="grid grid-cols-2 gap-y-1.5 text-[10.5px]">
                            <span className="text-dash-text-muted">1 Mês:</span><span className={`font-semibold text-right ${hist.m1 >= 0 ? "text-emerald-500" : "text-red-500"}`}>{(hist.m1 > 0 ? "+" : "")}{hist.m1.toFixed(2)}%</span>
                            <span className="text-dash-text-muted">12 Meses:</span><span className={`font-semibold text-right ${hist.m12 >= 0 ? "text-emerald-500" : "text-red-500"}`}>{(hist.m12 > 0 ? "+" : "")}{hist.m12.toFixed(2)}%</span>
                            <span className="text-dash-text-muted">24 Meses:</span><span className={`font-semibold text-right ${hist.m24 >= 0 ? "text-emerald-500" : "text-red-500"}`}>{(hist.m24 > 0 ? "+" : "")}{hist.m24.toFixed(2)}%</span>
                            <span className="text-dash-text-muted">36 Meses:</span><span className={`font-semibold text-right ${hist.m36 >= 0 ? "text-emerald-500" : "text-red-500"}`}>{(hist.m36 > 0 ? "+" : "")}{hist.m36.toFixed(2)}%</span>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex shrink-0 items-center justify-end gap-1 w-max">
                <div className="text-[11px] font-bold text-dash-text truncate max-w-[65px]">{fmt(entry.value)}</div>
                <button onClick={() => openEditEntry(bucketKey, entry.entryId)} className="rounded border border-dash-border px-1 py-0.5 text-[9px] font-medium text-dash-text-muted hover:bg-dash-surface-active transition shrink-0">editar</button>
                <button onClick={() => removeEntry(bucketKey, entry.entryId)} className="rounded border border-dash-border px-1.5 py-0.5 text-[9px] font-medium text-red-500 hover:bg-red-50 transition shrink-0">✕</button>
            </div>
        </div>
    );
}

function BucketDrop({ stepKey, status, computed }: { stepKey: StepKey; status: StepStatus; computed: ReturnType<typeof useComputed> }) {
    const store = useArvoStoreV3();
    const { setNodeRef, isOver } = useDroppable({ id: `bucket-${stepKey}`, disabled: status === "locked" || status === "not_applicable" });

    const meta = BUCKET_META[stepKey];
    const c = lc(BUCKET_COLORS[stepKey]);
    const total = computed.bucketTotals[stepKey] ?? 0;
    const pct = computed.bucketPcts[stepKey] ?? 0;
    const target = computed.bucketTargets[stepKey] ?? 0;
    const entries = store.buckets[stepKey];
    const band = stepKey !== "reserva" && store.perfil ? PROFILE_BANDS[store.perfil][stepKey as Exclude<StepKey, "reserva">] : null;

    const statusLabel: Record<StepStatus, string> = { locked: "Bloqueado", empty: "Vazio", filling: "Preenchendo", in_range: "Na faixa ✓", over_range: "Acima ⚠", not_applicable: "N/A" };
    const statusColor: Record<StepStatus, string> = {
        locked: "border-dash-border text-dash-text-light", empty: "border-dash-border-strong text-dash-text-muted",
        filling: `${c.border} ${c.text}`, in_range: "border-emerald-300 text-emerald-700 bg-emerald-50",
        over_range: "border-amber-300 text-amber-700 bg-amber-50", not_applicable: "border-dash-border text-dash-text-light",
    };

    const borderCls = status === "locked" || status === "not_applicable" ? "border-dash-border" : status === "in_range" ? "border-emerald-200" : isOver ? `${c.border} ring-1 ${c.ring}` : c.border;
    const bgCls = status === "locked" || status === "not_applicable" ? "bg-dash-surface-active" : status === "in_range" ? "bg-emerald-50/40" : isOver ? c.bg : "bg-dash-surface";
    const barColor = status === "in_range" ? "bg-emerald-500" : status === "over_range" ? "bg-amber-500" : c.bar;

    return (
        <div ref={setNodeRef} className={`flex flex-col rounded-2xl border transition-all ${borderCls} ${bgCls} ${status === "locked" || status === "not_applicable" ? "opacity-60" : ""}`}>
            <div className="flex items-start justify-between gap-2 border-b border-dash-border p-3.5">
                <div>
                    <div className="flex items-center gap-1.5">
                        <span className={`h-2 w-2 shrink-0 rounded-full ${c.dot}`} />
                        <span className="text-[10px] uppercase tracking-[0.16em] text-dash-text-light truncate">{meta.title}</span>
                    </div>
                    <div className="mt-0.5 text-sm font-medium text-dash-text leading-tight">{meta.subtitle}</div>
                </div>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] ${statusColor[status]}`}>{statusLabel[status]}</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 p-3">
                <div className="rounded-lg bg-dash-bg px-2 py-1.5 min-w-0">
                    <div className="text-[10px] text-dash-text-light">Total</div>
                    <div className="text-sm font-semibold text-dash-text truncate">{fmt(total)}</div>
                </div>
                <div className="rounded-lg bg-dash-bg px-2 py-1.5 min-w-0">
                    <div className="text-[10px] text-dash-text-light">{stepKey === "reserva" ? "Meta" : "Faixa"}</div>
                    <div className="text-sm font-semibold text-dash-text truncate">{stepKey === "reserva" ? fmt(target) : band ? `${band.min}–${band.max}%` : "—"}</div>
                </div>
            </div>

            <div className="px-3 pb-2">
                <div className="mb-1 flex justify-between text-[10px] text-dash-text-light">
                    <span>{Math.round(pct)}%</span>
                    {band && <span className={pct >= band.min && pct <= band.max ? "text-emerald-600" : "text-amber-600"}>alvo {band.target}%</span>}
                </div>
                <div className="relative h-2 overflow-hidden rounded-full bg-dash-surface-active">
                    {band && <div className="absolute inset-y-0 rounded-full bg-dash-border" style={{ left: `${band.min}%`, width: `${band.max - band.min}%` }} />}
                    <motion.div className={`absolute inset-y-0 left-0 rounded-full ${barColor}`} animate={{ width: `${clamp(pct, 0, 100)}%` }} transition={{ type: "spring", stiffness: 100, damping: 18 }} />
                </div>
            </div>

            <div className="flex-1 px-3 pb-3">
                {entries.length === 0 ? (
                    <div className={`flex items-center justify-center rounded-lg border-2 border-dashed py-4 text-xs text-dash-text-light ${status !== "locked" && status !== "not_applicable" ? "border-dash-border hover:border-dash-border-strong" : "border-dash-border"}`}>
                        {status === "locked" ? "Bloqueado" : status === "not_applicable" ? "N/A" : "← Arraste fundos aqui"}
                    </div>
                ) : (
                    <div className="space-y-1.5">{entries.map((e) => <BucketRow key={e.entryId} entry={e} bucketKey={stepKey} />)}</div>
                )}
                {status !== "locked" && status !== "not_applicable" && (
                    <button onClick={() => store.openPendingAllocation(null, stepKey)}
                        className="mt-2 w-full rounded-lg border border-dashed border-dash-border py-1.5 text-xs text-dash-text-light transition hover:border-dash-border-strong hover:text-dash-text-muted">
                        + Fundo externo
                    </button>
                )}
            </div>
        </div>
    );
}

function AllocModal({ computed }: { computed: ReturnType<typeof useComputed> }) {
    const { pendingAllocation, editingEntry, buckets, confirmAllocation, cancelPendingAllocation, updateEntryValue, cancelEditEntry, patrimonioAtual, isQualificado } = useArvoStoreV3();
    const [val, setVal] = useState(0);
    const isEditing = !!editingEntry;
    const isOpen = !!pendingAllocation || isEditing;

    useEffect(() => { if (isOpen) setVal(0); }, [isOpen]);
    useEffect(() => { if (editingEntry) { const e = buckets[editingEntry.bucketKey].find((e) => e.entryId === editingEntry.entryId); if (e) setVal(e.value); } }, [editingEntry, buckets]);

    if (!isOpen) return null;

    const fund = pendingAllocation?.fundId ? FUNDS_LIBRARY.find((f) => f.id === pendingAllocation.fundId) : null;
    const bk = (pendingAllocation?.bucketKey ?? editingEntry?.bucketKey)!;
    const totalOthers = STEP_ORDER.flatMap((k) => buckets[k]).filter((e) => editingEntry ? e.entryId !== editingEntry.entryId : true).reduce((a, e) => a + e.value, 0);
    const maxAvailable = Math.max(0, patrimonioAtual - totalOthers);

    const suggestedWeights = getSuggestedAllocations(isQualificado)[bk];
    const suggestionForFund = fund ? suggestedWeights.find((s) => s.fundId === fund.id) : null;
    let recommendationEl = null;

    if (suggestionForFund) {
        const bucketTargetVol = computed.bucketTargets[bk] ?? 0;
        const recommnendedVolume = bucketTargetVol * (suggestionForFund.weight / 100);
        recommendationEl = (
            <div className="mt-2.5 text-[11px] text-dash-accent bg-dash-accent-light/40 px-3 py-2 rounded-lg border border-dash-accent/20">
                <span className="opacity-80">Recomendado na Carteira ARVO:</span> <br />
                <span className="font-bold">{suggestionForFund.weight}%</span> do alvo da gaveta ({fmt(recommnendedVolume)})
            </div>
        );
    }

    function handleConfirm() {
        if (val <= 0) return;
        const v = Math.min(val, maxAvailable);
        if (isEditing && editingEntry) updateEntryValue(editingEntry.bucketKey, editingEntry.entryId, v);
        else confirmAllocation(v);
    }

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm"
                onClick={isEditing ? cancelEditEntry : cancelPendingAllocation}>
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                    className="w-full max-w-sm rounded-2xl border border-dash-border bg-dash-surface p-6 shadow-xl"
                    onClick={(e) => e.stopPropagation()}>
                    <div className="mb-4">
                        <div className="text-xs uppercase tracking-[0.16em] text-dash-text-light">{isEditing ? "Editar" : "Adicionar ao pote"}</div>
                        <h3 className="mt-1 text-lg font-semibold text-dash-text">{fund ? fund.name : pendingAllocation?.customName || "Fundo externo"}</h3>
                        <div className="mt-0.5 text-sm text-dash-text-muted">Pote: <span className="font-medium text-dash-text">{BUCKET_META[bk].title}</span></div>
                    </div>
                    {!isEditing && !pendingAllocation?.fundId && (
                        <div className="mb-3">
                            <label className="mb-1 block text-xs text-dash-text-muted">Nome do fundo</label>
                            <input type="text" placeholder="Ex: Tesouro IPCA+ 2035"
                                defaultValue={pendingAllocation?.customName ?? ""}
                                onChange={(e) => { useArvoStoreV3.setState((s) => ({ pendingAllocation: s.pendingAllocation ? { ...s.pendingAllocation, customName: e.target.value } : null })); }}
                                className="w-full rounded-lg border border-dash-border-strong bg-dash-surface px-3 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent" />
                        </div>
                    )}
                    <div className="mb-2">
                        <label className="mb-1 block text-xs text-dash-text-muted">Quanto você tem neste fundo?</label>
                        <DashInput value={val} onChange={setVal} />
                        <p className="mt-1 text-[11px] text-dash-text-light">Disponível: {fmt(maxAvailable)}</p>
                        {recommendationEl}
                    </div>
                    <div className="mt-4 flex gap-2">
                        <button onClick={isEditing ? cancelEditEntry : cancelPendingAllocation}
                            className="flex-1 rounded-lg border border-dash-border-strong py-2.5 text-sm text-dash-text-muted hover:bg-dash-surface-active transition">Cancelar</button>
                        <button onClick={handleConfirm} disabled={val <= 0}
                            className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition ${val > 0 ? "bg-dash-accent text-white hover:opacity-90" : "bg-dash-surface-active text-dash-text-light cursor-not-allowed"}`}>Confirmar</button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

function GabaritoModal({ isOpen, onClose, computed }: { isOpen: boolean, onClose: () => void, computed: ReturnType<typeof useComputed> }) {
    const { isQualificado } = useArvoStoreV3();
    const suggested = getSuggestedAllocations(isQualificado);

    if (!isOpen) return null;
    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm"
                onClick={onClose}>
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                    className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-dash-border bg-dash-surface p-6 shadow-xl"
                    onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-dash-text font-serif">Gabarito Recomendado</h3>
                            <p className="text-sm text-dash-text-muted mt-0.5">Sugestão de alocação ARVO para o perfil <span className="font-semibold text-dash-accent">{isQualificado ? "Investidor Qualificado" : "Público Geral"}</span>.</p>
                        </div>
                        <button onClick={onClose} className="rounded-full w-8 h-8 flex items-center justify-center bg-dash-surface-active text-dash-text-light hover:text-dash-text transition">✕</button>
                    </div>

                    <div className="space-y-4">
                        {STEP_ORDER.map((bk) => {
                            const allocations = suggested[bk];
                            if (!allocations || allocations.length === 0) return null;
                            const targetVol = computed.bucketTargets[bk] ?? 0;
                            const c = lc(BUCKET_COLORS[bk]);
                            return (
                                <div key={bk} className={`rounded-xl border ${c.border} ${c.bg} p-4 overflow-hidden`}>
                                    <div className="text-xs uppercase tracking-widest font-bold mb-3 flex justify-between items-center">
                                        <span className={`text-[10px] ${c.text}`}>{BUCKET_META[bk].title}</span>
                                        <span className="text-dash-text-muted">Alvo da gaveta: {fmt(targetVol)}</span>
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-2.5">
                                        {allocations.map(a => {
                                            const f = FUNDS_LIBRARY.find(x => x.id === a.fundId);
                                            const vol = targetVol * (a.weight / 100);
                                            return (
                                                <div key={a.fundId} className="flex justify-between items-center bg-white/60 p-2.5 rounded-lg border border-white/50 shadow-sm">
                                                    <div className="truncate min-w-0 flex-1 pr-2">
                                                        <div className="text-[11px] font-bold text-dash-text truncate">{f ? (f.shortName || f.name) : a.fundId}</div>
                                                        <div className="text-[10px] text-dash-accent flex items-center gap-1.5 mt-0.5">
                                                            <span className="font-bold">{a.weight}%</span>
                                                            <span className="text-dash-text-light font-medium">({fmt(vol)})</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

function MotorStep({ computed }: { computed: ReturnType<typeof useComputed> }) {
    const store = useArvoStoreV3();
    const [filterCat, setFilterCat] = useState<StepKey | "all">("all");
    const [activeDragId, setActiveDragId] = useState<string | null>(null);
    const [showGabarito, setShowGabarito] = useState(false);
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

    const allocatedIds = useMemo(() => {
        const ids = new Set<string>();
        for (const k of STEP_ORDER) for (const e of store.buckets[k]) if (e.fundId) ids.add(e.fundId);
        return ids;
    }, [store.buckets]);

    // Only show funds that are actually part of the ARVO recommended portfolio for this profile
    const suggested = getSuggestedAllocations(store.isQualificado);
    const validArvoFundIds = useMemo(() => {
        const ids = new Set<string>();
        for (const bucket of Object.values(suggested)) {
            if (!bucket) continue;
            for (const item of bucket) {
                ids.add(item.fundId);
            }
        }
        return ids;
    }, [suggested]);

    const visibleFunds = useMemo(() => {
        const activeFunds = FUNDS_LIBRARY.filter(f => validArvoFundIds.has(f.id));
        return filterCat === "all" ? activeFunds : activeFunds.filter((f) => f.category === filterCat);
    }, [filterCat, validArvoFundIds]);

    const activeFund = activeDragId ? FUNDS_LIBRARY.find((f) => `fund-${f.id}` === activeDragId) : null;

    function handleDragEnd(e: DragEndEvent) {
        setActiveDragId(null);
        if (!e.over) return;
        const bk = (e.over.id as string).replace("bucket-", "") as StepKey;
        const fid = (e.active.id as string).replace("fund-", "");
        store.openPendingAllocation(fid, bk);
    }

    if (!store.dadosComplete) {
        return (
            <DashCard className="opacity-50 pointer-events-none text-center py-10">
                <p className="text-sm text-dash-text-light">Preencha os dados financeiros para ativar o Motor de Alocação.</p>
            </DashCard>
        );
    }

    return (
        <div className="space-y-4">
            <GabaritoModal isOpen={showGabarito} onClose={() => setShowGabarito(false)} computed={computed} />
            <DashCard>
                <div className="flex flex-wrap items-end justify-between gap-3 mb-1">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="text-xs uppercase tracking-[0.18em] text-dash-text-light">Etapa 3</div>
                            <button onClick={() => setShowGabarito(true)} className="rounded-full bg-dash-surface-active px-3 py-1 text-[10px] uppercase font-bold text-dash-text transition hover:opacity-80 flex items-center gap-1">
                                📖 Gabarito
                            </button>
                            <button onClick={() => {
                                store.applySuggestedAllocation(computed.bucketTargets);
                            }} className="rounded-full bg-dash-surface-active px-3 py-1 text-[10px] uppercase font-bold text-dash-accent transition hover:opacity-80 flex items-center gap-1">
                                ⚡ Carteira Sugerida
                            </button>
                            <label className="group flex cursor-pointer items-center gap-1.5" title="Investidor Qualificado (IQ)">
                                <span className="text-[10px] font-semibold uppercase text-dash-text-light transition group-hover:text-dash-text">Investidor Qualificado</span>
                                <div className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${store.isQualificado ? "bg-dash-accent" : "bg-dash-surface-active"}`}>
                                    <input type="checkbox" className="peer sr-only" checked={store.isQualificado} onChange={(e) => store.setQualificado(e.target.checked)} />
                                    <div className={`inline-block h-3 w-3 transform rounded-full bg-white transition ${store.isQualificado ? "translate-x-3.5" : "translate-x-0.5"}`} />
                                </div>
                            </label>
                        </div>
                        <h3 className="mt-0.5 text-xl font-semibold text-dash-text">Motor de Alocação</h3>
                        <p className="mt-1 max-w-xl text-sm text-dash-text-muted">Arraste os fundos para os potes manualmente, ou utilize nosso modelo inteligente clicando no botão para aplicar sua Carteira Sugerida ideal.</p>
                    </div>
                    <div className="rounded-xl border border-dash-border bg-dash-bg px-4 py-2.5 text-right">
                        <div className="text-[10px] text-dash-text-light">Engrenagem</div>
                        <div className={`text-2xl font-bold ${computed.engineComplete ? "text-emerald-600" : "text-dash-text"}`}>{Math.round(computed.overallProgress)}%</div>
                        <div className="mt-1 h-1.5 w-20 overflow-hidden rounded-full bg-dash-surface-active">
                            <motion.div className={`h-full rounded-full ${computed.engineComplete ? "bg-emerald-500" : "bg-dash-accent"}`}
                                animate={{ width: `${computed.overallProgress}%` }} transition={{ type: "spring", stiffness: 80, damping: 16 }} />
                        </div>
                    </div>
                </div>
            </DashCard>

            <DndContext sensors={sensors} collisionDetection={closestCenter}
                onDragStart={(e: DragStartEvent) => setActiveDragId(e.active.id as string)} onDragEnd={handleDragEnd}>

                {/* Fund Library */}
                <DashCard>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-medium text-dash-text">Fundos ARVO</span>
                        <div className="flex flex-wrap gap-1">
                            {([{ key: "all" as const, label: "Todos" }, ...STEP_ORDER.map((k) => ({ key: k, label: BUCKET_META[k].title }))]).map(({ key, label }) => {
                                const col = key !== "all" ? lc(BUCKET_COLORS[key]) : null;
                                return (
                                    <button key={key} onClick={() => setFilterCat(key)}
                                        className={`rounded-full border px-2.5 py-1 text-[11px] transition ${filterCat === key
                                            ? col ? `${col.border} ${col.bg} ${col.text}` : "border-dash-accent bg-dash-accent-light text-dash-accent"
                                            : "border-dash-border text-dash-text-light hover:text-dash-text-muted"}`}>
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-8">
                        {visibleFunds.map((f) => <FundCardDrag key={f.id} fund={f} allocated={allocatedIds.has(f.id)} />)}
                    </div>
                </DashCard>

                {/* Buckets */}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
                    {STEP_ORDER.map((k) => <BucketDrop key={k} stepKey={k} status={computed.bucketStatus[k]} computed={computed} />)}
                </div>

                <DragOverlay dropAnimation={{ duration: 160, easing: "ease-out" }}>
                    {activeFund && (
                        <div className={`w-28 rounded-xl border p-3 shadow-lg ${lc(activeFund.color).border} ${lc(activeFund.color).bg}`}>
                            <div className="text-xs font-medium text-dash-text">{activeFund.shortName}</div>
                            <div className="mt-0.5 text-[11px] text-dash-text-muted">{activeFund.yield12m}</div>
                        </div>
                    )}
                </DragOverlay>
            </DndContext>

            {/* Summary */}
            <DashCard className="flex items-center justify-between">
                <span className="text-sm text-dash-text-muted">Total alocado</span>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-dash-text">{fmt(computed.totalAllocated)}</span>
                    {computed.totalAllocated > store.patrimonioAtual && (
                        <span className="rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-[11px] text-amber-700">⚠ Ultrapassa patrimônio</span>
                    )}
                </div>
            </DashCard>

            {computed.engineComplete && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
                    <button onClick={() => store.setActiveSection("agendamento")}
                        className="rounded-xl bg-emerald-600 px-8 py-3 font-medium text-white shadow-md hover:bg-emerald-500 transition">
                        ⚙️ Engrenagem completa — Agendar com a ARVO →
                    </button>
                </motion.div>
            )}
        </div>
    );
}

// ═════════════════════════════════════════════════════════════════════════════
// STEP 4 — AGENDAMENTO
// ═════════════════════════════════════════════════════════════════════════════

function AgendamentoStep() {
    const { nome, setNome, email, setEmail, telefone, setTelefone, hasUpload, setHasUpload } = useArvoStoreV3();
    const fileRef = useRef<HTMLInputElement>(null);
    const canSubmit = nome && email && telefone;

    return (
        <DashCard>
            <div className="mb-5">
                <div className="text-xs uppercase tracking-[0.18em] text-emerald-600">Etapa 4 — Final</div>
                <h3 className="mt-1 text-xl font-semibold text-dash-text">Bate-papo com a ARVO</h3>
                <p className="mt-1 text-sm text-dash-text-muted">Sua escada está montada. Preencha abaixo para agendar.</p>
            </div>
            <div className="space-y-3 max-w-lg">
                {[
                    { label: "Nome completo", val: nome, set: setNome, ph: "Seu nome" },
                    { label: "E-mail", val: email, set: setEmail, ph: "voce@exemplo.com" },
                    { label: "Telefone", val: telefone, set: setTelefone, ph: "(48) 9 9999-9999" },
                ].map(({ label, val, set, ph }) => (
                    <div key={label}>
                        <label className="mb-1 block text-xs font-medium text-dash-text-muted">{label}</label>
                        <input type="text" value={val} onChange={(e) => set(e.target.value)} placeholder={ph}
                            className="w-full rounded-lg border border-dash-border-strong bg-dash-surface px-3 py-2.5 text-sm text-dash-text outline-none placeholder:text-dash-text-light focus:border-dash-accent" />
                    </div>
                ))}
                <div>
                    <label className="mb-1 block text-xs font-medium text-dash-text-muted">Comprovantes <span className="text-dash-text-light">(recomendado)</span></label>
                    <div onClick={() => fileRef.current?.click()}
                        className={`cursor-pointer rounded-xl border-2 border-dashed py-5 text-center transition ${hasUpload ? "border-emerald-300 bg-emerald-50" : "border-dash-border hover:border-dash-border-strong"}`}>
                        <input ref={fileRef} type="file" multiple accept="image/*,.pdf" className="hidden" onChange={(e) => e.target.files?.length && setHasUpload(true)} />
                        {hasUpload
                            ? <div className="text-sm text-emerald-700">✓ Comprovante enviado</div>
                            : <div className="text-sm text-dash-text-light">↑ Arraste extratos ou prints</div>}
                    </div>
                </div>
            </div>
            <motion.button whileTap={canSubmit ? { scale: 0.97 } : {}} disabled={!canSubmit}
                onClick={() => canSubmit && alert("Solicitação enviada! A equipe ARVO entrará em contato em breve.")}
                className={`mt-5 w-full max-w-lg rounded-lg py-3 font-medium transition ${canSubmit ? "bg-emerald-600 text-white hover:bg-emerald-500" : "bg-dash-surface-active text-dash-text-light cursor-not-allowed"}`}>
                Solicitar agendamento
            </motion.button>
        </DashCard>
    );
}

// ═════════════════════════════════════════════════════════════════════════════
// EXPORTAÇÃO PRINCIPAL
// ═════════════════════════════════════════════════════════════════════════════

export function EscadaTab({
    dashboardReserva,
    onUpdateReserva,
    dashboardTotalPatrimonio,
}: {
    dashboardReserva?: number;
    onUpdateReserva?: (val: number) => void;
    dashboardTotalPatrimonio?: number;
}) {
    const computed = useComputed();
    const store = useArvoStoreV3();

    const dadosRef = useRef<HTMLDivElement>(null!);
    const motorRef = useRef<HTMLDivElement>(null!);

    // Two-way sync: Escada <-> Dashboard
    // 1. If dashboard values change externally, update Escada's manual fields
    useEffect(() => {
        if (dashboardTotalPatrimonio !== undefined && dashboardTotalPatrimonio > 0 && dashboardTotalPatrimonio !== store.patrimonioAtual) {
            useArvoStoreV3.setState({ patrimonioAtual: dashboardTotalPatrimonio });
        }
    }, [dashboardTotalPatrimonio, store.patrimonioAtual]);

    // 2. If Escada's calculated Reserva updates due to bucket changes, update Dashboard
    useEffect(() => {
        if (onUpdateReserva) {
            const reservaTotal = store.buckets["reserva"]?.reduce((a, b) => a + b.value, 0) || 0;
            if (reservaTotal > 0 && reservaTotal !== dashboardReserva) {
                onUpdateReserva(reservaTotal);
            }
        }
    }, [store.buckets, onUpdateReserva, dashboardReserva]);


    useEffect(() => {
        if (store.activeSection === "motor" && motorRef.current) motorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }, [store.activeSection]);

    useEffect(() => {
        if (store.quizComplete && !store.dadosComplete && dadosRef.current) dadosRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }, [store.quizComplete, store.dadosComplete]);

    return (
        <div className="space-y-6">
            {/* Intro */}
            <div>
                <h3 className="font-serif text-2xl text-dash-text tracking-tight">Carteira ARVO</h3>
                <p className="mt-1 text-sm text-dash-text-muted">Construa seu patrimônio por camadas: descubra seu perfil, mapeie seus recursos e encaixe cada fundo no pote certo.</p>
            </div>

            <QuizStep />

            <div ref={dadosRef}>
                <DadosStep computed={computed} />
            </div>

            <div ref={motorRef}>
                <MotorStep computed={computed} />
            </div>

            <AnimatePresence>
                {computed.engineComplete && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <AgendamentoStep />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Alloc modal */}
            <AnimatePresence>
                {(store.pendingAllocation || store.editingEntry) && <AllocModal computed={computed} />}
            </AnimatePresence>
        </div>
    );
}
