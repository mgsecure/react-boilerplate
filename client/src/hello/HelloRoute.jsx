import React from 'react'
import ToggleColorMode from '../misc/ToggleColorMode.jsx'

export default function HelloRoute() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 50 }}>
            <h1>Hello!</h1>
            <ToggleColorMode/>
        </div>
    )
}
