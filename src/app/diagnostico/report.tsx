'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  ArrowRight, 
  ArrowLeft, 
  Download, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp, 
  User, 
  Mail, 
  Phone, 
  SlidersHorizontal, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Zap,
  Clock,
  Calendar,
  Flame,
  Trophy,
  Target
} from 'lucide-react';
import data from '@/data/diagnostic-data.json';
import { DEFAULT_INPUTS, project, money, pct, duration, formatBRLNumber, parseBRLNumber, type Inputs } from '@/lib/diagnostic-math';
import { HISTORICAL_INFLATION, HISTORICAL_IGPM, PROFILES, portfolioForProfile, type DiagnosticProfile } from '@/lib/diagnostic-options';
import './report.css';

const colors = ['#ad986b', '#8c9d74', '#4fa080', '#2b6e76', '#143a50', '#765878', '#324bbc', '#b77d3e', '#137c81'];

const stages = [
  ['Entender você', 'Alinhar objetivos, escopo, responsabilidades e o significado de liberdade na sua vida.'],
  ['Conhecer seus números', 'Reunir renda, gastos, patrimônio, dívidas, proteção e responsabilidades.'],
  ['Analisar o caminho', 'Identificar distâncias, riscos e escolhas possíveis para seus objetivos.'],
  ['Construir o plano', 'Organizar recomendações, metas de aporte e uma estratégia adequada.'],
  ['Colocar em prática', 'Transformar decisões em hábitos e coordenar as ações necessárias.'],
  ['Acompanhar e ajustar', 'Comparar o realizado com o plano e revisar quando a vida mudar.']
];

function maskPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

function CurrencyInputField({
  value,
  onChange,
  className,
  min = 0,
  max = 100000000,
}: {
  value: number;
  onChange: (val: number) => void;
  className?: string;
  min?: number;
  max?: number;
}) {
  const [text, setText] = useState(() => formatBRLNumber(value));
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setText(formatBRLNumber(value));
    }
  }, [value, isFocused]);

  const handleBlur = () => {
    setIsFocused(false);
    setText(formatBRLNumber(value));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    e.target.select();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setText(raw);
    const num = parseBRLNumber(raw);
    if (!isNaN(num) && isFinite(num)) {
      const clamped = Math.min(max, Math.max(min, num));
      onChange(clamped);
    }
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      value={text}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      className={className}
    />
  );
}

function Curve({ series, target, nominal = false }: { series: { name: string; color: string; points: ReturnType<typeof project>['points'] }[]; target: number; nominal?: boolean }) {
  const max = Math.max(target * 1.1, ...series.flatMap(s => s.points.filter(p => p.year <= 40).map(p => nominal ? p.nominal : p.real)));
  const y = (v: number) => 240 - (v / max) * 205;
  return (
    <svg viewBox="0 0 820 280" role="img" aria-label={nominal ? 'Evolução nominal do patrimônio em 40 anos' : 'Evolução do patrimônio em poder de compra de hoje em 40 anos'} className="w-full h-auto">
      <defs>
        <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2B6E76" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#2B6E76" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map(t => (
        <g key={t}>
          <line x1="82" x2="798" y1={y(max * t)} y2={y(max * t)} stroke="rgba(14, 21, 17, 0.08)" strokeDasharray="4 4" />
          <text x="72" y={y(max * t) + 4} textAnchor="end" className="fill-stone-400 font-sans text-[11px]">
            {new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 }).format(max * t)}
          </text>
        </g>
      ))}
      {[0, 10, 20, 30, 40].map(t => (
        <text key={t} x={82 + (t / 40) * 716} y="268" textAnchor="middle" className="fill-stone-400 font-sans text-[11px]">
          {t} anos
        </text>
      ))}
      {!nominal && (
        <>
          <line x1="82" x2="798" y1={y(target)} y2={y(target)} stroke="#C08A34" strokeDasharray="6 4" strokeWidth="1.5" />
          <text x="794" y={y(target) - 8} textAnchor="end" className="fill-[#C08A34] font-sans text-[11px] font-medium">
            Meta em reais de hoje ({new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 }).format(target)})
          </text>
        </>
      )}
      {series.map(s => {
        const linePoints = s.points.filter(p => p.year <= 40);
        const pathD = linePoints.map((p, i) => `${i ? 'L' : 'M'}${82 + (p.year / 40) * 716},${y(nominal ? p.nominal : p.real)}`).join(' ');
        const areaD = `${pathD} L${82 + 716},240 L82,240 Z`;
        return (
          <g key={s.name}>
            {series.length === 1 && <path d={areaD} fill="url(#curveGradient)" />}
            <path d={pathD} fill="none" stroke={s.color} strokeWidth="2.8" strokeLinecap="round" />
          </g>
        );
      })}
    </svg>
  );
}

export default function Diagnostic() {
  const searchParams = useSearchParams();
  const [rawInput, setInput] = useState<Inputs>({ ...DEFAULT_INPUTS, inflation: HISTORICAL_INFLATION });
  const [ready, setReady] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [profile, setProfile] = useState<DiagnosticProfile>('Conservador');
  const [withdrawalMode, setWithdrawalMode] = useState('fixed');
  const [nominal, setNominal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [downloadError, setDownloadError] = useState('');
  const [showAdjustPanel, setShowAdjustPanel] = useState(true);
  const family = 'Geral';

  // Lead Form State
  const [leadForm, setLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    marketingConsent: true
  });
  const [leadErrors, setLeadErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
  const [submittingLead, setSubmittingLead] = useState(false);
  const [leadSubmitError, setLeadSubmitError] = useState('');

  // 1. Hydrate inputs from URL params or sessionStorage
  useEffect(() => {
    try {
      const urlInitial = searchParams.get('initial');
      const urlMonthly = searchParams.get('monthly');
      const urlIncome = searchParams.get('income');

      let parsedInitial = urlInitial ? Number(urlInitial) : null;
      let parsedMonthly = urlMonthly ? Number(urlMonthly) : null;
      let parsedIncome = urlIncome ? Number(urlIncome) : null;

      if (!parsedInitial || !parsedMonthly || !parsedIncome) {
        const saved = JSON.parse(sessionStorage.getItem('arvo-simulation') || 'null');
        if (saved && Number.isFinite(saved.initial) && Number.isFinite(saved.monthly) && Number.isFinite(saved.income)) {
          parsedInitial = parsedInitial || saved.initial;
          parsedMonthly = parsedMonthly || saved.monthly;
          parsedIncome = parsedIncome || saved.income;
        }
      }

      setInput(prev => ({
        ...prev,
        initial: parsedInitial && parsedInitial >= 0 ? parsedInitial : DEFAULT_INPUTS.initial,
        monthly: parsedMonthly && parsedMonthly >= 0 ? parsedMonthly : DEFAULT_INPUTS.monthly,
        income: parsedIncome && parsedIncome > 0 ? parsedIncome : DEFAULT_INPUTS.income,
        inflation: HISTORICAL_INFLATION
      }));

      // Check saved lead data to pre-fill inputs
      const savedLead = JSON.parse(sessionStorage.getItem('arvo-lead') || 'null');
      if (savedLead && savedLead.name) {
        setLeadForm(savedLead);
      }

      // Check if user should view report directly
      const viewReport = sessionStorage.getItem('arvo-diagnostic-view') === 'report' || searchParams.get('relatorio') === '1';
      const isNew = searchParams.get('novo') === '1' || searchParams.get('cadastro') === '1';

      if (viewReport && !isNew && savedLead?.name && savedLead?.email) {
        setIsRegistered(true);
      } else {
        setIsRegistered(false);
      }
    } catch {
      // Retain defaults
    } finally {
      setReady(true);
    }
  }, [searchParams]);

  // As 4 Carteiras Oficiais Principais da ARVO
  const MAIN_PORTFOLIO_NAMES = ['Abrigo', 'Ritmo', 'Visão', 'Oceano'] as const;

  const PORTFOLIO_COLORS: Record<string, string> = {
    'Abrigo': '#C08A34',
    'Ritmo': '#4FA080',
    'Visão': '#2B6E76',
    'Oceano': '#123044'
  };

  const MAIN_MODELS_CONFIG = [
    { 
      name: 'Abrigo', 
      profileLabel: 'Conservador', 
      profile: 'Conservador' as DiagnosticProfile, 
      badge: null,
      desc: 'Foco em preservação com volatilidade controlada'
    },
    { 
      name: 'Ritmo', 
      profileLabel: 'Moderado', 
      profile: 'Moderado' as DiagnosticProfile, 
      badge: 'MAIS ESCOLHIDA',
      desc: 'Equilíbrio estratégico entre renda fixa e variáveis'
    },
    { 
      name: 'Visão', 
      profileLabel: 'Arrojado', 
      profile: 'Arrojado' as DiagnosticProfile, 
      badge: null,
      desc: 'Crescimento patrimonial e maior tolerância a oscilações'
    },
    { 
      name: 'Oceano', 
      profileLabel: 'Global / RV', 
      profile: 'Arrojado' as DiagnosticProfile, 
      badge: 'MÁXIMA VELOCIDADE',
      desc: 'Exposição internacional e máxima alavancagem de longo prazo'
    }
  ];

  const [selectedModelName, setSelectedModelName] = useState<string>('Ritmo');

  // Selected portfolio and rates
  const selected = useMemo(() => {
    return (
      data.portfolios.find(p => p.family === family && p.name === selectedModelName) ||
      data.portfolios.find(p => p.name === selectedModelName) ||
      portfolioForProfile(profile)
    );
  }, [family, selectedModelName, profile]);

  const realRate = selected?.annualReal ?? 0.06;
  const input = useMemo(() => ({
    ...rawInput,
    withdrawal: withdrawalMode === 'portfolio' && selected ? realRate : rawInput.withdrawal
  }), [rawInput, withdrawalMode, selected, realRate]);

  const base = useMemo(() => project(input, realRate), [input, realRate]);

  // Benchmark: Investimento tradicional bancário / poupança (taxa real líquida estimada de 2.5% a.a.)
  const benchmarkRate = 0.025;
  const benchmarkProj = useMemo(() => project(input, benchmarkRate), [input]);
  const benchmarkMonths = benchmarkProj.months ?? 720;
  const benchmarkYear = benchmarkProj.months ? new Date().getFullYear() + Math.ceil(benchmarkProj.months / 12) : null;

  // Projeções das 4 Carteiras Modelo Oficiais da ARVO para o estúdio gamificado
  const arvoPortfoliosData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    
    return MAIN_MODELS_CONFIG.map(cfg => {
      const port = data.portfolios.find(p => p.family === family && p.name === cfg.name) 
        || data.portfolios.find(p => p.name === cfg.name);
      const rate = port?.annualReal ?? 0.06;
      const proj = project(input, rate);
      const months = proj.months ?? 720;
      const monthsSaved = Math.max(0, benchmarkMonths - months);
      const yearsSaved = Math.round((monthsSaved / 12) * 10) / 10;
      const targetYear = proj.months ? currentYear + Math.ceil(proj.months / 12) : null;
      
      return {
        name: cfg.name,
        profileLabel: cfg.profileLabel,
        profile: cfg.profile,
        badge: cfg.badge,
        desc: cfg.desc,
        port,
        rate,
        proj,
        months,
        monthsSaved,
        yearsSaved,
        targetYear
      };
    });
  }, [input, benchmarkMonths, family]);

  const activePortfolioData = useMemo(() => {
    return arvoPortfoliosData.find(d => d.name === selectedModelName) ?? arvoPortfoliosData[1];
  }, [arvoPortfoliosData, selectedModelName]);

  const addMonthly = (delta: number) => {
    setInput(v => ({ ...v, monthly: Math.max(0, v.monthly + delta) }));
  };

  const setInitialQuick = (val: number) => {
    setInput(v => ({ ...v, initial: val }));
  };

  const setIncomeQuick = (val: number) => {
    setInput(v => ({ ...v, income: val }));
  };

  // Seção 02: Apenas as 4 principais carteiras ARVO solicitadas (Abrigo, Ritmo, Visão e Oceano)
  const portfolios = useMemo(() => {
    return data.portfolios
      .filter(p => p.family === family && (MAIN_PORTFOLIO_NAMES as readonly string[]).includes(p.name))
      .sort((a, b) => (MAIN_PORTFOLIO_NAMES as readonly string[]).indexOf(a.name) - (MAIN_PORTFOLIO_NAMES as readonly string[]).indexOf(b.name));
  }, [family]);

  const series = useMemo(() => portfolios.filter(p => !p.pendingIdentity).map(p => ({
    name: p.name,
    color: PORTFOLIO_COLORS[p.name] || '#2B6E76',
    points: project(input, p.annualReal!).points
  })), [portfolios, input]);

  const p20 = base.points[20];
  const more = useMemo(() => project({ ...input, monthly: input.monthly * 1.2 }, realRate), [input, realRate]);
  const fixed = useMemo(() => project({ ...input, indexed: false }, realRate), [input, realRate]);
  const f20 = Math.pow(1 + input.inflation, 20);

  const update = (key: keyof Inputs, value: number | boolean) => {
    setInput(v => ({ ...v, [key]: value }));
  };

  // Lead Submission
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadSubmitError('');
    const errors: { name?: string; email?: string; phone?: string } = {};

    if (!leadForm.name.trim() || leadForm.name.trim().length < 2) {
      errors.name = 'Por favor, informe seu nome completo.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!leadForm.email.trim() || !emailRegex.test(leadForm.email.trim())) {
      errors.email = 'Por favor, informe um e-mail válido.';
    }

    const cleanPhone = leadForm.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errors.phone = 'Informe seu WhatsApp com DDD (mínimo 10 dígitos).';
    }

    if (Object.keys(errors).length > 0) {
      setLeadErrors(errors);
      return;
    }

    setLeadErrors({});
    setSubmittingLead(true);

    try {
      const res = await fetch('/api/diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadForm.name.trim(),
          email: leadForm.email.trim().toLowerCase(),
          phone: leadForm.phone.trim(),
          marketingConsent: leadForm.marketingConsent,
          profile,
          portfolioName: selected?.name || 'Carteira ARVO',
          target: base.target,
          months: base.months,
          input: {
            initial: input.initial,
            monthly: input.monthly,
            income: input.income,
            inflation: input.inflation,
            withdrawal: input.withdrawal,
            indexed: input.indexed
          }
        })
      });

      if (!res.ok) {
        throw new Error('Não foi possível salvar o cadastro. Tente novamente.');
      }

      sessionStorage.setItem('arvo-lead', JSON.stringify(leadForm));
      sessionStorage.setItem('arvo-diagnostic-view', 'report');
      setIsRegistered(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setLeadSubmitError(err.message || 'Falha ao processar cadastro.');
    } finally {
      setSubmittingLead(false);
    }
  };

  // PDF Download
  async function download() {
    setBusy(true);
    setDownloadError('');
    try {
      const res = await fetch('/api/diagnostico/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadForm.name || 'Seu mapa ARVO',
          input,
          family,
          portfolioId: selected.id,
          profile,
          withdrawalMode
        })
      });

      if (!res.ok) throw new Error('Não foi possível gerar o PDF. Tente novamente.');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Mapa-ARVO-${(leadForm.name || 'Diagnostico').replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (e: any) {
      setDownloadError(e.message || 'Falha ao gerar PDF.');
    } finally {
      setBusy(false);
    }
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#F4F1EA] flex items-center justify-center p-4">
        <div className="text-center font-sans text-stone-600">
          <div className="w-10 h-10 border-3 border-[#2B6E76] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-medium text-[#123044]">Preparando seu mapa ARVO...</p>
        </div>
      </div>
    );
  }

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
          max-width: 1200px;
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

        .ui-serif {
          font-family: 'Lora', Georgia, serif;
          font-weight: 400;
          letter-spacing: -0.015em;
        }
        
        .ui-mono {
          font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
          letter-spacing: 0.04em;
        }

        .ui-wrap {
          max-width: 1080px;
          margin: 0 auto;
          padding: 0 32px;
        }
        @media (max-width: 768px) {
          .ui-wrap { padding: 0 20px; }
        }

        .ui-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 24px;
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
        .ui-btn-primary:hover:not(:disabled) {
          background: var(--deep-teal-hover);
          transform: translateY(-1px);
        }
        .ui-btn-navy {
          background: var(--ink-navy);
          color: #ffffff;
        }
        .ui-btn-navy:hover:not(:disabled) {
          background: #0a1f2d;
          transform: translateY(-1px);
        }
        .ui-btn-outline {
          background: transparent;
          border: 1px solid var(--border-strong);
          color: var(--text-primary);
        }
        .ui-btn-outline:hover {
          background: rgba(14, 21, 17, 0.05);
          color: var(--deep-teal);
        }

        .ui-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(244, 241, 234, 0.94);
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

        .ui-eyebrow {
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
          padding: 5px 12px;
          border-radius: 100px;
        }
        .ui-eyebrow-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-green);
        }

        .ui-section {
          padding: 48px 0;
          border-bottom: 1px solid var(--border);
        }

        .ui-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px;
        }
      `}} />

      <div className="ui-page-frame">
        {/* HEADER OFICIAL ARVO */}
        <header className="ui-nav no-print">
          <div className="ui-wrap ui-nav-inner">
            <Link href="/" className="ui-logo">
              <img src="/arvo-simbolo-blue.png" alt="ARVO" className="w-6 h-6 object-contain" />
              <span>ARVO</span>
            </Link>

            <div className="hidden sm:flex items-center gap-3">
              <span className="ui-eyebrow">
                <span className="ui-eyebrow-dot animate-pulse"></span>
                MAPA DE INDEPENDÊNCIA
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/" className="ui-btn ui-btn-outline text-xs sm:text-sm py-2 px-3 sm:px-4">
                <ArrowLeft size={14} /> Voltar ao simulador
              </Link>
              {isRegistered && (
                <button
                  disabled={busy}
                  onClick={download}
                  className="ui-btn ui-btn-primary text-xs sm:text-sm py-2 px-4 shadow-sm"
                >
                  <Download size={14} className={busy ? 'animate-bounce' : ''} />
                  {busy ? 'Gerando PDF...' : 'Baixar PDF'}
                </button>
              )}
            </div>
          </div>
        </header>

        {!isRegistered ? (
          /* ========================================================================= */
          /* PÁGINA ANTES: COLETA DE DADOS DO TITULAR (LEAD GATE)                      */
          /* ========================================================================= */
          <section className="py-8 sm:py-16">
            <div className="ui-wrap max-w-[680px]">
              
              {/* Stepper de progresso */}
              <div className="flex items-center justify-center gap-3 text-xs text-stone-500 mb-8 font-medium">
                <span className="flex items-center gap-1.5 text-stone-400">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-[11px]">✓</span>
                  1. Simulação Inicial
                </span>
                <span className="text-stone-300">→</span>
                <span className="flex items-center gap-1.5 text-[#2B6E76] font-bold">
                  <span className="w-5 h-5 rounded-full bg-[#2B6E76] text-white flex items-center justify-center text-[11px]">2</span>
                  2. Preencher Dados
                </span>
                <span className="text-stone-300">→</span>
                <span className="flex items-center gap-1.5 text-stone-400">
                  <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center text-[11px]">3</span>
                  3. Relatório Completo & PDF
                </span>
              </div>

              {/* Título & Mensagem */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 ui-eyebrow mb-3">
                  <span className="ui-eyebrow-dot"></span>
                  ETAPA DE CADASTRO · PLANEJAMENTO PATRIMONIAL
                </div>
                <h1 className="ui-serif text-3xl sm:text-4xl text-[#123044] mb-3 leading-tight">
                  Para onde enviamos o seu<br />
                  <i className="text-[#2B6E76] font-normal">planejamento completo?</i>
                </h1>
                <p className="text-stone-600 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
                  Você já definiu o primeiro cenário no simulador. Preencha seus dados para receber o diagnóstico personalizado com a recomendação das Carteiras ARVO e liberar o relatório executivo oficial em PDF.
                </p>
              </div>

              {/* CARD DE RESUMO DO CENÁRIO CONFIGURADO NA HOME */}
              <div className="bg-[#FAF7F0] border border-stone-300/80 rounded-2xl p-5 mb-8 shadow-sm">
                <div className="flex items-center justify-between border-b border-stone-200/80 pb-3 mb-4">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    Cenário configurado no simulador
                  </span>
                  <Link
                    href="/"
                    className="text-xs text-[#2B6E76] font-medium hover:underline flex items-center gap-1"
                  >
                    <ArrowLeft size={11} /> Voltar à calculadora
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center mb-3">
                  <div className="bg-white/90 p-3 rounded-xl border border-stone-200/60">
                    <span className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                      Patrimônio Hoje
                    </span>
                    <strong className="text-sm sm:text-base font-semibold text-[#123044]">
                      {money(input.initial)}
                    </strong>
                  </div>
                  <div className="bg-white/90 p-3 rounded-xl border border-stone-200/60">
                    <span className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                      Aporte Mensal
                    </span>
                    <strong className="text-sm sm:text-base font-semibold text-[#123044]">
                      {money(input.monthly)}
                    </strong>
                  </div>
                  <div className="bg-white/90 p-3 rounded-xl border border-stone-200/60">
                    <span className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                      Renda Alvo
                    </span>
                    <strong className="text-sm sm:text-base font-semibold text-[#2B6E76]">
                      {money(input.income)}<span className="text-[10px] font-normal text-stone-400">/mês</span>
                    </strong>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200/60 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-600">
                  <span>
                    Inflação: <strong>{input.inflation === HISTORICAL_IGPM ? 'IGP-M (7,02% a.a.)' : 'IPCA (5,14% a.a.)'}</strong>
                  </span>
                  <span>
                    Carteira: <strong>{profile} ({selected?.name})</strong>
                  </span>
                  <span>
                    Meta estimada: <strong className="text-[#123044]">{money(base.target)}</strong> ({duration(base.months)})
                  </span>
                </div>
              </div>

              {/* FORMULÁRIO PRINCIPAL */}
              <div className="bg-[#FBFAF5] border border-stone-300/80 rounded-2xl p-6 sm:p-8 shadow-sm">
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  {leadSubmitError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                      <AlertCircle size={15} className="shrink-0" />
                      <span>{leadSubmitError}</span>
                    </div>
                  )}

                  {/* Nome Completo */}
                  <div>
                    <label className="block text-xs font-semibold text-[#123044] uppercase tracking-wider mb-1.5">
                      Seu nome completo *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <User size={16} />
                      </div>
                      <input
                        type="text"
                        placeholder="Ex: Lucas de Matos"
                        value={leadForm.name}
                        onChange={e => setLeadForm({ ...leadForm, name: e.target.value })}
                        className={`w-full pl-10 pr-4 py-3 bg-white border ${leadErrors.name ? 'border-red-400 ring-2 ring-red-100' : 'border-stone-300'} rounded-xl text-sm text-[#123044] placeholder:text-stone-400 focus:outline-none focus:border-[#2B6E76] focus:ring-2 focus:ring-[#2B6E76]/20 transition`}
                      />
                    </div>
                    {leadErrors.name && (
                      <p className="text-xs text-red-600 mt-1">{leadErrors.name}</p>
                    )}
                  </div>

                  {/* E-mail */}
                  <div>
                    <label className="block text-xs font-semibold text-[#123044] uppercase tracking-wider mb-1.5">
                      Seu melhor e-mail *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <Mail size={16} />
                      </div>
                      <input
                        type="email"
                        placeholder="seu@email.com"
                        value={leadForm.email}
                        onChange={e => setLeadForm({ ...leadForm, email: e.target.value })}
                        className={`w-full pl-10 pr-4 py-3 bg-white border ${leadErrors.email ? 'border-red-400 ring-2 ring-red-100' : 'border-stone-300'} rounded-xl text-sm text-[#123044] placeholder:text-stone-400 focus:outline-none focus:border-[#2B6E76] focus:ring-2 focus:ring-[#2B6E76]/20 transition`}
                      />
                    </div>
                    {leadErrors.email && (
                      <p className="text-xs text-red-600 mt-1">{leadErrors.email}</p>
                    )}
                  </div>

                  {/* WhatsApp / Telefone */}
                  <div>
                    <label className="block text-xs font-semibold text-[#123044] uppercase tracking-wider mb-1.5">
                      WhatsApp ou celular com DDD *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <Phone size={16} />
                      </div>
                      <input
                        type="tel"
                        placeholder="(11) 99999-9999"
                        value={leadForm.phone}
                        onChange={e => setLeadForm({ ...leadForm, phone: maskPhone(e.target.value) })}
                        className={`w-full pl-10 pr-4 py-3 bg-white border ${leadErrors.phone ? 'border-red-400 ring-2 ring-red-100' : 'border-stone-300'} rounded-xl text-sm text-[#123044] placeholder:text-stone-400 focus:outline-none focus:border-[#2B6E76] focus:ring-2 focus:ring-[#2B6E76]/20 transition`}
                      />
                    </div>
                    {leadErrors.phone && (
                      <p className="text-xs text-red-600 mt-1">{leadErrors.phone}</p>
                    )}
                  </div>

                  {/* Consentimento */}
                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-stone-600 leading-snug">
                      <input
                        type="checkbox"
                        checked={leadForm.marketingConsent}
                        onChange={e => setLeadForm({ ...leadForm, marketingConsent: e.target.checked })}
                        className="mt-0.5 rounded border-stone-300 text-[#2B6E76] focus:ring-[#2B6E76]"
                      />
                      <span>
                        Concordo em receber meu diagnóstico personalizado e comunicações de orientação patrimonial da ARVO.
                      </span>
                    </label>
                  </div>

                  {/* Botão de Envio */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={submittingLead}
                      className="w-full ui-btn ui-btn-primary py-3.5 text-base font-semibold shadow-md shadow-[#2B6E76]/20 flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.99] transition"
                    >
                      {submittingLead ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Gerando seu relatório e registrando...</span>
                        </>
                      ) : (
                        <>
                          <span>Liberar Meu Relatório Completo & PDF</span>
                          <ArrowRight size={17} />
                        </>
                      )}
                    </button>
                  </div>

                  {leadForm.name && leadForm.email && (
                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsRegistered(true);
                          sessionStorage.setItem('arvo-diagnostic-view', 'report');
                        }}
                        className="text-xs text-[#2B6E76] hover:underline"
                      >
                        Já preencheu como <strong>{leadForm.name}</strong>? Acessar relatório diretamente →
                      </button>
                    </div>
                  )}
                </form>

                {/* Selos de Confiança */}
                <div className="mt-6 pt-5 border-t border-stone-200/80 flex flex-wrap items-center justify-center gap-4 text-stone-500 text-xs text-center">
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-[#4FA080]" /> Dados protegidos (LGPD)
                  </span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Lock size={13} className="text-[#4FA080]" /> 100% Fee-Only sem conflito
                  </span>
                  <span>·</span>
                  <span>Sem spam</span>
                </div>
              </div>

            </div>
          </section>
        ) : (
          /* ========================================================================= */
          /* RELATÓRIO COMPLETO COM PREMISSAS ABERTAS E EM EVIDÊNCIA NO TOPO            */
          /* ========================================================================= */
          <>
            {/* BARRA SUPERIOR DE AÇÕES RÁPIDAS DO RELATÓRIO */}
            <div className="bg-[#FAF7F0] border-b border-stone-200 px-6 py-4 no-print">
              <div className="ui-wrap flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <div className="text-[11px] text-stone-500 uppercase tracking-wider">Relatório Gerado para</div>
                    <div className="text-sm font-bold text-[#123044]">{leadForm.name || 'Titular'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setIsRegistered(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="ui-btn ui-btn-outline text-xs py-2 px-3.5 rounded-full flex items-center gap-1.5"
                  >
                    <User size={13} />
                    <span>Alterar dados cadastrais</span>
                  </button>

                  <button
                    onClick={() => setShowAdjustPanel(v => !v)}
                    className="ui-btn ui-btn-outline text-xs py-2 px-3.5 rounded-full flex items-center gap-1.5"
                  >
                    <SlidersHorizontal size={13} />
                    <span>{showAdjustPanel ? 'Ocultar Premissas' : 'Ajustar Premissas'}</span>
                    {showAdjustPanel ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>

                  <button
                    onClick={download}
                    disabled={busy}
                    className="ui-btn ui-btn-primary text-xs py-2 px-4 rounded-full shadow-sm flex items-center gap-2"
                  >
                    <Download size={14} />
                    <span>{busy ? 'Gerando PDF Oficial...' : 'Baixar Relatório em PDF'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* ESTÚDIO GAMIFICADO DE PREMISSAS & ACELERADOR DE INDEPENDÊNCIA (JÁ ABERTO)  */}
            {/* ========================================================================= */}
            {showAdjustPanel && (
              <section className="bg-gradient-to-b from-[#F5F2EA] to-[#EFECE2] border-b border-stone-300 py-10 px-4 sm:px-6 no-print">
                <div className="ui-wrap max-w-[1040px] space-y-8">
                  
                  {/* HEADER EDITORIAL ARVO */}
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                      <div className="ui-eyebrow mb-2.5">
                        <span className="ui-eyebrow-dot"></span>
                        <span>SIMULAÇÃO E PREMISSAS DO PLANEJAMENTO</span>
                      </div>
                      <h2 className="ui-serif text-3xl sm:text-4xl text-[#123044] font-light leading-tight">
                        Em quanto tempo você quer<br />
                        <i className="text-[#2B6E76] font-normal">atingir sua independência financeira?</i>
                      </h2>
                      <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-2xl leading-relaxed">
                        Ajuste as variáveis abaixo e selecione uma das <strong>Carteiras Oficiais ARVO</strong> para simular o tempo até a sua meta patrimonial em tempo real.
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2 bg-white/90 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-stone-200/90 text-xs shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-[#1F674F]" />
                      <span className="text-stone-600 font-medium">Sincronizado ao vivo</span>
                    </div>
                  </div>

                  {/* 1. SELETOR DE CARTEIRAS */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Target size={14} className="text-[#2B6E76]" />
                        <span>Passo 1: Compare o Prazo das Carteiras Modelo</span>
                      </span>
                      <span className="text-[11px] text-stone-500 hidden sm:inline">
                        Selecione cada carteira para comparar o horizonte até a meta
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                      
                      {/* CARD BENCHMARK: INVESTIMENTO TRADICIONAL DE BANCO */}
                      <div className="bg-[#F4F1EA] border border-stone-200/90 rounded-2xl p-4 flex flex-col justify-between opacity-90 hover:opacity-100 transition relative">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[9.5px] font-semibold uppercase tracking-wider text-stone-500 bg-stone-200/70 px-2 py-0.5 rounded-full">
                              Referência de Mercado
                            </span>
                          </div>
                          <h4 className="ui-serif font-bold text-sm text-stone-700 mb-0.5">
                            Banco Tradicional
                          </h4>
                          <span className="text-[11px] text-stone-500 block mb-2">
                            Poupança / CDB Balcão (~2,5% real a.a.)
                          </span>
                        </div>

                        <div className="pt-2.5 border-t border-stone-200/80">
                          <span className="text-[10px] uppercase text-stone-400 block font-medium">Tempo até a meta:</span>
                          <strong className="text-base font-semibold text-stone-600 block">
                            {duration(benchmarkProj.months)}
                          </strong>
                          <span className="text-[11.5px] text-stone-400 mt-0.5 block font-medium">
                            {benchmarkYear ? `Ano ~${benchmarkYear}` : 'Além de 60 anos'}
                          </span>
                        </div>
                      </div>

                      {/* OS 4 CARDS DAS CARTEIRAS ARVO (ABRIGO, RITMO, VISÃO E OCEANO) */}
                      {arvoPortfoliosData.map((d) => {
                        const isSelected = selectedModelName === d.name;

                        return (
                          <button
                            key={d.name}
                            type="button"
                            onClick={() => {
                              setSelectedModelName(d.name);
                              setProfile(d.profile);
                            }}
                            className={`text-left p-4 rounded-2xl border transition-all relative flex flex-col justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-[#F7FAF8] border-2 border-[#2B6E76] shadow-sm ring-2 ring-[#2B6E76]/15 scale-[1.01]'
                                : 'bg-[#FBFAF5] border-stone-200/90 hover:border-[#2B6E76]/50 hover:shadow-xs'
                            }`}
                          >
                            {/* Badges de destaque discretos e elegantes */}
                            {d.badge === 'MAIS ESCOLHIDA' && (
                              <div className="absolute -top-2.5 right-3 bg-[#1F674F] text-white text-[9.5px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                                <Sparkles size={10} /> Mais Escolhida
                              </div>
                            )}
                            {d.badge === 'MÁXIMA VELOCIDADE' && (
                              <div className="absolute -top-2.5 right-3 bg-[#C08A34] text-white text-[9.5px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                                Maior Retorno
                              </div>
                            )}

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="ui-serif text-sm font-bold text-[#123044]">
                                  Carteira {d.name}
                                </span>
                                <span className="text-[10.5px] px-2 py-0.5 rounded bg-[#E8F1ED] text-[#1F674F] font-semibold">
                                  {pct(d.rate)} real a.a.
                                </span>
                              </div>
                              <span className="text-[11px] block mb-3 text-stone-500">
                                {d.profileLabel}
                              </span>
                            </div>

                            <div className="pt-2.5 border-t border-stone-100">
                              <span className="text-[10px] uppercase block text-stone-400 font-medium">
                                Meta alcançada em:
                              </span>
                              <strong className="text-lg font-semibold block text-[#123044] tracking-tight">
                                {duration(d.proj.months)}
                              </strong>
                              <span className="text-xs font-semibold mt-0.5 block text-[#2B6E76]">
                                {d.targetYear ? `Ano ~${d.targetYear}` : 'Em análise'}
                              </span>

                              {/* Selo de anos economizados */}
                              {d.yearsSaved > 0 && (
                                <div className="mt-2.5 py-1 px-2 rounded-lg text-[11px] font-semibold flex items-center gap-1 bg-[#E8F1ED] text-[#1F674F]">
                                  <span>Economiza {d.yearsSaved} anos vs banco</span>
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}

                    </div>
                  </div>

                  {/* 2. O PLACAR DA CONQUISTA (HERO IMPACT CARD EM ESTILO EDITORIAL ARVO) */}
                  <div className="bg-[#FBFAF5] p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-stone-200/90 shadow-sm">
                    <div className="relative z-10 space-y-6">
                      
                      {/* Linha 1: Métricas de Alto Impacto */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                        
                        {/* Métrica 1: Ano da Conquista */}
                        <div>
                          <span className="text-[11px] font-semibold uppercase tracking-wider block mb-1 text-[#2B6E76]">
                            ANO DA SUA INDEPENDÊNCIA
                          </span>
                          <div className="flex items-baseline gap-2">
                            <strong className="text-4xl sm:text-5xl font-light text-[#123044] tracking-tight">
                              {activePortfolioData.targetYear ?? '2060+'}
                            </strong>
                            <span className="text-xs sm:text-sm text-stone-500 font-normal">
                              (~{Math.ceil((activePortfolioData.proj.months ?? 0)/12)} anos)
                            </span>
                          </div>
                          <span className="text-xs text-stone-600 mt-1.5 block">
                            com a <strong>Carteira {activePortfolioData.name} ({activePortfolioData.profileLabel})</strong>
                          </span>
                        </div>

                        {/* Métrica 2: Diferença no Horizonte (Estilo Editorial ARVO) */}
                        <div className="bg-[#E8F1ED] rounded-2xl p-4 sm:p-5 border border-[#C2DDD0]">
                          <span className="text-[11px] font-semibold uppercase tracking-wider block mb-1 text-[#1F674F]">
                            DIFERENÇA ESTIMADA DE PRAZO
                          </span>
                          <div className="flex items-baseline gap-1.5 text-[#1F674F]">
                            <strong className="text-3xl sm:text-4xl font-light tracking-tight">
                              {activePortfolioData.yearsSaved > 0 ? activePortfolioData.yearsSaved : 0}
                            </strong>
                            <span className="text-sm sm:text-base font-medium">anos a menos</span>
                          </div>
                          <span className="text-xs text-stone-600 mt-1.5 block leading-relaxed">
                            Você atinge a meta antes de quem mantém recursos no banco tradicional ({benchmarkYear ?? '2060+'}).
                          </span>
                        </div>

                        {/* Métrica 3: Renda & Patrimônio */}
                        <div>
                          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
                            PATRIMÔNIO & RENDA FUTURA
                          </span>
                          <strong className="text-2xl sm:text-3xl font-light text-[#123044] block tracking-tight">
                            {money(base.target)}
                          </strong>
                          <span className="text-xs text-stone-600 mt-1.5 block">
                            Gera <strong>{money(input.income)}/mês</strong> em poder de compra de hoje
                          </span>
                        </div>

                      </div>

                      {/* Linha 2: Barra Visual da Linha do Tempo (Comparativo ARVO vs Banco) */}
                      <div className="bg-[#F4F1EA] rounded-2xl p-4 sm:p-5 border border-stone-200/80 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-stone-700">
                            Comparativo de tempo até a meta:
                          </span>
                          <span className="font-semibold text-[#1F674F] text-xs">
                            {activePortfolioData.yearsSaved > 0 
                              ? `${activePortfolioData.yearsSaved} anos de antecipação com a ARVO`
                              : 'Meta calculada'}
                          </span>
                        </div>

                        {/* Visual Timeline Bar */}
                        <div className="relative pt-6 pb-2">
                          <div className="h-2 bg-stone-200 rounded-full overflow-hidden relative">
                            {/* Trecho ganho com a ARVO */}
                            <div 
                              className="h-full bg-gradient-to-r from-[#4FA080] to-[#2B6E76] rounded-full transition-all duration-700"
                              style={{ 
                                width: benchmarkProj.months 
                                  ? `${Math.min(100, Math.max(15, ((activePortfolioData.proj.months ?? 0) / benchmarkProj.months) * 100))}%` 
                                  : '50%' 
                              }}
                            />
                          </div>

                          {/* Marcadores */}
                          <div className="flex justify-between items-center text-xs mt-3 text-stone-600 font-medium">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#123044]" />
                              <span>Hoje ({new Date().getFullYear()})</span>
                            </div>

                            <div className="flex items-center gap-1.5 font-semibold text-[#1F674F]">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#1F674F]" />
                              <span>Meta ARVO ({activePortfolioData.targetYear})</span>
                            </div>

                            <div className="flex items-center gap-1.5 text-stone-400">
                              <span className="w-2 h-2 rounded-full bg-stone-400" />
                              <span>Banco Tradicional ({benchmarkYear ?? '2060+'})</span>
                            </div>
                          </div>
                        </div>

                        {/* Chamada sutil de metodologia */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-stone-200/80 text-xs">
                          <span className="text-stone-600">
                            <strong className="text-[#123044]">Metodologia Fee-Only:</strong> consultoria independente, sem taxas abusivas e com foco na rentabilidade real da sua carteira.
                          </span>
                          <a
                            href="/register"
                            className="ui-btn ui-btn-primary py-2 px-4 rounded-full font-medium text-xs whitespace-nowrap shadow-xs hover:shadow flex items-center gap-1.5 transition"
                            style={{ backgroundColor: '#2B6E76', color: '#FFFFFF' }}
                          >
                            <span>Começar acompanhamento ARVO</span>
                            <ArrowRight size={13} />
                          </a>
                        </div>

                      </div>

                    </div>
                  </div>

                  {/* 3. SLIDERS & CONTROLES FINANCEIROS (ESTILO EDITORIAL ARVO) */}
                  <div className="bg-white border border-stone-300/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                    
                    <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                      <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                        <SlidersHorizontal size={14} className="text-[#2B6E76]" />
                        <span>Passo 2: Ajuste as Premissas do Seu Planejamento</span>
                      </span>
                      <span className="text-[11px] text-stone-500 font-medium hidden sm:inline">
                        Arraste ou use os botões rápidos
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Input 1: Aporte Mensal */}
                      <div className="bg-[#FAF8F2] p-5 rounded-2xl border border-stone-200/90 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs sm:text-sm font-semibold text-stone-800">
                            Quanto você aporta por mês?
                          </label>
                          <div className="flex items-center gap-1 font-sans font-semibold text-[#123044] text-base sm:text-lg bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-xs">
                            <span className="text-xs text-stone-400 font-normal">R$</span>
                            <CurrencyInputField
                              value={input.monthly}
                              onChange={val => update('monthly', Math.max(0, val))}
                              className="w-32 text-right outline-none font-semibold text-[#123044] bg-transparent"
                              min={0}
                              max={100000}
                            />
                          </div>
                        </div>

                        <input
                          type="range"
                          min="0"
                          max="30000"
                          step="200"
                          value={Math.min(30000, input.monthly)}
                          onChange={e => update('monthly', Number(e.target.value))}
                          className="w-full accent-[#2B6E76] cursor-pointer"
                        />

                        {/* Chips de Aporte Extra */}
                        <div className="pt-2">
                          <span className="text-[11px] font-semibold text-stone-600 block mb-1.5">
                            Simular aporte mensal adicional:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {[250, 500, 1000, 2000].map(val => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => addMonthly(val)}
                                className="text-xs bg-white hover:bg-[#E8F1ED] text-stone-700 hover:text-[#1F674F] border border-stone-200 hover:border-[#1F674F]/40 font-medium py-1 px-2.5 rounded-lg transition active:scale-95 shadow-xs flex items-center gap-1"
                              >
                                <span>+{money(val)}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Input 2: Patrimônio Hoje */}
                      <div className="bg-[#FAF8F2] p-5 rounded-2xl border border-stone-200/90 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs sm:text-sm font-semibold text-stone-800">
                            Patrimônio que já tem hoje?
                          </label>
                          <div className="flex items-center gap-1 font-sans font-semibold text-[#123044] text-base sm:text-lg bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-xs">
                            <span className="text-xs text-stone-400 font-normal">R$</span>
                            <CurrencyInputField
                              value={input.initial}
                              onChange={val => update('initial', Math.max(0, val))}
                              className="w-36 text-right outline-none font-semibold text-[#123044] bg-transparent"
                              min={0}
                              max={10000000}
                            />
                          </div>
                        </div>

                        <input
                          type="range"
                          min="0"
                          max="2000000"
                          step="5000"
                          value={Math.min(2000000, input.initial)}
                          onChange={e => update('initial', Number(e.target.value))}
                          className="w-full accent-[#2B6E76] cursor-pointer"
                        />

                        {/* Quick Chips para Patrimônio */}
                        <div className="pt-2">
                          <span className="text-[11px] font-semibold text-stone-600 block mb-1.5">
                            Atalhos rápidos:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {[0, 50000, 100000, 250000, 500000].map(val => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => setInitialQuick(val)}
                                className={`text-xs border font-medium py-1 px-2.5 rounded-lg transition active:scale-95 shadow-xs ${
                                  input.initial === val 
                                    ? 'bg-[#2B6E76] text-white border-[#2B6E76]' 
                                    : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
                                }`}
                              >
                                <span>{val === 0 ? 'Zero' : money(val)}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Input 3 & Cenário de Inflação */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      
                      {/* Renda Desejada */}
                      <div className="bg-[#FAF8F2] p-5 rounded-2xl border border-stone-200/90 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs sm:text-sm font-semibold text-stone-800">
                            Renda mensal desejada no futuro:
                          </label>
                          <div className="flex items-center gap-1 font-sans font-semibold text-[#2B6E76] text-base sm:text-lg bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-xs">
                            <span className="text-xs text-stone-400 font-normal">R$</span>
                            <CurrencyInputField
                              value={input.income}
                              onChange={val => update('income', Math.max(500, val))}
                              className="w-32 text-right outline-none font-semibold text-[#2B6E76] bg-transparent"
                              min={500}
                              max={150000}
                            />
                          </div>
                        </div>

                        <input
                          type="range"
                          min="1000"
                          max="50000"
                          step="500"
                          value={Math.min(50000, input.income)}
                          onChange={e => update('income', Number(e.target.value))}
                          className="w-full accent-[#2B6E76] cursor-pointer"
                        />

                        {/* Quick Chips para Renda */}
                        <div className="pt-2">
                          <span className="text-[11px] font-semibold text-stone-600 block mb-1.5">
                            Renda pretendida:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {[5000, 10000, 15000, 25000].map(val => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => setIncomeQuick(val)}
                                className={`text-xs border font-medium py-1 px-2.5 rounded-lg transition active:scale-95 shadow-xs ${
                                  input.income === val 
                                    ? 'bg-[#2B6E76] text-white border-[#2B6E76]' 
                                    : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
                                }`}
                              >
                                <span>{money(val)}/mês</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Inflação e Regra de Retirada */}
                      <div className="bg-[#FAF8F2] p-5 rounded-2xl border border-stone-200/90 flex flex-col justify-between space-y-3">
                        <div>
                          <label className="text-xs sm:text-sm font-semibold text-stone-800 block mb-2">
                            Índice de Inflação da Projeção:
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => update('inflation', HISTORICAL_INFLATION)}
                              className={`p-2.5 rounded-xl border text-xs font-semibold transition ${
                                input.inflation === HISTORICAL_INFLATION
                                  ? 'bg-[#2B6E76] text-white border-[#2B6E76] shadow-xs'
                                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                              }`}
                            >
                              <span>IPCA (5,14% a.a.)</span>
                              <span className="block text-[10px] opacity-80 font-normal">Consumo familiar</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => update('inflation', HISTORICAL_IGPM)}
                              className={`p-2.5 rounded-xl border text-xs font-semibold transition ${
                                input.inflation === HISTORICAL_IGPM
                                  ? 'bg-[#2B6E76] text-white border-[#2B6E76] shadow-xs'
                                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                              }`}
                            >
                              <span>IGP-M (7,02% a.a.)</span>
                              <span className="block text-[10px] opacity-80 font-normal">Aluguel / Atacado</span>
                            </button>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-stone-200/80 flex items-center justify-between text-xs">
                          <label className="flex items-center gap-2 cursor-pointer text-stone-700 select-none">
                            <input
                              type="checkbox"
                              checked={input.indexed}
                              onChange={e => update('indexed', e.target.checked)}
                              className="rounded text-[#2B6E76] focus:ring-[#2B6E76]"
                            />
                            <span>Reajustar aportes pela inflação ao ano</span>
                          </label>

                          <span className="text-[11px] text-stone-500">
                            Regra: <strong>{withdrawalMode === 'fixed' ? '4% a.a.' : `${pct(realRate)}`}</strong>
                          </span>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>
              </section>
            )}

            {downloadError && (
              <div className="bg-red-50 border border-red-200 p-3 text-xs text-red-700 text-center no-print">
                {downloadError}
              </div>
            )}

            {/* CAPA DO MAPA DE INDEPENDÊNCIA */}
            <section className="ui-section pt-8 sm:pt-12 pb-10">
              <div className="ui-wrap">
                <div className="ui-eyebrow mb-4">
                  <span className="ui-eyebrow-dot"></span>
                  SEU MAPA DE INDEPENDÊNCIA · DIAGNÓSTICO EXCLUSIVO
                </div>

                <h1 className="ui-serif text-3xl sm:text-5xl text-[#123044] mb-3 leading-[1.15]">
                  O futuro que você quer<br />
                  <i className="text-[#2B6E76] font-normal">começa com um plano.</i>
                </h1>

                <p className="text-stone-600 text-base sm:text-lg max-w-2xl mb-8 leading-relaxed">
                  {leadForm.name ? `${leadForm.name.split(' ')[0]}, este é o seu ponto de partida.` : 'Você já deu o primeiro passo.'} Veja quanto precisa acumular, o que pode mudar seu prazo e como preservar seu poder de compra.
                </p>

                {/* 3 Métricas do Titular */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="bg-[#FBFAF5] border border-stone-200/80 p-5 rounded-2xl">
                    <span className="text-[10.5px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
                      SEU PATRIMÔNIO HOJE
                    </span>
                    <strong className="text-2xl sm:text-3xl font-light text-[#123044] tracking-tight">
                      {money(input.initial)}
                    </strong>
                  </div>

                  <div className="bg-[#FBFAF5] border border-stone-200/80 p-5 rounded-2xl">
                    <span className="text-[10.5px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
                      SEU APORTE MENSAL
                    </span>
                    <strong className="text-2xl sm:text-3xl font-light text-[#123044] tracking-tight">
                      {money(input.monthly)}
                    </strong>
                  </div>

                  <div className="bg-[#FBFAF5] border border-stone-200/80 p-5 rounded-2xl">
                    <span className="text-[10.5px] font-semibold text-[#2B6E76] uppercase tracking-wider block mb-1">
                      RENDA MENSAL DESEJADA
                    </span>
                    <strong className="text-2xl sm:text-3xl font-light text-[#2B6E76] tracking-tight">
                      {money(input.income)}
                    </strong>
                    <span className="block text-xs text-stone-400 mt-1">em poder de compra de hoje</span>
                  </div>
                </div>

                {/* Cartões de Resultados em Destaque (Design Editorial ARVO) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Card 1: Meta de Patrimônio */}
                  <div className="bg-[#FBFAF5] border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden border-t-4 border-t-[#2B6E76]">
                    <span className="text-[11px] font-semibold text-[#2B6E76] uppercase tracking-wider block mb-2">
                      META DE PATRIMÔNIO NECESSÁRIO
                    </span>
                    <strong className="ui-serif text-3xl sm:text-4xl font-normal text-[#123044] tracking-tight block mb-2">
                      {money(base.target)}
                    </strong>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Calculado para uma retirada inicial sustentável de {pct(input.withdrawal)} ao ano (valores de hoje em poder de compra).
                    </p>
                  </div>

                  {/* Card 2: Prazo Condicional */}
                  <div className="bg-[#FBFAF5] border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden border-t-4 border-t-[#4FA080]">
                    <span className="text-[11px] font-semibold text-[#4FA080] uppercase tracking-wider block mb-2">
                      {selected ? selected.name : 'Referência'} · {pct(realRate)} REAIS A.A.
                    </span>
                    <strong className="ui-serif text-3xl sm:text-4xl font-normal text-[#123044] tracking-tight block mb-2">
                      {duration(base.months)}
                    </strong>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Prazo estimado considerando a taxa real anualizada da carteira {selected?.name ?? profile}. Não é previsão nem garantia.
                    </p>
                  </div>
                </div>

                <p className="text-[11px] text-stone-500 mt-4 leading-relaxed">
                  💡 Simulação educativa de acumulação patrimonial. A regra dos 4% é uma convenção de planejamento que não garante renda vitalícia. Custos de corretagem e tributação exclusiva não deduzidos.
                </p>
              </div>
            </section>

            {/* SEÇÃO 01: CLAREZA SOBRE O TEMPO */}
            <section className="ui-section">
              <div className="ui-wrap">
                <div className="ui-eyebrow mb-3">
                  <span className="ui-eyebrow-dot"></span>
                  01 / CLAREZA SOBRE O TEMPO
                </div>

                <h2 className="ui-serif text-2xl sm:text-3xl text-[#123044] mb-3">
                  Seu dinheiro cresce.<br />
                  <i className="text-[#2B6E76] font-normal">Seu objetivo também tem um custo.</i>
                </h2>

                <p className="text-stone-600 text-sm sm:text-base max-w-2xl mb-6">
                  Em 20 anos, {money(input.income)} por mês precisariam ser <strong className="text-[#123044]">{money(input.income * f20)}</strong> para manter o mesmo poder de compra, se a inflação média for {pct(input.inflation)} ao ano.
                </p>

                {/* 3 Métricas para 20 anos */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 bg-white/70 p-4 sm:p-5 rounded-2xl border border-stone-200">
                  <div>
                    <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
                      PATRIMÔNIO EM 20 ANOS
                    </span>
                    <strong className="text-xl sm:text-2xl font-light text-[#123044] block">
                      {money(p20.nominal)}
                    </strong>
                    <span className="text-[11px] text-stone-400">valor nominal (moeda do futuro)</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
                      PODER DE COMPRA EQUIVALENTE
                    </span>
                    <strong className="text-xl sm:text-2xl font-light text-[#2B6E76] block">
                      {money(p20.real)}
                    </strong>
                    <span className="text-[11px] text-stone-400">em reais de hoje</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
                      RETIRADA MENSAL ESTIMADA
                    </span>
                    <strong className="text-xl sm:text-2xl font-light text-[#123044] block">
                      {money(p20.real * input.withdrawal / 12)}
                    </strong>
                    <span className="text-[11px] text-stone-400">com regra de {pct(input.withdrawal)} a.a.</span>
                  </div>
                </div>

                {/* Gráfico da Curva */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 mb-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
                      Curva de Evolução do Patrimônio (40 Anos)
                    </span>
                    <button
                      onClick={() => setNominal(v => !v)}
                      className="ui-btn ui-btn-outline text-xs py-1.5 px-3 rounded-full no-print"
                    >
                      {nominal ? 'Ver em reais de hoje (descontado inflação)' : 'Ver em reais futuros nominais'}
                    </button>
                  </div>
                  <Curve series={[{ name: 'Patrimônio', color: '#2B6E76', points: base.points }]} target={base.target} nominal={nominal} />
                </div>

                {/* Tabela de Horizontes */}
                <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white mb-4">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-[#FAF7F0] border-b border-stone-200 text-stone-600 font-semibold">
                        <th className="py-3 px-4">Horizonte</th>
                        <th className="py-3 px-4">Renda Necessária no Futuro</th>
                        <th className="py-3 px-4">Patrimônio Nominal Projetado</th>
                        <th className="py-3 px-4">Patrimônio em Reais de Hoje</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-[#123044]">
                      {[5, 10, 20, 30, 40].map(y => (
                        <tr key={y} className="hover:bg-stone-50/60 transition">
                          <td className="py-2.5 px-4 font-semibold">{y} anos</td>
                          <td className="py-2.5 px-4">{money(input.income * Math.pow(1 + input.inflation, y))}</td>
                          <td className="py-2.5 px-4 font-medium">{money(base.points[y].nominal)}</td>
                          <td className="py-2.5 px-4 font-medium text-[#2B6E76] font-semibold">{money(base.points[y].real)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-[11px] text-stone-400">
                  Premissas: retorno real de {pct(realRate)} a.a., aportes corrigidos mensalmente pelo IPCA de {pct(input.inflation)} a.a.
                </p>
              </div>
            </section>

            {/* SEÇÃO 02: CAMINHOS POSSÍVEIS (CARTEIRAS ARVO) */}
            <section className="ui-section">
              <div className="ui-wrap">
                <div className="ui-eyebrow mb-3">
                  <span className="ui-eyebrow-dot"></span>
                  02 / CAMINHOS POSSÍVEIS
                </div>

                <h2 className="ui-serif text-2xl sm:text-3xl text-[#123044] mb-3">
                  Uma meta.<br />
                  <i className="text-[#2B6E76] font-normal">Diferentes trajetórias.</i>
                </h2>

                <p className="text-stone-600 text-sm sm:text-base max-w-2xl mb-6">
                  A comparação abaixo utiliza dados consolidados da <strong>Planilha Oficial ARVO</strong>, com os pesos vigentes aplicados aos retornos mensais de janeiro de 2023 a agosto de 2026.
                </p>

                {/* Gráfico Comparativo */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 mb-4 shadow-sm">
                  <div className="text-xs font-semibold text-stone-600 uppercase tracking-wider mb-3">
                    Trajetórias das Carteiras Oficiais até a Meta
                  </div>
                  <Curve series={series} target={base.target} />
                  <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-stone-100 text-xs">
                    {series.map(s => (
                      <span key={s.name} className="flex items-center gap-1.5 text-stone-700">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tabela de Carteiras ARVO */}
                <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white mb-5">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-[#FAF7F0] border-b border-stone-200 text-stone-600 font-semibold">
                        <th className="py-3 px-4">Carteira</th>
                        <th className="py-3 px-4">Retorno Real Anualizado¹</th>
                        <th className="py-3 px-4">Prazo se a taxa se repetir</th>
                        <th className="py-3 px-4">Prazo com -3 p.p. (estresse)²</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-[#123044]">
                      {portfolios.map(p => (
                        <tr key={p.id} className="hover:bg-stone-50/60 transition">
                          <td className="py-2.5 px-4 font-semibold flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PORTFOLIO_COLORS[p.name] || '#2B6E76' }} />
                            {p.name}
                          </td>
                          {p.pendingIdentity ? (
                            <td colSpan={3} className="py-2.5 px-4 text-stone-400 italic">Dados em validação. Prazo indisponível.</td>
                          ) : (
                            <>
                              <td className="py-2.5 px-4 font-medium text-[#2B6E76]">{pct(p.annualReal!)}</td>
                              <td className="py-2.5 px-4 font-medium">{duration(project(input, p.annualReal!).months)}</td>
                              <td className="py-2.5 px-4 text-stone-500">{duration(project(input, p.annualReal! - 0.03).months)}</td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Callout de Alerta */}
                <div className="bg-[#FAF5EA] border-l-4 border-[#C08A34] p-4 sm:p-5 rounded-r-2xl text-xs sm:text-sm text-stone-700">
                  <strong className="block text-[#123044] font-semibold mb-1">
                    💡 O menor prazo não escolhe a carteira por você.
                  </strong>
                  <p className="leading-relaxed">
                    <strong>Abrigo</strong> prioriza preservação; <strong>Ritmo</strong> equilibra renda fixa e variáveis; <strong>Visão</strong> busca crescimento com mais oscilação; <strong>Oceano</strong> exige alta tolerância a volatilidade. Seu perfil e sua capacidade emocional de suportar perdas determinam a escolha ideal.
                  </p>
                </div>
              </div>
            </section>

            {/* SEÇÃO 03: O QUE ESTÁ AO SEU ALCANCE */}
            <section className="ui-section">
              <div className="ui-wrap">
                <div className="ui-eyebrow mb-3">
                  <span className="ui-eyebrow-dot"></span>
                  03 / O QUE ESTÁ AO SEU ALCANCE
                </div>

                <h2 className="ui-serif text-2xl sm:text-3xl text-[#123044] mb-3">
                  Pequenas decisões.<br />
                  <i className="text-[#2B6E76] font-normal">Efeitos que se acumulam.</i>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">
                  <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#2B6E76] tracking-wider block mb-2">01</span>
                      <h3 className="font-semibold text-base text-[#123044] mb-2">Seu aporte é uma alavanca</h3>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        Com mais <strong className="text-[#123044]">{money(input.monthly * 0.2)}</strong> por mês (+20%), o prazo de referência reduziria de <strong>{duration(base.months)}</strong> para <strong>{duration(more.months)}</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#2B6E76] tracking-wider block mb-2">02</span>
                      <h3 className="font-semibold text-base text-[#123044] mb-2">A inflação corrói o esforço</h3>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        Sem reajustar os {money(input.monthly)}, em 20 anos seu poder de aporte equivaleria a apenas <strong className="text-[#123044]">{money(input.monthly / f20)}</strong> de hoje. Manter a correção preserva sua velocidade.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#2B6E76] tracking-wider block mb-2">03</span>
                      <h3 className="font-semibold text-base text-[#123044] mb-2">Rendimento não é retirada</h3>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        Em 20 anos, {money(p20.contributed)} serão capital guardado e {money(p20.real - p20.contributed)} ganho real acumulado. A fase de usufruto exige blindagem contra volatilidade de sequência.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SEÇÃO 04: O MÉTODO ARVO */}
            <section className="ui-section">
              <div className="ui-wrap">
                <div className="ui-eyebrow mb-3">
                  <span className="ui-eyebrow-dot"></span>
                  04 / MÉTODO QUE CONTINUA DEPOIS DO PDF
                </div>

                <h2 className="ui-serif text-2xl sm:text-3xl text-[#123044] mb-3">
                  Planejar é um processo.<br />
                  <i className="text-[#2B6E76] font-normal">Acompanhar faz parte dele.</i>
                </h2>

                <p className="text-stone-600 text-sm sm:text-base max-w-2xl mb-8">
                  O diagnóstico abre a conversa. Um planejamento financeiro completo conecta orçamento, investimentos, proteção, tributos, aposentadoria e sucessão patrimonial.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {stages.map(([title, desc], i) => (
                    <div key={title} className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 flex items-start gap-4">
                      <span className="text-xs font-bold text-[#2B6E76] bg-[#E8F1ED] w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                        0{i + 1}
                      </span>
                      <div>
                        <h4 className="font-semibold text-sm text-[#123044] mb-1">{title}</h4>
                        <p className="text-xs text-stone-600 leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SEÇÃO 05: CARD DE ASSINATURA ARVO (CONVERSÃO) */}
            <section className="py-12 no-print" id="assinatura">
              <div className="ui-wrap">
                <div 
                  className="bg-[#FBFAF5] border-2 border-[#2B6E76] rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-sm"
                >
                  <div className="max-w-2xl relative z-10 space-y-4">
                    <span 
                      className="text-xs font-semibold uppercase tracking-wider block text-[#2B6E76]"
                    >
                      SEU MAPA É O COMEÇO
                    </span>

                    <h2 
                      className="ui-serif text-3xl sm:text-4xl font-normal text-[#123044] leading-tight"
                    >
                      Você não precisa decidir tudo sozinho.
                    </h2>

                    <p 
                      className="text-sm sm:text-base text-stone-600 leading-relaxed"
                    >
                      A ARVO transforma seu diagnóstico em uma rotina contínua de planejamento: seleção e rebalanceamento de carteiras, ferramentas exclusivas e orientação personalizada sem conflito de interesses.
                    </p>

                    <div 
                      className="bg-[#F4F1EA] rounded-2xl p-6 border border-stone-200/90 flex flex-wrap items-center justify-between gap-6 my-6"
                    >
                      <div>
                        <span 
                          className="text-xs block uppercase font-semibold tracking-wider text-stone-500"
                        >
                          ACESSO COMPLETO · PLANO ANUAL
                        </span>
                        <strong 
                          className="ui-serif text-2xl sm:text-3xl font-normal block mt-1 text-[#123044]"
                        >
                          12× R$ 59,90
                        </strong>
                        <span 
                          className="text-xs text-stone-500"
                        >
                          ou R$ 599 à vista · consulte condições
                        </span>
                      </div>

                      <a
                        href="/register"
                        className="ui-btn ui-btn-primary py-3.5 px-6 font-semibold text-sm rounded-full shadow-xs hover:shadow transition"
                        style={{ color: '#FFFFFF', backgroundColor: '#2B6E76' }}
                      >
                        Começar acompanhamento ARVO →
                      </a>
                    </div>

                    <p 
                      className="text-xs flex items-center gap-1.5 text-stone-600"
                    >
                      <span>🔒 100% Fee-Only: seu patrimônio permanece no seu banco ou corretora. A ARVO não recebe comissões de produtos financeiros.</span>
                    </p>
                  </div>
                </div>
              </div>
            </section>


            {/* SEÇÃO 06: METODOLOGIA E LIMITES */}
            <section className="ui-section methodology text-xs text-stone-500">
              <div className="ui-wrap space-y-3">
                <span className="font-semibold text-stone-600 block uppercase tracking-wider">
                  TRANSPARÊNCIA / COMO LER ESTE MAPA
                </span>
                <p>
                  Emitido em {new Date().toLocaleDateString('pt-BR')}. Dados informados: patrimônio {money(input.initial)}, aporte {money(input.monthly)}, renda desejada {money(input.income)}. Inflação média: {pct(input.inflation)} a.a. Retirada inicial de {pct(input.withdrawal)} a.a. Simulação determinística com taxa e aportes constantes por até 60 anos.
                </p>
                <p>
                  Fonte interna: Planilha Oficial .xlsx, abas Geral Light - IG, Carteira IG, Carteira IQ e Dados (séries de janeiro de 2023 a agosto de 2026). Retornos passados não representam garantia de rentabilidade futura. Este relatório não substitui análise individual de suitability.
                </p>
              </div>
            </section>

            {/* FOOTER */}
            <footer className="py-6 border-t border-stone-200/80 text-xs text-stone-500">
              <div className="ui-wrap flex flex-wrap items-center justify-between gap-3">
                <span>ARVO · ORIENTAÇÃO FINANCEIRA INDEPENDENTE</span>
                <span>Seu mapa. Seu ritmo. Sua vida.</span>
              </div>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
