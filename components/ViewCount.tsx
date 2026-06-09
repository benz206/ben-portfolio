"use client";

import { FiEye } from "react-icons/fi";
import { cn } from "@/utils/cn";
import { formatNumber } from "@/utils/format";
import { useViewCount } from "@/components/useViewCount";

type Props = {
    slug: string;
    /** POST increments the count on mount; GET only reads it. */
    method?: "GET" | "POST";
    showIcon?: boolean;
    initialViews?: number;
    className?: string;
};

export default function ViewCount({
    slug,
    method = "GET",
    showIcon = false,
    initialViews,
    className,
}: Props) {
    const fetchedViews = useViewCount(slug, method);
    const views = fetchedViews ?? initialViews ?? null;

    if (views === null) return null;

    if (showIcon) {
        return (
            <div className={cn("flex items-center gap-1.5", className)}>
                <FiEye className="size-4 text-white/50" />
                <span className="text-sm text-white/50">
                    {formatNumber(views)}
                </span>
            </div>
        );
    }

    return (
        <span className={cn("text-sm text-white/40", className)}>
            {formatNumber(views)} views
        </span>
    );
}
