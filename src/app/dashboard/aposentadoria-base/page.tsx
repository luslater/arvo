import { CalculadoraAposentadoriaBase } from "@/components/calculators/aposentadoria-base";
import Link from "next/link";
import { ArrowLeft, Calculator } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aposentadoria Base | ARVO",
  description: "Calculadora de Aposentadoria Base e Coast FIRE com as carteiras de modelo ARVO.",
};

export default function AposentadoriaBasePage() {
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

      <CalculadoraAposentadoriaBase />
    </div>
  );
}
