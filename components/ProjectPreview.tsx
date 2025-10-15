import { ProjectPreviewProps } from "@/types";
import Image from "next/image";
import { motion, easeInOut, useMotionValue, useTransform } from "framer-motion";
import { FaArrowRight } from "react-icons/fa6";
import { MdOpenInNew } from "react-icons/md";
import Link from "next/link";
import LanguageBadge from "@/components/LanguageBadge";
import Card from "@/components/Card";

const colorVariants: Record<
    string,
    { accent: string; border: string; text: string }
> = {
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
    "orange-500": {
        accent: "ring-1 ring-[#ffb35c]/30",
        border: "border-[#ffb35c]/40",
        text: "text-[#ffb35c]",
    },
    "amber-500": {
        accent: "ring-1 ring-[#ffcb5c]/30",
        border: "border-[#ffcb5c]/40",
        text: "text-[#ffcb5c]",
    },
    "amber-400": {
        accent: "ring-1 ring-[#ffd47a]/30",
        border: "border-[#ffd47a]/40",
        text: "text-[#ffd47a]",
    },
    "indigo-500": {
        accent: "ring-1 ring-[#9ba6ff]/30",
        border: "border-[#9ba6ff]/40",
        text: "text-[#9ba6ff]",
    },
    "teal-500": {
        accent: "ring-1 ring-[#74e2c7]/30",
        border: "border-[#74e2c7]/40",
        text: "text-[#74e2c7]",
    },
    "rose-500": {
        accent: "ring-1 ring-[#ff94b3]/30",
        border: "border-[#ff94b3]/40",
        text: "text-[#ff94b3]",
    },
    "emerald-600": {
        accent: "ring-1 ring-[#73f5c6]/30",
        border: "border-[#73f5c6]/40",
        text: "text-[#73f5c6]",
    },
    "fuchsia-400": {
        accent: "ring-1 ring-[#f4a3ff]/30",
        border: "border-[#f4a3ff]/40",
        text: "text-[#f4a3ff]",
    },
    "purple-400": {
        accent: "ring-1 ring-[#c0a3ff]/30",
        border: "border-[#c0a3ff]/40",
        text: "text-[#c0a3ff]",
    },
    "red-500": {
        accent: "ring-1 ring-[#ff8b8b]/30",
        border: "border-[#ff8b8b]/40",
        text: "text-[#ff8b8b]",
    },
    "yellow-400": {
        accent: "ring-1 ring-[#ffe27a]/30",
        border: "border-[#ffe27a]/40",
        text: "text-[#ffe27a]",
    },
    "sky-600": {
        accent: "ring-1 ring-[#7fc5ff]/30",
        border: "border-[#7fc5ff]/40",
        text: "text-[#7fc5ff]",
    },
    "green-400": {
        accent: "ring-1 ring-[#81f29d]/30",
        border: "border-[#81f29d]/40",
        text: "text-[#81f29d]",
    },
    "cyan-300": {
        accent: "ring-1 ring-[#84f2ff]/30",
        border: "border-[#84f2ff]/40",
        text: "text-[#84f2ff]",
    },
    default: {
        accent: "ring-1 ring-white/10",
        border: "border-white/15",
        text: "text-white/70",
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
    languages,
    color,
    projectLink,
    slug,
}: ProjectPreviewProps) {
    const colorVariant = colorVariants[color] || colorVariants.default;
    const hoverY = useMotionValue(0);
    const hoverRotate = useTransform(hoverY, [-10, 10], [-2, 2]);
    return (
        <motion.li className="list-none" variants={boxItem}>
            <motion.div
                onHoverStart={() => hoverY.set(-10)}
                onHoverEnd={() => hoverY.set(0)}
                style={{ rotate: hoverRotate, y: hoverY }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
            >
                <Card
                    className={`group flex flex-col justify-center border ${colorVariant.border} ${colorVariant.accent} w-full`}
                    variant="glass"
                    size="lg"
                    ambient
                    ambientSeed={title}
                    ambientClassName="opacity-80"
                >
                    <div className="relative overflow-hidden rounded-md">
                        <motion.div
                            className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:opacity-80"
                            style={{ rotate: hoverRotate }}
                        />
                        <Image
                            className="z-10 h-auto w-full rounded-md object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                            src={image.src}
                            width={image.width ? image.width : 100}
                            alt={image.alt}
                            loading={image.priority ? "eager" : "lazy"}
                            priority={image.priority}
                        />
                    </div>
                    <h2 className="px-2 mt-6 text-lg font-semibold text-white lg:text-xl">
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
                    <div className="flex flex-wrap items-center gap-2 px-2 pt-4">
                        {languages.map((language) => (
                            <LanguageBadge key={language} language={language} />
                        ))}
                    </div>
                    <div className="flex justify-center w-full mt-6">
                        <div className="h-[1px] w-full bg-white/10" />
                    </div>
                    <div className="flex items-center px-2 pt-6 pb-4">
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
            </motion.div>
        </motion.li>
    );
}
