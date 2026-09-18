import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as xlsx from "xlsx";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { parseXpWorkbook } from "@/lib/portfolio-xp-parser";

export const dynamic = "force-dynamic";

export interface ExtractedAsset {
  name: string;
  value: number | null;
  weight: number;
  category?: string;
  yield?: number;
  annualReturn?: number;
  indexador?: string;
  taxa?: string;
}

export interface ExtractionResponse {
  success: boolean;
  portfolioName: string;
  totalValue: number;
  portfolioReturn12m?: number;
  portfolioReturnYtd?: number;
  monthlyWeightedYield?: number;
  monthlyHistory?: { date: string; returnPct: number }[];
  assets: ExtractedAsset[];
  error?: string;
}

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
      if (text) {
        rawText = text;
      }
      if (extractedText) {
        clientExtractedText = extractedText;
      }
    } else if (contentType.includes("application/json")) {
      const body = await req.json();
      rawText = body.text || "";
      clientExtractedText = body.extractedText || "";
    }

    if (!fileBuffer && !rawText.trim() && !clientExtractedText.trim()) {
      return NextResponse.json(
        { error: "Nenhum arquivo ou texto enviado para extração." },
        { status: 400 }
      );
    }

    const lowerName = fileName.toLowerCase();
    const isSpreadsheet =
      lowerName.endsWith(".xlsx") ||
      lowerName.endsWith(".xls") ||
      lowerName.endsWith(".csv") ||
      mimeType.includes("spreadsheetml") ||
      mimeType.includes("excel");

    // 1. Extração nativa ultra-rápida e determinística para planilhas XP (PosicaoDetalhada.xlsx)
    if (fileBuffer && isSpreadsheet) {
      try {
        const workbook = xlsx.read(fileBuffer, { type: "buffer" });
        const xpParsed = parseXpWorkbook(workbook);
        if (xpParsed && xpParsed.assets.length > 0) {
          const totalW = xpParsed.assets.reduce((acc, a) => acc + (a.weight || 0), 0) || 100;
          const calculatedMonthlyWeighted = xpParsed.assets.reduce((acc, a) => {
            const w = (a.weight || 0) / totalW;
            return acc + w * (a.yield || 0);
          }, 0);
          const calculatedAnnualWeighted = (Math.pow(1 + calculatedMonthlyWeighted / 100, 12) - 1) * 100;

          return NextResponse.json({
            success: true,
            portfolioName: xpParsed.portfolioName,
            totalValue: xpParsed.totalValue,
            portfolioReturn12m: Math.round(calculatedAnnualWeighted * 100) / 100,
            monthlyWeightedYield: Math.round(calculatedMonthlyWeighted * 100) / 100,
            monthlyHistory: [],
            assets: xpParsed.assets
          });
        }
      } catch (sheetErr) {
        console.warn("Extração nativa XP não aplicável ou com falha, seguindo para IA:", sheetErr);
      }
    }

    // 2. Extração via IA (Gemini) para outros formatos (PDF, imagens, textos livres ou outras corretoras)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined in environment variables.");
      return NextResponse.json(
        {
          error: "Chave de IA (GEMINI_API_KEY) não configurada no servidor.",
          code: "NO_API_KEY"
        },
        { status: 503 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Lista de modelos suportados atualizados em ordem de prioridade
    const candidateModels = ["gemini-3.7-flash", "gemini-3.6-flash", "gemini-2.5-flash", "gemini-flash-latest"];
    
    const systemPrompt = `Você é o analista sênior de inteligência de investimentos da ARVO (consultoria de patrimônio e investimentos independente).
Sua missão é realizar a leitura técnica, interpretação de linguagem natural e extração de altíssima precisão de investimentos financeiros, seja a partir de:
A) EXTRATOS E DOCUMENTOS BANCÁRIOS (PDFs de relatórios XPerformance da XP, BTG Pactual, Itaú / Íon, Bradesco / Ágora, Santander, Safra, Banco do Brasil, Nubank / NuInvest, Inter, Órama, etc. ou planilhas Excel).
B) TEXTOS LIVRES, MENSAGENS E NOTAS DIGITADAS PELO CLIENTE (Ex: "Tenho 20k no Nubank a 120% do cdi e 10k no Mercado Pago a 105% do cdi", ou listas digitadas em linhas).

OBJETIVO CRUCIAL:
1. Identificar com exatidão cada ativo financeiro informado no texto ou documento.
2. Extrair o Saldo em Reais (R$) e a alocação percentual (%) de cada ativo (ex: "20k" = R$ 20.000, "10 mil" = R$ 10.000, "R$ 50.000" = R$ 50.000).
3. Identificar o Indexador e a Taxa de remuneração de cada ativo: se é Pós-fixado (CDI/Selic), IPCA+ (inflação), Prefixado, Ações, FIIs, Multimercado ou Dólar.
4. Identificar a Taxa Contratada / Rentabilidade 12M e calcular a taxa mensal equivalente (% a.m.) no campo "yield":
   - ATENÇÃO: O campo "yield" SEMPRE DEVE SER A TAXA MENSAL EQUIVALENTE (% a.m.), tipicamente entre 0,5% e 3,0% ao mês. NUNCA coloque 120 ou 100 no campo yield!
   - Considerando o CDI de referência atual de aproximadamente 13,90% a.a. (1,09% a.m.):
     - Se o cliente informar "120% do CDI": taxa = "120% do CDI", annualReturn = 16.68, yield = 1.29 (pois 120% de 13,90% a.a. = 16,68% a.a. -> 1,29% a.m.).
     - Se o cliente informar "105% do CDI": taxa = "105% do CDI", annualReturn = 14.60, yield = 1.14 (pois 105% de 13,90% a.a. = 14,60% a.a. -> 1,14% a.m.).
     - Se o cliente informar "100% do CDI": taxa = "100% do CDI", annualReturn = 13.90, yield = 1.09.
     - Se o cliente informar "IPCA + 6,5%": taxa = "IPCA + 6,5%", annualReturn = 11.30, yield = 0.90.
     - Se o cliente informar "Prefixado 14% a.a.": taxa = "Pré 14% a.a.", annualReturn = 14.00, yield = 1.10.
5. Calcular o totalValue somando os valores dos ativos, os pesos (weight em %) e o rendimento ponderado da carteira.

REGRAS ESPECÍFICAS PARA RELATÓRIOS E PLANILHAS DA XP INVESTIMENTOS:
- Ignore completamente seções como "Dividendos, proventos e outras distribuições", "Proventos provisionados", "Custódia Remunerada" ou "Garantias". Essas linhas representam proventos futuros ou remunerações temporárias, e NÃO ativos em custódia na data base.
- Se um ticker como "TAEE11" aparece na seção de Ações com sua posição principal, e depois reaparece na seção de Dividendos/Proventos com R$ 107,84 de JCP ou R$ 72,22 de dividendo provisionado, NUNCA duplique o ativo com esses valores residuais de proventos!
- Para fundos de investimentos e ações, o valor em reais (R$) deve ser extraído da coluna "Saldo líquido" ou "Saldo", e não da coluna "Valor aplicado", "Quantidade" ou "Preço médio".
- Extraia cada ativo de COE, Fundos de Investimentos, Ações e Renda Fixa com seu saldo em conta correto.
- NUNCA utilize mês parcial (corte no meio do mês) como rentabilidade anual.
- Extraia a rentabilidade acumulada de 12 Meses (12M) de cada ativo/classe e calcule yield mensal = ((1 + taxa_12M / 100)^(1/12) - 1) * 100.
- Extraia a tabela de evolução mês a mês no campo "monthlyHistory".

FORMATO DE SAÍDA ESTRITO (JSON):
Retorne EXCLUSIVAMENTE o objeto JSON abaixo, sem texto antes ou depois, sem markdown:
{
  "portfolioName": "Carteira Informada pelo Cliente",
  "totalValue": 30000.00,
  "portfolioReturn12m": 15.98,
  "portfolioReturnYtd": 9.80,
  "monthlyWeightedYield": 1.24,
  "assets": [
    {
      "name": "Nubank",
      "value": 20000.00,
      "weight": 66.67,
      "category": "Caixa / Renda Fixa",
      "indexador": "Pós-fixado (CDI)",
      "taxa": "120% do CDI",
      "annualReturn": 16.68,
      "yield": 1.29
    },
    {
      "name": "Mercado Pago",
      "value": 10000.00,
      "weight": 33.33,
      "category": "Caixa / Renda Fixa",
      "indexador": "Pós-fixado (CDI)",
      "taxa": "105% do CDI",
      "annualReturn": 14.60,
      "yield": 1.14
    }
  ],
  "monthlyHistory": []
}`;

    let contentsParts: any[] = [];

    // Monta o prompt incluindo contexto de texto e arquivo binário
    contentsParts.push({ text: systemPrompt });

    if (clientExtractedText.trim()) {
      contentsParts.push({
        text: `--- TEXTO DIGITAL EXTRAÍDO DAS PÁGINAS DO EXTRATO BANCÁRIO ---\n${clientExtractedText}\n-------------------------------------------------------------`
      });
    }

    if (rawText.trim() && rawText !== clientExtractedText) {
      contentsParts.push({
        text: `--- TEXTO DIGITADO PELO CLIENTE (MENSAGEM / NOTA DE CARTEIRA) ---\n${rawText}\n------------------------------------------------------------------`
      });
    }

    if (fileBuffer) {
      if (isSpreadsheet) {
        const workbook = xlsx.read(fileBuffer, { type: "buffer" });
        let sheetCsvText = "";
        workbook.SheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          sheetCsvText += `\n--- ABA: ${sheetName} ---\n` + xlsx.utils.sheet_to_csv(sheet);
        });

        contentsParts.push({
          text: `--- CONTEÚDO DA PLANILHA DE INVESTIMENTOS (${fileName}) ---\n${sheetCsvText}\n--------------------------------------------------------`
        });
      } else {
        // PDF ou Imagem
        let finalMime = mimeType;
        if (!finalMime || finalMime === "application/octet-stream") {
          if (lowerName.endsWith(".pdf")) finalMime = "application/pdf";
          else if (lowerName.endsWith(".png")) finalMime = "image/png";
          else if (lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")) finalMime = "image/jpeg";
          else if (lowerName.endsWith(".webp")) finalMime = "image/webp";
          else finalMime = "application/pdf";
        }

        const base64Data = fileBuffer.toString("base64");
        contentsParts.push({
          inlineData: {
            data: base64Data,
            mimeType: finalMime
          }
        });
      }
    }

    contentsParts.push({
      text: `Por favor, interprete com inteligência todas as informações acima (seja texto digitado em linguagem natural, mensagem do cliente, extrato bancário ou planilha) e retorne o JSON estruturado com todos os ativos identificados, seus valores em R$, pesos %, indexador correto, taxa e rendimento mensal equivalente (yield em % a.m.).`
    });

    let responseText = "";
    let lastError: any = null;

    // Tenta executar nos modelos disponíveis
    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.1
          }
        });

        const result = await model.generateContent(contentsParts);
        const response = await result.response;
        responseText = response.text() || "";
        if (responseText.trim()) {
          break; // Sucesso!
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Tentativa com modelo ${modelName} falhou:`, err?.message || err);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    if (!responseText.trim()) {
      throw lastError || new Error("Nenhuma resposta gerada pelos modelos de IA");
    }

    // Processamento e limpeza do JSON
    let parsedResult: any = null;
    try {
      const cleanJson = responseText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      parsedResult = JSON.parse(cleanJson);
    } catch (parseErr) {
      console.error("Erro ao analisar JSON retornado pelo Gemini:", responseText);
      throw new Error("A IA leu o documento mas não foi possível formatar a lista de ativos.");
    }

    // Normalização dos ativos
    let rawAssets: any[] = Array.isArray(parsedResult)
      ? parsedResult
      : Array.isArray(parsedResult?.assets)
      ? parsedResult.assets
      : [];

    if (rawAssets.length === 0) {
      return NextResponse.json({
        success: false,
        portfolioName: parsedResult?.portfolioName || "Carteira Importada",
        totalValue: 0,
        assets: [],
        error: "Nenhum ativo financeiro individual foi encontrado no extrato enviado."
      });
    }

    // Filtragem rigorosa de linhas inválidas, cabeçalhos de estratégia e transações
    const invalidAssetRegex = /^(total|subtotal|patrim[oô]nio\s*total|saldo\s*total|posi[cç][aã]o\s*total|totalizador|resumo\s*consolidado|total\s*em\s*cust[oó]dia|total\s*geral|estrat[eé]gia|p[oó]s\s*fixado|infla[cç][aã]o|pr[eé]\s*fixado|caixa|proventos|ted|doc|pix|iof|irrf|resgate|aplica[cç][aã]o|retirada|taxa|disclaimer|aviso|saldo\s*em)/i;
    const filteredAssets = rawAssets.filter((item: any) => {
      if (!item || !item.name) return false;
      const name = String(item.name).trim();
      if (!name || name.length < 2) return false;
      if (invalidAssetRegex.test(name)) return false;
      return true;
    });

function parseCurrencyValue(raw: any): number | null {
  if (typeof raw === "number" && isFinite(raw)) return raw > 0 ? Math.round(raw * 100) / 100 : null;
  if (typeof raw === "string") {
    let clean = raw.replace(/R\$/gi, "").trim();
    if (!clean) return null;

    // Formato brasileiro com milhar e centavos: "150.000,50" ou "1.250.000,00"
    if (clean.includes(".") && clean.includes(",")) {
      if (clean.lastIndexOf(",") > clean.lastIndexOf(".")) {
        clean = clean.replace(/\./g, "").replace(",", ".");
      } else {
        clean = clean.replace(/,/g, "");
      }
    } else if (clean.includes(",")) {
      // "150000,50" ou "150,00"
      clean = clean.replace(/\./g, "").replace(",", ".");
    } else if (clean.includes(".")) {
      const parts = clean.split(".");
      if (parts.length > 2) {
        clean = parts.join("");
      } else if (parts.length === 2 && parts[1].length === 3) {
        // "150.000" -> separador de milhar brasileiro
        clean = parts[0] + parts[1];
      }
    }

    const num = parseFloat(clean.replace(/[^\d.]/g, ""));
    return isFinite(num) && num > 0 ? Math.round(num * 100) / 100 : null;
  }
  return null;
}

    // Calcula valores e pesos normalizados
    let totalCalculated = 0;
    const formattedAssets: ExtractedAsset[] = filteredAssets.map((item: any) => {
      const val = parseCurrencyValue(item.value);
      if (val !== null) {
        totalCalculated += val;
      }

      let w = typeof item.weight === "number" && isFinite(item.weight) ? item.weight : 0;

      let indexador = item.indexador || item.indexer || "";
      const lowerName = String(item.name || "").toLowerCase();
      const lowerCat = String(item.category || "").toLowerCase();

      // Heurística de fallback inteligente para Indexador caso não tenha vindo explícito
      if (!indexador) {
        if (lowerName.includes("ipca") || lowerName.includes("infla") || lowerName.includes("ntn-b") || lowerCat.includes("infla")) {
          indexador = "IPCA+";
        } else if (lowerName.includes("pre") || lowerName.includes("pré") || lowerName.includes("prefix") || lowerCat.includes("pre") || lowerCat.includes("pré")) {
          indexador = "Prefixado";
        } else if (lowerName.includes("fii") || lowerName.includes("imobili") || lowerName.match(/\b[a-z]{4}11\b/) || lowerCat.includes("fii") || lowerCat.includes("imobil")) {
          indexador = "FIIs";
        } else if (lowerName.includes("ação") || lowerName.includes("acoes") || lowerName.includes("ações") || lowerName.match(/\b[a-z]{4}[34]\b/) || lowerCat.includes("ação") || lowerCat.includes("acoes")) {
          indexador = "Ações";
        } else if (lowerName.includes("multimercado") || lowerName.includes("fim") || lowerCat.includes("multi")) {
          indexador = "Multimercado";
        } else if (lowerName.includes("dolar") || lowerName.includes("dólar") || lowerName.includes("global") || lowerName.includes("exterior") || lowerCat.includes("internacional")) {
          indexador = "Dólar";
        } else if (lowerName.includes("selic")) {
          indexador = "Pós-fixado (Selic)";
        } else {
          indexador = "Pós-fixado (CDI)";
        }
      }

      let y = typeof item.yield === "number" && isFinite(item.yield) ? item.yield : 1.09;
      let taxa = item.taxa || item.rate || indexador;

      // Sanitização inteligente de yield vs % do CDI / Taxa Anual
      if (indexador === "Pós-fixado (CDI)" || indexador === "Pós-fixado (Selic)") {
        if (y >= 20) {
          taxa = taxa && !taxa.includes("%") ? `${y}% do CDI` : (taxa || `${y}% do CDI`);
          const totalAnnual = (y / 100) * 0.1390;
          y = Math.round((Math.pow(1 + totalAnnual, 1 / 12) - 1) * 10000) / 100;
        }
      } else if (indexador === "Prefixado") {
        if (y >= 4.0) {
          taxa = taxa && !taxa.includes("%") ? `Pré ${y}% a.a.` : (taxa || `Pré ${y}% a.a.`);
          y = Math.round((Math.pow(1 + y / 100, 1 / 12) - 1) * 10000) / 100;
        }
      } else if (indexador === "IPCA+") {
        if (y >= 2.5 && y <= 15.0) {
          taxa = taxa && !taxa.includes("IPCA") ? `IPCA + ${y}%` : (taxa || `IPCA + ${y}%`);
          const totalAnnual = (1 + 0.045) * (1 + y / 100) - 1;
          y = Math.round((Math.pow(1 + totalAnnual, 1 / 12) - 1) * 10000) / 100;
        } else if (y > 15.0) {
          y = Math.round((Math.pow(1 + y / 100, 1 / 12) - 1) * 10000) / 100;
        }
      }

      let ann = typeof item.annualReturn === "number" && isFinite(item.annualReturn) && item.annualReturn > 0
        ? item.annualReturn
        : Math.round((Math.pow(1 + y / 100, 12) - 1) * 10000) / 100;

      const cleanName = String(item.name || "Ativo")
        .replace(/[-:–—|;,•\s]+$/g, '')
        .replace(/^[-:–—|;,•\s]+/g, '')
        .trim();

      return {
        name: cleanName || "Ativo",
        value: val,
        weight: w,
        category: item.category || item.cat || "Renda Fixa",
        indexador: indexador,
        taxa: taxa,
        annualReturn: ann,
        yield: y
      };
    });

    const parsedTotal = parseCurrencyValue(parsedResult.totalValue);
    const totalValue = parsedTotal || totalCalculated || 0;

    // Se temos valores monetários calculados, define os pesos percentuais com precisão decimal
    if (totalCalculated > 0) {
      formattedAssets.forEach((asset) => {
        if (asset.value !== null) {
          asset.weight = Math.round((asset.value / totalCalculated) * 1000) / 10;
        }
      });
    }

    // Ajuste fino para garantir que a soma dos pesos seja exatamente 100.0%
    const totalWeight = formattedAssets.reduce((acc, a) => acc + (a.weight || 0), 0);
    if (totalWeight > 0 && Math.abs(totalWeight - 100) > 0.05) {
      formattedAssets.forEach((asset) => {
        asset.weight = Math.round(((asset.weight || 0) / totalWeight) * 1000) / 10;
      });
    }

    const totalW = formattedAssets.reduce((acc, a) => acc + (a.weight || 0), 0) || 100;
    const calculatedMonthlyWeighted = formattedAssets.reduce((acc, a) => {
      const w = (a.weight || 0) / totalW;
      return acc + w * (a.yield || 0);
    }, 0);
    const calculatedAnnualWeighted = (Math.pow(1 + calculatedMonthlyWeighted / 100, 12) - 1) * 100;

    const portfolioReturn12m = typeof parsedResult.portfolioReturn12m === "number" && parsedResult.portfolioReturn12m > 0
      ? parsedResult.portfolioReturn12m
      : Math.round(calculatedAnnualWeighted * 100) / 100;

    const monthlyWeightedYield = Math.round(calculatedMonthlyWeighted * 100) / 100;
    const portfolioName = parsedResult.portfolioName || (fileName ? fileName.replace(/\.[^.]+$/, "") : "Carteira Importada via IA");

    return NextResponse.json({
      success: true,
      portfolioName,
      totalValue: Math.round(totalValue * 100) / 100,
      portfolioReturn12m,
      portfolioReturnYtd: typeof parsedResult.portfolioReturnYtd === "number" ? parsedResult.portfolioReturnYtd : undefined,
      monthlyWeightedYield,
      monthlyHistory: Array.isArray(parsedResult.monthlyHistory) ? parsedResult.monthlyHistory : [],
      assets: formattedAssets
    });
  } catch (error: any) {
    console.error("AI Portfolio Extraction Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Falha ao processar arquivo com IA",
        details: String(error)
      },
      { status: 500 }
    );
  }
}
