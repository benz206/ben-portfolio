"use client";

import { useMemo, useSyncExternalStore } from "react";
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

const numberFormatter = new Intl.NumberFormat();
const formatNumber = (value: number) => numberFormatter.format(value);

const dayLabelFormatter = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
});

const cellAnimationBase = {
    animationTimingFunction: "ease-in-out",
    animationIterationCount: "infinite",
    animationDirection: "alternate",
    animationName: "githubHueCycle",
} as const;

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
    const mounted = useSyncExternalStore(
        () => () => {},
        () => true,
        () => false,
    );

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
            ambientClassName="opacity-35"
            className="flex relative flex-col gap-4 p-6 w-full"
        >
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-[0.2em] text-white/45">
                <span>Contributions · Past 52 weeks</span>
                <span>{formatNumber(totalCommits)} commits</span>
            </div>
            <div
                className="grid overflow-hidden gap-1 pb-1 w-full"
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
                            const gradient = contributionLevelGradients[level];
                            const validatedGradient =
                                gradient ?? contributionLevelGradients[0];
                            const isPlaceholder =
                                day.date.startsWith("placeholder");
                            const label =
                                mounted && day.date && !isPlaceholder
                                    ? `${day.count} contributions on ${dayLabelFormatter.format(new Date(day.date))}`
                                    : "";
                            const cellIndex = weekIndex * 7 + dayIndex;
                            const animationDelay = `${(cellIndex % 18) * 0.3}s`;
                            const animationDuration = `${14 + (cellIndex % 6)}s`;
                            return (
                                <div
                                    key={
                                        day.date ||
                                        `placeholder-${weekIndex}-${dayIndex}`
                                    }
                                    title={label}
                                    className={`h-4 w-4 rounded-1 border border-white/10${
                                        isPlaceholder ? "" : " github-cell"
                                    }`}
                                    style={{
                                        background: validatedGradient,
                                        opacity: isPlaceholder ? 0.15 : 1,
                                        ...(isPlaceholder
                                            ? {}
                                            : {
                                                  ...cellAnimationBase,
                                                  animationDelay,
                                                  animationDuration,
                                              }),
                                    }}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        </Card>
    );
}
