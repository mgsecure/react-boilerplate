import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react'
import queryString from 'query-string'
import Tracker from '../app/Tracker.jsx'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {styled, useTheme} from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import DBContext from '../app/DBContext.jsx'
import {enqueueSnackbar} from 'notistack'
import Menu from '@mui/material/Menu'
import {alpha, Button} from '@mui/material'
import useWindowSize from '../util/useWindowSize.jsx'
import Stack from '@mui/material/Stack'
import FieldValue from '../misc/FieldValue.jsx'
import Link from '@mui/material/Link'
import ItemDrawer from '../profile/ItemDrawer.jsx'
import LogEntryButton from '../entries/LogEntryButton.jsx'
import dayjs from 'dayjs'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import RatingTable from '../misc/RatingTable.jsx'
import Tooltip from '@mui/material/Tooltip'
import isValidUrl from '../util/isValidUrl'
import {openInNewTab} from '../util/openInNewTab'
import LocationDisplay from '../misc/LocationDisplay.jsx'

const ExpandMore = styled((props) => {
    const {expand, ...other} = props
    return <IconButton {...other} />
})(({theme, expand}) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest
    })
}))

export default function CoffeeEntry({entry = {}, expanded, onExpand}) {
    const {updateCollection} = useContext(DBContext)
    const [scrolled, setScrolled] = useState(false)
    const ref = useRef(null)
    const [action, setAction] = useState('edit')

    const ratings = useMemo(() => entry.ratings || {}, [entry])
    const ratingDimensions = {rating: 'rating'}
    const ratingDimensionsFull = {
        rating: 'Overall Rating',
        flavor: 'Flavor',
        body: 'Body',
        acidity: 'Acidity',
        finish: 'Finish'
    }

    const latestBrew = entry.brews?.length > 0 ? entry.brews[0] : {}
    const entryDate = dayjs(entry.modifiedAt).format('MM/DD/YY')
    const entryTime = dayjs(entry.modifiedAt).format('hh:mm a')
    const currencyDescription = entry.priceUnit.match(/(\w{3})\s\((.*)\)/)[1]
    const currencySymbol = entry.priceUnit.match(/(\w{3})\s\((.*)\)/)[2]

    const handleUpdate = useCallback(async (entry) => {
        const cleanEntry = Object.fromEntries(
            Object.entries(entry).filter(([_key, value]) => {
                return value !== null && typeof value !== 'undefined'
            })
        )
        const flags = entry ? {update: true} : {}
        try {
            await updateCollection({collection: 'brews', item: cleanEntry, flags})
            //enqueueSnackbar('Ratings saved', {variant: 'success'})
        } catch (error) {
            enqueueSnackbar(`Error saving ratings: ${error}`, {variant: 'error', autoHideDuration: 3000})
        }
    }, [updateCollection])

    const handleRatingChange = useCallback(async ({dimension, rating}) => {
        console.log('handleRatingChange', {dimension, rating})
        const entryCopy = {
            ...entry,
            ratings: {...ratings, [dimension]: rating}
        }
        await handleUpdate(entryCopy)
    }, [entry, handleUpdate, ratings])

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

    const handleChange = useCallback(() => {
        onExpand(!expanded ? entry.id : false)
    }, [entry?.id, expanded, onExpand])

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

    const [anchorEl, setAnchorEl] = useState(null)
    const handleDeleteConfirm = useCallback((ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        setAnchorEl(ev.currentTarget)
    }, [])

    const theme = useTheme()
    const linkSx = {
        color: '#aaa', textDecoration: 'none', cursor: 'pointer',
        '&:hover': {color: '#fff'}
    }

    const flaggedColor = entry.flagged ? theme.palette.success.main : alpha(theme.palette.primary.main, 0.3)
    const beanUrl = isValidUrl(entry.url) ? entry.url : undefined
    const beanLink = beanUrl ? <Link sx={linkSx} onClick={() => openInNewTab(entry.url)}>{entry.url}</Link> : entry.url

    const {isMobile, flexStyle} = useWindowSize()
    const flexDirection = isMobile ? 'column' : 'row'

    const ratingWidth = isMobile ? 300 : 400
    const ratingSize = isMobile ? 19 : 21

    return (
        <Card
            style={{
                backgroundColor: theme.palette.card.main,
                color: '#fff',
                alignContent: 'center',
                boxShadow: 'unset',
                padding: '0px',
                transition: 'opacity 0.5s linear'
            }}
            id={entry.id}
            ref={ref}>
            <CardContent style={{display: flexStyle, placeItems: 'center', padding: 10}}>
                <ItemDrawer item={entry.originalEntry} open={drawerOpen} setOpen={setDrawerOpen} type={'Coffee'} action={action}/>

                <div style={{width: '100%'}}>
                    <div style={{display: 'flex', flexDirection: flexDirection, placeItems: 'center', width: '100%'}}>
                        <div style={{flexGrow: 1}}>
                            <div style={{
                                marginBottom: 5,
                                flexGrow: 1,
                                placeContent: 'center',
                                textAlign: (isMobile ? 'center' : 'left')
                            }}>
                                <div style={{fontSize: '0.85rem', marginBottom: 1, fontWeight: 500, opacity: 0.6}}>
                                    {entry.roasterName}
                                </div>
                                <div style={{
                                    fontSize: '1.3rem',
                                    lineHeight: '1.5rem',
                                    fontWeight: 600
                                }}>
                                    <Link style={{color: '#fff'}} onClick={() => handleDrawerClick()}>
                                        {entry.name}
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div style={{marginRight: 30}}>
                            <div style={{display: 'flex', marginBottom: 5, width: 250, placeItems: 'center'}}>
                                <RatingTable ratingDimensions={ratingDimensions} onRatingChange={handleRatingChange}
                                             ratings={ratings} emptyColor={'#555'} showLabel={false}
                                             fontSize={'0.85rem'} size={20} paddingData={0} iconsCount={10}/>
                            </div>
                        </div>

                        <div style={{display: 'flex', flexDirection: 'row', placeItems: 'center', marginLeft: 30}}>
                            <IconButton onClick={handleDrawerClick} style={{marginRight: 8}}>
                                <EditIcon fontSize='small' style={{color: '#eee'}}/>
                            </IconButton>
                            <IconButton onClick={handleCloneClick} style={{marginRight: 8}}>
                                <ContentCopyIcon fontSize='small' style={{color: '#eee'}}/>
                            </IconButton>

                            <IconButton onClick={handleFlaggedChange} style={{marginRight: 8}}>
                                <ThumbUpIcon fontSize='small' style={{color: flaggedColor}}/>
                            </IconButton>

                            <Tooltip title='Details' arrow disableFocusListener>
                                <ExpandMore style={{height: 36, width: 36}} onClick={handleChange} expand={expanded}>
                                    <ExpandMoreIcon/>
                                </ExpandMore>
                            </Tooltip>

                        </div>
                    </div>
                    <Stack direction='row' spacing={0}
                           style={{flexWrap: 'wrap', alignContent: 'center'}}>
                        <FieldValue name='Latest Brew' value={`${entryDate} ${entryTime}`}
                                    style={{marginRight: 15}}/>
                        <FieldValue name='Dose' value={entry.dose} suffix={entry.doseUnit}
                                    style={{marginRight: 15}}/>
                        <FieldValue name='Yield' value={entry.yield} suffix={entry.yieldUnit}
                                    style={{marginRight: 15}}/>
                        <FieldValue name='Temp' value={entry.temperature} suffix={entry.temperatureUnit}
                                    style={{marginRight: 15}}/>
                        <FieldValue name='Grind' value={entry.grinderSetting}
                                    style={{marginRight: 15}}/>
                        <FieldValue name='Recipe/Prep' value={entry.recipePrep}
                                    style={{}}/>
                    </Stack>
                </div>
            </CardContent>

            <Collapse in={expanded} timeout='auto' unmountOnExit>
                <CardContent style={{textAlign: 'left', padding: '0px 10px', color: '#fff'}}>

                    <Stack direction='row' spacing={0} style={{flexWrap: 'wrap', marginBottom: 8}}>
                        <div style={{display: ' flex'}}>
                            <FieldValue name='Roast Date' value={entry.roastDate} style={{marginRight: 16}}/>
                            <FieldValue name='Rested' value={entry.restedDays} suffix={' days'}
                                        style={{marginRight: 24}}/>
                        </div>
                        <FieldValue name='Grinder' value={entry.grinderName} style={{marginRight: 24}}/>
                        <FieldValue name='Equipment' value={entry.machineName} style={{marginRight: 24}}/>
                    </Stack>

                    <Stack direction='row' spacing={0} style={{flexWrap: 'wrap', marginBottom: 8}}>
                        <FieldValue name='Tasting Notes' value={entry.tastingNotes} style={{marginRight: 24}}/>
                        <FieldValue name='Roaster Tasting Notes' value={entry.roasterTastingNotes} style={{marginRight: 24}}/>
                    </Stack>

                    <Stack direction='row' spacing={0} style={{flexWrap: 'wrap', marginBottom: 8}}>
                        <FieldValue name='Origin' value={entry.origin} style={{marginRight: 24}}/>
                        <FieldValue name='Roast Level' value={entry.roastLevel} style={{marginRight: 24}}/>
                        <FieldValue name='Caffeine' value={entry.caffeine} style={{marginRight: 24}}/>
                        <FieldValue name='Roasted In'
                                    value={LocationDisplay([entry.roasterCity, entry.roasterCountry])}
                                    style={{marginRight: 24}}/>
                        <FieldValue name='Roast Date' value={entry.roastDate} style={{marginRight: 24}}/>
                        <FieldValue name='Rested Days' value={entry.restedDays} style={{marginRight: 24}}/>
                    </Stack>

                    <Stack direction='row' spacing={0} style={{flexWrap: 'wrap', marginBottom: 8}}>
                        <FieldValue name='Weight' value={entry.weight} suffix={entry.weightUnit} style={{marginRight: 24}}/>
                        <FieldValue name='Price' value={parseFloat(entry.price).toFixed(2)}
                                    prefix={`${currencySymbol} `} suffix={` ${currencyDescription}`}
                                    style={{marginRight: 24}}/>
                        <FieldValue name='Price per 100g' value={entry.price100g} prefix={`${entry.priceUnit} `}
                                    suffix={'/100g'} style={{marginRight: 24}}/>
                        <FieldValue name='Price per Pound' value={entry.pricePound} prefix={`${entry.priceUnit} `}
                                    suffix={'/lb'} style={{marginRight: 24}}/>
                    </Stack>

                    <Stack direction='row' spacing={0} style={{flexWrap: 'wrap', marginBottom: 8}}>
                        <FieldValue name='Link' value={beanLink} style={{marginRight: 24}}/>
                    </Stack>

                    <div style={{display: flexStyle, marginBottom: 8}}>
                        <div style={{maxWidth: ratingWidth, marginBottom: 5, marginRight: 10}}>
                            <RatingTable ratingDimensions={ratingDimensionsFull} onRatingChange={handleRatingChange}
                                         ratings={ratings} emptyColor={'#555'} showLabel={true} useTable={true}
                                         fontSize={'0.85rem'} size={ratingSize} paddingData={0} iconsCount={10}
                                         backgroundColor={'transparent'}/>
                        </div>

                        <FieldValue name='Overall Notes'
                                    value={notesLines?.map((line, index) =>
                                        <div key={index} style={{marginLeft: 5}}>
                                            {line}<br/>
                                        </div>
                                    )}
                                    style={{marginRight: 20}}/>
                    </div>


                    <div style={{display: 'flex', placeContent: 'center'}}>
                        <LogEntryButton entry={entry} entryType={'brew'} size={'small'}/>
                        <div
                            style={{
                                display: 'flex',
                                flexGrow: 1,
                                placeContent: 'center end',
                                marginRight: 5
                            }}>
                            <Tooltip title='Edit' arrow disableFocusListener>
                                <IconButton onClick={handleDrawerClick} style={{marginRight: 2}}>
                                    <EditIcon fontSize='medium' style={{color: '#eee'}}/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title='Delete' arrow disableFocusListener>
                                <IconButton onClick={handleDeleteConfirm}>
                                    <DeleteIcon fontSize='medium' style={{color: '#e3aba0'}}/>
                                </IconButton>
                            </Tooltip>
                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
                                  slotProps={{paper: {sx: {backgroundColor: '#333'}}}}>
                                <div style={{padding: 20, textAlign: 'center'}}>
                                    Delete cannot be undone.<br/>
                                    Are you sure?
                                </div>
                                <div style={{textAlign: 'center'}}>
                                    <Button style={{marginBottom: 10, color: '#000'}}
                                            variant='contained'
                                            onClick={handleDelete}
                                            edge='start'
                                            color='error'
                                    >
                                        Delete Brew
                                    </Button>
                                </div>
                            </Menu>
                        </div>
                    </div>

                    <Tracker feature='beanDetails' id={entry.id}/>
                </CardContent>
            </Collapse>
        </Card>
    )
}

