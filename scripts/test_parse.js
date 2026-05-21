const xlsx = require('xlsx');
const workbook = xlsx.readFile('/Users/lucasdematos/Desktop/Atualizar dados fundos.xlsx', { cellDates: true });
const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 });
console.log("Raw with cellDates: true:");
console.log(data[2]);
