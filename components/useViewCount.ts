"use client";

import { useEffect, useState } from "react";

type Method = "GET" | "POST";

/**
 * Reads (GET) or increments-then-reads (POST) the view count for a slug.
 * Returns null until the request resolves.
 */
export function useViewCount(slug: string, method: Method = "GET") {
    const [count, setCount] = useState<number | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            try {
                const res = await fetch(`/api/views/${slug}`, {
                    method,
                    signal: controller.signal,
                });
                if (!res.ok) return;
                const data = await res.json();
                setCount(data.count);
            } catch (error) {
                if ((error as Error).name !== "AbortError") {
                    console.error("Failed to load post views", error);
                }
            }
        })();
        return () => controller.abort();
    }, [slug, method]);

    return count;
}
