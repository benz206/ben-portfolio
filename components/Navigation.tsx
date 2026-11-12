"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { m } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import { useNavigationCommands } from "@/components/CommandPalette/useNavigationCommands";

const links = [
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
    { href: "/gallery", label: "Gallery" },
];

export default function Navigation() {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const [prevPathname, setPrevPathname] = useState(pathname);
    const dialogRef = useRef<HTMLDialogElement>(null);
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
            setScrolled(Math.max(containerScroll, windowScroll) > 12);
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
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (isOpen && !dialog.open) dialog.showModal();
        if (!isOpen && dialog.open) dialog.close();
    }, [isOpen]);

    return (
        <nav className="site-nav fixed top-0 flex justify-center w-full z-60">
            <div
                className={`flex w-full justify-center transition-all duration-300 ${
                    scrolled ? "backdrop-blur bg-black/50" : "bg-transparent"
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
            <dialog
                ref={dialogRef}
                id="mobile-menu"
                aria-label="Menu"
                className="fixed inset-0 m-0 size-full max-h-none max-w-none items-center justify-center border-0 bg-black/70 p-0 text-white opacity-0 overscroll-contain touch-manipulation transition-[opacity,display,overlay] duration-150 transition-discrete open:flex open:opacity-100 starting:open:opacity-0 backdrop:overflow-hidden backdrop:overscroll-contain backdrop:bg-transparent"
                onClose={() => setIsOpen(false)}
                onClick={(e) => {
                    if (e.target === e.currentTarget) e.currentTarget.close();
                }}
            >
                <form
                    method="dialog"
                    className="pointer-events-none absolute inset-x-0 top-0 mx-auto flex h-16 w-11/12 max-w-270 items-center justify-end"
                >
                    <button
                        type="submit"
                        className="pointer-events-auto flex items-center justify-center size-11 rounded-md bg-transparent text-white/70 hover:text-white transition-colors duration-300 touch-manipulation cursor-pointer"
                        aria-label="Close menu"
                    >
                        <FiX size={18} />
                    </button>
                </form>
                <div className="flex flex-col items-center w-full max-w-sm gap-6 px-6">
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
                </div>
            </dialog>
        </nav>
    );
}
