import getSpotifyAccessToken from "@/utils/functions/getSpotify";
import { NextRequest, NextResponse } from "next/server";
import type { SpotifyPlaybackState } from "@/types/externalApis";

type ESPInfo = {
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
};

const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ password: string }> },
) {
    const { password } = await context.params;
    if (password !== process.env.PASSWORD) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401, headers: NO_STORE_HEADERS },
        );
    }

    try {
        const accessToken = await getSpotifyAccessToken();
        const response = await fetch(`https://api.spotify.com/v1/me/player`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            cache: "no-store",
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            return NextResponse.json(
                { error: errorMessage },
                { status: response.status, headers: NO_STORE_HEADERS },
            );
        }

        const current = (await response.json()) as SpotifyPlaybackState;
        if (!current.item) {
            return NextResponse.json(
                { error: "No track currently playing" },
                { status: 404, headers: NO_STORE_HEADERS },
            );
        }

        const hash = current.item.album.images?.[0]?.url.split("/")[4];
        const dominantColor = hash
            ? ((await fetch(`https://bzhou.ca/api/getColor/${hash}`, {
                  cache: "no-store",
              }).then((r) => r.json())) as {
                  answer: [number, number, number];
              })
            : { answer: [29, 185, 84] as [number, number, number] };

        return NextResponse.json(
            {
                title: current.item.name,
                artist: current.item.artists[0].name,
                album: current.item.album.name,
                color: dominantColor.answer,
                duration: String(Math.round(current.item.duration_ms / 1000)),
                progress: String(Math.round((current.progress_ms ?? 0) / 1000)),
                paused: String(!current.is_playing),
                volume: String(current.device?.volume_percent ?? 0),
                shuffle: current.shuffle_state,
                loop: current.repeat_state,
            } as ESPInfo,
            { headers: NO_STORE_HEADERS },
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500, headers: NO_STORE_HEADERS },
        );
    }
}
