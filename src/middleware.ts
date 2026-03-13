// Redirecionamento de domínio e Proteção de Rotas
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        const url = req.nextUrl.clone()
        const hostname = req.headers.get("host") || ""

        // Se o usuário acessar com www., redirecionamos para a versão sem www
        // Isso resolve o erro de redirect_uri_mismatch do Google de forma definitiva
        if (hostname.startsWith("www.meuarvo.com.br")) {
            url.hostname = "meuarvo.com.br"
            url.port = ""
            return NextResponse.redirect(url, 301)
        }

        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl
                // Rotas que NÃO precisam de login
                if (
                    pathname === "/" ||
                    pathname === "/login" ||
                    pathname === "/register" ||
                    pathname.startsWith("/api") ||
                    pathname.includes(".") // arquivos estáticos
                ) {
                    return true
                }
                // Todas as outras rotas exigem token (estar logado)
                return !!token
            },
        },
        pages: {
            signIn: "/login",
        },
    }
)

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
