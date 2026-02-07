"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, easeInOut } from "framer-motion";
import { ImGithub } from "react-icons/im";
import { FaCodeFork, FaStar, FaGithub } from "react-icons/fa6";
import Card from "@/components/Card";
import type { GitHubRepo } from "@/types";

enum SortOption {
    Name = "name",
    Stars = "stars",
    Forks = "forks",
    Language = "language",
}

const fadeIn = {
    hidden: { opacity: 0, y: 32 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: easeInOut },
    },
};

const formatNumber = (value: number) => new Intl.NumberFormat().format(value);

const sortRepositories = (
    repos: GitHubRepo[],
    sortBy: SortOption,
    sortOrder: "asc" | "desc"
) => {
    return [...repos].sort((a, b) => {
        let aValue: string | number = 0;
        let bValue: string | number = 0;
        switch (sortBy) {
            case SortOption.Name:
                aValue = a.name.toLowerCase();
                bValue = b.name.toLowerCase();
                break;
            case SortOption.Stars:
                aValue = a.stargazers_count || 0;
                bValue = b.stargazers_count || 0;
                break;
            case SortOption.Forks:
                aValue = a.forks_count || 0;
                bValue = b.forks_count || 0;
                break;
            case SortOption.Language:
                aValue = (a.language || "").toLowerCase();
                bValue = (b.language || "").toLowerCase();
                break;
        }
        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });
};

const getSortLabel = (option: SortOption) => {
    if (option === SortOption.Name) return "Name";
    if (option === SortOption.Stars) return "Stars";
    if (option === SortOption.Forks) return "Forks";
    return "Language";
};

type RepoExplorerProps = {
    repos: GitHubRepo[];
};

export default function RepoExplorer({ repos }: RepoExplorerProps) {
    const [sortBy, setSortBy] = useState<SortOption>(SortOption.Stars);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredRepoData, setFilteredRepoData] = useState<GitHubRepo[]>([]);
    const timelineRef = useRef(null);

    useEffect(() => {
        setFilteredRepoData(
            sortRepositories(repos, sortBy, sortOrder).filter((repo) =>
                repo.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [repos, sortBy, sortOrder, searchTerm]);

    const languagePulse = useMemo(() => {
        if (!repos.length) return [];
        const counts: Record<string, number> = {};
        repos.forEach((repo) => {
            if (!repo.language) return;
            counts[repo.language] = (counts[repo.language] || 0) + 1;
        });
        const total = Object.values(counts).reduce(
            (sum, count) => sum + count,
            0
        );
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .map(([language, count]) => ({
                language,
                count,
                percentage: Math.round((count / Math.max(total, 1)) * 100),
            }));
    }, [repos]);

    const handleSortChange = (option: SortOption) => {
        if (option === sortBy) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
            return;
        }
        setSortBy(option);
        setSortOrder(option === SortOption.Name ? "asc" : "desc");
    };

    return (
        <section className="flex relative flex-col px-4 py-24 min-h-screen border-t border-white/5 sm:px-6 lg:px-12">
            <div className="absolute inset-0 bg-noir-gradient" />
            <div className="absolute inset-0 opacity-75 bg-noir-radial" />
            <div className="relative z-10 mx-auto flex h-screen w-full max-w-[1080px] flex-col gap-10">
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
                        {Object.values(SortOption).map((option) => {
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
                                    {getSortLabel(option)}
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
                                        <div className="flex justify-center items-center w-10 h-10 text-sm font-semibold rounded-2xl border border-white/10 bg-white/5">
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
                    <motion.div
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
                                className="flex min-h-[240px] flex-col items-center justify-center p-10 text-center text-white/60"
                            >
                                No repositories match the current filters.
                            </Card>
                        )}
                        {filteredRepoData.map((repo, index) => {
                            const updatedLabel = new Date(
                                repo.updated_at
                            ).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            });
                            return (
                                <Card
                                    key={repo.id}
                                    variant="glass"
                                    ambient
                                    ambientVariant="magenta"
                                    ambientSeed={repo.name}
                                    ambientClassName="opacity-40"
                                    className="relative p-8 transition hover:border-white/50"
                                    motionProps={{
                                        initial: { opacity: 0, y: 40 },
                                        animate: { opacity: 1, y: 0 },
                                        transition: {
                                            delay: index * 0.08,
                                            duration: 0.65,
                                            ease: easeInOut,
                                        },
                                    }}
                                >
                                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                                        <div className="flex-1 space-y-4">
                                            <div className="flex flex-wrap gap-4 items-center">
                                                <h3 className="text-2xl font-semibold tracking-tight">
                                                    {repo.name}
                                                </h3>
                                                <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-white/50">
                                                    Updated {updatedLabel}
                                                </span>
                                                {repo.language && (
                                                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70">
                                                        {repo.language}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="max-w-3xl text-sm leading-relaxed text-white/80">
                                                {repo.description ||
                                                    "This project is still catching its breath after the latest deploy."}
                                            </p>
                                            <div className="flex flex-wrap gap-4 items-center text-sm text-white/80">
                                                <span className="inline-flex gap-2 items-center">
                                                    <FaStar className="w-4 h-4 text-yellow-400" />
                                                    {formatNumber(
                                                        repo.stargazers_count ||
                                                            0
                                                    )}
                                                </span>
                                                <span className="inline-flex gap-2 items-center">
                                                    <FaCodeFork className="w-4 h-4" />
                                                    {formatNumber(
                                                        repo.forks_count || 0
                                                    )}
                                                </span>
                                                <span className="inline-flex gap-2 items-center">
                                                    <FaGithub className="w-4 h-4" />
                                                    {formatNumber(
                                                        repo.watchers_count || 0
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-4 lg:w-48">
                                            <a
                                                href={repo.html_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-3 text-sm font-medium tracking-[0.2em] uppercase text-white transition hover:border-white hover:bg-white hover:text-black"
                                            >
                                                <ImGithub className="w-5 h-5" />
                                                View repo
                                            </a>
                                            <div className="text-right text-xs uppercase tracking-[0.3em] text-white/40">
                                                #{index + 1}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
