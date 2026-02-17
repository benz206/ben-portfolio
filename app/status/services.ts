export type ServiceStatus = {
    id: string;
    name: string;
    description: string;
    status: "loading" | "ok" | "degraded" | "down";
    latencyMs?: number;
    updatedAt?: number;
    metrics: Array<{ label: string; value: string }>;
    detail?: string;
};

export type ServiceCheckResult = {
    status: "ok" | "degraded" | "down";
    metrics: Array<{ label: string; value: string }>;
    detail?: string;
    updatedAt?: number;
};

export type ServiceDefinition = {
    id: string;
    name: string;
    description: string;
    check: () => Promise<ServiceCheckResult>;
};

export const serviceSplash: Record<
    string,
    {
        ambient: "slate" | "violet" | "blue" | "tangerine";
        glow: string;
    }
> = {
    blog: { ambient: "violet", glow: "bg-noir-radial-berry" },
    github: { ambient: "slate", glow: "bg-noir-radial" },
    "github-contrib": { ambient: "blue", glow: "bg-noir-radial-cool" },
    "spotify-now": { ambient: "tangerine", glow: "bg-noir-radial-spotify" },
    "spotify-top": { ambient: "tangerine", glow: "bg-noir-radial-spotify" },
    redis: { ambient: "slate", glow: "bg-noir-radial-warm" },
    cloudinary: { ambient: "blue", glow: "bg-noir-radial-cool" },
};

export const initialServices: ServiceStatus[] = [
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
];

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
    days: number,
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

export function buildServiceChecks(): ServiceDefinition[] {
    return [
        {
            id: "blog",
            name: "Blog Feed",
            description: "GitHub blog repo",
            check: async () => {
                const res = await fetch("/api/blog/public");
                if (!res.ok)
                    return {
                        status: "down",
                        metrics: [],
                        detail: "Blog feed request failed",
                    };
                const posts = (await res.json()) as Array<{ slug: string }>;
                return {
                    status: "ok",
                    metrics: [
                        { label: "Posts", value: formatNumber(posts.length) },
                    ],
                };
            },
        },
        {
            id: "github",
            name: "GitHub API",
            description: "Profile + repos",
            check: async () => {
                const res = await fetch("https://api.github.com/users/benz206");
                if (!res.ok)
                    return {
                        status: "down",
                        metrics: [],
                        detail: "GitHub API request failed",
                    };
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
                    "https://github-contributions-api.jogruber.de/v4/benz206",
                );
                if (!res.ok)
                    return {
                        status: "down",
                        metrics: [],
                        detail: "Contributions feed unavailable",
                    };
                const data = (await res.json()) as {
                    total?: Record<string, number>;
                    contributions?: Array<{ date?: string; count?: number }>;
                };
                const year = new Date().getFullYear().toString();
                const contributions = data.contributions ?? [];
                const recent = sumRecentContributions(contributions, 30);
                const yearTotal =
                    data.total?.[year] ??
                    contributions.reduce(
                        (sum, day) => sum + (day.count ?? 0),
                        0,
                    );
                return {
                    status: "ok",
                    metrics: [
                        { label: "30 days", value: formatNumber(recent) },
                        { label: "Year total", value: formatNumber(yearTotal) },
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
                if (res.status === 404)
                    return {
                        status: "ok",
                        metrics: [{ label: "State", value: "Idle" }],
                        detail: "No track",
                    };
                if (!res.ok)
                    return {
                        status: "down",
                        metrics: [],
                        detail: "Spotify playback unavailable",
                    };
                const data = (await res.json()) as {
                    title?: string;
                    artist?: string;
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
                        { label: "Track", value: data.title ?? "Unknown" },
                        { label: "Artist", value: data.artist ?? "Unknown" },
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
                if (!res.ok)
                    return {
                        status: "down",
                        metrics: [],
                        detail: "Spotify top items unavailable",
                    };
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
                if (!res.ok)
                    return {
                        status: "down",
                        metrics: [],
                        detail: "View counters unavailable",
                    };
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
                if (!res.ok)
                    return {
                        status: "down",
                        metrics: [],
                        detail: "Cloudinary search failed",
                    };
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
                        { label: "Latest", value: latest ?? "Unknown" },
                    ],
                };
            },
        },
    ];
}
