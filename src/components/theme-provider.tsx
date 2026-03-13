import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

type ThemeContextType = {
    theme: Theme
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    // Always use light theme
    const [theme] = useState<Theme>('light')

    useEffect(() => {
        // Remove dark class and ensure light mode
        document.documentElement.classList.remove('dark')
        document.documentElement.classList.add('light')
        // Clear any stored dark preference
        localStorage.setItem('theme', 'light')
    }, [])

    const toggleTheme = () => {
        // Theme toggle disabled - always light mode
        console.log('Theme toggle disabled - using light mode only')
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) throw new Error('useTheme must be used within ThemeProvider')
    return context
}
