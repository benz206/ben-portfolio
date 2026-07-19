import type { StaticImageData } from "next/image";
import GrandCharter from "@/public/experience/grandcharter.jpeg";
import Fuego from "@/public/experience/fuego.webp";
import SAP from "@/public/experience/SAP.png";
import Eureka from "@/public/experience/Eureka.png";
import Waterloo from "@/public/home/waterloo.png";
import EightVC from "@/public/home/8vc.png";

export type Org = {
    role: string;
    name: string;
    logo?: StaticImageData;
    monogram?: string;
    accent: string;
    href?: string;
    fit?: "cover" | "contain";
};

export type BuildLine = {
    lead: string;
    highlight: string;
    tail: string;
    href?: string;
};

export const now: Org[] = [
    {
        role: "Engineering",
        name: "Grand Charter",
        logo: GrandCharter,
        accent: "167,139,250",
        href: "https://grandcharter.com",
    },
    {
        role: "Engineering Fellow",
        name: "8VC",
        logo: EightVC,
        accent: "212,212,216",
        href: "https://8vc.com",
    },
    {
        role: "Engineering",
        name: "University of Waterloo",
        logo: Waterloo,
        accent: "234,179,8",
        href: "https://uwaterloo.ca",
    },
];

export const building: BuildLine[] = [
    // {
    //     lead: "created ",
    //     highlight: "Crimex",
    //     tail: " — a real-time Halton crime map with heatmaps, clustering & live viewport queries",
    //     href: "https://halton-crime-production.up.railway.app/",
    // },
    // {
    //     lead: "built ",
    //     highlight: "Lattice",
    //     tail: " — hybrid retrieval (BM25 + embeddings + RRF) that grounds small models in long technical docs",
    // },
    // {
    //     lead: "made AI generation ",
    //     highlight: "17.7× faster",
    //     tail: " at Fuego (15.4s → 0.87s avg), cutting token cost by similar margins",
    // },
    // {
    //     lead: "led ",
    //     highlight: "EurekaHacks 2024",
    //     tail: " full-stack to 3,800+ impressions, 1,100+ clicks & +160% page load",
    // },
];

// previously
export const previously: Org[] = [
    {
        role: "Engineering",
        name: "Fuego",
        logo: Fuego,
        accent: "253,186,116",
        href: "https://fuego.io",
    },
    {
        role: "Software",
        name: "SAP",
        logo: SAP,
        accent: "96,165,250",
        fit: "contain",
        href: "https://www.sap.com",
    },
    {
        role: "Software",
        name: "EurekaHacks",
        logo: Eureka,
        accent: "248,113,113",
        href: "https://www.eurekahacks.ca",
    },
];
