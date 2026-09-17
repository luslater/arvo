import { CalculadoraMinhaInflacaoReal } from "@/components/calculators/minha-inflacao-real";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculadora de Inflação | ARVO",
  description: "Estime o impacto real da inflação no seu padrão de vida e cesta de consumo com a ARVO.",
};

export default function InflacaoPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12 pt-2">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/calculadoras"
          className="inline-flex items-center gap-2 text-xs font-semibold text-dash-text-muted hover:text-dash-accent transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar para Central de Calculadoras
        </Link>
      </div>

      <CalculadoraMinhaInflacaoReal />
    </div>
  );
}
