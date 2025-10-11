"use client";
import { motion, useInView, easeInOut } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { ImGithub } from "react-icons/im";
import { FaCodeFork, FaStar } from "react-icons/fa6";
import Card from "@/components/Card";
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
    // const heroInView = useInView(heroRef, { once: true, amount: 'some' });
    const heroInView = true;
    const timelineRef = useRef(null);
    // const timelineInView = useInView(timelineRef, {
    //     once: true,
    //     amount: 'some',
    // });
    const timelineInView = true;

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

    if (isLoading && !repoData.length) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#050506]">
                <AiOutlineLoading className="w-16 h-16 animate-spin text-white/60" />
            </main>
        );
    }

    return (
        <main className="relative overflow-hidden bg-[#050506] text-white">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-noir-gradient" />
                <div className="absolute inset-0 bg-noir-radial opacity-70" />
            </div>
            <section className="relative flex items-center min-h-screen px-6 py-24 sm:px-12">
                <motion.div
                    ref={heroRef}
                    className="z-10 mx-auto grid w-full max-w-6xl gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center"
                    initial="hidden"
                    animate={heroInView ? "visible" : "hidden"}
                    variants={{
                        visible: { transition: { staggerChildren: 0.12 } },
                        hidden: {},
                    }}
                >
                    <motion.div variants={fadeIn} className="space-y-10">
                        <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[0.65rem] uppercase tracking-[0.3em] text-white/60">
                            Repo radar
                            {lastUpdatedLabel && (
                                <span className="rounded-full bg-white/10 px-2 py-1 text-[0.6rem] tracking-[0.2em] text-white/50">
                                    Refreshed {lastUpdatedLabel}
                                </span>
                            )}
                        </div>
                        <h1 className="text-4xl font-semibold leading-tight text-balance sm:text-5xl lg:text-6xl">
                            An immersive stream of my GitHub work in motion.
                        </h1>
                        <p className="max-w-2xl text-lg text-white/65">
                            Explore infrastructure spikes, polished tools, and
                            playful experiments. Curated live, sorted at will,
                            framed inside a cinematic surface.
                        </p>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {statItems.map((item) => (
                                <Card
                                    key={item.label}
                                    variant="glass"
                                    ambient
                                    ambientSeed={item.label}
                                    ambientClassName="opacity-40"
                                    className="relative flex flex-col gap-2 p-6 border border-white/10 bg-white/5 backdrop-blur"
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
                    <motion.div variants={fadeIn} className="relative">
                        {spotlightRepo ? (
                            <Card
                                variant="glass"
                                ambient
                                ambientSeed={spotlightRepo.name}
                                ambientClassName="opacity-60"
                                className="relative flex flex-col h-full gap-6 p-8 overflow-hidden border border-white/10 bg-white/5 backdrop-blur"
                            >
                                <span className="text-xs uppercase tracking-[0.3em] text-white/50">
                                    Spotlight repository
                                </span>
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-semibold tracking-tight">
                                        {spotlightRepo.name}
                                    </h2>
                                    <p className="text-sm text-white/70">
                                        {spotlightRepo.description ||
                                            "A live project anchored in this season's focus."}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                                        <span className="flex items-center gap-2">
                                            <FaStar className="w-4 h-4 text-yellow-400" />
                                            {formatNumber(
                                                spotlightRepo.stargazers_count ||
                                                    0
                                            )}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <FaCodeFork className="w-4 h-4" />
                                            {formatNumber(
                                                spotlightRepo.forks_count || 0
                                            )}
                                        </span>
                                        {spotlightRepo.language && (
                                            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em]">
                                                {spotlightRepo.language}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-auto space-y-4">
                                    <div className="flex items-center justify-between text-sm text-white/60">
                                        <span>Language mix</span>
                                        <a
                                            href={spotlightRepo.html_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-white transition hover:border-white/40 hover:text-white"
                                        >
                                            <ImGithub className="w-4 h-4" />
                                            Open repo
                                        </a>
                                    </div>
                                    <LanguageBar repo={spotlightRepo.name} />
                                </div>
                            </Card>
                        ) : (
                            <Card
                                variant="glass"
                                ambient
                                ambientSeed="empty"
                                ambientClassName="opacity-40"
                                className="flex flex-col items-center justify-center h-full gap-4 p-8 border border-white/10 bg-white/5 text-white/60"
                            >
                                No repositories found right now.
                            </Card>
                        )}
                    </motion.div>
                </motion.div>
            </section>
            <section className="relative min-h-screen px-6 py-24 border-t border-white/5 sm:px-12">
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
                        {filteredRepoData.length === 0 && (
                            <Card
                                variant="glass"
                                ambient
                                ambientSeed="empty-state"
                                ambientClassName="opacity-40"
                                className="flex min-h-[240px] flex-col items-center justify-center border border-white/10 bg-white/5 p-10 text-center text-white/60"
                            >
                                No repositories match this sort right now.
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
                                    variant="minimal"
                                    ambient
                                    ambientSeed={repo.name}
                                    ambientClassName="opacity-30"
                                    className="relative p-8 overflow-hidden transition border group border-white/10 bg-white/5 backdrop-blur hover:border-white/30"
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
                                            <p className="max-w-3xl text-sm leading-relaxed text-white/70">
                                                {repo.description ||
                                                    "This project is still catching its breath after the latest deploy."}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
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
                                                        repo.forks_count || 0
                                                    )}
                                                </span>
                                                <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/50">
                                                    {repo.visibility}
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
                                                View
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
            </section>
        </main>
    );
}
