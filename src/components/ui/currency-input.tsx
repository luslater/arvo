"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
    value: number
    onChange: (value: number) => void
}

export function CurrencyInput({ value, onChange, className, ...props }: CurrencyInputProps) {
    const [displayValue, setDisplayValue] = React.useState("")

    React.useEffect(() => {
        // Format initial value
        if (value !== undefined) {
            const formatted = new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(value)
            setDisplayValue(formatted)
        }
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value

        // Remove non-digits
        const digits = inputValue.replace(/\D/g, "")

        // Convert to number (cents)
        const numberValue = Number(digits) / 100

        // Update parent with number
        onChange(numberValue)

        // Update display with formatted string
        // We don't rely on useEffect here to avoid cursor jumping issues if we were to force format immediately
        // But for simplicity in this custom input, we can just let the parent update the value prop
        // which triggers the useEffect. 
        // However, to keep it smooth, we might want to update display immediately?
        // Actually, relying on useEffect is safer for consistency but might cause cursor jumps.
        // Let's try simple approach first.
    }

    return (
        <Input
            {...props}
            type="text"
            value={displayValue}
            onChange={handleChange}
            className={className}
            placeholder="R$ 0,00"
        />
    )
}
