"use client";

import {
    useEffect,
    useRef,
    useState,
    useCallback,
    useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/cn";

type Heading = { level: number; text: string; id: string };

function TOCNav({
    headings,
    activeId,
    onSelect,
}: {
    headings: Heading[];
    activeId: string;
    onSelect: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
}) {
    return (
        <nav aria-label="Table of contents">
            <ul className="ml-0 list-none border-l border-white/10">
                {headings.map(({ id, text, level }) => {
                    const isActive = activeId === id;
                    return (
                        <li key={id} className="py-1">
                            <a
                                href={`#${id}`}
                                onClick={(e) => onSelect(e, id)}
                                aria-current={isActive ? "location" : undefined}
                                className={cn(
                                    "-ml-px border-l text-[13px] leading-[18px] transition-colors duration-150 line-clamp-2 [overflow-wrap:anywhere]",
                                    level === 3 ? "pl-6" : "pl-3",
                                    isActive
                                        ? "border-white/80 text-white"
                                        : "border-transparent text-white/40 hover:text-white/75",
                                )}
                            >
                                {text}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

export default function TableOfContents({ headings }: { headings: Heading[] }) {
    const [activeId, setActiveId] = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);
    const mounted = useSyncExternalStore(
        () => () => {},
        () => true,
        () => false,
    );
    const manualScrollTarget = useRef<string | null>(null);
    const scrollEndTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = sidebarRef.current;
        const link = container?.querySelector<HTMLElement>(
            '[aria-current="location"]',
        );
        if (!container || !link) return;
        const top =
            link.offsetTop - container.clientHeight / 2 + link.offsetHeight / 2;
        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;
        container.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
    }, [activeId]);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (mobileOpen && !dialog.open) dialog.showModal();
        else if (!mobileOpen && dialog.open) dialog.close();
    }, [mobileOpen]);

    useEffect(() => {
        if (headings.length === 0) return;

        // Walk headings top-to-bottom; the last one whose top edge is at or
        // above 25% of the viewport is the "current" section.
        const computeActiveId = (): string => {
            const threshold = window.innerHeight * 0.25;
            let current = headings[0].id;
            for (const { id } of headings) {
                const el = document.getElementById(id);
                if (!el) continue;
                if (el.getBoundingClientRect().top <= threshold) {
                    current = id;
                } else {
                    break;
                }
            }
            return current;
        };

        const handleScroll = () => {
            if (manualScrollTarget.current !== null) {
                // Still in a click-triggered scroll — debounce the lock release.
                if (scrollEndTimer.current)
                    clearTimeout(scrollEndTimer.current);
                scrollEndTimer.current = setTimeout(() => {
                    manualScrollTarget.current = null;
                    setActiveId(computeActiveId());
                }, 150);
                return;
            }
            setActiveId(computeActiveId());
        };

        // Seed active state after the first paint so the DOM is laid out.
        const raf = requestAnimationFrame(() => setActiveId(computeActiveId()));

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("scroll", handleScroll);
            if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current);
        };
    }, [headings]);

    const scrollTo = useCallback(
        (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            e.preventDefault();
            dialogRef.current?.close();
            setActiveId(id);
            manualScrollTarget.current = id;
            const el = document.getElementById(id);
            if (el) {
                const reduceMotion = window.matchMedia(
                    "(prefers-reduced-motion: reduce)",
                ).matches;
                el.scrollIntoView({
                    behavior: reduceMotion ? "auto" : "smooth",
                    block: "start",
                });
            }
            history.pushState(null, "", `#${id}`);
        },
        [],
    );

    const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
        if ("closedBy" in HTMLDialogElement.prototype) return;
        const dialog = e.currentTarget;
        if (e.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const inside =
            rect.top <= e.clientY &&
            e.clientY <= rect.bottom &&
            rect.left <= e.clientX &&
            e.clientX <= rect.right;
        if (!inside) dialog.close();
    };

    const mobileUI = (
        <>
            <button
                onClick={() => setMobileOpen(true)}
                aria-label="Open table of contents"
                className="fixed bottom-[calc(1.5rem+var(--soundtrack-offset,0px))] right-6 z-40 flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/70 backdrop-blur transition-colors hover:bg-white/15 lg:hidden"
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

            <dialog
                ref={dialogRef}
                aria-labelledby="toc-dialog-title"
                onClose={() => setMobileOpen(false)}
                onClick={handleDialogClick}
                {...({ closedby: "any" } as Record<string, string>)}
                className="inset-x-0 top-auto bottom-0 m-0 w-full max-w-none overscroll-contain rounded-t-2xl border-t border-white/10 bg-[#0d0f16] px-6 pb-8 pt-5 transition-[translate,display,overlay] transition-discrete duration-300 backdrop:overflow-hidden backdrop:overscroll-contain backdrop:bg-black/60 backdrop:backdrop-blur-sm motion-safe:translate-y-full motion-safe:open:translate-y-0 motion-safe:starting:open:translate-y-full"
            >
                <div className="mb-5 flex items-center justify-between">
                    <span
                        id="toc-dialog-title"
                        className="text-sm font-medium text-white/80"
                    >
                        On this page
                    </span>
                    <button
                        onClick={() => dialogRef.current?.close()}
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
                <div className="max-h-[60vh] overflow-y-auto overscroll-contain">
                    <TOCNav
                        headings={headings}
                        activeId={activeId}
                        onSelect={scrollTo}
                    />
                </div>
            </dialog>
        </>
    );

    return (
        <>
            <div className="sticky top-24 flex max-h-[calc(100vh-8rem)] flex-col">
                <p className="mb-3 text-[11px] uppercase tracking-[0.15em] text-white/35">
                    On this page
                </p>
                <div
                    ref={sidebarRef}
                    className="relative min-h-0 overflow-y-auto overscroll-contain pt-2 pb-10 pr-3 [scrollbar-width:none] [mask-image:linear-gradient(to_bottom,transparent,black_12px,black_calc(100%-40px),transparent)]"
                >
                    <TOCNav
                        headings={headings}
                        activeId={activeId}
                        onSelect={scrollTo}
                    />
                </div>
            </div>

            {mounted && createPortal(mobileUI, document.body)}
        </>
    );
}
