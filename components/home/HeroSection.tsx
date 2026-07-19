"use client";

import { m } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import CurrentlyPlaying from "@/components/CurrentlyPlaying";
import { useCurrentlyPlaying } from "@/components/useCurrentlyPlaying";
import FuegoLogo from "@/public/experience/fuego.webp";
import GrandCharterLogo from "@/public/experience/grandcharter.jpeg";
import EightVCLogo from "@/public/home/8vc.png";
import RoleCard, { type RoleCardData } from "@/components/home/RoleCard";
import { useScrollToSection } from "@/utils/hooks";
import Eyebrow from "@/components/Eyebrow";

const SCROLL_CHEVRONS = ["chevron-a", "chevron-b", "chevron-c"] as const;

const recentRoles: RoleCardData[] = [
    {
        title: "Engineering",
        company: "Grand Charter",
        location: "New York",
        period: "Sep 2025 - Present",
        image: {
            src: GrandCharterLogo,
            alt: "Grand Charter logo",
        },
        locationClass: "text-white/60",
        periodClass: "text-white/45",
        ambientVariant: "violet",
        href: "https://grandcharter.com",
        accent: "167,139,250",
    },
    {
        title: "Engineering Fellow",
        company: "8VC",
        location: "San Francisco",
        period: "May 2026 - Present",
        image: {
            src: EightVCLogo,
            alt: "8VC logo",
        },
        locationClass: "text-white/60",
        periodClass: "text-white/45",
        ambientVariant: "slate",
        href: "https://8vc.com",
        accent: "212,212,216",
    },
    {
        title: "Engineering",
        company: "Fuego",
        location: "San Francisco",
        period: "Jan 2025 - Apr 2025",
        image: {
            src: FuegoLogo,
            alt: "Fuego logo",
        },
        locationClass: "text-[rgba(255,196,158,0.9)]",
        periodClass: "text-[rgba(255,220,200,0.85)]",
        ambientVariant: "tangerine",
        href: "https://fuego.io",
        accent: "253,186,116",
    },
];

export default function HeroSection() {
    const rolesHeadingDelay = 0.35;
    const roleCardBaseDelay = 0.5;
    const roleCardStep = 0.14;
    const currentlyPlayingDelay =
        roleCardBaseDelay + recentRoles.length * roleCardStep + 0.35;

    const handleScrollClick = useScrollToSection("home-next-section");
    const { track, isLoading, error, currentProgress } = useCurrentlyPlaying();

    return (
        <section className="relative flex items-center justify-center pt-24 pb-20 overflow-hidden home-section sm:pb-20 sm:pt-28 lg:h-dvh lg:pb-0 lg:pt-0">
            <div className="absolute inset-0 bg-noir-gradient" />
            <div className="absolute inset-0 opacity-80 bg-noir-radial" />

            <div className="relative flex flex-col w-full gap-12 px-4 text-white max-w-270 sm:px-6 lg:w-11/12 lg:gap-16">
                <div className="grid gap-10 sm:gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-start">
                    <div className="flex flex-col min-w-0 gap-0 lg:gap-8">
                        <m.div
                            className="space-y-2 lg:space-y-6"
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.4 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <Eyebrow className="tracking-[0.2em]">
                                PORTFOLIO
                            </Eyebrow>
                            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                                Ben Zhou
                            </h1>
                            <p className="max-w-xl font-thin text-md text-white/65">
                                I like building{" "}
                                <b>elegant</b>, <b>efficient</b>, and{" "}
                                <b>scalable</b> software.
                            </p>
                        </m.div>
                        <m.div
                            className="mt-6 text-white sm:mt-8 lg:mt-0"
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.4 }}
                            transition={{
                                duration: 0.6,
                                delay: currentlyPlayingDelay,
                            }}
                        >
                            <CurrentlyPlaying
                                track={track}
                                isLoading={isLoading}
                                error={error}
                                currentProgress={currentProgress}
                            />
                        </m.div>
                    </div>
                    <m.div
                        className="flex flex-col min-w-0 gap-4"
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{
                            duration: 0.6,
                            delay: rolesHeadingDelay,
                        }}
                    >
                        <Eyebrow className="tracking-[0.2em] text-white/40">
                            Roles
                        </Eyebrow>
                        {recentRoles.map((role, index) => (
                            <RoleCard
                                key={role.company}
                                role={role}
                                animationDelay={
                                    roleCardBaseDelay + index * roleCardStep
                                }
                            />
                        ))}
                    </m.div>
                </div>
            </div>
            <div className="absolute flex-col items-center hidden -translate-x-1/2 lg:flex bottom-12 left-1/2 text-white/70">
                <m.button
                    type="button"
                    aria-label="Scroll to next section"
                    onClick={handleScrollClick}
                    className="flex flex-col items-center gap-1 p-2 transition-transform rounded-full cursor-pointer hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                >
                    {SCROLL_CHEVRONS.map((key, index) => (
                        <FiChevronDown
                            key={key}
                            className="-mt-4 size-6 animate-arrow-flicker text-white/30"
                            style={{
                                animationDelay: `${index * 0.3}s`,
                            }}
                        />
                    ))}
                </m.button>
            </div>
        </section>
    );
}
