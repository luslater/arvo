"use client"

import { useEffect, useState } from "react"
import { Users, TrendingUp, DollarSign, Wallet, ArrowRight, ShieldCheck, Search } from "lucide-react"

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
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
  }, [])

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
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                        <tr className="bg-[#faf8f2] border-b border-[#e4e0d7]">
                            <th className="px-6 py-4 text-xs font-bold text-[#667085] uppercase tracking-wider">Cliente</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#667085] uppercase tracking-wider">Perfil Atual</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#667085] uppercase tracking-wider text-right">Patrimônio Declarado</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#667085] uppercase tracking-wider text-center">Ativos</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#667085] uppercase tracking-wider">Cadastro</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#667085] uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#667085] uppercase tracking-wider text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0ece1]">
                        {filteredUsers.map((u: any) => (
                            <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-[#123044]">{u.name || 'Sem nome'}</div>
                                    <div className="text-xs text-[#667085] mt-0.5">{u.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#eef3f5] text-[#24485b]">
                                        {u.profileType}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-extrabold text-[#123044]">
                                    {fmtCurrency(u.aum)}
                                </td>
                                <td className="px-6 py-4 text-center font-bold text-[#667085]">
                                    {u.assetsCount}
                                </td>
                                <td className="px-6 py-4 text-[#667085] text-xs">
                                    {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                                </td>
                                <td className="px-6 py-4">
                                    {u.subscription === "PREMIUM" ? (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase">Premium</span>
                                    ) : u.role === "ADMIN" ? (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 uppercase">Admin</span>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700 uppercase">Free</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <a 
                                        href={`/dashboard/carteira-2?adminViewUser=${u.id}`} 
                                        className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold bg-white border border-[#e4e0d7] text-[#123044] rounded-lg hover:bg-gray-50 hover:text-[#4fa080] transition-colors"
                                    >
                                        Abrir Carteira
                                    </a>
                                </td>
                            </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">Nenhum cliente encontrado.</td>
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
