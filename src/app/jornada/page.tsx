"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
    Trophy, Star, Target, TrendingUp, Shield,
    BookOpen, Zap, Award, Lock, CheckCircle2,
    ArrowRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function JornadaPage() {
    // Mock Data - In future this will come from DB
    const userLevel = 3
    const userTitle = "Explorador Financeiro"
    const currentXP = 2450
    const nextLevelXP = 3000
    const progress = (currentXP / nextLevelXP) * 100

    const missions = [
        {
            id: 1,
            title: "Consistência é Chave",
            description: "Faça seu aporte mensal de R$ 500,00",
            xp: 500,
            completed: false,
            icon: <TrendingUp className="h-5 w-5 text-green-500" />,
            action: "/carteira"
        },
        {
            id: 2,
            title: "Proteção Primeiro",
            description: "Atingir 3 meses de reserva de emergência",
            xp: 1000,
            completed: false,
            icon: <Shield className="h-5 w-5 text-blue-500" />,
            action: "/planejamento"
        },
        {
            id: 3,
            title: "Sábio Investidor",
            description: "Ler o artigo: 'Como funciona a Renda Fixa'",
            xp: 100,
            completed: true,
            icon: <BookOpen className="h-5 w-5 text-purple-500" />,
            action: "/educacao"
        }
    ]

    const badges = [
        { id: 1, name: "Primeiro Passo", icon: "🚀", description: "Fez o primeiro investimento", unlocked: true },
        { id: 2, name: "Mão de Alface", icon: "🥬", description: "Vendeu na baixa (Brincadeira!)", unlocked: false },
        { id: 3, name: "Guardião", icon: "🛡️", description: "Completou a reserva de emergência", unlocked: false },
        { id: 4, name: "Diversificador", icon: "🌍", description: "Investiu em ativos internacionais", unlocked: true },
        { id: 5, name: "Leitor Voraz", icon: "📚", description: "Leu 10 artigos educativos", unlocked: false },
        { id: 6, name: "Diamante", icon: "💎", description: "Manteve investimentos por 1 ano", unlocked: false },
    ]

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-white border-b border-gray-200 pt-8 pb-12 px-6">
                <div className="container mx-auto max-w-5xl">
                    <div className="flex justify-between items-start mb-8">
                        <Link href="/carteira">
                            <Button variant="ghost" size="sm" className="-ml-4 text-gray-500 hover:text-gray-900">
                                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                                Voltar para Carteira
                            </Button>
                        </Link>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center border-4 border-white shadow-lg">
                                    <span className="text-4xl">🦁</span>
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    Lvl {userLevel}
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{userTitle}</h1>
                                <p className="text-gray-500">Continue evoluindo para desbloquear novas ferramentas.</p>
                            </div>
                        </div>

                        <div className="w-full md:w-1/3 space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-gray-600">XP Atual</span>
                                <span className="text-gray-900">{currentXP} / {nextLevelXP}</span>
                            </div>
                            <Progress value={progress} className="h-3 bg-gray-100" />
                            <p className="text-xs text-gray-400 text-right">Faltam {nextLevelXP - currentXP} XP para o próximo nível</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-5xl px-6 py-10 space-y-10">

                {/* Missões */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Target className="h-6 w-6 text-red-500" />
                            Missões Ativas
                        </h2>
                        <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-200">
                            3 Disponíveis
                        </Badge>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {missions.map((mission, index) => (
                            <motion.div
                                key={mission.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className={`h-full border-l-4 ${mission.completed ? 'border-l-green-500 opacity-75' : 'border-l-blue-500'} hover:shadow-md transition-shadow`}>
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <div className="p-2 bg-gray-50 rounded-lg">
                                                {mission.icon}
                                            </div>
                                            <Badge variant="outline" className="font-mono text-xs">
                                                +{mission.xp} XP
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-lg mt-3">{mission.title}</CardTitle>
                                        <CardDescription>{mission.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {mission.completed ? (
                                            <Button variant="ghost" className="w-full text-green-600 cursor-default hover:text-green-600 hover:bg-green-50">
                                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                                Completada
                                            </Button>
                                        ) : (
                                            <Link href={mission.action}>
                                                <Button className="w-full bg-gray-100 text-gray-900 hover:bg-gray-900 hover:text-white">
                                                    Começar
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </Link>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Conquistas */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Trophy className="h-6 w-6 text-yellow-500" />
                            Sala de Troféus
                        </h2>
                        <span className="text-sm text-gray-500">
                            {badges.filter(b => b.unlocked).length} / {badges.length} Desbloqueados
                        </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                        {badges.map((badge, index) => (
                            <motion.div
                                key={badge.id}
                                whileHover={{ scale: 1.05 }}
                                className={`flex flex-col items-center text-center p-4 rounded-xl border ${badge.unlocked ? 'bg-white border-gray-200 shadow-sm' : 'bg-gray-50 border-gray-100 opacity-50 grayscale'}`}
                            >
                                <div className="text-4xl mb-3 filter drop-shadow-sm">
                                    {badge.icon}
                                </div>
                                <h3 className="font-semibold text-sm text-gray-900 mb-1">{badge.name}</h3>
                                <p className="text-xs text-gray-500 line-clamp-2">{badge.description}</p>
                                {!badge.unlocked && (
                                    <div className="mt-2">
                                        <Lock className="h-3 w-3 text-gray-400" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Próximo Nível Preview */}
                <section className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2 text-yellow-400 font-medium">
                                <Star className="h-5 w-5 fill-yellow-400" />
                                Próximo Nível: Visionário
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Desbloqueie a Análise de IA</h3>
                            <p className="text-gray-300 max-w-md">
                                Ao atingir o nível 4, você ganha acesso exclusivo ao nosso consultor de IA que analisa sua carteira em tempo real.
                            </p>
                        </div>
                        <Button className="bg-white text-gray-900 hover:bg-gray-100 whitespace-nowrap">
                            Ver Benefícios
                        </Button>
                    </div>

                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-blue-500 opacity-10 rounded-full blur-3xl"></div>
                </section>

            </div>
        </div>
    )
}
