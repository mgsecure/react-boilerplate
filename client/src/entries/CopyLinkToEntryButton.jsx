import React, {useCallback} from 'react'
import {enqueueSnackbar} from 'notistack'
import LinkIcon from '@mui/icons-material/Link'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import {useLocation} from 'react-router-dom'

function CopyLinkToEntryButton({entry, entryType}) {

    const handleClick = useCallback(async () => {
        const safeName = entry.fullName.replace(/[\s/]/g, '_').replace(/\W/g, '')
        const link = `${window.location.origin}${window.location.pathname}?id=${entry.id}&name=${safeName}`
        
        await navigator.clipboard.writeText(link)
        enqueueSnackbar('Link to entry copied to clipboard.')
    }, [entry])

    return (
        <Tooltip title='Copy Link to Entry' arrow disableFocusListener>
            <IconButton onClick={handleClick}>
                <LinkIcon/>
            </IconButton>
        </Tooltip>
    )
}

export default CopyLinkToEntryButton
