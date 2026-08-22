"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
        <Link href={`/blog/${post.slug}`} className="block py-8 group">
            <article
                className={
                    post.previewImage
                        ? "grid items-start gap-5 sm:grid-cols-[minmax(0,1fr)_10rem]"
                        : ""
                }
            >
                <div className="space-y-2">
                    <div className="flex flex-wrap items-center text-xs gap-x-3 gap-y-1 text-white/35">
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
                            {post.tags.map((tag) => (
                                <Hashtag key={tag} hashtag={tag} />
                            ))}
                        </div>
                    )}
                </div>
                {post.previewImage && (
                    <div className="relative overflow-hidden border rounded-lg aspect-[4/3] bg-white/[0.03] border-white/10">
                        <Image
                            src={post.previewImage.src}
                            alt={post.previewImage.alt || ""}
                            fill
                            sizes="(min-width: 640px) 160px, 100vw"
                            className="object-cover"
                        />
                    </div>
                )}
            </article>
        </Link>
    );
}

function PostList({ posts }: { posts: BlogListPost[] }) {
    return (
        <div>
            {posts.map((post, i) => (
                <div key={post.slug}>
                    {i > 0 && <div className="h-px bg-white/[0.06]" />}
                    <PostRow post={post} />
                </div>
            ))}
        </div>
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

    return (
        <div className="space-y-16">
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => setActiveTag(null)}
                        aria-pressed={activeTag === null}
                        className={cn(
                            "rounded-full px-2.5 py-1 text-xs transition-colors duration-200 cursor-pointer",
                            activeTag === null
                                ? "bg-white/15 text-white"
                                : "bg-white/8 text-white/50 hover:text-white/80",
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
                                "rounded-full px-2.5 py-1 text-xs transition-colors duration-200 cursor-pointer",
                                activeTag === tag
                                    ? "bg-white/15 text-white"
                                    : "bg-white/8 text-white/50 hover:text-white/80",
                            )}
                        >
                            #{tag}
                        </button>
                    ))}
                </div>
            )}

            {filteredPosts ? (
                <PostList posts={filteredPosts} />
            ) : (
                <>
                    <Link
                        href={`/blog/${featuredPost.slug}`}
                        className="block group"
                    >
                        <article
                            className={
                                featuredPost.previewImage
                                    ? "grid items-start gap-6 sm:grid-cols-[minmax(0,1fr)_12rem]"
                                    : ""
                            }
                        >
                            <div className="space-y-3">
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
                            </div>
                            {featuredPost.previewImage && (
                                <div className="relative overflow-hidden border rounded-lg aspect-[4/3] bg-white/[0.03] border-white/10">
                                    <Image
                                        src={featuredPost.previewImage.src}
                                        alt={
                                            featuredPost.previewImage.alt || ""
                                        }
                                        fill
                                        sizes="(min-width: 640px) 192px, 100vw"
                                        className="object-cover"
                                    />
                                </div>
                            )}
                        </article>
                    </Link>

                    {restPosts.length > 0 && (
                        <div>
                            <div className="mb-8 flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-white/35">
                                <span>Archive</span>
                                <span className="flex-1 h-px bg-white/10" />
                            </div>
                            <PostList posts={restPosts} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
