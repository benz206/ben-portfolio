"use client";

import { useCallback, useEffect, useRef } from "react";
import { AnimatePresence, m } from "framer-motion";
import { MdClose } from "react-icons/md";
import { ProjectPreviewProps } from "@/types";
import Card from "@/components/Card";
import LanguageBadge from "@/components/LanguageBadge";
import { AmbientGradient } from "@/components/AmbientGradient";

interface ProjectDetailModalProps {
    project: ProjectPreviewProps;
    onClose: () => void;
}

export default function ProjectDetailModal({
    project,
    onClose,
}: ProjectDetailModalProps) {
    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onClose();
            }
        },
        [onClose],
    );
    const handlerRef = useRef(handleKeyDown);

    useEffect(() => {
        handlerRef.current = handleKeyDown;
    }, [handleKeyDown]);

    useEffect(() => {
        const listener = (event: KeyboardEvent) => handlerRef.current(event);
        document.addEventListener("keydown", listener);
        return () => document.removeEventListener("keydown", listener);
    }, []);

    return (
        <AnimatePresence>
            <m.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-12 backdrop-blur"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <m.div
                    className="relative w-full max-w-3xl"
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 32 }}
                    transition={{ duration: 0.3 }}
                    onClick={(event) => event.stopPropagation()}
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
                                <span className="text-xs uppercase tracking-[0.35em] text-white/45">
                                    {project.sub}
                                </span>
                                <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                                    {project.title}
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Close"
                                className="flex size-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/70 transition hover:border-white/40 hover:text-white"
                            >
                                <MdClose className="text-lg" />
                            </button>
                        </div>

                        <div className="relative z-10 space-y-4 text-sm leading-relaxed text-white/75">
                            {typeof project.description === "string" ? (
                                <p>{project.description}</p>
                            ) : (
                                project.description
                            )}
                        </div>

                        <div className="relative z-10 flex flex-wrap gap-2">
                            {project.languages.map((language) => (
                                <LanguageBadge
                                    key={language}
                                    language={language}
                                />
                            ))}
                        </div>
                    </Card>
                </m.div>
            </m.div>
        </AnimatePresence>
    );
}
