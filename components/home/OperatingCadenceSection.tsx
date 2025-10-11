"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Card from "@/components/Card";
import CompEng from "@/public/home/compeng.jpg";

export default function OperatingCadenceSection() {
    return (
        <section
            id="home-next-section"
            className="relative flex items-center justify-center min-h-screen py-20 text-white home-section bg-noir-gradient-cool"
        >
            <div className="absolute inset-0 bg-noir-radial-cool opacity-80" />
            <div className="relative flex w-11/12 max-w-[1080px] flex-col gap-16 lg:flex-row lg:items-center">
                <motion.div
                    className="flex-1 space-y-6"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
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
                                Web, firmware, systems, infrastructure. I jump
                                layers to keep projects moving.
                            </p>
                        </div>
                        <div className="p-4 border rounded-md border-white/10 bg-white/5">
                            <span className="text-xs uppercase tracking-[0.3em] text-white/40">
                                Product Taste
                            </span>
                            <p className="mt-2">
                                Visual language tuned for modern tech brands;
                                copy and interactions that convert.
                            </p>
                        </div>
                        <div className="p-4 border rounded-md border-white/10 bg-white/5">
                            <span className="text-xs uppercase tracking-[0.3em] text-white/40">
                                Partnerships
                            </span>
                            <p className="mt-2">
                                I collaborate with founding teams, investors,
                                and students shipping ambitious hardware.
                            </p>
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    className="flex-1"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
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
                </motion.div>
            </div>
        </section>
    );
}
