import { HISTORICAL_DATA } from "@/data/historicalData";

function normalizeKey(str: string) {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

const mappedFunds: Record<string, number[]> = {};
HISTORICAL_DATA.funds.forEach(f => {
    mappedFunds[normalizeKey(f.name)] = f.values;
});

export const MONTHLY_RETURNS = {
    monthsLabels: HISTORICAL_DATA.months,
    macros: {
        cdi: HISTORICAL_DATA.cdi,
        ipca: HISTORICAL_DATA.ipca,
        ibov: HISTORICAL_DATA.ibov
    },
    funds: new Proxy(mappedFunds, {
        get(target, prop: string) {
            if (target[prop]) return target[prop];
            // Fuzzy search fallback if exact key doesn't match
            const key = normalizeKey(prop);
            if (target[key]) return target[key];
            const foundKey = Object.keys(target).find(k => k.includes(key) || key.includes(k));
            if (foundKey) return target[foundKey];
            return Array(HISTORICAL_DATA.months.length).fill(0);
        }
    })
};
