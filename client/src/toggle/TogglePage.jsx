import React, {useContext} from 'react'
import ToggleColorMode from '../misc/ToggleColorMode.jsx'
import AppContext from '../app/AppContext.jsx'
import Switch from '@mui/material/Switch'


export default function TogglePage() {

    const {admin, setAdmin, beta, setBeta} = useContext(AppContext)
    return (
        <React.Fragment>
            <div style={{padding: 44}}>
                <h1>Toggle!</h1>

                <table style={{borderCollapse: 'collapse', maxWidth: '100%'}}>
                    <thead>
                    <tr>
                        <th style={{textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid #ccc'}}>Setting</th>
                        <th style={{textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid #ccc'}}>Value</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td style={{padding: '8px 12px'}}>Admin Mode</td>
                        <td style={{padding: '8px 12px'}}>
                            <Switch
                                checked={admin}
                                onChange={(e) => setAdmin(e.target.checked)}
                                name='adminMode'
                                color='primary'
                            />
                        </td>
                    </tr>
                    <tr>
                        <td style={{padding: '8px 12px'}}>Beta Mode</td>
                        <td style={{padding: '8px 12px'}}>
                            <Switch
                                checked={beta}
                                onChange={(e) => setBeta(e.target.checked)}
                                name='betaMode'
                                color='primary'
                            />
                        </td>
                    </tr>
                    </tbody>
                </table>

            </div>

            <ToggleColorMode/>
        </React.Fragment>
    )
}
