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
    songUrl?: string;
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
    const anchorRef = useRef({ progress: 0, at: 0 });

    const { data, error, isLoading } = useSWR<NowPlayingTrack | null>(
        "/api/getCurrent/public",
        fetcher,
        {
            refreshInterval: 3_000,
            dedupingInterval: 1_000,
            onSuccess: (next) => {
                if (!next) return;
                const serverProgress = parseInt(next.progress);
                const duration = parseInt(next.duration);
                const key = `${next.title}-${next.artist}-${next.album}`;
                const trackChanged = trackKeyRef.current !== key;
                trackKeyRef.current = key;

                const { progress, at } = anchorRef.current;
                const localProgress = at
                    ? progress + (Date.now() - at) / 1000
                    : 0;

                // Snap to the server value when the track changes (or on first
                // load). Otherwise keep the locally-ticked value and only let
                // the server pull it forward, so the bar never jumps backward
                // when a slightly-stale cached response comes back.
                const synced =
                    trackChanged || next.paused === "true"
                        ? serverProgress
                        : Math.max(localProgress, serverProgress);

                anchorRef.current = {
                    progress: Math.min(synced, duration),
                    at: Date.now(),
                };
                setCurrentProgress(anchorRef.current.progress);
            },
        },
    );

    const track = data ?? null;
    const isPlaying = track !== null && track.paused !== "true";
    const duration = track ? parseInt(track.duration) : 0;

    useEffect(() => {
        if (!isPlaying) return;

        const progressInterval = setInterval(() => {
            const { progress, at } = anchorRef.current;
            setCurrentProgress(
                Math.min(progress + (Date.now() - at) / 1000, duration),
            );
        }, 500);

        return () => clearInterval(progressInterval);
    }, [isPlaying, duration]);

    const errorMessage = error
        ? error.message || "Failed to fetch track"
        : data === null
          ? "Not currently playing"
          : null;

    return { track, isLoading, error: errorMessage, currentProgress };
}
