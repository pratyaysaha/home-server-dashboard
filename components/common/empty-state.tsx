import { LucideIcon, Inbox } from "lucide-react";

interface EmptyStateProps {
    title: string;
    description?: string;
    icon?: LucideIcon;
    height?: string;
}

export default function EmptyState({
    title,
    description,
    icon: Icon = Inbox,
    height = "54vh",
}: EmptyStateProps) {
    return (
        <div
            className="flex w-full items-center justify-center"
            style={{ height }}
        >
            <div className="flex max-w-md flex-col items-center text-center">
                <div className="mb-4 rounded-full border p-4">
                    <Icon className="h-10 w-10 text-muted-foreground" />
                </div>

                <h3 className="text-lg font-semibold">
                    {title}
                </h3>

                {description && (
                    <p className="mt-2 text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}