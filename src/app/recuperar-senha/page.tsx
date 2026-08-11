"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RecuperarSenha() {
    const [identifier, setIdentifier] = useState("")
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
    const [message, setMessage] = useState("")
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus("loading")
        
        try {
            const res = await fetch('/api/auth/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier })
            })
            
            const data = await res.json()
            
            if (res.ok) {
                setStatus("success")
                setMessage(data.message || "Email de recuperação enviado! Verifique sua caixa de entrada (e spam).")
            } else {
                setStatus("error")
                setMessage(data.error || "Ocorreu um erro ao tentar recuperar a senha.")
            }
        } catch (err) {
            setStatus("error")
            setMessage("Erro de conexão. Tente novamente.")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center mb-4">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-semibold mb-2">Recuperar Senha</h1>
                    <p className="text-sm text-gray-500 text-center">
                        Digite seu email ou CPF para receber as instruções de recuperação de senha.
                    </p>
                </div>

                {status === "success" ? (
                    <div className="p-4 mb-6 bg-green-50 text-green-700 text-sm rounded-md border border-green-100 text-center">
                        {message}
                        <button 
                            onClick={() => router.push('/login')}
                            className="mt-4 w-full px-4 py-2 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition-colors"
                        >
                            Voltar para o Login
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {status === "error" && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
                                {message}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="identifier" className="text-sm font-medium">
                                Email, CPF ou CNPJ
                            </label>
                            <input
                                id="identifier"
                                type="text"
                                placeholder="Seu email ou CPF/CNPJ"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="w-full px-4 py-2 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                            >
                                {status === "loading" ? "Enviando..." : "Enviar instruções"}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push('/login')}
                                className="w-full px-4 py-2 bg-white text-gray-900 rounded-md font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                Voltar
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
