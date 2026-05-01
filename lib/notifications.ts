import { api } from "@/lib/api";

const SUBSCRIPTION_ID_STORAGE_KEY = "notification-subscription-id";
const INITIAL_TEST_DELAY_MS = 1200;
const ALLOWED_DEVICE_TYPES = [
    "prod",
    "test",
    "dev",
    "development",
    "staging",
] as const;

type DeviceType = (typeof ALLOWED_DEVICE_TYPES)[number];

function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = `${base64String}${padding}`
        .replace(/-/g, "+")
        .replace(/_/g, "/");
    const rawData = window.atob(base64);

    return Uint8Array.from(rawData, (char) => char.charCodeAt(0));
}

function getDeviceType(): DeviceType {
    const deviceType = process.env.NEXT_PUBLIC_ENV_TYPE;

    if (!deviceType) {
        throw new Error("NEXT_PUBLIC_ENV_TYPE is not configured");
    }

    if (
        !ALLOWED_DEVICE_TYPES.includes(deviceType as DeviceType)
    ) {
        throw new Error(
            `NEXT_PUBLIC_ENV_TYPE must be one of: ${ALLOWED_DEVICE_TYPES.join(", ")}`,
        );
    }

    return deviceType as DeviceType;
}

export function isNotificationSupported() {
    return (
        typeof window !== "undefined" &&
        window.isSecureContext &&
        "serviceWorker" in navigator &&
        "PushManager" in window &&
        "Notification" in window
    );
}

export async function registerNotificationServiceWorker() {
    await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
    });

    return navigator.serviceWorker.ready;
}

export async function getPushSubscription() {
    const registration = await registerNotificationServiceWorker();
    return registration.pushManager.getSubscription();
}

export async function requestNotificationPermission() {
    return Notification.requestPermission();
}

export async function subscribeToPush() {
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const deviceType = getDeviceType();
    if (!vapidPublicKey) {
        throw new Error("NEXT_PUBLIC_VAPID_PUBLIC_KEY is not configured");
    }

    const registration = await registerNotificationServiceWorker();
    const existingSubscription =
        await registration.pushManager.getSubscription();

    const subscription =
        existingSubscription ??
        (await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        }));
    const response = await api.post("/notification/subscribe", {
        ...JSON.parse(JSON.stringify(subscription)),
        deviceType,
    });

    const subscriptionId = response.data?.subscriptionId;
    if (!subscriptionId) {
        throw new Error("Subscription id missing from subscribe response");
    }

    window.localStorage.setItem(
        SUBSCRIPTION_ID_STORAGE_KEY,
        subscriptionId,
    );

    return {
        subscription,
        subscriptionId,
    };
}

export async function unsubscribeFromPush() {
    const registration = await registerNotificationServiceWorker();
    const existingSubscription =
        await registration.pushManager.getSubscription();

    await existingSubscription?.unsubscribe();
    window.localStorage.removeItem(SUBSCRIPTION_ID_STORAGE_KEY);
}

export function getStoredSubscriptionId() {
    return window.localStorage.getItem(SUBSCRIPTION_ID_STORAGE_KEY);
}

export async function ensureStoredSubscriptionId() {
    const storedSubscriptionId = getStoredSubscriptionId();
    if (storedSubscriptionId) {
        return storedSubscriptionId;
    }

    const existingSubscription = await getPushSubscription();
    if (!existingSubscription) {
        throw new Error("No active push subscription found");
    }

    const { subscriptionId } = await subscribeToPush();
    return subscriptionId;
}

export async function sendNotificationTest(subscriptionId?: string) {
    const resolvedSubscriptionId =
        subscriptionId ?? (await ensureStoredSubscriptionId());

    const response = await api.post("/notification/test", {
        subscriptionId: resolvedSubscriptionId,
    });

    return response.data;
}

export async function sendInitialNotificationTest(subscriptionId: string) {
    await new Promise((resolve) => {
        window.setTimeout(resolve, INITIAL_TEST_DELAY_MS);
    });

    return sendNotificationTest(subscriptionId);
}
