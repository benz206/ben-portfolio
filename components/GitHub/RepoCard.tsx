import { easeInOut } from "framer-motion";
import { ImGithub } from "react-icons/im";
import { FaCodeFork, FaStar, FaGithub } from "react-icons/fa6";
import Card from "@/components/Card";
import type { GitHubRepo } from "@/types";

const formatNumber = (value: number) => new Intl.NumberFormat().format(value);

type RepoCardProps = {
    repo: GitHubRepo;
    index: number;
};

export default function RepoCard({ repo, index }: RepoCardProps) {
    const updatedLabel = new Date(repo.updated_at).toLocaleDateString(
        undefined,
        {
            month: "short",
            day: "numeric",
            year: "numeric",
        },
    );

    return (
        <Card
            key={repo.id}
            variant="glass"
            ambient
            ambientVariant="magenta"
            ambientSeed={repo.name}
            ambientClassName="opacity-25"
            className="relative p-6 transition hover:border-white/35"
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
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-semibold tracking-tight lg:text-2xl">
                            {repo.name}
                        </h3>
                        <span className="rounded-full border border-white/10 px-3 py-1 text-[0.65rem] uppercase tracking-[0.25em] text-white/45">
                            Updated {updatedLabel}
                        </span>
                        {repo.language && (
                            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[0.65rem] uppercase tracking-[0.25em] text-white/65">
                                {repo.language}
                            </span>
                        )}
                    </div>
                    <p className="max-w-3xl text-sm leading-relaxed text-white/60">
                        {repo.description ||
                            "This project is still catching its breath after the latest deploy."}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                        <span className="inline-flex items-center gap-2">
                            <FaStar className="w-4 h-4 text-yellow-400" />
                            {formatNumber(repo.stargazers_count || 0)}
                        </span>
                        <span className="inline-flex items-center gap-2">
                            <FaCodeFork className="w-4 h-4" />
                            {formatNumber(repo.forks_count || 0)}
                        </span>
                        <span className="inline-flex items-center gap-2">
                            <FaGithub className="w-4 h-4" />
                            {formatNumber(repo.watchers_count || 0)}
                        </span>
                    </div>
                </div>
                <div className="flex items-center justify-between gap-4 lg:w-auto lg:flex-col lg:items-end">
                    <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-3 text-xs font-medium uppercase tracking-[0.25em] text-white transition hover:border-white hover:bg-white hover:text-black"
                    >
                        <ImGithub className="w-5 h-5" />
                        Open repo
                    </a>
                    <div className="text-right text-xs uppercase tracking-[0.3em] text-white/35">
                        #{index + 1}
                    </div>
                </div>
            </div>
        </Card>
    );
}
