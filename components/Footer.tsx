"use client";

import Link from "next/link";
import Image from "next/image";
import { ImGithub } from "react-icons/im";
import { FaLinkedin, FaDiscord, FaInstagram, FaSpotify } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { SiMonkeytype } from "react-icons/si";
import { m } from "framer-motion";
import { useMemo, useSyncExternalStore } from "react";
import useSWR from "swr";
import { AmbientGradient } from "@/components/AmbientGradient";
import { useCurrentlyPlaying } from "@/components/useCurrentlyPlaying";
import { jsonFetcher } from "@/utils/fetcher";
import { formatNumber } from "@/utils/format";

type ViewsResponse = { count: number; daily?: number };
type PresenceResponse = { viewers: number };

const motionProps = {
    transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20,
    },
    whileTap: { scale: 0.95 },
} as const;

const socials = [
    {
        href: "https://x.com/bennyz206",
        icon: FaXTwitter,
        label: "X",
        seed: "x-twitter",
    },
    {
        href: "https://www.linkedin.com/in/ben-zhou06/",
        icon: FaLinkedin,
        label: "LinkedIn",
        seed: "linkedin",
    },
    {
        href: "https://github.com/benz206",
        icon: ImGithub,
        label: "GitHub",
        seed: "github",
    },
    {
        href: "https://discord.com/users/360061101477724170",
        icon: FaDiscord,
        label: "Discord",
        seed: "discord",
    },
    {
        href: "https://www.instagram.com/bennyz_06/",
        icon: FaInstagram,
        label: "Instagram",
        seed: "instagram",
    },
    {
        href: "https://monkeytype.com/profile/_Leg3ndary",
        icon: SiMonkeytype,
        label: "Monkeytype",
        seed: "monkeytype",
    },
] as const;

const clubs = [
    { src: "/clubs/uwcsa.png", alt: "UWCSA" },
    { src: "/clubs/watai.jpeg", alt: "WAT.ai" },
    { src: "/clubs/midnightsun.png", alt: "Midnight Sun" },
] as const;

export default function Footer() {
    const { track } = useCurrentlyPlaying();
    const { data: viewsData } = useSWR<ViewsResponse>(
        "/api/views",
        jsonFetcher,
        { revalidateOnFocus: false },
    );
    const { data: presenceData } = useSWR<PresenceResponse>(
        "/api/presence",
        jsonFetcher,
        { refreshInterval: 30_000, revalidateOnFocus: false },
    );

    const views = viewsData?.count ?? null;
    const dailyViews = viewsData?.daily ?? null;
    const viewers = presenceData?.viewers ?? null;

    const isClient = useSyncExternalStore(
        () => () => {},
        () => true,
        () => false,
    );
    const year = isClient ? new Date().getFullYear() : null;

    const viewText = useMemo(() => {
        if (views === null) return null;
        const count = formatNumber(views);
        return `${count} visits tracked`;
    }, [views]);

    return (
        <footer className="flex justify-center border-t border-white/5 bg-[#050506] py-16 snap-end snap-always">
            <div className="flex w-11/12 max-w-270 flex-col items-center gap-12 text-center lg:mx-auto lg:flex-row lg:items-center lg:text-left">
                <div className="flex-1 space-y-4 text-white/70">
                    <p className="text-sm font-thin leading-relaxed text-white/60">
                        Message me anytime @
                        <a
                            href="mailto:ben.zhou@uwaterloo.ca"
                            className="underline underline-offset-auto"
                        >
                            ben.zhou [at] uwaterloo.ca
                        </a>
                        .{" "}
                        <Link
                            href="/thanks"
                            className="underline underline-offset-auto"
                        >
                            Thanks.
                        </Link>
                    </p>
                    <div className="text-xs font-thin text-white/40">
                        © {year} Ben
                        {viewText && (
                            <span className="ml-3 text-white/35">
                                {viewText}
                                {dailyViews !== null && dailyViews > 0 && (
                                    <span className="ml-2 text-green-500">
                                        +{dailyViews} today
                                    </span>
                                )}
                            </span>
                        )}
                        {viewers !== null && viewers > 0 && (
                            <span className="ml-3 inline-flex items-center gap-1.5 text-white/35">
                                <span className="relative flex size-1.5">
                                    <span className="inline-flex absolute w-full h-full bg-green-400 rounded-full opacity-75 animate-ping" />
                                    <span className="relative inline-flex size-1.5 rounded-full bg-green-500" />
                                </span>
                                {viewers} viewing
                            </span>
                        )}
                    </div>
                    {track && (
                        <div className="inline-flex items-center gap-1.5 text-xs font-thin text-white/35">
                            <FaSpotify className="shrink-0 text-green-500" />
                            <span>
                                {track.paused === "true"
                                    ? "Last listened:"
                                    : "Now playing:"}{" "}
                                <span className="text-white/50">
                                    {track.title}
                                </span>
                                {": "}
                                {track.artist}
                            </span>
                        </div>
                    )}
                </div>
                <div className="flex flex-col flex-1 gap-6 items-center lg:items-end">
                    <div className="flex flex-wrap gap-4 justify-center text-white/70 lg:justify-end">
                        {socials.map(({ href, icon: Icon, label, seed }) => (
                            <m.a
                                key={href}
                                {...motionProps}
                                className="flex overflow-hidden relative justify-center items-center size-11 text-lg bg-transparent rounded-md border transition-colors duration-300 group border-white/30 text-white/70 hover:border-white/60 hover:text-white"
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                            >
                                <AmbientGradient
                                    className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                    seed={seed}
                                />
                                <span className="relative z-10 transition-opacity duration-300 group-hover:opacity-90">
                                    <Icon />
                                </span>
                            </m.a>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
                        {clubs.map((club) => (
                            <span
                                key={club.src}
                                className="flex overflow-hidden justify-center items-center size-6 rounded-sm"
                            >
                                <Image
                                    src={club.src}
                                    alt={club.alt}
                                    width={32}
                                    height={32}
                                    className="object-cover w-full h-full"
                                />
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
