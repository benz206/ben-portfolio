import type { Metadata } from "next";
import Link from "next/link";
import Hashtag from "@/components/Hashtag";
import ViewCount from "@/components/ViewCount";
import { AmbientGradient } from "@/components/AmbientGradient";
import { getRedisClient } from "@/utils/redis";
import { fetchBlogPosts } from "@/utils/blog";
import { formatDate } from "@/utils/format";

export const metadata: Metadata = {
    title: "Blog - Ben's Portfolio",
    description: "Blog posts about my projects and experiences.",
    alternates: {
        canonical: "/blog",
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

    const enhancedPosts = posts.map((post) => ({
        ...post,
        createdFormatted: formatDate(post.created, { year: "numeric", month: "short", day: "numeric" }, "en-CA") ?? "",
        updatedFormatted: formatDate(post.updated, { year: "numeric", month: "short", day: "numeric" }, "en-CA") ?? "",
        views: viewCounts[post.slug] || 0,
    }));

    const [featuredPost, ...restPosts] = enhancedPosts;

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#050506] text-white">
            {/* Background noir gradient */}
            <div className="absolute inset-0 pointer-events-none bg-noir-gradient" />
            <div className="absolute inset-0 opacity-50 pointer-events-none bg-noir-radial" />

            {/* Per-post ambient splash behind the featured post area */}
            {featuredPost && (
                <div className="pointer-events-none absolute inset-x-0 top-0 h-130 opacity-[0.14]">
                    <AmbientGradient seed={featuredPost.slug} />
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

                {!featuredPost ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <p className="text-lg font-semibold text-white/60">
                            No posts yet, but the notebook is open.
                        </p>
                        <p className="mt-2 text-sm text-white/40">
                            Check back soon for fresh build logs and deep dives.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-16">
                        {/* Featured post */}
                        <Link
                            href={`/blog/${featuredPost.slug}`}
                            className="block group"
                        >
                            <article className="space-y-3">
                                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/35">
                                    <span>Latest</span>
                                    <span className="flex-1 h-px bg-white/10" />
                                </div>
                                <h2 className="text-2xl font-semibold leading-snug tracking-tight transition-colors group-hover:text-white/75 lg:text-3xl">
                                    {featuredPost.title}
                                </h2>
                                {featuredPost.description && (
                                    <p className="text-base leading-relaxed text-white/55">
                                        {featuredPost.description}
                                    </p>
                                )}
                                <div className="flex flex-wrap items-center pt-1 text-sm gap-x-3 gap-y-1 text-white/40">
                                    <time dateTime={featuredPost.updated}>
                                        {featuredPost.updatedFormatted}
                                    </time>
                                    <span aria-hidden="true">·</span>
                                    <ViewCount
                                        slug={featuredPost.slug}
                                        initialViews={featuredPost.views}
                                        showIcon
                                    />
                                    {featuredPost.tags.length > 0 && (
                                        <>
                                            <span aria-hidden="true">·</span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {featuredPost.tags.map(
                                                    (tag) => (
                                                        <Hashtag
                                                            key={tag}
                                                            hashtag={tag}
                                                        />
                                                    ),
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </article>
                        </Link>

                        {/* Archive */}
                        {restPosts.length > 0 && (
                            <div>
                                <div className="mb-8 flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-white/35">
                                    <span>Archive</span>
                                    <span className="flex-1 h-px bg-white/10" />
                                </div>

                                <div>
                                    {restPosts.map((post, i) => (
                                        <div key={post.slug}>
                                            {i > 0 && (
                                                <div className="h-px bg-white/[0.06]" />
                                            )}
                                            <Link
                                                href={`/blog/${post.slug}`}
                                                className="block py-8 group"
                                            >
                                                <article className="space-y-2">
                                                    <div className="flex flex-wrap items-center text-xs gap-x-3 gap-y-1 text-white/35">
                                                        <time
                                                            dateTime={
                                                                post.updated
                                                            }
                                                        >
                                                            {
                                                                post.updatedFormatted
                                                            }
                                                        </time>
                                                        <span aria-hidden="true">
                                                            ·
                                                        </span>
                                                        <ViewCount
                                                            slug={post.slug}
                                                            initialViews={
                                                                post.views
                                                            }
                                                            showIcon
                                                        />
                                                    </div>
                                                    <h3 className="text-lg font-semibold leading-snug transition-colors group-hover:text-white/70">
                                                        {post.title}
                                                    </h3>
                                                    {post.description && (
                                                        <p className="text-sm leading-relaxed line-clamp-2 text-white/50">
                                                            {post.description}
                                                        </p>
                                                    )}
                                                    {post.tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                                            {post.tags.map(
                                                                (tag) => (
                                                                    <Hashtag
                                                                        key={
                                                                            tag
                                                                        }
                                                                        hashtag={
                                                                            tag
                                                                        }
                                                                    />
                                                                ),
                                                            )}
                                                        </div>
                                                    )}
                                                </article>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
