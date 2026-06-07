'use client'

import { usePathname } from "next/navigation"
import { RefreshCcw } from "lucide-react"
import { SidebarTrigger } from "../ui/sidebar"
import { useServerStatus } from "@/hooks/userServerStatus"
import { useSystemStore } from "@/store/globalStore"
import { useEffect } from "react"
import { useDashboard } from "@/hooks/useDashboard"
import { useServices } from "@/hooks/useService"

export function TopBar() {
    const pathname = usePathname()
    const setOnline = useSystemStore((state) => state.setOnline)
    const isOnline = useSystemStore((state) => state.isOnline)

    const { data, error, refetch } = useServerStatus();
    const { refetch: refetchDashboard } = useDashboard();
    const { refetch: refetchServices } = useServices();

    useEffect(() => {
        console.log("Server status data:", data, "error:", error);
        if (data && data.status && error === null) {
            setOnline(true)
        } else {
            setOnline(false)
        }
    }, [data, error, setOnline])


    /* ---------------- Route Config ---------------- */
    const config = {
        "/": {
            title: "Dashboard",
            subtitle: "Overview of your home server",
            showStatus: true,
            showRefresh: true,
        },
        "/metrics": {
            title: "Metrics",
            subtitle: "System performance metrics",
            showStatus: false,
            showRefresh: true,
        },
        "/services": {
            title: "Services",
            subtitle: "Running services status",
            showStatus: false,
            showRefresh: true,
        },
        "/controls": {
            title: "Controls",
            subtitle: "Server power management",
            showStatus: true,
            showRefresh: false,
        },
        "/logs": {
            title: "Logs",
            subtitle: "Recent system logs",
            showStatus: false,
            showRefresh: false,
        },
        "/settings": {
            title: "Settings",
            subtitle: "Configure your server",
            showStatus: false,
            showRefresh: false,
        },
        "/blog": {
            title: "Blog Studio",
            subtitle: "AI draft workflow for Hugo posts",
            showStatus: false,
            showRefresh: false,
        },
    }

    // fallback if route not matched
    const current =
        config[pathname as keyof typeof config] ||
        (pathname.startsWith("/blog") ? config["/blog"] : config["/"])

    return (
        <header className="border-b border-border px-4 md:px-6 py-4 space-y-3 md:space-y-0 md:flex md:items-center md:justify-between">

            {/* Left */}
            <div className="flex items-center gap-3">
                <SidebarTrigger className="p-2 rounded-md hover:bg-accent touch-manipulation" />
                {/* Mobile menu trigger */}
                <div>
                    <h1 className="text-lg md:text-xl font-semibold tracking-tight">
                        {current.title}
                    </h1>
                    <p className="text-xs md:text-sm text-muted-foreground">
                        {current.subtitle}
                    </p>
                </div>

            </div>

            {/* Right */}
            <div className="flex items-center justify-between md:justify-end gap-4">

                {/* Status */}
                {current.showStatus && (
                    <div className={`flex items-center gap-2 text-${isOnline ? 'green' : 'red'}-400 text-xs md:text-sm`}>
                        <span className="relative flex h-2 w-2">
                            <span
                                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOnline ? "bg-green-400" : "bg-red-400"
                                    }`}
                            ></span>
                            <span
                                className={`relative inline-flex rounded-full h-2 w-2 ${isOnline ? "bg-green-400" : "bg-red-400"
                                    }`}
                            ></span>
                        </span>

                        <span>{isOnline ? "Online" : "Offline"}</span>
                    </div>
                )}

                {/* Refresh */}
                {current.showRefresh && (
                    <button className="p-2 rounded-md hover:bg-accent transition active:scale-95" onClick={() => {
                        refetch();
                        refetchDashboard();
                        refetchServices();
                    }}>
                        <RefreshCcw className="h-4 w-4" />
                    </button>
                )}
            </div>
        </header>
    )
}
