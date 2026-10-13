# Ben Zhou — bzhou.ca

> Personal site of Ben Zhou, a software engineer who likes building elegant, efficient, and scalable software. Projects, writing, and photos.

This file is an overview for AI agents and LLMs reading the site. Everything below is public.

## About

- **Name:** Ben Zhou
- **Role:** Software Engineer
- **Currently:** Engineering at [Grand Charter](https://grandcharter.com) (New York, Sep 2025 – present); Engineering at the [University of Waterloo](https://uwaterloo.ca)
- **Previously:**
  - Engineering Fellow at [8VC](https://8vc.com/fellows/ben-zhou) (San Francisco, May 2026 – Aug 2026)
  - Engineering at [Fuego](https://fuego.io) (San Francisco, Jan 2025 – Apr 2025)
  - Software at [SAP](https://www.sap.com)
  - Software at [EurekaHacks](https://www.eurekahacks.ca)

## Links

- GitHub: https://github.com/benz206
- LinkedIn: https://www.linkedin.com/in/ben-zhou06/
- X: https://x.com/bennyz206

## Pages

- [Home](https://bzhou.ca/) — intro, recent roles, what Ben is listening to on Spotify
- [Projects](https://bzhou.ca/projects) — a collection of projects
- [Blog](https://bzhou.ca/blog) — posts about projects and experiences ([RSS feed](https://bzhou.ca/blog/feed.xml))
- [Gallery](https://bzhou.ca/gallery) — photos taken over the years
- [Sitemap](https://bzhou.ca/sitemap.xml)

## Featured projects

- **[Crimex](https://halton-crime-production.up.railway.app/)** — real-time Halton crime map with viewport-based queries, heatmaps, clustering, and Supabase auth. Next.js, TypeScript, MapLibre. [Source](https://github.com/benz206/crimex)
- **[Lattice](https://github.com/benz206/lattice)** — hybrid retrieval pipeline (BM25 + embeddings + reciprocal rank fusion) that grounds small models in long technical documents with cited evidence.
- **[Luminode](https://github.com/benz206/luminode)** — single-binary Rust WS2812B LED controller for a Raspberry Pi, auto-starting via systemd.

## Other projects

- **[Sentiment Analysis](https://benz-sentiment-analysis.streamlit.app/)** — Streamlit app running VADER sentiment over scraped Google News
- **[Hermes](https://github.com/benz206/hophacks2025)** — AI voice agent platform
- **[trace-moe](https://github.com/benz206/trace-moe)** — async anime scene search client
- **[Tag Vault](https://github.com/benz206/tag-vault)** — explorer for 35K+ custom scripts
- **[Event Viewer](https://ben-htn.netlify.app)** — multi-functional event viewer
- **[StyleIt](https://github.com/benz206/StyleIt)** — realtime dressing room
- **[LinkCom](https://github.com/benz206/LinkCom)** — bidirectional communication device
- **[Goose on the Loose](https://devpost.com/software/goosehunt)** — Hack the North 2024 winner
- **[RapidRx](https://github.com/benz206/RapidRx)** — rapid diagnosis tool for symptoms
- **[Spotify Macroboard](https://github.com/benz206/SpotifyMacroboard)** — fully custom macroboard for Spotify
- **[EurekaHacks 2024](https://2024.eurekahacks.ca)** — responsive hackathon website
- **[FlashNotes](https://github.com/benz206/flashnotes)** — AI vision-based note summarization
- **[APHS Makers Competition](https://apmc.vercel.app/)** — club website (Next.js, Tailwind)
- **[bTagScript Playground](https://benz206.github.io/bTagScriptPlayground/)** — dynamically typed interpreter and debugger
- **[Sphinx Extension](https://btagscript.readthedocs.io/en/latest/index.html)** — custom Sphinx extension for bTagScript docs
- **[Benny Bot](https://github.com/benz206/Benny)** — custom Discord bot
- **[School Announcements](https://github.com/benz206/SchoolAnnouncements)** — automated school announcement forwarder

## About this site

Built with Next.js (App Router), React, TypeScript, Tailwind CSS, Framer Motion, and GSAP. Blog posts are MDX pulled from [benz206/blog](https://github.com/benz206/blog). Hosted on Vercel.

## Notes for agents

- `/api/*` and `/admin` are not meant for crawling (see [robots.txt](https://bzhou.ca/robots.txt)).
- For the latest writing, prefer the RSS feed over scraping blog pages.
