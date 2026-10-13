import fs from "node:fs"
import path from "node:path"
import type { Metadata } from "next"
import "./carta.css"
import { CartaView } from "./carta-view"

const TITLE = "Carta mensal · Outubro 2026"
const DESCRIPTION =
    "Cenário, leitura das gestoras, asset allocation e as carteiras ARVO à luz das cartas de outubro de 2026."

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "/carta/outubro-2026" },
    openGraph: {
        type: "article",
        locale: "pt_BR",
        url: "/carta/outubro-2026",
        title: `${TITLE} | ARVO`,
        description: DESCRIPTION,
    },
    twitter: { card: "summary_large_image", title: `${TITLE} | ARVO`, description: DESCRIPTION },
}

export const dynamic = "force-static"

export default function CartaOutubro2026Page() {
    const html = fs.readFileSync(path.join(process.cwd(), "src/app/carta/outubro-2026/content.html"), "utf8")
    return <CartaView html={html} />
}
