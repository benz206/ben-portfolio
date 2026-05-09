"use client";

import { useMemo, useRef } from "react";
import { m, easeInOut } from "framer-motion";
import Card from "@/components/Card";
import type { GitHubRepo } from "@/types";
import { useRepoFilterSort } from "@/components/GitHub/useRepoFilterSort";
import RepoCard from "@/components/GitHub/RepoCard";

const fadeIn = {
    hidden: { opacity: 0, y: 32 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: easeInOut },
    },
};

type RepoExplorerProps = {
    repos: GitHubRepo[];
};

export default function RepoExplorer({ repos }: RepoExplorerProps) {
    const timelineRef = useRef(null);
    const {
        sortBy,
        sortOrder,
        searchTerm,
        setSearchTerm,
        filteredRepoData,
        handleSortChange,
        sortOptions,
    } = useRepoFilterSort(repos);

    const languagePulse = useMemo(() => {
        if (!repos.length) return [];
        const counts: Record<string, number> = {};
        repos.forEach((repo) => {
            if (!repo.language) return;
            counts[repo.language] = (counts[repo.language] || 0) + 1;
        });
        const total = Object.values(counts).reduce(
            (sum, count) => sum + count,
            0,
        );
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .map(([language, count]) => ({
                language,
                count,
                percentage: Math.round((count / Math.max(total, 1)) * 100),
            }));
    }, [repos]);

    return (
        <section className="flex relative flex-col px-4 py-24 min-h-screen border-t border-white/5 sm:px-6 lg:px-12">
            <div className="absolute inset-0 bg-noir-gradient" />
            <div className="absolute inset-0 opacity-75 bg-noir-radial" />
            <div className="relative z-10 mx-auto flex h-screen w-full max-w-270 flex-col gap-10">
                <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-2">
                        <span className="text-xs uppercase tracking-[0.3em] text-white/50">
                            Repository explorer
                        </span>
                        <h2 className="text-3xl font-semibold tracking-tight">
                            Filter, sort, and dive into featured repos.
                        </h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {sortOptions.map(({ option, label }) => {
                            const active = sortBy === option;
                            return (
                                <button
                                    key={option}
                                    onClick={() => handleSortChange(option)}
                                    className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.25em] transition ${
                                        active
                                            ? "border-white bg-white text-black"
                                            : "border-white/15 bg-white/5 text-white/70 hover:border-white/40 hover:text-white"
                                    }`}
                                >
                                    {label}
                                    {active && (
                                        <span className="ml-2 text-[0.65rem] tracking-[0.2em]">
                                            {sortOrder === "asc"
                                                ? "asc"
                                                : "desc"}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </header>
                <div className="flex flex-col gap-6 text-white lg:flex-row lg:gap-8">
                    <aside className="flex flex-col gap-6 w-full lg:max-w-sm">
                        <Card
                            variant="glass"
                            ambient
                            ambientVariant="indigo"
                            ambientClassName="opacity-30"
                            className="flex flex-col gap-3 p-6"
                            motionProps={{ variants: fadeIn }}
                        >
                            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/50">
                                Search repos
                                <input
                                    value={searchTerm}
                                    onChange={(event) =>
                                        setSearchTerm(event.target.value)
                                    }
                                    placeholder="Search by name"
                                    className="px-4 py-3 text-sm text-white rounded-full border border-white/10 bg-white/10 placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-0"
                                />
                            </label>
                        </Card>
                        <Card
                            variant="glass"
                            ambient
                            ambientVariant="sunset"
                            ambientClassName="opacity-35"
                            className="flex flex-col gap-4 p-6"
                            motionProps={{ variants: fadeIn }}
                        >
                            <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/50">
                                <span>Language pulse</span>
                                <span>{languagePulse.length} tracked</span>
                            </div>
                            <div className="space-y-4">
                                {languagePulse.length === 0 && (
                                    <span className="text-sm text-white/50">
                                        Language data is warming up.
                                    </span>
                                )}
                                {languagePulse.slice(0, 6).map((entry) => (
                                    <div
                                        key={entry.language}
                                        className="flex gap-4 items-center"
                                    >
                                        <div className="flex justify-center items-center size-10 text-sm font-semibold rounded-2xl border border-white/10 bg-white/5">
                                            {entry.percentage}%
                                        </div>
                                        <div className="flex flex-1 justify-between items-center">
                                            <span className="text-sm font-medium text-white/90">
                                                {entry.language}
                                            </span>
                                            <span className="text-xs uppercase tracking-[0.25em] text-white/40">
                                                {entry.count} repos
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </aside>
                    <m.div
                        ref={timelineRef}
                        className="flex overflow-y-auto flex-col flex-1 gap-8 pr-2 w-full"
                        initial={{ opacity: 0, y: 48 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: easeInOut }}
                    >
                        {filteredRepoData.length === 0 && (
                            <Card
                                variant="glass"
                                ambient
                                ambientVariant="violet"
                                ambientClassName="opacity-30"
                                className="flex min-h-60 flex-col items-center justify-center p-10 text-center text-white/60"
                            >
                                No repositories match the current filters.
                            </Card>
                        )}
                        {filteredRepoData.map((repo, index) => (
                            <RepoCard key={repo.id} repo={repo} index={index} />
                        ))}
                    </m.div>
                </div>
            </div>
        </section>
    );
}
