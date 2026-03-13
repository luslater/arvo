export type TransactionType = "INVEST" | "REDEEM"
export type TransactionStatus = "PENDING" | "CONFIRMED" | "CANCELLED"

export interface TransactionAllocation {
    fundName: string
    amount: number
    percentage: number // Target percentage from portfolio
}

export interface Transaction {
    id: string
    type: TransactionType
    amount: number
    status: TransactionStatus
    createdAt: string
    confirmedAt?: string

    // Recommended allocations from the rebalancing algorithm
    recommendedAllocations: TransactionAllocation[]

    // Actual allocations (filled after user confirms)
    actualAllocations?: TransactionAllocation[]

    // Did user follow the recommendation?
    followedRecommendation?: boolean

    // User notes
    notes?: string
}
