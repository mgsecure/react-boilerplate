import React, {useContext} from 'react'
import {roasterFilterFields} from '../data/filterFields'
import {FilterProvider} from '../context/FilterContext.jsx'
import usePageTitle from '../util/usePageTitle'
import DataProvider from './RoastersDataProvider.jsx'
import allEntries from '../data/roasters.json'
import RoastersPage from './RoastersPage.jsx'
import DBContext from '../app/DBContext.jsx'

function RoastersRoute() {
    usePageTitle('Roasters')
    const {userProfile = {}} = useContext(DBContext)

    return (
        <FilterProvider filterFields={roasterFilterFields}>
            <DataProvider allEntries={allEntries} profile={userProfile}>
                <RoastersPage/>
            </DataProvider>
        </FilterProvider>
    )
}

export default RoastersRoute
