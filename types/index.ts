import type { ReactNode } from "react";
import { TechIconProps } from "@/components/TechIcon";

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
    icons: TechIconProps[];
    color: string;
    projectLink: string;
    slug?: string;
    categories: string[];
    phase?: "Discover" | "Architect" | "Ship";
}
