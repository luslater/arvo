import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        const url = req.nextUrl.clone()
        const hostname = req.headers.get("host") || ""

        // Se o usuário acessar com www., redirecionamos para a versão sem www
        // Isso resolve o erro de redirect_uri_mismatch do Google e mantém a sessão estável
        if (hostname.startsWith("www.meuarvo.com.br")) {
            url.hostname = "meuarvo.com.br"
            url.port = "" // Garante que não leve porta de dev para prod
            return NextResponse.redirect(url, 301)
        }

        return NextResponse.next()
    },
    {
        pages: {
            signIn: "/login",
        },
    }
)

export const config = {
    matcher: [
        "/carteira/:path*",
        "/dashboard/:path*",
        "/planejamento/:path*",
        "/onboarding/:path*",
        "/jornada/:path*",
        "/portfolio/:path*",
    ]
}
