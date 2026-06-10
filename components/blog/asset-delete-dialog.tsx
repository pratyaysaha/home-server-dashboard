"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Trash2 } from "lucide-react";
import { BlogAsset } from "@/types/blog";
import { useDeleteBlogAsset } from "@/hooks/useBlog";
import { useToast } from "@/components/ui/toast";

interface DeleteAssetDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    asset: BlogAsset | null;
}

export default function DeleteAssetDialog({
    open,
    onOpenChange,
    asset,
}: DeleteAssetDialogProps) {
    const { showToast } = useToast();

    const { mutate, isPending } = useDeleteBlogAsset();

    if (!asset) return null;

    const handleDelete = () => {
        mutate(
            {
                assetId: asset.asset_id,
                projectId: asset.project_id,
            },
            {
                onSuccess: () => {
                    showToast({
                        title: "Asset deleted",
                        description:
                            "The asset has been removed successfully.",
                        variant: "success",
                    });

                    onOpenChange(false);
                },

                onError: () => {
                    showToast({
                        title: "Delete failed",
                        description:
                            "Unable to delete the asset.",
                        variant: "error",
                    });
                },
            }
        );
    };

    return (
        <AlertDialog
            open={open}
            onOpenChange={(newOpen) => {
                if (isPending) return;

                onOpenChange(newOpen);
            }}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <Trash2 className="h-5 w-5 text-destructive" />
                        Delete Asset
                    </AlertDialogTitle>

                    <AlertDialogDescription asChild>
                        <div className="space-y-4">
                            <p>
                                This action cannot be undone.
                            </p>

                            <div className="rounded-lg border p-3">
                                <p className="font-medium wrap-break-word">
                                    {asset.file_name}
                                </p>

                                <p className="mt-2 text-sm text-muted-foreground">
                                    {asset.asset_type}
                                </p>

                                <p className="mt-2 break-all font-mono text-xs text-muted-foreground">
                                    {asset.asset_id}
                                </p>
                            </div>

                            <p className="text-sm text-destructive">
                                Deleting this asset may affect drafts
                                that reference it.
                            </p>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        disabled={isPending}
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isPending
                            ? "Deleting..."
                            : "Delete Asset"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}