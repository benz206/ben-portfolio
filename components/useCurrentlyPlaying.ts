import { useEffect, useRef, useState } from "react";
import useSWR from "swr";

export type NowPlayingTrack = {
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
    track: NowPlayingTrack | null;
    isLoading: boolean;
    error: string | null;
    currentProgress: number;
};

const fetcher = async (url: string): Promise<NowPlayingTrack | null> => {
    const response = await fetch(url);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error("Not currently playing");
    return (await response.json()) as NowPlayingTrack;
};

export function useCurrentlyPlaying(): CurrentlyPlayingState {
    const [currentProgress, setCurrentProgress] = useState(0);
    const trackKeyRef = useRef<string | null>(null);

    const { data, error, isLoading } = useSWR<NowPlayingTrack | null>(
        "/api/getCurrent/public",
        fetcher,
        {
            refreshInterval: 5_000,
            revalidateOnFocus: false,
            onSuccess: (next) => {
                if (!next) return;
                const serverProgress = parseInt(next.progress);
                const duration = parseInt(next.duration);
                const key = `${next.title}-${next.artist}-${next.album}`;
                const trackChanged = trackKeyRef.current !== key;
                trackKeyRef.current = key;

                // Snap to the server value when the track changes (or on first
                // load). Otherwise keep the locally-ticked value and only let
                // the server pull it forward, so the bar never jumps backward
                // when a slightly-stale cached response comes back.
                setCurrentProgress((prev) => {
                    const synced = trackChanged
                        ? serverProgress
                        : Math.max(prev, serverProgress);
                    return Math.min(synced, duration);
                });
            },
        },
    );

    const track = data ?? null;

    useEffect(() => {
        if (!track || track.paused === "true") return;

        const duration = parseInt(track.duration);
        const progressInterval = setInterval(() => {
            // progress/duration are in whole seconds, so advance by 1 per tick.
            setCurrentProgress((prev) => Math.min(prev + 1, duration));
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
