'use client'

import {
    AreaChart,
    Area,
    ResponsiveContainer,
} from "recharts"

export function MiniAreaChart({
    data,
    color,
}: {
    data: { value: number }[]
    color: string
}) {
    return (
        <div className="h-12 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        fill={color}
                        fillOpacity={0.15}
                        strokeWidth={2}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}