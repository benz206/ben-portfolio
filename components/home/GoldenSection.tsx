"use client";

import { motion } from "framer-motion";
import Golden from "@/components/Golden";
import { goldenPeople } from "@/data/goldenData";

export default function GoldenSection() {
    return (
        <section className="home-section relative flex min-h-screen py-20 items-center justify-center bg-[#050506] text-white">
            <div className="absolute inset-0 opacity-75 bg-noir-radial" />
            <motion.div
                className="relative w-11/12 max-w-270"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <Golden people={goldenPeople} />
            </motion.div>
        </section>
    );
}
