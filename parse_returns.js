const xlsx = require('xlsx');
const workbook = xlsx.readFile('/Users/lucasdematos/Desktop/Geral e IQ normal e light-ATUALIZADA.xlsx');

['Dados ', 'Dados Mês a mês ', 'Fundos Selecionados'].forEach(sheetName => {
    if (!workbook.Sheets[sheetName]) return;
    console.log(`\n\n--- PARSING SHEET: ${sheetName} ---`);
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    
    for (let i = 0; i < 5; i++) {
        if (data[i]) {
            console.log(data[i].slice(0, 8));
        }
    }
});
