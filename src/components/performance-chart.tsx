"use client"

import React, { useState, useMemo } from "react"
import { HISTORICAL_DATA } from "@/data/historicalData"
import { RECOMMENDED_PORTFOLIOS } from "@/data/portfoliosData"

type Range = "Total" | "1A" | "6M" | "3M"

function niceMax(val: number) {
  if (val <= 0) return 0.05
  // find a nice ceiling (like 0.05, 0.10, 0.20, 0.50, 1.0)
  const steps = [0.05, 0.10, 0.15, 0.20, 0.25, 0.30, 0.40, 0.50, 0.60, 0.80, 1.0, 1.5, 2.0]
  for (const s of steps) {
    if (val <= s) return s
  }
  return Math.ceil(val * 10) / 10
}

function formatDate(ds: string) {
  // ds is "2023-01"
  const parts = ds.split("-")
  const m = parseInt(parts[1], 10)
  const y = parts[0].slice(2)
  const mNames = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"]
  return `${mNames[m-1]}. ${y}`
}

export function PerformanceChart() {
  const [range, setRange] = useState<Range>("Total")

  const { data, labels, maxVal, cdiRet, portRets, cdiMonth, portMonth } = useMemo(() => {
    const portfoliosToCalc = ["Abrigo", "Ritmo", "Visão", "Oceano"]
    const iqPortfolios = RECOMMENDED_PORTFOLIOS.filter(p => p.itype === "IQ" && p.tier === "Normal" && portfoliosToCalc.includes(p.perfil))

    const numMonths = HISTORICAL_DATA.months.length

    // raw series (each value is 1 + ret)
    let cdiSeries = [1]
    let currentCdi = 1
    for (let i = 0; i < numMonths; i++) {
      currentCdi *= (1 + HISTORICAL_DATA.cdi[i])
      cdiSeries.push(currentCdi)
    }

    const portSeries: Record<string, number[]> = {}
    portfoliosToCalc.forEach(pf => {
      portSeries[pf] = [1]
      let currentVal = 1
      const pData = iqPortfolios.find(x => x.perfil === pf)
      if (pData) {
        for (let i = 0; i < numMonths; i++) {
          let mRet = 0
          for (const [fundName, weight] of Object.entries(pData.weights)) {
            const fund = HISTORICAL_DATA.funds.find(f => f.name === fundName)
            if (fund && typeof fund.values[i] === 'number') {
              mRet += weight * fund.values[i]
            }
          }
          currentVal *= (1 + mRet)
          portSeries[pf].push(currentVal)
        }
      } else {
        // fallback to 1s if missing
        for (let i = 0; i < numMonths; i++) portSeries[pf].push(1)
      }
    })

    // Determine window based on range
    let sliceLen = numMonths + 1
    if (range === "1A") sliceLen = 13 // 12 months of returns = 13 data points
    if (range === "6M") sliceLen = 7
    if (range === "3M") sliceLen = 4
    
    // Safety check if historical data is shorter than requested range
    if (sliceLen > numMonths + 1) sliceLen = numMonths + 1

    const startIdx = (numMonths + 1) - sliceLen

    // Rebase series to 1 at startIdx
    const rebase = (series: number[]) => {
      const base = series[startIdx]
      return series.slice(startIdx).map(v => (v / base) - 1)
    }

    const cdiData = rebase(cdiSeries)
    const pDataRebased: Record<string, number[]> = {}
    portfoliosToCalc.forEach(pf => {
      pDataRebased[pf] = rebase(portSeries[pf])
    })

    // Calculate max value for Y-axis scaling
    let max = Math.max(...cdiData)
    portfoliosToCalc.forEach(pf => {
      max = Math.max(max, ...pDataRebased[pf])
    })
    
    // Labels for X-axis (extract dates for the period)
    // The dates array is `months`, shifted by 1 because the 0th point is the start (0% return)
    const dates = ["Inicio", ...HISTORICAL_DATA.months]
    const sliceDates = dates.slice(startIdx)
    // Show max 7 labels on X axis
    const step = Math.max(1, Math.floor((sliceDates.length - 1) / 6))
    const xLabels = []
    for (let i = 0; i < sliceDates.length; i += step) {
      if (i === 0 && sliceDates[i] === "Inicio") {
         // get previous month for the 'Inicio' point
         const prevIdx = startIdx - 1
         if (prevIdx >= 0 && prevIdx < HISTORICAL_DATA.months.length) {
            xLabels.push(formatDate(HISTORICAL_DATA.months[prevIdx]))
         } else {
            xLabels.push("Início")
         }
      } else {
         xLabels.push(sliceDates[i] !== "Inicio" ? formatDate(sliceDates[i]) : "Início")
      }
    }
    // Ensure the last label is the current month
    if (xLabels[xLabels.length-1] !== formatDate(HISTORICAL_DATA.months[numMonths-1])) {
       xLabels[xLabels.length-1] = formatDate(HISTORICAL_DATA.months[numMonths-1])
    }

    // Legend data (Total cumulative returns)
    // Note: Legend usually shows full period return (Total) even if viewing 3M
    const cTot = cdiSeries[numMonths] - 1
    const pRets: Record<string, number> = {}
    const cdiMonthly = Math.pow(1 + cTot, 1 / numMonths) - 1
    const pMonthly: Record<string, number> = {}

    portfoliosToCalc.forEach(pf => {
      const tot = portSeries[pf][numMonths] - 1
      pRets[pf] = tot
      pMonthly[pf] = Math.pow(1 + tot, 1 / numMonths) - 1
    })

    return { 
      data: { CDI: cdiData, ABRIGO: pDataRebased["Abrigo"], RITMO: pDataRebased["Ritmo"], VISAO: pDataRebased["Visão"], OCEANO: pDataRebased["Oceano"] },
      labels: xLabels,
      maxVal: niceMax(max),
      cdiRet: cTot,
      portRets: pRets,
      cdiMonth: cdiMonthly,
      portMonth: pMonthly
    }
  }, [range])

  const yLabels = [0, maxVal * 0.25, maxVal * 0.5, maxVal * 0.75, maxVal].map(v => (v * 100).toFixed(1).replace(".0", "") + "%")
  const xStep = 620 / (data.CDI.length - 1)
  
  const toPath = (points: number[]) => {
    return points.map((v, i) => {
      const x = 60 + i * xStep
      const y = 250 - (v / maxVal) * 230
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    }).join(" ")
  }

  const paths = {
    CDI: toPath(data.CDI),
    ABRIGO: toPath(data.ABRIGO),
    RITMO: toPath(data.RITMO),
    VISAO: toPath(data.VISAO),
    OCEANO: toPath(data.OCEANO)
  }
  
  const fmtPct = (v: number) => (v * 100).toFixed(2).replace(".", ",") + "%"

  return (
    <div className="perf-block" style={{ gridTemplateColumns: '1fr' }}>
      <div className="chart">
        <div className="chart-head">
          <div className="title">Carteira ARVO vs. CDI</div>
          <div className="range">
            {["3M", "6M", "1A", "Total"].map((r) => (
              <button
                key={r}
                className={range === r ? "on" : ""}
                onClick={() => setRange(r as Range)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <svg viewBox="0 0 700 300" preserveAspectRatio="none" style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="perfG" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="var(--accent)" stopOpacity=".12" />
              <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>

          <g fontFamily="inherit" fontSize="11" fill="var(--ink-4)" textAnchor="end">
            <text x="50" y="10" fontWeight="600" fill="var(--ink-3)">Retorno %</text>
            <text x="50" y="254" className="y-label">{yLabels[0]}</text>
            <text x="50" y="196.5" className="y-label">{yLabels[1]}</text>
            <text x="50" y="139" className="y-label">{yLabels[2]}</text>
            <text x="50" y="81.5" className="y-label">{yLabels[3]}</text>
            <text x="50" y="24" className="y-label">{yLabels[4]}</text>

            <g stroke="var(--rule)" strokeWidth="1" opacity="0.4">
              <line x1="60" y1="250" x2="680" y2="250" />
              <line x1="60" y1="192.5" x2="680" y2="192.5" />
              <line x1="60" y1="135" x2="680" y2="135" />
              <line x1="60" y1="77.5" x2="680" y2="77.5" />
              <line x1="60" y1="20" x2="680" y2="20" />
            </g>
          </g>

          <g fontFamily="inherit" fontSize="11" fill="var(--ink-4)" textAnchor="middle">
            {labels.map((lbl, i) => (
              <text key={i} x={60 + (i / (labels.length - 1)) * 620} y="275" className="x-label">{lbl}</text>
            ))}
          </g>

          <path d={paths.CDI} fill="none" stroke="#8a918a" strokeWidth="1.75" strokeDasharray="4 4" style={{ transition: "d 0.4s ease" }} />
          <path d={paths.ABRIGO} fill="none" stroke="#bfa075" strokeWidth="2.2" strokeLinecap="round" style={{ transition: "d 0.4s ease" }} />
          <path d={paths.RITMO} fill="none" stroke="#4FA080" strokeWidth="2.2" strokeLinecap="round" style={{ transition: "d 0.4s ease" }} />
          <path d={paths.VISAO} fill="none" stroke="#123044" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "d 0.4s ease" }} />
          <path d={paths.VISAO + " L680,250 L60,250 Z"} fill="url(#perfG)" style={{ transition: "d 0.4s ease" }} />
          <path d={paths.OCEANO} fill="none" stroke="#2B6E76" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "d 0.4s ease" }} />
        </svg>
        <div className="chart-legend" style={{ display: "flex", flexWrap: "wrap", gap: "14px 20px", justifyContent: "flex-start", marginTop: "16px", paddingTop: "14px", borderTop: "1px solid var(--rule)" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><i style={{ width: "12px", height: "4px", borderRadius: "2px", background: "#bfa075", display: "inline-block" }}></i> <strong style={{ color: "var(--ink)" }}>Abrigo</strong> <small style={{ opacity: .7, fontSize: "11px" }}>({fmtPct(portRets.Abrigo / cdiRet)} CDI)</small></span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><i style={{ width: "12px", height: "4px", borderRadius: "2px", background: "#4FA080", display: "inline-block" }}></i> <strong style={{ color: "var(--ink)" }}>Ritmo</strong> <small style={{ opacity: .7, fontSize: "11px" }}>({fmtPct(portRets.Ritmo / cdiRet)} CDI)</small></span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><i style={{ width: "12px", height: "4px", borderRadius: "2px", background: "#123044", display: "inline-block" }}></i> <strong style={{ color: "var(--ink)" }}>Visão</strong> <small style={{ opacity: .7, fontSize: "11px" }}>({fmtPct(portRets.Visão / cdiRet)} CDI)</small></span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><i style={{ width: "12px", height: "4px", borderRadius: "2px", background: "#2B6E76", display: "inline-block" }}></i> <strong style={{ color: "var(--ink)" }}>Oceano</strong> <small style={{ opacity: .7, fontSize: "11px" }}>({fmtPct(portRets.Oceano / cdiRet)} CDI)</small></span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><i style={{ width: "12px", height: "4px", borderRadius: "2px", background: "#8a918a", border: "1px dashed #8a918a", display: "inline-block" }}></i> <strong style={{ color: "var(--ink)" }}>CDI</strong> <small style={{ opacity: .7, fontSize: "11px" }}>({fmtPct(cdiMonth)} a.m.)</small></span>
          <span style={{ marginLeft: "auto", color: "var(--ink-3)", fontSize: "11px", fontFamily: "monospace" }}>{formatDate(HISTORICAL_DATA.months[0])} a Atual | Acumulado</span>
        </div>
      </div>
    </div>
  )
}
