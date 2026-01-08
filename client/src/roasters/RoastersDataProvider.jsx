import React, {useContext, useMemo} from 'react'
import DataContext from '../context/DataContext.jsx'
import FilterContext from '../context/FilterContext.jsx'
import dayjs from 'dayjs'
import removeAccents from 'remove-accents'
import filterEntriesAdvanced from '../filters/filterEntriesAdvanced'
import searchEntriesForText from '../filters/searchEntriesForText'

export function RoastersDataProvider({children, allEntries, profile}) {
    const {filters: allFilters, advancedFilterGroups} = useContext(FilterContext)
    const {search, sort, expandAll} = allFilters

    const mappedEntries = useMemo(() => {
        return allEntries
            .map(entry => {
                return {
                    ...entry,
                    fullName: entry.name,
                    fuzzy: removeAccents([
                        entry.name,
                        entry.city,
                        entry.stateRegion,
                        entry.country
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
                if (sort === 'alphaAscending') {
                    return a.fullName.localeCompare(b.fullName)
                } else if (sort === 'alphaDescending') {
                    return b.fullName.localeCompare(a.fullName)
                } else if (sort === 'pouroverVotes') {
                    return (b.pouroverVotes || 0) - (a.pouroverVotes || 0)
                        || a.fullName.localeCompare(b.fullName)
                } else if (sort === 'roastfulRanking') {
                    return (a.roastfulRanking || 9999) - (b.roastfulRanking || 9999)
                        || a.fullName.localeCompare(b.fullName)
                } else if (sort === 'priceLb') {
                    return (b.usdPound || 0) - (a.usdPound || 0)
                        || a.fullName.localeCompare(b.fullName)
                } else if (sort === 'price100g') {
                    return (b.usdPound || 0) - (a.usdPound || 0)
                        || a.fullName.localeCompare(b.fullName)
                } else if (sort === 'dateAdded') {
                    return dayjs(b.timestamp).valueOf() - dayjs(a.timestamp).valueOf()
                } else {
                    return a.fuzzy.localeCompare(b.fuzzy)
                }
            })
        } else {
            sorted.sort((a, b) => {
                return a.fullName.localeCompare(b.fullName)
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

export default RoastersDataProvider
