import React, {useCallback, useContext, useMemo, useState} from 'react'
import GetEquipment from '../data/GetEquipment.jsx'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import {Button, Checkbox, Collapse, Drawer, Link, TextField} from '@mui/material'
import AutoCompleteBox from '../formUtils/AutoCompleteBox.jsx'
import useWindowSize from '../util/useWindowSize.jsx'
import SelectBox from '../formUtils/SelectBox.jsx'
import DBContext from '../app/DBContext.jsx'
import {enqueueSnackbar} from 'notistack'
import {useTheme} from '@mui/material/styles'

export default function MachineDialog({machine, open, setOpen}) {
    const {flexStyle, isMobile} = useWindowSize()
    const {addEquipment} = useContext(DBContext)
    const {equipment = {}} = GetEquipment()
    const [form, setForm] = useState({...machine || {id: genHexString(8)}})
    const [brandReset, setBrandReset] = useState(false)
    const [modelReset, setModelReset] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [inputModelValue, setInputModelValue] = useState('')
    const [uploading, setUploading] = useState(false)

    const machineBrands = useMemo(() => {
        return machineTypes.reduce((acc, type) => {
            acc[type] = equipment?.[type] ? Object.keys(equipment[type]).sort() : []
                return acc
        },{})
    }, [equipment])

    console.log('machineBrands', machineBrands)


    const brandModels = useMemo(() => {
        return machineTypes.reduce((acc, type) => {
            acc[type] = acc[type] || {}
            const brands = machineBrands[type]
            brands.reduce((acc2, brand) => {
                acc[type][brand] = acc[type][brand] || []
                const models = Object.keys(equipment[type][brand]) || []
                acc[type][brand] = models.sort()
                return acc2
            },[])
            return acc
        },{})

    },[machineBrands, equipment])

    console.log('brandModels', brandModels)


    const theme = useTheme()

    const handleFormChange = useCallback((event) => {
        const {name, value} = event.target
        setForm({...form, [name]: value})
    }, [form])

    const handleAltBrandToggle = useCallback(() => {
        setBrandReset(!brandReset)
        const formCopy = {...form}
        formCopy.altBrand = !formCopy.altBrand
        if (formCopy.altBrand) {
            formCopy.newBrand = inputValue
            delete formCopy['brand']
        } else {
            delete formCopy.newBrand
        }
        setTimeout(() => {
            setForm(formCopy)
        }, 10)
        setTimeout(() => {
            if (formCopy.altBrand) {
                document.getElementById('newBrand').focus()
                document.getElementById('newBrand').select()
            }
        }, 100)
    }, [brandReset, form, inputValue])

    const handleAltModelToggle = useCallback(() => {
        setModelReset(!modelReset)
        const formCopy = {...form}
        formCopy.altModel = !formCopy.altModel
        if (formCopy.altModel) {
            formCopy.newModel = inputModelValue
            delete formCopy['model']
        } else {
            delete formCopy.newModel
        }
        setTimeout(() => {
            setForm(formCopy)
        }, 10)
        setTimeout(() => {
            if (formCopy.altBrand) {
                document.getElementById('newModel').focus()
                document.getElementById('newModel').select()
            }
        }, 100)
    }, [form, inputModelValue, modelReset])

    const handleSubmit = async (event) => {
        event.preventDefault()
        setUploading(true)
        const formCopy = {
            ...form,
            brand: form.brand || form.newBrand,
            model: form.model || form.newModel
        }
        delete formCopy.newBrand
        delete formCopy.newModel

        try {
            await addEquipment(formCopy)
            enqueueSnackbar('New equipment saved!', {variant: 'success'})
        } catch (error) {
            enqueueSnackbar(`Error saving equipment: ${error}`, {variant: 'error', autoHideDuration: 3000})
        } finally {
            setUploading(false)
            setForm(formCopy)
        }
    }

    const handleReload = useCallback(() => {
        setBrandReset(!brandReset)
        setModelReset(!modelReset)
        setForm({id: genHexString(8)})
        setUploading(false)
        setTimeout(() => {
            window.scrollTo({
                left: 0,
                top: 0,
                behavior: 'smooth'
            })
        }, 100)
    }, [brandReset, modelReset])

    const handleOverlayClose = useCallback(() => {
        setOpen(false)
    }, [setOpen])

    const detailsStyle = form.type ? {opacity: 1} : {opacity: 0.3, pointerEvents: 'none'}
    const brandBoxOpacity = form.altBrand > 0 ? 0.5 : 1
    const modelBoxOpacity = form.altModel > 0 ? 0.5 : 1
    const paddingLeft = !isMobile ? 16 : 8

    if (!open) return null

    return (
        <React.Fragment>
            <Drawer
                sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={open}
                onClose={() => setOpen(false)}
            >
                {open &&
                    <>
                        <div style={{display: 'flex', padding: 10, backgroundColor: theme.palette.background.default}}>
                            <div onClick={handleOverlayClose}
                                 style={{flexGrow: 1, fontSize: '1.3rem', fontWeight: 500, color: theme.palette.text.primary}}>
                                {`${machine ? 'Edit ' : 'Add '}Machine`}
                            </div>
                            <div onClick={handleOverlayClose}>
                                <HighlightOffIcon sx={{cursor: 'pointer', color: theme.palette.text.primary}}/>
                            </div>
                        </div>

                        <div style={{marginRight: 10, display: flexStyle, marginBottom: 20}} id={'drawer'}>

                            <form action={null} encType='multipart/form-data' method='post'
                                  onSubmit={handleSubmit}>
                                <div style={{paddingLeft: paddingLeft, color: theme.palette.text.primary}}>

                                    <div
                                        style={{marginTop: 10, marginBottom: 20}}>
                                        <div style={{fontSize: '1.1rem', fontWeight: 500}} id='machineTypeDiv'>
                                            Machine Type
                                        </div>
                                        <SelectBox changeHandler={handleFormChange}
                                                   form={form}
                                                   name='type'
                                                   optionsList={machineTypes}
                                                   multiple={false} defaultValue={''}
                                                   size='small' width={150}/>
                                    </div>

                                    <div style={detailsStyle}>
                                        <div style={{display: flexStyle, marginRight: 20, marginBottom: 10}}>
                                            <div style={{marginTop: 10}}>
                                                <Collapse in={!form.altBrand}>
                                                    <div style={{marginRight: 10}}>
                                                        <div style={{
                                                            fontSize: '1.0rem',
                                                            fontWeight: 500,
                                                            marginBottom: 2
                                                        }}>
                                                            Choose Brand
                                                        </div>
                                                        <AutoCompleteBox changeHandler={handleFormChange}
                                                                         options={machineBrands[form.type] || []}
                                                                         name={'brand'}
                                                                         style={{opacity: brandBoxOpacity}}
                                                                         reset={brandReset} disabled={form.altBrand}
                                                                         inputValue={form.brand}
                                                                         inputValueHandler={setInputValue}
                                                                         noOptionsMessage={'Add a brand'}
                                                                         noOptionsHandler={handleAltBrandToggle}/>
                                                    </div>
                                                </Collapse>
                                                <Collapse in={form.altBrand}>
                                                    <div style={{marginRight: 10}}>
                                                        <div style={{
                                                            fontSize: '1.0rem',
                                                            fontWeight: 500,
                                                            marginBottom: 2,
                                                            color: theme.palette.info.main
                                                        }}>
                                                            Enter New Brand
                                                        </div>
                                                        <TextField type='text' id='newBrand' name='newBrand'
                                                                   value={form.newBrand || ''}
                                                                   style={{marginBottom: 0}}
                                                                   onChange={handleFormChange}
                                                                   color='info' size='small'/>
                                                    </div>
                                                </Collapse>
                                                <div style={{marginTop: 4}}>
                                                    <Checkbox onChange={handleAltBrandToggle} id='altBrand'
                                                              name='altBrand'
                                                              checked={form.altBrand || false} color='info'
                                                              size='small'/>
                                                    <Link onClick={handleAltBrandToggle} style={{color: theme.palette.info.main}}>
                                                        Add a new brand
                                                    </Link>
                                                </div>
                                            </div>

                                            <div style={{marginRight: 20, marginTop: 10}}>
                                                <Collapse in={!form.altModel}>
                                                    <div style={{marginRight: 10}}>
                                                        <div style={{
                                                            fontSize: '1.0rem',
                                                            fontWeight: 500,
                                                            marginBottom: 2
                                                        }}>
                                                        Choose Model
                                                    </div>
                                                    <AutoCompleteBox changeHandler={handleFormChange}
                                                                     options={brandModels[form.type]?.[form.brand] || []}
                                                                     name={'model'}
                                                                     style={{opacity: modelBoxOpacity}}
                                                                     reset={modelReset} disabled={form.altModel}
                                                                     inputValue={form.model}
                                                                     inputValueHandler={setInputModelValue}
                                                                     noOptionsMessage={'Add a model'}
                                                                     noOptionsHandler={handleAltModelToggle}/>
                                                    </div>
                                                </Collapse>
                                                <Collapse in={form.altModel}>
                                                    <div style={{
                                                        fontSize: '1.0rem',
                                                        fontWeight: 500,
                                                        marginBottom: 2,
                                                        color: theme.palette.info.main
                                                    }}>
                                                        Enter New Model
                                                    </div>
                                                    <TextField type='text' id='newModel' name='newModel'
                                                               value={form.newModel || ''}
                                                               style={{marginBottom: 0}}
                                                               onChange={handleFormChange}
                                                               color='info' size='small'/>
                                                </Collapse>
                                                <div style={{marginTop: 4}}>
                                                    <Checkbox onChange={handleAltModelToggle} id='altModel'
                                                              name='altModel'
                                                              checked={form.altModel || false} color='info'
                                                              size='small'/>
                                                    <Link onClick={handleAltModelToggle} style={{color: theme.palette.info.main}}>
                                                        Add a new model
                                                    </Link>
                                                </div>
                                            </div>

                                            <div style={{marginRight: 20, marginTop: 10}}>
                                                <div style={{fontSize: '1.0rem', marginBottom: 5}}>
                                                    Model Year
                                                </div>
                                                <TextField type='text' name='year' style={{width: 100}} size='small'
                                                           onChange={handleFormChange} value={form.year || ''}
                                                           color='info'/>
                                            </div>


                                        </div>

                                        <div style={{marginRight: 20, marginTop: 10}}>
                                            <div style={{fontSize: '1.1rem'}}>
                                                Notes <span style={{color: theme.palette.text.secondary}}>(optional)</span>
                                            </div>
                                            <TextField type='text' name='notes' multiline fullWidth rows={4}
                                                       color='info'
                                                       style={{}} value={form.notes || ''}
                                                       maxLength={1200} id='notes' onChange={handleFormChange}/>
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

                                </div>
                            </form>
                        </div>
                    </>
                }
            </Drawer>

        </React.Fragment>
    )
}

const machineTypes = ['Grinder', 'Espresso', 'Pourover', 'Stovetop', 'Drip', 'Other']

function genHexString(len) {
    const hex = '0123456789ABCDEF'
    let output = ''
    for (let i = 0; i < len; ++i) {
        output += hex.charAt(Math.floor(Math.random() * hex.length))
    }
    return output.toLowerCase()
}