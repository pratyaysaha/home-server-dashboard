'use client'

import { usePathname } from "next/navigation"
import Link from "next/link"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar"

import {
    LayoutDashboard,
    BarChart3,
    Boxes,
    Power,
    FileText,
    Settings,
    Server,
} from "lucide-react"
import { useSystemStore } from "@/store/globalStore"
import { formatUptime } from "@/lib/utils"

const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    // { name: "Metrics", href: "/metrics", icon: BarChart3 },
    // { name: "Services", href: "/services", icon: Boxes },
    // { name: "Controls", href: "/controls", icon: Power },
    // { name: "Logs", href: "/logs", icon: FileText },
    // { name: "Settings", href: "/settings", icon: Settings },
]

export function AppSidebar() {
    const pathname = usePathname()
    const isOnline = useSystemStore((state) => state.isOnline)
    const uptime = useSystemStore((state) => state.uptime)

    return (
        <Sidebar collapsible="offcanvas">

            {/* Header */}
            <SidebarHeader>
                <div className="flex items-center gap-3 p-2">
                    <div>
                        <Server className="text-green-400" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold">Home Server</h1>
                        <p className="text-sm text-muted-foreground">Dashboard</p>
                    </div>

                </div>
            </SidebarHeader>

            {/* Content */}
            <SidebarContent>
                <SidebarMenu>
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive =
                            pathname === item.href ||
                            pathname.startsWith(item.href + "/")

                        return (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton asChild isActive={isActive} className="px-3 py-2.5 rounded-lg">
                                    <Link href={item.href}>
                                        <Icon />
                                        <span>{item.name}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    })}
                </SidebarMenu>
            </SidebarContent>

            {/* Footer */}
            <SidebarFooter>
                <div className="text-sm p-2">
                    <div className={`text-${isOnline ? 'green' : 'red'}-400 font-medium`}>● Server {isOnline ? 'Online' : 'Offline'}</div>
                    {isOnline && uptime !== undefined && (
                        <div className="text-muted-foreground">
                            Uptime: {formatUptime(uptime)}
                        </div>
                    )}
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}