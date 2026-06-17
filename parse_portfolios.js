const xlsx = require('xlsx');
const workbook = xlsx.readFile('/Users/lucasdematos/Desktop/Geral e IQ normal e light-ATUALIZADA.xlsx');

const sheetsToParse = ['Geral', 'IQ'];

sheetsToParse.forEach(sheetName => {
    console.log(`\n\n--- PARSING SHEET: ${sheetName} ---`);
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    
    for (let i = 0; i < 20; i++) {
        if (data[i]) {
            console.log(data[i].slice(0, 10));
        }
    }
});
