"use client"

import { useState, useMemo, useRef } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import {
  Shield, TrendingUp, CheckCircle, Lock, Wallet,
  PiggyBank, Sparkles, ArrowRight, Info, Plus, Minus, Eye, EyeOff,
  Layers, CircleDollarSign, Landmark, Globe, Building2, Coins,
  Star, GripVertical, Trash2, Search, X,
  Upload, FileSpreadsheet, FileText, Image, Loader2, ArrowRightLeft,
  Percent, DollarSign, Target, Edit3, RefreshCw, ChevronDown,
  ChevronUp, Copy, Rocket, BookOpen, ArrowUpRight, ArrowDownRight
} from "lucide-react"
import { PORTFOLIO_LINES, ASSET_METRICS } from "@/data/mockPortfolios"

// ============================================================
// ARVO — MINHA CARTEIRA v4 (Definitiva - Adaptada para Tema ARVO + Metodologia Real)
// ============================================================

const T = {
  bg: "#f6f4ef",
  card: "#ffffff",
  cardHover: "#fbfaf8",
  border: "#e4e0d7",
  borderLight: "#f0ece1",
  text: "#123044",
  textMuted: "#667085",
  textDim: "#475467",
  accent: "#4fa080",
  accentSoft: "#4fa08018",
  accentGlow: "#4fa08040",
  blue: "#3B82F6",
  blueSoft: "#3B82F615",
  purple: "#8B5CF6",
  purpleSoft: "#8B5CF615",
  amber: "#F59E0B",
  amberSoft: "#F59E0B15",
  red: "#EF4444",
  redSoft: "#EF444415",
  orange: "#FB923C",
  success: "#10B981",
}

const tiers = [
  { id: "Abrigo", name: "Abrigo", sub: "Conservador", emoji: "🏠", color: "#10B981", desc: "Segurança e estabilidade. Rende acima da inflação com baixa volatilidade." },
  { id: "Ritmo", name: "Ritmo", sub: "Moderado-Conservador", emoji: "🚶", color: "#3B82F6", desc: "Equilíbrio entre segurança e crescimento." },
  { id: "Visão", name: "Visão", sub: "Moderado", emoji: "🔭", color: "#8B5CF6", desc: "Foco no crescimento de longo prazo." },
  { id: "Oceano", name: "Oceano", sub: "Arrojado", emoji: "🌊", color: "#F59E0B", desc: "Máximo retorno, aceita grandes oscilações." },
]

function getAssetStyling(className) {
    if (!className) return { icon: Coins, color: "#9ca3af" }
    const lower = className.toLowerCase()
    if (lower.includes("caixa") || lower.includes("selic")) return { icon: Wallet, color: "#10B981" }
    if (lower.includes("renda fixa") || lower.includes("crédito")) return { icon: Shield, color: "#34D399" }
    if (lower.includes("infra") || lower.includes("ipca")) return { icon: Shield, color: "#6EE7B7" }
    if (lower.includes("multimercado")) return { icon: Layers, color: "#A7F3D0" }
    if (lower.includes("long bias")) return { icon: TrendingUp, color: "#3B82F6" }
    if (lower.includes("ações")) return { icon: TrendingUp, color: "#8B5CF6" }
    if (lower.includes("internacional")) return { icon: Globe, color: "#F59E0B" }
    if (lower.includes("imobiliário") || lower.includes("fii")) return { icon: Building2, color: "#6366F1" }
    return { icon: Coins, color: "#FB923C" }
}

const buildCatalog = () => {
    const catalogMap = new Map()
    Object.values(PORTFOLIO_LINES).forEach(levels => {
        levels.forEach(level => {
            level.assets.forEach(a => {
                if (!catalogMap.has(a.asset)) {
                    const styling = getAssetStyling(a.class)
                    catalogMap.set(a.asset, {
                        id: a.asset,
                        name: a.asset,
                        cat: a.class,
                        manager: a.manager,
                        icon: styling.icon,
                        color: styling.color,
                        ex: a.manager, // using manager as example info
                        yield: ASSET_METRICS[a.asset]?.expectedReturn ? Number((ASSET_METRICS[a.asset].expectedReturn / 12).toFixed(2)) : 0.8
                    })
                }
            })
        })
    })
    return Array.from(catalogMap.values())
}

const catalog = buildCatalog()

const fmt = (v) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v)

// ============================================================
// SECTION 1: REGISTRO DA CARTEIRA ATUAL
// ============================================================
function SectionRegistro({ onComplete, onSkip }) {
  const [mode, setMode] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [assets, setAssets] = useState([])
  const [showCatalog, setShowCatalog] = useState(false)
  const [search, setSearch] = useState("")
  const [customName, setCustomName] = useState("")
  const [showCustom, setShowCustom] = useState(false)

  const fileRef = useRef(null)

  const totalPct = assets.reduce((s, a) => s + (a.pct || 0), 0)
  const totalVal = assets.reduce((s, a) => s + (a.value || 0), 0)

  const handleUpload = async (file) => {
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      
      const res = await fetch("/api/extract", { method: "POST", body: formData })
      const data = await res.json()
      
      setUploading(false)
      if (data.assets && Array.isArray(data.assets) && data.assets.length > 0) {
        const mappedAssets = data.assets.map((a, i) => {
          const safeName = a.name || "Ativo Extraído"
          const matched = catalog.find(c => c.name.toLowerCase().includes(safeName.toLowerCase().split(' ')[0]))
          if (matched) return { ...matched, value: parseFloat(a.value) || 0 }
          
          const styling = getAssetStyling(a.cat || "Outros")
          return {
            id: `custom-${i}`,
            name: safeName,
            cat: a.cat || "Outros",
            color: styling.color,
            icon: styling.icon,
            value: parseFloat(a.value) || 0,
            yield: a.yield ? parseFloat(a.yield) : 0.8,
            yieldType: "month"
          }
        })

        // calculate percentages to start the manual editor nicely
        const total = mappedAssets.reduce((s, a) => s + a.value, 0)
        let processed = mappedAssets.map(a => ({
          ...a, pct: Math.round((a.value / total) * 100),
        }))
        const sum = processed.reduce((s, a) => s + a.pct, 0)
        if (sum !== 100 && processed.length > 0) processed[0].pct += (100 - sum)

        setAssets(processed)
        setMode("manual")
      } else {
        setAssets([])
        setMode("manual")
      }
    } catch (e) {
      console.error(e)
      setUploading(false)
      setMode("manual")
    }
  }

  const addAsset = (cat) => {
    if (assets.find(a => a.id === cat.id)) return
    setAssets(p => [...p, { ...cat, pct: 0, value: 0, yield: cat.yield || 0.8, yieldType: "month" }])
    setShowCatalog(false)
  }

  const addCustom = () => {
    if (!customName.trim()) return
    const colors = ["#F472B6", "#818CF8", "#22D3EE", "#A3E635", "#FB7185"]
    setAssets(p => [...p, {
      id: `c-${Date.now()}`, name: customName.trim(), pct: 0, value: 0, yield: 0.8, yieldType: "month",
      color: colors[Math.floor(Math.random() * colors.length)], icon: Star, ex: "Personalizado", cat: "Outros"
    }])
    setCustomName("")
    setShowCustom(false)
  }

  const updateAsset = (id, field, val) => {
    setAssets(p => p.map(a => a.id === id ? { ...a, [field]: (field === "yieldType" || field === "name" ? val : Math.max(0, val)) } : a))
  }

  const removeAsset = (id) => setAssets(p => p.filter(a => a.id !== id))

  const filtered = catalog.filter(c =>
    !assets.find(a => a.id === c.id) &&
    (c.name.toLowerCase().includes(search.toLowerCase()) || c.cat.toLowerCase().includes(search.toLowerCase()))
  )

  // ------- INITIAL CHOICE -------
  if (!mode && !uploading) {
    return (
      <div className="rounded-2xl border overflow-hidden shadow-sm" style={{ backgroundColor: T.card, borderColor: T.border }}>
        <div className="px-6 py-5 border-b" style={{ borderColor: T.border }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#f0ece1]">
              <Wallet size={20} className="text-[#123044]" />
            </div>
            <div>
              <h2 className="text-base font-bold" style={{ color: T.text }}>Como você investe hoje?</h2>
              <p className="text-xs font-medium" style={{ color: T.textDim }}>Precisamos saber de onde você está partindo</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-3">
          <input type="file" ref={fileRef} className="hidden" onChange={(e) => {
            if (e.target.files[0]) {
              handleUpload(e.target.files[0])
              e.target.value = "" // clear input so the same file can be selected again
            }
          }} />
          
          {/* Upload option */}
          <button onClick={() => fileRef.current?.click()}
            className="w-full p-5 rounded-xl border text-left transition-all group hover:bg-gray-50"
            style={{ borderColor: T.border, backgroundColor: T.card }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: T.accentSoft }}>
                <Upload size={22} style={{ color: T.accent }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold mb-0.5" style={{ color: T.text }}>Importar extrato com IA</p>
                <p className="text-xs" style={{ color: T.textDim }}>Envie Excel, PDF ou foto do extrato da corretora.</p>
              </div>
              <div className="flex gap-1.5 hidden sm:flex">
                {[{ I: FileSpreadsheet, c: "#10B981" }, { I: FileText, c: "#F87171" }, { I: Image, c: "#FBBF24" }].map(({ I, c }, i) => (
                  <div key={i} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: c + "15" }}>
                    <I size={14} style={{ color: c }} />
                  </div>
                ))}
              </div>
            </div>
          </button>

          {/* Manual option */}
          <button onClick={() => setMode("manual")}
            className="w-full p-5 rounded-xl border text-left transition-all hover:bg-gray-50"
            style={{ borderColor: T.border, backgroundColor: T.card }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: T.blueSoft }}>
                <Edit3 size={22} style={{ color: T.blue }} />
              </div>
              <div>
                <p className="text-sm font-bold mb-0.5" style={{ color: T.text }}>Adicionar manualmente</p>
                <p className="text-xs" style={{ color: T.textDim }}>Informe seus investimentos um a um e os valores.</p>
              </div>
            </div>
          </button>

          {/* Skip */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex-1 h-px" style={{ backgroundColor: T.borderLight }} />
            <button onClick={onSkip} className="text-xs font-bold px-3 py-1.5 rounded-full transition-all text-gray-400 hover:text-gray-600">
              Não tenho investimentos ainda {"\u2192"}
            </button>
            <div className="flex-1 h-px" style={{ backgroundColor: T.borderLight }} />
          </div>
        </div>
      </div>
    )
  }

  // ------- UPLOADING -------
  if (uploading) {
    return (
      <div className="rounded-2xl border p-10 text-center shadow-sm" style={{ backgroundColor: T.card, borderColor: T.border }}>
        <div className="mx-auto mb-4" style={{ width: 40, height: 40 }}>
          <Loader2 size={40} className="animate-spin" style={{ color: T.accent }} />
        </div>
        <p className="text-base font-bold mb-1" style={{ color: T.text }}>A Inteligência da ARVO está lendo seu extrato...</p>
        <p className="text-sm" style={{ color: T.textDim }}>Identificando os ativos e preenchendo sua carteira automaticamente.</p>
      </div>
    )
  }

  // ------- MANUAL ENTRY / POST-UPLOAD -------
  return (
    <div className="rounded-2xl border overflow-hidden shadow-sm" style={{ backgroundColor: T.card, borderColor: T.border }}>
      <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: T.border }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#f0ece1]">
            <Wallet size={18} className="text-[#123044]" />
          </div>
          <div>
            <h2 className="text-sm font-bold" style={{ color: T.text }}>Sua Carteira Atual</h2>
            <p className="text-xs font-medium" style={{ color: T.textDim }}>
              {assets.length > 0 ? `${assets.length} ativos adicionados` : "Construa sua alocação atual"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {assets.length > 0 && (
            <button onClick={() => { setAssets([]) }}
              className="text-xs font-bold px-3 py-1.5 rounded-lg border hover:bg-gray-50" style={{ borderColor: T.border, color: T.textDim }}>
              <RefreshCw size={11} className="inline mr-1" />Limpar
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        <input type="file" ref={fileRef} className="hidden" onChange={(e) => {
          if (e.target.files[0]) {
            handleUpload(e.target.files[0])
            e.target.value = ""
          }
        }} />
        
        {assets.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-3xl mb-2">{"\u{1F4CB}"}</div>
            <p className="text-sm font-bold mb-1" style={{ color: T.text }}>Nenhum ativo na carteira</p>
            <p className="text-xs mb-4" style={{ color: T.textDim }}>Adicione do catálogo ou importe seu extrato via IA.</p>
          </div>
        ) : (
          <div className="space-y-2 mb-4">
            {assets.map((a) => {
              const Icon = a.icon || Star
              return (
                <div key={a.id} className="group flex items-center gap-2 p-2.5 rounded-xl border transition-all hover:bg-gray-50"
                  style={{ backgroundColor: T.card, borderColor: T.border }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: a.color + "18" }}>
                    <Icon size={14} style={{ color: a.color }} />
                  </div>
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-xs font-bold truncate" style={{ color: T.text }}>{a.name}</p>
                    <p className="text-[10px] truncate text-gray-400">{a.cat}</p>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold" style={{ color: T.textDim }}>R$</span>
                      <input type="number" value={a.value || ""} placeholder="0"
                        onChange={(e) => updateAsset(a.id, "value", parseInt(e.target.value) || 0)}
                        className="w-24 h-7 text-right text-sm font-bold rounded-lg border px-2 outline-none"
                        style={{ backgroundColor: T.bg, borderColor: T.border, color: T.text }} />
                    </div>
                    <div className="flex items-center gap-1">
                      <input type="number" step="0.01" value={a.yield || ""} placeholder="0.8"
                        onChange={(e) => updateAsset(a.id, "yield", parseFloat(e.target.value) || 0)}
                        className="w-16 h-6 text-right text-xs font-bold rounded-lg border px-2 outline-none"
                        style={{ backgroundColor: T.bg, borderColor: T.border, color: T.accent }} />
                      <select
                        value={a.yieldType || "month"}
                        onChange={(e) => updateAsset(a.id, "yieldType", e.target.value)}
                        className="text-[10px] font-bold outline-none cursor-pointer rounded bg-gray-100 hover:bg-gray-200 px-1 py-0.5"
                        style={{ color: T.textDim }}
                      >
                        <option value="month">% a.m.</option>
                        <option value="year">% a.a.</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={() => removeAsset(a.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                    style={{ backgroundColor: T.redSoft, color: T.red }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              )
            })}

            {/* Total */}
            {totalVal > 0 && (
              <div className="flex items-center justify-between pt-4 mt-2 border-t" style={{ borderColor: T.border }}>
                <span className="text-xs font-bold" style={{ color: T.textMuted }}>Total Lançado</span>
                <span className="text-base font-black" style={{ color: T.accent }}>{fmt(totalVal)}</span>
              </div>
            )}
          </div>
        )}

        {/* Add buttons */}
        <div className="flex gap-3">
          <button onClick={() => setShowCatalog(!showCatalog)}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-bold border border-dashed transition-all hover:bg-[#f0fdf4]"
            style={{ borderColor: T.accent + "40", color: T.accent, backgroundColor: showCatalog ? T.accentSoft : "transparent" }}>
            <Plus size={14} /> Adicionar ativo
          </button>
          <button onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-xs font-bold border hover:bg-gray-50"
            style={{ borderColor: T.border, color: T.textDim }}>
            <Upload size={14} /> Importar IA
          </button>
        </div>

        {/* Catalog */}
        {showCatalog && (
          <div className="mt-3 rounded-xl border p-4 shadow-sm" style={{ backgroundColor: T.card, borderColor: T.border }}>
            <div className="relative mb-3">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar fundos, rendas fixas..." className="w-full pl-9 pr-3 py-2 rounded-lg text-xs font-bold border outline-none"
                style={{ backgroundColor: T.bg, borderColor: T.border, color: T.text }} />
            </div>
            <div className="space-y-1 max-h-48 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
              {filtered.map(c => {
                const CI = c.icon
                return (
                  <button key={c.id} onClick={() => addAsset(c)}
                    className="w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors hover:bg-gray-50">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: c.color + "18" }}>
                      <CI size={14} style={{ color: c.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate text-[#123044]">{c.name}</p>
                        <p className="text-[10px] text-gray-400">{c.cat}</p>
                    </div>
                    <Plus size={14} style={{ color: T.accent }} />
                  </button>
                )
              })}
            </div>
            {/* Custom */}
            <div className="mt-3 pt-3 border-t" style={{ borderColor: T.border }}>
              {showCustom ? (
                <div className="flex gap-2">
                  <input type="text" value={customName} onChange={(e) => setCustomName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCustom()}
                    placeholder="Nome do fundo..." autoFocus
                    className="flex-1 px-3 py-2 rounded-lg text-xs font-bold border outline-none"
                    style={{ backgroundColor: T.bg, borderColor: T.border, color: T.text }} />
                  <button onClick={addCustom} className="px-4 py-2 rounded-lg text-xs font-bold"
                    style={{ backgroundColor: T.accent, color: "white" }}>Criar</button>
                </div>
              ) : (
                <button onClick={() => setShowCustom(true)}
                  className="w-full text-xs font-bold text-center py-2 rounded-lg hover:bg-gray-50"
                  style={{ color: T.textDim }}>
                  <Star size={12} className="inline mr-1" />Criar ativo personalizado
                </button>
              )}
            </div>
          </div>
        )}

        {/* Confirm button */}
        {assets.length > 0 && totalVal > 0 && (
          <button onClick={() => onComplete(assets)}
            className="w-full mt-6 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md text-white hover:-translate-y-0.5"
            style={{ backgroundColor: "#123044" }}>
            <CheckCircle size={16} /> Confirmar Minha Carteira
          </button>
        )}
      </div>
    </div>
  )
}

// ============================================================
// SECTION 2: LADO A LADO COMPARATIVO
// ============================================================
function SectionComparativo({ currentAssets, recAlloc, tier, patrimonio, viewMode, profileLine }) {
  const hasCurrent = currentAssets && currentAssets.length > 0
  const totalVal = hasCurrent ? currentAssets.reduce((s, a) => s + (a.value || 0), 0) : patrimonio

  const currentWithPct = useMemo(() => {
    if (!hasCurrent) return []
    const total = currentAssets.reduce((s, a) => s + (a.value || 0), 0)
    if (total === 0) return currentAssets
    return currentAssets.map(a => ({ ...a, pct: Math.round(((a.value || 0) / total) * 100) }))
  }, [currentAssets, hasCurrent])

  const displayVal = (pct, total) => viewMode === "pct" ? `${pct}%` : fmt(Math.round(total * pct / 100))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LEFT: Current */}
      {hasCurrent && (
        <div className="rounded-[24px] border overflow-hidden shadow-sm" style={{ backgroundColor: T.card, borderColor: T.border }}>
          <div className="px-6 py-4 border-b flex items-center gap-2 bg-[#f6f4ef]" style={{ borderColor: T.borderLight }}>
            <Wallet size={16} style={{ color: T.blue }} />
            <span className="text-sm font-bold" style={{ color: T.text }}>Onde você está hoje</span>
          </div>
          <div className="p-6">
            <div className="flex justify-center mb-6">
              <div className="relative" style={{ width: 160, height: 160 }}>
                <ResponsiveContainer>
                  <PieChart><Pie data={currentWithPct} dataKey="pct" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2} strokeWidth={0}>
                    {currentWithPct.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie></PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-sm font-black" style={{ color: T.text }}>{fmt(totalVal)}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {currentWithPct.map(a => {
                const Icon = a.icon || Star
                return (
                  <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ backgroundColor: T.bg }}>
                    <div className="w-1.5 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: a.color }} />
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: a.color + "15" }}>
                      <Icon size={14} style={{ color: a.color }} />
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                        <p className="text-xs font-bold truncate text-[#123044]">{a.name}</p>
                        <p className="text-[10px] text-gray-500 truncate">{a.cat}</p>
                    </div>
                    <span className="text-sm font-black" style={{ color: a.color }}>{displayVal(a.pct, totalVal)}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* RIGHT: Recommended ARVO */}
      <div className={`rounded-[24px] border overflow-hidden shadow-lg relative ${!hasCurrent ? "lg:col-span-2 max-w-xl mx-auto w-full" : ""}`}
        style={{ backgroundColor: "#f0fdf4", borderColor: T.accent + "40" }}>
        <div className="absolute top-4 right-4 bg-[#10B981] text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">Alvo ARVO</div>
        <div className="px-6 py-4 border-b flex items-center justify-between bg-white bg-opacity-50"
          style={{ borderColor: T.accent + "20" }}>
          <div className="flex items-center gap-2">
            <Sparkles size={16} style={{ color: T.accent }} />
            <span className="text-sm font-bold" style={{ color: T.text }}>
              {hasCurrent ? "Onde você deveria estar" : "Sua Carteira Recomendada"}
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex justify-center mb-6">
            <div className="relative" style={{ width: 160, height: 160 }}>
              <ResponsiveContainer>
                <PieChart><Pie data={recAlloc} dataKey="pct" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2} strokeWidth={0}>
                  {recAlloc.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie></PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl">{tier.emoji}</span>
                <span className="text-xs font-black mt-1" style={{ color: tier.color }}>{tier.name}</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {recAlloc.map(a => {
              const Icon = a.icon
              return (
                <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-white shadow-sm border border-[#4fa080] border-opacity-10">
                  <div className="w-1.5 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: a.color }} />
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: a.color + "15" }}>
                    <Icon size={14} style={{ color: a.color }} />
                  </div>
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-xs font-bold truncate text-[#123044]">{a.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{a.cat}</p>
                  </div>
                  <span className="text-sm font-black" style={{ color: a.color }}>{displayVal(a.pct, patrimonio)}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* YIELD COMPARISON (BAR CHART) */}
      <div className="col-span-1 lg:col-span-2 mt-2 rounded-[24px] border bg-white p-6 shadow-sm" style={{ borderColor: T.border }}>
        <h3 className="text-sm font-bold mb-4" style={{ color: T.text }}>Comparativo de Rentabilidade Média Esperada</h3>
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer>
            <BarChart data={(() => {
              const getMonthlyYield = (a) => a.yieldType === "year" ? (a.yield || 0) / 12 : (a.yield || 0.8)
              const currentYield = hasCurrent ? currentWithPct.reduce((s, a) => s + (getMonthlyYield(a) * (a.pct/100)), 0) : 0
              const arvoYield = recAlloc.reduce((s, a) => s + (getMonthlyYield(a) * (a.pct/100)), 0)
              return [
                {
                  name: "Rentabilidade Média",
                  "Sua Carteira": Number(currentYield.toFixed(2)),
                  "Alvo ARVO": Number(arvoYield.toFixed(2))
                }
              ]
            })()} margin={{ top: 20, right: 20, bottom: 5, left: 0 }} barGap={20} barSize={80}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={T.borderLight} />
              <XAxis dataKey="name" tick={{fontSize: 12, fontWeight: 'bold'}} stroke={T.textMuted} />
              <YAxis tickFormatter={v => `${v}%`} tick={{fontSize: 10}} stroke={T.textMuted} />
              <Tooltip formatter={(val) => `${val}% a.m.`} cursor={{fill: 'transparent'}} />
              <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
              {hasCurrent && <Bar dataKey="Sua Carteira" fill={T.blue} radius={[6, 6, 0, 0]} />}
              <Bar dataKey="Alvo ARVO" fill={T.accent} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// SECTION 3: PASSO A PASSO (GAP ANALYSIS ARVO)
// ============================================================
function SectionPassoAPasso({ currentAssets, recAlloc, tier, patrimonio, hasCurrentPortfolio }) {
  const [expandedStep, setExpandedStep] = useState(null)

  // Start from zero
  if (!hasCurrentPortfolio) {
    const steps = [
      { n: 1, title: "Monte sua reserva de emergência", desc: "Antes de investir, guarde de 3 a 6 meses de gastos num lugar seguro.", what: "Caixa, Fundos DI, Tesouro Selic", howMuch: "3 a 6x suas despesas mensais", icon: Shield, color: T.success, emoji: "🛡️" },
      { n: 2, title: "Comece pela Renda Fixa", desc: "A base da sua carteira. Traz estabilidade para poder arriscar depois.", what: "Renda Fixa Pós, IPCA+", howMuch: `Aproximadamente ${recAlloc.reduce((s,a) => a.cat.includes("Fixa") ? s+a.pct : s, 0)}% da carteira`, icon: Landmark, color: "#10B981", emoji: "🏛️" },
      { n: 3, title: "Diversifique para Crescimento", desc: "Adicione risco gradualmente buscando prêmios de longo prazo.", what: "Ações, Multimercados, FIIs", howMuch: "O percentual restante sugerido no gráfico", icon: TrendingUp, color: T.purple, emoji: "🚀" },
    ]

    return (
      <div className="rounded-2xl border overflow-hidden shadow-sm" style={{ backgroundColor: T.card, borderColor: T.border }}>
        <div className="px-6 py-4 border-b bg-[#f0fdf4]" style={{ borderColor: T.borderLight }}>
          <div className="flex items-center gap-2">
            <Rocket size={18} style={{ color: T.accent }} />
            <div>
              <h3 className="text-sm font-bold" style={{ color: T.text }}>Por onde começar</h3>
              <p className="text-xs font-medium" style={{ color: T.textDim }}>Seu roteiro para construir a carteira {tier.name}</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-3">
          {steps.map((s) => {
            const isOpen = expandedStep === s.n
            return (
              <button key={s.n} onClick={() => setExpandedStep(isOpen ? null : s.n)}
                className="w-full text-left rounded-xl border p-4 transition-all hover:bg-gray-50"
                style={{ borderColor: isOpen ? s.color + "40" : T.border, backgroundColor: isOpen ? s.color + "08" : T.card }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-black"
                    style={{ backgroundColor: s.color + "18", color: s.color }}>{s.n}</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold" style={{ color: T.text }}>{s.emoji} {s.title}</p>
                  </div>
                  {isOpen ? <ChevronUp size={16} style={{ color: T.textDim }} /> : <ChevronDown size={16} style={{ color: T.textDim }} />}
                </div>
                {isOpen && (
                  <div className="mt-4 ml-11 space-y-3">
                    <p className="text-xs font-medium leading-relaxed text-gray-600">{s.desc}</p>
                    <div className="flex items-start gap-2 p-3 rounded-xl" style={{ backgroundColor: T.bg }}>
                      <BookOpen size={14} style={{ color: s.color }} className="mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-[#123044]">O que buscar:</p>
                        <p className="text-xs text-gray-500 mt-0.5">{s.what}</p>
                      </div>
                    </div>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // GAP analysis 
  const currentWithPct = (() => {
    const total = currentAssets.reduce((s, a) => s + (a.value || 0), 0)
    if (total === 0) return currentAssets
    return currentAssets.map(a => ({ ...a, pct: Math.round(((a.value || 0) / total) * 100) }))
  })()

  const allIds = new Set([...currentWithPct.map(a => a.id), ...recAlloc.map(a => a.id)])
  const actions = []
  allIds.forEach(id => {
    const curr = currentWithPct.find(a => a.id === id)
    const r = recAlloc.find(a => a.id === id)
    const currPct = curr?.pct || 0
    const recPct = r?.pct || 0
    const diff = recPct - currPct
    if (Math.abs(diff) >= 2) {
      actions.push({
        id,
        name: (curr || r).name,
        color: (curr || r).color,
        icon: (curr || r).icon || Star,
        currPct, recPct, diff,
        diffVal: Math.round(patrimonio * Math.abs(diff) / 100),
        cat: r?.cat || curr?.cat,
        direction: diff > 0 ? "increase" : "decrease",
      })
    }
  })
  actions.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))

  if (actions.length === 0) {
    return (
      <div className="rounded-2xl border p-8 text-center bg-white shadow-sm" style={{ borderColor: T.accent + "30" }}>
        <div className="text-4xl mb-3">🎉</div>
        <p className="text-lg font-black mb-1" style={{ color: T.accent }}>Carteira perfeitamente alinhada!</p>
        <p className="text-sm font-medium" style={{ color: T.textMuted }}>Sua alocação bate 100% com a recomendação da ARVO.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border overflow-hidden shadow-sm" style={{ backgroundColor: T.card, borderColor: T.border }}>
      <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: T.borderLight, backgroundColor: "#fffbeb" }}>
        <div className="flex items-center gap-2">
          <ArrowRightLeft size={18} style={{ color: T.amber }} />
          <div>
            <h3 className="text-sm font-bold" style={{ color: T.text }}>O que você deve ajustar</h3>
            <p className="text-xs font-medium" style={{ color: T.textDim }}>Sugestões para alinhar à ARVO</p>
          </div>
        </div>
        <span className="text-xs px-3 py-1.5 rounded-full font-bold" style={{ backgroundColor: T.amberSoft, color: T.amber }}>
          {actions.length} {actions.length === 1 ? "ajuste" : "ajustes"}
        </span>
      </div>

      <div className="p-6 space-y-3">
        {actions.map((a) => {
          const Icon = a.icon
          const isOpen = expandedStep === a.id
          const isUp = a.direction === "increase"
          return (
            <button key={a.id} onClick={() => setExpandedStep(isOpen ? null : a.id)}
              className="w-full text-left rounded-xl border p-4 transition-all hover:bg-gray-50"
              style={{ borderColor: isOpen ? a.color + "40" : T.borderLight, backgroundColor: isOpen ? a.color + "06" : T.card }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: a.color + "18" }}>
                  <Icon size={16} style={{ color: a.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate text-[#123044]">{a.name}</p>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">Atual: {a.currPct}% {"\u2192"} Meta: {a.recPct}%</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: isUp ? T.success + "15" : T.red + "15" }}>
                  {isUp ? <ArrowUpRight size={14} style={{ color: T.success }} /> : <ArrowDownRight size={14} style={{ color: T.red }} />}
                  <span className="text-sm font-black" style={{ color: isUp ? T.success : T.red }}>
                    {isUp ? "+" : ""}{a.diff}%
                  </span>
                </div>
                {isOpen ? <ChevronUp size={16} style={{ color: T.textDim }} className="ml-2" /> : <ChevronDown size={16} style={{ color: T.textDim }} className="ml-2" />}
              </div>
              {isOpen && (
                <div className="mt-4 ml-14 space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-xl" style={{ backgroundColor: T.bg }}>
                    <Target size={14} style={{ color: a.color }} className="mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-[#123044]">Ajuste Financeiro Recomendado:</p>
                      <p className="text-xs font-medium text-gray-600 mt-0.5">
                        Você deve {isUp ? "comprar" : "vender"} aproximadamente <span className="font-bold">{fmt(a.diffVal)}</span> na categoria {a.cat}.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>

      <div className="px-6 pb-6">
        <div className="flex items-start gap-2 p-4 rounded-xl" style={{ backgroundColor: T.bg }}>
          <Info size={16} style={{ color: T.textDim }} className="flex-shrink-0 mt-0.5" />
          <p className="text-xs font-medium leading-relaxed" style={{ color: T.textDim }}>
            Dica de Ouro ARVO: Não precisa vender tudo de uma vez. Faça ajustes gradualmente, usando seus aportes mensais para comprar as classes que estão abaixo da meta ideal.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// MAIN PAGE EXPORT
// ============================================================
export default function MinhaCarteiraV2() {
  // Arvo methodology bindings
  const [profileLine, setProfileLine] = useState("Geral Normal")
  const [profileName, setProfileName] = useState("Visão")
  
  const recAlloc = useMemo(() => {
    const p = PORTFOLIO_LINES[profileLine].find(l => l.name === profileName)
    if (!p) return []
    return p.assets.map(a => {
      const cat = catalog.find(c => c.id === a.asset)
      return { ...cat, pct: a.weight }
    })
  }, [profileLine, profileName])

  const tier = useMemo(() => {
    // Map ARVO profile names to the UI tiers
    const n = profileName.toLowerCase()
    if (n.includes("abrigo") || n.includes("conservador")) return tiers[0]
    if (n.includes("ritmo") || n.includes("moderado")) return tiers[1]
    if (n.includes("oceano") || n.includes("arrojado")) return tiers[3]
    return tiers[2] // Visão default
  }, [profileName])

  const [step, setStep] = useState(1) // 1 = registro | 2 = comparativo | 3 = passo a passo
  const [currentAssets, setCurrentAssets] = useState(null)
  const [viewMode, setViewMode] = useState("pct")
  const [showValues, setShowValues] = useState(true)

  const patrimonio = currentAssets && currentAssets.length > 0 
    ? currentAssets.reduce((s, a) => s + (a.value || 0), 0)
    : 300000

  const hasCurrentPortfolio = currentAssets && currentAssets.length > 0

  const handleRegistroComplete = (assets) => {
    setCurrentAssets(assets)
    setStep(2)
    setTimeout(() => setStep(3), 100)
  }

  const handleSkip = () => {
    setCurrentAssets([])
    setStep(2)
    setTimeout(() => setStep(3), 100)
  }

  return (
    <div className="min-h-screen bg-[#f6f4ef] font-sans pb-12">
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(15px)} to{opacity:1;transform:translateY(0)} }
        .fade-in { animation: fadeIn 0.4s ease-out forwards; }
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance:none; margin:0; }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#e4e0d7; border-radius:10px; }
      `}</style>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extralight tracking-tight text-[#123044]">Jornada da Carteira</h1>
            <p className="text-sm font-bold text-gray-500 mt-1">
              {step === 1 ? "Monte seu retrato atual para descobrir o caminho ideal" : "Acompanhe e evolua seus investimentos com a ARVO"}
            </p>
          </div>
          {step >= 2 && (
            <div className="flex items-center gap-3">
              <div className="flex rounded-lg border bg-white shadow-sm" style={{ borderColor: T.border }}>
                <button onClick={() => setViewMode("pct")}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold transition-all"
                  style={{ backgroundColor: viewMode === "pct" ? T.accentSoft : "transparent", color: viewMode === "pct" ? T.accent : T.textDim }}>
                  <Percent size={14} /> %
                </button>
                <div className="w-px bg-gray-200" />
                <button onClick={() => setViewMode("brl")}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold transition-all"
                  style={{ backgroundColor: viewMode === "brl" ? T.accentSoft : "transparent", color: viewMode === "brl" ? T.accent : T.textDim }}>
                  <DollarSign size={14} /> R$
                </button>
              </div>
              <button onClick={() => setShowValues(!showValues)}
                className="w-10 h-10 rounded-lg flex items-center justify-center border bg-white shadow-sm hover:bg-gray-50"
                style={{ borderColor: T.border, color: T.textDim }}>
                {showValues ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          )}
        </div>

        {/* METRICS */}
        {step >= 2 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 fade-in">
            {[
                { icon: Wallet, label: "Patrimônio Lançado", value: showValues ? fmt(patrimonio) : "••••", color: T.accent },
                { icon: CircleDollarSign, label: "Aporte Recomendado", value: showValues ? fmt(5000) : "••••", color: T.blue },
                { icon: TrendingUp, label: "Retorno Alvo Médio", value: `${(recAlloc.reduce((s, a) => s + ((a.yieldType === "year" ? (a.yield||0)/12 : (a.yield||0.8)) * (a.pct/100)), 0)).toFixed(2)}% a.m.`, color: T.purple },
                { icon: PiggyBank, label: "Volatilidade", value: tier.name === "Oceano" ? "Alta" : "Média", color: T.amber },
            ].map((m, i) => {
                const MI = m.icon
                return (
                <div key={i} className="rounded-2xl p-5 border bg-white shadow-sm" style={{ borderColor: T.borderLight }}>
                    <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50">
                            <MI size={14} style={{ color: m.color }} />
                        </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">{m.label}</span>
                    </div>
                    <p className="text-xl font-black text-[#123044]">{m.value}</p>
                </div>
                )
            })}
            </div>
        )}

        {/* PROFILE SELECTOR (ARVO Data Driven) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 px-6 py-4 rounded-2xl border bg-white shadow-sm"
          style={{ borderColor: T.borderLight }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{tier.emoji}</span>
            <div>
              <p className="text-sm font-bold" style={{ color: tier.color }}>Estratégia {profileName}</p>
              <p className="text-xs font-medium text-gray-500">{profileLine} — {tier.desc}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select value={profileLine} onChange={e => {
              const newLine = e.target.value
              setProfileLine(newLine)
              setProfileName(PORTFOLIO_LINES[newLine][0].name)
            }} className="text-xs font-bold px-3 py-2 rounded-lg border bg-gray-50 outline-none text-[#123044]">
                {Object.keys(PORTFOLIO_LINES).map(k => <option key={k} value={k}>{k}</option>)}
            </select>
            <select value={profileName} onChange={e => setProfileName(e.target.value)} className="text-xs font-bold px-3 py-2 rounded-lg border bg-gray-50 outline-none text-[#123044]">
                {PORTFOLIO_LINES[profileLine].map(l => <option key={l.name} value={l.name}>{l.name}</option>)}
            </select>
          </div>
        </div>

        {/* STEP INDICATORS */}
        <div className="flex items-center gap-2 mb-8">
          {[
            { n: 1, label: "Sua Posição" },
            { n: 2, label: "Lado a Lado" },
            { n: 3, label: "Plano de Ação" },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center gap-2 flex-1">
              {i > 0 && <div className="w-full h-1 rounded-full" style={{ backgroundColor: step >= s.n ? T.accent + "40" : T.borderLight }} />}
              <div className="flex items-center gap-2 flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: step >= s.n ? T.accentSoft : "white",
                  color: step >= s.n ? T.accent : "gray",
                  border: `1px solid ${step >= s.n ? T.accent + "30" : T.borderLight}`,
                }}>
                {step > s.n ? <CheckCircle size={14} /> : <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-white"
                  style={{ backgroundColor: step >= s.n ? T.accent : "gray" }}>{s.n}</span>}
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* ---- SECTION 1: REGISTRO ---- */}
        {step === 1 && (
          <div className="fade-in max-w-2xl mx-auto">
            <SectionRegistro onComplete={handleRegistroComplete} onSkip={handleSkip} />
          </div>
        )}

        {/* ---- SECTION 2: COMPARATIVO ---- */}
        {step >= 2 && (
          <div className="fade-in mb-8">
            <SectionComparativo currentAssets={hasCurrentPortfolio ? currentAssets : null} recAlloc={recAlloc} tier={tier} patrimonio={patrimonio} viewMode={viewMode} profileLine={profileLine} />
          </div>
        )}

        {/* ---- SECTION 3: PASSO A PASSO ---- */}
        {step >= 3 && (
          <div className="fade-in mb-8">
            <SectionPassoAPasso currentAssets={currentAssets} recAlloc={recAlloc} tier={tier} patrimonio={patrimonio} hasCurrentPortfolio={hasCurrentPortfolio} />
          </div>
        )}

        {/* BACK TO EDIT */}
        {step >= 2 && (
          <div className="flex justify-center mb-8">
            <button onClick={() => { setStep(1); setCurrentAssets(null); }}
              className="flex items-center gap-2 text-xs font-bold px-6 py-3 rounded-full border bg-white shadow-sm hover:bg-gray-50 transition-all"
              style={{ borderColor: T.border, color: T.textDim }}>
              <Edit3 size={14} /> Refazer Carteira Atual
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
