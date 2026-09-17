import { HISTORICAL_DATA } from "@/data/historicalData";

function normalizeKey(str: string) {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function normalizeId(str: string) {
    return str.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
}

const mappedFunds: Record<string, number[]> = {};
HISTORICAL_DATA.funds.forEach(f => {
    mappedFunds[normalizeKey(f.name)] = f.values;
    mappedFunds[normalizeId(f.name)] = f.values;
    mappedFunds[f.name] = f.values;
});

// Legacy aliases mapping
if (mappedFunds["tesouro_selic_fundo_simples"]) {
    mappedFunds["tesouro_selic"] = mappedFunds["tesouro_selic_fundo_simples"];
    mappedFunds["di_simples"] = mappedFunds["tesouro_selic_fundo_simples"];
}
if (mappedFunds["valora_guardian_advisory_fidc_rl"]) {
    mappedFunds["valora_guardian"] = mappedFunds["valora_guardian_advisory_fidc_rl"];
    mappedFunds["valora_guardian_a"] = mappedFunds["valora_guardian_advisory_fidc_rl"];
    mappedFunds["valora_guardian_b"] = mappedFunds["valora_guardian_advisory_fidc_rl"];
}
if (mappedFunds["sparta_deb_inc_fic_incentivados"]) {
    mappedFunds["sparta_kinea"] = mappedFunds["sparta_deb_inc_fic_incentivados"];
}
if (mappedFunds["trend_pre_fixado"]) {
    mappedFunds["trend_pre"] = mappedFunds["trend_pre_fixado"];
}
if (mappedFunds["hix_capital_hs_fia"]) {
    mappedFunds["hix_hs"] = mappedFunds["hix_capital_hs_fia"];
}

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
            // Normalize ID fallback
            const id = normalizeId(prop);
            if (target[id]) return target[id];
            // Normalized Key fallback
            const key = normalizeKey(prop);
            if (target[key]) return target[key];
            // Substring search
            const foundKey = Object.keys(target).find(k => k.includes(key) || key.includes(k));
            if (foundKey) return target[foundKey];
            return Array(HISTORICAL_DATA.months.length).fill(0);
        }
    })
};
