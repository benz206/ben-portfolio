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
        id: "nav-blogs",
        label: "Blog",
        href: "/blog",
        section: "Navigation",
        keywords: ["articles", "writing"],
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
    }
];

export function useNavigationCommands() {
    const { registerCommands } = useCommandMenu();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const commands = navigationCommands.map((command) => {
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
    }, [pathname, registerCommands, router]);
}

