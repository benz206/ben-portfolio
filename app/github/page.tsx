"use client";

import { m } from "framer-motion";
import { useRef } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import ContributionHeatmap from "@/components/GitHub/ContributionHeatmap";
import RepoExplorer from "@/components/GitHub/RepoExplorer";
import { useGithubData } from "./useGithubData";
import { fadeIn } from "@/utils/motion";

export default function GithubPage() {
    const heroRef = useRef(null);
    const {
        isLoading,
        repoData,
        stats,
        contributionWeeks,
        maxContributionCount,
    } = useGithubData();

    if (isLoading && !repoData.length) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#050506]">
                <AiOutlineLoading className="size-16 animate-spin text-white/60" />
            </main>
        );
    }

    return (
        <main className="overflow-hidden relative text-white">
            <style>{`
                @keyframes githubHueCycle {
                    0% {
                        filter: hue-rotate(0deg) saturate(100%);
                    }
                    50% {
                        filter: hue-rotate(30deg) saturate(130%);
                    }
                    100% {
                        filter: hue-rotate(60deg) saturate(120%);
                    }
                }
            `}</style>
            <section className="relative flex min-h-[200vh] items-center px-4 pb-16 pt-24 sm:px-6 md:min-h-screen lg:h-screen lg:pb-0 lg:pt-0">
                <div className="absolute inset-0 bg-noir-gradient" />
                <div className="absolute inset-0 opacity-80 bg-noir-radial" />
                <m.div
                    ref={heroRef}
                    className="relative z-10 mx-auto flex w-full max-w-270 flex-col gap-12 sm:gap-16"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { transition: { staggerChildren: 0.12 } },
                        hidden: {},
                    }}
                >
                    <m.div
                        variants={fadeIn}
                        className="space-y-8 lg:space-y-12"
                    >
                        <div className="space-y-2 lg:space-y-6">
                            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                                GitHub
                            </h1>
                            <p className="max-w-2xl text-sm text-white/70 sm:text-base">
                                Track my open-source projects, filter through
                                repositories, and explore contribution trends
                                from the past year.
                            </p>
                        </div>
                    </m.div>
                    <ContributionHeatmap
                        weeks={contributionWeeks}
                        maxCount={maxContributionCount}
                        totalCommits={stats?.commits ?? 0}
                    />
                </m.div>
            </section>

            <RepoExplorer repos={repoData} />
        </main>
    );
}
