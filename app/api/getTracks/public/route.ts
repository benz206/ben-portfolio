import { unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import getSpotifyAccessToken from "@/utils/functions/getSpotify";
import { getDominantColorFromImageUrl } from "@/utils/colorExtraction";
import type { SoundtrackTrackMeta, SpotifyTrack } from "@/types/externalApis";

export const runtime = "nodejs";

const REVALIDATE_SECONDS = 60 * 60 * 24 * 7;
const CACHE_VERSION = "v2";
const MAX_IDS = 50;
const TRACK_ID = /^[A-Za-z0-9]{22}$/;
const PUBLIC_CACHE_HEADERS = {
    "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
};
const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

async function fetchTracks(ids: string[]): Promise<SoundtrackTrackMeta[]> {
    const accessToken = await getSpotifyAccessToken();
    const url = new URL("https://api.spotify.com/v1/tracks");
    url.searchParams.set("ids", ids.join(","));
    const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
    });
    if (!res.ok) {
        const errorMessage = await res.text().catch(() => "");
        throw new Error(
            `Spotify tracks failed: ${res.status} ${errorMessage}`.trim(),
        );
    }
    const data = (await res.json()) as {
        tracks: Array<(SpotifyTrack & { id: string }) | null>;
    };
    const base = data.tracks.flatMap((track) =>
        track
            ? [
                  {
                      id: track.id,
                      name: track.name,
                      artist: track.artists.map((a) => a.name).join(", "),
                      image:
                          track.album.images?.[1]?.url ??
                          track.album.images?.[0]?.url,
                      href: track.external_urls?.spotify,
                  },
              ]
            : [],
    );
    return Promise.all(
        base.map(async (track) => ({
            ...track,
            color: await getDominantColorFromImageUrl(track.image),
        })),
    );
}

export async function GET(req: NextRequest) {
    const ids = (req.nextUrl.searchParams.get("ids") ?? "")
        .split(",")
        .map((id) => id.trim())
        .filter((id) => TRACK_ID.test(id));

    if (ids.length === 0 || ids.length > MAX_IDS) {
        return NextResponse.json(
            { error: "Provide 1-50 Spotify track ids" },
            { status: 400, headers: NO_STORE_HEADERS },
        );
    }

    const key = [...new Set(ids)].sort().join(",");

    try {
        const payload = await unstable_cache(
            () => fetchTracks(key.split(",")),
            ["spotify-tracks", CACHE_VERSION, key],
            { revalidate: REVALIDATE_SECONDS },
        )();
        return NextResponse.json(payload, { headers: PUBLIC_CACHE_HEADERS });
    } catch {
        return NextResponse.json(
            { error: "Failed to fetch Spotify tracks" },
            { status: 500, headers: NO_STORE_HEADERS },
        );
    }
}
