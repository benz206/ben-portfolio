import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import SpotifyTopSection from "@/components/home/SpotifyTopSection";
import ExperienceSection from "@/components/home/Experience";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
    alternates: {
        canonical: "/",
    },
    openGraph: {
        url: "/",
    },
};

const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ben Zhou",
    url: "https://bzhou.ca",
    jobTitle: "Software Engineer",
    sameAs: [
        "https://github.com/benz206",
        "https://www.linkedin.com/in/ben-zhou06/",
        "https://x.com/bennyz206",
    ],
    worksFor: {
        "@type": "Organization",
        name: "Grand Charter",
        url: "https://grandcharter.com",
    },
};

export default function Home() {
    return (
        <>
            <JsonLd data={personSchema} />
            <HeroSection />
            {/* <ExperienceSection /> */}
            <SpotifyTopSection />
        </>
    );
}
