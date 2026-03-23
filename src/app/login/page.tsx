"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

    const [identifier, setIdentifier] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    // Mask for CPF or CNPJ
    const handleIdentifierChange = (value: string) => {
        // Se contiver qualquer letra, assumimos que é e-mail e não mascaramos
        if (/[a-zA-Z@]/.test(value)) {
            setIdentifier(value)
            return
        }

        const raw = value.replace(/\D/g, "")
        if (raw.length <= 11) {
            // CPF
            setIdentifier(
                raw
                    .replace(/(\d{3})(\d)/, "$1.$2")
                    .replace(/(\d{3})(\d)/, "$1.$2")
                    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
            )
        } else {
            // CNPJ
            setIdentifier(
                raw
                    .slice(0, 14)
                    .replace(/(\d{2})(\d)/, "$1.$2")
                    .replace(/(\d{3})(\d)/, "$1.$2")
                    .replace(/(\d{3})(\d)/, "$1/$2")
                    .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
            )
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await signIn("credentials", {
                identifier,
                password,
                redirect: false,
            })

            if (res?.error) {
                setError("Credenciais inválidas. Tente novamente.")
            } else {
                router.push(callbackUrl)
            }
        } catch (err) {
            setError("Ocorreu um erro ao tentar entrar.")
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
        setLoading(true)
        await signIn("google", { callbackUrl })
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
                    {error && (
                        <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 rounded-md text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="identifier" className="text-sm font-medium">
                                Email, CPF ou CNPJ
                            </label>
                            <input
                                id="identifier"
                                type="text"
                                placeholder="seu@email.com ou 000.000.000-00"
                                value={identifier}
                                onChange={(e) => handleIdentifierChange(e.target.value)}
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
                            disabled={loading}
                            className="w-full bg-gray-100 text-gray-900 hover:bg-gray-900 hover:text-white rounded-md"
                        >
                            {loading ? "Entrando..." : "Entrar"}
                        </Button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-500">ou</span>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        type="button"
                        disabled={loading}
                        onClick={handleGoogleSignIn}
                        className="w-full py-2 flex items-center justify-center gap-2 border-gray-200 hover:bg-gray-50"
                    >
                        <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Google
                    </Button>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-600 ">Não tem uma conta?</span>{" "}
                        <Link href={`/register${callbackUrl !== "/dashboard" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`} className="text-gray-900  font-medium hover:underline">
                            Cadastre-se
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white p-4">Carregando...</div>}>
            <LoginForm />
        </Suspense>
    )
}
