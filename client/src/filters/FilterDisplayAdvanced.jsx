import React, {useCallback, useContext, useMemo} from 'react'
import FieldValue from '../misc/FieldValue'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import FilterContext from '../context/FilterContext'
import {filterValueNames} from '../data/filterValues'
import {useTheme} from '@mui/material/styles'

function FilterDisplayAdvanced() {
    const {
        filters,
        filterCount,
        filterFieldsByFieldName,
        advancedFilterGroups,
        setAdvancedFilterGroups
    } = useContext(FilterContext)

    const theme = useTheme()

    const handleDeleteFilter = useCallback((keyToDelete, valueToDelete) => () => {
        const keyGroup = advancedFilterGroups().find(group => group.fieldName === keyToDelete)
        const newVaules = keyGroup?.values.filter(v => v !== valueToDelete)
        const newGroup = newVaules.length > 0 ? {...keyGroup, values: newVaules} : undefined
        const newGroups = advancedFilterGroups()
            .map(group => group.fieldName === keyToDelete ? newGroup : group)
            .filter(x => x)
        setAdvancedFilterGroups(newGroups)
    }, [advancedFilterGroups, setAdvancedFilterGroups])

    const filterValues = useMemo(() => {
        const {search, id, tab, name, sort, image, ...rest} = filters
        return Object.keys(rest)
            .map(key => {
                const value = filters[key]
                return Array.isArray(value)
                    ? value.map(subValue => ({key, value: subValue}))
                    : {key, value}
            })
            .flat()
    }, [filters])

    const cleanChipLabel = useCallback((label, value) => {
        if (label === 'Belt') {
            if (value === 'Unranked') {
                return value
            }
            if (value.includes('Black')) {
                return value.replace(/(Black)\s(\d+)/, '$1 Belt $2')
            } else {
                return value + ' Belt'
            }
        } else if (label === 'UL Group') {
            return 'Group ' + value
        } else if (label === 'Wheels') {
            return `${value} Wheels`
        } else if (filterValueNames[value]) {
            return filterValueNames[value]
        }
        return value
    }, [])

    if (filterCount === 0) return null

    return (
        <FieldValue name='Current Filters'
                    headerStyle={{fontSize: '1.0rem', fontWeight: 700, color: theme.palette.text.primary, marginBottom:5}}
                    style={{marginBottom: 10}}
                    value={
                        <Stack direction='row' spacing={0} sx={{flexWrap: 'wrap'}} style={{marginRight: -24}}>
                            {filterValues.map(({key, value: filter}, index) => {
                                    const bgColor = filter.startsWith('!') ? '#642c2c' : 'inherit'
                                    const chipLabel = cleanChipLabel(filterFieldsByFieldName[key]?.label, filter)
                                        .replace('!', 'NOT ').replace('||', ' OR ').replace('@@', ' AND ')
                                    return <Chip
                                        key={index}
                                        label={chipLabel}
                                        variant='outlined'
                                        style={{marginRight: 4, marginBottom: 4, backgroundColor: bgColor}}
                                        onDelete={handleDeleteFilter(key, filter)}
                                    />
                                }
                            )}
                        </Stack>
                    }/>
    )
}

export default FilterDisplayAdvanced
