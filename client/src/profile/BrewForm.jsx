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

export default function BrewForm({entry, open, setOpen, action}) {
    const {grinderList, machineList, coffeesList, brewsList} = useContext(DataContext)
    const {flexStyle, isMobile} = useWindowSize()
    const {updateCollection} = useContext(DBContext)
    const [form, setForm] = useState({})
    useEffect(() => {
        if (open) {
            setForm(
                action === 'clone'
                    ? {...entry, id: `br_${genHexString(8)}`}
                    : {...entry || {id: `br_${genHexString(8)}`}}
            )
        }
    }, [open, entry, action])

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


    const [uploading, setUploading] = useState(false)
    const theme = useTheme()

    const coffeeNames = useMemo(() => {
        const systemCoffees = coffeesList.map((coffee) => coffee.fullName)
        return new Set([entry?.coffee?.fullname, ...systemCoffees].filter(Boolean).sort())
    }, [coffeesList, entry?.coffee?.fullname])

    const thisCoffee = useMemo(() => {
        return coffeesList.find(c => c.fullName === form.coffeeName)
            || entry?.coffee || {name: form.coffeeName}
    }, [coffeesList, entry?.coffee, form.coffeeName])

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
            return `(1:${r.toFixed(1).replace('.0', '')})`
        })()
        : ''

    const [ratings, setRatings] = useState(entry?.ratings || {})
    const [ratingsChanged, setRatingsChanged] = useState(false)

    const handleFormChange = useCallback((event) => {
        const {name, value} = event.target
        setForm({...form, [name]: value})
    }, [form])

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault()
        setUploading(true)
        const formCopy = {
            ...form,
            coffee: cleanObject({
                id: thisCoffee.id,
                name: thisCoffee.fullName,
                roasterName: thisCoffee.roaster?.name,
                fullName: entryName({entry: thisCoffee, entryType: 'coffee'})
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
                fullName: entryName({entry: thisGrinder})
            }),
            fullName: entryName({entry: thisCoffee, entryType: 'coffee'}),
            brewedAt: entry?.brewedAt || dayjs().format('YYYY-MM-DD HH:mm:ss'),
            ratings: ratingsChanged ? ratings : entry?.ratings
        }

        delete formCopy.roasterName
        delete formCopy.coffeeName
        delete formCopy.machineName
        delete formCopy.grinderName
        const cleanForm = cleanObject(formCopy)

        const flags = entry && action !== 'clone' ? {update: true} : {}
        const message = action === 'clone'
            ? 'Copied brew saved.'
            : entry
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

    const handleReload = useCallback(() => {
        setForm({id: `br_${genHexString(8)}`})
        setUploading(false)
        setTimeout(() => {
            window.scrollTo({
                left: 0,
                top: 0,
                behavior: 'smooth'
            })
        }, 100)
    }, [])

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
                                       multiple={false} defaultValue={thisCoffee?.fullName || ''}
                                       size='small' width='100%'/>
                        </div>

                        <div style={{display: flexStyle}}>
                            <div style={{display: 'flex', marginBottom: 10}}>
                                <div style={{marginRight: 15, marginTop: 0}}>
                                    <div style={{fontSize: '1.0rem', marginBottom: 2}}>Dose</div>
                                    <div style={{display: 'flex'}}>
                                        <TextField type='text' name='dose' style={{width: 80, marginRight: 5}}
                                                   size='small'
                                                   onChange={handleFormChange} value={form.dose || ''}
                                                   color='info'/>
                                        <SelectBox changeHandler={handleFormChange}
                                                   form={form}
                                                   name='doseUnit'
                                                   optionsList={['g', 'oz']}
                                                   multiple={false} defaultValue={''}
                                                   size='small' width={65}/>
                                    </div>
                                </div>

                                <div style={{marginRight: 15, marginTop: 0}}>
                                    <div style={{fontSize: '1.0rem', marginBottom: 2}}>Yield {ratio}</div>
                                    <div style={{display: 'flex'}}>
                                        <TextField type='text' name='yield' style={{width: 80, marginRight: 5}}
                                                   size='small'
                                                   onChange={handleFormChange} value={form.yield || ''}
                                                   color='info'/>
                                        <SelectBox changeHandler={handleFormChange}
                                                   form={form}
                                                   name='yieldUnit'
                                                   optionsList={['g', 'oz']}
                                                   multiple={false} defaultValue={form.doseUnit || ''}
                                                   size='small' width={65}/>
                                    </div>
                                </div>
                            </div>

                            <div style={{display: 'flex', marginBottom: 10}}>
                                <div style={{marginRight: 15, marginTop: 0}}>
                                    <div style={{fontSize: '1.0rem', marginBottom: 2}}>Temperature</div>
                                    <div style={{display: 'flex'}}>
                                        <TextField type='text' name='temperature' style={{width: 80, marginRight: 5}}
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

                                <div style={{marginRight: 15, marginTop: 0}}>
                                    <div style={{fontSize: '1.0rem', marginBottom: 2}}>Grind</div>
                                    <div style={{display: 'flex'}}>
                                        <TextField type='text' name='grinderSetting' style={{width: 100}}
                                                   size='small'
                                                   onChange={handleFormChange} value={form.grinderSetting || ''}
                                                   color='info'/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{marginRight: 10, marginBottom: 10}}>
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
                                <div style={{fontSize: '1.0rem', marginBottom: 2}}>Roast Date</div>
                                <TextField type='text' name='roastDate' style={{width: 80, marginRight: 5}}
                                           size='small'
                                           onChange={handleFormChange} value={form.roastDate || ''}
                                           color='info'/>
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
                                CLEAR
                            </Button>
                            <Button type='submit' variant='contained' color='info'
                                    disabled={uploading} style={{boxShadow: 'none'}}>
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