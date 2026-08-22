import type { Metadata } from "next";
import { AmbientGradient } from "@/components/AmbientGradient";
import BlogList, { type BlogListPost } from "@/app/blog/BlogList";
import { getRedisClient } from "@/utils/redis";
import { fetchBlogPosts } from "@/utils/blog";
import { formatDate } from "@/utils/format";

export const metadata: Metadata = {
    title: "Blog - Ben's Portfolio",
    description: "Blog posts about my projects and experiences.",
    alternates: {
        canonical: "/blog",
        types: {
            "application/rss+xml": "/blog/feed.xml",
        },
    },
    openGraph: {
        title: "Blog - Ben's Portfolio",
        description: "Blog posts about my projects and experiences.",
        url: "/blog",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Blog - Ben's Portfolio",
        description: "Blog posts about my projects and experiences.",
    },
};

async function fetchViewCounts(
    slugs: string[],
): Promise<Record<string, number>> {
    const viewCounts: Record<string, number> = {};
    if (slugs.length === 0) return viewCounts;

    try {
        const client = await getRedisClient();
        const PREFIX = "views:post:";
        const keys = slugs.map((slug) => `${PREFIX}${slug}`);
        const values = await client.mGet(keys);

        slugs.forEach((slug, index) => {
            const raw = values[index];
            const parsed = raw ? Number(raw) : 0;
            viewCounts[slug] = Number.isNaN(parsed) ? 0 : parsed;
        });
    } catch (error) {
        console.error("Failed to fetch view counts", error);
        slugs.forEach((slug) => {
            viewCounts[slug] = 0;
        });
    }
    return viewCounts;
}

export const revalidate = 3600;

export default async function BlogPage() {
    const posts = await fetchBlogPosts();
    const slugs = posts.map((post) => post.slug);
    const viewCounts = await fetchViewCounts(slugs);

    const enhancedPosts: BlogListPost[] = posts.map((post) => ({
        ...post,
        createdFormatted: formatDate(post.created, { year: "numeric", month: "short", day: "numeric" }, "en-CA") ?? "",
        updatedFormatted: formatDate(post.updated, { year: "numeric", month: "short", day: "numeric" }, "en-CA") ?? "",
        views: viewCounts[post.slug] || 0,
    }));

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#050506] text-white">
            {/* Background noir gradient */}
            <div className="absolute inset-0 pointer-events-none bg-noir-gradient" />
            <div className="absolute inset-0 opacity-50 pointer-events-none bg-noir-radial" />

            {/* Per-post ambient splash behind the featured post area */}
            {enhancedPosts[0] && (
                <div className="pointer-events-none absolute inset-x-0 top-0 h-130 opacity-[0.14]">
                    <AmbientGradient seed={enhancedPosts[0].slug} />
                </div>
            )}

            <div className="relative px-6 pt-16 pb-32 mx-auto max-w-175 lg:pt-24">
                {/* Header */}
                <div className="mb-16 space-y-3">
                    <span className="text-xs uppercase tracking-[0.4em] text-white/35">
                        My thoughts and opinions
                    </span>
                    <h1 className="text-4xl font-semibold tracking-tight lg:text-5xl">
                        Blog
                    </h1>
                    <p className="text-base text-white/50">
                        Writing about projects, ideas, and things I find
                        interesting.
                    </p>
                </div>

                <BlogList posts={enhancedPosts} />
            </div>
        </div>
    );
}
