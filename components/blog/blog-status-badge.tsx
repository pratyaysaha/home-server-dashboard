import { Badge } from "@/components/ui/badge";
import type { BlogProjectStatus } from "@/types/blog";

const statusLabels: Record<BlogProjectStatus, string> = {
    draft: "Draft",
    draft_selected: "Draft Selected",
    published: "Published",
};

export function BlogStatusBadge({ status }: { status: BlogProjectStatus }) {
    const variant = status === "published" ? "default" : "outline";

    return <Badge variant={variant}>{statusLabels[status]}</Badge>;
}
