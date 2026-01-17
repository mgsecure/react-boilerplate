import React from 'react'
import FlagEntryButton from '../entries/FlagEntryButton.jsx'
import {useTheme} from '@mui/material/styles'


export default function EntryFlags({entry, handleFlaggedChange, updating, style}) {
    const theme = useTheme()

    return (
        <>
            <FlagEntryButton handleFlaggedChange={handleFlaggedChange} updating={updating}
                             direction={'up'} flag={entry.flagged} flaggedColor={theme.palette.warning.main}
                             tooltipPlacement={'right'} entryType={'Brew'}
                             size={'small'} style={style}/>
            <FlagEntryButton handleFlaggedChange={handleFlaggedChange} updating={updating}
                             direction='star' flag={entry.flagged} flaggedColor={theme.palette.success.main}
                             tooltipPlacement={'right'} entryType={'Brew'}
                             size={'medium'} style={style}/>
            <FlagEntryButton handleFlaggedChange={handleFlaggedChange} updating={updating}
                             direction='down' flag={entry.flagged} flaggedColor={theme.palette.error.main}
                             tooltipPlacement={'right'} entryType={'Brew'}
                             size={'small'} style={style}/>
        </>
    )
}