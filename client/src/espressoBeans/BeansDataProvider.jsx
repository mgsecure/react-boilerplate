import React, {useContext, useMemo} from 'react'
import DataContext from '../context/DataContext.jsx'
import FilterContext from '../context/FilterContext.jsx'
import dayjs from 'dayjs'
import removeAccents from 'remove-accents'
import filterEntriesAdvanced from '../filters/filterEntriesAdvanced'
import searchEntriesForText from '../filters/searchEntriesForText'
import useData from '../util/useData.jsx'

export function BeansDataProvider({children, allEntries}) {
    const {filters: allFilters, advancedFilterGroups} = useContext(FilterContext)
    const {search, sort, expandAll} = allFilters
    const {data, loading, error} = useData({url: 'https://beans.mgsecure.com/data/currencyConversion.json'})

    const mappedEntries = useMemo(() => {
        if (!data || loading || error) return []
        return allEntries
            .map(entry => {

                const currency = entry.priceUnit?.match(/(\w{3})/)[1]
                const currencySymbol = entry.priceUnit?.match(/\((.+)\)/)?.[1]

                let priceVars = {}
                if (entry.priceUnit && data && !loading && !error) {
                    priceVars.usdPound = entry.pricePound && entry.pricePound / data?.conversion_rates[currency]
                    priceVars.usd100g = entry.price100g && entry.price100g / data?.conversion_rates[currency]
                    priceVars.alt100gPrice = entry.price100g && currency !== 'USD' && `${currencySymbol}${parseFloat(entry.price100g).toFixed(2)}`
                    priceVars.altPoundPrice = entry.pricePound && currency !== 'USD' && `${currencySymbol}${parseFloat(entry.pricePound).toFixed(2)}`
                }

                return {
                    ...entry,
                    id: dayjs(entry.timestamp).valueOf(),
                    dateAdded: dayjs(entry.timestamp).format('MMM DD, YYYY'),
                    enteredAt: dayjs(entry.timestamp).valueOf(),
                    ratingValue: parseFloat(entry.rating),
                    currency,
                    currencySymbol,
                    ...priceVars,
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
                        entry.links?.length > 0 ? 'Has Links' : 'No Links'
                    ].flat().filter(x => x)
                }
            })
    }, [allEntries, data, error, loading])

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
                    return a.name.localeCompare(b.name)
                } else if (sort === 'rating') {
                    return (b.ratingValue || 0) - (a.ratingValue || 0)
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
        loading,
        allEntries,
        mappedEntries,
        searchedEntries,
        visibleEntries,
        expandAll
    }), [loading, allEntries, mappedEntries, searchedEntries, visibleEntries, expandAll])

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

export default BeansDataProvider
