import React, {useCallback} from 'react'
import Drawer from '@mui/material/Drawer'
import useWindowSize from '../util/useWindowSize.jsx'
import {useTheme} from '@mui/material/styles'
import EquipmentForm from './EquipmentForm.jsx'
import BeanForm from './BeanForm.jsx'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import BrewForm from './BrewForm.jsx'

export default function ItemDrawer({item, open, setOpen, type = 'Item', action = 'edit'}) {
    const {isMobile} = useWindowSize()
    const theme = useTheme()

    const handleOverlayClose = useCallback(() => {
        setOpen(false)
    }, [setOpen])

    return (
        <React.Fragment>
            <Drawer
                elevation={12}
                anchor='left'
                open={open}
                onClose={handleOverlayClose}
                slotProps={{
                    paper: {sx: {backgroundColor: theme.palette.text.paper, width: isMobile ? '90vw' : 'unset'}},
                    transition: {
                        direction: 'right'
                    }
                }}
                sx={{backgroundColor: '#ffffff22'}}>

                <div style={{
                    display: 'flex',
                    padding: '15px 15px',
                    height: 64,
                    backgroundColor: theme.palette.background.default
                }} onClick={() => setOpen(false)}>

                    <div
                        style={{
                            flexGrow: 1,
                            fontSize: '1.5rem',
                            fontWeight: 500,
                            color: theme.palette.text.primary
                        }}>
                        {`${item
                            ? action === 'clone'
                                ? 'Clone'
                                : 'Edit'
                            : 'Add'} ${type}`}
                    </div>
                    <div onClick={() => setOpen(false)}>
                        <HighlightOffIcon sx={{cursor: 'pointer', color: theme.palette.text.primary}}/>
                    </div>
                </div>

                {type === 'Equipment' &&
                    <EquipmentForm machine={item} open={open} setOpen={setOpen} type={type}/>
                }
                {type === 'Bean' &&
                    <BeanForm bean={item} open={open} setOpen={setOpen} type={type}/>
                }

                {type === 'Brew' &&
                    <BrewForm entry={item} action={action} open={open} setOpen={setOpen} type={type}/>
                }

            </Drawer>

        </React.Fragment>
    )
}