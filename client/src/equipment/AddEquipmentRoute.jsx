import React, {useContext} from 'react'
import {equipmentFilterFields} from '../data/filterFields'
import {FilterProvider} from '../context/FilterContext.jsx'
import usePageTitle from '../util/usePageTitle'
import DataProvider from './EquipmentDataProvider.jsx'
import espressoBeans from '../data/espressoBeansDatabase.json'
import DBContext from '../app/DBContext.jsx'
import AddEquipment from './AddEquipment.jsx'

export default function AddEquipmentRoute() {
    usePageTitle('Add Gear')
    const {userProfile = {}} = useContext(DBContext)

    return (
        <FilterProvider filterFields={equipmentFilterFields}>
            <DataProvider allEntries={espressoBeans} profile={userProfile}>
                <AddEquipment/>
            </DataProvider>
        </FilterProvider>
    )
}

