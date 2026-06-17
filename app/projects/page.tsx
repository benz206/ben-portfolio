"use client";

import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { m } from "framer-motion";
import ProjectPreview from "@/components/ProjectPreview";
import projectPreviews from "@/data/projectPreviews";
import type { ProjectPreviewProps } from "@/types";
import ProjectDetailModal from "@/components/ProjectDetailModal";
import ScatteredGradients from "@/components/blog/ScatteredGradients";
import Eyebrow from "@/components/Eyebrow";
import { fadeUp } from "@/utils/motion";

function ProjectsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // The open project is derived from ?project=<slug> so it's deep-linkable
    // (e.g. from the command palette) and the back button closes the modal.
    const activeSlug = searchParams.get("project");
    const selectedProject = activeSlug
        ? (projectPreviews.find((project) => project.slug === activeSlug) ??
          null)
        : null;

    const handleOpen = (project: ProjectPreviewProps) => {
        if (project.slug) {
            router.push(`${pathname}?project=${project.slug}`, {
                scroll: false,
            });
        }
    };

    const handleClose = () => {
        router.replace(pathname, { scroll: false });
    };

    return (
        <section className="relative pb-24 overflow-hidden text-white bg-zinc-950 pt-28">
            <div className="absolute inset-0 bg-zinc-950" />
            <ScatteredGradients seed="projects" count={28} />
            <div className="relative mx-auto flex w-11/12 max-w-295 flex-col gap-20">
                <m.div
                    className="space-y-10"
                    {...fadeUp(20, 0.6)}
                >
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                        <div className="space-y-3">
                            <Eyebrow className="tracking-[0.4em] text-white/40">
                                Some of my work
                            </Eyebrow>
                            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                                Projects
                            </h1>
                        </div>
                        <p className="max-w-md text-sm text-white/60 sm:text-right">
                            Stuff I&apos;ve been working on.
                        </p>
                    </div>
                </m.div>
                <m.ul
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
                </m.ul>
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

export default function Projects() {
    return (
        <Suspense>
            <ProjectsContent />
        </Suspense>
    );
}
