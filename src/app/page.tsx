import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import { HomePage } from "@/components/home/HomePage";
import "@/styles/home.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const interTight = Inter_Tight({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-inter-tight", display: "swap" });

export const metadata: Metadata = {
  title: "ARVO | Orientação Financeira Independente",
  description:
    "Planejamento financeiro completo e orientação de investimentos fee-only. Descubra em 5 minutos quando seu dinheiro pode trabalhar por você.",
};

export default function Page() {
  return (
    <div className={`${inter.variable} ${interTight.variable}`}>
      <HomePage />
    </div>
  );
}
