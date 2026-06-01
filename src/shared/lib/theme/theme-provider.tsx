import {type ReactNode, useEffect, useMemo, useState} from "react";
import {localStorageKeys} from "../../config/localStorage-keys.ts";
import {ThemeContext, type Theme} from "./theme-context.ts";

const isTheme = (value: string | null): value is Theme => value === "light" || value === "dark"

const getInitialTheme = (): Theme => {
    const savedTheme = localStorage.getItem(localStorageKeys.theme)

    if (isTheme(savedTheme)) {
        return savedTheme
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

type Props = {
    children: ReactNode
}

export const ThemeProvider = ({children}: Props) => {
    const [theme, setTheme] = useState<Theme>(getInitialTheme)

    useEffect(() => {
        document.documentElement.dataset.theme = theme
        localStorage.setItem(localStorageKeys.theme, theme)
    }, [theme])

    const value = useMemo(() => ({
        theme,
        setTheme,
        toggleTheme: () => setTheme(currentTheme => currentTheme === "light" ? "dark" : "light"),
    }), [theme])

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}
