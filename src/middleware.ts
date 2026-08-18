import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token
        const { pathname } = req.nextUrl

        // 1. Allow public pages and assets
        if (
            pathname === "/" ||
            pathname === "/login" ||
            pathname === "/register" ||
            pathname === "/pending" ||
            pathname === "/checkout" ||
            pathname.startsWith("/api/auth") ||
            pathname.startsWith("/preview") ||
            pathname.startsWith("/demo") ||
            pathname.startsWith("/escada") ||
            pathname.includes(".")
        ) {
            return NextResponse.next()
        }

        // 2. If user is logged in but status is PENDING, restrict to /pending
        const accountStatus = token?.accountStatus
        if (accountStatus === "PENDING" && pathname !== "/pending") {
            return NextResponse.redirect(new URL("/pending", req.url))
        }

        // 3. If user is REJECTED, redirect to login
        if (accountStatus === "REJECTED" && pathname !== "/login") {
            return NextResponse.redirect(new URL("/login?error=rejected", req.url))
        }

        // 4. Admin Route Protection
        if (pathname.startsWith("/dashboard/admin") || pathname.startsWith("/api/admin")) {
            // @ts-ignore
            const userRole = token?.role || (token?.subscriptionStatus === "ADMIN" ? "ADMIN" : "USER")
            // @ts-ignore
            const isLucasAdmin = token?.email?.includes("lucas")
            if (userRole !== "ADMIN" && !isLucasAdmin) {
                return NextResponse.redirect(new URL("/dashboard", req.url))
            }
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
                    pathname.startsWith("/api/auth") ||
                    pathname.startsWith("/preview") ||
                    pathname.startsWith("/demo") ||
                    pathname.startsWith("/escada") ||
                    pathname.includes(".")
                ) {
                    return true
                }
                // All protected routes (dashboard, user APIs) require valid token
                return !!token
            },
        },
        pages: {
            signIn: "/login",
        },
    }
)

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/api/user/:path*",
        "/api/admin/:path*",
        "/pending",
    ],
}
