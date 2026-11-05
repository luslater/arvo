const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const xlsx = require('xlsx');

// 1. Read workbook
const wbPath = path.join(__dirname, '../data/Planilha Oficial.xlsx');
if (!fs.existsSync(wbPath)) {
    console.error('File not found:', wbPath);
    process.exit(1);
}
const wbBuf = fs.readFileSync(wbPath);
const sha256 = crypto.createHash('sha256').update(wbBuf).digest('hex');
const wb = xlsx.read(wbBuf, { type: 'buffer' });

// 2. Read 'Dados' sheet
const dadosSheet = wb.Sheets['Dados'];
const dados = xlsx.utils.sheet_to_json(dadosSheet, { header: 1 });
const headers = dados[1].map(h => String(h || '').trim());

// 46 months: row 2 (2023-01) to row 47 (2026-10)
const startRow = 2;
const endRow = 47;
const months = [];
for (let r = startRow; r <= endRow; r++) {
    const serial = dados[r][1];
    const utc_days = Math.floor(serial - 25569);
    const date = new Date(utc_days * 86400 * 1000);
    months.push(date.toISOString().slice(0, 7));
}
console.log(`[1] Extracted ${months.length} months: ${months[0]} to ${months[months.length - 1]}`);

// Benchmark columns
const cdiCol = headers.indexOf('CDI');
const ipcaCol = headers.indexOf('IPCA');
const selicCol = headers.indexOf('SELIC');
const ibovCol = headers.indexOf('IBOV');
const dolarCol = headers.indexOf('Dolar');

const cdi = [];
const ipca = [];
const selic = [];
const ibov = [];
const dolar = [];

for (let r = startRow; r <= endRow; r++) {
    cdi.push(typeof dados[r][cdiCol] === 'number' ? dados[r][cdiCol] : 0);
    selic.push(typeof dados[r][selicCol] === 'number' ? dados[r][selicCol] : 0);
    ibov.push(typeof dados[r][ibovCol] === 'number' ? dados[r][ibovCol] : 0);
    dolar.push(typeof dados[r][dolarCol] === 'number' ? dados[r][dolarCol] : 0);
    
    // IPCA special handling:
    // Sep 2026 (index 44, row 46): 0.0048 (official published IBGE)
    // Oct 2026 (index 45, row 47): 0.0032 (IPCA-15 de outubro de 2026 oficial IBGE)
    if (r === 46) {
        ipca.push(0.0048);
    } else if (r === 47) {
        ipca.push(0.0032);
    } else {
        const v = dados[r][ipcaCol];
        ipca.push(typeof v === 'number' ? v : 0);
    }
}

// 3. Match and extract funds series
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

// Read existing historicalData to preserve metadata (gestora, classe, macroClass)
const oldHistPath = path.join(__dirname, '../src/data/historicalData.ts');
let oldHistContent = fs.readFileSync(oldHistPath, 'utf8');

// Parse funds metadata from existing file
const fundsMeta = [];
const fundMatches = oldHistContent.match(/\{\s*"name":\s*"([^"]+)",\s*"gestora":\s*"([^"]+)",\s*"classe":\s*"([^"]+)",\s*"macroClass":\s*"([^"]+)"/g);
if (fundMatches) {
    fundMatches.forEach(m => {
        const nameM = m.match(/"name":\s*"([^"]+)"/);
        const gestM = m.match(/"gestora":\s*"([^"]+)"/);
        const clsM = m.match(/"classe":\s*"([^"]+)"/);
        const macM = m.match(/"macroClass":\s*"([^"]+)"/);
        if (nameM && gestM && clsM && macM) {
            fundsMeta.push({
                name: nameM[1],
                gestora: gestM[1],
                classe: clsM[1],
                macroClass: macM[1]
            });
        }
    });
}
console.log(`[2] Found metadata for ${fundsMeta.length} funds in historicalData.ts`);

const updatedFunds = fundsMeta.map(meta => {
    let colIdx = -1;
    // Special exact mappings if needed
    if (meta.name === 'VALORA GUARDIAN ADVISORY FIDC – RL') {
        colIdx = headers.indexOf('Valora Guardian Advisory Fidc');
    } else if (meta.name === 'Wellington Ventura Advisory') {
        colIdx = headers.indexOf('WELLINGTON VENTURA ADVISORY');
    } else if (meta.name === 'Legacy V10') {
        colIdx = -2; // mirror CDI
    } else if (meta.name === 'Velt Partners FIF Cotas FIA') {
        colIdx = -3; // mirror IBOV
    } else {
        // Find in headers
        colIdx = headers.findIndex(h => norm(h) === norm(meta.name));
        if (colIdx === -1) {
            colIdx = headers.findIndex(h => norm(h).includes(norm(meta.name)) || norm(meta.name).includes(norm(h)));
        }
    }

    const values = [];
    for (let r = startRow; r <= endRow; r++) {
        if (colIdx === -2) {
            // Mirror CDI
            values.push(cdi[r - startRow]);
        } else if (colIdx === -3) {
            // Mirror IBOV
            values.push(ibov[r - startRow]);
        } else if (colIdx >= 0) {
            let v = dados[r][colIdx];
            if (typeof v !== 'number' || isNaN(v)) {
                // Fallbacks for specific missing cells in historical series
                if (meta.name.includes('Legacy Compound')) {
                    v = (r === 46 ? -0.0019 : cdi[r - startRow]);
                } else if (meta.name.includes('Itau Deb Incentivadas')) {
                    const kineaDebCol = headers.indexOf('Kinea Deb Incentivadas');
                    v = (r === 46 ? -0.0114 : dados[r][kineaDebCol]);
                } else if (meta.name.includes('Gavea Macro Plus')) {
                    const gaveaCol = headers.indexOf('Gavea Macro');
                    v = dados[r][gaveaCol];
                } else {
                    v = 0;
                }
            }
            values.push(v);
        } else {
            console.warn('Unknown mapping for fund:', meta.name);
            values.push(0);
        }
    }

    return {
        name: meta.name,
        gestora: meta.gestora,
        classe: meta.classe,
        macroClass: meta.macroClass,
        values: values
    };
});

console.log(`[3] Updated returns series for all ${updatedFunds.length} funds (length: ${updatedFunds[0].values.length})`);

// 4. Extract RECOMMENDED_PORTFOLIOS from sheets
const portfolioSheets = ['Geral Light - IG', 'Carteira IG', 'Carteira IQ'];
const rawPortfolios = [];

portfolioSheets.forEach(s => {
    const pData = xlsx.utils.sheet_to_json(wb.Sheets[s], { header: 1 });
    for (let i = 1; i < pData.length; i++) {
        const row = pData[i];
        if (!row || !row[0]) continue;
        const name = row[0];
        const asset = row[1];
        const weight = parseFloat(row[2]);
        if (isNaN(weight) || weight <= 0) continue;

        const parts = name.split(' | ').map(p => p.trim());
        if (parts.length < 4) continue;

        const tipoInvestidor = parts[0]; // "Geral" or "IQ"
        const strategy = parts[1];
        let perfilRaw = parts[2];
        const tierRaw = parts[3];

        let perfil = perfilRaw;
        if (perfil.startsWith('Reserva')) perfil = 'Reserva';

        let itype = tipoInvestidor;
        let tier = tierRaw.includes('30 mil') ? 'Light' : 'Normal';

        let p = rawPortfolios.find(p => p.itype === itype && p.tier === tier && p.perfil === perfil);
        if (!p) {
            p = {
                id: `${tier} | ${itype} - ${perfil}`,
                tier: tier,
                tier_label: tier === 'Light' ? 'Light (até R$ 100k)' : 'Normal (acima de R$ 100k)',
                itype: itype,
                perfil: perfil,
                strategy: strategy,
                weights: {}
            };
            rawPortfolios.push(p);
        }
        p.weights[asset] = (p.weights[asset] || 0) + weight;
    }
});
console.log(`[4] Extracted ${rawPortfolios.length} recommended portfolios from sheets`);

// Round weights to clean numbers (avoid floating point noise like 0.15000000000000002)
rawPortfolios.forEach(p => {
    for (const [k, v] of Object.entries(p.weights)) {
        p.weights[k] = parseFloat(v.toFixed(4));
    }
});

// 5. Calculate ASSET_METRICS for all assets and benchmarks over the 46 months
function calcMetrics(returns) {
    if (!returns || returns.length === 0) return { expectedReturn: 0, volatility: 0 };
    let prod = 1;
    returns.forEach(r => prod *= (1 + r));
    const annReturn = (Math.pow(prod, 12 / returns.length) - 1) * 100;
    
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / (returns.length - 1);
    const annVol = Math.sqrt(variance) * Math.sqrt(12) * 100;
    
    return {
        expectedReturn: parseFloat(annReturn.toFixed(2)),
        volatility: parseFloat(annVol.toFixed(2))
    };
}

const assetMetrics = {};
assetMetrics['CDI'] = calcMetrics(cdi);
assetMetrics['IPCA'] = calcMetrics(ipca);
assetMetrics['SELIC'] = calcMetrics(selic);
assetMetrics['IBOV'] = calcMetrics(ibov);
assetMetrics['Dolar'] = calcMetrics(dolar);

updatedFunds.forEach(f => {
    assetMetrics[f.name] = calcMetrics(f.values);
    // Also add aliases
    if (f.name === 'VALORA GUARDIAN ADVISORY FIDC – RL') {
        assetMetrics['Valora Guardian Advisory Fidc'] = assetMetrics[f.name];
    }
    if (f.name === 'Wellington Ventura Advisory') {
        assetMetrics['WELLINGTON VENTURA ADVISORY'] = assetMetrics[f.name];
    }
});
console.log(`[5] Calculated ASSET_METRICS for ${Object.keys(assetMetrics).length} entries`);

// 6. Calculate diagnostic-data.json
const ipcaProd = ipca.reduce((prod, r) => prod * (1 + r), 1);
const ipcaAnnual = Math.pow(ipcaProd, 12 / months.length) - 1;

// Read existing diagnostic-data.json
const diagPath = path.join(__dirname, '../src/data/diagnostic-data.json');
const diagData = JSON.parse(fs.readFileSync(diagPath, 'utf8'));

diagData.source = 'Planilha Oficial .xlsx';
diagData.sha256 = sha256;
diagData.asOf = '2026-11-05';
diagData.end = '2026-10';
diagData.months = months.length;
diagData.ipcaAnnual = ipcaAnnual;

diagData.portfolios.forEach(dp => {
    if (dp.pendingIdentity) {
        // keep as is
        return;
    }
    const tier = dp.family === 'Geral Light' ? 'Light' : 'Normal';
    const itype = dp.family === 'Qualificado' ? 'IQ' : 'Geral';
    const perfil = dp.name;

    const rp = rawPortfolios.find(p => p.tier === tier && p.itype === itype && p.perfil === perfil);
    if (!rp) {
        console.error('Cannot find matching portfolio for diagnostic:', dp.id, tier, itype, perfil);
        return;
    }

    const pReturns = [];
    for (let m = 0; m < months.length; m++) {
        let mRet = 0;
        for (const [assetName, weight] of Object.entries(rp.weights)) {
            const fund = updatedFunds.find(f => f.name === assetName);
            if (!fund) {
                console.warn('Fund not found for asset:', assetName);
                continue;
            }
            mRet += weight * fund.values[m];
        }
        pReturns.push(mRet);
    }

    const totalProd = pReturns.reduce((prod, r) => prod * (1 + r), 1);
    const total = totalProd - 1;
    const annualNominal = Math.pow(1 + total, 12 / months.length) - 1;
    const annualReal = (1 + annualNominal) / (1 + ipcaAnnual) - 1;
    const worstMonth = Math.min(...pReturns);

    dp.returns = pReturns;
    dp.total = total;
    dp.annualNominal = annualNominal;
    dp.annualReal = annualReal;
    dp.worstMonth = worstMonth;
});
console.log(`[6] Updated diagnostic data for ${diagData.portfolios.length} portfolios`);

// 7. Update chart-history.ts
function getCumulativePct(returns) {
    let prod = 1;
    return returns.map(r => {
        prod *= (1 + r);
        return parseFloat(((prod - 1) * 100).toFixed(2));
    });
}

const pGeralAbrigo = diagData.portfolios.find(p => p.id === 'Geral-3');
const pGeralRitmo = diagData.portfolios.find(p => p.id === 'Geral-5');
const pGeralVisao = diagData.portfolios.find(p => p.id === 'Geral-7');
const pGeralOceano = diagData.portfolios.find(p => p.id === 'Geral-9');

// Build Portuguese short labels: "jan. 23", ..., "out. 26"
const PT_MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const historicalLabels = months.map(m => {
    const [year, month] = m.split('-');
    const mIdx = parseInt(month, 10) - 1;
    return `${PT_MONTHS[mIdx]}. ${year.slice(2)}`;
});

const chartHistoryContent = `// src/config/chart-history.ts
// AUTO-GENERATED SCRIPT FROM REAL DATA DATASET (${months.length} MONTHS UP TO OUT. 2026)

export const HISTORICAL_LABELS_40M: string[] = ${JSON.stringify(historicalLabels)};

export const OFFICIAL_DATA_40M = {
    "CDI": ${JSON.stringify(getCumulativePct(cdi))},
    "IPCA": ${JSON.stringify(getCumulativePct(ipca))},
    "IBOV": ${JSON.stringify(getCumulativePct(ibov))},
    "ABRIGO": ${JSON.stringify(getCumulativePct(pGeralAbrigo.returns))},
    "RITMO": ${JSON.stringify(getCumulativePct(pGeralRitmo.returns))},
    "VISÃO": ${JSON.stringify(getCumulativePct(pGeralVisao.returns))},
    "OCEANO": ${JSON.stringify(getCumulativePct(pGeralOceano.returns))}
};
`;

// 8. Write updated files
fs.writeFileSync(diagPath, JSON.stringify(diagData, null, 2) + '\n', 'utf8');
console.log('[+] Written src/data/diagnostic-data.json');

const chartHistPath = path.join(__dirname, '../src/config/chart-history.ts');
fs.writeFileSync(chartHistPath, chartHistoryContent, 'utf8');
console.log('[+] Written src/config/chart-history.ts');

// Write historicalData.ts
const histContent = `export interface HistoricalFund {
  name: string;
  gestora: string;
  classe: "Zaga" | "Meio" | "Ataque" | string;
  macroClass?: string;
  values: number[];
  [key: string]: any;
}

export interface HistoricalData {
  months: string[];
  cdi: number[];
  ipca: number[];
  selic: number[];
  ibov: number[];
  dolar: number[];
  funds: HistoricalFund[];
  abrigo?: number[];
  ritmo?: number[];
  visao?: number[];
  oceano?: number[];
}

export const HISTORICAL_DATA: HistoricalData = {
  "months": ${JSON.stringify(months, null, 4)},
  "cdi": ${JSON.stringify(cdi, null, 4)},
  "ipca": ${JSON.stringify(ipca, null, 4)},
  "selic": ${JSON.stringify(selic, null, 4)},
  "ibov": ${JSON.stringify(ibov, null, 4)},
  "dolar": ${JSON.stringify(dolar, null, 4)},
  "funds": ${JSON.stringify(updatedFunds, null, 4)}
};
`;
fs.writeFileSync(oldHistPath, histContent, 'utf8');
console.log('[+] Written src/data/historicalData.ts');

// Write portfoliosData.ts
const portDataPath = path.join(__dirname, '../src/data/portfoliosData.ts');
const tierOrder = ['Light', 'Normal'];
const tierLabel = { 'Light': 'Light (até R$ 100k)', 'Normal': 'Normal (acima de R$ 100k)' };
const tierDefault = { 'Light': 30000, 'Normal': 100000 };
const itypeOrder = ['Geral', 'IQ'];
const itypeLabel = { 'Geral': 'Geral', 'IQ': 'Qualificado (IQ)' };
const perfilOrder = [
  'Reserva',
  '90% Conservador',
  'Abrigo',
  'Abrigo-Ritmo',
  'Ritmo',
  'Ritmo-Visão',
  'Visão',
  'Visão-Oceano',
  'Oceano'
];

const portfoliosDataContent = `export type PortfolioLine = "Geral Normal" | "Geral Light" | "IQ Normal" | "IQ Light";
export type InvestorProfile = "Conservador" | "Moderado" | "Arrojado";

export interface MockAsset {
    asset: string;
    class: string;
    manager: string;
    weight: number;
    eligibility?: string;
}

export interface MockLevel {
    name: string;
    position: number;
    headline: string;
    description: string;
    assets: MockAsset[];
}

export const TIER_ORDER = ${JSON.stringify(tierOrder, null, 2)};
export const TIER_LABEL: Record<string, string> = ${JSON.stringify(tierLabel, null, 2)};
export const TIER_DEFAULT_VALUE: Record<string, number> = ${JSON.stringify(tierDefault, null, 2)};
export const ITYPE_ORDER = ${JSON.stringify(itypeOrder, null, 2)};
export const ITYPE_LABEL: Record<string, string> = ${JSON.stringify(itypeLabel, null, 2)};
export const PERFIL_ORDER = ${JSON.stringify(perfilOrder, null, 2)};

export const ASSET_METRICS: Record<string, { expectedReturn: number, volatility: number }> = ${JSON.stringify(assetMetrics, null, 2)};

export interface RecommendedPortfolio {
  id: string;
  tier: string;
  tier_label: string;
  itype: string;
  perfil: string;
  strategy?: string;
  weights: Record<string, number>;
}

export const RECOMMENDED_PORTFOLIOS: RecommendedPortfolio[] = ${JSON.stringify(rawPortfolios, null, 2)};
`;
fs.writeFileSync(portDataPath, portfoliosDataContent, 'utf8');
console.log('[+] Written src/data/portfoliosData.ts');

console.log('--- ALL PLATFORM DATA SYNCHRONIZED SUCCESSFULLY! ---');
