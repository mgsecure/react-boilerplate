import React, {useContext} from 'react'
import {brewFilterFields} from '../data/filterFields'
import {FilterProvider} from '../context/FilterContext.jsx'
import usePageTitle from '../util/usePageTitle'
import DataProvider from './BrewsDataProvider.jsx'
import espressoBeans from '../data/espressoBeansDatabase.json'
import BrewsPage from './BrewsPage.jsx'
import DBContext from '../app/DBContext.jsx'

function BrewsRoute() {
    usePageTitle('Brews')
    const {userProfile = {}} = useContext(DBContext)

    return (
        <FilterProvider filterFields={brewFilterFields}>
            <DataProvider allEntries={espressoBeans} profile={userProfile}>
                <BrewsPage/>
            </DataProvider>
        </FilterProvider>
    )
}

export default BrewsRoute
