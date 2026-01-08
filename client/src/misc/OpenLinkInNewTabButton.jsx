import React, {useCallback} from 'react'
import NotIconButton from '../misc/NotIconButton.jsx'
import Tooltip from '@mui/material/Tooltip'
import {openInNewTab} from '../util/openInNewTab'

export default function OpenLinkInNewTabButton({url, entryType='Entry'}) {

    if (!url) return null

    const openLink = useCallback((event) => {
        event.preventDefault()
        event.stopPropagation()
        openInNewTab(url)
    }, [url])

    return (
        <Tooltip title={`Open Link to ${entryType} in New Tab`} arrow disableFocusListener>
            <NotIconButton iconName={'open_in_new'} onClick={openLink} size={'small'}
                           tooltip={`Open Link to ${entryType} in New Tab`}/>
        </Tooltip>
    )
}
