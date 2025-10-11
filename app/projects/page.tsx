"use client";
import ProjectPreview from "@/components/ProjectPreview";
import projectPreviews from "@/data/projectPreviews";
import { motion } from "framer-motion";
import Card from "@/components/Card";

const boxAnim = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { delayChildren: 0.3, staggerChildren: 0.2 },
    },
};

export default function Projects() {
    return (
        <>
            <section className="relative flex justify-center overflow-hidden bg-[#050506] py-32 text-white">
                <div className="absolute inset-0 bg-noir-gradient" />
                <div className="absolute inset-0 bg-noir-radial opacity-70" />
                <div className="relative w-11/12 max-w-[1080px] space-y-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col gap-4"
                    >
                        <span className="text-xs uppercase tracking-[0.4em] text-white/40">
                            Selected builds
                        </span>
                        <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                            A portfolio of problem-first engineering.
                        </h1>
                        <p className="max-w-2xl text-sm text-white/60">
                            These are the systems, tools, and experiences I ship. Every project is built end-to-end — product thinking, architecture, implementation, polish.
                        </p>
                    </motion.div>
                </div>
            </section>
            <section className="flex justify-center bg-[#050506] py-24">
                <motion.div
                    className="grid w-11/12 max-w-[1080px] grid-flow-row grid-cols-1 gap-12 md:grid-cols-2"
                    variants={boxAnim}
                    initial="hidden"
                    animate="visible"
                >
                    {projectPreviews.map((project, index) => (
                        <ProjectPreview
                            key={index}
                            image={project.image}
                            title={project.title}
                            sub={project.sub}
                            description={project.description}
                            icons={project.icons}
                            color={project.color}
                            index={index}
                            projectLink={project.projectLink}
                            slug={project.slug}
                        />
                    ))}
                </motion.div>
            </section>
        </>
    );
}
