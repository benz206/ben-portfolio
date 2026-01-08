import getSpotifyAccessToken from "@/utils/functions/getSpotify";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { getRedisClient } from "@/utils/redis";

export const runtime = "nodejs";

const CACHE_TTL_SECONDS = 60 * 60 * 24;

type TopItem = {
    name: string;
    subtitle: string;
    image?: string;
    color: [number, number, number];
    href?: string;
    followers?: number;
};

type Term = "short_term" | "medium_term" | "long_term";

const term: Term = "short_term";

type TopResponse = {
    timeRange: Term;
    tracks: TopItem[];
    artists: TopItem[];
    updatedAt: number;
};

async function fetchDominantColorFromImageUrl(
    imageUrl?: string
): Promise<[number, number, number]> {
    let dominantColor: [number, number, number] = [29, 185, 84];
    if (!imageUrl) return dominantColor;

    try {
        const imgRes = await fetch(imageUrl);
        if (!imgRes.ok) return dominantColor;
        const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
        const { data, info } = await sharp(imgBuffer)
            .resize(72, 72, { fit: "inside", withoutEnlargement: true })
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });
        if (!data || !info?.width || !info?.height || info.channels < 3) {
            return dominantColor;
        }

        const buckets = new Map<
            number,
            { w: number; r: number; g: number; b: number; count: number }
        >();
        const sampleStride = 12;
        const step = info.channels * sampleStride;
        for (let i = 0; i < data.length; i += step) {
            const r = data[i] ?? 0;
            const g = data[i + 1] ?? 0;
            const b = data[i + 2] ?? 0;

            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            if (max < 30) continue;

            const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            if (luma < 18 || luma > 238) continue;

            const sat = max === 0 ? 0 : (max - min) / max;
            const v = max / 255;
            const w = Math.pow(sat, 0.85) * Math.pow(v, 1.05);
            if (w <= 0) continue;

            const key = ((r >> 5) << 6) | ((g >> 5) << 3) | (b >> 5);
            const entry = buckets.get(key);
            if (entry) {
                entry.w += w;
                entry.r += r * w;
                entry.g += g * w;
                entry.b += b * w;
                entry.count += 1;
            } else {
                buckets.set(key, { w, r: r * w, g: g * w, b: b * w, count: 1 });
            }
        }

        let bestKey: number | null = null;
        let bestScore = -1;
        buckets.forEach((v, k) => {
            const score = v.w * Math.log2(v.count + 1);
            if (score > bestScore) {
                bestScore = score;
                bestKey = k;
            }
        });

        if (bestKey !== null) {
            const v = buckets.get(bestKey);
            if (v && v.w > 0) {
                dominantColor = [
                    Math.round(v.r / v.w),
                    Math.round(v.g / v.w),
                    Math.round(v.b / v.w),
                ];
            }
        }
    } catch {}

    return dominantColor;
}

async function fetchTop(
    accessToken: string,
    type: "tracks" | "artists",
    limit: number
) {
    const url = new URL(`https://api.spotify.com/v1/me/top/${type}`);
    url.searchParams.set("time_range", term);
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("offset", "0");
    const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) {
        const errorMessage = await res.text().catch(() => "");
        throw new Error(
            `Spotify top ${type} failed: ${res.status} ${errorMessage}`.trim()
        );
    }
    return (await res.json()) as any;
}

export async function GET(_req: NextRequest) {
    const cacheKey = `spotify:top:${term}:v2`;

    try {
        const redis = await getRedisClient();
        const cachedRaw = await redis.get(cacheKey);
        if (cachedRaw) {
            try {
                const cached = JSON.parse(cachedRaw) as TopResponse;
                return NextResponse.json(cached);
            } catch {}
        }

        const accessToken = await getSpotifyAccessToken();
        const [tracksRaw, artistsRaw] = await Promise.all([
            fetchTop(accessToken, "tracks", 5),
            fetchTop(accessToken, "artists", 5),
        ]);

        const tracksBase = (tracksRaw.items ?? []).slice(0, 3).map((t: any) => {
            const image = t?.album?.images?.[0]?.url as string | undefined;
            return {
                name: t?.name as string,
                subtitle: (t?.artists ?? [])
                    .map((a: any) => a?.name)
                    .filter(Boolean)
                    .join(", "),
                image,
                href: t?.external_urls?.spotify as string | undefined,
            };
        });

        const artistsBase = (artistsRaw.items ?? [])
            .slice(0, 3)
            .map((a: any) => {
                const image = a?.images?.[0]?.url as string | undefined;
                return {
                    name: a?.name as string,
                    subtitle: ((a?.genres ?? []) as string[]).slice(0, 2).join(" • "),
                    image,
                    href: a?.external_urls?.spotify as string | undefined,
                    followers: (a?.followers?.total as number | undefined) ?? undefined,
                };
            });

        const [tracks, artists] = await Promise.all([
            Promise.all(
                tracksBase.map(async (t: any) => ({
                    ...t,
                    color: await fetchDominantColorFromImageUrl(t.image),
                }))
            ),
            Promise.all(
                artistsBase.map(async (a: any) => ({
                    ...a,
                    color: await fetchDominantColorFromImageUrl(a.image),
                }))
            ),
        ]);

        const payload: TopResponse = {
            timeRange: term,
            tracks,
            artists,
            updatedAt: Date.now(),
        };

        await redis.set(cacheKey, JSON.stringify(payload), {
            EX: CACHE_TTL_SECONDS,
        });

        return NextResponse.json(payload);
    } catch (error) {
        const redis = await getRedisClient().catch(() => null);
        if (redis) {
            const cachedRaw = await redis.get(cacheKey);
            if (cachedRaw) {
                try {
                    const cached = JSON.parse(cachedRaw) as TopResponse;
                    return NextResponse.json(cached);
                } catch {}
            }
        }

        return NextResponse.json(
            { error: "Failed to fetch Spotify top items" },
            { status: 500 }
        );
    }
}


