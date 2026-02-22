import sharp from "sharp";

export type RgbColor = [number, number, number];

const DEFAULT_FALLBACK_COLOR: RgbColor = [29, 185, 84];

type ColorExtractionOptions = {
    fallbackColor?: RgbColor;
    resize?: number;
    sampleStride?: number;
};

const SIG_BITS = 5;
const R_SHIFT = 8 - SIG_BITS;
const MAX_ITERATIONS = 1000;
const FRACT_BY_POPULATIONS = 0.75;

const getColorIndex = (r: number, g: number, b: number) =>
    (r << (2 * SIG_BITS)) + (g << SIG_BITS) + b;

class PQueue<T> {
    private contents: T[] = [];
    private sorted = false;

    constructor(private comparator: (a: T, b: T) => number) {}

    private sort() {
        this.contents.sort(this.comparator);
        this.sorted = true;
    }

    push(o: T) {
        this.contents.push(o);
        this.sorted = false;
    }

    peek(index?: number) {
        if (!this.sorted) this.sort();
        return this.contents[index ?? this.contents.length - 1];
    }

    pop() {
        if (!this.sorted) this.sort();
        return this.contents.pop();
    }

    size() {
        return this.contents.length;
    }

    map<R>(f: (item: T) => R) {
        return this.contents.map(f);
    }
}

class VBox {
    private _volume?: number;
    private _count?: number;
    private _countSet?: boolean;
    private _avg?: RgbColor;

    constructor(
        public r1: number,
        public r2: number,
        public g1: number,
        public g2: number,
        public b1: number,
        public b2: number,
        public histo: number[],
    ) {}

    volume(force?: boolean) {
        if (!this._volume || force) {
            this._volume =
                (this.r2 - this.r1 + 1) *
                (this.g2 - this.g1 + 1) *
                (this.b2 - this.b1 + 1);
        }
        return this._volume;
    }

    count(force?: boolean) {
        if (!this._countSet || force) {
            let npix = 0;
            for (let i = this.r1; i <= this.r2; i++) {
                for (let j = this.g1; j <= this.g2; j++) {
                    for (let k = this.b1; k <= this.b2; k++) {
                        const index = getColorIndex(i, j, k);
                        npix += this.histo[index] || 0;
                    }
                }
            }
            this._count = npix;
            this._countSet = true;
        }
        return this._count ?? 0;
    }

    copy() {
        return new VBox(
            this.r1,
            this.r2,
            this.g1,
            this.g2,
            this.b1,
            this.b2,
            this.histo,
        );
    }

    avg(force?: boolean): RgbColor {
        if (!this._avg || force) {
            const mult = 1 << (8 - SIG_BITS);
            let ntot = 0;
            let rsum = 0;
            let gsum = 0;
            let bsum = 0;
            for (let i = this.r1; i <= this.r2; i++) {
                for (let j = this.g1; j <= this.g2; j++) {
                    for (let k = this.b1; k <= this.b2; k++) {
                        const histoindex = getColorIndex(i, j, k);
                        const hval = this.histo[histoindex] || 0;
                        ntot += hval;
                        rsum += hval * (i + 0.5) * mult;
                        gsum += hval * (j + 0.5) * mult;
                        bsum += hval * (k + 0.5) * mult;
                    }
                }
            }
            if (ntot) {
                this._avg = [
                    Math.trunc(rsum / ntot),
                    Math.trunc(gsum / ntot),
                    Math.trunc(bsum / ntot),
                ];
            } else {
                this._avg = [
                    Math.trunc((mult * (this.r1 + this.r2 + 1)) / 2),
                    Math.trunc((mult * (this.g1 + this.g2 + 1)) / 2),
                    Math.trunc((mult * (this.b1 + this.b2 + 1)) / 2),
                ];
            }
        }
        return this._avg;
    }

    contains(pixel: RgbColor) {
        const r = pixel[0] >> R_SHIFT;
        const g = pixel[1] >> R_SHIFT;
        const b = pixel[2] >> R_SHIFT;
        return (
            r >= this.r1 &&
            r <= this.r2 &&
            g >= this.g1 &&
            g <= this.g2 &&
            b >= this.b1 &&
            b <= this.b2
        );
    }
}

class CMap {
    private vboxes = new PQueue<{ vbox: VBox; color: RgbColor }>((a, b) => {
        const va = a.vbox.count() * a.vbox.volume();
        const vb = b.vbox.count() * b.vbox.volume();
        return va < vb ? -1 : va > vb ? 1 : 0;
    });

    push(vbox: VBox) {
        this.vboxes.push({ vbox, color: vbox.avg() });
    }

    palette() {
        return this.vboxes.map(vb => vb.color);
    }
}

const getHisto = (pixels: RgbColor[]) => {
    const histosize = 1 << (3 * SIG_BITS);
    const histo = new Array<number>(histosize);
    pixels.forEach(pixel => {
        const r = pixel[0] >> R_SHIFT;
        const g = pixel[1] >> R_SHIFT;
        const b = pixel[2] >> R_SHIFT;
        const index = getColorIndex(r, g, b);
        histo[index] = (histo[index] || 0) + 1;
    });
    return histo;
};

const vboxFromPixels = (pixels: RgbColor[], histo: number[]) => {
    let rmin = 1000000;
    let rmax = 0;
    let gmin = 1000000;
    let gmax = 0;
    let bmin = 1000000;
    let bmax = 0;
    pixels.forEach(pixel => {
        const r = pixel[0] >> R_SHIFT;
        const g = pixel[1] >> R_SHIFT;
        const b = pixel[2] >> R_SHIFT;
        if (r < rmin) rmin = r;
        else if (r > rmax) rmax = r;
        if (g < gmin) gmin = g;
        else if (g > gmax) gmax = g;
        if (b < bmin) bmin = b;
        else if (b > bmax) bmax = b;
    });
    return new VBox(rmin, rmax, gmin, gmax, bmin, bmax, histo);
};

const medianCutApply = (histo: number[], vbox: VBox) => {
    if (!vbox.count()) return;

    const rw = vbox.r2 - vbox.r1 + 1;
    const gw = vbox.g2 - vbox.g1 + 1;
    const bw = vbox.b2 - vbox.b1 + 1;
    const maxw = Math.max(rw, gw, bw);
    if (vbox.count() === 1) return [vbox.copy()];

    let total = 0;
    const partialsum: number[] = [];
    const lookaheadsum: number[] = [];
    if (maxw === rw) {
        for (let i = vbox.r1; i <= vbox.r2; i++) {
            let sum = 0;
            for (let j = vbox.g1; j <= vbox.g2; j++) {
                for (let k = vbox.b1; k <= vbox.b2; k++) {
                    const index = getColorIndex(i, j, k);
                    sum += histo[index] || 0;
                }
            }
            total += sum;
            partialsum[i] = total;
        }
    } else if (maxw === gw) {
        for (let i = vbox.g1; i <= vbox.g2; i++) {
            let sum = 0;
            for (let j = vbox.r1; j <= vbox.r2; j++) {
                for (let k = vbox.b1; k <= vbox.b2; k++) {
                    const index = getColorIndex(j, i, k);
                    sum += histo[index] || 0;
                }
            }
            total += sum;
            partialsum[i] = total;
        }
    } else {
        for (let i = vbox.b1; i <= vbox.b2; i++) {
            let sum = 0;
            for (let j = vbox.r1; j <= vbox.r2; j++) {
                for (let k = vbox.g1; k <= vbox.g2; k++) {
                    const index = getColorIndex(j, k, i);
                    sum += histo[index] || 0;
                }
            }
            total += sum;
            partialsum[i] = total;
        }
    }
    partialsum.forEach((d, i) => {
        lookaheadsum[i] = total - d;
    });

    const doCut = (color: "r" | "g" | "b") => {
        const dim1 = `${color}1` as const;
        const dim2 = `${color}2` as const;
        for (let i = vbox[dim1]; i <= vbox[dim2]; i++) {
            if (partialsum[i] > total / 2) {
                const vbox1 = vbox.copy();
                const vbox2 = vbox.copy();
                const left = i - vbox[dim1];
                const right = vbox[dim2] - i;
                let d2 = 0;
                if (left <= right)
                    d2 = Math.min(vbox[dim2] - 1, Math.trunc(i + right / 2));
                else d2 = Math.max(vbox[dim1], Math.trunc(i - 1 - left / 2));
                while (!partialsum[d2]) d2++;
                let count2 = lookaheadsum[d2];
                while (!count2 && partialsum[d2 - 1]) count2 = lookaheadsum[--d2];
                vbox1[dim2] = d2;
                vbox2[dim1] = vbox1[dim2] + 1;
                return [vbox1, vbox2];
            }
        }
    };

    return maxw === rw ? doCut("r") : maxw === gw ? doCut("g") : doCut("b");
};

const quantize = (pixels: RgbColor[], maxcolors: number) => {
    if (!pixels.length || maxcolors < 2 || maxcolors > 256) {
        return false;
    }

    const histo = getHisto(pixels);
    let nColors = 0;
    histo.forEach(() => nColors++);

    const vbox = vboxFromPixels(pixels, histo);
    const pq = new PQueue<VBox>((a, b) => {
        const va = a.count();
        const vb = b.count();
        return va < vb ? -1 : va > vb ? 1 : 0;
    });
    pq.push(vbox);

    const iter = (lh: PQueue<VBox>, target: number) => {
        let ncolors = 1;
        let niters = 0;
        while (niters < MAX_ITERATIONS) {
            const vboxItem = lh.pop();
            if (!vboxItem) break;
            if (!vboxItem.count()) {
                lh.push(vboxItem);
                niters++;
                continue;
            }
            const vboxes = medianCutApply(histo, vboxItem);
            const vbox1 = vboxes?.[0];
            const vbox2 = vboxes?.[1];
            if (!vbox1) return;
            lh.push(vbox1);
            if (vbox2) {
                lh.push(vbox2);
                ncolors++;
            }
            if (ncolors >= target) return;
            if (niters++ > MAX_ITERATIONS) return;
        }
    };

    iter(pq, FRACT_BY_POPULATIONS * maxcolors);

    const pq2 = new PQueue<VBox>((a, b) => {
        const va = a.count() * a.volume();
        const vb = b.count() * b.volume();
        return va < vb ? -1 : va > vb ? 1 : 0;
    });
    while (pq.size()) {
        const item = pq.pop();
        if (item) pq2.push(item);
    }

    iter(pq2, maxcolors - pq2.size());

    const cmap = new CMap();
    while (pq2.size()) {
        const item = pq2.pop();
        if (item) cmap.push(item);
    }

    return cmap;
};

export async function getDominantColorFromImageUrl(
    imageUrl?: string,
    options: ColorExtractionOptions = {},
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

        const pixelArray: RgbColor[] = [];
        const pixelCount = info.width * info.height;
        for (let i = 0; i < pixelCount; i += sampleStride) {
            const offset = i * info.channels;
            const r = data[offset] ?? 0;
            const g = data[offset + 1] ?? 0;
            const b = data[offset + 2] ?? 0;
            const a = info.channels === 4 ? data[offset + 3] ?? 255 : 255;
            if (a >= 125) {
                if (!(r > 250 && g > 250 && b > 250)) {
                    pixelArray.push([r, g, b]);
                }
            }
        }

        const cmap = quantize(pixelArray, 5);
        const palette = cmap ? cmap.palette() : [[255, 255, 255]];
        const dominant = palette[0];
        if (dominant) {
            return [dominant[0], dominant[1], dominant[2]];
        }
    } catch {}

    return fallbackColor;
}
