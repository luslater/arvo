"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Check, ArrowRight } from "lucide-react"
import Link from "next/link"

const PROFILES = [
    {
        id: "CONSERVATIVE",
        title: "Conservador",
        description: "Prioriza segurança. Aceita rentabilidade menor para evitar perdas.",
        color: "from-blue-500 to-cyan-500"
    },
    {
        id: "MODERATE",
        title: "Moderado",
        description: "Busca equilíbrio entre segurança e rentabilidade. Aceita riscos controlados.",
        color: "from-purple-500 to-pink-500"
    },
    {
        id: "AGGRESSIVE",
        title: "Arrojado",
        description: "Foco em alta rentabilidade a longo prazo. Tolera volatilidade.",
        color: "from-orange-500 to-red-500"
    }
]

export default function OnboardingPage() {
    const [selected, setSelected] = useState<string | null>(null)

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="max-w-4xl w-full space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Qual é o seu perfil de investidor?</h1>
                    <p className="text-muted-foreground">Isso definirá a alocação ideal da sua carteira.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {PROFILES.map((profile) => (
                        <Card
                            key={profile.id}
                            className={cn(
                                "cursor-pointer transition-all hover:scale-105 border-2",
                                selected === profile.id ? "border-primary bg-accent/10" : "border-transparent hover:border-white/10"
                            )}
                            onClick={() => setSelected(profile.id)}
                        >
                            <CardHeader>
                                <div className={cn("w-12 h-12 rounded-full bg-gradient-to-br mb-4", profile.color)} />
                                <CardTitle>{profile.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base">
                                    {profile.description}
                                </CardDescription>
                            </CardContent>
                            {selected === profile.id && (
                                <div className="absolute top-4 right-4 text-primary">
                                    <Check className="w-6 h-6" />
                                </div>
                            )}
                        </Card>
                    ))}
                </div>

                <div className="flex justify-end pt-8">
                    <Button
                        size="lg"
                        disabled={!selected}
                        className="w-full md:w-auto"
                        asChild={!!selected}
                    >
                        {selected ? (
                            <Link href={`/dashboard?profile=${selected}`}>
                                Continuar <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        ) : (
                            <span>Selecione um perfil</span>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
