import sharp from "sharp";

export type RgbColor = [number, number, number];

const DEFAULT_FALLBACK_COLOR: RgbColor = [29, 185, 84];

type ColorExtractionOptions = {
    fallbackColor?: RgbColor;
    resize?: number;
    sampleStride?: number;
};

export async function getDominantColorFromImageUrl(
    imageUrl?: string,
    options: ColorExtractionOptions = {}
): Promise<RgbColor> {
    const fallbackColor = options.fallbackColor ?? DEFAULT_FALLBACK_COLOR;
    const resize = options.resize ?? 72;
    const sampleStride = options.sampleStride ?? 12;

    if (!imageUrl) return fallbackColor;

    try {
        const imgRes = await fetch(imageUrl);
        if (!imgRes.ok) return fallbackColor;

        const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
        const { data, info } = await sharp(imgBuffer)
            .resize(resize, resize, { fit: "inside", withoutEnlargement: true })
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        if (!data || !info?.width || !info?.height || info.channels < 3) {
            return fallbackColor;
        }

        const buckets = new Map<
            number,
            { w: number; r: number; g: number; b: number; count: number }
        >();

        const step = info.channels * sampleStride;
        for (let i = 0; i < data.length; i += step) {
            const r = data[i] ?? 0;
            const g = data[i + 1] ?? 0;
            const b = data[i + 2] ?? 0;

            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            if (max < 30) continue;

            const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            if (luma < 18 || luma > 238) continue;

            const sat = max === 0 ? 0 : (max - min) / max;
            const v = max / 255;
            const w = Math.pow(sat, 0.85) * Math.pow(v, 1.05);
            if (w <= 0) continue;

            const key = ((r >> 5) << 6) | ((g >> 5) << 3) | (b >> 5);
            const entry = buckets.get(key);
            if (entry) {
                entry.w += w;
                entry.r += r * w;
                entry.g += g * w;
                entry.b += b * w;
                entry.count += 1;
            } else {
                buckets.set(key, { w, r: r * w, g: g * w, b: b * w, count: 1 });
            }
        }

        let bestKey: number | null = null;
        let bestScore = -1;
        buckets.forEach((bucket, key) => {
            const score = bucket.w * Math.log2(bucket.count + 1);
            if (score > bestScore) {
                bestScore = score;
                bestKey = key;
            }
        });

        if (bestKey !== null) {
            const bucket = buckets.get(bestKey);
            if (bucket && bucket.w > 0) {
                return [
                    Math.round(bucket.r / bucket.w),
                    Math.round(bucket.g / bucket.w),
                    Math.round(bucket.b / bucket.w),
                ];
            }
        }
    } catch {}

    return fallbackColor;
}
