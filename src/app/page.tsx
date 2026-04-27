
import Head from "next/head";
import Link from "next/link"; 

export default function LandingPage() {
    return (
        <div className="landing-page light" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <style dangerouslySetInnerHTML={{ __html: `
                
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
  .faq-.landing-page { max-height: 0; overflow: hidden; transition: max-height .4s ease; color: var(--ink-2); font-size: 15.5px; line-height: 1.65; }
  .faq-body-inner { padding: 0 0 30px; max-width: 72ch; }
  .faq-item.open .faq-.landing-page { max-height: 400px; }

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
            
            <div dangerouslySetInnerHTML={{ __html: `

<!-- NAV -->
<header class="nav">
  <div class="wrap nav-inner">
    <a href="/login" class="logo">
      <span class="logo-mark">
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M0.0,243.3 L18.4,248.8 L36.8,248.5 L55.3,241.0 L73.7,230.7 L92.1,213.3 L110.5,204.9 L128.9,208.3 L147.4,208.6 L165.8,212.0 L184.2,191.4 L202.6,178.4 L221.1,180.1 L239.5,173.2 L257.9,169.0 L276.3,177.3 L294.7,176.5 L313.2,173.4 L331.6,167.5 L350.0,157.9 L368.4,160.2 L386.8,160.5 L405.3,163.5 L423.7,168.0 L442.1,154.1 L460.5,156.3 L478.9,149.1 L497.4,129.8 L515.8,115.8 L534.2,107.5 L552.6,112.3 L571.1,94.2 L589.5,86.2 L607.9,79.6 L626.3,65.0 L644.7,62.5 L663.2,47.2 L681.6,40.0 L700.0,49.5  L700,280 L0,280 Z"
                fill="url(#perfG)"/>
          <circle cx="700" cy="40" r="5" fill="var(--accent)"/>
          <circle cx="700" cy="40" r="12" fill="var(--accent)" opacity=".2"/>
        </svg>
        <div class="chart-legend">
          <span><i style="background: var(--ink)"></i> Carteira ARVO</span>
          <span><i style="background: var(--ink-4)"></i> CDI · benchmark</span>
          <span style="margin-left:auto; color: var(--ink-3)">Acompanhamento contínuo</span>
        </div>
      </div>

      <div class="perf-stats">
        <div class="cell">
          <div class="k">Abrigo</div>
          <div class="v" style="font-size:32px">Reserva</div>
          <div class="sub">Para sua reserva de emergência, com liquidez diária.</div>
        </div>
        <div class="cell">
          <div class="k">Ritmo</div>
          <div class="v" style="font-size:32px">Conservador+</div>
          <div class="sub">Primeiros passos além da reserva, com mais diversificação.</div>
        </div>
        <div class="cell">
          <div class="k">Visão</div>
          <div class="v" style="font-size:32px">Moderado</div>
          <div class="sub">Equilíbrio entre segurança e crescimento consistente.</div>
        </div>
        <div class="cell">
          <div class="k">Oceano</div>
          <div class="v" style="font-size:32px">Arrojado</div>
          <div class="sub">Maior potencial de retorno para horizontes longos.</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- CARTEIRAS -->
<section class="section" id="carteiras" style="background: var(--bg-2);">
  <div class="wrap">
    <div class="section-head">
      <div>
        <div class="eyebrow"><span class="dot"></span>§02 · Carteiras</div>
        <h2>Uma carteira para <b>cada momento</b> da sua vida.</h2>
      </div>
      <p class="lede">
        Quatro carteiras com mandatos distintos. Toda assinatura começa com a
        Reserva de Emergência e evolui até o perfil arrojado, conforme seu
        planejamento e tolêrancia ao risco.
      </p>
    </div>

    <div class="portfolios">
      <article class="pf">
        <div class="pf-top"><span>01 · Reserva</span><span>Conservadora</span></div>
        <h3>Abrigo</h3>
        <p class="pf-tag">Carteira para sua reserva de emergência, com 100% em Selic via título público. Liquidez diária e segurança máxima.</p>
        <div class="pf-foot">
          <div class="pf-perf">Liquidez<small>imediata</small></div>
          <div class="pf-bar"><i style="width: 35%"></i></div>
          <div class="pf-foot-meta"><span>Selic · RF</span><span>σ baixo</span></div>
        </div>
      </article>

      <article class="pf">
        <div class="pf-top"><span>02 · Conservadora+</span><span>Conservadora / Moderada</span></div>
        <h3>Ritmo</h3>
        <p class="pf-tag">Base em renda fixa com cerca de 80% em Selic e 20% em diversificações estratégicas, para quem quer começar a sair da poupança com segurança.</p>
        <div class="pf-foot">
          <div class="pf-perf">Diversifica<small>renda fixa</small></div>
          <div class="pf-bar"><i style="width: 55%"></i></div>
          <div class="pf-foot-meta"><span>RF · IPCA · Pré</span><span>σ baixo+</span></div>
        </div>
      </article>

      <article class="pf">
        <div class="pf-top"><span>03 · Moderado</span><span>Equilibrada</span></div>
        <h3>Visão</h3>
        <p class="pf-tag">Carteira moderada que soma renda fixa diversificada à entrada controlada em renda variável. Pensada para crescimento consistente acima do CDI no longo prazo.</p>
        <div class="pf-foot">
          <div class="pf-perf">Crescimento<small>controlado</small></div>
          <div class="pf-bar"><i style="width: 78%"></i></div>
          <div class="pf-foot-meta"><span>RF · RV · FII</span><span>σ moderado</span></div>
        </div>
      </article>

      <article class="pf">
        <div class="pf-top"><span>04 · Arrojado</span><span>Arrojada</span></div>
        <h3>Oceano</h3>
        <p class="pf-tag">Carteira arrojada com fundos de ações, multimercados e estratégias diversificadas. Para quem aceita oscilação em troca de maior potencial de retorno no longo prazo.</p>
        <div class="pf-foot">
          <div class="pf-perf">Arrojado<small>longo prazo</small></div>
          <div class="pf-bar"><i style="width: 96%"></i></div>
          <div class="pf-foot-meta"><span>Ações · Multi · Alt</span><span>σ alto</span></div>
        </div>
      </article>
    </div>
  </div>
</section>

<!-- PLANEJAMENTO -->
<section class="section" id="planejamento">
  <div class="wrap">
    <div class="section-head">
      <div>
        <div class="eyebrow"><span class="dot"></span>§03 · Planejamento</div>
        <h2>Planejamento dá a direção. Carteiras <b>executam</b>.</h2>
      </div>
      <p class="lede">
        Você sabe quanto guarda hoje, mas não sabe se isso é suficiente.
        Não sabe quanto, quando, nem onde. A ARVO responde essas três perguntas
        — e mantém a resposta viva ao longo do tempo.
      </p>
    </div>
  </div>

  <div class="wrap split">
    <div>
      <ul style="margin: 0; padding: 0; list-style: none; border-top: 1px solid var(--rule);">
        <li style="padding: 18px 0; border-bottom: 1px solid var(--rule); display: flex; align-items: center; gap: 18px; font-size: 16px;"><span style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--accent); letter-spacing: .1em; width: 24px;">01</span> Onde investir</li>
        <li style="padding: 18px 0; border-bottom: 1px solid var(--rule); display: flex; align-items: center; gap: 18px; font-size: 16px;"><span style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--accent); letter-spacing: .1em; width: 24px;">02</span> Quanto guardar por mês</li>
        <li style="padding: 18px 0; border-bottom: 1px solid var(--rule); display: flex; align-items: center; gap: 18px; font-size: 16px;"><span style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--accent); letter-spacing: .1em; width: 24px;">03</span> Quanto precisa acumular</li>
        <li style="padding: 18px 0; border-bottom: 1px solid var(--rule); display: flex; align-items: center; gap: 18px; font-size: 16px;"><span style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--accent); letter-spacing: .1em; width: 24px;">04</span> Quando você pode tirar o pé do acelerador</li>
        <li style="padding: 18px 0; border-bottom: 1px solid var(--rule); display: flex; align-items: center; gap: 18px; font-size: 16px;"><span style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--accent); letter-spacing: .1em; width: 24px;">05</span> Quais ajustes fazer ao longo do caminho</li>
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

<!-- MÉTODO -->
<section class="section" id="metodo" style="background: var(--bg-2); padding-top: 110px;">
  <div class="wrap">
    <div class="section-head">
      <div>
        <div class="eyebrow"><span class="dot"></span>§04 · Método</div>
        <h2>Uma estrutura simples para <b>decisões melhores</b>.</h2>
      </div>
      <p class="lede">
        Três passos, um processo contínuo. Você responde, nós estruturamos — e a
        plataforma mantém a estratégia viva ao longo do tempo.
      </p>
    </div>
  </div>
  <div class="wrap" style="padding: 0;">
    <div class="method-grid">
      <div class="step" style="background: var(--bg-2);">
        <span class="idx">01 · Diagnóstico</span>
        <h4>Você entra na plataforma e aprende o método.</h4>
        <p>Conteúdo introdutório sobre como pensamos investimentos. Em seguida, questionário de perfil de risco e mapeamento da sua realidade financeira.</p>
        <div class="foot-meta">
          <span class="pips"><i class="on"></i><i></i><i></i></span>
          Método + Questionário
        </div>
      </div>
      <div class="step" style="background: var(--bg-2);">
        <span class="idx">02 · Estratégia</span>
        <h4>Montamos sua carteira e seu planejamento.</h4>
        <p>Com base no seu perfil, montamos a carteira ideal e estruturamos o planejamento financeiro — quanto, quando e onde investir.</p>
        <div class="foot-meta">
          <span class="pips"><i class="on"></i><i class="on"></i><i></i></span>
          Carteira + Plano
        </div>
      </div>
      <div class="step" style="background: var(--bg-2);">
        <span class="idx">03 · Acompanhamento</span>
        <h4>Você segue, com apoio contínuo.</h4>
        <p>Acesso à comunidade, conteúdos exclusivos, vídeos, relatórios e reuniões sob demanda. Atendimento adaptado ao perfil de cada cliente.</p>
        <div class="foot-meta">
          <span class="pips"><i class="on"></i><i class="on"></i><i class="on"></i></span>
          Contínuo · sob demanda
        </div>
      </div>
    </div>
  </div>
</section>

<!-- PRICING -->
<section class="section" id="preco">
  <div class="wrap">
      <div class="section-head">
      <div>
        <div class="eyebrow"><span class="dot"></span>§05 · Assinatura</div>
        <h2>Custa <b>menos que um almoço</b>.<br>Vale por uma vida.</h2>
      </div>
      <p class="lede">
        Um valor pequeno por mês para uma decisão que se paga sozinha — a primeira
        taxa que você evita, o primeiro produto ruim que você não assina, já cobre o ano.
      </p>
    </div>

    <div class="pricing">
      <div class="plan">
        <div>
          <div class="eyebrow" style="margin-bottom: 14px;"><span class="dot"></span>Plano único · Tudo incluso</div>
          <h3>Acesso completo ARVO</h3>
        </div>

        <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .14em; color: rgba(255,255,255,.5); text-transform: uppercase;">De <span style="text-decoration: line-through;">R\$ 199/mês</span> · por tempo limitado</div>
        <div class="price-row" style="margin-top:6px;">
          <span class="price tab">R\$ 59<span style="font-size:36px;letter-spacing:-.02em">,90</span></span>
          <small>/ mês</small>
        </div>
        <div style="font-size: 13.5px; color: rgba(255,255,255,.78); margin-top: -10px;">
          Tudo incluso. Sem upsell. Sem letra miúda.
        </div>

        <ul class="feat">
          <li>4 carteiras prontas para cada perfil</li>
          <li>Planejamento financeiro completo</li>
          <li>Reuniões 1:1 sob demanda</li>
          <li>Comunidade exclusiva ARVO</li>
          <li>Vídeos, relatórios e análises</li>
          <li>Chat direto com nosso time</li>
          <li>Calculadoras e ferramentas</li>
          <li>Acompanhamento contínuo</li>
        </ul>

        <div style="display:flex; gap: 10px; margin-top: 8px; position: relative; flex-wrap: wrap;">
          <a href="/login" class="btn btn-accent">Quero entrar agora <span class="arr">→</span></a>
          <a href="/login" class="btn btn-ghost">Diagnóstico gratuito</a>
        </div>
        <div style="font-size: 12px; color: rgba(255,255,255,.55); margin-top: 8px; display: flex; align-items: center; gap: 8px;">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1l1.8 3.65 4.05.6-2.93 2.86.7 4.05L7 10.25 3.38 12.16l.7-4.05L1.15 5.25l4.05-.6L7 1z" stroke="var(--accent)" stroke-width="1.2" fill="var(--accent)"/></svg>
          Pix · cartão · boleto · Garantia de 7 dias
        </div>
      </div>

      <aside class="projection">
        <div class="label">O que você recebe · Stack de valor</div>

        <div style="margin-top: 18px; display: flex; flex-direction: column; gap: 10px;">
          <div style="display: grid; grid-template-columns: 1fr auto; gap: 14px; padding: 14px 0; border-bottom: 1px solid var(--rule); font-size: 14px;">
            <span style="color: var(--ink-2);">Método ARVO + 4 carteiras prontas</span>
            <span class="tab" style="color: var(--ink-3); text-decoration: line-through;">R\$ 1.200</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr auto; gap: 14px; padding: 14px 0; border-bottom: 1px solid var(--rule); font-size: 14px;">
            <span style="color: var(--ink-2);">Planejamento financeiro completo</span>
            <span class="tab" style="color: var(--ink-3); text-decoration: line-through;">R\$ 800</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr auto; gap: 14px; padding: 14px 0; border-bottom: 1px solid var(--rule); font-size: 14px;">
            <span style="color: var(--ink-2);">Reuniões 1:1 sob demanda</span>
            <span class="tab" style="color: var(--ink-3); text-decoration: line-through;">R\$ 600</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr auto; gap: 14px; padding: 14px 0; border-bottom: 1px solid var(--rule); font-size: 14px;">
            <span style="color: var(--ink-2);">Comunidade + conteúdos exclusivos</span>
            <span class="tab" style="color: var(--ink-3); text-decoration: line-through;">R\$ 480</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr auto; gap: 14px; padding: 16px 0 6px; font-size: 16px;">
            <span style="color: var(--ink); font-weight: 500;">Valor total entregue</span>
            <span class="tab" style="color: var(--ink-3); text-decoration: line-through;">R\$ 3.080</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr auto; gap: 14px; padding: 6px 0 0; font-size: 18px;">
            <span style="color: var(--ink); font-weight: 500;">Você paga apenas</span>
            <span class="tab" style="color: var(--accent); font-weight: 600; font-family: 'Sora', sans-serif; font-size: 28px; letter-spacing: -.02em;">R\$ 59,90</span>
          </div>
        </div>

        <div class="row2">
          <div><div class="k">Cobrança</div><div class="v tab">Mensal</div></div>
          <div><div class="k">Garantia</div><div class="v tab">7 dias</div></div>
        </div>
      </aside>
    </div>

    <div style="margin-top: 32px; padding: 28px 36px; border: 1px dashed var(--rule-strong); border-radius: 16px; display: flex; gap: 24px; align-items: center; flex-wrap: wrap; justify-content: space-between;">
      <div style="display: flex; align-items: center; gap: 18px;">
        <div style="width: 44px; height: 44px; border-radius: 999px; background: var(--accent); display: grid; place-items: center; color: #1a1308; flex: 0 0 auto;">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 1.5l2.85 5.78 6.38.93-4.62 4.5 1.1 6.36L11 16.04l-5.71 3.03 1.1-6.36L1.77 8.21l6.38-.93L11 1.5z" stroke="currentColor" stroke-width="1.4" fill="currentColor"/></svg>
        </div>
        <div>
          <div style="font-family: 'Sora', sans-serif; font-size: 18px; font-weight: 500; letter-spacing: -.01em;">Garantia incondicional de 7 dias</div>
          <div style="color: var(--ink-3); font-size: 13.5px; margin-top: 4px; max-width: 56ch;">Se em uma semana você sentir que a ARVO não é para você, devolvemos 100% do valor. Sem perguntas, sem burocracia. O risco é nosso — não seu.</div>
        </div>
      </div>
      <a href="/login" class="btn btn-ghost">Quero começar agora <span class="arr">→</span></a>
    </div>
  </div>
</section>

<!-- COMPARISON -->
<section class="section" style="background: var(--bg-2);">
  <div class="wrap">
    <div class="section-head">
      <div>
        <div class="eyebrow"><span class="dot"></span>§06 · Modelo</div>
        <h2>A diferença entre quem te <b>orienta</b> e quem te <b>vende</b>.</h2>
      </div>
      <p class="lede">
        Usamos os bancos a favor do cliente — mas não trabalhamos para o
        comercial deles. A ARVO não vende produto. Vende método,
        planejamento e clareza.
      </p>
    </div>

    <div class="compare">
      <div class="col arvo">
        <h4><i></i>ARVO</h4>
        <ul>
          <li><span class="mk">✓</span> Orientação financeira independente</li>
          <li><span class="mk">✓</span> Assinatura fixa, sem comissão por produto</li>
          <li><span class="mk">✓</span> Planejamento como ponto de partida</li>
          <li><span class="mk">✓</span> Método próprio, validado e replicável</li>
          <li><span class="mk">✓</span> Comunidade, conteúdo e reuniões 1:1</li>
        </ul>
      </div>
      <div class="col trad">
        <h4>Gerente / assessor tradicional</h4>
        <ul>
          <li><span class="mk">✕</span> Remuneração ligada à venda de produto</li>
          <li><span class="mk">✕</span> Liga quando precisa bater meta</li>
          <li><span class="mk">✕</span> Empurra COE, previdência, títulos com taxa alta</li>
          <li><span class="mk">✕</span> Sem planejamento estruturado</li>
          <li><span class="mk">✕</span> Conflito de interesse no DNA do modelo</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- FOUNDER -->
<section class="section" id="fundador">
  <div class="wrap founder">
    <div class="founder-photo">
      <div class="ph">RETRATO · FUNDADOR</div>
      <span class="badge">Fundador · ARVO</span>
    </div>
    <div>
      <div class="eyebrow"><span class="dot"></span>§07 · Quem está por trás</div>
      <h2>Método primeiro. <b>Incentivos</b> depois.</h2>
      <p>
        Engenheiro de formação, com mestrado e anos de experiência no mercado financeiro —
        passando por estruturação de FIDCs até atendimento das principais famílias do país em
        uma das maiores casas de investimento do Brasil. Por dentro, viu como o modelo
        comercial funciona — e por que ele raramente está do lado do cliente.
      </p>
      <p style="margin-top: 20px;">
        A ARVO nasceu da decisão de inverter essa lógica: um modelo onde a empresa só ganha
        se o cliente seguir bem orientado. Sem produto empurrado, sem comissão, sem meta de
        venda. Método primeiro. Incentivo depois.
      </p>
      <div class="sig">
        <span class="chip">Engenheiro · Mestrado</span>
        <span class="chip">Ancord</span>
        <span class="chip">CPA-20</span>
        <span class="chip">CFP®</span>
      </div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="section" id="faq" style="background: var(--bg-2);">
  <div class="wrap">
    <div class="section-head">
      <div>
        <div class="eyebrow"><span class="dot"></span>§08 · Dúvidas</div>
        <h2>O que você precisa saber <b>antes</b> de começar.</h2>
      </div>
      <p class="lede">
        As perguntas mais comuns sobre como a ARVO funciona, como cobramos e como
        estruturamos as carteiras.
      </p>
    </div>

    <div class="faq-list">
      <div class="faq-item open">
        <button class="faq-btn"><h4>O que a ARVO faz?</h4><span class="pm">+</span></button>
        <div class="faq-body"><div class="faq-body-inner">
          A ARVO é uma empresa de orientação financeira independente. Por meio de método
          próprio, estruturamos planejamento financeiro e carteiras de investimento para
          transformar seus objetivos de vida em decisões claras de investimento.
        </div></div>
      </div>
      <div class="faq-item">
        <button class="faq-btn"><h4>O que vou receber com a assinatura?</h4><span class="pm">+</span></button>
        <div class="faq-body"><div class="faq-body-inner">
          Quatro carteiras (Abrigo, Ritmo, Visão, Oceano), planejamento financeiro completo,
          reuniões 1:1 sob demanda, comunidade exclusiva, conteúdos e vídeos, ferramentas
          internas, chat e apoio contínuo do time de sucesso do cliente.
        </div></div>
      </div>
      <div class="faq-item">
        <button class="faq-btn"><h4>Como funciona o pagamento e o cancelamento?</h4><span class="pm">+</span></button>
        <div class="faq-body"><div class="faq-body-inner">
          A assinatura é R\$ 59,90/mês — menos que dois cafezinhos por dia. Você contrata
          em 12 parcelas mensais (Pix, cartão ou boleto) garantindo um ciclo completo de
          orientação, e tem garantia incondicional de 7 dias para testar sem risco.
        </div></div>
      </div>
      <div class="faq-item">
        <button class="faq-btn"><h4>A ARVO vai investir por mim?</h4><span class="pm">+</span></button>
        <div class="faq-body"><div class="faq-body-inner">
          Não. A ARVO orienta e estrutura sua carteira e seu planejamento. Você segue
          dono dos seus recursos, na corretora ou banco da sua escolha. Não recebemos
          comissão por produto — nosso único incentivo é você seguir bem orientado.
        </div></div>
      </div>
      <div class="faq-item">
        <button class="faq-btn"><h4>Posso testar antes de fechar?</h4><span class="pm">+</span></button>
        <div class="faq-body"><div class="faq-body-inner">
          O primeiro passo é o diagnóstico gratuito — você responde o questionário e já
          recebe uma visão do seu perfil e do que faz sentido para você. Sem compromisso.
        </div></div>
      </div>
      <div class="faq-item">
        <button class="faq-btn"><h4>Como funciona o atendimento?</h4><span class="pm">+</span></button>
        <div class="faq-body"><div class="faq-body-inner">
          Adapta-se ao seu perfil. Cliente técnico que ama relatório recebe relatório.
          Cliente que quer só a metodologia e seguir sozinho, segue sozinho. Cliente que
          quer reuniões 1:1, agenda quando precisar.
        </div></div>
      </div>
      <div class="faq-item">
        <button class="faq-btn"><h4>Para quem a ARVO é e não é?</h4><span class="pm">+</span></button>
        <div class="faq-body"><div class="faq-body-inner">
          A ARVO é para quem quer organizar a vida financeira com método — tipicamente
          quem consegue guardar a partir de R\$ 1.000/mês e tem patrimônio entre R\$ 30k
          e R\$ 3MM (ou mais). Não servimos quem busca dicas de day trade, produto
          específico (COE, previdência) ou opinião pontual sem método.
        </div></div>
      </div>
    </div>
  </div>
</section>

<!-- BIG CTA -->
<section class="big-cta">
  <div class="wrap">
    <div style="position: relative; font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .16em; color: var(--accent); text-transform: uppercase; margin-bottom: 24px;">— Sua próxima década começa hoje —</div>
    <h2>Menos ruído.<br><b>Mais direção</b>.</h2>
    <p>
      Cada mês sem método é um mês a mais de decisão no escuro. Cada produto
      empurrado é dinheiro que sai do <b>seu</b> bolso. Comece o seu diagnóstico
      em 5 minutos — gratuito, sem cartão, e seu para sempre.
    </p>
    <div class="btns">
      <a href="/login" class="btn btn-accent">Fazer diagnóstico gratuito <span class="arr">→</span></a>
      <a href="#preco" class="btn btn-ghost">Ver preço completo</a>
    </div>
    <div style="margin-top: 28px; font-size: 12.5px; color: var(--ink-3); font-family: 'JetBrains Mono', monospace; letter-spacing: .04em; position: relative;">
      ✓ 5 minutos · ✓ Sem cartão · ✓ Garantia de 7 dias na assinatura
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
      <div><h5>Investimentos</h5>
        <ul>
          <li><a href="/login">Carteiras recomendadas</a></li>
          <li><a href="/login">Visão geral global</a></li>
          <li><a href="/login">Rebalanceamento</a></li>
          <li><a href="/login">Planejamento</a></li>
          <li><a href="/login">Pricing</a></li>
        </ul>
      </div>
      <div><h5>Ferramentas</h5>
        <ul>
          <li><a href="/login">Match de Portfólio</a></li>
          <li><a href="/login">Simulador Aposentadoria</a></li>
          <li><a href="/login">Regra dos 4%</a></li>
        </ul>
      </div>
      <div><h5>Aprenda</h5>
        <ul>
          <li><a href="/login">Blog Educação</a></li>
          <li><a href="/login">Central de Ajuda</a></li>
          <li><a href="/login">Glossário</a></li>
        </ul>
      </div>
      <div><h5>Legal</h5>
        <ul>
          <li><a href="/login">Termos de Uso</a></li>
          <li><a href="/login">Privacidade</a></li>
          <li><a href="/login">Compliance</a></li>
          <li><a href="/login">Segurança</a></li>
        </ul>
      </div>
    </div>
    <div class="fine-print">
      Investimentos financeiros não são garantidos e acarretam riscos, incluindo a possível perda de valor principal investido.
      O desempenho passado ou as projeções apresentadas na plataforma ARVO não são garantias de desempenho futuro.
      [Texto legal oficial da ARVO — enquadramento regulatório, razão social, CNPJ.]
    </div>
    <div class="foot-bot">
      <span>ARVO® Marca Registrada · 2026</span>
      <span>Feito com método em São Paulo, BR</span>
    </div>
  </div>
</footer>

<!-- TWEAKS -->
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js" integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>
<script type="text/babel" src="tweaks-panel.jsx"></script>

<script>
  // Ticker
  (function(){
    const items = [
      ['ARVO', 'Plataforma independente', ''],
      ['Fee-only', 'zero comissão', ''],
      ['CDI', '100% CDI', ''],
      ['IPCA 12m', '[XX%]', ''],
      ['USD/BRL', 'R\$ [XX]', ''],
      ['ARVO', 'Método primeiro', ''],
      ['Carteiras', 'Abrigo · Ritmo · Visão · Oceano', ''],
      ['Planejamento', 'como ponto de partida', ''],
      ['ARVO', 'Sem produto empurrado', ''],
      ['ARVO', 'Clareza por método', ''],
    ];
    const row = items.map(([k,v,c]) =>
      \`<span><b>\${k}</b><span class="\${c}">\${v}</span></span>\`
    ).join('');
    document.getElementById('ticker').innerHTML = row + row;
  })();

  // FAQ
  document.querySelectorAll('.faq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const open = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!open) item.classList.add('open');
    });
  });
</script>

<script type="text/babel">
  const { useEffect } = React;

  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "light": true,
    "accent": "#4a7dbf",
    "variant": "Fintech (claro, verde)"
  }/*EDITMODE-END*/;

  const ACCENTS = {
    "Dourado ARVO":    "#c9a961",
    "Âmbar":           "#d4a017",
    "Verde ARVO":      "#00c46a",
    "Verde floresta":  "#2d6a4f",
    "Azul profundo":   "#4a7dbf",
    "Cobre":           "#c2410c",
  };

  const VARIANTS = {
    "Private banking (escuro, dourado)": { accent: "#c9a961", light: false },
    "Fintech (claro, verde)":            { accent: "#00c46a", light: true  },
    "Editorial (claro, dourado)":        { accent: "#a5884a", light: true  },
  };

  function darken(hex, f=0.76) {
    const h = hex.replace('#','');
    let r=parseInt(h.substr(0,2),16), g=parseInt(h.substr(2,2),16), b=parseInt(h.substr(4,2),16);
    r=Math.round(r*f); g=Math.round(g*f); b=Math.round(b*f);
    return '#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');
  }

  function applyTweaks(t) {
    document.documentElement.classList.toggle('light', !!t.light);
    document.documentElement.style.setProperty('--accent', t.accent);
    document.documentElement.style.setProperty('--accent-deep', darken(t.accent));
  }

  function App() {
    const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

    useEffect(() => { applyTweaks(t); }, [t]);

    const pickVariant = (v) => {
      const preset = VARIANTS[v];
      setTweak('variant', v);
      setTweak('light', preset.light);
      setTweak('accent', preset.accent);
    };

    return (
      <TweaksPanel title="Tweaks · ARVO">
        <TweakSection label="Variação" />
        <TweakRadio
          label="Preset"
          value={t.variant}
          options={Object.keys(VARIANTS)}
          onChange={pickVariant}
        />

        <TweakSection label="Tema" />
        <TweakToggle
          label="Modo claro"
          value={t.light}
          onChange={(v) => setTweak('light', v)}
        />

        <TweakSection label="Accent" />
        <TweakRadio
          label="Cor"
          value={Object.keys(ACCENTS).find(k => ACCENTS[k] === t.accent) || 'custom'}
          options={Object.keys(ACCENTS)}
          onChange={(v) => setTweak('accent', ACCENTS[v])}
        />
        <TweakColor
          label="Custom"
          value={t.accent}
          onChange={(v) => setTweak('accent', v)}
        />
      </TweaksPanel>
    );
  }

  const mount = document.createElement('div');
  document.body.appendChild(mount);
  ReactDOM.createRoot(mount).render(<App />);
</script>

` }} />
        </div>
    );
}
