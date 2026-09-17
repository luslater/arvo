import data from '@/data/diagnostic-data.json';
// IPCA anual, IBGE: 2016–2025. Média aritmética arredondada a 2 casas percentuais.
// https://www.bcb.gov.br/controleinflacao/historicometas
// https://agenciadenoticias.ibge.gov.br/agencia-sala-de-imprensa/2013-agencia-de-noticias/releases/45612-ipca-vai-a-0-33-em-dezembro-e-fecha-o-ano-em-4-26
const annualIPCA = [6.29,2.95,3.75,4.31,4.52,10.06,5.79,4.62,4.83,4.26];
export const HISTORICAL_INFLATION = Math.round(annualIPCA.reduce((a,b)=>a+b,0)/annualIPCA.length*100)/10000;
// IGP-M anual 2016–2025, FGV IBRE; média aritmética, arredondada.
// https://portal.fgv.br/noticias/igp-m-avanca-ultimo-mes-ano
// https://portal.fgv.br/noticias/igp-m-registra-queda-pelo-2o-mes-consecutivo-mas-fecha-ano-alta-754
// https://portal.fgv.br/noticias/resultados-igp-m-2019
// https://portal.fgv.br/noticias/igpm-dezembro-2021
// https://portal.fgv.br/noticias/igp-m-resultados-2023
// https://portal.fgv.br/noticias/igp-m-2025
const annualIGPM = [7.17,-0.52,7.54,7.30,23.14,17.78,5.45,-3.18,6.54,-1.05];
export const HISTORICAL_IGPM = Math.round(annualIGPM.reduce((a,b)=>a+b,0)/annualIGPM.length*100)/10000;
export const PROFILES = ['Conservador','Moderado','Arrojado'] as const;
export type DiagnosticProfile = typeof PROFILES[number];
// Faixas limitadas pelos perfis de profile-calculator.ts: Abrigo (3), Ritmo (5), Visão (7).
// Comparação educativa da linha Geral; não determina elegibilidade nem recomenda investimento.
const LEVELS: Record<DiagnosticProfile, readonly number[]> = {Conservador:[1,2,3],Moderado:[4,5],Arrojado:[6,7]};
export function portfolioForProfile(profile:DiagnosticProfile){
 const candidates=data.portfolios.filter(p=>p.family==='Geral' && LEVELS[profile].includes(p.level) && !p.pendingIdentity && p.annualReal!==null);
 candidates.sort((a,b)=>b.annualReal!-a.annualReal! || a.level-b.level);
 if(!candidates.length)throw new Error('Perfil sem carteira validada');
 return candidates[0];
}
export function inflationDescription(rate:number){if(Math.abs(rate-HISTORICAL_IGPM)<1e-8)return 'Média histórica do IGP-M: 7,02% a.a. (2016–2025, média aritmética; FGV IBRE)';return Math.abs(rate-HISTORICAL_INFLATION)<1e-8?'Média histórica do IPCA: 5,14% a.a. (2016–2025, média aritmética)':'Inflação hipotética: '+(rate*100).toLocaleString('pt-BR')+'% a.a.';}
