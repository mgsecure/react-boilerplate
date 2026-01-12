import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import React, {useCallback} from 'react'
import usePageTitle from '../util/usePageTitle.jsx'
import {useNavigate} from 'react-router-dom'

export default function NotFound() {
    usePageTitle('404')

    const navigate = useNavigate()
    const goHome = useCallback(() => {
        navigate('/')
    },[navigate])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', height: '70vh'
        }}>

            <Card style={{maxWidth: 350, marginLeft: 'auto', marginRight: 'auto', marginTop: 16}}>
                <CardHeader title='404'/>
                <CardContent>
                    Page Not Found. Sorry about that.
                </CardContent>
                <CardActions style={{display: 'flex', justifyContent: 'center'}}>
                    <Button onClick={goHome} color='secondary'>Home Page</Button>
                </CardActions>
            </Card>

        </div>
    )
}
