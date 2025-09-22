import React, {createContext, useMemo, useState} from 'react'
import {ThemeProvider, createTheme} from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import {lightOverrides} from './themeOverride.js'

const ColorModeContext = createContext({
    toggleColorMode: () => {
    }
})

export function ColorModeProvider({children}) {

    const darkTheme = createTheme({
        typography: {fontFamily: 'Roboto, sans-serif'},
        palette: {
            mode: 'dark',
            secondary: {
                main: '#2d49bc'
            },
            aTest: {
                main: '#ff0000'
            }
        },
        components: {
            MuiLink: {
                styleOverrides: {
                    root: {
                        textDecoration: 'none',
                        cursor: 'pointer'
                    }
                }
            }
        }
    })

    const lightTheme = createTheme({
        palette: {
            mode: 'light'
        },
        typography: {fontFamily: 'Roboto, sans-serif'},
        components: {
            MuiLink: {
                styleOverrides: {
                    root: {
                        textDecoration: 'none',
                        cursor: 'pointer'
                    }
                }
            }
        }
    })

    const [mode, setMode] = useState('light')
    const colorMode = React.useMemo(() => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
            }
        }),
        []
    )

    const theme = useMemo(() =>
            mode === 'light'
                ? {...lightTheme, ...lightOverrides}
                : darkTheme,
        [darkTheme, lightTheme, mode]
    )

    const style = getRootStyle(theme)

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline enableColorScheme/>
                <style>{style}</style>

                {children}

            </ThemeProvider>
        </ColorModeContext.Provider>
    )
}

export default ColorModeContext

const getRootStyle = styleTheme => {
    //const linkTextColor = styleTheme.palette.text.primary.icon
    const linkTextColor = styleTheme.palette.primary.dark
    const backgroundColor = styleTheme.palette.background.default

    return `
            body {
                background-color: ${backgroundColor};
                margin: 0;
                padding: 0;
            }
            
            a {
                color: ${linkTextColor};
                textDecoration: 'none';
                cursor: 'pointer';
            }
            
            pre{ 
                white-space: pre-wrap; 
                word-break: break-word;
            }
            
            :root {
              color-scheme: dark;
              overflow-y: scroll;
            }
        `
}
