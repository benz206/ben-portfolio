"use client";

import { useEffect, useState, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/cn";

type Heading = { level: number; text: string; id: string };

function H2Icon({ className }: { className?: string }) {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className={className}
            aria-hidden="true"
        >
            <path
                d="M2 3h10M2 7h7M2 11h9"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
            />
        </svg>
    );
}

function H3Icon({ className }: { className?: string }) {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className={className}
            aria-hidden="true"
        >
            <path
                d="M4 5h6M4 9h5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
            />
        </svg>
    );
}

function TOCNav({
    headings,
    activeId,
    onSelect,
}: {
    headings: Heading[];
    activeId: string;
    onSelect: (id: string) => void;
}) {
    return (
        <nav aria-label="Table of contents">
            <p className="mb-4 text-[11px] uppercase tracking-[0.15em] text-white/30">
                On this page
            </p>
            <ul className="relative list-none space-y-1">
                {headings.map(({ id, text, level }) => {
                    const isActive = activeId === id;
                    const Icon = level === 3 ? H3Icon : H2Icon;
                    return (
                        <li key={id} className="relative">
                            {isActive && (
                                <div className="absolute left-0 top-0.5 bottom-0.5 w-0.5 rounded-full bg-white/70" />
                            )}
                            <button
                                onClick={() => onSelect(id)}
                                className={cn(
                                    "flex w-full items-center gap-1.5 text-left text-[13px] leading-snug transition-colors duration-150",
                                    level === 3 ? "pl-4" : "pl-2.5",
                                    isActive
                                        ? "text-white"
                                        : "text-white/38 hover:text-white/65",
                                )}
                            >
                                <Icon
                                    className={cn(
                                        "shrink-0 transition-colors duration-150",
                                        isActive
                                            ? "text-white/70"
                                            : "text-white/25",
                                    )}
                                />
                                <span>{text}</span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

export default function TableOfContents({
    headings,
}: {
    headings: Heading[];
}) {
    const [activeId, setActiveId] = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);
    const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

    useEffect(() => {
        if (headings.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort(
                        (a, b) =>
                            a.boundingClientRect.top -
                            b.boundingClientRect.top,
                    );
                if (visible.length > 0) {
                    setActiveId(visible[0].target.id);
                }
            },
            { rootMargin: "-10% 0% -75% 0%", threshold: 0 },
        );

        headings.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [headings]);

    const scrollTo = useCallback((id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        setMobileOpen(false);
    }, []);

    const mobileUI = (
        <>
            <button
                onClick={() => setMobileOpen(true)}
                aria-label="Open table of contents"
                className="fixed bottom-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/70 backdrop-blur transition-colors hover:bg-white/15 lg:hidden"
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                >
                    <path
                        d="M2 4h12M2 8h8M2 12h10"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                </svg>
            </button>

            {mobileOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={() => setMobileOpen(false)}
                    aria-hidden="true"
                />
            )}

            <div
                className={cn(
                    "fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border-t border-white/10 bg-[#0d0f16] px-6 pb-8 pt-5 transition-transform duration-300 lg:hidden",
                    mobileOpen ? "translate-y-0" : "translate-y-full",
                )}
                aria-hidden={!mobileOpen}
            >
                <div className="mb-5 flex items-center justify-between">
                    <span className="text-sm font-medium text-white/80">
                        On this page
                    </span>
                    <button
                        onClick={() => setMobileOpen(false)}
                        aria-label="Close table of contents"
                        className="text-white/40 transition-colors hover:text-white/70"
                    >
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="M1 1l12 12M13 1L1 13"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                </div>
                <div className="max-h-72 overflow-y-auto">
                    <nav aria-label="Table of contents">
                        <ul className="list-none space-y-3">
                            {headings.map(({ id, text, level }) => {
                                const Icon = level === 3 ? H3Icon : H2Icon;
                                return (
                                    <li key={id}>
                                        <button
                                            onClick={() => scrollTo(id)}
                                            className={cn(
                                                "flex w-full items-center gap-2 text-left text-sm",
                                                level === 3
                                                    ? "pl-4 text-white/50"
                                                    : "text-white/70",
                                            )}
                                        >
                                            <Icon className="shrink-0 text-white/40" />
                                            <span>{text}</span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );

    return (
        <>
            <div className="sticky top-24">
                <TOCNav
                    headings={headings}
                    activeId={activeId}
                    onSelect={scrollTo}
                />
            </div>

            {mounted && createPortal(mobileUI, document.body)}
        </>
    );
}
