// CDI Historical Data (Monthly % - Acumulado)
// Source: User provided data from 1999-2024

export const CDI_DATA = {
    // 2024 (Jan-Dez)
    2024: [0.97, 1.92, 2.75, 3.64, 4.47, 5.26, 6.17, 7.04, 7.88, 8.81, 9.60, 10.53],

    // 2023
    2023: [1.01, 2.00, 3.06, 4.20, 5.34, 6.45, 7.73, 8.89, 10.05, 11.27, 12.55, 13.88],

    // 2022
    2022: [0.73, 1.49, 2.42, 3.34, 4.37, 5.44, 6.51, 7.65, 8.62, 9.64, 10.66, 11.78],

    // 2021
    2021: [0.15, 0.28, 0.30, 0.51, 0.78, 1.09, 1.47, 1.90, 2.34, 2.83, 3.38, 4.15],

    // 2020
    2020: [0.38, 0.67, 0.96, 1.24, 1.48, 1.69, 1.88, 2.04, 2.20, 2.36, 2.51, 2.76],
}

// IPCA Historical Data (Monthly % - Acumulado)
// Source: User provided data from 2012-2024

export const IPCA_DATA = {
    // 2024 (Jan-Dez)
    2024: [0.42, 0.83, 0.16, 0.38, 0.46, 0.21, 0.38, -0.02, 0.44, 0.56, 0.39, 0.52],

    // 2023
    2023: [0.53, 0.84, 0.71, 0.61, 0.23, 0.00, 0.12, 0.23, 0.26, 0.24, 0.28, 0.56],

    // 2022
    2022: [0.54, 1.01, 1.62, 1.06, 0.47, 0.67, -0.68, -0.36, -0.29, 0.59, 0.41, 0.62],

    // 2021
    2021: [0.25, 0.86, 0.93, 0.31, 0.83, 0.53, 0.96, 0.87, 1.16, 1.25, 0.95, 0.73],

    // 2020
    2020: [0.21, 0.25, 0.07, -0.31, -0.38, 0.26, 0.36, 0.24, 0.64, 0.86, 0.89, 1.35],

    // 2019
    2019: [0.32, 0.43, 0.75, 0.57, 0.13, 0.01, 0.19, 0.11, -0.04, 0.10, 0.51, 1.15],

    // 2018
    2018: [0.29, 0.32, 0.09, 0.22, 0.40, 1.26, 0.33, -0.09, 0.48, 0.45, -0.21, 0.15],

    // 2017
    2017: [0.38, 0.33, 0.25, 0.14, 0.31, -0.23, 0.24, 0.19, 0.16, 0.42, 0.28, 0.44],

    // 2016
    2016: [1.27, 0.90, 0.43, 0.61, 0.78, 0.35, 0.52, 0.44, 0.08, 0.26, 0.18, 0.30],

    // 2015
    2015: [1.24, 1.22, 1.32, 0.71, 0.74, 0.79, 0.62, 0.22, 0.54, 0.82, 1.01, 0.96],

    // 2014
    2014: [0.55, 0.69, 0.92, 0.67, 0.46, 0.40, 0.01, 0.25, 0.57, 0.42, 0.51, 0.78],

    // 2013
    2013: [0.86, 0.60, 0.47, 0.55, 0.37, 0.26, 0.03, 0.24, 0.35, 0.57, 0.54, 0.92],

    // 2012
    2012: [0.56, 0.45, 0.21, 0.64, 0.36, 0.08, 0.43, 0.41, 0.57, 0.59, 0.60, 0.79],
}

// Latest 12-month returns
export const CDI_LAST_12M = 10.88 // 2024 acumulado
export const IPCA_LAST_12M = 4.83 // 2024 acumulado

// Function to get CDI for specific period
export function getCDIReturn(year: number, months: number = 12): number {
    const yearData = CDI_DATA[year as keyof typeof CDI_DATA]
    if (!yearData) return 0
    return yearData[Math.min(months - 1, 11)]
}

// Function to get IPCA for specific period
export function getIPCAReturn(year: number, months: number = 12): number {
    const yearData = IPCA_DATA[year as keyof typeof IPCA_DATA]
    if (!yearData) return 0
    return yearData[Math.min(months - 1, 11)]
}

// Calculate real return (above inflation)
export function calculateRealReturn(nominalReturn: number, inflation: number): number {
    return ((1 + nominalReturn / 100) / (1 + inflation / 100) - 1) * 100
}
