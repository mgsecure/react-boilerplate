import React, {useCallback} from 'react'
import IconButton from '@mui/material/IconButton'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import Tooltip from '@mui/material/Tooltip'
import {enqueueSnackbar} from 'notistack'

function CopyEntryTextButton({entryName}) {
    const handleClick = useCallback(async () => {
        await navigator.clipboard.writeText(entryName)
        enqueueSnackbar('Name copied to clipboard.')
    }, [entryName])

    return (
        <Tooltip title='Copy Name' arrow disableFocusListener>
            <IconButton onClick={handleClick}>
                <ContentCopyIcon/>
            </IconButton>
        </Tooltip>
    )
}

export default CopyEntryTextButton
