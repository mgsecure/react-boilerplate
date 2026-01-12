import Button from '@mui/material/Button'
import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react'
import {db} from '../auth/firebase'
import {
    doc,
    arrayRemove,
    onSnapshot,
    runTransaction,
    getDoc,
    updateDoc,
    deleteField,
    setDoc
} from 'firebase/firestore'
import AuthContext from './AuthContext'
import {enqueueSnackbar} from 'notistack'
import dayjs from 'dayjs'
import demoProfile from '../data/demoProfile.json'
import {useLocalStorage} from 'usehooks-ts'

/**
 * @typedef {object} award
 * @prop award.awardType
 * @prop awardType
 */

const DBContext = React.createContext({})

export function DBProvider({children}) {
    const {authLoaded, isLoggedIn, user ={}, userClaims} = useContext(AuthContext)
    const [userProfile, setUserProfile] = useState({})
    const [profileLoaded, setProfileLoaded] = useState(false)
    const [dbError, setDbError] = useState(null)

    const adminRole = isLoggedIn && user && userClaims.includes('admin')
    const qaUserRole = isLoggedIn && user && (['qaUser', 'admin'].some(claim => userClaims.includes(claim)) || adminRole)

    const [demo, setDemo] = useLocalStorage('demo', true)
    const handleSetDemo = useCallback(value => {
        setDemo(value)
    }, [setDemo])


    // Profile Subscription
    useEffect(() => {
        if (isLoggedIn) {
            const ref = doc(db, 'user-profiles', user?.uid)
            return onSnapshot(ref, async doc => {
                const data = doc.data()
                if (data) {
                    setUserProfile(data)
                } else {
                    setUserProfile({})
                }
                setProfileLoaded(true)
            }, error => {
                console.error('Error listening to DB:', error)
                setDbError(true)
                enqueueSnackbar('There was a problem reading your collection. It will be unavailable until you refresh the page. ', {
                    autoHideDuration: null,
                    action: <Button color='secondary' onClick={() => window.location.reload()}>Refresh</Button>
                })
            })
        } else if (authLoaded) {
            setUserProfile({})
            setProfileLoaded(true)
        }
    }, [authLoaded, isLoggedIn, user])

    const getProfile = useCallback(async userId => {
        const ref = doc(db, 'user-profiles', userId)
        const value = await getDoc(ref)
        return value.data()
    }, [])

    const updateProfileField = useCallback(async (key, value) => {
        if (dbError) return false
        const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss')
        const ref = doc(db, 'user-profiles', user.uid)
        await runTransaction(db, async transaction => {
            const sfDoc = await transaction.get(ref)
            if (!sfDoc.exists()) {
                transaction.update(ref, {[key]: value})
                transaction.update(ref, {createdAt: timestamp})
                transaction.update(ref, {deletedAt: deleteField()})
            } else {
                transaction.update(ref, {
                    [key]: value,
                    modifiedAt: timestamp
                })
                transaction.update(ref, {deletedAt: deleteField()})
            }
        })
    }, [dbError, user])

    const deleteAllUserData = useCallback(async (userId) => {
        if (dbError) return false
        const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss')

        const ref = doc(db, 'user-profiles', userId)
        const profile = (await getDoc(ref)).data()
        let cleanProfile = {deletedAt: timestamp}
        if (profile.admin) {
            cleanProfile.admin = profile.admin
        }
        if (profile.displayName) {
            cleanProfile.displayName = profile.displayName
        }
        await setDoc(ref, cleanProfile)
    }, [dbError])

    const updateCollection = useCallback(async ({collection, item, flags = {}}) => {
        if (dbError) return false
        const cleanItem = Object.fromEntries(
            Object.entries(item).filter(([_key, value]) => {
                return value !== null && typeof value !== 'undefined'
            })
        )

        const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss')
        cleanItem.addedAt = cleanItem.addedAt || timestamp
        cleanItem.modifiedAt = timestamp

        const ref = doc(db, 'user-profiles', user.uid)
        let newItems
        if (flags.delete) {
            newItems = userProfile[collection]?.filter(e => e.id !== cleanItem.id)
        } else if (flags.update && userProfile[collection]) {
            newItems = userProfile[collection]?.map(e => e.id === cleanItem.id ? cleanItem : e)
        } else {
            newItems = [...userProfile[collection] || [], cleanItem]
        }

        await runTransaction(db, async transaction => {
            const sfDoc = await transaction.get(ref)
            if (sfDoc.exists()) {
                transaction.update(ref, {[collection]: newItems})
                transaction.update(ref, {modifiedAt: timestamp})
            } else {
                transaction.set(ref, {[collection]: newItems})
                transaction.update(ref, {createdAt: timestamp})
            }
        })
    }, [dbError, user?.uid, userProfile])


    // Equipment DB

    const addToEquipment = useCallback(async (equipment) => {
        if (dbError) return false
        const ref = doc(db, 'data-cache', 'equipment')
        await runTransaction(db, async transaction => {
            const sfDoc = await transaction.get(ref)
            if (!sfDoc.exists()) {
                console.log('sfDoc does not exist')
            } else {
                console.log('sfDoc.data()', sfDoc.data())
                transaction.update(ref, equipment)
            }
        })
    }, [dbError])

    const getEquipment = useCallback(async () => {
        const ref = doc(db, 'data-cache', 'equipment')
        const value = await getDoc(ref)
        return value.data()
    }, [])

    /*
    // Equipment Subscription
    useEffect(() => {
        const ref = doc(db, 'data-cache', 'equipment')
        return onSnapshot(ref, async doc => {
            const data = doc.data()
            if (data) {
                setEquipment(data)
            } else {
                setEquipment({})
            }
            setEquipmentLoaded(true)
        }, error => {
            console.error('Error listening to DB:', error)
            setDbError(true)
            enqueueSnackbar('There was a problem reading the equipment list. It will be unavailable until you refresh the page. ', {
                autoHideDuration: null,
                action: <Button color='secondary' onClick={() => window.location.reload()}>Refresh</Button>
            })
        })
    }, [])
    */


    // OLD //


    const removeFromLockCollection = useCallback(async (key, entryId) => {
        if (dbError) return false
        const ref = doc(db, 'lockcollections', user.uid)
        await runTransaction(db, async transaction => {
            const sfDoc = await transaction.get(ref)
            if (!sfDoc.exists()) {
                transaction.set(ref, {
                    [key]: [entryId]
                })
            } else {
                transaction.update(ref, {
                    [key]: arrayRemove(entryId)
                })
            }
        })
    }, [dbError, user])

    const updateProfileFieldX = useCallback(async (key, value) => {
        if (dbError) return false
        const ref = doc(db, 'lockcollections', user.uid)
        await runTransaction(db, async transaction => {
            const sfDoc = await transaction.get(ref)
            if (!sfDoc.exists()) {
                transaction.set(ref, {[key]: value})
            } else {
                transaction.update(ref, {[key]: value})
            }
        })
    }, [dbError, user])

    const updateProfileDisplayName = useCallback(async (displayName) => {
        const ref = doc(db, 'lockcollections', user.uid)
        if (displayName) {
            await setDoc(ref, {displayName}, {merge: true})
        } else {
            await updateDoc(ref, {displayName: deleteField()})
        }
    }, [user])

    const demoEnabled = demo && !isLoggedIn
    const value = useMemo(() => ({
        userProfile: demoEnabled ? demoProfile : userProfile,
        profileLoaded,
        updateProfileField,
        deleteAllUserData,
        updateCollection,
        addToEquipment,
        getEquipment,
        adminRole,
        removeFromLockCollection,
        getProfile,
        updateProfileDisplayName,
        qaUserRole,
        demo,
        setDemo: handleSetDemo,
        demoEnabled,
    }), [demoEnabled, userProfile, profileLoaded, updateProfileField, deleteAllUserData, updateCollection, addToEquipment, getEquipment, adminRole, removeFromLockCollection, getProfile, updateProfileDisplayName, qaUserRole, demo, handleSetDemo])

    return (
        <DBContext.Provider value={value}>
            {children}
        </DBContext.Provider>
    )
}


export default DBContext
