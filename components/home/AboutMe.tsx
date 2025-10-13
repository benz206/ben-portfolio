"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import { FiActivity, FiCpu, FiHeadphones } from "react-icons/fi";
import type { AmbientVariant } from "@/components/AmbientGradient";
import Card from "@/components/Card";
import CompEng from "@/public/home/compeng.jpg";

type Highlight = {
    title: string;
    tag: string;
    description: string;
    icon: IconType;
    ambientVariant: AmbientVariant;
    ambientSeed: string;
    tagClass?: string;
};

const personalHighlights: Highlight[] = [
    {
        title: "Projects",
        tag: "Projects",
        description:
            "I design and build hardware-software hybrids that bridge embedded systems with thoughtful interfaces.",
        icon: FiCpu,
        ambientVariant: "indigo",
        ambientSeed: "projects",
    },
    {
        title: "Music",
        tag: "Music",
        description:
            "I trade playlists, learn new pieces, and keep a steady rotation of instruments nearby.",
        icon: FiHeadphones,
        ambientVariant: "blue",
        ambientSeed: "soundtrack",
        tagClass: "text-[rgba(180,210,255,0.85)]",
    },
    {
        title: "Sports",
        tag: "Sports",
        description:
            "Pickup games, trail runs, and a weekly training routine keep me energized outside the lab.",
        icon: FiActivity,
        ambientVariant: "crimson",
        ambientSeed: "sports",
    },
];

export default function OperatingCadenceSection() {
    const cardBaseDelay = 0.4;
    const cardStep = 0.12;

    return (
        <section
            id="home-next-section"
            className="flex relative justify-center items-center py-20 min-h-screen text-white home-section bg-noir-gradient-cool"
        >
            <div className="absolute inset-0 opacity-80 bg-noir-radial-cool" />
            <div className="relative flex w-11/12 max-w-[1080px] flex-col gap-16 lg:flex-row lg:items-center">
                <motion.div
                    className="flex flex-col flex-1 gap-4"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.6, delay: 0.25 }}
                >
                    <span className="text-xs uppercase tracking-[0.2em] text-white/40">
                        My interests include
                    </span>
                    {personalHighlights.map((highlight, index) => {
                        const Icon = highlight.icon;

                        return (
                            <Card
                                key={highlight.title}
                                variant="glass"
                                ambient
                                ambientVariant={highlight.ambientVariant}
                                ambientSeed={highlight.ambientSeed}
                                ambientClassName="opacity-80"
                                className="flex gap-5 items-start p-6"
                                motionProps={{
                                    initial: { opacity: 0, y: 24 },
                                    whileInView: { opacity: 1, y: 0 },
                                    viewport: { once: true, amount: 0.4 },
                                    transition: {
                                        duration: 0.6,
                                        delay: cardBaseDelay + index * cardStep,
                                    },
                                }}
                            >
                                <div className="flex justify-center items-center w-12 h-12 rounded-xl bg-white/10 text-white/70">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col flex-1 gap-2">
                                    <div className="flex flex-wrap gap-2 justify-between items-center">
                                        <h3 className="text-base font-medium text-white">
                                            {highlight.title}
                                        </h3>
                                        <span
                                            className={`text-xs uppercase tracking-[0.2em] ${
                                                highlight.tagClass ?? "text-white/45"
                                            }`}
                                        >
                                            {highlight.tag}
                                        </span>
                                    </div>
                                    <p className="text-sm text-white/65">
                                        {highlight.description}
                                    </p>
                                </div>
                            </Card>
                        );
                    })}
                </motion.div>
                <motion.div
                    className="flex-1 space-y-6"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                >
                    <Card
                        variant="glass"
                        ambient
                        ambientVariant="sunset"
                        ambientSeed="about-me"
                        ambientClassName="opacity-40"
                        className="flex flex-col gap-6 p-8"
                    >
                        <div className="space-y-4">
                            <h2 className="text-3xl font-semibold">
                                About Me
                            </h2>
                            <p className="text-sm font-light text-white/60">
                                I&apos;m a computer engineering student at the University of Waterloo, interested in the world of hardware and software.
                            </p>
                        </div>
                        <Image
                            className="object-cover w-full h-64 rounded-2xl"
                            src={CompEng}
                            alt="Workbench setup with a custom macroboard"
                            width={489}
                            height={367}
                            loading="lazy"
                        />
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}
