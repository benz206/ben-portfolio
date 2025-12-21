"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Card from "@/components/Card";
import { FaSpotify } from "react-icons/fa";

type TopItem = {
    name: string;
    subtitle: string;
    image?: string;
    color: [number, number, number];
    href?: string;
    followers?: number;
};

type TopResponse = {
    timeRange: "medium_term";
    tracks: TopItem[];
    artists: TopItem[];
    updatedAt: number;
};

function rgbToCss(color?: [number, number, number], alpha = 0.9) {
    if (!color) return `rgb(29 185 84 / ${alpha})`;
    return `rgb(${color[0]} ${color[1]} ${color[2]} / ${alpha})`;
}

function formatFollowers(n?: number) {
    if (typeof n !== "number" || Number.isNaN(n)) return null;
    return Intl.NumberFormat(undefined, { notation: "compact" }).format(n);
}

function TopCard({
    item,
    rank,
    kind,
}: {
    item: TopItem;
    rank: number;
    kind: "track" | "artist";
}) {
    const dominantColor = rgbToCss(item.color);
    const followers = formatFollowers(item.followers);
    const subtitle =
        kind === "track"
            ? item.subtitle
            : followers
            ? `${followers} followers`
            : item.subtitle;

    return (
        <Card
            variant="glass"
            ambient
            ambientSeed={`${kind}:${rank}:${item.name}`}
            ambientClassName="opacity-50"
            className="flex overflow-hidden relative items-center px-2 py-1 mx-auto mt-0 w-full h-28 rounded-xl border-0"
            motionProps={{
                initial: { opacity: 0, y: 12 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0.4 },
                transition: { duration: 0.6 },
            }}
        >
            {item.image && (
                <>
                    <div
                        className="absolute inset-0 w-full h-full"
                        style={{
                            backgroundImage: `url(${item.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                        }}
                    />
                    <div className="absolute inset-0 bg-black/50" />
                </>
            )}

            <div className="flex relative z-10 gap-6 items-center w-full">
                <div className="overflow-hidden ml-2 w-20 h-20 rounded-lg shadow-xl bg-white/5">
                    {item.image ? (
                        <Image
                            src={item.image}
                            alt={item.name}
                            width={140}
                            height={140}
                            unoptimized
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <div className="flex justify-center items-center w-full h-full">
                            <FaSpotify className="w-10 h-10 text-white/35" />
                        </div>
                    )}
                </div>
                <div className="flex flex-col flex-1 justify-center min-w-0">
                    <div className="flex items-center mb-1 space-x-2">
                        {/* <FaSpotify className="flex-shrink-0 w-4 h-4 text-green-500" /> */}
                        <span className="text-xs font-medium truncate text-slate-200">
                            {subtitle}
                        </span>
                    </div>

                    <h3 className="text-lg font-bold leading-tight text-white truncate">
                        {item.name}
                    </h3>
                </div>
            </div>
        </Card>
    );
}

export default function SpotifyTopSection() {
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

    return (
        <section
            id="home-next-section"
            className="flex relative justify-center items-center py-24 min-h-screen text-white home-section bg-noir-gradient-spotify"
        >
            <div className="absolute inset-0 opacity-90 bg-noir-radial-spotify" />

            <div className="relative z-10 flex w-11/12 max-w-[1080px] flex-col gap-10">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.6, delay: 0.12 }}
                    className="space-y-2"
                >
                    <div className="flex flex-col gap-8">
                        <div className="flex gap-3 items-center">
                            <FaSpotify className="w-4 h-4 text-green-500" />
                            <span className="text-xs uppercase tracking-[0.3em] text-white/45">
                                Spotify
                            </span>
                        </div>
                        <h2 className="text-2xl font-semibold sm:text-3xl">Top Songs & Artists</h2>
                        <p className="max-w-2xl text-sm font-light text-white/60">
                            What I've been listening to <b>recently</b>.
                        </p>
                        </div>
                </motion.div>

                {isLoading ? (
                    <div className="grid gap-10">
                        <div className="grid gap-4">
                            <div className="w-40 h-6 rounded animate-pulse bg-white/10" />
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={`t-skel-${i}`}
                                    className="h-[92px] rounded-2xl bg-white/5 border border-white/10 animate-pulse"
                                />
                            ))}
                        </div>
                        <div className="grid gap-4">
                            <div className="w-40 h-6 rounded animate-pulse bg-white/10" />
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={`a-skel-${i}`}
                                    className="h-[92px] rounded-2xl bg-white/5 border border-white/10 animate-pulse"
                                />
                            ))}
                        </div>
                    </div>
                ) : !data ? (
                    <Card
                        variant="glass"
                        ambient
                        ambientSeed="spotify-top-error"
                        ambientVariant="slate"
                        ambientClassName="opacity-35"
                        className="p-6 rounded-2xl"
                    >
                        <div className="text-sm text-white/60">
                            Unable to load Spotify top items right now.
                        </div>
                    </Card>
                ) : (
                    <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
                        <div className="flex flex-col gap-4">
                            <span className="text-xs uppercase tracking-[0.25em] text-white/40">
                                Top Tracks
                            </span>
                            <div className="grid gap-8">
                                {data.tracks.map((t, idx) => (
                                    <TopCard
                                        key={`track-${t.name}-${idx}`}
                                        item={t}
                                        rank={idx + 1}
                                        kind="track"
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <span className="text-xs uppercase tracking-[0.25em] text-white/40">
                                Top Artists
                            </span>
                            <div className="grid gap-8">
                                {data.artists.map((a, idx) => (
                                    <TopCard
                                        key={`artist-${a.name}-${idx}`}
                                        item={a}
                                        rank={idx + 1}
                                        kind="artist"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
