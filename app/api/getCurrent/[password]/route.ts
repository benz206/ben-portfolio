import getSpotifyAccessToken from "@/utils/functions/getSpotify";
import { NextRequest, NextResponse } from "next/server";

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

export async function GET(req: NextRequest, { params }: { params: { password: string } }) {
    const { password } = params;
    if (password !== process.env.PASSWORD) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
        const dominantColor = await fetch(
            `https://bzhou.ca/api/getColor/${current.item.album.images[0].url.split("/")[4]}`
        ).then((r) => r.json());

        return NextResponse.json({
            title: current.item.name,
            artist: current.item.artists[0].name,
            album: current.item.album.name,
            color: dominantColor.answer,
            duration: String(Math.round(current.item.duration_ms / 1000)),
            progress: String(Math.round(current.progress_ms / 1000)),
            paused: String(!current.is_playing),
            volume: String(current.device.volume_percent),
            shuffle: current.shuffle_state,
            loop: current.repeat_state,
        } as ESPInfo);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


