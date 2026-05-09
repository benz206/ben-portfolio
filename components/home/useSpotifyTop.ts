import { useEffect, useReducer } from "react";
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

type Status =
    | { kind: "loading" }
    | { kind: "ready"; data: TopResponse }
    | { kind: "error" };

type Action =
    | { type: "success"; data: TopResponse }
    | { type: "failure" };

const initialStatus: Status = { kind: "loading" };

function reducer(_: Status, action: Action): Status {
    switch (action.type) {
        case "success":
            return { kind: "ready", data: action.data };
        case "failure":
            return { kind: "error" };
    }
}

export function useSpotifyTop() {
    const [status, dispatch] = useReducer(reducer, initialStatus);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const response = await fetch("/api/getTop/public");
                if (!response.ok) throw new Error("Failed");
                const json = (await response.json()) as TopResponse;
                if (!cancelled) dispatch({ type: "success", data: json });
            } catch {
                if (!cancelled) dispatch({ type: "failure" });
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    return {
        data: status.kind === "ready" ? status.data : null,
        isLoading: status.kind === "loading",
    };
}
