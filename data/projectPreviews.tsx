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
import TraceMoeImage from "@/public/projects/tracemoe.png";
import TagVaultImage from "@/public/projects/vault.png";
import CrimexImage from "@/public/projects/crimex.png";
import LatticeImage from "@/public/projects/lattice.png";
import LuminodeImage from "@/public/projects/luminode.png";
import SentimentImage from "@/public/projects/sentiment.png";

const projectPreviews: ProjectPreviewProps[] = [
    {
        image: {
            src: CrimexImage,
            alt: "Crimex",
            width: 900,
            height: 100,
        },
        featured: true,
        title: "CRIMEX",
        sub: "INTERACTIVE HALTON CRIME MAP",
        summary:
            "Real-time crime map for Halton with viewport-based queries, heatmaps, clustering, and Supabase auth.",
        description: (
            <>
                Crimex is an interactive map for exploring Halton Region
                incidents, built on Next.js and MapLibre with MapTiler basemaps
                and a public ArcGIS FeatureServer as the upstream data source.
                Incidents refresh on every map move, a heatmap mode renders
                density with adjustable radius and intensity, and a clustering
                layer collapses nearby points when zoomed out. The sidebar
                exposes filters for time range, municipality, and incident
                type, and Supabase powers optional auth and a profile view. You
                can try it live at{" "}
                <a
                    href="https://halton-crime-production.up.railway.app/"
                    target="_blank"
                    className="font-bold text-blue-500 transition-colors duration-1000 hover:text-cyan-500"
                >
                    halton-crime-production.up.railway.app
                </a>{" "}
                or read the source on{" "}
                <a
                    href="https://github.com/benz206/crimex"
                    target="_blank"
                    className="font-bold text-blue-500 transition-colors duration-1000 hover:text-cyan-500"
                >
                    GitHub
                </a>
                .
            </>
        ),
        languages: ["Next.js", "TypeScript", "Supabase", "MapLibre"],
        projectLink: "https://halton-crime-production.up.railway.app/",
        slug: "crimex",
        color: "cyan-500",
    },
    {
        image: {
            src: LatticeImage,
            alt: "Lattice",
            width: 900,
            height: 100,
        },
        featured: true,
        title: "LATTICE",
        sub: "EVIDENCE RETRIEVAL FOR LONG DOCS",
        summary:
            "Hybrid retrieval pipeline (BM25 + embeddings + RRF) that grounds small models in long technical documents.",
        description: (
            <>
                Lattice is a Next.js 16 App Router project that turns long PDFs
                into grounded, searchable evidence so smaller models can answer
                hard questions without trying to read a thousand pages at once.
                Documents are parsed with local <code>pdftotext</code>, split
                into section-aware chunks, embedded, and indexed alongside a
                BM25 lexical signal. Queries fuse both retrievers with
                reciprocal rank fusion, rerank for diversity, and feed the
                top-k passages to a local Qwen 2.5 1.5B model that must cite
                each claim with an <code>[E#]</code> marker — weak retrieval
                explicitly maps to a &quot;not enough evidence&quot; reply rather than a
                hallucinated answer. See the project on{" "}
                <a
                    href="https://github.com/benz206/lattice"
                    target="_blank"
                    className="font-bold text-blue-500 transition-colors duration-1000 hover:text-blue-400"
                >
                    GitHub
                </a>
                .
            </>
        ),
        languages: ["Next.js", "TypeScript", "BM25", "Embeddings"],
        projectLink: "https://github.com/benz206/lattice",
        slug: "lattice",
        color: "blue-500",
    },
    {
        image: {
            src: LuminodeImage,
            alt: "Luminode",
            width: 900,
            height: 100,
        },
        featured: true,
        title: "LUMINODE",
        sub: "RUST LED CONTROLLER FOR DORMS",
        summary:
            "Single-binary Rust WS2812B controller for a Raspberry Pi, auto-starting via systemd for dorm lighting.",
        description: (
            <>
                Luminode is a personalized dorm illumination project built
                around a Raspberry Pi driving WS2812B LED strips. It compiles
                down to a single native Rust binary — no Python, no venvs, no
                Cargo at boot — and runs as a managed systemd service so the
                lights come back automatically after a power cycle. Under the
                hood it leans on the Pi&apos;s PWM + DMA hardware on GPIO 18 to
                hold the tight WS2812B timing budget while staying easy on the
                CPU. There&apos;s a companion sync repo for coordinating animations
                across multiple nodes. View the source on{" "}
                <a
                    href="https://github.com/benz206/luminode"
                    target="_blank"
                    className="font-bold text-blue-500 transition-colors duration-1000 hover:text-pink-500"
                >
                    GitHub
                </a>
                .
            </>
        ),
        languages: ["Rust", "Raspberry Pi", "systemd", "Embedded"],
        projectLink: "https://github.com/benz206/luminode",
        slug: "luminode",
        color: "pink-500",
    },
    {
        image: {
            src: SentimentImage,
            alt: "Sentiment Analysis",
            width: 900,
            height: 100,
        },
        title: "SENTIMENT ANALYSIS",
        sub: "VADER + SCRAPED NEWS SENTIMENT",
        summary:
            "Streamlit app that scrapes Google News and runs VADER sentiment across any topic the user types in.",
        description: (
            <>
                A small data project that scrapes recent Google News articles
                for any user-provided topic, runs VADER sentiment on each
                headline and summary, and renders the results in a Streamlit
                dashboard with bar and pie distributions plus per-article
                drill-downs colored by sentiment. The app lets the user pick
                how many pages to scrape and exposes the raw VADER scores
                under expandable sections so the analysis is auditable rather
                than a black box. Try it at{" "}
                <a
                    href="https://benz-sentiment-analysis.streamlit.app/"
                    target="_blank"
                    className="font-bold text-blue-500 transition-colors duration-1000 hover:text-cyan-400"
                >
                    benz-sentiment-analysis.streamlit.app
                </a>{" "}
                or read the source on{" "}
                <a
                    href="https://github.com/benz206/sentiment-analysis"
                    target="_blank"
                    className="font-bold text-blue-500 transition-colors duration-1000 hover:text-cyan-400"
                >
                    GitHub
                </a>
                .
            </>
        ),
        languages: ["Python", "Streamlit", "VADER", "BeautifulSoup"],
        projectLink: "https://benz-sentiment-analysis.streamlit.app/",
        slug: "sentiment-analysis",
        color: "cyan-400",
    },
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
            src: TraceMoeImage,
            alt: "trace-moe",
            width: 900,
            height: 100,
        },
        title: "TRACE-MOE",
        sub: "ASYNC ANIME SCENE SEARCH CLIENT",
        summary:
            "Rust async wrapper around the trace.moe API with search, upload, and quota helpers.",
        description: (
            <>
                trace-moe is a Rust client for the trace.moe anime scene search
                API. It lets you search by image URL or upload bytes, optionally
                fetch AniList data, and check account quotas, all powered by
                Reqwest and Tokio. Explore the crate on{" "}
                <a
                    href="https://github.com/benz206/trace-moe"
                    target="_blank"
                    className="font-bold text-blue-500 transition-colors duration-1000 hover:text-violet-500"
                >
                    GitHub
                </a>
                .
            </>
        ),
        languages: ["Rust", "Reqwest", "Tokio"],
        projectLink: "https://github.com/benz206/trace-moe",
        slug: "trace-moe",
        color: "violet-500",
    },
    {
        image: {
            src: TagVaultImage,
            alt: "Tag Vault",
            width: 900,
            height: 100,
        },
        title: "TAG VAULT",
        sub: "35K+ CUSTOM SCRIPT EXPLORER",
        summary:
            "Realtime catalog for Carl-bot custom scripts with search, filters, and live usage stats.",
        description: (
            <>
                Tag Vault lets users browse, search, and favorite more than
                35,000 community-created Carl-bot scripts. Built with Next.js
                and MongoDB, it streams live metadata, tracks featured tags, and
                powers tagvault.netlify.app with fast filters and cached API
                responses. See the code on{" "}
                <a
                    href="https://github.com/benz206/tag-vault"
                    target="_blank"
                    className="font-bold text-blue-500 transition-colors duration-1000 hover:text-emerald-500"
                >
                    GitHub
                </a>
                .
            </>
        ),
        languages: ["Next.js", "TypeScript", "MongoDB", "Tailwind"],
        projectLink: "https://github.com/benz206/tag-vault",
        slug: "tag-vault",
        color: "emerald-500",
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
                and explore global fashion trends, all from your screen. No more
                second-guessing your style choices! See StyleIt in action here:{" "}
                <a
                    href="https://www.youtube.com/watch?v=gZGXC4O2ZOE"
                    target="_blank"
                    className="font-bold text-blue-500 transition-colors duration-1000 hover:text-violet-500"
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
                LinkCom comes in: a wireless messaging system designed to make
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
    },
];

export default projectPreviews;
