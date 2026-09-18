"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PlanejamentoContent from "../planejamento/page";
import { CalculadoraJurosCompostos } from "@/components/calculators/juros-compostos";
import { CalculadoraFinanciamento } from "@/components/calculators/financiamento";
import ComparadorPage from "../comparador/page";
import CalculadoraInflacao from "@/components/calculators/inflacao";
import { CalculadoraMinhaInflacaoReal } from "@/components/calculators/minha-inflacao-real";
import { CalculadoraAposentadoriaBase } from "@/components/calculators/aposentadoria-base";
import { Calculator, TrendingUp, Home, ArrowLeftRight, Percent, Shield } from "lucide-react";

function StairsIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 19h4v-4h4v-4h4V7h4" />
        </svg>
    );
}

export type CalculadoraTab = "aposentadoria-base" | "inflacao-real" | "pl" | "compostos" | "financiamento" | "comparador" | "inflacao";

function CalculadorasHubInner() {
    const searchParams = useSearchParams();
    const tabParam = searchParams.get("tab") as CalculadoraTab | null;
    const [activeTab, setActiveTab] = useState<CalculadoraTab>("aposentadoria-base");

    useEffect(() => {
        if (tabParam && ["aposentadoria-base", "inflacao-real", "pl", "compostos", "financiamento", "comparador", "inflacao"].includes(tabParam)) {
            setActiveTab(tabParam);
        }
    }, [tabParam]);

    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12 pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-dash-text flex items-center gap-3">
                        <Calculator className="h-6 w-6 text-dash-accent" />
                        Calculadoras ARVO
                    </h1>
                    <p className="text-sm text-dash-text-light mt-1">
                        Ferramentas interativas para simular cenários e apoiar sua tomada de decisão financeira.
                    </p>
                </div>
            </div>

            <div className="bg-dash-surface border border-dash-border p-1.5 rounded-[16px] flex flex-wrap gap-2 w-full shadow-sm">
                <button
                    onClick={() => setActiveTab("aposentadoria-base")}
                    className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === "aposentadoria-base"
                        ? "bg-dash-accent text-white shadow-md scale-[1.02]"
                        : "text-dash-text-muted hover:text-dash-text hover:bg-dash-surface-active"
                        }`}
                >
                    <Shield className="w-4 h-4" />
                    Aposentadoria Base
                </button>
                <button
                    onClick={() => setActiveTab("inflacao-real")}
                    className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === "inflacao-real"
                        ? "bg-dash-accent text-white shadow-md scale-[1.02]"
                        : "text-dash-text-muted hover:text-dash-text hover:bg-dash-surface-active"
                        }`}
                >
                    <StairsIcon className="w-4 h-4" />
                    Minha Inflação Real
                </button>
                <button
                    onClick={() => setActiveTab("pl")}
                    className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === "pl"
                        ? "bg-dash-accent text-white shadow-md scale-[1.02]"
                        : "text-dash-text-muted hover:text-dash-text hover:bg-dash-surface-active"
                        }`}
                >
                    <TrendingUp className="w-4 h-4" />
                    Plano Patrimonial
                </button>
                <button
                    onClick={() => setActiveTab("compostos")}
                    className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === "compostos"
                        ? "bg-dash-accent text-white shadow-md scale-[1.02]"
                        : "text-dash-text-muted hover:text-dash-text hover:bg-dash-surface-active"
                        }`}
                >
                    <Percent className="w-4 h-4" />
                    Juros Compostos
                </button>
                <button
                    onClick={() => setActiveTab("financiamento")}
                    className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === "financiamento"
                        ? "bg-dash-accent text-white shadow-md scale-[1.02]"
                        : "text-dash-text-muted hover:text-dash-text hover:bg-dash-surface-active"
                        }`}
                >
                    <Home className="w-4 h-4" />
                    Comprar vs Alugar
                </button>
                <button
                    onClick={() => setActiveTab("comparador")}
                    className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === "comparador"
                        ? "bg-dash-accent text-white shadow-md scale-[1.02]"
                        : "text-dash-text-muted hover:text-dash-text hover:bg-dash-surface-active"
                        }`}
                >
                    <ArrowLeftRight className="w-4 h-4" />
                    Comparador de Ativos
                </button>
                <button
                    onClick={() => setActiveTab("inflacao")}
                    className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === "inflacao"
                        ? "bg-dash-accent text-white shadow-md scale-[1.02]"
                        : "text-dash-text-muted hover:text-dash-text hover:bg-dash-surface-active"
                        }`}
                >
                    <Calculator className="w-4 h-4" />
                    Correção Histórica
                </button>
            </div>

            {/* Container principal das calculadoras */}
            <div className={`mt-2 ${activeTab === 'comparador' || activeTab === 'pl' || activeTab === 'inflacao-real' || activeTab === 'aposentadoria-base' ? '' : 'bg-dash-surface rounded-[24px] p-6 lg:p-8 overflow-hidden shadow-sm border border-dash-border'}`}>
                {activeTab === "aposentadoria-base" && <CalculadoraAposentadoriaBase />}
                {activeTab === "inflacao-real" && <CalculadoraMinhaInflacaoReal />}
                {activeTab === "pl" && (
                    <div className="bg-white border border-[#e4e0d7] rounded-[28px] p-6 md:p-10 shadow-xs">
                        <PlanejamentoContent />
                    </div>
                )}
                {activeTab === "compostos" && <CalculadoraJurosCompostos />}
                {activeTab === "financiamento" && <CalculadoraFinanciamento />}
                {activeTab === "comparador" && (
                    <div className="bg-white rounded-3xl overflow-hidden mt-0 -mx-4 sm:mx-0">
                        <ComparadorPage />
                    </div>
                )}
                {activeTab === "inflacao" && (
                    <div className="bg-white rounded-3xl overflow-hidden mt-0 -mx-4 sm:mx-0">
                        <CalculadoraInflacao />
                    </div>
                )}
            </div>
        </div>
    );
}

export default function CalculadorasHubPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-sm text-dash-text-muted">Carregando calculadoras...</div>}>
            <CalculadorasHubInner />
        </Suspense>
    );
}

