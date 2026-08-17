"use client";

import { useState } from "react";
import LandingSimulator from "@/components/landing-simulator";
import Link from "next/link";

export default function PreviewCopyV3Page() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <div className="v3-theme-root">
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

        .v3-theme-root {
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

        .v3-page-frame {
          background: var(--canvas);
          border: 1px solid rgba(14, 21, 17, 0.18);
          border-radius: 24px;
          overflow: hidden;
          max-width: 1360px;
          margin: 0 auto;
          box-shadow: 0 6px 32px rgba(14, 21, 17, 0.05);
        }

        @media (min-width: 1440px) {
          .v3-theme-root { padding: 32px 48px; }
        }

        @media (max-width: 860px) {
          .v3-theme-root { padding: 0; }
          .v3-page-frame { border-radius: 0; border: none; }
        }

        .v3-theme-root * { box-sizing: border-box; }
        
        .v3-serif {
          font-family: 'Lora', Georgia, serif;
          letter-spacing: -0.015em;
        }
        
        .v3-mono {
          font-family: 'IBM Plex Mono', monospace;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .v3-wrap {
          max-width: 1140px;
          margin: 0 auto;
          padding: 0 32px;
        }
        @media (max-width: 768px) {
          .v3-wrap { padding: 0 20px; }
        }

        /* Buttons */
        .v3-btn {
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
        .v3-btn-primary {
          background: var(--deep-teal);
          color: #ffffff;
          box-shadow: 0 2px 10px rgba(43, 110, 118, 0.2);
        }
        .v3-btn-primary:hover {
          background: var(--deep-teal-hover);
          transform: translateY(-2px);
          box-shadow: 0 4px 14px rgba(43, 110, 118, 0.3);
        }
        .v3-btn-navy {
          background: var(--ink-navy);
          color: #ffffff;
        }
        .v3-btn-navy:hover {
          background: #0a1f2d;
          transform: translateY(-2px);
        }
        .v3-btn-outline {
          background: transparent;
          border: 1px solid var(--deep-teal);
          color: var(--deep-teal);
        }
        .v3-btn-outline:hover {
          background: rgba(43, 110, 118, 0.08);
        }
        .v3-btn-ghost {
          background: transparent;
          color: var(--text-primary);
        }
        .v3-btn-ghost:hover {
          color: var(--deep-teal);
        }

        /* Nav */
        .v3-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(244, 241, 234, 0.94);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
        }
        .v3-nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 66px;
        }
        .v3-logo {
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
        .v3-nav-links {
          display: flex;
          gap: 24px;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-secondary);
        }
        .v3-nav-links a {
          text-decoration: none;
          color: inherit;
          transition: color 0.2s;
        }
        .v3-nav-links a:hover {
          color: var(--deep-teal);
        }
        @media (max-width: 900px) {
          .v3-nav-links { display: none; }
        }

        /* Eyebrow badge */
        .v3-eyebrow {
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
        .v3-eyebrow-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-green);
        }

        /* Sections */
        .v3-section {
          padding: 76px 0;
          border-bottom: 1px solid var(--border);
          position: relative;
        }
        .v3-section-alt {
          background: var(--section-alt);
        }

        /* Card System */
        .v3-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 18px;
          padding: 32px;
          box-shadow: 0 2px 12px rgba(14, 21, 17, 0.02);
        }

        /* Decision Callout Card */
        .v3-decision-box {
          background: var(--card);
          border: 2px solid var(--deep-teal);
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 8px 24px rgba(43, 110, 118, 0.08);
        }

        /* FAQ */
        .v3-faq-item {
          border-bottom: 1px solid var(--border);
        }
        .v3-faq-item:last-child {
          border-bottom: none;
        }
        .v3-faq-btn {
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
        .v3-faq-btn:hover {
          color: var(--deep-teal);
        }
        .v3-faq-icon {
          font-family: monospace;
          font-size: 22px;
          color: var(--deep-teal);
          transition: transform 0.3s;
        }
        .v3-faq-open .v3-faq-icon {
          transform: rotate(45deg);
        }
        .v3-faq-body {
          color: var(--text-secondary);
          font-size: 15.5px;
          line-height: 1.65;
          padding-bottom: 22px;
        }
      `}} />

      <div className="v3-page-frame">
        {/* NAV HEADER */}
        <header className="v3-nav">
          <div className="v3-wrap v3-nav-inner">
            <Link href="/" className="v3-logo">
              <img src="/arvo-simbolo-blue.png" alt="ARVO" style={{ width: "24px", height: "24px", objectFit: "contain" }} />
              <span>ARVO</span>
            </Link>
            <nav className="v3-nav-links">
              <a href="#dor">O Problema</a>
              <a href="#metodo">Método & Decisão</a>
              <a href="#para-quem">Para Quem É</a>
              <a href="#entregaveis">O Que Recebe</a>
              <a href="#autoridade">Autoridade</a>
              <a href="#faq">Dúvidas</a>
            </nav>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Link href="/login" className="v3-btn v3-btn-ghost" style={{ padding: "8px 16px" }}>Entrar</Link>
              <Link href="/register" className="v3-btn v3-btn-primary" style={{ padding: "9px 22px" }}>Fazer diagnóstico →</Link>
            </div>
          </div>
        </header>

        {/* 1. HERO COM SIMULADOR */}
        <section className="v3-section" style={{ paddingTop: "44px", paddingBottom: "60px" }}>
          <div className="v3-wrap" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "48px", alignItems: "center" }}>
            <div>
              <div className="v3-eyebrow">
                <span className="v3-eyebrow-dot"></span>
                PLANEJAMENTO FINANCEIRO INDEPENDENTE
              </div>

              <h1 className="v3-serif" style={{ fontSize: "clamp(36px, 4.5vw, 58px)", lineHeight: "1.12", color: "var(--ink-navy)", margin: "0 0 16px 0" }}>
                Não basta investir.<br />
                <i style={{ color: "var(--deep-teal)", fontStyle: "italic" }}>É preciso ter um plano.</i>
              </h1>

              <p style={{ fontSize: "20px", color: "var(--text-secondary)", lineHeight: "1.5", margin: "0 0 28px 0", maxWidth: "42ch" }}>
                Clareza sobre onde chegar. Direção sobre o que fazer agora.
              </p>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px" }}>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <Link href="/register" className="v3-btn v3-btn-primary" style={{ fontSize: "15.5px", padding: "15px 30px" }}>
                    Descobrir se estou no caminho certo →
                  </Link>
                  <a href="#metodo" className="v3-btn v3-btn-outline" style={{ fontSize: "14.5px", padding: "14px 22px" }}>
                    Ver como funciona ↓
                  </a>
                </div>
                <div className="v3-mono" style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "4px" }}>
                  ✓ 5 MINUTOS · ✓ GRATUITO · ✓ SEM CARTÃO
                </div>
              </div>

              {/* Tagline de público */}
              <div style={{ marginTop: "28px", padding: "16px 20px", background: "var(--section-alt)", border: "1px solid var(--border)", borderRadius: "14px", fontSize: "13.5px", color: "var(--text-secondary)", lineHeight: "1.55", maxWidth: "45ch" }}>
                <strong style={{ color: "var(--ink-navy)", fontWeight: 600 }}>Para quem é a ARVO?</strong> Feito para quem investe a partir de R$ 1.000/mês ou já tem patrimônio acumulado e quer tomar decisões com mais clareza, método e independência.
              </div>
            </div>

            {/* Simulador Interativo */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <LandingSimulator />
            </div>
          </div>
        </section>

        {/* 2. DOR */}
        <section className="v3-section v3-section-alt" id="dor">
          <div className="v3-wrap" style={{ maxWidth: "880px" }}>
            <div className="v3-eyebrow"><span className="v3-eyebrow-dot"></span> O PROBLEMA</div>
            
            <h2 className="v3-serif" style={{ fontSize: "clamp(30px, 3.8vw, 46px)", color: "var(--ink-navy)", lineHeight: "1.2", margin: "0 0 24px 0" }}>
              Ter bons investimentos não significa ter um bom plano.
            </h2>

            <div style={{ fontSize: "17.5px", color: "var(--text-secondary)", lineHeight: "1.75", display: "flex", flexDirection: "column", gap: "18px" }}>
              <p style={{ margin: 0 }}>
                Dá pra fazer os aportes certos, ver o patrimônio crescer, e ainda assim não saber se aquilo, junto, forma uma estratégia ou só decisões isoladas tomadas em momentos diferentes por motivos diferentes.
              </p>

              <p style={{ margin: 0 }}>
                Isso raramente é falta de disciplina. É falta de prioridade, contexto e acompanhamento. O mercado oferece informação, produto e recomendação em excesso, e transfere pra você o trabalho de transformar tudo isso numa sequência coerente de decisões.
              </p>

              <div style={{ background: "var(--card)", borderLeft: "4px solid var(--deep-teal)", padding: "20px 24px", borderRadius: "12px", margin: "8px 0" }}>
                <p style={{ fontSize: "17px", color: "var(--ink-navy)", margin: 0, fontWeight: 500 }}>
                  Quem orienta você não deveria ganhar mais por indicar um produto. Boa parte do mercado ainda paga assessor e gerente por comissão, não por resultado do cliente.
                </p>
              </div>

              <div style={{ marginTop: "12px" }}>
                <div className="v3-mono" style={{ fontSize: "12px", color: "var(--deep-teal)", fontWeight: 600, marginBottom: "16px" }}>
                  AS PERGUNTAS QUE FICAM SEM RESPOSTA NO DIA A DIA:
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
                  {[
                    { num: "01", q: "Quanto preciso acumular pra ter liberdade?" },
                    { num: "02", q: "Quanto devo investir por mês pra chegar lá?" },
                    { num: "03", q: "Minha carteira faz sentido pros meus objetivos?" },
                    { num: "04", q: "Estou avançando na velocidade certa ou mais devagar do que deveria?" },
                  ].map((item, idx) => (
                    <div key={idx} className="v3-card" style={{ padding: "24px 20px" }}>
                      <div className="v3-mono" style={{ fontSize: "11px", color: "var(--deep-teal)", fontWeight: 600, marginBottom: "8px" }}>
                        Pergunta {item.num}
                      </div>
                      <div className="v3-serif" style={{ fontSize: "17px", color: "var(--ink-navy)", lineHeight: "1.4" }}>
                        {item.q}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. MÉTODO & SUA PRÓXIMA MELHOR DECISÃO */}
        <section className="v3-section" id="metodo">
          <div className="v3-wrap">
            <div style={{ maxWidth: "840px", margin: "0 auto 40px auto", textAlign: "center" }}>
              <div className="v3-eyebrow"><span className="v3-eyebrow-dot"></span> MÉTODO ARVO</div>
              <h2 className="v3-serif" style={{ fontSize: "clamp(30px, 3.8vw, 48px)", color: "var(--ink-navy)", margin: "0 0 16px 0", lineHeight: "1.15" }}>
                Direção contínua: o que fazer agora e o que vem depois.
              </h2>
              <p style={{ fontSize: "17.5px", color: "var(--text-secondary)", lineHeight: "1.65", margin: 0 }}>
                Um plano financeiro só tem valor quando ajuda você a decidir o que fazer agora e permite acompanhar o que acontece depois. Por isso a experiência responde, continuamente, quatro perguntas: <strong>onde você está, onde quer chegar, qual é a distância, e qual é sua próxima melhor decisão.</strong>
              </p>
            </div>

            {/* Destaque: Sua próxima melhor decisão */}
            <div style={{ maxWidth: "800px", margin: "0 auto 40px auto" }}>
              <div style={{ fontSize: "15px", color: "var(--text-muted)", textAlign: "center", marginBottom: "14px", fontStyle: "italic" }}>
                Em vez de mostrar doze problemas, oito recomendações e quatro carteiras ao mesmo tempo, o plano prioriza. Assim:
              </div>

              <div className="v3-decision-box">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "16px", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
                  <div className="v3-mono" style={{ fontSize: "12px", color: "var(--deep-teal)", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-green)" }}></span>
                    SUA PRÓXIMA MELHOR DECISÃO
                  </div>
                  <span className="v3-mono" style={{ fontSize: "11px", color: "var(--text-muted)", background: "var(--section-alt)", padding: "4px 10px", borderRadius: "100px" }}>
                    Etapa 1 de 3 em andamento
                  </span>
                </div>

                <h3 className="v3-serif" style={{ fontSize: "24px", color: "var(--ink-navy)", margin: "0 0 14px 0", lineHeight: "1.25" }}>
                  Complete sua reserva de segurança antes de aumentar o risco da carteira.
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", background: "var(--section-alt)", padding: "18px 20px", borderRadius: "14px", marginBottom: "18px" }}>
                  <div>
                    <div className="v3-mono" style={{ fontSize: "11px", color: "var(--text-muted)" }}>RESERVA ATUAL</div>
                    <div className="v3-serif" style={{ fontSize: "20px", color: "var(--ink-navy)", fontWeight: 600 }}>R$ 18.000</div>
                  </div>
                  <div>
                    <div className="v3-mono" style={{ fontSize: "11px", color: "var(--text-muted)" }}>RECOMENDADO</div>
                    <div className="v3-serif" style={{ fontSize: "20px", color: "var(--deep-teal)", fontWeight: 600 }}>R$ 30.000</div>
                  </div>
                  <div>
                    <div className="v3-mono" style={{ fontSize: "11px", color: "var(--text-muted)" }}>DIRECIONAMENTO</div>
                    <div className="v3-serif" style={{ fontSize: "20px", color: "var(--ink-navy)", fontWeight: 600 }}>R$ 3.000 / mês</div>
                  </div>
                </div>

                <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: "1.6", margin: 0 }}>
                  <strong>Previsão para conclusão: quatro meses.</strong> Depois disso, os novos aportes vão automaticamente para o seu objetivo de longo prazo.
                </p>
              </div>
            </div>

            {/* Ciclo Contínuo */}
            <div style={{ maxWidth: "800px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div className="v3-card">
                <div className="v3-mono" style={{ fontSize: "11px", color: "var(--deep-teal)", fontWeight: 600, marginBottom: "8px" }}>CICLO DE EVOLUÇÃO</div>
                <p style={{ fontSize: "14.5px", color: "var(--text-secondary)", margin: 0, lineHeight: "1.6" }}>
                  Isso se repete em ciclo: você executa, acompanha, ajusta, e a plataforma aponta a próxima decisão que mais importa naquele momento, não uma lista infinita de pendências.
                </p>
              </div>

              <div className="v3-card">
                <div className="v3-mono" style={{ fontSize: "11px", color: "var(--deep-teal)", fontWeight: 600, marginBottom: "8px" }}>CUSTÓDIA E EXECUÇÃO</div>
                <p style={{ fontSize: "14.5px", color: "var(--text-secondary)", margin: 0, lineHeight: "1.6" }}>
                  A estratégia de investimentos entra dentro desse ciclo, com recomendação de carteira entre 4 perfis (<strong>Abrigo, Ritmo, Visão e Oceano</strong>), aplicada no banco ou corretora que você já usa. A execução e a custódia continuam sempre com você.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. PARA QUEM É / PARA QUEM NÃO É */}
        <section className="v3-section v3-section-alt" id="para-quem">
          <div className="v3-wrap" style={{ maxWidth: "840px" }}>
            <div style={{ textAlign: "center", marginBottom: "36px" }}>
              <div className="v3-eyebrow"><span className="v3-eyebrow-dot"></span> PERFIL & MOMENTO</div>
              <h2 className="v3-serif" style={{ fontSize: "clamp(28px, 3.6vw, 42px)", color: "var(--ink-navy)", margin: 0 }}>
                Para quem é / Para quem não é
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "20px" }}>
              <div className="v3-card" style={{ borderTop: "4px solid var(--deep-teal)" }}>
                <div className="v3-mono" style={{ fontSize: "12px", color: "var(--deep-teal)", fontWeight: 600, marginBottom: "12px" }}>
                  ✓ PARA QUEM É A ARVO:
                </div>
                <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: "1.65", margin: 0 }}>
                  Feito pra quem investe a partir de R$ 1.000 por mês ou já tem patrimônio acumulado, tomou decisões financeiras isoladas ao longo do tempo, e quer decisão com mais clareza, método e independência. Você não precisa gostar nem entender profundamente de investimentos, só quer saber se está no caminho certo, quanto precisa acumular e qual é o próximo passo.
                </p>
              </div>

              <div className="v3-card" style={{ borderTop: "4px solid #b33939" }}>
                <div className="v3-mono" style={{ fontSize: "12px", color: "#b33939", fontWeight: 600, marginBottom: "12px" }}>
                  ✕ PARA QUEM NÃO É:
                </div>
                <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: "1.65", margin: 0 }}>
                  Não é pra quem procura dinheiro rápido, promessa de rentabilidade ou a ação da vez.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. ENTREGÁVEIS & DIFERENCIAL */}
        <section className="v3-section" id="entregaveis">
          <div className="v3-wrap">
            <div style={{ textAlign: "center", maxWidth: "780px", margin: "0 auto 48px auto" }}>
              <div className="v3-eyebrow"><span className="v3-eyebrow-dot"></span> ESCOPO COMPLETO</div>
              <h2 className="v3-serif" style={{ fontSize: "clamp(30px, 3.8vw, 46px)", color: "var(--ink-navy)", margin: 0 }}>
                O que você recebe na ARVO
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "18px", marginBottom: "40px" }}>
              {[
                { title: "Diagnóstico completo (Raio-X financeiro)", desc: "Onde você está agora: renda, patrimônio, dívidas, capacidade de investir." },
                { title: "Objetivo traduzido em número", desc: "Quanto precisa acumular, até quando, qual renda sustentar." },
                { title: "Sua próxima melhor decisão", desc: "Não uma lista de pendências, a decisão que mais importa agora." },
                { title: "Plano com prazos claros", desc: "O que fazer agora, nos próximos 30 dias e nos próximos 90 dias." },
                { title: "Estratégia de investimentos", desc: "Carteira conectada ao plano, dentro do seu perfil de risco." },
                { title: "Painel de evolução", desc: "Aporte planejado versus realizado, progresso de cada objetivo." },
                { title: "Acompanhamento humano", desc: "Especialista disponível quando a decisão exigir contexto e interpretação." },
              ].map((ent, idx) => (
                <div key={idx} className="v3-card" style={{ padding: "26px 22px" }}>
                  <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "var(--section-alt)", color: "var(--deep-teal)", display: "grid", placeItems: "center", fontWeight: "bold", fontSize: "12px", marginBottom: "12px" }}>
                    ✓
                  </div>
                  <h3 className="v3-serif" style={{ fontSize: "18px", color: "var(--ink-navy)", margin: "0 0 6px 0" }}>{ent.title}</h3>
                  <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0, lineHeight: "1.55" }}>{ent.desc}</p>
                </div>
              ))}
            </div>

            {/* Diferencial de Independência */}
            <div style={{ background: "var(--ink-navy)", color: "#ffffff", borderRadius: "18px", padding: "32px 36px", textAlign: "center" }}>
              <div className="v3-mono" style={{ fontSize: "11.5px", color: "var(--accent-green)", fontWeight: 600, marginBottom: "8px" }}>
                DIFERENCIAL DE INDEPENDÊNCIA
              </div>
              <div className="v3-serif" style={{ fontSize: "22px", lineHeight: "1.4", maxWidth: "48ch", margin: "0 auto" }}>
                100% fee-only, sem comissão por produto. Você não muda de banco nem de corretora. O patrimônio continua sempre sob seu controle. O plano é contínuo, não uma foto única do dia da compra.
              </div>
            </div>
          </div>
        </section>

        {/* 6. DEPOIMENTOS */}
        <section className="v3-section v3-section-alt">
          <div className="v3-wrap">
            <div style={{ textAlign: "center", maxWidth: "760px", margin: "0 auto 44px auto" }}>
              <div className="v3-eyebrow"><span className="v3-eyebrow-dot"></span> HISTÓRIAS REAIS</div>
              <h2 className="v3-serif" style={{ fontSize: "clamp(28px, 3.6vw, 44px)", color: "var(--ink-navy)", margin: 0 }}>
                O impacto de ter uma rota definida
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
              {[
                {
                  author: "Marina T.",
                  role: "Empresária · 38 anos",
                  antes: "Tinha dinheiro distribuído em vários investimentos, sem saber se formavam uma estratégia.",
                  depois: "Definiu a meta exata de aporte mensal e a rota de aposentadoria com prazos numéricos claros."
                },
                {
                  author: "Rafael C.",
                  role: "Engenheiro · 42 anos",
                  antes: "Investia seguindo recomendações pontuais, sem enxergar o patrimônio como um todo.",
                  depois: "Identificou taxas excessivas nos produtos antigos e reestruturou a carteira de acordo com o plano."
                },
                {
                  author: "Rodrigo M.",
                  role: "Sócio de consultoria · 36 anos",
                  antes: "Investia havia anos, sem meta numérica.",
                  depois: "Descobriu o aporte necessário e passou a acompanhar mês a mês se estava dentro da trajetória."
                }
              ].map((dep, idx) => (
                <div key={idx} className="v3-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div style={{ fontSize: "14px", lineHeight: "1.6", display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                    <div style={{ background: "rgba(14, 21, 17, 0.03)", padding: "10px 12px", borderRadius: "8px" }}>
                      <strong style={{ color: "#b33939" }}>Antes: </strong>
                      <span style={{ color: "var(--text-secondary)" }}>{dep.antes}</span>
                    </div>
                    <div style={{ background: "rgba(43, 110, 118, 0.06)", padding: "10px 12px", borderRadius: "8px" }}>
                      <strong style={{ color: "var(--deep-teal)" }}>Depois: </strong>
                      <span style={{ color: "var(--text-secondary)" }}>{dep.depois}</span>
                    </div>
                  </div>

                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--section-alt)", color: "var(--deep-teal)", display: "grid", placeItems: "center", fontWeight: "bold", fontFamily: "Lora, serif" }}>
                      {dep.author.slice(0, 2)}
                    </div>
                    <div>
                      <div className="v3-serif" style={{ fontSize: "15px", fontWeight: 600, color: "var(--ink-navy)" }}>{dep.author}</div>
                      <div className="v3-mono" style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>{dep.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. AUTORIDADE */}
        <section className="v3-section" id="autoridade">
          <div className="v3-wrap">
            <div style={{ display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: "44px", alignItems: "center" }}>
              <div className="v3-card" style={{ textAlign: "center", padding: "36px 28px" }}>
                <div style={{ width: "76px", height: "76px", borderRadius: "50%", background: "var(--deep-teal)", color: "#ffffff", display: "grid", placeItems: "center", fontSize: "26px", fontFamily: "Lora, serif", margin: "0 auto 16px auto" }}>
                  LM
                </div>
                <h3 className="v3-serif" style={{ fontSize: "24px", color: "var(--ink-navy)", margin: "0 0 4px 0" }}>Lucas Matos, CFP®</h3>
                <div className="v3-mono" style={{ fontSize: "12px", color: "var(--deep-teal)", fontWeight: 600 }}>Fundador da ARVO</div>
                <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid var(--border)", display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap" }}>
                  {["CFP®", "CPA-20", "Ancord", "Mestre em Engenharia"].map((c, i) => (
                    <span key={i} className="v3-mono" style={{ background: "var(--section-alt)", border: "1px solid var(--border)", padding: "4px 10px", borderRadius: "100px", fontSize: "11px", color: "var(--text-secondary)" }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="v3-eyebrow"><span className="v3-eyebrow-dot"></span> FUNDADOR & METODOLOGIA</div>
                <h2 className="v3-serif" style={{ fontSize: "clamp(28px, 3.4vw, 42px)", color: "var(--ink-navy)", margin: "0 0 16px 0", lineHeight: "1.2" }}>
                  Construído para inverter a ordem entre produto e plano.
                </h2>
                <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: "1.7", margin: "0 0 14px 0" }}>
                  Lucas Matos é planejador financeiro CFP®, com certificações CPA-20 e Ancord e mestrado em Engenharia. Geriu uma carteira de <strong>mais de R$ 140 milhões</strong> dentro de uma instituição financeira, assessorou mais de R$ 200 milhões em patrimônio ao longo da carreira e realizou mais de 300 planejamentos financeiros completos.
                </p>
                <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: "1.7", margin: 0 }}>
                  A ARVO nasceu pra inverter a ordem entre produto e plano: foi de dentro de uma instituição comissionada que Lucas viu o conflito entre o que é bom pra quem vende e o que é bom pra quem investe.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. OFERTA & GARANTIA */}
        <section className="v3-section v3-section-alt" id="oferta">
          <div className="v3-wrap" style={{ maxWidth: "720px", textAlign: "center" }}>
            <div className="v3-eyebrow"><span className="v3-eyebrow-dot"></span> ACESSO COMPLETO</div>
            
            <h2 className="v3-serif" style={{ fontSize: "clamp(30px, 3.8vw, 48px)", color: "var(--ink-navy)", margin: "0 0 12px 0" }}>
              Plano ARVO
            </h2>
            <p style={{ fontSize: "16px", color: "var(--text-secondary)", margin: "0 0 32px 0" }}>
              Direção, plano personalizado e acompanhamento contínuo.
            </p>

            <div className="v3-card" style={{ border: "2px solid var(--deep-teal)", padding: "40px 32px" }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "6px", margin: "0 0 6px 0" }}>
                <span className="v3-serif" style={{ fontSize: "52px", fontWeight: 600, color: "var(--ink-navy)" }}>R$ 59,90</span>
                <span style={{ fontSize: "18px", color: "var(--text-muted)" }}>/ mês</span>
              </div>
              <div style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "24px" }}>
                Cobrado em 12 parcelas de R$ 59,90 ou <strong>R$ 599,00 à vista</strong>
              </div>

              <div style={{ textAlign: "left", maxWidth: "460px", margin: "0 auto 28px auto" }}>
                <div className="v3-mono" style={{ fontSize: "11px", color: "var(--deep-teal)", fontWeight: 600, marginBottom: "10px" }}>
                  O QUE ESTÁ INCLUÍDO:
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", color: "var(--text-secondary)" }}>
                  {[
                    "Diagnóstico financeiro completo",
                    "Plano personalizado com metas numéricas",
                    "Sua próxima melhor decisão prioritária",
                    "Estratégia de investimentos por perfil",
                    "Painel de evolução contínua",
                    "Acompanhamento humano quando necessário"
                  ].map((it, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "var(--deep-teal)", fontWeight: "bold" }}>✓</span> {it}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                <Link href="/register" className="v3-btn v3-btn-primary" style={{ fontSize: "16px", padding: "16px 36px", width: "100%", maxWidth: "380px" }}>
                  Fazer meu diagnóstico gratuito →
                </Link>
                <div className="v3-mono" style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  ✓ 5 MINUTOS · ✓ SEM CARTÃO · ✓ CUSTÓDIA NO SEU BANCO
                </div>
              </div>

              {/* Garantia */}
              <div style={{ marginTop: "28px", paddingTop: "20px", borderTop: "1px solid var(--border)", textAlign: "left", fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                <strong style={{ color: "var(--ink-navy)" }}>🔒 Garantia incondicional de 7 dias:</strong> Você testa o diagnóstico e o plano completo, e se em qualquer momento dentro desses 7 dias decidir que não faz sentido pra você, devolvemos 100% do valor. Sem pergunta, sem formulário, sem burocracia.
              </div>
            </div>
          </div>
        </section>

        {/* 9. FAQ (8 PERGUNTAS) */}
        <section className="v3-section" id="faq">
          <div className="v3-wrap" style={{ maxWidth: "860px" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div className="v3-eyebrow"><span className="v3-eyebrow-dot"></span> PERGUNTAS FREQUENTES</div>
              <h2 className="v3-serif" style={{ fontSize: "clamp(28px, 3.6vw, 44px)", color: "var(--ink-navy)", margin: 0 }}>
                Dúvidas frequentes
              </h2>
            </div>

            <div className="v3-card" style={{ padding: "8px 28px" }}>
              {[
                {
                  q: "Preciso tirar meus investimentos do meu banco?",
                  a: "Não. Você mantém o controle onde preferir, a ARVO não movimenta seu dinheiro."
                },
                {
                  q: "A ARVO investe ou movimenta o dinheiro por mim?",
                  a: "Não. Você executa as decisões, a ARVO orienta."
                },
                {
                  q: "Como a ARVO ganha dinheiro?",
                  a: "Só pela assinatura dos clientes. Não depende de comissão de produto."
                },
                {
                  q: "Qual a diferença entre a ARVO e o gerente do meu banco?",
                  a: "O gerente costuma ganhar comissão sobre o que vende. A ARVO é fee-only: a única receita é a assinatura."
                },
                {
                  q: "Preciso entender de investimentos pra usar?",
                  a: "Não. O diagnóstico pede informação sobre sua vida financeira, não termos técnicos."
                },
                {
                  q: "A ARVO promete rentabilidade?",
                  a: "Não. Nenhuma estratégia de investimento tem retorno garantido. O que a ARVO entrega é clareza sobre o plano e a próxima decisão, não promessa de retorno."
                },
                {
                  q: "Posso conhecer antes de pagar?",
                  a: "Sim. O diagnóstico é gratuito, leva cerca de 5 minutos e não pede cartão."
                },
                {
                  q: "Pra quem a ARVO não é indicada?",
                  a: "Pra quem procura dinheiro rápido, promessa de rentabilidade ou a ação da vez."
                }
              ].map((faq, idx) => (
                <div key={idx} className={`v3-faq-item ${activeFaq === idx ? "v3-faq-open" : ""}`}>
                  <button className="v3-faq-btn" onClick={() => toggleFaq(idx)}>
                    <span>{faq.q}</span>
                    <span className="v3-faq-icon">{activeFaq === idx ? "−" : "+"}</span>
                  </button>
                  {activeFaq === idx && (
                    <div className="v3-faq-body">{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 10. CTA FINAL */}
        <section className="v3-section v3-section-alt" style={{ textAlign: "center", padding: "88px 0" }}>
          <div className="v3-wrap">
            <div className="v3-eyebrow"><span className="v3-eyebrow-dot"></span> COMECE AGORA</div>
            <h2 className="v3-serif" style={{ fontSize: "clamp(34px, 4.6vw, 58px)", color: "var(--ink-navy)", margin: "0 auto 16px auto", maxWidth: "22ch", lineHeight: "1.12" }}>
              Você já começou a construir seu patrimônio.<br />
              <i style={{ color: "var(--deep-teal)", fontStyle: "italic" }}>Agora descubra se ele está te levando aonde você quer chegar.</i>
            </h2>
            <p style={{ fontSize: "17.5px", color: "var(--text-secondary)", margin: "0 auto 32px auto", maxWidth: "48ch" }}>
              Em aproximadamente cinco minutos, você entende seu ponto de partida e descobre qual é sua próxima melhor decisão financeira.
            </p>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <Link href="/register" className="v3-btn v3-btn-primary" style={{ fontSize: "16px", padding: "16px 36px" }}>
                Fazer meu diagnóstico gratuito →
              </Link>
              <div className="v3-mono" style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                ✓ 5 MINUTOS · ✓ GRATUITO · ✓ SEM CARTÃO
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ background: "var(--ink-navy)", color: "#ffffff", padding: "56px 0 28px 0" }}>
          <div className="v3-wrap">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "24px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "32px" }}>
              <div>
                <div className="v3-logo" style={{ color: "#ffffff", marginBottom: "6px" }}>
                  <img src="/arvo-simbolo-blue.png" alt="ARVO" style={{ width: "24px", height: "24px", objectFit: "contain" }} />
                  <span>ARVO</span>
                </div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>
                  Planejamento financeiro contínuo, com tecnologia e orientação independente.
                </div>
              </div>
              <div style={{ display: "flex", gap: "20px", fontSize: "13.5px", color: "rgba(255,255,255,0.7)" }}>
                <a href="#dor" style={{ color: "inherit", textDecoration: "none" }}>O Problema</a>
                <a href="#metodo" style={{ color: "inherit", textDecoration: "none" }}>Método</a>
                <a href="#para-quem" style={{ color: "inherit", textDecoration: "none" }}>Para Quem É</a>
                <a href="#entregaveis" style={{ color: "inherit", textDecoration: "none" }}>Entregáveis</a>
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
