import React, {useContext} from 'react'
import ToggleColorMode from '../misc/ToggleColorMode.jsx'
import AppContext from '../app/AppContext.jsx'
import DBContext from '../app/DBContext.jsx'
import Switch from '@mui/material/Switch'
import AuthContext from '../app/AuthContext.jsx'


export default function DemoBar() {

    const {isLoggedIn} = useContext(AuthContext)
    const {demo, setDemo} = useContext(DBContext)

    if (isLoggedIn) return null

    return (
        <div style={{display: 'flex', alignItems: 'center', width:'100%', paddingTop:10}}>
            <div style={{padding: 0, flexGrow: 1, textAlign: 'right'}}>
                <strong>New Here?</strong> Try out Demo Mode!
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
