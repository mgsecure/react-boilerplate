import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react'
import queryString from 'query-string'
import {useTheme, lighten} from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DBContext from '../app/DBContext.jsx'
import {enqueueSnackbar} from 'notistack'
import {alpha, Button, Collapse} from '@mui/material'
import useWindowSize from '../util/useWindowSize.jsx'
import Stack from '@mui/material/Stack'
import FieldValue from '../misc/FieldValue.jsx'
import Link from '@mui/material/Link'
import ItemDrawer from '../profile/ItemDrawer.jsx'
import LogEntryButton from '../entries/LogEntryButton.jsx'
import dayjs from 'dayjs'
import Tooltip from '@mui/material/Tooltip'
import DataContext from '../context/DataContext.jsx'
import cleanObject from '../util/cleanObject'
import DeleteEntryButton from '../entries/DeleteEntryButton.jsx'
import FilterContext from '../context/FilterContext.jsx'
import {useNavigate} from 'react-router-dom'
import FlagEntryButton from '../entries/FlagEntryButton.jsx'
import AppContext from '../app/AppContext.jsx'

export default function BrewCard({entry = {}, expanded, onExpand, context = 'brews', brewCount}) {
    const {adminEnabled} = useContext(AppContext)
    const {coffeesList, visibleEntries = []} = useContext(DataContext)
    const {updateCollection} = useContext(DBContext)
    const {addFilter, sort} = useContext(FilterContext)

    const [brewExpanded, setBrewExpanded] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const ref = useRef(null)
    const navigate = useNavigate()
    const theme = useTheme()

    const [updating, setUpdating] = useState(false)
    const handleAddFilter = useCallback((keyToAdd, valueToAdd, replace) => {
        addFilter(keyToAdd, valueToAdd, replace)
    }, [addFilter])

    const thisCoffee = useMemo(() => {
        return coffeesList.find(c => c.fullName === entry.coffee?.name) || entry.coffee || {name: entry.coffee?.name}
    }, [coffeesList, entry.coffee])

    const roastDate = entry.roastDate
        ? dayjs(entry.roastDate).year() === dayjs().year() ? dayjs(entry.roastDate).format('MMM D') : dayjs(entry.roastDate).format('MMM D, YYYY')
        : undefined
    const brewTime = entry.brewTime ? dayjs(entry.brewTime).format('mm:ss') : undefined
    const entryDate = dayjs(entry.brewedAt).year() === dayjs().year() ? dayjs(entry.brewedAt).format('MMM D') : dayjs(entry.brewedAt).format('MMM D, YYYY')
    const entryTime = dayjs(entry.brewedAt).format('h:mm a')
    const ratio = entry.dose && entry.yield
        ? ` (${(entry.yield / entry.dose).toFixed(1).replace('.0', '')}:1)`
        : ''

    const [action, setAction] = useState('edit')

    const handleUpdate = useCallback(async (entry) => {
        setUpdating(true)
        const cleanEntry = cleanObject(entry)
        const flags = entry ? {update: true} : {}
        try {
            await updateCollection({collection: 'brews', item: cleanEntry, flags})
            //enqueueSnackbar('Ratings saved', {variant: 'success'})
        } catch (error) {
            enqueueSnackbar(`Error saving ratings: ${error}`, {variant: 'error', autoHideDuration: 3000})
        } finally {
            setUpdating(false)
        }
    }, [updateCollection])

    const handleFlaggedChange = useCallback(async () => {
        const entryCopy = {
            ...entry.originalEntry,
            flagged: !entry.flagged
        }
        await handleUpdate(entryCopy)
    }, [entry, handleUpdate])

    const handleDelete = useCallback(async () => {
        try {
            await updateCollection({collection: 'brews', item: entry, flags: {delete: true}})
            enqueueSnackbar('Item deleted.', {variant: 'success'})
        } catch (error) {
            enqueueSnackbar(`Error deleting item: ${error}`, {variant: 'error', autoHideDuration: 3000})
        }
    }, [entry, updateCollection])

    useEffect(() => {
        if (expanded && ref && !scrolled) {
            const isMobile = window.innerWidth <= 600
            const offset = isMobile ? 70 : 74
            const {id} = queryString.parse(location.search)
            const isIdFiltered = id === entry.id

            setScrolled(true)

            setTimeout(() => {
                window.scrollTo({
                    left: 0,
                    top: ref.current.offsetTop - offset * 2,
                    behavior: isIdFiltered ? 'auto' : 'smooth'
                })
            }, isIdFiltered ? 0 : 100)
        } else if (!expanded) {
            setScrolled(false)
        }
    }, [expanded, scrolled, entry.id])

    const [drawerOpen, setDrawerOpen] = useState(false)

    const handleChange = useCallback(() => {
        onExpand
            ? onExpand(!expanded ? entry.id : false)
            : setBrewExpanded(!brewExpanded)
    }, [brewExpanded, entry.id, expanded, onExpand])

    const handleDrawerClick = useCallback(() => {
        setDrawerOpen(true)
    }, [])

    const handleCloneClick = useCallback(() => {
        setAction('clone')
        setDrawerOpen(true)
    }, [])

    const handleViewAll = useCallback(() => {
        navigate(`/brews?coffeeName=${encodeURIComponent(thisCoffee.name)}`)
    }, [navigate, thisCoffee.name])

    const coffeeBrews = visibleEntries.filter(e => e.coffee?.name === entry.coffee?.name)
    const previousBrew = !sort && coffeeBrews?.find(b => b.idx > entry.idx)

    const highlightStyle = {
        backgroundColor: theme.palette.card?.add,
        fontWeight: 700,
        padding: '0px 5px',
        borderRadius: 4
    }
    const doseStyle = previousBrew?.dose && previousBrew.dose !== entry.dose ? highlightStyle : {}
    const yieldStyle = previousBrew?.yield && previousBrew.yield !== entry.yield ? highlightStyle : {}
    const temperatureStyle = previousBrew?.temperature && previousBrew.temperature !== entry.temperature ? highlightStyle : {}
    const grindStyle = previousBrew?.grinderSetting && previousBrew.grinderSetting !== entry.grinderSetting ? highlightStyle : {}
    const timeStyle = previousBrew?.brewTime && previousBrew.brewTime !== entry.brewTime ? highlightStyle : {}
    const recipeStyle = previousBrew?.recipePrep && previousBrew.recipePrep !== entry.recipePrep ? highlightStyle : {}

    const flaggedColor = (entry.flagged || updating) ? theme.palette.success.main : alpha(theme.palette.primary.main, 0.3)
    const backgroundColor = context !== 'coffeeEntry' ? theme.palette.card.main : lighten(theme.palette.card.main, 0.05)

    const {isMobile, flexStyle, columnStyle} = useWindowSize()
    const flexDirection = isMobile ? 'column' : 'row'
    const tooltipPlacement = isMobile ? 'bottom' : 'left'
    const tooltipPlacementRight = isMobile ? 'bottom' : 'right'

    return (
        <Card
            style={{
                backgroundColor: backgroundColor,
                color: '#fff',
                alignContent: 'center',
                boxShadow: 'unset',
                width: '100%',
                transition: 'opacity 0.5s linear'
            }}
            id={entry.id}
            ref={ref}>
            <CardContent style={{display: flexStyle, placeItems: 'center', padding: 10}}>
                <ItemDrawer item={entry.originalEntry} open={drawerOpen} setOpen={setDrawerOpen} type={'Brew'}
                            action={action}/>

                <div style={{width: '100%', flexGrow: 1}}>
                    <div style={{
                        display: 'flex',
                        flexGrow: 1,
                        flexDirection: flexDirection,
                        placeItems: 'center',
                        width: '100%'
                    }}>
                        <div style={{flexGrow: 1}}>
                            <div style={{
                                marginBottom: 5,
                                flexGrow: 1,
                                placeContent: 'center',
                                textAlign: (isMobile ? 'center' : 'left')
                            }}>
                                <div style={{
                                    fontSize: '1.1rem',
                                    lineHeight: '1.3rem',
                                    margin: '5px 0px 4px 5px'
                                }}>
                                    {context !== 'coffeeEntry' &&
                                        <div style={{fontSize: '1.2rem', marginBottom: 5}}>
                                            <Link style={{color: '#fff', fontWeight: 600}}
                                                  onClick={() => handleAddFilter('coffeeName', thisCoffee?.name, true)}>
                                                {thisCoffee?.name}
                                            </Link>
                                            {thisCoffee?.roasterName &&
                                                <>
                                                    &nbsp;(<Link style={{color: '#fff', fontWeight: 600}}
                                                                 onClick={() => handleAddFilter('roasterName', thisCoffee?.roasterName, true)}>
                                                    {thisCoffee?.roasterName}
                                                </Link>)
                                                </>
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <Stack direction='row' spacing={0}
                           style={{flexWrap: 'wrap', alignContent: 'center', marginBottom: 4}}>
                        <FieldValue name={`${context === 'coffeeEntry' ? 'Latest ' : ''}Brew Date`}
                                    value={`${entryDate} ${entryTime}`}
                                    style={{marginRight: 24}}/>
                        <FieldValue name='Dose' value={entry.dose} suffix={entry.doseUnit}
                                    style={{marginRight: 15}} textStyle={doseStyle}/>
                        <FieldValue name='Yield' value={entry.yield} suffix={`${entry.yieldUnit} ${ratio}`}
                                    style={{marginRight: 15}} textStyle={yieldStyle}/>
                        <FieldValue name='Temp' value={entry.temperature} suffix={entry.temperatureUnit}
                                    style={{marginRight: 15}} textStyle={temperatureStyle}/>
                        <FieldValue name='Grind' value={entry.grinderSetting}
                                    style={{marginRight: 15}} textStyle={grindStyle}/>
                        <FieldValue name='Time' value={brewTime}
                                    style={{marginRight: 15}} textStyle={timeStyle}/>
                        <FieldValue name='Recipe/Prep' value={entry.recipePrep}
                                    style={{marginRight: 15}} textStyle={recipeStyle}/>
                        {brewCount > 0 &&
                            <FieldValue name='More Info'
                                        value={<Link
                                            style={{color: theme.palette.primary.main}}
                                            onClick={() => handleViewAll()}>
                                            View all brews ({brewCount})
                                        </Link>}
                                        style={{}}/>
                        }
                    </Stack>


                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyItems: 'right', flexGrow: 0, width: 'auto'}}>
                    <div style={{...columnStyle, placeContent: 'center'}}>
                        <Button onClick={handleCloneClick}
                                style={{textTransform: 'none', whiteSpace: 'nowrap', width: 90, padding: 4}}>
                            Make Copy</Button>
                        <Button onClick={handleDrawerClick}
                                style={{textTransform: 'none', whiteSpace: 'nowrap', width: 90, padding: 4}}>
                            Edit</Button>
                        <Button onClick={handleChange}
                                style={{
                                    textTransform: 'none', whiteSpace: 'nowrap', width: 90, padding: 4,
                                    fontWeight: expanded || brewExpanded ? 700 : 400
                                }}>
                            {(expanded || brewExpanded) ? 'Hide' : 'Show'} Details</Button>
                    </div>
                    <div style={{...columnStyle, placeContent: 'center'}}>
                        <FlagEntryButton handleFlaggedChange={handleFlaggedChange} updating={updating}
                                         flaggedColor={flaggedColor}
                                         tooltipPlacement={'bottom'} entryType={'Brew'}
                                         size={'small'} style={{marginLeft: 10}}/>
                        <LogEntryButton entry={entry} entryType={'Brew'} size={'small'} style={{marginLeft: 10}}/>
                        {adminEnabled &&
                            <DeleteEntryButton entry={entry} entryType={'Brew'} handleDelete={handleDelete}
                                               size={'small'}
                                               style={{marginLeft: 10}} tooltipPlacement={'top'}/>
                        }
                    </div>
                </div>
            </CardContent>

            <Collapse in={(expanded || brewExpanded)} timeout='auto' unmountOnExit>
                <CardContent style={{textAlign: 'left', padding: 10, color: '#fff'}}>
                    <Stack direction='row' spacing={0} style={{flexWrap: 'wrap', marginBottom: 4}}>
                        <FieldValue name='Brew Notes' value={entry.tastingNotes} style={{}}/>
                    </Stack>

                    <Stack direction='row' spacing={0} style={{flexWrap: 'wrap', marginBottom: 4}}>
                        <FieldValue name='Roast Date' value={roastDate} style={{marginRight: 16}}/>
                        <FieldValue name='Rested' value={entry.roastDate && entry.restedDays?.toFixed(0)}
                                    suffix={` day${entry.restedDays !== 1 ? 's' : ''}`}
                                    style={{marginRight: 24}}/>
                        <FieldValue name='Grinder'
                                    value={entry?.grinder?.fullName &&
                                        <Link style={{color: '#fff'}}
                                              onClick={() => handleAddFilter('grinderName', entry?.grinder?.fullName, true)}>
                                            {entry?.grinder?.fullName}</Link>}
                                    style={{marginRight: 24}}/>
                        <FieldValue name='Equipment'
                                    value={entry?.machine?.fullName &&
                                        <Link style={{color: '#fff'}}
                                              onClick={() => handleAddFilter('machineName', entry?.machine?.fullName, true)}>
                                            {entry?.machine?.fullName}</Link>}
                                    style={{marginRight: 24}}/>
                    </Stack>

                    <Stack direction='row' spacing={0} style={{flexWrap: 'wrap', marginBottom: 8}}>
                        <FieldValue name='Roaster Tasting Notes' value={entry.roasterNotes}
                                    style={{marginRight: 24}}/>
                    </Stack>

                    <div style={{display: 'flex', placeContent: 'center'}}>
                        <LogEntryButton entry={entry} entryType={'brew'} size={'small'}/>
                        <div
                            style={{
                                display: 'flex',
                                flexGrow: 1,
                                placeContent: 'center end',
                                marginRight: 5
                            }}>
                            <Tooltip title='Edit' arrow disableFocusListener placement={'top'}>
                                <IconButton onClick={handleDrawerClick} style={{marginRight: 2}}>
                                    <EditIcon fontSize='medium' style={{color: '#eee'}}/>
                                </IconButton>
                            </Tooltip>
                            <DeleteEntryButton entry={entry} entryType={'Brew'} handleDelete={handleDelete}
                                               size={'small'}
                                               style={{marginRight: 8}} tooltipPlacement={'top'}/>
                        </div>
                    </div>

                </CardContent>
            </Collapse>
        </Card>
    )
}
