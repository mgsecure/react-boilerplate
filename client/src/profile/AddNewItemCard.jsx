import React, {useCallback, useState} from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import ItemDrawer from './ItemDrawer.jsx'
import {useTheme} from '@mui/material/styles'

export default function AddNewItemCard({label, type = 'Entry', count = 0, defaultValue, action}) {
    const [open, setOpen] = useState(false)
    const handleCardClick = useCallback(() => {
        setOpen(true)
    }, [])

    const theme = useTheme()

    return (
        <React.Fragment>
            <Card
                onClick={handleCardClick} sx={{height: '100%'}}
                style={{
                    backgroundColor: theme.palette.card?.add,
                    color: '#fff',
                    boxShadow: 'unset',
                    padding: '0px',
                    placeContent: 'center',
                    cursor: 'pointer'
                }}>

                <CardContent style={{display: 'flex', placeContent: 'center', width: '100%'}}>
                    <div style={{
                        fontSize: '1.1rem',
                        fontWeight: 500,
                        textAlign: 'center',
                        marginTop: 2
                    }}>
                        {label || `Add ${count > 0 ? 'New ' : ''}${type}`}
                    </div>
                </CardContent>

            </Card>

            <ItemDrawer open={open} setOpen={setOpen} type={type} defaultValue={defaultValue} action={action}/>

        </React.Fragment>

    )
}
