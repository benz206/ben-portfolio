import getSpotifyAccessToken from "@/utils/functions/getSpotify";
import { NextRequest, NextResponse } from "next/server";
import { getRedisClient } from "@/utils/redis";
import { getDominantColorFromImageUrl } from "@/utils/colorExtraction";
import type {
    SpotifyArtist,
    SpotifyPaging,
    SpotifyTimeRange,
    SpotifyTrack,
} from "@/types/externalApis";

export const runtime = "nodejs";

const CACHE_TTL_SECONDS = 60 * 60 * 24;
const PUBLIC_CACHE_HEADERS = {
    "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};
const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

type TopItem = {
    name: string;
    subtitle: string;
    image?: string;
    color: [number, number, number];
    href?: string;
    followers?: number;
};

const term: SpotifyTimeRange = "short_term";

type TopResponse = {
    timeRange: SpotifyTimeRange;
    tracks: TopItem[];
    artists: TopItem[];
    updatedAt: number;
};

async function fetchTop<T>(
    accessToken: string,
    type: "tracks" | "artists",
    limit: number,
): Promise<SpotifyPaging<T>> {
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
            `Spotify top ${type} failed: ${res.status} ${errorMessage}`.trim(),
        );
    }
    return (await res.json()) as SpotifyPaging<T>;
}

export async function GET(_req: NextRequest) {
    const cacheKey = `spotify:top:${term}:v2`;

    try {
        const redis = await getRedisClient();
        const cachedRaw = await redis.get(cacheKey);
        if (cachedRaw) {
            try {
                const cached = JSON.parse(cachedRaw) as TopResponse;
                return NextResponse.json(cached, {
                    headers: PUBLIC_CACHE_HEADERS,
                });
            } catch {}
        }

        const accessToken = await getSpotifyAccessToken();
        const [tracksRaw, artistsRaw] = await Promise.all([
            fetchTop<SpotifyTrack>(accessToken, "tracks", 5),
            fetchTop<SpotifyArtist>(accessToken, "artists", 5),
        ]);

        type TopItemBase = Omit<TopItem, "color">;

        const tracksBase: TopItemBase[] = tracksRaw.items
            .slice(0, 3)
            .map((t) => {
                const image = t.album.images?.[0]?.url;
                return {
                    name: t.name,
                    subtitle: t.artists.map((a) => a.name).join(", "),
                    image,
                    href: t.external_urls?.spotify,
                };
            });

        const artistsBase: TopItemBase[] = artistsRaw.items
            .slice(0, 3)
            .map((a) => {
                const image = a.images?.[0]?.url;
                return {
                    name: a.name,
                    subtitle: (a.genres ?? []).slice(0, 2).join(" • "),
                    image,
                    href: a.external_urls?.spotify,
                    followers: a.followers?.total ?? undefined,
                };
            });

        const [tracks, artists] = await Promise.all([
            Promise.all(
                tracksBase.map(async (t) => ({
                    ...t,
                    color: await getDominantColorFromImageUrl(t.image),
                })),
            ),
            Promise.all(
                artistsBase.map(async (a) => ({
                    ...a,
                    color: await getDominantColorFromImageUrl(a.image),
                })),
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

        return NextResponse.json(payload, { headers: PUBLIC_CACHE_HEADERS });
    } catch (error) {
        const redis = await getRedisClient().catch(() => null);
        if (redis) {
            const cachedRaw = await redis.get(cacheKey);
            if (cachedRaw) {
                try {
                    const cached = JSON.parse(cachedRaw) as TopResponse;
                    return NextResponse.json(cached, {
                        headers: PUBLIC_CACHE_HEADERS,
                    });
                } catch {}
            }
        }

        return NextResponse.json(
            { error: "Failed to fetch Spotify top items" },
            { status: 500, headers: NO_STORE_HEADERS },
        );
    }
}
