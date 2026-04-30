"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, LoaderCircle } from "lucide-react";

import {
    ensureStoredSubscriptionId,
    getPushSubscription,
    isNotificationSupported,
    requestNotificationPermission,
    sendInitialNotificationTest,
    sendNotificationTest,
    subscribeToPush,
    unsubscribeFromPush,
} from "@/lib/notifications";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSystemStore } from "@/store/globalStore";

const DEFAULT_MESSAGE =
    "Enable browser notifications for quick updates from your dashboard.";
const UNSUPPORTED_MESSAGE =
    "Notifications are unavailable in this browser or context. Contact admin for more details.";

export function NotificationSettingsCard() {
    const [enabled, setEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState(DEFAULT_MESSAGE);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

    const isServerOnline = useSystemStore((state) => state.isOnline);
    const isSupported = isNotificationSupported();
    const isBusy = (isSupported && isLoading) || isSaving;
    const isDisabled = isBusy || !isSupported || !isServerOnline;
    const resolvedStatusMessage = !isServerOnline
        ? "Home server is offline. Notification settings are temporarily unavailable."
        : isSupported
            ? statusMessage
            : UNSUPPORTED_MESSAGE;

    useEffect(() => {
        if (!isSupported) {
            return;
        }

        let cancelled = false;

        async function syncSubscriptionState() {
            try {
                const subscription = await getPushSubscription();

                if (!cancelled) {
                    setEnabled(Boolean(subscription));
                    setStatusMessage(
                        subscription
                            ? "Notifications are enabled on this device."
                            : DEFAULT_MESSAGE,
                    );
                }
            } catch (error) {
                console.error(error);
                if (!cancelled) {
                    setStatusMessage(
                        "We could not verify notification support right now. Contact admin for more details.",
                    );
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        void syncSubscriptionState();

        return () => {
            cancelled = true;
        };
    }, [isSupported]);

    async function handleEnableNotifications(nextEnabled: boolean) {
        if (!isSupported) {
            setStatusMessage(UNSUPPORTED_MESSAGE);
            return;
        }

        if (!isServerOnline) {
            setStatusMessage(
                "Home server is offline. Notification settings are temporarily unavailable.",
            );
            return;
        }

        setIsSaving(true);

        try {
            if (!nextEnabled) {
                await unsubscribeFromPush();
                setEnabled(false);
                setStatusMessage("Notifications have been disabled for this device.");
                return;
            }

            const permission = await requestNotificationPermission();
            if (permission !== "granted") {
                setEnabled(false);
                setStatusMessage(
                    "Notification permission was not granted. Contact admin for more details.",
                );
                return;
            }

            const { subscriptionId } = await subscribeToPush();
            await sendTestNotification(subscriptionId, true);
        } catch (error) {
            console.error(error);
            setEnabled(false);
            setStatusMessage("Contact admin for more details.");
        } finally {
            setIsSaving(false);
        }
    }

    async function sendTestNotification(
        subscriptionId?: string,
        isInitialTest = false,
    ) {
        try {
            const resolvedSubscriptionId =
                subscriptionId ?? (await ensureStoredSubscriptionId());

            if (isInitialTest) {
                await sendInitialNotificationTest(resolvedSubscriptionId);
            } else {
                await sendNotificationTest(resolvedSubscriptionId);
            }

            setEnabled(true);
            setStatusMessage(
                "A test notification was sent. Confirm below whether it appeared.",
            );
            setShowConfirmationDialog(true);
        } catch (error) {
            console.error(error);
            setStatusMessage("Contact admin for more details.");
        }
    }

    function handleConfirmation(seen: boolean) {
        setShowConfirmationDialog(false);
        setStatusMessage(
            seen
                ? "Notifications are enabled and the test notification was confirmed."
                : "Contact admin for more details.",
        );
    }

    return (
        <>
            <Card className="border-border/70 shadow-sm">
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                            <CardTitle className="flex items-center gap-2">
                                {enabled ? (
                                    <Bell className="size-4 text-primary" />
                                ) : (
                                    <BellOff className="size-4 text-muted-foreground" />
                                )}
                                Notification Preferences
                            </CardTitle>
                            <CardDescription>
                                Manage browser alerts for this device.
                            </CardDescription>
                        </div>
                        <Switch
                            checked={enabled}
                            disabled={isDisabled}
                            aria-label="Enable notifications"
                            onCheckedChange={handleEnableNotifications}
                        />
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="rounded-lg border border-border/70 bg-muted/30 p-4">
                        <div className="flex items-start gap-3">
                            {isSaving ? (
                                <LoaderCircle className="mt-0.5 size-4 animate-spin text-primary" />
                            ) : enabled ? (
                                <Bell className="mt-0.5 size-4 text-primary" />
                            ) : (
                                <BellOff className="mt-0.5 size-4 text-muted-foreground" />
                            )}

                            <div className="space-y-1">
                                <p className="text-sm font-medium">
                                    Enable Notifications
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {resolvedStatusMessage}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="justify-between gap-3">
                    <p className="text-xs text-muted-foreground">
                        {!isServerOnline
                            ? "Bring the home server back online to update notification settings."
                            : isSupported
                            ? "A secure browser context is required for notifications."
                            : "This browser does not currently expose the required notification APIs."}
                    </p>
                    {enabled && (
                        <Button
                            variant="outline"
                            disabled={!isServerOnline || isSaving}
                            onClick={() => void sendTestNotification()}
                        >
                            Send Test
                        </Button>
                    )}
                </CardFooter>
            </Card>

            <AlertDialog
                open={showConfirmationDialog}
                onOpenChange={setShowConfirmationDialog}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Did the test notification appear?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            If it did not show up on this device, contact admin for
                            more details.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => handleConfirmation(false)}>
                            No
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleConfirmation(true)}>
                            Yes
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
