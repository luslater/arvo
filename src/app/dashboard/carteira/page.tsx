"use client"

import React, { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { useSession } from "next-auth/react"
import { Pencil, Check, X, TrendingUp, Wallet, PiggyBank, BarChart3 } from "lucide-react"
import { HISTORICAL_DATA } from "@/data/historicalData"
import { RECOMMENDED_PORTFOLIOS, TIER_ORDER, TIER_LABEL, TIER_DEFAULT_VALUE, ITYPE_ORDER, ITYPE_LABEL, PERFIL_ORDER } from "@/data/portfoliosData"

const formatBRL = (val: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(val)

const parseBRL = (val: string) => {
    const clean = val.replace(/\D/g, "")
    return clean === "" ? 0 : parseInt(clean, 10)
}

interface DashboardData {
    totalCarteira: number
    saldo: number
    emergencyFund: number
    portfolioType: string | null
    monthlyContribution: number
    desiredLifestyleCost: number
    investmentPeriod: number
    expectedReturn: number
    userName: string
}

function EditableMetric({
    label, value, onSave, prefix = "R$", suffix = ""
}: {
    label: string
    value: number
    onSave: (val: number) => void
    prefix?: string
    suffix?: string
}) {
    const [editing, setEditing] = useState(false)
    const [input, setInput] = useState("")

    const display = prefix === "R$"
        ? formatBRL(value)
        : `${value.toLocaleString("pt-BR")}${suffix}`

    const handleSave = () => {
        const parsed = prefix === "R$" ? parseBRL(input) : parseFloat(input.replace(",", "."))
        if (!isNaN(parsed)) onSave(parsed)
        setEditing(false)
    }

    if (editing) {
        return (
            <div className="flex items-center gap-1 mt-1">
                {prefix === "R$" && <span className="text-[13px] text-dash-text-muted">R$</span>}
                <input
                    autoFocus
                    type="text"
                    defaultValue={prefix === "R$" ? value.toString() : value.toString()}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") setEditing(false) }}
                    className="w-28 border-b-2 border-dash-accent bg-transparent text-[22px] font-serif text-dash-text outline-none"
                />
                <button onClick={handleSave} className="text-emerald-600 hover:text-emerald-700"><Check className="w-4 h-4" /></button>
                <button onClick={() => setEditing(false)} className="text-dash-text-light hover:text-dash-danger"><X className="w-4 h-4" /></button>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-1.5 group">
            <div className="font-serif text-[26px] text-dash-text tracking-tight">{display}</div>
            <button
                onClick={() => { setInput(value.toString()); setEditing(true) }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-dash-surface-active rounded-md"
            >
                <Pencil className="w-3 h-3 text-dash-text-muted" />
            </button>
        </div>
    )
}

export default function MinhaCarteiraPage() {
  const initialized = useRef(false);
  const { data: session } = useSession()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
      setLoading(true)
      try {
          const [profileRes, planRes] = await Promise.all([
              fetch(`/api/user/profile?t=${Date.now()}`, { cache: "no-store", headers: { "Cache-Control": "no-cache, no-store, must-revalidate" }, credentials: "include" }),
              fetch(`/api/user/financial-plan?t=${Date.now()}`, { cache: "no-store", headers: { "Cache-Control": "no-cache, no-store, must-revalidate" }, credentials: "include" })
          ])
          if (!profileRes.ok) return;
          const profile = await profileRes.json()
          const plan = planRes.ok ? await planRes.json() : null
          setData({
              totalCarteira: profile?.totalCarteira ?? 0,
              saldo: profile?.saldo ?? 0,
              emergencyFund: profile?.emergencyFund ?? 0,
              portfolioType: profile?.portfolioType ?? null,
              monthlyContribution: plan?.monthlyContribution ?? 0,
              desiredLifestyleCost: plan?.desiredLifestyleCost ?? 0,
              investmentPeriod: plan?.investmentPeriod ?? 20,
              expectedReturn: plan?.expectedReturn ?? 12,
              userName: session?.user?.name?.split(" ")[0] ?? "Olá",
          })
      } catch (e) {
          console.error(e)
      } finally {
          setLoading(false)
      }
  }

  useEffect(() => {
      if (session?.user) loadData()
  }, [session])

  const saveProfile = async (updates: Partial<{ totalCarteira: number; saldo: number; emergencyFund: number }>) => {
      await fetch("/api/user/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates)
      })
      setData(prev => prev ? { ...prev, ...updates } : prev)
  }

  const savePlan = async (updates: Partial<{ monthlyContribution: number; desiredLifestyleCost: number; investmentPeriod: number; expectedReturn: number }>) => {
      const current = data!
      await fetch("/api/user/financial-plan", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              desiredLifestyleCost: current.desiredLifestyleCost,
              monthlyContribution: current.monthlyContribution,
              investmentPeriod: current.investmentPeriod,
              expectedReturn: current.expectedReturn,
              ...updates
          })
      })
      setData(prev => prev ? { ...prev, ...updates } : prev)
  }

  useEffect(() => {
    initApp();
  }); // Run on EVERY render to ensure it re-attaches if DOM is wiped

  const initApp = () => {
    // Wait for Chart.js to be available on window
    if (typeof window === 'undefined' || !(window as any).Chart) {
      setTimeout(initApp, 100);
      return;
    }

    const canvas = document.getElementById('chart') as HTMLCanvasElement;
    if (!canvas) {
      setTimeout(initApp, 100);
      return;
    }

    // Check if chart is already drawn on THIS specific canvas instance
    if (canvas.getAttribute('data-chart-rendered') === 'true') {
       return; // Already initialized on this DOM node
    }
    canvas.setAttribute('data-chart-rendered', 'true');

    // Wrap the provided JS in an IIFE to prevent polluting global scope and handle strict mode
    (function () {

      const DATA = HISTORICAL_DATA;
            const FUND_BY_NAME: any = {};
      DATA.funds.forEach(f => FUND_BY_NAME[f.name] = f);
      const N = DATA.months.length;

      function wealthCurve(monthlyReturns: any){
        let w = 1;
        const arr = [1];
        if (Array.isArray(monthlyReturns)) {
          for (const r of monthlyReturns){ w *= (1 + (r || 0)); arr.push(w); }
        } else {
          for (let i = 0; i < (N || 0); i++) arr.push(1);
        }
        return arr;
      }
      const CDI_WEALTH = wealthCurve(DATA.cdi);
      const IPCA_WEALTH = wealthCurve(DATA.ipca);
      const IBOV_WEALTH = wealthCurve(DATA.ibov);
      const ABRIGO_WEALTH = wealthCurve(DATA.abrigo);
      const RITMO_WEALTH = wealthCurve(DATA.ritmo);
      const VISAO_WEALTH = wealthCurve(DATA.visao);
      const OCEANO_WEALTH = wealthCurve(DATA.oceano);
      const CDI_FINAL = CDI_WEALTH[CDI_WEALTH.length - 1];

      const CLASSE_COLOR_HEX: any = {Zaga:'#3b82f6', Meio:'#f59e0b', Ataque:'#ef4444', '?':'#9aa0b8', Personalizado:'#8b5cf6'};

      function computeFundStats(values: any){
        const wealth = wealthCurve(values);
        const finalW = wealth[wealth.length - 1];
        const annRet = Math.pow(finalW, 12 / N) - 1;
        const mean = values.reduce((a:any,b:any)=>a+b,0) / N;
        const variance = values.reduce((a:any,b:any)=>a + Math.pow(b-mean,2), 0) / Math.max(1, N-1);
        const vol = Math.sqrt(variance) * Math.sqrt(12);
        let peak = wealth[0], maxDD = 0;
        for (const w of wealth){ if (w > peak) peak = w; const dd = w/peak - 1; if (dd < maxDD) maxDD = dd; }
        return { annRet, vol, maxDD };
      }
      const FUND_STATS: any = {};
      DATA.funds.forEach(f => { FUND_STATS[f.name] = computeFundStats(f.values); });

      const PALETTE = ['#4f6df5','#a855f7','#f59e0b','#16a34a','#ef4444','#0ea5e9','#ec4899','#84cc16'];
      let nextId = 1;
      let nextColorIdx = 0;

      const DEFAULT_PORTFOLIO_VALUE = 100000;

      function formatBRL(n: any){
        if (n === null || n === undefined || isNaN(n)) return '';
        return (Math.round(n * 100) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }

      function makePortfolio(name: any, holdings: any, totalValue: any = null){
        const tv = (totalValue !== null && totalValue !== undefined && !isNaN(totalValue) && totalValue > 0) ? totalValue : DEFAULT_PORTFOLIO_VALUE;
        const p = { id: nextId++, name, color: PALETTE[nextColorIdx % PALETTE.length], holdings: holdings || [], totalValue: tv, tag: '', pairWithId: null as any };
        nextColorIdx++;
        return p;
      }

                                    
      function findRecommended(tier: any, itype: any, perfil: any){
        return RECOMMENDED_PORTFOLIOS.find(r => r.tier === tier && r.itype === itype && r.perfil === perfil);
      }

      function buildRecommendedPortfolio(tier: any, itype: any, perfil: any){
        const rec = findRecommended(tier, itype, perfil);
        if (!rec) return null;
        const holdings = Object.entries(rec.weights).map(([name, w]) => ({ name, weight: Math.round((w as any) * 10000) / 100 }));
        const label = TIER_LABEL[tier] + ' · ' + ITYPE_LABEL[itype] + ' · ' + perfil;
        const p = makePortfolio(label, holdings, TIER_DEFAULT_VALUE[tier]);
        portfolios.push(p);
        targetPortfolioId = p.id;
        renderAll();
        return p;
      }

      function normalizeStr(s: any){
        return String(s == null ? '' : s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
      }

      function tokenize(s: any){
        return normalizeStr(s).replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
      }

      function fuzzyMatchFund(rawName: any){
        const rn = normalizeStr(rawName);
        if (!rn) return null;
        let best: any = null;
        const rnTokens = new Set(tokenize(rawName));
        DATA.funds.forEach(f => {
          const fn = normalizeStr(f.name);
          let score = 0;
          if (fn === rn) score = 1;
          else if (fn.includes(rn) || rn.includes(fn)) score = 0.85;
          const fnTokens = tokenize(f.name);
          const overlap = fnTokens.filter(t => rnTokens.has(t)).length;
          const union = new Set([...Array.from(fnTokens), ...Array.from(rnTokens)]).size;
          const tokenScore = union ? overlap / union : 0;
          score = Math.max(score, tokenScore);
          if (!best || score > best.score) best = { name: f.name, score };
        });
        return (best && best.score >= 0.34) ? best : null;
      }

      function parseFlexNumber(v: any){
        if (typeof v === 'number') return isNaN(v) ? null : v;
        if (v === null || v === undefined) return null;
        let s = String(v).trim();
        if (!s) return null;
        s = s.replace(/[R$\s%]/gi, '');
        if (!s) return null;
        if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
        const n = parseFloat(s);
        return isNaN(n) ? null : n;
      }

      function parseImportText(rawText: any){
        const lines = String(rawText || '').split(/\r?\n/);
        const rows = [];
        for (const raw of lines){
          const line = raw.trim();
          if (!line) continue;
          const pctMatch = line.match(/(\d{1,3}(?:[.,]\d+)?)\s*%/);
          const moneyMatch = line.match(/R\$\s*([\d.,]+)/i);
          if (!pctMatch && !moneyMatch) continue;
          let weight = null, amount = null, cutIdx = line.length;
          if (pctMatch){ weight = parseFlexNumber(pctMatch[1] + '%'); cutIdx = Math.min(cutIdx, pctMatch.index as any); }
          if (moneyMatch){ amount = parseFlexNumber(moneyMatch[1]); cutIdx = Math.min(cutIdx, moneyMatch.index as any); }
          let name = line.slice(0, cutIdx).replace(/[-:–—\s]+$/, '').trim();
          if (!name) name = line;
          rows.push({ rawName: name, weight, amount });
        }
        return rows;
      }

      function parseTabularRows(rows2d: any){
        if (!rows2d || !rows2d.length) return [];
        const KEY_NAME = ['fundo', 'ativo', 'nome', 'produto'];
        const KEY_PCT = ['%', 'percentual', 'peso', 'participacao'];
        const KEY_AMOUNT = ['valor', 'montante', 'saldo', 'aplicado', 'r$'];
        const firstRow = rows2d[0];
        const header = firstRow.map((c:any) => normalizeStr(String(c == null ? '' : c)));
        let nameIdx = header.findIndex((h:any) => KEY_NAME.some(k => h.includes(k)));
        let pctIdx = header.findIndex((h:any) => KEY_PCT.some(k => h.includes(k)));
        let amtIdx = header.findIndex((h:any) => KEY_AMOUNT.some(k => h.includes(k)));
        const hasHeaderKeyword = nameIdx !== -1 || pctIdx !== -1 || amtIdx !== -1;
        const rowLooksNumeric = firstRow.some((c:any, i:any) => i !== nameIdx && parseFlexNumber(c) !== null);
        let startRow = 1;
        if (!hasHeaderKeyword || rowLooksNumeric){ nameIdx = 0; pctIdx = -1; amtIdx = -1; startRow = 0; }
        const rows = [];
        for (let i = startRow; i < rows2d.length; i++){
          const r = rows2d[i];
          if (!r || !r.length) continue;
          const rawName = nameIdx >= 0 ? String(r[nameIdx] == null ? '' : r[nameIdx]).trim() : '';
          if (!rawName) continue;
          let weight = null, amount = null;
          if (pctIdx >= 0 && r[pctIdx] !== undefined && r[pctIdx] !== '') weight = parseFlexNumber(r[pctIdx]);
          if (amtIdx >= 0 && r[amtIdx] !== undefined && r[amtIdx] !== '') amount = parseFlexNumber(r[amtIdx]);
          if (weight === null && amount === null){
            for (let c = 0; c < r.length; c++){
              if (c === nameIdx) continue;
              const cell = r[c];
              const v = parseFlexNumber(cell);
              if (v !== null){ if (String(cell).includes('%')) weight = v; else amount = v; break; }
            }
          }
          rows.push({ rawName, weight, amount });
        }
        return rows;
      }

      function parseSimpleCsv(text: any){
        const lines = String(text || '').split(/\r?\n/).filter(l => l.length);
        if (!lines.length) return [];
        const delim = (lines[0].split(';').length > lines[0].split(',').length) ? ';' : ',';
        return lines.map(line => {
          const out = []; let cur = ''; let inQ = false;
          for (let i = 0; i < line.length; i++){
            const c = line[i];
            if (c === '"'){ inQ = !inQ; continue; }
            if (c === delim && !inQ){ out.push(cur); cur = ''; continue; }
            cur += c;
          }
          out.push(cur);
          return out.map(s => s.trim());
        });
      }

      function resolveImportedRows(rows: any){
        return rows.map((r:any) => {
          const match = fuzzyMatchFund(r.rawName);
          return { rawName: r.rawName, weight: r.weight, amount: r.amount, matchedFund: match ? match.name : null, matchScore: match ? match.score : 0 };
        });
      }

      function finalizeImportedWeights(resolved: any){
        const withPct = resolved.filter((r:any) => r.weight !== null && r.weight !== undefined && !isNaN(r.weight));
        const withAmt = resolved.filter((r:any) => r.amount !== null && r.amount !== undefined && !isNaN(r.amount));
        if (withPct.length > 0 && withPct.length >= resolved.length * 0.6){
          return resolved.map((r:any) => ({ ...r, weight: (r.weight !== null && r.weight !== undefined && !isNaN(r.weight)) ? r.weight : 0 }));
        }
        if (withAmt.length > 0){
          const total = withAmt.reduce((a:any, r:any) => a + r.amount, 0);
          return resolved.map((r:any) => ({ ...r, weight: (r.amount && total) ? Math.round((r.amount / total) * 10000) / 100 : (r.weight || 0) }));
        }
        return resolved.map((r:any) => ({ ...r, weight: r.weight || 0 }));
      }

      const CUSTOM_SENTINEL = '__custom__';
      let customFundCounter = 1;

      function registerCustomFund(rawName: any, monthlyReturnPct: any){
        let key = (rawName && rawName.trim()) ? rawName.trim() : ('Ativo personalizado ' + customFundCounter);
        while (FUND_BY_NAME[key]) key = key + ' (personalizado)';
        const frac = (monthlyReturnPct || 0) / 100;
        const values = new Array(N).fill(frac);
        const fund = { name: key, gestora: 'Informado por você', classe: 'Personalizado', iq_geral: '?', minimo: null, values, isCustom: true };
        FUND_BY_NAME[key] = fund;
        customFundCounter++;
        return key;
      }

      let pendingBeforeId: any = null;

      function buildRecommendedForComparison(tier: any, itype: any, perfil: any){
        const p = buildRecommendedPortfolio(tier, itype, perfil);
        if (!p) return null;
        if (pendingBeforeId){
          const before = portfolios.find(x => x.id === pendingBeforeId);
          if (before){
            before.tag = 'Antes';
            p.tag = 'Depois';
            p.pairWithId = before.id;
          }
          pendingBeforeId = null;
        }
        renderAll();
        return p;
      }

      const STORAGE_KEY = 'simuladorCarteirasState_v1';

      function saveState(){
        try{
          const customFunds = Object.values(FUND_BY_NAME)
            .filter((f:any) => f.isCustom)
            .map((f:any) => ({ name: f.name, values: f.values }));
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ portfolios, nextId, nextColorIdx, customFundCounter, customFunds }));
        } catch(e){ }
      }

      function loadState(){
        try{
          const raw = localStorage.getItem(STORAGE_KEY);
          if (!raw) return null;
          const data = JSON.parse(raw);
          if (!data || !Array.isArray(data.portfolios)) return null;
          return data;
        } catch(e){ return null; }
      }

      function defaultPortfolios(){
        return [ makePortfolio('Carteira A', []), makePortfolio('Carteira B', []) ];
      }

      const savedState = loadState();
      let portfolios: any[];
      if (savedState && savedState.portfolios && savedState.portfolios.length > 0){
        (savedState.customFunds || []).forEach((cf:any) => {
          FUND_BY_NAME[cf.name] = { name: cf.name, gestora: 'Informado por você', classe: 'Personalizado', iq_geral: '?', minimo: null, values: cf.values, isCustom: true };
        });
        portfolios = savedState.portfolios;
        nextId = savedState.nextId || (Math.max(0, ...portfolios.map(p => p.id)) + 1);
        nextColorIdx = savedState.nextColorIdx || portfolios.length;
        if (savedState.customFundCounter) customFundCounter = savedState.customFundCounter;
      } else {
        portfolios = defaultPortfolios();
      }

      let chart: any = null;
      let targetPortfolioId = portfolios[0]?.id || 1;
      let assetFilter = 'Todos';
      let assetSearch = '';

      function resetAllPortfolios(){
        if (!confirm('Isso vai apagar todas as carteiras montadas aqui e recomeçar do zero. Tem certeza?')) return;
        portfolios = defaultPortfolios();
        targetPortfolioId = portfolios[0].id;
        renderAll();
      }

      function addFundToPortfolio(portfolioId: any, fundName: any){
        const p = portfolios.find(x => x.id === portfolioId);
        if (!p) return;
        if (p.holdings.some((h:any) => h.name === fundName)) return;
        const m = computeMetrics(p);
        const remaining = Math.max(0, 100 - m.sumWeight);
        const defaultW = remaining > 0 ? Math.min(10, Math.round(remaining)) : 10;
        p.holdings.push({ name: fundName, weight: defaultW || 10 });
        renderAll();
      }

      function computeMetrics(p: any){
        const monthly = new Array(N).fill(0);
        let sumWeight = 0;
        let maxFundWeight = 0;
        const gestoraSum: any = {};
        p.holdings.forEach((h:any) => {
          const f = FUND_BY_NAME[h.name];
          if (!f) return;
          const w = (h.weight || 0) / 100;
          sumWeight += (h.weight || 0);
          maxFundWeight = Math.max(maxFundWeight, h.weight || 0);
          gestoraSum[f.gestora] = (gestoraSum[f.gestora] || 0) + (h.weight || 0);
          for (let t = 0; t < N; t++) monthly[t] += w * (f.values[t] || 0);
        });
        const wealth = wealthCurve(monthly);
        const finalW = wealth[wealth.length - 1];
        const cumRet = finalW - 1;
        const annRet = Math.pow(finalW, 12 / N) - 1;
        const mean = monthly.reduce((a,b)=>a+b,0) / N;
        const variance = monthly.reduce((a,b)=>a + Math.pow(b-mean,2), 0) / Math.max(1, N-1);
        const vol = Math.sqrt(variance) * Math.sqrt(12);
        let peak = wealth[0], maxDD = 0;
        for (const w of wealth){ if (w > peak) peak = w; const dd = w/peak - 1; if (dd < maxDD) maxDD = dd; }
        const multCDI = (CDI_FINAL - 1) === 0 ? 1 : (finalW - 1) / (CDI_FINAL - 1);
        const maxGestora = Object.keys(gestoraSum).length ? Math.max(...Object.values(gestoraSum) as any) : 0;
        return { monthly, wealth, cumRet, annRet, vol, maxDD, multCDI, sumWeight, maxFundWeight, maxGestora };
      }

      function pct(x: any, digits: any = 1){ return (x*100).toFixed(digits) + '%'; }
      function fmtX(x: any){ return (x*100).toFixed(1) + '%'; }

      function renderAll(){
        renderPortfolios();
        renderLeaderboard();
        renderChart();
        renderBeforeAfterSummary();
        saveState();
      }

      function renderBeforeAfterSummary(){
        const container = document.getElementById('beforeAfterBox');
        if (!container) return;
        const depoisList = portfolios.filter(p => p.tag === 'Depois' && p.pairWithId);
        if (!depoisList.length){ container.innerHTML = ''; container.style.display = 'none'; return; }
        container.style.display = 'flex';
        container.innerHTML = '';
        depoisList.forEach(depois => {
          const antes = portfolios.find(x => x.id === depois.pairWithId);
          if (!antes) return;
          const mA = computeMetrics(antes), mD = computeMetrics(depois);
          const box = document.createElement('div');
          box.className = 'before-after-card';
          function row(label: any, va: any, vd: any, fmt: any){
            const better = vd > va;
            return '<div class="ba-row"><span class="ba-label">' + label + '</span>' +
              '<span class="ba-val">' + fmt(va) + '</span>' +
              '<span class="ba-arrow">→</span>' +
              '<span class="ba-val ' + (better ? 'pos' : 'neg') + '">' + fmt(vd) + '</span></div>';
          }
          box.innerHTML = '<div class="ba-title">📊 Antes: ' + antes.name + '  →  Depois: ' + depois.name + '</div>' +
            row('Quanto rendeu', mA.cumRet, mD.cumRet, pct) +
            row('Comparado ao CDI', mA.multCDI, mD.multCDI, fmtX) +
            row('Oscilação (risco)', mA.vol, mD.vol, pct) +
            row('Maior queda no período', mA.maxDD, mD.maxDD, pct);
          container.appendChild(box);
        });
      }

      function renderTargetSelect(){
        const sel = document.getElementById('targetPortfolioSelect') as HTMLSelectElement;
        if (!sel) return;
        if (!portfolios.find(p => p.id === targetPortfolioId)){
          targetPortfolioId = portfolios.length ? portfolios[0].id : null;
        }
        sel.innerHTML = '';
        portfolios.forEach(p => {
          const opt = document.createElement('option');
          opt.value = p.id;
          opt.textContent = p.name;
          sel.appendChild(opt);
        });
        if (targetPortfolioId !== null) sel.value = targetPortfolioId.toString();
        sel.onchange = (e: any) => { targetPortfolioId = parseInt(e.target.value, 10); renderAssetList(); renderPortfolios(); };
      }

      function renderFilterChips(){
        const box = document.getElementById('filterChips');
        if (!box || box.children.length) return;
        const classes = ['Todos','Zaga','Meio','Ataque'];
        classes.forEach(cl => {
          const chip = document.createElement('button');
          chip.type = 'button';
          chip.className = 'chip' + (cl === assetFilter ? ' active' : '');
          chip.textContent = cl;
          chip.onclick = () => {
            assetFilter = cl;
            box.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            renderAssetList();
          };
          box.appendChild(chip);
        });
      }

      function renderAssetList(){
        const box = document.getElementById('assetList');
        if (!box) return;
        box.innerHTML = '';
        const targetP = portfolios.find(p => p.id === targetPortfolioId);
        const already = targetP ? new Set(targetP.holdings.map((h:any) => h.name)) : new Set();
        const q = assetSearch.trim().toLowerCase();
        const list = DATA.funds.filter((f:any) => {
          if (assetFilter !== 'Todos' && f.classe !== assetFilter) return false;
          if (q && !(f.name.toLowerCase().includes(q) || f.gestora.toLowerCase().includes(q))) return false;
          return true;
        });
        if (!list.length){
          box.innerHTML = '<div class="lb-sub" style="padding:8px 2px;">Nenhum ativo encontrado.</div>';
          return;
        }
        list.forEach(f => {
          const stats = FUND_STATS[f.name];
          const isAdded = already.has(f.name);
          const card = document.createElement('div');
          card.className = 'asset-card' + (isAdded ? ' added' : '');
          card.draggable = true;
          card.ondragstart = (ev: any) => {
            ev.dataTransfer.setData('text/plain', f.name);
            ev.dataTransfer.effectAllowed = 'copy';
            card.classList.add('dragging');
          };
          card.ondragend = () => card.classList.remove('dragging');

          const top = document.createElement('div');
          top.className = 'asset-top';
          const pill = document.createElement('span');
          pill.className = 'pill';
          pill.style.background = CLASSE_COLOR_HEX[f.classe] || CLASSE_COLOR_HEX['?'];
          pill.textContent = f.classe;
          const addBtn = document.createElement('button');
          addBtn.className = 'asset-add-btn';
          addBtn.textContent = isAdded ? '✓' : '+';
          addBtn.disabled = isAdded || !targetP;
          addBtn.title = isAdded ? 'Já está na carteira selecionada' : 'Adicionar à carteira selecionada';
          addBtn.onclick = () => { if (targetP) addFundToPortfolio(targetP.id, f.name); };
          top.appendChild(pill); top.appendChild(addBtn);
          card.appendChild(top);

          const nm = document.createElement('div');
          nm.className = 'asset-name';
          nm.textContent = f.name;
          card.appendChild(nm);

          const ge = document.createElement('div');
          ge.className = 'asset-gestora';
          ge.textContent = f.gestora;
          card.appendChild(ge);

          const st = document.createElement('div');
          st.className = 'asset-stats';
          st.innerHTML = '<span title="Quanto o fundo rendeu em média por ano, nos últimos ~3,4 anos">a.a.: <b class="' + (stats.annRet>=0?'pos':'neg') + '">' + pct(stats.annRet) + '</b></span>' +
                          '<span title="Oscilação: o quanto o valor do fundo costuma subir e descer no meio do caminho">Oscilação: <b>' + pct(stats.vol) + '</b></span>' +
                          '<span title="A maior perda que esse fundo já teve, do topo até o fundo do poço, no período analisado">Maior queda: <b class="neg">' + pct(stats.maxDD) + '</b></span>';
          card.appendChild(st);

          box.appendChild(card);
        });
      }

      function renderAssetSidebar(){
        renderTargetSelect();
        renderFilterChips();
        renderAssetList();
      }

      function renderPortfolios(){
        const row = document.getElementById('portfoliosRow');
        if (!row) return;
        row.innerHTML = '';
        portfolios.forEach(p => row.appendChild(buildPortfolioCard(p)));
        const newCard = document.createElement('div');
        newCard.className = 'new-card';
        newCard.innerHTML = '+ Nova<br>Carteira';
        newCard.onclick = () => { portfolios.push(makePortfolio('Carteira ' + String.fromCharCode(65 + portfolios.length), [])); renderAll(); };
        row.appendChild(newCard);
      }

      function buildPortfolioCard(p: any){
        const m = computeMetrics(p);
        const card = document.createElement('div');
        card.className = 'p-card' + (p.id === targetPortfolioId ? ' is-target' : '');
        card.style.borderTopColor = p.color;
        card.ondragover = (ev: any) => { ev.preventDefault(); ev.dataTransfer.dropEffect = 'copy'; card.classList.add('dragover'); };
        card.ondragleave = () => card.classList.remove('dragover');
        card.ondrop = (ev: any) => {
          ev.preventDefault();
          card.classList.remove('dragover');
          const name = ev.dataTransfer.getData('text/plain');
          if (name) addFundToPortfolio(p.id, name);
        };

        const head = document.createElement('div');
        head.className = 'p-head';
        const dot = document.createElement('span');
        dot.className = 'lb-dot';
        dot.style.background = p.color;
        const nameInput = document.createElement('input');
        nameInput.className = 'pname';
        nameInput.value = p.name;
        nameInput.oninput = (e: any) => { p.name = e.target.value; renderLeaderboard(); renderChart(); };
        let tagPill = null;
        if (p.tag){
          tagPill = document.createElement('span');
          tagPill.className = 'p-tag-pill ' + (p.tag === 'Antes' ? 'tag-antes' : 'tag-depois');
          tagPill.textContent = p.tag;
        }
        const actions = document.createElement('div');
        actions.className = 'p-actions';
        const dupBtn = document.createElement('button');
        dupBtn.className = 'iconbtn'; dupBtn.title = 'Duplicar'; dupBtn.textContent = '⧉';
        dupBtn.onclick = () => {
          const copy = makePortfolio(p.name + ' (cópia)', p.holdings.map((h:any) => ({...h})), p.totalValue);
          portfolios.push(copy); renderAll();
        };
        const delBtn = document.createElement('button');
        delBtn.className = 'iconbtn'; delBtn.title = 'Remover'; delBtn.textContent = '✕';
        delBtn.onclick = () => { portfolios = portfolios.filter(x => x.id !== p.id); renderAll(); };
        actions.appendChild(dupBtn); actions.appendChild(delBtn);
        head.appendChild(dot);
        if (tagPill) head.appendChild(tagPill);
        head.appendChild(nameInput); head.appendChild(actions);
        card.appendChild(head);

        const totalRow = document.createElement('div');
        totalRow.className = 'pt-total-row';
        const totalLabel = document.createElement('span');
        totalLabel.className = 'pt-total-label';
        totalLabel.textContent = 'Patrimônio total';
        const totalInputWrap = document.createElement('span');
        totalInputWrap.className = 'pt-total-inputwrap';
        const totalPrefix = document.createElement('span');
        totalPrefix.className = 'pt-total-prefix';
        totalPrefix.textContent = 'R$';
        const totalInput = document.createElement('input');
        totalInput.type = 'text'; totalInput.inputMode = 'decimal';
        totalInput.className = 'pt-total-input';
        totalInput.value = formatBRL(p.totalValue);
        totalInput.title = 'Usado para converter % ↔ valor em R$ de cada ativo desta carteira';
        totalInput.onchange = (e: any) => {
          const v = parseFlexNumber(e.target.value);
          p.totalValue = (v !== null && v > 0) ? v : (p.totalValue || DEFAULT_PORTFOLIO_VALUE);
          renderAll();
        };
        totalInputWrap.appendChild(totalPrefix); totalInputWrap.appendChild(totalInput);
        totalRow.appendChild(totalLabel); totalRow.appendChild(totalInputWrap);
        card.appendChild(totalRow);

        const allocWrap = document.createElement('div');
        const allocLabel = document.createElement('div');
        allocLabel.className = 'alloc-label';
        const allocColor = Math.abs(m.sumWeight - 100) <= 1 ? 'var(--good)' : (m.sumWeight > 100 ? 'var(--warn)' : '#9aa0c0');
        allocLabel.innerHTML = '<span>Alocado</span><span style="color:' + allocColor + '; font-weight:700;">' + m.sumWeight.toFixed(1) + '%</span>';
        const barOuter = document.createElement('div');
        barOuter.className = 'alloc-bar-outer';
        const barInner = document.createElement('div');
        barInner.className = 'alloc-bar-inner';
        barInner.style.width = Math.min(100, m.sumWeight) + '%';
        barInner.style.background = allocColor;
        barOuter.appendChild(barInner);
        allocWrap.appendChild(allocLabel); allocWrap.appendChild(barOuter);
        card.appendChild(allocWrap);

        if (p.holdings.length === 0){
          const hint = document.createElement('div');
          hint.className = 'empty-hint';
          hint.textContent = 'Nenhum fundo ainda. Adicione abaixo ↓';
          card.appendChild(hint);
        } else {
          p.holdings.forEach((h:any, idx:any) => {
            const f = FUND_BY_NAME[h.name];
            const hDiv = document.createElement('div');
            hDiv.className = 'holding';
            const top = document.createElement('div');
            top.className = 'holding-top';
            const nm = document.createElement('div');
            nm.className = 'holding-name';
            nm.textContent = h.name;
            const rm = document.createElement('button');
            rm.className = 'rm'; rm.textContent = '✕';
            rm.onclick = () => { p.holdings.splice(idx,1); renderAll(); };
            top.appendChild(nm); top.appendChild(rm);
            hDiv.appendChild(top);

            const editRow = document.createElement('div');
            editRow.className = 'holding-editrow';

            const wField = document.createElement('label');
            wField.className = 'holding-field';
            const wFieldLabel = document.createElement('span');
            wFieldLabel.className = 'holding-field-label'; wFieldLabel.textContent = '%';
            const weightInput = document.createElement('input');
            weightInput.type = 'number'; weightInput.min = '0'; weightInput.step = '0.1';
            weightInput.className = 'holding-w-input';
            weightInput.value = (Math.round((h.weight || 0) * 10) / 10).toString();
            weightInput.onchange = (e: any) => {
              const v = parseFlexNumber(e.target.value);
              h.weight = (v !== null && v >= 0) ? v : 0;
              renderAll();
            };
            wField.appendChild(wFieldLabel); wField.appendChild(weightInput);

            const amtField = document.createElement('label');
            amtField.className = 'holding-field';
            const amtFieldLabel = document.createElement('span');
            amtFieldLabel.className = 'holding-field-label'; amtFieldLabel.textContent = 'R$';
            const amountInput = document.createElement('input');
            amountInput.type = 'text'; amountInput.inputMode = 'decimal';
            amountInput.className = 'holding-amt-input';
            amountInput.value = formatBRL((p.totalValue || 0) * (h.weight || 0) / 100);
            amountInput.onchange = (e: any) => {
              const v = parseFlexNumber(e.target.value);
              const total = p.totalValue || 0;
              if (v !== null && v >= 0 && total > 0){
                h.weight = Math.round((v / total) * 10000) / 100;
              }
              renderAll();
            };
            amtField.appendChild(amtFieldLabel); amtField.appendChild(amountInput);

            editRow.appendChild(wField); editRow.appendChild(amtField);
            hDiv.appendChild(editRow);

            const meta = document.createElement('div');
            meta.className = 'holding-meta';
            const classePill = document.createElement('span');
            classePill.className = 'pill';
            classePill.style.background = CLASSE_COLOR_HEX[f.classe] || CLASSE_COLOR_HEX['?'];
            classePill.textContent = f.classe;
            const gestoraSpan = document.createElement('span');
            gestoraSpan.style.fontSize = '11px'; gestoraSpan.style.color = 'var(--muted)';
            gestoraSpan.textContent = f.gestora;
            meta.appendChild(classePill); meta.appendChild(gestoraSpan);
            hDiv.appendChild(meta);

            const slider = document.createElement('input');
            slider.type = 'range'; slider.min = '0'; slider.max = '100'; slider.step = '1';
            slider.value = (h.weight || 0).toString();
            slider.style.setProperty('--c', p.color);
            slider.style.setProperty('--val', (h.weight || 0) + '%');
            slider.oninput = (e: any) => { 
              const val = parseFloat(e.target.value);
              slider.style.setProperty('--val', val + '%');
              h.weight = val;
              weightInput.value = (Math.round(val * 10) / 10).toString();
              amountInput.value = formatBRL((p.totalValue || 0) * val / 100);
              
              const mTemp = computeMetrics(p);
              const allocColorTemp = Math.abs(mTemp.sumWeight - 100) <= 1 ? 'var(--good)' : (mTemp.sumWeight > 100 ? 'var(--warn)' : '#9aa0c0');
              const innerBar = card.querySelector('.alloc-bar-inner') as HTMLElement;
              if (innerBar) {
                innerBar.style.width = Math.min(100, mTemp.sumWeight) + '%';
                innerBar.style.background = allocColorTemp;
              }
              const allocLabelEl = card.querySelector('.alloc-label');
              if (allocLabelEl) {
                allocLabelEl.innerHTML = '<span>Alocado</span><span style="color:' + allocColorTemp + '; font-weight:700;">' + mTemp.sumWeight.toFixed(1) + '%</span>';
              }
              
              const hlVals = card.querySelectorAll('.hl-val');
              if (hlVals.length >= 2) {
                hlVals[0].className = 'hl-val ' + (mTemp.cumRet >= 0 ? 'pos' : 'neg');
                hlVals[0].textContent = pct(mTemp.cumRet);
                hlVals[1].className = 'hl-val ' + (mTemp.multCDI >= 1 ? 'pos' : 'neg');
                hlVals[1].textContent = fmtX(mTemp.multCDI);
              }

              renderLeaderboard();
              renderChart();
            };
            slider.onchange = () => { renderAll(); };
            hDiv.appendChild(slider);

            card.appendChild(hDiv);
          });
        }

        const addRow = document.createElement('div');
        addRow.className = 'add-row';
        const select = document.createElement('select');
        select.className = 'fund-select';
        let anyOption = false;

        TIER_ORDER.forEach(tier => {
          const recOptions: any[] = [];
          ITYPE_ORDER.forEach(itype => {
            PERFIL_ORDER.forEach(perfil => {
              if (findRecommended(tier, itype, perfil)) recOptions.push({itype, perfil});
            });
          });
          if (!recOptions.length) return;
          const og = document.createElement('optgroup');
          og.label = 'Carteira pronta recomendada · ' + TIER_LABEL[tier];
          recOptions.forEach(({itype, perfil}) => {
            const opt = document.createElement('option');
            opt.value = 'REC::' + tier + '::' + itype + '::' + perfil;
            opt.textContent = ITYPE_LABEL[itype] + ' · ' + perfil;
            og.appendChild(opt);
            anyOption = true;
          });
          select.appendChild(og);
        });

        const already = new Set(p.holdings.map((h:any) => h.name));
        const groups: any = {Zaga:[], Meio:[], Ataque:[], '?':[]};
        DATA.funds.forEach(f => { if (!already.has(f.name)) groups[f.classe].push(f); });
        const groupLabels: any = {Zaga:'Mais conservadores (Zaga)', Meio:'Equilíbrio (Meio)', Ataque:'Mais arrojados (Ataque)', '?':'Sem classificação'};
        Object.keys(groupLabels).forEach(cl => {
          if (!groups[cl].length) return;
          const og = document.createElement('optgroup');
          og.label = groupLabels[cl];
          groups[cl].forEach((f:any) => {
            const opt = document.createElement('option');
            opt.value = f.name;
            opt.textContent = f.name + (f.minimo ? ' · a partir de R$' + f.minimo.toLocaleString('pt-BR') : '');
            og.appendChild(opt);
            anyOption = true;
          });
          select.appendChild(og);
        });
        const addBtn = document.createElement('button');
        addBtn.className = 'add-btn';
        addBtn.textContent = '+ Adicionar';
        if (!anyOption){ addBtn.disabled = true; select.disabled = true; }
        addBtn.onclick = () => {
          if (!select.value) return;
          if (select.value.startsWith('REC::')){
            const [, tier, itype, perfil] = select.value.split('::');
            const rec = findRecommended(tier, itype, perfil);
            if (!rec) return;
            const recLabel = TIER_LABEL[tier] + ' · ' + ITYPE_LABEL[itype] + ' · ' + perfil;
            if (p.holdings.length > 0){
              const ok = confirm('Isso vai substituir os fundos que você já montou nesta carteira pelos da carteira recomendada "' + recLabel + '". Quer continuar?');
              if (!ok) return;
            }
            p.holdings = Object.entries(rec.weights).map(([name, w]) => ({ name, weight: Math.round((w as any) * 10000) / 100 }));
            renderAll();
            return;
          }
          const remaining = Math.max(0, 100 - m.sumWeight);
          const defaultW = remaining > 0 ? Math.min(10, Math.round(remaining)) : 10;
          p.holdings.push({ name: select.value, weight: defaultW || 10 });
          renderAll();
        };
        addRow.appendChild(select); addRow.appendChild(addBtn);
        card.appendChild(addRow);

        if (p.holdings.length > 0){
          const headline = document.createElement('div');
          headline.className = 'headline';
          const hl1 = document.createElement('div'); hl1.className = 'hl';
          hl1.innerHTML = '<div class="hl-label">Quanto rendeu</div><div class="hl-val ' + (m.cumRet>=0?'pos':'neg') + '">' + pct(m.cumRet) + '</div>';
          const hl2 = document.createElement('div'); hl2.className = 'hl';
          hl2.innerHTML = '<div class="hl-label">Comparado ao CDI</div><div class="hl-val ' + (m.multCDI>=1?'pos':'neg') + '">' + fmtX(m.multCDI) + '</div>';
          headline.appendChild(hl1); headline.appendChild(hl2);
          card.appendChild(headline);

          const details = document.createElement('details');
          details.className = 'more';
          const summary = document.createElement('summary');
          summary.textContent = 'Ver mais números';
          details.appendChild(summary);
          const list = document.createElement('div');
          list.className = 'mini-list';
          const rows = [
            ['Retorno por ano (anualizado)', pct(m.annRet)],
            ['Oscilação (risco)', pct(m.vol)],
            ['Maior queda no período', pct(m.maxDD)],
            ['Maior fundo na carteira', m.maxFundWeight.toFixed(0)+'%'],
            ['Maior gestora na carteira', m.maxGestora.toFixed(0)+'%'],
            ['Quantidade de fundos', String(p.holdings.length)],
          ];
          rows.forEach(([label, val]) => {
            const row = document.createElement('div'); row.className = 'mini-row';
            row.innerHTML = '<span class="m-label">' + label + '</span><span class="m-val">' + val + '</span>';
            list.appendChild(row);
          });
          details.appendChild(list);
          card.appendChild(details);
        }

        return card;
      }

      function renderLeaderboard(){
        const box = document.getElementById('leaderboard');
        if (!box) return;
        box.innerHTML = '';
        const withData = portfolios.filter(p => p.holdings.length > 0);
        if (!withData.length){
          box.innerHTML = '<div class="lb-sub">Adicione fundos a alguma carteira para ver o ranking.</div>';
          return;
        }
        const ranked = withData.map(p => ({p, m: computeMetrics(p)})).sort((a,b) => b.m.cumRet - a.m.cumRet);
        const medals = ['🥇','🥈','🥉'];
        ranked.forEach((r, idx) => {
          const item = document.createElement('div');
          item.className = 'lb-item';
          const medal = document.createElement('span'); medal.className = 'lb-medal'; medal.textContent = medals[idx] || ('#' + (idx+1));
          const dot = document.createElement('span'); dot.className = 'lb-dot'; dot.style.background = r.p.color;
          const nameBox = document.createElement('div');
          const nm = document.createElement('div'); nm.className = 'lb-name'; nm.textContent = r.p.name;
          const sub = document.createElement('div'); sub.className = 'lb-sub'; sub.textContent = fmtX(r.m.multCDI) + ' do CDI';
          nameBox.appendChild(nm); nameBox.appendChild(sub);
          const val = document.createElement('div'); val.className = 'lb-val ' + (r.m.cumRet>=0?'pos':'neg'); val.textContent = pct(r.m.cumRet);
          item.appendChild(medal); item.appendChild(dot); item.appendChild(nameBox); item.appendChild(val);
          box.appendChild(item);
        });
      }

      function renderChart(){
        const activeTab = document.querySelector('.cp-tab.active');
        const range = activeTab ? activeTab.getAttribute('data-months') : '0';
        let startIdx = 0;
        if (range === 'YTD') {
           const currentYear = DATA.months[DATA.months.length - 1].split('-')[0];
           startIdx = DATA.months.findIndex((m: string) => m.startsWith(currentYear));
           if (startIdx < 0) startIdx = 0;
        } else {
           const mCount = parseInt(range as string, 10);
           if (mCount > 0 && DATA.months.length > mCount) {
             startIdx = DATA.months.length - mCount;
           }
        }

        const dateRangeEl = document.getElementById('chartDateRange');
        if (dateRangeEl) {
           const mNameIdx = startIdx > 0 ? startIdx - 1 : 0;
           if (DATA.months[mNameIdx]) {
             const [y, m] = DATA.months[mNameIdx].split('-');
             const mNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
             dateRangeEl.innerText = 'Acumulado desde ' + mNames[parseInt(m, 10)-1] + '. ' + y.slice(2);
           }
        }

        const labels = ['Início'].concat(DATA.months.slice(startIdx));
        const datasets: any[] = [];
        portfolios.filter((p: any) => p.holdings.length > 0).forEach((p: any) => {
          const m = computeMetrics(p);
          const slicedWealth = m.wealth.slice(startIdx);
          const baseW = slicedWealth[0] || 1;
          datasets.push({
            label: p.name,
            data: slicedWealth.map((w: number) => ((w / baseW) - 1) * 100),
            borderColor: p.color,
            backgroundColor: p.color,
            borderWidth: 2.5,
            pointRadius: 0,
            tension: 0.15,
          });
        });
        
        const chips = document.querySelectorAll('.bench-chip');
        const activeBenches = Array.from(chips).filter(c => c.classList.contains('active')).map(c => c.getAttribute('data-bench'));

        const benchConfigs: any = {
          'CDI': { wealth: CDI_WEALTH, color: '#9aa0b8', dash: [6,4] },
          'IPCA': { wealth: IPCA_WEALTH, color: '#3b82f6', dash: [4,4] },
          'IBOV': { wealth: IBOV_WEALTH, color: '#ef4444', dash: [2,2] },
          'ABRIGO': { wealth: ABRIGO_WEALTH, color: '#10b981', dash: [] },
          'RITMO': { wealth: RITMO_WEALTH, color: '#f59e0b', dash: [] },
          'VISAO': { wealth: VISAO_WEALTH, color: '#8b5cf6', dash: [] },
          'OCEANO': { wealth: OCEANO_WEALTH, color: '#ec4899', dash: [] }
        };

        activeBenches.forEach(b => {
          const cfg = benchConfigs[b as string];
          if (!cfg) return;
          const sliced = cfg.wealth.slice(startIdx);
          const base = sliced[0] || 1;
          datasets.push({
            label: b,
            data: sliced.map((w: number) => ((w / base) - 1) * 100),
            borderColor: cfg.color,
            backgroundColor: cfg.color,
            borderWidth: 2,
            borderDash: cfg.dash,
            pointRadius: 0,
            tension: 0.15,
          });
        });

        const canvas = document.getElementById('chart') as HTMLCanvasElement;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (chart){ chart.data.labels = labels; chart.data.datasets = datasets; chart.update(); return; }
        chart = new (window as any).Chart(ctx, {
          type: 'line',
          data: { labels, datasets },
          options: {
            responsive: true, maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
              legend: { 
                display: true, 
                position: 'top',
                align: 'start',
                labels: { 
                  color: '#123044', 
                  usePointStyle: true, 
                  boxWidth: 8, 
                  boxHeight: 8,
                  filter: function(item: any) {
                    return !['CDI', 'IPCA', 'IBOV'].includes(item.text);
                  }
                } 
              },
              tooltip: {
                backgroundColor: '#ffffff',
                titleColor: '#20233a',
                bodyColor: '#565c7d',
                borderColor: '#e6e8f2',
                borderWidth: 1,
                padding: 10,
                callbacks: {
                  label: (item: any) => item.dataset.label + ': ' + item.parsed.y.toFixed(2) + '%',
                }
              }
            },
            scales: {
              x: { ticks: { color: '#667085', maxTicksLimit: 12 }, grid: { color: '#e4e0d7' } },
              y: { 
                ticks: { 
                  color: '#667085',
                  callback: function(value: any) { return value.toFixed(1) + '%'; }
                }, 
                grid: { color: '#e4e0d7' }, 
              },
            }
          }
        });
      }

      function setPortfolios(arr: any){ portfolios = arr; }

      const searchInput = document.getElementById('assetSearch');
      if (searchInput){
        searchInput.addEventListener('input', (e: any) => { assetSearch = e.target.value; renderAssetList(); });
      }

      function updateRecHint(){
        const hint = document.getElementById('recHint');
        if (!hint) return;
        const tierSel = document.getElementById('recTier') as HTMLSelectElement;
        const itypeSel = document.getElementById('recItype') as HTMLSelectElement;
        const perfilSel = document.getElementById('recPerfil') as HTMLSelectElement;
        
        if (!tierSel || !itypeSel || !perfilSel) return;
        
        const tier = tierSel.value;
        const itype = itypeSel.value;
        const perfil = perfilSel.value;
        
        const rec = findRecommended(tier, itype, perfil);
        const btn = document.getElementById('recBuildBtn');
        const beforeP = pendingBeforeId ? portfolios.find(x => x.id === pendingBeforeId) : null;
        if (!rec){
          hint.textContent = 'Combinação não encontrada entre as carteiras oficiais.';
          return;
        }
        const n = Object.keys(rec.weights).length;
        if (beforeP){
          if (btn) btn.textContent = 'Montar carteira "Depois" para comparar';
          hint.textContent = 'Carteira oficial "' + rec.id + '" · ' + n + ' fundo' + (n === 1 ? '' : 's') + '. Isso vai criar o "Depois" e comparar com "' + beforeP.name + '" (importada).';
        } else {
          if (btn) btn.textContent = 'Montar carteira';
          hint.textContent = 'Carteira oficial "' + rec.id + '" · ' + n + ' fundo' + (n === 1 ? '' : 's') + '. Clique em "Montar carteira" para criar uma carteira nova com esses pesos.';
        }
      }

      let importParsedRows: any[] = [];

      function openImportReviewModal(rows: any, defaultName: any){
        const resolved = resolveImportedRows(rows);
        const finalized = finalizeImportedWeights(resolved);
        importParsedRows = finalized.map((r:any) => ({
          rawName: r.rawName,
          weight: r.weight || 0,
          amount: (r.amount !== null && r.amount !== undefined && !isNaN(r.amount)) ? r.amount : null,
          fundoSelecionado: (r.matchedFund && r.matchScore >= 0.5) ? r.matchedFund : CUSTOM_SENTINEL,
          customReturnPct: 0,
        }));
        const nameInput = document.getElementById('importPortfolioName') as HTMLInputElement;
        if (nameInput) nameInput.value = defaultName || 'Carteira atual do cliente';
        renderImportReviewRows();
        const modal = document.getElementById('importReviewModal');
        if (modal) modal.style.display = 'flex';
      }

      function closeImportReviewModal(){
        const modal = document.getElementById('importReviewModal');
        if (modal) modal.style.display = 'none';
      }

      function renderImportReviewRows(){
        const box = document.getElementById('importReviewRows');
        if (!box) return;
        box.innerHTML = '';
        let total = 0;
        importParsedRows.forEach((row, idx) => {
          total += row.weight || 0;
          const rowDiv = document.createElement('div');
          rowDiv.className = 'import-review-row';

          const nameInput = document.createElement('input');
          nameInput.type = 'text'; nameInput.value = row.rawName;
          nameInput.oninput = (e: any) => { row.rawName = e.target.value; };

          const weightInput = document.createElement('input');
          weightInput.type = 'number'; weightInput.step = '0.1'; weightInput.value = row.weight;
          weightInput.oninput = (e: any) => { row.weight = parseFloat(e.target.value) || 0; renderImportReviewRows(); };

          const select = document.createElement('select');
          const customOpt = document.createElement('option');
          customOpt.value = CUSTOM_SENTINEL; customOpt.textContent = 'Não encontramos esse fundo — informar rentabilidade';
          select.appendChild(customOpt);
          DATA.funds.forEach(f => {
            const opt = document.createElement('option');
            opt.value = f.name; opt.textContent = f.name;
            select.appendChild(opt);
          });
          select.value = row.fundoSelecionado;
          select.onchange = (e: any) => { row.fundoSelecionado = e.target.value; renderImportReviewRows(); };

          const returnInput = document.createElement('input');
          returnInput.type = 'number'; returnInput.step = '0.01';
          returnInput.placeholder = '% que rendeu por mês';
          returnInput.title = 'Rentabilidade média que esse ativo costuma render por mês, em %. Se não souber, pode deixar 0.';
          returnInput.value = row.customReturnPct || 0;
          returnInput.style.display = (row.fundoSelecionado === CUSTOM_SENTINEL) ? '' : 'none';
          returnInput.oninput = (e: any) => { row.customReturnPct = parseFloat(e.target.value) || 0; };

          const rmBtn = document.createElement('button');
          rmBtn.className = 'rm'; rmBtn.textContent = '✕';
          rmBtn.onclick = () => { importParsedRows.splice(idx, 1); renderImportReviewRows(); };

          rowDiv.appendChild(nameInput);
          rowDiv.appendChild(weightInput);
          rowDiv.appendChild(select);
          rowDiv.appendChild(returnInput);
          rowDiv.appendChild(rmBtn);

          const itemWrap = document.createElement('div');
          itemWrap.className = 'import-review-item';
          itemWrap.appendChild(rowDiv);
          const hasSilentAmount = row.amount !== null && row.amount !== undefined && !isNaN(row.amount) && !(row.weight > 0);
          if (hasSilentAmount){
            const warn = document.createElement('div');
            warn.className = 'import-review-warn';
            warn.textContent = '⚠ Você informou R$ ' + formatBRL(row.amount) + ' para este item, mas não conseguimos combinar automaticamente com os percentuais dos outros ativos — ajuste o % ao lado manualmente, senão ele fica de fora da carteira.';
            itemWrap.appendChild(warn);
          }
          box.appendChild(itemWrap);
        });
        const totalEl = document.getElementById('importReviewTotal');
        if (totalEl){
          const color = Math.abs(total - 100) <= 1 ? 'var(--good)' : 'var(--warn)';
          totalEl.innerHTML = 'Total alocado: <b style="color:' + color + '">' + total.toFixed(1) + '%</b>' +
            (Math.abs(total - 100) > 1 ? ' — confira antes de confirmar' : '');
        }
      }

      function confirmImportedPortfolio(){
        const nameInput = document.getElementById('importPortfolioName') as HTMLInputElement;
        const name = (nameInput && nameInput.value) || 'Carteira atual do cliente';
        const holdings = importParsedRows.map(row => {
          if (row.fundoSelecionado === CUSTOM_SENTINEL){
            const key = registerCustomFund(row.rawName, row.customReturnPct);
            return { name: key, weight: row.weight || 0 };
          }
          return { name: row.fundoSelecionado, weight: row.weight || 0 };
        }).filter(h => h.name);
        
        const amountsGiven = importParsedRows.filter(r => r.amount !== null && r.amount !== undefined && !isNaN(r.amount));
        const importedTotalValue = (amountsGiven.length > 0 && amountsGiven.length >= importParsedRows.length * 0.6)
          ? amountsGiven.reduce((a, r) => a + r.amount, 0)
          : undefined;
        const p = makePortfolio(name, holdings, importedTotalValue);
        p.tag = 'Antes';
        portfolios.push(p);
        targetPortfolioId = p.id;
        pendingBeforeId = p.id;
        closeImportReviewModal();
        renderAll();
        updateRecHint();
        return p;
      }

      let sheetJsLoading: any = null;
      function loadSheetJs(cb: any){
        if ((window as any).XLSX){ cb(); return; }
        if (!sheetJsLoading){
          sheetJsLoading = new Promise((resolve) => {
            const s = document.createElement('script');
            s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
            s.onload = resolve;
            document.head.appendChild(s);
          });
        }
        sheetJsLoading.then(cb);
      }

      let pdfJsLoading: any = null;
      function loadPdfJs(cb: any){
        if ((window as any).pdfjsLib){ cb(); return; }
        if (!pdfJsLoading){
          pdfJsLoading = new Promise((resolve) => {
            const s = document.createElement('script');
            s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            s.onload = () => {
              (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
              resolve(true);
            };
            document.head.appendChild(s);
          });
        }
        pdfJsLoading.then(cb);
      }

      async function extractPdfText(arrayBuffer: any){
        const pdf = await (window as any).pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++){
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strs = content.items.map((it:any) => it.str);
          text += strs.join(' ') + '\n';
        }
        return text;
      }

      function showImportWarn(msg: any){
        const el = document.getElementById('importBuilderWarn');
        if (!el) return;
        if (!msg){ el.style.display = 'none'; el.textContent = ''; return; }
        el.textContent = msg;
        el.style.display = 'block';
      }

      function handleImportClick(){
        showImportWarn(null);
        const fileInput = document.getElementById('importFileInput') as HTMLInputElement;
        const textInput = document.getElementById('importTextInput') as HTMLTextAreaElement;
        const file = fileInput && fileInput.files && fileInput.files[0];
        if (file){
          const ext = file.name.split('.').pop()?.toLowerCase();
          const baseName = file.name.replace(/\.[^.]+$/, '');
          if (ext === 'xlsx' || ext === 'xls'){
            const reader = new FileReader();
            reader.onload = (e: any) => {
              loadSheetJs(() => {
                const wb = (window as any).XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
                const ws = wb.Sheets[wb.SheetNames[0]];
                const rows2d = (window as any).XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: '' });
                openImportReviewModal(parseTabularRows(rows2d), baseName);
              });
            };
            reader.readAsArrayBuffer(file);
          } else if (ext === 'pdf'){
            const reader = new FileReader();
            reader.onload = (e: any) => {
              loadPdfJs(() => {
                extractPdfText(e.target.result).then(text => {
                  openImportReviewModal(parseImportText(text), baseName);
                });
              });
            };
            reader.readAsArrayBuffer(file);
          } else {
            const reader = new FileReader();
            reader.onload = (e: any) => {
              const text = e.target.result;
              const rows = (ext === 'csv') ? parseTabularRows(parseSimpleCsv(text)) : parseImportText(text);
              openImportReviewModal(rows, baseName);
            };
            reader.readAsText(file);
          }
          return;
        }
        const pasted = textInput ? textInput.value : '';
        if (pasted && pasted.trim()){
          openImportReviewModal(parseImportText(pasted), 'Carteira atual do cliente');
          return;
        }
        showImportWarn('Selecione um arquivo ou cole a lista de ativos no campo acima antes de clicar em "Importar e revisar".');
      }

      function setupImportBuilder(){
        const importBtn = document.getElementById('importBtn');
        const closeBtn = document.getElementById('importModalClose');
        const addRowBtn = document.getElementById('importAddRowBtn');
        const confirmBtn = document.getElementById('importConfirmBtn');
        if (!importBtn || !closeBtn || !addRowBtn || !confirmBtn) return;
        importBtn.addEventListener('click', handleImportClick);
        closeBtn.addEventListener('click', closeImportReviewModal);
        addRowBtn.addEventListener('click', () => {
          importParsedRows.push({ rawName: '', weight: 0, amount: null, fundoSelecionado: CUSTOM_SENTINEL, customReturnPct: 0 });
          renderImportReviewRows();
        });
        confirmBtn.addEventListener('click', confirmImportedPortfolio);
      }

      function setupRecBuilder(){
        const tierSel = document.getElementById('recTier') as HTMLSelectElement;
        const itypeSel = document.getElementById('recItype') as HTMLSelectElement;
        const perfilSel = document.getElementById('recPerfil') as HTMLSelectElement;
        const btn = document.getElementById('recBuildBtn');
        if (!tierSel || !itypeSel || !perfilSel || !btn) return;

        TIER_ORDER.forEach(t => {
          const opt = document.createElement('option');
          opt.value = t; opt.textContent = TIER_LABEL[t];
          tierSel.appendChild(opt);
        });
        ITYPE_ORDER.forEach(it => {
          const opt = document.createElement('option');
          opt.value = it; opt.textContent = ITYPE_LABEL[it];
          itypeSel.appendChild(opt);
        });
        PERFIL_ORDER.forEach(pf => {
          const opt = document.createElement('option');
          opt.value = pf; opt.textContent = pf;
          perfilSel.appendChild(opt);
        });

        tierSel.addEventListener('change', updateRecHint);
        itypeSel.addEventListener('change', updateRecHint);
        perfilSel.addEventListener('change', updateRecHint);
        btn.addEventListener('click', () => {
          buildRecommendedForComparison(tierSel.value, itypeSel.value, perfilSel.value);
          updateRecHint();
        });
        updateRecHint();
      }
      
      function setupChartTabs(){
        const tabs = document.querySelectorAll('.cp-tab');
        if (!tabs.length) return;
        tabs.forEach(t => {
          (t as HTMLElement).onclick = () => {
            tabs.forEach(x => x.classList.remove('active'));
            t.classList.add('active');
            renderChart();
          };
        });
      }

      function setupChartBenchmarks(){
        const chips = document.querySelectorAll('.bench-chip');
        chips.forEach(chip => {
          chip.addEventListener('click', () => {
            chip.classList.toggle('active');
            renderChart();
          });
        });
      }

      setupRecBuilder();
      setupImportBuilder();
      setupChartTabs();
      setupChartBenchmarks();

      const resetAllBtnEl = document.getElementById('resetAllBtn');
      if (resetAllBtnEl) resetAllBtnEl.onclick = resetAllPortfolios;

      try {
        renderAll();
      } catch(e: any) {
        console.error("renderAll error:", e);
      }
    })();
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite"

  return (
    <div className="minha-carteira-app">
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js" 
        onLoad={initApp}
      />

      <div className={data ? "block" : "hidden"} style={{ minHeight: data ? 'auto' : '0px' }}>
      {data && (
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-8 pb-4">
            <div className="mb-7">
                <div className="font-serif text-[28px] text-dash-text tracking-tight mb-1">
                    {greeting}, {data.userName}.
                </div>
                <div className="text-[13px] text-dash-text-muted">
                    Aqui está um resumo da sua situação financeira.
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
                <div className="bg-dash-surface border border-dash-border rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-1.5 text-[11px] text-dash-text-light uppercase tracking-[0.06em] mb-1">
                        <Wallet className="w-3 h-3" /> Patrimônio Total
                    </div>
                    <EditableMetric
                        label="Patrimônio Total"
                        value={data.totalCarteira}
                        onSave={v => saveProfile({ totalCarteira: v })}
                    />
                    <div className="text-[11px] text-dash-text-light mt-1">Carteira + saldo + reserva</div>
                </div>

                <div className="bg-dash-surface border border-dash-border rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-1.5 text-[11px] text-dash-text-light uppercase tracking-[0.06em] mb-1">
                        <PiggyBank className="w-3 h-3" /> Aporte Mensal
                    </div>
                    <EditableMetric
                        label="Aporte Mensal"
                        value={data.monthlyContribution}
                        onSave={v => savePlan({ monthlyContribution: v })}
                    />
                    <div className="text-[11px] text-dash-text-light mt-1">Definido no Planejamento</div>
                </div>

                <div className="bg-dash-surface border border-dash-border rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-1.5 text-[11px] text-dash-text-light uppercase tracking-[0.06em] mb-1">
                        <TrendingUp className="w-3 h-3" /> Retorno Est.
                    </div>
                    <EditableMetric
                        label="Retorno Estimado"
                        value={data.expectedReturn}
                        onSave={v => savePlan({ expectedReturn: v })}
                        prefix=""
                        suffix="% a.a."
                    />
                    <div className="text-[11px] text-dash-text-light mt-1">Rentabilidade nominal</div>
                </div>

                <div className="bg-dash-surface border border-dash-border rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-1.5 text-[11px] text-dash-text-light uppercase tracking-[0.06em] mb-1">
                        <BarChart3 className="w-3 h-3" /> Reserva de Emergência
                    </div>
                    <EditableMetric
                        label="Reserva de Emergência"
                        value={data.emergencyFund}
                        onSave={v => saveProfile({ emergencyFund: v })}
                    />
                    <div className="text-[11px] text-dash-text-light mt-1">Fundo de liquidez</div>
                </div>
            </div>
        </div>
      )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .minha-carteira-app {
            --bg:#f6f4ef; --panel:#ffffff; --panel2:#f0ece1; --border:#e4e0d7;
            --text:#123044; --muted:#667085; --good:#10B981; --bad:#EF4444; --warn:#F59E0B;
            --accent:#4fa080; --zaga:#3b82f6; --meio:#f59e0b; --ataque:#ef4444; --unk:#9aa0b8;
            background: transparent; color: var(--text);
            font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
            min-height: 100vh;
        }
        .minha-carteira-app * { box-sizing:border-box; }
        .minha-carteira-app header { padding:32px 32px 8px 32px; max-width:1400px; margin:0 auto; }
        .minha-carteira-app .kicker { font-size:13px; font-weight:700; color:var(--accent); text-transform:uppercase; letter-spacing:0.04em; margin-bottom:8px; }
        .minha-carteira-app header h1 { margin:0 0 12px 0; font-size:28px; letter-spacing:-0.02em; }
        .minha-carteira-app header p { margin:0; font-size:15px; color:var(--muted); max-width:800px; line-height:1.5; }

        .minha-carteira-app .mc-wrap { padding:0; margin:0; }

        .minha-carteira-app .mc-panel { background:var(--panel); border:1px solid var(--border); border-radius:16px; padding:24px 28px; margin-bottom:24px; box-shadow:0 4px 12px rgba(18,48,68,0.03), 0 1px 2px rgba(18,48,68,0.02); transition: box-shadow 0.2s ease; }
        .minha-carteira-app .mc-panel:hover { box-shadow:0 6px 16px rgba(18,48,68,0.05), 0 2px 4px rgba(18,48,68,0.03); }
        .minha-carteira-app .mc-panel h2 { margin:0 0 4px 0; font-size:18px; }
        .minha-carteira-app .mc-panel .sub { margin:0 0 16px 0; font-size:13px; color:var(--muted); line-height:1.5; }
        .minha-carteira-app .panel-head-row { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; flex-wrap:wrap; gap:12px; }
        .minha-carteira-app .panel-head-row h2 { margin-bottom:4px; }
        .minha-carteira-app .panel-head-row .sub { margin-bottom:0; }

        .minha-carteira-app .reset-link { flex:0 0 auto; background:transparent; border:1px solid var(--border); color:var(--muted); border-radius:8px; padding:8px 12px; font-size:12.5px; font-weight:600; cursor:pointer; white-space:nowrap; min-height:36px; }
        .minha-carteira-app .reset-link:hover { color:var(--bad); border-color:var(--bad); }
        .minha-carteira-app .autosave-note { margin:0 0 14px 0; font-size:12px; color:var(--good); font-weight:600; }

        .minha-carteira-app .chart-period-tabs { display:flex; background:var(--panel2); border-radius:8px; padding:4px; gap:4px; flex-wrap:wrap; }
        .minha-carteira-app .cp-tab { background:transparent; border:none; border-radius:6px; padding:6px 12px; font-size:12px; font-weight:600; color:var(--muted); cursor:pointer; transition:all .2s; }
        .minha-carteira-app .cp-tab:hover { color:var(--text); }
        .minha-carteira-app .cp-tab.active { background:var(--panel); color:var(--text); box-shadow:0 1px 3px rgba(0,0,0,0.06); }

        .minha-carteira-app .chart-benchmarks { display:flex; gap:10px; margin-top:12px; margin-bottom:12px; flex-wrap:wrap; justify-content:flex-end; }
        .minha-carteira-app .bench-chip { display:inline-flex; align-items:center; gap:6px; background:#fff; border:1px solid var(--border); border-radius:20px; padding:6px 14px; font-size:12px; font-weight:600; color:var(--muted); cursor:pointer; transition:all .2s; }
        .minha-carteira-app .bench-chip:hover { border-color:var(--c); }
        .minha-carteira-app .bench-chip.active { background:#f4f5fb; color:var(--text); border-color:transparent; }
        .minha-carteira-app .bench-chip .dot { width:8px; height:8px; border-radius:50%; background:var(--c); }

        .minha-carteira-app #chartBox { height:360px; position:relative; }

        .minha-carteira-app .leaderboard { display:flex; gap:10px; flex-wrap:wrap; }
        .minha-carteira-app .lb-item { display:flex; align-items:center; gap:10px; background:var(--panel2); border:1px solid var(--border); border-radius:12px; padding:10px 14px; min-width:220px; }
        .minha-carteira-app .lb-medal { font-size:19px; }
        .minha-carteira-app .lb-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
        .minha-carteira-app .lb-name { font-weight:700; font-size:14px; color:var(--text); }
        .minha-carteira-app .lb-sub { font-size:12px; color:var(--muted); }
        .minha-carteira-app .lb-val { margin-left:auto; text-align:right; font-size:15px; font-weight:700; }

        .minha-carteira-app .portfolios-row { display:flex; gap:20px; overflow-x:auto; padding-bottom:12px; }
        .minha-carteira-app .p-card { background:var(--panel); border:1px solid var(--border); border-radius:16px; border-top:6px solid var(--border); min-width:300px; max-width:100%; flex: 1 0 300px; padding:20px 22px; display:flex; flex-direction:column; gap:16px; overflow:hidden; box-shadow:0 2px 8px rgba(18,48,68,0.04); transition:box-shadow .2s ease, border-color .2s ease, transform .2s ease; }
        .minha-carteira-app .p-card:hover { transform: translateY(-2px); box-shadow:0 8px 16px rgba(18,48,68,0.06); }
        .minha-carteira-app .p-card.is-target { border-color:var(--accent); box-shadow:0 0 0 2px var(--accent); }
        .minha-carteira-app .p-card .p-target-flag { font-size:11px; font-weight:700; color:var(--accent); letter-spacing:.03em; display:flex; align-items:center; gap:4px; }
        .minha-carteira-app .p-card .p-head { display:flex; align-items:center; gap:10px; }
        .minha-carteira-app .p-card .p-head input.pname { background:transparent; border:none; color:var(--text); font-size:18px; font-weight:700; width:100%; padding:4px 6px; border-radius:6px; }
        .minha-carteira-app .p-card .p-head input.pname:focus { background:var(--panel2); outline:1px solid var(--border); }
        .minha-carteira-app .p-card .p-actions { display:flex; gap:8px; }
        .minha-carteira-app .iconbtn { background:var(--panel2); border:1px solid var(--border); color:var(--muted); border-radius:8px; padding:6px 10px; cursor:pointer; font-size:13px; min-width:36px; min-height:36px; }
        .minha-carteira-app .iconbtn:hover { color:var(--text); border-color:#c7cbe0; }

        .minha-carteira-app .alloc-bar-outer { height:10px; border-radius:6px; background:var(--panel2); overflow:hidden; border:1px solid var(--border); }
        .minha-carteira-app .alloc-bar-inner { height:100%; transition:width .25s ease, background .25s ease; }
        .minha-carteira-app .alloc-label { font-size:13.5px; color:var(--muted); display:flex; justify-content:space-between; margin-bottom:6px; }

        .minha-carteira-app .pt-total-row { display:flex; align-items:center; justify-content:space-between; gap:10px; }
        .minha-carteira-app .pt-total-label { font-size:12.5px; color:var(--muted); }
        .minha-carteira-app .pt-total-inputwrap { display:flex; align-items:center; gap:6px; background:#fff; border:1px solid var(--border); border-radius:8px; padding:5px 10px; }
        .minha-carteira-app .pt-total-prefix { font-size:13px; color:var(--muted); }
        .minha-carteira-app .pt-total-input { border:none; background:transparent; font-size:13.5px; font-weight:700; color:var(--text); width:100px; text-align:right; outline:none; }

        .minha-carteira-app .holding { background:var(--panel2); border:1px solid var(--border); border-radius:12px; padding:14px 16px; }
        .minha-carteira-app .holding-top { display:flex; justify-content:space-between; align-items:flex-start; gap:8px; }
        .minha-carteira-app .holding-name { font-size:14px; font-weight:600; line-height:1.25; color:var(--text); min-width:0; overflow-wrap:break-word; }
        .minha-carteira-app .holding-w { font-size:14px; font-weight:700; min-width:44px; text-align:right; color:var(--accent); }
        .minha-carteira-app .holding-editrow { display:flex; gap:10px; margin-top:10px; }
        .minha-carteira-app .holding-field { display:flex; align-items:center; gap:6px; background:#fff; border:1px solid var(--border); border-radius:7px; padding:5px 9px; flex:1; min-width:0; }
        .minha-carteira-app .holding-field-label { font-size:12px; color:var(--muted); font-weight:600; flex:0 0 auto; }
        .minha-carteira-app .holding-w-input, .minha-carteira-app .holding-amt-input { border:none; outline:none; font-size:13.5px; width:100%; min-width:0; color:var(--text); text-align:right; background:transparent; }
        .minha-carteira-app .holding-meta { display:flex; gap:8px; margin-top:8px; align-items:center; }
        .minha-carteira-app .pill { font-size:11px; padding:3px 10px; border-radius:20px; font-weight:700; color:#fff; }
        .minha-carteira-app .holding input[type=range] { 
          -webkit-appearance: none; 
          width: 100%; 
          margin-top: 14px; 
          background: transparent;
          height: 20px;
        }
        .minha-carteira-app .holding input[type=range]:focus { outline: none; }
        .minha-carteira-app .holding input[type=range]::-webkit-slider-runnable-track {
          width: 100%; 
          height: 6px; 
          background: linear-gradient(to right, var(--c, var(--accent)) var(--val, 0%), #e6e8f2 var(--val, 0%));
          border-radius: 6px; 
          border: none;
        }
        .minha-carteira-app .holding input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; 
          height: 16px; 
          width: 16px; 
          border-radius: 50%; 
          background: #fff;
          border: 3.5px solid var(--c, var(--accent));
          cursor: pointer; 
          margin-top: -5px; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.15);
          transition: transform 0.1s ease;
        }
        .minha-carteira-app .holding input[type=range]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        .minha-carteira-app .rm { background:transparent; border:none; color:var(--muted); cursor:pointer; font-size:15px; line-height:1; min-width:32px; min-height:32px; }
        .minha-carteira-app .rm:hover { color:var(--bad); }

        .minha-carteira-app .add-row { display:flex; gap:6px; flex-wrap:wrap; }
        .minha-carteira-app select.fund-select { flex:1 1 0; min-width:0; max-width:100%; background:#fff; color:var(--text); border:1px solid var(--border); border-radius:8px; padding:9px; font-size:13px; overflow:hidden; text-overflow:ellipsis; }
        .minha-carteira-app .add-btn { flex:0 0 auto; background:var(--accent); color:#fff; border:none; border-radius:8px; padding:9px 14px; font-size:13px; font-weight:700; cursor:pointer; white-space:nowrap; }
        .minha-carteira-app .add-btn:hover { background:#3d5adf; }
        .minha-carteira-app .add-btn:disabled { background:#c6cdf0; cursor:not-allowed; }

        .minha-carteira-app .headline { display:flex; gap:18px; border-top:1px solid var(--border); padding-top:12px; margin-top:2px; }
        .minha-carteira-app .headline .hl { flex:1; }
        .minha-carteira-app .headline .hl-label { font-size:11.5px; color:var(--muted); margin-bottom:2px; }
        .minha-carteira-app .headline .hl-val { font-size:20px; font-weight:800; }

        .minha-carteira-app details.more { margin-top:2px; }
        .minha-carteira-app details.more summary { cursor:pointer; font-size:12.5px; color:var(--accent); font-weight:600; list-style:none; user-select:none; }
        .minha-carteira-app details.more summary::-webkit-details-marker { display:none; }
        .minha-carteira-app details.more summary:before { content:"▸ "; }
        .minha-carteira-app details.more[open] summary:before { content:"▾ "; }
        .minha-carteira-app .mini-list { display:flex; flex-direction:column; gap:5px; margin-top:8px; font-size:12.5px; }
        .minha-carteira-app .mini-row { display:flex; justify-content:space-between; }
        .minha-carteira-app .mini-row .m-label { color:var(--muted); }
        .minha-carteira-app .mini-row .m-val { font-weight:700; }

        .minha-carteira-app .empty-hint { font-size:12.5px; color:var(--muted); text-align:center; padding:16px 8px; border:1.5px dashed var(--border); border-radius:12px; }

        .minha-carteira-app .new-card { display:flex; align-items:center; justify-content:center; min-width:150px; max-width:150px; flex:0 0 150px; border:2px dashed var(--border); border-radius:16px; cursor:pointer; color:var(--muted); font-weight:700; font-size:14px; text-align:center; transition:all .2s; }
        .minha-carteira-app .new-card:hover { border-color:var(--accent); color:var(--accent); background:#f6f8ff; }

        .minha-carteira-app .notes { font-size:13px; color:var(--text); line-height:1.6; }
        .minha-carteira-app .notes .note-item { background:var(--panel2); border:1px solid var(--border); border-radius:10px; padding:10px 14px; margin-bottom:8px; }
        .minha-carteira-app .notes .note-item:last-child { margin-bottom:0; }
        .minha-carteira-app .notes b { color:var(--text); }
        .minha-carteira-app details.notes-toggle summary { cursor:pointer; font-size:13.5px; color:var(--muted); user-select:none; font-weight:600; }
        .minha-carteira-app details.notes-toggle[open] summary { margin-bottom:10px; }

        .minha-carteira-app .pos { color:var(--good); } .minha-carteira-app .neg { color:var(--bad); }

        .minha-carteira-app .mc-main-layout { display:flex; gap:24px; align-items:flex-start; }
        .minha-carteira-app .mc-asset-sidebar { width:320px; flex:0 0 320px; min-width:0; position:sticky; top:12px; max-height:calc(100vh - 24px); overflow-y:auto; background:var(--panel); border:1px solid var(--border); border-radius:16px; padding:24px 20px; box-sizing:border-box; z-index:10; box-shadow:0 4px 12px rgba(18,48,68,0.03); }
        .minha-carteira-app .mc-asset-sidebar h2 { margin:0 0 4px 0; font-size:15px; font-weight:700; }
        .minha-carteira-app .mc-asset-sidebar .sub { margin:0 0 16px 0; font-size:12px; color:var(--muted); line-height:1.5; }
        .minha-carteira-app .mc-main-col { flex:1; min-width:0; }

        .minha-carteira-app .target-select-wrap { font-size:11.5px; color:var(--muted); margin-bottom:12px; }
        .minha-carteira-app .target-select-wrap select { width:100%; margin-top:6px; padding:9px 10px; border:1px solid var(--border); border-radius:8px; font-size:13px; background:#fff; color:var(--text); }
        .minha-carteira-app #assetSearch { width:100%; padding:10px 12px; border:1px solid var(--border); border-radius:8px; font-size:13px; margin-bottom:12px; box-sizing:border-box; }
        .minha-carteira-app .filter-chips { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:16px; }
        .minha-carteira-app .chip { font-size:12px; padding:6px 12px; border-radius:20px; border:1px solid var(--border); background:var(--panel2); color:var(--muted); cursor:pointer; font-weight:600; }
        .minha-carteira-app .chip.active { background:var(--accent); color:#fff; border-color:var(--accent); }

        .minha-carteira-app .asset-list { display:flex; flex-direction:column; gap:12px; }
        .minha-carteira-app .asset-card { background:var(--panel2); border:1px solid var(--border); border-radius:12px; padding:14px 16px; cursor:grab; transition:all 0.2s ease; }
        .minha-carteira-app .asset-card:hover { transform:translateY(-2px); box-shadow:0 6px 12px rgba(18,48,68,0.06); border-color:#d4d0c5; }
        .minha-carteira-app .asset-card.dragging { opacity:0.45; }
        .minha-carteira-app .asset-card.added { opacity:0.55; }
        .minha-carteira-app .asset-top { display:flex; justify-content:space-between; align-items:center; gap:6px; }
        .minha-carteira-app .asset-add-btn { background:var(--accent); color:#fff; border:none; border-radius:8px; width:34px; height:34px; font-size:15px; cursor:pointer; line-height:1; flex:0 0 auto; }
        .minha-carteira-app .asset-add-btn:hover { background:#3d5adf; }
        .minha-carteira-app .asset-add-btn:disabled { background:#c6cdf0; cursor:not-allowed; }
        .minha-carteira-app .asset-name { font-size:13.5px; font-weight:700; margin-top:8px; overflow-wrap:break-word; color:var(--text); }
        .minha-carteira-app .asset-gestora { font-size:12px; color:var(--muted); margin-top:2px; }
        .minha-carteira-app .asset-stats { display:flex; gap:12px; margin-top:10px; font-size:11px; color:var(--muted); flex-wrap:wrap; }
        .minha-carteira-app .asset-stats b { font-weight:700; }

        .minha-carteira-app .p-card.dragover { border-color:var(--accent); box-shadow:0 0 0 2px rgba(79,109,245,0.25); }

        .minha-carteira-app .rec-builder-row { display:flex; gap:8px; flex-wrap:wrap; align-items:center; }
        .minha-carteira-app .rec-builder-row select { background:#fff; color:var(--text); border:1px solid var(--border); border-radius:8px; padding:8px 9px; font-size:12.5px; }
        .minha-carteira-app .rec-build-btn { background:var(--accent); color:#fff; border:none; border-radius:8px; padding:8px 14px; font-size:12.5px; font-weight:700; cursor:pointer; white-space:nowrap; }
        .minha-carteira-app .rec-build-btn:hover { background:#3d5adf; }
        .minha-carteira-app .rec-builder-hint { font-size:11.5px; color:var(--muted); line-height:1.5; }

        .minha-carteira-app .action-toggle { margin-bottom:12px; }
        .minha-carteira-app .action-toggle summary { cursor:pointer; list-style:none; display:flex; align-items:center; gap:8px; background:var(--panel2); border:1px solid var(--border); border-radius:10px; padding:11px 14px; font-size:13px; font-weight:700; color:var(--text); user-select:none; }
        .minha-carteira-app .action-toggle summary::-webkit-details-marker { display:none; }
        .minha-carteira-app .action-toggle summary::after { content:'Abrir ▸'; margin-left:auto; color:var(--accent); font-size:11.5px; font-weight:700; }
        .minha-carteira-app .action-toggle[open] summary::after { content:'Fechar ▾'; }
        .minha-carteira-app .action-toggle[open] summary { border-radius:10px 10px 0 0; }
        .minha-carteira-app .action-toggle summary:hover { border-color:var(--accent); }
        .minha-carteira-app .action-toggle-body { display:flex; flex-direction:column; gap:8px; padding:14px 16px; background:var(--panel2); border:1px solid var(--border); border-top:none; border-radius:0 0 10px 10px; }
        .minha-carteira-app .import-builder-row { display:flex; gap:10px; flex-wrap:wrap; align-items:center; }
        .minha-carteira-app .import-builder input[type=file] { font-size:12px; max-width:100%; }
        .minha-carteira-app .import-or { font-size:12px; color:var(--muted); }
        .minha-carteira-app .import-textarea { width:100%; min-height:64px; resize:vertical; border:1px solid var(--border); border-radius:8px; padding:8px 9px; font-size:12.5px; font-family:inherit; background:#fff; color:var(--text); box-sizing:border-box; }
        .minha-carteira-app .import-btn { background:var(--accent); color:#fff; border:none; border-radius:8px; padding:8px 14px; font-size:12.5px; font-weight:700; cursor:pointer; white-space:nowrap; }
        .minha-carteira-app .import-btn:hover { background:#3d5adf; }
        .minha-carteira-app .import-builder-hint { font-size:11.5px; color:var(--muted); line-height:1.5; }
        .minha-carteira-app .import-builder-warn { font-size:12.5px; color:var(--warn); background:#fff7ed; border:1px solid #fde3c4; border-radius:8px; padding:9px 12px; margin:0 0 10px 0; font-weight:600; }
        .minha-carteira-app .import-review-warn { font-size:11.5px; color:var(--warn); margin:-4px 0 8px 0; }

        .minha-carteira-app .import-modal { position:fixed; inset:0; background:rgba(20,22,40,0.45); z-index:1000; display:none; align-items:center; justify-content:center; padding:20px; }
        .minha-carteira-app .import-modal-inner { background:var(--panel); border-radius:16px; max-width:720px; width:100%; max-height:85vh; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 12px 40px rgba(20,22,40,0.25); }
        .minha-carteira-app .import-modal-header { display:flex; justify-content:space-between; align-items:center; padding:16px 20px; border-bottom:1px solid var(--border); }
        .minha-carteira-app .import-modal-header h3 { margin:0; font-size:16px; }
        .minha-carteira-app .import-modal-body { padding:14px 20px; overflow-y:auto; flex:1; }
        .minha-carteira-app .import-name-label { font-size:12.5px; color:var(--muted); display:flex; flex-direction:column; gap:4px; margin-bottom:10px; }
        .minha-carteira-app .import-name-label input { padding:8px 9px; border:1px solid var(--border); border-radius:8px; font-size:13px; color:var(--text); }
        .minha-carteira-app .import-review-total { font-size:12.5px; margin-bottom:10px; }
        .minha-carteira-app .import-review-rows { display:flex; flex-direction:column; gap:6px; }
        .minha-carteira-app .import-review-item { display:flex; flex-direction:column; gap:3px; }
        .minha-carteira-app .import-review-row { display:grid; grid-template-columns:1.4fr 70px 1.4fr 110px auto; gap:6px; align-items:center; }
        .minha-carteira-app .import-review-row input, .minha-carteira-app .import-review-row select { padding:7px 8px; border:1px solid var(--border); border-radius:8px; font-size:12px; color:var(--text); background:#fff; min-width:0; }
        .minha-carteira-app .import-add-row-btn { margin-top:10px; background:transparent; border:1.5px dashed var(--border); color:var(--muted); border-radius:8px; padding:7px 12px; font-size:12px; cursor:pointer; }
        .minha-carteira-app .import-add-row-btn:hover { color:var(--accent); border-color:var(--accent); }
        .minha-carteira-app .import-modal-footer { padding:14px 20px; border-top:1px solid var(--border); display:flex; justify-content:flex-end; }

        .minha-carteira-app .p-tag-pill { font-size:10px; font-weight:800; padding:2px 8px; border-radius:20px; color:#fff; flex:0 0 auto; }
        .minha-carteira-app .p-tag-pill.tag-antes { background:#767c99; }
        .minha-carteira-app .p-tag-pill.tag-depois { background:var(--accent); }

        .minha-carteira-app .before-after-box { display:flex; flex-direction:column; gap:10px; margin-bottom:16px; }
        .minha-carteira-app .before-after-card { background:var(--panel2); border:1px solid var(--border); border-radius:12px; padding:12px 16px; }
        .minha-carteira-app .ba-title { font-size:13px; font-weight:700; margin-bottom:8px; }
        .minha-carteira-app .ba-row { display:grid; grid-template-columns:1fr 70px 20px 70px; gap:6px; align-items:center; font-size:12.5px; margin-bottom:4px; }
        .minha-carteira-app .ba-label { color:var(--muted); }
        .minha-carteira-app .ba-val { font-weight:700; text-align:right; }
        .minha-carteira-app .ba-arrow { text-align:center; color:var(--muted); }

        @media (max-width:900px){
          .minha-carteira-app .mc-main-layout { flex-direction:column; align-items:stretch; }
          .minha-carteira-app .mc-main-col { order:1; }
          .minha-carteira-app .mc-asset-sidebar { order:2; width:100%; flex:none; position:static; max-height:none; }
        }
      `}} />

      <div dangerouslySetInnerHTML={{ __html: `
        <div class="mc-wrap">
        <div class="mc-main-layout">

          <div class="mc-main-col">

          <div class="mc-panel" style="padding-bottom:12px;">
            <div class="panel-head-row" style="align-items:center; margin-bottom: 16px;">
              <div style="display:flex; align-items:center; gap:8px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--text);"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                <h2 style="margin:0; font-size:16px;">Rentabilidade da Carteira (%)</h2>
              </div>
              <div class="chart-benchmarks" id="chartBenchmarks" style="margin:0;">
                 <button type="button" class="bench-chip active" data-bench="CDI" style="--c:#9aa0b8"><span class="dot"></span>CDI</button>
                 <button type="button" class="bench-chip" data-bench="IPCA" style="--c:#3b82f6"><span class="dot"></span>IPCA</button>
                 <button type="button" class="bench-chip" data-bench="IBOV" style="--c:#ef4444"><span class="dot"></span>IBOV</button>
              </div>
            </div>
            
            <div style="display:flex; align-items:center; gap:16px; margin-bottom: 24px;">
              <div class="chart-period-tabs" id="chartPeriodTabs" style="margin:0;">
                <button type="button" class="cp-tab" data-months="1">1M</button>
                <button type="button" class="cp-tab" data-months="YTD">YTD</button>
                <button type="button" class="cp-tab" data-months="12">12M</button>
                <button type="button" class="cp-tab" data-months="24">24M</button>
                <button type="button" class="cp-tab" data-months="36">36M</button>
                <button type="button" class="cp-tab active" data-months="0">MAX</button>
              </div>
              <p class="sub" id="chartDateRange" style="margin:0; font-size:13px; font-weight:500;">Acumulado desde jan. 23</p>
            </div>
            <div id="chartBox"><canvas id="chart"></canvas></div>
          </div>

          <div class="mc-panel">
            <h2>🏆 Qual carteira está na frente</h2>
            <p class="sub">Atualiza automaticamente conforme você ajusta as carteiras abaixo.</p>
            <div class="leaderboard" id="leaderboard"></div>
          </div>

          <div class="mc-panel">
            <div class="panel-head-row">
              <div>
                <h2>Suas carteiras</h2>
                <p class="sub">Escolha um fundo pela lista lateral (clique ou arraste) ou pelo campo abaixo, ajuste o percentual com o controle deslizante e repita até fechar 100%.</p>
              </div>
              <button type="button" class="reset-link" id="resetAllBtn" title="Apaga tudo e recomeça com carteiras vazias">↺ Recomeçar do zero</button>
            </div>
            <p class="autosave-note">✓ Seu progresso fica salvo automaticamente neste navegador.</p>

            <details class="action-toggle">
              <summary>📥 Importar carteira do cliente (o "antes")</summary>
              <div class="action-toggle-body">
                <div class="import-builder-row">
                  <input type="file" id="importFileInput" accept=".csv,.txt,.xlsx,.xls,.pdf">
                  <span class="import-or">ou cole a lista abaixo</span>
                </div>
                <textarea id="importTextInput" class="import-textarea" placeholder="Cole aqui, uma linha por ativo. Ex:&#10;Fundo XPTO - 20%&#10;Tesouro Selic - R$ 15.000,00"></textarea>
                <div class="import-builder-row">
                  <button type="button" class="import-btn" id="importBtn">Importar e revisar</button>
                </div>
                <div class="import-builder-warn" id="importBuilderWarn" style="display:none;"></div>
                <div class="import-builder-hint">Aceita Excel/CSV, .txt, PDF ou texto colado. Antes de criar a carteira, você revisa e confirma o reconhecimento de cada ativo — inclusive ativos que não têm histórico na nossa base, informando um retorno médio manualmente.</div>
              </div>
            </details>

            <details class="action-toggle">
              <summary>🎯 Montar uma carteira recomendada automaticamente</summary>
              <div class="action-toggle-body">
                <div class="rec-builder-row">
                  <select id="recTier"></select>
                  <select id="recItype"></select>
                  <select id="recPerfil"></select>
                  <button type="button" class="rec-build-btn" id="recBuildBtn">Montar carteira</button>
                </div>
                <div class="rec-builder-hint" id="recHint"></div>
              </div>
            </details>

            <div class="before-after-box" id="beforeAfterBox" style="display:none;"></div>

            <div class="portfolios-row" id="portfoliosRow"></div>
          </div>

          <div class="mc-panel">
            <details class="notes-toggle">
              <summary>ℹ️ Sobre os dados usados aqui</summary>
              <div class="notes">
                <div class="note-item"><b>Fonte:</b> retornos mensais reais da sua planilha oficial (abas "Fundos Selecionados" e "Dados Mês a mês") — 30 ativos, de janeiro de 2023 a maio de 2026 (41 meses). Padronizei todos os fundos nesse mesmo período de 41 meses para poder comparar qualquer combinação de forma justa (os 7 fundos que só entraram para viabilizar as carteiras recomendadas oficiais têm dado real só até mai/2026, um mês a menos do que os 23 originais tinham antes).</div>
                <div class="note-item">🎯 <b>Botão "Montar carteira recomendada":</b> monta, com um clique, qualquer uma das suas 36 carteiras oficiais (4 faixas de patrimônio × Geral/IQ/Equilibrada × 3 perfis de risco), usando os mesmos pesos da planilha "Carteiras Recomendadas". Cria uma carteira nova — não mexe nas que você já montou.</div>
                <div class="note-item">⚠️ <b>O CDBI11 foi deixado de fora</b> deste simulador: percebi que sua série de retornos na planilha é idêntica, mês a mês, à do Tesouro Selic — sinal de que é um dado copiado/placeholder, não um retorno real. Vale corrigir isso na fonte antes de reincluí-lo em qualquer análise.</div>
                <div class="note-item">⚠️ <b>IVVB11, NASD11 e WRLD11</b> ainda não têm gestora nem classificação de risco (Zaga/Meio/Ataque) cadastradas — por isso aparecem com essa informação em branco. Vale completar esse cadastro.</div>
                <div class="note-item"><b>Percentual não alocado</b> vira caixa parado (rendimento zero), não CDI. Se a soma passar de 100%, o simulador simplesmente pondera os fundos do jeito que você configurou, sem travar — é o modo livre que você pediu (isso vale para as carteiras que você monta manualmente; as recomendadas já vêm fechadas em 100%).</div>
                <div class="note-item"><b>Sem limites de concentração</b> nas carteiras montadas manualmente: ao contrário das carteiras recomendadas (que já respeitam os tetos de 10% por fundo / 15% por gestora da planilha oficial), aqui não há trava — os números de concentração em "ver mais números" são só informativos.</div>
                <div class="note-item">Os 41 meses de histórico (~3,4 anos) ainda são um período curto, especialmente para os fundos de ações (Ataque) — vale cautela antes de tirar conclusões definitivas só pelo ranking.</div>
                <div class="note-item"><b>Retorno a.a. / vol / queda máxima</b> mostrados na lista lateral são calculados sobre o fundo isoladamente (100% dele), no mesmo período de 41 meses — servem para comparar fundos entre si, não como previsão de retorno futuro.</div>
              </div>
            </details>
          </div>

          </div>

        </div>
        </div>

        <div id="importReviewModal" class="import-modal">
          <div class="import-modal-inner">
            <div class="import-modal-header">
              <h3>Revisar carteira importada</h3>
              <button type="button" class="iconbtn" id="importModalClose">✕</button>
            </div>
            <div class="import-modal-body">
              <label class="import-name-label">Nome da carteira
                <input type="text" id="importPortfolioName" value="Carteira atual do cliente">
              </label>
              <div id="importReviewTotal" class="import-review-total"></div>
              <div id="importReviewRows" class="import-review-rows"></div>
              <button type="button" class="import-add-row-btn" id="importAddRowBtn">+ Adicionar linha manualmente</button>
            </div>
            <div class="import-modal-footer">
              <button type="button" class="rec-build-btn" id="importConfirmBtn">Confirmar e criar carteira</button>
            </div>
          </div>
        </div>
      `}} />
    </div>
  )
}
