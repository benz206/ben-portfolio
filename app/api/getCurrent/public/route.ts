import getSpotifyAccessToken from "@/utils/functions/getSpotify";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { NextRequest } from "next/server";

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

// No palette snapping. We will return the image's dominant RGB directly.

export async function GET(_req: NextRequest) {
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
        const imageUrl = current.item.album.images[0]?.url as string | undefined;
        if (imageUrl) {
            try {
                const imgRes = await fetch(imageUrl);
                const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
                const stats = await sharp(imgBuffer).stats();
                const dom = (stats as any).dominant as { r: number; g: number; b: number } | undefined;
                if (dom && [dom.r, dom.g, dom.b].every((n) => typeof n === "number")) {
                    dominantColor = [dom.r, dom.g, dom.b];
                }
            } catch {
                // fallback to default color
            }
        }
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


