import React, {useContext} from 'react'
import {brewFilterFields} from '../data/filterFields'
import {FilterProvider} from '../context/FilterContext.jsx'
import usePageTitle from '../util/usePageTitle'
import DataProvider from './CoffeesDataProvider.jsx'
import espressoBeans from '../data/espressoBeansDatabase.json'
import CoffeesList from './CoffeesList.jsx'
import DBContext from '../app/DBContext.jsx'

export default function CoffeesRoute() {
    usePageTitle('Coffees')
    const {userProfile = {}} = useContext(DBContext)

    return (
        <FilterProvider filterFields={brewFilterFields}>
            <DataProvider allEntries={espressoBeans} profile={userProfile}>
                <CoffeesList/>
            </DataProvider>
        </FilterProvider>
    )
}

