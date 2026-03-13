"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Demo mode: Redirect directly to dashboard
        router.push("/carteira")
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white  p-4">
            <ThemeToggle />

            <Card className="w-full max-w-md border-gray-200 /10">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <Image src="/arvo-logo.png" alt="ARVO" width={100} height={50} className="" />
                    </div>
                    <CardTitle className="text-2xl font-light">Entrar</CardTitle>
                    <CardDescription className="text-center">
                        Acesse sua conta para continuar
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-gray-100 text-gray-900 hover:bg-gray-900 hover:text-white rounded-md"
                        >
                            Entrar
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm">
                        <span className="text-gray-600 ">Não tem uma conta?</span>{" "}
                        <Link href="/register" className="text-gray-900  font-medium hover:underline">
                            Cadastre-se
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
