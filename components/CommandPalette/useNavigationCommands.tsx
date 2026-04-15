"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { CommandDescriptor } from "@/types/command";
import { useCommandMenu } from "./CommandProvider";

type BlogPostSummary = {
    slug: string;
    title: string;
    description?: string;
    tags?: string[];
};

const navigationCommands: CommandDescriptor[] = [
    {
        id: "nav-home",
        label: "Home",
        href: "/",
        section: "Navigation",
        keywords: ["root", "landing"],
        meta: "Page",
    },
    {
        id: "nav-projects",
        label: "Projects",
        href: "/projects",
        section: "Navigation",
        keywords: ["portfolio", "work"],
        meta: "Page",
    },
    {
        id: "nav-gallery",
        label: "Gallery",
        href: "/gallery",
        section: "Navigation",
        keywords: ["photos", "images"],
        meta: "Page",
    },
    {
        id: "nav-status",
        label: "Status",
        href: "/status",
        section: "Navigation",
        keywords: ["services", "health", "uptime"],
        meta: "Page",
    },
    {
        id: "nav-resume",
        label: "Resume",
        href: "/resume.pdf",
        section: "Navigation",
        keywords: ["pdf", "download"],
        meta: "Page",
    },
];

function buildBlogView(posts: BlogPostSummary[]) {
    return {
        id: "blog-posts",
        placeholder: "Search blog posts...",
        commands: [
            {
                id: "blog-all-posts-page",
                label: "Open Blog page",
                href: "/blog",
                section: "Blog",
                meta: "Page",
            },
            ...posts.map((post) => ({
                id: `blog-post-${post.slug}`,
                label: post.title,
                description: post.description,
                href: `/blog/${post.slug}`,
                section: "Blog",
                meta: "Post",
                keywords: [post.slug, ...(post.tags ?? [])],
            })),
        ] as CommandDescriptor[],
    };
}

export function useNavigationCommands() {
    const { registerCommands, pushView } = useCommandMenu();
    const pathname = usePathname();
    const router = useRouter();
    const blogPostsRef = useRef<BlogPostSummary[] | null>(null);

    // Pre-fetch blog posts immediately so they're ready when the palette opens
    useEffect(() => {
        void fetch("/api/blog/public")
            .then((res) => res.json())
            .then((posts: BlogPostSummary[]) => {
                blogPostsRef.current = posts;
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        const commands: CommandDescriptor[] = [
            ...navigationCommands,
            {
                id: "nav-blog",
                label: "Blog",
                section: "Navigation",
                keywords: ["posts", "archive", "mdx", "articles", "writing"],
                meta: "Posts",
                closeOnRun: false,
                action: () => {
                    if (blogPostsRef.current !== null) {
                        pushView(buildBlogView(blogPostsRef.current));
                        return;
                    }
                    // Fallback: fetch on demand if pre-fetch hasn't completed
                    void fetch("/api/blog/public")
                        .then((res) => res.json())
                        .then((posts: BlogPostSummary[]) => {
                            blogPostsRef.current = posts;
                            pushView(buildBlogView(posts));
                        })
                        .catch(() => {
                            pushView({
                                id: "blog-posts",
                                placeholder: "Search blog posts...",
                                commands: [
                                    {
                                        id: "blog-posts-error",
                                        label: "Failed to load posts",
                                        section: "Blog",
                                        meta: "Error",
                                    },
                                ],
                            });
                        });
                },
            },
        ].map((command) => {
            const href = command.href;
            const meta = href === pathname ? "Current" : command.meta;
            let action = command.action;
            if (command.id === "nav-resume" && href) {
                action = () => {
                    if (typeof window !== "undefined") {
                        window.open(href, "_blank", "noopener,noreferrer");
                    }
                };
            } else if (!action && href) {
                action = () => {
                    if (href !== pathname) {
                        router.push(href);
                    }
                };
            }
            return {
                ...command,
                meta,
                action,
            };
        });
        const unregister = registerCommands({
            source: "navigation",
            commands,
            replace: true,
        });
        return unregister;
    }, [pathname, registerCommands, router, pushView]);
}
