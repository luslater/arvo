"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CurrencyInput } from "@/components/ui/currency-input"
import { calculateRebalancing, RebalancingRecommendation } from "@/lib/rebalancing"
import { UserAsset } from "@/lib/asset-types"
import { PortfolioType } from "@/lib/portfolio-allocations"
import { ArrowRight, TrendingUp, TrendingDown, Wallet, Sparkles } from "lucide-react"
import { createTransaction } from "@/lib/transaction-manager"
import { Transaction } from "@/lib/transaction-types"
import { TransactionConfirmationModal } from "@/components/transaction-confirmation-modal"

interface ContributionModalProps {
    userAssets: UserAsset[]
    userProfile: PortfolioType
    className?: string
    onTransactionComplete?: () => void
}

export function ContributionModal({ userAssets, userProfile, className, onTransactionComplete }: ContributionModalProps) {
    const [open, setOpen] = useState(false)
    const [amount, setAmount] = useState(0)
    const [type, setType] = useState<"INVEST" | "REDEEM">("INVEST")
    const [recommendations, setRecommendations] = useState<RebalancingRecommendation[]>([])
    const [pendingTransaction, setPendingTransaction] = useState<Transaction | null>(null)
    const [showConfirmation, setShowConfirmation] = useState(false)

    useEffect(() => {
        if (amount > 0) {
            const recs = calculateRebalancing(userAssets, userProfile, amount, type)
            setRecommendations(recs)
        } else {
            setRecommendations([])
        }
    }, [amount, type, userAssets, userProfile])

    const handleProceed = () => {
        if (amount <= 0 || recommendations.length === 0) return

        // Create transaction
        const transaction = createTransaction(
            type,
            amount,
            recommendations.map(r => ({
                fundName: r.fundName,
                amount: r.amount,
                percentage: r.percentage
            }))
        )

        setPendingTransaction(transaction)
        setOpen(false)
        setShowConfirmation(true)
    }

    const handleConfirmationClose = () => {
        setShowConfirmation(false)
        setPendingTransaction(null)
        setAmount(0)
        setRecommendations([])
    }

    const handleConfirmed = () => {
        // Call parent callback to refresh data
        onTransactionComplete?.()
        handleConfirmationClose()
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className={className}>
                        <Wallet className="mr-2 h-4 w-4" />
                        💰 Investir / Sacar
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-light text-center">
                            {type === "INVEST" ? "💰 Investir Mais" : "🏦 Sacar Dinheiro"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Type Selector */}
                        <div className="flex p-1 bg-gray-100 rounded-lg">
                            <button
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${type === "INVEST" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-900"}`}
                                onClick={() => setType("INVEST")}
                            >
                                💰 Investir
                            </button>
                            <button
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${type === "REDEEM" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-900"}`}
                                onClick={() => setType("REDEEM")}
                            >
                                🏦 Sacar
                            </button>
                        </div>

                        {/* Amount Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                {type === "INVEST" ? "Quanto você quer investir?" : "Quanto você precisa sacar?"}
                            </label>
                            <CurrencyInput
                                value={amount}
                                onChange={setAmount}
                                placeholder="R$ 0,00"
                                className="w-full px-4 py-4 text-2xl font-light text-center border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            />
                        </div>

                        {/* Recommendations */}
                        {recommendations.length > 0 ? (
                            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {type === "REDEEM" && (
                                    <div className="p-3 bg-amber-50 text-amber-800 text-sm rounded-lg border border-amber-200 mb-4">
                                        <strong>Atenção:</strong> O valor será retirado dos fundos listados abaixo para manter o equilíbrio da sua carteira.
                                    </div>
                                )}

                                {type === "INVEST" && (
                                    <div className="p-3 bg-blue-50 text-blue-800 text-sm rounded-lg border border-blue-200 mb-4 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4" />
                                        <span><strong>Parabéns!</strong> Seus objetivos estão cada vez mais próximos!</span>
                                    </div>
                                )}

                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                    {type === "INVEST" ? "💡 Onde investir" : "📤 De onde sacar"}
                                </h3>

                                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                                    {recommendations.map((rec, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${type === "INVEST" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                    {type === "INVEST" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm text-gray-900">{rec.fundName}</p>
                                                    <p className="text-xs text-gray-500">
                                                        Meta: {rec.percentage}%
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-semibold ${type === "INVEST" ? "text-green-700" : "text-red-700"}`}>
                                                    {type === "INVEST" ? "+" : "-"} {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(rec.amount)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-3 bg-blue-50 text-blue-700 text-sm rounded-lg">
                                    💡 {type === "INVEST" ? "Esta distribuição mantém sua carteira equilibrada conforme seu perfil." : "Estes resgates priorizam os ativos que estão acima da meta."}
                                </div>

                                {/* Proceed Button */}
                                <Button
                                    onClick={handleProceed}
                                    className="w-full bg-gray-900 text-white hover:bg-gray-800"
                                >
                                    Continuar
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            amount > 0 && (
                                <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                                    {type === "REDEEM"
                                        ? "Não há saldo suficiente ou ativos disponíveis para este resgate."
                                        : "Digite um valor para ver a recomendação."}
                                </div>
                            )
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Confirmation Modal */}
            <TransactionConfirmationModal
                transaction={pendingTransaction}
                isOpen={showConfirmation}
                onClose={handleConfirmationClose}
                onConfirm={handleConfirmed}
            />
        </>
    )
}
