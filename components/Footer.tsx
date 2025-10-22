"use client";

import Link from "next/link";
import { ImGithub } from "react-icons/im";
import { FaLinkedin, FaDiscord, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiMonkeytype } from "react-icons/si";
import { motion } from "framer-motion";
import { AmbientGradient } from "@/components/AmbientGradient";

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
                        {socials.map(({ href, icon: Icon, label, seed }) => (
                            <motion.a
                                key={href}
                                {...motionProps}
                                className="group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-md border border-white/30 bg-transparent text-lg text-white/70 transition-colors duration-300 hover:border-white/60 hover:text-white"
                                href={href}
                                target="_blank"
                                aria-label={label}
                            >
                                <AmbientGradient
                                    className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                    seed={seed}
                                />
                                <span className="relative z-10 transition-opacity duration-300 group-hover:opacity-90">
                                    <Icon />
                                </span>
                            </motion.a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
