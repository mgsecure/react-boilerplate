import React, {useCallback, useMemo} from 'react'
import {useLocalStorage} from 'usehooks-ts'
const AppContext = React.createContext({})

export function AppProvider({children}) {

    const [adminEnabled, setAdminEnabled] = useLocalStorage('adminEnabled', false)
    const [beta, setBeta] = useLocalStorage('beta', false)
    const [demo, setDemo] = useLocalStorage('demo', false)

    const handleSetAdmin = useCallback(value => {
        setAdminEnabled(value)
    }, [setAdminEnabled])

    const handleSetBeta = useCallback(value => {
        setBeta(value)
    }, [setBeta])

    const handleSetDemo = useCallback(value => {
        setDemo(value)
    }, [setDemo])

    const verbose = false

    const value = useMemo(() => ({
        adminEnabled,
        setAdminEnabled: handleSetAdmin,
        beta,
        setBeta: handleSetBeta,
        demo,
        setDemo: handleSetDemo,
        verbose
    }), [adminEnabled, handleSetAdmin, beta, handleSetBeta, demo, handleSetDemo, verbose])

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContext
