"use client";

import { useMemo } from "react";
import type {
    ContributionDay,
    ContributionWeek,
} from "@/components/home/useGithubContributions";

type ContributionHeatmapGridProps = {
    weeks: ContributionWeek[];
    maxCount: number;
    monthLabels: { index: number; label: string }[];
};

const resolveContributionLevel = (day: ContributionDay, maxCount: number) => {
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

export default function ContributionHeatmapGrid({
    weeks,
    maxCount,
    monthLabels,
}: ContributionHeatmapGridProps) {
    const contributionLevelGradients = useMemo(
        () => ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
        [],
    );

    const dayLabels = useMemo(() => {
        const labels: Record<string, string> = {};
        for (const week of weeks) {
            for (const day of week) {
                if (
                    day.date &&
                    !day.date.startsWith("placeholder-start") &&
                    !day.date.startsWith("placeholder-end")
                ) {
                    labels[day.date] = `${day.count} contributions on ${new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
                }
            }
        }
        return labels;
    }, [weeks]);

    return (
        <>
            <div
                className="grid mb-2 text-[11px] text-white/45"
                style={{
                    gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))`,
                }}
            >
                {weeks.map((_, weekIndex) => {
                    const month = monthLabels.find(
                        (m) => m.index === weekIndex,
                    );
                    return (
                        <div
                            key={`month-${weekIndex}`}
                            className="flex justify-start items-center"
                        >
                            {month?.label ?? ""}
                        </div>
                    );
                })}
            </div>
            <div
                className="grid w-full gap-0.5"
                style={{
                    gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))`,
                }}
            >
                {weeks.map((week, weekIndex) => (
                    <div
                        key={`week-${weekIndex}`}
                        className="flex flex-col gap-0.5"
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
                                day.date.startsWith("placeholder-start") ||
                                day.date.startsWith("placeholder-end");
                            const label = dayLabels[day.date] ?? "";
                            return (
                                <div
                                    key={
                                        day.date ||
                                        `placeholder-${weekIndex}-${dayIndex}`
                                    }
                                    title={label}
                                    className="size-2.5 rounded-0.5"
                                    style={
                                        isPlaceholder
                                            ? {
                                                  background: "transparent",
                                                  opacity: 0,
                                              }
                                            : {
                                                  backgroundColor:
                                                      validatedGradient,
                                              }
                                    }
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-white/40">
                <span>Less</span>
                <div className="flex items-center gap-1.5">
                    {contributionLevelGradients.map((color, idx) => (
                        <span
                            key={color}
                            className="size-2.5 rounded-0.5"
                            style={{
                                backgroundColor: color,
                            }}
                        />
                    ))}
                </div>
                <span>More</span>
            </div>
        </>
    );
}
