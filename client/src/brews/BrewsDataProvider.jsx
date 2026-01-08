import React, {useContext, useMemo} from 'react'
import DataContext from '../context/DataContext.jsx'
import FilterContext from '../context/FilterContext.jsx'
import dayjs from 'dayjs'
import removeAccents from 'remove-accents'
import filterEntriesAdvanced from '../filters/filterEntriesAdvanced'
import searchEntriesForText from '../filters/searchEntriesForText'
import entryName from '../entries/entryName'

export function BrewsDataProvider({children, profile}) {
    const {filters: allFilters, advancedFilterGroups} = useContext(FilterContext)
    const {search, sort, expandAll} = allFilters

    const allEntries = useMemo(() => {
        return !profile.brews
            ? []
            : profile.brews
    }, [profile.brews])

    const mappedEntries = useMemo(() => {
        return allEntries
            .map(entry => {
                const grinder = profile.equipment.find(g => g.id === entry.grinderId) || {brand: 'Unknown Grinder'}
                const machine = profile.equipment.find(g => g.id === entry.machineId) || {brand: 'Unknown Machine'}
                const bean = profile.beans.find(g => g.id === entry.beanId) || {name: 'Unknown Bean'}

                return {
                    ...entry,
                    fullName: bean.roaster ? `${bean.name} (${bean.roaster})` : bean.name,
                    modifiedAt: entry.modifiedAt || entry.addedAt,
                    grinderName: entryName({entry: grinder, entryType: 'grinder'}),
                    machineName: entryName({entry: machine, entryType: 'machine'}),
                    beanName: entryName({entry: bean, entryType: 'bean'}),
                    roasterName: bean.roaster ? bean.roaster : 'Unknown Roaster',
                    restedDays: Math.max(dayjs(entry.addedAt).diff(dayjs(entry.roastDate), 'day'),0),
                    isFlagged: entry.flagged ? 'Yes' : 'No',
                    fuzzy: removeAccents([
                        entry.fullName
                    ].join(','))
                }
            })
    }, [allEntries, profile.beans, profile.equipment])

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
                } else if (sort === 'name') {
                    return a.fullName.localeCompare(b.fullName)
                } else if (sort === 'rating') {
                    return (b.ratings?.rating || 0) - (a.ratings?.rating || 0)
                        || a.fullName.localeCompare(b.fullName)
                } else if (sort === 'dateAdded') {
                    return dayjs(b.addedAt).valueOf() - dayjs(a.addedAt).valueOf()
                } else {
                    return dayjs(b.modifiedAt).valueOf() - dayjs(a.modifiedAt).valueOf()
                }
            })
        } else {
            sorted.sort((a, b) => {
                return dayjs(b.modifiedAt).valueOf() - dayjs(a.modifiedAt).valueOf()
            })
        }
        return sorted
    }, [advancedFilterGroups, mappedEntries, search, sort])

    const grinderList = useMemo(() => {
        return (profile.equipment?.filter(e => e.type === 'Grinder') || [])
            .reduce((acc, grinder) => {
                const grinderName = [grinder.brand, grinder.model].filter(Boolean).join(' ')
                acc[grinderName] = grinder
                return acc
            }, {})
    }, [profile.equipment])

    const machineList = useMemo(() => {
        return (profile.equipment?.filter(e => e.type !== 'Grinder') || [])
            .reduce((acc, machine) => {
                const machineName = [machine.brand, machine.model].filter(Boolean).join(' ')
                acc[machineName] = machine
                return acc
            }, {})
    }, [profile.equipment])

    const beansList = useMemo(() => {
        return (profile.beans || [])
            .reduce((acc, entry) => {
                const entryName = entry.name + (entry.roaster ? ` (${entry.roaster})` : '')
                acc[entryName] = entry
                return acc
            }, {})
    }, [profile.beans])

    const value = useMemo(() => ({
        allEntries,
        mappedEntries,
        searchedEntries,
        visibleEntries,
        expandAll,
        grinderList,
        machineList,
        beansList
    }), [
        allEntries,
        mappedEntries,
        searchedEntries,
        visibleEntries,
        expandAll,
        grinderList,
        machineList,
        beansList
    ])

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

export default BrewsDataProvider
