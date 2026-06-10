"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
    Check,
    FileText,
    LoaderCircle,
    Lock,
    PenLine,
    Plus,
    Rocket,
} from "lucide-react";

import { BlogStatusBadge } from "@/components/blog/blog-status-badge";
import { PublishBlogDialog } from "@/components/blog/publish-blog-dialog";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import {
    useBlogPostContent,
    useBlogPosts,
    useBlogProject,
    useGenerateBlogDraft,
    useUnpublishBlogPost,
} from "@/hooks/useBlog";
import type { BlogDraft } from "@/types/blog";
import BlogAssetSection from "./blog-asset-section";

function getDraftLabel(draft: BlogDraft, index: number) {
    return `Draft ${index + 1}`;
}

export function BlogProjectWorkspace() {
    const searchParams = useSearchParams();
    const projectId = searchParams.get("projectId") ?? "";
    const [prompt, setPrompt] = useState("");
    const [showPublishDialog, setShowPublishDialog] = useState(false);
    const projectQuery = useBlogProject(projectId);
    const postsQuery = useBlogPosts();
    const generateDraft = useGenerateBlogDraft();
    const unpublishPost = useUnpublishBlogPost();
    const { showToast } = useToast();

    const project = projectQuery.data;
    const drafts = project?.drafts ?? [];
    const isPublished = project?.status === "published";
    const selectedDraft = drafts.find(
        (draft) => draft.draft_id === project?.selected_draft_id,
    );
    const linkedPost = useMemo(
        () =>
            postsQuery.data?.posts.find(
                (post) => post.project_id === project?.project_id,
            ),
        [postsQuery.data?.posts, project?.project_id],
    );
    const postContentQuery = useBlogPostContent(
        isPublished ? linkedPost?.post_id : undefined,
    );

    async function handleGenerateDraft() {
        if (!project || !prompt.trim() || isPublished) {
            return;
        }

        try {
            const response = await generateDraft.mutateAsync({
                projectId: project.project_id,
                prompt: prompt.trim(),
            });

            showToast({
                title: "Draft generated",
                description: response.draftId,
                variant: "success",
            });
        } catch (error) {
            console.error(error);
            showToast({
                title: "Draft generation failed",
                description: "The AI draft API did not complete successfully.",
                variant: "error",
            });
        }
    }

    async function handleUnpublish() {
        if (!linkedPost) {
            return;
        }

        try {
            await unpublishPost.mutateAsync(linkedPost.post_id);
            showToast({
                title: "Post unpublished",
                description: "The project can be edited again after the API refreshes.",
                variant: "success",
            });
            void projectQuery.refetch();
        } catch (error) {
            console.error(error);
            showToast({
                title: "Unpublish failed",
                description: "The post delete API did not complete successfully.",
                variant: "error",
            });
        }
    }

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

            {isPublished ? (
                <Card className="border-border/70 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="size-4 text-primary" />
                            Published Post
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-3 text-sm sm:grid-cols-2">
                            <div className="rounded-lg border border-border/70 bg-muted/30 p-3">
                                <p className="text-muted-foreground">Slug</p>
                                <p className="font-medium">{linkedPost?.slug ?? "Unknown"}</p>
                            </div>
                            <div className="rounded-lg border border-border/70 bg-muted/30 p-3">
                                <p className="text-muted-foreground">Published</p>
                                <p className="font-medium">
                                    {linkedPost?.published_at ?? "Unknown"}
                                </p>
                            </div>
                        </div>

                        <div className="rounded-lg border border-border/70 bg-muted/30 p-4">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                        Status
                                    </p>
                                    <p className="mt-1 font-medium">Published</p>
                                </div>

                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                        Draft Count
                                    </p>
                                    <p className="mt-1 font-medium">{drafts.length}</p>
                                </div>

                                <div>
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                        Selected Draft
                                    </p>
                                    <p className="mt-1 font-medium">
                                        {selectedDraft
                                            ? getDraftLabel(
                                                selectedDraft,
                                                drafts.findIndex(
                                                    (d) => d.draft_id === selectedDraft.draft_id,
                                                ),
                                            )
                                            : "Unknown"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-wrap justify-between gap-3">
                        <div className="flex gap-2">
                            <Button variant="outline" asChild>
                                <a
                                    href={`${process.env.NEXT_PUBLIC_HUGO_BASE_URL}/posts/${linkedPost?.slug}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <FileText />
                                    Open Blog
                                </a>
                            </Button>

                            {selectedDraft ? (
                                <Button variant="outline" asChild>
                                    <Link
                                        href={`/blog/draft?projectId=${project.project_id}&draftId=${selectedDraft.draft_id}`}
                                    >
                                        <PenLine />
                                        Review Draft
                                    </Link>
                                </Button>
                            ) : null}
                        </div>

                        <Button
                            variant="destructive"
                            disabled={!linkedPost || unpublishPost.isPending}
                            onClick={() => void handleUnpublish()}
                        >
                            {unpublishPost.isPending ? (
                                <LoaderCircle className="animate-spin" />
                            ) : (
                                <Lock />
                            )}
                            Unpublish
                        </Button>
                    </CardFooter>
                </Card>
            ) : (
                <Card className="border-border/70 shadow-sm">
                    <CardHeader>
                        <CardTitle>Prompt</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <textarea
                            value={prompt}
                            onChange={(event) => setPrompt(event.target.value)}
                            placeholder="Describe the blog post you want AI to draft..."
                            className="min-h-36 w-full resize-y rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                        />
                    </CardContent>
                    <CardFooter className="justify-end">
                        <Button
                            disabled={!prompt.trim() || generateDraft.isPending}
                            onClick={() => void handleGenerateDraft()}
                        >
                            {generateDraft.isPending ? (
                                <LoaderCircle className="animate-spin" />
                            ) : (
                                <Plus />
                            )}
                            Generate Draft
                        </Button>
                    </CardFooter>
                </Card>
            )}

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                <Card className="border-border/70 shadow-sm">
                    <CardHeader>
                        <CardTitle>Drafts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {drafts.length === 0 ? (
                            <div className="rounded-lg border border-border/70 bg-muted/30 p-6 text-center text-sm text-muted-foreground">
                                No generated drafts yet.
                            </div>
                        ) : (
                            drafts.map((draft, index) => {
                                const isSelected =
                                    draft.draft_id === project.selected_draft_id;

                                return (
                                    <div
                                        key={draft.draft_id}
                                        className="flex flex-col gap-3 rounded-lg border border-border/70 bg-muted/20 p-3 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="min-w-0 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <FileText className="size-4 text-primary" />
                                                <p className="font-medium">
                                                    {getDraftLabel(draft, index)}
                                                </p>
                                                {isSelected ? (
                                                    <span className="inline-flex items-center gap-1 text-xs text-primary">
                                                        <Check className="size-3" />
                                                        Selected
                                                    </span>
                                                ) : null}
                                            </div>
                                            <p className="line-clamp-2 text-xs text-muted-foreground">
                                                {draft.markdown
                                                    ?.replace(/---[\s\S]*?---/, "")
                                                    .trim()
                                                    .slice(0, 120)}
                                            </p>
                                        </div>

                                        <Button variant="outline" size="sm" asChild>
                                            <Link
                                                href={`/blog/draft?projectId=${project.project_id}&draftId=${draft.draft_id}`}
                                            >
                                                <PenLine />
                                                Open
                                            </Link>
                                        </Button>
                                    </div>
                                );
                            })
                        )}
                    </CardContent>
                </Card>

                <Card className="border-border/70 shadow-sm">
                    <CardHeader>
                        <CardTitle>Selected Draft</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {selectedDraft ? (
                            <>
                                <div className="rounded-lg border border-border/70 bg-muted/30 p-3 text-sm">
                                    <p className="text-muted-foreground">
                                        Current Publishing Candidate
                                    </p>

                                    <p className="mt-1 font-medium">
                                        {getDraftLabel(
                                            selectedDraft,
                                            drafts.findIndex(
                                                (d) => d.draft_id === selectedDraft.draft_id,
                                            ),
                                        )}
                                    </p>

                                    <p className="mt-2 text-xs text-muted-foreground">
                                        Last Updated:
                                        {" "}
                                        {selectedDraft.updated_at ??
                                            selectedDraft.created_at}
                                    </p>
                                </div>
                                <Button variant="outline" className="w-full" asChild>
                                    <Link
                                        href={`/blog/draft?projectId=${project.project_id}&draftId=${selectedDraft.draft_id}`}
                                    >
                                        <PenLine />
                                        Review Draft
                                    </Link>
                                </Button>
                            </>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Select a draft from the editor before publishing.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
            <BlogAssetSection projectId={projectId} isPublished={isPublished} />

            <PublishBlogDialog
                project={project}
                open={showPublishDialog}
                onOpenChange={setShowPublishDialog}
            />
        </section>
    );
}
