import getSpotifyAccessToken from "@/utils/functions/getSpotify";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getRedisClient } from "@/utils/redis";
import { getDominantColorFromImageUrl } from "@/utils/colorExtraction";

export const runtime = "nodejs";

const CACHE_WINDOW_MS = 6000;
const PUBLIC_CACHE_HEADERS = {
    "Cache-Control": "public, s-maxage=5, stale-while-revalidate=30",
};
const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

type SpotifyTrackInfo = {
    title: string;
    artist: string;
    album: string;
    color: [number, number, number];
    duration: string;
    progress: string;
    paused: string;
    volume: string;
    shuffle: boolean;
    loop: string;
    albumArt?: string;
};

export async function GET(_req: NextRequest) {
    try {
        const redis = await getRedisClient();
        const cacheKey = "spotify:currently-playing";
        const cachedRaw = await redis.get(cacheKey);
        let cachedEntry: { data: SpotifyTrackInfo; timestamp: number } | null = null;
        if (cachedRaw) {
            try {
                cachedEntry = JSON.parse(cachedRaw) as {
                    data: SpotifyTrackInfo;
                    timestamp: number;
                };
            } catch {
                cachedEntry = null;
            }
        }

        const now = Date.now();
        const shouldRefresh = !cachedEntry || now - cachedEntry.timestamp >= CACHE_WINDOW_MS;

        const respondWithCached = async (
            entry: { data: SpotifyTrackInfo; timestamp: number },
            forcePaused = false
        ) => {
            const payload = forcePaused
                ? { ...entry.data, paused: "true" }
                : entry.data;
            await redis.set(cacheKey, JSON.stringify({ data: payload, timestamp: now }));
            return NextResponse.json(payload, { headers: PUBLIC_CACHE_HEADERS });
        };

        if (!shouldRefresh && cachedEntry) {
            return NextResponse.json(cachedEntry.data, { headers: PUBLIC_CACHE_HEADERS });
        }

        const accessToken = await getSpotifyAccessToken();
        const response = await fetch(`https://api.spotify.com/v1/me/player`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) {
            if (cachedEntry) {
                return respondWithCached(cachedEntry, true);
            }
            const errorMessage = await response.text();
            return NextResponse.json(
                { error: errorMessage },
                { status: response.status, headers: NO_STORE_HEADERS }
            );
        }

        const current = await response.json();
        if (!current.item) {
            if (cachedEntry) {
                return respondWithCached(cachedEntry, true);
            }
            return NextResponse.json(
                { error: "No track currently playing" },
                { status: 404, headers: NO_STORE_HEADERS }
            );
        }

        const imageUrl = current.item.album.images[0]?.url as string | undefined;
        const dominantColor = await getDominantColorFromImageUrl(imageUrl);
        const trackInfo: SpotifyTrackInfo = {
            title: current.item.name,
            artist: current.item.artists[0].name,
            album: current.item.album.name,
            color: dominantColor,
            duration: String(Math.round(current.item.duration_ms / 1000)),
            progress: String(Math.round(current.progress_ms / 1000)),
            paused: String(!current.is_playing),
            volume: String(current.device?.volume_percent || 0),
            shuffle: current.shuffle_state,
            loop: current.repeat_state,
            albumArt: current.item.album.images[0]?.url,
        };

        await redis.set(cacheKey, JSON.stringify({ data: trackInfo, timestamp: now }));

        return NextResponse.json(trackInfo, { headers: PUBLIC_CACHE_HEADERS });
    } catch (error) {
        const redis = await getRedisClient().catch(() => null);
        if (redis) {
            const cachedRaw = await redis.get("spotify:currently-playing");
            if (cachedRaw) {
                try {
                    const cachedEntry = JSON.parse(cachedRaw) as {
                        data: SpotifyTrackInfo;
                        timestamp: number;
                    };
                    const payload = { ...cachedEntry.data, paused: "true" };
                    await redis.set(
                        "spotify:currently-playing",
                        JSON.stringify({ data: payload, timestamp: Date.now() })
                    );
                    return NextResponse.json(payload, { headers: PUBLIC_CACHE_HEADERS });
                } catch {}
            }
        }
        if (error instanceof SyntaxError) {
            return NextResponse.json(
                { error: "Not currently playing" },
                { status: 500, headers: NO_STORE_HEADERS }
            );
        }
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500, headers: NO_STORE_HEADERS }
        );
    }
}


