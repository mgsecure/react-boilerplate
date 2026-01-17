import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import React, {useCallback} from 'react'

export default function FormToggleButtonGroup({
                                                  fieldName,
                                                  options = [],
                                                  defaultValue,
                                                  form = {},
                                                  handleFormChange,
                                                  style,
                                                  buttonStyle
                                              }) {

    const handleToggle = useCallback((event, fieldName) => {
        handleFormChange && fieldName && handleFormChange({target: {name: fieldName, value: event.target.name}})
    }, [handleFormChange])

    return (
        <ToggleButtonGroup variant='outlined' aria-label={fieldName} style={style}>
            {options.map(option =>
                <ToggleButton onClick={(e) => handleToggle(e, fieldName)}
                              key={option} value={option} name={option}
                              selected={(form[fieldName] || defaultValue) === option}
                              style={{
                                  textTransform: 'none',
                                  padding: '0px 8px',
                                  minWidth: 36,
                                  color: '#fff',
                                  ...buttonStyle
                              }}>{option}</ToggleButton>
            )}
        </ToggleButtonGroup>
    )
}