import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import useWindowSize from '../util/useWindowSize.jsx'
import SelectBox from '../formUtils/SelectBox.jsx'
import DBContext from '../app/DBContext.jsx'
import {enqueueSnackbar} from 'notistack'
import {useTheme} from '@mui/material/styles'
import DataContext from '../context/DataContext.jsx'
import RatingTable from '../misc/RatingTable.jsx'

export default function BrewForm({entry, open, setOpen, action}) {
    const {grinderList, machineList, beansList} = useContext(DataContext)
    const {flexStyle, isMobile} = useWindowSize()
    const {updateCollection} = useContext(DBContext)
    const [form, setForm] = useState(
        action === 'clone' ? {...entry, id: `br_${genHexString(8)}`} : {...entry || {id: `br_${genHexString(8)}`}}
    )
    useEffect(() => {
        if (open) {
            setForm(
                action === 'clone' ? {
                    ...entry,
                    id: `br_${genHexString(8)}`
                } : {...entry || {id: `br_${genHexString(8)}`}}
            )
        }
    }, [open, entry, action])

    const [uploading, setUploading] = useState(false)
    const theme = useTheme()

    const grinderNames = useMemo(() => {
        return Object.keys(grinderList).sort()
    }, [grinderList])

    const machineNames = useMemo(() => {
        return Object.keys(machineList).sort()
    }, [machineList])

    const beanNames = useMemo(() => {
        return Object.keys(beansList).sort()
    }, [beansList])

    const thisBean = useMemo(() => {
        return beansList[form.beanName] || {}
    }, [beansList, form.beanName])

    const thisGrinder = useMemo(() => {
        return grinderList[form.grinderName] || {}
    }, [grinderList, form.grinderName])

    const thisMachine = useMemo(() => {
        return machineList[form.machineName] || {}
    }, [machineList, form.machineName])

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
    const ratingDimensions = {
        rating: 'Overall Rating',
        flavor: 'Flavor',
        body: 'Body',
        acidity: 'Acidity',
        finish: 'Finish'
    }

    const handleRatingChange = useCallback(({dimension, rating}) => {
        setRatings({...ratings, [dimension]: rating})
        setRatingsChanged(true)
    }, [ratings])

    const handleFormChange = useCallback((event) => {
        const {name, value} = event.target
        setForm({...form, [name]: value})
    }, [form])

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault()
        console.log('form', form)
        setUploading(true)
        const formCopy = {
            ...form,
            bean: thisBean,
            beanId: thisBean.id,
            grinder: thisGrinder,
            grinderId: thisGrinder.id,
            machine: thisMachine,
            machineId: thisMachine.id,
            ratings: ratingsChanged ? ratings : entry?.ratings
        }
        const cleanForm = Object.fromEntries(
            Object.entries(formCopy).filter(([_key, value]) => {
                return value !== null && typeof value !== 'undefined'
            })
        )
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
    }, [form, thisBean, thisGrinder, thisMachine, ratingsChanged, ratings, entry, action, updateCollection, setOpen])

    const handleReload = useCallback(() => {
        setForm({id: `b_${genHexString(8)}`})
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
                                       name='beanName'
                                       optionsList={[...beanNames, '[ add bean ]']}
                                       multiple={false} defaultValue={''}
                                       size='small' width={'100%'}/>
                        </div>

                        <div style={{display: flexStyle, alignItems: 'center'}}>
                            <div style={{marginRight: 10, marginBottom: 10}}>
                                <div style={{fontSize: '1.1rem', fontWeight: 500, marginBottom: 2}}>
                                    Grinder
                                </div>
                                <SelectBox changeHandler={handleFormChange}
                                           form={form}
                                           name='grinderName'
                                           optionsList={grinderNames}
                                           multiple={false} defaultValue={''}
                                           size='small' width={300}/>
                            </div>
                            <div style={{marginRight: 10, marginBottom: 10}}>
                                <div style={{fontSize: '1.1rem', fontWeight: 500, marginBottom: 2}}>
                                    Machine/Brewer
                                </div>
                                <SelectBox changeHandler={handleFormChange}
                                           form={form}
                                           name='machineName'
                                           optionsList={machineNames}
                                           multiple={false} defaultValue={''}
                                           size='small' width={300}/>
                            </div>
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
                                <div style={{marginRight: 10}}>
                                    <div style={{fontSize: '1.0rem', marginBottom: 2}}>Roast Date</div>
                                    <TextField type='text' name='roastDate' style={{width: 80, marginRight: 5}}
                                               size='small'
                                               onChange={handleFormChange} value={form.roastDate || ''}
                                               color='info'/>
                                </div>
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
                            <div style={{fontSize: '1.0rem', marginBottom: 2}}>
                                Overall Notes
                            </div>
                            <TextField type='text' name='notes' multiline fullWidth rows={2}
                                       color='info'
                                       sx={{
                                           '.MuiInputBase-multiline': {
                                               padding: '8px 10px'
                                           }
                                       }}
                                       value={form.notes || ''}
                                       maxLength={1200} id='notes' onChange={handleFormChange}/>
                        </div>

                        <div style={{margin: '10px 0px'}}>
                            <RatingTable ratingDimensions={ratingDimensions} onRatingChange={handleRatingChange}
                                         ratings={ratings} emptyColor={'#555'} showLabel={true} useTable={true}
                                         fontSize={'0.85rem'} size={21} paddingData={0} iconsCount={10}
                                         backgroundColor={'transparent'}/>
                        </div>

                        <div style={{marginRight: 10, marginBottom: 10}}>
                            <div style={{fontSize: '1.0rem', marginBottom: 2}}>Tasting Notes</div>
                            <TextField type='text' name='tastingNotes' fullWidth style={{minWidth: 300}}
                                       size='small'
                                       onChange={handleFormChange} value={form.tastingNotes || ''}
                                       color='info'/>
                        </div>

                        {thisBean?.tastingNotes &&
                            <div style={{display: flexStyle, marginRight: 10, marginBottom: 10, fontStyle: 'italic'}}>
                                <div style={{fontSize: '1.0rem', marginBottom: 2}}>Roaster Tasting Notes</div>
                                {!isMobile && <span style={{marginRight: 10}}>: </span>}
                                <div>{thisBean?.tastingNotes}</div>
                            </div>
                        }

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