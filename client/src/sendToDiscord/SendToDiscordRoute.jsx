import React, {useCallback, useRef, useState} from 'react'
import ToggleColorMode from '../misc/ToggleColorMode.jsx'
import axios from 'axios'
import TextField from '@mui/material/TextField'
import useWindowSize from '../util/useWindowSize.jsx'
import Button from '@mui/material/Button'
import sanitizeValues from '../util/sanitizeValues.js'
import {alpha, FormControl, Select, useTheme} from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import ReactMarkdown from 'react-markdown'
import rehypeExternalLinks from 'rehype-external-links'
import remarkGfm from 'remark-gfm'
import intro from './intro.md?raw'
import Slide from '@mui/material/Slide'
import ScopedDialog from '../misc/ScopedDialog.jsx'
import IconButton from '@mui/material/IconButton'
import CancelIcon from '@mui/icons-material/Cancel'
import usePageTitle from '../util/usePageTitle.jsx'

/**
 * @prop otherPlatform
 */

export default function SendToDiscordRoute() {
    usePageTitle('Suggestion Box')

    const theme = useTheme()

    const [form, setForm] = useState({})
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleFormChange = useCallback((event) => {
        let {name, value} = event.target
        if (name === 'platform' && value === 'None') {
            delete form.otherPlatform
            delete form.platform
        } else {
            value = sanitizeValues(value, {profanityOK: true})
        }
        setForm(prev => ({...prev, [name]: value}))
    }, [])

    const handleClearField = useCallback((fieldName) => {
        const updatedForm = {...form}
        delete updatedForm[fieldName]
        setForm(updatedForm)
    }, [])

    const handleFormSubmit = useCallback(async (e) => {
        e?.preventDefault?.()
        setLoading(true)
        console.log('Form submitted:', form)
        try {
            const res = await axios.post('/api/discord', form)
            setResult(res.data)
            //setForm({})
            setError(null)
        } catch (err) {
            // try to surface zod issues or server message
            const issues = err.response?.data?.issues
            const msg = issues?.[0]?.message || err.response?.data?.error || err.message
            setError(msg)
        } finally {
            setLoading(false)
        }
        console.log('Form submitted:', form)
    }, [form])

    const handleDialogClose = useCallback(() => {
        setResult(null)
        setError(null)
        setForm({})
    }, [])

    const dialogContent = result ? (
        <div style={{padding: '40px 20px', maxWidth: 400, textAlign: 'center'}}>
            {error ? (
                <div style={{color: 'red', fontWeight: 'bold'}}>Error: {error}</div>
            ) : (
                <div style={{fontWeight: 'bold'}}>Success! Your message has been sent.</div>
            )}
            <Button onClick={() => {
                setResult(null)
                setError(null)
                setForm({})
            }} variant='contained' color='info' style={{marginTop: 20}}>
                Send Another
            </Button>
        </div>
    ) : (
        <div style={{padding: 20, maxWidth: 400}}>
            <div style={{marginBottom: 10, fontWeight: 'bold'}}>Send a message to the ModBox team via Discord</div>
            {error && <div style={{color: 'red', marginBottom: 10}}>Error: {error}</div>}
        </div>
    )

    const textFieldMax = 40
    const platformList = ['Discord', 'Reddit', 'Facebook', 'Other']
    const containerRef = useRef(null)
    const selectRef = useRef(null)

    const {isMobile, flexStyle} = useWindowSize()
    const optionalHeaderStyle = {fontSize: '1.0rem', fontWeight: 400, marginBottom: 5, paddingLeft: 2, opacity: 0.8}

    return (

        <React.Fragment>
            <div style={{
                display: 'flex', flexDirection: 'column',
                maxWidth: 800, padding: isMobile ? 20 : 40, backgroundColor: alpha(theme.palette.text.primary, 0.05),
                borderRadius: 8,
                marginLeft: 'auto', marginRight: 'auto',
                marginTop: 16, marginBottom: 46
            }}>

                <div style={{fontSize: '1.6rem', fontWeight: 700}}>Hello ModBox!</div>

                <div style={{marginBottom: 10, opacity: 0.8, fontSize: '1rem', lineHeight: '1.4rem'}}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeExternalLinks, {
                        target: '_blank',
                        rel: ['nofollow', 'noopener', 'noreferrer']
                    }]]}>
                        {String(intro).trim()}
                    </ReactMarkdown>
                </div>


                <div style={{
                    fontSize: '1.2rem',
                    lineHeight: '1.5rem',
                    fontWeight: 400,
                    opacity: 0.8,
                    width: '100%',
                    display: 'flex'
                }}>
                    <div style={{flexGrow: 1, fontWeight: 600}}>
                        Suggestion / Feedback
                    </div>
                    <div style={{...optionalHeaderStyle}}>
                                        <span style={{
                                            ...optionalHeaderStyle,
                                            opacity: 0.6, fontSize: '0.85rem'
                                        }}>{(form.suggestion?.length) || 0}/1200</span>
                    </div>
                </div>

                <div style={{width: '100%'}}>
                    <TextField type='text' name='message' multiline fullWidth rows={3}
                               color='info' style={{}} value={form.message || ''}
                               id='message' onChange={handleFormChange}
                               slotProps={{
                                   htmlInput: {maxLength: 1200}
                               }}
                    />
                </div>

                <div style={{
                    fontSize: '1.2rem',
                    lineHeight: '1.5rem',
                    fontWeight: 400,
                    opacity: 0.9,
                    borderBottom: '1px solid #aaa',
                    marginTop: 40,
                    width: '100%'
                }}>
                    Optional Information
                </div>

                <div style={{display: flexStyle, width: '100%', marginBottom: 40}}>
                    <div style={{
                        marginTop: 10,
                        display: flexStyle,
                        alignItems: 'flex-start'
                    }}>
                        <div style={{marginRight: 20, marginTop: 5}}>
                            <div style={optionalHeaderStyle}>Username <span
                                style={{fontWeight: 400, opacity: 0.5}}>(optional)</span>
                            </div>
                            <TextField type='text' name='username' size='small' style={{width: 280}}
                                       onChange={handleFormChange} value={form.username || ''}
                                       slotProps={{
                                           htmlInput: {maxLength: textFieldMax}
                                       }}/>
                        </div>

                        <div style={{marginRight: 20, marginTop: 5}}>
                            <div style={optionalHeaderStyle}>Platform <span
                                style={{fontWeight: 400, opacity: 0.5}}>(optional)</span>
                            </div>
                            <FormControl variant='standard' sx={{minWidth: 120}}>
                                <Select onChange={handleFormChange} ref={selectRef}
                                        name='platform' id='platform'
                                        form={form} size='small' style={{width: 180}}
                                        value={form.platform || ''}
                                        multiple={false} defaultValue={''}
                                        variant='outlined'
                                        IconComponent={
                                            form.platform?.length > 1
                                                ? () => (
                                                    <IconButton size='small' onClick={() => handleClearField('platform')}>
                                                        <CancelIcon/>
                                                    </IconButton>
                                                )
                                                : undefined
                                        }
                                >
                                    {platformList.map(platform => (
                                        <MenuItem key={platform} value={platform}>{platform}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div ref={containerRef} style={{overflow: 'hidden', marginTop: 5}}>
                            <Slide in={form.platform === 'Other'} container={containerRef.current} direction='right'>
                                <div>
                                    <div style={optionalHeaderStyle}>Other Platform <span
                                        style={{fontWeight: 400, opacity: 0.5}}>(optional)</span>
                                    </div>
                                    <TextField type='text' name='otherPlatform' size='small' style={{width: 200}}
                                               onChange={handleFormChange} value={form.otherPlatform || ''}
                                               slotProps={{
                                                   htmlInput: {maxLength: textFieldMax}
                                               }}/>
                                </div>
                            </Slide>
                        </div>
                    </div>
                </div>

                <Button onClick={handleFormSubmit} variant='contained' color='info'
                        disabled={form.message?.length === 0 || loading}
                        style={{width: 120, marginLeft: 'auto', marginRight: 'auto'}}>
                    Submit
                </Button>

                <ScopedDialog
                    open={!!result}
                    dialogContent={dialogContent}
                    handleClose={handleDialogClose}
                    position={{top: 80}}
                    centerX={true}
                />

            </div>

            <ToggleColorMode/>

        </React.Fragment>
    )
}
