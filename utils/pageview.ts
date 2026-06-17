import { createHash } from "crypto";
import { getDb } from "@/utils/mongo";
import type { Collection } from "mongodb";

const COLLECTION = "pageviews";

export type DeviceType = "mobile" | "tablet" | "desktop";

export type Geo = {
    country: string | null;
    region: string | null;
    city: string | null;
    timezone: string | null;
};

export type Utm = {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
};

export type PageView = {
    path: string;
    referrer: string | null;
    referrerHost: string | null;
    session: string;
    isNewSession: boolean;
    ts: Date;
    utm: Utm | null;
    geo: Geo;
    device: DeviceType;
    browser: string;
    os: string;
    ua: string;
    ipHash: string;
    viewport: { w: number; h: number } | null;
};

/** Payload the client sends to /api/track. */
export type TrackPayload = {
    path: string;
    referrer?: string | null;
    session: string;
    isNewSession?: boolean;
    viewport?: { w: number; h: number } | null;
};

const SESSION_PATTERN = /^[a-zA-Z0-9-]{1,64}$/;
const MAX_PATH = 512;

let indexesEnsured = false;

async function getCollection(): Promise<Collection<PageView>> {
    const db = await getDb();
    const collection = db.collection<PageView>(COLLECTION);
    if (!indexesEnsured) {
        indexesEnsured = true;
        // Fire-and-forget; index creation is idempotent.
        await collection
            .createIndexes([
                { key: { ts: -1 }, name: "ts_desc" },
                { key: { path: 1, ts: -1 }, name: "path_ts" },
                { key: { session: 1, ts: -1 }, name: "session_ts" },
                { key: { "geo.country": 1 }, name: "geo_country" },
            ])
            .catch((error) => {
                indexesEnsured = false;
                console.error("Failed to ensure pageview indexes", error);
            });
    }
    return collection;
}

function hashIp(ip: string): string {
    const salt = process.env.MONGO_PASS ?? "portfolio";
    return createHash("sha256")
        .update(`${ip}:${salt}`)
        .digest("hex")
        .slice(0, 32);
}

export function parseDevice(ua: string): DeviceType {
    if (/iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(ua))
        return "tablet";
    if (/Mobi|Android|iPhone|iPod|Windows Phone|IEMobile|BlackBerry/i.test(ua))
        return "mobile";
    return "desktop";
}

export function parseBrowser(ua: string): string {
    if (/Edg\//i.test(ua)) return "Edge";
    if (/OPR\/|Opera/i.test(ua)) return "Opera";
    if (/Firefox\//i.test(ua)) return "Firefox";
    if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) return "Chrome";
    if (/Safari\//i.test(ua) && /Version\//i.test(ua)) return "Safari";
    if (/Chromium/i.test(ua)) return "Chromium";
    return "Other";
}

export function parseOs(ua: string): string {
    if (/Windows NT/i.test(ua)) return "Windows";
    if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
    if (/Mac OS X/i.test(ua)) return "macOS";
    if (/Android/i.test(ua)) return "Android";
    if (/Linux/i.test(ua)) return "Linux";
    return "Other";
}

function parseReferrerHost(referrer: string | null): string | null {
    if (!referrer) return null;
    try {
        return new URL(referrer).hostname || null;
    } catch {
        return null;
    }
}

function parseUtm(path: string): Utm | null {
    const query = path.includes("?") ? path.slice(path.indexOf("?")) : "";
    if (!query) return null;
    const params = new URLSearchParams(query);
    const utm: Utm = {};
    const source = params.get("utm_source");
    const medium = params.get("utm_medium");
    const campaign = params.get("utm_campaign");
    const term = params.get("utm_term");
    const content = params.get("utm_content");
    if (source) utm.source = source;
    if (medium) utm.medium = medium;
    if (campaign) utm.campaign = campaign;
    if (term) utm.term = term;
    if (content) utm.content = content;
    return Object.keys(utm).length ? utm : null;
}

function extractGeo(headers: Headers): Geo {
    const get = (key: string) => {
        const value = headers.get(key);
        return value ? decodeURIComponent(value) : null;
    };
    return {
        country: get("x-vercel-ip-country"),
        region: get("x-vercel-ip-country-region"),
        city: get("x-vercel-ip-city"),
        timezone: get("x-vercel-ip-timezone"),
    };
}

function clientIp(headers: Headers): string {
    return (
        headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        headers.get("x-real-ip") ||
        "unknown"
    );
}

/**
 * Builds a privacy-safe PageView from a client payload + request headers,
 * or returns null if the payload is malformed. Raw IP is never stored —
 * only a salted hash for unique-visitor estimation.
 */
export function buildPageView(
    payload: TrackPayload,
    headers: Headers,
): PageView | null {
    if (
        !payload ||
        typeof payload.path !== "string" ||
        typeof payload.session !== "string" ||
        !SESSION_PATTERN.test(payload.session)
    ) {
        return null;
    }

    const path = payload.path.slice(0, MAX_PATH);
    if (!path.startsWith("/")) return null;

    const ua = (headers.get("user-agent") ?? "").slice(0, 512);
    const referrer = payload.referrer ? payload.referrer.slice(0, 512) : null;

    let viewport: PageView["viewport"] = null;
    if (
        payload.viewport &&
        Number.isFinite(payload.viewport.w) &&
        Number.isFinite(payload.viewport.h)
    ) {
        viewport = {
            w: Math.round(payload.viewport.w),
            h: Math.round(payload.viewport.h),
        };
    }

    return {
        path,
        referrer,
        referrerHost: parseReferrerHost(referrer),
        session: payload.session,
        isNewSession: payload.isNewSession === true,
        ts: new Date(),
        utm: parseUtm(path),
        geo: extractGeo(headers),
        device: parseDevice(ua),
        browser: parseBrowser(ua),
        os: parseOs(ua),
        ua,
        ipHash: hashIp(clientIp(headers)),
        viewport,
    };
}

export async function recordPageView(view: PageView): Promise<void> {
    const collection = await getCollection();
    await collection.insertOne(view);
}

export type AnalyticsBucket = { label: string; count: number };

export type Analytics = {
    rangeDays: number;
    totalViews: number;
    uniqueSessions: number;
    uniqueVisitors: number;
    timeseries: { date: string; views: number; sessions: number }[];
    topPaths: AnalyticsBucket[];
    topReferrers: AnalyticsBucket[];
    countries: AnalyticsBucket[];
    devices: AnalyticsBucket[];
    browsers: AnalyticsBucket[];
};

function toBuckets(
    rows: { _id: string | null; count: number }[],
): AnalyticsBucket[] {
    return rows.map((row) => ({
        label: row._id ?? "Unknown",
        count: row.count,
    }));
}

/**
 * Aggregates pageview events for the trailing `days` window into the shape
 * the admin dashboard renders. Runs all facets in a single pipeline.
 */
export async function getAnalytics(days: number): Promise<Analytics> {
    const collection = await getCollection();
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [result] = await collection
        .aggregate<{
            totals: { count: number; sessions: string[]; visitors: string[] }[];
            timeseries: {
                _id: string;
                views: number;
                sessions: string[];
            }[];
            topPaths: { _id: string | null; count: number }[];
            topReferrers: { _id: string | null; count: number }[];
            countries: { _id: string | null; count: number }[];
            devices: { _id: string | null; count: number }[];
            browsers: { _id: string | null; count: number }[];
        }>([
            { $match: { ts: { $gte: since } } },
            {
                $facet: {
                    totals: [
                        {
                            $group: {
                                _id: null,
                                count: { $sum: 1 },
                                sessions: { $addToSet: "$session" },
                                visitors: { $addToSet: "$ipHash" },
                            },
                        },
                    ],
                    timeseries: [
                        {
                            $group: {
                                _id: {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: "$ts",
                                    },
                                },
                                views: { $sum: 1 },
                                sessions: { $addToSet: "$session" },
                            },
                        },
                        { $sort: { _id: 1 } },
                    ],
                    topPaths: [
                        { $group: { _id: "$path", count: { $sum: 1 } } },
                        { $sort: { count: -1 } },
                        { $limit: 15 },
                    ],
                    topReferrers: [
                        { $match: { referrerHost: { $ne: null } } },
                        {
                            $group: {
                                _id: "$referrerHost",
                                count: { $sum: 1 },
                            },
                        },
                        { $sort: { count: -1 } },
                        { $limit: 10 },
                    ],
                    countries: [
                        { $group: { _id: "$geo.country", count: { $sum: 1 } } },
                        { $sort: { count: -1 } },
                        { $limit: 10 },
                    ],
                    devices: [
                        { $group: { _id: "$device", count: { $sum: 1 } } },
                        { $sort: { count: -1 } },
                    ],
                    browsers: [
                        { $group: { _id: "$browser", count: { $sum: 1 } } },
                        { $sort: { count: -1 } },
                    ],
                },
            },
        ])
        .toArray();

    const totals = result?.totals?.[0];

    return {
        rangeDays: days,
        totalViews: totals?.count ?? 0,
        uniqueSessions: totals?.sessions?.length ?? 0,
        uniqueVisitors: totals?.visitors?.length ?? 0,
        timeseries: (result?.timeseries ?? []).map((row) => ({
            date: row._id,
            views: row.views,
            sessions: row.sessions.length,
        })),
        topPaths: toBuckets(result?.topPaths ?? []),
        topReferrers: toBuckets(result?.topReferrers ?? []),
        countries: toBuckets(result?.countries ?? []),
        devices: toBuckets(result?.devices ?? []),
        browsers: toBuckets(result?.browsers ?? []),
    };
}
