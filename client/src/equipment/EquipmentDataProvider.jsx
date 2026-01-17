import React, {useContext, useMemo} from 'react'
import DataContext from '../context/DataContext.jsx'
import FilterContext from '../context/FilterContext.jsx'
import dayjs from 'dayjs'
import removeAccents from 'remove-accents'
import filterEntriesAdvanced from '../filters/filterEntriesAdvanced'
import searchEntriesForText from '../filters/searchEntriesForText'


export function EquipmentDataProvider({children, profile}) {
    const {filters: allFilters, advancedFilterGroups} = useContext(FilterContext)
    const {search, sort, expandAll} = allFilters

    const allEntries = useMemo(() => {
        return profile.brews || []
    }, [profile.brews])

    const mappedEntries = useMemo(() => {
        return allEntries
            .map(entry => {
                const coffee = profile.coffees?.find(g => g.id === entry.coffee?.id) || entry.coffee || {}
                const grinder = profile.equipment?.find(g => g.id === entry.grinder?.id) || entry.grinder || {}
                const machine = profile.equipment?.find(g => g.id === entry.machine?.id) || entry.machine || {}

                return {
                    ...entry,
                    originalEntry: entry,
                    fullName: coffee.fullName || 'Unknown Coffee',
                    coffeeName: coffee.name || 'Unknown Coffee',
                    roasterName: coffee.roaster?.name || 'Unknown Roaster',
                    grinderName: grinder?.fullName || 'Unknown Grinder',
                    machineName: machine?.fullName || 'Unknown Machine',
                    modifiedAt: entry.modifiedAt || entry.addedAt,
                    restedDays: Math.max(dayjs(entry.addedAt).diff(dayjs(entry.roastDate), 'day'), 0),
                    isFlagged: entry.flagged ? 'Yes' : 'No',
                    fuzzy: removeAccents([
                        entry.fullName
                    ].join(','))
                }
            })
    }, [allEntries, profile.coffees, profile.equipment])

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
                        || dayjs(b.brewedAt).valueOf() - dayjs(a.brewedAt).valueOf()
                } else if (sort === 'rating') {
                    return (b.ratings?.rating || 0) - (a.ratings?.rating || 0)
                        || a.fullName.localeCompare(b.fullName)
                } else if (sort === 'dateAdded') {
                    return dayjs(b.addedAt).valueOf() - dayjs(a.addedAt).valueOf()
                } else {
                    return dayjs(b.brewedAt).valueOf() - dayjs(a.brewedAt).valueOf()
                }
            })
        } else {
            sorted.sort((a, b) => {
                return dayjs(b.brewedAt).valueOf() - dayjs(a.brewedAt).valueOf()
            })
        }
        return sorted
    }, [advancedFilterGroups, mappedEntries, search, sort])

    const grinderList = useMemo(() => {
        return (profile.equipment?.filter(e => e.type === 'Grinder') || [])
            .sort((a, b) => a.fullName.localeCompare(b.fullName))
    }, [profile.equipment])

    const machineList = useMemo(() => {
        return (profile.equipment?.filter(e => e.type !== 'Grinder') || [])
            .sort((a, b) => a.fullName.localeCompare(b.fullName))
    }, [profile.equipment])

    const coffeesList = useMemo(() => {
        return ([...profile.coffees || []])
            .sort((a, b) => a.fullName.localeCompare(b.fullName))
    }, [profile.coffees])

    const value = useMemo(() => ({
        allEntries,
        mappedEntries,
        searchedEntries,
        visibleEntries,
        expandAll,
        grinderList,
        machineList,
        coffeesList
    }), [
        allEntries,
        mappedEntries,
        searchedEntries,
        visibleEntries,
        expandAll,
        grinderList,
        machineList,
        coffeesList
    ])

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

export default EquipmentDataProvider
