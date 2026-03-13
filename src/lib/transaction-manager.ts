import { Transaction, TransactionType, TransactionStatus, TransactionAllocation } from "./transaction-types"
import { UserAsset } from "./asset-types"

const TRANSACTIONS_KEY = "transactions"
const USER_ASSETS_KEY = "userAssets"

export function createTransaction(
    type: TransactionType,
    amount: number,
    recommendedAllocations: TransactionAllocation[]
): Transaction {
    const transaction: Transaction = {
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        amount,
        status: "PENDING",
        createdAt: new Date().toISOString(),
        recommendedAllocations,
    }

    // Save to localStorage
    const transactions = getTransactionHistory()
    transactions.unshift(transaction)
    if (typeof window !== "undefined") {
        localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions))
    }

    return transaction
}

export function confirmTransaction(
    transactionId: string,
    followedRecommendation: boolean,
    actualAllocations?: TransactionAllocation[],
    notes?: string
): Transaction | null {
    const transactions = getTransactionHistory()
    const transaction = transactions.find(t => t.id === transactionId)

    if (!transaction) return null

    transaction.status = "CONFIRMED"
    transaction.confirmedAt = new Date().toISOString()
    transaction.followedRecommendation = followedRecommendation
    transaction.actualAllocations = actualAllocations || transaction.recommendedAllocations
    transaction.notes = notes

    // Update localStorage
    if (typeof window !== "undefined") {
        localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions))
    }

    // Apply transaction to portfolio
    applyTransactionToPortfolio(transaction)

    return transaction
}

export function cancelTransaction(transactionId: string): Transaction | null {
    const transactions = getTransactionHistory()
    const transaction = transactions.find(t => t.id === transactionId)

    if (!transaction) return null

    transaction.status = "CANCELLED"

    // Update localStorage
    if (typeof window !== "undefined") {
        localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions))
    }

    return transaction
}

export function getTransactionHistory(limit?: number): Transaction[] {
    if (typeof window === "undefined") return []

    const transactionsStr = localStorage.getItem(TRANSACTIONS_KEY)
    if (!transactionsStr) return []

    const transactions: Transaction[] = JSON.parse(transactionsStr)

    if (limit) {
        return transactions.slice(0, limit)
    }

    return transactions
}

export function applyTransactionToPortfolio(transaction: Transaction): void {
    if (typeof window === "undefined") return
    if (transaction.status !== "CONFIRMED") return
    if (!transaction.actualAllocations) return

    // Load current assets
    const assetsStr = localStorage.getItem(USER_ASSETS_KEY)
    const currentAssets: UserAsset[] = assetsStr ? JSON.parse(assetsStr) : []

    // Load current saldo (stored in centavos)
    const currentSaldo = Number(localStorage.getItem("saldo") || "0")

    // Apply allocation changes to assets
    const updatedAssets: UserAsset[] = [...currentAssets]

    transaction.actualAllocations.forEach(allocation => {
        const existingAsset = updatedAssets.find(a => a.name === allocation.fundName)

        if (transaction.type === "INVEST") {
            // Add to existing or create new
            if (existingAsset) {
                existingAsset.value += allocation.amount
            } else {
                updatedAssets.push({
                    name: allocation.fundName,
                    type: "fundo_aberto",
                    quantity: 1,
                    value: allocation.amount,
                    indexador: "Pós-fixado",
                    rentabilidade: 12,
                    prazo: "Indeterminado"
                })
            }
        } else {
            // REDEEM - subtract from existing
            if (existingAsset) {
                existingAsset.value -= allocation.amount
                // Remove if value is now 0 or negative
                if (existingAsset.value <= 0) {
                    const index = updatedAssets.indexOf(existingAsset)
                    updatedAssets.splice(index, 1)
                }
            }
        }
    })

    // Filter out assets with 0 or negative value
    const filteredAssets = updatedAssets.filter(a => a.value > 0)

    // Update saldo based on transaction type
    let newSaldo = currentSaldo
    if (transaction.type === "INVEST") {
        // INVEST = money coming from outside the system, only increases assets
        // Don't change saldo - the money goes directly to investments
        newSaldo = currentSaldo
    } else {
        // REDEEM = money leaves the system (client will use it)
        // Don't change saldo - the money is withdrawn from the platform
        newSaldo = currentSaldo
    }

    // Save updated assets and saldo
    localStorage.setItem(USER_ASSETS_KEY, JSON.stringify(filteredAssets))
    localStorage.setItem("saldo", newSaldo.toString())
}

export function getTotalInvested(): number {
    const transactions = getTransactionHistory()
    return transactions
        .filter(t => t.status === "CONFIRMED" && t.type === "INVEST")
        .reduce((sum, t) => sum + t.amount, 0)
}

export function getTotalRedeemed(): number {
    const transactions = getTransactionHistory()
    return transactions
        .filter(t => t.status === "CONFIRMED" && t.type === "REDEEM")
        .reduce((sum, t) => sum + t.amount, 0)
}
