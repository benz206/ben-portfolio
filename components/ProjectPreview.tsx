import { ProjectPreviewProps } from "@/types";
import Image from "next/image";
import { motion, easeInOut } from "framer-motion";
import { FaArrowRight } from "react-icons/fa6";
import { MdOpenInNew } from "react-icons/md";
import Link from "next/link";
import TechIcon from "./TechIcon";
import Card from "@/components/Card";

const colorVariants: Record<string, { accent: string; border: string; text: string }> = {
    ember: {
        accent: "ring-1 ring-[#ffb199]/30",
        border: "border-[#ffb199]/40",
        text: "text-[#ffb199]",
    },
    lilac: {
        accent: "ring-1 ring-[#b8a4ff]/30",
        border: "border-[#b8a4ff]/40",
        text: "text-[#b8a4ff]",
    },
    teal: {
        accent: "ring-1 ring-[#7ce8c5]/30",
        border: "border-[#7ce8c5]/40",
        text: "text-[#7ce8c5]",
    },
    slate: {
        accent: "ring-1 ring-[#8ea6ff]/30",
        border: "border-[#8ea6ff]/40",
        text: "text-[#8ea6ff]",
    },
    default: {
        accent: "ring-1 ring-white/10",
        border: "border-white/15",
        text: "text-white/70",
    },
};

const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            delayChildren: 0.3,
            staggerChildren: 0.2,
        },
    },
};

const boxItem = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 1,
            ease: easeInOut,
        },
    },
};

export default function ProjectPreview({
    image,
    title,
    sub,
    description,
    icons,
    color,
    projectLink,
    slug,
}: ProjectPreviewProps) {
    const colorVariant = colorVariants[color] || colorVariants.default;
    return (
        <motion.li
            className="self-center list-none justify-self-center"
            variants={boxItem}
        >
            <Card
                className={`group flex flex-col justify-center w-[320px] lg:w-[520px] border ${colorVariant.border} ${colorVariant.accent}`}
                variant="glass"
                size="lg"
                ambient
                ambientSeed={title}
                ambientClassName="opacity-80"
            >
                <Image
                    className="z-10 h-auto w-full rounded-md object-cover"
                    src={image.src}
                    width={image.width ? image.width : 100}
                    alt={image.alt}
                    loading={image.priority ? "eager" : "lazy"}
                    priority={image.priority}
                />
                <h2 className="mt-6 px-2 text-lg font-semibold text-white lg:text-xl">
                    {title}
                </h2>
                <h3
                    className={`px-2 text-xs uppercase tracking-[0.3em] ${colorVariant.text}`}
                >
                    {sub}
                </h3>
                <p className="px-2 pt-3 text-sm text-white/60">
                    {description}
                </p>
                <div className="flex justify-center w-full mt-auto">
                    <div
                        className="h-[1px] w-full bg-white/5"
                    />
                </div>
                <motion.div
                    className="flex py-6 pb-0 place-content-evenly"
                    variants={container}
                    initial="hidden"
                    animate="visible"
                >
                    {icons.map((icon, index) => (
                        <TechIcon
                            key={index}
                            name={icon.alt}
                            image={icon.image}
                            link={icon.link}
                            size="lg"
                        />
                    ))}
                </motion.div>
                <div className="flex items-center px-2 pb-4 pt-6">
                    {projectLink && (
                        <motion.div
                            className="flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.3em] text-white/70 transition-colors hover:text-white"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{
                                type: "spring",
                                stiffness: 100,
                                damping: 8,
                            }}
                        >
                            <MdOpenInNew className="text-base" />
                            <a
                                className="text-xs"
                                target="_blank"
                                href={projectLink}
                            >
                                View Project
                            </a>
                        </motion.div>
                    )}
                    {slug && (
                        <motion.div
                            className="ml-auto flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/60 transition-colors hover:text-white"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{
                                type: "spring",
                                stiffness: 100,
                                damping: 8,
                            }}
                        >
                            <Link
                                className="text-xs"
                                href={`/blog/${slug}`}
                                prefetch={false}
                            >
                                Read More
                            </Link>
                            <FaArrowRight className="text-sm" />
                        </motion.div>
                    )}
                </div>
            </Card>
        </motion.li>
    );
}
