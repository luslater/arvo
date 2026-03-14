// Redirecionamento de domínio e Proteção de Rotas
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token
        const { pathname } = req.nextUrl
        const isPremiumRoute =
            pathname.startsWith("/dashboard") ||
            pathname.startsWith("/portfolio") ||
            pathname.startsWith("/carteira") ||
            pathname.startsWith("/jornada") ||
            pathname.startsWith("/educacao") ||
            pathname.startsWith("/onboarding") ||
            pathname.startsWith("/questionnaire") ||
            pathname.startsWith("/funds") ||
            pathname === "/planejamento"

        // Se for uma rota premium e o usuário não for PREMIUM ou ADMIN, redireciona para checkout
        if (isPremiumRoute && token?.subscriptionStatus !== "PREMIUM" && token?.subscriptionStatus !== "ADMIN") {
            return NextResponse.redirect(new URL("/checkout", req.url))
        }

        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl
                // Rotas que NÃO precisam de login (Públicas)
                if (
                    pathname === "/" ||
                    pathname === "/login" ||
                    pathname === "/register" ||
                    pathname === "/checkout" || // Permite ver a página de venda
                    pathname.startsWith("/demo") || // Futura página de simulador liberado
                    pathname.startsWith("/api") ||
                    pathname.includes(".")
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
