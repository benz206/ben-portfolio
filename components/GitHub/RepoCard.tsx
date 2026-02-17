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
        }
    );

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
                            {formatNumber(repo.stargazers_count || 0)}
                        </span>
                        <span className="inline-flex gap-2 items-center">
                            <FaCodeFork className="w-4 h-4" />
                            {formatNumber(repo.forks_count || 0)}
                        </span>
                        <span className="inline-flex gap-2 items-center">
                            <FaGithub className="w-4 h-4" />
                            {formatNumber(repo.watchers_count || 0)}
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
}
