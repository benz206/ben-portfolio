"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ProjectPreview from "@/components/ProjectPreview";
import projectPreviews from "@/data/projectPreviews";
import type { ProjectPreviewProps } from "@/types";
import ProjectDetailModal from "@/components/ProjectDetailModal";

export default function Projects() {
    const [selectedProject, setSelectedProject] =
        useState<ProjectPreviewProps | null>(null);

    const handleOpen = (project: ProjectPreviewProps) => {
        setSelectedProject(project);
    };

    const handleClose = () => {
        setSelectedProject(null);
    };

    return (
        <section className="relative pb-24 overflow-hidden text-white bg-black pt-28">
            <div className="absolute inset-0 bg-black" />
            <div className="relative mx-auto flex w-11/12 max-w-295 flex-col gap-20">
                <motion.div
                    className="space-y-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                        <div className="space-y-3">
                            <span className="text-xs uppercase tracking-[0.4em] text-white/40">
                                Some of my work
                            </span>
                            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                                Projects
                            </h1>
                        </div>
                        <p className="max-w-md text-sm text-white/60 sm:text-right">
                            Stuff I&apos;ve been working on.
                        </p>
                    </div>
                </motion.div>
                <motion.ul
                    className="grid gap-10 md:grid-cols-2"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.6,
                        ease: "easeInOut",
                        delay: 0.12,
                    }}
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
                <ProjectDetailModal
                    project={selectedProject}
                    onClose={handleClose}
                />
            )}
        </section>
    );
}
