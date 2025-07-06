import { NextApiRequest, NextApiResponse } from "next";
import getSpotifyAccessToken from "@/utils/functions/getSpotify";
import { getColorFromURL } from "color-thief-node";

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

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<SpotifyTrackInfo | { error: string }>
) {
    if (req.method !== "GET") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    try {
        const accessToken = await getSpotifyAccessToken();

        const response = await fetch(`https://api.spotify.com/v1/me/player`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (response.ok) {
            const current = await response.json();

            if (!current.item) {
                res.status(404).json({ error: "No track currently playing" });
                return;
            }

            let dominantColor: [number, number, number] = [29, 185, 84];
            try {
                const imageUrl = current.item.album.images[0].url;
                dominantColor = await getColorFromURL(imageUrl);
            } catch (error) {
                console.log("Failed to fetch dominant color");
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

            res.status(200).json(trackInfo);
        } else {
            const errorMessage = await response.text();
            res.status(response.status).json({ error: errorMessage });
        }
    } catch (error) {
        console.error("Error fetching Spotify data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
