import React, {useCallback, useContext, useState} from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import DeleteIcon from '@mui/icons-material/Delete'
import Menu from '@mui/material/Menu'
import {Button} from '@mui/material'
import {useTheme, lighten} from '@mui/material/styles'
import AuthContext from '../app/AuthContext.jsx'

export default function DeleteEntryButton({size = 'medium', entryType, handleDelete, style, tooltipPlacement='bottom'}) {
    const {isLoggedIn} = useContext(AuthContext)

    const [anchorEl, setAnchorEl] = useState(null)
    const handleDeleteConfirm = useCallback((ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        setAnchorEl(ev.currentTarget)
    }, [])

    const theme = useTheme()
    const iconColor = anchorEl ? theme.palette.error.main : lighten(theme.palette.error.main, 0.2)

    return (
        <>
            <Tooltip title='Delete' arrow disableFocusListener placement={tooltipPlacement}>
                <IconButton onClick={handleDeleteConfirm} style={style}>
                    <DeleteIcon fontSize={size} style={{color: iconColor}}/>
                </IconButton>
            </Tooltip>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
                  slotProps={{paper: {sx: {backgroundColor: '#333'}}}}>
                <div style={{padding: 20, textAlign: 'center'}}>
                    <strong>Delete cannot be undone.</strong><br/>
                    Are you sure?
                </div>
                <div style={{textAlign: 'center'}}>
                    <Button style={{marginBottom: 10}}
                            variant='contained'
                            onClick={handleDelete}
                            edge='start'
                            color='error'
                            disabled={!isLoggedIn}
                    >
                        Delete {entryType}
                    </Button>
                </div>
            </Menu>
        </>
    )
}