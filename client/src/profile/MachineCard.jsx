import React, {useCallback, useEffect, useRef, useState} from 'react'
import queryString from 'query-string'
import Tracker from '../app/Tracker.jsx'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import useWindowSize from '../util/useWindowSize.jsx'

import {styled} from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import {openInNewTab} from '../util/openInNewTab'

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

export default function MachineCard({machine, expanded, onExpand}) {

    const [scrolled, setScrolled] = useState(false)
    const ref = useRef(null)

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

    const machineName = `${machine.brand || ''}${machine.brand && machine.model && ' '}${machine.model ? ' ' + machine.model : ''}`.trim()
    const notesLines = machine.notes?.split('\n')
    const expandColor = machine.notes ? '#bbb' : '#444'
    const backgroundColor = machine.type === 'Grinder' ? '#333' : '#563028'

    const {width} = useWindowSize()
    const smallWindow = width <= 500

    const headerFlexStyle = smallWindow ? {display: 'flex', placeItems: 'center'} : {placeItems: 'center'}
    const nameAlign = smallWindow ? 'left' : 'center'
    const linkDivStyle = smallWindow ? {width: '10%', marginLeft: 65} : {}

    const machinesTestData = [
        {
            id: 'machine0',
            type: 'Espresso',
            brand: '9Barista',
            model: 'Mk.2',
            year: '2025',
            PID: false,
            mod: 'Stock',
            notes: 'The La Marzocco Linea Mini is a compact version of the iconic Linea Classic, designed for home use. It features dual boilers, a saturated group head, and commercial-grade components to deliver café-quality espresso at home.',
            link: 'https://www.9barista.com'
        }
    ]
    return (
        <Card
            style={{backgroundColor: '#563028', color: '#fff', placeContent: 'center', boxShadow: 'unset', padding: '0px'}}
            ref={ref}>
            <CardContent style={{padding: '10px 5px 0px 5px', textAlign: 'center'}}>
                <div>
                    <div style={{fontSize: '0.8rem', marginBottom: 5}}>{machine.type}</div>
                    <div style={{
                        fontSize: '1.2rem',
                        fontWeight: 600,
                        textAlign: nameAlign,
                        flexGrow: 1,
                        overflow: 'hidden',
                        height: '1.5rem'
                    }}>
                        {machineName}
                    </div>
                    <div style={{fontSize: '0.8rem'}}>{machine.year}</div>

                </div>
            </CardContent>
            <CardActions sx={{padding: '0px 5px'}}>
                <div style={{width: '100%', display: 'flex', placeItems: 'center'}}>
                    <ExpandMore style={{height: 40}} onClick={handleChange} expand={expanded}>
                        <ExpandMoreIcon style={{color: expandColor}}/>
                    </ExpandMore>
                </div>
            </CardActions>

            <Collapse in={expanded} timeout='auto' unmountOnExit>
                <CardContent style={{textAlign: 'left', padding: 10, color: '#fff'}}>
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
