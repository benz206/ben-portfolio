"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@/components/Card";
import { AmbientGradient } from "@/components/AmbientGradient";
import { cn } from "@/utils/cn";

type ContributionDay = {
    date: string;
    count: number;
    level: ContributionLevel;
};

type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export type ContributionStats = {
    total: number;
    currentStreak: {
        length: number;
        start: string | null;
        end: string | null;
    };
    longestStreak: {
        length: number;
        start: string | null;
        end: string | null;
    };
    bestDay: { date: string | null; count: number };
};

type CommitGraphProps = {
    username?: string;
    onStatsChange?: (stats: ContributionStats) => void;
    onLoadingChange?: (loading: boolean) => void;
    onErrorChange?: (error: string | null) => void;
};

const palettesByLevel: Partial<
    Record<ContributionLevel, "mint" | "lagoon" | "aurora" | "grape">
> = {
    1: "mint",
    2: "lagoon",
    3: "aurora",
    4: "grape",
};

const cellBaseByLevel: Record<ContributionLevel, string> = {
    0: "bg-white/5 border border-white/10",
    1: "bg-emerald-300/25 border border-emerald-200/60",
    2: "bg-emerald-300/40 border border-emerald-200/70",
    3: "bg-emerald-200/55 border border-emerald-100/70",
    4: "bg-emerald-100/70 border border-emerald-50/80",
};

const labelFormatter = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
});

const weekdayLabels = ["S", "M", "T", "W", "T", "F", "S"];

function toDateKey(value: Date) {
    return value.toISOString().slice(0, 10);
}

function buildRange(days: ContributionDay[]) {
    if (!days.length) {
        return [];
    }
    const end = new Date();
    end.setHours(0, 0, 0, 0);
    const start = new Date(end);
    start.setDate(start.getDate() - 7 * 52 + 1);
    const paddedStart = new Date(start);
    paddedStart.setDate(paddedStart.getDate() - paddedStart.getDay());
    const paddedEnd = new Date(end);
    paddedEnd.setDate(paddedEnd.getDate() + (6 - paddedEnd.getDay()));
    const lookup = new Map(days.map((day) => [day.date, day]));
    const full: ContributionDay[] = [];
    for (
        let cursor = new Date(paddedStart);
        cursor <= paddedEnd;
        cursor.setDate(cursor.getDate() + 1)
    ) {
        const key = toDateKey(cursor);
        const found = lookup.get(key);
        if (found) {
            full.push(found);
        } else {
            full.push({ date: key, count: 0, level: 0 });
        }
    }
    const weeks: ContributionDay[][] = [];
    for (let i = 0; i < full.length; i += 7) {
        weeks.push(full.slice(i, i + 7));
    }
    return weeks;
}

function calculateStats(days: ContributionDay[]): ContributionStats {
    if (!days.length) {
        return {
            total: 0,
            currentStreak: {
                length: 0,
                start: null as string | null,
                end: null as string | null,
            },
            longestStreak: {
                length: 0,
                start: null as string | null,
                end: null as string | null,
            },
            bestDay: { date: null as string | null, count: 0 },
        };
    }
    const ordered = [...days].sort(
        (a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf()
    );
    let longestLength = 0;
    let longestStart: string | null = null;
    let longestEnd: string | null = null;
    let tempLength = 0;
    let tempStart: string | null = null;
    let best = ordered[0];
    let total = 0;
    for (const day of ordered) {
        total += day.count;
        if (day.count > best.count) {
            best = day;
        }
        if (day.count > 0) {
            tempLength += 1;
            if (!tempStart) {
                tempStart = day.date;
            }
            if (tempLength > longestLength) {
                longestLength = tempLength;
                longestStart = tempStart;
                longestEnd = day.date;
            }
        } else {
            tempLength = 0;
            tempStart = null;
        }
    }
    let currentLength = 0;
    let currentStart: string | null = null;
    for (let i = ordered.length - 1; i >= 0; i -= 1) {
        const day = ordered[i];
        if (day.count > 0) {
            currentLength += 1;
            currentStart = day.date;
        } else {
            break;
        }
    }
    const currentEnd = currentLength > 0 ? ordered.at(-1)?.date ?? null : null;
    const longest = {
        length: longestLength,
        start: longestStart,
        end: longestEnd,
    };
    const current = {
        length: currentLength,
        start: currentStart,
        end: currentEnd,
    };
    return {
        total,
        currentStreak: current,
        longestStreak: longest,
        bestDay: { date: best.date, count: best.count },
    };
}

function formatRange(start: string | null, end: string | null) {
    if (!start || !end) {
        return "";
    }
    const startLabel = labelFormatter.format(new Date(start));
    const endLabel = labelFormatter.format(new Date(end));
    if (startLabel === endLabel) {
        return startLabel;
    }
    return `${startLabel} → ${endLabel}`;
}

export default function CommitGraph({
    username = "benz206",
    onStatsChange,
    onLoadingChange,
    onErrorChange,
}: CommitGraphProps) {
    const [weeks, setWeeks] = useState<ContributionDay[][]>([]);
    const [flatDays, setFlatDays] = useState<ContributionDay[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        onLoadingChange?.(true);
        setError(null);
        onErrorChange?.(null);
        fetch(`https://github-contributions-api.jogruber.de/v4/${username}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Request failed with ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (cancelled) {
                    return;
                }
                const contributions: ContributionDay[] = Array.isArray(
                    data?.contributions
                )
                    ? data.contributions
                    : [];
                const filtered = contributions.filter((day) => {
                    const date = new Date(day.date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const cutoff = new Date(today);
                    cutoff.setDate(cutoff.getDate() - 7 * 52);
                    return date >= cutoff && date <= today;
                });
                const weeksData = buildRange(filtered);
                setWeeks(weeksData);
                setFlatDays(weeksData.flat());
            })
            .catch((err: unknown) => {
                if (cancelled) {
                    return;
                }
                setError(err instanceof Error ? err.message : "Failed to load");
                setWeeks([]);
                setFlatDays([]);
                onErrorChange?.(
                    err instanceof Error ? err.message : "Failed to load"
                );
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                    onLoadingChange?.(false);
                }
            });
        return () => {
            cancelled = true;
        };
    }, [username]);

    const stats = useMemo(() => calculateStats(flatDays), [flatDays]);

    useEffect(() => {
        if (!flatDays.length) {
            return;
        }
        onStatsChange?.(stats);
    }, [stats, flatDays.length, onStatsChange]);

    useEffect(() => {
        if (error) {
            onErrorChange?.(error);
        }
    }, [error, onErrorChange]);

    const grid = useMemo(() => {
        if (!weeks.length) {
            return null;
        }
        return (
            <div className="relative">
                <div className="absolute inset-0 pointer-events-none">
                    <AmbientGradient
                        palette="aurora"
                        className="opacity-30 mix-blend-screen"
                    />
                </div>
                <div className="relative flex gap-1 pb-6 overflow-x-auto">
                    <div className="flex flex-col justify-between pr-2 text-[0.6rem] text-white/35">
                        {weekdayLabels.map((label) => (
                            <span key={label} className="h-4 leading-4">
                                {label}
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-1">
                        {weeks.map((week, weekIndex) => (
                            <div
                                key={weekIndex}
                                className="flex flex-col gap-1"
                            >
                                {week.map((day) => (
                                    <DayCell key={day.date} day={day} />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }, [weeks]);

    return (
        <Card
            variant="glass"
            ambient
            ambientSeed={`${username}-commit-graph`}
            ambientClassName="opacity-50"
            className="relative flex flex-col gap-6 p-8 overflow-hidden border border-white/10 bg-white/5 backdrop-blur"
        >
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-white">
                        Commit climate
                    </h2>
                    <p className="text-sm text-white/60">
                        Ambient overview of the last 52 weeks for @{username}
                    </p>
                </div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/45">
                    <span>All activity</span>
                    <span>&#x2022;</span>
                    <span>{stats.total.toLocaleString()} contributions</span>
                </div>
            </div>
            <div className="relative min-h-[120px] rounded-3xl border border-white/10 bg-black/30 p-4">
                {isLoading && (
                    <div className="grid h-full w-full animate-pulse place-items-center text-xs uppercase tracking-[0.3em] text-white/30">
                        Calibrating graph
                    </div>
                )}
                {!isLoading && error && (
                    <div className="grid w-full h-full text-sm text-center place-items-center text-white/60">
                        {error}
                    </div>
                )}
                {!isLoading && !error && grid}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                <Metric
                    label="Current streak"
                    value={`${stats.currentStreak.length} days`}
                    sublabel={formatRange(
                        stats.currentStreak.start,
                        stats.currentStreak.end
                    )}
                />
                <Metric
                    label="Longest streak"
                    value={`${stats.longestStreak.length} days`}
                    sublabel={formatRange(
                        stats.longestStreak.start,
                        stats.longestStreak.end
                    )}
                />
                <Metric
                    label="Peak day"
                    value={`${stats.bestDay.count} commits`}
                    sublabel={
                        stats.bestDay.date
                            ? labelFormatter.format(
                                  new Date(stats.bestDay.date)
                              )
                            : ""
                    }
                />
                <Metric
                    label="Weekly rhythm"
                    value={`${weeks.length} weeks`}
                    sublabel="Flowing across ambient tiles"
                />
            </div>
        </Card>
    );
}

function DayCell({ day }: { day: ContributionDay }) {
    const { date, count, level } = day;
    const palette = level > 0 ? palettesByLevel[level] : null;
    const label = `${labelFormatter.format(new Date(date))} • ${count} commit${
        count === 1 ? "" : "s"
    }`;
    return (
        <div className="relative group">
            <div
                className={cn(
                    "relative flex h-4 w-4 items-center justify-center overflow-hidden rounded-lg transition-transform duration-150 group-hover:scale-110",
                    cellBaseByLevel[level] ?? cellBaseByLevel[0]
                )}
                title={label}
            >
                {palette && (
                    <AmbientGradient
                        palette={palette}
                        className="opacity-70 mix-blend-screen"
                    />
                )}
                <span className="sr-only">{label}</span>
            </div>
            <div className="pointer-events-none absolute left-1/2 top-full mt-2 hidden -translate-x-1/2 rounded-full border border-white/10 bg-black/80 px-3 py-1 text-[0.65rem] uppercase tracking-[0.25em] text-white/70 group-hover:flex">
                {count} / {labelFormatter.format(new Date(date))}
            </div>
        </div>
    );
}

function Metric({
    label,
    value,
    sublabel,
}: {
    label: string;
    value: string;
    sublabel?: string;
}) {
    return (
        <div className="p-4 border rounded-2xl border-white/10 bg-white/5 text-white/80">
            <div className="text-xs uppercase tracking-[0.3em] text-white/45">
                {label}
            </div>
            <div className="text-2xl font-semibold text-white">{value}</div>
            {sublabel && (
                <div className="mt-2 text-xs text-white/55">{sublabel}</div>
            )}
        </div>
    );
}
