"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Card from "@/components/Card";

type ContributionDay = {
    date: string;
    count: number;
    level: number;
};

type ContributionWeek = ContributionDay[];

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

const fadeIn = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 },
    },
};

export default function GithubContributionsSection() {
    const [contributionWeeks, setContributionWeeks] = useState<ContributionWeek[]>([]);
    const [maxContributionCount, setMaxContributionCount] = useState(0);

    const contributionLevelGradients = useMemo(
        () => ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
        []
    );

    useEffect(() => {
        const fetchWithCache = async (url: string, cacheKey: string) => {
            if (typeof window !== "undefined") {
                const cached = localStorage.getItem(cacheKey);
                if (cached) {
                    const { data, timestamp } = JSON.parse(cached);
                    if (Date.now() - timestamp < 60 * 60 * 1000) {
                        return data;
                    }
                }
            }
            const response = await fetch(url);
            const data = await response.json();
            if (typeof window !== "undefined") {
                localStorage.setItem(
                    cacheKey,
                    JSON.stringify({ data, timestamp: Date.now() })
                );
            }
            return data;
        };

        (async () => {
            try {
                const contributions = await fetchWithCache(
                    "https://github-contributions-api.jogruber.de/v4/benz206",
                    "github_contributions_home"
                );

                const rawDays: ContributionDay[] = contributions?.contributions ?? [];
                const contributionMap = new Map<string, ContributionDay>();
                rawDays.forEach((day) => {
                    if (day.date) {
                        contributionMap.set(day.date, day);
                    }
                });

                const now = new Date();
                const year = now.getFullYear();
                const startOfYear = new Date(year, 0, 1);
                const endOfYear = new Date(year, 11, 31);

                const formatDate = (date: Date) =>
                    date.toISOString().split("T")[0] ?? "";

                const days: ContributionDay[] = [];
                let maxCount = 0;

                for (
                    let d = new Date(startOfYear);
                    d <= endOfYear;
                    d.setDate(d.getDate() + 1)
                ) {
                    const key = formatDate(d);
                    const existing = contributionMap.get(key);
                    const count = existing?.count ?? 0;
                    if (count > maxCount) {
                        maxCount = count;
                    }
                    days.push(
                        existing ?? {
                            date: key,
                            count,
                            level: 0,
                        }
                    );
                }

                const paddedDays: ContributionDay[] = [];

                // GitHub-style alignment: weeks are columns, Sunday at top.
                // Start padding so that Jan 1 lands in the correct weekday row.
                const startPadding = startOfYear.getDay(); // 0 = Sun ... 6 = Sat
                for (let i = 0; i < startPadding; i++) {
                    paddedDays.push({
                        date: `placeholder-start-${i}`,
                        count: 0,
                        level: 0,
                    });
                }

                paddedDays.push(...days);

                // Ensure full weeks at the end
                while (paddedDays.length % 7 !== 0) {
                    paddedDays.push({
                        date: `placeholder-end-${paddedDays.length}`,
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
                console.error("Error fetching contribution data:", error);
            }
        })();
    }, []);

    const monthLabels = useMemo(() => {
        const labels: { index: number; label: string }[] = [];
        let lastLabel = "";

        contributionWeeks.forEach((week, index) => {
            const firstRealDay = week.find(
                (day) =>
                    !day.date.startsWith("placeholder-start") &&
                    !day.date.startsWith("placeholder-end")
            );
            if (!firstRealDay) return;

            const date = new Date(firstRealDay.date);
            const label = date.toLocaleDateString(undefined, { month: "short" });

            if (!labels.length || label !== lastLabel) {
                labels.push({ index, label });
                lastLabel = label;
            }
        });

        // If data includes the tail end of the previous year, drop labels before Jan
        const firstJanIndex = labels.findIndex((m) => m.label === "Jan");
        if (firstJanIndex > 0) {
            return labels.slice(firstJanIndex);
        }

        return labels;
    }, [contributionWeeks]);

    return (
        <section className="flex relative justify-center items-center py-24 home-section">
            <div className="absolute inset-0 bg-noir-gradient-berry" />
            <div className="absolute inset-0 opacity-90 bg-noir-radial-berry" />
            <div className="relative z-10 flex w-11/12 max-w-[1080px] flex-col gap-10 text-white">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.4 }}
                    variants={fadeIn}
                    className="space-y-3"
                >
                    <span className="text-xs uppercase tracking-[0.2em] text-white/45">
                        GitHub
                    </span>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeIn}
                >
                    <Card
                        variant="glass"
                        ambient
                        ambientVariant="violet"
                        ambientClassName="opacity-40"
                        className="flex relative flex-col gap-4 p-6 w-full"
                    >
                        <div className="flex gap-4 items-start">
                            <div className="flex flex-col gap-[8px] pt-[22px] text-[11px] text-white/35">
                                <span>Mon</span>
                                <span>Wed</span>
                                <span>Fri</span>
                            </div>
                            <div className="overflow-hidden flex-1">
                                <div
                                    className="grid mb-2 text-[11px] text-white/45"
                                    style={{
                                        gridTemplateColumns: `repeat(${contributionWeeks.length}, minmax(0, 1fr))`,
                                    }}
                                >
                                    {contributionWeeks.map((_, weekIndex) => {
                                        const month = monthLabels.find(
                                            (m) => m.index === weekIndex
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
                                        gridTemplateColumns: `repeat(${contributionWeeks.length}, minmax(0, 1fr))`,
                                    }}
                                >
                                    {contributionWeeks.map((week, weekIndex) => (
                                        <div
                                            key={`week-${weekIndex}`}
                                            className="flex flex-col gap-[2px]"
                                        >
                                            {week.map((day, dayIndex) => {
                                                const level = resolveContributionLevel(
                                                    day,
                                                    maxContributionCount
                                                );
                                                const gradient =
                                                    contributionLevelGradients[level];
                                                const validatedGradient =
                                                    gradient ??
                                                    contributionLevelGradients[0];
                                                const isPlaceholder =
                                                    day.date.startsWith(
                                                        "placeholder-start"
                                                    ) ||
                                                    day.date.startsWith(
                                                        "placeholder-end"
                                                    );
                                                const label =
                                                    day.date && !isPlaceholder
                                                        ? `${day.count} contributions on ${new Date(
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
                                                        className="h-[10px] w-[10px] rounded-[2px]"
                                                        style={
                                                            isPlaceholder
                                                                ? {
                                                                      background:
                                                                          "transparent",
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
                                                // using index is fine here; static palette
                                                key={`legend-${idx}`}
                                                className="h-[10px] w-[10px] rounded-[2px]"
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                    <span>More</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}




