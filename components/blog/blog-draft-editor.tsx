"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { EditorView } from "@codemirror/view";

import {
    Check,
    Columns2,
    Eye,
    FileText,
    ImageIcon,
    LoaderCircle,
    Lock,
    Save,
    SquarePen,
} from "lucide-react";

import { BlogStatusBadge } from "@/components/blog/blog-status-badge";
import { PublishBlogDialog } from "@/components/blog/publish-blog-dialog";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import {
    useBlogProject,
    useSelectBlogDraft,
    useUpdateBlogDraft,
} from "@/hooks/useBlog";
import { cn } from "@/lib/utils";
import type { BlogDraft, BlogProject } from "@/types/blog";
import { MermaidRenderer } from "./mermaid-renderer";
import Image from "next/image";
import { Separator } from "../ui/separator";
import BlogAssetSection from "./blog-asset-section";

type EditorMode = "edit" | "preview" | "split" | "assets";

function getDraftMarkdown(draft: BlogDraft) {
    return draft.markdown ?? draft.content ?? "";
}

function splitFrontmatter(markdownValue: string) {
    const match = markdownValue.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

    if (!match) {
        return {
            frontmatter: "",
            content: markdownValue,
        };
    }

    return {
        frontmatter: match[1],
        content: match[2],
    };
}

export function BlogDraftEditor() {
    const searchParams = useSearchParams();
    const projectId = searchParams.get("projectId") ?? "";
    const draftId = searchParams.get("draftId") ?? "";
    const projectQuery = useBlogProject(projectId);

    if (!projectId || !draftId) {
        return (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                Missing blog project or draft ID.
            </div>
        );
    }

    if (projectQuery.isLoading) {
        return (
            <div className="flex items-center gap-2 rounded-lg border border-border/70 bg-muted/30 p-4 text-sm text-muted-foreground">
                <LoaderCircle className="size-4 animate-spin" />
                Loading draft
            </div>
        );
    }

    const project = projectQuery.data;
    const draft = project?.drafts?.find((item) => item.draft_id === draftId);

    if (!project || !draft || projectQuery.isError) {
        return (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                Could not load this draft.
            </div>
        );
    }

    return (
        <DraftEditorContent
            key={`${draft.draft_id}-${draft.updated_at ?? draft.created_at ?? ""}`}
            project={project}
            draft={draft}
            projectId={projectId}
            draftId={draftId}
            refetchProject={() => void projectQuery.refetch()}
        />
    );
}

function DraftEditorContent({
    project,
    draft,
    projectId,
    draftId,
    refetchProject,
}: {
    project: BlogProject;
    draft: BlogDraft;
    projectId: string;
    draftId: string;
    refetchProject: () => void;
}) {
    const [markdownValue, setMarkdownValue] = useState(() =>
        getDraftMarkdown(draft),
    );
    const [mode, setMode] = useState<EditorMode>("split");
    const [showPublishDialog, setShowPublishDialog] = useState(false);
    const updateDraft = useUpdateBlogDraft();
    const selectDraft = useSelectBlogDraft();
    const { showToast } = useToast();
    const isSelected = project.selected_draft_id === draftId;
    const isPublished = project.status === "published";
    const previewParts = useMemo(
        () => splitFrontmatter(markdownValue),
        [markdownValue],
    );

    async function handleSave() {
        if (isPublished) {
            return;
        }

        try {
            await updateDraft.mutateAsync({
                draftId,
                markdown: markdownValue,
            });

            showToast({
                title: "Draft saved",
                description: "The markdown content was updated.",
                variant: "success",
            });
            refetchProject();
        } catch (error) {
            console.error(error);
            showToast({
                title: "Save failed",
                description: "The draft update API did not complete successfully.",
                variant: "error",
            });
        }
    }

    async function handleSelect() {
        if (isPublished) {
            return;
        }

        try {
            await selectDraft.mutateAsync({
                projectId,
                draftId,
            });

            showToast({
                title: "Draft selected",
                description: "This draft is now the project's final draft.",
                variant: "success",
            });
            refetchProject();
        } catch (error) {
            console.error(error);
            showToast({
                title: "Select failed",
                description: "The final-draft API did not complete successfully.",
                variant: "error",
            });
        }
    }

    return (
        <section className="space-y-5">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-2xl font-semibold tracking-tight">
                            {project.title}
                        </h2>
                        <BlogStatusBadge status={project.status} />
                        {isSelected ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 px-2 py-0.5 text-xs text-primary">
                                <Check className="size-3" />
                                Selected Draft
                            </span>
                        ) : null}
                    </div>
                    <p className="text-sm text-muted-foreground">Editing {draftId}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" asChild>
                        <Link href={`/blog/project?projectId=${project.project_id}`}>
                            Workspace
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        disabled={isPublished || isSelected || selectDraft.isPending}
                        onClick={() => void handleSelect()}
                    >
                        {selectDraft.isPending ? (
                            <LoaderCircle className="animate-spin" />
                        ) : (
                            <Check />
                        )}
                        Select
                    </Button>
                    <Button
                        variant="outline"
                        disabled={isPublished || updateDraft.isPending}
                        onClick={() => void handleSave()}
                    >
                        {updateDraft.isPending ? (
                            <LoaderCircle className="animate-spin" />
                        ) : (
                            <Save />
                        )}
                        Save
                    </Button>
                    <Button
                        disabled={!project.selected_draft_id || isPublished}
                        onClick={() => setShowPublishDialog(true)}
                    >
                        {isPublished ? <Lock /> : <FileText />}
                        Publish
                    </Button>
                </div>
            </div>

            {isPublished ? (
                <div className="flex items-start gap-3 rounded-lg border border-border/70 bg-muted/30 p-4 text-sm text-muted-foreground">
                    <Lock className="mt-0.5 size-4 text-primary" />
                    Published projects are locked. Unpublish the linked post from the
                    workspace before editing or selecting another draft.
                </div>
            ) : null}

            <div className="flex flex-wrap gap-2">
                {[
                    { value: "edit", label: "Edit", icon: SquarePen },
                    { value: "preview", label: "Preview", icon: Eye },
                    { value: "split", label: "Split", icon: Columns2 },
                    { value: "assets", label: "Assets", icon: ImageIcon, separator: true }
                ].map((item) => {
                    const Icon = item.icon;
                    const isActive = mode === item.value;

                    return (
                        <>
                            {item.separator && <Separator orientation="vertical" />}
                            <Button
                                key={item.value}
                                variant={isActive ? "default" : "outline"}
                                size="sm"
                                onClick={() => setMode(item.value as EditorMode)}
                            >
                                <Icon />
                                {item.label}
                            </Button>
                        </>
                    );
                })}
            </div>

            {mode !== "assets" ? <div
                className={cn(
                    "grid gap-5",
                    mode === "split" ? "xl:grid-cols-2" : "grid-cols-1",
                )}
            >
                {mode !== "preview" ? (
                    <Card className="min-h-155 border-border/70 shadow-sm">
                        <CardHeader>
                            <CardTitle>Markdown Editor</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-hidden rounded-lg border border-border/70">
                                <CodeMirror
                                    value={markdownValue}
                                    theme={vscodeDark}
                                    //height="560px"
                                    editable={!isPublished}
                                    extensions={[
                                        markdown({
                                            base: markdownLanguage,
                                        }),
                                        EditorView.lineWrapping,
                                    ]}
                                    onChange={setMarkdownValue}
                                    basicSetup={{
                                        lineNumbers: true,
                                        foldGutter: true,
                                        highlightActiveLine: true,
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                ) : null}

                {mode !== "edit" ? (
                    <Card className="min-h-155 border-border/70 shadow-sm">
                        <CardHeader>
                            <CardTitle>Live Preview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {previewParts.frontmatter ? (
                                <div className="rounded-lg border border-border/70 bg-muted/30 p-3">
                                    <p className="mb-2 text-xs uppercase text-muted-foreground">
                                        Frontmatter
                                    </p>
                                    <pre className="overflow-auto text-xs">
                                        {previewParts.frontmatter}
                                    </pre>
                                </div>
                            ) : null}

                            <div className="markdown-preview min-h-105 rounded-lg border border-border/70 bg-background p-4">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        img: ({ src, alt }) => {
                                            console.log("IMAGE", src);
                                            if (typeof src === "string" && src.startsWith("asset-")) {
                                                const assetId =
                                                    src.replace("asset-", "");
                                                return (
                                                    <span className="flex justify-center">
                                                        <Image
                                                            src={`${process.env.NEXT_PUBLIC_API_URL}/blog/asset/${assetId}`}
                                                            alt={alt ?? `img-${assetId}`}
                                                            width={800}
                                                            height={450}
                                                            priority
                                                            className="rounded-lg border"
                                                        />
                                                    </span>
                                                );
                                            }
                                            return (
                                                <Image
                                                    src={typeof src === "string" ? src : "/asset"}
                                                    alt={alt ?? `img-random}`}
                                                    width={800}
                                                    height={450}
                                                    priority
                                                    className="max-w-full rounded-lg border"
                                                />
                                            );
                                        },
                                        code({ className, children, ...props }) {
                                            console.log("Classname :: ", className)
                                            const isCodeBlock = !!className;
                                            if (!isCodeBlock) {
                                                return (
                                                    <code
                                                        className="rounded bg-muted px-1 py-0.5 font-mono text-sm"
                                                        {...props}
                                                    >
                                                        {children}
                                                    </code>
                                                );
                                            }
                                            if (className === "language-mermaid") {
                                                return (
                                                    <MermaidRenderer
                                                        chart={String(children)}
                                                    />
                                                );
                                            }

                                            return (
                                                <pre className="overflow-auto rounded-lg border p-3">
                                                    <code className={className}>
                                                        {children}
                                                    </code>
                                                </pre>
                                            );
                                        },
                                    }}
                                >
                                    {previewParts.content || "No markdown content yet."}
                                </ReactMarkdown>
                            </div>
                        </CardContent>
                    </Card>
                ) : null
                }
            </div > :
                <BlogAssetSection
                    projectId={projectId}
                    isPublished={isPublished}
                />
            }

            <PublishBlogDialog
                project={project}
                open={showPublishDialog}
                onOpenChange={setShowPublishDialog}
            />
        </section >
    );
}
