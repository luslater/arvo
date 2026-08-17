"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Slider } from "@/components/ui/slider"
import { ASSET_METRICS, RECOMMENDED_PORTFOLIOS, TIER_ORDER, TIER_LABEL, ITYPE_ORDER, ITYPE_LABEL } from "@/data/portfoliosData"
import { HISTORICAL_DATA } from "@/data/historicalData"
import { getRiskInterval, interpolatePortfolio, applyMinimumThreshold } from "@/lib/bussola/interpolation"
import { Compass, Sparkles, AlertTriangle, CheckCircle, Info, ArrowRight } from "lucide-react"
import Link from "next/link"

const MIN_WEIGHT_THRESHOLD = 3

export default function BussolaPage() {
    const [tier, setTier] = useState(TIER_ORDER[0] || "30k")
    const [itype, setItype] = useState(ITYPE_ORDER[0] || "Geral 360")
    const [riskPosition, setRiskPosition] = useState(50) // 0 to 100
    const [clientProfile, setClientProfile] = useState<string>("RITMO")
    const [hasDiagnosedProfile, setHasDiagnosedProfile] = useState<boolean>(false)

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch("/api/user/profile")
                if (res.ok) {
                    const data = await res.json()
                    if (data.portfolioType) {
                        const normalized = data.portfolioType.toUpperCase().replace("VISAO", "VISÃO")
                        setClientProfile(normalized)
                        setHasDiagnosedProfile(true)
                        
                        // Default position aligned to profile if first load
                        if (normalized === "ABRIGO") setRiskPosition(0)
                        else if (normalized === "RITMO") setRiskPosition(33)
                        else if (normalized === "VISÃO") setRiskPosition(66)
                        else if (normalized === "OCEANO") setRiskPosition(100)
                    }
                }
            } catch (err) {
                console.error("Error fetching client profile in Bussola:", err)
            }
        }
        fetchProfile()
    }, [])

    // Calcs
    const getMockLevel = (perfilName: string) => {
        const p = RECOMMENDED_PORTFOLIOS.find(p => p.itype === itype && p.tier === tier && p.perfil === perfilName)
        if (p) {
            return {
                name: p.perfil,
                headline: "Carteira " + p.perfil,
                assets: Object.entries(p.weights).map(([assetName, weight]) => {
                    const fund = HISTORICAL_DATA.funds.find((f: any) => f.name === assetName)
                    let assetClass = fund?.classe || "Outros"
                    if (assetClass === "Zaga") assetClass = "Renda Fixa / Caixa"
                    else if (assetClass === "Meio") assetClass = "Multimercado / Inflação"
                    else if (assetClass === "Ataque") assetClass = "Ações / Internacional"
                    
                    return {
                        class: assetClass,
                        manager: fund?.gestor || "ARVO",
                        asset: assetName,
                        weight: weight * 100,
                        eligibility: "Geral"
                    }
                })
            }
        }
        return { name: perfilName, headline: "", assets: [] }
    }

    const basePortfolios = [
        { ...getMockLevel("Abrigo"), position: 0 },
        { ...getMockLevel("Ritmo"), position: 33 },
        { ...getMockLevel("Visão"), position: 66 },
        { ...getMockLevel("Oceano"), position: 100 }
    ]
    const { from, to, factorFrom, factorTo } = getRiskInterval(riskPosition, basePortfolios)
    const isOfficial = factorFrom === 1 || factorTo === 1
    const currentName = isOfficial ? (factorFrom === 1 ? from.name : to.name) : "Transição"
    const currentHeadline = isOfficial ? (factorFrom === 1 ? from.headline : to.headline) : "Nível intermediário entre carteiras oficiais."
    
    const rawAssets = interpolatePortfolio(from.assets, to.assets, factorFrom, factorTo)
    const applicableAssets = applyMinimumThreshold(rawAssets, MIN_WEIGHT_THRESHOLD, isOfficial)

    const activeAssets = applicableAssets.filter(a => a.applicableWeight > 0)
    
    const cashTotal = activeAssets
        .filter(a => a.assetClass.includes("Caixa") || a.assetClass.includes("Selic"))
        .reduce((sum, a) => sum + a.applicableWeight, 0)

    // Agrupamento por classe
    const classGroups = activeAssets.reduce((acc, a) => {
        acc[a.assetClass] = (acc[a.assetClass] || 0) + a.applicableWeight
        return acc
    }, {} as Record<string, number>)

    const sortedClasses = Object.entries(classGroups).sort((a, b) => b[1] - a[1])

    const formatPct = (val: number) => `${Math.round(val)}%`
    const formatDecimalPct = (val: number) => `${val.toFixed(1)}%`

    // Calculando métricas de rendimento e volatilidade com base nas carteiras oficiais base
    const calcMetrics = (assets: any[]) => {
        let ret = 0, vol = 0, weightTotal = 0;
        const metricKeys = Object.keys(ASSET_METRICS);
        assets.forEach(a => {
            const name = a.asset || a.assetName;
            let metrics = ASSET_METRICS[name];
            if (!metrics) {
                const key = metricKeys.find(k => k.includes(name) || name.includes(k.split(' (')[0]));
                if (key) metrics = ASSET_METRICS[key];
            }
            if (metrics) {
                const w = a.applicableWeight !== undefined ? a.applicableWeight : (a.weight || 0);
                ret += metrics.expectedReturn * w / 100;
                vol += metrics.volatility * w / 100;
                weightTotal += w;
            }
        });
        return {
            ret: weightTotal > 0 ? ret * (100 / weightTotal) : 0,
            vol: weightTotal > 0 ? vol * (100 / weightTotal) : 0
        };
    }

    const { ret: retFrom, vol: volFrom } = calcMetrics(from.assets)
    const { ret: retTo, vol: volTo } = calcMetrics(to.assets)

    const projectedReturn = retFrom * factorFrom + retTo * factorTo;
    const projectedVolatility = volFrom * factorFrom + volTo * factorTo;

    const getSliderColor = (val: number) => {
        if (val < 33) return "#9bcbb4"
        if (val < 66) return "#4fa080"
        if (val < 100) return "#2b6e76"
        return "#123044"
    }
    const currentColor = getSliderColor(riskPosition)

    // Avaliação de Alinhamento com o Perfil do Cliente
    const profileAlignment = useMemo(() => {
        const norm = clientProfile.toUpperCase().replace("VISAO", "VISÃO")
        
        if (norm === "ABRIGO") {
            if (riskPosition <= 25) {
                return {
                    status: "aligned",
                    badge: "100% Alinhado ao Perfil",
                    icon: <CheckCircle size={18} className="text-[#1f674f] shrink-0" />,
                    color: "#1f674f",
                    bg: "#e8f1ed",
                    border: "#4fa080",
                    title: "Carteira Alinhada ao seu Perfil (Abrigo / Conservador)",
                    message: "Esta alocação prioriza preservação e liquidez imediata, perfeitamente em linha com sua tolerância de risco diagnosticada na Jornada.",
                    recommendedRange: "0 – 25 (Abrigo)"
                }
            } else if (riskPosition <= 55) {
                return {
                    status: "warning",
                    badge: "Atenção: Acima do Perfil",
                    icon: <AlertTriangle size={18} className="text-[#b45309] shrink-0" />,
                    color: "#b45309",
                    bg: "#fef3c7",
                    border: "#f59e0b",
                    title: "Nível de Risco Superior ao seu Perfil (Abrigo)",
                    message: "Você está adicionando exposição a risco moderado e indexadores IPCA+. Verifique se sua reserva de segurança está completa antes de assumir oscilações de mercado.",
                    recommendedRange: "0 – 25 (Abrigo)"
                }
            } else {
                return {
                    status: "danger",
                    badge: "Alerta: Fora do Perfil",
                    icon: <AlertTriangle size={18} className="text-[#b91c1c] shrink-0" />,
                    color: "#b91c1c",
                    bg: "#fee2e2",
                    border: "#ef4444",
                    title: "Alocação Muito Superior à sua Tolerância (Abrigo)",
                    message: "Esta carteira possui forte exposição a renda variável, ações e ativos globais. O nível de volatilidade esperado pode ultrapassar o que você tolera segundo seu diagnóstico.",
                    recommendedRange: "0 – 25 (Abrigo)"
                }
            }
        }

        if (norm === "RITMO") {
            if (riskPosition < 20) {
                return {
                    status: "below",
                    badge: "Abaixo da Tolerância de Risco",
                    icon: <Info size={18} className="text-[#123044] shrink-0" />,
                    color: "#123044",
                    bg: "#e9edf1",
                    border: "#123044",
                    title: "Alocação Mais Defensiva que o seu Perfil (Ritmo)",
                    message: "Esta posição é ultra-conservadora (foco em liquidez/caixa). Seu patrimônio terá menor oscilação, mas pode ter retorno real inferior à inflação no longo prazo.",
                    recommendedRange: "20 – 55 (Ritmo)"
                }
            } else if (riskPosition <= 55) {
                return {
                    status: "aligned",
                    badge: "100% Alinhado ao Perfil",
                    icon: <CheckCircle size={18} className="text-[#1f674f] shrink-0" />,
                    color: "#1f674f",
                    bg: "#e8f1ed",
                    border: "#4fa080",
                    title: "Carteira Alinhada ao seu Perfil (Ritmo / Moderado)",
                    message: "Equilíbrio ideal entre liquidez de segurança e proteção do poder de compra via títulos IPCA+, perfeitamente calibrado para o seu perfil.",
                    recommendedRange: "20 – 55 (Ritmo)"
                }
            } else if (riskPosition <= 80) {
                return {
                    status: "warning",
                    badge: "Atenção: Acima do Perfil",
                    icon: <AlertTriangle size={18} className="text-[#b45309] shrink-0" />,
                    color: "#b45309",
                    bg: "#fef3c7",
                    border: "#f59e0b",
                    title: "Nível de Risco Superior ao seu Perfil (Ritmo)",
                    message: "Você está adicionando exposição relevante a renda variável e fundos multimercados. Pode gerar oscilações maiores em momentos de estresse de mercado.",
                    recommendedRange: "20 – 55 (Ritmo)"
                }
            } else {
                return {
                    status: "danger",
                    badge: "Alerta: Fora do Perfil",
                    icon: <AlertTriangle size={18} className="text-[#b91c1c] shrink-0" />,
                    color: "#b91c1c",
                    bg: "#fee2e2",
                    border: "#ef4444",
                    title: "Alocação Agressiva Acima do seu Perfil (Ritmo)",
                    message: "Exposição máxima a ações globais e risco sistemático. Indicada prioritariamente para horizontes muito longos e investidores arrojados.",
                    recommendedRange: "20 – 55 (Ritmo)"
                }
            }
        }

        if (norm === "VISÃO" || norm === "VISAO") {
            if (riskPosition < 45) {
                return {
                    status: "below",
                    badge: "Abaixo da Capacidade de Risco",
                    icon: <Info size={18} className="text-[#123044] shrink-0" />,
                    color: "#123044",
                    bg: "#e9edf1",
                    border: "#123044",
                    title: "Alocação Conservadora para o seu Perfil (Visão)",
                    message: "Você está com alocação conservadora para a sua capacidade de absorver oscilações. Isso pode desacelerar o crescimento do seu patrimônio no longo prazo.",
                    recommendedRange: "45 – 80 (Visão)"
                }
            } else if (riskPosition <= 80) {
                return {
                    status: "aligned",
                    badge: "100% Alinhado ao Perfil",
                    icon: <CheckCircle size={18} className="text-[#1f674f] shrink-0" />,
                    color: "#1f674f",
                    bg: "#e8f1ed",
                    border: "#4fa080",
                    title: "Carteira Alinhada ao seu Perfil (Visão / Arrojado)",
                    message: "Excelente combinação entre núcleo de proteção e motor de crescimento com ações, multimercados e ativos imobiliários.",
                    recommendedRange: "45 – 80 (Visão)"
                }
            } else {
                return {
                    status: "warning",
                    badge: "Atenção: Exposição Máxima",
                    icon: <AlertTriangle size={18} className="text-[#b45309] shrink-0" />,
                    color: "#b45309",
                    bg: "#fef3c7",
                    border: "#f59e0b",
                    title: "Exposição Máxima a Ativos Globais (Oceano)",
                    message: "Você está no nível máximo de risco da plataforma. Assegure-se de que não precisará desses recursos nos próximos 5 anos.",
                    recommendedRange: "45 – 80 (Visão)"
                }
            }
        }

        // OCEANO (Agressivo)
        if (riskPosition < 65) {
            return {
                status: "below",
                badge: "Abaixo da Tolerância ao Risco",
                icon: <Info size={18} className="text-[#123044] shrink-0" />,
                color: "#123044",
                bg: "#e9edf1",
                border: "#123044",
                title: "Alocação Abaixo da sua Tolerância ao Risco (Oceano)",
                message: "Como investidor agressivo, alocações defensivas podem subutilizar seu horizonte longo e capacidade de suportar volatilidade para maximizar retornos.",
                recommendedRange: "70 – 100 (Oceano)"
            }
        } else {
            return {
                status: "aligned",
                badge: "100% Alinhado ao Perfil",
                icon: <CheckCircle size={18} className="text-[#1f674f] shrink-0" />,
                color: "#1f674f",
                bg: "#e8f1ed",
                border: "#4fa080",
                title: "Carteira Alinhada ao seu Perfil (Oceano / Agressivo)",
                message: "Foco total na maximização de retornos e multiplicação patrimonial no longo prazo, com plena tolerância a oscilações de mercado.",
                recommendedRange: "70 – 100 (Oceano)"
            }
        }
    }, [riskPosition, clientProfile])

    const getFundReturns = (assetName: string) => {
        const findFund = (name: string) => HISTORICAL_DATA.funds.find((f: any) => f.name === name)?.values;
        
        let res = findFund(assetName);
        if (res) return res;
        
        const cleanName = assetName.split('(')[0].trim();
        res = findFund(cleanName);
        if (res) return res;

        if (assetName.includes("Sparta/Kinea")) return findFund("Sparta Deb Inc FIC Incentivados") || findFund("Kinea Deb Incentivadas") || [];
        if (cleanName.includes("Capitânia")) return findFund(cleanName.replace("Capitânia", "Capitania")) || [];
        if (cleanName.includes("Dahlia")) return findFund("Dahlia Total Return") || [];
        if (cleanName.includes("Truxt")) return findFund("Truxt Long Bias") || [];
        if (cleanName.includes("Hix")) return findFund("Hix Capital HS FIA") || findFund("Hix Capital FIC FIA") || [];
        if (cleanName.includes("Forpus")) return findFund("Forpus Acoes FIC FIF Acoes RL") || findFund("Forpus Ações FIC FIF Ações RL") || [];
        if (cleanName.includes("Real Investor")) return findFund("Real Investor FIC FIF Acoes RL") || findFund("Real Investor FIC FIF Ações RL") || [];
        
        const possibleFund = HISTORICAL_DATA.funds.find((f: any) => assetName.includes(f.name) || cleanName.includes(f.name));
        if (possibleFund) return possibleFund.values;

        return [];
    }

    const { chartData, realAnual, realMes, pctCdi } = useMemo(() => {
        const data = []
        let portfolioValue = 10000
        let cdiValue = 10000

        const historyLength = HISTORICAL_DATA.cdi ? HISTORICAL_DATA.cdi.length : 36;
        const months = Math.min(36, historyLength);

        const today = new Date()
        
        // Push the baseline month (0)
        const startDate = new Date(today.getFullYear(), today.getMonth() - months, 1)
        data.push({ 
            month: startDate.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }).replace('.', ''), 
            portfolio: portfolioValue, 
            cdi: cdiValue 
        })

        for (let i = historyLength - months; i < historyLength; i++) {
            const date = new Date(today.getFullYear(), today.getMonth() - (historyLength - 1 - i), 1)
            const monthStr = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }).replace('.', '')

            let actualMonthReturn = 0;
            let totalWeightWithData = 0;
            
            activeAssets.forEach(a => {
                const returnsArray = getFundReturns(a.assetName);
                if (returnsArray && returnsArray.length > i) {
                    actualMonthReturn += (returnsArray[i] * a.applicableWeight) / 100;
                    totalWeightWithData += a.applicableWeight;
                }
            })
            
            if (totalWeightWithData > 0 && totalWeightWithData < 100) {
                actualMonthReturn = actualMonthReturn * (100 / totalWeightWithData);
            }

            const cdiReturn = HISTORICAL_DATA.cdi && HISTORICAL_DATA.cdi[i] !== undefined ? HISTORICAL_DATA.cdi[i] : 0.009;
            
            portfolioValue = portfolioValue * (1 + actualMonthReturn)
            cdiValue = cdiValue * (1 + cdiReturn)

            data.push({
                month: monthStr,
                portfolio: Math.round(portfolioValue),
                cdi: Math.round(cdiValue)
            })
        }

        const portfolioAccum = (portfolioValue / 10000) - 1;
        const cdiAccum = (cdiValue / 10000) - 1;

        const anual = (Math.pow(portfolioValue / 10000, 12 / months) - 1) * 100;
        const mes = (Math.pow(portfolioValue / 10000, 1 / months) - 1) * 100;
        const pct = cdiAccum > 0 ? (portfolioAccum / cdiAccum) * 100 : 0;

        return { chartData: data, realAnual: anual, realMes: mes, pctCdi: pct }
    }, [activeAssets])

    // Needle Angle: -90 (0%) to +90 (100%)
    const needleAngle = -90 + (riskPosition / 100) * 180

    return (
        <>
            <div dangerouslySetInnerHTML={{
              __html: `
              <div class="ticker-tape-container" style="position: relative; z-index: 50; width: 100%; border-bottom: 1px solid #e4e0d7; background: #f6f4ef;">
                <script type="module" src="https://widgets.tradingview-widget.com/w/en/tv-ticker-tape.js"></script>
                <tv-ticker-tape symbols="FOREXCOM:SPXUSD,FOREXCOM:NSXUSD,FOREXCOM:DJI,FX:EURUSD,BITSTAMP:BTCUSD,BITSTAMP:ETHUSD,CMCMARKETS:GOLD"></tv-ticker-tape>
              </div>
              `
            }} />
            <div className="min-h-[calc(100vh-62px)] text-slate-900 font-sans p-6 md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-300 bg-[#f6f4ef]">
            <style>{`
                .arvo-slider [role=slider] {
                    border-color: ${currentColor} !important;
                    background-color: ${currentColor} !important;
                    box-shadow: 0 0 10px ${currentColor}60;
                    transition: background-color 0.3s, border-color 0.3s, box-shadow 0.3s;
                }
                .arvo-slider .relative > div:first-child > div {
                    background-color: ${currentColor} !important;
                    transition: background-color 0.3s;
                }
            `}</style>
            
            <div className="max-w-6xl mx-auto space-y-6">
                
                <header className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extralight tracking-tight text-[#123044] mb-2">Bússola ARVO de Carteiras</h1>
                        <p className="text-[#667085] text-sm max-w-2xl leading-relaxed">
                            A carteira parte de preservação (Abrigo), passa por equilíbrio (Ritmo), diversificação (Visão) 
                            e chega a crescimento global (Oceano). A Bússola está calibrada com o seu perfil diagnosticado na Jornada.
                        </p>
                    </div>
                    
                    {/* PERFIL DO CLIENTE BADGE */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <div className="inline-flex items-center gap-2 px-3.5 py-2 border border-[#2b6e76]/30 rounded-2xl bg-[#e8f1ed] text-[#123044] text-xs font-semibold shadow-sm">
                            <Compass size={16} className="text-[#2b6e76]" />
                            <span>Seu Perfil: <strong>{clientProfile}</strong></span>
                        </div>
                        <Link href="/dashboard/jornada" className="text-[11px] font-bold text-[#2b6e76] hover:underline flex items-center gap-1">
                            Refazer Etapa 7 da Jornada <ArrowRight size={12} />
                        </Link>
                    </div>
                </header>

                {/* FEEDBACK DINÂMICO DE ALINHAMENTO DO VELOCÍMETRO */}
                <motion.div 
                    key={profileAlignment.status + riskPosition}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-sm transition-all"
                    style={{ 
                        backgroundColor: profileAlignment.bg, 
                        borderColor: profileAlignment.border 
                    }}
                >
                    <div className="flex items-center gap-3">
                        {profileAlignment.icon}
                        <div>
                            <div className="text-xs font-extrabold uppercase tracking-wider" style={{ color: profileAlignment.color }}>
                                {profileAlignment.title}
                            </div>
                            <div className="text-xs text-[#344054] mt-0.5 max-w-3xl leading-relaxed">
                                {profileAlignment.message}
                            </div>
                        </div>
                    </div>
                    <div className="shrink-0 text-right">
                        <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-white/90 shadow-sm border border-black/5" style={{ color: profileAlignment.color }}>
                            Faixa Ideal: {profileAlignment.recommendedRange}
                        </span>
                    </div>
                </motion.div>

                {/* COCKPIT HERO: Bússola + Gráfico */}
                <div className="grid lg:grid-cols-2 gap-6">
                    
                    {/* CONTROLES E MEDIDOR */}
                    <aside className="bg-[#fffdf8]/90 border border-[#e4e0d7] rounded-[24px] shadow-[0_20px_50px_rgba(23,33,43,0.05)] overflow-hidden flex flex-col">
                        <div className="p-6 grid grid-cols-2 gap-4 border-b border-[#e4e0d7]/50">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#667085]">Tipo de investidor</label>
                                <select 
                                    className="w-full border border-[#e4e0d7] rounded-xl px-3 py-2 bg-white text-[#123044] font-semibold outline-none text-sm"
                                    value={itype} onChange={e => setItype(e.target.value)}
                                >
                                    {ITYPE_ORDER.map(t => (
                                        <option key={t} value={t}>{ITYPE_LABEL[t] || t}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#667085]">Tamanho da carteira</label>
                                <select 
                                    className="w-full border border-[#e4e0d7] rounded-xl px-3 py-2 bg-white text-[#123044] font-semibold outline-none text-sm"
                                    value={tier} onChange={e => setTier(e.target.value)}
                                >
                                    {TIER_ORDER.map(t => (
                                        <option key={t} value={t}>{TIER_LABEL[t] || t}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-span-2 space-y-4 pt-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold text-[#667085]">Nível de risco no Velocímetro (0 a 100)</label>
                                    <span className="text-xs font-extrabold px-2 py-0.5 rounded-full" style={{ backgroundColor: profileAlignment.bg, color: profileAlignment.color }}>
                                        {profileAlignment.badge}
                                    </span>
                                </div>
                                <Slider 
                                    value={[riskPosition]} 
                                    min={0} max={100} step={1}
                                    onValueChange={v => setRiskPosition(v[0])}
                                    className="arvo-slider"
                                />
                                <div className="flex justify-between text-[11px] font-bold text-[#8d97a5] uppercase tracking-widest px-1">
                                    <span className={riskPosition <= 25 ? "text-[#123044] font-black" : ""}>Abrigo (0)</span>
                                    <span className={riskPosition > 25 && riskPosition <= 55 ? "text-[#123044] font-black" : ""}>Ritmo (33)</span>
                                    <span className={riskPosition > 55 && riskPosition <= 80 ? "text-[#123044] font-black" : ""}>Visão (66)</span>
                                    <span className={riskPosition > 80 ? "text-[#123044] font-black" : ""}>Oceano (100)</span>
                                </div>
                            </div>
                        </div>

                        {/* GAUGE SVG */}
                        <div className="relative h-[220px] flex items-center justify-center pt-8">
                            <svg viewBox="0 0 400 220" className="w-[340px] h-full overflow-visible">
                                <defs>
                                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#9bcbb4" />
                                        <stop offset="33%" stopColor="#4fa080" />
                                        <stop offset="66%" stopColor="#2b6e76" />
                                        <stop offset="100%" stopColor="#123044" />
                                    </linearGradient>
                                </defs>
                                <path d="M 36 184 A 164 164 0 0 1 364 184" fill="none" stroke="#e4e0d7" strokeWidth="28" strokeLinecap="round" opacity="0.5"/>
                                <path d="M 36 184 A 164 164 0 0 1 364 184" fill="none" stroke="url(#gaugeGradient)" strokeWidth="28" strokeLinecap="round"/>
                                <line x1="111" y1="30" x2="125" y2="54" stroke="#fffdf8" strokeWidth="4" strokeLinecap="round"/>
                                <line x1="289" y1="30" x2="275" y2="54" stroke="#fffdf8" strokeWidth="4" strokeLinecap="round"/>
                                <g fontSize="10" fontWeight="800" fill="#8d97a5" letterSpacing="0.5">
                                    <text x="36" y="215" textAnchor="middle">ABRIGO</text>
                                    <text x="118" y="20" textAnchor="middle">RITMO</text>
                                    <text x="282" y="20" textAnchor="middle">VISÃO</text>
                                    <text x="364" y="215" textAnchor="middle">OCEANO</text>
                                </g>
                                <g transform="translate(200, 184)">
                                    <motion.g 
                                        className="needle"
                                        animate={{ rotate: needleAngle }}
                                        transition={{ type: "spring", stiffness: 60, damping: 15 }}
                                    >
                                        <circle cx="0" cy="0" r="132" fill="transparent" />
                                        <line x1="0" y1="0" x2="0" y2="-132" stroke="#17212b" strokeWidth="5" strokeLinecap="round"/>
                                        <circle cx="0" cy="0" r="13" fill="#17212b" style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.18))" }}/>
                                        <circle cx="0" cy="0" r="4" fill="#fffdf8"/>
                                    </motion.g>
                                </g>
                            </svg>
                        </div>

                        <div className="text-center pb-6 flex-1 flex flex-col justify-end">
                            <div className="text-5xl font-extrabold tracking-tighter leading-none mb-2 transition-colors duration-300" style={{ color: currentColor }}>
                                {riskPosition}
                            </div>
                            <div className="text-lg font-bold text-[#17384d] flex justify-center items-center gap-2">
                                {currentName}
                                {!isOfficial && (
                                    <span className="px-2 py-0.5 rounded border border-[#e4e0d7] bg-white text-[9px] text-[#667085] uppercase tracking-widest font-extrabold">
                                        Simulação
                                    </span>
                                )}
                            </div>
                            <div className="text-xs text-[#667085] mt-1.5 px-6">{currentHeadline}</div>
                            {isOfficial && (
                                <div className="inline-flex mt-3 mx-auto px-3 py-1 rounded-full bg-[#e8f1ed] text-[#1f674f] text-[11px] font-bold">
                                    Carteira oficial ARVO
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* GRÁFICO HISTÓRICO */}
                    <section className="bg-[#fffdf8]/90 border border-[#e4e0d7] rounded-[24px] p-6 shadow-[0_20px_50px_rgba(23,33,43,0.05)] overflow-hidden flex flex-col">
                        <h2 className="text-lg font-bold text-[#123044] mb-2">Histórico Real de Desempenho (36 meses)</h2>
                        <p className="text-xs text-[#667085] mb-6">Evolução real de <strong>R$ 10.000</strong> com base no histórico dos fundos que compõem a carteira atual versus CDI.</p>
                        
                        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-white border border-[#e4e0d7] rounded-2xl">
                            <div>
                                <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">Retorno Anual</div>
                                <div className="text-xl font-extrabold text-[#123044] mt-1">{realAnual.toFixed(1)}%</div>
                            </div>
                            <div className="w-px bg-[#e4e0d7] hidden md:block"></div>
                            <div>
                                <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">Média Mensal</div>
                                <div className="text-xl font-extrabold text-[#123044] mt-1">{realMes.toFixed(2)}%</div>
                            </div>
                            <div className="w-px bg-[#e4e0d7] hidden md:block"></div>
                            <div>
                                <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">% do CDI</div>
                                <div className="text-xl font-extrabold text-[#1f674f] mt-1">{pctCdi.toFixed(0)}%</div>
                            </div>
                        </div>

                        <div className="w-full mt-2">
                            <ResponsiveContainer width="100%" height={260}>
                                <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e0d7" />
                                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#8d97a5' }} tickLine={false} axisLine={false} minTickGap={30} />
                                    <YAxis tickFormatter={(val) => `R$ ${(val/1000).toFixed(1)}k`} tick={{ fontSize: 10, fill: '#8d97a5' }} tickLine={false} axisLine={false} domain={['dataMin - 500', 'auto']} />
                                    <Tooltip 
                                        formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, '']}
                                        labelFormatter={(label) => label}
                                        contentStyle={{ borderRadius: '12px', border: '1px solid #e4e0d7', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', backgroundColor: '#fffdf8' }}
                                        labelStyle={{ color: '#123044', fontWeight: 'bold', marginBottom: '4px' }}
                                    />
                                    <Line type="monotone" name="portfolio" dataKey="portfolio" stroke={currentColor} strokeWidth={3} dot={false} activeDot={{ r: 6, fill: currentColor }} />
                                    <Line type="monotone" name="cdi" dataKey="cdi" stroke="#8d97a5" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </section>
                </div>

                {/* MÉTRICAS INFERIORES */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="border border-[#e4e0d7] rounded-2xl p-4 bg-white shadow-sm">
                        <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">Ativos</div>
                        <div className="text-2xl font-extrabold text-[#123044] mt-1">{activeAssets.length}</div>
                        <div className="text-[11px] text-[#667085] mt-0.5">na carteira</div>
                    </div>
                    <div className="border border-[#e4e0d7] rounded-2xl p-4 bg-white shadow-sm">
                        <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">Caixa/Selic</div>
                        <div className="text-2xl font-extrabold text-[#123044] mt-1">{formatPct(cashTotal)}</div>
                        <div className="text-[11px] text-[#667085] mt-0.5">liquidez e defesa</div>
                    </div>
                    <div className="border border-[#e4e0d7] rounded-2xl p-4 bg-white shadow-sm">
                        <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">Retorno Alvo (a.a.)</div>
                        <div className="text-2xl font-extrabold text-[#123044] mt-1">{formatDecimalPct(projectedReturn)}</div>
                        <div className="text-[11px] text-[#667085] mt-0.5">projeção teórica</div>
                    </div>
                    <div className="border border-[#e4e0d7] rounded-2xl p-4 bg-white shadow-sm">
                        <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">Volatilidade (Risco)</div>
                        <div className="text-2xl font-extrabold text-[#123044] mt-1">{formatDecimalPct(projectedVolatility)}</div>
                        <div className="text-[11px] text-[#667085] mt-0.5">variação esperada</div>
                    </div>
                </div>

                {/* COMPOSIÇÃO E DESCRIÇÃO */}
                <div className="grid lg:grid-cols-[1fr_2fr] gap-6">
                    <section className="bg-[#fffdf8]/90 border border-[#e4e0d7] rounded-[24px] p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-[#123044] mb-4">Composição por classe</h2>
                        <div className="space-y-4">
                            {sortedClasses.map(([cls, val]) => (
                                <div key={cls} className="flex items-center gap-3 text-sm">
                                    <div className="w-36 flex-shrink-0 font-bold text-[#344054] truncate" title={cls}>{cls}</div>
                                    <div className="flex-1 h-2.5 bg-[#eee9df] rounded-full overflow-hidden">
                                        <div 
                                            className="h-full rounded-full bg-gradient-to-r from-[#24556d] to-[#2d8a69] transition-all duration-300" 
                                            style={{ width: `${val}%` }}
                                        />
                                    </div>
                                    <div className="w-12 text-right font-extrabold text-[#667085]">{formatPct(val)}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-[#fffdf8]/90 border border-[#e4e0d7] rounded-[24px] p-6 shadow-sm overflow-hidden flex flex-col">
                        <div className="bg-gradient-to-br from-[#fffdf8] to-[#edf5f2] border border-[#e4e0d7] rounded-2xl p-5 mb-6">
                            <p className="text-sm text-[#475467] leading-relaxed">
                                {isOfficial ? (
                                    <>Este é um ponto oficial da metodologia ARVO: <strong>{currentName}</strong>. </>
                                ) : (
                                    <>Você está simulando uma transição entre <strong>{from.name}</strong> e <strong>{to.name}</strong>. </>
                                )}
                                Neste nível, a carteira mantém {formatPct(cashTotal)} em caixa para liquidez, 
                                buscando a diversificação através das outras classes na proporção indicada.
                            </p>
                        </div>
                        
                        <h2 className="text-lg font-bold text-[#123044] mb-4">Ativos na carteira</h2>
                        <div className="overflow-x-auto flex-1 border border-[#e4e0d7] rounded-xl">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead>
                                    <tr className="border-b border-[#e4e0d7] bg-[#faf8f2]">
                                        <th className="py-3 px-3 text-[10px] font-bold text-[#667085] uppercase tracking-widest">Ativo</th>
                                        <th className="py-3 px-3 text-[10px] font-bold text-[#667085] uppercase tracking-widest">Classe</th>
                                        <th className="py-3 px-3 text-[10px] font-bold text-[#667085] uppercase tracking-widest">Gestora</th>
                                        <th className="py-3 px-3 text-[10px] font-bold text-[#667085] uppercase tracking-widest">Peso</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeAssets.map((asset) => (
                                        <tr key={asset.assetName} className="border-b border-[#efebe2] hover:bg-[#fff] transition-colors">
                                            <td className="py-3 px-3 font-extrabold text-[#22313f]">{asset.assetName}</td>
                                            <td className="py-3 px-3">
                                                <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-[#eef3f5] text-[#24485b]">
                                                    {asset.assetClass}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3 text-[#475467]">{asset.manager || "-"}</td>
                                            <td className="py-3 px-3 font-black text-[#123044]">{formatPct(asset.applicableWeight)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>

                <div dangerouslySetInnerHTML={{ __html: '<!-- TradingView Ticker Widget -->' }} />
            </div>
        </div>
        </>
    )
}
