import Head from "next/head";
import Link from "next/link";

export default function LandingPage() {
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
    --accent: #c9a961;      /* gold */
    --accent-2: #00c46a;    /* ARVO green (secondary) */
    --accent-deep: #a5884a;
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
    display: inline-flex; align-items: center; gap: 10px;
    padding: 14px 22px; border-radius: 999px;
    font-weight: 500; font-size: 13.5px; letter-spacing: -.005em;
    transition: transform .2s, background .2s, color .2s, border-color .2s;
  }
  .btn-primary { background: var(--ink); color: var(--bg); }
  .btn-primary:hover { background: var(--accent); color: #1a1308; }
  .btn-accent { background: var(--accent); color: #1a1308; }
  .btn-accent:hover { filter: brightness(1.08); }
  .btn-ghost { color: var(--ink); border: 1px solid var(--rule-strong); }
  .btn-ghost:hover { background: var(--ink); color: var(--bg); border-color: var(--ink); }
  .plan .btn-ghost, .compare .col.arvo .btn-ghost { color: #fff; border-color: rgba(255,255,255,.32); }
  .plan .btn-ghost:hover, .compare .col.arvo .btn-ghost:hover { background: #fff; color: #1a1308; border-color: #fff; }
  .btn .arr { transition: transform .2s; }
  .btn:hover .arr { transform: translateX(3px); }

  /* ---------- NAV ---------- */
  .nav {
    position: sticky; top: 0; z-index: 40;
    background: color-mix(in oklab, var(--bg) 82%, transparent);
    backdrop-filter: blur(16px) saturate(140%);
    -webkit-backdrop-filter: blur(16px) saturate(140%);
    border-bottom: 1px solid var(--rule);
  }
  .nav-inner { display: flex; align-items: center; justify-content: space-between; height: 72px; }
  .logo { display: flex; align-items: center; gap: 12px; font-family: 'Sora', sans-serif; font-weight: 600; font-size: 18px; letter-spacing: .08em; }
  .logo-mark { width: 24px; height: 24px; display: grid; place-items: center; }
  .nav-links { display: flex; gap: 36px; font-size: 13px; color: var(--ink-2); font-weight: 400; }
  .nav-links a:hover { color: var(--accent); }
  .nav-cta { display: flex; align-items: center; gap: 8px; }
  .nav-cta .btn { padding: 10px 16px; font-size: 12.5px; }
  @media (max-width: 900px) { .nav-links { display: none; } }

  /* ---------- HERO ---------- */
  .hero {
    padding: 80px 0 60px; border-bottom: 1px solid var(--rule);
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
    display: grid; grid-template-columns: 1.15fr .85fr; gap: 72px; align-items: end;
    position: relative;
  }
  @media (max-width: 980px) { .hero-grid { grid-template-columns: 1fr; gap: 40px; } }

  .hero h1 {
    font-family: 'Sora', sans-serif;
    font-weight: 300;
    font-size: clamp(44px, 6.6vw, 96px);
    line-height: .98; letter-spacing: -.03em;
    margin: 24px 0 0; color: var(--ink);
  }
  .hero h1 b { font-weight: 500; color: var(--accent); }
  .hero-sub {
    margin: 32px 0 0; font-size: 17px; line-height: 1.55; color: var(--ink-2);
    max-width: 46ch; font-weight: 400;
  }
  .hero-bullets {
    margin: 32px 0 0; padding: 0; list-style: none;
    display: flex; flex-direction: column; gap: 12px;
    font-size: 13.5px; color: var(--ink-2);
  }
  .hero-bullets li { display: flex; align-items: center; gap: 12px; }
  .hero-bullets .chk {
    width: 18px; height: 18px; border-radius: 999px; background: transparent;
    border: 1px solid var(--accent);
    display: grid; place-items: center; flex: 0 0 auto;
  }
  .hero-bullets .chk svg { width: 9px; height: 9px; color: var(--accent); }
  .hero-cta { margin-top: 40px; display: flex; gap: 12px; flex-wrap: wrap; }

  /* hero right — composite panel */
  .hero-panel {
    background: linear-gradient(180deg, var(--card), var(--bg-2));
    border: 1px solid var(--rule);
    border-radius: 20px; padding: 28px; position: relative;
    box-shadow: 0 24px 60px rgba(0,0,0,.22), inset 0 1px 0 rgba(255,255,255,.04);
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
  .section { padding: 130px 0; border-bottom: 1px solid var(--rule); position: relative; }
  .section-head {
    display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: end;
    margin-bottom: 72px;
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
    border-radius: 20px; padding: 28px 28px 22px; position: relative;
  }
  .chart-head { display: flex; justify-content: space-between; align-items: flex-start; }
  .chart-head .title { font-size: 11px; color: var(--ink-3); font-family: 'JetBrains Mono', monospace; letter-spacing: .14em; text-transform: uppercase; }
  .chart-head .range { display: flex; gap: 2px; background: var(--bg-2); border-radius: 999px; padding: 3px; border: 1px solid var(--rule); }
  .chart-head .range button {
    font-size: 11px; padding: 5px 12px; border-radius: 999px;
    color: var(--ink-3); font-family: 'JetBrains Mono', monospace; letter-spacing: .08em;
  }
  .chart-head .range .on { background: var(--ink); color: var(--bg); }
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
    border-radius: 20px; padding: 28px 24px; position: relative;
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
  .alloc-card { background: linear-gradient(180deg, var(--card), var(--bg-3)); border: 1px solid var(--rule); border-radius: 24px; padding: 40px; position: relative; box-shadow: 0 24px 60px rgba(0,0,0,.22); }
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
    border: 1px solid rgba(201,169,97,.32); border-radius: 24px;
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
    aspect-ratio: 4/5; background: var(--bg-3); border-radius: 20px; overflow: hidden; position: relative;
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
  .faq-btn .pm { width: 32px; height: 32px; border-radius: 999px; border: 1px solid var(--rule-strong); display: grid; place-items: center; flex: 0 0 auto; transition: background .2s, color .2s, transform .3s, border-color .2s; font-size: 14px; color: var(--ink-3); }
  .faq-item.open .faq-btn .pm { background: var(--accent); color: #1a1308; transform: rotate(45deg); border-color: var(--accent); }
  .faq-body { max-height: 0; overflow: hidden; transition: max-height .4s ease; color: var(--ink-2); font-size: 15.5px; line-height: 1.65; }
  .faq-body-inner { padding: 0 0 30px; max-width: 72ch; }
  .faq-item.open .faq-body { max-height: 400px; }

  /* ---------- BIG CTA ---------- */
  .big-cta { padding: 140px 0 180px; text-align: center; position: relative; overflow: hidden; }
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
  .rise { animation: rise .9s cubic-bezier(.2,.7,.2,1) both; }
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
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M16 3L3 29h5.5l2-4h11l2 4H29L16 3z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          <path d="M12 21h8l-4-8-4 8z" fill="var(--accent)"/>
        </svg>
      </span>
      <span>ARVO</span>
    </a>
    <nav class="nav-links">
      <a href="#carteiras">Carteiras</a>
      <a href="#como-funciona">Método</a>
      <a href="#assinatura">Assinatura</a>
      <a href="#faq">Dúvidas</a>
    </nav>
    <div class="nav-cta">
      <a href="/login" class="btn btn-ghost">Entrar</a>
      <a href="/register" class="btn btn-primary">Fazer diagnóstico gratuito <span class="arr">→</span></a>
    </div>
  </div>
</header>

<!-- HERO -->
<section class="hero">
  <div class="wrap hero-grid">
    <div>
      <div class="eyebrow rise"><span class="dot"></span>Orientação financeira independente · Fee-only · Zero comissão</div>
      <h1 class="rise rise-2" style="font-size: clamp(40px, 5.5vw, 76px);">
        Você sabe quanto guardar,<br>onde investir e<br><b>quando pode parar?</b>
      </h1>
      <p class="hero-sub rise rise-3" style="font-size: 20px; color: var(--ink); font-weight: 500; margin-top: 24px;">
        A maioria não sabe. A ARVO responde — e te acompanha até lá.
      </p>
      <p class="hero-sub rise rise-3" style="margin-top: 16px;">
        Carteira montada, planejamento financeiro estruturado e acompanhamento contínuo. Sem comissão, sem produto empurrado, sem conflito de interesse. Uma assinatura. Tudo incluso.
      </p>
      <ul class="hero-bullets rise rise-3">
        <li><span class="chk"><svg viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5L8.5 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span> Saiba em quantos anos pode conquistar sua independência financeira — com números, não palpite</li>
        <li><span class="chk"><svg viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5L8.5 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span> Receba uma carteira pronta para o seu perfil, acompanhada mês a mês</li>
        <li><span class="chk"><svg viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5L8.5 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span> Descubra se o que você guarda hoje é suficiente — ou o que precisa mudar</li>
      </ul>
      <div class="hero-cta rise rise-4">
        <a href="/register" class="btn btn-accent">Fazer meu diagnóstico gratuito <span class="arr">→</span></a>
        <a href="#como-funciona" class="btn btn-ghost">Ver como funciona ↓</a>
      </div>
      <div style="margin-top: 24px; font-size: 12.5px; color: var(--ink-3); font-family: 'JetBrains Mono', monospace; letter-spacing: .04em;">
        ✓ 5 min · ✓ Sem cartão · ✓ Resultado imediato
      </div>
    </div>

    <aside class="hero-panel rise rise-4">
      <div class="hp-top">
        <span>Carteiras ARVO · Resultado</span>
        <span class="live"><i></i>Em acompanhamento</span>
      </div>
      <div class="hp-value">
        <div class="amount tab"><span class="pct" style="font-size: 0.65em; line-height: 1.1; display: block; padding: 4px 0;">Carteira para seu perfil</span></div>
      </div>
      <div class="hp-cap">Da reserva ao perfil arrojado — uma carteira para cada momento de vida</div>

      <div class="hp-chart">
        <svg viewBox="0 0 500 84" preserveAspectRatio="none">
          <defs>
            <linearGradient id="hpg" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stop-color="var(--accent)" stop-opacity=".28"/>
              <stop offset="1" stop-color="var(--accent)" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <path d="M0,66 C50,62 80,60 120,52 C160,44 190,48 230,36 C270,24 310,30 350,20 C390,10 430,16 500,6"
                fill="none" stroke="var(--accent)" stroke-width="2" class="draw-me"/>
          <path d="M0,66 C50,62 80,60 120,52 C160,44 190,48 230,36 C270,24 310,30 350,20 C390,10 430,16 500,6 L500,84 L0,84 Z"
                fill="url(#hpg)"/>
          <circle cx="500" cy="6" r="3" fill="var(--accent)"/>
        </svg>
      </div>

      <div class="hp-rows">
        <div class="hp-row">
          <span class="name"><i style="background: rgba(201,169,97,.35)"></i>Abrigo · Reserva</span>
          <span class="bar"><em style="width: 35%; background: rgba(201,169,97,.55)"></em></span>
          <span class="val tab">Conservador</span>
        </div>
        <div class="hp-row">
          <span class="name"><i style="background: rgba(201,169,97,.7)"></i>Ritmo</span>
          <span class="bar"><em style="width: 55%; background: rgba(201,169,97,.8)"></em></span>
          <span class="val tab">Moderado</span>
        </div>
        <div class="hp-row">
          <span class="name"><i style="background: var(--accent)"></i>Visão</span>
          <span class="bar"><em style="width: 78%"></em></span>
          <span class="val tab">Equilibrado</span>
        </div>
        <div class="hp-row">
          <span class="name"><i style="background: rgba(201,169,97,.9)"></i>Oceano</span>
          <span class="bar"><em style="width: 96%"></em></span>
          <span class="val tab">Arrojado</span>
        </div>
      </div>
    </aside>
  </div>
</section>

<!-- CREDIBILIDADE (§01) -->
<section class="section" id="credibilidade" style="background: var(--bg-2); padding: 80px 0;">
  <div class="wrap founder" style="grid-template-columns: 1fr; text-align: center; max-width: 800px; gap: 0;">
    <div class="eyebrow"><span class="dot"></span>§01 · Quem criou</div>
    <h2 style="margin: 16px auto 24px; font-size: clamp(28px, 3.5vw, 42px); line-height: 1.1;">Construído por quem decidiu <b>fazer diferente</b>.</h2>
    <p style="margin: 0 auto; line-height: 1.6;">
      Lucas Matos. Engenheiro, mestre, certificado CFP®, CPA-20 e Ancord. Trabalhou anos no mercado financeiro — e percebeu que o modelo tradicional não foi desenhado para o cliente. Criou a ARVO para construir o que usaria com o próprio dinheiro: orientação real, sem comissão, sem conflito de interesse.
    </p>
    <div class="sig" style="justify-content: center; margin-top: 24px;">
      <span class="chip">Engenheiro</span>
      <span class="chip">Mestrado</span>
      <span class="chip">CFP®</span>
      <span class="chip">CPA-20</span>
      <span class="chip">Ancord</span>
    </div>
  </div>
</section>

<!-- PONTO CEGO (§02) -->
<section class="section" id="ponto-cego">
  <div class="wrap" style="text-align: center; max-width: 860px; margin: 0 auto;">
    <div class="eyebrow" style="margin-bottom: 16px;"><span class="dot"></span>§02 · O ponto cego</div>
    <h2 style="margin: 0 auto 32px; font-size: clamp(32px, 4vw, 56px);">Guardar dinheiro é disciplina.<br>Saber o que fazer com ele é <b>método</b>.</h2>
    <p style="font-size: 18px; color: var(--ink-2); line-height: 1.6;">
      Você faz sua parte: trabalha, poupa, coloca na caixinha ou no fundo que o banco indicou. Mas convive com perguntas que nunca foram respondidas. Quanto eu preciso juntar? Onde é melhor colocar? Será que estou pagando taxa demais? Quando vou poder parar? Essas perguntas não se resolvem com mais disciplina. Se resolvem com estrutura.
    </p>
  </div>
</section>

<!-- O QUE É A ARVO (§03) -->
<section class="section" id="oque-e" style="background: var(--bg-2);">
  <div class="wrap">
    <div class="section-head">
      <div>
        <div class="eyebrow"><span class="dot"></span>§03 · O que é a ARVO</div>
        <h2>Orientação financeira.<br><b>Sem comissão</b>. Sem conflito.</h2>
      </div>
      <p class="lede">
        A ARVO é uma plataforma independente de orientação financeira. Funciona por assinatura fixa — não ganhamos comissão sobre nenhum produto, não recebemos rebate e não temos meta de captação. O único incentivo é que você tome boas decisões e continue.
      </p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
      <div style="background: var(--card); border: 1px solid var(--rule); border-radius: 20px; padding: 40px;">
        <h4 style="font-family: 'Sora', sans-serif; font-size: 22px; font-weight: 500; margin-bottom: 16px; color: var(--accent);">Independente</h4>
        <p style="color: var(--ink-2); font-size: 15px; line-height: 1.6; margin: 0;">Não vendemos produto financeiro. Não recebemos de banco, corretora ou gestora. A recomendação é 100% alinhada com o seu interesse.</p>
      </div>
      <div style="background: var(--card); border: 1px solid var(--rule); border-radius: 20px; padding: 40px;">
        <h4 style="font-family: 'Sora', sans-serif; font-size: 22px; font-weight: 500; margin-bottom: 16px; color: var(--accent);">Por método</h4>
        <p style="color: var(--ink-2); font-size: 15px; line-height: 1.6; margin: 0;">Toda decisão parte de um planejamento. Primeiro entendemos o que você precisa. Depois montamos a carteira. Nunca o contrário.</p>
      </div>
      <div style="background: var(--card); border: 1px solid var(--rule); border-radius: 20px; padding: 40px;">
        <h4 style="font-family: 'Sora', sans-serif; font-size: 22px; font-weight: 500; margin-bottom: 16px; color: var(--accent);">Com acompanhamento</h4>
        <p style="color: var(--ink-2); font-size: 15px; line-height: 1.6; margin: 0;">A ARVO não entrega um plano e desaparece. Relatórios, rebalanceamento, reuniões e suporte — enquanto você for assinante.</p>
      </div>
    </div>
  </div>
</section>

<!-- CARTEIRAS (§04) -->
<section class="section" id="carteiras">
  <div class="wrap">
    <div class="section-head">
      <div>
        <div class="eyebrow"><span class="dot"></span>§04 · Carteiras</div>
        <h2 style="font-size: clamp(32px, 4.2vw, 56px);">Quatro carteiras. <b>Resultado aberto</b>. Atualização contínua.</h2>
      </div>
      <p class="lede">
        Cada carteira ARVO é monitorada mês a mês. Você acompanha a performance comparada ao CDI, sem maquiagem. O resultado está ali, transparente.
      </p>
    </div>

    <div class="portfolios" style="margin-bottom: 64px;">
      <article class="pf">
        <div class="pf-top"><span>01 · Reserva</span><span>Conservadora</span></div>
        <h3>Abrigo</h3>
        <p class="pf-tag">Selic, liquidez diária. Dinheiro que você pode precisar amanhã.</p>
        <div class="pf-foot">
          <div class="pf-perf">Liquidez<small>imediata</small></div>
          <div class="pf-bar"><i style="width: 35%"></i></div>
          <div class="pf-foot-meta"><span>Selic · RF</span><span>σ baixo</span></div>
        </div>
      </article>

      <article class="pf">
        <div class="pf-top"><span>02 · Conservadora+</span><span>Conservadora / Moderada</span></div>
        <h3>Ritmo</h3>
        <p class="pf-tag">80% Selic, 20% diversificação. Para quem quer sair do básico sem susto.</p>
        <div class="pf-foot">
          <div class="pf-perf">Diversifica<small>renda fixa</small></div>
          <div class="pf-bar"><i style="width: 55%"></i></div>
          <div class="pf-foot-meta"><span>RF · IPCA · Pré</span><span>σ baixo+</span></div>
        </div>
      </article>

      <article class="pf">
        <div class="pf-top"><span>03 · Moderado</span><span>Equilibrada</span></div>
        <h3>Visão</h3>
        <p class="pf-tag">Renda fixa + variável controlada. Crescer com os pés no chão.</p>
        <div class="pf-foot">
          <div class="pf-perf">Crescimento<small>controlado</small></div>
          <div class="pf-bar"><i style="width: 78%"></i></div>
          <div class="pf-foot-meta"><span>Inflação · Ações · Multi</span><span>σ moderado</span></div>
        </div>
      </article>

      <article class="pf">
        <div class="pf-top"><span>04 · Arrojado</span><span>Arrojada</span></div>
        <h3>Oceano</h3>
        <p class="pf-tag">Ações, multimercado, longo prazo. Para quem entende que volatilidade é preço, não risco.</p>
        <div class="pf-foot">
          <div class="pf-perf">Arrojado<small>longo prazo</small></div>
          <div class="pf-bar"><i style="width: 96%"></i></div>
          <div class="pf-foot-meta"><span>Ações · Multimercados</span><span>σ alto</span></div>
        </div>
      </article>
    </div>

    <!-- GRÁFICO DE PERFORMANCE -->
    <div class="perf-block" style="grid-template-columns: 1fr;">
      <div class="chart">
        <div class="chart-head">
          <div class="title">Carteira ARVO vs. CDI</div>
          <div class="range">
            <button onclick="updateChart('3M')">3M</button>
            <button onclick="updateChart('6M')">6M</button>
            <button onclick="updateChart('1A')">1A</button>
            <button class="on" onclick="updateChart('Total')">Total</button>
          </div>
        </div>
        <svg id="perfChart" viewBox="0 0 700 300" preserveAspectRatio="none" style="overflow: visible;">
          <defs>
            <linearGradient id="perfG" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stop-color="var(--accent)" stop-opacity=".12"/>
              <stop offset="1" stop-color="var(--accent)" stop-opacity="0"/>
            </linearGradient>
          </defs>
          
          <g id="chartYLabels" font-family="'Space Grotesk', sans-serif" font-size="11" fill="var(--ink-4)" text-anchor="end">
            <text x="50" y="10" font-weight="600" fill="var(--ink-3)" id="yAxisTitle">Retorno %</text>
            <text x="50" y="254" class="y-label">0%</text>
            <text x="50" y="196.5" class="y-label">20%</text>
            <text x="50" y="139" class="y-label">40%</text>
            <text x="50" y="81.5" class="y-label">60%</text>
            <text x="50" y="24" class="y-label">80%</text>
            
            <g stroke="var(--rule)" stroke-width="1" opacity="0.4">
              <line x1="60" y1="250" x2="680" y2="250"/>
              <line x1="60" y1="192.5" x2="680" y2="192.5"/>
              <line x1="60" y1="135" x2="680" y2="135"/>
              <line x1="60" y1="77.5" x2="680" y2="77.5"/>
              <line x1="60" y1="20" x2="680" y2="20"/>
            </g>
          </g>

          <g id="chartXLabels" font-family="'Space Grotesk', sans-serif" font-size="11" fill="var(--ink-4)" text-anchor="middle">
            <text x="60" y="275" class="x-label">jan. 23</text>
            <text x="163" y="275" class="x-label">jul. 23</text>
            <text x="266" y="275" class="x-label">jan. 24</text>
            <text x="369" y="275" class="x-label">jul. 24</text>
            <text x="473" y="275" class="x-label">jan. 25</text>
            <text x="576" y="275" class="x-label">jul. 25</text>
            <text x="680" y="275" class="x-label">jan. 26</text>
          </g>

          <path id="pathCDI" d="M60.0,250.0 L77.2,247.4 L94.4,244.8 L111.7,242.2 L128.9,239.5 L146.1,236.9 L163.3,234.2 L180.6,231.5 L197.8,228.7 L215.0,225.9 L232.2,223.1 L249.4,220.2 L266.7,217.2 L283.9,214.2 L301.1,211.3 L318.3,208.3 L335.6,205.2 L352.8,202.2 L370.0,199.2 L387.2,196.2 L404.4,193.2 L421.7,190.1 L438.9,187.0 L456.1,183.8 L473.3,180.7 L490.6,176.8 L507.8,172.7 L525.0,168.7 L542.2,164.5 L559.4,160.3 L576.7,155.9 L593.9,151.7 L611.1,147.4 L628.3,142.9 L645.6,138.5 L662.8,134.1 L680.0,129.5" fill="none" stroke="var(--ink-4)" stroke-width="1.5" stroke-dasharray="4 5" style="transition: d 0.4s ease;"/>
          <path id="pathABRIGO" d="M60.0,250.0 L77.2,247.5 L94.4,244.6 L111.7,242.0 L128.9,239.4 L146.1,236.8 L163.3,233.9 L180.6,231.0 L197.8,228.2 L215.0,225.3 L232.2,222.2 L249.4,219.1 L266.7,216.1 L283.9,213.3 L301.1,210.1 L318.3,207.0 L335.6,203.9 L352.8,200.7 L370.0,197.6 L387.2,194.5 L404.4,191.3 L421.7,188.2 L438.9,185.0 L456.1,181.9 L473.3,178.8 L490.6,174.8 L507.8,170.4 L525.0,166.2 L542.2,161.9 L559.4,157.8 L576.7,153.5 L593.9,148.9 L611.1,144.5 L628.3,139.9 L645.6,135.5 L662.8,131.0 L680.0,126.4" fill="none" stroke="rgba(201,169,97,.4)" stroke-width="2" stroke-linecap="round" style="transition: d 0.4s ease;"/>
          <path id="pathRITMO" d="M60.0,250.0 L77.2,247.0 L94.4,243.5 L111.7,240.5 L128.9,237.5 L146.1,235.4 L163.3,232.3 L180.6,228.9 L197.8,226.2 L215.0,222.8 L232.2,220.6 L249.4,217.3 L266.7,214.4 L283.9,210.8 L301.1,207.7 L318.3,203.6 L335.6,199.9 L352.8,196.5 L370.0,192.6 L387.2,190.1 L404.4,187.0 L421.7,183.0 L438.9,180.1 L456.1,177.3 L473.3,174.2 L490.6,169.2 L507.8,162.5 L525.0,156.6 L542.2,152.3 L559.4,147.5 L576.7,141.5 L593.9,135.6 L611.1,130.0 L628.3,124.3 L645.6,118.1 L662.8,111.4 L680.0,105.3" fill="none" stroke="rgba(201,169,97,.7)" stroke-width="2" stroke-linecap="round" style="transition: d 0.4s ease;"/>
          <path id="pathVISAO" d="M60.0,250.0 L77.2,244.5 L94.4,239.2 L111.7,237.3 L128.9,232.7 L146.1,230.4 L163.3,228.0 L180.6,223.5 L197.8,219.3 L215.0,220.8 L232.2,217.7 L249.4,213.1 L266.7,213.9 L283.9,208.4 L301.1,204.3 L318.3,198.7 L335.6,197.6 L352.8,192.9 L370.0,188.6 L387.2,185.9 L404.4,185.2 L421.7,181.1 L438.9,174.8 L456.1,171.6 L473.3,166.9 L490.6,164.6 L507.8,156.6 L525.0,150.8 L542.2,144.2 L559.4,139.5 L576.7,128.0 L593.9,122.3 L611.1,115.3 L628.3,106.3 L645.6,98.7 L662.8,91.8 L680.0,81.9" fill="none" stroke="var(--ink)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="transition: d 0.4s ease;"/>
          <path id="areaVISAO" d="M60.0,250.0 L77.2,244.5 L94.4,239.2 L111.7,237.3 L128.9,232.7 L146.1,230.4 L163.3,228.0 L180.6,223.5 L197.8,219.3 L215.0,220.8 L232.2,217.7 L249.4,213.1 L266.7,213.9 L283.9,208.4 L301.1,204.3 L318.3,198.7 L335.6,197.6 L352.8,192.9 L370.0,188.6 L387.2,185.9 L404.4,185.2 L421.7,181.1 L438.9,174.8 L456.1,171.6 L473.3,166.9 L490.6,164.6 L507.8,156.6 L525.0,150.8 L542.2,144.2 L559.4,139.5 L576.7,128.0 L593.9,122.3 L611.1,115.3 L628.3,106.3 L645.6,98.7 L662.8,91.8 L680.0,81.9 L680,250 L60,250 Z" fill="url(#perfG)" style="transition: d 0.4s ease;"/>
          <path id="pathOCEANO" d="M60.0,250.0 L77.2,252.9 L94.4,248.5 L111.7,236.2 L128.9,231.3 L146.1,231.6 L163.3,230.0 L180.6,234.3 L197.8,231.1 L215.0,219.5 L232.2,221.4 L249.4,217.8 L266.7,216.1 L283.9,197.4 L301.1,185.1 L318.3,177.4 L335.6,166.9 L352.8,163.2 L370.0,165.5 L387.2,156.3 L404.4,150.5 L421.7,151.9 L438.9,150.9 L456.1,146.2 L473.3,150.5 L490.6,140.1 L507.8,133.7 L525.0,126.1 L542.2,126.0 L559.4,114.3 L576.7,111.7 L593.9,106.0 L611.1,95.5 L628.3,90.0 L645.6,81.2 L662.8,77.3 L680.0,68.7" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transition: d 0.4s ease;"/>
        </svg>
        <div class="chart-legend" style="flex-wrap: wrap; gap: 12px 24px; justify-content: flex-start; margin-left: 60px;">
          <span><i style="background: rgba(201,169,97,.4)"></i> Abrigo <small style="opacity:.6; font-size:11px; margin-left:4px;">(104,22% do CDI · 1,05% am)</small></span>
          <span><i style="background: rgba(201,169,97,.7)"></i> Ritmo <small style="opacity:.6; font-size:11px; margin-left:4px;">(120,98% do CDI · 1,22% am)</small></span>
          <span><i style="background: var(--ink)"></i> Visão <small style="opacity:.6; font-size:11px; margin-left:4px;">(134,14% do CDI · 1,35% am)</small></span>
          <span><i style="background: var(--accent)"></i> Oceano <small style="opacity:.6; font-size:11px; margin-left:4px;">(147,03% do CDI · 1,49% am)</small></span>
          <span><i style="background: var(--ink-4); border: 1px dashed currentColor;"></i> CDI <small style="opacity:.6; font-size:11px; margin-left:4px;">(1,01% am)</small></span>
          <span style="margin-left:auto; color: var(--ink-3); font-size: 11px;">Jan/2023 — Atual · Rentabilidade Acumulada</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- COMO FUNCIONA (§05) -->
<section class="section" id="como-funciona" style="background: var(--bg-2); padding-top: 110px;">
  <div class="wrap">
    <div class="section-head">
      <div>
        <div class="eyebrow"><span class="dot"></span>§05 · Como funciona</div>
        <h2>Três passos. Um processo <b>contínuo</b>.</h2>
      </div>
    </div>
  </div>
  <div class="wrap" style="padding: 0;">
    <div class="method-grid">
      <div class="step" style="background: var(--bg-2);">
        <span class="idx">Passo 1</span>
        <h4>Diagnóstico</h4>
        <p>Você responde um questionário rápido. Sem cadastro, sem cartão. Em 5 minutos descobre seu perfil de risco, sua situação atual e onde estão as lacunas.</p>
        <div class="foot-meta">
          <span class="pips"><i class="on"></i><i></i><i></i></span>
          Sem custo
        </div>
      </div>
      <div class="step" style="background: var(--bg-2);">
        <span class="idx">Passo 2</span>
        <h4>Estratégia</h4>
        <p>Montamos sua carteira e seu planejamento: quanto guardar, onde investir, por quanto tempo e quando pode tirar o pé. Números, não opinião.</p>
        <div class="foot-meta">
          <span class="pips"><i class="on"></i><i class="on"></i><i></i></span>
          Plano estruturado
        </div>
      </div>
      <div class="step" style="background: var(--bg-2);">
        <span class="idx">Passo 3</span>
        <h4>Acompanhamento</h4>
        <p>Rebalanceamento, relatórios, conteúdo, reuniões 1:1. A ARVO fica junto mês a mês — porque orientação financeira não é evento, é processo.</p>
        <div class="foot-meta">
          <span class="pips"><i class="on"></i><i class="on"></i><i class="on"></i></span>
          Contínuo
        </div>
      </div>
    </div>
  </div>
</section>

<!-- PLANEJAMENTO (§06) -->
<section class="section" id="planejamento">
  <div class="wrap">
    <div class="section-head">
      <div>
        <div class="eyebrow"><span class="dot"></span>§06 · Planejamento</div>
        <h2>A pergunta que ninguém responde para você: <b>quanto é suficiente</b>?</h2>
      </div>
      <p class="lede">
        A maioria das pessoas investe sem saber a resposta. Sem ela, qualquer decisão é chute. O planejamento ARVO responde com clareza:
      </p>
    </div>
  </div>

  <div class="wrap split">
    <div>
      <ul style="margin: 0; padding: 0; list-style: none; border-top: 1px solid var(--rule);">
        <li style="padding: 18px 0; border-bottom: 1px solid var(--rule); display: flex; align-items: center; gap: 18px; font-size: 16px;"><span style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--accent); letter-spacing: .1em; width: 24px;">01</span> Quanto precisa acumular para ter liberdade financeira</li>
        <li style="padding: 18px 0; border-bottom: 1px solid var(--rule); display: flex; align-items: center; gap: 18px; font-size: 16px;"><span style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--accent); letter-spacing: .1em; width: 24px;">02</span> Quanto precisa guardar por mês para chegar lá</li>
        <li style="padding: 18px 0; border-bottom: 1px solid var(--rule); display: flex; align-items: center; gap: 18px; font-size: 16px;"><span style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--accent); letter-spacing: .1em; width: 24px;">03</span> Quando pode tirar o pé — com data, não esperança</li>
        <li style="padding: 18px 0; border-bottom: 1px solid var(--rule); display: flex; align-items: center; gap: 18px; font-size: 16px;"><span style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--accent); letter-spacing: .1em; width: 24px;">04</span> Quais ajustes fazer quando a vida muda</li>
      </ul>
    </div>

    <aside class="alloc-card">
      <div class="label">Exemplo · perfil Visão</div>
      <div class="amount tab">Carteira <span style="color:var(--accent)">equilibrada</span></div>
      <div class="donut">
                <svg width="168" height="168" viewBox="0 0 168 168">
          <circle cx="84" cy="84" r="64" fill="none" stroke="rgba(236,231,219,.06)" stroke-width="22"/>
          <circle cx="84" cy="84" r="64" fill="none" stroke="var(--accent)" stroke-width="22"
                  stroke-dasharray="205 402" stroke-dashoffset="0" transform="rotate(-90 84 84)"/>
          <circle cx="84" cy="84" r="64" fill="none" stroke="#a98f55" stroke-width="22"
                  stroke-dasharray="105 402" stroke-dashoffset="-205" transform="rotate(-90 84 84)"/>
          <circle cx="84" cy="84" r="64" fill="none" stroke="#413a2b" stroke-width="22"
                  stroke-dasharray="92 402" stroke-dashoffset="-310" transform="rotate(-90 84 84)"/>
        </svg>
        <div class="leg">
          <div class="row"><span class="l"><i style="background: var(--accent)"></i>Renda Fixa</span><span class="r tab">51%</span></div>
          <div class="row"><span class="l"><i style="background: #a98f55"></i>Ações</span><span class="r tab">26%</span></div>
          <div class="row"><span class="l"><i style="background: #413a2b"></i>Multimercado</span><span class="r tab">23%</span></div>
        </div>
      </div>
    </aside>
  </div>
</section>

<!-- ASSINATURA (§07) -->
<section class="section" id="assinatura" style="background: var(--bg-2);">
  <div class="wrap">
      <div class="section-head">
      <div>
        <div class="eyebrow"><span class="dot"></span>§07 · Assinatura</div>
        <h2 style="font-size: clamp(32px, 4.2vw, 56px);">Um custo que se paga na primeira <b>decisão errada</b> que você evita.</h2>
      </div>
      <p class="lede">
        A ARVO custa R\$ 59,90 por mês. Plano anual, porque orientação financeira séria precisa de tempo para funcionar — assim como qualquer estratégia de investimento.
      </p>
    </div>

    <div class="pricing" style="grid-template-columns: 1fr; max-width: 800px; margin: 0 auto;">
      <div class="plan" style="align-items: center; text-align: center;">
        <div>
          <div class="eyebrow" style="margin-bottom: 14px;"><span class="dot"></span>Plano único</div>
          <h3>Acesso completo ARVO</h3>
        </div>

        <div class="price-row" style="margin-top:24px;">
          <span class="price tab">R\$ 59<span style="font-size:36px;letter-spacing:-.02em">,90</span></span>
          <small>/ mês</small>
        </div>
        <div style="font-size: 13.5px; color: rgba(255,255,255,.78); margin-top: 4px;">
          12 parcelas mensais
        </div>

        <ul class="feat" style="grid-template-columns: 1fr; text-align: left; margin: 32px auto; max-width: 400px; gap: 16px;">
          <li>4 carteiras com acompanhamento mensal</li>
          <li>Planejamento financeiro completo</li>
          <li>Reuniões 1:1 quando você precisar</li>
          <li>Comunidade, relatórios e conteúdo exclusivo</li>
          <li>Chat direto com o time</li>
          <li>Calculadoras e ferramentas</li>
        </ul>

        <div style="display:flex; gap: 12px; margin-top: 16px; position: relative; flex-wrap: wrap; justify-content: center; width: 100%;">
          <a href="/register" class="btn btn-accent" style="font-size: 16px; padding: 18px 32px;">Quero começar <span class="arr">→</span></a>
          <a href="/register" class="btn btn-ghost" style="font-size: 16px; padding: 18px 32px;">Fazer diagnóstico gratuito primeiro</a>
        </div>
        <div style="font-size: 13px; color: rgba(255,255,255,.65); margin-top: 24px; display: flex; align-items: center; gap: 8px; justify-content: center;">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1l1.8 3.65 4.05.6-2.93 2.86.7 4.05L7 10.25 3.38 12.16l.7-4.05L1.15 5.25l4.05-.6L7 1z" stroke="var(--accent)" stroke-width="1.2" fill="var(--accent)"/></svg>
          Garantia de 7 dias. Se não fizer sentido, devolvemos tudo. Sem pergunta.
        </div>
      </div>
    </div>

    <div style="margin: 40px auto 0; max-width: 800px; font-size: 13.5px; color: var(--ink-3); text-align: center; line-height: 1.6;">
      A ARVO foi feita para quem guarda a partir de R\$ 1.000/mês ou tem patrimônio entre R\$ 30 mil e R\$ 3 milhões. Se você está nessa faixa, R\$ 59,90 é irrelevante perto do custo de uma decisão sem orientação.
    </div>
  </div>
</section>

<!-- NA PRÁTICA (§08) -->
<section class="section" id="prova">
  <div class="wrap">
    <div class="section-head" style="grid-template-columns: 1fr; text-align: center;">
      <div class="eyebrow" style="margin-bottom: 16px;"><span class="dot"></span>§08 · Na prática</div>
      <h2>O que muda quando você tem <b>método</b>.</h2>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; max-width: 900px; margin: 0 auto;">
      <div style="background: var(--card); border: 1px solid var(--rule); border-radius: 20px; padding: 40px;">
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .14em; color: var(--ink-3); text-transform: uppercase; margin-bottom: 24px;">Antes</div>
        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 16px; font-size: 15px; color: var(--ink-2);">
          <li><span style="color: var(--ink-4); margin-right: 8px;">✕</span> Dinheiro em CDB do banco e caixinha</li>
          <li><span style="color: var(--ink-4); margin-right: 8px;">✕</span> Sem saber se estava no caminho certo</li>
          <li><span style="color: var(--ink-4); margin-right: 8px;">✕</span> Sem meta ou planejamento estruturado</li>
          <li><span style="color: var(--ink-4); margin-right: 8px;">✕</span> Sem prazo definido para parar</li>
        </ul>
      </div>
      <div style="background: var(--bg); border: 1px solid var(--accent); border-radius: 20px; padding: 40px; position: relative;">
        <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: var(--accent); border-radius: 20px 20px 0 0;"></div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .14em; color: var(--accent); text-transform: uppercase; margin-bottom: 24px;">Depois com ARVO</div>
        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 16px; font-size: 15px; color: var(--ink);">
          <li><span style="color: var(--accent); margin-right: 8px;">✓</span> Carteira Visão (Moderada) estruturada</li>
          <li><span style="color: var(--accent); margin-right: 8px;">✓</span> Foco na rentabilidade global da carteira</li>
          <li><span style="color: var(--accent); margin-right: 8px;">✓</span> Meta mensal de investimento definida</li>
          <li><span style="color: var(--accent); margin-right: 8px;">✓</span> Plano de independência em 19 anos</li>
        </ul>
      </div>
    </div>
    
    <div style="text-align: center; margin-top: 48px; font-size: 18px; font-weight: 500; font-family: 'Sora', sans-serif; max-width: 600px; margin-left: auto; margin-right: auto; line-height: 1.5;">
      "Eu guardava dinheiro todo mês, mas não fazia ideia se estava no caminho certo. Depois do planejamento, pela primeira vez vi uma data real de quando posso parar."
      <div style="font-size: 14px; font-family: 'Space Grotesk', sans-serif; font-weight: 400; color: var(--ink-3); margin-top: 12px;">— Cliente ARVO</div>
    </div>
  </div>
</section>

<!-- FAQ (§09) -->
<section class="section" id="faq" style="background: var(--bg-2);">
  <div class="wrap">
    <div class="section-head">
      <div>
        <div class="eyebrow"><span class="dot"></span>§09 · Dúvidas</div>
        <h2>Antes de decidir.</h2>
      </div>
    </div>

    <div class="faq-list">
      <div class="faq-item open">
        <button class="faq-btn"><h4>Preciso tirar meu dinheiro do meu banco?</h4><span class="pm">+</span></button>
        <div class="faq-body"><div class="faq-body-inner">
          Não. Você mantém seus investimentos onde preferir — BTG, XP, Rico, seu banco. A ARVO orienta a estratégia. A custódia é sua.
        </div></div>
      </div>
      <div class="faq-item">
        <button class="faq-btn"><h4>R\$ 59,90 é pouco. O que tem de pegadinha?</h4><span class="pm">+</span></button>
        <div class="faq-body"><div class="faq-body-inner">
          Nenhuma. Não existe upsell, produto mais caro, nem taxa escondida. O preço é baixo porque o modelo é escalável — não porque a entrega é fraca.
        </div></div>
      </div>
      <div class="faq-item">
        <button class="faq-btn"><h4>Vocês vão investir por mim?</h4><span class="pm">+</span></button>
        <div class="faq-body"><div class="faq-body-inner">
          Não. A ARVO orienta e estrutura. Você executa na sua corretora. Seus ativos, sua custódia, seu controle.
        </div></div>
      </div>
      <div class="faq-item">
        <button class="faq-btn"><h4>Posso testar antes?</h4><span class="pm">+</span></button>
        <div class="faq-body"><div class="faq-body-inner">
          Sim. O diagnóstico é gratuito, sem cartão, e você vê resultado antes de pagar qualquer coisa.
        </div></div>
      </div>
      <div class="faq-item">
        <button class="faq-btn"><h4>Como funciona o cancelamento?</h4><span class="pm">+</span></button>
        <div class="faq-body"><div class="faq-body-inner">
          A assinatura é anual para garantir que o método tenha tempo de funcionar. Se em 7 dias perceber que não é para você, devolvemos 100%. Depois disso, o compromisso é de 12 meses — como qualquer processo sério.
        </div></div>
      </div>
      <div class="faq-item">
        <button class="faq-btn"><h4>Para quem NÃO é a ARVO?</h4><span class="pm">+</span></button>
        <div class="faq-body"><div class="faq-body-inner">
          Para quem busca day trade, dica quente de ação ou promessa de rentabilidade. A ARVO é para quem quer direção, não emoção.
        </div></div>
      </div>
    </div>
  </div>
</section>

<!-- FECHAMENTO (§10) -->
<section class="big-cta">
  <div class="wrap">
    <div style="position: relative; font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .16em; color: var(--accent); text-transform: uppercase; margin-bottom: 24px;">— §10 · Fechamento —</div>
    <h2 style="font-size: clamp(40px, 6vw, 90px);">Cada mês sem direção<br>é um mês <b>no escuro</b>.</h2>
    <p>
      Não é sobre investir mais. É sobre saber para onde está indo. O diagnóstico leva 5 minutos, é gratuito, e já mostra o que você precisa ajustar.
    </p>
    <div class="btns">
      <a href="/register" class="btn btn-accent">Fazer meu diagnóstico gratuito <span class="arr">→</span></a>
    </div>
    <div style="margin-top: 28px; font-size: 12.5px; color: var(--ink-3); font-family: 'JetBrains Mono', monospace; letter-spacing: .04em; position: relative;">
      ✓ 5 min · ✓ Sem cartão · ✓ Sem compromisso
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
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M16 3L3 29h5.5l2-4h11l2 4H29L16 3z" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round"/>
              <path d="M12 21h8l-4-8-4 8z" fill="var(--accent)"/>
            </svg>
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
      <span>ARVO® 2026</span>
      <span>Feito em São Paulo</span>
    </div>
  </div>
</footer>

<script>
  // Range Data
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
  };

  const xLabelsData = {
    Total: ["jan. 23", "jul. 23", "jan. 24", "jul. 24", "jan. 25", "jul. 25", "jan. 26"],
    "1A": ["jan. 25", "mar. 25", "mai. 25", "jul. 25", "set. 25", "nov. 25", "jan. 26"],
    "6M": ["ago. 25", "set. 25", "out. 25", "nov. 25", "dez. 25", "jan. 26"],
    "3M": ["out. 25", "nov. 25", "dez. 25", "jan. 26"]
  };

  const yLabelsData = {
    Total: ["0%", "20%", "40%", "60%", "80%"],
    "1A": ["0%", "6.25%", "12.5%", "18.75%", "25%"],
    "6M": ["0%", "3%", "6%", "9%", "12%"],
    "3M": ["0%", "1.5%", "3%", "4.5%", "6%"]
  };

  window.updateChart = function(range) {
    document.querySelectorAll('.range button').forEach(b => b.classList.remove('on'));
    event.currentTarget.classList.add('on');

    const paths = chartPaths[range];
    document.getElementById('pathCDI').setAttribute('d', paths.CDI);
    document.getElementById('pathABRIGO').setAttribute('d', paths.ABRIGO);
    document.getElementById('pathRITMO').setAttribute('d', paths.RITMO);
    document.getElementById('pathVISAO').setAttribute('d', paths.VISAO);
    document.getElementById('pathOCEANO').setAttribute('d', paths.OCEANO);
    
    const areaPath = paths.VISAO + " L680,250 L60,250 Z";
    document.getElementById('areaVISAO').setAttribute('d', areaPath);

    const yLabels = yLabelsData[range];
    const labelEls = document.querySelectorAll('.y-label');
    labelEls.forEach((el, i) => { if (yLabels[i]) el.textContent = yLabels[i]; });

    const xLabels = xLabelsData[range];
    const xContainer = document.getElementById('chartXLabels');
    xContainer.innerHTML = '';
    const xStep = 620 / (xLabels.length - 1);
    xLabels.forEach((label, i) => {
      const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
      txt.setAttribute("x", 60 + i * xStep);
      txt.setAttribute("y", 275);
      txt.setAttribute("class", "x-label");
      txt.textContent = label;
      xContainer.appendChild(txt);
    });
  };

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
