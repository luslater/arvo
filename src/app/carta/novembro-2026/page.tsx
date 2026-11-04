import fs from "node:fs"
import path from "node:path"
import type { Metadata } from "next"
import "./carta.css"
import { CartaView } from "./carta-view"

const TITLE = "Carta mensal · Novembro 2026"
const DESCRIPTION =
    "O choque do segundo turno, a curva de juros, as gestoras medidas pelas cotas e as carteiras ARVO no teste de outubro de 2026."

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "/carta/novembro-2026" },
    openGraph: {
        type: "article",
        locale: "pt_BR",
        url: "/carta/novembro-2026",
        title: `${TITLE} | ARVO`,
        description: DESCRIPTION,
    },
    twitter: { card: "summary_large_image", title: `${TITLE} | ARVO`, description: DESCRIPTION },
}

export const dynamic = "force-static"

export default function CartaNovembro2026Page() {
    const html = fs.readFileSync(path.join(process.cwd(), "src/app/carta/novembro-2026/content.html"), "utf8")
    return <CartaView html={html} />
}
