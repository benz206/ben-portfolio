import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";
import Providers from "./providers";
import Layout from "@/components/Layout";
import ViewCounter from "@/components/ViewCounter";
import { CommandProvider } from "@/components/CommandPalette/CommandProvider";
import { MotionProvider } from "@/components/MotionProvider";

const SITE_DESCRIPTION =
    "Software engineer who likes building elegant, efficient, and scalable software. Projects, writing, and photos from Ben Zhou.";

export const metadata: Metadata = {
    metadataBase: new URL("https://bzhou.ca"),
    title: "Ben Zhou",
    description: SITE_DESCRIPTION,
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: "Ben Zhou",
        description: SITE_DESCRIPTION,
        siteName: "Ben Zhou",
        type: "website",
        url: "https://bzhou.ca",
    },
    twitter: {
        card: "summary_large_image",
        title: "Ben Zhou",
        description: SITE_DESCRIPTION,
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
                    <MotionProvider>
                        <CommandProvider>
                            <Layout>{children}</Layout>
                        </CommandProvider>
                    </MotionProvider>
                </Providers>
            </body>
        </html>
    );
}
