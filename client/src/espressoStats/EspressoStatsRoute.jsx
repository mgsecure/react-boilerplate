import React from 'react'
import {beanFilterFields} from '../data/filterFields'
import {FilterProvider} from '../context/FilterContext.jsx'
import usePageTitle from '../util/usePageTitle'
import DataProvider from '../espressoBeans/BeansDataProvider.jsx'
import espressoBeans from '../data/espressoBeansDatabase.json'
import EspressoStats from './EspressoStats.jsx'

export default function EspressoStatsRoute() {
    usePageTitle('espresso beans stats')

    return (
        <FilterProvider filterFields={beanFilterFields}>
            <DataProvider allEntries={espressoBeans}>
                <EspressoStats/>
            </DataProvider>
        </FilterProvider>
    )
}