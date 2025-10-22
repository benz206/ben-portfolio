"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { AmbientGradient } from "@/components/AmbientGradient";
import ProjectPreview from "@/components/ProjectPreview";
import projectPreviews from "@/data/projectPreviews";
import type { ProjectPreviewProps } from "@/types";
import ProjectDetailModal from "@/components/ProjectDetailModal";

export default function Projects() {
    const [selectedProject, setSelectedProject] = useState<ProjectPreviewProps | null>(null);

    const handleOpen = (project: ProjectPreviewProps) => {
        setSelectedProject(project);
    };

    const handleClose = () => {
        setSelectedProject(null);
    };

    return (
        <section className="overflow-hidden relative pt-28 pb-24 text-white bg-black">
            <div className="absolute inset-0 bg-black" />
            <div className="relative mx-auto flex w-11/12 max-w-[1180px] flex-col gap-20">
                <motion.div
                    className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(300px,0.95fr)]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                    <motion.div
                        className="flex flex-col gap-8"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut", delay: 0.05 }}
                    >
                        <div className="space-y-4">
                            <span className="text-xs uppercase tracking-[0.4em] text-white/40">
                                Proof of craft
                            </span>
                            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                                Projects built to feel inevitable.
                            </h1>
                            <p className="max-w-2xl text-sm text-white/65">
                                Full-stack products, physical builds, and AI tools designed with the same obsession over detail as my home page.
                            </p>
                        </div>
                    </motion.div>
                    <div className="isolate overflow-hidden relative p-6 rounded-lg card-glass">
                        <div className="flex relative z-10 flex-col gap-6">
                            <div className="overflow-hidden relative rounded-lg">
                                <div className="absolute inset-0 bg-gradient-to-t via-transparent to-transparent from-black/60" />
                                <Image
                                    src={projectPreviews[0].image.src}
                                    alt={projectPreviews[0].image.alt}
                                    width={projectPreviews[0].image.width}
                                    height={projectPreviews[0].image.height}
                                    className="object-cover w-full h-56"
                                    priority={projectPreviews[0].image.priority}
                                />
                                <span className="absolute left-4 top-4 text-[10px] uppercase tracking-[0.6em] text-white/70">
                                    Spotlight
                                </span>
                            </div>
                            <div className="flex flex-col gap-3">
                                <h2 className="text-2xl font-semibold text-white">
                                    {projectPreviews[0].title}
                                </h2>
                                {projectPreviews[0].summary && (
                                    <p className="text-sm text-white/65">
                                        {projectPreviews[0].summary}
                                    </p>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => handleOpen(projectPreviews[0])}
                                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/70 transition-colors hover:text-white"
                            >
                                View details
                                <span aria-hidden>→</span>
                            </button>
                        </div>
                        <AmbientGradient
                            seed={projectPreviews[0].title}
                            className="opacity-60"
                        />
                    </div>
                </motion.div>
                <motion.ul
                    className="grid gap-10 md:grid-cols-2"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut", delay: 0.12 }}
                >
                    {projectPreviews.map((project, index) => (
                        <ProjectPreview
                            key={project.title}
                            {...project}
                            index={index}
                            onSelect={() => handleOpen(project)}
                        />
                    ))}
                </motion.ul>
            </div>

            {selectedProject && (
                <ProjectDetailModal project={selectedProject} onClose={handleClose} />
            )}
        </section>
    );
}
