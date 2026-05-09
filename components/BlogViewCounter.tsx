"use client";

import { useEffect, useState } from "react";
import { FiEye } from "react-icons/fi";
import { cn } from "@/utils/cn";

const viewsFormatter = new Intl.NumberFormat();

type Props = {
    slug: string;
    initialViews?: number;
    className?: string;
};

export default function BlogViewCounter({
    slug,
    initialViews = 0,
    className,
}: Props) {
    const [fetchedViews, setFetchedViews] = useState<number | null>(null);
    const views = fetchedViews ?? initialViews;

    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                const response = await fetch(`/api/views/${slug}`, {
                    method: "GET",
                });
                if (!response.ok) return;
                const { count } = await response.json();
                if (isMounted) setFetchedViews(count);
            } catch (error) {
                console.error("Failed to fetch post views", error);
            }
        })();
        return () => {
            isMounted = false;
        };
    }, [slug]);

    const formatted = viewsFormatter.format(views);
    return (
        <div className={cn("flex items-center gap-1.5", className)}>
            <FiEye className="size-4 text-white/50" />
            <span className="text-sm text-white/50">{formatted}</span>
        </div>
    );
}
