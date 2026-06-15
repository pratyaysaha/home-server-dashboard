"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import {

    LoaderCircle,
    Lock,

    Rocket,
} from "lucide-react";

import { BlogStatusBadge } from "@/components/blog/blog-status-badge";
import { PublishBlogDialog } from "@/components/blog/publish-blog-dialog";
import { Button } from "@/components/ui/button";
import {
    useBlogProject,
} from "@/hooks/useBlog";
import BlogAssetSection from "./blog-asset-section";
import BlogSocialMediaPostSection from "./blog-social-post-section";
import BlogDraftSection from "./blog-draft-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import BlogAnalyticsSection from "./blog-analytics-section";

export function BlogProjectWorkspace() {
    const searchParams = useSearchParams();
    const projectId = searchParams.get("projectId") ?? "";
    const [showPublishDialog, setShowPublishDialog] = useState(false);
    const projectQuery = useBlogProject(projectId);

    const project = projectQuery.data;
    const isPublished = project?.status === "published";

    if (!projectId) {
        return (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                Missing blog project ID.
            </div>
        );
    }

    if (projectQuery.isLoading) {
        return (
            <div className="flex items-center gap-2 rounded-lg border border-border/70 bg-muted/30 p-4 text-sm text-muted-foreground">
                <LoaderCircle className="size-4 animate-spin" />
                Loading blog project
            </div>
        );
    }

    if (!project || projectQuery.isError) {
        return (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                Could not load this blog project.
            </div>
        );
    }

    return (
        <section className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-2xl font-semibold tracking-tight">
                            {project.title}
                        </h2>
                        <BlogStatusBadge status={project.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Author: {project.author_name}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/blog">Back</Link>
                    </Button>
                    <Button
                        disabled={!project.selected_draft_id || isPublished}
                        onClick={() => setShowPublishDialog(true)}
                    >
                        {isPublished ? <Lock /> : <Rocket />}
                        Publish
                    </Button>
                </div>
            </div>


            <Tabs defaultValue="draft" className="space-y-5">
                <TabsList className="h-11">
                    <TabsTrigger value="draft" className="px-5 text-sm">Drafts</TabsTrigger>
                    <TabsTrigger value="asset" className="px-5 text-sm">Assets</TabsTrigger>
                    <TabsTrigger value="social-media-posts" className="px-5 text-sm">Socials</TabsTrigger>
                    <TabsTrigger value="analytics" className="px-5 text-sm">Analytics</TabsTrigger>
                </TabsList>
                <TabsContent value="draft" className="space-y-5" >
                    <BlogDraftSection project={project} isPublished={isPublished} />
                </TabsContent>
                <TabsContent value="asset" className="space-y-5">
                    <BlogAssetSection projectId={projectId} isPublished={isPublished} />
                </TabsContent>
                <TabsContent value="social-media-posts" className="space-y-5">
                    <BlogSocialMediaPostSection projectId={projectId} isPublished={isPublished} />
                </TabsContent>
                <TabsContent value="analytics" className="space-y-5">
                    <BlogAnalyticsSection projectId={projectId} isPublished={isPublished} />
                </TabsContent>
            </Tabs>
            <PublishBlogDialog
                project={project}
                open={showPublishDialog}
                onOpenChange={setShowPublishDialog}
            />
        </section>
    );
}
