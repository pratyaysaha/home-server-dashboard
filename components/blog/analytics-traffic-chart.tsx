"use client";

import { useMemo } from "react";

import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    AnalyticsDateRange,
    AnalyticsUnit,
} from "@/types/analytics";

import { useBlogAnalyticsPageViews } from "@/hooks/useAnalytics";

import {
    transformPageViewsToChartData,
} from "@/helper/analytics-helper";

interface AnalyticsTrafficChartProps {
    projectId: string;

    range: AnalyticsDateRange;

    onRangeChange: (
        range: AnalyticsDateRange
    ) => void;

    startAt?: number;
    endAt?: number;
}

const getUnitForRange = (
    range: AnalyticsDateRange
): AnalyticsUnit => {
    switch (range) {
        case "today":
        case "yesterday":
            return "hour";

        case "last7days":
        case "last30days":
        case "last90days":
        case "alltime":
        default:
            return "day";
    }
};

const AnalyticsTrafficChart = ({
    projectId,
    range,
    onRangeChange,
    startAt,
    endAt,
}: AnalyticsTrafficChartProps) => {
    const unit = getUnitForRange(range);

    const { data, isLoading } =
        useBlogAnalyticsPageViews({
            projectId,
            unit,
            startAt,
            endAt,
            timezone:
                Intl.DateTimeFormat().resolvedOptions()
                    .timeZone,
        });

    const chartData = useMemo(
        () => transformPageViewsToChartData(data),
        [data]
    );

    const formatXAxis = (
        value: string,
        unit: AnalyticsUnit
    ) => {
        const date = new Date(value);

        switch (unit) {
            case "hour":
                return date.toLocaleTimeString([], {
                    hour: "numeric",
                });

            case "day":
            default:
                return date.toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                });
        }
    };

    const formatTooltipLabel = (
        value: string,
        unit: AnalyticsUnit
    ) => {
        const date = new Date(value);

        switch (unit) {
            case "hour":
                return date.toLocaleString([], {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                });

            case "day":
            default:
                return date.toLocaleDateString([], {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                });
        }
    };

    if (
        !isLoading &&
        chartData.length === 0
    ) {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>
                        Traffic
                    </CardTitle>

                    <Select
                        value={range}
                        onValueChange={(value) =>
                            onRangeChange(
                                value as AnalyticsDateRange
                            )
                        }
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="today">
                                Today
                            </SelectItem>

                            <SelectItem value="yesterday">
                                Yesterday
                            </SelectItem>

                            <SelectItem value="last7days">
                                Last 7 Days
                            </SelectItem>

                            <SelectItem value="last30days">
                                Last 30 Days
                            </SelectItem>

                            <SelectItem value="last90days">
                                Last 90 Days
                            </SelectItem>

                            <SelectItem value="alltime">
                                All Time
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </CardHeader>

                <CardContent className="flex h-[400px] items-center justify-center text-muted-foreground">
                    No analytics data available
                    for the selected period.
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                    Traffic
                </CardTitle>

                <Select
                    value={range}
                    onValueChange={(value) =>
                        onRangeChange(
                            value as AnalyticsDateRange
                        )
                    }
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="today">
                            Today
                        </SelectItem>

                        <SelectItem value="yesterday">
                            Yesterday
                        </SelectItem>

                        <SelectItem value="last7days">
                            Last 7 Days
                        </SelectItem>

                        <SelectItem value="last30days">
                            Last 30 Days
                        </SelectItem>

                        <SelectItem value="last90days">
                            Last 90 Days
                        </SelectItem>

                        <SelectItem value="alltime">
                            All Time
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>

            <CardContent>
                {isLoading ? (
                    <div className="flex h-[400px] items-center justify-center text-muted-foreground">
                        Loading analytics...
                    </div>
                ) : (
                    <div className="h-[400px]">
                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient
                                        id="pageviews-gradient"
                                        x1="0"
                                        x2="0"
                                        y1="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#3b82f6"
                                            stopOpacity={0.35}
                                        />

                                        <stop
                                            offset="95%"
                                            stopColor="#3b82f6"
                                            stopOpacity={0.02}
                                        />
                                    </linearGradient>

                                    <linearGradient
                                        id="sessions-gradient"
                                        x1="0"
                                        x2="0"
                                        y1="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#10b981"
                                            stopOpacity={0.2}
                                        />

                                        <stop
                                            offset="95%"
                                            stopColor="#10b981"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid
                                    stroke="rgba(148, 163, 184, 0.12)"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="timestamp"
                                    tickLine={false}
                                    axisLine={false}
                                    minTickGap={28}
                                    tick={{
                                        fill: "#94a3b8",
                                        fontSize: 12,
                                    }}
                                    tickFormatter={(
                                        value
                                    ) =>
                                        formatXAxis(
                                            value,
                                            unit
                                        )
                                    }
                                />

                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    width={40}
                                    allowDecimals={
                                        false
                                    }
                                    tick={{
                                        fill: "#94a3b8",
                                        fontSize: 12,
                                    }}
                                />

                                <Tooltip
                                    cursor={{
                                        stroke:
                                            "#3b82f6",
                                        strokeDasharray:
                                            "4 4",
                                    }}
                                    labelFormatter={(
                                        value
                                    ) =>
                                        formatTooltipLabel(
                                            value as string,
                                            unit
                                        )
                                    }
                                    contentStyle={{
                                        backgroundColor:
                                            "#020817",
                                        border:
                                            "1px solid rgba(148, 163, 184, 0.18)",
                                        borderRadius:
                                            "12px",
                                        color:
                                            "#e2e8f0",
                                    }}
                                />

                                <Area
                                    type="linear"
                                    dataKey="pageviews"
                                    name="Pageviews"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    fill="url(#pageviews-gradient)"
                                    dot={false}
                                    activeDot={{
                                        r: 4,
                                    }}
                                />

                                <Area
                                    type="linear"
                                    dataKey="sessions"
                                    name="Sessions"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    fill="url(#sessions-gradient)"
                                    dot={false}
                                    activeDot={{
                                        r: 4,
                                    }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default AnalyticsTrafficChart;