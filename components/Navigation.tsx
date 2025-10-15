"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const motionAnim = {
    whileHover: { scale: 1.1 },
    transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 10,
    },
    whileTap: { scale: 0.9 },
} as const;

const links = [
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
    { href: "/gallery", label: "Gallery" },
    { href: "/github", label: "GitHub" },
];

export default function Navigation() {
    const [scrollY, setScrollY] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const hamburger =
        "h-[2px] w-6 my-1 rounded-full bg-white transition ease transform duration-300";

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
    const offset = scrollY > 12;

    return (
        <nav className="fixed top-0 z-40 flex justify-center w-full">
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
                    <div className="items-center hidden gap-8 ml-auto lg:flex">
                        {links.map((link) => (
                            <motion.div key={link.href} {...motionAnim}>
                                <Link
                                    className="text-sm font-medium transition-colors duration-200 text-white/70 hover:text-white"
                                    href={link.href}
                                >
                                    {link.label}
                                </Link>
                            </motion.div>
                        ))}
                        <motion.div {...motionAnim}>
                            <Link
                                className="text-sm font-medium transition-colors duration-200 text-white/70 hover:text-white"
                                href="/resume.pdf"
                                target="_blank"
                            >
                                Résumé
                            </Link>
                        </motion.div>
                    </div>
                    <div className="flex items-center gap-4 ml-auto lg:hidden">
                        <button
                            className="flex flex-col items-center justify-center w-10 h-10 border rounded-md border-white/10 bg-white/5"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <div
                                className={`${hamburger} ${
                                    isOpen ? "translate-y-[7px] rotate-45" : ""
                                }`}
                            />
                            <div
                                className={`${hamburger} ${
                                    isOpen ? "opacity-0" : ""
                                }`}
                            />
                            <div
                                className={`${hamburger} ${
                                    isOpen
                                        ? "-translate-y-[7px] -rotate-45"
                                        : ""
                                }`}
                            />
                        </button>
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="absolute top-16 right-[max(1.5rem,calc((100vw-100%)/2+1.5rem))] flex w-[min(18rem,90vw-2rem)] flex-col rounded-2xl border border-white/10 bg-[#050506]/95 px-6 py-6 shadow-lg lg:hidden"
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                    >
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                className="py-3 text-base font-medium text-white/80"
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            className="py-3 text-base font-medium text-white/80"
                            href="/resume.pdf"
                            target="_blank"
                            onClick={() => setIsOpen(false)}
                        >
                            Résumé
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
