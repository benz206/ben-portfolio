"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigationCommands } from "@/components/CommandPalette/useNavigationCommands";

const links = [
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
    { href: "/gallery", label: "Gallery" }
];

export default function Navigation() {
    const [scrollY, setScrollY] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    useNavigationCommands();

    useEffect(() => {
        const container = document.querySelector(".home-scroll");

        function updateScroll() {
            const containerScroll =
                container instanceof HTMLElement ? container.scrollTop : 0;
            const windowScroll = window.scrollY;
            setScrollY(Math.max(containerScroll, windowScroll));
        }

        updateScroll();

        window.addEventListener("scroll", updateScroll, { passive: true });

        if (container instanceof HTMLElement) {
            container.addEventListener("scroll", updateScroll, {
                passive: true,
            });
        }

        return () => {
            window.removeEventListener("scroll", updateScroll);
            if (container instanceof HTMLElement) {
                container.removeEventListener("scroll", updateScroll);
            }
        };
    }, [pathname]);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (!isOpen) return;
        const prev = document.documentElement.style.overflow;
        document.documentElement.style.overflow = "hidden";

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.documentElement.style.overflow = prev;
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [isOpen]);

    const offset = scrollY > 12;

    return (
        <nav className="flex fixed top-0 z-40 justify-center w-full">
            <div
                className={`flex w-full justify-center transition-all duration-300 ${
                    offset ? "backdrop-blur bg-black/50" : "bg-transparent"
                }`}
            >
                <div className="flex h-16 w-11/12 max-w-[1080px] items-center">
                    <Link
                        href="/"
                        className="py-3 text-base font-medium text-white/80"
                    >
                        Home
                    </Link>
                    <div className="hidden gap-8 items-center ml-auto lg:flex">
                        {links.map((link) => (
                            <motion.div key={link.href}>
                                <Link
                                    className="text-sm font-medium transition-colors duration-200 text-white/70 hover:text-white"
                                    href={link.href}
                                >
                                    {link.label}
                                </Link>
                            </motion.div>
                        ))}
                        <motion.div>
                            <Link
                                className="text-sm font-medium transition-colors duration-200 text-white/70 hover:text-white"
                                href="/resume.pdf"
                                target="_blank"
                            >
                                Résumé
                            </Link>
                        </motion.div>
                    </div>
                    <div className="flex gap-4 items-center ml-auto lg:hidden">
                        <button
                            type="button"
                            className="flex relative justify-center items-center w-10 h-10 rounded-md border border-white/10 bg-white/5"
                            onClick={() => setIsOpen((v) => !v)}
                            aria-expanded={isOpen}
                            aria-controls="mobile-menu"
                            aria-label={isOpen ? "Close menu" : "Open menu"}
                        >
                            <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
                            <div className="relative w-6 h-5">
                                <div className={`absolute left-0 top-0 h-[2px] w-full rounded-full bg-white transition-[transform,opacity] duration-200 ease-in-out origin-center transform-gpu will-change-transform ${isOpen ? "rotate-45 translate-y-[9px]" : ""}`} />
                                <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-[2px] w-full rounded-full bg-white transition-[transform,opacity] duration-200 ease-in-out origin-center transform-gpu will-change-transform ${isOpen ? "opacity-0" : "opacity-100"}`} />
                                <div className={`absolute left-0 bottom-0 h-[2px] w-full rounded-full bg-white transition-[transform,opacity] duration-200 ease-in-out origin-center transform-gpu will-change-transform ${isOpen ? "-rotate-45 -translate-y-[9px]" : ""}`} />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="flex fixed inset-0 z-50 justify-center items-center bg-black/70 lg:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, pointerEvents: "none" }}
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            className="flex flex-col gap-6 items-center px-6 w-full max-w-sm"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 10, opacity: 0, pointerEvents: "none" }}
                            onClick={(e) => e.stopPropagation()}
                            id="mobile-menu"
                        >
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    className="text-2xl font-semibold text-white"
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Link
                                className="text-2xl font-semibold text-white"
                                href="/resume.pdf"
                                target="_blank"
                                onClick={() => setIsOpen(false)}
                            >
                                Résumé
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
