import type { ReactNode } from "react";

export interface ProjectPreviewProps {
    image: {
        src: string;
        alt: string;
        width: number;
        height: number;
        priority?: boolean;
    };
    title: string;
    sub: string;
    summary?: string;
    description: ReactNode;
    languages: string[];
    color: string;
    projectLink?: string;
    slug?: string;
}
