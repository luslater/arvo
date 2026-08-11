"use client"

import { useEffect, useState } from "react"
import { Users, TrendingUp, DollarSign, Wallet, ArrowRight, ShieldCheck, Search } from "lucide-react"

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState("")

  const fetchUsers = () => {
    fetch("/api/admin/users")
      .then(res => {
        if (!res.ok) throw new Error("Acesso restrito a gestores.")
        return res.json()
      })
      .then(data => {
        setUsers(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchUsers()
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

  const fmtCurrency = (val: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val)

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f6f4ef]">Carregando...</div>
  if (error) return <div className="min-h-screen flex items-center justify-center bg-[#f6f4ef] text-red-600 font-bold">{error}</div>

  const totalAum = users.reduce((acc: number, u: any) => acc + (u.aum || 0), 0)
  const premiumUsers = users.filter((u: any) => u.subscription === "PREMIUM").length
  const totalUsers = users.length

  const filteredUsers = users.filter((u: any) => 
      (u.name && u.name.toLowerCase().includes(search.toLowerCase())) || 
      (u.email && u.email.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-[#f6f4ef] font-sans pb-12 p-6 md:p-8 animate-in fade-in duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-extralight tracking-tight text-[#123044] flex items-center gap-2">
                    <ShieldCheck className="text-[#4fa080]" size={32} /> Dashboard do Gestor
                </h1>
                <p className="text-[#667085] text-sm mt-1">
                    Visão global de todos os clientes e patrimônio sob gestão (AUM).
                </p>
            </div>
            <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Buscar cliente..." 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-xl border border-[#e4e0d7] bg-white outline-none focus:border-[#4fa080] text-sm w-full sm:w-64"
                />
            </div>
        </header>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#e4e0d7] shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><Users size={16} /></div>
                    <span className="text-xs font-bold text-[#667085] uppercase tracking-wider">Total de Clientes</span>
                </div>
                <div className="text-2xl font-extrabold text-[#123044]">{totalUsers}</div>
            </div>
            
            <div className="bg-white p-5 rounded-2xl border border-[#e4e0d7] shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-[#4fa080]"><DollarSign size={16} /></div>
                    <span className="text-xs font-bold text-[#667085] uppercase tracking-wider">Patrimônio (AUM)</span>
                </div>
                <div className="text-2xl font-extrabold text-[#123044]">{fmtCurrency(totalAum)}</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#e4e0d7] shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600"><TrendingUp size={16} /></div>
                    <span className="text-xs font-bold text-[#667085] uppercase tracking-wider">Ticket Médio</span>
                </div>
                <div className="text-2xl font-extrabold text-[#123044]">{totalUsers > 0 ? fmtCurrency(totalAum / totalUsers) : 'R$ 0'}</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#e4e0d7] shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600"><Wallet size={16} /></div>
                    <span className="text-xs font-bold text-[#667085] uppercase tracking-wider">Assinantes Ativos</span>
                </div>
                <div className="text-2xl font-extrabold text-[#123044]">{premiumUsers}</div>
            </div>
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
                        {filteredUsers.map((u: any) => (
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
                                <td className="px-4 py-4 text-right font-extrabold text-[#123044] whitespace-nowrap">
                                    {fmtCurrency(u.aum)}
                                    <div className="text-[10px] text-[#667085] font-normal mt-1">{u.assetsCount} ativos</div>
                                </td>
                                <td className="px-4 py-4 text-center text-[#667085] text-xs whitespace-nowrap">
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
                                                href={`/dashboard/admin/user/${u.id}`} 
                                                className="px-3 py-1.5 text-xs font-bold bg-[#123044] text-white rounded hover:bg-[#0a1b26] transition flex items-center justify-center"
                                            >
                                                Analisar
                                            </a>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">Nenhum cliente encontrado.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </div>
  )
}
