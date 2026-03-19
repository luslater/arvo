"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { CheckCircle2, XCircle, Clock, User, RefreshCw } from "lucide-react"
import Image from "next/image"

interface UserRecord {
    id: string
    name: string | null
    email: string | null
    accountStatus: string
    subscriptionStatus: string
    createdAt: string
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    PENDING: { label: "Pendente", color: "#B8860B", bg: "#FDF6E3" },
    APPROVED: { label: "Aprovado", color: "#065F46", bg: "#D1FAE5" },
    REJECTED: { label: "Rejeitado", color: "#991B1B", bg: "#FEE2E2" },
}

export default function AdminUsersPage() {
    const { data: session } = useSession()
    const [users, setUsers] = useState<UserRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    const fetchUsers = useCallback(async () => {
        setLoading(true)
        setError("")
        try {
            const res = await fetch("/api/admin/users")
            if (!res.ok) {
                const data = await res.json()
                setError(data.error || "Erro ao carregar usuários")
            } else {
                setUsers(await res.json())
            }
        } catch {
            setError("Erro de rede")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchUsers() }, [fetchUsers])

    const handleAction = async (userId: string, action: "APPROVE" | "REJECT") => {
        setActionLoading(userId + action)
        try {
            await fetch("/api/admin/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, action })
            })
            await fetchUsers()
        } finally {
            setActionLoading(null)
        }
    }

    const pending = users.filter(u => u.accountStatus === "PENDING")
    const others = users.filter(u => u.accountStatus !== "PENDING")

    return (
        <div className="min-h-screen bg-[#F4F6F9] p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Image src="/arvo-logo.png" alt="ARVO" width={64} height={26} className="object-contain" />
                        <div>
                            <h1 className="text-[22px] font-semibold text-[#0A192F]">Gestão de Cadastros</h1>
                            <p className="text-[13px] text-[#4A5568]">Aprove ou rejeite novos usuários</p>
                        </div>
                    </div>
                    <button onClick={fetchUsers} className="flex items-center gap-2 px-4 py-2 text-[13px] bg-white border border-[rgba(10,25,47,0.12)] rounded-xl text-[#0A192F] hover:bg-[#EEF2F7] transition-colors">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Atualizar
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm">{error}</div>
                )}

                {/* Pending section */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-4 h-4 text-[#B8860B]" />
                        <h2 className="text-[14px] font-semibold text-[#0A192F]">
                            Aguardando aprovação{pending.length > 0 && <span className="ml-2 px-2 py-0.5 bg-[#FDF6E3] text-[#B8860B] rounded-full text-[11px] font-bold">{pending.length}</span>}
                        </h2>
                    </div>

                    {pending.length === 0 ? (
                        <div className="bg-white border border-[rgba(10,25,47,0.08)] rounded-2xl p-8 text-center text-[13px] text-[#94A3B8]">
                            Nenhum cadastro pendente. 🎉
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {pending.map(u => (
                                <div key={u.id} className="bg-white border border-[rgba(10,25,47,0.08)] rounded-2xl p-5 flex items-center gap-4">
                                    <div className="w-9 h-9 bg-[#EEF2F7] rounded-full flex items-center justify-center shrink-0">
                                        <User className="w-4 h-4 text-[#0A192F]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[14px] font-semibold text-[#0A192F] truncate">{u.name || "Sem nome"}</div>
                                        <div className="text-[12px] text-[#4A5568] truncate">{u.email}</div>
                                        <div className="text-[11px] text-[#94A3B8] mt-0.5">
                                            Cadastrado em {new Date(u.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <button
                                            onClick={() => handleAction(u.id, "APPROVE")}
                                            disabled={!!actionLoading}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-[13px] font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                            {actionLoading === u.id + "APPROVE" ? "..." : "Aprovar"}
                                        </button>
                                        <button
                                            onClick={() => handleAction(u.id, "REJECT")}
                                            disabled={!!actionLoading}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-red-200 text-red-600 text-[13px] font-semibold rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            {actionLoading === u.id + "REJECT" ? "..." : "Rejeitar"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* All users */}
                {others.length > 0 && (
                    <div>
                        <h2 className="text-[14px] font-semibold text-[#0A192F] mb-3">Todos os usuários</h2>
                        <div className="space-y-2">
                            {others.map(u => {
                                const s = statusConfig[u.accountStatus] || statusConfig.PENDING
                                return (
                                    <div key={u.id} className="bg-white border border-[rgba(10,25,47,0.08)] rounded-xl px-5 py-3.5 flex items-center gap-3">
                                        <div className="w-7 h-7 bg-[#EEF2F7] rounded-full flex items-center justify-center shrink-0">
                                            <User className="w-3.5 h-3.5 text-[#0A192F]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-[13px] font-medium text-[#0A192F]">{u.name || "Sem nome"}</span>
                                            <span className="text-[12px] text-[#94A3B8] ml-2">{u.email}</span>
                                        </div>
                                        <span
                                            style={{ color: s.color, backgroundColor: s.bg }}
                                            className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                                        >
                                            {s.label}
                                        </span>
                                        {u.accountStatus === "REJECTED" && (
                                            <button
                                                onClick={() => handleAction(u.id, "APPROVE")}
                                                className="text-[11px] text-emerald-700 hover:underline ml-1"
                                            >
                                                Aprovar mesmo assim
                                            </button>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
