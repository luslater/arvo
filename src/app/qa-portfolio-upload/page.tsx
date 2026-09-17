"use client"

import { useState } from "react"
import { readPortfolioFile } from "@/lib/portfolio-file-reader"

export default function PortfolioUploadQaPage() {
  const [result, setResult] = useState("Aguardando arquivo")

  return (
    <main style={{ padding: 32 }}>
      <label htmlFor="qa-file">Arquivo de teste</label>
      <input
        id="qa-file"
        type="file"
        accept=".pdf,.xlsx,.xls,.csv,.txt"
        onChange={async event => {
          const file = event.target.files?.[0]
          if (!file) return
          try {
            setResult(JSON.stringify(await readPortfolioFile(file)))
          } catch (error) {
            setResult(error instanceof Error ? error.message : "Erro")
          }
        }}
      />
      <output style={{ display: "block", marginTop: 16, whiteSpace: "pre-wrap" }}>{result}</output>
    </main>
  )
}
