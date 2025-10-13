"use client";
import HeroSection from "@/components/home/HeroSection";
import OperatingCadenceSection from "@/components/home/AboutMe";
import ExperienceSection from "@/components/home/Experience";
import GoldenSection from "@/components/home/GoldenSection";

export default function Home() {
    return (
        <>
            <HeroSection />
            <OperatingCadenceSection />
            <ExperienceSection />
            <GoldenSection />
        </>
    );
}
