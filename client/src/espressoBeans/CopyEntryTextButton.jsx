import React, {useCallback} from 'react'
import IconButton from '@mui/material/IconButton'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import Tooltip from '@mui/material/Tooltip'
import {enqueueSnackbar} from 'notistack'

function CopyEntryTextButton({entry}) {
    const handleClick = useCallback(async () => {
        await navigator.clipboard.writeText(entry.fullName)
        enqueueSnackbar('Name copied to clipboard.')
    }, [])

    return (
        <Tooltip title='Copy Name' arrow disableFocusListener>
            <IconButton onClick={handleClick}>
                <ContentCopyIcon/>
            </IconButton>
        </Tooltip>
    )
}

export default CopyEntryTextButton
