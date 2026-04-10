"use client";

import { motion, easeInOut } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { GitHubRepo } from "@/types";
import type {
    GitHubContributionsDay,
    GitHubContributionsResponse,
    GitHubUserResponse,
} from "@/types/externalApis";
import ContributionHeatmap from "@/components/GitHub/ContributionHeatmap";
import RepoExplorer from "@/components/GitHub/RepoExplorer";

type ContributionWeek = GitHubContributionsDay[];

const fadeIn = {
    hidden: { opacity: 0, y: 32 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: easeInOut },
    },
};

export default function GithubPage() {
    const [repoData, setRepoData] = useState<GitHubRepo[]>([]);
    const [isLoading, setLoading] = useState(true);
    const heroRef = useRef(null);
    const [stats, setStats] = useState<{
        commits: number;
        contributions: number;
        publicRepos: number;
    } | null>(null);
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
            const { data, timestamp } = JSON.parse(cached) as {
                data: T;
                timestamp: number;
            };
            if (Date.now() - timestamp < 24 * 60 * 60 * 1000) return data;
        }
        const response = await fetch(url);
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
                setStats({
                    commits: lastYearCommits,
                    contributions: totalCommits,
                    publicRepos: profile.public_repos,
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
                    className="relative z-10 mx-auto flex w-full max-w-270 flex-col gap-12 sm:gap-16"
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
                    <ContributionHeatmap
                        weeks={contributionWeeks}
                        maxCount={maxContributionCount}
                        totalCommits={stats?.commits ?? 0}
                    />
                </motion.div>
            </section>

            <RepoExplorer repos={repoData} />
        </main>
    );
}
