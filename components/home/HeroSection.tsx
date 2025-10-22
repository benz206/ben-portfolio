"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import { motion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import type { AmbientVariant } from "@/components/AmbientGradient";
import Card from "@/components/Card";
import CurrentlyPlaying from "@/components/CurrentlyPlaying";
import FuegoLogo from "@/public/experience/fuego.webp";
import GrandCharterLogo from "@/public/experience/grandcharter.jpeg";
import SAPLogo from "@/public/experience/SAP.png";

type RoleCard = {
    title: string;
    company: string;
    location: string;
    period: string;
    image: {
        src: StaticImageData;
        alt: string;
    };
    locationClass?: string;
    periodClass?: string;
    ambientVariant: AmbientVariant;
};

const recentRoles: RoleCard[] = [
    {
        title: "Software Engineering Intern",
        company: "Grand Charter",
        location: "New York",
        period: "Sep 2025 - Present",
        image: {
            src: GrandCharterLogo,
            alt: "Grand Charter logo",
        },
        locationClass: "text-white/60",
        periodClass: "text-white/45",
        ambientVariant: "violet",
    },
    {
        title: "Software Engineering Intern",
        company: "Fuego.io",
        location: "San Francisco",
        period: "Jan 2025 — Apr 2025",
        image: {
            src: FuegoLogo,
            alt: "Fuego logo",
        },
        locationClass: "text-[rgba(255,196,158,0.9)]",
        periodClass: "text-[rgba(255,220,200,0.85)]",
        ambientVariant: "tangerine",
    },
    {
        title: "Software Developer",
        company: "SAP",
        location: "Toronto",
        period: "Feb 2024 - Jul 2024",
        image: {
            src: SAPLogo,
            alt: "SAP Logo",
        },
        locationClass: "text-[rgba(170,210,255,0.9)]",
        periodClass: "text-[rgba(195,230,255,0.85)]",
        ambientVariant: "blue",
    },
];

export default function HeroSection() {
    const rolesHeadingDelay = 0.35;
    const roleCardBaseDelay = 0.5;
    const roleCardStep = 0.14;
    const currentlyPlayingDelay =
        roleCardBaseDelay + recentRoles.length * roleCardStep + 0.35;

    const handleScrollClick = () => {
        const nextSection = document.getElementById("home-next-section");
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section className="relative flex items-center justify-center h-screen home-section">
            <div className="absolute inset-0 bg-noir-gradient" />
            <div className="absolute inset-0 bg-noir-radial opacity-80" />
            <div className="relative flex w-11/12 max-w-[1080px] flex-col gap-16 text-white">
                <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-start">
                    <div className="flex flex-col gap-0 lg:gap-8">
                        <motion.div
                            className="space-y-2 lg:space-y-6"
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.4 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <span className="text-xs uppercase tracking-[0.2em] text-white/50">
                                Building Software
                            </span>
                            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                                Ben Zhou
                            </h1>
                            <p className="max-w-xl font-thin text-md text-white/65">
                                Engineering student at the University of
                                Waterloo with a passion for building{" "}
                                <b>elegant</b>, <b>efficient</b>, and{" "}
                                <b>scalable</b> software.
                            </p>
                        </motion.div>
                        <motion.div
                            className="text-white"
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.4 }}
                            transition={{
                                duration: 0.6,
                                delay: currentlyPlayingDelay,
                            }}
                        >
                            <CurrentlyPlaying />
                        </motion.div>
                    </div>
                    <motion.div
                        className="flex flex-col gap-4"
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{
                            duration: 0.6,
                            delay: rolesHeadingDelay,
                        }}
                    >
                        <span className="text-xs uppercase tracking-[0.2em] text-white/40">
                            Roles
                        </span>
                        {recentRoles.map((role, index) => (
                            <Card
                                key={role.company}
                                variant="glass"
                                ambient
                                ambientVariant={role.ambientVariant}
                                ambientClassName="opacity-40"
                                className="flex items-start gap-5 p-6"
                                motionProps={{
                                    initial: { opacity: 0, y: 24 },
                                    whileInView: { opacity: 1, y: 0 },
                                    viewport: { once: true, amount: 0.4 },
                                    transition: {
                                        duration: 0.6,
                                        delay:
                                            roleCardBaseDelay +
                                            index * roleCardStep,
                                    },
                                }}
                            >
                                <Image
                                    src={role.image.src}
                                    alt={role.image.alt}
                                    width={56}
                                    height={56}
                                    className="z-10 object-contain rounded-lg h-14 w-14"
                                />

                                <div className="flex flex-col flex-1 gap-1 my-auto">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <h2 className="text-base font-medium text-white">
                                            {role.company}
                                        </h2>
                                        <span
                                            className={`text-xs uppercase tracking-[0.2em] ${
                                                role.locationClass ??
                                                "text-white/55"
                                            }`}
                                        >
                                            {role.location}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                                        <p className="font-extralight text-white/65">
                                            {role.title}
                                        </p>
                                        <span
                                            className={`text-xs uppercase tracking-[0.1em] ${
                                                role.periodClass ??
                                                "text-white/45"
                                            }`}
                                        >
                                            {role.period}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </motion.div>
                </div>
            </div>
            <div className="absolute flex flex-col items-center -translate-x-1/2 bottom-12 left-1/2 text-white/70">
                <motion.button
                    type="button"
                    aria-label="Scroll to next section"
                    onClick={handleScrollClick}
                    className="flex flex-col items-center gap-1 p-2 transition-transform rounded-full cursor-pointer hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                >
                    {[0, 1, 2].map((index) => (
                        <FiChevronDown
                            key={index}
                            className="w-6 h-6 -mt-4 animate-arrow-flicker text-white/30"
                            style={{
                                animationDelay: `${index * 0.3}s`,
                            }}
                        />
                    ))}
                </motion.button>
            </div>
        </section>
    );
}
