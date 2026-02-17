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
                className="grid w-full gap-[2px]"
                style={{
                    gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))`,
                }}
            >
                {weeks.map((week, weekIndex) => (
                    <div
                        key={`week-${weekIndex}`}
                        className="flex flex-col gap-[2px]"
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
                                    className="h-[10px] w-[10px] rounded-[2px]"
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
                            key={`legend-${idx}`}
                            className="h-[10px] w-[10px] rounded-[2px]"
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
