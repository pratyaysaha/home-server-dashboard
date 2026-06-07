import { Suspense } from "react";

import { BlogProjectWorkspace } from "@/components/blog/blog-project-workspace";

export default function BlogProjectPage() {
    return (
        <Suspense
            fallback={
                <div className="rounded-lg border border-border/70 bg-muted/30 p-4 text-sm text-muted-foreground">
                    Loading blog project
                </div>
            }
        >
            <BlogProjectWorkspace />
        </Suspense>
    );
}
