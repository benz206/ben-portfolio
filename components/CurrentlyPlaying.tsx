"use client";

import { motion, easeInOut } from "framer-motion";
import Image from "next/image";
import { FaSpotify } from "react-icons/fa6";
import Card from "@/components/Card";
import type { SpotifyTrack } from "./useCurrentlyPlaying";

type CurrentlyPlayingProps = {
    track: SpotifyTrack | null;
    isLoading: boolean;
    error: string | null;
    currentProgress: number;
};


export default function CurrentlyPlaying({
    track,
    isLoading,
    error,
    currentProgress,
}: CurrentlyPlayingProps) {
    if (isLoading) {
        return (
            <Card
                variant="glass"
                ambient
                ambientSeed="currently-playing"
                ambientClassName="opacity-60"
                ambientVariant="indigo"
                className="relative flex h-32 mt-3 mx-auto w-full max-w-175 overflow-hidden rounded-2xl"
                motionProps={{
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    transition: { duration: 1 },
                }}
            >
                <div className="relative z-10 flex items-center space-x-6 flex-1 min-w-0">
                    <div className="overflow-hidden shrink-0 h-full rounded-xl shadow-xl max-w-36 aspect-square">
                        <div className="w-full h-full animate-pulse">
                            <div className="flex justify-center items-center w-full h-full">
                                <FaSpotify className="w-16 h-16 animate-pulse text-white/40" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col flex-1 justify-center min-w-0">
                        <div className="flex items-center mb-2 space-x-2">
                            <FaSpotify className="shrink-0 w-4 h-4 text-green-400 animate-pulse" />
                            <div className="w-32 h-3 rounded animate-pulse bg-white/20"></div>
                        </div>

                        <div className="mb-3 w-48 h-5 rounded animate-pulse bg-white/25"></div>

                        <div className="w-full h-1.5 bg-white/10 rounded-full">
                            <motion.div
                                className="h-1.5 bg-green-400 rounded-full"
                                initial={{ width: "0%" }}
                                animate={{ width: "60%" }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: easeInOut,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </Card>
        );
    }
    if (error || !track) {
        return null;
    }

    const progressPercentage =
        (currentProgress / parseInt(track.duration)) * 100;
    const dominantColor = track.color
        ? `rgb(${track.color[0]}, ${track.color[1]}, ${track.color[2]}, 50%)`
        : "#1DB954";
const isPlaying = track.paused !== "true";

    return (
        <Card
            variant="glass"
            ambient
            ambientSeed="currently-playing"
            ambientClassName="opacity-50"
            className="relative flex h-32 mt-3 mx-auto p-2 w-full max-w-175 overflow-hidden rounded-xl"
            motionProps={{
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { duration: 1 },
            }}
        >
            {track.albumArt && (
                <>
                    <div
                        className="absolute inset-0 w-full h-full"
                        style={{
                            backgroundImage: `url(${track.albumArt})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                        }}
                    />
                    <div className="absolute inset-0 bg-black/50" />
                </>
            )}
            <div className="relative z-10 flex items-center pl-4 space-x-4 flex-1 min-w-0">
                <div className="overflow-hidden w-20 h-20 rounded-xl shadow-xl shrink-0">
                    {track.albumArt && (
                        <Image
                            src={track.albumArt}
                            alt={`${track.album} album art`}
                            width={140}
                            height={140}
                            className="object-cover w-full h-full"
                        />
                    )}
                </div>
                <div className="flex flex-col flex-1 justify-center min-w-0">
                    <div className="flex items-center mb-2 space-x-2">
                        <FaSpotify className="shrink-0 w-4 h-4 text-green-500" />
                        <span className="text-xs font-medium truncate text-slate-400">
                            {isPlaying ? "Now Playing" : "Last Listened To"}{" "}
                            - {track.artist}
                        </span>
                    </div>

                    <h3 className="mb-3 text-lg font-bold leading-tight truncate">
                        {track.title}
                    </h3>

                    <div className="w-full">
                        <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                                className="h-1.5 rounded-full"
                                animate={{ width: `${progressPercentage}%` }}
                                transition={{ duration: 1, ease: "linear" }}
                                style={{ backgroundColor: dominantColor }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
