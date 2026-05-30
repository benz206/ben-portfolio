import type { Metadata } from "next";
import GoldenSection from "@/components/home/GoldenSection";

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
};

export default function ThanksPage() {
return <GoldenSection />;
}
