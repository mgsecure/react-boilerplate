import {useCallback, useContext} from 'react'
import AuthContext from '../app/AuthContext.jsx'
import DBContext from '../app/DBContext.jsx'
import useData from '../util/useData.jsx'
import equipment from './equipmentCounts.json'

export default function GetEquipment() {
    const {authLoaded} = useContext(AuthContext)
    const {getEquipment} = useContext(DBContext)
    const loadFn = useCallback(async () => {
        try {
            return await getEquipment()
        } catch (ex) {
            console.error('Error loading equipment list.', ex)
            return null
        }
    }, [getEquipment])
    const {data = {}, loading, error} = useData({loadFn})
    return {authLoaded, equipment, loading, error}
}