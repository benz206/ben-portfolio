"use client";
import { motion, easeInOut } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { ImGithub } from "react-icons/im";
import { FaCodeFork, FaStar, FaGithub } from "react-icons/fa6";
import Card from "@/components/Card";
import { GitHubRepo } from "@/types";
import type {
    GitHubContributionsDay,
    GitHubContributionsResponse,
    GitHubUserResponse,
} from "@/types/externalApis";

type ContributionDay = GitHubContributionsDay;

type ContributionWeek = ContributionDay[];

const resolveContributionLevel = (
    day: ContributionDay,
    maxCount: number
) => {
    if (typeof day.level === "number" && !Number.isNaN(day.level)) {
        return Math.min(Math.max(day.level, 0), 4);
    }
    const count = day.count ?? 0;
    if (!maxCount) {
        if (count >= 20) return 4;
        if (count >= 10) return 3;
        if (count >= 5) return 2;
        if (count > 0) return 1;
        return 0;
    }
    const ratio = Math.min(count / Math.max(maxCount, 1), 1);
    if (ratio >= 0.75) return 4;
    if (ratio >= 0.5) return 3;
    if (ratio >= 0.25) return 2;
    if (ratio > 0) return 1;
    return 0;
};

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

export default function GithubPage() {
    const [repoData, setRepoData] = useState<GitHubRepo[]>([]);
    const [filteredRepoData, setFilteredRepoData] = useState<GitHubRepo[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<SortOption>(SortOption.Stars);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const heroRef = useRef(null);
    const heroInView = true;
    const timelineRef = useRef(null);
    const timelineInView = true;
    const [searchTerm, setSearchTerm] = useState("");
    const [stats, setStats] = useState<{
        commits: number;
        contributions: number;
        publicRepos: number;
    } | null>(null);
    const [contributionWeeks, setContributionWeeks] = useState<
        ContributionWeek[]
    >([]);
    const [maxContributionCount, setMaxContributionCount] = useState(0);

    const fetchWithCache = async <T,>(url: string, cacheKey: string): Promise<T> => {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            const { data, timestamp } = JSON.parse(cached) as { data: T; timestamp: number };
            if (Date.now() - timestamp < 24 * 60 * 60 * 1000) return data;
        }
        const response = await fetch(url);
        const data = (await response.json()) as T;
        localStorage.setItem(
            cacheKey,
            JSON.stringify({ data, timestamp: Date.now() })
        );
        return data;
    };

    useEffect(() => {
        (async () => {
            try {
                const [repos, profile, contributions] = await Promise.all([
                    fetchWithCache<GitHubRepo[]>(
                        "https://api.github.com/users/benz206/repos",
                        "github_repos"
                    ),
                    fetchWithCache<GitHubUserResponse>(
                        "https://api.github.com/users/benz206",
                        "github_profile"
                    ),
                    fetchWithCache<GitHubContributionsResponse>(
                        "https://github-contributions-api.jogruber.de/v4/benz206",
                        "github_contributions"
                    ),
                ]);

                const filtered = repos.filter((repo) => {
                    const name = repo.name.toLowerCase();
                    if (name === "benz206") return false;
                    if (name.includes("experiments")) return false;
                    if (name.includes("learning")) return false;
                    return true;
                });
                setRepoData(filtered);
                const rawDays: ContributionDay[] = contributions.contributions;
                const sortedDays = rawDays
                    .filter((day) => day.date)
                    .sort(
                        (a, b) =>
                            new Date(a.date).valueOf() -
                            new Date(b.date).valueOf()
                    );
                const now = new Date();
                const yearAgo = new Date(now);
                yearAgo.setDate(yearAgo.getDate() - 364);
                const recentDays = sortedDays.filter((day) => {
                    const dayDate = new Date(day.date);
                    return dayDate >= yearAgo && dayDate <= now;
                });
                const lastYearCommits = recentDays.reduce(
                    (sum, day) => sum + (day.count ?? 0),
                    0
                );
                const totalCommits = Object.values(contributions.total).reduce(
                    (sum, yearTotal) => sum + yearTotal,
                    0
                );
                setStats({
                    commits: lastYearCommits,
                    contributions: totalCommits,
                    publicRepos: profile.public_repos,
                });

                const maxCount = recentDays.reduce(
                    (max, day) => Math.max(max, day.count ?? 0),
                    0
                );
                const paddedDays: ContributionDay[] = [...recentDays];
                while (paddedDays.length % 7 !== 0) {
                    paddedDays.unshift({
                        date: `placeholder-${paddedDays.length}`,
                        count: 0,
                        level: 0,
                    });
                }
                const weeks: ContributionWeek[] = [];
                for (let i = 0; i < paddedDays.length; i += 7) {
                    weeks.push(paddedDays.slice(i, i + 7));
                }
                setContributionWeeks(weeks);
                setMaxContributionCount(maxCount);
            } catch (error) {
                console.error("Error fetching repository data:", error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        setFilteredRepoData(
            sortRepositories(repoData, sortBy, sortOrder).filter((repo) =>
                repo.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [repoData, sortBy, sortOrder, searchTerm]);

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

    const handleSortChange = (option: SortOption) => {
        if (option === sortBy) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
            return;
        }
        setSortBy(option);
        setSortOrder(option === SortOption.Name ? "asc" : "desc");
    };

    const contributionLevelGradients = useMemo(() => {
        return [
            "linear-gradient(135deg, rgba(148,163,184,0.12) 0%, rgba(71,85,105,0.16) 100%)",
            "linear-gradient(135deg, rgba(134,239,172,0.35) 0%, rgba(74,222,128,0.32) 100%)",
            "linear-gradient(135deg, rgba(74,222,128,0.55) 0%, rgba(34,197,94,0.48) 100%)",
            "linear-gradient(135deg, rgba(34,197,94,0.75) 0%, rgba(22,163,74,0.62) 100%)",
            "linear-gradient(135deg, rgba(22,163,74,0.92) 0%, rgba(4,120,87,0.82) 100%)",
        ];
    }, []);

    if (isLoading && !repoData.length) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#050506]">
                <AiOutlineLoading className="w-16 h-16 animate-spin text-white/60" />
            </main>
        );
    }

    return (
        <main className="overflow-hidden relative text-white">
            <style jsx global>{`
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
                <motion.div
                    ref={heroRef}
                    className="relative z-10 mx-auto flex w-full max-w-[1080px] flex-col gap-12 sm:gap-16"
                    initial="hidden"
                    animate={heroInView ? "visible" : "hidden"}
                    variants={{
                        visible: { transition: { staggerChildren: 0.12 } },
                        hidden: {},
                    }}
                >
                    <motion.div
                        variants={fadeIn}
                        className="space-y-8 lg:space-y-12"
                    >
                        <div className="space-y-2 lg:space-y-6">
                            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                                GitHub
                            </h1>
                            <p className="max-w-2xl text-sm text-white/70 sm:text-base">
                                Track my open-source projects, filter through repositories, and explore contribution trends from the past year.
                            </p>
                        </div>
                    </motion.div>
                    <Card
                        variant="glass"
                        ambient
                        ambientVariant="violet"
                        ambientClassName="opacity-35"
                        className="flex relative flex-col gap-4 p-6 w-full"
                    >
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-[0.2em] text-white/45">
                            <span>Contributions · Past 52 weeks</span>
                            <span>
                                {formatNumber(stats?.commits ?? 0)} commits
                            </span>
                        </div>
                        <div className="grid overflow-hidden gap-1 pb-1 w-full" style={{ gridTemplateColumns: `repeat(${contributionWeeks.length}, minmax(0, 1fr))` }}>
                            {contributionWeeks.map((week, weekIndex) => (
                                <div key={`week-${weekIndex}`} className="flex flex-col gap-1">
                                    {week.map((day, dayIndex) => {
                                        const level = resolveContributionLevel(day, maxContributionCount);
                                        const gradient = contributionLevelGradients[level];
                                        const validatedGradient = gradient ?? contributionLevelGradients[0];
                                        const isPlaceholder = day.date.startsWith("placeholder");
                                        const label =
                                            day.date && !isPlaceholder
                                                ? `${day.count} contributions on ${new Date(day.date).toLocaleDateString(undefined, {
                                                      month: "short",
                                                      day: "numeric",
                                                  })}`
                                                : "";
                                        const cellIndex = weekIndex * 7 + dayIndex;
                                        const animationDelay = `${(cellIndex % 18) * 0.3}s`;
                                        const animationDuration = `${14 + (cellIndex % 6)}s`;
                                        return (
                                            <div
                                                key={day.date || `placeholder-${weekIndex}-${dayIndex}`}
                                                title={label}
                                                className={`h-4 w-4 rounded-[4px] border border-white/10${isPlaceholder ? "":" github-cell"}`}
                                                style={{
                                                    background: validatedGradient,
                                                    opacity: isPlaceholder ? 0.15 : 1,
                                                    animationDelay: isPlaceholder ? undefined : animationDelay,
                                                    animationDuration: isPlaceholder ? undefined : animationDuration,
                                                    animationTimingFunction: isPlaceholder ? undefined : "ease-in-out",
                                                    animationIterationCount: isPlaceholder ? undefined : "infinite",
                                                    animationDirection: isPlaceholder ? undefined : "alternate",
                                                    animationName: isPlaceholder ? undefined : "githubHueCycle",
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </Card>
                </motion.div>
            </section>

            <section className="flex relative flex-col px-4 py-24 min-h-screen border-t border-white/5 sm:px-6 lg:px-12">
                <div className="absolute inset-0 bg-noir-gradient" />
                <div className="absolute inset-0 opacity-75 bg-noir-radial" />
                <div className="relative z-10 mx-auto flex h-[100vh] w-full max-w-[1080px] flex-col gap-10">
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
                            animate={
                                timelineInView
                                    ? { opacity: 1, y: 0 }
                                    : { opacity: 0, y: 48 }
                            }
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
                                            animate: timelineInView
                                                ? { opacity: 1, y: 0 }
                                                : { opacity: 0, y: 40 },
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
                                                            repo.forks_count ||
                                                                0
                                                        )}
                                                    </span>
                                                    <span className="inline-flex gap-2 items-center">
                                                        <FaGithub className="w-4 h-4" />
                                                        {formatNumber(
                                                            repo.watchers_count ||
                                                                0
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
        </main>
    );
}
