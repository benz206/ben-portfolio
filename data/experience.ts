import type { StaticImageData } from "next/image";
import fuego from "@/public/experience/fuego.webp";
import SAP from "@/public/experience/SAP.png";
import Eureka from "@/public/experience/Eureka.png";
import Averroes from "@/public/experience/averroes.png";
import WAT from "@/public/experience/wat_ai_logo.jpeg";
import MidnightSun from "@/public/experience/midnightsun.png";
import GrandCharter from "@/public/experience/grandcharter.jpeg";
import type { AmbientVariant } from "@/components/AmbientGradient";

export type ExperienceJob = {
    title: string;
    company: string;
    location: string;
    period: string;
    description: string;
    image: {
        src: StaticImageData;
        alt: string;
        width?: number;
        height?: number;
        priority?: boolean;
    };
    ambientVariant?: AmbientVariant;
    locationClass?: string;
    periodClass?: string;
};

export const experienceJobs: ExperienceJob[] = [
    {
        title: "Software Engineering Intern",
        company: "Grand Charter",
        location: "New York",
        period: "Sep 2025 — Present",
        description:
            "• Building cutting-edge tools and solutions for legal teams.",
        image: {
            src: GrandCharter,
            alt: "Grand Charter Logo",
        },
        ambientVariant: "violet",
    },
    {
        title: "Software Engineering Intern",
        company: "Fuego.io",
        location: "San Francisco",
        period: "Jan 2025 — Apr 2025",
        description:
            "• Optimized core AI generation features by developing custom architecture, accelerating response times to be 17.7x faster (15.4s → 0.87s avg), reducing token usage and slashing costs by similar margins",
        image: {
            src: fuego,
            alt: "Fuego.io Logo",
        },
        ambientVariant: "tangerine",
        locationClass: "text-[rgba(255,196,158,0.9)]",
        periodClass: "text-[rgba(255,220,200,0.85)]",
    },
    // {
    //     title: "Software Developer",
    //     company: "WAT.ai - AI Sentiment Pulse",
    //     location: "Waterloo",
    //     period: "May 2025 — Dec 2025",
    //     description:
    //         "• Created a webscraper using Python to extract and score 100+ articles on Yahoo News for overall sentiments",
    //     image: {
    //         src: WAT,
    //         alt: "WAT.ai Logo",
    //     },
    //     ambientVariant: "emerald",
    // },
    // {
    //     title: "Firmware Team Member",
    //     company: "Midnight Sun",
    //     location: "Waterloo",
    //     period: "Sep 2024 — January 2025",
    //     description:
    //         "• Developing ping testing functions in Python and C to verify connectivity across CAN networks",
    //     image: {
    //         src: MidnightSun,
    //         alt: "Midnight Sun Logo",
    //     },
    //     ambientVariant: "sunset",
    // },
    // {
    //     title: "Prototype Engineering Intern",
    //     company: "Averroes Technologies",
    //     location: "Toronto",
    //     period: "Jul 2024 — Aug 2024",
    //     description:
    //         "• Developed 12 firmware prototypes in C++ for iterative product validation",
    //     image: {
    //         src: Averroes,
    //         alt: "Averroes Technologies Logo",
    //     },
    //     ambientVariant: "violet",
    // },
    {
        title: "Software Developer Co-op Student",
        company: "SAP",
        location: "Toronto",
        period: "Feb 2024 — Jul 2024",
        description:
            "• Created a worker to handle and sanitize GPT-4o requests using TypeScript reducing request errors by 23%",
        image: {
            src: SAP,
            alt: "SAP Logo",
        },
        ambientVariant: "blue",
        locationClass: "text-[rgba(170,210,255,0.9)]",
        periodClass: "text-[rgba(195,230,255,0.85)]",
    },
    {
        title: "FullStack Developer Lead",
        company: "EurekaHacks 2024",
        location: "Oakville",
        period: "Nov 2023 — May 2024",
        description:
            "• Improved page load times by 160%, and reduced LCP, leading to 3,800+ impressions and 1,100+ clicks",
        image: {
            src: Eureka,
            alt: "Eureka Hacks Logo",
        },
        ambientVariant: "sunset",
    },
];
