import { ProjectPreviewProps } from "@/types";

import bTagScript from "@/public/projects/bTagScript.png";
import PortfolioImage from "@/public/projects/Leg3ndaryPortfolio.png";
import APMC from "@/public/projects/APMC.png";
import Announcements from "@/public/projects/Announcements.png";
import FlashNotes from "@/public/projects/FlashNotes.png";
import Eureka from "@/public/projects/Eureka2024.png";
import Macroboard from "@/public/projects/Macroboard.png";
import BennyBot from "@/public/projects/bennybot.png";
import bTagScriptSphinx from "@/public/projects/btagscriptsphinx.png";
import RapidRx from "@/public/projects/RapidRx.png";
import GooseOnTheLoose from "@/public/projects/gooseontheloose.jpg";
import LinkCom from "@/public/projects/LinkCom.jpeg";
import StyleIt from "@/public/projects/styleit.jpg";
import Event from "@/public/projects/event.png";
import Hermes from "@/public/projects/hermes.png";

const projectPreviews: ProjectPreviewProps[] = [
    {
        image: {
            src: Hermes,
            alt: "Hermes",
            width: 900,
            height: 100,
        },
        title: "HERMES",
        sub: "AI VOICE AGENT PLATFORM",
        summary:
            "HopHacks platform for building, managing, and calling AI voice agents with Supabase + Next.js.",
        description: (
            <>
                Hermes is a modern platform for creating, managing, and calling
                AI voice agents. Built during HopHacks 2025, it leverages
                Next.js, Supabase for auth/data, and integrates
                telephony/runtime services alongside Google models. View the
                source on{" "}
                <a
                    href="https://github.com/benz206/hophacks2025"
                    target="_blank"
                    className="font-bold text-blue-500 transition-colors duration-1000 hover:text-orange-500"
                >
                    GitHub
                </a>
                .
            </>
        ),
        languages: ["Next.js", "TypeScript", "Tailwind", "Supabase"],
        projectLink: "https://github.com/benz206/hophacks2025",
        slug: "hermes-ai-voice-platform",
        color: "orange-500",
    },
    {
        image: {
            src: Event,
            alt: "Event Viewer",
            width: 900,
            height: 100,
        },
        title: "EVENT VIEWER",
        sub: "MULTI-FUNCTIONAL EVENT VIEWER",
        summary:
            "Hack the North challenge app for browsing, filtering, and sharing events with friends.",
        description: (
            <>
                For my Hack the North 2025 Frontend Application I was tasked
                with creating an event viewing app with a multitude of features
                and a clean UI. I used NextJS and TailwindCSS to create a
                responsive and fast website that would allow users to view
                events, sort them, and even share them with friends. To view
                private events you can use the hardcoded username and password,
                user: hacker, password: htn2025. You can check out the source
                code on{" "}
                <a
                    href="https://github.com/benz206/htn2025-challenge"
                    target="_blank"
                    className="font-bold text-blue-500 transition-colors duration-1000 hover:text-amber-500"
                >
                    GitHub
                </a>
                .
            </>
        ),
        languages: ["Next.js", "TypeScript", "Tailwind", "GraphQL"],
        projectLink: "https://ben-htn.netlify.app",
        slug: "event-viewer",
        color: "amber-500",
    },
    {
        image: {
            src: StyleIt,
            alt: "StyleIT",
            width: 900,
            height: 100,
        },
        title: "STYLEIT",
        sub: "REALTIME DRESSING ROOM",
        summary:
            "Realtime virtual dressing room that overlays outfits onto photos using Mediapipe.",
        description: (
            <>
                Shopping for clothes online shouldn’t be a gamble. With StyleIt,
                you can instantly try on outfits from anywhere on the web,
                giving you a real-time preview before you buy. Using smart image
                processing we first process any image of clothing to add to your
                wardrobe. Then using Mediapipe, our tool overlays clothing on
                your body, live on your laptop/phone, letting you mix, match,
                and explore global fashion trends—all from your screen. No more
                second-guessing your style choices! See StyleIt in action here:{" "}
                <a
                    href="https://www.youtube.com/watch?v=gZGXC4O2ZOE"
                    target="_blank"
                    className="font-bold text-blue-500 transition-colors duration-1000 hover:text-indigo-500"
                >
                    Watch the project in action!
                </a>
                .
            </>
        ),
        languages: ["Next.js", "TypeScript", "Tailwind", "MongoDB"],
        projectLink: "https://github.com/benz206/StyleIt",
        slug: "styleit",
        color: "indigo-500",
    },
    {
        image: {
            src: LinkCom,
            alt: "LinkCom",
            width: 900,
            height: 100,
        },
        title: "LINKCOM",
        sub: "BIDIRECTIONAL COMMUICATION DEVICE",
        summary:
            "Wireless IR communicator that keeps conversations accessible for hard-of-hearing users.",
        description: (
            <>
                In a world where staying connected is more important than ever,
                communication barriers shouldn’t hold anyone back. For
                hard-of-hearing individuals, everyday conversations can be
                challenging, whether it&apos;s ordering a coffee, catching an
                announcement, or simply chatting with a friend. That’s where
                LinkCom comes in—a wireless messaging system designed to make
                communication easy, intuitive, and accessible. With a sleek,
                user-friendly interface and real-time IR-based messaging,
                LinkCom ensures that no message gets lost in translation. Check
                out the project on{" "}
                <a
                    href="https://github.com/benz206/LinkCom"
                    target="_blank"
                    className="font-bold text-blue-500 transition-colors duration-1000 hover:text-teal-500"
                >
                    GitHub
                </a>
                .
            </>
        ),
        languages: ["C", "Git", "Embedded"],
        projectLink: "https://github.com/benz206/LinkCom",
        slug: "linkcom",
        color: "teal-500",
    },
    {
        image: {
            src: GooseOnTheLoose,
            alt: "Goose on the Loose",
            width: 900,
            height: 100,
        },
        title: "GOOSE ON THE LOOSE",
        sub: "HACK THE NORTH 2024 WINNER",
        summary:
            "Hack the North app turning Waterloo goose sightings into collectible study buddies.",
        description: (
            <>
                Amid the fast-paced rhythm of university life at Waterloo, one
                universal experience ties us all together: the geese. Whether
                you&apos;ve encountered them on your way to class, been woken up
                by honking at 7 am, or spent your days trying to bypass flocks
                of geese during nesting season, the geese have established
                themselves as a central fixture of the Waterloo campus. How can
                we turn the staple bird of the university into a asset? Inspired
                by the quintessential role the geese play in campus life, we
                built an app to integrate our feather friends into our academic
                lives. Our app, Goose on the Loose allows you to take pictures
                of geese around the campus and turn them into your study
                buddies! Instead of being intimidated by the foul fowl, we can
                now all be friends!
            </>
        ),
        languages: ["Next.js", "TypeScript", "MongoDB", "Google Cloud"],
        projectLink: "https://devpost.com/software/goosehunt",
        slug: "goose-on-the-loose",
        color: "rose-500",
    },
    {
        image: {
            src: RapidRx,
            alt: "RapidRx App",
            width: 900,
            height: 100,
            priority: true,
        },
        title: "RAPIDRX",
        sub: "RAPID DIAGNOSIS TOOL FOR SYMPTOMS",
        summary:
            "Rapid diagnosis assistant that triages symptoms and recommends next steps in seconds.",
        description: (
            <>
                RapidRx is a tool for rapid diagnosis based on user-inputted
                symptoms. The app suggests further questions, over-the-counter
                medications, homeopathic remedies, and common treatments, also
                providing a likely diagnosis. Users can track different symptom
                sets over time through multiple sessions. RapidRx reduces the
                time needed to find and book a doctor and mitigates risks from
                unreliable online searches, crucial for the 6 million Canadians
                without a family doctor. The app offers an efficient way to
                manage health concerns, saving time and providing peace of mind.
                You can view the project on{" "}
                <a
                    href="https://github.com/benz206/RapidRx"
                    target="_blank"
                    className="font-bold text-blue-500 transition-colors duration-1000 hover:text-fuchsia-400"
                >
                    GitHub
                </a>
                .
            </>
        ),
        languages: ["Next.js", "TypeScript", "Firebase", "Cloudflare Workers"],
        projectLink: "https://github.com/benz206/RapidRx",
        slug: "rapid-rx",
        color: "emerald-600",
    },
    {
        image: {
            src: Macroboard,
            alt: "Spotify Macroboard",
            width: 900,
            height: 100,
        },
        title: "SPOTIFY MACROBOARD",
        sub: "FULLY CUSTOM MACROBOARD FOR SPOTIFY",
        summary:
            "Wireless RGB macroboard with a custom PCB, OLED status panel, and Next.js companion UI.",
        description: (
            <>
                I designed and built and fully custom macroboard for Spotify, it
                has a translucent case, fully wireless capabilities, as well as
                smooth RGB lighting. Using EasyEDA I designed a PCB and had it
                printed out, I then soldered all of the components and
                programmed the board using C++. I also designed a custom case
                for the project as well as keycaps. The final project includes 7
                fully programmable keys, a 128x64 OLED screen. I also created an
                API to help port over information that I needed. This includes
                matching album covers with their respective overall colours to
                make an aesthetically pleasing experience. You can view the
                project on{" "}
                <a
                    href="https://github.com/benz206/SpotifyMacroboard"
                    target="_blank"
                    className="font-bold text-blue-500 transition-colors duration-1000 hover:text-fuchsia-400"
                >
                    GitHub
                </a>
                .
            </>
        ),
        languages: ["C++", "TypeScript", "Next.js", "Arduino"],
        projectLink: "https://github.com/benz206/SpotifyMacroboard",
        slug: "SpotifyMacroboard",
        color: "amber-400",
    },
    {
        image: {
            src: Eureka,
            alt: "EUREKAHACKS 2024",
            width: 900,
            height: 100,
            priority: false,
        },
        title: "EUREKAHACKS 2024",
        sub: "RESPONSIVE MODERN HACKATHON WEBSITE",
        summary:
            "Responsive hackathon marketing site with animated storytelling built in Next.js.",
        description: (
            <>
                As the lead director of web development for EurekaHACKS 2024, I
                was tasked with creating a modern and responsive website to
                attract attendees and sponsors. To make sure our department
                could collaborate effectively we used standard JavaScript along
                with Next.js to speed up some of our processes. Working with our
                Design team, I replicated and created layouts, while also
                creating animations and transitions to make the website more
                appealing. I also helped transfer domains and manage DNS records
                while also managing the production site using Netlify. You can
                view the site at{" "}
                <a
                    href="https://2024.eurekahacks.ca"
                    target="_blank"
                    className="font-bold text-blue-500 transition-colors duration-1000 hover:text-fuchsia-400"
                >
                    eurekahacks.ca
                </a>
                .
            </>
        ),
        languages: ["Next.js", "JavaScript", "Figma"],
        projectLink: "https://2024.eurekahacks.ca",
        slug: "eurekahacks-2024",
        color: "fuchsia-400",
    },
    {
        image: {
            src: FlashNotes,
            alt: "FlashNotes",
            width: 900,
            height: 100,
        },
        title: "FLASHNOTES",
        sub: "PROFESSIONAL AI VISION BASED NOTE SUMMARIZATION",
        summary:
            "AI vision tool that turns handwritten notes into organized flashcards with a polished Next.js UI.",
        description: (
            <>
                For a hackathon I led my team to create FlashNotes, a
                professional AI based note summarization/organization tool that
                would read handwritten notes and create flash cards based on
                their main concepts. Though I primarily focused on making a
                reactive and primarily aesthetic frontend, I also linked our API
                to our frontend code while also troubleshooting various issues
                we had when working with OpenAI&apos;s vision model. You can
                watch our project in action on{" "}
                <a
                    href="https://youtu.be/iBQgLgNp7AE"
                    target="_blank"
                    className="font-bold text-blue-500 transition-colors duration-1000 hover:text-orange-500"
                >
                    Youtube
                </a>
                . You can also view our winning project&apos;s submission on{" "}
                <a
                    href="https://devpost.com/software/flashnotes-i0cymh"
                    target="_blank"
                    className="font-bold text-blue-500 transition-colors duration-1000 hover:text-orange-500"
                >
                    DevPost
                </a>
                .
            </>
        ),
        languages: ["Next.js", "TypeScript", "Tailwind", "OpenAI"],
        projectLink: "https://github.com/benz206/flashnotes",
        slug: "flashnotes",
        color: "orange-500",
    },
    {
        image: {
            src: APMC,
            alt: "APHS Makers Competition",
            width: 900,
            height: 100,
        },
        title: "APHS MAKERS COMPETITION",
        sub: "CLUB WEBSITE USING NEXT.JS & TAILWIND",
        summary:
            "Club site with schedules, FAQs, and sponsor info built in Next.js and Tailwind.",
        description: (
            <>
                To continue practicing using Tailwind and Next.js, I made a
                static website containing lots of information about an upcoming
                competition we hosted. Though there are obviously better choices
                in terms of frameworks hosting static content, I wanted to
                continue using Next.js to improve my proficiency with the
                framework. I plan to add more features and submission functions
                to the website later on. You can view the site hosted by vercel
                at{" "}
                <a
                    href="https://apmc.vercel.app/"
                    target="_blank"
                    className="font-bold text-blue-500 transition-colors duration-1000 hover:text-purple-400"
                >
                    apmc.vercel.app
                </a>
                .
            </>
        ),
        languages: ["Next.js", "TypeScript", "Tailwind", "React"],
        projectLink: "https://apmc.vercel.app/",
        slug: "aphs-makers-competition",
        color: "purple-400",
    },
    {
        image: {
            src: bTagScript,
            alt: "BTAGSCRIPT PLAYGROUND",
            width: 900,
            height: 100,
        },
        title: "BTAGSCRIPT PLAYGROUND",
        sub: "DYNAMICALLY TYPED INTERPRETER AND DEBUGGER",
        summary:
            "Interpreter and web playground for the bTagScript templating language.",
        description: (
            <>
                I made an{" "}
                <a
                    className="font-bold text-blue-500 transition-colors hover:text-red-500"
                    href="https://github.com/benz206/bTagScript"
                    target="_blank"
                >
                    interpreter
                </a>{" "}
                and{" "}
                <a
                    className="font-bold text-blue-500 transition-colors hover:text-red-500"
                    href="https://benz206.github.io/bTagScriptPlayground/"
                    target="_blank"
                >
                    website
                </a>{" "}
                that allows you to run and debug a small improved string
                templating language that I made called bTagScript. Intrigued by
                the static language primarily made popular in the discord bot{" "}
                <a
                    className="font-bold text-blue-500 transition-colors hover:text-red-500"
                    href="https://carl.gg"
                    target="_blank"
                >
                    Carl-bot
                </a>
                , I thought I could not only make it better, but also enhance
                the development experience for this niche language. This
                language focuses on simplicity and quick programming for
                functions that may be tedious to program but simple in practice.
            </>
        ),
        languages: ["Python", "JavaScript", "HTML", "CSS"],
        projectLink: "https://benz206.github.io/bTagScriptPlayground/",
        slug: "btagscript-playground",
        color: "red-500",
    },
    {
        image: {
            src: bTagScriptSphinx,
            alt: "Sphinx Documentation",
            width: 500,
            height: 100,
        },
        title: "SPHINX EXTENSION",
        sub: "Custom extension for Sphinx",
        summary:
            "Custom Sphinx extension that adds syntax highlighting for bTagScript docs.",
        description: (
            <>
                After creating my own modified version of an interpreter with
                many new blocks and features, I wanted to create some
                documentation for the project. I ended up looking at using
                Sphinx, a documentation generator, to create a custom extension
                for my language. I then spent some time learning and figuring
                out how to add custom highlighting for my language and ended up
                creating a fun{" "}
                <a
                    href="https://github.com/benz206/tagscript-ansi"
                    target="_blank"
                    className="font-bold text-blue-500 transition-colors hover:text-yellow-400"
                >
                    extension
                </a>{" "}
                to use. You can view some of the documentation at{" "}
                <a
                    href="https://btagscript.readthedocs.io/en/latest/index.html"
                    target="_blank"
                    className="font-bold text-blue-500 transition-colors hover:text-yellow-400"
                >
                    bTagScript Documentation
                </a>
                .
            </>
        ),
        languages: ["Python", "HTML", "CSS", "Sphinx"],
        projectLink: "https://btagscript.readthedocs.io/en/latest/index.html",
        slug: "sphinx-extension",
        color: "yellow-400",
    },
    {
        image: {
            src: BennyBot,
            alt: "Benny Bot",
            width: 500,
            height: 100,
        },
        title: "BENNY BOT",
        sub: "Custom Discord Bot",
        summary:
            "Full-stack Discord bot with music playback, OCR, moderation, and custom commands.",
        description: (
            <>
                After learning more about Python and technologies overall I
                started integrating many different API&apos;s and libraries I
                found online into a discord bot. The final product was a bot
                able to play music from any Spotify Link, near instant image to
                text, as well as an AI based hurtful message detection system.
                The bot also implemented a custom command maker based on an
                interpreter I modified for my own custom language called
                bTagScript. Hosting the bot 24/7 also taught me a lot about
                Virtual Private Servers and Linux.
            </>
        ),
        languages: ["Python", "Discord API", "Linux"],
        projectLink: "https://github.com/benz206/Benny",
        slug: "benny-bot",
        color: "sky-600",
    },
    {
        image: {
            src: Announcements,
            alt: "School Announcements",
            width: 400,
            height: 100,
        },
        title: "SCHOOL ANNOUNCEMENTS",
        sub: "Automated School Announcement Forwarder",
        summary:
            "Discord bot that scrapes school announcements and pushes updates with subscriptions.",
        description: (
            <>
                Since our School Announcements are crudely added to a 96 page
                Google Document every day, I took it upon myself to make a
                better way of checking and viewing announcements through my
                phone. Using{" "}
                <a
                    className="font-bold text-blue-500 transition-colors hover:text-green-400"
                    href="https://discordpy.readthedocs.io/en/stable/"
                    target="_blank"
                >
                    Discord.py
                </a>{" "}
                as a UI, I made a bot that would scrape the entire document at
                regular intervals throughout the day. I then used regex to parse
                the document and send the announcements to a Discord channel. I
                also added a feature that would allow users to subscribe to the
                announcements list and therefore get notified whenever a new
                announcement is posted.
            </>
        ),
        languages: ["Python", "Google Cloud", "Discord API"],
        projectLink: "https://github.com/benz206/SchoolAnnouncements",
        slug: "school-announcements",
        color: "green-400",
    }
];

export default projectPreviews;
