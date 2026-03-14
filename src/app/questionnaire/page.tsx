"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { questions, calculateProfile, getProfileDescription } from "@/lib/questionnaire"
import { ArrowLeft, ArrowRight, Home } from "lucide-react"

export default function QuestionnairePage() {
    const router = useRouter()
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState<number[]>([])
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
    const [showResult, setShowResult] = useState(false)

    const handleAnswer = () => {
        if (selectedAnswer === null) return

        const newAnswers = [...answers]
        newAnswers[currentQuestion] = selectedAnswer
        setAnswers(newAnswers)

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
            setSelectedAnswer(null)
        } else {
            // Calculate and save profile
            const totalPts = newAnswers.reduce((sum, pts) => sum + pts, 0)
            const userProfile = calculateProfile(totalPts)

            // Save to localStorage
            if (typeof window !== "undefined") {
                localStorage.setItem("userProfile", userProfile)
            }

            setShowResult(true)
        }
    }

    const handleBack = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1)
            setSelectedAnswer(answers[currentQuestion - 1] ?? null)
        }
    }

    const totalPoints = answers.reduce((sum, points) => sum + points, 0)
    const profile = calculateProfile(totalPoints)
    const profileInfo = getProfileDescription(profile)

    if (showResult) {
        const profileColors = {
            ABRIGO: "from-[#C9B8A3] to-[#8B7355]",
            RITMO: "from-[#A8C5A1] to-[#5D8C54]",
            VANGUARDA: "from-[#A3BFD9] to-[#5687AF]",
            OCEANO: "from-[#89C4D4] to-[#3D96AB]",
        }

        return (
            <div className="min-h-screen flex items-center justify-center bg-white  p-4">
                <ThemeToggle />

                <Card className="w-full max-w-2xl p-8 border-gray-200 /10">
                    <div className="text-center space-y-6">
                        <div className="inline-block p-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200  ">
                            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${profileColors[profile]} flex items-center justify-center text-4xl`}>
                                {profileInfo.icon}
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-gray-600 mb-1">{profileInfo.subtitle}</p>
                            <h1 className="text-4xl font-light mb-3">Carteira {profileInfo.title}</h1>
                            <p className="text-gray-600 text-lg max-w-xl mx-auto mb-6">
                                {profileInfo.description}
                            </p>

                            {profile !== "ABRIGO" && (
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 text-sm font-medium">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    Esta é uma estratégia da assinatura Premium. Você pode explorar a plataforma antes de desbloqueá-la.
                                </div>
                            )}
                        </div>

                        <div className="pt-6">
                            <Button
                                onClick={() => router.push("/carteira")}
                                size="lg"
                                className="bg-gray-100 text-gray-900 hover:bg-gray-900 hover:text-white rounded-md px-8"
                            >
                                Ir para Minha Carteira
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        )
    }

    const question = questions[currentQuestion]
    const progress = ((currentQuestion + 1) / questions.length) * 100

    return (
        <div className="min-h-screen flex items-center justify-center bg-white  p-4">
            <ThemeToggle />

            {/* Back to Dashboard Button */}
            <div className="fixed top-4 left-4">
                <Link href="/carteira">
                    <Button variant="ghost" size="sm">
                        <Home className="h-4 w-4 mr-2" />
                        Voltar para Dashboard
                    </Button>
                </Link>
            </div>

            <div className="w-full max-w-2xl space-y-6">
                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600 ">
                        <span>Pergunta {currentQuestion + 1} de {questions.length}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200  rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gray-900  transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <Card className="p-8 border-gray-200 /10">
                    <h2 className="text-2xl font-light mb-6">{question.question}</h2>

                    <div className="space-y-3">
                        {question.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedAnswer(option.points)}
                                className={`
                  w-full p-4 text-left rounded-lg border-2 transition-all
                  ${selectedAnswer === option.points
                                        ? "border-gray-900  bg-gray-50 "
                                        : "border-gray-200  hover:border-gray-300 :border-gray-700"
                                    }
                `}
                            >
                                {option.text}
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Navigation */}
                <div className="flex justify-between">
                    <Button
                        onClick={handleBack}
                        disabled={currentQuestion === 0}
                        variant="outline"
                        className="border-gray-300 "
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar
                    </Button>

                    <Button
                        onClick={handleAnswer}
                        disabled={selectedAnswer === null}
                        className="bg-gray-100 text-gray-900 hover:bg-gray-900 hover:text-white"
                    >
                        {currentQuestion === questions.length - 1 ? "Ver Resultado" : "Próxima"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
