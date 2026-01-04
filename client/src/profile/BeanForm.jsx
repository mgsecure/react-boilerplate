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
import {roastLevels, currencies} from '../data/equipmentBeans'
import roasters from '../data/roasters.json'
import EntryRating from '../espressoBeans/EntryRating.jsx'

export default function BeanForm({bean, open}) {
    const {flexStyle, isMobile} = useWindowSize()
    const {updateCollection} = useContext(DBContext)
    const [form, setForm] = useState({...bean || {id: `b_${genHexString(8)}`}})

    const [inputValue, setInputValue] = useState(form.roaster || '')
    useEffect(() => {
        if (open) {
            setForm({...bean || {id: `b_${genHexString(8)}`}})
            setInputValue(bean?.roaster || '')
        }
    }, [open, bean])

    const [roasterReset, setRoasterReset] = useState(false)
    const [inputValueOverride, setInputValueOverride] = useState(false)
    const [uploading, setUploading] = useState(false)
    const theme = useTheme()

    const roasterNames = useMemo(() => {
        return roasters.map((roaster) => roaster.name)
    }, [])

    const roasterCities = useMemo(() => {
        return roasters.reduce((acc, roaster) => {
            const citySep = roaster.city && roaster.stateRegion ? ', ' : ''
            acc[roaster.name] = `${roaster.city ? roaster.city : ''}${citySep}${roaster.stateRegion ? roaster.stateRegion : ''}${roaster.country ? ', ' + roaster.country : ''}`
            return acc
        }, {})
    }, [])

    const handleFormChange = useCallback((event) => {
        const {name, value} = event.target
        setForm({...form, [name]: value})
    }, [form])

    const handleAltRoasterToggle = useCallback(() => {
        setRoasterReset(!roasterReset)
        setInputValueOverride(!inputValueOverride)
        const formCopy = {...form}
        formCopy.altRoaster = !formCopy.altRoaster
        if (formCopy.altRoaster) {
            formCopy.newRoaster = inputValue?.target?.value
            delete formCopy['roaster']
        } else {
            delete formCopy.newRoaster
        }
        setTimeout(() => {
            setForm(formCopy)
        }, 10)
        setTimeout(() => {
            if (formCopy.altRoaster) {
                document.getElementById('newRoaster').focus()
                document.getElementById('newRoaster').select()
            }
        }, 100)
    }, [roasterReset, inputValueOverride, form, inputValue])

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault()
        console.log('form', form)
        setUploading(true)
        const formCopy = {
            ...form,
            roaster: form.roaster || form.newRoaster,
            model: form.model || form.newModel
        }
        delete formCopy.newRoaster
        delete formCopy.newModel
        const cleanForm = Object.fromEntries(
            Object.entries(formCopy).filter(([_key, value]) => {
                return value !== null && typeof value !== 'undefined'
            })
        )
        const flags = bean ? {update: true} : {}
        try {
            await updateCollection({collection: 'beans', item: cleanForm, flags})
            enqueueSnackbar('New bean saved!', {variant: 'success'})
        } catch (error) {
            enqueueSnackbar(`Error saving bean: ${error}`, {variant: 'error', autoHideDuration: 3000})
        } finally {
            setUploading(false)
            setForm(formCopy)
        }
    }, [form, bean, updateCollection])

    const handleReload = useCallback(() => {
        setRoasterReset(!roasterReset)
        setInputValueOverride(!inputValueOverride)
        setForm({id: `b_${genHexString(8)}`})
        setUploading(false)
        setTimeout(() => {
            window.scrollTo({
                left: 0,
                top: 0,
                behavior: 'smooth'
            })
        }, 100)
    }, [inputValueOverride, roasterReset])

    const roasterBoxOpacity = form.altRoaster > 0 ? 0.5 : 1
    const paddingLeft = !isMobile ? 15 : 15
    const cityMarginTop = (form.roaster && !isMobile) ? 0 : 0

    return (
        <div>

            <div style={{marginRight: 5, display: flexStyle, marginBottom: 20}} id={'drawer'}>

                <form action={null} encType='multipart/form-data' method='post'
                      onSubmit={handleSubmit}>
                    <div style={{paddingLeft: paddingLeft, color: theme.palette.text.primary}}>
                        <div style={{display: 'block'}}>
                            <div style={{display: flexStyle, marginRight: 10, marginBottom: 0}}>
                                <div style={{marginTop: 10, minWidth:350}}>
                                    <Collapse in={!form.altRoaster}>
                                        <div style={{marginRight: 10}}>
                                            <div style={{
                                                fontSize: '1.1rem',
                                                fontWeight: 600,
                                                marginBottom: 2
                                            }}>
                                                Choose Roaster
                                            </div>
                                            <AutoCompleteBox changeHandler={handleFormChange}
                                                             options={roasterNames || []}
                                                             name={'roaster'}
                                                             inputValue={inputValue}
                                                             setInputValue={setInputValue}
                                                             style={{
                                                                 opacity: roasterBoxOpacity,
                                                                 minWidth: isMobile ? 150 : 225
                                                             }}
                                                             reset={roasterReset} disabled={form.altRoaster}
                                                             inputValueOverride={inputValueOverride}
                                                             inputValueHandler={setInputValue}
                                                             noOptionsMessage={'Add a roaster'}
                                                             noOptionsHandler={handleAltRoasterToggle}/>
                                        </div>
                                    </Collapse>
                                    <Collapse in={form.altRoaster}>
                                        <div style={{marginRight: 10}}>
                                            <div style={{
                                                fontSize: '1.0rem',
                                                fontWeight: 500,
                                                marginBottom: 2,
                                                color: theme.palette.info.main
                                            }}>
                                                Enter New Roaster
                                            </div>
                                            <TextField type='text' id='newRoaster' name='newRoaster'
                                                       value={form.newRoaster || ''}
                                                       style={{marginBottom: 0, width: '100%'}}
                                                       onChange={handleFormChange}
                                                       color='info' size='small'/>
                                        </div>
                                    </Collapse>
                                    <div style={{marginTop: 4}}>
                                        <Checkbox onChange={handleAltRoasterToggle} id='altRoaster'
                                                  name='altRoaster'
                                                  checked={form.altRoaster || false} color='info'
                                                  size='small'/>
                                        <Link onClick={handleAltRoasterToggle}
                                              style={{color: theme.palette.info.main}}>
                                            Add a new roaster
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <Collapse in={form.roaster} style={{
                                marginTop: cityMarginTop,
                                marginBottom: 15,
                                marginLeft: 10,
                                fontSize: '1.1rem',
                                fontWeight: 500
                            }}>
                                {roasterCities[form.roaster]}
                            </Collapse>

                        </div>
                        <Collapse in={form.altRoaster}
                                  style={{
                                      backgroundColor: '#563028',
                                      padding: form.altRoaster ? 10 : 0,
                                      borderRadius: 5,
                                      marginRight: 10,
                                      marginBottom: form.altRoaster ? 15 : 0
                                  }}>
                            <div style={{display: flexStyle, marginLeft: 0, marginRight: 0, marginBottom: 5}}>
                                <div style={{marginRight: 10}}>
                                    <div style={{fontSize: '1.0rem', marginBottom: 2}}>
                                        Roaster City
                                    </div>
                                    <TextField type='text' name='city' style={{width: 150}} size='small'
                                               onChange={handleFormChange} value={form.city || ''}
                                               color='info'/>
                                </div>
                                <div style={{marginRight: 10}}>
                                    <div style={{fontSize: '1.0rem', marginBottom: 2}}>
                                        State/Region
                                    </div>
                                    <TextField type='text' name='stateRegion' style={{width: 150}} size='small'
                                               onChange={handleFormChange} value={form.stateRegion || ''}
                                               color='info'/>
                                </div>
                                <div style={{}}>
                                    <div style={{fontSize: '1.0rem', marginBottom: 2}}>
                                        Country
                                    </div>
                                    <TextField type='text' name='country' style={{width: 150}} size='small'
                                               onChange={handleFormChange} value={form.country || ''}
                                               color='info'/>
                                </div>
                            </div>
                            <div style={{marginLeft: 0, marginRight: 0, marginBottom: 5}}>
                                <div style={{}}>
                                    <div style={{fontSize: '1.0rem', marginBottom: 2}}>Roaster Website</div>
                                    <TextField type='text' name='roasterLink' fullWidth style={{minWidth: 350}}
                                               size='small'
                                               onChange={handleFormChange} value={form.roasterLink || ''}
                                               color='info'/>
                                </div>
                            </div>
                        </Collapse>

                        <div style={{marginRight: 10, marginBottom: 10}}>
                            <div style={{marginRight: 0, marginTop: 0}}>
                                <div style={{
                                    fontSize: '1.1rem',
                                    fontWeight: 500,
                                    marginBottom: 2
                                }}>
                                    Coffee Name
                                </div>
                                <TextField type='text' name='name' fullWidth style={{minWidth: 300}}
                                           size='small'
                                           onChange={handleFormChange} value={form.name || ''}
                                           color='info'/>
                            </div>
                        </div>

                        <div style={{marginBottom: 15}}>
                            <EntryRating entry={bean} handleFormChange={handleFormChange}/>
                        </div>

                        <div style={{marginRight: 10, marginBottom: 10}}>
                            <div style={{marginRight: 0, marginTop: 0}}>
                                <div style={{fontSize: '1.0rem', marginBottom: 2}}>Tasting Notes</div>
                                <TextField type='text' name='tastingNotes' fullWidth style={{minWidth: 300}}
                                           size='small'
                                           onChange={handleFormChange} value={form.tastingNotes || ''}
                                           color='info'/>
                            </div>
                        </div>

                        <div style={{marginRight: 10, marginBottom: 10}}>
                            <div style={{marginRight: 0, marginTop: 0}}>
                                <div style={{fontSize: '1.0rem', marginBottom: 2}}>Roaster Tasting Notes</div>
                                <TextField type='text' name='roasterTastingNotes' fullWidth size='small'
                                           onChange={handleFormChange} value={form.roasterTastingNotes || ''}
                                           color='info'/>
                            </div>
                        </div>

                        <div style={{display: flexStyle, marginBottom: 10}}>

                            <div style={{marginRight: 10, marginTop: 0}}>
                                <div style={{fontSize: '1.0rem', marginBottom: 2}}>Origin</div>
                                <TextField type='text' name='origin' style={{width: 100}} size='small'
                                           onChange={handleFormChange} value={form.origin || ''}
                                           color='info'/>
                            </div>

                            <div style={{marginRight: 10, marginTop: 0}}>
                                <div style={{fontSize: '1.0rem', marginBottom: 2}}>
                                    Roast Level
                                </div>
                                <SelectBox changeHandler={handleFormChange}
                                           form={form}
                                           name='roastLevel'
                                           optionsList={roastLevels}
                                           multiple={false} defaultValue={''}
                                           size='small' width={150}/>
                            </div>

                            <div style={{marginRight: 10, marginTop: 0}}>
                                <div style={{fontSize: '1.0rem', marginBottom: 2}}>&nbsp;</div>
                                <div style={{marginTop: 3}}>
                                    <Checkbox onChange={handleFormChange}
                                              name='decaf' id='decaf'
                                              checked={form.decaf || false} color='info'
                                              size='small'/>
                                    Decaf
                                </div>
                            </div>
                        </div>

                        <div style={{display: flexStyle, marginBottom: 10}}>

                            <div style={{marginRight: 10, marginTop: 0}}>
                                <div style={{fontSize: '1.0rem', marginBottom: 2}}>Weight</div>
                                <div style={{display: 'flex'}}>
                                    <TextField type='text' name='weight' style={{width: 100, marginRight: 5}}
                                               size='small'
                                               onChange={handleFormChange} value={form.weight || ''}
                                               color='info'/>
                                    <SelectBox changeHandler={handleFormChange}
                                               form={form}
                                               name='weightUnit'
                                               optionsList={['Gram', 'Ounce']}
                                               multiple={false} defaultValue={''}
                                               size='small' width={100}/>

                                </div>
                            </div>

                            <div style={{marginRight: 10, marginTop: 0}}>
                                <div style={{fontSize: '1.0rem', marginBottom: 2}}>Price</div>
                                <div style={{display: 'flex'}}>
                                    <TextField type='text' name='price' style={{width: 100, marginRight: 5}}
                                               size='small'
                                               onChange={handleFormChange} value={form.price || ''}
                                               color='info'/>

                                    <SelectBox changeHandler={handleFormChange}
                                               form={form}
                                               name='priceUnit'
                                               optionsList={currencies}
                                               multiple={false} defaultValue={''}
                                               size='small' width={125}/>
                                </div>
                            </div>

                        </div>

                        <div style={{display: flexStyle, marginRight: 20, marginBottom: 10}}>
                            <div style={{marginRight: 10, marginTop: 0}}>
                                <div style={{fontSize: '1.0rem', marginBottom: 2}}>Product Link</div>
                                <TextField type='text' name='productLink' style={{width: 350}} size='small'
                                           onChange={handleFormChange} value={form.productLink || ''}
                                           color='info'/>
                            </div>
                        </div>


                        <div style={{marginRight: 15, marginTop: 10}}>
                            <div style={{fontSize: '1.0rem', marginBottom: 2}}>
                                Notes
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