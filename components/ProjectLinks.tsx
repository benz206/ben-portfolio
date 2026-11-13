import { FaArrowRight, FaGithub } from "react-icons/fa";
import type { ProjectPreviewProps } from "@/types";
import { cn } from "@/utils/cn";

const base =
    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black";

export default function ProjectLinks({
    projectLink,
    sourceLink,
    className,
}: Pick<ProjectPreviewProps, "projectLink" | "sourceLink"> & {
    className?: string;
}) {
    if (!projectLink && !sourceLink) return null;

    const liveLabel = projectLink?.includes("devpost.com")
        ? "Devpost"
        : projectLink?.includes("crates.io")
          ? "crates.io"
          : "Live site";

    return (
        <div className={cn("flex flex-wrap gap-2", className)}>
            {projectLink && (
                <a
                    href={projectLink}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(base, "bg-white text-zinc-950 hover:bg-white/85")}
                >
                    {liveLabel}
                    <FaArrowRight className="size-3 -rotate-45" />
                </a>
            )}
            {sourceLink && (
                <a
                    href={sourceLink}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                        base,
                        "border border-white/15 bg-white/5 text-white/80 hover:border-white/30 hover:text-white",
                    )}
                >
                    <FaGithub className="size-4" />
                    Source
                </a>
            )}
        </div>
    );
}
