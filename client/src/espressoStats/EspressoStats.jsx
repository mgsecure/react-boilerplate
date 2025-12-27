import React, {useContext, useMemo} from 'react'
import Tracker from '../app/Tracker'
import useWindowSize from '../util/useWindowSize'
import Nav from '../nav/Nav'
import DataContext from '../context/DataContext.jsx'
import {setDeep, setDeepAdd, setDeepPush} from '../util/setDeep'
import ClickablePie from './ClickablePie.jsx'

/**
 * @prop machineBrand
 * @prop machineModel
 * @prop grinderBrand
 * @prop grinderModel
 */

export default function EspressoStats() {
    const {isMobile} = useWindowSize()
    const {mappedEntries = []} = useContext(DataContext)

    const statsData = useMemo(() => {

        let data = {}

        const brandCountsUnique = mappedEntries.reduce((acc, entry) => {
            const machineBrand = entry.machineBrand || 'Other Brand'
            setDeepAdd(acc, ['machines', machineBrand], 1)
            const grinderBrand = entry.grinderBrand || 'Other Brand'
            setDeepAdd(acc, ['grinders', grinderBrand], 1)
            return acc
        }, {})


        const machineBrandCounts = Object.keys(brandCountsUnique.machines).reduce((acc, brand) => {
            if (brandCountsUnique.machines[brand] === 1) {
                setDeepAdd(acc, ['Other'], 1)
            } else {
                setDeep(acc, [brand], brandCountsUnique.machines[brand])
            }
            return acc
        }, {})

        const grinderBrandCounts = Object.keys(brandCountsUnique.grinders).reduce((acc, brand) => {
            if (brandCountsUnique.grinders[brand] === 1) {
                setDeepAdd(acc, ['Other'], 1)
            } else {
                setDeep(acc, [brand], brandCountsUnique.grinders[brand])
            }
            return acc
        }, {})

        const machineBrandsData = Object.keys(machineBrandCounts).map(brand => {
            return {id: brand, label: brand, value: machineBrandCounts[brand]}
        }).sort((a, b) => b.value - a.value || a.id.localeCompare(b.id))

        const grinderBrandsData = Object.keys(grinderBrandCounts).map(brand => {
            return {id: brand, label: brand, value: grinderBrandCounts[brand]}
        }).sort((a, b) => b.value - a.value || a.id.localeCompare(b.id))

        const brandModelCounts = mappedEntries.reduce((acc, entry) => {
            const machineBrand = brandCountsUnique.machines[entry.machineBrand] === 1
                ? 'Other'
                : entry.machineBrand
            const machineModel = brandCountsUnique.machines[entry.machineBrand] === 1
                ? entry.machineFullName
                : entry.machineModel || 'Other Model'
            setDeepAdd(acc, ['machines', machineBrand, machineModel], 1)

            const grinderBrand = brandCountsUnique.grinders[entry.grinderBrand] === 1
                ? 'Other'
                : entry.grinderBrand
            const grinderModel = brandCountsUnique.grinders[entry.grinderBrand] === 1
                ? entry.grinderFullName
                : entry.grinderModel || 'Other Model'
            setDeepAdd(acc, ['grinders', grinderBrand, grinderModel], 1)

            return acc
        }, {})

        Object.keys(brandModelCounts.machines).reduce((acc, brand) => {
            Object.keys(brandModelCounts.machines[brand]).reduce((acc2, model) => {
                setDeepPush(data, ['machines', brand], {
                    id: model,
                    label: model,
                    value: brandModelCounts.machines[brand][model]
                })
                return acc2
            }, [])
            return acc
        }, {})

        Object.keys(brandModelCounts.grinders).reduce((acc, brand) => {
            Object.keys(brandModelCounts.grinders[brand]).reduce((acc2, model) => {
                setDeepPush(data, ['grinders', brand], {
                    id: model,
                    label: model,
                    value: brandModelCounts.grinders[brand][model]
                })
                return acc2
            }, [])
            return acc
        }, {})

        const datasets = {
            machines: {
                brands: {
                    data: machineBrandsData,
                    parent: undefined,
                    description: 'Click chart for details',
                    colors: {scheme: 'set1'},
                    startAngle: -45
                }
            },
            grinders: {
                brands: {
                    data: grinderBrandsData,
                    parent: undefined,
                    description: 'Click chart for details',
                    colors: {scheme: 'set2'},
                    startAngle: -45
                }

            }
        }
        Object.keys(data.machines).forEach(brand => {
            setDeep(datasets, ['machines', brand], {
                data: brand !== 'Other'
                    ? data.machines[brand].sort((a, b) => b.value - a.value)
                    : data.machines[brand].sort((a, b) => a.id.localeCompare(b.id)),
                parent: 'brands',
                description: `${brand} models`,
                colors: {scheme: 'set1'},
                startAngle: brand !== 'Other'
                    ? 0
                    : 0.1
            })
        }, [])
        Object.keys(data.grinders).forEach(brand => {
            setDeep(datasets, ['grinders', brand], {
                data: brand !== 'Other'
                    ? data.grinders[brand].sort((a, b) => b.value - a.value || a.id.localeCompare(b.id))
                    : data.grinders[brand].sort((a, b) => a.id.localeCompare(b.id)),
                parent: 'brands',
                description: `${brand} models`,
                colors: {scheme: 'set2'},
                startAngle: brand !== 'Other'
                    ? 0
                    : 0.1
            })
        }, [])
        return datasets
    }, [mappedEntries])

    const extras = (
        <React.Fragment>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
        </React.Fragment>
    )

    const headerStyle = {
        margin: '46px 0px 8px 0px', width: '100%', textAlign: 'center', fontSize: '1.5rem',
        fontWeight: 600
    }
    const firstHeaderStyle = {
        margin: '16px 0px 8px 0px',
        width: '100%',
        textAlign: 'center',
        fontSize: '1.5rem',
        fontWeight: 600
    }

    return (
        <React.Fragment>
            <Nav title='r/espresso stats' titleMobile='stats' extras={extras}/>

            <div style={firstHeaderStyle} role='heading' aria-label='Machine Stats'>
                Machine Stats
            </div>
            <ClickablePie data={statsData.machines} chartId={'machines'} defaultId={'brands'}/>

            <div style={headerStyle} role='heading' aria-label='Grinder Stats'>
                Grinder Stats
            </div>
            <ClickablePie data={statsData.grinders} chartId={'grinders'} defaultId={'brands'}/>

            <Tracker feature='espressoStats'/>
        </React.Fragment>
    )
}