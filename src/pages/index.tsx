import Image from "next/image";
import Mocha from "@/../public/home/mocha.png";
// import Hockey from "@/../public/home/hockey.jpg";
import CompEng from "@/../public/home/compeng.jpg";
import { motion } from "framer-motion";
import Head from "next/head";
// import { FaArrowRight } from "react-icons/fa6";
// import Link from "next/link";
import Experience from "@/components/Experience";
import TechIcon from "@/components/TechIcon";
import CurrentlyPlaying from "@/components/CurrentlyPlaying";
// import Golden from "@/components/Golden";

export default function Home() {
    return (
        <>
            <Head>
                <title>Ben&apos;s Portfolio</title>
                <meta name="theme-color" content="#339ccd" />
                <meta property="og:title" content="Ben Z's Portfolio" />
                <meta
                    property="og:description"
                    content="Ben's Portfolio Website made with Next.js, TypeScript, and TailwindCSS."
                />
                <meta
                    property="description"
                    content="Ben's Portfolio Website made with Next.js, TypeScript, and TailwindCSS."
                />
                <meta
                    property="og:image"
                    content="https://i.imgur.com/6KdqAaf.png"
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://bzhou.ca" />
                <meta
                    name="description"
                    content="Ben Z's Portfolio site made with Next.js TypeScript, and TailwindCSS. View my projects and other relevant information about me!"
                />
            </Head>
            <div className="relative top-0 flex justify-center w-full h-[650px] md:h-[800px] lg:h-[650px] bg-rainbow-gradient animate-breathing-gradient mb-40 md:mb-80 lg:mb-32">
                <motion.div
                    className="relative flex h-[950px] lg:h-[550px] bg-white/80 dark:bg-[#121212]/30 backdrop-blur-md dark:text-[#ececec] border border-white/10 w-11/12 md:w-[690px] lg:w-11/12 lg:max-w-[1100px] drop-shadow-xl mt-44 rounded-3xl flex-col lg:flex-row hover:drop-shadow-2xl transition-all duration-1000 ease-in-out"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <div className="flex flex-wrap justify-center w-full h-full lg:w-1/2">
                        <Image
                            className="object-contain mt-10 -mb-5 w-11/12 max-w-md lg:mt-0 animate-fade-in"
                            src={Mocha}
                            alt="Mocha"
                        />
                    </div>
                    <div className="flex flex-col justify-center p-12 -mt-10 w-full h-full lg:w-1/2 lg:mt-0">
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
                        <div className="flex place-content-evenly mt-8">
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
                </motion.div>
            </div>

            {/* Currently Playing Section */}
            {/* <motion.div
                className="flex justify-center w-full py-8 dark:text-[#ececec]"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true, amount: 0.8 }}
            >
                
            </motion.div> */}

            <motion.div
                className="flex justify-center w-full py-2 md:mt-0 mt-[520px] overflow-hidden dark:text-[#ececec]"
                initial={{ x: 0, opacity: 0 }}
                whileInView={{ x: -10, opacity: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true, amount: 0.8 }}
            >
                <div className="flex w-11/12 lg:w-[1170px] md:flex-row flex-col">
                    <div className="flex flex-col justify-center items-start px-12 w-full h-full md:p-12 md:w-1/2">
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
                    <div className="flex flex-col justify-center p-12 w-full h-full lg:p-12 md:w-1/2 lg:mb-0">
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
            <div className="flex justify-center w-full">
                <div className="w-10/12 lg:w-[1170px] h-[1px] bg-[#dddddd] dark:bg-[#121212]" />
            </div>
            {/* <motion.div
                className="flex justify-center w-full py-2 pb-8 dark:text-[#ececec]"
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true, amount: 0.4 }}
            >
                <div className="flex w-11/12 max-w-[1170px] md:flex-row flex-col py-2">
                    <div className="flex flex-col justify-center w-full h-full p-12 -mb-[100px] md:w-1/2 lg:mb-0">
                        <Image
                            className="object-contain rounded-md animate-fade-in"
                            width={489}
                            height={626}
                            src={Hockey}
                            alt="Hockey"
                            loading="lazy"
                        />
                        <p className="p-2 font-light text-center">
                            My U16 Team at a tournament in Niagara, Ontario
                        </p>
                    </div>
                    <div className="flex flex-col justify-center p-12 w-full h-full md:w-1/2">
                        <h3 className="p-2 text-lg">ABOUT ME</h3>
                        <h2 className="p-2 text-3xl font-black md:text-5xl">
                            I ENJOY HOCKEY
                        </h2>
                        <h4 className="p-2 font-medium text-md">
                            TIER 2 PLAYER / ASSISTANT COACH
                        </h4>
                        <p className="p-2 pt-4 pb-4 font-light">
                            I&apos;ve been skating since before I can remember,
                            and started playing hockey when I was around 10. I
                            stopped playing competitively in my junior year to
                            help coach other teams and focus more on
                            programming.
                        </p>
                    </div>
                </div>
            </motion.div> */}
            {/* <Golden /> */}
        </>
    );
}
