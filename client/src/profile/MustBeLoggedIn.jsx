import CardHeader from '@mui/material/CardHeader'
import React from 'react'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import SignInButton from '../auth/SignInButton.jsx'
import {useTheme} from '@mui/material/styles'

export default function MustBeLoggedIn({actionText = 'track your coffees'}) {
    const theme= useTheme()

    return (
        <div
            style={{
                display: 'flex', flexDirection: 'column',
                backgroundColor: theme.palette.card?.main,
                marginBottom: 20,
                placeContent: 'center',
                fontSize: '1.4rem',
                fontWeight: 500,
                textAlign: 'center',
                padding: 40,
                borderRadius: 5,
                minWidth: 350
            }}>
            <div>
            You must be logged in to<br/>
            {actionText}.
            </div>

            <div style={{marginTop:30, placeContent: 'center', display: 'flex'}}>
                <SignInButton/>
            </div>

        </div>
    )
}
