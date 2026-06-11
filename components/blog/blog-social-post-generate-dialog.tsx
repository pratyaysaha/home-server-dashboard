"use client";

import { useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Sparkles } from "lucide-react";
import { getPlatformIcon } from "@/helper/common-helper";

interface GenerateSocialPostDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    initialPlatform?: string;
    initialPrompt?: string;

    lockPlatform?: boolean;

    onGenerate: (
        platform: string,
        prompt: string
    ) => Promise<void>;

    isGenerating?: boolean;
}

export default function GenerateSocialPostDialog({
    open,
    onOpenChange,
    initialPlatform,
    initialPrompt,
    lockPlatform = false,
    onGenerate,
    isGenerating = false,
}: GenerateSocialPostDialogProps) {
    const [platform, setPlatform] = useState(
        initialPlatform ?? "linkedin"
    );
    const [prompt, setPrompt] = useState(
        initialPrompt ?? ""
    );

    const handleSubmit = async () => {
        await onGenerate(
            platform,
            prompt.trim()
        );
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(newOpen) => {
                if (!isGenerating) {
                    onOpenChange(newOpen);
                }
            }}
        >
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {initialPrompt
                            ? "Regenerate Social Post"
                            : "Generate Social Post"}
                    </DialogTitle>

                    <DialogDescription>
                        Generate platform-specific
                        content for your blog post.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-2">
                    <div className="space-y-2">
                        <Label>
                            Platform
                        </Label>

                        <Select
                            value={platform}
                            onValueChange={
                                setPlatform
                            }
                            disabled={
                                lockPlatform
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="linkedin">
                                    {getPlatformIcon("linkedin")}
                                    LinkedIn
                                </SelectItem>
                                <SelectItem value="reddit">
                                    {getPlatformIcon("reddit")}
                                    Reddit
                                </SelectItem>
                                <SelectItem value="twitter">
                                    {getPlatformIcon("twitter")}
                                    Twitter / X
                                </SelectItem>
                                <SelectItem value="facebook">
                                    {getPlatformIcon("facebook")}
                                    Facebook
                                </SelectItem>
                                <SelectItem value="instagram">
                                    {getPlatformIcon("instagram")}
                                    Instagram
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        {lockPlatform && (
                            <p className="text-xs text-muted-foreground">
                                Platform
                                cannot be
                                changed while
                                regenerating.
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>
                            Generation Prompt
                        </Label>

                        <Textarea
                            value={prompt}
                            onChange={(e) =>
                                setPrompt(
                                    e.target.value
                                )
                            }
                            placeholder="Describe how you'd like the social post to be generated..."
                            className="min-h-40 resize-none"
                        />

                        <p className="text-xs text-muted-foreground">
                            Example:
                            Include emojis,
                            make it casual,
                            target enthusiasts.
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-2 border-t pt-4">
                    <Button
                        variant="secondary"
                        onClick={() =>
                            onOpenChange(
                                false
                            )
                        }
                        disabled={
                            isGenerating
                        }
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={
                            handleSubmit
                        }
                        disabled={
                            !prompt.trim() ||
                            isGenerating
                        }
                    >
                        <Sparkles className="h-4 w-4" />

                        {isGenerating
                            ? "Generating..."
                            : initialPrompt
                                ? "Regenerate Post"
                                : "Generate Post"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}