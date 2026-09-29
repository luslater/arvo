import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as xlsx from "xlsx";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

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
  // MORADIA & HABITAÇÃO
  { pattern: /(enel|cpfl|light|cemig|copel|sabesp|sanepar|corsan|celesc|equatorial|comgas|quinto\s*andar|quintoandar|loft|condominio|iptu|aluguel|imobiliaria|gas\s*natural|ultragaz|liquigas|nacional\s*gas)/i, groupId: "habitacao", groupLabel: "Moradia & Habitação", subgroupId: "energia" },

  // ALIMENTAÇÃO - Supermercados & Feiras
  { pattern: /(pao\s*de\s*acucar|carrefour|extra\s*(hiper|super)?|assai|atacadao|st\s*marche|mambo|zaffari|hortifruti|natural\s*da\s*terra|supermercado|mercado|mercadinho|muffato|guanabara|zona\s*sul|dia\s*brasil|sonda|supernosso|nagumo|savegnago|koch|fort\s*atacadista|angeloni|bistek|giassi|giga|spani|shibata|barbosa|sacolao|acougue|peixaria|emporio|mercearia)/i, groupId: "alimentacao", groupLabel: "Alimentação (Supermercado e Feira)", subgroupId: "supermercado" },

  // ALIMENTAÇÃO - Restaurantes, Bares, Delivery & Cafeterias
  { pattern: /(ifood|rappi|uber\s*eats|mc\s*donald|burger\s*king|outback|starbucks|pizzaria|restaurante|rest\b|padaria|panificadora|cafeteria|cafe\b|churrascaria|sushi|coco\s*bambu|madero|fogo\s*de\s*chao|bacio\s*di\s*latte|habib|giraffas|subway|spoleto|domino|china\s*in\s*box|gelateria|sorvete|bar\b|lanchonete|bistro|choperia|cervejaria|doceria|confeitaria|burger|boteco|adega|gastronomia)/i, groupId: "alimentacao", groupLabel: "Alimentação (Restaurante e Delivery)", subgroupId: "restaurante" },

  // TRANSPORTES & COMBUSTÍVEL
  { pattern: /(uber\s*(trip|rides|\*|brasil)?|99\s*(app|pop|taxis|\*)?|cabify|posto\b|ipiranga|shell|petrobras|br\s*distribuidora|ale\b|auto\s*posto|combustivel|abastece|sem\s*parar|veloe|conectcar|taggy|pedagio|autopista|estacionamento|estapar|indigo|parking|garagem|zona\s*azul|localiza|movida|unidas|latam|gol\s*linhas|voegol|azul\s*linhas|voeazul|passagem\s*aerea|aeroporto)/i, groupId: "transportes", groupLabel: "Transportes (Combustível, App e Viagens)", subgroupId: "app" },

  // SAÚDE, FARMÁCIA & BEM-ESTAR
  { pattern: /(droga\s*raia|drogasil|pacheco|pague\s*menos|panvel|drogaria|farmacia|venancio|catarinense|preco\s*popular|nissei|unimed|bradesco\s*saude|sulamerica|amil|notredame|hapvida|omint|care\s*plus|porto\s*saude|einstein|sirio|fleury|dasa|lavoisier|delboni|hermes\s*pardini|laboratorio|clinica|hospital|pronto\s*socorro|odont|dentista|oftalmo|psicolog|fisioterapia|smart\s*fit|smartfit|bluefit|bio\s*ritmo|gympass|wellhub|totalpass|bodytech|academia|pilates|crossfit)/i, groupId: "saude", groupLabel: "Saúde & Farmácia", subgroupId: "remedios" },

  // EDUCAÇÃO, CURSOS & INFOPRODUTOS
  { pattern: /(htm\*|hotmart|eduzz|kiwify|monetizze|braip|ticto|colegio|escola|faculdade|universidade|fgv|puc|usp|insper|mackenzie|alura|udemy|coursera|descomplica|rocketseat|ebac|conquer|curso|livraria|leitura|saraiva|cultura|estacio|anhembi|material\s*escolar|papelaria|duolingo|cambly|italki|cultura\s*inglesa|wizard|cna|ccaa)/i, groupId: "educacao", groupLabel: "Educação & Cursos", subgroupId: "cursos" },

  // COMUNICAÇÃO, STREAMING & SERVIÇOS DIGITAIS
  { pattern: /(netflix|spotify|amazon\s*prime|prime\s*video|disney|hbo|max\.com|globoplay|apple(\.com|\s*services)?|google\s*(play|storage|services|one)?|claro|vivo|tim\s*(celular)?|oi\s*fibra|telecom|deezer|paramount|crunchyroll|youtube|chatgpt|openai|anthropic|claude|microsoft|msft|github|adobe|canva|notion|figma|aws|dropbox|icloud)/i, groupId: "comunicacao", groupLabel: "Comunicação & Streaming", subgroupId: "streaming" },

  // ESTILO DE VIDA, LAZER, VIAGENS, HOTÉIS & PETS
  { pattern: /(airbnb|booking|hoteis\.com|hotel|pousada|resort|decolar|123milhas|cvc|maxmilhas|tripadvisor|trivago|expedia|ibis|accor|cinemark|cinepolis|uci\s*cinemas|ingresso\.com|sympla|eventim|ticket360|blueticket|teatro|show\b|parque|petz|cobasi|pet\s*shop|veterinari|vet\b|diarista|faxina|passeio|clube|barbearia|salao\s*de\s*beleza|spa\b|massagem)/i, groupId: "despesas", groupLabel: "Estilo de Vida, Lazer & Pets", subgroupId: "lazer" },

  // ARTIGOS DO LAR, UTILIDADES, DECORAÇÃO, VESTUÁRIO & E-COMMERCE
  { pattern: /(milium|casa\s*midi|casa\s*e\s*video|leroy\s*merlin|telhanorte|c&c|cassol|balaroti|tumelero|tok\s*&?\s*stok|camicado|zelo|etna|lojas\s*cem|ortobom|mobly|westwing|spicy|tramontina|doural|ferragem|tintas|utilidades|decor|multicoisas|kalunga|zara|renner|lojas\s*renner|riachuelo|c&a|shein|hering|centauro|nike|adidas|arezzo|schutz|anacapri|track\s*&?\s*field|decathlon|dafiti|netshoes|zattini|vivara|pandora|havaianas|farm\b|reserva|insider|osklen|mercado\s*livre|mercadolivre|amazon(\s*br|\s*brasil)?|shopee|magalu|magazine\s*luiza|casas\s*bahia|ponto\s*frio|fast\s*shop|lojas\s*americanas|americanas|submarino|kabum|pichau|terabyte|aliexpress|mp\*|mercpago|mercado\s*pago|pagseguro)/i, groupId: "artigos", groupLabel: "Artigos do Lar & Vestuário", subgroupId: "roupas" },

  // COMPROMISSOS & DÍVIDAS
  { pattern: /(iof\b|juros|encargos|anuidade|tarifa\s*cartao|multa\s*contratual|parcelamento\s*fatura|rotativo)/i, groupId: "dividas", groupLabel: "Compromissos & Dívidas", subgroupId: "dividas" }
];

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id && !session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const clientIp = getClientIp(req);
    const identifier = session?.user?.id || session?.user?.email || clientIp;
    const rl = rateLimit("ai:extract-invoice", identifier, 15, 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Muitas requisições de extração de fatura. Aguarde um minuto e tente novamente." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
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

    const apiKey = process.env.GEMINI_API_KEY;
    const lowerName = fileName.toLowerCase();
    const isSpreadsheet =
      lowerName.endsWith(".xlsx") ||
      lowerName.endsWith(".xls") ||
      lowerName.endsWith(".csv") ||
      mimeType.includes("spreadsheetml") ||
      mimeType.includes("excel") ||
      mimeType.includes("csv");

    // ─── 1. EXTRAÇÃO DETERMINÍSTICA DIRETA DE PLANILHAS CSV / XLSX ───────────
    if (fileBuffer && isSpreadsheet) {
      try {
        const workbook = xlsx.read(fileBuffer, { type: "buffer" });
        let targetSheet: xlsx.WorkSheet | null = null;

        // Procura a primeira aba com dados reais
        for (const sheetName of workbook.SheetNames) {
          const s = workbook.Sheets[sheetName];
          const testRows = xlsx.utils.sheet_to_json(s, { header: 1, defval: "" });
          if (testRows && testRows.length > 1) {
            targetSheet = s;
            break;
          }
        }
        if (!targetSheet) {
          targetSheet = workbook.Sheets[workbook.SheetNames[0]];
        }

        const rawRows: any[][] = xlsx.utils.sheet_to_json(targetSheet, { header: 1, defval: "" });
        const directTx = parseSpreadsheetTransactions(rawRows);

        if (directTx.length > 0) {
          // 1. Classificação inicial rápida por regras locais
          let categorized = directTx.map(classifyTransaction);

          // 2. Se houver compras não identificadas e temos a chave do Gemini, enriquece com IA
          const unclassified = categorized.filter((t) => t.needsReview || t.groupId === "outros");
          if (unclassified.length > 0 && apiKey) {
            try {
              categorized = await enhanceCategorizationWithAI(categorized, apiKey);
            } catch (aiErr) {
              console.warn("Classificação via IA falhou, mantendo categorização heurística:", aiErr);
            }
          }

          // Identifica emissor provável a partir do nome do arquivo
          let inferredIssuer = "Cartão de Crédito";
          if (lowerName.includes("nubank") || lowerName.includes("nu_")) inferredIssuer = "Nubank";
          else if (lowerName.includes("itau")) inferredIssuer = "Itaú";
          else if (lowerName.includes("xp")) inferredIssuer = "XP Investimentos";
          else if (lowerName.includes("c6")) inferredIssuer = "C6 Bank";
          else if (lowerName.includes("btg")) inferredIssuer = "BTG Pactual";
          else if (lowerName.includes("inter")) inferredIssuer = "Banco Inter";
          else if (lowerName.includes("bradesco")) inferredIssuer = "Bradesco";
          else if (lowerName.includes("santander")) inferredIssuer = "Santander";

          return respondWithTransactions(categorized, inferredIssuer, "Extrato Importado");
        }
      } catch (sheetErr) {
        console.warn("Tentativa de leitura determinística de planilha falhou, acionando IA multimodal:", sheetErr);
      }
    }

    // ─── 2. EXTRAÇÃO VIA IA GENERATIVA (GEMINI 2.5 / 3.7 MULTIMODAL) ───────────────
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
        date: formatExcelDate(tx.date) || tx.date || "",
        description: (tx.description || "Compra").trim(),
        amount: Math.abs(Number(tx.amount) || 0),
        installment: tx.installment || null,
        groupId: finalGroupId,
        groupLabel,
        subgroupId: localRule?.subgroupId,
        confidence: isHighConf ? "high" : (tx.confidence || "medium"),
        needsReview: finalGroupId === "outros" || (!localRule && tx.confidence === "low"),
        selected: true
      };
    });

    return respondWithTransactions(transactions, parsed.cardIssuer, parsed.statementPeriod, parsed.invoiceTotal);

  } catch (error: any) {
    console.error("Erro na extração da fatura de cartão:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Não foi possível extrair os dados da fatura. Tente enviar um arquivo legível ou preencher manualmente.",
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

function formatExcelDate(val: any): string {
  if (val === null || val === undefined || val === "") return "";

  if (val instanceof Date && !isNaN(val.getTime())) {
    const day = String(val.getUTCDate()).padStart(2, "0");
    const month = String(val.getUTCMonth() + 1).padStart(2, "0");
    const year = val.getUTCFullYear();
    return `${day}/${month}/${year}`;
  }

  const num = Number(val);
  // Converte número de série do Excel (ex: 46056.99967592592 -> 03/02/2026)
  if (!isNaN(num) && typeof val !== "boolean" && num > 20000 && num < 80000) {
    const excelEpochMs = Math.round((num - 25569) * 86400 * 1000);
    const date = new Date(excelEpochMs);
    if (!isNaN(date.getTime())) {
      const day = String(date.getUTCDate()).padStart(2, "0");
      const month = String(date.getUTCMonth() + 1).padStart(2, "0");
      const year = date.getUTCFullYear();
      return `${day}/${month}/${year}`;
    }
  }

  const str = String(val).trim();
  if (/^\d{1,2}\/\d{1,2}(\/\d{2,4})?$/.test(str)) {
    const parts = str.split("/");
    const d = parts[0].padStart(2, "0");
    const m = parts[1].padStart(2, "0");
    const y = parts[2] ? parts[2] : "";
    return y ? `${d}/${m}/${y}` : `${d}/${m}`;
  }

  const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return `${isoMatch[3]}/${isoMatch[2]}/${isoMatch[1]}`;
  }

  const dashMatch = str.match(/^(\d{1,2})-(\d{1,2})-(\d{2,4})/);
  if (dashMatch) {
    return `${dashMatch[1].padStart(2, "0")}/${dashMatch[2].padStart(2, "0")}/${dashMatch[3]}`;
  }

  return str;
}

function parseAmount(val: any): number {
  if (typeof val === "number") return Math.abs(val);
  if (!val) return 0;
  const s = String(val).trim().replace(/^[^\d,-]+/, "");
  if (!s) return 0;

  if (s.includes(",") && s.includes(".")) {
    if (s.indexOf(".") < s.indexOf(",")) {
      // Formato brasileiro: 1.234,56
      return Math.abs(parseFloat(s.replace(/\./g, "").replace(",", ".")) || 0);
    } else {
      // Formato americano: 1,234.56
      return Math.abs(parseFloat(s.replace(/,/g, "")) || 0);
    }
  }
  if (s.includes(",")) {
    return Math.abs(parseFloat(s.replace(",", ".")) || 0);
  }
  return Math.abs(parseFloat(s) || 0);
}

function parseSpreadsheetTransactions(rows: any[][]): Array<{ id: string; date: string; description: string; amount: number; installment?: string | null }> {
  const results: Array<{ id: string; date: string; description: string; amount: number; installment?: string | null }> = [];
  if (!rows || rows.length < 2) return results;

  let dateCol = -1;
  let descCol = -1;
  let valCol = -1;
  let headerRow = 0;

  // Procura cabeçalho nas primeiras 15 linhas
  for (let r = 0; r < Math.min(rows.length, 15); r++) {
    const row = rows[r];
    if (!row || !Array.isArray(row)) continue;

    let foundDate = -1;
    let foundDesc = -1;
    let foundVal = -1;

    for (let c = 0; c < row.length; c++) {
      const cell = String(row[c] || "").toLowerCase().trim();
      if (foundDate === -1 && (cell === "data" || cell.includes("data") || cell === "dt" || cell === "date")) foundDate = c;
      if (foundDesc === -1 && (cell.includes("descri") || cell.includes("lançamento") || cell.includes("lancamento") || cell.includes("estabelecimento") || cell.includes("histórico") || cell.includes("historico") || cell === "title" || cell.includes("compra") || cell.includes("detalhe"))) foundDesc = c;
      if (foundVal === -1 && (cell.includes("valor") || cell.includes("quantia") || cell.includes("total") || cell === "amount" || cell.includes("preço") || cell.includes("preco"))) foundVal = c;
    }

    if (foundDate !== -1 && foundVal !== -1) {
      dateCol = foundDate;
      descCol = foundDesc !== -1 ? foundDesc : (foundDate === 0 ? 1 : 0);
      valCol = foundVal;
      headerRow = r;
      break;
    }
  }

  // Fallback se não encontrou cabeçalho clássico
  if (dateCol === -1 || valCol === -1) {
    dateCol = 0;
    descCol = 1;
    valCol = 2;
    headerRow = 0;
  }

  for (let r = headerRow + 1; r < rows.length; r++) {
    const row = rows[r];
    if (!row || row.length <= Math.max(dateCol, descCol, valCol)) continue;

    const formattedDate = formatExcelDate(row[dateCol]);
    const rawDesc = String(row[descCol] || "").trim();
    const numVal = parseAmount(row[valCol]);

    // Ignora cabeçalhos repetidos, linhas vazias ou pagamentos de fatura anterior
    if (!rawDesc || rawDesc.toLowerCase().includes("pagamento") || rawDesc.toLowerCase().includes("saldo anterior") || rawDesc.toLowerCase().includes("pagamento recebido")) continue;

    if (numVal > 0) {
      const instMatch = rawDesc.match(/(\d{1,2}\s*\/\s*\d{1,2})/);
      results.push({
        id: `row-${r}`,
        date: formattedDate || "01/01",
        description: rawDesc,
        amount: numVal,
        installment: instMatch ? instMatch[1].replace(/\s+/g, "") : null
      });
    }
  }

  return results;
}

async function enhanceCategorizationWithAI(
  transactions: ExtractedInvoiceTransaction[],
  apiKey: string
): Promise<ExtractedInvoiceTransaction[]> {
  const unclassified = transactions.filter((t) => t.needsReview || t.groupId === "outros");
  if (unclassified.length === 0) return transactions;

  const genAI = new GoogleGenerativeAI(apiKey);
  const candidateModels = ["gemini-2.5-flash", "gemini-3.7-flash", "gemini-3.6-flash", "gemini-flash-latest"];

  const itemsToClassify = unclassified.map((t) => ({
    id: t.id,
    description: t.description,
    amount: t.amount
  }));

  const prompt = `Você é um assistente financeiro especialista em finanças pessoais da ARVO no Brasil.
Categorize rigorosamente cada uma das seguintes compras de fatura de cartão de crédito em um dos grupos da ARVO:

GRUPOS DISPONÍVEIS:
- "habitacao": Moradia, condomínio, luz, gás, água, IPTU, reformas, lojas de materiais ou decoração.
- "alimentacao": Supermercados, feiras, açougues, padarias, restaurantes, bares, lanchonetes, iFood, delivery, cafés.
- "transportes": Postos de combustível, Uber, 99, táxi, estacionamento, pedágio, passagens aéreas, locadoras, IPVA.
- "saude": Farmácias, drogarias, hospitais, laboratórios, consultas, dentista, academias, psicólogo, planos de saúde.
- "educacao": Escolas, faculdades, cursos online, infoprodutos (ex: Hotmart, HTM*, Eduzz, Kiwify, Alura, Udemy), livros.
- "comunicacao": Internet, celular, Netflix, Spotify, streaming, softwares (ChatGPT, Claude, Apple, Google, Adobe).
- "despesas": Lazer, viagens, turismo, hospedagem (Airbnb, Booking, hotéis, pousadas), cinema, shows, pet shop, passeios.
- "artigos": Artigos do lar, utilidades (ex: Milium, Leroy, Casa Midi, etc), roupas, vestuário, eletrônicos, móveis, compras em comércio (Mercado Livre, Amazon, Shopee).
- "dividas": Juros de cartão, parcelamento, IOF, anuidade, taxas bancárias.
- "outros": Apenas se for impossível identificar o estabelecimento.

ITENS A CLASSIFICAR:
${JSON.stringify(itemsToClassify, null, 2)}

Retorne EXCLUSIVAMENTE um array JSON no formato:
[
  {
    "id": "row-1",
    "groupId": "artigos",
    "confidence": "high"
  }
]`;

  let responseText = "";
  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json"
        }
      });
      const result = await model.generateContent([{ text: prompt }]);
      const t = result.response.text();
      if (t && t.trim()) {
        responseText = t.trim();
        break;
      }
    } catch (err: any) {
      console.warn(`Tentativa com ${modelName} falhou:`, err?.message || err);
    }
  }

  if (!responseText) return transactions;

  try {
    const cleaned = responseText.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
    const parsedList: Array<{ id: string; groupId: string; confidence?: "high" | "medium" | "low" }> = JSON.parse(cleaned);

    if (Array.isArray(parsedList)) {
      const map = new Map<string, { groupId: string; confidence?: string }>();
      parsedList.forEach((item) => {
        if (item.id && item.groupId) {
          map.set(item.id, item);
        }
      });

      return transactions.map((t) => {
        const aiMatch = map.get(t.id);
        if (aiMatch && aiMatch.groupId && aiMatch.groupId !== "outros") {
          return {
            ...t,
            groupId: aiMatch.groupId,
            groupLabel: getGroupLabel(aiMatch.groupId),
            confidence: (aiMatch.confidence as any) || "high",
            needsReview: false
          };
        }
        return t;
      });
    }
  } catch (parseErr) {
    console.warn("Erro ao fazer parse da categorização por IA:", parseErr);
  }

  return transactions;
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
