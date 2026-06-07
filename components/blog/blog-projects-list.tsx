"use client";

import Link from "next/link";
import { FilePlus2, LoaderCircle, PencilLine } from "lucide-react";

import { BlogStatusBadge } from "@/components/blog/blog-status-badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useBlogProjects } from "@/hooks/useBlog";

export function BlogProjectsList() {
    const { data, isLoading, isError } = useBlogProjects();
    const projects = data?.projects ?? [];

    return (
        <section className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Blog Studio
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Manage AI drafts, select a final version, and publish through Hugo.
                    </p>
                </div>

                <Button asChild>
                    <Link href="/blog/new">
                        <FilePlus2 />
                        New Project
                    </Link>
                </Button>
            </div>

            <Card className="border-border/70 shadow-sm">
                <CardHeader>
                    <CardTitle>Projects</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center gap-2 rounded-lg border border-border/70 bg-muted/30 p-4 text-sm text-muted-foreground">
                            <LoaderCircle className="size-4 animate-spin" />
                            Loading blog projects
                        </div>
                    ) : isError ? (
                        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                            Could not load blog projects.
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="rounded-lg border border-border/70 bg-muted/30 p-6 text-center">
                            <p className="text-sm font-medium">No blog projects yet</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Create a project to start generating drafts.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[680px] text-left text-sm">
                                <thead className="border-b text-xs uppercase text-muted-foreground">
                                    <tr>
                                        <th className="px-3 py-2 font-medium">Title</th>
                                        <th className="px-3 py-2 font-medium">Status</th>
                                        <th className="px-3 py-2 font-medium">Selected Draft</th>
                                        <th className="px-3 py-2 font-medium">Last Updated</th>
                                        <th className="px-3 py-2 text-right font-medium">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/70">
                                    {projects.map((project) => (
                                        <tr key={project.project_id}>
                                            <td className="px-3 py-3 font-medium">
                                                {project.title}
                                            </td>
                                            <td className="px-3 py-3">
                                                <BlogStatusBadge status={project.status} />
                                            </td>
                                            <td className="px-3 py-3 text-muted-foreground">
                                                {project.selected_draft_id ?? "None"}
                                            </td>
                                            <td className="px-3 py-3 text-muted-foreground">
                                                {project.updated_at}
                                            </td>
                                            <td className="px-3 py-3 text-right">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link
                                                        href={`/blog/project?projectId=${project.project_id}`}
                                                    >
                                                        <PencilLine />
                                                        Open
                                                    </Link>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </section>
    );
}
