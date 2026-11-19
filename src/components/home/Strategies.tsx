"use client";

import { useRef, useState, useMemo } from "react";
import { links, strategies as S } from "./content";
import { pct } from "./ui";
import { HISTORICAL_DATA } from "@/data/historicalData";
import { RECOMMENDED_PORTFOLIOS } from "@/data/portfoliosData";

const tone = ["#BFD9DB", "#6FA7AC", "#2B6E76", "#123044"];
const volLabels = ["Baixa", "Baixa a moderada", "Moderada a alta", "Alta"];

function formatMonthYear(ds: string) {
  if (!ds) return "";
  const parts = ds.split("-");
  if (parts.length < 2) return ds;
  const m = parseInt(parts[1], 10);
  const y = parts[0];
  const mNames = ["jan.", "fev.", "mar.", "abr.", "mai.", "jun.", "jul.", "ago.", "set.", "out.", "nov.", "dez."];
  return `${mNames[m - 1]} ${y}`;
}

export function Strategies() {
  const [i, setI] = useState(2);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const { items, period } = useMemo(() => {
    const portfoliosToCalc = ["Abrigo", "Ritmo", "Visão", "Oceano"];
    const iqPortfolios = RECOMMENDED_PORTFOLIOS.filter(
      (p) => p.itype === "IQ" && p.tier === "Normal" && portfoliosToCalc.includes(p.perfil)
    );
    const numMonths = HISTORICAL_DATA.months.length;

    let cdiSeries = [1];
    let currentCdi = 1;
    for (let m = 0; m < numMonths; m++) {
      currentCdi *= 1 + HISTORICAL_DATA.cdi[m];
      cdiSeries.push(currentCdi);
    }
    const cTot = cdiSeries[numMonths] - 1;

    const portRets: Record<string, number> = {};
    portfoliosToCalc.forEach((pf) => {
      let currentVal = 1;
      const pData = iqPortfolios.find((x) => x.perfil === pf);
      if (pData) {
        for (let m = 0; m < numMonths; m++) {
          let mRet = 0;
          for (const [fundName, weight] of Object.entries(pData.weights)) {
            const fund = HISTORICAL_DATA.funds.find((f) => f.name === fundName);
            if (fund && typeof fund.values[m] === "number") {
              mRet += weight * fund.values[m];
            }
          }
          currentVal *= 1 + mRet;
        }
      }
      portRets[pf] = currentVal - 1;
    });

    const calculated = S.items.map((item) => {
      const match = portfoliosToCalc.find(
        (p) => p.toLowerCase() === item.id.toLowerCase() || p.toLowerCase() === item.name.toLowerCase()
      );
      const rawCdiPct = match && cTot > 0 ? (portRets[match] / cTot) * 100 : item.cdi;
      return {
        ...item,
        cdi: Number(rawCdiPct.toFixed(2)),
      };
    });

    const startStr = formatMonthYear(HISTORICAL_DATA.months[0]);
    const endStr = formatMonthYear(HISTORICAL_DATA.months[numMonths - 1]);
    const dynamicPeriod = `Acumulado de ${startStr} a ${endStr}`;

    return { items: calculated, period: dynamicPeriod };
  }, []);

  const s = items[i];
  const max = Math.max(...items.map((x) => x.cdi)) * 1.05;

  const onKey = (e: React.KeyboardEvent) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (i + d + items.length) % items.length;
    setI(n);
    tabs.current[n]?.focus();
  };

  return (
    <div className="ah-strat">
      <div className="ah-tabs" role="tablist" aria-label="Estratégias ARVO" onKeyDown={onKey}>
        {items.map((x, k) => (
          <button
            key={x.id}
            ref={(el) => { tabs.current[k] = el; }}
            role="tab"
            id={`tab-${x.id}`}
            aria-selected={k === i}
            aria-controls={`panel-${x.id}`}
            tabIndex={k === i ? 0 : -1}
            className="ah-tab"
            onClick={() => setI(k)}
          >
            <span className="ah-tab__dot" style={{ background: tone[k] }} />
            {x.name}
          </button>
        ))}
      </div>

      <div className="ah-strat__body" role="tabpanel" id={`panel-${s.id}`} aria-labelledby={`tab-${s.id}`}>
        <div className="ah-strat__info">
          <p className="ah-strat__kind">{s.kind}</p>
          <h3 className="ah-strat__name">{s.name}</h3>
          <p className="ah-strat__text">{s.text}</p>
          <div className="ah-risk" aria-label={`Volatilidade: ${volLabels[s.risk - 1]}`}>
            <span className="ah-risk__label">Volatilidade</span>
            <span className="ah-risk__bars">
              {[1, 2, 3, 4].map((n) => (
                <span key={n} className={n <= s.risk ? "is-on" : ""} />
              ))}
            </span>
            <span className="ah-risk__desc">{volLabels[s.risk - 1]}</span>
          </div>
        </div>

        <div className="ah-strat__result">
          <p className="ah-strat__rlabel">Resultado</p>
          <p className="ah-strat__big">
            {pct(s.cdi)} <span>do CDI</span>
          </p>
          <p className="ah-strat__period">{period}</p>
          <ul className="ah-bars" aria-label="Comparação com o CDI">
            {items.map((x, k) => (
              <li key={x.id} className={k === i ? "is-active" : ""}>
                <span className="ah-bars__name">{x.name}</span>
                <span className="ah-bars__track">
                  <span className="ah-bars__fill" style={{ width: `${(x.cdi / max) * 100}%`, background: tone[k] }} />
                </span>
                <span className="ah-bars__val">{pct(x.cdi)}</span>
              </li>
            ))}
            <li className="ah-bars__cdi">
              <span className="ah-bars__name">CDI</span>
              <span className="ah-bars__track">
                <span className="ah-bars__fill" style={{ width: `${(100 / max) * 100}%` }} />
              </span>
              <span className="ah-bars__val">100,00%</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="ah-strat__foot">
        <p>{S.disclaimer}</p>
        <a className="ah-link" href={links.cadastro}>
          {S.cta}
        </a>
      </div>
    </div>
  );
}
