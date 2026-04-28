'use client'

import { Card } from "@/components/ui/card"
import { Power, PowerOff } from "lucide-react"
import PowerButton from "./power-button"
import { useSystemStore } from "@/store/globalStore"
import { formatUptime } from "@/lib/utils"

export function PowerControl() {
    const isOnline = useSystemStore((state) => state.isOnline)
    const uptime = useSystemStore((state) => state.uptime)
    return (
        <Card className="p-6 bg-card border border-border rounded-2xl">

            <h3 className="text-sm font-medium text-bold mb-4">
                Power Control
            </h3>

            <div className="flex flex-col items-center gap-4">

                {/* Big button */}
                <div className={`h-28 w-28 rounded-full border-2 border-${isOnline ? 'green' : 'red'}-500 flex items-center justify-center`}>
                    {isOnline ? (
                        <Power className="h-10 w-10 text-green-400" />
                    ) : (
                        <PowerOff className="h-10 w-10 text-red-400" />
                    )}
                </div>

                <div className="text-center">
                    <p className={`text-${isOnline ? 'green' : 'red'}-400 font-semibold`}>
                        {isOnline ? "ONLINE" : "OFFLINE"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {isOnline ? "Server is running" : "Server is offline"}
                    </p>
                    {isOnline && uptime !== undefined && (
                        <p className="text-xl font-semibold mt-2">
                            {formatUptime(uptime)}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="grid grid-cols-3 gap-4 w-full pt-4">
                    <PowerButton variant="reboot" disabled={!isOnline} />
                    <PowerButton variant="shutdown" disabled={!isOnline} />
                    <PowerButton variant="start" disabled={isOnline} />
                </div>
            </div>
        </Card >
    )
}