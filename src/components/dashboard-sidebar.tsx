"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard, Wallet, BookOpen, HelpCircle,
    Target, CreditCard, User, BarChart3, LogOut, ChevronDown, Calculator, TrendingUp, Lock, Check, Menu, X, Compass, Map
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
    onClick?: () => void
}

function NavLink({ href, icon, label, exact, locked, onLockedClick, onClick }: NavItem) {
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
            onClick={onClick}
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const closeMobileMenu = () => setIsMobileMenuOpen(false)

    return (
        <>
        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-dash-surface border-b border-dash-border flex items-center justify-between px-4 z-30">
            <Link href="/dashboard" onClick={closeMobileMenu}>
                <Image src="/meu-arvo-logo.png" alt="meuARVO" width={100} height={28} className="object-contain" />
            </Link>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-dash-text hover:bg-dash-surface-active rounded-lg">
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
        </div>

        {/* Mobile Backdrop */}
        {isMobileMenuOpen && (
            <div className="md:hidden fixed inset-0 bg-dash-border/60 backdrop-blur-sm z-40" onClick={closeMobileMenu} />
        )}

        <aside className={`w-[232px] bg-dash-surface border-r border-dash-border flex flex-col shrink-0 fixed top-0 left-0 h-screen font-sans z-50 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
            {/* Logo */}
            <div className="px-6 py-5 border-b border-dash-border">
                <Link href="/dashboard">
                    <Image src="/meu-arvo-logo.png" alt="meuARVO" width={110} height={32} className="object-contain" />
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold text-dash-text-light uppercase tracking-widest px-3 py-2 mt-1">Principal</span>

                <NavLink href="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} label="Visão Geral" exact onClick={closeMobileMenu} />
                <NavLink href="/dashboard/carteira" icon={<Wallet className="w-4 h-4" />} label="Minha Carteira" onClick={closeMobileMenu} />
                <NavLink href="/dashboard/carteira-2" icon={<Wallet className="w-4 h-4" />} label="Minha Carteira 2" onClick={closeMobileMenu} />
                <NavLink href="/dashboard/planejamento" icon={<Calculator className="w-4 h-4" />} label="Calculadora Pl." onClick={closeMobileMenu} />
                <NavLink href="/dashboard/jornada" icon={<Map className="w-4 h-4" />} label="Jornada" onClick={closeMobileMenu} />
                <NavLink href="/dashboard/portfolios" icon={<BarChart3 className="w-4 h-4" />} label="Portfólios ARVO" onClick={closeMobileMenu} />
                <NavLink href="/dashboard/bussola" icon={<Compass className="w-4 h-4" />} label="Bússola de Risco" onClick={closeMobileMenu} />
                <NavLink href="/dashboard/calculadoras" icon={<Calculator className="w-4 h-4" />} label="Calculadoras" onClick={closeMobileMenu} />

                <span className="text-[10px] font-semibold text-dash-text-light uppercase tracking-widest px-3 py-2 mt-4">Aprendizado</span>
                <NavLink href="/dashboard/educacao" icon={<BookOpen className="w-4 h-4" />} label="Educação" onClick={closeMobileMenu} />
                <NavLink href="/dashboard/markowitz" icon={<TrendingUp className="w-4 h-4" />} label="Análise Markowitz" onClick={closeMobileMenu} />

                <span className="text-[10px] font-semibold text-dash-text-light uppercase tracking-widest px-3 py-2 mt-4">Conta & Contato</span>
                <NavLink href="/dashboard/assinatura" icon={<CreditCard className="w-4 h-4" />} label="Assinatura" onClick={closeMobileMenu} />
                <NavLink href="/dashboard/agendamento" icon={<HelpCircle className="w-4 h-4" />} label="Agendamento" onClick={closeMobileMenu} />
                <NavLink href="/dashboard/ajuda" icon={<HelpCircle className="w-4 h-4 opacity-0" />} label="Ajuda" onClick={closeMobileMenu} />
            </nav>

            {/* Assessor Card */}
            <div className="px-4 pb-2">
                <div className="bg-dash-accent-light rounded-xl p-3.5 mb-3">
                    <div className="text-[13px] font-semibold text-dash-accent leading-tight">Equipe ARVO</div>
                    <div className="text-[11px] text-dash-accent-mid mt-0.5">Lucas Matos, CFP®</div>
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
                    <div className="w-8 h-8 rounded-full bg-dash-accent flex items-center justify-center shrink-0 overflow-hidden">
                        <img src="/arvo-simbolo-blue.png" alt="ARVO" className="w-full h-full object-cover" />
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
