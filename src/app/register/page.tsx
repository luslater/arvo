"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"

// ─── CPF / CNPJ mask ─────────────────────────────────────────────────────────
function maskCpfCnpj(value: string) {
    const raw = value.replace(/\D/g, "")
    if (raw.length <= 11) {
        // CPF
        return raw
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    } else {
        // CNPJ
        return raw
            .slice(0, 14)
            .replace(/(\d{2})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1/$2")
            .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
    }
}

// ─── Phone mask ───────────────────────────────────────────────────────────────
function maskPhone(value: string) {
    return value
        .replace(/\D/g, "")
        .slice(0, 11)
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
}

function RegisterForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [cpf, setCpf] = useState("")
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setError("As senhas não coincidem. Por favor, verifique.")
            return
        }

        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, cpf, phone }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.message || "Erro ao criar conta")
                return
            }

            // Redirect to pending page instead of login
            router.push("/pending")
        } catch (err) {
            setError("Ocorreu um erro na rede. Tente novamente.")
        } finally {
            setLoading(false)
        }
    }

    const inputClass = "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0A192F]/20 focus:border-[#0A192F] transition-colors"
    const labelClass = "block text-sm font-medium text-gray-700 mb-1"

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F4F6F9] p-4">
            <ThemeToggle />

            <Card className="w-full max-w-md border-gray-200 shadow-sm rounded-2xl">
                <CardHeader className="space-y-1 text-center pb-2">
                    <div className="flex justify-center mb-4">
                        <Image src="/arvo-logo.png" alt="ARVO" width={80} height={40} />
                    </div>
                    <CardTitle className="text-2xl font-semibold text-[#0A192F]">Criar Conta</CardTitle>
                    <CardDescription className="text-gray-500 text-sm">
                        Seu cadastro passará por análise da nossa equipe
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-4">
                    {error && (
                        <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 rounded-lg border border-red-100 text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Nome completo */}
                        <div>
                            <label htmlFor="name" className={labelClass}>Nome completo</label>
                            <input
                                id="name"
                                type="text"
                                required
                                placeholder="Seu nome"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className={inputClass}
                            />
                        </div>

                        {/* E-mail */}
                        <div>
                            <label htmlFor="email" className={labelClass}>E-mail</label>
                            <input
                                id="email"
                                type="email"
                                required
                                placeholder="seu@email.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className={inputClass}
                            />
                        </div>

                        {/* CPF/CNPJ + Celular na mesma linha */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="cpf" className={labelClass}>CPF / CNPJ</label>
                                <input
                                    id="cpf"
                                    type="text"
                                    required
                                    placeholder="000.000.000-00"
                                    value={cpf}
                                    onChange={e => setCpf(maskCpfCnpj(e.target.value))}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className={labelClass}>Celular</label>
                                <input
                                    id="phone"
                                    type="tel"
                                    required
                                    placeholder="(11) 99999-9999"
                                    value={phone}
                                    onChange={e => setPhone(maskPhone(e.target.value))}
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Senhas na mesma linha */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="password" className={labelClass}>Senha</label>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    placeholder="Mínimo 6 caracteres"
                                    minLength={6}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className={labelClass}>Confirmar Senha</label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    required
                                    placeholder="Repita a senha"
                                    minLength={6}
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 rounded-xl font-semibold text-sm"
                            style={{ backgroundColor: "#0A192F", color: "#ffffff" }}
                        >
                            {loading ? "Enviando..." : "Criar conta"}
                        </Button>
                    </form>

                    <p className="mt-5 text-center text-xs text-gray-400 leading-relaxed">
                        Ao criar sua conta, você concorda com os nossos{" "}
                        <a href="#" className="text-[#0A192F] hover:underline font-medium">Termos de Uso</a>
                        {" "}e{" "}
                        <a href="#" className="text-[#0A192F] hover:underline font-medium">Política de Privacidade</a>.
                    </p>

                    <div className="mt-5 text-center text-sm">
                        <span className="text-gray-500">Já tem uma conta?</span>{" "}
                        <Link
                            href={`/login${callbackUrl !== "/dashboard" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
                            className="text-[#0A192F] font-semibold hover:underline"
                        >
                            Entrar
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default function RegisterPage() {
    return (
        <Suspense>
            <RegisterForm />
        </Suspense>
    )
}
