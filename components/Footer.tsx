"use client";

import Link from "next/link";
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
                    <p className="text-sm font-thin leading-relaxed text-white/60">
                        If you want to talk, message me anytime{" "}
                        <a
                            href="mailto:ben.zhou@uwaterloo.ca"
                            className="underline underline-offset-auto"
                        >
                            @ben.zhou@uwaterloo.ca
                        </a>
                        .{" "}
                        <Link
                            href="/;thanks"
                            className="underline underline-offset-auto"
                        >
                            Thanks.
                        </Link>
                    </p>
                    <div className="text-xs font-thin text-white/40">
                        © {new Date().getFullYear()} Ben Zhou
                    </div>
                </div>
                <div className="flex flex-col flex-1 gap-6">
                    <div className="flex flex-wrap gap-4 text-white/70">
                        <motion.a
                            {...motionProps}
                            className="flex items-center justify-center text-lg transition-colors border rounded-md h-11 w-11 border-white/10 bg-white/5 text-white/70 hover:text-white"
                            href="https://x.com/bennyz206"
                            target="_blank"
                        >
                            <FaXTwitter />
                        </motion.a>
                        <motion.a
                            {...motionProps}
                            className="flex items-center justify-center text-lg transition-colors border rounded-md h-11 w-11 border-white/10 bg-white/5 text-white/70 hover:text-white"
                            href="https://www.linkedin.com/in/ben-zhou06/"
                            target="_blank"
                        >
                            <FaLinkedin />
                        </motion.a>
                        <motion.a
                            {...motionProps}
                            className="flex items-center justify-center text-lg transition-colors border rounded-md h-11 w-11 border-white/10 bg-white/5 text-white/70 hover:text-white"
                            href="https://github.com/benz206"
                            target="_blank"
                        >
                            <ImGithub />
                        </motion.a>
                        <motion.a
                            {...motionProps}
                            className="flex items-center justify-center text-lg transition-colors border rounded-md h-11 w-11 border-white/10 bg-white/5 text-white/70 hover:text-white"
                            href="https://discord.com/users/360061101477724170"
                            target="_blank"
                        >
                            <FaDiscord />
                        </motion.a>
                        <motion.a
                            {...motionProps}
                            className="flex items-center justify-center text-lg transition-colors border rounded-md h-11 w-11 border-white/10 bg-white/5 text-white/70 hover:text-white"
                            href="https://www.instagram.com/bennyz_06/"
                            target="_blank"
                        >
                            <FaInstagram />
                        </motion.a>
                        <motion.a
                            {...motionProps}
                            className="flex items-center justify-center text-lg transition-colors border rounded-md h-11 w-11 border-white/10 bg-white/5 text-white/70 hover:text-white"
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
