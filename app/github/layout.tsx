import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "GitHub - Ben's Portfolio",
    description:
        "An overview of my GitHub activity, repositories, and contributions.",
    alternates: {
        canonical: "/github",
    },
    openGraph: {
        title: "GitHub - Ben's Portfolio",
        description:
            "An overview of my GitHub activity, repositories, and contributions.",
        url: "/github",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "GitHub - Ben's Portfolio",
        description:
            "An overview of my GitHub activity, repositories, and contributions.",
    },
};

export default function GithubLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
