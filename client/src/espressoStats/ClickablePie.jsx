import React, {useCallback, useContext, useMemo, useState} from 'react'
import {ResponsivePie} from '@nivo/pie'
import {pieTheme} from '../data/chartDefaults'
import useWindowSize from '../util/useWindowSize'
import Link from '@mui/material/Link'
import FilterContext from '../context/FilterContext.jsx'

/**
 * @prop msMaxTouchPoints
 */

export default function ClickablePie({data, chartId, defaultId = 'default'}) {
    const touchTap = isTouchDevice()

    const {filters, addFilter, removeFilters} = useContext(FilterContext)
    const {cId, dsId} = filters

    const defaultDatasetId = chartId === cId && data[dsId]
        ? dsId
        : defaultId
    const [datasetId, setDatasetId] = useState(defaultDatasetId)
    const dataset = useMemo(() => data[datasetId], [data, datasetId])

    const totalCount = useMemo(() => {
        return Object.keys(dataset.data).reduce((acc, current) => {
            return (acc || 0) + dataset.data[current].value
        }, 0)
    }, [dataset])

    const maxCount = useMemo(() => {
        return Object.keys(dataset.data).reduce((acc, current) => {
            return Math.max(acc, dataset.data[current].value)
        }, 0)
    }, [dataset])

    const handleChangeDataset = useCallback((datasetId) => {
        addFilter('dsId', datasetId, true)
        addFilter('cId', chartId, true)
        setDatasetId(datasetId)
    }, [addFilter, chartId])

    const handleClick = useCallback((dataset) => {
        if (data[dataset.id]) {
            document.getElementById('chartDescription').style.opacity = '0.2'
            setTimeout(() => {
                document.getElementById('chartDescription').style.opacity = '1'
                handleChangeDataset(dataset.id)
            }, 200)
        }
    }, [data, handleChangeDataset])

    const handleBack = useCallback(() => {
        if (!dataset.parent) {
            removeFilters(['dsId'])
        } else {
            addFilter('dsId', dataset.parent, true)
        }
        handleChangeDataset(dataset.parent)
    }, [addFilter, dataset.parent, handleChangeDataset, removeFilters])

    const handleMouseEnter = useCallback((datum, event) => {
        if (data[datum['id']]) {
            event.currentTarget.style.cursor = 'pointer'
        }
    }, [data])

    const {width} = useWindowSize()
    const mobileSmall = width <= 360
    const mobileMedium = width <= 395
    const mobileLarge = width <= 428  // but test also at 412
    const smallWindow = width <= 560

    const chartMargin = {top: 30, right: 0, bottom: 30, left: 0}
    let chartHeight = 320
    if (mobileSmall) {
        chartHeight = 175
    } else if (mobileMedium) {
        chartHeight = 190
    } else if (mobileLarge) {
        chartHeight = 230
    } else if (smallWindow) {
        chartHeight = 240
    }

    const backLinkSize = !smallWindow ? '1.0rem' : '1.0rem'
    const arcLinkLabelsSkipAngle = !smallWindow ? 4 : 5
    const arcLabelsSkipAngle = !smallWindow ? 8 : 10
    const arcLinkLabelsStraightLength = !smallWindow ? 8 : 0

    return (
        <React.Fragment>
            {dataset.description &&
                <div
                    style={{
                        fontSize: '0.95rem', fontWeight: 500, width: '100%', textAlign: 'center', marginBottom: 4,
                        opacity: 1,
                        transitionProperty: 'opacity, left, top, height',
                        transitionDuration: '0.1s, 0.1s'
                    }}
                    id='chartDescription'
                >
                    {dataset.description}
                </div>
            }
            <div aria-label='Pie Chart'
                 style={{height: chartHeight, margin: '0px 8px 0px 8px', width: '100%', position: 'relative'}}
            >
                <div style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0
                }}>
                    <ResponsivePie
                        data={dataset.data}
                        theme={pieTheme}
                        colors={dataset.colors}
                        margin={chartMargin}
                        startAngle={dataset.startAngle || -40}
                        endAngle={360}
                        innerRadius={0.5}
                        padAngle={0.7}
                        cornerRadius={3}
                        activeOuterRadiusOffset={0}
                        arcLinkLabelsSkipAngle={arcLinkLabelsSkipAngle}
                        arcLinkLabelsTextColor='#ccc'
                        arcLinkLabelsThickness={2}
                        arcLinkLabelsColor={{from: 'color'}}
                        arcLinkLabel={e => maxCount > 1
                            ? e.label + ': ' + Math.round(e.value / totalCount * 100) + '%'
                            : e.label}
                        arcLinkLabelsDiagonalLength={14}
                        arcLinkLabelsStraightLength={arcLinkLabelsStraightLength}
                        enableArcLabels={false}
                        arcLabelsRadiusOffset={0.5}
                        arcLabelsSkipAngle={arcLabelsSkipAngle}
                        arcLabelsTextColor='#111'
                        isInteractive={true}
                        transitionMode={'startAngle'}
                        motionConfig={'slow'}
                        sortByValue={false}
                        onClick={(data) => {
                            handleClick(data)
                        }}
                        onMouseEnter={(_datum, event) => {
                            handleMouseEnter(_datum, event)
                        }}

                        tooltip={(datum) => {
                            const label = datum.datum.arc.angleDeg > arcLinkLabelsSkipAngle
                                ? datum.datum.label + ': '
                                : datum.datum.label + ': '
                            const value = datum.datum.value
                            return (
                                <div
                                    style={{
                                        fontSize: '0.8rem',
                                        background: '#555',
                                        padding: '3px 4px',
                                        color: '#ddd',
                                        borderRadius: '5px',
                                        display: (smallWindow || touchTap) ? 'none' : 'block'
                                    }}
                                >
                                    <div>{label}{value}</div>
                                </div>
                            )
                        }}
                    />
                </div>
                <div style={{
                    width: '100%',
                    position: 'absolute',
                    top: chartHeight / 2 - 14,
                    left: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    fontSize: '1.1rem'
                }}>
                    {dataset.parent &&
                        <Link onClick={handleBack}
                              style={{color: '#ccc', cursor: 'pointer', fontSize: backLinkSize}}>back</Link>
                    }
                </div>
            </div>

        </React.Fragment>
    )
}

function isTouchDevice() {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0) ||
        window.matchMedia('(pointer: coarse)').matches)
}
