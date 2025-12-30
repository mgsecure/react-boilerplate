import Button from '@mui/material/Button'
import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react'
import {db} from '../auth/firebase'
import {
    doc,
    arrayUnion,
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
import {setDeepPush} from '../util/setDeep'

/**
 * @typedef {object} award
 * @prop award.awardType
 * @prop awardType
 */

const DBContext = React.createContext({})

export function DBProvider({children}) {
    const {authLoaded, isLoggedIn, user, userClaims} = useContext(AuthContext)
    const [userProfile, setUserProfile] = useState({})
    const [profileLoaded, setProfileLoaded] = useState(false)
    const [dbError, setDbError] = useState(null)

    const dbLoaded = profileLoaded
    const adminRole = isLoggedIn && userProfile && userProfile.admin
    const qaUserRole = isLoggedIn && user && (['qaUser', 'admin'].some(claim => userClaims.includes(claim)) || adminRole)

    // EditProfile Subscription
    useEffect(() => {
        if (isLoggedIn) {
            const ref = doc(db, 'user-profiles', user.uid)
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
                    modifiedAt: timestamp,
                })
                transaction.update(ref, {deletedAt: deleteField()})
            }
        })
    }, [dbError, user.uid])

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


    const addEquipment = useCallback(async (equipment) => {
        if (dbError) return false
        const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss')
        equipment.addedAt = timestamp
        const ref = doc(db, 'user-profiles', user.uid)
        const newEquipment = [...userProfile.equipment || [], equipment]
        await runTransaction(db, async transaction => {
            const sfDoc = await transaction.get(ref)
            if (sfDoc.exists()) {
                transaction.update(ref, {equipment: newEquipment})
                transaction.update(ref, {modifiedAt: timestamp})
            } else {
                transaction.set(ref, {equipment: newEquipment})
                transaction.update(ref, {createdAt: timestamp})
            }
        })
    },[dbError, user.uid, userProfile.equipment])


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


    const value = useMemo(() => ({
        userProfile,
        profileLoaded,
        updateProfileField,
        deleteAllUserData,
        addEquipment,
        addToEquipment,
        getEquipment,
        adminRole,
        removeFromLockCollection,
        getProfile,
        updateProfileDisplayName,
        qaUserRole
    }), [
        userProfile,
        profileLoaded,
        updateProfileField,
        deleteAllUserData,
        addEquipment,
        addToEquipment,
        getEquipment,
        adminRole,
        removeFromLockCollection,
        getProfile,
        updateProfileDisplayName,
        qaUserRole
    ])

    return (
        <DBContext.Provider value={value}>
            {children}
        </DBContext.Provider>
    )
}


export default DBContext
