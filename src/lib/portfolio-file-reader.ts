export type PortfolioFileContent =
  | { kind: "table"; rows: unknown[][] }
  | { kind: "text"; text: string }

const MAX_FILE_SIZE = 15 * 1024 * 1024
const SUPPORTED_EXTENSIONS = new Set(["csv", "txt", "xlsx", "xls", "pdf"])

export class PortfolioFileError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "PortfolioFileError"
  }
}

function extensionOf(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() ?? ""
}

function normalizeSpacedPdfText(raw: string): string {
  return raw
    // Normaliza valores monetários com caracteres espaçados: 'R $ 2 1 . 5 2 9 , 8 4' -> 'R$ 21.529,84'
    .replace(/R\s*\$\s*([\d\s.,]+)/gi, (_, p1) => 'R$ ' + p1.replace(/\s+/g, ''))
    // Normaliza porcentagens espaçadas: '7 6 , 6 0 %' -> '76,60%'
    .replace(/([\d\s]+)\s*,\s*([\d\s]+)\s*%/g, (_, p1, p2) => p1.replace(/\s+/g, '') + ',' + p2.replace(/\s+/g, '') + '%')
    .replace(/P\s*O\s*S\s*I\s*Ç\s*Ã\s*O\s*D\s*E\s*T\s*A\s*L\s*H\s*A\s*D\s*A/gi, 'POSIÇÃO DETALHADA')
    .replace(/E\s*S\s*T\s*R\s*A\s*T\s*É\s*G\s*I\s*A/gi, 'ESTRATÉGIA')
    .replace(/In\s*fl\s*a\s*ção/gi, 'Inflação')
    .replace(/\s+/g, ' ');
}

function groupPdfTextItems(items: unknown[]) {
  const lines = new Map<number, Array<{ x: number; text: string }>>()

  for (const item of items) {
    if (!item || typeof item !== "object" || !("str" in item) || !("transform" in item)) continue

    const textItem = item as { str?: unknown; transform?: unknown }
    const text = String(textItem.str ?? "").trim()
    const transform = Array.isArray(textItem.transform) ? textItem.transform : []
    const x = Number(transform[4] ?? 0)
    const y = Number(transform[5] ?? 0)

    if (!text) continue

    // PDF coordinates often differ by fractions of a point for text on the same line.
    const lineKey = Math.round(y / 4)
    const line = lines.get(lineKey) ?? []
    line.push({ x, text })
    lines.set(lineKey, line)
  }

  return [...lines.entries()]
    .sort(([lineA], [lineB]) => lineB - lineA)
    .map(([, parts]) => normalizeSpacedPdfText(parts.sort((a, b) => a.x - b.x).map(part => part.text).join(" ")))
    .filter(Boolean)
}

async function readSpreadsheet(file: File): Promise<PortfolioFileContent> {
  const XLSX = await import("xlsx")
  const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" })
  const firstSheetName = workbook.SheetNames[0]

  if (!firstSheetName) {
    throw new PortfolioFileError("A planilha não possui nenhuma aba para importar.")
  }

  const sheet = workbook.Sheets[firstSheetName]
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    raw: false,
    defval: "",
  })

  return { kind: "table", rows }
}

async function readPdf(file: File): Promise<PortfolioFileContent> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs")
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString()

  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) })
  const document = await loadingTask.promise
  const pages: string[] = []

  try {
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber)
      const content = await page.getTextContent()
      pages.push(...groupPdfTextItems(content.items), "")
      page.cleanup()
    }
  } finally {
    await document.destroy()
  }

  const text = pages.join("\n").trim()
  if (!text) {
    throw new PortfolioFileError(
      "Não encontramos texto neste PDF. Se ele for uma imagem escaneada, envie a carteira em Excel/CSV ou cole a lista de ativos.",
    )
  }

  return { kind: "text", text }
}

export async function readPortfolioFile(file: File): Promise<PortfolioFileContent> {
  const extension = extensionOf(file.name)

  if (!SUPPORTED_EXTENSIONS.has(extension)) {
    throw new PortfolioFileError("Formato não suportado. Envie um arquivo PDF, Excel, CSV ou TXT.")
  }

  if (file.size === 0) {
    throw new PortfolioFileError("O arquivo selecionado está vazio.")
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new PortfolioFileError("O arquivo é maior que 15 MB. Exporte apenas a posição da carteira e tente novamente.")
  }

  try {
    if (extension === "xlsx" || extension === "xls") return await readSpreadsheet(file)
    if (extension === "pdf") return await readPdf(file)
    return { kind: "text", text: await file.text() }
  } catch (error) {
    if (error instanceof PortfolioFileError) throw error
    throw new PortfolioFileError(
      "Não foi possível ler esse arquivo. Verifique se ele não está protegido por senha ou corrompido e tente novamente.",
    )
  }
}
