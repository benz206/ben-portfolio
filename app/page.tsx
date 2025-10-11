"use client";
import Image from "next/image";
import Card from "@/components/Card";
import Mocha from "@/public/home/mocha.png";
import CompEng from "@/public/home/compeng.jpg";
import { motion } from "framer-motion";
import Experience from "@/components/Experience";
import TechIcon from "@/components/TechIcon";
import CurrentlyPlaying from "@/components/CurrentlyPlaying";
import Golden from "@/components/Golden";
import { goldenPeople } from "@/data/goldenData";
import Link from "next/link";

export default function Home() {
    return (
        <>
            <section className="relative flex justify-center items-center h-[100vh]">
                <div className="absolute inset-0 bg-noir-gradient" />
                <div className="absolute inset-0 bg-noir-radial opacity-80" />
                <div className="relative flex w-11/12 max-w-[1080px] flex-col gap-16 text-white">
                    <div className="flex flex-col gap-12 lg:flex-row lg:items-center">
                        <div className="flex-1 space-y-6">
                            <span className="text-xs uppercase tracking-[0.5em] text-white/50">
                                Building products faster than the deadline
                            </span>
                            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                                Ben Zhou — engineer, founder, relentless
                                builder.
                            </h1>
                            <p className="max-w-xl text-sm text-white/65">
                                I architect and ship software and hardware for
                                teams moving at venture speed. Focused on
                                zero-to-one execution, thoughtful design, and
                                systems that scale.
                            </p>
                            <div className="flex flex-wrap gap-4 text-xs text-white/60">
                                <span className="rounded-full border border-white/10 px-4 py-2 uppercase tracking-[0.3em]">
                                    Product Engineering
                                </span>
                                <span className="rounded-full border border-white/10 px-4 py-2 uppercase tracking-[0.3em]">
                                    Firmware
                                </span>
                                <span className="rounded-full border border-white/10 px-4 py-2 uppercase tracking-[0.3em]">
                                    Design Systems
                                </span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <Card
                                variant="glass"
                                ambient
                                ambientSeed="currently-shipping"
                                ambientClassName="opacity-50"
                                className="relative p-8 overflow-hidden"
                            >
                                <div className="flex justify-end">
                                    <span className="text-xs uppercase tracking-[0.4em] text-white/40">
                                        Currently shipping
                                    </span>
                                </div>
                                <div className="flex items-center gap-6 mt-6">
                                    <Image
                                        className="object-cover w-32 h-32 rounded-md"
                                        src={Mocha}
                                        alt="Mocha robot"
                                    />
                                    <div className="space-y-3 text-white">
                                        <h2 className="text-xl font-semibold">
                                            Autonomous robotics labs
                                        </h2>
                                        <p className="text-sm text-white/60">
                                            Prototyping modular robotics tools
                                            that bridge firmware, ML vision, and
                                            real-world reliability.
                                        </p>
                                        <div className="flex gap-2 text-xs text-white/40">
                                            <span>Next.js</span>
                                            <span>TypeScript</span>
                                            <span>ESP32</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                    <motion.div
                        className="grid gap-6 text-white"
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex flex-wrap gap-6">
                            <Card
                                variant="glass"
                                ambient
                                ambientSeed="waterloo"
                                ambientClassName="opacity-40"
                                className="flex-1 min-w-[260px] p-6"
                            >
                                <span className="text-xs uppercase tracking-[0.3em] text-white/40">
                                    Waterloo Computer Engineering
                                </span>
                                <h3 className="mt-3 text-lg font-semibold text-white">
                                    Speedrunning hardware and software
                                    fundamentals.
                                </h3>
                                <p className="mt-4 text-sm text-white/60">
                                    From low-level systems to cloud infra, I
                                    build across the stack and bring product
                                    taste to every layer.
                                </p>
                            </Card>
                            <Card
                                variant="glass"
                                ambient
                                ambientSeed="currently-listening"
                                ambientClassName="opacity-40"
                                className="flex-1 min-w-[260px] p-6"
                            >
                                <span className="text-xs uppercase tracking-[0.3em] text-white/40">
                                    Currently Listening
                                </span>
                                <CurrentlyPlaying />
                            </Card>
                        </div>
                        <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-white/40">
                            <span>Stacks I trust</span>
                            <div className="flex flex-wrap gap-4 text-white/60">
                                <TechIcon
                                    name="UofW"
                                    image="https://i.imgur.com/qtXlwL6.png"
                                    link="https://www.uwaterloo.ca/"
                                    size="lg"
                                />
                                <TechIcon
                                    name="NextJS"
                                    image="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg"
                                    link="https://nextjs.org/"
                                    size="lg"
                                />
                                <TechIcon
                                    name="TypeScript"
                                    image="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"
                                    link="https://www.typescriptlang.org/"
                                    size="lg"
                                />
                                <TechIcon
                                    name="TailwindCSS"
                                    image="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg"
                                    link="https://tailwindcss.com/"
                                    size="lg"
                                />
                            </div>
                        </div>
                    </motion.div>
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
                                className="object-cover w-full h-64 rounded-md"
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
