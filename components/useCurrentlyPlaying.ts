import { useEffect, useState } from "react";
import useSWR from "swr";

export type SpotifyTrack = {
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

type CurrentlyPlayingState = {
    track: SpotifyTrack | null;
    isLoading: boolean;
    error: string | null;
    currentProgress: number;
};

const fetcher = async (url: string): Promise<SpotifyTrack | null> => {
    const response = await fetch(url);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error("Not currently playing");
    return (await response.json()) as SpotifyTrack;
};

export function useCurrentlyPlaying(): CurrentlyPlayingState {
    const [currentProgress, setCurrentProgress] = useState(0);
    const { data, error, isLoading } = useSWR<SpotifyTrack | null>(
        "/api/getCurrent/public",
        fetcher,
        {
            refreshInterval: 30_000,
            revalidateOnFocus: false,
            onSuccess: (next) => {
                if (next) setCurrentProgress(parseInt(next.progress));
            },
        },
    );

    const track = data ?? null;

    useEffect(() => {
        if (!track || track.paused === "true") return;

        const progressInterval = setInterval(() => {
            setCurrentProgress((prev) => {
                const newProgress = prev + 1000;
                const duration = parseInt(track.duration);
                return newProgress > duration ? duration : newProgress;
            });
        }, 1000);

        return () => clearInterval(progressInterval);
    }, [track]);

    const errorMessage = error
        ? error.message || "Failed to fetch track"
        : data === null
          ? "Not currently playing"
          : null;

    return { track, isLoading, error: errorMessage, currentProgress };
}
