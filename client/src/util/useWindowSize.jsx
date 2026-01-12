import {useMemo} from 'react'

export default function useWindowSize() {
    let width = undefined,
        timeout = false,
        delay = 250

    function getDimensions() {
        width = window.innerWidth
    }

    window.addEventListener('resize', function () {
        clearTimeout(timeout)
        timeout = setTimeout(getDimensions, delay)
    })

    getDimensions()

    const isMobile = width < 650

    return useMemo(() => ({
        width,
        isMobile,
        flexStyle: !isMobile ? 'flex' : 'block',
        columnStyle: !isMobile
            ? {display: 'flex', flexDirection: 'column'}
            : {display: 'flex', flexDirection: 'row'},
        rowStyle: !isMobile
            ? {display: 'flex', flexDirection: 'row'}
            : {display: 'flex', flexDirection: 'column'}
    }), [isMobile, width])
}