import { Loader2 } from "lucide-react";

interface FullScreenLoaderProps {
    title?: string;
    height?: string;
}

export default function FullScreenLoader({
    title = "Loading...",
    height = "30vh",
}: FullScreenLoaderProps) {
    return (
        <div
            className="flex w-full items-center justify-center"
            style={{ height }}
        >
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin" />

                <p className="text-sm text-muted-foreground">
                    {title}
                </p>
            </div>
        </div>
    );
}