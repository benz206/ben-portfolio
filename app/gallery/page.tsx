import { motion } from "framer-motion";
import { CldImage } from "next-cloudinary";
import { v2 as cloudinary } from "cloudinary";

type ImageT = {
    public_id: string;
    format: string;
    width: number;
    height: number;
};

const boxAnim = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { delayChildren: 0.3, staggerChildren: 0.2 },
    },
};
const itemAnim = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
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

export const revalidate = 86400;

import GalleryClient from "./view";

export default async function GalleryPage() {
    const images = await fetchImages();
    return <GalleryClient images={images} />;
}
