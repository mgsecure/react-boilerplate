import React from 'react'
import IconButton from '@mui/material/IconButton'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import Tooltip from '@mui/material/Tooltip'
import LoadingDisplayWhiteSmall from '../misc/LoadingDisplayWhiteSmall'
import VerifiedIcon from '@mui/icons-material/Verified'
import {useTheme} from '@mui/material/styles'
import {alpha} from '@mui/material'

export default function FlagEntryButton({
                                            flag,
                                            handleFlaggedChange,
                                            updating,
                                            flaggedColor,
                                            entryType,
                                            style,
                                            size,
                                            tooltipPlacement = 'bottom',
                                            direction = 'up'
                                        }) {
    const theme = useTheme()

    const flagged = flag === direction

    const tooptips = {up: 'Better', down: 'Nope', star: 'Just Right'}
    const diameterValues = {small: 36, medium: 36, large: 40}
    const diameter = diameterValues[size] || 36

    return (
        <>
            {direction === 'star'
                ? <Tooltip title={tooptips[direction]} arrow disableInteractive
                           placement={tooltipPlacement}>
                    <IconButton name='foo' onClick={(e) => handleFlaggedChange(e, direction)}
                                style={{...style, height: diameter, width: diameter}}>
                        {updating === direction
                            ? <LoadingDisplayWhiteSmall size={size}/>
                            : <VerifiedIcon fontSize={size} style={{
                                color: flagged ? flaggedColor : alpha(theme.palette.primary.main, 0.3)
                            }}/>
                        }
                    </IconButton>
                </Tooltip>
                : <Tooltip title={tooptips[direction]} arrow disableInteractive
                           placement={tooltipPlacement}>
                    <IconButton onClick={(e) => handleFlaggedChange(e, direction)}
                                style={{...style, height: diameter, width: diameter}}>
                        {updating === direction
                            ? <LoadingDisplayWhiteSmall size={size}/>
                            : <ThumbUpIcon fontSize={size} style={{
                                color: flagged ? flaggedColor : alpha(theme.palette.primary.main, 0.3),
                                transform: direction === 'down' ? 'rotate(180deg)' : ''
                            }}/>
                        }
                    </IconButton>
                </Tooltip>
            }
        </>
    )
}