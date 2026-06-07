import { Suspense } from "react";

import { BlogDraftEditor } from "@/components/blog/blog-draft-editor";

export default function BlogDraftPage() {
    return (
        <Suspense
            fallback={
                <div className="rounded-lg border border-border/70 bg-muted/30 p-4 text-sm text-muted-foreground">
                    Loading draft
                </div>
            }
        >
            <BlogDraftEditor />
        </Suspense>
    );
}
