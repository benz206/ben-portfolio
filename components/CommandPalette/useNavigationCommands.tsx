"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
    FaHouse,
    FaFolderOpen,
    FaImages,
    FaPenNib,
    FaFileLines,
    FaRegNewspaper,
} from "react-icons/fa6";
import { FiActivity, FiBookOpen } from "react-icons/fi";
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
        icon: <FaHouse className="size-3.5" />,
    },
    {
        id: "nav-projects",
        label: "Projects",
        href: "/projects",
        section: "Navigation",
        keywords: ["portfolio", "work"],
        meta: "Page",
        icon: <FaFolderOpen className="size-3.5" />,
    },
    {
        id: "nav-gallery",
        label: "Gallery",
        href: "/gallery",
        section: "Navigation",
        keywords: ["photos", "images"],
        meta: "Page",
        icon: <FaImages className="size-3.5" />,
    },
    {
        id: "nav-status",
        label: "Status",
        href: "/status",
        section: "Navigation",
        keywords: ["services", "health", "uptime"],
        meta: "Page",
        icon: <FiActivity className="size-3.5" />,
    },
    {
        id: "nav-resume",
        label: "Resume",
        href: "/resume.pdf",
        section: "Navigation",
        keywords: ["pdf", "download"],
        meta: "PDF",
        icon: <FaFileLines className="size-3.5" />,
        actionLabel: "Open in new tab",
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
                icon: <FiBookOpen className="size-3.5" />,
            },
            ...posts.map((post) => ({
                id: `blog-post-${post.slug}`,
                label: post.title,
                description: post.description,
                href: `/blog/${post.slug}`,
                section: "Blog",
                meta: "Post",
                keywords: [post.slug, ...(post.tags ?? [])],
                icon: <FaRegNewspaper className="size-3.5" />,
            })),
        ] as CommandDescriptor[],
    };
}

export function useNavigationCommands() {
    const { registerCommands, pushView } = useCommandMenu();
    const pathname = usePathname();
    const { push } = useRouter();
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
        const blogCommand: CommandDescriptor = {
            id: "nav-blog",
            label: "Blog",
            section: "Navigation",
            keywords: ["posts", "archive", "mdx", "articles", "writing"],
            meta: "Posts",
            closeOnRun: false,
            icon: <FaPenNib className="size-3.5" />,
            actionLabel: "Continue",
            action: () => {
                if (blogPostsRef.current !== null) {
                    pushView(buildBlogView(blogPostsRef.current));
                    return;
                }
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
        };
        const commands: CommandDescriptor[] = [
            ...navigationCommands,
            blogCommand,
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
                        push(href);
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
    }, [pathname, registerCommands, push, pushView]);
}
