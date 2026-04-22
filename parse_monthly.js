const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

function normalizeName(name) {
    if (!name) return "";
    return name.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "").replace(/[^a-z0-9]/g, "").trim();
}

const mapping = {
    "tesouroselic": "tesouro_selic",
    "arxfuji": "arx_fuji",
    "mapfrerf": "mapfre_rf",
    "bahiaamdi": "bahia_am",
    "valoraguardiana": "valora_guardian_a",
    "valoraguardianb": "valora_guardian_b",
    "valoraguardianii": "valora_guardian",
    "jgpcorporate": "jgp_corporate",
    "spxseahawk": "spx_seahawk",
    "bnprubi": "bnp_rubi",
    "augme30": "augme_30",
    "capitaniapremium45": "capitania_premium_45",
    "ibiunacredit": "ibiuna_credit",
    "spartakinea": "sparta_kinea",
    "kineadebincentivadas": "sparta_kinea",
    "augme180": "augme_180",
    "capitaniaradar90": "capitania_radar_90",
    "capitaniayield120": "capitania_yield_120",
    "jgpselectpremium": "jgp_select",
    "jenoaradar": "genoa_radar",
    "genoaradar": "genoa_radar",
    "legacycompound": "legacy_compound",
    "arxhedge": "arx_hedge",
    "itaudeb": "itau_deb",
    "trendpre": "trend_pre",
    "jgpeco": "jgp_eco",
    "btgcredito": "btg_credito",
    "kineaoportunidade": "kinea_oportunidade",
    "kineaoportunidadefif": "kinea_oportunidade_fif",
    "gaveamacro": "gavea_macro",
    "ibiunahedge": "ibiuna_hedge",
    "marabsoluto": "mar_absoluto",
    "verdex60": "verde_am_x60",
    "vistahedge": "vista_hedge",
    "dahliatotal": "dahlia_total",
    "encorelongbias": "encore_long_bias",
    "truxtlongbias": "truxt_long_bias",
    "kineaatlas": "kinea_atlas",
    "gaveamacroplus": "gavea_macro_plus",
    "kapitalozeta": "kapitalo_zeta",
    "kapitalokappa": "kapitalo_kappa",
    "spxnimitz": "spx_nimitz",
    "spxraptor": "spx_raptor",
    "legacyv10": "legacy_v10",
    "bogarivalue": "bogari_value",
    "brasilcapital": "brasil_capital",
    "hixcapital": "hix_capital",
    "realinvestor": "real_investor",
    "ipparticipacoes": "ip_participacoes",
    "spxfalcon": "spx_falcon",
    "atmosacoes": "atmos_acoes",
    "bogarivalueq": "bogari_value_q",
    "brasilcapinst": "brasil_cap_inst",
    "hixhs": "hix_hs",
    "dynamocougar": "dynamo_cougar",
    "forpusacoes": "forpus_acoes",
    "alaskablack": "alaska_black",
    "veltacoes": "velt_acoes",
    "blft11": "blft11",
    "fundodisimples": "di_simples"
};

function processExcel() {
    const filePath = "/Users/lucasdematos/Desktop/Dados 3 anos fundos.xlsx";
    if (!fs.existsSync(filePath)) {
        console.error("File not found:", filePath);
        process.exit(1);
    }
    const workbook = xlsx.readFile(filePath);
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 });

    const headers = data[1] || [];

    // Find how many rows have a Data (month/year) in column 1 (data[r][1])
    const numRows = data.length;
    let monthsLabels = [];
    let validRowIndices = [];

    for (let r = 2; r < numRows; r++) {
        if (data[r]) {
            const dateVal = data[r][1]; // '01/2023'
            if (dateVal && String(dateVal).includes('/')) {
                monthsLabels.push(String(dateVal));
                validRowIndices.push(r);
            }
        }
    }

    // Note: dates in excel seem to start from oldest? Or newest? 
    // "Row 2: [ 40, '01/2023', ... ]" -> oldest is row 2! Perfect!

    const finalBase = {
        monthsLabels,
        macros: { cdi: [], ipca: [], ibov: [] },
        funds: {}
    };

    // Prepare all funds with empty arrays
    for (const id of Object.values(mapping)) {
        finalBase.funds[id] = [];
    }

    for (let c = 2; c < headers.length; c++) {
        const name = String(headers[c] || "");
        const norm = normalizeName(name);

        let targetArr = null;

        if (norm === "cdi") {
            targetArr = finalBase.macros.cdi;
        } else if (norm === "ipca") {
            targetArr = finalBase.macros.ipca;
        } else if (norm === "ibov") {
            targetArr = finalBase.macros.ibov;
        } else {
            // Find in mapping
            for (const [key, id] of Object.entries(mapping)) {
                if (norm.includes(key)) {
                    targetArr = finalBase.funds[id];
                    break;
                }
            }
        }

        if (targetArr) {
            // Found a target to push this column's data into
            // Make sure we only push once if there are duplicates, or overwrite
            // Overwriting is fine since we do it column by column
            // We'll push freshly into a temp array and then assign it back to the proper place it belongs
            const colData = [];
            for (const r of validRowIndices) {
                const val = data[r][c];
                colData.push(typeof val === 'number' ? val : 0);
            }
            // Assign
            if (norm === "cdi") finalBase.macros.cdi = colData;
            else if (norm === "ipca") finalBase.macros.ipca = colData;
            else if (norm === "ibov") finalBase.macros.ibov = colData;
            else {
                for (const [key, id] of Object.entries(mapping)) {
                    if (norm.includes(key)) {
                        finalBase.funds[id] = colData;
                        break;
                    }
                }
            }
        }
    }

    // Default missing funds to 0s
    for (const id of Object.values(mapping)) {
        if (!finalBase.funds[id] || finalBase.funds[id].length === 0) {
            finalBase.funds[id] = Array(monthsLabels.length).fill(0);
        }
    }

    const tsContent = `// Auto-generated by parse_monthly.js
export const MONTHLY_RETURNS = ${JSON.stringify(finalBase, null, 2)};
`;

    fs.writeFileSync(path.join(__dirname, "src/config/funds-monthly.ts"), tsContent, "utf8");
    console.log("Successfully extracted monthly returns!");
}

processExcel();
