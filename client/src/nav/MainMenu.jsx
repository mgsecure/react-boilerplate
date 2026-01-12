import ListItemIcon from '@mui/material/ListItemIcon'
import React, {useCallback, useContext, useState} from 'react'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import Tooltip from '@mui/material/Tooltip'
import AppContext from '../app/AppContext'
import DBContext from '../app/DBContext'
import MainMenuItem from './MainMenuItem'
import menuConfig from './menuConfig.jsx'
import lpuHeaderSmall from '../resources/bean2.png'
import AuthContext from '../app/AuthContext.jsx'
import Box from '@mui/material/Box'

function MainMenu() {
    const {beta} = useContext(AppContext)
    const {adminRole} = useContext(DBContext)
    const {userClaims} = useContext(AuthContext)
    const [open, setOpen] = useState(false)

    const openDrawer = useCallback(() => {
        setOpen(true)
        // Clear current focus to prevent weird issues on mobile
        document.activeElement.blur()
    }, [])
    const closeDrawer = useCallback(() => setOpen(false), [])

    return (
        <React.Fragment>
            <Tooltip title='Main Menu' arrow disableFocusListener>
                <IconButton edge='start' color='inherit' onClick={openDrawer}
                            style={{
                                backgroundColor: '#181818',
                                height: '36px',
                                width: '36px',
                                marginLeft: '-8px',
                                marginTop: 6
                            }}
                >
                    <MenuIcon/>
                </IconButton>
            </Tooltip>

            <SwipeableDrawer
                anchor='left'
                open={open}
                onOpen={openDrawer}
                onClose={closeDrawer}
            >
                <Stack direction='column' style={{minWidth: 250}}>
                    <MenuItem onClick={closeDrawer} style={{
                        padding: '10px 0px',
                        display: 'flex',
                        placeItems: 'center'
                    }}>
                        <ListItemIcon style={{display: 'flex', flexGrow: 1, placeItems: 'center'}}>
                            <Box component='img' alt='Coffee Tracker' src={lpuHeaderSmall} style={{
                                width: 150, margin: 0
                            }}/>
                        </ListItemIcon>
                    </MenuItem>
                    <Divider style={{margin: 0}}/>

                    {menuConfig
                        .filter(menuItem => beta || !menuItem.beta)
                        .filter(menuItem => adminRole || !menuItem.admin)
                        .filter(menuItem => !menuItem.hidden)
                        .filter(menuItem =>
                            !(menuItem.userClaims && !menuItem.userClaims?.some(claim => userClaims?.includes(claim)))
                        )
                        .map((menuItem, index) =>
                            <React.Fragment key={index}>
                                <MainMenuItem
                                    menuItem={menuItem}
                                    onClose={closeDrawer}
                                />
                                <Divider style={{margin: 0}}/>
                            </React.Fragment>
                        )}
                </Stack>
            </SwipeableDrawer>
        </React.Fragment>
    )
}

export default MainMenu
