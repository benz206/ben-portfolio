"use client";

import { m } from "framer-motion";
import Card from "@/components/Card";
import ContributionHeatmapGrid from "@/components/home/ContributionHeatmapGrid";
import { useGithubContributions } from "@/components/home/useGithubContributions";

const fadeIn = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 },
    },
};

export default function GithubContributionsSection() {
    const { weeks, maxCount, monthLabels } = useGithubContributions();

    return (
        <section className="flex relative justify-center items-center py-24 home-section">
            <div className="absolute inset-0 bg-noir-gradient-berry" />
            <div className="absolute inset-0 opacity-90 bg-noir-radial-berry" />
            <div className="relative z-10 flex w-11/12 max-w-270 flex-col gap-10 text-white">
                <m.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.4 }}
                    variants={fadeIn}
                    className="space-y-3"
                >
                    <span className="text-xs uppercase tracking-[0.2em] text-white/45">
                        GitHub
                    </span>
                </m.div>

                <m.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeIn}
                >
                    <Card
                        variant="glass"
                        ambient
                        ambientVariant="violet"
                        ambientClassName="opacity-40"
                        className="flex relative flex-col gap-4 p-6 w-full"
                    >
                        <div className="flex gap-4 items-start">
                            <div className="flex flex-col gap-2 pt-5.5 text-[11px] text-white/35">
                                <span>Mon</span>
                                <span>Wed</span>
                                <span>Fri</span>
                            </div>
                            <div className="overflow-hidden flex-1">
                                <ContributionHeatmapGrid
                                    weeks={weeks}
                                    maxCount={maxCount}
                                    monthLabels={monthLabels}
                                />
                            </div>
                        </div>
                    </Card>
                </m.div>
            </div>
        </section>
    );
}
