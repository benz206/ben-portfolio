"use client";

import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";

const viewsFormatter = new Intl.NumberFormat();

type Props = {
    slug: string;
    className?: string;
};

export default function PostViewCounter({ slug, className }: Props) {
    const [views, setViews] = useState<number | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            try {
                const response = await fetch(`/api/views/${slug}`, {
                    method: "POST",
                    signal: controller.signal,
                });
                if (!response.ok) return;
                const { count } = await response.json();
                setViews(count);
            } catch (error) {
                if ((error as Error).name !== "AbortError") {
                    console.error("Failed to increment post views", error);
                }
            }
        })();
        return () => controller.abort();
    }, [slug]);

    if (views === null) return null;

    const formatted = viewsFormatter.format(views);
    return (
        <span className={cn("text-sm text-white/40", className)}>
            {formatted} views
        </span>
    );
}
