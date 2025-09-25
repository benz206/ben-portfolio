import { ReactNode } from "react";
import { motion } from "framer-motion";

type CardVariant =
    | "default"
    | "hero"
    | "project"
    | "repo"
    | "tooltip"
    | "playing";
type CardSize = "sm" | "md" | "lg" | "xl";

interface CardProps {
    children: ReactNode;
    variant?: CardVariant;
    size?: CardSize;
    className?: string;
    hover?: boolean;
    color?: string;
    motionProps?: any;
}

const cardVariants = {
    default:
        "bg-white dark:bg-[#121212] dark:text-[#ececec] shadow-lg rounded-xl border border-gray-200 dark:border-gray-700",
    hero: "bg-white/80 dark:bg-[#121212]/30 backdrop-blur-md dark:text-[#ececec] border border-white/10 drop-shadow-xl rounded-3xl",
    project:
        "bg-white dark:bg-[#121212] dark:text-[#ececec] shadow-2xl rounded-3xl",
    repo: "bg-white dark:bg-[#121212] dark:text-[#ececec] border-black rounded-xl drop-shadow-xl",
    tooltip: "border shadow-2xl rounded-2xl backdrop-blur-md",
    playing:
        "bg-white/80 dark:bg-[#121212]/30 backdrop-blur-md dark:text-[#ececec] border border-white/10 drop-shadow-xl rounded-2xl",
};

const cardSizes = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10",
};

const hoverEffects = {
    default: "hover:shadow-xl transition-all duration-300",
    hero: "hover:drop-shadow-2xl transition-all duration-1000 ease-in-out",
    project: "hover:shadow-2xl transition duration-1000",
    repo: "hover:shadow-lg transition-all duration-300",
    tooltip: "",
    playing: "hover:drop-shadow-2xl transition-all duration-1000 ease-in-out",
};

const colorVariants: { [key: string]: string[] } = {
    "amber-500": [
        "hover:shadow-amber-500",
        "group-hover:text-amber-500",
        "hover:text-amber-500",
        "group-hover:bg-amber-500",
        "bg-amber-500",
    ],
    "indigo-500": [
        "hover:shadow-indigo-500",
        "group-hover:text-indigo-500",
        "hover:text-indigo-500",
        "group-hover:bg-indigo-500",
        "bg-indigo-500",
    ],
    "teal-500": [
        "hover:shadow-teal-500",
        "group-hover:text-teal-500",
        "hover:text-teal-500",
        "group-hover:bg-teal-500",
        "bg-teal-500",
    ],
    "purple-400": [
        "hover:shadow-purple-400",
        "group-hover:text-purple-400",
        "hover:text-purple-400",
        "group-hover:bg-purple-400",
        "bg-purple-400",
    ],
    "red-500": [
        "hover:shadow-red-500",
        "group-hover:text-red-500",
        "hover:text-red-500",
        "group-hover:bg-red-500",
        "bg-red-500",
    ],
    "green-400": [
        "hover:shadow-green-400",
        "group-hover:text-green-400",
        "hover:text-green-400",
        "group-hover:bg-green-400",
        "bg-green-400",
    ],
    "cyan-300": [
        "hover:shadow-cyan-300",
        "group-hover:text-cyan-300",
        "hover:text-cyan-300",
        "group-hover:bg-cyan-300",
        "bg-cyan-300",
    ],
    "orange-500": [
        "hover:shadow-orange-500",
        "group-hover:text-orange-500",
        "hover:text-orange-500",
        "group-hover:bg-orange-500",
        "bg-orange-500",
    ],
    "fuchsia-400": [
        "hover:shadow-fuchsia-400",
        "group-hover:text-fuchsia-400",
        "hover:text-fuchsia-400",
        "group-hover:bg-fuchsia-400",
        "bg-fuchsia-400",
    ],
    "amber-400": [
        "hover:shadow-amber-400",
        "group-hover:text-amber-400",
        "hover:text-amber-400",
        "group-hover:bg-amber-400",
        "bg-amber-400",
    ],
    "sky-600": [
        "hover:shadow-sky-600",
        "group-hover:text-sky-600",
        "hover:text-sky-600",
        "group-hover:bg-sky-600",
        "bg-sky-600",
    ],
    "yellow-400": [
        "hover:shadow-yellow-400",
        "group-hover:text-yellow-400",
        "hover:text-yellow-400",
        "group-hover:bg-yellow-400",
        "bg-yellow-400",
    ],
    "emerald-600": [
        "hover:shadow-emerald-600",
        "group-hover:text-emerald-600",
        "hover:text-emerald-600",
        "group-hover:bg-emerald-600",
        "bg-emerald-600",
    ],
    "rose-500": [
        "hover:shadow-rose-500",
        "group-hover:text-rose-500",
        "hover:text-rose-500",
        "group-hover:bg-rose-500",
        "bg-rose-500",
    ],
    default: [
        "hover:shadow-blue-400",
        "group-hover:text-blue-400",
        "hover:text-blue-400",
        "group-hover:bg-blue-400",
        "bg-blue-400",
    ],
};

export default function Card({
    children,
    variant = "default",
    size = "md",
    className = "",
    hover = true,
    color,
    motionProps,
}: CardProps) {
    const colorVariant = color
        ? colorVariants[color] || colorVariants.default
        : null;
    const colorClass = colorVariant ? colorVariant[0] : "";

    const baseClasses = `${cardVariants[variant]} ${cardSizes[size]}`;
    const hoverClass = hover ? hoverEffects[variant] : "";
    const finalClasses =
        `${baseClasses} ${hoverClass} ${colorClass} ${className}`.trim();

    if (motionProps) {
        return (
            <motion.div className={finalClasses} {...motionProps}>
                {children}
            </motion.div>
        );
    }

    return <div className={finalClasses}>{children}</div>;
}

export type { CardVariant, CardSize, CardProps };
