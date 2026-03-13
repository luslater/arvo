"use client"

import { use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft } from "lucide-react"
import { educationalContent } from "@/lib/educational-content"

export default function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)

    // Find article
    const allArticles = [
        ...educationalContent.fundamentos,
        ...educationalContent.metricas,
        ...educationalContent.carteiras,
    ]

    const article = allArticles.find(a => a.id === id)

    if (!article) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white ">
                <p>Artigo não encontrado</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white ">
            <ThemeToggle />

            <div className="max-w-3xl mx-auto px-6 py-12">
                <Link href="/educacao">
                    <Button variant="ghost" className="mb-6">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Voltar
                    </Button>
                </Link>

                <article className="prose prose-gray  max-w-none">
                    <div className="not-prose mb-8">
                        <span className="text-sm text-gray-600 ">{article.category}</span>
                        <h1 className="text-4xl font-light mt-2">{article.title}</h1>
                    </div>

                    <div className="whitespace-pre-wrap leading-relaxed">
                        {article.content}
                    </div>
                </article>
            </div>
        </div>
    )
}
