import React, {useContext, useMemo} from 'react'
import DataContext from '../context/DataContext.jsx'
import FilterContext from '../context/FilterContext.jsx'
import dayjs from 'dayjs'
import minMax from 'dayjs/plugin/minMax'
import removeAccents from 'remove-accents'
import filterEntriesAdvanced from '../filters/filterEntriesAdvanced'
import searchEntriesForText from '../filters/searchEntriesForText'
import roasters from '../data/roasters.json'
import useData from '../util/useData.jsx'
import cleanObject from '../util/cleanObject'

dayjs.extend(minMax)

let doseUnits = {g: 0}
let temperatureUnits = {'C': 0}

export function CoffeesDataProvider({children, profile}) {
    const {filters: allFilters, advancedFilterGroups} = useContext(FilterContext)
    const {search, sort, expandAll} = allFilters
    const {data: currencyConversion} = useData({url: 'https://beans.mgsecure.com/data/currencyConversion.json'})

    const allBrews = useMemo(() => {
        return profile.brews || []
    }, [profile.brews])

    const mappedBrews = useMemo(() => {
        return allBrews
            .map(entry => {
                const coffee = profile.coffees?.find(g => g.id === entry.coffee?.id) || entry.coffee || {}
                const tempUnit = entry.temperatureUnit?.substring(1, 2)
                if (tempUnit) temperatureUnits[tempUnit] = (temperatureUnits[tempUnit] || 0) + 1
                if (entry.doseUnit) doseUnits[entry.doseUnit] = (doseUnits[entry.doseUnit] || 0) + 1

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
    const modeDoseUnit = Object.entries(doseUnits).reduce((a, b) =>
        b[1] > a[1] || (b[1] === a[1] && b[0] < a[0]) ? b : a
    )[0]

    const modeTempUnit = Object.entries(temperatureUnits).reduce((a, b) =>
        b[1] > a[1] || (b[1] === a[1] && b[0] < a[0]) ? b : a
    )[0]
    const modeTemperatureUnit = `º${modeTempUnit}`



    const brewsList = useMemo(() => {
        return (mappedBrews || [])
            .sort((a, b) => dayjs(b.brewedAt).valueOf() - dayjs(a.brewedAt).valueOf())
    }, [mappedBrews])

    const allEntries = useMemo(() => {
        return profile.coffees || []
    }, [profile.coffees])

    let weightUnits = useMemo(() => {
        return {oz: 0}
    }, [])
    let priceUnits = useMemo(() => {
        return {'USD ($)': 0}
    }, [])

    const mappedEntries = useMemo(() => {
        return allEntries
            .map(entry => {
                const roaster = roasters.find(r => r.id === entry.roaster?.id) || entry.roaster ? entry.roaster : {name: 'Unknown Roaster'}
                const brews = brewsList?.filter(e => e.coffee?.id === entry.id) || []

                if (entry.weightUnit) weightUnits[entry.weightUnit] = (weightUnits[entry.weightUnit] || 0) + 1
                if (entry.priceUnit) priceUnits[entry.priceUnit] = (priceUnits[entry.priceUnit] || 0) + 1

                const price100g = entry.price && entry.priceUnit && entry.weight && entry.weightUnit
                    ? entry.weightUnit === 'oz'
                        ? entry.price / entry.weight * 28.3495
                        : entry.price / entry.weight * 100
                    : undefined

                const pricePound = entry.price && entry.priceUnit && entry.weight && entry.weightUnit
                    ? entry.weightUnit === 'oz'
                        ? entry.price / entry.weight * 16
                        : entry.price / entry.weight * 453.592
                    : undefined

                const currency = entry.priceUnit?.match(/(\w{3})/)[1]
                const pricePoundUSD = pricePound && pricePound / (currencyConversion?.conversion_rates[currency] || 0.0001)

                return {
                    ...entry,
                    originalEntry: entry,
                    roaster,
                    brews,
                    fullName: roaster.name !== 'Unknown Roaster' ? `${entry.name} (${entry.roaster.name})` : entry.name,
                    roasterName: roaster.name,
                    modifiedAt: entry.modifiedAt || entry.addedAt,
                    sortDate: dayjs.max(dayjs(brews[0]?.modifiedAt || 0), dayjs(entry.modifiedAt || 0),dayjs(entry.addedAt || 0)).format('YYYY-MM-DD HH:mm:ss'),
                    latestBrewDate: brews[0]?.brewTime,
                    caffeine: entry.decaf ? 'Decaf' : 'Regular',
                    price100g: price100g ? parseFloat(price100g.toFixed(2)) : undefined,
                    pricePound: pricePound ? parseFloat(pricePound.toFixed(2)) : undefined,
                    pricePoundUSD: pricePoundUSD ? parseFloat(pricePoundUSD.toFixed(2)) : undefined,
                    fuzzy: removeAccents([
                        entry.name,
                        entry.roaster?.name
                    ].join(','))
                }
            })
    }, [allEntries, brewsList, currencyConversion?.conversion_rates, priceUnits, weightUnits])

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
                    return (b.pricePoundUSD || 0) - (a.pricePoundUSD || 0)
                } else if (sort === 'priceAsc') {
                    return (a.pricePoundUSD || 9999) - (b.pricePoundUSD || 9999)
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
            .map(coffee => cleanObject(coffee.roaster))
            .filter(x => x && x.id && x.name)
        return getUniqueObjectsByKey([...roasters, ...userList], 'id')
            .sort((a, b) => a.name?.localeCompare(b.name))
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
        modePriceUnit,
        modeDoseUnit,
        modeTemperatureUnit
    }), [allEntries, mappedEntries, searchedEntries, visibleEntries, expandAll, grinderList, machineList, brewsList, coffeesList, roastersList, modeWeightUnit, modePriceUnit, modeDoseUnit, modeTemperatureUnit])

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
