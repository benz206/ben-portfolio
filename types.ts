import { StaticImageData } from "next/image";
import type { ReactNode } from "react";

export type ProjectPreviewProps = {
    image: {
        src: StaticImageData;
        alt: string;
        width?: number;
        height?: number;
    };
    title: string;
    sub: string;
    summary?: string;
    description: ReactNode;
    languages: string[];
    color: string;
    index?: number;
    projectLink?: string;
    sourceLink?: string;
    slug?: string;
    writeup?: string;
    tier?: "featured" | "archive";
    highlights?: string[];
    metric?: { value: string; label: string };
};

export type BlogMetadata = {
    title: string;
    description: string;
    slug: string;
    created: string;
    updated: string;
    tags: string[];
};

export type RawBlogMetadata = {
    title: string;
    description: string;
    slug: string;
    tags: string[];
    created: string;
    updated: string;
    previewImage?: {
        src: string;
        alt: string;
    };
};
