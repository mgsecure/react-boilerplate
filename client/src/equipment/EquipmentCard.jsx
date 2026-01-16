import React, {useCallback, useContext, useEffect, useRef, useState} from 'react'
import queryString from 'query-string'
import Tracker from '../app/Tracker.jsx'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {styled, useTheme} from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import DBContext from '../app/DBContext.jsx'
import {enqueueSnackbar} from 'notistack'
import Menu from '@mui/material/Menu'
import {Button} from '@mui/material'
import Link from '@mui/material/Link'
import ItemDrawer from '../profile/ItemDrawer.jsx'
import Tooltip from '@mui/material/Tooltip'
import LogEntryButton from '../entries/LogEntryButton.jsx'
import DeleteEntryButton from '../entries/DeleteEntryButton.jsx'
import FieldValue from '../misc/FieldValue.jsx'

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

export default function EquipmentCard({entry = {}, expanded, onExpand}) {
    const {updateCollection} = useContext(DBContext)
    const [scrolled, setScrolled] = useState(false)
    const ref = useRef(null)
    const theme = useTheme()

    const handleDelete = useCallback(async () => {
        try {
            await updateCollection({collection: 'equipment', item: entry, flags: {delete: true}})
            enqueueSnackbar('Equipment deleted.', {variant: 'success'})
        } catch (error) {
            enqueueSnackbar(`Error deleting equipment: ${error}`, {variant: 'error', autoHideDuration: 3000})
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
    }, [expanded, scrolled, entry?.id])

    const sep = entry.brand && entry.model ? ' ' : ''
    const entryName = `${entry.brand || ''}${sep}${entry.model || ''}`.trim()
    const notesLines = entry.notes?.split('\n')

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
            <CardContent
                style={{
                    display: 'flex', placeContent: 'center', textAlign: 'center',
                    alignItems: 'center', padding: 8
                }}>
                <Tooltip title='Edit' arrow disableInteractive placement={'top'}>
                    <IconButton onClick={handleDrawerClick} style={{marginRight: 5, marginTop: 8}}>
                        <EditIcon fontSize='small' style={{color: '#eee'}}/>
                    </IconButton>
                </Tooltip>

                <div style={{flexGrow: 1, marginBottom: 0}}>
                    <div style={{fontSize: '0.85rem', marginBottom: 1, fontWeight: 500, opacity: 0.6}}>
                        {entry.type}
                    </div>
                    <div style={{
                        fontSize: '1.2rem',
                        fontWeight: 600,
                        textAlign: 'center',
                        flexGrow: 1
                    }}>
                        <Link style={{color: '#fff'}} onClick={() => handleDrawerClick()}>
                            {entryName}
                        </Link>
                    </div>
                </div>

                <Tooltip title='Details' arrow disableFocusListener disableInteractive placement={'top'}>
                    <ExpandMore style={{height: 36, width: 36, marginLeft: 5, marginTop: 8}} onClick={handleChange}
                                expand={expanded}>
                        <ExpandMoreIcon/>
                    </ExpandMore>
                </Tooltip>
            </CardContent>
            <CardActions sx={{padding: '0px 5px 4px 5px'}}>
                <div style={{width: '100%', display: 'flex', placeItems: 'center'}}>
                </div>
            </CardActions>

            <ItemDrawer item={entry} open={drawerOpen} setOpen={setDrawerOpen} type={'Equipment'}/>

            <Collapse in={expanded} timeout='auto' unmountOnExit>
                <CardContent style={{display: 'flex', textAlign: 'left', padding: 10, color: '#fff'}}>
                    <div style={{display: 'flex', flexGrow: 1}}>
                        <FieldValue name='Model Year' value={entry.year} style={{marginRight: 24}}/>
                        <FieldValue name='Notes' value={entry.notes &&
                            notesLines.map((line, index) =>
                                <div key={index} style={{marginLeft: 5}}>
                                    {line}<br/>
                                </div>
                            )
                        } style={{marginRight: 24}}/>
                    </div>
                    <div style={{display: 'flex', placeItems: 'center'}}>
                        <LogEntryButton entry={entry} entryType={'Gear'} size={'small'}/>
                        <DeleteEntryButton entry={entry} entryType={'Gear'} handleDelete={handleDelete}
                                           size={'small'} style={{marginRight: 8}} tooltipPlacement={'top'}/>

                    </div>

                    <Tracker feature='machineDetails' page={entry.name} id={entry.id}/>
                </CardContent>
            </Collapse>
        </Card>
    )
}
