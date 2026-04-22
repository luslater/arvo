const xlsx = require("xlsx");
const filePath = "/Users/lucasdematos/Desktop/Dados 3 anos fundos.xlsx";
const workbook = xlsx.readFile(filePath);
const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 });
console.log("Row 0:", data[0].slice(0, 5));
console.log("Row 1:", data[1].slice(0, 5));
console.log("Row 2:", data[2].slice(0, 5));
console.log("Row 3:", data[3].slice(0, 5));
