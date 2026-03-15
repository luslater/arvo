"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { CurrencyInput } from "@/components/ui/currency-input"
import { ArrowRight } from "lucide-react"

export default function NewPortfolioPage() {
    const router = useRouter()
    const [capital, setCapital] = useState(0)
    const [emergencyFund, setEmergencyFund] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    saldo: capital, // Starting capital as saldo
                    emergencyFund: emergencyFund,
                    totalCarteira: 0
                })
            })

            // Get saved profile from local storage placeholder or default to RITMO
            const profile = localStorage.getItem("userProfile") || "RITMO"
            router.push(`/portfolio/${profile.toLowerCase()}`)
        } catch (error) {
            console.error(error)
            setIsLoading(false)
        }
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value)
    }

    const isValid = capital >= 100 && emergencyFund >= 0

    return (
        <div className="min-h-screen flex items-center justify-center bg-white  p-4">
            <ThemeToggle />

            <Card className="w-full max-w-lg border-gray-200 /10">
                <CardHeader>
                    <CardTitle className="text-2xl font-light">Configure Sua Carteira</CardTitle>
                    <CardDescription>
                        Informe os valores para começarmos sua estratégia de investimento
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="capital" className="text-sm font-medium">
                                Capital para Investir
                            </label>
                            <CurrencyInput
                                id="capital"
                                value={capital}
                                onChange={setCapital}
                                placeholder="R$ 0,00"
                                className="w-full px-4 py-3 text-2xl font-light border border-gray-300  rounded-md bg-white  focus:outline-none focus:ring-2 focus:ring-gray-900 :ring-white text-center"
                            />
                            <p className="text-xs text-gray-500">
                                Valor mínimo: R$ 100,00
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="emergency" className="text-sm font-medium">
                                Reserva de Emergência
                            </label>
                            <CurrencyInput
                                id="emergency"
                                value={emergencyFund}
                                onChange={setEmergencyFund}
                                placeholder="R$ 0,00"
                                className="w-full px-4 py-3 text-2xl font-light border border-gray-300  rounded-md bg-white  focus:outline-none focus:ring-2 focus:ring-gray-900 :ring-white text-center"
                            />
                            <p className="text-xs text-gray-500 italic">
                                💡 Recomendamos ter de 6 a 12 meses do seu custo de vida como reserva de emergência
                            </p>
                        </div>

                        {isValid && (
                            <div className="p-4 bg-gradient-to-br from-ritmo-primary/20 to-ritmo-secondary/20 /10 /10 rounded-lg border border-ritmo-accent/30">
                                <p className="text-sm font-medium mb-2">Resumo:</p>
                                <div className="text-sm text-gray-700  space-y-1">
                                    <div className="flex justify-between">
                                        <span>Total Disponível:</span>
                                        <span className="font-medium">{formatCurrency(capital + emergencyFund)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Para Investir:</span>
                                        <span className="font-medium">{formatCurrency(capital)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Reserva Emergência:</span>
                                        <span className="font-medium">{formatCurrency(emergencyFund)}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={!isValid || isLoading}
                            className="w-full bg-gray-100 text-gray-900 hover:bg-gray-900 hover:text-white disabled:opacity-50 rounded-md"
                        >
                            {isLoading ? "Salvando..." : "Ver Minha Carteira"}
                            {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
