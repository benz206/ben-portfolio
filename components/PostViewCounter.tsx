"use client";

import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";

const SESSION_VIEWED_PREFIX = "portfolio:post:viewed:";

type Props = {
    slug: string;
    className?: string;
};

export default function PostViewCounter({ slug, className }: Props) {
    const [views, setViews] = useState<number | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        const sessionKey = `${SESSION_VIEWED_PREFIX}${slug}`;
        const alreadyCounted = sessionStorage.getItem(sessionKey);

        (async () => {
            try {
                const method = alreadyCounted ? "GET" : "POST";
                const response = await fetch(`/api/views/${slug}`, {
                    method,
                    signal: controller.signal,
                });
                if (!response.ok) return;
                const { count } = await response.json();
                setViews(count);
                if (!alreadyCounted) {
                    sessionStorage.setItem(sessionKey, "1");
                }
            } catch (error) {
                if ((error as Error).name !== "AbortError") {
                    console.error("Failed to fetch post views", error);
                }
            }
        })();
        return () => controller.abort();
    }, [slug]);

    if (views === null) return null;

    const formatted = new Intl.NumberFormat().format(views);
    return (
        <span className={cn("text-sm text-white/40", className)}>
            {formatted} views
        </span>
    );
}
