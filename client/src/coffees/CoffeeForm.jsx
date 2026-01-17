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
import RatingTable from '../misc/RatingTable.jsx'
import cleanObject from '../util/cleanObject'
import AuthContext from '../app/AuthContext.jsx'
import DataContext from '../context/DataContext.jsx'
import FormToggleButtonGroup from '../formUtils/FormToggleButtonGroup.jsx'

export default function CoffeeForm({coffee, open, setOpen}) {
    const theme = useTheme()
    const {flexStyle, isMobile} = useWindowSize()
    const {updateCollection} = useContext(DBContext)
    const {isLoggedIn} = useContext(AuthContext)
    const {roastersList, brewsList, modeWeightUnit, modePriceUnit} = useContext(DataContext)

    const baseForm = useMemo(() => {
        return {
            ...coffee,
            roasterName: coffee?.roaster?.name,
            newRoasterName: coffee?.altRoaster ? coffee.roaster?.name : undefined
        }
    }, [coffee])

    const [form, setForm] = useState(coffee ? baseForm : {id: `c_${genHexString(8)}`})
    const [formChanged, setFormChanged] = useState(false)
    const [uploading, setUploading] = useState(false)
    const saveEnabled = useMemo(() => {
        return isLoggedIn && formChanged && form.name && (form.roasterName || form.newRoasterName) && !uploading
    },[form.name, form.newRoasterName, form.roasterName, formChanged, isLoggedIn, uploading])

    const [inputValue, setInputValue] = useState(coffee?.roaster?.name || '')
    useEffect(() => {
        if (open) {
            setForm(coffee ? baseForm : {id: `c_${genHexString(8)}`})
            setInputValue(coffee?.roaster?.name || '')
        }
    }, [open, coffee, baseForm])

    const [roasterReset, setRoasterReset] = useState(false)
    const [inputValueOverride, setInputValueOverride] = useState(false)
    const latestBrew = brewsList?.length > 0 ? brewsList[0] : {}
    const doseUnitDefault = latestBrew.doseUnit || 'g'

    const roasterNames = useMemo(() => {
        return roastersList.map((roaster) => roaster.name)
    }, [roastersList])

    const thisRoaster = useMemo(() => {
        return roastersList.find(e => e.name === form.roasterName)
            || coffee?.roaster
            || {name: form.roasterName}
    }, [coffee?.roaster, form.roasterName, roastersList])

    const roasterCities = useMemo(() => {
        return roastersList.reduce((acc, roaster) => {
            const citySep = roaster.city && roaster.stateRegion ? ', ' : ''
            acc[roaster.name] = `${roaster.city ? roaster.city : ''}${citySep}${roaster.stateRegion ? roaster.stateRegion : ''}${roaster.country ? ', ' + roaster.country : ''}`
            return acc
        }, {})
    }, [roastersList])

    const handleFormChange = useCallback((event) => {
        let {name, value} = event.target

        const checkboxes = ['decaf']
        if (checkboxes.includes(event.target.name)) {
            value = !form[name]
        }
        setForm({...form, [name]: value})
        setFormChanged(true)
    }, [form])

    const handleAltRoasterToggle = useCallback(() => {
        setRoasterReset(!roasterReset)
        setInputValueOverride(!inputValueOverride)
        const formCopy = {...form}
        formCopy.altRoaster = !formCopy.altRoaster
        if (formCopy.altRoaster) {
            formCopy.newRoasterName = inputValue?.target?.value
            delete formCopy['roaster']
        } else {
            delete formCopy.newRoasterName
        }
        setTimeout(() => {
            setForm(formCopy)
        }, 10)
        setTimeout(() => {
            if (formCopy.altRoaster) {
                document.getElementById('newRoasterName').focus()
                document.getElementById('newRoasterName').select()
            }
        }, 100)
    }, [roasterReset, inputValueOverride, form, inputValue])

    const [ratings, setRatings] = useState(coffee?.ratings || {})
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

    const handleReload = useCallback(() => {
        setRoasterReset(!roasterReset)
        setInputValueOverride(!inputValueOverride)
        setForm({id: `c_${genHexString(8)}`})
        setUploading(false)
        document.activeElement.blur()
        setOpen(false)
    }, [inputValueOverride, roasterReset, setOpen])

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault()
        setUploading(true)

        // todo: save default units here or DBContext

        const roasterName = thisRoaster?.name || coffee?.roaster?.name || form.newRoasterName || 'Unknown Roaster'
        const fullName = roasterName !== 'Unknown Roaster'
            ? `${form.name} (${roasterName})`
            : form.name || ''

        const roaster = !form.altRoaster
            ? cleanObject({
                id: thisRoaster.id,
                name: thisRoaster.name,
                fullName: thisRoaster.name
            })
            : cleanObject({
                id: `r_${genHexString(8)}`,
                name: form.newRoasterName,
                fullName: form.newRoasterName,
                city: form.city,
                stateRegion: form.stateRegion,
                country: form.country,
                link: form.roasterLink
            })

        const formCopy = {
            ...form,
            fullName,
            roaster,
            ratings
        }

        delete formCopy.originalEntry
        delete formCopy.roasterName
        delete formCopy.newRoasterName
        const cleanForm = Object.fromEntries(
            Object.entries(formCopy).filter(([_key, value]) => {
                return value !== null && typeof value !== 'undefined'
            })
        )
        const flags = coffee ? {update: true} : {}
        const message = coffee
            ? 'Changes saved!'
            : 'New coffee saved!'

        try {
            await updateCollection({collection: 'coffees', item: cleanForm, flags})
            enqueueSnackbar(message, {variant: 'success'})
        } catch (error) {
            enqueueSnackbar(`Error saving coffee: ${error}`, {variant: 'error', autoHideDuration: 3000})
        } finally {
            setUploading(false)
            handleReload()
            setTimeout(() => {
                window.scrollTo({
                    left: 0,
                    top: 0,
                    behavior: 'smooth'
                })
            }, 100)
            setOpen(false)
        }
    }, [form, coffee, ratings, updateCollection, handleReload, setOpen, thisRoaster])

    const roasterBoxOpacity = form.altRoaster > 0 ? 0.5 : 1
    const paddingLeft = !isMobile ? 15 : 15
    const cityMarginTop = (form.roaster && !isMobile) ? 0 : 0
    const linkSx = {
        color: '#fff', textDecoration: 'none', cursor: 'pointer', '&:hover': {
            textDecoration: 'underline'
        }
    }
    const requiredStyle = {fontSize: '1.0rem', lineHeight: '1.3rem', fontWeight: 400}

    return (
        <div>

            <div style={{marginRight: 5, display: flexStyle, marginBottom: 20}} id={'drawer'}>

                <form action={null} encType='multipart/form-data' method='post'
                      onSubmit={handleSubmit}>
                    <div style={{paddingLeft: paddingLeft, color: theme.palette.text.primary}}>
                        <div style={{marginTop: 15, marginRight: 10}}>
                            <div style={{marginRight: 0, marginTop: 0}}>
                                <div style={{fontSize: '1.1rem', lineHeight: '1.3rem', fontWeight: 500, marginBottom: 3}}>
                                    Coffee Name <span style={requiredStyle}>(Required)</span>
                                </div>
                                <TextField type='text' name='name' fullWidth style={{minWidth: 300}}
                                           size='small'
                                           onChange={handleFormChange} value={form.name || ''}
                                           color='info'/>
                            </div>
                        </div>


                        <div style={{display: 'block'}}>
                            <div style={{display: flexStyle, marginRight: 10, marginBottom: 0}}>
                                <div style={{marginTop: 10, minWidth: 350}}>
                                    <Collapse in={!form.altRoaster}>
                                        <div style={{marginRight: 10}}>
                                            <div style={{fontSize: '1.1rem', lineHeight: '1.3rem', fontWeight: 500, marginBottom: 3}}>
                                                Choose Roaster
                                            </div>
                                            <AutoCompleteBox changeHandler={handleFormChange}
                                                             options={roasterNames || []}
                                                             name={'roasterName'}
                                                             inputValue={inputValue}
                                                             setInputValue={setInputValue}
                                                             style={{
                                                                 opacity: roasterBoxOpacity,
                                                                 minWidth: isMobile ? 150 : 225
                                                             }}
                                                             reset={roasterReset}
                                                             disabled={form.altRoaster}
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
                                            <TextField type='text' id='newRoasterName' name='newRoasterName'
                                                       value={form.newRoasterName || ''}
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
                                <TextField type='text' name='origin' style={{width: 175}} size='small'
                                           onChange={handleFormChange} value={form.origin || ''}
                                           color='info'/>
                            </div>

                            <div style={{marginRight: 15, marginTop: 0}}>
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
                                              size='small' style={{marginBottom:3}}/>
                                    <Link style={{color: theme.palette.text.primary, marginBottom:1}} onClick={() => handleFormChange({
                                        target: {
                                            name: 'decaf',
                                            value: !form.decaf
                                        }
                                    })}>Decaf</Link>
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

                        <div style={{display: flexStyle, marginBottom: 10}}>
                            <div style={{marginRight: 20, marginTop: 0}}>
                                <div style={{fontSize: '1.0rem', marginBottom: 2}}>Weight</div>
                                <div style={{display: 'flex'}}>
                                    <TextField type='number' name='weight' style={{width: 100, marginRight: 5}}
                                               size='small'
                                               onChange={handleFormChange} value={form.weight || ''}
                                               color='info'/>
                                    <FormToggleButtonGroup fieldName={'weightUnit'} options={['g', 'oz']}
                                                           defaultValue={modeWeightUnit} form={form}
                                                           handleFormChange={handleFormChange}/>
                                </div>
                            </div>

                            <div style={{marginRight: 10, marginTop: 0}}>
                                <div style={{fontSize: '1.0rem', marginBottom: 2}}>Price</div>
                                <div style={{display: 'flex'}}>
                                    <TextField type='number' name='price' style={{width: 85, marginRight: 5}}
                                               size='small'
                                               onChange={handleFormChange} value={form.price || ''}
                                               color='info'/>
                                    <SelectBox changeHandler={handleFormChange}
                                               form={form}
                                               name='priceUnit'
                                               optionsList={currencies}
                                               defaultValue={modePriceUnit}
                                               multiple={false}
                                               size='small' width={125}/>
                                </div>
                            </div>
                        </div>

                        <div style={{marginRight: 15, marginBottom: 10, flexGrow: 1}}>
                            <div style={{fontSize: '1.0rem', marginBottom: 2}}>Product Link</div>
                            <TextField type='text' name='productLink' fullWidth size='small'
                                       onChange={handleFormChange} value={form.productLink || ''}
                                       color='info'/>
                        </div>

                        <div style={{
                            margin: '30px 0px 60px',
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