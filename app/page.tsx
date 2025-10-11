"use client";
import Image from "next/image";
import Card from "@/components/Card";
import CompEng from "@/public/home/compeng.jpg";
import { motion } from "framer-motion";
import Experience from "@/components/Experience";
import CurrentlyPlaying from "@/components/CurrentlyPlaying";
import Golden from "@/components/Golden";
import { goldenPeople } from "@/data/goldenData";
import Link from "next/link";
import GrandCharterLogo from "@/public/experience/grandcharter.jpeg";
import FuegoLogo from "@/public/experience/fuego.webp";
import SAPLogo from "@/public/experience/SAP.png";

const recentRoles = [
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
    },
    {
        title: "Software Engineering Intern",
        company: "Fuego.io",
        location: "San Francisco",
        period: "Jan 2025 — Apr 2025",
        image: {
            src: FuegoLogo,
            alt: "Fuego logo",
        },
        locationClass: "text-[rgba(255,196,158,0.9)]",
        periodClass: "text-[rgba(255,220,200,0.85)]",
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
    },
];

export default function Home() {
    return (
        <>
            <section className="relative flex justify-center items-center h-[100vh]">
                <div className="absolute inset-0 bg-noir-gradient" />
                <div className="absolute inset-0 bg-noir-radial opacity-80" />
                <div className="relative flex w-11/12 max-w-[1080px] flex-col gap-16 text-white">
                    <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-start">
                        <div className="flex flex-col gap-8">
                            <div className="space-y-6">
                                <span className="text-xs uppercase tracking-[0.2em] text-white/50">
                                    Building software
                                </span>
                                <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                                    Ben Zhou
                                </h1>
                                <p className="max-w-xl font-thin text-md text-white/65">
                                    Engineering student at the University of
                                    Waterloo with a passion for building
                                    elegant, efficient, and scalable software.
                                </p>
                            </div>
                            <motion.div
                                className="text-white"
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.4 }}
                                transition={{ duration: 0.6 }}
                            >
                                <span className="text-xs uppercase tracking-[0.2em] text-white/40">
                                    Currently Listening
                                </span>
                                <div className="mt-4">
                                    <CurrentlyPlaying />
                                </div>
                            </motion.div>
                        </div>
                        <motion.div
                            className="flex flex-col gap-4"
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.4 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="text-xs uppercase tracking-[0.2em] text-white/40">
                                Roles
                            </span>
                            {recentRoles.map((role, index) => (
                                <Card
                                    key={role.company}
                                    variant="glass"
                                    ambient
                                    ambientSeed={`role-${index}`}
                                    ambientClassName="opacity-35"
                                    className="flex items-start gap-5 p-6"
                                >
                                    <Image
                                        src={role.image.src}
                                        alt={role.image.alt}
                                        width={56}
                                        height={56}
                                        className="object-contain rounded-lg h-14 w-14"
                                    />

                                    <div className="flex flex-col flex-1 gap-1 my-auto">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <h2 className="text-base font-medium text-white">
                                                {role.company}
                                            </h2>
                                            <span
                                                className={`text-xs uppercase tracking-[0.2em] ${
                                                    role.locationClass ??
                                                    "text-white/55"
                                                }`}
                                            >
                                                {role.location}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                                            <p className="font-extralight text-white/65">
                                                {role.title}
                                            </p>
                                            <span
                                                className={`text-xs uppercase tracking-[0.1em] ${
                                                    role.periodClass ??
                                                    "text-white/45"
                                                }`}
                                            >
                                                {role.period}
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="flex justify-center bg-[#050506] py-24 text-white">
                <div className="flex w-11/12 max-w-[1080px] flex-col gap-16 lg:flex-row lg:items-center">
                    <div className="flex-1 space-y-6">
                        <span className="text-xs uppercase tracking-[0.4em] text-white/40">
                            Operating cadence
                        </span>
                        <h2 className="text-3xl font-semibold">
                            I build end-to-end experiences that feel inevitable.
                        </h2>
                        <p className="text-sm text-white/60">
                            I obsess over architecture, latency, and the small
                            details that make products feel inevitable. Shipping
                            quickly without compromising craft is the default.
                        </p>
                        <div className="grid gap-4 text-sm text-white/60 sm:grid-cols-2">
                            <div className="p-4 border rounded-md border-white/10 bg-white/5">
                                <span className="text-xs uppercase tracking-[0.3em] text-white/40">
                                    Velocity
                                </span>
                                <p className="mt-2">
                                    48-hour prototype cycles, rapid iteration
                                    grounded in real usage.
                                </p>
                            </div>
                            <div className="p-4 border rounded-md border-white/10 bg-white/5">
                                <span className="text-xs uppercase tracking-[0.3em] text-white/40">
                                    Technical Range
                                </span>
                                <p className="mt-2">
                                    Web, firmware, systems, infrastructure. I
                                    jump layers to keep projects moving.
                                </p>
                            </div>
                            <div className="p-4 border rounded-md border-white/10 bg-white/5">
                                <span className="text-xs uppercase tracking-[0.3em] text-white/40">
                                    Product Taste
                                </span>
                                <p className="mt-2">
                                    Visual language tuned for modern tech
                                    brands; copy and interactions that convert.
                                </p>
                            </div>
                            <div className="p-4 border rounded-md border-white/10 bg-white/5">
                                <span className="text-xs uppercase tracking-[0.3em] text-white/40">
                                    Partnerships
                                </span>
                                <p className="mt-2">
                                    I collaborate with founding teams,
                                    investors, and students shipping ambitious
                                    hardware.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <Card
                            variant="glass"
                            ambient
                            ambientSeed="macroboard"
                            ambientClassName="opacity-50"
                            className="p-8 overflow-hidden"
                        >
                            <Image
                                className="object-contain w-full h-64 rounded-md"
                                width={489}
                                height={367}
                                src={CompEng}
                                alt="Macroboard internals"
                                loading="lazy"
                            />
                            <p className="mt-4 text-sm text-white/60">
                                Full-stack macroboard from PCB to firmware to
                                dashboard — shipped in 6 weeks. I build quickly
                                where others hesitate.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            <section className="flex justify-center bg-[#050506] py-24">
                <div className="flex w-11/12 max-w-[1080px] flex-col gap-10 text-white">
                    <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-[0.3em] text-white/40">
                            Proof of work
                        </span>
                        <Link
                            href="/projects"
                            className="text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white"
                        >
                            View all projects
                        </Link>
                    </div>
                    <Experience />
                </div>
            </section>

            <section className="flex justify-center bg-[#050506] py-24">
                <div className="w-11/12 max-w-[1080px]">
                    <Golden people={goldenPeople} />
                </div>
            </section>
        </>
    );
}
