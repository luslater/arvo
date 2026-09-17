"use client"

import { useEffect, useState, useMemo } from "react"
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Wallet, 
  ArrowRight, 
  ShieldCheck, 
  Search, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  RefreshCw,
  Filter,
  Flame
} from "lucide-react"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'clients' | 'leads'>('leads')
  
  // Clients state
  const [users, setUsers] = useState<any[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [usersError, setUsersError] = useState<string | null>(null)
  const [searchUser, setSearchUser] = useState("")

  // Leads state
  const [leads, setLeads] = useState<any[]>([])
  const [leadsSummary, setLeadsSummary] = useState<any>({
    totalLeads: 0,
    unconvertedLeads: 0,
    convertedClients: 0,
    totalPotentialAum: 0
  })
  const [loadingLeads, setLoadingLeads] = useState(true)
  const [leadsError, setLeadsError] = useState<string | null>(null)
  const [searchLead, setSearchLead] = useState("")
  const [leadFilter, setLeadFilter] = useState<'ALL' | 'UNCONVERTED' | 'CONVERTED'>('ALL')
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null)

  const fetchUsers = () => {
    setLoadingUsers(true)
    fetch("/api/admin/users")
      .then(res => {
        if (!res.ok) throw new Error("Acesso restrito a gestores.")
        return res.json()
      })
      .then(data => {
        setUsers(data)
        setLoadingUsers(false)
      })
      .catch(err => {
        setUsersError(err.message)
        setLoadingUsers(false)
      })
  }

  const fetchLeads = () => {
    setLoadingLeads(true)
    fetch("/api/admin/leads")
      .then(res => {
        if (!res.ok) throw new Error("Não foi possível carregar os leads.")
        return res.json()
      })
      .then(data => {
        setLeads(data.leads || [])
        if (data.summary) setLeadsSummary(data.summary)
        setLoadingLeads(false)
      })
      .catch(err => {
        setLeadsError(err.message)
        setLoadingLeads(false)
      })
  }

  useEffect(() => {
    fetchUsers()
    fetchLeads()
  }, [])

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if (!confirm(`Deseja alterar o status do cliente para ${newStatus}?`)) return;
    try {
      const res = await fetch(`/api/admin/users/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })
      if (!res.ok) throw new Error("Erro ao atualizar status")
      fetchUsers()
    } catch (e: any) {
      alert(e.message)
    }
  }

  const handleUpdateLeadContact = async (leadId: string, contactStatus: string) => {
    setUpdatingLeadId(leadId)
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, contactStatus })
      })
      if (!res.ok) throw new Error('Erro ao atualizar status do lead')
      
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, contactStatus } : l))
    } catch (e: any) {
      alert(e.message)
    } finally {
      setUpdatingLeadId(null)
    }
  }

  const fmtCurrency = (val: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val || 0)

  // Calculations for clients tab
  const totalAum = users.reduce((acc: number, u: any) => acc + (u.aum || 0), 0)
  const premiumUsers = users.filter((u: any) => u.subscription === "PREMIUM").length
  const totalUsers = users.length

  const filteredUsers = users.filter((u: any) => 
    (u.name && u.name.toLowerCase().includes(searchUser.toLowerCase())) || 
    (u.email && u.email.toLowerCase().includes(searchUser.toLowerCase()))
  )

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead: any) => {
      const matchesSearch = 
        (lead.name && lead.name.toLowerCase().includes(searchLead.toLowerCase())) ||
        (lead.email && lead.email.toLowerCase().includes(searchLead.toLowerCase())) ||
        (lead.phone && lead.phone.includes(searchLead))
      
      if (!matchesSearch) return false

      if (leadFilter === 'UNCONVERTED') return !lead.isClient
      if (leadFilter === 'CONVERTED') return lead.isClient
      return true
    })
  }, [leads, searchLead, leadFilter])

  const getWhatsAppLink = (lead: any) => {
    const rawPhone = (lead.phone || '').replace(/\D/g, '')
    if (!rawPhone) return '#'
    const phoneWithCountry = rawPhone.startsWith('55') ? rawPhone : `55${rawPhone}`
    const firstName = (lead.name || 'Cliente').split(' ')[0]
    const patrimonyStr = fmtCurrency(lead.input?.initial || 0)
    const targetStr = fmtCurrency(lead.target || 0)
    const text = `Olá ${firstName}! Vi que você realizou o diagnóstico financeiro na ARVO e simulou um patrimônio de ${patrimonyStr} com meta de independência em ${targetStr}. Gostaria de entender seus planos e apresentar como nossa consultoria fee-only pode ajudar a estruturar sua carteira.`
    return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(text)}`
  }

  return (
    <div className="min-h-screen bg-[#f6f4ef] font-sans pb-12 p-4 sm:p-6 md:p-8 animate-in fade-in duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e4e0d7] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#2B6E76]/10 text-[#2B6E76] border border-[#2B6E76]/20">
                <ShieldCheck size={14} /> Painel Administrativo ARVO
              </span>
            </div>
            <h1 className="text-3xl font-extralight tracking-tight text-[#123044] flex items-center gap-2">
              Gestão de Clientes & CRM de Vendas
            </h1>
            <p className="text-[#667085] text-sm mt-1">
              Acompanhe a base de clientes cadastrados e converta os leads gerados no Diagnóstico Financeiro.
            </p>
          </div>

          {/* TAB SWITCHER */}
          <div className="flex items-center gap-1.5 bg-[#e9e5dc] p-1.5 rounded-2xl border border-[#d8d3c7] self-start md:self-auto">
            <button
              onClick={() => setActiveTab('leads')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'leads'
                  ? 'bg-white text-[#123044] shadow-sm'
                  : 'text-[#667085] hover:text-[#123044]'
              }`}
            >
              <Flame size={15} className={activeTab === 'leads' ? 'text-amber-500' : 'text-stone-400'} />
              <span>Leads do Diagnóstico</span>
              {leadsSummary.unconvertedLeads > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-amber-500 text-white">
                  {leadsSummary.unconvertedLeads}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('clients')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'clients'
                  ? 'bg-white text-[#123044] shadow-sm'
                  : 'text-[#667085] hover:text-[#123044]'
              }`}
            >
              <Users size={15} className={activeTab === 'clients' ? 'text-[#2B6E76]' : 'text-stone-400'} />
              <span>Clientes da Plataforma</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#e0ded8] text-[#555]">
                {totalUsers}
              </span>
            </button>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* ABA 1: LEADS DO DIAGNÓSTICO (CRM COMERCIAL)                              */}
        {/* ========================================================================= */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            {/* LEADS METRICS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#e4e0d7] shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <AlertCircle size={16} />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase tracking-wide">
                    Para Fechamento
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#667085] uppercase tracking-wide">Leads em Aberto</span>
                  <div className="text-3xl font-extrabold text-amber-600 tabular-nums mt-0.5">
                    {leadsSummary.unconvertedLeads}
                  </div>
                  <p className="text-[11px] text-[#888] mt-1">Preencheram o diagnóstico e não são clientes</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#e4e0d7] shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                    Convertidos
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#667085] uppercase tracking-wide">Clientes Ativos</span>
                  <div className="text-3xl font-extrabold text-emerald-700 tabular-nums mt-0.5">
                    {leadsSummary.convertedClients}
                  </div>
                  <p className="text-[11px] text-[#888] mt-1">Possuem conta registrada na plataforma</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#e4e0d7] shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center text-[#2B6E76]">
                    <TrendingUp size={16} />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-[#2B6E76] uppercase tracking-wide">
                    Pipeline Total
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#667085] uppercase tracking-wide">Patrimônio Declarado</span>
                  <div className="text-2xl font-extrabold text-[#123044] tabular-nums mt-0.5 break-words">
                    {fmtCurrency(leadsSummary.totalPotentialAum)}
                  </div>
                  <p className="text-[11px] text-[#888] mt-1">Soma de patrimônio simulado pelos leads</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#e4e0d7] shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center text-[#123044]">
                    <Users size={16} />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-200 text-stone-700 uppercase tracking-wide">
                    Volume
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#667085] uppercase tracking-wide">Total de Leads</span>
                  <div className="text-3xl font-extrabold text-[#123044] tabular-nums mt-0.5">
                    {leadsSummary.totalLeads}
                  </div>
                  <p className="text-[11px] text-[#888] mt-1">Cadastros realizados no diagnóstico</p>
                </div>
              </div>
            </div>

            {/* LEADS FILTER & SEARCH */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#e4e0d7]">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setLeadFilter('ALL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    leadFilter === 'ALL'
                      ? 'bg-[#123044] text-white'
                      : 'bg-[#f4f1ea] text-[#667085] hover:bg-[#eae6dc]'
                  }`}
                >
                  Todos ({leads.length})
                </button>
                <button
                  onClick={() => setLeadFilter('UNCONVERTED')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                    leadFilter === 'UNCONVERTED'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  <AlertCircle size={13} />
                  <span>Apenas Leads em Aberto ({leadsSummary.unconvertedLeads})</span>
                </button>
                <button
                  onClick={() => setLeadFilter('CONVERTED')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                    leadFilter === 'CONVERTED'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  <CheckCircle2 size={13} />
                  <span>Clientes Convertidos ({leadsSummary.convertedClients})</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-full sm:w-64">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar lead, e-mail ou DDD..."
                    value={searchLead}
                    onChange={e => setSearchLead(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#e4e0d7] bg-[#fbfaf8] focus:bg-white focus:outline-none focus:border-[#2B6E76]"
                  />
                </div>
                <button 
                  onClick={fetchLeads} 
                  title="Atualizar lista"
                  className="p-2 rounded-xl border border-[#e4e0d7] hover:bg-gray-100 text-[#667085]"
                >
                  <RefreshCw size={15} className={loadingLeads ? "animate-spin" : ""} />
                </button>
              </div>
            </div>

            {/* LEADS TABLE */}
            <div className="bg-white border border-[#e4e0d7] rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-[#faf8f2] border-b border-[#e4e0d7] whitespace-nowrap">
                      <th className="px-4 py-4 text-[11px] font-bold text-[#667085] uppercase tracking-wider">Lead / Contato</th>
                      <th className="px-4 py-4 text-[11px] font-bold text-[#667085] uppercase tracking-wider">Ação Comercial</th>
                      <th className="px-4 py-4 text-[11px] font-bold text-[#667085] uppercase tracking-wider">Dados Simulados</th>
                      <th className="px-4 py-4 text-[11px] font-bold text-[#667085] uppercase tracking-wider text-center">Status no Banco</th>
                      <th className="px-4 py-4 text-[11px] font-bold text-[#667085] uppercase tracking-wider text-center">Status do Contato</th>
                      <th className="px-4 py-4 text-[11px] font-bold text-[#667085] uppercase tracking-wider text-right">Data</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0ece1]">
                    {loadingLeads ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-12 text-center text-stone-500">
                          <RefreshCw size={20} className="animate-spin mx-auto mb-2 text-[#2B6E76]" />
                          Carregando leads do diagnóstico...
                        </td>
                      </tr>
                    ) : filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-12 text-center text-stone-500">
                          Nenhum lead encontrado com os filtros selecionados.
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead: any) => {
                        const years = lead.months ? (lead.months / 12).toFixed(1) : null
                        const initialVal = lead.input?.initial ?? 0
                        const monthlyVal = lead.input?.monthly ?? 0
                        const incomeVal = lead.input?.income ?? 0

                        return (
                          <tr key={lead.id} className="hover:bg-[#fbfaf8] transition-colors">
                            {/* Lead & Contato */}
                            <td className="px-4 py-4 min-w-[220px]">
                              <div className="font-bold text-[#123044] text-sm flex items-center gap-1.5">
                                {lead.name || 'Sem nome'}
                              </div>
                              <div className="text-xs text-[#667085] mt-0.5 break-all">{lead.email}</div>
                              <div className="text-xs font-mono text-stone-600 mt-1 flex items-center gap-1">
                                <Phone size={11} className="text-stone-400" />
                                <span>{lead.phone || 'Sem telefone'}</span>
                              </div>
                            </td>

                            {/* Ação Comercial (WhatsApp 1-Click) */}
                            <td className="px-4 py-4 whitespace-nowrap">
                              {lead.phone ? (
                                <a
                                  href={getWhatsAppLink(lead)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition transform active:scale-95"
                                  title="Iniciar conversa no WhatsApp com mensagem personalizada"
                                >
                                  <MessageSquare size={13} />
                                  <span>Chamar no WhatsApp</span>
                                </a>
                              ) : (
                                <span className="text-xs text-stone-400 italic">Sem WhatsApp</span>
                              )}
                            </td>

                            {/* Dados Simulados */}
                            <td className="px-4 py-4 min-w-[230px]">
                              <div className="text-xs space-y-1">
                                <div className="flex items-center justify-between gap-4">
                                  <span className="text-stone-500">Patrimônio:</span>
                                  <strong className="font-mono text-[#123044]">{fmtCurrency(initialVal)}</strong>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                  <span className="text-stone-500">Aporte mensal:</span>
                                  <span className="font-mono text-stone-700">{fmtCurrency(monthlyVal)}</span>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                  <span className="text-stone-500">Renda alvo:</span>
                                  <span className="font-mono text-[#2B6E76] font-semibold">{fmtCurrency(incomeVal)}/mês</span>
                                </div>
                                <div className="flex items-center gap-2 pt-1">
                                  {lead.profile && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#eef3f5] text-[#24485b]">
                                      {lead.profile}
                                    </span>
                                  )}
                                  {years && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-700">
                                      ~{years} anos
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Status no Banco de Usuários */}
                            <td className="px-4 py-4 text-center whitespace-nowrap">
                              {lead.clientStatus === "CLIENTE_PREMIUM" ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  <CheckCircle2 size={12} /> Cliente Premium
                                </span>
                              ) : lead.clientStatus === "CLIENTE_CADASTRADO" ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                                  <Users size={12} /> Usuário Cadastrado
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                                  <AlertCircle size={12} /> Lead em Aberto
                                </span>
                              )}
                            </td>

                            {/* Status do Contato Comercial */}
                            <td className="px-4 py-4 text-center whitespace-nowrap">
                              <select
                                value={lead.contactStatus || 'NOVO'}
                                disabled={updatingLeadId === lead.id}
                                onChange={e => handleUpdateLeadContact(lead.id, e.target.value)}
                                className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border outline-none cursor-pointer transition ${
                                  lead.contactStatus === 'FECHADO'
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                    : lead.contactStatus === 'EM_CONTATO'
                                    ? 'bg-blue-50 border-blue-300 text-blue-800'
                                    : lead.contactStatus === 'SEM_INTERESSE'
                                    ? 'bg-gray-100 border-gray-300 text-gray-600'
                                    : 'bg-amber-50 border-amber-300 text-amber-800'
                                }`}
                              >
                                <option value="NOVO">🟡 Novo Lead</option>
                                <option value="EM_CONTATO">🔵 Em Contato</option>
                                <option value="FECHADO">🟢 Venda Fechada</option>
                                <option value="SEM_INTERESSE">⚪ Sem Interesse</option>
                              </select>
                            </td>

                            {/* Data */}
                            <td className="px-4 py-4 text-right text-stone-500 text-xs font-mono whitespace-nowrap">
                              {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                              <div className="text-[10px] text-stone-400">
                                {new Date(lead.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ABA 2: CLIENTES DA PLATAFORMA (GESTÃO AUM)                                */}
        {/* ========================================================================= */}
        {activeTab === 'clients' && (
          <div className="space-y-6">
            {/* CLIENTS METRICS ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#e4e0d7] shadow-xs flex flex-col justify-between">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center text-[#2B6E76] shrink-0">
                    <Users size={16} />
                  </div>
                  <span className="text-[11px] font-bold text-[#667085] uppercase tracking-wide">Total de Clientes</span>
                </div>
                <div className="text-3xl font-extrabold text-[#123044] tabular-nums">{totalUsers}</div>
              </div>
              
              <div className="bg-white p-5 rounded-2xl border border-[#e4e0d7] shadow-xs flex flex-col justify-between">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-[#1f674f] shrink-0">
                    <DollarSign size={16} />
                  </div>
                  <span className="text-[11px] font-bold text-[#667085] uppercase tracking-wide">Patrimônio (AUM)</span>
                </div>
                <div className="text-2xl font-extrabold text-[#123044] tabular-nums break-words">
                  {fmtCurrency(totalAum)}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#e4e0d7] shadow-xs flex flex-col justify-between">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                    <TrendingUp size={16} />
                  </div>
                  <span className="text-[11px] font-bold text-[#667085] uppercase tracking-wide">Ticket Médio</span>
                </div>
                <div className="text-2xl font-extrabold text-[#123044] tabular-nums break-words">
                  {totalUsers > 0 ? fmtCurrency(totalAum / totalUsers) : 'R$ 0'}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#e4e0d7] shadow-xs flex flex-col justify-between">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                    <Wallet size={16} />
                  </div>
                  <span className="text-[11px] font-bold text-[#667085] uppercase tracking-wide">Assinantes Ativos</span>
                </div>
                <div className="text-3xl font-extrabold text-[#123044] tabular-nums">{premiumUsers}</div>
              </div>
            </div>

            {/* SEARCH CLIENTS */}
            <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#e4e0d7]">
              <div className="relative w-full sm:w-72">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Buscar cliente por nome ou e-mail..." 
                  value={searchUser}
                  onChange={e => setSearchUser(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#e4e0d7] bg-[#fbfaf8] focus:bg-white focus:outline-none focus:border-[#2B6E76]"
                />
              </div>
              <button 
                onClick={fetchUsers} 
                title="Atualizar clientes"
                className="p-2 rounded-xl border border-[#e4e0d7] hover:bg-gray-100 text-[#667085]"
              >
                <RefreshCw size={15} className={loadingUsers ? "animate-spin" : ""} />
              </button>
            </div>

            {/* CLIENTS TABLE */}
            <div className="bg-white border border-[#e4e0d7] rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-[#faf8f2] border-b border-[#e4e0d7] whitespace-nowrap">
                      <th className="px-4 py-4 text-[11px] font-bold text-[#667085] uppercase tracking-wider">Cliente</th>
                      <th className="px-4 py-4 text-[11px] font-bold text-[#667085] uppercase tracking-wider">Status da Conta</th>
                      <th className="px-4 py-4 text-[11px] font-bold text-[#667085] uppercase tracking-wider text-right">Patrimônio</th>
                      <th className="px-4 py-4 text-[11px] font-bold text-[#667085] uppercase tracking-wider text-center">Data</th>
                      <th className="px-4 py-4 text-[11px] font-bold text-[#667085] uppercase tracking-wider text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0ece1]">
                    {loadingUsers ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-12 text-center text-stone-500">
                          <RefreshCw size={20} className="animate-spin mx-auto mb-2 text-[#2B6E76]" />
                          Carregando clientes da plataforma...
                        </td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">Nenhum cliente encontrado.</td>
                      </tr>
                    ) : (
                      filteredUsers.map((u: any) => (
                        <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 min-w-[200px]">
                            <div className="font-bold text-[#123044] text-sm break-words">{u.name || 'Sem nome'}</div>
                            <div className="text-xs text-[#667085] mt-0.5 break-all">{u.email}</div>
                            <span className="inline-flex items-center px-2 py-0.5 mt-2 rounded text-[10px] font-bold bg-[#eef3f5] text-[#24485b]">
                              {u.profileType || 'N/A'}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {u.status === "PENDING" ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 uppercase border border-amber-200">Em Análise</span>
                            ) : u.status === "REJECTED" ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 uppercase border border-red-200">Rejeitado</span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase border border-green-200">Aprovado</span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-right font-extrabold text-[#123044] font-mono tabular-nums whitespace-nowrap">
                            {fmtCurrency(u.aum)}
                            <div className="text-[10px] text-[#667085] font-sans font-normal mt-1">{u.assetsCount} ativos</div>
                          </td>
                          <td className="px-4 py-4 text-center text-[#667085] text-xs font-mono tabular-nums whitespace-nowrap">
                            {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-4 py-4 text-right whitespace-nowrap">
                            <div className="flex flex-col sm:flex-row items-end justify-end gap-2">
                              {u.status === "PENDING" && (
                                <>
                                  <button onClick={() => handleUpdateStatus(u.id, "APPROVED")} className="px-3 py-1.5 text-xs font-bold bg-green-600 text-white rounded hover:bg-green-700 transition">Aprovar</button>
                                  <button onClick={() => handleUpdateStatus(u.id, "REJECTED")} className="px-3 py-1.5 text-xs font-bold bg-white border border-red-200 text-red-600 rounded hover:bg-red-50 transition">Rejeitar</button>
                                </>
                              )}
                              {u.status !== "PENDING" && (
                                <>
                                  <button onClick={() => handleUpdateStatus(u.id, "PENDING")} className="px-3 py-1.5 text-[10px] font-bold bg-white border border-gray-200 text-gray-500 rounded hover:bg-gray-50 transition">Revogar</button>
                                </>
                              )}
                              {u.status === "APPROVED" && (
                                <a 
                                  href={`/dashboard/carteira?adminViewUser=${u.id}`} 
                                  className="px-3 py-1.5 text-xs font-bold bg-[#123044] text-white rounded hover:bg-[#0a1b26] transition flex items-center justify-center"
                                >
                                  Analisar
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

