"use client";
import Link from "next/link";
import { motion, useInView, easeInOut } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { FiChevronDown } from "react-icons/fi";
import { ImGithub } from "react-icons/im";
import { FaCodeFork, FaStar } from "react-icons/fa6";
import Card from "@/components/Card";
import CommitGraph, {
    ContributionStats,
} from "@/components/GitHub/CommitGraph";
import LanguageBar from "@/components/GitHub/LanguageBar";
import { GitHubRepo } from "@/types";

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

const summaryDateFormatter = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
});

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

export default function GithubPage() {
    const [repoData, setRepoData] = useState<GitHubRepo[]>([]);
    const [filteredRepoData, setFilteredRepoData] = useState<GitHubRepo[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [graphStats, setGraphStats] = useState<ContributionStats | null>(
        null
    );
    const [graphLoading, setGraphLoading] = useState(true);
    const [graphError, setGraphError] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<SortOption>(SortOption.Stars);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const heroRef = useRef(null);
    const heroInView = useInView(heroRef, { once: true, amount: "some" });
    const timelineRef = useRef(null);
    const timelineInView = useInView(timelineRef, {
        once: true,
        amount: "some",
    });

    const fetchWithCache = async (url: string, cacheKey: string) => {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            try {
                const { data, timestamp } = JSON.parse(cached);
                if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
                    return data;
                }
            } catch (error) {
                console.error("Error parsing cached GitHub data:", error);
            }
        }
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`GitHub request failed with ${response.status}`);
        }
        const data = await response.json();
        localStorage.setItem(
            cacheKey,
            JSON.stringify({ data, timestamp: Date.now() })
        );
        return data;
    };

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchWithCache(
                    "https://api.github.com/users/benz206/repos",
                    "github_repos"
                );
                const filtered = data.filter((repo: GitHubRepo) => {
                    const name = repo.name.toLowerCase();
                    if (name === "benz206") return false;
                    if (name.includes("experiments")) return false;
                    if (name.includes("learning")) return false;
                    return true;
                });
                setRepoData(filtered);
            } catch (error) {
                console.error("Error fetching repository data:", error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        setFilteredRepoData(sortRepositories(repoData, sortBy, sortOrder));
    }, [repoData, sortBy, sortOrder]);

    const totals = useMemo(() => {
        const stars = repoData.reduce(
            (total, repo) => total + (repo.stargazers_count || 0),
            0
        );
        const forks = repoData.reduce(
            (total, repo) => total + (repo.forks_count || 0),
            0
        );
        const languages = new Set(
            repoData
                .map((repo) => repo.language)
                .filter((language): language is string => Boolean(language))
        ).size;
        return {
            repos: repoData.length,
            stars,
            forks,
            languages,
        };
    }, [repoData]);

    const lastUpdated = useMemo(() => {
        if (!repoData.length) return null;
        const latest = [...repoData].sort((a, b) => {
            return (
                new Date(b.updated_at).valueOf() -
                new Date(a.updated_at).valueOf()
            );
        })[0];
        return latest.updated_at;
    }, [repoData]);

    const languagePulse = useMemo(() => {
        if (!repoData.length) return [];
        const counts: Record<string, number> = {};
        repoData.forEach((repo) => {
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
    }, [repoData]);

    const spotlightRepo = useMemo(() => {
        if (!repoData.length) return null;
        return [...repoData].sort(
            (a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0)
        )[0];
    }, [repoData]);

    const focusRepos = useMemo(() => {
        return [...repoData]
            .sort(
                (a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0)
            )
            .slice(1, 3);
    }, [repoData]);

    const statItems = useMemo(
        () => [
            { label: "Live repositories", value: totals.repos },
            { label: "Total stars", value: totals.stars },
            { label: "Forks captured", value: totals.forks },
            { label: "Active languages", value: totals.languages },
        ],
        [totals]
    );

    const lastUpdatedLabel = lastUpdated
        ? new Date(lastUpdated).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
          })
        : null;

    const handleSortChange = (option: SortOption) => {
        if (option === sortBy) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
            return;
        }
        setSortBy(option);
        setSortOrder(option === SortOption.Name ? "asc" : "desc");
    };

    const handleScrollClick = () => {
        const nextSection = document.getElementById("github-stream");
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    const renderMetricValue = (value: number | undefined) => {
        if (graphLoading) return "—";
        if (graphError) return "—";
        return formatNumber(value ?? 0);
    };

    const bestDayDescription = graphError
        ? graphError
        : graphStats?.bestDay.date
        ? summaryDateFormatter.format(new Date(graphStats.bestDay.date))
        : graphLoading
        ? "Calibrating grid..."
        : "The highest energy spike across the grid.";

    return (
        <main className="relative overflow-hidden bg-[#050506] text-white">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-noir-gradient" />
                <div className="absolute inset-0 bg-noir-radial opacity-70" />
            </div>
            <section className="relative z-10 flex justify-center px-4 pt-10 sm:px-6">
                <div className="w-full max-w-5xl">
                    <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:grid-cols-3">
                        <Link
                            href="#github-stream"
                            className="flex flex-col gap-1 rounded-2xl border border-transparent px-4 py-3 text-sm uppercase tracking-[0.25em] text-white/65 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
                        >
                            <span className="text-xs text-white/45">
                                Stream
                            </span>
                            <span>Live repos</span>
                        </Link>
                        <Link
                            href="#github-insights"
                            className="flex flex-col gap-1 rounded-2xl border border-transparent px-4 py-3 text-sm uppercase tracking-[0.25em] text-white/65 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
                        >
                            <span className="text-xs text-white/45">
                                Insights
                            </span>
                            <span>Language pulse</span>
                        </Link>
                        <Link
                            href="#github-focus"
                            className="flex flex-col gap-1 rounded-2xl border border-transparent px-4 py-3 text-sm uppercase tracking-[0.25em] text-white/65 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
                        >
                            <span className="text-xs text-white/45">
                                Signal
                            </span>
                            <span>Focus repos</span>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="relative flex justify-center px-6 py-20 sm:px-12">
                <div className="relative flex w-full max-w-5xl flex-col gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 text-white/75 backdrop-blur">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-xs uppercase tracking-[0.3em] text-white/45">
                            Activity Headlines
                        </span>
                        <div className="flex gap-3 text-xs uppercase tracking-[0.3em] text-white/40">
                            <span>Last 52 weeks</span>
                            <span className="hidden sm:inline">•</span>
                            <span>Powered by live data</span>
                        </div>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-3">
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                            <span className="text-xs uppercase tracking-[0.3em] text-white/45">
                                Current streak
                            </span>
                            <div className="mt-2 text-3xl font-semibold text-white">
                                {renderMetricValue(
                                    graphStats?.currentStreak.length
                                )}
                                {renderMetricValue(
                                    graphStats?.currentStreak.length
                                ) !== "—" && (
                                    <span className="ml-1 text-sm font-normal text-white/60">
                                        days
                                    </span>
                                )}
                            </div>
                            <p className="mt-2 text-sm text-white/60">
                                Still shipping and keeping the momentum alive.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                            <span className="text-xs uppercase tracking-[0.3em] text-white/45">
                                Longest streak
                            </span>
                            <div className="mt-2 text-3xl font-semibold text-white">
                                {renderMetricValue(
                                    graphStats?.longestStreak.length
                                )}
                                {renderMetricValue(
                                    graphStats?.longestStreak.length
                                ) !== "—" && (
                                    <span className="ml-1 text-sm font-normal text-white/60">
                                        days
                                    </span>
                                )}
                            </div>
                            <p className="mt-2 text-sm text-white/60">
                                A stretch of flow where commits landed daily.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                            <span className="text-xs uppercase tracking-[0.3em] text-white/45">
                                Peak day
                            </span>
                            <div className="mt-2 text-3xl font-semibold text-white">
                                {renderMetricValue(graphStats?.bestDay.count)}
                                {renderMetricValue(
                                    graphStats?.bestDay.count
                                ) !== "—" && (
                                    <span className="ml-1 text-sm font-normal text-white/60">
                                        commits
                                    </span>
                                )}
                            </div>
                            <p className="mt-2 text-sm text-white/60">
                                {bestDayDescription}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section
                id="github-stream"
                className="relative min-h-screen px-6 py-24 border-t border-white/5 sm:px-12"
            >
                <div className="flex flex-col w-full max-w-6xl gap-16 mx-auto lg:flex-row">
                    <motion.aside
                        className="flex flex-col w-full gap-12 lg:max-w-sm"
                        initial="hidden"
                        animate={timelineInView ? "visible" : "hidden"}
                        variants={{
                            visible: { transition: { staggerChildren: 0.12 } },
                            hidden: {},
                        }}
                    >
                        <motion.div variants={fadeIn} className="space-y-4">
                            <span className="text-xs uppercase tracking-[0.3em] text-white/50">
                                Sort canvas
                            </span>
                            <div className="flex flex-wrap gap-3">
                                {Object.values(SortOption).map((option) => {
                                    const active = sortBy === option;
                                    return (
                                        <button
                                            key={option}
                                            onClick={() =>
                                                handleSortChange(option)
                                            }
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
                        </motion.div>
                        <motion.div
                            variants={fadeIn}
                            className="p-6 space-y-6 border rounded-3xl border-white/10 bg-white/5 backdrop-blur"
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
                                        className="flex items-center gap-4"
                                    >
                                        <div className="w-10 h-10 text-sm font-semibold leading-10 text-center border rounded-2xl border-white/10 bg-white/5">
                                            {entry.percentage}%
                                        </div>
                                        <div className="flex items-center justify-between flex-1">
                                            <span className="text-sm font-medium text-white/80">
                                                {entry.language}
                                            </span>
                                            <span className="text-xs uppercase tracking-[0.25em] text-white/40">
                                                {entry.count} repos
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                        <motion.div
                            id="github-insights"
                            variants={fadeIn}
                            className="space-y-4 text-sm text-white/60"
                        >
                            <span className="text-xs uppercase tracking-[0.3em] text-white/50">
                                How to explore
                            </span>
                            <p>
                                Tap a sort mode to reorder the stream. Each card
                                glows from its commit energy, with metrics
                                tucked alongside quick access.
                            </p>
                        </motion.div>
                    </motion.aside>
                    <motion.div
                        ref={timelineRef}
                        className="flex flex-col w-full gap-10"
                        initial={{ opacity: 0, y: 48 }}
                        animate={
                            timelineInView
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 48 }
                        }
                        transition={{ duration: 0.7, ease: easeInOut }}
                    >
                        {graphError ? (
                            <Card
                                variant="glass"
                                ambient
                                ambientSeed="error-spotlight"
                                ambientClassName="opacity-40"
                                className="flex h-full min-h-[240px] flex-col items-center justify-center gap-4 border border-red-500/30 bg-red-500/10 text-red-200"
                            >
                                <span className="text-xs uppercase tracking-[0.3em]">
                                    GitHub data offline
                                </span>
                                <span className="text-sm text-center">
                                    {graphError}
                                </span>
                            </Card>
                        ) : isLoading || graphLoading ? (
                            <Card
                                variant="glass"
                                ambient
                                ambientSeed="loading-spotlight"
                                ambientClassName="opacity-40"
                                className="flex min-h-[240px] flex-col items-center justify-center border border-white/10 bg-white/5 p-10 text-center text-white/60"
                            >
                                <span className="text-xs uppercase tracking-[0.3em]">
                                    Calibrating spotlight
                                </span>
                            </Card>
                        ) : spotlightRepo ? (
                            <Card
                                variant="minimal"
                                ambient
                                ambientSeed={spotlightRepo.name}
                                ambientClassName="opacity-30"
                                className="relative p-8 overflow-hidden transition border group border-white/10 bg-white/5 backdrop-blur hover:border-white/30"
                                motionProps={{
                                    initial: { opacity: 0, y: 40 },
                                    animate: timelineInView
                                        ? { opacity: 1, y: 0 }
                                        : { opacity: 0, y: 40 },
                                    transition: {
                                        delay: 0.1,
                                        duration: 0.65,
                                        ease: easeInOut,
                                    },
                                }}
                            >
                                <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex flex-wrap items-center gap-4">
                                            <h3 className="text-2xl font-semibold tracking-tight">
                                                {spotlightRepo.name}
                                            </h3>
                                            <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-white/50">
                                                Updated {lastUpdatedLabel}
                                            </span>
                                            {spotlightRepo.language && (
                                                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70">
                                                    {spotlightRepo.language}
                                                </span>
                                            )}
                                        </div>
                                        <p className="max-w-3xl text-sm leading-relaxed text-white/70">
                                            {spotlightRepo.description ||
                                                "This project is still catching its breath after the latest deploy."}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                                            <span className="inline-flex items-center gap-2">
                                                <FaStar className="w-4 h-4 text-yellow-400" />
                                                {formatNumber(
                                                    spotlightRepo.stargazers_count ||
                                                        0
                                                )}
                                            </span>
                                            <span className="inline-flex items-center gap-2">
                                                <FaCodeFork className="w-4 h-4" />
                                                {formatNumber(
                                                    spotlightRepo.forks_count ||
                                                        0
                                                )}
                                            </span>
                                            <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/50">
                                                {spotlightRepo.visibility}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-4 lg:w-48">
                                        <a
                                            href={spotlightRepo.html_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-3 text-sm font-medium tracking-[0.2em] uppercase text-white transition hover:border-white hover:bg-white hover:text-black"
                                        >
                                            <ImGithub className="w-5 h-5" />
                                            View
                                        </a>
                                        <div className="text-right text-xs uppercase tracking-[0.3em] text-white/40">
                                            #{1}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ) : (
                            <CommitGraph
                                username="benz206"
                                onStatsChange={setGraphStats}
                                onLoadingChange={setGraphLoading}
                                onErrorChange={setGraphError}
                            />
                        )}
                        {graphError && (
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Card
                                    variant="minimal"
                                    ambient
                                    ambientSeed="focus-error"
                                    ambientClassName="opacity-30"
                                    className="flex min-h-[160px] flex-col items-center justify-center gap-3 border border-red-500/30 bg-red-500/10 text-red-200"
                                >
                                    <span className="text-[0.65rem] uppercase tracking-[0.3em]">
                                        Focus metrics unavailable
                                    </span>
                                    <span className="text-xs text-center">
                                        {graphError}
                                    </span>
                                </Card>
                            </div>
                        )}
                        {!graphError && (isLoading || graphLoading) && (
                            <div className="grid gap-4 sm:grid-cols-2">
                                {[0, 1].map((index) => (
                                    <Card
                                        key={index}
                                        variant="glass"
                                        ambient
                                        ambientSeed={`loading-card-${index}`}
                                        ambientClassName="opacity-40"
                                        className="flex min-h-[240px] flex-col items-center justify-center border border-white/10 bg-white/5 p-10 text-center text-white/60"
                                    >
                                        <AiOutlineLoading className="w-10 h-10 text-white/60" />
                                        <p className="mt-2 text-sm text-white/60">
                                            Loading...
                                        </p>
                                    </Card>
                                ))}
                            </div>
                        )}
                        {!graphError &&
                            !isLoading &&
                            !graphLoading &&
                            focusRepos.length > 0 && (
                                <motion.div
                                    variants={fadeIn}
                                    className="p-6 space-y-6 border rounded-3xl border-white/10 bg-white/5 backdrop-blur"
                                >
                                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/50">
                                        <span>Focus repositories</span>
                                        <span>{focusRepos.length} tracked</span>
                                    </div>
                                    <div className="space-y-4">
                                        {focusRepos.map((repo, index) => (
                                            <div
                                                key={repo.id}
                                                className="flex items-center gap-4"
                                            >
                                                <div className="w-10 h-10 text-sm font-semibold leading-10 text-center border rounded-2xl border-white/10 bg-white/5">
                                                    {index + 1}
                                                </div>
                                                <div className="flex items-center justify-between flex-1">
                                                    <span className="text-sm font-medium text-white/80">
                                                        {repo.name}
                                                    </span>
                                                    <span className="text-xs uppercase tracking-[0.25em] text-white/40">
                                                        {repo.stargazers_count ||
                                                            0}{" "}
                                                        stars
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
