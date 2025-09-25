import getSpotifyAccessToken from "@/utils/functions/getSpotify";
import { getColorFromURL } from "color-thief-node";
import { NextResponse } from "next/server";

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

export async function GET() {
    try {
        const accessToken = await getSpotifyAccessToken();
        const response = await fetch(`https://api.spotify.com/v1/me/player`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            return NextResponse.json({ error: errorMessage }, { status: response.status });
        }

        const current = await response.json();
        if (!current.item) {
            return NextResponse.json({ error: "No track currently playing" }, { status: 404 });
        }

        let dominantColor: [number, number, number] = [29, 185, 84];
        try {
            const imageUrl = current.item.album.images[0].url;
            dominantColor = await getColorFromURL(imageUrl);
        } catch {}

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

        return NextResponse.json(trackInfo);
    } catch (error) {
        if (error instanceof SyntaxError) {
            return NextResponse.json({ error: "Not currently playing" }, { status: 500 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


