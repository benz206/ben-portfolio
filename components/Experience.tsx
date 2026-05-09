"use client";

import { useCallback, useEffect, useEffectEvent, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import Image from "next/image";
import Card from "@/components/Card";
import { cn } from "@/utils/cn";
import type { ExperienceJob } from "@/data/experience";
import { experienceJobs } from "@/data/experience";

type JobProps = {
    job: ExperienceJob;
    onSelect: () => void;
    delay: number;
    isActive: boolean;
};

function Job({ job, onSelect, delay, isActive }: JobProps) {
    const layoutId = `${job.company}-${job.period}`;

    return (
        <m.li
            className="list-none"
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, type: "spring", stiffness: 140, damping: 20 }}
            whileHover={{ y: -6 }}
        >
            <Card
                variant="glass"
                ambient
                ambientVariant={job.ambientVariant ?? "violet"}
                ambientClassName="opacity-40"
                className={cn(
                    "flex gap-5 items-start p-6 backdrop-blur-xl focus-within:ring-2 focus-within:ring-white/60",
                    isActive ? "ring-1 ring-white/25" : "ring-0",
                )}
                motionProps={{
                    layoutId,
                    whileHover: { scale: isActive ? 1 : 1.02 },
                    whileTap: { scale: 0.99 },
                    transition: { type: "spring", stiffness: 220, damping: 26 },
                }}
            >
                <m.button
                    type="button"
                    onClick={onSelect}
                    disabled={isActive}
                    className="flex gap-5 items-start w-full text-left focus-visible:outline-none disabled:cursor-default"
                    layoutId={`${layoutId}-button`}
                >
                    <m.div
                        layoutId={`${layoutId}-container`}
                        className="flex relative justify-center items-center size-16"
                    >
                        <Image
                            src={job.image.src}
                            alt={job.image.alt}
                            width={64}
                            height={64}
                            priority={job.image.priority}
                            className="object-contain z-10 size-16 rounded-xl"
                        />
                    </m.div>
                    <div className="flex flex-col flex-1 gap-1 my-auto">
                        <div className="flex flex-wrap gap-2 justify-between items-center">
                            <m.h3
                                layoutId={`${layoutId}-company`}
                                className="text-base font-medium text-white"
                            >
                                {job.company}
                            </m.h3>
                            <m.span
                                layoutId={`${layoutId}-location`}
                                className={`text-xs uppercase tracking-[0.2em] ${
                                    job.locationClass ?? "text-white/55"
                                }`}
                            >
                                {job.location}
                            </m.span>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-between items-center text-sm">
                            <m.p
                                layoutId={`${layoutId}-title`}
                                className="font-extralight text-white/65"
                            >
                                {job.title}
                            </m.p>
                            <m.span
                                layoutId={`${layoutId}-period`}
                                className={`text-xs uppercase tracking-widest ${
                                    job.periodClass ?? "text-white/45"
                                }`}
                            >
                                {job.period}
                            </m.span>
                        </div>
                    </div>
                </m.button>
            </Card>
        </m.li>
    );
}

type JobModalProps = {
    job: ExperienceJob;
    onClose: () => void;
};

function JobModal({ job, onClose }: JobModalProps) {
    return (
        <m.div
            className="flex fixed inset-0 z-40 justify-center items-center px-4 py-10 backdrop-blur bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <m.div
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
                    ambientVariant={job.ambientVariant ?? "violet"}
                    ambientSeed={job.title}
                    ambientClassName="opacity-60"
                    className="flex flex-col gap-6 p-8 rounded-xl md:p-8"
                    motionProps={{
                        layoutId: `${job.company}-${job.period}`,
                        transition: {
                            type: "spring",
                            stiffness: 260,
                            damping: 28,
                        },
                    }}
                >
                    <div className="flex justify-between items-start">
                        <div className="flex gap-4 items-start">
                            <m.div
                                layoutId={`${job.company}-${job.period}-container`}
                                className="flex justify-center items-center size-16"
                            >
                                <Image
                                    src={job.image.src}
                                    alt={job.image.alt}
                                    width={64}
                                    height={64}
                                    className="object-contain z-10 size-16 rounded-xl"
                                />
                            </m.div>
                            <div className="flex flex-col gap-3 text-white">
                                <m.h3
                                    id="experience-modal-heading"
                                    layoutId={`${job.company}-${job.period}-company`}
                                    className="text-xl font-semibold"
                                >
                                    {job.company}
                                </m.h3>
                                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/50">
                                    <m.span
                                        layoutId={`${job.company}-${job.period}-location`}
                                        className={
                                            job.locationClass ?? "text-white/55"
                                        }
                                    >
                                        {job.location}
                                    </m.span>
                                    <span className="hidden sm:inline text-white/40">
                                        •
                                    </span>
                                    <m.span
                                        layoutId={`${job.company}-${job.period}-period`}
                                        className={
                                            job.periodClass ?? "text-white/45"
                                        }
                                    >
                                        {job.period}
                                    </m.span>
                                </div>
                                <m.p
                                    layoutId={`${job.company}-${job.period}-title`}
                                    className="text-sm font-extralight text-white/65"
                                >
                                    {job.title}
                                </m.p>
                            </div>
                        </div>
                    </div>
                    <m.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.1 }}
                        className="text-sm leading-relaxed text-white/70"
                    >
                        {job.description}
                    </m.p>
                </Card>
            </m.div>
        </m.div>
    );
}

export default function Experience() {
    const [selectedJob, setSelectedJob] = useState<ExperienceJob | null>(null);

    const closeModal = useCallback(() => {
        setSelectedJob(null);
    }, []);

    const onEscape = useEffectEvent((event: KeyboardEvent) => {
        if (event.key === "Escape") {
            closeModal();
        }
    });

    useEffect(() => {
        if (!selectedJob) {
            return;
        }
        window.addEventListener("keydown", onEscape);
        return () => {
            window.removeEventListener("keydown", onEscape);
        };
    }, [selectedJob]);

    const cardBaseDelay = 0.5;
    const cardStep = 0.14;

    return (
        <>
            <ol className="grid gap-4 ml-0 list-none md:grid-cols-2 md:gap-4">
                {experienceJobs.map((job, index) => (
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
                    <JobModal job={selectedJob} onClose={closeModal} />
                )}
            </AnimatePresence>
        </>
    );
}
