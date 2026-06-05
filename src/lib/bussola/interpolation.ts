

export type AssetStatus =
    | "Ativo na carteira"
    | "Próximo ativo a entrar"
    | "Saiu da carteira"
    | "Bloqueado pelo perfil"
    | "Fora da carteira"
    | "Ativo oficial da carteira";

export interface InterpolatedAsset {
    assetName: string;
    assetClass: string;
    manager: string;
    eligibility: string;
    weightA: number;
    weightB: number;
    rawWeight: number;
    applicableWeight: number;
    status: AssetStatus;
    movement?: string;
    movementClass?: string;
}

export function getRiskInterval(position: number, basePortfolios: any[]) {
    if (position <= 0) return { from: basePortfolios[0], to: basePortfolios[0], factorFrom: 1, factorTo: 0 };
    if (position >= 100) return { from: basePortfolios[basePortfolios.length - 1], to: basePortfolios[basePortfolios.length - 1], factorFrom: 1, factorTo: 0 };

    for (let i = 0; i < basePortfolios.length - 1; i++) {
        const current = basePortfolios[i];
        const next = basePortfolios[i + 1];

        if (position >= current.position && position <= next.position) {
            const factorTo = (position - current.position) / (next.position - current.position);
            const factorFrom = 1 - factorTo;

            return {
                from: current,
                to: next,
                factorFrom,
                factorTo,
            };
        }
    }
    
    // Fallback
    return { from: basePortfolios[0], to: basePortfolios[0], factorFrom: 1, factorTo: 0 };
}

export function interpolatePortfolio(
    assetsA: any[],
    assetsB: any[],
    factorA: number,
    factorB: number
): InterpolatedAsset[] {
    const assetMap = new Map<string, InterpolatedAsset>();

    for (const asset of assetsA) {
        assetMap.set(asset.asset, {
            assetName: asset.asset,
            assetClass: asset.class,
            manager: asset.manager,
            eligibility: asset.eligibility,
            weightA: asset.weight,
            weightB: 0,
            rawWeight: 0,
            applicableWeight: 0,
            status: "Fora da carteira"
        });
    }

    for (const asset of assetsB) {
        if (assetMap.has(asset.asset)) {
            const existing = assetMap.get(asset.asset)!;
            existing.weightB = asset.weight;
        } else {
            assetMap.set(asset.asset, {
                assetName: asset.asset,
                assetClass: asset.class,
                manager: asset.manager,
                eligibility: asset.eligibility,
                weightA: 0,
                weightB: asset.weight,
                rawWeight: 0,
                applicableWeight: 0,
                status: "Fora da carteira"
            });
        }
    }

    return Array.from(assetMap.values()).map(asset => ({
        ...asset,
        rawWeight: asset.weightA * factorA + asset.weightB * factorB
    }));
}

export function applyMinimumThreshold(
    assets: InterpolatedAsset[],
    threshold: number = 3,
    isOfficial: boolean = false
): InterpolatedAsset[] {
    const applicableAssets = assets.filter(asset => asset.rawWeight >= threshold);
    const totalApplicableWeight = applicableAssets.reduce((sum, asset) => sum + asset.rawWeight, 0);

    return assets.map(asset => {
        let newStatus: AssetStatus = "Fora da carteira";
        let applicableWeight = 0;

        if (asset.rawWeight >= threshold) {
            applicableWeight = (asset.rawWeight / totalApplicableWeight) * 100;
            newStatus = isOfficial ? "Ativo oficial da carteira" : "Ativo na carteira";
        } else if (asset.rawWeight > 0 && asset.rawWeight < threshold) {
            applicableWeight = 0;
            newStatus = "Próximo ativo a entrar";
        } else {
            applicableWeight = 0;
            newStatus = "Fora da carteira";
        }

        // Add movement info comparing with weightA
        let movement = "Estável";
        let movementClass = "flat";
        
        // Ensure rounding for comparison to avoid floating point issues
        const diff = Math.round(applicableWeight) - Math.round(asset.weightA);

        if (asset.weightA === 0 && applicableWeight > 0) {
            movement = "Novo";
            movementClass = "new";
        } else if (diff > 0) {
            movement = `+${diff} p.p.`;
            movementClass = "up";
        } else if (diff < 0) {
            movement = `${diff} p.p.`;
            movementClass = "down";
        }

        return {
            ...asset,
            applicableWeight,
            status: newStatus,
            movement,
            movementClass
        };
    }).sort((a, b) => b.applicableWeight - a.applicableWeight);
}
