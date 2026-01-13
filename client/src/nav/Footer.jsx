import React from 'react'
import Typography from '@mui/material/Typography'
import ToggleBetaButton from './ToggleBetaButton'
import ToggleColorMode from '../misc/ToggleColorMode.jsx'
import Link from '@mui/material/Link'
import {openInNewTab} from '../util/openInNewTab'
import {useNavigate} from 'react-router-dom'

function Footer({extras, before}) {
    const navigate = useNavigate()

    return (

        <Typography align='center' component='div' style={{marginTop: 0, marginBottom: 80}}>

            {before}

            <div style={{margin: '20px 0px'}}/>

            <Link onClick={() => openInNewTab('https://www.reddit.com/r/espresso')}>
                r/Espresso
            </Link>
            &nbsp;&nbsp;•&nbsp;&nbsp;
            <Link onClick={() => openInNewTab('https://www.reddit.com/r/pourover')}>
                r/Pourover
            </Link>
            &nbsp;&nbsp;•&nbsp;&nbsp;
            <Link onClick={() => navigate('/privacy')}>
                Privacy
            </Link>

            {extras}

            <div>
                <ToggleBetaButton/>
                <ToggleColorMode/>
            </div>
        </Typography>
    )
}

export default Footer
