import { PrismaClient } from '@prisma/client'
import * as XLSX from 'xlsx'
import fs from 'fs'

const prisma = new PrismaClient()

async function main() {
    const filePath = process.argv[2]
    if (!filePath) {
        console.error('Please provide a file path')
        process.exit(1)
    }

    console.log(`Reading file: ${filePath}`)
    const fileBuffer = fs.readFileSync(filePath)
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(sheet)

    console.log(`Found ${data.length} rows. Importing...`)

    let count = 0
    for (const row of data as any[]) {
        // Flexible column mapping
        const cnpj = row['CNPJ'] || row['cnpj']
        const name = row['Name'] || row['Nome'] || row['name'] || row['Fundo']
        const categoryRaw = row['Category'] || row['Categoria'] || row['Classe']
        const sharpe = row['Sharpe'] || row['Índice Sharpe'] || row['Sharpe Ratio']
        const vol = row['Volatility'] || row['Volatilidade'] || row['Vol']
        const fee = row['AdminFee'] || row['Taxa Adm'] || row['Taxa de Administração']

        if (!cnpj || !name) {
            console.warn(`Skipping row without CNPJ or Name: ${JSON.stringify(row)}`)
            continue
        }

        // Map category string to Enum-like string
        let category = "OTHER"
        const catUpper = String(categoryRaw).toUpperCase()
        if (catUpper.includes('FIXA') || catUpper.includes('FIXED')) category = "FIXED_INCOME"
        else if (catUpper.includes('AÇÃO') || catUpper.includes('ACOES') || catUpper.includes('EQUITY')) category = "EQUITY"
        else if (catUpper.includes('MULTI') || catUpper.includes('HEDGE')) category = "MULTIMARKET"
        else if (catUpper.includes('INTERNACIONAL') || catUpper.includes('GLOBAL')) category = "INTERNATIONAL"

        try {
            await prisma.fund.upsert({
                where: { cnpj: String(cnpj).replace(/\D/g, '') }, // Strip non-digits
                update: {
                    name: String(name),
                    category,
                    sharpeRatio: sharpe ? parseFloat(sharpe) : null,
                    volatility: vol ? parseFloat(vol) : null,
                    adminFee: fee ? parseFloat(fee) : null,
                    lastUpdate: new Date()
                },
                create: {
                    cnpj: String(cnpj).replace(/\D/g, ''),
                    name: String(name),
                    category,
                    sharpeRatio: sharpe ? parseFloat(sharpe) : null,
                    volatility: vol ? parseFloat(vol) : null,
                    adminFee: fee ? parseFloat(fee) : null,
                }
            })
            count++
        } catch (e) {
            console.error(`Error importing ${name}:`, e)
        }
    }
    console.log(`Successfully imported ${count} funds.`)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => await prisma.$disconnect())
