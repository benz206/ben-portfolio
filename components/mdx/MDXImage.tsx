"use client";

import Image, { ImageProps } from "next/image";
import { getImageDimensions } from "@/utils/getImageDimensions";
import { useEffect, useState } from "react";

export default function MDXImage({
    src,
    alt,
    width,
    height,
    ...props
}: { src: string; alt?: string } & Omit<ImageProps, "src" | "alt">) {
    const hasSize = typeof width === "number" && typeof height === "number";
    const [dimensions, setDimensions] = useState<{
        width: number;
        height: number;
    } | null>(hasSize ? { width, height } : null);

    useEffect(() => {
        if (hasSize) return;
        getImageDimensions(src)
            .then((dims) => {
                setDimensions({
                    width: dims.width,
                    height: dims.height,
                });
            })
            .catch(() => {});
    }, [src, hasSize]);

    return (
        <span className="inline-flex justify-center my-4 w-full">
            <Image
                src={src}
                alt={alt || "Image"}
                width={dimensions?.width || 1200}
                height={dimensions?.height || 800}
                sizes="(min-width: 1280px) 1000px, (min-width: 768px) 700px, 400px"
                className="max-h-150 h-auto w-auto max-w-full rounded-lg shadow-lg"
                {...props}
            />
        </span>
    );
}
