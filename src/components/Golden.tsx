import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface GoldenPerson {
    name: string;
    description: string;
}

interface GoldenProps {
    people: GoldenPerson[];
}

export default function Golden({ people }: GoldenProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [isPaused, setIsPaused] = useState(false);

    const firstRowPeople = people.slice(0, Math.ceil(people.length / 2));
    const secondRowPeople = people.slice(Math.ceil(people.length / 2));

    useEffect(() => {s
        const style = document.createElement('style');
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

    const renderPerson = (person: GoldenPerson, index: number, rowOffset: number = 0) => {
        const actualIndex = index + rowOffset;
        const isHovered = hoveredIndex === actualIndex;
        
        return (
            <motion.div
                key={`${person.name}-${actualIndex}`}
                className="relative flex-shrink-0 cursor-pointer group"
                onMouseEnter={() => handleMouseEnter(actualIndex)}
                onMouseLeave={handleMouseLeave}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
            >
                <motion.span
                    className="inline-block px-4 text-lg transition-all duration-300 select-none md:text-xl"
                    style={{
                        fontFamily: "'Dancing Script', 'Brush Script MT', cursive",
                        color: "#B8860B",
                        filter: isHovered ? "none" : "blur(0.5px)",
                        opacity: isHovered ? 1 : 0.8,
                        textShadow: isHovered 
                            ? "0 0 8px rgba(184, 134, 11, 0.6), 0 0 16px rgba(184, 134, 11, 0.4)" 
                            : "0 0 4px rgba(184, 134, 11, 0.3)",
                    }}
                >
                    {person.name}
                </motion.span>
                <motion.div
                    className="absolute bottom-full left-1/2 z-50 px-6 py-4 mb-3 rounded-2xl border shadow-2xl backdrop-blur-md transform -translate-x-1/2"
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{
                        opacity: isHovered ? 1 : 0,
                        y: isHovered ? 0 : 10,
                        scale: isHovered ? 1 : 0.9,
                    }}
                    transition={{ duration: 0.2 }}
                    style={{
                        pointerEvents: isHovered ? "auto" : "none",
                        width: "max-content",
                        minWidth: "200px",
                        maxWidth: "350px",
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        background: "rgba(255, 255, 255, 0.9)",
                        borderColor: "rgba(184, 134, 11, 0.2)",
                    }}
                >
                    <p className="text-sm font-light leading-relaxed text-center text-gray-700 break-words">
                        {person.description}
                    </p>
                    <div 
                        className="absolute top-full left-1/2 w-0 h-0 transform -translate-x-1/2"
                        style={{
                            borderLeft: "6px solid transparent",
                            borderRight: "6px solid transparent",
                            borderTop: "6px solid rgba(255, 255, 255, 0.9)",
                        }}
                    />
                </motion.div>
            </motion.div>
        );
    };

    return (
        <motion.div
            className="overflow-hidden relative py-8 w-full bg-white dark:bg-gray-900"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true, amount: 0.8 }}
        >
            <div className="flex flex-col justify-center items-center space-y-6 w-full">
                <div className="overflow-hidden relative w-full">
                    <div 
                        className={`scroll-container scroll-left ${isPaused ? 'scroll-paused' : ''}`}
                    >
                        {[...Array(3)].map((_, loopIndex) => (
                            <div key={`row1-loop-${loopIndex}`} className="flex items-center">
                                {firstRowPeople.map((person, index) => 
                                    renderPerson(person, index)
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="overflow-hidden relative w-full">
                    <div 
                        className={`scroll-container scroll-right ${isPaused ? 'scroll-paused' : ''}`}
                    >
                        {[...Array(3)].map((_, loopIndex) => (
                            <div key={`row2-loop-${loopIndex}`} className="flex items-center">
                                {secondRowPeople.map((person, index) => 
                                    renderPerson(person, index, Math.ceil(people.length / 2))
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="absolute top-0 left-0 z-20 w-24 h-full bg-gradient-to-r from-white to-transparent pointer-events-none dark:from-gray-900" />
            <div className="absolute top-0 right-0 z-20 w-24 h-full bg-gradient-to-l from-white to-transparent pointer-events-none dark:from-gray-900" />
        </motion.div>
    );
}