"use client";
import { PropsWithChildren } from "react";
import { Roboto } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "next-themes";

const roboto = Roboto({
    subsets: ["latin"],
    weight: ["900", "700", "500", "400", "300", "100"],
});

export default function Providers({ children }: PropsWithChildren) {
    return (
        <div className={roboto.className}>
            <ThemeProvider attribute="class">
                {children}
                <SpeedInsights />
                <Analytics />
            </ThemeProvider>
        </div>
    );
}
