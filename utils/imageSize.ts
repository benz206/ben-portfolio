import { unstable_cache } from "next/cache";
import sharp from "sharp";

const REVALIDATE_SECONDS = 60 * 60 * 24 * 30;

type ImageSize = { width: number; height: number };

async function probe(src: string): Promise<ImageSize | null> {
    try {
        const res = await fetch(src);
        if (!res.ok) return null;
        const { width, height } = await sharp(
            Buffer.from(await res.arrayBuffer()),
        ).metadata();
        return width && height ? { width, height } : null;
    } catch {
        return null;
    }
}

export function getRemoteImageSize(src: string): Promise<ImageSize | null> {
    return unstable_cache(() => probe(src), ["image-size", src], {
        revalidate: REVALIDATE_SECONDS,
    })();
}
