"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import Card from "@/components/Card";
import ProjectPreview from "@/components/ProjectPreview";
import LanguageBadge from "@/components/LanguageBadge";
import projectPreviews from "@/data/projectPreviews";

const marqueeVariants: Variants = {
    animate: {
        x: [0, -4000],
        transition: {
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            duration: 40,
        },
    },
};

export default function Projects() {
    const [languageFilter, setLanguageFilter] = useState<string | null>(null);
    const featuredProject = projectPreviews[0];
    const languages = useMemo(() => {
        const unique = new Set<string>();
        projectPreviews.forEach((project) => {
            project.languages.forEach((lang) => unique.add(lang));
        });
        return Array.from(unique).sort();
    }, []);
    const filteredProjects = useMemo(() => {
        if (!languageFilter) return projectPreviews;
        return projectPreviews.filter((project) =>
            project.languages.some(
                (language) =>
                    language.toLowerCase() === languageFilter.toLowerCase()
            )
        );
    }, [languageFilter]);
    const marqueeTitles = useMemo(
        () => projectPreviews.map((project) => project.title.toUpperCase()),
        []
    );

    return (
        <>
            <section className="relative flex flex-col items-center justify-center overflow-hidden bg-[#050506] py-28 text-white h-[100vh]">
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
                                    I design, prototype, and ship full
                                    experiences. The work spans hardware, AI,
                                    and product surfaces, unified by a focus on
                                    thoughtful systems and expressive polish.
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setLanguageFilter(null)}
                                    className={`rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em] transition-colors ${
                                        languageFilter
                                            ? "text-white/50 hover:text-white"
                                            : "bg-white text-black"
                                    }`}
                                >
                                    All languages
                                </button>
                                <div className="relative">
                                    <select
                                        value={languageFilter ?? ""}
                                        onChange={(event) =>
                                            setLanguageFilter(
                                                event.target.value === ""
                                                    ? null
                                                    : event.target.value
                                            )
                                        }
                                        className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 backdrop-blur transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                                    >
                                        <option value="" className="text-black">
                                            Filter by language
                                        </option>
                                        {languages.map((language) => (
                                            <option
                                                key={language}
                                                value={language}
                                                className="text-black"
                                            >
                                                {language}
                                            </option>
                                        ))}
                                    </select>
                                </div>
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
                                        className="object-cover w-full h-56"
                                        priority={
                                            featuredProject.image.priority
                                        }
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
                                <div className="flex flex-wrap gap-2">
                                    {featuredProject.languages.map(
                                        (language) => (
                                            <LanguageBadge
                                                key={language}
                                                language={language}
                                            />
                                        )
                                    )}
                                </div>
                                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/60">
                                    <a
                                        href={featuredProject.projectLink}
                                        target="_blank"
                                        className="px-4 py-2 transition-colors border rounded-md border-white/15 bg-white/5 hover:text-white"
                                    >
                                        View project
                                    </a>
                                    {featuredProject.slug && (
                                        <a
                                            href={`/blog/${featuredProject.slug}`}
                                            className="transition-colors text-white/50 hover:text-white"
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

            <section className="relative flex justify-center overflow-hidden bg-[#050506] py-24 text-white">
                <div className="absolute inset-0 bg-noir-gradient" />
                <div className="absolute inset-0 bg-noir-radial opacity-70" />
                <div className="relative flex w-11/12 max-w-[1180px] flex-col gap-12">
                    <motion.ul
                        className="grid gap-10 md:grid-cols-2"
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6 }}
                    >
                        {filteredProjects.map((project) => (
                            <ProjectPreview key={project.title} {...project} />
                        ))}
                    </motion.ul>
                </div>
            </section>

            <section className="relative flex justify-center overflow-hidden bg-[#050506] py-16 text-white">
                <div className="absolute inset-0 bg-noir-gradient" />
                <div className="absolute inset-0 bg-noir-radial opacity-60" />
                <div className="relative w-full overflow-hidden">
                    <motion.div
                        className="flex gap-12 whitespace-nowrap text-xs uppercase tracking-[0.6em] text-white/35"
                        variants={marqueeVariants}
                        animate="animate"
                    >
                        {[...marqueeTitles, ...marqueeTitles].map(
                            (title, index) => (
                                <span key={`${title}-${index}`}>{title}</span>
                            )
                        )}
                    </motion.div>
                </div>
            </section>
        </>
    );
}
