import React, {useContext, useMemo} from 'react'
import DataContext from '../context/DataContext.jsx'
import FilterContext from '../context/FilterContext.jsx'
import dayjs from 'dayjs'
import removeAccents from 'remove-accents'
import filterEntriesAdvanced from '../filters/filterEntriesAdvanced'
import searchEntriesForText from '../filters/searchEntriesForText'
import entryName from '../entries/entryName'
import roasters from '../data/roasters.json'

export function CoffeesDataProvider({children, profile}) {
    const {filters: allFilters, advancedFilterGroups} = useContext(FilterContext)
    const {search, sort, expandAll} = allFilters

    const allEntries = useMemo(() => {
        return profile.coffees || []
    }, [profile.coffees])

    const mappedEntries = useMemo(() => {
        return allEntries
            .map(entry => {
                const roaster = roasters.find(r => r.id === entry.roaster?.id) || entry.roaster?.name ? {name: entry.roaster.name} : {name: 'Unknown Roaster'}
                const grinder = profile.equipment?.find(e => e.id === entry.grinderId) || {brand: 'Unknown Grinder'}
                const machine = profile.equipment?.find(e => e.id === entry.machineId) || {brand: 'Unknown Machine'}
                const brews = profile.brews?.filter(e => e.coffee?.id === entry.id) || []

                return {
                    ...entry,
                    originalEntry: entry,
                    roaster,
                    brews,
                    fullName: roaster.name !== 'Unknown Roaster' ? `${entry.name} (${entry.roaster.name})` : entry.name,
                    modifiedAt: entry.modifiedAt || entry.addedAt,
                    grinderName: entryName({entry: grinder}),
                    machineName: entryName({entry: machine}),
                    roasterName: roaster.name,
                    restedDays: Math.max(dayjs(entry.addedAt).diff(dayjs(entry.roastDate), 'day'), 0),
                    isFlagged: entry.flagged ? 'Yes' : 'No',
                    fuzzy: removeAccents([
                        entry.name,
                        entry.roaster?.name,
                        entryName({entry: machine}),
                        entryName({entry: grinder}),
                    ].join(','))
                }
            })
    }, [allEntries, profile.brews, profile.equipment])

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

    const brewsList = useMemo(() => {
        return (profile.brews || []).sort((a, b) => dayjs(b.modifiedAt).valueOf() - dayjs(a.modifiedAt).valueOf())
    }, [profile.brews])

    console.log('brewsList', brewsList)

    const value = useMemo(() => ({
        allEntries,
        mappedEntries,
        searchedEntries,
        visibleEntries,
        expandAll,
        grinderList,
        machineList,
        brewsList
    }), [
        allEntries,
        mappedEntries,
        searchedEntries,
        visibleEntries,
        expandAll,
        grinderList,
        machineList,
        brewsList
    ])

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

export default CoffeesDataProvider
