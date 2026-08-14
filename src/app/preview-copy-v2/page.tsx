"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Play, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  TrendingUp, 
  Compass, 
  FileText, 
  Users, 
  Lock, 
  Award,
  HelpCircle,
  AlertCircle
} from "lucide-react";

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
          padding: 14px 30px;
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
          background: rgba(244, 241, 234, 0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
        }
        .v2-nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
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
          gap: 28px;
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
        @media (max-width: 860px) {
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
          padding: 80px 0;
          border-bottom: 1px solid var(--border);
          position: relative;
        }
        .v2-section-alt {
          background: var(--section-alt);
        }

        /* Story cards */
        .v2-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 18px;
          padding: 32px;
          box-shadow: 0 2px 12px rgba(14, 21, 17, 0.02);
        }

        /* Trilha Step Card */
        .v2-step-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 28px;
          position: relative;
          transition: transform 0.2s, border-color 0.2s;
        }
        .v2-step-card:hover {
          transform: translateY(-3px);
          border-color: var(--deep-teal);
        }
        .v2-step-num {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11.5px;
          font-weight: 600;
          color: var(--deep-teal);
          background: var(--section-alt);
          padding: 4px 10px;
          border-radius: 100px;
          display: inline-block;
          margin-bottom: 12px;
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
        {/* NAV HEADER */}
        <header className="v2-nav">
          <div className="v2-wrap v2-nav-inner">
            <Link href="/" className="v2-logo">
              <img src="/arvo-simbolo-blue.png" alt="ARVO" style={{ width: "24px", height: "24px", objectFit: "contain" }} />
              <span>ARVO</span>
            </Link>
            <nav className="v2-nav-links">
              <a href="#dor">O Problema</a>
              <a href="#metodo">Trilha ARVO</a>
              <a href="#para-quem">Para Quem É</a>
              <a href="#entregaveis">O que Você Recebe</a>
              <a href="#depoimentos">Histórias Reais</a>
              <a href="#faq">Dúvidas</a>
            </nav>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Link href="/login" className="v2-btn v2-btn-ghost" style={{ padding: "8px 16px" }}>Entrar</Link>
              <Link href="/register" className="v2-btn v2-btn-primary" style={{ padding: "10px 22px" }}>Fazer Diagnóstico →</Link>
            </div>
          </div>
        </header>

        {/* 1. HERO */}
        <section className="v2-section" style={{ paddingTop: "56px", paddingBottom: "72px" }}>
          <div className="v2-wrap" style={{ textAlign: "center", maxWidth: "900px" }}>
            <div className="v2-eyebrow">
              <span className="v2-eyebrow-dot"></span>
              DIREÇÃO FINANCEIRA INDEPENDENTE
            </div>

            <h1 className="v2-serif" style={{ fontSize: "clamp(36px, 4.8vw, 62px)", lineHeight: "1.12", color: "var(--ink-navy)", margin: "0 auto 20px auto" }}>
              Ganhar bem não é o mesmo que <i style={{ color: "var(--deep-teal)", fontStyle: "italic" }}>ter destino.</i>
            </h1>

            <p style={{ fontSize: "20px", color: "var(--text-secondary)", lineHeight: "1.55", margin: "0 auto 36px auto", maxWidth: "700px" }}>
              Existe uma forma de saber, com números, se o dinheiro que já passa pelas suas mãos está te levando pra onde você quer chegar.
            </p>

            {/* 3 Key Narrative Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px", textAlign: "left", marginBottom: "40px" }}>
              <div className="v2-card" style={{ padding: "22px 20px" }}>
                <div className="v2-mono" style={{ fontSize: "11px", color: "var(--deep-teal)", fontWeight: 600, marginBottom: "8px" }}>01 · O CUSTO DO TEMPO</div>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0, lineHeight: "1.5" }}>
                  Cada ano sem um plano claro é mais um ano de decisões tomadas no escuro, e isso fica mais caro de corrigir com o tempo. Ver o caminho todo, agora, muda o que você faz com cada real daqui pra frente.
                </p>
              </div>

              <div className="v2-card" style={{ padding: "22px 20px" }}>
                <div className="v2-mono" style={{ fontSize: "11px", color: "var(--deep-teal)", fontWeight: 600, marginBottom: "8px" }}>02 · PRODUTOS VS. ESTRATÉGIA</div>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0, lineHeight: "1.5" }}>
                  Dinheiro em produtos diferentes, comprados em momentos diferentes, raramente forma uma estratégia. Ver tudo junto muda a forma como você decide dali em diante.
                </p>
              </div>

              <div className="v2-card" style={{ padding: "22px 20px" }}>
                <div className="v2-mono" style={{ fontSize: "11px", color: "var(--deep-teal)", fontWeight: 600, marginBottom: "8px" }}>03 · ANSIEDADE POR PLANO</div>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0, lineHeight: "1.5" }}>
                  Quem não sabe quanto precisa acumular também não sabe se está perto ou longe da liberdade que quer. Ter esse número na mão troca ansiedade por plano.
                </p>
              </div>
            </div>

            {/* VIDEO PLACEHOLDER FRAME */}
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "20px", padding: "16px", maxWidth: "800px", margin: "0 auto 36px auto", boxShadow: "0 8px 30px rgba(14, 21, 17, 0.06)" }}>
              <div style={{ background: "var(--section-alt)", borderRadius: "14px", minHeight: "360px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", border: "1px dashed var(--border-strong)", padding: "32px 20px" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "var(--deep-teal)", color: "#ffffff", display: "grid", placeItems: "center", marginBottom: "16px", boxShadow: "0 4px 16px rgba(43, 110, 118, 0.35)", cursor: "pointer" }}>
                  <span style={{ fontSize: "24px", marginLeft: "4px" }}>▶</span>
                </div>
                <div className="v2-serif" style={{ fontSize: "20px", color: "var(--ink-navy)", fontWeight: 500, marginBottom: "6px" }}>
                  Como funciona o Diagnóstico e o Plano ARVO
                </div>
                <div className="v2-mono" style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Explicação em 90 segundos · Navegação dentro da plataforma
                </div>
              </div>
            </div>

            {/* CTA Hero */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <Link href="/register" className="v2-btn v2-btn-primary" style={{ fontSize: "16.5px", padding: "16px 36px" }}>
                Quero ver se meu dinheiro está no caminho certo →
              </Link>
              <div className="v2-mono" style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                ✓ 5 MINUTOS · ✓ GRATUITO · ✓ SEM CARTÃO DE CRÉDITO
              </div>
            </div>
          </div>
        </section>

        {/* 2. DOR / O EXTRATO BANCÁRIO */}
        <section className="v2-section v2-section-alt" id="dor">
          <div className="v2-wrap" style={{ maxWidth: "860px" }}>
            <div className="v2-eyebrow"><span className="v2-eyebrow-dot"></span> Dinheiro à Deriva</div>
            
            <h2 className="v2-serif" style={{ fontSize: "clamp(30px, 3.8vw, 48px)", color: "var(--ink-navy)", lineHeight: "1.15", margin: "0 0 28px 0" }}>
              O extrato bancário não organiza o futuro, <i style={{ color: "var(--deep-teal)", fontStyle: "italic" }}>só registra o passado.</i>
            </h2>

            <div style={{ fontSize: "17.5px", color: "var(--text-secondary)", lineHeight: "1.75", display: "flex", flexDirection: "column", gap: "20px" }}>
              <p style={{ margin: 0 }}>
                Você fecha o notebook depois de mais um dia inteiro respondendo mensagem de cliente, ajustando planilha, resolvendo problema de gente. Antes de dormir, abre o aplicativo do banco só pra conferir o saldo, vê os investimentos ali, alguns em CDB, outros em fundo, um pouco em ação que alguém indicou há dois anos, e fecha o aplicativo sem saber dizer se aquilo, junto, forma um plano ou só um monte de decisões separadas, tomadas em momentos diferentes por motivos diferentes.
              </p>

              {/* Focus Callout Card */}
              <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "18px", padding: "28px 28px 28px 24px", borderLeft: "4px solid var(--deep-teal)", margin: "10px 0" }}>
                <div className="v2-mono" style={{ fontSize: "12px", color: "var(--deep-teal)", fontWeight: 600, marginBottom: "8px" }}>
                  O CONCEITO
                </div>
                <div className="v2-serif" style={{ fontSize: "22px", color: "var(--ink-navy)", margin: "0 0 10px 0" }}>
                  Isso tem nome: <strong>Dinheiro à Deriva.</strong>
                </div>
                <p style={{ fontSize: "16px", color: "var(--text-secondary)", margin: 0, lineHeight: "1.65" }}>
                  É quando cada aporte, cada produto e cada troca de banco aconteceu por um motivo isolado (indicação de um amigo, oferta do gerente, notícia que viu no feed) e nunca por causa de um destino definido antes. Isso raramente tem a ver com falta de disciplina. Tem a ver com <strong>falta de rota</strong>. Dá pra ganhar bem, guardar dinheiro todo mês e ainda assim estar à deriva, porque o problema nunca foi quanto entra na conta, e sim pra onde esse dinheiro está indo.
                </p>
              </div>

              <p style={{ margin: 0 }}>
                Grande parte desse problema começa com quem dá o conselho. Boa parte do mercado financeiro ainda paga assessor e gerente por comissão de produto, não por resultado do cliente. Isso significa que a recomendação que você recebeu pode ter sido a melhor pra quem vendeu, sem ser necessariamente a melhor pra sua meta, porque quem indicou tinha outro interesse no meio.
              </p>

              <p style={{ margin: 0 }}>
                Isso aparece mais forte fora de casa. Num jantar, alguém pergunta com quanto e em que idade você pretende diminuir o ritmo de trabalho, e a resposta sai em generalidades, porque o número exato nunca foi calculado. Ou alguém comenta sobre ter usado o FGTS de um jeito que você nunca tinha ouvido falar, e a sensação é de estar sempre um passo atrás de gente que parece ter decifrado algo que você ainda não decifrou.
              </p>

              <div style={{ background: "var(--ink-navy)", color: "#ffffff", borderRadius: "16px", padding: "26px 28px", marginTop: "10px" }}>
                <div className="v2-serif" style={{ fontSize: "20px", lineHeight: "1.4" }}>
                  "O medo maior não costuma ser perder dinheiro, e sim chegar aos 50 ou 60 anos, olhar pra trás, ver que trabalhou muito e ganhou bem a vida inteira, e perceber que essa renda nunca virou a liberdade que ela poderia ter virado, porque nunca existiu um plano puxando cada decisão na mesma direção."
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. PROVA SOCIAL (1) */}
        <section className="v2-section">
          <div className="v2-wrap">
            <div style={{ textAlign: "center", maxWidth: "760px", margin: "0 auto 48px auto" }}>
              <div className="v2-eyebrow"><span className="v2-eyebrow-dot"></span> Clareza na Prática</div>
              <h2 className="v2-serif" style={{ fontSize: "clamp(28px, 3.6vw, 44px)", color: "var(--ink-navy)", margin: 0 }}>
                O que muda quando alguém finalmente vê o plano inteiro, <i style={{ color: "var(--deep-teal)", fontStyle: "italic" }}>não só os investimentos separados.</i>
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
              {[
                {
                  author: "Marina T.",
                  role: "Empresária · 38 anos",
                  text: "Tinha o dinheiro espalhado em 6 produtos diferentes, sem saber se juntos formavam uma estratégia. Em 3 semanas depois do diagnóstico, teve pela primeira vez um número exato de quanto precisava investir por mês pra se aposentar aos 55."
                },
                {
                  author: "Rafael C.",
                  role: "Engenheiro de Software · 34 anos",
                  text: "Investia havia 8 anos seguindo indicação do gerente do banco. Depois do plano, descobriu que metade da carteira estava concentrada em produtos com taxa alta e trocou a estratégia em menos de um mês."
                },
                {
                  author: "Juliana P.",
                  role: "Médica Especialista · 42 anos",
                  text: "Guardava por guardar, sem meta clara. Em 45 dias, teve resposta pra uma pergunta que evitava fazer há anos: quanto realmente precisava acumular pra manter o padrão de vida da família."
                }
              ].map((dep, idx) => (
                <div key={idx} className="v2-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: "1.65", marginBottom: "20px" }}>
                    "{dep.text}"
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

        {/* 4. CTA INTERMEDIÁRIO */}
        <section className="v2-section v2-section-alt" style={{ padding: "56px 0", textAlign: "center" }}>
          <div className="v2-wrap" style={{ maxWidth: "720px" }}>
            <h3 className="v2-serif" style={{ fontSize: "28px", color: "var(--ink-navy)", margin: "0 0 10px 0" }}>
              Se você já se reconheceu até aqui, a próxima parte é sobre como sair do <i style={{ color: "var(--deep-teal)", fontStyle: "italic" }}>Dinheiro à Deriva.</i>
            </h3>
            <p style={{ fontSize: "16px", color: "var(--text-secondary)", margin: "0 0 24px 0" }}>
              Reconhecer o padrão é o primeiro passo. O segundo é ver exatamente como sair dele.
            </p>
            <Link href="#metodo" className="v2-btn v2-btn-navy" style={{ fontSize: "15px" }}>
              Quero ver como funciona o plano ↓
            </Link>
          </div>
        </section>

        {/* 5. MÉTODO — A TRILHA ARVO */}
        <section className="v2-section" id="metodo">
          <div className="v2-wrap">
            <div style={{ textAlign: "center", maxWidth: "820px", margin: "0 auto 48px auto" }}>
              <div className="v2-eyebrow"><span className="v2-eyebrow-dot"></span> Método ARVO</div>
              <h2 className="v2-serif" style={{ fontSize: "clamp(30px, 4vw, 50px)", color: "var(--ink-navy)", margin: "0 0 16px 0", lineHeight: "1.15" }}>
                Por que ter uma boa carteira nunca foi a mesma coisa que <i style={{ color: "var(--deep-teal)", fontStyle: "italic" }}>ter um plano financeiro.</i>
              </h2>
              <p style={{ fontSize: "17px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                A Arvo existe pra resolver exatamente esse ponto: transformar decisões financeiras soltas numa rota única, com destino definido antes de qualquer investimento ser escolhido. O caminho segue uma sequência chamada <strong>Trilha Arvo</strong>, dividida em 5 etapas:
              </p>
            </div>

            {/* 5 Steps Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "40px" }}>
              {[
                { num: "01", title: "Diagnóstico", desc: "Você declara sua realidade financeira real: renda, patrimônio, dívidas, capacidade de investir por mês e os objetivos de vida que o dinheiro precisa sustentar." },
                { num: "02", title: "Destino", desc: "Os objetivos viram números. Quanto você precisa acumular, até quando, e qual renda esse patrimônio precisa sustentar quando chegar lá." },
                { num: "03", title: "Plano", desc: "A Arvo traça o caminho entre onde você está agora e o destino definido: quanto investir por mês, qual patrimônio construir em cada fase e quais ajustes fazer ao longo do tempo." },
                { num: "04", title: "Estratégia", desc: "Você recebe a carteira recomendada dentro de 4 perfis de risco (Abrigo, Ritmo, Visão e Oceano), e aplica no banco ou corretora que já usa, mantendo a custódia e o controle total do próprio dinheiro." },
                { num: "05", title: "Acompanhamento", desc: "O plano é revisado ao longo do tempo, com tecnologia organizando dados e projeções, e um especialista humano disponível pra interpretar as decisões mais importantes." },
              ].map((step, idx) => (
                <div key={idx} className="v2-step-card">
                  <div className="v2-step-num">Etapa {step.num}</div>
                  <h3 className="v2-serif" style={{ fontSize: "20px", color: "var(--ink-navy)", margin: "0 0 10px 0" }}>{step.title}</h3>
                  <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", margin: 0, lineHeight: "1.55" }}>{step.desc}</p>
                </div>
              ))}
            </div>

            {/* Inverted Logic Card */}
            <div className="v2-card" style={{ background: "var(--section-alt)", padding: "36px", marginBottom: "28px" }}>
              <h3 className="v2-serif" style={{ fontSize: "24px", color: "var(--ink-navy)", margin: "0 0 12px 0" }}>
                A lógica invertida: Primeiro o Destino, depois o Produto
              </h3>
              <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: "1.7", margin: "0 0 16px 0" }}>
                O mecanismo por trás da Trilha Arvo é simples de entender e raro de encontrar: <strong>nenhuma etapa começa pela pergunta "o que eu compro". Toda etapa começa pela pergunta "pra onde eu quero ir"</strong>, e só depois disso entra a escolha de produto. Isso inverte a ordem que a maioria das pessoas usa pra decidir sobre o próprio dinheiro, porque muda a lógica de quem vende primeiro e planeja depois.
              </p>
              <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: "1.7", margin: 0 }}>
                Na prática, tudo acontece dentro da plataforma: o diagnóstico é preenchido em poucos minutos, o destino é calculado automaticamente a partir dos objetivos declarados, e o plano gera uma trajetória mês a mês, acompanhada dentro do <strong>Painel de Rota</strong>. A Arvo não movimenta o dinheiro do cliente. A execução acontece no banco ou na corretora que o cliente já usa, o que significa que o patrimônio nunca sai do controle de quem é dono dele.
              </p>
            </div>

            {/* Founder Authority Footnote */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "18px 24px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "14px" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "var(--deep-teal)", color: "#ffffff", display: "grid", placeItems: "center", fontWeight: "bold", fontFamily: "Lora, serif" }}>
                LM
              </div>
              <div style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                <strong>Comprovado em escala:</strong> Antes de existir como plataforma, essa mesma lógica foi aplicada manualmente por Lucas Matos, fundador da Arvo, numa carteira de <strong>mais de R$ 140 milhões</strong> dentro de uma instituição financeira.
              </div>
            </div>
          </div>
        </section>

        {/* 6. PARA QUEM É / PARA QUEM NÃO É */}
        <section className="v2-section v2-section-alt" id="para-quem">
          <div className="v2-wrap">
            <div style={{ textAlign: "center", maxWidth: "760px", margin: "0 auto 48px auto" }}>
              <div className="v2-eyebrow"><span className="v2-eyebrow-dot"></span> Alinhamento Real</div>
              <h2 className="v2-serif" style={{ fontSize: "clamp(30px, 3.8vw, 46px)", color: "var(--ink-navy)", margin: 0 }}>
                A Arvo foi desenhada pra um momento financeiro específico, <i style={{ color: "var(--deep-teal)", fontStyle: "italic" }}>não pra qualquer pessoa que já investe.</i>
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              {/* Para quem é */}
              <div className="v2-card" style={{ borderTop: "4px solid var(--deep-teal)" }}>
                <div className="v2-mono" style={{ fontSize: "12px", color: "var(--deep-teal)", fontWeight: 600, marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ color: "var(--deep-teal)", fontSize: "16px" }}>✓</span> PARA QUEM É A ARVO:
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px", fontSize: "15px", color: "var(--text-secondary)" }}>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <span style={{ color: "var(--deep-teal)", fontWeight: "bold" }}>✓</span>
                    <span>Profissionais, empresários ou autônomos entre 28 e 45 anos, que já ganham bem e conseguem investir R$ 1.000 ou mais por mês.</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <span style={{ color: "var(--deep-teal)", fontWeight: "bold" }}>✓</span>
                    <span>Quem já tem patrimônio formado, mas nunca comparou se a carteira atual realmente serve pro objetivo de vida.</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <span style={{ color: "var(--deep-teal)", fontWeight: "bold" }}>✓</span>
                    <span>Quem está numa fase de vida mais complexa (casamento, filhos, troca de emprego, imóvel) e sente que a vida financeira não acompanhou essa complexidade.</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <span style={{ color: "var(--deep-teal)", fontWeight: "bold" }}>✓</span>
                    <span>Quem já foi atendido por gerente de banco ou assessor comissionado e nunca teve certeza se a indicação era pra ajudar o cliente ou pra bater meta de vendas.</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <span style={{ color: "var(--deep-teal)", fontWeight: "bold" }}>✓</span>
                    <span>Quem quer manter o controle total do próprio patrimônio, sem entregar a movimentação do dinheiro pra terceiros.</span>
                  </li>
                </ul>
              </div>

              {/* Para quem não é */}
              <div className="v2-card" style={{ borderTop: "4px solid #b33939" }}>
                <div className="v2-mono" style={{ fontSize: "12px", color: "#b33939", fontWeight: 600, marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ color: "#b33939", fontSize: "16px" }}>✕</span> PARA QUEM NÃO É:
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px", fontSize: "15px", color: "var(--text-secondary)" }}>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <span style={{ color: "#b33939", fontWeight: "bold" }}>✕</span>
                    <span>Quem está começando agora e ainda não tem capacidade de investir pelo menos R$ 1.000 por mês.</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <span style={{ color: "#b33939", fontWeight: "bold" }}>✕</span>
                    <span>Quem procura uma dica isolada de qual ação comprar essa semana.</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <span style={{ color: "#b33939", fontWeight: "bold" }}>✕</span>
                    <span>Quem não está disposto a preencher o diagnóstico com informação real.</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <span style={{ color: "#b33939", fontWeight: "bold" }}>✕</span>
                    <span>Quem quer que outra pessoa movimente o dinheiro por ele.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 7. ENTREGÁVEIS */}
        <section className="v2-section" id="entregaveis">
          <div className="v2-wrap">
            <div style={{ textAlign: "center", maxWidth: "760px", margin: "0 auto 48px auto" }}>
              <div className="v2-eyebrow"><span className="v2-eyebrow-dot"></span> Escopo Completo</div>
              <h2 className="v2-serif" style={{ fontSize: "clamp(30px, 3.8vw, 46px)", color: "var(--ink-navy)", margin: 0 }}>
                O que exatamente você recebe quando assina a Arvo, <i style={{ color: "var(--deep-teal)", fontStyle: "italic" }}>sem letra miúda.</i>
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "18px", marginBottom: "40px" }}>
              {[
                {
                  title: "Raio-X Patrimonial Completo",
                  desc: "Diagnóstico profundo de renda, patrimônio, dívidas e capacidade de investimento real.",
                  valueBadge: "Consultorias avulsas cobram R$ 400 a R$ 800 · Incluso na ARVO"
                },
                {
                  title: "Definição de Destino Financeiro",
                  desc: "Seus objetivos de vida transformados em metas numéricas, prazos e projeção de renda perpétua.",
                  valueBadge: "Planejamento certificado avulso: R$ 1.500 a R$ 3.000 · Incluso"
                },
                {
                  title: "Plano Personalizado Mês a Mês",
                  desc: "Direcionamento exato de quanto aportar e qual trajetória patrimonial construir em cada etapa.",
                  valueBadge: "Incluso na assinatura"
                },
                {
                  title: "Recomendação de Carteira por Perfil",
                  desc: "Alocação detalhada nos 4 perfis institucionais: Abrigo, Ritmo, Visão e Oceano.",
                  valueBadge: "Revisão avulsa de carteira custa R$ 300/sessão · Incluso"
                },
                {
                  title: "Painel de Rota Contínuo",
                  desc: "Dashboard inteligente para acompanhar se você está na frente ou atrás da sua meta ao longo dos meses.",
                  valueBadge: "Acesso total incluído"
                },
                {
                  title: "Revisões Periódicas do Plano",
                  desc: "Ajustes formais conforme sua vida evolui (mudança de renda, filhos, troca de emprego ou novos objetivos).",
                  valueBadge: "Incluso durante toda a assinatura"
                }
              ].map((item, idx) => (
                <div key={idx} className="v2-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <h3 className="v2-serif" style={{ fontSize: "20px", color: "var(--ink-navy)", margin: "0 0 8px 0" }}>{item.title}</h3>
                    <p style={{ fontSize: "14.5px", color: "var(--text-secondary)", lineHeight: "1.55", margin: "0 0 16px 0" }}>{item.desc}</p>
                  </div>
                  <div className="v2-mono" style={{ fontSize: "11px", color: "var(--deep-teal)", background: "var(--section-alt)", padding: "6px 12px", borderRadius: "8px", border: "1px solid var(--border)" }}>
                    ✓ {item.valueBadge}
                  </div>
                </div>
              ))}
            </div>

            {/* 8. BÔNUS */}
            <div style={{ background: "var(--section-alt)", border: "1px solid var(--border)", borderRadius: "20px", padding: "36px" }}>
              <div style={{ textAlign: "center", marginBottom: "28px" }}>
                <span className="v2-mono" style={{ fontSize: "11.5px", color: "var(--deep-teal)", fontWeight: 600 }}>ACELERAÇÃO E SUPORTE</span>
                <h3 className="v2-serif" style={{ fontSize: "26px", color: "var(--ink-navy)", margin: "4px 0 0 0" }}>
                  Além do plano, 3 coisas que aceleram a decisão nos momentos que mais pesam:
                </h3>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
                <div className="v2-card" style={{ background: "#ffffff" }}>
                  <div className="v2-mono" style={{ fontSize: "11px", color: "var(--deep-teal)", fontWeight: 600, marginBottom: "6px" }}>BÔNUS 1</div>
                  <div className="v2-serif" style={{ fontSize: "18px", color: "var(--ink-navy)", fontWeight: 600, marginBottom: "6px" }}>Segunda Opinião ARVO</div>
                  <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", margin: "0 0 12px 0" }}>Sessão avulsa com especialista não comissionado pra revisar uma decisão financeira específica.</p>
                  <div className="v2-mono" style={{ fontSize: "12px", color: "var(--text-muted)" }}>Valor de mercado: <strong style={{ color: "var(--ink-navy)" }}>R$ 350</strong></div>
                </div>

                <div className="v2-card" style={{ background: "#ffffff" }}>
                  <div className="v2-mono" style={{ fontSize: "11px", color: "var(--deep-teal)", fontWeight: 600, marginBottom: "6px" }}>BÔNUS 2</div>
                  <div className="v2-serif" style={{ fontSize: "18px", color: "var(--ink-navy)", fontWeight: 600, marginBottom: "6px" }}>Raio-X de Aposentadoria</div>
                  <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", margin: "0 0 12px 0" }}>Projeção em 3 cenários de quando e com quanto você poderá reduzir o ritmo de trabalho.</p>
                  <div className="v2-mono" style={{ fontSize: "12px", color: "var(--text-muted)" }}>Valor de mercado: <strong style={{ color: "var(--ink-navy)" }}>R$ 250</strong></div>
                </div>

                <div className="v2-card" style={{ background: "#ffffff" }}>
                  <div className="v2-mono" style={{ fontSize: "11px", color: "var(--deep-teal)", fontWeight: 600, marginBottom: "6px" }}>BÔNUS 3</div>
                  <div className="v2-serif" style={{ fontSize: "18px", color: "var(--ink-navy)", fontWeight: 600, marginBottom: "6px" }}>Checkup Anual de Carteira</div>
                  <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", margin: "0 0 12px 0" }}>Revisão completa anual com um especialista CFP® para rebalanceamento estratégico.</p>
                  <div className="v2-mono" style={{ fontSize: "12px", color: "var(--text-muted)" }}>Valor de mercado: <strong style={{ color: "var(--ink-navy)" }}>R$ 300</strong></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 9. STACK DE VALOR & PREÇO */}
        <section className="v2-section v2-section-alt" id="oferta">
          <div className="v2-wrap" style={{ maxWidth: "780px", textAlign: "center" }}>
            <div className="v2-eyebrow"><span className="v2-eyebrow-dot"></span> Transparência Absoluta</div>
            
            <h2 className="v2-serif" style={{ fontSize: "clamp(30px, 3.8vw, 48px)", color: "var(--ink-navy)", margin: "0 0 12px 0" }}>
              Somando tudo que está incluído, o valor real é bem maior que o que você paga.
            </h2>
            <p style={{ fontSize: "16px", color: "var(--text-secondary)", margin: "0 0 36px 0" }}>
              Você tem acesso ao mesmo padrão de planejamento de grandes patrimônios por uma fração do custo.
            </p>

            <div className="v2-card" style={{ border: "2px solid var(--deep-teal)", padding: "44px 36px" }}>
              <div style={{ display: "inline-block", background: "var(--section-alt)", padding: "6px 14px", borderRadius: "100px", marginBottom: "16px" }}>
                <span className="v2-mono" style={{ fontSize: "12px", color: "var(--text-muted)", textDecoration: "line-through", marginRight: "8px" }}>
                  Valor total dos componentes: R$ 3.300
                </span>
                <span className="v2-mono" style={{ fontSize: "12px", color: "var(--deep-teal)", fontWeight: 600 }}>
                  Economia de mais de 80%
                </span>
              </div>

              <h3 className="v2-serif" style={{ fontSize: "28px", color: "var(--ink-navy)", margin: "0 0 12px 0" }}>
                Plano Anual ARVO
              </h3>

              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "6px", margin: "16px 0 6px 0" }}>
                <span className="v2-serif" style={{ fontSize: "56px", fontWeight: 600, color: "var(--ink-navy)" }}>R$ 59,90</span>
                <span style={{ fontSize: "18px", color: "var(--text-muted)" }}>/ mês</span>
              </div>

              <div style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "28px" }}>
                Cobrado em 12x de R$ 59,90 ou <strong>R$ 599,00 à vista</strong> (com 2 meses grátis)
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "380px", margin: "0 auto" }}>
                <Link href="/register" className="v2-btn v2-btn-primary" style={{ fontSize: "16px", padding: "16px 32px" }}>
                  Quero começar meu diagnóstico agora →
                </Link>
                <div className="v2-mono" style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                  ✓ 5 MINUTOS · ✓ SEM CARTÃO · ✓ CANCELAMENTO QUANDO QUISER
                </div>
              </div>

              {/* 12. GARANTIA */}
              <div style={{ marginTop: "28px", paddingTop: "20px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontSize: "13.5px", color: "var(--text-secondary)" }}>
                <span style={{ fontSize: "18px" }}>🔒</span>
                <span><strong>Garantia Incondicional de 7 dias:</strong> Se assinar e achar que não é pra você, devolvemos 100% do valor. Sem pergunta, sem formulário, sem burocracia.</span>
              </div>
            </div>
          </div>
        </section>

        {/* 10. DEPOIMENTOS ANTES / VIRADA / RESULTADO */}
        <section className="v2-section" id="depoimentos">
          <div className="v2-wrap">
            <div style={{ textAlign: "center", maxWidth: "780px", margin: "0 auto 48px auto" }}>
              <div className="v2-eyebrow"><span className="v2-eyebrow-dot"></span> Casos Reais</div>
              <h2 className="v2-serif" style={{ fontSize: "clamp(30px, 3.8vw, 46px)", color: "var(--ink-navy)", margin: 0 }}>
                O que muda na prática pra quem sai do Dinheiro à Deriva e passa a <i style={{ color: "var(--deep-teal)", fontStyle: "italic" }}>seguir a Trilha Arvo.</i>
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
              {[
                {
                  name: "Rodrigo M., 36 anos",
                  role: "Sócio de Consultoria",
                  antes: "Investia havia 6 anos em produtos indicados por três gerentes de banco diferentes, sem saber se faziam sentido juntos.",
                  virada: "Fez o diagnóstico e a definição de destino, e descobriu que precisava aumentar o aporte mensal em R$ 800.",
                  resultado: "Em 4 meses, reorganizou a carteira e passou a ter uma meta numérica clara pela primeira vez em 6 anos."
                },
                {
                  name: "Camila F., 41 anos",
                  role: "Diretora de Operações",
                  antes: "Tinha patrimônio relevante formado, mas sem saber se a carteira estava adequada ao momento atual de vida.",
                  virada: "Migrou de uma estratégia passiva em Abrigo para a carteira Ritmo com proteção contra inflação.",
                  resultado: "Em 2 meses, viu a projeção de patrimônio em 15 anos mudar em mais de R$ 300 mil reais."
                },
                {
                  name: "Gustavo B., 32 anos",
                  role: "Desenvolvedor & Empreendedor",
                  antes: "Guardava dinheiro todo mês por guardar, sem saber quando ou com quanto poderia ter independência.",
                  virada: "Fez o Raio-X Patrimonial e a Definição de Destino com projeção mês a mês.",
                  resultado: "Em 45 dias, teve o plano completo e passou a saber exatamente se estava na frente ou atrás da própria meta."
                }
              ].map((caso, idx) => (
                <div key={idx} className="v2-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--section-alt)", color: "var(--deep-teal)", display: "grid", placeItems: "center", fontWeight: "bold", fontFamily: "Lora, serif" }}>
                      {caso.name.slice(0, 2)}
                    </div>
                    <div>
                      <div className="v2-serif" style={{ fontSize: "16px", fontWeight: 600, color: "var(--ink-navy)" }}>{caso.name}</div>
                      <div className="v2-mono" style={{ fontSize: "11px", color: "var(--text-muted)" }}>{caso.role}</div>
                    </div>
                  </div>

                  <div style={{ fontSize: "13.5px", lineHeight: "1.55", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ background: "rgba(14, 21, 17, 0.03)", padding: "10px 14px", borderRadius: "8px" }}>
                      <strong style={{ color: "#b33939" }}>Antes: </strong>
                      <span style={{ color: "var(--text-secondary)" }}>{caso.antes}</span>
                    </div>

                    <div style={{ background: "rgba(43, 110, 118, 0.06)", padding: "10px 14px", borderRadius: "8px" }}>
                      <strong style={{ color: "var(--deep-teal)" }}>Virada: </strong>
                      <span style={{ color: "var(--text-secondary)" }}>{caso.virada}</span>
                    </div>

                    <div style={{ background: "rgba(79, 160, 128, 0.12)", padding: "10px 14px", borderRadius: "8px" }}>
                      <strong style={{ color: "var(--accent-green)" }}>Resultado: </strong>
                      <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>{caso.resultado}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 11. SUPORTE & 13. AUTORIDADE */}
        <section className="v2-section v2-section-alt">
          <div className="v2-wrap">
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "40px", alignItems: "center" }}>
              {/* Autoridade */}
              <div>
                <div className="v2-eyebrow"><span className="v2-eyebrow-dot"></span> Quem Criou a Trilha ARVO</div>
                <h2 className="v2-serif" style={{ fontSize: "clamp(28px, 3.4vw, 42px)", color: "var(--ink-navy)", margin: "0 0 16px 0", lineHeight: "1.2" }}>
                  Metodologia construída por quem vive o mercado institucional.
                </h2>
                <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: "1.7", margin: "0 0 14px 0" }}>
                  <strong>Lucas Matos</strong>, fundador da Arvo, é planejador financeiro CFP®, certificado CPA-20, Ancord e mestre em Engenharia.
                </p>
                <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: "1.7", margin: "0 0 20px 0" }}>
                  Geriu uma carteira de <strong>mais de R$ 140 milhões</strong> dentro de uma instituição financeira de grande porte, assessorou mais de R$ 200 milhões em patrimônio ao longo da carreira e realizou mais de 300 planejamentos financeiros completos. A ARVO nasceu como a alternativa fee-only definitiva: 100% alinhada ao cliente, sem comissão por produto.
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {["CFP® Certified", "CPA-20", "Ancord", "Mestre em Engenharia", "Fee-Only Pioneer"].map((c, i) => (
                    <span key={i} className="v2-mono" style={{ background: "var(--card)", border: "1px solid var(--border)", padding: "4px 10px", borderRadius: "100px", fontSize: "11px", color: "var(--text-secondary)" }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Suporte Card */}
              <div className="v2-card" style={{ background: "#ffffff" }}>
                <span className="v2-mono" style={{ fontSize: "11px", color: "var(--deep-teal)", fontWeight: 600 }}>ACOMPANHAMENTO CONTÍNUO</span>
                <h3 className="v2-serif" style={{ fontSize: "22px", color: "var(--ink-navy)", margin: "8px 0 12px 0" }}>
                  Como funciona o suporte depois que o plano está pronto?
                </h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px", color: "var(--text-secondary)" }}>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                    <span style={{ color: "var(--deep-teal)", fontWeight: "bold" }}>✓</span>
                    <span><strong>Chat e e-mail:</strong> Resposta garantida em até 24 horas úteis para dúvidas operacionais.</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                    <span style={{ color: "var(--deep-teal)", fontWeight: "bold" }}>✓</span>
                    <span><strong>Especialista humano CFP®:</strong> Disponível para interpretar decisões estratégicas complexas.</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                    <span style={{ color: "var(--deep-teal)", fontWeight: "bold" }}>✓</span>
                    <span><strong>Revisão formal:</strong> Ajustes no plano a cada mudança relevante de renda, patrimônio ou objetivos de vida.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 14. FAQ COMPLETO (8 PERGUNTAS) */}
        <section className="v2-section" id="faq">
          <div className="v2-wrap" style={{ maxWidth: "860px" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div className="v2-eyebrow"><span className="v2-eyebrow-dot"></span> Perguntas Frequentes</div>
              <h2 className="v2-serif" style={{ fontSize: "clamp(28px, 3.6vw, 44px)", color: "var(--ink-navy)", margin: 0 }}>
                As perguntas que quase todo mundo faz antes de assinar.
              </h2>
            </div>

            <div className="v2-card" style={{ padding: "8px 28px" }}>
              {[
                {
                  q: "Quanto tempo leva para fazer o diagnóstico e ver meu plano?",
                  a: "O diagnóstico inicial leva menos de 5 minutos. Você insere seus números básicos de renda, patrimônio e aportes, e o sistema já calcula automaticamente o seu destino e a carteira recomendada."
                },
                {
                  q: "Preciso mudar de banco ou corretora para usar a ARVO?",
                  a: "Não. A ARVO não recebe, não movimenta e não mantém a custódia do seu dinheiro. Você continua investindo na XP, BTG, Itaú, NuInvest ou onde preferir. O patrimônio fica 100% sob seu controle."
                },
                {
                  q: "Como a ARVO ganha dinheiro se não recebe comissão?",
                  a: "Nossa receita vem exclusivamente da assinatura dos nossos membros (modelo fee-only). Não ganhamos um único centavo de comissão ou rebate sobre os investimentos que recomendamos, o que garante 100% de isenção e alinhamento com você."
                },
                {
                  q: "Qual a diferença entre a ARVO e o gerente do meu banco ou assessor?",
                  a: "O assessor tradicional de banco ou corretora ganha comissão sobre cada produto que vende (quanto mais caro o produto, maior o bônus dele). A ARVO cobra um valor fixo de assinatura e indica o que é melhor para sua meta, sem interesse em empurrar produtos de meta interna."
                },
                {
                  q: "Preciso ter conhecimento técnico para entender o plano?",
                  a: "Não. A plataforma traduz conceitos complexos de mercado financeiro em metas numéricas simples, diretas e acionáveis: quanto investir por mês e onde alocar por classe de ativo."
                },
                {
                  q: "Eu não posso simplesmente fazer esse planejamento sozinho?",
                  a: "Você pode tentar fazer em planilhas, mas a maioria das pessoas desiste por falta de tempo, falta de metodologia de rebalanceamento ou pela dúvida constante de se a conta está considerando inflação e impostos corretamente. A ARVO entrega isso pronto e atualizado."
                },
                {
                  q: "Como funcionam as revisões do meu plano com o tempo?",
                  a: "Sempre que sua vida mudar (troca de emprego, aumento de renda, nascimento de filhos ou compra de imóvel), você pode atualizar seus parâmetros na plataforma e solicitar uma revisão do plano."
                },
                {
                  q: "Como funciona o cancelamento e a garantia de 7 dias?",
                  a: "Se você assinar e em até 7 dias achar que a ARVO não é para você, basta solicitar o cancelamento pelo suporte ou pela plataforma para receber 100% do seu dinheiro de volta, sem burocracia."
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

        {/* 15. OFERTA FINAL & CTA */}
        <section className="v2-section v2-section-alt" style={{ textAlign: "center", padding: "88px 0" }}>
          <div className="v2-wrap" style={{ maxWidth: "780px" }}>
            <div className="v2-eyebrow"><span className="v2-eyebrow-dot"></span> Comece Hoje</div>
            <h2 className="v2-serif" style={{ fontSize: "clamp(34px, 4.6vw, 56px)", color: "var(--ink-navy)", margin: "0 auto 16px auto", lineHeight: "1.1" }}>
              Tudo que você leva ao assinar a ARVO hoje.
            </h2>
            <p style={{ fontSize: "18px", color: "var(--text-secondary)", margin: "0 auto 28px auto", maxWidth: "580px" }}>
              Diagnóstico completo + Definição de Destino + Carteira Recomendada + Painel de Rota + 3 Bônus Exclusivos.
            </p>

            <div style={{ background: "var(--card)", border: "2px solid var(--deep-teal)", borderRadius: "20px", padding: "36px 32px", maxWidth: "600px", margin: "0 auto 28px auto" }}>
              <div className="v2-mono" style={{ fontSize: "12px", color: "var(--text-muted)", textDecoration: "line-through" }}>
                Valor Total: R$ 3.300
              </div>
              <div className="v2-serif" style={{ fontSize: "44px", fontWeight: 600, color: "var(--ink-navy)", margin: "6px 0" }}>
                12x de R$ 59,90
              </div>
              <div style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "20px" }}>
                ou R$ 599,00 à vista no plano anual · Garantia incondicional de 7 dias
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                <Link href="/register" className="v2-btn v2-btn-primary" style={{ fontSize: "16.5px", padding: "16px 36px", width: "100%", maxWidth: "420px" }}>
                  Quero começar meu diagnóstico agora →
                </Link>
                <div className="v2-mono" style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                  ✓ 5 MINUTOS · ✓ SEM CARTÃO DE CRÉDITO · ✓ CANCELAMENTO QUANDO QUISER
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ background: "var(--ink-navy)", color: "#ffffff", padding: "56px 0 28px 0" }}>
          <div className="v2-wrap">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "24px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "32px" }}>
              <div className="v2-logo" style={{ color: "#ffffff" }}>
                <img src="/arvo-simbolo-blue.png" alt="ARVO" style={{ width: "24px", height: "24px", objectFit: "contain" }} />
                <span>ARVO</span>
              </div>
              <div style={{ display: "flex", gap: "24px", fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>
                <a href="#dor" style={{ color: "inherit", textDecoration: "none" }}>O Problema</a>
                <a href="#metodo" style={{ color: "inherit", textDecoration: "none" }}>Trilha ARVO</a>
                <a href="#para-quem" style={{ color: "inherit", textDecoration: "none" }}>Para Quem É</a>
                <a href="#entregaveis" style={{ color: "inherit", textDecoration: "none" }}>Entregáveis</a>
                <a href="#faq" style={{ color: "inherit", textDecoration: "none" }}>Dúvidas</a>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", paddingTop: "20px", fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
              <span>ARVO Orientação Financeira LTDA · ARVO® 2026</span>
              <span>Plataforma de orientação financeira independente (Fee-Only)</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
