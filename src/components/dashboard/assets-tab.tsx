"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, DollarSign, Shield, Briefcase, X, Plus } from "lucide-react"
import { ASSET_TYPES, type AssetType, type UserAsset, type Indexador } from "@/lib/asset-types"
import { CurrencyInput } from "@/components/ui/currency-input"

interface AssetsTabProps {
    userAssets: UserAsset[]
    saldo: number
    reserva: number
    onUpdateAssets: (assets: UserAsset[]) => void
    onUpdateSaldo: (value: number) => void
    onUpdateReserva: (value: number) => void
}

export function AssetsTab({
    userAssets,
    saldo,
    reserva,
    onUpdateAssets,
    onUpdateSaldo,
    onUpdateReserva
}: AssetsTabProps) {
    const [draggedType, setDraggedType] = useState<AssetType | null>(null)

    // Local state for editing to avoid constant parent updates, 
    // but we'll sync changes immediately for now to keep it simple
    const handleAddAsset = (type: AssetType) => {
        const newAsset: UserAsset = {
            type,
            name: "",
            quantity: 1,
            value: 0,
            indexador: "Pós-fixado",
            rentabilidade: 0,
            prazo: ""
        }
        onUpdateAssets([...userAssets, newAsset])
    }

    const handleRemoveAsset = (index: number) => {
        onUpdateAssets(userAssets.filter((_, i) => i !== index))
    }

    const handleUpdateAsset = (index: number, field: keyof UserAsset, value: any) => {
        const updated = [...userAssets]
        updated[index] = { ...updated[index], [field]: value }
        onUpdateAssets(updated)
    }

    const handleDragStart = (type: AssetType) => {
        setDraggedType(type)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        if (draggedType) {
            handleAddAsset(draggedType)
            setDraggedType(null)
        }
    }

    const totalCarteira = userAssets.reduce((sum, asset) => sum + (asset.value || 0), 0)

    return (
        <div className="space-y-6">
            {/* Asset Palette */}
            <Card className="border-0 shadow-sm bg-white">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Adicionar Ativos (Arraste ou Clique)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {ASSET_TYPES.map((asset) => (
                            <div
                                key={asset.id}
                                draggable
                                onDragStart={() => handleDragStart(asset.id)}
                                onClick={() => handleAddAsset(asset.id)}
                                className="px-3 py-1.5 text-xs font-medium bg-gray-50 hover:bg-primary/10 text-gray-700 hover:text-primary border border-gray-200 hover:border-primary rounded-full cursor-move transition-all flex items-center gap-1"
                            >
                                <Plus className="w-3 h-3" />
                                {asset.label}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Balances Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-0 shadow-sm bg-white">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                <DollarSign className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Saldo Disponível</p>
                                <p className="text-lg font-semibold text-blue-600">
                                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }).format(saldo)}
                                </p>
                            </div>
                        </div>
                        <CurrencyInput
                            value={saldo}
                            onChange={onUpdateSaldo}
                            placeholder="R$ 0,00"
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-white">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                                <Shield className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Reserva de Emergência</p>
                                <p className="text-lg font-semibold text-amber-600">
                                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }).format(reserva)}
                                </p>
                            </div>
                        </div>
                        <CurrencyInput
                            value={reserva}
                            onChange={onUpdateReserva}
                            placeholder="R$ 0,00"
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-white">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                                <Briefcase className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Total em Ativos</p>
                                <p className="text-lg font-semibold text-indigo-600">
                                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }).format(totalCarteira)}
                                </p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{userAssets.length} ativo(s) cadastrado(s)</p>
                    </CardContent>
                </Card>
            </div>

            {/* Drop Zone / Asset List */}
            <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${draggedType
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 bg-gray-50/50"
                    }`}
            >
                {userAssets.length === 0 ? (
                    <div className="py-12">
                        <Briefcase className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500">
                            Arraste ativos aqui ou clique nos botões acima para começar
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {userAssets.map((asset, index) => {
                            const assetType = ASSET_TYPES.find(t => t.id === asset.type)
                            return (
                                <div key={index} className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all text-left">
                                    <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 items-end">
                                        {/* Tipo */}
                                        <div>
                                            <label className="text-xs text-gray-500 block mb-1">Tipo</label>
                                            <div className="text-sm font-medium text-primary px-2 py-1 bg-primary/10 rounded inline-block">
                                                {assetType?.label}
                                            </div>
                                        </div>

                                        {/* Nome */}
                                        <div className="lg:col-span-2">
                                            <label className="text-xs text-gray-500 block mb-1">Nome do Ativo</label>
                                            <input
                                                type="text"
                                                value={asset.name}
                                                onChange={(e) => handleUpdateAsset(index, "name", e.target.value)}
                                                placeholder="Ex: PETR4"
                                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            />
                                        </div>

                                        {/* Indexador */}
                                        <div>
                                            <label className="text-xs text-gray-500 block mb-1">Indexador</label>
                                            <select
                                                value={asset.indexador}
                                                onChange={(e) => handleUpdateAsset(index, "indexador", e.target.value as Indexador)}
                                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                                            >
                                                <option>Prefixado</option>
                                                <option>Pós-fixado</option>
                                                <option>IPCA+</option>
                                                <option>Renda Variável</option>
                                            </select>
                                        </div>

                                        {/* Rentabilidade */}
                                        <div>
                                            <label className="text-xs text-gray-500 block mb-1">Rent. %</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={asset.rentabilidade || ""}
                                                onChange={(e) => handleUpdateAsset(index, "rentabilidade", Number(e.target.value))}
                                                placeholder="0"
                                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            />
                                        </div>

                                        {/* Prazo */}
                                        <div>
                                            <label className="text-xs text-gray-500 block mb-1">Prazo</label>
                                            <input
                                                type="text"
                                                value={asset.prazo}
                                                onChange={(e) => handleUpdateAsset(index, "prazo", e.target.value)}
                                                placeholder="2027-12-31"
                                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            />
                                        </div>

                                        {/* Valor */}
                                        <div>
                                            <label className="text-xs text-gray-500 block mb-1">Valor (R$)</label>
                                            <CurrencyInput
                                                value={asset.value || 0}
                                                onChange={(val) => handleUpdateAsset(index, "value", val)}
                                                placeholder="R$ 0,00"
                                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-semibold"
                                            />
                                        </div>

                                        {/* Remove */}
                                        <div>
                                            <button
                                                onClick={() => handleRemoveAsset(index)}
                                                className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                                                title="Remover ativo"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
