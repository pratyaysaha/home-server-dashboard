"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Trash2 } from "lucide-react";

import { SocialPost } from "@/types/blog";
import { useToast } from "@/components/ui/toast";

import { formatDaysAgo } from "@/helper/common-helper";
import { useDeleteSocialPost } from "@/hooks/useBlog";
import DeleteSocialPostDialog from "./blog-social-post-delete-dialog";
import { useState } from "react";

interface SocialPostCardProps {
    post: SocialPost;
    variantNumber: number;
    onView?: (post: SocialPost) => void;
}

export default function SocialPostCard({
    post,
    variantNumber,
    onView,
}: SocialPostCardProps) {

    const [deleteOpen, setDeleteOpen] = useState<boolean>(false)

    const { showToast } = useToast();
    const {
        mutateAsync: deletePost,
        isPending: isDeleting,
    } = useDeleteSocialPost();

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(
                post.post_content
            );

            showToast({
                title: "Post copied to clipboard",
                variant: "success",
            });
        } catch {
            showToast({
                title: "Failed to copy post",
                variant: "error",
            });
        }
    };

    return (
        <>
            <Card
                className="
                h-full border-border/70 shadow-sm cursor-pointer
            "
                onClick={() => onView?.(post)}
            >
                <CardContent className="flex h-full flex-col p-5">
                    {/* Header */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-lg font-semibold">
                                Option {variantNumber}
                            </h4>

                            <span className="text-xs text-muted-foreground">
                                Generated{" "}
                                <span className="lowercase">{formatDaysAgo(post.created_at)}</span>
                            </span>
                        </div>
                    </div>

                    {/* Content Preview */}
                    <div className="flex-1">
                        <p
                            className="
                            line-clamp-5
                            whitespace-pre-wrap
                            text-sm
                            leading-relaxed
                            text-muted-foreground
                        "
                        >
                            {post.post_content}
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-5 border-t pt-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                className="flex-1"
                                onClick={handleCopy}
                            >
                                <Copy className="h-4 w-4" />
                                Copy
                            </Button>
                            <Button
                                className="flex-1"
                                variant="destructive"
                                disabled={isDeleting}
                                onClick={() => {
                                    setDeleteOpen(true)
                                }}
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <DeleteSocialPostDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                isDeleting={isDeleting}
                onConfirm={async () => {
                    try {
                        await deletePost({
                            socialPostId:
                                post.social_post_id,
                            projectId:
                                post.project_id,
                        });
                        showToast({
                            title:
                                "Social post deleted",
                            variant: "success",
                        });
                        setDeleteOpen(false);
                    } catch {
                        showToast({
                            title:
                                "Failed to delete social post",
                            variant: "error",
                        });
                    }
                }}
            />
        </>
    );
}