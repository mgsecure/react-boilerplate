import React from 'react'
import IconButton from '@mui/material/IconButton'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import Tooltip from '@mui/material/Tooltip'
import LoadingDisplayWhiteSmall from '../misc/LoadingDisplayWhiteSmall'

export default function FlagEntryButton({
                                            handleFlaggedChange,
                                            updating,
                                            flaggedColor,
                                            entryType,
                                            style,
                                            size,
                                            tooltipPlacement = 'bottom'
                                        }) {

    return (
        <Tooltip title={`Flag this ${entryType.toLowerCase()}`} arrow disableFocusListener placement={tooltipPlacement}>
            <IconButton onClick={handleFlaggedChange} style={style}>
                {updating
                    ? <LoadingDisplayWhiteSmall size={size}/>
                    : <ThumbUpIcon fontSize={size} style={{color: flaggedColor}}/>
                }
            </IconButton>
        </Tooltip>
    )
}