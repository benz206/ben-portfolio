import { PropsWithChildren } from "react";
import { Roboto } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const roboto = Roboto({
    subsets: ["latin"],
});

export default function Providers({ children }: PropsWithChildren) {
    return (
        <div>
            {children}
            <SpeedInsights />
            <Analytics />
        </div>
    );
}
