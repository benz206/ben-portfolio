"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { m, easeOut } from "framer-motion";
import { useGoldenRows } from "@/components/Golden/useGoldenRows";
import { useTypedText } from "@/components/Golden/useTypedText";

const PIXELS_PER_SECOND = 20;

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

export default function Golden({ people }: GoldenProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const rowRefs = useRef<Array<HTMLDivElement | null>>([]);

    const { rows, rowOffsets } = useGoldenRows(people, 3);

    useEffect(() => {
        const style = document.createElement("style");
        style.textContent = `
            @media (prefers-reduced-motion: no-preference) {
                .fade-mask {
                    -webkit-mask-image: linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1) 7%, rgba(0,0,0,1) 93%, rgba(0,0,0,0));
                    mask-image: linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1) 7%, rgba(0,0,0,1) 93%, rgba(0,0,0,0));
                    -webkit-mask-repeat: no-repeat;
                    mask-repeat: no-repeat;
                    -webkit-mask-size: 100% 100%;
                    mask-size: 100% 100%;
                }
            }
            @keyframes golden-marquee {
                to {
                    transform: translateX(-50%);
                }
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            entries.forEach(({ target, contentRect }) => {
                (target as HTMLElement).style.setProperty(
                    "--marquee-duration",
                    `${contentRect.width / 2 / PIXELS_PER_SECOND}s`,
                );
            });
        });
        rowRefs.current.forEach((rowEl) => {
            if (rowEl) observer.observe(rowEl);
        });
        return () => observer.disconnect();
    }, [rows]);

    const handleMouseEnter = (index: number) => {
        setHoveredIndex(index);
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null);
    };

    const renderPerson = (
        person: GoldenPerson,
        index: number,
        rowOffset: number = 0,
    ) => {
        const actualIndex = index + rowOffset;
        const isHovered = hoveredIndex === actualIndex;

        return (
            <div
                key={`${person.name}-${actualIndex}`}
                className="relative shrink-0 whitespace-nowrap cursor-pointer group"
                onMouseEnter={() => handleMouseEnter(actualIndex)}
                onMouseLeave={handleMouseLeave}
            >
                <span
                    className="inline-block px-4 text-xl text-white whitespace-nowrap transition-all duration-300 transform select-none md:text-2xl hover:scale-105"
                    style={{
                        fontFamily:
                            "'Dancing Script', 'Brush Script MT', cursive",
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
    const typedText = useTypedText(displayText, 18);

    return (
        <m.div
            className="overflow-hidden relative py-32 pb-40 w-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOut }}
            viewport={{ once: true, amount: 0.4 }}
        >
            <div className="flex flex-col justify-center items-center gap-y-6 w-full">
                <div className="flex overflow-hidden relative justify-center items-center pb-2 w-full h-12 md:h-16">
                    <span
                        className="inline-block px-4 text-2xl text-center text-white whitespace-nowrap select-none md:text-4xl"
                        style={{
                            fontFamily:
                                "'Dancing Script', 'Brush Script MT', cursive",
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
                        className="overflow-hidden relative mx-auto w-full max-w-5xl fade-mask"
                    >
                        <div
                            ref={(el: HTMLDivElement | null) => {
                                rowRefs.current[rowIndex] = el;
                            }}
                            className="flex flex-nowrap items-center w-max motion-safe:animate-[golden-marquee_var(--marquee-duration)_linear_infinite] motion-reduce:w-auto"
                            style={{
                                gap: "0px",
                                animationDirection:
                                    rowIndex % 2 === 1 ? "reverse" : "normal",
                                animationPlayState:
                                    hoveredIndex === null
                                        ? "running"
                                        : "paused",
                            }}
                        >
                            {[...Array(2)].map((_, loopIndex) => (
                                <div
                                    key={`row-${rowIndex}-loop-${loopIndex}`}
                                    aria-hidden={loopIndex === 1 || undefined}
                                    className={
                                        loopIndex === 1
                                            ? "flex flex-nowrap items-center motion-reduce:hidden"
                                            : "flex flex-nowrap items-center motion-reduce:flex-wrap motion-reduce:justify-center"
                                    }
                                >
                                    {row.map((person, index) =>
                                        renderPerson(
                                            person,
                                            index,
                                            rowOffsets[rowIndex] || 0,
                                        ),
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="absolute top-0 left-0 z-20 w-24 h-full pointer-events-none" />
            <div className="absolute top-0 right-0 z-20 w-24 h-full pointer-events-none" />
        </m.div>
    );
}
