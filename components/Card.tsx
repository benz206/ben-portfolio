"use client";

import { ReactNode } from "react";
import { m } from "framer-motion";
import { cn } from "@/utils/cn";
import { AmbientGradient, AmbientVariant } from "@/components/AmbientGradient";

type CardVariant = "slate" | "minimal" | "glass";
type CardSize = "sm" | "md" | "lg" | "xl";
type CardRadius = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";

interface CardProps {
    children: ReactNode;
    variant?: CardVariant;
    size?: CardSize;
    className?: string;
    radius?: CardRadius;
    ambient?: boolean;
    ambientClassName?: string;
    ambientSeed?: number | string;
    ambientVariant?: AmbientVariant;
    motionProps?: any;
}

const cardVariantClasses: Record<CardVariant, string> = {
    slate: "card-base",
    minimal: "border border-white/10 bg-[#090c14]/60 backdrop-blur rounded-lg",
    glass: "card-glass",
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
    variant = "slate",
    size = "md",
    className = "",
    radius = "xl",
    ambient = false,
    ambientClassName = "",
    ambientSeed,
    ambientVariant,
    motionProps,
}: CardProps) {
    const baseClasses = cn(
        // make default background translucent when ambient is on so gradient shows through
        variant === "slate" && ambient
            ? "bg-white/40 border border-white/10"
            : cardVariantClasses[variant],
        cardSizeClasses[size],
        cardRadiusClasses[radius],
        ambient && "relative overflow-hidden isolate",
        className,
    );

    if (motionProps) {
        return (
            <m.div className={baseClasses} {...motionProps}>
                {children}
                {ambient && (
                    <AmbientGradient
                        className={ambientClassName}
                        variant={ambientVariant}
                        seed={ambientSeed}
                    />
                )}
            </m.div>
        );
    }

    return (
        <div className={baseClasses}>
            {children}
            {ambient && (
                <AmbientGradient
                    className={ambientClassName}
                    variant={ambientVariant}
                    seed={ambientSeed}
                />
            )}
        </div>
    );
}

export type { CardVariant, CardSize, CardProps };
