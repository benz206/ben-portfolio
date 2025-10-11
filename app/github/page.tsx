"use client";
"use client";
import { motion, useInView, easeInOut } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { GitHubRepo } from "@/types";
import { ImGithub } from "react-icons/im";
import { FaStar, FaCodeFork } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";
import { IoMdGrid } from "react-icons/io";
import { IoChevronDown } from "react-icons/io5";
import Tags from "@/components/GitHub/Tags";
import LanguageBar from "@/components/GitHub/LanguageBar";
import Card from "@/components/Card";

const boxAnim = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { delayChildren: 0.3, staggerChildren: 0.2 },
    },
};
const boxItem = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 1, ease: easeInOut } },
};

enum Dropdown {
    Grid,
    List,
}
enum SortOption {
    Name = "name",
    Stars = "stars",
    Forks = "forks",
    Language = "language",
}

type TagGlow = { [key: string]: string };
export const boxGlows: TagGlow[] = [
    { Python: "hover:shadow-blue-500" },
    { CSS: "hover:shadow-purple-500" },
    { "C++": "hover:shadow-yellow-400" },
    { GDScript: "hover:shadow-slate-800" },
    { Svelte: "hover:shadow-[#ff3e00]" },
    { C: "hover:shadow-gray-500" },
    { Java: "hover:shadow-red-500" },
    { Rust: "hover:shadow-[#CE412B]" },
    { TypeScript: "hover:shadow-[#007acc]" },
    { HTML: "hover:shadow-emerald-500" },
    { JavaScript: "hover:shadow-[#f0db4f]" },
    { React: "hover:shadow-[#61dafb]" },
    { "Next.js": "hover:shadow-[#000000]" },
    { MongoDB: "hover:shadow-[#00ed64]" },
    { "Node.js": "hover:shadow-[#68a063]" },
    { Redis: "hover:shadow-[#dc382d]" },
    { TailwindCSS: "hover:shadow-[#0ea5e9]" },
    { MySQL: "hover:shadow-[#00758f]" },
    { SQLite: "hover:shadow-[#003b57]" },
    { PostgreSQL: "hover:shadow-[#336791]" },
    { Firebase: "hover:shadow-[#ffca28]" },
    { Vercel: "hover:shadow-[#000000]" },
];
function getGlowClass(language: string): string {
    const glow = boxGlows.find((g) => g[language]);
    return (
        (glow ? glow[language] : "hover:shadow-white") +
        " hover:shadow-xl duration-500 ease-in-out"
    );
}

export default function GithubPage() {
    const [repoData, setRepoData] = useState<GitHubRepo[]>([]);
    const [filteredRepoData, setFilteredRepoData] = useState<GitHubRepo[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState(Dropdown.Grid);
    const [sortBy, setSortBy] = useState<SortOption>(SortOption.Name);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const contentRef = useRef(null);
    const heroRef = useRef(null);
    const sortDropdownRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(contentRef, { once: true });
    const isHeroInView = useInView(heroRef, { once: true });

    const fetchWithCache = async (url: string, cacheKey: string) => {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            const now = Date.now();
            if (now - timestamp < 24 * 60 * 60 * 1000) return data;
        }
        const resp = await fetch(url);
        const data = await resp.json();
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
                const filtered = data.filter(
                    (repo: GitHubRepo) =>
                        repo.name != "benz206" &&
                        repo.name.indexOf("experiments") == -1 &&
                        repo.name.indexOf("learning") == -1
                );
                setRepoData(filtered);
                setLoading(false);
            } catch (e) {
                console.error("Error fetching repository data:", e);
                setLoading(false);
            }
        })();
    }, []);

    const sortRepositories = (
        repos: GitHubRepo[],
        s: SortOption,
        order: "asc" | "desc"
    ) => {
        return [...repos].sort((a, b) => {
            let aValue: any;
            let bValue: any;
            switch (s) {
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
                default:
                    return 0;
            }
            if (aValue < bValue) return order === "asc" ? -1 : 1;
            if (aValue > bValue) return order === "asc" ? 1 : -1;
            return 0;
        });
    };

    useEffect(() => {
        setFilteredRepoData(sortRepositories(repoData, sortBy, sortOrder));
    }, [repoData, sortBy, sortOrder]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                sortDropdownRef.current &&
                !sortDropdownRef.current.contains(event.target as Node)
            ) {
                setShowSortDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSortChange = (newSortBy: SortOption) => {
        if (sortBy === newSortBy)
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        else {
            setSortBy(newSortBy);
            setSortOrder("desc");
        }
        setShowSortDropdown(false);
    };

    const getSortLabel = (option: SortOption) => {
        switch (option) {
            case SortOption.Name:
                return "Name";
            case SortOption.Stars:
                return "Stars";
            case SortOption.Forks:
                return "Forks";
            case SortOption.Language:
                return "Language";
            default:
                return "Name";
        }
    };

    return (
        <>
            <section className="relative flex justify-center overflow-hidden bg-[#050506] py-32 text-white">
                <div className="absolute inset-0 bg-noir-gradient" />
                <div className="absolute inset-0 bg-noir-radial opacity-70" />
                <Card
                    variant="glass"
                    ambient
                    ambientSeed="github"
                    ambientClassName="opacity-60"
                    className="relative flex h-[320px] w-11/12 max-w-[1000px] flex-col justify-center p-12"
                    motionProps={{
                        ref: heroRef,
                        initial: { opacity: 0, y: 40 },
                        animate: isHeroInView
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: 40 },
                        transition: { duration: 0.6 },
                    }}
                >
                    <span className="text-xs uppercase tracking-[0.4em] text-white/40">
                        Repo radar
                    </span>
                    <h1 className="mt-4 text-4xl font-semibold lg:text-5xl">
                        GitHub workstreams and experiments.
                    </h1>
                    <p className="mt-4 max-w-2xl text-sm text-white/60">
                        Dig into the shipped experiments, infrastructure, and tools I maintain. Sorted with intent, filterable, always live.
                    </p>
                </Card>
            </section>
            <motion.div
                ref={contentRef}
                className="flex flex-col flex-wrap justify-center content-center pt-12 pb-16 w-full min-h-screen lg:pb-20 lg:pt-24 3xl:pt-12"
                initial={{ opacity: 0, y: 50 }}
                animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
                }
                transition={{ duration: 0.5 }}
            >
                {isLoading && (
                    <div className="flex flex-col justify-center items-center w-full h-full">
                        <AiOutlineLoading className="w-24 h-24 text-black animate-spin" />
                    </div>
                )}
                <div className="flex gap-4 justify-center items-center p-6 ml-auto">
                    <div className="relative" ref={sortDropdownRef}>
                        <button
                            onClick={() =>
                                setShowSortDropdown(!showSortDropdown)
                            }
                            className="flex gap-2 items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-[#ececec] bg-white/80 dark:bg-[#121212]/30 backdrop-blur-md rounded-lg transition-all duration-200 ease-in-out hover:bg-white/90 dark:hover:bg-[#121212]/50"
                        >
                            Sort by: {getSortLabel(sortBy)}
                            <IoChevronDown
                                className={`w-4 h-4 transition-transform ${
                                    showSortDropdown ? "rotate-180" : ""
                                }`}
                            />
                        </button>
                        {showSortDropdown && (
                            <div className="absolute left-0 top-full z-10 mt-1 w-48 bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md rounded-lg drop-shadow-xl">
                                {Object.values(SortOption).map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => handleSortChange(option)}
                                        className={`w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-[#ececec] hover:bg-white/50 dark:hover:bg-[#121212]/70 transition-all duration-200 ease-in-out ${
                                            sortBy === option
                                                ? "bg-white/70 dark:bg-[#121212]/60 font-medium"
                                                : ""
                                        }`}
                                    >
                                        {getSortLabel(option)}
                                        {sortBy === option && (
                                            <span className="ml-2 text-xs">
                                                {sortOrder === "asc"
                                                    ? "↑"
                                                    : "↓"}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => setViewMode(Dropdown.Grid)}
                        className={`p-2 rounded-lg transition-colors ${
                            viewMode === Dropdown.Grid
                                ? "text-gray-600 dark:text-gray-200"
                                : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                        }`}
                        title="Grid View"
                    >
                        <IoMdGrid className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => setViewMode(Dropdown.List)}
                        className={`rounded-lg transition-colors ${
                            viewMode === Dropdown.List
                                ? "text-gray-600 dark:text-gray-200"
                                : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                        }`}
                        title="List View"
                    >
                        <IoMenu className="w-6 h-6" />
                    </button>
                </div>
                <motion.div
                    className={`${
                        viewMode === Dropdown.Grid
                            ? "grid gap-y-12 lg:gap-y-10 w-11/12 md:w-[600px] xl:w-[1300px] 3xl:w-[1850px] py-5 pt-0 grid-flow-row grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-x-5 md:gap-x-7 lg:gap-x-16"
                            : "flex flex-col w-11/12 md:w-[600px] xl:w-[1000px] divide-y divide-gray-200 dark:divide-gray-800"
                    }`}
                    variants={boxAnim}
                    initial="hidden"
                    animate="visible"
                >
                    {!isLoading &&
                        filteredRepoData.map((repo, index) => (
                            <Card
                                className={`${
                                    viewMode === Dropdown.Grid
                                        ? "flex flex-col justify-center w-full h-full px-5 py-4"
                                        : "flex flex-col w-full py-6 first:pt-0 last:pb-0"
                                } ${
                                    viewMode === Dropdown.Grid
                                        ? getGlowClass(repo.language)
                                        : ""
                                }`}
                                key={repo.id}
                                motionProps={{
                                    variants: boxItem,
                                    custom: index,
                                }}
                            >
                                <div
                                    className={`${
                                        viewMode === Dropdown.List
                                            ? "flex items-center gap-4"
                                            : ""
                                    }`}
                                >
                                    <h1
                                        className={`text-2xl font-bold ${
                                            viewMode === Dropdown.List
                                                ? "flex-1"
                                                : ""
                                        }`}
                                    >
                                        {repo.name}
                                    </h1>
                                    {viewMode === Dropdown.List && (
                                        <div className="flex gap-4 items-center">
                                            {repo.stargazers_count > 0 && (
                                                <p className="flex items-center text-sm font-base">
                                                    <FaStar className="mx-1 my-auto w-4 h-4 text-yellow-300" />
                                                    {repo.stargazers_count}
                                                </p>
                                            )}
                                            {repo.forks > 0 && (
                                                <p className="flex justify-center items-center text-sm font-base">
                                                    <FaCodeFork className="mx-1 my-auto w-4 h-4" />
                                                    {repo.forks_count}
                                                </p>
                                            )}
                                            <div>
                                                <Tags
                                                    rawTags={[repo.language]}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <p
                                    className={`py-3 text-sm font-light ${
                                        viewMode === Dropdown.List
                                            ? "flex-1"
                                            : ""
                                    }`}
                                >
                                    {repo.description}
                                </p>
                                <div
                                    className={`flex items-center py-1 ${
                                        viewMode === Dropdown.Grid
                                            ? "mt-auto"
                                            : ""
                                    }`}
                                >
                                    <a
                                        className="flex justify-center items-center px-2.5 py-1.5 text-sm font-normal text-white transition-all duration-200 ease-in-out bg-black rounded-lg hover:bg-[#6e5494] hover:text-white"
                                        href={repo.html_url}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                    >
                                        <ImGithub className="w-5 h-5 my-auto mr-1.5" />
                                        GitHub
                                    </a>
                                    {viewMode === Dropdown.Grid && (
                                        <>
                                            {repo.stargazers_count > 0 && (
                                                <p className="flex items-center mx-1.5 text-sm font-base">
                                                    <FaStar className="mx-1 my-auto w-4 h-4 text-yellow-300" />
                                                    {repo.stargazers_count}
                                                </p>
                                            )}
                                            {repo.forks > 0 && (
                                                <p className="flex items-center justify-center mx-1.5 mr-auto text-sm font-base">
                                                    <FaCodeFork className="mx-1 my-auto w-4 h-4" />
                                                    {repo.forks_count}
                                                </p>
                                            )}
                                            <div className="ml-auto">
                                                <Tags
                                                    rawTags={[repo.language]}
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                                {viewMode === Dropdown.Grid && (
                                    <div className="mt-2">
                                        <LanguageBar repo={repo.name} />
                                    </div>
                                )}
                            </Card>
                        ))}
                </motion.div>
            </motion.div>
        </>
    );
}
