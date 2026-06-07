"use client";

import { useMemo, useState } from "react";
import { LoaderCircle, Rocket } from "lucide-react";

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { usePublishBlogProject } from "@/hooks/useBlog";
import type { BlogProject } from "@/types/blog";

function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export function PublishBlogDialog({
    project,
    open,
    onOpenChange,
}: {
    project: BlogProject;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [slug, setSlug] = useState(() => slugify(project.title));
    const publishProject = usePublishBlogProject();
    const { showToast } = useToast();
    const isDisabled =
        !slug.trim() || !project.selected_draft_id || project.status === "published";

    const urlPreview = useMemo(() => `/posts/${slugify(slug)}/`, [slug]);

    async function handlePublish() {
        if (isDisabled) {
            return;
        }

        try {
            await publishProject.mutateAsync({
                projectId: project.project_id,
                slug: slugify(slug),
            });

            showToast({
                title: "Blog project published",
                description: "Hugo received the selected draft for publishing.",
                variant: "success",
            });
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            showToast({
                title: "Publish failed",
                description: "The publish API did not complete successfully.",
                variant: "error",
            });
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Publish Draft</AlertDialogTitle>
                    <AlertDialogDescription>
                        Publish the selected draft to Hugo. Published projects are locked until
                        their post is unpublished.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4">
                    <label className="block space-y-2">
                        <span className="text-sm font-medium">Slug</span>
                        <Input
                            value={slug}
                            onChange={(event) => setSlug(event.target.value)}
                            placeholder="worker-registration"
                        />
                    </label>
                    <div className="rounded-lg border border-border/70 bg-muted/30 p-3 text-sm">
                        <span className="text-muted-foreground">URL </span>
                        <span className="font-medium">{urlPreview}</span>
                    </div>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={publishProject.isPending}>
                        Cancel
                    </AlertDialogCancel>
                    <Button
                        disabled={isDisabled || publishProject.isPending}
                        onClick={() => void handlePublish()}
                    >
                        {publishProject.isPending ? (
                            <LoaderCircle className="animate-spin" />
                        ) : (
                            <Rocket />
                        )}
                        Publish
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
