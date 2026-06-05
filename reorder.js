const fs = require('fs');
let code = fs.readFileSync('/Users/lucasdematos/Desktop/ARVO/src/app/dashboard/bussola/page.tsx', 'utf-8');

const tableSectionStart = '<section className="bg-[#fffdf8]/90 border border-[#e4e0d7] rounded-[24px] p-6 shadow-[0_20px_50px_rgba(23,33,43,0.05)] overflow-hidden">\n                            <h2 className="text-lg font-bold text-[#123044] mb-4">Ativos exibidos no nível selecionado</h2>';
const chartSectionStart = '<section className="bg-[#fffdf8]/90 border border-[#e4e0d7] rounded-[24px] p-6 shadow-[0_20px_50px_rgba(23,33,43,0.05)] overflow-hidden">\n                            <h2 className="text-lg font-bold text-[#123044] mb-2">Histórico Real de Desempenho (36 meses)</h2>';
const sectionEnd = '                        </section>\n';

let tableStartIdx = code.indexOf(tableSectionStart);
if (tableStartIdx === -1) { console.log("Table start not found"); process.exit(1); }

let tableEndIdx = code.indexOf(sectionEnd, tableStartIdx) + sectionEnd.length;

let chartStartIdx = code.indexOf(chartSectionStart);
if (chartStartIdx === -1) { console.log("Chart start not found"); process.exit(1); }

let chartEndIdx = code.indexOf(sectionEnd, chartStartIdx) + sectionEnd.length;

// Extract sections
const tableSection = code.substring(tableStartIdx, tableEndIdx);
const chartSection = code.substring(chartStartIdx, chartEndIdx);

// We want to replace the whole block from tableStartIdx to chartEndIdx
const newBlock = chartSection + '\n' + tableSection;

const newCode = code.substring(0, tableStartIdx) + newBlock + code.substring(chartEndIdx);

fs.writeFileSync('/Users/lucasdematos/Desktop/ARVO/src/app/dashboard/bussola/page.tsx', newCode);
console.log("Sections reordered!");
