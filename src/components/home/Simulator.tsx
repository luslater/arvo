"use client";

import { useId, useMemo, useState } from "react";
import { links, simulator as S } from "./content";
import { brl } from "./ui";

type Key = "invested" | "monthly" | "income";

const monthlyRate = Math.pow(1 + S.realRate, 1 / 12) - 1;
const fv = (P: number, C: number, n: number) =>
  P * Math.pow(1 + monthlyRate, n) + (C * (Math.pow(1 + monthlyRate, n) - 1)) / monthlyRate;

export function Simulator() {
  const id = useId();
  const [v, setV] = useState<Record<Key, number>>(() =>
    Object.fromEntries(S.fields.map((f) => [f.key, f.value])) as Record<Key, number>,
  );

  const r = useMemo(() => {
    const target = (v.income * 12) / S.withdrawalRate;
    let n = 0;
    const max = 60 * 12;
    while (n <= max && fv(v.invested, v.monthly, n) < target) n++;
    const reached = n <= max;
    const years = Math.ceil(n / 12);
    const year = new Date().getFullYear() + years;
    const income20 = (fv(v.invested, v.monthly, 240) * S.withdrawalRate) / 12;

    // curva para o gráfico (até o ano da meta + 5, mínimo 15 anos, máximo 40)
    const span = Math.min(40, Math.max(15, (reached ? years : 35) + 5));
    const pts = Array.from({ length: span + 1 }, (_, y) => fv(v.invested, v.monthly, y * 12));
    const top = Math.max(target * 1.15, pts[pts.length - 1]);
    const W = 320, H = 96;
    const x = (i: number) => (i / span) * W;
    const yv = (val: number) => H - (val / top) * H;
    const line = pts.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${yv(p).toFixed(1)}`).join(" ");
    const area = `${line} L${W} ${H} L0 ${H} Z`;
    const ty = yv(target);
    const mx = reached ? x(Math.min(years, span)) : null;
    return { target, reached, years, year, income20, line, area, ty, mx, span, W, H };
  }, [v]);

  return (
    <div className="ah-sim" aria-labelledby={`${id}-t`}>
      <div className="ah-sim__head">
        <p className="ah-sim__label">{S.label}</p>
        <h2 id={`${id}-t`} className="ah-sim__title">{S.title}</h2>
      </div>

      <div className="ah-sim__fields">
        {S.fields.map((f) => {
          const val = v[f.key as Key];
          const pctFill = ((val - f.min) / (f.max - f.min)) * 100;
          return (
            <div className="ah-field" key={f.key}>
              <div className="ah-field__row">
                <label htmlFor={`${id}-${f.key}`}>{f.label}</label>
                <output htmlFor={`${id}-${f.key}`}>{brl(val)}</output>
              </div>
              <input
                id={`${id}-${f.key}`}
                type="range"
                min={f.min}
                max={f.max}
                step={f.step}
                value={val}
                aria-valuetext={brl(val)}
                style={{ ["--fill" as string]: `${pctFill}%` }}
                onChange={(e) => setV((s) => ({ ...s, [f.key]: Number(e.target.value) }))}
              />
            </div>
          );
        })}
      </div>

      <div className="ah-sim__result" aria-live="polite">
        <div className="ah-sim__big">
          <span className="ah-sim__kicker">Independência financeira</span>
          {r.reached ? (
            <>
              <strong>{r.year}</strong>
              <span>em {r.years} {r.years === 1 ? "ano" : "anos"}</span>
            </>
          ) : (
            <>
              <strong>60+ anos</strong>
              <span>aumente o aporte mensal</span>
            </>
          )}
        </div>
        <svg className="ah-sim__chart" viewBox={`0 0 ${r.W} ${r.H}`} preserveAspectRatio="none" aria-hidden="true">
          <path d={r.area} className="ah-sim__area" />
          <line x1="0" x2={r.W} y1={r.ty} y2={r.ty} className="ah-sim__target" />
          <path d={r.line} className="ah-sim__line" />
          {r.mx !== null && <circle cx={r.mx} cy={r.ty} r="4" className="ah-sim__dot" />}
        </svg>
      </div>

      <dl className="ah-sim__facts">
        <div>
          <dt>Patrimônio necessário</dt>
          <dd>{brl(r.target)}</dd>
        </div>
        <div>
          <dt>Renda possível em 20 anos</dt>
          <dd>{brl(r.income20)}/mês</dd>
        </div>
      </dl>

      <a className="ah-btn ah-btn--dark ah-btn--block" href={links.diagnostico}>
        {S.cta}
      </a>
      <p className="ah-sim__note">{S.note}</p>
    </div>
  );
}
