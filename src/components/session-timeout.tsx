"use client"

import { useEffect, useRef } from "react"
import { signOut, useSession } from "next-auth/react"

// 2 hours in milliseconds
const TIMEOUT_MS = 2 * 60 * 60 * 1000

export function SessionTimeout() {
    const { data: session } = useSession()
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (!session) return

        const handleActivity = () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }
            timerRef.current = setTimeout(() => {
                signOut({ callbackUrl: '/login' })
            }, TIMEOUT_MS)
        }

        // Initialize timer
        handleActivity()

        // Listen for activity
        const events = ['mousemove', 'keydown', 'mousedown', 'scroll', 'touchstart']
        events.forEach(event => {
            window.addEventListener(event, handleActivity, { passive: true })
        })

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }
            events.forEach(event => {
                window.removeEventListener(event, handleActivity)
            })
        }
    }, [session])

    return null
}
