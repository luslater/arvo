"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Map, Wallet, Calculator, Menu } from "lucide-react";

interface MobileBottomNavProps {
    onOpenMenu: () => void;
}

export function MobileBottomNav({ onOpenMenu }: MobileBottomNavProps) {
    const pathname = usePathname();

    const navItems = [
        {
            href: "/dashboard/jornada",
            label: "Jornada",
            icon: Map,
            isActive: pathname.startsWith("/dashboard/jornada"),
        },
        {
            href: "/dashboard/bussola",
            label: "Bússola",
            icon: Compass,
            isActive: pathname.startsWith("/dashboard/bussola"),
        },
        {
            href: "/dashboard/carteira",
            label: "Carteira",
            icon: Wallet,
            isActive: pathname === "/dashboard/carteira",
        },
        {
            href: "/dashboard/calculadoras",
            label: "Calculadora",
            icon: Calculator,
            isActive: pathname.startsWith("/dashboard/calculadoras") || pathname.startsWith("/dashboard/planejamento"),
        },
    ];

    return (
        <nav
            aria-label="Navegação Principal do App"
            className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#fffdf8]/95 backdrop-blur-xl border-t border-[#e4e0d7] shadow-[0_-8px_24px_rgba(18,48,68,0.06)] px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]"
        >
            <div className="grid grid-cols-5 items-center justify-around max-w-md mx-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-200 active:scale-95 ${
                                item.isActive
                                    ? "text-[#1f674f] font-bold"
                                    : "text-[#8d97a5] hover:text-[#123044] font-medium"
                            }`}
                        >
                            <div
                                className={`w-9 h-7 flex items-center justify-center rounded-xl transition-colors ${
                                    item.isActive
                                        ? "bg-[#e8f1ed] text-[#1f674f]"
                                        : "bg-transparent text-current"
                                }`}
                            >
                                <Icon className={`w-4 h-4 ${item.isActive ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
                            </div>
                            <span className="text-[10px] tracking-tight mt-0.5 leading-none">
                                {item.label}
                            </span>
                            {item.isActive && (
                                <span className="w-1 h-1 rounded-full bg-[#1f674f] mt-1" />
                            )}
                        </Link>
                    );
                })}

                {/* Botão Menu / Drawer */}
                <button
                    type="button"
                    onClick={onOpenMenu}
                    className="flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl text-[#8d97a5] hover:text-[#123044] font-medium transition-all duration-200 active:scale-95"
                >
                    <div className="w-9 h-7 flex items-center justify-center rounded-xl bg-transparent">
                        <Menu className="w-4 h-4 stroke-[1.75]" />
                    </div>
                    <span className="text-[10px] tracking-tight mt-0.5 leading-none">
                        Mais
                    </span>
                </button>
            </div>
        </nav>
    );
}
