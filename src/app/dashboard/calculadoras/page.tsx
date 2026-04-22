"use client";

import { useState } from "react";
import { CalculadoraJurosCompostos } from "@/components/calculators/juros-compostos";
import { CalculadoraFinanciamento } from "@/components/calculators/financiamento";
import { Calculator } from "lucide-react";

export default function CalculadorasHubPage() {
    const [activeTab, setActiveTab] = useState<"compostos" | "financiamento">("compostos");

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

            <div className="bg-dash-surface border border-dash-border p-1.5 rounded-[14px] flex gap-2 w-full md:w-max shadow-sm">
                <button
                    onClick={() => setActiveTab("compostos")}
                    className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === "compostos"
                        ? "bg-dash-accent text-white shadow-md scale-[1.02]"
                        : "text-dash-text-muted hover:text-dash-text hover:bg-dash-surface-active"
                        }`}
                >
                    Juros Compostos
                </button>
                <button
                    onClick={() => setActiveTab("financiamento")}
                    className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === "financiamento"
                        ? "bg-dash-accent text-white shadow-md scale-[1.02]"
                        : "text-dash-text-muted hover:text-dash-text hover:bg-dash-surface-active"
                        }`}
                >
                    Comprar vs Alugar
                </button>
            </div>

            {/* Container principal das calculadoras */}
            <div className="mt-4 bg-dash-surface rounded-[24px] p-6 lg:p-8 overflow-hidden shadow-sm border border-dash-border">
                {activeTab === "compostos" && <CalculadoraJurosCompostos />}
                {activeTab === "financiamento" && <CalculadoraFinanciamento />}
            </div>
        </div>
    );
}
