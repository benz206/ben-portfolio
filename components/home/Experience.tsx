"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Experience from "@/components/Experience";

export default function ExperienceSection() {
    return (
        <section className="flex relative justify-center items-center py-20 min-h-screen text-white home-section bg-noir-gradient-warm">
            <div className="absolute inset-0 opacity-75 bg-noir-radial-warm" />
            <div className="relative flex w-11/12 max-w-270 flex-col gap-10">
                <motion.div
                    className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <span className="text-xs uppercase tracking-[0.3em] text-white/40">
                        Experience
                    </span>
                    <Link
                        href="/projects"
                        className="text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white"
                    >
                        View all projects
                    </Link>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <Experience />
                </motion.div>
            </div>
        </section>
    );
}
