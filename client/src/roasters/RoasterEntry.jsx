import React, {useCallback, useContext, useEffect, useRef, useState} from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import rehypeExternalLinks from 'rehype-external-links'
import FieldValue from '../misc/FieldValue'
import ReactMarkdown from 'react-markdown'
import FilterChip from '../filters/FilterChip'
import AccordionActions from '@mui/material/AccordionActions'
import OpenLinkInNewTabButton from '../misc/OpenLinkInNewTabButton.jsx'
import CopyEntryTextButton from '../entries/CopyEntryTextButton'
import queryString from 'query-string'
import CopyEntryIdButton from '../entries/CopyEntryIdButton.jsx'
import OpenLinkToEntryButton from '../entries/OpenLinkToEntryButton.jsx'
import DataContext from '../context/DataContext.jsx'
import LogEntryButton from '../entries/LogEntryButton.jsx'
import useWindowSize from '../util/useWindowSize.jsx'
import isValidUrl from '../util/isValidUrl'
import AppContext from '../app/AppContext.jsx'
import {useTheme} from '@mui/material/styles'
import {alpha} from '@mui/material'

function RoasterEntry({entry, expanded, onExpand}) {
    const {beta} = useContext(AppContext)
    const {expandAll} = useContext(DataContext)
    const [scrolled, setScrolled] = useState(false)
    const style = {width: '100%', maxWidth: 800, marginLeft: 'auto', marginRight: 'auto'}
    const ref = useRef(null)
    const {isMobile} = useWindowSize()
    const theme = useTheme()

    const entryFullName = entry.name
    const entryLink = isValidUrl(entry.link) ? entry.link : undefined

    // todo - make location & separators a component (no FilterChip)
    const citySep = (entry.city && (entry.stateRegion || entry.country)) ? ', ' : ''
    const stateSep = (entry.stateRegion && entry.country) ? ', ' : ''
    const locationColor = alpha(theme.palette.text.primary, 0.6)

    const handleChange = useCallback((_, isExpanded) => {
        if (beta) {
            onExpand && onExpand(isExpanded ? entry.id : false)
        }
    }, [beta, entry.id, onExpand])



    useEffect(() => {
        if (expanded && ref && !scrolled && !expandAll) {
            const offset = isMobile ? 70 : 74
            const {id} = queryString.parse(location.search)
            const isIdFiltered = id === entry.id

            setScrolled(true)

            setTimeout(() => {
                window.scrollTo({
                    left: 0,
                    top: ref?.current?.offsetTop - offset,
                    behavior: isIdFiltered ? 'auto' : 'smooth'
                })
            }, isIdFiltered ? 0 : 100)
        } else if (!expanded) {
            setScrolled(false)
        }
    }, [expanded, entry, scrolled, expandAll, isMobile])


    // TODO - don't bring in FilterChip, just render here. Fix add filter for new style.

    return (
        <Accordion expanded={expanded} onChange={handleChange} style={style} ref={ref} role='listitem'
                   aria-label={entryFullName}>
            <AccordionSummary expandIcon={beta ? <ExpandMoreIcon/> : null}
                              sx={{
                                  padding: '0px 16px 0px 16px', '.MuiAccordionSummary-content': {
                                      margin: '8px 0px'
                                  }
                              }}>
                <div style={{
                    margin: '6px 20px 8px 6px',
                    width: '100%',
                    flexShrink: 0,
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>

                    <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
                        <div style={{
                            fontSize: '1.1rem',
                            lineHeight: '1.4rem',
                            fontWeight: 600,
                            marginBottom: 4,
                            marginRight: 16
                        }}>
                            {entry.name}
                        </div>
                        <div style={{
                            fontSize: '0.85rem',
                            lineHeight: '1.4rem',
                            flexGrow: 1,
                            textAlign: 'left',
                            color: locationColor
                        }}>
                            <FilterChip value={entry.city} field='city' mode='text' linkColor={locationColor}/>
                            {citySep}
                            <FilterChip value={entry.stateRegion} field='stateRegion' mode='text'
                                        linkColor={locationColor}/>
                            {stateSep}
                            <FilterChip value={entry.country} field='country' mode='text' linkColor={locationColor}/>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <FieldValue name='Roastful Rank'
                                        value={entry.roastfulRanking}
                                        style={{marginLeft: 0, marginRight: 20}}
                                        center={true}/>
                            <FieldValue name='Reddit Votes'
                                        value={entry.pouroverVotes}
                                        fallback={'--'}
                                        style={{marginLeft: 0, marginRight: 20}}
                                        center={true}/>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                width: 36,
                                height: 36,
                                margin: '0px 8px'
                            }}>
                                <OpenLinkInNewTabButton url={entryLink} entryType='Roaster'/>
                            </div>
                        </div>
                    </div>
                </div>
            </AccordionSummary>
            {
                expanded &&
                <React.Fragment>
                    <AccordionDetails sx={{padding: '0px 16px 0px 16px'}}>
                        {!!entry.description &&
                            <div style={{margin: 8}}>
                                <ReactMarkdown rehypePlugins={[[rehypeExternalLinks, {
                                    target: '_blank',
                                    rel: ['nofollow', 'noopener', 'noreferrer']
                                }]]}>
                                    {entry.description}
                                </ReactMarkdown>
                            </div>
                        }
                    </AccordionDetails>
                    <AccordionActions disableSpacing sx={{padding: '0px 16px 8px 16px'}}>
                        <div style={{display: 'flex', width: '100%'}}>
                            <div style={{flexGrow: 1, justifyItems: 'left'}}>
                                {beta &&
                                    <>
                                        <CopyEntryIdButton entry={entry}/>
                                        <OpenLinkToEntryButton entry={entry}/>
                                        <LogEntryButton entry={entry}/>
                                    </>
                                }
                            </div>
                            <div style={{display: 'flex'}}>
                                <CopyEntryTextButton entryName={entryFullName}/>
                            </div>
                        </div>

                    </AccordionActions>
                </React.Fragment>
            }
        </Accordion>
    )
}

export default React.memo(RoasterEntry, (prevProps, nextProps) => {
    return prevProps.entry.id === nextProps.entry.id &&
        prevProps.expanded === nextProps.expanded &&
        prevProps.onExpand === nextProps.onExpand
})
