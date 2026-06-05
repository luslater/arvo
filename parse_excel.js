const XLSX = require('xlsx');
const workbook = XLSX.readFile('/Users/lucasdematos/Desktop/Dados para atualizar.xlsx');
console.log("Sheet names:", workbook.SheetNames);
for (const name of workbook.SheetNames) {
    const sheet = workbook.Sheets[name];
    console.log(`\n--- Sheet: ${name} ---`);
    console.log(XLSX.utils.sheet_to_json(sheet, { header: 1 }).slice(0, 5));
}
