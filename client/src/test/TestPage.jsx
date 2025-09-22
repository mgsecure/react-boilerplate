import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { API_PREFIX } from '@starter/shared'

const fetchJSON = async url => {
    const res = await fetch(url)
    if (!res.ok) throw new Error('network')
    return res.json()
}

export default function TestPage() {
    const { data, isLoading } = useQuery({
        queryKey: ['health'],
        queryFn: () => fetchJSON(`${API_PREFIX}/health`)
    })

    const sendEcho = async () => {
        const res = await fetch(`${API_PREFIX}/echo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'sendToDiscord from client' })
        })
        const json = await res.json()
        alert(JSON.stringify(json))
    }

    return (
        <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
            <h1>Node + React Starter</h1>
            <p>Health: {isLoading ? 'loading…' : JSON.stringify(data)}</p>
            <button onClick={sendEcho}>POST /api/echo</button>
        </div>
    )
}
