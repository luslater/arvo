const xlsx = require('xlsx');
const workbook = xlsx.readFile('/Users/lucasdematos/Desktop/Geral e IQ normal e light-ATUALIZADA.xlsx');

const sheet = workbook.Sheets['Dados '];
const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

console.log("Fundo | Média 12 (Monthly) | Annualized");
for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (row && row[0] && typeof row[0] === 'string' && row.length > 2) {
        const name = row[0];
        const media12 = row[2]; // Index 2 is 'Média 12'
        if (typeof media12 === 'number') {
            console.log(`${name.padEnd(40)} | ${(media12*100).toFixed(2)}% | ${(media12 * 12 * 100).toFixed(2)}%`);
        }
    }
}
