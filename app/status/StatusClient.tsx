"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Card from "@/components/Card";

type ServiceStatus = {
    id: string;
    name: string;
    description: string;
    status: "loading" | "ok" | "degraded" | "down";
    latencyMs?: number;
    updatedAt?: number;
    metrics: Array<{ label: string; value: string }>;
    detail?: string;
};

type ServiceCheckResult = {
    status: "ok" | "degraded" | "down";
    metrics: Array<{ label: string; value: string }>;
    detail?: string;
    updatedAt?: number;
};

type ServiceDefinition = {
    id: string;
    name: string;
    description: string;
    check: () => Promise<ServiceCheckResult>;
};

const serviceSplash: Record<
    string,
    {
        ambient: "slate" | "violet" | "blue" | "tangerine";
        glow: string;
        accent: string;
    }
> = {
    blog: {
        ambient: "violet",
        glow: "bg-noir-radial-berry",
        accent: "bg-gradient-to-br from-white/30 via-white/10 to-transparent",
    },
    github: {
        ambient: "slate",
        glow: "bg-noir-radial",
        accent: "bg-gradient-to-br from-white/25 via-white/10 to-transparent",
    },
    "github-contrib": {
        ambient: "blue",
        glow: "bg-noir-radial-cool",
        accent: "bg-gradient-to-br from-white/20 via-white/5 to-transparent",
    },
    "spotify-now": {
        ambient: "tangerine",
        glow: "bg-noir-radial-spotify",
        accent: "bg-gradient-to-br from-white/30 via-white/10 to-transparent",
    },
    "spotify-top": {
        ambient: "tangerine",
        glow: "bg-noir-radial-spotify",
        accent: "bg-gradient-to-br from-white/30 via-white/10 to-transparent",
    },
    redis: {
        ambient: "slate",
        glow: "bg-noir-radial-warm",
        accent: "bg-gradient-to-br from-white/20 via-white/10 to-transparent",
    },
    cloudinary: {
        ambient: "blue",
        glow: "bg-noir-radial-cool",
        accent: "bg-gradient-to-br from-white/25 via-white/10 to-transparent",
    },
};

const formatNumber = (value: number) =>
    Intl.NumberFormat(undefined, { notation: "compact" }).format(value);

const formatTime = (value?: number) => {
    if (!value) return null;
    return new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
};

const formatDate = (value?: string) => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.valueOf())) return null;
    return new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "2-digit",
    }).format(date);
};

const sumRecentContributions = (
    contributions: Array<{ date?: string; count?: number }>,
    days: number
) => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(start.getDate() - days);
    return contributions.reduce((sum, day) => {
        if (!day.date) return sum;
        const dayDate = new Date(day.date);
        if (dayDate >= start && dayDate <= now) {
            return sum + (day.count ?? 0);
        }
        return sum;
    }, 0);
};

function StatusBadge({ status }: { status: ServiceStatus["status"] }) {
    const label =
        status === "ok"
            ? "Operational"
            : status === "degraded"
            ? "Degraded"
            : status === "down"
            ? "Down"
            : "Checking";
    const color =
        status === "ok"
            ? "bg-emerald-500/20 text-emerald-200"
            : status === "degraded"
            ? "bg-amber-500/20 text-amber-200"
            : status === "down"
            ? "bg-rose-500/20 text-rose-200"
            : "bg-white/10 text-white/60";
    return (
        <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.25em] ${color}`}
        >
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-current" />
            {label}
        </span>
    );
}

export default function StatusClient() {
    const [services, setServices] = useState<ServiceStatus[]>([
        {
            id: "blog",
            name: "Blog Feed",
            description: "GitHub blog repo",
            status: "loading",
            metrics: [],
        },
        {
            id: "github",
            name: "GitHub API",
            description: "Profile + repos",
            status: "loading",
            metrics: [],
        },
        {
            id: "github-contrib",
            name: "GitHub Contributions",
            description: "Contributions feed",
            status: "loading",
            metrics: [],
        },
        {
            id: "spotify-now",
            name: "Spotify Now Playing",
            description: "Playback state",
            status: "loading",
            metrics: [],
        },
        {
            id: "spotify-top",
            name: "Spotify Top Items",
            description: "Top tracks + artists",
            status: "loading",
            metrics: [],
        },
        {
            id: "redis",
            name: "Redis",
            description: "Cache + views",
            status: "loading",
            metrics: [],
        },
        {
            id: "cloudinary",
            name: "Cloudinary",
            description: "Image storage",
            status: "loading",
            metrics: [],
        },
    ]);
    const [lastCheckedAt, setLastCheckedAt] = useState<number | null>(null);

    const serviceChecks = useMemo<ServiceDefinition[]>(
        () => [
            {
                id: "blog",
                name: "Blog Feed",
                description: "GitHub blog repo",
                check: async () => {
                    const res = await fetch("/api/blog/public");
                    if (!res.ok) {
                        return {
                            status: "down",
                            metrics: [],
                            detail: "Blog feed request failed",
                        };
                    }
                    const posts = (await res.json()) as Array<{
                        slug: string;
                    }>;
                    return {
                        status: "ok",
                        metrics: [
                            {
                                label: "Posts",
                                value: formatNumber(posts.length),
                            },
                        ],
                    };
                },
            },
            {
                id: "github",
                name: "GitHub API",
                description: "Profile + repos",
                check: async () => {
                    const res = await fetch(
                        "https://api.github.com/users/benz206"
                    );
                    if (!res.ok) {
                        return {
                            status: "down",
                            metrics: [],
                            detail: "GitHub API request failed",
                        };
                    }
                    const profile = (await res.json()) as {
                        public_repos?: number;
                        followers?: number;
                        following?: number;
                    };
                    return {
                        status: "ok",
                        metrics: [
                            {
                                label: "Repos",
                                value: formatNumber(profile.public_repos ?? 0),
                            },
                            {
                                label: "Followers",
                                value: formatNumber(profile.followers ?? 0),
                            },
                            {
                                label: "Following",
                                value: formatNumber(profile.following ?? 0),
                            },
                        ],
                    };
                },
            },
            {
                id: "github-contrib",
                name: "GitHub Contributions",
                description: "Contributions feed",
                check: async () => {
                    const res = await fetch(
                        "https://github-contributions-api.jogruber.de/v4/benz206"
                    );
                    if (!res.ok) {
                        return {
                            status: "down",
                            metrics: [],
                            detail: "Contributions feed unavailable",
                        };
                    }
                    const data = (await res.json()) as {
                        total?: Record<string, number>;
                        contributions?: Array<{
                            date?: string;
                            count?: number;
                        }>;
                    };
                    const year = new Date().getFullYear().toString();
                    const contributions = data.contributions ?? [];
                    const recent = sumRecentContributions(contributions, 30);
                    const yearTotal =
                        data.total?.[year] ??
                        contributions.reduce(
                            (sum, day) => sum + (day.count ?? 0),
                            0
                        );
                    return {
                        status: "ok",
                        metrics: [
                            {
                                label: "30 days",
                                value: formatNumber(recent),
                            },
                            {
                                label: "Year total",
                                value: formatNumber(yearTotal),
                            },
                        ],
                    };
                },
            },
            {
                id: "spotify-now",
                name: "Spotify Now Playing",
                description: "Playback state",
                check: async () => {
                    const res = await fetch("/api/getCurrent/public");
                    if (res.status === 404) {
                        return {
                            status: "ok",
                            metrics: [
                                {
                                    label: "State",
                                    value: "Idle",
                                },
                            ],
                            detail: "No track",
                        };
                    }
                    if (!res.ok) {
                        return {
                            status: "down",
                            metrics: [],
                            detail: "Spotify playback unavailable",
                        };
                    }
                    const data = (await res.json()) as {
                        title?: string;
                        artist?: string;
                        album?: string;
                        paused?: string;
                    };
                    const paused = data.paused === "true";
                    return {
                        status: paused ? "degraded" : "ok",
                        metrics: [
                            {
                                label: "State",
                                value: paused ? "Paused" : "Playing",
                            },
                            {
                                label: "Track",
                                value: data.title ?? "Unknown",
                            },
                            {
                                label: "Artist",
                                value: data.artist ?? "Unknown",
                            },
                        ],
                    };
                },
            },
            {
                id: "spotify-top",
                name: "Spotify Top Items",
                description: "Top tracks + artists",
                check: async () => {
                    const res = await fetch("/api/getTop/public");
                    if (!res.ok) {
                        return {
                            status: "down",
                            metrics: [],
                            detail: "Spotify top items unavailable",
                        };
                    }
                    const data = (await res.json()) as {
                        tracks?: Array<unknown>;
                        artists?: Array<unknown>;
                        updatedAt?: number;
                    };
                    return {
                        status: "ok",
                        metrics: [
                            {
                                label: "Top tracks",
                                value: formatNumber(data.tracks?.length ?? 0),
                            },
                            {
                                label: "Top artists",
                                value: formatNumber(data.artists?.length ?? 0),
                            },
                            {
                                label: "Updated",
                                value: formatTime(data.updatedAt) ?? "Unknown",
                            },
                        ],
                        updatedAt: data.updatedAt,
                    };
                },
            },
            {
                id: "redis",
                name: "Redis",
                description: "Cache + views",
                check: async () => {
                    const res = await fetch("/api/views");
                    if (!res.ok) {
                        return {
                            status: "down",
                            metrics: [],
                            detail: "View counters unavailable",
                        };
                    }
                    const data = (await res.json()) as {
                        count?: number;
                        daily?: number;
                    };
                    return {
                        status: "ok",
                        metrics: [
                            {
                                label: "All time",
                                value: formatNumber(data.count ?? 0),
                            },
                            {
                                label: "Today",
                                value: formatNumber(data.daily ?? 0),
                            },
                        ],
                    };
                },
            },
            {
                id: "cloudinary",
                name: "Cloudinary",
                description: "Image storage",
                check: async () => {
                    const res = await fetch("/api/status/cloudinary");
                    if (!res.ok) {
                        return {
                            status: "down",
                            metrics: [],
                            detail: "Cloudinary search failed",
                        };
                    }
                    const data = (await res.json()) as {
                        total?: number;
                        latestUploadedAt?: string;
                    };
                    const latest = formatDate(data.latestUploadedAt);
                    return {
                        status: "ok",
                        metrics: [
                            {
                                label: "Images",
                                value: formatNumber(data.total ?? 0),
                            },
                            {
                                label: "Latest",
                                value: latest ?? "Unknown",
                            },
                        ],
                    };
                },
            },
        ],
        []
    );

    useEffect(() => {
        let cancelled = false;
        const runChecks = async () => {
            const results = await Promise.all(
                serviceChecks.map(async (service) => {
                    const start = performance.now();
                    try {
                        const result = await service.check();
                        const latencyMs = Math.round(performance.now() - start);
                        return {
                            id: service.id,
                            name: service.name,
                            description: service.description,
                            status: result.status,
                            metrics: result.metrics,
                            detail: result.detail,
                            updatedAt: result.updatedAt,
                            latencyMs,
                        } as ServiceStatus;
                    } catch (error) {
                        return {
                            id: service.id,
                            name: service.name,
                            description: service.description,
                            status: "down",
                            metrics: [],
                            detail: "Check failed",
                            latencyMs: Math.round(performance.now() - start),
                        } as ServiceStatus;
                    }
                })
            );
            if (!cancelled) {
                setServices(results);
                setLastCheckedAt(Date.now());
            }
        };
        runChecks();
        const interval = window.setInterval(runChecks, 60_000);
        return () => {
            cancelled = true;
            window.clearInterval(interval);
        };
    }, [serviceChecks]);

    const summary = useMemo(() => {
        const total = services.length;
        const okCount = services.filter((s) => s.status === "ok").length;
        const degradedCount = services.filter(
            (s) => s.status === "degraded"
        ).length;
        const downCount = services.filter((s) => s.status === "down").length;
        return { total, okCount, degradedCount, downCount };
    }, [services]);
    const overallStatus: ServiceStatus["status"] =
        summary.downCount > 0
            ? "down"
            : summary.degradedCount > 0
            ? "degraded"
            : summary.okCount === summary.total && summary.total > 0
            ? "ok"
            : "loading";
    const lastCheckLabel = formatTime(lastCheckedAt ?? undefined);

    return (
        <section className="relative overflow-hidden text-white bg-[#050506]">
            <div className="absolute inset-0 bg-noir-gradient" />
            <div className="absolute inset-0 opacity-70 bg-noir-radial" />
            <div className="absolute -top-24 right-0 h-[380px] w-[380px] opacity-40 bg-noir-radial-berry" />
            <div className="absolute -bottom-28 left-0 h-[420px] w-[420px] opacity-35 bg-noir-radial-cool" />
            <div className="relative mx-auto flex w-11/12 max-w-[1180px] flex-col gap-14 pb-24 pt-20 lg:pb-32 lg:pt-28">
                <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                        <div className="space-y-3">
                            <span className="text-xs uppercase tracking-[0.4em] text-white/40">
                                Status overview
                            </span>
                            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                                Status
                            </h1>
                        </div>
                        <div className="space-y-2 text-sm text-white/60 sm:text-right">
                            <div>
                                {summary.okCount} operational •{" "}
                                {summary.degradedCount} degraded •{" "}
                                {summary.downCount} down
                            </div>
                            <div className="text-xs uppercase tracking-[0.3em] text-white/35">
                                {lastCheckLabel
                                    ? `Last check ${lastCheckLabel}`
                                    : "Auto refresh"}
                            </div>
                        </div>
                    </div>
                    <p className="max-w-2xl text-sm text-white/55">
                        Live checks for site dependencies. No links, just data.
                    </p>
                </motion.div>

                <motion.div
                    className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.6,
                        ease: "easeInOut",
                        delay: 0.08,
                    }}
                >
                    <Card
                        variant="glass"
                        ambient
                        ambientClassName="opacity-45"
                        className="flex relative flex-col gap-4 p-5 border border-white/10"
                    >
                        <div className="absolute -top-16 -right-16 w-44 h-44 opacity-60 blur-2xl pointer-events-none bg-noir-radial-berry" />
                        <div className="absolute left-6 -bottom-14 w-36 h-36 opacity-40 blur-2xl pointer-events-none bg-noir-radial" />
                        <div className="flex justify-between items-center">
                            <span className="text-xs uppercase tracking-[0.3em] text-white/50">
                                Overall
                            </span>
                            <StatusBadge status={overallStatus} />
                        </div>
                        <div className="text-2xl font-semibold">
                            {summary.okCount === summary.total &&
                            summary.total > 0
                                ? "All clear"
                                : summary.downCount > 0
                                ? "Issues"
                                : summary.degradedCount > 0
                                ? "Degraded"
                                : "Checking"}
                        </div>
                    </Card>
                    <Card
                        variant="glass"
                        ambient
                        ambientVariant="blue"
                        ambientClassName="opacity-40"
                        className="flex relative flex-col gap-4 p-5 border border-white/10"
                    >
                        <div className="absolute -top-16 -right-16 w-44 h-44 opacity-60 blur-2xl pointer-events-none bg-noir-radial-cool" />
                        <div className="absolute left-6 -bottom-14 w-36 h-36 opacity-40 blur-2xl pointer-events-none bg-noir-radial" />
                        <span className="text-xs uppercase tracking-[0.3em] text-white/50">
                            Services
                        </span>
                        <div className="text-3xl font-semibold">
                            {summary.total}
                        </div>
                        <div className="text-xs uppercase tracking-[0.25em] text-white/35">
                            Monitored
                        </div>
                    </Card>
                    <Card
                        variant="glass"
                        ambient
                        ambientVariant="tangerine"
                        ambientClassName="opacity-40"
                        className="flex relative flex-col gap-4 p-5 border border-white/10"
                    >
                        <div className="absolute -top-16 -right-16 w-44 h-44 opacity-60 blur-2xl pointer-events-none bg-noir-radial-spotify" />
                        <div className="absolute left-6 -bottom-14 w-36 h-36 opacity-40 blur-2xl pointer-events-none bg-noir-radial" />
                        <span className="text-xs uppercase tracking-[0.3em] text-white/50">
                            Operational
                        </span>
                        <div className="text-3xl font-semibold">
                            {summary.okCount}
                        </div>
                        <div className="text-xs uppercase tracking-[0.25em] text-white/35">
                            Operational
                        </div>
                    </Card>
                    <Card
                        variant="glass"
                        ambient
                        ambientVariant="slate"
                        ambientClassName="opacity-35"
                        className="flex relative flex-col gap-4 p-5 border border-white/10"
                    >
                        <div className="absolute -top-16 -right-16 w-44 h-44 opacity-60 blur-2xl pointer-events-none bg-noir-radial-warm" />
                        <div className="absolute left-6 -bottom-14 w-36 h-36 opacity-40 blur-2xl pointer-events-none bg-noir-radial" />
                        <span className="text-xs uppercase tracking-[0.3em] text-white/50">
                            Alerts
                        </span>
                        <div className="text-3xl font-semibold">
                            {summary.degradedCount + summary.downCount}
                        </div>
                        <div className="text-xs uppercase tracking-[0.25em] text-white/35">
                            Degraded/Down
                        </div>
                    </Card>
                </motion.div>

                <motion.div
                    className="grid gap-6 md:grid-cols-2"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.6,
                        ease: "easeInOut",
                        delay: 0.1,
                    }}
                >
                    {services.map((service) => (
                        <Card
                            key={service.id}
                            variant="glass"
                            ambient
                            ambientVariant={
                                serviceSplash[service.id]?.ambient ?? "slate"
                            }
                            ambientClassName="opacity-45"
                            className="relative flex flex-col gap-5 border border-white/10 p-6 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_18px_45px_-30px_rgba(255,255,255,0.55)]"
                        >
                            <div
                                className={`pointer-events-none absolute -right-24 -top-24 h-64 w-64 opacity-60 blur-2xl ${
                                    serviceSplash[service.id]?.glow ??
                                    "bg-noir-radial"
                                }`}
                            />
                            <div className="absolute left-8 -bottom-24 w-56 h-56 opacity-40 blur-2xl pointer-events-none bg-noir-radial" />
                            <div className="absolute inset-0 opacity-60 pointer-events-none">
                                <div className="absolute inset-0 bg-gradient-to-br via-transparent to-transparent from-white/5" />
                            </div>
                            <div className="flex gap-4 justify-between items-start">
                                <div className="space-y-1">
                                    <h2 className="text-lg font-semibold">
                                        {service.name}
                                    </h2>
                                    <p className="text-xs text-white/50">
                                        {service.description}
                                    </p>
                                </div>
                                <StatusBadge status={service.status} />
                            </div>
                            <div className="grid gap-3 text-sm text-white/70">
                                {service.metrics.length === 0 ? (
                                    <div className="space-y-3">
                                        <div className="w-24 h-3 rounded-full bg-white/10" />
                                        <div className="w-32 h-3 rounded-full bg-white/10" />
                                        <div className="w-20 h-3 rounded-full bg-white/10" />
                                    </div>
                                ) : (
                                    service.metrics.map((metric) => (
                                        <div
                                            key={`${service.id}-${metric.label}`}
                                            className="flex gap-4 justify-between items-center"
                                        >
                                            <span className="text-xs uppercase tracking-[0.25em] text-white/40">
                                                {metric.label}
                                            </span>
                                            <span className="text-sm text-white/80">
                                                {metric.value}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-white/35">
                                <span>
                                    {service.latencyMs
                                        ? `${service.latencyMs}ms`
                                        : "Checking"}
                                </span>
                                <span>
                                    {service.detail
                                        ? service.detail
                                        : "Last check"}
                                </span>
                            </div>
                        </Card>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
