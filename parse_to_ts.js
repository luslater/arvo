const XLSX = require('xlsx');
const fs = require('fs');

const workbook = XLSX.readFile('/Users/lucasdematos/Desktop/Dados para atualizar.xlsx');
const sheet = workbook.Sheets['Planilha1'];
const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

const headerRow = json[1];
// Filter rows where the second column (Data) is a valid excel date number (e.g. > 40000)
const dataRows = json.slice(2).filter(row => row && typeof row[1] === 'number' && row[1] > 40000 && row[1] < 50000);

const results = {};

for (let colIdx = 2; colIdx < headerRow.length; colIdx++) {
    const colName = headerRow[colIdx];
    if (!colName || colName.toString().trim() === '') continue;
    
    let cleanName = colName.toString().trim();
    
    const returns = [];
    for (let r = 0; r < dataRows.length; r++) {
        const val = dataRows[r][colIdx];
        returns.push(typeof val === 'number' ? val : 0);
    }
    
    results[cleanName] = returns;
}

const fileContent = `// Gerado a partir do Excel de Atualização de Dados
export const FUND_RETURNS: Record<string, number[]> = ${JSON.stringify(results, null, 2)};
`;

fs.writeFileSync('./src/data/fundReturns.ts', fileContent);
console.log("Written to src/data/fundReturns.ts. Keys:", Object.keys(results).length, "Rows:", dataRows.length);
