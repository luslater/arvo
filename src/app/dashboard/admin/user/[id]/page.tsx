import { redirect } from "next/navigation"

export default function AdminUserPage() {
    // Para simplificar agora, informamos que a visualização de carteira de usuário está em construção
    return (
        <div className="min-h-screen bg-[#f6f4ef] font-sans flex items-center justify-center p-6">
            <div className="bg-white p-8 rounded-2xl border border-[#e4e0d7] shadow-sm max-w-md text-center">
                <h1 className="text-2xl font-bold text-[#123044] mb-4">Em construção</h1>
                <p className="text-[#667085] mb-6">A visualização detalhada da carteira do cliente pelo painel do gestor estará disponível em breve.</p>
                <a href="/dashboard/admin" className="inline-block bg-[#4fa080] text-white px-6 py-2 rounded-xl font-bold hover:bg-[#3d8368] transition">Voltar para o painel</a>
            </div>
        </div>
    )
}
