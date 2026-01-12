import React from 'react'
import Typography from '@mui/material/Typography'
import ToggleBetaButton from './ToggleBetaButton'
import ToggleColorMode from '../misc/ToggleColorMode.jsx'
import Link from '@mui/material/Link'
import {openInNewTab} from '../util/openInNewTab.js'

function Footer({extras, before}) {
    return (

        <Typography align='center' component='div' style={{marginTop: 16, marginBottom: 80}}>

            {before}

            <Link onClick={() => openInNewTab('https://www.reddit.com/r/espresso')}>
                r/Espresso
            </Link>
            &nbsp;&nbsp;•&nbsp;&nbsp;
            <Link onClick={() => openInNewTab('https://www.reddit.com/r/pourover')}>
                r/Pourover
            </Link>
            &nbsp;&nbsp;•&nbsp;&nbsp;
            <span style={{color: '#777'}}>
                Privacy
            </span>

            {extras}

            <div>
                <ToggleBetaButton/>
                <ToggleColorMode/>
            </div>
        </Typography>
    )
}

export default Footer
