"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard, Wallet, BookOpen, HelpCircle,
    Target, CreditCard, User, BarChart3, LogOut, ChevronDown, Calculator, TrendingUp, Lock, Check
} from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { useState } from "react"

interface NavItem {
    href: string
    icon: React.ReactNode
    label: string
    exact?: boolean
    locked?: boolean
    onLockedClick?: () => void
}

function NavLink({ href, icon, label, exact, locked, onLockedClick }: NavItem) {
    const pathname = usePathname()
    const isActive = exact ? pathname === href : pathname.startsWith(href)

    if (locked) {
        return (
            <button
                onClick={onLockedClick}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] transition-colors text-dash-text-muted hover:bg-dash-surface-active hover:text-dash-text font-normal"
            >
                <div className="flex items-center gap-2.5">
                    <span className="opacity-60">{icon}</span>
                    {label}
                </div>
                <Lock className="w-3.5 h-3.5 opacity-40" />
            </button>
        )
    }

    return (
        <Link
            href={href}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] transition-colors ${isActive
                ? 'bg-dash-accent-light text-dash-accent font-semibold'
                : 'text-dash-text-muted hover:bg-dash-surface-active hover:text-dash-text font-normal'
                }`}
        >
            <span className={`${isActive ? 'opacity-100' : 'opacity-60'}`}>{icon}</span>
            {label}
        </Link>
    )
}

export function DashboardSidebar() {
    const { data: session } = useSession()
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [showUpgradeModal, setShowUpgradeModal] = useState(false)

    return (
        <>
        <aside className="w-[232px] bg-dash-surface border-r border-dash-border flex flex-col shrink-0 fixed top-0 left-0 h-screen font-sans z-40">
            {/* Logo */}
            <div className="px-6 py-5 border-b border-dash-border">
                <Link href="/dashboard">
                    <Image src="/arvo-logo.png" alt="ARVO" width={72} height={28} className="object-contain" />
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold text-dash-text-light uppercase tracking-widest px-3 py-2 mt-1">Principal</span>

                <NavLink href="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} label="Visão Geral" exact />
                <NavLink href="/dashboard/carteira" icon={<Wallet className="w-4 h-4" />} label="Minha Carteira" />
                <NavLink href="/dashboard/planejamento" icon={<Target className="w-4 h-4" />} label="Planejamento" />
                <NavLink href="/dashboard/portfolios" icon={<BarChart3 className="w-4 h-4" />} label="Portfólios ARVO" locked onLockedClick={() => setShowUpgradeModal(true)} />
                <NavLink href="/dashboard/calculadoras" icon={<Calculator className="w-4 h-4" />} label="Calculadoras" />

                <span className="text-[10px] font-semibold text-dash-text-light uppercase tracking-widest px-3 py-2 mt-4">Aprendizado</span>
                <NavLink href="/dashboard/educacao" icon={<BookOpen className="w-4 h-4" />} label="Educação" />
                <NavLink href="/dashboard/markowitz" icon={<TrendingUp className="w-4 h-4" />} label="Análise Markowitz" locked onLockedClick={() => setShowUpgradeModal(true)} />

                <span className="text-[10px] font-semibold text-dash-text-light uppercase tracking-widest px-3 py-2 mt-4">Conta & Contato</span>
                <NavLink href="/dashboard/assinatura" icon={<CreditCard className="w-4 h-4" />} label="Assinatura" />
                <NavLink href="/dashboard/agendamento" icon={<HelpCircle className="w-4 h-4" />} label="Agendamento" locked onLockedClick={() => setShowUpgradeModal(true)} />
                <NavLink href="/dashboard/ajuda" icon={<HelpCircle className="w-4 h-4 opacity-0" />} label="Ajuda" />
            </nav>

            {/* Assessor Card */}
            <div className="px-4 pb-2">
                <div className="bg-dash-accent-light rounded-xl p-3.5 mb-3">
                    <div className="text-[10px] text-dash-accent-mid uppercase tracking-[0.06em] font-semibold mb-1">Seu assessor</div>
                    <div className="text-[13px] font-semibold text-dash-accent leading-tight">Rafael Mendes, CFP®</div>
                    <Link href="/dashboard/agendamento">
                        <button className="mt-2.5 w-full py-1.5 text-xs bg-dash-accent text-white rounded-lg hover:bg-dash-accent-mid transition-colors font-semibold tracking-tight">
                            Agendar conversa
                        </button>
                    </Link>
                </div>
            </div>

            {/* User profile footer */}
            <div className="px-4 pb-4 border-t border-dash-border pt-3">
                <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-dash-surface-active transition-colors text-left"
                >
                    <div className="w-7 h-7 rounded-full bg-dash-accent flex items-center justify-center shrink-0">
                        <User className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-semibold text-dash-text truncate">
                            {session?.user?.name ?? "Meu Perfil"}
                        </div>
                        <div className="text-[10px] text-dash-text-light truncate">
                            {session?.user?.email ?? ""}
                        </div>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-dash-text-light transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {showUserMenu && (
                    <div className="mt-1 bg-dash-surface border border-dash-border rounded-xl shadow-md overflow-hidden">
                        <Link href="/dashboard/assinatura" className="flex items-center gap-2 px-3 py-2.5 text-[12px] text-dash-text hover:bg-dash-surface-active transition-colors">
                            <CreditCard className="w-3.5 h-3.5 opacity-60" />
                            Minha assinatura
                        </Link>
                        <button
                            onClick={() => signOut({ callbackUrl: '/login' })}
                            className="w-full flex items-center gap-2 px-3 py-2.5 text-[12px] text-dash-danger hover:bg-dash-danger-light transition-colors"
                        >
                            <LogOut className="w-3.5 h-3.5 opacity-60" />
                            Sair
                        </button>
                    </div>
                )}
            </div>
        </aside>

        {showUpgradeModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-dash-border/40 backdrop-blur-sm" onClick={() => setShowUpgradeModal(false)} />
                <div className="relative w-full max-w-md bg-dash-surface border border-dash-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
                    <div className="p-6">
                        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-4">
                            <Lock className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-dash-text mb-2">Faça o Upgrade para acessar</h3>
                        <p className="text-dash-text-muted text-sm mb-6">
                            Esta funcionalidade é exclusiva para assinantes do plano ARVO PRO. Libere acesso completo à plataforma.
                        </p>
                        <ul className="space-y-3 mb-8">
                            {['Carteiras recomendadas ARVO', 'Agendamento de reuniões 1:1', 'Análise de carteira inteligente'].map(benefit => (
                                <li key={benefit} className="flex items-center gap-2 text-sm text-dash-text-light">
                                    <Check className="w-4 h-4 text-emerald-500" /> {benefit}
                                </li>
                            ))}
                        </ul>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setShowUpgradeModal(false)} className="flex-1 py-2.5 text-sm font-semibold text-dash-text-light hover:text-dash-text transition-colors">
                                Agora não
                            </button>
                            <Link href="/dashboard/assinatura" onClick={() => setShowUpgradeModal(false)} className="flex-1 text-center py-2.5 text-sm font-semibold bg-dash-accent text-white rounded-xl hover:bg-dash-accent/90 transition-colors shadow-md">
                                Ver planos
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )}
        </>
    )
}
