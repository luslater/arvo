import * as XLSX from 'xlsx'
import fs from 'fs'

const realisticFunds = [
    // Renda Fixa
    { CNPJ: "01.234.567/0001-01", Name: "Tesouro Selic Premium", Category: "Renda Fixa", Sharpe: 2.5, Volatility: 1.2, AdminFee: 0.3 },
    { CNPJ: "01.234.567/0001-02", Name: "IPCA+ Longo Prazo Elite", Category: "Renda Fixa", Sharpe: 2.1, Volatility: 4.5, AdminFee: 0.5 },
    { CNPJ: "01.234.567/0001-03", Name: "CDB Ouro Plusval", Category: "Renda Fixa", Sharpe: 1.9, Volatility: 2.8, AdminFee: 0.4 },
    { CNPJ: "01.234.567/0001-04", Name: "Debêntures Incentivadas XP", Category: "Renda Fixa", Sharpe: 1.8, Volatility: 3.2, AdminFee: 0.6 },

    // Multimercado
    { CNPJ: "02.345.678/0001-01", Name: "Alaska Black Institucional", Category: "Multimercado", Sharpe: 1.8, Volatility: 6.5, AdminFee: 2.0 },
    { CNPJ: "02.345.678/0001-02", Name: "Verde Macro FIC FIM", Category: "Multimercado", Sharpe: 1.6, Volatility: 7.2, AdminFee: 2.2 },
    { CNPJ: "02.345.678/0001-03", Name: "Dynamo Cougar FIA", Category: "Multimercado", Sharpe: 1.7, Volatility: 8.1, AdminFee: 2.5 },
    { CNPJ: "02.345.678/0001-04", Name: "Absolute Alpha Global", Category: "Multimercado", Sharpe: 1.5, Volatility: 9.3, AdminFee: 2.0 },
    { CNPJ: "02.345.678/0001-05", Name: "Kapitalo Zeta FIM", Category: "Multimercado", Sharpe: 1.4, Volatility: 7.8, AdminFee: 2.3 },

    // Ações
    { CNPJ: "03.456.789/0001-01", Name: "Dividendos Brasil FIA", Category: "Ações", Sharpe: 1.2, Volatility: 15.3, AdminFee: 1.8 },
    { CNPJ: "03.456.789/0001-02", Name: "Small Caps Excellence", Category: "Ações", Sharpe: 1.4, Volatility: 18.7, AdminFee: 2.0 },
    { CNPJ: "03.456.789/0001-03", Name: "Tech Brasil Innovation", Category: "Ações", Sharpe: 1.1, Volatility: 20.2, AdminFee: 2.2 },
    { CNPJ: "03.456.789/0001-04", Name: "Vale+ Commodities FIA", Category: "Ações", Sharpe: 0.9, Volatility: 22.5, AdminFee: 1.9 },

    // Internacional
    { CNPJ: "04.567.890/0001-01", Name: "IVVB11 - S&P 500 ETF", Category: "Internacional", Sharpe: 1.3, Volatility: 12.8, AdminFee: 0.3 },
    { CNPJ: "04.567.890/0001-02", Name: "Global Bonds Premium", Category: "Internacional", Sharpe: 1.5, Volatility: 8.5, AdminFee: 1.2 },
    { CNPJ: "04.567.890/0001-03", Name: "Nasdaq 100 BDR Mix", Category: "Internacional", Sharpe: 1.2, Volatility: 16.4, AdminFee: 0.8 },
    { CNPJ: "04.567.890/0001-04", Name: "Emerging Markets FIA", Category: "Internacional", Sharpe: 1.0, Volatility: 19.2, AdminFee: 1.5 },
]

const wb = XLSX.utils.book_new()
const ws = XLSX.utils.json_to_sheet(realisticFunds)
XLSX.utils.book_append_sheet(wb, ws, "Funds")

XLSX.writeFile(wb, "realistic_funds.xlsx")
console.log("Created realistic_funds.xlsx with " + realisticFunds.length + " funds")
