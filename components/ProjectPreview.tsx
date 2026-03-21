"use client";

import { ProjectPreviewProps } from "@/types";
import Image from "next/image";
import { motion } from "framer-motion";
import LanguageBadge from "@/components/LanguageBadge";
import { cn } from "@/utils/cn";
import { AmbientGradient } from "@/components/AmbientGradient";

type PreviewProps = ProjectPreviewProps & {
    index?: number;
    onSelect?: () => void;
};

export default function ProjectPreview({
    image,
    title,
    sub,
    summary,
    languages,
    color,
    index = 0,
    onSelect,
}: PreviewProps) {
    const accent = colorVariants[color] || colorVariants.default;

    return (
        <motion.li
            className="list-none"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.55,
                ease: "easeOut",
                delay: index * 0.06,
            }}
        >
            <motion.button
                type="button"
                onClick={onSelect}
                disabled={!onSelect}
                whileHover={onSelect ? { y: -8 } : undefined}
                whileTap={onSelect ? { scale: 0.97 } : undefined}
                className={cn(
                    "group relative flex h-full w-full overflow-hidden rounded-lg px-0 pb-0 text-left transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                    !onSelect && "cursor-default",
                )}
            >
                <div
                    className={cn(
                        "relative isolate flex h-full w-full flex-col overflow-hidden rounded-lg bg-[#05070f]/80 backdrop-blur-xl shadow-[0_35px_120px_-50px_rgba(6,12,24,0.9)] ring-1 ring-white/10",
                        accent.border,
                    )}
                >
                    <div className="overflow-hidden relative w-full h-64">
                        <Image
                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                            src={image.src}
                            width={image.width || 1200}
                            height={image.height || 800}
                            alt={image.alt}
                            loading={image.priority ? "eager" : "lazy"}
                            priority={image.priority}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t to-transparent transition-opacity duration-700 pointer-events-none from-black/70 via-black/20 group-hover:from-black/55" />
                        <div className="absolute -inset-1 bg-gradient-to-br via-transparent rounded-lg opacity-0 blur-2xl transition-opacity duration-700 pointer-events-none from-white/20 to-white/10 group-hover:opacity-60" />
                    </div>
                    <div className="flex relative z-10 flex-col gap-3 px-6 pt-6">
                        <span className="text-[11px] uppercase tracking-[0.24em] text-white/45">
                            {sub}
                        </span>
                        <h2 className="text-2xl font-semibold text-white">
                            {title}
                        </h2>
                        {summary && (
                            <p className="text-sm font-light leading-relaxed text-white/70">
                                {summary}
                            </p>
                        )}
                    </div>
                    <div className="flex relative z-10 flex-wrap gap-2 px-6 pt-5 pb-6">
                        {languages.map((language) => (
                            <LanguageBadge key={language} language={language} />
                        ))}
                    </div>
                    <AmbientGradient
                        seed={title}
                        className="opacity-70 mix-blend-screen transition-opacity duration-700 group-hover:opacity-95"
                    />
                </div>
            </motion.button>
        </motion.li>
    );
}

const colorVariants: Record<string, { border: string }> = {
    ember: { border: "border-[#ffb199]/25" },
    lilac: { border: "border-[#b8a4ff]/25" },
    teal: { border: "border-[#7ce8c5]/25" },
    slate: { border: "border-[#8ea6ff]/25" },
    "orange-500": { border: "border-[#ffb35c]/25" },
    "amber-500": { border: "border-[#ffcb5c]/25" },
    "amber-400": { border: "border-[#ffd47a]/25" },
    "indigo-500": { border: "border-[#9ba6ff]/25" },
    "teal-500": { border: "border-[#74e2c7]/25" },
    "rose-500": { border: "border-[#ff94b3]/25" },
    "emerald-600": { border: "border-[#73f5c6]/25" },
    "fuchsia-400": { border: "border-[#f4a3ff]/25" },
    "purple-400": { border: "border-[#c0a3ff]/25" },
    "red-500": { border: "border-[#ff8b8b]/25" },
    "yellow-400": { border: "border-[#ffe27a]/25" },
    "sky-600": { border: "border-[#7fc5ff]/25" },
    "green-400": { border: "border-[#81f29d]/25" },
    "cyan-300": { border: "border-[#84f2ff]/25" },
    default: { border: "border-white/20" },
};
