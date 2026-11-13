"use client";

import Image from "next/image";
import { m } from "framer-motion";
import type { ProjectPreviewProps } from "@/types";
import ProjectLinks from "@/components/ProjectLinks";
import { inView } from "@/utils/motion";
import { cn } from "@/utils/cn";

type ShowcaseProps = ProjectPreviewProps & {
    index: number;
    priority?: boolean;
    onSelect: () => void;
};

export default function ProjectShowcase({
    image,
    title,
    sub,
    summary,
    highlights,
    metric,
    languages,
    color,
    projectLink,
    sourceLink,
    index,
    priority = false,
    onSelect,
}: ShowcaseProps) {
    const flipped = index % 2 === 1;

    return (
        <m.article
            {...inView(32, 0.25, 0.7)}
            className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14"
        >
            <button
                type="button"
                onClick={onSelect}
                aria-label={`Open ${title} details`}
                className={cn(
                    "group relative cursor-pointer rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-4 focus-visible:ring-offset-black lg:col-span-7",
                    flipped && "lg:order-2",
                )}
            >
                <div
                    aria-hidden
                    className="absolute -inset-6 rounded-[2rem] opacity-40 blur-3xl transition-opacity duration-700 group-hover:opacity-70"
                    style={{
                        background: `radial-gradient(60% 60% at 50% 50%, ${color}55, transparent 70%)`,
                    }}
                />
                <div className="relative overflow-hidden rounded-2xl ring-1 ring-white/10 transition-transform duration-700 ease-out group-hover:-translate-y-1.5">
                    <Image
                        src={image.src}
                        alt={image.alt}
                        sizes="(min-width: 1280px) 680px, (min-width: 1024px) 56vw, 92vw"
                        className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        placeholder="blur"
                        loading={priority ? "eager" : "lazy"}
                        fetchPriority={priority ? "high" : undefined}
                    />
                </div>
            </button>

            <div
                className={cn(
                    "flex flex-col gap-6 lg:col-span-5",
                    flipped && "lg:order-1",
                )}
            >
                <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-white/45">
                    <span style={{ color }}>
                        {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px w-8 bg-white/20" />
                    <span>{sub}</span>
                </div>

                <div className="space-y-4">
                    <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                        {title}
                    </h2>
                    {summary && (
                        <p className="text-base leading-relaxed text-white/70 text-pretty">
                            {summary}
                        </p>
                    )}
                </div>

                {highlights && (
                    <ul className="ml-0 list-none space-y-2.5">
                        {highlights.map((highlight) => (
                            <li
                                key={highlight}
                                className="flex gap-3 text-sm leading-relaxed text-white/60"
                            >
                                <span
                                    aria-hidden
                                    className="mt-2 size-1.5 shrink-0 rounded-full"
                                    style={{ backgroundColor: color }}
                                />
                                {highlight}
                            </li>
                        ))}
                    </ul>
                )}

                <div className="flex flex-wrap items-end justify-between gap-6 border-t border-white/10 pt-6">
                    {metric && (
                        <div>
                            <div className="text-3xl font-semibold tabular-nums tracking-tight text-white">
                                {metric.value}
                            </div>
                            <div className="mt-1 text-xs text-white/45">
                                {metric.label}
                            </div>
                        </div>
                    )}
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                        {languages.join(" · ")}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <ProjectLinks
                        projectLink={projectLink}
                        sourceLink={sourceLink}
                    />
                    <button
                        type="button"
                        onClick={onSelect}
                        className="cursor-pointer rounded-full px-4 py-2 text-sm text-white/60 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    >
                        Read more
                    </button>
                </div>
            </div>
        </m.article>
    );
}
