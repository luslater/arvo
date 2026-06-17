const fs = require('fs');
const xlsx = require('xlsx');

const workbook = xlsx.readFile('/Users/lucasdematos/Desktop/Geral e IQ normal e light-ATUALIZADA.xlsx');

const portfolios = {
    GERAL_NORMAL: [],
    GERAL_LIGHT: [],
    IQ_NORMAL: [],
    IQ_LIGHT: []
};

const levelsMap = {
    'Abrigo': { pos: 0, head: 'Preservação antes de crescimento.', desc: 'Para proteger, organizar e manter o patrimônio com liquidez e baixa oscilação.' },
    'Ritmo': { pos: 33, head: 'Mais retorno potencial, ainda com controle.', desc: 'Para quem já organizou a base financeira e busca avançar com equilíbrio.' },
    'Visão': { pos: 66, head: 'Diversificação e crescimento com método.', desc: 'Para quem aceita maior oscilação em busca de crescimento patrimonial no médio e longo prazo.' },
    'Oceano': { pos: 100, head: 'Ondas maiores exigem mais horizonte.', desc: 'Para investidores com maior horizonte, maior tolerância a risco e foco em crescimento global.' },
    'Abrigo Light': { pos: 0, head: 'Preservação antes de crescimento.', desc: 'Versão simplificada para proteger e organizar o patrimônio.' },
    'Ritmo Light': { pos: 33, head: 'Mais retorno potencial, ainda com controle.', desc: 'Equilíbrio com estrutura mais enxuta.' },
    'Visão Light': { pos: 66, head: 'Diversificação e crescimento com método.', desc: 'Exposição ao crescimento através de ativos focados.' },
    'Oceano Light': { pos: 100, head: 'Ondas maiores exigem mais horizonte.', desc: 'Versão concentrada para máximo crescimento dentro da metodologia.' }
};

// Also for IQ:
levelsMap['Abrigo IQ'] = { pos: 0, head: 'Preservação com acesso exclusivo.', desc: 'Produtos restritos a Investidores Qualificados para proteção.' };
levelsMap['Ritmo IQ'] = { pos: 33, head: 'Equilíbrio e alocação avançada.', desc: 'Busca por retorno extra com ativos sofisticados.' };
levelsMap['Visão IQ'] = { pos: 66, head: 'Diversificação profunda e metodológica.', desc: 'Crescimento usando todo o espectro de investimentos.' };
levelsMap['Oceano IQ'] = { pos: 100, head: 'Crescimento sem amarras.', desc: 'O maior potencial do mercado para Investidores Qualificados.' };
levelsMap['Abrigo Light IQ'] = { pos: 0, head: 'Preservação simplificada e exclusiva.', desc: 'A base da proteção com os melhores fundos do mercado.' };
levelsMap['Ritmo Light IQ'] = { pos: 33, head: 'Equilíbrio com estrutura enxuta (IQ).', desc: 'Exposição essencial ao risco mantendo a qualidade IQ.' };
levelsMap['Visão Light IQ'] = { pos: 66, head: 'Diversificação direta ao ponto.', desc: 'Crescimento patrimonial concentrado nos fundos líderes.' };
levelsMap['Oceano Light IQ'] = { pos: 100, head: 'Crescimento máximo, complexidade mínima.', desc: 'A essência da carteira agressiva para Investidores Qualificados.' };

function parseSheet(sheetName, destNormal, destLight, isIQ) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) return;
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    
    let currentLevel = null;
    let isLight = false;
    
    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        if (!row || !row[0]) continue;
        
        const cellValue = String(row[0]).trim();
        if (cellValue === 'Reserva de Emergência') continue; // skip header
        
        let possibleLevelName = cellValue;
        if (isIQ) {
            if (possibleLevelName === 'Abrigo') possibleLevelName = 'Abrigo IQ';
            else if (possibleLevelName === 'Ritmo') possibleLevelName = 'Ritmo IQ';
            else if (possibleLevelName === 'Visão') possibleLevelName = 'Visão IQ';
            else if (possibleLevelName === 'Oceano') possibleLevelName = 'Oceano IQ';
            
            if (possibleLevelName === 'Abrigo Light') possibleLevelName = 'Abrigo Light IQ';
            else if (possibleLevelName === 'Ritmo Light') possibleLevelName = 'Ritmo Light IQ';
            else if (possibleLevelName === 'Visão Light') possibleLevelName = 'Visão Light IQ';
            else if (possibleLevelName === 'Oceano Light') possibleLevelName = 'Oceano Light IQ';
        }
        
        if (levelsMap[possibleLevelName]) {
            currentLevel = {
                name: possibleLevelName,
                position: levelsMap[possibleLevelName].pos,
                headline: levelsMap[possibleLevelName].head,
                description: levelsMap[possibleLevelName].desc,
                assets: []
            };
            if (possibleLevelName.includes('Light')) {
                portfolios[destLight].push(currentLevel);
                isLight = true;
            } else {
                portfolios[destNormal].push(currentLevel);
                isLight = false;
            }
        } else if (currentLevel && typeof row[1] === 'number') {
            // It's an asset
            const assetName = cellValue;
            const weight = Math.round(row[1] * 100);
            
            // basic class logic based on name
            let assetClass = 'Outros';
            if (assetName.toLowerCase().includes('selic') || assetName.toLowerCase().includes('caixa')) assetClass = 'Caixa / Selic';
            else if (assetName.toLowerCase().includes('fuji') || assetName.toLowerCase().includes('rubi') || assetName.toLowerCase().includes('credit') || assetName.toLowerCase().includes('valora') || assetName.toLowerCase().includes('yield') || assetName.toLowerCase().includes('sparta') || assetName.toLowerCase().includes('jgp corporate') || assetName.toLowerCase().includes('seahawk') || assetName.toLowerCase().includes('mapfre') || assetName.toLowerCase().includes('augme') || assetName.toLowerCase().includes('capitânia') || assetName.toLowerCase().includes('premium')) assetClass = 'Renda fixa';
            else if (assetName.toLowerCase().includes('infra') || assetName.toLowerCase().includes('deb')) assetClass = 'Infra / IPCA+';
            else if (assetName.toLowerCase().includes('atlas') || assetName.toLowerCase().includes('ecossistema') || assetName.toLowerCase().includes('oportunidade') || assetName.toLowerCase().includes('macro') || assetName.toLowerCase().includes('falcon') || assetName.toLowerCase().includes('kappa') || assetName.toLowerCase().includes('zeta') || assetName.toLowerCase().includes('nimitz') || assetName.toLowerCase().includes('raptor') || assetName.toLowerCase().includes('v10') || assetName.toLowerCase().includes('x60')) assetClass = 'Multimercado';
            else if (assetName.toLowerCase().includes('dahlia') || assetName.toLowerCase().includes('long bias') || assetName.toLowerCase().includes('vista')) assetClass = 'Long bias';
            else if (assetName.toLowerCase().includes('fia') || assetName.toLowerCase().includes('ações') || assetName.toLowerCase().includes('acoes') || assetName.toLowerCase().includes('bogari') || assetName.toLowerCase().includes('brasil capital') || assetName.toLowerCase().includes('dynamo') || assetName.toLowerCase().includes('forpus') || assetName.toLowerCase().includes('real investor') || assetName.toLowerCase().includes('ip participações')) assetClass = 'Ações Brasil';
            
            currentLevel.assets.push({
                asset: assetName,
                class: assetClass,
                manager: assetName.split(' ')[0], // simplification
                weight: weight,
                eligibility: isIQ ? 'IQ' : 'Geral'
            });
        }
    }
}

parseSheet('Geral', 'GERAL_NORMAL', 'GERAL_LIGHT', false);
parseSheet('IQ', 'IQ_NORMAL', 'IQ_LIGHT', true);

const metrics = {};
const dadosSheet = workbook.Sheets['Dados '];
const dadosData = xlsx.utils.sheet_to_json(dadosSheet, { header: 1 });
for (let i = 0; i < dadosData.length; i++) {
    const row = dadosData[i];
    if (row && row[0] && typeof row[0] === 'string' && row.length > 2) {
        const name = row[0];
        const media12 = row[2];
        if (typeof media12 === 'number') {
            metrics[name] = {
                expectedReturn: Number((media12 * 12 * 100).toFixed(2)),
                volatility: 5.0 // dummy volatility since we don't have it easily
            };
        }
    }
}

// Generate TS output
let tsOutput = `export type PortfolioLine = "Geral Normal" | "Geral Light" | "IQ Normal" | "IQ Light";\n`;
tsOutput += `export type InvestorProfile = "Conservador" | "Moderado" | "Arrojado";\n\n`;
tsOutput += `export interface MockAsset {\n    asset: string;\n    class: string;\n    manager: string;\n    weight: number;\n    eligibility?: string;\n}\n\n`;
tsOutput += `export interface MockLevel {\n    name: string;\n    position: number;\n    headline: string;\n    description: string;\n    assets: MockAsset[];\n}\n\n`;

for (const [key, value] of Object.entries(portfolios)) {
    tsOutput += `const ${key}: MockLevel[] = ${JSON.stringify(value, null, 4)};\n\n`;
}

tsOutput += `export const PORTFOLIO_LINES: Record<string, MockLevel[]> = {\n`;
tsOutput += `    "Geral Normal": GERAL_NORMAL,\n`;
tsOutput += `    "Geral Light": GERAL_LIGHT,\n`;
tsOutput += `    "IQ Normal": IQ_NORMAL,\n`;
tsOutput += `    "IQ Light": IQ_LIGHT\n`;
tsOutput += `};\n\n`;

tsOutput += `export const ASSET_METRICS: Record<string, { expectedReturn: number, volatility: number }> = ${JSON.stringify(metrics, null, 4)};\n`;

fs.writeFileSync('src/data/mockPortfolios.ts', tsOutput);
console.log("mockPortfolios.ts generated successfully!");
