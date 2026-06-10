"use client";

import Image from "next/image";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TriangleAlert, Check, X } from "lucide-react";
import { BlogAsset } from "@/types/blog";
import { useState } from "react";
import { useUpdateAssetDescription } from "@/hooks/useBlog";
import { useToast } from "../ui/toast";

interface AssetPreviewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    asset: BlogAsset | null;
    imageUrl: string;
    onAddDescription?: (assetId: string) => void;
}

export default function AssetPreviewDialog({
    open,
    onOpenChange,
    asset,
    imageUrl,
}: AssetPreviewDialogProps) {

    const { showToast } = useToast();

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [description, setDescription] = useState<string>(asset?.description ?? "");

    const { mutateAsync: updateAssetDesc } = useUpdateAssetDescription();

    const handleDescriptionEdit = () => {
        if (!isEditing) {
            setIsEditing(true)
            setDescription(asset?.description ?? "")
        }
    }

    const saveDescEdit = async () => {
        try {
            if (asset) {
                await updateAssetDesc({
                    assetId: asset.asset_id,
                    projectId: asset.project_id,
                    description: description
                })
                setIsEditing(false)
                showToast({
                    title: "Asset Description Updated",
                    variant: "success"
                })
            }
        } catch (error) {
            console.error(error)
            showToast({
                title: "Asset Description update failed",
                description: "Please try again or contact admin",
                variant: "error"
            })
        }
    }

    if (!asset) return null;

    const hasDescription =
        !!asset.description && asset.description.trim().length > 0;

    return (
        <Dialog open={open} onOpenChange={(newOpen) => {
            if (!newOpen) {
                setIsEditing(false);
                setDescription("");
            }
            onOpenChange(newOpen);
        }}>
            <DialogContent
                className="
                    w-[95vw]
                    h-[95vh]
                    max-w-[95vw]
                    p-4
                    md:p-6
                    lg:h-[90vh]
                "
                onEscapeKeyDown={(e) => {
                    if (isEditing) {
                        e.preventDefault();
                        setIsEditing(false);
                        setDescription(asset?.description ?? "");
                    }
                }}
            >
                <div className="grid h-full gap-6 min-h-0 lg:grid-cols-[1fr_380px]">
                    {/* Image Preview */}
                    <div className="relative min-h-75 lg:min-h-0 overflow-hidden rounded-xl border bg-muted/20">
                        <Image
                            src={imageUrl}
                            alt={asset.file_name}
                            fill
                            priority
                            className="object-contain"
                        />

                        {!hasDescription && (
                            <div className="absolute top-4 right-4 flex items-center gap-2 rounded-md bg-yellow-500 px-3 py-2 text-black shadow">
                                <TriangleAlert className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                    Missing Description
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div
                        className="
                            flex
                            flex-col
                            overflow-hidden
                            min-h-0
                            border-t pt-4
                            lg:border-t-0
                            lg:border-l
                            lg:pt-0
                            lg:pl-6
                        "
                    >
                        {/* Header */}
                        <div className="space-y-1">
                            <h2 className="line-clamp-2 text-lg font-semibold">
                                {asset.file_name}
                            </h2>

                            <p className="text-sm text-muted-foreground">
                                Asset Preview
                            </p>
                        </div>

                        {/* Scrollable Content */}
                        <div className="mt-6 min-h-0 flex-1 overflow-y-auto space-y-6 pr-1">
                            {/* Status */}
                            <section>
                                <h3 className="mb-2 text-sm font-semibold">
                                    Status
                                </h3>

                                {hasDescription ? (
                                    <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-3">
                                        <p className="text-sm text-green-600">
                                            ✓ Description Available
                                        </p>
                                    </div>
                                ) : (
                                    <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3">
                                        <div className="flex items-center gap-2 text-yellow-600">
                                            <TriangleAlert className="h-4 w-4" />
                                            <span className="text-sm font-medium">
                                                Missing Description
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* Description */}
                            <section onClick={handleDescriptionEdit}>
                                <h3 className="mb-2 text-sm font-semibold">
                                    Description
                                </h3>
                                {isEditing ?
                                    <div>
                                        <textarea
                                            value={description}
                                            onChange={(event) => setDescription(event.target.value)}
                                            placeholder="Describe the asset..."
                                            className="min-h-36 w-full resize-y rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                                        />
                                        <div className="w-full flex justify-end gap-1">
                                            <Button size={"icon-sm"}
                                                onClick={() => {
                                                    saveDescEdit()
                                                }}><Check /></Button>
                                            <Button size={"icon-sm"} variant={"secondary"}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsEditing(false)
                                                }}
                                            ><X /></Button>
                                        </div>
                                    </div> :
                                    hasDescription ? (
                                        <p className="text-sm leading-relaxed text-muted-foreground" >
                                            {asset.description}
                                        </p>
                                    ) : (
                                        <div className="space-y-3">
                                            {
                                                <p className="text-sm text-muted-foreground">
                                                    No description available for this
                                                    asset.
                                                </p>
                                            }
                                        </div>
                                    )
                                }

                            </section>

                            {/* Metadata */}
                            <section>
                                <h3 className="mb-3 text-sm font-semibold">
                                    Metadata
                                </h3>

                                <div className="space-y-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">
                                            Asset Type
                                        </p>
                                        <p className="mt-1">
                                            {asset.asset_type}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-muted-foreground">
                                            Created At
                                        </p>
                                        <p className="mt-1">
                                            {asset.created_at}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-muted-foreground">
                                            Asset ID
                                        </p>
                                        <p className="mt-1 break-all font-mono text-xs">
                                            {asset.asset_id}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-muted-foreground">
                                            File Name
                                        </p>
                                        <p className="mt-1 wrap-break-word">
                                            {asset.file_name}
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog >
    );
}