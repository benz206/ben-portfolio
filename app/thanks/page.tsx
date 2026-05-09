import type { Metadata } from "next";
import GoldenSection from "@/components/home/GoldenSection";

export const metadata: Metadata = {
    title: "Thanks - Ben's Portfolio",
    description: "Golden records and acknowledgements.",
    alternates: {
        canonical: "/thanks",
    },
    openGraph: {
        title: "Thanks - Ben's Portfolio",
        description: "Golden records and acknowledgements.",
        url: "/thanks",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Thanks - Ben's Portfolio",
        description: "Golden records and acknowledgements.",
    },
};

export default function ThanksPage() {
    return <GoldenSection />;
}
