"use client";
import Image, { ImageProps } from "next/image";
import { getImageDimensions } from "@/utils/getImageDimensions";
import { useEffect, useState } from "react";

export default function MDXImage({
    src,
    alt,
    ...props
}: { src: string; alt?: string } & Omit<ImageProps, "src" | "alt">) {
    const [dimensions, setDimensions] = useState<{
        width: number;
        height: number;
    } | null>(null);

    useEffect(() => {
        getImageDimensions(src)
            .then((dims) => {
                const scaleFactor = 600 / dims.height;
                setDimensions({
                    width: Math.round(dims.width * scaleFactor),
                    height: 600,
                });
            })
            .catch(() => {});
    }, [src]);

    return (
        <div className="relative w-full h-[400px]">
            <Image
                className="object-cover mx-auto my-4 rounded-lg shadow-lg"
                src={src}
                alt={alt || "Image"}
                width={dimensions?.width || 400}
                height={400}
                {...props}
            />
        </div>
    );
}
