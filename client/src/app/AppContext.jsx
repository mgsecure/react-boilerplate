import React, {useCallback, useContext, useMemo} from 'react'
import {useLocalStorage} from 'usehooks-ts'
const AppContext = React.createContext({})

export function AppProvider({children}) {

    const [admin, setAdmin] = useLocalStorage('lpuAdmin', false)
    const [beta, setBeta] = useLocalStorage('lpuBeta', false)

    const handleSetAdmin = useCallback(value => {
        setAdmin(value)
    }, [setBeta])

    const handleSetBeta = useCallback(value => {
        setBeta(value)
    }, [setBeta])

    const verbose = false

    const value = useMemo(() => ({
        admin,
        setAdmin: handleSetAdmin,
        beta,
        setBeta: handleSetBeta,
        verbose
    }), [admin, setAdmin, beta, handleSetBeta, verbose])

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContext
