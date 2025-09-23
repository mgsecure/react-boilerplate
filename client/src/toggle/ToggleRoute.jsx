import React from 'react'
import usePageTitle from '../util/usePageTitle.jsx'
import TogglePage from './TogglePage.jsx'

export default function ToggleRoute() {
    usePageTitle('Lockpickers United - Toggle Flags')

    return (
        <TogglePage/>
    )
}
