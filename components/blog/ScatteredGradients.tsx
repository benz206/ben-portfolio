import React from "react";

const BLOB_BASE_STYLE: React.CSSProperties = {
    transform: "translate(-50%, -50%)",
};

function hashSeed(seed: string, salt: number): number {
    const s = `${seed}:${salt}`;
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

type Blob = {
    x: string;
    y: string;
    w: number;
    h: number;
    hue: number;
    chroma: number;
    opacity: number;
    blur: number;
};

function generateBlobs(seed: string, count: number): Blob[] {
    const blobs: Blob[] = [];

    for (let i = 0; i < count; i++) {
        const h = hashSeed(seed, i + 1);

        const hue = h % 360;

        const xPct = 5 + ((h >>> 8) % 90);
        const yOffset = i * 500 + ((h >>> 12) % 250) - 80;

        const size = 350 + ((h >>> 16) % 400);
        const aspect = 0.6 + ((h >>> 20) % 80) / 100;

        const chroma = 0.14 + ((h >>> 22) % 10) / 100;
        const opacity = 0.12 + ((h >>> 6) % 10) / 100;
        const blur = 90 + ((h >>> 10) % 50);

        blobs.push({
            x: `${xPct}%`,
            y: `${yOffset}px`,
            w: size,
            h: Math.round(size * aspect),
            hue,
            chroma,
            opacity,
            blur,
        });
    }

    return blobs;
}

export default function ScatteredGradients({ seed }: { seed: string }) {
    const blobs = generateBlobs(seed, 16);

    return (
        <div
            className="pointer-events-none absolute inset-x-0 top-0 bottom-0 overflow-hidden"
            aria-hidden
        >
            {blobs.map((blob) => (
                <div
                    key={`${seed}:${blob.x}:${blob.y}:${blob.hue}`}
                    className="absolute rounded-full"
                    style={{
                        ...BLOB_BASE_STYLE,
                        left: blob.x,
                        top: blob.y,
                        width: `${blob.w}px`,
                        height: `${blob.h}px`,
                        opacity: blob.opacity,
                        filter: `blur(${blob.blur}px)`,
                        background: `radial-gradient(ellipse at center, oklch(0.7 ${blob.chroma} ${blob.hue}), transparent 70%)`,
                    }}
                />
            ))}
        </div>
    );
}
