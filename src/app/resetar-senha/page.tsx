"use client"

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function ResetarSenhaForm() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
    const [message, setMessage] = useState("")
    const router = useRouter()
    
    // In Next.js 13/14 App Router, useSearchParams is the proper way to get query params
    const searchParams = useSearchParams()
    const token = searchParams ? searchParams.get('token') : null

    useEffect(() => {
        if (!token && typeof window !== 'undefined') {
            setStatus("error")
            setMessage("Link inválido ou ausente. Por favor, solicite a recuperação novamente.")
        }
    }, [token])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setStatus("error")
            setMessage("As senhas não coincidem.")
            return
        }

        if (password.length < 6) {
            setStatus("error")
            setMessage("A senha deve ter no mínimo 6 caracteres.")
            return
        }

        setStatus("loading")
        
        try {
            const res = await fetch('/api/auth/reset/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password })
            })
            
            const data = await res.json()
            
            if (res.ok) {
                setStatus("success")
                setMessage("Senha alterada com sucesso!")
                setTimeout(() => router.push('/login'), 2500)
            } else {
                setStatus("error")
                setMessage(data.error || "Ocorreu um erro ao redefinir a senha. O link pode ter expirado.")
            }
        } catch (err) {
            setStatus("error")
            setMessage("Erro de conexão. Tente novamente.")
        }
    }

    return (
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="flex flex-col items-center mb-8">
                <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center mb-4">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-semibold mb-2">Redefinir Senha</h1>
                <p className="text-sm text-gray-500 text-center">
                    Digite sua nova senha abaixo.
                </p>
            </div>

            {status === "success" ? (
                <div className="p-4 mb-6 bg-green-50 text-green-700 text-sm rounded-md border border-green-100 text-center">
                    {message}
                    <p className="text-xs mt-2 text-green-600">Redirecionando para o login...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {status === "error" && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
                            {message}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">
                            Nova Senha
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="text-sm font-medium">
                            Confirmar Nova Senha
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            type="submit"
                            disabled={status === "loading" || !token}
                            className="w-full px-4 py-2 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                        >
                            {status === "loading" ? "Salvando..." : "Redefinir Senha"}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push('/login')}
                            className="w-full px-4 py-2 bg-white text-gray-900 rounded-md font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            )}
        </div>
    )
}

export default function ResetarSenha() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900 p-4">
            <Suspense fallback={<div className="p-8 text-center">Carregando...</div>}>
                <ResetarSenhaForm />
            </Suspense>
        </div>
    )
}
