"use client"

import {ThemeProvider as NextThemeProvider} from 'next-themes'
import React from 'react'
import ColorProvider from './color-provider'

export default function ThemeProvider({children, ...props}: React.ComponentProps<typeof NextThemeProvider>){
    return(
        <NextThemeProvider {...props}>
            <ColorProvider>{children}</ColorProvider>
        </NextThemeProvider>
    )
}