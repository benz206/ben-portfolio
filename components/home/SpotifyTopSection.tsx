"use client";

import { motion } from "framer-motion";
import Card from "@/components/Card";
import { FaSpotify } from "react-icons/fa6";
import TopItemCard from "@/components/home/TopItemCard";
import { useSpotifyTop } from "@/components/home/useSpotifyTop";

export default function SpotifyTopSection() {
    const { data, isLoading } = useSpotifyTop();

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
                        <h2 className="text-2xl font-semibold sm:text-3xl">
                            Top Songs & Artists
                        </h2>
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
                                    <TopItemCard
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
                                    <TopItemCard
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
