'use client'

import { PowerControl } from "@/components/dashboard/power-control"
import { SystemOverview } from "@/components/dashboard/system-overview"
import { ServicesGrid } from "@/components/dashboard/services-grid"

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            {/* Top section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

                {/* Left */}
                <PowerControl />

                {/* Right */}
                <div className="lg:col-span-2">
                    <SystemOverview />
                </div>
            </div>

            {/* Bottom */}
            <ServicesGrid />
        </div>
    )
}