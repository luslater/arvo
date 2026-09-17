"use client"

import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { useSession } from "next-auth/react"
import { Pencil, Check, X, TrendingUp, Wallet, PiggyBank, BarChart3, ShieldCheck } from "lucide-react"
import { HISTORICAL_DATA } from "@/data/historicalData"
import { RECOMMENDED_PORTFOLIOS, ASSET_METRICS, TIER_ORDER, TIER_LABEL, TIER_DEFAULT_VALUE, ITYPE_ORDER, ITYPE_LABEL, PERFIL_ORDER } from "@/data/portfoliosData"
import { PortfolioFileError, readPortfolioFile } from "@/lib/portfolio-file-reader"

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
    returnSource?: string
    userName: string
}

function computeBussolaReturn(portfolioType?: string | null): number {
    const normalized = (portfolioType || "RITMO").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const p = RECOMMENDED_PORTFOLIOS.find(rp => 
        rp.perfil.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === normalized
    );

    if (p && p.weights) {
        let ret = 0, weightTotal = 0;
        const metricKeys = Object.keys(ASSET_METRICS);
        Object.entries(p.weights).forEach(([assetName, weight]) => {
            let metrics = ASSET_METRICS[assetName];
            if (!metrics) {
                const key = metricKeys.find(k => k.includes(assetName) || assetName.includes(k.split(' (')[0]));
                if (key) metrics = ASSET_METRICS[key];
            }
            if (metrics) {
                ret += metrics.expectedReturn * (weight * 100) / 100;
                weightTotal += (weight * 100);
            }
        });
        if (weightTotal > 0) {
            return parseFloat((ret * (100 / weightTotal)).toFixed(1));
        }
    }

    const defaults: Record<string, number> = {
        "ABRIGO": 13.9,
        "RITMO": 14.8,
        "VISAO": 17.2,
        "OCEANO": 21.5
    };
    return defaults[normalized] || 14.8;
}

function computeInformedReturnFromHoldings(holdings?: Array<{ name: string; weight: number }>): number | null {
    if (!holdings || holdings.length === 0) return null;
    const DATA = HISTORICAL_DATA;
    const FUND_BY_NAME: Record<string, any> = {};
    DATA.funds.forEach(f => FUND_BY_NAME[f.name] = f);
    const N = DATA.months.length;

    const monthly = new Array(N).fill(0);
    let sumWeight = 0;
    holdings.forEach(h => {
        const f = FUND_BY_NAME[h.name];
        if (!f) return;
        const w = (h.weight || 0) / 100;
        sumWeight += (h.weight || 0);
        for (let t = 0; t < N; t++) monthly[t] += w * (f.values[t] || 0);
    });

    if (sumWeight <= 0) return null;
    let w = 1;
    for (const r of monthly) { w *= (1 + (r || 0)); }
    const annRet = (Math.pow(w, 12 / N) - 1) * 100;
    if (isNaN(annRet) || annRet <= 0) return null;
    return parseFloat(annRet.toFixed(1));
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
                {prefix === "R$" && <span className="text-[13px] text-dash-text-muted font-semibold">R$</span>}
                <input
                    autoFocus
                    type="text"
                    defaultValue={prefix === "R$" ? value.toString() : value.toString()}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") setEditing(false) }}
                    className="w-28 border-b-2 border-dash-accent bg-transparent text-[22px] font-bold tabular-nums text-dash-text outline-none"
                />
                <button onClick={handleSave} className="text-emerald-600 hover:text-emerald-700"><Check className="w-4 h-4" /></button>
                <button onClick={() => setEditing(false)} className="text-dash-text-light hover:text-dash-danger"><X className="w-4 h-4" /></button>
            </div>
        )
    }

    return (
        <div 
            onClick={() => { setInput(value.toString()); setEditing(true) }}
            className="flex items-center gap-1.5 group cursor-pointer"
            title="Clique para editar"
        >
            <div className="tabular-nums text-[22px] sm:text-[24px] font-extrabold text-dash-text tracking-tight group-hover:text-dash-accent transition-colors">{display}</div>
            <button
                type="button"
                className="opacity-40 group-hover:opacity-100 transition-opacity p-1 hover:bg-dash-surface-active rounded-md"
            >
                <Pencil className="w-3.5 h-3.5 text-dash-text-muted group-hover:text-dash-accent" />
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
          const params = new URLSearchParams(window.location.search)
          const adminUserId = params.get("adminViewUser")
          const qs = adminUserId ? `&adminViewUser=${adminUserId}` : ""

          const [profileRes, planRes] = await Promise.all([
              fetch(`/api/user/profile?t=${Date.now()}${qs}`, { cache: "no-store", headers: { "Cache-Control": "no-cache, no-store, must-revalidate" }, credentials: "include" }),
              fetch(`/api/user/financial-plan?t=${Date.now()}${qs}`, { cache: "no-store", headers: { "Cache-Control": "no-cache, no-store, must-revalidate" }, credentials: "include" })
          ])
          if (!profileRes.ok) return;
          const profile = await profileRes.json()
          const plan = planRes.ok ? await planRes.json() : null

          // Priority 1: Check informed portfolio from database (jornadaData.carteira2Data) or localStorage state
          let savedState: any = null;
          const userScope = session?.user?.email ? encodeURIComponent(session.user.email) : 'guest';
          const storageKey = `simuladorCarteirasState_${userScope}_v2`;

          try {
              if (profile?.jornadaData) {
                  const jData = typeof profile.jornadaData === 'string' ? JSON.parse(profile.jornadaData) : profile.jornadaData;
                  if (jData?.carteira2Data && Array.isArray(jData.carteira2Data.portfolios)) {
                      savedState = jData.carteira2Data;
                  }
              }
              if (!savedState && typeof window !== "undefined" && window.localStorage) {
                  savedState = JSON.parse(localStorage.getItem(storageKey) || "null");
              }
              if (savedState && typeof window !== "undefined" && window.localStorage) {
                  localStorage.setItem(storageKey, JSON.stringify(savedState));
              }
          } catch (e) {}

          const activeInformed = savedState?.portfolios?.find((p: any) => p.holdings && p.holdings.length > 0);
          let calcReturn: number = 0;
          let returnSourceLabel: string = "Rentabilidade nominal";

          if (activeInformed) {
              const informedRet = computeInformedReturnFromHoldings(activeInformed.holdings);
              if (informedRet && informedRet > 0) {
                  calcReturn = informedRet;
                  returnSourceLabel = activeInformed.name ? `Carteira: ${activeInformed.name}` : "Carteira informada";
              }
          }

          // Priority 2: If no informed portfolio, get the return of his selected portfolio in Bússola
          if (!calcReturn || calcReturn <= 0) {
              const bussolaReturn = computeBussolaReturn(profile?.portfolioType || "RITMO");
              calcReturn = plan?.expectedReturn && plan.expectedReturn > 0 ? plan.expectedReturn : bussolaReturn;
              const profName = profile?.portfolioType || "Bússola";
              returnSourceLabel = `Carteira ${profName} (Bússola)`;
          }

          setData({
              totalCarteira: profile?.totalCarteira ?? 0,
              saldo: profile?.saldo ?? 0,
              emergencyFund: profile?.emergencyFund ?? 0,
              portfolioType: profile?.portfolioType ?? null,
              monthlyContribution: plan?.monthlyContribution ?? 0,
              desiredLifestyleCost: plan?.desiredLifestyleCost ?? 0,
              investmentPeriod: plan?.investmentPeriod ?? 20,
              expectedReturn: calcReturn,
              returnSource: returnSourceLabel,
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
      const params = new URLSearchParams(window.location.search)
      const adminUserId = params.get("adminViewUser")
      const qs = adminUserId ? `?adminViewUser=${adminUserId}` : ""
      
      await fetch(`/api/user/profile${qs}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates)
      })
      setData(prev => prev ? { ...prev, ...updates } : prev)
  }

  const savePlan = async (updates: Partial<{ monthlyContribution: number; desiredLifestyleCost: number; investmentPeriod: number; expectedReturn: number }>) => {
      const current = data!
      const params = new URLSearchParams(window.location.search)
      const adminUserId = params.get("adminViewUser")
      const qs = adminUserId ? `?adminViewUser=${adminUserId}` : ""

      await fetch(`/api/user/financial-plan${qs}`, {
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
    if (typeof window === 'undefined') return;

    const canvas = document.getElementById('chart') as HTMLCanvasElement;
    if (!canvas) {
      setTimeout(initApp, 60);
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
        const p: any = { id: nextId++, name, color: PALETTE[nextColorIdx % PALETTE.length], holdings: holdings || [], totalValue: tv, tag: '', pairWithId: null as any, monthlyHistory: [], portfolioReturn12m: null };
        nextColorIdx++;
        return p;
      }

                                    
      function findRecommended(tier: any, itype: any, perfil: any){
        return RECOMMENDED_PORTFOLIOS.find(r => r.tier === tier && r.itype === itype && r.perfil === perfil)
          || RECOMMENDED_PORTFOLIOS.find(r => r.itype === itype && r.perfil === perfil)
          || RECOMMENDED_PORTFOLIOS.find(r => r.tier === tier && r.perfil === perfil)
          || RECOMMENDED_PORTFOLIOS.find(r => r.perfil === perfil)
          || RECOMMENDED_PORTFOLIOS[0];
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

      function calculateYieldFromIndexadorAndTaxa(indexador: string, taxaStr: string): number {
        const clean = String(taxaStr || '').trim().toLowerCase();
        
        // Parâmetros médios de referência de mercado atualizados (CDI atual: 13,90% a.a. -> 1,09% a.m.)
        const CDI_BASE_ANNUAL = 0.1390; // 13.90% a.a.
        const CDI_BASE_MONTHLY = (Math.pow(1 + CDI_BASE_ANNUAL, 1 / 12) - 1) * 100; // ~1.09% a.m.
        const SELIC_BASE_ANNUAL = 0.1400; // 14.00% a.a.
        const SELIC_BASE_MONTHLY = (Math.pow(1 + SELIC_BASE_ANNUAL, 1 / 12) - 1) * 100; // ~1.10% a.m.
        const IPCA_BASE_ANNUAL = 0.0450; // 4.50% a.a.
        const IBOV_BASE_MONTHLY = 1.17; // 15% a.a.
        const FII_BASE_MONTHLY = 0.99; // 12.5% a.a.
        const MULTI_BASE_MONTHLY = 0.95; // 12% a.a.
        const DOLAR_BASE_MONTHLY = 0.80; // 10% a.a.

        if (indexador === 'Pós-fixado (CDI)') {
          // 1. Se for no formato spread aditivo: "CDI + 1,2%" ou "+ 1.2%"
          const spreadMatch = clean.match(/(?:cdi\s*\+\s*|\+\s*)(\d+(?:[.,]\d+)?)/i);
          if (spreadMatch) {
            const spread = parseFloat(spreadMatch[1].replace(',', '.'));
            if (isFinite(spread) && spread > 0) {
              const monthlySpread = spread > 3 ? (Math.pow(1 + spread / 100, 1 / 12) - 1) * 100 : spread;
              const monthly = CDI_BASE_MONTHLY + monthlySpread;
              return Math.round(monthly * 100) / 100;
            }
          }

          // 2. Percentual multiplicativo do CDI (ex: "120%", "120% CDI", "120% do CDI", "100%")
          const match = clean.match(/(\d+(?:[.,]\d+)?)/);
          let pct = 100;
          if (match) {
            const parsed = parseFloat(match[1].replace(',', '.'));
            if (isFinite(parsed) && parsed > 0) pct = parsed;
          }
          const totalAnnual = (pct / 100) * CDI_BASE_ANNUAL;
          const monthly = (Math.pow(1 + totalAnnual, 1 / 12) - 1) * 100;
          return Math.round(monthly * 100) / 100;
        }

        if (indexador === 'IPCA+') {
          // Extrai spread (ex: "IPCA + 6,5%", "+ 6.5%", "6.5%", "IPCA+ 6%")
          const match = clean.match(/(\d+(?:[.,]\d+)?)/);
          let spreadPct = 6.0;
          if (match) {
            const parsed = parseFloat(match[1].replace(',', '.'));
            if (isFinite(parsed) && parsed > 0) spreadPct = parsed;
          }
          const totalAnnual = (1 + IPCA_BASE_ANNUAL) * (1 + spreadPct / 100) - 1;
          const monthly = (Math.pow(1 + totalAnnual, 1 / 12) - 1) * 100;
          return Math.round(monthly * 100) / 100;
        }

        if (indexador === 'Prefixado') {
          // Extrai taxa anual prefixada (ex: "13,5%", "21% a.a.", "30.78%")
          const match = clean.match(/(\d+(?:[.,]\d+)?)/);
          let annualRate = 12.0;
          if (match) {
            const parsed = parseFloat(match[1].replace(',', '.'));
            if (isFinite(parsed) && parsed > 0) annualRate = parsed;
          }
          const monthly = (Math.pow(1 + annualRate / 100, 1 / 12) - 1) * 100;
          return Math.round(monthly * 100) / 100;
        }

        if (indexador === 'Pós-fixado (Selic)') {
          const match = clean.match(/(\d+(?:[.,]\d+)?)/);
          let pct = 100;
          if (match) {
            const parsed = parseFloat(match[1].replace(',', '.'));
            if (isFinite(parsed) && parsed > 0) pct = parsed;
          }
          const totalAnnual = (pct / 100) * SELIC_BASE_ANNUAL;
          const monthly = (Math.pow(1 + totalAnnual, 1 / 12) - 1) * 100;
          return Math.round(monthly * 100) / 100;
        }

        if (indexador === 'Ações') {
          const match = clean.match(/(\d+(?:[.,]\d+)?)/);
          if (match) {
            const parsed = parseFloat(match[1].replace(',', '.'));
            if (isFinite(parsed) && parsed > 0) {
              const monthly = parsed > 15 ? (Math.pow(1 + parsed / 100, 1 / 12) - 1) * 100 : parsed;
              return Math.round(monthly * 100) / 100;
            }
          }
          return IBOV_BASE_MONTHLY;
        }

        if (indexador === 'FIIs') {
          const match = clean.match(/(\d+(?:[.,]\d+)?)/);
          if (match) {
            const parsed = parseFloat(match[1].replace(',', '.'));
            if (isFinite(parsed) && parsed > 0) {
              const monthly = parsed > 10 ? (Math.pow(1 + parsed / 100, 1 / 12) - 1) * 100 : parsed;
              return Math.round(monthly * 100) / 100;
            }
          }
          return FII_BASE_MONTHLY;
        }

        if (indexador === 'Multimercado') return MULTI_BASE_MONTHLY;
        if (indexador === 'Dólar') return DOLAR_BASE_MONTHLY;

        return CDI_BASE_MONTHLY;
      }

      function getTaxaPlaceholder(indexador: string): string {
        switch (indexador) {
          case 'Pós-fixado (CDI)': return 'ex: 120% CDI';
          case 'IPCA+': return 'ex: IPCA + 6,5%';
          case 'Prefixado': return 'ex: 13,5% a.a.';
          case 'Pós-fixado (Selic)': return 'ex: 100% Selic';
          case 'Ações': return 'ex: Ibovespa';
          case 'FIIs': return 'ex: IFIX ou 10%';
          case 'Dólar': return 'ex: Dólar';
          default: return 'Taxa / Parâmetro';
        }
      }

      function parseImportText(rawText: any){
        const lines = String(rawText || '').split(/\r?\n/);
        const rows = [];
        for (const raw of lines){
          const line = raw.trim();
          if (!line) continue;

          // 1. Detecta Indexador e Taxa na linha digitada
          let indexador = 'Pós-fixado (CDI)';
          let taxa = '';
          const lower = line.toLowerCase();

          if (lower.includes('ipca') || lower.includes('infla') || lower.includes('ntn-b')) {
            indexador = 'IPCA+';
            const ipcaMatch = line.match(/ipca\s*\+?\s*(\d+(?:[.,]\d+)?)\s*%?/i);
            if (ipcaMatch) taxa = `IPCA + ${ipcaMatch[1]}%`;
          } else if (lower.includes('pre') || lower.includes('pré') || lower.includes('prefix')) {
            indexador = 'Prefixado';
            const preMatch = line.match(/(?:pr[eé]|prefixado)\s*(\d+(?:[.,]\d+)?)\s*%?/i);
            if (preMatch) taxa = `Pré ${preMatch[1]}% a.a.`;
          } else if (lower.includes('selic')) {
            indexador = 'Pós-fixado (Selic)';
            taxa = '100% Selic';
          } else if (lower.includes('fii') || lower.includes('imobili')) {
            indexador = 'FIIs';
          } else if (lower.includes('ação') || lower.includes('acoes') || lower.includes('ações') || lower.includes('ibov')) {
            indexador = 'Ações';
          } else if (lower.includes('multimercado') || lower.includes('fim')) {
            indexador = 'Multimercado';
          } else if (lower.includes('dolar') || lower.includes('dólar') || lower.includes('global')) {
            indexador = 'Dólar';
          } else {
            indexador = 'Pós-fixado (CDI)';
            const cdiMatch = line.match(/(\d+(?:[.,]\d+)?)\s*%\s*(?:do\s*)?cdi/i);
            if (cdiMatch) {
              taxa = `${cdiMatch[1]}% do CDI`;
            } else if (lower.includes('cdi')) {
              taxa = '100% CDI';
            }
          }

          // 2. Extrai Valor Monetário (ex: "20 mil", "10k", "R$ 15.000", "20.000")
          let amount: number | null = null;
          const milMatch = line.match(/(\d+(?:[.,]\d+)?)\s*(?:mil|k)\b/i);
          const moneyMatch = line.match(/R\$\s*([\d.,]+)/i);
          const rawNumMatch = line.match(/(?:^|\s)(\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d{4,}(?:[.,]\d+)?)(?:\s|$)/);

          if (milMatch) {
            const num = parseFloat(milMatch[1].replace(',', '.'));
            if (isFinite(num) && num > 0) amount = num * 1000;
          } else if (moneyMatch) {
            amount = parseFlexNumber(moneyMatch[1]);
          } else if (rawNumMatch) {
            amount = parseFlexNumber(rawNumMatch[1]);
          }

          // 3. Extrai Peso (%) se for uma divisão percentual pura da carteira (ex: "25%")
          let weight: number | null = null;
          const pctMatch = line.match(/(?:^|\s)(\d{1,3}(?:[.,]\d+)?)\s*%(?!\s*(?:do\s*)?cdi)/i);
          if (pctMatch && !milMatch && !moneyMatch) {
            weight = parseFlexNumber(pctMatch[1] + '%');
          }

          // 4. Extrai Nome Limpo do Ativo
          let name = line
            .replace(/R\$\s*[\d.,]+/gi, '')
            .replace(/\b\d+(?:[.,]\d+)?\s*(?:mil|k)\b/gi, '')
            .replace(/\b\d+(?:[.,]\d+)?\s*%\s*(?:do\s*)?cdi\b/gi, '')
            .replace(/ipca\s*\+?\s*\d+(?:[.,]\d+)?\s*%?/gi, '')
            .replace(/(?:pr[eé]|prefixado)\s*\d+(?:[.,]\d+)?\s*%?/gi, '')
            .replace(/[-:–—|;,•\s]+$/g, '')
            .replace(/^[-:–—|;,•\s]+/g, '')
            .replace(/\s+/g, ' ')
            .trim();

          if (!name || name.length < 2) name = line;

          // 5. Calcula a Rentabilidade Estimada automaticamente
          const yieldPct = calculateYieldFromIndexadorAndTaxa(indexador, taxa || line);

          rows.push({
            rawName: name,
            indexador,
            taxa: taxa || (indexador === 'Pós-fixado (CDI)' ? '100% CDI' : indexador),
            weight: weight !== null ? weight : 0,
            amount,
            customReturnPct: yieldPct
          });
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
          let customReturnPct = (typeof r.customReturnPct === 'number' && isFinite(r.customReturnPct))
            ? r.customReturnPct
            : (typeof r.yield === 'number' && isFinite(r.yield))
            ? r.yield
            : 0;

          const idx = r.indexador || 'Pós-fixado (CDI)';
          let taxa = r.taxa || '';

          // Proteção inteligente caso tenha vindo 120 (como 120% do CDI) ou taxa anual no lugar de taxa mensal
          if (idx === 'Pós-fixado (CDI)' || idx === 'Pós-fixado (Selic)') {
            if (customReturnPct >= 20) {
              taxa = taxa || (customReturnPct + '% do CDI');
              customReturnPct = calculateYieldFromIndexadorAndTaxa(idx, taxa);
            }
          } else if (idx === 'Prefixado') {
            if (customReturnPct >= 4.0) {
              taxa = taxa || (`Pré ${customReturnPct}% a.a.`);
              customReturnPct = calculateYieldFromIndexadorAndTaxa(idx, taxa);
            }
          } else if (idx === 'IPCA+') {
            if (customReturnPct >= 2.5) {
              taxa = taxa || (`IPCA + ${customReturnPct}%`);
              customReturnPct = calculateYieldFromIndexadorAndTaxa(idx, taxa);
            }
          }

          return {
            rawName: r.rawName,
            weight: r.weight,
            amount: r.amount,
            customReturnPct,
            indexador: idx,
            taxa: taxa,
            matchedFund: (match && match.score >= 0.75) ? match.name : null,
            matchScore: match ? match.score : 0
          };
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

      function registerCustomFund(rawName: any, monthlyReturnPct: any, indexador?: string, monthlyHistory?: any[]){
        let cleanName = String(rawName || '')
          .replace(/\s*\(personalizado\)+/gi, '')
          .replace(/[-:–—|;,•\s]+$/g, '')
          .replace(/^[-:–—|;,•\s]+/g, '')
          .replace(/\s+/g, ' ')
          .trim();
        
        let key = cleanName || ('Ativo ' + customFundCounter);
        const frac = (monthlyReturnPct || 0) / 100;
        
        let values: number[] = [];
        if (indexador === 'IPCA+') {
          // Modelagem atrelada ao IPCA histórico + spread real equivalente
          const meanIpca = DATA.ipca.reduce((a: number, b: number) => a + b, 0) / N;
          const realSpread = Math.max(0, frac - meanIpca);
          values = DATA.ipca.map((ipcaM: number) => ipcaM + realSpread);
        } else if (indexador === 'Pós-fixado (CDI)' || indexador === 'Pós-fixado (Selic)') {
          // Modelagem Pós-fixada: segue a curva do CDI proporcional à taxa informada (ex: 120% do CDI -> fator 1.20)
          const annualRet = Math.pow(1 + frac, 12) - 1;
          const CDI_BASE_ANNUAL = 0.1390;
          const cdiFactor = frac > 0 ? (annualRet / CDI_BASE_ANNUAL) : 1.0;
          values = DATA.cdi.map((cdiM: number) => cdiM * cdiFactor);
        } else if (indexador === 'Ações') {
          // Modelagem de Ações: segue a oscilação do Ibovespa
          values = DATA.ibov.map((ibovM: number) => ibovM);
        } else {
          // Prefixado ou taxa contratada constante
          values = new Array(N).fill(frac);
        }

        const fund = { name: key, gestora: 'Informado por você', classe: indexador || 'Prefixado', iq_geral: '?', minimo: null, values, isCustom: true };
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

      const userScope = session?.user?.email ? encodeURIComponent(session.user.email) : 'guest';
      const STORAGE_KEY = `simuladorCarteirasState_${userScope}_v2`;

      function saveState(){
        try{
          const customFunds = Object.values(FUND_BY_NAME)
            .filter((f:any) => f.isCustom)
            .map((f:any) => ({ name: f.name, values: f.values }));
          const payload = { portfolios, nextId, nextColorIdx, customFundCounter, customFunds };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

          // Sincroniza diretamente no banco de dados central (PostgreSQL via Prisma / Profile)
          if (session?.user?.email) {
            fetch('/api/user/profile', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ carteira2Data: payload })
            }).catch(() => {});
          }
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
          let cleanName = String(cf.name || '')
            .replace(/\s*\(personalizado\)+/gi, '')
            .replace(/[-:–—|;,•\s]+$/g, '')
            .replace(/^[-:–—|;,•\s]+/g, '')
            .replace(/\s+/g, ' ')
            .trim();
          
          let values = cf.values;
          const lower = cleanName.toLowerCase();
          if (lower.includes('nubank') || lower.includes('mercado pago') || lower.includes('cdi')) {
            values = DATA.cdi.map((cdiM: number) => cdiM * 1.20);
          }

          const fundObj = { name: cleanName || cf.name, gestora: 'Informado por você', classe: 'Personalizado', iq_geral: '?', minimo: null, values, isCustom: true };
          FUND_BY_NAME[cf.name] = fundObj;
          if (cleanName) FUND_BY_NAME[cleanName] = fundObj;
        });
        portfolios = savedState.portfolios.map((p: any) => {
          if (p.holdings) {
            p.holdings.forEach((h: any) => {
              const oldName = h.name;
              const cleanName = h.name
                .replace(/\s*\(personalizado\)+/gi, '')
                .replace(/[-:–—|;,•\s]+$/g, '')
                .replace(/^[-:–—|;,•\s]+/g, '')
                .replace(/\s+/g, ' ')
                .trim();
              if (cleanName && cleanName !== oldName) {
                if (FUND_BY_NAME[oldName]) {
                  FUND_BY_NAME[cleanName] = FUND_BY_NAME[oldName];
                  FUND_BY_NAME[cleanName].name = cleanName;
                }
                h.name = cleanName;
              }
            });
          }
          return p;
        });
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
      const activeSeries = new Set<string>(['CDI', 'p_consolidated']);
      portfolios.forEach(p => {
        if (p.holdings && p.holdings.length > 0) activeSeries.add('p_' + p.id);
      });

      function resetAllPortfolios(){
        if (!confirm('Isso vai apagar todas as carteiras montadas aqui e recomeçar do zero. Tem certeza?')) return;
        portfolios = defaultPortfolios();
        targetPortfolioId = portfolios[0].id;
        activeSeries.clear();
        activeSeries.add('CDI');
        activeSeries.add('p_consolidated');
        portfolios.forEach(p => activeSeries.add('p_' + p.id));
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
        activeSeries.add('p_' + p.id);
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
        renderChartControls();
        renderChart();
        renderBeforeAfterSummary();
        saveState();

        // Sincroniza dinamicamente o retorno da carteira consolidada ou ativa no card de topo
        const consolidated = computeConsolidatedPortfolioMetrics(portfolios);
        if (consolidated) {
          const annPct = parseFloat((consolidated.annRet * 100).toFixed(1));
          if (!isNaN(annPct) && annPct > 0) {
            setData((prev: any) => prev ? {
              ...prev,
              expectedReturn: annPct,
              returnSource: `Portfólio Completo (${consolidated.portfoliosCount} carteiras)`
            } : prev);
          }
        } else {
          const activeP = portfolios.find((p: any) => p.id === targetPortfolioId && p.holdings && p.holdings.length > 0) || portfolios.find((p: any) => p.holdings && p.holdings.length > 0);
          if (activeP) {
            const m = computeMetrics(activeP);
            const annPct = parseFloat((m.annRet * 100).toFixed(1));
            if (!isNaN(annPct) && annPct > 0) {
              setData((prev: any) => prev ? {
                ...prev,
                expectedReturn: annPct,
                returnSource: activeP.name ? `Carteira: ${activeP.name}` : "Carteira informada"
              } : prev);
            }
          }
        }
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
          box.innerHTML = '<div class="ba-title">Antes: ' + antes.name + '  →  Depois: ' + depois.name + '</div>' +
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
        const editBtn = document.createElement('button');
        editBtn.className = 'iconbtn'; editBtn.title = 'Editar carteira e ativos'; editBtn.textContent = '✎';
        editBtn.onclick = () => openEditPortfolioModal(p);
        const dupBtn = document.createElement('button');
        dupBtn.className = 'iconbtn'; dupBtn.title = 'Duplicar'; dupBtn.textContent = '⧉';
        dupBtn.onclick = () => {
          const copy = makePortfolio(p.name + ' (cópia)', p.holdings.map((h:any) => ({...h})), p.totalValue);
          portfolios.push(copy); renderAll();
        };
        const delBtn = document.createElement('button');
        delBtn.className = 'iconbtn'; delBtn.title = 'Remover'; delBtn.textContent = '✕';
        delBtn.onclick = () => { portfolios = portfolios.filter(x => x.id !== p.id); renderAll(); };
        actions.appendChild(editBtn); actions.appendChild(dupBtn); actions.appendChild(delBtn);
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

      function computeConsolidatedPortfolioMetrics(portfoliosList: any[]) {
        const clientPortfolios = (portfoliosList || []).filter(p => p.holdings && p.holdings.length > 0 && p.tag !== 'Depois');
        if (clientPortfolios.length < 2) return null;

        const totalValue = clientPortfolios.reduce((sum, p) => sum + (p.totalValue || DEFAULT_PORTFOLIO_VALUE), 0);
        const monthly = new Array(N).fill(0);

        clientPortfolios.forEach(p => {
          const pVal = p.totalValue || DEFAULT_PORTFOLIO_VALUE;
          const pWeight = totalValue > 0 ? pVal / totalValue : (1 / clientPortfolios.length);
          const m = computeMetrics(p);
          for (let t = 0; t < N; t++) {
            monthly[t] += pWeight * (m.monthly[t] || 0);
          }
        });

        const wealth = wealthCurve(monthly);
        const finalW = wealth[wealth.length - 1];
        const cumRet = finalW - 1;
        const annRet = Math.pow(finalW, 12 / N) - 1;
        const mean = monthly.reduce((a, b) => a + b, 0) / N;
        const variance = monthly.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / Math.max(1, N - 1);
        const vol = Math.sqrt(variance) * Math.sqrt(12);
        let peak = wealth[0], maxDD = 0;
        for (const w of wealth) {
          if (w > peak) peak = w;
          const dd = w / peak - 1;
          if (dd < maxDD) maxDD = dd;
        }
        const multCDI = (CDI_FINAL - 1) === 0 ? 1 : (finalW - 1) / (CDI_FINAL - 1);

        return {
          id: 'consolidated',
          name: 'Portfólio Completo (Consolidado)',
          color: '#15803d',
          totalValue,
          portfoliosCount: clientPortfolios.length,
          monthly,
          wealth,
          cumRet,
          annRet,
          vol,
          maxDD,
          multCDI
        };
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

        const consolidated = computeConsolidatedPortfolioMetrics(portfolios);
        const listToRank: any[] = withData.map(p => ({ p, m: computeMetrics(p), isConsolidated: false }));
        if (consolidated) {
          listToRank.push({
            p: { name: 'Portfólio Completo (Consolidado)', color: '#15803d', totalValue: consolidated.totalValue },
            m: consolidated,
            isConsolidated: true
          });
        }

        const ranked = listToRank.sort((a,b) => b.m.cumRet - a.m.cumRet);
        const medals = ['1º','2º','3º'];
        ranked.forEach((r, idx) => {
          const item = document.createElement('div');
          item.className = 'lb-item' + (r.isConsolidated ? ' consolidated-rank' : '');
          if (r.isConsolidated) {
            item.style.cssText = 'background:linear-gradient(135deg, #f0fdf4 0%, #e6f7ec 100%); border:1px solid #bbf7d0; border-radius:10px; padding:10px 12px; margin-bottom:6px;';
          }
          const medal = document.createElement('span'); medal.className = 'lb-medal'; medal.textContent = medals[idx] || ('#' + (idx+1));
          const dot = document.createElement('span'); dot.className = 'lb-dot'; dot.style.background = r.p.color;
          const nameBox = document.createElement('div');
          const nm = document.createElement('div'); nm.className = 'lb-name';
          nm.innerHTML = r.isConsolidated ? '<b>★ ' + r.p.name + '</b>' : r.p.name;
          const sub = document.createElement('div'); sub.className = 'lb-sub'; sub.textContent = fmtX(r.m.multCDI) + ' do CDI' + (r.p.totalValue ? ' · R$ ' + Math.round(r.p.totalValue).toLocaleString('pt-BR') : '');
          nameBox.appendChild(nm); nameBox.appendChild(sub);
          const val = document.createElement('div'); val.className = 'lb-val ' + (r.m.cumRet>=0?'pos':'neg'); val.textContent = pct(r.m.cumRet);
          item.appendChild(medal); item.appendChild(dot); item.appendChild(nameBox); item.appendChild(val);
          box.appendChild(item);
        });
      }

      function renderChartControls() {
        const container = document.getElementById('chartBenchmarks');
        if (!container) return;
        container.innerHTML = '';

        const consolidated = computeConsolidatedPortfolioMetrics(portfolios);
        const withData = portfolios.filter((p: any) => p.holdings && p.holdings.length > 0);

        // 1. Chip Especial do Portfólio Completo Consolidado (quando houver 2 ou mais carteiras)
        if (consolidated) {
          const isConsolidatedActive = activeSeries.has('p_consolidated');
          const chip = document.createElement('button');
          chip.type = 'button';
          chip.className = `bench-chip ${isConsolidatedActive ? 'active' : 'inactive'}`;
          chip.style.setProperty('--c', '#15803d');
          const valStr = ` · R$ ${Math.round(consolidated.totalValue).toLocaleString('pt-BR')}`;
          chip.innerHTML = `<span class="dot"></span><b>Portfólio Completo</b>${valStr}`;
          chip.onclick = (e) => {
            e.preventDefault();
            if (activeSeries.has('p_consolidated')) activeSeries.delete('p_consolidated');
            else activeSeries.add('p_consolidated');
            renderChartControls();
            renderChart();
          };
          container.appendChild(chip);
        }

        // 2. Chips das Carteiras Individuais Alimentadas
        withData.forEach((p: any) => {
          const seriesKey = 'p_' + p.id;
          const isPActive = activeSeries.has(seriesKey);
          const chip = document.createElement('button');
          chip.type = 'button';
          chip.className = `bench-chip ${isPActive ? 'active' : 'inactive'}`;
          chip.style.setProperty('--c', p.color || '#3b82f6');
          const valText = p.totalValue ? ` · R$ ${Math.round(p.totalValue).toLocaleString('pt-BR')}` : '';
          chip.innerHTML = `<span class="dot"></span>${p.name}${valText}`;
          chip.onclick = (e) => {
            e.preventDefault();
            if (activeSeries.has(seriesKey)) activeSeries.delete(seriesKey);
            else activeSeries.add(seriesKey);
            renderChartControls();
            renderChart();
          };
          container.appendChild(chip);
        });

        // 3. Chips dos Indicadores de Mercado (CDI, IPCA, IBOV)
        const benchList = [
          { id: 'CDI', label: 'CDI', color: '#64748b' },
          { id: 'IPCA', label: 'IPCA', color: '#3b82f6' },
          { id: 'IBOV', label: 'IBOV', color: '#ef4444' }
        ];

        benchList.forEach(b => {
          const isBActive = activeSeries.has(b.id);
          const chip = document.createElement('button');
          chip.type = 'button';
          chip.className = `bench-chip ${isBActive ? 'active' : 'inactive'}`;
          chip.style.setProperty('--c', b.color);
          chip.innerHTML = `<span class="dot"></span>${b.label}`;
          chip.onclick = (e) => {
            e.preventDefault();
            if (activeSeries.has(b.id)) activeSeries.delete(b.id);
            else activeSeries.add(b.id);
            renderChartControls();
            renderChart();
          };
          container.appendChild(chip);
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

        // 1. Portfólio Completo Consolidado (Média Ponderada)
        const consolidated = computeConsolidatedPortfolioMetrics(portfolios);
        if (consolidated && activeSeries.has('p_consolidated')) {
          const slicedWealth = consolidated.wealth.slice(startIdx);
          const baseW = slicedWealth[0] || 1;
          datasets.push({
            label: 'Portfólio Completo (Consolidado)',
            data: slicedWealth.map((w: number) => ((w / baseW) - 1) * 100),
            borderColor: '#15803d',
            backgroundColor: '#15803d',
            borderWidth: 3.5,
            pointRadius: 0,
            tension: 0.15,
          });
        }

        // 2. Carteiras Individuais Alimentadas
        portfolios.filter((p: any) => p.holdings && p.holdings.length > 0).forEach((p: any) => {
          const seriesKey = 'p_' + p.id;
          if (activeSeries.has(seriesKey)) {
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
          }
        });

        // 3. Benchmarks de Mercado
        const benchConfigs: any = {
          'CDI': { wealth: CDI_WEALTH, color: '#9aa0b8', dash: [6,4] },
          'IPCA': { wealth: IPCA_WEALTH, color: '#3b82f6', dash: [4,4] },
          'IBOV': { wealth: IBOV_WEALTH, color: '#ef4444', dash: [2,2] }
        };

        ['CDI', 'IPCA', 'IBOV'].forEach(b => {
          if (activeSeries.has(b)) {
            const cfg = benchConfigs[b];
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
          }
        });

        const canvas = document.getElementById('chart') as HTMLCanvasElement;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (chart){ chart.data.labels = labels; chart.data.datasets = datasets; chart.update(); return; }
        chart = new Chart(ctx as any, {
          type: 'line',
          data: { labels, datasets },
          options: {
            responsive: true, maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
              legend: { 
                display: false
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

      const INDEXADOR_OPTIONS = [
        { id: 'IPCA+', label: 'IPCA+ (Inflação)' },
        { id: 'Prefixado', label: 'Prefixado' },
        { id: 'Pós-fixado (CDI)', label: 'Pós-fixado (CDI)' },
        { id: 'Pós-fixado (Selic)', label: 'Pós-fixado (Selic)' },
        { id: 'Ações', label: 'Ações' },
        { id: 'FIIs', label: 'Fundos Imobiliários (FIIs)' },
        { id: 'Multimercado', label: 'Multimercado' },
        { id: 'Dólar', label: 'Internacional / Dólar' },
      ];

      let importParsedRows: any[] = [];
      let currentImportMetadata: any = {};
      let editingPortfolioId: any = null;

      function openEditPortfolioModal(p: any){
        editingPortfolioId = p.id;
        const rows = (p.holdings || []).map((h: any) => {
          const f = FUND_BY_NAME[h.name];
          const cleanName = h.name.replace(/\s*\(personalizado\)+/gi, '').trim();
          let monthlyReturn = 0;
          if (f?.values && f.values.length > 0) {
            monthlyReturn = Math.round((f.values.reduce((a: number, b: number) => a + b, 0) / f.values.length) * 10000) / 100;
          }
          const amt = p.totalValue ? Math.round((p.totalValue * (h.weight || 0)) / 100) : null;
          return {
            rawName: cleanName,
            weight: h.weight || 0,
            amount: amt,
            indexador: (f?.classe && f.classe !== 'Personalizado') ? f.classe : 'Prefixado',
            taxa: '',
            customReturnPct: monthlyReturn,
            fundoSelecionado: (f && !f.isCustom) ? f.name : CUSTOM_SENTINEL
          };
        });

        openImportReviewModal(rows, p.name, {
          portfolioReturn12m: p.portfolioReturn12m,
          monthlyHistory: p.monthlyHistory || []
        });

        const modalTitle = document.querySelector('#importReviewModal h3');
        if (modalTitle) modalTitle.textContent = 'Editar Carteira e Ativos';

        const confirmBtn = document.getElementById('importConfirmBtn');
        if (confirmBtn) confirmBtn.textContent = 'Salvar Alterações';
      }

      function openImportReviewModal(rows: any, defaultName: any, metadata: any = {}){
        currentImportMetadata = metadata || {};
        const resolved = resolveImportedRows(rows);
        const finalized = finalizeImportedWeights(resolved);
        importParsedRows = finalized.map((r:any) => ({
          rawName: r.rawName,
          weight: typeof r.weight === 'number' && isFinite(r.weight) ? r.weight : 0,
          amount: (r.amount !== null && r.amount !== undefined && !isNaN(r.amount) && r.amount > 0) ? r.amount : null,
          indexador: r.indexador || 'Pós-fixado (CDI)',
          taxa: r.taxa || '',
          fundoSelecionado: (r.matchedFund && r.matchScore >= 0.75) ? r.matchedFund : CUSTOM_SENTINEL,
          customReturnPct: typeof r.customReturnPct === 'number' ? r.customReturnPct : 0,
        }));

        // Se todos os itens tiverem valor mas pesos zerados, calcula os pesos iniciais
        const totalAmt = importParsedRows.reduce((sum, r) => sum + (r.amount || 0), 0);
        const totalW = importParsedRows.reduce((sum, r) => sum + (r.weight || 0), 0);
        if (totalAmt > 0 && (totalW === 0 || Math.abs(totalW - 100) > 2)) {
          importParsedRows.forEach(r => {
            if (r.amount) {
              r.weight = Math.round((r.amount / totalAmt) * 1000) / 10;
            }
          });
        }

        const nameInput = document.getElementById('importPortfolioName') as HTMLInputElement;
        if (nameInput) nameInput.value = defaultName || 'Carteira atual do cliente';
        
        const modalTitle = document.querySelector('#importReviewModal h3');
        if (modalTitle && !editingPortfolioId) modalTitle.textContent = 'Revisar e Importar Carteira';

        const confirmBtn = document.getElementById('importConfirmBtn');
        if (confirmBtn && !editingPortfolioId) confirmBtn.textContent = 'Confirmar e Salvar Carteira';

        // Limpa a seleção do arquivo e o texto digitado após carregar com sucesso no modal de revisão
        clearSelectedFile();
        const textInput = document.getElementById('importTextInput') as HTMLTextAreaElement | null;
        if (textInput) textInput.value = '';

        renderImportReviewRows();
        const modal = document.getElementById('importReviewModal');
        if (modal) modal.style.display = 'flex';
      }

      function closeImportReviewModal(){
        editingPortfolioId = null;
        const modal = document.getElementById('importReviewModal');
        if (modal) modal.style.display = 'none';
      }

      function renderImportReviewRows(){
        const box = document.getElementById('importReviewRows');
        if (!box) return;
        box.innerHTML = '';

        // Cabeçalho das Colunas
        const headerDiv = document.createElement('div');
        headerDiv.className = 'import-review-header-row';
        headerDiv.innerHTML = `
          <span>Ativo / Título</span>
          <span>Indexador</span>
          <span>Taxa / % Indexador</span>
          <span>Valor (R$)</span>
          <span>Peso (%)</span>
          <span>Fundo / Categoria</span>
          <span>Rent. (% a.m.)</span>
          <span></span>
        `;
        box.appendChild(headerDiv);

        importParsedRows.forEach((row, idx) => {
          const rowDiv = document.createElement('div');
          rowDiv.className = 'import-review-row';

          // Coluna 1: Nome do Ativo
          const nameInput = document.createElement('input');
          nameInput.type = 'text';
          nameInput.placeholder = 'Nome do ativo ou fundo';
          nameInput.value = row.rawName;
          nameInput.oninput = (e: any) => { row.rawName = e.target.value; };

          // Coluna 2: Indexador
          const indexadorSelect = document.createElement('select');
          indexadorSelect.title = 'Indexador ou classe de remuneração deste ativo';
          INDEXADOR_OPTIONS.forEach(opt => {
            const o = document.createElement('option');
            o.value = opt.id;
            o.textContent = opt.label;
            indexadorSelect.appendChild(o);
          });
          indexadorSelect.value = row.indexador || 'Pós-fixado (CDI)';

          // Coluna 3: Taxa / Parâmetro do Indexador (ex: "120% do CDI", "IPCA + 6,5%", "13,5% a.a.")
          const taxaInput = document.createElement('input');
          taxaInput.type = 'text';
          taxaInput.placeholder = getTaxaPlaceholder(row.indexador || 'Pós-fixado (CDI)');
          taxaInput.value = row.taxa || '';
          taxaInput.title = 'Taxa ou parâmetro do indexador (ex: 120% CDI, IPCA + 6,5%, 13,5% a.a.)';

          // Coluna 4: Valor em Reais (R$)
          const amountInput = document.createElement('input');
          amountInput.type = 'text';
          amountInput.placeholder = 'R$ 0,00';
          amountInput.value = (row.amount !== null && row.amount !== undefined) ? 'R$ ' + Math.round(row.amount).toLocaleString('pt-BR') : '';
          amountInput.onfocus = () => {
            if (row.amount) amountInput.value = String(row.amount);
          };
          amountInput.onblur = () => {
            if (row.amount) amountInput.value = 'R$ ' + Math.round(row.amount).toLocaleString('pt-BR');
          };
          amountInput.oninput = (e: any) => {
            const cleanStr = e.target.value.replace(/[^\d.,]/g, '').replace(',', '.');
            const parsed = parseFloat(cleanStr);
            row.amount = isFinite(parsed) && parsed > 0 ? parsed : null;
            
            // Recalcula pesos percentuais a partir dos valores monetários
            const totalAmt = importParsedRows.reduce((a, r) => a + (r.amount || 0), 0);
            if (totalAmt > 0) {
              importParsedRows.forEach((r, i) => {
                if (r.amount) {
                  r.weight = Math.round((r.amount / totalAmt) * 1000) / 10;
                  const rowEl = box.children[i + 1]; // +1 por causa do header
                  if (rowEl) {
                    const wInput = rowEl.querySelectorAll('input')[3] as HTMLInputElement;
                    if (wInput) wInput.value = String(r.weight);
                  }
                }
              });
            }
            updateImportSummary();
          };

          // Coluna 5: Peso Percentual (%)
          const weightInput = document.createElement('input');
          weightInput.type = 'number';
          weightInput.step = '0.1';
          weightInput.placeholder = '0.0';
          weightInput.value = row.weight !== undefined && row.weight !== null ? row.weight : 0;
          weightInput.oninput = (e: any) => {
            row.weight = parseFloat(e.target.value) || 0;
            updateImportSummary();
          };

          // Coluna 6: Fundo selecionado
          const select = document.createElement('select');
          const customOpt = document.createElement('option');
          customOpt.value = CUSTOM_SENTINEL;
          customOpt.textContent = 'Não encontramos esse fundo — usar rentabilidade informada';
          select.appendChild(customOpt);
          DATA.funds.forEach(f => {
            const opt = document.createElement('option');
            opt.value = f.name;
            opt.textContent = f.name;
            select.appendChild(opt);
          });
          select.value = row.fundoSelecionado;
          select.onchange = (e: any) => {
            row.fundoSelecionado = e.target.value;
          };

          // Coluna 7: Rentabilidade estimada (% a.m.)
          const returnInput = document.createElement('input');
          returnInput.type = 'number';
          returnInput.step = '0.01';
          returnInput.placeholder = '% a.m.';
          returnInput.title = 'Rentabilidade mensal em % a.m. (calculada automaticamente a partir da taxa ou informada manualmente).';
          
          if (!row.customReturnPct || (row.customReturnPct >= 20 && (row.indexador === 'Pós-fixado (CDI)' || row.indexador === 'Pós-fixado (Selic)'))) {
            row.customReturnPct = calculateYieldFromIndexadorAndTaxa(row.indexador, row.taxa);
          }
          returnInput.value = String(row.customReturnPct);
          returnInput.oninput = (e: any) => {
            row.customReturnPct = parseFloat(e.target.value) || 0;
            updateImportSummary();
          };
          returnInput.onchange = (e: any) => {
            let val = parseFloat(e.target.value) || 0;
            if (row.indexador === 'Pós-fixado (CDI)' || row.indexador === 'Pós-fixado (Selic)') {
              if (val >= 20) {
                row.taxa = `${val}% do CDI`;
                taxaInput.value = row.taxa;
                val = calculateYieldFromIndexadorAndTaxa(row.indexador, row.taxa);
                returnInput.value = String(val);
              }
            } else if (row.indexador === 'Prefixado') {
              if (val >= 4.0) {
                row.taxa = `Pré ${val}% a.a.`;
                taxaInput.value = row.taxa;
                val = calculateYieldFromIndexadorAndTaxa(row.indexador, row.taxa);
                returnInput.value = String(val);
              }
            }
            row.customReturnPct = val;
            updateImportSummary();
          };

          // Conexões de recálculo dinâmico em tempo real:
          indexadorSelect.onchange = (e: any) => {
            row.indexador = e.target.value;
            taxaInput.placeholder = getTaxaPlaceholder(row.indexador);
            row.customReturnPct = calculateYieldFromIndexadorAndTaxa(row.indexador, row.taxa);
            returnInput.value = String(row.customReturnPct);
            updateImportSummary();
          };

          taxaInput.oninput = (e: any) => {
            row.taxa = e.target.value;
            row.customReturnPct = calculateYieldFromIndexadorAndTaxa(row.indexador, row.taxa);
            returnInput.value = String(row.customReturnPct);
            updateImportSummary();
          };

          // Coluna 8: Botão Remover
          const rmBtn = document.createElement('button');
          rmBtn.className = 'rm';
          rmBtn.textContent = '✕';
          rmBtn.onclick = () => {
            importParsedRows.splice(idx, 1);
            renderImportReviewRows();
          };

          rowDiv.appendChild(nameInput);
          rowDiv.appendChild(indexadorSelect);
          rowDiv.appendChild(taxaInput);
          rowDiv.appendChild(amountInput);
          rowDiv.appendChild(weightInput);
          rowDiv.appendChild(select);
          rowDiv.appendChild(returnInput);
          rowDiv.appendChild(rmBtn);

          box.appendChild(rowDiv);
        });

        function updateImportSummary(){
          const totalEl = document.getElementById('importReviewTotal');
          if (totalEl){
            const curWeight = importParsedRows.reduce((a, r) => a + (r.weight || 0), 0);
            const curAmount = importParsedRows.reduce((a, r) => a + (r.amount || 0), 0);
            const color = Math.abs(curWeight - 100) <= 1 ? 'var(--good)' : 'var(--warn)';
            
            // Rentabilidade Ponderada da Carteira em 12 Meses (12M)
            const validWeightSum = curWeight > 0 ? curWeight : 100;
            const monthlyWeighted = importParsedRows.reduce((acc, r) => acc + ((r.weight || 0) / validWeightSum) * (r.customReturnPct || 0), 0);
            const annualWeighted = (Math.pow(1 + monthlyWeighted / 100, 12) - 1) * 100;
            const cdiPct = (annualWeighted / 13.90) * 100;

            // Agrupamento por Indexador
            const byIdx: Record<string, number> = {};
            importParsedRows.forEach(r => {
              const idx = r.indexador || 'Pós-fixado (CDI)';
              byIdx[idx] = (byIdx[idx] || 0) + (r.amount || (r.weight && curAmount ? (r.weight / 100) * curAmount : 0));
            });

            let html = `<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">`;
            html += `<div>Total alocado: <b style="color:${color}">${curWeight.toFixed(1)}%</b>`;
            if (curAmount > 0) {
              html += ` · Patrimônio Total: <b style="color:#1f674f">R$ ${Math.round(curAmount).toLocaleString('pt-BR')}</b>`;
            }
            if (Math.abs(curWeight - 100) > 1) {
              html += ' — confira antes de confirmar';
            }
            html += `</div></div>`;

            // Card Destacado de Rentabilidade Consolidada e Validação Cruzada
            const doc12m = currentImportMetadata?.portfolioReturn12m;

            html += `
              <div style="margin-top:10px; padding:14px 16px; background:linear-gradient(135deg, #f0fdf4 0%, #e6f7ec 100%); border:1.5px solid #86efac; border-radius:12px; display:flex; flex-direction:column; gap:10px;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px;">
                  <div>
                    <div style="display:flex; align-items:center; gap:6px;">
                      <span style="font-size:10.5px; font-weight:800; color:#15803d; text-transform:uppercase; letter-spacing:0.06em;">Rentabilidade Consolidada da Carteira (Base: 12 Meses)</span>
                      <span style="background:#15803d; color:#fff; font-size:9.5px; font-weight:800; padding:2px 7px; border-radius:12px;">Validado ✓</span>
                    </div>
                    <div style="font-size:18px; font-weight:800; color:#14532d; margin-top:3px;">
                      ${annualWeighted.toFixed(2)}% <span style="font-size:13px; font-weight:600; color:#166534;">ao ano</span>
                      <span style="font-size:13.5px; color:#15803d; font-weight:700; margin-left:8px;">(${monthlyWeighted.toFixed(2)}% ao mês · ~${cdiPct.toFixed(0)}% do CDI)</span>
                    </div>
                  </div>
                  <div style="font-size:11.5px; color:#166534; font-weight:600; background:#fff; padding:6px 10px; border-radius:8px; border:1px solid #bbf7d0;">
                    ${doc12m ? `Rentabilidade do relatório: <b>${doc12m.toFixed(2)}% a.a.</b> (12M)` : 'Média ponderada individual conferida'}
                  </div>
                </div>
            `;

            // Histórico Mês a Mês do Documento (se disponível)
            const mHist = currentImportMetadata?.monthlyHistory;
            if (Array.isArray(mHist) && mHist.length > 0) {
              const preview = mHist.slice(0, 8);
              html += `
                <div style="border-top:1px dashed #bbf7d0; margin-top:4px; padding-top:8px;">
                  <div style="font-size:11px; font-weight:700; color:#166534; margin-bottom:6px;">Histórico Real dos Últimos Meses (extraído do documento para a curva do gráfico):</div>
                  <div style="display:flex; gap:6px; flex-wrap:wrap;">
                    ${preview.map((m: any) => `
                      <span style="background:#fff; border:1px solid #bbf7d0; padding:2px 7px; border-radius:6px; font-size:11px; font-weight:600; color:#14532d;">
                        ${m.date}: <b style="color:${m.returnPct >= 0 ? '#15803d' : '#b91c1c'};">${m.returnPct >= 0 ? '+' : ''}${m.returnPct.toFixed(2)}%</b>
                      </span>
                    `).join('')}
                  </div>
                </div>
              `;
            }

            html += `</div>`;

            // Badges de Composição por Indexador
            const entries = Object.entries(byIdx).filter(([, v]) => v > 0);
            if (entries.length > 0) {
              html += `<div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:8px; align-items:center;">`;
              html += `<span style="font-size:11px; font-weight:700; color:var(--muted); text-transform:uppercase;">Composição por Indexador:</span>`;
              entries.forEach(([name, val]) => {
                const pct = curAmount > 0 ? ((val / curAmount) * 100).toFixed(1) : '0.0';
                html += `<span style="background:#fff; border:1px solid var(--border); padding:3px 8px; border-radius:6px; font-size:11.5px; font-weight:600; color:var(--text);">`;
                html += `<b>${name}</b>: R$ ${Math.round(val).toLocaleString('pt-BR')} (${pct}%)`;
                html += `</span>`;
              });
              html += `</div>`;
            }

            totalEl.innerHTML = html;
          }
        }

        updateImportSummary();
      }

      function confirmImportedPortfolio(){
        const nameInput = document.getElementById('importPortfolioName') as HTMLInputElement;
        const name = (nameInput && nameInput.value) || 'Carteira atual do cliente';
        const holdings = importParsedRows.map(row => {
          if (row.fundoSelecionado === CUSTOM_SENTINEL || !DATA.funds.some(f => f.name === row.fundoSelecionado)){
            const key = registerCustomFund(row.rawName, row.customReturnPct, row.indexador, currentImportMetadata?.monthlyHistory);
            return { name: key, weight: row.weight || 0 };
          }
          return { name: row.fundoSelecionado, weight: row.weight || 0 };
        }).filter(h => h.name);
        
        const amountsGiven = importParsedRows.filter(r => r.amount !== null && r.amount !== undefined && !isNaN(r.amount));
        const importedTotalValue = (amountsGiven.length > 0 && amountsGiven.length >= importParsedRows.length * 0.6)
          ? amountsGiven.reduce((a, r) => a + r.amount, 0)
          : undefined;

        if (editingPortfolioId) {
          const existing = portfolios.find(x => x.id === editingPortfolioId);
          if (existing) {
            existing.name = name;
            existing.holdings = holdings;
            if (importedTotalValue) existing.totalValue = importedTotalValue;
            existing.monthlyHistory = currentImportMetadata?.monthlyHistory || existing.monthlyHistory || [];
            existing.portfolioReturn12m = currentImportMetadata?.portfolioReturn12m || existing.portfolioReturn12m;
          }
          editingPortfolioId = null;
          closeImportReviewModal();
          renderAll();
          updateRecHint();
          return existing;
        }

        const p = makePortfolio(name, holdings, importedTotalValue);
        p.tag = 'Antes';
        p.monthlyHistory = currentImportMetadata?.monthlyHistory || [];
        p.portfolioReturn12m = currentImportMetadata?.portfolioReturn12m;
        
        if (portfolios.length > 0 && portfolios[0].holdings.length === 0 && (!portfolios[0].name || portfolios[0].name.startsWith('Carteira '))) {
          portfolios.splice(0, 1);
        }
        portfolios.push(p);
        targetPortfolioId = p.id;
        pendingBeforeId = p.id;
        activeSeries.add('p_' + p.id);
        activeSeries.add('p_consolidated');
        closeImportReviewModal();
        renderAll();
        updateRecHint();
        return p;
      }

      function showImportWarn(msg: any){
        const el = document.getElementById('importBuilderWarn');
        if (!el) return;
        if (!msg){ el.style.display = 'none'; el.textContent = ''; return; }
        el.textContent = msg;
        el.style.display = 'block';
      }

      function setImportBusy(isBusy: boolean, statusText?: string){
        const button = document.getElementById('importBtn') as HTMLButtonElement | null;
        if (!button) return;
        button.disabled = isBusy;
        button.textContent = isBusy ? (statusText || 'Lendo extrato…') : 'Importar e revisar';
      }

      function clearSelectedFile(){
        const input = document.getElementById('importFileInput') as HTMLInputElement | null;
        if (input) input.value = '';
        updateSelectedFile();
      }

      function updateSelectedFile(){
        const input = document.getElementById('importFileInput') as HTMLInputElement | null;
        const titleEl = document.getElementById('importDropzoneTitle');
        const fileName = document.getElementById('importFileName');
        const dropzone = document.getElementById('importDropzone');
        const removeBtn = document.getElementById('importRemoveFileBtn');
        const file = input?.files?.[0];

        if (file) {
          if (titleEl) titleEl.textContent = 'Arquivo selecionado:';
          if (fileName) fileName.textContent = file.name;
          dropzone?.classList.add('has-file');
          if (removeBtn) removeBtn.style.display = 'inline-flex';
        } else {
          if (titleEl) titleEl.textContent = 'Clique para escolher o arquivo';
          if (fileName) fileName.textContent = 'PDF de qualquer banco, Excel, CSV ou Foto · até 15 MB';
          dropzone?.classList.remove('has-file');
          if (removeBtn) removeBtn.style.display = 'none';
        }
        showImportWarn(null);
      }

      async function handleImportClick(){
        showImportWarn(null);
        const fileInput = document.getElementById('importFileInput') as HTMLInputElement;
        const textInput = document.getElementById('importTextInput') as HTMLTextAreaElement;
        const file = fileInput && fileInput.files && fileInput.files[0];
        const pasted = textInput ? textInput.value : '';

        if (!file && !(pasted && pasted.trim())) {
          showImportWarn('Selecione um arquivo (PDF, Excel, imagem) ou cole a lista de ativos antes de continuar.');
          return;
        }

        setImportBusy(true, 'IA lendo seu extrato bancário…');
        try {
          let rows: any[] = [];
          let defaultName = file ? file.name.replace(/\.[^.]+$/, '') : 'Carteira atual do cliente';

          // Extrai o texto digitalmente no navegador para enviar junto à IA
          let localExtractedText = '';
          if (file) {
            try {
              const fileContent = await readPortfolioFile(file);
              if (fileContent.kind === 'text') {
                localExtractedText = fileContent.text;
              } else if (fileContent.kind === 'table') {
                localExtractedText = fileContent.rows.map((r: any) => Array.isArray(r) ? r.join(' | ') : String(r)).join('\n');
              }
            } catch (err) {
              console.warn('Erro na extração prévia local:', err);
            }
          }

          // 1. Tenta extrair utilizando a IA Multimodal da ARVO (/api/extract)
          let aiSuccess = false;
          let importMetadata: any = {};
          try {
            const formData = new FormData();
            if (file) {
              formData.append('file', file);
            }
            if (localExtractedText) {
              formData.append('extractedText', localExtractedText);
            }
            if (pasted) {
              formData.append('text', pasted);
            }

            const response = await fetch('/api/extract', {
              method: 'POST',
              body: formData
            });

            if (response.ok) {
              const data = await response.json();
              if (data.success && Array.isArray(data.assets) && data.assets.length > 0) {
                rows = data.assets.map((a: any) => ({
                  rawName: a.name,
                  weight: typeof a.weight === 'number' ? a.weight : 0,
                  amount: typeof a.value === 'number' && a.value > 0 ? a.value : null,
                  customReturnPct: typeof a.yield === 'number' ? a.yield : 0,
                  indexador: a.indexador || 'Pós-fixado (CDI)',
                  taxa: a.taxa || ''
                }));
                if (data.portfolioName) {
                  defaultName = data.portfolioName;
                }
                importMetadata = {
                  portfolioName: data.portfolioName,
                  totalValue: data.totalValue,
                  portfolioReturn12m: data.portfolioReturn12m,
                  portfolioReturnYtd: data.portfolioReturnYtd,
                  monthlyWeightedYield: data.monthlyWeightedYield,
                  monthlyHistory: data.monthlyHistory || []
                };
                aiSuccess = true;
              } else if (data.error) {
                console.warn('IA retornou aviso:', data.error);
              }
            }
          } catch (aiErr) {
            console.warn('Processamento via IA falhou, executando leitor de fallback local:', aiErr);
          }

          // 2. Fallback local somente para planilhas/tabelas estruturadas ou texto colado
          if (!aiSuccess || rows.length === 0) {
            if (file) {
              const extension = file.name.split('.').pop()?.toLowerCase();
              if (extension === 'xlsx' || extension === 'xls' || extension === 'csv') {
                const content = await readPortfolioFile(file);
                rows = content.kind === 'table'
                  ? parseTabularRows(content.rows)
                  : parseTabularRows(parseSimpleCsv(content.text));
              } else {
                throw new PortfolioFileError('A leitura automática do PDF não identificou as posições de custódia. Por favor, envie novamente o arquivo.');
              }
            } else if (pasted) {
              rows = parseImportText(pasted);
            }
          }

          if (!rows.length) {
            throw new PortfolioFileError('Não identificamos ativos financeiros ou valores no documento. Confira o arquivo ou cole uma lista.');
          }

          openImportReviewModal(rows, defaultName, importMetadata);
        } catch (error) {
          const message = error instanceof Error
            ? error.message
            : 'Não foi possível importar esse arquivo. Tente novamente ou cole a lista de ativos.';
          showImportWarn(message);
        } finally {
          setImportBusy(false);
        }
      }

      function setupImportBuilder(){
        const importBtn = document.getElementById('importBtn');
        const closeBtn = document.getElementById('importModalClose');
        const addRowBtn = document.getElementById('importAddRowBtn');
        const confirmBtn = document.getElementById('importConfirmBtn');
        const fileInput = document.getElementById('importFileInput');
        const removeFileBtn = document.getElementById('importRemoveFileBtn');

        if (!importBtn || !closeBtn || !addRowBtn || !confirmBtn) return;
        importBtn.addEventListener('click', handleImportClick);
        fileInput?.addEventListener('change', updateSelectedFile);
        removeFileBtn?.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          clearSelectedFile();
        });
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

      setupRecBuilder();
      setupImportBuilder();
      setupChartTabs();

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

      <div className={data ? "block" : "hidden"} style={{ minHeight: data ? 'auto' : '0px' }}>
      {data && (
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-8 pb-4">
            <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1f674f] mb-2">
                    {greeting}, {data.userName}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-dash-text tracking-tight mb-1">
                    Minha carteira
                  </h1>
                  <div className="text-sm text-dash-text-muted max-w-2xl leading-relaxed">
                    Importe sua posição atual, organize os ativos e compare alternativas em um só lugar.
                  </div>
                </div>
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#cee2d9] bg-[#edf6f2] px-3 py-2 text-xs font-semibold text-[#1f674f]">
                    <ShieldCheck className="w-4 h-4" /> Alterações salvas automaticamente
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5">
                <div className="bg-dash-surface border border-dash-border rounded-2xl p-3.5 sm:p-5 shadow-xs">
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-dash-text-light uppercase tracking-[0.06em] mb-1">
                        <Wallet className="w-3 h-3 text-[#1f674f]" /> Patrimônio Total
                    </div>
                    <EditableMetric
                        label="Patrimônio Total"
                        value={data.totalCarteira}
                        onSave={v => saveProfile({ totalCarteira: v })}
                    />
                    <div className="text-[10px] sm:text-[11px] text-dash-text-light mt-1 truncate">Carteira + saldo + reserva</div>
                </div>

                <div className="bg-dash-surface border border-dash-border rounded-2xl p-3.5 sm:p-5 shadow-xs">
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-dash-text-light uppercase tracking-[0.06em] mb-1">
                        <PiggyBank className="w-3 h-3 text-[#1f674f]" /> Aporte Mensal
                    </div>
                    <EditableMetric
                        label="Aporte Mensal"
                        value={data.monthlyContribution}
                        onSave={v => savePlan({ monthlyContribution: v })}
                    />
                    <div className="text-[10px] sm:text-[11px] text-dash-text-light mt-1 truncate">Definido no Planejamento</div>
                </div>

                <div className="bg-dash-surface border border-dash-border rounded-2xl p-3.5 sm:p-5 shadow-xs">
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-dash-text-light uppercase tracking-[0.06em] mb-1">
                        <TrendingUp className="w-3 h-3 text-[#1f674f]" /> Retorno Est.
                    </div>
                    <EditableMetric
                        label="Retorno Estimado"
                        value={data.expectedReturn}
                        onSave={v => savePlan({ expectedReturn: v })}
                        prefix=""
                        suffix="% a.a."
                    />
                    <div className="text-[10px] sm:text-[11px] text-dash-text-light mt-1 truncate" title={data.returnSource || "Rentabilidade nominal"}>
                        {data.returnSource || "Rentabilidade nominal"}
                    </div>
                </div>

                <div className="bg-dash-surface border border-dash-border rounded-2xl p-3.5 sm:p-5 shadow-xs">
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-dash-text-light uppercase tracking-[0.06em] mb-1">
                        <BarChart3 className="w-3 h-3 text-[#1f674f]" /> Reserva
                    </div>
                    <EditableMetric
                        label="Reserva de Emergência"
                        value={data.emergencyFund}
                        onSave={v => saveProfile({ emergencyFund: v })}
                    />
                    <div className="text-[10px] sm:text-[11px] text-dash-text-light mt-1 truncate">Fundo de liquidez</div>
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

        .minha-carteira-app .mc-wrap { width:100%; max-width:1400px; padding:12px 16px 56px; margin:0 auto; }

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

        .minha-carteira-app .chart-benchmarks { display:flex; gap:8px; margin-top:8px; margin-bottom:12px; flex-wrap:wrap; align-items:center; }
        .minha-carteira-app .bench-chip {
          display:inline-flex;
          align-items:center;
          gap:7px;
          background:#f1f5f9;
          border:1.5px solid #e2e8f0;
          border-radius:20px;
          padding:6px 14px;
          font-size:12px;
          font-weight:600;
          color:#94a3b8;
          cursor:pointer;
          transition:all .15s ease-in-out;
          opacity:0.55;
          user-select:none;
        }
        .minha-carteira-app .bench-chip:hover {
          opacity:0.85;
          border-color:var(--c, #94a3b8);
          transform:translateY(-1px);
        }
        .minha-carteira-app .bench-chip.active {
          background:#ffffff;
          color:#0f172a;
          border-color:var(--c, #0f172a);
          border-width:2px;
          opacity:1;
          box-shadow:0 2px 6px rgba(0,0,0,0.08);
          font-weight:700;
        }
        .minha-carteira-app .bench-chip .dot {
          width:10px;
          height:10px;
          border-radius:50%;
          background:#cbd5e1;
          flex-shrink:0;
          transition:all .15s ease-in-out;
        }
        .minha-carteira-app .bench-chip.active .dot {
          background:var(--c, #0f172a);
          transform:scale(1.1);
          box-shadow:0 0 0 2px rgba(0,0,0,0.12);
        }
        .minha-carteira-app .bench-chip.inactive {
          background:#f1f5f9 !important;
          border-color:#e2e8f0 !important;
          color:#94a3b8 !important;
          opacity:0.5 !important;
          box-shadow:none !important;
        }
        .minha-carteira-app .bench-chip.inactive .dot {
          background:#cbd5e1 !important;
          box-shadow:none !important;
          transform:none !important;
        }

        .minha-carteira-app #chartBox { height:360px; position:relative; width:100%; min-height:260px; }
        @media (max-width:640px) {
          .minha-carteira-app #chartBox { height:280px; }
        }

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
        .minha-carteira-app .import-modal-inner { background:var(--panel); border-radius:16px; max-width:960px; width:100%; max-height:88vh; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 12px 40px rgba(20,22,40,0.25); }
        .minha-carteira-app .import-modal-header { display:flex; justify-content:space-between; align-items:center; padding:16px 20px; border-bottom:1px solid var(--border); }
        .minha-carteira-app .import-modal-header h3 { margin:0; font-size:16px; }
        .minha-carteira-app .import-modal-body { padding:14px 20px; overflow-y:auto; flex:1; }
        .minha-carteira-app .import-name-label { font-size:12.5px; color:var(--muted); display:flex; flex-direction:column; gap:4px; margin-bottom:10px; }
        .minha-carteira-app .import-name-label input { padding:8px 9px; border:1px solid var(--border); border-radius:8px; font-size:13px; color:var(--text); }
        .minha-carteira-app .import-review-total { font-size:13px; margin-bottom:12px; padding:10px 14px; background:var(--panel2); border-radius:8px; border:1px solid var(--border); }
        .minha-carteira-app .import-review-header-row { display:grid; grid-template-columns:1.3fr 130px 115px 105px 55px 1.15fr 80px 28px; gap:6px; align-items:center; font-size:10.5px; font-weight:800; color:var(--muted); text-transform:uppercase; letter-spacing:.05em; padding:0 4px 6px; border-bottom:1px solid var(--border); margin-bottom:4px; }
        .minha-carteira-app .import-review-rows { display:flex; flex-direction:column; gap:6px; }
        .minha-carteira-app .import-review-item { display:flex; flex-direction:column; gap:3px; }
        .minha-carteira-app .import-review-row { display:grid; grid-template-columns:1.3fr 130px 115px 105px 55px 1.15fr 80px 28px; gap:6px; align-items:center; }
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

        .minha-carteira-app .workflow-panel { padding:0; overflow:hidden; border-color:#d7e3dc; }
        .minha-carteira-app .workflow-head { padding:22px 24px 18px; background:linear-gradient(135deg,#f5faf7 0%,#edf5f1 100%); border-bottom:1px solid #d7e3dc; }
        .minha-carteira-app .section-kicker { margin-bottom:7px; color:#1f674f; font-size:10.5px; font-weight:800; letter-spacing:.12em; text-transform:uppercase; }
        .minha-carteira-app .workflow-head h2 { margin:0 0 6px; font-size:20px; letter-spacing:-.01em; }
        .minha-carteira-app .workflow-head p { max-width:720px; margin:0; color:var(--muted); font-size:13.5px; line-height:1.55; }
        .minha-carteira-app .workflow-steps { display:grid; grid-template-columns:repeat(3,1fr); gap:0; margin-top:18px; border:1px solid #d7e3dc; border-radius:12px; background:rgba(255,255,255,.72); overflow:hidden; }
        .minha-carteira-app .workflow-step { display:flex; align-items:center; gap:10px; min-width:0; padding:11px 13px; border-right:1px solid #d7e3dc; color:var(--muted); font-size:11.5px; font-weight:650; }
        .minha-carteira-app .workflow-step:last-child { border-right:0; }
        .minha-carteira-app .workflow-step b { display:grid; place-items:center; width:24px; height:24px; flex:0 0 auto; border-radius:50%; background:#1f674f; color:#fff; font-size:11px; }
        .minha-carteira-app .workflow-actions { display:grid; grid-template-columns:minmax(0,1.16fr) minmax(300px,.84fr); gap:16px; padding:20px 24px 24px; }
        .minha-carteira-app .action-card { min-width:0; padding:20px; border:1px solid var(--border); border-radius:14px; background:#fff; }
        .minha-carteira-app .action-card.primary { border-color:#bcd6ca; box-shadow:0 6px 18px rgba(31,103,79,.07); }
        .minha-carteira-app .action-card-head { display:flex; align-items:flex-start; gap:12px; margin-bottom:16px; }
        .minha-carteira-app .action-card-icon { display:grid; place-items:center; width:38px; height:38px; flex:0 0 auto; border-radius:11px; background:#e8f3ee; color:#1f674f; }
        .minha-carteira-app .action-card h3 { margin:0 0 4px; color:var(--text); font-size:15.5px; }
        .minha-carteira-app .action-card p { margin:0; color:var(--muted); font-size:12px; line-height:1.5; }
        .minha-carteira-app .action-badge { margin-left:auto; padding:4px 8px; border-radius:999px; background:#e8f3ee; color:#1f674f; font-size:9.5px; font-weight:800; letter-spacing:.05em; text-transform:uppercase; }
        .minha-carteira-app .file-input-hidden { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
        .minha-carteira-app .import-dropzone { display:flex; align-items:center; gap:12px; min-height:84px; padding:14px 16px; border:1.5px dashed #a8c8b8; border-radius:12px; background:#f8fbf9; cursor:pointer; transition:border-color .2s,background .2s,box-shadow .2s; }
        .minha-carteira-app .import-dropzone:hover,.minha-carteira-app .import-dropzone:focus-within { border-color:#1f674f; background:#f2f8f5; box-shadow:0 0 0 3px rgba(31,103,79,.08); }
        .minha-carteira-app .import-dropzone.has-file { border-style:solid; border-color:#1f674f; background:#edf6f2; }
        .minha-carteira-app .dropzone-icon { display:grid; place-items:center; width:40px; height:40px; flex:0 0 auto; border-radius:10px; background:#fff; color:#1f674f; box-shadow:0 1px 4px rgba(18,48,68,.08); }
        .minha-carteira-app .dropzone-text-group { display:flex; flex-direction:column; flex:1; min-width:0; }
        .minha-carteira-app .dropzone-title { color:var(--text); font-size:13px; font-weight:750; }
        .minha-carteira-app .dropzone-remove-btn { display:inline-flex; align-items:center; gap:4px; margin-left:auto; background:#f8fafc; color:#64748b; border:1px solid #cbd5e1; border-radius:6px; padding:4px 9px; font-size:11px; font-weight:600; cursor:pointer; transition:all .2s ease; z-index:2; flex-shrink:0; }
        .minha-carteira-app .dropzone-remove-btn:hover { background:#fef2f2; border-color:#fca5a5; color:#b91c1c; }
        .minha-carteira-app .import-manual-box { margin-top:14px; display:flex; flex-direction:column; gap:7px; }
        .minha-carteira-app .import-manual-header { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
        .minha-carteira-app .import-manual-icon { display:inline-flex; color:#1f674f; }
        .minha-carteira-app .import-manual-title { font-size:12px; font-weight:750; color:#1e293b; }
        .minha-carteira-app .import-manual-tip { font-size:10.5px; color:var(--muted); margin-left:auto; }
        .minha-carteira-app .import-textarea { width:100%; min-height:88px; resize:vertical; border:1.5px solid #cbd5e1; border-radius:10px; padding:10px 13px; font-size:12.5px; font-family:inherit; background:#ffffff; color:#1e293b; box-sizing:border-box; transition:border-color .2s, box-shadow .2s; }
        .minha-carteira-app .import-textarea:focus { outline:none; border-color:#1f674f; box-shadow:0 0 0 3px rgba(31,103,79,0.12); }
        .minha-carteira-app .import-textarea::placeholder { color:#94a3b8; line-height:1.5; }
        .minha-carteira-app .import-footer { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-top:14px; }
        .minha-carteira-app .import-security { display:flex; align-items:center; gap:6px; color:var(--muted); font-size:10.5px; line-height:1.35; }
        .minha-carteira-app .import-btn,.minha-carteira-app .rec-build-btn { min-height:40px; border-radius:9px; background:#1f674f; padding:9px 15px; color:#fff; font-size:12px; font-weight:750; }
        .minha-carteira-app .import-btn:hover,.minha-carteira-app .rec-build-btn:hover { background:#174f3d; }
        .minha-carteira-app .import-btn:disabled { cursor:wait; opacity:.65; }
        .minha-carteira-app .import-builder-warn { margin:12px 0 0; color:#9a5b0b; background:#fff9ed; border-color:#efd8ac; line-height:1.45; }
        .minha-carteira-app .rec-builder-row { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:9px; }
        .minha-carteira-app .rec-field { display:flex; min-width:0; flex-direction:column; gap:5px; color:var(--muted); font-size:10.5px; font-weight:700; }
        .minha-carteira-app .rec-builder-row select { width:100%; min-width:0; min-height:38px; border-color:#d7ded9; padding:8px 9px; font-size:11.5px; }
        .minha-carteira-app .rec-action-row { display:flex; align-items:flex-end; justify-content:space-between; gap:12px; margin-top:13px; }
        .minha-carteira-app .rec-builder-hint { flex:1; font-size:10.5px; }
        .minha-carteira-app .workspace-panel { border-color:#dedbd2; }
        .minha-carteira-app .workspace-title-row { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; margin-bottom:6px; }
        .minha-carteira-app .workspace-title-row h2 { margin:0 0 5px; }
        .minha-carteira-app .workspace-help { margin:0 0 18px; color:var(--muted); font-size:12.5px; line-height:1.55; }
        .minha-carteira-app .analysis-grid { display:grid; grid-template-columns:minmax(0,1.7fr) minmax(260px,.7fr); gap:18px; align-items:start; }
        .minha-carteira-app .analysis-grid .mc-panel { margin-bottom:0; }
        .minha-carteira-app .analysis-side { position:sticky; top:16px; }
        .minha-carteira-app .leaderboard { flex-direction:column; }
        .minha-carteira-app .lb-item { width:100%; min-width:0; }
        .minha-carteira-app .data-panel { margin-top:18px; padding:15px 20px; }

        @media (min-width:768px){
          .minha-carteira-app .mc-wrap { padding-left:32px; padding-right:32px; }
        }

        @media (max-width:900px){
          .minha-carteira-app .mc-main-layout { flex-direction:column; align-items:stretch; }
          .minha-carteira-app .mc-main-col { order:1; }
          .minha-carteira-app .mc-asset-sidebar { order:2; width:100%; flex:none; position:static; max-height:none; }
          .minha-carteira-app .workflow-actions,.minha-carteira-app .analysis-grid { grid-template-columns:1fr; }
          .minha-carteira-app .analysis-side { position:static; }
        }

        @media (max-width:640px){
          .minha-carteira-app .workflow-head,.minha-carteira-app .workflow-actions { padding-left:16px; padding-right:16px; }
          .minha-carteira-app .workflow-steps { grid-template-columns:1fr; }
          .minha-carteira-app .workflow-step { border-right:0; border-bottom:1px solid #d7e3dc; }
          .minha-carteira-app .workflow-step:last-child { border-bottom:0; }
          .minha-carteira-app .rec-builder-row { grid-template-columns:1fr; }
          .minha-carteira-app .rec-action-row,.minha-carteira-app .import-footer { align-items:stretch; flex-direction:column; }
          .minha-carteira-app .import-btn,.minha-carteira-app .rec-build-btn { width:100%; }
          .minha-carteira-app .mc-panel { padding:20px 16px; }
          .minha-carteira-app .import-review-header-row { display:none; }
          .minha-carteira-app .import-review-row { grid-template-columns:1fr 90px 65px 24px; }
          .minha-carteira-app .import-review-row select, .minha-carteira-app .import-review-row input:nth-child(5) { grid-column:1 / -1; }
        }
      `}} />

      <div dangerouslySetInnerHTML={{ __html: `
        <div class="mc-wrap">
        <div class="mc-main-layout">

          <div class="mc-main-col">

          <section class="mc-panel workflow-panel" aria-labelledby="workflowTitle">
            <div class="workflow-head">
              <div class="section-kicker">Comece por aqui</div>
              <h2 id="workflowTitle">Traga sua carteira para a ARVO</h2>
              <p>Envie sua posição atual ou comece por uma carteira recomendada. Você revisa tudo antes de salvar.</p>
              <div class="workflow-steps" aria-label="Etapas para organizar a carteira">
                <div class="workflow-step"><b>1</b><span>Importe ou monte</span></div>
                <div class="workflow-step"><b>2</b><span>Revise ativos e pesos</span></div>
                <div class="workflow-step"><b>3</b><span>Compare o desempenho</span></div>
              </div>
            </div>

            <div class="workflow-actions">
              <div class="action-card primary import-builder">
                <div class="action-card-head">
                  <div class="action-card-icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  </div>
                  <div>
                    <h3>Importar carteira atual</h3>
                    <p>Envie o extrato em PDF, planilha ou foto para preenchimento automático.</p>
                  </div>
                </div>

                <label class="import-dropzone" id="importDropzone" for="importFileInput">
                  <input class="file-input-hidden" type="file" id="importFileInput" accept=".csv,.txt,.xlsx,.xls,.pdf,.png,.jpg,.jpeg,.webp">
                  <span class="dropzone-icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M12 18v-6"></path><path d="m9 15 3-3 3 3"></path></svg>
                  </span>
                  <span class="dropzone-text-group">
                    <span class="dropzone-title" id="importDropzoneTitle">Clique para escolher o arquivo</span>
                    <span class="dropzone-meta" id="importFileName">PDF de qualquer banco, Excel, CSV ou Foto · até 15 MB</span>
                  </span>
                  <button type="button" class="dropzone-remove-btn" id="importRemoveFileBtn" title="Remover arquivo selecionado" style="display:none;">✕ Remover</button>
                </label>

                <div class="import-manual-box">
                  <div class="import-manual-header">
                    <span class="import-manual-icon" aria-hidden="true">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </span>
                    <span class="import-manual-title">Ou digite / cole seus ativos manualmente:</span>
                    <span class="import-manual-tip">Reconhece valores em R$, % e taxas</span>
                  </div>
                  <textarea id="importTextInput" class="import-textarea" aria-label="Lista de ativos para importar" placeholder="Digite ou cole seus ativos aqui..."></textarea>
                </div>

                <div class="import-footer">
                  <div class="import-security">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3z"></path><path d="m9 12 2 2 4-4"></path></svg>
                    <span>O arquivo é processado somente para montar sua carteira.</span>
                  </div>
                  <button type="button" class="import-btn" id="importBtn">Importar e revisar</button>
                </div>
                <div class="import-builder-warn" id="importBuilderWarn" role="alert" style="display:none;"></div>
              </div>

              <div class="action-card">
                <div class="action-card-head">
                  <div class="action-card-icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z"></path><path d="m5 17 .8 2.2L8 20l-2.2.8L5 23l-.8-2.2L2 20l2.2-.8L5 17z"></path></svg>
                  </div>
                  <div>
                    <h3>Usar uma recomendação ARVO</h3>
                    <p>Escolha o patrimônio, tipo de investidor e perfil.</p>
                  </div>
                </div>
                <div class="rec-builder-row">
                  <label class="rec-field">Patrimônio<select id="recTier" aria-label="Faixa de patrimônio"></select></label>
                  <label class="rec-field">Investidor<select id="recItype" aria-label="Tipo de investidor"></select></label>
                  <label class="rec-field">Perfil<select id="recPerfil" aria-label="Perfil da carteira"></select></label>
                </div>
                <div class="rec-action-row">
                  <div class="rec-builder-hint" id="recHint"></div>
                  <button type="button" class="rec-build-btn" id="recBuildBtn">Criar carteira</button>
                </div>
              </div>
            </div>
          </section>

          <section class="mc-panel workspace-panel" aria-labelledby="portfoliosTitle">
            <div class="workspace-title-row">
              <div>
                <div class="section-kicker">Área de trabalho</div>
                <h2 id="portfoliosTitle">Carteiras e alocação</h2>
              </div>
              <button type="button" class="reset-link" id="resetAllBtn" title="Apaga tudo e recomeça com carteiras vazias">↺ Recomeçar do zero</button>
            </div>
            <p class="workspace-help">Adicione fundos no campo de cada carteira e ajuste os percentuais. Você pode manter mais de uma versão para comparar cenários.</p>
            <div class="before-after-box" id="beforeAfterBox" style="display:none;"></div>
            <div class="portfolios-row" id="portfoliosRow"></div>
          </section>

          <div class="analysis-grid">
            <section class="mc-panel" aria-labelledby="performanceTitle" style="padding-bottom:12px;">
              <div class="panel-head-row" style="align-items:center; margin-bottom:16px;">
                <div>
                  <div class="section-kicker">Comparação histórica</div>
                  <h2 id="performanceTitle">Rentabilidade acumulada</h2>
                </div>
                <div class="chart-benchmarks" id="chartBenchmarks" style="margin:0;"></div>
              </div>
              <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap; margin-bottom:20px;">
                <div class="chart-period-tabs" id="chartPeriodTabs" style="margin:0;">
                  <button type="button" class="cp-tab" data-months="1">1M</button>
                  <button type="button" class="cp-tab" data-months="YTD">YTD</button>
                  <button type="button" class="cp-tab" data-months="12">12M</button>
                  <button type="button" class="cp-tab" data-months="24">24M</button>
                  <button type="button" class="cp-tab" data-months="36">36M</button>
                  <button type="button" class="cp-tab active" data-months="0">MAX</button>
                </div>
                <p class="sub" id="chartDateRange" style="margin:0; font-size:12px; font-weight:600;">Acumulado desde jan. 23</p>
              </div>
              <div id="chartBox"><canvas id="chart"></canvas></div>
            </section>

            <section class="mc-panel analysis-side" aria-labelledby="leaderboardTitle">
              <div class="section-kicker">Ranking</div>
              <h2 id="leaderboardTitle">Qual está na frente?</h2>
              <p class="sub">O ranking muda automaticamente conforme os pesos são ajustados.</p>
              <div class="leaderboard" id="leaderboard"></div>
            </section>
          </div>

          <section class="mc-panel data-panel">
            <details class="notes-toggle">
              <summary>Sobre os dados e critérios desta simulação</summary>
              <div class="notes">
                <div class="note-item"><b>Fonte:</b> retornos mensais reais da sua planilha oficial (abas "Fundos Selecionados" e "Dados Mês a mês") — 30 ativos, de janeiro de 2023 a maio de 2026 (41 meses). Padronizei todos os fundos nesse mesmo período de 41 meses para poder comparar qualquer combinação de forma justa (os 7 fundos que só entraram para viabilizar as carteiras recomendadas oficiais têm dado real só até mai/2026, um mês a menos do que os 23 originais tinham antes).</div>
                <div class="note-item"><b>Carteiras recomendadas:</b> o seletor cria qualquer uma das 36 carteiras oficiais, usando os pesos da planilha “Carteiras Recomendadas”, sem alterar as versões já montadas.</div>
                <div class="note-item"><b>Atenção ao CDBI11:</b> ele foi deixado de fora porque sua série na fonte está idêntica à do Tesouro Selic e precisa ser corrigida antes de voltar à simulação.</div>
                <div class="note-item"><b>Dados incompletos:</b> IVVB11, NASD11 e WRLD11 ainda não têm gestora ou classificação de risco cadastradas.</div>
                <div class="note-item"><b>Percentual não alocado</b> vira caixa parado (rendimento zero), não CDI. Se a soma passar de 100%, o simulador simplesmente pondera os fundos do jeito que você configurou, sem travar — é o modo livre que você pediu (isso vale para as carteiras que você monta manualmente; as recomendadas já vêm fechadas em 100%).</div>
                <div class="note-item"><b>Sem limites de concentração</b> nas carteiras montadas manualmente: ao contrário das carteiras recomendadas (que já respeitam os tetos de 10% por fundo / 15% por gestora da planilha oficial), aqui não há trava — os números de concentração em "ver mais números" são só informativos.</div>
                <div class="note-item">Os 41 meses de histórico (~3,4 anos) ainda são um período curto, especialmente para os fundos de ações (Ataque) — vale cautela antes de tirar conclusões definitivas só pelo ranking.</div>
                <div class="note-item"><b>Retorno a.a. / vol / queda máxima</b> mostrados na lista lateral são calculados sobre o fundo isoladamente (100% dele), no mesmo período de 41 meses — servem para comparar fundos entre si, não como previsão de retorno futuro.</div>
              </div>
            </details>
          </section>

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
