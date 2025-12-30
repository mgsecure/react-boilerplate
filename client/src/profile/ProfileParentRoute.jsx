import React from 'react'
import {beanFilterFields} from '../data/filterFields'
import {FilterProvider} from '../context/FilterContext.jsx'
import usePageTitle from '../util/usePageTitle'
import DataProvider from '../espressoBeans/BeansDataProvider.jsx'
import espressoBeans from '../data/espressoBeansDatabase.json'
import {Outlet} from 'react-router-dom'

export default function ProfileParentRoute() {
    usePageTitle('My Profile')

    return (
        <FilterProvider filterFields={beanFilterFields}>
            <DataProvider allEntries={espressoBeans}>
                <Outlet/>
            </DataProvider>
        </FilterProvider>
    )
}