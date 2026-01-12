import React from 'react'
import usePageTitle from '../util/usePageTitle.jsx'
import SettingsPage from './SettingsPage.jsx'

export default function SettingsRoute() {
    usePageTitle('Toggle Flags')

    return (
        <SettingsPage/>
    )
}
