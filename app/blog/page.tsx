// Removed animations to avoid client-only framer-motion in server component
import type { Metadata } from "next";
import Link from "next/link";
import Card from "@/components/Card";
import Hashtag from "@/components/Hashtag";
import BlogViewCounter from "@/components/BlogViewCounter";
import type { AmbientVariant } from "@/components/AmbientGradient";
import { getRedisClient } from "@/utils/redis";
import { fetchBlogPosts, type RawBlogMetadata } from "@/utils/blog";

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

const ambientVariants: AmbientVariant[] = [
    "violet",
    "blue",
    "sunset",
    "emerald",
    "tangerine",
    "crimson",
    "amber",
    "aqua",
    "magenta",
    "slate",
    "indigo",
    "rose",
];

function hashString(value: string) {
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
        hash = (hash << 5) - hash + value.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

function selectAmbientVariant(post: RawBlogMetadata): AmbientVariant {
    const seed = `${post.slug}|${post.title}|${post.tags.join(",")}`;
    const hash = hashString(seed);
    return ambientVariants[hash % ambientVariants.length];
}

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

    const enhancedPosts = posts.map((post) => {
        const ambientVariant = selectAmbientVariant(post);
        return {
            ...post,
            createdFormatted: new Date(post.created).toLocaleDateString(
                "en-CA",
                {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                },
            ),
            updatedFormatted: new Date(post.updated).toLocaleDateString(
                "en-CA",
                {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                },
            ),
            ambientVariant,
            views: viewCounts[post.slug] || 0,
        };
    });

    const [featuredPost, ...restPosts] = enhancedPosts;

    return (
        <section className="relative overflow-hidden bg-[#050506] text-white">
            <div className="absolute inset-0 bg-noir-gradient" />
            <div className="absolute inset-0 opacity-70 bg-noir-radial" />
            <div className="relative mx-auto w-11/12 max-w-[1040px] space-y-16 pb-24 pt-16 lg:pb-32 lg:pt-24">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-3">
                        <span className="text-xs uppercase tracking-[0.4em] text-white/40">
                            My thoughts and opinions
                        </span>
                        <h1 className="text-4xl font-semibold lg:text-5xl">
                            Blog
                        </h1>
                    </div>
                    <p className="max-w-md text-sm text-white/60 sm:text-right">
                        Blog posts about my projects and experiences.
                    </p>
                </div>
                {!featuredPost ? (
                    <div className="flex flex-col justify-center items-center h-48 text-center">
                        <p className="text-lg font-semibold text-white/70">
                            No posts yet, but the notebook is open.
                        </p>
                        <p className="mt-2 text-sm text-white/50">
                            Check back soon for fresh build logs and deep dives.
                        </p>
                    </div>
                ) : (
                    <>
                        <Link
                            href={`/blog/${featuredPost.slug}`}
                            className="block group"
                        >
                            <Card
                                variant="minimal"
                                ambient
                                ambientClassName="opacity-30 group-hover:opacity-45 transition-opacity"
                                className="flex flex-col gap-8 p-10 transition-transform group-hover:-translate-y-1 md:flex-row md:items-stretch md:justify-between md:p-12"
                                ambientVariant={featuredPost.ambientVariant}
                            >
                                <div className="space-y-5 md:max-w-2xl">
                                    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/50">
                                        <span>Latest</span>
                                        <span className="flex-1 h-px bg-white/10" />
                                    </div>
                                    <h2 className="text-3xl font-semibold leading-snug transition-colors group-hover:text-white md:text-[2.5rem]">
                                        {featuredPost.title}
                                    </h2>
                                    <p className="text-base text-white/70">
                                        {featuredPost.description ||
                                            "Tap in for the full story."}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-4 items-start md:items-end md:justify-start">
                                    <time
                                        className="text-sm text-white/50"
                                        dateTime={featuredPost.updated}
                                    >
                                        Updated {featuredPost.updatedFormatted}
                                    </time>
                                    <div className="flex flex-wrap gap-2 justify-end items-center mt-auto w-full">
                                        <div className="flex flex-wrap gap-2 justify-end">
                                            {featuredPost.tags.map((tag) => (
                                                <Hashtag
                                                    key={tag}
                                                    hashtag={tag}
                                                />
                                            ))}
                                        </div>
                                        <BlogViewCounter
                                            slug={featuredPost.slug}
                                            initialViews={featuredPost.views}
                                        />
                                    </div>
                                </div>
                            </Card>
                        </Link>
                        {restPosts.length > 0 && (
                            <div className="space-y-10">
                                <div className="flex justify-between items-center text-white/60">
                                    <h3 className="text-sm uppercase tracking-[0.35em]">
                                        Archive
                                    </h3>
                                    <span className="w-24 h-px bg-white/10" />
                                </div>
                                <div className="grid gap-8 md:grid-cols-2">
                                    {restPosts.map((post) => (
                                        <Link
                                            key={post.slug}
                                            href={`/blog/${post.slug}`}
                                            className="block group"
                                        >
                                            <Card
                                                variant="minimal"
                                                ambient
                                                ambientClassName="opacity-20 group-hover:opacity-40 transition-opacity"
                                                className="flex flex-col gap-6 p-8 h-full transition-transform group-hover:-translate-y-1"
                                                ambientVariant={
                                                    post.ambientVariant
                                                }
                                            >
                                                <div className="flex-1 space-y-3">
                                                    <time
                                                        className="text-xs uppercase tracking-[0.2em] text-white/40"
                                                        dateTime={post.updated}
                                                    >
                                                        {post.updatedFormatted}
                                                    </time>
                                                    <h4 className="text-2xl font-semibold text-white transition-colors group-hover:text-blue-100">
                                                        {post.title}
                                                    </h4>
                                                    <p className="text-sm text-white/60">
                                                        {post.description ||
                                                            "Read the full entry."}
                                                    </p>
                                                </div>
                                                <div className="flex flex-wrap gap-2 justify-between items-center">
                                                    {post.tags.length > 0 ? (
                                                        <div className="flex flex-wrap gap-2 text-sm text-white/60">
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
                                                    ) : (
                                                        <div />
                                                    )}
                                                    <BlogViewCounter
                                                        slug={post.slug}
                                                        initialViews={
                                                            post.views
                                                        }
                                                    />
                                                </div>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
