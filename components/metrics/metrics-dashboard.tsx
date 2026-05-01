"use client";

import { useMemo, useState } from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    type TooltipValueType,
    XAxis,
    YAxis,
} from "recharts";
import {
    Activity,
    Cpu,
    HardDrive,
    MemoryStick,
    ServerCrash,
    Thermometer,
} from "lucide-react";

import { useDashboard } from "@/hooks/useDashboard";
import { useMetricsHistory } from "@/hooks/useSystemMetrics";
import { useSystemStore } from "@/store/globalStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type MetricKey = "cpu" | "memory" | "disk" | "load";
type RangeKey = "1h" | "6h" | "24h";

const metricTabs: {
    key: MetricKey;
    label: string;
    color: string;
}[] = [
        { key: "cpu", label: "CPU", color: "#60a5fa" },
        { key: "memory", label: "Memory", color: "#8b5cf6" },
        { key: "disk", label: "Disk", color: "#22c55e" },
        { key: "load", label: "Load", color: "#f59e0b" },
    ];

const rangeTabs: RangeKey[] = ["1h", "6h", "24h"];

function formatTimeLabel(timestamp: number, range: RangeKey) {
    return new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: range === "24h" ? undefined : "2-digit",
        hour12: false,
    }).format(new Date(timestamp * 1000));
}

function formatMetricValue(metric: MetricKey, value: number) {
    if (metric === "memory" || metric === "disk") {
        return `${value.toFixed(0)}%`;
    }

    return `${value.toFixed(0)}%`;
}

function normalizeTooltipValue(value: TooltipValueType | undefined) {
    if (typeof value === "number") {
        return value;
    }

    if (typeof value === "string") {
        const parsedValue = Number(value);
        return Number.isFinite(parsedValue) ? parsedValue : 0;
    }

    return 0;
}

function getMetricTitle(metric: MetricKey) {
    switch (metric) {
        case "cpu":
            return "CPU Usage";
        case "memory":
            return "Memory Usage";
        case "disk":
            return "Disk Usage";
        case "load":
            return "Load Average";
    }
}

function buildSummaryCards(metric: MetricKey, dashboardData: ReturnType<typeof useDashboard>["data"], historyValues: number[]) {
    const metrics = dashboardData?.metrics;

    const averageValue =
        historyValues.length > 0
            ? historyValues.reduce((sum, value) => sum + value, 0) /
            historyValues.length
            : 0;
    const peakValue = historyValues.length > 0 ? Math.max(...historyValues) : 0;

    if (!metrics) {
        return [];
    }

    const memoryFree = Math.max(metrics.ram.total_gb - metrics.ram.used_gb, 0);
    const diskTotal = metrics.ssd.total_gb + metrics.zfs.total_gb;
    const diskUsed = metrics.ssd.used_gb + metrics.zfs.used_gb;
    const diskFree = Math.max(diskTotal - diskUsed, 0);

    switch (metric) {
        case "cpu":
            return [
                { label: "Current Usage", value: `${metrics.cpu}%` },
                { label: "Current Load", value: `${metrics.load}%` },
                { label: "CPU Temp", value: `${metrics.temp_c}°C` },
                { label: "Peak in Window", value: `${peakValue.toFixed(0)}%` },
            ];
        case "memory":
            return [
                { label: "Total Memory", value: `${metrics.ram.total_gb} GB` },
                { label: "Used Memory", value: `${metrics.ram.used_gb} GB` },
                { label: "Free Memory", value: `${memoryFree.toFixed(1)} GB` },
                {
                    label: "Memory Usage",
                    value: `${averageValue.toFixed(0)}%`,
                },
            ];
        case "disk":
            return [
                { label: "Total Disk", value: `${diskTotal} GB` },
                { label: "Used Disk", value: `${diskUsed} GB` },
                { label: "Free Disk", value: `${diskFree.toFixed(1)} GB` },
                {
                    label: "Disk Usage",
                    value: `${averageValue.toFixed(0)}%`,
                },
            ];
        case "load":
            return [
                { label: "Current Load", value: `${metrics.load}%` },
                { label: "CPU Usage", value: `${metrics.cpu}%` },
                { label: "Average Load", value: `${averageValue.toFixed(0)}%` },
                { label: "Peak Load", value: `${peakValue.toFixed(0)}%` },
            ];
    }
}

export function MetricsDashboard() {
    const [metric, setMetric] = useState<MetricKey>("cpu");
    const [range, setRange] = useState<RangeKey>("1h");

    const isOnline = useSystemStore((state) => state.isOnline);
    const { data: dashboardData, error } = useDashboard();
    const { data: historyData, isLoading } = useMetricsHistory(range);

    const activeMetric = metricTabs.find((item) => item.key === metric) ?? metricTabs[0];
    const rawPoints = useMemo(
        () => historyData?.[metric] ?? [],
        [historyData, metric],
    );

    const chartData = useMemo(
        () =>
            rawPoints.map((point) => ({
                time: formatTimeLabel(point.ts, range),
                value: Number(point.value.toFixed(2)),
            })),
        [rawPoints, range],
    );

    const currentValue = chartData.at(-1)?.value ?? 0;
    const averageValue =
        chartData.length > 0
            ? chartData.reduce((sum, point) => sum + point.value, 0) /
            chartData.length
            : 0;
    const summaryCards = buildSummaryCards(
        metric,
        dashboardData,
        rawPoints.map((point) => point.value),
    );

    if (!isOnline || error) {
        return (
            <Card className="border border-border rounded-2xl bg-card">
                <CardContent className="flex min-h-80 flex-col items-center justify-center gap-3 p-8 text-center">
                    <ServerCrash className="size-12 text-red-400" />
                    <div className="space-y-1">
                        <p className="text-base font-medium">Metrics unavailable</p>
                        <p className="text-sm text-muted-foreground">
                            The home server is offline. Bring it back online to view
                            historical metrics.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2">
                    {metricTabs.map((item) => (
                        <Button
                            key={item.key}
                            variant={metric === item.key ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setMetric(item.key)}
                            className="min-w-20"
                        >
                            {item.label}
                        </Button>
                    ))}
                </div>
                <div className="flex flex-wrap gap-2">
                    {rangeTabs.map((item) => (
                        <Button
                            key={item}
                            variant={range === item ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setRange(item)}
                            className="min-w-14"
                        >
                            {item}
                        </Button>
                    ))}
                </div>
            </div>

            <Card className="border border-border rounded-2xl bg-card">
                <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                        <CardTitle>{getMetricTitle(metric)}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Historical {activeMetric.label.toLowerCase()} data for the
                            last {range}.
                        </p>
                    </div>

                    <div className="space-y-1 text-left sm:text-right">
                        <p
                            className="text-3xl font-semibold"
                            style={{ color: activeMetric.color }}
                        >
                            {formatMetricValue(metric, currentValue)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Avg {averageValue.toFixed(1)}%
                        </p>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="h-72 w-full sm:h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient
                                        id={`metrics-gradient-${metric}`}
                                        x1="0"
                                        x2="0"
                                        y1="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor={activeMetric.color}
                                            stopOpacity={0.35}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor={activeMetric.color}
                                            stopOpacity={0.02}
                                        />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid
                                    stroke="rgba(148, 163, 184, 0.12)"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="time"
                                    tickLine={false}
                                    axisLine={false}
                                    minTickGap={28}
                                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    width={40}
                                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                                    tickFormatter={(value) => `${value}%`}
                                />
                                <Tooltip
                                    cursor={{ stroke: activeMetric.color, strokeDasharray: "4 4" }}
                                    contentStyle={{
                                        backgroundColor: "#020817",
                                        border: "1px solid rgba(148, 163, 184, 0.18)",
                                        borderRadius: "12px",
                                        color: "#e2e8f0",
                                    }}
                                    formatter={(value) => [
                                        formatMetricValue(
                                            metric,
                                            normalizeTooltipValue(value),
                                        ),
                                        activeMetric.label,
                                    ]}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={activeMetric.color}
                                    strokeWidth={2}
                                    fill={`url(#metrics-gradient-${metric})`}
                                    dot={false}
                                    activeDot={{ r: 4 }}
                                    isAnimationActive={!isLoading}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                        {summaryCards.map((item) => (
                            <Card
                                key={item.label}
                                className="border border-border/70 bg-background/40"
                            >
                                <CardContent className="space-y-2 p-4">
                                    <p className="text-xs text-muted-foreground">
                                        {item.label}
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {item.value}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Card className="border border-border/70 bg-background/40">
                    <CardContent className="flex items-center gap-3 p-4">
                        <Cpu className="size-5 text-blue-400" />
                        <div>
                            <p className="text-xs text-muted-foreground">CPU</p>
                            <p className="text-sm font-medium">
                                {dashboardData?.metrics.cpu ?? 0}% usage
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border border-border/70 bg-background/40">
                    <CardContent className="flex items-center gap-3 p-4">
                        <MemoryStick className="size-5 text-violet-400" />
                        <div>
                            <p className="text-xs text-muted-foreground">Memory</p>
                            <p className="text-sm font-medium">
                                {dashboardData?.metrics.ram.used_gb ?? 0} GB used
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border border-border/70 bg-background/40">
                    <CardContent className="flex items-center gap-3 p-4">
                        <HardDrive className="size-5 text-green-400" />
                        <div>
                            <p className="text-xs text-muted-foreground">Disk</p>
                            <p className="text-sm font-medium">
                                {(
                                    (dashboardData?.metrics.ssd.used_gb ?? 0) +
                                    (dashboardData?.metrics.zfs.used_gb ?? 0)
                                ).toFixed(1)}{" "}
                                GB used
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border border-border/70 bg-background/40">
                    <CardContent className="flex items-center gap-3 p-4">
                        <Activity className="size-5 text-amber-400" />
                        <div>
                            <p className="text-xs text-muted-foreground">Load</p>
                            <p className="text-sm font-medium">
                                {dashboardData?.metrics.load ?? 0}% current load
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                <Card className="border border-border/70 bg-background/40">
                    <CardContent className="flex items-center gap-3 p-4">
                        <Thermometer className="size-5 text-rose-400" />
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Temperature
                            </p>
                            <p className="text-sm font-medium">
                                {dashboardData?.metrics.temp_c ?? 0}°C CPU temperature
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border border-border/70 bg-background/40">
                    <CardContent className="flex items-center gap-3 p-4">
                        <Activity className="size-5 text-sky-400" />
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Data Window
                            </p>
                            <p className="text-sm font-medium">
                                {chartData.length} points across the last {range}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
