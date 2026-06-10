"use client";

import { useRef, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, X, ImageIcon } from "lucide-react";
import { useUploadProjectAssets } from "@/hooks/useBlog";
import { useToast } from "../ui/toast";

interface AssetUploadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectId: string
}
const SUPPORTED_TYPES = [
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/gif",
];
const MAX_FILES = 10;

export default function AssetUploadDialog({
    open,
    onOpenChange,
    projectId
}: AssetUploadDialogProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<File[]>([]);
    const { showToast } = useToast();

    const { mutateAsync: uploadAssets, isPending } = useUploadProjectAssets();

    const hasSelectedFiles = files.length > 0;

    const addFiles = (incomingFiles: FileList | null) => {
        if (!incomingFiles) return;
        const validFiles = Array.from(incomingFiles).filter((file) =>
            SUPPORTED_TYPES.includes(file.type)
        );
        if (validFiles.length !== incomingFiles.length) {
            showToast({
                title: "Unsupported file type",
                description:
                    "Only PNG, JPG, WEBP and GIF images are allowed.",
                variant: "error",
            });
        }
        setFiles(validFiles.slice(0, MAX_FILES));
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        }

        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const handleUpload = async () => {
        try {
            await uploadAssets({
                projectId,
                files,
            });
            showToast({
                title: "Assets uploaded",
                description: `${files.length} file${files.length > 1 ? "s" : ""
                    } uploaded successfully.`,
                variant: "success",
            });
            setFiles([]);
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            showToast({
                title: "Upload failed",
                description:
                    "Unable to upload assets. Please try again.",
                variant: "error",
            });
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(newOpen) => {
                if (!newOpen) {
                    setFiles([]);
                }

                onOpenChange(newOpen);
            }}
        >
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Upload Assets</DialogTitle>
                    <DialogDescription>
                        Add images to this project&apos;s asset
                        library.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Hidden File Input */}
                    <input
                        ref={inputRef}
                        type="file"
                        multiple
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        className="hidden"
                        onChange={(e) =>
                            addFiles(e.target.files)
                        }
                    />

                    {/* Drop Zone */}
                    {!hasSelectedFiles &&
                        <div
                            onClick={() => {
                                if (!hasSelectedFiles) {
                                    inputRef.current?.click();
                                }
                            }}
                            onDragOver={(e) =>
                                e.preventDefault()
                            }
                            onDrop={(e) => {
                                e.preventDefault();
                                addFiles(e.dataTransfer.files);
                            }}
                            className="
                            flex
                            cursor-pointer
                            flex-col
                            items-center
                            justify-center
                            rounded-xl
                            border-2
                            border-dashed
                            border-border
                            px-6
                            py-14
                            text-center
                            transition-colors
                            hover:border-primary
                        "
                        >
                            <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
                            <h3 className="font-medium">
                                Drag & drop images here
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Or click to browse
                            </p>
                            <div className="mt-4 text-xs text-muted-foreground">
                                PNG • JPG • WEBP • GIF
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground">
                                Maximum {MAX_FILES} files
                            </div>

                        </div>}

                    {/* Selected Files */}
                    {files.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">
                                    Selected Files (
                                    {files.length})
                                </h3>
                            </div>

                            <div className="max-h-72 space-y-2 overflow-y-auto rounded-lg border p-2">
                                {files.map((file, index) => (
                                    <div
                                        key={`${file.name}-${index}`}
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            rounded-md
                                            border
                                            px-3
                                            py-2
                                        "
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <ImageIcon className="h-4 w-4 shrink-0 text-muted-foreground" />

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium">
                                                    {file.name}
                                                </p>

                                                <p className="text-xs text-muted-foreground">
                                                    {formatSize(
                                                        file.size
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <Button
                                            size="icon-sm"
                                            variant="ghost"
                                            onClick={() =>
                                                removeFile(
                                                    index
                                                )
                                            }
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex justify-end gap-2 border-t pt-4">
                        <Button
                            variant="outline"
                            onClick={() => {
                                onOpenChange(false)
                                setFiles([])
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            disabled={files.length === 0 || isPending}
                            onClick={handleUpload}
                        >
                            {isPending
                                ? "Uploading..."
                                : `Upload ${files.length} ${files.length === 1
                                    ? "File"
                                    : "Files"
                                }`}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}