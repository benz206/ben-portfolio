// Bespoke geometric glyphs drawn on the Experience grid, one per company.
// Coordinates live in an abstract unit grid (x →, y ↓); GridGlow maps them onto
// the canvas gridlines, centres them vertically and offsets them to the right.
// A glowing tracer runs around each path, accelerating as it goes.

export type SymbolPath = {
    points: Array<[number, number]>;
    closed?: boolean;
};

export type Glyph = {
    paths: SymbolPath[];
    color?: string; // optional "r,g,b" override for the glyph's glow
};

// Keyed by org `name` (must match data/about.ts exactly).
export const symbols: Record<string, Glyph> = {
    // "GC" monogram
    "Grand Charter": {
        paths: [
            // G
            {
                points: [
                    [3, 0],
                    [1, 0],
                    [0, 1],
                    [0, 3],
                    [1, 4],
                    [3, 4],
                    [3, 2],
                    [2, 2],
                ],
            },
            // C
            {
                points: [
                    [7, 0],
                    [5, 0],
                    [4, 1],
                    [4, 3],
                    [5, 4],
                    [7, 4],
                ],
            },
        ],
    },

    // figure-eight of two stacked diamonds, followed by "VC"
    "8VC": {
        paths: [
            // 8 — top diamond
            {
                points: [
                    [1, 0],
                    [2, 1],
                    [1, 2],
                    [0, 1],
                ],
                closed: true,
            },
            // 8 — bottom diamond
            {
                points: [
                    [1, 2],
                    [2, 3],
                    [1, 4],
                    [0, 3],
                ],
                closed: true,
            },
            // V
            {
                points: [
                    [3, 0],
                    [4, 4],
                    [5, 0],
                ],
            },
            // C
            {
                points: [
                    [9, 0],
                    [7, 0],
                    [6, 1],
                    [6, 3],
                    [7, 4],
                    [9, 4],
                ],
            },
        ],
    },

    // "F" — the Fuego mark
    Fuego: {
        paths: [
            // stem + top bar
            {
                points: [
                    [2, 0],
                    [0, 0],
                    [0, 4],
                ],
            },
            // middle bar
            {
                points: [
                    [0, 2],
                    [1.5, 2],
                ],
            },
        ],
    },

    // SAP — the leaning parallelogram silhouette
    SAP: {
        paths: [
            {
                points: [
                    [1, 0],
                    [5, 0],
                    [4, 4],
                    [0, 4],
                ],
                closed: true,
            },
        ],
    },

    // EurekaHacks — its hexagon, in a colour of its own
    EurekaHacks: {
        color: "56,189,248", // sky blue, distinct from the row's red accent
        paths: [
            {
                points: [
                    [2, 0],
                    [4, 1],
                    [4, 3],
                    [2, 4],
                    [0, 3],
                    [0, 1],
                ],
                closed: true,
            },
        ],
    },
};
