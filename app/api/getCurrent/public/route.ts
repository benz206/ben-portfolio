import { unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import getSpotifyAccessToken from "@/utils/functions/getSpotify";
import { getDominantColorFromImageUrl } from "@/utils/colorExtraction";
import type { SpotifyPlaybackState } from "@/types/externalApis";

export const runtime = "nodejs";

const REVALIDATE_SECONDS = 6;
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
    if (!text) return null;

    const current = JSON.parse(text) as SpotifyPlaybackState;
    if (!current.item) return null;

    const imageUrl = current.item.album.images[0]?.url as string | undefined;
    const dominantColor = await getDominantColorFromImageUrl(imageUrl);

    return {
        title: current.item.name,
        artist: current.item.artists[0].name,
        album: current.item.album.name,
        color: dominantColor,
        duration: String(Math.round(current.item.duration_ms / 1000)),
        progress: String(Math.round((current.progress_ms ?? 0) / 1000)),
        paused: String(!current.is_playing),
        volume: String(current.device?.volume_percent || 0),
        shuffle: current.shuffle_state,
        loop: current.repeat_state,
        albumArt: current.item.album.images[0]?.url,
    };
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
    } catch {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500, headers: NO_STORE_HEADERS },
        );
    }
}
