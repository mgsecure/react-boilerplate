import React from 'react'
import {SnackbarProvider} from 'notistack'
import AppRoutes from './AppRoutes'
import initializeLocales from '../util/datetime'
import {ColorModeProvider} from './ColorModeContext.jsx'
import {AppProvider} from './AppContext'

initializeLocales()

function App() {
    return (
        <ColorModeProvider>
            <SnackbarProvider autoHideDuration={3000}>
                <AppProvider>
                    <AppRoutes/>
                </AppProvider>
            </SnackbarProvider>
        </ColorModeProvider>
    )
}

export default App
