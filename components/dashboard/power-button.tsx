'use client'

import { useEffect, useState } from "react"
import { localClient } from "@/lib/mqtt-local"
import { useSystemStore } from "@/store/globalStore"

import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog"

import { Play, Power, RotateCcwIcon } from "lucide-react"
import { remoteClient } from "@/lib/mqtt-remote"

type Variant = "reboot" | "shutdown" | "start"

const variants = {
    reboot: {
        icon: RotateCcwIcon,
        text: "Reboot",
        styles: "border-blue-500 bg-blue-500/10 text-blue-400",
    },
    shutdown: {
        icon: Power,
        text: "Shutdown",
        styles: "border-red-500 bg-red-500/10 text-red-400",
    },
    start: {
        icon: Play,
        text: "Remote Start",
        styles: "border-green-500 bg-green-500/10 text-green-400",
    },
} as const

function PowerButton({
    variant,
    disabled,
}: {
    variant: Variant
    disabled?: boolean
}) {
    const { icon: Icon, text, styles } = variants[variant]

    const isOnline = useSystemStore((s) => s.isOnline)
    const action = useSystemStore((s) => s.action)
    const startAction = useSystemStore((s) => s.startAction)

    const isProcessing = action === variant

    const [open, setOpen] = useState(false)
    const [confirmed, setConfirmed] = useState(false)

    // ✅ CLOSE dialog when action completes
    useEffect(() => {
        if (!action && confirmed) {
            setOpen(false)
            setConfirmed(false)
        }
    }, [action, confirmed])

    const handleConfirm = () => {
        const localTopic =
            process.env.NEXT_PUBLIC_LOCAL_MQTT_TOPIC || "device/control/test"

        const remoteTopic = process.env.NEXT_PUBLIC_REMOTE_MQTT_TOPIC || "psaha/feeds/server-control-test"

        if (["shutdown", "reboot"].includes(variant)) {
            // For shutdown and reboot, publish to local topic
            localClient.publish(localTopic, variant)
        } else if (variant === "start") {
            // For start, publish to remote topic (Adafruit IO)
            remoteClient.publish(remoteTopic, "START")
        }

        startAction(variant, isOnline)

        setConfirmed(true)
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <button
                    onClick={(e) => {
                        if (disabled || isProcessing) e.preventDefault()
                    }}
                    className={`
                        flex flex-col items-center justify-center 
                        rounded-xl p-4 gap-2 border
                        ${styles}
                        transition-all duration-200
                        hover:scale-105
                        active:scale-95
                        ${disabled && "opacity-40 cursor-not-allowed"}
                        ${isProcessing && "opacity-50 cursor-not-allowed"}
                    `}
                >
                    <Icon className="h-8 w-8" />
                    <div className="text-sm font-medium">{text}</div>
                </button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                {!confirmed ? (
                    <>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm {text}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {variant === "shutdown" && "Power off the server."}
                                {variant === "reboot" && "Restart the server."}
                                {variant === "start" && "Start the server remotely."}
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={(e) => {
                                    e.preventDefault()
                                    handleConfirm()
                                }}
                            >
                                Confirm
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-4 py-6">
                        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />

                        <p className="text-sm text-muted-foreground">
                            {variant === "shutdown" && "Shutting down..."}
                            {variant === "reboot" && "Rebooting..."}
                            {variant === "start" && "Starting..."}
                        </p>

                        <p className="text-xs text-muted-foreground">
                            Waiting for system response...
                        </p>
                    </div>
                )}
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default PowerButton