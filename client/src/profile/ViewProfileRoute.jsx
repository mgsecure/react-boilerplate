import React, {useContext} from 'react'
import {beanFilterFields} from '../data/filterFields'
import {FilterProvider} from '../context/FilterContext.jsx'
import usePageTitle from '../util/usePageTitle'
import DataProvider from '../espressoBeans/BeansDataProvider.jsx'
import espressoBeans from '../data/espressoBeansDatabase.json'
import EditProfile from './EditProfile.jsx'
import {useOutletContext} from 'react-router-dom'
import DBContext from '../app/DBContext.jsx'

export default function ViewProfileRoute() {
    usePageTitle('My Profile')
    const {userProfile} = useContext(DBContext)

    console.log('userProfile', userProfile)
    return (
        <FilterProvider filterFields={beanFilterFields}>
            <DataProvider allEntries={espressoBeans}>
                <EditProfile/>
            </DataProvider>
        </FilterProvider>
    )
}