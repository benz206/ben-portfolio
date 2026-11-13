import { ProjectPreviewProps } from "@/types";

import CrimexImage from "@/public/projects/crimex.webp";
import UwpacImage from "@/public/projects/uwpac.webp";
import TagVaultImage from "@/public/projects/tagvault.webp";
import UwprofsImage from "@/public/projects/uwprofs.webp";
import LuminodeImage from "@/public/projects/luminode.webp";
import BennyImage from "@/public/projects/benny.webp";
import LatticeImage from "@/public/projects/lattice.webp";
import BTagScriptImage from "@/public/projects/btagscript.webp";
import TraceMoeImage from "@/public/projects/tracemoe.webp";
import HermesImage from "@/public/projects/hermes.webp";
import MacroboardImage from "@/public/projects/macroboard.webp";
import GooseOnTheLoose from "@/public/projects/gooseontheloose.jpg";
import FlashNotes from "@/public/projects/FlashNotes.png";
import Eureka from "@/public/projects/Eureka2024.png";
import LinkCom from "@/public/projects/LinkCom.jpeg";
import WidgetBoxImage from "@/public/projects/widgetbox.webp";

const linkClass =
    "font-semibold text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white";

const projectPreviews: ProjectPreviewProps[] = [
    {
        image: { src: CrimexImage, alt: "Crimex crime map of Halton Region" },
        tier: "featured",
        title: "Crimex",
        sub: "Halton crime map + prediction markets",
        summary:
            "A live map of every reported incident in Halton Region, plus a fake-money market for betting on what happens next.",
        highlights: [
            "Re-queries the police ArcGIS feed for whatever is in view, with heatmap and cluster modes",
            "Parimutuel prediction markets with daily cron settlement",
            "Filters by time range, municipality and incident type, plus address search",
        ],
        description:
            "Crimex is an interactive map for Halton Region incidents, built on Next.js and MapLibre with MapTiler basemaps. Incidents come from a public ArcGIS FeatureServer and refresh on every map move. A heatmap mode shows density with adjustable radius and intensity, and a clustering layer groups nearby points when zoomed out. The Markets and Predictions tabs let signed-in users bet fake money on incident outcomes through a parimutuel pool that settles on a daily cron, with Supabase handling auth and storage.",
        languages: ["Next.js", "TypeScript", "Supabase", "MapLibre"],
        projectLink: "https://crimexx.vercel.app/",
        sourceLink: "https://github.com/benz206/crimex",
        slug: "crimex",
        writeup: "Crimex",
        color: "#22d3ee",
    },
    {
        image: { src: UwpacImage, alt: "UW PAC day view with actual vs predicted occupancy" },
        tier: "featured",
        title: "UW PAC",
        sub: "Live gym occupancy for Waterloo",
        summary:
            "How busy are the PAC and CIF gyms right now, and how busy will they be later? Live headcounts next to a forecast for the rest of the day.",
        highlights: [
            "A Vercel cron scrapes Warrior occupancy every 30 minutes into Postgres",
            "Each day's crowd is plotted against the typical curve for that weekday, which doubles as the forecast",
            "Weekly heatmaps over the last 28 days or all time, cached with Next.js Cache Components",
        ],
        metric: { value: "6", label: "gym areas tracked every 30 minutes" },
        description:
            "UW PAC answers the question every Waterloo student asks before leaving for the gym. It scrapes the university's facility occupancy page every 30 minutes, stores each reading in Postgres, and rebuilds per-facility 7×24 averages in SQL. The live view compares each area to how it usually looks at this hour, the day view plots actual against predicted crowds, and the heatmap shows the busiest hours of the week. Cached data revalidates by tag right after each scrape, so pages stay fast without going stale.",
        languages: ["Next.js", "TypeScript", "Postgres", "Vercel"],
        projectLink: "https://uwpac.vercel.app",
        sourceLink: "https://github.com/benz206/uwpac",
        slug: "uwpac",
        writeup: "UWPAC",
        color: "#a78bfa",
    },
    {
        image: { src: TagVaultImage, alt: "Tag Vault home page" },
        tier: "featured",
        title: "Tag Vault",
        sub: "Searchable archive of Carl-bot tags",
        summary:
            "A searchable archive of community TagScript tags for Carl-bot, so you can find one that already works and copy it into your own server.",
        highlights: [
            "A companion scraper keeps a MongoDB mirror of public tags in sync",
            "Search plus featured, most-used and newest feeds, in list or grid view",
            "Discord sign-in for sharing your own tags publicly",
        ],
        metric: { value: "41,731", label: "tags archived" },
        description: (
            <>
                Tag Vault lets anyone browse, search and copy community-made
                Carl-bot tags. A separate scraper keeps a MongoDB mirror of
                public tags in sync, and the site serves it with fast search,
                curated feeds and Discord sign-in for sharing your own. Watch
                the{" "}
                <a
                    href="https://youtu.be/P9jHRgsxCpU"
                    target="_blank"
                    className={linkClass}
                >
                    demo on YouTube
                </a>
                .
            </>
        ),
        languages: ["Next.js", "TypeScript", "MongoDB", "Tailwind"],
        projectLink: "https://tagvault.netlify.app",
        sourceLink: "https://github.com/benz206/tag-vault",
        slug: "tag-vault",
        writeup: "TagVault",
        color: "#f472b6",
    },
    {
        image: { src: UwprofsImage, alt: "uwprofs insights scatter plot" },
        tier: "featured",
        title: "uwprofs",
        sub: "Waterloo professor stats",
        summary:
            "Salary history, student ratings and research impact for University of Waterloo professors, together on one profile.",
        highlights: [
            "Salary trajectories from 14 years of Ontario Sunshine List disclosures",
            "Student ratings and research metrics matched in by name",
            "An insights view that tests whether research output tracks with student ratings",
        ],
        metric: { value: "2011–2024", label: "of salary disclosures" },
        description:
            "uwprofs consolidates public records into a single profile per professor: their salary trajectory from Ontario's Public Sector Salary Disclosure, rank-by-rank pay expectations, RateMyProfessors ratings and research metrics. The insights page plots research impact against student rating across hundreds of professors to look for a correlation, and is upfront that name-matched rows can be wrong.",
        languages: ["Next.js", "TypeScript", "Tailwind"],
        projectLink: "https://uwprofs.vercel.app",
        sourceLink: "https://github.com/benz206/uwprofs",
        slug: "uwprofs",
        writeup: "uwprofs",
        color: "#f59e0b",
    },
    {
        image: { src: LuminodeImage, alt: "Dorm room lit by Luminode LED strips" },
        tier: "featured",
        title: "Luminode",
        sub: "Spotify-synced LEDs on a Raspberry Pi",
        summary:
            "Rust on a Raspberry Pi that lights my dorm room and locks 259 LEDs to the beat of whatever is playing on Spotify.",
        highlights: [
            "One native binary drives WS2812B strips through PWM + DMA and starts on boot with systemd",
            "An offline CLI decodes audio into compact beatmaps of beats, sections and cues",
            "A daemon keeps a monotonic clock in sync with Spotify and renders effects at 60 fps",
        ],
        metric: { value: "60 fps", label: "beat-locked lighting" },
        description:
            "Luminode started as a single Rust binary that drives WS2812B LED strips from a Raspberry Pi, using the Pi's PWM + DMA hardware on GPIO 18 to hold the strips' tight timing. Luminode Sync builds on it: a beatmap CLI analyses songs offline, and a daemon on the Pi polls Spotify, keeps a monotonic sync clock between polls, and fires effects on the beat across 259 LEDs.",
        languages: ["Rust", "Raspberry Pi", "Embedded", "systemd"],
        sourceLink: "https://github.com/benz206/luminode-sync",
        slug: "luminode",
        writeup: "Luminode",
        color: "#ec4899",
    },
    {
        image: { src: WidgetBoxImage, alt: "Widget Box new tab page with weather, markets, calendar and focus widgets" },
        tier: "featured",
        title: "Widget Box",
        sub: "Chrome new tab of widgets",
        summary:
            "A Chrome new tab page with an Unsplash photo, a big clock, a search box and a grid of small widgets you arrange yourself.",
        highlights: [
            "Drag widgets anywhere on a six-column grid in small, medium or large, with as many copies as you like",
            "Each widget declares its own settings fields, and the settings forms are generated from them",
            "No account, analytics or server: layout, notes and keys stay in the browser",
        ],
        metric: { value: "27", label: "widgets to pick from" },
        description:
            "Widget Box replaces Chrome's new tab with a photo from Unsplash, a clock, search and a grid of glanceable widgets: weather, air quality and moon phase for any city, market quotes, a focus timer, world clocks, notes, CPU and memory for this computer, Spotify now playing and more. It's a React and Vite Manifest V3 extension. Widgets fetch straight from the page and cache responses in localStorage, so a new tab doesn't refetch anything still fresh, and the saved layout is versioned and migrated on read. It's published on the Chrome Web Store.",
        languages: ["React", "TypeScript", "Vite", "Chrome Extension"],
        projectLink:
            "https://chromewebstore.google.com/detail/widget-box/ppokcfoigaijomaclaemoomjoeleaoak",
        sourceLink: "https://github.com/benz206/widget-box",
        slug: "widget-box",
        color: "#38bdf8",
    },
    {
        image: { src: BennyImage, alt: "Benny dashboard landing page" },
        title: "Benny",
        sub: "Discord bot + dashboard",
        summary:
            "A Discord bot rewritten in Rust, with a Next.js dashboard for configuring it per server.",
        description:
            "Benny began as a Python bot and is now a Rust rewrite on poise and serenity, with SQLite through SeaORM and an axum HTTP API. The dashboard covers moderation, automod, the Sentinel toxicity filter, leveling, starboard, giveaways and welcome messages, and previews messages exactly as Discord will render them. The bot token never reaches the browser: the dashboard calls the bot's API server-side.",
        languages: ["Rust", "Next.js", "TypeScript", "Discord API"],
        projectLink: "https://benny-dashboard.vercel.app",
        sourceLink: "https://github.com/benz206/benny-rs",
        slug: "benny-bot",
        writeup: "Benny",
        color: "#fb7185",
    },
    {
        image: { src: LatticeImage, alt: "Lattice hybrid evidence search results" },
        title: "Lattice",
        sub: "Evidence retrieval for long documents",
        summary:
            "Hybrid search over long PDFs that hands small models cited evidence instead of a thousand-page context.",
        description:
            "Lattice parses PDFs with pdftotext, keeping physical page numbers, and splits them into section-aware chunks. Every query runs BM25 and embedding search, fuses them with reciprocal rank fusion, and shows the hybrid, vector and lexical score behind each hit. The answer step sends only the top passages to an OpenRouter model that has to cite every claim, and weak retrieval returns “not enough evidence” instead of a guess.",
        languages: ["Next.js", "TypeScript", "BM25", "Embeddings"],
        sourceLink: "https://github.com/benz206/lattice",
        slug: "lattice",
        writeup: "Lattice",
        color: "#34d399",
    },
    {
        image: { src: BTagScriptImage, alt: "bTagScript Playground editor" },
        title: "bTagScript Playground",
        sub: "Browser IDE for TagScript",
        summary:
            "A web IDE for writing and debugging TagScript, running on my zero-dependency TypeScript engine.",
        description:
            "TagScript is the templating language behind Carl-bot's custom commands. The playground has an editor, a Discord-style output preview, an actions log, a variable debugger and seed values for the user, channel and target. It runs entirely in the browser on btagscript, my zero-dependency TypeScript port of the engine published on npm, and exports as static HTML for GitHub Pages.",
        languages: ["Next.js", "TypeScript", "Tailwind"],
        projectLink: "https://benz206.github.io/bTagScriptPlayground/",
        sourceLink: "https://github.com/benz206/bTagScriptPlayground",
        slug: "btagscript-playground",
        writeup: "bTagScriptPlayground",
        color: "#818cf8",
    },
    {
        image: { src: TraceMoeImage, alt: "trace-moe Rust code sample" },
        title: "trace-moe",
        sub: "Rust client for trace.moe",
        summary:
            "An async Rust client for the trace.moe anime scene search API, with 1,000+ downloads on crates.io.",
        description:
            "trace-moe wraps the trace.moe API: search by image URL or uploaded bytes, optionally pull AniList metadata, and check your quota, all on reqwest and tokio. Version 3.0 fixed image uploads that were returning HTTP 500.",
        languages: ["Rust", "Reqwest", "Tokio"],
        projectLink: "https://crates.io/crates/trace-moe",
        sourceLink: "https://github.com/benz206/trace-moe",
        slug: "trace-moe",
        writeup: "trace-moe",
        color: "#a78bfa",
    },
    {
        image: { src: HermesImage, alt: "Hermes landing page" },
        title: "Hermes",
        sub: "AI voice agents · HopHacks 2025",
        summary:
            "A platform for building, managing and calling AI voice agents, built at HopHacks 2025.",
        description:
            "Hermes is a platform for creating, managing and calling AI voice agents. We built it at HopHacks 2025 with Next.js and Supabase for auth and data, wired to telephony services and Google models.",
        languages: ["Next.js", "TypeScript", "Tailwind", "Supabase"],
        sourceLink: "https://github.com/benz206/hophacks2025",
        slug: "hermes-ai-voice-platform",
        writeup: "Hermes",
        color: "#fb923c",
    },
    {
        image: { src: MacroboardImage, alt: "Spotify Macroboard hardware" },
        title: "Spotify Macroboard",
        sub: "Wireless macro pad, custom PCB",
        summary:
            "A wireless RGB macro pad for Spotify with a custom PCB, OLED display and custom case.",
        description:
            "A wireless macro pad for controlling Spotify: seven programmable keys, a 128×64 OLED and RGB lighting in a translucent case. I designed the PCB in EasyEDA, soldered it, programmed it in C++, and designed the case and keycaps. A small API feeds it the dominant colour of the current album art so the lighting matches what's playing.",
        languages: ["C++", "Arduino", "TypeScript", "Next.js"],
        sourceLink: "https://github.com/benz206/SpotifyMacroboard",
        slug: "SpotifyMacroboard",
        color: "#fbbf24",
    },
    {
        image: { src: GooseOnTheLoose, alt: "Goose on the Loose" },
        tier: "archive",
        title: "Goose on the Loose",
        sub: "Hack the North 2024 winner",
        summary:
            "Photograph the geese around Waterloo's campus and turn them into collectible study buddies.",
        description:
            "Everyone at Waterloo has a goose story: the honking at 7 am, the detours around nesting season. Goose on the Loose turns that into something useful. Take a photo of a goose on campus and it becomes a study buddy you can collect, so the campus's most intimidating residents end up on your side.",
        languages: ["Next.js", "TypeScript", "MongoDB", "Google Cloud"],
        projectLink: "https://devpost.com/software/goosehunt",
        slug: "goose-on-the-loose",
        color: "#fb7185",
    },
    {
        image: { src: FlashNotes, alt: "FlashNotes" },
        tier: "archive",
        title: "FlashNotes",
        sub: "Hackathon winner",
        summary:
            "Reads handwritten notes with a vision model and turns them into flashcards.",
        description: (
            <>
                I led the team that built FlashNotes, which reads handwritten
                notes with OpenAI&apos;s vision model and turns their main
                concepts into flashcards. I built the frontend, connected it
                to our API, and worked through the vision model&apos;s quirks.
                Watch it on{" "}
                <a
                    href="https://youtu.be/iBQgLgNp7AE"
                    target="_blank"
                    className={linkClass}
                >
                    YouTube
                </a>{" "}
                or see the{" "}
                <a
                    href="https://devpost.com/software/flashnotes-i0cymh"
                    target="_blank"
                    className={linkClass}
                >
                    Devpost
                </a>
                .
            </>
        ),
        languages: ["Next.js", "TypeScript", "Tailwind", "OpenAI"],
        projectLink: "https://devpost.com/software/flashnotes-i0cymh",
        sourceLink: "https://github.com/benz206/flashnotes",
        slug: "flashnotes",
        color: "#fb923c",
    },
    {
        image: { src: Eureka, alt: "EurekaHACKS 2024 website" },
        tier: "archive",
        title: "EurekaHACKS 2024",
        sub: "Hackathon website, web lead",
        summary:
            "Led web development for the EurekaHACKS 2024 site, from layouts and animation to DNS.",
        description:
            "As director of web development for EurekaHACKS 2024, I built the site that attracted attendees and sponsors. I worked with our design team to turn their layouts into Next.js pages with animations and transitions, moved the domain, managed DNS, and ran the production site on Netlify.",
        languages: ["Next.js", "JavaScript", "Figma"],
        projectLink: "https://2024.eurekahacks.ca",
        slug: "eurekahacks-2024",
        color: "#f0abfc",
    },
    {
        image: { src: LinkCom, alt: "LinkCom hardware" },
        tier: "archive",
        title: "LinkCom",
        sub: "IR messaging for hard-of-hearing users",
        summary:
            "A wireless IR messaging device that makes everyday conversations accessible for hard-of-hearing people.",
        description:
            "Ordering a coffee or catching an announcement can be hard for hard-of-hearing people. LinkCom is a wireless messaging system that sends text over IR in real time, with a simple interface built for those everyday moments.",
        languages: ["C", "Embedded"],
        sourceLink: "https://github.com/benz206/LinkCom",
        slug: "linkcom",
        color: "#2dd4bf",
    },
];

export default projectPreviews;
