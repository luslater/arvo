"use client";

import { useState } from "react";
import LandingSimulator from "@/components/landing-simulator";
import Link from "next/link";

export default function PreviewCopyV2Page() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <div className="v2-theme-root">
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

        .v2-theme-root {
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
          padding: 24px 36px;
          color: var(--text-primary);
          font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
          font-size: 16px;
          line-height: 1.6;
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }

        .v2-page-frame {
          background: var(--canvas);
          border: 1px solid rgba(14, 21, 17, 0.18);
          border-radius: 24px;
          overflow: hidden;
          max-width: 1360px;
          margin: 0 auto;
          box-shadow: 0 6px 32px rgba(14, 21, 17, 0.05);
        }

        @media (min-width: 1440px) {
          .v2-theme-root { padding: 32px 48px; }
        }

        @media (max-width: 860px) {
          .v2-theme-root { padding: 0; }
          .v2-page-frame { border-radius: 0; border: none; }
        }

        .v2-theme-root * { box-sizing: border-box; }
        
        .v2-serif {
          font-family: 'Lora', Georgia, serif;
          letter-spacing: -0.015em;
        }
        
        .v2-mono {
          font-family: 'IBM Plex Mono', monospace;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .v2-wrap {
          max-width: 1140px;
          margin: 0 auto;
          padding: 0 32px;
        }
        @media (max-width: 768px) {
          .v2-wrap { padding: 0 20px; }
        }

        /* Buttons */
        .v2-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 28px;
          border-radius: 100px;
          font-weight: 500;
          font-size: 15px;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          line-height: 1.2;
        }
        .v2-btn-primary {
          background: var(--deep-teal);
          color: #ffffff;
          box-shadow: 0 2px 10px rgba(43, 110, 118, 0.2);
        }
        .v2-btn-primary:hover {
          background: var(--deep-teal-hover);
          transform: translateY(-2px);
          box-shadow: 0 4px 14px rgba(43, 110, 118, 0.3);
        }
        .v2-btn-navy {
          background: var(--ink-navy);
          color: #ffffff;
        }
        .v2-btn-navy:hover {
          background: #0a1f2d;
          transform: translateY(-2px);
        }
        .v2-btn-outline {
          background: transparent;
          border: 1px solid var(--deep-teal);
          color: var(--deep-teal);
        }
        .v2-btn-outline:hover {
          background: rgba(43, 110, 118, 0.08);
        }
        .v2-btn-ghost {
          background: transparent;
          color: var(--text-primary);
        }
        .v2-btn-ghost:hover {
          color: var(--deep-teal);
        }

        /* Nav */
        .v2-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(244, 241, 234, 0.94);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
        }
        .v2-nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 66px;
        }
        .v2-logo {
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
        .v2-nav-links {
          display: flex;
          gap: 24px;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-secondary);
        }
        .v2-nav-links a {
          text-decoration: none;
          color: inherit;
          transition: color 0.2s;
        }
        .v2-nav-links a:hover {
          color: var(--deep-teal);
        }
        @media (max-width: 900px) {
          .v2-nav-links { display: none; }
        }

        /* Eyebrow badge */
        .v2-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
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
        .v2-eyebrow-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-green);
        }

        /* Sections */
        .v2-section {
          padding: 76px 0;
          border-bottom: 1px solid var(--border);
          position: relative;
        }
        .v2-section-alt {
          background: var(--section-alt);
        }

        /* Card System */
        .v2-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 18px;
          padding: 32px;
          box-shadow: 0 2px 12px rgba(14, 21, 17, 0.02);
        }

        /* Movement cards */
        .v2-movement-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 18px;
          padding: 32px 28px;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s, border-color 0.2s;
        }
        .v2-movement-card:hover {
          transform: translateY(-3px);
          border-color: var(--deep-teal);
        }

        /* Faixa de Confiança */
        .v2-trust-strip {
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          background: var(--card);
          padding: 24px 0;
        }
        .v2-trust-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        @media (max-width: 900px) {
          .v2-trust-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 540px) {
          .v2-trust-grid { grid-template-columns: 1fr; }
        }

        /* FAQ */
        .v2-faq-item {
          border-bottom: 1px solid var(--border);
        }
        .v2-faq-item:last-child {
          border-bottom: none;
        }
        .v2-faq-btn {
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
        .v2-faq-btn:hover {
          color: var(--deep-teal);
        }
        .v2-faq-icon {
          font-family: monospace;
          font-size: 22px;
          color: var(--deep-teal);
          transition: transform 0.3s;
        }
        .v2-faq-open .v2-faq-icon {
          transform: rotate(45deg);
        }
        .v2-faq-body {
          color: var(--text-secondary);
          font-size: 15.5px;
          line-height: 1.65;
          padding-bottom: 22px;
        }
      `}} />

      <div className="v2-page-frame">
        {/* MENU / HEADER */}
        <header className="v2-nav">
          <div className="v2-wrap v2-nav-inner">
            <Link href="/" className="v2-logo">
              <img src="/arvo-simbolo-blue.png" alt="ARVO" style={{ width: "24px", height: "24px", objectFit: "contain" }} />
              <span>ARVO</span>
            </Link>
            <nav className="v2-nav-links">
              <a href="#como-funciona">Como funciona</a>
              <a href="#o-que-voce-recebe">O que você recebe</a>
              <a href="#por-que-a-arvo">Por que a ARVO</a>
              <a href="#planos">Planos</a>
              <a href="#duvidas">Dúvidas</a>
            </nav>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Link href="/login" className="v2-btn v2-btn-ghost" style={{ padding: "8px 16px" }}>Entrar</Link>
              <Link href="/register" className="v2-btn v2-btn-primary" style={{ padding: "9px 22px" }}>Fazer diagnóstico →</Link>
            </div>
          </div>
        </header>

        {/* 1. HERO COM SIMULADOR */}
        <section className="v2-section" style={{ paddingTop: "44px", paddingBottom: "60px" }}>
          <div className="v2-wrap" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "48px", alignItems: "center" }}>
            <div>
              <div className="v2-eyebrow">
                <span className="v2-eyebrow-dot"></span>
                PLANEJAMENTO FINANCEIRO INDEPENDENTE · SEM COMISSÃO
              </div>

              <h1 className="v2-serif" style={{ fontSize: "clamp(34px, 4.4vw, 56px)", lineHeight: "1.12", color: "var(--ink-navy)", margin: "0 0 18px 0" }}>
                Você já investe.<br />
                <i style={{ color: "var(--deep-teal)", fontStyle: "italic" }}>Mas sabe se está no caminho certo?</i>
              </h1>

              <p style={{ fontSize: "17.5px", color: "var(--text-secondary)", lineHeight: "1.65", margin: "0 0 28px 0", maxWidth: "44ch" }}>
                A ARVO transforma seus objetivos em um plano financeiro claro para você saber quanto investir, como organizar seu patrimônio e quais ajustes fazer para chegar aonde deseja.
              </p>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px" }}>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <Link href="/register" className="v2-btn v2-btn-primary" style={{ fontSize: "15.5px", padding: "15px 30px" }}>
                    Descobrir se estou no caminho certo →
                  </Link>
                  <a href="#como-funciona" className="v2-btn v2-btn-outline" style={{ fontSize: "14.5px", padding: "14px 22px" }}>
                    Ver como funciona ↓
                  </a>
                </div>
                <div className="v2-mono" style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "4px" }}>
                  ✓ 5 MINUTOS · ✓ GRATUITO · ✓ SEM CARTÃO
                </div>
              </div>

              {/* Para quem é a ARVO */}
              <div style={{ marginTop: "28px", padding: "16px 20px", background: "var(--section-alt)", border: "1px solid var(--border)", borderRadius: "14px", fontSize: "13.5px", color: "var(--text-secondary)", lineHeight: "1.55", maxWidth: "45ch" }}>
                <strong style={{ color: "var(--ink-navy)", fontWeight: 600 }}>Para quem é a ARVO?</strong> Para quem investe a partir de R$ 1.000 por mês ou já possui patrimônio acumulado e quer tomar decisões com mais clareza, método e independência.
              </div>
            </div>

            {/* Simulador Interativo */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <LandingSimulator />
            </div>
          </div>
        </section>

        {/* FAIXA DE CONFIANÇA */}
        <div className="v2-trust-strip">
          <div className="v2-wrap">
            <div className="v2-trust-grid">
              <div style={{ borderLeft: "3px solid var(--deep-teal)", paddingLeft: "14px" }}>
                <div className="v2-mono" style={{ fontSize: "12px", color: "var(--ink-navy)", fontWeight: 600 }}>100% FEE-ONLY</div>
                <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>Sem comissão por produto</div>
              </div>
              <div style={{ borderLeft: "3px solid var(--deep-teal)", paddingLeft: "14px" }}>
                <div className="v2-mono" style={{ fontSize: "12px", color: "var(--ink-navy)", fontWeight: 600 }}>CUSTÓDIA PRÓPRIA</div>
                <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>Seu dinheiro continua no seu banco ou corretora</div>
              </div>
              <div style={{ borderLeft: "3px solid var(--deep-teal)", paddingLeft: "14px" }}>
                <div className="v2-mono" style={{ fontSize: "12px", color: "var(--ink-navy)", fontWeight: 600 }}>PLANEJAMENTO PRIMEIRO</div>
                <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>Os objetivos vêm antes dos investimentos</div>
              </div>
              <div style={{ borderLeft: "3px solid var(--deep-teal)", paddingLeft: "14px" }}>
                <div className="v2-mono" style={{ fontSize: "12px", color: "var(--ink-navy)", fontWeight: 600 }}>ACOMPANHAMENTO CONTÍNUO</div>
                <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>O plano evolui junto com a sua vida</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. O PROBLEMA */}
        <section className="v2-section" id="problema">
          <div className="v2-wrap">
            <div style={{ maxWidth: "860px", marginBottom: "44px" }}>
              <div className="v2-eyebrow"><span className="v2-eyebrow-dot"></span> INVESTIR NÃO É O MESMO QUE TER UM PLANO</div>
              <h2 className="v2-serif" style={{ fontSize: "clamp(30px, 3.8vw, 48px)", lineHeight: "1.15", color: "var(--ink-navy)", margin: "0 0 16px 0" }}>
                Você pode estar construindo patrimônio sem saber se ele será suficiente.
              </h2>
              <p style={{ fontSize: "17.5px", color: "var(--text-secondary)", lineHeight: "1.65", margin: 0 }}>
                Ter bons investimentos isoladamente não significa que eles formam uma boa estratégia. Sem uma visão completa, algumas das decisões mais importantes da sua vida financeira continuam sendo tomadas no escuro:
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "18px", marginBottom: "36px" }}>
              {[
                { num: "01", q: "Quanto preciso acumular?", desc: "Qual patrimônio será necessário para sustentar os objetivos que desejo alcançar?" },
                { num: "02", q: "Quanto devo investir por mês?", desc: "Meu aporte atual é suficiente ou preciso ajustar o ritmo?" },
                { num: "03", q: "Minha carteira faz sentido?", desc: "Os investimentos que tenho combinam com meus objetivos, prazos e momento de vida?" },
                { num: "04", q: "Estou avançando na velocidade certa?", desc: "Estou à frente, dentro ou atrás da trajetória necessária?" },
              ].map((item, idx) => (
                <div key={idx} className="v2-card" style={{ padding: "28px 24px" }}>
                  <div className="v2-mono" style={{ fontSize: "12px", color: "var(--deep-teal)", fontWeight: 600, marginBottom: "10px" }}>
                    {item.num}
                  </div>
                  <h3 className="v2-serif" style={{ fontSize: "20px", color: "var(--ink-navy)", margin: "0 0 8px 0" }}>{item.q}</h3>
                  <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0, lineHeight: "1.55" }}>{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Banner de Rota */}
            <div style={{ background: "var(--section-alt)", border: "1px solid var(--border)", borderRadius: "16px", padding: "28px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
              <div style={{ maxWidth: "680px" }}>
                <div style={{ fontSize: "16.5px", color: "var(--ink-navy)", lineHeight: "1.6" }}>
                  A ARVO reúne essas respostas em uma única rota financeira. Você deixa de acumular produtos sem direção e passa a saber <strong>onde está, aonde precisa chegar e o que fazer mês a mês para chegar lá.</strong>
                </div>
              </div>
              <Link href="/register" className="v2-btn v2-btn-navy" style={{ fontSize: "14.5px" }}>
                Calcular minha rota financeira →
              </Link>
            </div>
          </div>
        </section>

        {/* 3. COMO FUNCIONA (MÉTODO ARVO) */}
        <section className="v2-section v2-section-alt" id="como-funciona">
          <div className="v2-wrap">
            <div style={{ textAlign: "center", maxWidth: "780px", margin: "0 auto 48px auto" }}>
              <div className="v2-eyebrow"><span className="v2-eyebrow-dot"></span> MÉTODO ARVO</div>
              <h2 className="v2-serif" style={{ fontSize: "clamp(32px, 4vw, 50px)", color: "var(--ink-navy)", margin: "0 0 16px 0", lineHeight: "1.15" }}>
                Primeiro o destino.<br />
                <i style={{ color: "var(--deep-teal)", fontStyle: "italic" }}>Depois, os investimentos.</i>
              </h2>
              <p style={{ fontSize: "17px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                A maioria das pessoas começa perguntando qual produto comprar. A ARVO começa por uma pergunta mais importante: <strong>o que o seu dinheiro precisa tornar possível?</strong> A partir da resposta, construímos sua rota em três movimentos:
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "22px", marginBottom: "40px" }}>
              {[
                {
                  step: "01 — DEFINA A ROTA",
                  title: "Entenda onde está e aonde quer chegar",
                  desc: "Você informa sua renda, patrimônio, dívidas, capacidade de investimento e objetivos. A ARVO transforma essas informações em números claros: quanto precisa acumular, qual prazo possui e qual aporte mensal aproxima você desse destino.",
                  tag: "Diagnóstico + objetivos + patrimônio necessário"
                },
                {
                  step: "02 — CONSTRUA O PLANO",
                  title: "Conecte seus investimentos aos seus objetivos",
                  desc: "Com o destino definido, a ARVO mostra a trajetória entre seu patrimônio atual e o patrimônio necessário. A estratégia de investimentos é organizada de acordo com seu perfil, seus prazos e seus objetivos — e não pela comissão de um produto.",
                  tag: "Plano mensal + trajetória patrimonial + estratégia"
                },
                {
                  step: "03 — ACOMPANHE A EVOLUÇÃO",
                  title: "Saiba se continua no caminho certo",
                  desc: "Seu plano não termina quando a carteira é definida. Você acompanha sua evolução e pode ajustar a rota quando sua renda, patrimônio, família ou prioridades mudarem.",
                  tag: "Painel de evolução + revisões + acompanhamento"
                },
              ].map((m, idx) => (
                <div key={idx} className="v2-movement-card">
                  <div className="v2-mono" style={{ fontSize: "11.5px", color: "var(--deep-teal)", fontWeight: 600, marginBottom: "10px" }}>
                    {m.step}
                  </div>
                  <h3 className="v2-serif" style={{ fontSize: "22px", color: "var(--ink-navy)", margin: "0 0 12px 0", lineHeight: "1.3" }}>
                    {m.title}
                  </h3>
                  <p style={{ fontSize: "14.5px", color: "var(--text-secondary)", lineHeight: "1.6", margin: "0 0 20px 0", flex: 1 }}>
                    {m.desc}
                  </p>
                  <div className="v2-mono" style={{ fontSize: "11px", color: "var(--deep-teal)", background: "var(--section-alt)", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border)" }}>
                    ✓ {m.tag}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center" }}>
              <Link href="/register" className="v2-btn v2-btn-primary" style={{ fontSize: "15.5px", padding: "15px 32px" }}>
                Descobrir se estou no caminho certo →
              </Link>
            </div>
          </div>
        </section>

        {/* 4. O QUE VOCÊ RECEBE */}
        <section className="v2-section" id="o-que-voce-recebe">
          <div className="v2-wrap">
            <div style={{ textAlign: "center", maxWidth: "780px", margin: "0 auto 48px auto" }}>
              <div className="v2-eyebrow"><span className="v2-eyebrow-dot"></span> SEU PLANO COMPLETO</div>
              <h2 className="v2-serif" style={{ fontSize: "clamp(30px, 3.8vw, 46px)", color: "var(--ink-navy)", margin: "0 0 14px 0" }}>
                Mais do que uma carteira recomendada.
              </h2>
              <p style={{ fontSize: "17px", color: "var(--text-secondary)" }}>
                A ARVO conecta planejamento, investimentos e acompanhamento em uma única experiência.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px", marginBottom: "40px" }}>
              {[
                { title: "Raio-X financeiro", desc: "Uma visão organizada da sua renda, patrimônio, dívidas, investimentos e capacidade real de aporte." },
                { title: "Objetivos transformados em números", desc: "Você descobre quanto precisa acumular, em quanto tempo e qual patrimônio deverá construir." },
                { title: "Plano mês a mês", desc: "Uma trajetória clara com o aporte recomendado para sair do cenário atual e alcançar seus objetivos." },
                { title: "Estratégia de investimentos", desc: "Uma carteira compatível com seu perfil de risco, prazo, patrimônio e momento de vida." },
                { title: "Painel de evolução", desc: "Uma visão simples para acompanhar se você está à frente, dentro ou atrás da rota planejada." },
                { title: "Revisões do plano", desc: "Ajustes sempre que mudanças relevantes de renda, patrimônio, família ou objetivos exigirem uma nova direção." },
                { title: "Suporte ARVO", desc: "Orientação para entender o plano e tomar decisões financeiras com mais segurança." },
              ].map((item, idx) => (
                <div key={idx} className="v2-card" style={{ padding: "26px 24px" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--section-alt)", color: "var(--deep-teal)", display: "grid", placeItems: "center", fontWeight: "bold", fontSize: "13px", marginBottom: "12px" }}>
                    ✓
                  </div>
                  <h3 className="v2-serif" style={{ fontSize: "19px", color: "var(--ink-navy)", margin: "0 0 8px 0" }}>{item.title}</h3>
                  <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0, lineHeight: "1.55" }}>{item.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center" }}>
              <Link href="/register" className="v2-btn v2-btn-navy" style={{ fontSize: "15px" }}>
                Ver meu plano →
              </Link>
            </div>
          </div>
        </section>

        {/* 5. POR QUE A ARVO */}
        <section className="v2-section v2-section-alt" id="por-que-a-arvo">
          <div className="v2-wrap">
            <div style={{ textAlign: "center", maxWidth: "820px", margin: "0 auto 48px auto" }}>
              <div className="v2-eyebrow"><span className="v2-eyebrow-dot"></span> INDEPENDÊNCIA DE VERDADE</div>
              <h2 className="v2-serif" style={{ fontSize: "clamp(30px, 3.8vw, 46px)", color: "var(--ink-navy)", margin: "0 0 16px 0", lineHeight: "1.15" }}>
                Quem orienta você não deveria ganhar mais por indicar um produto.
              </h2>
              <p style={{ fontSize: "17px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                Grande parte do mercado financeiro é remunerada pelos produtos que vende. A ARVO funciona de outra forma: nossa receita vem exclusivamente da assinatura dos clientes. Isso permite começar pelos seus objetivos — e não pelo investimento que alguém precisa vender.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "18px", marginBottom: "36px" }}>
              {[
                { title: "Sem comissão por produto", desc: "Nenhuma orientação é motivada por rebate ou remuneração de bancos, corretoras ou fundos." },
                { title: "Sem mudar de banco ou corretora", desc: "Você continua investindo onde preferir." },
                { title: "Patrimônio sempre sob seu controle", desc: "A ARVO não recebe, movimenta ou mantém a custódia do seu dinheiro." },
                { title: "Planejamento contínuo", desc: "Você não recebe apenas um relatório estático. Seu plano pode ser acompanhado e ajustado conforme sua vida muda." },
              ].map((p, idx) => (
                <div key={idx} className="v2-card" style={{ padding: "26px 22px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--section-alt)", color: "var(--deep-teal)", display: "grid", placeItems: "center", fontWeight: "bold", fontSize: "13px", marginBottom: "14px" }}>
                    ✓
                  </div>
                  <h3 className="v2-serif" style={{ fontSize: "19px", color: "var(--ink-navy)", margin: "0 0 8px 0" }}>{p.title}</h3>
                  <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0, lineHeight: "1.55" }}>{p.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ background: "var(--ink-navy)", color: "#ffffff", borderRadius: "16px", padding: "24px 32px", textAlign: "center" }}>
              <div className="v2-serif" style={{ fontSize: "20px", maxWidth: "60ch", margin: "0 auto" }}>
                Planejamento independente significa saber <strong>quem você está remunerando e por quê.</strong>
              </div>
            </div>
          </div>
        </section>

        {/* AUTORIDADE */}
        <section className="v2-section">
          <div className="v2-wrap">
            <div style={{ display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: "48px", alignItems: "center" }}>
              <div className="v2-card" style={{ textAlign: "center", padding: "36px 28px" }}>
                <div style={{ width: "76px", height: "76px", borderRadius: "50%", background: "var(--deep-teal)", color: "#ffffff", display: "grid", placeItems: "center", fontSize: "26px", fontFamily: "Lora, serif", margin: "0 auto 16px auto" }}>
                  LM
                </div>
                <h3 className="v2-serif" style={{ fontSize: "24px", color: "var(--ink-navy)", margin: "0 0 4px 0" }}>Lucas Matos, CFP®</h3>
                <div className="v2-mono" style={{ fontSize: "12px", color: "var(--deep-teal)", fontWeight: 600 }}>Fundador da ARVO</div>
                <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid var(--border)", display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap" }}>
                  {["CFP®", "CPA-20", "ANCORD", "Mestre em Engenharia"].map((c, i) => (
                    <span key={i} className="v2-mono" style={{ background: "var(--section-alt)", border: "1px solid var(--border)", padding: "4px 10px", borderRadius: "100px", fontSize: "11px", color: "var(--text-secondary)" }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="v2-eyebrow"><span className="v2-eyebrow-dot"></span> QUEM CRIOU A ARVO</div>
                <h2 className="v2-serif" style={{ fontSize: "clamp(30px, 3.6vw, 44px)", color: "var(--ink-navy)", margin: "0 0 16px 0", lineHeight: "1.15" }}>
                  Estratégia antes <i style={{ color: "var(--deep-teal)", fontStyle: "italic" }}>do investimento.</i>
                </h2>
                <p style={{ fontSize: "16.5px", color: "var(--text-secondary)", lineHeight: "1.65", margin: "0 0 14px 0" }}>
                  Lucas é planejador financeiro CFP®, certificado CPA-20, Ancord e mestre em Engenharia.
                </p>
                <p style={{ fontSize: "16.5px", color: "var(--text-secondary)", lineHeight: "1.65", margin: "0 0 20px 0" }}>
                  Ao longo da carreira, percebeu um padrão: mesmo pessoas com boa renda e patrimônio relevante recebiam recomendações de investimentos sem possuir um plano que conectasse essas decisões aos seus objetivos de vida. A ARVO nasceu para inverter essa ordem.
                </p>
                <div style={{ padding: "14px 20px", background: "var(--section-alt)", borderLeft: "3px solid var(--deep-teal)", borderRadius: "8px", fontSize: "16px", color: "var(--ink-navy)", fontWeight: 600 }}>
                  "Primeiro vem o plano. Depois, a estratégia."
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EXPERIÊNCIAS DE CLIENTES */}
        <section className="v2-section v2-section-alt">
          <div className="v2-wrap">
            <div style={{ textAlign: "center", maxWidth: "760px", margin: "0 auto 48px auto" }}>
              <div className="v2-eyebrow"><span className="v2-eyebrow-dot"></span> CLAREZA NA PRÁTICA</div>
              <h2 className="v2-serif" style={{ fontSize: "clamp(28px, 3.6vw, 44px)", color: "var(--ink-navy)", margin: 0 }}>
                O que muda quando os investimentos passam a <i style={{ color: "var(--deep-teal)", fontStyle: "italic" }}>seguir um plano.</i>
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
              {[
                {
                  author: "Marina T.",
                  role: "Empresária · 38 anos",
                  quote: "“Tinha dinheiro distribuído em vários investimentos, mas não sabia se eles formavam uma estratégia. Depois do diagnóstico, consegui entender quanto precisava investir por mês para alcançar meu objetivo.”"
                },
                {
                  author: "Rafael C.",
                  role: "Engenheiro · 42 anos",
                  quote: "“Investia seguindo recomendações pontuais, sem enxergar o patrimônio como um todo. O plano mostrou quais decisões faziam sentido para os meus objetivos e quais precisavam ser revistas.”"
                },
                {
                  author: "Rodrigo M.",
                  role: "Sócio de consultoria · 36 anos",
                  quote: "“Eu investia havia anos, mas não tinha uma meta numérica. Com a ARVO, descobri o aporte necessário e passei a acompanhar se estava dentro da trajetória.”"
                }
              ].map((dep, idx) => (
                <div key={idx} className="v2-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: "1.65", marginBottom: "20px" }}>
                    {dep.quote}
                  </div>
                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: "14px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "var(--section-alt)", color: "var(--deep-teal)", display: "grid", placeItems: "center", fontWeight: "bold", fontSize: "14px", fontFamily: "Lora, serif" }}>
                      {dep.author.slice(0, 2)}
                    </div>
                    <div>
                      <div className="v2-serif" style={{ fontSize: "16px", fontWeight: 600, color: "var(--ink-navy)" }}>{dep.author}</div>
                      <div className="v2-mono" style={{ fontSize: "11px", color: "var(--text-muted)" }}>{dep.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. PLANO (OFERTA) */}
        <section className="v2-section" id="planos">
          <div className="v2-wrap">
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <div className="v2-eyebrow"><span className="v2-eyebrow-dot"></span> ACESSO COMPLETO</div>
              <h2 className="v2-serif" style={{ fontSize: "clamp(30px, 3.8vw, 48px)", color: "var(--ink-navy)", margin: "0 0 12px 0" }}>
                Sua vida financeira não precisa de mais uma dica.<br />
                <i style={{ color: "var(--deep-teal)", fontStyle: "italic" }}>Precisa de direção e acompanhamento.</i>
              </h2>
            </div>

            <div className="v2-card" style={{ maxWidth: "660px", margin: "0 auto", border: "2px solid var(--deep-teal)", padding: "44px 36px", textAlign: "center" }}>
              <span className="v2-mono" style={{ fontSize: "11.5px", color: "var(--deep-teal)", fontWeight: 600 }}>PLANO ANUAL ARVO</span>
              
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "6px", margin: "14px 0 6px 0" }}>
                <span className="v2-serif" style={{ fontSize: "52px", fontWeight: 600, color: "var(--ink-navy)" }}>R$ 59,90</span>
                <span style={{ fontSize: "17px", color: "var(--text-muted)" }}>/ mês</span>
              </div>
              <div style={{ fontSize: "13.5px", color: "var(--text-muted)" }}>
                Cobrado em 12 parcelas de R$ 59,90 ou <strong>R$ 599 à vista</strong>
              </div>

              <div style={{ margin: "28px auto", maxWidth: "460px", textAlign: "left" }}>
                <div className="v2-mono" style={{ fontSize: "11px", color: "var(--ink-navy)", fontWeight: 600, marginBottom: "12px" }}>
                  O PLANO INCLUI:
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px", fontSize: "13.5px", color: "var(--text-secondary)" }}>
                  {[
                    "Diagnóstico financeiro completo",
                    "Definição dos objetivos",
                    "Cálculo do patrimônio necessário",
                    "Plano personalizado de aportes",
                    "Estratégia de investimentos",
                    "Painel de acompanhamento",
                    "Atualizações e revisões",
                    "Ferramentas e projeções",
                  ].map((feat, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "var(--deep-teal)", fontWeight: "bold" }}>✓</span> {feat}
                    </li>
                  ))}
                  <li style={{ gridColumn: "span 2", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: "var(--deep-teal)", fontWeight: "bold" }}>✓</span> Suporte direto ARVO
                  </li>
                </ul>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "380px", margin: "0 auto" }}>
                <Link href="/register" className="v2-btn v2-btn-primary" style={{ fontSize: "15.5px", padding: "15px 26px" }}>
                  Fazer meu diagnóstico gratuito →
                </Link>
                <div style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.4" }}>
                  Conheça seu cenário e entenda como a ARVO funciona antes de decidir pela assinatura.
                </div>
                <div className="v2-mono" style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                  ✓ ~5 MINUTOS · ✓ SEM CARTÃO · ✓ CUSTÓDIA NO SEU BANCO
                </div>
              </div>

              {/* Garantia */}
              <div style={{ marginTop: "28px", paddingTop: "20px", borderTop: "1px solid var(--border)", textAlign: "left", fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                <strong style={{ color: "var(--ink-navy)" }}>🔒 Garantia incondicional de 7 dias:</strong> Se você assinar e concluir que a ARVO não é adequada para você, poderá solicitar o reembolso integral nos primeiros sete dias.
              </div>
            </div>
          </div>
        </section>

        {/* 7. DÚVIDAS FREQUENTES (FAQ) */}
        <section className="v2-section v2-section-alt" id="duvidas">
          <div className="v2-wrap" style={{ maxWidth: "860px" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div className="v2-eyebrow"><span className="v2-eyebrow-dot"></span> ANTES DE DECIDIR</div>
              <h2 className="v2-serif" style={{ fontSize: "clamp(30px, 3.6vw, 46px)", color: "var(--ink-navy)", margin: 0 }}>
                Perguntas frequentes
              </h2>
            </div>

            <div className="v2-card" style={{ padding: "8px 28px" }}>
              {[
                {
                  q: "Preciso tirar meus investimentos do meu banco?",
                  a: "Não. Você continua investindo no banco ou na corretora que preferir. A ARVO ajuda a organizar o plano e a estratégia, mas seu patrimônio permanece sob sua custódia."
                },
                {
                  q: "A ARVO investe ou movimenta o dinheiro por mim?",
                  a: "Não. A ARVO não recebe, movimenta nem mantém a custódia do seu dinheiro. Você continua no controle das decisões e da execução dos investimentos."
                },
                {
                  q: "Como a ARVO ganha dinheiro?",
                  a: "Por meio da assinatura dos clientes. A ARVO não recebe comissão pela indicação de produtos financeiros."
                },
                {
                  q: "Qual é a diferença entre a ARVO e um gerente ou assessor?",
                  a: "O modelo da ARVO não depende da venda de produtos. O trabalho começa pelos seus objetivos e pela construção do plano. Somente depois é definida uma estratégia de investimentos compatível com essa rota."
                },
                {
                  q: "Preciso entender de investimentos?",
                  a: "Não. O plano é apresentado de forma visual e em linguagem clara, para que você entenda os números e o motivo de cada decisão."
                },
                {
                  q: "Posso fazer esse planejamento sozinho?",
                  a: "Sim. Mas será necessário organizar seus dados, definir premissas, realizar projeções, calcular o aporte necessário, estruturar uma estratégia e acompanhar a evolução continuamente. A ARVO reúne esse processo em uma única metodologia e plataforma."
                },
                {
                  q: "Posso conhecer a ARVO antes de pagar?",
                  a: "Sim. Você pode começar gratuitamente pelo diagnóstico, visualizar seu cenário e entender como a plataforma funciona antes de decidir pela assinatura."
                },
                {
                  q: "A ARVO promete rentabilidade?",
                  a: "Não. A ARVO não promete resultados nem ganhos futuros. O objetivo é ajudar você a tomar decisões mais coerentes com seu perfil, seus prazos e seus objetivos."
                },
                {
                  q: "Para quem a ARVO não é indicada?",
                  a: "Para quem procura dinheiro rápido, promessa de rentabilidade, uma dica isolada de investimento ou alguém para assumir a custódia do patrimônio."
                }
              ].map((faq, idx) => (
                <div key={idx} className={`v2-faq-item ${activeFaq === idx ? "v2-faq-open" : ""}`}>
                  <button className="v2-faq-btn" onClick={() => toggleFaq(idx)}>
                    <span>{faq.q}</span>
                    <span className="v2-faq-icon">{activeFaq === idx ? "−" : "+"}</span>
                  </button>
                  {activeFaq === idx && (
                    <div className="v2-faq-body">{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="v2-section" style={{ textAlign: "center", padding: "88px 0" }}>
          <div className="v2-wrap">
            <div className="v2-eyebrow"><span className="v2-eyebrow-dot"></span> COMECE AGORA</div>
            <h2 className="v2-serif" style={{ fontSize: "clamp(34px, 4.6vw, 58px)", color: "var(--ink-navy)", margin: "0 auto 16px auto", maxWidth: "22ch", lineHeight: "1.12" }}>
              Você já começou a construir seu patrimônio.<br />
              <i style={{ color: "var(--deep-teal)", fontStyle: "italic" }}>Agora descubra se ele está levando você aonde deseja.</i>
            </h2>
            <p style={{ fontSize: "17.5px", color: "var(--text-secondary)", margin: "0 auto 32px auto", maxWidth: "48ch" }}>
              Em aproximadamente cinco minutos, você entende seu ponto de partida e começa a descobrir quanto precisa investir para alcançar seus objetivos.
            </p>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <Link href="/register" className="v2-btn v2-btn-primary" style={{ fontSize: "16px", padding: "16px 36px" }}>
                Descobrir se estou no caminho certo →
              </Link>
              <div className="v2-mono" style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                ✓ GRATUITO · ✓ SEM CARTÃO · ✓ PATRIMÔNIO SOB SEU CONTROLE
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ background: "var(--ink-navy)", color: "#ffffff", padding: "56px 0 28px 0" }}>
          <div className="v2-wrap">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "24px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "32px" }}>
              <div>
                <div className="v2-logo" style={{ color: "#ffffff", marginBottom: "6px" }}>
                  <img src="/arvo-simbolo-blue.png" alt="ARVO" style={{ width: "24px", height: "24px", objectFit: "contain" }} />
                  <span>ARVO</span>
                </div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>
                  Planejamento financeiro contínuo, com tecnologia e orientação independente.
                </div>
              </div>
              <div style={{ display: "flex", gap: "20px", fontSize: "13.5px", color: "rgba(255,255,255,0.7)" }}>
                <a href="#como-funciona" style={{ color: "inherit", textDecoration: "none" }}>Como funciona</a>
                <a href="#o-que-voce-recebe" style={{ color: "inherit", textDecoration: "none" }}>O que você recebe</a>
                <a href="#por-que-a-arvo" style={{ color: "inherit", textDecoration: "none" }}>Por que a ARVO</a>
                <a href="#planos" style={{ color: "inherit", textDecoration: "none" }}>Planos</a>
                <a href="#duvidas" style={{ color: "inherit", textDecoration: "none" }}>Dúvidas</a>
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
