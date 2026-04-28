import { useSystemStore } from "@/store/globalStore"
import { MetricCard } from "./metric-card"
import { Cpu, MemoryStick, Thermometer, HardDrive, Warehouse, SquareKanban, Frown } from "lucide-react"
import { useDashboard } from "@/hooks/useDashboard";
import { useEffect } from "react";
import { Card } from "../ui/card";
import { useMetricsHistory } from "@/hooks/useSystemMetrics";
import { cp } from "fs";

export function SystemOverview() {

    const isOnline = useSystemStore((state) => state.isOnline);
    const setUptime = useSystemStore((state) => state.setUptime)

    const { data, error } = useDashboard();
    const { data: metricsData } = useMetricsHistory("1h");

    const cpuUsage = data?.metrics?.cpu || 0;
    const cpuTemp = data?.metrics?.temp_c || 0;
    const cpuLoad = data?.metrics?.load || 0;
    const ramUsed = data?.metrics?.ram?.used_gb || 0;
    const ramTotal = data?.metrics?.ram?.total_gb || 0;
    const ssdUsed = data?.metrics?.ssd?.used_gb || 0;
    const ssdTotal = data?.metrics?.ssd?.total_gb || 0;
    const zfsUsed = data?.metrics?.zfs?.used_gb || 0;
    const zfsTotal = data?.metrics?.zfs?.total_gb || 0;
    const uptimeSec = data?.metrics?.uptime_sec || 0;

    useEffect(() => {
        setUptime(uptimeSec);
    }, [uptimeSec, setUptime])

    const cpuMetric = metricsData?.cpu || [];
    const loadMetric = metricsData?.load || [];

    return (
        <Card className="bg-card border border-border rounded-2xl p-6">

            <h3 className="text-sm font-medium text-muted-foreground mb-4">
                System Overview
            </h3>

            {isOnline && (<div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                <MetricCard
                    title="CPU Usage"
                    value={`${cpuUsage}%`}
                    icon={Cpu}
                    data={cpuMetric}
                    color="#22c55e"
                />

                <MetricCard
                    title="CPU Temp"
                    value={`${cpuTemp}°C`}
                    icon={Thermometer}
                />

                <MetricCard
                    title="CPU Load"
                    value={`${cpuLoad}%`}
                    icon={SquareKanban}
                    data={loadMetric}
                    color="#E0A458"
                />

                <MetricCard
                    title="RAM Usage"
                    value={`${ramUsed} GB / ${ramTotal} GB`}
                    subtitle={`${ramTotal > 0 ? ((ramUsed / ramTotal) * 100).toFixed(1) : 0}%`}
                    icon={MemoryStick}
                    type="progress"
                    progress={ramTotal > 0 ? (ramUsed / ramTotal) * 100 : 0}

                />

                <MetricCard
                    title="SSD Storage"
                    value={`${ssdUsed} GB / ${ssdTotal} GB`}
                    subtitle={ssdTotal > 0 ? `${((ssdUsed / ssdTotal) * 100).toFixed(1)}%` : "N/A"}
                    icon={HardDrive}
                    type="progress"
                    progress={ssdTotal > 0 ? (ssdUsed / ssdTotal) * 100 : 0}
                />

                <MetricCard
                    title="ZFS Pool"
                    value={`${zfsUsed} GB / ${zfsTotal} GB`}
                    subtitle={zfsTotal > 0 ? `${((zfsUsed / zfsTotal) * 100).toFixed(1)}%` : "N/A"}
                    icon={Warehouse}
                    type="progress"
                    progress={zfsTotal > 0 ? (zfsUsed / zfsTotal) * 100 : 0}
                />

            </div>)}
            {
                (!isOnline || error) && (
                    <div className="flex flex-col items-center justify-center gap-3 py-10">
                        <Frown className="h-12 w-12 text-red-400" />
                        <p className="text-sm text-muted-foreground">
                            Server is offline. Unable to fetch metrics.
                        </p>
                    </div>
                )
            }
        </Card>
    )
}