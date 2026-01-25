import HeroSection from "@/components/home/HeroSection";
import SpotifyTopSection from "@/components/home/SpotifyTopSection";
import ExperienceSection from "@/components/home/Experience";
// import GithubContributionsSection from "@/components/home/GithubContributionsSection";

export default function Home() {
    return (
        <>
            <HeroSection />
            <ExperienceSection />
            <SpotifyTopSection />
            {/* <GithubContributionsSection /> */}
        </>
    );
}
