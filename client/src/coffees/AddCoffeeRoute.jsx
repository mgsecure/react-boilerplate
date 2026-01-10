import React, {useContext} from 'react'
import {brewFilterFields} from '../data/filterFields'
import {FilterProvider} from '../context/FilterContext.jsx'
import usePageTitle from '../util/usePageTitle'
import DataProvider from './CoffeesDataProvider.jsx'
import espressoBeans from '../data/espressoBeansDatabase.json'
import DBContext from '../app/DBContext.jsx'
import AddCoffee from './AddCoffee.jsx'

export default function AddCoffeeRoute() {
    usePageTitle('Add Coffee')
    const {userProfile = {}} = useContext(DBContext)

    return (
        <FilterProvider filterFields={brewFilterFields}>
            <DataProvider allEntries={espressoBeans} profile={userProfile}>
                <AddCoffee/>
            </DataProvider>
        </FilterProvider>
    )
}

