'use client'

import { ServiceCard } from "./service-card"
import { useSystemStore } from "@/store/globalStore"
import { useServices } from "@/hooks/useService"
import { Frown } from "lucide-react"


export function ServicesGrid() {
    const isOnline = useSystemStore((state) => state.isOnline)
    const { data, error, isLoading } = useServices();

    const services = data?.services || [];

    return (
        <div className="space-y-4">

            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Services</h2>
                <button className="text-sm text-primary hover:underline disabled:opacity-50"
                    disabled={true}
                >
                    View all services
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {
                    (services.length === 0) && (
                        <div className="col-span-full flex flex-col items-center justify-center gap-3 py-10">
                            <Frown className="h-12 w-12 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                No services found
                            </p>
                        </div>
                    )
                }
                {services.map((service) => (
                    <ServiceCard key={service.name} service={{ ...service, status: !isOnline ? "DOWN" : service.status }} />
                ))}
            </div>
        </div>
    )
}