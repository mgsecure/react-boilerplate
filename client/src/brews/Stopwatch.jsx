import React, {useCallback, useEffect, useMemo, useState} from 'react'

export function useStopwatch() {
    const [startTime, setStartTime] = useState(0)
    const [running, setRunning] = useState(false)
    const [accumulatedTime, setAccumulatedTime] = useState(0)
    const [now, setNow] = useState(0)

    const start = useCallback(() => {
        if (running) return
        setStartTime(Date.now())
        setRunning(true)
        setNow(Date.now())
    }, [running])

    const stop = useCallback(() => {
        if (!running) return
        setAccumulatedTime(prev => prev + (Date.now() - startTime))
        setRunning(false)
        setStartTime(0)
        setNow(0)
    }, [running, startTime])

    const reset = useCallback(() => {
        setRunning(false)
        setStartTime(0)
        setAccumulatedTime(0)
        setNow(0)
    }, [])

    useEffect(() => {
        let interval
        if (running) {
            interval = setInterval(() => {
                setNow(Date.now())
            }, 100)
        }
        return () => clearInterval(interval)
    }, [running])

    const duration = useMemo(() => {
        if (!running) return accumulatedTime
        return accumulatedTime + (now - startTime)
    }, [accumulatedTime, running, now, startTime])

    const seconds = (duration / 1000).toFixed(1)

    const formattedTime = useMemo(() => {
        const totalSeconds = Math.floor(duration / 1000)
        const h = Math.floor(totalSeconds / 3600)
        const m = Math.floor((totalSeconds % 3600) / 60)
        const s = totalSeconds % 60
        return [h, m, s].map(v => v < 10 ? '0' + v : v).join(':')
    }, [duration])

    const formattedTimeMS = useMemo(() => {
        const totalMs = Math.floor(duration)
        const h = Math.floor(totalMs / 3600000)
        const m = Math.floor((totalMs % 3600000) / 60000)
        const s = Math.floor((totalMs % 60000) / 1000)
        const ms = Math.floor((totalMs % 1000) / 100)
        const parts = [s].map(v => v < 10 ? '0' + v : v)
        if (m > 0) parts.unshift(m < 10 ? '0' + m : m)
        if (h > 0) parts.unshift(h < 10 ? '0' + h : h)
        return parts.join(':') + '.' + ms
    }, [duration])

    return {
        start,
        stop,
        reset,
        running,
        duration,
        seconds,
        formattedTime,
        formattedTimeMS
    }
}

export default function Stopwatch({onTick}) {
    const watch = useStopwatch()

    useEffect(() => {
        if (onTick) onTick(watch.duration)
    }, [watch.duration, onTick])

    return (
        <span>{watch.formattedTime}</span>
    )
}
