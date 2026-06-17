"use client";

import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { formatCompact, formatDate, formatNumber } from "@/utils/format";
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

// Muted, cohesive palette for share segments. Soft blue leads to match the
// site's #339ccd theme colour.
const PALETTE = [
    "#8ab4f8",
    "#a78bfa",
    "#5eead4",
    "#f0abfc",
    "#fcd34d",
    "#94a3b8",
];

/* ------------------------------- helpers -------------------------------- */

function countryFlag(code: string): string {
    if (!/^[A-Za-z]{2}$/.test(code)) return "";
    return String.fromCodePoint(
        ...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65),
    );
}

function shortDate(iso: string): string {
    return (
        formatDate(iso, {
            month: "short",
            day: "numeric",
            timeZone: "UTC",
        }) ?? iso
    );
}

/** Measure an element's width, kept current across resizes. */
function useElementWidth<T extends HTMLElement>() {
    const ref = useRef<T>(null);
    const [width, setWidth] = useState(0);
    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;
        const update = () => setWidth(el.clientWidth);
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);
    return [ref, width] as const;
}

/* ------------------------------ primitives ------------------------------ */

function Card({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <div
            className={cn(
                "rounded-2xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-sm transition-colors duration-300 hover:border-white/[0.12]",
                className,
            )}
        >
            {children}
        </div>
    );
}

function StatCard({
    label,
    value,
    hint,
}: {
    label: string;
    value: string;
    hint?: string;
}) {
    return (
        <Card className="p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">
                {label}
            </p>
            <p className="mt-3 text-3xl font-light tabular-nums text-white sm:text-4xl">
                {value}
            </p>
            {hint && <p className="mt-1.5 text-xs text-white/30">{hint}</p>}
        </Card>
    );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <h3 className="text-[13px] font-medium tracking-wide text-white/70">
            {children}
        </h3>
    );
}

function EmptyHint() {
    return <p className="text-sm text-white/25">No data in this range.</p>;
}

/* -------------------------------- chart --------------------------------- */

type Pt = { x: number; y: number };

function smoothPath(pts: Pt[], minY: number, maxY: number): string {
    if (pts.length === 0) return "";
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
    const clamp = (v: number) => Math.max(minY, Math.min(maxY, v));
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] ?? pts[i];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[i + 2] ?? p2;
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = clamp(p1.y + (p2.y - p0.y) / 6);
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = clamp(p2.y - (p3.y - p1.y) / 6);
        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
}

function AreaChart({ data }: { data: Analytics["timeseries"] }) {
    const [ref, measured] = useElementWidth<HTMLDivElement>();
    const [hover, setHover] = useState<number | null>(null);

    const W = measured || 640;
    const H = 240;
    const padX = 10;
    const padT = 18;
    const padB = 26;
    const innerW = Math.max(1, W - padX * 2);
    const innerH = H - padT - padB;
    const baseline = padT + innerH;
    const max = Math.max(1, ...data.map((d) => d.views));

    const points = useMemo<Pt[]>(() => {
        const n = data.length;
        return data.map((d, i) => ({
            x: padX + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW),
            y: padT + innerH - (d.views / max) * innerH,
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, innerW, innerH, max, W]);

    const linePath = smoothPath(points, padT, baseline);
    const areaPath =
        points.length > 1
            ? `${linePath} L ${points[points.length - 1].x} ${baseline} L ${points[0].x} ${baseline} Z`
            : "";

    const onMove = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (data.length === 0) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const ratio = (x - padX) / innerW;
            const idx = Math.round(ratio * (data.length - 1));
            setHover(Math.max(0, Math.min(data.length - 1, idx)));
        },
        [data.length, innerW],
    );

    const active = hover != null ? points[hover] : null;
    const activeDatum = hover != null ? data[hover] : null;
    const tipLeft = active ? Math.max(8, Math.min(W - 8, active.x)) : 0;

    return (
        <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
                <SectionTitle>Views over time</SectionTitle>
                <span className="text-[11px] tabular-nums text-white/30">
                    peak {formatNumber(max)}
                </span>
            </div>
            {data.length === 0 ? (
                <div className="flex h-[200px] items-center justify-center">
                    <EmptyHint />
                </div>
            ) : (
                <div
                    ref={ref}
                    className="relative"
                    style={{ height: H }}
                    onMouseMove={onMove}
                    onMouseLeave={() => setHover(null)}
                >
                    <svg
                        width={W}
                        height={H}
                        className="overflow-visible"
                        aria-hidden
                    >
                        <defs>
                            <linearGradient
                                id="area-fill"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="#8ab4f8"
                                    stopOpacity="0.22"
                                />
                                <stop
                                    offset="100%"
                                    stopColor="#8ab4f8"
                                    stopOpacity="0"
                                />
                            </linearGradient>
                        </defs>

                        {/* horizontal guides */}
                        {[0, 0.5, 1].map((t) => (
                            <line
                                key={t}
                                x1={padX}
                                x2={W - padX}
                                y1={padT + innerH * t}
                                y2={padT + innerH * t}
                                stroke="rgba(255,255,255,0.06)"
                                strokeWidth={1}
                            />
                        ))}

                        {areaPath && <path d={areaPath} fill="url(#area-fill)" />}
                        <path
                            d={linePath}
                            fill="none"
                            stroke="#8ab4f8"
                            strokeWidth={1.75}
                            strokeLinejoin="round"
                            strokeLinecap="round"
                        />

                        {active && (
                            <>
                                <line
                                    x1={active.x}
                                    x2={active.x}
                                    y1={padT}
                                    y2={baseline}
                                    stroke="rgba(255,255,255,0.18)"
                                    strokeWidth={1}
                                />
                                <circle
                                    cx={active.x}
                                    cy={active.y}
                                    r={4}
                                    fill="#0a0a0c"
                                    stroke="#8ab4f8"
                                    strokeWidth={1.75}
                                />
                            </>
                        )}
                    </svg>

                    {/* x-axis endpoints */}
                    <div className="pointer-events-none absolute inset-x-2 bottom-0 flex justify-between text-[10px] tabular-nums text-white/30">
                        <span>{shortDate(data[0].date)}</span>
                        <span>{shortDate(data[data.length - 1].date)}</span>
                    </div>

                    {activeDatum && (
                        <div
                            className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-black/80 px-3 py-2 text-xs shadow-xl backdrop-blur"
                            style={{ left: tipLeft }}
                        >
                            <p className="font-medium text-white/90">
                                {shortDate(activeDatum.date)}
                            </p>
                            <p className="mt-0.5 tabular-nums text-white/55">
                                {formatNumber(activeDatum.views)} views ·{" "}
                                {formatNumber(activeDatum.sessions)} sessions
                            </p>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
}

/* ------------------------------- bar list ------------------------------- */

function BarList({
    title,
    buckets,
    flag,
}: {
    title: string;
    buckets: Bucket[];
    flag?: boolean;
}) {
    const total = buckets.reduce((sum, b) => sum + b.count, 0);
    const max = Math.max(1, ...buckets.map((b) => b.count));
    return (
        <Card className="flex flex-col p-5">
            <SectionTitle>{title}</SectionTitle>
            {buckets.length === 0 ? (
                <div className="mt-4">
                    <EmptyHint />
                </div>
            ) : (
                <ul className="mt-4 space-y-3">
                    {buckets.map((b, i) => {
                        const share = total ? (b.count / total) * 100 : 0;
                        return (
                            <li key={`${b.label}-${i}`} className="group">
                                <div className="mb-1.5 flex items-baseline gap-2 text-sm">
                                    <span className="w-4 shrink-0 text-right text-[11px] tabular-nums text-white/25">
                                        {i + 1}
                                    </span>
                                    {flag && (
                                        <span className="text-sm leading-none">
                                            {countryFlag(b.label) || "🌐"}
                                        </span>
                                    )}
                                    <span className="truncate text-white/75">
                                        {b.label}
                                    </span>
                                    <span className="ml-auto shrink-0 tabular-nums text-white/45">
                                        {formatNumber(b.count)}
                                    </span>
                                    <span className="w-10 shrink-0 text-right text-[11px] tabular-nums text-white/30">
                                        {share.toFixed(0)}%
                                    </span>
                                </div>
                                <div className="ml-6 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                                    <div
                                        className="h-full rounded-full bg-white/25 transition-all duration-500 group-hover:bg-white/40"
                                        style={{
                                            width: `${(b.count / max) * 100}%`,
                                        }}
                                    />
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </Card>
    );
}

/* ------------------------------ share bar ------------------------------- */

function ShareBar({ title, buckets }: { title: string; buckets: Bucket[] }) {
    const total = buckets.reduce((sum, b) => sum + b.count, 0);
    return (
        <Card className="p-5">
            <SectionTitle>{title}</SectionTitle>
            {total === 0 ? (
                <div className="mt-4">
                    <EmptyHint />
                </div>
            ) : (
                <>
                    <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-white/[0.06]">
                        {buckets.map((b, i) => (
                            <div
                                key={b.label}
                                style={{
                                    width: `${(b.count / total) * 100}%`,
                                    backgroundColor:
                                        PALETTE[i % PALETTE.length],
                                }}
                            />
                        ))}
                    </div>
                    <ul className="mt-4 space-y-2">
                        {buckets.map((b, i) => (
                            <li
                                key={b.label}
                                className="flex items-center gap-2 text-sm"
                            >
                                <span
                                    className="h-2 w-2 shrink-0 rounded-full"
                                    style={{
                                        backgroundColor:
                                            PALETTE[i % PALETTE.length],
                                    }}
                                />
                                <span className="capitalize text-white/70">
                                    {b.label}
                                </span>
                                <span className="ml-auto tabular-nums text-white/40">
                                    {((b.count / total) * 100).toFixed(0)}%
                                </span>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </Card>
    );
}

/* ------------------------------ skeletons ------------------------------- */

function Skeleton() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-[104px] animate-pulse rounded-2xl border border-white/[0.07] bg-white/[0.02]"
                    />
                ))}
            </div>
            <div className="h-[290px] animate-pulse rounded-2xl border border-white/[0.07] bg-white/[0.02]" />
            <div className="grid gap-4 lg:grid-cols-2">
                {Array.from({ length: 2 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-[280px] animate-pulse rounded-2xl border border-white/[0.07] bg-white/[0.02]"
                    />
                ))}
            </div>
        </div>
    );
}

/* ------------------------------ background ------------------------------ */

function Glow() {
    return (
        <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[460px] overflow-hidden"
        >
            <div className="absolute left-1/2 top-[-220px] h-[460px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.16),transparent_62%)] blur-2xl" />
            <div className="absolute left-[18%] top-[-160px] h-[320px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(94,216,255,0.10),transparent_60%)] blur-2xl" />
        </div>
    );
}

/* -------------------------------- screen -------------------------------- */

export default function AnalyticsClient() {
    const [key, setKey] = useState("");
    const [authed, setAuthed] = useState(false);
    const [days, setDays] = useState<number>(30);
    const [data, setData] = useState<Analytics | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [updatedAt, setUpdatedAt] = useState<string | null>(null);

    const load = useCallback(async (adminKey: string, range: number) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/analytics?days=${range}`, {
                headers: { "x-admin-key": adminKey },
            });
            if (res.status === 401) {
                setError("Incorrect password.");
                setAuthed(false);
                setData(null);
                sessionStorage.removeItem(KEY_STORAGE);
                return;
            }
            if (!res.ok) throw new Error(`Request failed: ${res.status}`);
            const json = (await res.json()) as Analytics;
            setData(json);
            setAuthed(true);
            setUpdatedAt(new Date().toLocaleTimeString());
            sessionStorage.setItem(KEY_STORAGE, adminKey);
        } catch {
            setError("Failed to load analytics.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const stored = sessionStorage.getItem(KEY_STORAGE);
        if (stored) {
            setKey(stored);
            load(stored, days);
        }
        // Mount only.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (authed && key) load(key, days);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [days]);

    const lock = useCallback(() => {
        sessionStorage.removeItem(KEY_STORAGE);
        setAuthed(false);
        setData(null);
        setKey("");
        setError(null);
    }, []);

    const avgPerSession = useMemo(() => {
        if (!data?.uniqueSessions) return "0";
        return (
            Math.round((data.totalViews / data.uniqueSessions) * 10) / 10
        ).toString();
    }, [data]);

    if (!authed) {
        return (
            <main className="relative flex min-h-screen items-center justify-center px-6">
                <Glow />
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (key) load(key, days);
                    }}
                    className="relative z-10 w-full max-w-sm"
                >
                    <Card className="p-7">
                        <div className="mb-6 flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/60">
                                <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect
                                        x="3"
                                        y="11"
                                        width="18"
                                        height="11"
                                        rx="2"
                                    />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                            </span>
                            <div>
                                <h1 className="text-base font-medium text-white">
                                    Analytics
                                </h1>
                                <p className="text-xs text-white/40">
                                    Enter password to continue
                                </p>
                            </div>
                        </div>
                        <input
                            type="password"
                            autoFocus
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            placeholder="Password"
                            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-white/30"
                        />
                        {error && (
                            <p className="mt-3 text-sm text-red-400/80">
                                {error}
                            </p>
                        )}
                        <button
                            type="submit"
                            disabled={loading || !key}
                            className="mt-4 w-full rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/[0.16] disabled:opacity-40"
                        >
                            {loading ? "Checking…" : "Enter"}
                        </button>
                    </Card>
                </form>
            </main>
        );
    }

    return (
        <main className="relative min-h-screen px-5 py-14 sm:px-6 sm:py-16">
            <Glow />
            <div className="relative z-10 mx-auto max-w-6xl space-y-6">
                <header className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-light tracking-tight text-white">
                            Analytics
                        </h1>
                        <p className="mt-1 text-xs text-white/40">
                            Last {days} days
                            {updatedAt && (
                                <span className="text-white/25">
                                    {" "}
                                    · updated {updatedAt}
                                </span>
                            )}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex gap-0.5 rounded-xl border border-white/[0.07] bg-white/[0.02] p-1">
                            {RANGES.map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setDays(r)}
                                    className={cn(
                                        "rounded-lg px-3 py-1.5 text-xs font-medium tabular-nums transition-colors",
                                        days === r
                                            ? "bg-white/10 text-white"
                                            : "text-white/45 hover:text-white/80",
                                    )}
                                >
                                    {r}d
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => key && load(key, days)}
                            disabled={loading}
                            title="Refresh"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.02] text-white/50 transition-colors hover:text-white/90 disabled:opacity-40"
                        >
                            <svg
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={cn(loading && "animate-spin")}
                            >
                                <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                                <path d="M21 3v6h-6" />
                            </svg>
                        </button>
                        <button
                            onClick={lock}
                            title="Lock"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.02] text-white/50 transition-colors hover:text-white/90"
                        >
                            <svg
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect
                                    x="3"
                                    y="11"
                                    width="18"
                                    height="11"
                                    rx="2"
                                />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </button>
                    </div>
                </header>

                {!data && loading ? (
                    <Skeleton />
                ) : data ? (
                    <>
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                            <StatCard
                                label="Total views"
                                value={formatNumber(data.totalViews)}
                            />
                            <StatCard
                                label="Sessions"
                                value={formatNumber(data.uniqueSessions)}
                            />
                            <StatCard
                                label="Unique visitors"
                                value={formatNumber(data.uniqueVisitors)}
                                hint="estimated by IP"
                            />
                            <StatCard
                                label="Views / session"
                                value={avgPerSession}
                            />
                        </div>

                        <AreaChart data={data.timeseries} />

                        <div className="grid gap-4 lg:grid-cols-2">
                            <BarList title="Top pages" buckets={data.topPaths} />
                            <BarList
                                title="Top referrers"
                                buckets={data.topReferrers}
                            />
                        </div>

                        <div className="grid gap-4 lg:grid-cols-2">
                            <BarList
                                title="Countries"
                                buckets={data.countries}
                                flag
                            />
                            <div className="grid gap-4 sm:grid-cols-2">
                                <ShareBar
                                    title="Devices"
                                    buckets={data.devices}
                                />
                                <ShareBar
                                    title="Browsers"
                                    buckets={data.browsers}
                                />
                            </div>
                        </div>

                        <p className="pt-2 text-center text-xs text-white/25">
                            {formatCompact(data.totalViews)} events over{" "}
                            {data.rangeDays} days
                        </p>
                    </>
                ) : null}
            </div>
        </main>
    );
}
