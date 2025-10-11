"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import ProjectPreview from "@/components/ProjectPreview";
import projectPreviews from "@/data/projectPreviews";
import { motion } from "framer-motion";
import Card from "@/components/Card";

const phasesMeta = [
    {
        value: "Discover" as const,
        label: "Discover",
        subtitle: "Prototyping what could exist.",
        gradient: "bg-noir-gradient-cool",
        radial: "bg-noir-radial-cool",
    },
    {
        value: "Architect" as const,
        label: "Architect",
        subtitle: "Designing reliable systems.",
        gradient: "bg-noir-gradient",
        radial: "bg-noir-radial",
    },
    {
        value: "Ship" as const,
        label: "Ship",
        subtitle: "Delivering polished outcomes.",
        gradient: "bg-noir-gradient-warm",
        radial: "bg-noir-radial-warm",
    },
];

const marqueeVariants = {
    animate: {
        x: [0, -4000],
        transition: {
            x: {
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
                duration: 40,
            },
        },
    },
};

export default function Projects() {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const featuredProject = projectPreviews[0];
    const categoryOptions = useMemo(() => {
        const unique = new Set<string>();
        projectPreviews.forEach((project) => {
            project.categories.forEach((category) => unique.add(category));
        });
        return Array.from(unique).sort();
    }, []);
    const filteredProjects = useMemo(() => {
        if (!activeCategory) return projectPreviews;
        return projectPreviews.filter((project) =>
            project.categories.includes(activeCategory)
        );
    }, [activeCategory]);
    const phases = useMemo(
        () =>
            phasesMeta
                .map((phase) => ({
                    ...phase,
                    projects: filteredProjects.filter(
                        (project) => project.phase === phase.value
                    ),
                }))
                .filter((phase) => phase.projects.length > 0),
        [filteredProjects]
    );
    const deepDive = useMemo(
        () =>
            filteredProjects.find((project) => project.slug === "SpotifyMacroboard") ||
            filteredProjects.find((project) => project.phase === "Ship"),
        [filteredProjects]
    );
    const marqueeTitles = useMemo(
        () => projectPreviews.map((project) => project.title.toUpperCase()),
        []
    );

    return (
        <>
            <section className="relative flex items-center justify-center overflow-hidden bg-[#050506] py-28 text-white">
                <div className="absolute inset-0 bg-noir-gradient" />
                <div className="absolute inset-0 bg-noir-radial opacity-80" />
                <div className="relative flex w-11/12 max-w-[1180px] flex-col gap-16">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(260px,0.95fr)]"
                    >
                        <div className="flex flex-col gap-8">
                            <div className="space-y-4">
                        <span className="text-xs uppercase tracking-[0.4em] text-white/40">
                                    Proof of craft
                        </span>
                        <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                                    Projects built to feel inevitable.
                        </h1>
                                <p className="max-w-2xl text-sm text-white/65">
                                    I design, prototype, and ship full experiences. The work spans hardware, AI, and product surfaces, unified by a focus on thoughtful systems and expressive polish.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={() => setActiveCategory(null)}
                                    className={`rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em] transition-colors ${
                                        activeCategory
                                            ? "text-white/50 hover:text-white"
                                            : "bg-white text-black"
                                    }`}
                                >
                                    All work
                                </button>
                                {categoryOptions.map((category) => {
                                    const isActive = activeCategory === category;
                                    return (
                                        <button
                                            key={category}
                                            type="button"
                                            onClick={() =>
                                                setActiveCategory(
                                                    isActive ? null : category
                                                )
                                            }
                                            className={`rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em] transition-colors ${
                                                isActive
                                                    ? "bg-white text-black"
                                                    : "text-white/55 hover:text-white"
                                            }`}
                                        >
                                            {category}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <Card
                            variant="glass"
                            ambient
                            ambientSeed={featuredProject.title}
                            ambientClassName="opacity-60"
                            className="overflow-hidden"
                        >
                            <div className="flex flex-col gap-6">
                                <div className="relative overflow-hidden rounded-md">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    <Image
                                        src={featuredProject.image.src}
                                        alt={featuredProject.image.alt}
                                        width={featuredProject.image.width}
                                        height={featuredProject.image.height}
                                        className="h-56 w-full object-cover"
                                        priority={featuredProject.image.priority}
                                    />
                                    <span className="absolute left-4 top-4 text-[10px] uppercase tracking-[0.6em] text-white/70">
                                        Spotlight
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    <h2 className="text-2xl font-semibold text-white">
                                        {featuredProject.title}
                                    </h2>
                                    <p className="text-sm text-white/60">
                                        {featuredProject.description}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.4em] text-white/45">
                                    {featuredProject.categories.map((category) => (
                                        <span
                                            key={category}
                                            className="rounded border border-white/10 px-3 py-1"
                                        >
                                            {category}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/60">
                                    <a
                                        href={featuredProject.projectLink}
                                        target="_blank"
                                        className="rounded-md border border-white/15 bg-white/5 px-4 py-2 transition-colors hover:text-white"
                                    >
                                        View project
                                    </a>
                                    {featuredProject.slug && (
                                        <a
                                            href={`/blog/${featuredProject.slug}`}
                                            className="text-white/50 transition-colors hover:text-white"
                                        >
                                            Read case study
                                        </a>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </section>

            {phases.map((phase) => (
                <section
                    key={phase.value}
                    className={`relative flex justify-center overflow-hidden py-24 text-white ${phase.gradient}`}
                >
                    <div className={`absolute inset-0 opacity-75 ${phase.radial}`} />
                    <div className="relative flex w-11/12 max-w-[1180px] flex-col gap-12">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-4"
                        >
                            <span className="text-xs uppercase tracking-[0.5em] text-white/35">
                                {phase.label}
                            </span>
                            <h2 className="text-3xl font-semibold">
                                {phase.subtitle}
                            </h2>
                        </motion.div>
                        <motion.ul
                            className="grid gap-10 md:grid-cols-2"
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6 }}
                        >
                            {phase.projects.map((project) => (
                                <ProjectPreview key={project.title} {...project} />
                            ))}
                        </motion.ul>
                    </div>
                </section>
            ))}

            {deepDive && (
                <section className="relative flex justify-center overflow-hidden bg-[#050506] py-24 text-white">
                    <div className="absolute inset-0 bg-noir-gradient" />
                    <div className="absolute inset-0 bg-noir-radial opacity-70" />
                    <div className="relative flex w-11/12 max-w-[1180px] flex-col gap-10 lg:flex-row lg:items-center">
                        <Card
                            variant="glass"
                            ambient
                            ambientSeed={deepDive.title}
                            ambientClassName="opacity-50"
                            className="flex-1 overflow-hidden"
                        >
                            <Image
                                src={deepDive.image.src}
                                alt={deepDive.image.alt}
                                width={deepDive.image.width}
                                height={deepDive.image.height}
                                className="h-64 w-full rounded-md object-cover"
                            />
                            <div className="mt-6 space-y-3">
                                <span className="text-xs uppercase tracking-[0.4em] text-white/50">
                                    Deep dive
                                </span>
                                <h3 className="text-2xl font-semibold text-white">
                                    {deepDive.title}
                                </h3>
                                <p className="text-sm text-white/60">
                                    {deepDive.description}
                                </p>
                                <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.4em] text-white/40">
                                    {deepDive.categories.map((category) => (
                                        <span
                                            key={category}
                                            className="rounded border border-white/10 px-3 py-1"
                                        >
                                            {category}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </Card>
                        <div className="flex-1 space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.4 }}
                                transition={{ duration: 0.6 }}
                                className="space-y-4"
                            >
                                <h4 className="text-3xl font-semibold">
                                    Systems thinking from PCB to product.
                                </h4>
                                <p className="text-sm text-white/65">
                                    Hardware, firmware, and web surfaces converge into one expressive device. I iterate on enclosure design, embedded software, and interface layers simultaneously so the final experience feels cohesive.
                                </p>
                            </motion.div>
                            <div className="grid gap-4 rounded-lg border border-white/10 bg-white/5 p-6 text-sm text-white/65">
                                <div className="flex items-center justify-between">
                                    <span>Prototype to first demo</span>
                                    <span className="text-white">6 weeks</span>
                                </div>
                                <div className="h-[1px] w-full bg-white/10" />
                                <div className="flex items-center justify-between">
                                    <span>Actions per minute w/ macros</span>
                                    <span className="text-white">+180%</span>
                                </div>
                                <div className="h-[1px] w-full bg-white/10" />
                                <div className="flex items-center justify-between">
                                    <span>Stack</span>
                                    <span className="text-white/80">
                                        {deepDive.icons.map((icon) => icon.alt).join(" • ")}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/60">
                                <a
                                    href={deepDive.projectLink}
                                    target="_blank"
                                    className="rounded-md border border-white/15 bg-white/5 px-4 py-2 transition-colors hover:text-white"
                                >
                                    View build log
                                </a>
                                {deepDive.slug && (
                                    <a
                                        href={`/blog/${deepDive.slug}`}
                                        className="text-white/50 transition-colors hover:text-white"
                                    >
                                        Read documentation
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <section className="relative flex justify-center overflow-hidden bg-[#050506] py-16 text-white">
                <div className="absolute inset-0 bg-noir-gradient" />
                <div className="absolute inset-0 bg-noir-radial opacity-60" />
                <div className="relative w-full overflow-hidden">
                    <motion.div
                        className="flex gap-12 whitespace-nowrap text-xs uppercase tracking-[0.6em] text-white/35"
                        variants={marqueeVariants}
                        animate="animate"
                    >
                        {[...marqueeTitles, ...marqueeTitles].map((title, index) => (
                            <span key={`${title}-${index}`}>
                                {title}
                            </span>
                    ))}
                </motion.div>
                </div>
            </section>
        </>
    );
}
