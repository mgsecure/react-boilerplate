import React, {useCallback} from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

function OpenLinkToEntryButton({entry}) {

    const openInNewTab = useCallback(() => {
        const safeName = entry.fullName.replace(/[\s/]/g, '_').replace(/\W/g, '')
        const link = `${window.location.origin}${window.location.pathname}?id=${entry.id}&search=${entry.id}&name=${safeName}`
        const newWindow = window.open(link, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }, [entry.fullName, entry.id])


    return (
        <Tooltip title='Open Link to Entry in New Tab' arrow disableFocusListener>
            <IconButton onClick={openInNewTab}>
                <OpenInNewIcon color='primary'/>
            </IconButton>
        </Tooltip>
    )
}

export default OpenLinkToEntryButton
