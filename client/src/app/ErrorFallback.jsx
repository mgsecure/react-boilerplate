import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import React, {useCallback} from 'react'

function ErrorFallback() {

    const handleClick = useCallback(() => {
        window.location.reload()
    }, [])

    return (
        <React.Fragment>

            <Card style={{maxWidth: 350, marginLeft: 'auto', marginRight: 'auto', marginTop: 16}}>
                <CardHeader title='Oops'/>
                <CardContent>
                    An unexpected error occurred. Sorry about that. Please reload the page.
                </CardContent>
                <CardActions>
                    <Button onClick={handleClick} color='secondary'>Reload</Button>
                </CardActions>
            </Card>

        </React.Fragment>
    )
}

export default ErrorFallback
