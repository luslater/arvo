"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, DollarSign, Shield, Briefcase, X, Plus, Save, Loader2, Upload } from "lucide-react"
import * as XLSX from "xlsx"
import { ASSET_TYPES, type AssetType, type UserAsset, type Indexador } from "@/lib/asset-types"
import { CurrencyInput } from "@/components/ui/currency-input"

const CDI_RATE = 10.5; // Exemplo ou vindo do DB
const IPCA_RATE = 4.87; // Exemplo ou vindo do DB

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
    const [isSaving, setIsSaving] = useState(false)
    const fileRef = useRef<HTMLInputElement>(null)

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (evt) => {
            try {
                const bstr = evt.target?.result
                const wb = XLSX.read(bstr, { type: "binary" })
                const wsname = wb.SheetNames[0]
                const ws = wb.Sheets[wsname]
                const data = XLSX.utils.sheet_to_json(ws) as any[]

                if (data.length === 0) {
                    alert("O arquivo está vazio.")
                    return
                }

                const newAssets: UserAsset[] = data.map((row) => {
                    const tipoVal = String(row["tipo"] || row["Tipo"] || "outro").toLowerCase()
                    const nome = row["ativo"] || row["Ativo"] || row["nome"] || row["Nome"] || "Ativo Desconhecido"
                    const quant = Number(row["quantidade"] || row["Quantidade"] || 1)
                    const val = Number(row["valor"] || row["Valor"] || 0)

                    const matchedType = ASSET_TYPES.find(t => t.id === tipoVal || t.label.toLowerCase() === tipoVal)
                    const finalType = matchedType ? matchedType.id : "outro"

                    return {
                        id: `xlsx-${Date.now()}-${Math.random()}`,
                        type: finalType as AssetType,
                        name: String(nome),
                        quantity: isNaN(quant) ? 1 : quant,
                        value: isNaN(val) ? 0 : val,
                        indexador: "Pós-fixado",
                        rentabilidade: 10.5,
                        originalRate: 100,
                        prazo: ""
                    }
                })

                onUpdateAssets([...userAssets, ...newAssets])
                alert(`${newAssets.length} ativos importados com sucesso!`)
            } catch (err) {
                console.error(err)
                alert("Erro ao ler o arquivo Excel. Certifique-se que o formato está correto.")
            }
            if (fileRef.current) fileRef.current.value = ""
        }
        reader.readAsBinaryString(file)
    }

    // Local state for editing without constant individual server updates
    const handleAddAsset = async (type: AssetType) => {
        const newAsset: UserAsset = {
            id: `temp-${Date.now()}`,
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

    const handleRemoveAsset = async (index: number) => {
        const newArray = userAssets.filter((_, i) => i !== index)
        onUpdateAssets(newArray)
    }

    const handleUpdateAsset = async (index: number, field: keyof UserAsset, value: any) => {
        const updated = [...userAssets]
        updated[index] = { ...updated[index], [field]: value }

        // Recalculate indexer rules
        if (field === "indexador" || field === "originalRate" || field === "rentabilidade") {
            const asset = updated[index]
            const indexer = field === "indexador" ? value : asset.indexador
            const rawRate = (field === "originalRate" || field === "rentabilidade") ? value : (asset.originalRate ?? asset.rentabilidade ?? 0)

            asset.originalRate = rawRate

            if (indexer === "Pós-fixado") {
                asset.rentabilidade = (rawRate / 100) * CDI_RATE
            } else if (indexer === "IPCA+") {
                asset.rentabilidade = IPCA_RATE + rawRate
            } else {
                asset.rentabilidade = rawRate
            }
        }

        onUpdateAssets(updated)
    }

    const handleSaveSync = async () => {
        setIsSaving(true)
        try {
            const resAssets = await fetch("/api/user/assets/sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ assets: userAssets })
            })

            const total = userAssets.reduce((sum, asset) => sum + (asset.value || 0), 0)
            const resProfile = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ saldo, emergencyFund: reserva, totalCarteira: total })
            })

            if (resAssets.ok && resProfile.ok) {
                alert("Carteira salva com sucesso!")
            } else {
                alert("Erro ao salvar dados (verifique a conexão).")
            }
        } catch (e) {
            console.error(e)
            alert("Erro na conexão ao salvar as alterações.")
        } finally {
            setIsSaving(false)
        }
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
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
                        {ASSET_TYPES.map((asset) => (
                            <div
                                key={asset.id}
                                draggable
                                onDragStart={() => handleDragStart(asset.id)}
                                onClick={() => handleAddAsset(asset.id)}
                                className="relative cursor-move select-none rounded-xl border p-3 border-dash-border bg-dash-surface transition hover:ring-1 hover:ring-dash-border hover:bg-dash-surface-active"
                            >
                                <div className="mb-1 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 rounded-full bg-dash-text-light" />
                                        <span className="text-[10px] uppercase tracking-widest text-dash-text-light">{asset.id}</span>
                                    </div>
                                    <Plus className="w-3 h-3 text-dash-text-muted opacity-50" />
                                </div>
                                <div className="mt-1.5 text-xs font-semibold text-dash-text">{asset.label}</div>
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
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2 flex-wrap gap-3">
                            <h3 className="text-sm font-semibold text-dash-text text-left">Sua Lista de Ativos</h3>
                            <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()} className="text-dash-text border-dash-border">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Importar Excel
                                </Button>
                                <input type="file" accept=".xlsx, .xls, .csv" hidden ref={fileRef} onChange={handleFileUpload} />

                                <Button size="sm" onClick={handleSaveSync} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Salvar Carteira
                                </Button>
                            </div>
                        </div>
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
                                                <label className="text-xs text-gray-500 block mb-1">
                                                    {asset.indexador === "Pós-fixado" ? "% do CDI" : asset.indexador === "IPCA+" ? "Prefixado (IPCA+ %)" : "Rent. % a.a."}
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={asset.originalRate ?? asset.rentabilidade ?? ""}
                                                    onChange={(e) => handleUpdateAsset(index, "originalRate", Number(e.target.value))}
                                                    placeholder="0"
                                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                                />
                                            </div>

                                            {/* Prazo */}
                                            <div>
                                                <label className="text-xs text-gray-500 block mb-1">Prazo (Mês/Ano)</label>
                                                <input
                                                    type="text"
                                                    value={asset.prazo}
                                                    onChange={(e) => {
                                                        let val = e.target.value.replace(/\D/g, '')
                                                        if (val.length > 2) {
                                                            val = val.substring(0, 2) + '/' + val.substring(2, 6)
                                                        }
                                                        handleUpdateAsset(index, "prazo", val)
                                                    }}
                                                    placeholder="Ex: 10/2027"
                                                    maxLength={7}
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
                    </div>
                )}
            </div>
        </div>
    )
}
