import React, {useContext, useMemo} from 'react'
import DataContext from '../context/DataContext.jsx'
import FilterContext from '../context/FilterContext.jsx'
import filterEntriesAdvanced from '../filters/filterEntriesAdvanced'
import searchEntriesForText from '../filters/searchEntriesForText'
import removeAccents from 'remove-accents'
import {typeSort} from '../data/equipmentBeans'
import dayjs from 'dayjs'

export function EquipmentDataProvider({children, profile}) {
    const {filters: allFilters, advancedFilterGroups} = useContext(FilterContext)
    const {search, sort, expandAll} = allFilters

    const allEntries = useMemo(() => {
        return profile.equipment || []
    }, [profile.equipment])

    const mappedEntries = useMemo(() => {
        return allEntries
            .map(entry => {
                return {
                    ...entry,
                    originalEntry: {...entry},
                    fuzzy: removeAccents([
                        entry.fullName,
                        entry.type
                    ].join(','))
                }
            })
    }, [allEntries])

    const searchedEntries = useMemo(() => {
        return searchEntriesForText(search, mappedEntries)
    }, [mappedEntries, search])

    const visibleEntries = useMemo(() => {

        const filtered = filterEntriesAdvanced({
            advancedFilterGroups: advancedFilterGroups(),
            entries: mappedEntries
        })
        const searched = searchEntriesForText(search, filtered)

        const sorted = [...searched]
        if (sort) {
            sorted.sort((a, b) => {
                if (sort === 'name') {
                    return a.fullName.localeCompare(b.fullName)
                        || dayjs(b.modifiedAt || 0).valueOf() - dayjs(a.modifiedAt || 0).valueOf()
                } else if (sort === 'year') {
                    return parseInt(b.ratings?.year || 0) - parseInt(a.year?.rating || 0)
                        || a.fullName.localeCompare(b.fullName)
                        || dayjs(b.modifiedAt || 0).valueOf() - dayjs(a.modifiedAt || 0).valueOf()
                } else {
                    return typeSort(a.type, b.type)
                        || a.fullName.localeCompare(b.fullName)
                        || dayjs(b.modifiedAt || 0).valueOf() - dayjs(a.modifiedAt || 0).valueOf()
                }
            })
        } else {
            sorted.sort((a, b) => {
                return typeSort(a.type, b.type)
                    || a.fullName.localeCompare(b.fullName)
                    || dayjs(b.modifiedAt || 0).valueOf() - dayjs(a.modifiedAt || 0).valueOf()
            })
        }
        return sorted
    }, [advancedFilterGroups, mappedEntries, search, sort])

    const value = useMemo(() => ({
        allEntries,
        mappedEntries,
        searchedEntries,
        visibleEntries,
        expandAll
    }), [
        allEntries,
        mappedEntries,
        searchedEntries,
        visibleEntries,
        expandAll
    ])

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

export default EquipmentDataProvider
