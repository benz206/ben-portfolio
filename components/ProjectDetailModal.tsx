"use client";

import { type MouseEvent, useEffect, useId, useRef } from "react";
import Image from "next/image";
import { MdClose } from "react-icons/md";
import { ProjectPreviewProps } from "@/types";
import Card from "@/components/Card";
import LanguageBadge from "@/components/LanguageBadge";
import { AmbientGradient } from "@/components/AmbientGradient";
import Eyebrow from "@/components/Eyebrow";
import ProjectLinks from "@/components/ProjectLinks";

interface ProjectDetailModalProps {
    project: ProjectPreviewProps;
    onClose: () => void;
}

export default function ProjectDetailModal({
    project,
    onClose,
}: ProjectDetailModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const titleId = useId();

    useEffect(() => {
        dialogRef.current?.showModal();
    }, []);

    const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
        const dialog = event.currentTarget;
        if ("closedBy" in HTMLDialogElement.prototype) return;
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent =
            rect.top <= event.clientY &&
            event.clientY <= rect.bottom &&
            rect.left <= event.clientX &&
            event.clientX <= rect.right;
        if (isDialogContent) return;
        dialog.close();
    };

    return (
        <dialog
            ref={dialogRef}
            {...({ closedby: "any" } as Record<string, string>)}
            aria-labelledby={titleId}
            onClose={onClose}
            onClick={handleClick}
            className="m-auto max-h-[calc(100%-6rem)] w-[calc(100%-2rem)] max-w-3xl overscroll-contain bg-transparent text-inherit transition-[opacity,translate,display,overlay] transition-discrete duration-300 backdrop:overflow-hidden backdrop:overscroll-contain backdrop:bg-black/80 backdrop:backdrop-blur backdrop:transition-[opacity,display,overlay] backdrop:transition-discrete backdrop:duration-300 starting:opacity-0 starting:backdrop:opacity-0 motion-safe:starting:translate-y-8 motion-reduce:duration-100 motion-reduce:backdrop:duration-100"
        >
            <Card
                variant="glass"
                ambient
                ambientSeed={project.title}
                ambientClassName="opacity-45"
                radius="2xl"
                className="relative flex flex-col gap-8 overflow-hidden bg-[#05070f]/95 p-8 sm:p-10"
            >
                <AmbientGradient
                    seed={project.slug ?? project.title}
                    className="opacity-55"
                />
                <div className="relative z-10 flex items-start justify-between gap-6">
                    <div className="space-y-3">
                        <Eyebrow className="tracking-[0.35em] text-white/45">
                            {project.sub}
                        </Eyebrow>
                        <h2
                            id={titleId}
                            className="text-3xl font-semibold text-white sm:text-4xl"
                        >
                            {project.title}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={() => dialogRef.current?.close()}
                        aria-label="Close"
                        className="flex size-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/70 transition hover:border-white/40 hover:text-white"
                    >
                        <MdClose className="text-lg" />
                    </button>
                </div>

                <Image
                    src={project.image.src}
                    alt={project.image.alt}
                    sizes="(min-width: 768px) 700px, 92vw"
                    placeholder="blur"
                    className="relative z-10 h-auto w-full rounded-xl ring-1 ring-white/10"
                />

                <div className="relative z-10 space-y-4 text-sm leading-relaxed text-white/75">
                    {typeof project.description === "string" ? (
                        <p>{project.description}</p>
                    ) : (
                        project.description
                    )}
                </div>

                <div className="relative z-10 flex flex-wrap gap-2">
                    {project.languages.map((language) => (
                        <LanguageBadge key={language} language={language} />
                    ))}
                </div>

                <ProjectLinks
                    projectLink={project.projectLink}
                    sourceLink={project.sourceLink}
                    className="relative z-10"
                />
            </Card>
        </dialog>
    );
}
