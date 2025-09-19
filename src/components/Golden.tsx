import { useMemo, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";

interface GoldenPerson {
    name: string;
    description: string;
}

interface GoldenProps {
    people: GoldenPerson[];
}

function getShortDescription(text: string, maxLength: number = 120): string {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    const truncated = text.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");
    return (
        (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated).trim() + "…"
    );
}

function hashString(input: string): number {
    let hash = 2166136261;
    for (let i = 0; i < input.length; i += 1) {
        hash ^= input.charCodeAt(i);
        hash +=
            (hash << 1) +
            (hash << 4) +
            (hash << 7) +
            (hash << 8) +
            (hash << 24);
    }
    return hash >>> 0;
}

export default function Golden({ people }: GoldenProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [isPaused, setIsPaused] = useState(false);
    const rowRefs = useRef<Array<HTMLDivElement | null>>([]);
    const timelinesRef = useRef<gsap.core.Timeline[]>([]);

    const shuffledPeople = useMemo(
        () =>
            [...people].sort((a, b) => hashString(a.name) - hashString(b.name)),
        [people]
    );
    const ROWS_COUNT = 3;
    const rows = useMemo(() => {
        const chunks: GoldenPerson[][] = [];
        const total = shuffledPeople.length;
        const base = Math.floor(total / ROWS_COUNT);
        const remainder = total % ROWS_COUNT;
        let start = 0;
        for (let r = 0; r < ROWS_COUNT; r += 1) {
            const size = base + (r < remainder ? 1 : 0);
            chunks.push(shuffledPeople.slice(start, start + size));
            start += size;
        }
        return chunks.filter((row) => row.length > 0);
    }, [shuffledPeople]);
    const rowOffsets = useMemo(
        () =>
            rows.map((_, idx) =>
                rows.slice(0, idx).reduce((acc, r) => acc + r.length, 0)
            ),
        [rows]
    );

    useEffect(() => {
        const style = document.createElement("style");
        style.textContent = `
            .fade-mask {
                -webkit-mask-image: linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1) 7%, rgba(0,0,0,1) 93%, rgba(0,0,0,0));
                mask-image: linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1) 7%, rgba(0,0,0,1) 93%, rgba(0,0,0,0));
                -webkit-mask-repeat: no-repeat;
                mask-repeat: no-repeat;
                -webkit-mask-size: 100% 100%;
                mask-size: 100% 100%;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    function horizontalLoop(
        items: Element[] | NodeListOf<Element>,
        config: any = {}
    ) {
        const tl = gsap.timeline({
            repeat: config.repeat,
            paused: config.paused,
            defaults: { ease: "none" },
            onReverseComplete: () => {
                tl.totalTime(tl.rawTime() + tl.duration() * 100);
            },
        });
        const elements = gsap.utils.toArray(items) as HTMLElement[];
        const length = elements.length;
        if (length === 0) return tl;
        const startX = elements[0].offsetLeft;
        const times: number[] = [];
        const widths: number[] = [];
        const xPercents: number[] = [];
        let curIndex = 0;
        const pixelsPerSecond = (config.speed || 1) * 100;
        const snap =
            config.snap === false
                ? (v: number) => v
                : gsap.utils.snap(config.snap || 1);
        let totalWidth: number;
        let curX: number;
        let distanceToStart: number;
        let distanceToLoop: number;

        gsap.set(elements, {
            xPercent: (i: number, el: HTMLElement) => {
                const w = (widths[i] = parseFloat(
                    gsap.getProperty(el, "width", "px") as string
                ));
                xPercents[i] = snap(
                    (parseFloat(gsap.getProperty(el, "x", "px") as string) /
                        w) *
                        100 +
                        (gsap.getProperty(el, "xPercent") as number)
                );
                return xPercents[i];
            },
        });
        gsap.set(elements, { x: 0 });
        totalWidth =
            elements[length - 1].offsetLeft +
            (xPercents[length - 1] / 100) * widths[length - 1] -
            startX +
            elements[length - 1].offsetWidth *
                (gsap.getProperty(elements[length - 1], "scaleX") as number) +
            (parseFloat(config.paddingRight) || 0);
        for (let i = 0; i < length; i += 1) {
            const item = elements[i];
            curX = (xPercents[i] / 100) * widths[i];
            distanceToStart = item.offsetLeft + curX - startX;
            distanceToLoop =
                distanceToStart +
                widths[i] * (gsap.getProperty(item, "scaleX") as number);
            tl.to(
                item,
                {
                    xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
                    duration: distanceToLoop / pixelsPerSecond,
                },
                0
            )
                .fromTo(
                    item,
                    {
                        xPercent: snap(
                            ((curX - distanceToLoop + totalWidth) / widths[i]) *
                                100
                        ),
                    },
                    {
                        xPercent: xPercents[i],
                        duration:
                            (curX - distanceToLoop + totalWidth - curX) /
                            pixelsPerSecond,
                        immediateRender: false,
                    },
                    distanceToLoop / pixelsPerSecond
                )
                .add("label" + i, distanceToStart / pixelsPerSecond);
            times[i] = distanceToStart / pixelsPerSecond;
        }
        function toIndex(index: number, vars: gsap.TweenVars = {}) {
            Math.abs(index - curIndex) > length / 2 &&
                (index += index > curIndex ? -length : length);
            const newIndex = gsap.utils.wrap(0, length, index) as number;
            let time = times[newIndex];
            if (time > tl.time() !== index > curIndex) {
                vars.modifiers = {
                    time: gsap.utils.wrap(0, tl.duration()),
                } as any;
                time += tl.duration() * (index > curIndex ? 1 : -1);
            }
            curIndex = newIndex;
            vars.overwrite = true;
            return tl.tweenTo(time, vars);
        }
        (tl as any).next = (vars?: gsap.TweenVars) =>
            toIndex(curIndex + 1, vars);
        (tl as any).previous = (vars?: gsap.TweenVars) =>
            toIndex(curIndex - 1, vars);
        (tl as any).current = () => curIndex;
        (tl as any).toIndex = (index: number, vars?: gsap.TweenVars) =>
            toIndex(index, vars);
        (tl as any).times = times;
        tl.progress(1, true).progress(0, true);
        if (config.reversed) {
            tl.vars.onReverseComplete?.();
            tl.reverse();
        }
        return tl;
    }

    useEffect(() => {
        timelinesRef.current.forEach((t) => t?.kill());
        timelinesRef.current = [];
        rowRefs.current.forEach((rowEl, rowIndex) => {
            if (!rowEl) return;
            const items = rowEl.querySelectorAll('[data-person-item="true"]');
            if (items.length === 0) return;
            const tl = horizontalLoop(items, {
                speed: 0.2,
                paused: false,
                reversed: rowIndex % 2 === 1,
            });
            timelinesRef.current[rowIndex] = tl;
        });
        return () => {
            timelinesRef.current.forEach((t) => t?.kill());
            timelinesRef.current = [];
        };
    }, [rows]);

    useEffect(() => {
        timelinesRef.current.forEach((t) => {
            if (!t) return;
            if (isPaused) t.pause();
            else t.resume();
        });
    }, [isPaused]);

    const handleMouseEnter = (index: number) => {
        setHoveredIndex(index);
        setIsPaused(true);
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null);
        setIsPaused(false);
    };

    const renderPerson = (
        person: GoldenPerson,
        index: number,
        rowOffset: number = 0
    ) => {
        const actualIndex = index + rowOffset;
        const isHovered = hoveredIndex === actualIndex;

        return (
            <div
                key={`${person.name}-${actualIndex}`}
                data-person-item="true"
                className="relative flex-shrink-0 cursor-pointer whitespace-nowrap group"
                onMouseEnter={() => handleMouseEnter(actualIndex)}
                onMouseLeave={handleMouseLeave}
            >
                <span
                    className="inline-block px-4 text-xl transition-all duration-300 transform select-none md:text-2xl hover:scale-105 whitespace-nowrap"
                    style={{
                        fontFamily:
                            "'Dancing Script', 'Brush Script MT', cursive",
                        color: "#B8860B",
                        filter: isHovered ? "none" : "blur(0.5px)",
                        opacity: isHovered ? 1 : 0.8,
                        textShadow: isHovered
                            ? "0 0 8px rgba(184, 134, 11, 0.6), 0 0 16px rgba(184, 134, 11, 0.4)"
                            : "0 0 4px rgba(184, 134, 11, 0.3)",
                    }}
                >
                    {person.name}
                </span>
            </div>
        );
    };

    const hoveredDescription = useMemo(() => {
        if (hoveredIndex === null) return "";
        for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
            const start = rowOffsets[rowIndex] ?? 0;
            const end = start + (rows[rowIndex]?.length ?? 0);
            if (hoveredIndex >= start && hoveredIndex < end) {
                const indexInRow = hoveredIndex - start;
                return rows[rowIndex]?.[indexInRow]?.description ?? "";
            }
        }
        return "";
    }, [hoveredIndex, rowOffsets, rows]);

    const displayText =
        hoveredDescription.trim().length > 0
            ? getShortDescription(hoveredDescription, 140)
            : "To all of those I have met before";
    const [typedText, setTypedText] = useState("");
    useEffect(() => {
        let i = 0;
        setTypedText("");
        const interval = setInterval(() => {
            i += 1;
            setTypedText(displayText.slice(0, i));
            if (i >= displayText.length) {
                clearInterval(interval);
            }
        }, 18);
        return () => clearInterval(interval);
    }, [displayText]);

    return (
        <motion.div
            className="relative w-full py-32 pb-40 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.4 }}
        >
            <div className="flex flex-col items-center justify-center w-full space-y-6">
                <div className="relative flex items-center justify-center w-full h-12 pb-2 overflow-hidden md:h-16">
                    <span
                        className="inline-block px-4 text-2xl text-center select-none whitespace-nowrap md:text-4xl"
                        style={{
                            fontFamily:
                                "'Dancing Script', 'Brush Script MT', cursive",
                            color: "#B8860B",
                            textShadow:
                                "0 0 8px rgba(184, 134, 11, 0.35), 0 0 16px rgba(184, 134, 11, 0.25)",
                        }}
                    >
                        {typedText}
                    </span>
                </div>
                {rows.map((row, rowIndex) => (
                    <div
                        key={`row-${rowIndex}`}
                        className="relative w-full max-w-5xl mx-auto overflow-hidden fade-mask"
                    >
                        <div
                            ref={(el) => (rowRefs.current[rowIndex] = el)}
                            className="flex items-center flex-nowrap"
                            style={{ gap: "0px" }}
                        >
                            {[...Array(2)].map((_, loopIndex) => (
                                <div
                                    key={`row-${rowIndex}-loop-${loopIndex}`}
                                    className="flex items-center flex-nowrap"
                                >
                                    {row.map((person, index) =>
                                        renderPerson(
                                            person,
                                            index,
                                            rowOffsets[rowIndex] || 0
                                        )
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="absolute top-0 left-0 z-20 w-24 h-full pointer-events-none" />
            <div className="absolute top-0 right-0 z-20 w-24 h-full pointer-events-none" />
        </motion.div>
    );
}
