"use client"

import React, { useEffect } from "react";
import {ThemeProvider as NextThemeProvider, useTheme} from 'next-themes'
import useColorStore from "@/hooks/use-color-store";

export default function ColorProvider({children, ...props}:React.ComponentProps<typeof NextThemeProvider>){
    const theme = useTheme()
    const {color, updateCssVariables} = useColorStore(theme.theme)

useEffect(() => {
        // Add a small delay to ensure document is ready
        const timeoutId = setTimeout(() => {
            updateCssVariables()
        }, 0)

        return () => clearTimeout(timeoutId)
    }, [color, theme, updateCssVariables])

    useEffect(()=>{
        updateCssVariables()
    },[color, theme])

    return(
        <NextThemeProvider {...props}>{children}</NextThemeProvider>
    )
}