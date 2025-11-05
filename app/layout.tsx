import "@/styles/globals.css";
import type { Metadata } from "next";
import Providers from "./providers";
import Layout from "@/components/Layout";
import ViewCounter from "@/components/ViewCounter";

export const metadata: Metadata = {
    title: "Ben's Portfolio",
    description:
        "Ben's Portfolio Website made with Next.js, TypeScript, and TailwindCSS.",
    openGraph: {
        title: "Ben Z's Portfolio",
        description:
            "Ben's Portfolio Website made with Next.js, TypeScript, and TailwindCSS.",
        images: [
            {
                url: "https://i.imgur.com/6KdqAaf.png",
            },
        ],
        type: "website",
        url: "https://bzhou.ca",
    },
    other: {
        "theme-color": "#339ccd",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <Providers>
                    <ViewCounter />
                    <Layout>{children}</Layout>
                </Providers>
            </body>
        </html>
    );
}
