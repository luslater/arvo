"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Transaction, TransactionAllocation } from "@/lib/transaction-types"
import { confirmTransaction } from "@/lib/transaction-manager"
import { Check, X, Edit3 } from "lucide-react"
import { CurrencyInput } from "@/components/ui/currency-input"

interface TransactionConfirmationModalProps {
    transaction: Transaction | null
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
}

export function TransactionConfirmationModal({
    transaction,
    isOpen,
    onClose,
    onConfirm
}: TransactionConfirmationModalProps) {
    const [followedRecommendation, setFollowedRecommendation] = useState<boolean | null>(null)
    const [customAllocations, setCustomAllocations] = useState<TransactionAllocation[]>([])
    const [isCustomizing, setIsCustomizing] = useState(false)

    if (!transaction) return null

    const handleConfirm = () => {
        if (followedRecommendation === null) return

        const allocationsToApply = followedRecommendation
            ? transaction.recommendedAllocations
            : customAllocations

        confirmTransaction(
            transaction.id,
            followedRecommendation,
            allocationsToApply
        )

        onConfirm()
        onClose()

        // Reset state
        setFollowedRecommendation(null)
        setIsCustomizing(false)
    }

    const handleSelectYes = () => {
        setFollowedRecommendation(true)
        setIsCustomizing(false)
    }

    const handleSelectNo = () => {
        setFollowedRecommendation(false)
        setIsCustomizing(true)
        // Initialize custom allocations with recommended ones as template
        setCustomAllocations(transaction.recommendedAllocations.map(a => ({ ...a })))
    }

    const updateCustomAllocation = (index: number, newAmount: number) => {
        const updated = [...customAllocations]
        updated[index] = {
            ...updated[index],
            amount: newAmount
        }
        setCustomAllocations(updated)
    }

    const addCustomAllocation = () => {
        setCustomAllocations([
            ...customAllocations,
            {
                fundName: "",
                amount: 0,
                percentage: 0
            }
        ])
    }

    const totalCustom = customAllocations.reduce((sum, a) => sum + a.amount, 0)
    const isValidCustom = Math.abs(totalCustom - transaction.amount) < 1 // Allow 1 BRL tolerance

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] bg-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-light text-center">
                        ✅ Confirmar {transaction.type === "INVEST" ? "Aporte" : "Resgate"}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Question */}
                    <div className="text-center space-y-2">
                        <p className="text-lg font-medium">
                            Você seguiu a recomendação?
                        </p>
                        <p className="text-sm text-gray-500">
                            Isso nos ajuda a manter sua carteira atualizada
                        </p>
                    </div>

                    {/* Yes/No Buttons */}
                    {followedRecommendation === null && (
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={handleSelectYes}
                                className="p-6 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group"
                            >
                                <Check className="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-green-600" />
                                <p className="font-medium">Sim, segui!</p>
                                <p className="text-xs text-gray-500 mt-1">Aplicar recomendações</p>
                            </button>
                            <button
                                onClick={handleSelectNo}
                                className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                            >
                                <Edit3 className="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-blue-600" />
                                <p className="font-medium">Não, fiz diferente</p>
                                <p className="text-xs text-gray-500 mt-1">Informar alocação</p>
                            </button>
                        </div>
                    )}

                    {/* Yes - Show recommended allocations */}
                    {followedRecommendation === true && (
                        <div className="space-y-3">
                            <div className="p-4 bg-green-50 text-green-800 rounded-lg border border-green-200">
                                <p className="font-medium">🎉 Ótimo! Vamos atualizar sua carteira</p>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700">Alocações aplicadas:</p>
                                {transaction.recommendedAllocations.map((allocation, index) => (
                                    <div key={index} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm">{allocation.fundName}</span>
                                        <span className="text-sm font-semibold">
                                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(allocation.amount)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* No - Custom allocation input */}
                    {followedRecommendation === false && isCustomizing && (
                        <div className="space-y-3">
                            <div className="p-4 bg-blue-50 text-blue-800 rounded-lg border border-blue-200">
                                <p className="font-medium">📝 Informe onde você aplicou</p>
                                <p className="text-sm mt-1">
                                    Total: {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(transaction.amount)}
                                </p>
                            </div>

                            <div className="space-y-2">
                                {customAllocations.map((allocation, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Nome do fundo"
                                            value={allocation.fundName}
                                            onChange={(e) => {
                                                const updated = [...customAllocations]
                                                updated[index].fundName = e.target.value
                                                setCustomAllocations(updated)
                                            }}
                                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg"
                                        />
                                        <CurrencyInput
                                            value={allocation.amount}
                                            onChange={(value) => updateCustomAllocation(index, value)}
                                            className="w-40 px-3 py-2 border border-gray-200 rounded-lg"
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center">
                                <button
                                    onClick={addCustomAllocation}
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    + Adicionar fundo
                                </button>
                                {!isValidCustom && (
                                    <p className="text-sm text-red-600">
                                        Total não bate: {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalCustom)}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    {followedRecommendation !== null && (
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setFollowedRecommendation(null)
                                    setIsCustomizing(false)
                                }}
                                className="flex-1"
                            >
                                Voltar
                            </Button>
                            <Button
                                onClick={handleConfirm}
                                disabled={followedRecommendation === false && !isValidCustom}
                                className="flex-1 bg-gray-900 text-white hover:bg-gray-800"
                            >
                                Confirmar
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
