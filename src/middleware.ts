// Redirecionamento de domínio e Proteção de Rotas
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token
        const { pathname } = req.nextUrl

        // Allow public pages regardless
        if (
            pathname === "/" ||
            pathname === "/login" ||
            pathname === "/register" ||
            pathname === "/pending" ||
            pathname === "/checkout" ||
            pathname.startsWith("/demo") ||
            pathname.startsWith("/api") ||
            pathname.includes(".")
        ) {
            return NextResponse.next()
        }

        // If user is logged in but PENDING, redirect to /pending
        // @ts-ignore
        const accountStatus = token?.accountStatus
        if (accountStatus === "PENDING" && pathname !== "/pending") {
            return NextResponse.redirect(new URL("/pending", req.url))
        }

        // If user is REJECTED, redirect to login with message
        if (accountStatus === "REJECTED" && pathname !== "/login") {
            return NextResponse.redirect(new URL("/login?error=rejected", req.url))
        }

        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl
                // Public pages — no auth required
                if (
                    pathname === "/" ||
                    pathname === "/login" ||
                    pathname === "/register" ||
                    pathname === "/pending" ||
                    pathname === "/checkout" ||
                    pathname.startsWith("/demo") ||
                    pathname.startsWith("/api") ||
                    pathname.includes(".")
                ) {
                    return true
                }
                // All other routes require login
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
