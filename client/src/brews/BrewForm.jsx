import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import useWindowSize from '../util/useWindowSize.jsx'
import SelectBox from '../formUtils/SelectBox.jsx'
import DBContext from '../app/DBContext.jsx'
import {enqueueSnackbar} from 'notistack'
import {useTheme} from '@mui/material/styles'
import DataContext from '../context/DataContext.jsx'
import cleanObject from '../util/cleanObject'
import entryName from '../entries/entryName'
import dayjs from 'dayjs'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider'
import {DatePicker} from '@mui/x-date-pickers/DatePicker'
import {useNavigate} from 'react-router-dom'
import AuthContext from '../app/AuthContext.jsx'
import TimePicker from '../misc/TimePicker.jsx'

export default function BrewForm({entry, open, setOpen, action, coffee}) {
    const {grinderList, machineList, coffeesList, brewsList} = useContext(DataContext)
    const {flexStyle, isMobile} = useWindowSize()
    const {updateCollection} = useContext(DBContext)
    const {isLoggedIn} = useContext(AuthContext)
    const theme = useTheme()
    const navigate = useNavigate()

    console.log('action', {action, entry})
    const baseForm = useMemo(() => {
        return {
            ...entry,
            roastDate: entry?.roastDate ? dayjs(entry.roastDate) : null,
            brewTime: entry?.brewTime ? dayjs(entry.brewTime) : null
        }
    }, [entry])
    const [form, setForm] = useState({})
    const [formChanged, setFormChanged] = useState(false)
    const [uploading, setUploading] = useState(false)
    const saveEnabled = useMemo(() => {
        return isLoggedIn && formChanged && (form.coffeeName || form.coffee || coffee) && !uploading
    }, [coffee, form.coffee, form.coffeeName, formChanged, isLoggedIn, uploading])

    useEffect(() => {
        if (open) {
            let newForm = {...baseForm}
            if (action === 'clone') {
                newForm = {...baseForm, brewedAt: dayjs(), id: `br_${genHexString(8)}`}
            } else if (action === 'add') {
                newForm = {...baseForm, brewedAt: dayjs(), id: `br_${genHexString(8)}`}
            }
            setForm(newForm)
        }
    }, [open, entry, action, baseForm])

    const latestBrew = brewsList?.length > 0 ? brewsList[0] : {}
    const doseUnitDefault = latestBrew.doseUnit || 'g'
    const yieldUnitDefault = latestBrew.yieldUnit || 'g'
    const temperatureUnitDefault = latestBrew.temperatureUnit || '°C'

    useEffect(() => {
        if (open) {
            setForm((prevForm) => ({
                ...prevForm,
                doseUnit: prevForm.doseUnit || doseUnitDefault,
                yieldUnit: prevForm.yieldUnit || yieldUnitDefault,
                temperatureUnit: prevForm.temperatureUnit || temperatureUnitDefault
            }))
        }
    }, [open, doseUnitDefault, yieldUnitDefault, temperatureUnitDefault])

    const coffeeNames = useMemo(() => {
        const systemCoffees = coffeesList.map((coffee) => coffee.fullName)
        return new Set([entry?.coffee?.fullname, ...systemCoffees].filter(Boolean).sort())
    }, [coffeesList, entry?.coffee?.fullname])

    const thisCoffee = useMemo(() => {
        const foundCoffee = coffeesList.find(c => [form.coffeeName, entry?.coffee?.fullName, coffee?.fullname].includes(c.fullName))
        return foundCoffee || entry?.coffee || coffee || {name: form.coffeeName, fulName: form.coffeeName}
    }, [coffee, coffeesList, entry, form.coffeeName])


    const machineNames = useMemo(() => {
        const systemMachines = machineList.reduce((acc, machine) => {
            acc.push(machine.fullName)
            return acc
        }, [])
        return new Set([entryName({
            entry: entry?.machine,
            entryType: 'machine'
        }), ...systemMachines].filter(Boolean).sort())
    }, [entry?.machine, machineList])

    const thisMachine = useMemo(() => {
        return machineList.find(e => e.fullName === form.machineName)
            || entry?.machine || {}
    }, [machineList, entry?.machine, form.machineName])

    const grinderNames = useMemo(() => {
        const systemGrinders = grinderList.reduce((acc, grinder) => {
            acc.push(grinder.fullName)
            return acc
        }, [])
        return new Set([entryName({entry: entry?.grinder}), ...systemGrinders].filter(Boolean).sort())
    }, [entry?.grinder, grinderList])

    const thisGrinder = useMemo(() => {
        return grinderList.find(e => e.fullName === form.grinderName)
            || entry?.grinder || {}
    }, [grinderList, entry?.grinder, form.grinderName])

    const ratio = form.dose && form.yield
        ? (() => {
            const doseNum = parseFloat(form.dose)
            const yieldNum = parseFloat(form.yield)
            if (isNaN(doseNum) || isNaN(yieldNum) || doseNum === 0) return ''
            const r = yieldNum / doseNum
            return `(${r.toFixed(1).replace('.0', '')}:1)`
        })()
        : ''

    const [ratings, setRatings] = useState(entry?.ratings || {})
    const [ratingsChanged, setRatingsChanged] = useState(false)

    const handleAddNew = useCallback((route) => {
        navigate(`/${route}/add`)
    }, [navigate])

    const handleFormChange = useCallback((event) => {
        const {name, value} = event.target
        if (name === 'coffeeName' && value === '[ add coffee ]') {
            setOpen(false)
            handleAddNew('coffees')
            return
        }
        setForm({...form, [name]: value})
        setFormChanged(true)
    }, [form, handleAddNew, setOpen])

    const handleChangeTime = useCallback((value) => {
        handleFormChange({target: {name: 'brewTime', value}})
    }, [handleFormChange])

    const handleReload = useCallback(() => {
        setForm({id: `br_${genHexString(8)}`})
        setUploading(false)
        document.activeElement.blur()
        setOpen(false)
    }, [setOpen])


    const handleSubmit = useCallback(async (event) => {
        event.preventDefault()
        setUploading(true)
        const formCopy = {
            ...form,
            id: form.id || entry?.id || `br_${genHexString(8)}`,
            coffee: cleanObject({
                id: thisCoffee.id,
                name: thisCoffee.name,
                roasterName: thisCoffee.roaster?.name || thisCoffee.roasterName || entry?.coffee?.roaster?.name || entry?.coffee?.roasterName,
                fullName: thisCoffee.fullName || entryName({entry: thisCoffee, entryType: 'coffee'})
            }),
            machine: cleanObject({
                id: thisMachine.id,
                brand: thisMachine.brand,
                model: thisMachine.model,
                fullName: entryName({entry: thisMachine})
            }),
            grinder: cleanObject({
                id: thisGrinder.id,
                brand: thisGrinder.brand,
                model: thisGrinder.model,
                fullName: thisGrinder ? entryName({entry: thisGrinder}) : undefined
            }),
            fullName: entryName({entry: thisCoffee, entryType: 'coffee'}),
            brewedAt: action !== 'clone' ? entry?.brewedAt || entry?.addedAt : dayjs().format('YYYY-MM-DD HH:mm:ss'),
            ratings: ratingsChanged ? ratings : entry?.ratings,
            roastDate: form.roastDate ? dayjs(form.roastDate).format('YYYY-MM-DD HH:mm:ss') : entry?.roastDate,
            brewTime: form.brewTime ? dayjs(form.brewTime).format('YYYY-MM-DD HH:mm:ss') : entry?.brewTime
        }

        delete formCopy.originalEntry
        delete formCopy.roasterName
        delete formCopy.coffeeName
        delete formCopy.machineName
        delete formCopy.grinderName
        const cleanForm = cleanObject(formCopy)

        const flags = action === 'edit'
            ? {update: true, merge: true}
            : action === 'clone'
                ? {update: true}
                : {}

        console.log('submitting form', flags)

        const message = action === 'clone'
            ? 'Copied brew saved.'
            : action === 'edit'
                ? 'Brew changes saved!'
                : 'New brew saved!'
        try {
            await updateCollection({collection: 'brews', item: cleanForm, flags})
            enqueueSnackbar(message, {variant: 'success'})
            setOpen(false)
        } catch (error) {
            enqueueSnackbar(`Error saving brew: ${error}`, {variant: 'error', autoHideDuration: 3000})
        } finally {
            setUploading(false)
        }
    }, [form, thisCoffee, thisMachine, thisGrinder, ratingsChanged, ratings, entry, action, updateCollection, setOpen])

    const paddingLeft = !isMobile ? 15 : 15


    return (
        <div>

            <div style={{marginRight: 5, display: flexStyle, marginBottom: 20}} id={'drawer'}>

                <form action={null} encType='multipart/form-data' method='post'
                      onSubmit={handleSubmit}>
                    <div style={{paddingLeft: paddingLeft, color: theme.palette.text.primary, marginTop: 10}}>

                        <div style={{marginRight: 15, marginBottom: 15}}>
                            <div style={{fontSize: '1.1rem', fontWeight: 500, marginBottom: 2}}>
                                Choose Coffee
                            </div>
                            <SelectBox changeHandler={handleFormChange}
                                       form={form}
                                       name='coffeeName'
                                       optionsList={[...coffeeNames, '[ add coffee ]']}
                                       multiple={false} defaultValue={thisCoffee?.fullName || coffee?.fullName || ''}
                                       size='small' width='100%'/>
                        </div>

                        <div style={{display: flexStyle}}>
                            <div style={{display: 'flex', marginBottom: 10}}>
                                <div style={{marginRight: 0, marginTop: 0}}>
                                    <div style={{fontSize: '1.0rem', marginBottom: 2}}>Dose</div>
                                    <div style={{display: 'flex'}}>
                                        <TextField type='text' name='dose' style={{width: 70, marginRight: 5}}
                                                   size='small'
                                                   onChange={handleFormChange} value={form.dose || ''}
                                                   color='info'/>
                                    </div>
                                </div>

                                <div style={{marginRight: 20, marginTop: 0}}>
                                    <div style={{fontSize: '1.0rem', marginBottom: 2}}>Yield {ratio}</div>
                                    <div style={{display: 'flex'}}>
                                        <TextField type='text' name='yield' style={{width: 70, marginRight: 5}}
                                                   size='small'
                                                   onChange={handleFormChange} value={form.yield || ''}
                                                   color='info'/>
                                        <SelectBox changeHandler={handleFormChange}
                                                   form={form}
                                                   name='doseUnit'
                                                   optionsList={['g', 'oz']}
                                                   multiple={false} defaultValue={''}
                                                   size='small' width={65}/>

                                    </div>
                                </div>
                            </div>

                            <div style={{display: 'flex', marginBottom: 10}}>
                                <div style={{marginRight: 20, marginTop: 0}}>
                                    <div style={{fontSize: '1.0rem', marginBottom: 2}}>Temperature</div>
                                    <div style={{display: 'flex'}}>
                                        <TextField type='text' name='temperature' style={{width: 70, marginRight: 5}}
                                                   size='small'
                                                   onChange={handleFormChange} value={form.temperature || ''}
                                                   color='info'/>
                                        <SelectBox changeHandler={handleFormChange}
                                                   form={form}
                                                   name='temperatureUnit'
                                                   optionsList={['°C', '°F']}
                                                   multiple={false} defaultValue={form.temperatureUnit || ''}
                                                   size='small' width={65}/>
                                    </div>
                                </div>

                                <div style={{marginRight: 20, marginTop: 0}}>
                                    <div style={{fontSize: '1.0rem', marginBottom: 2}}>Grind</div>
                                    <div style={{display: 'flex'}}>
                                        <TextField type='text' name='grinderSetting' style={{width: 80}}
                                                   size='small'
                                                   onChange={handleFormChange} value={form.grinderSetting || ''}
                                                   color='info'/>
                                    </div>
                                </div>
                            </div>

                            <div style={{marginRight: 20, marginBottom: 10}}>
                                <div style={{fontSize: '1.0rem', marginBottom: 2}}>Time</div>
                                <TimePicker value={form.brewTime} handleChangeTime={handleChangeTime} />
                            </div>
                        </div>

                        <div style={{marginRight: 20, marginBottom: 10}}>
                            <div style={{display: 'flex'}}>
                                <div style={{flexGrow: 1, marginRight: 10}}>
                                    <div style={{fontSize: '1.0rem', marginBottom: 2}}>Recipe / Prep</div>
                                    <TextField type='text' name='recipePrep' fullWidth style={{minWidth: 300}}
                                               size='small'
                                               onChange={handleFormChange} value={form.recipePrep || ''}
                                               color='info'/>
                                </div>
                            </div>
                        </div>

                        <div style={{marginRight: 10, marginBottom: 10}}>
                            <div style={{fontSize: '1.0rem', marginBottom: 2}}>Brew Notes</div>
                            <TextField type='text' name='tastingNotes' fullWidth style={{minWidth: 300}}
                                       size='small'
                                       onChange={handleFormChange} value={form.tastingNotes || ''}
                                       color='info'/>
                        </div>

                        <div style={{display: flexStyle, alignItems: 'center'}}>
                            <div style={{marginRight: 10}}>
                                <div style={{fontSize: '1.0rem', marginBottom: 4}}>Roast Date</div>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        value={form.roastDate || null}
                                        label=' '
                                        onChange={(newValue) => handleFormChange({
                                            target: {
                                                name: 'roastDate',
                                                value: newValue
                                            }
                                        })}
                                        sx={{
                                            width: 150,
                                            '.MuiPickersSectionList-root': {
                                                padding: '8px 0px'
                                            }
                                        }}
                                        disableFuture
                                    />
                                </LocalizationProvider>
                            </div>
                            <div style={{marginRight: 10}}>
                                <div style={{fontSize: '1.1rem', fontWeight: 500, marginBottom: 2}}>
                                    Grinder
                                </div>
                                <SelectBox changeHandler={handleFormChange}
                                           form={form}
                                           name='grinderName'
                                           optionsList={[...grinderNames, '[ add grinder ]']}
                                           multiple={false} defaultValue={thisGrinder?.fullName || ''}
                                           size='small' width={300}/>
                            </div>
                            <div style={{marginRight: 10}}>
                                <div style={{fontSize: '1.1rem', fontWeight: 500, marginBottom: 2}}>
                                    Machine/Brewer
                                </div>
                                <SelectBox changeHandler={handleFormChange}
                                           form={form}
                                           name='machineName'
                                           optionsList={[...machineNames, '[ add machine ]']}
                                           multiple={false} defaultValue={thisMachine?.fullName || ''}
                                           size='small' width={300}/>
                            </div>
                        </div>

                        <div style={{
                            marginTop: 30,
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                            <Button onClick={handleReload} variant='outlined' color='info'
                                    style={{marginRight: 16}}
                                    disabled={uploading}>
                                CANCEL
                            </Button>
                            <Button type='submit' variant='contained' color='info'
                                    disabled={!saveEnabled} style={{boxShadow: 'none'}}>
                                SAVE
                            </Button>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    )
}

function genHexString(len) {
    const hex = '0123456789ABCDEF'
    let output = ''
    for (let i = 0; i < len; ++i) {
        output += hex.charAt(Math.floor(Math.random() * hex.length))
    }
    return output.toLowerCase()
}