import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

type EyebrowProps = HTMLAttributes<HTMLSpanElement> & {
    children: ReactNode;
};

/**
 * Small uppercase label ("eyebrow"). Defaults to the most common style;
 * override tracking / opacity / size per call site via className.
 */
export default function Eyebrow({
    children,
    className,
    ...rest
}: EyebrowProps) {
    return (
        <span
            className={cn(
                "text-xs uppercase tracking-[0.25em] text-white/50",
                className,
            )}
            {...rest}
        >
            {children}
        </span>
    );
}
