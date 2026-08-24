"use client";

import {
    createContext,
    memo,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    useSyncExternalStore,
    type CSSProperties,
    type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { FaSpotify } from "react-icons/fa6";
import { cn } from "@/utils/cn";
import { glowColor } from "@/utils/glowColor";
import type { SoundtrackTrackMeta } from "@/types/externalApis";
import type {
    SpotifyEmbedController,
    SpotifyIframeApi,
    SpotifyPlaybackUpdate,
} from "@/types/spotifyEmbed";

export type SoundtrackEntry = {
    id: string;
    uri: string;
    startAt: number;
    el: HTMLElement;
};

type SoundtrackContextValue = {
    register: (entry: SoundtrackEntry) => () => void;
};

const SoundtrackContext = createContext<SoundtrackContextValue | null>(null);

export function useSoundtrack() {
    return useContext(SoundtrackContext);
}

const IFRAME_API_SRC = "https://open.spotify.com/embed/iframe-api/v1";
const PREVIEW_MARGIN_MS = 1000;
const BOTTOM_EPSILON = 4;
const ACTIVE_LINE = 0.4;
const TRACK_SWITCH_DELAY_MS = 400;
const BAR_OFFSET = "5.25rem";

let apiPromise: Promise<SpotifyIframeApi> | null = null;

function loadIframeApi(): Promise<SpotifyIframeApi> {
    if (apiPromise) return apiPromise;
    apiPromise = new Promise((resolve) => {
        window.onSpotifyIframeApiReady = resolve;
        const script = document.createElement("script");
        script.src = IFRAME_API_SRC;
        script.async = true;
        document.body.appendChild(script);
    });
    return apiPromise;
}

function trackIdOf(uri: string): string {
    return uri.split(":").at(-1) ?? uri;
}

function formatTime(ms: number): string {
    if (!Number.isFinite(ms) || ms < 0) return "0:00";
    const total = Math.floor(ms / 1000);
    return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

const EmbedHost = memo(function EmbedHost({
    hostRef,
}: {
    hostRef: RefObject<HTMLDivElement | null>;
}) {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed bottom-0 left-0 -z-50 size-px overflow-hidden opacity-0"
        >
            <div ref={hostRef} />
        </div>
    );
});

export default function SoundtrackProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [entries, setEntries] = useState<SoundtrackEntry[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [meta, setMeta] = useState<Record<string, SoundtrackTrackMeta>>({});
    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [starting, setStarting] = useState(false);

    const hostRef = useRef<HTMLDivElement>(null);
    const controllerRef = useRef<SpotifyEmbedController | null>(null);
    const wantPlayRef = useRef(false);
    const readyRef = useRef(false);
    const startAtRef = useRef(0);
    const correctedRef = useRef(false);
    const loadedIdRef = useRef<string | null>(null);
    const requestedRef = useRef(new Set<string>());

    const mounted = useSyncExternalStore(
        () => () => {},
        () => true,
        () => false,
    );

    const register = useCallback((entry: SoundtrackEntry) => {
        setEntries((prev) =>
            [...prev, entry].sort((a, b) =>
                a.el.compareDocumentPosition(b.el) &
                Node.DOCUMENT_POSITION_FOLLOWING
                    ? -1
                    : 1,
            ),
        );
        return () =>
            setEntries((prev) => prev.filter((e) => e.el !== entry.el));
    }, []);

    const playEntry = useCallback((entry: SoundtrackEntry) => {
        const controller = controllerRef.current;
        if (!controller) return;
        loadedIdRef.current = entry.id;
        startAtRef.current = entry.startAt;
        correctedRef.current = false;
        controller.loadUri(entry.uri, false, entry.startAt);
        if (readyRef.current && wantPlayRef.current) controller.play();
    }, []);

    const handleUpdate = useCallback((e: { data: SpotifyPlaybackUpdate }) => {
        const { playingURI, isPaused, position, duration } = e.data;
        setPosition(position);
        setDuration(duration);
        setIsPlaying(!isPaused);
        if (duration > 0) setStarting(false);

        if (duration <= 0 || correctedRef.current) return;
        if (trackIdOf(playingURI) !== loadedIdRef.current) return;

        correctedRef.current = true;
        if (startAtRef.current * 1000 < duration - PREVIEW_MARGIN_MS) return;

        const controller = controllerRef.current;
        controller?.loadUri(`spotify:track:${loadedIdRef.current}`);
        if (wantPlayRef.current) controller?.play();
    }, []);

    const start = useCallback(async () => {
        const entry = entries[activeIndex];
        if (!entry) return;
        setStarting(true);
        const api = await loadIframeApi();
        if (!hostRef.current) return;
        wantPlayRef.current = true;
        api.createController(
            hostRef.current,
            { uri: entry.uri, width: 300, height: 80 },
            (controller) => {
                controllerRef.current = controller;
                controller.addListener("playback_update", handleUpdate);
                controller.addListener("ready", () => {
                    readyRef.current = true;
                    if (wantPlayRef.current) controller.play();
                });
                playEntry(entry);
            },
        );
    }, [entries, activeIndex, handleUpdate, playEntry]);

    const toggle = useCallback(() => {
        const controller = controllerRef.current;
        if (!controller) {
            void start();
            return;
        }
        if (isPlaying) {
            wantPlayRef.current = false;
            controller.pause();
            return;
        }
        wantPlayRef.current = true;
        const entry = entries[activeIndex];
        if (entry && loadedIdRef.current !== entry.id) playEntry(entry);
        else controller.resume();
    }, [isPlaying, start, entries, activeIndex, playEntry]);

    useEffect(() => {
        if (entries.length === 0) return;

        let offsets: number[] = [];
        let frame: number | null = null;

        const measure = () => {
            offsets = entries.map(
                (e) => e.el.getBoundingClientRect().top + window.scrollY,
            );
            update();
        };

        const computeActive = () => {
            if (
                window.scrollY + window.innerHeight >=
                document.documentElement.scrollHeight - BOTTOM_EPSILON
            )
                return offsets.length - 1;
            const line = window.scrollY + window.innerHeight * ACTIVE_LINE;
            let current = 0;
            for (let i = 0; i < offsets.length; i++) {
                if (offsets[i] <= line) current = i;
                else break;
            }
            return current;
        };

        const update = () => setActiveIndex(computeActive());

        const handleScroll = () => {
            if (frame !== null) return;
            frame = requestAnimationFrame(() => {
                frame = null;
                update();
            });
        };

        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(document.documentElement);
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", measure);
        return () => {
            if (frame !== null) cancelAnimationFrame(frame);
            observer.disconnect();
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", measure);
        };
    }, [entries]);

    useEffect(() => {
        const entry = entries[activeIndex];
        if (!entry || !controllerRef.current || !wantPlayRef.current) return;
        if (loadedIdRef.current === entry.id) return;
        const timer = setTimeout(
            () => playEntry(entry),
            TRACK_SWITCH_DELAY_MS,
        );
        return () => clearTimeout(timer);
    }, [activeIndex, entries, playEntry]);

    useEffect(() => {
        const ids = entries
            .map((e) => e.id)
            .filter((id) => !requestedRef.current.has(id));
        if (ids.length === 0) return;
        ids.forEach((id) => requestedRef.current.add(id));
        fetch(`/api/getTracks/public?ids=${ids.join(",")}`)
            .then((r) => (r.ok ? r.json() : []))
            .then((list: SoundtrackTrackMeta[]) => {
                if (!Array.isArray(list)) return;
                setMeta((prev) => ({
                    ...prev,
                    ...Object.fromEntries(list.map((t) => [t.id, t])),
                }));
            })
            .catch(() => ids.forEach((id) => requestedRef.current.delete(id)));
    }, [entries]);

    useEffect(() => {
        if (entries.length === 0) return;
        document.body.style.setProperty("--soundtrack-offset", BAR_OFFSET);
        return () => {
            document.body.style.removeProperty("--soundtrack-offset");
        };
    }, [entries.length]);

    useEffect(() => {
        return () => controllerRef.current?.destroy();
    }, []);

    const active = entries[activeIndex];
    const track = active ? meta[active.id] : undefined;
    const progress = duration > 0 ? position / duration : 0;

    const bar = active && (
        <div
            className="fixed bottom-4 left-1/2 z-40 w-[min(30rem,calc(100vw-2rem))] -translate-x-1/2"
            style={
                { "--glow": glowColor(track?.color ?? [90, 90, 90]) } as CSSProperties
            }
        >
            <div className="group relative overflow-hidden rounded-2xl bg-black/40 shadow-[0_10px_40px_rgba(0,0,0,0.5),0_0_24px_-12px_rgba(var(--glow),0.5)] backdrop-blur-xl transition-all duration-300 hover:bg-black/50 hover:shadow-[0_12px_46px_rgba(0,0,0,0.55),0_0_40px_-10px_rgba(var(--glow),0.75)]">
                {track?.href && (
                    <a
                        href={track.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${track.name} on Spotify`}
                        className="absolute inset-0 z-10 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(var(--glow),0.6)]"
                    />
                )}

                <div className="pointer-events-none relative z-20 flex items-center gap-3 px-3 py-2.5">
                    {track?.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={track.image}
                            alt=""
                            className="size-11 shrink-0 rounded-lg object-cover shadow-lg transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="size-11 shrink-0 rounded-lg bg-white/8" />
                    )}

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium text-white/90 transition-colors duration-300 group-hover:text-white">
                            {track?.name ?? "Loading track…"}
                        </p>
                        <p className="truncate text-[11px] text-white/45">
                            {duration > 0
                                ? `${track?.artist ?? ""}${track?.artist ? " · " : ""}${formatTime(position)} / ${formatTime(duration)}`
                                : (track?.artist ?? "Soundtrack")}
                        </p>
                    </div>

                    <FaSpotify className="size-4 shrink-0 text-white/25 transition-colors duration-300 group-hover:text-[rgb(var(--glow))]" />

                    <button
                        onClick={toggle}
                        disabled={starting}
                        aria-label={
                            isPlaying ? "Pause soundtrack" : "Play soundtrack"
                        }
                        className={cn(
                            "pointer-events-auto flex size-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/80 transition-colors",
                            starting
                                ? "opacity-50"
                                : "hover:border-[rgba(var(--glow),0.6)] hover:bg-white/15 hover:text-white",
                        )}
                    >
                        {isPlaying ? (
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <rect x="2" y="1.5" width="3" height="9" rx="1" />
                                <rect x="7" y="1.5" width="3" height="9" rx="1" />
                            </svg>
                        ) : (
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path d="M3 1.8v8.4a.6.6 0 0 0 .92.5l6.5-4.2a.6.6 0 0 0 0-1L3.92 1.3A.6.6 0 0 0 3 1.8Z" />
                            </svg>
                        )}
                    </button>
                </div>

                <div className="relative z-20 h-0.5 w-full bg-white/10">
                    <div
                        className="h-full w-full origin-left bg-[rgb(var(--glow))] transition-transform duration-200 ease-linear"
                        style={{ transform: `scaleX(${progress})` }}
                    />
                </div>
            </div>
        </div>
    );

    const contextValue = useMemo(() => ({ register }), [register]);

    return (
        <SoundtrackContext.Provider value={contextValue}>
            {children}
            <EmbedHost hostRef={hostRef} />
            {mounted && bar ? createPortal(bar, document.body) : null}
        </SoundtrackContext.Provider>
    );
}
