"use client";
import Image from "next/image";
import Card from "@/components/Card";
import Mocha from "@/public/home/mocha.png";
import CompEng from "@/public/home/compeng.jpg";
import { motion } from "framer-motion";
import Experience from "@/components/Experience";
import TechIcon from "@/components/TechIcon";
import CurrentlyPlaying from "@/components/CurrentlyPlaying";
import Golden from "@/components/Golden";
import { goldenPeople } from "@/data/goldenData";

export default function Home() {
    return (
        <>
            <div className="relative top-0 flex justify-center w-full h-[650px] md:h-[800px] lg:h-[650px] bg-rainbow-gradient animate-breathing-gradient mb-40 md:mb-80 lg:mb-32">
                <Card
                    variant="glass"
                    className="relative flex h-[950px] lg:h-[550px] w-11/12 md:w-[690px] lg:w-11/12 lg:max-w-[1100px] mt-44 flex-col lg:flex-row rounded-3xl"
                    motionProps={{
                        initial: { y: -20, opacity: 0 },
                        animate: { y: 0, opacity: 1 },
                        transition: { duration: 1 },
                    }}
                >
                    <div className="flex flex-wrap justify-center w-full h-full lg:w-1/2">
                        <Image
                            className="object-contain w-11/12 max-w-md mt-10 -mb-5 lg:mt-0 animate-fade-in"
                            src={Mocha}
                            alt="Mocha"
                        />
                    </div>
                    <div className="flex flex-col justify-center w-full h-full p-12 -mt-10 lg:w-1/2 lg:mt-0">
                        <h1 className="p-2 text-6xl font-black">BEN ZHOU</h1>
                        <h2 className="p-2 font-bold text-md">
                            UNIVERSITY OF WATERLOO COMPUTER ENGINEERING
                        </h2>
                        <p className="p-2 font-light">
                            I built and designed this website without any
                            previously built components using Next.js,
                            TypeScript, and Tailwind!
                        </p>
                        <p className="p-2 font-light">
                            Feel free to contact me at{" "}
                            <a
                                className="font-medium text-blue-500"
                                href="mailto:ben.zhou@uwaterloo.ca"
                            >
                                ben.zhou@uwaterloo.ca
                            </a>{" "}
                            or on{" "}
                            <a
                                className="font-medium text-blue-500"
                                href="https://www.linkedin.com/in/ben-zhou06/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                LinkedIn
                            </a>
                            !
                        </p>
                        <div className="flex mt-8 place-content-evenly">
                            <TechIcon
                                name="UofW"
                                image="https://i.imgur.com/qtXlwL6.png"
                                link="https://www.uwaterloo.ca/"
                                size="xl"
                            />
                            <TechIcon
                                name="NextJS"
                                image="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg"
                                link="https://nextjs.org/"
                                size="xl"
                            />
                            <TechIcon
                                name="TypeScript"
                                image="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"
                                link="https://www.typescriptlang.org/"
                                size="xl"
                            />
                            <TechIcon
                                name="TailwindCSS"
                                image="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg"
                                link="https://tailwindcss.com/"
                                size="xl"
                            />
                        </div>
                    </div>
                </Card>
            </div>

            <motion.div
                className="flex justify-center w-full py-2 md:mt-0 mt-[520px] overflow-hidden dark:text-[#ececec]"
                initial={{ x: 0, opacity: 0 }}
                whileInView={{ x: -10, opacity: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true, amount: 0.8 }}
            >
                <div className="flex w-11/12 lg:w-[1170px] md:flex-row flex-col">
                    <div className="flex flex-col items-start justify-center w-full h-full px-12 md:p-12 md:w-1/2">
                        <h4 className="p-2 font-medium uppercase text-md">
                            1B Computer Engineering Student
                        </h4>
                        <h2 className="p-2 text-3xl font-black md:text-5xl">
                            ABOUT ME
                        </h2>
                        <p className="p-2 pt-4 pb-4 font-light">
                            Hey&nbsp;—&nbsp;I&apos;m Ben, a Computer Engineering
                            student at the University of Waterloo. I love
                            turning ideas into practical software and hardware
                            that make our everyday lives a little easier.
                        </p>
                        <p className="p-2 pb-4 font-light">
                            I work with TypeScript, C++, and Python, and
                            I&apos;ve shipped projects with frameworks like
                            Next.js and Flask. Hackathons have taught me to
                            build, break, and ship fast&nbsp;— skills I bring to
                            every project.
                        </p>
                        <CurrentlyPlaying />
                    </div>
                    <div className="flex flex-col justify-center w-full h-full p-12 lg:p-12 md:w-1/2 lg:mb-0">
                        <Image
                            className="object-contain rounded-md shadow-md animate-fade-in"
                            width={489}
                            height={367}
                            src={CompEng}
                            alt="PCB Design Project"
                            loading="lazy"
                        />
                        <p className="p-2 font-light text-center">
                            The inside of a macroboard I completely designed and
                            built
                        </p>
                    </div>
                </div>
            </motion.div>
            <div className="flex justify-center w-full">
                <div className="w-10/12 lg:w-[1170px] h-[1px] bg-[#dddddd] dark:bg-[#121212]" />
            </div>
            <motion.div className="flex justify-center w-full py-2 mb-8 dark:text-[#ececec]">
                <div className="flex w-11/12 max-w-[1170px] flex-row py-8 px-1 md:px-10 lg:px-20">
                    <Experience />
                </div>
            </motion.div>
            <Golden people={goldenPeople} />
        </>
    );
}
