import React from 'react'
import ToggleColorMode from '../misc/ToggleColorMode.jsx'
import lpuLogoBlack from '../resources/lpu-logo-black-bg.png'
import lpuLogoWhite from '../resources/lpu-logo-inverse.png'
import {useTheme} from '@mui/material/styles'
import Box from '@mui/material/Box'
import usePageTitle from '../util/usePageTitle.jsx'

export default function FrontPageRoute() {
    usePageTitle('Lockpickers United')

    const theme = useTheme()
    const currentMode = theme.palette.mode

    const logo = currentMode === 'light' ? lpuLogoWhite : lpuLogoBlack

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', height: '80vh'
        }}>
            <div style={{fontSize:'2.5rem', fontWeight: 700}}>Lockpickers United</div>
            <Box component="img" alt='Lock Pickers United' src={logo} style={{
                marginLeft: 'auto', marginRight: 'auto', display: 'block',
                width:350, margin: '30px 0px 50px'
            }}/>
            <ToggleColorMode/>
        </div>
    )
}
