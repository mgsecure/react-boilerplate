import React, {useCallback, useContext, useEffect, useState} from 'react'
import Tracker from '../app/Tracker'
import useWindowSize from '../util/useWindowSize'
import Nav from '../nav/Nav'
import Footer from '../nav/Footer.jsx'
import DBContext from '../app/DBContext.jsx'
import {Button, TextField} from '@mui/material'
import {useNavigate, useSearchParams} from 'react-router-dom'
import AuthContext from '../app/AuthContext.jsx'
import {enqueueSnackbar} from 'notistack'
import Menu from '@mui/material/Menu'
import Equipment from './Equipment.jsx'
import Beans from './Beans.jsx'
import Brews from './Brews.jsx'
import DataContext from '../context/DataContext.jsx'
import dayjs from 'dayjs'

export default function ViewProfile() {
    const {isMobile, flexStyle} = useWindowSize()
    const {
        userProfile = {},
        updateProfileField,
        deleteAllUserData
    } = useContext(DBContext)
    const {visibleEntries = []} = useContext(DataContext)

    const [form, setForm] = useState({...userProfile || {}})
    useEffect(() => {
        setForm({...userProfile})
    }, [userProfile])

    const handleFormChange = useCallback((event) => {
        const {name, value} = event.target
        setForm({...form, [name]: value})
    }, [form])


    const [searchParams] = useSearchParams()

    const [anchorEl, setAnchorEl] = useState(null)
    const [deletingData, setDeletingData] = useState(false)
    const navigate = useNavigate()
    const {user} = useContext(AuthContext)

    const handleFocus = useCallback(event => event.target.select(), [])

    const handleSaveUsername = useCallback(async () => {
        try {
            await updateProfileField('username', form.username)
            enqueueSnackbar('Profile updated')
        } catch (ex) {
            console.error('Error while updating profile', ex)
            enqueueSnackbar('Error while updating profile')
        }
    }, [form.username, updateProfileField])

    const handleClear = useCallback(async () => {
        try {
            await updateProfileField('username', null)
            enqueueSnackbar('Username cleared')
        } catch (ex) {
            console.error('Error while updating profile', ex)
            enqueueSnackbar('Error while updating profile')
        }
    }, [updateProfileField])

    const handleDeleteAllData = useCallback(async () => {
        setDeletingData(true)
        await deleteAllUserData(user.uid)
        setAnchorEl(null)
        setDeletingData(false)
        enqueueSnackbar('All data has been deleted')
    }, [deleteAllUserData, user])

    const handleDeleteConfirm = useCallback((ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        setAnchorEl(ev.currentTarget)
    }, [])

    const error = form.username && !pattern.test(form.username.toString())
    const noSave = !form.username || form.username === userProfile.username
    const helperText = error
        ? 'Username must only include A-Z, 0-9, _ and -.'
        : ''
    const introNameText = form.username
        ? ` (${form.username}) `
        : ''

    const brewsSection = (
        <div style={{padding: 16, width: '100%'}} key={'brews'}>
            <div style={{display: 'flex', alignItems: 'center', marginBottom: 0}}>
                <div style={{flexGrow: 1, fontSize: '1.3rem', fontWeight: 500}}>Recent Brews</div>
                <div style={{marginBottom:8}}>
                    <Button variant='contained' size='small' onClick={() => navigate('/brews')}>
                        View All</Button>
                </div>
            </div>
            <Brews entries={visibleEntries}/>
        </div>
    )

    const equipmentSection = (
        <div style={{padding: 16, width: '100%'}} key={'equipment'}>
            <div style={{width: '100%', fontSize: '1.2rem', fontWeight: 500, marginBottom: 10}}>Equipment</div>
            <Equipment machines={userProfile.equipment}/>
        </div>
    )

    const beansSection = (
        <div style={{padding: 16, width: '100%'}} key={'beans'}>
            <div style={{width: '100%', fontSize: '1.2rem', fontWeight: 500, marginBottom: 10}}>Recent Beans</div>
            <Beans beans={userProfile.beans?.sort((a, b) => dayjs(b.modifiedAt).valueOf() - dayjs(a.modifiedAt).valueOf())}/>
        </div>
    )

    let sections = [equipmentSection, beansSection, brewsSection]
    if (userProfile?.equipment?.length > 0 && userProfile?.beans?.length > 0) {
        sections = [brewsSection, beansSection, equipmentSection]
    }

    const extras = (
        <React.Fragment>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
        </React.Fragment>
    )
    const footerBefore = (
        <div style={{margin: '30px 0px'}}/>
    )

    return (
        <React.Fragment>
            <Nav title='My Profile' titleMobile='Profile' extras={extras}/>

            <div style={{display: flexStyle, padding: 16, width: '100%'}}>
                    <div style={{marginBottom: 10, marginRight: 20}}>
                        <span style={{fontSize: '1.2rem', fontWeight: 500}}>Username<br/></span>
                        Your username {introNameText} shows up if you share your profile with others.
                        Your Google login information will never be displayed to other users.
                    </div>

                <div style={{width: '100%', marginTop: 40}}>
                    <TextField
                        error={!!error}
                        name={'username'}
                        variant='outlined'
                        color='secondary'
                        label='Username'
                        helperText={helperText}
                        value={form.username || ''}
                        onChange={handleFormChange}
                        onFocus={handleFocus}
                        slotProps={{htmlInput: {maxLength: 32}}}
                        size='small'
                        style={{width: '100%', maxWidth: 300}}
                    />
                    <div style={{width: '100%', maxWidth: 300, textAlign: 'right', margin: '10px 0px 28px 0px'}}>
                        {userProfile.username &&
                            <Button variant='outlined'
                                    color='info'
                                    onClick={handleClear}
                                    disabled={!!error}
                                    style={{marginBottom: 10, color: '#4972ab', padding: '5px 10px'}}
                            >
                                Clear Display Name
                            </Button>
                        }
                        <Button variant='outlined'
                                color={error ? undefined : 'success'}
                                onClick={handleSaveUsername}
                                disabled={!!error || noSave}
                                style={{marginLeft: 16, marginRight: 0, marginBottom: 10, height: 40}}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </div>

            {sections}


            <div style={{width: '100%', textAlign: 'center', margin: '60px 0px 10px 0px'}}>
                <Button variant='outlined'
                        color='error'
                        onClick={handleDeleteConfirm}
                        style={{color: '#d31f1f', padding: '5px 10px'}}
                >
                    Delete All Profile Data
                </Button>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                    <div style={{padding: 20, textAlign: 'center'}}>
                        This will permanently delete all of your data.<br/>
                        Are you sure?
                    </div>
                    <div style={{textAlign: 'center'}}>
                        <Button style={{marginBottom: 10, color: '#000'}}
                                variant='contained'
                                onClick={handleDeleteAllData}
                                edge='start'
                                color='error'
                        >
                            Delete Profile
                        </Button>
                    </div>
                </Menu>
            </div>

            <Tracker feature='editProfile'/>
            <Footer before={footerBefore}/>

        </React.Fragment>
    )
}

const pattern = /^[\sa-zA-Z0-9_-]{1,32}$/