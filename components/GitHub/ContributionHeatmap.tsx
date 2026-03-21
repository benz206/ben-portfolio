"use client";

import { useMemo } from "react";
import Card from "@/components/Card";
import type { GitHubContributionsDay } from "@/types/externalApis";

type ContributionWeek = GitHubContributionsDay[];

const resolveContributionLevel = (
    day: GitHubContributionsDay,
    maxCount: number,
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

const formatNumber = (value: number) => new Intl.NumberFormat().format(value);

type ContributionHeatmapProps = {
    weeks: ContributionWeek[];
    maxCount: number;
    totalCommits: number;
};

export default function ContributionHeatmap({
    weeks,
    maxCount,
    totalCommits,
}: ContributionHeatmapProps) {
    const contributionLevelGradients = useMemo(
        () => [
            "linear-gradient(135deg, rgba(148,163,184,0.12) 0%, rgba(71,85,105,0.16) 100%)",
            "linear-gradient(135deg, rgba(134,239,172,0.35) 0%, rgba(74,222,128,0.32) 100%)",
            "linear-gradient(135deg, rgba(74,222,128,0.55) 0%, rgba(34,197,94,0.48) 100%)",
            "linear-gradient(135deg, rgba(34,197,94,0.75) 0%, rgba(22,163,74,0.62) 100%)",
            "linear-gradient(135deg, rgba(22,163,74,0.92) 0%, rgba(4,120,87,0.82) 100%)",
        ],
        [],
    );

    return (
        <Card
            variant="glass"
            ambient
            ambientVariant="violet"
            ambientClassName="opacity-25"
            className="relative flex w-full flex-col gap-5 p-6"
        >
            <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-[0.3em] text-white/40">
                    <span>Past 52 weeks</span>
                    <span>{formatNumber(totalCommits)} commits</span>
                </div>
                <p className="max-w-2xl text-sm leading-relaxed text-white/60">
                    A condensed heatmap of the last year of GitHub activity.
                </p>
            </div>
            <div className="overflow-x-auto pb-1">
                <div
                    className="grid min-w-max gap-1"
                    style={{
                        gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))`,
                    }}
                >
                    {weeks.map((week, weekIndex) => (
                        <div
                            key={`week-${weekIndex}`}
                            className="flex flex-col gap-1"
                        >
                            {week.map((day, dayIndex) => {
                                const level = resolveContributionLevel(
                                    day,
                                    maxCount,
                                );
                                const gradient =
                                    contributionLevelGradients[level];
                                const validatedGradient =
                                    gradient ?? contributionLevelGradients[0];
                                const isPlaceholder =
                                    day.date.startsWith("placeholder");
                                const label =
                                    day.date && !isPlaceholder
                                        ? `${day.count} contributions on ${new Date(
                                              day.date,
                                          ).toLocaleDateString(undefined, {
                                              month: "short",
                                              day: "numeric",
                                          })}`
                                        : "";
                                return (
                                    <div
                                        key={
                                            day.date ||
                                            `placeholder-${weekIndex}-${dayIndex}`
                                        }
                                        title={label}
                                        className="h-3.5 w-3.5 rounded-[4px] border border-white/10"
                                        style={{
                                            background: validatedGradient,
                                            opacity: isPlaceholder ? 0.15 : 1,
                                        }}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.25em] text-white/35">
                <span>Less</span>
                <div className="flex items-center gap-1.5">
                    {contributionLevelGradients.map((gradient, index) => (
                        <span
                            key={gradient}
                            className="h-2.5 w-2.5 rounded-full border border-white/10"
                            style={{
                                background: gradient,
                                opacity: index === 0 ? 0.45 : 1,
                            }}
                        />
                    ))}
                </div>
                <span>More</span>
            </div>
        </Card>
    );
}
