import React from 'react'
import {beanFilterFields} from '../data/filterFields'
import {FilterProvider} from '../context/FilterContext.jsx'
import usePageTitle from '../util/usePageTitle'
import DataProvider from '../espressoBeans/BeansDataProvider.jsx'
import espressoBeans from '../data/espressoBeansDatabase.json'
import ViewProfile from './ViewProfile.jsx'

export default function ViewProfileRoute() {
    usePageTitle('My Profile')
    return (
        <FilterProvider filterFields={beanFilterFields}>
            <DataProvider allEntries={espressoBeans}>
                <ViewProfile/>
            </DataProvider>
        </FilterProvider>
    )
}