import type { ReactNode } from "react";

export interface ProjectPreviewProps {
    image: {
        src: string;
        alt: string;
        width: number;
        height: number;
    };
    title: string;
    sub: string;
    description: ReactNode;
    languages: string[];
    color: string;
    projectLink: string;
    slug?: string;
}
