import React from 'react'
import Typography from '@mui/material/Typography'
import ToggleBetaButton from './ToggleBetaButton'
import ToggleColorMode from '../misc/ToggleColorMode.jsx'

function Footer({extras, before}) {
    return (

        <Typography align='center' component='div' style={{marginTop: 16, marginBottom: 80}}>

            {before}

            <a href='https://www.reddit.com/r/espresso/' target='_blank' rel='noopener noreferrer'>
                Reddit
            </a>
            &nbsp;•&nbsp;
            <span style={{color: '#777'}}>
                YouTube
            </span>
            &nbsp;•&nbsp;
            <span style={{color: '#777'}}>
                Usage
            </span>
            &nbsp;•&nbsp;
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
