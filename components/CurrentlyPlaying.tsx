"use client";

import { motion, easeInOut } from "framer-motion";
import Image from "next/image";
import { FaSpotify } from "react-icons/fa6";
import Card from "@/components/Card";
import { useCurrentlyPlaying } from "./useCurrentlyPlaying";

export default function CurrentlyPlaying() {
    const { track, isLoading, error, currentProgress } = useCurrentlyPlaying();

    if (isLoading) {
        return (
            <Card
                variant="glass"
                ambient
                ambientSeed="currently-playing"
                ambientClassName="opacity-60"
                ambientVariant="indigo"
                className="relative mx-auto mt-3 flex w-full max-w-[700px] overflow-hidden rounded-2xl"
                motionProps={{
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    transition: { duration: 1 },
                }}
            >
                <div className="relative z-10 flex w-full items-center gap-4 p-3 sm:m-4 sm:ml-2 sm:gap-6 sm:p-0.5">
                    <div className="aspect-square h-20 shrink-0 overflow-hidden rounded-xl shadow-xl sm:h-full sm:max-w-36">
                        <div className="w-full h-full animate-pulse">
                            <div className="flex justify-center items-center w-full h-full">
                                <FaSpotify className="w-16 h-16 animate-pulse text-white/40" />
                            </div>
                        </div>
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-center">
                        <div className="mb-2 flex items-center gap-2">
                            <FaSpotify className="shrink-0 w-4 h-4 text-green-400 animate-pulse" />
                            <div className="w-32 h-3 rounded animate-pulse bg-white/20"></div>
                        </div>

                        <div className="mb-3 h-5 w-32 rounded bg-white/25 animate-pulse sm:w-48"></div>

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

    return (
        <Card
            variant="glass"
            ambient
            ambientSeed="currently-playing"
            ambientClassName="opacity-50"
            className="relative mx-auto mt-3 flex w-full max-w-[700px] overflow-hidden rounded-xl p-2"
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
            <div className="relative z-10 flex w-full items-center gap-4 p-2 sm:m-4 sm:gap-6 sm:p-0.5">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl shadow-xl sm:h-20 sm:w-20">
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
                <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <div className="mb-2 flex items-center gap-2">
                        <FaSpotify className="shrink-0 w-4 h-4 text-green-500" />
                        <span className="min-w-0 text-xs font-medium text-slate-400">
                            {track.paused === "true"
                                ? "Last Listened To"
                                : "Now Playing"}{" "}
                            <span className="hidden sm:inline">- {track.artist}</span>
                        </span>
                    </div>

                    <h3 className="mb-1 text-base font-bold leading-tight sm:mb-3 sm:text-lg">
                        {track.title}
                    </h3>
                    <p className="mb-3 truncate text-sm text-white/60 sm:hidden">
                        {track.artist}
                    </p>

                    <div className="w-full">
                        <div className="w-full h-1.5 bg-gray-700 rounded-full">
                            <div
                                className="h-1.5 rounded-full transition-all duration-300 ease-out"
                                style={{
                                    width: `${progressPercentage}%`,
                                    backgroundColor: dominantColor,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
