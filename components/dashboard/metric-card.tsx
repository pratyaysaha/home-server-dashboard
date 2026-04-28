'use client'

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { MiniAreaChart } from "./mini-area-chart"
import { LucideIcon } from "lucide-react"

type MetricType = "chart" | "progress"

export function MetricCard({
    title,
    value,
    subtitle,
    icon: Icon,
    data,
    color = "#22c55e",
    type = "chart",
    progress,
}: {
    title: string
    value: string
    subtitle?: string
    icon?: LucideIcon
    data?: { value: number }[]
    color?: string
    type?: MetricType
    progress?: number
}) {
    return (
        <Card className="p-4 bg-card border border-border rounded-xl flex flex-col justify-between">

            {/* Header */}
            <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{title}</p>
                {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            </div>

            {/* Value */}
            <div className="mt-2">
                <p className="text-xl font-semibold">{value}</p>
                {subtitle && (
                    <p className="text-xs text-muted-foreground mt-1">
                        {subtitle}
                    </p>
                )}
            </div>

            {/* Chart OR Progress */}
            <div className="mt-3">
                {type === "chart" && data && (
                    <MiniAreaChart data={data} color={color} />
                )}

                {type === "progress" && typeof progress === "number" && (
                    <Progress
                        value={progress}
                        className="h-2"
                    />
                )}
            </div>
        </Card>
    )
}