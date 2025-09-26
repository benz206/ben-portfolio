import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

type CardVariant = "default" | "glass" | "transparent";
type CardSize = "sm" | "md" | "lg" | "xl";
type CardRadius = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";

interface CardProps {
    children: ReactNode;
    variant?: CardVariant;
    size?: CardSize;
    className?: string;
    radius?: CardRadius;
    motionProps?: any;
}

const cardVariantClasses: Record<CardVariant, string> = {
    default: "card-default",
    glass: "card-glass",
    transparent: "card-transparent",
};

const cardSizeClasses: Record<CardSize, string> = {
    sm: "card-sm",
    md: "card-md",
    lg: "card-lg",
    xl: "card-xl",
};

const cardRadiusClasses: Record<CardRadius, string> = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
    full: "rounded-full",
};

export default function Card({
    children,
    variant = "default",
    size = "md",
    className = "",
    radius = "xl",
    motionProps,
}: CardProps) {
    const baseClasses = cn(
        cardVariantClasses[variant],
        cardSizeClasses[size],
        cardRadiusClasses[radius],
        className
    );

    if (motionProps) {
        return (
            <motion.div className={baseClasses} {...motionProps}>
                {children}
            </motion.div>
        );
    }

    return <div className={baseClasses}>{children}</div>;
}

export type { CardVariant, CardSize, CardProps };
