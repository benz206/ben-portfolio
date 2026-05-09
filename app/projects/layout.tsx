import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Projects - Ben's Portfolio",
    description: "A collection of projects I've been working on.",
    alternates: {
        canonical: "/projects",
    },
    openGraph: {
        title: "Projects - Ben's Portfolio",
        description: "A collection of projects I've been working on.",
        url: "/projects",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Projects - Ben's Portfolio",
        description: "A collection of projects I've been working on.",
    },
};

export default function ProjectsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
