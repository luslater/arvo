"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { BookOpen, TrendingUp, PieChart } from "lucide-react"
import { educationalContent } from "@/lib/educational-content"

export default function EducacaoPage() {
    return (
        <div className="min-h-screen bg-white  p-6">
            <ThemeToggle />

            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-4xl font-light">Área Educacional</h1>
                    <p className="text-gray-600  text-lg">
                        Aprenda sobre investimentos e tome decisões mais informadas
                    </p>
                </div>

                {/* Fundamentos */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        <h2 className="text-2xl font-light">Fundamentos</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        {educationalContent.fundamentos.map((article) => (
                            <Link key={article.id} href={`/educacao/${article.id}`}>
                                <Card className="border-gray-200  hover:border-gray-900 :border-white transition-all h-full">
                                    <CardHeader>
                                        <CardTitle className="font-light">{article.title}</CardTitle>
                                        <CardDescription>{article.summary}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <span className="text-sm text-gray-600 ">
                                            {article.category}
                                        </span>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Métricas */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        <h2 className="text-2xl font-light">Métricas</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        {educationalContent.metricas.map((article) => (
                            <Link key={article.id} href={`/educacao/${article.id}`}>
                                <Card className="border-gray-200  hover:border-gray-900 :border-white transition-all h-full">
                                    <CardHeader>
                                        <CardTitle className="font-light">{article.title}</CardTitle>
                                        <CardDescription>{article.summary}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <span className="text-sm text-gray-600 ">
                                            {article.category}
                                        </span>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Carteiras */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <PieChart className="h-5 w-5" />
                        <h2 className="text-2xl font-light">Carteiras</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        {educationalContent.carteiras.map((article) => (
                            <Link key={article.id} href={`/educacao/${article.id}`}>
                                <Card className="border-gray-200  hover:border-gray-900 :border-white transition-all h-full">
                                    <CardHeader>
                                        <CardTitle className="font-light">{article.title}</CardTitle>
                                        <CardDescription>{article.summary}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <span className="text-sm text-gray-600 ">
                                            {article.category}
                                        </span>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}
