import React, {useCallback, useContext, useEffect, useRef, useState} from 'react'
import queryString from 'query-string'
import Tracker from '../app/Tracker.jsx'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {styled} from '@mui/material/styles'
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
import ItemDrawer from './ItemDrawer.jsx'

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

export default function EquipmentCard({machine, expanded, onExpand}) {
    const {updateCollection} = useContext(DBContext)
    const [scrolled, setScrolled] = useState(false)
    const ref = useRef(null)

    const handleDelete = useCallback(async () => {
        try {
            await updateCollection({collection:'equipment', item:machine, flags: {delete: true}})
            enqueueSnackbar('Equipment deleted.', {variant: 'success'})
        } catch (error) {
            enqueueSnackbar(`Error deleting equipment: ${error}`, {variant: 'error', autoHideDuration: 3000})
        }
    }, [machine, updateCollection])

    const handleChange = useCallback(() => {
        onExpand(!expanded ? machine.id : false)
    }, [machine?.id, expanded, onExpand])

    useEffect(() => {
        if (expanded && ref && !scrolled) {
            const isMobile = window.innerWidth <= 600
            const offset = isMobile ? 70 : 74
            const {id} = queryString.parse(location.search)
            const isIdFiltered = id === machine.id

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
    }, [expanded, scrolled, machine.id])

    const sep = machine.brand && machine.model ? ' ' : ''
    const machineName = `${machine.brand || ''}${sep}${machine.model || ''}`.trim()
    const notesLines = machine.notes?.split('\n')

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
                backgroundColor: '#563028',
                color: '#fff',
                alignContent: 'center',
                boxShadow: 'unset',
                padding: '0px'
            }}
            ref={ref}>
            <CardContent style={{placeContent: 'center', textAlign: 'center', alignItems: 'center', padding: '5px 5px 0px 5px'}}>
                <div style={{marginTop: 8}}>
                    <div style={{fontSize: '0.85rem', marginBottom: 1, fontWeight:500}}>{machine.type}</div>
                    <div style={{
                        fontSize: '1.2rem',
                        fontWeight: 600,
                        textAlign: 'center',
                        flexGrow: 1,
                    }}>
                        <Link style={{color: '#fff'}} onClick={() => handleDrawerClick()}>
                            {machineName}
                        </Link>
                    </div>
                </div>
            </CardContent>
            <CardActions sx={{padding: '0px 5px 4px 5px'}}>
                <div style={{width: '100%', display: 'flex', placeItems: 'center'}}>
                    <IconButton onClick={handleDrawerClick} style={{marginRight: 2}}>
                        <EditIcon fontSize='small' style={{color: '#eee'}}/>
                    </IconButton>
                    <IconButton onClick={handleDeleteConfirm}>
                        <DeleteIcon fontSize='small' style={{color: '#e3aba0'}}/>
                    </IconButton>
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
                                Delete {machine.type}
                            </Button>
                        </div>
                    </Menu>

                    {machine.notes &&
                        <ExpandMore style={{height: 36, width:36}} onClick={handleChange} expand={expanded}>
                            <ExpandMoreIcon/>
                        </ExpandMore>
                    }
                </div>
            </CardActions>

            <ItemDrawer item={machine} open={drawerOpen} setOpen={setDrawerOpen} type={'Equipment'}/>

            <Collapse in={expanded} timeout='auto' unmountOnExit>
                <CardContent style={{textAlign: 'left', padding: 10, color: '#fff'}}>
                    <div style={{fontSize: '0.8rem'}}>&nbsp;{machine.year}&nbsp;</div>

                    {machine.notes &&
                        notesLines.map((line, index) =>
                            <div key={index} style={{marginLeft: 5}}>
                                {line}<br/>
                            </div>
                        )
                    }
                    {!machine.notes &&
                        <div style={{width: '100%', textAlign: 'center', marginBottom: 10, fontStyle: 'italic'}}>
                            no machine details available<br/>
                        </div>
                    }
                    <Tracker feature='machineDetails' page={machine.title} id={machine.id}/>
                </CardContent>
            </Collapse>
        </Card>
    )
}
