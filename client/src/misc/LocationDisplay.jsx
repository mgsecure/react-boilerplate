import React from 'react'

export default function LocationDisplay({location = [], display='text'}) {

return (
    location.filter(Boolean).map(
        (loc, i) => <span key={i}>{loc}{i < location.length - 1 ? ', ' : ''}</span>
    )
)

}