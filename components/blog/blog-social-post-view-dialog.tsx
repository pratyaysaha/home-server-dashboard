"use client";

import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Copy, Sparkles } from "lucide-react";

import { SocialPost } from "@/types/blog";
import { useToast } from "@/components/ui/toast";

import { formatDaysAgo } from "@/helper/common-helper";
import { useState } from "react";
import GenerateSocialPostDialog from "./blog-social-post-generate-dialog";
import { useGenerateSocialPost } from "@/hooks/useBlog";

interface SocialPostPreviewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    post: SocialPost | null;
}

export default function SocialPostPreviewDialog({
    open,
    onOpenChange,
    post,
}: SocialPostPreviewDialogProps) {

    const [regeneratePost, setRegeneratePost] = useState<SocialPost | null>(null);

    const { showToast } = useToast();

    const {
        mutateAsync: generatePost,
        isPending,
    } = useGenerateSocialPost();

    if (!post) return null;

    const projectId = post.project_id;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(
                post.post_content
            );

            showToast({
                title: "Post copied",
                variant: "success",
            });
        } catch {
            showToast({
                title: "Failed to copy post",
                variant: "error",
            });
        }
    };

    const generatedAgo = formatDaysAgo(post.created_at);

    return (
        <>
            <Dialog
                open={open}
                onOpenChange={onOpenChange}
            >
                <DialogContent
                    className="
                    flex
                    h-[90vh]
                    max-w-5xl
                    flex-col
                    overflow-hidden
                "
                >
                    {/* Header */}
                    <div className="border-b pb-4">
                        <h2 className="text-xl font-semibold">
                            <span className="capitalize">{post.platform}</span>
                            {" "}
                            Social Post
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Generated <span className="lowercase">{generatedAgo}</span>
                        </p>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto py-6 space-y-6">
                        <div className="rounded-lg border bg-muted/20 p-5">
                            <h3 className="mb-3 font-semibold">
                                Generation Prompt
                            </h3>

                            <p
                                className="
                                whitespace-pre-wrap
                                wrap-break-word
                                text-sm
                                text-muted-foreground
                            "
                            >
                                {post.generation_prompt}
                            </p>
                        </div>

                        <div className="rounded-lg border bg-muted/20 p-5">
                            <h3 className="mb-3 font-semibold">
                                Generated Content
                            </h3>

                            <div
                                className="
                                whitespace-pre-wrap
                                wrap-break-word
                                text-sm
                                leading-relaxed
                            "
                            >
                                {post.post_content}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-2 border-t pt-4">
                        <Button
                            variant="secondary"
                            onClick={handleCopy}
                        >
                            <Copy className="h-4 w-4" />
                            Copy Post
                        </Button>

                        <Button onClick={() =>
                            setRegeneratePost(post)
                        }>
                            <Sparkles className="h-4 w-4" />
                            Regenerate
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            <GenerateSocialPostDialog
                key={
                    regeneratePost?.social_post_id
                }
                open={!!regeneratePost}
                onOpenChange={(open) => {
                    if (!open) {
                        setRegeneratePost(null);
                    }
                }}
                initialPlatform={
                    regeneratePost?.platform
                }
                initialPrompt={
                    regeneratePost?.generation_prompt
                }
                lockPlatform
                isGenerating={isPending}
                onGenerate={async (
                    platform,
                    prompt
                ) => {
                    try {
                        await generatePost({
                            projectId,
                            platform,
                            prompt,
                        });

                        showToast({
                            title:
                                "Social post regenerated",
                            variant: "success",
                        });

                        setRegeneratePost(null);
                    } catch {
                        showToast({
                            title:
                                "Failed to regenerate post",
                            variant: "error",
                        });
                    }
                }}
            />
        </>
    );
}