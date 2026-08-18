import Link from "next/link";
import Image from "next/image";
import { Compass, Map, ArrowLeft, Home, Sparkles } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#fcfaf7] text-[#123044] flex flex-col justify-between p-6 sm:p-12 font-sans selection:bg-[#1f674f]/15">
            {/* Header */}
            <header className="flex items-center justify-between max-w-6xl w-full mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <Image
                        src="/meu-arvo-logo.png"
                        alt="ARVO Orientação Financeira"
                        width={90}
                        height={40}
                        className="h-8 w-auto object-contain"
                        priority
                    />
                </Link>
                <Link
                    href="/dashboard"
                    className="text-xs font-semibold text-[#667085] hover:text-[#123044] transition-colors"
                >
                    Acessar Plataforma &rarr;
                </Link>
            </header>

            {/* Main Content */}
            <main className="max-w-xl w-full mx-auto my-auto text-center space-y-8 py-12">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0ece1] text-[#1f674f] text-xs font-bold tracking-widest uppercase border border-[#e4e0d7]">
                    <Sparkles className="w-3.5 h-3.5" />
                    Erro 404 · Rota Fora da Bússola
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#123044] leading-tight">
                        Parece que você <br />
                        <span className="font-serif italic font-normal text-[#1f674f]">mudou de rumo.</span>
                    </h1>
                    <p className="text-sm sm:text-base font-light text-[#667085] max-w-md mx-auto leading-relaxed">
                        A página que você estava procurando não existe ou foi movida. Vamos te colocar de volta no caminho certo.
                    </p>
                </div>

                {/* Quick Navigation CTAs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <Link
                        href="/dashboard/jornada"
                        className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#123044] text-white font-semibold text-sm hover:bg-[#1b435e] transition-all shadow-sm hover:shadow group"
                    >
                        <Map className="w-4 h-4 text-[#34d399] group-hover:scale-110 transition-transform" />
                        Ir para a Jornada
                    </Link>

                    <Link
                        href="/dashboard/bussola"
                        className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white text-[#123044] font-semibold text-sm border border-[#e4e0d7] hover:bg-[#f4efe6] transition-all shadow-sm group"
                    >
                        <Compass className="w-4 h-4 text-[#1f674f] group-hover:rotate-45 transition-transform" />
                        Bússola de Carteiras
                    </Link>
                </div>

                <div className="pt-2">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-xs font-medium text-[#8d97a5] hover:text-[#123044] transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Voltar para a Página Inicial
                    </Link>
                </div>
            </main>

            {/* Footer */}
            <footer className="text-center text-xs text-[#8d97a5] font-light max-w-6xl w-full mx-auto">
                &copy; {new Date().getFullYear()} ARVO Orientação Financeira Independente. Todos os direitos reservados.
            </footer>
        </div>
    );
}
