import React, {useContext} from 'react'
import SignInButton from '../auth/SignInButton.jsx'
import {useTheme} from '@mui/material/styles'
import AuthContext from '../app/AuthContext.jsx'

export default function MustBeLoggedIn({actionText = 'track your coffees'}) {
    const theme= useTheme()
    const {isLoggedIn} = useContext(AuthContext)

    if (isLoggedIn) return null

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
