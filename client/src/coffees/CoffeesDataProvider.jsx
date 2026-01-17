import React, {useContext, useMemo} from 'react'
import DataContext from '../context/DataContext.jsx'
import FilterContext from '../context/FilterContext.jsx'
import dayjs from 'dayjs'
import removeAccents from 'remove-accents'
import filterEntriesAdvanced from '../filters/filterEntriesAdvanced'
import searchEntriesForText from '../filters/searchEntriesForText'
import roasters from '../data/roasters.json'

export function CoffeesDataProvider({children, profile}) {
    const {filters: allFilters, advancedFilterGroups} = useContext(FilterContext)
    const {search, sort, expandAll} = allFilters

    const allBrews = useMemo(() => {
        return profile.brews || []
    }, [profile.brews])

    const mappedBrews = useMemo(() => {
        return allBrews
            .map(entry => {
                const coffee = profile.coffees?.find(g => g.id === entry.coffee?.id) || entry.coffee || {}
                return {
                    ...entry,
                    originalEntry: {...entry},
                    fullName: coffee.roaster ? `${coffee.name} (${coffee.roaster.name})` : coffee.name,
                    modifiedAt: entry.modifiedAt || entry.addedAt,
                    restedDays: Math.max(dayjs(entry.addedAt).diff(dayjs(entry.roastDate), 'day'), 0),
                    isFlagged: entry.flagged ? 'Yes' : 'No',
                    fuzzy: removeAccents([
                        entry.fullName
                    ].join(','))
                }
            })
    }, [allBrews, profile.coffees])

    const brewsList = useMemo(() => {
        return (mappedBrews || [])
            .sort((a, b) => dayjs(b.brewedAt).valueOf() - dayjs(a.brewedAt).valueOf())
    }, [mappedBrews])

    const allEntries = useMemo(() => {
        return profile.coffees || []
    }, [profile.coffees])

    let weightUnits = useMemo(() => {
        return {oz: 0, g: 0}
    }, [])
    let priceUnits = useMemo(() => {
        return {'USD ($)': 0}
    }, [])

    const mappedEntries = useMemo(() => {
        return allEntries
            .map(entry => {
                const roaster = roasters.find(r => r.id === entry.roaster?.id) || entry.roaster ? entry.roaster : {name: 'Unknown Roaster'}
                const brews = brewsList?.filter(e => e.coffee?.id === entry.id) || []

                entry.weightUnit && weightUnits[entry.weightUnit]++
                if (entry.priceUnit) priceUnits[entry.priceUnit] = (priceUnits[entry.priceUnit] || 0) + 1

                const pricePound = entry.price && entry.weight && entry.weightUnit
                    ? entry.weightUnit === 'oz'
                        ? entry.price / entry.weight * 16
                        : entry.price / entry.weight * 453.592
                    : undefined

                const price100g = entry.price && entry.weight && entry.weightUnit
                    ? entry.weightUnit === 'oz'
                        ? entry.price / entry.weight * 28.3495
                        : entry.price / entry.weight * 100
                    : undefined

                return {
                    ...entry,
                    originalEntry: entry,
                    roaster,
                    brews,
                    fullName: roaster.name !== 'Unknown Roaster' ? `${entry.name} (${entry.roaster.name})` : entry.name,
                    roasterName: roaster.name,
                    modifiedAt: entry.modifiedAt || entry.addedAt,
                    sortDate: brews[0]?.modifiedAt || entry.modifiedAt || entry.addedAt,
                    latestBrewDate: brews[0]?.brewTime,
                    caffeine: entry.decaf ? 'Decaf' : 'Regular',
                    pricePound: pricePound ? parseFloat(pricePound.toFixed(2)) : undefined,
                    price100g: price100g ? parseFloat(price100g.toFixed(2)) : undefined,
                    fuzzy: removeAccents([
                        entry.name,
                        entry.roaster?.name
                    ].join(','))
                }
            })
    }, [allEntries, brewsList, priceUnits, weightUnits])

    const modeWeightUnit = Object.entries(weightUnits).reduce((a, b) =>
        b[1] > a[1] || (b[1] === a[1] && b[0] < a[0]) ? b : a
    )[0]
    const modePriceUnit = Object.entries(priceUnits).reduce((a, b) =>
        b[1] > a[1] || (b[1] === a[1] && b[0] < a[0]) ? b : a
    )[0]


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
                } else if (sort === 'roasterName') {
                    return a.roasterName.localeCompare(b.roasterName)
                        || a.fullName.localeCompare(b.fullName)
                } else if (sort === 'rating') {
                    return (b.ratings?.rating || 0) - (a.ratings?.rating || 0)
                        || a.fullName.localeCompare(b.fullName)
                } else if (sort === 'brewDate') {
                    return b.latestBrewDate ? dayjs(b.latestBrewDate).valueOf() : 0 - a.latestBrewDate ? dayjs(a.latestBrewDate).valueOf() : 0
                } else if (sort === 'price') {
                    return (b.pricePound || 0) - (a.pricePound || 0)
                } else if (sort === 'priceAsc') {
                    return (a.pricePound || 9999) - (b.pricePound || 9999)
                } else if (sort === 'dateAdded') {
                    return dayjs(b.addedAt).valueOf() - dayjs(a.addedAt).valueOf()
                } else {
                    return dayjs(b.sortDate).valueOf() - dayjs(a.sortDate).valueOf()
                }
            })
        } else {
            sorted.sort((a, b) => {
                return dayjs(b.sortDate).valueOf() - dayjs(a.sortDate).valueOf()
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

    const roastersList = useMemo(() => {
        const userList = ([...profile.coffees || []])
            .map(coffee => coffee.roaster)
        return getUniqueObjectsByKey([...roasters, ...userList], 'id')
            .sort((a, b) => a.name.localeCompare(b.name))
    }, [profile.coffees])

    const value = useMemo(() => ({
        allEntries,
        allEntriesCount: allEntries.length,
        mappedEntries,
        searchedEntries,
        visibleEntries,
        expandAll,
        grinderList,
        machineList,
        brewsList,
        coffeesList,
        roastersList,
        modeWeightUnit,
        modePriceUnit
    }), [allEntries, mappedEntries, searchedEntries, visibleEntries, expandAll, grinderList, machineList, brewsList, coffeesList, roastersList, modeWeightUnit, modePriceUnit])

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

export default CoffeesDataProvider

function getUniqueObjectsByKey(arr, key) {
    const uniqueIds = new Set()
    return arr.filter(item => {
        if (!uniqueIds.has(item[key])) {
            uniqueIds.add(item[key])
            return true
        }
        return false
    })
}
