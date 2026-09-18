"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip
} from "recharts";
import {
  Info,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  MapPin,
  Utensils,
  Home,
  Tv,
  Shirt,
  Car,
  HeartPulse,
  Sparkles,
  GraduationCap,
  Wifi,
  HelpCircle,
  CheckCircle2,
  PieChart as PieIcon,
  BookOpen,
  SlidersHorizontal,
  ArrowRight,
  Wallet,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ============================================================================
// DADOS OFICIAIS DE REFERÊNCIA (IBGE SNIPC / SIDRA 7060 & 7063 / BCB SGS)
// Mês de referência econômica: Julho/2026 (IPCA-15: Agosto/2026)
// ============================================================================

export interface HeadlineIndex {
  id: string;
  name: string;
  value: number;
  full: string;
  desc: string;
}

export const HEADLINE_INDICES: HeadlineIndex[] = [
  {
    id: "ipca",
    name: "IPCA",
    value: 4.44,
    full: "Índice Nacional de Preços ao Consumidor Amplo",
    desc: "Referência oficial da meta de inflação do Banco Central; baliza a política de juros e contratos diversos. (jul/26)"
  },
  {
    id: "ipca15",
    name: "IPCA-15",
    value: 4.24,
    full: "IPCA-15",
    desc: "Prévia da inflação oficial com coleta antecipada entre os dias 16 do mês anterior e 15 do mês de referência. (ago/26)"
  },
  {
    id: "inpc",
    name: "INPC",
    value: 4.10,
    full: "Índice Nacional de Preços ao Consumidor",
    desc: "Mede o custo de vida para famílias com renda de 1 a 5 salários mínimos; baliza reajustes do salário mínimo e convenções trabalhistas. (jul/26)"
  },
  {
    id: "igpm",
    name: "IGP-M",
    value: 2.77,
    full: "Índice Geral de Preços – Mercado (FGV)",
    desc: "Calculado pela FGV com 60% de peso no atacado (IPA); tradicionalmente balizador de contratos de locação imobiliária. (jul/26)"
  },
  {
    id: "igpdi",
    name: "IGP-DI",
    value: 2.76,
    full: "Índice Geral de Preços – Disponibilidade Interna",
    desc: "Semelhante ao IGP-M, apurado no mês calendário fechado (1º ao último dia do mês). (jul/26)"
  },
  {
    id: "ipcfipe",
    name: "IPC-Fipe",
    value: 3.59,
    full: "Índice de Preços ao Consumidor da Fipe",
    desc: "Mede a variação de preços no município de São Paulo (quadrissemanal). (jul/26)"
  }
];

export interface InflationItemDef {
  id: string;
  label: string;
  var: number; // variação acumulada nacional em 12m (%)
  subLabel?: string;
  defaultFrequency?: "mensal" | "anual";
  canAnnual?: boolean;
  priorityCustom?: boolean; // Itens comuns de reajuste contratual
  note?: string;
}

export interface InflationGroupDef {
  id: string;
  label: string;
  sub?: string;
  color: string;
  icon: React.ElementType;
  groupVar: number; // variação 12m média do grupo
  groupNat: number; // peso médio nacional na POF (IBGE)
  items: InflationItemDef[];
}

// 9 GRUPOS OFICIAIS DE CONSUMO DO IPCA
// ATENÇÃO METODOLÓGICA: Financiamentos e amortizações de dívidas foram retirados
// da cesta de consumo e alocados em seção própria ("Compromissos Financeiros").
export const INFLATION_GROUPS: InflationGroupDef[] = [
  {
    id: "alimentacao",
    label: "Alimentação e bebidas",
    sub: "supermercado, feira, delivery e restaurantes",
    color: "#1F674F",
    icon: Utensils,
    groupVar: 3.40,
    groupNat: 21.67,
    items: [
      { id: "supermercado", label: "Supermercado e feira", var: 2.57 },
      { id: "restaurante", label: "Restaurante, lanchonete e delivery", var: 5.55 },
      { id: "outros", label: "Outros gastos com alimentação", var: 3.40, note: "Aproximação pela média do grupo de alimentação" }
    ]
  },
  {
    id: "habitacao",
    label: "Habitação",
    sub: "aluguel, condomínio, energia, gás, água e manutenção",
    color: "#2B6E76",
    icon: Home,
    groupVar: 5.93,
    groupNat: 15.36,
    items: [
      { id: "aluguel", label: "Aluguel residencial", var: 4.89, priorityCustom: true, subLabel: "Reajuste anual do seu contrato de locação" },
      { id: "condominio", label: "Condomínio", var: 3.72, priorityCustom: true, subLabel: "Taxa ordinária do condomínio" },
      { id: "energia", label: "Energia elétrica residencial", var: 8.85 },
      { id: "gas", label: "Gás (botijão ou encanado)", var: 3.92 },
      { id: "agua", label: "Água e esgoto", var: 6.40 },
      { id: "iptu_manutencao", label: "IPTU e manutenção do imóvel", var: 5.93, canAnnual: true, defaultFrequency: "anual", subLabel: "Permite informar valor anual" }
    ]
  },
  {
    id: "artigos",
    label: "Artigos de residência",
    sub: "móveis, utensílios e eletrodomésticos",
    color: "#475569",
    icon: Tv,
    groupVar: 0.67,
    groupNat: 3.45,
    items: [
      { id: "moveis", label: "Móveis e colchões", var: 1.59 },
      { id: "eletro", label: "Eletrodomésticos e eletrônicos", var: -5.45 },
      { id: "outros", label: "Outros utensílios do lar", var: 0.67, note: "Aproximação pela média do grupo" }
    ]
  },
  {
    id: "vestuario",
    label: "Vestuário",
    sub: "roupas, calçados e acessórios",
    color: "#6B5B7B",
    icon: Shirt,
    groupVar: 3.87,
    groupNat: 4.63,
    items: [
      { id: "roupas", label: "Roupas e vestimentas", var: 2.31 },
      { id: "calcados", label: "Calçados e bolsas", var: 5.68 },
      { id: "outros", label: "Outros itens de vestuário e joias", var: 3.87, note: "Aproximação pela média do grupo" }
    ]
  },
  {
    id: "transportes",
    label: "Transportes",
    sub: "combustível, transporte público, app e viagens",
    color: "#0F2A3D",
    icon: Car,
    groupVar: 3.64,
    groupNat: 20.27,
    items: [
      { id: "combustivel", label: "Combustível (gasolina / etanol / diesel)", var: 4.76 },
      { id: "onibus", label: "Transporte público (ônibus / metrô / trem)", var: 3.68 },
      { id: "app", label: "Transporte por aplicativo (Uber / 99 / táxi)", var: 16.15 },
      { id: "aviao", label: "Passagens aéreas", var: 41.89, canAnnual: true, subLabel: "Informe a média mensal ou gasto anual com passagens" },
      { id: "seguro_auto", label: "Seguro auto e taxas veiculares (IPVA)", var: -8.58, canAnnual: true, defaultFrequency: "anual", subLabel: "Permite informar valor anual de seguro e IPVA" },
      { id: "outros", label: "Manutenção mecânica e estacionamento", var: 3.64, note: "Aproximação pela média do grupo" }
    ]
  },
  {
    id: "saude",
    label: "Saúde e cuidados pessoais",
    sub: "plano de saúde, farmácia, estética e consultas",
    color: "#1D7070",
    icon: HeartPulse,
    groupVar: 6.16,
    groupNat: 13.72,
    items: [
      { id: "plano", label: "Plano de saúde", var: 5.87, priorityCustom: true, subLabel: "Reajuste ANS ou reajuste da sua apólice coletiva" },
      { id: "remedios", label: "Medicamentos e produtos farmacêuticos", var: 4.22 },
      { id: "cabeleireiro", label: "Cabeleireiro, barbearia e estética", var: 7.71 },
      { id: "outros", label: "Outros (consultas particulares, academia, odontologia)", var: 6.16, note: "Aproximação pela média do grupo" }
    ]
  },
  {
    id: "despesas",
    label: "Despesas pessoais",
    sub: "lazer, serviços domésticos e cuidados diários",
    color: "#7C5A60",
    icon: Sparkles,
    groupVar: 5.22,
    groupNat: 10.23,
    items: [
      { id: "lazer", label: "Lazer e passeios (cinema, shows, hospedagem)", var: 4.38, canAnnual: true },
      { id: "domestica", label: "Empregada doméstica / diarista", var: 6.28, priorityCustom: true },
      { id: "outros", label: "Outros (pet care, presentes, fumo, diversos)", var: 5.22, note: "Aproximação pela média do grupo" }
    ]
  },
  {
    id: "educacao",
    label: "Educação",
    sub: "escola, faculdade, idiomas e cursos",
    color: "#435B66",
    icon: GraduationCap,
    groupVar: 6.27,
    groupNat: 6.17,
    items: [
      { id: "mensalidade", label: "Mensalidade escolar / graduação / pós", var: 7.05, priorityCustom: true, subLabel: "Reajuste anual da anuidade/mensalidade" },
      { id: "cursos", label: "Cursos livres, idiomas e treinamentos", var: 5.05 },
      { id: "material_livros", label: "Material didático, livros e uniformes", var: 6.27, canAnnual: true, defaultFrequency: "anual" }
    ]
  },
  {
    id: "comunicacao",
    label: "Comunicação",
    sub: "internet, telefonia, TV e streaming",
    color: "#526E7A",
    icon: Wifi,
    groupVar: 1.96,
    groupNat: 4.50,
    items: [
      { id: "internet", label: "Internet banda larga", var: 0.50, priorityCustom: true },
      { id: "streaming", label: "Streaming e TV por assinatura", var: 6.19, priorityCustom: true },
      { id: "outros", label: "Telefonia celular e apps", var: 1.96, note: "Aproximação pela média do grupo" }
    ]
  }
];

// COMPROMISSOS FINANCEIROS (DÍVIDAS & FINANCIAMENTOS)
// Mede a "Pressão sobre o orçamento", separado da cesta de consumo
export interface FinancialCommitmentDef {
  id: string;
  label: string;
  sub: string;
  defaultVar: number;
  note: string;
}

export const FINANCIAL_COMMITMENTS: FinancialCommitmentDef[] = [
  {
    id: "financiamento_imobiliario",
    label: "Financiamento Imobiliário (Parcela Atual)",
    sub: "Prestação mensal do imóvel",
    defaultVar: 0.00,
    note: "Em contratos prefixados ou SAC com amortização constante, a parcela tem dinâmica própria e não reflete inflação de bens. Informe seu reajuste observado se houver."
  },
  {
    id: "financiamento_veicular",
    label: "Financiamento Veicular / Consórcio",
    sub: "Parcela mensal de automóvel ou moto",
    defaultVar: 0.00,
    note: "Geralmente possui parcela nominal fixa (0% de variação de preço durante o contrato)."
  },
  {
    id: "outros_emprestimos",
    label: "Empréstimos e Parcelamentos Financeiros",
    sub: "Crédito pessoal, consignado ou dívidas parceladas",
    defaultVar: 0.00,
    note: "Compromisso financeiro fixo com o credor."
  }
];

export interface RegionDef {
  id: string;
  label: string;
  uf?: string;
  scope?: "rm" | "capital" | "sem-dado";
}

export const REGIONS: RegionDef[] = [
  { id: "nacional", label: "Brasil (Média Nacional)" },
  { id: "bel", label: "Belém – PA", uf: "PA", scope: "rm" },
  { id: "bh", label: "Belo Horizonte – MG", uf: "MG", scope: "rm" },
  { id: "cur", label: "Curitiba – PR", uf: "PR", scope: "rm" },
  { id: "for", label: "Fortaleza – CE", uf: "CE", scope: "rm" },
  { id: "vit", label: "Grande Vitória – ES", uf: "ES", scope: "rm" },
  { id: "poa", label: "Porto Alegre – RS", uf: "RS", scope: "rm" },
  { id: "rec", label: "Recife – PE", uf: "PE", scope: "rm" },
  { id: "rj", label: "Rio de Janeiro – RJ", uf: "RJ", scope: "rm" },
  { id: "salv", label: "Salvador – BA", uf: "BA", scope: "rm" },
  { id: "sp", label: "São Paulo – SP", uf: "SP", scope: "rm" },
  { id: "arac", label: "Aracaju – SE", uf: "SE", scope: "capital" },
  { id: "bsb", label: "Brasília – DF", uf: "DF", scope: "capital" },
  { id: "cg", label: "Campo Grande – MS", uf: "MS", scope: "capital" },
  { id: "goi", label: "Goiânia – GO", uf: "GO", scope: "capital" },
  { id: "rbr", label: "Rio Branco – AC", uf: "AC", scope: "capital" },
  { id: "slz", label: "São Luís – MA", uf: "MA", scope: "capital" },
  // 11 UFs sem coleta contínua de preços pelo SNIPC (usam fallback nacional)
  { id: "mcz", label: "Maceió – AL", uf: "AL", scope: "sem-dado" },
  { id: "man", label: "Manaus – AM", uf: "AM", scope: "sem-dado" },
  { id: "mcp", label: "Macapá – AP", uf: "AP", scope: "sem-dado" },
  { id: "cba", label: "Cuiabá – MT", uf: "MT", scope: "sem-dado" },
  { id: "jpa", label: "João Pessoa – PB", uf: "PB", scope: "sem-dado" },
  { id: "the", label: "Teresina – PI", uf: "PI", scope: "sem-dado" },
  { id: "nat", label: "Natal – RN", uf: "RN", scope: "sem-dado" },
  { id: "pvh", label: "Porto Velho – RO", uf: "RO", scope: "sem-dado" },
  { id: "bvb", label: "Boa Vista – RR", uf: "RR", scope: "sem-dado" },
  { id: "fln", label: "Florianópolis – SC", uf: "SC", scope: "sem-dado" },
  { id: "pmw", label: "Palmas – TO", uf: "TO", scope: "sem-dado" }
];

export const UF_NAMES: Record<string, string> = {
  AC: "Acre", AL: "Alagoas", AP: "Amapá", AM: "Amazonas", BA: "Bahia", CE: "Ceará",
  DF: "Distrito Federal", ES: "Espírito Santo", GO: "Goiás", MA: "Maranhão",
  MT: "Mato Grosso", MS: "Mato Grosso do Sul", MG: "Minas Gerais", PA: "Pará",
  PB: "Paraíba", PR: "Paraná", PE: "Pernambuco", PI: "Piauí", RJ: "Rio de Janeiro",
  RN: "Rio Grande do Norte", RS: "Rio Grande do Sul", RO: "Rondônia", RR: "Roraima",
  SC: "Santa Catarina", SP: "São Paulo", SE: "Sergipe", TO: "Tocantins"
};

export const REGION_DATA: Record<string, {
  ipca: number;
  inpc: number;
  groups: Record<string, number>;
  items: Record<string, number>;
}> = {
  sp: {
    ipca: 4.81, inpc: 4.28,
    groups: { alimentacao: 4.31, artigos: 0.05, comunicacao: 1.75, despesas: 5.25, educacao: 7.07, habitacao: 5.09, saude: 6.75, transportes: 4.56, vestuario: 3.56 },
    items: { "alimentacao.restaurante": 5.78, "alimentacao.supermercado": 3.66, "artigos.eletro": -7.27, "artigos.moveis": -0.29, "comunicacao.internet": 0.0, "comunicacao.streaming": 6.19, "despesas.domestica": 6.28, "despesas.lazer": 4.34, "educacao.cursos": 7.23, "educacao.mensalidade": 7.55, "habitacao.agua": 6.48, "habitacao.aluguel": 4.23, "habitacao.condominio": 2.84, "habitacao.energia": 7.2, "habitacao.gas": 5.55, "saude.cabeleireiro": 9.55, "saude.plano": 5.82, "saude.remedios": 5.58, "transportes.app": 25.97, "transportes.aviao": 57.2, "transportes.combustivel": 7.47, "transportes.onibus": 5.83, "transportes.seguro_auto": -7.32, "vestuario.calcados": 4.49, "vestuario.roupas": 2.73 }
  },
  rj: {
    ipca: 4.50, inpc: 4.26,
    groups: { alimentacao: 1.51, artigos: 0.39, comunicacao: 1.4, despesas: 5.66, educacao: 6.06, habitacao: 7.99, saude: 4.89, transportes: 4.82, vestuario: 3.72 },
    items: { "alimentacao.restaurante": 3.65, "alimentacao.supermercado": 0.67, "artigos.eletro": -6.12, "artigos.moveis": -1.59, "comunicacao.internet": 0.63, "despesas.domestica": 6.28, "despesas.lazer": 6.37, "educacao.cursos": 2.41, "educacao.mensalidade": 7.14, "habitacao.agua": 9.75, "habitacao.aluguel": 3.98, "habitacao.condominio": 6.02, "habitacao.energia": 13.98, "habitacao.gas": 1.15, "saude.cabeleireiro": 4.46, "saude.plano": 6.29, "saude.remedios": 4.09, "transportes.app": 16.33, "transportes.aviao": 25.51, "transportes.combustivel": 9.27, "transportes.onibus": 6.38, "transportes.seguro_auto": -8.96, "vestuario.calcados": 6.17, "vestuario.roupas": 1.72 }
  },
  bh: {
    ipca: 3.43, inpc: 3.23,
    groups: { alimentacao: 2.94, artigos: 1.57, comunicacao: 1.94, despesas: 4.55, educacao: 4.81, habitacao: 5.59, saude: 5.82, transportes: 0.59, vestuario: 2.94 },
    items: { "alimentacao.restaurante": 6.97, "alimentacao.supermercado": 1.47, "artigos.eletro": -4.92, "artigos.moveis": 1.66, "comunicacao.internet": 0.63, "comunicacao.streaming": 6.19, "despesas.domestica": 6.28, "despesas.lazer": 2.9, "educacao.cursos": 3.89, "educacao.mensalidade": 5.91, "habitacao.agua": 9.77, "habitacao.aluguel": 7.31, "habitacao.condominio": -0.04, "habitacao.energia": 4.52, "habitacao.gas": 1.25, "saude.cabeleireiro": 7.83, "saude.plano": 5.76, "saude.remedios": 3.37, "transportes.app": 10.88, "transportes.aviao": 27.32, "transportes.combustivel": -3.55, "transportes.onibus": -6.78, "transportes.seguro_auto": -12.49, "vestuario.calcados": 6.45, "vestuario.roupas": 0.92 }
  },
  poa: {
    ipca: 4.41, inpc: 4.26,
    groups: { alimentacao: 3.32, artigos: 1.56, comunicacao: 2.7, despesas: 3.93, educacao: 6.05, habitacao: 6.85, saude: 5.98, transportes: 3.54, vestuario: 4.95 },
    items: { "alimentacao.restaurante": 4.9, "alimentacao.supermercado": 2.7, "artigos.eletro": -4.77, "artigos.moveis": 5.23, "comunicacao.internet": 0.63, "comunicacao.streaming": 6.19, "despesas.domestica": 6.28, "despesas.lazer": 1.54, "educacao.cursos": 4.62, "educacao.mensalidade": 6.94, "habitacao.agua": 8.43, "habitacao.aluguel": 4.63, "habitacao.condominio": 0.84, "habitacao.energia": 12.87, "habitacao.gas": 2.69, "saude.cabeleireiro": 5.64, "saude.plano": 5.67, "saude.remedios": 4.53, "transportes.app": 9.64, "transportes.aviao": 40.93, "transportes.combustivel": 1.94, "transportes.onibus": 6.0, "transportes.seguro_auto": -10.73, "vestuario.calcados": 8.0, "vestuario.roupas": 2.74 }
  },
  cur: {
    ipca: 3.05, inpc: 2.37,
    groups: { alimentacao: 2.3, artigos: -0.13, comunicacao: 2.01, despesas: 6.09, educacao: 6.43, habitacao: 7.25, saude: 5.07, transportes: -0.87, vestuario: 3.9 },
    items: { "alimentacao.restaurante": 4.38, "alimentacao.supermercado": 1.55, "artigos.eletro": -2.05, "artigos.moveis": -0.08, "comunicacao.internet": 0.63, "comunicacao.streaming": 6.19, "despesas.domestica": 6.28, "despesas.lazer": 6.62, "educacao.cursos": 4.88, "educacao.mensalidade": 7.24, "habitacao.agua": 5.23, "habitacao.aluguel": 2.68, "habitacao.condominio": 6.79, "habitacao.energia": 15.47, "habitacao.gas": 6.44, "saude.cabeleireiro": 8.42, "saude.plano": 5.91, "saude.remedios": -1.55, "transportes.aviao": 44.12, "transportes.combustivel": 1.44, "transportes.onibus": -0.54, "transportes.seguro_auto": -4.03, "vestuario.calcados": 6.31, "vestuario.roupas": 1.92 }
  },
  salv: {
    ipca: 4.17, inpc: 3.93,
    groups: { alimentacao: 3.05, artigos: -1.6, comunicacao: 2.25, despesas: 5.65, educacao: 6.62, habitacao: 2.93, saude: 6.54, transportes: 5.01, vestuario: 2.29 },
    items: { "alimentacao.restaurante": 6.2, "alimentacao.supermercado": 1.96, "artigos.eletro": -6.61, "artigos.moveis": -0.08, "comunicacao.internet": 0.63, "comunicacao.streaming": 6.19, "despesas.domestica": 6.28, "despesas.lazer": 5.26, "educacao.cursos": 4.14, "educacao.mensalidade": 8.05, "habitacao.agua": 4.1, "habitacao.aluguel": 4.72, "habitacao.condominio": 3.38, "habitacao.energia": 2.13, "habitacao.gas": -0.66, "saude.cabeleireiro": 6.28, "saude.plano": 5.93, "saude.remedios": 4.48, "transportes.app": 9.0, "transportes.aviao": 11.07, "transportes.combustivel": 10.76, "transportes.onibus": 5.38, "transportes.seguro_auto": -12.85, "vestuario.calcados": 2.55, "vestuario.roupas": 2.14 }
  },
  rec: {
    ipca: 4.99, inpc: 4.88,
    groups: { alimentacao: 4.13, artigos: 1.59, comunicacao: 2.05, despesas: 5.9, educacao: 4.47, habitacao: 3.63, saude: 6.7, transportes: 5.87, vestuario: 7.82 },
    items: { "alimentacao.restaurante": 5.46, "alimentacao.supermercado": 3.62, "artigos.eletro": -5.77, "artigos.moveis": 5.11, "comunicacao.internet": 0.63, "comunicacao.streaming": 6.19, "despesas.domestica": 6.28, "despesas.lazer": 4.19, "educacao.cursos": 3.83, "educacao.mensalidade": 4.78, "habitacao.agua": 0.0, "habitacao.aluguel": 6.85, "habitacao.condominio": 6.62, "habitacao.energia": 0.68, "habitacao.gas": 4.83, "saude.cabeleireiro": 11.33, "saude.plano": 5.92, "saude.remedios": 5.0, "transportes.app": 11.51, "transportes.aviao": 38.2, "transportes.combustivel": 8.2, "transportes.onibus": 4.65, "transportes.seguro_auto": -20.09, "vestuario.calcados": 8.53, "vestuario.roupas": 5.73 }
  },
  for: {
    ipca: 4.94, inpc: 4.89,
    groups: { alimentacao: 3.85, artigos: 0.69, comunicacao: 1.69, despesas: 5.7, educacao: 7.09, habitacao: 5.69, saude: 5.81, transportes: 5.22, vestuario: 6.17 },
    items: { "alimentacao.restaurante": 7.24, "alimentacao.supermercado": 2.82, "artigos.eletro": -3.83, "artigos.moveis": 1.4, "comunicacao.internet": 0.63, "despesas.domestica": 6.28, "despesas.lazer": 5.98, "educacao.cursos": 4.35, "educacao.mensalidade": 7.69, "habitacao.agua": 9.75, "habitacao.aluguel": 6.74, "habitacao.condominio": 5.27, "habitacao.energia": 3.99, "habitacao.gas": 3.55, "saude.cabeleireiro": 5.83, "saude.plano": 5.83, "saude.remedios": 6.38, "transportes.app": 0.47, "transportes.aviao": 39.93, "transportes.combustivel": 4.22, "transportes.onibus": 20.41, "transportes.seguro_auto": -2.64, "vestuario.calcados": 7.4, "vestuario.roupas": 5.26 }
  },
  bel: {
    ipca: 3.87, inpc: 3.58,
    groups: { alimentacao: 3.36, artigos: -0.27, comunicacao: 2.26, despesas: 5.04, educacao: 5.53, habitacao: 4.29, saude: 7.56, transportes: 3.75, vestuario: -1.31 },
    items: { "alimentacao.restaurante": 5.45, "alimentacao.supermercado": 2.85, "artigos.eletro": -7.21, "artigos.moveis": 3.58, "comunicacao.internet": 0.63, "despesas.domestica": 6.28, "despesas.lazer": 3.34, "educacao.cursos": 0.54, "educacao.mensalidade": 6.97, "habitacao.agua": 0.0, "habitacao.aluguel": 6.29, "habitacao.condominio": 3.88, "habitacao.energia": 4.34, "habitacao.gas": 5.77, "saude.cabeleireiro": 7.85, "saude.plano": 5.82, "saude.remedios": 6.11, "transportes.aviao": 56.7, "transportes.combustivel": -0.01, "transportes.onibus": -1.25, "transportes.seguro_auto": -18.5, "vestuario.calcados": 3.57, "vestuario.roupas": -3.96 }
  },
  vit: {
    ipca: 5.07, inpc: 4.92,
    groups: { alimentacao: 2.49, artigos: 2.44, comunicacao: 2.17, despesas: 5.75, educacao: 7.61, habitacao: 8.08, saude: 5.66, transportes: 4.92, vestuario: 4.75 },
    items: { "alimentacao.restaurante": 7.42, "alimentacao.supermercado": 0.82, "artigos.eletro": -4.8, "artigos.moveis": 5.52, "comunicacao.internet": 0.63, "comunicacao.streaming": 6.19, "despesas.domestica": 6.28, "despesas.lazer": 3.56, "educacao.cursos": 4.19, "educacao.mensalidade": 8.74, "habitacao.agua": 4.81, "habitacao.aluguel": 6.55, "habitacao.condominio": 6.55, "habitacao.energia": 12.97, "habitacao.gas": 8.71, "saude.cabeleireiro": 8.26, "saude.plano": 5.71, "saude.remedios": 3.98, "transportes.app": 16.64, "transportes.aviao": 27.1, "transportes.combustivel": 9.69, "transportes.onibus": 4.16, "transportes.seguro_auto": -3.74, "vestuario.calcados": 5.43, "vestuario.roupas": 3.38 }
  },
  bsb: {
    ipca: 4.56, inpc: 3.99,
    groups: { alimentacao: 4.45, artigos: 3.83, comunicacao: 2.63, despesas: 4.89, educacao: 4.0, habitacao: 5.58, saude: 6.1, transportes: 3.44, vestuario: 5.15 },
    items: { "alimentacao.restaurante": 6.74, "alimentacao.supermercado": 2.97, "artigos.eletro": 0.37, "artigos.moveis": 5.43, "comunicacao.internet": 0.63, "comunicacao.streaming": 6.19, "despesas.domestica": 6.28, "despesas.lazer": 3.71, "educacao.cursos": 4.03, "educacao.mensalidade": 4.3, "habitacao.agua": 3.97, "habitacao.aluguel": 6.06, "habitacao.condominio": 4.53, "habitacao.energia": 8.37, "habitacao.gas": 0.68, "saude.cabeleireiro": 6.46, "saude.plano": 5.93, "saude.remedios": 4.04, "transportes.app": 9.13, "transportes.aviao": 39.95, "transportes.combustivel": -1.33, "transportes.onibus": -1.26, "transportes.seguro_auto": -12.65, "vestuario.calcados": 6.7, "vestuario.roupas": 2.36 }
  },
  goi: {
    ipca: 5.56, inpc: 5.49,
    groups: { alimentacao: 3.84, artigos: 1.11, comunicacao: 2.01, despesas: 6.48, educacao: 6.71, habitacao: 10.14, saude: 5.81, transportes: 4.62, vestuario: 7.02 },
    items: { "alimentacao.restaurante": 4.79, "alimentacao.supermercado": 3.49, "artigos.eletro": -4.83, "artigos.moveis": 2.82, "comunicacao.internet": 0.63, "despesas.domestica": 6.28, "despesas.lazer": 7.45, "educacao.cursos": 5.93, "educacao.mensalidade": 7.41, "habitacao.agua": 4.8, "habitacao.aluguel": 7.72, "habitacao.condominio": 7.23, "habitacao.energia": 18.89, "habitacao.gas": 5.32, "saude.cabeleireiro": 8.99, "saude.plano": 5.82, "saude.remedios": 4.24, "transportes.app": 6.56, "transportes.aviao": 34.78, "transportes.combustivel": 10.21, "transportes.onibus": 0.0, "transportes.seguro_auto": -2.38, "vestuario.calcados": 5.17, "vestuario.roupas": 6.09 }
  },
  cg: {
    ipca: 4.60, inpc: 4.62,
    groups: { alimentacao: 2.26, artigos: 2.85, comunicacao: 1.97, despesas: 4.51, educacao: 5.15, habitacao: 7.56, saude: 5.23, transportes: 5.17, vestuario: 5.19 },
    items: { "alimentacao.restaurante": 4.25, "alimentacao.supermercado": 1.6, "artigos.eletro": -3.14, "artigos.moveis": 4.56, "comunicacao.internet": 0.63, "comunicacao.streaming": 6.19, "despesas.domestica": 6.28, "despesas.lazer": 2.98, "educacao.cursos": 3.79, "educacao.mensalidade": 5.88, "habitacao.agua": 4.57, "habitacao.aluguel": 3.09, "habitacao.condominio": 6.91, "habitacao.energia": 13.42, "habitacao.gas": 6.17, "saude.cabeleireiro": 4.21, "saude.plano": 5.44, "saude.remedios": 3.78, "transportes.app": 24.37, "transportes.aviao": 19.12, "transportes.combustivel": 8.94, "transportes.onibus": 0.0, "transportes.seguro_auto": -10.27, "vestuario.calcados": 7.69, "vestuario.roupas": 2.52 }
  },
  arac: {
    ipca: 4.83, inpc: 4.57,
    groups: { alimentacao: 4.7, artigos: 2.07, comunicacao: 2.17, despesas: 4.75, educacao: 6.01, habitacao: 4.88, saude: 6.38, transportes: 4.81, vestuario: 2.7 },
    items: { "alimentacao.restaurante": 6.07, "alimentacao.supermercado": 4.15, "artigos.eletro": -6.33, "artigos.moveis": 3.26, "comunicacao.internet": 0.63, "comunicacao.streaming": 6.19, "despesas.domestica": 6.28, "despesas.lazer": 1.75, "educacao.cursos": -1.7, "educacao.mensalidade": 6.84, "habitacao.agua": 7.84, "habitacao.aluguel": 5.1, "habitacao.condominio": 4.85, "habitacao.energia": 5.05, "habitacao.gas": 3.41, "saude.cabeleireiro": 6.59, "saude.plano": 5.82, "saude.remedios": 3.21, "transportes.app": 17.57, "transportes.aviao": 19.54, "transportes.combustivel": 7.62, "transportes.onibus": 0.0, "transportes.seguro_auto": -11.39, "vestuario.calcados": 5.61, "vestuario.roupas": 0.77 }
  },
  slz: {
    ipca: 4.87, inpc: 4.81,
    groups: { alimentacao: 2.36, artigos: 1.71, comunicacao: 1.8, despesas: 4.24, educacao: 5.29, habitacao: 8.1, saude: 6.52, transportes: 6.8, vestuario: 3.4 },
    items: { "alimentacao.restaurante": 5.25, "alimentacao.supermercado": 1.91, "artigos.eletro": -4.83, "artigos.moveis": 6.37, "comunicacao.internet": 0.63, "comunicacao.streaming": 6.19, "despesas.domestica": 6.28, "despesas.lazer": 3.15, "educacao.cursos": 1.58, "educacao.mensalidade": 6.58, "habitacao.agua": 0.0, "habitacao.aluguel": 2.96, "habitacao.condominio": 0.87, "habitacao.energia": 13.6, "habitacao.gas": 9.51, "saude.cabeleireiro": 2.66, "saude.plano": 5.82, "saude.remedios": 5.27, "transportes.app": 16.09, "transportes.aviao": 24.09, "transportes.combustivel": 16.35, "transportes.onibus": 0.0, "transportes.seguro_auto": -13.58, "vestuario.calcados": 5.16, "vestuario.roupas": 2.04 }
  },
  rbr: {
    ipca: 4.23, inpc: 4.0,
    groups: { alimentacao: 2.6, artigos: 1.24, comunicacao: 1.93, despesas: 3.77, educacao: 5.16, habitacao: 6.28, saude: 7.07, transportes: 3.99, vestuario: 5.47 },
    items: { "alimentacao.restaurante": 4.26, "alimentacao.supermercado": 2.1, "artigos.eletro": -0.27, "artigos.moveis": 2.62, "comunicacao.internet": 0.63, "despesas.domestica": 6.28, "despesas.lazer": -2.03, "educacao.cursos": 0.21, "educacao.mensalidade": 6.27, "habitacao.agua": 6.3, "habitacao.aluguel": 4.12, "habitacao.condominio": 6.62, "habitacao.energia": 7.89, "habitacao.gas": 3.92, "saude.cabeleireiro": 7.74, "saude.plano": 5.82, "saude.remedios": 3.24, "transportes.aviao": 29.36, "transportes.combustivel": -1.95, "transportes.onibus": 0.0, "transportes.seguro_auto": -2.86, "vestuario.calcados": 8.34, "vestuario.roupas": 3.74 }
  }
};

// ============================================================================
// HELPERS DE FORMATAÇÃO E CÁLCULO
// ============================================================================

export function fmtPct(x: number, d = 2): string {
  return x.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d }) + "%";
}

export function fmtPp(x: number, d = 2): string {
  const sign = x > 0.0001 ? "+" : "";
  return sign + x.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d }) + " p.p.";
}

export function fmtMoney(x: number): string {
  return "R$ " + x.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function regionLabel(regionId: string): string {
  if (typeof regionId === "string" && regionId.indexOf("outra:") === 0) {
    const ufOutra = regionId.slice(6);
    const stateName = UF_NAMES[ufOutra] || ufOutra;
    return `outra cidade de ${stateName} – ${ufOutra}`;
  }
  const found = REGIONS.find(r => r.id === regionId);
  return found ? found.label : regionId;
}

export type CustomMode = "none" | "pct" | "prices";

export interface CustomAdjustment {
  mode: CustomMode;
  pct: string;
  priceBefore: string;
  priceCurrent: string;
}

export interface EffectiveItemRate {
  rate: number; // taxa em porcentagem, ex: 4.89
  decimal: number; // taxa em decimal, ex: 0.0489
  sourceType: "ibge_especifico" | "ibge_grupo" | "ibge_nacional" | "custom_pct" | "custom_prices";
  sourceLabel: string;
}

function getEffectiveRate(
  regionId: string,
  g: InflationGroupDef,
  it: InflationItemDef,
  custom?: CustomAdjustment
): EffectiveItemRate {
  if (custom && custom.mode === "pct") {
    const val = parseFloat(custom.pct.replace(/[^\d.,-]/g, "").replace(",", "."));
    if (isFinite(val)) {
      return {
        rate: val,
        decimal: val / 100,
        sourceType: "custom_pct",
        sourceLabel: "Reajuste informado pelo usuário"
      };
    }
  }

  if (custom && custom.mode === "prices") {
    const p0 = parseFloat(custom.priceBefore.replace(/[^\d.,]/g, "").replace(",", "."));
    const p1 = parseFloat(custom.priceCurrent.replace(/[^\d.,]/g, "").replace(",", "."));
    if (isFinite(p0) && isFinite(p1) && p0 > 0) {
      const computedRate = ((p1 - p0) / p0) * 100;
      return {
        rate: computedRate,
        decimal: (p1 - p0) / p0,
        sourceType: "custom_prices",
        sourceLabel: "Preços comparados pelo usuário"
      };
    }
  }

  // Fallback para IBGE (Nacional ou Regional)
  const place = regionLabel(regionId);
  if (regionId === "nacional") {
    if (it.id === "outros") {
      return {
        rate: g.groupVar,
        decimal: g.groupVar / 100,
        sourceType: "ibge_grupo",
        sourceLabel: "Aproximação pela média do grupo (IBGE Nacional)"
      };
    }
    return {
      rate: it.var,
      decimal: it.var / 100,
      sourceType: "ibge_nacional",
      sourceLabel: "Dado oficial IBGE Nacional"
    };
  }

  const rd = REGION_DATA[regionId];
  if (!rd) {
    return {
      rate: it.var,
      decimal: it.var / 100,
      sourceType: "ibge_nacional",
      sourceLabel: `Sem pesquisa local do IBGE — Média nacional`
    };
  }

  const specificKey = `${g.id}.${it.id}`;
  if (it.id !== "outros" && rd.items[specificKey] !== undefined) {
    return {
      rate: rd.items[specificKey],
      decimal: rd.items[specificKey] / 100,
      sourceType: "ibge_especifico",
      sourceLabel: `Dado oficial IBGE · ${place}`
    };
  }

  if (rd.groups[g.id] !== undefined) {
    return {
      rate: rd.groups[g.id],
      decimal: rd.groups[g.id] / 100,
      sourceType: "ibge_grupo",
      sourceLabel: `Média do grupo no IBGE · ${place}`
    };
  }

  return {
    rate: it.var,
    decimal: it.var / 100,
    sourceType: "ibge_nacional",
    sourceLabel: `Aproximação média nacional (sem dado em ${place})`
  };
}

interface DonutTooltipPayloadItem {
  payload: {
    id: string;
    name: string;
    value: number;
    pct: number;
    color: string;
  };
}

const CustomDonutTooltip = ({
  active,
  payload
}: {
  active?: boolean;
  payload?: DonutTooltipPayloadItem[];
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-2xl border border-[#e4e0d7] shadow-xl text-xs space-y-1.5 font-sans pointer-events-none z-50">
        <div className="flex items-center gap-2 font-bold text-[#123044]">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: data.color }} />
          <span className="truncate">{data.name}</span>
        </div>
        <div className="text-[#123044] font-black text-sm">
          {fmtMoney(data.value)} <span className="text-[11px] font-normal text-[#667085]">/mês</span>
        </div>
        <div className="text-[11px] text-[#667085] flex items-center justify-between gap-4 pt-1.5 border-t border-[#f0ece1]">
          <span>Participação no consumo:</span>
          <strong className="text-[#123044] font-bold">{fmtPct(data.pct, 1)}</strong>
        </div>
      </div>
    );
  }
  return null;
};

// ============================================================================
// COMPONENTE PRINCIPAL: MINHA INFLAÇÃO REAL
// ============================================================================

export function CalculadoraMinhaInflacaoReal() {
  const { data: session } = useSession();

  // Metodologia da Base dos Gastos: Final (Atuais) vs. Início (12 meses atrás)
  const [expenseBase, setExpenseBase] = useState<"final" | "initial">("final");

  // Localidade geográfica
  const [selectedUf, setSelectedUf] = useState<string>("nacional");
  const [selectedCity, setSelectedCity] = useState<string>("nacional");

  // Estado dos Accordions de categorias de consumo
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    alimentacao: true,
    habitacao: true
  });

  // Gastos brutos informados pelo usuário: chave `${g.id}.${it.id}`
  const [rawValues, setRawValues] = useState<Record<string, string>>({});

  // Frequência de cada gasto: "mensal" | "anual" (se anual, divide por 12)
  const [frequencies, setFrequencies] = useState<Record<string, "mensal" | "anual">>({});

  // Reajustes customizados pelo usuário (Modo 2)
  const [customAdjustments, setCustomAdjustments] = useState<Record<string, CustomAdjustment>>({});

  // Painel de customização aberto para qual item
  const [editingItemKey, setEditingItemKey] = useState<string | null>(null);

  // Compromissos Financeiros (Dívidas, financiamentos)
  const [financialValues, setFinancialValues] = useState<Record<string, string>>({});
  const [financialAdjustments, setFinancialAdjustments] = useState<Record<string, string>>({});

  // Renda Familiar Líquida Inicial e Atual (Opcional)
  const [incomeInitial, setIncomeInitial] = useState<string>("");
  const [incomeCurrent, setIncomeCurrent] = useState<string>("");

  // Visualização no card direito: Gráfico Donut vs Índices Oficiais
  const [rightCardTab, setRightCardTab] = useState<"gastos" | "indices">("gastos");
  const [showIdxDefs, setShowIdxDefs] = useState<boolean>(false);
  const [showFaq, setShowFaq] = useState<boolean>(false);

  // Ordenação da tabela detalhada
  const [tableSort, setTableSort] = useState<"contrib" | "peso" | "padrao">("contrib");

  const [isLoaded, setIsLoaded] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const userEmail = session?.user?.email;
  const storageKey = userEmail ? `arvo_inflacao_real_v2_${userEmail}` : "arvo_inflacao_real_v2_guest";

  // 1. Carregamento inicial do localStorage e banco
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const localData = localStorage.getItem(storageKey);
        if (localData) {
          const parsed = JSON.parse(localData);
          if (parsed.rawValues) setRawValues(parsed.rawValues);
          if (parsed.frequencies) setFrequencies(parsed.frequencies);
          if (parsed.customAdjustments) setCustomAdjustments(parsed.customAdjustments);
          if (parsed.financialValues) setFinancialValues(parsed.financialValues);
          if (parsed.financialAdjustments) setFinancialAdjustments(parsed.financialAdjustments);
          if (parsed.expenseBase) setExpenseBase(parsed.expenseBase);
          if (parsed.selectedUf) setSelectedUf(parsed.selectedUf);
          if (parsed.selectedCity) setSelectedCity(parsed.selectedCity);
          if (parsed.incomeInitial) setIncomeInitial(parsed.incomeInitial);
          if (parsed.incomeCurrent) setIncomeCurrent(parsed.incomeCurrent);
        }
      } catch (e) {
        console.error("Erro ao carregar dados locais de inflação:", e);
      }
    }

    if (userEmail) {
      fetch("/api/user/profile")
        .then((res) => (res.ok ? res.json() : null))
        .then((profile) => {
          if (profile?.jornadaData?.inflacaoRealDataV2) {
            const data = profile.jornadaData.inflacaoRealDataV2;
            if (data.rawValues) setRawValues(data.rawValues);
            if (data.frequencies) setFrequencies(data.frequencies);
            if (data.customAdjustments) setCustomAdjustments(data.customAdjustments);
            if (data.financialValues) setFinancialValues(data.financialValues);
            if (data.financialAdjustments) setFinancialAdjustments(data.financialAdjustments);
            if (data.expenseBase) setExpenseBase(data.expenseBase);
            if (data.selectedUf) setSelectedUf(data.selectedUf);
            if (data.selectedCity) setSelectedCity(data.selectedCity);
            if (data.incomeInitial) setIncomeInitial(data.incomeInitial);
            if (data.incomeCurrent) setIncomeCurrent(data.incomeCurrent);
          }
        })
        .catch((e) => console.error("Erro ao buscar inflação salva do perfil:", e))
        .finally(() => setIsLoaded(true));
    } else {
      setIsLoaded(true);
    }
  }, [userEmail, storageKey]);

  // 2. Salvamento com debounce no localStorage e banco
  useEffect(() => {
    if (!isLoaded) return;

    const payload = {
      rawValues,
      frequencies,
      customAdjustments,
      financialValues,
      financialAdjustments,
      expenseBase,
      selectedUf,
      selectedCity,
      incomeInitial,
      incomeCurrent
    };

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, JSON.stringify(payload));
      } catch (e) {}
    }

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    if (userEmail) {
      saveTimeoutRef.current = setTimeout(() => {
        fetch("/api/user/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inflacaoRealDataV2: payload }),
          keepalive: true
        }).catch((e) => console.error("Erro ao sincronizar inflação:", e));
      }, 350);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        if (userEmail) {
          fetch("/api/user/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ inflacaoRealDataV2: payload }),
            keepalive: true
          }).catch(() => {});
        }
      }
    };
  }, [
    rawValues,
    frequencies,
    customAdjustments,
    financialValues,
    financialAdjustments,
    expenseBase,
    selectedUf,
    selectedCity,
    incomeInitial,
    incomeCurrent,
    isLoaded,
    userEmail,
    storageKey
  ]);

  // Região efetiva
  const currentRegionId = useMemo(() => {
    if (selectedUf === "nacional" || !selectedUf) return "nacional";
    return selectedCity || "nacional";
  }, [selectedUf, selectedCity]);

  const handleUfChange = (uf: string) => {
    setSelectedUf(uf);
    if (uf === "nacional") {
      setSelectedCity("nacional");
    } else {
      const region = REGIONS.find((r) => r.uf === uf);
      setSelectedCity(region ? region.id : `outra:${uf}`);
    }
  };

  const handleRawValueChange = (key: string, val: string) => {
    const clean = val.replace(/[^\d.,]/g, "").replace(",", ".");
    setRawValues((prev) => ({ ...prev, [key]: clean }));
  };

  const handleFrequencyToggle = (key: string) => {
    setFrequencies((prev) => ({
      ...prev,
      [key]: prev[key] === "anual" ? "mensal" : "anual"
    }));
  };

  const handleCustomModeChange = (key: string, mode: CustomMode) => {
    setCustomAdjustments((prev) => ({
      ...prev,
      [key]: {
        mode,
        pct: prev[key]?.pct || "",
        priceBefore: prev[key]?.priceBefore || "",
        priceCurrent: prev[key]?.priceCurrent || ""
      }
    }));
  };

  const handleResetCustomItem = (key: string) => {
    setCustomAdjustments((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setEditingItemKey(null);
  };

  const handleClearAll = () => {
    setRawValues({});
    setFrequencies({});
    setCustomAdjustments({});
    setFinancialValues({});
    setFinancialAdjustments({});
    setIncomeInitial("");
    setIncomeCurrent("");
    setSelectedUf("nacional");
    setSelectedCity("nacional");
    setEditingItemKey(null);

    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(storageKey);
      } catch (e) {}
    }
    if (userEmail) {
      fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inflacaoRealDataV2: null })
      }).catch((e) => console.error("Erro ao limpar dados no banco:", e));
    }
  };

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  // ==========================================================================
  // MOTOR DE CÁLCULO RIGOROSO (CESTA DE CONSUMO)
  // ==========================================================================
  const basketCalc = useMemo(() => {
    let costInitial = 0; // C0
    let costCurrent = 0; // C1
    let filledItemsCount = 0;
    let customCount = 0;
    let exactIbgeCount = 0;
    let proxyCount = 0;

    const groupTotals: Record<string, { initial: number; current: number }> = {};

    interface ItemCalcResult {
      key: string;
      groupId: string;
      groupLabel: string;
      groupColor: string;
      itemId: string;
      itemLabel: string;
      valInitial: number;
      valCurrent: number;
      ratePct: number;
      decimalRate: number;
      sourceType: EffectiveItemRate["sourceType"];
      sourceLabel: string;
      weightInCalculation: number; // %
      currentBudgetShare: number; // %
      contributionPp: number; // p.p.
      isFilled: boolean;
      frequency: "mensal" | "anual";
    }

    const calculatedItems: ItemCalcResult[] = [];

    // 1º Passo: Obter valores e variações de cada item
    INFLATION_GROUPS.forEach((g) => {
      let gInitial = 0;
      let gCurrent = 0;

      g.items.forEach((it) => {
        const key = `${g.id}.${it.id}`;
        const raw = rawValues[key] || "";
        const parsedRaw = parseFloat(raw);
        const hasValue = isFinite(parsedRaw) && parsedRaw > 0;
        const freq = frequencies[key] || it.defaultFrequency || "mensal";
        const monthlyEquivalent = hasValue ? (freq === "anual" ? parsedRaw / 12 : parsedRaw) : 0;

        const effectiveRate = getEffectiveRate(currentRegionId, g, it, customAdjustments[key]);

        let v0 = 0;
        let v1 = 0;

        if (hasValue) {
          filledItemsCount++;
          if (effectiveRate.sourceType.startsWith("custom")) customCount++;
          else if (effectiveRate.sourceType === "ibge_especifico") exactIbgeCount++;
          else proxyCount++;

          if (expenseBase === "final") {
            // Gastos atuais (C1 informado) -> Reconstruir gasto anterior sob quantidades constantes
            v1 = monthlyEquivalent;
            v0 = v1 / (1 + effectiveRate.decimal);
          } else {
            // Gastos de 12 meses atrás (C0 informado) -> Projetar gasto atual sob quantidades constantes
            v0 = monthlyEquivalent;
            v1 = v0 * (1 + effectiveRate.decimal);
          }

          costInitial += v0;
          costCurrent += v1;
          gInitial += v0;
          gCurrent += v1;
        }

        calculatedItems.push({
          key,
          groupId: g.id,
          groupLabel: g.label,
          groupColor: g.color,
          itemId: it.id,
          itemLabel: it.label,
          valInitial: v0,
          valCurrent: v1,
          ratePct: effectiveRate.rate,
          decimalRate: effectiveRate.decimal,
          sourceType: effectiveRate.sourceType,
          sourceLabel: effectiveRate.sourceLabel,
          weightInCalculation: 0, // calculado no 2º passo
          currentBudgetShare: 0, // calculado no 2º passo
          contributionPp: 0, // calculado no 2º passo
          isFilled: hasValue,
          frequency: freq
        });
      });

      groupTotals[g.id] = { initial: gInitial, current: gCurrent };
    });

    // 2º Passo: Calcular Pesos e Contribuições Rigorosas em p.p.
    // Metodologia estrita:
    // Se gastos iniciais: peso = v0 / C0; contribuição = (v0 / C0) * ratePct; soma = inflação total.
    // Se gastos finais reconstruídos: peso_reconstruído = v0_est / C0; contribuição = (v0_est / C0) * ratePct;
    // soma = ((C1 - C0) / C0) * 100 = inflação total.
    const totalInflationPct = costInitial > 0 ? ((costCurrent - costInitial) / costInitial) * 100 : null;

    let sumContributionsPp = 0;

    calculatedItems.forEach((item) => {
      if (item.isFilled && costInitial > 0) {
        // Peso no cálculo da inflação (base C0)
        item.weightInCalculation = (item.valInitial / costInitial) * 100;
        // Participação no orçamento atual (base C1)
        item.currentBudgetShare = costCurrent > 0 ? (item.valCurrent / costCurrent) * 100 : 0;
        // Contribuição rigorosa em pontos percentuais (p.p.)
        item.contributionPp = (item.valInitial / costInitial) * item.ratePct;
        sumContributionsPp += item.contributionPp;
      }
    });

    // Top 3 Contribuidores Positivos e Itens Negativos
    const filledCalculated = calculatedItems.filter((i) => i.isFilled);
    const topPositive = [...filledCalculated]
      .filter((i) => i.contributionPp > 0.001)
      .sort((a, b) => b.contributionPp - a.contributionPp)
      .slice(0, 3);

    const negativeContributors = [...filledCalculated]
      .filter((i) => i.contributionPp < -0.001)
      .sort((a, b) => a.contributionPp - b.contributionPp);

    // Métricas de Cobertura Factual dos Dados
    const totalFilled = filledItemsCount || 1;
    const coverageIbgePct = (exactIbgeCount / totalFilled) * 100;
    const coverageCustomPct = (customCount / totalFilled) * 100;
    const coverageProxyPct = (proxyCount / totalFilled) * 100;

    return {
      costInitial,
      costCurrent,
      monthlyDiff: costCurrent - costInitial,
      annualizedImpact: (costCurrent - costInitial) * 12,
      totalInflationPct,
      sumContributionsPp,
      filledItemsCount,
      groupTotals,
      calculatedItems,
      topPositive,
      negativeContributors,
      coverage: {
        ibgePct: coverageIbgePct,
        customPct: coverageCustomPct,
        proxyPct: coverageProxyPct
      }
    };
  }, [rawValues, frequencies, customAdjustments, expenseBase, currentRegionId]);

  // ==========================================================================
  // COMPROMISSOS FINANCEIROS (PRESSÃO SOBRE O ORÇAMENTO TOTAL)
  // ==========================================================================
  const financialCalc = useMemo(() => {
    let debtCurrent = 0;
    let debtInitial = 0;
    let hasDebts = false;

    FINANCIAL_COMMITMENTS.forEach((fc) => {
      const raw = financialValues[fc.id] || "";
      const val = parseFloat(raw.replace(/[^\d.,]/g, "").replace(",", "."));
      if (isFinite(val) && val > 0) {
        hasDebts = true;
        debtCurrent += val;
        const customAdj = financialAdjustments[fc.id];
        const rate = customAdj ? parseFloat(customAdj.replace(/[^\d.,-]/g, "").replace(",", ".")) : fc.defaultVar;
        const rateDecimal = isFinite(rate) ? rate / 100 : 0;
        const valBefore = val / (1 + rateDecimal);
        debtInitial += valBefore;
      }
    });

    const totalOutflowInitial = basketCalc.costInitial + debtInitial;
    const totalOutflowCurrent = basketCalc.costCurrent + debtCurrent;
    const totalOutflowDiff = totalOutflowCurrent - totalOutflowInitial;
    const totalOutflowVariationPct = totalOutflowInitial > 0 ? ((totalOutflowCurrent - totalOutflowInitial) / totalOutflowInitial) * 100 : null;

    return {
      hasDebts,
      debtInitial,
      debtCurrent,
      debtDiff: debtCurrent - debtInitial,
      totalOutflowInitial,
      totalOutflowCurrent,
      totalOutflowDiff,
      totalOutflowVariationPct
    };
  }, [financialValues, financialAdjustments, basketCalc.costInitial, basketCalc.costCurrent]);

  // ==========================================================================
  // EVOLUÇÃO DA RENDA FAMILIAR LÍQUIDA E PODER DE COMPRA
  // ==========================================================================
  const incomeCalc = useMemo(() => {
    const r0 = parseFloat(incomeInitial.replace(/[^\d.,]/g, "").replace(",", "."));
    const r1 = parseFloat(incomeCurrent.replace(/[^\d.,]/g, "").replace(",", "."));

    const hasInitial = isFinite(r0) && r0 > 0;
    const hasCurrent = isFinite(r1) && r1 > 0;

    let incomeGrowthPct: number | null = null;
    let realPurchasingPowerChangePct: number | null = null;
    let currentCommitmentPct: number | null = null;
    let initialCommitmentPct: number | null = null;

    if (hasInitial && hasCurrent) {
      incomeGrowthPct = ((r1 - r0) / r0) * 100;
      if (basketCalc.totalInflationPct !== null) {
        const nominalGrowthDecimal = (r1 - r0) / r0;
        const inflationDecimal = basketCalc.totalInflationPct / 100;
        realPurchasingPowerChangePct = ((1 + nominalGrowthDecimal) / (1 + inflationDecimal) - 1) * 100;
      }
    }

    if (hasCurrent && basketCalc.costCurrent > 0) {
      currentCommitmentPct = (basketCalc.costCurrent / r1) * 100;
    }
    if (hasInitial && basketCalc.costInitial > 0) {
      initialCommitmentPct = (basketCalc.costInitial / r0) * 100;
    }

    return {
      hasData: hasInitial || hasCurrent,
      hasBoth: hasInitial && hasCurrent,
      r0: hasInitial ? r0 : 0,
      r1: hasCurrent ? r1 : 0,
      incomeGrowthPct,
      realPurchasingPowerChangePct,
      currentCommitmentPct,
      initialCommitmentPct
    };
  }, [incomeInitial, incomeCurrent, basketCalc.costInitial, basketCalc.costCurrent, basketCalc.totalInflationPct]);

  // ==========================================================================
  // DADOS VISUAIS (GRÁFICO DONUT E COMPARATIVO DE ÍNDICES)
  // ==========================================================================
  const categoryChartData = useMemo(() => {
    if (basketCalc.costCurrent <= 0) return [];
    return INFLATION_GROUPS.map((g) => {
      const gData = basketCalc.groupTotals[g.id] || { initial: 0, current: 0 };
      const val = gData.current;
      const pct = (val / basketCalc.costCurrent) * 100;
      return {
        id: g.id,
        name: g.label,
        value: val,
        pct,
        color: g.color,
        icon: g.icon
      };
    })
      .filter((i) => i.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [basketCalc.costCurrent, basketCalc.groupTotals]);

  const hasRegionalData = currentRegionId !== "nacional" && !!REGION_DATA[currentRegionId];
  const referenceIpca = hasRegionalData ? REGION_DATA[currentRegionId].ipca : HEADLINE_INDICES[0].value;
  const delta = basketCalc.totalInflationPct !== null ? basketCalc.totalInflationPct - referenceIpca : null;

  const compareRows = useMemo(() => {
    const rd = currentRegionId !== "nacional" ? REGION_DATA[currentRegionId] : null;
    const baseRows = HEADLINE_INDICES.map((h) => {
      let v = h.value;
      let tag = "";
      if (rd && h.id === "ipca") {
        v = rd.ipca;
        tag = ` · ${regionLabel(currentRegionId)}`;
      } else if (rd && h.id === "inpc" && rd.inpc !== undefined) {
        v = rd.inpc;
        tag = ` · ${regionLabel(currentRegionId)}`;
      } else if (rd && (h.id === "ipca15" || h.id === "igpm" || h.id === "igpdi")) {
        tag = " · Nacional";
      } else if (h.id === "ipcfipe") {
        tag = " · SP";
      }
      return { id: h.id, name: h.name + tag, value: v, isYou: false };
    });

    if (basketCalc.totalInflationPct !== null) {
      return [{ id: "voce", name: "Sua Cesta Estimada", value: basketCalc.totalInflationPct, isYou: true }, ...baseRows];
    }
    return baseRows;
  }, [currentRegionId, basketCalc.totalInflationPct]);

  const maxAbsValue = useMemo(() => {
    return Math.max(...compareRows.map((r) => Math.abs(r.value)), 0.1) * 1.15;
  }, [compareRows]);

  const cityNote = useMemo(() => {
    if (typeof selectedCity === "string" && selectedCity.indexOf("outra:") === 0) {
      return "O IBGE pesquisa preços nas capitais e regiões metropolitanas selecionadas. Para outros municípios, aplicamos a variação oficial nacional de cada item.";
    }
    const region = REGIONS.find((r) => r.id === selectedCity);
    if (!region) return null;
    if (region.scope === "sem-dado") {
      return "O IBGE não possui coleta contínua do SNIPC nesta UF. A calculadora utiliza a variação oficial nacional de cada item como referência.";
    }
    if (region.scope === "rm") {
      return `Dado apurado pelo IBGE especificamente para a Região Metropolitana de ${region.label.split(" – ")[0]}.`;
    }
    return `Dado apurado pelo IBGE especificamente para o município de ${region.label.split(" – ")[0]}.`;
  }, [selectedCity]);

  const sortedUfs = useMemo(() => {
    return Object.entries(UF_NAMES)
      .map(([uf, name]) => ({ uf, name }))
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  }, []);

  // Ordenação dos itens na tabela detalhada
  const sortedTableItems = useMemo(() => {
    const list = [...basketCalc.calculatedItems];
    if (tableSort === "contrib") {
      return list.sort((a, b) => b.contributionPp - a.contributionPp);
    }
    if (tableSort === "peso") {
      return list.sort((a, b) => b.currentBudgetShare - a.currentBudgetShare);
    }
    return list; // Padrão dos grupos do IBGE
  }, [basketCalc.calculatedItems, tableSort]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* ─── TOPO: NOME DA FERRAMENTA E CONTROLES ─── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e4e0d7] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f1ed] text-[#1f674f] text-xs font-bold mb-2">
              <Sparkles size={13} className="text-[#1f674f]" />
              Minha Inflação Real · Metodologia ARVO
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#123044] font-sans">
              Minha Inflação Real
            </h2>
            <p className="text-xs sm:text-sm text-[#667085] mt-1">
              Acumulado de 12 meses (Ago/2025 a Jul/2026) · Fontes: IBGE e FGV. Gastos ponderados pelo seu perfil.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#123044] hover:text-black bg-[#f6f4ef] hover:bg-[#e4e0d7] border border-[#e4e0d7] rounded-xl transition-colors cursor-pointer"
              title="Limpar todos os campos preenchidos"
            >
              <RotateCcw size={13} className="text-[#123044]" />
              Zerar Valores
            </button>
          </div>
        </div>
      </div>

      {/* ─── GRID PRINCIPAL: FORMULÁRIO (ESQUERDA) + RESULTADOS (DIREITA) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* COLUNA ESQUERDA: CONFIGURAÇÃO + CATEGORIAS + COMPROMISSOS + RENDA */}
            <div className="lg:col-span-7 space-y-6">
              {/* Card 1: Localidade & Seleção da Base Metodológica */}
              <div className="bg-white rounded-3xl p-6 border border-[#e4e0d7] shadow-xs space-y-5">
                {/* Localidade */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#e8f1ed] border border-[#d2e4dc] text-[#1f674f] flex items-center justify-center font-bold shrink-0">
                      <MapPin size={16} className="text-[#1f674f]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#123044]">Sua Localidade</h3>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#123044] block">Estado (UF):</label>
                      <select
                        value={selectedUf}
                        onChange={(e) => handleUfChange(e.target.value)}
                        className="w-full bg-[#f6f4ef] border border-[#e4e0d7] rounded-xl px-3 py-2 text-xs font-bold text-[#123044] focus:outline-none focus:border-[#1f674f] transition-all cursor-pointer"
                      >
                        <option value="nacional">Brasil (Média Nacional)</option>
                        <optgroup label="Estados">
                          {sortedUfs.map(({ uf, name }) => (
                            <option key={uf} value={uf}>{name} ({uf})</option>
                          ))}
                        </optgroup>
                      </select>
                    </div>

                    {selectedUf !== "nacional" && (
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#123044] block">Região de Coleta:</label>
                        <select
                          value={selectedCity}
                          onChange={(e) => setSelectedCity(e.target.value)}
                          className="w-full bg-[#f6f4ef] border border-[#e4e0d7] rounded-xl px-3 py-2 text-xs font-bold text-[#123044] focus:outline-none focus:border-[#1f674f] transition-all cursor-pointer"
                        >
                          {(() => {
                            const reg = REGIONS.find((r) => r.uf === selectedUf);
                            if (!reg) return null;
                            const cityName = reg.label.split(" – ")[0];
                            return (
                              <>
                                <option value={reg.id}>{cityName} (Capital / RM)</option>
                                <option value={`outra:${selectedUf}`}>Outra cidade do estado (Média Nacional)</option>
                              </>
                            );
                          })()}
                        </select>
                      </div>
                    )}
                  </div>

                  {cityNote && (
                    <p className="text-[11px] text-[#667085] bg-[#fbfaf5] p-2.5 rounded-xl border border-[#e4e0d7] flex items-center gap-2">
                      <Info size={14} className="text-[#1f674f] shrink-0" />
                      <span>{cityNote}</span>
                    </p>
                  )}
                </div>

                {/* Base Temporal dos Gastos: Atuais vs Início */}
                <div className="pt-4 border-t border-[#f0ece1] space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#e8f1ed] border border-[#d2e4dc] text-[#1f674f] flex items-center justify-center font-bold shrink-0">
                      <SlidersHorizontal size={16} className="text-[#1f674f]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#123044]">Base Temporal dos Gastos</h3>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setExpenseBase("final")}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        expenseBase === "final"
                          ? "bg-[#e8f1ed] border-[#1f674f] text-[#1f674f] ring-1 ring-[#1f674f]"
                          : "bg-[#fbfaf5] border-[#e4e0d7] text-[#667085] hover:border-[#1f674f]"
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-xs">
                        <span>Gastos Atuais (Padrão)</span>
                        {expenseBase === "final" && <CheckCircle2 size={14} className="text-[#1f674f]" />}
                      </div>
                      <p className="text-[11px] text-[#667085] mt-1 leading-snug">
                        Desconta a inflação de cada item para reconstruir o custo de 1 ano atrás.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setExpenseBase("initial")}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        expenseBase === "initial"
                          ? "bg-[#e8f1ed] border-[#1f674f] text-[#1f674f] ring-1 ring-[#1f674f]"
                          : "bg-[#fbfaf5] border-[#e4e0d7] text-[#667085] hover:border-[#1f674f]"
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-xs">
                        <span>Gastos de 12 Meses Atrás</span>
                        {expenseBase === "initial" && <CheckCircle2 size={14} className="text-[#1f674f]" />}
                      </div>
                      <p className="text-[11px] text-[#667085] mt-1 leading-snug">
                        Aplica a variação acumulada para projetar o custo atual da mesma cesta.
                      </p>
                    </button>
                  </div>
                </div>
              </div>

              {/* 9 Grupos Oficiais de Consumo (Accordions) */}
              <div className="space-y-3">
                <div className="px-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                    Cesta de Consumo (9 Grupos Oficiais do IPCA)
                  </h3>
                </div>

                {INFLATION_GROUPS.map((g) => {
                  const IconComp = g.icon;
                  const isOpen = Boolean(openGroups[g.id]);
                  const gTotals = basketCalc.groupTotals[g.id] || { initial: 0, current: 0 };
                  const gVal = expenseBase === "final" ? gTotals.current : gTotals.initial;
                  const gShare = basketCalc.costCurrent > 0 ? (gTotals.current / basketCalc.costCurrent) * 100 : 0;

                  return (
                    <div
                      key={g.id}
                      className="bg-white rounded-2xl border border-[#e4e0d7] overflow-hidden shadow-xs transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => toggleGroup(g.id)}
                        className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-[#fcfbf9] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                              isOpen
                                ? "bg-[#e8f1ed] text-[#1f674f] border-[#1f674f]/30 shadow-xs"
                                : "bg-[#f6f4ef] text-[#123044] border-[#e4e0d7]"
                            }`}
                          >
                            <IconComp size={17} className={isOpen ? "text-[#1f674f]" : "text-[#123044]"} />
                          </div>
                          <div className="truncate">
                            <span className="text-sm font-bold text-[#123044] block truncate">{g.label}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <div className="text-right">
                            <span className="text-xs font-bold text-[#123044] block font-sans">
                              {fmtMoney(gVal)}/mês
                            </span>
                            <span className="text-[10px] font-bold text-[#667085]">
                              {fmtPct(gShare, 1)} do consumo
                            </span>
                          </div>
                          <ChevronDown
                            size={16}
                            className={`text-[#123044] transition-transform duration-200 ${isOpen ? "rotate-180 text-[#1f674f]" : ""}`}
                          />
                        </div>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="px-5 pb-5 pt-2 border-t border-[#f0ece1] bg-[#fbfaf5]/50 space-y-3">
                              {g.items.map((it) => {
                                const key = `${g.id}.${it.id}`;
                                const raw = rawValues[key] || "";
                                const freq = frequencies[key] || it.defaultFrequency || "mensal";
                                const custom = customAdjustments[key];
                                const isCustomized = custom && custom.mode !== "none";
                                const effRate = getEffectiveRate(currentRegionId, g, it, custom);
                                const isEditing = editingItemKey === key;

                                return (
                                  <div
                                    key={it.id}
                                    className="bg-white p-3.5 rounded-xl border border-[#e4e0d7]/80 space-y-2.5 transition-all"
                                  >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                      <div className="space-y-0.5 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <label htmlFor={`input-${key}`} className="text-xs font-bold text-[#123044]">
                                            {it.label}
                                          </label>

                                          {/* Badge discreto apenas se for reajuste personalizado */}
                                          {isCustomized && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fbf4e8] text-[#9e6919] border border-[#f0dfbe]">
                                              ★ Reajuste pessoal
                                            </span>
                                          )}
                                        </div>

                                        <div className="flex items-center gap-2 text-[11px] text-[#667085]">
                                          <span>
                                            Variação 12m:{" "}
                                            <strong className="text-[#123044] font-bold font-sans">
                                              {fmtPct(effRate.rate)}
                                            </strong>
                                          </span>

                                          {/* Botão de Personalizar / Restaurar */}
                                          <button
                                            type="button"
                                            onClick={() => setEditingItemKey(isEditing ? null : key)}
                                            className="text-[10px] font-bold text-[#1f674f] hover:underline cursor-pointer ml-1"
                                          >
                                            {isCustomized ? "Editar" : "Personalizar"}
                                          </button>

                                          {isCustomized && (
                                            <button
                                              type="button"
                                              onClick={() => handleResetCustomItem(key)}
                                              className="text-[10px] font-bold text-[#b34a3c] hover:underline cursor-pointer flex items-center gap-0.5"
                                              title="Restaurar variação oficial do IBGE"
                                            >
                                              <RotateCcw size={10} className="text-[#b34a3c]" />
                                              Restaurar IBGE
                                            </button>
                                          )}
                                        </div>
                                      </div>

                                      {/* Entrada de Valor + Seletor Mensal/Anual */}
                                      <div className="flex items-center gap-2 shrink-0">
                                        {it.canAnnual && (
                                          <button
                                            type="button"
                                            onClick={() => handleFrequencyToggle(key)}
                                            className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                                              freq === "anual"
                                                ? "bg-[#1f674f] text-white border-[#1f674f]"
                                                : "bg-[#f6f4ef] text-[#667085] border-[#e4e0d7] hover:text-[#123044]"
                                            }`}
                                            title="Clique para alternar entre valor mensal ou anual (/12)"
                                          >
                                            {freq === "anual" ? "Anual (/12)" : "Mensal"}
                                          </button>
                                        )}

                                        <div className="relative w-36">
                                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#667085]">
                                            R$
                                          </span>
                                          <input
                                            id={`input-${key}`}
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="0"
                                            value={raw}
                                            onChange={(e) => handleRawValueChange(key, e.target.value)}
                                            className="w-full bg-[#f6f4ef] border border-[#e4e0d7] rounded-xl pl-8 pr-2.5 py-1.5 text-xs font-bold text-right text-[#123044] focus:outline-none focus:border-[#1f674f] transition-all font-sans"
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    {/* Sub-painel: Modo 2 (Personalizar reajuste ou preços) */}
                                    <AnimatePresence>
                                      {isEditing && (
                                        <motion.div
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: "auto", opacity: 1 }}
                                          exit={{ height: 0, opacity: 0 }}
                                          className="overflow-hidden pt-2 border-t border-[#f0ece1]"
                                        >
                                          <div className="p-3 bg-[#fbfaf5] rounded-xl border border-[#e4e0d7] space-y-2.5 text-xs">
                                            <div className="flex items-center justify-between">
                                              <span className="font-bold text-[#123044]">
                                                Personalizar Preço / Reajuste de {it.label}
                                              </span>
                                              <button
                                                type="button"
                                                onClick={() => setEditingItemKey(null)}
                                                className="text-[#667085] hover:text-[#123044]"
                                              >
                                                <X size={14} />
                                              </button>
                                            </div>

                                            <div className="flex gap-2">
                                              <button
                                                type="button"
                                                onClick={() => handleCustomModeChange(key, "pct")}
                                                className={`px-3 py-1.5 rounded-lg font-bold text-[11px] border cursor-pointer ${
                                                  custom?.mode === "pct"
                                                    ? "bg-[#1f674f] text-white border-[#1f674f]"
                                                    : "bg-white text-[#667085] border-[#e4e0d7]"
                                                }`}
                                              >
                                                Informar Reajuste (%)
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => handleCustomModeChange(key, "prices")}
                                                className={`px-3 py-1.5 rounded-lg font-bold text-[11px] border cursor-pointer ${
                                                  custom?.mode === "prices"
                                                    ? "bg-[#1f674f] text-white border-[#1f674f]"
                                                    : "bg-white text-[#667085] border-[#e4e0d7]"
                                                }`}
                                              >
                                                Preço Anterior vs. Atual
                                              </button>
                                            </div>

                                            {custom?.mode === "pct" && (
                                              <div className="space-y-1 pt-1">
                                                <label className="text-[11px] font-bold text-[#123044] block">
                                                  Reajuste anual observado no seu contrato (%):
                                                </label>
                                                <div className="relative w-36">
                                                  <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    placeholder="Ex: 8,5"
                                                    value={custom.pct}
                                                    onChange={(e) =>
                                                      setCustomAdjustments((prev) => ({
                                                        ...prev,
                                                        [key]: {
                                                          mode: "pct",
                                                          pct: e.target.value,
                                                          priceBefore: prev[key]?.priceBefore || "",
                                                          priceCurrent: prev[key]?.priceCurrent || ""
                                                        }
                                                      }))
                                                    }
                                                    className="w-full bg-white border border-[#e4e0d7] rounded-lg px-2.5 py-1 text-xs font-bold text-[#123044] focus:outline-none focus:border-[#1f674f]"
                                                  />
                                                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 font-bold text-[#667085]">
                                                    %
                                                  </span>
                                                </div>
                                              </div>
                                            )}

                                            {custom?.mode === "prices" && (
                                              <div className="grid sm:grid-cols-2 gap-2 pt-1">
                                                <div>
                                                  <label className="text-[11px] font-bold text-[#123044] block">
                                                    Preço 12 meses atrás:
                                                  </label>
                                                  <div className="relative">
                                                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] text-[#667085]">
                                                      R$
                                                    </span>
                                                    <input
                                                      type="text"
                                                      placeholder="Ex: 1500"
                                                      value={custom.priceBefore}
                                                      onChange={(e) =>
                                                        setCustomAdjustments((prev) => ({
                                                          ...prev,
                                                          [key]: {
                                                            mode: "prices",
                                                            pct: prev[key]?.pct || "",
                                                            priceBefore: e.target.value,
                                                            priceCurrent: prev[key]?.priceCurrent || ""
                                                          }
                                                        }))
                                                      }
                                                      className="w-full bg-white border border-[#e4e0d7] rounded-lg pl-8 pr-2 py-1 text-xs font-bold text-[#123044] focus:outline-none focus:border-[#1f674f]"
                                                    />
                                                  </div>
                                                </div>

                                                <div>
                                                  <label className="text-[11px] font-bold text-[#123044] block">
                                                    Preço atual:
                                                  </label>
                                                  <div className="relative">
                                                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] text-[#667085]">
                                                      R$
                                                    </span>
                                                    <input
                                                      type="text"
                                                      placeholder="Ex: 1650"
                                                      value={custom.priceCurrent}
                                                      onChange={(e) =>
                                                        setCustomAdjustments((prev) => ({
                                                          ...prev,
                                                          [key]: {
                                                            mode: "prices",
                                                            pct: prev[key]?.pct || "",
                                                            priceBefore: prev[key]?.priceBefore || "",
                                                            priceCurrent: e.target.value
                                                          }
                                                        }))
                                                      }
                                                      className="w-full bg-white border border-[#e4e0d7] rounded-lg pl-8 pr-2 py-1 text-xs font-bold text-[#123044] focus:outline-none focus:border-[#1f674f]"
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                            )}

                                            <p className="text-[10px] text-[#667085] leading-relaxed pt-1">
                                              💡 <em>Atenção metodológica:</em> Certifique-se de comparar o <strong>mesmo produto ou serviço</strong> (mesma cobertura de plano, mesma velocidade de internet ou mesmo imóvel), sem misturar aumento de quantidade com aumento de preço.
                                            </p>
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Seção 3: Compromissos Financeiros (Dívidas & Financiamentos - Separado do Consumo) */}
              <div className="bg-white rounded-3xl p-6 border border-[#e4e0d7] shadow-xs space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#e8f1ed] border border-[#d2e4dc] text-[#1f674f] flex items-center justify-center font-bold shrink-0">
                    <Wallet size={16} className="text-[#1f674f]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#123044]">Compromissos Financeiros (Opcional)</h3>
                    <p className="text-[11px] text-[#667085]">
                      Financiamentos e parcelas para acompanhar a pressão sobre o orçamento total, fora da cesta de consumo.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  {FINANCIAL_COMMITMENTS.map((fc) => {
                    const raw = financialValues[fc.id] || "";
                    const adj = financialAdjustments[fc.id] || "";

                    return (
                      <div key={fc.id} className="p-3 bg-[#fbfaf5] rounded-xl border border-[#e4e0d7] space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <span className="text-xs font-bold text-[#123044] block">{fc.label}</span>
                            <span className="text-[11px] text-[#667085] block">{fc.sub}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-32">
                              <label className="text-[10px] font-bold text-[#667085] block">Parcela Atual:</label>
                              <div className="relative">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#667085]">R$</span>
                                <input
                                  type="text"
                                  placeholder="0"
                                  value={raw}
                                  onChange={(e) =>
                                    setFinancialValues((prev) => ({
                                      ...prev,
                                      [fc.id]: e.target.value.replace(/[^\d.,]/g, "").replace(",", ".")
                                    }))
                                  }
                                  className="w-full bg-white border border-[#e4e0d7] rounded-lg pl-8 pr-2 py-1 text-xs font-bold text-right text-[#123044]"
                                />
                              </div>
                            </div>

                            <div className="w-24">
                              <label className="text-[10px] font-bold text-[#667085] block">Reajuste (%):</label>
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder="0,0%"
                                  value={adj}
                                  onChange={(e) =>
                                    setFinancialAdjustments((prev) => ({
                                      ...prev,
                                      [fc.id]: e.target.value
                                    }))
                                  }
                                  className="w-full bg-white border border-[#e4e0d7] rounded-lg px-2 py-1 text-xs font-bold text-center text-[#123044]"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Seção 4: Renda Familiar Líquida Inicial e Atual (Opcional) */}
              <div className="bg-white rounded-3xl p-6 border border-[#e4e0d7] shadow-xs space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#e8f1ed] border border-[#d2e4dc] text-[#1f674f] flex items-center justify-center font-bold shrink-0">
                    <TrendingUp size={16} className="text-[#1f674f]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#123044]">Evolução da Renda Líquida (Opcional)</h3>
                    <p className="text-[11px] text-[#667085]">
                      Compara a evolução dos seus rendimentos com a inflação da sua cesta.
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#123044] block">
                      Renda Líquida 12 Meses Atrás:
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#667085]">R$</span>
                      <input
                        type="text"
                        placeholder="Ex: 15.000"
                        value={incomeInitial}
                        onChange={(e) => setIncomeInitial(e.target.value)}
                        className="w-full bg-[#f6f4ef] border border-[#e4e0d7] rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-[#123044] focus:outline-none focus:border-[#1f674f]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#123044] block">
                      Renda Líquida Atual:
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#667085]">R$</span>
                      <input
                        type="text"
                        placeholder="Ex: 16.500"
                        value={incomeCurrent}
                        onChange={(e) => setIncomeCurrent(e.target.value)}
                        className="w-full bg-[#f6f4ef] border border-[#e4e0d7] rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-[#123044] focus:outline-none focus:border-[#1f674f]"
                      />
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-[#667085] leading-relaxed">
                  💡 Compara a renda familiar total, abrangendo salários, pró-labore e receitas de investimentos. Se a composição familiar mudou, o resultado reflete o orçamento do domicílio como um todo.
                </p>
              </div>
            </div>

            {/* COLUNA DIREITA: RESULTADOS PRINCIPAIS & ANÁLISE (Sticky) */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6">
              {/* Card Principal: Inflação Pessoal Estimada */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e4e0d7] shadow-sm space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#667085] block mb-1">
                    Inflação estimada da sua cesta (12 Meses)
                    {currentRegionId !== "nacional" && ` · ${regionLabel(currentRegionId)}`}
                  </span>

                  {basketCalc.totalInflationPct === null ? (
                    <div className="py-6 text-center space-y-2">
                      <div className="text-4xl font-extrabold text-[#a09e99] font-sans">—</div>
                      <p className="text-xs text-[#667085] max-w-xs mx-auto">
                        Preencha ao menos uma categoria à esquerda para calcular a taxa de inflação estimada da sua cesta.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-2">
                      <div
                        className="text-4xl sm:text-5xl font-black tracking-tight font-sans"
                        style={{
                          color: delta !== null && delta > 0.05 ? "#B34A3C" : delta !== null && delta < -0.05 ? "#1F674F" : "#123044"
                        }}
                      >
                        {fmtPct(basketCalc.totalInflationPct)}
                      </div>

                      {/* Delta Pill vs IPCA de Referência */}
                      {delta !== null && (
                        <div>
                          {Math.abs(delta) < 0.05 ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#f6f4ef] text-[#123044] border border-[#e4e0d7]">
                              <CheckCircle2 size={13} className="text-[#1f674f]" />
                              Alinhada ao IPCA de referência ({fmtPct(referenceIpca)})
                            </span>
                          ) : delta > 0 ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FBEAEA] text-[#B34A3C] border border-[#B34A3C]/20">
                              <TrendingUp size={13} />
                              ▲ {fmtPp(Math.abs(delta))} acima do IPCA ({fmtPct(referenceIpca)})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E8F1ED] text-[#1F674F] border border-[#1F674F]/20">
                              <TrendingDown size={13} />
                              ▼ {fmtPp(Math.abs(delta))} abaixo do IPCA ({fmtPct(referenceIpca)})
                            </span>
                          )}
                        </div>
                      )}

                      {/* Alerta de Cesta Parcial */}
                      {basketCalc.filledItemsCount < 4 && (
                        <div className="p-2.5 bg-[#fbf4e8] rounded-xl border border-[#c08a34]/30 text-[11px] text-[#9e6919] flex items-center gap-2">
                          <ShieldAlert size={14} className="text-[#9e6919] shrink-0" />
                          <span>
                            Cesta com {basketCalc.filledItemsCount} {basketCalc.filledItemsCount === 1 ? "item informado" : "itens informados"}. Preencha mais categorias para ampliar a precisão.
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bloco 2: Impacto em Reais */}
                {basketCalc.totalInflationPct !== null && (
                  <div className="p-4 bg-[#fbfaf5] rounded-2xl border border-[#e4e0d7] space-y-3 text-xs">
                    <span className="font-bold text-[#123044] block uppercase tracking-wider text-[11px]">
                      Impacto em Reais da Mesma Cesta
                    </span>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[#667085] block text-[11px]">Custo 12 meses atrás:</span>
                        <strong className="text-sm font-bold text-[#123044] font-sans">
                          {fmtMoney(basketCalc.costInitial)}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[#667085] block text-[11px]">Custo atual:</span>
                        <strong className="text-sm font-bold text-[#123044] font-sans">
                          {fmtMoney(basketCalc.costCurrent)}
                        </strong>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#f0ece1] flex items-center justify-between">
                      <div>
                        <span className="text-[#667085] block text-[11px]">Diferença mensal:</span>
                        <span className="text-xs font-bold text-[#123044] font-sans">
                          {basketCalc.monthlyDiff >= 0 ? "+" : ""}{fmtMoney(basketCalc.monthlyDiff)}/mês
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[#667085] block text-[11px]">Impacto anualizado (x12):</span>
                        <span className="text-xs font-extrabold text-[#1f674f] font-sans">
                          {basketCalc.annualizedImpact >= 0 ? "+" : ""}{fmtMoney(basketCalc.annualizedImpact)}/ano
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bloco 3: Pressão sobre o Orçamento Total (Consumo + Financiamentos) */}
                {financialCalc.hasDebts && (
                  <div className="p-4 bg-[#e8eef2] rounded-2xl border border-[#0f2a3d]/20 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0f2a3d] flex items-center gap-1.5">
                        <Wallet size={14} />
                        Pressão sobre o Orçamento Total
                      </span>
                      {financialCalc.totalOutflowVariationPct !== null && (
                        <span className="font-bold font-sans text-xs text-[#0f2a3d]">
                          {fmtPct(financialCalc.totalOutflowVariationPct)}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div>
                        <span className="text-[#667085]">Desembolso anterior:</span>
                        <strong className="block text-[#0f2a3d] font-bold font-sans">
                          {fmtMoney(financialCalc.totalOutflowInitial)}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[#667085]">Desembolso atual:</span>
                        <strong className="block text-[#0f2a3d] font-bold font-sans">
                          {fmtMoney(financialCalc.totalOutflowCurrent)}
                        </strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bloco 4: Comparativo de Renda e Poder de Compra */}
                {incomeCalc.hasData && (
                  <div className="p-4 bg-[#fbfaf5] rounded-2xl border border-[#e4e0d7] space-y-2 text-xs">
                    <span className="font-bold text-[#123044] block uppercase tracking-wider text-[11px]">
                      Poder de Compra da Renda Familiar
                    </span>

                    {incomeCalc.hasBoth && incomeCalc.incomeGrowthPct !== null ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[#667085]">Crescimento nominal da renda:</span>
                          <span className="font-bold text-[#123044] font-sans">
                            {fmtPct(incomeCalc.incomeGrowthPct)}
                          </span>
                        </div>

                        {incomeCalc.realPurchasingPowerChangePct !== null && (
                          <div className="flex items-center justify-between pt-1 border-t border-[#f0ece1]">
                            <span className="text-[#667085]">Variação real do poder de compra:</span>
                            <span
                              className={`font-bold font-sans ${
                                incomeCalc.realPurchasingPowerChangePct >= 0
                                  ? "text-[#1f674f]"
                                  : "text-[#b34a3c]"
                              }`}
                            >
                              {incomeCalc.realPurchasingPowerChangePct >= 0 ? "▲ +" : "▼ "}
                              {fmtPct(incomeCalc.realPurchasingPowerChangePct)}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : null}

                    {incomeCalc.currentCommitmentPct !== null && (
                      <div className="pt-2 border-t border-[#f0ece1] flex items-center justify-between text-[11px]">
                        <span className="text-[#667085]">Comprometimento atual com consumo:</span>
                        <strong className="text-[#123044] font-bold font-sans">
                          {fmtPct(incomeCalc.currentCommitmentPct, 1)}
                        </strong>
                      </div>
                    )}
                  </div>
                )}

                {/* Bloco 5: Cobertura Factual dos Dados da Cesta */}
                {basketCalc.filledItemsCount > 0 && (
                  <div className="space-y-2 pt-2 border-t border-[#f0ece1]">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#667085] uppercase tracking-wider">
                      <span>Composição dos Dados Utilizados</span>
                      <span>Cobertura</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                      <div className="p-2 bg-[#fbfaf5] rounded-xl border border-[#e4e0d7]">
                        <span className="text-[#667085] block">IBGE Local</span>
                        <strong className="text-xs font-bold text-[#123044] font-sans">
                          {fmtPct(basketCalc.coverage.ibgePct, 0)}
                        </strong>
                      </div>
                      <div className="p-2 bg-[#fbf4e8] rounded-xl border border-[#c08a34]/30">
                        <span className="text-[#c08a34] block">Personalizado</span>
                        <strong className="text-xs font-bold text-[#c08a34] font-sans">
                          {fmtPct(basketCalc.coverage.customPct, 0)}
                        </strong>
                      </div>
                      <div className="p-2 bg-[#fbfaf5] rounded-xl border border-[#e4e0d7]">
                        <span className="text-[#667085] block">Aproximações</span>
                        <strong className="text-xs font-bold text-[#667085] font-sans">
                          {fmtPct(basketCalc.coverage.proxyPct, 0)}
                        </strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* Seletor de Visão no Card: Donut vs Índices Oficiais */}
                <div className="pt-4 border-t border-[#f0ece1] space-y-4">
                  <div className="flex items-center p-1 bg-[#f6f4ef] rounded-xl border border-[#e4e0d7] text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setRightCardTab("gastos")}
                      className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        rightCardTab === "gastos"
                          ? "bg-white text-[#123044] shadow-xs scale-[1.01]"
                          : "text-[#667085] hover:text-[#123044]"
                      }`}
                    >
                      <PieIcon size={14} className={rightCardTab === "gastos" ? "text-[#1f674f]" : ""} />
                      Distribuição do Consumo
                    </button>
                    <button
                      type="button"
                      onClick={() => setRightCardTab("indices")}
                      className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        rightCardTab === "indices"
                          ? "bg-white text-[#123044] shadow-xs scale-[1.01]"
                          : "text-[#667085] hover:text-[#123044]"
                      }`}
                    >
                      <TrendingUp size={14} className={rightCardTab === "indices" ? "text-[#1f674f]" : ""} />
                      Índices Oficiais
                    </button>
                  </div>

                  {rightCardTab === "gastos" && (
                    <div className="space-y-4">
                      {basketCalc.costCurrent <= 0 ? (
                        <div className="py-8 text-center text-xs text-[#667085] bg-[#fbfaf5] rounded-2xl border border-[#e4e0d7] p-4">
                          Preencha itens de consumo à esquerda para visualizar a distribuição da sua cesta.
                        </div>
                      ) : (
                        <>
                          <div className="h-52 w-full relative flex items-center justify-center bg-[#fbfaf5] rounded-2xl border border-[#e4e0d7] p-2">
                            <ResponsiveContainer width="100%" height="100%">
                              <RechartsPieChart>
                                <Pie
                                  data={categoryChartData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={56}
                                  outerRadius={80}
                                  paddingAngle={1}
                                  dataKey="value"
                                  nameKey="name"
                                  animationDuration={400}
                                >
                                  {categoryChartData.map((entry) => (
                                    <Cell key={`cell-${entry.id}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={1} />
                                  ))}
                                </Pie>
                                <RechartsTooltip content={<CustomDonutTooltip />} />
                              </RechartsPieChart>
                            </ResponsiveContainer>

                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                              <span className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">
                                Cesta Mensal
                              </span>
                              <span className="text-sm font-black text-[#123044] font-sans">
                                {fmtMoney(basketCalc.costCurrent)}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {categoryChartData.map((item) => (
                              <div key={item.id} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2 min-w-0 pr-2">
                                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="font-bold text-[#123044] truncate">{item.name}</span>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <span className="font-bold text-[#123044] font-sans mr-2">{fmtMoney(item.value)}</span>
                                    <span className="text-[11px] font-extrabold text-[#1f674f] font-sans">{fmtPct(item.pct, 1)}</span>
                                  </div>
                                </div>
                                <div className="h-1.5 bg-[#f0ece1] rounded-full overflow-hidden">
                                  <div className="h-full rounded-full transition-all duration-300" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {rightCardTab === "indices" && (
                    <div className="space-y-3">
                      {compareRows.map((r) => {
                        const isNeg = r.value < 0;
                        const barWidth = Math.max(3, Math.min(100, (Math.abs(r.value) / maxAbsValue) * 100));

                        return (
                          <div key={r.id} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className={`font-bold truncate pr-2 ${r.isYou ? "text-[#1f674f] font-extrabold" : "text-[#123044]"}`}>
                                {r.isYou ? "★ " : ""}{r.name}
                              </span>
                              <span className={`font-bold shrink-0 font-sans ${r.isYou ? "text-[#1f674f] text-sm" : isNeg ? "text-emerald-700" : "text-[#123044]"}`}>
                                {isNeg ? "▼ " : ""}{fmtPct(r.value)}
                              </span>
                            </div>
                            <div className="h-2 bg-[#f0ece1] rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  r.isYou ? "bg-[#1f674f]" : isNeg ? "bg-emerald-600/70" : "bg-[#667085]"
                                }`}
                                style={{ width: `${barWidth}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Glossário dos Índices */}
                <div className="pt-4 border-t border-[#f0ece1]">
                  <button
                    type="button"
                    onClick={() => setShowIdxDefs(!showIdxDefs)}
                    className="w-full flex items-center justify-between text-xs font-bold text-[#1f674f] hover:text-[#123044] transition-colors cursor-pointer py-1"
                  >
                    <span className="flex items-center gap-1.5">
                      <HelpCircle size={13} />
                      O que significa cada índice financeiro?
                    </span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${showIdxDefs ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {showIdxDefs && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2.5 pt-3 text-[11px] text-[#667085] leading-relaxed">
                          {HEADLINE_INDICES.map((idx) => (
                            <div key={idx.id} className="p-2.5 bg-[#fbfaf5] rounded-xl border border-[#e4e0d7]">
                              <strong className="text-[#123044] block font-bold">{idx.name} ({idx.full}):</strong>
                              {idx.desc}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* ─── SEÇÃO DE DESTAQUE: MAIORES RESPONSÁVEIS PELO RESULTADO (TOP CONTRIBUTORS) ─── */}
          {basketCalc.totalInflationPct !== null && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e4e0d7] shadow-xs space-y-5">
              <div>
                <h3 className="text-lg font-bold text-[#123044] font-sans">
                  Maiores Responsáveis pelo Resultado
                </h3>
                <p className="text-xs text-[#667085] mt-0.5">
                  Itens com maior impacto na sua taxa, ponderados pelo peso no seu orçamento.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {basketCalc.topPositive.map((it, idx) => (
                  <div key={it.key} className="p-4 bg-[#FBEAEA]/60 rounded-2xl border border-[#B34A3C]/20 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-[#B34A3C] uppercase tracking-wider text-[10px]">
                        #{idx + 1} Maior Impacto
                      </span>
                      <span className="inline-flex items-center gap-1 font-bold text-xs text-[#B34A3C] font-sans">
                        <ArrowUpRight size={13} className="text-[#B34A3C]" />
                        {fmtPp(it.contributionPp)}
                      </span>
                    </div>
                    <strong className="text-sm font-bold text-[#123044] block truncate">
                      {it.itemLabel}
                    </strong>
                    <div className="text-[11px] text-[#667085] space-y-0.5 pt-1 border-t border-[#B34A3C]/10">
                      <div className="flex justify-between">
                        <span>Reajuste no período:</span>
                        <strong className="text-[#123044] font-bold font-sans">{fmtPct(it.ratePct)}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Peso no cálculo:</span>
                        <strong className="text-[#123044] font-bold font-sans">{fmtPct(it.weightInCalculation, 1)}</strong>
                      </div>
                    </div>
                  </div>
                ))}

                {basketCalc.negativeContributors.map((it) => (
                  <div key={it.key} className="p-4 bg-[#E8F1ED]/60 rounded-2xl border border-[#1F674F]/20 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-[#1F674F] uppercase tracking-wider text-[10px]">
                        Alívio de Preço
                      </span>
                      <span className="inline-flex items-center gap-1 font-bold text-xs text-[#1F674F] font-sans">
                        <ArrowDownRight size={13} className="text-[#1F674F]" />
                        {fmtPp(it.contributionPp)}
                      </span>
                    </div>
                    <strong className="text-sm font-bold text-[#123044] block truncate">
                      {it.itemLabel}
                    </strong>
                    <div className="text-[11px] text-[#667085] space-y-0.5 pt-1 border-t border-[#1F674F]/10">
                      <div className="flex justify-between">
                        <span>Queda de preço:</span>
                        <strong className="text-[#1F674F] font-bold font-sans">{fmtPct(it.ratePct)}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Peso no cálculo:</span>
                        <strong className="text-[#123044] font-bold font-sans">{fmtPct(it.weightInCalculation, 1)}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── TABELA DE DETALHAMENTO COMPLETO COM ORDENAÇÃO E CONTRIBUIÇÃO EM P.P. ─── */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e4e0d7] shadow-xs space-y-5 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#123044] font-sans">
                  Detalhamento por Item
                </h3>
                <p className="text-xs text-[#667085] mt-0.5">
                  Contribuição em pontos percentuais (p.p.) de cada despesa no índice final.
                </p>
              </div>

              {/* Seletor de Ordenação */}
              <div className="flex items-center gap-2 text-xs font-bold text-[#667085] shrink-0">
                <span>Ordenar:</span>
                <select
                  value={tableSort}
                  onChange={(e) => setTableSort(e.target.value as any)}
                  className="bg-[#f6f4ef] border border-[#e4e0d7] rounded-xl px-3 py-1.5 text-xs font-bold text-[#123044] cursor-pointer"
                >
                  <option value="contrib">Maior Contribuição (p.p.)</option>
                  <option value="peso">Maior Gasto / Peso</option>
                  <option value="padrao">Grupos Oficiais do IBGE</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto -mx-6 sm:mx-0">
              <table className="w-full text-left border-collapse min-w-[760px] text-xs">
                <thead>
                  <tr className="bg-[#fbfaf5] border-y border-[#e4e0d7] text-[#667085] uppercase tracking-wider font-bold">
                    <th className="py-3 px-4">Item / Categoria</th>
                    <th className="py-3 px-4 text-right">Gasto Mensal</th>
                    <th className="py-3 px-4 text-right">Participação Atual</th>
                    <th className="py-3 px-4 text-right">Peso no Cálculo</th>
                    <th className="py-3 px-4 text-right">Variação 12m</th>
                    <th className="py-3 px-4 text-left">Origem</th>
                    <th className="py-3 px-4 text-right">Contribuição (p.p.)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ece1]">
                  {sortedTableItems.map((it) => {
                    const dispVal = expenseBase === "final" ? it.valCurrent : it.valInitial;

                    return (
                      <tr key={it.key} className="hover:bg-[#fbfaf5] transition-colors">
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: it.groupColor }} />
                            <span className={it.isFilled ? "font-bold text-[#123044]" : "text-[#667085]"}>
                              {it.itemLabel}
                            </span>
                            <span className="text-[10px] text-[#667085]">({it.groupLabel})</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-right font-bold text-[#123044] font-sans">
                          {fmtMoney(dispVal)}
                        </td>
                        <td className="py-2.5 px-4 text-right font-bold text-[#123044] font-sans">
                          {it.isFilled ? fmtPct(it.currentBudgetShare, 1) : "—"}
                        </td>
                        <td className="py-2.5 px-4 text-right text-[#667085] font-sans">
                          {it.isFilled ? fmtPct(it.weightInCalculation, 1) : "—"}
                        </td>
                        <td className="py-2.5 px-4 text-right text-[#123044] font-sans font-medium">
                          {fmtPct(it.ratePct)}
                        </td>
                        <td className="py-2.5 px-4 text-left text-[11px] text-[#667085]">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              it.sourceType.startsWith("custom")
                                ? "bg-[#fbf4e8] text-[#9e6919] border border-[#f0dfbe]"
                                : "bg-[#f6f4ef] text-[#667085]"
                            }`}
                          >
                            {it.sourceType.startsWith("custom") ? "Pessoal" : "IBGE"}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right font-bold font-sans">
                          {it.isFilled ? (
                            <span className={it.contributionPp > 0 ? "text-[#1f674f]" : it.contributionPp < 0 ? "text-emerald-700" : "text-[#667085]"}>
                              {fmtPp(it.contributionPp)}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-[#f6f4ef] border-t-2 border-[#123044] font-bold text-[#123044]">
                    <td className="py-3 px-4 text-sm font-extrabold">Cesta Total de Consumo</td>
                    <td className="py-3 px-4 text-right font-extrabold font-sans text-sm">
                      {fmtMoney(expenseBase === "final" ? basketCalc.costCurrent : basketCalc.costInitial)}
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold font-sans">100,0%</td>
                    <td className="py-3 px-4 text-right font-extrabold font-sans">100,0%</td>
                    <td className="py-3 px-4 text-right text-[#667085] font-sans">—</td>
                    <td className="py-3 px-4 text-left text-[11px] text-[#667085]">Soma Exata</td>
                    <td className="py-3 px-4 text-right font-extrabold font-sans text-sm text-[#1f674f]">
                      {basketCalc.totalInflationPct !== null ? fmtPp(basketCalc.sumContributionsPp) : "—"}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* ─── SEÇÃO EDUCATIVA (OPCIONAL / RECOLHIDA) ─── */}
          <div className="bg-white rounded-2xl border border-[#e4e0d7] overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => setShowFaq(!showFaq)}
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[#fcfbf9] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#e8f1ed] border border-[#d2e4dc] text-[#1f674f] flex items-center justify-center font-bold shrink-0">
                  <BookOpen size={15} className="text-[#1f674f]" />
                </div>
                <span className="text-xs font-bold text-[#123044]">
                  Conceitos e dúvidas frequentes sobre inflação pessoal
                </span>
              </div>
              <ChevronDown
                size={16}
                className={`text-[#123044] transition-transform duration-200 ${showFaq ? "rotate-180 text-[#1f674f]" : ""}`}
              />
            </button>

            <AnimatePresence>
              {showFaq && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-5 pt-2 border-t border-[#f0ece1] grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    <div className="p-3.5 bg-[#fbfaf5] rounded-xl border border-[#e4e0d7] space-y-1.5">
                      <h4 className="font-bold text-[#123044]">1. Inflação Menor ≠ Preços Menores</h4>
                      <p className="text-[#667085] leading-relaxed text-[11px]">
                        Desinflação é desaceleração do aumento. Os preços só caem em caso de deflação (taxa negativa).
                      </p>
                    </div>

                    <div className="p-3.5 bg-[#fbfaf5] rounded-xl border border-[#e4e0d7] space-y-1.5">
                      <h4 className="font-bold text-[#123044]">2. Por que sua Cesta Difere do IPCA?</h4>
                      <p className="text-[#667085] leading-relaxed text-[11px]">
                        O IPCA afere uma família média (1 a 40 SM). Gastos maiores em educação privada, saúde ou viagens mudam o seu índice pessoal.
                      </p>
                    </div>

                    <div className="p-3.5 bg-[#fbfaf5] rounded-xl border border-[#e4e0d7] space-y-1.5">
                      <h4 className="font-bold text-[#123044]">3. Efeito Preço vs. Padrão de Vida</h4>
                      <p className="text-[#667085] leading-relaxed text-[11px]">
                        Gastar mais por upgrade ou estilo de vida não é inflação. O cálculo isola o custo de manter a mesma cesta constante.
                      </p>
                    </div>

                    <div className="p-3.5 bg-[#fbfaf5] rounded-xl border border-[#e4e0d7] space-y-1.5">
                      <h4 className="font-bold text-[#123044]">4. Reajuste (%) vs. Contribuição (p.p.)</h4>
                      <p className="text-[#667085] leading-relaxed text-[11px]">
                        Um item que sobe 30% mas pesa 1% contribui com 0,30 p.p. Já alimentação subindo 5% com peso 30% adiciona 1,50 p.p.
                      </p>
                    </div>

                    <div className="p-3.5 bg-[#fbfaf5] rounded-xl border border-[#e4e0d7] space-y-1.5">
                      <h4 className="font-bold text-[#123044]">5. Inflação Passada não é Previsão</h4>
                      <p className="text-[#667085] leading-relaxed text-[11px]">
                        Os dados apuram os últimos 12 meses. O futuro responde à taxa Selic, câmbio e safras agrícolas.
                      </p>
                    </div>

                    <div className="p-3.5 bg-[#fbfaf5] rounded-xl border border-[#e4e0d7] space-y-1.5">
                      <h4 className="font-bold text-[#123044]">6. O que é o M2 na Economia?</h4>
                      <p className="text-[#667085] leading-relaxed text-[11px]">
                        M2 é liquidez e dinheiro em circulação, um agregado macroeconômico e não um índice de preços ao consumidor.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
    </div>
  );
}

export default CalculadoraMinhaInflacaoReal;
