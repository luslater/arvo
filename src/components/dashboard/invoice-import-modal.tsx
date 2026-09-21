"use client";

import React, { useState, useRef, useMemo } from "react";
import {
  X,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Filter,
  Search,
  ArrowRight,
  DollarSign,
  Tag,
  Check,
  RefreshCw,
  Sparkles
} from "lucide-react";
import { ExtractedInvoiceTransaction, InvoiceExtractionResponse } from "@/app/api/extract/invoice/route";

interface InvoiceImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (categoryTotals: Record<string, number>, rawTransactions: ExtractedInvoiceTransaction[]) => void;
}

const CATEGORY_OPTIONS: Array<{ id: string; label: string; color: string }> = [
  { id: "habitacao", label: "Moradia & Habitação", color: "#2B6E76" },
  { id: "alimentacao", label: "Alimentação (Mercado e Delivery)", color: "#1F674F" },
  { id: "transportes", label: "Transportes & Combustível", color: "#2E5C6E" },
  { id: "saude", label: "Saúde & Farmácia", color: "#3B82F6" },
  { id: "educacao", label: "Educação & Cursos", color: "#8B5CF6" },
  { id: "comunicacao", label: "Comunicação & Streaming", color: "#06B6D4" },
  { id: "despesas", label: "Estilo de Vida & Lazer", color: "#EC4899" },
  { id: "artigos", label: "Artigos do Lar & Vestuário", color: "#F59E0B" },
  { id: "dividas", label: "Compromissos & Dívidas", color: "#EF4444" },
  { id: "outros", label: "Outros / A Categorizar", color: "#6B7280" }
];

export function InvoiceImportModal({ isOpen, onClose, onApply }: InvoiceImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [pasteText, setPasteText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<ExtractedInvoiceTransaction[]>([]);
  const [cardIssuer, setCardIssuer] = useState<string>("");
  const [statementPeriod, setStatementPeriod] = useState<string>("");
  const [filterMode, setFilterMode] = useState<"all" | "review" | string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Filtros
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch =
        !searchQuery ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.groupLabel.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;

      if (filterMode === "all") return true;
      if (filterMode === "review") return t.needsReview;
      return t.groupId === filterMode;
    });
  }, [transactions, filterMode, searchQuery]);

  // Totais consolidados dos itens selecionados
  const { totalSelectedAmount, reviewCount, selectedCount, totalsByCategory } = useMemo(() => {
    let total = 0;
    let revCount = 0;
    let selCount = 0;
    const catTotals: Record<string, number> = {};

    transactions.forEach((t) => {
      if (t.needsReview) revCount++;
      if (t.selected) {
        total += t.amount;
        selCount++;
        catTotals[t.groupId] = (catTotals[t.groupId] || 0) + t.amount;
      }
    });

    return {
      totalSelectedAmount: total,
      reviewCount: revCount,
      selectedCount: selCount,
      totalsByCategory: catTotals
    };
  }, [transactions]);

  if (!isOpen) return null;

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setErrorMessage(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setErrorMessage(null);
    }
  };

  const handleExtract = async () => {
    if (!file && !pasteText.trim()) {
      setErrorMessage("Selecione um arquivo de fatura (PDF, Excel, Imagem) ou cole o texto do extrato.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      let res: Response;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        res = await fetch("/api/extract/invoice", {
          method: "POST",
          body: formData
        });
      } else {
        res = await fetch("/api/extract/invoice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: pasteText })
        });
      }

      const data: InvoiceExtractionResponse = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Não foi possível extrair a fatura.");
      }

      setTransactions(data.transactions || []);
      setCardIssuer(data.cardIssuer || "Cartão de Crédito");
      setStatementPeriod(data.statementPeriod || "");
      if (data.needsReviewCount > 0) {
        setFilterMode("review");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Erro de conexão ao processar fatura.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleSelect = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, selected: !t.selected } : t))
    );
  };

  const handleCategoryChange = (id: string, newGroupId: string) => {
    const opt = CATEGORY_OPTIONS.find((c) => c.id === newGroupId);
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              groupId: newGroupId,
              groupLabel: opt ? opt.label : t.groupLabel,
              needsReview: false,
              confidence: "high"
            }
          : t
      )
    );
  };

  const handleToggleSelectAll = () => {
    const areAllSelected = transactions.every((t) => t.selected);
    setTransactions((prev) => prev.map((t) => ({ ...t, selected: !areAllSelected })));
  };




  const handleConfirmApply = () => {
    onApply(totalsByCategory, transactions);
    onClose();
  };

  const formatBRL = (val: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#123044]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#fffdf8] border border-[#e4e0d7] rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[#e4e0d7] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#e8f1ed] text-[#1f674f] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-[#1f674f]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#123044]">
                Leitor Inteligente de Fatura de Cartão
              </h3>
              <p className="text-xs text-[#667085]">
                A IA da ARVO lê seu extrato, categoriza os gastos e você ajusta o que for incerto.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {transactions.length === 0 ? (
            /* ─── UPLOAD SCREEN ─── */
            <div className="space-y-5">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  file
                    ? "border-[#1f674f] bg-[#e8f1ed]/30"
                    : "border-[#d8d3c5] hover:border-[#1f674f] hover:bg-[#fcfbf7]"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.csv,.xlsx,.xls,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#f0ece1] text-[#123044] flex items-center justify-center">
                    {file ? <FileText className="w-7 h-7 text-[#1f674f]" /> : <UploadCloud className="w-7 h-7" />}
                  </div>
                  <div>
                    {file ? (
                      <>
                        <div className="text-sm font-bold text-[#123044]">{file.name}</div>
                        <div className="text-xs text-[#667085]">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB · Pronto para leitura
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-sm font-bold text-[#123044]">
                          Arraste a fatura do seu cartão de crédito aqui
                        </div>
                        <div className="text-xs text-[#667085] mt-1">
                          Aceita PDF de qualquer banco (Nubank, Itaú, XP, BTG, Inter, Bradesco), Excel (.xlsx, .csv) ou foto
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Paste Text Alternative */}
              <div className="relative">
                <div className="text-xs font-bold text-[#123044] uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span>Ou cole o texto copiado da fatura</span>
                  <span className="text-[10px] text-[#8492a6] font-normal lowercase">(opcional)</span>
                </div>
                <textarea
                  rows={4}
                  placeholder="Ex: 12/02 Supermercado Pão de Açúcar R$ 240,50&#10;14/02 Posto Shell R$ 180,00&#10;15/02 iFood Restaurante R$ 68,90..."
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  className="w-full bg-[#f6f4ef] rounded-xl p-3 text-xs text-[#123044] border border-[#e4e0d7] focus:outline-none focus:border-[#1f674f] font-mono leading-relaxed"
                />
              </div>

              {errorMessage && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-[#e4e0d7] text-xs font-bold text-[#667085] hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleExtract}
                  disabled={isProcessing || (!file && !pasteText.trim())}
                  className="px-6 py-2.5 rounded-xl bg-[#1f674f] hover:bg-[#19533f] disabled:opacity-50 text-white text-xs font-bold shadow-sm flex items-center gap-2 transition-all cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Lendo e categorizando fatura com IA...</span>
                    </>
                  ) : (
                    <>
                      <span>Analisar e Categorizar Fatura</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* ─── RECONCILIATION SCREEN ─── */
            <div className="space-y-4">
              {/* Card Summary Banner */}
              <div className="bg-[#f6f4ef] border border-[#e4e0d7] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-[#667085] uppercase tracking-wider">
                    Fatura Reconhecida: <span className="text-[#123044] font-extrabold">{cardIssuer}</span>
                  </div>
                  <div className="text-xl font-extrabold text-[#123044] mt-0.5 tabular-nums">
                    {formatBRL(totalSelectedAmount)}
                    <span className="text-xs font-normal text-[#667085] ml-2">
                      ({selectedCount} de {transactions.length} transações selecionadas)
                    </span>
                  </div>
                </div>

                {reviewCount > 0 ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 flex items-center gap-2 text-amber-800 text-xs font-semibold self-start sm:self-auto">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 animate-bounce" />
                    <span>{reviewCount} itens requerem sua confirmação de categoria</span>
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 flex items-center gap-2 text-emerald-800 text-xs font-semibold self-start sm:self-auto">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Todas as transações foram categorizadas com sucesso!</span>
                  </div>
                )}
              </div>

              {/* Filters & Search */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setFilterMode("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      filterMode === "all"
                        ? "bg-[#123044] text-white"
                        : "bg-white border border-[#e4e0d7] text-[#667085] hover:bg-slate-50"
                    }`}
                  >
                    Todas ({transactions.length})
                  </button>

                  {reviewCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setFilterMode("review")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        filterMode === "review"
                          ? "bg-amber-600 text-white"
                          : "bg-amber-50 border border-amber-300 text-amber-800 hover:bg-amber-100"
                      }`}
                    >
                      <AlertTriangle className="w-3 h-3" />
                      Revisar ({reviewCount})
                    </button>
                  )}

                  <select
                    value={filterMode.startsWith("all") || filterMode === "review" ? "" : filterMode}
                    onChange={(e) => setFilterMode(e.target.value || "all")}
                    className="bg-white border border-[#e4e0d7] text-[#123044] text-xs font-bold rounded-lg px-2.5 py-1.5 outline-none"
                  >
                    <option value="">Filtrar por Categoria...</option>
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label} ({totalsByCategory[c.id] ? formatBRL(totalsByCategory[c.id]) : "R$ 0"})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative w-full sm:w-60">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#98a2b3]" />
                  <input
                    type="text"
                    placeholder="Buscar estabelecimento..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-[#e4e0d7] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#123044] focus:outline-none focus:border-[#1f674f]"
                  />
                </div>
              </div>

              {/* Transactions List */}
              <div className="border border-[#e4e0d7] rounded-2xl overflow-hidden bg-white">
                <div className="px-4 py-2.5 bg-[#f6f4ef] border-b border-[#e4e0d7] flex items-center justify-between text-[11px] font-bold text-[#667085] uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={transactions.length > 0 && transactions.every((t) => t.selected)}
                      onChange={handleToggleSelectAll}
                      className="rounded text-[#1f674f] focus:ring-[#1f674f] cursor-pointer"
                    />
                    <span>Transação / Estabelecimento</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span>Categoria</span>
                    <span className="w-24 text-right">Valor</span>
                  </div>
                </div>

                <div className="divide-y divide-[#f0ece1] max-h-72 overflow-y-auto">
                  {filteredTransactions.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[#667085]">
                      Nenhuma transação encontrada para este filtro.
                    </div>
                  ) : (
                    filteredTransactions.map((tx) => (
                      <div
                        key={tx.id}
                        className={`px-4 py-3 flex items-center justify-between gap-3 text-xs transition-colors ${
                          tx.needsReview ? "bg-amber-50/50 hover:bg-amber-50" : "hover:bg-slate-50/70"
                        } ${!tx.selected ? "opacity-40" : ""}`}
                      >
                        {/* Checkbox + Desc */}
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <input
                            type="checkbox"
                            checked={tx.selected}
                            onChange={() => handleToggleSelect(tx.id)}
                            className="rounded text-[#1f674f] focus:ring-[#1f674f] cursor-pointer shrink-0"
                          />
                          <span className="text-[11px] text-[#8492a6] font-mono shrink-0 w-12">{tx.date}</span>
                          <div className="min-w-0">
                            <div className="font-semibold text-[#123044] truncate flex items-center gap-1.5">
                              <span>{tx.description}</span>
                              {tx.installment && (
                                <span className="bg-[#e8f1ed] text-[#1f674f] text-[10px] font-bold px-1.5 py-0.2 rounded-md">
                                  {tx.installment}
                                </span>
                              )}
                            </div>
                            {tx.needsReview && (
                              <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-0.5 mt-0.5">
                                <AlertTriangle className="w-3 h-3 text-amber-600 inline" /> Confirmar categoria
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Category Dropdown + Value */}
                        <div className="flex items-center gap-3 shrink-0">
                          <select
                            value={tx.groupId}
                            onChange={(e) => handleCategoryChange(tx.id, e.target.value)}
                            className={`text-xs font-semibold rounded-lg px-2 py-1 outline-none border cursor-pointer ${
                              tx.needsReview
                                ? "border-amber-400 bg-amber-50 text-amber-900 font-bold"
                                : "border-[#e4e0d7] bg-white text-[#123044]"
                            }`}
                          >
                            {CATEGORY_OPTIONS.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.label}
                              </option>
                            ))}
                          </select>

                          <div className="w-24 text-right font-extrabold text-[#123044] tabular-nums">
                            {formatBRL(tx.amount)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setTransactions([]);
                    setFile(null);
                    setPasteText("");
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-[#667085] hover:text-[#123044] flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Enviar outro arquivo
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl border border-[#e4e0d7] text-xs font-bold text-[#667085] hover:bg-slate-50 transition-colors"
                  >
                    Fechar sem salvar
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmApply}
                    className="px-6 py-2.5 rounded-xl bg-[#1f674f] hover:bg-[#19533f] text-white text-xs font-bold shadow-md flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Aplicar {formatBRL(totalSelectedAmount)} aos Gastos do Raio-X</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
