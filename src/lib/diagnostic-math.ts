export type Inputs = { initial: number; monthly: number; income: number; inflation: number; indexed: boolean; withdrawal: number };
export const DEFAULT_INPUTS: Inputs = {initial:50000,monthly:2000,income:5000,inflation:.04,indexed:true,withdrawal:.04};
export function project(input: Inputs, realRate: number, years=60) {
  const rate = Math.pow(1+realRate,1/12)-1;
  const target = input.income*12/input.withdrawal;
  let balance=input.initial, contributed=input.initial;
  let months: number|null=balance>=target ? 0 : null;
  const points=[{year:0,real:balance,nominal:balance,contributed}];
  for(let m=1;m<=years*12;m++){
    const inflationFactor=Math.pow(1+input.inflation,m/12);
    const payment=input.indexed ? input.monthly : input.monthly/inflationFactor;
    balance=balance*(1+rate)+payment; contributed+=payment;
    if(months===null&&balance>=target)months=m;
    if(m%12===0)points.push({year:m/12,real:balance,nominal:balance*inflationFactor,contributed});
  }
  return {target,months,points};
}
export const money = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
export const formatBRLNumber = (n: number) =>
  (n || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export function parseBRLNumber(raw: string): number {
  const clean = raw.trim().replace(/[^\d,\.]/g, '');
  if (!clean) return 0;
  if (clean.includes(',')) {
    const parts = clean.split(',');
    const intPart = parts[0].replace(/\./g, '');
    const decPart = parts.slice(1).join('').slice(0, 2);
    return parseFloat(`${intPart}.${decPart}`) || 0;
  }
  const withoutDots = clean.replace(/\./g, '');
  return parseFloat(withoutDots) || 0;
}
export const pct = (n: number) => new Intl.NumberFormat('pt-BR', { style: 'percent', maximumFractionDigits: 2 }).format(n);
export function duration(months: number | null) {
  if (months === null) return 'Além de 60 anos';
  if (months === 0) return 'Meta já alcançada';
  const years = Math.floor(months / 12), rest = months % 12;
  return [years ? `${years} ${years === 1 ? 'ano' : 'anos'}` : '', rest ? `${rest} ${rest === 1 ? 'mês' : 'meses'}` : ''].filter(Boolean).join(' e ');
}
