import React, {useCallback} from 'react'
import ToggleColorMode from '../misc/ToggleColorMode.jsx'
import lpuLogoBlack from '../resources/lpu-logo-black-bg.png'
import lpuLogoWhite from '../resources/lpu-logo-inverse.png'
import {useTheme} from '@mui/material/styles'
import Box from '@mui/material/Box'
import usePageTitle from '../util/usePageTitle.jsx'
import Link from '@mui/material/Link'
import {useNavigate} from 'react-router-dom'

export default function FrontPageRoute() {
    usePageTitle('Lockpickers United')
    const navigate = useNavigate()

    const theme = useTheme()
    const currentMode = theme.palette.mode

    const openInNewTab = useCallback((url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }, [])
    const handleClick = useCallback(url => () => {
        navigate(url)
    }, [navigate])


    const logo = currentMode === 'light' ? lpuLogoWhite : lpuLogoBlack

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', marginTop: 50
        }}>
            <div style={{fontSize: '2.5rem', fontWeight: 700}}>Lockpickers United</div>
            <Box component='img' alt='Lock Pickers United' src={logo} style={{
                marginLeft: 'auto', marginRight: 'auto', display: 'block',
                width: 200, margin: '30px 0px 30px'
            }}/>

            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', fontWeight: 600}}>
                <Link onClick={()=> openInNewTab('https://discord.com/invite/lockpicking')}>discord</Link>&nbsp;&nbsp;•&nbsp;&nbsp;
                <Link onClick={()=> openInNewTab('https://www.reddit.com/r/lockpicking/')}>reddit</Link>&nbsp;&nbsp;•&nbsp;&nbsp;
                <Link onClick={()=> openInNewTab('https://lpubelts.com')}>lpubelts.com</Link>
            </div>

            <div style={{fontSize: '0.85rem', fontWeight: 500, marginTop: 15, marginBottom:1}}>lpulocks.com</div>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', fontWeight: 500}}>
                <Link onClick={()=> openInNewTab('https://lpulocks.com/#/lockbazaar')}>#lock-bazaar</Link>&nbsp;•&nbsp;
                <Link onClick={()=> openInNewTab('https://lpulocks.com/#/challengelocks')}>challenge locks</Link>&nbsp;•&nbsp;
                <Link onClick={()=> openInNewTab('https://lpulocks.com/#/speedpicks')}>speed picks</Link>
            </div>

            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 15, fontWeight: 500}}>
                <Link onClick={handleClick('/modbox')}>suggestion box</Link>
            </div>

            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 40}}>
                <Link onClick={()=> openInNewTab('https://github.com/Lockpickers-United')}>github</Link>
            </div>

            <div style={{height:30}}/>
            <ToggleColorMode/>
        </div>
    )
}
