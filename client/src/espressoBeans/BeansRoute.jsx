import React from 'react'
import {beanFilterFields} from '../data/filterFields'
import {FilterProvider} from '../context/FilterContext.jsx'
import usePageTitle from '../util/usePageTitle'
import DataProvider from './BeansDataProvider.jsx'
import espressoBeans from '../data/espressoBeansDatabase.json'
import Beans from './Beans.jsx'

function BeansRoute() {
    usePageTitle('espresso beans database')

    return (
        <FilterProvider filterFields={beanFilterFields}>
            <DataProvider allEntries={espressoBeans}>
                <Beans/>
            </DataProvider>
        </FilterProvider>
    )
}

export default BeansRoute
