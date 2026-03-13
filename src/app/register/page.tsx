"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"

export default function RegisterPage() {
    const router = useRouter()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Demo mode: Redirect directly to dashboard
        alert("Conta criada com sucesso! (Modo Demo)")
        router.push("/carteira")
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white  p-4">
            <ThemeToggle />

            <Card className="w-full max-w-md border-gray-200 /10">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <h1 className="text-2xl font-light tracking-wide">ARVO</h1>
                    </div>
                    <CardTitle className="text-2xl font-light text-center">Criar Conta</CardTitle>
                    <CardDescription className="text-center">
                        Comece sua jornada de investimentos
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">
                                Nome Completo
                            </label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Seu nome"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300  rounded-md bg-white  focus:outline-none focus:ring-2 focus:ring-gray-900 :ring-white"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300  rounded-md bg-white  focus:outline-none focus:ring-2 focus:ring-gray-900 :ring-white"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">
                                Senha
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300  rounded-md bg-white  focus:outline-none focus:ring-2 focus:ring-gray-900 :ring-white"
                                required
                                minLength={6}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-gray-100 text-gray-900 hover:bg-gray-900 hover:text-white rounded-md"
                        >
                            Criar Conta
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm">
                        <span className="text-gray-600 ">Já tem uma conta?</span>{" "}
                        <Link href="/login" className="text-gray-900  font-medium hover:underline">
                            Entrar
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
