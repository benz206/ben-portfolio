export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
}

/** Extract h2/h3 headings from raw MDX content string. */
export function extractHeadings(
    content: string,
): { level: number; text: string; id: string }[] {
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const headings: { level: number; text: string; id: string }[] = [];
    let match;
    while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length;
        // Strip inline markdown (bold, italic, code) from heading text
        const text = match[2]
            .trim()
            .replace(/[*_`]/g, "")
            .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
        headings.push({ level, text, id: slugify(text) });
    }
    return headings;
}
