import getSpotifyAccessToken from "@/utils/functions/getSpotify";
import { NextRequest, NextResponse } from "next/server";
import { getRedisClient } from "@/utils/redis";
import { getDominantColorFromImageUrl } from "@/utils/colorExtraction";

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
                    color: await getDominantColorFromImageUrl(t.image),
                }))
            ),
            Promise.all(
                artistsBase.map(async (a: any) => ({
                    ...a,
                    color: await getDominantColorFromImageUrl(a.image),
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


