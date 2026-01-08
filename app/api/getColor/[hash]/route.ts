import { NextRequest, NextResponse } from "next/server";

const LONG_CACHE_HEADERS = {
    "Cache-Control": "public, s-maxage=31536000, stale-while-revalidate=86400",
};
const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

function findNearestColor(rgbArray: number[]): number[] {
    const colors: number[][] = [
        [255, 0, 0],
        [255, 125, 0],
        [255, 255, 0],
        [125, 255, 0],
        [0, 255, 0],
        [0, 255, 125],
        [0, 255, 255],
        [0, 125, 255],
        [0, 0, 255],
        [125, 0, 255],
        [255, 0, 255],
        [255, 0, 125],
    ];
    let minDistance = Infinity;
    let closestColor: number[] = [];
    colors.forEach((color) => {
        const distance = Math.sqrt(
            Math.pow(rgbArray[0] - color[0], 2) +
                Math.pow(rgbArray[1] - color[1], 2) +
                Math.pow(rgbArray[2] - color[2], 2)
        );
        if (distance < minDistance) {
            minDistance = distance;
            closestColor = color;
        }
    });
    return closestColor;
}

function parseHashToRgb(hash: string): number[] | null {
    if (!hash) return null;
    const trimmed = hash.trim();
    if (trimmed.includes(",")) {
        const parts = trimmed.split(",").map((p) => parseInt(p.trim(), 10));
        if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;
        return parts.map((n) => Math.max(0, Math.min(255, n)));
    }
    const clean = trimmed.replace(/^#/, "");
    if (!(clean.length === 6)) return null;
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    if ([r, g, b].some((n) => Number.isNaN(n))) return null;
    return [r, g, b];
}

export async function GET(req: NextRequest, context: { params: Promise<{ hash: string }> }) {
    const { hash } = await context.params;
    const rgb = parseHashToRgb(hash);
    if (!rgb) {
        return NextResponse.json(
            { error: "Invalid color hash. Use R,G,B or hex (rrggbb)." },
            { status: 400, headers: NO_STORE_HEADERS }
        );
    }
    const nearest = findNearestColor(rgb);
    return NextResponse.json({ color: rgb, nearest }, { headers: LONG_CACHE_HEADERS });
}


