"use client";

import { useMemo, useRef } from "react";
import { motion, easeInOut } from "framer-motion";
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
        <section className="relative overflow-hidden border-t border-white/5 pb-24 pt-20 text-white lg:pb-32">
            <div className="pointer-events-none absolute inset-0 bg-noir-gradient" />
            <div className="pointer-events-none absolute inset-0 opacity-75 bg-noir-radial" />
            <div className="relative z-10 mx-auto flex w-11/12 max-w-[1040px] flex-col gap-10">
                <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-white/35">
                            <span>Repository archive</span>
                            <span className="h-px w-16 bg-white/10" />
                        </div>
                        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                            Filter, sort, and browse the full set.
                        </h2>
                    </div>
                    <p className="max-w-md text-sm text-white/55 sm:text-right">
                        A lighter pass over the full repo list, with quick
                        sorting and language breakdowns.
                    </p>
                </header>
                <div className="grid gap-6 text-white lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">
                    <aside className="flex w-full flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
                        <Card
                            variant="glass"
                            ambient
                            ambientVariant="indigo"
                            ambientClassName="opacity-25"
                            className="flex flex-col gap-3 p-6"
                            motionProps={{ variants: fadeIn }}
                        >
                            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/45">
                                Search repos
                                <input
                                    value={searchTerm}
                                    onChange={(event) =>
                                        setSearchTerm(event.target.value)
                                    }
                                    placeholder="Search by name"
                                    className="rounded-full border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-white/35 focus:outline-none focus:ring-0"
                                />
                            </label>
                        </Card>
                        <Card
                            variant="glass"
                            ambient
                            ambientVariant="sunset"
                            ambientClassName="opacity-25"
                            className="flex flex-col gap-4 p-6"
                            motionProps={{ variants: fadeIn }}
                        >
                            <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/45">
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
                                        className="flex items-center gap-4"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-semibold">
                                            {entry.percentage}%
                                        </div>
                                        <div className="flex flex-1 items-center justify-between">
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
                                                : "border-white/15 bg-white/5 text-white/65 hover:border-white/35 hover:text-white"
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
                    </aside>
                    <motion.div
                        ref={timelineRef}
                        className="flex w-full flex-col gap-6"
                        initial={{ opacity: 0, y: 48 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: easeInOut }}
                    >
                        {filteredRepoData.length === 0 && (
                            <Card
                                variant="glass"
                                ambient
                                ambientVariant="violet"
                                ambientClassName="opacity-25"
                                className="flex min-h-[240px] flex-col items-center justify-center p-10 text-center text-white/60"
                            >
                                No repositories match the current filters.
                            </Card>
                        )}
                        {filteredRepoData.map((repo, index) => (
                            <RepoCard key={repo.id} repo={repo} index={index} />
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
