/**
 * Lifts a dominant album-art color until it is bright enough to read as a
 * border against the dark cards. Album art is often near-black, which would
 * otherwise make the hover border invisible. Returns an "r,g,b" string for use
 * in a CSS variable.
 */
export function glowColor(
    color: [number, number, number],
    minPeak = 170,
): string {
    const peak = Math.max(...color);
    if (peak >= minPeak) return color.join(",");
    if (peak === 0) return `${minPeak},${minPeak},${minPeak}`;
    return color.map((c) => Math.round((c * minPeak) / peak)).join(",");
}
