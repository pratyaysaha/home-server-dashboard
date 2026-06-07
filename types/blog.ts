export type BlogProjectStatus = "draft" | "draft_selected" | "published";

export type BlogDraft = {
    draft_id: string;
    project_id?: string;
    markdown?: string;
    content?: string;
    ai_provider?: string;
    ai_model?: string;
    created_at?: string;
    updated_at?: string;
};

export type BlogProject = {
    project_id: string;
    title: string;
    author_name: string;
    status: BlogProjectStatus;
    selected_draft_id: string | null;
    created_at: string;
    updated_at: string;
    drafts?: BlogDraft[];
};

export type BlogPost = {
    post_id: string;
    project_id: string;
    draft_id: string;
    slug: string;
    markdown_path: string;
    published_at: string;
    created_at: string;
};

export type BlogProjectsResponse = {
    projects: BlogProject[];
};

export type BlogPostsResponse = {
    posts: BlogPost[];
};

export type BlogPostResponse = {
    post: BlogPost;
};

export type BlogPostContentResponse = {
    content: string;
};

export type CreateBlogProjectInput = {
    title: string;
    author: string;
};

export type CreateBlogProjectResponse = {
    projectId: string;
};

export type GenerateBlogDraftInput = {
    projectId: string;
    prompt: string;
};

export type GenerateBlogDraftResponse = {
    success: boolean;
    draftId: string;
    aiResponse?: {
        success: boolean;
        content: string;
    };
};

export type UpdateBlogDraftInput = {
    draftId: string;
    markdown: string;
};

export type SelectBlogDraftInput = {
    projectId: string;
    draftId: string;
};

export type PublishBlogProjectInput = {
    projectId: string;
    slug: string;
};

export type PublishBlogProjectResponse = {
    success: boolean;
    postId: string;
    markdownPath: string;
};
