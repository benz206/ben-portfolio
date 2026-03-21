"use client";

import { motion, easeInOut } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import Card from "@/components/Card";
import { GitHubRepo } from "@/types";
import type {
    GitHubContributionsDay,
    GitHubContributionsResponse,
    GitHubUserResponse,
} from "@/types/externalApis";
import ContributionHeatmap from "@/components/GitHub/ContributionHeatmap";
import RepoExplorer from "@/components/GitHub/RepoExplorer";

type ContributionWeek = GitHubContributionsDay[];

type ActivityStats = {
    currentStreak: {
        length: number;
        start: string | null;
        end: string | null;
    };
    longestStreak: {
        length: number;
        start: string | null;
        end: string | null;
    };
    bestDay: {
        date: string | null;
        count: number;
    };
};

type GitHubPageStats = ActivityStats & {
    commits: number;
    contributions: number;
    publicRepos: number;
};

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

const emptyActivityStats: ActivityStats = {
    currentStreak: { length: 0, start: null, end: null },
    longestStreak: { length: 0, start: null, end: null },
    bestDay: { date: null, count: 0 },
};

const calculateActivityStats = (
    days: GitHubContributionsDay[],
): ActivityStats => {
    if (!days.length) return emptyActivityStats;

    const ordered = [...days].sort(
        (a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf(),
    );

    let bestDay = ordered[0];
    let longestLength = 0;
    let longestStart: string | null = null;
    let longestEnd: string | null = null;
    let currentRunLength = 0;
    let currentRunStart: string | null = null;

    for (const day of ordered) {
        if (day.count > bestDay.count) {
            bestDay = day;
        }

        if (day.count > 0) {
            currentRunLength += 1;
            if (!currentRunStart) {
                currentRunStart = day.date;
            }
            if (currentRunLength > longestLength) {
                longestLength = currentRunLength;
                longestStart = currentRunStart;
                longestEnd = day.date;
            }
        } else {
            currentRunLength = 0;
            currentRunStart = null;
        }
    }

    let currentLength = 0;
    let currentStart: string | null = null;
    for (let index = ordered.length - 1; index >= 0; index -= 1) {
        const day = ordered[index];
        if (day.count <= 0) break;
        currentLength += 1;
        currentStart = day.date;
    }

    return {
        currentStreak: {
            length: currentLength,
            start: currentStart,
            end: currentLength > 0 ? ordered.at(-1)?.date ?? null : null,
        },
        longestStreak: {
            length: longestLength,
            start: longestStart,
            end: longestEnd,
        },
        bestDay: {
            date: bestDay.date,
            count: bestDay.count,
        },
    };
};

export default function GithubPage() {
    const [repoData, setRepoData] = useState<GitHubRepo[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [stats, setStats] = useState<GitHubPageStats | null>(null);
    const [contributionWeeks, setContributionWeeks] = useState<
        ContributionWeek[]
    >([]);
    const [maxContributionCount, setMaxContributionCount] = useState(0);

    const fetchWithCache = async <T,>(
        url: string,
        cacheKey: string,
    ): Promise<T> => {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            try {
                const { data, timestamp } = JSON.parse(cached) as {
                    data: T;
                    timestamp: number;
                };
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
        const data = (await response.json()) as T;
        localStorage.setItem(
            cacheKey,
            JSON.stringify({ data, timestamp: Date.now() }),
        );
        return data;
    };

    useEffect(() => {
        (async () => {
            try {
                const [repos, profile, contributions] = await Promise.all([
                    fetchWithCache<GitHubRepo[]>(
                        "https://api.github.com/users/benz206/repos",
                        "github_repos",
                    ),
                    fetchWithCache<GitHubUserResponse>(
                        "https://api.github.com/users/benz206",
                        "github_profile",
                    ),
                    fetchWithCache<GitHubContributionsResponse>(
                        "https://github-contributions-api.jogruber.de/v4/benz206",
                        "github_contributions",
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

                const rawDays: GitHubContributionsDay[] =
                    contributions.contributions;
                const sortedDays = rawDays
                    .filter((day) => day.date)
                    .sort(
                        (a, b) =>
                            new Date(a.date).valueOf() -
                            new Date(b.date).valueOf(),
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
                    0,
                );
                const totalCommits = Object.values(contributions.total).reduce(
                    (sum, yearTotal) => sum + yearTotal,
                    0,
                );
                const activityStats = calculateActivityStats(recentDays);

                setStats({
                    commits: lastYearCommits,
                    contributions: totalCommits,
                    publicRepos: profile.public_repos,
                    ...activityStats,
                });

                const maxCount = recentDays.reduce(
                    (max, day) => Math.max(max, day.count ?? 0),
                    0,
                );
                const paddedDays: GitHubContributionsDay[] = [...recentDays];
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

    const totals = useMemo(() => {
        const stars = repoData.reduce(
            (total, repo) => total + (repo.stargazers_count || 0),
            0,
        );
        const forks = repoData.reduce(
            (total, repo) => total + (repo.forks_count || 0),
            0,
        );
        const languages = new Set(
            repoData
                .map((repo) => repo.language)
                .filter((language): language is string => Boolean(language)),
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

    const lastUpdatedLabel = lastUpdated
        ? new Date(lastUpdated).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
          })
        : null;

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
            <section className="relative flex min-h-screen items-center px-4 py-24 sm:px-6 lg:px-12">
                <div className="absolute inset-0 bg-noir-gradient" />
                <div className="absolute inset-0 opacity-80 bg-noir-radial" />
                <motion.div
                    className="relative z-10 mx-auto flex w-full max-w-[1080px] flex-col gap-12 sm:gap-16"
                    initial="hidden"
                    animate="visible"
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
                                Track my open-source projects, filter through
                                repositories, and explore contribution trends
                                from the past year.
                            </p>
                        </div>
                    </motion.div>
                    <motion.div
                        variants={fadeIn}
                        className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]"
                    >
                        <ContributionHeatmap
                            weeks={contributionWeeks}
                            maxCount={maxContributionCount}
                            totalCommits={stats?.commits ?? 0}
                        />
                        <Card
                            variant="glass"
                            ambient
                            ambientVariant="indigo"
                            ambientClassName="opacity-30"
                            className="flex flex-col justify-between gap-6 p-6"
                        >
                            <div className="space-y-2">
                                <span className="text-xs uppercase tracking-[0.3em] text-white/45">
                                    Overview
                                </span>
                                <p className="text-sm leading-relaxed text-white/70">
                                    A merged view of live repo metadata and the
                                    past year of contributions.
                                </p>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <div className="text-xs uppercase tracking-[0.3em] text-white/45">
                                        Public repos
                                    </div>
                                    <div className="mt-2 text-2xl font-semibold text-white">
                                        {formatNumber(stats?.publicRepos ?? 0)}
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <div className="text-xs uppercase tracking-[0.3em] text-white/45">
                                        Last updated
                                    </div>
                                    <div className="mt-2 text-lg font-semibold text-white">
                                        {lastUpdatedLabel ?? "Warming up"}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                    <motion.div
                        id="github-activity"
                        variants={fadeIn}
                        className="grid gap-4 md:grid-cols-3"
                    >
                        <Card
                            variant="glass"
                            ambient
                            ambientVariant="emerald"
                            ambientClassName="opacity-30"
                            className="p-6"
                        >
                            <div className="text-xs uppercase tracking-[0.3em] text-white/45">
                                Current streak
                            </div>
                            <div className="mt-2 text-3xl font-semibold text-white">
                                {formatNumber(stats?.currentStreak.length ?? 0)}
                                <span className="ml-2 text-sm font-normal text-white/60">
                                    days
                                </span>
                            </div>
                            <p className="mt-3 text-sm text-white/60">
                                {stats?.currentStreak.length
                                    ? "Still shipping and keeping momentum alive."
                                    : "The next push starts a new streak."}
                            </p>
                        </Card>
                        <Card
                            variant="glass"
                            ambient
                            ambientVariant="sunset"
                            ambientClassName="opacity-30"
                            className="p-6"
                        >
                            <div className="text-xs uppercase tracking-[0.3em] text-white/45">
                                Longest streak
                            </div>
                            <div className="mt-2 text-3xl font-semibold text-white">
                                {formatNumber(stats?.longestStreak.length ?? 0)}
                                <span className="ml-2 text-sm font-normal text-white/60">
                                    days
                                </span>
                            </div>
                            <p className="mt-3 text-sm text-white/60">
                                A stretch of flow where commits landed daily.
                            </p>
                        </Card>
                        <Card
                            variant="glass"
                            ambient
                            ambientVariant="violet"
                            ambientClassName="opacity-30"
                            className="p-6"
                        >
                            <div className="text-xs uppercase tracking-[0.3em] text-white/45">
                                Peak day
                            </div>
                            <div className="mt-2 text-3xl font-semibold text-white">
                                {formatNumber(stats?.bestDay.count ?? 0)}
                                <span className="ml-2 text-sm font-normal text-white/60">
                                    commits
                                </span>
                            </div>
                            <p className="mt-3 text-sm text-white/60">
                                {stats?.bestDay.date
                                    ? summaryDateFormatter.format(
                                          new Date(stats.bestDay.date),
                                      )
                                    : "Calibrating peak activity."}
                            </p>
                        </Card>
                    </motion.div>
                    <motion.div
                        variants={fadeIn}
                        className="grid gap-4 sm:grid-cols-4"
                    >
                        {[
                            {
                                label: "Visible repos",
                                value: totals.repos,
                            },
                            {
                                label: "Total stars",
                                value: totals.stars,
                            },
                            {
                                label: "Forks captured",
                                value: totals.forks,
                            },
                            {
                                label: "Active languages",
                                value: totals.languages,
                            },
                        ].map((item) => (
                            <Card
                                key={item.label}
                                variant="glass"
                                className="p-5"
                            >
                                <div className="text-xs uppercase tracking-[0.3em] text-white/45">
                                    {item.label}
                                </div>
                                <div className="mt-2 text-2xl font-semibold text-white">
                                    {formatNumber(item.value)}
                                </div>
                            </Card>
                        ))}
                    </motion.div>
                </motion.div>
            </section>
            <RepoExplorer repos={repoData} />
        </main>
    );
}
