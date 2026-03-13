// Asset types for portfolio adaptation
export const ASSET_TYPES = [
    { id: "fundo_aberto", label: "Fundo Aberto", category: "fundos" },
    { id: "cdb", label: "CDB", category: "renda_fixa" },
    { id: "lca", label: "LCA", category: "renda_fixa" },
    { id: "lci", label: "LCI", category: "renda_fixa" },
    { id: "lcd", label: "LCD", category: "renda_fixa" },
    { id: "cra", label: "CRA", category: "renda_fixa" },
    { id: "cri", label: "CRI", category: "renda_fixa" },
    { id: "fundo_imobiliario", label: "Fundo Imobiliário", category: "fiis" },
    { id: "acao", label: "Ação", category: "acoes" },
    { id: "tesouro_pre", label: "Tesouro Pré", category: "tesouro" },
    { id: "tesouro_ipca", label: "Tesouro IPCA+", category: "tesouro" },
    { id: "tesouro_selic", label: "Tesouro Selic", category: "tesouro" },
    { id: "outro", label: "Outro", category: "outros" },
] as const

export type AssetType = typeof ASSET_TYPES[number]["id"]

export type Indexador = "Prefixado" | "Pós-fixado" | "IPCA+" | "Renda Variável"

export interface UserAsset {
    type: AssetType
    name: string
    quantity: number
    value: number
    indexador: Indexador
    rentabilidade: number // percentage per year
    prazo: string // ex: "2027-12-31" or "Indeterminado"
}

export function validateExcelData(data: any[]): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!Array.isArray(data) || data.length === 0) {
        errors.push("Arquivo vazio ou inválido")
        return { valid: false, errors }
    }

    // Check for required columns
    const requiredColumns = ["tipo", "ativo", "quantidade", "valor"]
    const firstRow = data[0]

    requiredColumns.forEach(col => {
        if (!(col in firstRow)) {
            errors.push(`Coluna "${col}" não encontrada`)
        }
    })

    return { valid: errors.length === 0, errors }
}
