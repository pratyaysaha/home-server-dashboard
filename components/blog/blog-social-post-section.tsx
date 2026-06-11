import { NotepadText, SquarePen } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { useGenerateSocialPost, useProjectSocialPosts } from "@/hooks/useBlog"
import FullScreenLoader from "../common/loader"
import EmptyState from "../common/empty-state"
import { SocialPost } from "@/types/blog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import SocialPostCard from "./blog-social-post-card"
import { useState } from "react"
import SocialPostPreviewDialog from "./blog-social-post-view-dialog"
import { getPlatformIcon } from "@/helper/common-helper"
import { useToast } from "../ui/toast"
import GenerateSocialPostDialog from "./blog-social-post-generate-dialog"

const PLATFORM_ORDER = [
    "linkedin",
    "twitter",
    "reddit",
    "facebook",
];

const BlogSocialMediaPostSection = ({
    projectId,
    isPublished
}: {
    projectId: string,
    isPublished: boolean
}) => {

    const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);

    const [generateOpen, setGenerateOpen] = useState(false);

    const {
        mutateAsync: generatePost,
        isPending,
    } = useGenerateSocialPost();


    const {
        data: socialPostsData,
        isLoading: allSocialPostLoading,
    } = useProjectSocialPosts(projectId);

    const { showToast } = useToast();


    const socialPosts = socialPostsData?.socialPosts ?? [];
    const postsByPlatform = socialPosts.reduce<
        Record<string, SocialPost[]>
    >((acc, post) => {
        if (!acc[post.platform]) {
            acc[post.platform] = [];
        }
        acc[post.platform].push(post);
        return acc;
    }, {});

    const orderedPlatforms = PLATFORM_ORDER.filter(
        (platform) => postsByPlatform[platform]
    );


    return (
        <>
            <div className="grid gap-5">
                <Card className="border-border/70 shadow-sm">
                    <CardHeader>
                        <CardTitle>Social Media Content</CardTitle>
                        <CardDescription>Generate platform-specific content to promote your blog posts.</CardDescription>
                        <CardAction>
                            <Button variant={"default"} disabled={!isPublished} onClick={() => {
                                setGenerateOpen(true)
                            }}><SquarePen /> Generate</Button>
                        </CardAction>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {allSocialPostLoading && (
                            <FullScreenLoader title="Loading all social media posts" />
                        )}
                        {socialPosts.length === 0 && (
                            <EmptyState
                                title="Generate your first social post"
                                description="Turn your blog content into shareable social media posts for multiple platforms."
                                icon={NotepadText} />
                        )}
                        <Accordion type="multiple" defaultValue={orderedPlatforms}>
                            {orderedPlatforms.map(platform => {
                                const posts = postsByPlatform[platform];
                                return (
                                    <AccordionItem
                                        key={platform}
                                        value={platform}
                                    >
                                        <AccordionTrigger
                                            className="rounded-xl border bg-muted/40 px-5 py-4 hover:bg-muted/60 hover:no-underline"
                                        >
                                            <div className="flex w-full items-center justify-between pr-4">
                                                <div className="flex items-center gap-3">
                                                    {getPlatformIcon(platform)}

                                                    <span className="text-lg font-semibold capitalize">
                                                        {platform}
                                                    </span>
                                                </div>

                                                <div
                                                    className="
                                                       rounded-full
                                                        bg-background
                                                        px-3
                                                        py-1
                                                        text-sm
                                                        font-medium
                                                        text-muted-foreground
                                                    "
                                                >
                                                    {posts.length} {posts.length === 1 ? "Post" : "Posts"}
                                                </div>
                                            </div>
                                        </AccordionTrigger>

                                        <AccordionContent className="p-5 h-full">

                                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
                                                {posts.map((post, index) => (

                                                    <SocialPostCard
                                                        key={post.social_post_id}
                                                        variantNumber={index + 1}
                                                        post={post}
                                                        onView={(post) => {
                                                            setSelectedPost(post);
                                                        }}
                                                    />
                                                ))}

                                            </div>

                                        </AccordionContent>
                                    </AccordionItem>
                                )
                            })
                            }
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
            <SocialPostPreviewDialog
                open={!!selectedPost}
                post={selectedPost}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedPost(null);
                    }
                }}
            />
            <GenerateSocialPostDialog
                open={generateOpen}
                onOpenChange={setGenerateOpen}
                isGenerating={isPending}
                onGenerate={async (
                    platform,
                    prompt
                ) => {
                    try {
                        await generatePost({
                            projectId,
                            platform,
                            prompt,
                        });

                        showToast({
                            title:
                                "Social post generated",
                            variant: "success",
                        });

                        setGenerateOpen(false);
                    } catch (error) {
                        console.error(error);

                        showToast({
                            title:
                                "Failed to generate social post",
                            description:
                                "Please try again.",
                            variant: "error",
                        });
                    }
                }}
            />
        </>
    )
}

export default BlogSocialMediaPostSection;