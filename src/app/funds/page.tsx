import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function FundsPage() {
    const funds = await prisma.fund.findMany({
        take: 50,
        orderBy: { sharpeRatio: 'desc' }
    })

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold tracking-tight">Fundos Disponíveis</h1>

                <div className="grid gap-4">
                    {funds.length === 0 ? (
                        <p className="text-muted-foreground">Nenhum fundo encontrado. Importe dados via script.</p>
                    ) : (
                        funds.map((fund) => (
                            <Card key={fund.id} className="hover:bg-accent/5 transition-colors">
                                <CardContent className="flex items-center justify-between p-6">
                                    <div>
                                        <h3 className="font-semibold text-lg">{fund.name}</h3>
                                        <div className="flex gap-2 mt-2">
                                            <Badge variant="outline">{fund.category}</Badge>
                                            <span className="text-sm text-muted-foreground">CNPJ: {fund.cnpj}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-muted-foreground">Sharpe</div>
                                        <div className="font-bold text-green-500">{fund.sharpeRatio?.toFixed(2) ?? '-'}</div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
