"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps {
    value: number[]
    min?: number
    max?: number
    step?: number
    onValueChange?: (value: number[]) => void
    className?: string
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
    ({ value, min = 0, max = 100, step = 1, onValueChange, className }, ref) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            onValueChange?.([Number(e.target.value)])
        }

        const percentage = max === min ? 0 : ((value[0] - min) / (max - min)) * 100

        return (
            <div className={cn("relative flex items-center w-full", className)}>
                <div className="relative w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <div
                        className="absolute h-full bg-emerald-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <input
                    ref={ref}
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value[0]}
                    onChange={handleChange}
                    className="absolute w-full opacity-0 h-5 cursor-pointer"
                    style={{ margin: 0 }}
                />
                {/* Thumb visível */}
                <div
                    className="absolute w-5 h-5 rounded-full bg-white border-2 border-emerald-500 shadow-sm pointer-events-none"
                    style={{ left: `calc(${percentage}% - 10px)` }}
                />
            </div>
        )
    }
)
Slider.displayName = "Slider"

export { Slider }
