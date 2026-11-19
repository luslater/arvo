import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";
import "@/styles/home.css";

export const metadata: Metadata = {
  title: "ARVO | Orientação Financeira Independente",
  description:
    "Planejamento financeiro completo e orientação de investimentos fee-only. Descubra em 5 minutos quando seu dinheiro pode trabalhar por você.",
};

export default function Page() {
  return <HomePage />;
}
