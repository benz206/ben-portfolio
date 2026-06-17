# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev        # Start dev server (Turbo mode)
bun run build      # Production build (runs next-sitemap postbuild)
bun run start      # Start production server
bun run lint       # ESLint
bun run format     # Prettier format all files
```

## Architecture Overview

**Stack:** Next.js App Router, React 19, TypeScript, TailwindCSS 4, Framer Motion, GSAP

### Content

Blog posts are fetched from an external GitHub repo (`benz206/blog`) via the GitHub API (`@octokit/rest`). The `utils/blog.ts` utility fetches `.mdx` files, parses YAML frontmatter with `gray-matter`, and uses commit history for created/updated dates. Posts are rendered server-side with `next-mdx-remote`. Revalidation is set to 3600s.

### External Integrations

- **Spotify**: Token refresh flow in `utils/functions/getSpotify.ts`. Currently playing and top tracks served via `/api/getCurrent` and `/api/getTop`. Color extracted from album art using `sharp` + a local quantizer in `utils/colorExtraction.ts`.
- **Cloudinary**: Image hosting via `next-cloudinary`. Remote patterns also allow `i.imgur.com`, `cdn.jsdelivr.net`, `i.scdn.co`.
- **Redis**: Fast view counters via `utils/redis.ts`. Global views at `views:global`, per-post at `views:post:[slug]`. Atomic increments via Lua script. Also backs presence (live viewer set).
- **MongoDB**: Detailed pageview event log via `utils/mongo.ts` (cached client) and `utils/pageview.ts`. Every pageview (initial load + SPA route change) is recorded as one document in the `portfolio.pageviews` collection with path, referrer/host, session, UTM params, Vercel geo headers (`x-vercel-ip-*`), parsed device/browser/OS, viewport, and a salted IP hash (raw IP never stored). `getAnalytics(days)` runs a single faceted aggregation for the admin dashboard. Complements Redis — does not replace the counters.

### API Routes

All under `app/api/`:

- `blog/public` — blog post list
- `getCurrent/public` — Spotify current track
- `getTop/public` — Spotify top tracks
- `views`, `views/[slug]` — view counting (GET/POST, rate-limited via `utils/rateLimit.ts`)
- `track` — POST-only ingest for detailed pageview events into MongoDB (fire-and-forget from `components/ViewCounter.tsx`, fails open)
- `analytics` — GET aggregated stats from MongoDB, gated by the `PASSWORD` env via the `x-admin-key` header (constant-time compare). Rendered by the `/admin` dashboard page.
- `getColor/[hash]` — dominant color extraction from images
- `status/cloudinary` — Cloudinary health check
- `presence` — presence/availability status

### Static Data

Hard-coded data lives in `data/`: experience history, project previews, golden records, memorial data. Edit these files directly to update those sections.

### Styling

TailwindCSS 4 with class-based dark mode. Custom `noir-*` gradient backgrounds defined in `tailwind.config.js`. Use `cn()` from `utils/cn.ts` (clsx + tailwind-merge) for conditional class names.

### Environment Variables

Defined in `environment.d.ts`:

- `SPOTIFY_CLIENTID`, `SPOTIFY_SECRET`, `SPOTIFY_REFRESHTOKEN`
- `BLOG_PAT` — GitHub PAT for blog repo
- `REDIS_URL`
- `MONGO_URL`, `MONGO_USER`, `MONGO_PASS` — MongoDB connection (URL is a bare host URI; user/pass applied as auth options; `MONGO_PASS` also salts the IP hash)
- `PASSWORD` — gates the `/admin` analytics dashboard and `/api/analytics`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

### Path Aliases

`@/*` maps to the repo root, so `@/components/...`, `@/utils/...`, `@/data/...`, etc.

### MDX Components

Custom MDX component mappings in `mdx-components.tsx`. MDX-specific styles in `styles/mdx.module.css`. The `components/mdx/` directory contains `MDXImage` and `ResponsiveTable` used in blog posts.
