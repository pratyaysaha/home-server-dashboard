import { MetricPoint } from "./global"

export type MetricsHistory = {
    cpu: MetricPoint[]
    memory: MetricPoint[]
    disk: MetricPoint[]
    load: MetricPoint[]
}