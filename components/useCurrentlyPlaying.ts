import { useEffect, useState } from "react";

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

export function useCurrentlyPlaying(): CurrentlyPlayingState {
    const [track, setTrack] = useState<SpotifyTrack | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentProgress, setCurrentProgress] = useState(0);

    useEffect(() => {
        let isMounted = true;

        const fetchCurrentlyPlaying = async () => {
            try {
                const response = await fetch("/api/getCurrent/public");
                if (!isMounted) return;
                if (response.ok) {
                    const data = (await response.json()) as SpotifyTrack;
                    setTrack(data);
                    setCurrentProgress(parseInt(data.progress));
                    setError(null);
                } else {
                    setError("Not currently playing");
                }
            } catch {
                if (!isMounted) return;
                setError("Failed to fetch track");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchCurrentlyPlaying();
        const interval = setInterval(fetchCurrentlyPlaying, 30000);
        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        if (!track || track.paused === "true") return;

        const progressInterval = setInterval(() => {
            setCurrentProgress((prev) => {
                const newProgress = prev + 1;
                const duration = parseInt(track.duration);
                return newProgress > duration ? duration : newProgress;
            });
        }, 5000);

        return () => clearInterval(progressInterval);
    }, [track]);

    return { track, isLoading, error, currentProgress };
}
