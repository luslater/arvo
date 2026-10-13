"use client"

import { useEffect, useRef } from "react"
import { initCarta } from "./carta-init"

/**
 * Renderiza o conteúdo da carta (HTML estático gerado a partir do material original)
 * e liga os gráficos e abas interativos. Sempre reinicia a partir do HTML original
 * antes de inicializar, para que o efeito possa rodar mais de uma vez sem duplicar eventos.
 */
export function CartaView({ html }: { html: string }) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        el.innerHTML = html
        return initCarta()
    }, [html])

    return (
        <div className="carta">
            <div ref={ref} className="carta-frame" />
            <div className="tip" aria-hidden="true" />
        </div>
    )
}
