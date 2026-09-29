"use client"
import { useState, useMemo } from "react";
import { ArrowRight } from "lucide-react";

// ─── Helpers ───
const fmt = (v: any) => v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtCurrency = (v: any) => `R$ ${fmt(v)}`;

// ─── Cálculo: projeção com juros compostos (6% a.a. acima da inflação) ───
function calcProjection(patrimonio: any, aporteMensal: any, gastoMensal: any, taxaAnualReal = 0.06) {
  const taxaMensal = Math.pow(1 + taxaAnualReal, 1 / 12) - 1;
  const metaPatrimonio = gastoMensal * 12 * 25; // Regra dos 4%
  const maxMeses = 40 * 12; // 40 anos máximo

  let saldo = patrimonio;
  let anoIndependencia = patrimonio >= metaPatrimonio ? 0 : null;
  const pontos = [{ mes: 0, saldo }];

  for (let m = 1; m <= maxMeses; m++) {
    saldo = saldo * (1 + taxaMensal) + aporteMensal;
    if (m % 12 === 0) {
      pontos.push({ mes: m, saldo });
    }
    if (anoIndependencia === null && saldo >= metaPatrimonio) {
      anoIndependencia = Math.ceil(m / 12);
    }
  }

  const saldoFinal20 = pontos.find((p: any) => p.mes === 240)?.saldo || saldo;
  const rendaMensal20 = (saldoFinal20 * 0.04) / 12;

  return {
    pontos,
    metaPatrimonio,
    anoIndependencia,
    saldoFinal20,
    rendaMensal20,
    anoAtual: new Date().getFullYear(),
  };
}

// ─── Componente Slider ───
function SliderInput({ label, value, onChange, min, max, step, prefix = "R$", suffix = "" }: any) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        marginBottom: 4
      }}>
        <span style={{ fontSize: 13, color: "#888", fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 17, fontWeight: 600, color: "#1A1A1A", letterSpacing: -0.5 }}>
          {prefix && <span style={{ fontSize: 13, color: "#999", marginRight: 2 }}>{prefix}</span>}
          {fmt(value)}
          {suffix && <span style={{ fontSize: 13, color: "#999", marginLeft: 2 }}>{suffix}</span>}
        </span>
      </div>
      <div style={{ position: "relative", height: 24, display: "flex", alignItems: "center" }}>
        <div style={{
          position: "absolute", left: 0, right: 0, height: 6, borderRadius: 3,
          background: "#E8E2D6",
        }} />
        <div style={{
          position: "absolute", left: 0, width: `${pct}%`, height: 6, borderRadius: 3,
          background: "linear-gradient(90deg, #4FA080, #2B6E76)",
          transition: "width 0.05s ease-out"
        }} />
        <input
          type="range"
          aria-label={label}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            position: "absolute", width: "100%", height: 28,
            opacity: 0, cursor: "pointer", zIndex: 2,
            margin: 0,
          }}
        />
        <div style={{
          position: "absolute",
          left: `calc(${pct}% - 8px)`,
          width: 16, height: 16, borderRadius: "50%",
          background: "#4FA080",
          boxShadow: "0 2px 8px rgba(79,160,128,0.4)",
          transition: "left 0.05s ease-out",
          pointerEvents: "none",
        }} />
      </div>
      <div style={{
        display: "flex", justifyContent: "space-between",
        fontSize: 11, color: "#bbb", marginTop: 4
      }}>
        <span>{prefix} {fmt(min)}</span>
        <span>{prefix} {fmt(max)}</span>
      </div>
    </div>
  );
}

// ─── Mini Chart SVG ───
function MiniChart({ pontos, metaPatrimonio, anoIndependencia, maxAnos = 30 }: any) {
  const W = 440;
  const H = 64;
  const padX = 0;
  const padY = 8;

  const dados = pontos.filter((p: any) => p.mes <= maxAnos * 12);
  const maxSaldo = Math.max(...dados.map((d: any) => d.saldo), metaPatrimonio * 1.1);

  const toX = (i: any) => padX + (i / dados.length) * (W - padX * 2);
  const toY = (s: any) => H - padY - ((s / maxSaldo) * (H - padY * 2));

  const pathLine = dados.map((d: any, i: any) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(d.saldo).toFixed(1)}`).join(" ");
  const pathArea = `${pathLine} L${toX(dados.length - 1).toFixed(1)},${H} L${toX(0).toFixed(1)},${H} Z`;

  const metaY = toY(metaPatrimonio);
  const metaVisible = metaPatrimonio < maxSaldo;

  // Linha "só guardando" (sem rendimento)
  const aporteMensal = dados.length > 1 ? (dados[1].saldo - dados[0].saldo) : 0;
  const patrimonioInicial = dados[0]?.saldo || 0;

  return (
    <svg viewBox={`0 0 ${W} ${H + 16}`} style={{ width: "100%", display: "block" }}>
      <defs>
        <linearGradient id="arvo-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4FA080" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#4FA080" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Área preenchida */}
      <path d={pathArea} fill="url(#arvo-grad)" />

      {/* Linha principal */}
      <path d={pathLine} fill="none" stroke="#4FA080" strokeWidth="2.5" strokeLinecap="round" />

      {/* Linha da meta */}
      {metaVisible && (
        <>
          <line x1={0} y1={metaY} x2={W} y2={metaY}
            stroke="#4FA080" strokeWidth="1" strokeDasharray="6,4" opacity="0.5" />
          <text x={W - 4} y={metaY - 6}
            fontSize="9" fill="#4FA080" textAnchor="end" opacity="0.7">
            meta
          </text>
        </>
      )}

      {/* Ponto de independência */}
      {anoIndependencia && anoIndependencia <= maxAnos && (
        <>
          <circle
            cx={toX(anoIndependencia)}
            cy={toY(dados[anoIndependencia]?.saldo || 0)}
            r="5" fill="#4FA080" stroke="white" strokeWidth="2"
          />
        </>
      )}

      {/* Labels do eixo X */}
      {dados.filter((_: any, i: any) => i > 0 && i % 5 === 0).map((d: any, idx: any) => (
        <text key={idx} x={toX(d.mes / 12)} y={H + 14}
          fontSize="10" fill="#bbb" textAnchor="middle">
          {d.mes / 12}a
        </text>
      ))}
    </svg>
  );
}

// ─── Componente Principal ───
export default function ArvoSimulador() {
  const [patrimonio, setPatrimonio] = useState(50000);
  const [aporte, setAporte] = useState(2000);
  const [gasto, setGasto] = useState(5000);

  const proj = useMemo(
    () => calcProjection(patrimonio, aporte, gasto),
    [patrimonio, aporte, gasto]
  );

  const anoAlvo = proj.anoIndependencia !== null
    ? proj.anoAtual + proj.anoIndependencia
    : null;

  return (
    <div className="ui-sim-wrapper" style={{
      width: "100%",
      maxWidth: 560,
      background: "white",
      borderRadius: 24,
      padding: "16px 22px",
      boxShadow: "0 24px 80px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
      border: "1px solid rgba(0,0,0,0.04)",
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      position: "relative",
      zIndex: 10
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 500px) {
          .ui-sim-wrapper {
            padding: 14px 12px !important;
            border-radius: 20px !important;
          }
          .ui-sim-results-grid {
            grid-template-columns: 1fr !important;
            gap: 8px !important;
          }
          .ui-sim-val-lg {
            font-size: 26px !important;
          }
        }
      `}} />
      {/* Header do card */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "flex-start",
            marginBottom: 10, gap: 8
          }}>
            <div>
              <span style={{
                fontSize: 10.5, letterSpacing: 1.5, textTransform: "uppercase",
                color: "#4FA080", fontWeight: 600
              }}>
                Simulação em tempo real
              </span>
              <p style={{
                fontSize: 14.5, color: "#123044", margin: "2px 0 0 0", fontWeight: 500
              }}>
                Quando seu dinheiro pode trabalhar por você?
              </p>
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 4,
              fontSize: 10.5, color: "#1f674f", background: "#e8f1ed",
              padding: "3px 7px", borderRadius: 8, fontWeight: 600,
              whiteSpace: "nowrap", flexShrink: 0
            }}>
              6% a.a. acima da inflação
            </div>
          </div>

          {/* Sliders */}
          <SliderInput
            label="Quanto você já tem investido?"
            value={patrimonio}
            onChange={setPatrimonio}
            min={0}
            max={5000000}
            step={10000}
          />
          <SliderInput
            label="Quanto investe por mês?"
            value={aporte}
            onChange={setAporte}
            min={500}
            max={50000}
            step={500}
          />
          <SliderInput
            label="Quanto gostaria de ter por mês no futuro?"
            value={gasto}
            onChange={setGasto}
            min={2000}
            max={60000}
            step={500}
          />

          {/* Gráfico */}
          <div style={{
            background: "#FAFAF7",
            borderRadius: 14,
            padding: "8px 12px 2px 12px",
            marginBottom: 10,
          }}>
            <MiniChart
              pontos={proj.pontos}
              metaPatrimonio={proj.metaPatrimonio}
              anoIndependencia={proj.anoIndependencia}
              maxAnos={30}
            />
          </div>

          {/* Resultados */}
          <div className="ui-sim-results-grid" style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            marginBottom: 8,
          }}>
            {/* Resultado 1: Quando */}
            <div style={{
              background: "#E8F1ED", borderRadius: 12, padding: "10px 14px",
              border: "1px solid #C2DDD0"
            }}>
              <span style={{
                fontSize: 9.5, letterSpacing: 1.5, textTransform: "uppercase",
                color: "#1F674F", display: "block", marginBottom: 4, fontWeight: 600
              }}>
                Independência financeira
              </span>
              {anoAlvo ? (
                <>
                  <span className="ui-sim-val-lg" style={{ fontSize: 30, fontWeight: 300, letterSpacing: -1, display: "block", color: "#1F674F", lineHeight: 1.1 }}>
                    {anoAlvo}
                  </span>
                  <span style={{ fontSize: 11.5, color: "#4A6B5D" }}>
                    em {proj.anoIndependencia} {proj.anoIndependencia === 1 ? "ano" : "anos"}
                  </span>
                </>
              ) : (
                <>
                  <span style={{ fontSize: 18, fontWeight: 400, display: "block", color: "#1F674F" }}>
                    +40 anos
                  </span>
                  <span style={{ fontSize: 11.5, color: "#667085" }}>
                    Aumente o aporte ou reduza o gasto
                  </span>
                </>
              )}
            </div>

            {/* Resultado 2: Retirada estimada em 20 anos */}
            <div style={{
              background: "#FBFAF5", borderRadius: 12, padding: "10px 14px",
              border: "1px solid #E4DFD5"
            }}>
              <span style={{
                fontSize: 9.5, letterSpacing: 1.5, textTransform: "uppercase",
                color: "#2B6E76", display: "block", marginBottom: 4, fontWeight: 600
              }}>
                Retirada estimada em 20 anos
              </span>
              <span className="ui-sim-val-lg" style={{ fontSize: 27, fontWeight: 300, letterSpacing: -1, color: "#123044", display: "block", lineHeight: 1.1 }}>
                {fmtCurrency(Math.round(proj.rendaMensal20))}
              </span>
              <span style={{ fontSize: 11.5, color: "#667085" }}>
                por mês
              </span>
            </div>
          </div>

          {/* Meta de patrimônio */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "5px 0", borderTop: "1px solid #f0f0f0",
            fontSize: 11.5, color: "#667085", marginBottom: 8,
          }}>
            <span>Patrimônio necessário (regra dos 4% · valores de hoje)</span>
            <span style={{ fontWeight: 600, color: "#123044" }}>
              {fmtCurrency(proj.metaPatrimonio)}
            </span>
          </div>

          {/* CTA dentro do card */}
          <a
            href={`/diagnostico?initial=${patrimonio}&monthly=${aporte}&income=${gasto}`}
            onClick={() => {
              try {
                sessionStorage.setItem("arvo-simulation", JSON.stringify({ initial: patrimonio, monthly: aporte, income: gasto }));
                sessionStorage.removeItem("arvo-diagnostic-view");
              } catch {
                /* The destination retains editable defaults if storage is unavailable. */
              }
            }}
            style={{
              width: "100%",
              background: "#2B6E76", color: "#FFFFFF",
              border: "none", borderRadius: 100,
              padding: "11px 0", fontSize: 14, fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              textDecoration: "none", transition: "all 0.2s ease",
              boxShadow: "0 4px 12px rgba(43, 110, 118, 0.25)"
            }}
            className="hover:brightness-110 hover:-translate-y-0.5"
          >
            Receber meu mapa gratuito <ArrowRight size={15} />
          </a>

          <p style={{
            fontSize: 10, color: "#667085", textAlign: "center", marginTop: 7, marginBottom: 0,
            lineHeight: 1.35
          }}>
            💡 Projeção com <strong>6,0% a.a. de rendimento real</strong> acima da inflação. Valores em poder de compra de hoje. Não constitui garantia de retorno.
          </p>
        </div>
  );
}
