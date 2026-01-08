import React from 'react'

function FieldValue({name, value, last, style, headerStyle = {}, textStyle = {}, suffix, prefix, fallback, center=false}) {
    const marginStyle = last
        ? {marginLeft: 5, ...style}
        : {marginLeft: 5, marginBottom: 8, ...style}
    const fullHeaderStyle = {
        color: '#888',
        fontSize: '0.85rem',
        textAlign: center ? 'center' : 'left',
        ...headerStyle
    }
    const fullTextStyle = {
        marginLeft: 5,
        textAlign: center ? 'center' : 'left',
        ...textStyle
    }

    if (!value && !fallback) return null

    const displayValue = (prefix || suffix) ? [prefix,value,suffix].filter(Boolean).join('') : value || fallback
    return (
        <div style={marginStyle}>
            <div style={fullHeaderStyle}>
                {name}
            </div>
            <div style={fullTextStyle}>
                {displayValue}
            </div>
        </div>
    )
}

export default React.memo(FieldValue)
