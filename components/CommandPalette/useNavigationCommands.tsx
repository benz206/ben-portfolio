"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { CommandDescriptor } from "@/types/command";
import { useCommandMenu } from "./CommandProvider";

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
        id: "nav-resume",
        label: "Resume",
        href: "/resume.pdf",
        section: "Navigation",
        keywords: ["pdf", "download"],
        meta: "Page",
    },
];

export function useNavigationCommands() {
    const { registerCommands, pushView } = useCommandMenu();
    const pathname = usePathname();
    const router = useRouter();

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
                    void (async () => {
                        try {
                            const res = await fetch("/api/blog/public");
                            const posts = (await res.json()) as Array<{
                                slug: string;
                                title: string;
                                description?: string;
                                tags?: string[];
                            }>;

                            pushView({
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
                                        keywords: [
                                            post.slug,
                                            ...(post.tags ?? []),
                                        ],
                                    })),
                                ],
                            });
                        } catch {
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
                        }
                    })();
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
