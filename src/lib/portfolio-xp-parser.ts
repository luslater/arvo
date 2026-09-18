import * as xlsx from "xlsx";

export interface XpExtractedAsset {
  name: string;
  value: number | null;
  weight: number;
  category?: string;
  yield?: number;
  annualReturn?: number;
  indexador?: string;
  taxa?: string;
}

export interface XpPortfolioResult {
  isXp: boolean;
  portfolioName: string;
  totalValue: number;
  saldoDisponivel?: number;
  assets: XpExtractedAsset[];
}

export function parseFlexNumber(raw: unknown): number | null {
  if (typeof raw === "number" && isFinite(raw)) return raw > 0 ? Math.round(raw * 100) / 100 : null;
  if (typeof raw === "string") {
    let clean = raw.replace(/R\$/gi, "").trim();
    if (!clean) return null;
    if (clean.includes(".") && clean.includes(",")) {
      if (clean.lastIndexOf(",") > clean.lastIndexOf(".")) {
        clean = clean.replace(/\./g, "").replace(",", ".");
      } else {
        clean = clean.replace(/,/g, "");
      }
    } else if (clean.includes(",")) {
      clean = clean.replace(/\./g, "").replace(",", ".");
    } else if (clean.includes(".")) {
      const parts = clean.split(".");
      if (parts.length > 2) {
        clean = parts.join("");
      } else if (parts.length === 2 && parts[1].length === 3) {
        clean = parts[0] + parts[1];
      }
    }
    const num = parseFloat(clean.replace(/[^\d.]/g, ""));
    return isFinite(num) && num > 0 ? Math.round(num * 100) / 100 : null;
  }
  return null;
}

export function parseFlexPct(raw: unknown): number {
  if (typeof raw === "number") return raw <= 1 ? Math.round(raw * 10000) / 100 : Math.round(raw * 100) / 100;
  if (typeof raw === "string") {
    const num = parseFloat(raw.replace("%", "").replace(/\./g, "").replace(",", ".").trim());
    return isFinite(num) ? Math.round(num * 100) / 100 : 0;
  }
  return 0;
}

export function parseXpRows(rows: unknown[][]): XpPortfolioResult | null {
  if (!rows || rows.length < 5) return null;

  let isXp = false;
  let clientName = "";
  let totalInvested = 0;
  let saldoDisponivel = 0;
  let dataStartIdx = 0;

  for (let i = 0; i < Math.min(12, rows.length); i++) {
    const r = rows[i] || [];
    const lineStr = r.map(c => String(c || "")).join(" ").toLowerCase();
    if (
      lineStr.includes("este é o seu patrimônio") ||
      lineStr.includes("este e o seu patrimonio") ||
      lineStr.includes("total investido") ||
      lineStr.includes("código do assessor") ||
      lineStr.includes("codigo do assessor") ||
      lineStr.includes("xp investimentos")
    ) {
      isXp = true;
      dataStartIdx = i + 2;
      const nameMatch = String(r[0] || "").match(/^([^,]+),\s*este\s*é\s*o\s*seu/i);
      if (nameMatch) clientName = nameMatch[1].trim();

      const nextRow = rows[i + 1] || [];
      r.forEach((col, cIdx) => {
        const header = String(col || "").toLowerCase();
        if (header.includes("total investido")) {
          totalInvested = parseFlexNumber(nextRow[cIdx]) || 0;
        }
        if (header.includes("saldo disponível") || header.includes("saldo disponivel")) {
          saldoDisponivel = parseFlexNumber(nextRow[cIdx]) || 0;
        }
      });
    }
  }

  if (!isXp) return null;

  const assets: XpExtractedAsset[] = [];
  const KNOWN_SECTIONS = [
    "coe",
    "fundos de investimentos",
    "fundos",
    "ações",
    "acoes",
    "renda fixa",
    "previdência",
    "previdencia",
    "renda variável",
    "renda variavel",
    "tesouro direto",
    "bdr",
    "fiis"
  ];
  const EXCLUDE_SECTIONS = [
    "dividendos, proventos e outras distribuições",
    "dividendos, proventos e outras distribuicoes",
    "dividendos",
    "proventos",
    "custódia remunerada",
    "custodia remunerada",
    "garantias",
    "saldo em conta"
  ];

  let currentSection = "";
  let subSection = "";
  let inExcludedSection = false;
  let headerColMap: {
    produto?: number;
    saldo?: number;
    alocacao?: number;
    rentabilidade?: number;
    vencimento?: number;
  } | null = null;

  for (let i = dataStartIdx; i < rows.length; i++) {
    const r = rows[i] || [];
    if (!r || !r.length) continue;
    const firstCell = String(r[0] || "").trim();
    const firstCellLower = firstCell.toLowerCase();

    // Quando chega na seção de proventos/dividendos futuros ou custódia remunerada, encerra a custódia
    if (EXCLUDE_SECTIONS.some(sec => firstCellLower.includes(sec))) {
      inExcludedSection = true;
      break;
    }

    if (inExcludedSection) continue;

    const matchedKnown = KNOWN_SECTIONS.find(sec => firstCellLower === sec || (firstCellLower.startsWith(sec) && !firstCellLower.includes("|")));
    if (matchedKnown) {
      currentSection = matchedKnown;
      headerColMap = null;
      continue;
    }

    // Identifica cabeçalho de classe/subclasse ex: "51,4% | Pós-Fixado", "10,3% | Renda Variável Global", "4,4% | Inflação"
    if (firstCell.includes("|")) {
      subSection = firstCell;
      const hasHeaderKeywords = r.some(c => {
        const s = String(c || "").toLowerCase();
        return s === "saldo" || s.includes("saldo a mercado") || s.includes("% alocação") || s.includes("% alocacao") || s.includes("saldo líquido") || s.includes("saldo liquido");
      });
      if (hasHeaderKeywords) {
        headerColMap = {};
        r.forEach((c, idx) => {
          const s = String(c || "").toLowerCase().trim();
          if (s === "saldo" || s === "saldo a mercado" || s === "saldo bruto") headerColMap!.saldo = idx;
          if (s === "% alocação" || s === "% alocacao" || s === "% da carteira") headerColMap!.alocacao = idx;
          if (s === "rentabilidade" || s === "rentabilidade a mercado") headerColMap!.rentabilidade = idx;
          if (s === "vencimento" || s === "data vencimento") headerColMap!.vencimento = idx;
        });
        continue;
      }
    }

    // Identifica linha de cabeçalho tabular tradicional
    const rowHasHeaderWords = r.filter(c => {
      const s = String(c || "").toLowerCase().trim();
      return (
        s === "saldo" ||
        s === "saldo líquido" ||
        s === "saldo liquido" ||
        s === "saldo bruto" ||
        s === "saldo a mercado" ||
        s === "% alocação" ||
        s === "% alocacao" ||
        s === "produto" ||
        s === "rentabilidade"
      );
    }).length >= 2;

    if (rowHasHeaderWords) {
      headerColMap = {};
      r.forEach((c, idx) => {
        const s = String(c || "").toLowerCase().trim();
        if (s === "produto" || s === "ativo") headerColMap!.produto = idx;
        if (s === "saldo" || s === "saldo a mercado" || s === "saldo bruto") headerColMap!.saldo = idx;
        if (s === "% alocação" || s === "% alocacao" || s === "% da carteira") headerColMap!.alocacao = idx;
        if (s === "rentabilidade" || s === "rentabilidade a mercado") headerColMap!.rentabilidade = idx;
        if (s === "vencimento" || s === "data vencimento") headerColMap!.vencimento = idx;
      });
      continue;
    }

    // Pula linhas de totalizador ou disclaimers
    if (
      !firstCell ||
      firstCell === "Total" ||
      firstCell === "Subtotal" ||
      firstCellLower.includes("patrimônio") ||
      firstCellLower.includes("patrimonio") ||
      firstCellLower.includes("saldo disponível") ||
      firstCellLower.includes("saldo disponivel") ||
      firstCellLower.startsWith("r$")
    ) {
      continue;
    }

    const name = firstCell;
    let val: number | null = null;
    let weight = 0;
    let rentabilidade = "";

    if (headerColMap && headerColMap.saldo !== undefined && r[headerColMap.saldo] !== undefined) {
      val = parseFlexNumber(r[headerColMap.saldo]);
      if (headerColMap.alocacao !== undefined) weight = parseFlexPct(r[headerColMap.alocacao]);
      if (headerColMap.rentabilidade !== undefined) rentabilidade = String(r[headerColMap.rentabilidade] || "");
    } else {
      for (let c = 1; c < r.length; c++) {
        const cell = r[c];
        const parsed = parseFlexNumber(cell);
        if (parsed !== null && val === null) {
          val = parsed;
        }
        if (typeof cell === "string" && cell.includes("%") && weight === 0) {
          weight = parseFlexPct(cell);
        }
      }
    }

    if (val && val > 0 && name.length >= 2) {
      let category = "Renda Fixa";
      let indexador = "Pós-fixado (CDI)";
      let taxa = "";
      let annualReturn = 13.9;
      let y = 1.09;

      const subLower = subSection.toLowerCase();
      const nameLower = name.toLowerCase();

      if (
        currentSection === "ações" ||
        currentSection === "acoes" ||
        subLower.includes("ações") ||
        subLower.includes("acoes") ||
        subLower.includes("renda variável brasil") ||
        subLower.includes("renda variavel brasil")
      ) {
        category = "Ações / Renda Variável";
        indexador = "Ações";
        taxa = "Ibovespa";
        annualReturn = 15.0;
        y = 1.17;
      } else if (currentSection === "coe" || subLower.includes("global") || nameLower.includes("bolsa americana")) {
        category = "COE / Internacional";
        indexador = "Multimercado / Global";
        taxa = rentabilidade || "Retorno Otimizado";
        annualReturn = 14.0;
        y = 1.10;
      } else if (
        subLower.includes("multimercados") ||
        subLower.includes("multimercado") ||
        nameLower.includes("fim") ||
        nameLower.includes("multimercado")
      ) {
        category = "Fundos Multimercado";
        indexador = "Multimercado";
        taxa = "CDI+";
        annualReturn = 14.2;
        y = 1.11;
      } else if (
        subLower.includes("inflação") ||
        subLower.includes("inflacao") ||
        nameLower.includes("ipca") ||
        nameLower.includes("ipc-a") ||
        rentabilidade.toUpperCase().includes("IPC-A") ||
        rentabilidade.toUpperCase().includes("IPCA")
      ) {
        category = "Renda Fixa Inflação";
        indexador = "IPCA+";
        taxa = rentabilidade || "IPCA + 8,40%";
        annualReturn = 13.2;
        y = 1.04;
      } else if (subLower.includes("pós-fixado") || subLower.includes("pos-fixado") || nameLower.includes("di") || nameLower.includes("firf")) {
        category = "Fundos / Renda Fixa";
        indexador = "Pós-fixado (CDI)";
        taxa = "100% do CDI";
        annualReturn = 13.9;
        y = 1.09;
      }

      assets.push({
        name,
        value: val,
        weight,
        category,
        indexador,
        taxa,
        annualReturn,
        yield: y
      });
    }
  }

  if (assets.length === 0) return null;

  const sumValues = assets.reduce((s, a) => s + (a.value || 0), 0);
  if (sumValues > 0) {
    assets.forEach(a => {
      a.weight = Math.round(((a.value || 0) / sumValues) * 1000) / 10;
    });
  }

  return {
    isXp: true,
    portfolioName: clientName ? `Carteira XP - ${clientName}` : "Carteira XP Investimentos",
    totalValue: totalInvested || sumValues,
    saldoDisponivel,
    assets
  };
}

export function parseXpWorkbook(workbook: xlsx.WorkBook): XpPortfolioResult | null {
  if (!workbook || !workbook.SheetNames || !workbook.SheetNames.length) return null;
  const sheetNames = workbook.SheetNames;
  let targetSheet = null;

  for (const name of sheetNames) {
    const lower = name.toLowerCase();
    if (lower.includes("carteira") || lower.includes("posição") || lower.includes("posicao") || sheetNames.length === 1) {
      targetSheet = workbook.Sheets[name];
      break;
    }
  }
  if (!targetSheet) targetSheet = workbook.Sheets[sheetNames[0]];

  const rows = xlsx.utils.sheet_to_json<unknown[]>(targetSheet, { header: 1 });
  return parseXpRows(rows);
}
