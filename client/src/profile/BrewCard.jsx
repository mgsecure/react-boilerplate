import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react'
import queryString from 'query-string'
import {useTheme} from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DBContext from '../app/DBContext.jsx'
import {enqueueSnackbar} from 'notistack'
import {alpha} from '@mui/material'
import useWindowSize from '../util/useWindowSize.jsx'
import Stack from '@mui/material/Stack'
import FieldValue from '../misc/FieldValue.jsx'
import Link from '@mui/material/Link'
import ItemDrawer from './ItemDrawer.jsx'
import LogEntryButton from '../entries/LogEntryButton.jsx'
import dayjs from 'dayjs'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import Tooltip from '@mui/material/Tooltip'
import DataContext from '../context/DataContext.jsx'
import cleanObject from '../util/cleanObject'
import entryName from '../entries/entryName'
import DeleteEntryButton from '../entries/DeleteEntryButton.jsx'

export default function BrewCard({entry = {}, expanded, onExpand}) {
    const {coffeesList} = useContext(DataContext)
    const {updateCollection} = useContext(DBContext)
    const [scrolled, setScrolled] = useState(false)
    const ref = useRef(null)

    const thisCoffee = useMemo(() => {
        return coffeesList.find(c => c.fullName === entry.coffee?.name) || entry.coffee || {name: entry.coffee?.name}
    }, [coffeesList, entry.coffee])

    const entryDate = dayjs(entry.brewedAt).format('MM/DD/YY')
    const entryTime = dayjs(entry.brewedAt).format('hh:mm a')
    const [action, setAction] = useState('edit')

    const handleUpdate = useCallback(async (entry) => {
        const cleanEntry = cleanObject(entry)
        const flags = entry ? {update: true} : {}
        try {
            await updateCollection({collection: 'brews', item: cleanEntry, flags})
            //enqueueSnackbar('Ratings saved', {variant: 'success'})
        } catch (error) {
            enqueueSnackbar(`Error saving ratings: ${error}`, {variant: 'error', autoHideDuration: 3000})
        }
    }, [updateCollection])


    const handleFlaggedChange = useCallback(async () => {
        const entryCopy = {
            ...entry,
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

    const notesLines = entry.notes?.split('\n')

    const [drawerOpen, setDrawerOpen] = useState(false)
    const handleDrawerClick = useCallback(() => {
        setDrawerOpen(true)
    }, [])

    const handleCloneClick = useCallback(() => {
        setAction('clone')
        setDrawerOpen(true)
    }, [])


    const theme = useTheme()

    const flaggedColor = entry.flagged ? theme.palette.success.main : alpha(theme.palette.primary.main, 0.3)

    const {isMobile, flexStyle} = useWindowSize()
    const flexDirection = isMobile ? 'column' : 'row'

    return (
        <Card
            style={{
                backgroundColor: theme.palette.card.main,
                color: '#fff',
                alignContent: 'center',
                boxShadow: 'unset',
                padding: '0px',
                width: '100%',
                transition: 'opacity 0.5s linear'
            }}
            id={entry.id}
            ref={ref}>
            <CardContent style={{display: flexStyle, placeItems: 'center', padding: 10}}>
                <ItemDrawer item={entry.originalEntry} open={drawerOpen} setOpen={setDrawerOpen} type={'Brew'}
                            action={action}/>

                <div style={{width: '100%'}}>
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
                                    fontWeight: 600
                                }}>
                                    <Link style={{color: '#fff'}} onClick={() => handleDrawerClick()}>
                                        {thisCoffee?.fullName}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Stack direction='row' spacing={0}
                           style={{flexWrap: 'wrap', alignContent: 'center', marginBottom: 4}}>
                        <FieldValue name='Brew Time' value={`${entryDate} ${entryTime}`}
                                    style={{marginRight: 24}}/>
                        <FieldValue name='Dose' value={entry.dose} suffix={entry.doseUnit}
                                    style={{marginRight: 15}}/>
                        <FieldValue name='Yield' value={entry.yield} suffix={entry.yieldUnit}
                                    style={{marginRight: 15}}/>
                        <FieldValue name='Temp' value={entry.temperature} suffix={entry.temperatureUnit}
                                    style={{marginRight: 15}}/>
                        <FieldValue name='Grind' value={entry.grinderSetting}
                                    style={{marginRight: 24}}/>
                        <FieldValue name='Recipe/Prep' value={entry.recipePrep}
                                    style={{}}/>
                    </Stack>

                    <Stack direction='row' spacing={0} style={{flexWrap: 'wrap', marginBottom: 4}}>
                        <FieldValue name='Brew Notes' value={entry.tastingNotes} style={{}}/>
                    </Stack>

                    <Stack direction='row' spacing={0} style={{flexWrap: 'wrap', marginBottom: 4}}>
                        <FieldValue name='Rested' value={entry.restedDays.toFixed(0)}
                                    suffix={` day${entry.restedDays !== 1 ? 's' : ''}`}
                                    style={{marginRight: 24}}/>
                        <FieldValue name='Grinder' value={entryName({entry: entry?.grinder})}
                                    style={{marginRight: 24}}/>
                        <FieldValue name='Equipment' value={entryName({entry: entry?.machine})}
                                    style={{marginRight: 24}}/>
                    </Stack>

                    <Stack direction='row' spacing={0} style={{flexWrap: 'wrap', marginBottom: 8}}>
                        <FieldValue name='Roast Date' value={entry.roastDate} style={{marginRight: 16}}/>
                        <FieldValue name='Roaster Tasting Notes' value={entry.roasterNotes}
                                    style={{marginRight: 24}}/>
                    </Stack>


                </div>
                <div style={{display: 'flex', flexDirection: 'column', placeItems: 'center', marginLeft: 30}}>
                    <Tooltip title='Edit this brew' arrow disableFocusListener>
                        <IconButton onClick={handleDrawerClick} style={{marginRight: 8}}>
                            <EditIcon fontSize='small' style={{color: '#eee'}}/>
                        </IconButton>
                    </Tooltip>

                    <Tooltip title='Edit a copy of this brew' arrow disableFocusListener>
                        <IconButton onClick={handleCloneClick} style={{marginRight: 8}}>
                            <ContentCopyIcon fontSize='small' style={{color: '#eee'}}/>
                        </IconButton>
                    </Tooltip>

                    <Tooltip title='Flag this brew' arrow disableFocusListener>
                        <IconButton onClick={handleFlaggedChange} style={{marginRight: 8}}>
                            <ThumbUpIcon fontSize='small' style={{color: flaggedColor}}/>
                        </IconButton>
                    </Tooltip>

                    <DeleteEntryButton entry={entry} entryType={'Brew'} handleDelete={handleDelete} size={'small'}
                                       style={{marginRight: 8}}/>

                    <LogEntryButton entry={entry} entryType={'Brew'} size={'small'} style={{marginRight: 8}}/>

                </div>

            </CardContent>

        </Card>
    )
}

