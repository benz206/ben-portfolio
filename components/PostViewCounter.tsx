"use client";

import { useEffect, useState } from "react";

type Props = {
    slug: string;
    className?: string;
};

export default function PostViewCounter({ slug, className }: Props) {
    const [views, setViews] = useState<number | null>(null);

    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                const response = await fetch(`/api/views/${slug}`, {
                    method: "POST",
                });
                if (!response.ok) return;
                const { count } = await response.json();
                if (isMounted) setViews(count);
            } catch (error) {
                console.error("Failed to increment post views", error);
            }
        })();
        return () => {
            isMounted = false;
        };
    }, [slug]);

    if (views === null) return null;

    const formatted = new Intl.NumberFormat().format(views);
    return <span className={className}>{formatted} views</span>;
}


