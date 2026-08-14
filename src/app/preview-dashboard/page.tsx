"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Wallet, TrendingUp, PieChart, Target, Compass, 
  Settings, LogOut, ShieldCheck, ChevronRight,
  ArrowUpRight, Plus, RefreshCw, BarChart2, BookOpen,
  Calculator, CheckCircle2, AlertCircle, Sparkles, Layers, Award,
  ArrowRight
} from "lucide-react";

export default function PreviewDashboardPage() {
  const [activeTab, setActiveTab] = useState<"carteira" | "bussola" | "planejamento" | "comparador" | "educacao" | "calculadoras">("carteira");
  const [selectedPortfolio, setSelectedPortfolio] = useState<"abrigo" | "ritmo" | "visao" | "oceano">("visao");

  // Bussola Interactive Risk Slider (0 to 100)
  const [bussolaRisk, setBussolaRisk] = useState<number>(66);

  // Financial Planning state
  const [initialCapital, setInitialCapital] = useState<number>(184500);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(2500);
  const [desiredIncome, setDesiredIncome] = useState<number>(12000);
  const [investmentYears, setInvestmentYears] = useState<number>(14);

  // Compound interest calculation
  const planningData = useMemo(() => {
    const realAnnualRate = 0.065; // 6.5% real return
    const monthlyRate = Math.pow(1 + realAnnualRate, 1 / 12) - 1;
    let balance = initialCapital;
    const points = [];

    for (let yr = 0; yr <= investmentYears; yr++) {
      if (yr > 0) {
        for (let m = 0; m < 12; m++) {
          balance = balance * (1 + monthlyRate) + monthlyContribution;
        }
      }
      const passiveIncomeMonthly = (balance * 0.04) / 12; // 4% safe withdrawal rule
      points.push({
        year: yr,
        total: Math.round(balance),
        passiveIncome: Math.round(passiveIncomeMonthly),
        invested: Math.round(initialCapital + monthlyContribution * 12 * yr),
      });
    }

    const targetCapital = (desiredIncome * 12) / 0.04;
    const progressPct = Math.min(100, Math.round((balance / targetCapital) * 100));

    return {
      points,
      finalCapital: Math.round(balance),
      finalPassiveIncome: Math.round((balance * 0.04) / 12),
      targetCapital,
      progressPct,
    };
  }, [initialCapital, monthlyContribution, desiredIncome, investmentYears]);

  // Portfolios Data
  const portfolios = {
    abrigo: {
      name: "Abrigo",
      badge: "Preservação & Liquidez",
      riskLabel: "Conservador",
      volatility: "1.2% a.a.",
      expectedReturn: "100% CDI",
      allocation: [
        { cat: "Pós-Fixado (Tesouro Selic / CDB 100% CDI)", pct: 90, color: "#2B6E76" },
        { cat: "Renda Fixa Inflação Curto Prazo", pct: 10, color: "#4FA080" },
      ],
      desc: "Ideal para reserva de emergência e recursos que podem ser solicitados no curto prazo."
    },
    ritmo: {
      name: "Ritmo",
      badge: "Equilíbrio & Inflação",
      riskLabel: "Moderado Baixo",
      volatility: "4.8% a.a.",
      expectedReturn: "IPCA + 5,5% a.a.",
      allocation: [
        { cat: "Pós-Fixado & Liquidez", pct: 40, color: "#2B6E76" },
        { cat: "Tesouro IPCA+ (2029 / 2035)", pct: 45, color: "#4FA080" },
        { cat: "Prefixado Estruturado Curto", pct: 15, color: "#123044" },
      ],
      desc: "Protege o poder de compra contra a inflação com baixa oscilação e fluxo constante."
    },
    visao: {
      name: "Visão",
      badge: "Crescimento Estruturado",
      riskLabel: "Moderado",
      volatility: "8.6% a.a.",
      expectedReturn: "IPCA + 6,8% a.a.",
      allocation: [
        { cat: "Reserva de Oportunidade & Pós-Fixado", pct: 25, color: "#2B6E76" },
        { cat: "Tesouro IPCA+ (Longo Prazo)", pct: 40, color: "#4FA080" },
        { cat: "Ações Brasil & FIIs Estratégicos", pct: 20, color: "#123044" },
        { cat: "Ativos Globais & Dólar (S&P 500 / MSCI World)", pct: 15, color: "#65b8a2" },
      ],
      desc: "Combina solidez na renda fixa com aceleração em renda variável nacional e global."
    },
    oceano: {
      name: "Oceano",
      badge: "Arrojada & Longo Prazo",
      riskLabel: "Arrojado",
      volatility: "14.2% a.a.",
      expectedReturn: "IPCA + 8,2% a.a.",
      allocation: [
        { cat: "Reserva de Oportunidade (Pós-Fixado)", pct: 10, color: "#2B6E76" },
        { cat: "Títulos Públicos Indexados à Inflação", pct: 30, color: "#4FA080" },
        { cat: "Ações Brasil Selecionadas", pct: 35, color: "#123044" },
        { cat: "Bolsa Global & Inovação", pct: 25, color: "#65b8a2" },
      ],
      desc: "Máxima exposição ao crescimento de longo prazo para quem tolera oscilações pontuais."
    }
  };

  const activePort = portfolios[selectedPortfolio];

  // Bussola calculated interpolated profile
  const bussolaProfile = useMemo(() => {
    if (bussolaRisk < 25) return { name: "Abrigo", label: "Preservação", color: "#2B6E76", fix: 90, inf: 10, var: 0 };
    if (bussolaRisk < 50) return { name: "Ritmo", label: "Equilíbrio", color: "#4FA080", fix: 45, inf: 45, var: 10 };
    if (bussolaRisk < 75) return { name: "Visão", label: "Crescimento", color: "#123044", fix: 25, inf: 40, var: 35 };
    return { name: "Oceano", label: "Arrojada", color: "#65b8a2", fix: 10, inf: 30, var: 60 };
  }, [bussolaRisk]);

  return (
    <div className="ui-dash-root">
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

        .ui-dash-root {
          --canvas: #f4f1ea;
          --section-alt: #ecebe2;
          --card: #fbfaf5;
          --card-alt: #e3e1d4;
          --deep-teal: #2B6E76;
          --deep-teal-hover: #1e5258;
          --accent-green: #4FA080;
          --ink-navy: #123044;
          --text-primary: #0e1511;
          --text-secondary: #2a332d;
          --text-muted: #5a635c;
          --border: rgba(14, 21, 17, 0.10);
          --border-strong: rgba(14, 21, 17, 0.20);

          background: #e8e4db;
          padding: 16px;
          min-height: 100vh;
          color: var(--text-primary);
          font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
          font-size: 14.5px;
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
        }

        .ui-dash-root * { box-sizing: border-box; }

        .ui-serif {
          font-family: 'Lora', Georgia, serif;
          font-weight: 400;
          letter-spacing: -0.015em;
        }

        .ui-mono {
          font-family: 'IBM Plex Mono', monospace;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .ui-frame {
          max-width: 1440px;
          margin: 0 auto;
          background: var(--canvas);
          border: 1px solid rgba(14, 21, 17, 0.16);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 28px rgba(14, 21, 17, 0.04);
          display: grid;
          grid-template-columns: 248px 1fr;
          min-height: 92vh;
        }

        @media (max-width: 960px) {
          .ui-dash-root { padding: 0; }
          .ui-frame { border-radius: 0; border: none; grid-template-columns: 1fr; }
        }

        /* Sidebar */
        .ui-sidebar {
          background: #efece4;
          border-right: 1px solid var(--border);
          padding: 24px 18px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .ui-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 100px;
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 500;
          font-size: 13.5px;
          transition: all 0.2s;
          cursor: pointer;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
        }

        .ui-nav-item:hover {
          background: rgba(43, 110, 118, 0.08);
          color: var(--deep-teal);
        }

        .ui-nav-item.active {
          background: var(--deep-teal);
          color: #ffffff;
          font-weight: 600;
        }

        /* Pill Buttons */
        .ui-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 48px;
          font-weight: 500;
          font-size: 13.5px;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .ui-btn-primary {
          background: var(--deep-teal);
          color: #ffffff;
        }

        .ui-btn-primary:hover {
          background: var(--deep-teal-hover);
        }

        .ui-btn-outline {
          background: transparent;
          border: 1px solid var(--border-strong);
          color: var(--text-primary);
        }

        .ui-btn-outline:hover {
          border-color: var(--deep-teal);
          color: var(--deep-teal);
          background: var(--card);
        }

        /* Cards */
        .ui-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px;
        }

        /* Tabs */
        .ui-port-tab {
          padding: 8px 18px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid var(--border);
          background: var(--card);
          color: var(--text-secondary);
          transition: all 0.2s;
        }

        .ui-port-tab.active {
          background: var(--deep-teal);
          color: #ffffff;
          border-color: var(--deep-teal);
          font-weight: 600;
        }

        /* Range Sliders */
        input[type="range"] {
          accent-color: var(--deep-teal);
          width: 100%;
          cursor: pointer;
        }
      `}} />

      <div className="ui-frame">
        {/* SIDEBAR NAVIGATION */}
        <aside className="ui-sidebar">
          <div>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0 8px 24px 8px", borderBottom: "1px solid var(--border)" }}>
              <img src="/arvo-simbolo-blue.png" alt="ARVO" style={{ width: "24px", height: "24px", objectFit: "contain" }} />
              <div>
                <span className="ui-serif" style={{ fontSize: "20px", fontWeight: 600, color: "var(--ink-navy)", letterSpacing: "0.02em" }}>ARVO</span>
                <span className="ui-mono" style={{ display: "block", fontSize: "9px", color: "var(--deep-teal)", letterSpacing: "0.1em" }}>COCKPIT</span>
              </div>
            </div>

            {/* Nav Group 1: Gestao */}
            <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <div className="ui-mono" style={{ fontSize: "10px", color: "var(--text-muted)", padding: "0 12px 6px 12px" }}>
                Gestão Patrimonial
              </div>
              <button 
                onClick={() => setActiveTab("carteira")} 
                className={`ui-nav-item ${activeTab === "carteira" ? "active" : ""}`}
              >
                <Wallet size={16} />
                <span>Minha Carteira</span>
              </button>
              <button 
                onClick={() => setActiveTab("bussola")} 
                className={`ui-nav-item ${activeTab === "bussola" ? "active" : ""}`}
              >
                <Compass size={16} />
                <span>Bússola de Risco</span>
              </button>
              <button 
                onClick={() => setActiveTab("planejamento")} 
                className={`ui-nav-item ${activeTab === "planejamento" ? "active" : ""}`}
              >
                <Target size={16} />
                <span>Planejamento</span>
              </button>
            </div>

            {/* Nav Group 2: Ferramentas & Educacao */}
            <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <div className="ui-mono" style={{ fontSize: "10px", color: "var(--text-muted)", padding: "0 12px 6px 12px" }}>
                Inteligência & Mercado
              </div>
              <button 
                onClick={() => setActiveTab("comparador")} 
                className={`ui-nav-item ${activeTab === "comparador" ? "active" : ""}`}
              >
                <BarChart2 size={16} />
                <span>Comparador de Ativos</span>
              </button>
              <button 
                onClick={() => setActiveTab("educacao")} 
                className={`ui-nav-item ${activeTab === "educacao" ? "active" : ""}`}
              >
                <BookOpen size={16} />
                <span>Biblioteca & Teses</span>
              </button>
              <button 
                onClick={() => setActiveTab("calculadoras")} 
                className={`ui-nav-item ${activeTab === "calculadoras" ? "active" : ""}`}
              >
                <Calculator size={16} />
                <span>Calculadoras</span>
              </button>
            </div>
          </div>

          {/* User profile footer */}
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--deep-teal)", color: "#ffffff", display: "grid", placeItems: "center", fontWeight: 600, fontSize: "12px" }}>
                LM
              </div>
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--ink-navy)", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>Lucas Matos</div>
                <div className="ui-mono" style={{ fontSize: "9.5px", color: "var(--deep-teal)" }}>Plano Completo · CFP®</div>
              </div>
            </div>

            <div style={{ marginTop: "12px", display: "flex", justifyContent: "space-between", padding: "0 4px" }}>
              <Link href="/preview-user-interviews" className="ui-mono" style={{ fontSize: "10.5px", color: "var(--deep-teal)", textDecoration: "none" }}>
                ← Ver Home
              </Link>
              <Link href="/" className="ui-mono" style={{ fontSize: "10.5px", color: "var(--text-muted)", textDecoration: "none" }}>
                Sair
              </Link>
            </div>
          </div>
        </aside>

        {/* MAIN BODY AREA */}
        <main style={{ padding: "36px 40px", overflowY: "auto", maxHeight: "92vh" }}>

          {/* =========================================================================
              1. TAB: MINHA CARTEIRA
              ========================================================================= */}
          {activeTab === "carteira" && (
            <div>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "32px" }}>
                <div>
                  <div className="ui-mono" style={{ fontSize: "11px", color: "var(--deep-teal)", fontWeight: 600, marginBottom: "6px" }}>
                    ● POSICIONAMENTO ESTRATÉGICO · AGOSTO 2026
                  </div>
                  <h1 className="ui-serif" style={{ fontSize: "clamp(26px, 3vw, 36px)", color: "var(--ink-navy)", margin: 0 }}>
                    Minha Carteira & Estratégia
                  </h1>
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span className="ui-mono" style={{ background: "var(--section-alt)", border: "1px solid var(--border)", padding: "8px 14px", borderRadius: "100px", fontSize: "11.5px", color: "var(--text-secondary)" }}>
                    Custódia: XP & BTG
                  </span>
                  <button className="ui-btn ui-btn-primary" style={{ padding: "9px 18px", fontSize: "13px" }}>
                    <Plus size={15} /> Novo Aporte
                  </button>
                </div>
              </div>

              {/* 4 Stat Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "28px" }}>
                <div className="ui-card">
                  <div className="ui-mono" style={{ fontSize: "10.5px", color: "var(--text-muted)", marginBottom: "6px" }}>Patrimônio Total</div>
                  <div className="ui-serif" style={{ fontSize: "28px", color: "var(--ink-navy)", fontWeight: 500 }}>R$ 184.500</div>
                  <div style={{ fontSize: "12px", color: "var(--deep-teal)", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <TrendingUp size={13} /> +12,4% no ano (128% CDI)
                  </div>
                </div>

                <div className="ui-card">
                  <div className="ui-mono" style={{ fontSize: "10.5px", color: "var(--text-muted)", marginBottom: "6px" }}>Aporte Mensal Alvo</div>
                  <div className="ui-serif" style={{ fontSize: "28px", color: "var(--ink-navy)", fontWeight: 500 }}>R$ 2.500<span style={{ fontSize: "14px", color: "var(--text-muted)" }}>/mês</span></div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
                    Próximo aporte: 25/Ago
                  </div>
                </div>

                <div className="ui-card">
                  <div className="ui-mono" style={{ fontSize: "10.5px", color: "var(--text-muted)", marginBottom: "6px" }}>Reserva de Emergência</div>
                  <div className="ui-serif" style={{ fontSize: "28px", color: "var(--ink-navy)", fontWeight: 500 }}>R$ 45.000</div>
                  <div style={{ fontSize: "12px", color: "var(--deep-teal)", marginTop: "4px" }}>
                    ✓ 6 meses de custo cobertos
                  </div>
                </div>

                <div className="ui-card">
                  <div className="ui-mono" style={{ fontSize: "10.5px", color: "var(--text-muted)", marginBottom: "6px" }}>Meta Liberdade</div>
                  <div className="ui-serif" style={{ fontSize: "28px", color: "var(--ink-navy)", fontWeight: 500 }}>R$ 1.800.000</div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
                    Horizonte estimado: 14 anos
                  </div>
                </div>
              </div>

              {/* Main Two-Column Block */}
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px", marginBottom: "28px" }}>
                
                {/* Allocation Box */}
                <div className="ui-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
                    <div>
                      <div className="ui-mono" style={{ fontSize: "10.5px", color: "var(--deep-teal)", fontWeight: 600 }}>Estratégia Recomendada</div>
                      <h3 className="ui-serif" style={{ fontSize: "22px", color: "var(--ink-navy)", margin: "2px 0 0 0" }}>
                        Carteira {activePort.name} — <i style={{ color: "var(--deep-teal)", fontStyle: "italic" }}>{activePort.badge}</i>
                      </h3>
                    </div>

                    <div style={{ display: "flex", gap: "6px" }}>
                      {(["abrigo", "ritmo", "visao", "oceano"] as const).map((key) => (
                        <button
                          key={key}
                          onClick={() => setSelectedPortfolio(key)}
                          className={`ui-port-tab ${selectedPortfolio === key ? "active" : ""}`}
                        >
                          {portfolios[key].name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Visual Bar */}
                  <div style={{ marginBottom: "24px" }}>
                    <div style={{ display: "flex", height: "12px", borderRadius: "100px", overflow: "hidden", gap: "2px", background: "var(--border)" }}>
                      {activePort.allocation.map((item, i) => (
                        <div 
                          key={i} 
                          style={{ width: `${item.pct}%`, background: item.color, transition: "width 0.4s ease" }}
                          title={`${item.cat}: ${item.pct}%`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Asset list */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {activePort.allocation.map((item, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "var(--section-alt)", border: "1px solid var(--border)", borderRadius: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: item.color }} />
                          <span style={{ fontSize: "13.5px", fontWeight: 500, color: "var(--text-primary)" }}>{item.cat}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                          <span className="ui-mono" style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink-navy)" }}>{item.pct}%</span>
                          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                            R$ {((184500 * item.pct) / 100).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12.5px" }}>
                    <span style={{ color: "var(--text-secondary)" }}>
                      Expectativa de retorno calculada: <strong style={{ color: "var(--deep-teal)" }}>{activePort.expectedReturn}</strong>
                    </span>
                    <button className="ui-btn ui-btn-outline" style={{ padding: "6px 14px", fontSize: "12px" }}>
                      Ver Relatório Completo →
                    </button>
                  </div>
                </div>

                {/* Advice & Independence */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div className="ui-card" style={{ background: "var(--section-alt)" }}>
                    <div className="ui-mono" style={{ fontSize: "10.5px", color: "var(--deep-teal)", fontWeight: 600, marginBottom: "8px" }}>
                      Orientação do Mês
                    </div>
                    <h4 className="ui-serif" style={{ fontSize: "18px", color: "var(--ink-navy)", margin: "0 0 10px 0" }}>
                      Onde alocar seu próximo aporte?
                    </h4>
                    <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", lineHeight: "1.55", margin: "0 0 16px 0" }}>
                      Sua fatia de <strong>Inflação (Tesouro IPCA+)</strong> está 4% abaixo da meta ideal da carteira <em>{activePort.name}</em>. Recomendamos direcionar o próximo aporte de R$ 2.500 para recompor essa classe.
                    </p>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button className="ui-btn ui-btn-primary" style={{ padding: "8px 16px", fontSize: "12.5px" }}>
                        Aplicar no Tesouro Direto
                      </button>
                      <button className="ui-btn ui-btn-outline" style={{ padding: "8px 14px", fontSize: "12.5px" }}>
                        Ver Detalhes
                      </button>
                    </div>
                  </div>

                  <div className="ui-card" style={{ background: "var(--ink-navy)", color: "#ffffff" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                      <ShieldCheck size={18} color="#4FA080" />
                      <span className="ui-mono" style={{ fontSize: "11px", color: "#4FA080", fontWeight: 600 }}>Alinhamento Fee-Only</span>
                    </div>
                    <div className="ui-serif" style={{ fontSize: "16px", lineHeight: "1.4", margin: "0 0 12px 0" }}>
                      Esta carteira foi calculada com <strong>zero comissão de corretora</strong>, priorizando exclusivamente o menor custo e maior eficiência para você.
                    </div>
                    <div style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.6)" }}>
                      CFP® Lucas Matos · Metodologia ARVO
                    </div>
                  </div>
                </div>

              </div>

              {/* Benchmarks Section */}
              <div className="ui-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <div className="ui-mono" style={{ fontSize: "10.5px", color: "var(--deep-teal)", fontWeight: 600 }}>Acompanhamento Histórico</div>
                    <h3 className="ui-serif" style={{ fontSize: "20px", color: "var(--ink-navy)", margin: 0 }}>
                      Evolução Comparativa vs. Benchmarks
                    </h3>
                  </div>
                  <div className="ui-mono" style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    Jan 2024 — Ago 2026
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "16px" }}>
                  <div style={{ padding: "12px 14px", background: "var(--section-alt)", borderRadius: "10px", border: "1px solid var(--border)" }}>
                    <div className="ui-mono" style={{ fontSize: "10px", color: "var(--text-muted)" }}>Carteira ARVO</div>
                    <div style={{ fontSize: "18px", fontWeight: 600, color: "var(--deep-teal)" }}>+34,8%</div>
                  </div>
                  <div style={{ padding: "12px 14px", background: "var(--section-alt)", borderRadius: "10px", border: "1px solid var(--border)" }}>
                    <div className="ui-mono" style={{ fontSize: "10px", color: "var(--text-muted)" }}>CDI</div>
                    <div style={{ fontSize: "18px", fontWeight: 600, color: "var(--ink-navy)" }}>+27,2%</div>
                  </div>
                  <div style={{ padding: "12px 14px", background: "var(--section-alt)", borderRadius: "10px", border: "1px solid var(--border)" }}>
                    <div className="ui-mono" style={{ fontSize: "10px", color: "var(--text-muted)" }}>IPCA (Inflação)</div>
                    <div style={{ fontSize: "18px", fontWeight: 600, color: "var(--ink-navy)" }}>+11,4%</div>
                  </div>
                  <div style={{ padding: "12px 14px", background: "var(--section-alt)", borderRadius: "10px", border: "1px solid var(--border)" }}>
                    <div className="ui-mono" style={{ fontSize: "10px", color: "var(--text-muted)" }}>Ibovespa</div>
                    <div style={{ fontSize: "18px", fontWeight: 600, color: "var(--ink-navy)" }}>+16,8%</div>
                  </div>
                </div>
                
                <div style={{ fontSize: "11.5px", color: "var(--text-muted)", fontStyle: "italic", textAlign: "right" }}>
                  *Rentabilidade passada não representa garantia de rentabilidade futura.
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              2. TAB: BÚSSOLA DE RISCO
              ========================================================================= */}
          {activeTab === "bussola" && (
            <div>
              <div style={{ marginBottom: "32px" }}>
                <div className="ui-mono" style={{ fontSize: "11px", color: "var(--deep-teal)", fontWeight: 600, marginBottom: "6px" }}>
                  ● FERRAMENTA DINÂMICA DE ALOCAÇÃO
                </div>
                <h1 className="ui-serif" style={{ fontSize: "clamp(26px, 3vw, 36px)", color: "var(--ink-navy)", margin: 0 }}>
                  Bússola de Risco & Alocação Contínua
                </h1>
                <p style={{ fontSize: "15px", color: "var(--text-secondary)", marginTop: "6px", maxWidth: "68ch" }}>
                  Ajuste o cursor de risco para encontrar o ponto exato de equilíbrio entre preservação de capital e aceleração patrimonial.
                </p>
              </div>

              {/* Interactive Risk Slider Card */}
              <div className="ui-card" style={{ marginBottom: "28px", padding: "32px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "16px" }}>
                  <div>
                    <span className="ui-mono" style={{ fontSize: "11px", color: "var(--deep-teal)", fontWeight: 600 }}>Nível de Risco Selecionado: {bussolaRisk}/100</span>
                    <h2 className="ui-serif" style={{ fontSize: "28px", color: "var(--ink-navy)", margin: "4px 0 0 0" }}>
                      Posicionamento: <i style={{ color: "var(--deep-teal)" }}>{bussolaProfile.name} ({bussolaProfile.label})</i>
                    </h2>
                  </div>
                  <div style={{ background: "var(--section-alt)", border: "1px solid var(--border)", borderRadius: "100px", padding: "8px 18px", fontSize: "13px", fontWeight: 600, color: "var(--ink-navy)" }}>
                    Volatilidade Estimada: {(bussolaRisk * 0.13 + 1.2).toFixed(1)}% a.a.
                  </div>
                </div>

                {/* Slider bar */}
                <div style={{ margin: "24px 0" }}>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={bussolaRisk}
                    onChange={(e) => setBussolaRisk(Number(e.target.value))}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "11.5px", color: "var(--text-muted)" }}>
                    <span>0 — Abrigo (Conservador)</span>
                    <span>33 — Ritmo</span>
                    <span>66 — Visão (Moderado)</span>
                    <span>100 — Oceano (Arrojado)</span>
                  </div>
                </div>

                {/* Live Interpolated Composition */}
                <div style={{ marginTop: "28px", padding: "20px", background: "var(--section-alt)", borderRadius: "14px", border: "1px solid var(--border)" }}>
                  <div className="ui-mono" style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 600, marginBottom: "12px" }}>
                    Composição Teórica de Classes
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                    <div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Renda Fixa & Caixa</div>
                      <div style={{ fontSize: "22px", fontWeight: 600, color: "var(--deep-teal)" }}>{bussolaProfile.fix}%</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Inflação (IPCA+)</div>
                      <div style={{ fontSize: "22px", fontWeight: 600, color: "var(--accent-green)" }}>{bussolaProfile.inf}%</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Renda Variável (BR + Global)</div>
                      <div style={{ fontSize: "22px", fontWeight: 600, color: "var(--ink-navy)" }}>{bussolaProfile.var}%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Educational Cards about the 4 anchor portfolios */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
                {(["abrigo", "ritmo", "visao", "oceano"] as const).map((key) => {
                  const p = portfolios[key];
                  return (
                    <div key={key} className="ui-card">
                      <span className="ui-mono" style={{ fontSize: "10.5px", color: "var(--deep-teal)", fontWeight: 600 }}>{p.riskLabel}</span>
                      <h4 className="ui-serif" style={{ fontSize: "22px", color: "var(--ink-navy)", margin: "4px 0 8px 0" }}>{p.name}</h4>
                      <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.5" }}>{p.desc}</p>
                      <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid var(--border)", fontSize: "12px", color: "var(--text-muted)" }}>
                        Retorno: <strong>{p.expectedReturn}</strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =========================================================================
              3. TAB: PLANEJAMENTO FINANCEIRO
              ========================================================================= */}
          {activeTab === "planejamento" && (
            <div>
              <div style={{ marginBottom: "32px" }}>
                <div className="ui-mono" style={{ fontSize: "11px", color: "var(--deep-teal)", fontWeight: 600, marginBottom: "6px" }}>
                  ● MAPA DE INDEPENDÊNCIA FINANCEIRA
                </div>
                <h1 className="ui-serif" style={{ fontSize: "clamp(26px, 3vw, 36px)", color: "var(--ink-navy)", margin: 0 }}>
                  Planejamento de Longo Prazo
                </h1>
                <p style={{ fontSize: "15px", color: "var(--text-secondary)", marginTop: "6px", maxWidth: "68ch" }}>
                  Simule como seus aportes e rentabilidade real constroem o patrimônio necessário para gerar sua renda passiva ideal.
                </p>
              </div>

              {/* 3 Simulators Inputs */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "28px" }}>
                <div className="ui-card">
                  <div className="ui-mono" style={{ fontSize: "10.5px", color: "var(--text-muted)", marginBottom: "6px" }}>Patrimônio Atual (R$)</div>
                  <input 
                    type="number"
                    value={initialCapital}
                    onChange={(e) => setInitialCapital(Number(e.target.value))}
                    style={{ width: "100%", padding: "10px 12px", background: "var(--section-alt)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "16px", fontWeight: 600, color: "var(--ink-navy)" }}
                  />
                </div>

                <div className="ui-card">
                  <div className="ui-mono" style={{ fontSize: "10.5px", color: "var(--text-muted)", marginBottom: "6px" }}>Aporte Mensal (R$)</div>
                  <input 
                    type="number"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                    style={{ width: "100%", padding: "10px 12px", background: "var(--section-alt)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "16px", fontWeight: 600, color: "var(--ink-navy)" }}
                  />
                </div>

                <div className="ui-card">
                  <div className="ui-mono" style={{ fontSize: "10.5px", color: "var(--text-muted)", marginBottom: "6px" }}>Renda Passiva Desejada (R$/mês)</div>
                  <input 
                    type="number"
                    value={desiredIncome}
                    onChange={(e) => setDesiredIncome(Number(e.target.value))}
                    style={{ width: "100%", padding: "10px 12px", background: "var(--section-alt)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "16px", fontWeight: 600, color: "var(--ink-navy)" }}
                  />
                </div>

                <div className="ui-card">
                  <div className="ui-mono" style={{ fontSize: "10.5px", color: "var(--text-muted)", marginBottom: "6px" }}>Horizonte (Anos)</div>
                  <input 
                    type="number"
                    value={investmentYears}
                    onChange={(e) => setInvestmentYears(Number(e.target.value))}
                    style={{ width: "100%", padding: "10px 12px", background: "var(--section-alt)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "16px", fontWeight: 600, color: "var(--ink-navy)" }}
                  />
                </div>
              </div>

              {/* Projection Result Card */}
              <div className="ui-card" style={{ marginBottom: "28px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", alignItems: "center" }}>
                  <div>
                    <span className="ui-mono" style={{ fontSize: "11px", color: "var(--deep-teal)", fontWeight: 600 }}>Projeção aos {investmentYears} anos</span>
                    <div className="ui-serif" style={{ fontSize: "36px", color: "var(--ink-navy)", margin: "4px 0" }}>
                      R$ {planningData.finalCapital.toLocaleString("pt-BR")}
                    </div>
                    <p style={{ fontSize: "14.5px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                      Gerando aproximadamente <strong>R$ {planningData.finalPassiveIncome.toLocaleString("pt-BR")}/mês</strong> de renda passiva perpétua (considerando regra dos 4% a.a. acima da inflação).
                    </p>
                  </div>

                  <div style={{ background: "var(--section-alt)", padding: "24px", borderRadius: "16px", border: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px" }}>
                      <span style={{ fontWeight: 600 }}>Progresso até a Meta</span>
                      <span className="ui-mono" style={{ color: "var(--deep-teal)", fontWeight: 600 }}>{planningData.progressPct}%</span>
                    </div>
                    <div style={{ height: "8px", background: "var(--border)", borderRadius: "100px", overflow: "hidden", marginBottom: "12px" }}>
                      <div style={{ width: `${planningData.progressPct}%`, height: "100%", background: "var(--deep-teal)" }} />
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      Patrimônio necessário para R$ {desiredIncome.toLocaleString("pt-BR")}/mês: <strong>R$ {planningData.targetCapital.toLocaleString("pt-BR")}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Milestones Table */}
              <div className="ui-card">
                <div className="ui-mono" style={{ fontSize: "10.5px", color: "var(--deep-teal)", fontWeight: 600, marginBottom: "12px" }}>
                  Marcos da Evolução Patrimonial
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {planningData.points.filter((_, idx) => idx % 2 === 0 || idx === investmentYears).map((pt, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: i % 2 === 0 ? "var(--section-alt)" : "transparent", borderRadius: "8px" }}>
                      <span className="ui-mono" style={{ fontSize: "12px", fontWeight: 600 }}>Ano {pt.year}</span>
                      <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink-navy)" }}>R$ {pt.total.toLocaleString("pt-BR")}</span>
                      <span style={{ fontSize: "13px", color: "var(--deep-teal)" }}>R$ {pt.passiveIncome.toLocaleString("pt-BR")}/mês renda</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              4. TAB: COMPARADOR DE ATIVOS
              ========================================================================= */}
          {activeTab === "comparador" && (
            <div>
              <div style={{ marginBottom: "32px" }}>
                <div className="ui-mono" style={{ fontSize: "11px", color: "var(--deep-teal)", fontWeight: 600, marginBottom: "6px" }}>
                  ● INTELIGÊNCIA QUANTITATIVA
                </div>
                <h1 className="ui-serif" style={{ fontSize: "clamp(26px, 3vw, 36px)", color: "var(--ink-navy)", margin: 0 }}>
                  Comparador de Rentabilidade & Volatilidade
                </h1>
                <p style={{ fontSize: "15px", color: "var(--text-secondary)", marginTop: "6px", maxWidth: "68ch" }}>
                  Compare o comportamento histórico das carteiras ARVO frente aos principais benchmarks do mercado financeiro.
                </p>
              </div>

              <div className="ui-card" style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
                  <h3 className="ui-serif" style={{ fontSize: "20px", color: "var(--ink-navy)", margin: 0 }}>
                    Tabela Comparativa Consolidada (2024–2026)
                  </h3>
                  <span className="ui-mono" style={{ fontSize: "11px", color: "var(--deep-teal)", background: "var(--section-alt)", padding: "6px 12px", borderRadius: "100px" }}>
                    Retornos Anualizados
                  </span>
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                        <th style={{ padding: "12px 16px", color: "var(--text-muted)", fontWeight: 600 }}>Ativo / Índice</th>
                        <th style={{ padding: "12px 16px", color: "var(--text-muted)", fontWeight: 600 }}>Classe</th>
                        <th style={{ padding: "12px 16px", color: "var(--text-muted)", fontWeight: 600 }}>2024</th>
                        <th style={{ padding: "12px 16px", color: "var(--text-muted)", fontWeight: 600 }}>2025</th>
                        <th style={{ padding: "12px 16px", color: "var(--text-muted)", fontWeight: 600 }}>Acumulado</th>
                        <th style={{ padding: "12px 16px", color: "var(--text-muted)", fontWeight: 600 }}>Volatilidade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: "Carteira ARVO Visão", cat: "Multi-estratégia", y24: "+14,2%", y25: "+15,8%", total: "+34,8%", vol: "8,6%", highlight: true },
                        { name: "CDI", cat: "Renda Fixa Pós", y24: "+11,2%", y25: "+12,1%", total: "+27,2%", vol: "0,3%" },
                        { name: "IPCA (Inflação)", cat: "Índice de Preços", y24: "+4,8%", y25: "+4,6%", total: "+11,4%", vol: "—" },
                        { name: "IMA-B (Tesouro IPCA)", cat: "Títulos Públicos", y24: "+8,4%", y25: "+11,2%", total: "+22,1%", vol: "6,2%" },
                        { name: "Ibovespa", cat: "Ações Brasil", y24: "+7,8%", y25: "+9,2%", total: "+16,8%", vol: "18,4%" },
                        { name: "S&P 500 (em BRL)", cat: "Ações Globais", y24: "+28,2%", y25: "+18,4%", total: "+52,1%", vol: "17,2%" },
                      ].map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid var(--border)", background: row.highlight ? "var(--section-alt)" : "transparent" }}>
                          <td style={{ padding: "12px 16px", fontWeight: row.highlight ? 600 : 500, color: row.highlight ? "var(--deep-teal)" : "var(--ink-navy)" }}>
                            {row.name}
                          </td>
                          <td style={{ padding: "12px 16px", color: "var(--text-secondary)" }}>{row.cat}</td>
                          <td style={{ padding: "12px 16px" }}>{row.y24}</td>
                          <td style={{ padding: "12px 16px" }}>{row.y25}</td>
                          <td style={{ padding: "12px 16px", fontWeight: 600, color: row.highlight ? "var(--deep-teal)" : "inherit" }}>{row.total}</td>
                          <td style={{ padding: "12px 16px", color: "var(--text-muted)" }}>{row.vol}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              5. TAB: BIBLIOTECA & TESES (EDUCAÇÃO)
              ========================================================================= */}
          {activeTab === "educacao" && (
            <div>
              <div style={{ marginBottom: "32px" }}>
                <div className="ui-mono" style={{ fontSize: "11px", color: "var(--deep-teal)", fontWeight: 600, marginBottom: "6px" }}>
                  ● FORMAÇÃO & TESES DE INVESTIMENTO
                </div>
                <h1 className="ui-serif" style={{ fontSize: "clamp(26px, 3vw, 36px)", color: "var(--ink-navy)", margin: 0 }}>
                  Biblioteca ARVO & Cartas do Fundador
                </h1>
                <p style={{ fontSize: "15px", color: "var(--text-secondary)", marginTop: "6px", maxWidth: "68ch" }}>
                  Aprenda a filosofia e os conceitos fundamentais para gerir seu patrimônio com tranquilidade e independência.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
                {[
                  {
                    tag: "Filosofia ARVO",
                    title: "Por que começar pelo plano antes de escolher o ativo?",
                    author: "Lucas Matos, CFP®",
                    readTime: "6 min de leitura",
                    date: "Agosto 2026"
                  },
                  {
                    tag: "Renda Fixa Estratégica",
                    title: "Como se proteger da inflação real no longo prazo sem risco de crédito?",
                    author: "Equipe ARVO",
                    readTime: "8 min de leitura",
                    date: "Julho 2026"
                  },
                  {
                    tag: "Diversificação Global",
                    title: "O papel dos ativos internacionais na redução de risco da sua carteira",
                    author: "Lucas Matos, CFP®",
                    readTime: "5 min de leitura",
                    date: "Junho 2026"
                  },
                  {
                    tag: "Comportamento & Emoção",
                    title: "Os 4 erros cognitivos mais comuns em momentos de queda de mercado",
                    author: "Equipe ARVO",
                    readTime: "7 min de leitura",
                    date: "Maio 2026"
                  }
                ].map((art, idx) => (
                  <div key={idx} className="ui-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <span className="ui-mono" style={{ fontSize: "10.5px", color: "var(--deep-teal)", fontWeight: 600 }}>{art.tag}</span>
                      <h3 className="ui-serif" style={{ fontSize: "18px", color: "var(--ink-navy)", margin: "8px 0 12px 0", lineHeight: "1.3" }}>
                        {art.title}
                      </h3>
                    </div>
                    <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "var(--text-muted)" }}>
                      <span>{art.author}</span>
                      <span>{art.readTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              6. TAB: CALCULADORAS
              ========================================================================= */}
          {activeTab === "calculadoras" && (
            <div>
              <div style={{ marginBottom: "32px" }}>
                <div className="ui-mono" style={{ fontSize: "11px", color: "var(--deep-teal)", fontWeight: 600, marginBottom: "6px" }}>
                  ● FERRAMENTAS DE CÁLCULO
                </div>
                <h1 className="ui-serif" style={{ fontSize: "clamp(26px, 3vw, 36px)", color: "var(--ink-navy)", margin: 0 }}>
                  Calculadoras Financeiras ARVO
                </h1>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
                {[
                  { title: "Simulador de Juros Compostos", desc: "Veja o efeito exponencial do tempo e aportes contínuos sobre o patrimônio." },
                  { title: "Calculadora de Inflação (IPCA)", desc: "Calcule a perda do poder de compra e ajuste valores futuros pelo IPCA histórico." },
                  { title: "Renda Passiva & Regra dos 4%", desc: "Descubra quanto você pode retirar mensalmente sem consumir o patrimônio principal." },
                ].map((c, idx) => (
                  <div key={idx} className="ui-card">
                    <h3 className="ui-serif" style={{ fontSize: "19px", color: "var(--ink-navy)", margin: "0 0 8px 0" }}>{c.title}</h3>
                    <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", lineHeight: "1.55", margin: "0 0 16px 0" }}>{c.desc}</p>
                    <button className="ui-btn ui-btn-outline" style={{ padding: "8px 16px", fontSize: "12.5px" }}>
                      Abrir Calculadora →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
