import { useMemo, useState, useEffect } from "react";

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

function shuffleArray<T>(array: T[]): T[] {
    const a = [...array];
    for (let i = a.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export default function Golden({ people }: GoldenProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [isPaused, setIsPaused] = useState(false);

    const shuffledPeople = useMemo(() => shuffleArray(people), [people]);
    const ROW_SIZE = 9;
    const rows = useMemo(() => {
        const limited = shuffledPeople.slice(0, ROW_SIZE * 3);
        const chunks: GoldenPerson[][] = [];
        for (let i = 0; i < limited.length; i += ROW_SIZE) {
            chunks.push(limited.slice(i, i + ROW_SIZE));
        }
        return chunks;
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
            @keyframes scrollLeft {
                from {
                    transform: translateX(0);
                }
                to {
                    transform: translateX(-33.333%);
                }
            }
            
            @keyframes scrollRight {
                from {
                    transform: translateX(-33.333%);
                }
                to {
                    transform: translateX(0);
                }
            }
            
            .scroll-container {
                display: flex;
                align-items: center;
                white-space: nowrap;
            }
            
            .scroll-left {
                animation: scrollLeft 30s linear infinite;
            }
            
            .scroll-right {
                animation: scrollRight 30s linear infinite;
            }
            
            .scroll-paused {
                animation-play-state: paused !important;
            }

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
                className="relative flex-shrink-0 cursor-pointer group"
                onMouseEnter={() => handleMouseEnter(actualIndex)}
                onMouseLeave={handleMouseLeave}
            >
                <span
                    className="inline-block px-4 text-xl transition-all duration-300 transform select-none md:text-2xl hover:scale-105"
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
        <div className="relative w-full py-32 pb-40 overflow-hidden">
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
                            className={`scroll-container ${
                                rowIndex % 2 === 0
                                    ? "scroll-left"
                                    : "scroll-right"
                            } ${isPaused ? "scroll-paused" : ""}`}
                        >
                            {[...Array(3)].map((_, loopIndex) => (
                                <div
                                    key={`row-${rowIndex}-loop-${loopIndex}`}
                                    className="flex items-center"
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
        </div>
    );
}
