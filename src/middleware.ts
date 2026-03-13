export { default } from "next-auth/middleware"

export const config = {
    matcher: [] // Demo mode: No routes protected
    // matcher: ["/carteira/:path*", "/jornada/:path*", "/portfolio/:path*", "/planejamento/:path*", "/educacao/:path*", "/questionnaire/:path*"]
}
