"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useCreateBlogProject } from "@/hooks/useBlog";

export function CreateBlogProjectForm() {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const router = useRouter();
    const createProject = useCreateBlogProject();
    const { showToast } = useToast();

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            const response = await createProject.mutateAsync({
                title: title.trim(),
                author: author.trim(),
            });

            showToast({
                title: "Blog project created",
                description: "You can generate the first draft from the workspace.",
                variant: "success",
            });
            router.push(`/blog/project?projectId=${response.projectId}`);
        } catch (error) {
            console.error(error);
            showToast({
                title: "Project creation failed",
                description: "The blog project API did not accept the request.",
                variant: "error",
            });
        }
    }

    return (
        <section className="mx-auto w-full max-w-2xl space-y-5">
            <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">
                    Create Blog Project
                </h2>
                <p className="text-sm text-muted-foreground">
                    Start with the project metadata. Draft generation happens next.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="border-border/70 shadow-sm">
                    <CardHeader>
                        <CardTitle>Project Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <label className="block space-y-2">
                            <span className="text-sm font-medium">Title</span>
                            <Input
                                value={title}
                                required
                                onChange={(event) => setTitle(event.target.value)}
                                placeholder="Worker Registration"
                            />
                        </label>

                        <label className="block space-y-2">
                            <span className="text-sm font-medium">Author</span>
                            <Input
                                value={author}
                                required
                                onChange={(event) => setAuthor(event.target.value)}
                                placeholder="Pratyay Saha"
                            />
                        </label>
                    </CardContent>
                    <CardFooter className="justify-between gap-3">
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={!title.trim() || !author.trim() || createProject.isPending}
                        >
                            {createProject.isPending ? (
                                <LoaderCircle className="animate-spin" />
                            ) : (
                                <Plus />
                            )}
                            Create Project
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </section>
    );
}
