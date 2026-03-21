import { useMemo } from "react";

type GoldenPerson = {
    name: string;
    description: string;
};

function hashString(input: string): number {
    let hash = 2166136261;
    for (let i = 0; i < input.length; i += 1) {
        hash ^= input.charCodeAt(i);
        hash +=
            (hash << 1) +
            (hash << 4) +
            (hash << 7) +
            (hash << 8) +
            (hash << 24);
    }
    return hash >>> 0;
}

export function useGoldenRows(people: GoldenPerson[], rowsCount = 3) {
    const shuffledPeople = useMemo(
        () =>
            [...people].sort((a, b) => hashString(a.name) - hashString(b.name)),
        [people],
    );

    const rows = useMemo(() => {
        const chunks: GoldenPerson[][] = [];
        const total = shuffledPeople.length;
        const base = Math.floor(total / rowsCount);
        const remainder = total % rowsCount;
        let start = 0;
        for (let r = 0; r < rowsCount; r += 1) {
            const size = base + (r < remainder ? 1 : 0);
            chunks.push(shuffledPeople.slice(start, start + size));
            start += size;
        }
        return chunks.filter((row) => row.length > 0);
    }, [rowsCount, shuffledPeople]);

    const rowOffsets = useMemo(
        () =>
            rows.map((_, idx) =>
                rows.slice(0, idx).reduce((acc, r) => acc + r.length, 0),
            ),
        [rows],
    );

    return { rows, rowOffsets };
}
