import React from 'react'
import {SnackbarProvider} from 'notistack'
import AppRoutes from './AppRoutes'
import initializeLocales from '../util/datetime'
import {ColorModeProvider} from './ColorModeContext.jsx'
import {AppProvider} from './AppContext'
import {AuthProvider} from './AuthContext.jsx'
import {DBProvider} from './DBContext.jsx'

initializeLocales()

function App() {
    return (
        <ColorModeProvider>
            <SnackbarProvider autoHideDuration={3000}>
                <AuthProvider>
                    <DBProvider>
                        <AppProvider>
                            <AppRoutes/>
                        </AppProvider>
                    </DBProvider>
                </AuthProvider>
            </SnackbarProvider>
        </ColorModeProvider>
    )
}

export default App
