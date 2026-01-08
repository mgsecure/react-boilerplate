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
import {Button} from '@mui/material'
import {beanFields} from '../data/equipmentBeans'
import useWindowSize from '../util/useWindowSize.jsx'
import Stack from '@mui/material/Stack'
import FieldValue from '../misc/FieldValue.jsx'
import isValidUrl from '../util/isValidUrl'
import Link from '@mui/material/Link'
import {openInNewTab} from '../util/openInNewTab'
import ItemDrawer from './ItemDrawer.jsx'
import LogEntryButton from '../entries/LogEntryButton.jsx'
import Tooltip from '@mui/material/Tooltip'
import RatingTable from '../misc/RatingTable.jsx'

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

export default function BeanCard({entry = {}, expanded, onExpand}) {
    const {updateCollection} = useContext(DBContext)
    const [scrolled, setScrolled] = useState(false)
    const ref = useRef(null)

    const handleDelete = useCallback(async () => {
        try {
            await updateCollection({collection: 'beans', item: entry, flags: {delete: true}})
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

    const ratings = useMemo(() => entry.ratings || {}, [entry])
    const ratingDimensions = {rating: 'rating'}

    const handleUpdate = useCallback(async (entry) => {
        const cleanEntry = Object.fromEntries(
            Object.entries(entry).filter(([_key, value]) => {
                return value !== null && typeof value !== 'undefined'
            })
        )
        const flags = entry ? {update: true} : {}
        try {
            await updateCollection({collection: 'beans', item: cleanEntry, flags})
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

    const beanFieldsOther = beanFields.filter(field => !['id', 'roaster', 'name'].includes(field))
    const moreDetails = Object.keys(entry).some(key => beanFieldsOther.includes(key))
    const notesLines = entry.notes?.split('\n')
    const linkSx = {
        color: '#aaa', textDecoration: 'none', cursor: 'pointer',
        '&:hover': {color: '#fff'}
    }
    const locationSep = (!!entry.roasterCity && entry.roasterCountry) ? ', ' : ''
    const beanUrl = isValidUrl(entry.url) ? entry.url : undefined
    const beanLink = beanUrl ? <Link sx={linkSx} onClick={() => openInNewTab(entry.url)}>{entry.url}</Link> : entry.url

    const [drawerOpen, setDrawerOpen] = useState(false)
    const handleDrawerClick = useCallback(() => {
        setDrawerOpen(true)
    }, [])

    const [anchorEl, setAnchorEl] = useState(null)
    const handleDeleteConfirm = useCallback((ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        setAnchorEl(ev.currentTarget)
    }, [])

    const theme = useTheme()

    const {isMobile, flexStyle} = useWindowSize()
    const detailsDivWidth = isMobile ? 36 : 74
    const flexDirection = isMobile ? 'column' : 'row'

    return (
        <Card
            style={{
                backgroundColor: theme.palette.card.main,
                color: '#fff',
                alignContent: 'center',
                boxShadow: 'unset',
                padding: '0px'
            }}
            ref={ref}>
            <CardContent style={{display: 'flex', placeItems: 'center', padding: 10}}>
                <div
                    style={{display: 'flex', flexDirection: flexDirection, placeItems: 'center start', marginRight: 5}}>
                    <Tooltip title='Edit' arrow disableFocusListener>
                        <IconButton onClick={handleDrawerClick} style={{marginRight: 2}}>
                            <EditIcon fontSize='small' style={{color: '#eee'}}/>
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
                                Delete Bean
                            </Button>
                        </div>
                    </Menu>
                </div>
                <div style={{marginBottom: 5, flexGrow: 1, placeContent: 'center', textAlign: 'center'}}>
                    <div style={{fontSize: '0.85rem', marginBottom: 1, fontWeight: 500, opacity: 0.6}}>
                        {entry.roaster}
                    </div>
                    <div style={{
                        fontSize: '1.1rem',
                        lineHeight: '1.4rem',
                        fontWeight: 600,
                        textAlign: 'center',
                        flexGrow: 1,
                        marginBottom: 5
                    }}>
                        <Link style={{color: '#fff'}} onClick={() => handleDrawerClick()}>
                            {entry.name}
                        </Link>
                    </div>
                    {entry.ratings?.rating &&
                        <RatingTable ratingDimensions={ratingDimensions} onRatingChange={handleRatingChange}
                                     ratings={ratings} emptyColor={'#555'} showLabel={false}
                                     fontSize={'0.85rem'} size={19} paddingData={0} iconsCount={10}/>
                    }
                </div>

                <div style={{width: detailsDivWidth, display: 'flex', placeItems: 'center end', marginLeft: 5}}>
                    <Tooltip title='Details' arrow disableFocusListener>
                        <ExpandMore style={{height: 36, width: 36}} onClick={handleChange} expand={expanded}>
                            <ExpandMoreIcon/>
                        </ExpandMore>
                    </Tooltip>
                </div>
            </CardContent>

            <ItemDrawer item={entry} open={drawerOpen} setOpen={setDrawerOpen} type={'Bean'}/>

            <Collapse in={expanded} timeout='auto' unmountOnExit>
                <CardContent style={{textAlign: 'left', padding: 10, color: '#fff'}}>
                    <Stack direction='row' spacing={0} style={{flexWrap: 'wrap', marginBottom: 8}}>
                        <FieldValue name='Rating' value={entry.ratings?.rating} suffix={'/10'}
                                    style={{marginRight: 24}}/>
                        <FieldValue name='Tasting Notes' value={entry.tastingNotes} style={{marginRight: 24}}/>
                        <FieldValue name='Roaster Tasting Notes' value={entry.roasterNotes} style={{marginRight: 24}}/>
                    </Stack>

                    {entry.notes &&
                        notesLines.map((line, index) =>
                            <div key={index} style={{marginLeft: 5}}>
                                {line}<br/>
                            </div>
                        )
                    }

                    <Stack direction='row' spacing={0} style={{flexWrap: 'wrap', marginBottom: 8}}>
                        <FieldValue name='Origin' value={entry.origin} style={{marginRight: 24}}/>
                        <FieldValue name='Roast Level' value={entry.roastLevel} style={{marginRight: 24}}/>
                        <FieldValue name='Caffeine' value={entry.caffeine} style={{marginRight: 24}}/>
                        <FieldValue name='Roasted In'
                                    value={<span>{entry.roasterCity}{locationSep}{entry.roasterCountry}</span>}
                                    style={{marginRight: 24}}/>
                        <FieldValue name='Roast Date' value={entry.roastDate} style={{marginRight: 24}}/>
                        <FieldValue name='Rested Days' value={entry.restedDays} style={{marginRight: 24}}/>
                    </Stack>

                    <Stack direction='row' spacing={0} style={{flexWrap: 'wrap', marginBottom: 8}}>
                        <FieldValue name='Weight' value={entry.weight} suffix={'g'} style={{marginRight: 24}}/>
                        <FieldValue name='Price' value={entry.price} prefix={entry.currencySymbol}
                                    style={{marginRight: 24}}/>
                        <FieldValue name='Price per 100g' value={entry.price100g} prefix={entry.currencySymbol}
                                    suffix={'/100g'} style={{marginRight: 24}}/>
                        <FieldValue name='Price per Pound' value={entry.pricePound} prefix={entry.currencySymbol}
                                    suffix={'/lb'} style={{marginRight: 24}}/>
                    </Stack>

                    <Stack direction='row' spacing={0} style={{flexWrap: 'wrap', marginBottom: 8}}>
                        <FieldValue name='Link' value={beanLink} style={{marginRight: 24}}/>
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
