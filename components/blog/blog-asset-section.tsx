"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardAction,
    CardDescription
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { Upload, TriangleAlert, EllipsisVertical, Copy, Trash2 } from "lucide-react";
import { useBlogAssets } from "@/hooks/useBlog";
import Image from "next/image";
import { useState } from "react";
import AssetPreviewDialog from "./asset-preview-dialog";
import AssetUploadDialog from "./asset-upload-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useToast } from "../ui/toast";
import DeleteAssetDialog from "./asset-delete-dialog";


const BlogAssetSection = ({
    projectId,
    isPublished
}: {
    projectId: string,
    isPublished: boolean
}) => {

    const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [uploadOpen, setUploadOpen] = useState(false);
    const [assetDeleteOpen, setAssetDeleteOpen] = useState(false);

    const { data: blogAssetsData } = useBlogAssets(projectId);

    const selectedAsset = blogAssetsData?.assets.find((a) => a.asset_id === selectedAssetId) ?? null;

    const { showToast } = useToast();

    const handleCopyMarkdown = async (assetId: string, fileName: string) => {
        try {
            await navigator.clipboard.writeText(`![${fileName}](asset-${assetId})`);
            showToast({
                title: "Copied to clipboard",
                variant: "success",
            });
        } catch (error) {
            console.error(error);
            showToast({
                title: "Failed to copy",
                variant: "error",
            });
        }
    }

    return (
        <>
            <div className="grid gap-5">
                <Card className="border-border/70 shadow-sm">
                    <CardHeader>
                        <CardTitle>Assets</CardTitle>
                        <CardDescription>Manage images and visual assets associated with this project.</CardDescription>
                        <CardAction>
                            <Button variant={"default"} disabled={isPublished} onClick={() => {
                                setUploadOpen(true)
                            }}><Upload /> Upload</Button>
                        </CardAction>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {
                            blogAssetsData?.assets.length === 0 ?
                                (<span className="text-sm text-muted-foreground">No asset included for this project</span>) :
                                (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                                        {blogAssetsData?.assets.map((asset) => {
                                            const hasDescription =
                                                asset.description && asset.description.trim().length > 0;

                                            return (
                                                <Card
                                                    key={asset.asset_id}
                                                    className="py-0 relative cursor-pointer overflow-hidden"
                                                    onClick={() => {
                                                        setSelectedAssetId(asset.asset_id);
                                                        setPreviewOpen(true);
                                                    }}
                                                >
                                                    <div className="relative">
                                                        <div className="relative aspect-4/3 overflow-hidden rounded-t-xl">
                                                            <Image
                                                                src={`${process.env.NEXT_PUBLIC_API_URL}/blog/asset/${asset.asset_id}`}
                                                                alt={asset.file_name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        {!hasDescription && (
                                                            <div className="absolute top-2 left-2 rounded-full bg-yellow-500 p-1 text-white shadow">
                                                                <TriangleAlert className="h-5 w-5 p-0.5" />
                                                            </div>
                                                        )}
                                                        <div onClick={(e) => e.stopPropagation()}>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <div className="absolute top-2 right-2 rounded-full bg-blue-400 p-1 text-white shadow" onClick={(e) => {
                                                                        e.stopPropagation();
                                                                    }}>
                                                                        <EllipsisVertical className="h-5 w-5 p-0.5" />
                                                                    </div>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="w-48">
                                                                    <DropdownMenuItem onClick={() => {
                                                                        handleCopyMarkdown(asset.asset_id, asset.file_name)
                                                                    }}>
                                                                        <Copy className="mr-2 h-4 w-4" />
                                                                        Copy Markdown
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        className="gap-3 text-destructive focus:text-destructive"
                                                                        onClick={() => {
                                                                            setSelectedAssetId(asset.asset_id)
                                                                            setAssetDeleteOpen(true)
                                                                        }}
                                                                    >
                                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                                        Delete Asset
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </div>

                                                    <CardContent className="p-3 space-y-2">
                                                        <p
                                                            className="text-xs font-medium truncate"
                                                            title={asset.file_name}
                                                        >
                                                            {asset.file_name}
                                                        </p>

                                                        {hasDescription ? (
                                                            <p className="text-sm text-muted-foreground line-clamp-3">
                                                                {asset.description}
                                                            </p>
                                                        ) : (
                                                            <>
                                                                <p className="text-sm text-yellow-600 font-medium">
                                                                    No description
                                                                </p>
                                                            </>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                )
                        }
                    </CardContent>
                </Card>
            </div>
            <AssetPreviewDialog
                open={previewOpen}
                onOpenChange={setPreviewOpen}
                asset={selectedAsset}
                imageUrl={`${process.env.NEXT_PUBLIC_API_URL}/blog/asset/${selectedAsset?.asset_id}`}
            />
            <AssetUploadDialog
                open={uploadOpen}
                onOpenChange={setUploadOpen}
                projectId={projectId}
            />
            <DeleteAssetDialog
                open={assetDeleteOpen}
                onOpenChange={setAssetDeleteOpen}
                asset={selectedAsset}
            />
        </>
    )
}

export default BlogAssetSection;