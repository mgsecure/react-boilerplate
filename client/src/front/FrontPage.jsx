import React from 'react'
import ToggleColorMode from '../misc/ToggleColorMode.jsx'

export default function FrontPage() {
    return (
        <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
            <h1>Welcome to the new project!</h1>
            <ToggleColorMode/>
        </div>
    )
}
