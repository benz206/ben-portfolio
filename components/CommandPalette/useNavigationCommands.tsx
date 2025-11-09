"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCommandMenu } from "./CommandProvider";

const navigationCommands = [
    {
        id: "nav-home",
        label: "Go to Home",
        href: "/",
        section: "Navigation",
        keywords: ["root", "landing"],
        meta: "Page",
    },
    {
        id: "nav-projects",
        label: "Go to Projects",
        href: "/projects",
        section: "Navigation",
        keywords: ["portfolio", "work"],
        meta: "Page",
    },
    {
        id: "nav-blogs",
        label: "Go to Blog",
        href: "/blog",
        section: "Navigation",
        keywords: ["articles", "writing"],
        meta: "Page",
    },
    {
        id: "nav-gallery",
        label: "Go to Gallery",
        href: "/gallery",
        section: "Navigation",
        keywords: ["photos", "images"],
        meta: "Page",
    },
    {
        id: "nav-github",
        label: "Go to GitHub Analytics",
        href: "/github",
        section: "Navigation",
        keywords: ["repos", "stat"],
        meta: "Page",
    },
    {
        id: "nav-thanks",
        label: "Go to Thank You",
        href: "/thanks",
        section: "Navigation",
        keywords: ["gratitude", "message"],
        meta: "Page",
    },
];

export function useNavigationCommands() {
    const { registerCommands } = useCommandMenu();
    const pathname = usePathname();

    useEffect(() => {
        const unregister = registerCommands({
            source: "navigation",
            commands: navigationCommands.map((command) => ({
                ...command,
                meta: command.href === pathname ? "Current" : command.meta,
            })),
            replace: true,
        });
        return unregister;
    }, [pathname, registerCommands]);
}

