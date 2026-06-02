"use client";

import { useState } from "react";
import { LoaderCircle, RefreshCw, ServerCog } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { usePlexRefresh } from "@/hooks/usePlexRefresh";
import { useSystemStore } from "@/store/globalStore";

const DEFAULT_MESSAGE =
    "Ask Plex to refresh all libraries and pull in newly added media.";

export function PlexSettingsCard() {
    const [statusMessage, setStatusMessage] = useState(DEFAULT_MESSAGE);

    const isServerOnline = useSystemStore((state) => state.isOnline);
    const refreshPlex = usePlexRefresh();
    const { showToast } = useToast();
    const isRefreshing = refreshPlex.isPending;

    async function handleRefresh() {
        if (!isServerOnline) {
            setStatusMessage(
                "Home server is offline. Bring it back online before refreshing Plex.",
            );
            return;
        }

        setStatusMessage("Refreshing Plex libraries...");

        try {
            const response = await refreshPlex.mutateAsync();

            if (response?.status !== 200) {
                showToast({
                    title: "Plex refresh failed",
                    description:
                        "The Plex refresh endpoint responded with an unexpected status.",
                    variant: "error",
                });
                setStatusMessage(
                    "The Plex refresh endpoint responded unexpectedly. Contact admin for more details.",
                );
                return;
            }

            showToast({
                title: "Plex refresh started",
                description:
                    "Plex accepted the refresh request and should begin scanning shortly.",
                variant: "success",
            });
            setStatusMessage(
                "Plex refresh started. Your libraries should begin scanning shortly.",
            );
        } catch (error) {
            console.error(error);
            showToast({
                title: "Plex refresh failed",
                description:
                    "We could not reach the Plex refresh endpoint. Contact admin for more details.",
                variant: "error",
            });
            setStatusMessage(
                "We could not reach the Plex refresh endpoint. Contact admin for more details.",
            );
        }
    }

    return (
        <Card className="border-border/70 shadow-sm">
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                            <ServerCog className="size-4 text-primary" />
                            Plex Library Refresh
                        </CardTitle>
                        <CardDescription>
                            Trigger a full refresh for your Plex media libraries.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="rounded-lg border border-border/70 bg-muted/30 p-4">
                    <div className="flex items-start gap-3">
                        {isRefreshing ? (
                            <LoaderCircle className="mt-0.5 size-4 animate-spin text-primary" />
                        ) : (
                            <RefreshCw className="mt-0.5 size-4 text-primary" />
                        )}

                        <div className="space-y-1">
                            <p className="text-sm font-medium">Refresh all media</p>
                            <p className="text-sm text-muted-foreground">
                                {statusMessage}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                    {!isServerOnline
                        ? "Plex actions are unavailable while the home server is offline."
                        : "This sends a refresh request to the configured Plex API service."}
                </p>
                <Button
                    disabled={!isServerOnline || isRefreshing}
                    onClick={() => void handleRefresh()}
                >
                    {isRefreshing ? (
                        <>
                            <LoaderCircle className="animate-spin" />
                            Refreshing
                        </>
                    ) : (
                        <>
                            <RefreshCw />
                            Refresh Plex
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
