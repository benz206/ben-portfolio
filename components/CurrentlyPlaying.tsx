"use client";
import { useEffect, useState } from "react";
import { motion, easeInOut } from "framer-motion";
import Image from "next/image";
import { FaSpotify } from "react-icons/fa";
import Card from "@/components/Card";

type SpotifyTrack = {
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

export default function CurrentlyPlaying() {
    const [track, setTrack] = useState<SpotifyTrack | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentProgress, setCurrentProgress] = useState(0);

    const fetchCurrentlyPlaying = async () => {
        try {
            const response = await fetch("/api/getCurrent/public");
            if (response.ok) {
                const data = await response.json();
                setTrack(data);
                setCurrentProgress(parseInt(data.progress));
                setError(null);
            } else {
                setError("Not currently playing");
            }
        } catch (err) {
            setError("Failed to fetch track");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrentlyPlaying();
        const interval = setInterval(fetchCurrentlyPlaying, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!track || track.paused === "true") return;

        const progressInterval = setInterval(() => {
            setCurrentProgress((prev) => {
                const newProgress = prev + 1;
                const duration = parseInt(track.duration);
                return newProgress > duration ? duration : newProgress;
            });
        }, 1000);

        return () => clearInterval(progressInterval);
    }, [track]);

    if (isLoading) {
        return (
            <Card
                variant="glass"
                ambient
                ambientSeed="currently-playing"
                ambientClassName="opacity-50"
                className="relative flex h-32 mt-3 mx-auto w-full max-w-[700px] overflow-hidden rounded-2xl"
                motionProps={{
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    transition: { duration: 1 },
                }}
            >
                <div
                    className="absolute inset-0 w-full h-full"
                    style={{
                        backgroundImage:
                            "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />
                <div className="absolute inset-0 bg-white/50 dark:bg-black/50" />
                <div className="relative z-10 flex items-center p-0.5 m-4 space-x-6 w-full">
                    <div className="flex-shrink-0 h-full overflow-hidden shadow-xl w- max-w-36 aspect-square rounded-xl">
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse dark:from-gray-700 dark:to-gray-600">
                            <div className="flex items-center justify-center w-full h-full">
                                <FaSpotify className="w-10 h-10 text-gray-400 animate-pulse dark:text-gray-500" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center flex-1 min-w-0">
                        <div className="flex items-center mb-2 space-x-2">
                            <FaSpotify className="flex-shrink-0 w-4 h-4 text-green-500 animate-pulse" />
                            <div className="w-32 h-3 bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
                        </div>

                        <div className="w-48 h-5 mb-3 bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>

                        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
                            <motion.div
                                className="h-1.5 bg-green-500 rounded-full"
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
            className="relative flex h-32 mt-3 mx-auto p-2 w-full max-w-[700px] overflow-hidden rounded-2xl"
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
                    <div className="absolute inset-0 bg-white/50 dark:bg-black/50" />
                </>
            )}
            <div className="relative z-10 flex items-center p-0.5 m-4 space-x-6 w-full">
                <div className="w-20 h-20 overflow-hidden shadow-xl rounded-xl">
                    {track.albumArt && (
                        <Image
                            src={track.albumArt}
                            alt={`${track.album} album art`}
                            width={140}
                            height={140}
                            unoptimized
                            className="object-cover w-full h-full"
                        />
                    )}
                </div>
                <div className="flex flex-col justify-center flex-1 min-w-0">
                    <div className="flex items-center mb-2 space-x-2">
                        <FaSpotify className="flex-shrink-0 w-4 h-4 text-green-500" />
                        <span className="text-xs font-medium text-black truncate dark:text-slate-400">
                            {track.paused === "true"
                                ? "Last Listened To"
                                : "Now Playing"}{" "}
                            - {track.artist}
                        </span>
                    </div>

                    <h3 className="mb-3 text-lg font-bold leading-tight truncate">
                        {track.title}
                    </h3>

                    <div className="w-full">
                        <div className="w-full h-1.5 bg-gray-200 rounded-full dark:bg-gray-700">
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
