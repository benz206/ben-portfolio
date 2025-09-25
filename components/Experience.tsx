"use client";
import { motion, useInView } from "framer-motion";
import { StaticImageData } from "next/image";
import fuego from "@/public/experience/fuego.webp";
import SAP from "@/public/experience/SAP.png";
import Eureka from "@/public/experience/Eureka.png";
import Averroes from "@/public/experience/averroes.png";
// import Triway from "@/../public/experience/triway.png";
import WAT from "@/public/experience/wat_ai_logo.jpeg";
import Image from "next/image";
import MidnightSun from "@/public/experience/midnightsun.png";
import { useRef } from "react";
import GrandCharter from "@/public/experience/grandcharter.jpeg";

type Job = {
    title: string;
    company: string;
    description: string;
    date: string;
    image: {
        src: StaticImageData;
        alt: string;
        width?: number;
        height?: number;
        priority?: boolean;
    };
};

type JobProps = {
    job: Job;
    index: number;
};

// const container = {
//     hidden: { opacity: 1, scale: 0 },
//     visible: {
//         opacity: 1,
//         scale: 1,
//         transition: {
//             delayChildren: 0.3,
//             staggerChildren: 0.2,
//         },
//     },
// };

// const item = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//         y: 0,
//         opacity: 1,
//         transition: {
//             duration: 0.8,
//             ease: "easeOut",
//         },
//     },
// };

function Job({ job, index }: JobProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        once: true,
        margin: "-100px",
    });

    return (
        <motion.li
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.2 }}
            className="relative grid grid-cols-[4rem_auto] md:grid-cols-[10rem_auto] py-8 list-none group"
            key={index}
        >
            <div className="absolute left-0 w-2 h-full -ml-6 transition-opacity duration-300 rounded-full opacity-0 bg-rainbow-gradient animate-breathing-gradient group-hover:opacity-100" />
            <div className="flex items-center justify-center w-12 h-12 m-1 mt-4 overflow-hidden transition-transform duration-300 rounded-xl lg:my-auto md:m-2 lg:m-5 md:h-24 md:w-24 group-hover:scale-110">
                <Image
                    src={job.image.src}
                    alt={job.image.alt}
                    width={150}
                    height={150}
                    priority={job.image.priority}
                    className="object-contain w-auto h-full"
                />
            </div>
            <div className="flex flex-col justify-center">
                <span className="text-sm dark:text-[#ececec]">{job.date}</span>
                <h3 className="pt-2 text-xl font-black transition-colors duration-300 bg-clip-text lg:text-3xl group-hover:text-transparent bg-rainbow-gradient animate-breathing-gradient">
                    {job.title}
                </h3>
                <h4 className="py-2 text-lg font-medium transition-colors duration-300 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                    {job.company}
                </h4>
                <p className="dark:text-[#ececec] font-light">
                    {job.description}
                </p>
            </div>
        </motion.li>
    );
}

const jobs: Job[] = [
    {
        title: "Software Engineering Intern #7",
        company: "Grand Charter - New York, New York",
        description:
            "• Building cutting-edge tools and solutions for legal teams.",
        date: "Sep 2025",
        image: {
            src: GrandCharter,
            alt: "Grand Charter Logo",
            width: 150,
            height: 150,
        },
    },
    {
        title: "Software Engineering Intern",
        company: "Fuego.io - San Francisco, California",
        description:
            "• Optimized core AI generation features by developing custom architecture, accelerating response times to be 17.7x faster (15.4s → 0.87s avg), reducing token usage and slashing costs by similar margins",
        date: "Jan 2025 - Apr 2025",
        image: {
            src: fuego,
            alt: "Fuego.io Logo",
            width: 150,
            height: 150,
        },
    },
    {
        title: "Software Developer",
        company: "WAT.ai - AI Sentiment Pulse - Waterloo, Ontario",
        description:
            "• Created a webscraper using Python to extract and score 100+ articles on Yahoo News for overall sentiments",
        date: "May 2025 - Present",
        image: {
            src: WAT,
            alt: "WAT.ai Logo",
            width: 150,
            height: 150,
        },
    },
    {
        title: "Firmware Team Member",
        company: "Midnight Sun - Waterloo, Ontario",
        description:
            "• Developing ping testing functions in Python and C to verify connectivity across CAN networks",
        date: "Sep 2024 - Present",
        image: {
            src: MidnightSun,
            alt: "Midnight Sun Logo",
            width: 150,
            height: 150,
        },
    },
    {
        title: "Prototype Engineering Intern",
        company: "Averroes Technologies - Toronto, Ontario",
        description:
            "• Developed 12 firmware prototypes in C++ for iterative product validation",
        date: "Jul 2024 - Aug 2024",
        image: {
            src: Averroes,
            alt: "Averroes Technologies Logo",
            width: 150,
            height: 150,
        },
    },
    {
        title: "Software Developer Co-op Student",
        company: "SAP - Toronto, Ontario",
        description:
            "• Created a worker to handle and sanitize GPT-4o requests using TypeScript reducing request errors by 23%",
        date: "Feb 2024 - Jul 2024",
        image: {
            src: SAP,
            alt: "SAP Logo",
            width: 150,
            height: 150,
        },
    },
    {
        title: "FullStack Developer Lead",
        company: "EurekaHacks 2024 - Oakville, Ontario",
        description:
            "• Improved page load times by 160%, and reduced LCP, leading to 3,800+ impressions and 1,100+ clicks",
        date: "Nov 2023 - May 2024",
        image: {
            src: Eureka,
            alt: "Eureka Hacks Logo",
            width: 150,
            height: 150,
        },
    },
];

export default function Experience() {
    return (
        <div className="flex justify-center w-full">
            <div className="w-11/12 max-w-[1170px] relative">
                <ol className="relative flex flex-col justify-center">
                    {jobs.map((job, index) => (
                        <Job key={index} job={job} index={index} />
                    ))}
                </ol>
            </div>
        </div>
    );
}
