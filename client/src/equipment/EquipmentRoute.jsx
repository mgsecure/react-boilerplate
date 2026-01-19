import React, {useContext} from 'react'
import {equipmentFilterFields} from '../data/filterFields'
import {FilterProvider} from '../context/FilterContext.jsx'
import usePageTitle from '../util/usePageTitle'
import DataProvider from './EquipmentDataProvider.jsx'
import EquipmentPage from './EquipmentPage.jsx'
import DBContext from '../app/DBContext.jsx'

function EquipmentRoute() {
    usePageTitle('Equipment')
    const {userProfile = {}} = useContext(DBContext)

    return (
        <FilterProvider filterFields={equipmentFilterFields}>
            <DataProvider allEntries={userProfile?.equipment} profile={userProfile}>
                <EquipmentPage/>
            </DataProvider>
        </FilterProvider>
    )
}

export default EquipmentRoute
