import React, {useCallback, useState} from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import MachineDialog from './MachineDialog.jsx'

export default function AddMachineCard() {

    const [open, setOpen] = useState(false)

    const handleCardClick = useCallback(() => {
        setOpen(true)
    }, [])

    return (
        <React.Fragment>
            <Card style={{
                backgroundColor: '#805046',
                color: '#fff',
                boxShadow: 'unset',
                padding: '0px',
                placeContent: 'center',
                cursor: 'pointer',
            }}
                  onClick={handleCardClick} sx={{height: '100%'}}>

                <CardContent style={{padding: '20px 15px 30px 15px', alignItems: 'center', width: '100%'}}>
                    <div style={{
                        fontSize: '1.2rem',
                        fontWeight: 600,
                        textAlign: 'center',
                        height: '1.5rem'
                    }}>
                        Add New Machine
                    </div>
                </CardContent>

            </Card>

            <MachineDialog open={open} setOpen={setOpen}/>

        </React.Fragment>

    )
}
