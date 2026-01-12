import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Collapse from '@mui/material/Collapse'
import Link from '@mui/material/Link'
import TextField from '@mui/material/TextField'
import AutoCompleteBox from '../formUtils/AutoCompleteBox.jsx'
import useWindowSize from '../util/useWindowSize.jsx'
import SelectBox from '../formUtils/SelectBox.jsx'
import DBContext from '../app/DBContext.jsx'
import {enqueueSnackbar} from 'notistack'
import {useTheme} from '@mui/material/styles'
import equipment from '../data/equipment.json'
import {setDeepUnique} from '../util/setDeep'
import AuthContext from '../app/AuthContext.jsx'

export default function EquipmentForm({machine, open, setOpen, type = 'Equipment'}) {
    const theme = useTheme()
    const {flexStyle, isMobile} = useWindowSize()
    const {updateCollection} = useContext(DBContext)
    const {isLoggedIn} = useContext(AuthContext)

    const [form, setForm] = useState({})
    const [formChanged, setFormChanged] = useState(false)
    const [uploading, setUploading] = useState(false)
    const saveEnabled = useMemo(() => {
        return isLoggedIn && formChanged && form.type && form.brand && form.model && !uploading
    },[form.brand, form.model, form.type, formChanged, isLoggedIn, uploading])

    useEffect(() => {
        if (open) {
            setForm({...machine || {id: `e_${genHexString(8)}`}})
            setInputValue(machine?.brand || '')
            setInputModelValue(machine?.model || '')
        }
    }, [open, machine])

    const [brandReset, setBrandReset] = useState(false)
    const [modelReset, setModelReset] = useState(false)
    const [inputValue, setInputValue] = useState(machine?.brand || '')
    const [inputModelValue, setInputModelValue] = useState(machine?.model || '')

    const machineTypeBrandModels = useMemo(() => {
        return equipment.reduce((acc, machine) => {
            setDeepUnique(acc, [machine.type, machine.brand], machine.model)
            return acc
        }, {})
    }, [])

    const machineTypes = Object.keys(machineTypeBrandModels)

    const typeBrands = useMemo(()=> {
        return Object.keys(machineTypeBrandModels[form.type] || {}) || []
    },[form.type, machineTypeBrandModels])

    const brandModels = useMemo(()=> {
        return machineTypeBrandModels[form.type]?.[form.brand] || []
    },[form.brand, form.type, machineTypeBrandModels])

    const handleFormChange = useCallback((event) => {
        const {name, value} = event.target
        setForm({...form, [name]: value})
        setFormChanged(true)
    }, [form])

    const handleAltBrandToggle = useCallback(() => {
        setBrandReset(!brandReset)
        const formCopy = {...form}
        formCopy.altBrand = !formCopy.altBrand
        if (formCopy.altBrand) {
            formCopy.newBrand = inputValue?.target?.value
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
            formCopy.newModel = inputModelValue?.target?.value
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

    const handleReload = useCallback(() => {
        setBrandReset(!brandReset)
        setModelReset(!modelReset)
        setForm({id: genHexString(8)})
        setUploading(false)
        setOpen(false)
    }, [brandReset, modelReset, setOpen])


    const handleSubmit = useCallback(async (event) => {
        event.preventDefault()
        setUploading(true)
        const brand = form.brand || form.newBrand
        const model = form.model || form.newModel
        const fullName = (brand && model)
            ? `${brand} ${model}`
            : `${brand || ''}${model || ''}`

        const formCopy = {
            ...form,
            brand,
            model,
            fullName
        }
        delete formCopy.newBrand
        delete formCopy.newModel
        const cleanForm = Object.fromEntries(
            Object.entries(formCopy).filter(([_key, value]) => {
                return value !== null && typeof value !== 'undefined'
            })
        )
        const flags = machine ? {update: true} : {}
        const message = machine
                ? 'Changes saved!'
                : 'New item saved!'

        try {
            await updateCollection({collection: 'equipment', item: cleanForm, flags})
            enqueueSnackbar(message, {variant: 'success'})
            setOpen(false)
        } catch (error) {
            enqueueSnackbar(`Error saving item: ${error}`, {variant: 'error', autoHideDuration: 3000})
        } finally {
            setUploading(false)
            setTimeout(() => {
                window.scrollTo({
                    left: 0,
                    top: 0,
                    behavior: 'smooth'
                })
            }, 100)
        }
    }, [form, machine, setOpen, updateCollection])

    const detailsStyle = form.type ? {opacity: 1} : {opacity: 0.3, pointerEvents: 'none'}
    const brandBoxOpacity = form.altBrand > 0 ? 0.5 : 1
    const modelBoxOpacity = form.altModel > 0 ? 0.5 : 1
    const paddingLeft = !isMobile ? 15 : 15

    return (
        <div>

            <div style={{marginRight: 5, display: flexStyle, marginBottom: 20}} id={'drawer'}>

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
                                                             options={typeBrands || []}
                                                             name={'brand'}
                                                             style={{
                                                                 opacity: brandBoxOpacity,
                                                                 minWidth: isMobile ? 150 : 200
                                                             }}
                                                             reset={brandReset} disabled={form.altBrand}
                                                             setInputValue={setInputValue}
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
                                                       style={{marginBottom: 0, width: '100%'}}
                                                       onChange={handleFormChange}
                                                       color='info' size='small'/>
                                        </div>
                                    </Collapse>
                                    <div style={{marginTop: 4}}>
                                        <Checkbox onChange={handleAltBrandToggle} id='altBrand'
                                                  name='altBrand'
                                                  checked={form.altBrand || false} color='info'
                                                  size='small'/>
                                        <Link onClick={handleAltBrandToggle}
                                              style={{color: theme.palette.info.main}}>
                                            Add a new brand
                                        </Link>
                                    </div>
                                </div>

                                <div style={{marginRight: 15, marginTop: 10}}>
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
                                                             options={brandModels || []}
                                                             name={'model'}
                                                             style={{
                                                                 opacity: modelBoxOpacity,
                                                                 minWidth: isMobile ? 150 : 200
                                                             }}
                                                             reset={modelReset} disabled={form.altModel}
                                                             inputValue={form.model}
                                                             setInputValue={setInputValue}
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
                                                   style={{marginBottom: 0, width: '100%'}}
                                                   onChange={handleFormChange}
                                                   color='info' size='small'/>
                                    </Collapse>
                                    <div style={{marginTop: 4}}>
                                        <Checkbox onChange={handleAltModelToggle} id='altModel'
                                                  name='altModel'
                                                  checked={form.altModel || false} color='info'
                                                  size='small'/>
                                        <Link onClick={handleAltModelToggle}
                                              style={{color: theme.palette.info.main}}>
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

                            <div style={{marginRight: 15, marginTop: 10}}>
                                <div style={{fontSize: '1.1rem'}}>
                                    Notes <span
                                    style={{color: theme.palette.text.secondary}}>(optional)</span>
                                </div>
                                <TextField type='text' name='notes' multiline fullWidth rows={4}
                                           color='info'
                                           style={{}} value={form.notes || ''}
                                           maxLength={1200} id='notes' onChange={handleFormChange}/>
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