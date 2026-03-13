"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft, Upload, X, TrendingUp, DollarSign, Shield, Briefcase } from "lucide-react"
import { ASSET_TYPES, type AssetType, type UserAsset, type Indexador } from "@/lib/asset-types"
import Link from "next/link"
import { CurrencyInput } from "@/components/ui/currency-input"

export default function AdaptPortfolioPage() {
    const router = useRouter()
    const [selectedAssets, setSelectedAssets] = useState<UserAsset[]>([])
    const [showExcelGuide, setShowExcelGuide] = useState(false)
    const [saldo, setSaldo] = useState(0)
    const [reserva, setReserva] = useState(0)
    const [draggedType, setDraggedType] = useState<AssetType | null>(null)

    const addAsset = (type: AssetType) => {
        const newAsset: UserAsset = {
            type,
            name: "",
            quantity: 1,
            value: 0,
            indexador: "Pós-fixado",
            rentabilidade: 0,
            prazo: ""
        }
        setSelectedAssets([...selectedAssets, newAsset])
    }

    const removeAsset = (index: number) => {
        setSelectedAssets(selectedAssets.filter((_, i) => i !== index))
    }

    const updateAsset = (index: number, field: keyof UserAsset, value: any) => {
        const updated = [...selectedAssets]
        updated[index] = { ...updated[index], [field]: value }
        setSelectedAssets(updated)
    }

    const totalCarteira = selectedAssets.reduce((sum, asset) => sum + (asset.value || 0), 0)
    const totalGeral = saldo + reserva + totalCarteira

    const handleDragStart = (type: AssetType) => {
        setDraggedType(type)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        if (draggedType) {
            addAsset(draggedType)
            setDraggedType(null)
        }
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            alert("Funcionalidade de upload Excel em desenvolvimento!")
        }
    }

    const handleSubmit = () => {
        if (selectedAssets.length === 0) {
            alert("Adicione pelo menos um ativo à sua carteira")
            return
        }

        localStorage.setItem("userAssets", JSON.stringify(selectedAssets))
        localStorage.setItem("portfolioCapital", (totalCarteira * 100).toString())
        localStorage.setItem("saldo", (saldo * 100).toString())
        localStorage.setItem("emergencyFund", (reserva * 100).toString())

        const profile = localStorage.getItem("userProfile") || "RITMO"
        router.push(`/portfolio/${profile.toLowerCase()}`)
    }

    const assetsByCategory = ASSET_TYPES.reduce((acc, asset) => {
        if (!acc[asset.category]) acc[asset.category] = []
        acc[asset.category].push(asset)
        return acc
    }, {} as Record<string, typeof ASSET_TYPES[number][]>)

    return (
        <div className="min-h-screen bg-white  p-6">
            <ThemeToggle />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Link href="/portfolio/setup">
                        <Button variant="ghost">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Voltar
                        </Button>
                    </Link>

                    <div className="flex items-center gap-2">
                        <Image src="/arvo-logo.png" alt="ARVO" width={60} height={30} className="" />
                    </div>
                </div>

                {/* Title */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-light">Adaptar Minha Carteira</h1>
                    <p className="text-gray-600  text-sm">
                        Arraste os ativos para adicionar à sua carteira atual
                    </p>
                </div>

                {/* Asset Palette - Compact Draggable Cards */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600 ">Tipos de Ativos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {ASSET_TYPES.map((asset) => (
                                <div
                                    key={asset.id}
                                    draggable
                                    onDragStart={() => handleDragStart(asset.id)}
                                    onClick={() => addAsset(asset.id)}
                                    className="px-3 py-1.5 text-xs font-medium bg-gray-100  hover:bg-ritmo-primary/20 :bg-ritmo-accent/20 border border-gray-300  rounded-full cursor-move hover:border-ritmo-accent transition-all"
                                >
                                    {asset.label}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Dashboard Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Saldo */}
                    <Card className="border-ritmo-accent/30">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-ritmo-primary/20 flex items-center justify-center">
                                    <DollarSign className="h-5 w-5 text-ritmo-accent" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Saldo Disponível</p>
                                    <p className="text-lg font-semibold text-ritmo-accent">
                                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }).format(saldo)}
                                    </p>
                                </div>
                            </div>
                            <CurrencyInput
                                value={saldo}
                                onChange={setSaldo}
                                placeholder="R$ 0,00"
                                className="w-full px-3 py-2 text-sm border border-gray-300  rounded-md bg-white  focus:outline-none focus:ring-2 focus:ring-ritmo-accent"
                            />
                        </CardContent>
                    </Card>

                    {/* Reserva */}
                    <Card className="border-abrigo-accent/30">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-abrigo-primary/20 flex items-center justify-center">
                                    <Shield className="h-5 w-5 text-abrigo-accent" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Reserva de Emergência</p>
                                    <p className="text-lg font-semibold text-abrigo-accent">
                                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }).format(reserva)}
                                    </p>
                                </div>
                            </div>
                            <CurrencyInput
                                value={reserva}
                                onChange={setReserva}
                                placeholder="R$ 0,00"
                                className="w-full px-3 py-2 text-sm border border-gray-300  rounded-md bg-white  focus:outline-none focus:ring-2 focus:ring-abrigo-accent"
                            />
                        </CardContent>
                    </Card>

                    {/* Carteira Atual */}
                    <Card className="border-vanguarda-accent/30">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-vanguarda-primary/20 flex items-center justify-center">
                                    <Briefcase className="h-5 w-5 text-vanguarda-accent" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Carteira Atual</p>
                                    <p className="text-lg font-semibold text-vanguarda-accent">
                                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }).format(totalCarteira)}
                                    </p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">{selectedAssets.length} ativo(s)</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Drop Zone */}
                <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${draggedType
                        ? "border-ritmo-accent bg-ritmo-primary/10"
                        : "border-gray-300 "
                        }`}
                >
                    {selectedAssets.length === 0 ? (
                        <div className="py-8">
                            <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-500 ">
                                Arraste ativos aqui ou clique nos cards acima
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {selectedAssets.map((asset, index) => {
                                const assetType = ASSET_TYPES.find(t => t.id === asset.type)
                                return (
                                    <div key={index} className="p-4 bg-white  rounded-lg border border-gray-200  hover:border-ritmo-accent/50 transition-colors text-left">
                                        <div className="grid grid-cols-1 lg:grid-cols-8 gap-3">
                                            {/* Tipo */}
                                            <div>
                                                <label className="text-xs text-gray-500  block mb-1">Tipo</label>
                                                <p className="text-sm font-semibold text-ritmo-accent">{assetType?.label}</p>
                                            </div>

                                            {/* Nome */}
                                            <div className="lg:col-span-2">
                                                <label className="text-xs text-gray-500  block mb-1">Nome do Ativo</label>
                                                <input
                                                    type="text"
                                                    value={asset.name}
                                                    onChange={(e) => updateAsset(index, "name", e.target.value)}
                                                    placeholder="Ex: PETR4"
                                                    className="w-full px-2 py-1 text-sm border border-gray-300  rounded bg-white  focus:outline-none focus:ring-1 focus:ring-ritmo-accent"
                                                />
                                            </div>

                                            {/* Indexador */}
                                            <div>
                                                <label className="text-xs text-gray-500  block mb-1">Indexador</label>
                                                <select
                                                    value={asset.indexador}
                                                    onChange={(e) => updateAsset(index, "indexador", e.target.value as Indexador)}
                                                    className="w-full px-2 py-1 text-sm border border-gray-300  rounded bg-white  focus:outline-none focus:ring-1 focus:ring-ritmo-accent"
                                                >
                                                    <option>Prefixado</option>
                                                    <option>Pós-fixado</option>
                                                    <option>IPCA+</option>
                                                    <option>Renda Variável</option>
                                                </select>
                                            </div>

                                            {/* Rentabilidade */}
                                            <div>
                                                <label className="text-xs text-gray-500  block mb-1">Rent. %</label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={asset.rentabilidade || ""}
                                                    onChange={(e) => updateAsset(index, "rentabilidade", Number(e.target.value))}
                                                    placeholder="0"
                                                    className="w-full px-2 py-1 text-sm border border-gray-300  rounded bg-white  focus:outline-none focus:ring-1 focus:ring-ritmo-accent"
                                                />
                                            </div>

                                            {/* Prazo */}
                                            <div>
                                                <label className="text-xs text-gray-500  block mb-1">Prazo</label>
                                                <input
                                                    type="text"
                                                    value={asset.prazo}
                                                    onChange={(e) => updateAsset(index, "prazo", e.target.value)}
                                                    placeholder="2027-12-31"
                                                    className="w-full px-2 py-1 text-sm border border-gray-300  rounded bg-white  focus:outline-none focus:ring-1 focus:ring-ritmo-accent"
                                                />
                                            </div>

                                            {/* Valor */}
                                            <div>
                                                <label className="text-xs text-gray-500  block mb-1">Valor (R$)</label>
                                                <CurrencyInput
                                                    value={asset.value || 0}
                                                    onChange={(val) => updateAsset(index, "value", val)}
                                                    placeholder="R$ 0,00"
                                                    className="w-full px-2 py-1 text-sm border border-gray-300  rounded bg-white  focus:outline-none focus:ring-1 focus:ring-ritmo-accent font-semibold"
                                                />
                                            </div>

                                            {/* Remove */}
                                            <div className="flex items-end">
                                                <button
                                                    onClick={() => removeAsset(index)}
                                                    className="w-full p-1 hover:bg-red-50 :bg-red-900/20 rounded transition-colors"
                                                    title="Remover ativo"
                                                >
                                                    <X className="h-4 w-4 text-red-500 mx-auto" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                {selectedAssets.length > 0 && (
                    <div className="flex justify-end">
                        <Button
                            onClick={handleSubmit}
                            className="bg-gray-100 text-gray-900 hover:bg-gray-900 hover:text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                            size="lg"
                        >
                            <span className="">Ver Recomendações e Score</span>
                            <TrendingUp className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
