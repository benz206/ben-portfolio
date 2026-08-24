"use client";

import { useEffect, useRef } from "react";
import { useSoundtrack } from "./SoundtrackProvider";

const SPOTIFY_URI = /^spotify:track:([A-Za-z0-9]{22})$/;
const SPOTIFY_URL =
    /open\.spotify\.com\/(?:intl-[a-z-]+\/)?track\/([A-Za-z0-9]{22})/;

function parseTrackId(src: string): string | null {
    return (src.match(SPOTIFY_URI) ?? src.match(SPOTIFY_URL))?.[1] ?? null;
}

function parseStart(start?: string | number): number {
    if (start === undefined) return 0;
    if (typeof start === "number") return Math.max(0, start);
    const parts = String(start).split(":").map(Number);
    if (parts.length === 0 || parts.some((p) => !Number.isFinite(p))) return 0;
    return Math.max(0, parts.reduce((acc, p) => acc * 60 + p, 0));
}

export default function Song({
    src,
    start,
}: {
    src: string;
    start?: string | number;
}) {
    const soundtrack = useSoundtrack();
    const ref = useRef<HTMLSpanElement>(null);
    const id = src ? parseTrackId(src) : null;
    const startAt = parseStart(start);

    useEffect(() => {
        const el = ref.current;
        if (!soundtrack || !id || !el) return;
        return soundtrack.register({
            id,
            uri: `spotify:track:${id}`,
            startAt,
            el,
        });
    }, [soundtrack, id, startAt]);

    if (!id) return null;
    return <span ref={ref} aria-hidden="true" className="block h-0" />;
}
