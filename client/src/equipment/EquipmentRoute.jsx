import React, {useContext} from 'react'
import {brewFilterFields} from '../data/filterFields'
import {FilterProvider} from '../context/FilterContext.jsx'
import usePageTitle from '../util/usePageTitle'
import DataProvider from './EquipmentDataProvider.jsx'
import espressoBeans from '../data/espressoBeansDatabase.json'
import EquipmentPage from './EquipmentPage.jsx'
import DBContext from '../app/DBContext.jsx'

function EquipmentRoute() {
    usePageTitle('Equipment')
    const {userProfile = {}} = useContext(DBContext)

    return (
        <FilterProvider filterFields={brewFilterFields}>
            <DataProvider allEntries={espressoBeans} profile={userProfile}>
                <EquipmentPage/>
            </DataProvider>
        </FilterProvider>
    )
}

export default EquipmentRoute
