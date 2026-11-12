import type { Metadata } from "next";
import { v2 as cloudinary } from "cloudinary";
import { getCldImageUrl } from "next-cloudinary";
import GalleryClient from "./view";
import {
    getDominantColorFromImageUrl,
    type RgbColor,
} from "@/utils/colorExtraction";

type ImageT = {
    public_id: string;
    format: string;
    width: number;
    height: number;
    alt: string;
};

type ContextFields = { alt?: string; caption?: string };

type CloudinaryResource = Omit<ImageT, "alt"> & {
    context?: ContextFields & { custom?: ContextFields };
} & Record<string, unknown>;

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

async function fetchImages(): Promise<ImageT[]> {
    try {
        const result = await cloudinary.search
            .sort_by("uploaded_at", "desc")
            .with_field("context")
            .max_results(50)
            .execute();
        const resources = result.resources as CloudinaryResource[];
        return resources.map((r, i) => {
            const context = { ...r.context, ...r.context?.custom };
            return {
                public_id: r.public_id,
                format: r.format,
                width: r.width,
                height: r.height,
                alt:
                    context.alt ||
                    context.caption ||
                    `Photo ${i + 1} of ${resources.length}`,
            };
        });
    } catch {
        return [];
    }
}

async function generateBlurPlaceholders(
    images: ImageT[],
): Promise<Record<string, string>> {
    const entries = await Promise.all(
        images.map(async (image) => {
            const url = getCldImageUrl({
                src: image.public_id,
                width: 24,
                height: 24,
                crop: "fill",
                quality: 1,
                format: "webp",
                blur: "800",
            });
            try {
                const res = await fetch(url, {
                    next: { revalidate: 86400 },
                });
                if (!res.ok) return [image.public_id, ""] as const;
                const buffer = Buffer.from(await res.arrayBuffer());
                const base64 = buffer.toString("base64");
                const mime = res.headers.get("content-type") || "image/webp";
                return [
                    image.public_id,
                    `data:${mime};base64,${base64}`,
                ] as const;
            } catch {
                return [image.public_id, ""] as const;
            }
        }),
    );
    return Object.fromEntries(entries.filter(([, v]) => v));
}

async function fetchDominantColors(
    images: ImageT[],
): Promise<Record<string, RgbColor>> {
    const entries = await Promise.all(
        images.map(async (image) => {
            const url = getCldImageUrl({
                src: image.public_id,
                width: 72,
                height: 72,
                crop: "fill",
                quality: "auto",
                format: "webp",
            });
            const color = await getDominantColorFromImageUrl(url);
            return [image.public_id, color] as const;
        }),
    );
    return Object.fromEntries(entries);
}

export const revalidate = 86400;

export const metadata: Metadata = {
    title: "Gallery - Ben's Portfolio",
    description: "Photos I've taken over the years.",
    alternates: {
        canonical: "/gallery",
    },
    openGraph: {
        title: "Gallery - Ben's Portfolio",
        description: "Photos I've taken over the years.",
        url: "/gallery",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Gallery - Ben's Portfolio",
        description: "Photos I've taken over the years.",
    },
};

export default async function GalleryPage() {
    const images = await fetchImages();
    const [placeholders, colors] = await Promise.all([
        generateBlurPlaceholders(images),
        fetchDominantColors(images),
    ]);
    return (
        <GalleryClient
            images={images}
            placeholders={placeholders}
            colors={colors}
        />
    );
}
