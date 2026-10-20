"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AmbientGradient } from "@/components/AmbientGradient";
import Hashtag from "@/components/Hashtag";
import ViewCount from "@/components/ViewCount";
import { cn } from "@/utils/cn";
import type { RawBlogMetadata } from "@/types";

export type BlogListPost = RawBlogMetadata & {
    createdFormatted: string;
    updatedFormatted: string;
    views: number;
};

function PostRow({ post }: { post: BlogListPost }) {
    return (
        <li>
            <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col items-start md:grid md:grid-cols-[200px_minmax(0,1fr)_160px] md:items-center md:gap-x-6 md:p-4 md:transition-colors md:hover:bg-white/[0.04]"
            >
                <div className="relative w-full overflow-hidden rounded-xl border aspect-[3/2] bg-white/[0.03] border-white/10">
                    {post.previewImage ? (
                        <Image
                            src={post.previewImage.src}
                            alt={post.previewImage.alt || ""}
                            fill
                            sizes="(min-width: 768px) 200px, 50vw"
                            className="object-cover"
                        />
                    ) : (
                        <AmbientGradient seed={post.slug} />
                    )}
                </div>
                <div className="min-w-0">
                    <h3 className="my-3 text-base leading-snug md:my-0 md:text-xl md:leading-[26px] lg:mb-2">
                        {post.title}
                    </h3>
                    {post.description && (
                        <p className="hidden py-1 text-base line-clamp-1 text-white/50 lg:block">
                            {post.description}
                        </p>
                    )}
                </div>
                <div className="relative flex text-sm md:justify-end text-white/40">
                    <div className="flex items-center gap-x-3 transition-opacity lg:group-hover:opacity-0">
                        <time dateTime={post.updated}>
                            {post.updatedFormatted}
                        </time>
                        <span aria-hidden="true">·</span>
                        <ViewCount
                            slug={post.slug}
                            initialViews={post.views}
                            showIcon
                        />
                    </div>
                    <div
                        aria-hidden="true"
                        className="absolute right-0 hidden -translate-y-1/2 opacity-0 transition-opacity top-1/2 text-white lg:block lg:group-hover:opacity-100"
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path
                                d="M4 10h12m0 0l-5-5m5 5l-5 5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>
            </Link>
        </li>
    );
}

function PostList({ posts }: { posts: BlogListPost[] }) {
    return (
        <ul className="grid list-none grid-cols-2 gap-x-4 ml-0 gap-y-6 md:flex md:flex-col md:gap-0 md:divide-y md:divide-white/10 md:border-y md:border-white/10">
            {posts.map((post) => (
                <PostRow key={post.slug} post={post} />
            ))}
        </ul>
    );
}

function FeaturedPost({ post }: { post: BlogListPost }) {
    return (
        <Link href={`/blog/${post.slug}`} className="block group">
            <article
                className="grid grid-cols-1 overflow-hidden border rounded-xl bg-white/[0.03] border-white/10 transition-colors group-hover:bg-white/[0.05] lg:grid-cols-[2fr_3fr]"
            >
                <div className="flex flex-col justify-center order-2 px-5 py-6 lg:order-1 lg:p-10">
                    <div className="flex items-center text-sm uppercase gap-x-2 text-white/40">
                        <span>Latest</span>
                        <span aria-hidden="true">·</span>
                        <time dateTime={post.updated}>
                            {post.updatedFormatted}
                        </time>
                    </div>
                    <h2 className="mt-4 text-[22px] leading-[26px] text-balance md:mt-6 md:text-[25px] md:leading-[30px] lg:text-[28px] lg:leading-[32px]">
                        {post.title}
                    </h2>
                    {post.description && (
                        <p className="mt-4 text-base text-white/55">
                            {post.description}
                        </p>
                    )}
                    <div className="flex flex-wrap items-center mt-6 text-sm gap-x-3 gap-y-2 text-white/40">
                        <ViewCount
                            slug={post.slug}
                            initialViews={post.views}
                            showIcon
                        />
                        {post.tags.map((tag) => (
                            <Hashtag key={tag} hashtag={tag} />
                        ))}
                    </div>
                </div>
                <div className="order-1 w-full lg:order-2 lg:p-3">
                    <div className="relative overflow-hidden aspect-[2/1] lg:rounded-lg">
                        {post.previewImage ? (
                            <Image
                                src={post.previewImage.src}
                                alt={post.previewImage.alt || ""}
                                fill
                                sizes="(min-width: 1024px) 640px, 100vw"
                                className="object-cover"
                            />
                        ) : (
                            <AmbientGradient seed={post.slug} />
                        )}
                    </div>
                </div>
            </article>
        </Link>
    );
}

export default function BlogList({ posts }: { posts: BlogListPost[] }) {
    const [activeTag, setActiveTag] = useState<string | null>(null);

    if (posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-lg font-semibold text-white/60">
                    No posts yet, but the notebook is open.
                </p>
                <p className="mt-2 text-sm text-white/40">
                    Check back soon for fresh build logs and deep dives.
                </p>
            </div>
        );
    }

    const tags = [...new Set(posts.flatMap((post) => post.tags))].sort();
    const [featuredPost, ...restPosts] = posts;
    const filteredPosts = activeTag
        ? posts.filter((post) => post.tags.includes(activeTag))
        : null;
    const listedPosts = filteredPosts ?? restPosts;

    return (
        <div className="space-y-20 lg:space-y-28">
            {!filteredPosts && <FeaturedPost post={featuredPost} />}

            {(listedPosts.length > 0 || tags.length > 0) && (
                <section>
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <h2 className="text-[34px] leading-[38px] md:text-[40px] md:leading-[42px] lg:text-[48px] lg:leading-[50px]">
                            {activeTag ? `#${activeTag}` : "Recently published"}
                        </h2>
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 lg:max-w-[50%] lg:justify-end">
                                <button
                                    type="button"
                                    onClick={() => setActiveTag(null)}
                                    aria-pressed={activeTag === null}
                                    className={cn(
                                        "rounded-md border px-3 py-1.5 text-sm transition-colors duration-200 cursor-pointer",
                                        activeTag === null
                                            ? "border-white/40 text-white"
                                            : "border-white/10 text-white/50 hover:text-white/80",
                                    )}
                                >
                                    All
                                </button>
                                {tags.map((tag) => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => setActiveTag(tag)}
                                        aria-pressed={activeTag === tag}
                                        className={cn(
                                            "rounded-md border px-3 py-1.5 text-sm transition-colors duration-200 cursor-pointer",
                                            activeTag === tag
                                                ? "border-white/40 text-white"
                                                : "border-white/10 text-white/50 hover:text-white/80",
                                        )}
                                    >
                                        #{tag}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="h-10 shrink-0 md:h-12 lg:h-16" />
                    <PostList posts={listedPosts} />
                </section>
            )}
        </div>
    );
}
