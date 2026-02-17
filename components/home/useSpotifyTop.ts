import { useEffect, useState } from "react";
import type { SpotifyTimeRange } from "@/types/externalApis";

export type TopItem = {
    name: string;
    subtitle: string;
    image?: string;
    color: [number, number, number];
    href?: string;
    followers?: number;
};

export type TopResponse = {
    timeRange: SpotifyTimeRange;
    tracks: TopItem[];
    artists: TopItem[];
    updatedAt: number;
};

export function useSpotifyTop() {
    const [data, setData] = useState<TopResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const fetchTop = async () => {
            try {
                const response = await fetch("/api/getTop/public");
                if (!response.ok) throw new Error("Failed");
                const json = (await response.json()) as TopResponse;
                if (!cancelled) setData(json);
            } catch {
                if (!cancelled) setData(null);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        fetchTop();
        return () => {
            cancelled = true;
        };
    }, []);

    return { data, isLoading };
}
