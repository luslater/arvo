"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Percent,
  Sparkles,
  CreditCard,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Info,
  Layers,
  HelpCircle,
  PiggyBank,
  Compass,
  ArrowRight,
  Home,
  Utensils,
  Car,
  HeartPulse,
  GraduationCap,
  Wifi,
  ShoppingBag,
  Tv
} from "lucide-react";
import { InvoiceImportModal } from "./invoice-import-modal";
import { ExtractedInvoiceTransaction } from "@/app/api/extract/invoice/route";
import Link from "next/link";

interface RaioXFluxoCaixaProps {
  formData: Record<string, string>;
  onChange: (name: string, value: string) => void;
  onBulkChange?: (updates: Record<string, string>) => void;
}

interface ExpenseGroupDef {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  desc: string;
  items: { id: string; label: string }[];
}

// ─── ESTRUTURA DOS GRUPOS DE GASTOS COMPATÍVEIS COM A CALCULADORA DE INFLAÇÃO ───
export const EXPENSE_GROUPS_DEF: ExpenseGroupDef[] = [
  {
    id: "habitacao",
    label: "Moradia & Habitação",
    icon: Home,
    color: "#2B6E76",
    desc: "Aluguel, condomínio, contas de consumo e manutenção",
    items: [
      { id: "aluguel", label: "Aluguel residencial" },
      { id: "condominio", label: "Condomínio" },
      { id: "energia", label: "Energia elétrica residencial" },
      { id: "gas", label: "Gás (botijão ou encanado)" },
      { id: "agua", label: "Água e esgoto" },
      { id: "iptu_manutencao", label: "IPTU e manutenção do imóvel" }
    ]
  },
  {
    id: "alimentacao",
    label: "Alimentação",
    icon: Utensils,
    color: "#1F674F",
    desc: "Mercado, feira, delivery e refeições fora",
    items: [
      { id: "supermercado", label: "Supermercado, açougue e feira" },
      { id: "restaurante", label: "Restaurantes, lanchonetes e delivery (iFood/Rappi)" },
      { id: "alimentacao_outros", label: "Padaria, cafeteria e outros" }
    ]
  },
  {
    id: "transportes",
    label: "Transportes",
    icon: Car,
    color: "#2E5C6E",
    desc: "Combustível, transporte por app, seguros e manutenção",
    items: [
      { id: "combustivel", label: "Combustível (gasolina / etanol / diesel)" },
      { id: "app", label: "Transporte por aplicativo (Uber / 99 / táxi)" },
      { id: "onibus", label: "Transporte público (ônibus / metrô / trem)" },
      { id: "seguro_auto", label: "Seguro auto e taxas (IPVA / licenciamento)" },
      { id: "manutencao_auto", label: "Manutenção mecânica e estacionamento" },
      { id: "aviao", label: "Passagens aéreas e viagens" }
    ]
  },
  {
    id: "saude",
    label: "Saúde & Cuidados",
    icon: HeartPulse,
    color: "#1D7070",
    desc: "Plano de saúde, medicamentos, consultas e bem-estar",
    items: [
      { id: "plano", label: "Plano de saúde (individual, familiar ou coparticipação)" },
      { id: "remedios", label: "Medicamentos e produtos farmacêuticos" },
      { id: "cabeleireiro", label: "Cuidados pessoais, barbearia, estética e academia" },
      { id: "saude_outros", label: "Consultas particulares, exames e odontologia" }
    ]
  },
  {
    id: "educacao",
    label: "Educação & Aperfeiçoamento",
    icon: GraduationCap,
    color: "#435B66",
    desc: "Escola, faculdade, cursos e livros",
    items: [
      { id: "mensalidade", label: "Mensalidade escolar / faculdade / pós-graduação" },
      { id: "cursos", label: "Cursos livres, idiomas e treinamentos profissionais" },
      { id: "material_livros", label: "Material didático, livros e uniformes" }
    ]
  },
  {
    id: "comunicacao",
    label: "Comunicação & Tecnologia",
    icon: Wifi,
    color: "#526E7A",
    desc: "Internet, celular e assinaturas de streaming",
    items: [
      { id: "internet", label: "Internet banda larga e Wi-Fi" },
      { id: "streaming", label: "Streaming (Netflix, Spotify, Prime, Max, etc.)" },
      { id: "comunicacao_outros", label: "Telefonia celular e serviços na nuvem" }
    ]
  },
  {
    id: "despesas",
    label: "Estilo de Vida & Família",
    icon: Sparkles,
    color: "#7C5A60",
    desc: "Lazer, passeios, empregada doméstica e pets",
    items: [
      { id: "lazer", label: "Lazer, passeios, cinema, shows e bares" },
      { id: "domestica", label: "Empregada doméstica / diarista" },
      { id: "estilo_outros", label: "Pet care (ração, veterinário), presentes e diversos" }
    ]
  },
  {
    id: "artigos",
    label: "Artigos do Lar & Vestuário",
    icon: Tv,
    color: "#475569",
    desc: "Vestuário, calçados, eletrônicos e compras para casa",
    items: [
      { id: "roupas", label: "Roupas, calçados e acessórios" },
      { id: "eletro", label: "Eletrônicos e eletrodomésticos" },
      { id: "moveis", label: "Móveis e utensílios domésticos" }
    ]
  },
  {
    id: "dividas",
    label: "Compromissos Financeiros & Dívidas",
    icon: CreditCard,
    color: "#EF4444",
    desc: "Financiamentos, empréstimos e parcelamentos",
    items: [
      { id: "financiamento_imobiliario", label: "Parcela de financiamento imobiliário" },
      { id: "financiamento_veiculo", label: "Parcela de financiamento de veículo" },
      { id: "emprestimo_consignado", label: "Empréstimo consignado ou pessoal" },
      { id: "fatura_cartao_parcelas", label: "Parcelamentos no cartão de crédito / rotativo" }
    ]
  }
];


// Taxas anuais médias do IBGE para a calculadora rápida embutida
const IBGE_RATES: Record<string, number> = {
  aluguel: 4.89,
  condominio: 3.72,
  energia: 8.85,
  gas: 3.92,
  agua: 6.40,
  iptu_manutencao: 5.93,
  supermercado: 2.57,
  restaurante: 5.55,
  alimentacao_outros: 3.40,
  combustivel: 4.76,
  app: 16.15,
  onibus: 3.68,
  seguro_auto: -8.58,
  manutencao_auto: 3.64,
  aviao: 41.89,
  plano: 5.87,
  remedios: 4.22,
  cabeleireiro: 7.71,
  saude_outros: 6.16,
  mensalidade: 7.05,
  cursos: 5.05,
  material_livros: 6.27,
  internet: 0.50,
  streaming: 6.19,
  comunicacao_outros: 1.96,
  lazer: 4.38,
  domestica: 6.28,
  estilo_outros: 5.22,
  roupas: 2.31,
  eletro: -5.45,
  moveis: 1.59,
  financiamento_imobiliario: 4.50,
  financiamento_veiculo: 4.50,
  emprestimo_consignado: 4.50,
  fatura_cartao_parcelas: 4.50
};

export function RaioXFluxoCaixa({ formData, onChange, onBulkChange }: RaioXFluxoCaixaProps) {
  const [activeTab, setActiveTab] = useState<"entradas" | "gastos" | "alertas" | "inflacao">("entradas");
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    habitacao: true,
    alimentacao: true,
    transportes: true
  });

  const parseNum = (val?: string | number): number => {
    if (typeof val === "number") return val;
    if (!val) return 0;
    const clean = val.toString().replace(/\D/g, "");
    if (!clean) return 0;
    return parseInt(clean, 10) / 100;
  };

  const formatBRL = (val: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

  const formatCurrencyInput = (val: string) => {
    const clean = val.replace(/\D/g, "");
    if (!clean) return "";
    const num = parseInt(clean, 10) / 100;
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(num);
  };

  // ─── 1. CÁLCULO DAS ENTRADAS CLASSIFICADAS ──────────────────────────────────
  const incomeDetails = useMemo(() => {
    const clt = parseNum(formData.rendaClt);
    const proLabore = parseNum(formData.rendaProLabore);
    const lucros = parseNum(formData.rendaLucrosDividendos);
    const alugueis = parseNum(formData.rendaAlugueis);
    const investimentos = parseNum(formData.rendaInvestimentos);
    const pensao = parseNum(formData.rendaPensaoAposentadoria);
    const extra = parseNum(formData.rendaExtraFreelance);

    let customTotal = 0;
    let customList: Array<{ id: string; name: string; value: string }> = [];
    if (formData.customIncomesJson) {
      try {
        const parsed = JSON.parse(formData.customIncomesJson);
        if (Array.isArray(parsed)) {
          customList = parsed;
          customTotal = parsed.reduce((sum, item) => sum + parseNum(item.value), 0);
        }
      } catch (e) {}
    }

    const classifiedTotal = clt + proLabore + lucros + alugueis + investimentos + pensao + extra + customTotal;
    
    // Fallback legado se usuário ainda não preencheu as novas entradas
    let total = classifiedTotal;
    if (classifiedTotal === 0) {
      total = parseNum(formData.salarioLiquido) + parseNum(formData.rendaVariavel);
    }

    return {
      clt,
      proLabore,
      lucros,
      alugueis,
      investimentos,
      pensao,
      extra,
      customTotal,
      customList,
      total
    };
  }, [formData]);

  // ─── 2. CÁLCULO DOS GASTOS AMPLIADOS (CESTA DE CONSUMO) ──────────────────────
  const expenseDetails = useMemo(() => {
    const byItem: Record<string, number> = {};
    const byGroup: Record<string, number> = {};
    let totalDetailed = 0;

    EXPENSE_GROUPS_DEF.forEach((group) => {
      let groupSum = 0;
      group.items.forEach((item) => {
        const val = parseNum(formData[`gasto_${item.id}`]);
        byItem[item.id] = val;
        groupSum += val;
      });
      byGroup[group.id] = groupSum;
      totalDetailed += groupSum;
    });

    // Gastos customizados adicionais
    let customTotal = 0;
    let customList: Array<{ id: string; name: string; value: string }> = [];
    if (formData.customExpensesJson) {
      try {
        const parsed = JSON.parse(formData.customExpensesJson);
        if (Array.isArray(parsed)) {
          customList = parsed;
          customTotal = parsed.reduce((sum, item) => sum + parseNum(item.value), 0);
        }
      } catch (e) {}
    }

    let finalTotal = totalDetailed + customTotal;

    // Fallback legado se o usuário ainda não tiver preenchido os itens da cesta
    if (totalDetailed === 0) {
      const legacyTotal =
        parseNum(formData.gastoMoradia) +
        parseNum(formData.gastoAlimentacao) +
        parseNum(formData.gastoTransporte) +
        parseNum(formData.gastoSaude) +
        parseNum(formData.parcelasDividas) +
        customTotal;
      if (legacyTotal > 0) {
        finalTotal = legacyTotal;
      }
    }

    return {
      byItem,
      byGroup,
      totalDetailed,
      customTotal,
      customList,
      total: finalTotal
    };
  }, [formData]);

  // Sincroniza dados agregados com as chaves globais da Jornada e Perfil
  useEffect(() => {
    if (incomeDetails.total > 0 && !formData.salarioLiquido) {
      onChange("salarioLiquido", formatBRL(incomeDetails.total));
    }
  }, [incomeDetails.total]);

  // ─── 3. CAPACIDADE DE APORTE E INDICADORES DE CONTROLE ────────────────────────
  const totalIncomes = incomeDetails.total;
  const totalExpenses = expenseDetails.total;
  const monthlySavings = Math.max(0, totalIncomes - totalExpenses);
  const savingsRate = totalIncomes > 0 ? (monthlySavings / totalIncomes) * 100 : 0;

  // Reserva de Emergência
  const currentReserve = parseNum(formData.reservaAtual);
  const isVariavel = ["PJ", "Autônomo", "Empresário", "Misto"].includes(formData.tipoVinculo || "");
  const recommendedMonths = isVariavel ? 12 : 6;
  const targetReserve = totalExpenses * recommendedMonths;
  const reserveMonthsCoverage = totalExpenses > 0 ? currentReserve / totalExpenses : 0;

  // Regra 50-30-20
  const essentialExpenses =
    (expenseDetails.byGroup["habitacao"] || 0) +
    (expenseDetails.byItem["supermercado"] || 0) +
    (expenseDetails.byGroup["saude"] || 0) +
    (expenseDetails.byItem["combustivel"] || 0) +
    (expenseDetails.byItem["onibus"] || 0) +
    (expenseDetails.byItem["mensalidade"] || 0);

  const lifestyleExpenses = Math.max(0, totalExpenses - essentialExpenses);
  const essentialPct = totalIncomes > 0 ? (essentialExpenses / totalIncomes) * 100 : 0;
  const lifestylePct = totalIncomes > 0 ? (lifestyleExpenses / totalIncomes) * 100 : 0;

  // ─── 4. ALERTA E DIAGNÓSTICO PREVENTIVO ─────────────────────────────────────
  const alerts = useMemo(() => {
    const list: Array<{
      type: "danger" | "warning" | "success" | "info";
      title: string;
      desc: string;
      metric?: string;
    }> = [];

    // Alerta Moradia
    const housingTotal = expenseDetails.byGroup["habitacao"] || parseNum(formData.gastoMoradia);
    const housingPct = totalIncomes > 0 ? (housingTotal / totalIncomes) * 100 : 0;
    if (housingPct > 35) {
      list.push({
        type: "danger",
        title: "Comprometimento Excessivo com Moradia",
        desc: `Seus custos habitacionais consom ${housingPct.toFixed(1)}% da sua renda líquida (o teto prudencial é 30%). Isso engessa seu orçamento.`,
        metric: `${housingPct.toFixed(1)}% da renda`
      });
    } else if (housingPct > 30) {
      list.push({
        type: "warning",
        title: "Atenção aos Custos com Moradia",
        desc: `Moradia em ${housingPct.toFixed(1)}% da renda. Monitore contas de energia, condomínio e manutenção.`,
        metric: `${housingPct.toFixed(1)}% da renda`
      });
    }

    // Alerta Dívidas
    const debtTotal = expenseDetails.byGroup["dividas"] || parseNum(formData.parcelasDividas);
    const debtPct = totalIncomes > 0 ? (debtTotal / totalIncomes) * 100 : 0;
    if (debtPct > 20) {
      list.push({
        type: "danger",
        title: "Pressão Crítica de Dívidas / Financiamentos",
        desc: `Dívidas consom ${debtPct.toFixed(1)}% do seu fluxo mensal. Priorize amortizações extraordinárias antes de alocações de risco.`,
        metric: `${debtPct.toFixed(1)}% da renda`
      });
    }

    // Alerta Ralos Invisíveis (Delivery + Streaming + Pequenas Compras)
    const hiddenLeaks =
      (expenseDetails.byItem["restaurante"] || 0) +
      (expenseDetails.byItem["streaming"] || 0) +
      (expenseDetails.byItem["roupas"] || 0) +
      (expenseDetails.byItem["lazer"] || 0);
    const hiddenLeaksPct = totalIncomes > 0 ? (hiddenLeaks / totalIncomes) * 100 : 0;
    if (hiddenLeaksPct > 15 && totalIncomes > 0) {
      list.push({
        type: "warning",
        title: "Ralos Invisíveis em Delivery, Streaming e Compras",
        desc: `Gastos discricionários recorrentes somam ${formatBRL(hiddenLeaks)}/mês (${hiddenLeaksPct.toFixed(1)}% da renda). Pequenas otimizações aqui destravam grandes aportes.`,
        metric: formatBRL(hiddenLeaks) + "/mês"
      });
    }

    // Alerta Reserva de Emergência
    if (totalExpenses > 0) {
      if (reserveMonthsCoverage < 3) {
        list.push({
          type: "danger",
          title: "Reserva de Emergência em Nível Vulnerável",
          desc: `Você possui cobertura para apenas ${reserveMonthsCoverage.toFixed(1)} meses de custo de vida. Sua meta técnica recomendada é de ${recommendedMonths} meses (${formatBRL(targetReserve)}).`,
          metric: `${reserveMonthsCoverage.toFixed(1)} meses`
        });
      } else if (reserveMonthsCoverage < recommendedMonths) {
        list.push({
          type: "warning",
          title: "Reserva em Construção",
          desc: `Você tem ${reserveMonthsCoverage.toFixed(1)} de ${recommendedMonths} meses recomendados para o seu perfil profissional (${formData.tipoVinculo || "CLT"}).`,
          metric: `${reserveMonthsCoverage.toFixed(1)}/${recommendedMonths} meses`
        });
      } else {
        list.push({
          type: "success",
          title: "Reserva de Emergência Blindada",
          desc: `Excelente! Sua reserva de ${formatBRL(currentReserve)} cobre ${reserveMonthsCoverage.toFixed(1)} meses de custos de vida, garantindo estabilidade para investir no longo prazo.`,
          metric: `${reserveMonthsCoverage.toFixed(1)} meses`
        });
      }
    }

    // Alerta Taxa de Poupança
    if (totalIncomes > 0) {
      if (savingsRate >= 25) {
        list.push({
          type: "success",
          title: "Taxa de Poupança de Alta Performance",
          desc: `Você poupa ${savingsRate.toFixed(1)}% da sua renda líquida todo mês (${formatBRL(monthlySavings)}). Ritmo excepcional de acumulação patrimonial.`,
          metric: `${savingsRate.toFixed(1)}% poupado`
        });
      } else if (savingsRate < 10 && totalExpenses <= totalIncomes) {
        list.push({
          type: "warning",
          title: "Capacidade de Poupança Limitada",
          desc: `Você está poupando apenas ${savingsRate.toFixed(1)}% da renda. Ajustar 1 ou 2 grupos permitirá acelerar sua rota para a independência.`,
          metric: `${savingsRate.toFixed(1)}% poupado`
        });
      } else if (totalExpenses > totalIncomes) {
        list.push({
          type: "danger",
          title: "Déficit Operacional no Mês",
          desc: `Seus gastos mensais superam suas entradas em ${formatBRL(totalExpenses - totalIncomes)}. Você está desacumulando patrimônio.`,
          metric: `-${formatBRL(totalExpenses - totalIncomes)}/mês`
        });
      }
    }

    return list;
  }, [totalIncomes, totalExpenses, expenseDetails, reserveMonthsCoverage, recommendedMonths, targetReserve, currentReserve, savingsRate, formData.tipoVinculo]);

  // ─── 5. CÁLCULO EMBUTIDO DA INFLAÇÃO PESSOAL DA CESTA ─────────────────────────
  const personalInflationMetrics = useMemo(() => {
    let totalExpenseBasket = 0;
    let weightedInflationSum = 0;
    const itemBreakdown: Array<{ id: string; label: string; expense: number; weightPct: number; ratePct: number; impact: number }> = [];

    EXPENSE_GROUPS_DEF.forEach((group) => {
      group.items.forEach((item) => {
        const val = expenseDetails.byItem[item.id] || 0;
        if (val > 0) {
          totalExpenseBasket += val;
          const rate = IBGE_RATES[item.id] ?? 4.50;
          itemBreakdown.push({
            id: item.id,
            label: item.label,
            expense: val,
            weightPct: 0,
            ratePct: rate,
            impact: 0
          });
        }
      });
    });

    if (totalExpenseBasket > 0) {
      itemBreakdown.forEach((it) => {
        it.weightPct = (it.expense / totalExpenseBasket) * 100;
        it.impact = (it.weightPct * it.ratePct) / 100;
        weightedInflationSum += it.impact;
      });
    }

    itemBreakdown.sort((a, b) => b.impact - a.impact);
    const topVillains = itemBreakdown.slice(0, 3);
    const ipcaBenchmark = 4.50;
    const diffIpca = weightedInflationSum - ipcaBenchmark;

    return {
      personalRate: weightedInflationSum,
      ipcaBenchmark,
      diffIpca,
      topVillains,
      hasData: totalExpenseBasket > 0
    };
  }, [expenseDetails]);

  // ─── HANDLERS DE AÇÃO ───────────────────────────────────────────────────────
  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  // Custom Incomes Handlers
  const handleAddCustomIncome = () => {
    const newItem = { id: Date.now().toString(), name: "", value: "" };
    const nextList = [...incomeDetails.customList, newItem];
    onChange("customIncomesJson", JSON.stringify(nextList));
  };

  const handleUpdateCustomIncome = (id: string, key: "name" | "value", val: string) => {
    const nextList = incomeDetails.customList.map((item) =>
      item.id === id ? { ...item, [key]: val } : item
    );
    onChange("customIncomesJson", JSON.stringify(nextList));
  };

  const handleRemoveCustomIncome = (id: string) => {
    const nextList = incomeDetails.customList.filter((item) => item.id !== id);
    onChange("customIncomesJson", JSON.stringify(nextList));
  };

  // Custom Expenses Handlers
  const handleAddCustomExpense = () => {
    const newItem = { id: Date.now().toString(), name: "", value: "" };
    const nextList = [...expenseDetails.customList, newItem];
    onChange("customExpensesJson", JSON.stringify(nextList));
  };

  const handleUpdateCustomExpense = (id: string, key: "name" | "value", val: string) => {
    const nextList = expenseDetails.customList.map((item) =>
      item.id === id ? { ...item, [key]: val } : item
    );
    onChange("customExpensesJson", JSON.stringify(nextList));
  };

  const handleRemoveCustomExpense = (id: string) => {
    const nextList = expenseDetails.customList.filter((item) => item.id !== id);
    onChange("customExpensesJson", JSON.stringify(nextList));
  };

  // Aplicação da fatura de cartão aos campos do Raio-X
  const handleApplyInvoice = (categoryTotals: Record<string, number>, rawTx: ExtractedInvoiceTransaction[]) => {
    const updates: Record<string, string> = {};

    // Mapeamento dos totais das categorias importadas
    if (categoryTotals["habitacao"]) {
      const cur = parseNum(formData.gasto_energia) || 0;
      updates["gasto_energia"] = formatBRL(cur + categoryTotals["habitacao"]);
    }
    if (categoryTotals["alimentacao"]) {
      const cur = parseNum(formData.gasto_supermercado) || 0;
      updates["gasto_supermercado"] = formatBRL(cur + categoryTotals["alimentacao"]);
    }
    if (categoryTotals["transportes"]) {
      const cur = parseNum(formData.gasto_app) || 0;
      updates["gasto_app"] = formatBRL(cur + categoryTotals["transportes"]);
    }
    if (categoryTotals["saude"]) {
      const cur = parseNum(formData.gasto_remedios) || 0;
      updates["gasto_remedios"] = formatBRL(cur + categoryTotals["saude"]);
    }
    if (categoryTotals["comunicacao"]) {
      const cur = parseNum(formData.gasto_streaming) || 0;
      updates["gasto_streaming"] = formatBRL(cur + categoryTotals["comunicacao"]);
    }
    if (categoryTotals["artigos"]) {
      const cur = parseNum(formData.gasto_roupas) || 0;
      updates["gasto_roupas"] = formatBRL(cur + categoryTotals["artigos"]);
    }
    if (categoryTotals["despesas"]) {
      const cur = parseNum(formData.gasto_lazer) || 0;
      updates["gasto_lazer"] = formatBRL(cur + categoryTotals["despesas"]);
    }
    if (categoryTotals["dividas"]) {
      const cur = parseNum(formData.gasto_fatura_cartao_parcelas) || 0;
      updates["gasto_fatura_cartao_parcelas"] = formatBRL(cur + categoryTotals["dividas"]);
    }

    if (onBulkChange) {
      onBulkChange(updates);
    } else {
      Object.entries(updates).forEach(([k, v]) => onChange(k, v));
    }

    // Muda para a aba de gastos para o usuário ver os valores preenchidos
    setActiveTab("gastos");
  };

  return (
    <div className="space-y-6">
      {/* ─── 1. TOP FINANCIAL KPI SUMMARY COCKPIT ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Entradas */}
        <button
          type="button"
          onClick={() => setActiveTab("entradas")}
          className={`text-left bg-white rounded-2xl p-4 shadow-xs transition-all cursor-pointer border-l-4 border-t border-r border-b ${
            activeTab === "entradas"
              ? "border-l-[#1f674f] border-t-[#e4e0d7] border-r-[#e4e0d7] border-b-[#e4e0d7] shadow-sm ring-1 ring-[#1f674f]/10"
              : "border-l-[#e4e0d7] border-t-[#e4e0d7] border-r-[#e4e0d7] border-b-[#e4e0d7] hover:border-l-[#1f674f]/40 hover:shadow"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">Entradas Líquidas</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#123044] tabular-nums leading-tight">
            {formatBRL(totalIncomes)}
          </div>
          <div className="text-[11px] text-[#667085] mt-1">
            {formData.tipoVinculo ? `${formData.tipoVinculo} apurado` : "Renda total mensal"}
          </div>
        </button>

        {/* Gastos */}
        <button
          type="button"
          onClick={() => setActiveTab("gastos")}
          className={`text-left bg-white rounded-2xl p-4 shadow-xs transition-all cursor-pointer border-l-4 border-t border-r border-b ${
            activeTab === "gastos"
              ? "border-l-[#e05252] border-t-[#e4e0d7] border-r-[#e4e0d7] border-b-[#e4e0d7] shadow-sm ring-1 ring-[#e05252]/10"
              : "border-l-[#e4e0d7] border-t-[#e4e0d7] border-r-[#e4e0d7] border-b-[#e4e0d7] hover:border-l-[#e05252]/40 hover:shadow"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">Gastos Mensais</span>
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
              <ArrowDownRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#123044] tabular-nums leading-tight">
            {formatBRL(totalExpenses)}
          </div>
          <div className="text-[11px] text-[#667085] mt-1">
            {totalIncomes > 0 ? `${((totalExpenses / totalIncomes) * 100).toFixed(0)}% da renda` : "Custo de vida total"}
          </div>
        </button>

        {/* Capacidade de Aporte */}
        <button
          type="button"
          onClick={() => setActiveTab("alertas")}
          className={`text-left bg-white rounded-2xl p-4 shadow-xs transition-all cursor-pointer border-l-4 border-t border-r border-b ${
            activeTab === "alertas"
              ? "border-l-[#1f674f] border-t-[#e4e0d7] border-r-[#e4e0d7] border-b-[#e4e0d7] shadow-sm ring-1 ring-[#1f674f]/10"
              : "border-l-[#e4e0d7] border-t-[#e4e0d7] border-r-[#e4e0d7] border-b-[#e4e0d7] hover:border-l-[#1f674f]/40 hover:shadow"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">Capacidade de Aporte</span>
            <span className={`p-1.5 rounded-lg ${monthlySavings > 0 ? "bg-[#e8f1ed] text-[#1f674f]" : "bg-red-50 text-red-600"}`}>
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className={`text-xl sm:text-2xl font-extrabold tabular-nums leading-tight ${monthlySavings > 0 ? "text-[#1f674f]" : "text-red-600"}`}>
            {formatBRL(monthlySavings)}
          </div>
          <div className="text-[11px] text-[#667085] mt-1">
            {savingsRate.toFixed(1)}% poupado / mês
          </div>
        </button>

        {/* Reserva de Emergência */}
        <button
          type="button"
          onClick={() => setActiveTab("entradas")}
          className={`text-left bg-white rounded-2xl p-4 shadow-xs transition-all cursor-pointer border-l-4 border-t border-r border-b ${
            reserveMonthsCoverage >= recommendedMonths
              ? "border-l-emerald-500 border-t-[#e4e0d7] border-r-[#e4e0d7] border-b-[#e4e0d7]"
              : reserveMonthsCoverage >= 3
              ? "border-l-amber-400 border-t-[#e4e0d7] border-r-[#e4e0d7] border-b-[#e4e0d7]"
              : "border-l-red-400 border-t-[#e4e0d7] border-r-[#e4e0d7] border-b-[#e4e0d7]"
          } hover:shadow`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">Reserva Cobertura</span>
            <span className={`p-1.5 rounded-lg ${reserveMonthsCoverage >= recommendedMonths ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#123044] tabular-nums leading-tight">
            {reserveMonthsCoverage.toFixed(1)} <span className="text-sm font-normal text-[#667085]">meses</span>
          </div>
          <div className="text-[11px] text-[#667085] mt-1">
            Meta: {recommendedMonths} meses ({formatBRL(targetReserve)})
          </div>
        </button>
      </div>


      {/* ─── 2. LAYOUT PRINCIPAL: COLUNA LATERAL + CONTEÚDO ─── */}
      <div className="flex gap-0 min-h-[500px] border border-[#e4e0d7] rounded-2xl overflow-hidden bg-white shadow-xs">

        {/* ── Coluna de Navegação Lateral ── */}
        <div className="w-52 shrink-0 border-r border-[#e4e0d7] bg-[#fafaf8] flex flex-col">

          {/* Passo 1: Entradas */}
          <button
            type="button"
            onClick={() => setActiveTab("entradas")}
            className={`w-full text-left px-4 py-4 border-b border-[#e4e0d7] transition-all cursor-pointer group ${
              activeTab === "entradas"
                ? "bg-white border-l-2 border-l-[#1f674f]"
                : "hover:bg-[#f0ece1]/50 border-l-2 border-l-transparent"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0 transition-all ${
                activeTab === "entradas"
                  ? "bg-[#1f674f] text-white"
                  : totalIncomes > 0
                  ? "bg-[#e8f1ed] text-[#1f674f]"
                  : "bg-[#f0ece1] text-[#1d2939]"
              }`}>
                {totalIncomes > 0 ? "1" : "1"}
              </div>
              <div className="min-w-0">
                <div className={`text-xs font-bold truncate ${activeTab === "entradas" ? "text-[#1f674f]" : "text-[#123044]"}`}>
                  Entradas
                </div>
                <div className="text-[10px] text-[#667085] font-semibold tabular-nums mt-0.5">
                  {totalIncomes > 0 ? formatBRL(totalIncomes) : "Não preenchido"}
                </div>
              </div>
            </div>
          </button>

          {/* Passo 2: Gastos */}
          <button
            type="button"
            onClick={() => setActiveTab("gastos")}
            className={`w-full text-left px-4 py-4 border-b border-[#e4e0d7] transition-all cursor-pointer group ${
              activeTab === "gastos"
                ? "bg-white border-l-2 border-l-[#1f674f]"
                : "hover:bg-[#f0ece1]/50 border-l-2 border-l-transparent"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0 transition-all ${
                activeTab === "gastos"
                  ? "bg-[#1f674f] text-white"
                  : totalExpenses > 0
                  ? "bg-[#e8f1ed] text-[#1f674f]"
                  : "bg-[#f0ece1] text-[#1d2939]"
              }`}>
                {"2"}
              </div>
              <div className="min-w-0">
                <div className={`text-xs font-bold truncate ${activeTab === "gastos" ? "text-[#1f674f]" : "text-[#123044]"}`}>
                  Gastos
                </div>
                <div className="text-[10px] text-[#667085] font-semibold tabular-nums mt-0.5">
                  {totalExpenses > 0 ? formatBRL(totalExpenses) : "Não preenchido"}
                </div>
              </div>
            </div>
          </button>

          {/* Passo 3: Controle & Alertas */}
          <button
            type="button"
            onClick={() => setActiveTab("alertas")}
            className={`w-full text-left px-4 py-4 border-b border-[#e4e0d7] transition-all cursor-pointer group ${
              activeTab === "alertas"
                ? "bg-white border-l-2 border-l-[#1f674f]"
                : "hover:bg-[#f0ece1]/50 border-l-2 border-l-transparent"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0 transition-all relative ${
                activeTab === "alertas"
                  ? "bg-[#1f674f] text-white"
                  : "bg-[#f0ece1] text-[#1d2939]"
              }`}>
                3
                {alerts.filter(a => a.type === "danger" || a.type === "warning").length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 text-white text-[8px] font-extrabold flex items-center justify-center">
                    {alerts.filter(a => a.type === "danger" || a.type === "warning").length}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <div className={`text-xs font-bold truncate ${activeTab === "alertas" ? "text-[#1f674f]" : "text-[#123044]"}`}>
                  Controle
                </div>
                <div className="text-[10px] text-[#667085] font-semibold mt-0.5">
                  {totalIncomes > 0
                    ? `${savingsRate.toFixed(0)}% poupado`
                    : "Alertas e análise"}
                </div>
              </div>
            </div>
          </button>

          {/* Passo 4: Minha Inflação Real */}
          <button
            type="button"
            onClick={() => setActiveTab("inflacao")}
            className={`w-full text-left px-4 py-4 border-b border-[#e4e0d7] transition-all cursor-pointer group ${
              activeTab === "inflacao"
                ? "bg-white border-l-2 border-l-[#1f674f]"
                : "hover:bg-[#f0ece1]/50 border-l-2 border-l-transparent"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0 transition-all ${
                activeTab === "inflacao"
                  ? "bg-[#1f674f] text-white"
                  : "bg-[#f0ece1] text-[#1d2939]"
              }`}>
                4
              </div>
              <div className="min-w-0">
                <div className={`text-xs font-bold truncate ${activeTab === "inflacao" ? "text-[#1f674f]" : "text-[#123044]"}`}>
                  Inflação Real
                </div>
                <div className="text-[10px] text-[#667085] font-semibold mt-0.5">
                  {personalInflationMetrics.hasData
                    ? `${personalInflationMetrics.personalRate.toFixed(1)}% a.a.`
                    : "Preencha gastos"}
                </div>
              </div>
            </div>
          </button>

          {/* Importar Fatura — fixo na base */}
          <div className="mt-auto p-3 border-t border-[#e4e0d7]">
            <button
              type="button"
              onClick={() => setIsInvoiceModalOpen(true)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-[#e4e0d7] text-[#123044] text-[11px] font-bold flex items-center gap-1.5 hover:border-[#1f674f] hover:text-[#1f674f] transition-all cursor-pointer"
            >
              <CreditCard className="w-3 h-3 shrink-0" />
              <span>Importar Fatura</span>
            </button>
          </div>
        </div>

        {/* ── Painel de Conteúdo ── */}
        <div className="flex-1 min-w-0 overflow-y-auto p-5 space-y-5">

          {/* ─── PAINEL 1: ENTRADAS ─── */}
          {activeTab === "entradas" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="bg-[#f6f4ef]/60 p-4 rounded-2xl border border-[#e4e0d7]">
                <h4 className="text-sm font-bold text-[#123044] flex items-center gap-2">
                  <span>Classificação de Entradas Líquidas</span>
                  <span className="text-xs font-normal text-[#667085]">(Informe apenas os valores líquidos que caem na sua conta)</span>
                </h4>
                <p className="text-xs text-[#667085] mt-1">
                  Separar salário, pró-labore, lucros de empresa e renda passiva permite à ARVO calibrar seu colchão de segurança e a previsibilidade dos seus aportes.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Salário CLT */}
                <div className="bg-white p-4 rounded-2xl border border-[#e4e0d7] space-y-1.5">
                  <label className="text-xs font-bold text-[#123044] block">Salário Líquido (CLT)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="R$ 0,00"
                    value={formData.rendaClt || ""}
                    onChange={(e) => onChange("rendaClt", formatCurrencyInput(e.target.value))}
                    className="w-full bg-[#f6f4ef] border border-[#e4e0d7] rounded-xl px-3.5 py-2.5 text-sm text-[#123044] font-semibold focus:outline-none focus:border-[#1f674f]"
                  />
                  <span className="text-[10px] text-[#667085] block">Salário mensal após descontos de INSS/IRRF.</span>
                </div>

                {/* Pró-labore */}
                <div className="bg-white p-4 rounded-2xl border border-[#e4e0d7] space-y-1.5">
                  <label className="text-xs font-bold text-[#123044] block">Pró-labore Líquido (PJ / Sócio)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="R$ 0,00"
                    value={formData.rendaProLabore || ""}
                    onChange={(e) => onChange("rendaProLabore", formatCurrencyInput(e.target.value))}
                    className="w-full bg-[#f6f4ef] border border-[#e4e0d7] rounded-xl px-3.5 py-2.5 text-sm text-[#123044] font-semibold focus:outline-none focus:border-[#1f674f]"
                  />
                  <span className="text-[10px] text-[#667085] block">Remuneração fixa de sócio ou contrato PJ.</span>
                </div>

                {/* Distribuição de Lucros */}
                <div className="bg-white p-4 rounded-2xl border border-[#e4e0d7] space-y-1.5">
                  <label className="text-xs font-bold text-[#123044] block">Distribuição de Lucros / Dividendos</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="R$ 0,00"
                    value={formData.rendaLucrosDividendos || ""}
                    onChange={(e) => onChange("rendaLucrosDividendos", formatCurrencyInput(e.target.value))}
                    className="w-full bg-[#f6f4ef] border border-[#e4e0d7] rounded-xl px-3.5 py-2.5 text-sm text-[#123044] font-semibold focus:outline-none focus:border-[#1f674f]"
                  />
                  <span className="text-[10px] text-[#667085] block">Média mensal de retiradas de lucro isentas.</span>
                </div>

                {/* Aluguéis */}
                <div className="bg-white p-4 rounded-2xl border border-[#e4e0d7] space-y-1.5">
                  <label className="text-xs font-bold text-[#123044] block">Renda de Aluguéis de Imóveis</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="R$ 0,00"
                    value={formData.rendaAlugueis || ""}
                    onChange={(e) => onChange("rendaAlugueis", formatCurrencyInput(e.target.value))}
                    className="w-full bg-[#f6f4ef] border border-[#e4e0d7] rounded-xl px-3.5 py-2.5 text-sm text-[#123044] font-semibold focus:outline-none focus:border-[#1f674f]"
                  />
                  <span className="text-[10px] text-[#667085] block">Locação líquida de imóveis próprios recebida.</span>
                </div>

                {/* Rendimentos */}
                <div className="bg-white p-4 rounded-2xl border border-[#e4e0d7] space-y-1.5">
                  <label className="text-xs font-bold text-[#123044] block">Proventos de Investimentos (Ações/FIIs)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="R$ 0,00"
                    value={formData.rendaInvestimentos || ""}
                    onChange={(e) => onChange("rendaInvestimentos", formatCurrencyInput(e.target.value))}
                    className="w-full bg-[#f6f4ef] border border-[#e4e0d7] rounded-xl px-3.5 py-2.5 text-sm text-[#123044] font-semibold focus:outline-none focus:border-[#1f674f]"
                  />
                  <span className="text-[10px] text-[#667085] block">Rendimentos passivos sacados todo mês.</span>
                </div>

                {/* Pensão */}
                <div className="bg-white p-4 rounded-2xl border border-[#e4e0d7] space-y-1.5">
                  <label className="text-xs font-bold text-[#123044] block">Pensão / Aposentadoria / Previdência</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="R$ 0,00"
                    value={formData.rendaPensaoAposentadoria || ""}
                    onChange={(e) => onChange("rendaPensaoAposentadoria", formatCurrencyInput(e.target.value))}
                    className="w-full bg-[#f6f4ef] border border-[#e4e0d7] rounded-xl px-3.5 py-2.5 text-sm text-[#123044] font-semibold focus:outline-none focus:border-[#1f674f]"
                  />
                  <span className="text-[10px] text-[#667085] block">Benefício previdenciário ou pensão regular.</span>
                </div>

                {/* Renda Extra */}
                <div className="bg-white p-4 rounded-2xl border border-[#e4e0d7] space-y-1.5">
                  <label className="text-xs font-bold text-[#123044] block">Renda Extra / Freelances / Bônus</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="R$ 0,00"
                    value={formData.rendaExtraFreelance || ""}
                    onChange={(e) => onChange("rendaExtraFreelance", formatCurrencyInput(e.target.value))}
                    className="w-full bg-[#f6f4ef] border border-[#e4e0d7] rounded-xl px-3.5 py-2.5 text-sm text-[#123044] font-semibold focus:outline-none focus:border-[#1f674f]"
                  />
                  <span className="text-[10px] text-[#667085] block">Média mensal de projetos e comissões.</span>
                </div>

                {/* Vínculo Profissional */}
                <div className="bg-white p-4 rounded-2xl border border-[#e4e0d7] space-y-1.5">
                  <label className="text-xs font-bold text-[#123044] block">Vínculo Profissional Principal</label>
                  <select
                    value={formData.tipoVinculo || "CLT"}
                    onChange={(e) => onChange("tipoVinculo", e.target.value)}
                    className="w-full bg-[#f6f4ef] border border-[#e4e0d7] rounded-xl px-3.5 py-2.5 text-sm text-[#123044] font-semibold focus:outline-none focus:border-[#1f674f]"
                  >
                    <option value="CLT">CLT (Estabilidade relativa / 6m reserva)</option>
                    <option value="PJ">PJ / Contrato de prestação (12m reserva)</option>
                    <option value="Empresário">Empresário / Sócio (12m reserva)</option>
                    <option value="Autônomo">Profissional Liberal / Autônomo (12m reserva)</option>
                    <option value="Funcionário Público">Servidor Público (6m reserva)</option>
                    <option value="Misto">Misto (Múltiplas fontes / 12m reserva)</option>
                  </select>
                  <span className="text-[10px] text-[#667085] block">Define a régua técnica recomendada para sua reserva.</span>
                </div>
              </div>

              {/* Entradas Customizadas */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#123044] uppercase tracking-wider">
                    Outras Entradas Personalizadas
                  </span>
                </div>

                {incomeDetails.customList.map((item) => (
                  <div key={item.id} className="grid sm:grid-cols-2 gap-3 p-3 bg-white rounded-xl border border-[#e4e0d7]">
                    <div>
                      <label className="text-[11px] font-bold text-[#123044] block mb-1">Descrição da Entrada</label>
                      <input
                        type="text"
                        placeholder="Ex: Royalty, Dividendos de Startup, etc."
                        value={item.name}
                        onChange={(e) => handleUpdateCustomIncome(item.id, "name", e.target.value)}
                        className="w-full bg-[#f6f4ef] border border-[#e4e0d7] rounded-xl px-3 py-2 text-xs text-[#123044] font-medium focus:outline-none focus:border-[#1f674f]"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-[#123044]">Valor Líquido Mensal</label>
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomIncome(item.id)}
                          className="text-slate-400 hover:text-red-600 text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" /> Remover
                        </button>
                      </div>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="R$ 0,00"
                        value={item.value}
                        onChange={(e) => handleUpdateCustomIncome(item.id, "value", formatCurrencyInput(e.target.value))}
                        className="w-full bg-[#f6f4ef] border border-[#e4e0d7] rounded-xl px-3 py-2 text-xs text-[#123044] font-medium focus:outline-none focus:border-[#1f674f]"
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddCustomIncome}
                  className="w-full h-10 border-2 border-dashed border-[#d8d3c5] hover:border-[#1f674f] text-[#123044] hover:text-[#1f674f] text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Adicionar Outra Fonte de Renda
                </button>
              </div>

              {/* Reserva de Emergência */}
              <div className="bg-[#fbfaf5] p-5 rounded-2xl border border-[#e4e0d7] space-y-4 mt-6">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-50 text-[#1f674f] rounded-xl border border-emerald-100">
                    <PiggyBank className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#123044]">Reserva de Emergência Atual</h4>
                    <p className="text-xs text-[#667085]">Recursos em instrumentos com liquidez diária exclusiva para imprevistos.</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 pt-1">
                  <div className="bg-white p-4 rounded-xl border border-[#e4e0d7] space-y-1.5">
                    <label className="text-xs font-bold text-[#123044] block">Valor Atual da Reserva Guardada</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="R$ 0,00"
                      value={formData.reservaAtual || ""}
                      onChange={(e) => onChange("reservaAtual", formatCurrencyInput(e.target.value))}
                      className="w-full bg-[#f6f4ef] border border-[#e4e0d7] rounded-xl px-3.5 py-2.5 text-sm text-[#123044] font-semibold focus:outline-none focus:border-[#1f674f] tabular-nums"
                    />
                    <span className="text-[10px] text-[#667085] block">Montante total disponível imediatamente em D+0 / D+1.</span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-[#e4e0d7] space-y-1.5">
                    <label className="text-xs font-bold text-[#123044] block">Onde a reserva está aplicada?</label>
                    <select
                      value={formData.localReserva || ""}
                      onChange={(e) => onChange("localReserva", e.target.value)}
                      className="w-full bg-[#f6f4ef] border border-[#e4e0d7] rounded-xl px-3.5 py-2.5 text-sm text-[#123044] font-semibold focus:outline-none focus:border-[#1f674f]"
                    >
                      <option value="">Selecione uma opção...</option>
                      <option value="CDB Liquidez Diária">CDB Liquidez Diária (100%+ do CDI)</option>
                      <option value="Tesouro Selic">Tesouro Selic (Tesouro Direto)</option>
                      <option value="Poupança">Poupança (Baixa rentabilidade)</option>
                      <option value="Conta Corrente">Conta Corrente (Sem rentabilidade)</option>
                      <option value="Outro">Outro investimento conservador</option>
                      <option value="Não possuo reserva">Ainda não possuo reserva montada</option>
                    </select>
                    <span className="text-[10px] text-[#667085] block">Instrumento de custódia e risco de crédito do emissor.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── PAINEL 2: GASTOS ─── */}
          {activeTab === "gastos" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-[#f6f4ef]/60 p-4 rounded-2xl border border-[#e4e0d7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-[#123044]">
                    Cesta Completa de Gastos Mensais
                  </h4>
                  <p className="text-xs text-[#667085] mt-0.5">
                    Organizada nos 9 grupos oficiais. Cada valor informado aqui calibra simultaneamente seu orçamento e sua Calculadora de Inflação Real.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsInvoiceModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#1f674f] text-[#1f674f] hover:bg-[#e8f1ed]/50 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Importar Fatura de Cartão</span>
                </button>
              </div>

              {/* Acordeão de Grupos */}
              <div className="space-y-3">
                {EXPENSE_GROUPS_DEF.map((group) => {
                  const isOpen = !!openGroups[group.id];
                  const groupTotal = expenseDetails.byGroup[group.id] || 0;
                  const groupShare = totalExpenses > 0 ? (groupTotal / totalExpenses) * 100 : 0;

                  return (
                    <div
                      key={group.id}
                      className="bg-white border border-[#e4e0d7] rounded-2xl overflow-hidden shadow-xs transition-all"
                    >
                      {/* Header do Grupo */}
                      <div
                        onClick={() => toggleGroup(group.id)}
                        className="px-5 py-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {(() => { const IconComp = group.icon; return (
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                              isOpen
                                ? "bg-[#e8f1ed] text-[#1f674f] border-[#1f674f]/30 shadow-xs"
                                : "bg-[#f6f4ef] text-[#123044] border-[#e4e0d7]"
                            }`}>
                              <IconComp size={17} className={isOpen ? "text-[#1f674f]" : "text-[#123044]"} />
                            </div>
                          ); })()}
                          <div>
                            <div className="text-xs sm:text-sm font-bold text-[#123044] flex items-center gap-2">
                              <span>{group.label}</span>
                              {groupTotal > 0 && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f0ece1] text-[#123044]">
                                  {groupShare.toFixed(1)}% do total
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#667085] hidden sm:block">{group.desc}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-xs sm:text-sm font-extrabold text-[#123044] tabular-nums">
                              {formatBRL(groupTotal)}
                            </div>
                            <div className="text-[10px] text-[#667085]">por mês</div>
                          </div>
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </div>

                      {/* Itens do Grupo */}
                      {isOpen && (
                        <div className="px-5 pb-5 pt-2 border-t border-[#f0ece1] bg-[#fdfbf7]/50">
                          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {group.items.map((item) => (
                              <div key={item.id} className="space-y-1">
                                <label className="text-[11px] font-bold text-[#123044] block truncate" title={item.label}>
                                  {item.label}
                                </label>
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  placeholder="R$ 0,00"
                                  value={formData[`gasto_${item.id}`] || ""}
                                  onChange={(e) => onChange(`gasto_${item.id}`, formatCurrencyInput(e.target.value))}
                                  className="w-full bg-white border border-[#e4e0d7] rounded-xl px-3 py-2 text-xs text-[#123044] font-semibold focus:outline-none focus:border-[#1f674f] tabular-nums"
                                />
                              </div>
                            ))}
                          </div>

                          {group.id === "dividas" && (
                            <div className="mt-4 pt-4 border-t border-[#f0ece1] grid sm:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[11px] font-bold text-[#123044] block">
                                  Saldo Devedor Total Acumulado (para quitação hoje)
                                </label>
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  placeholder="R$ 0,00"
                                  value={formData.totalDividas || ""}
                                  onChange={(e) => {
                                    const val = formatCurrencyInput(e.target.value);
                                    onChange("totalDividas", val);
                                    onChange("possuiDividas", val && val !== "R$ 0,00" ? "Sim, possuo" : "Não possuo dívidas");
                                  }}
                                  className="w-full bg-white border border-[#e4e0d7] rounded-xl px-3 py-2 text-xs text-[#123044] font-semibold focus:outline-none focus:border-[#1f674f] tabular-nums"
                                />
                                <span className="text-[10px] text-[#667085] block">Montante total devedor para quitar passivos.</span>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[11px] font-bold text-[#123044] block">
                                  Tipo Principal de Dívida / Financiamento
                                </label>
                                <select
                                  value={formData.tipoDivida || ""}
                                  onChange={(e) => onChange("tipoDivida", e.target.value)}
                                  className="w-full bg-white border border-[#e4e0d7] rounded-xl px-3 py-2 text-xs text-[#123044] font-semibold focus:outline-none focus:border-[#1f674f]"
                                >
                                  <option value="">Selecione uma opção...</option>
                                  <option value="Financiamento Imobiliário">Financiamento Imobiliário</option>
                                  <option value="Financiamento de Veículo">Financiamento de Veículo</option>
                                  <option value="Empréstimo Consignado">Empréstimo Consignado</option>
                                  <option value="Cartão de Crédito / Rotativo">Cartão de Crédito / Rotativo</option>
                                  <option value="Empréstimo Pessoal">Empréstimo Pessoal</option>
                                  <option value="Outro">Outro tipo de dívida</option>
                                </select>
                                <span className="text-[10px] text-[#667085] block">Identifica a taxa média de juros e prioridade de quitação.</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Gastos Customizados */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#123044] uppercase tracking-wider">
                    Outros Gastos Específicos Livres
                  </span>
                </div>

                {expenseDetails.customList.map((item) => (
                  <div key={item.id} className="grid sm:grid-cols-2 gap-3 p-3 bg-white rounded-xl border border-[#e4e0d7]">
                    <div>
                      <label className="text-[11px] font-bold text-[#123044] block mb-1">Nome do Gasto</label>
                      <input
                        type="text"
                        placeholder="Ex: Terapia, Hobbies, etc."
                        value={item.name}
                        onChange={(e) => handleUpdateCustomExpense(item.id, "name", e.target.value)}
                        className="w-full bg-[#f6f4ef] border border-[#e4e0d7] rounded-xl px-3 py-2 text-xs text-[#123044] font-medium focus:outline-none focus:border-[#1f674f]"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-[#123044]">Valor Mensal</label>
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomExpense(item.id)}
                          className="text-slate-400 hover:text-red-600 text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" /> Remover
                        </button>
                      </div>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="R$ 0,00"
                        value={item.value}
                        onChange={(e) => handleUpdateCustomExpense(item.id, "value", formatCurrencyInput(e.target.value))}
                        className="w-full bg-[#f6f4ef] border border-[#e4e0d7] rounded-xl px-3 py-2 text-xs text-[#123044] font-medium focus:outline-none focus:border-[#1f674f]"
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddCustomExpense}
                  className="w-full h-10 border-2 border-dashed border-[#d8d3c5] hover:border-[#1f674f] text-[#123044] hover:text-[#1f674f] text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Adicionar Outro Gasto Específico
                </button>
              </div>
            </div>
          )}

          {/* ─── PAINEL 3: CONTROLE & ALERTAS ─── */}
          {activeTab === "alertas" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Termômetro 50-30-20 */}
              <div className="bg-white border border-[#e4e0d7] rounded-2xl p-5 shadow-xs">
                <h4 className="text-sm font-bold text-[#123044] flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#1f674f]" />
                  Equilíbrio Orçamentário (Regra 50 / 30 / 20)
                </h4>
                <p className="text-xs text-[#667085] mt-1 leading-relaxed">
                  Compara a divisão do seu orçamento com os parâmetros de saúde patrimonial:
                  <strong className="text-[#123044]"> 50% Gastos Essenciais</strong>,
                  <strong className="text-[#123044]"> 30% Estilo de Vida</strong> e
                  <strong className="text-[#123044]"> 20% Aportes para o Futuro</strong>.
                </p>

                <div className="h-6 w-full bg-[#f0ece1] rounded-full overflow-hidden flex mt-4 border border-[#e4e0d7]">
                  <div style={{ width: `${Math.min(100, essentialPct)}%` }} className="bg-[#2B6E76] h-full transition-all" />
                  <div style={{ width: `${Math.min(100 - essentialPct, lifestylePct)}%` }} className="bg-[#F59E0B] h-full transition-all" />
                  <div style={{ width: `${Math.max(0, savingsRate)}%` }} className="bg-[#1F674F] h-full transition-all" />
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-center gap-1.5 font-bold text-[#1a4a52]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#2B6E76]" />
                      Essenciais: {essentialPct.toFixed(1)}%
                    </div>
                    <div className="text-[10px] text-[#667085] mt-0.5">Meta: até 50% ({formatBRL(totalIncomes * 0.5)})</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-center gap-1.5 font-bold text-[#b45309]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                      Estilo de Vida: {lifestylePct.toFixed(1)}%
                    </div>
                    <div className="text-[10px] text-[#667085] mt-0.5">Meta: até 30% ({formatBRL(totalIncomes * 0.3)})</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-center gap-1.5 font-bold text-[#1F674F]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1F674F]" />
                      Aportes / Futuro: {savingsRate.toFixed(1)}%
                    </div>
                    <div className="text-[10px] text-[#667085] mt-0.5">Meta: mín. 20% ({formatBRL(totalIncomes * 0.2)})</div>
                  </div>
                </div>
              </div>

              {/* Alertas */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#123044] uppercase tracking-wider">
                  Radar de Alertas Preventivos da ARVO
                </h4>
                {alerts.map((al, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border flex items-start justify-between gap-3 text-xs leading-relaxed ${
                      al.type === "danger"
                        ? "bg-rose-50/70 border-rose-200 text-rose-950"
                        : al.type === "warning"
                        ? "bg-amber-50/70 border-amber-200 text-amber-950"
                        : "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {al.type === "danger" ? (
                        <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      ) : al.type === "warning" ? (
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-bold text-sm">{al.title}</div>
                        <div className="text-[#475467] mt-0.5">{al.desc}</div>
                      </div>
                    </div>
                    {al.metric && (
                      <span className="px-2.5 py-1 rounded-lg bg-white/80 border border-current font-bold text-xs shrink-0 self-start">
                        {al.metric}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Simulador */}
              <div className="bg-[#123044] text-white p-5 rounded-2xl space-y-2">
                <div className="text-sm text-white leading-relaxed">
                  Se você otimizar <strong className="text-white font-bold">R$ 500,00 por mês</strong> cortando pequenos ralos identificados na sua fatura e investir com a alocação da sua Carteira ARVO, você acumulará aproximadamente:
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-white/10 rounded-xl p-3">
                    <div className="text-[11px] text-white/70 font-medium">Em 10 Anos</div>
                    <div className="text-lg font-extrabold text-white">~ R$ 138.000,00</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3">
                    <div className="text-[11px] text-white/70 font-medium">Em 20 Anos</div>
                    <div className="text-lg font-extrabold text-white">~ R$ 584.000,00</div>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* ─── PAINEL 4: MINHA INFLAÇÃO REAL ─── */}
          {activeTab === "inflacao" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="bg-white border border-[#e4e0d7] rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-[#1f674f] uppercase tracking-wider">
                      Cálculo Conectado em Tempo Real
                    </span>
                    <h4 className="text-lg font-bold text-[#123044] mt-0.5">
                      Inflação Estimada da Sua Cesta Familiar
                    </h4>
                  </div>
                  <Link
                    href="/dashboard/inflacao"
                    className="px-4 py-2 rounded-xl bg-[#e8f1ed] text-[#1f674f] hover:bg-[#d8e9e2] text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                  >
                    <span>Abrir Calculadora Completa</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-[#f6f4ef] border border-[#e4e0d7] text-center">
                    <div className="text-[11px] text-[#667085] font-bold uppercase">Sua Inflação Pessoal</div>
                    <div className="text-2xl sm:text-3xl font-black text-[#123044] mt-1 tabular-nums">
                      {personalInflationMetrics.personalRate.toFixed(2)}%
                    </div>
                    <div className="text-[10px] text-[#667085] mt-0.5">ao ano (estimativa ponderada)</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#f6f4ef] border border-[#e4e0d7] text-center">
                    <div className="text-[11px] text-[#667085] font-bold uppercase">IPCA Oficial (IBGE)</div>
                    <div className="text-2xl sm:text-3xl font-black text-[#667085] mt-1 tabular-nums">
                      {personalInflationMetrics.ipcaBenchmark.toFixed(2)}%
                    </div>
                    <div className="text-[10px] text-[#667085] mt-0.5">ao ano (média Brasil)</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#f6f4ef] border border-[#e4e0d7] text-center">
                    <div className="text-[11px] text-[#667085] font-bold uppercase">Diferença em Relação ao IPCA</div>
                    <div className={`text-2xl sm:text-3xl font-black mt-1 tabular-nums ${
                      personalInflationMetrics.diffIpca > 0 ? "text-rose-600" : "text-emerald-600"
                    }`}>
                      {personalInflationMetrics.diffIpca >= 0 ? "+" : ""}
                      {personalInflationMetrics.diffIpca.toFixed(2)} pp
                    </div>
                    <div className="text-[10px] text-[#667085] mt-0.5">
                      {personalInflationMetrics.diffIpca > 0 ? "Seu custo sobe mais que o índice oficial" : "Seu custo sobe menos que a média"}
                    </div>
                  </div>
                </div>

                {personalInflationMetrics.topVillains.length > 0 && (
                  <div className="pt-2">
                    <div className="text-xs font-bold text-[#123044] uppercase tracking-wider mb-2.5">
                      Maiores Impactos na Sua Inflação (Top Vilões)
                    </div>
                    <div className="space-y-2">
                      {personalInflationMetrics.topVillains.map((v, i) => (
                        <div key={v.id} className="p-3 bg-[#fdfbf7] rounded-xl border border-[#e4e0d7] flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-[#123044] text-white text-[10px] font-bold flex items-center justify-center">
                              {i + 1}
                            </span>
                            <div>
                              <div className="font-bold text-[#123044]">{v.label}</div>
                              <div className="text-[11px] text-[#667085]">
                                Gasto: {formatBRL(v.expense)}/mês ({v.weightPct.toFixed(1)}% da sua cesta)
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-extrabold text-[#123044] tabular-nums">
                              +{v.ratePct.toFixed(2)}% a.a.
                            </div>
                            <div className="text-[10px] text-[#667085]">impacto ponderado: +{v.impact.toFixed(2)} pp</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── MODAL DE LEITURA DE FATURA DE CARTÃO ─── */}
      <InvoiceImportModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        onApply={handleApplyInvoice}
      />
    </div>
  );
}
