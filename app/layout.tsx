import "@/styles/globals.css";
import type { Metadata } from "next";
import Providers from "./providers";
import Layout from "@/components/Layout";
import ViewCounter from "@/components/ViewCounter";
import { CommandProvider } from "@/components/CommandPalette/CommandProvider";

export const metadata: Metadata = {
    title: "Ben's Portfolio",
    description:
        "Ben's Portfolio.",
    openGraph: {
        title: "Ben's Portfolio",
        description:
            "Ben's Portfolio.",
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
                    <CommandProvider>
                        <Layout>{children}</Layout>
                    </CommandProvider>
                </Providers>
            </body>
        </html>
    );
}
