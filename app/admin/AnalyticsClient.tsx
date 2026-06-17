"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { formatCompact, formatNumber } from "@/utils/format";
import { cn } from "@/utils/cn";

type Bucket = { label: string; count: number };

type Analytics = {
    rangeDays: number;
    totalViews: number;
    uniqueSessions: number;
    uniqueVisitors: number;
    timeseries: { date: string; views: number; sessions: number }[];
    topPaths: Bucket[];
    topReferrers: Bucket[];
    countries: Bucket[];
    devices: Bucket[];
    browsers: Bucket[];
};

const KEY_STORAGE = "portfolio:adminKey";
const RANGES = [7, 30, 90, 365] as const;

function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <p className="text-xs uppercase tracking-wider text-white/40">
                {label}
            </p>
            <p className="mt-2 text-3xl font-light text-white">
                {formatNumber(value)}
            </p>
        </div>
    );
}

function BarList({ title, buckets }: { title: string; buckets: Bucket[] }) {
    const max = Math.max(1, ...buckets.map((b) => b.count));
    return (
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <h3 className="mb-4 text-sm font-medium text-white/70">{title}</h3>
            {buckets.length === 0 ? (
                <p className="text-sm text-white/30">No data yet.</p>
            ) : (
                <ul className="space-y-2.5">
                    {buckets.map((b) => (
                        <li key={b.label} className="text-sm">
                            <div className="mb-1 flex justify-between gap-3 text-white/70">
                                <span className="truncate">{b.label}</span>
                                <span className="tabular-nums text-white/50">
                                    {formatNumber(b.count)}
                                </span>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                                <div
                                    className="h-full rounded-full bg-white/40"
                                    style={{
                                        width: `${(b.count / max) * 100}%`,
                                    }}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function Timeseries({ data }: { data: Analytics["timeseries"] }) {
    const max = Math.max(1, ...data.map((d) => d.views));
    return (
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <h3 className="mb-4 text-sm font-medium text-white/70">
                Views over time
            </h3>
            {data.length === 0 ? (
                <p className="text-sm text-white/30">No data yet.</p>
            ) : (
                <div className="flex h-40 items-end gap-0.5">
                    {data.map((d) => (
                        <div
                            key={d.date}
                            className="group relative flex-1"
                            style={{ minWidth: 2 }}
                        >
                            <div
                                className="w-full rounded-sm bg-white/30 transition-colors group-hover:bg-white/60"
                                style={{
                                    height: `${(d.views / max) * 160}px`,
                                }}
                            />
                            <span className="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                                {d.date}: {formatNumber(d.views)} views ·{" "}
                                {formatNumber(d.sessions)} sessions
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function AnalyticsClient() {
    const [key, setKey] = useState("");
    const [authed, setAuthed] = useState(false);
    const [days, setDays] = useState<number>(30);
    const [data, setData] = useState<Analytics | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const load = useCallback(
        async (adminKey: string, range: number) => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/analytics?days=${range}`, {
                    headers: { "x-admin-key": adminKey },
                });
                if (res.status === 401) {
                    setError("Incorrect password.");
                    setAuthed(false);
                    sessionStorage.removeItem(KEY_STORAGE);
                    return;
                }
                if (!res.ok) throw new Error(`Request failed: ${res.status}`);
                const json = (await res.json()) as Analytics;
                setData(json);
                setAuthed(true);
                sessionStorage.setItem(KEY_STORAGE, adminKey);
            } catch {
                setError("Failed to load analytics.");
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    useEffect(() => {
        const stored = sessionStorage.getItem(KEY_STORAGE);
        if (stored) {
            setKey(stored);
            load(stored, days);
        }
        // Only on mount.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (authed && key) load(key, days);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [days]);

    const lastUpdated = useMemo(
        () => (data ? new Date().toLocaleTimeString() : null),
        [data],
    );

    if (!authed) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#050506] px-6">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (key) load(key, days);
                    }}
                    className="w-full max-w-sm space-y-4"
                >
                    <h1 className="text-lg font-light text-white">Analytics</h1>
                    <input
                        type="password"
                        autoFocus
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        placeholder="Password"
                        className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none"
                    />
                    {error && <p className="text-sm text-red-400/80">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading || !key}
                        className="w-full rounded-lg bg-white/10 px-4 py-2.5 text-sm text-white transition-colors hover:bg-white/15 disabled:opacity-40"
                    >
                        {loading ? "Checking…" : "Enter"}
                    </button>
                </form>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#050506] px-6 py-16">
            <div className="mx-auto max-w-6xl space-y-8">
                <header className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-light text-white">
                            Analytics
                        </h1>
                        {lastUpdated && (
                            <p className="mt-1 text-xs text-white/40">
                                Last {days} days · updated {lastUpdated}
                            </p>
                        )}
                    </div>
                    <div className="flex gap-1 rounded-lg border border-white/5 bg-white/[0.02] p-1">
                        {RANGES.map((r) => (
                            <button
                                key={r}
                                onClick={() => setDays(r)}
                                className={cn(
                                    "rounded-md px-3 py-1.5 text-xs transition-colors",
                                    days === r
                                        ? "bg-white/10 text-white"
                                        : "text-white/50 hover:text-white/80",
                                )}
                            >
                                {r}d
                            </button>
                        ))}
                    </div>
                </header>

                {data && (
                    <>
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                            <StatCard
                                label="Total views"
                                value={data.totalViews}
                            />
                            <StatCard
                                label="Sessions"
                                value={data.uniqueSessions}
                            />
                            <StatCard
                                label="Unique visitors"
                                value={data.uniqueVisitors}
                            />
                            <StatCard
                                label="Avg views / session"
                                value={
                                    data.uniqueSessions
                                        ? Math.round(
                                              (data.totalViews /
                                                  data.uniqueSessions) *
                                                  10,
                                          ) / 10
                                        : 0
                                }
                            />
                        </div>

                        <Timeseries data={data.timeseries} />

                        <div className="grid gap-4 lg:grid-cols-2">
                            <BarList title="Top pages" buckets={data.topPaths} />
                            <BarList
                                title="Top referrers"
                                buckets={data.topReferrers}
                            />
                            <BarList
                                title="Countries"
                                buckets={data.countries}
                            />
                            <div className="grid gap-4">
                                <BarList
                                    title="Devices"
                                    buckets={data.devices}
                                />
                                <BarList
                                    title="Browsers"
                                    buckets={data.browsers}
                                />
                            </div>
                        </div>

                        <p className="text-center text-xs text-white/30">
                            {formatCompact(data.totalViews)} events tracked over{" "}
                            {data.rangeDays} days
                        </p>
                    </>
                )}
            </div>
        </main>
    );
}
