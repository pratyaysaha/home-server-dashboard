'use client'

import Image from "next/image"
import { Card } from "@/components/ui/card"
import { serviceIcons } from "@/lib/service-icons"

type Service = {
    name: string
    url: string
    status: "UP" | "DOWN"
    latency: number
}

export function ServiceCard({ service }: { service: Service }) {
    const isUp = service.status === "UP"
    const icon = serviceIcons[service.name] || "/services/default.png"

    return (
        <Card className="p-4 bg-card border border-border rounded-xl flex flex-col items-center justify-center gap-3 hover:border-white/10 transition">

            {/* Logo */}
            <div className="relative h-10 w-10">
                <Image
                    src={icon}
                    alt={service.name}
                    fill
                    className="object-contain"
                />
            </div>

            {/* Name */}
            <p className="text-sm font-medium capitalize">
                {service.name}
            </p>

            {/* Status */}
            <div
                className={`text-xs flex items-center gap-1 ${isUp ? "text-green-400" : "text-red-400"
                    }`}
            >
                <span className="text-lg leading-none">●</span>
                {isUp ? "Running" : "Down"}
            </div>

            {/* Latency */}
            {service.status === "UP" && (
                <p className="text-[11px] text-muted-foreground">
                    {service.latency} ms
                </p>
            )}
        </Card>
    )
}