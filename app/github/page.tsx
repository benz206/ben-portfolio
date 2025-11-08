"use client";
import { motion, easeInOut } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { ImGithub } from "react-icons/im";
import { FaCodeFork, FaStar, FaGithub } from "react-icons/fa6";
import Card from "@/components/Card";
import {
    AmbientGradient,
    type AmbientVariant,
} from "@/components/AmbientGradient";
import MacroboardImage from "@/public/projects/Macroboard.png";
import { GitHubRepo } from "@/types";

type ContributionDay = {
    date: string;
    count: number;
    level: number;
};

type ContributionWeek = ContributionDay[];

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

    const fetchWithCache = async (url: string, cacheKey: string) => {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < 24 * 60 * 60 * 1000) return data;
        }
        const response = await fetch(url);
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
                const [repos, profile, contributions] = await Promise.all([
                    fetchWithCache(
                        "https://api.github.com/users/benz206/repos",
                        "github_repos"
                    ),
                    fetchWithCache(
                        "https://api.github.com/users/benz206",
                        "github_profile"
                    ),
                    fetchWithCache(
                        "https://github-contributions-api.jogruber.de/v4/benz206",
                        "github_contributions"
                    ),
                ]);
                const filtered = repos.filter((repo: GitHubRepo) => {
                    const name = repo.name.toLowerCase();
                    if (name === "benz206") return false;
                    if (name.includes("experiments")) return false;
                    if (name.includes("learning")) return false;
                    return true;
                });
                setRepoData(filtered);
                const totalCommits = contributions?.contributions?.reduce(
                    (sum: number, year: { total: number }) => sum + year.total,
                    0
                );
                const lastYear = contributions?.contributions?.[0]?.total ?? 0;
                setStats({
                    commits: lastYear,
                    contributions: totalCommits ?? 0,
                    publicRepos: profile?.public_repos ?? filtered.length,
                });

                const rawDays: ContributionDay[] =
                    contributions?.contributions ?? [];
                const daysForYear = rawDays.slice(-364);
                const paddedDays: ContributionDay[] = [...daysForYear];
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

    const statVariants: AmbientVariant[] = [
        "violet",
        "magenta",
        "blue",
        "sunset",
    ];
    const statItems = useMemo(
        () => [
            {
                label: "Commits (past year)",
                value: stats?.commits ?? 0,
                ambientVariant: statVariants[0],
            },
            {
                label: "Public repositories",
                value: stats?.publicRepos ?? totals.repos,
                ambientVariant: statVariants[1],
            },
            {
                label: "Total stars",
                value: totals.stars,
                ambientVariant: statVariants[2],
            },
            {
                label: "Forks captured",
                value: totals.forks,
                ambientVariant: statVariants[3],
            },
        ],
        [stats, totals]
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

    const contributionLevelGradients = useMemo(
        () => [
            "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
            "linear-gradient(135deg, rgba(245,217,255,0.75) 0%, rgba(171,120,255,0.2) 100%)",
            "linear-gradient(135deg, rgba(200,180,255,0.8) 0%, rgba(110,90,255,0.25) 100%)",
            "linear-gradient(135deg, rgba(164,208,255,0.85) 0%, rgba(74,144,226,0.3) 100%)",
            "linear-gradient(135deg, rgba(255,151,206,0.9) 0%, rgba(235,101,192,0.35) 100%)",
        ],
        []
    );

    if (isLoading && !repoData.length) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#050506]">
                <AiOutlineLoading className="w-16 h-16 animate-spin text-white/60" />
            </main>
        );
    }

    return (
        <main className="relative overflow-hidden text-white">
            <section className="relative flex min-h-[200vh] items-center px-4 pb-16 pt-24 sm:px-6 md:min-h-screen lg:h-screen lg:pb-0 lg:pt-0">
                <div className="absolute inset-0 bg-noir-gradient" />
                <div className="absolute inset-0 bg-noir-radial opacity-80" />
                <motion.div
                    ref={heroRef}
                    className="relative z-10 mx-auto grid w-full max-w-[1080px] gap-12 sm:gap-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-start"
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
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {statItems.map((item) => (
                                <Card
                                    key={item.label}
                                    variant="glass"
                                    ambient
                                    ambientVariant={item.ambientVariant}
                                    ambientClassName="opacity-40"
                                    className="flex flex-col gap-2 p-6"
                                    motionProps={{ variants: fadeIn }}
                                >
                                    <span className="text-xs uppercase tracking-[0.25em] text-white/40">
                                        {item.label}
                                    </span>
                                    <span className="text-3xl font-semibold">
                                        {formatNumber(item.value)}
                                    </span>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                    <Card
                        variant="glass"
                        ambient
                        ambientVariant="magenta"
                        ambientClassName="opacity-45"
                        className="relative flex flex-col h-full gap-6 p-8"
                        motionProps={{ variants: fadeIn }}
                    >
                        <span className="text-xs uppercase tracking-[0.3em] text-white/50">
                            Macroboard spotlight
                        </span>
                        <div className="space-y-4">
                            <h2 className="text-3xl font-semibold tracking-tight">
                                Spotify Macroboard
                            </h2>
                            <p className="text-sm text-white/70">
                                Custom wireless macroboard tailored for Spotify
                                with a handcrafted PCB, translucent chassis, and
                                synchronized OLED telemetry.
                            </p>
                            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10">
                                <Image
                                    src={MacroboardImage}
                                    alt="Spotify macroboard"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                            <div className="grid gap-2 text-xs uppercase tracking-[0.2em] text-white/50 sm:grid-cols-2">
                                <div className="flex flex-col gap-1">
                                    <span className="text-white/70">Stack</span>
                                    <span>ESP32 · EasyEDA · C++ · Next.js</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-white/70">
                                        Highlights
                                    </span>
                                    <span>
                                        Wireless control · Synced lighting ·
                                        OLED telemetry
                                    </span>
                                </div>
                            </div>
                            <a
                                href="https://github.com/benz206/SpotifyMacroboard"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-medium tracking-[0.2em] uppercase text-white transition hover:border-white hover:bg-white hover:text-black"
                            >
                                View project
                            </a>
                        </div>
                    </Card>
                    <Card
                        variant="glass"
                        ambient
                        ambientVariant="violet"
                        ambientClassName="opacity-35"
                        className="relative flex flex-col gap-4 p-6"
                    >
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-[0.2em] text-white/45">
                            <span>Contributions · Past 52 weeks</span>
                            <span>
                                {formatNumber(stats?.commits ?? 0)} commits
                            </span>
                        </div>
                        <div className="flex gap-1.5 overflow-x-auto pb-1">
                            {contributionWeeks.map((week, weekIndex) => (
                                <div
                                    key={`week-${weekIndex}`}
                                    className="flex flex-col gap-1.5"
                                >
                                    {week.map((day, dayIndex) => {
                                        const level = Math.min(
                                            Math.max(day.level ?? 0, 0),
                                            4
                                        );
                                        const gradient =
                                            contributionLevelGradients[level];
                                        const label =
                                            day.date &&
                                            !day.date.startsWith("placeholder")
                                                ? `${
                                                      day.count
                                                  } contributions on ${new Date(
                                                      day.date
                                                  ).toLocaleDateString(
                                                      undefined,
                                                      {
                                                          month: "short",
                                                          day: "numeric",
                                                      }
                                                  )}`
                                                : "";
                                        return (
                                            <div
                                                key={
                                                    day.date ||
                                                    `placeholder-${weekIndex}-${dayIndex}`
                                                }
                                                title={label}
                                                className="h-3.5 w-3.5 rounded-md border border-white/10"
                                                style={{
                                                    background: gradient,
                                                    opacity:
                                                        day.date.startsWith(
                                                            "placeholder"
                                                        )
                                                            ? 0.15
                                                            : 1,
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

            <section className="relative flex flex-col min-h-screen px-4 py-24 border-t border-white/5 sm:px-6 lg:px-12">
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
                        <aside className="flex flex-col w-full gap-6 lg:max-w-sm">
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
                                        className="px-4 py-3 text-sm text-white border rounded-full border-white/10 bg-white/10 placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-0"
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
                                            className="flex items-center gap-4"
                                        >
                                            <div className="flex items-center justify-center w-10 h-10 text-sm font-semibold border rounded-2xl border-white/10 bg-white/5">
                                                {entry.percentage}%
                                            </div>
                                            <div className="flex items-center justify-between flex-1">
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
                            className="flex flex-col flex-1 w-full gap-8 pr-2 overflow-y-auto"
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
                                                <div className="flex flex-wrap items-center gap-4">
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
                                                <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                                                    <span className="inline-flex items-center gap-2">
                                                        <FaStar className="w-4 h-4 text-yellow-400" />
                                                        {formatNumber(
                                                            repo.stargazers_count ||
                                                                0
                                                        )}
                                                    </span>
                                                    <span className="inline-flex items-center gap-2">
                                                        <FaCodeFork className="w-4 h-4" />
                                                        {formatNumber(
                                                            repo.forks_count ||
                                                                0
                                                        )}
                                                    </span>
                                                    <span className="inline-flex items-center gap-2">
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
