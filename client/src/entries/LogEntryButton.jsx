import React, {useCallback, useContext} from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import WysiwygIcon from '@mui/icons-material/Wysiwyg'
import entryName from './entryName'
import {jsonIt} from '../util/jsonIt'
import AppContext from '../app/AppContext.jsx'

export default function LogEntryButton({entry, size='medium', entryType, style}) {

    const {adminEnabled} = useContext(AppContext)

    const handleClick = useCallback(async () => {
        const name =  entryName({entry, entryType})
        jsonIt(name, entry)
    }, [entry, entryType])

    if (!adminEnabled) return null

    return (
        <Tooltip title='Log Entry Details' arrow disableInteractive>
            <IconButton onClick={handleClick} style={style}>
                <WysiwygIcon fontSize={size} color='primary'/>
            </IconButton>
        </Tooltip>
    )
}