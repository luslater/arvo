import { HISTORICAL_DATA } from "./src/data/historicalData"
import { RECOMMENDED_PORTFOLIOS } from "./src/data/portfoliosData"

const getPort = (name: string) => RECOMMENDED_PORTFOLIOS.find(p => p.itype === "IQ" && p.perfil === name && p.tier === "Normal")

const pAbrigo = getPort("Abrigo")
console.log(pAbrigo?.weights)
