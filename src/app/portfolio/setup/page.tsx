"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sparkles, Upload } from "lucide-react"

export default function PortfolioSetupPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white  p-4">
            <ThemeToggle />

            <div className="w-full max-w-4xl space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-light">Como deseja criar sua carteira?</h1>
                    <p className="text-gray-600 ">
                        Escolha a melhor opção para você
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* New Portfolio */}
                    <Card className="border-2 border-gray-200  hover:border-gray-900 :border-white transition-all">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-full bg-gray-100  flex items-center justify-center mb-4">
                                <Sparkles className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-2xl font-light">Começar do Zero</CardTitle>
                            <CardDescription className="text-base">
                                Criar uma carteira nova otimizada para seu perfil
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-900 ">Ideal para:</p>
                                <ul className="text-sm text-gray-600  space-y-1 list-disc list-inside">
                                    <li>Quem está começando a investir</li>
                                    <li>Quem quer recomeçar do zero</li>
                                    <li>Busca a melhor alocação desde o início</li>
                                </ul>
                            </div>
                            <Link href="/portfolio/new">
                                <Button className="w-full bg-gray-100 text-gray-900 hover:bg-gray-900 hover:text-white">
                                    Criar Nova Carteira
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Adapt Portfolio */}
                    <Card className="border-2 border-gray-200  hover:border-gray-900 :border-white transition-all">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-full bg-gray-100  flex items-center justify-center mb-4">
                                <Upload className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-2xl font-light">Adaptar Carteira Atual</CardTitle>
                            <CardDescription className="text-base">
                                Otimizar seus investimentos existentes
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-900 ">Ideal para:</p>
                                <ul className="text-sm text-gray-600  space-y-1 list-disc list-inside">
                                    <li>Quem já possui investimentos</li>
                                    <li>Quer melhorar a alocação atual</li>
                                    <li>Busca rebalancear sem vender tudo</li>
                                </ul>
                            </div>
                            <Link href="/portfolio/adapt">
                                <Button className="w-full bg-gray-100 text-gray-900 hover:bg-gray-900 hover:text-white">
                                    Adaptar Minha Carteira
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
