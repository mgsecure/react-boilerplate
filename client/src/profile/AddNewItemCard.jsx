import React, {useCallback, useState} from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import ItemDrawer from './ItemDrawer.jsx'

export default function AddNewItemCard({type = 'Bean', count = 10}) {

    const [open, setOpen] = useState(false)
    const handleCardClick = useCallback(() => {
        setOpen(true)
    }, [])

    return (
        <React.Fragment>
            <Card
                onClick={handleCardClick} sx={{height: '100%'}}
                style={{
                    backgroundColor: '#805046',
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
                        marginTop:2
                    }}>
                        Add {count > 0 ? 'New ' : ''}{type}
                    </div>
                </CardContent>

            </Card>

            <ItemDrawer open={open} setOpen={setOpen} type={type}/>

        </React.Fragment>

    )
}
