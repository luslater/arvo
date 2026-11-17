import fs from "node:fs"
import path from "node:path"
import { NextResponse } from "next/server"

export const dynamic = "force-static"

export async function GET() {
    const filePath = path.join(process.cwd(), "public", "apresentacao.html")
    const html = fs.readFileSync(filePath, "utf8")
    return new NextResponse(html, {
        status: 200,
        headers: {
            "Content-Type": "text/html; charset=utf-8",
        },
    })
}
