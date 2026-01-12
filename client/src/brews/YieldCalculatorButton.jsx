import React, {useCallback, useContext, useEffect, useState} from 'react'
import Tooltip from '@mui/material/Tooltip'
import DBContext from '../app/DBContext.jsx'
import {Button} from '@mui/material'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import AuthContext from '../app/AuthContext.jsx'

export default function YieldCalculatorButton() {

    const {userProfile = {}, updateProfileField} = useContext(DBContext)
    const {isLoggedIn} = useContext(AuthContext)
    const [form, setForm] = useState(userProfile.yieldCalculator || {dose: '18', yield: '36', ratio: '2'})

    useEffect(() => {
        setForm(userProfile.yieldCalculator || {dose: '18', yield: '36', ratio: '2'})
    }, [userProfile.yieldCalculator])


    const handleFormChange = useCallback((event) => {
        const {name, value} = event.target

        let valueNum = parseFloat(value.replace(/[^0-9.]/g, ''))
        const doseNum = parseInt(form.dose)
        const yieldNum = parseInt(form.yield)

        function checkNumber(number) {
            return Number.isNaN(number) || !Number.isFinite(number) ? 0 : number
        }

        if (name === 'dose') {
            const ratio = (checkNumber(yieldNum / valueNum)).toFixed(1).replace('.0', '')
            setForm({...form, dose: valueNum, ratio: ratio})
        } else if (name === 'yield') {
            const ratio = (checkNumber(valueNum / doseNum)).toFixed(1).replace('.0', '')
            setForm({...form, yield: valueNum, ratio: ratio})
        } else if (name === 'ratio') {
            const yieldX = (checkNumber(doseNum * valueNum)).toFixed(0)
            setForm({...form, ratio: valueNum, yield: yieldX})
        }
    }, [form])

    const [menuOpen, setMenuOpen] = useState(false)

    const handleClick = useCallback((ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        setMenuOpen(true)
    }, [])

    const handleSave = useCallback(async (ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        await updateProfileField('yieldCalculator', form)
        setMenuOpen(false)
    }, [form, updateProfileField])

    const handleClose = useCallback((ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        setMenuOpen(false)
        setForm(userProfile.yieldCalculator || {dose: '18', yield: '36', ratio: '2'})
    }, [userProfile.yieldCalculator])

    const marginTop = isLoggedIn ? 0 : 20

    return (
        <>
            <Tooltip title='Yield Calculator' arrow disableFocusListener>
                <Button onClick={handleClick}
                        style={{
                            fontWeight: 700, padding: 0,
                            minWidth: 48, height: 48, borderRadius: 24
                        }}>
                    {userProfile.yieldCalculator?.ratio || '2'}:1
                </Button>
            </Tooltip>
            <Dialog open={menuOpen} onClose={handleClose}
                    slotProps={{
                        paper: {
                            sx: {
                                backgroundColor: '#333',
                                border: '2px solid #999',
                                placeItems: 'center',
                                padding: '35px 30px 30px 30px',
                                height: '290px', width: '290px',
                                borderRadius: '150px'
                            }
                        }
                    }}>
                <div style={{marginTop: marginTop, textAlign: 'center', fontWeight: 700, fontSize: '1.2rem', marginBottom: 5}}>
                    Yield Calculator
                </div>
                <div style={{textAlign: 'center'}}>
                    <div style={{display: 'flex', marginBottom: 10}}>
                        <div style={{marginRight: 15, marginTop: 0}}>
                            <div style={{fontSize: '1.0rem', marginBottom: 0}}>Dose</div>
                            <TextField type='text' name='dose' style={{width: 65}}
                                       size='small' color='info'
                                       onChange={handleFormChange} value={form.dose || ''}
                                       sx={{input: {textAlign: 'center'}}} tabIndex={1}/>
                        </div>
                        <div style={{marginTop: 0}}>
                            <div style={{fontSize: '1.0rem', marginBottom: 0}}>Yield</div>
                            <TextField type='text' name='yield' style={{width: 65}}
                                       size='small' color='info'
                                       onChange={handleFormChange} value={form.yield || ''}
                                       sx={{input: {textAlign: 'center'}}} tabIndex={2}/>
                        </div>
                    </div>
                    <div style={{marginBottom: 16}}>
                        <div style={{fontSize: '1.1rem', fontWeight: 600, marginBottom: 0}}>Ratio</div>
                        <div style={{display: 'flex', placeContent: 'center'}}>
                            <TextField type='text' name='ratio' style={{width: 60}}
                                       size='small' color='info'
                                       onChange={handleFormChange} value={form.ratio || ''}
                                       sx={{input: {textAlign: 'center'}}} tabIndex={2}/>
                            <div style={{fontSize: '1.2rem', fontWeight: 500, margin: 4}}>:1</div>
                        </div>
                    </div>

                    {isLoggedIn &&
                        <Button style={{marginBottom: 0}}
                                variant='contained'
                                onClick={handleSave}
                                color='success'
                        >
                            SAVE
                        </Button>
                    }
                </div>
            </Dialog>
        </>
    )
}