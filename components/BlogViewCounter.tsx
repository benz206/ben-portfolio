"use client";

import { FiEye } from "react-icons/fi";
import { cn } from "@/utils/cn";
import { formatNumber } from "@/utils/format";
import { useViewCount } from "@/components/useViewCount";

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
    const fetchedViews = useViewCount(slug, "GET");
    const views = fetchedViews ?? initialViews;

    return (
        <div className={cn("flex items-center gap-1.5", className)}>
            <FiEye className="size-4 text-white/50" />
            <span className="text-sm text-white/50">{formatNumber(views)}</span>
        </div>
    );
}
