const fs = require('fs');
const xlsx = require('xlsx');

const wb = xlsx.readFile('/Users/lucasdematos/Desktop/Planilha Oficial .xlsx');
const sheets = ['Geral Light - IG', 'Carteira IG', 'Carteira IQ'];

const portfolios = [];

sheets.forEach(s => {
    const data = xlsx.utils.sheet_to_json(wb.Sheets[s], {header: 1});
    // Skip header
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (!row || !row[0]) continue;
        
        const name = row[0];
        const asset = row[1];
        const weight = parseFloat(row[2]);
        if (isNaN(weight) || weight <= 0) continue;
        
        const parts = name.split(' | ').map(p => p.trim());
        if (parts.length < 4) continue;
        
        const tipoInvestidor = parts[0]; // "Geral" or "IQ"
        const strategy = parts[1]; // "Máximo Histórico" or "Robustez 360"
        let perfilRaw = parts[2];
        const tierRaw = parts[3]; // "R$30 mil" or "R$100 mil"
        
        let perfil = perfilRaw;
        if (perfil.startsWith("Reserva")) perfil = "Reserva";
        
        let itype = tipoInvestidor;
        let tier = tierRaw === 'R$30 mil' ? 'Light' : 'Normal';
        
        // Find existing portfolio
        let p = portfolios.find(p => p.itype === itype && p.tier === tier && p.perfil === perfil);
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
            portfolios.push(p);
        }
        
        p.weights[asset] = (p.weights[asset] || 0) + weight;
    }
});

const tierOrder = ['Light', 'Normal'];
const tierLabel = {'Light': 'Light (até R$ 100k)', 'Normal': 'Normal (acima de R$ 100k)'};
const tierDefault = {'Light': 30000, 'Normal': 100000};
const itypeOrder = ['Geral', 'IQ'];
const itypeLabel = {'Geral': 'Geral', 'IQ': 'Qualificado (IQ)'};
const perfilOrder = ['Reserva', '90% Conservador', 'Abrigo', 'Abrigo-Ritmo', 'Ritmo', 'Ritmo-Visão', 'Visão', 'Visão-Oceano', 'Oceano'];

let code = fs.readFileSync('src/data/portfoliosData.ts', 'utf8');

// Replace everything from export const TIER_ORDER to the end
const replaceStart = "export const TIER_ORDER";
const idx = code.indexOf(replaceStart);
if (idx > -1) {
    code = code.substring(0, idx);
}

let newContent = `export const TIER_ORDER = ${JSON.stringify(tierOrder)};
export const TIER_LABEL: Record<string, string> = ${JSON.stringify(tierLabel)};
export const TIER_DEFAULT_VALUE: Record<string, number> = ${JSON.stringify(tierDefault)};
export const ITYPE_ORDER = ${JSON.stringify(itypeOrder)};
export const ITYPE_LABEL: Record<string, string> = ${JSON.stringify(itypeLabel)};
export const PERFIL_ORDER = ${JSON.stringify(perfilOrder)};

export interface RecommendedPortfolio {
  id: string;
  tier: string;
  tier_label: string;
  itype: string;
  perfil: string;
  strategy?: string;
  weights: Record<string, number>;
}

export const RECOMMENDED_PORTFOLIOS: RecommendedPortfolio[] = ${JSON.stringify(portfolios)};
`;

fs.writeFileSync('src/data/portfoliosData.ts', code + newContent);
console.log("Updated portfoliosData.ts with", portfolios.length, "portfolios.");
