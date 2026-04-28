import { Service } from "./global"

export type DashboardData = {
    status: {
        server: "online" | "offline"
    }
    metrics: {
        cpu: number
        load: number
        ram: {
            used_gb: number
            total_gb: number
        }
        ssd: {
            used_gb: number
            total_gb: number
        }
        zfs: {
            used_gb: number
            total_gb: number
        }
        temp_c: number
        uptime_sec: number
    }
    services: Service[]
    timestamp: string
}