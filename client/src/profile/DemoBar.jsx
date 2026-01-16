import React, {useContext} from 'react'
import DBContext from '../app/DBContext.jsx'
import Switch from '@mui/material/Switch'
import AuthContext from '../app/AuthContext.jsx'


export default function DemoBar() {

    const {authLoaded, isLoggedIn} = useContext(AuthContext)
    const {demo, setDemo} = useContext(DBContext)

    if (!authLoaded || isLoggedIn) return null

    return (
        <div style={{display: 'flex', alignItems: 'center', width: '100%', marginTop: 10,
            backgroundColor: demo ? '#262636' : '#262636',
            borderRadius: 5, padding: 4}}>
            <div style={{padding: 0, flexGrow: 1, textAlign: 'right'}}>
                { demo
                ? <span><strong>Demo Mode Activated</strong></span>
                : <span><strong>New Here?</strong> Try out Demo Mode!</span>
                }
            </div>
            <div style={{padding: '0px 12px'}}>
                <Switch
                    checked={demo}
                    onChange={(e) => setDemo(e.target.checked)}
                    name='demoMode'
                    color='primary'
                />
            </div>

        </div>
    )
}
