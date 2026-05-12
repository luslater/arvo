"use client"

import React, { useState } from "react"

const chartPaths = {
  Total: {
    CDI: "M60.0,250.0 L77.2,247.4 L94.4,244.8 L111.7,242.2 L128.9,239.5 L146.1,236.9 L163.3,234.2 L180.6,231.5 L197.8,228.7 L215.0,225.9 L232.2,223.1 L249.4,220.2 L266.7,217.2 L283.9,214.2 L301.1,211.3 L318.3,208.3 L335.6,205.2 L352.8,202.2 L370.0,199.2 L387.2,196.2 L404.4,193.2 L421.7,190.1 L438.9,187.0 L456.1,183.8 L473.3,180.7 L490.6,176.8 L507.8,172.7 L525.0,168.7 L542.2,164.5 L559.4,160.3 L576.7,155.9 L593.9,151.7 L611.1,147.4 L628.3,142.9 L645.6,138.5 L662.8,134.1 L680.0,129.5",
    ABRIGO: "M60.0,250.0 L77.2,247.5 L94.4,244.6 L111.7,242.0 L128.9,239.4 L146.1,236.8 L163.3,233.9 L180.6,231.0 L197.8,228.2 L215.0,225.3 L232.2,222.2 L249.4,219.1 L266.7,216.1 L283.9,213.3 L301.1,210.1 L318.3,207.0 L335.6,203.9 L352.8,200.7 L370.0,197.6 L387.2,194.5 L404.4,191.3 L421.7,188.2 L438.9,185.0 L456.1,181.9 L473.3,178.8 L490.6,174.8 L507.8,170.4 L525.0,166.2 L542.2,161.9 L559.4,157.8 L576.7,153.5 L593.9,148.9 L611.1,144.5 L628.3,139.9 L645.6,135.5 L662.8,131.0 L680.0,126.4",
    RITMO: "M60.0,250.0 L77.2,247.0 L94.4,243.5 L111.7,240.5 L128.9,237.5 L146.1,235.4 L163.3,232.3 L180.6,228.9 L197.8,226.2 L215.0,222.8 L232.2,220.6 L249.4,217.3 L266.7,214.4 L283.9,210.8 L301.1,207.7 L318.3,203.6 L335.6,199.9 L352.8,196.5 L370.0,192.6 L387.2,190.1 L404.4,187.0 L421.7,183.0 L438.9,180.1 L456.1,177.3 L473.3,174.2 L490.6,169.2 L507.8,162.5 L525.0,156.6 L542.2,152.3 L559.4,147.5 L576.7,141.5 L593.9,135.6 L611.1,130.0 L628.3,124.3 L645.6,118.1 L662.8,111.4 L680.0,105.3",
    VISAO: "M60.0,250.0 L77.2,244.5 L94.4,239.2 L111.7,237.3 L128.9,232.7 L146.1,230.4 L163.3,228.0 L180.6,223.5 L197.8,219.3 L215.0,220.8 L232.2,217.7 L249.4,213.1 L266.7,213.9 L283.9,208.4 L301.1,204.3 L318.3,198.7 L335.6,197.6 L352.8,192.9 L370.0,188.6 L387.2,185.9 L404.4,185.2 L421.7,181.1 L438.9,174.8 L456.1,171.6 L473.3,166.9 L490.6,164.6 L507.8,156.6 L525.0,150.8 L542.2,144.2 L559.4,139.5 L576.7,128.0 L593.9,122.3 L611.1,115.3 L628.3,106.3 L645.6,98.7 L662.8,91.8 L680.0,81.9",
    OCEANO: "M60.0,250.0 L77.2,252.9 L94.4,248.5 L111.7,236.2 L128.9,231.3 L146.1,231.6 L163.3,230.0 L180.6,234.3 L197.8,231.1 L215.0,219.5 L232.2,221.4 L249.4,217.8 L266.7,216.1 L283.9,197.4 L301.1,185.1 L318.3,177.4 L335.6,166.9 L352.8,163.2 L370.0,165.5 L387.2,156.3 L404.4,150.5 L421.7,151.9 L438.9,150.9 L456.1,146.2 L473.3,150.5 L490.6,140.1 L507.8,133.7 L525.0,126.1 L542.2,126.0 L559.4,114.3 L576.7,111.7 L593.9,106.0 L611.1,95.5 L628.3,90.0 L645.6,81.2 L662.8,77.3 L680.0,68.7"
  },
  "1A": {
    CDI: "M60.0,250.0 L111.7,240.0 L163.3,229.6 L215.0,219.2 L266.7,208.5 L318.3,197.7 L370.0,186.6 L421.7,175.8 L473.3,164.7 L525.0,153.2 L576.7,141.9 L628.3,130.8 L680.0,119.1",
    ABRIGO: "M60.0,250.0 L111.7,239.9 L163.3,228.6 L215.0,218.0 L266.7,207.0 L318.3,196.7 L370.0,185.8 L421.7,174.0 L473.3,162.9 L525.0,151.1 L576.7,140.0 L628.3,128.4 L680.0,116.9",
    RITMO: "M60.0,250.0 L111.7,237.4 L163.3,220.8 L215.0,205.9 L266.7,195.0 L318.3,183.0 L370.0,168.1 L421.7,153.3 L473.3,139.3 L525.0,124.9 L576.7,109.4 L628.3,92.4 L680.0,77.3",
    VISAO: "M60.0,250.0 L111.7,244.4 L163.3,224.7 L215.0,210.5 L266.7,194.3 L318.3,182.7 L370.0,154.5 L421.7,140.4 L473.3,123.3 L525.0,101.2 L576.7,82.4 L628.3,65.4 L680.0,41.3",
    OCEANO: "M60.0,250.0 L111.7,225.6 L163.3,210.5 L215.0,192.7 L266.7,192.4 L318.3,165.1 L370.0,158.8 L421.7,145.4 L473.3,120.8 L525.0,107.9 L576.7,87.2 L628.3,77.9 L680.0,57.9"
  },
  "6M": {
    CDI: "M60.0,250.0 L163.3,228.9 L266.7,207.4 L370.0,185.1 L473.3,163.1 L576.7,141.6 L680.0,118.7",
    ABRIGO: "M60.0,250.0 L163.3,227.3 L266.7,205.6 L370.0,182.7 L473.3,161.2 L576.7,138.6 L680.0,116.4",
    RITMO: "M60.0,250.0 L163.3,221.7 L266.7,194.9 L370.0,167.7 L473.3,138.1 L576.7,105.7 L680.0,77.0",
    VISAO: "M60.0,250.0 L163.3,223.5 L266.7,191.3 L370.0,149.8 L473.3,114.5 L576.7,82.6 L680.0,37.2",
    OCEANO: "M60.0,250.0 L163.3,224.8 L266.7,178.3 L370.0,154.0 L473.3,114.8 L576.7,97.4 L680.0,59.6"
  },
  "3M": {
    CDI: "M60.0,250.0 L266.7,207.6 L473.3,165.9 L680.0,121.8",
    ABRIGO: "M60.0,250.0 L266.7,208.5 L473.3,165.1 L680.0,122.1",
    RITMO: "M60.0,250.0 L266.7,193.4 L473.3,131.4 L680.0,76.3",
    VISAO: "M60.0,250.0 L266.7,183.1 L473.3,122.6 L680.0,36.6",
    OCEANO: "M60.0,250.0 L266.7,175.6 L473.3,142.4 L680.0,70.5"
  }
}

const xLabelsData = {
  Total: ["jan. 23", "jul. 23", "jan. 24", "jul. 24", "jan. 25", "jul. 25", "jan. 26"],
  "1A": ["jan. 25", "mar. 25", "mai. 25", "jul. 25", "set. 25", "nov. 25", "jan. 26"],
  "6M": ["ago. 25", "set. 25", "out. 25", "nov. 25", "dez. 25", "jan. 26"],
  "3M": ["out. 25", "nov. 25", "dez. 25", "jan. 26"]
}

const yLabelsData = {
  Total: ["0%", "20%", "40%", "60%", "80%"],
  "1A": ["0%", "6.25%", "12.5%", "18.75%", "25%"],
  "6M": ["0%", "3%", "6%", "9%", "12%"],
  "3M": ["0%", "1.5%", "3%", "4.5%", "6%"]
}

type Range = keyof typeof chartPaths

export function PerformanceChart() {
  const [range, setRange] = useState<Range>("Total")

  const paths = chartPaths[range]
  const yLabels = yLabelsData[range]
  const xLabels = xLabelsData[range]
  const xStep = 620 / (xLabels.length - 1)

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

          <g fontFamily="'Space Grotesk', sans-serif" fontSize="11" fill="var(--ink-4)" textAnchor="end">
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

          <g fontFamily="'Space Grotesk', sans-serif" fontSize="11" fill="var(--ink-4)" textAnchor="middle">
            {xLabels.map((lbl, i) => (
              <text key={lbl} x={60 + i * xStep} y="275" className="x-label">{lbl}</text>
            ))}
          </g>

          <path d={paths.CDI} fill="none" stroke="var(--ink-4)" strokeWidth="1.5" strokeDasharray="4 5" style={{ transition: "d 0.4s ease" }} />
          <path d={paths.ABRIGO} fill="none" stroke="rgba(201,169,97,.4)" strokeWidth="2" strokeLinecap="round" style={{ transition: "d 0.4s ease" }} />
          <path d={paths.RITMO} fill="none" stroke="rgba(201,169,97,.7)" strokeWidth="2" strokeLinecap="round" style={{ transition: "d 0.4s ease" }} />
          <path d={paths.VISAO} fill="none" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "d 0.4s ease" }} />
          <path d={paths.VISAO + " L680,250 L60,250 Z"} fill="url(#perfG)" style={{ transition: "d 0.4s ease" }} />
          <path d={paths.OCEANO} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "d 0.4s ease" }} />
        </svg>
        <div className="chart-legend" style={{ flexWrap: "wrap", gap: "12px 24px", justifyContent: "flex-start", marginLeft: "60px" }}>
          <span><i style={{ background: "rgba(201,169,97,.4)" }}></i> Abrigo <small style={{ opacity: .6, fontSize: "11px", marginLeft: "4px" }}>(104,22% do CDI · 1,05% am)</small></span>
          <span><i style={{ background: "rgba(201,169,97,.7)" }}></i> Ritmo <small style={{ opacity: .6, fontSize: "11px", marginLeft: "4px" }}>(120,98% do CDI · 1,22% am)</small></span>
          <span><i style={{ background: "var(--ink)" }}></i> Visão <small style={{ opacity: .6, fontSize: "11px", marginLeft: "4px" }}>(134,14% do CDI · 1,35% am)</small></span>
          <span><i style={{ background: "var(--accent)" }}></i> Oceano <small style={{ opacity: .6, fontSize: "11px", marginLeft: "4px" }}>(147,03% do CDI · 1,49% am)</small></span>
          <span><i style={{ background: "var(--ink-4)", border: "1px dashed currentColor" }}></i> CDI <small style={{ opacity: .6, fontSize: "11px", marginLeft: "4px" }}>(1,01% am)</small></span>
          <span style={{ marginLeft: "auto", color: "var(--ink-3)", fontSize: "11px" }}>Jan/2023 — Atual · Rentabilidade Acumulada</span>
        </div>
      </div>
    </div>
  )
}
