import { useEffect, useMemo, useState } from "react";

export type ContributionDay = {
    date: string;
    count: number;
    level: number;
};

export type ContributionWeek = ContributionDay[];

type MonthLabel = {
    index: number;
    label: string;
};

type ContributionState = {
    weeks: ContributionWeek[];
    maxCount: number;
    monthLabels: MonthLabel[];
};

export function useGithubContributions(): ContributionState {
    const [fetched, setFetched] = useState<{
        weeks: ContributionWeek[];
        maxCount: number;
    }>({ weeks: [], maxCount: 0 });

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
                    JSON.stringify({ data, timestamp: Date.now() }),
                );
            }
            return data;
        };

        (async () => {
            try {
                const contributions = await fetchWithCache(
                    "https://github-contributions-api.jogruber.de/v4/benz206",
                    "github_contributions_home",
                );

                const rawDays: ContributionDay[] =
                    contributions?.contributions ?? [];
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
                        },
                    );
                }

                const paddedDays: ContributionDay[] = [];

                const startPadding = startOfYear.getDay();
                for (let i = 0; i < startPadding; i += 1) {
                    paddedDays.push({
                        date: `placeholder-start-${i}`,
                        count: 0,
                        level: 0,
                    });
                }

                paddedDays.push(...days);

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
                setFetched({ weeks, maxCount });
            } catch {
                setFetched({ weeks: [], maxCount: 0 });
            }
        })();
    }, []);

    const monthLabels = useMemo(() => {
        const labels: MonthLabel[] = [];
        let lastLabel = "";

        fetched.weeks.forEach((week, index) => {
            const firstRealDay = week.find(
                (day) =>
                    !day.date.startsWith("placeholder-start") &&
                    !day.date.startsWith("placeholder-end"),
            );
            if (!firstRealDay) return;

            const date = new Date(firstRealDay.date);
            const label = date.toLocaleDateString(undefined, {
                month: "short",
            });

            if (!labels.length || label !== lastLabel) {
                labels.push({ index, label });
                lastLabel = label;
            }
        });

        const firstJanIndex = labels.findIndex((m) => m.label === "Jan");
        if (firstJanIndex > 0) {
            return labels.slice(firstJanIndex);
        }

        return labels;
    }, [fetched.weeks]);

    return {
        weeks: fetched.weeks,
        maxCount: fetched.maxCount,
        monthLabels,
    };
}
