"use client";
import { useEffect, useRef } from "react";
import { attachAmbient, AmbientOptions } from "@/utils/ambient";

type AmbientProps = AmbientOptions & {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
};

export default function Ambient({
    colors = ["#6d5efc", "#ff6ec7"],
    blur = 80,
    noise = 0.04,
    spotColor = "rgba(255,255,255,0.18)",
    spotSize = "40%",
    opacity = 0.9,
    followStrength = 0.06,
    damping = 0.12,
    className = "",
    style,
    children,
}: AmbientProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const api = attachAmbient(ref.current, {
            colors,
            blur,
            noise,
            spotColor,
            spotSize,
            opacity,
            followStrength,
            damping,
        });
        return () => api.destroy();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        colors?.[0],
        colors?.[1],
        blur,
        noise,
        spotColor,
        spotSize,
        opacity,
        followStrength,
        damping,
    ]);

    return (
        <div ref={ref} className={`ambient ${className}`} style={style}>
            {children}
        </div>
    );
}
