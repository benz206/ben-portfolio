"use client";

import { Suspense, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { m } from "framer-motion";
import ProjectPreview from "@/components/ProjectPreview";
import projectPreviews from "@/data/projectPreviews";
import type { ProjectPreviewProps } from "@/types";
import ProjectDetailModal from "@/components/ProjectDetailModal";
import ScatteredGradients from "@/components/blog/ScatteredGradients";
import Eyebrow from "@/components/Eyebrow";
import { fadeUp } from "@/utils/motion";
import { cn } from "@/utils/cn";

const featuredProjects = projectPreviews.filter((project) => project.featured);
const otherProjects = projectPreviews.filter((project) => !project.featured);

// Only techs used by more than one project, so every chip has something to show.
const techOptions = (() => {
    const counts = new Map<string, number>();
    for (const project of projectPreviews) {
        for (const language of project.languages) {
            counts.set(language, (counts.get(language) ?? 0) + 1);
        }
    }
    return [...counts.entries()]
        .filter(([, count]) => count > 1)
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .map(([tech]) => tech);
})();

function ProjectGrid({
    projects,
    onSelect,
    animationKey,
}: {
    projects: ProjectPreviewProps[];
    onSelect: (project: ProjectPreviewProps) => void;
    animationKey: string;
}) {
    return (
        <m.ul
            key={animationKey}
            className="grid gap-10 md:grid-cols-2"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut", delay: 0.12 }}
        >
            {projects.map((project, index) => (
                <ProjectPreview
                    key={project.title}
                    {...project}
                    index={index}
                    onSelect={() => onSelect(project)}
                />
            ))}
        </m.ul>
    );
}

function ProjectsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [activeTech, setActiveTech] = useState<string | null>(null);

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

    const filteredProjects = activeTech
        ? projectPreviews.filter((project) =>
              project.languages.includes(activeTech),
          )
        : null;

    return (
        <section className="relative pb-24 overflow-hidden text-white bg-zinc-950 pt-28">
            <div className="absolute inset-0 bg-zinc-950" />
            <ScatteredGradients seed="projects" count={28} />
            <div className="relative mx-auto flex w-11/12 max-w-295 flex-col gap-20">
                <m.div className="space-y-10" {...fadeUp(20, 0.6)}>
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
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => setActiveTech(null)}
                            aria-pressed={activeTech === null}
                            className={cn(
                                "rounded-full border px-4 py-1.5 text-xs transition-colors duration-200 cursor-pointer",
                                activeTech === null
                                    ? "border-white/30 bg-white/15 text-white"
                                    : "border-white/10 bg-white/5 text-white/60 hover:text-white",
                            )}
                        >
                            All
                        </button>
                        {techOptions.map((tech) => (
                            <button
                                key={tech}
                                type="button"
                                onClick={() => setActiveTech(tech)}
                                aria-pressed={activeTech === tech}
                                className={cn(
                                    "rounded-full border px-4 py-1.5 text-xs transition-colors duration-200 cursor-pointer",
                                    activeTech === tech
                                        ? "border-white/30 bg-white/15 text-white"
                                        : "border-white/10 bg-white/5 text-white/60 hover:text-white",
                                )}
                            >
                                {tech}
                            </button>
                        ))}
                    </div>
                </m.div>

                {filteredProjects ? (
                    <ProjectGrid
                        projects={filteredProjects}
                        onSelect={handleOpen}
                        animationKey={activeTech ?? "all"}
                    />
                ) : (
                    <>
                        <div className="flex flex-col gap-8">
                            <Eyebrow className="tracking-[0.4em] text-white/40">
                                Featured
                            </Eyebrow>
                            <ProjectGrid
                                projects={featuredProjects}
                                onSelect={handleOpen}
                                animationKey="featured"
                            />
                        </div>
                        <div className="flex flex-col gap-8">
                            <Eyebrow className="tracking-[0.4em] text-white/40">
                                Everything else
                            </Eyebrow>
                            <ProjectGrid
                                projects={otherProjects}
                                onSelect={handleOpen}
                                animationKey="rest"
                            />
                        </div>
                    </>
                )}
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
