import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";
import Providers from "./providers";
import Layout from "@/components/Layout";
import ViewCounter from "@/components/ViewCounter";
import { CommandProvider } from "@/components/CommandPalette/CommandProvider";

export const metadata: Metadata = {
    metadataBase: new URL("https://bzhou.ca"),
    title: "Ben's Portfolio",
    description: "Ben's Portfolio.",
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: "Ben's Portfolio",
        description: "Ben's Portfolio.",
        siteName: "Ben's Portfolio",
        images: [
            {
                url: "https://i.imgur.com/6KdqAaf.png",
            },
        ],
        type: "website",
        url: "https://bzhou.ca",
    },
    twitter: {
        card: "summary_large_image",
        title: "Ben's Portfolio",
        description: "Ben's Portfolio.",
        images: ["https://i.imgur.com/6KdqAaf.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
        },
    },
    other: {
        "theme-color": "#339ccd",
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
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
