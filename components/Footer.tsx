"use client";
import { ImGithub } from "react-icons/im";
import { FaLinkedin, FaDiscord, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiMonkeytype } from "react-icons/si";
import { motion } from "framer-motion";

const motionProps = {
    initial: { scale: 1 },
    whileHover: { scale: 1.2 },
    transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20,
    },
    whileTap: { scale: 0.9 },
} as const;

export default function Footer() {
    return (
        <footer className="flex justify-center border-t border-white/5 bg-[#050506] py-16">
            <div className="flex w-11/12 max-w-[1080px] flex-col gap-12 lg:flex-row lg:items-center">
                <div className="flex-1 space-y-4 text-white/70">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.4em] text-white/50">
                        Stay in touch
                    </h2>
                    <p className="text-sm leading-relaxed text-white/60">
                        If you&apos;re building something ambitious or just want to jam on ideas,
                        drop me a note any time.
                    </p>
                    <div className="text-sm font-medium text-white">
                        ben.zhou@uwaterloo.ca
                    </div>
                    <div className="text-xs text-white/40">
                        © {new Date().getFullYear()} Ben Zhou. All rights reserved.
                    </div>
                </div>
                <div className="flex flex-1 flex-col gap-6">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.4em] text-white/50">
                        Around the web
                    </h2>
                    <div className="flex flex-wrap gap-4 text-white/70">
                        <motion.a
                            {...motionProps}
                            className="flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-white/5 text-lg text-white/70 transition-colors hover:text-white"
                            href="https://x.com/bennyz206"
                            target="_blank"
                        >
                            <FaXTwitter />
                        </motion.a>
                        <motion.a
                            {...motionProps}
                            className="flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-white/5 text-lg text-white/70 transition-colors hover:text-white"
                            href="https://www.linkedin.com/in/ben-zhou06/"
                            target="_blank"
                        >
                            <FaLinkedin />
                        </motion.a>
                        <motion.a
                            {...motionProps}
                            className="flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-white/5 text-lg text-white/70 transition-colors hover:text-white"
                            href="https://github.com/benz206"
                            target="_blank"
                        >
                            <ImGithub />
                        </motion.a>
                        <motion.a
                            {...motionProps}
                            className="flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-white/5 text-lg text-white/70 transition-colors hover:text-white"
                            href="https://discord.com/users/360061101477724170"
                            target="_blank"
                        >
                            <FaDiscord />
                        </motion.a>
                        <motion.a
                            {...motionProps}
                            className="flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-white/5 text-lg text-white/70 transition-colors hover:text-white"
                            href="https://www.instagram.com/bennyz_06/"
                            target="_blank"
                        >
                            <FaInstagram />
                        </motion.a>
                        <motion.a
                            {...motionProps}
                            className="flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-white/5 text-lg text-white/70 transition-colors hover:text-white"
                            href="https://monkeytype.com/profile/_Leg3ndary"
                            target="_blank"
                        >
                            <SiMonkeytype />
                        </motion.a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
