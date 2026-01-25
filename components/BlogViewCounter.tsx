"use client";

import { useEffect, useState } from "react";
import { FiEye } from "react-icons/fi";

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
    const [views, setViews] = useState<number>(initialViews);

    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                const response = await fetch(`/api/views/${slug}`, {
                    method: "GET",
                });
                if (!response.ok) return;
                const { count } = await response.json();
                if (isMounted) setViews(count);
            } catch (error) {
                console.error("Failed to fetch post views", error);
            }
        })();
        return () => {
            isMounted = false;
        };
    }, [slug]);

    const formatted = new Intl.NumberFormat().format(views);
    return (
        <div className={`flex items-center gap-1.5 ${className || ""}`}>
            <FiEye className="w-4 h-4 text-white/50" />
            <span className="text-sm text-white/50">{formatted}</span>
        </div>
    );
}
