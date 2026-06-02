"use client";

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error";

type ToastItem = {
    id: number;
    title: string;
    description?: string;
    variant: ToastVariant;
};

type ToastContextValue = {
    showToast: (toast: Omit<ToastItem, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    const nextId = useRef(0);

    const dismissToast = useCallback((id: number) => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback(
        ({ title, description, variant }: Omit<ToastItem, "id">) => {
            const id = nextId.current++;

            setToasts((current) => [
                ...current,
                {
                    id,
                    title,
                    description,
                    variant,
                },
            ]);

            window.setTimeout(() => {
                dismissToast(id);
            }, 4000);
        },
        [dismissToast],
    );

    const value = useMemo(
        () => ({
            showToast,
        }),
        [showToast],
    );

    return (
        <ToastContext.Provider value={value}>
            {children}

            <div className="pointer-events-none fixed top-4 right-4 z-50 flex w-full max-w-sm flex-col gap-3 px-4 sm:px-0">
                {toasts.map((toast) => {
                    const isError = toast.variant === "error";

                    return (
                        <div
                            key={toast.id}
                            className={cn(
                                "pointer-events-auto rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm",
                                isError
                                    ? "border-destructive/40 bg-card text-card-foreground"
                                    : "border-primary/30 bg-card text-card-foreground",
                            )}
                        >
                            <div className="flex items-start gap-3">
                                {isError ? (
                                    <AlertCircle className="mt-0.5 size-4 text-destructive" />
                                ) : (
                                    <CheckCircle2 className="mt-0.5 size-4 text-primary" />
                                )}

                                <div className="min-w-0 flex-1 space-y-1">
                                    <p className="text-sm font-medium">{toast.title}</p>
                                    {toast.description ? (
                                        <p className="text-sm text-muted-foreground">
                                            {toast.description}
                                        </p>
                                    ) : null}
                                </div>

                                <button
                                    type="button"
                                    aria-label="Dismiss toast"
                                    className="rounded-md p-1 text-muted-foreground transition hover:bg-accent hover:text-foreground"
                                    onClick={() => dismissToast(toast.id)}
                                >
                                    <X className="size-4" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }

    return context;
}
