import * as XLSX from 'xlsx'
import fs from 'fs'

const data = [
    { CNPJ: "12.345.678/0001-90", Name: "Fundo Conservador Plus", Category: "Renda Fixa", Sharpe: 1.5, Volatility: 2.0, AdminFee: 0.5 },
    { CNPJ: "98.765.432/0001-10", Name: "Alpha Multimercado", Category: "Multimercado", Sharpe: 2.1, Volatility: 5.5, AdminFee: 1.5 },
    { CNPJ: "11.222.333/0001-44", Name: "Tech Global Equities", Category: "Internacional", Sharpe: 1.8, Volatility: 15.0, AdminFee: 2.0 },
    { CNPJ: "55.444.333/0001-22", Name: "Dividendos Brasil", Category: "Ações", Sharpe: 1.2, Volatility: 12.0, AdminFee: 1.8 },
    { CNPJ: "66.777.888/0001-99", Name: "Tesouro Selic Simples", Category: "Renda Fixa", Sharpe: 3.0, Volatility: 0.5, AdminFee: 0.2 },
]

const wb = XLSX.utils.book_new()
const ws = XLSX.utils.json_to_sheet(data)
XLSX.utils.book_append_sheet(wb, ws, "Funds")

XLSX.writeFile(wb, "sample_funds.xlsx")
console.log("Created sample_funds.xlsx")
