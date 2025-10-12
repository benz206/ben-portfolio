"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import { FiActivity, FiBookOpen, FiCpu, FiHeadphones } from "react-icons/fi";
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
        title: "Analog Craft",
        tag: "Hardware",
        description:
            "Custom keyboards, sensor-packed macroboards, and weekend enclosures keep my hands in the hardware loop.",
        icon: FiCpu,
        ambientVariant: "emerald",
        ambientSeed: "analog-craft",
    },
    {
        title: "Rhythm & Motion",
        tag: "Movement",
        description:
            "Tempo runs with local crews and weekly bouldering sessions reset my brain and feed product momentum.",
        icon: FiActivity,
        ambientVariant: "sunset",
        ambientSeed: "rhythm-motion",
        tagClass: "text-[rgba(255,205,180,0.85)]",
    },
    {
        title: "Learning Loops",
        tag: "Writing",
        description:
            "I distill experiments into essays, share engineering notes with peers, and keep a living design playbook.",
        icon: FiBookOpen,
        ambientVariant: "violet",
        ambientSeed: "learning-loops",
    },
    {
        title: "Soundtrack",
        tag: "Music",
        description:
            "Curating ambient and house sets for deep work, recording mixes on weekends, and trading tracks with friends.",
        icon: FiHeadphones,
        ambientVariant: "blue",
        ambientSeed: "soundtrack",
        tagClass: "text-[rgba(180,210,255,0.85)]",
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
                    <span className="text-xs uppercase tracking-[0.3em] text-white/40">
                        Passions in play
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
                                ambientClassName="opacity-40"
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
                    <span className="text-xs uppercase tracking-[0.4em] text-white/40">
                        About me
                    </span>
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
                            <p className="text-sm text-white/60">
                                Shipping quickly without sanding off the craft is table stakes; so I pair deep focus sprints with restorative breaks that keep my taste sharp and my energy steady.
                            </p>
                            <p className="text-sm text-white/60">
                                When I step away from the editor, I am running tempo loops with friends, sketching hardware ideas, spinning playlists, and writing to capture the lessons.
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
                        <p className="text-sm text-white/55">
                            Weekends often start with solder fumes, playlists on loop, and notes that turn into the next project roadmap.
                        </p>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}
