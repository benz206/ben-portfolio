"use client";

import { ProjectPreviewProps } from "@/types";
import Image from "next/image";
import { m } from "framer-motion";
import { inView } from "@/utils/motion";

type PreviewProps = ProjectPreviewProps & {
    onSelect: () => void;
};

export default function ProjectPreview({
    image,
    title,
    sub,
    summary,
    languages,
    color,
    onSelect,
}: PreviewProps) {
    return (
        <m.li className="list-none" {...inView(24, 0.2, 0.6)}>
            <button
                type="button"
                onClick={onSelect}
                className="group relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-2xl bg-white/[0.03] text-left ring-1 ring-white/10 transition-[background-color,box-shadow,translate] duration-500 hover:-translate-y-1 hover:bg-white/[0.05] hover:ring-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
                <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 z-10 h-px opacity-60 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                    }}
                />
                <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 1024px) 380px, (min-width: 768px) 46vw, 92vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        placeholder="blur"
                    />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-6">
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                        {sub}
                    </span>
                    <h3 className="text-xl font-semibold tracking-tight text-white">
                        {title}
                    </h3>
                    {summary && (
                        <p className="text-sm leading-relaxed text-white/60 text-pretty">
                            {summary}
                        </p>
                    )}
                    <p className="mt-auto pt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-white/35">
                        {languages.join(" · ")}
                    </p>
                </div>
            </button>
        </m.li>
    );
}
