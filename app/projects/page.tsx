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
            <div className="relative top-0 flex justify-center w-full h-[550px] bg-rainbow-gradient animate-breathing-gradient">
                <Card
                    variant="glass"
                    className="relative flex h-[370px] lg:h-[300px] w-11/12 lg:w-[1000px] mt-32 lg:mt-40 rounded-3xl"
                    motionProps={{
                        initial: { y: -20, opacity: 0 },
                        animate: { y: 0, opacity: 1 },
                        transition: { duration: 1 },
                    }}
                >
                    <div className="flex flex-col justify-center w-full h-full p-12">
                        <h2 className="p-2 text-lg text-center">
                            HERE ARE SOME OF MY FINISHED PROJECTS!
                        </h2>
                        <h1 className="p-2 text-4xl font-black text-center lg:text-6xl">
                            PROJECTS
                        </h1>
                        <p className="p-2 py-5 font-light">
                            I work with many languages and technologies, you can
                            see some of them below! I&apos;m always learning new
                            things, and looking for new projects to work on.
                        </p>
                    </div>
                </Card>
            </div>
            <div className="flex flex-col flex-wrap content-center justify-center w-full pt-12 pb-16 lg:pb-20 lg:pt-24">
                <motion.div
                    className="grid gap-y-12 lg:gap-y-10 w-11/12 md:w-[600px] xl:w-[1300px] 3xl:w-[1850px] py-5 grid-flow-row grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3"
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
            </div>
        </>
    );
}
