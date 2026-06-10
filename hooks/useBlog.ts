"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type {
    BlogAssetsResponse,
    BlogPostContentResponse,
    BlogPostResponse,
    BlogPostsResponse,
    BlogProject,
    BlogProjectsResponse,
    CreateBlogProjectInput,
    CreateBlogProjectResponse,
    DeleteBlogAssetRequest,
    GenerateBlogDraftInput,
    GenerateBlogDraftResponse,
    PublishBlogProjectInput,
    PublishBlogProjectResponse,
    SelectBlogDraftInput,
    UpdateAssetDescriptionRequest,
    UpdateAssetDescriptionResponse,
    UpdateBlogDraftInput,
    UploadedAsset,
    UploadProjectAssetsRequest,
} from "@/types/blog";

export const blogKeys = {
    projects: ["blog", "projects"] as const,
    project: (projectId: string) => ["blog", "project", projectId] as const,
    posts: ["blog", "posts"] as const,
    post: (postId: string) => ["blog", "post", postId] as const,
    postContent: (postId: string) => ["blog", "post", postId, "content"] as const,
    assets : (projectId: string) => ["blog", "assets", projectId] as const
};

export function useBlogProjects() {
    return useQuery<BlogProjectsResponse>({
        queryKey: blogKeys.projects,
        queryFn: async () => {
            const res = await api.get("/blog/projects");
            return res.data;
        },
        refetchOnWindowFocus: true,
        staleTime: 3000,
    });
}

export function useBlogProject(projectId: string, showDetails = true) {
    return useQuery<BlogProject>({
        queryKey: blogKeys.project(projectId),
        enabled: Boolean(projectId),
        queryFn: async () => {
            const res = await api.get(`/blog/project/${projectId}`, {
                params: { showDetails },
            });
            return res.data;
        },
        refetchOnWindowFocus: true,
        staleTime: 3000,
    });
}

export function useBlogPosts() {
    return useQuery<BlogPostsResponse>({
        queryKey: blogKeys.posts,
        queryFn: async () => {
            const res = await api.get("/blog/posts");
            return res.data;
        },
        refetchOnWindowFocus: true,
        staleTime: 3000,
    });
}

export function useBlogPost(postId?: string) {
    return useQuery<BlogPostResponse>({
        queryKey: blogKeys.post(postId ?? ""),
        enabled: Boolean(postId),
        queryFn: async () => {
            const res = await api.get(`/blog/post/${postId}`);
            return res.data;
        },
    });
}

export function useBlogPostContent(postId?: string) {
    return useQuery<BlogPostContentResponse>({
        queryKey: blogKeys.postContent(postId ?? ""),
        enabled: Boolean(postId),
        queryFn: async () => {
            const res = await api.get(`/blog/post/${postId}/content`);
            return res.data;
        },
    });
}

export function useCreateBlogProject() {
    const queryClient = useQueryClient();

    return useMutation<CreateBlogProjectResponse, Error, CreateBlogProjectInput>({
        mutationFn: async (input) => {
            const res = await api.post("/blog/project", input);
            return res.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: blogKeys.projects });
        },
    });
}

export function useGenerateBlogDraft() {
    const queryClient = useQueryClient();

    return useMutation<GenerateBlogDraftResponse, Error, GenerateBlogDraftInput>({
        mutationFn: async ({ projectId, prompt }) => {
            const res = await api.post(`/blog/project/${projectId}/draft`, {
                prompt,
            }, {
                timeout: 60000,
            });
            return res.data;
        },
        onSuccess: (_data, variables) => {
            void queryClient.invalidateQueries({
                queryKey: blogKeys.project(variables.projectId),
            });
            void queryClient.invalidateQueries({ queryKey: blogKeys.projects });
        },
    });
}

export function useUpdateBlogDraft() {
    const queryClient = useQueryClient();

    return useMutation<{ message: string }, Error, UpdateBlogDraftInput>({
        mutationFn: async ({ draftId, markdown }) => {
            const res = await api.put(`/blog/draft/${draftId}`, { markdown });
            return res.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: blogKeys.projects });
            void queryClient.invalidateQueries({ queryKey: ["blog", "project"] });
        },
    });
}

export function useSelectBlogDraft() {
    const queryClient = useQueryClient();

    return useMutation<{ message: string }, Error, SelectBlogDraftInput>({
        mutationFn: async ({ projectId, draftId }) => {
            const res = await api.put(
                `/blog/project/${projectId}/draft/${draftId}/final-draft`,
            );
            return res.data;
        },
        onSuccess: (_data, variables) => {
            void queryClient.invalidateQueries({
                queryKey: blogKeys.project(variables.projectId),
            });
            void queryClient.invalidateQueries({ queryKey: blogKeys.projects });
        },
    });
}

export function usePublishBlogProject() {
    const queryClient = useQueryClient();

    return useMutation<PublishBlogProjectResponse, Error, PublishBlogProjectInput>({
        mutationFn: async ({ projectId, slug }) => {
            const res = await api.post(`/blog/project/${projectId}/publish`, {
                slug,
            });
            return res.data;
        },
        onSuccess: (_data, variables) => {
            void queryClient.invalidateQueries({
                queryKey: blogKeys.project(variables.projectId),
            });
            void queryClient.invalidateQueries({ queryKey: blogKeys.projects });
            void queryClient.invalidateQueries({ queryKey: blogKeys.posts });
        },
    });
}

export function useUnpublishBlogPost() {
    const queryClient = useQueryClient();

    return useMutation<{ message: string }, Error, string>({
        mutationFn: async (postId) => {
            const res = await api.delete(`/blog/post/${postId}`);
            return res.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: blogKeys.projects });
            void queryClient.invalidateQueries({ queryKey: blogKeys.posts });
        },
    });
}

export function useBlogAssets(projectId: string) {
    return useQuery<BlogAssetsResponse>({
        queryKey: blogKeys.assets(projectId),
        queryFn: async () => {
            const res = await api.get(`/blog/project/${projectId}/assets`);
            return res.data;
        },
        refetchOnWindowFocus: true,
        staleTime: 3000,
    });
}

export const updateAssetDescription = async ({
    assetId,
    description,
}: UpdateAssetDescriptionRequest) => {
    const response =
        await api.put<UpdateAssetDescriptionResponse>(
            `/blog/asset/${assetId}/description`,
            {
                description,
            }
        );
    return response.data;
};

export const useUpdateAssetDescription = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateAssetDescription,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["blog-assets"],
            });
            queryClient.invalidateQueries({
                queryKey: blogKeys.assets(variables.projectId)
            });
        },
    });
};


export const uploadProjectAssets = async ({
    projectId,
    files,
}: UploadProjectAssetsRequest): Promise<UploadedAsset[]> => {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append("files", file);
    });
    const response = await api.post<UploadedAsset[]>(
        `/blog/project/${projectId}/assets`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
};

export const useUploadProjectAssets = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: uploadProjectAssets,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: blogKeys.assets(
                    variables.projectId
                ),
            });
        },
    });
};

export const deleteBlogAsset = async (
    assetId: string
): Promise<{ message: string }> => {
    const response = await api.delete(
        `/blog/asset/${assetId}`
    );

    return response.data;
};

export const useDeleteBlogAsset = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            assetId,
        }: DeleteBlogAssetRequest) => {
            return deleteBlogAsset(assetId);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: blogKeys.assets(
                    variables.projectId
                ),
            });
        },
    });
};