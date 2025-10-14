"use client";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { StaticImageData } from "next/image";
import fuego from "@/public/experience/fuego.webp";
import SAP from "@/public/experience/SAP.png";
import Eureka from "@/public/experience/Eureka.png";
import Averroes from "@/public/experience/averroes.png";
// import Triway from "@/../public/experience/triway.png";
import WAT from "@/public/experience/wat_ai_logo.jpeg";
import Image from "next/image";
import MidnightSun from "@/public/experience/midnightsun.png";
import GrandCharter from "@/public/experience/grandcharter.jpeg";
import Card from "@/components/Card";
import type { AmbientVariant } from "@/components/AmbientGradient";
import { FiX } from "react-icons/fi";
import { cn } from "@/utils/cn";

type Job = {
    title: string;
    company: string;
    location: string;
    period: string;
    description: string;
    image: {
        src: StaticImageData;
        alt: string;
        width?: number;
        height?: number;
        priority?: boolean;
    };
    ambientVariant?: AmbientVariant;
    locationClass?: string;
    periodClass?: string;
};

type JobProps = {
    job: Job;
    onSelect: () => void;
    delay: number;
    isActive: boolean;
};

function Job({ job, onSelect, delay, isActive }: JobProps) {
    return (
        <motion.li
            className="list-none"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay, ease: "easeOut" }}
        >
            <Card
                variant="glass"
                ambient
                ambientVariant={job.ambientVariant ?? "violet"}
                ambientSeed={job.title}
                ambientClassName="opacity-40"
                className={cn(
                    "transition-transform duration-300 border border-white/10 backdrop-blur focus-within:ring-2 focus-within:ring-white/60",
                    !isActive && "hover:-translate-y-1",
                    isActive ? "ring-1 ring-white/20" : "cursor-pointer"
                )}
            >
                <button
                    type="button"
                    onClick={onSelect}
                    disabled={isActive}
                    className="flex items-start w-full gap-5 p-6 text-left focus-visible:outline-none disabled:cursor-default"
                >
                    <div className="flex items-center justify-center h-14 w-14">
                        <Image
                            src={job.image.src}
                            alt={job.image.alt}
                            width={56}
                            height={56}
                            priority={job.image.priority}
                            className="z-10 object-contain rounded-lg h-14 w-14"
                        />
                    </div>
                    <div className="flex flex-col flex-1 gap-3 my-auto">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3 className="text-base font-medium text-white">
                                {job.company}
                            </h3>
                            <span
                                className={`text-xs uppercase tracking-[0.2em] ${
                                    job.locationClass ?? "text-white/55"
                                }`}
                            >
                                {job.location}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                            <p className="font-extralight text-white/65">
                                {job.title}
                            </p>
                            <span
                                className={`text-xs uppercase tracking-[0.1em] ${
                                    job.periodClass ?? "text-white/45"
                                }`}
                            >
                                {job.period}
                            </span>
                        </div>
                    </div>
                </button>
            </Card>
        </motion.li>
    );
}

const jobs: Job[] = [
    {
        title: "Software Engineering Intern #7",
        company: "Grand Charter",
        location: "New York",
        period: "Sep 2025 — Present",
        description:
            "• Building cutting-edge tools and solutions for legal teams.",
        image: {
            src: GrandCharter,
            alt: "Grand Charter Logo",
        },
        ambientVariant: "violet",
    },
    {
        title: "Software Engineering Intern",
        company: "Fuego.io",
        location: "San Francisco",
        period: "Jan 2025 — Apr 2025",
        description:
            "• Optimized core AI generation features by developing custom architecture, accelerating response times to be 17.7x faster (15.4s → 0.87s avg), reducing token usage and slashing costs by similar margins",
        image: {
            src: fuego,
            alt: "Fuego.io Logo",
        },
        ambientVariant: "tangerine",
        locationClass: "text-[rgba(255,196,158,0.9)]",
        periodClass: "text-[rgba(255,220,200,0.85)]",
    },
    {
        title: "Software Developer",
        company: "WAT.ai - AI Sentiment Pulse",
        location: "Waterloo",
        period: "May 2025 — Present",
        description:
            "• Created a webscraper using Python to extract and score 100+ articles on Yahoo News for overall sentiments",
        image: {
            src: WAT,
            alt: "WAT.ai Logo",
        },
        ambientVariant: "emerald",
    },
    {
        title: "Firmware Team Member",
        company: "Midnight Sun",
        location: "Waterloo",
        period: "Sep 2024 — Present",
        description:
            "• Developing ping testing functions in Python and C to verify connectivity across CAN networks",
        image: {
            src: MidnightSun,
            alt: "Midnight Sun Logo",
        },
        ambientVariant: "sunset",
    },
    {
        title: "Prototype Engineering Intern",
        company: "Averroes Technologies",
        location: "Toronto",
        period: "Jul 2024 — Aug 2024",
        description:
            "• Developed 12 firmware prototypes in C++ for iterative product validation",
        image: {
            src: Averroes,
            alt: "Averroes Technologies Logo",
        },
        ambientVariant: "violet",
    },
    {
        title: "Software Developer Co-op Student",
        company: "SAP",
        location: "Toronto",
        period: "Feb 2024 — Jul 2024",
        description:
            "• Created a worker to handle and sanitize GPT-4o requests using TypeScript reducing request errors by 23%",
        image: {
            src: SAP,
            alt: "SAP Logo",
        },
        ambientVariant: "blue",
        locationClass: "text-[rgba(170,210,255,0.9)]",
        periodClass: "text-[rgba(195,230,255,0.85)]",
    },
    {
        title: "FullStack Developer Lead",
        company: "EurekaHacks 2024",
        location: "Oakville",
        period: "Nov 2023 — May 2024",
        description:
            "• Improved page load times by 160%, and reduced LCP, leading to 3,800+ impressions and 1,100+ clicks",
        image: {
            src: Eureka,
            alt: "Eureka Hacks Logo",
        },
        ambientVariant: "sunset",
    },
];

export default function Experience() {
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    const closeModal = useCallback(() => {
        setSelectedJob(null);
    }, []);

    useEffect(() => {
        if (!selectedJob) {
            return;
        }
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                closeModal();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [closeModal, selectedJob]);

    const cardBaseDelay = 0.5;
    const cardStep = 0.14;

    return (
        <>
            <ol className="grid gap-4 list-none md:grid-cols-2 md:gap-4">
                {jobs.map((job, index) => (
                    <Job
                        key={job.company + job.period}
                        job={job}
                        delay={cardBaseDelay + index * cardStep}
                        isActive={
                            selectedJob?.company === job.company &&
                            selectedJob?.period === job.period
                        }
                        onSelect={() => setSelectedJob(job)}
                    />
                ))}
            </ol>
            <AnimatePresence>
                {selectedJob && (
                    <motion.div
                        className="fixed inset-0 z-40 flex items-center justify-center px-4 py-10 bg-black/60 backdrop-blur"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                    >
                        <motion.div
                            className="relative w-full max-w-xl"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 40 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            onClick={(event) => event.stopPropagation()}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="experience-modal-heading"
                        >
                            <Card
                                variant="glass"
                                ambient
                                ambientVariant={
                                    selectedJob.ambientVariant ?? "violet"
                                }
                                ambientSeed={selectedJob.title}
                                ambientClassName="opacity-60"
                                className="flex flex-col gap-6 p-8 md:p-10 rounded-3xl"
                                motionProps={{
                                    layoutId: `${selectedJob.company}-${selectedJob.period}`,
                                    transition: {
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 28,
                                    },
                                }}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <motion.div
                                            layoutId={`${selectedJob.company}-${selectedJob.period}-container`}
                                            className="flex items-center justify-center w-16 h-16"
                                        >
                                            <Image
                                                src={selectedJob.image.src}
                                                alt={selectedJob.image.alt}
                                                width={64}
                                                height={64}
                                                className="z-10 object-contain w-16 h-16 rounded-xl"
                                            />
                                        </motion.div>
                                        <div className="flex flex-col gap-3 text-white">
                                            <motion.h3
                                                id="experience-modal-heading"
                                                layoutId={`${selectedJob.company}-${selectedJob.period}-company`}
                                                className="text-xl font-semibold"
                                            >
                                                {selectedJob.company}
                                            </motion.h3>
                                            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/50">
                                                <motion.span
                                                    layoutId={`${selectedJob.company}-${selectedJob.period}-location`}
                                                    className={
                                                        selectedJob.locationClass ??
                                                        "text-white/55"
                                                    }
                                                >
                                                    {selectedJob.location}
                                                </motion.span>
                                                <span className="hidden sm:inline text-white/40">
                                                    •
                                                </span>
                                                <motion.span
                                                    layoutId={`${selectedJob.company}-${selectedJob.period}-period`}
                                                    className={
                                                        selectedJob.periodClass ??
                                                        "text-white/45"
                                                    }
                                                >
                                                    {selectedJob.period}
                                                </motion.span>
                                            </div>
                                            <motion.p
                                                layoutId={`${selectedJob.company}-${selectedJob.period}-title`}
                                                className="text-sm font-extralight text-white/65"
                                            >
                                                {selectedJob.title}
                                            </motion.p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        aria-label="Close experience details"
                                        className="flex items-center justify-center transition border rounded-full w-9 h-9 border-white/20 text-white/60 hover:text-white hover:border-white/40"
                                    >
                                        <FiX className="w-4 h-4" />
                                    </button>
                                </div>
                                <motion.p
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.35, delay: 0.1 }}
                                    className="text-sm leading-relaxed text-white/70"
                                >
                                    {selectedJob.description}
                                </motion.p>
                            </Card>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
