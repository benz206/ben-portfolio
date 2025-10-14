"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import { FiAward, FiCpu, FiTrendingUp } from "react-icons/fi";
import type { AmbientVariant } from "@/components/AmbientGradient";
import Card from "@/components/Card";
import CompEng from "@/public/home/compeng.jpg";

type Achievement = {
    title: string;
    tag: string;
    description: string;
    icon: IconType;
    ambientVariant: AmbientVariant;
    tagClass?: string;
};

const achievements: Achievement[] = [
    {
        title: "Building Tooling",
        tag: "Grand Charter",
        description: "Building complex tooling for the legal world.",
        icon: FiAward,
        ambientVariant: "blue",
        tagClass: "text-[rgba(170,210,255,0.9)]",
    },
    {
        title: "17× faster AI pipelines",
        tag: "Fuego.io",
        description:
            "Optimized architecture to cut response times from 15.4s to 0.87s.",
        icon: FiCpu,
        ambientVariant: "tangerine",
        tagClass: "text-[rgba(255,220,200,0.85)]",
    },
    {
        title: "Built EurekaHacks 2024",
        tag: "EurekaHacks",
        description:
            "Built a cool hackathon website gaining nearly 3,000 impressions.",
        icon: FiTrendingUp,
        ambientVariant: "sunset",
        tagClass: "text-[rgba(255,210,180,0.85)]",
    },
];

export default function AboutMe() {
    const cardBaseDelay = 0.4;
    const cardStep = 0.12;

    return (
        <section
            id="home-next-section"
            className="relative flex items-center justify-center min-h-screen py-20 text-white home-section bg-noir-gradient-cool"
        >
            <div className="absolute inset-0 opacity-80 bg-noir-radial-cool" />
            <div className="relative grid w-11/12 max-w-[1080px] gap-16 text-white lg:grid-cols-[minmax(320px,0.95fr)_minmax(0,1.05fr)] lg:items-start">
                <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                >
                    <Card
                        variant="glass"
                        ambient
                        ambientVariant="magenta"
                        ambientClassName="opacity-40"
                        className="flex flex-col gap-6 p-8"
                    >
                        <div className="space-y-4">
                            <h2 className="text-3xl font-semibold">About Me</h2>
                            <p className="text-sm font-light text-white/60">
                                I&apos;m a computer engineering student at the
                                University of Waterloo, who builds anything and
                                everything I find interesting.
                            </p>
                        </div>
                        <Image
                            className="z-10 object-cover w-full h-64 rounded-2xl"
                            src={CompEng}
                            alt="Workbench setup with a custom macroboard"
                            width={489}
                            height={367}
                            loading="lazy"
                        />
                    </Card>
                </motion.div>
                <motion.div
                    className="flex flex-col gap-4"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.6, delay: 0.25 }}
                >
                    <span className="text-xs uppercase tracking-[0.2em] text-white/40">
                        Some things I&apos;ve done
                    </span>
                    {achievements.map((achievement, index) => {
                        const Icon = achievement.icon;

                        return (
                            <Card
                                key={achievement.title}
                                variant="glass"
                                ambient
                                ambientVariant={achievement.ambientVariant}
                                ambientClassName="opacity-40"
                                className="flex items-start gap-5 p-6"
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
                                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 text-white/70">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col flex-1 gap-2">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <h3 className="text-base font-medium text-white">
                                            {achievement.title}
                                        </h3>
                                        <span
                                            className={`text-xs uppercase tracking-[0.2em] ${
                                                achievement.tagClass ??
                                                "text-white/45"
                                            }`}
                                        >
                                            {achievement.tag}
                                        </span>
                                    </div>
                                    <p className="text-sm text-white/65 font-extralight">
                                        {achievement.description}
                                    </p>
                                </div>
                            </Card>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
