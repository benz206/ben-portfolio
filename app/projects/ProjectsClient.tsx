"use client";

import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { m } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import ProjectPreview from "@/components/ProjectPreview";
import ProjectShowcase from "@/components/ProjectShowcase";
import projectPreviews from "@/data/projectPreviews";
import type { ProjectPreviewProps } from "@/types";
import ProjectDetailModal from "@/components/ProjectDetailModal";
import ScatteredGradients from "@/components/blog/ScatteredGradients";
import Eyebrow from "@/components/Eyebrow";
import { fadeUp } from "@/utils/motion";

const featuredProjects = projectPreviews.filter(
    (project) => project.tier === "featured",
);
const moreProjects = projectPreviews.filter((project) => !project.tier);
const archivedProjects = projectPreviews.filter(
    (project) => project.tier === "archive",
);

function SectionHeading({ title, note }: { title: string; note: string }) {
    return (
        <div className="flex flex-col gap-2 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <Eyebrow className="tracking-[0.4em] text-white/40">{title}</Eyebrow>
            <p className="text-sm text-white/45">{note}</p>
        </div>
    );
}

function ProjectsContent({ writeups }: { writeups: string[] }) {
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
        <section className="relative overflow-hidden bg-zinc-950 pb-32 pt-28 text-white">
            <div className="absolute inset-0 bg-zinc-950" />
            <ScatteredGradients seed="projects" count={28} />
            <div className="relative mx-auto flex w-11/12 max-w-295 flex-col gap-28">
                <m.header {...fadeUp(20, 0.6)}>
                    <div className="max-w-3xl space-y-5">
                        <Eyebrow className="tracking-[0.4em] text-white/40">
                            Some of my work
                        </Eyebrow>
                        <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
                            Projects
                        </h1>
                        <p className="max-w-xl text-base leading-relaxed text-white/60 text-pretty">
                            Live tools for Waterloo students, data products,
                            Discord infrastructure, and Rust running on a
                            Raspberry Pi. Most of it is open source, and most of
                            it is up right now.
                        </p>
                    </div>
                </m.header>

                <div className="flex flex-col gap-24 lg:gap-32">
                    {featuredProjects.map((project, index) => (
                        <ProjectShowcase
                            key={project.title}
                            {...project}
                            index={index}
                            priority={index === 0}
                            onSelect={() => handleOpen(project)}
                        />
                    ))}
                </div>

                <div className="flex flex-col gap-10">
                    <SectionHeading
                        title="More work"
                        note="Libraries, bots, hardware and hackathon builds."
                    />
                    <ul className="ml-0 grid list-none gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {moreProjects.map((project) => (
                            <ProjectPreview
                                key={project.title}
                                {...project}
                                onSelect={() => handleOpen(project)}
                            />
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col gap-4">
                    <SectionHeading
                        title="Archive"
                        note="Earlier hackathons and hardware."
                    />
                    <ul className="ml-0 list-none divide-y divide-white/10">
                        {archivedProjects.map((project) => (
                            <li key={project.title}>
                                <button
                                    type="button"
                                    onClick={() => handleOpen(project)}
                                    className="group grid w-full cursor-pointer grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:grid-cols-[14rem_1fr_auto]"
                                >
                                    <span className="font-medium text-white">
                                        {project.title}
                                    </span>
                                    <span className="col-start-1 row-start-2 text-sm text-white/50 sm:col-start-2 sm:row-start-1">
                                        {project.sub}
                                    </span>
                                    <FaArrowRight className="row-span-2 size-3.5 text-white/30 transition-[color,translate] group-hover:translate-x-1 group-hover:text-white sm:row-span-1" />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {selectedProject && (
                <ProjectDetailModal
                    project={selectedProject}
                    writeupHref={
                        selectedProject.writeup &&
                        writeups.includes(selectedProject.writeup)
                            ? `/projects/${selectedProject.writeup}`
                            : undefined
                    }
                    writeupComingSoon={
                        !!selectedProject.writeup &&
                        !writeups.includes(selectedProject.writeup)
                    }
                    onClose={handleClose}
                />
            )}
        </section>
    );
}

export default function ProjectsClient({ writeups }: { writeups: string[] }) {
    return (
        <Suspense>
            <ProjectsContent writeups={writeups} />
        </Suspense>
    );
}
