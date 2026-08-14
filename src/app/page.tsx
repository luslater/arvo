"use client";

import { useEffect } from "react";
import LandingSimulator from "@/components/landing-simulator"
import { PerformanceChart } from "@/components/performance-chart"
import Head from "next/head";
import Link from "next/link";

export default function LandingPage() {
  useEffect(() => {
    const handleFaqClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const btn = target.closest('.faq-btn');
      if (!btn) return;
      
      const item = btn.closest('.faq-item');
      if (!item) return;
      
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) {
        item.classList.add('open');
      }
    };

    document.addEventListener('click', handleFaqClick);
    return () => document.removeEventListener('click', handleFaqClick);
  }, []);

  return (
    <div className="landing-page light" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style dangerouslySetInnerHTML={{
        __html: `
                
  .landing-page {
    --bg: #0b0f14;
    --bg-2: #0e1319;
    --bg-3: #131922;
    --ink: #ece7db;        /* warm off-white cream */
    --ink-2: #c9c3b4;
    --ink-3: #8a8577;
    --ink-4: #555246;
    --rule: rgba(236,231,219,.10);
    --rule-strong: rgba(236,231,219,.22);
    --card: #141a22;
    --accent: #2B6E76;      /* brand-teal */
    --accent-2: #4FA080;    /* ARVO green (secondary) */
    --accent-deep: #1b4f8a; /* darker blue */
  }
  .landing-page.light {
    --bg: #f4f1ea;
    --bg-2: #ecebe2;
    --bg-3: #e3e1d4;
    --ink: #0e1511;
    --ink-2: #2a332d;
    --ink-3: #5a635c;
    --ink-4: #8a918a;
    --rule: rgba(14,21,17,.10);
    --rule-strong: rgba(14,21,17,.26);
    --card: #fbfaf5;
  }

  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; scroll-padding-top: 72px; }
  .landing-page { margin: 0; padding: 0; background: var(--bg); color: var(--ink); }
  .landing-page {
    font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
    font-size: 16px; line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    font-feature-settings: "ss01", "ss02";
  }
  .display {
    font-family: 'Sora', 'Space Grotesk', sans-serif;
    font-weight: 300;
    letter-spacing: -.028em;
  }
  .mono { font-family: 'JetBrains Mono', ui-monospace, Menlo, monospace; }
  .tab { font-variant-numeric: tabular-nums; }

  a { color: inherit; text-decoration: none; }
  button { font: inherit; color: inherit; border: 0; background: none; cursor: pointer; }

  .wrap { max-width: 1360px; margin: 0 auto; padding: 0 40px; }
  @media (max-width: 720px) { .wrap { padding: 0 20px; } }

  .eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; letter-spacing: .16em;
    text-transform: uppercase; color: var(--ink-3);
  }
  .eyebrow .dot {
    display: inline-block; width: 6px; height: 6px; border-radius: 999px;
    background: var(--accent); margin-right: 10px; vertical-align: 1px;
    box-shadow: 0 0 12px 0 var(--accent);
  }

  /* Buttons */
  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 14px 22px; border-radius: 12px;
    font-weight: 500; font-size: 14px; letter-spacing: -.01em;
    transition: transform .2s, background .2s, color .2s, border-color .2s;
  }
  .btn-primary { background: var(--ink); color: var(--bg); }
  .btn-primary:hover { background: var(--ink-2); }
  .btn-accent { background: var(--accent); color: #ffffff; }
  .btn-accent:hover { filter: brightness(1.08); color: #ffffff; }
  .btn-ghost { color: var(--ink); border: 1px solid var(--rule-strong); }
  .btn-ghost:hover { background: var(--ink); color: var(--bg); border-color: var(--ink); }
  .plan .btn-ghost, .compare .col.arvo .btn-ghost { color: #fff; border-color: rgba(255,255,255,.32); }
  .plan .btn-ghost:hover, .compare .col.arvo .btn-ghost:hover { background: #fff; color: #1a1308; border-color: #fff; }

  /* ---------- NAV ---------- */
  .nav {
    position: sticky; top: 0; z-index: 40;
    background: color-mix(in oklab, var(--bg) 82%, transparent);
    backdrop-filter: blur(16px) saturate(140%);
    -webkit-backdrop-filter: blur(16px) saturate(140%);
    border-bottom: 1px solid var(--rule);
  }
  .nav-inner { display: flex; align-items: center; justify-content: space-between; height: 64px; }
  .logo { display: flex; align-items: center; gap: 12px; font-family: 'Sora', sans-serif; font-weight: 600; font-size: 18px; letter-spacing: .08em; }
  .logo-mark { width: 24px; height: 24px; display: grid; place-items: center; }
  .nav-links { display: flex; gap: 36px; font-size: 13px; color: var(--ink-2); font-weight: 400; }
  .nav-links a:hover { color: var(--accent); }
  .nav-cta { display: flex; align-items: center; gap: 8px; }
  .nav-cta .btn { padding: 9px 15px; font-size: 12.5px; }
  @media (max-width: 900px) { .nav-links { display: none; } }

  /* ---------- HERO ---------- */
  .hero {
    padding: 16px 0 32px; border-bottom: 1px solid var(--rule);
    position: relative; overflow: hidden;
  }
  .hero::before {
    content: ""; position: absolute; inset: 0;
    background:
      radial-gradient(1000px 500px at 85% -10%, rgba(201,169,97,.10), transparent 60%),
      radial-gradient(800px 400px at -10% 110%, rgba(0,196,106,.05), transparent 60%);
    pointer-events: none;
  }
  .hero-grid {
    display: grid; grid-template-columns: 1.15fr .85fr; gap: 48px; align-items: center;
    position: relative;
  }
  @media (max-width: 980px) { .hero-grid { grid-template-columns: 1fr; gap: 32px; } }

  .hero h1 {
    font-family: 'Sora', sans-serif;
    font-weight: 300;
    font-size: clamp(32px, 4vw, 56px);
    line-height: .98; letter-spacing: -.03em;
    margin: 24px 0 0; color: var(--ink);
  }
  .hero h1 b { font-weight: 500; color: var(--accent); }
  .hero-sub {
    margin: 16px 0 0; font-size: 16px; line-height: 1.5; color: var(--ink-2);
    max-width: 46ch; font-weight: 400;
  }
  .hero-bullets {
    margin: 16px 0 0; padding: 0; list-style: none;
    display: flex; flex-direction: column; gap: 8px;
    font-size: 12.5px; color: var(--ink-2);
  }
  .hero-bullets li { display: flex; align-items: center; gap: 12px; }
  .hero-bullets .chk {
    width: 18px; height: 18px; border-radius: 999px; background: transparent;
    border: 1px solid var(--accent);
    display: grid; place-items: center; flex: 0 0 auto;
  }
  .hero-bullets .chk svg { width: 9px; height: 9px; color: var(--accent); }
  .hero-cta { margin-top: 20px; display: flex; gap: 12px; flex-wrap: wrap; }

  /* hero right — composite panel */
  .hero-panel {
    background: linear-gradient(180deg, var(--card), var(--bg-2));
    border: 1px solid var(--rule);
    border-radius: 14px; padding: 28px; position: relative;
    box-shadow: 0 16px 40px rgba(0,0,0,.15), inset 0 1px 0 rgba(255,255,255,.04);
  }
  .hp-top {
    display: flex; align-items: center; justify-content: space-between;
    font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: .14em;
    text-transform: uppercase; color: var(--ink-3);
    padding-bottom: 18px; border-bottom: 1px solid var(--rule);
  }
  .hp-top .live { display: inline-flex; align-items: center; gap: 6px; color: var(--accent-2); }
  .hp-top .live i { width: 6px; height: 6px; border-radius: 999px; background: var(--accent-2); box-shadow: 0 0 8px var(--accent-2); animation: pulse 1.6s ease-in-out infinite; }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .3; } }

  .hp-value { margin: 20px 0 6px; }
  .hp-value .amount {
    font-family: 'Sora', sans-serif; font-weight: 300;
    font-size: 64px; line-height: 1; letter-spacing: -.03em;
  }
  .hp-value .amount .pct { color: var(--accent); }
  .hp-cap { font-size: 13px; color: var(--ink-3); }

  .hp-chart { margin: 18px -8px 0; }
  .hp-chart svg { width: 100%; height: 84px; display: block; }

  .hp-rows { margin-top: 18px; padding-top: 18px; border-top: 1px solid var(--rule); }
  .hp-row {
    display: grid; grid-template-columns: 1fr 100px 70px; align-items: center; gap: 14px;
    padding: 9px 0; font-size: 13px;
  }
  .hp-row .name { color: var(--ink-2); display: flex; align-items: center; gap: 10px; }
  .hp-row .name i { width: 7px; height: 7px; border-radius: 2px; display: inline-block; }
  .hp-row .bar { height: 3px; background: var(--rule); border-radius: 999px; overflow: hidden; }
  .hp-row .bar em { display:block; height:100%; background: var(--accent); border-radius: 999px; font-style: normal; }
  .hp-row .val { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--accent); text-align: right; }
  .hp-row.bench .val, .hp-row.bench .bar em { color: var(--ink-4); background: var(--ink-4); }

  /* Ticker */
  .ticker {
    border-top: 1px solid var(--rule);
    border-bottom: 1px solid var(--rule);
    overflow: hidden; background: var(--bg-2);
  }
  .ticker-inner {
    display: flex; gap: 56px; padding: 16px 0; white-space: nowrap;
    animation: ticker 80s linear infinite;
    font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--ink-3);
  }
  .ticker-inner span b { color: var(--ink); font-weight: 500; margin-right: 10px; letter-spacing: .04em; }
  .ticker-inner .up { color: var(--accent); }
  @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }

  /* Section scaffolding */
  .section { padding: 60px 0; border-bottom: 1px solid var(--rule); position: relative; }
  .section-head {
    display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: end;
    margin-bottom: 48px;
  }
  @media (max-width: 900px) { .section-head { grid-template-columns: 1fr; gap: 24px; } }
  .section-head h2 {
    font-family: 'Sora', sans-serif; font-weight: 300;
    font-size: clamp(36px, 4.6vw, 64px); line-height: 1; letter-spacing: -.025em;
    margin: 14px 0 0; max-width: 15ch;
  }
  .section-head h2 b { font-weight: 500; color: var(--accent); }
  .section-head .lede { font-size: 16px; color: var(--ink-2); max-width: 42ch; line-height: 1.6; }

  /* ---------- PERFORMANCE CHART ---------- */
  .perf-block { display: grid; grid-template-columns: 1.2fr 1fr; gap: 32px; align-items: stretch; }
  @media (max-width: 980px) { .perf-block { grid-template-columns: 1fr; } }

  .chart {
    background: var(--card); border: 1px solid var(--rule);
    border-radius: 14px; padding: 28px 28px 22px; position: relative;
  }
  .chart-head { display: flex; justify-content: space-between; align-items: flex-start; }
  .chart-head .title { font-size: 13px; color: var(--ink); font-weight: 500; }
  .chart-head .range { display: flex; gap: 4px; background: var(--bg-2); border-radius: 8px; padding: 4px; border: 1px solid var(--rule); }
  .chart-head .range button {
    font-size: 12px; padding: 4px 10px; border-radius: 6px;
    color: var(--ink-3); font-weight: 500;
  }
  .chart-head .range .on { background: var(--ink); color: var(--bg); box-shadow: 0 1px 3px rgba(0,0,0,.1); }
  .chart svg { width: 100%; height: 280px; display: block; margin-top: 10px; }
  .chart-legend {
    display: flex; flex-wrap: wrap; gap: 18px; margin-top: 14px; padding-top: 16px; border-top: 1px solid var(--rule);
    font-size: 12px; color: var(--ink-2);
  }
  .chart-legend span { display: inline-flex; align-items: center; gap: 8px; }
  .chart-legend i { width: 8px; height: 8px; display: inline-block; border-radius: 1px; }

  .perf-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--rule); border-radius: 20px; overflow: hidden; border: 1px solid var(--rule); }
  .perf-stats .cell { background: var(--bg-2); padding: 28px 24px; display: flex; flex-direction: column; justify-content: space-between; min-height: 170px; }
  .perf-stats .cell .k { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-3); }
  .perf-stats .cell .v { font-family: 'Sora', sans-serif; font-weight: 300; font-size: 40px; line-height: 1; letter-spacing: -.03em; margin-top: auto; }
  .perf-stats .cell .v .num { color: var(--accent); font-weight: 400; }
  .perf-stats .cell .v small { font-size: 14px; color: var(--ink-3); font-family: 'JetBrains Mono', monospace; margin-left: 4px; }
  .perf-stats .cell .sub { font-size: 12px; color: var(--ink-3); margin-top: 10px; }

  /* ---------- CARTEIRAS / portfolios ---------- */
  .portfolios { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  @media (max-width: 1060px) { .portfolios { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 620px) { .portfolios { grid-template-columns: 1fr; } }
  .pf {
    background: var(--card); border: 1px solid var(--rule);
    border-radius: 14px; padding: 28px 24px; position: relative;
    transition: transform .35s cubic-bezier(.2,.7,.2,1), border-color .35s, background .35s, color .35s;
    display: flex; flex-direction: column;
    min-height: 340px;
    overflow: hidden;
  }
  .pf:hover { transform: translateY(-6px); border-color: var(--accent); background: linear-gradient(180deg, #1a1306, #14100a); color: #fff; }
  .pf:hover h3 { color: #fff; }
  .pf:hover .pf-top { color: rgba(255,255,255,.62); }
  .pf:hover .pf-tag { color: rgba(255,255,255,.78); }
  .pf:hover .pf-foot { border-top-color: rgba(255,255,255,.12); }
  .pf:hover .pf-bar { background: rgba(255,255,255,.1); }
  .pf:hover .pf-foot-meta { color: rgba(255,255,255,.55); }
  .pf:hover .pf-perf { color: var(--accent); }
  .pf .pf-top { display: flex; justify-content: space-between; align-items: flex-start; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-4); }
  .pf h3 { font-family: 'Sora', sans-serif; font-weight: 300; font-size: 48px; letter-spacing: -.035em; margin: 20px 0 8px; line-height: 1; }
  .pf .pf-tag { font-size: 13.5px; color: var(--ink-2); line-height: 1.5; margin-bottom: auto; }
  .pf .pf-foot { margin-top: 22px; padding-top: 18px; border-top: 1px solid var(--rule); }
  .pf .pf-perf { font-family: 'Sora', sans-serif; font-weight: 400; font-size: 28px; color: var(--accent); letter-spacing: -.02em; line-height: 1; }
  .pf .pf-perf small { font-size: 12px; color: var(--ink-3); font-family: 'JetBrains Mono', monospace; margin-left: 8px; }
  .pf .pf-bar { height: 3px; background: var(--rule); border-radius: 999px; margin: 14px 0 10px; overflow: hidden; }
  .pf .pf-bar i { display: block; height: 100%; background: var(--accent); }
  .pf .pf-foot-meta { display: flex; justify-content: space-between; font-size: 11px; color: var(--ink-4); font-family: 'JetBrains Mono', monospace; letter-spacing: .08em; }

  .pf.feature { background: linear-gradient(180deg, #1a1306, #14100a); border-color: rgba(201,169,97,.32); }
  .pf.feature h3 { color: #fff; }
  .pf.feature .pf-top { color: rgba(255,255,255,.62); }
  .pf.feature .pf-tag { color: rgba(255,255,255,.78); }
  .pf.feature .pf-foot { border-top-color: rgba(255,255,255,.12); }
  .pf.feature .pf-bar { background: rgba(255,255,255,.1); }
  .pf.feature .pf-foot-meta { color: rgba(255,255,255,.55); }

  /* ---------- MÉTODO ---------- */
  .method-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--rule); border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); }
  @media (max-width: 900px) { .method-grid { grid-template-columns: 1fr; } }
  .step { background: var(--bg); padding: 44px 32px; display: flex; flex-direction: column; gap: 20px; min-height: 340px; position: relative; }
  .step .idx { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--accent); letter-spacing: .14em; }
  .step h4 { font-family: 'Sora', sans-serif; font-weight: 300; font-size: 30px; line-height: 1.08; letter-spacing: -.025em; margin: 0; max-width: 14ch; }
  .step p { color: var(--ink-2); font-size: 14.5px; line-height: 1.55; margin: 0; }
  .step .foot-meta { margin-top: auto; padding-top: 20px; border-top: 1px dashed var(--rule); font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .1em; color: var(--ink-3); display: flex; align-items: center; gap: 10px; text-transform: uppercase; }
  .step .pips { display: flex; gap: 4px; }
  .step .pips i { width: 14px; height: 3px; border-radius: 2px; background: var(--rule-strong); }
  .step .pips i.on { background: var(--accent); }

  /* ---------- PLANEJAMENTO (split) ---------- */
  .split { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
  @media (max-width: 900px) { .split { grid-template-columns: 1fr; gap: 32px; } }
  .split h2 { font-family: 'Sora', sans-serif; font-weight: 300; font-size: clamp(36px, 4.2vw, 56px); line-height: 1.02; margin: 16px 0 0; letter-spacing: -.028em; }
  .split h2 b { font-weight: 500; color: var(--accent); }
  .split p { color: var(--ink-2); font-size: 16px; max-width: 48ch; margin-top: 24px; line-height: 1.6; }
  .split ul { margin: 32px 0 0; padding: 0; list-style: none; border-top: 1px solid var(--rule); }
  .split ul li { padding: 18px 0; border-bottom: 1px solid var(--rule); display: flex; align-items: center; gap: 18px; font-size: 15px; }
  .split ul li .n { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--accent); letter-spacing: .1em; width: 24px; }

  /* Allocation card */
  .alloc-card { background: linear-gradient(180deg, var(--card), var(--bg-3)); border: 1px solid var(--rule); border-radius: 14px; padding: 40px; position: relative; box-shadow: 0 16px 40px rgba(0,0,0,.15); }
  .alloc-card .label { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-3); }
  .alloc-card .amount { font-family: 'Sora', sans-serif; font-weight: 300; font-size: 56px; line-height: 1; letter-spacing: -.03em; margin: 10px 0 32px; }
  .alloc-card .donut { display: flex; align-items: center; gap: 32px; }
  .alloc-card .leg { display: flex; flex-direction: column; gap: 0; font-size: 14px; flex: 1; }
  .alloc-card .leg .row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--rule); }
  .alloc-card .leg .row:last-child { border-bottom: 0; }
  .alloc-card .leg .row .l { display: flex; align-items: center; gap: 10px; color: var(--ink-2); }
  .alloc-card .leg .row .l i { width: 10px; height: 10px; border-radius: 3px; display: inline-block; }
  .alloc-card .leg .row .r { font-family: 'JetBrains Mono', monospace; color: var(--ink); }

  /* ---------- PRICING ---------- */
  .pricing { display: grid; grid-template-columns: 1.1fr .9fr; gap: 24px; align-items: stretch; }
  @media (max-width: 980px) { .pricing { grid-template-columns: 1fr; } }
  .plan {
    background: linear-gradient(180deg, #1a1306, #14100a);
    border: 1px solid rgba(201,169,97,.32); border-radius: 14px;
    padding: 44px; display: flex; flex-direction: column; gap: 26px;
    position: relative; overflow: hidden;
    color: #fff;
  }
  .plan .eyebrow { color: rgba(255,255,255,.65); }
  .plan .feat { border-top-color: rgba(255,255,255,.12); }
  .plan .feat li { color: rgba(255,255,255,.92); }
  .plan .price small { color: rgba(255,255,255,.55); }
  .plan::before {
    content: ""; position: absolute; top: -40%; right: -20%; width: 60%; height: 80%;
    background: radial-gradient(circle, rgba(201,169,97,.14), transparent 60%);
    pointer-events: none;
  }
  .plan .price-row { display: flex; align-items: baseline; gap: 8px; }
  .plan .price { font-family: 'Sora', sans-serif; font-weight: 300; font-size: 80px; line-height: 1; letter-spacing: -.04em; color: #fff; }
  .plan .price small { font-size: 14px; color: var(--ink-3); font-family: 'JetBrains Mono', monospace; letter-spacing: .04em; }
  .plan h3 { font-family: 'Sora', sans-serif; font-weight: 400; font-size: 28px; margin: 0; letter-spacing: -.02em; color: #fff; }
  .plan .feat { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 24px; padding-top: 22px; border-top: 1px solid var(--rule); margin-top: auto; list-style: none; padding-left: 0; }
  .plan .feat li { display: flex; gap: 10px; align-items: flex-start; font-size: 13.5px; color: rgba(255,255,255,.9); }
  .plan .feat li::before {
    content: ""; width: 14px; height: 14px; border-radius: 999px; flex: 0 0 auto; margin-top: 3px;
    background: var(--accent);
    -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 14'><circle cx='7' cy='7' r='6' fill='black'/><path d='M4 7l2 2 4-4' stroke='white' stroke-width='1.4' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>") center/contain no-repeat;
    mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 14'><circle cx='7' cy='7' r='6' fill='black'/><path d='M4 7l2 2 4-4' stroke='white' stroke-width='1.4' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>") center/contain no-repeat;
  }
  .projection { background: var(--bg-2); border: 1px solid var(--rule); border-radius: 24px; padding: 40px; display: flex; flex-direction: column; }
  .projection .label { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-3); }
  .projection .val { font-family: 'Sora', sans-serif; font-weight: 300; font-size: 56px; line-height: 1; letter-spacing: -.03em; margin: 10px 0; }
  .projection .val .pct { color: var(--accent); font-weight: 400; }
  .projection .sub { font-size: 14px; color: var(--ink-3); max-width: 36ch; line-height: 1.55; }
  .projection .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 28px; padding-top: 22px; border-top: 1px solid var(--rule); }
  .projection .row2 .k { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .1em; color: var(--ink-3); text-transform: uppercase; }
  .projection .row2 .v { font-family: 'Sora', sans-serif; font-weight: 400; font-size: 24px; margin-top: 6px; letter-spacing: -.02em; }
  .projection .chart-mini { margin-top: 28px; }
  .projection .chart-mini svg { width: 100%; height: 80px; }

  /* ---------- COMPARISON ---------- */
  .compare { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--rule); border: 1px solid var(--rule); border-radius: 20px; overflow: hidden; }
  @media (max-width: 760px) { .compare { grid-template-columns: 1fr; } }
  .compare .col { background: var(--bg-2); padding: 44px 40px; }
  .compare .col.arvo { background: linear-gradient(180deg, #1a1306, #14100a); color: #fff; }
  .compare .col.arvo ul li { color: rgba(255,255,255,.88); border-top-color: rgba(255,255,255,.12); }
  .compare h4 { font-family: 'Sora', sans-serif; font-weight: 400; font-size: 26px; margin: 0 0 28px; letter-spacing: -.02em; display: flex; align-items: center; gap: 12px; }
  .compare .col.arvo h4 i { width: 10px; height: 10px; border-radius: 999px; background: var(--accent); box-shadow: 0 0 14px var(--accent); }
  .compare ul { list-style: none; padding: 0; margin: 0; }
  .compare ul li { padding: 16px 0; font-size: 14.5px; display: flex; gap: 14px; align-items: flex-start; border-top: 1px solid var(--rule); color: var(--ink-2); }
  .compare ul li:first-child { border-top: 0; }
  .compare ul li .mk { flex: 0 0 18px; width: 18px; height: 18px; border-radius: 999px; margin-top: 1px; display: grid; place-items: center; font-size: 10px; font-weight: 600; font-family: 'JetBrains Mono', monospace; }
  .compare .col.arvo ul li .mk { background: var(--accent); color: #1a1308; }
  .compare .col.trad ul li .mk { background: transparent; color: var(--ink-4); border: 1px solid var(--rule-strong); }

  /* ---------- FOUNDER ---------- */
  .founder { display: grid; grid-template-columns: .85fr 1.15fr; gap: 72px; align-items: center; }
  @media (max-width: 900px) { .founder { grid-template-columns: 1fr; } }
  .founder-photo {
    aspect-ratio: 4/5; background: var(--bg-3); border-radius: 14px; overflow: hidden; position: relative;
    border: 1px solid var(--rule);
  }
  .founder-photo .ph {
    width: 100%; height: 100%;
    background:
      repeating-linear-gradient(135deg, rgba(255,255,255,.03) 0 1px, transparent 1px 14px),
      linear-gradient(180deg, #1a2027, #0e1319);
    display: grid; place-items: center;
    font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--ink-3); letter-spacing: .16em;
  }
  .founder-photo .badge {
    position: absolute; left: 16px; bottom: 16px;
    padding: 10px 14px; border-radius: 999px; background: rgba(20,26,34,.9);
    backdrop-filter: blur(10px);
    border: 1px solid var(--rule-strong);
    color: var(--ink); font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .12em; text-transform: uppercase;
  }
  .founder h2 { font-family: 'Sora', sans-serif; font-weight: 300; font-size: clamp(36px, 4.2vw, 56px); line-height: 1.02; margin: 16px 0 24px; letter-spacing: -.028em; max-width: 16ch; }
  .founder h2 b { font-weight: 500; color: var(--accent); }
  .founder p { color: var(--ink-2); font-size: 16px; max-width: 54ch; line-height: 1.65; }
  .founder .sig { display: flex; gap: 10px; margin-top: 32px; flex-wrap: wrap; }
  .founder .sig .chip { padding: 9px 14px; border-radius: 999px; border: 1px solid var(--rule-strong); font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .1em; color: var(--ink-2); }

  /* ---------- FAQ ---------- */
  .faq-list { border-top: 1px solid var(--rule); }
  .faq-item { border-bottom: 1px solid var(--rule); }
  .faq-btn { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 30px 0; text-align: left; gap: 24px; }
  .faq-btn h4 { font-family: 'Sora', sans-serif; font-weight: 400; font-size: clamp(20px, 2.2vw, 28px); line-height: 1.15; margin: 0; letter-spacing: -.015em; color: var(--ink); }
  .faq-item.open .faq-btn h4 { color: var(--accent); }
  .faq-btn .pm { width: 24px; height: 24px; display: grid; place-items: center; flex: 0 0 auto; transition: transform .3s; color: var(--ink-3); }
  .faq-item.open .faq-btn .pm { color: var(--accent); transform: rotate(180deg); }
  .faq-body { max-height: 0; overflow: hidden; transition: max-height .4s ease; color: var(--ink-2); font-size: 15.5px; line-height: 1.65; }
  .faq-body-inner { padding: 0 0 30px; max-width: 72ch; }
  .faq-item.open .faq-body { max-height: 400px; }

  /* ---------- BIG CTA ---------- */
  .big-cta { padding: 80px 0; text-align: center; position: relative; overflow: hidden; }
  .big-cta::before {
    content: ""; position: absolute; inset: 0;
    background: radial-gradient(800px 400px at 50% 30%, rgba(201,169,97,.08), transparent 60%);
  }
  .big-cta h2 { font-family: 'Sora', sans-serif; font-weight: 300; font-size: clamp(56px, 9.5vw, 150px); line-height: .92; letter-spacing: -.04em; margin: 0; position: relative; }
  .big-cta h2 b { font-weight: 500; color: var(--accent); }
  .big-cta p { margin: 32px auto 0; max-width: 48ch; color: var(--ink-2); font-size: 17px; line-height: 1.55; position: relative; }
  .big-cta .btns { margin-top: 44px; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; position: relative; }

  /* ---------- FOOTER ---------- */
  footer { background: var(--bg-2); border-top: 1px solid var(--rule); padding: 80px 0 40px; }
  footer .foot-grid { display: grid; grid-template-columns: 1.6fr 1fr 1fr 1fr 1fr; gap: 48px; padding-bottom: 48px; border-bottom: 1px solid var(--rule); }
  @media (max-width: 900px) { footer .foot-grid { grid-template-columns: 1fr 1fr; } }
  footer h5 { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .14em; color: var(--ink-3); text-transform: uppercase; margin: 0 0 20px; font-weight: 500; }
  footer ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
  footer a { color: var(--ink-2); font-size: 13.5px; transition: color .2s; }
  footer a:hover { color: var(--accent); }
  footer .foot-logo { font-family: 'Sora', sans-serif; font-weight: 600; font-size: 22px; letter-spacing: .1em; display: flex; align-items: center; gap: 12px; }
  footer .foot-tag { color: var(--ink-3); font-size: 14px; max-width: 32ch; margin-top: 20px; line-height: 1.55; }
  footer .foot-bot { display: flex; justify-content: space-between; font-size: 11px; color: var(--ink-4); padding-top: 32px; flex-wrap: wrap; gap: 16px; font-family: 'JetBrains Mono', monospace; letter-spacing: .08em; }
  footer .fine-print { margin-top: 24px; font-size: 11px; color: var(--ink-4); line-height: 1.65; max-width: 92ch; }

  /* entrance */
  @keyframes rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
  .rise { animation: rise .9s cubic-bezier(.2,.7,.2,1); opacity: 1; }
  .rise-2 { animation-delay: .08s; }
  .rise-3 { animation-delay: .16s; }
  .rise-4 { animation-delay: .24s; }

  @keyframes draw { from { stroke-dashoffset: 1600; } to { stroke-dashoffset: 0; } }
  .draw-me { stroke-dasharray: 1600; animation: draw 2.4s ease-out .3s both; }

                .landing-page {
                    font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
                    font-size: 16px; line-height: 1.5;
                    -webkit-font-smoothing: antialiased;
                    text-rendering: optimizeLegibility;
                    font-feature-settings: "ss01", "ss02";
                    background: var(--bg); color: var(--ink);
                    margin: 0; padding: 0;
                }
            ` }} />

      <div dangerouslySetInnerHTML={{
        __html: `



<!-- NAV -->
<header class="nav">
  <div class="wrap nav-inner">
    <a href="/login" class="logo">
      <span class="logo-mark">
        <img src="/arvo-simbolo-blue.png" alt="ARVO" style="width: 24px; height: 24px; object-fit: contain;" />
      </span>
      <span>ARVO</span>
    </a>
    <nav class="nav-links">
      <a href="#como-funciona">Método</a>
      <a href="#carteiras">Carteiras</a>
      <a href="#independencia">Independência</a>
      <a href="#assinatura">Planos</a>
      <a href="#faq">Dúvidas</a>
    </nav>
    <div class="nav-cta">
      <a href="/login" class="btn btn-ghost" style="color: var(--ink);">Entrar</a>
      <a href="/register" class="btn btn-primary">Descobrir meu plano <span class="arr">→</span></a>
    </div>
  </div>
</header>
        ` }} />

      {/* HERO SECTION AS NATIVE JSX */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div className="eyebrow rise" style={{ marginBottom: "12px", display: "inline-flex", alignItems: "center" }}>
              <span className="dot"></span> Planejamento financeiro independente · Sem comissão por produto
            </div>
            
            <h1 className="rise rise-2" style={{ fontSize: "clamp(34px, 4.3vw, 60px)", lineHeight: "1.06", margin: "12px 0 0" }}>
              Não basta investir.<br/>
              <b>É preciso ter um plano.</b>
            </h1>
            
            <p className="hero-sub rise rise-3" style={{ fontSize: "16.5px", color: "var(--ink-2)", lineHeight: "1.6", marginTop: "20px", maxWidth: "44ch" }}>
              A ARVO transforma seus investimentos em uma estratégia clara para você saber quanto investir, como organizar seu patrimônio e se está no caminho dos seus objetivos.
            </p>
            
            <div className="hero-cta rise rise-4" style={{ marginTop: "28px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px" }}>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                <a href="/register" className="btn btn-accent" style={{ fontSize: "15px", padding: "16px 28px" }}>
                  Descobrir meu plano <span className="arr" style={{ marginLeft: "4px" }}>→</span>
                </a>
                <a href="#como-funciona" className="btn btn-ghost" style={{ fontSize: "14px", padding: "15px 22px" }}>
                  Ver como funciona ↓
                </a>
              </div>
              <div style={{ fontSize: "12px", color: "var(--ink-3)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: ".04em", marginTop: "2px" }}>
                ✓ 5 minutos · ✓ Gratuito · ✓ Sem cartão
              </div>
            </div>

            <div className="rise rise-4" style={{ marginTop: "24px", padding: "14px 18px", background: "var(--bg-2)", border: "1px solid var(--rule)", borderRadius: "12px", fontSize: "13px", color: "var(--ink-2)", lineHeight: "1.5", maxWidth: "44ch" }}>
              <strong style={{ color: "var(--ink)", fontWeight: 600 }}>Para quem é a ARVO?</strong> Feito para quem guarda a partir de R$ 1.000/mês ou já tem patrimônio acumulado e quer direção profissional.
            </div>
          </div>

          <div className="hero-panel rise rise-4" style={{ background: "transparent", border: "none", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LandingSimulator />
          </div>
        </div>
      </section>

      <div dangerouslySetInnerHTML={{ __html: `



<!-- 3. O PROBLEMA -->
<section class="section" id="problema">
  <div class="wrap">
    <div class="section-head" style="margin-bottom: 48px;">
      <div>
        <div class="eyebrow" style="margin-bottom: 12px;"><span class="dot"></span> O Problema</div>
        <h2 style="font-size: clamp(32px, 4vw, 52px); line-height: 1.08;">Você já investe.<br><b>Mas sabe se está no caminho certo?</b></h2>
      </div>
      <div class="lede" style="display: flex; align-items: flex-end;">
        <p style="font-size: 17px; color: var(--ink-2); line-height: 1.6; margin: 0;">
          Ter bons investimentos não significa necessariamente ter um bom plano. Sem uma direção clara, qualquer oscilação gera dúvida.
        </p>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
      <div style="background: var(--card); border: 1px solid var(--rule); border-radius: 16px; padding: 28px 24px; display: flex; flex-direction: column; gap: 12px;">
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--accent); letter-spacing: .12em; text-transform: uppercase;">Pergunta 01</div>
        <div style="font-family: 'Sora', sans-serif; font-size: 18px; color: var(--ink); font-weight: 400; line-height: 1.35;">
          Quanto preciso acumular?
        </div>
      </div>

      <div style="background: var(--card); border: 1px solid var(--rule); border-radius: 16px; padding: 28px 24px; display: flex; flex-direction: column; gap: 12px;">
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--accent); letter-spacing: .12em; text-transform: uppercase;">Pergunta 02</div>
        <div style="font-family: 'Sora', sans-serif; font-size: 18px; color: var(--ink); font-weight: 400; line-height: 1.35;">
          Quanto devo investir por mês?
        </div>
      </div>

      <div style="background: var(--card); border: 1px solid var(--rule); border-radius: 16px; padding: 28px 24px; display: flex; flex-direction: column; gap: 12px;">
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--accent); letter-spacing: .12em; text-transform: uppercase;">Pergunta 03</div>
        <div style="font-family: 'Sora', sans-serif; font-size: 18px; color: var(--ink); font-weight: 400; line-height: 1.35;">
          Minha carteira faz sentido para os meus objetivos?
        </div>
      </div>

      <div style="background: var(--card); border: 1px solid var(--rule); border-radius: 16px; padding: 28px 24px; display: flex; flex-direction: column; gap: 12px;">
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--accent); letter-spacing: .12em; text-transform: uppercase;">Pergunta 04</div>
        <div style="font-family: 'Sora', sans-serif; font-size: 18px; color: var(--ink); font-weight: 400; line-height: 1.35;">
          Estou mais perto ou mais longe da minha independência?
        </div>
      </div>
    </div>

    <div style="margin-top: 36px; padding: 24px 32px; background: var(--bg-2); border: 1px solid var(--rule); border-radius: 14px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
      <div style="font-size: 17px; font-weight: 500; color: var(--ink);">
        <b>É isso que a ARVO organiza.</b> Clareza para suas decisões financeiras, sem conflito de interesses.
      </div>
      <a href="/register" class="btn btn-accent" style="font-size: 13.5px; padding: 12px 20px;">
        Descobrir meu plano →
      </a>
    </div>
  </div>
</section>

<!-- 4. COMO FUNCIONA -->
<section class="section" id="como-funciona" style="background: var(--bg-2);">
  <div class="wrap">
    <div class="section-head" style="text-align: center; margin-bottom: 56px;">
      <div style="margin: 0 auto;">
        <div class="eyebrow" style="margin-bottom: 12px;"><span class="dot"></span> Método ARVO</div>
        <h2 style="font-size: clamp(32px, 4.2vw, 56px); margin: 0;">Um plano. <b>Três movimentos.</b></h2>
      </div>
    </div>

    <div class="method-grid" style="border: none; background: transparent; gap: 20px;">
      <div class="step" style="background: var(--card); border: 1px solid var(--rule); border-radius: 16px; padding: 36px 30px; min-height: 260px;">
        <span class="idx" style="font-size: 12px; font-weight: 600;">01 — Planeje</span>
        <h4 style="font-size: 24px; margin: 12px 0 8px;">Metas claras</h4>
        <p style="font-size: 15px; color: var(--ink-2); line-height: 1.55;">
          Transforme patrimônio, renda e objetivos em metas financeiras claras e mensuráveis.
        </p>
      </div>

      <div class="step" style="background: var(--card); border: 1px solid var(--rule); border-radius: 16px; padding: 36px 30px; min-height: 260px;">
        <span class="idx" style="font-size: 12px; font-weight: 600;">02 — Invista</span>
        <h4 style="font-size: 24px; margin: 12px 0 8px;">Estratégia sob medida</h4>
        <p style="font-size: 15px; color: var(--ink-2); line-height: 1.55;">
          Organize sua estratégia de investimentos de acordo com seu perfil, patrimônio e momento de vida.
        </p>
      </div>

      <div class="step" style="background: var(--card); border: 1px solid var(--rule); border-radius: 16px; padding: 36px 30px; min-height: 260px;">
        <span class="idx" style="font-size: 12px; font-weight: 600;">03 — Acompanhe</span>
        <h4 style="font-size: 24px; margin: 12px 0 8px;">Evolução contínua</h4>
        <p style="font-size: 15px; color: var(--ink-2); line-height: 1.55;">
          Veja sua evolução e ajuste o plano conforme sua vida e seus objetivos mudam.
        </p>
      </div>
    </div>

    <div style="text-align: center; margin-top: 44px;">
      <a href="/register" class="btn btn-accent" style="font-size: 15px; padding: 16px 32px;">
        Descobrir meu plano <span class="arr">→</span>
      </a>
    </div>
  </div>
</section>

<!-- 5. CARTEIRAS -->
<section class="section" id="carteiras">
  <div class="wrap">
    <div class="section-head">
      <div>
        <div class="eyebrow" style="margin-bottom: 12px;"><span class="dot"></span> Metodologia</div>
        <h2 style="font-size: clamp(32px, 4vw, 54px); line-height: 1.05;">
          Não existe a melhor carteira.<br><b>Existe a carteira certa para cada momento.</b>
        </h2>
      </div>
      <div class="lede" style="display: flex; align-items: flex-end;">
        <p style="margin: 0; font-size: 16px; color: var(--ink-2); line-height: 1.6;">
          Seu patrimônio muda. Seus objetivos mudam. Sua capacidade de assumir risco também. A ARVO organiza suas estratégias em diferentes níveis de risco e diversificação para você entender onde está e o que muda conforme avança.
        </p>
      </div>
    </div>

    <div class="portfolios" style="margin-bottom: 48px;">
      <article class="pf">
        <div class="pf-top"><span>Preservação</span><span>Conservadora</span></div>
        <h3>Abrigo</h3>
        <p class="pf-tag">Segurança e liquidez. Dinheiro que você pode precisar a qualquer momento.</p>
        <div class="pf-foot">
          <div class="pf-perf">Liquidez<small>imediata</small></div>
          <div class="pf-bar"><i style="width: 30%"></i></div>
          <div class="pf-foot-meta"><span>Selic · RF</span><span>Baixa vol.</span></div>
        </div>
      </article>

      <article class="pf">
        <div class="pf-top"><span>Equilíbrio</span><span>Conservadora / Mod.</span></div>
        <h3>Ritmo</h3>
        <p class="pf-tag">O primeiro passo além do básico. Diversificação estruturada em renda fixa e inflação.</p>
        <div class="pf-foot">
          <div class="pf-perf">Diversifica<small>renda fixa</small></div>
          <div class="pf-bar"><i style="width: 55%"></i></div>
          <div class="pf-foot-meta"><span>RF · IPCA · Pré</span><span>Baixa+ vol.</span></div>
        </div>
      </article>

      <article class="pf feature">
        <div class="pf-top"><span>Diversificação</span><span>Equilibrada</span></div>
        <h3>Visão</h3>
        <p class="pf-tag">Mais diversificação para buscar crescimento. Renda fixa + renda variável controlada.</p>
        <div class="pf-foot">
          <div class="pf-perf">Crescimento<small>controlado</small></div>
          <div class="pf-bar"><i style="width: 78%"></i></div>
          <div class="pf-foot-meta"><span>Inflação · Ações · Multi</span><span>Mod. vol.</span></div>
        </div>
      </article>

      <article class="pf">
        <div class="pf-top"><span>Crescimento</span><span>Arrojada</span></div>
        <h3>Oceano</h3>
        <p class="pf-tag">Mais exposição ao longo prazo para quem aceita oscilações maiores em busca de retorno.</p>
        <div class="pf-foot">
          <div class="pf-perf">Arrojado<small>longo prazo</small></div>
          <div class="pf-bar"><i style="width: 95%"></i></div>
          <div class="pf-foot-meta"><span>Ações · Multimercados</span><span>Alta vol.</span></div>
        </div>
      </article>
    </div>

    <div style="text-align: center;">
      <a href="/register" class="btn btn-ghost" style="font-size: 14px; padding: 14px 28px;">
        Conhecer as carteiras ARVO →
      </a>
    </div>
  </div>
</section>

<!-- 6. RESULTADOS / PERFORMANCE -->
<section class="section" id="resultados" style="background: var(--bg-2);">
  <div class="wrap">
    <div class="section-head" style="margin-bottom: 40px;">
      <div>
        <div class="eyebrow" style="margin-bottom: 12px;"><span class="dot"></span> Transparência</div>
        <h2 style="font-size: clamp(32px, 4vw, 54px); line-height: 1.05;">
          Resultado aberto.<br><b>Sem promessa de resultado.</b>
        </h2>
      </div>
      <div class="lede" style="display: flex; align-items: flex-end;">
        <p style="margin: 0; font-size: 16px; color: var(--ink-2); line-height: 1.6;">
          Acompanhe o histórico das estratégias ARVO e compare sua evolução com os principais referenciais de mercado.
        </p>
      </div>
    </div>

` }} />
      <PerformanceChart />
      <div dangerouslySetInnerHTML={{ __html: `

    <div style="margin-top: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; font-size: 13px; color: var(--ink-3);">
      <div style="font-weight: 500; color: var(--ink);">
        ✓ Metodologia transparente. Acompanhamento contínuo.
      </div>
      <div style="font-style: italic; font-size: 12px;">
        *Rentabilidade passada não representa garantia de resultados futuros.
      </div>
    </div>
  </div>
</section>

<!-- 7. INDEPENDÊNCIA / MODELO DE NEGÓCIO -->
<section class="section" id="independencia">
  <div class="wrap">
    <div class="section-head">
      <div>
        <div class="eyebrow" style="margin-bottom: 12px;"><span class="dot"></span> Modelo Fee-Only</div>
        <h2 style="font-size: clamp(32px, 4vw, 54px); line-height: 1.05;">
          Independência não é só uma palavra.<br><b>É o nosso modelo de negócio.</b>
        </h2>
      </div>
      <div class="lede" style="display: flex; align-items: flex-end;">
        <p style="margin: 0; font-size: 16px; color: var(--ink-2); line-height: 1.6;">
          A ARVO não recebe comissão para indicar um produto financeiro. Nossa receita vem exclusivamente da assinatura.
        </p>
      </div>
    </div>

    <div style="background: linear-gradient(180deg, #141a22, #0b0f14); border: 1px solid var(--rule-strong); border-radius: 20px; padding: 36px 36px; color: #ffffff; margin-bottom: 32px;">
      <div style="font-family: 'Sora', sans-serif; font-size: clamp(22px, 2.8vw, 32px); font-weight: 300; line-height: 1.3; max-width: 42ch;">
        Você sabe exatamente quanto paga. E sabe quem está remunerando: <span style="color: #4FA080; font-weight: 500; white-space: nowrap;">a ARVO.</span>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
      <div style="background: var(--card); border: 1px solid var(--rule); border-radius: 16px; padding: 32px 28px;">
        <div style="width: 36px; height: 36px; border-radius: 999px; background: rgba(43,110,118,0.1); color: var(--accent); display: grid; place-items: center; margin-bottom: 16px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <h4 style="font-family: 'Sora', sans-serif; font-size: 19px; font-weight: 500; margin: 0 0 8px; color: var(--ink);">Sem comissão por produto</h4>
        <p style="margin: 0; font-size: 14.5px; color: var(--ink-2); line-height: 1.55;">
          Nenhuma indicação é motivada por rebate ou remuneração de corretoras. Alinhamento 100% com você.
        </p>
      </div>

      <div style="background: var(--card); border: 1px solid var(--rule); border-radius: 16px; padding: 32px 28px;">
        <div style="width: 36px; height: 36px; border-radius: 999px; background: rgba(43,110,118,0.1); color: var(--accent); display: grid; place-items: center; margin-bottom: 16px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path></svg>
        </div>
        <h4 style="font-family: 'Sora', sans-serif; font-size: 19px; font-weight: 500; margin: 0 0 8px; color: var(--ink);">Sem mudar de banco ou corretora</h4>
        <p style="margin: 0; font-size: 14.5px; color: var(--ink-2); line-height: 1.55;">
          Você continua investindo onde preferir (XP, BTG, Itaú, NuInvest ou qualquer outra).
        </p>
      </div>

      <div style="background: var(--card); border: 1px solid var(--rule); border-radius: 16px; padding: 32px 28px;">
        <div style="width: 36px; height: 36px; border-radius: 999px; background: rgba(43,110,118,0.1); color: var(--accent); display: grid; place-items: center; margin-bottom: 16px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        </div>
        <h4 style="font-family: 'Sora', sans-serif; font-size: 19px; font-weight: 500; margin: 0 0 8px; color: var(--ink);">Patrimônio sob seu controle</h4>
        <p style="margin: 0; font-size: 14.5px; color: var(--ink-2); line-height: 1.55;">
          A ARVO orienta a estratégia e o plano. A custódia e as decisões de execução são sempre suas.
        </p>
      </div>
    </div>
  </div>
</section>

<!-- 8. FILOSOFIA + FUNDADOR -->
<section class="section" id="fundador" style="background: var(--bg-2);">
  <div class="wrap">
    <div class="founder" style="gap: 56px;">
      <div class="founder-photo" style="max-width: 440px; margin: 0 auto; width: 100%;">
        <div class="ph">
          <div style="display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 32px; text-align: center;">
            <div style="width: 64px; height: 64px; border-radius: 999px; background: var(--accent); color: white; display: grid; place-items: center; font-size: 24px; font-weight: 600; font-family: 'Sora', sans-serif;">
              LM
            </div>
            <div style="color: #ffffff; font-family: 'Sora', sans-serif; font-size: 18px; font-weight: 500;">Lucas Matos, CFP®</div>
            <div style="color: var(--ink-3); font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase;">Fundador da ARVO</div>
          </div>
        </div>
        <div class="badge">
          CFP® · Planejador Financeiro
        </div>
      </div>

      <div>
        <div class="eyebrow" style="margin-bottom: 12px;"><span class="dot"></span> Filosofia</div>
        <h2 style="font-size: clamp(32px, 4vw, 52px); line-height: 1.06; margin: 0 0 20px;">
          Estratégia antes <b>do investimento.</b>
        </h2>
        <p style="font-size: 16.5px; color: var(--ink-2); line-height: 1.65; max-width: 50ch; margin: 0 0 16px;">
          A ARVO nasceu de uma constatação simples: <b>muita gente começa escolhendo o investimento antes de saber o que precisa fazer com o dinheiro.</b>
        </p>
        <p style="font-size: 16.5px; color: var(--ink-2); line-height: 1.65; max-width: 50ch; margin: 0 0 24px;">
          Nós fazemos o contrário. <b>Primeiro vem o plano. Depois, a estratégia.</b>
        </p>
        
        <div style="border-top: 1px solid var(--rule); padding-top: 20px; margin-top: 24px;">
          <div style="font-size: 13px; font-weight: 600; color: var(--ink); margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.08em;">
            Lucas Matos · Credenciais
          </div>
          <div class="sig" style="margin-top: 0; gap: 8px;">
            <span class="chip">CFP®</span>
            <span class="chip">CPA-20</span>
            <span class="chip">Ancord</span>
            <span class="chip">Mestre em Eng.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- 9. OFERTA / ASSINATURA -->
<section class="section" id="assinatura">
  <div class="wrap">
    <div class="section-head" style="text-align: center; margin-bottom: 56px;">
      <div style="margin: 0 auto;">
        <div class="eyebrow" style="margin-bottom: 12px;"><span class="dot"></span> Acesso Completo</div>
        <h2 style="font-size: clamp(32px, 4.2vw, 56px); margin: 0 0 16px;">
          Sua vida financeira não precisa de mais uma dica.<br><b>Precisa de acompanhamento.</b>
        </h2>
      </div>
    </div>

    <div class="pricing" style="grid-template-columns: 1fr; max-width: 760px; margin: 0 auto;">
      <div class="plan" style="align-items: center; text-align: center; padding: 48px 40px;">
        <div class="eyebrow">Assinatura Anual ARVO</div>
        <h3 style="font-size: 32px; font-weight: 300; margin: 8px 0 0;">Plano Completo</h3>

        <div class="price-row" style="margin-top: 20px; justify-content: center;">
          <span class="price tab">R\$ 59<span style="font-size:36px;letter-spacing:-.02em">,90</span></span>
          <span style="font-size: 20px; color: rgba(255,255,255,.8); font-weight: 300; font-family: 'Sora', sans-serif;">/ mês</span>
        </div>
        
        <div style="font-size: 13.5px; color: rgba(255,255,255,.7); margin-top: 6px; line-height: 1.5;">
          Cobrado em 12x de R$ 59,90/mês ou R$ 599,00 à vista (2 meses grátis)
        </div>

        <ul class="feat" style="grid-template-columns: 1fr 1fr; text-align: left; margin: 32px auto; max-width: 520px; gap: 14px 28px;">
          <li>Planejamento financeiro</li>
          <li>Estratégias de investimento</li>
          <li>Atualizações e rebalanceamentos</li>
          <li>Acompanhamento contínuo</li>
          <li>Conteúdo e comunidade</li>
          <li>Calculadoras e ferramentas</li>
          <li style="grid-column: span 2;">Suporte direto ARVO</li>
        </ul>

        <div style="display: flex; flex-direction: column; gap: 14px; width: 100%; max-width: 420px; margin-top: 8px;">
          <a href="/register" class="btn btn-accent" style="font-size: 16px; padding: 18px 32px; width: 100%;">
            Começar pela ARVO
          </a>
          
          <div style="border-top: 1px solid rgba(255,255,255,0.12); padding-top: 16px; margin-top: 8px;">
            <div style="font-size: 13px; color: rgba(255,255,255,0.8); margin-bottom: 10px;">
              Antes de assinar, conheça seu plano.
            </div>
            <a href="/register" class="btn btn-ghost" style="font-size: 13.5px; padding: 12px 24px; width: 100%; border-color: rgba(255,255,255,0.3); color: #ffffff;">
              Fazer meu diagnóstico gratuito
            </a>
          </div>
        </div>

        <div style="font-size: 12px; color: rgba(255,255,255,.6); margin-top: 24px; display: flex; align-items: center; gap: 8px; justify-content: center;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>Garantia incondicional de 7 dias com 100% de reembolso.</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- 10. FAQ -->
<section class="section" id="faq" style="background: var(--bg-2);">
  <div class="wrap">
    <div class="section-head" style="margin-bottom: 48px;">
      <div>
        <div class="eyebrow" style="margin-bottom: 12px;"><span class="dot"></span> Dúvidas Frequentes</div>
        <h2 style="font-size: clamp(32px, 4vw, 52px);">Antes de decidir.</h2>
      </div>
      <div class="lede" style="display: flex; align-items: flex-end;">
        <p style="margin: 0; font-size: 16px; color: var(--ink-2); line-height: 1.6;">
          Tudo o que você precisa saber sobre o método, independência e segurança da ARVO.
        </p>
      </div>
    </div>

    <div class="faq-list">
      <div class="faq-item open">
        <button class="faq-btn"><h4>Preciso tirar meus investimentos do meu banco?</h4><span class="pm"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span></button>
        <div class="faq-body"><div class="faq-body-inner">
          Não. Você continua investindo no banco ou corretora que preferir e mantém o controle do seu patrimônio. A ARVO ajuda a organizar a estratégia; você decide e executa seus investimentos onde quiser.
        </div></div>
      </div>

      <div class="faq-item">
        <button class="faq-btn"><h4>A ARVO investe o dinheiro por mim?</h4><span class="pm"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span></button>
        <div class="faq-body"><div class="faq-body-inner">
          Não. A ARVO não recebe, movimenta ou mantém a custódia do seu dinheiro. Seus investimentos continuam no seu banco ou corretora e todas as decisões e movimentações permanecem sob seu controle.
        </div></div>
      </div>

      <div class="faq-item">
        <button class="faq-btn"><h4>Como a ARVO ganha dinheiro?</h4><span class="pm"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span></button>
        <div class="faq-body"><div class="faq-body-inner">
          Pela assinatura dos nossos clientes. A ARVO não depende de comissão sobre os produtos que você investe. Isso permite construir nossa relação com um objetivo simples: ajudar você a tomar decisões financeiras melhores, sem precisar empurrar um produto.
        </div></div>
      </div>

      <div class="faq-item">
        <button class="faq-btn"><h4>Posso conhecer antes de pagar?</h4><span class="pm"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span></button>
        <div class="faq-body"><div class="faq-body-inner">
          Sim. Você pode começar gratuitamente pelo diagnóstico da ARVO, conhecer seu cenário financeiro e entender como a plataforma funciona antes de decidir assinar.
        </div></div>
      </div>

      <div class="faq-item">
        <button class="faq-btn"><h4>Como funciona o cancelamento e a garantia?</h4><span class="pm"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span></button>
        <div class="faq-body"><div class="faq-body-inner">
          Você pode cancelar a renovação da sua assinatura quando quiser. Caso esteja dentro do período de garantia informado no momento da contratação, também poderá solicitar o reembolso conforme as condições apresentadas na assinatura.
        </div></div>
      </div>

      <div class="faq-item">
        <button class="faq-btn"><h4>Para quem NÃO é a ARVO?</h4><span class="pm"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span></button>
        <div class="faq-body"><div class="faq-body-inner">
          <p style="margin: 0 0 10px;">A ARVO não é para quem procura dinheiro rápido, promessas de rentabilidade ou a “ação da vez”.</p>
          <p style="margin: 0 0 10px;">Também não é para quem quer entregar o dinheiro para outra pessoa administrar.</p>
          <p style="margin: 0;">A ARVO é para quem quer construir patrimônio com planejamento, estratégia e visão de longo prazo — mantendo o controle das próprias decisões.</p>
        </div></div>
      </div>
    </div>
  </div>
</section>

<!-- 11. CTA FINAL -->
<section class="big-cta" style="padding: 100px 0; background: var(--bg);">
  <div class="wrap">
    <div class="eyebrow" style="margin-bottom: 16px;"><span class="dot"></span> Comece Agora</div>
    <h2 style="font-size: clamp(36px, 5.5vw, 76px); line-height: 1.05; letter-spacing: -.03em; max-width: 18ch; margin: 0 auto;">
      Você já começou a investir.<br><b>Agora descubra se está no caminho certo.</b>
    </h2>
    <p style="margin: 24px auto 0; max-width: 44ch; color: var(--ink-2); font-size: 17px; line-height: 1.6;">
      Em menos de 5 minutos você descobre o plano ideal para o seu momento financeiro.
    </p>
    <div style="margin-top: 36px; display: flex; flex-direction: column; align-items: center; gap: 12px;">
      <a href="/register" class="btn btn-accent" style="font-size: 16.5px; padding: 18px 36px;">
        Descobrir meu plano <span class="arr">→</span>
      </a>
      <div style="font-size: 12px; color: var(--ink-3); font-family: 'JetBrains Mono', monospace; letter-spacing: .04em;">
        ✓ 5 minutos · ✓ Gratuito · ✓ Sem cartão
      </div>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <div class="foot-logo">
          <span style="display:inline-grid;place-items:center;width:28px;height:28px;">
            <img src="/arvo-simbolo-blue.png" alt="ARVO" style="width: 28px; height: 28px; object-fit: contain;" />
          </span>
          ARVO
        </div>
        <p class="foot-tag">Plataforma independente de orientação financeira. Fee-only, sem comissão por produto indicado.</p>
      </div>
      <div><h5>Acesso</h5>
        <ul>
          <li><a href="/login">Entrar</a></li>
          <li><a href="/register">Diagnóstico gratuito</a></li>
        </ul>
      </div>
      <div><h5>Aprenda</h5>
        <ul>
          <li><a href="#como-funciona">Método</a></li>
          <li><a href="#faq">Dúvidas</a></li>
        </ul>
      </div>
      <div><h5>Contato</h5>
        <ul>
          <li><a href="mailto:contato@arvo.com.br">Falar com a equipe</a></li>
        </ul>
      </div>
      <div><h5>Legal</h5>
        <ul>
          <li><a href="/privacidade">Privacidade</a></li>
          <li><a href="/termos">Termos</a></li>
        </ul>
      </div>
    </div>
    <div class="foot-bot">
      <span>ARVO Orientação Financeira LTDA · CNPJ: [INSERIR_CNPJ_REAL_AQUI]</span>
      <span>ARVO® 2026</span>
      <span>Feito em São Paulo</span>
    </div>
    <div style="font-size: 11px; color: var(--ink-3); margin-top: 16px; line-height: 1.5; border-top: 1px solid var(--rule); padding-top: 16px;">
      <strong>Aviso Regulatório:</strong> A ARVO é uma plataforma de tecnologia educacional e ferramentas financeiras. 
      A ARVO não atua como consultora de valores mobiliários, gestora ou analista de investimentos registrada na Comissão de Valores Mobiliários (CVM). 
      Nenhuma informação fornecida pela plataforma constitui recomendação individualizada de investimento.
    </div>
  </div>
</footer>

<script>
  // Range Data
  document.querySelectorAll('.faq-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var item = btn.closest('.faq-item');
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function(i) { i.classList.remove('open'); });
      if (!isOpen) item.classList.add('open');
    });
  });
</script>

` }} />
    </div>
  );
}
