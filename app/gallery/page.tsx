import { v2 as cloudinary } from "cloudinary";
import { getCldImageUrl } from "next-cloudinary";
import GalleryClient from "./view";

type ImageT = {
    public_id: string;
    format: string;
    width: number;
    height: number;
};

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

async function fetchImages(): Promise<ImageT[]> {
    try {
        const result = await cloudinary.search
            .sort_by("uploaded_at", "desc")
            .max_results(50)
            .execute();
        return result.resources.map((r: any) => ({
            public_id: r.public_id,
            format: r.format,
            width: r.width,
            height: r.height,
        }));
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
                const res = await fetch(url);
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

export const revalidate = 86400;

export default async function GalleryPage() {
    const images = await fetchImages();
    const placeholders = await generateBlurPlaceholders(images);
    return <GalleryClient images={images} placeholders={placeholders} />;
}
