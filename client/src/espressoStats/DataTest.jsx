import React, {useCallback, useContext, useMemo} from 'react'
import DBContext from '../app/DBContext.jsx'
import DataContext from '../context/DataContext.jsx'
import {setDeepAdd, setDeepUnique} from '../util/setDeep'
import {Link} from '@mui/material'


export default function DataTest() {

    const {equipment, updateProfileField} = useContext(DBContext)
    const {mappedEntries} = useContext(DataContext)

    const equipmentCounts = mappedEntries.reduce((acc, entry) => {
        const machineBrand = entry.machineBrand || entry.machineModel
        const machineModel = entry.machineBrand && entry.machineModel
            ? entry.machineModel
            : 'Other Model'
        setDeepAdd(acc, ['espressoMachines', machineBrand, machineModel], 1)
        const grinderBrand = entry.grinderBrand || entry.grinderModel
        const grinderModel = entry.grinderBrand && entry.grinderModel
            ? entry.grinderModel
            : 'Other Model'
        setDeepAdd(acc, ['grinders', grinderBrand, grinderModel], 1)
        return acc
    }, {})

    const handleUpdateProfile = useCallback(async (key, value) => {
        console.log('updating Profile', {key, value})
        await updateProfileField(key, value)
    }, [updateProfileField])

    const equipmentX = useMemo(() => {
        return mappedEntries.reduce((acc, entry) => {
            const machineBrand = entry.machineBrand || entry.machineModel
            const machineModel = entry.machineBrand && entry.machineModel
                ? entry.machineModel
                : 'Other Model'
            setDeepUnique(acc, ['espressoMachines', machineBrand], machineModel)
            const grinderBrand = entry.grinderBrand || entry.grinderModel
            const grinderModel = entry.grinderBrand && entry.grinderModel
                ? entry.grinderModel
                : 'Other Model'
            setDeepUnique(acc, ['grinders', grinderBrand], grinderModel)

            return acc
        }, {})
    }, [mappedEntries])

    //console.log('equipment', equipment)
    //console.log('equipmentCounts', equipmentCounts)

    return (
        <>
            <div style={{margin: 30}}>
                Data Test
            </div>

            <Link onClick={() => handleUpdateProfile('test', 'yes')}>click here</Link>
        </>
    )
}

