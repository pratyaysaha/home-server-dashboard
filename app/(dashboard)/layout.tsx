'use client'

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { TopBar } from "@/components/dashboard/topbar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider defaultOpen={true}>
            <AppSidebar />

            <SidebarInset>
                <TopBar />
                {/* Content */}
                <main className="p-4 md:p-6 space-y-6">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}