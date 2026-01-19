import React, {useCallback, useContext, useEffect, useState} from 'react'
import Tooltip from '@mui/material/Tooltip'
import DBContext from '../app/DBContext.jsx'
import {alpha} from '@mui/material'
import Zoom from '@mui/material/Zoom'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import LockIcon from '@mui/icons-material/Lock'
import IconButton from '@mui/material/IconButton'
import {useTheme} from '@mui/material/styles'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import ReplayIcon from '@mui/icons-material/Replay'
import StopIcon from '@mui/icons-material/Stop'
import GpsFixedIcon from '@mui/icons-material/GpsFixed'
import CancelIcon from '@mui/icons-material/Cancel'

import {useStopwatch} from './Stopwatch.jsx'

export default function YieldCalculatorButton() {
    const {calculator, setCalculator} = useContext(DBContext)
    const theme = useTheme()

    const {start, stop, reset, running, duration, formattedTimeMS} = useStopwatch()

    const [form, setForm] = useState(calculator || {dose: '18', yield: '36', ratio: '2'})
    useEffect(() => {
        setForm(calculator || {dose: '18', yield: '36', ratio: '2'})
    }, [calculator])

    const [locked, setLocked] = useState('dose')

    const handleFormChange = useCallback((event) => {
        const {name, value} = event.target

        console.log('handleFormChange', {name, value})
        const valueNum = parseFloat(value.replace(/[^0-9.]/g, ''))
        const doseNum = parseInt(form.dose)
        const yieldNum = parseInt(form.yield)
        const ratioNum = parseInt(form.ratio)

        function checkNumber(number) {
            return Number.isNaN(number) || !Number.isFinite(number) ? 0 : number
        }

        let newForm = {...form}

        if (name === 'dose') {
            if (locked === 'dose' || locked === 'ratio') {
                const yieldX = (checkNumber(ratioNum * valueNum)).toFixed(0)
                newForm = {...newForm, dose: valueNum, yield: yieldX}
            } else if (locked === 'yield') {
                const ratio = (checkNumber(yieldNum / valueNum)).toFixed(1).replace('.0', '')
                newForm = {...newForm, dose: valueNum, ratio}
            }
        } else if (name === 'yield') {
            if (locked === 'yield' || locked === 'dose') {
                const ratio = (checkNumber(valueNum / doseNum)).toFixed(1).replace('.0', '')
                newForm = {...newForm, yield: valueNum, ratio}
            } else if (locked === 'ratio') {
                const dose = (checkNumber(valueNum / ratioNum)).toFixed(0)
                newForm = {...newForm, yield: valueNum, dose}
            }
        } else if (name === 'ratio') {
            if (locked === 'dose' || locked === 'ratio') {
                const yieldX = (checkNumber(doseNum * valueNum)).toFixed(0)
                newForm = {...newForm, ratio: valueNum, yield: yieldX}
            } else if (locked === 'yield') {
                const dose = (checkNumber(yieldNum / valueNum)).toFixed(0)
                newForm = {...newForm, ratio: valueNum, dose}
            }
        }
        setForm(newForm)
        setCalculator(newForm)
    }, [form, setCalculator, locked])

    const [menuOpen, setMenuOpen] = useState(false)

    const handleClick = useCallback((ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        setMenuOpen(true)
    }, [])

    const handleClose = useCallback((ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        stop()
        setMenuOpen(false)
    }, [stop])

    const diameter = '345px'

    return (
        <>
            <Tooltip title='Dial it in!' arrow disableFocusListener>
                <IconButton onClick={handleClick} style={{height: 40, width: 40, marginTop: 5}}>
                    <GpsFixedIcon size='small' style={{height: 20, width: 20}}/>
                </IconButton>
            </Tooltip>
            <Dialog open={menuOpen} onClose={handleClose}
                    slotProps={{
                        paper: {
                            sx: {
                                backgroundColor: 'transparent',
                                backgroundImage: 'none',
                                boxShadow: 'none',
                                padding: 0,
                                margin: '-200px 0px 0px 0px',
                                placeItems: 'center',
                                placeContent: 'center',
                                textAlign: 'center',

                            }
                        }
                    }}>
                <Zoom in={menuOpen}>
                    <div style={{textAlign: 'right'}}>
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            right: 20
                        }}>
                            <IconButton onClick={handleClose} style={{}}>
                                <CancelIcon fontSize='large' style={{color: alpha(theme.palette.primary.main, 0.6)}}/>
                            </IconButton>
                        </div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            textAlign: 'center',
                            backgroundColor: '#333',
                            border: '2px solid #999',
                            placeItems: 'center',
                            paddingTop: 60,
                            height: diameter,
                            width: diameter,
                            borderRadius: '50%',
                            margin: '0px 0px 0px 0px'
                        }}>
                            <div style={{display: 'flex', placeItems: 'center', marginBottom: 10, width: 250}}>
                                <div style={{width: 125, placeItems: 'center'}}>
                                    <div style={{
                                        display: 'flex',
                                        placeContent: 'flex-end center',
                                        fontSize: '1.2rem',
                                        fontWeight: 600,
                                        marginBottom: 4
                                    }}>
                                        <div style={{margin: '0px 2px 0px 7px'}}>Dose</div>
                                        <LockedIcon variable={'dose'} locked={locked} setLocked={setLocked}/>
                                    </div>
                                    <TextField type='number' name='dose' style={{width: 75}}
                                               size='small' color='info'
                                               onChange={handleFormChange} value={form.dose || ''}
                                               sx={{input: {textAlign: 'center'}}} tabIndex={1}/>
                                </div>

                                <div style={{width: 125, placeItems: 'center'}}>
                                    <div style={{
                                        display: 'flex',
                                        placeContent: 'flex-end center',
                                        fontSize: '1.2rem',
                                        fontWeight: 600,
                                        marginBottom: 4
                                    }}>
                                        <div style={{margin: '0px 2px 0px 7px'}}>Yield</div>
                                        <LockedIcon variable={'yield'} locked={locked} setLocked={setLocked}/>
                                    </div>
                                    <TextField type='number' name='yield' style={{width: 75}}
                                               size='small' color='info'
                                               onChange={handleFormChange} value={form.yield || ''}
                                               sx={{input: {textAlign: 'center'}}} tabIndex={2}/>
                                </div>
                            </div>

                            <div style={{display: 'flex', placeItems: 'center', marginBottom: 10}}>
                                <div style={{width: 125, placeItems: 'center'}}>
                                    <div style={{
                                        display: 'flex',
                                        placeContent: 'flex-end center',
                                        fontSize: '1.2rem',
                                        fontWeight: 600,
                                        marginBottom: 4
                                    }}>
                                        <div style={{margin: '0px 2px 0px 7px'}}>Ratio</div>
                                        <LockedIcon variable={'ratio'} locked={locked} setLocked={setLocked}/>
                                    </div>
                                    <div style={{display: 'flex', placeContent: 'center', marginLeft: 7}}>
                                        <TextField type='number' name='ratio' style={{width: 75}}
                                                   size='small' color='info'
                                                   onChange={handleFormChange} value={form.ratio || ''}
                                                   sx={{input: {textAlign: 'center'}}} tabIndex={2}/>
                                        <div style={{fontSize: '1.2rem', fontWeight: 500, margin: 4}}>:1</div>
                                    </div>
                                </div>

                                <div style={{width: 125, placeItems: 'center', padding: 10}}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                        fontSize: '1.2rem',
                                        fontWeight: 600,
                                        marginBottom: 4
                                    }}>
                                        <div style={{margin: '0px 2px 0px 0px'}}>Stopwatch</div>
                                    </div>
                                    <div style={{
                                        display: 'flex', placeItems: 'center', height: 40,
                                        fontSize: '1.1rem', fontWeight: 600, border: '1px solid',
                                        borderColor: alpha(theme.palette.primary.main, 0.3), borderRadius: 5,
                                        padding: '0px 10px'
                                    }}>
                                        {formattedTimeMS}
                                    </div>
                                </div>

                            </div>
                            <div>
                                <IconButton
                                    onClick={running ? stop : start}
                                    size='large'
                                    style={{
                                        color: running ? theme.palette.warning.main : theme.palette.info.main,
                                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                        marginTop: 10, marginRight: 15
                                    }}>
                                    {running ? <StopIcon/> : <PlayArrowIcon/>}
                                </IconButton>
                                <IconButton onClick={reset} disabled={!duration || running}
                                            size='large'
                                            style={{
                                                backgroundColor: alpha(theme.palette.primary.main, 0.3),
                                                marginTop: 10
                                            }}>
                                    <ReplayIcon/>
                                </IconButton>
                            </div>
                        </div>
                    </div>
                </Zoom>
            </Dialog>
        </>
    )
}

const LockedIcon = ({variable, locked, setLocked}) => {
    const theme = useTheme()
    const color = locked === variable ? theme.palette.info.main : alpha(theme.palette.primary.main, 0.3)
    const handleClick = useCallback(() => setLocked(variable), [setLocked, variable])

    return (
        <IconButton size='small' style={{height: 30, width: 30}} onClick={handleClick}>
            <LockIcon fontSize='small' style={{height: 18, width: 18, color: color}}/>
        </IconButton>
    )
}