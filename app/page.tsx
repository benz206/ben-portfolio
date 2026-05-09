import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import SpotifyTopSection from "@/components/home/SpotifyTopSection";
import ExperienceSection from "@/components/home/Experience";

export const metadata: Metadata = {
    alternates: {
        canonical: "/",
    },
    openGraph: {
        url: "/",
    },
};

export default function Home() {
    return (
        <>
            <HeroSection />
            <ExperienceSection />
            <SpotifyTopSection />
        </>
    );
}
