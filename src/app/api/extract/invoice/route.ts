import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as xlsx from "xlsx";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";

export const dynamic = "force-dynamic";

export interface ExtractedInvoiceTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  installment?: string | null;
  groupId: string; // habitacao, alimentacao, transportes, saude, educacao, comunicacao, despesas, artigos, dividas, outros
  groupLabel: string;
  subgroupId?: string;
  confidence: "high" | "medium" | "low";
  needsReview: boolean;
  selected: boolean;
}

export interface InvoiceExtractionResponse {
  success: boolean;
  cardIssuer?: string;
  statementPeriod?: string;
  invoiceTotal: number;
  transactions: ExtractedInvoiceTransaction[];
  summaryByCategory: Record<string, number>;
  needsReviewCount: number;
  error?: string;
}

// ─── DICIONÁRIO DE REGRAS HEURÍSTICAS BRASILEIRAS (ALTA VELOCIDADE & PRECISÃO) ────────
const BRAZILIAN_MERCHANT_RULES: Array<{
  pattern: RegExp;
  groupId: string;
  groupLabel: string;
  subgroupId?: string;
}> = [
  // ALIMENTAÇÃO - Supermercado
  { pattern: /(pao\s*de\s*acucar|carrefour|extra\s*(hiper|super)?|assai|atacadao|st\s*marche|mambo|zaffari|hortifruti|natural\s*da\s*terra|mercado|supermercado|muffato|guanabara|zona\s*sul|dia\s*brasil|sonda|supernosso|nagumo|savegnago)/i, groupId: "alimentacao", groupLabel: "Alimentação (Supermercado e Feira)", subgroupId: "supermercado" },
  
  // ALIMENTAÇÃO - Restaurantes & Delivery
  { pattern: /(ifood|rappi|uber\s*eats|mc\s*donald|burger\s*king|outback|starbucks|pizzaria|restaurante|rest\b|padaria|panificadora|cafeteria|cafe\b|churrascaria|sushi|coco\s*bambu|madero|fogo\s*de\s*chao|bacio\s*di\s*latte|habib|giraffas|subway|spoleto|domino|china\s*in\s*box|gelateria|sorvete|bar\b|lanchonete)/i, groupId: "alimentacao", groupLabel: "Alimentação (Restaurante e Delivery)", subgroupId: "restaurante" },

  // MORADIA & CONTAS
  { pattern: /(enel|cpfl|light|cemig|copel|sabesp|comgas|quinto\s*andar|quintoandar|loft|condominio|iptu|leroy\s*merlin|telhanorte|c&c|tok\s*&?\s*stok|camicado|zelo|etna|gas\s*natural)/i, groupId: "habitacao", groupLabel: "Moradia & Habitação", subgroupId: "energia" },

  // TRANSPORTES
  { pattern: /(uber\s*(trip|rides|\*|brasil)?|99\s*(app|pop|taxis|\*)?|posto\b|ipiranga|shell|petrobras|br\s*distribuidora|sem\s*parar|veloe|conectcar|zona\s*azul|estapar|localiza|movida|unidas|latam|gol\s*linhas|voegol|azul\s*linhas|voeazul|estacionamento|parking|auto\s*posto|combustivel)/i, groupId: "transportes", groupLabel: "Transportes (Combustível, App e Viagens)", subgroupId: "app" },

  // SAÚDE & FARMÁCIA
  { pattern: /(droga\s*raia|drogasil|pacheco|pague\s*menos|panvel|drogaria\s*sao\s*paulo|drogaria|farmacia|unimed|bradesco\s*saude|sulamerica|amil|notredame|hapvida|einstein|fleury|dasa|lavoisier|smart\s*fit|smartfit|bluefit|bio\s*ritmo|gympass|totalpass|laboratorio|clinica|odont|consulta)/i, groupId: "saude", groupLabel: "Saúde & Farmácia", subgroupId: "remedios" },

  // EDUCAÇÃO
  { pattern: /(colegio|escola|faculdade|universidade|fgv|puc|usp|insper|mackenzie|alura|udemy|coursera|curso|livraria|leitura|saraiva|cultura|estacio|anhembi|material\s*escolar)/i, groupId: "educacao", groupLabel: "Educação & Cursos", subgroupId: "cursos" },

  // COMUNICAÇÃO & STREAMING
  { pattern: /(netflix|spotify|amazon\s*prime|prime\s*video|disney|hbo|max\.com|globoplay|apple\.com|google\s*(play|storage|services)?|claro|vivo|tim\s*celular|oi\s*fibra|telecom|deezer|paramount|crunchyroll|youtube\s*premium)/i, groupId: "comunicacao", groupLabel: "Comunicação & Streaming", subgroupId: "streaming" },

  // ARTIGOS & VESTUÁRIO
  { pattern: /(zara|renner|riachuelo|c&a|shein|hering|centauro|nike|adidas|arezzo|schutz|track\s*&?\s*field|mercado\s*livre|mercadolivre|amazon\s*(br|brasil)?|shopee|magalu|magazine\s*luiza|casas\s*bahia|fast\s*shop|aliexpress)/i, groupId: "artigos", groupLabel: "Artigos do Lar & Vestuário", subgroupId: "roupas" },

  // ESTILO DE VIDA, LAZER & PETS
  { pattern: /(cinemark|cinepolis|uci\s*cinemas|ingresso\.com|sympla|eventim|petz|cobasi|pet\s*shop|veterinari|diarista|faxina|passeio|parque|teatro|show\b)/i, groupId: "despesas", groupLabel: "Estilo de Vida, Lazer & Pets", subgroupId: "lazer" }
];

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const isDev = process.env.NODE_ENV !== "production";
    const origin = req.headers.get("origin") || req.headers.get("referer") || "";
    const isLocal = origin.includes("localhost") || origin.includes("127.0.0.1");

    if (!session?.user?.id && !session?.user?.email && !isDev && !isLocal) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const contentType = req.headers.get("content-type") || "";
    let fileBuffer: Buffer | null = null;
    let fileName = "";
    let mimeType = "";
    let rawText = "";
    let clientExtractedText = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const text = formData.get("text") as string | null;
      const extractedText = formData.get("extractedText") as string | null;

      if (file) {
        fileName = file.name;
        mimeType = file.type;
        const arrayBuffer = await file.arrayBuffer();
        fileBuffer = Buffer.from(arrayBuffer);
      }
      if (text) rawText = text;
      if (extractedText) clientExtractedText = extractedText;
    } else if (contentType.includes("application/json")) {
      const body = await req.json();
      rawText = body.text || "";
      clientExtractedText = body.extractedText || "";
      fileName = body.fileName || "";
    }

    if (!fileBuffer && !rawText.trim() && !clientExtractedText.trim()) {
      return NextResponse.json(
        { error: "Nenhum arquivo ou extrato enviado para leitura." },
        { status: 400 }
      );
    }

    const lowerName = fileName.toLowerCase();
    const isSpreadsheet =
      lowerName.endsWith(".xlsx") ||
      lowerName.endsWith(".xls") ||
      lowerName.endsWith(".csv") ||
      mimeType.includes("spreadsheetml") ||
      mimeType.includes("excel") ||
      mimeType.includes("csv");

    // ─── 1. TENTA EXTRAÇÃO DETERMINÍSTICA DIRETA DE PLANILHAS CSV / XLSX ───────────
    if (fileBuffer && isSpreadsheet) {
      try {
        const workbook = xlsx.read(fileBuffer, { type: "buffer" });
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];
        const rawRows: any[][] = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: "" });

        const directTx = parseSpreadsheetTransactions(rawRows);
        if (directTx.length > 0) {
          const categorized = directTx.map(classifyTransaction);
          return respondWithTransactions(categorized, "Planilha Importada");
        }
      } catch (sheetErr) {
        console.warn("Tentativa de leitura determinística de planilha falhou, acionando IA:", sheetErr);
      }
    }

    // ─── 2. EXTRAÇÃO VIA IA GENERATIVA (GEMINI 2.5 / 3.7 MULTIMODAL) ───────────────
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback sem IA: tenta ler texto direto via regex
      const textToParse = clientExtractedText || rawText;
      if (textToParse.trim()) {
        const rawMatches = parseTextTransactions(textToParse);
        if (rawMatches.length > 0) {
          const categorized = rawMatches.map(classifyTransaction);
          return respondWithTransactions(categorized, "Extrato Lido por Regras Locais");
        }
      }

      return NextResponse.json(
        { error: "Chave de IA (GEMINI_API_KEY) não configurada e não foi possível ler em modo offline.", code: "NO_API_KEY" },
        { status: 503 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const candidateModels = ["gemini-2.5-flash", "gemini-3.7-flash", "gemini-3.6-flash", "gemini-flash-latest"];

    const invoiceSystemPrompt = `Você é o assistente sênior especialista em inteligência de finanças pessoais da ARVO.
Sua missão é extrair rigorosamente todas as despesas e compras de uma FATURA DE CARTÃO DE CRÉDITO ou EXTRATO BANCÁRIO (PDF, imagem, texto ou planilha).

ESTRUTURA DE GRUPOS DISPONÍVEIS NA ARVO (utilize rigorosamente um destes groupId):
- "habitacao": Moradia, condomínio, luz, gás, água, IPTU, reformas.
- "alimentacao": Supermercados, feiras, açougues, padarias, restaurantes, bares, lanchonetes, iFood, delivery.
- "transportes": Postos de combustível, Uber, 99, táxi, estacionamento, pedágio, passagens aéreas, IPVA, seguro auto.
- "saude": Farmácias, drogarias, hospitais, laboratórios, consultas, dentista, academias, planos de saúde.
- "educacao": Escolas, faculdades, cursos, livros, idiomas, material didático.
- "comunicacao": Internet, celular, telefonia, Netflix, Spotify, assinaturas de streaming.
- "despesas": Lazer, cinema, viagens, hotéis, diaristas, pet shop, presentes, clubes.
- "artigos": Roupas, sapatos, lojas de departamento, eletrônicos, móveis, compras no Mercado Livre/Amazon.
- "dividas": Juros de rotativo, parcelamento de fatura, IOF, anuidade de cartão, encargos financeiros.
- "outros": Transações não identificáveis ou ambíguas que exigem revisão do usuário.

REGRAS DE EXTRAÇÃO:
1. IGNORE pagamentos de fatura anterior (ex: "PAGAMENTO RECEBIDO", "PGTO DEBITO", "PAGAMENTO EM 15/01") e estornos/créditos negativos a menos que seja cancelamento.
2. Extraia cada transação individual com:
   - "date": string (ex: "14/02" ou "14/02/2026")
   - "description": nome do estabelecimento comercial limpo e legível
   - "amount": valor numérico positivo em Reais (Float ex: 45.90)
   - "installment": string da parcela se houver (ex: "01/03", "02/10") ou null
   - "groupId": um dos 10 grupos acima
   - "confidence": "high" (certeza absoluta), "medium" ou "low" (dúvida)
3. Retorne EXCLUSIVAMENTE um objeto JSON válido, sem texto ou markdown envolvente, no formato:
{
  "cardIssuer": "Nubank / Itaú / XP / etc",
  "statementPeriod": "Fevereiro / 2026",
  "invoiceTotal": 3450.60,
  "transactions": [
    {
      "id": "tx-1",
      "date": "10/02",
      "description": "iFood *Restaurante",
      "amount": 84.50,
      "installment": null,
      "groupId": "alimentacao",
      "confidence": "high"
    }
  ]
}`;

    const contentsParts: any[] = [{ text: invoiceSystemPrompt }];

    if (clientExtractedText.trim()) {
      contentsParts.push({
        text: `--- TEXTO DIGITAL EXTRAÍDO DA FATURA ---\n${clientExtractedText}\n----------------------------------------`
      });
    }

    if (rawText.trim() && rawText !== clientExtractedText) {
      contentsParts.push({
        text: `--- TEXTO INFORMADO PELO USUÁRIO ---\n${rawText}\n------------------------------------`
      });
    }

    if (fileBuffer) {
      let finalMime = mimeType;
      if (!finalMime || finalMime === "application/octet-stream") {
        if (lowerName.endsWith(".pdf")) finalMime = "application/pdf";
        else if (lowerName.endsWith(".png")) finalMime = "image/png";
        else if (lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")) finalMime = "image/jpeg";
        else if (lowerName.endsWith(".webp")) finalMime = "image/webp";
        else finalMime = "application/pdf";
      }

      contentsParts.push({
        inlineData: {
          data: fileBuffer.toString("base64"),
          mimeType: finalMime
        }
      });
    }

    // Tenta chamada nos modelos disponíveis com fallback
    let rawJsonResponse = "";
    let lastError = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: 0.1,
            responseMimeType: "application/json"
          }
        });

        const result = await model.generateContent(contentsParts);
        const text = result.response.text();
        if (text && text.trim()) {
          rawJsonResponse = text.trim();
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Tentativa com ${modelName} falhou, tentando próximo modelo:`, err?.message || err);
      }
    }

    if (!rawJsonResponse) {
      // Se a IA falhou, tenta parser local por regex
      const textToParse = clientExtractedText || rawText;
      if (textToParse.trim()) {
        const rawMatches = parseTextTransactions(textToParse);
        if (rawMatches.length > 0) {
          const categorized = rawMatches.map(classifyTransaction);
          return respondWithTransactions(categorized, "Extrato Lido por Regras Locais");
        }
      }

      throw lastError || new Error("Falha ao comunicar com os modelos de IA da Google.");
    }

    // Limpa delimitadores de markdown se existirem
    const cleanedJson = rawJsonResponse.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
    const parsed = JSON.parse(cleanedJson);

    if (!parsed || !Array.isArray(parsed.transactions)) {
      throw new Error("Formato de resposta inválido da IA.");
    }

    const transactions: ExtractedInvoiceTransaction[] = parsed.transactions.map((tx: any, idx: number) => {
      // Valida ou aprimora a categorização com as regras locais
      const localRule = findLocalRule(tx.description || "");
      const finalGroupId = localRule ? localRule.groupId : (tx.groupId || "outros");
      const groupLabel = getGroupLabel(finalGroupId);
      const isHighConf = localRule ? true : tx.confidence === "high";

      return {
        id: tx.id || `tx-${Date.now()}-${idx}`,
        date: tx.date || "",
        description: (tx.description || "Compra").trim(),
        amount: Math.abs(Number(tx.amount) || 0),
        installment: tx.installment || null,
        groupId: finalGroupId,
        groupLabel,
        subgroupId: localRule?.subgroupId,
        confidence: isHighConf ? "high" : (tx.confidence || "medium"),
        needsReview: !isHighConf || finalGroupId === "outros",
        selected: true
      };
    });

    return respondWithTransactions(transactions, parsed.cardIssuer, parsed.statementPeriod, parsed.invoiceTotal);

  } catch (error: any) {
    console.error("Erro na extração da fatura de cartão:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Não foi possível extrair os dados da fatura. Tente enviar uma foto ou planilha.",
        transactions: [],
        summaryByCategory: {},
        needsReviewCount: 0
      },
      { status: 500 }
    );
  }
}

// ─── AUXILIARES DE PARSING DETERMINÍSTICO E HEURÍSTICAS ────────────────────────
function findLocalRule(desc: string) {
  const clean = desc.toLowerCase();
  for (const rule of BRAZILIAN_MERCHANT_RULES) {
    if (rule.pattern.test(clean)) {
      return rule;
    }
  }
  return null;
}

function classifyTransaction(tx: { id: string; date: string; description: string; amount: number; installment?: string | null }): ExtractedInvoiceTransaction {
  const rule = findLocalRule(tx.description);
  const groupId = rule ? rule.groupId : "outros";
  const groupLabel = rule ? rule.groupLabel : "Outros / Revisão Necessária";

  return {
    id: tx.id,
    date: tx.date,
    description: tx.description,
    amount: tx.amount,
    installment: tx.installment || null,
    groupId,
    groupLabel,
    subgroupId: rule?.subgroupId,
    confidence: rule ? "high" : "low",
    needsReview: !rule || groupId === "outros",
    selected: true
  };
}

function getGroupLabel(groupId: string): string {
  const labels: Record<string, string> = {
    habitacao: "Moradia & Habitação",
    alimentacao: "Alimentação (Mercado e Delivery)",
    transportes: "Transportes & Combustível",
    saude: "Saúde & Farmácia",
    educacao: "Educação & Cursos",
    comunicacao: "Comunicação & Streaming",
    despesas: "Estilo de Vida & Lazer",
    artigos: "Artigos do Lar & Vestuário",
    dividas: "Compromissos & Dívidas",
    outros: "Outros / Revisão Necessária"
  };
  return labels[groupId] || "Outros / Revisão Necessária";
}

function parseSpreadsheetTransactions(rows: any[][]): Array<{ id: string; date: string; description: string; amount: number; installment?: string | null }> {
  const results: Array<{ id: string; date: string; description: string; amount: number; installment?: string | null }> = [];
  if (!rows || rows.length < 2) return results;

  let dateCol = -1;
  let descCol = -1;
  let valCol = -1;

  // Procura cabeçalho
  for (let r = 0; r < Math.min(rows.length, 10); r++) {
    const row = rows[r];
    for (let c = 0; c < row.length; c++) {
      const cell = String(row[c] || "").toLowerCase().trim();
      if (dateCol === -1 && (cell.includes("data") || cell === "dt" || cell === "date")) dateCol = c;
      if (descCol === -1 && (cell.includes("descri") || cell.includes("lançamento") || cell.includes("estabelecimento") || cell.includes("histórico") || cell === "title")) descCol = c;
      if (valCol === -1 && (cell.includes("valor") || cell.includes("quantia") || cell.includes("total") || cell === "amount")) valCol = c;
    }
    if (dateCol !== -1 && descCol !== -1 && valCol !== -1) break;
  }

  // Fallback se não achou cabeçalho clássico: tenta por padrão de conteúdo
  if (dateCol === -1 || descCol === -1 || valCol === -1) {
    dateCol = 0;
    descCol = 1;
    valCol = 2;
  }

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (!row || row.length <= Math.max(dateCol, descCol, valCol)) continue;

    const rawDate = String(row[dateCol] || "").trim();
    const rawDesc = String(row[descCol] || "").trim();
    const rawVal = row[valCol];

    if (!rawDesc || rawDesc.toLowerCase().includes("pagamento") || rawDesc.toLowerCase().includes("saldo")) continue;

    let numVal = 0;
    if (typeof rawVal === "number") {
      numVal = Math.abs(rawVal);
    } else if (typeof rawVal === "string") {
      const cleanVal = rawVal.replace(/[^\d,-.]/g, "").replace(".", "").replace(",", ".");
      numVal = Math.abs(parseFloat(cleanVal) || 0);
    }

    if (numVal > 0) {
      const instMatch = rawDesc.match(/(\d{1,2}\s*\/\s*\d{1,2})/);
      results.push({
        id: `row-${r}`,
        date: rawDate,
        description: rawDesc,
        amount: numVal,
        installment: instMatch ? instMatch[1].replace(/\s+/g, "") : null
      });
    }
  }

  return results;
}

function parseTextTransactions(text: string): Array<{ id: string; date: string; description: string; amount: number; installment?: string | null }> {
  const results: Array<{ id: string; date: string; description: string; amount: number; installment?: string | null }> = [];
  const lines = text.split(/\r?\n/);

  const linePattern = /(\d{1,2}\/\d{1,2}(?:\/\d{2,4})?)\s+([A-Za-z0-9\s*.\-_/&]+?)\s+(?:R\$\s*)?([\d.,]+)$/i;

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    const match = trimmed.match(linePattern);
    if (match) {
      const date = match[1];
      const desc = match[2].trim();
      const valStr = match[3].replace(".", "").replace(",", ".");
      const val = parseFloat(valStr);

      if (val > 0 && !desc.toLowerCase().includes("pagamento de fatura")) {
        const instMatch = desc.match(/(\d{1,2}\s*\/\s*\d{1,2})/);
        results.push({
          id: `line-${idx}`,
          date,
          description: desc,
          amount: val,
          installment: instMatch ? instMatch[1].replace(/\s+/g, "") : null
        });
      }
    }
  });

  return results;
}

function respondWithTransactions(
  transactions: ExtractedInvoiceTransaction[],
  cardIssuer: string = "Cartão de Crédito",
  statementPeriod?: string,
  totalOverride?: number
) {
  const summaryByCategory: Record<string, number> = {};
  let total = 0;
  let needsReviewCount = 0;

  transactions.forEach((tx) => {
    if (tx.selected) {
      total += tx.amount;
      summaryByCategory[tx.groupId] = (summaryByCategory[tx.groupId] || 0) + tx.amount;
    }
    if (tx.needsReview) {
      needsReviewCount++;
    }
  });

  return NextResponse.json({
    success: true,
    cardIssuer,
    statementPeriod: statementPeriod || "Período Apurado",
    invoiceTotal: totalOverride && totalOverride > 0 ? totalOverride : Math.round(total * 100) / 100,
    transactions,
    summaryByCategory,
    needsReviewCount
  });
}
