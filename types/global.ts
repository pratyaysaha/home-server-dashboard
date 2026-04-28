export type Service = {
    name: string
    url: string
    status: "UP" | "DOWN"
    latency: number
}

export type MetricPoint = {
    ts: number
    value: number
}