import { withAuth } from "next-auth/middleware"

export default withAuth({
    pages: {
        signIn: "/login",
    },
})

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
