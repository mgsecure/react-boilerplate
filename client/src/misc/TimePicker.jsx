import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import {TimeField} from '@mui/x-date-pickers/TimeField'
import React, {useCallback, useEffect, useState} from 'react'
import dayjs from 'dayjs'

export default function TimePicker({value, handleChangeTime}) {

    const [timeComponents, setTimeComponents] = useState({minutes: 0, seconds: 0})
    useEffect(() => {
        setTimeComponents({minutes: value?.minute() || 0, seconds: value?.second() || 0})
    }, [value])

    const handleChange = useCallback((newValue, field) => {
        const updatedTimeComponents = {...timeComponents, [field]: newValue}
        setTimeComponents(updatedTimeComponents)
        handleChangeTime(dayjs(`${updatedTimeComponents.minutes}:${updatedTimeComponents.seconds}`, 'mm:ss'))
    }, [handleChangeTime, timeComponents])

    const timeFieldSx = {
        '.MuiPickersOutlinedInput-root': {
            padding: 0, placeItems: 'center'
        },
        '.MuiPickersInputBase-sectionsContainer': {
            padding: 0, placeItems: 'center', width: '100%'
        },
        '.MuiPickersSectionList-section': {
            padding: '8.5px', textAlign: 'center', width: '45px'
        }
    }

    return (
        <div style={{display: 'flex', placeItems: 'center'}}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimeField format={'m'}
                           value={dayjs().minute(timeComponents.minutes || 0)}
                           onChange={(newValue) => handleChange((newValue?.minute() || 0), 'minutes')}
                           sx={timeFieldSx}
                />
                <div style={{margin: '0px 4px', fontWeight: 700, fontSize: '1.2rem'}}>:</div>
                <TimeField format={'ss'}
                           value={dayjs().second(timeComponents.seconds) || 0}
                           onChange={(newValue) => handleChange((newValue?.second() || 0), 'seconds')}
                           sx={timeFieldSx}
                />
            </LocalizationProvider>
        </div>
    )
}