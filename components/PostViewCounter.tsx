"use client";

import { cn } from "@/utils/cn";
import { formatNumber } from "@/utils/format";
import { useViewCount } from "@/components/useViewCount";

type Props = {
    slug: string;
    className?: string;
};

export default function PostViewCounter({ slug, className }: Props) {
    const views = useViewCount(slug, "POST");

    if (views === null) return null;

    return (
        <span className={cn("text-sm text-white/40", className)}>
            {formatNumber(views)} views
        </span>
    );
}
