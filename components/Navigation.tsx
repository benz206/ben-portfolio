"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import { useNavigationCommands } from "@/components/CommandPalette/useNavigationCommands";

const links = [
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
    { href: "/gallery", label: "Gallery" },
];

export default function Navigation() {
    const [scrollY, setScrollY] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const [prevPathname, setPrevPathname] = useState(pathname);
    useNavigationCommands();

    if (prevPathname !== pathname) {
        setPrevPathname(pathname);
        setIsOpen(false);
    }

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
        <nav className="fixed top-0 flex justify-center w-full z-60">
            <div
                className={`flex w-full justify-center transition-all duration-300 ${
                    offset ? "backdrop-blur bg-black/50" : "bg-transparent"
                }`}
            >
                <div className="flex items-center w-11/12 h-16 max-w-270">
                    <Link
                        href="/"
                        className="py-3 text-base font-medium text-white/80"
                    >
                        Home
                    </Link>
                    <div className="items-center hidden gap-8 ml-auto lg:flex">
                        {links.map((link) => (
                            <m.div key={link.href}>
                                <Link
                                    className="text-sm font-medium transition-colors duration-200 text-white/70 hover:text-white"
                                    href={link.href}
                                >
                                    {link.label}
                                </Link>
                            </m.div>
                        ))}
                        <m.div>
                            <Link
                                className="text-sm font-medium transition-colors duration-200 text-white/70 hover:text-white"
                                href="/resume.pdf"
                                target="_blank"
                            >
                                Résumé
                            </Link>
                        </m.div>
                    </div>
                    <div className="flex items-center gap-4 ml-auto lg:hidden">
                        <m.button
                            type="button"
                            className="flex items-center justify-center size-11 rounded-md bg-transparent text-white/70 hover:text-white transition-colors duration-300 touch-manipulation cursor-pointer"
                            onClick={() => setIsOpen((v) => !v)}
                            aria-expanded={isOpen}
                            aria-controls="mobile-menu"
                            aria-label={isOpen ? "Close menu" : "Open menu"}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="sr-only">
                                {isOpen ? "Close menu" : "Open menu"}
                            </span>
                            {isOpen ? <FiX size={18} /> : <FiMenu size={18} />}
                        </m.button>
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <m.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 lg:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, pointerEvents: "none" }}
                        transition={{ duration: 0.15 }}
                        style={{ touchAction: "manipulation" }}
                        onClick={(e) => {
                            if (e.target === e.currentTarget) setIsOpen(false);
                        }}
                    >
                        <div
                            className="flex flex-col items-center w-full max-w-sm gap-6 px-6"
                            id="mobile-menu"
                        >
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    className="text-2xl font-semibold text-white touch-manipulation"
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Link
                                className="text-2xl font-semibold text-white touch-manipulation"
                                href="/resume.pdf"
                                target="_blank"
                                onClick={() => setIsOpen(false)}
                            >
                                Résumé
                            </Link>
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
