"use client";

import { PropsWithChildren } from "react";
import { Roboto } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const roboto = Roboto({
    subsets: ["latin"],
    weight: ["900", "700", "600", "500", "400", "300", "200", "100"],
});

export default function Providers({ children }: PropsWithChildren) {
    return (
        <div className={roboto.className}>
            {children}
            <SpeedInsights />
            <Analytics />
        </div>
    );
}
