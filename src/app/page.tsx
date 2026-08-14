"use client";

import { useEffect } from "react";
import LandingSimulator from "@/components/landing-simulator";
import { PerformanceChart } from "@/components/performance-chart";
import Link from "next/link";

export default function LandingPage() {
  useEffect(() => {
    const handleFaqClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const btn = target.closest(".ui-faq-btn");
      if (!btn) return;

      const item = btn.closest(".ui-faq-item");
      if (!item) return;

      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".ui-faq-item").forEach((i) => i.classList.remove("open"));
      if (!isOpen) {
        item.classList.add("open");
      }
    };

    document.addEventListener("click", handleFaqClick);
    return () => document.removeEventListener("click", handleFaqClick);
  }, []);

  return (
    <div className="ui-theme-root">
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

        .ui-theme-root {
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
          
          /* Fallbacks for components */
          --ink: #0e1511;
          --ink-2: #2a332d;
          --ink-3: #5a635c;
          --ink-4: #8a918a;
          --rule: rgba(14, 21, 17, 0.10);
          --rule-strong: rgba(14, 21, 17, 0.20);
          --accent: #2B6E76;
          
          background: #e8e4db;
          padding: 24px 36px;
          color: var(--text-primary);
          font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
          font-size: 16px;
          line-height: 1.5;
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }

        .ui-page-frame {
          background: var(--canvas);
          border: 1px solid rgba(14, 21, 17, 0.18);
          border-radius: 24px;
          overflow: hidden;
          max-width: 1360px;
          margin: 0 auto;
          box-shadow: 0 6px 32px rgba(14, 21, 17, 0.05);
        }

        @media (min-width: 1440px) {
          .ui-theme-root { padding: 32px 48px; }
        }

        @media (max-width: 860px) {
          .ui-theme-root { padding: 0; }
          .ui-page-frame { border-radius: 0; border: none; }
        }

        .ui-theme-root * { box-sizing: border-box; }
        
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

        .ui-wrap {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 32px;
        }
        @media (max-width: 768px) {
          .ui-wrap { padding: 0 20px; }
        }

        /* Buttons */
        .ui-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 13px 26px;
          border-radius: 48px;
          font-weight: 500;
          font-size: 14.5px;
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
          transform: translateY(-1px);
        }
        .ui-btn-navy {
          background: var(--ink-navy);
          color: #ffffff;
        }
        .ui-btn-navy:hover {
          background: #0a1f2d;
          transform: translateY(-1px);
        }
        .ui-btn-outline {
          background: transparent;
          border: 1px solid var(--deep-teal);
          color: var(--deep-teal);
        }
        .ui-btn-outline:hover {
          background: rgba(43, 110, 118, 0.08);
        }
        .ui-btn-ghost {
          background: transparent;
          color: var(--text-primary);
        }
        .ui-btn-ghost:hover {
          color: var(--deep-teal);
        }

        /* Nav */
        .ui-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(244, 241, 234, 0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
        }
        .ui-nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
        }
        .ui-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Lora', Georgia, serif;
          font-weight: 600;
          font-size: 20px;
          color: var(--ink-navy);
          text-decoration: none;
          letter-spacing: 0.04em;
        }
        .ui-nav-links {
          display: flex;
          gap: 32px;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-secondary);
        }
        .ui-nav-links a {
          text-decoration: none;
          color: inherit;
          transition: color 0.2s;
        }
        .ui-nav-links a:hover {
          color: var(--deep-teal);
        }
        @media (max-width: 860px) {
          .ui-nav-links { display: none; }
        }

        /* Eyebrow badge */
        .ui-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11.5px;
          font-weight: 600;
          color: var(--deep-teal);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          background: var(--section-alt);
          border: 1px solid var(--border);
          padding: 6px 14px;
          border-radius: 100px;
          margin-bottom: 20px;
        }
        .ui-eyebrow-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-green);
        }

        /* Sections */
        .ui-section {
          padding: 72px 0;
          border-bottom: 1px solid var(--border);
          position: relative;
        }
        .ui-section-alt {
          background: var(--section-alt);
        }

        /* Stat Banner Strip */
        .ui-stat-strip {
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          background: var(--card);
          padding: 20px 0;
        }
        .ui-stat-strip-inner {
          display: flex;
          justify-content: space-around;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .ui-stat-strip-inner strong {
          color: var(--ink-navy);
          font-weight: 600;
        }
        .ui-stat-divider {
          color: var(--border);
        }

        /* Performance Chart Styling */
        .perf-block {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 4px 20px rgba(14, 21, 17, 0.03);
        }
        .chart {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
        }
        .chart-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }
        .chart-head .title {
          font-family: 'Lora', Georgia, serif;
          font-size: 20px;
          font-weight: 500;
          color: var(--ink-navy);
        }
        .chart-head .range {
          display: inline-flex;
          background: var(--section-alt);
          border: 1px solid var(--border);
          border-radius: 100px;
          padding: 4px;
          gap: 3px;
        }
        .chart-head .range button {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11.5px;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 100px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .chart-head .range button.on {
          background: var(--deep-teal);
          color: #ffffff;
          box-shadow: 0 2px 6px rgba(43, 110, 118, 0.2);
        }
        .chart-head .range button:hover:not(.on) {
          color: var(--text-primary);
        }
        .chart svg {
          width: 100%;
          height: auto;
          min-height: 240px;
        }
        .chart-legend {
          font-size: 12px;
          color: var(--text-secondary);
        }

        /* Portfolio Cards */
        .ui-pf-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        @media (max-width: 1024px) {
          .ui-pf-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .ui-pf-grid { grid-template-columns: 1fr; }
        }
        .ui-pf-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s, border-color 0.2s;
        }
        .ui-pf-card:hover {
          transform: translateY(-4px);
          border-color: var(--deep-teal);
        }
        .ui-pf-tag {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          color: var(--deep-teal);
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        /* FAQ Accordion */
        .ui-faq-item {
          border-bottom: 1px solid var(--border);
        }
        .ui-faq-item:last-child {
          border-bottom: none;
        }
        .ui-faq-btn {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 22px 0;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          font-family: 'Lora', Georgia, serif;
          font-size: 19px;
          color: var(--text-primary);
          transition: color 0.2s;
        }
        .ui-faq-btn:hover {
          color: var(--deep-teal);
        }
        .ui-faq-icon {
          width: 24px;
          height: 24px;
          display: grid;
          place-items: center;
          color: var(--deep-teal);
          font-family: monospace;
          font-size: 20px;
          transition: transform 0.3s;
        }
        .ui-faq-item.open .ui-faq-icon {
          transform: rotate(45deg);
        }
        .ui-faq-body {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.35s ease, padding 0.35s ease;
          color: var(--text-secondary);
          font-size: 15px;
          line-height: 1.65;
        }
        .ui-faq-item.open .ui-faq-body {
          max-height: 300px;
          padding-bottom: 20px;
        }
      `}} />

      <div className="ui-page-frame">
        {/* HEADER NAV */}
        <header className="ui-nav">
          <div className="ui-wrap ui-nav-inner">
            <Link href="/" className="ui-logo">
              <img src="/arvo-simbolo-blue.png" alt="ARVO" style={{ width: "24px", height: "24px", objectFit: "contain" }} />
              <span>ARVO</span>
            </Link>
            <nav className="ui-nav-links">
              <a href="#como-funciona">Método</a>
              <a href="#carteiras">Carteiras</a>
              <a href="#independencia">Independência</a>
              <a href="#assinatura">Planos</a>
              <a href="#faq">Dúvidas</a>
            </nav>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Link href="/login" className="ui-btn ui-btn-ghost" style={{ padding: "8px 16px" }}>Entrar</Link>
              <Link href="/register" className="ui-btn ui-btn-primary" style={{ padding: "9px 20px" }}>Descobrir meu plano →</Link>
            </div>
          </div>
        </header>

        {/* 1 & 2. HERO + SIMULADOR */}
        <section className="ui-section" style={{ paddingTop: "40px", paddingBottom: "56px" }}>
          <div className="ui-wrap" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "48px", alignItems: "center" }}>
            <div>
              <div className="ui-eyebrow">
                <span className="ui-eyebrow-dot"></span>
                PLANEJAMENTO INDEPENDENTE · SEM COMISSÃO
              </div>

              <h1 className="ui-serif" style={{ fontSize: "clamp(36px, 4.5vw, 58px)", lineHeight: "1.12", color: "var(--ink-navy)", margin: "0 0 18px 0" }}>
                Não basta investir.<br />
                <i style={{ color: "var(--deep-teal)", fontStyle: "italic" }}>É preciso ter um plano.</i>
              </h1>

              <p style={{ fontSize: "17px", color: "var(--text-secondary)", lineHeight: "1.65", margin: "0 0 28px 0", maxWidth: "44ch" }}>
                A ARVO transforma seus investimentos em uma estratégia clara para você saber quanto investir, como organizar seu patrimônio e se está no caminho dos seus objetivos.
              </p>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px" }}>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <a href="/register" className="ui-btn ui-btn-primary" style={{ fontSize: "15.5px", padding: "15px 30px" }}>
                    Descobrir meu plano →
                  </a>
                  <a href="#como-funciona" className="ui-btn ui-btn-outline" style={{ fontSize: "14.5px", padding: "14px 22px" }}>
                    Ver como funciona ↓
                  </a>
                </div>
                <div className="ui-mono" style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "4px" }}>
                  ✓ 5 MINUTOS · ✓ GRATUITO · ✓ SEM CARTÃO
                </div>
              </div>

              {/* Profile note card */}
              <div style={{ marginTop: "28px", padding: "14px 18px", background: "var(--section-alt)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.55", maxWidth: "44ch" }}>
                <strong style={{ color: "var(--ink-navy)", fontWeight: 600 }}>Para quem é a ARVO?</strong> Feito para quem guarda a partir de R$ 1.000/mês ou já tem patrimônio acumulado e quer direção profissional.
              </div>
            </div>

            {/* Simulator Panel */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <LandingSimulator />
            </div>
          </div>
        </section>

        {/* STAT STRIP */}
        <div className="ui-stat-strip">
          <div className="ui-wrap ui-stat-strip-inner">
            <div><strong>100% FEE-ONLY</strong> SEM COMISSÃO OCULTA</div>
            <span className="ui-stat-divider">|</span>
            <div><strong>4 CARTEIRAS</strong> ESTRATÉGIAS ACOMPANHADAS</div>
            <span className="ui-stat-divider">|</span>
            <div><strong>CUSTÓDIA PRÓPRIA</strong> NO SEU BANCO OU CORRETORA</div>
            <span className="ui-stat-divider">|</span>
            <div><strong>CFP® CERTIFIED</strong> METODOLOGIA INSTITUCIONAL</div>
          </div>
        </div>

        {/* 3. O PROBLEMA */}
        <section className="ui-section" id="problema">
          <div className="ui-wrap">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", marginBottom: "40px", alignItems: "end" }}>
              <div>
                <div className="ui-eyebrow"><span className="ui-eyebrow-dot"></span> O Problema</div>
                <h2 className="ui-serif" style={{ fontSize: "clamp(30px, 3.6vw, 46px)", lineHeight: "1.15", color: "var(--ink-navy)", margin: 0 }}>
                  Você já investe.<br />
                  <i style={{ fontStyle: "italic", color: "var(--deep-teal)" }}>Mas sabe se está no caminho certo?</i>
                </h2>
              </div>
              <div>
                <p style={{ fontSize: "16.5px", color: "var(--text-secondary)", lineHeight: "1.65", margin: 0 }}>
                  Ter bons investimentos não significa necessariamente ter um bom plano. Sem uma direção clara, qualquer oscilação gera dúvida.
                </p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
              {[
                { num: "01", q: "Quanto preciso acumular para ter liberdade?" },
                { num: "02", q: "Quanto devo investir por mês para chegar lá?" },
                { num: "03", q: "Minha carteira faz sentido para os meus objetivos?" },
                { num: "04", q: "Estou mais perto ou mais longe da minha independência?" },
              ].map((item, idx) => (
                <div key={idx} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "26px 22px" }}>
                  <div className="ui-mono" style={{ fontSize: "11px", color: "var(--deep-teal)", fontWeight: 600, marginBottom: "10px" }}>
                    Pergunta {item.num}
                  </div>
                  <div className="ui-serif" style={{ fontSize: "18px", color: "var(--ink-navy)", lineHeight: "1.35" }}>
                    {item.q}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "28px", padding: "22px 30px", background: "var(--section-alt)", border: "1px solid var(--border)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
              <div style={{ fontSize: "16.5px", fontWeight: 500, color: "var(--ink-navy)" }}>
                <strong>É isso que a ARVO organiza.</strong> Clareza e método para suas decisões financeiras.
              </div>
              <a href="/register" className="ui-btn ui-btn-navy" style={{ fontSize: "13.5px" }}>
                Descobrir meu plano →
              </a>
            </div>
          </div>
        </section>

        {/* 4. COMO FUNCIONA */}
        <section className="ui-section ui-section-alt" id="como-funciona">
          <div className="ui-wrap">
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <div className="ui-eyebrow"><span className="ui-eyebrow-dot"></span> Método ARVO</div>
              <h2 className="ui-serif" style={{ fontSize: "clamp(32px, 3.8vw, 48px)", color: "var(--ink-navy)", margin: 0 }}>
                Um plano. <i style={{ fontStyle: "italic", color: "var(--deep-teal)" }}>Três movimentos.</i>
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
              {[
                { idx: "01 — Planeje", title: "Metas claras", desc: "Transforme patrimônio, renda e objetivos em metas financeiras claras e mensuráveis." },
                { idx: "02 — Invista", title: "Estratégia sob medida", desc: "Organize sua estratégia de investimentos de acordo com seu perfil, patrimônio e momento de vida." },
                { idx: "03 — Acompanhe", title: "Evolução contínua", desc: "Veja sua evolução e ajuste o plano conforme sua vida e seus objetivos mudam." },
              ].map((step, idx) => (
                <div key={idx} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "32px 28px", display: "flex", flexDirection: "column" }}>
                  <span className="ui-mono" style={{ fontSize: "11.5px", fontWeight: 600, color: "var(--deep-teal)" }}>{step.idx}</span>
                  <h3 className="ui-serif" style={{ fontSize: "22px", color: "var(--ink-navy)", margin: "12px 0 8px 0" }}>{step.title}</h3>
                  <p style={{ fontSize: "14.5px", color: "var(--text-secondary)", lineHeight: "1.6", margin: 0 }}>{step.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <a href="/register" className="ui-btn ui-btn-primary" style={{ fontSize: "15px", padding: "15px 30px" }}>
                Descobrir meu plano →
              </a>
            </div>
          </div>
        </section>

        {/* 5. CARTEIRAS */}
        <section className="ui-section" id="carteiras">
          <div className="ui-wrap">
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "48px", marginBottom: "44px", alignItems: "end" }}>
              <div>
                <div className="ui-eyebrow"><span className="ui-eyebrow-dot"></span> Estratégias ARVO</div>
                <h2 className="ui-serif" style={{ fontSize: "clamp(30px, 3.6vw, 46px)", lineHeight: "1.12", color: "var(--ink-navy)", margin: 0 }}>
                  Não existe a melhor carteira.<br />
                  <i style={{ fontStyle: "italic", color: "var(--deep-teal)" }}>Existe a certa para cada momento.</i>
                </h2>
              </div>
              <div>
                <p style={{ fontSize: "15.5px", color: "var(--text-secondary)", lineHeight: "1.65", margin: 0 }}>
                  Seu patrimônio muda. Seus objetivos mudam. Sua capacidade de assumir risco também. A ARVO organiza suas estratégias em diferentes níveis de risco e diversificação para você entender onde está e o que muda conforme avança.
                </p>
              </div>
            </div>

            <div className="ui-pf-grid" style={{ marginBottom: "36px" }}>
              {[
                { name: "Abrigo", tag: "Preservação", sub: "Segurança e liquidez. Dinheiro que você pode precisar a qualquer momento.", stat: "Liquidez imediata", bar: 30, meta: "Selic · RF" },
                { name: "Ritmo", tag: "Equilíbrio", sub: "O primeiro passo além do básico. Diversificação estruturada em renda fixa e inflação.", stat: "Diversificação RF", bar: 55, meta: "RF · IPCA · Pré" },
                { name: "Visão", tag: "Crescimento", sub: "Mais diversificação para buscar crescimento. Renda fixa + renda variável controlada.", stat: "Crescimento seguro", bar: 78, meta: "Inflação · Ações · Multi" },
                { name: "Oceano", tag: "Arrojada", sub: "Mais exposição ao longo prazo para quem aceita oscilações maiores em busca de retorno.", stat: "Longo prazo", bar: 95, meta: "Ações · Multimercados" },
              ].map((p, idx) => (
                <div key={idx} className="ui-pf-card">
                  <div className="ui-pf-tag">{p.tag}</div>
                  <h3 className="ui-serif" style={{ fontSize: "32px", color: "var(--ink-navy)", margin: "0 0 8px 0" }}>{p.name}</h3>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.55", marginBottom: "auto" }}>{p.sub}</p>
                  <div style={{ marginTop: "20px", paddingTop: "14px", borderTop: "1px solid var(--border)" }}>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--deep-teal)" }}>{p.stat}</div>
                    <div style={{ height: "4px", background: "var(--border)", borderRadius: "100px", margin: "8px 0", overflow: "hidden" }}>
                      <div style={{ width: `${p.bar}%`, height: "100%", background: "var(--deep-teal)" }}></div>
                    </div>
                    <div className="ui-mono" style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>{p.meta}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center" }}>
              <a href="/register" className="ui-btn ui-btn-outline" style={{ fontSize: "14px", padding: "12px 24px" }}>
                Conhecer as carteiras ARVO →
              </a>
            </div>
          </div>
        </section>

        {/* 6. RESULTADOS / PERFORMANCE */}
        <section className="ui-section ui-section-alt" id="resultados">
          <div className="ui-wrap">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", marginBottom: "36px", alignItems: "end" }}>
              <div>
                <div className="ui-eyebrow"><span className="ui-eyebrow-dot"></span> Transparência</div>
                <h2 className="ui-serif" style={{ fontSize: "clamp(30px, 3.6vw, 46px)", color: "var(--ink-navy)", margin: 0 }}>
                  Resultado aberto.<br />
                  <i style={{ fontStyle: "italic", color: "var(--deep-teal)" }}>Sem promessa de resultado.</i>
                </h2>
              </div>
              <div>
                <p style={{ fontSize: "15.5px", color: "var(--text-secondary)", lineHeight: "1.6", margin: 0 }}>
                  Acompanhe o histórico das estratégias ARVO e compare sua evolução com os principais referenciais de mercado.
                </p>
              </div>
            </div>

            <PerformanceChart />

            <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", fontSize: "13px" }}>
              <div style={{ fontWeight: 600, color: "var(--deep-teal)" }}>
                ✓ Metodologia transparente. Acompanhamento contínuo.
              </div>
              <div style={{ fontStyle: "italic", color: "var(--text-muted)", fontSize: "12px" }}>
                *Rentabilidade passada não representa garantia de resultados futuros.
              </div>
            </div>
          </div>
        </section>

        {/* 7. INDEPENDÊNCIA */}
        <section className="ui-section" id="independencia">
          <div className="ui-wrap">
            <div style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto 40px auto" }}>
              <div className="ui-eyebrow"><span className="ui-eyebrow-dot"></span> Modelo Fee-Only</div>
              <h2 className="ui-serif" style={{ fontSize: "clamp(30px, 3.6vw, 46px)", color: "var(--ink-navy)", margin: "0 0 14px 0" }}>
                Independência não é só uma palavra.<br />
                <i style={{ fontStyle: "italic", color: "var(--deep-teal)" }}>É o nosso modelo de negócio.</i>
              </h2>
              <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                A ARVO não recebe comissão para indicar um produto financeiro. Nossa receita vem exclusivamente da assinatura.
              </p>
            </div>

            {/* Highlight banner */}
            <div style={{ background: "var(--ink-navy)", borderRadius: "18px", padding: "36px 32px", color: "#ffffff", marginBottom: "28px", textAlign: "center" }}>
              <div className="ui-serif" style={{ fontSize: "clamp(20px, 2.6vw, 30px)", lineHeight: "1.3", maxWidth: "42ch", margin: "0 auto" }}>
                Você sabe exatamente quanto paga. E sabe quem está remunerando: <span style={{ color: "var(--accent-green)", fontStyle: "italic" }}>a ARVO.</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "18px" }}>
              {[
                { title: "Sem comissão por produto", desc: "Nenhuma indicação é motivada por rebate ou remuneração de corretoras. Alinhamento 100% com você." },
                { title: "Sem mudar de banco ou corretora", desc: "Você continua investindo onde preferir (XP, BTG, Itaú, NuInvest ou qualquer outra)." },
                { title: "Patrimônio sob seu controle", desc: "A ARVO orienta a estratégia e o plano. A custódia e as decisões de execução são sempre suas." },
              ].map((card, idx) => (
                <div key={idx} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "28px 24px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--section-alt)", color: "var(--deep-teal)", display: "grid", placeItems: "center", marginBottom: "14px", fontWeight: "bold", fontSize: "13px" }}>
                    ✓
                  </div>
                  <h4 className="ui-serif" style={{ fontSize: "19px", color: "var(--ink-navy)", margin: "0 0 8px 0" }}>{card.title}</h4>
                  <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.55", margin: 0 }}>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. FILOSOFIA + FUNDADOR */}
        <section className="ui-section ui-section-alt" id="fundador">
          <div className="ui-wrap">
            <div style={{ display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: "48px", alignItems: "center" }}>
              <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "18px", padding: "36px 28px", textAlign: "center" }}>
                <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "var(--deep-teal)", color: "#ffffff", display: "grid", placeItems: "center", fontSize: "24px", fontFamily: "Lora, serif", margin: "0 auto 14px auto" }}>
                  LM
                </div>
                <h3 className="ui-serif" style={{ fontSize: "22px", color: "var(--ink-navy)", margin: "0 0 4px 0" }}>Lucas Matos, CFP®</h3>
                <div className="ui-mono" style={{ fontSize: "11px", color: "var(--deep-teal)", fontWeight: 600 }}>Fundador da ARVO</div>
                <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid var(--border)", display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap" }}>
                  {["CFP®", "CPA-20", "Ancord", "Mestre em Eng."].map((c, i) => (
                    <span key={i} className="ui-mono" style={{ background: "var(--canvas)", border: "1px solid var(--border)", padding: "3px 8px", borderRadius: "100px", fontSize: "10px", color: "var(--text-secondary)" }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="ui-eyebrow"><span className="ui-eyebrow-dot"></span> Filosofia</div>
                <h2 className="ui-serif" style={{ fontSize: "clamp(30px, 3.6vw, 44px)", color: "var(--ink-navy)", margin: "0 0 16px 0", lineHeight: "1.15" }}>
                  Estratégia antes <i style={{ fontStyle: "italic", color: "var(--deep-teal)" }}>do investimento.</i>
                </h2>
                <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: "1.65", margin: "0 0 14px 0" }}>
                  A ARVO nasceu de uma constatação simples: <strong>muita gente começa escolhendo o investimento antes de saber o que precisa fazer com o dinheiro.</strong>
                </p>
                <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: "1.65", margin: 0 }}>
                  Nós fazemos o contrário. <strong>Primeiro vem o plano. Depois, a estratégia.</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 9. OFERTA / ASSINATURA */}
        <section className="ui-section" id="assinatura">
          <div className="ui-wrap">
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <div className="ui-eyebrow"><span className="ui-eyebrow-dot"></span> Acesso Completo</div>
              <h2 className="ui-serif" style={{ fontSize: "clamp(30px, 3.8vw, 48px)", color: "var(--ink-navy)", margin: "0 0 12px 0" }}>
                Sua vida financeira não precisa de mais uma dica.<br />
                <i style={{ fontStyle: "italic", color: "var(--deep-teal)" }}>Precisa de acompanhamento.</i>
              </h2>
            </div>

            <div style={{ maxWidth: "660px", margin: "0 auto", background: "var(--card)", border: "2px solid var(--deep-teal)", borderRadius: "20px", padding: "44px 36px", textAlign: "center" }}>
              <span className="ui-mono" style={{ fontSize: "11.5px", color: "var(--deep-teal)", fontWeight: 600 }}>PLANO ANUAL ARVO</span>
              <h3 className="ui-serif" style={{ fontSize: "30px", color: "var(--ink-navy)", margin: "6px 0 14px 0" }}>Acesso Completo</h3>

              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "6px" }}>
                <span className="ui-serif" style={{ fontSize: "52px", fontWeight: 600, color: "var(--ink-navy)" }}>R$ 59,90</span>
                <span style={{ fontSize: "17px", color: "var(--text-muted)" }}>/ mês</span>
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
                Cobrado em 12x de R$ 59,90 ou R$ 599,00 à vista (2 meses grátis)
              </div>

              <ul style={{ listStyle: "none", padding: 0, margin: "28px auto", maxWidth: "440px", textAlign: "left", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px", fontSize: "14px", color: "var(--text-secondary)" }}>
                {["Planejamento financeiro", "Estratégias de investimento", "Atualizações e rebalanceamentos", "Acompanhamento contínuo", "Conteúdo e comunidade", "Calculadoras e ferramentas"].map((feat, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: "var(--deep-teal)", fontWeight: "bold" }}>✓</span> {feat}
                  </li>
                ))}
                <li style={{ gridColumn: "span 2", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "var(--deep-teal)", fontWeight: "bold" }}>✓</span> Suporte direto ARVO
                </li>
              </ul>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "360px", margin: "0 auto" }}>
                <a href="/register" className="ui-btn ui-btn-primary" style={{ fontSize: "15.5px", padding: "15px 26px" }}>
                  Começar pela ARVO
                </a>
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "14px" }}>
                  <div style={{ fontSize: "12.5px", color: "var(--text-muted)", marginBottom: "6px" }}>
                    Antes de assinar, conheça seu plano.
                  </div>
                  <a href="/register" className="ui-btn ui-btn-outline" style={{ fontSize: "13.5px", padding: "11px 18px", width: "100%" }}>
                    Fazer meu diagnóstico gratuito
                  </a>
                </div>
              </div>

              <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "20px" }}>
                🔒 Garantia incondicional de 7 dias com 100% de reembolso.
              </div>
            </div>
          </div>
        </section>

        {/* 10. FAQ */}
        <section className="ui-section ui-section-alt" id="faq">
          <div className="ui-wrap" style={{ maxWidth: "860px" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div className="ui-eyebrow"><span className="ui-eyebrow-dot"></span> Dúvidas Frequentes</div>
              <h2 className="ui-serif" style={{ fontSize: "clamp(30px, 3.6vw, 46px)", color: "var(--ink-navy)", margin: 0 }}>
                Antes de decidir.
              </h2>
            </div>

            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "18px", padding: "8px 28px" }}>
              {[
                {
                  q: "Preciso tirar meus investimentos do meu banco?",
                  a: "Não. Você continua investindo no banco ou corretora que preferir e mantém o controle do seu patrimônio. A ARVO ajuda a organizar a estratégia; você decide e executa seus investimentos onde quiser.",
                  open: true,
                },
                {
                  q: "A ARVO investe o dinheiro por mim?",
                  a: "Não. A ARVO não recebe, movimenta ou mantém a custódia do seu dinheiro. Seus investimentos continuam no seu banco ou corretora e todas as decisões e movimentações permanecem sob seu controle.",
                },
                {
                  q: "Como a ARVO ganha dinheiro?",
                  a: "Pela assinatura dos nossos clientes. A ARVO não depende de comissão sobre os produtos que você investe. Isso permite construir nossa relação com um objetivo simples: ajudar você a tomar decisões financeiras melhores, sem precisar empurrar um produto.",
                },
                {
                  q: "Posso conhecer antes de pagar?",
                  a: "Sim. Você pode começar gratuitamente pelo diagnóstico da ARVO, conhecer seu cenário financeiro e entender como a plataforma funciona antes de decidir assinar.",
                },
                {
                  q: "Como funciona o cancelamento e a garantia?",
                  a: "Você pode cancelar a renovação da sua assinatura quando quiser. Caso esteja dentro do período de garantia informado no momento da contratação, também poderá solicitar o reembolso conforme as condições apresentadas na assinatura.",
                },
                {
                  q: "Para quem NÃO é a ARVO?",
                  a: "A ARVO não é para quem procura dinheiro rápido, promessas de rentabilidade ou a “ação da vez”. Também não é para quem quer entregar o dinheiro para outra pessoa administrar. A ARVO é para quem quer construir patrimônio com planejamento, estratégia e visão de longo prazo — mantendo o controle das próprias decisões.",
                },
              ].map((faq, idx) => (
                <div key={idx} className={`ui-faq-item ${faq.open ? "open" : ""}`}>
                  <button className="ui-faq-btn">
                    <span>{faq.q}</span>
                    <span className="ui-faq-icon">+</span>
                  </button>
                  <div className="ui-faq-body">{faq.a}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 11. CTA FINAL */}
        <section className="ui-section" style={{ textAlign: "center", padding: "88px 0" }}>
          <div className="ui-wrap">
            <div className="ui-eyebrow"><span className="ui-eyebrow-dot"></span> Comece Agora</div>
            <h2 className="ui-serif" style={{ fontSize: "clamp(34px, 4.6vw, 60px)", color: "var(--ink-navy)", margin: "0 auto 16px auto", maxWidth: "20ch", lineHeight: "1.1" }}>
              Você já começou a investir.<br />
              <i style={{ fontStyle: "italic", color: "var(--deep-teal)" }}>Agora descubra se está no caminho certo.</i>
            </h2>
            <p style={{ fontSize: "17.5px", color: "var(--text-secondary)", margin: "0 auto 32px auto", maxWidth: "46ch" }}>
              Em menos de 5 minutos você descobre o plano ideal para o seu momento financeiro.
            </p>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <a href="/register" className="ui-btn ui-btn-primary" style={{ fontSize: "16px", padding: "16px 34px" }}>
                Descobrir meu plano →
              </a>
              <div className="ui-mono" style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                ✓ 5 MINUTOS · ✓ GRATUITO · ✓ SEM CARTÃO
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ background: "var(--ink-navy)", color: "#ffffff", padding: "56px 0 28px 0" }}>
          <div className="ui-wrap">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "24px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "32px" }}>
              <div className="ui-logo" style={{ color: "#ffffff" }}>
                <img src="/arvo-simbolo-blue.png" alt="ARVO" style={{ width: "24px", height: "24px", objectFit: "contain" }} />
                <span>ARVO</span>
              </div>
              <div style={{ display: "flex", gap: "24px", fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>
                <a href="#como-funciona" style={{ color: "inherit", textDecoration: "none" }}>Método</a>
                <a href="#carteiras" style={{ color: "inherit", textDecoration: "none" }}>Carteiras</a>
                <a href="#independencia" style={{ color: "inherit", textDecoration: "none" }}>Independência</a>
                <a href="#assinatura" style={{ color: "inherit", textDecoration: "none" }}>Planos</a>
                <a href="#faq" style={{ color: "inherit", textDecoration: "none" }}>Dúvidas</a>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", paddingTop: "20px", fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
              <span>ARVO Orientação Financeira LTDA · ARVO® 2026</span>
              <span>Plataforma independente fee-only</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
