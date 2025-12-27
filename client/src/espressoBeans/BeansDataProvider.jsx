import React, {useCallback, useContext, useMemo} from 'react'
import fuzzysort from 'fuzzysort'
import DataContext from '../context/DataContext.jsx'
import FilterContext from '../context/FilterContext.jsx'
import dayjs from 'dayjs'
import removeAccents from 'remove-accents'
import filterEntriesAdvanced from '../filters/filterEntriesAdvanced'
import searchEntriesForText from '../filters/searchEntriesForText.js'

export function BeansDataProvider({children, allEntries, profile}) {
    const {filters: allFilters, advancedFilterGroups} = useContext(FilterContext)
    const {search, sort, expandAll} = allFilters

    const mappedEntries = useMemo(() => {
        const userNotes = profile?.userLockNotes || {}
        return allEntries
            .map(entry => ({
                ...entry,
                id: dayjs(entry.timestamp).valueOf(),
                dateAdded: dayjs(entry.timestamp).format('MMM DD, YYYY'),
                enteredAt: dayjs(entry.timestamp).valueOf(),
                ratingValue: parseFloat(entry.rating),
                fullName: entry.roaster ? `${entry.roaster} ${entry.name}` : entry.name,
                machineFullName: (entry.machineBrand && entry.machineModel)
                    ? `${entry.machineBrand} ${entry.machineModel}`
                    : `${entry.machineBrand || ''}${entry.machineModel || ''}`,
                grinderFullName: (entry.grinderBrand && entry.grinderModel)
                    ? `${entry.grinderBrand} ${entry.grinderModel}`
                    : `${entry.grinderBrand || ''}${entry.grinderModel || ''}`,
                fuzzy: removeAccents([
                    entry.name,
                    entry.roaster
                ].join(',')),
                content: [
                    entry.media?.some(m => !m.fullUrl.match(/youtube\.com/)) ? 'Has Images' : 'No Images',
                    entry.media?.some(m => m.fullUrl.match(/youtube\.com/)) ? 'Has Video' : 'No Video',
                    entry.links?.length > 0 ? 'Has Links' : 'No Links',
                    userNotes[entry.id] ? 'Has Personal Notes' : undefined
                ].flat().filter(x => x),
                personalNotes: userNotes[entry.id]
            }))
    }, [allEntries, profile])

    const searchEntries = useCallback((entries) => {
        const exactMatch = search && entries.find(e => e.id === search)
        if (exactMatch) {
            return [exactMatch]
        }
        return !search
            ? entries
            : fuzzysort.go(removeAccents(search), entries, {keys: fuzzySortKeys, threshold: -23000})
                .map(result => ({
                    ...result.obj,
                    score: result.score
                }))
                .filter(entry => entry.score > 0.30)
    }, [search])

    const searchedEntries = useMemo(() => {
        return searchEntriesForText(search, mappedEntries)
    }, [mappedEntries, searchEntries])


    const visibleEntries = useMemo(() => {

        const filtered = filterEntriesAdvanced({
            advancedFilterGroups: advancedFilterGroups(),
            entries: mappedEntries
        })
        const searched = searchEntriesForText(search, filtered)

        return sort
            ? searched.sort((a, b) => {
                if (sort === 'alphaAscending') {
                    return a.fullName.localeCompare(b.fullName)
                } else if (sort === 'alphaDescending') {
                    return b.fullName.localeCompare(a.fullName)
                } else if (sort === 'name') {
                    return a.name.localeCompare(b.name)
                } else if (sort === 'rating') {
                    return (b.ratingValue || 0) - (a.ratingValue || 0)
                        || a.fullName.localeCompare(b.fullName)
                } else if (sort === 'dateAdded') {
                    return dayjs(b.timestamp).valueOf() - dayjs(a.timestamp).valueOf()
                } else {
                    return a.fuzzy.localeCompare(b.fuzzy)
                }
            })
            : searched.sort((a, b) => {
                return a.fullName.localeCompare(b.fullName)
            })
    }, [advancedFilterGroups, mappedEntries, searchEntries, sort])

    const value = useMemo(() => ({
        allEntries,
        mappedEntries,
        searchedEntries,
        visibleEntries,
        expandAll
    }), [allEntries, mappedEntries, searchedEntries, visibleEntries, expandAll])

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

const fuzzySortKeys = ['fuzzy']

export default BeansDataProvider
