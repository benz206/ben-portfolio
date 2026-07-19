import { unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import getSpotifyAccessToken from "@/utils/functions/getSpotify";
import { getDominantColorFromImageUrl } from "@/utils/colorExtraction";
import { getRedisClient } from "@/utils/redis";
import { secondsFromMs } from "@/utils/format";
import type { SpotifyPlaybackState } from "@/types/externalApis";

export const runtime = "nodejs";

const REVALIDATE_SECONDS = 5;
const LAST_PLAYED_KEY = "spotify:last-played";
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
    songUrl?: string;
};

async function readLastPlayed(): Promise<SpotifyTrackInfo | null> {
    try {
        const client = await getRedisClient();
        const value = await client.get(LAST_PLAYED_KEY);
        if (!value) return null;
        const stored = JSON.parse(value) as SpotifyTrackInfo;
        return {
            ...stored,
            progress: stored.duration,
            paused: "true",
        };
    } catch (error) {
        console.error("Failed to read last-played from Redis", error);
        return null;
    }
}

async function writeLastPlayed(track: SpotifyTrackInfo): Promise<void> {
    try {
        const client = await getRedisClient();
        await client.set(LAST_PLAYED_KEY, JSON.stringify(track));
    } catch (error) {
        console.error("Failed to write last-played to Redis", error);
    }
}

async function fetchCurrentTrack(): Promise<SpotifyTrackInfo | null> {
    const accessToken = await getSpotifyAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/me/player`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(
            `Spotify currently-playing request failed: ${response.status}`,
        );
    }

    const text = await response.text();
    if (!text) return await readLastPlayed();

    const current = JSON.parse(text) as SpotifyPlaybackState;
    if (!current.item) return await readLastPlayed();

    const imageUrl = current.item.album.images[0]?.url as string | undefined;
    const dominantColor = await getDominantColorFromImageUrl(imageUrl);

    const track: SpotifyTrackInfo = {
        title: current.item.name,
        artist: current.item.artists[0].name,
        album: current.item.album.name,
        color: dominantColor,
        duration: secondsFromMs(current.item.duration_ms),
        progress: secondsFromMs(current.progress_ms ?? 0),
        paused: String(!current.is_playing),
        volume: String(current.device?.volume_percent || 0),
        shuffle: current.shuffle_state,
        loop: current.repeat_state,
        albumArt: current.item.album.images[0]?.url,
        songUrl: current.item.external_urls?.spotify,
    };

    await writeLastPlayed(track);
    return track;
}

const getCachedTrack = unstable_cache(
    fetchCurrentTrack,
    ["spotify-currently-playing"],
    { revalidate: REVALIDATE_SECONDS },
);

export async function GET(_req: NextRequest) {
    try {
        const track = await getCachedTrack();
        if (!track) {
            return NextResponse.json(
                { error: "No track currently playing" },
                { status: 404, headers: NO_STORE_HEADERS },
            );
        }
        return NextResponse.json(track, { headers: PUBLIC_CACHE_HEADERS });
    } catch (error) {
        console.error("Failed to fetch currently playing track", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500, headers: NO_STORE_HEADERS },
        );
    }
}
