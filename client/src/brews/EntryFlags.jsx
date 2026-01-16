import LogEntryButton from '../entries/LogEntryButton.jsx'
import DeleteEntryButton from '../entries/DeleteEntryButton.jsx'
import React from 'react'
import FlagEntryButton from '../entries/FlagEntryButton.jsx'
import {useTheme} from '@mui/material/styles'


export default function EntryFlags({entry, handleFlaggedChange, updating}) {
    const theme = useTheme()

    return (
        <>
            <FlagEntryButton handleFlaggedChange={handleFlaggedChange} updating={updating}
                             direction={'up'} flag={entry.flagged} flaggedColor={theme.palette.warning.main}
                             tooltipPlacement={'right'} entryType={'Brew'}
                             size={'small'} style={{marginLeft: 10}}/>
            <FlagEntryButton handleFlaggedChange={handleFlaggedChange} updating={updating}
                             direction='star' flag={entry.flagged} flaggedColor={theme.palette.success.main}
                             tooltipPlacement={'right'} entryType={'Brew'}
                             size={'medium'} style={{marginLeft: 10}}/>
            <FlagEntryButton handleFlaggedChange={handleFlaggedChange} updating={updating}
                             direction='down' flag={entry.flagged} flaggedColor={theme.palette.error.main}
                             tooltipPlacement={'right'} entryType={'Brew'}
                             size={'small'} style={{marginLeft: 10}}/>
        </>
    )
}