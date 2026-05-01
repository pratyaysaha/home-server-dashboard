'use client'

import { useEffect } from "react"

import { useDashboard } from "@/hooks/useDashboard"
import { useSystemStore } from "@/store/globalStore"

export function DashboardStateSync() {
    const { data } = useDashboard()
    const setUptime = useSystemStore((state) => state.setUptime)

    const uptimeSec = data?.metrics?.uptime_sec

    useEffect(() => {
        if (typeof uptimeSec === "number" && uptimeSec > 0) {
            setUptime(uptimeSec)
        }
    }, [uptimeSec, setUptime])

    return null
}
