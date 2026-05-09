"use client";

import { m } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import CurrentlyPlaying from "@/components/CurrentlyPlaying";
import { useCurrentlyPlaying } from "@/components/useCurrentlyPlaying";
import FuegoLogo from "@/public/experience/fuego.webp";
import GrandCharterLogo from "@/public/experience/grandcharter.jpeg";
import SAPLogo from "@/public/experience/SAP.png";
import RoleCard, { type RoleCardData } from "@/components/home/RoleCard";
import { useScrollToSection } from "@/utils/hooks";

const recentRoles: RoleCardData[] = [
    {
        title: "Software Engineering Intern",
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
    },
    {
        title: "Software Engineering Intern",
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
    },
    {
        title: "Software Developer",
        company: "SAP",
        location: "Toronto",
        period: "Feb 2024 - Jul 2024",
        image: {
            src: SAPLogo,
            alt: "SAP Logo",
        },
        locationClass: "text-[rgba(170,210,255,0.9)]",
        periodClass: "text-[rgba(195,230,255,0.85)]",
        ambientVariant: "blue",
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

    const albumColor = track?.color;

    return (
        <section className="flex overflow-hidden relative justify-center items-center pt-24 pb-20 home-section sm:pb-20 sm:pt-28 lg:h-dvh lg:pb-0 lg:pt-0">
            <div className="absolute inset-0 bg-noir-gradient" />
            <div className="absolute inset-0 opacity-80 bg-noir-radial" />
            {albumColor && (
                <m.div
                    className="absolute pointer-events-none rounded-full"
                    style={{
                        left: "-10%",
                        bottom: "-5%",
                        width: "700px",
                        height: "700px",
                        filter: "blur(40px)",
                    }}
                    animate={{
                        backgroundColor: `rgb(${albumColor[0]}, ${albumColor[1]}, ${albumColor[2]})`,
                        opacity: 0.14,
                    }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                />
            )}
            <div className="relative flex w-full max-w-270 flex-col gap-12 px-4 text-white sm:px-6 lg:w-11/12 lg:gap-16">
                <div className="grid gap-10 sm:gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-start">
                    <div className="flex flex-col gap-0 lg:gap-8 min-w-0">
                        <m.div
                            className="space-y-2 lg:space-y-6"
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.4 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <span className="text-xs uppercase tracking-[0.2em] text-white/50">
                                Building Software
                            </span>
                            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                                Ben Zhou
                            </h1>
                            <p className="max-w-xl font-thin text-md text-white/65">
                                Engineering student at the University of
                                Waterloo with a passion for building{" "}
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
                        className="flex flex-col gap-4 min-w-0"
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{
                            duration: 0.6,
                            delay: rolesHeadingDelay,
                        }}
                    >
                        <span className="text-xs uppercase tracking-[0.2em] text-white/40">
                            Roles
                        </span>
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
            <div className="hidden lg:flex absolute bottom-12 left-1/2 flex-col items-center -translate-x-1/2 text-white/70">
                <m.button
                    type="button"
                    aria-label="Scroll to next section"
                    onClick={handleScrollClick}
                    className="flex flex-col gap-1 items-center p-2 rounded-full transition-transform cursor-pointer hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                >
                    {[0, 1, 2].map((index) => (
                        <FiChevronDown
                            key={`chevron-${index}`}
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
